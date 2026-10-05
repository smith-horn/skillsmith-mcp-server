/**
 * @fileoverview SMI-6733 Phase 2 Wave 2 — the degraded manifest read has to
 * reach the response, and the dereference must not throw.
 * @module @skillsmith/mcp-server/tools/manifest-degraded-read.test
 * @see docs/internal/implementation/smi-6733-manifest-read-state-phase-2.md
 * @see docs/internal/adr/171-manifest-read-state-contract.md § 4, § 5, § 10
 *
 * Why this file exists rather than cases inside `outdated.test.ts` /
 * `skill-updates.test.ts`: both of those `vi.mock('./install.helpers.js')`
 * at module scope, so `loadManifest` — the reader under test here — never
 * executes there. Every assertion below depends on a REAL read of a REAL
 * file, because the defect the dereference half of this wave fixes arrives
 * through the reader's SUCCESS path (`installedSkills: null` classifies
 * `ok`, ADR-171 § 5's nullish carve-out) and a mocked reader cannot
 * demonstrate that.
 *
 * `$HOME` is redirected to a per-run temp dir by `vitest.setup.ts` BEFORE any
 * test module loads, so `MANIFEST_PATH` — derived from `os.homedir()` at
 * module load in `install.types.ts` — already points into the sandbox.
 * `assertNotRealUserHome` is the backstop if it ever does not.
 *
 * TWO DISJOINT FIXTURE FAMILIES, and conflating them is how a test in this
 * wave ends up asserting nothing:
 *
 *   - A manifest the classifier REFUSES (`corrupt` / `unreadable` /
 *     `version_unsupported`) makes `loadManifestLenient` substitute the EMPTY
 *     document and return a non-null `warning`. `installedSkills` is `{}`, so
 *     there is no dereference hazard at all here. This family tests the
 *     warning thread (Steps 1-5).
 *   - A manifest the classifier ACCEPTS whose `installedSkills` is `null`
 *     classifies `ok`: the wrapper returns it UNCHANGED, with NO warning and
 *     NO substitution, and the raw `null` reaches the consumer. This family
 *     tests the dereference (Step 6 / SMI-6886). A corrupt fixture can never
 *     reach it.
 */
export {};
//# sourceMappingURL=manifest-degraded-read.test.d.ts.map