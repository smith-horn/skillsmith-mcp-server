/**
 * @fileoverview Enterprise SSO/SAML configuration MCP tools — action-handler implementations
 * @module @skillsmith/mcp-server/tools/sso-tools.action
 * @see SMI-5127: the `*.action.ts` sibling convention for a tool/command file whose
 *      `withTelemetry`-wrapped action handlers push it over the 500-line audit:standards
 *      budget — this file holds the implementations, the wrapped exports, the service
 *      singleton, and the two result-shape interfaces; `sso-tools.ts` keeps the MCP tool
 *      registration, JSON/Zod schema, and re-exports (SMI-6200 Wave 4 Step 0 split, done
 *      mechanically ahead of Wave 4's new SSO surface landing in `sso-tools.ts` itself —
 *      the same split `rbac-tools.ts` got in the same pass). Precedent: `search.ts` /
 *      `search.action.ts` for CLI commands, and
 *      `supabase/functions/team-sso-manage/actions.config.ts` / `actions.config.query.ts`
 *      for the same shape one layer down (Wave 3).
 * @see SMI-3900: SSO/SAML Configuration MCP Tools
 * @see SMI-6204 (Wave 3 of SMI-6200): live `set`/`test`/`remove`/`claim_domain`/`verify_domain`
 *      over the `team-sso-manage` edge function (`sso-tools.live.ts`); `sso_settings` reads over
 *      the same function. Live/stub selection mirrors `rbac-tools.action.ts`'s
 *      `isSupabaseConfigured()` switch below.
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
import type { ToolContext } from '../context.js';
import type { SsoDomainNotVerifiedDetails } from './sso-tools.live.js';
import type { PermissionDeniedError } from './team-permission-error.js';
import type { SSOConfig, SSOConfigService, SsoDomainClaim, SsoDomainVerification } from './sso-tools.types.js';
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
        simulated?: boolean;
    };
    domainClaim?: SsoDomainClaim;
    domainVerification?: SsoDomainVerification;
    /**
     * Populated only when a `set` was refused because the domain is not yet verified — carries the
     * exact TXT record so the caller can act on it without re-parsing `error`. See
     * `sso-tools.live.ts`'s `SsoDomainNotVerifiedError`.
     */
    domainNotVerified?: SsoDomainNotVerifiedDetails;
    message?: string;
    /**
     * A structured permission refusal (same shape RBAC renders — `team-permission-error.ts`), or a
     * plain validation/transport string. Both render via `permissionErrorText()`.
     */
    error?: string | PermissionDeniedError;
}
export interface SsoSettingsResult {
    configured: boolean;
    dataSource: 'stub' | 'live';
    config?: SSOConfig;
    message: string;
    /**
     * A structured permission refusal (same shape RBAC/configure_sso render — `team-permission-
     * error.ts`), populated when `svc.get()` throws (SMI-6204 2026-08-28 adversarial review, M-2).
     * Mirrors `ConfigureSsoResult.error`.
     */
    error?: string | PermissionDeniedError;
}
export declare const executeConfigureSso: (input: {
    action: "test" | "set" | "remove" | "claim_domain" | "verify_domain";
    protocol: "saml" | "oidc";
    idpMetadataUrl?: string | undefined;
    idpEntityId?: string | undefined;
    domain?: string | undefined;
    memberDisposition?: "convert_to_manual" | undefined;
}, _context: ToolContext) => Promise<ConfigureSsoResult>;
export declare const executeSsoSettings: (input: {
    includeMetadata: boolean;
}, _context: ToolContext) => Promise<SsoSettingsResult>;
//# sourceMappingURL=sso-tools.action.d.ts.map