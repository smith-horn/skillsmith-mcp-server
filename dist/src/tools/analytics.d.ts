/**
 * @fileoverview Analytics MCP tools — team and enterprise usage dashboards
 * @module @skillsmith/mcp-server/tools/analytics
 * @see SMI-3899: Team Usage Analytics MCP Tools (Wave 2b)
 * @see SMI-6362 Wave 4: Wire Team/Enterprise analytics tools to cloud-aggregated MCP tool-call data
 *
 * Split-tier analytics:
 * - Team tier: team_analytics_dashboard, team_usage_report (usage_analytics flag)
 * - Enterprise tier: analytics_dashboard, usage_report (advanced_analytics flag)
 *
 * Tier gating happens one layer above this file (MCP tool registration / license.gate.ts, not
 * touched by this wave) — Community/Individual callers never reach the handlers below. A
 * Team/Enterprise caller that does reach them resolves against cloud-aggregated `search_metrics`
 * data via `SupabaseAnalyticsService` (analytics.supabase.service.ts), which requires both a
 * `skillsmith login` session (who is calling) and an active Team/Enterprise license/API key (which
 * team) — see analytics.actions.ts's `resolveCloudAnalytics()`. Neither a missing credential nor a
 * cloud RPC failure falls through to local/stub data; both render an actionable error instead
 * (SMI-6362 Wave 4 D-2c / AC-10) — there is no more silent "Uses real SQLite queries ... falls
 * back to stub mock data" behavior for these four tools.
 *
 * SMI-5127 / SMI-6362 Wave 4: the four action-handler implementations, their withTelemetry-wrapped
 * exports, and the cloud credential-resolution + rendering helpers live in the sibling
 * analytics.actions.ts (500-line audit:standards budget split) — re-exported below unchanged. See
 * that file's header for the full three-outcome resolution flow, and its
 * `resolveCloudAnalytics()`/`CloudAnalyticsResolution` for the credential-resolution logic an
 * adversarial review should scope to.
 */
import { z } from 'zod';
export { periodDays, generateDailyTrend } from './analytics.stub.js';
export { executeTeamAnalyticsDashboard, executeTeamUsageReport, executeAnalyticsDashboard, executeUsageReport, } from './analytics.actions.js';
export declare const teamAnalyticsDashboardInputSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["7d", "30d", "90d"]>>>;
}, "strip", z.ZodTypeAny, {
    period: "7d" | "90d" | "30d";
}, {
    period?: "7d" | "90d" | "30d" | undefined;
}>;
export type TeamAnalyticsDashboardInput = z.infer<typeof teamAnalyticsDashboardInputSchema>;
export declare const teamUsageReportInputSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["7d", "30d", "90d"]>>>;
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["summary", "detailed"]>>>;
}, "strip", z.ZodTypeAny, {
    format: "summary" | "detailed";
    period: "7d" | "90d" | "30d";
}, {
    format?: "summary" | "detailed" | undefined;
    period?: "7d" | "90d" | "30d" | undefined;
}>;
export type TeamUsageReportInput = z.infer<typeof teamUsageReportInputSchema>;
export declare const analyticsDashboardInputSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["7d", "30d", "90d"]>>>;
    includeRecommendations: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    period: "7d" | "90d" | "30d";
    includeRecommendations: boolean;
}, {
    period?: "7d" | "90d" | "30d" | undefined;
    includeRecommendations?: boolean | undefined;
}>;
export type AnalyticsDashboardInput = z.infer<typeof analyticsDashboardInputSchema>;
export declare const usageReportInputSchema: z.ZodObject<{
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["7d", "30d", "90d"]>>>;
    format: z.ZodDefault<z.ZodOptional<z.ZodEnum<["summary", "detailed", "csv"]>>>;
}, "strip", z.ZodTypeAny, {
    format: "summary" | "detailed" | "csv";
    period: "7d" | "90d" | "30d";
}, {
    format?: "summary" | "detailed" | "csv" | undefined;
    period?: "7d" | "90d" | "30d" | undefined;
}>;
export type UsageReportInput = z.infer<typeof usageReportInputSchema>;
export declare const teamAnalyticsDashboardToolSchema: {
    name: "team_analytics_dashboard";
    description: string;
    title: string;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
    };
    inputSchema: {
        type: "object";
        properties: {
            period: {
                type: string;
                enum: string[];
                description: string;
            };
        };
    };
};
export declare const teamUsageReportToolSchema: {
    name: "team_usage_report";
    description: string;
    title: string;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
    };
    inputSchema: {
        type: "object";
        properties: {
            period: {
                type: string;
                enum: string[];
                description: string;
            };
            format: {
                type: string;
                enum: string[];
                description: string;
            };
        };
    };
};
export declare const analyticsDashboardToolSchema: {
    name: "analytics_dashboard";
    description: string;
    title: string;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
    };
    inputSchema: {
        type: "object";
        properties: {
            period: {
                type: string;
                enum: string[];
                description: string;
            };
            includeRecommendations: {
                type: string;
                description: string;
            };
        };
    };
};
export declare const usageReportToolSchema: {
    name: "usage_report";
    description: string;
    title: string;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
    };
    inputSchema: {
        type: "object";
        properties: {
            period: {
                type: string;
                enum: string[];
                description: string;
            };
            format: {
                type: string;
                enum: string[];
                description: string;
            };
        };
    };
};
//# sourceMappingURL=analytics.d.ts.map