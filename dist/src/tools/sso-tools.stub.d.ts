/**
 * @fileoverview In-memory stub SSOConfigService — used whenever Supabase isn't configured
 * @module @skillsmith/mcp-server/tools/sso-tools.stub
 * @see SMI-3900: SSO/SAML Configuration MCP Tools (original stub)
 * @see SMI-6184: `simulated: true` / honest wording convention — the stub must never claim to
 *      have contacted a real IdP or DNS provider
 * @see SMI-6204 (Wave 3 of SMI-6200): `remove()`'s `memberDisposition` parameter and the new
 *      `claimDomain()`/`verifyDomain()` methods, added to match the live service's interface
 *
 * Split out of `sso-tools.ts` (mirroring `rbac-tools.stub.ts`'s split from `rbac-tools.ts`) to
 * keep that file under the 500-line `audit:standards` budget once Wave 3 added the live service,
 * the two new domain-claim actions, and their error mapping.
 */
import type { SSOConfigService } from './sso-tools.types.js';
/** @internal Exported for testing */
export declare function createStubSSOService(): SSOConfigService;
//# sourceMappingURL=sso-tools.stub.d.ts.map