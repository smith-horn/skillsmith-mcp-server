/**
 * SMI-740: Health Check Module Exports
 *
 * Provides health and readiness check endpoints for the MCP server:
 * - /health: Quick liveness check
 * - /ready: Deep readiness check with dependency verification
 */
// Health check exports
export { HealthCheck, getHealthCheck, createHealthCheck, checkHealth, formatHealthResponse, } from './healthCheck.js';
// Readiness check exports
export { ReadinessCheck, getReadinessCheck, createReadinessCheck, checkReadiness, configureReadinessCheck, formatReadinessResponse, } from './readinessCheck.js';
/**
 * Perform both health and readiness checks
 */
export async function checkAll() {
    const { checkHealth } = await import('./healthCheck.js');
    const { checkReadiness } = await import('./readinessCheck.js');
    const [health, readiness] = await Promise.all([checkHealth(), checkReadiness()]);
    return { health, readiness };
}
//# sourceMappingURL=index.js.map