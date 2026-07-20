/**
 * Tool-to-Feature mapping for license validation
 *
 * Maps MCP tool names to their required feature flags.
 * null = community feature (no license required)
 * string = feature flag that must be enabled in the license
 *
 * @see SMI-1055: Add license middleware to MCP server
 * @see SMI-1091: Unified tier feature definitions across packages
 */
/**
 * Feature flags for enterprise licensing
 *
 * This type mirrors the canonical FeatureFlag from @smith-horn/enterprise.
 * We define it locally because @smith-horn/enterprise is an optional peer
 * dependency that may not be installed for community users.
 *
 * @see packages/enterprise/src/license/FeatureFlags.ts for canonical definition
 */
export type FeatureFlag = 'basic_analytics' | 'email_support' | 'version_tracking' | 'private_skills' | 'team_workspaces' | 'usage_analytics' | 'priority_support' | 'skill_security_audit' | 'sso_saml' | 'rbac' | 'audit_logging' | 'siem_export' | 'compliance_reports' | 'private_registry' | 'custom_integrations' | 'advanced_analytics';
/**
 * Mapping of tool names to their required feature flags
 *
 * null = community tool (no license required)
 * FeatureFlag = requires that feature to be enabled in license
 */
export declare const TOOL_FEATURES: Record<string, FeatureFlag | null>;
/**
 * Human-readable names for feature flags
 */
export declare const FEATURE_DISPLAY_NAMES: Record<FeatureFlag, string>;
/**
 * Tier information for upgrade messaging
 */
export declare const FEATURE_TIERS: Record<FeatureFlag, 'individual' | 'team' | 'enterprise'>;
//# sourceMappingURL=toolFeatureMapping.d.ts.map