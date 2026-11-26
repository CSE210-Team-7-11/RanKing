import { readConfig } from './config.ts';
import { startServer } from './server.ts';

try {
  const app = await startServer(readConfig());
  const stop = () => {
    void app.close().catch(error => { console.error(error); process.exitCode = 1; });
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
  console.log(`Server ready: ${app.url}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
