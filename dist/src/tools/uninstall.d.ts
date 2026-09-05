/**
 * @fileoverview MCP Uninstall Skill Tool for safely removing installed skills
 * @module @skillsmith/mcp-server/tools/uninstall
 * @see SMI-3483: Wave 0 — Delegate to SkillInstallationService from core
 *
 * Provides skill uninstallation functionality with:
 * - Manifest-based tracking of installed skills
 * - Modification detection (warns if files changed since install)
 * - Force removal option for modified or untracked skills
 * - Clean removal from ~/.claude/skills/ directory
 * - Orphan fallback: if skill not in manifest but exists on disk
 *
 * The core uninstall logic lives in @skillsmith/core SkillInstallationService.
 * This file is the MCP tool wrapper that bridges ToolContext to the service.
 */
import { z } from 'zod';
import { type ClientId } from '@skillsmith/core/install';
import type { ToolContext } from '../context.js';
export declare const uninstallInputSchema: z.ZodObject<{
    skillName: z.ZodString;
    force: z.ZodDefault<z.ZodBoolean>;
    /** ADR-139 (SMI-6274 Wave 4) / GPT-5.6-Sol PR review: target client, mirroring
     *  install_skill's own `client` param (defaults to SKILLSMITH_CLIENT env or
     *  claude-code). Required for the (scope, client) triple scope resolution
     *  targets — resolving the wrong client's directory would uninstall from
     *  the wrong place entirely. */
    client: z.ZodOptional<z.ZodEnum<[ClientId, ...ClientId[]]>>;
    /** ADR-139 (SMI-6274 Wave 4) / GPT-5.6-Sol PR review: explicit uninstall
     *  scope, mirroring the CLI's `--scope` flag and install_skill's own
     *  `scope` param — see that param's doc comment (install.types.ts) for why
     *  a per-call parameter matters for a long-running MCP server beyond the
     *  SKILLSMITH_SCOPE env var alone. */
    scope: z.ZodOptional<z.ZodEnum<["global", "workspace"]>>;
    /** ADR-139 (SMI-6274 Wave 4): this MCP server is long-running, so its own
     *  process.cwd() is fixed at server launch and does not track the calling
     *  editor/agent's actual project — passing this is the only reliable way
     *  to walk the workspace-scope ancestor search from the RIGHT starting
     *  point. Optional: falls back to this server's own process.cwd(), which
     *  still resolves correctly for a bare global uninstall (the common case)
     *  but may under-resolve workspace auto-detection/creation without it. */
    cwd: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    force: boolean;
    skillName: string;
    client?: ClientId | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
}, {
    skillName: string;
    client?: ClientId | undefined;
    force?: boolean | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
}>;
export type UninstallInput = z.infer<typeof uninstallInputSchema>;
import type { CoreUninstallResult } from '@skillsmith/core';
export type UninstallResult = CoreUninstallResult;
/**
 * List all skills currently installed via Skillsmith.
 *
 * Reads the manifest file and returns an array of skill names.
 * This only includes skills tracked in the manifest, not skills
 * manually placed in ~/.claude/skills/.
 *
 * @returns Promise resolving to array of installed skill names
 */
export declare function listInstalledSkills(): Promise<string[]>;
/**
 * MCP tool definition
 */
export declare const uninstallTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillName: {
                type: string;
                description: string;
            };
            force: {
                type: string;
                description: string;
            };
            client: {
                type: string;
                enum: ClientId[];
                description: string;
            };
            scope: {
                type: string;
                enum: string[];
                description: string;
            };
            cwd: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export default uninstallTool;
export declare const uninstallSkill: (input: {
    force: boolean;
    skillName: string;
    client?: ClientId | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
}, _context?: ToolContext | undefined) => Promise<CoreUninstallResult>;
//# sourceMappingURL=uninstall.d.ts.map