---
status: accepted
date: 2026-11-09
---

# ADR-0002 | Start with one game and one leaderboard

## Context and problem statement

The team wants to show that a player can finish a game and have their score count on a shared leaderboard. Each additional game or retention feature adds work before the team can test that first complete flow.

## Considered options

- One fleshed-out game and one working leaderboard.
- Include additional games or retention features in the first release.

## Decision outcome

Deliver Sudoku and one working leaderboard. Set later milestones for additional features.

### Consequences

- Good, because one game and one leaderboard give the team a complete player flow to deliver and evaluate before taking on more features. Sudoku exercises the shared [game interface](0017-iframe-game-runtime.md).
- Bad, because the first release cannot demonstrate the wider social and retention features that motivated the product. Streaks, points and cosmetics, personal history, score distributions, social play, training, and developer-facing APIs remain work for later milestones.

## Evidence

The November 9 meeting adopted one game and one leaderboard by six votes in favor and two abstentions (recording 13:48-20:54). The Store design follow-up decided on Sudoku.
