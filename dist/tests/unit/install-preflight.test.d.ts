/**
 * Unit tests for SMI-4588 Wave 2 Step 5 — install pre-flight namespace check.
 * PR #3 of the Wave 2 stack.
 *
 * Coverage (8+ cases per the work plan):
 *   1. No collision → empty warnings, no pendingCollision, valid auditId.
 *   2. Exact collision in `preventative` mode → returns pendingCollision
 *      with `chainExhausted: false`.
 *   3. Exact collision in `power_user` mode → returns warnings[] (one entry).
 *   4. Generic collision in `governance` mode → returns warnings[].
 *   5. Pre-flight failure (bad inventory entry) → degraded shape (non-blocking).
 *   6. `auditId` is bubbled and matches the audit-history entry written.
 *   7. All 3 chain candidates collide → `chainExhausted: true`.
 *   8. Audit-history persisted on every call (zero-flag and collision paths).
 */
export {};
//# sourceMappingURL=install-preflight.test.d.ts.map