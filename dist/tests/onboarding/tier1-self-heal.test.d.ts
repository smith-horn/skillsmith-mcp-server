/**
 * SMI-5582: Tier-1 Self-Heal Unit Tests
 *
 * Tests for `maybeInstallMissingTier1Skills()` and its supporting status-file
 * helpers in `src/onboarding/tier1-self-heal.ts`. `installSkill` is mocked so
 * no real network/GitHub calls happen; `setPendingWelcome` is mocked so we can
 * assert on what it was called with without exercising the full welcome
 * middleware (covered by its own suite at `src/middleware/first-run-welcome.test.ts`).
 *
 * Follows the same real-filesystem save/restore-in-`finally` idiom as
 * `first-run.test.ts` uses for `FIRST_RUN_MARKER`, applied here to
 * `TIER1_STATUS_FILE` (both live under the real `~/.skillsmith` directory —
 * see `SKILLSMITH_DIR` in `first-run.ts`).
 */
export {};
//# sourceMappingURL=tier1-self-heal.test.d.ts.map