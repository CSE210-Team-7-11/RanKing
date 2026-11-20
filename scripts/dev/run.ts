import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { startNetwork, testPassword } from './network.ts';
import { startCheckServer } from './check-server.ts';
import { serverEntry, checkFrontend, startApplication } from './application.ts';

const testing = process.argv.includes('--test');
const application = process.argv.includes('--app');
const runtimeFile = fileURLToPath(new URL('../../.local/at.json', import.meta.url));
let network: Awaited<ReturnType<typeof startNetwork>> | undefined;
let checkServer: Awaited<ReturnType<typeof startCheckServer>> | undefined;
let app: Awaited<ReturnType<typeof startApplication>> | undefined;
let runtimeWritten = false;
let stopping: Promise<void> | undefined;
let interrupted = false;
let finish: () => void;
const stopped = new Promise<void>(resolve => { finish = resolve; });
const interrupt = () => { interrupted = true; finish(); };
/* npm and the terminal can both send a stop signal, so keep handling repeats
 * until cleanup finishes
 */
process.on('SIGINT', interrupt);
process.on('SIGTERM', interrupt);

/** Stop the services started here and remove their local config file */
function stop(): Promise<void> {
  return stopping ??= (async () => {
    try { await app?.close(); } finally {
      try { await checkServer?.close(); } finally {
        try { await network?.close(); } finally {
          if (runtimeWritten) await rm(runtimeFile, { force: true });
        }
      }
    }
  })();
}

try {
  if (process.versions.node.split('.')[0] !== '24') throw new Error('Use Node.js 24 (see .nvmrc)');
  const entry = application ? await serverEntry() : undefined;
  if (application) await checkFrontend();
  network = await startNetwork(testing ? [0, 0, 0] : undefined);
  if (interrupted) throw new Error('Startup interrupted');
  if (!testing) {
    await mkdir(new URL('../../.local/', import.meta.url), { recursive: true });
    await writeFile(runtimeFile, JSON.stringify(network.config, null, 2) + '\n', { mode: 0o600 });
    runtimeWritten = true;
  }
  if (testing) checkServer = await startCheckServer(network.config, 5176);
  if (entry) app = await startApplication(entry, error => {
    console.error(error.message);
    process.exitCode = 1;
    interrupt();
  });
  console.log(`Local AT services ready. PLC: ${network.config.plc}`);
  for (const account of network.config.accounts) console.log(`${account.handle}: ${account.pds} (${account.did})`);
  console.log(`Test account password: ${testPassword}`);
  if (checkServer) console.log(`OAuth check: ${checkServer.resolvedUrls?.local[0]}`);
  if (app) console.log(`Frontend: ${app.url}`);
  console.log('Ctrl+C stops this network. Restarting creates fresh accounts and data.');
  await stopped;
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await stop();
  process.removeListener('SIGINT', interrupt);
  process.removeListener('SIGTERM', interrupt);
}
