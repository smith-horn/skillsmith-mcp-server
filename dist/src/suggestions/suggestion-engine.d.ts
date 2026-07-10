/**
 * @fileoverview Contextual Skill Suggestion Engine
 * @module @skillsmith/mcp-server/suggestions/suggestion-engine
 * @see SMI-913: Contextual skill suggestions after first success
 *
 * Provides intelligent skill recommendations based on project context detection.
 * Implements rate limiting, opt-out functionality, and persistent state management.
 *
 * @example
 * import { SuggestionEngine } from './suggestion-engine.js'
 * import { detectProjectContext } from '../context/project-detector.js'
 *
 * const engine = new SuggestionEngine()
 * const context = detectProjectContext()
 * const suggestions = engine.getSuggestions(context, ['installed/skill1'])
 *
 * if (suggestions.length > 0) {
 *   console.log(`Suggestion: ${suggestions[0].skillName} - ${suggestions[0].reason}`)
 *   engine.recordSuggestionShown()
 * }
 */
import type { ProjectContext } from '../context/project-detector.js';
import type { SkillSuggestion, SuggestionConfig, SuggestionState } from './types.js';
/**
 * Engine for generating contextual skill suggestions
 *
 * Manages suggestion state, rate limiting, and skill recommendations
 * based on detected project context.
 *
 * @example
 * const engine = new SuggestionEngine({ cooldownMs: 10 * 60 * 1000 })
 * const context = detectProjectContext('/path/to/project')
 * const suggestions = engine.getSuggestions(context, ['installed/skill'])
 */
export declare class SuggestionEngine {
    private config;
    private state;
    private stateDir;
    private stateFile;
    /**
     * Create a new SuggestionEngine instance
     *
     * @param config - Partial configuration to override defaults
     *
     * @example
     * // Use defaults
     * const engine = new SuggestionEngine()
     *
     * // Override cooldown
     * const engine = new SuggestionEngine({ cooldownMs: 10 * 60 * 1000 })
     *
     * // Custom state directory (for testing)
     * const engine = new SuggestionEngine({ stateDir: '/tmp/test-state' })
     */
    constructor(config?: Partial<SuggestionConfig>);
    /**
     * Load suggestion state from disk
     *
     * Resets daily count if it's a new day.
     *
     * @returns Loaded or default suggestion state
     */
    private loadState;
    /**
     * Get default suggestion state
     *
     * @returns Fresh default state object
     */
    private getDefaultState;
    /**
     * Save suggestion state to disk
     *
     * Creates the state directory if it doesn't exist.
     */
    private saveState;
    /**
     * Check if suggestions can be shown based on rate limits
     *
     * Checks:
     * - User has not opted out
     * - Daily limit not reached
     * - Cooldown period has passed
     *
     * @returns True if suggestions are allowed
     *
     * @example
     * if (engine.canSuggest()) {
     *   const suggestions = engine.getSuggestions(context)
     *   // Show suggestion to user
     * }
     */
    canSuggest(): boolean;
    /**
     * Get skill suggestions based on project context
     *
     * Returns empty array if rate limited or opted out.
     * Filters out already installed and dismissed skills.
     * Returns at most one suggestion (the highest priority match).
     *
     * @param context - Detected project context from project-detector
     * @param installedSkills - Array of currently installed skill IDs
     * @returns Array of skill suggestions (at most one)
     *
     * @example
     * const context = detectProjectContext()
     * const suggestions = engine.getSuggestions(context, ['user/docker'])
     *
     * if (suggestions.length > 0) {
     *   console.log(`Try: ${suggestions[0].skillName}`)
     * }
     */
    getSuggestions(context: ProjectContext, installedSkills?: string[]): SkillSuggestion[];
    /**
     * Get list of context attributes that are true
     *
     * @param context - Project context to analyze
     * @returns Array of context match strings
     */
    private getContextMatches;
    /**
     * Record that a suggestion was shown to the user
     *
     * Updates the last suggestion time and increments daily counter.
     * Should be called after displaying a suggestion.
     *
     * @example
     * const suggestions = engine.getSuggestions(context)
     * if (suggestions.length > 0) {
     *   displaySuggestion(suggestions[0])
     *   engine.recordSuggestionShown()
     * }
     */
    recordSuggestionShown(): void;
    /**
     * Dismiss a skill so it won't be suggested again
     *
     * User can dismiss skills they're not interested in.
     *
     * @param skillId - Full skill identifier to dismiss
     *
     * @example
     * // User clicks "Don't show again" on docker suggestion
     * engine.dismissSkill('community/docker')
     */
    dismissSkill(skillId: string): void;
    /**
     * Permanently opt out of all suggestions
     *
     * User can disable all suggestions. Use optIn() to reverse.
     *
     * @example
     * // User clicks "Never show suggestions"
     * engine.optOut()
     */
    optOut(): void;
    /**
     * Opt back in to suggestions after opting out
     *
     * @example
     * // User re-enables suggestions in settings
     * engine.optIn()
     */
    optIn(): void;
    /**
     * Reset all suggestion state to defaults
     *
     * Clears dismissed skills, resets counters, and re-enables suggestions.
     *
     * @example
     * // User clicks "Reset suggestions"
     * engine.resetState()
     */
    resetState(): void;
    /**
     * Get a deep copy of the current suggestion state
     *
     * @returns Deep copy of current state (modifications don't affect engine)
     *
     * @example
     * const state = engine.getState()
     * console.log(`Suggestions today: ${state.suggestionsToday}`)
     */
    getState(): SuggestionState;
}
//# sourceMappingURL=suggestion-engine.d.ts.map