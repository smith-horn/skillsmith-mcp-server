/**
 * @fileoverview The two named user-client getters for RBAC administration
 * @module @skillsmith/mcp-server/tools/rbac-tools.live.auth
 * @see SMI-6203 (Wave 2 of SMI-6200): live RBAC service, on the caller's own JWT
 * @see SMI-6202 (Wave 1): `has_team_permission()` / `set_team_member_role()` — the gates
 * @see SMI-5905 Wave 3 / `registry-tools.live.auth.ts`: the precedent this file follows
 *
 * ONE FILE, TWO NAMES, NO DEFAULT.
 *
 * This mirrors `registry-tools.live.auth.ts` deliberately, including its central constraint: no
 * getter here takes a defaulted authorization argument. That file records a cross-provider
 * plan-review finding that rejected a defaulted `requiresAdmin: boolean` because "a defaulted
 * authorization boolean is default-preserving today and silently wrong the first time someone adds
 * a call site and omits it — the failure is invisible at the call site, which is exactly where an
 * authorization decision must be visible." Two names cannot be omitted or defaulted.
 *
 * WHY A JWT AND NOT THE TEAM LICENSE KEY.
 *
 * A shared team license key identifies a TEAM, not a PERSON: `resolve_team_from_license` is
 * `(p_license_key TEXT) RETURNS TEXT` and never reads `team_members`, and the key it resolves is
 * the single row the checkout webhook created for the purchaser and then shared with the whole
 * team. So it can name the buyer, and never the caller. Every RBAC operation asks a question only
 * a person can answer — *may YOU change who holds `registry:approve` on this team?* — so a
 * credential that cannot name a person can never authorize one. Concretely: `has_team_permission()`
 * resolves `auth.uid()` against `team_members`, and `set_team_member_role()`'s owner-anchored gates
 * compare the CALLER's own row against the target's. Under a service-role or license-key client
 * `auth.uid()` is NULL, every one of those gates fails closed, and the operation is unauthorizable
 * rather than merely unauthorized.
 *
 * Neither getter falls back to the service-role client when nobody is signed in. Such a fallback
 * would move the RBAC decision out of the database and into application code — the exact
 * silent-drift risk ADR-116's own documented cost names ("if a future contributor forgets a
 * `team_id` filter, it is silent"), and the last place to accept it is the surface that decides who
 * may administer permissions. Both throw an actionable "run `skillsmith login`" error instead.
 *
 * WHY TWO GETTERS WHEN ONLY ONE OPERATION CLASS WRITES.
 *
 * Every write (`set_team_role_permission` / `reset_team_role_permission` / `set_team_member_role`)
 * and the full-matrix read (`get_effective_team_permissions`) are gated on `team:manage_rbac`.
 * `rbac_assign_role action:'list_assignments'` is not: it reads the roster through
 * `list_team_members_with_profile()`, whose only gate is "are you a member of this team"
 * (`20260521000001:58-64`). Routing that read through the manage-gated getter would compile and
 * work, and would then tell a plain member "you need the team:manage_rbac permission" for an
 * operation that never required it — the precise inaccuracy `getMemberUserClient()`'s own header
 * calls out (plan-review finding H5). Two getters, two accurate refusals.
 *
 * NOTE ON THE NAMES: neither is called `getAdminUserClient`. The gate is the `team:manage_rbac`
 * PERMISSION, not the `admin` role — a member holding an explicit allow grant legitimately passes
 * it, and an admin under a deny grant legitimately does not. Naming these after a role would
 * describe the default matrix rather than the rule, and would be wrong for exactly the
 * configurations this feature exists to make possible.
 */
import { getSupabaseUserClient } from '../supabase-client.js';
import { resolveUserAccessToken } from './team-resolver.js';
import { accessTokenSubject } from './registry-tools.live.audit.js';
/**
 * Shared body of {@link getRbacManageUserClient} and {@link getRbacReadUserClient}.
 *
 * Deliberately NOT exported, and deliberately not reachable with a defaulted gate — every caller
 * goes through one of the two named wrappers below.
 */
async function bindUserClient(gate, operation, noUserMessage) {
    const token = await resolveUserAccessToken();
    if (!token)
        throw new Error(noUserMessage);
    try {
        const client = (await getSupabaseUserClient(token));
        return { client, actorUserId: accessTokenSubject(token), gate };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'unknown error';
        throw new Error(`Failed to ${operation}: ${message}`);
    }
}
/**
 * A user-bound client for operations the database gates on `team:manage_rbac` — the full
 * permission matrix (`get_effective_team_permissions`), both grant writes, and every role change.
 *
 * The permission check itself is NOT re-implemented here. `has_team_permission()` already composes
 * owner-exemption, deny-wins and the default matrix inside every one of those functions; re-checking
 * it in TypeScript would duplicate a policy that already exists and can silently drift from it.
 * This getter's entire job is making sure a real person's token is what reaches that check.
 *
 * @param operation - a verb phrase for the failure message, e.g. `'read team permissions'`
 */
export async function getRbacManageUserClient(operation) {
    return bindUserClient('manage_rbac', operation, `Managing team roles and permissions requires the "team:manage_rbac" permission, which is ` +
        'checked against your own account — so this operation needs a signed-in user. A shared ' +
        'team license key identifies a team, not a person, and can never authorize a role or ' +
        'permission change. Run `skillsmith login` on this machine and retry.');
}
/**
 * A user-bound client for the membership-gated roster read (`list_team_members_with_profile`),
 * which backs `rbac_assign_role action:'list_assignments'`.
 *
 * This is NOT a `team:manage_rbac` gate and must not claim to be one: any team member may read the
 * roster. It still runs as a person, because the RPC's gate is "is `auth.uid()` a member of this
 * team" — a license key would resolve the team while proving nothing about whether the caller is
 * still in it, which is precisely the check being made.
 */
export async function getRbacReadUserClient(operation) {
    return bindUserClient('team_member', operation, `Listing team members runs as you, not as your team's shared license key — a license key ` +
        'identifies a team, not a person, so it cannot prove you are still a member. Any team ' +
        'member can do this once signed in — it does not require the "team:manage_rbac" ' +
        'permission. Run `skillsmith login` on this machine and retry.');
}
//# sourceMappingURL=rbac-tools.live.auth.js.map