# Playing a round and using its result

[Player flows](README.md)

A round gives the player a result to compare with a target or personal best, share with other people, or use to judge their own performance. Eligible ranked scores are submitted automatically, so the result can lead directly to the player's next action. This walkthrough describes the controls and feedback needed before starting a round, during play, and when deciding what to do with the result.

## Playing a round

> **S19** As a player starting a round, I want to know when the round starts and see how I did when it ends.

> **S2** As a competitor who has finished a round, I want my score to count on the leaderboard.

### Getting ready

Choosing **Play** opens the selected game with its objective and required controls visible. A ready cue establishes when input starts to count; its form depends on the game. If the player selected a score to beat, they see that target before starting. This prevents a player from spending their first attempt discovering that play had already begun or that they were comparing against the wrong result.

Guests can play games that do not require an account and receive unranked scores. For a player starting ranked play while connected, the browser requests a server-issued run. The browser supplies the game with the launch configuration for that run. The app handles this distinction through the game interface; each game still defines its own mechanics and completion conditions.

For a ranked round, the [publication preference](#publishing-to-at-protocol) determines whether an eligible result will be published publicly. The player must be able to see that choice before starting.

### During play

The active round must keep the current objective visible and every required gameplay control reachable without scrolling the page. A timer, live score, progress indicator, or target remains visible when the player needs it to decide what to do. Each game chooses the arrangement that supports its mechanics.

These constraints apply across games with very different interfaces. A game may need continuous pointer input, a board full of controls, or a view of upcoming events. The game supplies that interface; the host must allow enough room for it. Desktop is the initial supported target, with mobile considered for later work.

### Reading the result

The result leads with the score. A selected target appears beside the comparable result with an indication of whether it was beaten. A new personal best can show the previous comparable best so the player can see the improvement. Comparisons use the same rules and score measure; two numbers from different modes do not become comparable merely because they share a unit.

A guest can save a result to revisit later. If they also want it to count in the rankings, they can create or connect an account and have that completed result validated. The result and its validation evidence must survive connection. The [guest flow](arrival-and-home.md#guest-play) describes both goals.

The status of the attempt determines how the player should interpret that score:

| Attempt state | Result shown |
| --- | --- |
| Guest play | The score identified as unranked and, where rules match, a comparison with standings or the selected target |
| Practice | A **Practice** label and, where rules match, a comparison with standings |
| Ranked submission awaiting validation | The provisional score with **Checking score** |
| Accepted ranked result | The verified score and its standing under the board's rules |
| Final rejection | The reason and a way to start another attempt |

If the submission response is lost, the server may already have accepted the score while the browser has no confirmation. How the player sees and recovers from that situation remains undecided. The [ranked event model](../architecture/event-model.md#acceptance-with-a-lost-response) describes the server behavior.

Acceptance adds an eligible result to the leaderboard automatically. It may leave the player's rank unchanged when they already have a better score. There is no second submission step between receiving a result and choosing what to do next.

The leads' mockup review identified the submission button as an unnecessary step after choosing ranked play. A manual button would let players withhold completed attempts, but would also require them to remember to submit every score they wanted counted. Automatic submission lets them proceed directly to another attempt or use the result.

## Replaying or practicing

> **S22** As a player who just finished a round, I want to try again right away.

**Play again** starts a fresh round of the same game. An unbeaten target stays selected, including after its rank changes or a weekly board resets. This lets a player keep trying without having to find the original score after each attempt.

### Scoped practice

[ADR-0013](../decisions/0013-scoped-practice-hooks.md)

> **S20** As a player trying to improve, I want to understand where I struggle and practice those parts of the game.

A player who wants to work on a particular difficulty can choose scoped practice when the game supports it. The game uses compatible summaries of earlier attempts to suggest an exercise and supplies a reason the player can understand. For example, repeated failures at one stage could lead to an exercise for that stage. The host offers the exercise; the game decides what the player should practice and implements it.

Ordinary practice remains available when there is no hook, insufficient history, or no useful suggestion. All practice results remain practice results. The [practice integration](../architecture/game-library.md#scoped-practice-hooks) describes how games use the summaries retained by the host.

## Sharing scores

An accepted score can be sent to chosen recipients or published publicly. These are independent choices, so sharing with a friend does not change the account's publication preference.

### Sending a score to a friend

[ADR-0014](../decisions/0014-score-sharing-and-challenges.md)

> **S21** As a player with a score I want friends to see, I want to share it with those friends.

> **S10** As a player with a friendly rival, I want us to keep trying to outscore each other even when we can't play at the same time.

A player who wants someone else to see the result can choose **Share score** once it is validated. The sender previews the result, chooses a friend or group, and can mark it as a challenge. Both intents use the same protocol object for the score and recipients. Its challenge flag enables **Beat this score** for the recipient; an ordinary share displays the score without that action. The same object supports a dedicated **Challenge** action with the flag already set, so the protocol works with either arrangement.

Received scores appear under their sender on Friends. For a challenge, **Beat this score** opens the target for a new round. After beating it with a validated result, **Send score back** opens the sharing flow with the original sender selected. Either player can continue the exchange whenever they are ready. Score timestamps let them apply a deadline they agree on themselves; the app does not impose a deadline.

Sending to a friend works independently of public publication. The [Friends flow](friends.md) covers requests and returning to received scores.

### Publishing to AT Protocol

> **S11** As a player who regularly shares results, I want to keep people outside RanKing up to date with how I'm doing.

> **S12** As a competitor who only wants to share some results publicly, I want to choose which scores I publish.

> **S5** As a player who just did much better than expected, I want to share that achievement publicly.

Public publication puts a copy of an eligible result on the player's AT account for their public profile and compatible external apps.

The account's publication preference applies to the upcoming round. After the player authorizes public sharing, this preference defaults to automatic publishing. With that preference on, eligible scores publish after validation. With it off, a checkbox beside **Play** and **Play again** applies to the upcoming attempt and remembers the player's last choice.

This choice controls publication to AT Protocol; eligible ranked results enter the leaderboard automatically either way. It carries into the round and takes effect after validation, without another confirmation.

Requiring a Publish action after every result would let players see each score before deciding, but would also make routine sharing interrupt every round. The preference allows that sharing to happen automatically. Before play, the controls must show whether the upcoming result will be published, including when the checkbox remembers an earlier choice. Otherwise a player may unknowingly publish a later attempt.

A player can also publish an eligible result after seeing it. An unexpected weekly first place is a reason to share even if the player had left the checkbox clear. The publication flow shows what becomes public and provides a link when it succeeds. If publication fails, the validated result remains available and publication can be retried.

The publication setting and older public copies are managed in [Account](account.md). The [identity and sharing design](../architecture/identity-and-sharing.md#public-at-records) describes publication and cleanup.
