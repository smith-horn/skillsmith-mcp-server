/**
 * @fileoverview Path-safety helpers for the local-inventory scanner.
 * @module @skillsmith/mcp-server/utils/local-inventory.path-safety.helpers
 *
 * Split out of `local-inventory.helpers.ts` (SMI-6229 follow-up) purely to
 * keep that file under the 500-line cap — no behavior change. These three
 * functions are the path-traversal/symlink-escape guards used by the
 * plugin-skill (Source 5, SMI-6228) and project-skill (Source 6, SMI-6240)
 * scan sources in `local-inventory.ts`.
 */
/**
 * Resolve absolute path joining `dir + filename`. Centralized so future
 * portability work (E-ANTI-1 v2) can swap in a relative-to-home derivation.
 */
export declare function joinPath(dir: string, filename: string): string;
/**
 * Rejects path separators, `.`/`..` segments, and empty strings — an
 * `enabledPlugins` id component is an unvalidated settings-file KEY, not
 * something guaranteed traversal-free upstream of the plugin scanner
 * (SMI-6228 Source 5, cross-provider review finding GPT-5.6-Sol). Moved
 * here from `local-inventory.ts` to keep that file under the 500-line cap.
 */
export declare function isSafePathComponent(component: string): boolean;
/**
 * True when `candidate`, once resolved to its REAL (symlink-followed) path,
 * is `root` or nested under it. Lexical `path.resolve` doesn't follow
 * symlinks, so a symlinked cache subdirectory could escape a purely-lexical
 * check even though `readdirSync`/`readFileSync` would then genuinely
 * follow it outside (GPT-5.6-Sol review finding). A nonexistent path makes
 * `realpathSync` throw — treated as "not within root" (fail-soft, same as
 * the caller's existing missing-directory skip).
 */
export declare function isWithinRoot(root: string, candidate: string): boolean;
//# sourceMappingURL=local-inventory.path-safety.helpers.d.ts.map