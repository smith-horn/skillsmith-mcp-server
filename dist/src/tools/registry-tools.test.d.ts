/**
 * @fileoverview Tests for private registry MCP tools (stub-service path)
 * @see SMI-3902: Private Registry MCP Tools
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * These exercise the handlers against the in-memory stub, injected directly via
 * `setPrivateRegistryService()` (unaffected by SMI-6622's live-by-default module selection).
 * Live Supabase-backed behaviour (cross-team scoping, immutability, size cap) is in
 * registry-tools.live.test.ts; RLS policy structure is in
 * scripts/tests/private-registry-rls.test.ts.
 *
 * SMI-6622: `resolveTeamId()` now ALWAYS attempts real team resolution — it never returns a
 * placeholder id just because the STUB service was injected (the stub service and stub team id are
 * independent concerns, `registry-tools.ts`'s own `useRegistryStub()` doc comment). So this file
 * mocks `registry-tools.team.js` directly, same as every other registry-tools*.test.ts file that
 * drives the dispatcher without a real credential.
 */
export {};
//# sourceMappingURL=registry-tools.test.d.ts.map