# Deployment

[Design and architecture map](README.md) | [System structure](system-structure.md)

## Live deployment

[ADR-0006](../decisions/0006-testing-and-ci.md)

The live app runs `main`. Promotion from `develop` is manual and must pass the required CI checks; deployment from `main` is automatic.

Accepted results and score revocations must survive deployments and restarts. Validation uses the game's rules associated with the issued run, including when a game has since been updated.

## Shared test environment

[ADR-0031](../decisions/0031-shared-test-environment.md)

The shared test environment runs `develop`, where frontend and backend work comes together after lead review. Teammates can check that deployed build asynchronously before it is promoted to `main`. The test environment uses its own ranking store, test accounts, and resettable data so account-connection checks and recovery testing leave live player records untouched.

Local development and CI continue to provide the checks described in [TESTING.md](../../TESTING.md).

## Game distribution

[ADR-0032](../decisions/0032-host-published-game-builds.md)

We retain and distribute published game builds through infrastructure we control. Published versions have fixed contents, so an update creates a new version rather than replacing an earlier version's files. The browser downloads the assets it needs for play independently of adding the game to the Library.
