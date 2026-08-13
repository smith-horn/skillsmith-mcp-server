/**
 * @fileoverview `review_private_registry_submission` RPC-error passthrough + audit-row tests
 *   (SMI-5949 Wave 2 Step 4, D-5/D-6/D-8/D-9)
 * @see docs/internal/implementation/smi-5949-approval-gate.md
 *
 * Split from the sibling `registry-tools.review-action.test.ts` (which covers success paths and
 * message-content requirements) to stay comfortably under the 500-line audit:standards gate. This
 * file covers the four documented D-5 failure paths — non-admin (`42501`), self-approval,
 * already-decided/terminal-state, and missing `published_by` (`23514`, the old-client case) — and
 * proves each RPC error message reaches the MCP caller VERBATIM (plan-review finding M10), plus
 * the audit rows both `approve`/`reject` write on success and on denial.
 *
 * Every scenario here is scripted purely at the fake-client/RPC-response level: this file does NOT
 * re-verify the RPC's own SQL logic (that is Wave 1's migration smoke suite + staging harness,
 * per the plan's P-4 Smoke-vs-CI rule) — it verifies that whatever message the RPC returns is
 * exactly what a caller of `private_registry_manage` sees, with no remapping in between.
 */
export {};
//# sourceMappingURL=registry-tools.live.review-decision.test.d.ts.map