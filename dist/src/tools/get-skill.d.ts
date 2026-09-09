/**
 * @fileoverview MCP Get Skill Tool for retrieving detailed skill information
 * @module @skillsmith/mcp-server/tools/get-skill
 * @see {@link https://github.com/wrsmith108/skillsmith|Skillsmith Repository}
 * @see SMI-790: Wire get-skill tool to SkillRepository
 *
 * Retrieves comprehensive details for a specific skill including:
 * - Basic metadata (name, author, version, category)
 * - Quality scores with breakdown (quality, popularity, maintenance, security, documentation)
 * - Trust tier with explanation
 * - Repository link and tags
 * - Installation command
 *
 * @example
 * // Get skill by ID with context
 * const response = await executeGetSkill({ id: 'getsentry/commit' }, context);
 * console.log(response.skill.description);
 *
 * @example
 * // Format for terminal display
 * const response = await executeGetSkill({ id: 'microsoft/playwright-cli' }, context);
 * console.log(formatSkillDetails(response));
 */
import { z } from 'zod';
import { type GetSkillResponse } from '@skillsmith/core';
import type { ToolContext } from '../context.js';
/**
 * Zod schema for get-skill input validation
 */
export declare const getSkillInputSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
/**
 * Get skill tool schema for MCP
 */
export declare const getSkillToolSchema: {
    name: string;
    description: string;
    title: string;
    annotations: {
        readOnlyHint: boolean;
        destructiveHint: boolean;
    };
    inputSchema: {
        type: "object";
        properties: {
            id: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
    outputSchema: {
        type: "object";
        properties: {
            skill: {
                type: string;
                properties: {
                    id: {
                        type: string;
                    };
                    name: {
                        type: string;
                    };
                    description: {
                        type: string;
                    };
                    author: {
                        type: string;
                    };
                    repository: {
                        type: string;
                    };
                    installable: {
                        type: string;
                    };
                    version: {
                        type: string;
                    };
                    category: {
                        type: string;
                    };
                    trustTier: {
                        type: string;
                    };
                    score: {
                        type: string;
                    };
                    scoreBreakdown: {
                        type: string;
                        properties: {
                            quality: {
                                type: string;
                            };
                            popularity: {
                                type: string;
                            };
                            maintenance: {
                                type: string;
                            };
                            security: {
                                type: string;
                            };
                            documentation: {
                                type: string;
                            };
                        };
                    };
                    tags: {
                        type: string;
                        items: {
                            type: string;
                        };
                    };
                    installCommand: {
                        type: string;
                    };
                    security: {
                        type: string;
                        properties: {
                            passed: {
                                type: string[];
                            };
                            riskScore: {
                                type: string[];
                            };
                            findingsCount: {
                                type: string;
                            };
                            scannedAt: {
                                type: string[];
                            };
                            scanCoverageIncomplete: {
                                type: string;
                            };
                            scanCoverageNote: {
                                type: string[];
                            };
                        };
                    };
                    createdAt: {
                        type: string;
                    };
                    updatedAt: {
                        type: string;
                    };
                    license: {
                        type: string[];
                    };
                };
                required: string[];
            };
            installCommand: {
                type: string;
            };
            content: {
                type: string;
            };
            timing: {
                type: string;
                properties: {
                    totalMs: {
                        type: string;
                    };
                };
                required: string[];
            };
            also_installed: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        skillId: {
                            type: string;
                        };
                        name: {
                            type: string;
                        };
                        description: {
                            type: string;
                        };
                        author: {
                            type: string;
                        };
                        installCount: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
            dependencies: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        id: {
                            type: string;
                        };
                        skill_id: {
                            type: string;
                        };
                        dep_type: {
                            type: string;
                        };
                        dep_target: {
                            type: string;
                        };
                        dep_version: {
                            type: string[];
                        };
                        dep_source: {
                            type: string;
                        };
                        confidence: {
                            type: string[];
                        };
                        metadata: {
                            type: string[];
                        };
                        created_at: {
                            type: string;
                        };
                        updated_at: {
                            type: string;
                        };
                    };
                    required: string[];
                };
            };
        };
        required: string[];
    };
};
/**
 * Input parameters for the get skill operation
 * @interface GetSkillInput
 */
export interface GetSkillInput {
    /** Skill ID in format "author/skill-name" or UUID */
    id: string;
}
export { formatSkillDetails } from './get-skill.format.js';
export declare const executeGetSkill: (input: GetSkillInput, context: ToolContext) => Promise<GetSkillResponse>;
//# sourceMappingURL=get-skill.d.ts.map