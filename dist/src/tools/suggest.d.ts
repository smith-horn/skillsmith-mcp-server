/**
 * @fileoverview MCP Skill Suggest Tool for proactive skill recommendations
 * @module @skillsmith/mcp-server/tools/suggest
 * @see Phase 4: Trigger System Architecture
 *
 * Provides proactive skill suggestions based on user context including:
 * - Current file being edited
 * - Recent terminal commands
 * - Error messages
 * - Project structure analysis
 *
 * Features:
 * - Context scoring to filter low-relevance suggestions
 * - Integration with CodebaseAnalyzer
 * - Semantic skill matching
 *
 * @example
 * // Client calls suggest when user is working
 * const result = await executeSuggest({
 *   project_path: '/path/to/project',
 *   current_file: 'src/App.test.tsx',
 *   recent_commands: ['npm test'],
 *   installed_skills: ['getsentry/commit']
 * }, toolContext);
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
import type { MCPTrustTier as TrustTier } from '@skillsmith/core';
/**
 * Zod schema for suggest tool input validation
 */
export declare const suggestInputSchema: z.ZodObject<{
    /** Root path of the project */
    project_path: z.ZodString;
    /** Current file being edited (optional) */
    current_file: z.ZodOptional<z.ZodString>;
    /** Recent terminal commands (last 5) */
    recent_commands: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Recent error message if any */
    error_message: z.ZodOptional<z.ZodString>;
    /** Currently installed skill IDs */
    installed_skills: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    /** Maximum suggestions to return (default 3) */
    limit: z.ZodDefault<z.ZodNumber>;
    /** Session identifier (optional, for informational purposes) */
    session_id: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    installed_skills: string[];
    project_path: string;
    recent_commands: string[];
    session_id: string;
    current_file?: string | undefined;
    error_message?: string | undefined;
}, {
    project_path: string;
    limit?: number | undefined;
    installed_skills?: string[] | undefined;
    current_file?: string | undefined;
    recent_commands?: string[] | undefined;
    error_message?: string | undefined;
    session_id?: string | undefined;
}>;
/**
 * Input type (before parsing)
 */
export type SuggestInput = z.input<typeof suggestInputSchema>;
/**
 * Individual skill suggestion
 */
export interface SkillSuggestion {
    /** Skill identifier */
    skill_id: string;
    /** Skill name */
    name: string;
    /** Why this skill is being suggested */
    reason: string;
    /** Confidence in this suggestion (0-1) */
    confidence: number;
    /** Trigger types that fired */
    trigger_types: string[];
    /** Trust tier */
    trust_tier: TrustTier;
    /** Quality score */
    quality_score: number;
}
/**
 * Suggest response with metadata
 */
export interface SuggestResponse {
    /** List of suggested skills */
    suggestions: SkillSuggestion[];
    /** Overall context relevance score (0-1) */
    context_score: number;
    /** Which triggers fired */
    triggers_fired: string[];
    /** Performance timing */
    timing: {
        totalMs: number;
        analysisMs?: number;
        matchingMs?: number;
    };
}
/**
 * MCP tool schema definition for skill_suggest
 */
export declare const suggestToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            project_path: {
                type: string;
                description: string;
            };
            current_file: {
                type: string;
                description: string;
            };
            recent_commands: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            error_message: {
                type: string;
                description: string;
            };
            installed_skills: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            limit: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
                default: number;
            };
            session_id: {
                type: string;
                description: string;
                default: string;
            };
        };
        required: string[];
    };
};
export declare const executeSuggest: (input: {
    project_path: string;
    limit?: number | undefined;
    installed_skills?: string[] | undefined;
    current_file?: string | undefined;
    recent_commands?: string[] | undefined;
    error_message?: string | undefined;
    session_id?: string | undefined;
}, context: ToolContext) => Promise<SuggestResponse>;
/**
 * Format suggestions for terminal display
 */
export declare function formatSuggestions(response: SuggestResponse): string;
//# sourceMappingURL=suggest.d.ts.map