/**
 * @fileoverview Tests for the extracted CallTool request handler (SMI-5479 Step 3).
 *
 * T1 — dispatch-level emission gate on/off, driven end-to-end through
 *      `handleCallToolRequest` (real `dispatchToolCall`), plus the
 *      late-binding deps pin (plan pass-2 trap).
 * T4 — per-tool emission smoke, parametrized over all 18 newly-emitting
 *      tools (12 agent-profile + 6 non-profile).
 * Plus: once-per-process consent annotation (Option A), error envelopes
 *      never annotated, `inventory_push` prose-body fail-open no-annotate.
 *
 * First-run welcome message annotation (SMI-5573/5582) coverage — one-shot
 * delivery, error envelopes never consuming the pending message, and
 * composition with the consent annotator on the same response — lives in
 * the sibling call-tool-handler.welcome.test.ts (split out to stay under
 * the 500-line/file cap).
 *
 * Observation seam (plan pass-2, matches
 * `middleware/__tests__/license.gate.test.ts`'s T2 block): `wrap.ts` (inside
 * `@skillsmith/core`) calls its own module-local `./posthog.js` binding, so
 * `vi.mock('@skillsmith/core/telemetry')` from this package cannot intercept
 * it. Initialize a REAL PostHog client with a test key and spy directly on
 * the resulting instance's `capture` method.
 *
 * Fixture note: several of the 18 tools touch the real filesystem read-only
 * (`uninstall_skill`, `skill_outdated`, `skill_rescan` read manifest /
 * skills-dir state under the real home directory — there is no override for
 * `getConfigDir()`). This is acceptable per the plan ("any routed outcome
 * that reaches the withTelemetry wrapper counts") — these are read-only,
 * fail gracefully on a "not found" outcome regardless of what's on disk, and
 * every OTHER tool that DOES expose an override (`homeDir`, `skillsDir`,
 * `project_path`) is pointed at `os.tmpdir()` to stay filesystem-isolated.
 * `apiClient` is constructed with `offlineMode: true` (via
 * `createTestDatabase()`) and every network-capable tool here
 * (`search`/`get_skill`/`install_skill`) checks `apiClient.isOffline()`
 * before making a live call, so none of these tests touch the network.
 */
export {};
//# sourceMappingURL=call-tool-handler.test.d.ts.map