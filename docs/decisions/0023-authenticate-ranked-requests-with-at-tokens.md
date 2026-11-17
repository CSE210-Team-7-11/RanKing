---
status: accepted
date: 2026-11-17
---

# ADR-0023 | Authenticate ranked requests with AT service tokens

## Context and Problem Statement

RanKing uses [browser-managed AT OAuth](0024-browser-managed-at-oauth.md) to connect accounts. That authorizes access to the player's AT services, but the ranking API still needs to verify which account is starting or submitting a run. This decision concerns the identity proof sent to that API.

## Considered Options

- Direct AT service-token verification on each ranked request.
- A RanKing session established using an AT service token.
- Ranked requests proxied through the player's personal data server (PDS).

## Decision Outcome

Use direct AT service-token verification for authenticated ranked requests. This avoids introducing a separate RanKing session lifecycle alongside AT authentication, reducing the code and operational work we maintain. Keeping that infrastructure small suits the course deployment and limits ongoing operating costs.

The browser obtains a service token intended for RanKing and attaches it to each authenticated ranked request. The ranking server verifies the signature, intended recipient, permitted operation, and expiry before using the signed identity. Provider support, token acquisition, and replay handling still need implementation research.

### Consequences

- Good, because direct token verification avoids implementing and operating a separate RanKing session service. AT OAuth credentials remain with the browser's OAuth client.
- Bad, because the browser needs a usable AT service token whenever an authenticated ranked request is due. Provider support, issuance and reuse rules, and provider failures can affect whether play can proceed. Their effect still needs measurement.

Identity verification remains separate from run ownership and the game's validation handler.

## Pros and Cons of the Options

### Direct AT service-token verification on each ranked request

- Good, because the ranking API could authenticate requests without issuing and maintaining RanKing sessions.
- Bad, because a usable service token must accompany each authenticated ranked request. The cost of obtaining tokens and the effect of provider failures during play remain unmeasured.

### A RanKing session established using an AT service token

The server verifies the initial AT proof and issues its own session for later ranked requests.

- Good, because later requests can use the RanKing session without attaching another AT service token while that session remains valid.
- Bad, because we would need to implement and maintain a session lifecycle in addition to verifying the initial AT proof.

### Ranked requests proxied through the player's PDS

The PDS forwards each request with signed identity proof for the receiving service.

- Good, because the protocol supplies a forwarding mechanism that attaches the player's identity proof.
- Bad, because ranked requests would depend on the PDS's availability and request limits as well as RanKing's. The proposed API would also need to meet the protocol's proxy endpoint requirements.

## More Information

The AT Protocol specification defines [service-token authentication](https://atproto.com/specs/xrpc#inter-service-authentication-jwt) and [PDS service proxying](https://atproto.com/specs/xrpc#service-proxying). The [research brief](../research/ranked-request-authentication.md) covers provider compatibility, implementation effort, player experience, and measured operating cost for the chosen approach.
