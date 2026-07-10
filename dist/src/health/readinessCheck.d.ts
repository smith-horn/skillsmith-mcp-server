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
import type { Database as DatabaseType } from '@skillsmith/core';
/**
 * Dependency check result
 */
export interface DependencyCheck {
    /** Dependency name */
    name: string;
    /** Check status */
    status: 'ok' | 'degraded' | 'unhealthy';
    /** Response time in ms */
    responseTime?: number;
    /** Error message if unhealthy */
    error?: string;
    /** Additional details */
    details?: Record<string, unknown>;
}
/**
 * Readiness response
 */
export interface ReadinessResponse {
    /** Overall readiness status */
    ready: boolean;
    /** HTTP status code to return */
    statusCode: number;
    /** Timestamp of the check */
    timestamp: string;
    /** Individual dependency check results */
    checks: DependencyCheck[];
    /** Total check duration in ms */
    totalDuration: number;
}
/**
 * Readiness check configuration
 */
export interface ReadinessCheckConfig {
    /** Database instance for connectivity check */
    database?: DatabaseType | null;
    /** Cache check function */
    cacheCheck?: () => Promise<boolean>;
    /** Custom dependency checks */
    customChecks?: Array<{
        name: string;
        check: () => Promise<{
            ok: boolean;
            details?: Record<string, unknown>;
        }>;
        critical?: boolean;
    }>;
    /** Timeout for each check in ms (default: 5000) */
    checkTimeout?: number;
}
/**
 * Readiness Check Handler
 *
 * Performs deep health checks including database connectivity,
 * cache status, and other dependencies.
 */
export declare class ReadinessCheck {
    private database;
    private cacheCheck;
    private customChecks;
    private checkTimeout;
    constructor(config?: ReadinessCheckConfig);
    /**
     * Set the database instance
     */
    setDatabase(db: DatabaseType | null): void;
    /**
     * Set the cache check function
     */
    setCacheCheck(check: (() => Promise<boolean>) | null): void;
    /**
     * Add a custom dependency check
     */
    addCheck(name: string, check: () => Promise<{
        ok: boolean;
        details?: Record<string, unknown>;
    }>, critical?: boolean): void;
    /**
     * Perform full readiness check
     *
     * Checks all dependencies and returns overall readiness status.
     */
    check(): Promise<ReadinessResponse>;
    /**
     * Check database connectivity
     */
    private checkDatabase;
    /**
     * Check cache status
     */
    private checkCache;
    /**
     * Run a custom check
     */
    private runCustomCheck;
    /**
     * Execute a function with timeout
     */
    private withTimeout;
    /**
     * Quick readiness check (boolean result)
     */
    isReady(): Promise<boolean>;
}
/**
 * Get the default readiness check instance
 */
export declare function getReadinessCheck(): ReadinessCheck;
/**
 * Create a new readiness check instance with custom configuration
 */
export declare function createReadinessCheck(config: ReadinessCheckConfig): ReadinessCheck;
/**
 * Perform a quick readiness check using the default instance
 */
export declare function checkReadiness(): Promise<ReadinessResponse>;
/**
 * Configure the default readiness check
 */
export declare function configureReadinessCheck(config: Partial<ReadinessCheckConfig>): void;
/**
 * Format readiness response for HTTP
 */
export declare function formatReadinessResponse(response: ReadinessResponse): {
    statusCode: number;
    body: ReadinessResponse;
};
//# sourceMappingURL=readinessCheck.d.ts.map