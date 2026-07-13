/**
 * Live subscription-tier resolution for the MCP license middleware.
 *
 * SMI-1953: The MCP server's license middleware historically only resolved a
 * tier from a signed enterprise license blob (`SKILLSMITH_LICENSE_KEY`). A
 * paying Individual/Team customer authenticating with a personal API key
 * (`SKILLSMITH_API_KEY`) but no enterprise key was therefore *always* reported
 * as community tier — the ~6-month silent-degradation bug this module fixes.
 *
 * These helpers are extracted from `license.ts` to keep that file under the
 * 500-line standard (mirrors the earlier `license.gate.ts` extraction). The
 * `getLicenseInfo()` branch that calls `resolveTierViaApiKey` still lives in
 * `license.ts`; only the resolution mechanics live here.
 *
 * @see docs/internal/implementation/smi-1953-mcp-tier-resolution.md
 */
import { type FeatureFlag } from './toolFeatureMapping.js';
import type { LicenseInfo, LicenseTier, LicenseMiddlewareContext } from './license.js';
/**
 * Build the full FLAT feature set granted by a live-resolved subscription tier.
 *
 * Individual/Team tiers are non-a-la-carte in the Skillsmith business model, so
 * a resolved tier grants EVERY feature whose required tier is at or below it:
 * a 'team' result includes all individual- AND team-tier features, but not
 * enterprise features; 'enterprise' includes everything; 'community' grants
 * nothing (empty array).
 *
 * This is deliberately "at or below", not exact-match. An exact-match set would
 * pass `checkFeature()`'s tier-level gate but then FAIL its subsequent
 * `license.features.includes(feature)` check — reproducing the very
 * `license_required` error SMI-1953 eliminates, just with a different-sounding
 * reason.
 *
 * @param tier - The resolved subscription tier.
 * @returns Every FeatureFlag entitled at or below `tier`.
 */
export declare function featuresForTier(tier: LicenseTier): FeatureFlag[];
/**
 * Create a tier resolver bound to a specific middleware context + cache TTL.
 *
 * The returned `resolveTierViaApiKey` NEVER throws — every path returns a
 * `LicenseInfo` (definitive tier, definitive community, stale-served-on-error,
 * or fresh-community-on-first-error) and writes the appropriate cache TTL.
 *
 * @param context - Shared middleware context (holds the cache).
 * @param cacheTtlMs - Full TTL for DEFINITIVE results.
 * @returns The `resolveTierViaApiKey(apiKey)` function.
 */
export declare function createTierResolver(context: LicenseMiddlewareContext, cacheTtlMs: number): (apiKey: string) => Promise<LicenseInfo>;
//# sourceMappingURL=license.tier.d.ts.map