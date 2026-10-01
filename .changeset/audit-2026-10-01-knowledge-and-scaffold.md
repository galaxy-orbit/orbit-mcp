---
"@galaxy-stack/orbit-mcp": minor
---

Fix the scaffolding generator, the section API, and two topics that contradicted each other.

A 25-prompt E2E audit (2026-10-01) traced 88 `node_modules` reads and 22 wasted
`search_tools` calls per run to concrete defects in this server:

- **`orbit_scaffold_module` emitted code that could not compile.** The generated
  controller imported `NotFoundError` (which exists in neither package), pulled
  `Body`/`Param`/`HttpCode` from `@galaxy-stack/orbit-core` (they live in
  `orbit-common`), and used `@HttpCode` without importing it — four TypeScript
  errors against a real install. It now emits `NotFoundException`, imports the
  parameter and method decorators from `orbit-common`, and binds a Zod schema with
  `@UsePipes(new ZodValidationPipe(schema))`. The dead `withDatabase` flag is gone:
  it never did anything, and the topic names the real wiring instead.
- **Two topics contradicted each other about security.** `security-checklist` taught
  `SecurityModule.forRoot({ helmet: true, csrf: true })`, which is a type error
  against `HelmetOptions | false` / `CsrfOptions | false`, while `api-surface`
  taught the correct shapes. Both now agree, and the wrong form is documented as a
  mistake rather than silently dropped.
- **The pipeline contract was wrong about filters.** The topic claimed the pipeline
  never passes an `ArgumentsHost` and that `getArgs()`/`getArgByIndex()` do not
  exist; `orbit-common` exports an `ExceptionFilter` that declares exactly those.
  The topic now names both interfaces, says which one the runtime uses, and adds the
  `ThrottlerContext` shape that `ThrottlerGuard` receives.
- **Throttling had no wiring recipe.** Agents re-derived `ThrottlerGuard`'s DI from
  `node_modules` because nothing said that `ThrottlerModule.forRoot()` is
  `global: true` and already provides the guard, or that a `@Catch(ThrottlerException)`
  filter is what turns a plain `Error` into a 429. Both are now in the topic with a
  shared-base-controller pattern, verified end-to-end (`200,200,200,429,429` plus
  `Retry-After`).
- **New: `orbit_knowledge_read` takes a `section`.** After a context compaction an
  agent used to re-fetch the whole 15,735-character `api-surface` topic; reading the
  `throttler` section is 4,567 characters, and `orbit_knowledge_topics` now lists
  the section ids and short aliases. `scripts/smoke.mjs` drives the real stdio
  server with 14 assertions.
