/**
 * @fileoverview Live Supabase-backed PrivateRegistryService (ADR-129)
 * @module @skillsmith/mcp-server/tools/registry-tools.live
 * @see SMI-5816: Private skill registry — real implementation
 * @see ADR-129: Postgres-native (JSONB) storage, real team-auth (migration 071)
 * @see ADR-116: MCP service-role client + explicit tenant filter — NARROWED for this file's
 *   team-scoped reads by SMI-6109 (see the "Addendum: SMI-6109" section in
 *   docs/internal/adr/116-mcp-server-service-role-for-team-scoped-tools.md). Still current
 *   for `team-workspace.live.ts`, deliberately not touched by that change.
 *
 * Backs `private_registry_publish` / `private_registry_manage` with the real
 * `private_registry_skills` table (migration 20260724000000).
 *
 * TWO CREDENTIALS, EVERY PATH ON A REAL PERSON (SMI-5822 fix, SMI-5882 Wave 3; `getContent` added
 * SMI-5905 Wave 3; `publish` moved off service-role SMI-5949 Wave 2 Step 2, D-7; `list`/`get`/
 * `getNamespace` moved off service-role SMI-6109):
 *
 * - **Member-level operations** (`list`, `get`, `getNamespace`, `getContent`, `publish`,
 *   `submissions`, `approve`/`reject`) run through the signed-in user's own Supabase JWT
 *   (`getMemberUserClient()`, `registry-tools.live.auth.ts`) — `skillsmith login`, not the shared
 *   team license key. `teamId` still always comes from `resolve_team_from_license` (never from
 *   tool input), and `list`/`get` still carry the same explicit, mandatory `team_id` /
 *   `approval_status = 'approved'` / `deprecated = FALSE` in-query predicates as before (ADR-116's
 *   tenant-isolation invariant — RLS does not enforce `approval_status`/`deprecated` at all, so
 *   dropping these predicates would silently widen what a signed-in member can read, not just
 *   change which credential reads it). Query logic for `list`/`get` lives in
 *   `registry-tools.live.reads.ts`.
 *
 *   SMI-6109: before this change, `list`/`get`/`getNamespace` ran on the Supabase service-role
 *   client — the single most powerful credential in the backend, required as
 *   `SUPABASE_SERVICE_ROLE_KEY` on every MCP host that used these tools. The published
 *   `@skillsmith/mcp-server` README instructed real customers to configure exactly that key on
 *   their own machines, in an open-core repo whose source (including this file) is public — a
 *   documented, live threat vector, not a hypothetical. These three are member-level reads (any
 *   team member may run them), not admin-level, so `getMemberUserClient()` is the correct getter
 *   — never `getAdminUserClient()`. A license-key-team-vs-logged-in-user-membership mismatch is a
 *   real, pre-existing dual-identity-signal gap this move inherits (the license key resolves one
 *   team; the signed-in user's own membership can silently point at a different one, or none) —
 *   RLS fails closed on the mismatch indistinguishably from "genuinely not found," and the
 *   `recordRegistryAudit()` calls added to all three make that mismatch observable rather than
 *   invisible (`registry-tools.live.audit.ts`). Reconciling the two identity signals directly is a
 *   separate, broader design question, tracked as a follow-up, not fixed here.
 *
 * - **Admin-level writes** (`deprecate`, `undeprecate`) also run through the signed-in user's own
 *   Supabase JWT (`getAdminUserClient()`), so PostgREST evaluates
 *   `private_registry_skills_admin_update` with a real `auth.uid()` and the database — not this
 *   file — decides whether the caller is a team admin.
 *
 *   Why the change (pre-dates SMI-6109): a team's license key is shared, and
 *   `resolve_team_from_license` is `(p_license_key TEXT) RETURNS TEXT` — it resolves a *team*,
 *   never a *person*. Running these two operations as service-role therefore made the shared key
 *   an effective admin credential: SMI-5882's staging run proved the asymmetry directly (a team
 *   *member* reaches 0 rows over the authenticated path, while the identical UPDATE as
 *   service-role deprecated 2 rows). Re-checking the role in application code was rejected as the
 *   fix — it would duplicate a policy that already exists and can silently drift from it. Letting
 *   the existing, proven policy do the work cannot drift.
 *
 *   Cost, stated plainly: deprecate/undeprecate (and, since SMI-6109, list/get/getNamespace too)
 *   require `skillsmith login` in addition to SKILLSMITH_LICENSE_KEY (or SKILLSMITH_API_KEY,
 *   SMI-6080), and surface an actionable error when no user credential is present.
 *
 * - **Content reads** (`getContent`, SMI-5905 Wave 3) are member-level like the operations above:
 *   the signed-in user's own JWT (so `_member_read` decides visibility against a real
 *   `auth.uid()`). `getAdminUserClient()` / `getMemberUserClient()` (`registry-tools.live.auth.ts`)
 *   are two explicitly-named getters for exactly this reason — the choice cannot be defaulted or
 *   omitted at a call site. What decides whether a content read is *entitled* is in
 *   `registry-tools.live.content.ts`, and is scoped to the row's own team, not the caller's tier.
 *
 * - **`publish`** (SMI-5949 Wave 2 Step 2, D-7) is member-level like `getContent` — not admin: any
 *   team member may submit a version, not only admins. `published_by` is `DEFAULT auth.uid()`
 *   (migration 20260729000000), which stays NULL on the service-role path this method used before
 *   — and an unconditional BEFORE INSERT trigger (Wave 1) now hard-rejects a NULL `published_by`,
 *   so a service-role publish fails outright. Beyond that trigger, a real submitter identity is
 *   also the prerequisite for D-6's self-approval check: `review_private_registry_submission()`
 *   can only refuse a submitter approving their own work if it can name the submitter, and a
 *   shared license key never can. Two consequences the D-4 RLS gate forces on this method
 *   specifically (a `pending` row is invisible even to its own submitter): the INSERT can no
 *   longer request a representation (`.select()`/`RETURNING`) — see the empirically-confirmed
 *   D-4(a) note on `publish()` below — and the freshly-published row is read back through the
 *   metadata-only `get_private_registry_submissions` RPC (D-5) instead.
 *
 * Single-phase write: metadata + content land in one INSERT (ADR-129) — no two-phase
 * Supabase+S3 write/rollback. Published (team_id, skill_id, version) triples are
 * immutable; a re-publish raises a unique violation surfaced as a clear error.
 *
 * NOT touched by SMI-6109, deliberately (see docs/internal/implementation, SMI-6109 plan,
 * "Explicitly out of scope"): `team-workspace.live.ts`'s identical service-role pattern across 8
 * methods (writes, not just reads, with no existing member-client precedent to reuse);
 * `registry-tools.live.audit.ts`'s own audit-log write path (a system-table insert, fail-soft,
 * structurally different from a tenant-data read); `SKILLSMITH_API_KEY_HMAC_SECRET`'s
 * distribution (an unrelated secret, not consumed by any Supabase call).
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
    /** SMI-5949 D-3. NOT NULL on the table; every row has one. */
    approval_status: 'pending' | 'approved' | 'rejected';
    /** SMI-5949 D-3. NOT NULL on the table; every row has one. */
    approval_mode: 'review' | 'auto';
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
    /**
     * PostgREST RPC call (`POST /rpc/<fn>`) — SMI-5949 D-5's two `SECURITY DEFINER` functions have
     * no plain table representation. Used today only for `get_private_registry_submissions()`, the
     * sole read path for a `pending` row (D-4(c)).
     */
    rpc: <T>(fn: string, params?: Record<string, unknown>) => Promise<SupabaseQueryResult<T>>;
}
/**
 * Create a live Supabase-backed PrivateRegistryService.
 *
 * Every DB call explicitly filters by `team_id = <resolved teamId>`. `list`/`get`/`getNamespace`
 * run on the signed-in user's own JWT (SMI-6109) — RLS is the real authorization boundary, but the
 * explicit `team_id`/`approval_status`/`deprecated` predicates stay, since RLS does not enforce
 * the latter two at all (ADR-116's invariant, still load-bearing after the credential change).
 */
export declare function createLiveRegistryService(): PrivateRegistryService;
//# sourceMappingURL=registry-tools.live.d.ts.map