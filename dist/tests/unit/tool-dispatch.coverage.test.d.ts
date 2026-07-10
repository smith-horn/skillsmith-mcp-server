/**
 * @fileoverview Regression guard: every tool advertised via ListTools must
 * be routable by `dispatchToolCall` (SMI-5477).
 *
 * SMI-5477: `skill_inventory_audit`, `apply_namespace_rename`, and
 * `apply_recommended_edit` were pushed onto `index.ts`'s `toolDefinitions`
 * array (so MCP clients discovered them via `ListTools`) without a matching
 * case in `dispatchToolCall`'s switch, so every real call fell through to
 * the `default` branch's `throw new Error('Unknown tool: ' + name)` — listed
 * but uncallable in every published release for months (fixed by SMI-5470's
 * explicit cases in `tool-dispatch.ts`). No test asserted
 * "listing ⊆ dispatchability", so the break shipped silently.
 *
 * This file parses the ACTUAL `toolDefinitions` array out of `index.ts`'s
 * source text — `index.ts` cannot be imported directly in tests; its
 * top-level `main().catch(...)` starts the real stdio server (see
 * `src/middleware/toolProfile.test.ts` for the same constraint) — and
 * dynamically resolves every entry (plain schema imports AND the two
 * `...builder()` spreads) to its runtime `.name`, exactly mirroring what
 * `index.ts` does at module load. The result is table-driven through
 * `dispatchToolCall`: a tool added to the ListTools array without a
 * matching dispatch case fails this suite BY NAME, automatically — no
 * edit to this file required.
 */
export {};
//# sourceMappingURL=tool-dispatch.coverage.test.d.ts.map