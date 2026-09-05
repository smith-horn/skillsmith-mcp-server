/**
 * @fileoverview RBAC domain types — the real two-role / four-permission model
 * @module @skillsmith/mcp-server/tools/rbac-tools.types
 * @see SMI-3901: RBAC MCP Tools (the original in-memory shape this replaces)
 * @see SMI-6202 Wave 1: `team_permission_grants` + `default_role_permission` /
 *      `has_team_permission` / `team_ids_with_permission` / `get_effective_team_permissions` /
 *      `set_team_member_role` (`supabase/migrations/20260827000000_team_permission_grants.sql`)
 * @see SMI-6203 Wave 2: the live service these types describe
 * @see SMI-6242: security fix correcting `default_role_permission()`'s admin default — Wave 1
 *      shipped `team:manage_rbac`/`team:manage_sso` as admin-allow, contradicting the plan's
 *      owner-only design; fixed in `20260828000000_rbac_grant_writes.sql`
 *
 * WHAT CHANGED, AND WHY THE OLD MODEL HAD TO GO.
 *
 * The previous version of this file modelled arbitrary custom roles: `createRole`/`deleteRole`, a
 * `hierarchy: number`, and policies built from generic `resources[]`/`actions[]` patterns. None of
 * that exists anywhere in the database, and none of it ever persisted past a process restart —
 * `createStubRBACService()` was an in-memory `Map` and no live service was ever wired in. Its
 * `DEFAULT_ROLES` also published a fourth vocabulary (`admin`/`manager`/`member`/`viewer`) that
 * `team_members.role CHECK(role IN ('owner','admin','member'))` cannot express.
 *
 * The real model, as shipped in Wave 1:
 *
 *  - Base roles are FIXED at three (`owner`/`admin`/`member`) and stay in `team_members.role`.
 *    Only `admin` and `member` are configurable — `owner` is exempt from the grant table entirely
 *    (the no-lockout invariant, enforced by `team_permission_grants.role`'s CHECK and by
 *    `has_team_permission()` short-circuiting before it ever reads a grant row).
 *  - Permissions are a FIXED set of four strings, pinned by a CHECK constraint precisely so a
 *    grant cannot be settable-but-unenforced.
 *  - Per-team `allow`/`deny` overrides live in `team_permission_grants`; deny wins over allow, and
 *    an absent row falls through to the built-in default matrix.
 *
 * So an Enterprise admin does not invent roles — they reshape what `admin` and `member` MEAN
 * inside their own team, at permission granularity. `ReadOnly` is `member` with denies; `Manager`
 * is `member` with allows. That is the whole product surface, and these types now say so.
 */
export const GRANTABLE_ROLES = ['admin', 'member'];
export const TEAM_PERMISSIONS = [
    'registry:approve',
    'registry:deprecate',
    'team:manage_rbac',
    'team:manage_sso',
];
/** The meta-permission every write in this module is gated on. */
export const MANAGE_RBAC_PERMISSION = 'team:manage_rbac';
/**
 * The two META-permissions: the ones that decide who may reconfigure authority itself, rather than
 * who may do ordinary registry work. Both carry the identical owner-only default in the plan's
 * design table (`owner ✓ / admin ✗ / member ✗`), and per gate 4 of `set_team_role_permission()` /
 * `reset_team_role_permission()` (`20260828000000_rbac_grant_writes.sql`) only an `owner`-role
 * caller may write OR clear a grant row for either. `team:manage_sso` belongs here on merit rather
 * than symmetry — it gates IdP registration and domain claims, so a non-owner able to self-grant
 * it could authenticate as the owner. Full three-part rationale: that migration's header, gate 4.
 */
export const META_PERMISSIONS = [
    'team:manage_rbac',
    'team:manage_sso',
];
/**
 * The built-in matrix, byte-equivalent to `default_role_permission(p_role, p_permission)` as
 * corrected in Wave 2 (SMI-6242): `admin` allows the two registry permissions only, `member`
 * allows none, and any unknown pair resolves `false` (never NULL — the SQL's outer COALESCE
 * guarantees that, because callers do `IF NOT has_team_permission(...)` and `NOT NULL` would fail
 * OPEN).
 *
 * SMI-6242 SECURITY FIX (Wave 2): Wave 1's shipped `default_role_permission()` granted `admin`
 * ALL FOUR permissions, including `team:manage_rbac` and `team:manage_sso` — the two
 * meta-permissions that decide who may grant/deny every other permission. The plan's own design
 * table (docs/internal/implementation/smi-6200-enterprise-rbac-sso-real-implementation.md lines
 * 268-280) defines both as owner-only by default (owner yes / admin no / member no), and the
 * whole security model depends on that — an admin who can freely rewrite `team:manage_rbac` can
 * mint itself (or any other admin) permanent RBAC authority with no owner involved. Wave 2's
 * migration (`20260828000000_rbac_grant_writes.sql`) corrects `default_role_permission()` via
 * `CREATE OR REPLACE`, removing the `('admin', 'team:manage_rbac')` and
 * `('admin', 'team:manage_sso')` rows — `admin` now allows only the two registry permissions.
 * The SQL is the source of truth and this table matches it — if this default is ever revisited
 * again, it changes in the migration first and here second, never the other way round.
 */
export const DEFAULT_ROLE_PERMISSIONS = {
    admin: {
        'registry:approve': 'allow',
        'registry:deprecate': 'allow',
        'team:manage_rbac': 'deny',
        'team:manage_sso': 'deny',
    },
    member: {
        'registry:approve': 'deny',
        'registry:deprecate': 'deny',
        'team:manage_rbac': 'deny',
        'team:manage_sso': 'deny',
    },
};
// ============================================================================
// Shared resolution logic (mirrors has_team_permission / default_role_permission)
// ============================================================================
/**
 * Resolve one cell the way `get_effective_team_permissions()` does: an explicit grant wins
 * (deny beats allow), otherwise the default matrix.
 *
 * Exported so a test can assert stub and live agree on resolution without reaching for Postgres.
 */
export function resolveEffectivePermission(role, permission, grant) {
    if (grant !== undefined)
        return { role, permission, effect: grant, source: 'grant' };
    return { role, permission, effect: DEFAULT_ROLE_PERMISSIONS[role][permission], source: 'default' };
}
// The stub RBACService (StubRbacActor, StubRBACService, STUB_TEAM_ID, createStubRBACService())
// lives in its own file, rbac-tools.stub.ts — split out to stay under the 500-line gate, the same
// split registry-tools.stub.ts and rbac-tools.schemas.ts already made for their sibling files.
//# sourceMappingURL=rbac-tools.types.js.map