/**
 * @fileoverview `inventory_push` MCP tool (SMI-5392, umbrella SMI-5382).
 * @module @skillsmith/mcp-server/tools/inventory-push
 *
 * Pushes this machine's installed-skill inventory (per harness) to the user's
 * Skillsmith account so it appears on the web dashboard. Read-only/monitoring
 * from the perspective of the local harness — no skill files are modified.
 * Requires the user to be logged in via `skillsmith login`. Respects both the
 * local opt-out flag (`SKILLSMITH_INVENTORY_DISABLE`) and the server-side
 * consent setting.
 *
 * Dispatch: registered in `tool-dispatch.ts` (no tier gate — any authenticated
 * user). Advertised via `index.ts` `toolDefinitions` array.
 *
 * Error map (all typed; none allowed to escape as unhandled rejections):
 *   - {@link InventoryAuthError}       → login prompt
 *   - {@link InventoryConflictError}   → forget-device prompt
 *   - {@link InventoryValidationError} → server validation message
 *   - {@link InventoryUploadError}     → transport failure detail
 */
/**
 * MCP tool schema for `inventory_push` (SMI-5392). Accepted by all
 * authenticated users — no tier gating. The tool takes no required
 * arguments; the permissive empty-object shape allows future extension
 * without a breaking schema change.
 */
export declare const inventoryPushToolSchema: {
    name: string;
    description: string;
    inputSchema: {
        type: "object";
        properties: Record<string, never>;
        required: string[];
    };
};
export declare const inventoryPush: (_input: unknown) => Promise<{
    [x: string]: unknown;
    content: ({
        type: "text";
        text: string;
        annotations?: {
            audience?: ("user" | "assistant")[] | undefined;
            priority?: number | undefined;
            lastModified?: string | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    } | {
        type: "image";
        data: string;
        mimeType: string;
        annotations?: {
            audience?: ("user" | "assistant")[] | undefined;
            priority?: number | undefined;
            lastModified?: string | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    } | {
        type: "audio";
        data: string;
        mimeType: string;
        annotations?: {
            audience?: ("user" | "assistant")[] | undefined;
            priority?: number | undefined;
            lastModified?: string | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    } | {
        uri: string;
        name: string;
        type: "resource_link";
        description?: string | undefined;
        mimeType?: string | undefined;
        size?: number | undefined;
        annotations?: {
            audience?: ("user" | "assistant")[] | undefined;
            priority?: number | undefined;
            lastModified?: string | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
        icons?: {
            src: string;
            mimeType?: string | undefined;
            sizes?: string[] | undefined;
            theme?: "light" | "dark" | undefined;
        }[] | undefined;
        title?: string | undefined;
    } | {
        type: "resource";
        resource: {
            uri: string;
            text: string;
            mimeType?: string | undefined;
            _meta?: {
                [x: string]: unknown;
            } | undefined;
        } | {
            uri: string;
            blob: string;
            mimeType?: string | undefined;
            _meta?: {
                [x: string]: unknown;
            } | undefined;
        };
        annotations?: {
            audience?: ("user" | "assistant")[] | undefined;
            priority?: number | undefined;
            lastModified?: string | undefined;
        } | undefined;
        _meta?: {
            [x: string]: unknown;
        } | undefined;
    })[];
    _meta?: {
        [x: string]: unknown;
        progressToken?: string | number | undefined;
        "io.modelcontextprotocol/related-task"?: {
            taskId: string;
        } | undefined;
    } | undefined;
    structuredContent?: {
        [x: string]: unknown;
    } | undefined;
    isError?: boolean | undefined;
}>;
//# sourceMappingURL=inventory-push.d.ts.map