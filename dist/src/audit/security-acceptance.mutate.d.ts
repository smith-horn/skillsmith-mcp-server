/**
 * @fileoverview Atomic mutation (accept / revoke) for the security-acceptance
 *               store. (SMI-5883 Wave 2, split from security-acceptance.ts
 *               per the 500-line file gate.)
 * @module @skillsmith/mcp-server/audit/security-acceptance.mutate
 *
 * Every write goes through the shared two-level `acquireOwnedLock` primitive
 * (`@skillsmith/core/config/owned-lock`) -- the SAME mechanism
 * `acquireConfigLock` now wraps -- so the read-modify-write here is one
 * atomic critical section, cross-process. No shortcuts, no age-based
 * staleness, no skipping the reclaim lock's re-validation step.
 */
import type { AcceptanceRecord, AcceptanceWarning } from './security-acceptance.types.js';
export interface AcceptOutcome {
    ok: boolean;
    warnings: AcceptanceWarning[];
}
/**
 * Insert `record` into the store (a NEW acceptance). Assumes the caller
 * already validated the key resolves against the current audit's candidate
 * index. `_onBeforeLock` is an @internal test seam (see
 * `mutateStoreUnderLock`) -- never set in production.
 */
export declare function acceptFinding(acceptancePath: string, record: AcceptanceRecord, _onBeforeLock?: () => void): AcceptOutcome;
export interface RevokeOutcome {
    ok: boolean;
    code?: 'key_not_found';
    warnings: AcceptanceWarning[];
}
/** Remove the record matching `acceptKey`, if present. Resolves against the STORE, not the candidate index (D-9) -- a record worth revoking is often one whose content already changed, so it no longer matches any current candidate. */
export declare function revokeAcceptance(acceptancePath: string, acceptKey: string): RevokeOutcome;
//# sourceMappingURL=security-acceptance.mutate.d.ts.map