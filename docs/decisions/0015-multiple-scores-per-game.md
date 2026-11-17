---
status: accepted
---

# ADR-0015 | Allow games to report multiple scores

## Context and Problem Statement

A single score is enough to describe some games. Other games measure more than one aspect of a round. An aim trainer can report clicks per second and accuracy, and each tells the player something different about the same attempt.

## Considered Options

- Store one score value and unit per result, as in the initial draft.
- Allow a result to contain the score measures defined by the game's rules.

## Decision Outcome

Allow a result to contain all score measures defined for that round by the game's rules. Their labels should supply only the context needed to interpret them: a unit is sufficient for a simple score, while **Clicks/s** and **Accuracy (%)** distinguish the aim trainer's different measures. Supporting several values does not prescribe which one orders a leaderboard.

### Consequences

- Good, because a game can report distinct measures from the same round, such as clicks per second and accuracy, without discarding one to fit a single-value result.
- Bad, because multiple values do not identify which one determines rank. Each board must make its comparison rule clear and use the same rule when a player chooses a score to beat. [Reading scores](../player-flows/leaderboards.md#interpreting-a-score)
- Bad, because storage and display must identify each measure within a result rather than assume one number and unit. [Ranking and storage](../architecture/ranking-and-storage.md#logical-data-model)

The measures belong to the same game and rules version. Each game's ranking rule and the measures a board displays remain open.

## More Information

[Human Benchmark's reaction-time score](https://humanbenchmark.com/tests/reactiontime) provides a simpler comparison: milliseconds can explain the number without a separate description of score calculation. Supporting several measures must still allow that concise presentation when one value is enough.
