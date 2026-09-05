/**
 * @fileoverview Tests for the telemetry consent gate — SMI-5019 W2, rewired
 * by SMI-6362 §3/B-6 to POST to the `telemetry-consent` edge function
 * instead of querying `user_telemetry_preferences` directly keyed on a
 * (structurally unmatchable, per B-6) anonymous id.
 *
 * `@skillsmith/core`'s `getApiBaseUrl`/`getApiKey`/`resolveFreshAccessToken`
 * are mocked at module scope (matching `team-resolver.test.ts`'s
 * convention); the global `fetch` is stubbed per test.
 *
 * `_resetConsentCacheForTests()` is called in beforeEach so every test starts
 * with an empty process-level cache.
 */
export {};
//# sourceMappingURL=telemetry-consent.test.d.ts.map