/**
 * Unit tests for SMI-4587 Wave 1 PR #3 — semantic-overlap pass,
 * audit-mode dispatch (resolver + 'off' short-circuit), and unmanaged-
 * skill bootstrap. Split from `collision-detector.test.ts` to keep both
 * files under the 500-LOC pre-commit limit (SMI-3493).
 *
 * Latency-invariant tests in `semantic pass — preventative mode` spy on
 * `EmbeddingService.prototype.embed` AND `OverlapDetector.prototype.findAllOverlaps`
 * to assert zero invocations when the cheap mode is selected.
 */
export {};
//# sourceMappingURL=collision-detector.semantic.test.d.ts.map