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
 * `getSkillContent` from here at runtime, so a value import back would be a real cycle.
 *
 * ============================================================================
 * METADATA LOOKUP, ENTITLEMENT, AND CONTENT ARE NOW ONE RELEASE RPC (SMI-6651 / D14)
 * ============================================================================
 * Before SMI-6651 this function ran a metadata select, a `check_registry_team_entitlement` RPC,
 * and a separate `content` select — three client-side calls over the caller's own JWT.
 * `authenticated` no longer holds table-level SELECT on `private_registry_skills` at all
 * (`20260915000000_private_registry_content_release_rpc.sql`), so a client-side `content` read is
 * no longer merely unnecessary, it is impossible.
 *
 * All three steps are now one `release_private_registry_skill_content` SECURITY DEFINER RPC call,
 * over the same member-authenticated client `getMemberUserClient()` already produced. It resolves
 * entitlement against the ROW'S OWN team — never the caller's globally denormalized
 * `profiles.tier`, which would let a caller entitled via a different team bypass a downgraded
 * team's gate (see
 * docs/internal/implementation/smi-6111-registry-content-install-entitlement-rpc.md) — and writes
 * its own `audit_logs` row for every outcome it RETURNS (`not_found`/`denied`/`released`) -- not for
 * every call: a NULL `auth.uid()` or any input-validation failure raises before the first audit
 * insert, so those calls audit nothing. `recordRegistryAudit`
 * below is reached only for outcomes the RPC itself cannot audit: the RPC call failing or
 * returning no data, an unrecognized `status`, and a `released` response with malformed content.
 * See `supabase/migrations/20260915000000_private_registry_content_release_rpc.sql` for the RPC's
 * full contract -- with one caveat. That file's own `COMMENT ON` text is SUPERSEDED: it still says
 * the RPC "audits every call" and "writes exactly one audit_logs row per call", both of which
 * overclaim for the reasons above. `20260915000001_private_registry_release_rpc_comment_fix.sql`
 * corrected them, and the LIVE catalog carries the corrected text on staging and production.
 * Migrations are immutable, so the older file keeps its original wording as a historical record --
 * read it for the RPC's LOGIC, not for its comments.
 */
import type { RegistrySkillContent } from './registry-tools.content.types.js';
import type { UserClientBinding } from './registry-tools.live.auth.js';
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
 * team is no longer entitled, or on a real RPC failure: an outage must never be reported as
 * "not found".
 *
 * Version selection (an explicit `version` pins it, otherwise the MOST RECENTLY PUBLISHED version
 * wins, not the highest semver) is now entirely the RPC's own concern — see
 * `release_private_registry_skill_content`'s SQL for the exact `ORDER BY published_at DESC, id`
 * tie-break, matched to `registry-tools.live.ts`'s `get(teamId, skillId, version)` reduce so `get`
 * and `install` can never disagree about what "no version specified" means.
 */
export declare function getSkillContent(params: GetSkillContentParams): Promise<RegistrySkillContent | null>;
//# sourceMappingURL=registry-tools.live.content.d.ts.map