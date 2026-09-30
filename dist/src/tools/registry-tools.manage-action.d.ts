/**
 * @fileoverview `private_registry_manage` action-switch body
 * @module @skillsmith/mcp-server/tools/registry-tools.manage-action
 * @see registry-tools.ts, whose `executePrivateRegistryManageImpl` resolves the team/credential
 *   source and the module's `service` singleton, then delegates the whole action switch here —
 *   split out (SMI-6622 round 3) to keep `registry-tools.ts` comfortably under the pre-commit
 *   500-line file-length gate, the same reason `install`/`submissions`/`approve`/`reject` already
 *   delegate to their own companion files (`registry-tools.install-action.ts`,
 *   `registry-tools.review-action.ts`) instead of living inline here.
 *
 * `service` is received as a plain parameter, not re-fetched via a getter imported from
 * registry-tools.ts — this is deliberate, and load-bearing for correctness: `registry-tools.ts`'s
 * own `executePrivateRegistryManageImpl` reads its module-level `service` singleton fresh on every
 * call (through `dataSourceFor(service)` and the value it passes down here), so the singleton is
 * still read AT CALL TIME, never captured once at import time — `setPrivateRegistryService()`'s
 * test/production swap keeps working exactly as before. Fetching it via a getter imported from
 * registry-tools.ts here instead would also create a value-level circular import between the two
 * files; a plain parameter avoids that entirely (this file's only reference to registry-tools.ts
 * is the `import type` below, which is fully erased at compile time).
 */
import type { ToolContext } from '../context.js';
import type { PrivateRegistryManageResult, PrivateRegistryService } from './registry-tools.js';
import type { PrivateRegistryManageInput } from './registry-tools.schemas.js';
import type { RegistryCredentialSource } from './registry-tools.team.js';
/**
 * Execute the `private_registry_manage` action switch. `teamId`/`credentialSource`/`dataSource`
 * are already resolved by the caller (registry-tools.ts); `service` is that same call's current
 * singleton value, passed straight through.
 */
export declare function executePrivateRegistryManageAction(params: {
    input: PrivateRegistryManageInput;
    context: ToolContext;
    teamId: string;
    credentialSource: RegistryCredentialSource;
    dataSource: 'stub' | 'live';
    service: PrivateRegistryService;
}): Promise<PrivateRegistryManageResult>;
//# sourceMappingURL=registry-tools.manage-action.d.ts.map