/**
 * @fileoverview Unit tests for shared team-resolver helper
 * @see SMI-4292: Wave 5A — Team workspaces foundation (finding C3)
 * @see SMI-6080: SKILLSMITH_API_KEY fallback for admin-granted (non-JWT) Enterprise access
 *
 * Both `SKILLSMITH_LICENSE_KEY` and `SKILLSMITH_API_KEY` are saved/cleared/restored around every
 * test that reads either. Before SMI-6080 only the license key mattered, so leaving a real
 * `SKILLSMITH_API_KEY` in the ambient environment was harmless; now it is a live input to
 * `readLicenseKey()` and would make these assertions environment-order-dependent.
 */
export {};
//# sourceMappingURL=team-resolver.test.d.ts.map