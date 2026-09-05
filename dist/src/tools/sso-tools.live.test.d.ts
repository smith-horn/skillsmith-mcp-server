/**
 * @fileoverview Live SSO service tests — fetch() mapping, not RPC mapping
 * @see SMI-6204 Wave 3: `createLiveSSOService()` (`sso-tools.live.ts`)
 *
 * Mirrors `rbac-tools.live.test.ts`'s structure (hoisted fake JWT, `vi.mock` of
 * `./team-resolver.js`, a scripted transport double) but the transport is `global.fetch`, not a
 * Supabase `.rpc()` client — `team-sso-manage` is an edge function, called over HTTP
 * (`packages/core/src/sync/inventory-client.test.ts` is the fetch-mocking convention this file
 * follows: `vi.stubGlobal('fetch', fetchMock)` + a `jsonResponse()` helper).
 *
 * These are passthrough / mapping tests: every status-code branch in `sso-tools.live.ts`'s
 * `throwMappedError()` is exercised once, plus the success-path GoTrue -> flat `SSOConfig`
 * mapping, plus the explicit "never leak GoTrue's own raw fields" property — `SsoErrorBody` only
 * ever reads `error`/`message`/`domain`/`record_name`/`record_type`/`record_value`, never GoTrue's
 * own `msg`/`error_code` field names, so a response carrying both cannot leak the GoTrue-native
 * ones by construction. The test below proves that structurally rather than by convention.
 */
export {};
//# sourceMappingURL=sso-tools.live.test.d.ts.map