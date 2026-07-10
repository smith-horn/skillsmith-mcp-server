/**
 * @fileoverview MCP Server Tool Context - Database initialization and shared services
 * @module @skillsmith/mcp-server/context
 * @see SMI-792: Add database initialization to MCP server
 * @see SMI-898: Path traversal protection for DB_PATH
 * @see SMI-2741: Async context split into context.async.ts to meet 500-line standard
 *
 * Provides shared context for MCP tool handlers including:
 * - SQLite database connection with FTS5 search
 * - SearchService for skill discovery
 * - SkillRepository for CRUD operations
 * - Secure path validation for database paths
 *
 * @example
 * // Initialize context at server startup
 * const context = createToolContext();
 *
 * // Pass to tool handlers
 * const result = await executeSearch(input, context);
 */
export type { ToolContext, TelemetryConfig, BackgroundSyncConfig, ToolContextOptions, } from './context.types.js';
export { getDefaultDbPath, ensureDbDirectory } from './context.helpers.js';
export { createToolContextAsync, getToolContextAsync, resetAsyncToolContext, } from './context.async.js';
import type { ToolContext, ToolContextOptions } from './context.types.js';
/**
 * Create the shared tool context with database and services
 *
 * @param options - Configuration options
 * @returns Initialized tool context
 *
 * @see SMI-898: Path traversal protection
 * - Custom dbPath is validated for path traversal attacks
 * - Rejects paths with ".." or outside allowed directories
 *
 * @example
 * // With default path (~/.skillsmith/skills.db)
 * const context = createToolContext();
 *
 * @example
 * // With custom path (must be in allowed directory)
 * const context = createToolContext({ dbPath: '~/.skillsmith/custom.db' });
 *
 * @example
 * // For testing with in-memory database
 * const context = createToolContext({ dbPath: ':memory:' });
 *
 * @throws Error if dbPath contains path traversal attempt
 */
export declare function createToolContext(options?: ToolContextOptions): ToolContext;
/**
 * Close the tool context and release resources
 * SMI-1184: Also shuts down PostHog telemetry if initialized
 * SMI-1524: Also closes LLM failover chain
 *
 * @param context - Tool context to close
 */
export declare function closeToolContext(context: ToolContext): Promise<void>;
/**
 * Get or create the global tool context
 * Uses singleton pattern for MCP server lifecycle
 *
 * Note: Options are only applied on first call. Subsequent calls
 * return the cached context and ignore any options.
 *
 * @param options - Configuration options (only used on first call)
 * @returns The global tool context
 */
export declare function getToolContext(options?: ToolContextOptions): ToolContext;
/**
 * Reset the global context (for testing)
 * SMI-1184: Made async to properly shutdown PostHog
 */
export declare function resetToolContext(): Promise<void>;
//# sourceMappingURL=context.d.ts.map