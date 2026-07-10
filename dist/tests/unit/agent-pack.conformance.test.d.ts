/**
 * SMI-5456 Wave 1 — Conformance suite for committed agent-pack artifacts.
 *
 * Validates that the committed artifacts in `src/assets/agent-pack/` pass
 * the repo's own skill_validate logic, have well-formed frontmatter/TOML,
 * and use consistent identifiers across all shims and hooks.
 *
 * Scope: committed SKILL.md, shims (claude/copilot/opencode), codex TOML,
 * and hook scripts (claude-code, cursor, codex × session-start/end).
 *
 * This is an ADDITIVE suite — it does NOT duplicate the generator or
 * drift-gate tests in agent-pack.assets.test.ts or agent-pack.test.ts.
 */
export {};
//# sourceMappingURL=agent-pack.conformance.test.d.ts.map