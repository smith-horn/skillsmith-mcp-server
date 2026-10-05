/**
 * @fileoverview Install Tool Manifest Helpers (locking, load/save)
 * @module @skillsmith/mcp-server/tools/install.helpers.manifest
 *
 * Split out of install.helpers.ts per governance code review (500-line file
 * cap, CLAUDE.md CI Health Requirements) — same pattern already used by
 * install.conflict-helpers.ts.
 */
import { type SkillManifest } from './install.types.js';
/**
 * Load or create manifest.
 *
 * ADR-139 (SMI-6274 Wave 4) / GPT-5.6-Sol PR review: `manifestPath` is now an
 * optional parameter (defaulting to the GLOBAL `MANIFEST_PATH`, byte-identical
 * to every existing call site's behavior) so `install.ts`'s conflict
 * pre-flight can read the CORRECT (scope-resolved) manifest for a
 * workspace-scoped reinstall instead of either always reading global (wrong
 * manifest) or being skipped entirely for workspace scope (silently
 * dropping `conflictAction`'s only effect — `SkillInstallationService.install()`
 * itself never consumes that option). The other callers
 * (`outdated.action.ts` and `skill-updates.ts`) keep calling this with zero
 * args, unaffected.
 *
 * SMI-6733: this reader stays LENIENT deliberately. `updateManifestSafely` was
 * once a caller — it is not any more, because a write must not proceed from a
 * failed read (ADR-171 § 1), so it takes `loadManifestForWrite` instead.
 * Making this reader strict would turn read-only reports into thrown errors,
 * which is why ADR-171 specifies two wrappers rather than one strict reader.
 *
 * SMI-6733 Phase 2 Wave 2, measured not assumed: this function now has **zero
 * production callers**. All three — `install.ts`'s conflict pre-flight,
 * `outdated.action.ts` and `skill-updates.ts` — take `loadManifestWithWarning`
 * below, so a degraded read reaches the user instead of vanishing. What remains
 * is the re-export in `install.helpers.ts` and the `vi.mock` factories in
 * `install.test.ts` / `outdated.test.ts` / `skill-updates.test.ts`.
 *
 * So this is now the easy door ADR-171 names as the anti-pattern
 * (`fan-out.manifest.ts:103`): a state-discarding reader sitting beside the
 * correct one, where the next writer will reach for it. Retiring it is SMI-6906
 * — it is a 57-reference mock re-point across three test files plus an API
 * change to `install.helpers.ts`, which is why it is its own change and not
 * this one. **Do not add a caller.**
 */
export declare function loadManifest(manifestPath?: string): Promise<SkillManifest>;
/**
 * ADR-171 § 4b / § 10 (SMI-6733 Phase 2 Wave 2): a SIBLING of {@link
 * loadManifest} above, not a replacement for it and not a change to its
 * return type. `outdated.action.ts` and `skill-updates.ts` are the only two
 * callers that need the degraded-read signal — this wraps
 * `@skillsmith/core`'s `loadManifestLenient` (the ADR-171 § 4b read-side
 * policy wrapper) so those two tools can surface `warning` at their
 * response root (ADR-171 § 10's fixed wire contract: `warning?: string`,
 * same key in both tools, carrying this value unchanged — no restructuring,
 * no new union).
 *
 * The cast mirrors `updateManifestSafely`'s own `loadManifestForWrite` cast
 * immediately below — `@skillsmith/core`'s `SkillManifest` and this
 * package's `SkillManifest` (`install.types.ts`) are two independently
 * declared, structurally identical interfaces (`version: string`,
 * `installedSkills: Record<string, SkillManifestEntry>`); ADR-171 § 9
 * forbids merging the three manifest *implementations* into one, so the
 * cast at this one boundary is the documented trust boundary, not a hole.
 */
export declare function loadManifestWithWarning(manifestPath?: string): Promise<{
    manifest: SkillManifest;
    warning: string | null;
}>;
/**
 * Save manifest
 * SMI-1533: Uses atomic write pattern with lock
 */
export declare function saveManifest(manifest: SkillManifest): Promise<void>;
/**
 * SMI-1533: Safely update manifest with locking
 * Prevents race conditions during concurrent install operations
 *
 * SMI-6735: locking now delegates to `withFileLock` (`@skillsmith/core`'s
 * owned-lock primitive) instead of a hand-rolled age-based EEXIST/mtime
 * protocol — this module and `@skillsmith/core`'s own `ManifestManager` used
 * to run two independent age-based lock implementations against the
 * BYTE-IDENTICAL `MANIFEST_PATH + '.lock'` file in the same MCP server
 * process, which is not mutual exclusion.
 *
 * The guard fires FIRST, before `withFileLock` ever attempts to create a
 * lock file (SMI-6343 follow-up: MANIFEST_PATH is homedir-derived with no
 * override parameter, so only this guard — and the $HOME test sandbox —
 * protects it).
 */
export declare function updateManifestSafely(updateFn: (manifest: SkillManifest) => SkillManifest): Promise<void>;
//# sourceMappingURL=install.helpers.manifest.d.ts.map