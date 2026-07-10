/**
 * SMI-616: Integration Test Setup
 * SMI-903: Expanded to 56 test skills across all categories and trust tiers
 * Provides test utilities for integration testing with real database and filesystem
 */
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { createDatabase, closeDatabase, SkillRepository, CoInstallRepository, SkillDependencyRepository, SearchService, SkillsmithApiClient, } from '@skillsmith/core';
import { seedTestSkills } from './fixtures/test-skills.js';
// Re-export for test access
export { TEST_SKILLS, TEST_SKILLS_STATS } from './fixtures/test-skills.js';
/**
 * Create an in-memory test database with sample data
 * Seeds 56 skills across all categories and trust tiers for realistic testing
 * SMI-1183: Creates apiClient in offline mode for local-only testing
 */
export async function createTestDatabase() {
    const db = createDatabase(':memory:');
    const skillRepository = new SkillRepository(db);
    const coInstallRepository = new CoInstallRepository(db);
    const skillDependencyRepository = new SkillDependencyRepository(db);
    const searchService = new SearchService(db);
    // SMI-1183: Create API client in offline mode for tests
    // Tests use local database, not live API
    const apiClient = new SkillsmithApiClient({
        offlineMode: true,
    });
    // Seed with comprehensive test data (56 skills)
    seedTestSkills(skillRepository);
    return {
        db,
        skillRepository,
        coInstallRepository,
        skillDependencyRepository,
        sessionInstalledSkillIds: [],
        searchService,
        apiClient,
        cleanup: async () => {
            closeDatabase(db);
        },
    };
}
/**
 * Create temporary directories for filesystem tests
 */
export async function createTestFilesystem() {
    const tempDir = path.join(os.tmpdir(), `skillsmith-test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    const skillsDir = path.join(tempDir, '.claude', 'skills');
    const manifestDir = path.join(tempDir, '.skillsmith');
    await fs.mkdir(skillsDir, { recursive: true });
    await fs.mkdir(manifestDir, { recursive: true });
    return {
        tempDir,
        skillsDir,
        manifestDir,
        cleanup: async () => {
            try {
                await fs.rm(tempDir, { recursive: true, force: true });
            }
            catch {
                // Ignore cleanup errors
            }
        },
    };
}
/**
 * Create a mock skill manifest
 */
export async function createMockManifest(manifestDir, skills = {}) {
    const manifest = {
        version: '1.0.0',
        installedSkills: skills,
    };
    await fs.writeFile(path.join(manifestDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
}
/**
 * Create a mock installed skill
 */
export async function createMockInstalledSkill(skillsDir, skillName, content = '# Mock Skill\n\nThis is a mock skill for testing purposes with enough content to pass validation.') {
    const skillPath = path.join(skillsDir, skillName);
    await fs.mkdir(skillPath, { recursive: true });
    await fs.writeFile(path.join(skillPath, 'SKILL.md'), content);
    return skillPath;
}
/**
 * Mock GitHub fetch for install tests
 */
export function createMockGitHubFetch(mockResponses) {
    return async (input, _init) => {
        const url = typeof input === 'string' ? input : input.toString();
        for (const [pattern, response] of Object.entries(mockResponses)) {
            if (url.includes(pattern)) {
                return new Response(response.body ?? '', {
                    status: response.status,
                    headers: { 'Content-Type': 'text/plain' },
                });
            }
        }
        // Default 404 response
        return new Response('Not Found', { status: 404 });
    };
}
/**
 * Wait for a condition to be true
 */
export async function waitFor(condition, timeout = 5000, interval = 100) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
        if (await condition()) {
            return;
        }
        await new Promise((resolve) => setTimeout(resolve, interval));
    }
    throw new Error('Timeout waiting for condition');
}
/**
 * Check if a file exists
 */
export async function fileExists(filePath) {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Read JSON file
 */
export async function readJsonFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
}
//# sourceMappingURL=setup.js.map