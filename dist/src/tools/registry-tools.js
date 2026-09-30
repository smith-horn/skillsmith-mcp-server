/**
 * @fileoverview Private registry MCP tools for enterprise skill management
 * @module @skillsmith/mcp-server/tools/registry-tools
 * @see SMI-3902: Private Registry MCP Tools (original stub)
 * @see SMI-5816: Private skill registry — real implementation
 * @see ADR-129: Postgres-native (JSONB) storage + real team-auth (migration 071)
 * @see SMI-6622: the public `@skillsmith/mcp-server` package must never need Supabase env vars —
 *   service selection and team resolution below are NOT gated on `isSupabaseConfigured()`. Round 2
 *   (adversarial review) added credential-source-aware error text and a best-effort non-member
 *   check (registry-tools.membership-check.ts) for an otherwise-ambiguous list/namespace/publish
 *   result.
 *
 * Enables enterprise teams to publish and manage skills in a private registry scoped to their
 * organization. Metadata + packaged content live in `private_registry_skills` (JSONB, not S3 —
 * ADR-129); team-scoped RLS + an in-query team_id filter (ADR-116, SMI-6109 addendum).
 *
 * Backing service is selected at module load: the live Supabase-backed service
 * (registry-tools.live.ts) is the DEFAULT — an in-memory stub (registry-tools.stub.ts) is used
 * only under the explicit `SKILLSMITH_REGISTRY_STUB` test opt-in (see `useRegistryStub()` below).
 *
 * Tier gate: Enterprise (private_registry feature flag — toolFeatureMapping.ts).
 */
import { withTelemetry } from '@skillsmith/core/telemetry';
import { createStubRegistryService } from './registry-tools.stub.js';
import { createLiveRegistryService } from './registry-tools.live.js';
import { resolveRegistryTeamId } from './registry-tools.team.js';
import { confirmedNonMemberMessage } from './registry-tools.membership-check.js';
import { executePrivateRegistryManageAction } from './registry-tools.manage-action.js';
import { dataSourceFor } from './stub-data-source.js';
// Re-export stub factory for external consumers and tests. `StubRegistryService`/`StubActor`
// (SMI-5949 Wave 2 Step 5) are the stub-only identity-simulation seam — see registry-tools.stub.ts
// — not part of `PrivateRegistryService` itself, so this module's own singleton stays typed as
// plain `PrivateRegistryService` below.
export { createStubRegistryService } from './registry-tools.stub.js';
// Both the Zod runtime-validation schemas and the MCP tool-registration schemas live in
// registry-tools.schemas.ts (SMI-5949 D-12 Wave 2 Steps 1 + 4 — this file's own 500-line
// audit:standards budget) and are re-exported here so every existing import site (index.ts,
// tool-dispatch.ts, every test file) reaches them through this module unchanged.
export { privateRegistryPublishToolSchema, privateRegistryManageToolSchema, skillContentSchema, privateRegistryPublishInputSchema, privateRegistryManageInputSchema, } from './registry-tools.schemas.js';
/**
 * Explicit, test-only stub opt-in (SMI-6622) — NOT `isSupabaseConfigured()`. The live service
 * already has an anon-key production fallback (`supabase-client.ts`, SMI-6109), so no Supabase env
 * var is needed to reach it. `vitest.setup.ts` sets this for the whole test run; a test wanting the
 * live service still calls `setPrivateRegistryService(createLiveRegistryService())` to override.
 *
 * Adversarial-review finding (SMI-6622 round 2): honoring this flag unconditionally made it a
 * production footgun, not just a test convenience — a stray `SKILLSMITH_REGISTRY_STUB=1` in a real
 * MCP host's config would make `publish` return `success:true` with nothing written, the exact
 * silent-success class this issue exists to remove. Only ever honored when `process.env.VITEST`
 * is `'true'` (Vitest sets this itself — see e.g. `client.events.ts`/`rotation.ts` for the same
 * convention) — outside the test runner the flag is ignored and a warning is logged so a stray
 * value is diagnosable rather than silently inert.
 */
function useRegistryStub() {
    const v = process.env.SKILLSMITH_REGISTRY_STUB;
    if (v !== '1' && v !== 'true')
        return false;
    if (process.env.VITEST !== 'true') {
        console.error('[skillsmith] SKILLSMITH_REGISTRY_STUB is set but ignored outside the Vitest test runner ' +
            '(process.env.VITEST is not "true"); the live registry service is used regardless.');
        return false;
    }
    return true;
}
/** Module-level singleton. Live is the DEFAULT (SMI-6622); stub only under the opt-in above. */
let service = useRegistryStub()
    ? createStubRegistryService()
    : createLiveRegistryService();
/** Replace the registry service implementation (for testing or production swap) */
export function setPrivateRegistryService(svc) {
    service = svc;
}
/** Get the current registry service instance */
export function getPrivateRegistryService() {
    return service;
}
// ============================================================================
// Handlers
// ============================================================================
/**
 * Execute a private_registry_publish operation.
 */
