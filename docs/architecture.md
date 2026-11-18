# RanKing design and architecture

RanKing is a social leaderboard platform for comparing scores and sharing the experience of playing with friends and the wider world. Leaderboards give players goals against others, while personal bests give them a way to measure their own progress. A shared result can celebrate an achievement or become a challenge that friends trade back and forth.

This guide records the agreed design for how the frontend, games, and ranking server support the planned product. Unresolved decisions are collected in [Open questions](open-questions.md). Its architecture extends beyond the [MVP scope](decisions/0002-mvp-scope.md), which is Sudoku and one working leaderboard without score validation.

## Product design

[Purpose and scope](architecture/purpose-and-scope.md) explains the reasons to play and the boundary of the first release. The [user stories](user-stories.md) collect the player and creator goals, and the [player flows](architecture/player-experience.md) describe the agreed experience for those goals. The [playtest proposals](research/player-playtests.md) describe tasks for evaluating those flows with players as prototypes become available.

## System design

The system needs comparable results for standings and clear control over where scores are shared. The [system structure](architecture/system-structure.md) gives the ranking server authority over official results and keeps AT account access in the browser host.

- [Ranked run lifecycle](architecture/event-model.md) follows a ranked attempt into the official results, including acceptance when a response is lost. [Ranking and storage](architecture/ranking-and-storage.md) describes the validation boundary and the results used for standings.
- [Identity and score sharing](architecture/identity-and-sharing.md) covers account connection and the distinction between sending a score to friends and publishing it publicly, including deletion of public copies.
- [Game runtime and local Library](architecture/game-library.md) covers how games integrate with the platform, from installation to reporting a round's outcome and suggesting practice.

## Building and operating the system

Implementing those interfaces requires work across the team before a complete player flow can be tested. [Integration and verification](architecture/delivery.md) describes the shared interfaces and behavior the team needs to preserve as it implements the app. [Deployment](architecture/deployment.md) records the test and live environments and our responsibility for distributing games. Local setup and commands are in the [README](../README.md).
