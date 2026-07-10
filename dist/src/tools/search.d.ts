/**
 * @fileoverview MCP Search Tool — SMI-789 wires search to SearchService.
 * Supports full-text query + category / trust_tier / min_score filters.
 */
import { type CompatibilityFilter, type MCPSearchResponse as SearchResponse } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
export { formatSearchResults } from './search.formatter.js';
/**
 * Search tool schema for MCP
 */
export declare const searchToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            query: {
                type: string;
                description: string;
            };
            category: {
                type: string;
                description: string;
                enum: string[];
            };
            trust_tier: {
                type: string;
                description: string;
                enum: string[];
            };
            min_score: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
            safe_only: {
                type: string;
                description: string;
            };
            installable_only: {
                type: string;
                description: string;
            };
            max_risk: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
            compatible_with: {
                type: string;
                description: string;
                properties: {
                    ides: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    llms: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                };
            };
        };
        required: never[];
    };
};
/**
 * Input parameters for the search operation
 * @interface SearchInput
 */
export interface SearchInput {
    /** Search query string (optional if filters provided) */
    query?: string;
    /** Filter by skill category */
    category?: string;
    /** Filter by trust tier level */
    trust_tier?: string;
    /** Minimum quality score (0-100) */
    min_score?: number;
    /** SMI-825: Only show skills that passed security scan */
    safe_only?: boolean;
    /** SMI-4954: Only return installable skills (excludes discovery-only entries) */
    installable_only?: boolean;
    /** SMI-825: Maximum risk score (0-100, lower is safer) */
    max_risk?: number;
    /** SMI-2760: Filter by IDE/LLM compatibility */
    compatible_with?: CompatibilityFilter;
}
export declare const executeSearch: (input: SearchInput, context: ToolContext) => Promise<SearchResponse>;
//# sourceMappingURL=search.d.ts.map