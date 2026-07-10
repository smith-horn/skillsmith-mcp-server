/**
 * @fileoverview Private registry MCP tools for enterprise skill management
 * @module @skillsmith/mcp-server/tools/registry-tools
 * @see SMI-3902: Private Registry MCP Tools
 * @see ADR-115: Private Registry Architecture
 *
 * Enables enterprise teams to publish and manage skills in a private registry
 * scoped to their organization. Metadata lives in Supabase with team-scoped
 * RLS; tarballs are stored in S3-compatible object storage.
 *
 * Tier gate: Enterprise (private_registry feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const privateRegistryPublishInputSchema: z.ZodObject<{
    skillId: z.ZodString;
    version: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    skillId: string;
    description?: string | undefined;
}, {
    version: string;
    skillId: string;
    description?: string | undefined;
}>;
export type PrivateRegistryPublishInput = z.infer<typeof privateRegistryPublishInputSchema>;
export declare const privateRegistryManageInputSchema: z.ZodObject<{
    action: z.ZodEnum<["list", "get", "deprecate", "undeprecate"]>;
    skillId: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "get" | "deprecate" | "undeprecate";
    version?: string | undefined;
    skillId?: string | undefined;
}, {
    action: "list" | "get" | "deprecate" | "undeprecate";
    version?: string | undefined;
    skillId?: string | undefined;
}>;
export type PrivateRegistryManageInput = z.infer<typeof privateRegistryManageInputSchema>;
export declare const privateRegistryPublishToolSchema: {
    name: "private_registry_publish";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillId: {
                type: string;
                description: string;
            };
            version: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const privateRegistryManageToolSchema: {
    name: "private_registry_manage";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            skillId: {
                type: string;
                description: string;
            };
            version: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export interface RegistrySkill {
    skillId: string;
    version: string;
    description: string | null;
    deprecated: boolean;
    publishedAt: string;
    publishedBy: string;
    registryUrl: string;
}
export interface PrivateRegistryPublishResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skill?: RegistrySkill;
    message?: string;
    error?: string;
}
export interface PrivateRegistryManageResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skills?: RegistrySkill[];
    skill?: RegistrySkill;
    message?: string;
    error?: string;
}
export interface PrivateRegistryService {
    publish(teamId: string, skillId: string, version: string, description?: string): Promise<RegistrySkill>;
    list(teamId: string, version?: string): Promise<RegistrySkill[]>;
    get(teamId: string, skillId: string, version?: string): Promise<RegistrySkill | null>;
    deprecate(teamId: string, skillId: string): Promise<boolean>;
    undeprecate(teamId: string, skillId: string): Promise<boolean>;
}
/** @internal Exported for testing */
export declare function createStubRegistryService(): PrivateRegistryService;
/** Replace the registry service implementation (for testing or production swap) */
export declare function setPrivateRegistryService(svc: PrivateRegistryService): void;
/** Get the current registry service instance */
export declare function getPrivateRegistryService(): PrivateRegistryService;
export declare const executePrivateRegistryPublish: (input: {
    version: string;
    skillId: string;
    description?: string | undefined;
}, _context: ToolContext) => Promise<PrivateRegistryPublishResult>;
export declare const executePrivateRegistryManage: (input: {
    action: "list" | "get" | "deprecate" | "undeprecate";
    version?: string | undefined;
    skillId?: string | undefined;
}, _context: ToolContext) => Promise<PrivateRegistryManageResult>;
//# sourceMappingURL=registry-tools.d.ts.map