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
import { isSupabaseConfigured } from '../supabase-client.js';
import { withTelemetry } from '@skillsmith/core/telemetry';
import { createStubService } from './team-workspace.stub.js';
import { createLiveService } from './team-workspace.live.js';
import { readLicenseKey } from './team-resolver.js';
// Re-export stub factory for external consumers and tests
export { createStubService } from './team-workspace.stub.js';
// ============================================================================
// Input schemas
// ============================================================================
export const teamWorkspaceInputSchema = z.object({
    action: z.enum(['create', 'list', 'get', 'delete']),
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    workspaceId: z.string().uuid().optional(),
});
export const shareSkillInputSchema = z.object({
    action: z.enum(['add', 'remove', 'list']),
    workspaceId: z.string().uuid(),
    skillId: z
        .string()
        .regex(/^[^/]+\/[^/]+$/, 'Must be author/name format')
        .optional(),
});
// ============================================================================
// Tool schemas for MCP registration
// ============================================================================
export const teamWorkspaceToolSchema = {
    name: 'team_workspace',
    description: 'Manage team workspaces (create, list, get, delete). Requires Team tier license.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['create', 'list', 'get', 'delete'],
                description: 'Workspace operation to perform',
            },
            name: {
                type: 'string',
                description: 'Workspace name (required for create)',
            },
            description: {
                type: 'string',
                description: 'Workspace description (optional for create)',
            },
            workspaceId: {
                type: 'string',
                description: 'Workspace ID (required for get/delete)',
            },
        },
        required: ['action'],
    },
};
export const shareSkillToolSchema = {
    name: 'share_skill',
    description: 'Add, remove, or list skills in a team workspace. Requires Team tier license.',
    inputSchema: {
        type: 'object',
        properties: {
            action: {
                type: 'string',
                enum: ['add', 'remove', 'list'],
                description: 'Sharing operation to perform',
            },
            workspaceId: {
                type: 'string',
                description: 'Workspace ID to share skill with',
            },
            skillId: {
                type: 'string',
                description: 'Skill ID in author/name format (required for add/remove)',
            },
        },
        required: ['action', 'workspaceId'],
    },
};
// ============================================================================
// SMI-3898: Sharing policy enforcement
// ============================================================================
/**
 * Match a skill ID against a glob-like pattern.
 * Supports star as a wildcard segment (e.g. "author/star", "star/name").
 */
export function matchesPattern(skillId, pattern) {
    const [skillAuthor, skillName] = skillId.split('/');
    const [patternAuthor, patternName] = pattern.split('/');
    if (!patternAuthor || !patternName)
        return false;
    const authorMatch = patternAuthor === '*' || patternAuthor === skillAuthor;
    const nameMatch = patternName === '*' || patternName === skillName;
    return authorMatch && nameMatch;
}
/**
 * Check if a skill ID is allowed by the sharing policy.
 * Returns an error message if denied, or null if allowed.
 */
export function checkSharingPolicy(skillId, policy) {
    if (!policy)
        return null;
    // Deny list takes precedence
    if (policy.denyList.length > 0) {
        const denied = policy.denyList.some((pattern) => matchesPattern(skillId, pattern));
        if (denied) {
            return `Skill "${skillId}" is blocked by the workspace deny list.`;
        }
    }
    // If allow list is non-empty, skill must match at least one pattern
    if (policy.allowList.length > 0) {
        const allowed = policy.allowList.some((pattern) => matchesPattern(skillId, pattern));
        if (!allowed) {
            return `Skill "${skillId}" is not in the workspace allow list.`;
        }
    }
    return null;
}
/**
 * Module-level singleton. Picks the live Supabase-backed service when
 * SUPABASE_URL + SUPABASE_ANON_KEY are configured; otherwise falls back
 * to the in-memory stub (useful for tests and unauthenticated env).
 */
let service = isSupabaseConfigured()
    ? createLiveService()
    : createStubService();
/** Replace the workspace service implementation (for testing or Supabase swap) */
export function setTeamWorkspaceService(svc) {
    service = svc;
}
/** Get the current workspace service instance */
export function getTeamWorkspaceService() {
    return service;
}
// ============================================================================
// Handlers
// ============================================================================
/**
 * Execute a team_workspace operation.
 *
 * @param input - Validated workspace input
 * @param _context - Tool context (unused until Supabase integration)
 */
