/**
 * @fileoverview SMI-6622 governance review — each registry handler reads the module-level service
 * singleton exactly once
 * @see SMI-6203: the same shape in sso/integration/rbac tools. `dataSourceFor(service)` labels the
 *      result, then `service.<method>()` populates it after an `await`; if
 *      `setPrivateRegistryService()` lands in between, the result carries one instance's provenance
 *      and another instance's data.
 *
 * The team-resolution mock swaps the service DURING its await, which is exactly that window.
 */
export {};
//# sourceMappingURL=registry-tools.singleton-capture.test.d.ts.map