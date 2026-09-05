/**
 * @fileoverview Helpers for the local-inventory scanner (SMI-4587 Wave 1 Step 2).
 * @module @skillsmith/mcp-server/utils/local-inventory.helpers
 *
 * Pure functions extracted to keep `local-inventory.ts` thin — CLAUDE.md
 * regex extraction (testable in isolation) and the shared skill-directory
 * scan walk both live here.
 */
import type { InventoryEntry, ScanWarning } from './local-inventory.types.js';
/**
 * Stable warning code catalog. Keep this in sync with the writer; the audit
 * report renders messages keyed off `code`.
 */
export declare const WARNING_CODES: {
    readonly TRIGGER_SURFACE_TRUNCATED: "namespace.inventory.trigger_surface_truncated";
    readonly BOOTSTRAP_FAILED: "namespace.inventory.bootstrap_failed";
    readonly CLAUDE_MD_RECALL_LOW: "namespace.inventory.claude_md_recall_low";
    readonly REGEX_EXTRACTION_SKIPPED: "namespace.inventory.regex_extraction_skipped";
    readonly UNMANAGED_SKILL_BOOTSTRAPPED: "namespace.inventory.unmanaged_skill_bootstrapped";
    readonly PARSE_FAILED: "namespace.inventory.parse_failed";
    /** SMI-6228 Source 5 (plugin-skill scan): an enabled plugin id could not be
     * resolved to a scannable `skills/` directory — malformed
     * `<plugin>@<marketplace>` shape, missing cache directory, or the cache
     * directory doesn't have exactly one version subdirectory. Always
     * fail-soft: the plugin is skipped, not thrown. */
    readonly PLUGIN_SCAN_SKIPPED: "namespace.inventory.plugin_scan_skipped";
    /** SMI-6240 Source 6: `<projectDir>/.claude/skills` resolved (post-symlink)
     * outside `projectDir` — same `isWithinRoot` guard as Source 5. */
    readonly PROJECT_SKILLS_SCAN_SKIPPED: "namespace.inventory.project_skills_scan_skipped";
};
/** Maximum trigger phrases retained per entry — matches `OverlapDetector.MAX_TRIGGER_PHRASES_PER_SKILL`. */
export declare const MAX_TRIGGER_PHRASES_PER_SKILL = 50;
/**
 * Cap an array of trigger phrases at MAX_TRIGGER_PHRASES_PER_SKILL. When
 * truncation occurs, append a warning of code `trigger_surface_truncated`
 * with the dropped count so the user sees it in the audit report.
 */
export declare function capTriggerSurface(identifier: string, phrases: string[], warnings: ScanWarning[]): string[];
/**
 * Split a description into sentence-level trigger phrases. Empty or
 * whitespace-only segments are filtered.
 */
export declare function splitDescriptionToPhrases(description: string | undefined): string[];
/**
 * Read the YAML frontmatter from a `.md` file. Returns `{}` if no
 * frontmatter or the file cannot be parsed.
 */
export declare function readFrontmatter(filePath: string): Record<string, unknown>;
/**
 * Extract the body of a `.md` file (everything after the closing
 * frontmatter delimiter, or the full content if no frontmatter).
 */
export declare function readBody(filePath: string): string;
/**
 * Pull the first non-empty line from a body string. Used as the fallback
 * trigger surface for frontmatter-less command files.
 */
export declare function firstNonEmptyLine(body: string): string;
/**
 * Stable identifier for a CLAUDE.md trigger line. The identifier doubles as
 * dedup key — two scans of the same line produce the same id. Hashed
 * because the line itself can be long; first 12 hex chars are sufficient.
 */
