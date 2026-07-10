/**
 * @fileoverview MCP Skill Recommend Tool for suggesting relevant skills
 * @module @skillsmith/mcp-server/tools/recommend
 * @see SMI-741: Add MCP Tool skill_recommend
 * @see SMI-602: Integrate semantic matching with EmbeddingService
 * @see SMI-604: Add trigger phrase overlap detection
 * @see SMI-1837: Include local skills in recommendations (parallel search)
 * @see SMI-2741: Split to meet 500-line standard
 */
import type { ToolContext } from '../context.js';
import { type RecommendResponse } from './recommend.types.js';
export { recommendInputSchema, recommendToolSchema, type RecommendInput, type RecommendResponse, type SkillRecommendation, } from './recommend.types.js';
export { formatRecommendations, mergeAndDeduplicateRecommendations } from './recommend.format.js';
export declare const executeRecommend: (input: {
    limit?: number | undefined;
    installed_skills?: string[] | undefined;
    project_context?: string | undefined;
    detect_overlap?: boolean | undefined;
    min_similarity?: number | undefined;
    role?: "testing" | "documentation" | "security" | "workflow" | "code-quality" | "development-partner" | undefined;
    installable_only?: boolean | undefined;
}, context: ToolContext) => Promise<RecommendResponse>;
//# sourceMappingURL=recommend.d.ts.map