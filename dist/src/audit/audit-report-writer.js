/**
 * @fileoverview Markdown audit-report writer for SMI-4587 Wave 1 Step 7/8.
 * @module @skillsmith/mcp-server/audit/audit-report-writer
 *
 * Renders an `InventoryAuditResult` into the markdown report stored at
 * `~/.skillsmith/audits/<auditId>/report.md`. Atomic via tmp-file +
 * `fs.rename` (mirrors `audit-history.ts`).
 *
 * Sections, in order (plan §446):
 *   1. Summary header — auditId, generated-at, totals
 *   2. CLAUDE.md scan caveat — only when any inventory entry is
 *      `kind: 'claude_md_rule'` (D-ANTI-1)
 *   3. Exact collisions — each lists involved entries with absolute paths
 *   4. Generic flags — matched tokens, suggested rename if any
 *   5. Semantic collisions — cosine score, overlapping phrases
 *   6. Recommended edits — Wave 3 plumbing; Wave 1 emits a placeholder
 *
 * Wave 2/4 import this writer via `@skillsmith/mcp-server/audit` (Step 9
 * barrel).
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
/**
 * Render an `InventoryAuditResult` into the audit-report markdown body.
 * Pure — no IO. Exposed so tests can inspect the output without round-
 * tripping through the filesystem.
 */
export function renderAuditReport(result, opts = {}) {
    const generatedAt = opts.generatedAt ?? new Date();
    const sections = [];
    sections.push(renderSummaryHeader(result, generatedAt));
    if (containsClaudeMdRule(result)) {
        sections.push(renderClaudeMdCaveat());
    }
    if (result.exactCollisions.length > 0) {
        sections.push(renderExactCollisions(result.exactCollisions));
    }
    if (result.genericFlags.length > 0) {
        sections.push(renderGenericFlags(result.genericFlags));
    }
    if (result.semanticCollisions.length > 0) {
        sections.push(renderSemanticCollisions(result.semanticCollisions));
    }
    sections.push(renderRecommendedEdits(opts.renameSuggestions, result.auditId));
    // SMI-4589 Wave 3: prose-edit suggestions render in their own section
    // immediately after the Wave 2 rename-suggestion section. Empty input
    // omits the section entirely (no placeholder text — keeps the report
    // tight when no semantic collisions fired).
    if (opts.recommendedEdits && opts.recommendedEdits.length > 0) {
        sections.push(renderRecommendedEditsSection(opts.recommendedEdits));
    }
    // Single trailing newline. `trimEnd()` (not `/\n+$/`) is intentional —
    // see SMI-4733: any non-`\n` trailing whitespace that leaks in is
    // acceptable to strip in an ASCII report, and the non-regex form
    // sidesteps polynomial backtracking flagged by CodeQL.
    return sections.join('\n').trimEnd() + '\n';
}
/**
 * Persist the rendered report to `<auditDir>/report.md`. Atomic via
 * tmp-file + `fs.rename`, matching the audit-history writer's contract so
 * concurrent readers never observe a partially-written file.
 */
