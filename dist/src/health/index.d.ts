/**
 * SMI-740: Health Check Module Exports
 *
 * Provides health and readiness check endpoints for the MCP server:
 * - /health: Quick liveness check
 * - /ready: Deep readiness check with dependency verification
 */
export { HealthCheck, getHealthCheck, createHealthCheck, checkHealth, formatHealthResponse, type HealthResponse, type HealthCheckConfig, } from './healthCheck.js';
export { ReadinessCheck, getReadinessCheck, createReadinessCheck, checkReadiness, configureReadinessCheck, formatReadinessResponse, type ReadinessResponse, type ReadinessCheckConfig, type DependencyCheck, } from './readinessCheck.js';
/**
 * Combined health and readiness check response
 */
export interface HealthAndReadiness {
    health: import('./healthCheck.js').HealthResponse;
    readiness: import('./readinessCheck.js').ReadinessResponse;
}
/**
 * Perform both health and readiness checks
 */
export declare function checkAll(): Promise<HealthAndReadiness>;
//# sourceMappingURL=index.d.ts.map