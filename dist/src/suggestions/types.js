/**
 * @fileoverview Type definitions for Contextual Skill Suggestions
 * @module @skillsmith/mcp-server/suggestions/types
 * @see SMI-913: Contextual skill suggestions after first success
 *
 * Defines interfaces for the suggestion engine that recommends relevant Tier 2 skills
 * after a user successfully uses a Tier 1 skill, based on project context.
 *
 * @example
 * import type { SkillSuggestion, SuggestionConfig, SuggestionState } from './types.js'
 *
 * const suggestion: SkillSuggestion = {
 *   skillId: 'community/docker',
 *   skillName: 'docker',
 *   reason: 'Your project uses native modules - Docker ensures consistent builds',
 *   priority: 1,
 *   contextMatch: ['hasDocker', 'hasNativeModules'],
 * }
 */
export {};
//# sourceMappingURL=types.js.map