# Local development

After [installing dependencies](../../README.md#local-development), start the app from the repository root:

```sh
npm run dev:local
```

This starts the frontend preview, application server, and local account services. Open <http://127.0.0.1:5173/> and leave the terminal running while you work. The preview updates when frontend files change, and server changes restart the server automatically. Press Ctrl+C to stop everything.

For sign-in, use `alice.test` or `bob.test` with the password `password`. Restarting the account services recreates these temporary accounts and clears their data, so sign in again afterward.

## Running services separately

To work on one part of the app, you can run the services in separate terminals. Stop `dev:local` first to free the ports.

`npm run dev` starts the frontend preview at <http://127.0.0.1:5173/>. It forwards `/api` requests to the application server, allowing frontend code to use relative URLs.

`npm run dev:server` creates the local database if needed and starts the application server at <http://127.0.0.1:3000/>. Source changes restart the server.

`npm run dev:services` starts the local account services. Wait for `Local AT services ready` before using them.

Leave each terminal running while you work and press Ctrl+C to stop its service. If startup reports that a port is in use, check for another terminal already running that service and stop it before retrying.

## Local database

The app database is stored in `.local/ranking.sqlite` and keeps its data across restarts. To clear it, stop the server, run `npm run db:reset`, then start the server again. You can create the database separately with `npm run db:setup`.

## Server configuration

Put local settings in `.env` at the repository root. Set `PORT` to change the server port or `DATABASE_PATH` to change the database location. File paths are relative to the repository root.

The frontend preview reads the server port when it starts. Restart the preview after changing `PORT` so API requests reach the new address.

For `dev:local`, set `SERVER_ENTRY` to use a server entry file other than `src/server/index.ts`.

## Local account configuration

Account-connection code needs the addresses and identities created by the local account services. Their launcher writes these to `.local/at.json` and passes the file's absolute path to the server in `AT_DEV_CONFIG`.

The browser OAuth test in `tests/fixtures/at-client/main.ts` configures the SDK to resolve identities through these local services. Refer to it when implementing account connection.
