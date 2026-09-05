/**
 * @fileoverview Live SSO configuration service — `team-sso-manage` edge-function client
 * @module @skillsmith/mcp-server/tools/sso-tools.live
 * @see SMI-6204 (Wave 3 of SMI-6200): real SSO configuration over the Supabase Auth Admin SSO API
 * @see docs/internal/implementation/smi-6200-enterprise-rbac-sso-real-implementation.md, Wave 3
 *      Step 2 (`team-sso-manage`) and Step 4 (this file), including the 2026-08-28 design-review
 *      corrections block
 *
 * MECHANISM: `fetch()`, not `.rpc()` — unlike `rbac-tools.live.ts`. `team-sso-manage` is a
 * gateway-JWT-verified edge function that wraps GoTrue's Auth Admin SSO API using the FUNCTION's
 * own service-role key; the MCP server never holds that key (SMI-6109's entire point — see
 * `registry-tools.live.ts`'s header for the "documented, live threat vector" framing this design
 * avoids repeating). This file follows `packages/core/src/sync/inventory-client.ts:108-127` as the
 * calling pattern: resolve a bearer token via one of `sso-tools.live.auth.ts`'s two named getters,
 * `fetch()` the edge function, map the response to a typed error or a domain result.
 *
 * ERROR MAPPING is an allowlist, not a passthrough — matching `team-permission-error.ts`'s own
 * convention and this plan's explicit finding that "GoTrue's duplicate-domain error message leaks
 * another team's provider UUID." Every status code below maps to exactly one typed error class,
 * and GoTrue's own raw text NEVER reaches a caller: the 40x branches use only the edge function's
 * OWN authored `message` field (never GoTrue's), and the 500/502/503 branch is a single fixed
 * sentence with no server-supplied text of any kind.
 *
 * `SET|GET`'s response shape (`GoTrueSamlProviderResponse`) matches the nested GoTrue provider
 * shape verbatim (`{ id, disabled, saml: { entity_id, metadata_xml, metadata_url,
 * attribute_mapping, name_id_format }, domains: [{ domain }], created_at, updated_at }`) and is
 * mapped down into the existing flat `SSOConfig` (`sso-tools.types.ts`) at {@link mapProviderToConfig} —
 * see that function's own comment for why the shared interface stays flat rather than being
 * reshaped to match GoTrue everywhere.
 *
 * AUTHORED CONTRACT, NOT A COPY OF THE EDGE FUNCTION'S OWN CODE. `team-sso-manage` is built by a
 * different wave/agent working in `supabase/functions/`; this file was written from the Wave 3
 * plan doc's Step 2 (which fixes the error-body shapes exactly — see {@link SsoErrorBody} — and
 * the GoTrue response shape given in this task) but the plan doc does not fix byte-exact SUCCESS
 * request/response field names for `set`/`get`/`claim_domain`/`verify_domain` beyond that. The
 * names chosen below (`metadataUrl`, `entityId`, `recordName`/`recordType`/`recordValue`, etc.)
 * are this file's own authored choice and MUST be cross-checked against `team-sso-manage`'s actual
 * implementation before this wave ships — a contract mismatch here would compile and pass every
 * unit test in this file (which mocks `fetch()`) while failing integration silently.
 */
import type { SSOConfigService } from './sso-tools.types.js';
export { SsoAuthError, SsoValidationError, SsoDomainNotVerifiedError, SsoDomainClaimedByAnotherTeamError, SsoDomainVerificationFailedError, SsoDomainNotClaimedError, SsoExpireUnavailableError, SsoServiceUnavailableError, } from './sso-tools.live.errors.js';
export type { SsoDomainNotVerifiedDetails } from './sso-tools.live.errors.js';
/**
 * Create a live, `team-sso-manage`-backed SSOConfigService. Every method resolves a user-bound
 * bearer token via one of `sso-tools.live.auth.ts`'s two named getters, `fetch()`s exactly one
 * request, and maps the response — the authorization decision (`team:manage_sso`) and the GoTrue
 * call are both made entirely inside the edge function, never re-implemented here. No client-side
 * audit write, mirroring `rbac-tools.live.ts`'s own "NO CLIENT-SIDE AUDIT WRITE" convention: the
 * edge function writes its own `audit_logs` row per request (Wave 3 plan doc, Step 2, item 6).
 */
export declare function createLiveSSOService(): SSOConfigService;
//# sourceMappingURL=sso-tools.live.d.ts.map