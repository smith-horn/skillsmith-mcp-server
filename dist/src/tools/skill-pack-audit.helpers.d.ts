/**
 * @fileoverview Generic trigger-word + namespace detection helpers for
 * `skill_pack_audit`.
 * @module @skillsmith/mcp-server/tools/skill-pack-audit.helpers
 * @see SMI-4124
 *
 * Pure functions — no I/O, no database access. Tested via
 * `tests/unit/skill-pack-audit.test.ts`.
 */
import type { GenericTriggersStoplist } from '@skillsmith/core';
import type { GenericWordFlag, NamespaceFlag } from './skill-pack-audit.types.js';
/**
 * Detect generic trigger words in a skill's name and description.
 *
 * - Skill-name hits produce `severity: 'error'` (unconditional false-trigger magnet).
 * - Description hits produce `severity: 'warning'`.
 * - `suggested` is `${packDomain}-${token}` when a pack domain is available,
 *   otherwise `null`.
 *
 * @param description - Raw description value from frontmatter (may be string
 *                      or string[] from block-scalar parsing, or other).
 * @param skillName   - Skill's `name` frontmatter value (falls back to dir name).
 * @param packDomain  - Inferred pack domain, or `null` when indeterminate.
 * @param stoplist    - Curated stoplist from `@skillsmith/core`.
 * @returns Flags (name errors first, then description warnings).
 */
export declare function detectGenericTriggerWords(description: unknown, skillName: string, packDomain: string | null, stoplist: GenericTriggersStoplist): GenericWordFlag[];
/**
 * Aggregate per-skill `tags` across a pack to derive a pack domain.
 *
 * Priority:
 * 1. If `packName` ends with `-skills` and is not itself generic, strip the
 *    suffix and return the prefix (e.g. `planning-skills` → `planning`).
 * 2. Otherwise, compute the mode of non-generic tags across all skills.
 * 3. Returns `null` when no domain can be inferred with confidence.
 *
 * @param packName  - Pack directory name.
 * @param allSkills - Per-skill tag arrays (undefined / non-array → ignored).
 * @param stoplist  - Curated stoplist (for generic-tag filtering).
 */
export declare function derivePackDomain(packName: string, allSkills: Array<{
    tags?: unknown;
}>, stoplist: GenericTriggersStoplist): string | null;
/**
 * Detect a generic pack namespace.
 *
 * @returns NamespaceFlag when the pack name matches a generic namespace,
 *          otherwise null.
 */
export declare function detectGenericNamespace(packName: string, allSkills: Array<{
    tags?: unknown;
}>, stoplist: GenericTriggersStoplist): NamespaceFlag | null;
//# sourceMappingURL=skill-pack-audit.helpers.d.ts.map