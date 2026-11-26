import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, test } from 'node:test';
import { SqliteScoreStorage } from '../../src/server/storage/sqlite.ts';
import type { LeaderboardEntry, NewScore, Score, ScoreComparator, User } from '../../src/server/storage/types.ts';

const lowerIsBetter: ScoreComparator = (a, b) => a.value - b.value;
const higherIsBetter: ScoreComparator = (a, b) => b.value - a.value;
const comparators = new Map([['sudoku', lowerIsBetter], ['points', higherIsBetter]]);
const board = { gameId: 'sudoku', gameInfo: '2026-11-21', type: 'time' };
const page = { start: 0, end: 10 };

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

function attempt(user: User, value: number, overrides: Partial<NewScore> = {}): NewScore {
  return { userId: user.id, value, submittedAt: '2026-11-21T12:00:00.000Z', ...board, ...overrides };
}

function entry(score: Score, user: User): LeaderboardEntry {
  return { ...score, user };
}

async function createUser(username: string, profilePicture: string | null = null): Promise<User> {
  return { id: await storage.createUser({ username, profilePicture }), username, profilePicture };
}

async function save(score: NewScore): Promise<Score> {
  return { ...score, sid: await storage.saveScore(score) };
}

/** Three players with several attempts each; best scores are b: 100, a: 150, c: 175 */
async function seedBoard() {
  const a = await createUser('a', '#00ff00');
  const b = await createUser('b');
  const c = await createUser('c');
  await save(attempt(a, 300));
  const aBest = await save(attempt(a, 150));
  await save(attempt(a, 200));
  const bBest = await save(attempt(b, 100));
  await save(attempt(c, 250));
  const cBest = await save(attempt(c, 175));
  return { first: entry(bBest, b), second: entry(aBest, a), third: entry(cBest, c) };
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

test('listUsers returns the requested page in ID order', async () => {
  const users = [await createUser('a'), await createUser('b'), await createUser('c')];

  assert.deepEqual(await storage.listUsers(page), users);
  assert.deepEqual(await storage.listUsers({ start: 1, end: 2 }), [users[1]]);
  assert.deepEqual(await storage.listUsers({ start: 3, end: 5 }), []);
});

test('users and attempts persist after the database is reopened', async () => {
  const alice = await createUser('alice', '#ff0000');
  await save(attempt(alice, 120));
  const best = await save(attempt(alice, 90));
  storage.close();

  storage = new SqliteScoreStorage(path, comparators);
  assert.deepEqual(await storage.getUser(alice.id), alice);
  assert.deepEqual(await storage.getLeaderboard({ ...board, ...page }), [entry(best, alice)]);
});

test('saveScore returns a distinct incrementing score ID for each attempt', async () => {
  const alice = await createUser('alice');
  const first = await storage.saveScore(attempt(alice, 120));
  const second = await storage.saveScore(attempt(alice, 120));

  assert.ok(Number.isSafeInteger(first));
  assert.equal(second, first + 1);
});

test('saveScore rejects an attempt for an unknown user', async () => {
  await assert.rejects(storage.saveScore(attempt({ id: 1, username: 'ghost', profilePicture: null }, 100)), {
    code: 'ERR_SQLITE_ERROR',
  });
});

test('leaderboard has one entry per player, ranked by their best attempt', async () => {
  const { first, second, third } = await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, ...page }), [first, second, third]);
});

test('leaderboard returns the entries from start to end', async () => {
  const { second } = await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 1, end: 2 }), [second]);
});

test('leaderboard returns an empty page past the last entry', async () => {
  await seedBoard();

  assert.deepEqual(await storage.getLeaderboard({ ...board, start: 3, end: 5 }), []);
});

test('leaderboard excludes attempts from other games, puzzles, and score types', async () => {
  const { first, second, third } = await seedBoard();
  const b = first.user;
  await save(attempt(b, 50, { gameInfo: '2026-11-20' }));
  await save(attempt(b, 40, { type: 'mistakes' }));
  await save(attempt(third.user, 10, { gameId: 'points' }));

  assert.deepEqual(await storage.getLeaderboard({ ...board, ...page }), [first, second, third]);
});

test('leaderboard ranks with the comparator registered for the game', async () => {
  const a = await createUser('a');
  const b = await createUser('b');
  const points = { gameId: 'points', gameInfo: 'classic', type: 'points' };
  await save(attempt(a, 10, points));
  const aBest = await save(attempt(a, 40, points));
  const bBest = await save(attempt(b, 30, points));

  assert.deepEqual(await storage.getLeaderboard({ ...points, ...page }), [entry(aBest, a), entry(bBest, b)]);
});

test('leaderboard rejects a game with no registered comparator', async () => {
  await assert.rejects(
    storage.getLeaderboard({ ...board, gameId: 'unknown', ...page }),
    /No score comparator registered for game "unknown"/,
  );
});
