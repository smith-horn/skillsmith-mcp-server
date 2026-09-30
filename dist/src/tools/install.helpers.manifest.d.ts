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
 * itself never consumes that option). Every other caller
 * (`outdated.ts`, `skill-updates.ts`, this file's own `updateManifestSafely`)
 * keeps calling this with zero args, unaffected.
 */
export declare function loadManifest(manifestPath?: string): Promise<SkillManifest>;
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