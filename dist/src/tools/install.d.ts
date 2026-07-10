/**
 * @fileoverview MCP Install Skill Tool for downloading and installing skills
 * @module @skillsmith/mcp-server/tools/install
 * @see SMI-2741: Split to meet 500-line standard
 * @see SMI-3137: Wave 4 — Dependency intelligence persistence
 * @see SMI-3483: Wave 0 — Delegate to SkillInstallationService from core
 *
 * Skills are installed to ~/.claude/skills/ and tracked in ~/.skillsmith/manifest.json
 *
 * The core install logic lives in @skillsmith/core SkillInstallationService.
 * This file is the MCP tool wrapper that:
 * - Bridges ToolContext to the service's constructor params
 * - Adds conflict resolution (three-way merge, backup) on top
 * - Wires onProgress to MCP protocol notifications
 */
import type { ToolContext } from '../context.js';
import { type InstallResult } from './install.types.js';
export { installTool } from './install.tool.js';
export { default } from './install.tool.js';
export { installInputSchema, type InstallInput, type InstallResult } from './install.types.js';
/**
 * Best-effort skill name extraction for conflict pre-check.
 * Does not need to be perfect -- just needs to match manifest keys.
 *
 * SMI-4737: throws when the extracted segment exceeds `FIELD_LIMITS.token`
 * (128 chars). Adversarial `skillId` inputs that survive the Zod 512-char
 * boundary but produce an over-cap segment are rejected at the derivation
 * site so they cannot reach `sanitizeSegment`'s defensive 256-char floor
 * (SMI-4733). Caller sites must wrap in try/catch and surface a structured
 * tool-error envelope; the throw must not escape the MCP handler.
 *
 * Exported for direct unit testing (SMI-4737 tests).
 */
export declare function extractSkillName(skillId: string): string;
export declare const installSkill: (input: unknown, _context?: ToolContext | undefined) => Promise<InstallResult>;
//# sourceMappingURL=install.d.ts.map