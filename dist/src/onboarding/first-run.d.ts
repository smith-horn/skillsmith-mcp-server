/**
 * SMI-911: First Run Detection and Tier 1 Skill Auto-Installation
 *
 * Detects first run of Skillsmith MCP server and provides:
 * - First run detection via marker file
 * - Tier 1 skills list for auto-installation
 * - Welcome message formatting
 *
 * Tier 1 skills (from research doc):
 * - varlock (score: 95) - Security foundation
 * - commit (score: 92) - Git workflow
 * - governance (score: 88) - Code quality
 * - skill-builder (score: 90) - Custom skill creation
 */
/**
 * Skillsmith configuration directory
 */
export declare const SKILLSMITH_DIR: string;
/**
 * Marker file indicating first run is complete
 */
export declare const FIRST_RUN_MARKER: string;
/**
 * Tier 1 skill definition
 */
export interface Tier1Skill {
    /** Full skill ID (e.g., 'anthropic/varlock') */
    id: string;
    /** Short name for display */
    name: string;
    /** Quality score from research (0-100) */
    score: number;
}
/**
 * Tier 1 skills to auto-install on first run
 *
 * These are the highest-value, lowest-friction skills identified
 * in the skill prioritization research.
 */
export declare const TIER1_SKILLS: readonly Tier1Skill[];
/**
 * Check if this is the first run of Skillsmith
 *
 * First run is detected by the absence of the marker file
 * at ~/.skillsmith/.first-run-complete
 *
 * @returns true if this is the first run, false otherwise
 */
export declare function isFirstRun(): boolean;
/**
 * Mark first run as complete
 *
 * Creates the marker file at ~/.skillsmith/.first-run-complete
 * with the current timestamp. Also ensures the .skillsmith
 * directory exists.
 */
export declare function markFirstRunComplete(): void;
/**
 * Generate welcome message after first run setup
 *
 * @param installedSkills - List of skill names that were installed
 * @returns Formatted welcome message
 */
export declare function getWelcomeMessage(installedSkills: string[]): string;
//# sourceMappingURL=first-run.d.ts.map