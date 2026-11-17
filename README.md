# RanKing

RanKing is a social leaderboard platform where players share game results and experiences with friends and the wider world. Players can compete for all-time records or the best score in a period, challenge friends, work toward a personal best, or simply test their skill at a game. Public score sharing uses AT Protocol.

The [design and architecture guide](docs/architecture.md) explains the planned experience and how the parts of the system support it. To contribute, set up the local development tools below so you can preview and check your changes before review.

## Local development

Frontend sources belong under `web/`; TypeScript server sources belong under `src/server/`. Tests are organized under `tests/unit/`, `tests/integration/`, and `tests/browser/`.

Use Node.js 24 and npm. With nvm, select the project version by running `nvm use` in the repository root. Install the locked dependencies and run the checks:

```sh
npm ci
npm run check
```

`npm run dev` previews the frontend in `web/` and updates it when source files change. Vite compiles frontend TypeScript to JavaScript; type checking runs separately.

| Command | Purpose |
| --- | --- |
| `npm run check` | Check TypeScript types and lint TypeScript, HTML, and CSS |
| `npm run build` | Check types and build server output to `dist/server/` and frontend assets to `dist/web/` |
| `npm run preview` | Preview the built frontend locally |

## Tests

After installing the dependencies, run unit and integration tests with `npm run test:node`.

For Node tests and the Chromium browser suite, install Chromium and run:

```sh
npx playwright install chromium
npm test
```

Once Chromium is installed, `npm run test:e2e` runs just the browser suite. To run the desktop suite across Chromium, Firefox, and WebKit:

```sh
npx playwright install chromium firefox webkit
npm run test:e2e:desktop
```

## Contributing

Once the local checks pass, open feature PRs against `develop` for integration, with one teammate's approval, usually from QA. Promote a reviewed version through a PR from `develop` to `main`, approved by either lead. CI runs the Chromium suite for `develop` and the desktop browser suite for `main`. The [testing and review record](docs/decisions/0006-testing-and-ci.md) explains the gates and QA's responsibilities.

[Decision records](docs/decisions/README.md) explain why the team chose the existing design and development tools.
