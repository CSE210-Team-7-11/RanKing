# Landing page and Home

[Player flows](README.md)

The landing page explains what RanKing offers and why someone might want to use it. Home brings standings and personal bests together with playable games so guests and connected players can choose their next attempt.

The November 9 meeting anticipated many one-time visitors or visitors arriving in waves. The separate landing page gives newcomers an introduction before they explore Home. Home is available without an account, so visitors can find something to play before deciding whether ranking and social features make connecting worthwhile.

A visitor arriving through a score link already has a game and target in mind. That target stays selected as the player continues into play.

## The landing page

> **S16** As a first-time visitor, I want to understand what I can do with and without an account so I can decide whether to connect one.

The page introduces score comparison and sharing with friends and the wider world. It explains what visitors can try as guests and what connecting an account enables, so they can decide how to continue.

Visitors can go directly to Home without connecting an account. They can also connect through browser-managed AT OAuth for ranked play and social features. Connection preserves any game or target already selected.

## Guest play

> **S1** As a visitor, I want to try a game immediately so I can tell whether I enjoy it.

Guests can use Home to discover games and the local Library to keep games they add. They can download and play games that do not require an account. Listings identify account requirements before download so a guest can choose a game they can play.

Gameplay takes place in the game's play flow. Scores remain unranked while the player is a guest. They can still be compared with a target or standings when the rules match, and replay remains available from the result.

> **S50** As a guest who just earned an unexpectedly good score, I want to save it so I can find it again later.

A guest may want to keep a result even if they have no interest in the leaderboard. Saving serves that goal by making the score available to revisit.

> **S51** As a guest who just earned a competitive score, I want to enter it in the rankings.

A guest who wants that score to count in the rankings can create or connect an account and submit the completed result for validation. If accepted, it enters the official rankings without requiring another round. The result and the evidence needed to validate it must survive connection, along with the game and any selected target.

## Home

> **S6** As a player deciding what to play, I want to find a game that interests me or a score I'd like to beat.

> **S17** As a returning player, I want to get back to a familiar game quickly.

> **S18** As a player who wants a change, I want to discover an unfamiliar game I'd enjoy playing.

Home shows games alongside the selected game's standings. The player can choose because a game interests them or because they see a score they want to beat. Selecting another game updates the objective and standings together. Guests can start games that support play without an account; a game requiring one must make that requirement clear. A comparable personal best appears when one is available, giving a returning player a reference for their next attempt.

The initial selection follows the reason for the visit:

| Arrival | Initial selection |
| --- | --- |
| Score link, including after connecting | The referenced game and target |
| Connection from a guest result, without a linked target | The game just played |
| Ordinary return with playable history | The most recently played game that is still playable |
| First visit or no playable recent game | A featured playable game |

A featured default would put discovery first on every ordinary visit. Selecting the most recent playable game instead gives returning players a shorter route back to familiar play. Home needs play history and current availability to make that selection, with a featured game as the fallback.

Other recent games stay within reach so that a familiar game does not require a trip through the full Library. Discovery also has a visible place on Home: recent play alone would keep showing a returning player the same choices. An unfamiliar game that is already playable can be started directly. A game that needs adding opens its Store listing, where the player can inspect it first.

A player who wants to search beyond Home's suggestions can open the Store and inspect listings. Someone looking through games they have already added can open the Library, where search and personal collections help them find a game.

[Steam's homepage](https://store.steampowered.com/) was a reference for Home as a place to find familiar games and discover new ones.

## Entry with a score to beat

> **S7** As a player arriving with a score I want to beat, I want to find the game and try to beat that score.

A score ID or AT link opens Home with the referenced game and target selected, whether or not the player has connected an account. The player sees the score and who set it. If the game supports play without an account, a guest can try to beat the target with an unranked result. A game requiring an account identifies that requirement before play.

Connecting preserves the completed result as well as the selected game and target. Replay keeps an unbeaten target. The player is trying to beat a particular result, so a change in its leaderboard position or the start of a new week does not replace it.
