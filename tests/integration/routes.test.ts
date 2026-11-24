import assert from 'node:assert/strict';
import { test, type TestContext } from 'node:test';
import { comparators } from '../../src/server/games.ts';
import { createApiHandler } from '../../src/server/routes.ts';
import { startServer } from '../../src/server/server.ts';
import { SqliteScoreStorage } from '../../src/server/storage/sqlite.ts';
import type { LeaderboardEntry, Score } from '../../src/server/storage/types.ts';

const puzzle = { gameId: 'sudoku', gameInfo: '2026-11-24' };

async function startFixture(t: TestContext) {
  const storage = new SqliteScoreStorage(':memory:', comparators);
  const app = await startServer({ host: '127.0.0.1', port: 0 }, createApiHandler(storage));
  t.after(async () => {
    try {
      await app.close();
    } finally {
      storage.close();
    }
  });
  return { storage, url: app.url };
}

function submit(url: string, body: unknown) {
  return fetch(`${url}/api/scores`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function leaderboard(url: string, overrides: Record<string, string> = {}) {
  const params = new URLSearchParams({ ...puzzle, start: '0', end: '10', ...overrides });
  return fetch(`${url}/api/leaderboard?${params}`);
}

test('score routes save attempts with server timestamps and return the paged puzzle leaderboard', async t => {
  const { storage, url } = await startFixture(t);
  const alice = await storage.createUser({ username: 'Alice', profilePicture: null });
  const bob = await storage.createUser({ username: 'Bob', profilePicture: null });
  const attempts = [
    { ...puzzle, userId: alice, value: 150 },
    { ...puzzle, userId: alice, value: 120 },
    { ...puzzle, userId: bob, value: 130 },
    { ...puzzle, userId: bob, value: 80, gameInfo: '2026-11-25' },
  ];
  for (const attempt of attempts) {
    const before = Date.now();
    const result = await submit(url, { ...attempt, submittedAt: '2000-01-01T00:00:00.000Z' });
    assert.equal(result.status, 201);
    const { submittedAt, ...saved } = await result.json() as Score;
    assert.deepEqual(saved, attempt);
    const timestamp = Date.parse(submittedAt);
    assert.ok(timestamp >= before && timestamp <= Date.now());
  }

  const response = await leaderboard(url);
  assert.equal(response.status, 200);
  const entries = await response.json() as LeaderboardEntry[];
  assert.deepEqual(entries.map(entry => [entry.user.username, entry.value]), [
    ['Alice', 120],
    ['Bob', 130],
  ]);
  const page = await leaderboard(url, { start: '1', end: '2' });
  assert.equal(page.status, 200);
  assert.deepEqual(await page.json(), entries.slice(1, 2));
  const emptyPage = await leaderboard(url, { start: '1', end: '1' });
  assert.equal(emptyPage.status, 200);
  assert.deepEqual(await emptyPage.json(), []);

  const health = await fetch(`${url}/api/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });
});

test('score routes reject invalid fields and unknown users before saving', async t => {
  const { storage, url } = await startFixture(t);
  const userId = await storage.createUser({ username: 'Alice', profilePicture: null });
  const attempt = { ...puzzle, userId, value: 120 };

  for (const body of [
    null,
    { ...attempt, userId: 1.5 },
    { ...attempt, value: '120' },
    { ...attempt, value: -1 },
    { ...attempt, gameId: 'unsupported' },
    { ...attempt, gameInfo: '2026-02-30' },
  ]) {
    const response = await submit(url, body);
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Invalid score submission' });
  }

  const missingUser = await submit(url, { ...attempt, userId: userId + 1 });
  assert.equal(missingUser.status, 404);
  assert.deepEqual(await missingUser.json(), { error: 'User not found' });
  const response = await leaderboard(url);
  assert.deepEqual(await response.json(), []);
});

test('leaderboard rejects unsupported games and invalid page bounds', async t => {
  const { url } = await startFixture(t);
  const invalidQueries: Record<string, string>[] = [
    { gameId: 'unsupported' },
    { gameInfo: '2026-02-30' },
    { start: '' },
    { start: '-1' },
    { end: '2.5' },
    { start: '3', end: '2' },
    { end: '9007199254740992' },
  ];
  for (const query of invalidQueries) {
    const response = await leaderboard(url, query);
    assert.equal(response.status, 400, JSON.stringify(query));
    await response.text();
  }
  const noPage = await fetch(`${url}/api/leaderboard?${new URLSearchParams(puzzle)}`);
  assert.equal(noPage.status, 400);
  await noPage.text();
});
