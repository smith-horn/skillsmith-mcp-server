/**
 * SMI-4790 Wave 1 Step 1.5: Test `installBundledSkills` routing + idempotency
 *
 * The MCP startup hook calls `installBundledSkills()` on every non-first-run
 * boot to ensure the bundled `skillsmith` slash-command skill is present.
 * The call must:
 * 1. Honour `SKILLSMITH_CLIENT` env var (Claude Code default; cursor/copilot/
 *    windsurf via env) — routing delegated to core's `resolveClientPath`.
 * 2. Be idempotent — second call when skill already exists is a no-op.
 *
 * This test pins the env-var contract at the boundary the MCP server depends
 * on. Core's own tests cover `resolveClientPath` semantics in depth; we
 * just verify the contract holds end-to-end here.
 */
export {};
//# sourceMappingURL=install-assets.test.d.ts.map