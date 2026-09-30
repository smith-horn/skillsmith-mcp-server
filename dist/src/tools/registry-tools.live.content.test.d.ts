/**
 * @fileoverview SMI-6651 (plan D14) — `getContent()` release-RPC regression suite
 * @see docs/internal/implementation/private-registry-skill-install.md
 * @see supabase/functions/private-registry-get/index.test.ts — the Edge Function transport twin
 * @see supabase/migrations/20260915000000_private_registry_content_release_rpc.sql — the RPC
 *
 * Before SMI-6651 this file modeled a three-step client-side flow: a metadata select, a
 * `check_registry_team_entitlement` RPC, and a `content` select — each a separate round trip over
 * the caller's own JWT. `authenticated` no longer holds table-level SELECT on
 * `private_registry_skills` at all (the migration above REVOKEs it and grants back only the
 * metadata columns), so a client-side `content` read is not merely unnecessary now, it is
 * impossible. All three steps are one `release_private_registry_skill_content` SECURITY DEFINER
 * RPC call, and this suite models THAT contract directly rather than the table access it replaced.
 * Version resolution, deprecated-row exclusion, and the team-scoped entitlement decision tree are
 * now internal to the RPC's own SQL and are covered by the migration's own test suite
 * (`scripts/tests/supabase/**`), not here — this file's job is the mapping between the RPC's
 * `status` and what `getContent()` does with it.
 *
 * Two invariants a plausible future refactor could silently re-break:
 *
 * 1. **`getAdminUserClient()` and `getMemberUserClient()` are never swapped at a call site** —
 *    kept from the pre-SMI-6651 suite; `setDeprecated()`'s admin-gated table access is unaffected
 *    by the RPC migration and still needs this coverage.
 * 2. **`getContent()` never reads `private_registry_skills` directly any more.** One dedicated
 *    test installs a client whose `.from()` THROWS unconditionally and confirms `getContent()`
 *    still succeeds — a regression here (reintroducing a client-side select) fails loudly.
 */
export {};
//# sourceMappingURL=registry-tools.live.content.test.d.ts.map