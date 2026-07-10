/**
 * Test utilities for MCP server tests
 * @see SMI-792: Database initialization
 * @see SMI-4240: createApiMockContext for API-path coverage
 * @see SMI-4756: async factory functions for WASM fallback in post-merge-verify CI
 */
import { createToolContextAsync, closeToolContext } from '../context.js';
/**
 * SMI-4694: Symmetric disposer for `createTestContext` /
 * `createSeededTestContext` / `createApiMockContext`. Calls
 * `closeToolContext` to remove signal handlers, stop background sync,
 * close the LLM failover chain, and close the database. Tests using any
 * of the test-utils factories MUST call this in `afterAll`/`afterEach`
 * to prevent SIGTERM/SIGINT handler accumulation.
 *
 * Replaces ad-hoc `context.db.close()` patterns that bypassed the
 * cleanup in `closeToolContext`.
 */
export async function disposeTestContext(context) {
    await closeToolContext(context);
}
/**
 * Create a test context with in-memory database
 * SMI-1183: Uses offline mode to avoid API calls during tests
 * SMI-4756: Async to use WASM fallback when better-sqlite3 native is unavailable
 */
export async function createTestContext() {
    return createToolContextAsync({
        dbPath: ':memory:',
        apiClientConfig: { offlineMode: true },
    });
}
/**
 * Seed test data into the context
 */
export function seedTestData(context) {
    const { skillRepository } = context;
    // Add test skills
    skillRepository.create({
        id: 'anthropic/commit',
        name: 'commit',
        description: 'Generate semantic commit messages following conventional commits',
        author: 'anthropic',
        repoUrl: 'https://github.com/anthropics/claude-code-skills',
        qualityScore: 0.95,
        trustTier: 'verified',
        tags: ['git', 'commit', 'conventional-commits', 'automation'],
    });
    skillRepository.create({
        id: 'anthropic/review-pr',
        name: 'review-pr',
        description: 'Review pull requests with detailed code analysis',
        author: 'anthropic',
        repoUrl: 'https://github.com/anthropics/claude-code-skills-pr',
        qualityScore: 0.93,
        trustTier: 'verified',
        tags: ['git', 'pull-request', 'code-review', 'quality'],
    });
    skillRepository.create({
        id: 'community/jest-helper',
        name: 'jest-helper',
        description: 'Generate Jest test cases for React components',
        author: 'community',
        repoUrl: 'https://github.com/skillsmith-community/jest-helper',
        qualityScore: 0.87,
        trustTier: 'community',
        tags: ['jest', 'testing', 'react', 'unit-tests'],
    });
    skillRepository.create({
        id: 'community/vitest-helper',
        name: 'vitest-helper',
        description: 'Generate Vitest test cases with modern testing patterns',
        author: 'community',
        repoUrl: 'https://github.com/skillsmith-community/vitest-helper',
        qualityScore: 0.85,
        trustTier: 'community',
        tags: ['vitest', 'testing', 'typescript', 'unit-tests'],
    });
    skillRepository.create({
        id: 'community/docker-compose',
        name: 'docker-compose',
        description: 'Generate and manage Docker Compose configurations',
        author: 'community',
        repoUrl: 'https://github.com/skillsmith-community/docker-compose',
        qualityScore: 0.84,
        trustTier: 'community',
        tags: ['docker', 'devops', 'containers', 'infrastructure'],
    });
    skillRepository.create({
        id: 'community/api-docs',
        name: 'api-docs',
        description: 'Generate OpenAPI documentation from code',
        author: 'community',
        repoUrl: 'https://github.com/skillsmith-community/api-docs',
        qualityScore: 0.78,
        trustTier: 'experimental',
        tags: ['documentation', 'openapi', 'api'],
    });
}
/**
 * Create a seeded test context
 * SMI-4756: Async to use WASM fallback when better-sqlite3 native is unavailable
 */
export async function createSeededTestContext() {
    const context = await createTestContext();
    seedTestData(context);
    return context;
}
/**
 * SMI-4240: Create a ToolContext wired to an in-memory apiClient mock so
 * get-skill / search / recommend tests can exercise the API path
 * (`!isOffline()` branch) without touching the network.
 *
 * Pass a partial `ApiSkill`; defaults are filled in to satisfy the real
 * response validators. If the test calls `apiClient.getSkill(id)` with
 * an ID that doesn't match the fixture, the mock throws an Error whose
 * message matches the API client's own "Skill not found" shape so the
 * tool's fallback logic behaves identically to production.
 */
export async function createApiMockContext(opts) {
    const context = await createToolContextAsync({
        dbPath: ':memory:',
        apiClientConfig: { offlineMode: false },
    });
    const fixture = {
        id: opts.apiSkill.id,
        name: opts.apiSkill.name,
        description: opts.apiSkill.description ?? null,
        author: opts.apiSkill.author ?? null,
        repo_url: opts.apiSkill.repo_url ?? null,
        quality_score: opts.apiSkill.quality_score ?? null,
        trust_tier: opts.apiSkill.trust_tier ?? 'community',
        tags: opts.apiSkill.tags ?? [],
        stars: opts.apiSkill.stars ?? null,
        created_at: opts.apiSkill.created_at ?? '2026-01-01T00:00:00.000Z',
        updated_at: opts.apiSkill.updated_at ?? '2026-01-01T00:00:00.000Z',
        categories: opts.categories ?? opts.apiSkill.categories ?? [],
        security_score: opts.apiSkill.security_score,
        last_scanned_at: opts.apiSkill.last_scanned_at,
        security_findings: opts.apiSkill.security_findings,
        quarantined: opts.apiSkill.quarantined,
    };
    const apiClient = context.apiClient;
    apiClient.isOffline = () => false;
    apiClient.getSkill = async (id) => {
        if (id !== fixture.id) {
            throw new Error(`[mock] Skill "${id}" not found`);
        }
        return { data: fixture };
    };
    return context;
}
//# sourceMappingURL=test-utils.js.map