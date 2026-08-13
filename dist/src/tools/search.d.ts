/**
 * @fileoverview MCP Search Tool — SMI-789 wires search to SearchService.
 * Supports full-text query + category / trust_tier / min_score filters.
 */
import { type CompatibilityFilter, type MCPSearchResponse as SearchResponse } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
export { formatSearchResults } from './search.formatter.js';
export { searchToolSchema } from './search.schema.js';
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
    /**
     * SMI-5896: Maximum results to return. Defaults to `DEFAULT_SEARCH_LIMIT`
     * (10, see search.helpers.ts) when omitted; clamped (not rejected) to
     * [`MIN_SEARCH_LIMIT`, `MAX_SEARCH_LIMIT`] otherwise.
     */
    limit?: number;
}
export declare const executeSearch: (input: SearchInput, context: ToolContext) => Promise<SearchResponse>;
//# sourceMappingURL=search.d.ts.map