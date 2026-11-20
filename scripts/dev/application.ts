import { access } from 'node:fs/promises';
import { spawn, type ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../', import.meta.url));

/**
 * Get the absolute path to the server entry file
 * Uses SERVER_ENTRY or src/server/index.ts, relative to the repo root
 * Throws if the file is missing or inaccessible
 */
export async function serverEntry(): Promise<string> {
  const entry = resolve(root, process.env.SERVER_ENTRY || 'src/server/index.ts');
  try { await access(entry); } catch (cause) {
    throw new Error(`Server entry not found: ${entry}. Add the application server or set SERVER_ENTRY to its source path.`, { cause });
  }
  return entry;
}

/**
 * Stop a child process and wait for it to close
 * Force termination after five seconds; return immediately if already stopped
 */
export async function stopChild(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;
  await new Promise<void>(resolve => {
    const timeout = setTimeout(() => child.kill('SIGKILL'), 5_000);
    child.once('close', () => { clearTimeout(timeout); resolve(); });
    child.kill('SIGTERM');
  });
}

/**
 * Start the frontend preview and server with automatic reload
 * Calls onExit if the server watcher fails or exits unexpectedly
 * Returns the preview URL and close() to stop both processes
 */
export async function startApplication(entry: string, onExit: (error: Error) => void) {
  const frontend = await createServer({ root: resolve(root, 'web'), server: { host: '127.0.0.1', port: 5173, strictPort: true } });
  try { await frontend.listen(); } catch (error) { await frontend.close(); throw error; }
  const child = spawn(process.execPath, ['--watch', '--env-file-if-exists=.env', entry], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, AT_DEV_CONFIG: resolve(root, '.local/at.json') },
  });
  let stopping = false;
  child.once('error', onExit);
  child.once('exit', (code, signal) => {
    if (!stopping) onExit(new Error(`Server watcher exited (${signal || code})`));
  });
  return {
    url: frontend.resolvedUrls?.local[0],
    async close() {
      stopping = true;
      try { await stopChild(child); } finally { await frontend.close(); }
    },
  };
}

/** Check that web/index.html exists and is accessible, throwing if it isn't */
export async function checkFrontend(): Promise<void> {
  try { await access(resolve(root, 'web/index.html')); } catch (cause) {
    throw new Error('Frontend entry web/index.html does not exist yet. Use dev:services to start the local AT network independently.', { cause });
  }
}
