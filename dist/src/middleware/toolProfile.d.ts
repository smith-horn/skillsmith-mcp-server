/**
 * Curated agent tool profile — SMI-5456 Wave 1 Step 2
 *
 * The full MCP surface (~45 registered tools) blows client tool budgets
 * (Cursor warns ~40; VS Code shares a 128-tool budget across all servers).
 * Setting `SKILLSMITH_TOOL_PROFILE=agent` narrows the `ListTools` response
 * to a curated ~15-tool profile sized for the portable agent pack. Unset,
 * or any value other than `'agent'`, is a no-op: full surface, zero
 * behavior change — this is the default for every existing install.
 *
 * Listing-only: this module never touches `CallTool` dispatch. A client
 * that already knows an out-of-profile tool name can still call it; tier
 * and license gating (`middleware/license.ts` / `middleware/quota.ts`) are
 * unchanged and still enforced there.
 *
 * @see docs/internal/implementation/smi-5456-skillsmith-agent-wave1.md
 * @see SMI-5456
 */
import { AGENT_TOOL_PROFILE_ENV_VAR, AGENT_TOOL_PROFILE_NAMES, AGENT_TOOL_PROFILE_VALUE } from '@skillsmith/core';
export { AGENT_TOOL_PROFILE_ENV_VAR, AGENT_TOOL_PROFILE_NAMES, AGENT_TOOL_PROFILE_VALUE };
/**
 * Whether the curated agent profile is active for this read of the env var.
 *
 * Read directly at point-of-use rather than cached at module load, matching
 * the existing convention for one-shot env checks elsewhere in this package
 * (e.g. `index.ts`'s `SKILLSMITH_AUTO_UPDATE_CHECK` / `SKILLSMITH_SKIP_SKILL_INSTALL`
 * checks, `context.ts`'s `SKILLSMITH_TELEMETRY_ENABLED` check). A fresh read
 * also means tests can flip the env var between cases without any module-reset
 * machinery, and — since `ListTools` can in principle be re-invoked within a
 * long-lived stdio session — a value change takes effect on the next listing
 * without a server restart.
 *
 * @param env - Injectable for tests; defaults to `process.env`.
 */
export declare function isAgentToolProfileActive(env?: NodeJS.ProcessEnv): boolean;
/**
 * Filter a tool-listing array down to the curated agent profile when active.
 *
 * No-op (returns a shallow copy of `tools`, unfiltered) when the profile is
 * not active — this is the default for unset or any non-`'agent'` value, so
 * every existing install sees exactly today's full surface.
 *
 * @param tools - Tool definitions as returned by the `ListTools` handler's
 *   source array. Only `name` is read; any richer tool-definition shape works.
 * @param env - Injectable for tests; defaults to `process.env`.
 */
export declare function filterToolsForAgentProfile<T extends {
    name: string;
}>(tools: readonly T[], env?: NodeJS.ProcessEnv): T[];
//# sourceMappingURL=toolProfile.d.ts.map