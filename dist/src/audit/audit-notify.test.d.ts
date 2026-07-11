/**
 * @fileoverview Tests for the continuous-audit digest push orchestrator
 *               (SMI-5541 Wave 2C Stage 2).
 * @module @skillsmith/mcp-server/audit/audit-notify.test
 *
 * `buildAuditDigestPayload` is pure — tested against fixtures directly.
 * `maybeAutoNotifyAudit` is tested with `@skillsmith/core` (state/push/throttle)
 * and the local `runSecurityAudit` mocked, so we assert the guard order,
 * dedup, consent-passthrough, and the never-throws contract.
 */
export {};
//# sourceMappingURL=audit-notify.test.d.ts.map