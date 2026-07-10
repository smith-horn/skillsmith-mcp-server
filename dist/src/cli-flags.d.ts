/**
 * SMI-4805: startup CLI-flag handling for the MCP server.
 *
 * `@skillsmith/mcp-server` is a stdio-driven MCP server — when invoked directly
 * (`npx -y -p @skillsmith/mcp-server skillsmith-mcp --version`) the MCP SDK otherwise swallows
 * argv and the process starts the server instead of printing the version.
 *
 * `resolveStartupFlag` is a pure function so it can be unit-tested without
 * importing `index.ts` (whose module body calls `main()` on load).
 */
/**
 * Resolve a recognized startup flag to the text that should be printed.
 *
 * @param argv - Arguments after `node script` (i.e. `process.argv.slice(2)`).
 * @param version - The package version, printed for `--version` / `-v`.
 * @returns The text to print before exiting, or `null` when no recognized
 *   startup flag is present and the server should start normally.
 */
export declare function resolveStartupFlag(argv: string[], version: string): string | null;
//# sourceMappingURL=cli-flags.d.ts.map