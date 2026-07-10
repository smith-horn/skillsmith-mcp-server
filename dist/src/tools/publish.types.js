/**
 * Publish Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/publish.types
 * @see SMI-2440: MCP Publish Tool
 */
import { z } from 'zod';
/**
 * Zod schema for publish tool input
 */
export const publishInputSchema = z.object({
    /** Path to the skill directory (must contain SKILL.md) */
    skill_path: z.string().min(1, 'skill_path is required'),
    /** Run reference check before publishing (default: true) */
    check_references: z.boolean().default(true),
    /** Additional reference patterns to check (regex strings) */
    reference_patterns: z.array(z.string().max(200)).max(20).optional(),
    /** Create GitHub repository (requires gh CLI) */
    create_repo: z.boolean().default(false),
    /** GitHub visibility if creating repo (default: 'public') */
    visibility: z.enum(['public', 'private']).default('public'),
    /** Add claude-skill topic for registry discovery */
    add_topic: z.boolean().default(false),
});
/**
 * MCP tool schema definition for publish
 */
export const publishToolSchema = {
    name: 'skill_publish',
    description: 'Prepare a skill for publishing. Validates the skill, generates a checksum, ' +
        'creates a publish manifest, and optionally checks for project-specific references. ' +
        'Can also create a GitHub repository for registry discovery.',
    inputSchema: {
        type: 'object',
        properties: {
            skill_path: {
                type: 'string',
                description: 'Path to the skill directory (must contain SKILL.md)',
            },
            check_references: {
                type: 'boolean',
                description: 'Run reference check before publishing (default: true)',
                default: true,
            },
            reference_patterns: {
                type: 'array',
                items: { type: 'string', maxLength: 200 },
                maxItems: 20,
                description: 'Additional regex patterns to check (regex strings, max 200 chars each, max 20 patterns)',
            },
            create_repo: {
                type: 'boolean',
                description: 'Create GitHub repository (requires gh CLI — will pre-flight check)',
                default: false,
            },
            visibility: {
                type: 'string',
                enum: ['public', 'private'],
                description: "GitHub visibility if creating repo (default: 'public')",
                default: 'public',
            },
            add_topic: {
                type: 'boolean',
                description: 'Add claude-skill topic for registry discovery',
                default: false,
            },
        },
        required: ['skill_path'],
    },
};
//# sourceMappingURL=publish.types.js.map