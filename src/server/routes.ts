import { readJsonBody, type EndpointHandler } from './api.ts';
import { comparators } from './games.ts';
import type { Score, ScoreStorage } from './storage/types.ts';

// Provisional paths for the MVP until the frontend contract is agreed.
const scorePath = '/api/scores';
const leaderboardPath = '/api/leaderboard';

function isValidGameInfo(gameId: string, gameInfo: unknown): gameInfo is string {
  if (typeof gameInfo !== 'string' || gameInfo.trim() === '') return false;
  if (gameId !== 'sudoku') return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(gameInfo)) return false;
  const timestamp = Date.parse(gameInfo);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === gameInfo;
}

function parseScore(body: unknown): Omit<Score, 'submittedAt'> | null {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return null;
  const { userId, value, gameId, gameInfo } = body as Record<string, unknown>;
  if (
    typeof userId !== 'number' || !Number.isSafeInteger(userId) || userId < 1 ||
    typeof value !== 'number' || !Number.isFinite(value) || value < 0 ||
    typeof gameId !== 'string' || !comparators.has(gameId) || !isValidGameInfo(gameId, gameInfo)
  ) {
    return null;
  }
  return { userId, value, gameId, gameInfo };
}

function parsePageIndex(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) ? index : null;
}

export function createApiHandler(storage: ScoreStorage): EndpointHandler {
  return async (request, url) => {
    if (request.method === 'POST' && url.pathname === scorePath) {
      const attempt = parseScore(await readJsonBody(request));
      if (attempt === null) {
        return { status: 400, value: { error: 'Invalid score submission' } };
      }
      if (await storage.getUser(attempt.userId) === null) {
        return { status: 404, value: { error: 'User not found' } };
      }
      const score = { ...attempt, submittedAt: new Date().toISOString() };
      await storage.saveScore(score);
      return { status: 201, value: score };
    }

    if (request.method === 'GET' && url.pathname === leaderboardPath) {
      const gameId = url.searchParams.get('gameId');
      const gameInfo = url.searchParams.get('gameInfo');
      if (gameId === null || !comparators.has(gameId) || !isValidGameInfo(gameId, gameInfo)) {
        return { status: 400, value: { error: 'Invalid leaderboard game or puzzle' } };
      }
      const start = parsePageIndex(url.searchParams.get('start'));
      const end = parsePageIndex(url.searchParams.get('end'));
      if (start === null || end === null || start > end) {
        return { status: 400, value: { error: 'Expected whole numbers with 0 <= start <= end' } };
      }
      const entries = await storage.getLeaderboard({ gameId, gameInfo, start, end });
      return { status: 200, value: entries };
    }

    return { status: 404, value: { error: 'Not found' } };
  };
}
