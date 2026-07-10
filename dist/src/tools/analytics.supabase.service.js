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
import { getSupabaseClient } from '../supabase-client.js';
// ============================================================================
// Coverage note (shared across all callers of topSkills)
// ============================================================================
const COVERAGE_NOTE = 'v1 captures Claude Code invocations + Skillsmith MCP tool calls. ' +
    'Context-injection skills (Cursor, Copilot, Codex) not yet captured.';
// ============================================================================
// Window string → days
// ============================================================================
const WINDOW_DAYS = { '7d': 7, '30d': 30, '90d': 90 };
function toNumber(v) {
    return typeof v === 'bigint' ? Number(v) : v;
}
// ============================================================================
// Service class
// ============================================================================
export class SupabaseAnalyticsService {
    /**
     * Top skills by invocation count for a team within a rolling window.
     * Calls `analytics_skill_top(p_team_id, p_window_days)`.
     */
    async getTopSkills(opts) {
        const windowDays = WINDOW_DAYS[opts.window];
        let client;
        try {
            client = await getSupabaseClient();
        }
        catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
        const supabase = client;
        const { data, error } = await supabase.rpc('analytics_skill_top', {
            p_team_id: opts.teamId,
            p_window_days: windowDays,
        });
        if (error) {
            return { ok: false, error: `analytics_skill_top RPC failed: ${error.message}` };
        }
        const rawRows = (data ?? []);
        let unattributed = 0;
        const rows = rawRows.map((r) => {
            const breakdown = {};
            for (const [k, v] of Object.entries(r.framework_breakdown ?? {})) {
                breakdown[k] = typeof v === 'number' ? v : Number(v);
            }
            if ('unknown' in breakdown)
                unattributed++;
            const delta = r.week_over_week_delta !== null ? Number(r.week_over_week_delta) : null;
            return {
                skill_name: r.skill_name,
                skill_id: r.skill_name,
                invocation_count: toNumber(r.invocation_count),
                distinct_developers: toNumber(r.distinct_developers),
                week_over_week_delta: delta,
                framework_breakdown: breakdown,
            };
        });
        const limited = opts.limit !== undefined ? rows.slice(0, opts.limit) : rows;
        return {
            ok: true,
            data: {
                panel: 'topSkills',
                window: opts.window,
                rows: limited,
                unattributed_count: unattributed,
                coverage_note: COVERAGE_NOTE,
            },
        };
    }
    /**
     * Skills installed but invoked fewer than threshold times in the window.
     * Calls `analytics_skill_stale(p_team_id, p_window_days, p_threshold)`.
     */
    async getStaleSkills(opts) {
        let client;
        try {
            client = await getSupabaseClient();
        }
        catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
        const supabase = client;
        const { data, error } = await supabase.rpc('analytics_skill_stale', {
            p_team_id: opts.teamId,
            p_window_days: opts.windowDays,
            p_threshold: opts.thresholdInvocations,
        });
        if (error) {
            return { ok: false, error: `analytics_skill_stale RPC failed: ${error.message}` };
        }
        const rawRows = (data ?? []);
        const rows = rawRows.map((r) => {
            const count = toNumber(r.invocation_count);
            return {
                skill_name: r.skill_name,
                skill_id: r.skill_name,
                last_invoked: r.last_invoked ?? null,
                invocation_count: count,
                // installed_at not returned by RPC in v1 — set null
                installed_at: null,
                recommend_action: count === 0 ? 'uninstall' : 'review',
            };
        });
        return {
            ok: true,
            data: {
                panel: 'staleSkills',
                window: '90d',
                threshold: opts.thresholdInvocations,
                rows,
            },
        };
    }
    /**
     * Skill co-occurrence pairs invoked within the same session.
     * Calls `analytics_skill_cooccurrence(p_team_id, p_window_days)`.
     * Client-side `minCount` filter applied post-RPC (RPC has no threshold param).
     */
    async getCooccurrence(opts) {
        let client;
        try {
            client = await getSupabaseClient();
        }
        catch (err) {
            return { ok: false, error: err instanceof Error ? err.message : String(err) };
        }
        const supabase = client;
        const { data, error } = await supabase.rpc('analytics_skill_cooccurrence', {
            p_team_id: opts.teamId,
            p_window_days: opts.windowDays,
        });
        if (error) {
            return { ok: false, error: `analytics_skill_cooccurrence RPC failed: ${error.message}` };
        }
        const rawRows = (data ?? []);
        const minCount = opts.minCount ?? 1;
        const rows = rawRows
            .map((r) => ({
            skill_a: r.skill_a,
            skill_b: r.skill_b,
            cooccurrence_count: toNumber(r.cooccurrence_count),
        }))
            .filter((r) => r.cooccurrence_count >= minCount);
        return {
            ok: true,
            data: {
                panel: 'cooccurrence',
                window_days: opts.windowDays,
                rows,
            },
        };
    }
}
//# sourceMappingURL=analytics.supabase.service.js.map