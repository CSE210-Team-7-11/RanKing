# Finding and adding games

[Player flows](README.md)

The Store helps a player decide which games to add. A player may arrive without a plan, with a rough idea, or knowing a game type but no title. The flow takes each of those players from discovery to a listing, where they can assess the game before adding it. Adding then leaves them free to keep browsing or start playing.

## Browsing and narrowing the catalog

> **S26** As a player who hasn't decided what to play, I want to browse games and see what catches my eye.

> **S27** As a player with a rough idea of what I want, I want to find games that fit my mood and the time I have.

> **S28** As a player who knows the type of game and features I want but doesn't know any titles, I want to find games that match.

A player with no particular game in mind can scan gameplay previews and short descriptions. These need to show what the player does; a title or category alone may say little about an unfamiliar game. Opening an entry leads to its listing, with a way back to the same place in the catalog.

The [Steam tag system](https://partner.steamgames.com/doc/store/tags) and [Coolmath Games catalog](https://www.coolmathgames.com/) were references for discovery by category and gameplay description.

A player with a rough idea can choose a category and narrow the results with visible filters. Categories apply to the same catalog as search, and a game can belong to several relevant categories. Filters can be combined and removed individually so the player can see why a game is included and broaden a search that became too restrictive.

A player who knows the type or features they want can search without knowing a game's title. Search covers descriptions and categories as well as titles and creators, with aliases for common terms such as "aim trainer" and "Aim training."

Listings use a shared vocabulary for game types and tags, checked during vetting. Capability filters come from reviewed listing data or platform metadata. Where capabilities vary by mode, all selected filters must match the same playable mode: keyboard support in one mode and ranked play in another do not establish a ranked keyboard mode.

A game can measure accuracy while ordering its leaderboard by another value. A search for accuracy training should be able to identify that capability without implying that accuracy determines the rank.

The catalog needs to describe games with different mechanics and modes. These examples show the information a listing can provide without assuming that every game is a short timed exercise.

| Game type | Discovery information | Time information |
| --- | --- | --- |
| Sudoku | Puzzle or Number puzzle; a preview of the grid and available puzzle type | Solve time varies. Difficulty or resumability may help the player decide, where offered. |
| Aim trainer | Aim training; available exercises and score measures | A timed exercise can state its own duration. Other exercises may end differently. |
| 3D shooter | Shooter, with 3D and supported controls or modes as descriptors | Duration depends on the mode; a fixed cap can be stated for that mode. |
| Minesweeper 99 | Puzzle and competitive play where offered; a preview showing new rows entering at the top | Describe the match's end condition. Actual length may depend on play. |
| Rhythm game | Rhythm; supported controls and content selection | Song lengths vary and can be shown when choosing a song. |

### Describing the time commitment

Time available can influence that search, but the catalog cannot assume that every game has a fixed round length. A puzzle's solve time varies with the player and puzzle. A competitive match may end through play. A rhythm game can offer songs of different lengths.

The listing should describe the commitment the game can substantiate. A mode that enforces a duration bound can state it, while a song picker can show individual song lengths. The existence of a two-minute song does not justify describing the entire rhythm game as a two-minute game. Those durations answer different questions and must retain their meaning in discovery controls.

## Inspecting a listing

[ADR-0022](../decisions/0022-store-submission-and-automatic-updates.md)

> **S29** As a player considering an unfamiliar game, I want to avoid wasting time on a game that doesn't work as advertised.

> **S30** As a player deciding whether to try a game, I want to hear what people who have played it think of it.

Guests and connected players can browse the Store and open a game listing. It shows gameplay, identifies the creator, and describes controls or modes that could affect the decision to add. The listing states whether play requires an account before the player downloads the game. Ranking options and score measures belong here when they distinguish the experience. The player should be able to connect the description to something visible in the preview.

Every Store game passes initial vetting for reasonable effort. Reviewers check that its main flow is playable and that the listing describes the submitted build accurately. Admission establishes that basic standard; player reviews help a visitor judge whether people enjoyed the game.

The leads' mockup review found Reaction Time and Sequence Memory boring despite smooth interaction. That feedback is why admission checks are accompanied by player opinions about enjoyment.

The listing shows the proportion of players who recommend the game and the number who voted. A single recommendation should not look like broad agreement, and a game with no ratings needs an explicit zero-ratings state. Written reviews identify the build played so a visitor can judge whether feedback may describe an older version. The [review flow](reviews.md) explains eligibility and editing.

## Adding without interrupting browsing

> **S4** As a player who finds an interesting game, I want to understand what it offers and be able to find it again when I want to play.

> **S14** As a player browsing for games to play later, I want to save the ones that interest me and keep looking.

**Add to Library** creates the game's entry on this browser immediately and confirms success on the listing. Guests can add games to this local Library and download games that support play without an account. Adding does not wait for a download to finish. It then offers **Play** and **Open in Library**, alongside the route back to browsing. **Open in Library** selects the newly added entry rather than making the player find it again.

This follows the mockup review's observation that some players add several games in one visit. Starting the first game automatically would interrupt that task. Returning to the Store therefore restores the search, filters, and position in the list. A failed add leaves the player on the listing with an explanation and a retry when appropriate.

A player who wants to start immediately takes one additional action by choosing **Play**. Keeping it beside the confirmation gives them a direct route into the game while allowing other players to continue browsing. Play may require downloading assets first. A failed download leaves the game in the Library.

After a game has been added, removal is available from its listing and from the Library. Removing it preserves score history, so it can be added again without losing earlier results. The leads considered this a reversible action that does not need an extra confirmation barrier.

The [Library flow](library.md) continues with finding and organizing added games.
