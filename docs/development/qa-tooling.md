# QA tooling

## Review a change against its issue

Read the issue's acceptance criteria and the PR's stated scope before checking
test results. Record which requirements have evidence, which are untested, and
which depend on another change. Report findings on the relevant PR with the
observed result, expected result, and reproduction steps.

## Backend coverage

`npm run test:coverage` runs the existing Node unit and integration suites with
c8 and writes text, HTML, LCOV, and JSON reports under `coverage/`. It includes
runtime modules in `src/server/**/*.ts`, even at zero coverage. The coverage
runner excludes declaration files and files whose TypeScript output is empty
or contains only an empty module marker. Adding runtime code to a type-only
file brings it into the report automatically. Browser tests are tracked separately.

Coverage runs automatically on pushes and PRs targeting `develop` and `main`.
The existing Checks workflow runs lint, type checks, and unit tests on the
`backend` and `frontend` trunks. To check coverage earlier, run the command
locally or select the branch in the manual GitHub Actions workflow once the
workflow is on the default branch.

CI saves the reports as the `backend-coverage` artifact. A repository owner can
enable Codecov uploads after the service is authorized:

1. Install or approve the Codecov GitHub App for this repository and activate it
   in Codecov.
2. Store the repository upload token as the Actions secret `CODECOV_TOKEN`.
3. Set the Actions repository variable `CODECOV_ENABLED` to `true`.
4. Run the workflow and verify that `coverage/lcov.info` is accepted and the
   source paths match this repository.
5. Generate a report on the target branch as well as the PR head so Codecov can
   compare them. For a new setup, use the GitHub coverage artifact until that
   baseline is available.

Uploads stay off until the repository variable is enabled. An enabled upload
failure fails the coverage job so a configuration failure is visible. The
Codecov project and patch statuses are informational, with no enforced numeric
target. The team should agree on targets before making them required checks.

Only authorized repository or organization administrators should handle service
access, tokens, and required-check settings. Never put upload tokens in source
files or PR comments.

## Automated PR review

The repository configuration uses CodeRabbit's `chill` review profile and includes
PRs targeting `backend`, `frontend`, `develop`, and `main`. Draft PRs are excluded
from automatic review. The file configures an installed service; it does not
install or authorize the CodeRabbit GitHub App.

An authorized administrator needs to connect CodeRabbit to this repository and
confirm the public-repository plan. Then verify an actual review on a ready PR.
On an authorized PR, `@coderabbitai configuration` can show the resolved settings
and `@coderabbitai review` can request a review. Let PR authors decide when their
drafts are ready.

Check whether findings identify reproducible correctness problems or only low
value style changes. Keep human review and the existing checks in place. If
CodeRabbit does not suit the project, discuss using Copilot review instead;
availability and billing depend on the team's GitHub setup.

CodeRabbit and Copilot review code changes. Codecov displays coverage from test
runs. One review service plus coverage reporting covers these two distinct jobs.

## Completion evidence

- A fresh install can run `npm run check` and `npm run test:coverage`.
- Reports include backend files that are not imported by a test.
- The GitHub coverage artifact is downloadable from a workflow run.
- Once enabled, Codecov accepts an upload and shows correct paths and a target
  branch baseline.
- Once authorized, CodeRabbit produces a review with the configured profile and
  target branches.

## References

- [c8 configuration and untested-file reporting](https://github.com/bcoe/c8)
- [Codecov GitHub Action](https://github.com/codecov/codecov-action)
- [Codecov setup](https://docs.codecov.com/docs/github-2-getting-a-codecov-account-and-uploading-coverage)
- [CodeRabbit configuration](https://docs.coderabbit.ai/configuration/quickstart)
