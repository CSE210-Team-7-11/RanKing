# RanKing

RanKing is a social leaderboard platform where players share game results and experiences with friends and the wider world. Players can compete for all-time records or the best score in a period, challenge friends, work toward a personal best, or simply test their skill at a game. Public score sharing uses AT Protocol.

For feature work, use [Documentation by task](docs/scoped/README.md) to find the sections relevant to your assignment, or follow the [MVP guide](docs/scoped/mvp.md) for the first release. The [design and architecture guide](docs/architecture/README.md) provides the broader system overview. To contribute, set up the local development tools below so you can preview and check your changes before review.

## Local development

Frontend sources belong under `web/`; TypeScript server sources belong under `src/server/`.

The [toolchain reference](docs/architecture/development-toolchain.md) describes the tools used in this repository.

Use Node.js 24 and npm. With nvm, select the project version by running `nvm use` in the repository root. Install the locked dependencies and run the checks:

```sh
npm ci
npm run check
```

`npm run dev` previews the frontend in `web/` and updates it when source files change. Vite compiles frontend TypeScript to JavaScript; type checking runs separately.

Follow the [local setup instructions](docs/development/local-environment.md) to start the services and use the development accounts.

| Command | Purpose |
| --- | --- |
| `npm run check` | Check TypeScript types and lint TypeScript, HTML, and CSS |
| `npm run build` | Check types and build server output to `dist/server/` and frontend assets to `dist/web/` |
| `npm run preview` | Preview the built frontend locally |

## Tests

See [TESTING.md](TESTING.md) for running the test suites and adding tests.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch management rules, shared interface proposals, and review requirements.

[Decision records](docs/decisions/README.md) explain why we chose the design and development tools.

Outstanding design and tooling questions are collected in [Open questions](docs/open-questions.md). 