export async function writeAuditReport(result, opts) {
    const reportPath = path.join(opts.auditDir, 'report.md');
    const tmpPath = `${reportPath}.tmp`;
    await fs.mkdir(opts.auditDir, { recursive: true });
    const body = renderAuditReport(result, {
        generatedAt: opts.generatedAt,
        renameSuggestions: opts.renameSuggestions,
        recommendedEdits: opts.recommendedEdits,
    });
    await fs.writeFile(tmpPath, body, 'utf-8');
    await fs.rename(tmpPath, reportPath);
    return { reportPath };
}
// ---------------------------------------------------------------------------
// Section renderers
// ---------------------------------------------------------------------------
function renderSummaryHeader(result, generatedAt) {
    const lines = [];
    lines.push(`# Skillsmith Namespace Audit — ${result.auditId}`);
    lines.push('');
    lines.push(`- Generated: ${generatedAt.toISOString()}`);
    lines.push(`- Total entries scanned: ${result.summary.totalEntries}`);
    lines.push(`- Total flags: ${result.summary.totalFlags}`);
    lines.push(`  - Errors (exact collisions): ${result.summary.errorCount}`);
    lines.push(`  - Warnings (generic + semantic): ${result.summary.warningCount}`);
    lines.push(`- Audit duration: ${result.summary.durationMs.toFixed(2)}ms`);
    lines.push('');
    return lines.join('\n');
}
function renderClaudeMdCaveat() {
    const lines = [];
    lines.push('## CLAUDE.md scan caveat');
    lines.push('');
    lines.push('This audit included trigger phrases extracted from `CLAUDE.md` rules. ');
    lines.push('Phrase extraction is heuristic — false-positives are possible when a ');
    lines.push('rule is phrased imperatively ("when X, do Y") without intending to ');
    lines.push('overlap with a skill trigger. Review collisions involving ');
    lines.push('`claude_md_rule` entries before applying any rename.');
    lines.push('');
    return lines.join('\n');
}
function renderExactCollisions(flags) {
    const lines = [];
    lines.push('## Exact collisions');
    lines.push('');
    for (const flag of flags) {
        lines.push(`### \`${flag.identifier}\` (${flag.entries.length} entries)`);
        lines.push('');
        lines.push(`- Severity: **${flag.severity}**`);
        lines.push(`- Collision id: \`${flag.collisionId}\``);
        lines.push(`- Reason: ${flag.reason}`);
        lines.push('- Involved entries:');
        for (const entry of flag.entries) {
            lines.push(`  - [${entry.kind}] ${entry.source_path}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
function renderGenericFlags(flags) {
    const lines = [];
    lines.push('## Generic-token flags');
    lines.push('');
    for (const flag of flags) {
        lines.push(`### \`${flag.identifier}\``);
        lines.push('');
        lines.push(`- Severity: **${flag.severity}**`);
        lines.push(`- Collision id: \`${flag.collisionId}\``);
        lines.push(`- Source: ${flag.entry.source_path}`);
        lines.push(`- Matched generic tokens: ${formatTokens(flag.matchedTokens)}`);
        lines.push(`- Reason: ${flag.reason}`);
        lines.push('');
    }
    return lines.join('\n');
}
function renderSemanticCollisions(flags) {
    const lines = [];
    lines.push('## Semantic collisions');
    lines.push('');
    for (const flag of flags) {
        lines.push(`### ${describeEntry(flag.entryA)} ↔ ${describeEntry(flag.entryB)}`);
        lines.push('');
        lines.push(`- Severity: **${flag.severity}**`);
        lines.push(`- Collision id: \`${flag.collisionId}\``);
        lines.push(`- Cosine score: ${flag.cosineScore.toFixed(3)}`);
        lines.push(`- Reason: ${flag.reason}`);
        lines.push(`- Entry A: ${flag.entryA.source_path}`);
        lines.push(`- Entry B: ${flag.entryB.source_path}`);
        if (flag.overlappingPhrases.length > 0) {
            lines.push('- Overlapping phrases:');
            for (const pair of flag.overlappingPhrases) {
                lines.push(`  - "${pair.phrase1}" ↔ "${pair.phrase2}" (sim ${pair.similarity.toFixed(3)})`);
            }
        }
        lines.push('');
    }
    return lines.join('\n');
}
function renderRecommendedEdits(suggestions, auditId) {
    const lines = [];
    lines.push('## Recommended edits');
    lines.push('');
    if (!suggestions || suggestions.length === 0) {
        // Wave 1 placeholder preserved for backward compatibility — no
        // suggestion data was passed in.
        lines.push('_No automated edits suggested in Wave 1._');
        lines.push('');
        return lines.join('\n');
    }
    // Wave 2 PR #4 (Step 8): render a markdown table of rename suggestions
    // with copy-paste-ready CLI invocations. Wave 4 wires the actual CLI;
    // this writer just renders the suggestion text.
    lines.push('| Current name | Suggested rename | Apply action | Apply command |');
    lines.push('|---|---|---|---|');
    for (const suggestion of suggestions) {
        const cmd = `\`sklx audit collisions apply ${auditId} ${suggestion.collisionId}\``;
        lines.push(`| \`${suggestion.currentName}\` | \`${suggestion.suggested}\` | ${suggestion.applyAction} | ${cmd} |`);
    }
    lines.push('');
    for (const suggestion of suggestions) {
        lines.push(`### \`${suggestion.currentName}\` → \`${suggestion.suggested}\``);
        lines.push('');
        lines.push(`- Collision id: \`${suggestion.collisionId}\``);
        lines.push(`- Reason: ${suggestion.reason}`);
        lines.push(`- Source: ${suggestion.entry.source_path}`);
        lines.push('');
    }
    return lines.join('\n');
}
/**
 * SMI-4589 Wave 3: render the prose-edit suggestions section. Each edit
 * becomes a markdown block with file/lineRange metadata and a `diff`
 * fenced code block showing the before/after pair with `-`/`+` line
 * prefixes — renders with syntax highlighting in GitHub / VSCode.
 *
 * Plan §2 mandates the diff block format over separate before/after
 * plain-text blocks because the unified-diff form gives free
 * highlighting and a familiar review surface.
 */
function renderRecommendedEditsSection(edits) {
    const lines = [];
    lines.push('## Recommended Edits');
    lines.push('');
    for (const edit of edits) {
        lines.push(`### Recommended edit: differentiate from \`${edit.otherEntry.identifier}\``);
        lines.push('');
        lines.push(`**File**: \`${edit.filePath}\``);
        lines.push(`**Lines**: ${edit.lineRange.start}-${edit.lineRange.end}`);
        lines.push(`**Pattern**: \`${edit.pattern}\` (${edit.applyMode})`);
        lines.push('');
        lines.push('```diff');
        for (const beforeLine of edit.before.split('\n')) {
            lines.push(`-${beforeLine}`);
        }
        for (const afterLine of edit.after.split('\n')) {
            lines.push(`+${afterLine}`);
        }
        lines.push('```');
        lines.push('');
        lines.push(`**Why**: ${edit.rationale}`);
        lines.push('');
    }
    return lines.join('\n');
}
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function containsClaudeMdRule(result) {
    return result.inventory.some((e) => e.kind === 'claude_md_rule');
}
function describeEntry(entry) {
    return `\`${entry.identifier}\` (${entry.kind})`;
}
function formatTokens(tokens) {
    if (tokens.length === 0)
        return '_none_';
    return tokens.map((t) => `\`${t}\``).join(', ');
}
//# sourceMappingURL=audit-report-writer.js.map