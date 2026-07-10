/**
 * @fileoverview Integration round-trip test for SMI-4590 Wave 4 PR 4 — the
 *               full MCP tool surface (`skill_inventory_audit` →
 *               `apply_namespace_rename` → optional
 *               `apply_recommended_edit`).
 * @module @skillsmith/mcp-server/tests/integration/audit-roundtrip
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md
 *       §Tests `audit-roundtrip.test.ts`.
 *
 * End-to-end: drive the dispatcher's three new audit tools against a real
 * `~/.claude/` (planted under a `mkdtemp` HOME) and assert:
 *
 *   1. `skill_inventory_audit` discovers a planted exact collision and
 *      returns a non-empty `renameSuggestions[]`.
 *   2. `apply_namespace_rename` for the first suggestion mutates the
 *      filesystem to the expected post-rename layout.
 *   3. The same call repeated is idempotent — no new ledger entry, no
 *      file changes (Wave 2 ledger no-op semantics surface as
 *      `fromPath === toPath`).
 *   4. `apply_recommended_edit` for a hand-rolled `add_domain_qualifier`
 *      fixture mutates the SKILL.md prose body.
 *
 * Driving through `dispatchAuditTool` (vs the tool functions directly)
 * exercises the dispatcher case wiring + JSON-body envelope used by the
 * MCP server transport.
 */
export {};
//# sourceMappingURL=audit-roundtrip.test.d.ts.map