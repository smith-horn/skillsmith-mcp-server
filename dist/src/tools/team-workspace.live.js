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
import { getSupabaseAdminClient } from '../supabase-client.js';
import { resolveLicenseTeamId } from './team-resolver.js';
function mapWorkspace(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        teamId: row.team_id,
        settings: row.settings ?? {},
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
function mapSharedSkill(row) {
    return {
        skillId: row.skill_id,
        addedBy: row.added_by ?? 'unknown',
        addedAt: row.added_at,
    };
}
/**
 * Get the Supabase service-role client. Throws a typed error if
 * `SUPABASE_SERVICE_ROLE_KEY` is not configured on the MCP host —
 * handlers surface this to the caller instead of leaking a 42501.
 */
async function getClient() {
    try {
        return (await getSupabaseAdminClient());
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        throw new Error(`Team workspace operations require SUPABASE_SERVICE_ROLE_KEY on the MCP host: ${message}`);
    }
}
/**
 * Fetch a workspace by (teamId, workspaceId) and verify tenant scope.
 * Returns null on miss or if the workspace belongs to a different team.
 * Shared helper so sibling methods don't depend on a correctly-bound `this`.
 */
async function fetchTeamScopedWorkspace(client, teamId, workspaceId) {
    const resp = await client
        .from('team_workspaces')
        .select()
        .eq('id', workspaceId)
        .eq('team_id', teamId)
        .single();
    if (resp.error || !resp.data)
        return null;
    return mapWorkspace(resp.data);
}
/**
 * Assert the workspace exists AND belongs to the resolved `teamId`.
 * Required before every `workspace_skills` CRUD because service-role
 * bypasses RLS — the DB no longer cross-checks membership for us.
 */
async function assertWorkspaceInTeam(client, teamId, workspaceId) {
    const workspace = await fetchTeamScopedWorkspace(client, teamId, workspaceId);
    if (!workspace) {
        throw new Error(`Workspace ${workspaceId} not found in team ${teamId}.`);
    }
}
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
export function createLiveService() {
    return {
        async resolveTeamId(licenseKey) {
            const teamId = await resolveLicenseTeamId(licenseKey);
            if (!teamId) {
                throw new Error('Unable to resolve team from license key. Ensure SKILLSMITH_LICENSE_KEY is set and corresponds to an active Team-tier subscription.');
            }
            return teamId;
        },
        async createWorkspace(teamId, name, description) {
            const client = await getClient();
            const resp = await client
                .from('team_workspaces')
                .insert({ team_id: teamId, name, description: description ?? null })
                .select()
                .single();
            if (resp.error || !resp.data) {
                throw new Error(`Failed to create workspace: ${resp.error?.message ?? 'unknown error'}`);
            }
            return mapWorkspace(resp.data);
        },
        async listWorkspaces(teamId) {
            const client = await getClient();
            const resp = await client.from('team_workspaces').select().eq('team_id', teamId);
            if (resp.error) {
                throw new Error(`Failed to list workspaces: ${resp.error.message ?? 'unknown error'}`);
            }
            return (resp.data ?? []).map(mapWorkspace);
        },
        async getWorkspace(teamId, workspaceId) {
            const client = await getClient();
            return fetchTeamScopedWorkspace(client, teamId, workspaceId);
        },
        async deleteWorkspace(teamId, workspaceId) {
            const client = await getClient();
            const resp = await client
                .from('team_workspaces')
                .delete()
                .eq('id', workspaceId)
                .eq('team_id', teamId);
            if (resp.error)
                return false;
            // PostgREST returns affected rows in `data` when `returning=representation` (default)
            return Array.isArray(resp.data) ? resp.data.length > 0 : true;
        },
        async addSkill(teamId, workspaceId, skillId) {
            const client = await getClient();
            await assertWorkspaceInTeam(client, teamId, workspaceId);
            const resp = await client
                .from('workspace_skills')
                .insert({ workspace_id: workspaceId, skill_id: skillId })
                .select()
                .single();
            if (resp.error || !resp.data) {
                throw new Error(`Failed to add skill: ${resp.error?.message ?? 'unknown error'}`);
            }
            return mapSharedSkill(resp.data);
        },
        async removeSkill(teamId, workspaceId, skillId) {
            const client = await getClient();
            await assertWorkspaceInTeam(client, teamId, workspaceId);
            const resp = await client
                .from('workspace_skills')
                .delete()
                .eq('workspace_id', workspaceId)
                .eq('skill_id', skillId);
            if (resp.error)
                return false;
            return Array.isArray(resp.data) ? resp.data.length > 0 : true;
        },
        async listSkills(teamId, workspaceId) {
            const client = await getClient();
            await assertWorkspaceInTeam(client, teamId, workspaceId);
            const resp = await client
                .from('workspace_skills')
                .select()
                .eq('workspace_id', workspaceId);
            if (resp.error) {
                throw new Error(`Failed to list skills: ${resp.error.message ?? 'unknown error'}`);
            }
            return (resp.data ?? []).map(mapSharedSkill);
        },
        async getWorkspaceSettings(teamId, workspaceId) {
            const client = await getClient();
            const ws = await fetchTeamScopedWorkspace(client, teamId, workspaceId);
            return ws?.settings ?? {};
        },
    };
}
//# sourceMappingURL=team-workspace.live.js.map