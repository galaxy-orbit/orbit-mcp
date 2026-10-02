---
name: orbit-framework
description: >
  Guidance for building backend applications with the Orbit framework
  (@galaxy-stack/orbit-*), a NestJS-style framework optimized for the Bun
  runtime. Use when creating modules, controllers, providers, GraphQL APIs,
  microservices, or when migrating from NestJS to Orbit.
version: 1.1.0
# The companion server is installed separately and the harness validates every call against the
# schema it declares, so this skill states the version its documented call shapes need. 0.4.0
# declared orbit_knowledge_read { id } as required and had no symbol argument, which rejected the
# { symbol } and { section } shapes taught below.
requires:
  orbit: ">=0.4.1"
---

# Orbit Framework Skill

Orbit is a NestJS-style backend framework for Bun. Concept mapping:
`@nestjs/common` → `@galaxy-stack/orbit-core` (decorators for controllers, DI and modules)
plus `@galaxy-stack/orbit-common` (parameter/method decorators, guards, pipes, filters, exceptions);
`class-validator` DTOs → Zod + `orbit-validation`; `@nestjs/graphql` → `orbit-graphql`;
`@nestjs/microservices` → `orbit-microservices` + transport packages; `@nestjs/swagger` → `orbit-swagger`.

This file is the always-on rulebook: the rules that are **not derivable from a declaration** and the
routing to everything that is. It is deliberately short. The API inventory, the wiring recipes and the
traps live in the companion MCP server (`@galaxy-stack/orbit-mcp`) and are fetched on demand.

## Ground truth

1. `orbit_knowledge_topics` lists every topic; `orbit_knowledge_read` takes `{ id }`,
   `{ id, section }` or `{ symbol }`. The `api-surface` topic is **generated from the
   installed declarations** — it carries every export of every `@galaxy-stack/orbit-*` package with its
   real signature, interface members and class methods, one section per package.
2. Never open `node_modules/**/*.d.ts` to re-derive a signature the generated surface already has,
   and never read the package READMEs — they contradict their own types (see the `pitfalls` topic).
3. If a symbol or signature is genuinely missing, say so in the final report as a knowledge gap instead of
   silently re-deriving it. The gap is the bug.

## Where the detail lives

| Need | Call |
|---|---|
| What a package exports, with signatures | `{ id: "api-surface", section: "orbit-core" }` (one section per package) |
| One symbol only | `{ symbol: "ThrottlerGuard" }` — names the package and shows the declaration |
| Which versions this project installs vs the ones the surface was generated from | `orbit_environment` (one call, no `package.json` reading) |
| A verified wiring recipe | `orbit_recipe { task: "throttle-per-route" \| "migrations" \| "database-wiring" \| "security-baseline" \| "filters" \| "middleware" \| "zod-validation" }` |
| Request pipeline contracts | `{ section: "pipeline" }` (guards, pipes, interceptors, filters) |
| Application surface, CORS, static files, middleware | `{ section: "application" }` / `{ section: "middleware" }` |
| Database install, wiring, migrations | `{ section: "database" }` / `{ section: "install" }` / `{ section: "migrations" }` |
| Patterns: module, controller, DI, GraphQL, validation, testing, microservices | topics `module-pattern`, `controller-pattern`, `di-pattern`, `graphql-pattern`, `validation-pattern`, `testing-pattern`, `microservices-pattern`, `package-map` |
| Runtime traps and version-specific bugs | topic `pitfalls` |
| Names that do NOT exist (stop searching) | topic `absent` |
| Security hardening checklist | topic `security-checklist` |

Section aliases (`throttler`, `database`, `security`, `migrations`, `versions`,
`exports` …) resolve across topics, so `{ section: "throttler" }` works with or without an `id`.

## Project rules

1. Runtime is Bun. Use `bun`, not `node`/`npm`/`pnpm`: `bun install`, `bun test`,
   `bun run dev` (a developer server for a human, never a verification step).
2. Entry point: `OrbitFactory.create(AppModule)` then `app.listen(3000)`.
3. Every feature is a `@Module({ controllers, providers, exports })` class; providers are
   `@Injectable()` classes injected through the constructor.
