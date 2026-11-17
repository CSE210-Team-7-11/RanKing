---
status: accepted
date: 2026-11-17
---

# ADR-0024 | Connect AT accounts with browser-managed OAuth

## Context and Problem Statement

AT Protocol is an assignment requirement. Players connect their existing AT account so RanKing can use its identity and access authorized AT services. The team needs an account-connection mechanism that is practical to operate for the course and requires little credential handling on the RanKing server.

## Considered Options

- Browser-managed AT OAuth.
- Server-managed AT OAuth.
- AT app-password authentication.

## Decision Outcome

Chosen option: browser-managed AT OAuth, because players can use their existing AT account through the recommended end-user authorization flow, and the RanKing server does not have to manage their AT OAuth credentials. This reduces account setup for players and credential-handling code for the team.

The browser's OAuth client manages the AT credentials outside game frames. Permission requests and the account-connection screens still need design. Requests to RanKing's own ranking API use [AT service-token verification](0023-authenticate-ranked-requests-with-at-tokens.md).

### Consequences

- Good, because players can connect an existing AT identity without creating a separate RanKing account or copying an app password into the app.
- Good, because the ranking server does not need to store and manage players' AT OAuth credentials.
- Bad, because the frontend must integrate the authorization callback and OAuth session handling.

## Pros and Cons of the Options

### Browser-managed AT OAuth

- Good, because an official browser client supports the authorization flow and manages the AT session in the frontend.
- Bad, because the browser must handle that session and its failures as part of the player experience.

### Server-managed AT OAuth

- Good, because the backend can manage the AT credentials and account operations centrally.
- Bad, because the team would need server-side credential storage and session management, adding operational work to the course deployment.

### AT app-password authentication

- Good, because an app password can be revoked separately from the player's primary password and is supported by AT Protocol's password-authentication tools.
- Bad, because players must create and supply an app password rather than authorize access through OAuth. RanKing would also receive and handle that credential.

## More Information

[AT Protocol's authentication guidance](https://atproto.com/guides/auth#about-authorization) recommends OAuth for applications with end-user login flows and describes app passwords as a supported alternative. Its [OAuth SDK documentation](https://atproto.com/guides/about-oauth#typescript) provides browser and server clients, so OAuth does not itself force a choice between those deployment models. Browser management was chosen to reduce RanKing's server-side credential handling.
