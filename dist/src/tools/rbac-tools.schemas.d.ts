/**
 * @fileoverview Schemas for the RBAC tools — Zod runtime-validation plus MCP registration
 * @module @skillsmith/mcp-server/tools/rbac-tools.schemas
 * @see SMI-6203 Wave 2 Step 3: the rewritten `rbac_manage` / `rbac_assign_role` /
 *      `rbac_create_policy` surfaces
 *
 * The `foo.schemas.ts` companion `registry-tools.schemas.ts` already establishes: both schema
 * families describe the same three tools' inputs from two angles (what the model sees vs what the
 * handler runtime-validates), neither depends on anything else `rbac-tools.ts` defines, and the
 * rewritten enums plus their decision comments pushed `rbac-tools.ts` past its 500-line
 * audit:standards budget.
 *
 * Re-exported from `rbac-tools.ts`, so `index.ts` (tool registration) and `tool-dispatch.ts` (Zod
 * validation) reach them through the same module they always did — only the contents moved.
 */
import { z } from 'zod';
import type { GrantableRole, TeamPermission } from './rbac-tools.types.js';
export declare const rbacManageInputSchema: z.ZodObject<{
    action: z.ZodEnum<["list_roles", "get_role", "set_role_permission", "reset_role_permission"]>;
    role: z.ZodOptional<z.ZodEnum<[GrantableRole, ...GrantableRole[]]>>;
    permission: z.ZodOptional<z.ZodEnum<[TeamPermission, ...TeamPermission[]]>>;
    effect: z.ZodOptional<z.ZodEnum<["allow", "deny"]>>;
}, "strip", z.ZodTypeAny, {
    action: "list_roles" | "get_role" | "set_role_permission" | "reset_role_permission";
    role?: GrantableRole | undefined;
    permission?: TeamPermission | undefined;
    effect?: "allow" | "deny" | undefined;
}, {
    action: "list_roles" | "get_role" | "set_role_permission" | "reset_role_permission";
    role?: GrantableRole | undefined;
    permission?: TeamPermission | undefined;
    effect?: "allow" | "deny" | undefined;
}>;
export type RbacManageInput = z.infer<typeof rbacManageInputSchema>;
/**
 * `memberId`, not `userId` — DECIDED, not inherited.
 *
 * `set_team_member_role(p_member_id TEXT, p_role TEXT)` takes `team_members.id`, matching every
 * sibling RPC (`remove_team_member`, `set_team_member_github_username`) and the website helper that
 * calls them (`team-invitations.ts`'s `removeTeamMember()`). Accepting a `userId` instead would
 * force this layer to resolve it to a member id first, and that lookup is not free of consequence:
 * it would have to read `team_members` itself (an application-side tenant filter of exactly the
 * kind ADR-116 documents as silently breakable), and its "no such user" answer would reopen the
 * cross-team existence oracle the migration's L1 fix deliberately closed by making not-found and
 * not-permitted raise the identical `42501`. `list_assignments` returns the very ids `assign` and
 * `revoke` accept, so the loop closes with no translation layer at all.
 */
export declare const rbacAssignRoleInputSchema: z.ZodObject<{
    action: z.ZodEnum<["assign", "revoke", "list_assignments"]>;
    memberId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<[GrantableRole, ...GrantableRole[]]>>;
}, "strip", z.ZodTypeAny, {
    action: "assign" | "revoke" | "list_assignments";
    role?: GrantableRole | undefined;
    memberId?: string | undefined;
}, {
    action: "assign" | "revoke" | "list_assignments";
    role?: GrantableRole | undefined;
    memberId?: string | undefined;
}>;
export type RbacAssignRoleInput = z.infer<typeof rbacAssignRoleInputSchema>;
/**
 * HOW `{effect, resources[], actions[]}` MAPS ONTO `(team_id, role, permission, effect)` — and the
 * two shape changes that mapping forces.
 *
 * `rbac_create_policy` is retained as the bulk/wildcard writer into `team_permission_grants`: each
 * `resource` x `action` pair expands to one `resource:action` permission string, and each expanded
 * permission becomes one grant row. `{resources: ['registry'], actions: ['approve','deprecate']}`
 * with `effect: 'deny'` writes two deny rows. Any expanded pair outside the four permissions Wave 1
 * enforces is refused by name BEFORE any write — the `permission` CHECK constraint would otherwise
 * surface as a raw `23514`, and a partially-applied bulk write is worse than a refused one.
 *
 * Two things could not be preserved, because the grant table has no column for them:
 *
 *  1. `role` is now REQUIRED. A grant row is keyed `(team_id, role, permission)`; a policy with no
 *     role is not representable at all, so the tool would have had to invent one.
 *  2. `get` is gone and `policyId` with it. Grants have no stable policy identity — the same two
 *     rows can be written by any number of different `resources`/`actions` shapes — so `get` could
 *     only ever have been a second spelling of `list`. `list` returns the explicit grants (the
 *     `source: 'grant'` rows), which is what "show me my policies" actually means here.
 *
 * `name` is kept, optional, and NOT persisted (there is no column for it) — it is echoed back in
 * the result as a label for the operation. Making it required-but-discarded would be exactly the
 * "settable but unenforced" trap the permission CHECK exists to prevent.
 */
export declare const rbacCreatePolicyInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create", "list", "delete"]>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<[GrantableRole, ...GrantableRole[]]>>;
    effect: z.ZodOptional<z.ZodEnum<["allow", "deny"]>>;
    resources: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    actions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "create" | "delete";
    name?: string | undefined;
    role?: GrantableRole | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}, {
    action: "list" | "create" | "delete";
    name?: string | undefined;
    role?: GrantableRole | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}>;
export type RbacCreatePolicyInput = z.infer<typeof rbacCreatePolicyInputSchema>;
/** Human-readable list of the configurable permissions, for tool descriptions and refusals. */
export declare const PERMISSION_LIST: string;
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
            role: {
                type: string;
                enum: GrantableRole[];
                description: string;
            };
            permission: {
                type: string;
                enum: TeamPermission[];
                description: string;
            };
            effect: {
                type: string;
                enum: string[];
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
            memberId: {
                type: string;
                description: string;
            };
            role: {
                type: string;
                enum: GrantableRole[];
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
            role: {
                type: string;
                enum: GrantableRole[];
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
//# sourceMappingURL=rbac-tools.schemas.d.ts.map