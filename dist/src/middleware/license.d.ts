/**
 * License validation middleware for MCP server
 *
 * Validates that the user has the required license features for enterprise tools.
 * Gracefully degrades if @skillsmith/enterprise is not installed.
 *
 * @see SMI-1055: Add license middleware to MCP server
 */
import { type FeatureFlag } from './toolFeatureMapping.js';
/**
 * License validation result
 */
export interface LicenseValidationResult {
    valid: boolean;
    feature?: FeatureFlag;
    message?: string;
    upgradeUrl?: string;
    warning?: string;
}
/**
 * License tiers available in Skillsmith
 * - community: Free tier (1,000 API calls/month)
 * - individual: Solo developers ($9.99/mo, 10,000 API calls/month)
 * - team: Development teams ($25/user/mo, 100,000 API calls/month)
 * - enterprise: Full enterprise ($55/user/mo, unlimited)
 */
export type LicenseTier = 'community' | 'individual' | 'team' | 'enterprise';
/**
 * License information interface (mirrors @skillsmith/enterprise LicenseInfo)
 */
export interface LicenseInfo {
    valid: boolean;
    tier: LicenseTier;
    features: FeatureFlag[];
    expiresAt?: Date;
    organizationId?: string;
}
/**
 * License from enterprise package validation
 */
interface EnterpriseLicense {
    tier: LicenseTier;
    features: FeatureFlag[];
    customerId: string;
    issuedAt: Date;
    expiresAt: Date;
}
/**
 * Validation result from enterprise package
 */
interface EnterpriseValidationResult {
    valid: boolean;
    license?: EnterpriseLicense;
    error?: {
        code: string;
        message: string;
    };
}
/**
 * License validator instance type from enterprise package
 * Uses duck typing to avoid interface drift with the actual implementation
 */
type EnterpriseValidator = {
    validate(licenseKey: string): Promise<EnterpriseValidationResult>;
};
/**
 * Check if a tool name corresponds to an enterprise feature
 *
 * @param toolName - The name of the MCP tool
 * @returns true if the tool requires an enterprise license
 */
export declare function isEnterpriseFeature(toolName: string): boolean;
/**
 * Check if a tool name requires any license (team or enterprise)
 *
 * @param toolName - The name of the MCP tool
 * @returns true if the tool requires any license
 */
export declare function requiresLicense(toolName: string): boolean;
/**
 * Get the required feature for a tool
 *
 * @param toolName - The name of the MCP tool
 * @returns The feature flag required, or null if community tool
 */
export declare function getRequiredFeature(toolName: string): FeatureFlag | null;
/**
 * Check if license is expiring soon (within 30 days)
 * @internal Exported for testing
 */
export declare function getExpirationWarning(expiresAt?: Date): string | undefined;
/**
 * License middleware context
 */
export interface LicenseMiddlewareContext {
    validator: EnterpriseValidator | null;
    licenseKey: string | undefined;
    cachedLicense: LicenseInfo | null;
    cacheExpiry: number;
}
/**
 * License middleware instance
 */
export interface LicenseMiddleware {
    /**
     * Check if a specific feature is available
     */
    checkFeature(feature: FeatureFlag): Promise<LicenseValidationResult>;
    /**
     * Check if a tool can be executed
     */
    checkTool(toolName: string): Promise<LicenseValidationResult>;
    /**
     * Get the current license info
     */
    getLicenseInfo(): Promise<LicenseInfo | null>;
    /**
     * Invalidate the cached license
     */
    invalidateCache(): void;
}
/**
 * Create a license middleware factory
 *
 * This middleware reads the license key from environment variables and
 * validates tool access based on the license features.
 *
 * @param options - Optional configuration
 * @returns License middleware instance
 */
export declare function createLicenseMiddleware(options?: {
    licenseKeyEnvVar?: string;
    cacheTtlMs?: number;
}): LicenseMiddleware;
/**
 * Higher-order function to create feature requirement middleware
 *
 * Use this to wrap tool handlers that require specific features.
 *
 * @param feature - The feature flag required
 * @returns Middleware function that checks the feature
 *
 * @example
 * ```typescript
 * const middleware = createLicenseMiddleware();
 * const requireAudit = requireFeature('audit_logging');
 *
 * // In tool handler:
 * const validation = await requireAudit(middleware);
 * if (!validation.valid) {
 *   return { error: validation.message, upgradeUrl: validation.upgradeUrl };
 * }
 * ```
 */
export declare function requireFeature(feature: FeatureFlag): (middleware: LicenseMiddleware) => Promise<LicenseValidationResult>;
/**
 * Create an error response for license validation failures
 *
 * @param result - The license validation result
 * @returns MCP-formatted error response
 */
export declare function createLicenseErrorResponse(result: LicenseValidationResult): {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError: true;
    _meta?: {
        upgradeUrl: string;
    };
};
export { ok, errResponse, withLicenseAndQuota, createProfileIncompleteResponse, } from './license.gate.js';
export { featuresForTier, createTierResolver } from './license.tier.js';
export type { FeatureFlag } from './toolFeatureMapping.js';
export { TOOL_FEATURES, FEATURE_DISPLAY_NAMES, FEATURE_TIERS } from './toolFeatureMapping.js';
//# sourceMappingURL=license.d.ts.map