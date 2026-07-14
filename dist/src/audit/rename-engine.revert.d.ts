/**
 * @fileoverview Revert path for the rename engine (SMI-5671).
 * @module @skillsmith/mcp-server/audit/rename-engine.revert
 *
 * Split out of `rename-engine.ts` (SMI-5671, <500-line file-length gate) —
 * `revertRename` is the inverse of `applyRename`'s forward-rename paths and
 * has no dependency on them beyond shared helpers.
 *
 * Plan: docs/internal/implementation/smi-5671-apply-namespace-rename-revert-action.md
 */
import type { ApplyRenameResult, RenameSuggestion } from './rename-engine.types.js';
/**
 * Inverse of `applyRename`. Looks up the ledger entry by
 * `(auditId, collisionId)`, renames the file back to `originalIdentifier`,
 * and removes the ledger entry. Backup is kept for forensics until the
 * 30-day GC sweep.
 *
 * Lookup disambiguation (SMI-5671 Change 0): a single audit run can resolve
 * 2+ collisions, appending 2+ ledger entries that all share one `auditId`,
 * so `auditId` alone is NOT sufficient to pick the entry to revert. The
 * lookup: (1) filter by `auditId`; (2) prefer an entry whose `collisionId`
 * matches exactly; (3) if none match by `collisionId` and exactly one
 * `auditId`-only entry exists (a legacy pre-fix entry with no `collisionId`),
 * fall back to it — safe, because it fires only when there's no ambiguity;
 * (4) if 2+ `auditId`-only entries exist and none carry the requested
 * `collisionId`, refuse with `namespace.rename.revert_ambiguous` rather than
 * silently revert the wrong one.
 *
 * Idempotency: calling revert twice on the same `(auditId, collisionId)`
 * returns success with `fromPath === toPath` on the second call (the entry
 * is gone, so we treat it as a no-op success).
 */
export declare function revertRename(suggestion: RenameSuggestion, auditId: string, collisionId: string): Promise<ApplyRenameResult>;
//# sourceMappingURL=rename-engine.revert.d.ts.map