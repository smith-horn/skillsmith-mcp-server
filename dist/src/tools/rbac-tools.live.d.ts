/**
 * @fileoverview Live Supabase-backed RBACService
 * @module @skillsmith/mcp-server/tools/rbac-tools.live
 * @see SMI-6203 (Wave 2 of SMI-6200): live RBAC service on the caller's own JWT
 * @see SMI-6202 Wave 1: `team_permission_grants` + the five resolver/read functions
 *      (`supabase/migrations/20260827000000_team_permission_grants.sql`)
 * @see SMI-6242: `default_role_permission()` security fix — see `rbac-tools.types.ts`'s
 *      `DEFAULT_ROLE_PERMISSIONS` header for the full rationale
 * @see `registry-tools.live.ts` / `registry-tools.live.submissions.ts`'s `reviewSubmission()`:
 *      the `.rpc()` call + error-handling + `resp.data`/`resp.error` shape this file copies
 *
 * Mirrors `registry-tools.live.ts`'s `createLiveRegistryService()` factory shape: one function
 * returning an object literal implementing the service interface (`RBACService`), each method a
 * thin `.rpc()` call plus mapping. Every RBAC decision lives in the database — `has_team_permission()`
 * inside each RPC composes owner-exemption, deny-wins-over-allow, and the default matrix; this file
 * never re-implements or re-checks any of that. Its entire job is making sure the RIGHT credential
 * (the caller's own JWT, via one of the two named getters in `rbac-tools.live.auth.ts`) reaches the
 * right RPC, and that the RPC's response is mapped into this module's domain types.
 *
 * TWO GETTERS, NOT ONE (`rbac-tools.live.auth.ts`): every method here that reads or writes the
 * permission matrix or a role (`listPermissions`, `setRolePermission`, `resetRolePermission`,
 * `setMemberRole`) uses `getRbacManageUserClient()` — the database gates all four on
 * `team:manage_rbac`. `listMembers` uses `getRbacReadUserClient()` instead: `list_team_members_with_
 * profile()`'s only gate is team membership (`20260521000001:58-64` / `20260708205437:246-252`), and
 * routing it through the manage-gated getter would tell a plain member "you need team:manage_rbac"
 * for an operation that never required it.
 *
 * NO CLIENT-SIDE AUDIT WRITE. Unlike `registry-tools.live.ts` (which calls `recordRegistryAudit()`
 * at this layer because the underlying tables/RPCs it wraps do not audit themselves), every RPC this
 * file calls — `set_team_role_permission`, `reset_team_role_permission` (both added in this same
 * Wave, `20260828000000_rbac_grant_writes.sql`), and `set_team_member_role` (Wave 1) — already writes
 * its own `audit_logs` row inside the SAME transaction as the write, non-fatally on audit failure.
 * Adding a second, TypeScript-side audit write here would duplicate that trail rather than
 * strengthen it. `listPermissions` / `listMembers` are reads and were never audited at either layer
 * in Wave 1 or Wave 2 — consistent with `get_effective_team_permissions()` and
 * `list_team_members_with_profile()` themselves not writing `audit_logs`.
 *
 * ERROR SHAPE: on `resp.error`, every method throws via {@link rpcError}, which carries the
 * PostgREST error's SQLSTATE across as `.code` alongside the message. The tool layer's
 * `toToolError()` (`rbac-tools.ts`) then maps a real `42501` (via `toPermissionDeniedError()`) to
 * the structured `PermissionDeniedError`, recognizing both the generic `permission_denied` sentence
 * and the authored owner-anchored/self-widening refusals (`team-permission-error.ts`'s
 * `PASSTHROUGH_REFUSALS`); anything else surfaces as a plain string error. This file does not need
 * to distinguish the two cases itself — but it MUST NOT drop the code, which is why `rpcError`
 * exists rather than a bare `new Error(resp.error.message)`. See its own doc comment.
 */
import type { RBACService } from './rbac-tools.types.js';
/**
 * Create a live Supabase-backed RBACService. Every method resolves a user-bound client via one of
 * `rbac-tools.live.auth.ts`'s two named getters, calls exactly one RPC, and maps the result — the
 * authorization decision is made entirely inside the RPC, never re-implemented here.
 */
export declare function createLiveRBACService(): RBACService;
//# sourceMappingURL=rbac-tools.live.d.ts.map