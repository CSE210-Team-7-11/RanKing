import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import { createApiHandler } from '../../src/server/routes.ts';
import { startServer } from '../../src/server/server.ts';
import type { NewScore } from '../../src/shared/scores.ts';

const alice = { id: 3, username: 'Alice', profilePicture: null };
const bob = { id: 5, username: 'Bob', profilePicture: '#339955' };
const scorePath = '/api/v1/scores/sudoku/solve-time';
const submission = { userId: alice.id, value: 120, gameInfo: '2026-11-24' };

type RouteStorage = Parameters<typeof createApiHandler>[0];

async function startFixture(t: TestContext, overrides: Partial<RouteStorage> = {}) {
  const storage: RouteStorage = {
    getUser: async id => [alice, bob].find(user => user.id === id) ?? null,
    saveScore: async () => assert.fail('Unexpected saveScore call'),
    getLeaderboard: async () => assert.fail('Unexpected getLeaderboard call'),
    listUsers: async () => assert.fail('Unexpected listUsers call'),
    ...overrides,
  };
  const app = await startServer({ host: '127.0.0.1', port: 0 }, createApiHandler(storage));
  t.after(() => app.close());
  return app.url;
}

function submit(url: string, body: unknown, path = scorePath) {
  return fetch(url + path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('score submission uses path fields and returns its assigned ID and Location', async t => {
  const attempts: NewScore[] = [];
  const url = await startFixture(t, {
    saveScore: async score => {
      attempts.push(score);
      return 42;
    },
  });
  // Treat the score and gameInfo as game-defined values.
  const body = { ...submission, value: -4.5, gameInfo: 'round-a' };
  const response = await submit(url, {
    ...body,
    gameId: 'ignored',
    type: 'ignored',
    sid: 9,
    submittedAt: '2000-01-01T00:00:00.000Z',
  });
  assert.equal(response.status, 201);
  assert.equal(response.headers.get('location'), '/api/v1/scores?sid=42');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const [saved] = attempts;
  assert.ok(saved);
  assert.equal(new Date(saved.submittedAt).toISOString(), saved.submittedAt);
  assert.notEqual(saved.submittedAt, '2000-01-01T00:00:00.000Z');
  assert.deepEqual(saved, { ...body, gameId: 'sudoku', type: 'solve-time', submittedAt: saved.submittedAt });
  assert.deepEqual(await response.json(), { ...saved, sid: 42 });
});

test('score submission rejects invalid fields, unknown games, and unknown users', async t => {
  const url = await startFixture(t);
  for (const body of [
    null,
    { ...submission, userId: 1.5 },
    { ...submission, value: '120' },
    { ...submission, gameInfo: 4 },
  ]) {
    const response = await submit(url, body);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Invalid score submission' });
  }

  const game = await submit(url, submission, '/api/v1/scores/unknown/solve-time');
  assert.equal(game.status, 400);
  await game.json();
  const user = await submit(url, { ...submission, userId: 123 });
  assert.equal(user.status, 404);
  assert.deepEqual(await user.json(), { error: 'User not found' });
});

test('leaderboard forwards the game, score type, puzzle, and page and returns rows with score IDs', async t => {
  const entry = {
    ...submission,
    gameInfo: 'round-a',
    sid: 42,
    gameId: 'sudoku',
    type: 'solve-time',
    submittedAt: '2026-11-24T20:00:00.000Z',
    user: alice,
  };
  const url = await startFixture(t, {
    getLeaderboard: async query => {
      assert.deepEqual(query, { gameId: 'sudoku', type: 'solve-time', gameInfo: 'round-a', start: 1, end: 3 });
      return [entry];
    },
  });
  const response = await fetch(`${url}${scorePath}?gameInfo=round-a&start=1&end=3`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), [entry]);
});

test('the leaderboard and user list reject missing or invalid page bounds', async t => {
  const url = await startFixture(t);
  for (const query of [
    'end=2',
    'start=&end=2',
    'start=-1&end=2',
    'start=0&end=2.5',
    'start=3&end=2',
    'start=0&end=9007199254740992',
  ]) {
    const leaderboard = await fetch(`${url}${scorePath}?gameInfo=round-a&${query}`);
    assert.equal(leaderboard.status, 400, query);
    await leaderboard.json();
    const users = await fetch(`${url}/api/v1/users?${query}`);
    assert.equal(users.status, 400, query);
    await users.json();
  }
  const missingGameInfo = await fetch(`${url}${scorePath}?start=0&end=2`);
  assert.equal(missingGameInfo.status, 400);
  await missingGameInfo.json();
});

test('the demo can fetch a page of users and the Sudoku game record', async t => {
  const url = await startFixture(t, {
    listUsers: async ({ start, end }) => [alice, bob].slice(start, end),
  });
  const users = await fetch(`${url}/api/v1/users?start=1&end=2`);
  assert.equal(users.status, 200);
  assert.deepEqual(await users.json(), [bob]);
  const emptyPage = await fetch(`${url}/api/v1/users?start=1&end=1`);
  assert.equal(emptyPage.status, 200);
  assert.deepEqual(await emptyPage.json(), []);

  const game = await fetch(`${url}/api/v1/games/sudoku`);
  assert.equal(game.status, 200);
  assert.deepEqual(await game.json(), { id: 'sudoku', uri: '/sudoku.html' });
  const missing = await fetch(`${url}/api/v1/games/unknown`);
  assert.equal(missing.status, 404);
  await missing.json();

  const health = await fetch(`${url}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });
});
