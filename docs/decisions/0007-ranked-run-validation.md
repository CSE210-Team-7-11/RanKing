---
status: proposed
date: 2026-11-16
---

# ADR-0007 | Authenticate the issued context for ranked submissions

## Context and Problem Statement

A ranked submission must be evaluated against the run the server issued, including its original issuance time. The intended protection is against presenting evidence from elsewhere as an attempt for that run. The server must also retain its own issuance time rather than accept a replacement supplied by the player.

The server can recover the issued values from its stored record. A signed copy would let a verifier authenticate those values without trusting the browser, but would not by itself establish that submitted gameplay evidence belongs to the run. We need to determine whether that additional verification is useful for submissions back to RanKing and how each game's evidence establishes its relationship to the issued run.

## Considered Options

- Look up the server's stored issuance record when processing the submission.
- Look up that record and also verify a signed copy of the issued run ID and timestamp.

## Proposed Outcome

[ADR-0003](0003-server-validated-rankings.md)

Run issuance before ranked play is agreed. For play started by a connected player, the server records the issuance time and the run's owner, along with the game configuration needed for validation. Whether to require a signed copy of the issued values is undecided.

Guest run evidence is retained temporarily in the browser and submitted under the player's account once it is connected. Successful validation makes that completed result eligible for ranking.

The game-provided handler must determine whether the submitted evidence satisfies that run's validation contract. Where the game supports it, a server-assigned challenge can make the evidence depend on the particular issued attempt. The platform supplies the recorded context, and the game defines and checks the relationship. Merely labeling evidence with a run ID does not establish how it was produced.

### Consequences

- Good, because server-recorded issuance gives validation a timestamp and run context that the player cannot replace through a submission.
- Bad, because the relationship between evidence and an issued attempt needs a game-specific validation contract. A signature over the run ID and timestamp cannot supply that contract.

## Pros and Cons of the Options

### Look up the stored issuance record

- Good, because the server uses its original values while checking ownership and run eligibility. It does not need to trust a timestamp returned by the browser.
- Bad, because a component needing authoritative issuance context must obtain it from RanKing or have access to the trusted record.

### Also verify a signed issuance copy

- Good, because a verifier can check that the signed values came from the issuer and have not been altered. With a public-key signature, another service could verify that copy without receiving the signing key.
- Bad, because signing adds key management and verification while the stored run is still needed for ownership and result handling.
- Bad, because an intact signed copy can be replayed or submitted with different evidence. Signing the issued values alone does not authenticate evidence created afterward.

## More Information

The [JWS specification](https://datatracker.ietf.org/doc/html/rfc7515) defines signatures and message authentication codes over supplied content, if you have not taken CSE107 or an equivalent introductory cybersecurity course. A signature protects the content covered by it, so the choice of signer and signed content determines the guarantee.

A key derived only from a run ID and timestamp known to the player would also be available to that player. Browser-held signing credentials cannot establish that the player-controlled browser produced honest evidence. Server signing after validation could attest to the evidence accepted, but would serve as a receipt rather than establish that the gameplay occurred during the run.

Equivalent retries return the accepted result under [ADR-0030](0030-one-result-per-run.md). Late-submission eligibility and browser recovery are separate unresolved design questions.
