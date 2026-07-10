/**
 * SMI-5358 (Fix D): local search excludes locally-quarantined skills.
 *
 * `searchLocalSkills` surfaces the user's own ~/.claude/skills inventory. A skill
 * recorded as quarantined in the LOCAL quarantine table (e.g. by `skill_rescan`)
 * must not resurface in search results. The fix threads a `QuarantineRepository`
 * into `searchLocalSkills` and filters on `isQuarantined()` — there is NO
 * duplicate `quarantined` column on the local skills table (ADR-112 §Neutral),
 * so `QuarantineRepository` is the single source of truth.
 *
 * The LocalIndexer is mocked so the test controls the inventory; the
 * QuarantineRepository is REAL (in-memory DB), so the exclusion is exercised
 * against genuine persisted quarantine state, not a stub.
 */
export {};
//# sourceMappingURL=LocalSkillSearch.quarantine.test.d.ts.map