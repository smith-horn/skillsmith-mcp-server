/**
 * Unit tests for SMI-4588 Wave 2 Step 9 — backup garbage collector.
 * PR #4 of the Wave 2 stack.
 *
 * Coverage (per plan §1 "decision #10" + Edit 4):
 *   1. Old backup directory removed; recent backup retained.
 *   2. Malformed-timestamp directory skipped (NOT removed) and surrounding
 *      valid-but-expired entries still GC'd.
 *   3. Missing backups root → no-op success (no throw).
 *   4. Concurrent runs idempotent — second invocation completes without
 *      throwing on already-removed directories.
 *   5. `.original` directory is preserved (carve-out matching
 *      `cleanupOldBackups` in install.conflict-helpers.ts).
 *   6. Retention env clamping — value > 365 clamped to 365; < 1 clamped to 1.
 *   7. Custom `retentionDays` option overrides env.
 */
export {};
//# sourceMappingURL=install.backup-gc.test.d.ts.map