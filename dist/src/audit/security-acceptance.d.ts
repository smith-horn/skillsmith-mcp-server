/**
 * @fileoverview Local security-acceptance store: fingerprinting, keying, and
 *               a bounded, TOCTOU-free, fail-open load. (SMI-5883 Wave 2)
 * @module @skillsmith/mcp-server/audit/security-acceptance
 *
 * Atomic mutation (accept/revoke) lives in `security-acceptance.mutate.ts` --
 * split out to stay under the 500-line file gate. This module owns:
 *   - `findingFingerprint` / `computeAcceptKey` -- canonical, injective keying.
 *   - `loadAcceptanceStore` -- bounded, TOCTOU-free, fail-open (never throws;
 *     a corrupt/oversized/unparseable store degrades to "empty, all findings
 *     shown" with a structured warning, mirroring `security-baseline.ts`'s
 *     fail-safe contract).
 *   - `computeStoreDigest` -- the self-consistency checksum (NOT a keyed MAC
 *     -- see D-12: an attacker who can write this file can already write the
 *     scanned content itself, so cryptographic integrity here is theater).
 */
import type { SecurityFinding } from '@skillsmith/core';
import type { AcceptanceRecord, AcceptanceStore, AcceptanceWarning } from './security-acceptance.types.js';
/** Absolute path to the acceptance store, `~/.skillsmith/audits/security-acceptance.json`. Mirrors `defaultBaselinePath()`. */
export declare function defaultAcceptancePath(homeDir?: string): string;
/**
 * Fixed-length, fixed-order 9-tuple over primitives only. `undefined`
 * optionals normalize to `null` (never `''`), so the map stays injective on
 * the original tuple: `{location: undefined}` and `{location: ''}` MUST
 * produce different fingerprints.
 */
export declare function fingerprintTuple(f: SecurityFinding): ReadonlyArray<string | number | boolean | null>;
/**
 * A canonical `JSON.stringify` over a fixed-length array of primitives is
 * injective: string values escape `"` and `\`, so no value can emit an
 * unescaped `,` that could be mistaken for an element boundary; the array is
 * always exactly 9 elements (each a non-undefined primitive), so no element
 * can shift position. Distinct 9-tuples therefore always produce distinct
 * canonical strings. Hashing is over the UTF-8 BYTE BUFFER explicitly, not
 * an implicitly-encoded string.
 */
export declare function findingFingerprint(f: SecurityFinding): string;
/**
 * Full 256 bits, 64 hex characters, never truncated anywhere -- not in the
 * store, not in `--json`, not in the human output, not in `--accept`
 * parsing. No prefix matching (D-8): prefix resolution would reintroduce
 * the same ambiguity class `findingFingerprint`'s canonical serialization
 * closes, and it interacts badly with uncapped candidate resolution (a
 * prefix unique among RENDERED candidates need not be unique among ALL
 * candidates).
 */
export declare function computeAcceptKey(p: {
    contentDigest: string;
    findingFingerprint: string;
    rulesetVersion: string;
}): string;
/** `--accept`/`--revoke` validate the key format BEFORE touching the store -- no lock taken, no file read on a malformed key. */
export declare function isValidAcceptKeyFormat(key: string): boolean;
/**
 * sha256 over `JSON.stringify([version, revision, records])`. Detects
 * accidental corruption (a truncated write, a partially-flushed file, a
 * hand-edit that left the digest stale). This is an UNKEYED digest -- it
 * provides self-consistency only, NOT authenticity and NOT tamper-resistance
 * (D-12). Anyone who can write this file can recompute the digest; do not
 * describe it as anti-tamper.
 */
export declare function computeStoreDigest(store: {
    version: number;
    revision: number;
    records: AcceptanceRecord[];
}): string;
/**
 * Load the acceptance store. NEVER throws: absent, unreadable, over-sized,
 * invalid-JSON, wrong-version, or digest-mismatched all degrade to an EMPTY
 * store (nothing suppressed -- fails toward SHOWING findings) with a
 * structured warning naming the cause (except "absent", which is the
 * ordinary first-run case and warns nothing). Malformed individual records
 * are dropped (their own warning, with a count) rather than failing the
 * whole store; valid records beyond {@link MAX_RECORDS} (oldest first) are
 * also dropped, with a distinct warning -- the two causes mean different
 * things to the user (corruption vs a limit) so they are never conflated.
 */
export declare function loadAcceptanceStore(storePath: string): {
    store: AcceptanceStore;
    warnings: AcceptanceWarning[];
};
//# sourceMappingURL=security-acceptance.d.ts.map