async function executeTeamWorkspaceImpl(input, _context) {
    const dataSource = isSupabaseConfigured() ? 'live' : 'stub';
    // SMI-4292: License key resolution order — explicit env, then anon fallback.
    // In live mode, missing/invalid keys surface as typed errors (not stub data).
    const licenseKey = readLicenseKey();
    if (dataSource === 'live' && !licenseKey) {
        return {
            success: false,
            dataSource,
            error: 'SKILLSMITH_LICENSE_KEY is required for team workspace operations. ' +
                'Set it in your MCP server config — shell exports do not reach MCP subprocesses.',
        };
    }
    let teamId;
    try {
        teamId = await service.resolveTeamId(licenseKey ?? '');
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Failed to resolve team from license key.',
        };
    }
    // SMI-4312: Wrap service calls so missing service-role config or other
    // live-mode errors surface as typed {success:false} results.
    try {
        switch (input.action) {
            case 'create': {
                if (!input.name) {
                    return { success: false, dataSource, error: 'Name is required for workspace creation.' };
                }
                const ws = await service.createWorkspace(teamId, input.name, input.description);
                return {
                    success: true,
                    dataSource,
                    workspace: ws,
                    message: `Workspace "${ws.name}" created.`,
                };
            }
            case 'list': {
                const list = await service.listWorkspaces(teamId);
                return {
                    success: true,
                    dataSource,
                    workspaces: list,
                    message: `Found ${list.length} workspace(s).`,
                };
            }
            case 'get': {
                if (!input.workspaceId) {
                    return { success: false, dataSource, error: 'workspaceId is required for get.' };
                }
                const ws = await service.getWorkspace(teamId, input.workspaceId);
                if (!ws)
                    return { success: false, dataSource, error: 'Workspace not found.' };
                return { success: true, dataSource, workspace: ws };
            }
            case 'delete': {
                if (!input.workspaceId) {
                    return { success: false, dataSource, error: 'workspaceId is required for delete.' };
                }
                const deleted = await service.deleteWorkspace(teamId, input.workspaceId);
                if (!deleted)
                    return { success: false, dataSource, error: 'Workspace not found.' };
                return { success: true, dataSource, message: 'Workspace deleted.' };
            }
        }
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Workspace operation failed.',
        };
    }
}
/**
 * Execute a share_skill operation.
 *
 * SMI-3898: Checks allowList/denyList before adding a skill.
 *
 * @param input - Validated share input
 * @param _context - Tool context (unused until Supabase integration)
 */
async function executeShareSkillImpl(input, _context) {
    const dataSource = isSupabaseConfigured() ? 'live' : 'stub';
    const licenseKey = readLicenseKey();
    if (dataSource === 'live' && !licenseKey) {
        return {
            success: false,
            dataSource,
            error: 'SKILLSMITH_LICENSE_KEY is required for skill-sharing operations. ' +
                'Set it in your MCP server config — shell exports do not reach MCP subprocesses.',
        };
    }
    let teamId;
    try {
        teamId = await service.resolveTeamId(licenseKey ?? '');
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Failed to resolve team from license key.',
        };
    }
    // SMI-4312: All service calls wrapped so thrown tenant-isolation errors
    // (e.g. cross-team workspace access) surface as typed {success:false} results
    // instead of propagating as unhandled exceptions.
    try {
        switch (input.action) {
            case 'add': {
                if (!input.skillId) {
                    return { success: false, dataSource, error: 'skillId is required for add.' };
                }
                // SMI-3898: Check sharing policy before adding
                const settings = await service.getWorkspaceSettings(teamId, input.workspaceId);
                const policyError = checkSharingPolicy(input.skillId, settings.sharing);
                if (policyError) {
                    return { success: false, dataSource, error: policyError };
                }
                const skill = await service.addSkill(teamId, input.workspaceId, input.skillId);
                return {
                    success: true,
                    dataSource,
                    skills: [skill],
                    message: `Skill "${input.skillId}" shared to workspace.`,
                };
            }
            case 'remove': {
                if (!input.skillId) {
                    return { success: false, dataSource, error: 'skillId is required for remove.' };
                }
                const removed = await service.removeSkill(teamId, input.workspaceId, input.skillId);
                if (!removed) {
                    return { success: false, dataSource, error: 'Skill not found in workspace.' };
                }
                return {
                    success: true,
                    dataSource,
                    message: `Skill "${input.skillId}" removed from workspace.`,
                };
            }
            case 'list': {
                const list = await service.listSkills(teamId, input.workspaceId);
                return {
                    success: true,
                    dataSource,
                    skills: list,
                    message: `${list.length} shared skill(s).`,
                };
            }
        }
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Share skill operation failed.',
        };
    }
}
// SMI-5017 W2.S2: wrap at export boundary
export const executeTeamWorkspace = withTelemetry(executeTeamWorkspaceImpl, {
    source: 'mcp-tool',
    extractSkillId: () => 'team_workspace',
    extractFramework: () => 'unknown',
});
export const executeShareSkill = withTelemetry(executeShareSkillImpl, {
    source: 'mcp-tool',
    extractSkillId: () => 'share_skill',
    extractFramework: () => 'unknown',
});
//# sourceMappingURL=team-workspace.js.map