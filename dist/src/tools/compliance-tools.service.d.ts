/**
 * @fileoverview Real compliance service — queries audit_logs + skills SQLite tables
 * @module @skillsmith/mcp-server/tools/compliance-tools.service
 * @see SMI-3916: Wave 2 — Compliance real queries
 * @see SMI-5675: skill inventory now sourced from the installed-skill manifest,
 *   not the entire locally-indexed `skills` table (see gatherData below).
 *
 * Replaces stub compliance data with actual SQL queries against local
 * audit_logs and skills tables. Returns data conforming to ComplianceData.
 */
import { ManifestManager } from '@skillsmith/core';
import type { Database } from '@skillsmith/core';
import type { ComplianceService } from './compliance-tools.js';
/**
 * Create a compliance service backed by real SQLite queries.
 *
 * SMI-5675 fix: the installed-skill SET now comes from
 * `~/.skillsmith/manifest.json` (via `ManifestManager`), not the entire
 * `skills` table — that table holds the full locally-indexed registry corpus
 * (thousands of registry-synced + filesystem-scanned rows), the overwhelming
 * majority of which the user never installed. The `skills` table is still
 * queried, but only for supplementary metadata (trust_tier, quality_score)
 * joined by skill ID against the installed set. `version` now comes from the
 * manifest entry's real `version` field (previously hardcoded `'0.0.0'` —
 * the "version lives in skill_versions table, not skills" comment that
 * justified that hardcode was already obsolete: the manifest has always
 * carried the real installed version).
 *
 * Affects all 3 report formats (soc2, cyclonedx, json) — they all consume
 * `ComplianceData.skills` from this same `gatherData()` call.
 *
 * Tables/files queried:
 * - audit_logs: event_type, timestamp, actor, resource, result
 * - ~/.skillsmith/manifest.json: installedSkills (id, version, installPath, installedAt, lastUpdated)
 * - skills: id, trust_tier, quality_score (supplementary metadata only)
 */
export declare function createRealComplianceService(db: Database, options?: {
    manifestManager?: ManifestManager;
}): ComplianceService;
//# sourceMappingURL=compliance-tools.service.d.ts.map