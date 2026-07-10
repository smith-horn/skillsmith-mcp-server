/**
 * @fileoverview Custom integrations MCP tools (webhooks + API keys)
 * @module @skillsmith/mcp-server/tools/integration-tools
 * @see SMI-3903: Custom Integrations MCP Tools
 *
 * Webhook signing uses HMAC-SHA256. API keys are stored as SHA-256 hashes
 * only — the raw key is returned once on creation and never again.
 *
 * Tier gate: Enterprise (custom_integrations feature flag).
 */
import { z } from 'zod';
import type { ToolContext } from '../context.js';
export { createStubIntegrationService } from './integration-tools.stub.js';
export declare const webhookConfigureInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create", "list", "get", "delete", "test", "rotate_secret"]>;
    url: z.ZodOptional<z.ZodString>;
    events: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    webhookId: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "test" | "list" | "create" | "get" | "delete" | "rotate_secret";
    description?: string | undefined;
    url?: string | undefined;
    webhookId?: string | undefined;
    events?: string[] | undefined;
}, {
    action: "test" | "list" | "create" | "get" | "delete" | "rotate_secret";
    description?: string | undefined;
    url?: string | undefined;
    webhookId?: string | undefined;
    events?: string[] | undefined;
}>;
export type WebhookConfigureInput = z.infer<typeof webhookConfigureInputSchema>;
export declare const apiKeyManageInputSchema: z.ZodObject<{
    action: z.ZodEnum<["create", "list", "revoke", "get"]>;
    name: z.ZodOptional<z.ZodString>;
    keyId: z.ZodOptional<z.ZodString>;
    permissions: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    expiresIn: z.ZodDefault<z.ZodOptional<z.ZodEnum<["30d", "90d", "365d", "never"]>>>;
}, "strip", z.ZodTypeAny, {
    action: "list" | "create" | "get" | "revoke";
    expiresIn: "never" | "90d" | "30d" | "365d";
    name?: string | undefined;
    permissions?: string[] | undefined;
    keyId?: string | undefined;
}, {
    action: "list" | "create" | "get" | "revoke";
    name?: string | undefined;
    permissions?: string[] | undefined;
    keyId?: string | undefined;
    expiresIn?: "never" | "90d" | "30d" | "365d" | undefined;
}>;
export type ApiKeyManageInput = z.infer<typeof apiKeyManageInputSchema>;
export declare const webhookConfigureToolSchema: {
    name: "webhook_configure";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            url: {
                type: string;
                description: string;
            };
            events: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            webhookId: {
                type: string;
                description: string;
            };
            description: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export declare const apiKeyManageToolSchema: {
    name: "api_key_manage";
    description: string;
    inputSchema: {
        type: "object";
        properties: {
            action: {
                type: string;
                enum: string[];
                description: string;
            };
            name: {
                type: string;
                description: string;
            };
            keyId: {
                type: string;
                description: string;
            };
            permissions: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            expiresIn: {
                type: string;
                enum: string[];
                description: string;
            };
        };
        required: string[];
    };
};
export interface Webhook {
    id: string;
    url: string;
    events: string[];
    description: string | null;
    signingSecret: string;
    status: 'active' | 'inactive';
    createdAt: string;
    lastDeliveryAt: string | null;
}
export interface WebhookMasked {
    id: string;
    url: string;
    events: string[];
    description: string | null;
    signingSecretLast4: string;
    status: 'active' | 'inactive';
    createdAt: string;
    lastDeliveryAt: string | null;
}
export interface ApiKey {
    id: string;
    name: string;
    keyValue: string;
    keyPrefix: string;
    permissions: string[];
    expiresAt: string | null;
    createdAt: string;
}
export interface ApiKeyMasked {
    id: string;
    name: string;
    keyLast4: string;
    keyPrefix: string;
    permissions: string[];
    expiresAt: string | null;
    createdAt: string;
    status: 'active' | 'revoked';
}
export interface IntegrationService {
    createWebhook(url: string, events: string[], description?: string): Promise<Webhook>;
    listWebhooks(): Promise<WebhookMasked[]>;
    getWebhook(webhookId: string): Promise<WebhookMasked | null>;
    deleteWebhook(webhookId: string): Promise<boolean>;
    testWebhook(webhookId: string): Promise<{
        success: boolean;
        statusCode: number;
        message: string;
    }>;
    rotateSecret(webhookId: string): Promise<{
        webhookId: string;
        newSigningSecret: string;
    }>;
    createApiKey(name: string, permissions?: string[], expiresIn?: string): Promise<ApiKey>;
    listApiKeys(): Promise<ApiKeyMasked[]>;
    getApiKey(keyId: string): Promise<ApiKeyMasked | null>;
    revokeApiKey(keyId: string): Promise<boolean>;
}
/** Replace the integration service implementation */
export declare function setIntegrationService(svc: IntegrationService): void;
export interface WebhookConfigureResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    webhook?: Webhook | WebhookMasked;
    webhooks?: WebhookMasked[];
    test?: {
        success: boolean;
        statusCode: number;
        message: string;
    };
    rotated?: {
        webhookId: string;
        newSigningSecret: string;
    };
    message?: string;
    error?: string;
}
export interface ApiKeyManageResult {
    success: boolean;
    dataSource: 'stub' | 'live';
    key?: ApiKey | ApiKeyMasked;
    keys?: ApiKeyMasked[];
    message?: string;
    error?: string;
}
export declare const executeWebhookConfigure: (input: {
    action: "test" | "list" | "create" | "get" | "delete" | "rotate_secret";
    description?: string | undefined;
    url?: string | undefined;
    webhookId?: string | undefined;
    events?: string[] | undefined;
}, _context: ToolContext) => Promise<WebhookConfigureResult>;
export declare const executeApiKeyManage: (input: {
    action: "list" | "create" | "get" | "revoke";
    expiresIn: "never" | "90d" | "30d" | "365d";
    name?: string | undefined;
    permissions?: string[] | undefined;
    keyId?: string | undefined;
}, _context: ToolContext) => Promise<ApiKeyManageResult>;
//# sourceMappingURL=integration-tools.d.ts.map