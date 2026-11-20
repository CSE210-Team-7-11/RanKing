# Local development

The development services provide two temporary accounts for working on sign-in and account features. After [installing dependencies](../../README.md#local-development), start them from the repository root:

```sh
npm run dev:services
```

Wait for `Local AT services ready` in the terminal, then leave it running while you work. To preview the frontend, open a second terminal in the repository root and run:

```sh
npm run dev
```

Open the preview address printed in that terminal. Changes to frontend files update the preview automatically.

When working on sign-in, use `alice.test` or `bob.test` with the password `ranking-local-test-password`. Each restart recreates these accounts and clears their data, so sign in again after restarting the services.

Press Ctrl+C in each terminal to stop it. If startup reports that a port is in use, check for another terminal already running the services and stop that copy before trying again.

## Running the app together

Once the frontend and application server are in place, you can start both with the account services using one command:

```sh
npm run dev:local
```

Run this after stopping any separate preview or service commands. Open <http://127.0.0.1:5173/> and leave the terminal running. Frontend changes update the preview; server changes restart the server. Ctrl+C stops everything started by this command.

This command needs `web/index.html` and `src/server/index.ts`. If either is missing from your branch, it reports the missing file and stops. You can still run the account services separately with `npm run dev:services`.

## Connecting the app to local accounts

For developers implementing account connection, the launcher writes account identifiers and service addresses to `.local/at.json`. The server receives this file's absolute path in `AT_DEV_CONFIG`. Use these settings to connect to the local accounts; the OAuth configuration in `tests/fixtures/at-client/main.ts` shows how to configure the browser client.

To use a different server entry file, set `SERVER_ENTRY` in a local `.env` file. Paths are relative to the repository root. Both the launcher and server read `.env`.
