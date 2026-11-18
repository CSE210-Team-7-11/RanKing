# Testing

Run these commands from the repository root after [installing the development dependencies](README.md#local-development).

## Unit and integration tests

Run both suites with:

```sh
npm run test:node
```

To run one suite, use `npm run test:unit` or `npm run test:integration`.

## Browser tests

Install Chromium and run the browser suite:

```sh
npx playwright install chromium
npm run test:e2e
```

To check all three desktop browser engines, install them and run:

```sh
npx playwright install chromium firefox webkit
npm run test:e2e:desktop
```

With Chromium installed, `npm test` runs the unit and integration suites followed by the Chromium browser suite.

## Adding tests

| Directory | Tests | Runner |
| --- | --- | --- |
| `tests/unit/` | Unit tests, named `*.test.ts` | Node |
| `tests/integration/` | Integration tests, named `*.test.ts` | Node |
| `tests/browser/` | Browser tests | Playwright |

Work with QA on the tests for your feature. QA owns test implementation and accessibility checks, collaborating with frontend and backend implementers.

## CI results

The [branch gates](CONTRIBUTING.md#ci-checks) determine which suites run for a PR. Inspect a failed check's log for the failing test. A failed browser test run also uploads a `playwright-results` artifact containing its report and any retained traces.
