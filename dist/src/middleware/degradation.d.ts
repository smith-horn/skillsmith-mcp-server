/**
 * SMI-1060: Graceful Degradation Middleware
 *
 * Middleware that wraps tool handlers with graceful degradation,
 * returning helpful messages instead of hard errors when features
 * are unavailable.
 */
import { type LicenseMiddleware } from './license.js';
import { type FeatureFlag } from './toolFeatureMapping.js';
/**
 * License tiers for degradation middleware
 * Matches the LicenseTier type from license.ts
 */
type DegradationLicenseTier = 'community' | 'individual' | 'team' | 'enterprise';
/**
 * MCP tool request structure
 */
export interface McpToolRequest {
    name: string;
    arguments: Record<string, unknown>;
}
/**
 * MCP tool response structure
 */
export interface McpToolResponse {
    content: Array<{
        type: 'text';
        text: string;
    }>;
    isError?: boolean;
    _meta?: Record<string, unknown>;
}
/**
 * Tool handler function type
 */
export type ToolHandler<T = unknown> = (request: McpToolRequest) => Promise<T>;
/**
 * Degradation event for logging
 */
export interface DegradationLogEvent {
    timestamp: string;
    toolName: string;
    feature: FeatureFlag | null;
    tier: DegradationLicenseTier;
    action: 'allowed' | 'degraded' | 'error';
    message?: string;
}
/**
 * Degradation logger interface
 */
export interface DegradationLogger {
    log(event: DegradationLogEvent): void;
}
/**
 * Degradation middleware options
 */
export interface DegradationMiddlewareOptions {
    /** License middleware instance */
    licenseMiddleware?: LicenseMiddleware;
    /** Logger for degradation events */
    logger?: DegradationLogger;
    /** Enable verbose logging */
    verbose?: boolean;
    /** Custom upgrade URL base */
    upgradeUrlBase?: string;
}
/**
 * Console logger for degradation events
 */
export declare const consoleDegradationLogger: DegradationLogger;
/**
 * Get tier comparison message
 */
export declare function getTierComparisonMessage(): string;
/**
 * Create the degradation middleware
 *
 * This middleware wraps tool handlers to provide graceful degradation
 * when features are unavailable due to license restrictions.
 *
 * @param options - Middleware configuration options
 * @returns Middleware wrapper function
 *
 * @example
 * ```typescript
 * const middleware = createDegradationMiddleware({
 *   logger: consoleDegradationLogger,
 *   verbose: true,
 * });
 *
 * const wrappedHandler = middleware.wrapHandler('audit_query', originalHandler);
 * ```
 */
export declare function createDegradationMiddleware(options?: DegradationMiddlewareOptions): {
    wrapHandler: <T>(toolName: string, handler: ToolHandler<T>, request: McpToolRequest) => Promise<T | McpToolResponse>;
    createWrappedHandler: <T>(toolName: string, handler: ToolHandler<T>) => (request: McpToolRequest) => Promise<T | McpToolResponse>;
    wouldDegrade: (toolName: string) => Promise<boolean>;
    getDegradationStatus: () => Promise<Map<string, boolean>>;
    getUpgradePrompt: (toolName: string) => Promise<string | null>;
    getTierComparisonMessage: typeof getTierComparisonMessage;
    licenseMiddleware: LicenseMiddleware;
};
export type DegradationMiddleware = ReturnType<typeof createDegradationMiddleware>;
export {};
//# sourceMappingURL=degradation.d.ts.map