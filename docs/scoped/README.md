# Documentation by task

Choose the work you are doing below. Each guide links to the sections relevant to that task, including its user stories. Follow another feature guide when your change touches that feature.

For first-release work, use the [MVP guide](mvp.md).

## Features

- [Landing page and Home](home.md): arrival, discovery, and entry through a score link.
- [Gameplay and practice](gameplay.md): the round interface, iframe host, replay, and practice hooks.
- [Leaderboards](leaderboards.md): board display, score comparison, and queries.
- [Score validation](validation.md): run issuance, game handlers, acceptance, and retries.
- [Accounts and profiles](accounts.md): AT connection, private history, and public profiles.
- [Friends and challenges](friends.md): requests, direct shares, and score battles.
- [Public scores](publication.md): AT publication, kept scores, and bulk deletion.
- [Store and reviews](store.md): discovery, listings, and player recommendations.
- [Library and downloads](library.md): organization, installation, updates, and removal.
- [Game submission](publishing.md): creator previews, admission review, and publishing updates.
- [Development and deployment](development.md): tooling, branch reviews, CI, and environments.

## Before contributing

Use the [local setup instructions](../../README.md#local-development) and [feature-branch workflow](../../CONTRIBUTING.md#feature-work). Changes to shared frontend/backend interfaces follow the [shared-interface review path](../../CONTRIBUTING.md#adding-or-changing-a-shared-interface).

For interface work, the [interaction requirements](../player-flows/README.md#interaction-requirements) apply across flows. [TESTING.md](../../TESTING.md) covers test commands and QA collaboration. The linked playtests suggest ways to evaluate each feature with players.

If you need context beyond a feature, the [architecture overview](../architecture/README.md) maps the system and [diagram guide](../diagrams.md) explains its notation.
