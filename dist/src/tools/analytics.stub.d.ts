/**
 * @fileoverview Stub data generators and fallback handlers for analytics MCP tools
 * @module @skillsmith/mcp-server/tools/analytics.stub
 * @see SMI-3899: Team Usage Analytics MCP Tools (Wave 2b)
 * @see SMI-3914: Wave 0 stub extraction
 * @see SMI-3916: Wave 2 — stub fallbacks extracted from analytics.ts
 *
 * Extracted from analytics.ts for file-size compliance.
 * Provides deterministic mock data generators and fallback handler
 * implementations used when no real database is available.
 */
/** Map period string to number of days */
export declare function periodDays(period: string): number;
/** Generate mock daily trend data for the given number of days */
export declare function generateDailyTrend(days: number): Array<{
    date: string;
    calls: number;
}>;
/** Stub fallback for team analytics dashboard */
export declare function stubTeamAnalyticsDashboard(period: string): string;
/** Stub fallback for team usage report */
export declare function stubTeamUsageReport(period: string, format: string): string;
/** Stub fallback for enterprise analytics dashboard */
export declare function stubAnalyticsDashboard(period: string, includeRecommendations: boolean): string;
/** Stub fallback for enterprise usage report */
export declare function stubUsageReport(period: string, format: string): string;
//# sourceMappingURL=analytics.stub.d.ts.map