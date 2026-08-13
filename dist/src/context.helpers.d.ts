/**
 * @fileoverview Tool Context Helper Utilities
 * @module @skillsmith/mcp-server/context.helpers
 * @see SMI-898: Path traversal protection for DB_PATH
 * @see SMI-2741: Split from context.ts to meet 500-line standard
 *
 * Shared helpers used by both sync and async context creation.
 */
/**
 * Get the default database path
 * Respects SKILLSMITH_DB_PATH environment variable
 *
 * @see SMI-898: Path traversal protection
 * - Validates SKILLSMITH_DB_PATH against path traversal attacks
 * - Rejects paths with ".." traversal sequences
 * - Ensures path is within allowed directories
 *
 * @throws Error if SKILLSMITH_DB_PATH contains path traversal attempt
 */
export declare function getDefaultDbPath(): string;
/**
 * Build the exact startup stderr message `index.ts` logs once the tool
 * context is ready (SMI-5981). Extracted so it can be unit-tested directly —
 * `index.ts` itself can't be imported in tests (it calls `main()` at module
 * scope), so without this extraction a test can only assert on
 * {@link getDefaultDbPath} in isolation, which stays green even if the log
 * line in `index.ts` is reverted to interpolating the raw, unvalidated
 * `SKILLSMITH_DB_PATH` env value again (code-review finding — the earlier
 * test suite didn't actually cover the regression it was named for).
 */
export declare function buildDbInitializedLogMessage(): string;
/**
 * Ensure the database directory exists
 */
export declare function ensureDbDirectory(dbPath: string): void;
//# sourceMappingURL=context.helpers.d.ts.map