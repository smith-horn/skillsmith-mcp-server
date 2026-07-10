/**
 * SMI-4588 Wave 2 PR #4 — install namespace integration tests (Step 7).
 *
 * Exercises the namespace surface bracketing `service.install()` in the
 * install hot path: ledger replay → pre-flight scan → mode gate, plus the
 * agent's two-step `apply_namespace_rename` recovery flow. Tests run
 * against a real filesystem rooted under `tmpdir()` with `HOME` overridden.
 * `scanLocalInventory` captures `os.homedir()` at module load, so the
 * scanner is mocked to forward `TEST_HOME` per call. Wave 4's
 * `apply_namespace_rename` MCP tool is stubbed via direct `applyRename`
 * invocation (per task brief).
 */
export {};
//# sourceMappingURL=install-namespace.integration.test.d.ts.map