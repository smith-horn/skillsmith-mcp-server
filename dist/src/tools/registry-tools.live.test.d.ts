/**
 * @fileoverview Live-mode tests for private_registry_publish
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * Exercises the live Supabase-backed service (registry-tools.live.ts) by mocking
 * `getSupabaseAdminClient`/`getSupabaseUserClient` with recording fake clients (see
 * registry-tools.live.test-helpers.ts). `manage` (list/get/deprecate/namespace) coverage lives in
 * the sibling registry-tools.live.manage.test.ts — split from one file, SMI-5949 Wave 2, to stay
 * under the 500-line audit:standards gate. Focus areas (the exact bug classes plan-review flagged
 * for the notification layer, hardened here since Wave 2 builds on this table):
 *   - every operation is scoped to the license-resolved team_id (a caller can never
 *     target another team — the service-layer half of cross-tenant isolation; the
 *     DB/RLS half is asserted in scripts/tests/private-registry-rls.test.ts);
 *   - published (team_id, skill_id, version) triples are immutable (clean error, no
 *     silent upsert);
 *   - content over 2 MB and content missing SKILL.md are rejected before insert;
 *   - SMI-5949 Wave 2 Step 2 (D-7): publish() runs on the signed-in user's client, not
 *     service-role — the insert lands on the user client, sends no content_hash (not in the
 *     authenticated GRANT INSERT column list), and is representation-free (D-4(a)); a missing
 *     service-role key no longer blocks publish at all, only a missing user credential does.
 */
export {};
//# sourceMappingURL=registry-tools.live.test.d.ts.map