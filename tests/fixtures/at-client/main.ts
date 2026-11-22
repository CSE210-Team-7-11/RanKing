import { BrowserOAuthClient } from '@atproto/oauth-client-browser';

const output = document.querySelector<HTMLOutputElement>('#result')!;

/** Run the browser OAuth and verify its service token */
async function checkAuthentication() {
  const config = await (await fetch('/network.json')).json() as {
    plc: string;
    accounts: { handle: string; did: `did:plc:${string}`; pds: string }[];
    audience: string;
    method: string;
  };
  const scope = `atproto rpc:${config.method}?${new URLSearchParams({ aud: config.audience })}`;
  const clientId = `http://localhost?${new URLSearchParams({
    redirect_uri: `${location.origin}/`, scope,
  })}`;
  const client = await BrowserOAuthClient.load({
    clientId,
    allowHttp: true,
    plcDirectoryUrl: config.plc,
    handleResolver: {
      async resolve(handle: string) {
        const account = config.accounts.find(account => account.handle === handle);
        if (!account) throw new Error('Use a seeded local account');
        const response = await fetch(`${account.pds}/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`);
        if (!response.ok) throw new Error('Unable to resolve local handle');
        const data = await response.json() as { did: `did:plc:${string}` };
        return data.did;
      },
    },
  });
  for (const name of ['alice', 'bob']) {
    document.querySelector<HTMLButtonElement>(`#${name}`)!.onclick = () => {
      void client.signInRedirect(`${name}.test`, { scope }).catch(showError);
    };
  }
  const result = await client.init();
  if (!result) {
    for (const button of document.querySelectorAll('button')) button.disabled = false;
    output.dataset.state = 'ready';
    return;
  }
  const params = new URLSearchParams({ aud: config.audience, lxm: config.method });
  const response = await result.session.fetchHandler(`/xrpc/com.atproto.server.getServiceAuth?${params}`);
  if (!response.ok) throw new Error(`Service token: ${response.status} ${await response.text()}`);
  const { token } = await response.json() as { token: string };
  const verified = await fetch('/check', { method: 'POST', headers: { authorization: `Bearer ${token}` } });
  if (!verified.ok) throw new Error(`Verification: ${verified.status} ${await verified.text()}`);
  const { did } = await verified.json() as { did: string };
  output.dataset.did = did;
  output.dataset.state = 'verified';
}

/** Keep the failure details from the page for Playwright's error snapshot */
function showError(error: unknown) {
  output.dataset.state = 'failed';
  output.textContent = error instanceof Error ? error.message : String(error);
}

void checkAuthentication().catch(showError);
