/**
 * @fileoverview SMI-6114 — committed private-registry mutations are audited by the database, not
 *   by a client-side service-role write
 * @see supabase/migrations/20260913000000_private_registry_audit_trigger.sql (trg_prs_audit)
 * @see scripts/tests/private-registry-audit-trigger.test.ts — the trigger itself, on real Postgres
 *
 * Production MCP hosts carry no `SUPABASE_SERVICE_ROLE_KEY`, so `getSupabaseAdminClient()` throws
 * there and every client-side audit row was silently dropped. These tests run the live service
 * with the admin getter rejecting exactly as it does in production and assert that a successful
 * publish, approve, reject, deprecate or undeprecate never reaches for it: the success record is
 * the trigger's, written in the mutation's own transaction, so a second client-side row would be
 * a duplicate on any host that does hold the key.
 *
 * The positive control at the bottom proves the harness can observe an admin-getter call at all,
 * so "not called" above cannot be an artefact of a broken mock.
 */
export {};
//# sourceMappingURL=registry-tools.live.server-audit.test.d.ts.map