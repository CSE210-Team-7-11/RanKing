import { defineConfig } from '@playwright/test';

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests/browser',
  forbidOnly: isCI,
  reporter: isCI ? [['list'], ['html', { open: 'never' }]] : 'list',
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox', use: { browserName: 'firefox' } },
    { name: 'webkit', use: { browserName: 'webkit' } },
  ],
  use: {
    trace: 'retain-on-failure',
  },
});
