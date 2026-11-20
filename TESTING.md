# Testing

Run tests from the repository root after [installing the development dependencies](README.md#local-development).

## Unit and integration tests

Run the unit tests with:

```sh
npm run test:unit
```

Unit and integration tests use Node's test runner. Use `npm run test:integration` for integration tests or `npm run test:node` for both suites. The AT integration tests start local services and remove their accounts and data when they finish.

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

With Chromium installed, `npm test` runs all Node suites and both Chromium suites.

## Adding tests

Work with QA on the tests for your feature. QA owns test implementation and accessibility checks, collaborating with frontend and backend implementers.

Place unit tests in `tests/unit/` and integration tests in `tests/integration/`, using the filename suffix `.test.ts`. Both run with Node's test runner.

Application browser tests belong in `tests/browser/` and use Playwright. Tests for local AT authentication belong in `tests/at-browser/`; `playwright.at.config.ts` starts the AT services and the test page for that suite. Its page source is in `tests/fixtures/at-client/`.

## Failed CI checks

The [branch gates](CONTRIBUTING.md#ci-checks) determine which suites run for a PR. Open a failed check's log to find the test and its error. For browser failures, download the `playwright-results` artifact from the workflow run to inspect the report and retained traces.
