---
status: accepted
---

# ADR-0030 | Return the accepted result for equivalent retries

## Context and Problem Statement

A run has at most one accepted result, but the response confirming acceptance may never reach the browser. When the server receives another submission for that run, it must decide whether to return the existing result, direct the caller to retrieve it, or require the evidence to match before reporting success. The response must distinguish confirmation of the submitted evidence from retrieval of an existing outcome.

## Considered Options

- Return the run's existing accepted result regardless of the evidence in a repeated submission.
- Return a completed-run response identifying the stored result, which the caller retrieves separately.
- Return the stored result when a repeated submission is equivalent.

## Decision Outcome

Store at most one accepted result per run and return it for equivalent retries. Concurrent equivalent submissions resolve to that same result. This lets the server confirm earlier success without counting the round again or requiring a second request to retrieve the outcome.

A first-result-wins contract could return the existing outcome even when the retry contains different evidence. That makes the operation a way to retrieve the run's result, but its success would not confirm that the submitted evidence was accepted. Checking equivalence preserves that distinction.

A completed-run response with a result reference also supports recovery. A separate read can retrieve the result even if the browser no longer has the original evidence. Returning the result directly on an equivalent retry avoids an extra retrieval request when the caller does have that evidence. This decision permits a read endpoint alongside the submission endpoint; the browser's recovery flow remains undecided.

### Consequences

- Good, because the caller can obtain the accepted outcome after losing a response without creating a duplicate score.
- Bad, because the server must define submission equivalence and retain enough information to check it before returning a successful retry response.

Every option must enforce one accepted result atomically under concurrent requests. A check before validation alone does not prevent two writes.

## Pros and Cons of the Options

### Return the existing result regardless of repeated evidence

Once a run has an accepted result, an authorized submission for that run returns it without comparing the new evidence. The first accepted result remains authoritative.

- Good, because retry handling does not need an equivalence check. A caller can recover the existing outcome even when it cannot reproduce the original submission exactly.
- Bad, because a success response cannot confirm that the evidence just sent was accepted. Changed evidence, including a client mistake, can receive the same result without the discrepancy being surfaced.

### Completed-run response with separate result retrieval

The submission endpoint reports that the run is already complete and provides a reference to its accepted result. An authorized caller follows that reference to retrieve the outcome.

- Good, because the caller can recover the accepted result without the submission endpoint treating the repeated evidence as an accepted submission. A result retrieval operation can also serve callers returning to an earlier run.
- Bad, because recovery requires another request after the completed-run response, and the client must handle that request's failure separately. The retrieved result describes the accepted attempt rather than confirming that the retry's evidence was equivalent.

### Return the stored result for equivalent retries

- Good, because a repeat of the same submission can confirm success using the submission endpoint itself.
- Bad, because equivalence must be checked against the accepted submission so different evidence cannot be presented as the same retry.

## More Information

The [run lifecycle](../architecture/event-model.md) describes acceptance, rejection, and confirmation after a lost response. Request identifiers and synchronous or asynchronous validation are separate design choices; either processing model can return an accepted result for equivalent retries.

Run issuance and evidence binding are separately under review in [ADR-0007](0007-ranked-run-validation.md).
