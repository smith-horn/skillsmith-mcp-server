import type { ValidationError } from './validate.types.js';
/**
 * Scan the bundled sibling files in a local skill directory the same way the
 * install path does, returning a ValidationError per rejectable file. Doc and
 * config classes are skipped (docs quote attack strings; config.json has its own
 * structural validation). A missing sibling is a silent skip. package.json is
 * scanned KEY-LEVEL (lifecycle hook values only).
 *
 * @param skillPath absolute path to the skill directory
 * @param riskThreshold scanner threshold (default 40 — community tier; validate
 *   has no trust-tier context)
 */
export declare function scanBundledSiblings(skillPath: string, riskThreshold?: number): Promise<ValidationError[]>;
//# sourceMappingURL=validate-bundled-scan.d.ts.map