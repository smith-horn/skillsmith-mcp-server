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
};
//# sourceMappingURL=search.schema.d.ts.map