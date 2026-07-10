/**
 * SMI-1533 / SMI-2722 / SMI-2732: Install Skill execution + trust-tier integration tests
 * Split out of install.integration.test.ts (SMI-5263). This is the only install
 * integration file that exercises the real installSkill() flow, so it owns the three
 * module mocks (mcp-server install.helpers seam, core skill-installation.io seam, and
 * the core install-path resolvers). Trust-tier validation lives here too because it is
 * conceptually part of the install/security path.
 */
export {};
//# sourceMappingURL=install.execution.integration.test.d.ts.map