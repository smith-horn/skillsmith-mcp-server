/**
 * @fileoverview Enterprise RBAC MCP tools for role management
 * @module @skillsmith/mcp-server/tools/rbac-tools
 * @see SMI-3901: RBAC MCP Tools
 *
 * RBAC enforcement is at the Supabase API layer (server-side), NOT local MCP.
 * These MCP tools are a management interface only — they configure roles,
 * assignments, and policies that the server enforces.
 *
 * Default role hierarchy: admin > manager > member > viewer.
 *
 * Tier gate: Enterprise (rbac feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
import type { RBACService, RbacManageResult, RbacAssignRoleResult, RbacCreatePolicyResult } from './rbac-tools.types.js';
export type { RBACRole, RBACAssignment, RBACPolicy, RBACService, RbacManageResult, RbacAssignRoleResult, RbacCreatePolicyResult, } from './rbac-tools.types.js';
export { createStubRBACService } from './rbac-tools.types.js';
export declare const rbacManageInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create_role", "list_roles", "delete_role", "get_role"]>;
    name: z.ZodOptional<z.ZodString>;
    roleId: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "create_role" | "list_roles" | "delete_role" | "get_role";
    name?: string | undefined;
    description?: string | undefined;
    roleId?: string | undefined;
    permissions?: string[] | undefined;
}, {
    action: "create_role" | "list_roles" | "delete_role" | "get_role";
    name?: string | undefined;
    description?: string | undefined;
    roleId?: string | undefined;
    permissions?: string[] | undefined;
}>;
export type RbacManageInput = z.infer<typeof rbacManageInputSchema>;
export declare const rbacAssignRoleInputSchema: z.ZodObject<{
    action: z.ZodEnum<["assign", "revoke", "list_assignments"]>;
    userId: z.ZodOptional<z.ZodString>;
    roleId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "assign" | "revoke" | "list_assignments";
    roleId?: string | undefined;
    userId?: string | undefined;
}, {
    action: "assign" | "revoke" | "list_assignments";
    roleId?: string | undefined;
    userId?: string | undefined;
}>;
export type RbacAssignRoleInput = z.infer<typeof rbacAssignRoleInputSchema>;
export declare const rbacCreatePolicyInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create", "list", "delete", "get"]>;
    name: z.ZodOptional<z.ZodString>;
    policyId: z.ZodOptional<z.ZodString>;
    effect: z.ZodOptional<z.ZodEnum<["allow", "deny"]>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    policyId?: string | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}, {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    policyId?: string | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}>;
export type RbacCreatePolicyInput = z.infer<typeof rbacCreatePolicyInputSchema>;
export declare const rbacManageToolSchema: {
    name: "rbac_manage";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            roleId: {
                type: string;
                description: string;
            };
            permissions: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const rbacAssignRoleToolSchema: {
    name: "rbac_assign_role";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            userId: {
                type: string;
                description: string;
            };
            roleId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const rbacCreatePolicyToolSchema: {
    name: "rbac_create_policy";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            policyId: {
                type: string;
                description: string;
            };
            effect: {
                type: string;
                enum: string[];
                description: string;
            };
            resources: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            actions: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
        };
        required: string[];
    };
};
/** Replace the RBAC service implementation (for testing or production swap) */
export declare function setRBACService(svc: RBACService): void;
export declare const executeRbacManage: (input: {
    action: "create_role" | "list_roles" | "delete_role" | "get_role";
    name?: string | undefined;
    description?: string | undefined;
    roleId?: string | undefined;
    permissions?: string[] | undefined;
}, _context: ToolContext) => Promise<RbacManageResult>;
export declare const executeRbacAssignRole: (input: {
    action: "assign" | "revoke" | "list_assignments";
    roleId?: string | undefined;
    userId?: string | undefined;
}, _context: ToolContext) => Promise<RbacAssignRoleResult>;
export declare const executeRbacCreatePolicy: (input: {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    policyId?: string | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}, _context: ToolContext) => Promise<RbacCreatePolicyResult>;
//# sourceMappingURL=rbac-tools.d.ts.map