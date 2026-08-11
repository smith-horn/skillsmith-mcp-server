/**
 * @fileoverview SMI-5905 Wave 3 — `getContent()` entitlement + client-getter-split regression suite
 * @see docs/internal/implementation/private-registry-skill-install.md
 * @see supabase/functions/private-registry-get/index.entitlement.test.ts — the CLI-transport twin
 *
 * Two invariants, both of which a plausible future refactor could silently break:
 *
 * 1. **Entitlement is the ROW's team, never the caller's tier** (Sol plan-review finding #1).
 *    `profiles.tier` is `MAX(tier_rank)` across every team a user belongs to, so a user who is
 *    Enterprise via Team A reads `enterprise` globally even while Team B — which actually owns the
 *    row — has downgraded. The `caller is Enterprise via a DIFFERENT team` case below is the
 *    concrete inversion of that bypass, and it also asserts `profiles` is never read at all.
 *
 * 2. **`getAdminUserClient()` and `getMemberUserClient()` are never swapped at a call site.**
 *    Two assertions, because either alone is weak: the no-signed-in-user error messages differ per
 *    getter (so the call site is observable even when nothing else runs), and the audit row's
 *    `auth_role` is read back off the binding the getter produced (so a swap shows up in
 *    production telemetry, not only here).
 */
export {};
//# sourceMappingURL=registry-tools.live.content.test.d.ts.map