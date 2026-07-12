/**
 * @fileoverview Tests for the shutdown-coordinator helpers extracted from
 * index.ts (SMI-5649).
 *
 * `quiesceBackgroundSync` is the bounded-timeout wrapper `index.ts` passes
 * as the coordinator's `quiesce` hook. It has no top-level side effects
 * (unlike `index.ts` itself), so it can be imported and unit-tested
 * directly — this is the in-process complement to the subprocess proof in
 * `tests/shutdown-persistence-subprocess.test.ts` (which exercises the same
 * bound end-to-end against a real stalled network call, but isn't captured
 * by source-file coverage since it runs the compiled binary in a separate
 * process).
 */
export {};
//# sourceMappingURL=index.shutdown-helpers.test.d.ts.map