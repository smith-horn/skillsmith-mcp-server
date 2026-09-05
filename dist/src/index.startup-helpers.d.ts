/**
 * @fileoverview Startup-flag, bundled-skill, and diagnostics helpers extracted
 * from index.ts (SMI-5639; runStartupDiagnostics added SMI-6111).
 * @module @skillsmith/mcp-server/index.startup-helpers
 *
 * Extracted to keep index.ts under the `audit:standards` 500-LOC gate. No
 * behavior change from the prior in-file versions — in particular, both
 * logging functions below take `version` explicitly rather than creating a
 * module-scope `logger` here, so their log records keep the real
 * `PACKAGE_VERSION` stamp index.ts's own logger uses instead of silently
 * downgrading to `createLogger`'s `'unknown'` default (caught in review of
 * SMI-6111 — a prior, still-live instance of the same drop dates back to this
 * file's SMI-5639 origin, in `ensureSkillsmithSkillInstalled`).
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
 *
 * @param version - Host package's `PACKAGE_VERSION` (index.ts), stamped on
 *   any log record emitted here. Defaults to `'unknown'` only for callers
 *   that genuinely don't have a version (e.g. direct unit tests).
 */
export declare function ensureSkillsmithSkillInstalled(version?: string): void;
/**
 * SMI-2163: Startup diagnostics for common installation issues
 * Detects native module problems and provides actionable error messages
 *
 * @param version - Host package's `PACKAGE_VERSION` (index.ts), stamped on
 *   any log record emitted here. Defaults to `'unknown'` only for callers
 *   that genuinely don't have a version (e.g. direct unit tests).
 */
export declare function runStartupDiagnostics(version?: string): void;
//# sourceMappingURL=index.startup-helpers.d.ts.map