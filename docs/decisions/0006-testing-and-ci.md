---
status: accepted
date: 2026-11-17
---

# ADR-0006 | Develop frontend and backend on separate trunks

## Context and Problem Statement

[ADR-0004](0004-trial-team-structure.md)

We work asynchronously across frontend and backend. Each area needs somewhere to combine its work before review for `develop`. Features that cross the frontend/backend boundary need explicit shared interface declarations so neither area has to infer what the other will implement.

## Considered Options

- Merge feature branches directly to `main` and tag reviewed releases.
- Merge feature branches into `develop`, then promote a reviewed version to `main`.
- Use frontend and backend trunks, with a direct path to `develop` for shared interface declarations.

## Decision Outcome

[ADR-0027](0027-browser-checks-by-branch.md)

Use `frontend` and `backend` as the two development trunks. Declare shared interfaces on a separate branch and merge them directly into `develop` after team agreement and lead review. This bypasses the trunk path so both areas can use the agreed declarations before implementing the features that depend on them. During feature implementation, those declarations stay fixed. Frontend work stays in the frontend code and backend work stays in the backend code, so the two trunks can develop independently without routinely editing the same files. The shared-interface branch's name has not been chosen.

Feature PRs target the relevant trunk and require team review. Work from each trunk requires lead review before merging into `develop`. The leads normally review their own domains, and either can cover when needed. Rejected work returns to its branch for revision. The direct path for shared interface declarations requires both team agreement and lead review.

CI/CD, including test coverage, gates promotion from `develop` to `main`. Lead review takes place before the merge into `develop`, with no additional lead-approval gate at promotion. The coverage tool and acceptance criteria still need to be selected. A demo tag identifies the exact revision verified for that demo. Promotion is manual. Deployment runs automatically from `main`.

### Consequences

- Good, because both areas can implement against explicit interface declarations available in `develop`, without waiting for the other area to finish a feature.
- Good, because team review happens within each area before a lead reviews the combined work for `develop`.
- Bad, because dependent feature work must wait when its shared interfaces have not been agreed and reviewed.
- Bad, because promotion still includes the combined work in `develop`; this arrangement does not allow arbitrary selection of individual features for release.

## Pros and Cons of the Options

### Feature branches directly to main

- Good, because contributors have one integration target and can use tags to identify reviewed releases.
- Bad, because unfinished integration work would have to stay on feature branches or enter the release branch. There would be no shared branch for testing a combined version before promotion.

### Feature branches into develop

- Good, because a single integration branch makes combined frontend and backend changes available for testing before release.

### Separate trunks with a direct path for shared interfaces

- Good, because each area can assemble and test its features together before lead review, without waiting for the other area's implementation.
- Bad, because work that needs a shared interface must wait for team agreement and lead review of its declaration before implementation begins.

## More Information

The [contribution guide](../../CONTRIBUTING.md) shows the review paths and the direct path for shared interface declarations.
