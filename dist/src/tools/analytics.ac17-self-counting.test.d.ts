/**
 * @fileoverview AC-17 — analytics tools' own tool_call self-counting ordering.
 * @see docs/internal/implementation/smi-6362-cloud-usage-analytics.md, AC-17: "Calling
 *   team_analytics_dashboard emits its own tool_call event, but after the read completes
 *   (withTelemetry emits in a finally block), so a call never appears in its own output.
 *   Assert: the analytics tool's own call is absent from invocation k and present in
 *   invocation k+1."
 *
 * Sibling to analytics.test.ts (500-line file gate — analytics.test.ts is already at its
 * budget) rather than an addition there. This file ALSO deliberately does NOT reuse
 * analytics.test.ts's `vi.mock('@skillsmith/core', ...)` — that mock only intercepts the
 * `@skillsmith/core` barrel specifier, which the wrapped handlers never use for
 * `withTelemetry` itself (`analytics.actions.ts` imports `withTelemetry` from the separate
 * `@skillsmith/core/telemetry` subpath). AC-17 is specifically a property of the REAL
 * `withTelemetry` finally-block ordering, so this file leaves `@skillsmith/core` and
 * `@skillsmith/core/telemetry` completely unmocked and drives the real emission gate +
 * tool-name context, exactly as `call-tool-handler.ts` does in production.
 *
 * How the ordering is observed without a live search_metrics table: `emitToolCallEvent`'s
 * REAL implementation (no identity provider installed here, matching a Community/local dev
 * environment) short-circuits before any network call but still increments its own real,
 * process-global `skippedNoIdentity` counter (`getTelemetryEmitStats()`, unmocked) — and it
 * does so from inside `withTelemetry`'s `finally` block, i.e. strictly AFTER `handler(...)`
 * (which calls the mocked `getToolUsage`) has already resolved. The mocked `getToolUsage`
 * below reads that same real counter LIVE, at call time, and returns it as `totalToolCalls`.
 * This turns the counter into a faithful proxy for "how many prior invocations have already
 * completed their own self-emit" — precisely the quantity AC-17 requires stay one invocation
 * behind the tool's own reads. This is not a simulation of the ordering; it exercises the
 * real `withTelemetry` code path and observes its real side effect.
 */
export {};
//# sourceMappingURL=analytics.ac17-self-counting.test.d.ts.map