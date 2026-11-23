# Testing

Run tests from the repository root after [installing the development dependencies](README.md#local-development).

## Unit and integration tests

Run the unit tests with:

```sh
npm run test:unit
```

Use `npm run test:integration` to run integration tests, or `npm run test:node` to run both suites. Tests that need local AT services start and stop their own copies.

## Browser tests

Install Chromium, then run the application and AT authentication browser tests:

```sh
npx playwright install chromium
npm run test:e2e
npm run test:at:browser
```

For Firefox and WebKit coverage as well, install all three engines and run both browser suites:

```sh
npx playwright install chromium firefox webkit
npm run test:e2e:desktop
npm run test:at:desktop
```

Once Chromium is installed, `npm test` runs the unit and integration tests followed by both browser suites in Chromium.

## Backend coverage

Run `npm run test:coverage` to execute the unit and integration tests with coverage
collection. Open `coverage/index.html` for the annotated source report. The same
run writes `coverage/lcov.info` for Codecov and `coverage/coverage-summary.json`
for a machine-readable summary.

The report includes all `src/server/**/*.ts` files, including source files that
the tests never load. Declaration files, development scripts, test fixtures, and
browser-side code are outside this backend report. Playwright pass counts are
reported separately and do not contribute browser code coverage here.

Coverage is informational while the team establishes a baseline. Passing tests
and high coverage still require comparison against the issue's acceptance
criteria. See [QA tooling](docs/development/qa-tooling.md) for CI and service setup.

## Adding tests

Work with QA on the tests for your feature. QA owns test implementation and accessibility checks, collaborating with frontend and backend implementers.

Place unit tests in `tests/unit/` and integration tests in `tests/integration/`, using the filename suffix `.test.ts`.

Use Playwright for browser tests. Put application tests in `tests/browser/` and local AT authentication tests in `tests/at-browser/`.

When working on AT authentication tests, use `playwright.at.config.ts` to configure service startup. The test page is in `tests/fixtures/at-client/`.

## Failed CI checks

The [branch gates](CONTRIBUTING.md#ci-checks) determine which suites run for a PR. Open a failed check's log to find the test and its error. For browser failures, download the `playwright-results` artifact from the workflow run to inspect the report and retained traces.
