# Ranked request authentication research

[ADR-0023](../decisions/0023-authenticate-ranked-requests-with-at-tokens.md)

Ranked requests use direct AT service-token verification to avoid a separate app-managed session lifecycle. This research establishes how to obtain and verify those tokens with the providers we support, what players experience when token handling fails, and the implementation and operating costs.

## Implementation effort

- Try requesting a service token from the providers we expect to support. Identify the OAuth permission, ranking service identity, and method binding required. Record what the browser SDK handles and what we would need to implement. [Service token endpoint](https://github.com/bluesky-social/atproto/blob/main/lexicons/com/atproto/server/getServiceAuth.json)
- Build a small browser-to-server example that obtains an AT service token and uses it to authenticate a ranking request. Check signature verification and what happens with the wrong recipient or method, an expired token, or an unresolvable signing key. Determine how to handle replay and how that affects legitimate retries. [AT service authentication](https://atproto.com/specs/xrpc#inter-service-authentication-jwt)
- Estimate implementation and maintenance by component. Include browser code, server verification, library dependencies, deployment configuration, and tests.

## Player experience

Use that example to check whether token handling adds prompts or delays for the player, and what happens when authentication fails.

- Walk through connecting an account and finishing a ranked round. Record any extra prompts, visible delay, or setup specific to the player's provider.
- Test what happens when the token expires during play, the player changes accounts, or the provider is unavailable while the ranking API is reachable. Record which actions can proceed and what the player sees when an action has to wait or be retried.

## Operating cost

Measure the requests and verification work performed by the example, then use those measurements to estimate operating cost at the expected usage.

- Count requests to the player's personal data server and identity resolution calls during a normal session. Measure verification latency with and without cached signing keys. Check provider request limits and what anti-replay state would require.
- Estimate costs for the course demo and a stated usage scenario beyond the course. Include hosting, any additional storage or services, and ongoing maintenance. Record the assumptions behind estimates.

## Findings

Report whether a player can connect, start a ranked round, and submit it with each tested provider, including what happens if the token expires or the provider fails. Identify the code and infrastructure required, the assumptions behind the cost estimate, and any limitations that need further design.
