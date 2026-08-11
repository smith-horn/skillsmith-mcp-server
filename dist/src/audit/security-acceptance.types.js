/**
 * @fileoverview Type vocabulary for the local security-acceptance store (SMI-5883 Wave 2).
 * @module @skillsmith/mcp-server/audit/security-acceptance.types
 *
 * A local, per-user JSON store letting a user mark a reviewed
 * SecurityScanner false-positive finding as "accepted" so it is suppressed
 * from future `sklx audit security` runs. Acceptance is keyed on
 * `(contentDigest, findingFingerprint, rulesetVersion)` -- NEVER on file
 * path or skill name (D-1): a path-keyed allowlist would suppress a later,
 * genuinely different hostile finding in the same file.
 *
 * Suppression is applied in the SHARED `runSecurityAudit` result assembly
 * (`security-audit.ts`), not literally only "in CLI files" as an earlier
 * version of this comment claimed (code-review round 2) -- any consumer of
 * `runSecurityAudit` (the CLI, but also any future MCP tool or the email
 * digest) sees the SAME `finding.accepted` annotation and the SAME adjusted
 * `summary.malicious`/`summary.accepted` counts.
 *
 * Single-snapshot-per-run (SMI-5901 post-merge retro): the store is loaded
 * ONCE, before the scan proceeds -- every consumer of one `runSecurityAudit`
 * call (JSON output, printed ACCEPTED tag, `summary.malicious`, and the
 * email digest's `findings[]`) is consistent with EACH OTHER for that run,
 * but a `--accept`/`--revoke` from a concurrent process mid-scan is not
 * retroactively reflected in the run already in flight -- it is picked up by
 * the NEXT `runSecurityAudit` call. This is deliberate (a single audit run
 * must report one coherent point-in-time picture, not some findings checked
 * against an older store state and others against a newer one) and matches
 * how the CLI's own JSON output already behaves; it is not specific to the
 * email digest.
 *
 * The one invariant that matters is still true regardless of consumer:
 * `compareScanReports` (the rug-pull/hostile-update comparator, called
 * earlier in that same assembly) always sees the RAW, unmodified scan
 * report -- acceptance state is annotated onto `findings[]` strictly AFTER
 * that comparison runs, never fed
 * into it.
 */
/** Current on-disk schema version. Bumped only on a breaking shape change. */
export const ACCEPTANCE_STORE_VERSION = 1;
/** Bounded read cap for the store file -- refuses (never crashes on) an oversized file. */
export const MAX_STORE_BYTES = 4 * 1024 * 1024; // 4 MiB
/** Max records retained on load; excess (oldest first) is dropped with a warning. */
export const MAX_RECORDS = 500;
/** A fresh, empty store (revision 0; digest computed lazily by the caller if ever serialized). */
export function emptyAcceptanceStore() {
    return { version: ACCEPTANCE_STORE_VERSION, revision: 0, storeDigest: '', records: [] };
}
//# sourceMappingURL=security-acceptance.types.js.map