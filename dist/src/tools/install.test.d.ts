/**
 * @fileoverview Unit tests for install_skill MCP tool Zod boundary guard
 * @see SMI-4288: Zod validation guard at MCP tool boundary
 * @see https://github.com/smith-horn/skillsmith/issues/599
 *
 * These tests cover the behaviour introduced by the signature change from
 * `installSkill(input: InstallInput, ...)` to `installSkill(input: unknown, ...)`.
 * The guard protects against malformed MCP payloads (e.g. `{}`,
 * `{ skillId: 123 }`, invalid enum) reaching the core installation service.
 *
 * The happy path mocks `@skillsmith/core` so no real filesystem or network
 * work happens — this file is a unit test for the tool-boundary validation
 * shim, not an integration test for the install flow itself (that lives
 * in `tests/integration/install.integration.test.ts`).
 */
export {};
//# sourceMappingURL=install.test.d.ts.map