/**
 * SMI-2760: Tests for compatible_with filter in executeSearch.
 * SMI-5929: the filter is now a ranking signal (sortByCompatRank /
 * mergeRankAndPage, search.helpers.ts), not an exclusion — skills without
 * compatibility data are still always permissively surfaced (rank 1,
 * "unscoped"), they just no longer risk being dropped in the first place.
 *
 * Extracted from search.test.ts during SMI-4694 to keep search.test.ts
 * under the 500-line gate after disposeTestContext wiring.
 */
export {};
//# sourceMappingURL=search-compatible-with.test.d.ts.map