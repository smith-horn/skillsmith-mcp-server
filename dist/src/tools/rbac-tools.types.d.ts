/**
 * @fileoverview RBAC types and stub service
 * @module @skillsmith/mcp-server/tools/rbac-tools.types
 * @see SMI-3901: RBAC MCP Tools
 *
 * Extracted from rbac-tools.ts to stay under the 500-line file-size gate.
 */
export interface RBACRole {
    id: string;
    name: string;
    description: string | null;
    permissions: string[];
    hierarchy: number;
    createdAt: string;
}
export interface RBACAssignment {
    userId: string;
    roleId: string;
    roleName: string;
    assignedAt: string;
    assignedBy: string;
}
export interface RBACPolicy {
    id: string;
    name: string;
    effect: 'allow' | 'deny';
    resources: string[];
    actions: string[];
    createdAt: string;
}
export interface RBACService {
    createRole(name: string, permissions?: string[], description?: string): Promise<RBACRole>;
    listRoles(): Promise<RBACRole[]>;
    getRole(roleId: string): Promise<RBACRole | null>;
    deleteRole(roleId: string): Promise<boolean>;
    assignRole(userId: string, roleId: string): Promise<RBACAssignment>;
    revokeRole(userId: string, roleId: string): Promise<boolean>;
    listAssignments(): Promise<RBACAssignment[]>;
    createPolicy(name: string, effect: 'allow' | 'deny', resources: string[], actions: string[]): Promise<RBACPolicy>;
    listPolicies(): Promise<RBACPolicy[]>;
    getPolicy(policyId: string): Promise<RBACPolicy | null>;
    deletePolicy(policyId: string): Promise<boolean>;
}
export interface RbacManageResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    role?: RBACRole;
    roles?: RBACRole[];
    message?: string;
    error?: string;
}
export interface RbacAssignRoleResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    assignment?: RBACAssignment;
    assignments?: RBACAssignment[];
    message?: string;
    error?: string;
}
export interface RbacCreatePolicyResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    policy?: RBACPolicy;
    policies?: RBACPolicy[];
    message?: string;
    error?: string;
}
/** @internal Exported for testing */
export declare function createStubRBACService(): RBACService;
//# sourceMappingURL=rbac-tools.types.d.ts.map