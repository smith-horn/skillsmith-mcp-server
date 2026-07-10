/**
 * @fileoverview publish_private MCP tool -- mark a skill as team-private
 * @module @skillsmith/mcp-server/tools/publish-private
 * @see SMI-3896: Private Skills Publishing
 *
 * Sets `visibility = 'private'` and `team_id` on a skill record in the
 * local SQLite database. Private skills are excluded from community search
 * results and only visible to members of the owning team.
 *
 * Tier gate: Team (private_skills feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const publishPrivateInputSchema: z.ZodObject<{
    /** Skill identifier in author/name format */
    skillId: z.ZodString;
    /** Team ID to assign (resolved from license if not provided) */
    teamId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skillId: string;
    teamId?: string | undefined;
}, {
    skillId: string;
    teamId?: string | undefined;
}>;
export type PublishPrivateInput = z.infer<typeof publishPrivateInputSchema>;
export interface PublishPrivateResult {
    success: boolean;
    skillId: string;
    visibility: 'private' | 'public';
    teamId: string | null;
    message?: string;
    error?: string;
}
export declare const publishPrivateToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillId: {
                type: string;
                description: string;
            };
            teamId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const executePublishPrivate: (input: {
    skillId: string;
    teamId?: string | undefined;
}, context: ToolContext) => Promise<PublishPrivateResult>;
//# sourceMappingURL=publish-private.d.ts.map