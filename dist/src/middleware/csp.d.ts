/**
 * Content Security Policy middleware and utilities for MCP server
 *
 * While the MCP server currently uses stdio transport, these utilities
 * provide CSP support for potential HTTP transport scenarios.
 */
/**
 * CSP directive types
 */
export interface CspDirectives {
    'default-src'?: string[];
    'script-src'?: string[];
    'style-src'?: string[];
    'img-src'?: string[];
    'font-src'?: string[];
    'connect-src'?: string[];
    'media-src'?: string[];
    'object-src'?: string[];
    'frame-src'?: string[];
    'worker-src'?: string[];
    'form-action'?: string[];
    'frame-ancestors'?: string[];
    'base-uri'?: string[];
    'manifest-src'?: string[];
    sandbox?: string[];
    'report-uri'?: string[];
    'report-to'?: string;
    'require-trusted-types-for'?: string[];
    'upgrade-insecure-requests'?: boolean;
    'block-all-mixed-content'?: boolean;
}
/**
 * CSP validation result with details
 */
export interface CspValidationResult {
    valid: boolean;
    warnings: string[];
    errors: string[];
}
/**
 * HTTP request interface for CSP middleware
 * Minimal interface for HTTP request objects
 */
export interface CspHttpRequest {
    headers?: Record<string, string | string[] | undefined>;
    url?: string;
}
/**
 * HTTP response interface for CSP middleware
 * Minimal interface for HTTP response objects with CSP-related methods
 */
export interface CspHttpResponse {
    setHeader: (name: string, value: string) => void;
    locals?: Record<string, unknown>;
}
/**
 * Default CSP directives for MCP server
 */
export declare const DEFAULT_CSP_DIRECTIVES: CspDirectives;
/**
 * Strict CSP directives for maximum security
 */
export declare const STRICT_CSP_DIRECTIVES: CspDirectives;
/**
 * Generates a cryptographically secure nonce for CSP
 * @returns A 32-character base64 nonce
 */
export declare function generateNonce(): string;
/**
 * Converts CSP directives object to a CSP header string
 * @param directives - The CSP directives to convert
 * @param nonce - Optional nonce to add to script-src and style-src
 * @returns The CSP header value
 */
export declare function buildCspHeader(directives: CspDirectives, nonce?: string): string;
/**
 * Validates a CSP header string
 * @param csp - The CSP header string to validate
 * @returns true if valid, false otherwise
 */
export declare function validateCspHeader(csp: string): boolean;
/**
 * Validates a CSP header string with detailed results
 * @param csp - The CSP header string to validate
 * @returns Detailed validation result with warnings and errors
 */
export declare function validateCspHeaderDetailed(csp: string): CspValidationResult;
/**
 * HTTP middleware function for adding CSP headers
 * This can be used if the MCP server adds HTTP transport in the future
 */
export declare function cspMiddleware(directives?: CspDirectives): (_req: CspHttpRequest, res: CspHttpResponse, next: () => void) => void;
/**
 * Gets CSP configuration for different environments
 *
 * NOTE: Test environment uses relaxed CSP for testing purposes.
 * Production code should always use STRICT_CSP_DIRECTIVES.
 *
 * @param env - The environment (development, production, test)
 * @returns The appropriate CSP directives
 */
export declare function getCspForEnvironment(env?: string): CspDirectives;
//# sourceMappingURL=csp.d.ts.map