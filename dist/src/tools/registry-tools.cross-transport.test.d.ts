/**
 * @fileoverview SMI-5905 Wave 5 — cross-transport round-trip: the FULL assembled path.
 * @see docs/internal/implementation/private-registry-skill-install.md (Wave 5)
 *
 * Plan review finding #9 moved every per-risk adversarial test (path traversal, cross-team,
 * downgraded-target-team, degraded-auth) into the wave that introduces the risk — Waves 1-3 ship
 * those already:
 *   - `packages/core/tests/unit/services/skill-installation.content.test.ts` (path-safety, Wave 1)
 *   - `supabase/functions/private-registry-get/index.test.ts` + `index.entitlement.test.ts` (auth,
 *     entitlement, 404/403 non-leak, `Cache-Control: no-store`, audit rows — Wave 2)
 *   - `registry-tools.live.content.test.ts` / `.adversarial-content.test.ts` /
 *     `.admin-auth.test.ts` / `.malformed-input.test.ts` (entitlement, client-getter split, audit
 *     rows — Wave 3)
 *   - `registry-tools.install-action.test.ts` (a genuine MCP publish(stub)->install->on-disk round
 *     trip, structural no-content-leak on `PrivateRegistryManageResult`, version selection — Wave 3)
 *   - `packages/cli/src/commands/registry-install.action*.test.ts` (command wiring, --client
 *     targeting, Edge Function error-code mapping, console-output non-leak — Wave 4, but with
 *     `getPrivateRegistrySkillContent()` and `installFromContent()` both mocked out)
 *
 * What none of the above cover, and what this file adds: the CLI transport exercised with its own
 * two REAL production functions wired together — `getPrivateRegistrySkillContent()`
 * (`client.private-registry.ts`, only `global.fetch` mocked, shaped exactly like the Wave 2 Edge
 * Function's documented response contract) feeding a REAL `SkillInstallationService.
 * installFromContent()` writing to a real temp directory — and then compared directly against the
 * MCP transport's own already-proven real round trip (`executeRegistryInstall`), against the SAME
 * underlying published data, to prove the two transports never disagree about which version "no
 * version specified" resolves to, or about what actually lands on disk.
 *
 * @see SMI-5949 adversarial-review finding H-1: every fixture below now APPROVES a publish before
 * asserting a successful install — before this fix, every test in this file published a skill and
 * installed it while it was still `pending`, which meant this file was asserting "a pending,
 * unapproved private-registry version installs successfully" as a PASSING invariant, the exact
 * inverse of what the approval gate exists to enforce. A dedicated negative test below now also
 * asserts the opposite: publish, do NOT approve, and confirm install fails on BOTH transports.
 * `registry-tools.review-parity.test.ts` was split out of this file at the same time (the
 * `approve()` helper this fix needed pushed the file over the 500-line audit:standards budget) —
 * it covers a different concern (stub/live REVIEW-GATE ERROR parity, M7) and is unrelated to the
 * install-round-trip parity this file still owns.
 */
export {};
//# sourceMappingURL=registry-tools.cross-transport.test.d.ts.map