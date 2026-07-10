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
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolContext } from './context.js';
/**
 * Tool names handled by this dispatcher. `tool-dispatch.ts` delegates
 * iff the requested tool name is in this set.
 */
export declare const PROVENANCE_TOOL_NAMES: ReadonlySet<string>;
/**
 * Returns true if `name` is a provenance-family tool dispatched by this module.
 */
export declare function isProvenanceToolName(name: string): boolean;
export interface ProvenanceToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, unknown>;
        required: string[];
    };
}
/**
 * ListTools definitions for provenance-family tools. `index.ts` spreads this
 * into `toolDefinitions` so the tools become client-discoverable.
 */
export declare function provenanceToolDefinitions(): ProvenanceToolDefinition[];
/**
 * Dispatch a provenance-family tool call. Caller must check
 * {@link isProvenanceToolName} before invoking.
 *
 * Community tools are called directly (no `withLicenseAndQuota` wrapper),
 * mirroring the `skill_inventory_audit` / `apply_namespace_rename` pattern in
 * `audit-tool-dispatch.ts`.
 */
export declare function dispatchProvenanceTool(name: string, args: Record<string, unknown> | undefined, toolContext: ToolContext): Promise<CallToolResult>;
//# sourceMappingURL=provenance-tool-dispatch.d.ts.map