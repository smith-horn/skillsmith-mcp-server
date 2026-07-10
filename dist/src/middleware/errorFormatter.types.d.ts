/**
 * @fileoverview Error Formatter Type Definitions
 * @module @skillsmith/mcp-server/middleware/errorFormatter.types
 * @see SMI-1061: MCP Error Formatter for License Errors
 * @see SMI-2741: Split from errorFormatter.ts to meet 500-line standard
 */
/**
 * MCP-formatted error response content
 */
export interface MCPErrorContent {
    type: 'text';
    text: string;
}
/**
 * MCP-formatted error response
 */
export interface MCPErrorResponse {
    content: MCPErrorContent[];
    isError: true;
    _meta?: {
        upgradeUrl?: string;
        errorCode?: string;
        recoverable?: boolean;
    };
}
/**
 * License error details structure (mirrors the enterprise package)
 */
export interface LicenseErrorDetails {
    code: string;
    message: string;
    feature?: string;
    currentTier?: string;
    requiredTier?: string;
    upgradeUrl?: string;
    context?: Record<string, unknown>;
    timestamp?: string;
}
/**
 * Interface for license errors (duck-typed for optional enterprise package)
 */
export interface LicenseErrorLike {
    code?: string;
    message: string;
    feature?: string;
    currentTier?: string;
    requiredTier?: string;
    upgradeUrl?: string;
    context?: Record<string, unknown>;
    timestamp?: Date;
    toJSON?: () => Record<string, unknown>;
}
/**
 * Configuration for upgrade URLs
 */
export interface UpgradeUrlConfig {
    baseUrl?: string;
    includeFeature?: boolean;
    includeTiers?: boolean;
    includeSource?: boolean;
}
/**
 * Default configuration for upgrade URL generation
 */
export declare const DEFAULT_UPGRADE_URL_CONFIG: UpgradeUrlConfig;
/**
 * Details from a 401 API authentication error
 */
export interface ApiAuthErrorDetails {
    reason?: string;
    signupUrl?: string;
    docsUrl?: string;
    hint?: string;
    trialUsed?: number;
    trialLimit?: number;
}
/**
 * Map internal license error codes to user-friendly messages
 */
export declare const ERROR_MESSAGES: Record<string, string>;
//# sourceMappingURL=errorFormatter.types.d.ts.map