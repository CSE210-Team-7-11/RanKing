import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { SqliteScoreStorage } from '../../src/server/storage/sqlite.ts';
import type { LeaderboardEntry, Score, ScoreComparator, User } from '../../src/server/storage/types.ts';

const lowerIsBetter: ScoreComparator = (a, b) => a.value - b.value;
const higherIsBetter: ScoreComparator = (a, b) => b.value - a.value;
const comparators = new Map([['sudoku', lowerIsBetter], ['points', higherIsBetter]]);
const board = { gameId: 'sudoku', gameInfo: '2026-11-21' };

let directory: string;
let path: string;
let storage: SqliteScoreStorage;

beforeEach(async () => {
  directory = await mkdtemp(join(tmpdir(), 'ranking-storage-'));
  path = join(directory, 'ranking.sqlite');
  storage = new SqliteScoreStorage(path, comparators);
});

afterEach(async () => {
  storage.close();
  await rm(directory, { recursive: true, force: true });
});

function score(userId: number, value: number, overrides: Partial<Score> = {}): Score {
  return { userId, value, submittedAt: '2026-11-21T12:00:00.000Z', ...board, ...overrides };
}

function entry(user: User, value: number, overrides: Partial<Score> = {}): LeaderboardEntry {
  return { ...score(user.id, value, overrides), user };
}

async function createUser(username: string, profilePicture: string | null = null): Promise<User> {
  return { id: await storage.createUser({ username, profilePicture }), username, profilePicture };
}

async function saveScores(...scores: Score[]): Promise<void> {
  for (const attempt of scores) await storage.saveScore(attempt);
}

/** Three players with several attempts each; best scores are b: 100, a: 150, c: 175 */
async function seedBoard() {
  const a = await createUser('a', '#00ff00');
  const b = await createUser('b');
  const c = await createUser('c');
  await saveScores(
    score(a.id, 300), score(a.id, 150), score(a.id, 200),
    score(b.id, 100),
    score(c.id, 250), score(c.id, 175),
  );
  return { a, b, c };
}

test('createUser assigns incrementing IDs that getUser resolves', async () => {
  const alice = await createUser('alice', '#ff0000');
  const bob = await createUser('bob');

  assert.equal(bob.id, alice.id + 1);
  assert.deepEqual(await storage.getUser(alice.id), alice);
  assert.deepEqual(await storage.getUser(bob.id), bob);
});

test('getUser returns null for an unknown ID', async () => {
  assert.equal(await storage.getUser(1), null);
});

test('users and attempts persist after the database is reopened', async () => {
  const alice = await createUser('alice', '#ff0000');
  await saveScores(score(alice.id, 120), score(alice.id, 90));
  storage.close();

  storage = new SqliteScoreStorage(path, comparators);
  assert.deepEqual(await storage.getUser(alice.id), alice);
  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 0, end: 10 }), [entry(alice, 90)]);
});

test('saveScore rejects an attempt for an unknown user', async () => {
  await assert.rejects(storage.saveScore(score(1, 100)), { code: 'ERR_SQLITE_ERROR' });
});

test('leaderboard has one entry per player, ranked by their best attempt', async () => {
  const { a, b, c } = await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 0, end: 10 }), [
    entry(b, 100), entry(a, 150), entry(c, 175),
  ]);
});

test('leaderboard returns the entries from start to end', async () => {
  const { a } = await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 1, end: 2 }), [entry(a, 150)]);
});

test('leaderboard returns an empty page past the last entry', async () => {
  await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 3, end: 5 }), []);
});

test('leaderboard excludes attempts from other games and puzzles', async () => {
  const { a, b, c } = await seedBoard();
  await saveScores(score(b.id, 50, { gameInfo: '2026-11-20' }), score(c.id, 10, { gameId: 'points' }));

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 0, end: 10 }), [
    entry(b, 100), entry(a, 150), entry(c, 175),
  ]);
});

test('leaderboard ranks with the comparator registered for the game', async () => {
  const a = await createUser('a');
  const b = await createUser('b');
  const points = { gameId: 'points', gameInfo: 'classic' };
  await saveScores(score(a.id, 10, points), score(a.id, 40, points), score(b.id, 30, points));

  assert.deepEqual(await storage.getLeaderboard({ ...points, start: 0, end: 10 }), [
    entry(a, 40, points), entry(b, 30, points),
  ]);
});

test('leaderboard rejects a game with no registered comparator', async () => {
  await assert.rejects(
    storage.getLeaderboard({ gameId: 'unknown', gameInfo: '2026-11-21', start: 0, end: 10 }),
    /No score comparator registered for game "unknown"/,
  );
});
