/**
 * @fileoverview `claudeCodeAdapter` — v1 implementation of `FrameworkAdapter`.
 *               Wraps Wave 1's `scanLocalInventory`, Wave 2's `applyRename`,
 *               and Wave 3's `applyRecommendedEdit` behind a uniform seam.
 * @module @skillsmith/mcp-server/audit/framework-adapter
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §5.
 *
 * v1 contract (Claude-Code only):
 *   - `scanPaths` delegates to `scanLocalInventory` and returns `entries[]`.
 *   - `applyAction({kind:'rename'})` is REFUSED — a thin {from, to} pair
 *     cannot reconstruct the `InventoryEntry` Wave 2's `applyRename`
 *     needs (kind discriminator, identifier, source_path), and a raw
 *     `fs.rename` would bypass the backup + namespace ledger and leave
 *     the user without a revert path. Callers must use the
 *     `applyRename(entry, newName, { auditId })` convenience wrapper.
 *     The bare `{kind:'rename'}` shape stays in the union as a forward-
 *     compat surface for v2 adapters that own their own audit-history.
 *   - `applyAction({kind:'inline-edit', searchMode:'literal'})` translates
 *     the action into a Wave 3 `RecommendedEdit` and dispatches to
 *     `applyRecommendedEdit`. Requires `action.auditId` + `action.pattern`;
 *     missing context throws `namespace.adapter.missing_context`.
 *   - `applyAction({kind:'inline-edit', searchMode:'regex'})` throws the
 *     typed error `namespace.adapter.unsupported_search_mode`. Reserved
 *     for v2 cursorAdapter.
 *   - Convenience wrappers `applyRename` + `applyEdit` build the right
 *     `AdapterAction` shape from inventory/edit context and call
 *     `applyAction`. They do NOT re-implement Wave 2/3 — the rename
 *     wrapper goes through Wave 2's full path (backup + ledger), and the
 *     edit wrapper goes through Wave 3's `applyRecommendedEdit`.
 */
import { newAuditId } from './audit-history.js';
import type { FileRenameAction, FrameworkAdapter, InlineEditAction } from './framework-adapter.types.js';
/**
 * Typed error class for adapter-layer failures. Callers `switch` on
 * `kind` to branch on the failure mode without parsing strings.
 */
export declare class FrameworkAdapterError extends Error {
    readonly kind: 'namespace.adapter.unsupported_search_mode' | 'namespace.adapter.missing_context' | 'namespace.adapter.unsupported_action' | 'namespace.adapter.template_not_in_apply_registry' | 'namespace.adapter.search_not_found' | 'namespace.adapter.search_not_unique' | 'namespace.adapter.subcall_failed';
    /**
     * For `'subcall_failed'`, carries the inner typed-error `kind` from
     * Wave 2 (`RenameError`) or Wave 3 (`EditApplyError`) so callers can
     * `switch` on it without parsing strings.
     */
    readonly innerKind?: string;
    constructor(kind: FrameworkAdapterError['kind'], message: string, innerKind?: string);
}
/**
 * v1 implementation of `FrameworkAdapter` for Claude-Code.
 */
export declare const claudeCodeAdapter: FrameworkAdapter;
export { newAuditId };
export type { FileRenameAction, InlineEditAction };
//# sourceMappingURL=framework-adapter.d.ts.map