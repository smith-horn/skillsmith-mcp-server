/**
 * @fileoverview Unit tests for SMI-4590 Wave 4 PR 4 — `apply_namespace_rename`
 *               MCP tool.
 * @module @skillsmith/mcp-server/tests/unit/apply-namespace-rename
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §2
 *       + §Tests `apply-namespace-rename.test.ts`.
 *
 * Coverage (mirrors the spec checklist):
 *   1. `action: 'apply'` round-trips via the suggested name.
 *   2. `action: 'custom'` uses `customName`.
 *   3. `action: 'custom'` without `customName` → Zod validation error.
 *   4. `action: 'skip'` → no-op success.
 *   5. Missing `auditId` → `namespace.audit.history_not_found`.
 *   6. Missing `collisionId` → `namespace.audit.collision_not_found`.
 *   7. Idempotent re-apply → `fromPath === toPath`.
 *
 * Pattern: drive a real `skill_inventory_audit` first to populate a fresh
 * `~/.skillsmith/audits/<auditId>/` (history + suggestions) under a temp
 * HOME, then exercise the apply tool. Avoids re-deriving the audit-write
 * path under test.
 */
export {};
//# sourceMappingURL=apply-namespace-rename.test.d.ts.map