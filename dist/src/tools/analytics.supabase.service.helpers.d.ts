/**
 * @fileoverview Helpers for SupabaseAnalyticsService, split out of analytics.supabase.service.ts
 * to stay under the 500-line file gate (CLAUDE.md § CI Health Requirements).
 * @module @skillsmith/mcp-server/tools/analytics.supabase.service.helpers
 * @see SMI-6362 Wave 4 — D-2e (coverage disclosure), D-9 (self-attestation limitation), and the
 *   ops-report actor-nickname port.
 *
 * Both re-exported from analytics.supabase.service.ts so external callers (analytics.ts) import
 * everything from that one file, same as before this split:
 *  - buildCoverageNote(): the data-coverage disclosure rendered by all four Team/Enterprise
 *    analytics MCP tools.
 *  - nicknameFromActor()/actorDisplayLabel(): a verbatim TS port of the Deno-runtime nickname
 *    algorithm in supabase/functions/ops-report/usage-aggregators.ts:36-59 (that file cannot be
 *    cross-imported into this Node package), so the SAME actor digest produces the SAME nickname
 *    on both surfaces.
 */
import type { TeamReportingCoverage } from './analytics.supabase.service.js';
export interface RpcTopRow {
    skill_name: string;
    invocation_count: bigint | number;
    distinct_developers: bigint | number;
    week_over_week_delta: string | number | null;
    framework_breakdown: Record<string, number> | null;
}
export interface RpcStaleRow {
    skill_name: string;
    last_invoked: string | null;
    invocation_count: bigint | number;
}
export interface RpcCooccurrenceRow {
    skill_a: string;
    skill_b: string;
    cooccurrence_count: bigint | number;
}
export interface RpcToolUsageRow {
    total_calls: bigint | number | string;
    unique_tools: bigint | number | string;
    top_tools: Array<{
        tool: string;
        count: bigint | number | string;
    }> | null;
    daily_trend: Array<{
        date: string;
        count: bigint | number | string;
    }> | null;
    previous_period_total: bigint | number | string;
    by_actor: Array<{
        actor: string;
        count: bigint | number | string;
    }> | null;
}
export interface RpcReportingCoverageRow {
    coverage_level: 'full' | 'aggregate' | 'qualitative';
    suppression_reason: string | null;
    total_seats: number | null;
    reporting_seats: number | null;
    non_reporting_seats: number | null;
    opted_out_seats: number | null;
    undecided_seats: number | null;
    active_actors_in_window: number | null;
    suppressed: boolean;
}
/**
 * Deterministic two-word nickname for an actor digest — the same digest always produces the same
 * nickname, on this surface and on the ops-report edge function's (word lists and algorithm are
 * byte-identical; keep both in sync if either ever changes). Never converts back to a real
 * identity — that mapping doesn't exist on this side of the pipeline.
 */
export declare function nicknameFromActor(actorHashHex: string): string;
/**
 * Per-actor row label: nickname plus a 12-char digest prefix, matching
 * usage-aggregators.ts:246-258's `{ actorPrefix, nickname }` pairing.
 */
export declare function actorDisplayLabel(actor: string): string;
/**
 * k-anonymity floor (SMI-6362 Wave 4, D-2e). Mirrors the SQL migration's
 * `v_k CONSTANT INT := 5` inside analytics_team_reporting_coverage
 * (supabase/migrations/20260905060000_cloud_usage_analytics_wiring.sql). This constant does not
 * read the SQL value at runtime — it is a documented mirror of it. Raise both together if this
 * ever changes.
 */
export declare const COVERAGE_K = 5;
/**
 * Builds the data-coverage disclosure rendered by all four Team/Enterprise analytics MCP tools
 * (SMI-6362 §4). Order is load-bearing (D-1, D-9, D-2e): capture-status statement, then the
 * coverage figure at whatever level the RPC actually returned, then the self-attestation
 * limitation.
 *
 * `coverage` is `null` when the RPC call itself failed/errored (network, not-a-member, etc) —
 * render an honest "unavailable" line, never a fabricated figure and never a digit standing in for
 * real data. Never renders `suppression_reason` — {@link TeamReportingCoverage} doesn't even carry
 * that field, so there is no read path to it here to accidentally exercise. And never reaches for
 * another data source to fill in what a suppressed response withheld — only ever renders what
 * `coverage` itself carries.
 *
 * Null-bucket demotion (SMI-6362 Wave 4 adversarial review): every count on
 * {@link TeamReportingCoverage} is `number | null`, so no bucket is ever interpolated without
 * first proving it non-null — `${null}` renders the literal string "null" into a Team admin's
 * dashboard, which is simultaneously a wrong figure and one that reads like data. Today's SQL
 * contract does guarantee non-null buckets at each level (every count is a `COUNT(...)::INT`,
 * which is never NULL, and the `full`/`aggregate` branches of
 * `analytics_team_reporting_coverage` return exactly the buckets their level names), so this is a
 * type-honesty guard rather than a live bug — but a future coverage level, or an RPC edit that
 * NULLs a bucket it used to populate, must degrade to a LOWER disclosure tier instead of printing
 * a placeholder. Demotion is the only safe direction: it can reveal less than the RPC intended,
 * never more.
 */
export declare function buildCoverageNote(coverage: TeamReportingCoverage | null): string;
//# sourceMappingURL=analytics.supabase.service.helpers.d.ts.map