async function executePrivateRegistryPublishImpl(input, _context) {
    // One read of the module-level singleton, so provenance and data can never come from two
    // different instances if `setPrivateRegistryService()` lands during an await below (SMI-6203
    // pattern, as in rbac-tools.action.ts). `dataSource` reflects which service is ACTUALLY wired in,
    // not merely whether Supabase env happens to be configured (SMI-6622/SMI-6184).
    const svc = service;
    const dataSource = dataSourceFor(svc);
    let teamId;
    let credentialSource;
    try {
        ;
        ({ teamId, source: credentialSource } = await resolveRegistryTeamId());
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Failed to resolve team from license key.',
        };
    }
    // SMI-5852 UX pre-check: the DB trigger (enforce_private_skill_namespace) is the actual
    // security boundary. getNamespace() never throws (SMI-6109) — a lookup failure resolves to
    // `null`, so this pre-check is simply skipped and the trigger remains the sole gate.
    let skillNamespace;
    const namespace = await svc.getNamespace(teamId);
    if (namespace) {
        skillNamespace = namespace;
        const requestedNamespace = input.skillId.split('/')[0];
        if (requestedNamespace !== namespace) {
            return {
                success: false,
                dataSource,
                error: `skill_id must start with "${namespace}/" for this team's private registry namespace.`,
            };
        }
    }
    // Service errors (immutability conflict, size cap, missing SKILL.md, missing
    // service-role key) surface as typed {success:false} results, not exceptions.
    try {
        const skill = await svc.publish(teamId, input.skillId, input.version, input.content, input.description);
        // SMI-5949 Wave 2 Step 2 (plan-review finding M9): a 'pending' result is not live yet — the
        // message must say so and must NOT present a Registry URL, which would read as "installable
        // now" when it structurally is not (D-4's RLS hides the row from every read surface until an
        // admin approves it). Every other value ('approved' — pre-approval-gate rows and Enterprise
        // teams without the gate; 'rejected' can never reach here, publish() always inserts pending)
        // keeps the pre-existing "published, here is the URL" message.
        const message = skill.approvalStatus === 'pending'
            ? `Submitted ${input.skillId}@${input.version} for review — an admin must approve it ` +
                'before teammates can install it. Review confirms who published this and what ' +
                'version/description was submitted; it does not include a full content read by the ' +
                'approver.'
            : `Published ${input.skillId}@${input.version} to private registry.\n` +
                `Registry URL: ${skill.registryUrl}`;
        return {
            success: true,
            dataSource,
            skill,
            skillNamespace,
            message,
        };
    }
    catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to publish skill.';
        // SMI-6622 round 2 finding 3: an RLS-shaped insert denial is indistinguishable from a genuine
        // permission problem UNTIL we positively confirm non-membership — see
        // registry-tools.membership-check.ts's own header for why this never fires on a mere guess.
        if (dataSource === 'live' && /row-level security|permission denied|42501/i.test(message)) {
            const nonMember = await confirmedNonMemberMessage(teamId, credentialSource);
            if (nonMember)
                return { success: false, dataSource, error: nonMember };
        }
        return { success: false, dataSource, error: message };
    }
}
/**
 * Execute a private_registry_manage operation.
 *
 * Resolves the team/credential source and reads the module-level `service` singleton (both fresh,
 * at call time — never captured once at import time, so `setPrivateRegistryService()`'s test/
 * production swap keeps working), then delegates the actual action switch to
 * `registry-tools.manage-action.ts` (SMI-6622 round 3 — split out to keep this file comfortably
 * under the pre-commit 500-line file-length gate; see that file's own header for the full
 * rationale, including why `service` is passed as a parameter rather than re-fetched there).
 */
async function executePrivateRegistryManageImpl(input, context) {
    // Single singleton read — see executePrivateRegistryPublishImpl's identical comment above.
    const svc = service;
    const dataSource = dataSourceFor(svc);
    let teamId;
    let credentialSource;
    try {
        ;
        ({ teamId, source: credentialSource } = await resolveRegistryTeamId());
    }
    catch (err) {
        return {
            success: false,
            dataSource,
            error: err instanceof Error ? err.message : 'Failed to resolve team from license key.',
        };
    }
    return executePrivateRegistryManageAction({
        input,
        context,
        teamId,
        credentialSource,
        dataSource,
        service: svc,
    });
}
// SMI-5017 W2.S2: wrap at export boundary
export const executePrivateRegistryPublish = withTelemetry(executePrivateRegistryPublishImpl, {
    source: 'mcp-tool',
    extractSkillId: () => 'private_registry_publish',
    extractFramework: () => 'unknown',
});
export const executePrivateRegistryManage = withTelemetry(executePrivateRegistryManageImpl, {
    source: 'mcp-tool',
    extractSkillId: () => 'private_registry_manage',
    extractFramework: () => 'unknown',
});
//# sourceMappingURL=registry-tools.js.map