---
status: accepted
date: 2026-11-17
---

# ADR-0031 | Maintain a shared test environment separate from the live app

## Context and Problem Statement

We work asynchronously across frontend and backend, with QA testing their integration. Local development and CI provide feedback on changes, but the team also needs to check the same deployed build, including account connection through AT providers. These checks can create test scores or require resetting data, so where they run affects players as well as the development workflow.

## Considered Options

- Maintain a shared test environment.
- Use local development and CI without a shared test environment.
- Test deployed changes on the live app.

## Decision Outcome

Maintain a shared test environment separate from the live app. It gives teammates a common deployed build to check on their own schedules, with test accounts and data they can reset without affecting players. This is worth the additional maintenance because integration work can be tried before it reaches the live app.

Deploy `develop` to the shared test environment. It contains the combined frontend and backend work after lead review, allowing the team to check that integration before promotion to `main`. The live app is deployed from `main`.

The test environment has its own ranking store and uses test accounts for AT interactions. Local development and CI continue to provide their existing checks. Branch review and promotion follow [ADR-0006](0006-testing-and-ci.md), and the required CI suites follow [ADR-0027](0027-browser-checks-by-branch.md).

### Consequences

- Good, because teammates can reproduce and investigate integration problems against the same deployed build without coordinating a local setup for each review.
- Good, because test scores and data resets can stay separate from players' records.
- Bad, because another deployment needs configuration and maintenance, and may add hosting costs.
- Bad, because differences between test and live environments can leave faults undiscovered until release. Passing in the test environment does not establish that the live deployment will behave identically.

### Confirmation

When the environment is set up, verify that the shared test build comes from `develop` and teammates can exercise account connection with test accounts. Confirm that creating or resetting test data leaves live player records unchanged.

## Pros and Cons of the Options

### Maintain a shared test environment

- Good, because frontend, backend, and QA can inspect the integrated app asynchronously before its changes reach players.
- Good, because the team can repeat tests and reset their data without using the live ranking store.
- Bad, because we must maintain a second deployment and keep relevant configuration consistent with the live app.

### Use local development and CI without a shared test environment

Rely on contributors' local setups and CI for verification before deploying to the live app.

- Good, because this uses the development and test tooling already required, without another persistent deployment to operate.
- Good, because contributors can isolate their work and repeat automated checks without sharing mutable test data.
- Bad, because reviewing the integrated app requires a local setup or access to a CI run rather than a common site that teammates can revisit.
- Bad, because there is no separate deployed instance for checking changes under the conditions of a hosted app before release.

### Test deployed changes on the live app

Use the live deployment for integrated testing, with test accounts where appropriate.

- Good, because tests exercise the actual deployed configuration and its external connections.
- Good, because the team can access a common site without maintaining another environment.
- Bad, because faulty changes can affect players before testing identifies them.
- Bad, because test activity shares the live system with players. Keeping test scores out of standings and resetting data safely requires care, and disruptive tests may be unsuitable while people are using the app.
