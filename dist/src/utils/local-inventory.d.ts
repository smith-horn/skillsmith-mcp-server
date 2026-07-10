/**
 * @fileoverview Local-inventory scanner for the consumer namespace audit.
 * @module @skillsmith/mcp-server/utils/local-inventory
 * @see SMI-4587 Wave 1 Step 2 — scan ~/.claude/{skills,commands,agents} +
 *      CLAUDE.md trigger phrases into a unified InventoryEntry[].
 *
 * Each source is independent — failure in one does not fail the others.
 * The scanner is read-only; bootstrapping unmanaged skills via `index_local`
 * is wired in a subsequent PR (Step 6a).
 */
import type { ScanResult } from './local-inventory.types.js';
export interface ScanLocalInventoryOptions {
    /** Defaults to `os.homedir()`. */
    homeDir?: string;
    /** Optional project CLAUDE.md to scan in addition to the user one. */
    projectDir?: string;
    /** Override path to `~/.skillsmith/manifest.json`. */
    manifestPath?: string;
}
/**
 * Scan `~/.claude/{skills,commands,agents}` and CLAUDE.md trigger phrases.
 *
 * Returns `entries[]` sorted by `kind` then `identifier`, plus any soft
 * `warnings[]` raised during scanning. `durationMs` measures wall-clock
 * time for the whole scan (excluding the optional bootstrap step that
 * lands in a subsequent PR).
 */
export declare function scanLocalInventory(opts?: ScanLocalInventoryOptions): Promise<ScanResult>;
//# sourceMappingURL=local-inventory.d.ts.map