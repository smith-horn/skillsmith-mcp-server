/**
 * @fileoverview RBAC types and stub service
 * @module @skillsmith/mcp-server/tools/rbac-tools.types
 * @see SMI-3901: RBAC MCP Tools
 *
 * Extracted from rbac-tools.ts to stay under the 500-line file-size gate.
 */
// ============================================================================
// Default roles and stub service
// ============================================================================
const DEFAULT_ROLES = [
    {
        id: 'role_admin',
        name: 'admin',
        description: 'Full access to all resources',
        permissions: ['*'],
        hierarchy: 100,
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'role_manager',
        name: 'manager',
        description: 'Manage team members and skills',
        permissions: ['skills:*', 'team:manage', 'analytics:read'],
        hierarchy: 75,
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'role_member',
        name: 'member',
        description: 'Install and use skills',
        permissions: ['skills:read', 'skills:install', 'skills:uninstall'],
        hierarchy: 50,
        createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
        id: 'role_viewer',
        name: 'viewer',
        description: 'Read-only access',
        permissions: ['skills:read'],
        hierarchy: 25,
        createdAt: '2026-01-01T00:00:00.000Z',
    },
];
/** @internal Exported for testing */
export function createStubRBACService() {
    const roles = new Map(DEFAULT_ROLES.map((r) => [r.id, { ...r }]));
    const assignments = new Map();
    const policies = new Map();
    let nextId = 1;
    return {
        async createRole(name, permissions, description) {
            const id = `role_custom_${nextId++}`;
            const role = {
                id,
                name,
                description: description ?? null,
                permissions: permissions ?? [],
                hierarchy: 10,
                createdAt: new Date().toISOString(),
            };
            roles.set(id, role);
            return role;
        },
        async listRoles() {
            return [...roles.values()].sort((a, b) => b.hierarchy - a.hierarchy);
        },
        async getRole(roleId) {
            return roles.get(roleId) ?? null;
        },
        async deleteRole(roleId) {
            if (DEFAULT_ROLES.some((r) => r.id === roleId))
                return false;
            return roles.delete(roleId);
        },
        async assignRole(userId, roleId) {
            const role = roles.get(roleId);
            const key = `${userId}:${roleId}`;
            const assignment = {
                userId,
                roleId,
                roleName: role?.name ?? 'unknown',
                assignedAt: new Date().toISOString(),
                assignedBy: 'current-user',
            };
            assignments.set(key, assignment);
            return assignment;
        },
        async revokeRole(userId, roleId) {
            return assignments.delete(`${userId}:${roleId}`);
        },
        async listAssignments() {
            return [...assignments.values()];
        },
        async createPolicy(name, effect, resources, actions) {
            const id = `policy_${nextId++}`;
            const policy = {
                id,
                name,
                effect,
                resources,
                actions,
                createdAt: new Date().toISOString(),
            };
            policies.set(id, policy);
            return policy;
        },
        async listPolicies() {
            return [...policies.values()];
        },
        async getPolicy(policyId) {
            return policies.get(policyId) ?? null;
        },
        async deletePolicy(policyId) {
            return policies.delete(policyId);
        },
    };
}
//# sourceMappingURL=rbac-tools.types.js.map