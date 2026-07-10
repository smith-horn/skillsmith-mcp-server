/**
 * @fileoverview Shared license-key → team_id resolver
 * @module @skillsmith/mcp-server/tools/team-resolver
 * @see SMI-4292: Wave 5A — Team workspaces foundation (finding C3)
 *
 * Unified team resolution for MCP tools. Both team-workspace.ts and
 * registry-tools.ts call `resolveLicenseTeamId` so they share one auth
 * path (no split auth resolution).
 *
 * License key source, in order:
 *   1. explicit `licenseKey` argument (from `ToolContext` or tool input)
 *   2. `process.env.SKILLSMITH_LICENSE_KEY`
 *
 * Calls the `resolve_team_from_license` RPC (migration 071) using an
 * anon-key Supabase client (RPC is SECURITY DEFINER). Returns null if
 * the key is missing, invalid, expired, or not attached to a team.
 */
/**
 * Extract the license key from an optional explicit value or the environment.
 */
export declare function readLicenseKey(explicit?: string): string | null;
/**
 * Resolve a license key to a team_id via `resolve_team_from_license` RPC.
 *
 * @param licenseKey - optional explicit license key; falls back to env
 * @returns resolved team_id, or null if Supabase is not configured / key invalid
 */
export declare function resolveLicenseTeamId(licenseKey?: string): Promise<string | null>;
//# sourceMappingURL=team-resolver.d.ts.map