/**
 * Linear Issue Reporter for E2E Test Failures
 *
 * Automatically creates Linear issues when E2E tests detect problems.
 * Issues include detailed evidence for specialist agents to resolve.
 *
 * @see docs/testing/e2e-testing-plan.md
 */
import type { HardcodedIssue } from './hardcoded-detector.js';
export interface LinearIssuePayload {
    title: string;
    description: string;
    teamId?: string;
    projectId?: string;
    labelIds?: string[];
    priority?: number;
    estimate?: number;
}
export interface LinearIssueResult {
    success: boolean;
    issueId?: string;
    issueUrl?: string;
    error?: string;
}
export interface TestFailure {
    testName: string;
    testFile: string;
    command: string;
    error: string;
    stdout?: string;
    stderr?: string;
    hardcodedIssues?: HardcodedIssue[];
    duration?: number;
    timestamp: string;
}
/**
 * Create Linear issue description from test failure
 */
export declare function createIssueDescription(failure: TestFailure): string;
/**
 * Create Linear issue title from test failure
 */
export declare function createIssueTitle(failure: TestFailure): string;
/**
 * Create Linear issue via API
 */
export declare function createLinearIssue(failure: TestFailure): Promise<LinearIssueResult>;
export declare function queueIssue(failure: TestFailure): void;
export declare function getQueuedIssues(): TestFailure[];
export declare function flushIssueQueue(): Promise<LinearIssueResult[]>;
declare const _default: {
    createIssueDescription: typeof createIssueDescription;
    createIssueTitle: typeof createIssueTitle;
    createLinearIssue: typeof createLinearIssue;
    queueIssue: typeof queueIssue;
    getQueuedIssues: typeof getQueuedIssues;
    flushIssueQueue: typeof flushIssueQueue;
};
export default _default;
//# sourceMappingURL=linear-reporter.d.ts.map