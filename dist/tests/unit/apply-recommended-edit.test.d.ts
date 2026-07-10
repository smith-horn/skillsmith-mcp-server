/**
 * @fileoverview Unit tests for SMI-4590 Wave 4 PR 4 — `apply_recommended_edit`
 *               MCP tool + conditional registration in `audit-tool-dispatch`.
 * @module @skillsmith/mcp-server/tests/unit/apply-recommended-edit
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §3
 *       + §Tests `apply-recommended-edit.test.ts`.
 *
 * Coverage:
 *   1. Valid `auditId` + `collisionId` with `pattern: 'add_domain_qualifier'`
 *      → file mutated, response success.
 *   2. `collisionId` not in audit → typed error.
 *   3. Edit with `pattern: 'narrow_scope'` (not in registry) → typed error
 *      `edit.template_not_in_apply_registry`, file unchanged.
 *   4. **Tool registration**: live registry (non-empty) → name IS in
 *      `AUDIT_TOOL_NAMES`.
 *   5. **Tool registration**: empty registry (mocked at module load) → name
 *      NOT in `AUDIT_TOOL_NAMES`.
 *   6. Stale `before` snippet (file changed after audit) → typed error
 *      `edit.subcall_failed` carrying inner `edit.stale_before`.
 *
 * Pattern: write `~/.skillsmith/audits/<auditId>/suggestions.json` directly
 * with a fixture `RecommendedEdit`. Drives the tool against a hand-rolled
 * audit dir without depending on the semantic-pass pipeline (which would
 * require OverlapDetector + EmbeddingService setup at the unit level).
 */
export {};
//# sourceMappingURL=apply-recommended-edit.test.d.ts.map