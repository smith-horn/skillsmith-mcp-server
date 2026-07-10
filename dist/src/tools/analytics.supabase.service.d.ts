/**
 * @fileoverview Supabase-backed analytics service — cloud read path for Team/Enterprise tiers
 * @module @skillsmith/mcp-server/tools/analytics.supabase.service
 * @see SMI-5015: W1.S3 — MCP read path for skill-invoke analytics RPCs
 *
 * Three RPCs are called against the cloud `search_metrics` table:
 *  - analytics_skill_top     → topSkills panel
 *  - analytics_skill_stale   → staleSkills panel
 *  - analytics_skill_cooccurrence → co-occurrence panel
 *
 * Error handling: methods NEVER throw — errors are returned as a typed
 * error envelope `{ ok: false; error: string }` so callers can branch
 * without try/catch. Success results carry `{ ok: true; data: <panel> }`.
 *
 * RPC params use PostgreSQL snake_case names (p_team_id, p_window_days,
 * p_threshold) matching the function signatures in the migration.
 */
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
export type ServiceResult<T> = {
    ok: true;
    data: T;
} | {
    ok: false;
    error: string;
};
export interface GetTopSkillsOpts {
    teamId: string;
    window: '7d' | '30d' | '90d';
    limit?: number;
}
export interface GetStaleSkillsOpts {
    teamId: string;
    thresholdInvocations: number;
    windowDays: number;
}
export interface GetCooccurrenceOpts {
    teamId: string;
    windowDays: number;
    minCount?: number;
}
export declare class SupabaseAnalyticsService {
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
}
//# sourceMappingURL=analytics.supabase.service.d.ts.map