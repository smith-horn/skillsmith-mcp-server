/**
 * SMI-6472 Wave 2 — wire-level regression test for the `tools/list`
 * `title` + `annotations` passthrough.
 *
 * WHY THIS IS A WIRE TEST, NOT A UNIT TEST: every tool schema constant in
 * `packages/mcp-server/src/tools/*.ts` now carries a top-level `title` and
 * an `annotations: { readOnlyHint, destructiveHint }` object, and
 * `src/index.ts`'s `ListToolsRequestSchema` handler was updated to read and
 * re-emit both fields. But that handler is the ENTIRE wire-visible tool
 * shape — before this fix it mapped every tool to `{ name, description,
 * inputSchema }` only, silently stripping everything else (including
 * `title`/`annotations`) before the response ever left the process. A unit
 * test that imports `searchToolSchema` (etc.) directly and asserts on the
 * exported constant would pass even if that mapping regressed back to the
 * three-field shape — it never exercises the handler that actually produces
 * the wire response. So this suite spawns the REAL built server binary over
 * stdio (`connectHarness()` from `agent-harness-sim.helpers.ts`), performs a
 * genuine MCP `initialize` handshake with a real `@modelcontextprotocol/sdk`
 * `Client`, and asserts directly on the `tools/list` response that crosses
 * the wire — the only place this bug class is actually observable.
 *
 * `baseSpawnEnv()` pins `SKILLSMITH_TOOL_PROFILE: 'agent'`, which makes the
 * server return only a small curated subset of tools (see
 * `middleware/toolProfile.ts`'s `filterToolsForAgentProfile`). This suite
 * needs the FULL registered tool set, so it overrides that key back out of
 * the spawned env while keeping every other isolation/consent kill switch
 * `baseSpawnEnv()` sets.
 *
 * The harness is connected ONCE in `beforeAll` and its `tools/list` response
 * captured once — spawning a real child process + MCP handshake per
 * assertion would be expensive and this suite already runs under container
 * load alongside every other integration file.
 */
export {};
//# sourceMappingURL=tools-list-annotations.integration.test.d.ts.map