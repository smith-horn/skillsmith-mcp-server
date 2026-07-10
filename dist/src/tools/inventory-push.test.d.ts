/**
 * @fileoverview Unit tests for the `inventory_push` MCP tool (SMI-5392, umbrella SMI-5382).
 *
 * Strategy: mock `pushInventory` from `@skillsmith/core` via vi.hoisted + vi.mock,
 * defining the typed error classes INSIDE the hoisted factory so the subject module
 * and this test share the SAME class identities — `instanceof` checks in
 * `buildErrorMessage` resolve regardless of how @skillsmith/core is physically
 * resolved (importActual would yield a second core instance under a git worktree).
 */
export {};
//# sourceMappingURL=inventory-push.test.d.ts.map