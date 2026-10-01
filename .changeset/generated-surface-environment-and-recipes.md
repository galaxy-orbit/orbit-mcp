---
"@galaxy-stack/orbit-mcp": minor
---

Generate the API surface, add orbit_environment and orbit_recipe, and ship the traps as knowledge.

A 2026-10-01 E2E audit traced 88-124 `node_modules` reads per run to agents re-deriving what the
`@galaxy-stack/orbit-*` packages export, because that inventory was hand-written prose and had
drifted (a scaffold that did not compile, two topics contradicting each other about security, and a
wrong claim about the request pipeline). Prose cannot be kept in sync by discipline alone, so it is
no longer prose:

- **`api-surface` is generated** by `scripts/generate-api-surface.mjs` from the declarations of the
  nine `@galaxy-stack/orbit-*` packages the repo now pins as devDependencies (orbit-core,
  orbit-common, orbit-database, orbit-security, orbit-throttler, orbit-graphql, orbit-validation,
  orbit-microservices, orbit-swagger — 487 symbols). Every line is a real declaration: signatures
  for functions and classes, member names for interfaces (with `?` for optional), methods for
  classes. One `###` section per package keeps a read small (orbit-throttler is 1.5k characters
  against 39k for the whole topic).
- **Drift is a test, not a hope.** The generated file is committed, `node
  scripts/generate-api-surface.mjs --check` fails when it is stale, and CI runs it before the
  tests. Adding a package to the surface is one line in the generator — not a page of prose.
- **New `orbit_environment` tool**: reports the versions the project installs next to the ones the
  surface was generated from, so "the docs do not match my install" is answered in one call instead
  of by reading `node_modules/**/package.json` (which the knowledge used to instruct).
- **New `orbit_recipe` tool**: one verified recipe per task (`throttle-per-route`,
  `database-wiring`, `migrations`, `security-baseline`, `filters`, `middleware`,
  `zod-validation`, …), matched by id or phrase.
- **`orbit_knowledge_read` takes `symbol`** — one export, its owning package and the declaration
  line itself — and resolves section aliases across topics, so `{ section: "throttler" }` works
  with or without an `id`.
- **Two new hand-written topics for what a declaration cannot express**: `pitfalls` (the measured
  runtime traps: `@HttpCode` masking failure statuses on orbit-core <= 0.2.3, the two
  `ExceptionFilter` interfaces, throttler DI, the absence of global registration, the wrong
  READMEs) and `absent` (the NestJS APIs and the wrong symbol names agents keep searching for).
  The superseded hand-written export list, "signatures" and "compiled against" sections are gone;
  the wiring content they carried now lives in the `recipes` topic.
- **The bundled `orbit-framework` skill is now a rulebook and a router** (122 lines, was 124 but
  carrying templates): the rules that are not derivable from a declaration, a table pointing at the
  topic or section that answers each need, and the verification checklist. Templates, option shapes
  and wiring recipes moved to the knowledge they belong to.
- Tests: 39 unit tests (up from 29) and 23 smoke assertions against the real stdio server (up from
  14), including symbol lookup, the cross-topic alias routing, both new tools and the generated
  package sections.