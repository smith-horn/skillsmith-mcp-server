/**
 * @fileoverview SMI-5479 additions to the telemetry consent gate — split
 * from `telemetry-consent.test.ts` to stay under the `audit:standards`
 * 500-line file gate (that file already covered the SMI-5019 W2 surface;
 * this sibling covers the SMI-5479 Step-3 additions: consent-cache
 * eviction-on-rejection, the once-per-process prompt primitives, and the
 * reference-identity contract `call-tool-handler.ts`'s `maybeAnnotate`
 * relies on).
 *
 * Mocking style matches `telemetry-consent.test.ts` /
 * `analytics.supabase.service.test.ts`: `vi.mock('../supabase-client.js')`
 * at module scope, `vi.mocked(getSupabaseClient)` driven per test.
 * `_resetConsentCacheForTests()` runs in `beforeEach`/`afterEach` so every
 * test starts with an empty process-level cache AND an empty `promptedIds`
 * set (SMI-5479 folded the latter into the same reset helper).
 */
export {};
//# sourceMappingURL=telemetry-consent-gate.test.d.ts.map