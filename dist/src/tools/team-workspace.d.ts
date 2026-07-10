/**
 * @fileoverview team_workspace and share_skill MCP tools
 * @module @skillsmith/mcp-server/tools/team-workspace
 * @see SMI-3895: Team Workspace + Share Skill MCP Tools
 * @see SMI-3898: Skill Sharing Controls
 *
 * Registry-mediated architecture: workspace metadata lives in Supabase
 * (server-side), not local SQLite. MCP tools call Supabase RPCs for
 * workspace CRUD. License key resolves to team_id for auth.
 *
 * Tier gate: Team (team_workspaces feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export { createStubService } from './team-workspace.stub.js';
export declare const teamWorkspaceInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create", "list", "get", "delete"]>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    workspaceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    description?: string | undefined;
    workspaceId?: string | undefined;
}, {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    description?: string | undefined;
    workspaceId?: string | undefined;
}>;
export type TeamWorkspaceInput = z.infer<typeof teamWorkspaceInputSchema>;
export declare const shareSkillInputSchema: z.ZodObject<{
    action: z.ZodEnum<["add", "remove", "list"]>;
    workspaceId: z.ZodString;
    skillId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "add" | "remove";
    workspaceId: string;
    skillId?: string | undefined;
}, {
    action: "list" | "add" | "remove";
    workspaceId: string;
    skillId?: string | undefined;
}>;
export type ShareSkillInput = z.infer<typeof shareSkillInputSchema>;
export interface Workspace {
    id: string;
    name: string;
    description: string | null;
    teamId: string;
    settings: WorkspaceSettings;
    createdAt: string;
    updatedAt: string;
}
export interface WorkspaceSettings {
    sharing?: SharingPolicy;
}
/** SMI-3898: Sharing policy for workspace skill sharing controls */
export interface SharingPolicy {
    /** Whether adding a skill requires approval (stored, not enforced in MVP) */
    requireApproval: boolean;
    /** Glob patterns for allowed skills -- "author1/{star}", "{star}/skill-name" */
    allowList: string[];
    /** Glob patterns for denied skills -- "untrusted-author/{star}" */
    denyList: string[];
}
export interface SharedSkill {
    skillId: string;
    addedBy: string;
    addedAt: string;
}
export interface TeamWorkspaceResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    workspace?: Workspace;
    workspaces?: Workspace[];
    message?: string;
    error?: string;
}
export interface ShareSkillResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    skills?: SharedSkill[];
    message?: string;
    error?: string;
}
export declare const teamWorkspaceToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const shareSkillToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            workspaceId: {
                type: string;
                description: string;
            };
            skillId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
/**
 * TeamWorkspaceService — registry-mediated workspace CRUD.
 *
 * **Invariant (SMI-4312)**: every method MUST treat `teamId` as the
 * authoritative scoping key. Implementations that hit a SQL backend
 * MUST either (a) include an explicit `team_id = <teamId>` filter in
 * the query, or (b) assert the target workspace belongs to `teamId`
 * before performing `workspace_skills` operations. The live Supabase
 * implementation uses the service-role client, which bypasses RLS —
 * tenant isolation is enforced here, not by the database.
 *
 * @see packages/mcp-server/src/tools/team-workspace.live.ts
 * @see docs/internal/adr/116-mcp-server-service-role-for-team-scoped-tools.md
 */
export interface TeamWorkspaceService {
    resolveTeamId(licenseKey: string): Promise<string>;
    createWorkspace(teamId: string, name: string, description?: string): Promise<Workspace>;
    listWorkspaces(teamId: string): Promise<Workspace[]>;
    getWorkspace(teamId: string, workspaceId: string): Promise<Workspace | null>;
    deleteWorkspace(teamId: string, workspaceId: string): Promise<boolean>;
    addSkill(teamId: string, workspaceId: string, skillId: string): Promise<SharedSkill>;
    removeSkill(teamId: string, workspaceId: string, skillId: string): Promise<boolean>;
    listSkills(teamId: string, workspaceId: string): Promise<SharedSkill[]>;
    getWorkspaceSettings(teamId: string, workspaceId: string): Promise<WorkspaceSettings>;
}
/**
 * Match a skill ID against a glob-like pattern.
 * Supports star as a wildcard segment (e.g. "author/star", "star/name").
 */
export declare function matchesPattern(skillId: string, pattern: string): boolean;
/**
 * Check if a skill ID is allowed by the sharing policy.
 * Returns an error message if denied, or null if allowed.
 */
export declare function checkSharingPolicy(skillId: string, policy: SharingPolicy | undefined): string | null;
/** Replace the workspace service implementation (for testing or Supabase swap) */
export declare function setTeamWorkspaceService(svc: TeamWorkspaceService): void;
/** Get the current workspace service instance */
export declare function getTeamWorkspaceService(): TeamWorkspaceService;
export declare const executeTeamWorkspace: (input: {
    action: "list" | "create" | "get" | "delete";
    name?: string | undefined;
    description?: string | undefined;
    workspaceId?: string | undefined;
}, _context: ToolContext) => Promise<TeamWorkspaceResult>;
export declare const executeShareSkill: (input: {
    action: "list" | "add" | "remove";
    workspaceId: string;
    skillId?: string | undefined;
}, _context: ToolContext) => Promise<ShareSkillResult>;
//# sourceMappingURL=team-workspace.d.ts.map