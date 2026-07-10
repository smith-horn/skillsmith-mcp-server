/**
 * @fileoverview Live Supabase-backed TeamWorkspaceService
 * @module @skillsmith/mcp-server/tools/team-workspace.live
 * @see SMI-4292: Wave 5A — drops stub fallback when Supabase is configured.
 * @see SMI-4312: Use service-role client for CRUD post license-key resolution.
 *
 * Uses the Supabase service-role client for all CRUD against
 * `team_workspaces` and `workspace_skills`. Rationale: migration 071 RLS
 * gates tenant access on `authenticated` role + `auth.uid()`, which the
 * MCP subprocess does not carry (no user JWT, no browser cookie). The
 * anon client can't satisfy those policies; service-role bypasses them.
 * Tenant isolation is enforced in-query via explicit `team_id` filters on
 * every request, plus a team-scoped workspace-existence check before any
 * `workspace_skills` operation. See ADR-116.
 *
 * License-key → team_id resolution still uses the anon client + RPC
 * (`resolve_team_from_license` is SECURITY DEFINER — see team-resolver.ts).
 *
 * All rows are returned in camelCase (Workspace shape); Supabase snake_case
 * columns are mapped at the boundary so handlers stay schema-agnostic.
 */
import type { TeamWorkspaceService } from './team-workspace.js';
/**
 * Create a live Supabase-backed TeamWorkspaceService.
 * Call signals and teamId arguments from the handler are honoured; the
 * service does NOT re-resolve team_id internally.
 *
 * Every DB call explicitly filters by `team_id = <resolved>` (for
 * `team_workspaces`) or asserts workspace membership (for
 * `workspace_skills`). Service-role bypasses RLS — tenant isolation
 * lives here, not in the database.
 */
export declare function createLiveService(): TeamWorkspaceService;
//# sourceMappingURL=team-workspace.live.d.ts.map