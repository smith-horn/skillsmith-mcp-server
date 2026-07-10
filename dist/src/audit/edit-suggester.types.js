/**
 * @fileoverview Type vocabulary for the edit-suggester (SMI-4589 Wave 3 Step 1).
 * @module @skillsmith/mcp-server/audit/edit-suggester.types
 *
 * Defines `RecommendedEdit`, `EditCategory`, `EditTemplate` — the public
 * surface consumed by Wave 3's audit-report writer extension, install
 * pre-flight wiring, and Wave 4's MCP `apply_recommended_edit` tool surface.
 *
 * The shapes are deliberately additive: `RecommendedEdit` does not extend
 * `RenameSuggestion` (Wave 2) because the `before`/`after` snippet pair has
 * no analogue in the rename surface — coupling them would force the rename
 * engine to carry prose-edit fields it never uses.
 *
 * Plan: docs/internal/implementation/smi-4589-edit-suggester.md §1.
 */
export {};
//# sourceMappingURL=edit-suggester.types.js.map