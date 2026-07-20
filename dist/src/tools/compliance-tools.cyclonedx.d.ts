/**
 * @fileoverview CycloneDX AI/ML-BOM formatter for compliance_report
 * @module @skillsmith/mcp-server/tools/compliance-tools.cyclonedx
 * @see SMI-3140 Wave 1 Step 4: docs/internal/implementation/smi-3140-cyclonedx-ai-bom-export.md
 * @see SMI-3906: original flat-components cyclonedx format this extends
 *
 * Extends `compliance_report`'s `cyclonedx` format from a flat `components`
 * array into a full CycloneDX 1.5 AI/ML-BOM: installed skills as components,
 * a dependency graph built from `skill_dependencies`, MCP-server and model
 * "components" the library has no dedicated model for, and sparse-data
 * handling. Split out of compliance-tools.ts to stay under the 500-line
 * audit:standards gate (SMI-3140 Wave 1 Step 4 checklist item).
 *
 * Library facts verified directly against `@cyclonedx/cyclonedx-library@10.1.0`
 * source (no `modelCard` class exists — model requirements are represented as
 * `ComponentType.MachineLearningModel` components instead, per the plan doc's
 * Step 3 field-mapping design):
 * - `Models.Component.dependencies` is a `BomRefRepository` (Set<BomRef>) —
 *   the dependency graph is edges FROM a component's own `.dependencies` TO
 *   other components' `.bomRef`, normalized into the top-level `dependencies`
 *   array at serialize time (`DependencyGraphNormalizer`) — never stored
 *   directly on `Bom`.
 * - `Models.Component`/`Models.Metadata` both carry their own `.properties`
 *   (`PropertyRepository`, a `Set<Property>`) — component-level annotations
 *   and BOM-level (`metadata.properties`) annotations are separate repositories.
 *
 * Three decisions below are CONFIRMED (2026-07-14 plan-review) and must not
 * be re-litigated in this file without a fresh plan-review pass:
 * 1. Sparse-data default: read-only `pending-rescan` placeholder + warning,
 *    evaluated PER SKILL (a skill with pre-existing rows never masks another
 *    skill that still has zero — see `resolveDependencies`' doc comment).
 *    Inline backfill is opt-in (`backfillDependencies: true`), attempted only
 *    for the skills actually sparse, and hard-gated to
 *    `getBestDriver() === 'better-sqlite3'` (sql.js/WASM has no
 *    cross-process write coordination — refused with a warning, not a
 *    silent no-op).
 * 2. `inferred_static` dependency rows are advisory-only: a `properties`
 *    annotation on the owning component, NEVER a `dependencies` graph edge.
 *    Only `declared` (author frontmatter) rows become real graph edges.
 * 3. No redaction: local/proprietary components (`skills.source = 'local'`,
 *    surfaced here via `SkillInventoryItem.trustTier === 'local'`) are
 *    included with their real names, same as any other component.
 */
import type { Database, SkillDependencyRepository } from '@skillsmith/core';
import type { ComplianceData } from './compliance-tools.js';
export interface CycloneDxBuildOptions {
    /** Present when the tool has a live DB connection (undefined in stub mode). */
    db?: Database;
    /** Present when the tool has a live DB connection (undefined in stub mode). */
    skillDependencyRepository?: SkillDependencyRepository;
    /** Opt-in inline dependency backfill — see decision #1 above. Default false. */
    backfillDependencies?: boolean;
}
/**
 * Build a CycloneDX 1.5 AI/ML-BOM JSON document from compliance data.
 *
 * Schema-valid by construction (library-backed serialization) — validated in
 * tests via `Validation.JsonStrictValidator`, not just eyeballed. See the
 * module doc above for the three CONFIRMED design decisions this
 * implementation honors.
 */
export declare function formatCycloneDx(data: ComplianceData, options?: CycloneDxBuildOptions): Promise<Record<string, unknown>>;
//# sourceMappingURL=compliance-tools.cyclonedx.d.ts.map