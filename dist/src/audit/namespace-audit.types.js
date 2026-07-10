/**
 * @fileoverview Shared namespace-audit type vocabulary (SMI-4588 Wave 2 Step 1, PR #1).
 * @module @skillsmith/mcp-server/audit/namespace-audit.types
 *
 * `NamespaceWarning` and `PendingCollision` live here — not in
 * `tools/install.types.ts` and not in `audit/install-preflight.ts` — to break
 * the `tools → audit → tools` cycle that would otherwise form between
 * `install-preflight.ts` (which constructs them) and `install.types.ts`
 * (which embeds them in `InstallResult`). The shared file is depended on by
 * both sides; neither side depends on the other.
 *
 * Wave 2 plan §4 + Edit 3 — placed in Step 1 so PRs #3/#4 import without
 * rework.
 *
 * `RenameSuggestion` is imported from `./rename-engine.types.js` (PR #2). The
 * PR #1 forward-declaration shim has been retired now that the canonical
 * type ships alongside the rename engine.
 */
export {};
//# sourceMappingURL=namespace-audit.types.js.map