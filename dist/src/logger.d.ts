/**
 * SMI-583: Logging utility for MCP server
 * SMI-883: Sanitizes sensitive data before logging to prevent data leakage
 * Logs errors to ~/.skillsmith/logs/
 */
/**
 * SMI-883: Redact sensitive data from text before logging
 * Exported for testing purposes
 */
export declare function redactSensitiveData(text: string): string;
/**
 * SMI-883: Recursively redact sensitive data from objects
 * Exported for testing purposes
 */
export declare function redactSensitiveObject(obj: unknown): unknown;
/**
 * Logger interface
 */
export declare const logger: {
    info(message: string, details?: unknown): void;
    warn(message: string, details?: unknown): void;
    error(message: string, details?: unknown): void;
    debug(message: string, details?: unknown): void;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map