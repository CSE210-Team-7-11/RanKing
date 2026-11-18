---
status: accepted
---

# ADR-0028 | Check for game updates on online open

## Context and Problem Statement

[ADR-0022](0022-store-submission-and-automatic-updates.md)

An installed game can fall behind its published build. Players should receive fixes without needing to manage versions, including security fixes that creators publish between visits. On an extremely slow connection, downloading an update can take longer than the time available to play. Requiring every update before launch would make an otherwise usable installation unavailable for the duration of a non-critical download. Limited data allowances also make unnecessary downloads costly for the player.

## Considered Options

- Require every available update before online play.
- Let players defer any update and use the installed version.
- Require critical updates before online play and let players defer non-critical updates.

## Decision Outcome

On online open, check for updates. The game author marks an update as critical using a checkbox when publishing it. Critical updates must be applied before online play. A player can defer a non-critical update and launch the installed version, so a slow connection does not force them to spend their play session waiting for an optional download. Otherwise the app handles the update automatically.

The distinction matters because the cost of waiting depends on the player's connection, while the need for a particular fix depends on the update. Requiring every update ignores that cost. Allowing every update to be deferred would also allow a player to skip a fix designated as necessary before further online play.

Background downloads and prefetching are optional and enabled by default. Players can disable them to control bandwidth use. Deferring a non-critical update allows play to continue on the installed build; background downloading follows the separate download preference.

If checking for an update fails, an offline-capable game can still use its installed copy without ranking or other online features. This also applies while the player is offline. The next online open checks for updates again. An older version remains eligible for new ranked submissions for 24 hours after its replacement is published. This window does not remove valid historical scores. If a game-breaking bug produces invalid scores, the platform must support revoking the affected scores so they stop counting in standings.

### Consequences

- Good, because players on slow or limited connections can continue with an installed game when its update is non-critical.
- Good, because critical updates still take effect before online play without relying on the player to seek out a fix.
- Bad, because players depend on the author to mark critical updates appropriately. Marking routine changes critical recreates mandatory waits, while leaving a critical fix unmarked allows it to be deferred.
- Bad, because players can remain on different builds. Game compatibility and ranked eligibility must account for the version actually running.

Every update strategy depends on connectivity to receive a new build. An offline installation cannot be updated or disabled remotely merely by publishing a replacement.

## Pros and Cons of the Options

### Require every available update

- Good, because an online launch uses the current published build without needing to classify updates for deferral.
- Bad, because even a cosmetic change can prevent immediate play on an extremely slow connection and consume scarce data.

### Allow any update to be deferred

- Good, because players decide when to spend time and bandwidth on downloads, including when they have only a short opportunity to play.
- Bad, because the same choice can postpone a critical fix across repeated online sessions.

### Require critical updates and allow other updates to be deferred

- Good, because routine changes need not interrupt play while critical fixes retain their requirement to update.
- Bad, because update metadata and the player's controls must distinguish the two cases. Critical downloads can still impose long waits, and their failures need recovery handling.

## More Information

The [installation design](../architecture/game-library.md#install-and-update-lifecycle) preserves a complete installed copy during replacement. The game identity and score history survive updates. [Ranking storage](../architecture/ranking-and-storage.md#run-and-result-storage) preserves acceptance history while excluding revoked scores from standings.
