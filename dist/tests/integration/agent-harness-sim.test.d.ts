/**
 * SMI-5456 Wave 1 Step 6 — Validation Ladder Level 2a: harness-simulation MCP
 * client.
 *
 * Spawns the REAL built mcp-server binary over stdio (no mocks), once per
 * simulated harness, and performs a genuine MCP `initialize` handshake with
 * that harness's `clientInfo` — covering all seven Wave-1 targets without
 * needing any harness binary installed (`docs/internal/implementation/
 * smi-5456-skillsmith-agent-wave1.md` Validation Ladder, L2a). Per harness
 * this asserts the four L2a categories:
 *   1. ListTools returns exactly the curated agent profile (SKILLSMITH_TOOL_PROFILE=agent).
 *   2. A CallTool round-trips through the `_meta` marker channel without erroring.
 *   3. Consent gating: with telemetry unconfigured (default/off), the call
 *      completes fast with no network side effect.
 *   4. A CallTool round-trips through the session marker-FILE channel
 *      (PRIMARY channel per Step-0 spike (e): no Tier-1 harness is documented
 *      as able to inject `_meta` on a genuine tool call today) — and the
 *      suggest -> apply -> undo trio is present in the listing.
 *
 * PROCESS-BOUNDARY LIMITATION (read before extending): `withTelemetry`'s
 * emission gate (`packages/core/src/telemetry/wrap.ts`) is in-process module
 * state (a closure variable + a module-scoped `Set`). A spawned child
 * process cannot be introspected for "did trackSkillInvoke actually get
 * called" the way an in-process mock can — a suppressed event has no
 * wire-visible signal (that IS the gate's job: nothing crosses the stdio
 * JSON-RPC channel). The consent-gating assertions below are therefore
 * necessarily indirect: fast, error-free completion with zero telemetry
 * config in the spawned env (see `baseSpawnEnv` — no `POSTHOG_API_KEY` /
 * `SUPABASE_URL`) proves no network attempt was made, since
 * `initializePostHog` / `resolveConsent` both fail fast and silently without
 * those vars. The DEFINITIVE emission-suppression proof is the existing
 * in-process unit test at `packages/core/src/telemetry/wrap.marker.test.ts`
 * ("consent parity — marker fields never emit when the gate suppresses"),
 * which mocks `trackSkillInvoke` directly and is unaffected by this
 * limitation. The `marker channel precedence — unit-level fallback` describe
 * block below closes the equivalent process-boundary gap for the marker-FILE
 * reader by importing `@skillsmith/core/telemetry` directly in-process, per
 * the worker brief's explicit fallback instruction.
 *
 * FIXED (was a KNOWN GAP at this suite's original writing): every tool's
 * `withTelemetry` call site still hardcodes `extractFramework: () =>
 * 'unknown'` (verified via `grep -rn "extractFramework: () => 'unknown'"
 * packages/mcp-server/src/tools/`), but `agent-marker.ts` now threads the
 * marker file's (or `_meta`'s) `harness` hint into the resolved `AgentMarker`
 * as a vocabulary-gated `harness` field, and `wrap.ts`'s emit path prefers
 * `marker.harness` over the per-call extractor result
 * (`framework: marker?.harness ?? framework`) — see SMI-5456
 * `packages/core/src/telemetry/agent-marker.ts` (`KNOWN_HARNESS_FRAMEWORKS`)
 * and `wrap.ts`. So the per-harness `framework` value the plan's telemetry
 * wire format targets (`opencode`, `hermes`, etc.) now reaches the wire for
 * every MCP-tool event whose marker channel supplied a valid harness hint.
 * This suite still cannot observe `framework` over the wire (it isn't part
 * of any tool response) — process-boundary limitation above — so it does not
 * assert per-framework emission values itself; that is proven at the unit
 * level by `packages/core/src/telemetry/wrap.marker.test.ts` ("marker
 * harness feeds framework"). This suite only proves the `harness` field
 * round-trips through a marker file without crashing, i.e. the round-trip
 * half of the SMI-5456 fix, not the emission half.
 */
export {};
//# sourceMappingURL=agent-harness-sim.test.d.ts.map