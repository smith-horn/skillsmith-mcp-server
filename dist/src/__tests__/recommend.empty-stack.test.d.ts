/**
 * SMI-5896 Wave 3 Step 2: MCP `skill_recommend` empty-derived-stack guard.
 *
 * Before this fix, an empty derived stack (no installed_skills and no usable
 * project_context) reached the API call inside a `Promise.allSettled`, which
 * silently swallowed the resulting 400 into `console.warn` and returned
 * `candidates_considered: 0` with no explanation surfaced to the caller. The
 * fix detects the empty-stack case client-side first and returns the same
 * structured degraded result CLI `recommend`'s identical guard returns.
 */
export {};
//# sourceMappingURL=recommend.empty-stack.test.d.ts.map