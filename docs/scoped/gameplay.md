# Gameplay and practice

[Documentation by task](README.md)

For round-interface work, read [Getting ready](../player-flows/play-and-results.md#getting-ready), [During play](../player-flows/play-and-results.md#during-play), and [Reading the result](../player-flows/play-and-results.md#reading-the-result). For the replay action, read the opening paragraph of [Replaying or practicing](../player-flows/play-and-results.md#replaying-or-practicing).

For game-host integration, read [Runtime interface](../architecture/game-library.md#runtime-interface). It covers launch dependencies, readiness, message ownership, and keeping credentials outside the frame. [ADR-0017](../decisions/0017-iframe-game-runtime.md#decision-outcome) explains the iframe choice. Communication and isolation questions are Q27-Q28 under [Game integration](../open-questions.md#game-integration).

For scoped practice, pair the [player flow](../player-flows/play-and-results.md#scoped-practice) with the [practice-hook contract](../architecture/game-library.md#scoped-practice-hooks). [ADR-0013](../decisions/0013-scoped-practice-hooks.md#decision-outcome) explains why games interpret summaries held by the host.

Playtests P10 and P11 cover the round and practice respectively under [Playing and comparing scores](../research/player-playtests.md#playing-and-comparing-scores). For score acceptance and failure recovery, follow the [validation guide](validation.md).
