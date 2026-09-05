/**
 * @fileoverview SMI-6319 — the two META-permissions are owner-only and NON-DELEGABLE.
 * @see supabase/migrations/20260901000000_rbac_meta_permission_not_grantable.sql — the fix
 *      (table CHECK `team_permission_grants_meta_permission_not_grantable` + gate 4b in
 *      `set_team_role_permission()`)
 * @see supabase/migrations/20260828000000_rbac_grant_writes.sql — the shipped gate 4 this
 *      supersedes: it checks the CALLER and never the TARGET
 * @see SMI-6312 — the UAT round that confirmed the escalation live
 *
 * THE BUG THIS PINS. `set_team_role_permission()`'s gate 4 verified that the CALLER was the team
 * owner before permitting a meta-permission write, and never looked at `p_role` — the TARGET the
 * permission was being handed to. So, live: the owner calls the RPC with
 * `{p_role:"member", p_permission:"team:manage_rbac", p_effect:"allow"}` and gets a 204; a plain
 * member of that team then reads `has_team_permission(TEAM,'team:manage_rbac') -> true`. That is
 * the exact end state gate 4 exists to prevent, reached one call earlier by a caller who was
 * allowed to make it. `team:manage_rbac` gates every grant write and every role change;
 * `team:manage_sso` gates IdP registration and domain claims, so a non-owner holding it can
 * register an attacker-controlled IdP, claim the team's domain, and authenticate AS THE OWNER.
 *
 * Separate from `rbac-tools.test.ts` (already over the 500-line `audit:standards` budget), and
 * named for the invariant so it is findable when someone next touches the grant-write gates —
 * same split rationale as `registry-tools.live.review-rbac-widening.test.ts`.
 *
 * FOUR LAYERS, because any one alone is a single point of failure: (1) the stub's
 * `requireGrantWriteAuthority` rule 1b; (2) the `rbac_manage` and `rbac_create_policy` tool
 * surfaces; (3) error mapping, so the refusal reaches the customer as authored copy rather than
 * the generic sentence (`PASSTHROUGH_REFUSALS`); and (4) the shipped SQL itself. Layer 4 catches
 * the regression this schema is most exposed to — a future `CREATE OR REPLACE FUNCTION
 * set_team_role_permission(...)` reproducing an older body and silently dropping every
 * function-level gate, with no error and no table diff.
 */
export {};
//# sourceMappingURL=rbac-tools.meta-permission-not-grantable.test.d.ts.map