/**
 * @fileoverview Enterprise SSO/SAML configuration MCP tools
 * @module @skillsmith/mcp-server/tools/sso-tools
 * @see SMI-3900: SSO/SAML Configuration MCP Tools
 *
 * SSO is scoped to config storage + validation only. Actual SAML/OIDC auth
 * flows are deferred to a Supabase edge function since local MCP servers
 * have no HTTP callback endpoint.
 *
 * Security: XML parsing and signature validation MUST be delegated to a
 * vetted SAML library. Custom SAML assertion parsing is prohibited.
 *
 * Tier gate: Enterprise (sso_saml feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const configureSsoInputSchema: z.ZodObject<{
    action: z.ZodEnum<["set", "test", "remove"]>;
    idpMetadataUrl: z.ZodOptional<z.ZodString>;
    idpEntityId: z.ZodOptional<z.ZodString>;
    protocol: z.ZodDefault<z.ZodOptional<z.ZodEnum<["saml", "oidc"]>>>;
}, "strip", z.ZodTypeAny, {
    action: "test" | "set" | "remove";
    protocol: "saml" | "oidc";
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
}, {
    action: "test" | "set" | "remove";
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
    protocol?: "saml" | "oidc" | undefined;
}>;
export type ConfigureSsoInput = z.infer<typeof configureSsoInputSchema>;
export declare const ssoSettingsInputSchema: z.ZodObject<{
    includeMetadata: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    includeMetadata: boolean;
}, {
    includeMetadata?: boolean | undefined;
}>;
export type SsoSettingsInput = z.infer<typeof ssoSettingsInputSchema>;
export declare const configureSsoToolSchema: {
    name: "configure_sso";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            idpMetadataUrl: {
                type: string;
                description: string;
            };
            idpEntityId: {
                type: string;
                description: string;
            };
            protocol: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
export declare const ssoSettingsToolSchema: {
    name: "sso_settings";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            includeMetadata: {
                type: string;
                description: string;
            };
        };
    };
};
export interface SSOConfig {
    protocol: 'saml' | 'oidc';
    idpMetadataUrl: string;
    idpEntityId: string;
    configuredAt: string;
    status: 'active' | 'inactive';
}
export interface SSOConfigService {
    set(config: {
        idpMetadataUrl: string;
        idpEntityId?: string;
        protocol: 'saml' | 'oidc';
    }): Promise<SSOConfig>;
    test(): Promise<{
        success: boolean;
        latencyMs: number;
        message: string;
    }>;
    remove(): Promise<boolean>;
    get(includeMetadata: boolean): Promise<SSOConfig | null>;
}
/** @internal Exported for testing */
export declare function createStubSSOService(): SSOConfigService;
/** Replace the SSO config service implementation (for testing or production swap) */
export declare function setSSOConfigService(svc: SSOConfigService): void;
/** Get the current SSO config service instance */
export declare function getSSOConfigService(): SSOConfigService;
export interface ConfigureSsoResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    config?: SSOConfig;
    test?: {
        success: boolean;
        latencyMs: number;
        message: string;
    };
    message?: string;
    error?: string;
}
export interface SsoSettingsResult {
    configured: boolean;
    dataSource: 'stub' | 'live';
    config?: SSOConfig;
    message: string;
}
export declare const executeConfigureSso: (input: {
    action: "test" | "set" | "remove";
    protocol: "saml" | "oidc";
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
}, _context: ToolContext) => Promise<ConfigureSsoResult>;
export declare const executeSsoSettings: (input: {
    includeMetadata: boolean;
}, _context: ToolContext) => Promise<SsoSettingsResult>;
//# sourceMappingURL=sso-tools.d.ts.map