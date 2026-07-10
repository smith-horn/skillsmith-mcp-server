/**
 * SMI-992: Shared Test Utilities for Date/Time Mocking
 *
 * Provides consistent date mocking utilities to eliminate flaky tests
 * caused by timing dependencies on Date.now() and new Date() calls.
 */
/**
 * Fixed timestamp for deterministic testing - January 15, 2024 at 10:00 UTC
 */
export declare const FIXED_TIMESTAMP = 1705312800000;
/**
 * Fixed date object for deterministic testing
 */
export declare const FIXED_DATE: Date;
/**
 * Fixed ISO string for deterministic testing
 */
export declare const FIXED_DATE_ISO: string;
/**
 * One day in milliseconds
 */
export declare const ONE_DAY_MS: number;
/**
 * One year in milliseconds (365 days)
 */
export declare const ONE_YEAR_MS: number;
/**
 * Creates a date relative to FIXED_DATE
 * @param daysOffset - Number of days to add (negative for past dates)
 * @returns Date object
 */
export declare function createRelativeDate(daysOffset: number): Date;
/**
 * Creates an ISO date string relative to FIXED_DATE
 * @param daysOffset - Number of days to add (negative for past dates)
 * @returns ISO date string
 */
export declare function createRelativeDateISO(daysOffset: number): string;
/**
 * Sets up fake timers with FIXED_DATE for the current test suite.
 * Call in beforeEach() and pair with cleanupFakeTimers() in afterEach().
 */
export declare function setupFakeTimers(): void;
/**
 * Cleans up fake timers after tests.
 * Call in afterEach() when paired with setupFakeTimers().
 */
export declare function cleanupFakeTimers(): void;
/**
 * Helper to advance fake timers by a specified amount
 * @param ms - Milliseconds to advance
 */
export declare function advanceTime(ms: number): void;
/**
 * Helper to advance fake timers by a number of days
 * @param days - Days to advance
 */
export declare function advanceTimeByDays(days: number): void;
/**
 * Creates a unique test directory path with deterministic naming
 * @param prefix - Prefix for the directory name
 * @param counter - A counter to ensure uniqueness within the test
 */
export declare function createTestDirPath(prefix: string, counter: number): string;
/**
 * Decorator to set up and tear down fake timers for a describe block.
 * Usage:
 *   withFakeTimers(() => {
 *     beforeEach(() => { ... })
 *     it('test', () => { ... })
 *   })
 */
export declare function withFakeTimers(fn: () => void): void;
//# sourceMappingURL=test-utils.d.ts.map