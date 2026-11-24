import { readConfig } from './config.ts';
import { comparators } from './games.ts';
import { createApiHandler } from './routes.ts';
import { startServer } from './server.ts';
import { SqliteScoreStorage } from './storage/sqlite.ts';

try {
  const config = readConfig();
  const storage = new SqliteScoreStorage(config.databasePath, comparators);
  const app = await startServer(config, createApiHandler(storage));
  const stop = () => {
    app.close()
      .then(() => storage.close())
      .catch(error => { console.error(error); process.exitCode = 1; });
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  console.log(`Server ready: ${app.url}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
