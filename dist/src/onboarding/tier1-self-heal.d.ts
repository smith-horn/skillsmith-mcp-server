/**
 * SMI-5582: Tier-1 registry-skill auto-install + self-heal
 *
 * Background: first-run Tier-1 auto-install used to fail FAST at a broken
 * registry-ID lookup, so it never reached the real GitHub fetch chain. Two
 * consequences followed once the IDs were corrected:
 *
 *  1. `installSkill()` now performs real, potentially slow network I/O. It must
 *     NEVER run on the blocking startup path before `server.connect()` — hence
 *     the caller (`index.ts`) invokes {@link maybeInstallMissingTier1Skills}
 *     fire-and-forget, mirroring `checkForUpdates()`. The fetch itself is
 *     timeout-guarded in `@skillsmith/core`'s `fetchFromGitHub` (10s/request).
 *
 *  2. `markFirstRunComplete()` had already run unconditionally for the ~30
 *     users affected by the original broken IDs, so `isFirstRun()` is
 *     permanently false for them and a first-run-only retry would never fire.
 *     This module is therefore NOT gated on `isFirstRun()`: it runs on every
 *     startup and reconciles a small persisted state file
 *     (`~/.skillsmith/.tier1-status.json`) against the current
 *     {@link TIER1_SKILLS} list, retrying only the still-missing skills (and
 *     at most once per 24h). First run is just the degenerate case where the
 *     state file doesn't exist yet (`installed: []`, no `lastAttempt`).
 *
 * The one mechanism serves both paths — there is deliberately no separate
 * "first run" install loop.
 */
import type { ToolContext } from '../context.js';
/**
 * Persisted record of which Tier-1 registry skills have ever successfully
 * installed, plus when we last attempted. Same `homedir()`-based convention as
 * `FIRST_RUN_MARKER` in first-run.ts (both live under `SKILLSMITH_DIR`).
 */
export declare const TIER1_STATUS_FILE: string;
/**
 * Shape of `~/.skillsmith/.tier1-status.json`.
 */
export interface Tier1Status {
    /** Skill `name`s (matching {@link TIER1_SKILLS}) that have ever installed. */
    installed: string[];
    /** ISO timestamp of the most recent install attempt (any outcome). */
    lastAttempt?: string;
}
/**
 * SMI-5582: opt-out for the Tier-1 registry-install + self-heal path ONLY.
 * Matches this file's env-flag idiom (`=== '1'`, cf.
 * `SKILLSMITH_SKIP_SKILL_INSTALL` in index.ts). Bundled first-party assets
 * (`skillsmith`, `varlock`) are installed synchronously elsewhere and are NOT
 * gated by this — this flag only skips the network registry path.
 */
export declare function isTier1AutoInstallDisabled(): boolean;
/**
 * Read the persisted Tier-1 status. Returns an empty (never-attempted) status
 * when the file is absent OR unparseable — the empty status naturally folds
 * the "very first run" case into the same code path as a stale/corrupt file.
 */
export declare function readTier1Status(): Tier1Status;
/**
 * Persist the Tier-1 status. Best-effort: a write failure is logged to stderr
 * but never thrown — failing to record status must not crash the fire-and-
 * forget caller (it just means we retry next startup, subject to the throttle
 * which keys off the timestamp we failed to write).
 */
export declare function writeTier1Status(status: Tier1Status): void;
/**
 * Options for {@link maybeInstallMissingTier1Skills}.
 */
export interface Tier1InstallOptions {
    /**
     * First-party bundled skill names to credit (without attribution) in the
     * welcome message. On true first run the caller passes the freshly-installed
     * bundled names (`skillsmith`, `varlock`); on a self-heal pass it passes `[]`
     * (the message then lists only the registry skills, which is the relevant
     * "your previously-broken essentials are now installed" signal).
     */
    bundledSkills?: string[];
}
/**
 * Reconcile the persisted Tier-1 status against {@link TIER1_SKILLS} and
 * install any still-missing registry skills. Shared by the first-run and
 * every-startup self-heal paths (see the module doc). NEVER awaited on the
 * blocking startup path — call it fire-and-forget.
 *
 * On completion (only when at least one skill was attempted) it queues the
 * welcome/status message via `setPendingWelcome()`, so it surfaces on the next
 * successful tool call rather than on stderr (which MCP hosts hide).
 *
 * Contract: never throws — all install errors are caught per-skill and folded
 * into the `failures` list. Safe to `void` at the call site.
 */
export declare function maybeInstallMissingTier1Skills(toolContext: ToolContext, options?: Tier1InstallOptions): Promise<void>;
//# sourceMappingURL=tier1-self-heal.d.ts.map