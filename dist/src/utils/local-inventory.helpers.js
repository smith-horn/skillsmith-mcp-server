/**
 * @fileoverview Helpers for the local-inventory scanner (SMI-4587 Wave 1 Step 2).
 * @module @skillsmith/mcp-server/utils/local-inventory.helpers
 *
 * Pure functions extracted to keep `local-inventory.ts` thin — CLAUDE.md
 * regex extraction (testable in isolation) and the shared skill-directory
 * scan walk both live here.
 */
import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { CANONICAL_CLIENT } from '@skillsmith/core/install';
import { parseYamlFrontmatter } from '../tools/validate.helpers.js';
/**
 * Stable warning code catalog. Keep this in sync with the writer; the audit
 * report renders messages keyed off `code`.
 */
export const WARNING_CODES = {
    TRIGGER_SURFACE_TRUNCATED: 'namespace.inventory.trigger_surface_truncated',
    BOOTSTRAP_FAILED: 'namespace.inventory.bootstrap_failed',
    CLAUDE_MD_RECALL_LOW: 'namespace.inventory.claude_md_recall_low',
    REGEX_EXTRACTION_SKIPPED: 'namespace.inventory.regex_extraction_skipped',
    UNMANAGED_SKILL_BOOTSTRAPPED: 'namespace.inventory.unmanaged_skill_bootstrapped',
    PARSE_FAILED: 'namespace.inventory.parse_failed',
    /** SMI-6228 Source 5 (plugin-skill scan): an enabled plugin id could not be
     * resolved to a scannable `skills/` directory — malformed
     * `<plugin>@<marketplace>` shape, missing cache directory, or the cache
     * directory doesn't have exactly one version subdirectory. Always
     * fail-soft: the plugin is skipped, not thrown. */
    PLUGIN_SCAN_SKIPPED: 'namespace.inventory.plugin_scan_skipped',
    /** SMI-6240 Source 6: `<projectDir>/.claude/skills` resolved (post-symlink)
     * outside `projectDir` — same `isWithinRoot` guard as Source 5. */
    PROJECT_SKILLS_SCAN_SKIPPED: 'namespace.inventory.project_skills_scan_skipped',
};
/** Maximum trigger phrases retained per entry — matches `OverlapDetector.MAX_TRIGGER_PHRASES_PER_SKILL`. */
export const MAX_TRIGGER_PHRASES_PER_SKILL = 50;
/**
 * Cap an array of trigger phrases at MAX_TRIGGER_PHRASES_PER_SKILL. When
 * truncation occurs, append a warning of code `trigger_surface_truncated`
 * with the dropped count so the user sees it in the audit report.
 */
export function capTriggerSurface(identifier, phrases, warnings) {
    if (phrases.length <= MAX_TRIGGER_PHRASES_PER_SKILL) {
        return phrases;
    }
    warnings.push({
        code: WARNING_CODES.TRIGGER_SURFACE_TRUNCATED,
        message: `triggerSurface for "${identifier}" was capped at ${MAX_TRIGGER_PHRASES_PER_SKILL} phrases (${phrases.length - MAX_TRIGGER_PHRASES_PER_SKILL} dropped)`,
        context: {
            entry_identifier: identifier,
            dropped_count: phrases.length - MAX_TRIGGER_PHRASES_PER_SKILL,
        },
    });
    return phrases.slice(0, MAX_TRIGGER_PHRASES_PER_SKILL);
}
/**
 * Split a description into sentence-level trigger phrases. Empty or
 * whitespace-only segments are filtered.
 */
export function splitDescriptionToPhrases(description) {
    if (!description)
        return [];
    // Split on sentence terminators; tolerate runs of whitespace and trailing
    // punctuation. Not a strict NLP tokenizer — close-enough for trigger surface.
    return description
        .split(/[.!?\n]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}
/**
 * Read the YAML frontmatter from a `.md` file. Returns `{}` if no
 * frontmatter or the file cannot be parsed.
 */
export function readFrontmatter(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return parseYamlFrontmatter(content) ?? {};
    }
    catch {
        return {};
    }
}
/**
 * Extract the body of a `.md` file (everything after the closing
 * frontmatter delimiter, or the full content if no frontmatter).
 */
export function readBody(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (!content.startsWith('---'))
            return content;
        const end = content.indexOf('---', 3);
        if (end === -1)
            return content;
        return content.slice(end + 3).trimStart();
    }
    catch {
        return '';
    }
}
/**
 * Pull the first non-empty line from a body string. Used as the fallback
 * trigger surface for frontmatter-less command files.
 */
