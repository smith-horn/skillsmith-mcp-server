/**
 * @fileoverview SMI-5407 end-to-end — GATE (read half): skill_outdated resolution.
 *
 * The READ half of the recover -> backfill -> skill_outdated gate (the WRITE
 * half lives in `packages/cli/tests/e2e/audit-sources-roundtrip.test.ts`). It
 * runs the REAL `executeOutdated` against a REAL temp manifest ($HOME-redirected)
 * + a REAL temp SQLite `skill_versions` table — nothing mocked.
 *
 * Load-bearing claim: `skill_outdated` keys update resolution on the manifest
 * entry `id` (getVersionHistory(entry.id)). The manifest mirrors what the CLI
 * backfill writes — registry `id` = the UUID, git `id` = owner/skill-name — and
 * skill_versions is seeded with the registry UUID PLUS decoy rows under the
 * owner/skill-name, owner/repo, and full-URL forms. The test passes only if the
 * UUID row resolves (not a decoy), proving the UUID is the load-bearing id; the
 * git owner/skill-name id (no row) resolves to `unknown`, yet its `source` still
 * passes `buildRawUrl` so View-Changes works. id and source are independent.
 *
 * SMI-5411 adds a third entry: a git-recovered skill whose repo IS catalog-known,
 * so `audit sources` enriched its id from owner/skill-name to the registry UUID.
 * Like the registry case, it resolves ONLY via that UUID (decoys under owner/
 * skill-name, owner/repo, and URL must lose) — proving the enriched id, not the
 * git tier's owner/skill-name, is what skill_outdated keys on.
 *
 * $HOME is set BEFORE the dynamic import of outdated.js (its install.helpers
 * module-level MANIFEST_PATH freezes at import).
 */
export {};
//# sourceMappingURL=skill-outdated-resolution.test.d.ts.map