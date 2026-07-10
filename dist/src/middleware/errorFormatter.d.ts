/**
 * SMI-1061: MCP Error Formatter for License Errors
 * @see SMI-2741: Types split to errorFormatter.types.ts, builders to errorFormatter.builders.ts
 *
 * Formats license errors into MCP protocol-compliant error responses
 * with actionable information for clients.
 */
export type { MCPErrorContent, MCPErrorResponse, LicenseErrorDetails, LicenseErrorLike, UpgradeUrlConfig, ApiAuthErrorDetails, } from './errorFormatter.types.js';
export { ERROR_MESSAGES, DEFAULT_UPGRADE_URL_CONFIG } from './errorFormatter.types.js';
export { generateUpgradeUrl, buildUpgradeRequiredResponse, buildLicenseExpiredResponse, buildQuotaExceededResponse, formatAuthenticationError, isAuthenticationError, extractAuthErrorDetails, } from './errorFormatter.builders.js';
import type { MCPErrorResponse, LicenseErrorLike } from './errorFormatter.types.js';
/**
 * Format a license error into an MCP-compliant error response
 *
 * @param error - The license error to format
 * @returns MCP-formatted error response
 *
 * @example
 * ```typescript
 * import { formatLicenseError } from './middleware/errorFormatter.js';
 *
 * try {
 *   await checkFeature('audit_logging');
 * } catch (error) {
 *   if (isLicenseError(error)) {
 *     return formatLicenseError(error);
 *   }
 *   throw error;
 * }
 * ```
 */
export declare function formatLicenseError(error: LicenseErrorLike): MCPErrorResponse;
/**
 * Format a generic error for MCP response
 *
 * Use this for non-license errors that still need MCP formatting.
 */
export declare function formatGenericError(error: Error, code?: string): MCPErrorResponse;
/**
 * Get a user-friendly message for an error code
 */
export declare function getUserFriendlyMessage(code: string): string;
/**
 * Check if an object looks like a license error
 */
export declare function isLicenseErrorLike(error: unknown): error is LicenseErrorLike;
/**
 * Safely convert any error to MCP format
 */
export declare function safeFormatError(error: unknown): MCPErrorResponse;
//# sourceMappingURL=errorFormatter.d.ts.map