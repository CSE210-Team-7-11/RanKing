---
status: accepted
date: 2026-11-16
---

# ADR-0008 | Keep official rankings independent of AT publication

## Context and Problem Statement

Players can [choose which scores to publish](../player-flows/play-and-results.md#publishing-to-at-protocol) to their AT account and delete those copies later. A publication preference or storage cleanup should not alter an already accepted ranking. Direct sharing with a friend must also work without requiring a public AT record.

## Considered Options

- Build official standings from eligible records currently published on AT Protocol.
- Build official standings from accepted results stored by RanKing and publish optional copies to AT Protocol.

## Decision Outcome

Build official standings from accepted results stored by RanKing. Public AT records are copies that players control independently. This lets players change what they publish without changing which validated attempts count toward their standings.

Include a reference to the official result in each published copy. Other apps can use it to check the published score against the result RanKing accepted, since a player-controlled AT record alone cannot establish that acceptance.

### Consequences

- Good, because deleting a public copy or encountering a publication outage leaves the official result and private attempt history intact.
- Good, because leaderboard participation and direct sharing do not require public publication.
- Bad, because we must maintain storage for official results independently of the player's AT records and implement publication failure handling separately from ranked acceptance.
- Bad, because checking a published score through its official-result reference depends on RanKing being available.

## Pros and Cons of the Options

### Published records as the standings source

- Good, because the public records would supply the scores used to reconstruct standings, with their availability controlled through the player's AT account.
- Bad, because deleting or withholding a record would change official standings even when the underlying attempt had already been accepted.

### RanKing results with optional public copies

- Good, because official acceptance survives changes to public copies.
- Bad, because a public copy alone does not prove that RanKing accepted its contents. External verification requires a reference to RanKing or another proof mechanism.

## More Information

Signed attestations are outside the MVP. The official-result reference provides a way to check acceptance without requiring them.

The [Account flow](../player-flows/account.md) defines published scores on profiles and the private controls for history and publication.
