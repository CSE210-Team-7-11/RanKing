import { createServer, type RequestListener } from 'node:http';

/** Start a local PDS HTTP server with login cookies that work over HTTP */
export function listenLocalPds(app: RequestListener, port: number) {
  return createServer((request, response) => {
    const setHeader = response.setHeader.bind(response);
    /* The provider sets Secure on login cookies even in devMode, so WebKit
     * rejects them on HTTP localhost. Remove Secure from these cookies so
     * local sign-in works in WebKit too
     * https://bugs.webkit.org/show_bug.cgi?id=232088
     */
    response.setHeader = (name, value) => {
      if (name.toLowerCase() === 'set-cookie') {
        const cookies: readonly string[] = typeof value === 'string' || typeof value === 'number' ? [String(value)] : value;
        value = cookies.map(cookie => /^(csrf-token|dev-id(?::hash)?|ses-id(?::hash)?)=/.test(cookie)
          ? cookie.replace(/;\s*Secure(?=;|$)/gi, '') : cookie);
      }
      return setHeader(name, value);
    };
    app(request, response);
  }).listen(port, '127.0.0.1');
}
