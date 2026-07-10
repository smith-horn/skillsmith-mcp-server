/**
 * @fileoverview Shared test fixtures for SMI-4589 Wave 3 edit-suggester /
 *               edit-applier unit tests.
 * @module @skillsmith/mcp-server/tests/unit/edit-suggester.fixtures
 *
 * Extracted from `edit-suggester.test.ts` per the 500-LOC pre-commit
 * file-length gate. The `.fixtures.ts` suffix keeps the file outside
 * vitest's `**\/*.test.ts` glob — no tests run from this module.
 */
import type { AuditId, CollisionId, InventoryAuditResult, SemanticCollisionFlag } from '../../src/audit/collision-detector.types.js';
import type { InventoryEntry } from '../../src/utils/local-inventory.types.js';
export declare const cid: (s: string) => CollisionId;
export declare const aid: (s: string) => AuditId;
/**
 * Write a stub SKILL.md to `<TEST_HOME>/.claude/skills/<identifier>/SKILL.md`.
 * Returns the absolute file path. Caller is responsible for setting
 * `process.env.HOME = TEST_HOME` before invoking — the helper does NOT
 * resolve `getCanonicalInstallPath` itself.
 */
export declare function writeSkillMd(testHome: string, args: {
    identifier: string;
    description: string;
    tag?: string;
}): string;
export declare function makeEntry(args: {
    source_path: string;
    identifier: string;
    description: string;
    tag?: string;
}): InventoryEntry;
export declare function makeSemanticFlag(args: {
    collisionId: string;
    entryA: InventoryEntry;
    entryB: InventoryEntry;
    cosineScore?: number;
}): SemanticCollisionFlag;
export declare function makeAuditResult(flags: SemanticCollisionFlag[]): InventoryAuditResult;
//# sourceMappingURL=edit-suggester.fixtures.d.ts.map