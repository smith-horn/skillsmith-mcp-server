/**
 * @fileoverview Domain types for `sso-tools.ts` — shared by the stub, the live service, and the
 * handlers, none of which may import each other for these types (see each file's own header for
 * why: `sso-tools.ts` imports `createLiveSSOService` from `sso-tools.live.ts`, so the reverse
 * import would be circular at the type level; splitting types out here — mirroring
 * `rbac-tools.types.ts`'s split from `rbac-tools.ts`/`rbac-tools.live.ts` — removes the question
 * entirely rather than relying on `import type` erasure to make a circular edge harmless).
 * @module @skillsmith/mcp-server/tools/sso-tools.types
 * @see SMI-3900: SSO/SAML Configuration MCP Tools (original flat `SSOConfig` shape)
 * @see SMI-6204 (Wave 3 of SMI-6200): `SsoDomainClaim`/`SsoDomainVerification`, and the
 *      `remove()`/`claimDomain()`/`verifyDomain()` additions to `SSOConfigService`
 */
export {};
//# sourceMappingURL=sso-tools.types.js.map