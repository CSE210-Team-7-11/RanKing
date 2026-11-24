import type { Game, GameId } from './games.ts';
import type { PaginationQuery } from './pagination.ts';
import type { GameInfo, LeaderboardResponse, Score, ScoreId, ScoreType, User } from './scores.ts';

export interface ApiError {
  error: string;
}

/** Score selection after parsing the integer ID */
export interface ScoreLookupQuery {
  sid: ScoreId;
}

/** User route parameters after parsing the integer ID */
export interface UserPath {
  id: number;
}

export interface GamePath {
  gid: GameId;
}

export interface GameScoreTypePath extends GamePath {
  type: ScoreType;
}

export interface UserGamePath extends UserPath, GamePath {}

export interface UserGameScoreTypePath extends UserGamePath {
  type: ScoreType;
}

/** Leaderboard query parameters after parsing page bounds */
export interface LeaderboardQueryParameters extends PaginationQuery {
  gameInfo: GameInfo;
}

export interface CreateUserBody {
  username: string;

  /** Profile-picture color */
  profilePicture: string | null;
}

/** Omitted fields keep their stored values; null clears the profile-picture color */
export interface UpdateUserBody {
  username?: string;
  profilePicture?: string | null;
}

export interface CreateGameBody {
  id: GameId;

  /** Game entry-point URI used as the iframe src */
  uri: string;
}

/** Score submission with the game and score type supplied by the path */
export interface SubmitScoreBody {
  userId: number;
  value: number;
  gameInfo: GameInfo;
}

/** Score submission with the player and game supplied by the path */
export interface SubmitUserScoreBody {
  type: ScoreType;
  value: number;
  gameInfo: GameInfo;
}

/** Standings keyed by the game's score type, with page bounds applied to each array */
export type GameLeaderboardsResponse = Record<ScoreType, LeaderboardResponse>;

export type UserListResponse = User[];
export type GameListResponse = Game[];
export type UserScoresResponse = Score[];
