/**
 * @fileoverview `registry-tools.live.auth.ts` direct unit coverage — SMI-5821 DoD gap.
 *
 * Every other test file in this directory exercises `getAdminUserClient`/`getMemberUserClient`
 * only through the happy path and the no-signed-in-user branch (via `resolveUserAccessToken`
 * returning `null`). Nothing in the suite ever makes `getSupabaseUserClient` itself throw, so
 * `bindUserClient`'s catch branch — the error-wrapping path, including the three special-cased
 * operation names in `describeClientBindFailure` (`submissions`/`approve`/`reject` vs. the
 * default "Failed to X skill") — was unexercised (0% branch coverage on that function). This
 * file closes that gap directly, without needing the full `createLiveRegistryService` call
 * surface the other test files build around.
 */
export {};
//# sourceMappingURL=registry-tools.live.auth.test.d.ts.map