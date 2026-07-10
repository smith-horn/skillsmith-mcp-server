/**
 * @fileoverview Context Detection Module Exports
 * @module @skillsmith/mcp-server/context
 * @see SMI-912: Project context detection for skill suggestions
 *
 * Re-exports all project context detection utilities for easy importing.
 *
 * @example
 * import {
 *   detectProjectContext,
 *   getSuggestedSkills,
 *   ProjectContext
 * } from './context';
 *
 * const context = detectProjectContext();
 * const skills = getSuggestedSkills(context);
 */
export { detectProjectContext, detectDocker, detectLinear, detectGitHub, detectTestFramework, detectApiFramework, detectNativeModules, detectLanguage, getSuggestedSkills, type ProjectContext, } from './project-detector.js';
//# sourceMappingURL=index.d.ts.map