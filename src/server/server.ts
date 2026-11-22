import { createServer } from 'node:http';
import { once } from 'node:events';
import { adaptEndpoint, type EndpointHandler } from './api.ts';

export interface ServerOptions {
  host: string;
  port: number;
}

const handleRequest: EndpointHandler = (request, url) => {
  if (request.method === 'GET' && url.pathname === '/api/health') {
    return { status: 200, value: { status: 'ok' } };
  }
  return { status: 404, value: { error: 'Not found' } };
};

/**
 * Start the app server
 * Use port 0 to choose a free port in tests
 * Returns the server URL and close() to stop it
 */
export async function startServer(options: ServerOptions, endpoint: EndpointHandler = handleRequest) {
  const listener = adaptEndpoint(endpoint);
  const server = createServer((request, response) => {
    response.setHeader('cache-control', 'no-store');
    listener(request, response);
  });
  server.listen(options.port, options.host);
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Server has no TCP address');
  const host = address.family === 'IPv6' ? `[${address.address}]` : address.address;
  let closing: Promise<void> | undefined;
  return {
    url: `http://${host}:${address.port}`,
    close(): Promise<void> {
      return closing ??= new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => server.closeAllConnections(), 3_000);
        server.close(error => {
          clearTimeout(timeout);
          if (error) reject(error);
          else resolve();
        });
      });
    },
  };
}
