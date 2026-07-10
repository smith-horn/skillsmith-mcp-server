/**
 * @fileoverview Provenance-tool dispatch for the Skillsmith MCP server (SMI-5407).
 * @module @skillsmith/mcp-server/provenance-tool-dispatch
 *
 * Mirrors the pattern of `audit-tool-dispatch.ts`: extracted from
 * `tool-dispatch.ts` to keep the parent dispatcher under the 500-LOC gate.
 *
 * Currently handles:
 *   - `skill_recover_source` — read-only source recovery (Community, no
 *     withLicenseAndQuota; direct call pattern per audit-tool-dispatch.ts
 *     lines 178-179).
 *
 * Cut for v1: `apply_source_backfill` mutation tool (fast-follow, SMI-5407 DoD).
 */
import { executeSkillRecoverSource, skillRecoverSourceToolSchema, } from './tools/skill-recover-source.js';
// ============================================================================
// Tool name set
// ============================================================================
/**
 * Tool names handled by this dispatcher. `tool-dispatch.ts` delegates
 * iff the requested tool name is in this set.
 */
export const PROVENANCE_TOOL_NAMES = new Set(['skill_recover_source']);
/**
 * Returns true if `name` is a provenance-family tool dispatched by this module.
 */
export function isProvenanceToolName(name) {
    return PROVENANCE_TOOL_NAMES.has(name);
}
/**
 * ListTools definitions for provenance-family tools. `index.ts` spreads this
 * into `toolDefinitions` so the tools become client-discoverable.
 */
export function provenanceToolDefinitions() {
    return [skillRecoverSourceToolSchema];
}
// ============================================================================
// Dispatch helpers
// ============================================================================
/** Wrap a payload as a successful MCP `CallToolResult` (mirrors audit-dispatch). */
function okBody(payload) {
    return {
        content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
        isError: false,
    };
}
// ============================================================================
// Main dispatcher
// ============================================================================
/**
 * Dispatch a provenance-family tool call. Caller must check
 * {@link isProvenanceToolName} before invoking.
 *
 * Community tools are called directly (no `withLicenseAndQuota` wrapper),
 * mirroring the `skill_inventory_audit` / `apply_namespace_rename` pattern in
 * `audit-tool-dispatch.ts`.
 */
export async function dispatchProvenanceTool(name, args, toolContext) {
    switch (name) {
        case 'skill_recover_source':
            return okBody(await executeSkillRecoverSource(args, toolContext));
        default:
            throw new Error('Unknown provenance tool: ' + name);
    }
}
//# sourceMappingURL=provenance-tool-dispatch.js.map