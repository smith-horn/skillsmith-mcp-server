/**
 * SMI-5018 W2.S3 — MCP-tree telemetry coverage snapshot test.
 *
 * Scope: `packages/mcp-server/src/tools/` only (v1).
 * CLI + VS Code trees are NOT checked here — they are blocked by SMI-5040
 * (anonymous-closure incompatibility). When SMI-5040 lands this test will
 * be extended to cover those trees.
 *
 * Risk guarded (plan line 798, risk #8):
 *   "A new dispatcher ships without a telemetry wrap."
 *
 * Strategy: explicit allowlist (40 entries) cross-checked against the live
 * withTelemetry import-site count. Allowlist chosen over heuristic-walk
 * because it is trivially auditable — each entry maps 1-to-1 to a
 * `grep "= withTelemetry"` result, and the SOURCE_FILE_COUNT sentinel
 * independently guards against drift in either direction.
 *
 * When you add a new dispatcher:
 *   1. Wrap it with withTelemetry in its source file (as SMI-5017 did).
 *   2. Add its export name to EXPECTED_DISPATCHERS below.
 *   3. Update SOURCE_FILE_COUNT if the dispatcher lives in a new file.
 * The test will fail in CI until all three steps are done.
 */
export {};
//# sourceMappingURL=telemetry-coverage.test.d.ts.map