export function firstNonEmptyLine(body) {
    for (const line of body.split('\n')) {
        const trimmed = line.trim();
        if (trimmed)
            return trimmed;
    }
    return '';
}
/**
 * Stable identifier for a CLAUDE.md trigger line. The identifier doubles as
 * dedup key — two scans of the same line produce the same id. Hashed
 * because the line itself can be long; first 12 hex chars are sufficient.
 */
export function hashClaudeMdLine(claudeMdPath, line) {
    const norm = line.trim().toLowerCase();
    const hash = crypto
        .createHash('sha256')
        .update(`${claudeMdPath}:${norm}`)
        .digest('hex')
        .slice(0, 12);
    return `claude_md:${hash}`;
}
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
export function extractClaudeMdTriggers(claudeMdPath, warnings) {
    let content;
    try {
        content = fs.readFileSync(claudeMdPath, 'utf-8');
    }
    catch {
        // Missing file is silent (no CLAUDE.md is a normal state).
        return [];
    }
    const entries = [];
    let stat;
    try {
        stat = fs.statSync(claudeMdPath);
    }
    catch {
        stat = undefined;
    }
    let captureMode = 'idle';
    let lines;
    try {
        lines = content.split('\n');
    }
    catch {
        warnings.push({
            code: WARNING_CODES.REGEX_EXTRACTION_SKIPPED,
            message: `CLAUDE.md at ${claudeMdPath} unparseable; trigger-phrase scan skipped`,
            context: { path: claudeMdPath },
        });
        return [];
    }
    // Headings considered as trigger sections. Case-insensitive, allow up to
    // three leading hashes (per spec line 104).
    const headingRe = /^#{1,3}\s*(Trigger phrases|Use when|Skills)\b/i;
    const otherHeadingRe = /^#{1,6}\s+/;
    const bulletRe = /^[-*]\s+(.+)$/;
    const markerRe = /<!--\s*skillsmith:trigger\s*-->/;
    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (markerRe.test(line)) {
            // High-confidence marker line — capture the whole line minus the marker.
            const phrase = line.replace(markerRe, '').trim();
            if (phrase) {
                entries.push(makeClaudeMdEntry(claudeMdPath, phrase, stat?.mtimeMs));
            }
            continue;
        }
        if (headingRe.test(line)) {
            captureMode = 'heading';
            continue;
        }
        // Reset capture mode on any other heading.
        if (otherHeadingRe.test(line)) {
            captureMode = 'idle';
            continue;
        }
        if (captureMode === 'heading') {
            const m = bulletRe.exec(line);
            if (m && m[1]) {
                const phrase = m[1].trim();
                if (phrase) {
                    entries.push(makeClaudeMdEntry(claudeMdPath, phrase, stat?.mtimeMs));
                }
            }
        }
    }
    return entries;
}
function makeClaudeMdEntry(claudeMdPath, phrase, mtime) {
    return {
        kind: 'claude_md_rule',
        source_path: claudeMdPath,
        identifier: hashClaudeMdLine(claudeMdPath, phrase),
        triggerSurface: [phrase],
        mtime,
        // CLAUDE.md rules are Claude Code-only (SMI-6077) — no other supported
        // client reads this file today.
        client: CANONICAL_CLIENT,
        // Source 4 — a native-client entry, not a plugin-scan one (SMI-6228).
        origin: 'native-client',
        meta: { description: phrase },
    };
}
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
export function readEnabledPluginIds(settingsPath, warnings) {
    if (!fs.existsSync(settingsPath))
        return [];
    let raw;
    try {
        raw = fs.readFileSync(settingsPath, 'utf-8');
    }
    catch {
        return [];
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch {
        warnings.push({
            code: WARNING_CODES.PARSE_FAILED,
            message: `${settingsPath} is not valid JSON; plugin-skill scan skipped`,
            context: { path: settingsPath },
        });
        return [];
    }
    // Cross-provider review finding (GPT-5.6-Sol, SMI-6229, Medium): `typeof`
    // treats an array as `'object'` too, so `{"enabledPlugins":[true]}` used
    // to pass this check and fall into `Object.entries([true])` — returning
    // `["0"]` here while the `.mjs` twin's `isPlainObject` (which explicitly
    // excludes arrays) correctly returned `[]` for the same input. Excluding
    // arrays on both sides restores the parity guarantee this pair depends on.
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
        return [];
    const enabledPlugins = parsed['enabledPlugins'];
    if (!enabledPlugins || typeof enabledPlugins !== 'object' || Array.isArray(enabledPlugins))
        return [];
    return Object.entries(enabledPlugins)
        .filter(([, value]) => value === true)
        .map(([id]) => id);
}
/** Resolve `~/.skillsmith/manifest.json`, or `null` if absent/unreadable. */
export function loadManifest(manifestPath) {
    try {
        if (!fs.existsSync(manifestPath))
            return null;
        const raw = fs.readFileSync(manifestPath, 'utf-8');
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
}
/**
 * Look up an `author` (and `tags`) for a given skill identifier in the
 * manifest. Manifest shape varies — be tolerant: walk the top-level keys
 * and any obvious `skills` array/object.
 */
export function lookupAuthor(manifest, identifier) {
    if (!manifest)
        return {};
    // Many manifest shapes possible; check common ones.
    const skills = (manifest.skills ?? manifest.installed);
    if (Array.isArray(skills)) {
        for (const s of skills) {
            if (s &&
                typeof s === 'object' &&
                (s.id === identifier ||
                    s.name === identifier)) {
                const rec = s;
                return {
                    author: typeof rec.author === 'string' ? rec.author : undefined,
                    tags: Array.isArray(rec.tags) ? rec.tags : undefined,
                };
            }
        }
    }
    if (skills && typeof skills === 'object') {
        const rec = skills[identifier];
        if (rec && typeof rec === 'object') {
            const r = rec;
            return {
                author: typeof r.author === 'string' ? r.author : undefined,
                tags: Array.isArray(r.tags) ? r.tags : undefined,
            };
        }
    }
    return {};
}
/**
 * Cross-platform mtime read. Returns `undefined` on stat failure rather
 * than throwing — mtime is informational for ordering, not load-bearing.
 */
export function readMtime(filePath) {
    try {
        return fs.statSync(filePath).mtimeMs;
    }
    catch {
        return undefined;
    }
}
// Path-traversal/symlink-escape guards moved to their own file (SMI-6229
// follow-up) purely to keep this file under the 500-line cap — re-exported
// here so `local-inventory.ts`'s existing import from this module still works.
export { joinPath, isSafePathComponent, isWithinRoot, } from './local-inventory.path-safety.helpers.js';
/**
 * `parseYamlFrontmatter` returns `string | string[] | undefined` for
 * description (depending on block-scalar syntax). Normalize to a single
 * string for downstream consumers.
 */
export function coerceDescription(value) {
    if (typeof value === 'string')
        return value.trim() || undefined;
    if (Array.isArray(value)) {
        const joined = value
            .map((v) => (typeof v === 'string' ? v.trim() : ''))
            .filter((v) => v.length > 0)
            .join(' ');
        return joined.length > 0 ? joined : undefined;
    }
    return undefined;
}
/**
 * Core directory walk shared by every "one SKILL.md per subdirectory" scan
 * source (`local-inventory.ts`'s Source 1/5/6 wrappers): one entry per
 * subdirectory, from `SKILL.md` frontmatter when present, else the
 * directory name (with a soft warning). Returns entries with
 * `client`/`origin`/`pluginId` unset — callers tag their own. Moved here
 * from `local-inventory.ts` to keep that file under the 500-line cap.
 */
export function scanSkillsDirEntries(skillsDir, manifest, warnings) {
    if (!fs.existsSync(skillsDir))
        return [];
    const out = [];
    let dirEntries;
    try {
        dirEntries = fs.readdirSync(skillsDir, { withFileTypes: true });
    }
    catch {
        return [];
    }
    for (const dirent of dirEntries) {
        if (!dirent.isDirectory() || dirent.name.startsWith('.'))
            continue;
        const skillDir = path.join(skillsDir, dirent.name);
        const skillMd = path.join(skillDir, 'SKILL.md');
        let identifier = dirent.name;
        let description;
        let mtime;
        if (fs.existsSync(skillMd)) {
            const fm = readFrontmatter(skillMd);
            const fmName = typeof fm.name === 'string' ? fm.name : undefined;
            if (fmName && fmName.trim())
                identifier = fmName.trim();
            const fmDesc = coerceDescription(fm.description);
            if (fmDesc)
                description = fmDesc;
            mtime = readMtime(skillMd);
        }
        else {
            // Skill directory without SKILL.md is unusual; record a soft warning
            // so the audit report can flag it but do not block the scan.
            warnings.push({
                code: WARNING_CODES.PARSE_FAILED,
                message: `skill directory ${skillDir} has no SKILL.md; using directory name as identifier`,
                context: { path: skillDir },
            });
        }
        const phrases = capTriggerSurface(identifier, [identifier, ...splitDescriptionToPhrases(description)], warnings);
        const author = lookupAuthor(manifest, identifier);
        out.push({
            kind: 'skill',
            source_path: skillMd,
            identifier,
            triggerSurface: phrases,
            mtime,
            meta: {
                description,
                author: author.author,
                tags: author.tags,
            },
        });
    }
    return out;
}
//# sourceMappingURL=local-inventory.helpers.js.map