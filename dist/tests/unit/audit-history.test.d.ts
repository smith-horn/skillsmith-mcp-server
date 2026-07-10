/**
 * Unit tests for SMI-4587 Wave 1 Step 3 — audit history persistence.
 * Covers ULID format, atomic write, round-trip, mkdir-on-first-run
 * (E-MISS-2), and the `claude_md_rule` collisionId special case (E-CONF-1).
 *
 * The CLAUDE.md scan caveat report-section test (D-ANTI-1) and the
 * `audit_mode: 'off'` skip-write test (P-ANTI-1) live in subsequent PRs
 * since they depend on the report-writer / audit-mode resolver.
 */
export {};
//# sourceMappingURL=audit-history.test.d.ts.map