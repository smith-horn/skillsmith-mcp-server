/**
 * @fileoverview Tests for RBAC MCP tools
 * @see SMI-3901: RBAC MCP Tools (original shape, superseded)
 * @see SMI-6202 Wave 1 / SMI-6203 Wave 2: the real two-role / four-permission model these tests
 *      now cover — `RolePermissionsView` / `TeamMemberAssignment` / `RbacCreatePolicyResult.grants`,
 *      not the old `create_role`/`delete_role`/roleId/userId/policyId shapes.
 * @see SMI-6242: the corrected default matrix (`admin` denies `team:manage_rbac`/`team:manage_sso`)
 * @see SMI-6319 (`supabase/migrations/20260901000000_rbac_meta_permission_not_grantable.sql`):
 *      neither meta-permission may ever be GRANTED (`effect: 'allow'`) to a role by ANY caller,
 *      including the owner (stub gate 1b, `rbac-tools.stub.ts`'s `requireGrantWriteAuthority`).
 *      This makes every "owner elevates a non-owner with `team:manage_rbac`" setup step used by
 *      the old gate 4/5 tests below unconstructible — those tests are rewritten in place to
 *      assert the new refusal directly rather than deleted; see the comments at each site.
 */
export {};
//# sourceMappingURL=rbac-tools.test.d.ts.map