import type { Game } from '../shared/games.ts';
import type { SubmitScoreBody, UserListResponse } from '../shared/http-api.ts';
import type { PaginationQuery } from '../shared/pagination.ts';
import { readJsonBody, type EndpointHandler } from './api.ts';
import { comparators } from './games.ts';
import type { NewScore, ScoreStorage } from './storage/types.ts';

const scorePath = /^\/api\/v1\/scores\/([^/]+)\/([^/]+)$/;
const gamePath = /^\/api\/v1\/games\/([^/]+)$/;
const sudoku: Game = { id: 'sudoku', uri: '/sudoku.html' };

type ApiStorage = Pick<ScoreStorage, 'getUser' | 'saveScore' | 'getLeaderboard'> & {
  listUsers(page: PaginationQuery): Promise<UserListResponse>;
};

function decodePathSegment(segment: string): string | null {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

function parseScoreBody(body: unknown): SubmitScoreBody | null {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) return null;
  const { userId, value, gameInfo } = body as Record<string, unknown>;
  if (
    typeof userId !== 'number' || !Number.isSafeInteger(userId) || userId < 1 ||
    typeof value !== 'number' || !Number.isFinite(value) ||
    typeof gameInfo !== 'string'
  ) {
    return null;
  }
  return { userId, value, gameInfo };
}

function parsePageIndex(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const index = Number(value);
  return Number.isSafeInteger(index) ? index : null;
}

function parsePagination(params: URLSearchParams): PaginationQuery | null {
  const start = parsePageIndex(params.get('start'));
  const end = parsePageIndex(params.get('end'));
  return start === null || end === null || start > end ? null : { start, end };
}

const invalidPage = { status: 400, value: { error: 'Expected whole numbers with 0 <= start <= end' } };

export function createApiHandler(storage: ApiStorage): EndpointHandler {
  return async (request, url) => {
    if (request.method === 'GET' && url.pathname === '/api/v1/users') {
      const page = parsePagination(url.searchParams);
      return page === null ? invalidPage : { status: 200, value: await storage.listUsers(page) };
    }

    const [, gameSegment] = gamePath.exec(url.pathname) ?? [];
    if (request.method === 'GET' && gameSegment) {
      const gameId = decodePathSegment(gameSegment);
      if (gameId === null) return { status: 400, value: { error: 'Invalid game ID' } };
      if (gameId === sudoku.id) return { status: 200, value: sudoku };
      return { status: 404, value: { error: 'Game not found' } };
    }

    const [, scoreGameSegment, typeSegment] = scorePath.exec(url.pathname) ?? [];
    if (scoreGameSegment && typeSegment && (request.method === 'GET' || request.method === 'POST')) {
      const gameId = decodePathSegment(scoreGameSegment);
      const type = decodePathSegment(typeSegment);
      if (gameId === null || !comparators.has(gameId) || type === null) {
        return { status: 400, value: { error: 'Invalid game or score type' } };
      }

      if (request.method === 'POST') {
        const attempt = parseScoreBody(await readJsonBody(request));
        if (attempt === null) {
          return { status: 400, value: { error: 'Invalid score submission' } };
        }
        if (await storage.getUser(attempt.userId) === null) {
          return { status: 404, value: { error: 'User not found' } };
        }
        const score: NewScore = { ...attempt, gameId, type, submittedAt: new Date().toISOString() };
        const sid = await storage.saveScore(score);
        return {
          status: 201,
          headers: { location: `/api/v1/scores?sid=${sid}` },
          value: { ...score, sid },
        };
      }

      const gameInfo = url.searchParams.get('gameInfo');
      if (gameInfo === null) {
        return { status: 400, value: { error: 'Missing leaderboard gameInfo' } };
      }
      const page = parsePagination(url.searchParams);
      if (page === null) return invalidPage;
      const entries = await storage.getLeaderboard({ gameId, type, gameInfo, ...page });
      return { status: 200, value: entries };
    }

    return { status: 404, value: { error: 'Not found' } };
  };
}
