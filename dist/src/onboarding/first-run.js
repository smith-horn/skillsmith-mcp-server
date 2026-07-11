/**
 * SMI-911: First Run Detection and Tier 1 Skill Auto-Installation
 *
 * Detects first run of Skillsmith MCP server and provides:
 * - First run detection via marker file
 * - Tier 1 skills list for auto-installation
 * - Welcome message formatting
 *
 * Tier 1 skills (SMI-5582):
 *
 * The original list hardcoded four `anthropic/*` registry IDs
 * (anthropic/varlock, anthropic/commit, anthropic/skill-builder,
 * anthropic/governance) that have never existed in the live skills
 * registry, causing first-run auto-install to fail for ~100% of real
 * users. These have been replaced with real, verified-tier, published
 * substitutes from the `getsentry/skills` registry
 * (https://github.com/getsentry/skills):
 * - skill-writer (score: 92) - Custom skill creation (substitute for skill-builder)
 * - commit (score: 86) - Git workflow
 * - code-review (score: 86) - Code quality (substitute for governance)
 *
 * `varlock` has no suitable registry substitute and is handled
 * separately as a bundled first-party asset rather than a registry
 * lookup — it is intentionally not represented here.
 */
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
/**
 * Skillsmith configuration directory
 */
export const SKILLSMITH_DIR = join(homedir(), '.skillsmith');
/**
 * Marker file indicating first run is complete
 */
export const FIRST_RUN_MARKER = join(SKILLSMITH_DIR, '.first-run-complete');
/**
 * Tier 1 skills to auto-install on first run
 *
 * These are the highest-value, lowest-friction skills identified
 * in the skill prioritization research.
 */
export const TIER1_SKILLS = [
    { id: 'getsentry/skill-writer', name: 'skill-writer', score: 92 },
    { id: 'getsentry/commit', name: 'commit', score: 86 },
    { id: 'getsentry/code-review', name: 'code-review', score: 86 },
];
/**
 * Check if this is the first run of Skillsmith
 *
 * First run is detected by the absence of the marker file
 * at ~/.skillsmith/.first-run-complete
 *
 * @returns true if this is the first run, false otherwise
 */
export function isFirstRun() {
    return !existsSync(FIRST_RUN_MARKER);
}
/**
 * Mark first run as complete
 *
 * Creates the marker file at ~/.skillsmith/.first-run-complete
 * with the current timestamp. Also ensures the .skillsmith
 * directory exists.
 */
export function markFirstRunComplete() {
    if (!existsSync(SKILLSMITH_DIR)) {
        mkdirSync(SKILLSMITH_DIR, { recursive: true });
    }
    writeFileSync(FIRST_RUN_MARKER, new Date().toISOString());
}
/**
 * Render the first-run welcome message from structured skill info.
 *
 * SMI-5573: this is the canonical formatter. Registry skills carry an
 * `attribution` (rendered as `name (by author)`) so third-party authorship is
 * disclosed in the response the user actually sees; bundled first-party skills
 * render as a bare `name`.
 *
 * @param skills - Installed skills to list (bundled first, registry after).
 * @returns Formatted welcome message.
 */
export function formatWelcomeMessage(skills) {
    const skillList = skills
        .map((s) => (s.attribution ? `  - ${s.name} (by ${s.attribution})` : `  - ${s.name}`))
        .join('\n');
    return `
Welcome to Skillsmith!

Essential skills installed:
${skillList}

Try: "Write a commit message" to see the commit skill in action.
`.trim();
}
/**
 * Generate welcome message after first run setup.
 *
 * Backwards-compatible string[] entrypoint — delegates to
 * {@link formatWelcomeMessage} treating every entry as a first-party
 * (unattributed) skill. New call sites that have attribution should call
 * `formatWelcomeMessage` directly.
 *
 * @param installedSkills - List of skill names that were installed
 * @returns Formatted welcome message
 */
export function getWelcomeMessage(installedSkills) {
    return formatWelcomeMessage(installedSkills.map((name) => ({ name })));
}
//# sourceMappingURL=first-run.js.map