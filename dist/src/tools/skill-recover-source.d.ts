/**
 * @fileoverview `skill_recover_source` MCP tool (SMI-5407).
 * @module @skillsmith/mcp-server/tools/skill-recover-source
 *
 * Read-only tool: recovers the canonical GitHub source of locally-installed
 * skills. Never mutates the manifest — returns {skills, summary} for the
 * caller to inspect. The apply path (`apply_source_backfill`) is cut for v1.
 *
 * findCandidatesByName wiring:
 *   Online  — apiClient.search({ query: name, limit: 5 }), serial 100ms gap,
 *              429 -> [].
 *   Offline — local DB: SELECT id, name, repo_url, quality_score FROM skills
 *              WHERE name = ? (same shape as CLI path).
 *
 * findRegistryIdByRepoUrl wiring (SMI-5411): always the local catalog (SELECT id
 * FROM skills WHERE repo_url = ?), enriching a git/plugin-recovered manifest id
 * with the registry UUID so skill_outdated can resolve it. Best-effort/offline.
 *
 * homeDir refinement: must resolve under os.homedir() or os.tmpdir() (test
 * fixtures). Rejects arbitrary paths such as /etc.
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export declare function isHomeDirUnderAllowedRoot(value: string): boolean;
export declare const skillRecoverSourceInputSchema: z.ZodObject<{
    homeDir: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    only: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    embedding: z.ZodOptional<z.ZodBoolean>;
    catalogHint: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    homeDir?: string | undefined;
    only?: string[] | undefined;
    embedding?: boolean | undefined;
    catalogHint?: boolean | undefined;
}, {
    homeDir?: string | undefined;
    only?: string[] | undefined;
    embedding?: boolean | undefined;
    catalogHint?: boolean | undefined;
}>;
export type SkillRecoverSourceValidatedInput = z.infer<typeof skillRecoverSourceInputSchema>;
export declare const skillRecoverSourceToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            homeDir: {
                type: string;
                description: string;
            };
            only: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            embedding: {
                type: string;
                description: string;
            };
            catalogHint: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare const executeSkillRecoverSource: (input: unknown, context: ToolContext) => Promise<import("@skillsmith/core").RecoveryReport>;
//# sourceMappingURL=skill-recover-source.d.ts.map