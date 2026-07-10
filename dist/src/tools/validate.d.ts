/**
 * @fileoverview MCP Skill Validate Tool for validating SKILL.md files
 * @module @skillsmith/mcp-server/tools/validate
 * @see SMI-742: Add MCP Tool skill_validate
 *
 * Validates skill definition files against the Skillsmith specification:
 * - YAML frontmatter structure
 * - Required fields (name, description)
 * - Field length limits
 * - Security patterns (SSRF, path traversal)
 *
 * @example
 * // Basic validation
 * const result = await executeValidate({
 *   skill_path: '/path/to/SKILL.md'
 * });
 *
 * @example
 * // Strict validation
 * const result = await executeValidate({
 *   skill_path: '/path/to/skill-directory',
 *   strict: true
 * });
 */
import type { ToolContext } from '../context.js';
import type { ValidateResponse } from './validate.types.js';
export type { ValidateInput, ValidateResponse, ValidationError } from './validate.types.js';
export { validateInputSchema, validateToolSchema } from './validate.types.js';
export declare const executeValidate: (input: {
    skill_path: string;
    strict?: boolean | undefined;
}, _context?: ToolContext | undefined) => Promise<ValidateResponse>;
/**
 * Format validation results for terminal display
 */
export declare function formatValidationResults(response: ValidateResponse): string;
//# sourceMappingURL=validate.d.ts.map