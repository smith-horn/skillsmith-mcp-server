/**
 * SMI-5883 §9 H-9 -- lost update under a forced stale reclaim, against the
 * REAL accept path (`acceptFinding`), not a generic lock stress test (that
 * lives at `packages/core/tests/integration/owned-lock-*.test.ts`). Two real
 * child processes are forced through the reclaim path (a genuinely
 * reclaimable stale lock) and then race for the acceptance store's own
 * lock, each accepting a DISTINCT finding. `SKILLSMITH_ACCEPT_LOCK_TEST_DELAY_MS`
 * deterministically guarantees overlap inside the critical section rather
 * than relying on scheduling luck.
 */
export {};
//# sourceMappingURL=security-acceptance-lost-update.integration.test.d.ts.map