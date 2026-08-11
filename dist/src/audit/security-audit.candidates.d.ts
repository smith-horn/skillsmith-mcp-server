/**
 * @fileoverview Candidate derivation + suppression-check helpers for the
 *               local security audit. (SMI-5883 Wave 2, split out of
 *               security-audit.ts per the 500-line file gate, §11.)
 * @module @skillsmith/mcp-server/audit/security-audit.candidates
 *
 * Raw, uncapped, verdict-independent candidate derivation (§3a, D-10): every
 * finding on every scanned skill becomes a candidate, INCLUDING skills whose
 * report currently passes. This module is deliberately ignorant of
 * `compareScanReports` / the baseline -- it reads only the current scan
 * report and the acceptance store, so it structurally cannot leak
 * acceptance state into the rug-pull comparator (INV-1/INV-2).
 */
import type { ScanReport } from '@skillsmith/core';
import type { InventoryEntry } from '../utils/local-inventory.types.js';
import type { AcceptanceRecord } from './security-acceptance.types.js';
import type { Candidate } from './security-audit.types.js';
export interface DeriveCandidatesResult {
    /** True iff EVERY finding on this skill (by raw count, duplicates included) has an active acceptance -- the sole suppression precondition (§3g). */
    allFindingsAccepted: boolean;
    /** Count of raw findings (duplicates included) covered by an active acceptance. */
    acceptedCount: number;
    /** The MOST RECENT covering acceptance's timestamp, or `null` if none. */
    mostRecentAcceptedAt: string | null;
    /** The MOST RECENT covering acceptance's reason, or `null` if none. */
    mostRecentReason: string | null;
}
/**
 * Derive a {@link Candidate} for every element of `current.findings` and
 * merge into `candidateIndex` (mutated in place -- the uncapped, single
 * resolution surface for `--accept`, shared across the whole run). Two
 * byte-identical findings collapse to one candidate entry with an
 * incremented `duplicateCount` (§3a) -- accepting one accepts both, since
 * they are indistinguishable evidence. `candidateIndex` is shared across
 * every skill in the run (not reset per-entry, since keying is content-based
 * per D-1), so this collapsing is NOT limited to the same skill: a genuinely
 * different skill with byte-identical content and the same finding collapses
 * into the SAME candidate too (code-review round 2) -- tracked in
 * `affectedSkills` so accepting it doesn't silently suppress an unseen skill.
 */
export declare function deriveCandidatesForEntry(params: {
    candidateIndex: Map<string, Candidate>;
    entry: InventoryEntry;
    current: ScanReport;
    contentDigest: string;
    rulesetVersion: string;
    acceptedByKey: ReadonlyMap<string, AcceptanceRecord>;
}): DeriveCandidatesResult;
/** `SKILLSMITH_AUDIT_ACCEPT_DISABLE=1` -- bypasses the acceptance store entirely: no load, no suppression, no store write (§5). */
export declare function isAcceptDisabled(): boolean;
//# sourceMappingURL=security-audit.candidates.d.ts.map