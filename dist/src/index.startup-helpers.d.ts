/**
 * @fileoverview Startup-flag and bundled-skill helpers extracted from index.ts (SMI-5639).
 * @module @skillsmith/mcp-server/index.startup-helpers
 *
 * Extracted to keep index.ts under the `audit:standards` 500-LOC gate after
 * SMI-5639's shutdown-hook fix. No behavior change from the prior in-file
 * versions.
 */
/**
 * Handle --docs flag to open user documentation
 */
export declare function handleDocsFlag(): void;
/**
 * SMI-4790: Idempotent install of the bundled `skillsmith` slash-command skill
 * for MCP-only users (who never ran `skillsmith setup`) and recovery if the
 * skill was uninstalled. Delegates routing to the existing
 * `installBundledSkills()` which honours the SKILLSMITH_CLIENT env var via
 * `resolveClientPath()` (Claude Code default; cursor/copilot/windsurf via env).
 *
 * Quiet by design: `installBundledSkills()` only logs when it actually copies
 * a skill or hits an error, so happy-path startup adds zero stderr.
 */
export declare function ensureSkillsmithSkillInstalled(): void;
//# sourceMappingURL=index.startup-helpers.d.ts.map