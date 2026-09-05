/**
 * @fileoverview Install Tool Helper Functions
 * @module @skillsmith/mcp-server/tools/install.helpers
 */
import type { ToolContext } from '../context.js';
import { parseRepoUrl, type ParsedRepoUrl } from '@skillsmith/core';
import { type ClientId } from '@skillsmith/core/install';
import { type ParsedSkillId, type RegistrySkillInfo } from './install.types.js';
export { parseRepoUrl, type ParsedRepoUrl };
export { acquireManifestLock, releaseManifestLock, loadManifest, saveManifest, updateManifestSafely, } from './install.helpers.manifest.js';
/**
 * Parse skill ID or URL to get components
 * SMI-1491: Added isRegistryId flag to detect registry skill IDs vs direct GitHub URLs
 */
export declare function parseSkillId(input: string): ParsedSkillId;
/**
 * Look up skill in registry to get repo_url
 * SMI-1491: Enables install to work with registry IDs like "author/skill-name"
 *
 * Follows API-first pattern: tries live API, falls back to local DB
 *
 * SMI-5896: deliberately NOT folded into core's shared `resolveSkillApiFirst`
 * (used by `get_skill`/`skill_compare`) — three contract differences make that
 * a behavior change, not a refactor: (1) returns `null` rather than throwing
 * SKILL_NOT_FOUND; (2) `null` also covers "registry has it but no repo_url"
 * (discovery-only, SMI-2723) and that case must NOT fall through to a stale
 * local `repoUrl`; (3) it derives the security-relevant `quarantined` flag per
 * branch, which the shared resolver has no concept of — any future
 * consolidation must preserve that gate on both branches (cf. SMI-5447).
 */
export declare function lookupSkillFromRegistry(skillId: string, context: ToolContext, options?: {
    /**
     * SMI-6343: invoked when the live call failed specifically because the
     * caller's monthly API quota is exhausted (`ErrorCodes.NETWORK_QUOTA_
     * EXCEEDED`, thrown by `SkillsmithApiClient`'s retry loop on a
     * `monthly_quota_exceeded` 429 body) — lets a batch caller (e.g.
     * `skill_outdated`'s live registry arm) stop issuing further live calls
     * for the rest of its run instead of burning one failed call per
     * remaining skill. The `error` argument is the caught `SkillsmithError`
     * itself — its `.message` already carries the used/limit/tier and the
     * formatted reset-time text (`client.ts`'s quota-error construction),
     * so a caller building a user-facing diagnosis should read `.message`
     * rather than re-deriving reset time from `.details.resetsAt`. Purely
     * additive: this function's existing
     * swallow-every-other-error-and-fall-back-to-local-DB behavior is
     * unchanged, and every existing caller that doesn't pass `options` sees
     * zero behavior change.
     */
    onQuotaExceeded?: (error: unknown) => void;
    /**
     * SMI-6343 (pr-reviewer-gate fix): invoked for EVERY caught error
     * (network error, DNS, timeout, quota exceeded — this fires in addition
     * to, not instead of, `onQuotaExceeded` for the quota case), before
     * falling through to the local-DB fallback. This function never
     * rethrows — it always resolves, either to `null` or to a value from
     * the local-DB fallback (which itself never carries a `contentHash`) —
     * so a caller that needs to know "the live attempt failed" cannot infer
     * that from a thrown exception; it never occurs. Without this signal,
     * a caller like `skill_outdated`'s live registry arm has no way to
     * distinguish "the registry genuinely has nothing new" from "the live
     * call broke and we silently got local-DB data (or nothing) instead" —
     * confirmed by a pr-reviewer-gate finding that the prior fix's `try/catch`
     * around this function's call site was dead code for this exact reason.
     */
    onLiveLookupFailed?: (error: unknown) => void;
}): Promise<RegistrySkillInfo | null>;
/**
 * SMI-3221: Detect git-crypt encrypted content fetched from GitHub.
 * raw.githubusercontent.com serves encrypted bytes for repos using git-crypt.
 * The magic header is \x00GITCRYPT (hex 00474954435259505400).
 */
export declare function assertNotEncrypted(content: string, filePath: string): void;
/**
 * Fetch file from GitHub
 * SMI-1491: Added optional branch parameter to use branch from repo_url
 */
export declare function fetchFromGitHub(owner: string, repo: string, filePath: string, branch?: string): Promise<string>;
/** Validation result for SKILL.md */
export interface SkillMdValidation {
    valid: boolean;
    errors: string[];
}
/**
 * Validate SKILL.md content
 */
export declare function validateSkillMd(content: string): SkillMdValidation;
/**
 * Generate post-install tips
 *
 * SMI-5894 (Wave 1 Step 5): `client`/`skillsDir` default to the canonical
 * (Claude Code) client so any caller that doesn't pass them keeps seeing
 * exactly the previous "Claude Code" / `~/.claude/skills/` wording. Note:
 * as of this fix this function has no remaining callers in this package —
 * the actual MCP install flow's tips come from the shared
 * `@skillsmith/core` `generateTips()` (via `SkillInstallationService`),
 * which received the equivalent fix. This one is fixed too so it can't
 * reintroduce the same hardcoded-client bug if it's ever wired back up.
 */
export declare function generateTips(skillName: string, client?: ClientId, skillsDir?: string): string[];
/**
 * SMI-1788: Optimization info type for tips generation
 * SMI-1803: Exported for external use
 */
export interface OptimizationInfoForTips {
    optimized: boolean;
    subSkills?: string[];
    subagentGenerated?: boolean;
    subagentPath?: string;
    tokenReductionPercent?: number;
    originalLines?: number;
    optimizedLines?: number;
}
/**
 * SMI-1788: Generate post-install tips with optimization info
 *
 * SMI-5894 (Wave 1 Step 5): `client`/`skillsDir` (both optional, added after
 * `claudeMdSnippet` to preserve the existing positional signature) default
 * to the canonical client, same rationale as `generateTips` above — this
 * function currently has no live caller either; see that function's
 * docstring for the full explanation.
 */
export declare function generateOptimizedTips(skillName: string, optimizationInfo: OptimizationInfoForTips, claudeMdSnippet?: string, client?: ClientId, skillsDir?: string): string[];
export { hashContent, type ModificationResult, detectModifications, createSkillBackup, storeOriginal, loadOriginal, cleanupOldBackups, getBackupsDir, } from './install.conflict-helpers.js';
//# sourceMappingURL=install.helpers.d.ts.map