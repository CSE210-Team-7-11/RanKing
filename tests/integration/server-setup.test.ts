import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, rm, writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { DatabaseSync } from 'node:sqlite';
import { test } from 'node:test';
import { startServer } from '../../src/server/server.ts';

test('server startup, health checks, and shutdown release the listening port', async () => {
  const app = await startServer({ host: '127.0.0.1', port: 0 });
  try {
    const response = await fetch(`${app.url}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: 'ok' });
    assert.equal((await fetch(`${app.url}/missing`)).status, 404);
    await app.close();
    await app.close();
    const restarted = await startServer({ host: '127.0.0.1', port: Number(new URL(app.url).port) });
    await restarted.close();
  } finally {
    await app.close();
  }
});

test('database setup preserves existing data when run again', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ranking-database-'));
  const path = join(directory, 'nested', 'ranking.sqlite');
  const setup = () => promisify(execFile)(process.execPath, ['scripts/dev/prepare-database.ts'], {
    env: { ...process.env, DATABASE_PATH: path },
  });
  try {
    await setup();
    const database = new DatabaseSync(path);
    try {
      database.exec('CREATE TABLE setup_test (value TEXT);');
      database.prepare('INSERT INTO setup_test VALUES (?)').run('retained');
    } finally { database.close(); }
    await setup();
    const reopened = new DatabaseSync(path);
    try {
      assert.equal(reopened.prepare('SELECT value FROM setup_test').get()?.value, 'retained');
    } finally { reopened.close(); }
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('server startup reports a port collision', async () => {
  const app = await startServer({ host: '127.0.0.1', port: 0 });
  try {
    await assert.rejects(startServer({ host: '127.0.0.1', port: Number(new URL(app.url).port) }), { code: 'EADDRINUSE' });
  } finally { await app.close(); }
});

test('database reset clears the configured database and leaves other files alone', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'ranking-reset-'));
  const path = join(directory, 'custom.sqlite');
  const otherFile = join(directory, 'other.sqlite');
  const reset = () => promisify(execFile)(process.execPath, ['scripts/dev/prepare-database.ts', '--reset'], {
    env: { ...process.env, DATABASE_PATH: path },
  });
  try {
    await writeFile(otherFile, 'keep');
    await reset();
    const database = new DatabaseSync(path);
    try { database.exec('CREATE TABLE setup_test (value TEXT)'); }
    finally { database.close(); }
    await reset();
    const reopened = new DatabaseSync(path);
    try {
      assert.equal(reopened.prepare("SELECT name FROM sqlite_schema WHERE name = 'setup_test'").get(), undefined);
      assert.equal(reopened.prepare('PRAGMA integrity_check').get()?.integrity_check, 'ok');
    } finally { reopened.close(); }
    assert.equal(await readFile(otherFile, 'utf8'), 'keep');
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});
