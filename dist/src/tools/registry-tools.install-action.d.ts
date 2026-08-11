/**
 * @fileoverview `private_registry_manage(action:'install')` handler
 * @module @skillsmith/mcp-server/tools/registry-tools.install-action
 * @see SMI-5905 Wave 3: MCP tool surface — `install` action + `getContent()`
 * @see docs/internal/implementation/private-registry-skill-install.md
 *
 * Lives outside `registry-tools.ts` because that file was 466/500 lines before this wave — the
 * same `foo.action.ts` split CLAUDE.md prescribes for a command whose handlers push it over.
 *
 * Two invariants this handler exists to hold:
 *
 * 1. **The raw `content` map never reaches the MCP tool result.** That result is rendered straight
 *    into the calling model's context and `content` can be 2 MB (ADR-129 Risks). The success path
 *    therefore builds a `PrivateRegistryInstallSummary` — an explicit allowlist — rather than
 *    forwarding core's `InstallResult`, which carries `securityReport` (content-derived match
 *    snippets) and would silently grow whatever fields a future core change adds.
 *
 * 2. **Entitlement is not this file's job, and must not be re-implemented here.** It is enforced
 *    inside `getContent()` (registry-tools.live.content.ts), against the team that owns the row.
 *    A second copy of the check here could drift from the Edge Function's; a `catch` that
 *    swallowed its error would silently un-gate the feature. Errors from `getContent()` propagate
 *    to the caller's message unchanged.
 */
import { SkillInstallationService } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
import type { PrivateRegistryManageInput, PrivateRegistryManageResult, PrivateRegistryService } from './registry-tools.js';
export interface RegistryInstallParams {
    input: PrivateRegistryManageInput;
    /** License-derived team id, resolved by the outer handler. Never taken from tool input. */
    teamId: string;
    dataSource: 'stub' | 'live';
    service: PrivateRegistryService;
    /** The outer handler's ToolContext; falls back to the process-wide one when absent. */
    context?: ToolContext;
    /** Test seam — see {@link defaultInstaller}. Production callers omit it. */
    createInstaller?: (context: ToolContext) => SkillInstallationService;
}
/**
 * Fetch a private-registry skill's content and install it to disk.
 *
 * Errors are returned as `{success:false, error}` rather than thrown, matching every other action
 * in `executePrivateRegistryManageImpl` — including the entitlement denial from `getContent()`,
 * whose message is already written for the end user.
 */
export declare function executeRegistryInstall(params: RegistryInstallParams): Promise<PrivateRegistryManageResult>;
//# sourceMappingURL=registry-tools.install-action.d.ts.map