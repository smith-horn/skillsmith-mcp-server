/**
 * @fileoverview In-memory stub RBACService — the real two-role / four-permission model
 * @module @skillsmith/mcp-server/tools/rbac-tools.stub
 * @see SMI-6202 Wave 1: `team_permission_grants` + the five resolver/read functions
 * @see SMI-6203 Wave 2: the live service this stub mirrors
 *      (`rbac-tools.live.ts`, `20260828000000_rbac_grant_writes.sql`)
 *
 * Extracted from `rbac-tools.types.ts` to stay under the 500-line file-size gate — the same split
 * `registry-tools.stub.ts` and `rbac-tools.schemas.ts` already made for their sibling files. This
 * file holds ONLY the stub factory and its private helpers; every domain type/interface it depends
 * on still lives in `rbac-tools.types.ts` and is imported from there.
 */
import type { RBACService, TeamMemberAssignment, TeamMemberRole } from './rbac-tools.types.js';
/**
 * The simulated caller — the stub's stand-in for `auth.uid()` plus the `team_members` row
 * `has_team_permission()` reads. There is no JWT and no RLS behind this stub, so every gate it
 * mirrors keys off this instead.
 */
export interface StubRbacActor {
    /** Simulated `auth.uid()`. `null` means "not signed in" — every gate then fails closed. */
    userId: string | null;
    /** The team the caller belongs to. A call for any other team resolves as "not a member". */
    teamId: string;
    /** The caller's own `team_members.role`, or `null` to simulate "not a member of this team". */
    role: TeamMemberRole | null;
}
/** `RBACService` plus the stub-only seams. NOT part of the shared interface. */
export interface StubRBACService extends RBACService {
    setActor(actor: StubRbacActor): void;
    setMembers(members: TeamMemberAssignment[]): void;
}
/**
 * The team id stub mode resolves to. Exported because `rbac-tools.ts`'s `resolveTeamId()` returns
 * this same value when Supabase is unconfigured (mirroring `registry-tools.ts`) — if the two ever
 * disagreed, every stub call would fail the stub's own membership check as "not a member of this
 * team", which is a confusing way to discover a constant drifted.
 */
export declare const STUB_TEAM_ID = "team_stub_00000000-0000-0000-0000-000000000000";
/**
 * In-memory RBAC service for local dev and stub-mode tests.
 *
 * WHAT IT MIRRORS FAITHFULLY (so a permission-resolution test proves the same thing on both
 * paths): owner exemption checked BEFORE any grant lookup, deny-wins-over-allow, fallthrough to
 * the default matrix, `get_effective_team_permissions`'s own `team:manage_rbac` self-gate, and
 * `set_team_member_role`'s four refusals — not-found masked as `permission_denied` (no cross-team
 * existence oracle), owner's role untouchable, only the owner may change an existing admin's role,
 * and only owners/admins may promote a member to admin.
 *
 * WHAT IT CANNOT MIRROR, and must never be read as evidence about: RLS itself. Every gate below is
 * an application-level `if`, which a future new method can simply forget; the live policies and
 * SECURITY DEFINER bodies cannot be forgotten at a new call site. Cross-team isolation is
 * approximated by the single-team actor, not enforced by a policy engine.
 */
export declare function createStubRBACService(): StubRBACService;
//# sourceMappingURL=rbac-tools.stub.d.ts.map