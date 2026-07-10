/**
 * @fileoverview Stub service for team workspace MCP tools
 * @module @skillsmith/mcp-server/tools/team-workspace.stub
 * @see SMI-3895: Team Workspace + Share Skill MCP Tools
 * @see SMI-3914: Wave 0 stub extraction
 *
 * Extracted from team-workspace.ts for file-size compliance.
 * Provides in-memory stub implementation for workspace CRUD and skill sharing.
 */
// ============================================================================
// Stub service factory
// ============================================================================
/** @internal Exported for testing */
export function createStubService() {
    // In-memory store for stub data
    const workspaces = new Map();
    const skills = new Map();
    return {
        async resolveTeamId(_licenseKey) {
            // SMI-4292: Live resolution lives in team-workspace.live.ts via
            // resolve_team_from_license RPC (migration 071). This stub returns a
            // static team id for unit tests and unauthenticated environments.
            return 'team_stub_00000000-0000-0000-0000-000000000000';
        },
        async createWorkspace(teamId, name, description) {
            const id = crypto.randomUUID();
            const now = new Date().toISOString();
            const ws = {
                id,
                name,
                description: description ?? null,
                teamId,
                settings: {},
                createdAt: now,
                updatedAt: now,
            };
            workspaces.set(id, ws);
            return ws;
        },
        async listWorkspaces(teamId) {
            return [...workspaces.values()].filter((ws) => ws.teamId === teamId);
        },
        async getWorkspace(_teamId, workspaceId) {
            return workspaces.get(workspaceId) ?? null;
        },
        async deleteWorkspace(_teamId, workspaceId) {
            const existed = workspaces.has(workspaceId);
            workspaces.delete(workspaceId);
            skills.delete(workspaceId);
            return existed;
        },
        async addSkill(_teamId, workspaceId, skillId) {
            const entry = {
                skillId,
                addedBy: 'current-user',
                addedAt: new Date().toISOString(),
            };
            const list = skills.get(workspaceId) ?? [];
            list.push(entry);
            skills.set(workspaceId, list);
            return entry;
        },
        async removeSkill(_teamId, workspaceId, skillId) {
            const list = skills.get(workspaceId) ?? [];
            const filtered = list.filter((s) => s.skillId !== skillId);
            skills.set(workspaceId, filtered);
            return filtered.length < list.length;
        },
        async listSkills(_teamId, workspaceId) {
            return skills.get(workspaceId) ?? [];
        },
        async getWorkspaceSettings(_teamId, workspaceId) {
            const ws = workspaces.get(workspaceId);
            return ws?.settings ?? {};
        },
    };
}
//# sourceMappingURL=team-workspace.stub.js.map