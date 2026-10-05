/**
 * The troubleshooting text for a database-init failure, or `null` when the
 * error already carries its own remedy and generic advice would mislead.
 *
 * Returns `null` for a corruption refusal. The refusal names the exact files
 * and commands, and no driver choice changes a damaged file — so there is
 * nothing to add, and the one thing the generic block would add is wrong.
 *
 * Discriminates on `code` via `isCorruptDatabaseError`, never on the message
 * and never on `instanceof`: the CLI and the MCP server can resolve separate
 * copies of `@skillsmith/core`, which breaks an identity check.
 */
export declare function troubleshootingFor(error: unknown): string | null;
/**
 * The full stderr block for a database-init failure.
 *
 * Kept beside the decision because the null case is easy to mishandle: a caller
 * that interpolated the result straight into a template would render the
 * literal string "null" as advice. Co-location makes that less likely, not
 * impossible — `troubleshootingFor` is exported for its own tests, and
 * TypeScript does not reject interpolating a nullable string. The test forbids
 * it for THIS function; a new caller needs its own arm (SMI-6991).
 */
export declare function formatDbInitFailure(errorDetail: string, error: unknown): string;
//# sourceMappingURL=db-init-troubleshooting.d.ts.map