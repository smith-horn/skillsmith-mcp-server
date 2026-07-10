/**
 * SMI-4694: Listener-count audit for context.async.ts (Module 1).
 *
 * Verifies that createToolContextAsync + closeToolContext is symmetric for
 * SIGTERM/SIGINT signal handlers, including when backgroundSync and
 * llmFailover paths are forced on (the only conditions that register
 * handlers — see context.async.ts:236-252).
 *
 * Reference pattern: packages/core/tests/api/client.events.test.ts:39-72
 */
export {};
//# sourceMappingURL=context-async-listeners.test.d.ts.map