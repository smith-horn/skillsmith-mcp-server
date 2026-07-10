/**
 * SMI-4954: Tests for the `installable` signal and `installable_only` filter.
 *
 * `installable` is derived from a registry `repo_url` being present — discovery-only
 * entries (repo_url null, SMI-2723) cannot be resolved by `install_skill`. Covers
 * the online API path mapping, the `installable_only` filter, and the `search` /
 * `get_skill` formatter output. Split into its own file to keep search.test.ts
 * and get-skill.test.ts under the 500-line gate.
 */
export {};
//# sourceMappingURL=search-installable.test.d.ts.map