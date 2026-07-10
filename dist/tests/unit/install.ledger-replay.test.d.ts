/**
 * Unit tests for SMI-4588 Wave 2 Step 6 — install ledger-replay rewriter.
 * PR #3 of the Wave 2 stack.
 *
 * Coverage:
 *   1. Empty ledger → candidate returned unchanged (reference-equal).
 *   2. No matching ledger entry → candidate returned unchanged.
 *   3. Single matching entry → candidate identifier + path rewritten.
 *   4. Multi-pass replay (chained renames) — applies until no more matches.
 */
export {};
//# sourceMappingURL=install.ledger-replay.test.d.ts.map