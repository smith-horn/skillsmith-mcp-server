/**
 * @fileoverview Markdown audit-report writer for SMI-4587 Wave 1 Step 7/8.
 * @module @skillsmith/mcp-server/audit/audit-report-writer
 *
 * Renders an `InventoryAuditResult` into the markdown report stored at
 * `~/.skillsmith/audits/<auditId>/report.md`. Atomic via tmp-file +
 * `fs.rename` (mirrors `audit-history.ts`).
 *
 * Sections, in order (plan §446):
 *   1. Summary header — auditId, generated-at, totals
 *   2. CLAUDE.md scan caveat — only when any inventory entry is
 *      `kind: 'claude_md_rule'` (D-ANTI-1)
 *   3. Exact collisions — each lists involved entries with absolute paths
 *   4. Generic flags — matched tokens, suggested rename if any
 *   5. Semantic collisions — cosine score, overlapping phrases
 *   6. Recommended edits — Wave 3 plumbing; Wave 1 emits a placeholder
 *
 * Wave 2/4 import this writer via `@skillsmith/mcp-server/audit` (Step 9
 * barrel).
 */
import type { InventoryAuditResult } from './collision-detector.types.js';
import type { RenameSuggestion } from './rename-engine.types.js';
import type { RecommendedEdit } from './edit-suggester.types.js';
export interface AuditReportRenderOptions {
    /**
     * Override the report's "Generated" timestamp. Defaults to a fresh
     * `new Date()` at render time. Tests pin this to keep snapshots
     * deterministic; production callers pass nothing.
     */
    generatedAt?: Date;
    /**
     * Per-collision rename suggestions to render in the "Recommended edits"
     * section (SMI-4588 Wave 2 PR #4 / Step 8). When provided AND non-empty,
     * the writer replaces the Wave 1 placeholder with a table of
     * `currentName → suggested` pairs plus a copy-paste-ready CLI
     * invocation per row. Pass nothing (or an empty array) to keep the
     * Wave 1 placeholder behavior — backward-compatible with existing
     * audit-report consumers.
     *
     * Wave 4 wires this from `runInstallPreflight` /
     * `generateRenameSuggestions` outputs; Wave 2 ships only the
     * rendering surface.
     */
    renameSuggestions?: ReadonlyArray<RenameSuggestion>;
    /**
     * Recommended prose edits to render in the "Recommended Edits"
     * section (SMI-4589 Wave 3). When provided AND non-empty, the writer
     * renders each edit as a `diff` fenced markdown block per plan §2.
     * Pass nothing (or an empty array) to omit the section entirely.
     *
     * Wave 4 wires this from `runEditSuggester` outputs; Wave 3 ships
     * only the rendering surface here. Per the per-template gate
     * ratified 2026-05-01, only `add_domain_qualifier`-pattern edits
     * surface in v1; failing-template edits are absent from
     * `runEditSuggester`'s output entirely.
     */
    recommendedEdits?: ReadonlyArray<RecommendedEdit>;
}
export interface AuditReportWriteOptions extends AuditReportRenderOptions {
    /**
     * Per-audit directory (sibling of `result.json`). The writer assumes the
     * directory already exists — `writeAuditHistory` creates it.
     */
    auditDir: string;
}
export interface AuditReportWriteResult {
    /** Absolute path to the rendered `report.md`. */
    reportPath: string;
}
/**
 * Render an `InventoryAuditResult` into the audit-report markdown body.
 * Pure — no IO. Exposed so tests can inspect the output without round-
 * tripping through the filesystem.
 */
export declare function renderAuditReport(result: InventoryAuditResult, opts?: AuditReportRenderOptions): string;
/**
 * Persist the rendered report to `<auditDir>/report.md`. Atomic via
 * tmp-file + `fs.rename`, matching the audit-history writer's contract so
 * concurrent readers never observe a partially-written file.
 */
export declare function writeAuditReport(result: InventoryAuditResult, opts: AuditReportWriteOptions): Promise<AuditReportWriteResult>;
//# sourceMappingURL=audit-report-writer.d.ts.map