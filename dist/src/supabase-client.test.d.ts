/**
 * @fileoverview supabase-client.ts's test-time production-fallback guard (SMI-6622 round 2)
 * @see SMI-6622: an adversarial-review probe recorded real `resolve_team_from_license` POSTs
 *      reaching the hardcoded prod URL from an unmocked test run — `getSupabaseClient()`/
 *      `getSupabaseUserClient()`'s anon-key fallback (SMI-6109) had no guard against a test
 *      silently dialing production. This file exercises the REAL (unmocked) module directly —
 *      every other supabase-client.js consumer's tests mock it wholesale, so none of them would
 *      have caught a regression here.
 *
 * `process.env.VITEST` is `'true'` for this whole file/process (Vitest sets it) — "outside the
 * test runner" is simulated per-test by deleting it, then restored in `afterEach` so later tests
 * (and other files sharing a worker under `--no-isolate`, if ever enabled) see the real value.
 */
export {};
//# sourceMappingURL=supabase-client.test.d.ts.map