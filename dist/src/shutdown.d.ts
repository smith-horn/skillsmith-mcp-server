/**
 * @fileoverview Flush-on-shutdown wiring for the Skillsmith MCP server (SMI-5479).
 * @module @skillsmith/mcp-server/shutdown
 *
 * Extracted from `index.ts`'s `main()` into its own module for two reasons:
 * 1. `index.ts` has `main().catch(console.error)` at module scope — importing
 *    it (even for a unit test of an unrelated export) runs the ENTIRE server
 *    bootstrap (DB init, stdio transport connect). This module has no
 *    top-level side effects, so it can be imported and unit-tested directly.
 * 2. Keeps `index.ts` under the `audit:standards` 500-LOC file-size gate.
 *
 * Before this (pass-2 of the plan review), nothing ever called
 * `shutdownPostHog()` — the PostHog client buffers events (10s
 * `flushInterval`, `posthog.ts:95`), so a server that exits before that
 * window elapses loses every buffered `skill_invoke` event: an unsigned bias
 * on the mediation-gate metric (systematically undercounts short sessions)
 * and a smoke run that calls one tool and exits loses the event 100% of the
 * time.
 */
import type { DatabaseType } from '@skillsmith/core';
/** Bound on how long a shutdown flush may block process exit. */
export declare const TELEMETRY_SHUTDOWN_FLUSH_TIMEOUT_MS = 2000;
/**
 * Attempt to flush + shut down the PostHog client, bounded by `timeoutMs`
 * (`Promise.race` against a plain timer) so a hung PostHog client can never
 * block process exit. Fail-soft — mirrors `shutdownPostHog`'s own internal
 * try/catch; a flush error must never propagate.
 *
 * Idempotent within a process: a second call while a flush is already in
 * flight (or has completed) is a no-op, so wiring this to multiple shutdown
 * triggers (transport close, SIGTERM, SIGINT) can never double-flush or race.
 */
export declare function flushTelemetryOnShutdown(timeoutMs?: number): Promise<void>;
/**
 * Test-only reset of the module-level shutdown guard. Not exported from the
 * package index.
 */
export declare function _resetShutdownGuardForTests(): void;
/**
 * Fail-soft, synchronous close of the tool-context database on shutdown.
 *
 * On the WASM (`sql.js`) driver, `close()` is the only thing that ever
 * persists the in-memory database to disk (`sqljsDriver.ts`'s `close()` →
 * `persist()` → `writeFileSync`) — see SMI-5639. Before this, nothing in the
 * shutdown path ever called `close()`, so every write made during a session
 * was silently discarded on normal exit.
 *
 * Never throws — a `getDb()` that itself throws, or a `close()` that
 * throws, is caught and logged via `logger.error` (NOT `.debug`/`.info`,
 * which are disk-only per SMI-5615 — a failed persist is a genuine
 * data-loss event and must be visible on stderr, not silently swallowed the
 * same way the original bug was invisible).
 *
 * Idempotent by construction: `db.open` reflects the driver's real closed
 * state (both `SqlJsDatabaseAdapter` and `BetterSqlite3Database` expose a
 * reliable `open` getter), so calling this twice — e.g. `transport.onclose`
 * racing a signal — only calls `.close()` once. No separate module-level
 * guard flag is needed.
 *
 * @param getDb - Lazy getter for the current db (late-bound, so it can read
 *   a `toolContext` that isn't assigned yet at trigger-creation time).
 */
export declare function closeDbOnShutdown(getDb?: () => DatabaseType | undefined): void;
/**
 * Build a shutdown trigger: close the tool-context database (via
 * {@link closeDbOnShutdown}, synchronously, so WASM-driver persistence isn't
 * gated behind the telemetry flush's timeout), then run
 * {@link flushTelemetryOnShutdown}, then call `onDone` (index.ts passes
 * `() => process.exit(0)`). Registering ANY listener for SIGTERM/SIGINT
 * overrides Node's default terminate-on-signal behavior, so `index.ts` MUST
 * call this for each of transport `onclose` / SIGTERM / SIGINT to preserve
 * today's default (process exits promptly on those signals) rather than
 * leaving the process hanging once a listener is registered.
 *
 * @param getDb - Optional lazy getter for the current db, so shutdown can
 *   close/persist it before the process exits (SMI-5639).
 */
export declare function createShutdownTrigger(onDone: () => void, getDb?: () => DatabaseType | undefined): () => void;
//# sourceMappingURL=shutdown.d.ts.map