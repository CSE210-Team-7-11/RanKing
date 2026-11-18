# Accounts and profiles

[Documentation by task](README.md)

## Account connection

Read [Account connection and ranked requests](../architecture/identity-and-sharing.md#account-connection-and-ranked-requests) for identity and credential responsibilities. Browser OAuth is explained in [ADR-0024](../decisions/0024-browser-managed-at-oauth.md#decision-outcome), and ranking API authentication in [ADR-0023](../decisions/0023-authenticate-ranked-requests-with-at-tokens.md#decision-outcome).

For implementation research on obtaining and verifying tokens, use [Implementation effort](../research/ranked-request-authentication.md#implementation-effort). Its [Player experience](../research/ranked-request-authentication.md#player-experience) section covers authentication interruptions. When connecting from a completed guest attempt, also read [Guest play](../player-flows/arrival-and-home.md#guest-play).

## Account and profile views

Read [Reviewing personal progress](../player-flows/account.md#reviewing-personal-progress) for private history, or [Visiting a profile](../player-flows/account.md#visiting-a-profile) for public information. History-retention work depends on Q12 under [Stored history and evidence](../open-questions.md#stored-history-and-evidence).

Publication settings and deletion have their own [public-scores guide](publication.md). For playtests, P4 under [Library and personal history](../research/player-playtests.md#library-and-personal-history) covers attempt history; P20 under [Profiles and cleanup](../research/player-playtests.md#profiles-and-cleanup) covers public/private visibility.
