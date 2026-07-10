/**
 * SMI-5009: MCP server startup capability probe tests.
 *
 * Covers the structured `[skillsmith] embeddings: …` stderr log that runs once
 * at server boot to make transformers-availability observable in production.
 *
 * Two tiers:
 *   1. Unit tests — exercise probe behavior directly by stubbing
 *      EmbeddingService.checkAvailability / getTransformersLoadError before
 *      importing the mcp-server module under test. Cheap and deterministic.
 *   2. Integration test — spawn the real built `dist/src/index.js` binary
 *      with SKILLSMITH_USE_MOCK_EMBEDDINGS=true and assert the stderr line
 *      appears (and stdout stays clean per MCP stdio protocol). Gated by a
 *      `beforeAll` that builds dist if absent (plan-review H9).
 */
export {};
//# sourceMappingURL=startup-probe.test.d.ts.map