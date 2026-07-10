/**
 * Test utilities for MCP server tests
 * @see SMI-792: Database initialization
 * @see SMI-4240: createApiMockContext for API-path coverage
 * @see SMI-4756: async factory functions for WASM fallback in post-merge-verify CI
 */
import type { ApiSkill } from '@skillsmith/core';
import { type ToolContext } from '../context.js';
export type { ToolContext };
/**
 * SMI-4694: Symmetric disposer for `createTestContext` /
 * `createSeededTestContext` / `createApiMockContext`. Calls
 * `closeToolContext` to remove signal handlers, stop background sync,
 * close the LLM failover chain, and close the database. Tests using any
 * of the test-utils factories MUST call this in `afterAll`/`afterEach`
 * to prevent SIGTERM/SIGINT handler accumulation.
 *
 * Replaces ad-hoc `context.db.close()` patterns that bypassed the
 * cleanup in `closeToolContext`.
 */
export declare function disposeTestContext(context: ToolContext): Promise<void>;
/**
 * Create a test context with in-memory database
 * SMI-1183: Uses offline mode to avoid API calls during tests
 * SMI-4756: Async to use WASM fallback when better-sqlite3 native is unavailable
 */
export declare function createTestContext(): Promise<ToolContext>;
/**
 * Seed test data into the context
 */
export declare function seedTestData(context: ToolContext): void;
/**
 * Create a seeded test context
 * SMI-4756: Async to use WASM fallback when better-sqlite3 native is unavailable
 */
export declare function createSeededTestContext(): Promise<ToolContext>;
/**
 * SMI-4240: Minimal `ApiSkill` fields every mock fixture must provide.
 * Anything not listed here is optional and filled with sensible defaults.
 */
export type ApiSkillFixtureInput = Partial<ApiSkill> & Pick<ApiSkill, 'id' | 'name'> & {
    trust_tier?: ApiSkill['trust_tier'];
};
/**
 * SMI-4240: Create a ToolContext wired to an in-memory apiClient mock so
 * get-skill / search / recommend tests can exercise the API path
 * (`!isOffline()` branch) without touching the network.
 *
 * Pass a partial `ApiSkill`; defaults are filled in to satisfy the real
 * response validators. If the test calls `apiClient.getSkill(id)` with
 * an ID that doesn't match the fixture, the mock throws an Error whose
 * message matches the API client's own "Skill not found" shape so the
 * tool's fallback logic behaves identically to production.
 */
export declare function createApiMockContext(opts: {
    apiSkill: ApiSkillFixtureInput;
    /** Category names joined by the edge function; defaults to `[]`. */
    categories?: string[];
}): Promise<ToolContext>;
//# sourceMappingURL=test-utils.d.ts.map