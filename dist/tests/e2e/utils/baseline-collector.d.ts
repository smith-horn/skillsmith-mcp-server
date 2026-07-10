/**
 * Performance Baseline Collector
 *
 * Captures timing and resource metrics during E2E tests
 * to establish baselines for future performance tracking.
 *
 * @see docs/testing/e2e-testing-plan.md
 */
export interface TimingMetric {
    name: string;
    command: string;
    durationMs: number;
    timestamp: string;
}
export interface MemoryMetric {
    name: string;
    command: string;
    heapUsedMB: number;
    heapTotalMB: number;
    externalMB: number;
    timestamp: string;
}
export interface PercentileStats {
    min: number;
    max: number;
    median: number;
    mean: number;
    p95: number;
    p99: number;
    count: number;
}
export interface BaselineReport {
    timestamp: string;
    environment: {
        type: string;
        nodeVersion: string;
        platform: string;
        arch: string;
    };
    baselines: {
        [category: string]: {
            [metric: string]: PercentileStats | number;
        };
    };
    rawMetrics: {
        timing: TimingMetric[];
        memory: MemoryMetric[];
    };
}
/**
 * Record timing for a command execution
 */
export declare function recordTiming(name: string, command: string, durationMs: number): void;
/**
 * Record memory usage for a command execution
 */
export declare function recordMemory(name: string, command: string): void;
/**
 * Measure async function execution time
 */
export declare function measureAsync<T>(name: string, command: string, fn: () => Promise<T>): Promise<{
    result: T;
    durationMs: number;
}>;
/**
 * Measure sync function execution time
 */
export declare function measureSync<T>(name: string, command: string, fn: () => T): {
    result: T;
    durationMs: number;
};
/**
 * Generate baseline report from collected metrics
 */
export declare function generateBaselineReport(): BaselineReport;
/**
 * Export baseline report as JSON
 */
export declare function exportBaselineJSON(): string;
/**
 * Export baseline report as Markdown
 */
export declare function exportBaselineMarkdown(): string;
/**
 * Clear all collected metrics (for test isolation)
 */
export declare function clearMetrics(): void;
/**
 * Get current metrics count
 */
export declare function getMetricsCount(): {
    timing: number;
    memory: number;
};
declare const _default: {
    recordTiming: typeof recordTiming;
    recordMemory: typeof recordMemory;
    measureAsync: typeof measureAsync;
    measureSync: typeof measureSync;
    generateBaselineReport: typeof generateBaselineReport;
    exportBaselineJSON: typeof exportBaselineJSON;
    exportBaselineMarkdown: typeof exportBaselineMarkdown;
    clearMetrics: typeof clearMetrics;
    getMetricsCount: typeof getMetricsCount;
};
export default _default;
//# sourceMappingURL=baseline-collector.d.ts.map