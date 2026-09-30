/**
 * @fileoverview SMI-6622 item 9 — regression guards for code this issue does NOT change
 * @see SMI-6622: `registry-tools.ts` stopped gating its own service selection / team resolution on
 *      Supabase env vars. This file proves that move was scoped correctly: `team-resolver.ts`'s
 *      shared `resolveLicenseTeamId()` (still used directly by other tool families — SMI-6623) and
 *      the sibling `team-workspace`/`rbac-tools`/`sso-tools` families' own service selection are
 *      untouched.
 *
 * Deliberately standalone — no import of `registry-tools.team.ts` anywhere in this file (not even
 * transitively through `registry-tools.js`), so these two guards keep passing even when that
 * module is reverted/deleted (the SMI-6598 revert-check `registry-tools.team.test.ts`'s own
 * new-behavior tests are held to). A shared file would fail this file's OWN load under that
 * revert, for a reason unrelated to what these two tests actually assert.
 */
export {};
//# sourceMappingURL=registry-tools.team-regression-guards.test.d.ts.map