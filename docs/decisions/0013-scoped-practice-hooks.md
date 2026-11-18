---
status: accepted
date: 2026-11-16
---

# ADR-0013 | Store practice summaries in the host and interpret them in games

## Context and Problem Statement

Scoped practice uses earlier attempts to suggest an exercise for a difficulty the player has encountered. Games understand their own stages and mistakes. The integration needs to decide who retains the history those games use.

## Considered Options

- Each game stores and retrieves its own practice history.
- RanKing stores game-defined summaries and supplies compatible history to the game's practice hook.

## Decision Outcome

RanKing retains the summaries games choose to report and supplies a bounded set for the current player and game. The game interprets those summaries and returns a suggested exercise with a reason the player can understand. This keeps history access in the host while leaving the meaning of the history and exercise with the game.

### Consequences

- Good, because game authors can use history through a common interface without implementing their own storage integration.
- Good, because the platform can limit which player's and game's history reaches a frame without interpreting the game's mechanics.
- Bad, because we must implement and maintain summary storage and compatibility handling, including across game updates.

## Pros and Cons of the Options

### Game-managed history

- Good, because each author can choose storage and retention suited to its exercises without extending the host's history service.
- Bad, because each game needs its own persistence integration and compatibility handling.

### Host-managed summaries

- Good, because the host provides a common route to bounded history while games keep control of its interpretation.
- Bad, because the host interface must carry enough version information to avoid returning summaries the current game cannot interpret.

## More Information

Ordinary practice is available in either arrangement and remains the fallback when there is no useful suggestion. The [practice flow](../player-flows/play-and-results.md#replaying-or-practicing) describes the player's choice, and the [practice integration](../architecture/game-library.md#scoped-practice-hooks) describes compatible history access and the game-defined summaries.
