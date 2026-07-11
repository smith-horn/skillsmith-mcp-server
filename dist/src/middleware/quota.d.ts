/**
 * SMI-1091: Quota Enforcement Middleware for MCP Server
 *
 * Enforces API call quotas based on license tier.
 * Integrates with the license middleware and QuotaEnforcementService.
 *
 * Tier Limits (SMI-5558):
 * - Community: 100 API calls/month (free)
 * - Individual: 1,000 API calls/month ($9.99/mo)
 * - Team: 10,000 API calls/month ($25/user/mo)
 * - Enterprise: Unlimited
 *
 * Unlike the edge function's `quota-enforcer.ts` (which only hard-blocks
 * Community and only when `ENFORCE_COMMUNITY_QUOTA=true`), this middleware
 * has historically hard-blocked ALL non-unlimited tiers unconditionally.
 * `SKILLSMITH_ENFORCE_MCP_QUOTA` (SMI-5558) adds a kill-switch so that behavior can be
 * disabled without a redeploy if the 10x-lower quotas cause unexpected
 * paid-tier disruption. Defaults to enforcing (preserves prior behavior).
 *
 * @see SMI-1055: Add license middleware to MCP server
 * @see packages/enterprise/src/quota/QuotaEnforcementService.ts
 */
import type { LicenseMiddleware, LicenseTier } from './license.js';
import { type MCPErrorResponse } from './errorFormatter.js';
export type { QuotaCheckResult, QuotaMetadata, QuotaMiddlewareOptions, QuotaStorage, QuotaMiddleware, WarningLevel, } from './quota-types.js';
import type { QuotaMiddlewareOptions, QuotaMiddleware } from './quota-types.js';
/**
 * Create a quota enforcement middleware
 *
 * @param options - Configuration options
 * @returns Quota middleware instance
 *
 * @example
 * ```typescript
 * import { createQuotaMiddleware } from './middleware/quota.js';
 * import { createLicenseMiddleware } from './middleware/license.js';
 *
 * const licenseMiddleware = createLicenseMiddleware();
 * const quotaMiddleware = createQuotaMiddleware();
 *
 * // In tool handler:
 * async function handleTool(toolName: string, params: unknown) {
 *   const licenseInfo = await licenseMiddleware.getLicenseInfo();
 *   const quotaResult = await quotaMiddleware.checkAndTrack(toolName, licenseInfo);
 *
 *   if (!quotaResult.allowed) {
 *     return quotaMiddleware.buildExceededResponse(quotaResult);
 *   }
 *
 *   // Execute tool...
 *   const result = await executeTool(toolName, params);
 *
 *   // Add quota metadata to response
 *   return {
 *     ...result,
 *     _meta: {
 *       ...result._meta,
 *       quota: quotaMiddleware.buildMetadata(quotaResult),
 *     },
 *   };
 * }
 * ```
 */
export declare function createQuotaMiddleware(options?: QuotaMiddlewareOptions): QuotaMiddleware;
/**
 * Wrap a tool handler with quota enforcement
 *
 * @param handler - The original tool handler
 * @param licenseMiddleware - License middleware instance
 * @param quotaMiddleware - Quota middleware instance
 * @returns Wrapped handler with quota enforcement
 *
 * @example
 * ```typescript
 * const searchHandler = withQuotaEnforcement(
 *   originalSearchHandler,
 *   licenseMiddleware,
 *   quotaMiddleware
 * );
 * ```
 */
export declare function withQuotaEnforcement<TParams, TResult>(handler: (params: TParams) => Promise<TResult>, licenseMiddleware: LicenseMiddleware, quotaMiddleware: QuotaMiddleware): (toolName: string, params: TParams) => Promise<TResult | MCPErrorResponse>;
/**
 * Check if a tier has unlimited quota
 */
export declare function isUnlimitedTier(tier: LicenseTier): boolean;
/**
 * Get the quota limit for a tier
 */
export declare function getQuotaLimit(tier: LicenseTier): number;
/**
 * Format quota remaining for display
 */
export declare function formatQuotaRemaining(remaining: number, limit: number): string;
//# sourceMappingURL=quota.d.ts.map