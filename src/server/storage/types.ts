export interface User {
  id: number; // Server-assigned incrementing integer
  username: string;
  profilePicture: string | null; // Profile picture color (later to be replaced with image URI)
}

export interface Score {
  userId: User['id'];
  value: number;
  submittedAt: string; // Server-assigned UTC ISO 8601 timestamp
  gameId: string;
  gameInfo: string; // Game-specific information. For sudoku, YYYY-MM-DD saying which puzzle was played
}

export interface LeaderboardQuery {
  gameId: Score['gameId'];
  gameInfo: Score['gameInfo'];
  start: number; // Inclusive, zero-based
  end: number; // Exclusive
}

export type LeaderboardEntry = Score & { user: User };
export type LeaderboardResponse = LeaderboardEntry[];

// Negative: a ranks ahead of b; positive: b ranks ahead of a; zero: tied
export type ScoreComparator = (a: Score, b: Score) => number;

export interface ScoreStorage {
  createUser(user: Omit<User, 'id'>): Promise<User['id']>;
  getUser(id: User['id']): Promise<User | null>;
  saveScore(score: Score): Promise<void>;
  getLeaderboard(query: LeaderboardQuery): Promise<LeaderboardEntry[]>;
}
