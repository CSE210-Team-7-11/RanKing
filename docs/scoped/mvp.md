# MVP: Sudoku and one leaderboard

[Documentation by task](README.md)

Read the [release scope](../architecture/purpose-and-scope.md#release-scope) first. The agreed outcome is a complete Sudoku game whose scores count on one shared leaderboard. [ADR-0002](../decisions/0002-mvp-scope.md#decision-outcome) records the scope decision.

## Sudoku and the game host

Read [platform requirements](../architecture/purpose-and-scope.md#platform-requirements) for the boundary between game mechanics and the app. Puzzle generation, finish conditions, and scoring belong to Sudoku.

For host integration, use the iframe launch, dependency injection, readiness, and outcome-reporting portions of [Runtime interface](../architecture/game-library.md#runtime-interface).

## Round interface

Read [Getting ready](../player-flows/play-and-results.md#getting-ready) for the objective and controls, and [During play](../player-flows/play-and-results.md#during-play) for screen-space requirements. Use the score-presentation and automatic-leaderboard-entry portions of [Reading the result](../player-flows/play-and-results.md#reading-the-result).

## The leaderboard

Read [Interpreting a score](../player-flows/leaderboards.md#interpreting-a-score) for clear score units and ordering. For query work on the single board, use the best-result and player-placement behavior in [Leaderboard queries](../architecture/ranking-and-storage.md#leaderboard-queries).

Use the [shared-interface process](../../CONTRIBUTING.md#adding-or-changing-a-shared-interface) for the declarations needed to connect the game, frontend, and leaderboard.

For QA, use the agreed finish-game-to-leaderboard outcome above and the relevant interface requirements. [TESTING.md](../../TESTING.md) provides the test commands.
