---
status: accepted
date: 2026-11-20
---

# ADR-0033 | Use SQLite for score storage

## Context and Problem Statement

Score submissions and leaderboard queries need a shared, persistent store that contributors can run locally. Growth may require several application servers sharing the database, so we also need a way to change storage engines as those demands increase.

## Considered Options

- SQLite
- PostgreSQL
- JSON files

## Decision Outcome

Use SQLite for score storage behind a module that provides operations for storing and retrieving scores. Keep SQL and database connections inside that module so application code can use the same operations when the storage implementation changes.

SQLite provides transactions in a local file, making it straightforward for contributors to run. If write contention or deployment across multiple machines makes it unsuitable, replace the module's implementation and migrate the stored data.

### Consequences

- Good, because contributors can run the database locally with the existing Node setup.
- Good, because application code depends on score operations rather than a particular database driver.
- Bad, because replacing SQLite when we outgrow it requires implementing another storage backend and migrating existing data.

## Pros and Cons of the Options

### SQLite

- Good, because it provides transactions and relational queries in a local file without a separate database service.
- Bad, because writes to one database are serialized. Multiple application servers on different machines would need to reach it through a database-owning service or use a different engine.

### PostgreSQL

- Good, because application servers on several machines can share the database over the network and perform concurrent transactions. Read replicas can distribute suitable query workloads.
- Bad, because local development requires a running database service and connection configuration.
- Bad, because ordinary primary/standby replication still concentrates writes on the primary. Distributing writes further requires additional design.

### JSON files

- Good, because files are easy to inspect and need no database service.
- Bad, because we would have to implement safe concurrent updates and score queries ourselves.
