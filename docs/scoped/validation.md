# Score validation and retries

[Documentation by task](README.md)

For work on the validated scoring path, start with [Game rules and validation boundary](../architecture/ranking-and-storage.md#game-rules-and-validation-boundary): games interpret evidence, while the platform authenticates and routes submissions.

Read according to the operation you are changing:

- Issuance and submission: [Issuing and submitting a run](../architecture/event-model.md#issuing-and-submitting-a-run) and [Validation pipeline](../architecture/ranking-and-storage.md#validation-pipeline).
- Acceptance and storage: [Completing the run](../architecture/event-model.md#completing-the-run), [Run and result storage](../architecture/ranking-and-storage.md#run-and-result-storage), and [Storage requirements](../architecture/ranking-and-storage.md#storage-requirements).
- Retry and recovery: [Acceptance with a lost response](../architecture/event-model.md#acceptance-with-a-lost-response). [ADR-0030](../decisions/0030-one-result-per-run.md#decision-outcome) explains equivalent retries.

Review Q13-Q18 under [Ranked submissions](../open-questions.md#ranked-submissions) before depending on signing, expiry, equivalence, recovery, or handler execution. Evidence retention is Q40 under [Stored history and evidence](../open-questions.md#stored-history-and-evidence).

[ADR-0003](../decisions/0003-server-validated-rankings.md#decision-outcome) gives the handler rationale. If changing authentication, use the [accounts guide](accounts.md).
