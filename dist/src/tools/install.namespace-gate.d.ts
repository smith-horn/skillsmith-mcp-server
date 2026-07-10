/**
 * @fileoverview Namespace pre-flight + mode gate for the install hot path
 *               (SMI-4588 Wave 2 Step 6, PR #3).
 * @module @skillsmith/mcp-server/tools/install.namespace-gate
 *
 * Encapsulates the three steps that bracket `service.install()` in the
 * MCP install tool:
 *
 *   1. Ledger replay — rewrite the candidate skill's identifier when a
 *      previously-recorded user rename matches.
 *   2. Pre-flight collision detection + suggestion-chain generation.
 *   3. Mode gate (`preventative` blocks; `power_user`/`governance` warn).
 *
 * Extracted from `install.ts` per Step 6's "unconditional extraction"
 * directive — keeps the hot-path file under the 500-LOC limit and keeps
 * the new logic independently testable.
 *
 * Edits applied (plan-review 2026-05-02):
 *   - Edit 2: pre-flight scanner failure is ALWAYS non-blocking. The
 *     `runInstallPreflight` module already degrades on detector throws;
 *     this gate additionally swallows ledger-read errors (including
 *     `namespace.ledger.version_unsupported`) so a downgraded ledger
 *     never bricks installs.
 *   - Edit 6: typed `version_unsupported` error caught here, not bubbled.
 *   - Edit 7: pre-flight returns `auditId` explicitly; this gate threads
 *     it into the `pendingCollision` envelope without re-deriving.
 */
import { type CandidateSkill, type RunInstallPreflightResult } from '../audit/install-preflight.js';
import type { AuditMode, Tier } from '@skillsmith/core/config/audit-mode';
import type { InstallResult } from './install.types.js';
export interface NamespaceGateInput {
    /** Synthesized candidate for the skill being installed. */
    candidate: CandidateSkill;
    /** Resolved audit mode (caller resolves via `resolveAuditMode`). */
    mode: AuditMode;
    /** Subscription tier (passed through to detector for telemetry consistency). */
    tier: Tier;
}
export interface NamespaceGateOutcome {
    /**
     * `'block'` only fires when `mode === 'preventative'` AND a candidate-
     * involved collision was detected. Caller short-circuits the install
     * with the `pendingCollision` envelope.
     */
    decision: 'block' | 'proceed';
    /**
     * The (possibly ledger-replayed) candidate. Caller MAY use this for
     * post-install side effects, but Wave 2 PR #3 does not yet wire
     * post-install rename — the ledger-replay rewrites the candidate in
     * place at the pre-flight boundary so the surfaced suggestions match.
     */
    candidate: CandidateSkill;
    /** Always present — populated by `runInstallPreflight`. */
    preflight: RunInstallPreflightResult;
    /**
     * `InstallResult` payload to merge into the caller's return value.
     * Populated for both `block` and `proceed` paths so the install hot
     * path has a single shape to splat.
     */
    resultPatch: Pick<InstallResult, 'installComplete' | 'pendingCollision' | 'warnings'>;
}
/**
 * Run the namespace pre-flight + apply the mode gate. Returns a decision
 * the install hot path branches on. Never throws — all failure paths
 * degrade to `decision: 'proceed'` with a logged warning (Edit 2).
 */
export declare function runNamespaceGate(input: NamespaceGateInput): Promise<NamespaceGateOutcome>;
//# sourceMappingURL=install.namespace-gate.d.ts.map