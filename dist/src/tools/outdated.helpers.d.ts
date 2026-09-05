/**
 * @fileoverview skill_outdated MCP tool — execution helpers
 * @module @skillsmith/mcp-server/tools/outdated.helpers
 * @see SMI-3138: Wave 5 — Dependency intelligence outdated tool
 *
 * Split out of `outdated.ts` (SMI-6343 Wave 3, 500-line file gate) — the
 * generic file-read and dependency-satisfaction helpers, distinct from
 * `outdated.identity.ts`'s Wave-3-specific tamper-check classification.
 */
import type { SkillDependencyRow } from '@skillsmith/core';
import type { DependencyStatus } from './outdated.js';
/**
 * Read the installed SKILL.md's raw content. Returns null if the file
 * cannot be read.
 *
 * SMI-6343 (Wave 3): split out of the old `readInstalledHash` so the raw
 * content is available for signal 2's front-matter parsing too, without a
 * second file read.
 */
export declare function readInstalledContent(installPath: string): Promise<string | null>;
/**
 * Check dependency satisfaction for a skill.
 * - skill_hard / skill_soft / skill_peer: satisfied if dep_target is in installedSkillIds
 * - mcp_server / model_minimum / other: marked satisfied (best-effort, can't verify)
 */
export declare function checkDependencies(deps: SkillDependencyRow[], installedSkillIds: Set<string>): DependencyStatus;
//# sourceMappingURL=outdated.helpers.d.ts.map