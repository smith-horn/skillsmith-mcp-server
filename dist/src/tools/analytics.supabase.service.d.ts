/**
 * @fileoverview Supabase-backed analytics service — cloud read path for Team/Enterprise tiers
 * @module @skillsmith/mcp-server/tools/analytics.supabase.service
 * @see SMI-5015: W1.S3 — MCP read path for skill-invoke analytics RPCs
 * @see SMI-6362 Wave 4 — D-2c (user-bound client, no SECURITY DEFINER bypass), D-2e (reporting
 *   coverage / k-anonymity), D-9 (self-attestation disclosure)
 *
 * Five RPCs are called against the cloud `search_metrics` table:
 *  - analytics_skill_top              → topSkills panel
 *  - analytics_skill_stale            → staleSkills panel
 *  - analytics_skill_cooccurrence     → co-occurrence panel
 *  - analytics_tool_usage             → AnalyticsData/UsageReportData (D-2c)
 *  - analytics_team_reporting_coverage → TeamReportingCoverage (D-2e)
 *
 * Error handling: methods NEVER throw — errors are returned as a typed
 * error envelope `{ ok: false; error: string }` so callers can branch
 * without try/catch. Success results carry `{ ok: true; data: <panel> }`.
 *
 * RPC params use PostgreSQL snake_case names (p_team_id, p_window_days,
 * p_threshold) matching the function signatures in the migration.
 *
 * Client (D-2c): every method below builds its client via `getSupabaseUserClient(accessToken)`,
 * never the anon-key singleton. All five RPCs are `REVOKE ALL FROM PUBLIC, anon; GRANT EXECUTE TO
 * authenticated` and require a real user's JWT — `p_team_id` is a filter, never an authorization
 * check, so a caller-supplied team id alone must never be sufficient to read that team's data.
 * This file deliberately does NOT special-case "no access token" — that's the caller's job (a
 * different file, analytics.ts) to check before ever calling into this service.
 */
import type { UsageReportData } from './analytics.service.js';
export { COVERAGE_K, buildCoverageNote, nicknameFromActor, actorDisplayLabel, } from './analytics.supabase.service.helpers.js';
export interface TopSkillRow {
    skill_name: string;
    /** skill_name doubles as skill_id — RPCs don't return a separate id column */
    skill_id: string;
    invocation_count: number;
    distinct_developers: number;
    /** -1.0 to +Infinity; null when no prior window data */
    week_over_week_delta: number | null;
    framework_breakdown: Record<string, number>;
}
export interface TopSkillsPanel {
    panel: 'topSkills';
    window: '7d' | '30d' | '90d';
    rows: TopSkillRow[];
    /** total rows where framework_breakdown has an 'unknown' key */
    unattributed_count: number;
    coverage_note: string;
}
export interface StaleSkillRow {
    skill_name: string;
    /** skill_name doubles as skill_id — RPCs don't return a separate id column */
    skill_id: string;
    /** ISO timestamp — null when skill has never been invoked */
    last_invoked: string | null;
    invocation_count: number;
    /** installed_at not returned by RPC; null in v1 */
    installed_at: string | null;
    recommend_action: 'uninstall' | 'review';
}
export interface StaleSkillsPanel {
    panel: 'staleSkills';
    window: '90d';
    threshold: number;
    rows: StaleSkillRow[];
}
export interface CooccurrenceRow {
    skill_a: string;
    skill_b: string;
    cooccurrence_count: number;
}
export interface CooccurrencePanel {
    panel: 'cooccurrence';
    window_days: number;
    rows: CooccurrenceRow[];
}
/**
 * Mapped result of `analytics_team_reporting_coverage` (D-2e). Deliberately does NOT carry
 * `suppression_reason` — that RPC column is diagnostic-only and must never reach a renderer, so it
 * is dropped at the mapping boundary in {@link SupabaseAnalyticsService.getReportingCoverage}
 * rather than merely being ignored by callers.
 */
export interface TeamReportingCoverage {
    coverageLevel: 'full' | 'aggregate' | 'qualitative';
    totalSeats: number | null;
    reportingSeats: number | null;
    nonReportingSeats: number | null;
    optedOutSeats: number | null;
    undecidedSeats: number | null;
    activeActorsInWindow: number | null;
    suppressed: boolean;
}
export type ServiceResult<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
};
export interface GetTopSkillsOpts {
    teamId: string;
    accessToken: string;
    window: '7d' | '30d' | '90d';
    limit?: number;
}
export interface GetStaleSkillsOpts {
    teamId: string;
    accessToken: string;
    thresholdInvocations: number;
    windowDays: number;
}
export interface GetCooccurrenceOpts {
    teamId: string;
    accessToken: string;
    windowDays: number;
    minCount?: number;
}
export interface GetToolUsageOpts {
    teamId: string;
    accessToken: string;
    windowDays: number;
}
export interface GetReportingCoverageOpts {
    teamId: string;
    accessToken: string;
}
export declare class SupabaseAnalyticsService {
    /**
     * Build a user-bound RPC client for `accessToken` (D-2c). Shared by every method below instead
     * of each repeating its own try/catch — never falls back to the anon-key singleton, and never
     * throws (a construction failure becomes a `{ ok: false }` envelope like every other error
     * path).
     */
    private client;
    /**
     * Top skills by invocation count for a team within a rolling window.
     * Calls `analytics_skill_top(p_team_id, p_window_days)`.
     */
    getTopSkills(opts: GetTopSkillsOpts): Promise<ServiceResult<TopSkillsPanel>>;
    /**
     * Skills installed but invoked fewer than threshold times in the window.
     * Calls `analytics_skill_stale(p_team_id, p_window_days, p_threshold)`.
     */
    getStaleSkills(opts: GetStaleSkillsOpts): Promise<ServiceResult<StaleSkillsPanel>>;
    /**
     * Skill co-occurrence pairs invoked within the same session.
     * Calls `analytics_skill_cooccurrence(p_team_id, p_window_days)`.
     * Client-side `minCount` filter applied post-RPC (RPC has no threshold param).
     */
    getCooccurrence(opts: GetCooccurrenceOpts): Promise<ServiceResult<CooccurrencePanel>>;
    /**
     * Team tool-call usage for a rolling window — the AnalyticsData/UsageReportData shape shared
     * with the local SQLite-backed service (analytics.service.ts). Calls
     * `analytics_tool_usage(p_team_id, p_window_days)`.
     */
    getToolUsage(opts: GetToolUsageOpts): Promise<ServiceResult<UsageReportData>>;
    /**
     * Team reporting-coverage figure (D-2e) — how much of the team's usage data is actually
     * captured, k-anonymized to avoid identifying individual opt-out/undecided seats. Calls
     * `analytics_team_reporting_coverage(p_team_id)`.
     *
     * The RPC returns exactly one row for a team member, zero rows for a non-member (never an
     * error) — a zero-row result is mapped here to `{ ok: false }` rather than a fabricated coverage
     * level.
     */
    getReportingCoverage(opts: GetReportingCoverageOpts): Promise<ServiceResult<TeamReportingCoverage>>;
}
//# sourceMappingURL=analytics.supabase.service.d.ts.map