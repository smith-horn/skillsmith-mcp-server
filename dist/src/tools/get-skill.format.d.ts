/**
 * @fileoverview Terminal/CLI formatting helpers for get_skill responses.
 * @module @skillsmith/mcp-server/tools/get-skill.format
 *
 * SMI-5360: split out of get-skill.ts to keep that file under the 500-line
 * limit. These are pure presentation helpers — no I/O, no ToolContext.
 */
import { type GetSkillResponse } from '@skillsmith/core';
/**
 * Format skill details for terminal/CLI display.
 *
 * Produces a comprehensive human-readable string including:
 * - Basic info (ID, author, version, category)
 * - Full description
 * - Trust tier with explanation
 * - Visual score breakdown bars
 * - Repository and tags
 * - Installation command
 *
 * @param response - Get skill response from executeGetSkill
 * @returns Formatted string suitable for terminal output
 *
 * @example
 * const response = await executeGetSkill({ id: 'getsentry/commit' });
 * console.log(formatSkillDetails(response));
 * // Output:
 * // === commit ===
 * // ID: getsentry/commit
 * // Author: getsentry
 * // Version: 1.2.0
 * // ...
 */
export declare function formatSkillDetails(response: GetSkillResponse): string;
//# sourceMappingURL=get-skill.format.d.ts.map