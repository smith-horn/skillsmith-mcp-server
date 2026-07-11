/**
 * @fileoverview Public barrel for the consumer-namespace audit module
 *               (SMI-4587 Wave 1 Step 9). Wave 2/3/4 callers import from
 *               this entrypoint instead of reaching into individual files.
 * @module @skillsmith/mcp-server/audit
 *
 * Surface:
 *   - Detection:   `detectCollisions`, kind-specific helpers
 *   - History:     `writeAuditHistory`, `readAuditHistory`, `newAuditId`
 *   - Report:      `writeAuditReport`, `renderAuditReport`
 *   - Telemetry:   `emitAuditCompleteEvent`
 *   - Bootstrap:   `bootstrapUnmanagedSkills`, `isUnmanagedSkill`
 *   - Types:       `InventoryAuditResult`, collision flag types, branded ids
 */
export { bootstrapUnmanagedSkills, detectCollisions, detectExactCollisions, detectGenericTokenFlags, getLastBootstrapWarnings, isUnmanagedSkill, } from './collision-detector.js';
export type { BootstrapFn, DetectCollisionsOptions } from './collision-detector.js';
export { deriveCollisionId, hasClaudeMdEntries, newAuditId, readAuditHistory, writeAuditHistory, } from './audit-history.js';
export type { AuditHistoryOptions, WriteAuditHistoryResult } from './audit-history.js';
export { renderAuditReport, writeAuditReport } from './audit-report-writer.js';
export type { AuditReportRenderOptions, AuditReportWriteOptions, AuditReportWriteResult, } from './audit-report-writer.js';
export { runSecurityAudit } from './security-audit.js';
export type { RunSecurityAuditOptions, RunSecurityAuditResult, SecurityAuditFinding, SecurityAuditSummary, SecurityVerdict, } from './security-audit.types.js';
export { defaultBaselinePath, loadSecurityBaseline, saveSecurityBaseline, SECURITY_BASELINE_VERSION, } from './security-baseline.js';
export type { SecurityBaseline, SecurityBaselineEntry, StoredScanReport, } from './security-baseline.js';
export { buildAuditDigestPayload, hashDigest, maybeAutoNotifyAudit, MAX_DIGEST_FINDINGS, } from './audit-notify.js';
export type { MaybeAutoNotifyOptions, MaybeAutoNotifyResult } from './audit-notify.js';
export { emitAuditCompleteEvent } from '../tools/namespace-audit/telemetry.js';
export type { AuditCompleteContext, AuditCompleteTelemetryOptions, } from '../tools/namespace-audit/telemetry.js';
export type { AuditId, CollisionId, ExactCollisionFlag, GenericTokenFlag, InventoryAuditResult, SemanticCollisionFlag, } from './collision-detector.types.js';
export { appendOverride, findOverride, readLedger, readLedgerResult, writeLedger, } from './namespace-overrides.js';
export type { LedgerPathOptions } from './namespace-overrides.js';
export { CURRENT_VERSION as NAMESPACE_OVERRIDES_CURRENT_VERSION } from './namespace-overrides.types.js';
export type { LedgerVersion, LedgerVersionUnsupportedError, OverrideRecord, OverridesLedger, ReadLedgerResult, } from './namespace-overrides.types.js';
export type { NamespaceWarning, PendingCollision } from './namespace-audit.types.js';
export { applyRename, generateSuggestionChain, REVERT_SUMMARY_PREFIX } from './rename-engine.js';
export type { ApplyRenameRequest, ApplyRenameResult, RenameAction, RenameActionRequest, RenameError, RenameSuggestion, SuggestionChain, } from './rename-engine.types.js';
export { runInstallPreflight } from './install-preflight.js';
export type { CandidateSkill, RunInstallPreflightInput, RunInstallPreflightResult, } from './install-preflight.js';
export { runBackupGC } from '../tools/install.backup-gc.js';
export type { RunBackupGCOptions, RunBackupGCResult } from '../tools/install.backup-gc.js';
export { runEditSuggester, V1_TEMPLATE_PATTERNS } from './edit-suggester.js';
export type { EditCategory, EditTemplate, EditTemplatePattern, RecommendedEdit, } from './edit-suggester.types.js';
export { APPLY_TEMPLATE_REGISTRY, applyRecommendedEdit } from './edit-applier.js';
export type { ApplyRecommendedEditOptions } from './edit-applier.js';
export type { EditApplyError, EditApplyResult } from './edit-applier.types.js';
export { claudeCodeAdapter, FrameworkAdapterError } from './framework-adapter.js';
export type { AdapterAction, FileRenameAction, FrameworkAdapter, FrameworkName, InlineEditAction, } from './framework-adapter.types.js';
export { runInventoryAudit } from './run-inventory-audit.js';
export type { RunInventoryAuditOptions, RunInventoryAuditResult } from './run-inventory-audit.js';
export { readAuditSuggestions, writeAuditSuggestions } from './audit-suggestions.js';
export type { AuditSuggestionsFile, AuditSuggestionsOptions } from './audit-suggestions.js';
export { detectRot } from './rot-detector.js';
export type { DetectRotOptions, RotFinding, RotSignal } from './rot-detector.types.js';
//# sourceMappingURL=index.d.ts.map