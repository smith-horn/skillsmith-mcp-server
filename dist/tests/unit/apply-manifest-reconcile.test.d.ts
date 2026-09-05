/**
 * @fileoverview Unit tests for SMI-6343 Wave 4 — `apply_manifest_reconcile`
 *               MCP tool.
 * @module @skillsmith/mcp-server/tests/unit/apply-manifest-reconcile
 *
 * Plan: docs/internal/implementation/smi-6343-manifest-hygiene.md
 * ("4. Reconciliation tool (Wave 4 ...)").
 *
 * Pattern: real fs against the sandboxed HOME `vitest.setup.ts` already
 * establishes for this file's run (see that file + `skill-manifest.ts`'s
 * `assertNotRealUserHome` doc comment) — `MANIFEST_PATH`/`SKILLSMITH_DIR`
 * (`install.types.ts`) are frozen module-level consts computed against
 * THAT sandbox, so every test in this file shares one manifest location
 * and resets it in `beforeEach` rather than mutating `process.env.HOME`
 * per test (which would NOT reach those frozen consts). Only the live
 * registry lookup (`install.helpers.js`'s `lookupSkillFromRegistry`) is
 * mocked — everything else (ManifestManager locking, the ledger, the
 * `createProseBackup` backup step) runs against real files, matching this
 * repo's `apply-namespace-rename.test.ts` / `undo-apply.test.ts` precedent.
 */
export {};
//# sourceMappingURL=apply-manifest-reconcile.test.d.ts.map