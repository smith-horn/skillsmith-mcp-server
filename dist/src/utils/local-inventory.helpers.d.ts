/**
 * @fileoverview Helpers for the local-inventory scanner (SMI-4587 Wave 1 Step 2).
 * @module @skillsmith/mcp-server/utils/local-inventory.helpers
 *
 * Pure functions extracted to keep `local-inventory.ts` thin. CLAUDE.md
 * regex extraction lives here so the regex behavior can be tested in
 * isolation. Frontmatter helpers wrap the existing `parseYamlFrontmatter`.
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
 * Resolve `~/.skillsmith/manifest.json` and return the parsed object, or
 * `null` if absent / unreadable. Scanner uses this to populate
 * `entry.meta.author` for installed skills.
 */
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
/**
 * Resolve absolute path joining `dir + filename`. Centralized so future
 * portability work (E-ANTI-1 v2) can swap in a relative-to-home derivation.
 */
export declare function joinPath(dir: string, filename: string): string;
//# sourceMappingURL=local-inventory.helpers.d.ts.map