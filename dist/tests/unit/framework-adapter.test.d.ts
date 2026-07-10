/**
 * @fileoverview Unit tests for SMI-4590 Wave 4 PR 2/6 — FrameworkAdapter
 *               seam + claudeCodeAdapter (v1).
 * @module @skillsmith/mcp-server/tests/unit/framework-adapter
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §5,
 *       §Tests §framework-adapter.test.ts.
 *
 * Coverage:
 *   1. `claudeCodeAdapter.name === 'claude-code'` + `describesFiles()` non-empty.
 *   2. `scanPaths()` returns valid `InventoryEntry[]` matching Wave 1's output.
 *   3. `applyAction({kind:'rename', from, to})` performs a raw `fs.rename`.
 *   4. `applyAction({kind:'inline-edit', searchMode:'literal', ...})` mutates
 *      the file via Wave 3's applyRecommendedEdit (registered template only).
 *   5. `applyAction({kind:'inline-edit', searchMode:'regex', ...})` throws
 *      `namespace.adapter.unsupported_search_mode` and the file is unchanged.
 *   6. Convenience wrapper `applyRename(entry, newName, { auditId })` runs
 *      Wave 2's applyRename flow (backup + ledger + rename) for a command file.
 *   7. Convenience wrapper `applyEdit(edit, { auditId })` round-trips through
 *      `applyAction` and mutates the file.
 *   8. Conformance: `claudeCodeAdapter` satisfies `FrameworkAdapter` (compile-
 *      time guard via the `const adapter: FrameworkAdapter = claudeCodeAdapter`
 *      assignment in this file).
 *   9. Inline-edit with missing `auditId` rejects with
 *      `namespace.adapter.missing_context`.
 *  10. Inline-edit with non-registered `pattern` rejects with
 *      `namespace.adapter.template_not_in_apply_registry`.
 */
export {};
//# sourceMappingURL=framework-adapter.test.d.ts.map