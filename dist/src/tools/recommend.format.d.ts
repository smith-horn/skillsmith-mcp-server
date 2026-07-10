/**
 * @fileoverview Recommendation Formatting and Deduplication Utilities
 * @module @skillsmith/mcp-server/tools/recommend.format
 * @see SMI-2741: Split from recommend.ts to meet 500-line standard
 *
 * Standalone utilities extracted from executeRecommend:
 * - mergeAndDeduplicateRecommendations: Merge API and local results, removing duplicates
 * - formatRecommendations: Format recommendation response for terminal display
 */
import type { SkillRecommendation, RecommendResponse } from './recommend.types.js';
/**
 * Merge and deduplicate API and local skill recommendations.
 * API results take priority over local results with the same name.
 *
 * @param apiResults - Results from API
 * @param localResults - Results from local skill search
 * @param limit - Maximum combined results
 * @returns Merged and deduplicated recommendations
 */
export declare function mergeAndDeduplicateRecommendations(apiResults: SkillRecommendation[], localResults: SkillRecommendation[], limit: number): SkillRecommendation[];
/**
 * Format recommendations for terminal display
 *
 * @param response - Recommendation response to format
 * @returns Formatted string for terminal output
 */
export declare function formatRecommendations(response: RecommendResponse): string;
//# sourceMappingURL=recommend.format.d.ts.map