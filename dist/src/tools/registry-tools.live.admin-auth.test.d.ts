/**
 * @fileoverview SMI-5822 regression suite — deprecate/undeprecate are user-authorized, not
 *   license-key-authorized
 * @see SMI-5822: a team's shared license key was, in effect, an admin credential
 * @see SMI-5882: red-team assessment, What Changes §2 / Wave 3
 * @see docs/internal/implementation/smi-5882-redteam-private-registry-privacy-assessment.md
 *
 * **This suite is the inversion of a proven gap, not a hypothetical.** SMI-5882 Wave 1 ran
 * `scripts/staging/smi-5882-private-registry-rls-role-boundary.sql` against staging and
 * demonstrated the escalation as an asymmetry in one transaction: block E1 showed a team
 * *member* deprecating over the authenticated/RLS path reaches `0 rows`
 * (`private_registry_skills_admin_update` is correctly restrictive), while block E2 showed the
 * identical `UPDATE` as `service_role` deprecated 2 rows. Because `createLiveRegistryService()`
 * used the service-role client for all CRUD, and `resolve_team_from_license` is
 * `(p_license_key TEXT) RETURNS TEXT` — a *team*, never a *person* — any holder of the shared
 * team key reached exactly the unrestricted E2 path.
 *
 * **Why the assertions here are shaped the way they are.** E2 cannot be inverted in SQL: at the
 * database layer `service_role` still bypasses RLS, by design, and that is not changing. The fix
 * is that the MCP path no longer *reaches* it for these two operations. So the inversion has to
 * be asserted where the change actually is — in which credential the service picks — which is
 * what every test below checks:
 *
 *   1. the deprecating UPDATE is issued on the **user** client, and the service-role client
 *      never sees an UPDATE to `private_registry_skills` at all;
 *   2. with no signed-in user, the operation fails with an actionable error and issues **no**
 *      write — rather than silently falling back to the service-role client, which would restore
 *      the escalation;
 *   3. a member whose rows are readable but not writable is told they are not an admin, not that
 *      the skill does not exist;
 *   4. the audit row for these operations names the **user** who authorized them, not the license
 *      key that did not (cross-provider review finding #3);
 *   5. a failed readability probe surfaces as a real error, never as "not found" (finding #4).
 */
export {};
//# sourceMappingURL=registry-tools.live.admin-auth.test.d.ts.map