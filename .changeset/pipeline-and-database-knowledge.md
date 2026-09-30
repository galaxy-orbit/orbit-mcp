---
"@galaxy-stack/orbit-mcp": minor
---

Teach the two gaps a fresh end-to-end run still hit after 0.2.0.

- **Installing and wiring the database layer.** `orbit new` does not install a database
  layer, and `@galaxy-stack/orbit-database@0.1.x` peer-requires `drizzle-orm >=0.29`, so a
  project that adds only the Orbit package cannot use it. The knowledge now gives the
  two-package install, the plain `bun:sqlite` alternative, and a complete wiring example
  (Drizzle table, entity, `forFeature([Entity], new Map([[Entity, table]]))`,
  `DrizzleRepository(db, table, Entity)`, and `forRoot({ type: 'sqlite', database })`).
  A run without it read 26 declaration files for exactly this.
- **Request pipeline contracts.** The pipeline hands an `ExecutionContext`
  (`getRequest`, `getResponse`, `getHandler`, `getClass`, `switchToHttp`) to guards,
  interceptors and filters, and there is **no** `getArgs()`, `getArgByIndex()` or
  `switchToRpc()` — a security step grepped for those non-existent helpers because the
  knowledge did not say so. The topic now carries the exact `CanActivate`,
  `PipeTransform`, `CallHandler`, `GalaxyInterceptor`, `ExceptionFilter` and
  `ArgumentMetadata` interfaces, and the note that a filter's return value becomes the
  response (map `ThrottlerException` to 429).
