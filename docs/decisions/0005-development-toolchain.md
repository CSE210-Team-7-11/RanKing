---
status: proposed
date: 2026-11-12
---

# ADR-0005 | Set up the development toolchain

## Context and Problem Statement

Contributors work asynchronously and need to pull and run another teammate's branch without a lengthy setup. Frontend and backend both use TypeScript, and QA needs tools for both. Dependency management should make that shared setup straightforward. Source checks also need to catch mistakes compilation permits, such as unhandled promises.

## Considered Options

### Dependency management

- One npm package and lockfile for frontend and backend development.
- Separate frontend and backend packages with separate installations.

### TypeScript linting

- ESLint with typescript-eslint.
- Oxlint with its type-aware analyzer.

## Decision Outcome

The proposed dependency setup uses one package and lockfile so a contributor can install the repository's development dependencies once. CI installs the same locked versions with `npm ci`. Separate TypeScript configurations still describe the browser and Node environments; sharing dependencies does not make their runtime APIs interchangeable.

The linting choice is accepted. Use ESLint with typescript-eslint's recommended and type-aware rules for server and protocol code.

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

### ESLint with typescript-eslint

- Good, because type-aware rules can catch mistakes such as unhandled promises using the existing TypeScript project service. This avoids maintaining another type-analysis toolchain alongside `tsc`.

### Oxlint with its type-aware analyzer

- Good, because it also supports type-aware checks.
- Bad, because its typed checks use a separate analyzer that we would maintain alongside TypeScript.

## More Information

[typescript-eslint](https://typescript-eslint.io/getting-started/typed-linting/) documents typed rules and the project service. [Oxlint](https://oxc.rs/docs/guide/usage/linter/type-aware.html) documents its type-aware analyzer.
