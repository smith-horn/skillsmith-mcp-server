/**
 * @fileoverview Live RBAC service — RPC wiring and refusal mapping
 * @see SMI-6203 Wave 2: `createLiveRBACService()` (`rbac-tools.live.ts`)
 * @see SMI-6203 security round: `rpcError()` must carry the PostgREST SQLSTATE across, or the
 *   whole `PASSTHROUGH_REFUSALS` allowlist is unreachable in production AND a raw Postgres
 *   `42501` (which names internal schema objects) leaks verbatim to the customer.
 * @see SMI-6319 (`supabase/migrations/20260901000000_rbac_meta_permission_not_grantable.sql`):
 *   adds gate 4b's two new `PASSTHROUGH_REFUSALS` entries (neither meta-permission may ever be
 *   GRANTED to a role, by any caller including the owner). This file mocks the RPC response
 *   directly rather than exercising the stub's own gates, so no setup step here was broken by
 *   SMI-6319 — the only change needed is completing the `it.each` allowlist-rendering check
 *   below to cover the 2 new strings alongside the 6 it already pinned.
 *
 * Split into its own file rather than appended to `rbac-tools.test.ts` — that file is a
 * stub-mode suite and is already at its 500-line audit:standards budget. Mock style deliberately
 * mirrors `registry-tools.live.review-rbac-widening.test.ts`'s (hoisted fake JWT, `vi.mock` of
 * `../supabase-client.js` + `./team-resolver.js`, a local scripted client), so the two live-service
 * suites read the same way.
 *
 * These are passthrough tests. The authorization decisions themselves are proven by the
 * migration's own inline smoke block (`20260828000000_rbac_grant_writes.sql`, w0-w7); this file
 * only confirms the TypeScript layer forwards the caller's parameters unmodified and renders
 * whatever the database refused with, without inventing, dropping, or leaking anything.
 */
export {};
//# sourceMappingURL=rbac-tools.live.test.d.ts.map