export interface User {
  /** Server-assigned incrementing ID */
  id: number;
  username: string;

  /** Profile-picture color */
  profilePicture: string | null;
}

/** A submitted game attempt */
export interface Score {
  userId: User['id'];

  /** Score in units defined by the game */
  value: number;

  /** Server-assigned submission time in UTC ISO 8601 format */
  submittedAt: string;
  gameId: string;

  /** Game instance used to group scores. Sudoku uses its puzzle date, formatted as YYYY-MM-DD */
  gameInfo: string;
}

export interface LeaderboardQuery {
  gameId: Score['gameId'];
  gameInfo: Score['gameInfo'];

  /** Index of the first entry to return, zero-based and inclusive */
  start: number;

  /** Index at which to stop, exclusive */
  end: number;
}

export type LeaderboardEntry = Score & { user: User };
export type LeaderboardResponse = LeaderboardEntry[];
