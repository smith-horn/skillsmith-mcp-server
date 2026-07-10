/**
 * @fileoverview Type vocabulary for the namespace-overrides ledger
 *               (SMI-4588 Wave 2 Step 1, PR #1).
 * @module @skillsmith/mcp-server/audit/namespace-overrides.types
 *
 * Schema for `~/.skillsmith/namespace-overrides.json`. Modeled on the
 * dependency-intelligence persistence pattern (SMI-3137). The schema is
 * versioned; `CURRENT_VERSION` is bumped only when the on-disk shape
 * changes incompatibly. Reader/writer live in `./namespace-overrides.ts`.
 *
 * Plan: docs/internal/implementation/smi-4588-rename-engine-ledger-install.md §2.
 */
/**
 * Current ledger schema version. Bumped only when the on-disk shape
 * changes incompatibly. Read-path behavior:
 *
 * - `version === CURRENT_VERSION` → return as-is.
 * - `version < CURRENT_VERSION` → caller may run a `migrateLedger` shim
 *   (currently no historical versions exist, so any value below 1 is
 *   unreachable in practice).
 * - `version > CURRENT_VERSION` → reader returns a typed
 *   `namespace.ledger.version_unsupported` error rather than silently
 *   degrading to an empty ledger (plan §2 Edit 6).
 */
export const CURRENT_VERSION = 1;
//# sourceMappingURL=namespace-overrides.types.js.map