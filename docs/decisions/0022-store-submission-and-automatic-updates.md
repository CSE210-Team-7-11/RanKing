---
status: accepted
---

# ADR-0022 | Review Store admission and allow updates by default

## Context and Problem Statement

Players rely on Store listings to describe playable games accurately. Human review checks the first build and its listing before admission. After admission, creators need to ship routine fixes and urgent security patches when moderators are unavailable. We also need a way to investigate problems in later builds without making every update wait for approval.

## Considered Options

- Require human approval before every update.
- Require approval before updates that change specified capabilities or listing claims.
- Grant publication without prior approval according to publisher history.
- Allow updates by default and review them routinely after publication.
- Allow updates by default and review them when reports or automatic flags raise a concern.

## Decision Outcome

Review the initial build and listing for reasonable effort before admitting a game. The reviewer tries the main play flow through RanKing and checks the listing's claims. When changes are needed, the creator receives specific feedback and can revise the same submission.

After admission, republication goes through by default. Reports can trigger human review of the game or update concerned. This keeps routine publication independent of moderator availability while directing review to identified concerns.

Automated package and host-compatibility checks, automatic moderation flags, and the associated moderation tooling are distant stretch goals. They are not prerequisites for the current course work. The review policy can accommodate automatic flags when that capability is implemented.

Requiring approval for selected change categories would still delay updates in those categories. Publisher-based permissions would require a separate trust policy, while routine review of published updates would create work even when no concern has been raised. Reports and flags give us a reason to investigate a particular game without maintaining either system. They can miss problems, so this approach does not establish that every published build has been checked by a person.

Delivery of published updates to installed copies follows [ADR-0028](0028-update-games-on-online-open.md).

### Consequences

- Good, because the initial review checks the game's playable flow against its listing before admission.
- Good, because creators can normally publish fixes while moderators are unavailable, and reports or flags still bring problems to human reviewers.
- Bad, because a problem can reach players before anyone reports it. Future automated checks would not replace a reviewer's assessment of playability or listing accuracy.
- Bad, because reports and flags require handling. False alarms can consume review time, and concerns may remain unresolved while moderators are unavailable.

## Pros and Cons of the Options

### Human approval before every update

- Good, because a reviewer can inspect changes to gameplay and listing claims before each release.
- Bad, because routine fixes and security patches wait for moderator availability.

### Approval for specified changes

- Good, because review can concentrate on changes such as expanded host capabilities while routine changes proceed automatically.
- Bad, because we must define and detect those changes. A small fix could still require approval if it touches a reviewed capability, and a harmful change could fall outside the categories.

### Publication permissions based on publisher history

- Good, because established publishers can release directly while less familiar publishers receive closer review.
- Bad, because we must define how publishers gain and lose that permission. A good history does not establish that a particular update is acceptable, and newer creators remain dependent on reviewer availability.

### Routine review after publication

Review every update or a sample of updates after they are published.

- Good, because reviewers can find problems without waiting for a report or automatic flag, and publication does not wait for their assessment.
- Bad, because routine review creates an ongoing workload as updates arrive. Players can encounter a problem before review, and sampling leaves some builds unexamined.

### Review triggered by reports or automatic flags

- Good, because publication normally proceeds without waiting, and reviewers have a specific concern to investigate.
- Bad, because review depends on concerns being reported or detected. False flags and unreported problems both affect how well this policy works.

These policies can be combined. Reports trigger review under the chosen policy; automatic flags can supplement them as a stretch goal. Routine sampling and publisher-specific publication permissions are not part of this decision.

## More Information

Valve's [release review process](https://partner.steamgames.com/doc/store/review_process) provides a comparison for reviewing a build and listing before admission, then allowing updates without repeating that review.

The [submission flow](../player-flows/publishing-games.md) covers revisions, republication, and review triggers. Detailed automated checks and flag-based moderation will be designed if those stretch goals are undertaken.
