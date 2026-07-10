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
 * Process start time for uptime calculation
 */
const processStartTime = Date.now();
/**
 * Health Check Handler
 *
 * Provides lightweight health check functionality that can be used
 * with any HTTP framework or MCP tool.
 */
export class HealthCheck {
    version;
    customCheck;
    constructor(config = {}) {
        this.version = config.version ?? process.env.npm_package_version ?? '0.1.0';
        this.customCheck = config.customCheck;
    }
    /**
     * Perform health check
     *
     * This is a lightweight check that should return quickly.
     * For deep health checks including dependencies, use ReadinessCheck.
     */
    async check() {
        const uptimeMs = Date.now() - processStartTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const response = {
            status: 'ok',
            uptime: uptimeSeconds,
            version: this.version,
            timestamp: new Date().toISOString(),
        };
        // Run custom check if provided
        if (this.customCheck) {
            try {
                const result = await this.customCheck();
                if (!result.healthy) {
                    response.status = 'degraded';
                }
                if (result.info) {
                    response.info = result.info;
                }
            }
            catch (error) {
                response.status = 'degraded';
                response.info = {
                    customCheckError: error instanceof Error ? error.message : 'Unknown error',
                };
            }
        }
        return response;
    }
    /**
     * Get uptime in seconds
     */
    getUptime() {
        return Math.floor((Date.now() - processStartTime) / 1000);
    }
    /**
     * Get version
     */
    getVersion() {
        return this.version;
    }
    /**
     * Check if the service is healthy (for simple boolean checks)
     */
    async isHealthy() {
        const result = await this.check();
        return result.status === 'ok';
    }
}
// Default health check instance
let defaultHealthCheck = null;
/**
 * Get the default health check instance
 */
export function getHealthCheck() {
    if (!defaultHealthCheck) {
        defaultHealthCheck = new HealthCheck();
    }
    return defaultHealthCheck;
}
/**
 * Create a new health check instance with custom configuration
 */
export function createHealthCheck(config) {
    return new HealthCheck(config);
}
/**
 * Perform a quick health check using the default instance
 */
export async function checkHealth() {
    return getHealthCheck().check();
}
/**
 * Format health response for HTTP (includes status code)
 */
export function formatHealthResponse(response) {
    const statusCode = response.status === 'ok' ? 200 : response.status === 'degraded' ? 200 : 503;
    return {
        statusCode,
        body: response,
    };
}
//# sourceMappingURL=healthCheck.js.map