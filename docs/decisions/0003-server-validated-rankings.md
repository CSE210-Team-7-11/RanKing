---
status: accepted
date: 2026-11-17
---

# ADR-0003 | Use game-provided validation handlers for ranked scores

## Context and Problem Statement

We need a way to determine whether a submitted result can count toward official standings across games with different mechanics. A Sudoku solution and a rhythm-game attempt require different evidence and checks. Players control the browser in which they play, so a client report alone cannot establish that a result is valid. The choice is where the knowledge needed to validate each game belongs and what the platform can reliably establish.

## Considered Options

- One unified validator maintained by us.
- A standardized anti-cheat layer shared across games.
- Game-provided validation handlers behind a common platform interface.

## Decision Outcome

[ADR-0007](0007-ranked-run-validation.md) [ADR-0030](0030-one-result-per-run.md)

Chosen option: game-provided validation handlers, because the game defines the interactions and scoring rules needed to interpret its evidence. A unified interface can carry submissions and outcomes, but a universal set of gameplay checks cannot capture those rules for every game. Shared anti-cheat checks also cannot establish trusted execution in a player-controlled browser.

Each game defines its evidence format and supplies a handler that returns validated scores or a rejection. Evidence can include behavioral signals or challenge responses used to detect automated play as well as information needed to check the game's rules. RanKing routes the submission to the handler for the run's rules version, records the outcome subject to its run checks, and returns it to the player. Only successfully validated results recorded by RanKing count toward official standings.

### Consequences

- Good, because each game can check the interactions and evidence that determine its scores without requiring the platform to implement its mechanics.
- Good, because RanKing can use the same submission and result-handling interface across games. Keeping the rules version with the result preserves its meaning after updates.
- Bad, because every ranked game needs a validation handler and evidence contract, and changes to its rules may require maintaining another handler version.

## Pros and Cons of the Options

### One unified validator maintained by us

- Good, because common validation rules could be implemented and maintained in one place, reducing the validation code each game author supplies.
- Bad, because valid interactions depend on the game. Generic checks cannot decide whether a Sudoku grid is a valid solution or whether a sequence of rhythm-game inputs supports its score. Adding that knowledge to the unified validator would still require game-specific logic that we would be responsible for maintaining.

### A standardized anti-cheat layer shared across games

- Good, because shared detection could address common forms of suspicious behavior without each game implementing the same checks.
- Bad, because a player can modify or bypass browser-side checks and fabricate the reports they send. RanKing has no privileged or kernel-level client component with which to inspect execution outside the page. A browser anti-cheat report therefore cannot serve as proof of honest play.
- Bad, because a shared detection result does not establish whether a submitted score follows a particular game's rules. Such checks may supplement game validation, but cannot replace its knowledge of the mechanics.

### Game-provided validation handlers

- Good, because a game can choose evidence and checks suited to its own interactions, and update them as its rules change.
- Bad, because each game's protection depends on the evidence and detection logic its author implements and maintains.

## More Information

[OWASP's guidance on client-side security](https://cheatsheetseries.owasp.org/cheatsheets/Web_Frontend_Security_Cheat_Sheet.html#dont-rely-on-client-logic-for-security) explains why security decisions cannot rely on code controlled by the user.
