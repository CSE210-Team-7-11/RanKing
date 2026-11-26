import type { IncomingMessage, RequestListener, ServerResponse } from 'node:http';
import { text } from 'node:stream/consumers';

interface EndpointResult {
  status: number;
  value: unknown;
  headers?: Record<string, string>;
}

export type EndpointHandler = (
  request: IncomingMessage,
  url: URL,
) => EndpointResult | Promise<EndpointResult>;

class MalformedJsonError extends Error {}

export async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const body = await text(request);
  try {
    return JSON.parse(body) as unknown;
  } catch (error) {
    throw new MalformedJsonError('Malformed JSON', { cause: error });
  }
}

export function sendJson(
  response: ServerResponse,
  status: number,
  value: unknown,
  headers?: Record<string, string>,
): void {
  const body = JSON.stringify(value) ?? 'null';
  response.writeHead(status, { ...headers, 'content-type': 'application/json' });
  response.end(body);
}

export function adaptEndpoint(handler: EndpointHandler): RequestListener {
  async function respond(request: IncomingMessage, response: ServerResponse): Promise<void> {
    try {
      const target = request.url ?? '/';
      const baseUrl = 'http://localhost';
      // A leading double slash is part of an HTTP path, even though URL resolution treats it as a host.
      const url = new URL(target.startsWith('/') ? baseUrl + target : target, baseUrl);
      const { status, value, headers } = await handler(request, url);
      sendJson(response, status, value, headers);
    } catch (error) {
      if (response.destroyed) return;
      if (response.headersSent) {
        response.destroy();
        return;
      }
      if (error instanceof MalformedJsonError) {
        sendJson(response, 400, { error: error.message });
      } else {
        sendJson(response, 500, { error: 'Internal server error' });
      }
    }
  }

  return (request, response) => {
    void respond(request, response);
  };
}
