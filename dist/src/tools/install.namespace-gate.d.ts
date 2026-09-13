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
import { type AuditMode, type Tier } from '@skillsmith/core/config/audit-mode';
import { type InstallResult } from './install.types.js';
/**
 * SMI-6529 round 4: moved from install.ts to keep it under the 500-line CI
 * gate (pure move, no behavior change) — also breaks what would otherwise be
 * a circular import (install.ts already imports `runNamespaceGate` FROM this
 * file). `install.ts` re-exports this so its own external import path
 * (`from '../../src/tools/install.js'`, used directly by SMI-4737's tests)
 * is unaffected.
 *
 * Best-effort skill name extraction for conflict pre-check. Does not need to
 * be perfect — just needs to match manifest keys.
 *
 * SMI-4737: throws when the extracted segment exceeds `FIELD_LIMITS.token`
 * (128 chars). Adversarial `skillId` inputs that survive the Zod 512-char
 * boundary but produce an over-cap segment are rejected at the derivation
 * site so they cannot reach `sanitizeSegment`'s defensive 256-char floor
 * (SMI-4733). Caller sites must wrap in try/catch and surface a structured
 * tool-error envelope; the throw must not escape the MCP handler.
 */
export declare function extractSkillName(skillId: string): string;
/**
 * Build the `CandidateSkill` shape consumed by `runNamespaceGate`. The
 * pre-flight runs before any disk write, so the path is projected.
 *
 * `extractSkillName` mirrors the manifest-key derivation used elsewhere in
 * install.ts; the `skillId` is propagated when the input is a registry id
 * (`<author>/<name>`) so ledger lookups key on the canonical form.
 */
export declare function buildPreflightCandidate(skillId: string): CandidateSkill;
/**
 * SMI-6529 round 4: moved from install.ts (pure move). Resolve the caller's
 * subscription tier for the audit-mode resolver. Reads `SKILLSMITH_TIER` env
 * var; falls through to `'community'` (the resolver's fail-safe default)
 * when unset or invalid. The MCP subprocess has no JWT context, so env var
 * is the only signal available without cross-cutting changes (Wave 4 will
 * revisit if richer tier resolution becomes load-bearing).
 */
export declare function resolveCallerTier(): Tier;
/**
 * SMI-6529 round 4: moved from install.ts (pure move). Read the optional
 * `SKILLSMITH_AUDIT_MODE` override. Invalid values fall through to `null` so
 * the resolver applies the tier default.
 */
export declare function readAuditModeOverride(): AuditMode | null;
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