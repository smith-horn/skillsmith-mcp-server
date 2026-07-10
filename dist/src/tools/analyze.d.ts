/**
 * @fileoverview MCP analyze_codebase Tool
 * @module @skillsmith/mcp-server/tools/analyze
 * @see SMI-600: Implement analyze_codebase MCP tool
 *
 * Analyzes a codebase to extract context for skill recommendations.
 * Uses TypeScript/JavaScript analysis per ADR-010.
 *
 * @example
 * // Analyze current directory
 * const result = await executeAnalyze({ path: '.' });
 * console.log(result.frameworks);
 *
 * @example
 * // Analyze with options
 * const result = await executeAnalyze({
 *   path: '/path/to/project',
 *   max_files: 500,
 *   include_dev_deps: false
 * });
 */
import { z } from 'zod';
/**
 * Zod schema for analyze tool input validation
 */
export declare const analyzeInputSchema: z.ZodObject<{
    /** Path to analyze (default: current directory) */
    path: z.ZodDefault<z.ZodString>;
    /** Maximum files to analyze (default: 1000) */
    max_files: z.ZodDefault<z.ZodNumber>;
    /** Directories to exclude */
    exclude_dirs: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Include dev dependencies in analysis */
    include_dev_deps: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    path: string;
    max_files: number;
    include_dev_deps: boolean;
    exclude_dirs?: string[] | undefined;
}, {
    path?: string | undefined;
    max_files?: number | undefined;
    exclude_dirs?: string[] | undefined;
    include_dev_deps?: boolean | undefined;
}>;
/**
 * Input type for analyze tool
 */
export type AnalyzeInput = z.input<typeof analyzeInputSchema>;
/**
 * Simplified framework info for response
 */
export interface AnalyzeFramework {
    /** Framework name */
    name: string;
    /** Confidence level (0-100) */
    confidence: number;
}
/**
 * Simplified dependency info for response
 */
export interface AnalyzeDependency {
    /** Package name */
    name: string;
    /** Whether this is a dev dependency */
    is_dev: boolean;
}
/**
 * Analysis response with codebase context
 */
export interface AnalyzeResponse {
    /** Detected frameworks */
    frameworks: AnalyzeFramework[];
    /** Top dependencies */
    dependencies: AnalyzeDependency[];
    /** Unique import modules */
    imports: string[];
    /** File statistics */
    stats: {
        total_files: number;
        total_lines: number;
        file_types: Record<string, number>;
    };
    /** Summary for skill matching */
    summary: string;
    /** Analysis timing */
    timing: {
        duration_ms: number;
    };
}
/**
 * MCP tool schema definition for analyze_codebase
 */
export declare const analyzeToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            path: {
                type: string;
                description: string;
                default: string;
            };
            max_files: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                default: number;
            };
            exclude_dirs: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            include_dev_deps: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: never[];
    };
};
export declare const executeAnalyze: (input: {
    path?: string | undefined;
    max_files?: number | undefined;
    exclude_dirs?: string[] | undefined;
    include_dev_deps?: boolean | undefined;
}) => Promise<AnalyzeResponse>;
/**
 * Format analysis results for terminal display
 */
export declare function formatAnalysisResults(response: AnalyzeResponse): string;
//# sourceMappingURL=analyze.d.ts.map