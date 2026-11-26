import type { PaginationQuery } from '../../shared/pagination.ts';
import type { LeaderboardEntry, LeaderboardQuery, NewScore, Score, ScoreId, User } from '../../shared/scores.ts';

export type {
  LeaderboardEntry,
  LeaderboardQuery,
  LeaderboardResponse,
  NewScore,
  Score,
  ScoreId,
  User,
} from '../../shared/scores.ts';

/**
 * Compare scores in leaderboard order
 *
 * @returns A negative value when a ranks ahead of b, a positive value when b ranks ahead,
 * or zero for a tie
 */
export type ScoreComparator = (a: Score, b: Score) => number;

export interface ScoreStorage {
  /** Create a user and return their assigned ID */
  createUser(user: Omit<User, 'id'>): Promise<User['id']>;

  /**
   * Look up a user by ID
   *
   * @returns The stored user, or null if the ID is unknown
   */
  getUser(id: User['id']): Promise<User | null>;

  /** List the requested page of users in ID order */
  listUsers(page: PaginationQuery): Promise<User[]>;

  /** Save one attempt and return its assigned score ID, retaining earlier attempts */
  saveScore(score: NewScore): Promise<ScoreId>;

  /**
   * Read standings for one game instance
   *
   * @returns The requested page of each player's best score and user details, ordered by the
   * game's comparator. Empty pages return an empty array. Ties may appear in any order
   */
  getLeaderboard(query: LeaderboardQuery): Promise<LeaderboardEntry[]>;
}
