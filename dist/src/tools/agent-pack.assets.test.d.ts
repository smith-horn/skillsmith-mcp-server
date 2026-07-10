/**
 * SMI-5456 Wave 1 Step 4 — agent-pack + curated-profile coherence tests.
 *
 * These live in mcp-server because they bind the generator (`@skillsmith/core`)
 * to the single source of truth for the curated tool surface,
 * `AGENT_TOOL_PROFILE_NAMES` (this package). Two guarantees:
 *   1. the pack's tool references are a subset of the real 16-name profile; and
 *   2. the committed artifacts under `src/assets/agent-pack/` match the generator
 *      output byte-for-byte (drift gate — regenerate with
 *      `npm run generate:agent-pack` after any prompt-source change).
 */
export {};
//# sourceMappingURL=agent-pack.assets.test.d.ts.map