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
export declare function ok(result: unknown): CallToolResult;
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
//# sourceMappingURL=license.gate.d.ts.map