/**
 * SMI-1091: Quota Helpers - Storage and utility functions for quota enforcement
 *
 * Extracted from quota.ts to reduce file size.
 *
 * @see quota.ts for main middleware implementation
 */
import type { LicenseInfo, LicenseTier } from './license.js';
import type { QuotaStorage, WarningLevel } from './quota-types.js';
/**
 * Simple in-memory storage for quota tracking
 * Note: This resets on server restart. Use a database-backed storage
 * in production via the storage option.
 */
export declare class InMemoryQuotaStorage implements QuotaStorage {
    private usage;
    getUsage(customerId: string): Promise<{
        used: number;
        periodStart: Date;
        periodEnd: Date;
    }>;
    incrementUsage(customerId: string, cost: number): Promise<void>;
    initializePeriod(customerId: string, _limit: number): Promise<void>;
    private getMonthStart;
    private getMonthEnd;
}
/**
 * Get the warning level based on percentage used
 */
export declare function getWarningLevel(percentUsed: number): WarningLevel;
/**
 * Get warning message based on level and current usage
 */
export declare function getWarningMessage(warningLevel: WarningLevel, used: number, limit: number, _tier: LicenseTier): string | undefined;
/**
 * Generate a customer ID from license info
 * Falls back to 'anonymous' for community users without an organization ID
 */
export declare function getCustomerId(licenseInfo: LicenseInfo | null, providedId?: string): string;
//# sourceMappingURL=quota-helpers.d.ts.map