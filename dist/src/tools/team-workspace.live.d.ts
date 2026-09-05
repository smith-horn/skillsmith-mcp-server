/**
 * @fileoverview Live Supabase-backed TeamWorkspaceService
 * @module @skillsmith/mcp-server/tools/team-workspace.live
 * @see SMI-4292: Wave 5A — drops stub fallback when Supabase is configured.
 * @see SMI-6113 + SMI-6241 Wave 2: moved every method off the service-role client onto the
 *   caller's own JWT. Service-role bypassed RLS entirely, so any team member could create or
 *   delete a workspace — an action the product has always intended to be admin-only. RLS is now
 *   the actual authorization boundary: `team_workspaces_admin_insert`/`_update`/`_delete` gate on
 *   `team_ids_with_permission('workspace:manage')` (SMI-6241), `team_workspaces_member_read` and
 *   the three `workspace_skills_*` policies gate on plain team membership. The two named
 *   user-client getters that reach those policies live in `team-workspace.live.auth.ts`.
 *
 * `assertWorkspaceInTeam`/`fetchTeamScopedWorkspace`'s explicit team_id check is kept as
 * defense-in-depth alongside RLS, not as the primary boundary — a redundant app-layer check has a
 * track record of turning into the actual layer of protection if a future migration ever weakens
 * RLS, and removing it here would save little.
 *
 * License-key → team_id resolution still uses the anon client + RPC
 * (`resolve_team_from_license` is SECURITY DEFINER — see team-resolver.ts). It establishes *which*
 * team, not *who within it*, so it is unaffected by this change.
 *
 * All rows are returned in camelCase (Workspace shape); Supabase snake_case
 * columns are mapped at the boundary so handlers stay schema-agnostic.
 */
import type { TeamWorkspaceService } from './team-workspace.js';
interface SupabaseQueryResult<T> {
    data: T | null;
    error: {
        message?: string;
        code?: string;
    } | null;
}
interface SupabaseTableQuery<T> {
    select: (columns?: string) => SupabaseTableQuery<T>;
    eq: (column: string, value: unknown) => SupabaseTableQuery<T>;
    single: () => Promise<SupabaseQueryResult<T>>;
    insert: (row: Record<string, unknown>) => SupabaseTableQuery<T>;
    delete: () => SupabaseTableQuery<T>;
    then: <R>(onFulfilled: (value: SupabaseQueryResult<T[]>) => R) => Promise<R>;
}
/** Exported so team-workspace.live.auth.ts's two user-client getters can type their return value
 *  against exactly the surface this file uses, without importing the admin-client module. */
export interface MinimalSupabaseClient {
    from: <T>(table: string) => SupabaseTableQuery<T>;
}
/**
 * Create a live Supabase-backed TeamWorkspaceService.
 * Call signals and teamId arguments from the handler are honoured; the
 * service does NOT re-resolve team_id internally.
 *
 * Every DB call explicitly filters by `team_id = <resolved>` (for
 * `team_workspaces`) or asserts workspace membership (for
 * `workspace_skills`), as defense-in-depth. The real authorization boundary
 * is now RLS, reached via the caller's own JWT — see the file header and
 * team-workspace.live.auth.ts.
 */
export declare function createLiveService(): TeamWorkspaceService;
export {};
//# sourceMappingURL=team-workspace.live.d.ts.map