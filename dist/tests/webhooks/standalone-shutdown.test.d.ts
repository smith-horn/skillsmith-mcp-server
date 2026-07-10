/**
 * SMI-4694: Listener-count audit for standalone webhook + stripe-webhook
 * shutdown handlers (Module 4).
 *
 * Verifies that attachShutdownHandlers() registers SIGTERM/SIGINT
 * idempotently — repeated calls do not accumulate listeners — and that the
 * returned detach() restores baseline counts.
 *
 * Reference pattern: packages/core/tests/api/client.events.test.ts:39-72
 */
export {};
//# sourceMappingURL=standalone-shutdown.test.d.ts.map