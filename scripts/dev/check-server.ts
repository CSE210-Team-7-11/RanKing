import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { formatDidVerificationMethod } from '@atproto/crypto';
import { verifyJwt } from '@atproto/xrpc-server';
import { testAudience, testMethod, type NetworkConfig } from './network.ts';

/**
 * Verify a local account's service token for the test request
 * Returns the verified payload or throws if verification fails
 */
export async function verifyTestToken(token: string, config: NetworkConfig) {
  return verifyJwt(token, testAudience, testMethod, async issuer => {
    if (!config.accounts.some(account => account.did === issuer)) throw new Error('Unknown test account');
    const response = await fetch(`${config.plc}/${encodeURIComponent(issuer)}`, {
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error('Unable to resolve test account');
    const document = await response.json() as {
      verificationMethod: { id: string; type: string; publicKeyMultibase: string }[];
    };
    const key = document.verificationMethod.find(method => method.id === '#atproto' || method.id === `${issuer}#atproto`);
    if (!key) throw new Error('Account signing key is missing');
    return formatDidVerificationMethod(key);
  });
}

/**
 * Start the OAuth test page and token verifier on the given loopback port
 * Returns the Vite server; call close() when finished
 * Throws if the port is unavailable
 */
export async function startCheckServer(config: NetworkConfig, port: number) {
  const server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('../../tests/fixtures/at-client/', import.meta.url)),
    server: { host: '127.0.0.1', port, strictPort: true },
    plugins: [{
      name: 'local-at-check',
      configureServer(vite) {
        vite.middlewares.use((request, response, next) => {
          if (request.url === '/network.json') {
            response.setHeader('content-type', 'application/json');
            response.setHeader('cache-control', 'no-store');
            response.end(JSON.stringify({ ...config, audience: testAudience, method: testMethod }));
          } else if (request.url === '/check' && request.method === 'POST') {
            const token = request.headers.authorization?.replace(/^Bearer /, '');
            if (!token) { response.statusCode = 401; response.end('Missing token'); return; }
            void verifyTestToken(token, config).then(payload => {
              response.setHeader('content-type', 'application/json');
              response.end(JSON.stringify({ did: payload.iss }));
            }, () => { response.statusCode = 401; response.end('Invalid test token'); });
          } else next();
        });
      },
    }],
  });
  try { await server.listen(); } catch (error) { await server.close(); throw error; }
  return server;
}
