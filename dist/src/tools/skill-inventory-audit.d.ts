/**
 * @fileoverview `skill_inventory_audit` MCP tool (SMI-4590 Wave 4 PR 4).
 * @module @skillsmith/mcp-server/tools/skill-inventory-audit
 *
 * Plan: docs/internal/implementation/smi-4590-cli-mcp-framework-adapter.md §1.
 *
 * Stateless: every call generates a fresh `auditId`, runs the full
 * Wave 1 + 2 + 3 pipeline via `runInventoryAudit`, and writes both
 * `result.json` (Wave 1 history) and `suggestions.json` (this PR) to
 * `~/.skillsmith/audits/<auditId>/`. Idempotent — re-invocation produces a
 * fresh audit with no shared state across calls.
 *
 * Validation:
 *   - `deep` / `applyExclusions` — booleans, default false / true.
 *   - `homeDir` — string under `os.homedir()` or `os.tmpdir()` (test
 *     fixtures). Anything else rejects with
 *     `namespace.audit.invalid_home_dir` (`buildValidationError` envelope).
 *   - `projectDir` — string, optional; no traversal refinement (CLAUDE.md
 *     scan is read-only and tolerates missing files).
 *   - Unknown top-level keys are rejected (Zod `.strict()`).
 */
import { z } from 'zod';
import type { SkillInventoryAuditInput, SkillInventoryAuditResponse } from './skill-inventory-audit.types.js';
/**
 * Zod input schema for the `skill_inventory_audit` MCP tool.
 *
 * `homeDir` refinement: the resolved absolute path must live under
 * `os.homedir()` OR `os.tmpdir()` (test fixtures only). Bare arbitrary
 * paths are rejected — prevents an attacker-controlled input from
 * steering the scanner at e.g. `/etc` or `/private/var/db`.
 */
export declare const skillInventoryAuditInputSchema: z.ZodObject<{
    deep: z.ZodOptional<z.ZodBoolean>;
    homeDir: z.ZodOptional<z.ZodEffects<z.ZodString, string, string>>;
    projectDir: z.ZodOptional<z.ZodString>;
    applyExclusions: z.ZodOptional<z.ZodBoolean>;
}, "strict", z.ZodTypeAny, {
    homeDir?: string | undefined;
    projectDir?: string | undefined;
    deep?: boolean | undefined;
    applyExclusions?: boolean | undefined;
}, {
    homeDir?: string | undefined;
    projectDir?: string | undefined;
    deep?: boolean | undefined;
    applyExclusions?: boolean | undefined;
}>;
export type SkillInventoryAuditValidatedInput = z.infer<typeof skillInventoryAuditInputSchema>;
/**
 * MCP tool schema for `skill_inventory_audit` (SMI-5213). Hand-written
 * JSON Schema mirroring {@link skillInventoryAuditInputSchema} so the tool
 * is client-discoverable via ListTools. Keep in sync with the Zod schema.
 */
export declare const skillInventoryAuditToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            deep: {
                type: string;
                description: string;
            };
            homeDir: {
                type: string;
                description: string;
            };
            projectDir: {
                type: string;
                description: string;
            };
            applyExclusions: {
                type: string;
                description: string;
            };
        };
        required: never[];
    };
};
export declare const skillInventoryAudit: (input: unknown) => Promise<SkillInventoryAuditResponse | InventoryAuditValidationError>;
/**
 * Application-level validation-error envelope. Mirrors the
 * `install.ts:buildValidationError` shape so MCP clients that introspect
 * `success` get a consistent failure surface across audit + install
 * tools.
 */
export interface InventoryAuditValidationError {
    success: false;
    error: string;
    errorCode: 'namespace.audit.invalid_input' | 'namespace.audit.invalid_home_dir';
}
export type { SkillInventoryAuditInput, SkillInventoryAuditResponse };
//# sourceMappingURL=skill-inventory-audit.d.ts.map