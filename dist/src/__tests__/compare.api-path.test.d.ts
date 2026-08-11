/**
 * SMI-5896 Wave 3 Step 1: API-path tests for executeCompare.
 *
 * Before this wave, `skill_compare` only ever queried the local SQLite
 * cache (`skillRepository.findById()`), unlike `search`/`get_skill`, which
 * both already follow the "API first, local DB fallback" pattern (SMI-1183).
 * These tests exercise the `!context.apiClient.isOffline()` branch — now
 * wired through the same shared `resolveSkillApiFirst` resolver `get_skill`
 * uses — which the pre-existing compare.test.ts cannot reach (it seeds a
 * local SQLite context in offline mode).
 */
export {};
//# sourceMappingURL=compare.api-path.test.d.ts.map