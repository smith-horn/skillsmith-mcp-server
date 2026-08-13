/**
 * @fileoverview Live-mode tests for `private_registry_manage(action:'submissions'|'approve'|
 *   'reject')` — the SMI-5949 D-5 review-gate actions
 * @see docs/internal/implementation/smi-5949-approval-gate.md
 *
 * Exercises the live Supabase-backed service via `executePrivateRegistryManage` (the full tool
 * dispatch, mirroring `registry-tools.live.manage.test.ts`'s shape), using the shared fake-client
 * fixtures (`registry-tools.live.test-helpers.ts`), extended in this Wave to also script
 * `review_private_registry_submission` responses.
 *
 * RPC-error-shaped scenarios (self-approval, non-admin, terminal-state, missing `published_by`)
 * and audit-row assertions live in the sibling `registry-tools.live.review-decision.test.ts` —
 * split from this file to stay comfortably under the 500-line audit:standards gate. This file
 * covers: success paths for all three actions, required-field validation, the `submissions`
 * action's filtering/message shape, and the plan-review C1/H6 message-content requirements.
 */
export {};
//# sourceMappingURL=registry-tools.review-action.test.d.ts.map