/**
 * @fileoverview Live-mode tests for team_workspace + share_skill MCP tools
 * @see SMI-4312: original service-role client post-resolution + cross-team hardening
 * @see SMI-6113 + SMI-6241 Wave 2: moved off the service-role client onto the caller's own JWT via
 *   `team-workspace.live.auth.ts`'s two named getters — this file's fakes now stand in for
 *   `getSupabaseUserClient`/`resolveUserAccessToken`, not `getSupabaseAdminClient`, matching the
 *   convention `registry-tools.live.test.ts` already uses for its own JWT-bound methods.
 *
 * Kept in a sidecar so team-workspace.test.ts stays under the 500-line CI limit.
 * Exercises the live Supabase-backed service by mocking `getSupabaseUserClient`
 * with a recording fake client.
 */
export {};
//# sourceMappingURL=team-workspace.live.test.d.ts.map