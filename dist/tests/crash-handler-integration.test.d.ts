/**
 * SMI-5787: integration coverage for the global uncaughtException /
 * unhandledRejection safety net (see shutdown.ts's installGlobalCrashHandlers).
 *
 * Spawns the real built `dist/src/index.js` binary — same pattern as
 * startup-probe.test.ts — with a test-only env var that forces each
 * condition 50ms after the server reports "running". Without the fix, both
 * conditions still crash the process (Node's own default behavior), but
 * leave nothing durable; the assertion here is that the crash is now
 * *logged* (stderr, mirroring the disk record) before the process exits with
 * a stable, non-zero code — not that a crash somehow stops being fatal.
 */
export {};
//# sourceMappingURL=crash-handler-integration.test.d.ts.map