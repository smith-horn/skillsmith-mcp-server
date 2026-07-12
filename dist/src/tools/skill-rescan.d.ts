/**
 * @fileoverview skill_rescan MCP tool -- re-scan installed skills with current
 * SecurityScanner patterns.
 * @module @skillsmith/mcp-server/tools/skill-rescan
 * @see SMI-3511: GAP-08 No re-scanning of installed skills
 * @see SMI-5645: dependency backfill for skills installed before the SMI-5639
 *   dependency-persistence fix shipped (`@skillsmith/mcp-server@0.7.1`) --
 *   see `backfillSkillDependencies` in `./skill-rescan.helpers.ts` for the
 *   full design rationale (current-vs-historical SKILL.md, idempotency).
 *
 * When new detection patterns are added (SSRF, split-word, homoglyph, etc.),
 * already-installed skills are never re-evaluated. This tool fills that gap
 * by reading installed SKILL.md files and running SecurityScanner against each.
 */
import { z } from 'zod';
import { QuarantineRepository, type QuarantineSeverity, type SkillDependencyRepository } from '@skillsmith/core';
/**
 * Input schema for skill_rescan tool
 */
export declare const skillRescanInputSchema: z.ZodObject<{
    /** Optional skill name filter -- rescan only the named skill */
    skillName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    skillName?: string | undefined;
}, {
    skillName?: string | undefined;
}>;
export type SkillRescanInput = z.infer<typeof skillRescanInputSchema>;
/**
 * Per-skill rescan result
 */
export interface SkillRescanEntry {
    /** Skill directory name (e.g. "author/skill-name" or "skill-name") */
    skill: string;
    /**
     * Whether the scan passed. Reflects the SKILL.md gate (no high/critical
     * findings, risk below threshold) AND the absence of any sibling execution
     * threat (code_execution/obfuscated_directive). Non-execution sibling findings
     * do NOT flip this (SMI-5422 Phase 2 FP-safety).
     */
    passed: boolean;
    /** Number of findings */
    findingCount: number;
    /** Risk score from 0-100 */
    riskScore: number;
    /** Summary of findings by severity */
    severityCounts: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
    /** Top findings (max 5 per skill to keep output manageable) */
    topFindings: Array<{
        type: string;
        severity: string;
        message: string;
        lineNumber?: number;
        /** Relative sibling path when the finding came from a bundled sibling (SMI-5422 Phase 2). */
        location?: string;
    }>;
    /**
     * SMI-5422 Phase 2: bundled-sibling scan summary. Present only when the skill
     * has scannable siblings or any were dropped/skipped. Surfaces dropped/skipped
     * files so a count/size cap is never a silent omission (CLAUDE.md no-silent-cap).
     */
    bundledSiblings?: {
        scannedFiles: string[];
        rejectableFiles: string[];
        droppedForCount: string[];
        skippedOversize: string[];
        skippedSymlinkEscape: string[];
    };
    /** Error message if skill could not be read */
    error?: string;
    /**
     * SMI-5645: number of `skill_dependencies` rows written (inserted or
     * upserted) for this skill during this rescan. Reflects the CURRENTLY
     * installed SKILL.md content, not a historical/original-install-time
     * snapshot -- there is no such snapshot to recover (that gap is exactly
     * what this backfill closes). A skill whose SKILL.md was edited since
     * install backfills against the edited content; this is intentional,
     * best-effort behavior, not a correctness bug. Idempotent: rescanning the
     * same skill repeatedly reports the same non-zero count each time without
     * accumulating duplicate rows (see `backfillSkillDependencies` in
     * `./skill-rescan.helpers.ts`). Always `0` when no dependency repository
     * is supplied to the scan, on extraction/persistence error (contained,
     * never fails the scan), or when no dependencies are detected.
     */
    dependenciesBackfilled: number;
}
/**
 * Response from skill_rescan tool
 */
export interface SkillRescanResponse {
    /** Number of skills scanned */
    scannedCount: number;
    /** Number of skills that failed the scan */
    failedCount: number;
    /** Per-skill results */
    results: SkillRescanEntry[];
    /** Error message when a specific skill is not found */
    error?: string;
    /**
     * SMI-5645: sum of every entry's `dependenciesBackfilled` this run. See
     * that field's doc for the current-vs-historical-SKILL.md caveat and
     * idempotency guarantee.
     */
    totalDependenciesBackfilled: number;
}
/**
 * MCP tool definition for skill_rescan
 */
export declare const skillRescanToolSchema: {
    name: "skill_rescan";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillName: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
/**
 * Map SecurityScanner finding severity counts to a QuarantineSeverity.
 *
 * Critical findings → MALICIOUS (permanent quarantine, confirmed threat)
 * High findings (no critical) → SUSPICIOUS (manual review required)
 * Risk score >= threshold only → RISKY (import with warnings)
 *
 * @see SMI-5358: advisory → quarantine linkage for rescan
 */
export declare function findingsToQuarantineSeverity(hasCritical: boolean, hasHigh: boolean): QuarantineSeverity;
export { discoverInstalledSkills } from './skill-rescan.helpers.js';
export declare const executeSkillRescan: (input: {
    skillName?: string | undefined;
}, overrideDir?: string | undefined, quarantineRepo?: QuarantineRepository | undefined, skillDependencyRepo?: SkillDependencyRepository | undefined) => Promise<SkillRescanResponse>;
//# sourceMappingURL=skill-rescan.d.ts.map