import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const host = env.HOST || '127.0.0.1';
  const targetHost = host === '0.0.0.0' ? '127.0.0.1' : host === '::' ? '[::1]' : host.includes(':') ? `[${host}]` : host;
  return {
    root: 'web',
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
      proxy: { '/api': `http://${targetHost}:${env.PORT || 3000}` },
    },
    build: {
      outDir: '../dist/web',
      emptyOutDir: true,
    },
  };
});
