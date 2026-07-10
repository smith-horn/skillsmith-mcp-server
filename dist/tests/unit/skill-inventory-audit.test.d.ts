/**
 * @fileoverview Unit tests for SMI-4590 Wave 4 PR 4 — `skill_inventory_audit`
 *               MCP tool.
 * @module @skillsmith/mcp-server/tests/unit/skill-inventory-audit
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §1
 *       + §Tests `skill-inventory-audit.test.ts`.
 *
 * Coverage (mirrors the spec checklist):
 *   1. Empty `~/.claude/` → empty arrays + populated `auditId` + on-disk report.
 *   2. Planted exact collision → `exactCollisions[]` + `renameSuggestions[]`.
 *   3. `deep: false` → `semanticCollisions: []`.
 *   4. Zod rejects unknown fields → typed validation envelope.
 *   5. `homeDir` outside allowed roots → typed `invalid_home_dir`.
 *   6. Audit-history round-trip via `readAuditHistory`.
 *   7. `applyExclusions: true` (default) — matching exclusions filter.
 *   8. `applyExclusions: false` — exclusions ignored.
 */
export {};
//# sourceMappingURL=skill-inventory-audit.test.d.ts.map