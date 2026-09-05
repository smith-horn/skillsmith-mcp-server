/**
 * @fileoverview SMI-5479 additions to the telemetry consent gate — split
 * from `telemetry-consent.test.ts` to stay under the `audit:standards`
 * 500-line file gate (that file already covered the SMI-5019 W2 surface;
 * this sibling covers the SMI-5479 Step-3 additions: consent-cache
 * eviction-on-rejection, the once-per-process prompt primitives, and the
 * reference-identity contract `call-tool-handler.ts`'s `maybeAnnotate`
 * relies on).
 *
 * SMI-6362 §3/B-6 rewired the real `fetchConsentState` from a direct
 * Supabase query to a POST against the `telemetry-consent` edge function —
 * mocking style now matches the sibling `telemetry-consent.test.ts`:
 * `@skillsmith/core` mocked at module scope, global `fetch` stubbed per
 * test. `_resetConsentCacheForTests()` runs in `beforeEach`/`afterEach` so
 * every test starts with an empty process-level cache AND an empty
 * `promptedIds` set (SMI-5479 folded the latter into the same reset
 * helper).
 */
export {};
//# sourceMappingURL=telemetry-consent-gate.test.d.ts.map