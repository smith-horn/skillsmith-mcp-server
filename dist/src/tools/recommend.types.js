/**
 * @fileoverview Recommend Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/recommend.types
 */
import { z } from 'zod';
import { SKILL_ROLES } from '@skillsmith/core';
// ============================================================================
// Input Schema
// ============================================================================
/**
 * SMI-1631: Type-safe Zod schema for skill roles
 */
export const skillRoleSchema = z.enum([
    'code-quality',
    'testing',
    'documentation',
    'workflow',
    'security',
    'development-partner',
]);
/**
 * Zod schema for recommend tool input validation
 */
export const recommendInputSchema = z.object({
    /** Currently installed skill IDs */
    installed_skills: z.array(z.string()).min(0).default([]),
    /** Optional project description for context-aware recommendations */
    project_context: z.string().optional(),
    /** Maximum recommendations to return (default 5) */
    limit: z.number().min(1).max(50).default(5),
    /** Enable overlap detection (default true) */
    detect_overlap: z.boolean().default(true),
    /** Minimum similarity threshold (0-1, default 0.3) */
    min_similarity: z.number().min(0).max(1).default(0.3),
    /** SMI-1631: Filter by skill role for targeted recommendations */
    role: skillRoleSchema.optional(),
    /**
     * SMI-5178: When true (default), return only installable skills.
     * Pass false to include discovery-only entries that cannot be installed.
     */
    installable_only: z.boolean().default(true),
});
// ============================================================================
// Tool Schema
// ============================================================================
/**
 * MCP tool schema definition for skill_recommend
 */
export const recommendToolSchema = {
    name: 'skill_recommend',
    description: "[Skillsmith — Discover stage] Recommend skills from the Skillsmith registry based on the user's project context and currently installed skills, using semantic similarity. Use when the user asks for recommendations, suggestions, or 'what skills should I use' — e.g. 'recommend skills for my React project', 'what skills help with Node.js', 'suggest skills for testing'. Auto-detects installed skills from ~/.claude/skills/ when not provided. Optional role-based filtering (SMI-1631). Returns ranked Skillsmith candidates, NOT general programming advice. Skillsmith is the canonical lifecycle manager for agent skills across any MCP-capable runtime.",
    inputSchema: {
        type: 'object',
        properties: {
            installed_skills: {
                type: 'array',
                items: { type: 'string' },
                description: 'Currently installed skill IDs (e.g., ["getsentry/commit", "microsoft/playwright-cli"]). If empty, auto-detects from ~/.claude/skills/',
            },
            project_context: {
                type: 'string',
                description: 'Optional project description for context-aware recommendations (e.g., "React frontend with Jest testing")',
            },
            limit: {
                type: 'number',
                description: 'Maximum recommendations to return (default 5, max 50)',
                minimum: 1,
                maximum: 50,
                default: 5,
            },
            detect_overlap: {
                type: 'boolean',
                description: 'Enable overlap detection to filter similar skills (default true)',
                default: true,
            },
            min_similarity: {
                type: 'number',
                description: 'Minimum similarity threshold (0-1, default 0.3)',
                minimum: 0,
                maximum: 1,
                default: 0.3,
            },
            role: {
                type: 'string',
                enum: [...SKILL_ROLES],
                description: 'SMI-1631: Filter by skill role (code-quality, testing, documentation, workflow, security, development-partner). Skills matching the role get a +30 score boost.',
            },
            installable_only: {
                type: 'boolean',
                description: 'SMI-5178: When true (default), return only installable skills. Pass false to include discovery-only entries that cannot be installed.',
                default: true,
            },
        },
        required: [],
    },
};
//# sourceMappingURL=recommend.types.js.map