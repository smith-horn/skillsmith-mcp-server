/**
 * @fileoverview Install Tool Types and Constants
 * @module @skillsmith/mcp-server/tools/install.types
 */
import { z } from 'zod';
import type { ScanReport, ScannerOptions } from '@skillsmith/core';
import type { TrustTier } from '@skillsmith/core';
/**
 * SMI-1533: Valid trust tier values
 * SMI-1809: Added 'local' for local skills
 */
export declare const VALID_TRUST_TIERS: readonly TrustTier[];
/**
 * SMI-1533: Validate and normalize trust tier value
 * Returns 'unknown' for invalid or missing values to ensure strictest scanning
 *
 * NOTE: 'verified' tier currently relies on registry data without cryptographic
 * verification. Future enhancement: implement signature verification for
 * Anthropic-verified skills using PKI.
 */
export declare function validateTrustTier(value: string | null | undefined): TrustTier;
/**
 * SMI-1533: Security scan configuration per trust tier
 * SMI-1809: Added 'local' tier for local skills
 *
 * - verified: Minimal scanning (trust Anthropic-verified skills)
 * - community: Standard scanning (balanced security)
 * - experimental: Aggressive scanning (highest scrutiny for new/beta skills)
 * - unknown: Most aggressive scanning
 * - local: No scanning (user's own local skills)
 */
export declare const TRUST_TIER_SCANNER_OPTIONS: Record<TrustTier, ScannerOptions>;
/**
 * SMI-1864: Action to take when a conflict is detected during skill update
 */
export type ConflictAction = 'overwrite' | 'merge' | 'cancel';
/**
 * SMI-1864: Information about detected conflicts during skill update
 */
export interface ConflictInfo {
    /** Whether the local skill has been modified since installation */
    hasLocalModifications: boolean;
    /** SHA-256 hash of the current local content */
    localHash: string;
    /** SHA-256 hash of the upstream (new) content */
    upstreamHash: string;
    /** SHA-256 hash of the original content at install time */
    originalHash: string;
    /** List of files that have been modified */
    modifiedFiles: string[];
}
/**
 * SMI-1864: Represents a specific conflict within a file during merge
 */
export interface MergeConflict {
    /** Line number where the conflict starts */
    lineNumber: number;
    /** Local (user-modified) content */
    local: string;
    /** Upstream (new version) content */
    upstream: string;
    /** Base (original) content for three-way merge */
    base: string;
}
/**
 * SMI-1864: Result of attempting to merge local and upstream changes
 */
