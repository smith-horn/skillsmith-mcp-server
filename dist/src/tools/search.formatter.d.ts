/**
 * @fileoverview Formatter for MCP search tool output
 * @module @skillsmith/mcp-server/tools/search.formatter
 * @see SMI-2759: Split from search.ts to maintain 500-line governance limit
 *
 * Provides human-readable formatting of search results for terminal/CLI display.
 */
import type { MCPSearchResponse as SearchResponse } from '@skillsmith/core';
/**
 * Format search results for terminal/CLI display.
 *
 * Produces a human-readable string with skill listings including
 * trust badges, scores, repository links, and timing information.
 *
 * @param response - Search response from executeSearch
 * @returns Formatted string suitable for terminal output
 *
 * @example
 * const response = await executeSearch({ query: 'test' });
 * console.log(formatSearchResults(response));
 * // Output:
 * // === Search Results for "test" ===
 * // Found 3 skill(s):
 * // 1. jest-helper [COMMUNITY]
 * //    Author: community | Score: 87/100
 * //    Generate Jest test cases...
 * //    Repository: https://github.com/...
 */
export declare function formatSearchResults(response: SearchResponse): string;
//# sourceMappingURL=search.formatter.d.ts.map