export declare function hashClaudeMdLine(claudeMdPath: string, line: string): string;
/**
 * Best-effort regex extractor for CLAUDE.md trigger phrases.
 *
 * Two patterns are recognized (per Wave 0 spike goal #3):
 *
 * 1. Bullet items under headings matching
 *    `/^#{1,3}\s*(Trigger phrases|Use when|Skills)\b/i`. Recall is
 *    best-effort — false negatives expected for non-standard heading text.
 * 2. Any line containing the high-confidence marker
 *    `<!-- skillsmith:trigger -->`. The full line is captured as a phrase.
 *
 * Returns one `InventoryEntry` per extracted line. Failures (file missing,
 * unparseable) emit a `warnings[]` entry — never throw.
 */
export declare function extractClaudeMdTriggers(claudeMdPath: string, warnings: ScanWarning[]): InventoryEntry[];
/**
 * Parse `~/.claude/settings.json`'s `enabledPlugins` map and return the ids
 * (`<plugin>@<marketplace>` shape) whose value is exactly `true` (SMI-6228
 * Source 5). Anything else — `false`, missing, a non-boolean value, a
 * missing `enabledPlugins` key, a missing/unreadable/malformed
 * settings.json — yields `[]` (fail-soft; a malformed-JSON file
 * additionally raises a `PARSE_FAILED` warning since that indicates a
 * corrupt file, not a normal absent state).
 *
 * The exact-`true` check is load-bearing, not incidental: a disabled plugin
 * (`false`) must NOT surface its skills as inventory entries, or a stale
 * collision against a since-disabled plugin would resurface as a false
 * positive.
 *
 * SECURITY-RELEVANT DUPLICATION (ADR-137): this function is the TS
 * reference implementation for a native `.mjs` reimplementation at
 * `scripts/lib/mcp-command-guard.plugin-scan.mjs` (SMI-6229) — not a shared
 * import, because that file runs on a `SessionStart` hook path where this
 * package's `dist/` may not exist. The `.mjs` twin decides which
 * plugin-registered MCP servers `scripts/lib/mcp-command-guard.mjs`'s
 * `findHostedScopeViolations` check evaluates for a hosted server that
 * exposes write-capable database tools (`execute_sql`, `apply_migration`).
 * A silent divergence between the two implementations is a security gap,
 * not a cosmetic inconsistency: it would mean that guard scans a different
 * plugin set than this scanner does. Enforced by
 * `packages/mcp-server/tests/unit/plugin-scan-parity.test.ts`.
 */
export declare function readEnabledPluginIds(settingsPath: string, warnings: ScanWarning[]): string[];
/** Resolve `~/.skillsmith/manifest.json`, or `null` if absent/unreadable. */
export declare function loadManifest(manifestPath: string): Record<string, unknown> | null;
/**
 * Look up an `author` (and `tags`) for a given skill identifier in the
 * manifest. Manifest shape varies — be tolerant: walk the top-level keys
 * and any obvious `skills` array/object.
 */
export declare function lookupAuthor(manifest: Record<string, unknown> | null, identifier: string): {
    author?: string;
    tags?: string[];
};
/**
 * Cross-platform mtime read. Returns `undefined` on stat failure rather
 * than throwing — mtime is informational for ordering, not load-bearing.
 */
export declare function readMtime(filePath: string): number | undefined;
export { joinPath, isSafePathComponent, isWithinRoot, } from './local-inventory.path-safety.helpers.js';
/**
 * `parseYamlFrontmatter` returns `string | string[] | undefined` for
 * description (depending on block-scalar syntax). Normalize to a single
 * string for downstream consumers.
 */
export declare function coerceDescription(value: unknown): string | undefined;
/**
 * Core directory walk shared by every "one SKILL.md per subdirectory" scan
 * source (`local-inventory.ts`'s Source 1/5/6 wrappers): one entry per
 * subdirectory, from `SKILL.md` frontmatter when present, else the
 * directory name (with a soft warning). Returns entries with
 * `client`/`origin`/`pluginId` unset — callers tag their own. Moved here
 * from `local-inventory.ts` to keep that file under the 500-line cap.
 */
export declare function scanSkillsDirEntries(skillsDir: string, manifest: Record<string, unknown> | null, warnings: ScanWarning[]): InventoryEntry[];
//# sourceMappingURL=local-inventory.helpers.d.ts.map