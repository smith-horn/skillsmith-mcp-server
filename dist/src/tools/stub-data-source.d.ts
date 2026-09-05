/**
 * @fileoverview Shared stub/live data-source marking for MCP tool services
 * @module @skillsmith/mcp-server/tools/stub-data-source
 * @see SMI-6184: dataSource must reflect which service is actually wired in,
 * not merely whether Supabase env vars happen to be configured.
 *
 * rbac-tools, sso-tools, and integration-tools each report a
 * `dataSource: 'stub' | 'live'` field alongside their results. Before this
 * fix, that field was computed from `isSupabaseConfigured()` alone — which
 * reports `'live'` whenever Supabase env is present, even when the module
 * still has its in-memory stub service wired in (as rbac-tools and
 * sso-tools always do today; neither has a live implementation yet).
 *
 * This module tracks which service instances were produced by a stub
 * factory, so `dataSource` reflects the service actually in use instead.
 */
/**
 * Mark a service instance as a stub. Every `createStub*Service()` factory
 * should wrap its returned object with this before returning it.
 */
export declare function markAsStub<T extends object>(service: T): T;
/** True if `service` was produced by a stub factory (via {@link markAsStub}). */
export declare function isStubService(service: object): boolean;
/**
 * Compute the `dataSource` field for a tool result from the service
 * currently in use — `'stub'` if it was created by a stub factory,
 * `'live'` otherwise (including any future real implementation, which
 * simply never gets marked).
 */
export declare function dataSourceFor(service: object): 'stub' | 'live';
//# sourceMappingURL=stub-data-source.d.ts.map