/**
 * @fileoverview Malformed/empty `teamId` defense-in-depth tests for the live
 * Supabase-backed PrivateRegistryService (registry-tools.live.ts)
 * @see SMI-5882 — red-team pass on the private registry
 * @see docs/internal/implementation/smi-5882-redteam-private-registry-privacy-assessment.md
 *   Wave 2 Step 1 ("Line-by-line `team_id` filter audit")
 *
 * Sibling to registry-tools.live.test.ts, split out to keep that file under
 * CLAUDE.md's <500-line guidance rather than growing it further.
 *
 * **Provenance note — why these inputs should be unreachable in production.**
 * In the real MCP/CLI call path, `teamId` always originates from
 * `resolveLicenseTeamId()` (packages/mcp-server/src/tools/team-resolver.ts),
 * which is the output of the `resolve_team_from_license` Postgres RPC
 * (migration 071, SECURITY DEFINER). That function returns either a real
 * `teams.id` UUID or `null` (mapped to an "invalid license" error before any
 * service method is ever called — see registry-tools.ts's `resolveTeamId()`).
 * It can never hand back '', whitespace, or a PostgREST-filter-shaped string.
 * `registry-tools.ts`'s Zod schemas also never accept `teamId` from tool
 * input (ADR-116) — unlike `publish-private.ts`'s Team-tier local-SQLite path,
 * which is a separate, unrelated surface (see plan doc §9).
 *
 * **What this suite actually proves.** It calls `createLiveRegistryService()`
 * directly — bypassing both of the guards above — and feeds every method a
 * batch of hostile `teamId` values: empty string, whitespace-only,
 * PostgREST filter-operator syntax (`*`, `in.(a,b)`, comma-separated,
 * `key=value`-shaped), and `null`/`undefined` coerced through the type
 * system. It asserts the mocked Supabase query-builder receives each value
 * completely unmodified — as a literal `.eq('team_id', <value>)` argument or
 * a literal `insert({ team_id: <value>, ... })` field — never concatenated,
 * escaped, or reinterpreted into a different filter expression. That is the
 * defense-in-depth claim this suite is checking: the service layer performs
 * no client-side string interpolation that a malformed value could exploit,
 * so even if a malformed `teamId` somehow reached this layer, the Supabase
 * JS client's `.eq()` treats it as an ordinary bound value, not as filter
 * syntax to be parsed. This is NOT a demonstration that malformed `teamId`
 * is reachable today — see the provenance note above.
 */
export {};
//# sourceMappingURL=registry-tools.live.malformed-input.test.d.ts.map