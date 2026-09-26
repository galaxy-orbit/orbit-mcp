---
name: orbit-framework
description: >
  Guidance for building backend applications with the Orbit framework
  (@galaxy-stack/orbit-*), a NestJS-style framework optimized for the Bun
  runtime. Use when creating modules, controllers, providers, GraphQL APIs,
  microservices, or when migrating from NestJS to Orbit.
version: 0.1.0
---

# Orbit Framework Skill

Orbit is a NestJS-style backend framework for Bun. Concept mapping from NestJS:
`@nestjs/common` → `@galaxy-stack/orbit-core`; `class-validator` DTOs → Zod +
`orbit-validation`; `@nestjs/graphql` → `orbit-graphql`; `@nestjs/microservices`
→ `orbit-microservices` + transport packages; `@nestjs/swagger` → `orbit-swagger`.

## Project rules

1. Runtime is Bun. Use `bun` instead of `node`/`npm`/`pnpm` for all commands:
   `bun install`, `bun run dev`, `bun test`.
2. Entry point: `OrbitFactory.create(AppModule)` then `app.listen(3000)`.
3. Every feature is a `@Module({ controllers, providers, exports })` class.
4. Providers are `@Injectable()` classes injected via constructor.
5. Validate all external input with Zod schemas through ValidationPipe.
6. Tests run with `bun test`; e2e tests boot a real HTTP server: `OrbitFactory.create(AppModule, { port: 0 })` → `app.listen(0)` → `fetch(\`http://127.0.0.1:${app.port}/…\`)` — `OrbitApplication` has no public `handle()`.

## Security baseline (non-negotiable for production code)

- `SecurityModule.forRoot({ helmet: true, csrf: true })` — OWASP headers + CSRF.
- `ThrottlerModule` for rate limiting on auth and write routes.
- GraphQL: `introspection: false` in production; `security: { maxDepth: 10,
  maxComplexity: 1000, maxAliases: 30 }`; playground disabled in production.
- Never log secrets; redact before logging.
- Sanitize any stored HTML with the orbit-security Sanitizer.

## Module template

```ts
import { Module } from '@galaxy-stack/orbit-core';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

## Controller template

```ts
import { Controller, Get, Post, Body, Param, HttpCode, UseGuards } from '@galaxy-stack/orbit-core';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get(':id')
  find(@Param('id') id: string) { return this.users.find(id); }

  @Post()
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateUserDto) { return this.users.create(body); }
}
```

## GraphQL template

```ts
import { Resolver, Query, Mutation, Args } from '@galaxy-stack/orbit-graphql';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() { return this.userService.list(); }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
}
```

Module wiring with security limits:

```ts
GraphQLModule.forRoot({
  autoSchemaFile: true,
  introspection: process.env.NODE_ENV !== 'production',
  security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 },
  resolvers: [UserResolver],
})
```

## Verification checklist (run before declaring done)

1. `bun test` passes.
2. App boots: `bun run dev` shows no startup errors.
3. Mutating routes have validation + auth.
4. GraphQL module has security limits when used.
5. No secrets in source; config comes from ConfigModule/env.

## Deeper reference

Run the companion MCP server (`@galaxy-stack/orbit-mcp`) for searchable
knowledge, scaffolding tools, and a security review tool:

```json
{
  "mcpServers": {
    "orbit": { "command": "bunx", "args": ["@galaxy-stack/orbit-mcp"] }
  }
}
```
