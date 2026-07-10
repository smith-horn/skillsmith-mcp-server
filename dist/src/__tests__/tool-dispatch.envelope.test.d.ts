/**
 * @fileoverview Validation-envelope tests for dispatchToolCall (SMI-4313).
 *
 * Separate from `tool-dispatch.test.ts` (SMI-3913 comingSoon coverage) to
 * keep each file focused and under the 500-line gate. Covers the 9 direct
 * dispatch sites plus the gated `withLicenseAndQuota` path. Bogus payloads
 * short-circuit before any tool context is touched, so `{} as ToolContext`
 * is sufficient here — the dispatcher returns the structured envelope
 * before calling into any handler.
 */
export {};
//# sourceMappingURL=tool-dispatch.envelope.test.d.ts.map