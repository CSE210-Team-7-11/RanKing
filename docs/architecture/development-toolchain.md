# Development toolchain

The tools below support local development and the checks run during review. Installation and everyday commands are in the [README](../../README.md#local-development).

## Runtime and dependencies

[ADR-0005](../decisions/0005-development-toolchain.md)

Node.js 24 runs the backend and development tools. npm installs dependencies and runs the commands defined in `package.json`.

## Compilation and preview

[ADR-0026](../decisions/0026-frontend-preview-and-build.md)

The TypeScript compiler checks types throughout typescript code and compiles the backend to JavaScript. Vite compiles the frontend for the browser, provides a local preview with automatic updates, and builds the frontend assets for deployment. Type checking runs separately from Vite, so a working preview can still have type errors.

## Linting

[ADR-0005](../decisions/0005-development-toolchain.md)

ESLint with typescript-eslint checks server and protocol TypeScript, including type-aware checks for mistakes such as unhandled promises. HTMLHint checks HTML source, and Stylelint checks CSS. `npm run check` runs these linters and the TypeScript checks.

## Testing and CI

Node's built-in test runner runs unit and integration tests. Playwright runs browser tests in Chromium, Firefox, and WebKit. [TESTING.md](../../TESTING.md) covers the test commands and where to put tests.

GitHub Actions runs checks on pull requests and branch updates. The [contribution guide](../../CONTRIBUTING.md#ci-checks) shows which checks are required at each branch.
