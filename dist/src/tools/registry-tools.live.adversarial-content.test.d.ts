/**
 * @fileoverview Adversarial `content` payload tests for the live Supabase-backed
 * PrivateRegistryService's app-layer content validation (registry-tools.live.ts's
 * prepareContent()).
 * @see SMI-5882 — red-team pass on the private registry
 * @see docs/internal/implementation/smi-5882-redteam-private-registry-privacy-assessment.md
 *   Wave 2 Step 3 ("Adversarial `content` payloads (#7)")
 *
 * Sibling to registry-tools.live.test.ts / registry-tools.live.malformed-input.test.ts, split
 * out to keep those files under CLAUDE.md's <500-line guidance rather than growing either
 * further.
 *
 * **Why this calls `createLiveRegistryService().publish()` directly**, bypassing the Zod
 * schema at the tool layer (`registry-tools.ts`'s `skillContentSchema =
 * z.record(z.string(), z.string())`) — same technique as the malformed-input sibling file.
 * Several payloads below (content as an array, as a bare string, `SKILL.md` as a number) would
 * never survive Zod validation on the real MCP tool path, so routing through
 * `executePrivateRegistryPublish` would only prove Zod rejects them, not that `prepareContent()`
 * — the layer this suite targets — does. That distinction matters because the plan's What
 * Changes §11 finding is that the authenticated direct-PostgREST INSERT path bypasses Zod
 * *and* `prepareContent()` entirely; `prepareContent()` is the reference behavior any future
 * DB-boundary hardening (moving these invariants into a CHECK/trigger) would need to mirror.
 *
 * **Three things this file proves or documents** (plan doc Wave 2 Step 3):
 *   1. A highly-compressible payload sized to exceed the 2 MB RAW cap — compressible enough
 *      that a TOAST-compressed `pg_column_size` check (the DB's own backstop,
 *      `20260724000000:52-54`) would very likely pass it — is still rejected by
 *      `prepareContent()`'s raw `Buffer.byteLength` check, and rejected BEFORE any insert is
 *      attempted. This is an ordering/correctness proof of an *existing* guard, not a new one.
 *   2. Path-traversal-shaped content keys (`../../etc/passwd`, absolute paths, `..\` variants)
 *      are accepted as opaque JSONB map keys — not because path validation was overlooked, but
 *      because `registry-tools.live.ts` has no filesystem read/write/extraction code path at
 *      all (grep-verified below, at test time, not just read once at authoring time). This
 *      documents an ABSENCE of a vulnerability at this specific layer, per the plan's
 *      Sol-reviewed finding (What Changes §7) — it makes no claim about a future consumer that
 *      *does* extract this content to disk; per the plan doc's Wave 2 Step 3 results, no such
 *      consumer exists anywhere in this repo as of this writing.
 *   3. Missing/non-string `SKILL.md`, and `content` as an array/scalar instead of an object,
 *      are all rejected — regression-proofing `prepareContent()`'s existing behavior
 *      (registry-tools.live.test.ts already covers two of these cases; this file enumerates
 *      the fuller matrix the plan calls for).
 *
 * AIDefence prompt-injection/secret scanning of adversarial `SKILL.md` bodies (Wave 2 Step 3,
 * item 4) is a CLI-only, one-time scan (`ruflo@3.14.2 security defend -f <file> -o json`), not
 * a regression test — its output and the open policy question it raises are recorded in the
 * plan doc's Wave 2 Step 3 results, not here.
 */
export {};
//# sourceMappingURL=registry-tools.live.adversarial-content.test.d.ts.map