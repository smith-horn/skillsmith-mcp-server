/**
 * @fileoverview Install Tool Types and Constants
 * @module @skillsmith/mcp-server/tools/install.types
 */
import { z } from 'zod';
import { CLIENT_IDS, getCanonicalInstallPath } from '@skillsmith/core/install';
import * as path from 'path';
import * as os from 'os';
/**
 * SMI-5982 (Wave 6) audit finding: `client`/`alsoLink` below used to hardcode
 * a 5-value literal enum (`claude-code | cursor | copilot | windsurf |
 * agents`) that predates `opencode`/`hermes` (SMI-5456) and `grok`
 * (SMI-5697) — since a `z.enum([...])` literal is NOT derived from the
 * `ClientId` type, the TypeScript compiler never caught this drift, and
 * `installInputSchema.safeParse()` (install.ts) was silently REJECTING
 * `client: "opencode"` / `"hermes"` / `"grok"` over MCP even though the CLI
 * fully supported them. Deriving the enum from `CLIENT_IDS` here (the same
 * source of truth `assertClientId` validates against) closes this class of
 * drift permanently instead of re-appending literals a 4th time.
 */
const CLIENT_ID_ENUM_VALUES = CLIENT_IDS;
// ============================================================================
// Trust Tier Validation
// ============================================================================
/**
 * SMI-1533: Valid trust tier values
 * SMI-1809: Added 'local' for local skills
 */
export const VALID_TRUST_TIERS = [
    'verified',
    'curated',
    'community',
    'local',
    'experimental',
    'unknown',
];
/**
 * SMI-1533: Validate and normalize trust tier value
 * Returns 'unknown' for invalid or missing values to ensure strictest scanning
 *
 * NOTE: 'verified' tier currently relies on registry data without cryptographic
 * verification. Future enhancement: implement signature verification for
 * Anthropic-verified skills using PKI.
 */
export function validateTrustTier(value) {
    if (!value)
        return 'unknown';
    const normalized = value.toLowerCase();
    if (!VALID_TRUST_TIERS.includes(normalized))
        return 'unknown';
    // SMI-1533: Log warning for 'verified' tier until PKI is implemented
    if (normalized === 'verified') {
        console.debug('[install] Trust tier "verified" accepted from registry. ' +
            'Note: Cryptographic signature verification not yet implemented.');
    }
    return normalized;
}
// ============================================================================
// Scanner Configuration
// ============================================================================
/**
 * SMI-1533: Security scan configuration per trust tier
 * SMI-1809: Added 'local' tier for local skills
 *
 * - verified: Minimal scanning (trust Anthropic-verified skills)
 * - community: Standard scanning (balanced security)
 * - experimental: Aggressive scanning (highest scrutiny for new/beta skills)
 * - unknown: Most aggressive scanning
 * - local: No scanning (user's own local skills)
 */
