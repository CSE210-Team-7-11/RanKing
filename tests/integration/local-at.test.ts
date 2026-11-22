import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'node:net';
import { once } from 'node:events';
import { startNetwork, rpc, testPassword, testAudience, testMethod } from '../../scripts/dev/network.ts';
import { verifyTestToken } from '../../scripts/dev/check-server.ts';

let network: Awaited<ReturnType<typeof startNetwork>>;
before(async () => { network = await startNetwork([0, 0, 0]); });
after(async () => { await network?.close(); });

test('both PDS accounts resolve through the local identity directory', async () => {
  const { accounts, plc } = network.config;
  assert.equal(accounts.length, 2);
  assert.notEqual(accounts[0]!.pds, accounts[1]!.pds);
  for (const account of accounts) {
    const response = await fetch(`${plc}/${account.did}`);
    assert.equal(response.status, 200);
    const doc = await response.json() as { id: string; service: { serviceEndpoint: string }[] };
    assert.equal(doc.id, account.did);
    assert.ok(doc.service.some(service => service.serviceEndpoint === account.pds));
  }
});

test('PDS-issued service tokens verify for the intended account and operation', async () => {
  for (const account of network.config.accounts) {
    const session = await rpc<{ accessJwt: string }>(account.pds, 'com.atproto.server.createSession', {
      identifier: account.handle, password: testPassword,
    });
    const getToken = async (aud = testAudience, lxm = testMethod) => {
      const response = await fetch(`${account.pds}/xrpc/com.atproto.server.getServiceAuth?${new URLSearchParams({ aud, lxm })}`, {
        headers: { authorization: `Bearer ${session.accessJwt}` },
      });
      assert.equal(response.status, 200);
      return (await response.json() as { token: string }).token;
    };
    const token = await getToken();
    const payload = await verifyTestToken(token, network.config);
    assert.equal(payload.iss, account.did);
    assert.equal(payload.aud, testAudience);
    await assert.rejects(verifyTestToken(await getToken('did:web:another.test'), network.config));
    await assert.rejects(verifyTestToken(await getToken(testAudience, 'app.ranking.test.other'), network.config));
    const [header, body, signature] = token.split('.');
    const changedSignature = `${signature![0] === 'A' ? 'B' : 'A'}${signature!.slice(1)}`;
    await assert.rejects(verifyTestToken(`${header}.${body}.${changedSignature}`, network.config));
  }
});

test('incorrect credentials fail without changing the seeded account', async () => {
  const account = network.config.accounts[0]!;
  await assert.rejects(rpc(account.pds, 'com.atproto.server.createSession', {
    identifier: account.handle, password: 'wrong-password',
  }));
  const session = await rpc<{ did: string }>(account.pds, 'com.atproto.server.createSession', {
    identifier: account.handle, password: testPassword,
  });
  assert.equal(session.did, account.did);
});

test('a partial startup failure releases ports and a restart creates fresh accounts', async () => {
  const reservations = [createServer(), createServer(), createServer()];
  const ports: number[] = [];
  const release = async (server: typeof reservations[number]) => {
    if (server.listening) await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  };
  let restarted: Awaited<ReturnType<typeof startNetwork>> | undefined;
  try {
    for (const server of reservations) {
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      assert.ok(address && typeof address !== 'string');
      ports.push(address.port);
    }
    await release(reservations[0]!);
    await release(reservations[1]!);
    // The second PDS collides after PLC and the first PDS have already started
    await assert.rejects(startNetwork(ports), { code: 'EADDRINUSE' });
    await release(reservations[2]!);
    restarted = await startNetwork(ports);
    const previousDid = restarted.config.accounts[0]!.did;
    await restarted.close();
    await restarted.close();
    restarted = await startNetwork(ports);
    assert.notEqual(restarted.config.accounts[0]!.did, previousDid);
  } finally {
    await restarted?.close();
    for (const server of reservations) await release(server);
  }
});
