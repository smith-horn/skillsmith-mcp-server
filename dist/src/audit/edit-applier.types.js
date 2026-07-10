/**
 * @fileoverview Type vocabulary for the edit-applier (SMI-4589 Wave 3 Step 5).
 * @module @skillsmith/mcp-server/audit/edit-applier.types
 *
 * Mirrors `ApplyRenameResult` (Wave 2 PR #2) so heterogeneous suggestion
 * lists (rename + edit) can be displayed uniformly by Wave 4's MCP tool
 * surface. The error union is purpose-narrow — prose-edit failures don't
 * include any rename-engine codes.
 *
 * Plan: docs/internal/implementation/smi-4589-edit-suggester.md §5.
 */
export {};
//# sourceMappingURL=edit-applier.types.js.map