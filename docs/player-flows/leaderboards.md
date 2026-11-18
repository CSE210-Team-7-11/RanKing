# Leaderboards

[Player flows](README.md)

Leaderboards give players goals at different scales. The overall leaders may be a useful target for one player and far out of reach for another. A resetting board creates a fresh contest, while a Friends board lets people compare with a smaller group they know. The same game therefore needs several views of eligible scores.

## Opening and switching boards

> **S8** As a player far behind the all-time leaders, I want to have a fresh opportunity to compete for first place.

> **S9** As a player with friends on RanKing, I want to compare my scores with theirs so we can compete with each other.

Opening the full leaderboard from Home or a result preserves the game and any selected board. The player sees the scope of the standings and their own rank and best eligible score when available. Their placement remains accessible even when they fall below the visible leaders; otherwise the page would show top performance without helping them find a useful next goal.

| Board | Scores included | Reason to use it |
| --- | --- | --- |
| **All-time** | Eligible results across all periods | See the strongest results and climb the long-running standings |
| **This week** | Eligible results for the current week | Compete for first place in a fresh period |
| **Friends** | The player's eligible results and those of accepted friends, with the period labeled | Compare with people the player knows |

Switching boards keeps the game selected and updates both the standings and the player's placement. **This week** shows when it resets so a player knows how much time remains to improve. The displayed period identifies which results belong to the board.

The [osu! rankings view](https://osu.ppy.sh/wiki/en/Client/Interface#rankings) was a reference for keeping standings with the selected game and showing the player's own result, including when they are outside the leaders.

Players can switch games and control how much of a board is visible. They must also be able to browse near their own placement, rather than only paging through the leaders to reach it. The mockup review identified both needs.

## Interpreting a score

[ADR-0015](../decisions/0015-multiple-scores-per-game.md)

> **S24** As a player comparing scores, I want to tell at a glance what each number measures and which score I'm trying to beat.

For a simple score, the unit can carry the explanation. A reaction-time value in **ms** ordinarily needs no extra paragraph about how time is measured. If a game reports several measures, short labels distinguish them: **Clicks/s** and **Accuracy (%)** describe different aspects of an aim-training attempt.

The board must make its ordering clear when either displayed value could explain the rank. This does not require surrounding every score with scoring instructions. An explanation is useful when the comparison would otherwise be ambiguous, such as a board ordered by a combined rule.

Games can report multiple scores for one round, as agreed in the meeting. Which measures have their own boards, which appear as context, and whether a game uses a combined ordering remain game-specific decisions.

## Choosing a target

> **S25** As a ranked player, I want to see my place on the board and pick a score to beat in my next round.

A player can inspect the leaders or look near their own rank and choose **Beat this score**. The game opens with that result as the target, including who set it and the measure or comparison rule to beat. The ready screen and result must use that same comparison.

Replay retains the chosen result until it is beaten. The target is a saved result, so it remains the goal if its owner drops a rank or a new week begins. This preserves the player's intent across attempts instead of making them continually reselect a moving position on the board.

The [ranking design](../architecture/ranking-and-storage.md#leaderboard-queries) covers querying accepted results.
