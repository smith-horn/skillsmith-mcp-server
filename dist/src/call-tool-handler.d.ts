/**
 * @fileoverview CallTool request handler for the Skillsmith MCP server.
 * @module @skillsmith/mcp-server/call-tool-handler
 *
 * Extracted from `index.ts`'s `CallToolRequestSchema` registration (SMI-5479
 * Step 3, plan H-3) to keep `index.ts` under the 500-LOC `audit:standards`
 * file-size gate.
 *
 * SMI-5479 also wires the dispatch-level consent + emission gate here: every
 * dispatched tool call now resolves consent ONCE
 * (`resolveConsent(toolContext.distinctId)`, process-cached) and runs the
 * dispatch inside `runWithEmissionGate(consent.enabled, ...)`. This is the
 * change that flips the 18 previously-never-emitting direct-dispatch tools
 * (12 agent-profile + 6 non-profile — see
 * `docs/internal/implementation/smi-5479-emission-gate-dispatch.md`) to
 * emit-when-consent-on. Gated tools (routed through `withLicenseAndQuota` in
 * `middleware/license.gate.ts`) already install their OWN nested
 * `runWithEmissionGate` scope from the SAME cached consent value — that
 * inner scope simply shadows this outer one for the gated handler's own
 * emit; see the double-gate note in `license.gate.ts` and
 * `packages/core/src/telemetry/wrap.ts`.
 *
 * LATE-BINDING TRAP (plan pass-2, load-bearing): `toolContext` is a
 * module-level `let` in `index.ts`, assigned inside `main()` AFTER the
 * CallTool handler registers with the SDK server. `handleCallToolRequest`
 * therefore takes `deps` as a plain PARAMETER, read fresh on every
 * invocation — the registration call site
 * (`server.setRequestHandler(CallToolRequestSchema, (request) =>
 * handleCallToolRequest(request, { toolContext, ... }))`) re-reads the
 * module-level `toolContext` binding on every call. Do NOT refactor this to
 * capture `deps` once at registration time — that would freeze `toolContext`
 * at its pre-`main()` value (`undefined`), passing typecheck but breaking at
 * runtime on the very first tool call.
 */
import type { CallToolRequest, CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { ToolContext } from './context.js';
import type { LicenseMiddleware } from './middleware/license.js';
import type { QuotaMiddleware } from './middleware/quota.js';
/**
 * Per-call dependencies for {@link handleCallToolRequest}. See the
 * LATE-BINDING TRAP note above — callers MUST read `toolContext` fresh at
 * the registration call site, never capture it once ahead of time.
 */
export interface CallToolHandlerDeps {
    toolContext: ToolContext;
    licenseMiddleware: LicenseMiddleware;
    quotaMiddleware: QuotaMiddleware;
}
/**
 * Handle a single `CallToolRequestSchema` request. Extracted from
 * `index.ts` (SMI-5479 Step 3) — see the module doc for the late-binding
 * dependency contract callers must honor.
 */
export declare function handleCallToolRequest(request: CallToolRequest, deps: CallToolHandlerDeps): Promise<CallToolResult>;
//# sourceMappingURL=call-tool-handler.d.ts.map