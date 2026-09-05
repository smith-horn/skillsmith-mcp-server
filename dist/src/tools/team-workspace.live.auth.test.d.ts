/**
 * @fileoverview `team-workspace.live.auth.ts` direct unit coverage
 * @see SMI-6113 + SMI-6241: the two named user-client getters this file exercises directly.
 *
 * `team-workspace.live.test.ts` exercises these getters only through the happy path and the
 * no-signed-in-user branch reached via `team-workspace.live.ts`'s call sites. This file mirrors
 * `registry-tools.live.auth.test.ts`'s direct-coverage approach: it calls
 * `getWorkspaceManageUserClient`/`getWorkspaceMemberUserClient` straight, without the full
 * `createLiveService` call surface, so `bindUserClient`'s catch branch (client-creation failure)
 * is exercised even if no `team-workspace.live.ts` call site ever hits it.
 */
export {};
//# sourceMappingURL=team-workspace.live.auth.test.d.ts.map