/**
 * @fileoverview Enterprise RBAC MCP tools — action-handler implementations
 * @module @skillsmith/mcp-server/tools/rbac-tools.action
 * @see SMI-5127: the `*.action.ts` sibling convention for a tool/command file whose
 *      `withTelemetry`-wrapped action handlers push it over the 500-line audit:standards
 *      budget — this file holds the implementations, the wrapped exports, and the service
 *      singleton; `rbac-tools.ts` keeps the MCP tool registration, JSON schema, and
 *      re-exports (SMI-6200 Wave 4 Step 0 split, done mechanically ahead of Wave 4's new
 *      SSO surface landing in `sso-tools.ts` — the sibling this same split was applied to
 *      in the same pass). Precedent: `search.ts` / `search.action.ts` for CLI commands,
 *      and `supabase/functions/team-sso-manage/actions.config.ts` /
 *      `actions.config.query.ts` for the same shape one layer down (Wave 3).
 * @see SMI-3901: RBAC MCP Tools (the original shape)
 * @see SMI-6202 Wave 1: `team_permission_grants` + the five resolver functions
 * @see SMI-6203 Wave 2: the live service and these rewritten schemas
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
import type { ToolContext } from '../context.js';
import type { GrantableRole, RBACService, RbacAssignRoleResult, RbacCreatePolicyResult, RbacManageResult, TeamPermission } from './rbac-tools.types.js';
/** Replace the RBAC service implementation (for testing or production swap) */
export declare function setRBACService(svc: RBACService): void;
/** The service instance currently wired in. */
export declare function getRBACService(): RBACService;
export declare const executeRbacManage: (input: {
    action: "list_roles" | "get_role" | "set_role_permission" | "reset_role_permission";
    role?: GrantableRole | undefined;
    permission?: TeamPermission | undefined;
    effect?: "allow" | "deny" | undefined;
}, _context: ToolContext) => Promise<RbacManageResult>;
export declare const executeRbacAssignRole: (input: {
    action: "assign" | "revoke" | "list_assignments";
    role?: GrantableRole | undefined;
    memberId?: string | undefined;
}, _context: ToolContext) => Promise<RbacAssignRoleResult>;
export declare const executeRbacCreatePolicy: (input: {
    action: "list" | "create" | "delete";
    name?: string | undefined;
    role?: GrantableRole | undefined;
    effect?: "allow" | "deny" | undefined;
    resources?: string[] | undefined;
    actions?: string[] | undefined;
}, _context: ToolContext) => Promise<RbacCreatePolicyResult>;
//# sourceMappingURL=rbac-tools.action.d.ts.map