/**
 * @fileoverview Real analytics service — queries audit_logs SQLite table
 * @module @skillsmith/mcp-server/tools/analytics.service
 * @see SMI-3916: Wave 2 — Analytics real queries
 *
 * Replaces stub mock data with actual SQL queries against the local
 * audit_logs table. Falls back to the stub when no database is available.
 */
import type { Database } from '@skillsmith/core';
export interface AnalyticsData {
    totalToolCalls: number;
    uniqueTools: number;
    topTools: Array<{
        tool: string;
        count: number;
    }>;
    dailyTrend: Array<{
        date: string;
        count: number;
    }>;
    periodComparison: {
        current: number;
        previous: number;
        changePercent: number;
    };
}
export interface UsageReportData extends AnalyticsData {
    byActor?: Array<{
        actor: string;
        count: number;
    }>;
}
export interface AnalyticsService {
    getDashboardData(periodDays: number): AnalyticsData;
    getUsageReport(periodDays: number, detailed: boolean): UsageReportData;
}
/**
 * Create an analytics service backed by real SQLite queries.
 *
 * audit_logs schema columns used:
 * - timestamp (TEXT, ISO-8601) — event time
 * - resource (TEXT) — tool/resource name
 * - actor (TEXT, nullable) — user identifier
 */
export declare function createRealAnalyticsService(db: Database): AnalyticsService;
//# sourceMappingURL=analytics.service.d.ts.map