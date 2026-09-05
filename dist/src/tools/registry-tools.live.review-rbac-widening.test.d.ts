/**
 * @fileoverview SMI-6202 — `review_private_registry_submission()`'s admin-check widened from a
 *   raw `p_team_id NOT IN (SELECT user_admin_team_ids())` predicate to
 *   `NOT has_team_permission(p_team_id, 'registry:approve')`
 * @see supabase/migrations/20260827000000_team_permission_grants.sql
 * @see supabase/migrations/20260827000001_rbac_seam_widening.sql
 * @see registry-tools.live.admin-auth.test.ts — this file's SMI-5822 sibling (deprecate/
 *   undeprecate/publish credential coverage). Split out rather than appended there, to stay under
 *   the 500-line audit:standards budget — that file's own coverage was already close to it.
 *
 * These are app-layer verbatim-passthrough tests, the SAME convention already established by
 * `registry-tools.live.review-decision.test.ts`'s M10 suite: the RPC's own SQL resolution logic
 * (owner exemption, deny-wins, default-matrix fallback) is proven once, by the first migration's
 * own inline smoke block (s1-s6) and the second migration's own inline smoke block (s1-s12b,
 * s-explain) — this file only confirms `review()` forwards whatever the RPC decides, unmodified,
 * for each of the scenarios `team_permission_grants` introduces. No test anywhere in the codebase
 * previously exercised `review()` against more than the OLD admin/owner-only predicate — b1/b2/b3
 * and the cross-team case below are all genuinely new coverage, not updates to prior cases.
 *
 * Mock/fixture style deliberately mirrors registry-tools.live.admin-auth.test.ts's own local
 * `createRecorder` (a chain-based `from()` fake plus a `respond`-per-call script), extended with
 * one `rpc()` branch for `review_private_registry_submission` — not the `createFakeClient`/
 * `rpcResponder` helper from registry-tools.live.test-helpers.ts, so this suite reads as a direct
 * continuation of the admin-auth file it was split from rather than a differently-styled sibling.
 */
export {};
//# sourceMappingURL=registry-tools.live.review-rbac-widening.test.d.ts.map