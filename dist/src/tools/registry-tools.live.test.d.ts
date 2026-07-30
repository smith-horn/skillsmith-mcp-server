/**
 * @fileoverview Live-mode tests for private_registry_publish + private_registry_manage
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * Exercises the live Supabase-backed service (registry-tools.live.ts) by mocking
 * `getSupabaseAdminClient` with a recording fake client. Focus areas (the exact
 * bug classes plan-review flagged for the notification layer, hardened here since
 * Wave 2 builds on this table):
 *   - every operation is scoped to the license-resolved team_id (a caller can never
 *     target another team — the service-layer half of cross-tenant isolation; the
 *     DB/RLS half is asserted in scripts/tests/private-registry-rls.test.ts);
 *   - published (team_id, skill_id, version) triples are immutable (clean error, no
 *     silent upsert);
 *   - content over 2 MB and content missing SKILL.md are rejected before insert;
 *   - a missing service-role key surfaces as a typed error, not a raw 42501.
 */
export {};
//# sourceMappingURL=registry-tools.live.test.d.ts.map