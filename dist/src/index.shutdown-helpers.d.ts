/**
 * @fileoverview Shutdown-coordinator helpers extracted from index.ts (SMI-5649).
 * @module @skillsmith/mcp-server/index.shutdown-helpers
 *
 * Extracted to keep index.ts under the `audit:standards` 500-LOC gate after
 * SMI-5649's unified shutdown coordinator wiring. No behavior change from the
 * inline version.
 */
import type { BackgroundSyncService } from '@skillsmith/core';
/**
 * SMI-5649: bounded quiesce of the background sync service. `bg.stop()`
 * itself aborts the in-flight sync immediately and awaits its settlement;
 * this wrapper additionally bounds that await so a hung sync (e.g. a stuck
 * network call) can never block process exit indefinitely. On timeout,
 * proceeds anyway and logs — safe because SyncEngine's abort checkpoints
 * guarantee no NEW write begins once the signal is aborted (see
 * `SyncEngine.ts`'s abort checkpoints and the design doc §2.3).
 */
export declare function quiesceBackgroundSync(bg?: BackgroundSyncService): Promise<void>;
//# sourceMappingURL=index.shutdown-helpers.d.ts.map