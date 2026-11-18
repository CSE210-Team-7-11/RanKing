# Public scores and cleanup

[Documentation by task](README.md)

## Publishing scores

For preferences and result actions, read [Publishing to AT Protocol](../player-flows/play-and-results.md#publishing-to-at-protocol). For the public record and write contract, read [Public record contents](../architecture/identity-and-sharing.md#public-record-contents) and [Writing and retrying publication](../architecture/identity-and-sharing.md#writing-and-retrying-publication).

[ADR-0008](../decisions/0008-at-protocol-identity-and-publication.md#decision-outcome) explains why public copies are independent of official rankings. Conflicting edits by another app remain Q24 under [Accounts and sharing](../open-questions.md#accounts-and-sharing).

## Kept scores and bulk deletion

Read [Managing published scores](../player-flows/account.md#managing-published-scores), including its selection and confirmation subsections. Pair that flow with [Published score cleanup](../architecture/identity-and-sharing.md#published-score-cleanup) for ownership, batch consistency, and retry behavior.

Playtests P20-P21 are under [Profiles and cleanup](../research/player-playtests.md#profiles-and-cleanup). For account credentials, use [account connection](accounts.md#account-connection). For direct sharing, follow [Friends and challenges](friends.md).
