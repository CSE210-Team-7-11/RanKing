# Using the Library

[Player flows](README.md)

The Library holds games added on this browser and is available to guests as well as connected players. Its main task is to help a player get to a game they already chose, including when the collection has grown too large to scan. Recent play is a useful starting order, but it cannot replace a way to find an old favorite or games saved for a particular occasion.

## Opening and finding games

> **S32** As a player returning to a game I've added, I want to find it and start playing.

> **S35** As a player who remembers a game's name, I want to find it in my Library without looking through every entry.

**All games** shows the whole collection, including games that have not been downloaded, and defaults to **Recently played**. Adding a game creates its entry immediately, with download readiness shown separately. A player arriving through **Open in Library** from the Store goes directly to the new entry. Playable entries offer **Play**; an empty Library offers **Browse Store** so there is a way to begin building the collection.

Title search works across the full Library or within a collection. Players can switch the sort to **Title** or **Recently added**. This gives someone who has never organized their games a way to find a familiar title or something they just added.

## Favorites and collections

> **S33** As a player with a few go-to games I haven't played recently, I want to find them quickly.

> **S34** As a player with a large Library, I want to find the games I use for a particular activity without looking through the whole collection.

Favorites serve a different purpose from recent play. Starring a game keeps it accessible in **Favorites**. The player can star or unstar it from its Library entry without maintaining a collection for that purpose.

Players can create named collections for their own uses, such as games for a short break or games they want to practice. A game can belong to several collections, since those uses can overlap. Every added game remains in **All games** so organization never makes it disappear from the full Library.

Search and sorting can find games without any organization work, but cannot preserve a player's chosen groups. Favorites and collections provide that option without requiring everyone to maintain them. The app must retain those memberships, and players maintain the groupings they choose to create. The [Steam Library](https://store.steampowered.com/libraryupdate) was a reference for using collections alongside recent play and sorting.

Deleting a collection removes the grouping and leaves its games in the Library, with their downloads unchanged. Removing a game is a separate action available on its entry and Store listing.

## Launching a game

> **S36** As a player whose Library game is unavailable, I want to know why I can't play it and what I can do next.

> **S49** As a player with a slow or limited connection, I want to start a game I already have without a long download using up my time or data.

Guests can download and launch games that do not require an account, receiving unranked scores. A game with an account requirement identifies it before download and play.

A game can be in the Library before its assets are available. If it needs a download before play, the entry shows that status and remains in the Library if the download fails.

When a player opens an added game online, the app checks for updates. Updates marked critical by their author must be installed before online play. For a non-critical update, the player can defer the download and play the installed version. The app handles installation when the update proceeds, so the player does not need to manage versions manually.

This gives someone on an extremely slow connection a way to play without waiting for a routine update. Players need to be able to tell whether an update is required or can wait. Background downloads and prefetching are enabled by default and can be disabled. The download preference applies independently of the choice to defer an update.

If the update check fails or the player is offline, an offline-capable game can still use its installed copy without ranking or other online features. The app checks again on the next online open. An older version remains eligible for new ranked submissions for 24 hours after its replacement is published. Valid historical results remain in the standings unless revoked because a game-breaking bug made them invalid.

If a game cannot launch, its entry explains the availability problem and offers the listing when available or removal. The [installation design](../architecture/game-library.md#install-and-update-lifecycle) preserves the last complete copy during replacement and allows offline play when an update check fails.

## Removing a game

> **S15** As a player with games I no longer play, I want to tidy up my Library without losing my past results.

A player clearing out their Library can remove a game from its entry or Store listing. Removing it keeps its scores. If the player adds it again, their earlier results remain associated with the same game.

The mockup review established removal from both contexts and score retention.