export const TRUST_TIER_SCANNER_OPTIONS = {
    official: {
        // SMI-5205: Platform/partner skills with full security review — more permissive than verified
        riskThreshold: 80, // Higher than verified (70); official tier has full Skillsmith security audit
        maxContentLength: 2_000_000, // Allow larger skills
    },
    verified: {
        // Anthropic-verified skills get minimal scanning
        riskThreshold: 70, // Higher threshold - more tolerant
        maxContentLength: 2_000_000, // Allow larger skills
    },
    curated: {
        // SMI-2381: Curated third-party publishers get near-verified scanning
        riskThreshold: 60, // Slightly stricter than verified
        maxContentLength: 2_000_000, // Same size allowance as verified
    },
    community: {
        // Standard scanning for community-reviewed skills
        riskThreshold: 40, // Default threshold
        maxContentLength: 1_000_000,
    },
    local: {
        // SMI-1809: Local skills are user's own - minimal scanning
        riskThreshold: 100, // No risk threshold for local skills
        maxContentLength: 10_000_000, // No size limit for local skills
    },
    experimental: {
        // Aggressive scanning for new/beta skills
        riskThreshold: 25, // Lower threshold - less tolerant
        maxContentLength: 500_000, // Limit skill size
    },
    unknown: {
        // Most aggressive scanning for unknown origins
        riskThreshold: 20, // Very strict
        maxContentLength: 250_000, // Very limited size
    },
    unverified: {
        // SMI-5205: Public alias for unknown — same scanning profile as unknown
        riskThreshold: 20, // Very strict
        maxContentLength: 250_000, // Very limited size
    },
};
// ============================================================================
// Input/Output Schemas
// ============================================================================
/** Input schema for install tool */
export const installInputSchema = z.object({
    skillId: z
        .string()
        .min(1)
        .max(512, 'skillId exceeds maximum length of 512 chars')
        .describe('Skill ID or GitHub URL'),
    force: z.boolean().default(false).describe('Force reinstall if exists'),
    skipScan: z.boolean().default(false).describe('Skip security scan (not recommended)'),
    /** SMI-1788: Skip optimization transformation */
    skipOptimize: z.boolean().default(false).describe('Skip Skillsmith optimization'),
    /** SMI-1864: Action to take when a conflict is detected during update */
    conflictAction: z
        .enum(['overwrite', 'merge', 'cancel'])
        .optional()
        .describe('Action to take on conflict: overwrite local, merge changes, or cancel'),
    /** SMI-3863: Confirm install of experimental/unknown tier skills */
    confirmed: z
        .boolean()
        .default(false)
        .describe('Confirm install despite security warnings (required for experimental/unknown tiers)'),
    /** SMI-4578: target client (defaults to SKILLSMITH_CLIENT env or claude-code) */
    client: z
        .enum(CLIENT_ID_ENUM_VALUES)
        .optional()
        .describe('Target agent (defaults to SKILLSMITH_CLIENT env or claude-code)'),
    /** SMI-4578: additional clients to fan-out into via copy (or symlink with --symlink) */
    alsoLink: z
        .array(z.enum(CLIENT_ID_ENUM_VALUES))
        .default([])
        .describe('Additional clients to fan-out into (default: copy)'),
    /** SMI-4578: use symlinks instead of copies for alsoLink targets */
    symlink: z
        .boolean()
        .default(false)
        .describe('Use relative symlinks instead of copies for alsoLink (POSIX only)'),
    /**
     * SMI-5982 code-review fix #1: this MCP server is long-running, so its own
     * `process.cwd()` is fixed at server launch and generally does NOT track
     * the calling editor/agent's actual project — passing this explicitly is
     * the only reliable way to place a project-scoped companion-agent output
     * (currently only Antigravity's directory-package mode) correctly.
     */
    cwd: z
        .string()
        .min(1, 'cwd must not be empty')
        .refine((v) => path.isAbsolute(v), { message: 'cwd must be an absolute path' })
        .optional()
        .describe("Absolute path to the calling client's actual project/workspace root, used to resolve " +
        'project-scoped companion-agent output (e.g. Antigravity) correctly. Optional for flat, ' +
        'absolute-path clients (unused). REQUIRED for directory-package clients (Antigravity) — ' +
        "this MCP server's own process.cwd() is fixed at server launch and does not track the " +
        "calling editor/agent's real project, so the install fails closed with a clear error " +
        'if omitted rather than silently writing to the wrong directory.'),
});
// ============================================================================
// Paths
// ============================================================================
// SMI-4578: routes through canonical install path so default-client
// directory is defined in exactly one place.
export const CLAUDE_SKILLS_DIR = getCanonicalInstallPath();
export const SKILLSMITH_DIR = path.join(os.homedir(), '.skillsmith');
export const MANIFEST_PATH = path.join(SKILLSMITH_DIR, 'manifest.json');
//# sourceMappingURL=install.types.js.map