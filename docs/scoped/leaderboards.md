# Leaderboards

[Documentation by task](README.md)

For display and interaction, choose the relevant section:

- [Opening and switching boards](../player-flows/leaderboards.md#opening-and-switching-boards): scope, periods, game selection, and the player's placement.
- [Interpreting a score](../player-flows/leaderboards.md#interpreting-a-score): units, multiple measures, and ordering.
- [Choosing a target](../player-flows/leaderboards.md#choosing-a-target): selecting a saved result to beat and retaining it during replay.

For backend work, [Leaderboard queries](../architecture/ranking-and-storage.md#leaderboard-queries) defines eligible entries and the queries needed for leaders and nearby scores. If changing the score contract, read [ADR-0015](../decisions/0015-multiple-scores-per-game.md#decision-outcome). Tie handling is Q19 under [Ranked submissions](../open-questions.md#ranked-submissions).

Playtest P12 under [Playing and comparing scores](../research/player-playtests.md#playing-and-comparing-scores) covers board switching and comparison. For submission processing, follow the [validation guide](validation.md).
