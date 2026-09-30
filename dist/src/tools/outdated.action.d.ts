/**
 * @fileoverview skill_outdated MCP tool — execution logic + wrapped export
 * @module @skillsmith/mcp-server/tools/outdated.action
 * @see SMI-6532: sibling-split of outdated.ts (SMI-5127+ foo.action.ts
 *   convention) so the ~40-entry renderer table due in this area doesn't
 *   push the file over the 500-line pre-commit gate. `executeOutdatedImpl`
 *   + the `withTelemetry`-wrapped `executeOutdated` export live here; the
 *   zod schema, `OutdatedInput`, and the response interfaces stay in
 *   outdated.ts.
 */
import type { ToolContext } from '../context.js';
import type { OutdatedResponse } from './outdated.js';
export declare const executeOutdated: (input: {
    include_deps: boolean;
}, context: ToolContext) => Promise<OutdatedResponse>;
//# sourceMappingURL=outdated.action.d.ts.map