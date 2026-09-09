/**
 * @fileoverview MCP `search` tool's JSON schema definition.
 *
 * Split out of search.ts (SMI-5929's own fixes pushed it back over the
 * 500-line governance limit) — this is a self-contained, static object with
 * no logic dependency on the rest of search.ts.
 */
/**
 * Search tool schema for MCP
 */
export declare const searchToolSchema: {
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
            query: {
                type: string;
                description: string;
            };
            category: {
                type: string;
                description: string;
                enum: string[];
            };
            trust_tier: {
                type: string;
                description: string;
                enum: string[];
            };
            min_score: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
            safe_only: {
                type: string;
                description: string;
            };
            installable_only: {
                type: string;
                description: string;
            };
            max_risk: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
            compatible_with: {
                type: string;
                description: string;
                properties: {
                    ides: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                    llms: {
                        type: string;
                        items: {
                            type: string;
                        };
                        description: string;
                    };
                };
            };
            limit: {
                type: string;
                description: string;
                minimum: number;
                maximum: number;
            };
        };
        required: never[];
    };
    outputSchema: {
        type: "object";
        properties: {
            results: {
                type: string;
                items: {
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
                        category: {
                            type: string;
                        };
                        trustTier: {
                            type: string;
                        };
                        score: {
                            type: string;
                        };
                        repository: {
                            type: string;
                        };
                        installable: {
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
                        source: {
                            type: string;
                            enum: string[];
                        };
                        installHint: {
                            type: string;
                        };
                        compatibility: {
                            type: string;
                            items: {
                                type: string;
                            };
                        };
                        license: {
                            type: string[];
                        };
                    };
                    required: string[];
                };
            };
            total: {
                type: string;
            };
            query: {
                type: string;
            };
            filters: {
                type: string;
                properties: {
                    category: {
                        type: string;
                    };
                    trustTier: {
                        type: string;
                    };
                    minScore: {
                        type: string;
                    };
                    safeOnly: {
                        type: string;
                    };
                    maxRiskScore: {
                        type: string;
                    };
                    compatibleWith: {
                        type: string;
                        properties: {
                            ides: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                            llms: {
                                type: string;
                                items: {
                                    type: string;
                                };
                            };
                        };
                    };
                };
            };
            compatibilityDeprioritized: {
                type: string;
            };
            discoveryOnlyHidden: {
                type: string;
            };
            suggestion: {
                type: string;
            };
            timing: {
                type: string;
                properties: {
                    searchMs: {
                        type: string;
                    };
                    totalMs: {
                        type: string;
                    };
                };
                required: string[];
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=search.schema.d.ts.map