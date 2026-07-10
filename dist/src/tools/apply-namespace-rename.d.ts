/**
 * @fileoverview `apply_namespace_rename` MCP tool (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/tools/apply-namespace-rename
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §2.
 *
 * Per-collision apply path. The agent calls `skill_inventory_audit` first
 * to populate `~/.skillsmith/audits/<auditId>/`, then calls this tool
 * once per accepted rename. Stateless: each call re-reads the persisted
 * suggestions file (via `readAuditSuggestions`) and dispatches to Wave 2's
 * `applyRename`.
 *
 * Input semantics:
 *   - `action: 'apply'`  — apply the suggested rename verbatim.
 *   - `action: 'custom'` — apply with `customName` (Zod refinement
 *     enforces non-empty `customName` on this branch).
 *   - `action: 'skip'`   — no-op; returns `{ success: true }` with no
 *     `result`. The agent records the decision; nothing on disk changes.
 *
 * Failure modes (typed via `errorCode`):
 *   - `namespace.audit.invalid_input` — Zod rejection.
 *   - `namespace.audit.history_not_found` — `auditId` doesn't resolve.
 *   - `namespace.audit.collision_not_found` — `collisionId` not in
 *     persisted `RenameSuggestion[]`.
 *   - `namespace.rename.subcall_failed` — Wave 2's `applyRename` errored
 *     (target_exists, backup_failed, frontmatter_rewrite_failed, etc.).
 *     The inner Wave 2 error kind is preserved in the `error` message.
 */
import { z } from 'zod';
import type { ApplyNamespaceRenameResponse } from './apply-namespace-rename.types.js';
/**
 * Zod input schema with conditional refinement: `customName` is required
 * iff `action === 'custom'`; `customName` is forbidden otherwise (rejects
 * payloads that pass an unused field on apply / skip — keeps the surface
 * clean and helps catch caller-side bugs).
 *
 * SMI-5213: `confirmed` (default false) gates the file mutation. When
 * `confirmed !== true` (and `action !== 'skip'`), the tool returns a
 * non-mutating preview envelope describing the rename; the caller must
 * re-invoke with `confirmed: true` to actually rename the file.
 */
export declare const applyNamespaceRenameInputSchema: z.ZodEffects<z.ZodObject<{
    auditId: z.ZodString;
    collisionId: z.ZodString;
    action: z.ZodEnum<["apply", "custom", "skip"]>;
    customName: z.ZodOptional<z.ZodString>;
    confirmed: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    auditId: string;
    action: "apply" | "custom" | "skip";
    collisionId: string;
    customName?: string | undefined;
    confirmed?: boolean | undefined;
}, {
    auditId: string;
    action: "apply" | "custom" | "skip";
    collisionId: string;
    customName?: string | undefined;
    confirmed?: boolean | undefined;
}>, {
    auditId: string;
    action: "apply" | "custom" | "skip";
    collisionId: string;
    customName?: string | undefined;
    confirmed?: boolean | undefined;
}, {
    auditId: string;
    action: "apply" | "custom" | "skip";
    collisionId: string;
    customName?: string | undefined;
    confirmed?: boolean | undefined;
}>;
/**
 * MCP tool schema for `apply_namespace_rename` (SMI-5213). Hand-written
 * JSON Schema mirroring {@link applyNamespaceRenameInputSchema} so the
 * tool is client-discoverable via ListTools. Keep in sync with the Zod
 * schema.
 */
export declare const applyNamespaceRenameToolSchema: {
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
            action: {
                type: string;
                description: string;
                enum: string[];
            };
            customName: {
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
export declare const applyNamespaceRename: (input: unknown) => Promise<ApplyNamespaceRenameResponse>;
//# sourceMappingURL=apply-namespace-rename.d.ts.map