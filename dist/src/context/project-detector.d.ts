/**
 * @fileoverview Project Context Detection for Skill Suggestions
 * @module @skillsmith/mcp-server/context/project-detector
 * @see SMI-912: Project context detection for skill suggestions
 *
 * Analyzes the user's project to detect technologies, frameworks, and tools
 * in use to provide contextual skill recommendations.
 *
 * @example
 * // Detect project context for the current working directory
 * const context = detectProjectContext();
 *
 * // Detect project context for a specific path
 * const context = detectProjectContext('/path/to/project');
 *
 * // Use context for skill suggestions
 * if (context.hasDocker) {
 *   suggestSkill('docker');
 * }
 */
/**
 * Validates that a path does not escape the allowed base directory.
 * Prevents path traversal attacks using sequences like '../'.
 *
 * @param inputPath - The path to validate (can be relative or absolute)
 * @param baseDir - The allowed base directory
 * @returns The resolved, sanitized absolute path
 * @throws Error if the path attempts to escape the base directory
 */
export declare function validatePath(inputPath: string, baseDir: string): string;
/**
 * Detected project context for skill recommendations
 */
export interface ProjectContext {
    /** Whether project uses Docker (Dockerfile or docker-compose) */
    hasDocker: boolean;
    /** Whether project is connected to Linear (detected from git config) */
    hasLinear: boolean;
    /** Whether project is hosted on GitHub */
    hasGitHub: boolean;
    /** Detected test framework (jest, vitest, mocha) */
    testFramework: 'jest' | 'vitest' | 'mocha' | null;
    /** Detected API framework (express, fastapi, nextjs) */
    apiFramework: 'express' | 'fastapi' | 'nextjs' | null;
    /** Whether project uses native modules (better-sqlite3, sharp, etc.) */
    hasNativeModules: boolean;
    /** Detected primary language */
    language: 'typescript' | 'javascript' | 'python' | null;
}
/**
 * Detect complete project context from filesystem analysis
 *
 * @param projectPath - Path to the project directory (defaults to cwd)
 * @param allowedBaseDir - Optional base directory to restrict path access (defaults to projectPath itself)
 * @returns Detected project context
 * @throws Error if projectPath attempts to escape the allowedBaseDir
 *
 * @example
 * const context = detectProjectContext('/path/to/project');
 * console.log(context.hasDocker); // true/false
 */
export declare function detectProjectContext(projectPath?: string, allowedBaseDir?: string): ProjectContext;
/**
 * Detect Docker usage in project
 *
 * Checks for:
 * - Dockerfile
 * - docker-compose.yml
 * - docker-compose.yaml
 *
 * @param path - Project path to check
 * @returns True if Docker is detected
 */
export declare function detectDocker(path: string): boolean;
/**
 * Detect Linear integration from git remote config
 *
 * Checks if any git remote references linear.app
 *
 * @param path - Project path to check
 * @returns True if Linear integration is detected
 */
export declare function detectLinear(path: string): boolean;
/**
 * Detect GitHub hosting from git remote config
 *
 * Checks if any git remote references github.com
 *
 * @param path - Project path to check
 * @returns True if GitHub hosting is detected
 */
export declare function detectGitHub(path: string): boolean;
/**
 * Detect test framework from package.json dependencies
 *
 * Checks for: vitest, jest, mocha (in priority order)
 *
 * @param path - Project path to check
 * @returns Detected test framework or null
 */
export declare function detectTestFramework(path: string): 'jest' | 'vitest' | 'mocha' | null;
/**
 * Detect API framework from package.json or requirements.txt
 *
 * Checks for: next (Next.js), express (Express), fastapi (FastAPI)
 *
 * @param path - Project path to check
 * @returns Detected API framework or null
 */
export declare function detectApiFramework(path: string): 'express' | 'fastapi' | 'nextjs' | null;
/**
 * Detect native module usage in package.json
 *
 * Checks for modules known to require native compilation:
 * better-sqlite3, sharp, canvas, bcrypt, onnxruntime-node, etc.
 *
 * @param path - Project path to check
 * @returns True if native modules are detected
 */
export declare function detectNativeModules(path: string): boolean;
/**
 * Detect primary programming language from project structure
 *
 * Detection order:
 * 1. TypeScript (tsconfig.json)
 * 2. JavaScript (package.json without tsconfig)
 * 3. Python (requirements.txt or pyproject.toml)
 *
 * @param path - Project path to check
 * @returns Detected language or null
 */
export declare function detectLanguage(path: string): 'typescript' | 'javascript' | 'python' | null;
/**
 * Get suggested skills based on project context
 *
 * @param context - Detected project context
 * @returns Array of suggested skill IDs
 *
 * @example
 * const context = detectProjectContext();
 * const suggestions = getSuggestedSkills(context);
 * // ['docker', 'github-actions', 'jest-helper']
 */
export declare function getSuggestedSkills(context: ProjectContext): string[];
//# sourceMappingURL=project-detector.d.ts.map