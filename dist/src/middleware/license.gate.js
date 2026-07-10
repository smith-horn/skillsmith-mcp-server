import { safeParseOrError } from '../validation.js';
import { ApiClientError, SkillsmithError, ErrorCodes } from '@skillsmith/core';
import { runWithEmissionGate } from '@skillsmith/core/telemetry';
import { createLicenseErrorResponse } from './license.js';
import { resolveConsent, annotateResponseWithConsent } from './telemetry-consent.js';
const COMPLETE_PROFILE_URL = 'https://skillsmith.app/complete-profile';
/**
 * SMI-4463: JSON-RPC error code for monthly_quota_exceeded.
 *
 * Lives in the mid-range of the JSON-RPC reserved server-error band
 * (-32000 / -32099). -32099 was at the edge and risks colliding with
 * future spec assignments; -32050 gives us comfortable headroom.
 *
 * Disambiguator from per-minute rate-limit errors is the response
 * `error: 'monthly_quota_exceeded'` body field — never the status code
 * alone (both surface as 429 on the wire).
 *
 * Documented in CODES.md alongside other Skillsmith-canonical codes.
 */
export const MCP_MONTHLY_QUOTA_EXCEEDED_CODE = -32050;
/**
 * SMI-4463: Build the user-facing MCP error response for a monthly quota
 * exhaustion. The structured `data.quotaInfo` payload lets MCP clients
 * render rich UI (countdown, upgrade button) without re-parsing the
 * message. The plain-text message is suitable for any client that
 * just stringifies content[0].text.
 */
function createMonthlyQuotaExceededResponse(err) {
    const details = (err.details || {});
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    code: MCP_MONTHLY_QUOTA_EXCEEDED_CODE,
                    error: 'monthly_quota_exceeded',
                    message: err.message,
                    data: {
                        quotaInfo: {
                            used: details.used ?? null,
                            limit: details.limit ?? null,
                            tier: details.tier ?? null,
                            resetsAt: details.resetsAt ?? null,
                        },
                    },
                }, null, 2),
            },
        ],
        isError: true,
    };
}
export function ok(result) {
    return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
}
export function errResponse(response) {
    return response;
}
// SMI-4402: returns -32001 JSON-RPC error code so Claude Code can surface the
// profile_incomplete state without silently 500ing the MCP subprocess.
export function createProfileIncompleteResponse() {
    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify({
                    code: -32001,
                    error: 'profile_incomplete',
                    complete_url: COMPLETE_PROFILE_URL,
                    message: `Almost there! Add your first & last name (30 seconds): ${COMPLETE_PROFILE_URL}`,
                    data: { profile_incomplete: true },
                }, null, 2),
            },
        ],
        isError: true,
    };
}
// SMI-4402: H9 — profile_incomplete 403s are caught and translated to a user-facing
// response. Note: checkAndTrack runs before the handler (quota IS decremented even
// for profile_incomplete errors, because the QuotaMiddleware has no split check/track
// API). A future improvement (SMI-4403) could add a checkOnly + track-on-success path.
// SMI-5037: parameterise over the schema type `S` (see validation.ts) so the
// signature is stable across zod v3 (locked, used by CI) and v4 (hoisted in
// drifted dev installs). `TypeOf<S>` derives the handler input from the schema.
export async function withLicenseAndQuota(toolName, args, schema, handler, toolContext, licenseMiddleware, quotaMiddleware) {
    const parsed = safeParseOrError(schema, args, toolName);
    if (!parsed.ok)
        return parsed.response;
    const licenseResult = await licenseMiddleware.checkTool(toolName);
    if (!licenseResult.valid)
        return errResponse(createLicenseErrorResponse(licenseResult));
    const licenseInfo = await licenseMiddleware.getLicenseInfo();
    const quotaResult = await quotaMiddleware.checkAndTrack(toolName, licenseInfo);
    if (!quotaResult.allowed)
        return errResponse(quotaMiddleware.buildExceededResponse(quotaResult));
    // SMI-5019 W2.S4: resolve telemetry-consent state in parallel with the
    // tool handler. The consent surface for MCP-only clients is the web
    // dashboard at TELEMETRY_PRIVACY_URL; first call from an unrecognised
    // anonymous_id surfaces `consent_required:true` in the response envelope.
    // Resolution failure is fail-safe (consent required, telemetry suppressed).
    //
    // SMI-5019 wire-in: we await consent BEFORE installing the emission gate so
    // the gate predicate can be a sync boolean snapshot — the
    // `@skillsmith/core/telemetry` `withTelemetry` HOF calls the gate inside a
    // sync `finally` block, so an async predicate would be unsound. The
    // `resolveConsent` call is process-cached, so this await is one round-trip
    // on first call for a given anonymous_id and zero-cost on subsequent calls.
    const consent = await resolveConsent(toolContext.distinctId);
    // SMI-5479: run the handler inside an `AsyncLocalStorage`-scoped emission
    // gate (`runWithEmissionGate`) rather than installing/clearing the old
    // process-wide module `let` (`setEmissionGate`). This scope nests INSIDE
    // the dispatch-level `runWithEmissionGate` scope the CallTool handler
    // (`index.ts`) installs around the whole dispatch — both resolve from the
    // same cached `resolveConsent(toolContext.distinctId)` call, so they always
    // agree on the value; the inner (this) scope simply shadows the outer one
    // for this handler's own emit. No `finally` reset is needed: the ALS scope
    // auto-unwinds when the callback returns or throws, so it can never leak
    // emission permission to a later request or bleed into a concurrent
    // sibling call's scope — see the matching note in
    // `packages/core/src/telemetry/wrap.ts`.
    return runWithEmissionGate(consent.enabled, async () => {
        try {
            const handlerResult = await handler(parsed.data, toolContext);
            return annotateResponseWithConsent(ok(handlerResult), consent);
        }
        catch (err) {
            if (err instanceof ApiClientError &&
                err.statusCode === 403 &&
                err.message === 'profile_incomplete') {
                return errResponse(createProfileIncompleteResponse());
            }
            // SMI-4463: monthly_quota_exceeded translates to JSON-RPC -32050 with
            // structured quotaInfo. Disambiguates from per-minute rate-limit by
            // the `error: 'monthly_quota_exceeded'` body field, not status code.
            if (err instanceof SkillsmithError && err.code === ErrorCodes.NETWORK_QUOTA_EXCEEDED) {
                return errResponse(createMonthlyQuotaExceededResponse(err));
            }
            throw err;
        }
    });
}
//# sourceMappingURL=license.gate.js.map