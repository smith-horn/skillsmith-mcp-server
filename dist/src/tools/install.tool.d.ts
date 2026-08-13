/**
 * @fileoverview MCP Tool Definition for install_skill
 * @module @skillsmith/mcp-server/tools/install.tool
 * @see SMI-2741: Split from install.ts to meet 500-line standard
 *
 * The MCP tool schema definition for the install_skill tool, extracted
 * from install.ts to keep that file within the 500-line limit.
 */
/**
 * MCP tool definition for install_skill
 *
 * SMI-5982 (Wave 6) audit finding: `client`/`alsoLink` `enum` below used to
 * be a hand-duplicated 5-value literal, independently stale from the zod
 * schema's own copy in install.types.ts (both predated opencode/hermes/grok)
 * — now both derive from the same `CLIENT_IDS` source of truth.
 */
export declare const installTool: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            skillId: {
                type: string;
                description: string;
            };
            force: {
                type: string;
                description: string;
            };
            skipScan: {
                type: string;
                description: string;
            };
            skipOptimize: {
                type: string;
                description: string;
            };
            conflictAction: {
                type: string;
                enum: string[];
                description: string;
            };
            confirmed: {
                type: string;
                description: string;
            };
            client: {
                type: string;
                enum: import("@skillsmith/core/install").ClientId[];
                description: string;
            };
            alsoLink: {
                type: string;
                items: {
                    type: string;
                    enum: import("@skillsmith/core/install").ClientId[];
                };
                description: string;
            };
            symlink: {
                type: string;
                description: string;
            };
            cwd: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export default installTool;
//# sourceMappingURL=install.tool.d.ts.map