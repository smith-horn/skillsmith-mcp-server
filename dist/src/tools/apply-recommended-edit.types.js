/**
 * @fileoverview Type vocabulary for the `apply_recommended_edit` MCP tool
 *               (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/tools/apply-recommended-edit.types
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §3.
 *
 * Tool registration is gated on `APPLY_TEMPLATE_REGISTRY.size > 0`
 * (Wave 3 `edit-applier.ts`). When the registry is empty, the tool is
 * NOT exposed in the dispatcher's `AUDIT_TOOL_NAMES` set — defense-in-
 * depth against a rollback that empties the registry.
 */
export {};
//# sourceMappingURL=apply-recommended-edit.types.js.map