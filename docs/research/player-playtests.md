# Player playtest proposals

[Player flows](../player-flows/README.md)

These scenarios test whether players understand and can complete the documented flows. The instructions are for the person conducting the session: prepare the test data, then ask the participant to carry out the task and observe their actions. Record what they expected and any help they needed.

Choose scenarios supported by the prototype and use the same build for each participant. A scenario that depends on an unresolved interaction waits for that design review.

Scenario IDs identify tasks for later reference; they do not prescribe an order for one long session. Fixture-based scenarios require prepared accounts or history. Product references motivated some questions, but the observations from these sessions will determine whether those patterns work for the app.

## Arrival and choosing a game

- **P1** Ask a participant who has not seen the site to open the public landing page and explain what it offers, what they would do first, and why. Ask them to continue to Home without connecting an account and explain which features would require one.

- **P2** As a guest, ask the participant to find a game on Home and interpret its standings. Ask which game and period the board shows, what the score measures, and which direction is better. In a prototype with multiple games, have them predict what will change when they select another game, then observe the switch.

- **P3** Ask the participant to begin connecting an account from the landing page or guest result and cancel before completing the connection. Observe whether they can resume what they were doing, and ask what must happen before a score can count toward rankings.

- **P7** Prepare a score link for a game that supports guest play, with a target outside the visible standings. Ask a signed-out participant to open it, and observe whether the target survives both guest play and connection. After an attempt that falls short, have them choose **Play again** and check that the next round retains the target. In a connected session, ask them to beat a friend's score and find how to send the validated result back.

- **P8** Prepare an account with play history for several games. On Home, ask the participant to start their last game, then find another game they play regularly. Observe whether they recognize the selected game, find their personal best if one exists, and understand what **Play** will start.

- **P9** Prepare Home with an unfamiliar game that is playable and one that needs adding from its Store page. Give the returning participant a reason to try something new. Observe how they choose a game, and ask how they can tell whether it is ready to play or needs to be added.

## Playing and comparing scores

- **P25** Have a guest finish a game with a score they want to keep. Ask them to save it and find it again. Separately, ask them to enter that score in the rankings. Observe whether they understand the account connection and validation needed for ranking, and check that the same result enters the leaderboard after acceptance without another round.

- **P10** Set the prototype to the smallest supported screen size and ask the participant to start and finish a round. Observe whether they know when their first input counts and can see the objective and reach the controls without page scrolling. While a ranked round is awaiting validation, ask what the provisional score means and when it counts.

- **P11** Prepare a scoped-practice prototype with several attempts that end at the same stage. Ask the participant what the suggested exercise would help them improve, then have them start it and explain how its result counts. Repeat with a fresh history and observe whether they can find ordinary practice.

- **P12** Prepare a game with two score measures and an account ranked below the top entries. Ask the participant to switch between **All-time**, **This week**, and **Friends** and explain which scores count and what determines their order. Have them find a nearby score to beat, then check that the ready screen and result retain its comparison measure.

## Store discovery and adding games

- **P13** Give three participants different starting points in the Store. Let one browse without a title or type in mind, ask another to find a competitive puzzle game, and ask the third to find an aim trainer that measures accuracy. Observe whether previews, categories, and search give each participant a suitable listing to open. [Store discovery review](../player-flows/store.md#browsing-and-narrowing-the-catalog)

- **P14** Show the participant listings for a puzzle with variable solve time, a competitive match, and a rhythm game with songs of different lengths. Ask what time commitment each listing describes and whether they can tell what changes when they choose another mode or song.

- **P15** Show the participant listings with different recommendation counts, including one with no ratings. Ask what vetting tells them, what they learn from reviews, and what would make them add one of the games.

- **P16** As a guest, ask the participant to find two games that do not require an account and add them from a filtered Store list. Include a game requiring an account in the list and check that they can identify that requirement before download. After the first addition, observe whether they can return to the list and continue browsing from the same place. After the second, ask them to find **Play** and **Open in Library**. Delay a game download and ask the participant to find and organize its Library entry before the download finishes. Then simulate a failed download and check that the entry remains. Separately, simulate a failed add and ask whether the game reached the Library. Once a guest-playable game has downloaded, ask them to complete a round and explain whether its score counts in the rankings.

## Library and personal history

- **P4** Prepare comparable results from two dates for the same game. Ask the participant to find the earlier result and explain how the attempts compare.

- **P5** Prepare a Library prototype with an earlier score for one of the games the participant will add. Ask them to add two games without playing either, then open the game with that history in the Library and remove and re-add it. Observe whether they can find its earlier score. Ask where they would expect an unavailable game to appear.

- **P17** Prepare a large Library and ask the participant to find a familiar game they have not played lately, then one added today. Observe whether they use Favorites, title search, or sorting. Have them add one game to two collections and delete one collection, then observe whether they can still find the game in the other collection and **All games**.

## Friends and score exchanges

- **P6** Ask a sender to share a score with a friend and then send a challenge through the same action. Ask the recipient to explain what each share asks. Check that **Beat this score** appears only on the challenge, then ask them to use it. After a validated winning attempt, observe whether they can find how to send their result back. Separately, ask the sender who could see the result if they chose public publication.

- **P18** Use two test accounts for the sender and recipient. Have the sender request a friendship and the recipient accept it. Ask each to identify who sent the request and when the friendship began. With an eligible score on each account, observe whether they can find each other on the Friends leaderboard.

- **P19** Prepare a recipient account with score challenges from two friends. Ask the participant to find a challenge sent by a named friend and decide whether to try it. Have them return later to open that score, beat it with a validated result, and send their result back.

## Profiles and cleanup

- **P20** Prepare a public profile and its owner's private Account with the same test history. Ask the participant to visit the profile as another player and find a published score to beat. After they switch to the owner's account, ask them to find an unpublished attempt and the publication setting. Ask them to explain which scores are visible in each view.

- **P21** Prepare published scores across several games and pages, with old milestones marked **Keep**. Ask the participant to select old records across all games, interpret the cutoff and excluded count, and confirm deletion. Simulate a partial failure and observe whether they can retry the remaining records and still find their official results and private history. [Bulk cleanup flow](../player-flows/account.md#selecting-a-deletion-batch)

## Creator updates and player reviews

- **P22** Have a creator submit a game whose listing advertises keyboard-only controls but whose build requires a pointer to start. Ask a reviewer to try it, describe what they encountered, and request a fix. Observe whether the creator can revise the build or listing and resubmit through the same submission.

- **P23** Prepare an admitted game with an earlier version installed, and an update ready to publish. With no moderator available, have the creator publish the update. Ask a player to open the existing installation online. With a critical update, verify that the app installs and launches the new version while retaining its Library entry and history. With a non-critical update and a slow connection, ask the player to defer the download and check that they can play the installed version. Repeat with an offline-capable game, asking the player to open it offline and again after reconnecting. Separately, make the update check fail while the player has an installed copy. Observe whether they can still play and understand that ranking and other online features are unavailable.

- **P24** Have a signed-in participant make a meaningful move in practice and leave early. Ask them to find **Review game**, submit a recommendation without text, then edit it from the listing after playing a new build. Verify that the edit still counts as one rating. Ask another participant to interpret an older written review and its played-version label. [Player review flow](../player-flows/reviews.md)
