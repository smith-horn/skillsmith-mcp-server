import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ZodTypeAny, TypeOf } from 'zod';
import type { ToolContext } from '../context.types.js';
import type { QuotaMiddleware } from './quota-types.js';
import type { LicenseMiddleware } from './license.js';
/**
 * SMI-4463: JSON-RPC error code for monthly_quota_exceeded.
 *
 * Lives in the mid-range of the JSON-RPC reserved server-error band
 * (-32000 / -32099). -32099 was at the edge and risks colliding with
 * future spec assignments; -32050 gives us comfortable headroom.
 *
 * Disambiguator from per-minute rate-limit errors is the response
 * `error: 'monthly_quota_exceeded'` body field — never the status code
 * alone (both surface as 429 on the wire).
 *
 * Documented in CODES.md alongside other Skillsmith-canonical codes.
 */
export declare const MCP_MONTHLY_QUOTA_EXCEEDED_CODE = -32050;
/**
 * SMI-6472 Wave 3: optional opt-in for a tool that declares an MCP
 * `outputSchema` and must therefore also return `structuredContent` on every
 * non-error response (the MCP SDK `Client` hard-throws on a declared-schema
 * tool call that comes back without it — see the call sites in
 * `tool-dispatch.ts` for the three tools that pass this today).
 */
export interface OkOptions {
    /**
     * When true, `result` is ALSO attached verbatim as `structuredContent`
     * (cast to `Record<string, unknown>` — MCP requires an object at the
     * schema root, so only pass this for a tool whose result type really is a
     * plain object matching its own declared `outputSchema`).
     */
    structuredContent?: boolean;
}
/**
 * Shared MCP tool response wrapper — ~30 of the 43 tools return through this
 * (directly from `tool-dispatch.ts`, or indirectly via `withLicenseAndQuota`
 * below). `structuredContent` is opt-in (default omitted) rather than
 * always-on: emitting it unconditionally would change the wire shape of
 * every one of those ~30 tools' responses, including the ~40 across the
 * whole server that declare no `outputSchema` at all — out of scope for this
 * wave and needless risk for callers that never asked for it. Stays a
 * stateless pure function (no module-level mutable state) since it runs on
 * every concurrent tool call.
 */
export declare function ok(result: unknown, options?: OkOptions): CallToolResult;
export declare function errResponse(response: {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
    _meta?: Record<string, unknown>;
}): CallToolResult;
export declare function createProfileIncompleteResponse(): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError: true;
};
export declare function withLicenseAndQuota<S extends ZodTypeAny>(toolName: string, args: Record<string, unknown> | undefined, schema: S, handler: (input: TypeOf<S>, ctx: ToolContext) => Promise<unknown>, toolContext: ToolContext, licenseMiddleware: LicenseMiddleware, quotaMiddleware: QuotaMiddleware): Promise<CallToolResult>;
/**
 * Check if a license is expiring soon (within 30 days).
 * @internal Exported for testing. Moved here from license.ts (SMI-6098, 500-line limit).
 */
export declare function getExpirationWarning(expiresAt?: Date): string | undefined;
//# sourceMappingURL=license.gate.d.ts.map