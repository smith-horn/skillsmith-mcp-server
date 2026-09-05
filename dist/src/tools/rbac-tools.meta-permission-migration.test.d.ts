/**
 * @fileoverview SMI-6319 — the shipped migration keeps BOTH of its enforcement points.
 * @see supabase/migrations/20260901000000_rbac_meta_permission_not_grantable.sql
 * @see rbac-tools.meta-permission-not-grantable.test.ts — the behavioural half of this suite
 *      (stub service, tool surface, error mapping). Split so neither file exceeds the 500-line
 *      `audit:standards` budget, and because these are a different KIND of test: static
 *      assertions about a shipped SQL artifact rather than assertions about runtime behaviour.
 *
 * WHY ASSERT ON MIGRATION TEXT AT ALL. `set_team_role_permission()` is enforced at two layers —
 * a table CHECK constraint and an in-function guard — and the specific regression this schema is
 * most exposed to silently removes the second one: a future `CREATE OR REPLACE FUNCTION
 * set_team_role_permission(...)` in an unrelated wave, reproducing the body from an older copy,
 * drops every function-level gate with no error, no failing test, and no diff against the table.
 * That function has already been through two rounds of gate rewrites; a third is likely. These
 * assertions are the tripwire for it, and they are the reason the CHECK constraint exists as the
 * primary defence rather than the guard alone.
 *
 * The runtime behaviour these pin is separately proven end-to-end by the migration's own inline
 * smoke block (s1-s8), which runs inside the same transaction as the DDL and rolls the whole
 * migration back on any failure.
 */
export {};
//# sourceMappingURL=rbac-tools.meta-permission-migration.test.d.ts.map