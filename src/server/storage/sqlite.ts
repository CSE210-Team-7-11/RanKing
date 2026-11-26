/* eslint-disable @typescript-eslint/require-await --
   node:sqlite is synchronous; async keeps the ScoreStorage contract and turns SQLite errors into rejections */
import { DatabaseSync, type StatementSync } from 'node:sqlite';
import type { PaginationQuery } from '../../shared/pagination.ts';
import type {
  LeaderboardEntry, LeaderboardQuery, NewScore, Score, ScoreComparator, ScoreId, ScoreStorage, User,
} from './types.ts';

type BoardRow = Score & Omit<User, 'id'>;

function toEntry({ username, profilePicture, ...score }: BoardRow): LeaderboardEntry {
  return { ...score, user: { id: score.userId, username, profilePicture } };
}

const schema = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    profile_picture TEXT
  ) STRICT;

  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users (id),
    type TEXT NOT NULL,
    value REAL NOT NULL,
    submitted_at TEXT NOT NULL,
    game_id TEXT NOT NULL,
    game_info TEXT NOT NULL
  ) STRICT;

  CREATE INDEX IF NOT EXISTS scores_by_board ON scores (game_id, game_info, type);
`;

/**
 * Score storage backed by a SQLite file
 * Creates its tables on first open; comparators rank scores per game ID
 */
export class SqliteScoreStorage implements ScoreStorage {
  readonly #database: DatabaseSync;
  readonly #comparators: ReadonlyMap<string, ScoreComparator>;
  readonly #insertUser: StatementSync;
  readonly #selectUser: StatementSync;
  readonly #selectUsers: StatementSync;
  readonly #insertScore: StatementSync;
  readonly #selectBoard: StatementSync;

  constructor(path: string, comparators: ReadonlyMap<string, ScoreComparator>) {
    this.#comparators = comparators;
    this.#database = new DatabaseSync(path);
    this.#database.exec('PRAGMA foreign_keys = ON');
    this.#database.exec(schema);
    this.#insertUser = this.#database.prepare(
      'INSERT INTO users (username, profile_picture) VALUES (?, ?) RETURNING id',
    );
    this.#selectUser = this.#database.prepare(
      'SELECT id, username, profile_picture AS profilePicture FROM users WHERE id = ?',
    );
    this.#selectUsers = this.#database.prepare(
      'SELECT id, username, profile_picture AS profilePicture FROM users ORDER BY id LIMIT ? OFFSET ?',
    );
    this.#insertScore = this.#database.prepare(`
      INSERT INTO scores (user_id, type, value, submitted_at, game_id, game_info)
      VALUES (?, ?, ?, ?, ?, ?) RETURNING id
    `);
    this.#selectBoard = this.#database.prepare(`
      SELECT s.id AS sid, s.user_id AS userId, s.type, s.value, s.submitted_at AS submittedAt,
        s.game_id AS gameId, s.game_info AS gameInfo, u.username, u.profile_picture AS profilePicture
      FROM scores s JOIN users u ON u.id = s.user_id
      WHERE s.game_id = ? AND s.game_info = ? AND s.type = ?
    `);
  }

  async createUser({ username, profilePicture }: Omit<User, 'id'>): Promise<User['id']> {
    const row = this.#insertUser.get(username, profilePicture) as { id: number };
    return row.id;
  }

  async getUser(id: User['id']): Promise<User | null> {
    const row = this.#selectUser.get(id) as User | undefined;
    return row ? { ...row } : null;
  }

  async listUsers({ start, end }: PaginationQuery): Promise<User[]> {
    const rows = this.#selectUsers.all(Math.max(end - start, 0), start) as unknown as User[];
    return rows.map(row => ({ ...row }));
  }

  async saveScore({ userId, type, value, submittedAt, gameId, gameInfo }: NewScore): Promise<ScoreId> {
    const row = this.#insertScore.get(userId, type, value, submittedAt, gameId, gameInfo) as { id: number };
    return row.id;
  }

  async getLeaderboard({ gameId, gameInfo, type, start, end }: LeaderboardQuery): Promise<LeaderboardEntry[]> {
    const compare = this.#comparators.get(gameId);
    if (!compare) throw new Error(`No score comparator registered for game "${gameId}"`);

    const bestByUser = new Map<User['id'], BoardRow>();
    for (const row of this.#selectBoard.all(gameId, gameInfo, type) as unknown as BoardRow[]) {
      const best = bestByUser.get(row.userId);
      if (!best || compare(row, best) < 0) bestByUser.set(row.userId, row);
    }
    return [...bestByUser.values()].sort(compare).slice(start, end).map(toEntry);
  }

  close(): void {
    this.#database.close();
  }
}
