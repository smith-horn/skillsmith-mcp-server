/**
 * @fileoverview Install Tool Types and Constants
 * @module @skillsmith/mcp-server/tools/install.types
 */
import { z } from 'zod';
import type { ScanReport, ScannerOptions } from '@skillsmith/core';
import type { TrustTier } from '@skillsmith/core';
import { type ClientId } from '@skillsmith/core/install';
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
    client: z.ZodOptional<z.ZodEnum<[ClientId, ...ClientId[]]>>;
    /** SMI-4578: additional clients to fan-out into via copy (or symlink with --symlink) */
    alsoLink: z.ZodDefault<z.ZodArray<z.ZodEnum<[ClientId, ...ClientId[]]>, "many">>;
    /** SMI-4578: use symlinks instead of copies for alsoLink targets */
    symlink: z.ZodDefault<z.ZodBoolean>;
    /**
     * SMI-5982 code-review fix #1: this MCP server is long-running, so its own
     * `process.cwd()` is fixed at server launch and generally does NOT track
     * the calling editor/agent's actual project — passing this explicitly is
     * the only reliable way to place a project-scoped companion-agent output
     * (currently only Antigravity's directory-package mode) correctly.
     */
    cwd: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    /**
     * ADR-139 (SMI-6274 Wave 4) / GPT-5.6-Sol PR review: explicit install
     * scope, mirroring the CLI's `--scope` flag (rank 1 of ADR-139 point 2's
     * precedence chain). This MCP server is long-running (see `cwd` above) —
     * `SKILLSMITH_SCOPE` (rank 2, read automatically by `resolveScopedSkillsDir`
     * when this is omitted) applies uniformly to EVERY tool call for the
     * server's entire process lifetime, so it cannot express "install THIS
     * skill workspace-scoped, THAT one globally" within one long-lived MCP
     * session the way a per-invocation CLI env var naturally can. A structured
     * per-call parameter closes that gap and gives MCP callers the same
     * per-call precision as the CLI flag, while `SKILLSMITH_SCOPE` remains a
     * valid fallback for MCP client configs that can only set env vars at
     * server-launch time.
     */
    scope: z.ZodOptional<z.ZodEnum<["global", "workspace"]>>;
}, "strip", z.ZodTypeAny, {
    force: boolean;
    skillId: string;
    confirmed: boolean;
    skipScan: boolean;
    skipOptimize: boolean;
    alsoLink: ClientId[];
    symlink: boolean;
    client?: ClientId | undefined;
    conflictAction?: "overwrite" | "merge" | "cancel" | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
}, {
    skillId: string;
    client?: ClientId | undefined;
    force?: boolean | undefined;
    confirmed?: boolean | undefined;
    skipScan?: boolean | undefined;
    skipOptimize?: boolean | undefined;
    conflictAction?: "overwrite" | "merge" | "cancel" | undefined;
    alsoLink?: ClientId[] | undefined;
    symlink?: boolean | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
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
    /**
     * SMI-5894 (Wave 1 Step 3): which client this installation targets.
     * Absent on manifest entries written before multi-client re-keying —
     * treat a missing value as the canonical client (`claude-code`), matching
     * `manifestKeyFor()`'s own default. Mirrors the equivalent field on core's
     * own `SkillManifestEntry` (`skill-installation.types.ts`) — this
     * mcp-server-local copy predates that one and was never widened to match
     * until SMI-6343 Wave 3 needed it for the path-unresolved identity signal.
     */
    client?: ClientId;
    /**
     * ADR-145 §1: who asserts this entry's identity, independent of `source`
     * — `'registry'` (Skillsmith resolved + installed it) or `'local'` (the
     * user positively asserted this is their own / not registry-tracked).
     * Absent = legacy, no assertion ever recorded (NEVER defaults to
     * `'registry'`). Mirrors core's own `SkillManifestEntry`
     * (`skill-installation.types.ts`) — widened here, same pattern as
     * `client` above, because `apply_manifest_reconcile` (SMI-6343 Wave 4)
     * is the first mcp-server-local reader/writer of this field.
     */
    provenance?: 'local' | 'registry';
    /**
     * ADR-145 §3 / ADR-144 §6: ISO-8601 UTC timestamp of the last successful
     * re-verification of this entry's on-disk content hash against the
     * registry's content hash for the claimed `id`. Written only by
     * `apply_manifest_reconcile`'s `verify` action, only on a hash match.
     */
    verifiedAt?: string;
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
    /**
     * SMI-6343 Wave 3: the registry's recorded author for this skill id, used
     * by the shared identity-classification module's front-matter-contradiction
     * signal. `null`/absent when the registry has no author on record.
     */
    author?: string | null;
}
//# sourceMappingURL=install.types.d.ts.map