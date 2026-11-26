import type { GameId } from './games.ts';
import type { PaginationQuery } from './pagination.ts';

export type { GameId } from './games.ts';

export interface User {
  /** Server-assigned incrementing ID */
  id: number;
  username: string;

  /** Profile-picture color */
  profilePicture: string | null;
}

/** Game instance used to group scores. */
export type GameInfo = string;

/** Game-defined score measure, such as accuracy or clicks per second */
export type ScoreType = string;

/** Server-assigned integer identifying a stored score */
export type ScoreId = number;

/** A submitted game attempt */
export interface Score {
  sid: ScoreId;
  userId: User['id'];
  type: ScoreType;

  /** Score in units defined by the game */
  value: number;

  /** Server-assigned submission time in UTC ISO 8601 format */
  submittedAt: string;
  gameId: GameId;
  gameInfo: GameInfo;
}

/** Attempt ready for storage, before the server assigns its score ID */
export type NewScore = Omit<Score, 'sid'>;

export interface LeaderboardQuery extends PaginationQuery {
  gameId: GameId;
  gameInfo: GameInfo;
  type: ScoreType;
}

export type LeaderboardEntry = Score & { user: User };
export type LeaderboardResponse = LeaderboardEntry[];
