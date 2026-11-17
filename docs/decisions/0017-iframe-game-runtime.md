---
status: accepted
---

# ADR-0017 | Run games in iframes with injected dependencies

## Context and Problem Statement

Built-in and added games can supply substantially different interfaces and mechanics. RanKing needs to launch them and receive outcomes without implementing those games inside the platform. The game interface also needs to expose allowed host capabilities while keeping account credentials outside game code.

Store admission checks reasonable effort and playability under [ADR-0022](0022-store-submission-and-automatic-updates.md). That review does not establish enough trust to run externally authored game code with the app's privileges. The runtime must provide a boundary between game code and the app while allowing games to supply their own interface, including experiences that need the whole display.

## Considered Options

- Load game modules directly into the app's page.
- Embed games in isolated iframes.
- Open games as separate pages on another origin.

## Decision Outcome

Use isolated iframes for built-in and added games. With an appropriate origin and sandbox policy, this lets games render their own interfaces while restricting access to the app's page and credentials. RanKing retains the surrounding interface and the connection through which it starts a round and receives its outcome. Directly loaded modules would share the app's execution environment, which requires more trust than Store vetting provides.

A game that needs the whole display can use fullscreen with the required permission. Opening a separate page is therefore unnecessary solely to give a game more space. Separate-page hosting would be useful for games that need to operate independently or require capabilities unavailable in an embedded context, but we have not identified such a requirement.

The host supplies the game's allowed dependencies through an explicit interface. Dependency injection is possible with any of the runtime models considered here; the reason for choosing iframes is the browser-enforced boundary while keeping games embedded in RanKing.

### Consequences

- Good, because game authors can supply complete web interfaces without requiring the app to grant their code access to its page or credentials.
- Good, because embedded and fullscreen play can use the same host connection for launch and results.
- Bad, because the host must manage communication across the frame boundary and coordinate focus, sizing, and browser permissions with the game.
- Bad, because isolation depends on the serving origin and sandbox configuration. Using an iframe alone does not establish the required boundary.

## Pros and Cons of the Options

### Load game modules directly into the app's page

- Good, because the host and game can call each other directly, and the game interface can integrate with the surrounding page without communication between frames.
- Bad, because game code runs in the app's execution environment. Component encapsulation does not prevent it from accessing the surrounding page or origin-accessible storage.

### Embed games in isolated iframes

- Good, because browser origin and sandbox controls can restrict game code while allowing it to render its own interface inside RanKing.
- Good, because fullscreen can accommodate games that need the whole display without moving them to a separate page.
- Bad, because communication and browser permissions must be configured explicitly, and the host must handle interaction across the frame boundary.

### Open games as separate pages on another origin

- Good, because games can operate as independent pages without an embedding host's layout or iframe-specific permission restrictions.
- Bad, because the player leaves RanKing's surrounding interface. Retaining the selected target and returning results requires integration across pages and a route back to the app.

## More Information

The [runtime proposal](../architecture/game-library.md#runtime-interface) leaves message transport, serving origin, sandbox permissions, and the exact injected interface open. Those choices determine the isolation the host can actually provide and require review before implementation.

The [HTML standard](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#attr-iframe-sandbox) defines iframe sandbox controls and fullscreen permissions, including configurations that defeat isolation. [Cross-window messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) supports communication across origins. [Shadow DOM encapsulation](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM) does not supply an equivalent security boundary for directly loaded game code.
