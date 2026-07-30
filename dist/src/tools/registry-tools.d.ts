/**
 * @fileoverview Private registry MCP tools for enterprise skill management
 * @module @skillsmith/mcp-server/tools/registry-tools
 * @see SMI-3902: Private Registry MCP Tools (original stub)
 * @see SMI-5816: Private skill registry — real implementation
 * @see ADR-129: Postgres-native (JSONB) storage + real team-auth (migration 071)
 *
 * Enables enterprise teams to publish and manage skills in a private registry
 * scoped to their organization. Both metadata and packaged content live in the
 * `private_registry_skills` Postgres table (JSONB content, not S3 — ADR-129);
 * team-scoped RLS + an in-query team_id filter on the service-role path (ADR-116).
 *
 * Backing service is selected at module load: the live Supabase-backed service
 * (registry-tools.live.ts) when Supabase is configured, else an in-memory stub
 * (registry-tools.stub.ts) for local dev / tests.
 *
 * Tier gate: Enterprise (private_registry feature flag — toolFeatureMapping.ts).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export { createStubRegistryService } from './registry-tools.stub.js';
/**
 * Packaged skill files as a flat { relativePath: fileText } map
 * (e.g. { "SKILL.md": "...", "scripts/foo.sh": "..." }). Stored JSONB-native
 * per ADR-129; a "SKILL.md" entry is required and total size is capped at 2 MB
 * (enforced in the live publish service).
 */
export declare const skillContentSchema: z.ZodRecord<z.ZodString, z.ZodString>;
export type SkillContent = z.infer<typeof skillContentSchema>;
export declare const privateRegistryPublishInputSchema: z.ZodObject<{
    skillId: z.ZodString;
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
    action: z.ZodEnum<["list", "get", "deprecate", "undeprecate", "namespace"]>;
    skillId: z.ZodOptional<z.ZodString>;
    version: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "get" | "deprecate" | "undeprecate" | "namespace";
    version?: string | undefined;
    skillId?: string | undefined;
}, {
    action: "list" | "get" | "deprecate" | "undeprecate" | "namespace";
    version?: string | undefined;
    skillId?: string | undefined;
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
        };
        required: string[];
    };
};
export interface RegistrySkill {
    skillId: string;
    version: string;
    description: string | null;
    deprecated: boolean;
    publishedAt: string;
    publishedBy: string;
    registryUrl: string;
}
export interface PrivateRegistryPublishResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skill?: RegistrySkill;
    /** The team's publish namespace (SMI-5852, AC-11) — surfaced on success too, not only
     *  as an error-path side effect, so a first publish need not be how a team discovers it. */
    skillNamespace?: string;
    message?: string;
    error?: string;
}
export interface PrivateRegistryManageResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skills?: RegistrySkill[];
    skill?: RegistrySkill;
    /** Present for action:'namespace' — the team's publish namespace (SMI-5852, AC-11). */
    namespace?: string;
    message?: string;
    error?: string;
}
/**
 * PrivateRegistryService — team-scoped private registry CRUD.
 *
 * **Invariant (ADR-116)**: every method MUST treat `teamId` as the authoritative
 * scoping key and include an explicit `team_id = <teamId>` filter in the query.
 * The live Supabase implementation uses the service-role client, which bypasses
 * RLS — tenant isolation is enforced in the service, not the database.
 *
 * @see packages/mcp-server/src/tools/registry-tools.live.ts
 * @see docs/internal/adr/129-private-skill-registry-real-implementation.md
 */
export interface PrivateRegistryService {
    publish(teamId: string, skillId: string, version: string, content: SkillContent, description?: string): Promise<RegistrySkill>;
    list(teamId: string, version?: string): Promise<RegistrySkill[]>;
    get(teamId: string, skillId: string, version?: string): Promise<RegistrySkill | null>;
    deprecate(teamId: string, skillId: string): Promise<boolean>;
    undeprecate(teamId: string, skillId: string): Promise<boolean>;
    /**
     * The team's publish namespace (teams.skill_namespace — SMI-5852), or null if it
     * could not be resolved. Used both for a UX pre-check before publish (surfacing a
     * namespace mismatch as a typed error instead of a raw DB-trigger exception) and
     * for the dedicated `manage(action: 'namespace')` read path (AC-11) — a team should
     * be able to discover its namespace without attempting a publish at all.
     */
    getNamespace(teamId: string): Promise<string | null>;
}
/** Replace the registry service implementation (for testing or production swap) */
export declare function setPrivateRegistryService(svc: PrivateRegistryService): void;
/** Get the current registry service instance */
export declare function getPrivateRegistryService(): PrivateRegistryService;
export declare const executePrivateRegistryPublish: (input: {
    version: string;
    skillId: string;
    content: Record<string, string>;
    description?: string | undefined;
}, _context: ToolContext) => Promise<PrivateRegistryPublishResult>;
export declare const executePrivateRegistryManage: (input: {
    action: "list" | "get" | "deprecate" | "undeprecate" | "namespace";
    version?: string | undefined;
    skillId?: string | undefined;
}, _context: ToolContext) => Promise<PrivateRegistryManageResult>;
//# sourceMappingURL=registry-tools.d.ts.map