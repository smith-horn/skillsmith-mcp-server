/**
 * @fileoverview Shared fake-Supabase-client test fixtures for registry-tools.live.test.ts and
 * registry-tools.live.manage.test.ts (split from one file, SMI-5949 Wave 2, to stay under the
 * 500-line audit:standards gate).
 * @see SMI-5816: Private skill registry — real implementation (ADR-129)
 *
 * No `vi.mock()` calls live here — those must stay in each actual test file (vitest hoists them
 * per test-file module graph). This file only provides plain fixtures/helpers that assume the
 * importing test file has already called `vi.mock('../supabase-client.js', ...)` and
 * `vi.mock('./team-resolver.js', ...)`.
 */
import type { ToolContext } from '../context.js';
export declare const RESOLVED_TEAM = "team-alpha";
export declare const SAMPLE_CONTENT: {
    'SKILL.md': string;
};
interface Recorded {
    table: string;
    op: 'select' | 'insert' | 'update' | 'delete';
    filters: Array<{
        column: string;
        value: unknown;
    }>;
    payload?: Record<string, unknown>;
    selectCalled: boolean;
}
type SingleResponder = () => {
    data: unknown;
    error: {
        code?: string;
        message?: string;
    } | null;
};
type ThenResponder = () => {
    data: unknown[] | null;
    error: {
        code?: string;
        message?: string;
    } | null;
};
type RpcResponder = (fn: string, params: Record<string, unknown>) => {
    data: unknown;
    error: {
        code?: string;
        message?: string;
    } | null;
};
interface FakeClientOptions {
    singleResponder?: SingleResponder;
    thenResponder?: ThenResponder;
    /**
     * Override the default RPC response for EITHER `get_private_registry_submissions` or
     * `review_private_registry_submission` (SMI-5949 D-5) — the callback receives `fn` to
     * distinguish them. Defaults (see `defaultRpc`/`defaultReviewRpc` below) cover the common
     * success shape for both, so most tests never need to set this; a test simulating an RPC
     * failure (not-admin `42501`, self-approval, terminal-state, missing `published_by` `23514`)
     * scripts one here, checking `fn` if it only wants to fail one of the two.
     */
    rpcResponder?: RpcResponder;
}
export declare function createFakeClient(opts?: FakeClientOptions): {
    client: unknown;
    calls: Recorded[];
    rpcCalls: Array<{
        fn: string;
        params: Record<string, unknown>;
    }>;
};
export declare function makeContext(): ToolContext;
/**
 * Point both client factories at one recorder.
 *
 * Since SMI-5822, deprecate/undeprecate run through the signed-in user's client while the
 * audit write still uses the service-role client, so a test touching those paths needs both.
 */
export declare function mockBothClients(client: unknown): Promise<void>;
export declare function publishedRow(overrides?: Record<string, unknown>): {
    id: string;
    team_id: string;
    skill_id: string;
    version: string;
    description: null;
    content_hash: string;
    deprecated: boolean;
    published_by: null;
    published_at: string;
    approval_status: string;
    approval_mode: string;
};
export {};
//# sourceMappingURL=registry-tools.live.test-helpers.d.ts.map