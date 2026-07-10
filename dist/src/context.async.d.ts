/**
 * @fileoverview Async Tool Context Creation with WASM Fallback
 * @module @skillsmith/mcp-server/context.async
 * @see SMI-2207: Async database functions with WASM fallback
 * @see SMI-2741: Split from context.ts to meet 500-line standard
 *
 * Provides async context creation for cross-platform compatibility:
 * 1. Try better-sqlite3 native module first (fastest)
 * 2. Fall back to sql.js WASM if native is unavailable
 */
import type { ToolContext, ToolContextOptions } from './context.types.js';
/**
 * Create the shared tool context asynchronously with WASM fallback
 *
 * This is the recommended way to initialize context for cross-platform
 * compatibility. It will:
 * 1. Try better-sqlite3 native module first (fastest)
 * 2. Fall back to sql.js WASM if native is unavailable
 *
 * @param options - Configuration options
 * @returns Promise resolving to initialized tool context
 *
 * @see SMI-898: Path traversal protection
 * @see SMI-2207: Async initialization for WASM fallback
 *
 * @example
 * // Initialize with WASM fallback support
 * const context = await createToolContextAsync();
 *
 * @throws Error if dbPath contains path traversal attempt
 * @throws Error if no database driver is available
 */
export declare function createToolContextAsync(options?: ToolContextOptions): Promise<ToolContext>;
/**
 * Get or create the global async tool context
 *
 * Uses a separate singleton from the sync version to prevent caching issues
 * where the sync path might be triggered first and cached.
 *
 * @param options - Configuration options (only used on first call)
 * @returns Promise resolving to the global tool context
 */
export declare function getToolContextAsync(options?: ToolContextOptions): Promise<ToolContext>;
/**
 * Reset the async global context (for testing)
 */
export declare function resetAsyncToolContext(): Promise<void>;
//# sourceMappingURL=context.async.d.ts.map