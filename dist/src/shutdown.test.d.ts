/**
 * @fileoverview Tests for flush-on-shutdown wiring (SMI-5479 Step 3, pass 2).
 *
 * `shutdown.ts` has no top-level side effects (unlike `index.ts`, which runs
 * `main().catch(...)` at module scope), so it can be imported directly.
 *
 * Observation seam: same as `call-tool-handler.test.ts` /
 * `middleware/__tests__/license.gate.test.ts`'s T2 block — a real PostHog
 * client with a test key, `shutdownPostHog` spied directly (not the
 * `capture` method here — this suite tests the shutdown TIMING contract, not
 * emission).
 */
export {};
//# sourceMappingURL=shutdown.test.d.ts.map