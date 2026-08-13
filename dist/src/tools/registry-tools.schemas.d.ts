/**
 * @fileoverview Schemas for the private-registry tools — both the Zod runtime-validation
 * schemas and the MCP tool-registration schemas
 * @module @skillsmith/mcp-server/tools/registry-tools.schemas
 * @see SMI-5949 D-12: Wave 2 Step 1 — "Extract schemas, make room"; extended Wave 2 Step 4
 * @see docs/internal/implementation/smi-5949-approval-gate.md
 *
 * A schemas-only companion (the `foo.types.ts`/`foo.action.ts` convention already used by
 * `registry-tools.content.types.ts` and `registry-tools.install-action.ts`). Originally just the
 * two MCP tool-registration schemas (Wave 2 Step 1, when `registry-tools.ts` sat at 492/500
 * lines); Wave 2 Step 4 additionally moved the Zod validation schemas here (`skillContentSchema`,
 * `privateRegistryPublishInputSchema`, `privateRegistryManageInputSchema` and their inferred
 * types) — the three review-gate actions' extra enum values/fields pushed `registry-tools.ts`
 * back over budget even after the D-5 service-interface methods were themselves split into
 * `registry-tools.review.types.ts`. Both schema families belong together: they describe the same
 * two tools' inputs from two different angles (what the model sees vs what the handler runtime-
 * validates), and neither depends on anything else `registry-tools.ts` defines.
 *
 * Re-exported from `registry-tools.ts` so every existing import (`index.ts`'s tool-registration
 * schemas, `tool-dispatch.ts`'s Zod schemas, every test file's `SkillContent`/input types) needs
 * no change — only this module's own contents moved, not who they are reached through.
 */
import { z } from 'zod';
/**
 * Packaged skill files as a flat { relativePath: fileText } map
 * (e.g. { "SKILL.md": "...", "scripts/foo.sh": "..." }). Stored JSONB-native
 * per ADR-129; a "SKILL.md" entry is required and total size is capped at 2 MB
 * (enforced in the live publish service).
 */
export declare const skillContentSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export type SkillContent = z.infer<typeof skillContentSchema>;
export declare const privateRegistryPublishInputSchema: z.ZodObject<{
    skillId: z.ZodEffects<z.ZodString, string, string>;
    version: z.ZodString;
    content: z.ZodRecord<z.ZodString, z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    version: string;
    skillId: string;
    content: Record<string, string>;
    description?: string | undefined;
}, {
    version: string;
    skillId: string;
    content: Record<string, string>;
    description?: string | undefined;
}>;
export type PrivateRegistryPublishInput = z.infer<typeof privateRegistryPublishInputSchema>;
export declare const privateRegistryManageInputSchema: z.ZodObject<{
    action: z.ZodEnum<["list", "get", "deprecate", "undeprecate", "namespace", "install", "submissions", "approve", "reject"]>;
    skillId: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    version: z.ZodOptional<z.ZodString>;
    force: z.ZodOptional<z.ZodBoolean>;
    includeDeprecated: z.ZodOptional<z.ZodBoolean>;
    status: z.ZodOptional<z.ZodEnum<["pending", "approved", "rejected"]>>;
    note: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "get" | "deprecate" | "undeprecate" | "approve" | "reject" | "submissions" | "install" | "namespace";
    status?: "rejected" | "approved" | "pending" | undefined;
    version?: string | undefined;
    force?: boolean | undefined;
    skillId?: string | undefined;
    note?: string | undefined;
    includeDeprecated?: boolean | undefined;
}, {
    action: "list" | "get" | "deprecate" | "undeprecate" | "approve" | "reject" | "submissions" | "install" | "namespace";
    status?: "rejected" | "approved" | "pending" | undefined;
    version?: string | undefined;
    force?: boolean | undefined;
    skillId?: string | undefined;
    note?: string | undefined;
    includeDeprecated?: boolean | undefined;
}>;
export type PrivateRegistryManageInput = z.infer<typeof privateRegistryManageInputSchema>;
export declare const privateRegistryPublishToolSchema: {
    name: "private_registry_publish";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillId: {
                type: string;
                description: string;
            };
            version: {
                type: string;
                description: string;
            };
            content: {
                type: string;
                additionalProperties: {
                    type: string;
                };
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const privateRegistryManageToolSchema: {
    name: "private_registry_manage";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            skillId: {
                type: string;
                description: string;
            };
            version: {
                type: string;
                description: string;
            };
            force: {
                type: string;
                description: string;
            };
            includeDeprecated: {
                type: string;
                description: string;
            };
            status: {
                type: string;
                enum: string[];
                description: string;
            };
            note: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=registry-tools.schemas.d.ts.map