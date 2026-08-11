/**
 * @fileoverview Shared types for the private-registry content-read + install path
 * @module @skillsmith/mcp-server/tools/registry-tools.content.types
 * @see SMI-5905 Wave 3: MCP tool surface — `install` action + `getContent()`
 * @see docs/internal/implementation/private-registry-skill-install.md
 *
 * A types-only companion (the `foo.types.ts` convention already used by `install.types.ts`,
 * `publish.types.ts`, `rbac-tools.types.ts`) so `registry-tools.ts` — 466/500 lines before this
 * wave — does not absorb them, and so `registry-tools.live.ts`, `registry-tools.live.content.ts`,
 * `registry-tools.stub.ts` and `registry-tools.install-action.ts` can all reference the same
 * shapes without importing each other.
 */
/**
 * The private-registry table (migration 20260724000000), and the metadata-only column list.
 *
 * These live here rather than in `registry-tools.live.ts` so `registry-tools.live.content.ts` can
 * reach them without a runtime import cycle back into `live.ts` (which imports the content
 * module's `getSkillContent`). Colocating a couple of constants in a `.types` companion follows
 * `install.types.ts`, which does the same for `TRUST_TIER_SCANNER_OPTIONS`/`CLAUDE_SKILLS_DIR`.
 *
 * `METADATA_COLUMNS` deliberately excludes `content` (up to 2 MB/row): `mapRow()` never reads it,
 * `RegistrySkill` never exposes it, and an unqualified `select()` would pull every matching row's
 * full package over the wire — including on the pre-entitlement read, which must not transfer a
 * byte of content before the Enterprise check passes.
 */
export const REGISTRY_TABLE = 'private_registry_skills';
export const REGISTRY_METADATA_COLUMNS = 'id, team_id, skill_id, version, description, content_hash, deprecated, published_by, published_at';
//# sourceMappingURL=registry-tools.content.types.js.map