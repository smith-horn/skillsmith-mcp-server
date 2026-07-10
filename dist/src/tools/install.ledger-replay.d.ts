/**
 * @fileoverview Ledger-replay rewriter for the install hot path
 *               (SMI-4588 Wave 2 Step 6, PR #3).
 * @module @skillsmith/mcp-server/tools/install.ledger-replay
 *
 * Pure rewriter: takes an install candidate and the namespace-overrides
 * ledger, returns the candidate rewritten to its previously-renamed
 * identifier when a matching ledger entry exists. Conceptually identical
 * to git's `rerere` — the user's prior manual rename is silently
 * re-applied so a pack version bump never resurrects the original
 * `/ship` filename.
 *
 * This module is deliberately pure (no fs, no side effects) so it can
 * compose into the install hot path without changing the on-disk write
 * timing. The caller (install.ts) loads the ledger once via
 * `readLedger()` and passes it in, then runs pre-flight against the
 * REWRITTEN candidate identifier — the rewrite must happen before
 * collision detection so a previously-resolved collision doesn't
 * re-surface as a fresh warning on every install.
 *
 * Plan §3 — install integration step 3 (ledger replay).
 */
import type { OverrideRecord, OverridesLedger } from '../audit/namespace-overrides.types.js';
import type { CandidateSkill } from '../audit/install-preflight.js';
export interface LedgerReplayResult {
    /** Candidate after applying any ledger overrides (`identifier`/`projectedSourcePath` rewritten). */
    candidate: CandidateSkill;
    /** Override entries that matched the candidate. Empty when no replay occurred. */
    applied: OverrideRecord[];
}
/**
 * Rewrite the candidate skill's identifier (and projected source path)
 * when a matching ledger override exists. Match keys:
 *
 *   - `(skillId, kind: 'skill', originalIdentifier === candidate.identifier)`
 *
 * When `candidate.skillId` is provided, the lookup is keyed against the
 * Skillsmith manifest skillId (`<author>/<name>`). When omitted, the
 * lookup falls back to identifier-only matching across all `skillId`s —
 * the user's local override applies regardless of registration state.
 *
 * Multiple matches: applies them in iteration order. In practice only
 * one entry per `(skillId, originalIdentifier)` exists thanks to
 * `appendOverride`'s dedupe, but the loop is defensive against ledger
 * mutation outside the writer (e.g., a user hand-edits the JSON).
 *
 * Returns the candidate unchanged when no entry matches OR the ledger is
 * empty. Reference equality on `candidate` is preserved for the no-op
 * branch so callers can detect "no replay happened" without recomputing.
 */
export declare function applyLedgerReplay(candidate: CandidateSkill, ledger: OverridesLedger): LedgerReplayResult;
//# sourceMappingURL=install.ledger-replay.d.ts.map