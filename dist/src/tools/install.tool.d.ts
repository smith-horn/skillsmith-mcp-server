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
                enum: string[];
                description: string;
            };
            alsoLink: {
                type: string;
                items: {
                    type: string;
                    enum: string[];
                };
                description: string;
            };
            symlink: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export default installTool;
//# sourceMappingURL=install.tool.d.ts.map