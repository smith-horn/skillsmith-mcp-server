/**
 * @fileoverview SMI-5949 Wave 2 Step 5 (plan-review finding M7) — stub/live review-gate error
 * PARITY between the two `PrivateRegistryService` implementations.
 * @see docs/internal/implementation/smi-5949-approval-gate.md
 *
 * Split out of `registry-tools.cross-transport.test.ts` (SMI-5949 adversarial-review pass): that
 * file's own H-1 fix needed an `approve()` fixture helper that pushed it over the 500-line
 * audit:standards budget, and this block was already testing a genuinely different concern from
 * the rest of that file — it exercises `PrivateRegistryService.review()` DIRECTLY on a stub
 * instance and a live instance (fake-client-backed), bypassing the tool dispatcher entirely, to
 * prove stub/live REVIEW-GATE ERROR parity. That is unrelated to the sibling file's own subject
 * (install-round-trip parity between the MCP and CLI transports).
 *
 * The requirement (M7) is error TYPE and ORDER parity: both transports must fail at the SAME
 * conceptual D-5 check for the same scenario, not merely "both throw". Each case below asserts the
 * expected pattern matches AND that the other three documented failure patterns do NOT — proving
 * the right check fired, not an accidental one. This is a SERVICE-level parity proof, not a
 * message-format proof — `registry-tools.live.review-decision.test.ts` already owns verbatim
 * passthrough of whatever the live RPC returns, and deliberately does NOT need its own fixture
 * text to match the real migration wording, since it tests generic passthrough behavior, not
 * fidelity to the RPC's actual text.
 *
 * @see SMI-5949 adversarial-review finding M-4: two of the four live-side fixture messages below
 * (`notAdmin`, `terminal`) were previously HAND-WRITTEN PARAPHRASES that did not match what
 * `review_private_registry_submission()` actually raises — verified directly against
 * `supabase/migrations/20260809000000_private_registry_approval_gate.sql` (the `notAdmin` RAISE
 * EXCEPTION at lines 539-543, the `terminal` one at lines 567-570) — despite the `liveRpcError()`
 * doc comment below claiming the fixture was "driven by the exact shape the RPC itself returns,
 * not a hand-rolled approximation". Both are now the migration's VERBATIM text (with its `%`
 * placeholder substituted for this file's own `REVIEW_TEAM`/row-status values); `selfApproval` and
 * `missingPublisher` already matched and are unchanged. `PARITY_PATTERNS.notAdmin` and `.terminal`
 * are updated to match, since the old regexes (`/not an admin|admins can/i` and `/already been
 * (approved|rejected)/i`) did not match the corrected verbatim live text either.
 */
export {};
//# sourceMappingURL=registry-tools.review-parity.test.d.ts.map