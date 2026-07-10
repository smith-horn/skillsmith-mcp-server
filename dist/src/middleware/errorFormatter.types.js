/**
 * @fileoverview Error Formatter Type Definitions
 * @module @skillsmith/mcp-server/middleware/errorFormatter.types
 * @see SMI-1061: MCP Error Formatter for License Errors
 * @see SMI-2741: Split from errorFormatter.ts to meet 500-line standard
 */
/**
 * Default configuration for upgrade URL generation
 */
export const DEFAULT_UPGRADE_URL_CONFIG = {
    baseUrl: 'https://skillsmith.app/upgrade',
    includeFeature: true,
    includeTiers: true,
    includeSource: true,
};
// ============================================================================
// Error Code Constants
// ============================================================================
/**
 * Map internal license error codes to user-friendly messages
 */
export const ERROR_MESSAGES = {
    E001: 'Your license has expired. Please renew to continue using premium features.',
    E002: 'Your license key is invalid. Please verify the key format or contact support.',
    E003: 'No license key found. Set SKILLSMITH_LICENSE_KEY environment variable.',
    E004: 'This feature is not available in your current license tier.',
    E005: 'You have exceeded your license quota. Please upgrade or reduce usage.',
    LICENSE_EXPIRED: 'Your license has expired. Please renew to continue using premium features.',
    LICENSE_INVALID: 'Your license key is invalid. Please verify the key format or contact support.',
    LICENSE_NOT_FOUND: 'No license key found. Set SKILLSMITH_LICENSE_KEY environment variable.',
    FEATURE_NOT_AVAILABLE: 'This feature is not available in your current license tier.',
    QUOTA_EXCEEDED: 'You have exceeded your license quota. Please upgrade or reduce usage.',
};
//# sourceMappingURL=errorFormatter.types.js.map