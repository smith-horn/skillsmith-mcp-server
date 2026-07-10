/**
 * Hardcoded Value Detection Utility
 *
 * Scans command output and file contents for hardcoded values that
 * would fail in clean environments (Codespaces).
 *
 * @see docs/testing/e2e-testing-plan.md
 */
export interface HardcodedIssue {
    type: 'path' | 'url' | 'credential' | 'env_assumption';
    pattern: string;
    value: string;
    location: {
        source: 'stdout' | 'stderr' | 'file' | 'database';
        context?: string | undefined;
        line?: number | undefined;
    };
    command: string;
    timestamp: string;
    severity: 'error' | 'warning';
}
export interface DetectionResult {
    passed: boolean;
    issues: HardcodedIssue[];
    scannedBytes: number;
    scanDurationMs: number;
}
/**
 * Scan text content for hardcoded values
 */
export declare function scanForHardcoded(content: string, command: string, source: 'stdout' | 'stderr' | 'file' | 'database', context?: string): HardcodedIssue[];
/**
 * Scan command execution result for hardcoded values
 */
export declare function scanCommandOutput(stdout: string, stderr: string, command: string): DetectionResult;
/**
 * Create a summary report of detected issues
 */
export declare function createDetectionReport(results: DetectionResult[]): string;
declare const _default: {
    scanForHardcoded: typeof scanForHardcoded;
    scanCommandOutput: typeof scanCommandOutput;
    createDetectionReport: typeof createDetectionReport;
};
export default _default;
//# sourceMappingURL=hardcoded-detector.d.ts.map