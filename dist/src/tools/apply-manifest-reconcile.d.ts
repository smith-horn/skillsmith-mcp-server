/**
 * @fileoverview `apply_manifest_reconcile` MCP tool (SMI-6343 Wave 4).
 * @module @skillsmith/mcp-server/tools/apply-manifest-reconcile
 *
 * Plan: docs/internal/implementation/smi-6343-manifest-hygiene.md
 * ("4. Reconciliation tool (Wave 4, stacked on Wave 3 — AC#1, AC#2, and
 * ADR-144 §6's writer)"). Trust-model philosophy: ADR-144 §3 (never
 * convert uncertainty into a registry identity) and ADR-145
 * (docs/internal/adr/145-manifest-provenance-as-second-trust-axis.md —
 * `provenance` is a second trust axis, orthogonal to `source`).
 *
 * Community tier. Repairs a corrupted or ambiguous `~/.skillsmith/
 * manifest.json` entry through a supported path — never a hand-edit —
 * closing AC#1/AC#2 and writing the `verifiedAt` field ADR-144 §6's
 * blanket trust-downgrade needs a way back out of.
 *
 * Actions:
 *   - `mark_local`  — clears registry tracking: `source: 'unknown'` +
 *     `provenance: 'local'`, written atomically in one locked update
 *     (ADR-145 §2 — these two fields are never written independently).
 *   - `relink`      — sets `id`/`source` to an explicitly supplied,
 *     registry-validated pair + `provenance: 'registry'`. Never infers an
 *     identity (ADR-144 §3) — does NOT set `verifiedAt` (asserting an
 *     identity is not verifying content).
 *   - `drop_entry`  — hard-removes an entry whose `installPath` no longer
 *     resolves (M7: renamed from `forget`, which read as reversible — this
 *     is a hard delete, recoverable only via `revert`).
 *   - `verify`      — (C3) runs the Wave 2 comparison for one entry or
 *     every entry (batch by default) and writes `verifiedAt` only on a
 *     match; a mismatch leaves the entry untouched.
 *   - `revert`      — (C7) durable, cross-session undo of a prior
 *     reconcile action on ONE entry, via a dedicated ledger
 *     (`~/.skillsmith/manifest-reconcile-ledger.json`) modeled on
 *     `rename-engine.revert.ts` — NOT `undo_apply`, which is rejected as
 *     the undo mechanism for this tool (session-scoped, whole-file hash
 *     guard hostile to the manifest's 7 independent writers, unlocked
 *     writer — see the plan's C7 subsection).
 */
import { z } from 'zod';
import { type ClientId } from '@skillsmith/core/install';
import type { ToolContext } from '../context.js';
import type { ApplyManifestReconcileResponse } from './apply-manifest-reconcile.types.js';
export declare const applyManifestReconcileInputSchema: z.ZodEffects<z.ZodObject<{
    action: z.ZodEnum<["mark_local", "relink", "drop_entry", "verify", "revert"]>;
    name: z.ZodOptional<z.ZodString>;
    client: z.ZodOptional<z.ZodEnum<[ClientId, ...ClientId[]]>>;
    scope: z.ZodOptional<z.ZodEnum<["global", "workspace"]>>;
    cwd: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
    source: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
    ledgerEntryId: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    action: "revert" | "mark_local" | "relink" | "drop_entry" | "verify";
    name?: string | undefined;
    reason?: string | undefined;
    id?: string | undefined;
    client?: ClientId | undefined;
    ledgerEntryId?: string | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
    source?: string | undefined;
}, {
    action: "revert" | "mark_local" | "relink" | "drop_entry" | "verify";
    name?: string | undefined;
    reason?: string | undefined;
    id?: string | undefined;
    client?: ClientId | undefined;
    ledgerEntryId?: string | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
    source?: string | undefined;
}>, {
    action: "revert" | "mark_local" | "relink" | "drop_entry" | "verify";
    name?: string | undefined;
    reason?: string | undefined;
    id?: string | undefined;
    client?: ClientId | undefined;
    ledgerEntryId?: string | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
    source?: string | undefined;
}, {
    action: "revert" | "mark_local" | "relink" | "drop_entry" | "verify";
    name?: string | undefined;
    reason?: string | undefined;
    id?: string | undefined;
    client?: ClientId | undefined;
    ledgerEntryId?: string | undefined;
    cwd?: string | undefined;
    scope?: "global" | "workspace" | undefined;
    source?: string | undefined;
}>;
/**
 * MCP tool schema for `apply_manifest_reconcile`. Hand-written JSON Schema
 * mirroring {@link applyManifestReconcileInputSchema} so the tool is
 * client-discoverable via ListTools. Keep in sync with the Zod schema.
 */
export declare const applyManifestReconcileToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            client: {
                type: string;
                enum: [ClientId, ...ClientId[]];
                description: string;
            };
            scope: {
                type: string;
                enum: string[];
                description: string;
            };
            cwd: {
                type: string;
                description: string;
            };
            id: {
                type: string;
                description: string;
            };
            source: {
                type: string;
                description: string;
            };
            reason: {
                type: string;
                description: string;
            };
            ledgerEntryId: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const applyManifestReconcile: (input: unknown, _context?: ToolContext | undefined) => Promise<ApplyManifestReconcileResponse>;
//# sourceMappingURL=apply-manifest-reconcile.d.ts.map