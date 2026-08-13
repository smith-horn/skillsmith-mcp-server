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
export interface ConnectHarnessOptions {
    /** Overrides `CONNECT_HARNESS_TIMEOUT_MS` for a single call (tests only). */
    timeoutMs?: number;
}
export interface ConnectHarnessTimeoutDiagnostics {
    elapsedMs: number;
    pid: number | null;
    /** Trailing stderr captured from the spawned process up to the timeout. */
    stderr: string;
}
/**
 * SMI-6002: thrown when `connectHarness()`'s own liveness budget
 * (`CONNECT_HARNESS_TIMEOUT_MS`) is exceeded. Carries the same
 * stderr/pid/elapsed diagnostics baked into the message as structured fields,
 * so a future caller can act on them programmatically instead of re-parsing
 * the message string.
 */
export declare class HarnessConnectTimeoutError extends Error {
    readonly diagnostics: ConnectHarnessTimeoutDiagnostics;
    constructor(message: string, diagnostics: ConnectHarnessTimeoutDiagnostics);
}
/**
 * SMI-6002: per-harness `connectHarness()` liveness budget. Sized from real
 * reproduction data across two independent protocols (all 7 harnesses each
 * run, exact `npx vitest run` invocations, see the Linear issue comment / PR
 * description for the full protocol and container/load-average numbers):
 *   - full `packages/mcp-server` suite running concurrently (75 files,
 *     1204 tests): 2.0-22.2s per harness across contention levels
 *   - `agent-harness-sim.test.ts` bundled with the other two historically-
 *     heavy integration files (`crash-handler-integration.test.ts`,
 *     `security-acceptance-lost-update.test.ts`) under genuine concurrent
 *     host load (3-6 sibling worktree containers, host load average ~16-100
 *     on a 10-core host, verified via `docker stats`/`uptime` at run time),
 *     3 repeated runs, 21 samples: min 10.0s, median 36.2s, max 60.3s (the
 *     60.3s sample — harness `hermes`, run 2 — occurred during a host-load
 *     spike to ~90-100, an unusually extreme but genuinely observed
 *     multi-session level, not synthetic)
 * The original SMI-5999-session observation (3 of 7 harnesses exceeding the
 * old 30s budget, file total ~194s) sits between these two protocols'
 * observed maxima — the second protocol's 60.3s sample is the closest
 * reproduction of that historical severity obtained so far. 120s gives real
 * headroom (~2x the single most extreme observed sample, ~5.4x the
 * full-suite protocol's max) without being unbounded, a contention allowance
 * rather than a performance target: `connectHarness()` spawns a real Node
 * child process and performs a genuine MCP `initialize` handshake, both
 * sensitive to host CPU scheduling delay under load, not to any defect in
 * the code under test. 21 samples is enough to characterize min/median/max
 * but not a defensible p99, so this is a deliberately round, generous number
 * rather than a tightly-fit percentile — matching the precedent already set
 * by this same file's `crash-handler-integration.test.ts` sibling, whose own
 * spawn-based outer `beforeAll` uses the same 120_000ms budget.
 */
export declare const CONNECT_HARNESS_TIMEOUT_MS = 120000;
/**
 * Spawn the real built server and connect a real MCP `Client`, performing a
 * genuine `initialize` handshake with `clientInfo` — exactly what a harness
 * does. `env` is intentionally required (not defaulted) so every call site
 * makes its isolation/consent posture explicit.
 *
 * SMI-6002: races the connect attempt against `CONNECT_HARNESS_TIMEOUT_MS`
 * (or `options.timeoutMs`) instead of relying solely on Vitest's own
 * `beforeAll` hook timeout. A Vitest hook timeout alone does NOT cancel the
 * in-flight `client.connect()` call or terminate the spawned child process —
 * it just stops waiting and marks the hook failed, leaving the process (and
 * this function's promise) running unobserved in the background. Racing
 * internally lets this function itself detect the overrun, capture
 * stderr/pid diagnostics at that moment, and terminate the spawned process
 * deterministically, regardless of whether Vitest's own hook timeout ever
 * fires (the caller sizes its hook timeout with headroom over this value).
 */
export declare function connectHarness(clientInfo: {
    name: string;
    version: string;
}, env: Record<string, string>, options?: ConnectHarnessOptions): Promise<HarnessConnection>;
//# sourceMappingURL=agent-harness-sim.helpers.d.ts.map