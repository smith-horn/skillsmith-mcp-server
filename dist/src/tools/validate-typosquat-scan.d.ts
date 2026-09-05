import type { SecurityFinding } from '@skillsmith/core';
import type { ValidationError } from './validate.types.js';
/**
 * Scan a skill's declared name against the bundled reference snapshot and
 * return the RAW scanner findings (warn mode — severity capped at medium, so
 * these are advisory and never on their own scan-failing / install-blocking).
 *
 * This is the shape `skill_rescan` consumes (it already works in
 * `SecurityFinding[]`); `scanTyposquatName()` below adapts the same findings
 * into `skill_validate`'s `ValidationError` shape. Returns `[]` when the name
 * is blank or the snapshot has no names — never throws.
 *
 * @param skillName the skill's own declared name (SKILL.md frontmatter `name`)
 */
export declare function detectTyposquatInName(skillName: string | undefined): SecurityFinding[];
/**
 * Scan a skill's declared name (from its SKILL.md frontmatter) against the
 * bundled typosquat reference snapshot, returning a `warning`-severity
 * ValidationError per finding. No-op (returns []) when the snapshot has no
 * names (unwritten placeholder, or the frontmatter has no `name`).
 *
 * @param skillName the skill's own declared name (SKILL.md frontmatter `name`)
 */
export declare function scanTyposquatName(skillName: string | undefined): ValidationError[];
//# sourceMappingURL=validate-typosquat-scan.d.ts.map