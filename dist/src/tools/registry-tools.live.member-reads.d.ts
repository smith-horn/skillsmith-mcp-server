/**
 * @fileoverview Audited, member-JWT-authenticated wrappers for list()/get()/getNamespace()
 * @module @skillsmith/mcp-server/tools/registry-tools.live.member-reads
 * @see SMI-6109: moved these three off the Supabase service-role client
 *
 * Split out of registry-tools.live.ts (580/500 lines after the SMI-6109 credential move) — the
 * established `.live.auth.ts`/`.live.audit.ts`/`.live.content.ts`/`.live.submissions.ts`
 * companion-module convention. Each function here: binds the signed-in user's own JWT via
 * getMemberUserClient() (registry-tools.live.auth.ts — MEMBER, not admin: any team member may
 * list/get/discover-namespace), runs the actual query (listSkills()/getSkill() from
 * registry-tools.live.reads.ts for the first two; getNamespace's own inline `teams` table query,
 * which belongs here rather than in reads.ts since that file is scoped to
 * `private_registry_skills` predicates specifically, not `teams`), and records a
 * recordRegistryAudit() row (registry-tools.live.audit.ts) so the license-key-team-vs-signed-in-
 * user dual-identity-signal gap this credential move introduces is observable rather than
 * invisible: the license key resolves one team, the signed-in user's own membership can silently
 * point at a different one (or none), and RLS fails closed on the mismatch indistinguishably from
 * "genuinely not found."
 *
 * getNamespace()'s wrapper deliberately swallows a getMemberUserClient() failure and returns null
 * rather than throwing — its documented contract (registry-tools.ts's PrivateRegistryService
 * interface) is "or null if it could not be resolved," and two callers (the
 * manage(action:'namespace') handler, and the publish namespace pre-check) depend on that
 * never-throws contract staying true. list()/get() have no such contract and throw normally on
 * failure — registry-tools.ts's dispatcher already wraps every service call to convert a thrown
 * error into a typed {success:false} result (see its own comment there: "Wrap service calls so
 * live-mode errors ... surface as typed results instead of propagating as unhandled exceptions"),
 * the same path `deprecate`/`undeprecate`/`getContent`/`publish` already rely on.
 */
import type { RegistrySkill } from './registry-tools.js';
/** D-4 surface 3 + SMI-5949 Wave 3 (deprecated read-filter closure) + SMI-6109 (this file). */
export declare function auditedList(teamId: string, version?: string, includeDeprecated?: boolean): Promise<RegistrySkill[]>;
/**
 * D-4 surface 4 + SMI-5949 Wave 3 + SMI-6109 (this file) — see registry-tools.live.reads.ts's
 * getSkill() for why this one carries no includeDeprecated opt-in, unlike auditedList() above.
 */
export declare function auditedGet(teamId: string, skillId: string, version?: string): Promise<RegistrySkill | null>;
/** SMI-6109. Never throws — see this file's header comment for why. */
export declare function auditedGetNamespace(teamId: string): Promise<string | null>;
//# sourceMappingURL=registry-tools.live.member-reads.d.ts.map