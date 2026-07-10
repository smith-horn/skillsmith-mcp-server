/**
 * @fileoverview MCP Skill Publish Tool for preparing skills for sharing
 * @module @skillsmith/mcp-server/tools/publish
 * @see SMI-2440: MCP Publish Tool
 *
 * Prepares a skill for publishing:
 * - Validates the skill structure
 * - Scans for project-specific references
 * - Generates checksum and manifest
 * - Optionally creates GitHub repository
 *
 * @example
 * // Basic publish preparation
 * const result = await executePublish({
 *   skill_path: '/path/to/skill'
 * });
 *
 * @example
 * // Publish with GitHub repo creation
 * const result = await executePublish({
 *   skill_path: '/path/to/skill',
 *   create_repo: true,
 *   add_topic: true
 * });
 */
import type { ToolContext } from '../context.js';
import type { PublishResponse } from './publish.types.js';
export type { PublishInput, PublishResponse, ReferenceWarning, PreflightResult, } from './publish.types.js';
export { publishInputSchema, publishToolSchema } from './publish.types.js';
export { formatPublishResults } from './publish.helpers.js';
export declare const executePublish: (input: {
    skill_path: string;
    check_references?: boolean | undefined;
    reference_patterns?: string[] | undefined;
    create_repo?: boolean | undefined;
    visibility?: "public" | "private" | undefined;
    add_topic?: boolean | undefined;
}, _context?: ToolContext | undefined) => Promise<PublishResponse>;
//# sourceMappingURL=publish.d.ts.map