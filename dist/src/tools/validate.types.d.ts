/**
 * Validate Tool Types and Schemas
 * @module @skillsmith/mcp-server/tools/validate.types
 */
import { z } from 'zod';
/**
 * Zod schema for validate tool input
 */
export declare const validateInputSchema: z.ZodObject<{
    /** Path to SKILL.md file or skill directory */
    skill_path: z.ZodString;
    /** Enable strict validation (default false) */
    strict: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    skill_path: string;
    strict: boolean;
}, {
    skill_path: string;
    strict?: boolean | undefined;
}>;
/**
 * Input type (before parsing, allows optional fields)
 */
export type ValidateInput = z.input<typeof validateInputSchema>;
/**
 * Validation error with severity
 */
export interface ValidationError {
    /** Field that has the error */
    field: string;
    /** Error message */
    message: string;
    /** Severity level */
    severity: 'error' | 'warning';
}
/**
 * Validation response
 */
export interface ValidateResponse {
    /** Whether the skill is valid */
    valid: boolean;
    /** List of validation errors/warnings */
    errors: ValidationError[];
    /** Parsed metadata if valid */
    metadata: Record<string, unknown> | null;
    /** File path validated */
    path: string;
    /** Performance timing */
    timing: {
        totalMs: number;
    };
}
/**
 * MCP tool schema definition for skill_validate
 */
export declare const validateToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skill_path: {
                type: string;
                description: string;
            };
            strict: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
/**
 * Maximum field lengths.
 *
 * Manifest-field caps (validated via errors.push in validate.helpers.ts):
 *   name, description, author, version, category, license, tagLength, maxTags
 *
 * Derived/extracted caps (validated at the derivation site, fail-fast):
 *   token       — extracted skill-name segment (SMI-4737)
 *   packDomain  — derived pack-domain identifier (SMI-4737)
 */
export declare const FIELD_LIMITS: {
    name: number;
    description: number;
    author: number;
    version: number;
    category: number;
    license: number;
    tagLength: number;
    maxTags: number;
    token: number;
    packDomain: number;
};
/**
 * Dangerous URL patterns for SSRF prevention
 */
export declare const SSRF_PATTERNS: RegExp[];
/**
 * Path traversal patterns
 */
export declare const PATH_TRAVERSAL_PATTERNS: RegExp[];
//# sourceMappingURL=validate.types.d.ts.map