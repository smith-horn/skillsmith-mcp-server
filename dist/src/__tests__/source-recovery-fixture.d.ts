/**
 * @fileoverview Self-contained real-filesystem fixture for the SMI-5407
 * `skill_recover_source` MCP dispatch e2e.
 * @see SMI-5407
 *
 * A package-local copy of the directory-tree builder. Cross-package test imports
 * are structurally invalid (TS6059/TS6307: a CLI-package file is not under
 * mcp-server's tsconfig rootDir), and there is no shared test-util package, so
 * the small fixture writer is duplicated here. Pure `fs`/`path` — no
 * `@skillsmith/core` dependency (the MCP test seeds candidates via
 * `skillRepository.create`, not a file DB).
 */
/** Directory basenames produced by {@link writeSourceFixture}. */
export declare const FIXTURE_DIRS: {
    readonly git: "git-skill";
    readonly https: "https-skill";
    readonly plugin: "plugin-skill";
    readonly registry: "registry-skill";
    readonly collision: "collision-skill";
    readonly backup: "something.backup-20260101-120000";
    readonly unknown: "unknown-skill";
};
/** Canonical GitHub owner/repo carried by both git fixtures (ssh + https). */
export declare const GIT_OWNER = "wrsmith108";
export declare const GIT_REPO = "linear-claude-skill";
/**
 * Materialize the canonical fixture tree under `root`. Returns the absolute
 * directory paths keyed by {@link FIXTURE_DIRS} key.
 */
export declare function writeSourceFixture(root: string): Record<keyof typeof FIXTURE_DIRS, string>;
//# sourceMappingURL=source-recovery-fixture.d.ts.map