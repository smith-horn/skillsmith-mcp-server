/**
 * SMI-5456 Wave 1 Step 6 — helpers for the L2a harness-simulation MCP client
 * (`agent-harness-sim.test.ts`). Split out per the 500-line file gate.
 *
 * Spawns the REAL built `@skillsmith/mcp-server` binary over stdio (no
 * mocks) and connects a genuine `@modelcontextprotocol/sdk` `Client` to it —
 * the same transport class a real harness uses.
 */
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
/** `packages/mcp-server/tests/integration` -> repo root is 4 levels up. */
export declare const REPO_ROOT: string;
export declare const DIST_ENTRY: string;
/**
 * Build `@skillsmith/mcp-server` if `dist/src/index.js` is missing.
 * Mirrors `startup-probe.test.ts`'s beforeAll guard (plan-review H9: a
 * spawn-based test must never silently run against a stale/absent dist).
 *
 * SMI-5548: in a local pre-push run (SKILLSMITH_PREPUSH=1) with dist absent —
 * the normal state for a worktree, which never has a built dist/, and where
 * the build itself fails because the worktree's node_modules symlink is
 * EINVAL under Docker — this is a no-op. The caller (the suite-level
 * `describe.skipIf`) is responsible for skipping the suite in that same
 * condition; CI never sets SKILLSMITH_PREPUSH, so it always builds/throws
 * here exactly as before.
 */
export declare function ensureDistBuilt(): void;
/**
 * A simulated harness's `clientInfo` (sent during the real MCP `initialize`
 * handshake) plus a stable id used for marker-file `harness` hints and test
 * descriptions. Covers all seven Wave-1 targets (5 `HarnessId` + windsurf +
 * hermes, matching `McpHarnessId` in `agent-harness-targets.ts`).
 */
export interface HarnessCase {
    id: string;
    clientInfo: {
        name: string;
        version: string;
    };
}
export declare const HARNESS_CASES: readonly HarnessCase[];
/**
 * A per-test isolated `HOME`. `getConfigDir()`/`getDefaultDbPath()` both
 * resolve off `os.homedir()`, which reads `$HOME` on Linux (the Docker CI/
 * dev target for this suite) — isolating it keeps the spawned server from
 * touching the real developer's `~/.skillsmith`.
 */
export declare function createIsolatedHome(prefix: string): {
    homeDir: string;
    cleanup: () => void;
};
/**
 * Explicit, minimal spawn env. `StdioClientTransport` only auto-inherits
 * `HOME/LOGNAME/PATH/SHELL/TERM/USER` (`getDefaultEnvironment()`) — everything
 * else must be listed here. Deliberately OMITS `SUPABASE_URL`,
 * `SUPABASE_ANON_KEY`, `POSTHOG_API_KEY`, and `SKILLSMITH_TELEMETRY_ENABLED`:
 * this is the consent-off/no-network-telemetry default every real install
 * starts from, and it is what lets the consent-gating assertions run fully
 * offline (see the file header of `agent-harness-sim.test.ts`).
 */
export declare function baseSpawnEnv(homeDir: string): Record<string, string>;
/**
 * Write a session marker file under `<homeDir>/.skillsmith/agent-markers/` —
 * the on-disk shape a harness's SessionStart hook writes
 * (`packages/core/src/telemetry/agent-marker.ts` `AgentMarkerFile`). This is
 * the PRIMARY marker channel for Wave 1 (Step-0 spike finding (e): no Tier-1
 * harness can inject `_meta` on a genuine tool call today).
 */
export declare function writeAgentMarkerFile(homeDir: string, opts: {
    sessionId: string;
    harness: string;
    agentSession?: boolean;
    nudgeOrigin?: boolean;
    triggerId?: string | null;
    startedAt?: number;
}): void;
/**
 * Minimal shape this suite actually consumes from a `tools/call` response.
 * The SDK's real `CallToolResult` type is a union across a legacy
 * (`toolResult`) and current (`content`) shape — narrower than what this
 * suite needs, so we only assert the fields we read.
 */
export interface ToolCallResultLike {
    isError?: boolean;
    content?: unknown[];
    [key: string]: unknown;
}
/** Minimal shape this suite consumes from a `tools/list` response. */
export interface ToolListResultLike {
    tools: Array<{
        name: string;
        [key: string]: unknown;
    }>;
}
export interface HarnessConnection {
    client: Client;
    listTools: () => Promise<ToolListResultLike>;
    callTool: (params: {
        name: string;
        arguments?: Record<string, unknown>;
        _meta?: Record<string, unknown>;
    }) => Promise<ToolCallResultLike>;
    close: () => Promise<void>;
}
/**
 * Spawn the real built server and connect a real MCP `Client`, performing a
 * genuine `initialize` handshake with `clientInfo` — exactly what a harness
 * does. `env` is intentionally required (not defaulted) so every call site
 * makes its isolation/consent posture explicit.
 */
export declare function connectHarness(clientInfo: {
    name: string;
    version: string;
}, env: Record<string, string>): Promise<HarnessConnection>;
//# sourceMappingURL=agent-harness-sim.helpers.d.ts.map