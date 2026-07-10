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
import type { ToolContext } from '../context.js';
export declare const uninstallInputSchema: z.ZodObject<{
    skillName: z.ZodString;
    force: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    force: boolean;
    skillName: string;
}, {
    skillName: string;
    force?: boolean | undefined;
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
        };
        required: string[];
    };
};
export default uninstallTool;
export declare const uninstallSkill: (input: {
    force: boolean;
    skillName: string;
}, _context?: ToolContext | undefined) => Promise<CoreUninstallResult>;
//# sourceMappingURL=uninstall.d.ts.map