/**
 * @fileoverview Error Response Builder Functions
 * @module @skillsmith/mcp-server/middleware/errorFormatter.builders
 * @see SMI-1061: MCP Error Formatter for License Errors
 * @see SMI-2741: Split from errorFormatter.ts to meet 500-line standard
 *
 * Pre-built MCP error response factories for common license error scenarios:
 * - Upgrade required (feature tier mismatch)
 * - License expired (renewal needed)
 * - Quota exceeded (usage limit hit)
 * - API authentication errors (401 handling)
 */
import type { MCPErrorResponse, LicenseErrorLike, ApiAuthErrorDetails } from './errorFormatter.types.js';
import type { UpgradeUrlConfig } from './errorFormatter.types.js';
/**
 * Generate a customized upgrade URL with tracking parameters
 */
export declare function generateUpgradeUrl(error: LicenseErrorLike, config?: Partial<UpgradeUrlConfig>): string;
/**
 * Build an upgrade required response
 *
 * Use this when a feature requires an upgrade but isn't a full error.
 */
export declare function buildUpgradeRequiredResponse(feature: string, currentTier: string, requiredTier: string): MCPErrorResponse;
/**
 * Build a license expired response with renewal URL
 */
export declare function buildLicenseExpiredResponse(expiredAt?: Date): MCPErrorResponse;
/**
 * Build a quota exceeded response
 */
export declare function buildQuotaExceededResponse(quotaType: string, current: number, max: number): MCPErrorResponse;
/**
 * Format a 401 authentication error for MCP display
 * Provides user-friendly instructions for getting an API key
 *
 * @param details - Error details from the API response
 * @returns MCP-formatted error response with signup instructions
 */
export declare function formatAuthenticationError(details?: ApiAuthErrorDetails): MCPErrorResponse;
/**
 * Check if an API error is an authentication error (401)
 */
export declare function isAuthenticationError(error: unknown): boolean;
/**
 * Extract authentication error details from an API error response
 */
export declare function extractAuthErrorDetails(error: unknown): ApiAuthErrorDetails;
//# sourceMappingURL=errorFormatter.builders.d.ts.map