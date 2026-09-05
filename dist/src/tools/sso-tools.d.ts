/**
 * @fileoverview Enterprise SSO/SAML configuration MCP tools
 * @module @skillsmith/mcp-server/tools/sso-tools
 * @see SMI-3900: SSO/SAML Configuration MCP Tools
 * @see SMI-6204 (Wave 3 of SMI-6200): live `set`/`test`/`remove`/`claim_domain`/`verify_domain`
 *      over the `team-sso-manage` edge function (`sso-tools.live.ts`); `sso_settings` reads over
 *      the same function. Live/stub selection mirrors `rbac-tools.ts`'s
 *      `isSupabaseConfigured()` switch (now in `rbac-tools.action.ts`) below.
 * @see SMI-5127 / SMI-6200 Wave 4 Step 0: the action-handler implementations, the
 *      `withTelemetry`-wrapped exports, the service singleton, and the `ConfigureSsoResult`/
 *      `SsoSettingsResult` result shapes moved to the sibling `sso-tools.action.ts` (same
 *      500-line audit:standards budget split `rbac-tools.ts` got in the same pass — done
 *      mechanically ahead of Wave 4's own new SSO surface landing in this file) —
 *      re-exported below so every existing import site (index.ts, tool-dispatch.ts,
 *      sso-tools.test.ts, sso-tools.live.test.ts) reaches them unchanged. This file now
 *      holds only the MCP tool registration / Zod input schemas / JSON tool schemas and
 *      the public re-export surface.
 *
 * Actual SAML/OIDC auth flows are deferred to a Supabase edge function since local MCP servers
 * have no HTTP callback endpoint — this file (plus `sso-tools.live.ts`) is a management interface
 * over that function, not a SAML implementation.
 *
 * Security: XML parsing and signature validation MUST be delegated to a
 * vetted SAML library. Custom SAML assertion parsing is prohibited.
 *
 * Tier gate: Enterprise (sso_saml feature flag).
 */
import { z } from 'zod';
export type { SSOConfig, SSOConfigService, SsoDomainClaim, SsoDomainVerification, } from './sso-tools.types.js';
export { createStubSSOService } from './sso-tools.stub.js';
export declare const configureSsoInputSchema: z.ZodObject<{
    action: z.ZodEnum<["set", "test", "remove", "claim_domain", "verify_domain"]>;
    idpMetadataUrl: z.ZodOptional<z.ZodString>;
    idpEntityId: z.ZodOptional<z.ZodString>;
    protocol: z.ZodDefault<z.ZodOptional<z.ZodEnum<["saml", "oidc"]>>>;
    domain: z.ZodOptional<z.ZodString>;
    memberDisposition: z.ZodOptional<z.ZodEnum<["convert_to_manual"]>>;
}, "strip", z.ZodTypeAny, {
    action: "test" | "set" | "remove" | "claim_domain" | "verify_domain";
    protocol: "saml" | "oidc";
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
    domain?: string | undefined;
    memberDisposition?: "convert_to_manual" | undefined;
}, {
    action: "test" | "set" | "remove" | "claim_domain" | "verify_domain";
    protocol?: "saml" | "oidc" | undefined;
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
    domain?: string | undefined;
    memberDisposition?: "convert_to_manual" | undefined;
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
            domain: {
                type: string;
                description: string;
            };
            memberDisposition: {
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
export type { ConfigureSsoResult, SsoSettingsResult } from './sso-tools.action.js';
export { setSSOConfigService, getSSOConfigService, executeConfigureSso, executeSsoSettings, } from './sso-tools.action.js';
//# sourceMappingURL=sso-tools.d.ts.map