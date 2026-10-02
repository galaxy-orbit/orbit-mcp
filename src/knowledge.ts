/**
 * Orbit framework knowledge base served to AI coding agents over MCP.
 * Content is curated from the official Orbit documentation.
 */

import { API_SURFACE_CONTENT, API_SURFACE_PACKAGES } from './generated/api-surface';

export interface KnowledgeEntry {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export const KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: 'module-pattern',
    title: 'Module pattern',
    summary: 'Organize features into@Module classes with imports/providers/controllers/exports.',
    content: `Every Orbit feature lives in a class decorated with @Module(). The module wires up its own controllers, providers, and child modules:

\`\`\`ts
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule.forRoot({ filename: 'app.db' })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
\`\`\`

Rules:
- providers list everything the module instantiates (services, repositories).
- exports must list providers that other modules may inject.
- imports list other modules (or dynamic modules such as CacheModule.forRoot(...)).
- The root AppModule imports every feature module and nothing else.`,
  },
  {
    id: 'controller-pattern',
    title: 'Controller and route decorators',
    summary: '@Controller for path prefix; @Get/@Post/@Put/@Patch/@Delete for routes; @Body/@Param/@Query for inputs.',
    content: `Controllers declare REST routes. Method argument decorators extract request data:

\`\`\`ts
import { Controller, Get, Post } from '@galaxy-stack/orbit-core';
import { Body, Param, Query, HttpCode } from '@galaxy-stack/orbit-common';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  list(@Query('page') page = '1') {
    return this.users.list(Number(page));
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.users.find(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateUserDto) {
    return this.users.create(body);
  }
}
\`\`\`

Return values are serialized to JSON automatically. Throwing HttpException subclasses sets the status code.`,
  },
  {
    id: 'di-pattern',
    title: 'Dependency injection',
    summary: '@Injectable classes are resolved by constructor; three scopes: singleton (default), request, transient.',
    content: `Mark providers with @Injectable() and inject them through constructor parameters:

\`\`\`ts
@Injectable({ scope: Scope.REQUEST }) // optional scoping
export class UserService {
  constructor(private readonly db: DatabaseService) {}
}
\`\`\`

Scope semantics:
- singleton (default): one instance per application.
- request: one instance per HTTP request.
- transient: a new instance per injection site.

Register providers on a module; import that module elsewhere to gain access to its exported providers.`,
  },
  {
    id: 'graphql-pattern',
    title: 'GraphQL resolvers and security',
    summary: '@Resolver/@Query/@Mutation build the schema; GraphQLModule.forRoot({ security }) enables depth/complexity/alias/introspection guards.',
    content: `Define resolvers with class decorators; Orbit generates the executable schema:

\`\`\`ts
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
\`\`\`

Production hardening (built into GraphQLModule):

\`\`\`ts
GraphQLModule.forRoot({
  introspection: process.env.NODE_ENV !== 'production',
  security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 },
})
\`\`\`

Rules run during validation before any resolver executes: depthLimit, complexityLimit (list fan-out multiplier), aliasLimit, blockIntrospection.`,
  },
  {
    id: 'validation-pattern',
    title: 'Validation with Zod',
    summary: 'Bind a Zod schema with ZodValidationPipe (or ValidationPipe); @Body has no pipe argument.',
    content: `Validate request payloads with Zod. The CLI installs zod@4; the framework pipes accept both the Zod v4 \`issues\` and the legacy v3 \`errors\` error shape.

Import sources: decorators \`Controller/Get/Post/Module\` and the pipe classes \`ValidationPipe/ZodValidationPipe\` come from \`@galaxy-stack/orbit-core\`; parameter and method decorators \`Body/Param/Query/HttpCode/UsePipes/UseGuards\` come from \`@galaxy-stack/orbit-common\`. Importing \`Body\` from orbit-core throws "Export named 'Body' not found".

Simple handler — bind the schema to the pipe at method level:

\`\`\`ts
import { Controller, Post, ZodValidationPipe } from '@galaxy-stack/orbit-core';
import { Body, UsePipes } from '@galaxy-stack/orbit-common';
import { z } from 'zod';

const CreateMemberSchema = z.object({ name: z.string().min(2), email: z.string().email() });

@Controller('members')
export class MembersController {
  @Post()
  @UsePipes(new ZodValidationPipe(CreateMemberSchema))
  create(@Body() dto: z.infer<typeof CreateMemberSchema>) { return this.members.create(dto); }
}
\`\`\`

Rules:
- Do NOT write \`@Body(new ZodValidationPipe(...))\`: \`@Body\` accepts only a field name (\`@Body('name')\`).
- \`@UsePipes\` is method/class level and runs for EVERY argument of the method. When a handler mixes a validated body with \`@Param\`/\`@Query\` strings, write one scoped pipe that checks \`metadata.type === 'body'\` and returns other argument kinds untouched.
- **\`@HttpCode(n)\` masks failure statuses in \`@galaxy-stack/orbit-core\` <= 0.2.3.** The shipped build does
  \`status: httpCode || response.status\`, so a handler decorated \`@HttpCode(201)\` answers **201** even when a pipe
  rejected the body or \`ThrottlerGuard\` rejected the request — the body still carries \`400\`/\`429\` while the
  status says success. Measured on 0.2.3: \`POST\` with a rejecting pipe and no \`@HttpCode\` -> **400**; the same
  handler with \`@HttpCode(201)\` -> **201**; throttling on \`@Get()\` without \`@HttpCode\` -> \`200,200,429,429\`;
  with \`@HttpCode\` -> all 201. The fix (\`response.status >= 400 ? response.status : httpCode\`) is already in
  \`orbit-core/src/router/route-explorer.ts\` but is **not in the published 0.2.3 dist**. Workaround until it ships:
  keep \`@HttpCode\` off any handler that can fail and return an explicit \`Response\` with the success status.
  Do not conclude that \`ZodValidationPipe\` or \`ValidationPipe\` is broken — it is not. The earlier
  "unreliable on Bun" note here was a misdiagnosis of exactly this symptom.
- Invalid input returns 400 through \`BadRequestException\`.`,
  },
  {
    id: 'security-checklist',
    title: 'Security checklist',
    summary: 'Helmet headers, CSRF, rate limiting, validation, GraphQL query limits, JWT auth.',
    content: `Minimum hardening for an Orbit backend:

1. SecurityModule.forRoot({ helmet: {}, csrf: { ignoreMethods: ['GET', 'HEAD'] } }) — sets OWASP-recommended headers (HSTS, nosniff, frameguard, COOP/CORP) and double-submit CSRF. Both options are objects-or-false, never \`true\`: \`helmet?: HelmetOptions | false\`, \`csrf?: CsrfOptions | false\`. Writing \`{ helmet: true, csrf: true }\` is a type error.\n   The members of every option interface are in the generated surface: read \`{ symbol: 'SecurityModuleOptions' }\`, \`{ symbol: 'CsrfOptions' }\`, \`{ symbol: 'HelmetOptions' }\` or \`{ symbol: 'CorsOptions' }\` — do not grep \`node_modules/**/dist/*.js\` to find them (measured: 49 such commands in one run, all of them for options that were already in the surface).
2. ThrottlerModule — per-route or global rate limiting.
3. ValidationPipe with Zod schemas on every @Body input.
4. GraphQLModule: introspection off in production + security limits (depth/complexity/aliases).
5. AuthModule JWT guards on protected controllers: @UseGuards(JwtAuthGuard).
6. Never log secrets; Logger redacts by default.
7. Sanitize any stored HTML (Sanitizer from orbit-security strips script/style).`,
  },
  {
    id: 'database-pattern',
    title: 'Database and repository',
    summary: 'DatabaseModule (Drizzle + bun:sqlite) with Repository pattern and transactions.',
    content: `Register the database once, then use repositories per feature:

\`\`\`ts
DatabaseModule.forRoot({ filename: 'app.db' })

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(db: DatabaseService) { super(db, usersTable); }
}
\`\`\`

- bun:sqlite driver by default — no external database needed for local development.
- Transactions: await this.db.transaction(async tx => { ... }).
- Migrations live in drizzle/ directory; run via CLI.`,
  },
  {
    id: 'testing-pattern',
    title: 'Testing',
    summary: 'OrbitFactory.create(AppModule, { port: 0 }) boots a real HTTP server; bun:test for unit, e2e via fetch on app.port.',
    content: `Unit-test providers directly; integration-test through a REAL HTTP server. There is no separate test factory and OrbitApplication has no handle() — OrbitFactory boots Bun.serve and you fetch it on the ephemeral port:

\`\`\`ts
import { describe, test, expect } from 'bun:test';
import { OrbitFactory } from '@galaxy-stack/orbit-core';

const app = await OrbitFactory.create(AppModule, { port: 0 });
await app.listen(0);
const base = \`http://127.0.0.1:\${app.port}\`;

const res = await fetch(\`\${base}/api/users\`);
expect(res.status).toBe(200);
\`\`\``,
  },
  {
    id: 'package-map',
    title: 'Package map',
    summary: 'All @galaxy-stack/orbit-* packages and what they provide. For the export surface of orbit-core/common/database/security/throttler see the api-surface topic.',
    content: `Export surface: see the **api-surface** topic — it lists what each package exports and the key signatures, so the declarations in node_modules do not have to be read for that.

Core: orbit-core (DI, modules, controllers, pipeline), orbit-common (shared utils), orbit-platform-bun (Bun.serve adapter), orbit-config (@galaxy-stack/orbit-config env/config loader), orbit-validation (Zod pipe).

Data: orbit-database (Drizzle + bun:sqlite), orbit-cache (in-memory/Redis cache manager).

API: orbit-graphql (schema builder + security rules), orbit-graphql-federation (Apollo Federation gateway + subgraphs), orbit-swagger (OpenAPI UI), orbit-websockets (gateway + pubsub).

Microservices: orbit-microservices core plus transports orbit-microservices-{tcp,redis,nats,rmq,kafka,grpc}.

Quality: orbit-auth (JWT), orbit-security (helmet/CSRF/API-key/sanitizer), orbit-throttler, orbit-terminus (health), orbit-schedule (cron), orbit-logger, orbit-telemetry (OTel), orbit-observability (metrics/tracing).

Tooling: orbit-cli (scaffold), orbit-testing, orbit-devtools (dashboard), orbit-mcp (AI guidance server), orbit-docs, vscode-snippets.`,
  },
  {
    id: 'microservices-pattern',
    title: 'Microservices transports',
    summary: 'ClientProxy for RPC/events across 6 transports; server decorators expose handlers.',
    content: `Server side:

\`\`\`ts
@MessageHandler('user.created')
handleUserCreated(payload: any) { ... }

@EventHandler('audit.*')
handleAudit(pattern: string, payload: any) { ... }
\`\`\`

Client side:

\`\`\`ts
constructor(@Inject('USER_CLIENT') private client: ClientProxy) {}
send = this.client.send('user.get', { id: 1 });  // RPC (observable)
emit = this.client.emit('user.created', data);   // fire-and-forget
\`\`\`

Transports: TCP (zero deps), Redis, NATS, RabbitMQ, Kafka, gRPC — each in its own @galaxy-stack/orbit-microservices-* package.`,
  },
  {
    id: 'api-surface',
    title: 'API surface of every orbit package (generated)',
    summary: 'Generated inventory of every export in @galaxy-stack/orbit-*: signatures, interface members and class methods, one section per package, with the versions it was copied from.',
    content: API_SURFACE_CONTENT,
  },
  {
    id: 'recipes',
    title: 'Wiring recipes - verified against a real install',
    summary: 'How the pieces fit together: application surface, middleware/CORS/static, security and throttling wiring, database install and migrations, request pipeline contracts.',
    content: `These recipes were verified end to end against a real install. The generated export inventory lives in the api-surface topic; when a signature here disagrees with your installed declarations, orbit_environment tells you in one call whether your version differs.

### Application API and global registration

- \`OrbitApplication\` (from \`OrbitFactory.create\`) exposes exactly: \`use(middleware, { forRoutes?, exclude? })\`, \`enableCors(CorsOptions?)\`, \`useStaticAssets(Partial<StaticServeOptions>)\`, \`listen(port?)\`, \`close(signal?)\`, \`enableShutdownHooks()\`, \`onShutdown(cb)\`, \`getContainer()\`, \`getServer()\`, \`getRoutes()\`, \`setRoutes()\`, \`setModules()\`, \`setMiddlewareConfigurations()\`.
- There is NO \`useGlobalPipes\`, \`useGlobalGuards\` or \`useGlobalFilters\`: apply \`@UsePipes\`/\`@UseGuards\`/\`@UseFilters\` on the controller (or a shared base controller) or register the class in the module providers. CORS and static assets are app-level calls.
### Middleware, CORS and static serving

- A module registers middleware by implementing \`NestModule\`: \`configure(consumer: MiddlewareConsumer)\` then \`consumer.apply(HelmetMiddleware).forRoutes('*')\`, narrowed with \`.exclude(...)\`; \`apply\` takes \`MiddlewareFunction | MiddlewareClass | GalaxyMiddleware\`.
- Middleware class: \`GalaxyMiddleware.use(request: Request, next: () => Promise<Response>): Promise<Response>\` (alias \`OrbitMiddleware\`).
- \`CorsOptions = { origin?: string | string[] | boolean | ((origin: string) => boolean), methods?, allowedHeaders?, exposedHeaders?, credentials?, maxAge?, preflightContinue?, optionsSuccessStatus? }\`, passed as \`OrbitFactory.create(AppModule, { cors: { ... } })\`.
- \`StaticServeOptions = { root, prefix?, index?, dotFiles?: 'allow'|'deny'|'ignore', maxAge?, immutable?, etag?, lastModified?, cacheMaxSize?, cacheTtl?, cacheDebug? }\`.
### Security and throttling wiring - trust the declarations, not the package READMEs

- \`orbit-security/README.md\` shows \`csrf: { enabled, tokenKey, cookieName }\`, but \`CsrfOptions\` is \`{ cookie?: { name?, path?, httpOnly?, secure?, sameSite?, maxAge? }, ignoreMethods?, getToken?, sessionKey? }\` - there is no \`enabled\` flag (omit \`csrf\` to disable) and the cookie name lives in \`cookie.name\`.
- \`orbit-throttler/README.md\` shows \`new RedisThrottlerStorage(...)\` (the export is \`ThrottlerRedisStorage\`) and a \`throttlers: [...]\` list, but \`ThrottlerModuleOptions\` extends \`ThrottlerOptions\` with only \`storage?\` / \`errorMessage?\` and requires \`ttl\` + \`limit\`.
- Accurate: \`SecurityModule.forRoot({ helmet: { frameguard: { action: 'deny' } }, csrf: { cookie: { name: 'XSRF-TOKEN', httpOnly: true }, ignoreMethods: ['GET'] } })\` and \`ThrottlerModule.forRoot({ ttl: 60, limit: 100, storage: new ThrottlerMemoryStorage() })\`.
- Guards: \`@UseGuards(ApiKeyGuard)\` with \`CanActivate.canActivate(context): boolean | Promise<boolean>\`. Filters: \`@Catch(ThrottlerException)\` + \`ExceptionFilter.catch(exception, host)\` applied with \`@UseFilters\` - without it a throttled request becomes a 500.
- Middleware: a module implements \`configure(consumer: MiddlewareConsumer)\` then \`consumer.apply(HelmetMiddleware).forRoutes('*')\`, narrowed with \`.exclude(...)\`.
- Custom throttler storage implements \`ThrottlerStorage { increment(key, ttl), get(key), reset(key) }\`.
### Database wiring — the concrete pattern

- SQLite lives in \`database\`, not \`url\`: \`DatabaseModule.forRoot({ type: 'sqlite', database: './app.db' })\` (\`:memory:\` accepted).
- Feature module: \`DatabaseModule.forFeature([Member], new Map([[Member, 'members']]))\` — entities plus the entity-to-table map, second argument required.
- Entities: \`@Entity('members')\`, \`@PrimaryGeneratedColumn('increment' | 'uuid')\`, \`@Column({ nullable?: boolean, ... })\`.
- Repositories: prefer the concrete \`DrizzleRepository<T>\` (\`new DrizzleRepository(db, table, Member)\`) over hand-implementing \`BaseRepository<T>\`; the base also declares \`count(where?)\` as abstract, and \`DrizzleRepository\` exposes \`getQueryBuilder()\`, \`getRawDb()\`, \`getTable()\`.
- Transactions: \`@Transactional()\` on a service method wraps the repository calls inside it.
- Data source: \`createDataSource(options)\` / \`BunDataSource\`; inject with the \`DATA_SOURCE\` token for the raw handle.
### Request pipeline contracts (guards, pipes, interceptors, filters)

These are the exact interfaces the pipeline passes around (from
\`orbit-core/dist/pipeline/execution-pipeline.d.ts\`, re-exported by \`orbit-common\`):

\`\`\`ts
interface ExecutionContext {
  getRequest<T = any>(): T;
  getResponse<T = any>(): T;
  getHandler(): Function;
  getClass(): Type;
  switchToHttp(): HttpArgumentsHost;      // { getRequest<T>(): T; getResponse<T>(): T }
}
interface CanActivate { canActivate(context: ExecutionContext): boolean | Promise<boolean>; }
interface PipeTransform<T = any, R = any> { transform(value: T, metadata: ArgumentMetadata): R | Promise<R>; }
interface CallHandler<T = any> { handle(): Promise<T>; }
interface GalaxyInterceptor<T = any, R = any> { intercept(context: ExecutionContext, next: CallHandler<T>): Promise<R> | R; }
interface ExceptionFilter<T = any> { catch(exception: T, context: ExecutionContext): any; }
interface ArgumentMetadata { type: 'body' | 'query' | 'param' | 'custom'; metatype?: Type; data?: string; }
\`\`\`

- The runtime pipeline hands an **\`ExecutionContext\`** to guards, interceptors and the filters it
  resolves — read the request/response with \`context.getRequest()\` / \`context.getResponse()\` (or
  \`context.switchToHttp().getResponse()\`), and the handler/class with \`getHandler()\` / \`getClass()\`.
  The runtime never calls \`getArgs()\` / \`getArgByIndex()\`.
- **Two \`ExceptionFilter\` interfaces ship and they disagree — pick deliberately, there is no third.**
  \`@galaxy-stack/orbit-core\` (\`dist/pipeline/execution-pipeline.d.ts\`) declares
  \`catch(exception, context: ExecutionContext)\`, which is what the pipeline actually passes.
  \`@galaxy-stack/orbit-common\` (\`dist/decorators/catch.decorator.d.ts\`, next to \`Catch\`/\`UseFilters\`)
  declares \`catch(exception, host: ArgumentsHost)\` and that \`ArgumentsHost\` **does** declare
  \`getArgs()\`, \`getArgByIndex()\`, \`getType()\` — calling them throws at runtime. Safe shape: type the
  second parameter \`any\` (or \`ExecutionContext\`) and use only \`getRequest()\`/\`getResponse()\`.
- **Guard context types differ per guard.** A hand-written guard receives \`ExecutionContext\`, but
  \`ThrottlerGuard\` receives its own \`ThrottlerContext\` (\`{ getRequest(): ThrottlerRequest;\`
  \`getResponse(): any; getHandler(): Function; getClass(): any }\`) where
  \`ThrottlerRequest = { ip?: string; headers?: Record<string,string>; url?: string; method?: string }\` —
  a plain object, so \`context.getRequest().headers['x-api-key']\` works and \`.body\` does not exist.
- A filter's \`catch(exception, context)\` **returns whatever becomes the response** (status/body are
  derived from what you return, e.g. \`new Response(JSON.stringify({ error }), { status: 429 })\` for a
  \`ThrottlerException\`).
- Registration: \`@UseGuards/@UsePipes/@UseInterceptors/@UseFilters\` on the handler or controller, or
  provider-level classes; \`ExecutionPipeline\` resolves them per controller and caches the metadata.

### Installing and wiring the database layer

\`orbit new\` does **not** install a database layer. When a task needs one, add both
packages — \`drizzle-orm\` is a **peer dependency** (>=0.29) of \`orbit-database@0.1.x\` and
nothing works without it:

\`\`\`sh
bun add @galaxy-stack/orbit-database drizzle-orm
\`\`\`

Two legitimate shapes:

- **orbit-database + Drizzle** — \`@Entity\`/\`@Column\`, \`DatabaseModule.forRoot/forFeature\`,
  \`DrizzleRepository\`, \`@Transactional\`.
- **Plain \`bun:sqlite\`** — \`import { Database } from 'bun:sqlite'\` behind a token provider
  plus SQL migrations; no peer dependency. Pick one deliberately and say which in the report.

Complete orbit-database wiring, matching the declarations:

\`\`\`ts
// tables.ts — Drizzle tables come from drizzle-orm; the entity decorators point at them
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const membersTable = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

// member.entity.ts
@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('increment') id!: number;
  @Column() name!: string;
}

// members.module.ts
@Module({
  imports: [DatabaseModule.forFeature([Member], new Map([[Member, membersTable]]))],
  controllers: [MembersController],
  providers: [
    MembersService,
    { provide: MemberRepository, useFactory: (db: any) => new MemberRepository(db, membersTable), inject: [DATA_SOURCE] },
  ],
})
export class MembersModule {}

// member.repository.ts — DrizzleRepository(db, table, entityClass)
export class MemberRepository extends DrizzleRepository<Member> {
  constructor(db: any, table: any) { super(db, table, Member); }
}
\`\`\`

App module: \`DatabaseModule.forRoot({ type: 'sqlite', database: './app.db' })\` (\`database\`, not
\`url\`, for SQLite; \`:memory:\` works for tests).

### Migrations with drizzle-kit and the bun:sqlite migrator

Measured gap: agents that picked the Drizzle shape still opened \`orbit-database/dist/**\` and
\`drizzle-orm/bun-sqlite/migrator.d.ts\` because nothing here said how migrations are generated or applied.
This is the whole workflow, and it is what a real GymFlow backend used.

1. Config file at the backend root — \`drizzle-kit\` reads it when you run \`bunx drizzle-kit generate\`:

\`\`\`ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema.ts',   // your sqliteTable definitions
  out: './drizzle',                     // timestamped .sql files land here
  dbCredentials: { url: process.env.DATABASE_FILE ?? \`./app.db\` },
  verbose: true,
  strict: true,
});
\`\`\`

2. Apply them with the bun:sqlite migrator — \`drizzle-orm/bun-sqlite/migrator\` exports \`migrate(db, { migrationsFolder })\`:

\`\`\`ts
// src/database/migrate.ts
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { createDatabase, type AppDatabase } from './client';

/** Resolved from this file so the command works from any working directory. */
export const MIGRATIONS_FOLDER = resolve(import.meta.dir, '../../drizzle');

export function applyMigrations(target: AppDatabase): void {
  migrate(target.db, { migrationsFolder: MIGRATIONS_FOLDER });
}

if (import.meta.main) {
  const connection = createDatabase();
  try {
    applyMigrations(connection);
    console.log(\`Migrated \${databaseFile()}\`);
  } finally {
    connection.sqlite.close();   // bun:sqlite keeps the process alive without this
  }
}
\`\`\`

- Wrap the file in \`if (import.meta.main)\` so importing it in a test does not migrate anything.
- Expose the handle as \`{ db, sqlite }\` from your client module: \`drizzle(sqlite)\` gives the
  drizzle instance, and \`sqlite.close()\` is what lets the process exit.
- Scripts: \`"db:generate": "bunx drizzle-kit generate"\`, \`"db:migrate": "bun run src/database/migrate.ts"\`.
- \`orbit-database\` is optional for this shape. \`DatabaseModule.forRoot/forFeature\` + \`DrizzleRepository\` is the
  other legitimate shape; pick one deliberately and say which in the report.
- A probe or script that boots a server or opens the database must close it and call
  \`process.exit()\` before it ends, or \`run_command\` waits until its timeout. Measured: a boot probe without a
  close burned the full 120s timeout.

### Rate limiting and throttling recipes — the complete wiring

**Pick the mechanism first.** The app-level limiter protects every route in one place; the guard gives
per-route budgets and a 429 with Retry-After.

- App-level limiter (no guard): \`const limiter = rateLimit({ windowMs: 60_000, maxRequests: 100 })\`
  then mount \`limiter.createMiddleware()\` through the middleware machinery
  (\`consumer.apply(limiter.createMiddleware()).forRoutes('*')\` or \`app.use(...)\`).
  \`SlidingWindowRateLimiter\` exposes \`increment(key): boolean\`, \`getInfo(key)\`, \`reset(key)\`,
  \`destroy()\`; \`tokenBucket()\` returns a \`TokenBucketRateLimiter\` with \`consume(key, tokens?)\`.

**Route-level throttling — the whole DI story is one import.** \`ThrottlerModule.forRoot()\` is
\`global: true\` and already registers \`{ provide: THROTTLER_OPTIONS, useValue: options }\`, \`THROTTLER_STORAGE\`,
\`{ provide: THROTTLER_GUARD, useFactory: (options, storage) => new ThrottlerGuard({ ...options, storage }), inject: [THROTTLER_OPTIONS, THROTTLER_STORAGE] }\`
and \`{ provide: ThrottlerGuard, useExisting: THROTTLER_GUARD }\`. **Do not hand-write that factory and do not
construct the guard yourself** — \`@UseGuards(ThrottlerGuard)\` resolves from the container as soon as the
module is imported by the root module:

\`\`\`ts
// app.module.ts
@Module({
  imports: [
    SecurityModule.forRoot({
      helmet: { frameguard: { action: 'deny' } },
      csrf: { cookie: { name: 'XSRF-TOKEN', httpOnly: true, sameSite: 'lax' }, ignoreMethods: ['GET', 'HEAD'] },
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    MembersModule, PackagesModule, PaymentsModule, CheckinsModule,
  ],
})
export class AppModule {}
\`\`\`

**Attach the guard and the 429 filter once, via a shared base controller.** Orbit has no
\`useGlobalGuards\`/\`useGlobalFilters\`, but \`Reflect.getMetadata\` walks the prototype chain, so a
class-level decorator on an abstract base class is inherited by every subclass — one file instead of
re-editing every controller:

\`\`\`ts
// common/guarded.controller.ts
import { Catch, UseFilters, UseGuards, type ExceptionFilter } from '@galaxy-stack/orbit-common';
import { ThrottlerException, ThrottlerGuard } from '@galaxy-stack/orbit-throttler';

/** ThrottlerException extends Error and carries statusCode = 429, but the orbit-core pipeline only
 *  maps HttpException — without this filter a throttled request answers 500. */
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter<ThrottlerException> {
  catch(exception: ThrottlerException, context: any) {
    return new Response(
      JSON.stringify({ statusCode: 429, message: exception.message, retryAfter: exception.retryAfter }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(exception.retryAfter ?? 60) } },
    );
  }
}

@UseGuards(ThrottlerGuard)
@UseFilters(ThrottlerExceptionFilter)
export abstract class GuardedController {}

// members.controller.ts — tighten only the write handlers
@Controller('api/members')
export class MembersController extends GuardedController {
  @Post()
  @Throttle(20, 60)   // limit, ttl — order matters
  create(/* ... */) {}
}
\`\`\`

- \`Throttle(limit, ttl)\` — **limit first**; \`Throttle({ limit, ttl })\` and \`SkipThrottle(skip?)\` also exist. \`ttl\` is **seconds**.
- A filter \`catch(exception, context)\` may return a \`Response\` (used verbatim) or any value that becomes the
  response body via \`transformToResponse\` — return a \`Response\` when you need status 429.
- Custom throttler storage implements \`ThrottlerStorage { increment(key, ttl), get(key), reset(key) }\`;
  memory storage is the default and \`ThrottlerRedisStorage\` targets Redis (the README name
  \`RedisThrottlerStorage\` does not exist).
- Enabling CSRF makes every non-GET request need the token, including your own e2e suite — keep
  \`ignoreMethods: ['GET', 'HEAD']\` and give \`getToken(req)\` when API clients cannot carry cookies.

`,
  },
  {
    id: 'pitfalls',
    title: 'Pitfalls - runtime behaviour the declarations do not tell you',
    summary: 'Measured traps: status codes masked by @HttpCode, the two ExceptionFilter interfaces, throttler DI, missing global registration, and version-specific bugs.',
    content: `Runtime behaviour that contradicts the declarations, plus bugs that are version specific. Every line here was measured against a real install - nothing is inferred. When a signature is missing from the generated surface, report it as a knowledge gap instead of silently reading the declarations.

### HttpCode masks failure statuses (orbit-core <= 0.2.3)
The shipped build does \`status: httpCode || response.status\`, so a handler decorated \`@HttpCode(201)\` answers 201 even when a pipe rejected the body or \`ThrottlerGuard\` rejected the request. Measured on 0.2.3: a rejecting pipe without \`@HttpCode\` answers 400 correctly; the same handler with \`@HttpCode(201)\` answers 201; throttling answers \`200,200,429,429\` without \`@HttpCode\` and 201,201,201 with it. Workaround until the runtime fix ships: keep \`@HttpCode\` off any handler that can fail and return an explicit \`Response\` with the success status. Do not blame \`ZodValidationPipe\`.

### There are two ExceptionFilter interfaces
\`orbit-core\` types a filter against an \`ExecutionContext\` (\`getRequest()\`, \`getResponse()\`, \`getHandler()\`, \`getClass()\`); \`orbit-common\` exports one typed against a Nest \`ArgumentsHost\` that declares \`getArgs()\` / \`getArgByIndex()\` / \`getType()\`. The runtime hands the core interface. Type the second parameter \`any\` and use only the four methods above.

### A filter's return value becomes the response
Return a \`Response\` when you need a specific status; returning a plain object yields 200/204.

### ThrottlerGuard needs DI and a 429 filter
\`ThrottlerModule.forRoot()\` is \`global: true\` and already provides \`THROTTLER_OPTIONS\`, \`THROTTLER_STORAGE\` and \`THROTTLER_GUARD\` - do not hand-write the factory. \`ThrottlerException\` extends \`Error\` and the pipeline only maps \`HttpException\`, so an uncaught rejection answers 500: add one \`@Catch(ThrottlerException)\` filter on a shared base controller. \`@Throttle(limit, ttl)\` takes the limit first and \`ttl\` is seconds.

### No global pipes, guards or filters
There is no \`useGlobalPipes\` / \`useGlobalGuards\` / \`useGlobalFilters\`. Use \`@UsePipes\` / \`@UseGuards\` / \`@UseFilters\` on a shared abstract base controller - \`Reflect.getMetadata\` walks the prototype chain, so class-level decorators are inherited and you edit one file instead of every controller.

### The scaffold tools return text
\`orbit_scaffold_module\` and \`orbit_scaffold_graphql\` generate copy-paste-ready code; they never write files. The module scaffold wires no database on purpose - follow the recipes topic for the real wiring.

### Never run bunx @galaxy-stack/orbit-cli@latest
\`bunx\` re-resolves from the registry on every call and stalls for minutes when it is slow. The \`orbit\` and \`nebula\` binaries are already on \`PATH\`.

### Processes that boot a server or open the database must exit
Close the handle (\`sqlite.close()\`) and call \`process.exit()\` in any script or probe that boots the app, or \`run_command\` waits until its timeout - measured: a boot probe without a close burned the full 120s.

### The package READMEs contradict their own types
\`trust the declarations, not the READMEs\` is literal: \`security/README.md\` teaches \`csrf: { enabled, tokenKey, cookieName }\` and \`throttler/README.md\` teaches \`throttlers: [...]\` and \`RedisThrottlerStorage\`; none of those exist. The generated api-surface topic is the authority.`,
  },
  {
    id: 'absent',
    title: 'What does NOT exist - stop searching for it',
    summary: 'The NestJS APIs and the wrong symbol names agents keep looking for; each one has a real replacement.',
    content: `Everything below was searched for in real runs and does not exist in Orbit. If you are about to look for one of these, stop and use the replacement; if something you need is missing from the generated surface, report it as a knowledge gap.

### APIs that are NestJS, not Orbit
- \`app.setGlobalPrefix(...)\` - the prefix belongs to the controller path: \`@Controller('api/v1/members')\`.
- \`app.useGlobalPipes\` / \`app.useGlobalGuards\` / \`app.useGlobalFilters\` - decorate a shared abstract base controller instead.
- \`app.handle(Request)\` for e2e - \`OrbitApplication\` has no public \`handle()\`; boot with \`OrbitFactory.create(AppModule, { port: 0 })\` and \`fetch\` the real port.

### Symbol names that look right but are wrong
- \`NotFoundError\` - the class is \`NotFoundException\` (orbit-common).
- \`RedisThrottlerStorage\` - the export is \`ThrottlerRedisStorage\`.
- \`throttlers: [...]\` and \`csrf: { enabled, tokenKey, cookieName }\` - README-only shapes; the real option interfaces are in the generated api-surface topic.
- \`ThrottlerModuleOptions.ttl\` / \`.limit\` are not own members - they are inherited from \`ThrottlerOptions\` via \`extends\`.

### Imports that will not resolve
- \`Body\`, \`Param\`, \`Query\`, \`HttpCode\`, \`UseGuards\`, \`UsePipes\`, \`Catch\` from \`@galaxy-stack/orbit-core\` - these live in \`@galaxy-stack/orbit-common\`; importing them from core throws \`Export named '...' not found\`.
- \`@Body(new ZodValidationPipe(schema))\` - \`@Body\` takes an optional field name only; put the pipe at method level with \`@UsePipes(...)\`.

### Capabilities this CLI does not have
- There is no \`manage_session\`, \`preview\` or browser/perception tool in the catalog. To exercise a running app, start it detached with \`run_command\` and probe it with \`curl\`, then stop it.
- The scaffold flag \`withDatabase\` does not exist (it never did anything); wire the database with \`DatabaseModule\` + \`DrizzleRepository\` per the recipes topic.`,
  },
];

