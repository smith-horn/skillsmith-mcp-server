/**
 * @fileoverview Live-mode tests for private_registry_manage (list/get/deprecate/namespace)
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * Exercises the live Supabase-backed service (registry-tools.live.ts) by mocking
 * `getSupabaseAdminClient`/`getSupabaseUserClient` with recording fake clients (see
 * registry-tools.live.test-helpers.ts). `publish` coverage lives in the sibling
 * registry-tools.live.test.ts — split from one file, SMI-5949 Wave 2, to stay under the 500-line
 * audit:standards gate. Focus areas:
 *   - every operation is scoped to the license-resolved team_id (a caller can never
 *     target another team — the service-layer half of cross-tenant isolation; the
 *     DB/RLS half is asserted in scripts/tests/private-registry-rls.test.ts);
 *   - SMI-5949 Wave 2 Step 3 (D-4 surfaces 3/4): list/get carry a mandatory
 *     approval_status='approved' in-query predicate, since service-role bypasses the RLS
 *     policy that would otherwise enforce it;
 *   - deprecate/undeprecate require a real representation (`.select()`) so a successful
 *     update is never misreported as not-found.
 */
export {};
//# sourceMappingURL=registry-tools.live.manage.test.d.ts.map