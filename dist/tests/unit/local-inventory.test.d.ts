/**
 * Unit tests for SMI-4587 Wave 1 Step 2 — local-inventory scanner.
 * Covers all 4 sources (skills / commands / agents / CLAUDE.md) plus
 * fresh-install latency bound (P-ANTI-2 carryover) and CLAUDE.md
 * tolerance for malformed / missing files.
 *
 * SMI-6077: the skills source now scans EVERY supported client's native
 * directory (CLIENT_IDS), not just Claude Code — see the `client` field
 * coverage below, which uses Cursor as the representative non-Claude
 * client fixture (same choice `inventory-collector.test.ts` makes for its
 * own cross-harness coverage).
 */
export {};
//# sourceMappingURL=local-inventory.test.d.ts.map