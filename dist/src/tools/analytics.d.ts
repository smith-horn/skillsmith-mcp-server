/**
 * @fileoverview Analytics MCP tools — team and enterprise usage dashboards
 * @module @skillsmith/mcp-server/tools/analytics
 * @see SMI-3899: Team Usage Analytics MCP Tools (Wave 2b)
 *
 * Split-tier analytics:
 * - Team tier: team_analytics_dashboard, team_usage_report (usage_analytics flag)
 * - Enterprise tier: analytics_dashboard, usage_report (advanced_analytics flag)
 *
 * Uses real SQLite queries against audit_logs when db is available,
 * falls back to stub mock data when no database is present.
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export { periodDays, generateDailyTrend } from './analytics.stub.js';
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
export declare const executeTeamAnalyticsDashboard: (input: {
    period: "7d" | "90d" | "30d";
}, context: ToolContext) => Promise<string>;
export declare const executeTeamUsageReport: (input: {
    format: "summary" | "detailed";
    period: "7d" | "90d" | "30d";
}, context: ToolContext) => Promise<string>;
export declare const executeAnalyticsDashboard: (input: {
    period: "7d" | "90d" | "30d";
    includeRecommendations: boolean;
}, context: ToolContext) => Promise<string>;
export declare const executeUsageReport: (input: {
    format: "summary" | "detailed" | "csv";
    period: "7d" | "90d" | "30d";
}, context: ToolContext) => Promise<string>;
//# sourceMappingURL=analytics.d.ts.map