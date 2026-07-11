/**
 * @fileoverview Type vocabulary for the local security audit (SMI-5541 Wave
 *               2C, Option 1 — client-side continuous audit engine).
 * @module @skillsmith/mcp-server/audit/security-audit.types
 *
 * The security audit is the PRODUCER that feeds the shipped 2A comparator
 * (`compareScanReports`, SMI-5535). It scans each installed skill's on-disk
 * content with `@skillsmith/core`'s `SecurityScanner`, compares the current
 * `ScanReport` against a per-skill baseline persisted across runs, and emits
 * one finding per skill whose security posture is hostile / suspicious /
 * currently-failing. Mirrors `rot-detector.types.ts`'s shape (a finding type
 * plus an options type) so the report writer + digest can consume it
 * uniformly.
 */
export {};
//# sourceMappingURL=security-audit.types.js.map