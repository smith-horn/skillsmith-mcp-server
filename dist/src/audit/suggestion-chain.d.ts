/**
 * @fileoverview 3-tier rename fall-through chain (SMI-4588 Wave 2 Step 2, PR #2).
 * @module @skillsmith/mcp-server/audit/suggestion-chain
 *
 * Generates up to 3 ordered rename candidates per decision #11:
 *
 *   1. `${author}-${token}`                            (e.g. `anthropic-ship`)
 *   2. `${author}-${packDomain}-${token}`              (e.g. `anthropic-codehelper-ship`)
 *   3. `${author}-${packDomain}-${token}-${shortHash}` (e.g. `anthropic-codehelper-ship-a4f9`)
 *
 * Each candidate is checked against the supplied `existingInventory` — when
 * a candidate collides with another entry's identifier (case-insensitive),
 * the chain advances to the next tier. If all 3 collide, `exhausted: true`
 * and the caller surfaces the chain to the user via `customName`.
 *
 * Inventory contract (plan §1 Edit 7): `existingInventory` is the
 * snapshot **before** the candidate skill is appended. Otherwise the
 * candidate self-collides at tier 1 and cascades unnecessarily. The install
 * pre-flight maintains two inventory views — `existingInventory` for
 * suggestion generation, `augmentedInventory` for `detectCollisions`.
 *
 * `shortHash` derivation: first 4 hex chars of
 *   sha256(`${authorPath}/${token}/${packDomain}`)
 *
 * Birthday-bound collision-free for inventories <10k entries (Wave 0 spike
 * §4 — measured 0% on 36-skill fixture, theoretical bound holds).
 *
 * Plan: docs/internal/implementation/smi-4588-rename-engine-ledger-install.md §1.
 */
import type { InventoryEntry } from './collision-detector.types.js';
import type { SuggestionChain } from './rename-engine.types.js';
/**
 * Compute the deterministic 4-char `shortHash` suffix used at chain tier 3.
 * Exported for tests; in normal flow callers use `generateSuggestionChain`.
 */
export declare function computeShortHash(authorPath: string, token: string, packDomain: string | null): string;
/**
 * Sanitize an author / tag / token segment for safe use in an identifier.
 * Lowercases, replaces non-`[a-z0-9]` runs with `-`, trims, and dedupes
 * consecutive separators. Mirrors the rule in plan §1 step 1.
 */
export declare function sanitizeSegment(raw: string): string;
export interface GenerateSuggestionChainInput {
    /**
     * The colliding entry's base token (e.g. `ship` for `/ship`,
     * `code-helper` for a skill named `code-helper`). Already stripped of
     * any leading `/` for commands; the chain produces a token-only result
     * — formatting back to `/foo` is the apply-path's job.
     */
    token: string;
    /**
     * Author segment from manifest. Sanitized inside; pass raw. When
     * `null`/`''`, tier 1 falls through to using the supplied `tagFallback`.
     */
    author: string | null;
    /**
     * Pack-domain segment (e.g. `codehelper`). Sanitized inside. When
     * `null`, tier 2 is skipped and tier 3 omits the pack-domain segment.
     */
    packDomain: string | null;
    /**
     * Tag fallback when `author` is unavailable. Already-sanitized values
     * are accepted; the function re-sanitizes idempotently.
     */
    tagFallback?: string | null;
    /**
     * Repo-relative path used to derive `shortHash` at tier 3. Plan §1 calls
     * for the entry's `source_path` resolved repo-relative; the caller is
     * responsible for the resolution since the rename engine has no concept
     * of "repo root".
     */
    authorPath: string;
    /**
     * Pre-candidate inventory snapshot (Edit 7). MUST NOT contain the
     * candidate skill — the chain generator self-collides at tier 1
     * otherwise.
     */
    existingInventory: ReadonlyArray<InventoryEntry>;
}
/**
 * Walk the 3-tier rename fall-through chain (decision #11). Returns up to
 * 3 ordered candidates and an `exhausted` flag. The caller picks the first
 * non-colliding candidate as the recommended rename.
 *
 * Returns an empty `candidates` array iff `token` itself sanitizes to an
 * empty string (defensive — pathological inputs).
 */
export declare function generateSuggestionChain(input: GenerateSuggestionChainInput): SuggestionChain;
//# sourceMappingURL=suggestion-chain.d.ts.map