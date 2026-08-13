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
 * SMI-5896: Default/bound for the MCP search tool's `limit` parameter.
 * Matches the public API's own server-side clamp
 * (supabase/functions/_shared/supabase.ts:validatePagination) — [1, 100] —
 * so a caller-supplied limit behaves identically whether it's satisfied by
 * the API-path branch or the local-fallback branch. The *default* when
 * omitted (10, not the API's own default of 20) preserves the tool's
 * pre-existing hardcoded behavior for callers who don't pass `limit` at all.
 */
export declare const DEFAULT_SEARCH_LIMIT = 10;
export declare const MIN_SEARCH_LIMIT = 1;
export declare const MAX_SEARCH_LIMIT = 100;
/**
 * Resolve the effective MCP search `limit`: defaults to
 * {@link DEFAULT_SEARCH_LIMIT} when omitted, clamped (not rejected) to
 * [{@link MIN_SEARCH_LIMIT}, {@link MAX_SEARCH_LIMIT}] otherwise. A caller
 * passing an out-of-range value gets a smaller/larger *page*, not an error —
 * mirrors the public API's own clamp-not-reject behavior.
 *
 * Accepts `unknown` deliberately: `tool-dispatch.ts` hands `search` its raw
 * JSON arguments with a bare cast (`(args ?? {}) as SearchInput`) and no
 * runtime schema check, so this function IS the validation boundary for
 * `limit`. Anything that isn't a finite number (JSON `null`, `"abc"`, `true`,
 * `[]`) resolves to the default rather than propagating `NaN` into
 * `Array.prototype.slice`, which would silently return zero results.
 */
export declare function resolveSearchLimit(limit: unknown): number;
/**
 * SMI-5929: Flatten a CompatibilityFilter's `ides`/`llms` arrays into one
 * deduped set of "wanted" slugs. Shared by the rank helpers below and by
 * search.ts (to forward the same slug set to the API as the `compatibility`
 * query param, so the server-side rank — see the edge function's
 * compatibility.ts — is computed against the SAME wanted set the client
 * uses for its own local-bucket ranking).
 */
export declare function compatibilityWantedSlugs(filter: CompatibilityFilter | undefined): Set<string>;
/** Widened SearchService fetch size when a compat filter is active; a no-op `limit` otherwise. */
export declare function computeLocalCompatFetchLimit(limit: number, filterActive: boolean): number;
/**
 * SMI-2760 / SMI-5929: 3-tier compat rank for a single skill against the
 * wanted slug set:
 *   0 — compatibility declares at least one requested slug
 *   1 — compatibility is empty/absent (unscoped; "unknown ≠ incompatible")
 *   2 — compatibility declares only OTHER (non-requested) slugs
 * `wanted.size === 0` (no filter active) always ranks 1 — callers must
 * short-circuit on an empty filter instead of relying on this rank (see
 * sortByCompatRank / countCompatDeprioritized below).
 */
export declare function computeCompatRank(compatibility: string[] | undefined, wanted: Set<string>): 0 | 1 | 2;
/**
 * SMI-5929: Stable-sort `results` by compat rank ascending (rank 0 first,
 * rank 2 last), preserving the existing relative order within each rank.
 * Replaces `filterByCompatibility` (SMI-2760), which HARD-EXCLUDED rank-2
 * rows — that exclusion ran client-side, after the API had already returned
 * a fixed-size page, so it could only shrink an already-truncated page, never
 * promote a compatible row back onto it (see
 * docs/internal/implementation/smi-5898-wave5-design-proposal.md §A, option
 * C-1). Never drops a row — a no-op when `filter` is empty/undefined.
 *
 * IMPORTANT: call this SEPARATELY on the local-results bucket and the
 * API-results bucket, then concatenate local-first — compat-rank must only
 * reorder WITHIN each source bucket, never promote an API result above a
 * local one (local-first stays the outer sort key). See search.ts.
 */
export declare function sortByCompatRank<T extends {
    compatibility?: string[];
}>(results: T[], filter: CompatibilityFilter | undefined): T[];
/**
 * SMI-5929: Count of rank-2 (deprioritized) results present in `results`.
 * Call this on the FINAL, already-sliced-to-`limit` page — the count backs
 * `compatibilityDeprioritized`, defined as "how many of what you actually
 * got back are rank 2", not a corpus-wide or pre-slice count. A no-op (0)
 * when `filter` is empty/undefined.
 */
export declare function countCompatDeprioritized<T extends {
    compatibility?: string[];
}>(results: T[], filter: CompatibilityFilter | undefined): number;
/**
 * SMI-5929: Merge local + registry result buckets, rank each bucket by
 * compatibility separately (local-first stays the OUTER sort key — an API
 * result can never outrank a local one), apply the installable filter, slice
 * to the caller-facing page size, and count rank-2 rows on that final page.
 *
 * Shared by both search.ts branches (API-backed and local-fallback) — they
 * differ only in where `apiResults` came from, not in this merge/rank/page
 * pipeline. Extracted (SMI-5929) to keep search.ts under the 500-line
 * governance limit after the compat-rank changes.
 */
export declare function mergeRankAndPage(params: {
    localResults: SkillSearchResult[];
    apiResults: SkillSearchResult[];
    compatibleWith: CompatibilityFilter | undefined;
    installableOnly: boolean;
    limit: number;
}): {
    pageResults: SkillSearchResult[];
    mergedTotal: number;
    discoveryOnlyHidden: number;
    compatibilityDeprioritized: number;
};
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
 * SMI-5897 (Wave 4 fix): security summary now derived via the shared
 * `deriveSecuritySummaryFromSkillRow()` — was previously built unconditionally,
 * shipping a placeholder `{ passed: null, ... }` object even for skills that
 * were never scanned at all, instead of `undefined`.
 */
export declare function mapLocalSkillToSearchResult(item: SearchResult): SkillSearchResult;
/**
 * Build a `suggestion` string for a zero-result search response, explaining
 * that matching is keyword-based (not semantic) and requires every query term
 * to co-occur, so multi-concept queries often return nothing even when a
 * relevant skill exists — plus any filter-specific hints.
 *
 * SMI-5929: no `compatibilityDeprioritized` hint here (unlike
 * `discoveryOnlyHidden`, which can still legitimately explain an empty page).
 * The compatibility filter is now a RANKING signal, not an exclusion — it
 * cannot be the reason a page came back empty. `compatibilityDeprioritized`
 * counts rank-2 rows *present in the final page*, which is provably 0 when
 * the page itself is empty (this helper is only ever called when it is), so
 * a "hidden by a compatibility filter" hint here would always be dead/wrong
 * guidance. See `sortByCompatRank`/`countCompatDeprioritized` above.
 */
export declare function buildEmptySearchSuggestion(context: {
    discoveryOnlyHidden?: number;
}): string;
//# sourceMappingURL=search.helpers.d.ts.map