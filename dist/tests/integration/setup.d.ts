/**
 * SMI-616: Integration Test Setup
 * SMI-903: Expanded to 56 test skills across all categories and trust tiers
 * Provides test utilities for integration testing with real database and filesystem
 */
import { SkillRepository, CoInstallRepository, SkillDependencyRepository, SearchService, SkillsmithApiClient, type DatabaseType } from '@skillsmith/core';
export { TEST_SKILLS, TEST_SKILLS_STATS } from './fixtures/test-skills.js';
/**
 * Test database context
 * SMI-1183: Added apiClient for API integration tests
 */
export interface TestDatabaseContext {
    db: DatabaseType;
    skillRepository: SkillRepository;
    coInstallRepository: CoInstallRepository;
    skillDependencyRepository: SkillDependencyRepository;
    sessionInstalledSkillIds: string[];
    searchService: SearchService;
    apiClient: SkillsmithApiClient;
    cleanup: () => Promise<void>;
}
/**
 * Create an in-memory test database with sample data
 * Seeds 56 skills across all categories and trust tiers for realistic testing
 * SMI-1183: Creates apiClient in offline mode for local-only testing
 */
export declare function createTestDatabase(): Promise<TestDatabaseContext>;
/**
 * Test filesystem context
 */
export interface TestFilesystemContext {
    tempDir: string;
    skillsDir: string;
    manifestDir: string;
    /**
     * SMI-6343 Wave 1: the isolated `manifest.json` path inside `manifestDir`.
     * Pass THIS to anything that would otherwise default its manifest path to
     * `os.homedir()` (SkillInstallationService, ManifestManager, the
     * `resolveScopedSkillsDir` mock). `manifestDir` is kept for the existing
     * callers that build the same path by hand; new tests should use
     * `manifestPath` so the isolated path is the path of least resistance.
     */
    manifestPath: string;
    cleanup: () => Promise<void>;
}
/**
 * SMI-6343 Wave 1: allocate an isolated manifest path for a test.
 *
 * The manifest-writing surfaces (`SkillInstallationService`, `installSkill`,
 * `backfillManifest`, `new ManifestManager`) all fall back to
 * `path.join(os.homedir(), '.skillsmith', 'manifest.json')` when no explicit
 * path is supplied — which, on a host (non-Docker) vitest run, is the
 * developer's real manifest. `vitest.setup.ts` sandboxes `$HOME` so that
 * fallback is no longer destructive, and `ManifestManager` refuses real-home
 * paths under `VITEST` — but a test should still name its own path rather than
 * rely on either backstop.
 *
 * @param baseDir Directory to place `manifest.json` in. Defaults to a fresh
 *   `os.tmpdir()` directory, created for the caller.
 */
export declare function createIsolatedManifestPath(baseDir?: string): Promise<string>;
/**
 * Create temporary directories for filesystem tests
 */
export declare function createTestFilesystem(): Promise<TestFilesystemContext>;
/**
 * Create a mock skill manifest
 */
export declare function createMockManifest(manifestDir: string, skills?: Record<string, {
    id: string;
    name: string;
    version: string;
    source: string;
    installPath: string;
    installedAt: string;
    lastUpdated: string;
}>): Promise<void>;
/**
 * Create a mock installed skill
 */
export declare function createMockInstalledSkill(skillsDir: string, skillName: string, content?: string): Promise<string>;
/**
 * Mock GitHub fetch for install tests
 */
export declare function createMockGitHubFetch(mockResponses: Record<string, {
    status: number;
    body?: string;
}>): typeof globalThis.fetch;
/**
 * Wait for a condition to be true
 */
export declare function waitFor(condition: () => boolean | Promise<boolean>, timeout?: number, interval?: number): Promise<void>;
/**
 * Check if a file exists
 */
export declare function fileExists(filePath: string): Promise<boolean>;
/**
 * Read JSON file
 */
export declare function readJsonFile<T>(filePath: string): Promise<T>;
//# sourceMappingURL=setup.d.ts.map