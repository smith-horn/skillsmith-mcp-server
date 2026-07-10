/**
 * @fileoverview SSRF protection: validate external URLs
 * @module @skillsmith/mcp-server/utils/url-validator
 * @see SMI-3914: Wave 0 Shared Infrastructure
 *
 * Blocks private/loopback/link-local addresses, requires HTTPS.
 */
/**
 * Validate that a URL is safe for external requests (SSRF protection).
 *
 * Rules:
 * - Must be a valid URL
 * - Protocol must be HTTPS
 * - Hostname must not be localhost or 0.0.0.0
 * - If hostname is an IP, it must not be in a private/loopback/link-local range
 *
 * @param urlString - The URL string to validate
 * @returns Object with `valid` boolean and optional `error` message
 */
export declare function validateExternalUrl(urlString: string): {
    valid: boolean;
    error?: string;
};
//# sourceMappingURL=url-validator.d.ts.map