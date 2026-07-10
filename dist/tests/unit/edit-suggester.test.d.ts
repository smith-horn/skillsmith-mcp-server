/**
 * @fileoverview Unit tests for SMI-4589 Wave 3 — edit-suggester core (10 cases).
 * @module @skillsmith/mcp-server/tests/unit/edit-suggester
 *
 * Covers the 10 cases enumerated in
 * `docs/internal/implementation/smi-4589-edit-suggester.md` §Tests.
 * Apply-path tests (registry rejection + apply success/stale-before)
 * live in `edit-applier.test.ts` to keep both files under the 500-LOC
 * pre-commit gate.
 *
 * Per-template gate (ratified 2026-05-01): only `add_domain_qualifier`
 * (4.10/5) ships in v1. Cases 2-3 assert the failing templates produce
 * NO `RecommendedEdit` from `runEditSuggester` — they're absent from
 * Wave 3 output entirely per plan R-4/R-8.
 */
export {};
//# sourceMappingURL=edit-suggester.test.d.ts.map