4. Validate every external input with a Zod schema through a pipe; see `{ section: "zod-validation" }`.
5. `orbit new` installs no database layer. Pick a shape deliberately (orbit-database + Drizzle, or
   `bun:sqlite` + Drizzle behind your own provider) and say which in the report.
6. Prefixing belongs to the controller path (`@Controller('api/v1/members')`); Orbit has no
   `app.setGlobalPrefix()`.

## Rules a declaration will not tell you

- **Import sources.** Route decorators and `ZodValidationPipe` come from `orbit-core`; parameter and
  method decorators (`Body`, `Param`, `Query`, `Headers`, `HttpCode`, `UsePipes`,
  `UseGuards`, `UseInterceptors`, `Catch`, `UseFilters`), `NotFoundException` and the
  exception classes come from `orbit-common`. Importing them from core throws at runtime.
- **`@Body` takes a field name, never a pipe.** Put `@UsePipes(new ZodValidationPipe(schema))` at
  method level; a method-level pipe runs for every argument, so scope it by `metadata.type === 'body'`
  when the handler also takes `@Param` / `@Query` strings.
- **On orbit-core ≤ 0.2.3, `@HttpCode(n)` masks failure statuses** (the build does
  `status: httpCode || response.status`, so a rejected body still answers 201). Keep `@HttpCode` off
  any handler that can fail and return an explicit `Response` instead. Details: topic `pitfalls`.
- **Two `ExceptionFilter` interfaces exist.** The runtime hands an `ExecutionContext`
  (`getRequest()` / `getResponse()` / `getHandler()` / `getClass()`); the one in
  `orbit-common` typed against a Nest `ArgumentsHost` disagrees with the runtime. Type the second
  parameter `any` and use only those four methods. A filter's return value becomes the response.
- **No global registration.** There is no `useGlobalPipes`, `useGlobalGuards` or
  `useGlobalFilters`. Decorate a shared abstract base controller — class-level decorators are
  inherited through the prototype chain, so you edit one file instead of every controller.
- **Throttling is one import.** `ThrottlerModule.forRoot()` is `global: true` and already provides
  `ThrottlerGuard`; `ThrottlerException` is a plain `Error` that the pipeline maps to 500,
  so add one `@Catch(ThrottlerException)` filter that answers 429. `@Throttle(limit, ttl)` — limit
  first, `ttl` in seconds.
- **Close what you open.** Any script or probe that boots the app or opens the database must close the
  handle and call `process.exit()`, or the command waits until its timeout.
- **Do not run `bunx @galaxy-stack/orbit-cli@latest`.** `bunx` re-resolves from the registry on
  every call and stalls for minutes. The `orbit` and `nebula` binaries are already on `PATH`.
- **The scaffold tools return text.** `orbit_scaffold_module` / `orbit_scaffold_graphql` never write
  files, and the module scaffold wires no database on purpose.

## Security baseline

- `SecurityModule.forRoot({ helmet: {}, csrf: { ignoreMethods: ['GET', 'HEAD'] } })` — OWASP headers plus CSRF.
  `helmet`/`csrf` take an options object or `false`; `{ helmet: true }` is a type error, never a shortcut.
- Rate limiting on auth and write routes: `orbit_recipe { task: "throttle-per-route" }`.
- GraphQL: introspection off in production, `security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 }`.
- Never log secrets; sanitize any stored HTML with the `orbit-security` sanitizer.
- Full checklist: topic `security-checklist`.

## Verification checklist (run before declaring done)

1. `validate_project` passes for the packages you touched.
2. A dev server is not verification evidence. When the task explicitly asks to exercise a running app,
   start it detached with `run_command` (log outside the workspace), probe it with a bounded
   `curl` loop, and stop it before the final validation. This catalog has **no**
   `manage_session` / preview / browser tool — do not spend turns searching for one.
3. Mutating routes have validation and auth; rate limiting where it matters.
4. GraphQL modules have security limits; no secrets in source.

## Companion MCP server

`@galaxy-stack/orbit-mcp` (stdio). Every project on this stack should have it connected:

```json
{ "mcpServers": { "orbit": { "command": "npx", "args": ["-y", "@galaxy-stack/orbit-mcp"] } } }
```
