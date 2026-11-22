import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readJsonBody, type EndpointHandler } from '../../src/server/api.ts';
import { startServer } from '../../src/server/server.ts';

const echoEndpoint: EndpointHandler = async (request, url) => {
  if (url.pathname === '/fail') throw new Error('Unexpected failure');
  if (request.method === 'POST') {
    return { status: 201, value: await readJsonBody(request) };
  }
  return { status: 200, value: { label: url.searchParams.get('label') } };
};

test('adapter reads query parameters and JSON and sends the endpoint status', async t => {
  const app = await startServer({ host: '127.0.0.1', port: 0 }, echoEndpoint);
  t.after(() => app.close());

  const query = await fetch(`${app.url}/echo?label=Solve+time`);
  assert.equal(query.status, 200);
  assert.equal(query.headers.get('content-type'), 'application/json');
  assert.equal(query.headers.get('cache-control'), 'no-store');
  assert.deepEqual(await query.json(), { label: 'Solve time' });

  const score = { player: 'Zoë', durationMs: 120_000 };
  const post = await fetch(`${app.url}/echo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(score),
  });
  assert.equal(post.status, 201);
  assert.deepEqual(await post.json(), score);
});

test('adapter reports malformed JSON and handler failures and keeps serving requests', async t => {
  const app = await startServer({ host: '127.0.0.1', port: 0 }, echoEndpoint);
  t.after(() => app.close());

  const malformed = await fetch(`${app.url}/echo`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"score":',
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: 'Malformed JSON' });

  const unexpected = await fetch(`${app.url}/fail`);
  assert.equal(unexpected.status, 500);
  assert.deepEqual(await unexpected.json(), { error: 'Internal server error' });

  const followUp = await fetch(`${app.url}/echo?label=Still+running`);
  assert.equal(followUp.status, 200);
  assert.deepEqual(await followUp.json(), { label: 'Still running' });
});
