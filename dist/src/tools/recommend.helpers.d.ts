/**
 * @fileoverview Recommend Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/recommend.helpers
 */
import type { SkillRole, ApiSearchResult } from '@skillsmith/core';
import type { SkillMatchResult } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
import type { SkillData, SkillRecommendation } from './recommend.types.js';
import type { LocalSkill } from '../indexer/LocalIndexer.js';
/**
 * Build a `suggestion` string for a zero-recommendation response, explaining
 * that candidates_considered: 0 does not indicate a registry/backend fault
 * and pointing at concrete next steps.
 */
export declare function buildEmptyRecommendationSuggestion(context: {
    installedCount: number;
    hasProjectContext: boolean;
    roleFilter?: SkillRole;
}): string;
/**
 * SMI-1631: Infer skill roles from tags when not explicitly set
 * Maps common tags to skill roles for better filtering
 * SMI-1725: Handles null/undefined input gracefully
 */
export declare function inferRolesFromTags(tags: string[]): SkillRole[];
/**
 * SMI-1837: Convert a disk-scanned LocalSkill to SkillRecommendation format.
 * SMI-5562: `security` is intentionally left unset (undefined) — local skills
 * are never registry-scanned, so absence is the honest signal, distinct from
 * `security.passed === null` ("scanned, no verdict yet").
 */
export declare function buildLocalSkillRecommendation(skill: LocalSkill, matchReason: string): SkillRecommendation;
/**
 * Build a SkillRecommendation from a registry API recommendation row.
 * SMI-5562: description + security summary — skills-recommend hydrates
 * security_score/last_scanned_at/security_findings/quarantined server-side.
 */
export declare function buildApiRecommendation(skill: ApiSearchResult, stack: string[]): SkillRecommendation;
/**
 * Build a SkillRecommendation from a local-DB semantic match result
 * (the offline/API-failure fallback path).
 *
 * SMI-5562 (safety-critical): `security` is `undefined` when the row was
 * never scanned (`securityScannedAt == null`) — mirrors
 * `deriveSecuritySummaryFromApiSkill`'s API-path semantics exactly. A
 * defined-but-null object here would narrate as "scanned, no verdict yet"
 * under the tool description's 3-state contract, which is false for a skill
 * that was never scanned at all. When a summary IS returned, riskScore/
 * scannedAt/passed pass through RAW from SkillData — never coerce/default to
 * 0/a fabricated timestamp, which would read as "confirmed clean."
 */
export declare function buildDbFallbackRecommendation(result: SkillMatchResult, role: SkillRole | undefined): SkillRecommendation;
/**
 * Transform a database skill to SkillData format for matching
 * SMI-1632: Added installable field to filter out collections
 * SMI-5562: Added flat security fields, copied straight through with no
 * defaulting — `loadSkillsFromDatabase` passes full repository `Skill` rows
 * (packages/core/src/types/skill.ts), so these are always present on input.
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
    riskScore: number | null;
    securityFindingsCount: number;
    securityScannedAt: string | null;
    securityPassed: boolean | null;
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