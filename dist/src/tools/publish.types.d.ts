/**
 * Publish Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/publish.types
 * @see SMI-2440: MCP Publish Tool
 */
import { z } from 'zod';
/**
 * Zod schema for publish tool input
 */
export declare const publishInputSchema: z.ZodObject<{
    /** Path to the skill directory (must contain SKILL.md) */
    skill_path: z.ZodString;
    /** Run reference check before publishing (default: true) */
    check_references: z.ZodDefault<z.ZodBoolean>;
    /** Additional reference patterns to check (regex strings) */
    reference_patterns: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    /** Create GitHub repository (requires gh CLI) */
    create_repo: z.ZodDefault<z.ZodBoolean>;
    /** GitHub visibility if creating repo (default: 'public') */
    visibility: z.ZodDefault<z.ZodEnum<["public", "private"]>>;
    /** Add claude-skill topic for registry discovery */
    add_topic: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    skill_path: string;
    check_references: boolean;
    create_repo: boolean;
    visibility: "public" | "private";
    add_topic: boolean;
    reference_patterns?: string[] | undefined;
}, {
    skill_path: string;
    check_references?: boolean | undefined;
    reference_patterns?: string[] | undefined;
    create_repo?: boolean | undefined;
    visibility?: "public" | "private" | undefined;
    add_topic?: boolean | undefined;
}>;
/**
 * Input type (before parsing, allows optional fields)
 */
export type PublishInput = z.input<typeof publishInputSchema>;
/**
 * Reference warning from project-specific reference scanning
 */
export interface ReferenceWarning {
    /** File where reference was found */
    file: string;
    /** Line number */
    line: number;
    /** Matched text (truncated to 80 chars) */
    text: string;
    /** Pattern that matched */
    pattern: string;
}
/**
 * Pre-flight check results for GitHub CLI
 */
export interface PreflightResult {
    /** Whether gh CLI is installed */
    ghAvailable: boolean;
    /** Whether gh CLI is authenticated */
    ghAuthenticated: boolean;
}
/**
 * Publish response
 */
export interface PublishResponse {
    /** Whether publish preparation succeeded */
    success: boolean;
    /** Skill metadata */
    metadata: {
        name: string;
        version: string;
        checksum: string;
        trustTier: string;
    } | null;
    /** Reference check results (if enabled) */
    referenceWarnings: ReferenceWarning[];
    /** GitHub repo URL (if created) */
    repoUrl?: string;
    /** Pre-flight check results */
    preflight?: PreflightResult;
    /** Next steps for the user */
    nextSteps: string[];
    /** Error message if failed */
    error?: string;
}
/**
 * MCP tool schema definition for publish
 */
export declare const publishToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skill_path: {
                type: string;
                description: string;
            };
            check_references: {
                type: string;
                description: string;
                default: boolean;
            };
            reference_patterns: {
                type: string;
                items: {
                    type: string;
                    maxLength: number;
                };
                maxItems: number;
                description: string;
            };
            create_repo: {
                type: string;
                description: string;
                default: boolean;
            };
            visibility: {
                type: string;
                enum: string[];
                description: string;
                default: string;
            };
            add_topic: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=publish.types.d.ts.map