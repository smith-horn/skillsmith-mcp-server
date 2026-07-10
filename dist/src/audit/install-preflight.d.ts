/**
 * @fileoverview Install pre-flight namespace check (SMI-4588 Wave 2 Step 5, PR #3).
 * @module @skillsmith/mcp-server/audit/install-preflight
 *
 * Detects namespace collisions between an in-flight install candidate and
 * the user's existing local inventory BEFORE any side effects. Returns both
 * a non-blocking `warnings[]` shape (for `power_user` / `governance` modes)
 * AND a blocking `pendingCollision` envelope (for `preventative` mode). The
 * mode gate lives in the install.ts caller — this module is pure detection
 * + suggestion generation + audit-history persistence.
 *
 * Plan §3 + §Step 5 + Edits 2/3/6/7.
 *
 * Inventory contract (Edit 7):
 *   - `existingInventory` — pre-candidate snapshot, passed to
 *     `generateSuggestionChain` (chain self-collides at tier 1 otherwise).
 *   - `augmentedInventory` — existing + the synthesized candidate, passed to
 *     `detectCollisions`. Filtering to flags involving the candidate keeps
 *     pre-existing collisions from re-surfacing on every install.
 *
 * Failure model (Edit 2):
 *   - Pre-flight scanner failure (ledger malformed unrecoverably, fs error,
 *     unexpected throw) is ALWAYS non-blocking. The caller treats `warnings:
 *     [], pendingCollision: null` as a degraded-but-clean pass and proceeds
 *     with the install.
 *
 * Edit 6 — `readLedger()` may throw `namespace.ledger.version_unsupported`.
 * The pre-flight catches it and degrades to non-blocking; bubbling would
 * brick installs after a ledger downgrade.
 */
import type { AuditId, InventoryEntry } from './collision-detector.types.js';
import type { NamespaceWarning, PendingCollision } from './namespace-audit.types.js';
import type { AuditMode, Tier } from '@skillsmith/core/config/audit-mode';
/**
 * One synthesized candidate skill being considered for install. The
 * pre-flight builds an `InventoryEntry` for it so the existing
 * `detectCollisions` pipeline can compare it against the user's inventory.
 */
export interface CandidateSkill {
    /** Skill identifier post-install (e.g. `"code-helper"`). */
    identifier: string;
    /**
     * Path the skill WILL occupy post-install. The pre-flight runs before
     * the install touches disk, so this is a projected path used for
     * suggestion-chain `authorPath` derivation. Real on-disk state is not
     * inspected here.
     */
    projectedSourcePath: string;
    /** Optional Skillsmith manifest skillId (`<author>/<name>`). */
    skillId?: string | null;
    /** Optional `meta.author` slug (`anthropic`) — flows to suggestion chain. */
    author?: string | null;
    /** Optional `meta.tags` for the suggestion-chain tag fallback. */
    tags?: string[];
    /** Optional `meta.description` (round-tripped for audit-history). */
    description?: string;
    /**
     * Pack-domain hint (e.g. `codehelper`) used at chain tier 2/3. The install
     * caller derives this from the registry response or manifest; pre-flight
     * passes it through unchanged.
     */
    packDomain?: string | null;
}
export interface RunInstallPreflightInput {
    /** Pre-candidate snapshot of `~/.claude/{skills,commands,agents}` + CLAUDE.md. */
    existingInventory: ReadonlyArray<InventoryEntry>;
    /** Synthesized candidate skill being considered for install. */
    candidate: CandidateSkill;
    /** Resolved audit mode (`'preventative'` blocks install in caller). */
    mode: AuditMode;
    /** Subscription tier (drives default mode for the inner detector run). */
    tier: Tier;
}
export interface RunInstallPreflightResult {
    /** Non-blocking warnings (`power_user` / `governance` mode shape). */
    warnings: NamespaceWarning[];
    /**
     * Blocking envelope for `preventative` mode. Populated only when at
     * least one candidate-related collision is detected. Caller decides
     * whether to surface it based on `mode`.
     */
    pendingCollision: PendingCollision | null;
    /**
     * ULID written to audit history. Bubbled explicitly per Edit 7 so the
     * install caller does not re-derive it for telemetry / ledger linkage.
     */
    auditId: AuditId;
}
/**
 * Run the install pre-flight. Pure function over `existingInventory` +
 * `candidate`; emits an audit-history entry as a side effect so the agent's
 * later `apply_namespace_rename` call can re-derive context via `auditId`.
 *
 * Failure model: any unexpected throw inside this function returns the
 * degraded shape (`warnings: []`, `pendingCollision: null`, fresh
 * `auditId`) — the install MUST proceed when the detector breaks (Edit 2).
 */
export declare function runInstallPreflight(input: RunInstallPreflightInput): Promise<RunInstallPreflightResult>;
//# sourceMappingURL=install-preflight.d.ts.map