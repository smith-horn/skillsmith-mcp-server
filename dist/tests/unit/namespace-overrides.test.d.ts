/**
 * Unit tests for SMI-4588 Wave 2 Step 1 — namespace-overrides ledger.
 * PR #1 of the Wave 2 stack.
 *
 * Coverage (8 cases per plan §Step 1 + §Tests `namespace-overrides.test.ts`):
 *   1. Read empty / missing file returns an empty ledger.
 *   2. Append + read round-trip preserves entries.
 *   3. `version > CURRENT_VERSION` returns typed
 *      `namespace.ledger.version_unsupported` (NOT silently empty).
 *   4. Concurrent-write boundary (last-write-wins on a single process).
 *   5. Malformed JSON returns the typed `namespace.ledger.malformed`
 *      discriminator (and `readLedger` warns + degrades to empty).
 *   6. Atomic write semantics — no `.tmp` file remains after success.
 *   7. Idempotency — appending the same entry twice is detected.
 *   8. Round-trip preserves ULID order (insertion order).
 */
export {};
//# sourceMappingURL=namespace-overrides.test.d.ts.map