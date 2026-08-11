/**
 * @fileoverview Shared fixtures for the acceptance-allowlist test suite
 *               (SMI-5883 Wave 2, §9), split out so both
 *               `security-audit.acceptance.test.ts` (H-1/H-2/H-5/H-6a) and
 *               `security-audit.acceptance-candidates.test.ts`
 *               (H-4a/H-15/H-16) can share them without either file pushing
 *               the other over the 500-line gate.
 * @module @skillsmith/mcp-server/audit/security-audit.acceptance.test-helpers
 */
import type { ScanReport, SecurityFinding } from '@skillsmith/core';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
export declare const ZERO_BREAKDOWN: ScanReport['riskBreakdown'];
export declare function report(skillId: string, opts: {
    passed: boolean;
    riskScore: number;
    findings?: SecurityFinding[];
}): ScanReport;
export declare function entry(identifier: string, sourcePath?: string): InventoryEntry;
export declare const CRITICAL_EXFIL: SecurityFinding;
/** Seed the acceptance store directly (bypassing the CLI/lock) with one record accepting every finding in `findings` for `contentDigest`. */
export declare function seedAcceptAll(acceptancePath: string, contentDigest: string, findings: SecurityFinding[], reason?: string): void;
export declare function sha256(input: string): string;
//# sourceMappingURL=security-audit.acceptance.test-helpers.d.ts.map