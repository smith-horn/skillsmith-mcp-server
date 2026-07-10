/**
 * Unit tests for SMI-4588 Wave 2 Step 2 — `generateSuggestionChain`.
 * PR #2 of the Wave 2 stack.
 *
 * Coverage (decision #11 — 3-tier fall-through):
 *   1. Tier 1 wins when `${author}-${token}` is collision-free.
 *   2. Tier 2 wins when tier 1 collides; packDomain segment included.
 *   3. Tier 3 wins when tiers 1 and 2 both collide; shortHash suffix added.
 *   4. All tiers exhaust → `exhausted: true` and full chain returned.
 *   5. `packDomain` absent → tier 2 skipped (deduped against tier 3).
 *   6. `shortHash` is deterministic — same input produces same output.
 *   7. Pre-candidate inventory contract — candidate skill must NOT be in
 *      the inventory (Edit 7).
 *   8. No author + no tag fallback → `local-` prefix (plan §1 path 3).
 */
export {};
//# sourceMappingURL=suggestion-chain.test.d.ts.map