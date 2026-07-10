/**
 * @fileoverview LLM Failover Chain for MCP Server
 * @module @skillsmith/mcp-server/llm/failover
 * @see SMI-1524: Implement LLM failover with circuit breaker
 *
 * Provides LLM failover capability for MCP tool handlers with:
 * - Automatic provider failover on errors
 * - Circuit breaker pattern for fault tolerance
 * - Health check endpoints for monitoring
 * - Cost-aware provider selection
 *
 * Wraps the core MultiLLMProvider for MCP server integration.
 *
 * @example
 * ```typescript
 * // Initialize in tool context
 * const failover = new LLMFailoverChain()
 * await failover.initialize()
 *
 * // Use in tool handlers
 * const response = await failover.complete({
 *   messages: [{ role: 'user', content: 'Analyze this skill' }]
 * })
 *
 * // Check health
 * const health = await failover.healthCheck()
 * ```
 */
import { type MultiLLMProviderConfig, type LLMProviderType, type LLMRequest, type LLMResponse, type HealthCheckResult, type ProviderStatus, type ProviderMetrics, type SkillCompatibilityResult } from '@skillsmith/core/testing';
export type { LLMProviderType, LLMRequest, LLMResponse, HealthCheckResult, ProviderStatus, ProviderMetrics, SkillCompatibilityResult, };
/**
 * Configuration for LLMFailoverChain
 */
export interface LLMFailoverConfig extends MultiLLMProviderConfig {
    /**
     * Enable the failover chain (default: true)
     * Can be disabled via SKILLSMITH_LLM_FAILOVER_ENABLED=false
     */
    enabled?: boolean;
    /**
     * Failover timeout in ms (default: 3000)
     * Maximum time before attempting failover
     * @see SMI-1524 Acceptance Criteria: Failover triggers within 3 seconds
     */
    failoverTimeoutMs?: number;
    /**
     * Number of failures before circuit opens (default: 5)
     * @see SMI-1524 Acceptance Criteria: Circuit breaker opens after 5 failures
     */
    circuitOpenThreshold?: number;
    /**
     * Circuit reset timeout in ms (default: 60000)
     * @see SMI-1524 Acceptance Criteria: Circuit resets after 60 seconds
     */
    circuitResetTimeoutMs?: number;
    /**
     * Enable debug logging
     */
    debug?: boolean;
}
/**
 * LLMFailover-specific config properties (not from MultiLLMProviderConfig)
 */
type LLMFailoverOwnConfig = {
    enabled: boolean;
    failoverTimeoutMs: number;
    circuitOpenThreshold: number;
    circuitResetTimeoutMs: number;
    debug: boolean;
};
/**
 * Default configuration for MCP server LLM failover
 * Tuned for SMI-1524 acceptance criteria
 */
export declare const DEFAULT_LLM_FAILOVER_CONFIG: LLMFailoverOwnConfig;
/**
 * Health status for the failover chain
 */
export interface FailoverHealthStatus {
    /** Overall health */
    healthy: boolean;
    /** Timestamp of health check */
    timestamp: Date;
    /** Number of available providers */
    availableProviders: number;
    /** Number of enabled providers */
    enabledProviders: number;
    /** Per-provider health results */
    providers: Record<LLMProviderType, HealthCheckResult>;
    /** Circuit breaker states */
    circuitStates: Record<LLMProviderType, 'closed' | 'open' | 'half-open'>;
    /** Overall error rate */
    errorRate: number;
    /** Average latency in ms */
    avgLatencyMs: number;
}
/**
 * LLM Failover Chain for MCP Server
 *
 * Provides fault-tolerant LLM access for MCP tool handlers with automatic
 * failover, circuit breaker protection, and health monitoring.
 *
 * @example
 * ```typescript
 * const failover = new LLMFailoverChain({
 *   failoverTimeoutMs: 3000,
 *   circuitOpenThreshold: 5,
 *   circuitResetTimeoutMs: 60000
 * })
 *
 * await failover.initialize()
 *
 * // Complete a request with automatic failover
 * const response = await failover.complete({
 *   messages: [{ role: 'user', content: 'Help me understand this skill' }]
 * })
 *
 * // Get comprehensive health status
 * const health = await failover.getHealthStatus()
 * ```
 */
export declare class LLMFailoverChain {
    private provider;
    private config;
    private initialized;
    private enabled;
    private initializationPromise;
    constructor(config?: LLMFailoverConfig);
    /**
     * Initialize the failover chain
     *
     * Must be called before using complete() or other methods.
     * Safe to call multiple times - will return existing promise if initialization is in progress.
     */
    initialize(): Promise<void>;
    private doInitialize;
    /**
     * Check if the failover chain is initialized
     */
    isInitialized(): boolean;
    /**
     * Check if the failover chain is enabled
     */
    isEnabled(): boolean;
    /**
     * Complete an LLM request with automatic failover
     *
     * @param request - The LLM request
     * @returns The LLM response
     * @throws Error if not initialized or all providers fail
     */
    complete(request: LLMRequest): Promise<LLMResponse>;
    /**
     * Test skill compatibility across all providers
     *
     * @param skillId - The skill ID to test
     * @returns Compatibility results for each provider
     */
    testSkillCompatibility(skillId: string): Promise<SkillCompatibilityResult>;
    /**
     * Health check for a specific provider
     *
     * @param provider - The provider to check
     * @returns Health check result
     */
    healthCheck(provider: LLMProviderType): Promise<HealthCheckResult>;
    /**
     * Get comprehensive health status for all providers
     * @see SMI-1524 Acceptance Criteria: Health check endpoint available
     *
     * @returns Complete health status
     */
    getHealthStatus(): Promise<FailoverHealthStatus>;
    /**
     * Get provider status
     *
     * @param provider - The provider to check
     * @returns Provider status
     */
    getProviderStatus(provider: LLMProviderType): ProviderStatus | null;
    /**
     * Get all enabled providers
     */
    getEnabledProviders(): LLMProviderType[];
    /**
     * Get all available providers (enabled with closed circuit)
     */
    getAvailableProviders(): LLMProviderType[];
    /**
     * Get metrics for all providers
     */
    getMetrics(): Map<LLMProviderType, ProviderMetrics>;
    /**
     * Close the failover chain and release resources
     */
    close(): void;
    /**
     * Ensure the failover chain is initialized, waiting if initialization is in progress.
     * This handles the race condition where complete() is called while initialize() is running.
     */
    private ensureInitialized;
}
/**
 * Create and initialize an LLMFailoverChain instance
 *
 * @param config - Configuration options
 * @returns Initialized LLMFailoverChain
 */
export declare function createLLMFailoverChain(config?: LLMFailoverConfig): Promise<LLMFailoverChain>;
//# sourceMappingURL=failover.d.ts.map