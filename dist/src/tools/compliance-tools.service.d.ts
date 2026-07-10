/**
 * @fileoverview Real compliance service — queries audit_logs + skills SQLite tables
 * @module @skillsmith/mcp-server/tools/compliance-tools.service
 * @see SMI-3916: Wave 2 — Compliance real queries
 *
 * Replaces stub compliance data with actual SQL queries against local
 * audit_logs and skills tables. Returns data conforming to ComplianceData.
 */
import type { Database } from '@skillsmith/core';
import type { ComplianceService } from './compliance-tools.js';
/**
 * Create a compliance service backed by real SQLite queries.
 *
 * Tables queried:
 * - audit_logs: event_type, timestamp, actor, resource, result
 * - skills: id, name, author, version, trust_tier, quality_score, created_at, updated_at
 */
export declare function createRealComplianceService(db: Database): ComplianceService;
//# sourceMappingURL=compliance-tools.service.d.ts.map