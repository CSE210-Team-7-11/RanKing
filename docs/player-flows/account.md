# Account and public profiles

[Player flows](README.md)

A public profile lets someone discover a player's published achievements and find a score to beat. Account lets the owner inspect their own attempts and manage publication. This flow covers both views and the owner's controls for deleting old public copies while keeping valued scores.

## Visiting a profile

> **S39** As a player interested in someone else's performance, I want to see the achievements they've shared and find a score I'd like to beat.

The public profile identifies the player by display name, avatar, AT Protocol handle, and optional bio. **Published scores** groups their public records by game, showing the measure and date needed to interpret each result. A comparable* result offers **Beat this score**.

This list represents the records the player published to their AT account. Official leaderboards may also display eligible scores that were never published there. A directly shared score appears for its recipients under the sender on Friends. The public profile therefore shows the player's published collection, rather than an inventory of every score visible anywhere on RanKing.

## Reviewing personal progress

> **S3** As a returning player, I want to find my personal best and compare dated attempts so I can see my progress under the same rules.

> **S40** As a player, I want to review my attempts and control public sharing for the account I'm using.

The owner can inspect more than the public profile shows. Private Account identifies the connected account and shows personal bests by game and measure. Opening a game's history gives dated attempts with their score values, units, rules, and ranked or practice status, including unpublished attempts. The view distinguishes comparable results so that an apparent improvement is not simply a change of rules.

The mockup's Your Scores cards made dated results hard to inspect. Putting history under Account connects those records to the identity that owns them, and a dated view supports finding a particular attempt.

Account also contains the automatic publication preference for future rounds. With it off, the remembered checkbox beside **Play** and **Play again** controls the upcoming attempt. **Manage published scores** handles copies already on the AT account. The [post-result flow](play-and-results.md#publishing-to-at-protocol) explains when publication happens.

## Managing published scores

> **S41** As a player with a large published score history, I want to reclaim space on my AT account without having to remove each unwanted attempt individually.

> **S42** As a player with scores I value, I want to clear out old published attempts without losing milestones or records.

A player with many published attempts can clear older AT records while keeping milestones. This cleanup removes public copies; official results and private attempt history stay available.

### Keeping milestones

Players can mark a published score **Keep** from its result or Account. This protects milestones and records during later bulk cleanup without requiring the player to remember every important result while deleting a large history.

Kept scores are excluded from bulk deletion by default, even when all games and all dates are selected. During selection, the player can inspect the matches and mark additional scores to keep.

### Selecting a deletion batch

Under **Account -> Published scores -> Manage published scores**, the player chooses all games or specific games and selects **All dates** or **Older than [number] [days / weeks / months / years]**. An age filter shows its exact cutoff date. A configurable period accommodates different cleanup needs without imposing a fixed retention window.

Selection includes matching records across pages. The player can review individual results and remove them from the batch. The selector shows selected and excluded counts separately, while the batch is still editable:

> 240 scores selected  
> 3 scores excluded from selection  
> **Review deletion**

The excluded count explains why some matching scores will survive. It belongs with selection, where the player can change the batch.

### Confirming and completing deletion

**Review deletion** opens a separate confirmation identifying the public records to be deleted and the effect on the player's data:

> You're about to delete 240 published scores from your AT account.
>
> Your official leaderboard results and private RanKing history stay available.
>
> **Cancel**  
> **Delete 240 scores**

Confirmation applies to the reviewed batch. Separating it from the selector lets the player finish choosing records before verifying the destructive action. Bulk selection itself saves them from repeating that work page by page.

Confirmed deletions disappear from the profile's **Published scores**. A partial failure reports how many records were deleted and offers **Retry remaining** for unresolved records. Other apps may retain earlier copies. Deleting the AT record does not undo server acceptance or erase private attempt history.

The [publication design](../architecture/identity-and-sharing.md#published-score-cleanup) describes ownership and batch consistency during deletion and retries.

*comparable, as in able to be compared; not comparable, as in similar in size or scale.
