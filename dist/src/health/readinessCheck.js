/**
 * SMI-740: Readiness Check with Dependency Checks
 *
 * Provides a comprehensive readiness check that verifies:
 * - Database connectivity
 * - Cache status
 * - External service availability
 *
 * Returns 503 if any critical dependency fails.
 */
/**
 * Readiness Check Handler
 *
 * Performs deep health checks including database connectivity,
 * cache status, and other dependencies.
 */
export class ReadinessCheck {
    database;
    cacheCheck;
    customChecks;
    checkTimeout;
    constructor(config = {}) {
        this.database = config.database ?? null;
        this.cacheCheck = config.cacheCheck ?? null;
        this.customChecks = (config.customChecks ?? []).map((c) => ({
            ...c,
            critical: c.critical ?? true,
        }));
        this.checkTimeout = config.checkTimeout ?? 5000;
    }
    /**
     * Set the database instance
     */
    setDatabase(db) {
        this.database = db;
    }
    /**
     * Set the cache check function
     */
    setCacheCheck(check) {
        this.cacheCheck = check;
    }
    /**
     * Add a custom dependency check
     */
    addCheck(name, check, critical = true) {
        this.customChecks.push({ name, check, critical });
    }
    /**
     * Perform full readiness check
     *
     * Checks all dependencies and returns overall readiness status.
     */
    async check() {
        const startTime = performance.now();
        const checks = [];
        let allCriticalOk = true;
        // Check database
        const dbCheck = await this.checkDatabase();
        checks.push(dbCheck);
        if (dbCheck.status === 'unhealthy') {
            allCriticalOk = false;
        }
        // Check cache
        const cacheCheckResult = await this.checkCache();
        checks.push(cacheCheckResult);
        if (cacheCheckResult.status === 'unhealthy') {
            allCriticalOk = false;
        }
        // Run custom checks
        for (const customCheck of this.customChecks) {
            const result = await this.runCustomCheck(customCheck);
            checks.push(result);
            if (result.status === 'unhealthy' && customCheck.critical) {
                allCriticalOk = false;
            }
        }
        const totalDuration = performance.now() - startTime;
        return {
            ready: allCriticalOk,
            statusCode: allCriticalOk ? 200 : 503,
            timestamp: new Date().toISOString(),
            checks,
            totalDuration: Math.round(totalDuration * 100) / 100,
        };
    }
    /**
     * Check database connectivity
     */
    async checkDatabase() {
        const startTime = performance.now();
        if (!this.database) {
            return {
                name: 'database',
                status: 'degraded',
                details: { reason: 'Database not configured' },
            };
        }
        try {
            // Perform a simple query to check connectivity
            const result = await this.withTimeout(async () => {
                // Use a simple query that should always work
                const stmt = this.database.prepare('SELECT 1 as health_check');
                return stmt.get();
            }, this.checkTimeout);
            const responseTime = performance.now() - startTime;
            if (result) {
                return {
                    name: 'database',
                    status: 'ok',
                    responseTime: Math.round(responseTime * 100) / 100,
                    details: { type: 'sqlite' },
                };
            }
            else {
                return {
                    name: 'database',
                    status: 'unhealthy',
                    responseTime: Math.round(responseTime * 100) / 100,
                    error: 'Query returned no result',
                };
            }
        }
        catch (error) {
            const responseTime = performance.now() - startTime;
            return {
                name: 'database',
                status: 'unhealthy',
                responseTime: Math.round(responseTime * 100) / 100,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Check cache status
     */
    async checkCache() {
        const startTime = performance.now();
        if (!this.cacheCheck) {
            return {
                name: 'cache',
                status: 'ok',
                details: { reason: 'Cache check not configured, assuming healthy' },
            };
        }
        try {
            const result = await this.withTimeout(this.cacheCheck, this.checkTimeout);
            const responseTime = performance.now() - startTime;
            return {
                name: 'cache',
                status: result ? 'ok' : 'unhealthy',
                responseTime: Math.round(responseTime * 100) / 100,
            };
        }
        catch (error) {
            const responseTime = performance.now() - startTime;
            return {
                name: 'cache',
                status: 'unhealthy',
                responseTime: Math.round(responseTime * 100) / 100,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Run a custom check
     */
    async runCustomCheck(customCheck) {
        const startTime = performance.now();
        try {
            const result = await this.withTimeout(customCheck.check, this.checkTimeout);
            const responseTime = performance.now() - startTime;
            return {
                name: customCheck.name,
                status: result.ok ? 'ok' : 'unhealthy',
                responseTime: Math.round(responseTime * 100) / 100,
                details: result.details,
            };
        }
        catch (error) {
            const responseTime = performance.now() - startTime;
            return {
                name: customCheck.name,
                status: 'unhealthy',
                responseTime: Math.round(responseTime * 100) / 100,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    /**
     * Execute a function with timeout
     */
    async withTimeout(fn, timeoutMs) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(new Error(`Check timed out after ${timeoutMs}ms`));
            }, timeoutMs);
            fn()
                .then((result) => {
                clearTimeout(timer);
                resolve(result);
            })
                .catch((error) => {
                clearTimeout(timer);
                reject(error);
            });
        });
    }
    /**
     * Quick readiness check (boolean result)
     */
    async isReady() {
        const result = await this.check();
        return result.ready;
    }
}
// Default readiness check instance
let defaultReadinessCheck = null;
/**
 * Get the default readiness check instance
 */
export function getReadinessCheck() {
    if (!defaultReadinessCheck) {
        defaultReadinessCheck = new ReadinessCheck();
    }
    return defaultReadinessCheck;
}
/**
 * Create a new readiness check instance with custom configuration
 */
export function createReadinessCheck(config) {
    return new ReadinessCheck(config);
}
/**
 * Perform a quick readiness check using the default instance
 */
export async function checkReadiness() {
    return getReadinessCheck().check();
}
/**
 * Configure the default readiness check
 */
export function configureReadinessCheck(config) {
    const check = getReadinessCheck();
    if (config.database !== undefined) {
        check.setDatabase(config.database);
    }
    if (config.cacheCheck !== undefined) {
        check.setCacheCheck(config.cacheCheck);
    }
    if (config.customChecks) {
        for (const custom of config.customChecks) {
            check.addCheck(custom.name, custom.check, custom.critical);
        }
    }
}
/**
 * Format readiness response for HTTP
 */
export function formatReadinessResponse(response) {
    return {
        statusCode: response.statusCode,
        body: response,
    };
}
//# sourceMappingURL=readinessCheck.js.map