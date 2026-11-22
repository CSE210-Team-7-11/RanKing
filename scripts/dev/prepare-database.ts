import { mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const path = resolve(process.env.DATABASE_PATH || '.local/ranking.sqlite');
if (process.argv.includes('--reset')) {
  for (const file of [path, `${path}-wal`, `${path}-shm`, `${path}-journal`]) {
    rmSync(file, { force: true });
  }
}
mkdirSync(dirname(path), { recursive: true });
const database = new DatabaseSync(path);
try {
  database.exec('PRAGMA journal_mode = WAL');
} finally {
  database.close();
}
console.log(`Local database ready: ${path}`);
