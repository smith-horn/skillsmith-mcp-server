/**
 * @fileoverview Unit tests for the `undo_apply` MCP tool
 *               (SMI-5456 Wave 1 Step 3 / SMI-5470).
 * @module @skillsmith/mcp-server/tests/unit/undo-apply
 *
 * Covers the remaining P-5 invariant named in
 * docs/internal/implementation/smi-5456-skillsmith-agent-wave1.md's
 * "Shared-State / Coordination Audit" table for `~/.skillsmith/journal`:
 * "Undo tool, ... session-scoped ... every record embeds previous hash".
 * The chain-verification and concurrent-write invariants live in
 * `@skillsmith/core`'s `src/journal/journal.test.ts`.
 *
 * Coverage:
 *   1. Round trip — apply via `apply_recommended_edit`, then `undo_apply`
 *      restores byte-identical content and journals the undo; a second
 *      undo with nothing left refuses cleanly.
 *   2. Refusal — the file was modified after apply (hash mismatch): undo
 *      refuses and leaves the file untouched (never clobbers user edits).
 *   3. Scope fence — a restore target that escapes the confined skill root
 *      via a symlink is refused (reuses the SMI-4287 root-confinement
 *      helper, `resolveSafeRealpath`); and (governance follow-up, SMI-5456)
 *      a bare `os.tmpdir()` target outside both HOME and the explicit
 *      `UNDO_SCOPE_TEST_ROOT_ENV_VAR` seam is refused — proves the fence
 *      has no blanket `os.tmpdir()` carve-out.
 *
 * Pattern for (1)/(2) mirrors `apply-recommended-edit.test.ts`: seed
 * `~/.skillsmith/audits/<auditId>/` directly with a fixture `RecommendedEdit`
 * so the test doesn't depend on the semantic-detection pipeline.
 */
export {};
//# sourceMappingURL=undo-apply.test.d.ts.map