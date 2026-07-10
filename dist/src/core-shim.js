/**
 * Core package shim for testing
 * Re-exports only the modules needed by MCP server, avoiding heavy dependencies like ONNX
 */
// Error handling
export { ErrorCodes, ErrorSuggestions, SkillsmithError, createErrorResponse, withErrorBoundary, } from '../../core/src/errors.js';
// MCP types
export { TrustTierDescriptions, } from '../../core/src/types.js';
//# sourceMappingURL=core-shim.js.map