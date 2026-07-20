/**
 * @fileoverview Compliance report MCP tool
 * @module @skillsmith/mcp-server/tools/compliance-tools
 * @see SMI-3906: Compliance Report MCP Tool
 *
 * Generates compliance reports in SOC2 (markdown), CycloneDX (JSON SBOM),
 * or raw JSON format from local skill inventory and audit data.
 *
 * Scope: local inventory only. For server-side audit data, use audit_export.
 *
 * Tier gate: Team and Enterprise (compliance_reports feature flag, SMI-3140
 * expanded from Enterprise-only 2026-07-14).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const complianceReportInputSchema: z.ZodObject<{
    format: z.ZodEnum<["soc2", "cyclonedx", "json"]>;
    period: z.ZodDefault<z.ZodOptional<z.ZodEnum<["30d", "90d", "365d"]>>>;
    includeUserActivity: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    backfillDependencies: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    format: "json" | "soc2" | "cyclonedx";
    period: "90d" | "30d" | "365d";
    backfillDependencies: boolean;
    includeUserActivity: boolean;
}, {
    format: "json" | "soc2" | "cyclonedx";
    period?: "90d" | "30d" | "365d" | undefined;
    backfillDependencies?: boolean | undefined;
    includeUserActivity?: boolean | undefined;
}>;
export type ComplianceReportInput = z.infer<typeof complianceReportInputSchema>;
export declare const complianceReportToolSchema: {
    name: "compliance_report";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            format: {
                type: string;
                enum: string[];
                description: string;
            };
            period: {
                type: string;
                enum: string[];
                description: string;
            };
            includeUserActivity: {
                type: string;
                description: string;
            };
            backfillDependencies: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export interface SkillInventoryItem {
    skillId: string;
    version: string;
    trustTier: 'official' | 'verified' | 'curated' | 'community' | 'experimental' | 'unknown' | 'unverified' | 'local';
    installedAt: string;
    lastUpdated: string;
    /**
     * SMI-3140: absolute install path from the manifest entry, when known.
     * Used only by the cyclonedx formatter's opt-in inline dependency backfill
     * (needs to re-read the installed SKILL.md). Undefined for the stub
     * service and for any manifest entry missing this field (SMI-3177-style
     * corrupt entry) — backfill is simply skipped for that skill in that case.
     */
    installPath?: string;
}
export interface AuditSummary {
    totalEvents: number;
    installCount: number;
    uninstallCount: number;
    searchCount: number;
    periodStart: string;
    periodEnd: string;
}
export interface UserActivitySummary {
    uniqueUsers: number;
    topTools: Array<{
        tool: string;
        count: number;
    }>;
    activeDays: number;
}
export interface ComplianceData {
    skills: SkillInventoryItem[];
    auditSummary: AuditSummary;
    userActivity: UserActivitySummary | null;
    configState: {
        ssoEnabled: boolean;
        rbacEnabled: boolean;
        auditLoggingEnabled: boolean;
        webhooksConfigured: number;
    };
}
export interface ComplianceService {
    gatherData(periodDays: number, includeUserActivity: boolean): Promise<ComplianceData>;
}
/** @internal Exported for testing */
export declare function createStubComplianceService(): ComplianceService;
/** Replace the compliance service implementation */
export declare function setComplianceService(svc: ComplianceService): void;
export interface ComplianceReportResult {
    format: 'soc2' | 'cyclonedx' | 'json';
    dataSource: 'stub' | 'live';
    generatedAt: string;
    scope: 'local';
    period: string;
    report: string | Record<string, unknown>;
}
export declare const executeComplianceReport: (input: {
    format: "json" | "soc2" | "cyclonedx";
    period: "90d" | "30d" | "365d";
    backfillDependencies: boolean;
    includeUserActivity: boolean;
}, context: ToolContext) => Promise<ComplianceReportResult>;
//# sourceMappingURL=compliance-tools.d.ts.map