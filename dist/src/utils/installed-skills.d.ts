/**
 * @fileoverview Utility for auto-detecting installed skills from ~/.claude/skills/
 * @module @skillsmith/mcp-server/utils/installed-skills
 * @see SMI-906: Auto-detect installed skills from ~/.claude/skills/
 *
 * Scans the user's skills directory and extracts skill IDs from SKILL.md files.
 * Falls back to folder name if no SKILL.md or no ID found in frontmatter.
 *
 * @example
 * const skills = await getInstalledSkills();
 * // Returns: ["docker", "linear", "varlock"]
 */
/**
 * Result from parsing a SKILL.md file
 */
interface SkillMdParsed {
    /** Skill ID from name field */
    id: string | null;
    /** Skill name from name field */
    name: string | null;
    /** Skill description from description field */
    description: string | null;
}
/**
 * Parse SKILL.md frontmatter to extract skill metadata.
 *
 * Extracts the `name` field from YAML frontmatter in SKILL.md files.
 * Frontmatter is delimited by `---` lines at the start of the file.
 *
 * @param content - Content of the SKILL.md file
 * @returns Parsed skill metadata, or null values if parsing fails
 *
 * @example
 * const content = `---
 * name: docker
 * description: Docker skill
 * ---
 * # Docker Skill`;
 * parseSkillMd(content); // { id: "docker", name: "docker", description: "Docker skill" }
 */
export declare function parseSkillMd(content: string): SkillMdParsed;
/**
 * Get the skill ID from a skill directory.
 *
 * Looks for SKILL.md in the directory and extracts the ID from frontmatter.
 * Falls back to the directory name if no SKILL.md or no ID found.
 *
 * @param skillDir - Path to the skill directory
 * @param dirName - Name of the directory (used as fallback)
 * @returns Skill ID
 */
export declare function getSkillIdFromDir(skillDir: string, dirName: string): string;
/**
 * Auto-detect installed skills from ~/.claude/skills/ directory.
 *
 * Scans the skills directory for subdirectories containing SKILL.md files.
 * Extracts the skill ID from the `name` field in SKILL.md frontmatter.
 * Falls back to directory name if no SKILL.md or no name field found.
 *
 * @param skillsDir - Optional custom skills directory path (defaults to ~/.claude/skills/)
 * @returns Promise resolving to array of skill IDs
 *
 * @example
 * const skills = await getInstalledSkills();
 * // Returns: ["docker", "linear", "varlock"]
 *
 * @example
 * // With custom directory
 * const skills = await getInstalledSkills('/path/to/custom/skills');
 */
export declare function getInstalledSkills(skillsDir?: string): Promise<string[]>;
/**
 * Synchronous version of getInstalledSkills for use in non-async contexts.
 *
 * @param skillsDir - Optional custom skills directory path (defaults to ~/.claude/skills/)
 * @returns Array of skill IDs
 */
export declare function getInstalledSkillsSync(skillsDir?: string): string[];
/**
 * Get detailed information about installed skills.
 *
 * Returns full parsed information from SKILL.md files, not just IDs.
 *
 * @param skillsDir - Optional custom skills directory path
 * @returns Array of skill information objects
 */
export interface InstalledSkillInfo {
    /** Skill ID (from name field or directory name) */
    id: string;
    /** Directory name */
    directory: string;
    /** Full path to skill directory */
    path: string;
    /** Whether SKILL.md was found */
    hasSkillMd: boolean;
    /** Description from SKILL.md if available */
    description: string | null;
}
export declare function getInstalledSkillsDetailed(skillsDir?: string): Promise<InstalledSkillInfo[]>;
export {};
//# sourceMappingURL=installed-skills.d.ts.map