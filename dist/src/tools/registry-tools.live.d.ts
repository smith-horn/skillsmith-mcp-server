/**
 * @fileoverview Live Supabase-backed PrivateRegistryService (ADR-129)
 * @module @skillsmith/mcp-server/tools/registry-tools.live
 * @see SMI-5816: Private skill registry — real implementation
 * @see ADR-129: Postgres-native (JSONB) storage, real team-auth (migration 071)
 * @see ADR-116: MCP service-role client + explicit tenant filter
 *
 * Backs `private_registry_publish` / `private_registry_manage` with the real
 * `private_registry_skills` table (migration 20260724000000).
 *
 * TWO CREDENTIALS, THREE PATHS (SMI-5822 fix, SMI-5882 Wave 3; third path added SMI-5905 Wave 3):
 *
 * - **Member-level reads and publishes** (`list`, `get`, `publish`, `getNamespace`) use the
 *   Supabase service-role client. Service-role bypasses RLS, so **tenant isolation is enforced
 *   here**, in-query, via an explicit `team_id = <resolved>` filter on every request (ADR-116).
 *   `teamId` always comes from `resolve_team_from_license` — never from tool input — so a caller
 *   can only ever touch their own team's rows. This is correct for these operations: the team's
 *   license key genuinely authorizes team-scoped reads and publishes, which RLS also grants to any
 *   member (`_member_read` / `_member_insert`).
 *
 * - **Admin-level writes** (`deprecate`, `undeprecate`) do NOT. They run through the signed-in
 *   user's own Supabase JWT (`skillsmith login`, SMI-4402), so PostgREST evaluates
 *   `private_registry_skills_admin_update` with a real `auth.uid()` and the database — not this
 *   file — decides whether the caller is a team admin.
 *
 *   Why the change: a team's license key is shared, and `resolve_team_from_license` is
 *   `(p_license_key TEXT) RETURNS TEXT` — it resolves a *team*, never a *person*. Running these
 *   two operations as service-role therefore made the shared key an effective admin credential:
 *   SMI-5882's staging run proved the asymmetry directly (a team *member* reaches 0 rows over the
 *   authenticated path, while the identical UPDATE as service-role deprecated 2 rows). Re-checking
 *   the role in application code was rejected as the fix — it would duplicate a policy that
 *   already exists and can silently drift from it. Letting the existing, proven policy do the work
 *   cannot drift.
 *
 *   Cost, stated plainly: deprecate/undeprecate now require `skillsmith login` in addition to
 *   SKILLSMITH_LICENSE_KEY, and surface an actionable error when no user credential is present.
 *
 * - **Content reads** (`getContent`, SMI-5905 Wave 3) are a third path: the signed-in user's own
 *   JWT (so `_member_read` decides visibility against a real `auth.uid()`), but MEMBER-level, not
 *   admin. `getAdminUserClient()` / `getMemberUserClient()` (`registry-tools.live.auth.ts`) are two
 *   explicitly-named getters for exactly this reason — the choice cannot be defaulted or omitted at
 *   a call site. What decides whether a content read is *entitled* is in
 *   `registry-tools.live.content.ts`, and is scoped to the row's own team, not the caller's tier.
 *
 * Single-phase write: metadata + content land in one INSERT (ADR-129) — no two-phase
 * Supabase+S3 write/rollback. Published (team_id, skill_id, version) triples are
 * immutable; a re-publish raises a unique violation surfaced as a clear error.
 */
import type { PrivateRegistryService } from './registry-tools.js';
export interface PrivateRegistrySkillRow {
    id: string;
    team_id: string;
    skill_id: string;
    version: string;
    description: string | null;
    content_hash: string;
    deprecated: boolean;
    published_by: string | null;
    published_at: string;
}
export interface SupabaseError {
    code?: string;
    message?: string;
    details?: string;
}
export interface SupabaseQueryResult<T> {
    data: T | null;
    error: SupabaseError | null;
}
export interface SupabaseTableQuery<T> {
    select: (columns?: string) => SupabaseTableQuery<T>;
    eq: (column: string, value: unknown) => SupabaseTableQuery<T>;
    single: () => Promise<SupabaseQueryResult<T>>;
    insert: (row: Record<string, unknown>) => SupabaseTableQuery<T>;
    update: (row: Record<string, unknown>) => SupabaseTableQuery<T>;
    then: <R>(onFulfilled: (value: SupabaseQueryResult<T[]>) => R) => Promise<R>;
}
export interface MinimalSupabaseClient {
    from: <T>(table: string) => SupabaseTableQuery<T>;
}
/**
 * Create a live Supabase-backed PrivateRegistryService.
 *
 * Every DB call explicitly filters by `team_id = <resolved teamId>`. Service-role
 * bypasses RLS — tenant isolation lives here, not in the database (ADR-116).
 */
export declare function createLiveRegistryService(): PrivateRegistryService;
//# sourceMappingURL=registry-tools.live.d.ts.map