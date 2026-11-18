---
status: accepted
date: 2026-11-17
---

# ADR-0032 | Host published game builds

## Context and Problem Statement

The Store publishes versioned game builds that players download separately from adding them to their Library. Players can defer non-critical updates and keep using an installed version, so published versions need stable contents. We need to decide who retains and distributes those builds, including when a creator stops maintaining their own website.

## Considered Options

- Retain and distribute published builds through infrastructure we control.
- Have creators host published builds for players to download.
- Have creators serve downloads while we retain fallback copies.

## Decision Outcome

Retain and distribute published builds through infrastructure we control. This gives us control over the downloadable versions and their availability, while creators can publish games without operating compatible hosting themselves. A published version identifies fixed build contents; changes are delivered as a new version through the Store's update process.

We will start with this approach and revisit it if build sizes or download traffic make its costs difficult to support. Game code continues to execute in the player's browser. Hosting these files does not select where validation handlers run or how the iframe is isolated.

### Consequences

- Good, because a downloadable build can remain available independently of the creator's website.
- Good, because we can preserve the contents associated with a published version instead of relying on a creator to keep a download address unchanged.
- Bad, because we take responsibility for build storage and distribution, including bandwidth costs and availability. A distribution outage can affect several games at once.
- Bad, because large builds and frequent downloads can increase those costs substantially.

### Confirmation

When distribution is implemented, check that players can download a published build from our hosting without depending on the creator's host. Verify that publishing an update creates a distinct version rather than changing the contents identified by an existing version.

## Pros and Cons of the Options

### Retain and distribute published builds through infrastructure we control

- Good, because creators supply a build while we handle its availability and download configuration.
- Good, because we can retain fixed published versions and distribute updates through the Store's agreed process.
- Bad, because storage and download traffic for every hosted game become our operating responsibility.

### Have creators host published builds for players to download

Creators provide versioned download locations. Integrity information can identify unexpected changes to the files, but cannot restore a missing download.

- Good, because creators pay for distribution and can choose infrastructure suited to their games, including large asset collections.
- Good, because a failure at one creator's host need not affect other creators' downloads.
- Bad, because files can become unavailable when a creator removes them or stops maintaining the host. We would have no retained copy to serve.
- Bad, because each creator must maintain compatible download configuration. Browser requests that read files across origins require the host's permission through [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS).

### Have creators serve downloads while we retain fallback copies

Players normally download from the creator's host, with our copy available if that source fails.

- Good, because creators can carry normal download traffic while the platform preserves a way to retrieve the published build.
- Bad, because we still retain the builds and must maintain both download paths, including when to fall back and how to ensure both sources provide the same version.
- Bad, because an unavailable creator host can shift its download traffic and associated costs to us.

## More Information

Static hosting can distribute game files and browser scripts without running the game's logic. The [S3 static-hosting documentation](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html) illustrates that separation and CDN delivery; this decision does not select a provider.

Store admission and republication follow [ADR-0022](0022-store-submission-and-automatic-updates.md), and installed-game updates follow [ADR-0028](0028-update-games-on-online-open.md). The isolation required by [ADR-0017](0017-iframe-game-runtime.md) still needs an origin and sandbox policy, even when we host the files.
