import { once } from 'node:events';
import { mkdir, mkdtemp, rm } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomBytes } from 'node:crypto';
import { listenLocalPds } from './local-http.ts';

export const testPassword = 'ranking-local-test-password';
export const testAudience = 'did:web:ranking.test#ranking_test';
export const testMethod = 'app.ranking.test.check';

export interface TestAccount {
  handle: string;
  did: string;
  pds: string;
}

export interface NetworkConfig {
  plc: string;
  accounts: TestAccount[];
}

/** Find a free loopback port, releasing it before returning the port number */
async function availablePort(): Promise<number> {
  const server = createServer();
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('No TCP port allocated');
  await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  return address.port;
}

/**
 * Send a JSON request to a local PDS method and return the parsed response
 * Throws on request failure, a non-OK response, or invalid JSON
 */
export async function rpc<T>(pds: string, method: string, body: object): Promise<T> {
  const response = await fetch(`${pds}/xrpc/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`${method}: ${response.status} ${await response.text()}`);
  return await response.json() as T;
}

/**
 * Start the local AT network with two test accounts
 * Takes three ports in PLC, first PDS, second PDS order; use 0 to pick a free port
 * Returns the account and service config, plus close() to stop the network
 * Cleans up services and temporary files on close or startup failure
 */
export async function startNetwork(ports = [2582, 2583, 2584]) {
  if (ports.length !== 3 || ports.some(port => !Number.isInteger(port) || port < 0 || port > 65535)) {
    throw new Error('Provide three valid TCP ports for PLC and the two PDS instances');
  }
  process.env.LOG_ENABLED ??= 'false';
  const [{ PDS }, plc, { Secp256k1Keypair }] = await Promise.all([
    import('@atproto/pds'), import('@did-plc/server'), import('@atproto/crypto'),
  ]);
  const directory = await mkdtemp(join(tmpdir(), 'ranking-at-'));
  const services: { destroy(): Promise<void> }[] = [];
  let closed = false;
  const close = async () => {
    if (closed) return;
    closed = true;
    const failures: unknown[] = [];
    for (const service of services.reverse()) {
      try { await service.destroy(); } catch (error) {
        if (!(error instanceof Error && 'code' in error && error.code === 'ERR_SERVER_NOT_RUNNING')) failures.push(error);
      }
    }
    await rm(directory, { recursive: true, force: true });
    if (failures.length) throw new AggregateError(failures, 'Could not stop all AT services');
  };

  try {
    const selectedPorts: number[] = [];
    for (const port of ports) selectedPorts.push(port || await availablePort());
    const [plcPort, ...pdsPorts] = selectedPorts;
    const plcUrl = `http://localhost:${plcPort}`;
    /* Reset PLC and PDS data together so PDS accounts always have matching
     * identities in the directory
     */
    const directoryServer = plc.PlcServer.create({ db: plc.Database.mock(), port: plcPort });
    const listenDirectory = directoryServer.app.listen.bind(directoryServer.app);
    directoryServer.app.listen = ((port: number) => listenDirectory(port, '127.0.0.1')) as typeof directoryServer.app.listen;
    services.push(directoryServer);
    await directoryServer.start();

    const accounts: TestAccount[] = [];
    for (const [index, port] of pdsPorts.entries()) {
      const folder = join(directory, String(index));
      await mkdir(folder);
      const key = await Secp256k1Keypair.create({ exportable: true });
      const pds = await PDS.fromEnv({
        devMode: true,
        hostname: 'localhost',
        port,
        serviceDid: `did:web:localhost%3A${port}`,
        dataDirectory: folder,
        blobstoreDiskLocation: join(folder, 'blobs'),
        didPlcUrl: plcUrl,
        plcRotationKeyK256PrivateKeyHex: Buffer.from(await key.export()).toString('hex'),
        jwtSecret: randomBytes(32).toString('hex'),
        adminPassword: randomBytes(24).toString('hex'),
        inviteRequired: false,
        serviceHandleDomains: ['.test'],
        crawlers: [],
        rateLimitsEnabled: false,
      });
      /* The SDK starts listening without a bind address, so override listen()
       * to keep the local PDS on loopback
       */
      pds.app.listen = ((port: number) => listenLocalPds(pds.app, port)) as typeof pds.app.listen;
      services.push(pds);
      await pds.start();
      const url = `http://localhost:${port}`;
      const handle = index === 0 ? 'alice.test' : 'bob.test';
      const account = await rpc<{ did: string }>(url, 'com.atproto.server.createAccount', {
        handle, email: `${handle}@example.test`, password: testPassword,
      });
      accounts.push({ handle, did: account.did, pds: url });
    }
    return { config: { plc: plcUrl, accounts } satisfies NetworkConfig, close };
  } catch (error) {
    try { await close(); } catch (cleanupError) {
      throw new AggregateError([error, cleanupError], 'AT startup and cleanup failed', { cause: cleanupError });
    }
    throw error;
  }
}
