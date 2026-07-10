/**
 * @fileoverview `apply_recommended_edit` MCP tool (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/tools/apply-recommended-edit
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §3.
 *
 * Per-collision apply path for prose edits. Mirrors
 * `apply_namespace_rename` but dispatches to Wave 3's
 * `applyRecommendedEdit` instead of Wave 2's `applyRename`.
 *
 * Tool registration:
 *   - Registered iff `APPLY_TEMPLATE_REGISTRY.size > 0`
 *     (`audit-tool-dispatch.ts` adds the case + name to `AUDIT_TOOL_NAMES`
 *     conditionally at module load).
 *   - Live state: `APPLY_TEMPLATE_REGISTRY = new Set(['add_domain_qualifier'])`
 *     (Wave 3 PR #886, merged) — tool is registered.
 *
 * Failure modes:
 *   - `namespace.audit.invalid_input` — Zod rejection.
 *   - `namespace.audit.history_not_found` — `auditId` doesn't resolve.
 *   - `namespace.audit.collision_not_found` — `collisionId` not in
 *     persisted `RecommendedEdit[]`.
 *   - `edit.template_not_in_apply_registry` — Wave 3 registry guard
 *     rejected the persisted `pattern`.
 *   - `edit.subcall_failed` — any other Wave 3 failure (stale_before,
 *     backup_failed, fs_error). Inner kind preserved in `error` message.
 */
import { z } from 'zod';
import type { ApplyRecommendedEditResponse } from './apply-recommended-edit.types.js';
/**
 * Zod input schema. `auditId` + `collisionId` are FKs into
 * `~/.skillsmith/audits/<auditId>/suggestions.json`.
 *
 * SMI-5213: `confirmed` (default false) gates the file mutation. When
 * `confirmed !== true`, the tool returns a non-mutating preview envelope
 * describing the prose edit; the caller must re-invoke with
 * `confirmed: true` to actually rewrite the file.
 */
export declare const applyRecommendedEditInputSchema: z.ZodObject<{
    auditId: z.ZodString;
    collisionId: z.ZodString;
    confirmed: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    auditId: string;
    collisionId: string;
    confirmed?: boolean | undefined;
}, {
    auditId: string;
    collisionId: string;
    confirmed?: boolean | undefined;
}>;
/**
 * MCP tool schema for `apply_recommended_edit` (SMI-5213). Hand-written
 * JSON Schema mirroring {@link applyRecommendedEditInputSchema} so the
 * tool is client-discoverable via ListTools. Registration is gated on
 * `APPLY_TEMPLATE_REGISTRY.size > 0` — see `newAuditToolDefinitions` in
 * `audit-tool-dispatch.ts`. Keep in sync with the Zod schema.
 */
export declare const applyRecommendedEditToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            auditId: {
                type: string;
                description: string;
            };
            collisionId: {
                type: string;
                description: string;
            };
            confirmed: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const applyRecommendedEditTool: (input: unknown) => Promise<ApplyRecommendedEditResponse>;
//# sourceMappingURL=apply-recommended-edit.d.ts.map