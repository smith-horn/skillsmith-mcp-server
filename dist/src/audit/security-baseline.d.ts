/**
 * @fileoverview Per-skill security baseline store (SMI-5541 Wave 2C).
 * @module @skillsmith/mcp-server/audit/security-baseline
 *
 * The security audit needs the PREVIOUS `ScanReport` per skill to feed
 * `compareScanReports(previous, current)` and detect a benign→malicious
 * rug-pull. No cross-run store existed (`audit-history.ts` persists only
 * whole-run collision results under a fresh ULID each run) — this module is
 * that store: a single JSON keyed by the skill's absolute `source_path`,
 * holding the last scan's content hash + report.
 *
 * Fail-safe by construction: a missing OR corrupt baseline loads as EMPTY
 * (never throws) — the audit then treats every skill as first-sight
 * (`malicious` if it fails now, otherwise it establishes a fresh baseline).
 * That degrades toward showing findings, never toward silently hiding a
 * rug-pull because a JSON blob was unreadable.
 */
import type { ScanReport, SecurityFinding } from '@skillsmith/core';
type RiskScoreBreakdown = ScanReport['riskBreakdown'];
/** Current on-disk schema version. Bumped only on a breaking shape change. */
export declare const SECURITY_BASELINE_VERSION: 1;
/**
 * A `ScanReport` with `scannedAt` serialized to an ISO string (JSON has no
 * Date). Everything else is JSON-native. `compareScanReports` reads only
 * `passed` / `riskScore` / `findings`, so a revived report is fully valid.
 */
export interface StoredScanReport {
    skillId: string;
    passed: boolean;
    findings: SecurityFinding[];
    riskScore: number;
    riskBreakdown: RiskScoreBreakdown;
    scannedAt: string;
    scanDurationMs: number;
}
/** One baseline row: the last content hash + report for a skill. */
export interface SecurityBaselineEntry {
    contentHash: string;
    /**
     * Risk threshold the stored `report` (and its `passed`) was produced under.
     * The unchanged fast path trusts the stored verdict only when the current
     * run's threshold matches this — otherwise the skill is re-scanned, honoring
     * the `compareScanReports` caller contract (both reports at one threshold).
     */
    threshold: number;
    report: StoredScanReport;
    updatedAt: string;
}
/** The whole store, keyed by absolute `source_path`. */
export interface SecurityBaseline {
    version: typeof SECURITY_BASELINE_VERSION;
    skills: Record<string, SecurityBaselineEntry>;
}
/** Absolute path to the baseline store, `~/.skillsmith/audits/security-baseline.json`. */
export declare function defaultBaselinePath(homeDir?: string): string;
/** A fresh, empty baseline. */
export declare function emptyBaseline(): SecurityBaseline;
/**
 * Load the baseline. Returns an EMPTY baseline on any failure (absent file,
 * unreadable, invalid JSON, wrong shape, or a version we don't understand) —
 * never throws. A version mismatch is treated as empty (safe re-baseline)
 * rather than a hard error, so a forward-compat store can't wedge the audit.
 */
export declare function loadSecurityBaseline(baselinePath: string): SecurityBaseline;
/**
 * Atomically persist the baseline (tmp write + rename, so a crash mid-write
 * never leaves a truncated store) with owner-only perms — it embeds scan
 * findings. Directory is created if absent. Best-effort: a write failure is
 * swallowed by the caller's try/catch (a lost baseline just re-establishes
 * next run); this function itself surfaces the error for tests.
 */
export declare function saveSecurityBaseline(baselinePath: string, baseline: SecurityBaseline): void;
/** Serialize a live `ScanReport` (Date → ISO) for storage. */
export declare function serializeReport(report: ScanReport): StoredScanReport;
/** Revive a `StoredScanReport` (ISO → Date) into a `ScanReport` for comparison. */
export declare function reviveReport(stored: StoredScanReport): ScanReport;
export {};
//# sourceMappingURL=security-baseline.d.ts.map