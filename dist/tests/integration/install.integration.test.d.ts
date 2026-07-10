/**
 * SMI-616: Install Skill Tool Integration Tests
 * Tests the install_skill tool with mocked GitHub and real filesystem.
 *
 * SMI-5263: split into three concern-scoped siblings to stay under the 500-line gate:
 *  - this file       — filesystem / manifest / fetch-mocking primitives (no module mocks)
 *  - install.parsing.integration.test.ts   — pure parseRepoUrl / parseSkillId logic
 *  - install.execution.integration.test.ts — real installSkill() flow + trust-tier (module mocks)
 */
export {};
//# sourceMappingURL=install.integration.test.d.ts.map