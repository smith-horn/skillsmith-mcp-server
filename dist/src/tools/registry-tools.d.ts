/**
 * @fileoverview Private registry MCP tools for enterprise skill management
 * @module @skillsmith/mcp-server/tools/registry-tools
 * @see SMI-3902: Private Registry MCP Tools (original stub)
 * @see SMI-5816: Private skill registry — real implementation
 * @see ADR-129: Postgres-native (JSONB) storage + real team-auth (migration 071)
 *
 * Enables enterprise teams to publish and manage skills in a private registry
 * scoped to their organization. Both metadata and packaged content live in the
 * `private_registry_skills` Postgres table (JSONB content, not S3 — ADR-129);
 * team-scoped RLS + an in-query team_id filter on the service-role path (ADR-116).
 *
 * Backing service is selected at module load: the live Supabase-backed service
 * (registry-tools.live.ts) when Supabase is configured, else an in-memory stub
 * (registry-tools.stub.ts) for local dev / tests.
 *
 * Tier gate: Enterprise (private_registry feature flag — toolFeatureMapping.ts).
 */
import type { ToolContext } from '../context.js';
import { type PrivateRegistryInstallSummary, type RegistrySkillContent } from './registry-tools.content.types.js';
import type { RegistryReviewDecision, PrivateRegistryReviewService } from './registry-tools.review.types.js';
import type { SkillContent } from './registry-tools.schemas.js';
export { createStubRegistryService } from './registry-tools.stub.js';
export type { StubRegistryService, StubActor } from './registry-tools.stub.js';
export { privateRegistryPublishToolSchema, privateRegistryManageToolSchema, skillContentSchema, privateRegistryPublishInputSchema, privateRegistryManageInputSchema, type SkillContent, type PrivateRegistryPublishInput, type PrivateRegistryManageInput, } from './registry-tools.schemas.js';
export interface RegistrySkill {
    skillId: string;
    version: string;
    description: string | null;
    deprecated: boolean;
    publishedAt: string;
    publishedBy: string;
    /**
     * `null` for a non-`'approved'` row (SMI-5949 adversarial-review finding L-2): a pending or
     * rejected version is not actually live at any URL, so presenting one would contradict the
     * intent already honored in `executePrivateRegistryPublishImpl`'s pending-branch message (which
     * omits a Registry URL entirely). Only `registry-tools.live.submissions.ts`'s `mapSubmissionRow()`
     * (the submissions/publish-read-back path, which can return non-approved rows) actually nulls
     * this; `list()`/`get()` only ever return `'approved'` rows by construction (D-4), so this is
     * always non-null there.
     */
    registryUrl: string | null;
    /**
     * SMI-5949 D-3. Every row has one (`NOT NULL` on the table). `list()`/`get()` only ever return
     * `'approved'` rows (D-4's `.eq('approval_status','approved')` predicate) — the field is still
     * populated from the real column rather than hardcoded, so it stays accurate if that predicate
     * is ever loosened for an admin-facing view. A freshly-`publish()`-ed skill is `'pending'` until
     * an admin reviews it. Never print this bare field name unqualified in a user-facing message —
     * pair it with a noun phrase (e.g. "review status") so it is not confused with `approvalMode`.
     */
    approvalStatus: 'pending' | 'approved' | 'rejected';
    /**
     * SMI-5949 D-3. `'auto'` for rows grandfathered in before the approval gate existed;
     * `'review'` for everything published after. Disambiguates an `approved` row with no approver:
     * legitimate iff `approvalMode === 'auto'`. Never print this bare field name unqualified in a
     * user-facing message — pair it with a noun phrase (e.g. "approval workflow") so it is not
     * confused with `approvalStatus`.
     */
    approvalMode: 'review' | 'auto';
}
export interface PrivateRegistryPublishResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skill?: RegistrySkill;
    /** The team's publish namespace (SMI-5852, AC-11) — surfaced on success too, not only
     *  as an error-path side effect, so a first publish need not be how a team discovers it. */
    skillNamespace?: string;
    message?: string;
    error?: string;
}
export interface PrivateRegistryManageResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skills?: RegistrySkill[];
    skill?: RegistrySkill;
    /** Present for action:'namespace' — the team's publish namespace (SMI-5852, AC-11). */
    namespace?: string;
    /** Present for action:'install' (SMI-5905). An allowlist — never carries raw `content`. */
    install?: PrivateRegistryInstallSummary;
    /** action:'submissions' (SMI-5949 D-5). Metadata only, never `content` (C1) — separate from
     *  `skills` since this can include pending/rejected items. */
    submissions?: RegistrySkill[];
    /** action:'approve'/'reject' (SMI-5949 D-5). */
    review?: RegistryReviewDecision;
    message?: string;
    error?: string;
}
/**
 * PrivateRegistryService — team-scoped private registry CRUD.
 *
 * **Invariant (ADR-116)**: every method MUST treat `teamId` as the authoritative
 * scoping key and include an explicit `team_id = <teamId>` filter in the query.
 * The live Supabase implementation uses the service-role client, which bypasses
 * RLS — tenant isolation is enforced in the service, not the database.
 *
 * @see packages/mcp-server/src/tools/registry-tools.live.ts
 * @see docs/internal/adr/129-private-skill-registry-real-implementation.md
 */
