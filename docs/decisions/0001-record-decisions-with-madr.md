---
status: accepted
date: 2026-11-12
---

# ADR-0001 | Record decisions with MADR

## Context and problem statement

RanKing's design is being decided through meetings and follow-up reviews. The repository needs a record of the choices reached in those discussions, including the alternatives and reasons that led to each choice. Meeting notes preserve the discussion but do not provide a maintained account of which decisions apply to the project.

## Considered options

- Keep decisions in meeting notes and issue discussions.
- Keep concise MADRs under version control.

## Decision outcome

Keep decisions in version-controlled Markdown Architectural Decision Records (MADRs) under `docs/decisions/`. A record captures the problem, the options discussed, and the reason for the outcome. Version control makes that reasoning reviewable with the project; the [template](template.md) provides a common place to find it.

### Consequences

- Good, because contributors can find the alternatives and reasoning behind a decision in a version-controlled record rather than reconstructing them from meeting notes.
- Bad, because the team must maintain the records as decisions change. A replacement needs to link to the earlier record so its original reasoning remains available.
