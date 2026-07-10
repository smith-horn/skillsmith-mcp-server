/**
 * @fileoverview Unit tests for SMI-4589 Wave 3 — edit-applier.
 * @module @skillsmith/mcp-server/tests/unit/edit-applier
 *
 * Covers the registry-rejection regression guard from plan §5 (synthetic
 * edits with `pattern: 'narrow_scope'` / `'reword_trigger_verb'` must be
 * rejected by `applyRecommendedEdit`'s registry guard, with the file
 * byte-for-byte unchanged) plus the apply happy path and stale-before
 * guard.
 *
 * Per-template gate (ratified 2026-05-01): only `add_domain_qualifier`
 * (4.10/5) is in `APPLY_TEMPLATE_REGISTRY`. The regression test guards
 * against future drift if SMI-4593 inadvertently registers a template
 * before passing the gate.
 */
export {};
//# sourceMappingURL=edit-applier.test.d.ts.map