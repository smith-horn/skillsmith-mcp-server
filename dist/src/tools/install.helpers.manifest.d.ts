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
 * Acquire a file lock for manifest operations
 * SMI-1533: Prevents race conditions during concurrent installs
 */
export declare function acquireManifestLock(): Promise<void>;
/**
 * Release the manifest lock
 */
export declare function releaseManifestLock(): Promise<void>;
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
 */
export declare function updateManifestSafely(updateFn: (manifest: SkillManifest) => SkillManifest): Promise<void>;
//# sourceMappingURL=install.helpers.manifest.d.ts.map