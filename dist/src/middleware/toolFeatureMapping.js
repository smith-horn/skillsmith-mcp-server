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
 * Mapping of tool names to their required feature flags
 *
 * null = community tool (no license required)
 * FeatureFlag = requires that feature to be enabled in license
 */
export const TOOL_FEATURES = {
    // Core tools - no feature required (null = community)
    search: null,
    get_skill: null,
    install_skill: null,
    uninstall_skill: null,
    skill_recommend: null,
    skill_validate: null,
    skill_compare: null,
    skill_suggest: null,
    skill_outdated: null,
    // SMI-5407: source provenance recovery (Community, read-only)
    skill_recover_source: null,
    // Individual tools
    skill_updates: 'version_tracking',
    skill_diff: 'version_tracking',
    skill_pack_audit: 'version_tracking',
    // Team tools - require team features
    skill_audit: 'skill_security_audit',
    publish_private: 'private_skills',
    team_workspace: 'team_workspaces',
    share_skill: 'team_workspaces',
    // Enterprise tools - require enterprise features
    configure_sso: 'sso_saml',
    sso_settings: 'sso_saml',
    audit_export: 'audit_logging',
    audit_query: 'audit_logging',
    rbac_manage: 'rbac',
    rbac_assign_role: 'rbac',
    rbac_create_policy: 'rbac',
    siem_export: 'siem_export',
    compliance_report: 'compliance_reports',
    private_registry_publish: 'private_registry',
    private_registry_manage: 'private_registry',
    // Team analytics tools
    team_analytics_dashboard: 'usage_analytics',
    team_usage_report: 'usage_analytics',
    // Enterprise analytics tools
    analytics_dashboard: 'advanced_analytics',
    usage_report: 'advanced_analytics',
    // Integration tools
    webhook_configure: 'custom_integrations',
    api_key_manage: 'custom_integrations',
};
/**
 * Human-readable names for feature flags
 */
export const FEATURE_DISPLAY_NAMES = {
    // Individual tier features
    basic_analytics: 'Basic Analytics',
    email_support: 'Email Support',
    version_tracking: 'Version Tracking',
    // Team tier features
    private_skills: 'Private Skills',
    team_workspaces: 'Team Workspaces',
    usage_analytics: 'Usage Analytics',
    priority_support: 'Priority Support',
    skill_security_audit: 'Security Audit',
    // Enterprise tier features
    sso_saml: 'SSO/SAML Integration',
    rbac: 'Role-Based Access Control',
    audit_logging: 'Audit Logging',
    siem_export: 'SIEM Export',
    compliance_reports: 'Compliance Reports',
    private_registry: 'Private Registry',
    // Additional features
    custom_integrations: 'Custom Integrations',
    advanced_analytics: 'Advanced Analytics',
};
/**
 * Tier information for upgrade messaging
 */
export const FEATURE_TIERS = {
    // Individual tier features
    basic_analytics: 'individual',
    email_support: 'individual',
    version_tracking: 'individual',
    // Team tier features
    private_skills: 'team',
    team_workspaces: 'team',
    usage_analytics: 'team',
    priority_support: 'team',
    skill_security_audit: 'team',
    // Enterprise tier features
    sso_saml: 'enterprise',
    rbac: 'enterprise',
    audit_logging: 'enterprise',
    siem_export: 'enterprise',
    compliance_reports: 'enterprise',
    private_registry: 'enterprise',
    // Additional features
    custom_integrations: 'enterprise',
    advanced_analytics: 'enterprise',
};
//# sourceMappingURL=toolFeatureMapping.js.map