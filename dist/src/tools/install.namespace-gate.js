/**
 * @fileoverview Namespace pre-flight + mode gate for the install hot path
 *               (SMI-4588 Wave 2 Step 6, PR #3).
 * @module @skillsmith/mcp-server/tools/install.namespace-gate
 *
 * Encapsulates the three steps that bracket `service.install()` in the
 * MCP install tool:
 *
 *   1. Ledger replay — rewrite the candidate skill's identifier when a
 *      previously-recorded user rename matches.
 *   2. Pre-flight collision detection + suggestion-chain generation.
 *   3. Mode gate (`preventative` blocks; `power_user`/`governance` warn).
 *
 * Extracted from `install.ts` per Step 6's "unconditional extraction"
 * directive — keeps the hot-path file under the 500-LOC limit and keeps
 * the new logic independently testable.
 *
 * Edits applied (plan-review 2026-05-02):
 *   - Edit 2: pre-flight scanner failure is ALWAYS non-blocking. The
 *     `runInstallPreflight` module already degrades on detector throws;
 *     this gate additionally swallows ledger-read errors (including
 *     `namespace.ledger.version_unsupported`) so a downgraded ledger
 *     never bricks installs.
 *   - Edit 6: typed `version_unsupported` error caught here, not bubbled.
 *   - Edit 7: pre-flight returns `auditId` explicitly; this gate threads
 *     it into the `pendingCollision` envelope without re-deriving.
 */
import { runInstallPreflight, } from '../audit/install-preflight.js';
import { newAuditId } from '../audit/audit-history.js';
import { readLedger } from '../audit/namespace-overrides.js';
import { applyLedgerReplay } from './install.ledger-replay.js';
import { scanLocalInventory } from '../utils/local-inventory.js';
/**
 * Run the namespace pre-flight + apply the mode gate. Returns a decision
 * the install hot path branches on. Never throws — all failure paths
 * degrade to `decision: 'proceed'` with a logged warning (Edit 2).
 */
export async function runNamespaceGate(input) {
    const { mode, tier } = input;
    // Step 1 — ledger replay. Read the ledger; on failure (including
    // `version_unsupported`), degrade to "no replay, no preflight" because
    // we cannot trust the candidate's effective identifier without it.
    let candidate = input.candidate;
    try {
        const ledger = await readLedger();
        const replay = applyLedgerReplay(input.candidate, ledger);
        candidate = replay.candidate;
    }
    catch (err) {
        // Edit 6: typed version_unsupported (or any other ledger error)
        // surfaces here. Pre-flight is non-blocking; degrade.
        console.warn(`[install.namespace-gate] ledger read failed (${err.message}); skipping pre-flight`);
        return degradedProceed(candidate);
    }
    // Step 2 — scan local inventory + run pre-flight. The scanner runs
    // synchronously per call (Wave 1 plumbing). Errors here also degrade.
    let existingInventory;
    try {
        const scan = await scanLocalInventory();
        existingInventory = scan.entries;
    }
    catch (err) {
        console.warn(`[install.namespace-gate] scanLocalInventory failed (${err.message}); skipping pre-flight`);
        return degradedProceed(candidate);
    }
    let preflight;
    try {
        preflight = await runInstallPreflight({
            existingInventory,
            candidate,
            mode,
            tier,
        });
    }
    catch (err) {
        // `runInstallPreflight` itself already catches detector throws and
        // degrades, but a defensive outer catch keeps the install hot path
        // bulletproof against any future regression.
        console.warn(`[install.namespace-gate] runInstallPreflight threw (${err.message}); proceeding non-blocking`);
        return degradedProceed(candidate);
    }
    // Step 3 — mode gate.
    const hasCollision = preflight.pendingCollision !== null;
    if (mode === 'preventative' && hasCollision) {
        return {
            decision: 'block',
            candidate,
            preflight,
            resultPatch: {
                installComplete: false,
                pendingCollision: preflight.pendingCollision ?? undefined,
                warnings: preflight.warnings.length > 0 ? preflight.warnings : undefined,
            },
        };
    }
    // power_user / governance / preventative-without-collision all proceed.
    return {
        decision: 'proceed',
        candidate,
        preflight,
        resultPatch: {
            installComplete: true,
            warnings: preflight.warnings.length > 0 ? preflight.warnings : undefined,
        },
    };
}
/**
 * Degraded-proceed shape used when ledger read, inventory scan, or
 * pre-flight throws. Caller continues the install with no warnings.
 *
 * `auditId` is allocated via `newAuditId()` even on the degraded path so
 * the `AuditId` brand invariant holds for any defensive consumer that
 * reads `preflight.auditId` without checking `decision` first.
 */
function degradedProceed(candidate) {
    return {
        decision: 'proceed',
        candidate,
        preflight: {
            warnings: [],
            pendingCollision: null,
            auditId: newAuditId(),
        },
        resultPatch: {
            installComplete: true,
        },
    };
}
//# sourceMappingURL=install.namespace-gate.js.map