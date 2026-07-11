/**
 * @fileoverview First-run welcome message annotation tests (SMI-5573/5582).
 *
 * Split out of call-tool-handler.test.ts to stay under the 500-line/file
 * cap — this file covers ONLY the welcome-message annotator's wiring into
 * `handleCallToolRequest`: one-shot delivery, composition with the
 * pre-existing consent annotator on the same response, error envelopes
 * never consuming the pending message, and true no-op passthrough.
 *
 * `annotateResponseWithWelcome` (middleware/first-run-welcome.ts) is called
 * UNCONDITIONALLY in `call-tool-handler.ts`, ahead of the (success-only)
 * consent annotation — see the module doc there.
 *
 * Shared fixture/mocking setup below is duplicated from the sibling
 * call-tool-handler.test.ts (T1/T4/consent suite) rather than factored into
 * a shared helper, to keep each file's dependency graph self-contained.
 */
export {};
//# sourceMappingURL=call-tool-handler.welcome.test.d.ts.map