export interface PrivateRegistryService extends PrivateRegistryReviewService {
    publish(teamId: string, skillId: string, version: string, content: SkillContent, description?: string): Promise<RegistrySkill>;
    /**
     * SMI-5949 Wave 3: `includeDeprecated` skips the `deprecated = FALSE` predicate this method
     * carries by default, so an admin can still see what they deprecated. No equivalent flag on
     * `get()` below — see `registry-tools.live.reads.ts`'s `getSkill()` for why that asymmetry is
     * deliberate.
     */
    list(teamId: string, version?: string, includeDeprecated?: boolean): Promise<RegistrySkill[]>;
    get(teamId: string, skillId: string, version?: string): Promise<RegistrySkill | null>;
    /** SMI-5905: one version's packaged `content`, for install. `null` when nothing visible
     *  matches (absent OR cross-team — deliberately indistinguishable). Throws when the row's OWN
     *  team is no longer Enterprise-entitled: that check lives in the implementation, never in a
     *  caller. Version semantics are `get()`'s — explicit pins, omitted = most recently published. */
    getContent(teamId: string, skillId: string, version?: string): Promise<RegistrySkillContent | null>;
    deprecate(teamId: string, skillId: string): Promise<boolean>;
    undeprecate(teamId: string, skillId: string): Promise<boolean>;
    /**
     * The team's publish namespace (teams.skill_namespace — SMI-5852), or null if it
     * could not be resolved. Used both for a UX pre-check before publish (surfacing a
     * namespace mismatch as a typed error instead of a raw DB-trigger exception) and
     * for the dedicated `manage(action: 'namespace')` read path (AC-11) — a team should
     * be able to discover its namespace without attempting a publish at all.
     */
    getNamespace(teamId: string): Promise<string | null>;
}
/** Replace the registry service implementation (for testing or production swap) */
export declare function setPrivateRegistryService(svc: PrivateRegistryService): void;
/** Get the current registry service instance */
export declare function getPrivateRegistryService(): PrivateRegistryService;
export declare const executePrivateRegistryPublish: (input: {
    version: string;
    skillId: string;
    content: Record<string, string>;
    description?: string | undefined;
}, _context: ToolContext) => Promise<PrivateRegistryPublishResult>;
export declare const executePrivateRegistryManage: (input: {
    action: "list" | "get" | "deprecate" | "undeprecate" | "approve" | "reject" | "submissions" | "install" | "namespace";
    status?: "rejected" | "approved" | "pending" | undefined;
    version?: string | undefined;
    force?: boolean | undefined;
    skillId?: string | undefined;
    note?: string | undefined;
    includeDeprecated?: boolean | undefined;
}, context: ToolContext) => Promise<PrivateRegistryManageResult>;
//# sourceMappingURL=registry-tools.d.ts.map