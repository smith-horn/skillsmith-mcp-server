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
import { computeAcceptKey, findingFingerprint } from './security-acceptance.js';
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
export function deriveCandidatesForEntry(params) {
    const { candidateIndex, entry, current, contentDigest, rulesetVersion, acceptedByKey } = params;
    let acceptedCount = 0;
    let mostRecentAcceptedAt = null;
    let mostRecentReason = null;
    for (const finding of current.findings) {
        const fp = findingFingerprint(finding);
        const acceptKey = computeAcceptKey({ contentDigest, findingFingerprint: fp, rulesetVersion });
        const activeRecord = acceptedByKey.get(acceptKey);
        const existing = candidateIndex.get(acceptKey);
        if (existing) {
            existing.duplicateCount += 1;
            const affected = existing.affectedSkills;
            if (!affected.some((s) => s.sourcePath === entry.source_path && s.identifier === entry.identifier)) {
                affected.push({ sourcePath: entry.source_path, identifier: entry.identifier });
            }
        }
        else {
            candidateIndex.set(acceptKey, {
                acceptKey,
                sourcePath: entry.source_path,
                identifier: entry.identifier,
                contentDigest,
                findingFingerprint: fp,
                rulesetVersion,
                finding,
                skillPassed: current.passed,
                acceptedAt: activeRecord?.acceptedAt ?? null,
                duplicateCount: 1,
                affectedSkills: [{ sourcePath: entry.source_path, identifier: entry.identifier }],
            });
        }
        if (activeRecord) {
            acceptedCount += 1;
            if (mostRecentAcceptedAt === null || activeRecord.acceptedAt > mostRecentAcceptedAt) {
                mostRecentAcceptedAt = activeRecord.acceptedAt;
                mostRecentReason = activeRecord.reason;
            }
        }
    }
    return {
        allFindingsAccepted: current.findings.length > 0 && acceptedCount === current.findings.length,
        acceptedCount,
        mostRecentAcceptedAt,
        mostRecentReason,
    };
}
/** `SKILLSMITH_AUDIT_ACCEPT_DISABLE=1` -- bypasses the acceptance store entirely: no load, no suppression, no store write (§5). */
export function isAcceptDisabled() {
    return process.env['SKILLSMITH_AUDIT_ACCEPT_DISABLE'] === '1';
}
//# sourceMappingURL=security-audit.candidates.js.map