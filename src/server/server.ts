import { createServer } from 'node:http';
import { once } from 'node:events';

export interface ServerOptions {
  host: string;
  port: number;
}

/**
 * Start the app server
 * Use port 0 to choose a free port in tests
 * Returns the server URL and close() to stop it
 */
export async function startServer(options: ServerOptions) {
  const server = createServer((request, response) => {
    response.setHeader('content-type', 'application/json');
    response.setHeader('cache-control', 'no-store');
    if (request.method === 'GET' && request.url === '/api/health') {
      response.end(JSON.stringify({ status: 'ok' }));
    } else {
      response.statusCode = 404;
      response.end(JSON.stringify({ error: 'Not found' }));
    }
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
