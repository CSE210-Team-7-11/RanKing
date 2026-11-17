---
status: proposed
date: 2026-11-12
---

# ADR-0005 | Share one npm package and lockfile

## Context and Problem Statement

Contributors work asynchronously and need to pull and run another teammate's branch without a lengthy setup. Frontend and backend both use TypeScript, and QA needs tools for both. Dependency management should make that shared setup straightforward.

## Considered Options

- One npm package and lockfile for frontend and backend development.
- Separate frontend and backend packages with separate installations.

## Proposed Outcome

The proposed setup uses one package and lockfile so a contributor can install the repository's development dependencies once. CI installs the same locked versions with `npm ci`. Separate TypeScript configurations still describe the browser and Node environments; sharing dependencies does not make their runtime APIs interchangeable.

### Consequences

- Good, because contributors reviewing work across the frontend and backend use one installation, also shared by CI.
- Bad, because dependency upgrades affect the shared toolchain. The subteams cannot independently upgrade conflicting versions of a shared tool in this arrangement.

## Pros and Cons of the Options

### One package and lockfile

- Good, because it keeps installation and dependency updates in one place for the class team.
- Bad, because it couples the two parts' development dependencies.

### Separate packages and installations

- Good, because each part can maintain its own tool versions and dependency lifecycle.
- Bad, because contributors and CI working across both parts must install and maintain both environments.
