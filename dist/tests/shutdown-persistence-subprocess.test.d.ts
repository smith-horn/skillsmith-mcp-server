/**
 * SMI-5639 Wave 2 Step 4: End-to-end subprocess SIGTERM persistence check.
 *
 * Spawns the real BUILT `dist/src/index.js` binary (not source — mirrors
 * `startup-probe.test.ts`'s own pattern, including its `beforeAll`
 * build-if-absent gate and pre-push carve-out) against a temp WASM
 * (`sql.js`) database, waits for it to report ready, sends a real `SIGTERM`,
 * and asserts the temp DB file went from "does not exist" to "exists with
 * non-zero size" as a direct result of the signal.
 *
 * This is the single most direct proof the fix works against the real
 * binary: the WASM driver's `close()` is the only thing that ever calls
 * `persist()` (`writeFileSync`), so the DB file does not exist AT ALL until
 * the first successful close — before SMI-5639's fix, nothing in the
 * shutdown path ever called `close()`, so this file would never appear no
 * matter how long the server ran or how many writes it made.
 */
export {};
//# sourceMappingURL=shutdown-persistence-subprocess.test.d.ts.map