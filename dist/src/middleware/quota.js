// SPDX-License-Identifier: Elastic-2.0
// Copyright 2024-2025 Smith Horn Group Ltd
import { buildQuotaExceededResponse } from './errorFormatter.js';
// Import helpers from quota-helpers.ts
import { InMemoryQuotaStorage, getWarningLevel, getWarningMessage, getCustomerId, } from './quota-helpers.js';
// ============================================================================
// Configuration
// ============================================================================
/**
 * Tier quota limits (API calls per month)
 * -1 represents unlimited
 */
const TIER_QUOTAS = {
    community: 1_000,
    individual: 10_000,
    team: 100_000,
    enterprise: -1, // Unlimited
};
/**
 * Configuration for the upgrade URL
 */
const UPGRADE_URL = 'https://skillsmith.app/upgrade';
// ============================================================================
// Quota Middleware Factory
// ============================================================================
/**
 * Create a quota enforcement middleware
 *
 * @param options - Configuration options
 * @returns Quota middleware instance
 *
 * @example
 * ```typescript
 * import { createQuotaMiddleware } from './middleware/quota.js';
 * import { createLicenseMiddleware } from './middleware/license.js';
 *
 * const licenseMiddleware = createLicenseMiddleware();
 * const quotaMiddleware = createQuotaMiddleware();
 *
 * // In tool handler:
 * async function handleTool(toolName: string, params: unknown) {
 *   const licenseInfo = await licenseMiddleware.getLicenseInfo();
 *   const quotaResult = await quotaMiddleware.checkAndTrack(toolName, licenseInfo);
 *
 *   if (!quotaResult.allowed) {
 *     return quotaMiddleware.buildExceededResponse(quotaResult);
 *   }
 *
 *   // Execute tool...
 *   const result = await executeTool(toolName, params);
 *
 *   // Add quota metadata to response
 *   return {
 *     ...result,
 *     _meta: {
 *       ...result._meta,
 *       quota: quotaMiddleware.buildMetadata(quotaResult),
 *     },
 *   };
 * }
 * ```
 */
export function createQuotaMiddleware(options = {}) {
    const { defaultCost = 1, trackUnlimited = false, storage = new InMemoryQuotaStorage() } = options;
    async function checkAndTrack(toolName, licenseInfo, customerId) {
        const tier = licenseInfo?.tier ?? 'community';
        const limit = TIER_QUOTAS[tier];
        const effectiveCustomerId = getCustomerId(licenseInfo, customerId);
        // Enterprise tier has unlimited quota
        if (limit === -1) {
            if (trackUnlimited) {
                await storage.incrementUsage(effectiveCustomerId, defaultCost);
            }
            return {
                allowed: true,
                remaining: -1,
                limit: -1,
                percentUsed: 0,
                warningLevel: 0,
                resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            };
        }
        // Get current usage
        const usage = await storage.getUsage(effectiveCustomerId);
        const currentUsed = usage.used;
        const newUsed = currentUsed + defaultCost;
        // Check if quota would be exceeded
        if (newUsed > limit) {
            const percentUsed = (currentUsed / limit) * 100;
            return {
                allowed: false,
                remaining: Math.max(0, limit - currentUsed),
                limit,
                percentUsed,
                warningLevel: 100,
                resetAt: usage.periodEnd,
                message: getWarningMessage(100, currentUsed, limit, tier),
                upgradeUrl: `${UPGRADE_URL}?reason=quota_exceeded&tier=${tier}`,
            };
        }
        // Increment usage
        await storage.incrementUsage(effectiveCustomerId, defaultCost);
        // Calculate warning level
        const percentUsed = (newUsed / limit) * 100;
        const warningLevel = getWarningLevel(percentUsed);
        return {
            allowed: true,
            remaining: limit - newUsed,
            limit,
            percentUsed,
            warningLevel,
            resetAt: usage.periodEnd,
            message: getWarningMessage(warningLevel, newUsed, limit, tier),
            upgradeUrl: warningLevel >= 90 ? `${UPGRADE_URL}?reason=quota_warning&tier=${tier}` : undefined,
        };
    }
    async function getStatus(licenseInfo, customerId) {
        const tier = licenseInfo?.tier ?? 'community';
        const limit = TIER_QUOTAS[tier];
        const effectiveCustomerId = getCustomerId(licenseInfo, customerId);
        // Enterprise tier has unlimited quota
        if (limit === -1) {
            return {
                allowed: true,
                remaining: -1,
                limit: -1,
                percentUsed: 0,
                warningLevel: 0,
                resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            };
        }
        // Get current usage without incrementing
        const usage = await storage.getUsage(effectiveCustomerId);
        const percentUsed = (usage.used / limit) * 100;
        const warningLevel = getWarningLevel(percentUsed);
        return {
            allowed: usage.used < limit,
            remaining: Math.max(0, limit - usage.used),
            limit,
            percentUsed,
            warningLevel,
            resetAt: usage.periodEnd,
            message: getWarningMessage(warningLevel, usage.used, limit, tier),
            upgradeUrl: warningLevel >= 90 ? `${UPGRADE_URL}?reason=quota_warning&tier=${tier}` : undefined,
        };
    }
    function buildMetadata(result) {
        return {
            remaining: result.remaining,
            limit: result.limit,
            resetAt: result.resetAt.toISOString(),
            warning: result.message,
        };
    }
    function buildExceededResponse(result) {
        const used = result.limit - result.remaining;
        return buildQuotaExceededResponse('API calls', used, result.limit);
    }
    return {
        checkAndTrack,
        getStatus,
        buildMetadata,
        buildExceededResponse,
    };
}
// ============================================================================
// Higher-Order Function for Tool Wrapping
// ============================================================================
/**
 * Wrap a tool handler with quota enforcement
 *
 * @param handler - The original tool handler
 * @param licenseMiddleware - License middleware instance
 * @param quotaMiddleware - Quota middleware instance
 * @returns Wrapped handler with quota enforcement
 *
 * @example
 * ```typescript
 * const searchHandler = withQuotaEnforcement(
 *   originalSearchHandler,
 *   licenseMiddleware,
 *   quotaMiddleware
 * );
 * ```
 */
export function withQuotaEnforcement(handler, licenseMiddleware, quotaMiddleware) {
    return async (toolName, params) => {
        const licenseInfo = await licenseMiddleware.getLicenseInfo();
        const quotaResult = await quotaMiddleware.checkAndTrack(toolName, licenseInfo);
        if (!quotaResult.allowed) {
            return quotaMiddleware.buildExceededResponse(quotaResult);
        }
        // Execute the original handler
        const result = await handler(params);
        // Note: In a real implementation, you would add quota metadata to the result
        // This requires knowing the result structure, which varies by tool
        return result;
    };
}
// ============================================================================
// Utility Functions
// ============================================================================
/**
 * Check if a tier has unlimited quota
 */
export function isUnlimitedTier(tier) {
    return TIER_QUOTAS[tier] === -1;
}
/**
 * Get the quota limit for a tier
 */
export function getQuotaLimit(tier) {
    return TIER_QUOTAS[tier];
}
/**
 * Format quota remaining for display
 */
export function formatQuotaRemaining(remaining, limit) {
    if (limit === -1) {
        return 'Unlimited';
    }
    return `${remaining.toLocaleString()} / ${limit.toLocaleString()}`;
}
//# sourceMappingURL=quota.js.map