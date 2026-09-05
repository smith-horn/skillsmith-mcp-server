/**
 * @fileoverview Local-inventory scanner for the consumer namespace audit.
 * @module @skillsmith/mcp-server/utils/local-inventory
 * @see SMI-4587 Wave 1 Step 2 — scan ~/.claude/{skills,commands,agents} +
 *      CLAUDE.md trigger phrases into a unified InventoryEntry[].
 * @see SMI-6077 — skills scanning extended from Claude Code only to every
 *      supported client's native skills directory (CLIENT_IDS). commands /
 *      agents / CLAUDE.md rules remain Claude Code-only — no other
 *      supported client has an equivalent construct today.
 *
 * Each source is independent — failure in one does not fail the others.
 * The scanner is read-only; bootstrapping unmanaged skills via `index_local`
 * is wired in a subsequent PR (Step 6a).
 */
import type { ScanResult } from './local-inventory.types.js';
export interface ScanLocalInventoryOptions {
    /** Defaults to `os.homedir()`. */
    homeDir?: string;
    /**
     * Optional project directory. When set, also scans `<projectDir>/CLAUDE.md`
     * (Source 4, in addition to the user one) and `<projectDir>/.claude/skills/`
     * (Source 6, SMI-6240 — this project's own skills, invisible to every
     * other source, which are all user-level).
     */
    projectDir?: string;
    /** Override path to `~/.skillsmith/manifest.json`. */
    manifestPath?: string;
}
/**
 * Scan every supported AI coding client's skills directory, plus Claude
 * Code's own `{commands,agents}` and CLAUDE.md trigger phrases (SMI-6077).
 *
 * Returns `entries[]` sorted by `kind` then `identifier`, plus any soft
 * `warnings[]` raised during scanning. `durationMs` measures wall-clock
 * time for the whole scan (excluding the optional bootstrap step that
 * lands in a subsequent PR).
 */
export declare function scanLocalInventory(opts?: ScanLocalInventoryOptions): Promise<ScanResult>;
//# sourceMappingURL=local-inventory.d.ts.map