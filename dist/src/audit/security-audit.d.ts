/**
 * @fileoverview Local security audit (SMI-5541 Wave 2C, Option 1).
 * @module @skillsmith/mcp-server/audit/security-audit
 *
 * The PRODUCER that feeds the shipped 2A rug-pull comparator
 * (`compareScanReports`, SMI-5535). For each installed skill it reads the
 * on-disk SKILL.md/command/agent content, scans it with `@skillsmith/core`'s
 * `SecurityScanner`, and — against a per-skill baseline persisted across runs
 * (`security-baseline.ts`) — classifies the skill's current security posture:
 *
 *   - `hostile`    — a benign→malicious rug-pull between the last baseline and
 *     now (the differentiated 2A signal: `compareScanReports` verdict).
 *   - `malicious`  — the skill FAILS the scanner right now (whether first-sight
 *     or persistently). Surfaced every run so the in-tool audit always shows
 *     the current posture, not just deltas.
 *   - `suspicious` — a material worsening that did not fail the scanner.
 *
 * One finding per skill, strongest label wins (hostile > malicious >
 * suspicious). The baseline is rebuilt each run from the currently-present
 * skills only (uninstalled skills are pruned → the store stays bounded), and
 * always advances to the current scan so the NEXT run compares against the
 * most-recent known state (a fix-then-rebreak still re-detects as hostile).
 *
 * Design note — content lives ONLY on the client (ADR-124 keeps the inventory
 * data plane metadata-only, so no server-side scan is possible). This is why
 * the continuous audit runs here, in the CLI/MCP, where the content is.
 */
import type { ScanReport } from '@skillsmith/core';
import type { RunSecurityAuditOptions, RunSecurityAuditResult } from './security-audit.types.js';
/**
 * INTERNAL test seams — deliberately NOT exported (and NOT part of the public
 * `RunSecurityAuditOptions`), so the published entry point cannot accept a stub
 * scanner / reader that would silently neuter the audit while still reporting a
 * plausible count. The co-located test passes these via the same options bag
 * (the parameter type below is the intersection).
 */
interface SecurityAuditSeams {
    /** Override the baseline store path. */
    baselinePath?: string;
    /** Override the content reader; returns null on failure, never throws. */
    readContent?: (absPath: string) => string | null;
    /** Override the run's audit id (default: a fresh ULID). */
    auditId?: string;
    /** Override the scanner with a deterministic stub. */
    scan?: (skillId: string, content: string) => ScanReport;
}
/**
 * Run the local security audit over the current inventory. Stateless w.r.t.
 * its own result, but it reads AND advances the per-skill baseline so
 * rug-pulls are detected on the transition run.
 */
export declare function runSecurityAudit(opts?: RunSecurityAuditOptions & SecurityAuditSeams): Promise<RunSecurityAuditResult>;
export {};
//# sourceMappingURL=security-audit.d.ts.map