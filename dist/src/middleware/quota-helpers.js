// SPDX-License-Identifier: Elastic-2.0
// Copyright 2024-2025 Smith Horn Group Ltd
// ============================================================================
// In-Memory Storage (Default)
// ============================================================================
/**
 * Simple in-memory storage for quota tracking
 * Note: This resets on server restart. Use a database-backed storage
 * in production via the storage option.
 */
export class InMemoryQuotaStorage {
    usage = new Map();
    async getUsage(customerId) {
        const now = new Date();
        const existing = this.usage.get(customerId);
        // If we have existing data and it's still in the current period, return it
        if (existing && existing.periodEnd > now) {
            return existing;
        }
        // Otherwise, create a new period
        const periodStart = this.getMonthStart(now);
        const periodEnd = this.getMonthEnd(now);
        const newUsage = { used: 0, periodStart, periodEnd };
        this.usage.set(customerId, newUsage);
        return newUsage;
    }
    async incrementUsage(customerId, cost) {
        const usage = await this.getUsage(customerId);
        usage.used += cost;
    }
    async initializePeriod(customerId, _limit) {
        const now = new Date();
        this.usage.set(customerId, {
            used: 0,
            periodStart: this.getMonthStart(now),
            periodEnd: this.getMonthEnd(now),
        });
    }
    getMonthStart(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }
    getMonthEnd(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 1);
    }
}
// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Get the warning level based on percentage used
 */
export function getWarningLevel(percentUsed) {
    if (percentUsed >= 100)
        return 100;
    if (percentUsed >= 90)
        return 90;
    if (percentUsed >= 80)
        return 80;
    return 0;
}
/**
 * Get warning message based on level and current usage
 */
export function getWarningMessage(warningLevel, used, limit, _tier) {
    if (warningLevel === 0)
        return undefined;
    const remaining = Math.max(0, limit - used);
    switch (warningLevel) {
        case 100:
            return `API quota exceeded (${used.toLocaleString()}/${limit.toLocaleString()} calls). Upgrade to continue.`;
        case 90:
            return `Warning: 90% of API quota used (${remaining.toLocaleString()} calls remaining). Consider upgrading.`;
        case 80:
            return `Notice: 80% of API quota used (${remaining.toLocaleString()} calls remaining).`;
        default:
            return undefined;
    }
}
/**
 * Generate a customer ID from license info
 * Falls back to 'anonymous' for community users without an organization ID
 */
export function getCustomerId(licenseInfo, providedId) {
    if (providedId)
        return providedId;
    if (licenseInfo?.organizationId)
        return licenseInfo.organizationId;
    return 'anonymous';
}
//# sourceMappingURL=quota-helpers.js.map