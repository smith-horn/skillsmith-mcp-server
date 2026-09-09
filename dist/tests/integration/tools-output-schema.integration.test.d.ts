/**
 * SMI-6472 Wave 3 — wire-level regression test for `outputSchema` +
 * `structuredContent` on `search`, `get_skill`, and `skill_validate`.
 *
 * Sits alongside `tools-list-annotations.integration.test.ts` (SMI-6472
 * Wave 2) and reuses its exact harness helpers/pattern: spawns the REAL
 * built server over stdio and drives it with a genuine
 * `@modelcontextprotocol/sdk` `Client`. This is load-bearing here, not just
 * stylistic — the SDK `Client` itself is the conformance checker: it caches
 * a validator per tool from the `outputSchema` seen in `tools/list`
 * (`cacheToolMetadata`, called internally by `client.listTools()`), then on
 * `client.callTool()` it (a) hard-throws if a schema-declaring tool comes
 * back with no `structuredContent`, and (b) validates `structuredContent`
 * against that schema and throws on any mismatch. A schema/response drift
 * therefore surfaces as a thrown error from `callTool()` — the assertions
 * below additionally check specific fields so a passing run isn't only
 * "didn't throw" but also "returned the shape we expect."
 *
 * DB seeding: `get_skill`'s only reachable success path in this fully
 * offline harness (no SUPABASE_URL/ANON_KEY in `baseSpawnEnv`, so
 * `apiClient.isOffline()` is true) is `resolveSkillApiFirst`'s local-DB
 * fallback, which queries `SkillRepository.findById()` against the real
 * sqlite `skills` table — `index_local`'s `LocalIndexer` is a SEPARATE,
 * purely in-memory cache that never touches that table (confirmed by
 * reading `resolveSkillApiFirst`/`LocalIndexer`), so it cannot be used to
 * seed this path. Instead, this suite creates a real file-backed sqlite DB
 * with `createDatabaseAsync` + `initializeSchema` (the same two-call
 * pattern `context.async.ts` itself uses — `createDatabaseAsync` returns a
 * bare connection with no schema, see that file's own comment) and inserts
 * one row via `SkillRepository.create()` (the exact repository API
 * `seedTestData()` in `src/__tests__/test-utils.ts` already uses for
 * in-memory test contexts) BEFORE spawning the harness, then points
 * `SKILLSMITH_DB_PATH` at that file instead of `baseSpawnEnv`'s default
 * `:memory:`.
 */
export {};
//# sourceMappingURL=tools-output-schema.integration.test.d.ts.map