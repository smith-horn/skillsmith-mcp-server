/**
 * @fileoverview SMI-6343 Wave 1 — proof that the $HOME sandbox reaches THIS
 * config, and that a defaulted manifest path can no longer touch the real one.
 *
 * Why it lives here and not next to the other unit tests: the original fix
 * attempt put `setupFiles` only in the root `vitest.config.ts`, which does not
 * govern `packages/mcp-server/tests/integration/**`. That config is the ONLY
 * one that runs the two files that historically wrote `test-skill` /
 * `shutdown-persistence-fixture` rows into a real user's
 * ~/.skillsmith/manifest.json (see `packages/mcp-server/vitest.config.integration.ts`'s
 * own header for the timeline — those two files were already isolated by an
 * unrelated prior fix by the time this one landed), and it declared no
 * `setupFiles` at all — so a sandbox declared anywhere else would leave this
 * config's still-live defense-in-depth gap open.
 *
 * This file is therefore a config-topology regression test as much as a
 * behavioural one: if someone removes `...sharedTestConfig` from
 * vitest.config.integration.ts, or redeclares `setupFiles` locally (which
 * overrides rather than merges), these assertions fail immediately.
 *
 * Nothing here writes to the real home. The real manifest is only ever
 * stat()ed — existence, size and mtime — never read, never created.
 */
export {};
//# sourceMappingURL=home-sandbox.integration.test.d.ts.map