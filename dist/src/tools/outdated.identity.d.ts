/**
 * @fileoverview skill_outdated tamper-check classification helpers
 * @module @skillsmith/mcp-server/tools/outdated.identity
 * @see SMI-6343 Wave 3 — tamper-check classification (AC#3)
 *
 * Split out of `outdated.ts` to keep that file under the audit:standards
 * 500-line gate. Adapts `outdated.ts`'s already-in-flight Wave 2 live/
 * historical registry-arm state into the shared, cross-package
 * `@skillsmith/core` identity-classification module (`skill-identity-
 * classification.ts`), and builds the per-state `OutdatedDiagnosis` copy
 * (H6 — this is the tool's entire user-facing surface, since `skill_outdated`
 * has zero renderers).
 */
import { type IdentityInconclusiveReason, type IdentitySignal, type OutdatedClassificationState, type RegistryLookupOutcome, type ManifestEntryForIdentity } from '@skillsmith/core';
import type { ContentComparisonOutcome } from '@skillsmith/core';
import type { OutdatedDiagnosis } from './outdated.js';
import type { RegistrySkillInfo } from './install.types.js';
/**
 * Reconstruct signal 2's registry-lookup outcome from the state `outdated.
 * ts`'s live registry arm already tracks — no second network call. See that
 * file's own doc comments (`liveArmOffline`/`quotaExhausted`/`liveArmFailed`)
 * for what each flag means; this function is deliberately the single place
 * that translates those Wave 2 flags into the shape Wave 3's shared
 * classification module expects.
 */
export declare function buildRegistryLookupOutcome(params: {
    liveArmAttempted: boolean;
    liveArmOffline: boolean;
    quotaExhausted: boolean;
    liveArmFailed: boolean;
    registryInfo: RegistrySkillInfo | null;
}): RegistryLookupOutcome;
/**
 * Why a plain `compareSkillContentHashes(...).outcome === 'unknown'` row
 * (i.e. one that never even reached signal evaluation) couldn't be
 * resolved. Distinct from signal 2's own inconclusive reason — this covers
 * the Wave 2 hash-comparison layer, not the Wave 3 identity layer.
 */
export declare function deriveUnknownReason(params: {
    liveArmOffline: boolean;
    quotaExhausted: boolean;
    liveArmFailed: boolean;
}): IdentityInconclusiveReason;
/**
 * Classify one manifest entry given its already-computed content-comparison
 * outcome. Resolves `expectedRootDir` (signal 3) from the entry's claimed
 * client, defaulting to the canonical client per `manifestKeyFor()`'s own
 * SMI-5894 default — `skill_outdated` only ever reads the GLOBAL manifest
 * (`loadManifest()` with no override), so every entry it processes is a
 * global-scope install and `CLIENT_NATIVE_PATHS` is the correct root for
 * every one of them (unlike the CLI's `manage.update.ts`, which must also
 * account for workspace-scoped installs — see that file's own resolution).
 */
export declare function classifyOutdatedEntry(params: {
    entry: ManifestEntryForIdentity;
    comparisonOutcome: ContentComparisonOutcome;
    localHash: string | null;
    localContent: string | null;
    registryLookup: RegistryLookupOutcome;
    unknownReason: IdentityInconclusiveReason;
}): {
    state: OutdatedClassificationState;
    signal: IdentitySignal | null;
    inconclusiveReason: IdentityInconclusiveReason | null;
};
/**
 * H6 — the literal per-state diagnosis copy table. `skill_outdated` has zero
 * renderers (verified: grep of `skill_outdated`/`OutdatedSkillInfo` across
 * `packages/cli/src`, `packages/vscode-extension/src`, `packages/website/src`
 * returns zero functional hits), so this MCP JSON response IS the v1
 * surface — the exact text here matters.
 */
export declare function buildOutdatedDiagnosis(params: {
    state: OutdatedClassificationState;
    signal: IdentitySignal | null;
    inconclusiveReason: IdentityInconclusiveReason | null;
}): OutdatedDiagnosis;
//# sourceMappingURL=outdated.identity.d.ts.map