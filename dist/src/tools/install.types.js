/**
 * @fileoverview Install Tool Types and Constants
 * @module @skillsmith/mcp-server/tools/install.types
 */
import { z } from 'zod';
import { getCanonicalInstallPath } from '@skillsmith/core/install';
import * as path from 'path';
import * as os from 'os';
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
        .enum(['claude-code', 'cursor', 'copilot', 'windsurf', 'agents'])
        .optional()
        .describe('Target agent (defaults to SKILLSMITH_CLIENT env or claude-code)'),
    /** SMI-4578: additional clients to fan-out into via copy (or symlink with --symlink) */
    alsoLink: z
        .array(z.enum(['claude-code', 'cursor', 'copilot', 'windsurf', 'agents']))
        .default([])
        .describe('Additional clients to fan-out into (default: copy)'),
    /** SMI-4578: use symlinks instead of copies for alsoLink targets */
    symlink: z
        .boolean()
        .default(false)
        .describe('Use relative symlinks instead of copies for alsoLink (POSIX only)'),
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