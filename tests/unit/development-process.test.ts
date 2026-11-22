import assert from 'node:assert/strict';
import { once } from 'node:events';
import { spawn } from 'node:child_process';
import { test } from 'node:test';
import { stopChild } from '../../scripts/dev/application.ts';

test('stopping a development child allows its shutdown handler to finish', async () => {
  const child = spawn(process.execPath, ['-e', `
    const timer = setInterval(() => {}, 1000);
    process.on('SIGTERM', () => { clearInterval(timer); process.stdout.write('stopped'); });
    process.stdout.write('ready');
  `], { stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  child.stdout.on('data', chunk => { output += String(chunk); });
  try {
    await once(child.stdout, 'data');
    await stopChild(child);
    // Windows terminates the process directly
    if (process.platform !== 'win32') assert.equal(output, 'readystopped');
    assert.ok(child.exitCode !== null || child.signalCode !== null);
    await stopChild(child);
  } finally {
    if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL');
  }
});
