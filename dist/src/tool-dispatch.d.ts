/**
 * @fileoverview Tool dispatch function for the Skillsmith MCP server
 * @module @skillsmith/mcp-server/tool-dispatch
 *
 * Extracted from index.ts (SMI-skill-version-tracking Wave 2) to keep
 * index.ts under the 500-line file-size gate.
 *
 * Handles the switch-case dispatch for all registered MCP tools,
 * including license and quota enforcement for gated tools.
 */
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolContext } from './context.js';
import type { LicenseMiddleware } from './middleware/license.js';
import type { QuotaMiddleware } from './middleware/quota.js';
/**
 * Dispatch a tool call to its handler, applying license and quota checks
 * for gated tools.
 *
 * @param name              MCP tool name
 * @param args              Raw tool arguments from the request
 * @param toolContext       Initialized database + repository context
 * @param licenseMiddleware License validation middleware instance
 * @param quotaMiddleware   Quota enforcement middleware instance
 * @returns MCP tool response
 */
export declare function dispatchToolCall(name: string, args: Record<string, unknown> | undefined, toolContext: ToolContext, licenseMiddleware: LicenseMiddleware, quotaMiddleware: QuotaMiddleware): Promise<CallToolResult>;
//# sourceMappingURL=tool-dispatch.d.ts.map