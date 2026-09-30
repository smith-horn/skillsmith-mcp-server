/**
 * @fileoverview Tests for private_registry_manage's submissions/approve/reject actions
 * (stub-service path) -- split out of registry-tools.test.ts (SMI-5949 Wave 3) to stay under
 * the 500-line pre-commit file-length gate.
 * @see SMI-5949: Approval Gate -- Submitter/Approver Role Split for `private_registry_publish`
 *
 * These exercise the handlers against the in-memory stub, injected directly via
 * `setPrivateRegistryService()`. Live Supabase-backed behaviour is in
 * registry-tools.live.review-decision.test.ts.
 *
 * SMI-6622: `resolveTeamId()` now always attempts real team resolution regardless of which
 * service is injected, so this file mocks `registry-tools.team.js` directly — same as every other
 * registry-tools*.test.ts file that drives the dispatcher without a real credential.
 */
export {};
//# sourceMappingURL=registry-tools.submissions.test.d.ts.map