/**
 * @fileoverview licenseKeyFingerprint()'s credential source (SMI-6622 round 2)
 * @see SMI-6622: `licenseKeyFingerprint()` (registry-tools.live.audit.ts) previously read only
 *      `team-resolver.ts`'s env-only `readLicenseKey()`, so a caller authenticated purely via
 *      `~/.skillsmith/config.json`'s `apiKey` (no env var set at all — a real, supported credential
 *      source for `registry-tools.team.ts`'s team resolution) fingerprinted as `null`/absent even
 *      though a real credential authorized the operation. Fixed by reading the same
 *      `readRegistryCredential()` team resolution itself uses.
 *
 * Deliberately its own small file, not appended to registry-tools.live.audit.ts's future test
 * coverage — a parallel SMI-6114 branch is moving mutation audits server-side and edits that
 * source file; a separate test file here has no lines in common with whatever it adds.
 */
export {};
//# sourceMappingURL=registry-tools.live.audit.fingerprint.test.d.ts.map