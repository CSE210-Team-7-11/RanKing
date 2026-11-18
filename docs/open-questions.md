# Open questions

This list tracks unresolved architecture and tooling decisions affecting the documented design and near-future work. The player-flow documents state the behavior the system must support; UI layout and control choices belong to frontend design.

## Development

- **Q02 - Coverage gate.** Which coverage tool and acceptance criteria should gate promotion to `main` on the basis of test coverage? [CI requirements](decisions/0027-browser-checks-by-branch.md#decision-outcome)

## Ranked submissions

- **Q13 - Issuance and evidence binding.** Does a signed copy of the run ID and issuance time add useful protection when the server retains the original record? What does the game's validation contract need to establish that its evidence belongs to the issued attempt? Run issuance and server-recorded time are already agreed. [ADR-0007](decisions/0007-ranked-run-validation.md)

- **Q14 - Submission recovery.** Should completed runs be retained locally for automatic retry, and how should the browser recover confirmation of the server outcome? A missing response is not a rejection. [Lost-response case](architecture/event-model.md#acceptance-with-a-lost-response)

- **Q15 - Run expiry.** When should runs expire, and how should eligibility work for a completed submission that arrives late? The expiry policy is explicitly unresolved in the proposed lifecycle. [Run completion](architecture/event-model.md#completing-the-run)

- **Q16 - Equivalent submissions.** What counts as equivalent evidence when confirming an accepted submission? Returning the accepted result for an equivalent retry is agreed; the definition of equivalence remains open. [ADR-0030](decisions/0030-one-result-per-run.md#more-information)

- **Q17 - Recovery API.** Does recovery need a separate status endpoint, and what response should be returned while validation is in progress? These remain deferred alongside the browser recovery flow. [Status lookup](architecture/ranking-and-storage.md#ranking-api), [in-progress responses](decisions/0030-one-result-per-run.md#more-information)

- **Q18 - Validation handlers.** Where should handlers run and how should the platform invoke them? Handler hosting and invocation still need design. Games retain ownership of their evidence formats and validation logic. [Validation boundary](architecture/ranking-and-storage.md#game-rules-and-validation-boundary)

- **Q19 - Ties.** Should tied scores share a rank and skip the corresponding places, and how should tied rows be ordered? The ranking document proposes this policy but explicitly leaves it unadopted. [Tie proposal](architecture/ranking-and-storage.md#leaderboard-queries)

## Accounts and sharing

- **Q22 - Direct-share delivery.** Which service or transport should deliver scores to their intended recipients? Direct sharing is independent of public AT publication. [Direct sharing](architecture/identity-and-sharing.md#direct-score-sharing)

- **Q24 - Conflicting public edits.** How should a publication retry treat a public copy that another app has changed? The unresolved issue is whether recovery may alter that content. [Publication recovery](architecture/identity-and-sharing.md#writing-and-retrying-publication)

## Game integration

- **Q26 - Package distribution.** Where should game packages be hosted and served from? Package distribution remains open and affects the game origin and isolation policy. [Installation design](architecture/game-library.md#install-and-update-lifecycle)

- **Q27 - Iframe isolation.** Should packages run from a controlled isolated origin or be loaded from remote sources? What sandbox permissions, network access, and response policies preserve the boundary around app credentials and storage? The iframe runtime itself is agreed. [Runtime isolation](architecture/game-library.md#runtime-interface)

- **Q28 - Host-game communication.** What communication mechanism should connect the host and isolated game? The host must associate messages with the correct launch and reject messages from another frame. [Runtime interface](architecture/game-library.md#runtime-interface)

## Store and reviews

- **Q38 - Review moderation.** What reporting and moderation policy applies to player reviews? The recommendation and editing flow does not settle that policy. [Player reviews](player-flows/reviews.md)

## Stored history and evidence

- **Q12 - Private history.** Where should dated attempts be stored, how long should they be retained, and how should deletion affect personal bests and practice summaries? Public AT-record deletion already preserves private history. [Account history](player-flows/account.md#reviewing-personal-progress)

- **Q40 - Stored evidence.** What retention and account-deletion policies apply to evidence, including data that must outlive an attempt? Revoking scores made invalid by a game-breaking bug is agreed. Individual games decide what evidence their validation requires. [Retention questions](architecture/ranking-and-storage.md#run-and-result-storage)
