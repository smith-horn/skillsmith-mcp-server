/**
 * @fileoverview Pin the advisory → quarantine linkage for skill_rescan.
 * @see SMI-5358: GAP gap-fix — rescan must create QuarantineRepository entries
 *               when security findings exceed the quarantine threshold.
 *
 * Regression-catch: if executeSkillRescan stops writing quarantine entries for
 * over-threshold findings, these tests fail on real DB state (not mocks).
 */
export {};
//# sourceMappingURL=skill-rescan-quarantine.test.d.ts.map