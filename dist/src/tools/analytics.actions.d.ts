/**
 * @fileoverview Team/Enterprise analytics MCP tools — action-handler implementations
 * @module @skillsmith/mcp-server/tools/analytics.actions
 * @see SMI-6362 Wave 4: Wire Team/Enterprise analytics tools to cloud-aggregated MCP tool-call data
 * @see SMI-5127: the `*.action(s).ts` sibling convention for a tool file whose `withTelemetry`-
 *   wrapped action handlers push it over the 500-line audit:standards budget — this file holds the
 *   four handler implementations and their wrapped exports; `analytics.ts` keeps the MCP tool
 *   registration, Zod input schemas, and JSON tool schemas, re-exporting the wrapped handlers below
 *   unchanged. Precedent: `sso-tools.ts` / `sso-tools.action.ts`.
 *
 * All four tools (team_analytics_dashboard, team_usage_report, analytics_dashboard, usage_report)
 * are tier-gated to Team/Enterprise one layer above this file (MCP tool registration /
 * license.gate.ts, not touched by this wave) — a caller that reaches these handlers is assumed to
 * have real Team/Enterprise intent, so there is no more silent stub fallback here. Resolution is
 * cloud-first, three possible outcomes per handler:
 *
 * 1. `resolveCloudAnalytics()` resolves the caller's identity (a `skillsmith login` access token —
 *    who is calling) and team (a Team/Enterprise license/API key — which team). Either missing
 *    renders an actionable error as the tool's ENTIRE output (`renderCloudError()`); these handlers
 *    never throw.
 * 2. `SupabaseAnalyticsService.getToolUsage()` is called against the cloud `search_metrics`
 *    aggregate. An RPC-level failure renders the same actionable-error shape as step 1 — a
 *    Team/Enterprise caller whose cloud path is broken must see the real error, never local
 *    (in practice empty) SQLite data silently standing in for their team's data.
 * 3. On success, every response also carries a `## Data Coverage` note (`buildCoverageNote()`,
 *    best-effort — a coverage-RPC failure renders "unavailable", never a fabricated figure) plus a
 *    one-line skill-invocation-data honesty disclosure (AC-9), and an optional `## This Session`
 *    block surfacing THIS PROCESS's own telemetry emit-health (`getTelemetryEmitStats()`) only
 *    when this session had any rejected/failed `tool_call` events (D-8) — a narrower,
 *    session-scoped signal, deliberately distinct from the team-wide coverage note above it.
 *
 * The pre-Wave-4 local-SQLite path (`analytics.service.ts` / `analytics.stub.ts`) is deliberately
 * NOT called from any handler below. This is not because `ToolContext.db` is normally absent for a
 * real MCP server invocation — it isn't: `ToolContext.db` is a required field, always a real open
 * SQLite connection (see `context.ts`/`context.async.ts`). It's a product decision: a
 * Team/Enterprise-tier caller must never see local/stub data silently standing in for their team's
 * real cloud data, so the local-service resolver that made that substitution pre-Wave-4 was removed
 * outright rather than left as unreachable dead code (it had no other caller in this package).
 */
import type { ToolContext } from '../context.js';
/** Resolved credentials needed to call the cloud analytics service. */
export interface CloudAnalyticsResolution {
    teamId: string;
    accessToken: string;
}
/**
 * Resolve the credentials needed to call the cloud analytics service (SMI-6362 Wave 4, D-2c).
 * Returns an actionable error string (never a thrown exception, never a silent empty state) when
 * either credential is missing — the caller must render this error rather than falling through to
 * a stub/zero result, per AC-10's "never print Data source: live beside zeros" rule, extended here
 * to "never silently substitute local/stub data for a Team/Enterprise caller's real team data."
 *
 * Two distinct credentials, mirroring team-resolver.ts's own header comment: `resolveUserAccessToken`
 * answers "who is calling" (a `skillsmith login` session — a license/API key alone identifies only
 * the TEAM, never the individual caller); `resolveLicenseTeamId` answers "which team" (the
 * SKILLSMITH_LICENSE_KEY/SKILLSMITH_API_KEY-resolved team, the same RPC path registry-tools.ts's
 * `resolveTeamId()` and team-workspace.ts already share).
 */
export declare function resolveCloudAnalytics(): Promise<{
    ok: true;
    data: CloudAnalyticsResolution;
} | {
    ok: false;
    error: string;
}>;
export declare const executeTeamAnalyticsDashboard: (input: {
    period: "7d" | "90d" | "30d";
}, _context: ToolContext) => Promise<string>;
export declare const executeTeamUsageReport: (input: {
    format: "summary" | "detailed";
    period: "7d" | "90d" | "30d";
}, _context: ToolContext) => Promise<string>;
export declare const executeAnalyticsDashboard: (input: {
    period: "7d" | "90d" | "30d";
    includeRecommendations: boolean;
}, _context: ToolContext) => Promise<string>;
export declare const executeUsageReport: (input: {
    format: "summary" | "detailed" | "csv";
    period: "7d" | "90d" | "30d";
}, _context: ToolContext) => Promise<string>;
//# sourceMappingURL=analytics.actions.d.ts.map