export interface MergeResult {
    /** Whether the merge was successful without conflicts */
    success: boolean;
    /** The merged content if successful */
    merged?: string;
    /** List of conflicts that require manual resolution */
    conflicts?: MergeConflict[];
}
/** Input schema for install tool */
export declare const installInputSchema: z.ZodObject<{
    skillId: z.ZodString;
    force: z.ZodDefault<z.ZodBoolean>;
    skipScan: z.ZodDefault<z.ZodBoolean>;
    /** SMI-1788: Skip optimization transformation */
    skipOptimize: z.ZodDefault<z.ZodBoolean>;
    /** SMI-1864: Action to take when a conflict is detected during update */
    conflictAction: z.ZodOptional<z.ZodEnum<["overwrite", "merge", "cancel"]>>;
    /** SMI-3863: Confirm install of experimental/unknown tier skills */
    confirmed: z.ZodDefault<z.ZodBoolean>;
    /** SMI-4578: target client (defaults to SKILLSMITH_CLIENT env or claude-code) */
    client: z.ZodOptional<z.ZodEnum<["claude-code", "cursor", "copilot", "windsurf", "agents"]>>;
    /** SMI-4578: additional clients to fan-out into via copy (or symlink with --symlink) */
    alsoLink: z.ZodDefault<z.ZodArray<z.ZodEnum<["claude-code", "cursor", "copilot", "windsurf", "agents"]>, "many">>;
    /** SMI-4578: use symlinks instead of copies for alsoLink targets */
    symlink: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    force: boolean;
    skillId: string;
    confirmed: boolean;
    skipScan: boolean;
    skipOptimize: boolean;
    alsoLink: ("claude-code" | "cursor" | "windsurf" | "agents" | "copilot")[];
    symlink: boolean;
    conflictAction?: "overwrite" | "merge" | "cancel" | undefined;
    client?: "claude-code" | "cursor" | "windsurf" | "agents" | "copilot" | undefined;
}, {
    skillId: string;
    force?: boolean | undefined;
    confirmed?: boolean | undefined;
    skipScan?: boolean | undefined;
    skipOptimize?: boolean | undefined;
    conflictAction?: "overwrite" | "merge" | "cancel" | undefined;
    client?: "claude-code" | "cursor" | "windsurf" | "agents" | "copilot" | undefined;
    alsoLink?: ("claude-code" | "cursor" | "windsurf" | "agents" | "copilot")[] | undefined;
    symlink?: boolean | undefined;
}>;
export type InstallInput = z.infer<typeof installInputSchema>;
/** Output type for install tool */
export interface InstallResult {
    success: boolean;
    skillId: string;
    installPath: string;
    securityReport?: ScanReport;
    tips?: string[];
    error?: string;
    /** SMI-1533: Trust tier used for security scanning */
    trustTier?: TrustTier;
    /** SMI-1788: Optimization info (Skillsmith Optimization Layer) */
    optimization?: OptimizationInfo;
    /** SMI-1864: Conflict information when updating an existing skill */
    conflict?: ConflictInfo;
    /** SMI-1864: Result of merge operation if conflictAction was 'merge' */
    mergeResult?: MergeResult;
    /** SMI-1864: Available actions when a conflict requires user decision */
    requiresAction?: ConflictAction[];
    /** SMI-1895: Path to backup file created during conflict resolution */
    backupPath?: string;
    /** SMI-3137: Dependency intelligence extracted during install */
    depIntel?: import('./install.dep-helpers.js').DepIntelResult;
    /**
     * SMI-4588 Wave 2 (PR #3, decision #2): Whether the install actually
     * completed. Defaults to mirroring `success` for backwards-compat. Set
     * to `false` when `audit_mode: 'preventative'` blocked the install on a
     * pre-flight namespace collision; the agent must call
     * `apply_namespace_rename` then re-invoke `install_skill`.
     */
    installComplete?: boolean;
    /**
     * SMI-4588 Wave 2 (PR #3, decision #2): Blocking-mode envelope. Populated
     * when `audit_mode: 'preventative'` detected a pre-flight namespace
     * collision; carries the auditId, suggestion chain, and remediation hint
     * the agent uses to apply the rename inline.
     */
    pendingCollision?: import('../audit/namespace-audit.types.js').PendingCollision;
    /**
     * SMI-4588 Wave 2 (PR #3): Non-blocking namespace warnings. Populated in
     * `power_user` and `governance` modes when a pre-flight collision is
     * detected; the install still proceeds. Pre-flight scanner failure is
     * treated as a clean pass (`warnings: undefined`).
     */
    warnings?: import('../audit/namespace-audit.types.js').NamespaceWarning[];
}
/** Optimization info included in install result */
export interface OptimizationInfo {
    /** Whether skill was optimized */
    optimized: boolean;
    /** Sub-skills created (filenames) */
    subSkills?: string[];
    /** Whether companion subagent was generated */
    subagentGenerated?: boolean;
    /** Path to generated subagent (if any) */
    subagentPath?: string;
    /** Estimated token reduction percentage */
    tokenReductionPercent?: number;
    /** Original line count */
    originalLines?: number;
    /** Optimized line count */
    optimizedLines?: number;
}
export declare const CLAUDE_SKILLS_DIR: string;
export declare const SKILLSMITH_DIR: string;
export declare const MANIFEST_PATH: string;
/**
 * SMI-1864: Entry for a single installed skill in the manifest
 */
export interface SkillManifestEntry {
    id: string;
    name: string;
    version: string;
    source: string;
    /**
     * Absolute path where the skill is installed.
     * Required by type, but runtime JSON may omit it — consumers must guard.
     * @see SMI-3177
     */
    installPath: string;
    installedAt: string;
    lastUpdated: string;
    /** SMI-1864: SHA-256 hash of SKILL.md at install time for modification detection */
    originalContentHash?: string;
    /** SMI-skill-version-tracking Wave 1: SHA-256 hash of the content at last update */
    contentHash?: string;
    /** SMI-skill-version-tracking Wave 1: Pinned semver (Wave 2: update policy enforcement) */
    pinnedVersion?: string;
    /** SMI-skill-version-tracking Wave 1: How updates are handled (Wave 2: enforcement) */
    updatePolicy?: 'auto' | 'manual' | 'never';
}
export interface SkillManifest {
    version: string;
    installedSkills: Record<string, SkillManifestEntry>;
}
/** Parsed skill ID components */
export interface ParsedSkillId {
    owner: string;
    repo: string;
    path: string;
    isRegistryId: boolean;
}
export type { ParsedRepoUrl } from '@skillsmith/core';
/** Registry lookup result */
export interface RegistrySkillInfo {
    repoUrl: string;
    name: string;
    trustTier: TrustTier;
    quarantined?: boolean;
    /** SHA-256 hash of SKILL.md at index time for tamper detection */
    contentHash?: string;
}
//# sourceMappingURL=install.types.d.ts.map