---
status: accepted
date: 2026-11-09
---

# ADR-0004 | Trial four work areas across two subteams

## Context and Problem Statement

The team had difficulty assigning work using only frontend and backend roles. Those categories were too broad to identify who should take particular tasks. The team needs more specific responsibilities within each area.

## Considered Options

- Frontend and backend roles only.
- Frontend design, frontend implementation, backend implementation, and quality assurance roles within the two subteams.

## Decision Outcome

Trial four roles within the frontend and backend subteams so work can be assigned by a more specific responsibility. Everyone present agreed to try the split and revisit it if the work calls for a different arrangement.

The frontend subteam handles design and implementation. Design sketches and prototypes in Figma, applies design psychology, and contributes frontend code. Frontend implementation builds the UI and works with QA on testing and accessibility.

The backend subteam handles backend implementation and QA. Backend implementation builds the TypeScript server and AT Protocol integration and works with QA on testing. QA owns unit and end-to-end tests, linting, accessibility checks, and the CI/CD pipeline.

### Consequences

- Good, because the more specific roles give the team a clearer basis for assigning tasks than the frontend/backend split alone.
- Bad, because work that spans roles requires coordination between contributors. QA needs the implementers' expected behavior and interfaces to write the tests.

## More Information

The November 9 meeting notes record agreement from everyone present to trial the subteam structure. The subteam role poll assigns design and implementation to frontend, and implementation and quality assurance to backend. It gives QA responsibility for tests and the CI/CD pipeline.
