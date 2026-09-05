/**
 * @fileoverview Shared lock-timeout mapping for `apply_manifest_reconcile`'s
 *               action implementations (SMI-6343 Wave 4).
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile.lock-helpers
 *
 * Split out so both `apply-manifest-reconcile.actions.ts` and
 * `apply-manifest-reconcile.verify.ts` share one implementation rather than
 * two copies drifting apart.
 */
export declare function withLockTimeoutMapping<T>(manifestPath: string, run: () => Promise<T>): Promise<T>;
//# sourceMappingURL=apply-manifest-reconcile.lock-helpers.d.ts.map