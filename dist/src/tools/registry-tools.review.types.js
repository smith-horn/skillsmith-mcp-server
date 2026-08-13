/**
 * @fileoverview Types for the SMI-5949 review-gate service surface (`submissions`/`review`)
 * @module @skillsmith/mcp-server/tools/registry-tools.review.types
 * @see SMI-5949 D-5: the two `SECURITY DEFINER` RPCs
 * @see docs/internal/implementation/smi-5949-approval-gate.md
 *
 * A types-only companion (the `foo.types.ts` convention already used by
 * `registry-tools.content.types.ts`), split out so `registry-tools.ts` — 467/500 lines before
 * this step — does not absorb another interface's worth of JSDoc. `PrivateRegistryService`
 * (registry-tools.ts) extends {@link PrivateRegistryReviewService} rather than declaring these
 * two methods inline.
 */
export {};
//# sourceMappingURL=registry-tools.review.types.js.map