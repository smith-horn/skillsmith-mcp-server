/**
 * SMI-XXXX: Install Bundled Assets on First Run
 *
 * Installs the skillsmith skill and user documentation
 * from the npm package's bundled assets.
 */
/**
 * Install bundled skills from package assets
 *
 * Copies skills from src/assets/skills/ to ~/.claude/skills/
 *
 * @returns Array of installed skill names
 */
export declare function installBundledSkills(): string[];
/**
 * Install user documentation to ~/.skillsmith/docs/
 *
 * @returns true if docs were installed, false otherwise
 */
export declare function installUserDocs(): boolean;
/**
 * Get path to user guide for --docs flag
 *
 * @returns Path to USER_GUIDE.md if it exists, undefined otherwise
 */
export declare function getUserGuidePath(): string | undefined;
//# sourceMappingURL=install-assets.d.ts.map