/**
 * @fileoverview Tests for installGlobalCrashHandlers (SMI-5787).
 *
 * Split into its own file rather than added to shutdown.test.ts /
 * shutdown-coordinator.test.ts — both are already close to the 500-LOC
 * file-size gate. Same module under test, same `createLogger` mocking
 * approach as those files (see shutdown.test.ts's header comment for the
 * rationale).
 *
 * Tests drive the handlers via `process.emit(...)` directly rather than a
 * real throw/rejection — `installGlobalCrashHandlers` only registers plain
 * listeners, so emitting the event exercises the exact same callback Node
 * would invoke on a real uncaught exception/unhandled rejection, without
 * relying on Node's internal fatal-exception machinery (which only engages
 * for a *real*, unhandled throw — not a manually emitted event on an
 * EventEmitter that already has a listener).
 */
export {};
//# sourceMappingURL=shutdown-crash-handlers.test.d.ts.map