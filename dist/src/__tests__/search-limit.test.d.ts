/**
 * SMI-5896 Wave 3 Step 3: `limit` threading tests for MCP `search`.
 *
 * Before this fix, `search`'s own description text advertised a `limit`
 * parameter that didn't exist in the input schema/type — a caller-supplied
 * `limit` was silently dropped by MCP argument validation, and both the
 * API-path and local-fallback branches hardcoded `.slice(0, 10)`. Covers the
 * plan's required test matrix: API-path success, local-fallback path,
 * omitted `limit` (defaults to 10), out-of-range `limit` (clamped, not
 * rejected) — plus a schema/description-drift regression guard.
 */
export {};
//# sourceMappingURL=search-limit.test.d.ts.map