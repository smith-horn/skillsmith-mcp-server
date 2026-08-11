/**
 * @fileoverview SMI-5905 Wave 3 — `private_registry_manage(action:'install')` round-trip
 * @see docs/internal/implementation/private-registry-skill-install.md
 *
 * Two levels, deliberately:
 *
 * - **Dispatch**: through the real `executePrivateRegistryManage` handler, proving `install` is
 *   wired into the action switch and that its argument/not-found errors match the other actions'.
 * - **Round-trip**: through `executeRegistryInstall` directly, against the in-memory stub service
 *   (which now persists `content`) and a REAL `SkillInstallationService` writing into a temp
 *   directory — a genuine publish → install → on-disk cycle, not a mock handshake. The installer is
 *   injected only so the write lands in `os.tmpdir()`: `getInstallPath()` resolves from the real
 *   home directory at module load, so without that seam this test would write into the developer's
 *   own `~/.claude/skills`.
 *
 * The load-bearing assertion is the RESULT SHAPE one. `private_registry_manage`'s result is
 * rendered straight into the calling model's context and `content` can be 2 MB (ADR-129 Risks), so
 * it is asserted structurally — exact key sets on both the result and its `install` payload, plus
 * a scan of the serialized result for the published file bytes — rather than by grep alone
 * (Sol plan-review finding #10).
 */
export {};
//# sourceMappingURL=registry-tools.install-action.test.d.ts.map