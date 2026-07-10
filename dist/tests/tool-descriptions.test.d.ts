/**
 * SMI-4790 Wave 1 Step 1.5: Snapshot tests for MCP tool descriptions
 *
 * Each user-facing tool description must:
 * 1. Lead with the canonical bracketed prefix `[Skillsmith — <Stage> stage]`
 *    (per the lifecycle taxonomy in docs/internal/implementation/_taxonomy.md)
 * 2. Name "Skillsmith" prominently for product-name anchoring
 * 3. Stay within the ≤1024-char target (no MCP-spec hard cap; aligns with
 *    Anthropic SKILL.md frontmatter convention)
 *
 * If you change a description intentionally, update the snapshot
 * (`vitest -u`). If a snapshot mismatch surprises you, the description
 * regressed — the prefix or anchor was lost.
 */
export {};
//# sourceMappingURL=tool-descriptions.test.d.ts.map