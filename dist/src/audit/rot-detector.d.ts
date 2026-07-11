/**
 * @fileoverview Standalone rot detector for the consumer namespace audit
 *               (SMI-5536 Wave 2B — R0 rot detection).
 * @module @skillsmith/mcp-server/audit/rot-detector
 * @see SMI-5536
 *
 * Mirrors the collision-detector module shape: a single async
 * `detectRot(inventory, opts)` entrypoint returning a flat array of
 * `RotFinding`s. Detection-only — no file mutation, no network access.
 *
 * Signals (see `rot-detector.types.ts` for the full contract):
 *   - `dead-ref` — the skill/command/agent's own markdown content
 *     contains a placeholder/dead link or an explicit deprecation marker.
 *     Fully offline: reads `entry.source_path` from disk, nothing else.
 *   - `version-drift` — "the registry has a newer version of this skill
 *     than what's installed." Scaffolded but NOT implemented in v1 (see
 *     the feasibility note below) — `detectVersionDrift` always returns
 *     `[]`.
 *
 * ---
 * Version-drift feasibility (plan decision, SMI-5536 Wave 2B):
 *
 * `InventoryEntry` (`../utils/local-inventory.types.ts`) carries no
 * version, no source URL, and no install date — only `mtime` + `meta` +
 * `source_path` (the A4 constraint). Resolving "registry has a newer
 * version" the way `skill_updates` (`tools/skill-updates.ts`) and
 * `skill_outdated` (`tools/outdated.ts`) do requires a
 * `SkillVersionRepository` query against `context.db`, keyed by the
 * manifest's registry `id` + tracked content hash.
 *
 * That data is NOT reachable from the audit path without new plumbing:
 * `skill_inventory_audit`'s implementation (`tools/skill-inventory-
 * audit.ts`'s `skillInventoryAuditImpl(input: unknown)`) takes no
 * `ToolContext` / db handle at all, and neither does `runInventoryAudit`
 * → `detectCollisions` → (now) `detectRot`. Threading a db handle through
 * that whole call chain — plus the CLI's `sklx audit collisions`
 * equivalent — is a materially larger, separate change, not a detector
 * implementation detail.
 *
 * Per the task's decision rule: dead-ref ships as the primary signal;
 * version-drift is a clearly-marked scaffold that returns nothing rather
 * than faking a comparison. Wire it up once the db-handle plumbing lands
 * (track via a follow-up Linear issue — do not backfill this comment with
 * a fake diff instead of doing the plumbing).
 * ---
 */
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { DetectRotOptions, RotFinding } from './rot-detector.types.js';
/**
 * Run the rot-detection pass over an inventory snapshot. Pure detection —
 * safe to call repeatedly, never mutates the filesystem.
 *
 * Entries are visited in the order the caller passed them in — no
 * priority reordering by `mtime` or anything else. The RETURNED findings
 * are then sorted by a stable key (`entry.source_path`, then `signal`) so
 * the report's "Rot / dead references" section is deterministic across
 * runs: a mere file `touch` (which changes `mtime` but not content) must
 * not reorder the section and produce diff noise.
 */
export declare function detectRot(inventory: ReadonlyArray<InventoryEntry>, opts?: DetectRotOptions): Promise<RotFinding[]>;
//# sourceMappingURL=rot-detector.d.ts.map