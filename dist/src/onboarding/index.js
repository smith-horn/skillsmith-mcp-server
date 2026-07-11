/**
 * SMI-911: Onboarding Module
 *
 * Exports first-run detection and Tier 1 skill auto-installation functionality.
 */
export { SKILLSMITH_DIR, FIRST_RUN_MARKER, TIER1_SKILLS, isFirstRun, markFirstRunComplete, getWelcomeMessage, formatWelcomeMessage, } from './first-run.js';
// SMI-5582: Tier-1 registry install + self-heal (state file, opt-out gate,
// fire-and-forget install/self-heal orchestration).
export { TIER1_STATUS_FILE, isTier1AutoInstallDisabled, readTier1Status, writeTier1Status, maybeInstallMissingTier1Skills, } from './tier1-self-heal.js';
//# sourceMappingURL=index.js.map