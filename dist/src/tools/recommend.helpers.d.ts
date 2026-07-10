/**
 * @fileoverview Recommend Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/recommend.helpers
 */
import type { SkillRole } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
import type { SkillData } from './recommend.types.js';
/**
 * SMI-1631: Infer skill roles from tags when not explicitly set
 * Maps common tags to skill roles for better filtering
 * SMI-1725: Handles null/undefined input gracefully
 */
export declare function inferRolesFromTags(tags: string[]): SkillRole[];
/**
 * Transform a database skill to SkillData format for matching
 * SMI-1632: Added installable field to filter out collections
 */
export declare function transformSkillToMatchData(skill: {
    id: string;
    name: string;
    description: string | null;
    tags: string[];
    qualityScore: number | null;
    trustTier: string;
    roles?: SkillRole[];
    installable: boolean;
}): SkillData;
/**
 * Load skills from database via ToolContext
 * Returns skills transformed to SkillData format for matching
 * Note: Collection filtering is done in the candidate filter using naming patterns (SMI-1632)
 */
export declare function loadSkillsFromDatabase(context: ToolContext, limit?: number): Promise<SkillData[]>;
/**
 * Collection name patterns to filter out
 */
export declare const COLLECTION_PATTERNS: string[];
/**
 * Check if a skill is a collection based on naming patterns
 */
export declare function isSkillCollection(skillIdName: string, description: string): boolean;
//# sourceMappingURL=recommend.helpers.d.ts.map