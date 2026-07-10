/**
 * Unit tests for SMI-4588 Wave 2 Steps 3+4 — frontmatter rewriter + apply paths.
 * PR #2 of the Wave 2 stack.
 *
 * Coverage:
 *   Frontmatter rewriter:
 *     1. Round-trip rewrites `name:` while preserving block-scalar `description`.
 *     2. Inline comments on the `name:` line are preserved.
 *     3. No frontmatter → `no_frontmatter` error.
 *     4. No `name:` field → `no_name_field` error.
 *
 *   Rename engine apply paths:
 *     5. `rename_command_file` — backup created, file renamed, ledger appended.
 *     6. `rename_agent_file` — same coverage.
 *     7. `rename_skill_dir_and_frontmatter` — directory renamed, frontmatter
 *        rewritten, ledger appended.
 *     8. Idempotent re-apply — second call returns success with
 *        `fromPath === toPath` and `backupPath === ''`.
 *     9. Disk-vs-ledger divergence → `namespace.ledger.disk_divergence` error.
 *    10. Rename target collides with existing file → `target_exists` error.
 *    11. Frontmatter helper does NOT write a backup (Edit 4 contract).
 *    12. Revert — restores original filename + removes ledger entry.
 *    13. Revert idempotency — second revert returns success no-op.
 */
export {};
//# sourceMappingURL=rename-engine.test.d.ts.map