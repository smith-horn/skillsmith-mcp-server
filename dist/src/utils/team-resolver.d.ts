/**
 * @fileoverview Resolve team_id from license key via Supabase join chain
 * @module @skillsmith/mcp-server/utils/team-resolver
 * @see SMI-3914: Wave 0 Shared Infrastructure
 *
 * Join chain: license_keys -> subscriptions -> teams
 * LRU cache: max 100 entries, 60s TTL
 */
/**
 * Resolve a team ID from a license key via Supabase.
 * Results are cached with a 60-second TTL and LRU eviction at 100 entries.
 *
 * @param licenseKey - The license key to resolve
 * @returns The team ID associated with the license key
 * @throws Error if the team cannot be resolved
 */
export declare function resolveTeamId(licenseKey: string): Promise<string>;
/** Clear the team resolver cache (for testing) */
export declare function clearTeamResolverCache(): void;
//# sourceMappingURL=team-resolver.d.ts.map