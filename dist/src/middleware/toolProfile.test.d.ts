/**
 * @fileoverview Tests for the curated agent tool profile — SMI-5456 Wave 1 Step 2
 *
 * `index.ts` cannot be imported directly in tests (it invokes `main()` at
 * module scope, which starts the real stdio server), so these tests exercise
 * `filterToolsForAgentProfile` / `isAgentToolProfileActive` against a fixture
 * that mirrors today's real `toolDefinitions` registrations in `index.ts`.
 *
 * Names below were verified against actual `tools/*.ts` registrations on
 * 2026-07-01 via:
 *   grep -rhoE "name: '[a-z_]+'" packages/mcp-server/src/tools/ \
 *     --include='*.ts' | grep -v test | sort -u
 */
export {};
//# sourceMappingURL=toolProfile.test.d.ts.map