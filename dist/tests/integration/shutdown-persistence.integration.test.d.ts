/**
 * @fileoverview SMI-5639 Wave 2 Step 3 — exact-repro integration test (no subprocess).
 *
 * Reproduces the original bug end-to-end, in-process: install a real skill
 * (via the actual `installSkill()` flow, network mocked per the
 * `install.execution.integration.test.ts` pattern) whose SKILL.md genuinely
 * references `mcp__*` tools, so dependency intelligence is written to
 * `skill_dependencies` through the real `SkillInstallationService` ->
 * `SkillDependencyRepository` path. Then invoke the REAL
 * `createShutdownTrigger`/`closeDbOnShutdown` exports from `shutdown.ts`
 * (not a reimplementation) against a real temp-file WASM (`sql.js`) database,
 * and open a FRESH connection to the same file afterward to prove the write
 * actually survived the close — this is the exact scenario SMI-5639
 * describes: before the fix, nothing in the shutdown path ever called
 * `db.close()`, so this assertion would fail (0 rows) against the
 * unpatched `shutdown.ts`.
 */
export {};
//# sourceMappingURL=shutdown-persistence.integration.test.d.ts.map