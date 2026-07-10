/**
 * @fileoverview SMI-4590 Step 0b — audit-tool-dispatch regression tests
 * @module @skillsmith/mcp-server/tests/unit/audit-tool-dispatch
 *
 * Asserts the extracted dispatcher:
 * 1. Routes `skill_audit` and `skill_pack_audit` through `withLicenseAndQuota`
 *    (delegating to the same handlers as the pre-extraction parent).
 * 2. Throws `Unknown audit tool: <name>` for unrecognized names — the parent
 *    `tool-dispatch.ts` is responsible for routing predicate; this module
 *    refuses anything outside `AUDIT_TOOL_NAMES`.
 * 3. Exposes a stable `AUDIT_TOOL_NAMES` set + `isAuditToolName()` predicate.
 *
 * No behavioral change vs pre-Step-0b dispatch — handler bodies were moved,
 * not modified. This test pins that contract.
 */
export {};
//# sourceMappingURL=audit-tool-dispatch.test.d.ts.map