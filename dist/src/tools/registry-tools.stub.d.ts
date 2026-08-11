/**
 * @fileoverview In-memory stub for the private registry MCP tools
 * @module @skillsmith/mcp-server/tools/registry-tools.stub
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 * @see SMI-5905 Wave 3: the stub now persists `content`, so a publish→install round-trip is
 *      testable without live Supabase
 *
 * Local-dev / test fallback used when Supabase is NOT configured. The real, Postgres-backed
 * implementation lives in registry-tools.live.ts and is selected automatically once SUPABASE_URL +
 * SUPABASE_ANON_KEY are present.
 *
 * WHAT THIS STUB DOES NOT DO, and must never be read as evidence about:
 *   - **Entitlement.** `getContent()` here has no Enterprise/subscription check at all. That gate
 *     is a live-service concern (registry-tools.live.content.ts) because it is a query against
 *     `teams`/`subscriptions`, which the stub has no analogue of. A test that passes against this
 *     stub proves nothing about entitlement; those tests drive the live service instead.
 *   - **Version immutability.** The real table's UNIQUE(team_id, skill_id, version) is what
 *     enforces that; re-publishing the same triple here just overwrites.
 *   - **RLS / cross-team isolation.** Approximated only: entries are keyed by (teamId, skillId) so
 *     list/get/deprecate/getContent never cross a team boundary, but there is no policy engine
 *     behind it.
 */
import type { PrivateRegistryService } from './registry-tools.js';
/** @internal Exported for testing */
export declare function createStubRegistryService(): PrivateRegistryService;
//# sourceMappingURL=registry-tools.stub.d.ts.map