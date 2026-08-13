/**
 * @fileoverview In-memory stub for the private registry MCP tools
 * @module @skillsmith/mcp-server/tools/registry-tools.stub
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 * @see SMI-5905 Wave 3: the stub now persists `content`, so a publish→install round-trip is
 *      testable without live Supabase
 * @see SMI-5949 Wave 2 Step 5: the approval-gate state machine (D-5/D-6/D-7/D-8) is now modeled
 *      in memory, replicating the two RPCs' behavior — see `setActor()` below.
 * @see SMI-5949 Wave 3: `deprecated` read-filter closure — `list()`/`get()`/`getContent()` now
 *      also exclude deprecated rows, matching the live service's own D-4-adjacent predicate. Kept
 *      in parity deliberately: `registry-tools.cross-transport.test.ts` already treats
 *      "a deprecated skill still installs" as a cross-transport invariant driven through this
 *      stub, so leaving the stub unfiltered would make that test silently assert behavior the two
 *      live transports (registry-tools.live.content.ts, the Edge Function) no longer have.
 *
 * Local-dev / test fallback used when Supabase is NOT configured. The real, Postgres-backed
 * implementation lives in registry-tools.live.ts and is selected automatically once SUPABASE_URL +
 * SUPABASE_ANON_KEY are present (see `registry-tools.ts`'s `isSupabaseConfigured()` branch).
 *
 * WHAT THIS STUB DOES NOT DO, and must never be read as evidence about:
 *   - **Entitlement.** `getContent()` here has no Enterprise/subscription check at all. That gate
 *     is a live-service concern (registry-tools.live.content.ts) because it is a query against
 *     `teams`/`subscriptions`, which the stub has no analogue of. A test that passes against this
 *     stub proves nothing about entitlement; those tests drive the live service instead.
 *   - **Version immutability.** The real table's UNIQUE(team_id, skill_id, version) is what
 *     enforces that; re-publishing the same triple here just overwrites.
 *   - **RLS / cross-team isolation.** Approximated only: entries are keyed by (teamId, skillId) so
 *     list/get/deprecate/getContent never cross a team boundary, but there is no policy engine
 *     behind it.
 *   - **SMI-5949 approval-gate state machine — now modeled (Wave 2 Step 5).** `publish()` lands
 *     every row `approvalStatus:'pending'`, `approvalMode:'review'`, matching D-7's unconditional
 *     gate (nothing here auto-approves). `list()`/`get()` only ever return `'approved'` rows,
 *     matching D-4 surfaces 3/4's `.eq('approval_status','approved')` predicate. `submissions()`/
 *     `review()` replicate `get_private_registry_submissions()`'s visibility rule and
 *     `review_private_registry_submission()`'s D-5 check order EXACTLY: decision value -> caller
 *     identity present -> admin-membership -> row-exists -> terminal-state -> `published_by`
 *     non-null -> self-approval (D-6/D-8). `setActor()` (below, NOT part of `PrivateRegistryService`
 *     — a stub-only test seam) simulates `auth.uid()` + team-admin membership, since the stub has
 *     no real JWT or RLS to derive either from.
 *
 *     What is STILL not modeled, and cannot be without a real Postgres behind it:
 *     - **RLS-based pending invisibility.** A real pending row has NO PostgREST read path at all —
 *       not even a query that tries; the policy itself is the enforcement. This stub only
 *       APPROXIMATES that with an application-level `approvalStatus === 'approved'` filter inside
 *       `list()`/`get()`/`getContent()`/`submissions()` (the `getContent()` filter was ITSELF a
 *       missing-filter bug until an adversarial security review caught it, finding H-1: a pending
 *       row's CONTENT installed successfully even though its metadata was already correctly
 *       gated — the exact omission this paragraph warns a "future new stub method" could make,
 *       except it was an existing one) — a filter a future new stub method could still simply omit, in
 *       exactly the shape `deprecated`'s unenforced read filter already demonstrates (Context §
 *       "precedent warning" in the plan doc). A real policy cannot be forgotten at a new call site;
 *       this filter can, and there is no compiler or test that would catch a stub-only omission of
 *       it the way the live RLS policy is proven by the Wave 1 migration smoke suite + staging
 *       harness (P-4).
 *     - **D-7's BEFORE INSERT trigger.** `publish()` never rejects a null-identity `setActor()`
 *       actor — a real post-migration INSERT with NULL `published_by` is hard-rejected `23514` at
 *       write time, so in live Postgres no NEW row can ever reach review with a null submitter
 *       (D-5 step 6 is pure defense-in-depth there). This stub deliberately does NOT replicate that
 *       trigger in `publish()` — doing so would make step 6 unexercisable in a stub-only test, and
 *       the trigger itself is proven by the Wave 1 smoke suite's `a5`, not by this file.
 *     - **Per-version approval state.** `registry` (this file's metadata map) has always held one
 *       row per `(teamId, skillId)` — the most recently published version's metadata — regardless
 *       of how many versions exist (a pre-existing simplification, not introduced by Step 5;
 *       `versions`, the separate content map, stays correctly per-version). Publishing a second
 *       version of an already-pending skill overwrites the first version's approval state rather
 *       than tracking each version independently.
 *     - **Multi-admin/multi-member team shape.** One simulated actor per stub instance, not a
 *       roster — there is no "this team has exactly one admin, who is also the submitter" concept
 *       to check the D-9 single-admin-deadlock scenario against.
 */
import type { PrivateRegistryService } from './registry-tools.js';
/** The simulated caller identity `setActor()` sets — the stub's substitute for a real `auth.uid()`
 *  plus `user_admin_team_ids()` membership, since there is no JWT or RLS behind this stub. */
export interface StubActor {
    /** Simulated `auth.uid()`. `null` simulates "no signed-in user" (D-5 step 2) — used both to
     *  exercise that check directly on `review()`, and, if set before `publish()`, to construct a
     *  row with a null `published_by` for D-5 step 6 (see this file's header on why `publish()`
     *  itself does not reject that, unlike the real D-7 trigger). */
    id: string | null;
    /** Simulated `user_admin_team_ids()` membership (`role IN ('admin','owner')`) — D-5 step 3. */
    isAdmin: boolean;
}
/**
 * `PrivateRegistryService` plus the stub-only `setActor()` identity seam. NOT part of the shared
 * interface — `registry-tools.ts` still types its module-level singleton as plain
 * `PrivateRegistryService`, so production code and every non-identity-aware test are unaffected.
 */
export interface StubRegistryService extends PrivateRegistryService {
    /**
     * Sets the identity behind every subsequent `publish()`/`review()`/`submissions()` call on this
     * stub instance, until changed again — mirrors a real session, where `skillsmith login` picks
     * one identity for every call that session makes. Defaults to a non-null, admin actor (see
     * `DEFAULT_ACTOR` below), so a fresh stub's `publish()` alone behaves as it always has; a test
     * exercising the review gate itself must call this explicitly before `review()`/`submissions()`,
     * same as the real smoke matrix requires a distinct admin login to approve someone else's
     * submission (D-6 blocks a reviewer approving their own).
     */
    setActor(actor: StubActor): void;
}
/** @internal Exported for testing */
export declare function createStubRegistryService(): StubRegistryService;
//# sourceMappingURL=registry-tools.stub.d.ts.map