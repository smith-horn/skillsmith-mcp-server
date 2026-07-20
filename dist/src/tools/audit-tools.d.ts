/**
 * @fileoverview Enterprise audit MCP tools — query audit logs and export to SIEM
 * @module @skillsmith/mcp-server/tools/audit-tools
 * @see SMI-3894: Tier feature gap remediation (Wave 3)
 *
 * Bridges the existing EnterpriseAuditLogger backend to MCP tool handlers.
 * Uses dynamic import() for @smith-horn/enterprise (optional peer dependency)
 * to avoid crashing the MCP server for community users.
 *
 * Tier gate: Enterprise (audit_logging / siem_export feature flags).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const auditExportInputSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    eventType: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
}, {
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
}>;
export type AuditExportInput = z.infer<typeof auditExportInputSchema>;
export declare const auditQueryInputSchema: z.ZodObject<{
    actor: z.ZodOptional<z.ZodString>;
    resource: z.ZodOptional<z.ZodString>;
    eventType: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodEnum<["success", "failure", "warning"]>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    result?: "warning" | "success" | "failure" | undefined;
    resource?: string | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
    actor?: string | undefined;
}, {
    result?: "warning" | "success" | "failure" | undefined;
    resource?: string | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
    actor?: string | undefined;
}>;
export type AuditQueryInput = z.infer<typeof auditQueryInputSchema>;
export declare const siemExportInputSchema: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
    format: z.ZodOptional<z.ZodEnum<["json", "syslog", "cef"]>>;
}, "strip", z.ZodTypeAny, {
    format?: "json" | "syslog" | "cef" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    format?: "json" | "syslog" | "cef" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
export type SiemExportInput = z.infer<typeof siemExportInputSchema>;
export declare const auditExportToolSchema: {
    name: "audit_export";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            startDate: {
                type: string;
                description: string;
            };
            endDate: {
                type: string;
                description: string;
            };
            eventType: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
        };
    };
};
export declare const auditQueryToolSchema: {
    name: "audit_query";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            actor: {
                type: string;
                description: string;
            };
            resource: {
                type: string;
                description: string;
            };
            eventType: {
                type: string;
                description: string;
            };
            result: {
                type: string;
                enum: string[];
                description: string;
            };
            startDate: {
                type: string;
                description: string;
            };
            endDate: {
                type: string;
                description: string;
            };
            limit: {
                type: string;
                description: string;
            };
        };
    };
};
export declare const siemExportToolSchema: {
    name: "siem_export";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            startDate: {
                type: string;
                description: string;
            };
            endDate: {
                type: string;
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
export declare const executeAuditExport: (input: {
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
}, toolContext: ToolContext) => Promise<{
    events: unknown[];
    total: number;
    returned: number;
}>;
export declare const executeAuditQuery: (input: {
    result?: "warning" | "success" | "failure" | undefined;
    resource?: string | undefined;
    limit?: number | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
    eventType?: string | undefined;
    actor?: string | undefined;
}, toolContext: ToolContext) => Promise<{
    events: unknown[];
    total: number;
    returned: number;
}>;
export declare const executeSiemExport: (input: {
    format?: "json" | "syslog" | "cef" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, toolContext: ToolContext) => Promise<{
    events: unknown[];
    total: number;
    format: "json" | "syslog" | "cef";
    exportedAt: string;
}>;
//# sourceMappingURL=audit-tools.d.ts.map