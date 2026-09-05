/**
 * @fileoverview Content read for the live private registry — the MCP twin of Wave 2's Edge Function
 * @module @skillsmith/mcp-server/tools/registry-tools.live.content
 * @see SMI-5905 Wave 3: MCP tool surface — `install` action + `getContent()`
 * @see supabase/functions/private-registry-get/access.ts — the CLI-transport twin of this logic
 * @see docs/internal/implementation/private-registry-skill-install.md
 *
 * Split out of `registry-tools.live.ts` (428/500 lines before this wave) for the same reason
 * Wave 2 split `access.ts` out of its `index.ts`: the file was already near the 500-line gate, and
 * everything that decides WHETHER a caller may read a team's packaged content belongs together.
 *
 * Imports from `registry-tools.live.ts` are TYPE-ONLY, deliberately: `live.ts` imports
 * `getSkillContent` from here at runtime, so a value import back would be a real cycle. The two
 * shared constants live in `registry-tools.content.types.ts` for that reason.
 *
 * ============================================================================
 * TEAM-SCOPED ENTITLEMENT (Sol plan-review finding #1, critical, confirmed; SMI-6111)
 * ============================================================================
 * `profiles.tier` is `MAX(tier_rank)` over the user's own subscription AND every team they belong
 * to (`20260524000002_team_member_tier_sync.sql`, `recompute_user_tier`). A user who is Enterprise
 * via Team A and also a member of a since-downgraded Team B still reads `tier = 'enterprise'`
 * globally — so a `profiles.tier` check does not prove the team that owns the requested row is
 * entitled. `profiles` is therefore never read on this path.
 *
 * Neither is the outer `private_registry_manage` handler's license-derived `teamId` treated as
 * proof of entitlement on its own. That id, plus RLS, establishes *membership*: `resolve_team_from
 * _license` resolves a team from a shared key, and `private_registry_skills_member_read` filters
 * rows to teams the caller belongs to. Membership is not a live subscription tier — a team that
 * downgrades from Enterprise without removing its members would keep indefinite content access if
 * membership were the only gate (the exact scenario ADR-129's Enterprise gate exists to prevent).
 *
 * So: the metadata read is RLS-scoped AND explicitly `team_id`-filtered (the ADR-116 invariant
 * every method on this service honors), and the entitlement check is then resolved against
 * `row.team_id` — the value read back off the row — via the `check_registry_team_entitlement`
 * SECURITY DEFINER RPC. Reading it back off the row rather than reusing the parameter keeps this
 * function's logic identical to the Edge Function's, where RLS is the only tenant scope; the two
 * transports cannot drift into disagreeing about which team is being checked.
 *
 * SMI-6111: this used to require the SERVICE-ROLE client, because `subscriptions`' only read
 * policy is "Users can view own subscriptions" (`011_users_subscriptions.sql`, `user_id =
 * auth.uid()`), so a team member who is not the subscription's purchaser sees zero rows through
 * their own JWT and every non-owner would be spuriously denied. That's now handled server-side by
 * `check_registry_team_entitlement(p_team_id)` (`20260824000000_check_registry_team_entitlement
 * .sql`), a narrowly-scoped `SECURITY DEFINER` function callable by `authenticated` — it answers
 * only "is team X's own subscription Enterprise-entitled," with no personal-subscription
 * fallback. It is deliberately NOT built on `resolve_effective_entitlement(p_user_id, p_team_id)`
 * (`20260819000001_resolve_effective_entitlement.sql`): that function's personal-subscription
 * UNION leg has no team correlation and ranks ahead of team-correlated candidates by tier, so a
 * caller with their own personal Enterprise subscription who is merely a member of some other,
 * non-Enterprise team would resolve to entitled=true for that team via their personal leg —
 * reintroducing the exact cross-team leak `profiles.tier` was excluded above to prevent. See
 * `docs/internal/implementation/smi-6111-registry-content-install-entitlement-rpc.md` for the
 * full design rationale. The member-authenticated client is used for the RPC call, same as the
 * metadata and content reads — no service-role client exists anywhere in this file anymore.
 *
 * ORDER IS LOAD-BEARING: metadata (no `content` column) → entitlement → content. A denied read
 * therefore never transfers a byte of content, and a not-found never reads one.
 */
import { type RegistrySkillContent } from './registry-tools.content.types.js';
import type { MinimalSupabaseClient } from './registry-tools.live.js';
import type { UserClientBinding } from './registry-tools.live.auth.js';
/** Shape of `check_registry_team_entitlement`'s JSONB return value. */
interface RegistryTeamEntitlement {
    entitled: boolean;
    detail: string;
}
/**
 * Is THIS team currently entitled to Enterprise? See the header — resolved server-side, from the
 * team that owns the row, never from the caller's denormalized `profiles.tier`.
 *
 * A lookup failure throws rather than returning `{entitled: false}`: an unreachable
 * `check_registry_team_entitlement` call is an outage, and reporting it as "not entitled" would
 * tell a paying customer their subscription had lapsed. Fail loud, not fail-wrong.
 *
 * @param teamId - the row's own `team_id`, already RLS-authorized for this caller.
 * @param client - the caller's own member-authenticated client (from `UserClientBinding`); no
 *   service-role client exists in this file (SMI-6111).
 */
export declare function isTeamEnterpriseEntitled(teamId: string, client: MinimalSupabaseClient): Promise<RegistryTeamEntitlement>;
export interface GetSkillContentParams {
    /** MUST come from `getMemberUserClient()` — see `registry-tools.live.ts`. */
    binding: UserClientBinding;
    /** License-derived team id, used as the ADR-116 in-query tenant filter (not as entitlement). */
    teamId: string;
    skillId: string;
    /** Omitted → the most recently published version, mirroring this service's `get()`. */
    version?: string;
}
/**
 * Fetch one private-registry skill version's packaged content for install.
 *
 * Returns `null` when nothing visible matches (a genuine absence, or a cross-team `skillId` that
 * RLS + the tenant filter removed — the two are deliberately indistinguishable to the caller, so
 * this is never an existence oracle for another team's registry). Throws when the caller's own
 * team is no longer entitled, or on a real query failure: an outage must never be reported as
 * "not found".
 *
 * Version selection mirrors `registry-tools.live.ts`'s `get(teamId, skillId, version)` exactly —
 * an explicit `version` pins it, otherwise the MOST RECENTLY PUBLISHED version wins (not the
 * highest semver), chosen with the same `published_at` reduce — so `get` and `install` can never
 * disagree about what "no version specified" means.
 */
export declare function getSkillContent(params: GetSkillContentParams): Promise<RegistrySkillContent | null>;
export {};
//# sourceMappingURL=registry-tools.live.content.d.ts.map