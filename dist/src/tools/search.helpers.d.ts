/**
 * @fileoverview Pure helpers for the MCP search tool (SMI-5178).
 * @module @skillsmith/mcp-server/tools/search.helpers
 *
 * Split from search.ts to keep it under the 500-line governance limit and to
 * isolate the cross-ecosystem compatibility logic. Imports only types + the
 * canonical slug map from @skillsmith/core — no import from search.ts, so there
 * is no circular dependency.
 */
import { type SkillSearchResult, type CompatibilityFilter, type ApiSearchResult, type SearchResult } from '@skillsmith/core';
/**
 * SMI-2760: Filter search results by compatibility tags.
 * Skills with no compatibility data are included (`[]`/absent = unknown/unscoped,
 * NOT incompatible — they may be compatible but simply haven't declared it).
 * Skills that HAVE declared compatibility must include at least one requested slug.
 */
export declare function filterByCompatibility(results: SkillSearchResult[], filter: CompatibilityFilter): SkillSearchResult[];
/**
 * SMI-4954: Drop discovery-only skills when `installable_only` is requested.
 * A skill is installable when it has a registry install source (`repo_url`
 * present). Client-side filter applied to the merged result page, so an
 * `installable_only` search may return fewer than the page limit.
 *
 * SMI-5178 (C3): treat `installable === null` / absent as installable — the
 * stored column is frequently null for rows that DO have a repo_url. Only
 * explicitly `false` marks a discovery-only entry.
 */
export declare function filterInstallable(results: SkillSearchResult[], installableOnly: boolean | undefined): SkillSearchResult[];
/**
 * SMI-5178: Restrictive cross-tool default. Returns a CompatibilityFilter scoped
 * to the user's EXPLICITLY-set client, or `undefined` when unset.
 *
 * Gated on an explicit client value (e.g. `SKILLSMITH_CLIENT`) — NOT the resolved
 * client, which falls back to `claude-code` for unset users (`install/paths.ts`).
 * Keying off the fallback would silently hide cross-tool content from the unset
 * majority; unset MUST stay permissive (show-all + report hidden count).
 */
export declare function resolveDefaultCompatibility(explicitClient: string | undefined): CompatibilityFilter | undefined;
/**
 * SMI-5563: Map an API search-result row (registry path) to the
 * SkillSearchResult wire format used by the MCP search tool.
 *
 * Extracted from search.ts to keep that file under the 500-line governance
 * limit. Mirrors mapLocalSkillToSearchResult below — added so the registry
 * path stops silently dropping `security` even though skills-search already
 * hydrates security_score/last_scanned_at/security_findings/quarantined
 * server-side (SMI-4251).
 *
 * SMI-1491: repository field for installation source transparency.
 * SMI-2734: installHint guarded on a real registry owner.
 * SMI-2760: compatibility tags (read via cast — see inline comment below).
 * SMI-5327: SPDX license.
 * SMI-5563: security summary via the shared deriveSecuritySummaryFromApiSkill helper.
 */
export declare function mapApiSkillToSearchResult(item: ApiSearchResult): SkillSearchResult;
/**
 * SMI-5337 retro: Map a local SearchService result item to the SkillSearchResult
 * wire format used by the MCP search tool.
 *
 * Extracted from search.ts to keep that file under the 500-line governance limit.
 * Mirrors the API-path mapping in executeSearchImpl with parity on all fields
 * including the SMI-5327 license field.
 *
 * SMI-1491: repository field for installation source transparency.
 * SMI-825:  security summary.
 * SMI-2734: installHint guarded on real registry owner (not 'unknown').
 * SMI-2760: compatibility tags.
 * SMI-5327: SPDX license parity with the API path.
 */
export declare function mapLocalSkillToSearchResult(item: SearchResult): SkillSearchResult;
/**
 * Build a `suggestion` string for a zero-result search response, explaining
 * that matching is keyword-based (not semantic) and requires every query term
 * to co-occur, so multi-concept queries often return nothing even when a
 * relevant skill exists — plus any filter-specific hints.
 */
export declare function buildEmptySearchSuggestion(context: {
    discoveryOnlyHidden?: number;
    compatibilityHidden?: number;
}): string;
//# sourceMappingURL=search.helpers.d.ts.map