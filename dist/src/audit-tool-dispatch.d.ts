/**
 * @fileoverview Audit-tool dispatch for the Skillsmith MCP server
 * @module @skillsmith/mcp-server/audit-tool-dispatch
 *
 * SMI-4590 Wave 4 Step 0b: extracted from `tool-dispatch.ts` to keep the
 * parent dispatcher under the 500-LOC file-size gate.
 *
 * Wave 4 PR 4 (this PR) adds three new tools:
 *   - `skill_inventory_audit`  — full inventory audit (always registered)
 *   - `apply_namespace_rename` — apply a Wave 2 rename (always registered)
 *   - `apply_recommended_edit` — apply a Wave 3 prose edit; **registered
 *     iff `APPLY_TEMPLATE_REGISTRY.size > 0`** (defense-in-depth — if the
 *     registry ever empties via rollback, the tool unregisters itself and
 *     the audit-report writer surfaces edits as `manual_review` only).
 *
 * Surface: handles dispatch for all audit-family tools. The parent
 * `tool-dispatch.ts` delegates by name match against {@link AUDIT_TOOL_NAMES};
 * this module owns the audit case bodies, license + quota wiring (for the
 * pre-existing `skill_audit` / `skill_pack_audit` cases), and Zod parse
 * error envelopes.
 *
 * Dispatch responses for the three new tools follow the
 * `safeParseOrError` pattern (see `validation.ts`) for protocol-level
 * shape errors, AND embed an application-level `success: false` envelope
 * inside `content[0].text` for domain-level failures (history not found,
 * subcall failed). MCP clients introspect both.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolContext } from './context.js';
import type { LicenseMiddleware } from './middleware/license.js';
import type { QuotaMiddleware } from './middleware/quota.js';
/**
 * Tool names handled by this dispatcher. The parent `tool-dispatch.ts`
 * delegates iff the requested tool name is in this set.
 *
 * `apply_recommended_edit` is conditionally included based on
 * `APPLY_TEMPLATE_REGISTRY.size`. When the registry is empty (rollback
 * scenario), the name is omitted from this set AND
 * {@link dispatchAuditTool} returns the standard "Unknown audit tool"
 * error if the dispatcher is somehow reached for that name.
 */
export declare const AUDIT_TOOL_NAMES: ReadonlySet<string>;
/**
 * Returns true if `name` is an audit-family tool dispatched by this module.
 * Parent dispatcher uses this to route — keeping the routing predicate
 * colocated with the case bodies prevents drift.
 */
export declare function isAuditToolName(name: string): boolean;
/**
 * SMI-5213: ListTools definitions for the THREE NEW audit-family tools
 * (`skill_inventory_audit`, `apply_namespace_rename`, and — gated —
 * `apply_recommended_edit`). `index.ts` spreads this into `toolDefinitions`
 * so the tools become client-discoverable.
 *
 * Deliberately EXCLUDES `skill_audit` / `skill_pack_audit`: those are
 * already registered in `index.ts`'s static array; re-listing them here
 * would double-list them in ListTools.
 *
 * `apply_recommended_edit` is included iff `APPLY_TEMPLATE_REGISTRY.size > 0`
 * — the SAME registration gate `buildAuditToolNames` uses for
 * `AUDIT_TOOL_NAMES`, so the discoverable surface and the dispatchable
 * surface stay in lock-step.
 */
export interface NewAuditToolDefinition {
    name: string;
    description: string;
    inputSchema: {
        type: 'object';
        properties: Record<string, unknown>;
        required: string[];
    };
}
export declare function newAuditToolDefinitions(): NewAuditToolDefinition[];
/**
 * Dispatch an audit-family tool call. Caller must check {@link isAuditToolName}
 * before invoking; unrecognized names throw `Error('Unknown audit tool: <name>')`.
 *
 * @param name              MCP tool name (must be in {@link AUDIT_TOOL_NAMES}).
 * @param args              Raw tool arguments from the request.
 * @param toolContext       Initialized database + repository context.
 * @param licenseMiddleware License validation middleware instance.
 * @param quotaMiddleware   Quota enforcement middleware instance.
 * @returns MCP tool response.
 */
export declare function dispatchAuditTool(name: string, args: Record<string, unknown> | undefined, toolContext: ToolContext, licenseMiddleware: LicenseMiddleware, quotaMiddleware: QuotaMiddleware): Promise<CallToolResult>;
//# sourceMappingURL=audit-tool-dispatch.d.ts.map