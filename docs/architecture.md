# RanKing design and architecture

RanKing is a social leaderboard platform for comparing scores and sharing the experience of playing with friends and the wider world. Leaderboards give players goals against others, while personal bests give them a way to measure their own progress. A shared result can celebrate an achievement or become a challenge that friends trade back and forth.

This guide explains how the frontend, games, and ranking server support those player experiences.

## Product design

[Purpose and scope](architecture/purpose-and-scope.md) explains the reasons to play and the boundary of the first release. The [user stories](user-stories.md) collect the player and creator goals, and the [player flows](architecture/player-experience.md) describe the agreed experience for those goals. The [playtest proposals](research/player-playtests.md) describe tasks for evaluating those flows with players as prototypes become available.

## System design

The system needs comparable results for standings and clear control over where scores are shared. The [system structure](architecture/system-structure.md) gives the ranking server authority over official results and keeps AT account access in the browser host.

- [Ranked run lifecycle](architecture/event-model.md) follows a ranked attempt into the official results, including acceptance when a response is lost. [Ranking and storage](architecture/ranking-and-storage.md) proposes how the platform routes submissions to game handlers, stores their outcomes, and queries standings.
- [Identity and score sharing](architecture/identity-and-sharing.md) covers account connection and the distinction between sending a score to friends and publishing it publicly, including deletion of public copies.
- [Game runtime and local Library](architecture/game-library.md) covers how games integrate with the platform, from installation to reporting a round's outcome and suggesting practice.

## Building and operating the system

Implementing those interfaces requires work across the team before a complete player flow can be tested. [Delivery and verification](architecture/delivery.md) proposes the handoffs and integration sequence for the first ranked game. The [deployment proposal](architecture/deployment.md) considers where that integrated system runs and how its results survive updates or failures. Local setup and commands are in the [README](../README.md).
