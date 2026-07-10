/**
 * @fileoverview Local skill search functionality for MCP Search Tool
 * @module @skillsmith/mcp-server/tools/LocalSkillSearch
 * @see SMI-1809: Local skill search integration
 * @see SMI-1830: Extracted from search.ts to comply with 500-line limit
 *
 * Provides local skill indexing and search:
 * - Singleton LocalIndexer management
 * - Local skill to search result conversion
 * - Filtered local skill search
 */
import { type SkillSearchResult, type SearchFilters, QuarantineRepository } from '@skillsmith/core';
import { LocalIndexer, type LocalSkill } from '../indexer/LocalIndexer.js';
/**
 * Get or create the local indexer instance
 */
export declare function getLocalIndexer(): LocalIndexer;
/**
 * Convert a LocalSkill to SkillSearchResult format.
 * SMI-1809: Marks local skills with source: "local" for identification.
 */
export declare function localSkillToSearchResult(skill: LocalSkill): SkillSearchResult;
/**
 * Search local skills and convert to SkillSearchResult format.
 * SMI-1809: Returns matching local skills for search integration.
 *
 * @param query - Search query string
 * @param filters - Search filters to apply
 * @param quarantineRepo - Optional local quarantine repository. When provided,
 *   skills recorded as quarantined in the local quarantine table are excluded
 *   from results (SMI-5358). Omitted in contexts without a DB for backward
 *   compatibility — callers without a repo get the legacy unfiltered behavior.
 * @returns Array of matching local skills as SkillSearchResult
 */
export declare function searchLocalSkills(query: string, filters: SearchFilters, quarantineRepo?: QuarantineRepository): Promise<SkillSearchResult[]>;
//# sourceMappingURL=LocalSkillSearch.d.ts.map