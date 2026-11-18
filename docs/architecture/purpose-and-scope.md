# Purpose and scope

[Design and architecture](README.md)

The app is a social leaderboard platform for comparing scores and sharing the experience of playing with friends and the wider world. Players can work toward a personal goal while their results become part of an ongoing competition or an exchange with friends. Those connections can continue even when people play at different times.

This page explains the player needs behind the agreed product and how much of it the team plans to build in the first release.

## Competition and personal progress

Players choose the scale of competition that interests them:

- The all-time leaderboard offers a long-running goal and records the strongest eligible scores.
- A resetting board offers a fresh chance at first place over a period such as a week, even when the all-time leaders are out of reach.
- A Friends board makes the comparison relevant to a smaller group who know each other.
- Sending a friend a score to beat starts an exchange that either person can continue on their own schedule.

Friends can trade scores over time without being online together. This back-and-forth competition is a score battle; players decide how long to continue it.

Personal progress is also a reason to use the app. A player working toward a personal best needs to compare their attempt with their own earlier results under the same rules. Improving that score can be worthwhile even when it leaves their leaderboard position unchanged. The [Account flow](../player-flows/account.md#reviewing-personal-progress) describes how they inspect that history.

Someone may simply want to test their skill at a game and see how they did. A single attempt and an understandable result can satisfy that goal. These players need a useful first visit even if they never return or choose to compete for a rank.

### A first visit

The November 9 meeting anticipated many one-time visitors and considered ways to retain those who enjoyed playing. Guest play gives a visitor a way to try a game before committing to an account.

Guests can browse and play games that do not require an account. Ranked participation and social features require account connection. The [arrival and Home flow](../player-flows/arrival-and-home.md) describes how visitors discover those options.

## Leaderboard entry and score sharing

Sharing lets a player bring other people into their experience, whether they want friends to see a result, invite someone to beat it, or publish an achievement more widely. A direct share addresses chosen recipients in the app. Public AT publication puts a score record under the player's own account for their profile and compatible apps to display.

Some players want to share results routinely; others want to publish only selected achievements. The [round and result flow](../player-flows/play-and-results.md#publishing-to-at-protocol) describes how publication supports both goals.

Leaderboard entry is automatic for eligible ranked results so that the player can move from an attempt to comparison or replay without a separate submission step. The game's validation handler must approve the result before the ranking server records it in the standings. Sending the score to a friend or publishing a public copy remains an independent choice; neither is required for entry to the official standings.

## Platform requirements

Games use a common interface to integrate with the app while defining their own mechanics and score validation. Sudoku's puzzle generation and finish conditions therefore belong to the game, alongside its scoring rules. The host and ranking interface must also accommodate other games without depending on those mechanics.

AT Protocol is an assignment requirement. Browser-managed AT OAuth connects accounts, and [AT service-token verification](../decisions/0023-authenticate-ranked-requests-with-at-tokens.md) authenticates ranked requests.

## Release scope

[ADR-0002](../decisions/0002-mvp-scope.md)

The MVP includes Sudoku and one working leaderboard. The meeting approved one fleshed-out game and one leaderboard by six votes in favor and two abstentions, and Sudoku was subsequently chosen as the game. A player can finish a game and have their score count on the shared leaderboard. Score validation and public AT score publication are outside the MVP.
