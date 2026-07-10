/**
 * @fileoverview Backup garbage-collector for the namespace-rename workflow
 *               (SMI-4588 Wave 2 Step 9, PR #4).
 * @module @skillsmith/mcp-server/tools/install.backup-gc
 *
 * Sweeps `~/.claude/skills/.backups/<skillName>/<timestamp>_<reason>/`
 * directories whose timestamp prefix is older than `retentionDays`
 * (default 14, configurable via `SKILLSMITH_BACKUP_RETENTION_DAYS`,
 * clamped to [1, 365]).
 *
 * Lives in `mcp-server` (not `core`) because `getBackupsDir()` is
 * canonical in `mcp-server/tools/install.conflict-helpers.ts`. An upward
 * dependency from `core` would either violate the package boundary or
 * duplicate the path constant and drift (plan §1 Edit 4).
 *
 * Failure model:
 *
 *   - Missing backup root → `removed: 0, kept: 0` (nothing to do).
 *   - Malformed timestamp directory (manual user dir, non-ISO prefix) →
 *     skipped with `console.warn`; the sweep never aborts mid-walk.
 *   - `fs.rm` failure on a single entry → logged with `console.warn`;
 *     remaining entries continue to be evaluated. Idempotent: a partial
 *     failure on one run is recoverable on the next.
 *
 * Trigger points (Wave 4 wires these — Wave 2 ships only the helper):
 *
 *   - Free / Individual / Team: invoked at session-start by Wave 4's
 *     `session-start-audit.ts` hook.
 *   - Enterprise: invoked by Wave 4's `scheduled-audit/runner.ts` cron.
 */
export interface RunBackupGCOptions {
    /** Override the backups directory (defaults to `getBackupsDir()`). */
    backupsDir?: string;
    /**
     * Retention threshold in days. Clamped to `[1, 365]`. Defaults to the
     * `SKILLSMITH_BACKUP_RETENTION_DAYS` env var (also clamped) and falls
     * back to 14.
     */
    retentionDays?: number;
    /** Override "now" for tests. Defaults to `Date.now()`. */
    now?: Date;
}
export interface RunBackupGCResult {
    /** Number of timestamped backup directories removed by this sweep. */
    removed: number;
    /** Number of timestamped backup directories retained (still within window). */
    kept: number;
    /** Number of leaf entries skipped (malformed timestamp, non-directory). */
    skipped: number;
}
/**
 * Sweep stale backup directories under `<backupsDir>/<skillName>/`. Idempotent:
 * safe to invoke concurrently (uses `fs.rm` with `force: true` and treats
 * already-removed dirs as success).
 *
 * Walk: two levels deep. Level 1 = skill-name directories; level 2 =
 * timestamp-prefixed leaf directories. Files at any level are ignored;
 * malformed timestamp leaves are skipped (with `console.warn`).
 */
export declare function runBackupGC(opts?: RunBackupGCOptions): Promise<RunBackupGCResult>;
//# sourceMappingURL=install.backup-gc.d.ts.map