export interface KnowledgeSection {
  id: string;
  title: string;
  body: string;
}

/**
 * Split a topic into addressable sections so an agent can re-fetch only the part it needs
 * after a context compaction instead of the whole topic. The preamble before the first
 * `### ` heading becomes a section too (id `exports` when it is an export list).
 */
export function sectionsOf(entry: KnowledgeEntry): KnowledgeSection[] {
  const lines = entry.content.split("\n");
  const sections: KnowledgeSection[] = [];
  let title: string | null = null;
  let buffer: string[] = [];
  const flush = () => {
    const body = buffer.join("\n").trim();
    if (!body) return;
    const resolvedTitle = title ?? entry.title;
    sections.push({ id: slug(resolvedTitle), title: resolvedTitle, body });
  };
  for (const line of lines) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      title = heading[1];
      buffer = [];
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Short aliases so an agent can ask for the part it needs without knowing the full heading,
 * e.g. section: "throttler" instead of "rate-limiting-and-throttling-recipes-the-complete-wiring".
 */
const SECTION_ALIASES: Record<string, string> = {
  exports: 'export-surface',
  api: 'export-surface',
  application: 'application-api-and-global-registration',
  middleware: 'middleware-cors-and-static-serving',
  cors: 'middleware-cors-and-static-serving',
  security: 'security-and-throttling-wiring-trust-the-declarations-not-th',
  database: 'database-wiring-the-concrete-pattern',
  db: 'installing-and-wiring-the-database-layer',
  pipeline: 'request-pipeline-contracts-guards-pipes-interceptors-filters',
  guards: 'request-pipeline-contracts-guards-pipes-interceptors-filters',
  filters: 'request-pipeline-contracts-guards-pipes-interceptors-filters',
  install: 'installing-and-wiring-the-database-layer',
  migrations: 'migrations-with-drizzle-kit-and-the-bun-sqlite-migrator',
  migrate: 'migrations-with-drizzle-kit-and-the-bun-sqlite-migrator',
  versions: 'compiled-against',
  throttler: 'rate-limiting-and-throttling-recipes-the-complete-wiring',
  'rate-limit': 'rate-limiting-and-throttling-recipes-the-complete-wiring',
};

/** Aliases that live in the recipes topic rather than in whichever topic is being read. */
const RECIPE_ALIASES = [
  'application', 'middleware', 'cors', 'security', 'database', 'db', 'install',
  'migrations', 'migrate', 'pipeline', 'guards', 'filters', 'throttler', 'rate-limit',
];

/**
 * Cross-topic alias table: what an agent asks for -> the topic and section that actually
 * hold it. The generated surface and the hand-written recipes are separate topics, so a read
 * that names only a section (no id) has to be routed, not guessed. One alias per generated
 * package section is derived from the generated package list, so adding a package adds its
 * shortcut.
 */
export const TOPIC_ALIASES: Record<string, { topic: string; section: string }> = (() => {
  const table: Record<string, { topic: string; section: string }> = {
    api: { topic: 'api-surface', section: 'export-surface' },
    exports: { topic: 'api-surface', section: 'export-surface' },
    versions: { topic: 'api-surface', section: 'compiled-against' },
    'compiled-against': { topic: 'api-surface', section: 'compiled-against' },
  };
  for (const alias of RECIPE_ALIASES) table[alias] = { topic: 'recipes', section: SECTION_ALIASES[alias] };
  for (const entry of API_SURFACE_PACKAGES) table[entry.name] = { topic: 'api-surface', section: entry.name };
  return table;
})();

/**
 * Task -> section for orbit_recipe. Deliberately small and explicit: a task an agent actually
 * asks for ("throttle a route", "add migrations") resolves to the one section that answers it,
 * instead of a keyword search over prose.
 */
export const RECIPE_TASKS: Record<string, { topic: string; section: string }> = {
  'throttle-per-route': { topic: 'recipes', section: SECTION_ALIASES['throttler'] },
  'rate-limit': { topic: 'recipes', section: SECTION_ALIASES['throttler'] },
  throttling: { topic: 'recipes', section: SECTION_ALIASES['throttler'] },
  'security-baseline': { topic: 'recipes', section: SECTION_ALIASES['security'] },
  helmet: { topic: 'security-checklist', section: 'security-checklist' },
  csrf: { topic: 'security-checklist', section: 'security-checklist' },
  'security-module-options': { topic: 'api-surface', section: 'orbit-security' },
  'security-options': { topic: 'api-surface', section: 'orbit-security' },
  'csrf-options': { topic: 'api-surface', section: 'orbit-security' },
  'helmet-options': { topic: 'api-surface', section: 'orbit-security' },
  'cors-options': { topic: 'api-surface', section: 'orbit-core' },
  'database-wiring': { topic: 'recipes', section: SECTION_ALIASES['database'] },
  'install-database': { topic: 'recipes', section: SECTION_ALIASES['install'] },
  migrations: { topic: 'recipes', section: SECTION_ALIASES['migrations'] },
  'drizzle-migrations': { topic: 'recipes', section: SECTION_ALIASES['migrations'] },
  'application-surface': { topic: 'recipes', section: SECTION_ALIASES['application'] },
  middleware: { topic: 'recipes', section: SECTION_ALIASES['middleware'] },
  cors: { topic: 'recipes', section: SECTION_ALIASES['middleware'] },
  'static-files': { topic: 'recipes', section: SECTION_ALIASES['middleware'] },
  filters: { topic: 'recipes', section: SECTION_ALIASES['pipeline'] },
  guards: { topic: 'recipes', section: SECTION_ALIASES['pipeline'] },
  'request-pipeline': { topic: 'recipes', section: SECTION_ALIASES['pipeline'] },
  'zod-validation': { topic: 'validation-pattern', section: 'validation-pattern' },
  'e2e-test': { topic: 'testing-pattern', section: 'testing-pattern' },
  graphql: { topic: 'graphql-pattern', section: 'graphql-pattern' },
  microservices: { topic: 'microservices-pattern', section: 'microservices-pattern' },
  'status-code-bug': { topic: 'pitfalls', section: 'httpcode-masks-failure-statuses-orbit-core-0-2-3' },
  'wrong-import': { topic: 'absent', section: 'imports-that-will-not-resolve' },
  'nest-apis-that-do-not-exist': { topic: 'absent', section: 'apis-that-are-nestjs-not-orbit' },
};

export function sectionAliases(): string[] {
  return [...new Set([...Object.keys(SECTION_ALIASES), ...Object.keys(TOPIC_ALIASES), ...Object.keys(RECIPE_TASKS)])].sort();
}

export function findSection(entry: KnowledgeEntry, section: string): KnowledgeSection | undefined {
  const wanted = slug(section);
  const sections = sectionsOf(entry);
  const aliased = SECTION_ALIASES[wanted];
  if (aliased) {
    const hit = sections.find(s => s.id === aliased);
    if (hit) return hit;
  }
  return (
    sections.find(s => s.id === wanted) ??
    sections.find(s => s.id.startsWith(wanted) || wanted.startsWith(s.id))
  );
}

export function getKnowledge(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE.find(k => k.id === id);
}