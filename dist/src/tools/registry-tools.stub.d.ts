/**
 * @fileoverview In-memory stub for the private registry MCP tools
 * @module @skillsmith/mcp-server/tools/registry-tools.stub
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * Local-dev / test fallback used when Supabase is NOT configured. The real,
 * Postgres-backed implementation lives in registry-tools.live.ts and is selected
 * automatically once SUPABASE_URL + SUPABASE_ANON_KEY are present.
 *
 * NOTE: this stub does not persist file bytes and does NOT enforce version
 * immutability — those are guarantees of the real table (UNIQUE(team_id, skill_id,
 * version)) surfaced by the live service. Entries are keyed by (teamId, skillId) so
 * the stub is at least tenant-scoped (list/get/deprecate never cross a team boundary).
 */
import type { PrivateRegistryService } from './registry-tools.js';
/** @internal Exported for testing */
export declare function createStubRegistryService(): PrivateRegistryService;
//# sourceMappingURL=registry-tools.stub.d.ts.map