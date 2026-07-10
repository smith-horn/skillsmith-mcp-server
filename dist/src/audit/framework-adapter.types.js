/**
 * @fileoverview Type vocabulary for the FrameworkAdapter seam — v1 ships
 *               `claude-code` only; v2 reserves `cursor`, `copilot`, `aider`,
 *               `continue`, `cline`. Defines `AdapterAction` (discriminated
 *               union over `FileRenameAction` + `InlineEditAction`) and the
 *               adapter interface.
 * @module @skillsmith/mcp-server/audit/framework-adapter.types
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §1, §5.
 *
 * Why this seam exists (per plan §5): `.cursorrules` (Cursor v2) is a
 * monolithic file with multiple trigger phrases inside a single file; a
 * `FileRenameAction`-only shape would break Cursor support. Shipping
 * `InlineEditAction` from v1 is a forcing function that lets v2 swap in
 * `cursorAdapter` without refactoring call sites.
 *
 * v1 contract (claudeCodeAdapter):
 *   - `FileRenameAction` is supported via convenience wrapper `applyRename`
 *     which performs the full Wave 2 `applyRename` flow (backup + ledger
 *     append + atomic rename). The bare `applyAction({kind:'rename'})`
 *     entry point is a raw transport seam (forward-compat for v2 adapters
 *     that own their own audit-history); v1 callers should prefer the
 *     `applyRename` wrapper which threads `auditId` through correctly.
 *   - `InlineEditAction` with `searchMode: 'literal'` translates to a
 *     `RecommendedEdit` and dispatches to Wave 3's `applyRecommendedEdit`.
 *   - `InlineEditAction` with `searchMode: 'regex'` is rejected with the
 *     typed error `namespace.adapter.unsupported_search_mode`. Reserved
 *     for v2 cursorAdapter.
 */
export {};
//# sourceMappingURL=framework-adapter.types.js.map