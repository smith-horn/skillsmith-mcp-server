/**
 * Unit tests for SMI-5671 Change 0 — revert ledger lookup disambiguation.
 *
 * Split out of `rename-engine.test.ts` (<500-line file-length gate). Covers
 * the `(auditId, collisionId)` lookup added to `revertRename()`:
 *   1. Two ledger entries share one `auditId` with distinct `collisionId`s —
 *      revert by `(auditId, collisionId)` reverts only the intended entry.
 *   2. A legacy entry with no `collisionId`, sole match for its `auditId` —
 *      revert still succeeds via the back-compat fallback.
 *   3. Two legacy entries (no `collisionId`) share one `auditId` — revert
 *      refuses with `namespace.rename.revert_ambiguous` rather than guess.
 */
export {};
//# sourceMappingURL=rename-engine.revert.test.d.ts.map