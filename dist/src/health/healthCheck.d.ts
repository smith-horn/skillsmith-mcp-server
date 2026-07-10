/**
 * SMI-740: Health Check Endpoint Handler
 *
 * Provides a simple health check endpoint that returns:
 * - status: "ok" | "degraded" | "unhealthy"
 * - uptime: number (seconds)
 * - version: string
 *
 * This endpoint should always return quickly and not perform
 * expensive operations like database queries.
 */
/**
 * Health check response
 */
export interface HealthResponse {
    /** Current health status */
    status: 'ok' | 'degraded' | 'unhealthy';
    /** Process uptime in seconds */
    uptime: number;
    /** Application version */
    version: string;
    /** Timestamp of the health check */
    timestamp: string;
    /** Optional additional info */
    info?: Record<string, unknown>;
}
/**
 * Health check configuration
 */
export interface HealthCheckConfig {
    /** Application version (default: from package.json or '0.0.0') */
    version?: string;
    /** Custom health check function */
    customCheck?: () => Promise<{
        healthy: boolean;
        info?: Record<string, unknown>;
    }>;
}
/**
 * Health Check Handler
 *
 * Provides lightweight health check functionality that can be used
 * with any HTTP framework or MCP tool.
 */
export declare class HealthCheck {
    private readonly version;
    private readonly customCheck?;
    constructor(config?: HealthCheckConfig);
    /**
     * Perform health check
     *
     * This is a lightweight check that should return quickly.
     * For deep health checks including dependencies, use ReadinessCheck.
     */
    check(): Promise<HealthResponse>;
    /**
     * Get uptime in seconds
     */
    getUptime(): number;
    /**
     * Get version
     */
    getVersion(): string;
    /**
     * Check if the service is healthy (for simple boolean checks)
     */
    isHealthy(): Promise<boolean>;
}
/**
 * Get the default health check instance
 */
export declare function getHealthCheck(): HealthCheck;
/**
 * Create a new health check instance with custom configuration
 */
export declare function createHealthCheck(config: HealthCheckConfig): HealthCheck;
/**
 * Perform a quick health check using the default instance
 */
export declare function checkHealth(): Promise<HealthResponse>;
/**
 * Format health response for HTTP (includes status code)
 */
export declare function formatHealthResponse(response: HealthResponse): {
    statusCode: number;
    body: HealthResponse;
};
//# sourceMappingURL=healthCheck.d.ts.map