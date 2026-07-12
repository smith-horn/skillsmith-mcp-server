/**
 * SMI-4694 (updated SMI-5649): Listener-count audit for context.async.ts
 * (Module 1).
 *
 * Prior to SMI-5649, `createToolContextAsync` registered its OWN
 * SIGTERM/SIGINT handlers whenever backgroundSync or llmFailover was enabled
 * — this test verified that registration was symmetric with
 * `closeToolContext`. SMI-5649 deleted that registration entirely: it was
 * the root cause of the shutdown race (two independent, unordered handler
 * sets could both fire on the same signal, racing a fire-and-forget
 * `backgroundSync?.stop()` against `index.ts`'s db close). Signal ownership
 * now belongs SOLELY to `index.ts`'s single shutdown coordinator
 * (`shutdown.ts`) — see
 * docs/internal/implementation/mcp-shutdown-followup-hardening-wave-a-design.md
 * §Deliverable 4.
 *
 * This test now asserts the NEW invariant: creating/closing a tool context
 * NEVER touches process-level SIGTERM/SIGINT listeners at all, even with
 * backgroundSync and llmFailover both enabled — that's exactly what makes
 * "exactly one registration site" (the coordinator) true.
 *
 * Reference pattern: packages/core/tests/api/client.events.test.ts:39-72
 */
export {};
//# sourceMappingURL=context-async-listeners.test.d.ts.map