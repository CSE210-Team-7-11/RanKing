---
status: accepted
---

# ADR-0014 | Represent shared scores and challenges with one protocol object

## Context and Problem Statement

A player might want friends to see a result or ask one of them to beat it. Both involve sending a score to chosen recipients, who can use it as a target in either case. The protocol needs to carry the sender's intent while supporting the same exchange of results.

## Considered Options

- Separate protocol object types for shared scores and challenges.
- One score-share object with a challenge flag.

## Decision Outcome

Use one score-share object with a challenge flag because the result reference and recipient handling are the same for both intents. Set the flag when the sender asks the recipient to beat the score. It changes how the invitation is presented; either value allows the recipient to play against the score and send a better result back.

**Share score** and a dedicated **Challenge** action can both create this object. The protocol choice leaves the number and placement of UI actions to the player-flow design. The [score-share payload](../architecture/identity-and-sharing.md#direct-score-sharing) describes the proposed fields; transport and group delivery remain open.

### Consequences

- Good, because score delivery and retrieval use the same object regardless of whether the sender is celebrating a result or asking someone to beat it.
- Bad, because changes to the common object must remain compatible with both ordinary shares and challenges.

## Pros and Cons of the Options

### Separate protocol object types

- Good, because each type can evolve independently if sharing and challenges acquire different requirements.
- Bad, because readers and writers must handle two object types for an exchange that currently uses the same result and recipient information.

### One score-share object with a challenge flag

- Good, because both intents use one contract for sending and receiving a score while retaining the distinction the sender chose.
- Bad, because the shared contract couples changes to fields used by both intents.
