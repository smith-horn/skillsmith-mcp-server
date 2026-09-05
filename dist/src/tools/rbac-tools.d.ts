/**
 * @fileoverview Enterprise RBAC MCP tools — fixed roles, four permissions, per-team overrides
 * @module @skillsmith/mcp-server/tools/rbac-tools
 * @see SMI-3901: RBAC MCP Tools (the original shape)
 * @see SMI-6202 Wave 1: `team_permission_grants` + the five resolver functions
 * @see SMI-6203 Wave 2: the live service and these rewritten schemas
 * @see SMI-5127 / SMI-6200 Wave 4 Step 0: the action-handler implementations, the
 *      `withTelemetry`-wrapped exports, and the service singleton moved to the sibling
 *      `rbac-tools.action.ts` (same 500-line audit:standards budget split `sso-tools.ts`
 *      got in the same pass) — re-exported below so every existing import site (index.ts,
 *      tool-dispatch.ts, rbac-tools.test.ts, rbac-tools.live.test.ts) reaches them
 *      unchanged. This file now holds only the MCP tool registration / JSON schema
 *      re-exports and the public re-export surface.
 *
 * RBAC enforcement is in the database, not here. `has_team_permission()` composes owner-exemption,
 * per-team `allow`/`deny` grants and the built-in default matrix, and every function these tools
 * call re-checks it server-side. This layer is a management interface: it resolves the team, hands
 * the caller's own JWT to the right function, and renders the result.
 *
 * TWO GATES, TWO QUESTIONS. The Enterprise tier gate (`toolFeatureMapping.ts`, unchanged) answers
 * "is this customer entitled to RBAC?". The `team:manage_rbac` permission answers "is this
 * particular person allowed to use it?". Neither replaces the other, and no new feature flag is
 * added for the second — issued Enterprise licenses carry a frozen `features` array, so a new flag
 * would deny every already-issued license (D-11 precedent).
 *
 * Tier gate: Enterprise (rbac feature flag).
 */
export type { EffectivePermission, GrantableRole, PermissionEffect, PermissionSource, RBACService, RbacAssignRoleResult, RbacCreatePolicyPermissionOutcome, RbacCreatePolicyResult, RbacManageResult, RbacToolError, RolePermissionsView, TeamMemberAssignment, TeamMemberRole, TeamPermission, } from './rbac-tools.types.js';
export { DEFAULT_ROLE_PERMISSIONS } from './rbac-tools.types.js';
export { createStubRBACService } from './rbac-tools.stub.js';
export { rbacManageInputSchema, rbacAssignRoleInputSchema, rbacCreatePolicyInputSchema, rbacManageToolSchema, rbacAssignRoleToolSchema, rbacCreatePolicyToolSchema, type RbacManageInput, type RbacAssignRoleInput, type RbacCreatePolicyInput, } from './rbac-tools.schemas.js';
export { setRBACService, getRBACService, executeRbacManage, executeRbacAssignRole, executeRbacCreatePolicy, } from './rbac-tools.action.js';
//# sourceMappingURL=rbac-tools.d.ts.map