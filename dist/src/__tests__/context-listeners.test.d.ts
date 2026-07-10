/**
 * SMI-4694: Listener-count audit for context.ts (Module 2).
 *
 * Verifies that createToolContext + closeToolContext is symmetric for
 * SIGTERM/SIGINT signal handlers, including when backgroundSync and
 * llmFailover paths are forced on (the only conditions that register
 * handlers — see context.ts:244-260).
 *
 * Reference pattern: packages/core/tests/api/client.events.test.ts:39-72
 */
export {};
//# sourceMappingURL=context-listeners.test.d.ts.map