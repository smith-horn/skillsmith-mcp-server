/**
 * SMI-4694 (updated SMI-5649): Listener-count audit for the tool-context
 * factories (Module 2).
 *
 * Prior to SMI-5649, the tool-context factories registered their OWN
 * SIGTERM/SIGINT handlers whenever backgroundSync or llmFailover was
 * enabled — this test verified that registration was symmetric with
 * `closeToolContext`/`disposeTestContext`. SMI-5649 deleted that
 * registration entirely (both the async factory AND its sync sibling,
 * `createToolContext` in context.ts — the sync sibling's identical latent
 * bug found during the Wave A design pass): it was the root cause of the
 * shutdown race (two independent, unordered handler sets could both fire on
 * the same signal, racing a fire-and-forget `backgroundSync?.stop()`
 * against `index.ts`'s db close). Signal ownership now belongs SOLELY to
 * `index.ts`'s single shutdown coordinator (`shutdown.ts`) — see
 * docs/internal/implementation/mcp-shutdown-followup-hardening-wave-a-design.md
 * §Deliverable 4.
 *
 * These tests now assert the NEW invariant: creating/closing/disposing a
 * tool context NEVER touches process-level SIGTERM/SIGINT listeners at all,
 * even with backgroundSync and llmFailover both enabled.
 *
 * Reference pattern: packages/core/tests/api/client.events.test.ts:39-72
 */
export {};
//# sourceMappingURL=context-listeners.test.d.ts.map