/**
 * @fileoverview publish_private MCP tool -- mark a skill as team-private
 * @module @skillsmith/mcp-server/tools/publish-private
 * @see SMI-3896: Private Skills Publishing
 *
 * Sets `visibility = 'private'` and `team_id` on a skill record in the
 * caller's own local SQLite database. This hides the skill from local
 * community-search results on this machine only -- today there is no
 * server-side team record or cross-teammate sync (see SMI-5882). For a
 * real shared team registry, see the Enterprise-tier
 * `private_registry_publish`/`private_registry_manage` tools.
 *
 * Tier gate: Team (private_skills feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare const publishPrivateInputSchema: z.ZodObject<{
    /** Skill identifier in author/name format */
    skillId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    skillId: string;
}, {
    skillId: string;
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
        };
        required: string[];
    };
};
export declare const executePublishPrivate: (input: {
    skillId: string;
}, context: ToolContext) => Promise<PublishPrivateResult>;
//# sourceMappingURL=publish-private.d.ts.map