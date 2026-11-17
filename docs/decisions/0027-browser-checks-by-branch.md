---
status: accepted
date: 2026-11-17
---

# ADR-0027 | Increase CI checks from trunks to main

## Context and Problem Statement

[ADR-0006](0006-testing-and-ci.md)

Frontend and backend feature work reaches separate trunks before the combined app reaches `develop`. Running builds and browser tests on every trunk change would require contributors to wait for checks of integrations that may still be under development. We need quick feedback on those branches and broader verification as work approaches `main`.

## Considered Options

- Run builds, integration tests, and all desktop browser tests on every branch, alongside source checks and unit tests.
- Run builds, integration tests, and Chromium on the trunks and `develop`, then add Firefox and WebKit for `main`.
- Run source checks and unit tests on the trunks, add build and integration checks on `develop`, and require the full desktop suite and coverage gate for `main`.
- Select checks for earlier PRs by the components they affect, with the full suite required before `main`.
- Keep earlier PR checks lightweight and run broader checks on a schedule or on demand, with the full suite required before `main`.

## Decision Outcome

Use required suites determined by the target branch. This gives contributors a predictable gate at each integration stage without maintaining a map of which tests each change might affect. Scheduled or on-demand runs can provide earlier feedback. A scheduled run may test a later revision, however, and an optional on-demand run may never be requested, so they cannot replace a required check of the revision being merged.

Increase the checks as work moves toward `main`:

| Target branch | Required checks |
| --- | --- |
| `backend`, `frontend` | Lint, type checks, and unit tests |
| `develop` | Trunk checks, applicable builds, integration tests, and Chromium browser tests |
| `main` | Develop checks, Firefox and WebKit browser tests, and the test-coverage gate |

QA implements these suites under [ADR-0004](0004-trial-team-structure.md). The checks apply to PRs targeting these branches and pushes after merging. Shared interface declarations receive the `develop` checks because their review path goes directly there. The coverage requirement is agreed, but its tool and acceptance criteria remain undecided and are not configured yet.

Actual Safari is also checked during demo preparation; a WebKit test run is not a complete test of the shipped Safari browser.

Checks selected by affected component and scheduled runs could supplement these gates. They are ways to obtain additional feedback, rather than replacements for the required checks on the target branch. Their configuration has not been selected.

### Consequences

- Good, because routine trunk checks avoid browser installation, builds, and integration test execution while still checking source code and unit behavior.
- Good, because combined work must pass integration and browser checks before entering `develop`, with broader browser coverage before `main`.
- Bad, because a change can pass the trunk gate and later fail its build or integration checks when submitted to `develop`.
- Bad, because Firefox- or WebKit-specific failures may first appear during promotion and delay the release.

## Pros and Cons of the Options

### Full builds and browser suites on every branch

- Good, because contributors can find build, integration, and browser-specific failures before merging to a trunk.
- Bad, because every trunk PR must run the full suite, including checks that need the combined app.

### Builds and Chromium on trunks

- Good, because builds and common browser behavior are checked before changes leave their trunk.
- Bad, because trunk PRs still require browser setup and integration tests before the work has reached `develop`.

### Source and unit checks on trunks, broader checks downstream

- Good, because the checks follow the stages at which we combine and review the work.
- Bad, because failures deferred to later gates may require changes to work already merged into a trunk.

### Earlier checks selected by affected component

Run checks for the affected frontend, backend, or shared interfaces on earlier PRs, then require the complete suite before `main`.

- Good, because a frontend change could receive browser feedback before reaching `develop` without requiring unrelated backend checks on that PR.
- Bad, because the selection must account for shared interfaces, dependencies, and configuration. An incomplete mapping can skip a relevant test, and maintaining the mapping adds work as the app changes.

### Lightweight earlier PR checks with scheduled or on-demand broader checks

- Good, because broader suites can expose failures before promotion without making every earlier PR wait for them. Contributors can request a run when a change warrants one.
- Bad, because failures can surface after several changes have merged, making their cause harder to locate. On-demand runs also depend on someone recognizing when they are needed. Neither approach guarantees that each earlier PR was checked against the broader suite.

## More Information

[Playwright's browser documentation](https://playwright.dev/docs/browsers) describes its browser support.

The scaffold discovers tests but does not provide application coverage. The team must add meaningful tests as the app is implemented; passing with no discovered tests does not establish that a player flow works.
