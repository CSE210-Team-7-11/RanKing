import { defineConfig } from '@playwright/test';
import browserConfig from './playwright.config.ts';

export default defineConfig({
  ...browserConfig,
  testDir: './tests/at-browser',
  use: { ...browserConfig.use, baseURL: 'http://127.0.0.1:5176' },
  webServer: {
    command: 'node scripts/dev/run.ts --test',
    url: 'http://127.0.0.1:5176/network.json',
    timeout: 60_000,
    reuseExistingServer: false,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
  },
});
