/**
 * @fileoverview SMI-5407 end-to-end — MCP `skill_recover_source` via real dispatch.
 *
 * Drives the production dispatch path (`dispatchProvenanceTool`) against a REAL
 * temp filesystem fixture and a REAL offline ToolContext (in-memory `skills`).
 * Asserts the per-directory recovery report AND that the tool is read-only —
 * the on-disk manifest sentinel is byte-identical after the call.
 *
 * $HOME is set to the temp home BEFORE the dynamic import of the dispatch module
 * (the install.types module-level MANIFEST_PATH freezes at import time), per the
 * read-only guarantee under test.
 */
export {};
//# sourceMappingURL=skill-recover-source.dispatch.test.d.ts.map