/**
 * Quota wiring integration tests for skill_suggest
 *
 * @see SMI-2679: Wire quota middleware to skill_suggest in index.ts
 * @see SMI-2684: Create quota-wiring.test.ts
 *
 * NOTE: These tests live in a NEW file, not license.test.ts.
 * license.test.ts is already 734 lines (over the 500-line gate).
 *
 * These tests verify the quota enforcement path added in index.ts:
 * - skill_suggest is a community tool (null in TOOL_FEATURES)
 * - quota exceeded → buildExceededResponse returned (not executeSuggest result)
 * - quota allowed → executeSuggest proceeds normally
 * - exceeded response has isError:true in MCP format
 */
export {};
//# sourceMappingURL=quota-wiring.test.d.ts.map