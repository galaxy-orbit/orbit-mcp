/**
 * Orbit framework knowledge base served to AI coding agents over MCP.
 * Content is curated from the official Orbit documentation.
 */

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
- \`createZodDto(schema)\` + class-level \`ValidationPipe\` is unreliable on Bun: it reads the parameter metatype from \`design:paramtypes\`, which Bun does not emit, so validation silently does not run. Prefer \`ZodValidationPipe\` or the scoped pipe.
- Invalid input returns 400 through \`BadRequestException\`.`,
  },
  {
    id: 'security-checklist',
    title: 'Security checklist',
    summary: 'Helmet headers, CSRF, rate limiting, validation, GraphQL query limits, JWT auth.',
    content: `Minimum hardening for an Orbit backend:

1. SecurityModule.forRoot({ helmet: true, csrf: true }) — sets OWASP-recommended headers (HSTS, nosniff, frameguard, COOP/CORP) and double-submit CSRF.
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
    title: 'API surface of the core packages',
    summary: 'What orbit-core, orbit-common, orbit-database, orbit-security and orbit-throttler export, with key signatures.',
    content: `Compiled from the installed declarations so agents do not have to re-derive it. Installed versions still come from each package's package.json.

**@galaxy-stack/orbit-core**
- App: \`OrbitFactory.create(AppModule, options?)\` -> \`OrbitApplication\` (\`app.listen()\`, \`app.port\`). Options: \`port\`, \`hostname\`, \`logger\`, \`cors\`, \`security\` (secure response headers ON by default; \`false\` disables). Aliases \`BunFactory\`/\`GalaxyFactory\`.
- DI/modules: \`Module\`, \`Injectable\`, \`Inject\`, \`Optional\`, \`forwardRef\`, \`Container\`, \`Scope\`, provider shapes.
- Controllers: \`Controller\`, \`Get|Post|Put|Patch|Delete|Head|Options|All\`, \`HttpMethod\`.
- Versioning: \`versioningManager.configure({ type: 'uri'|'header'|'media'|'custom', defaultVersion?, header?, key?, prefix? })\`, \`Version\`, \`VERSION_NEUTRAL\`. There is no \`app.setGlobalPrefix\` - the prefix belongs to \`@Controller('api/...')\`.
- Config: \`ConfigModule\`, \`registerAs\`, \`ConfigService\`, tokens \`CONFIG_OPTIONS\`, \`CONFIGURATION_TOKEN\`, \`CONFIGURATION_SERVICE_TOKEN\`.
- Cluster/telemetry: \`ClusterManager\`, \`isPrimaryProcess\`, \`isWorkerProcess\`, \`notifyReady\`, \`onShutdown\`; \`onRequestTelemetry\`, \`emitRequestTelemetry\`.

**@galaxy-stack/orbit-common**
- Parameters: \`Body\`, \`Query\`, \`Param\`, \`Headers\`, \`Req\`/\`Request\`, \`Res\`/\`Response\`, \`Ip\`, \`Session\`, \`UploadedFile(s)\` - these come from orbit-common, NOT orbit-core.
- Guards/pipes/interceptors/filters: \`UseGuards\`, \`UsePipes\`, \`UseInterceptors\`, \`CanActivate\`, \`PipeTransform\`, \`CallHandler\`, \`OrbitInterceptor\`, \`Catch\`, \`UseFilters\`, \`ExceptionFilter\`, \`ArgumentsHost\`.
- Response: \`HttpCode\`, \`Header\`, \`Redirect\`, \`Render\`.
- Transforms: \`Transform\`, \`ToInt\`, \`ToFloat\`, \`ToBoolean\`, \`ToDate\`, \`ToLowerCase\`, \`ToUpperCase\`, \`Trim\`, \`ToArray\`, \`DefaultValue\`.
- Exceptions: \`HttpException\` plus \`BadRequest|Unauthorized|Forbidden|NotFound|MethodNotAllowed|NotAcceptable|Conflict|Gone|PayloadTooLarge|UnsupportedMediaType|UnprocessableEntity|InternalServerError|NotImplemented|BadGateway|ServiceUnavailable|GatewayTimeout\` and \`Exception\`.
- Secure headers: \`buildSecureHeaders\`, \`applySecureHeaderRecord\`, \`withSecureHeaders\`.

**@galaxy-stack/orbit-database**
- \`DatabaseModule.forRoot({ type: 'sqlite'|'postgres'|'mysql'|'libsql'|'mongodb', url?, host?, port?, database?, username?, password?, ssl?, pool?, logging?, isGlobal? })\`; \`forRootAsync({ useFactory, inject, imports, isGlobal })\`; \`forFeature(entities, tableMapping: Map<entity, table>)\` - the second argument is required.
- Decorators: \`Entity(options|'table')\`, \`Column(options)\`, \`PrimaryKey\`, \`PrimaryGeneratedColumn('increment'|'uuid')\`, \`InjectRepository(Entity)\`, \`Transactional\`.
- Data source: \`createDataSource(options)\` / \`BunDataSource\`; tokens \`DATABASE_OPTIONS\`, \`DATA_SOURCE\`.
- Repositories: extend \`BaseRepository<T>\` (or \`DrizzleRepository\`) supplying \`db\`/\`table\`; implement \`findAll/findOne(id)/findBy(where)/create(entity)/update(id, patch)/delete(id)\`; helpers \`getTableName/getPrimaryKey/getColumns\`.

**@galaxy-stack/orbit-security**
- \`SecurityModule.forRoot({ helmet?, csrf?, isGlobal? })\` / \`forRootAsync({ useFactory, inject, imports, isGlobal })\`; tokens \`HELMET_MIDDLEWARE\`, \`CSRF_MIDDLEWARE\`, \`CRYPTO_UTILS\`, \`SECURITY_MODULE_OPTIONS\`.
- Rate limiting: \`rateLimit(options?)\` (sliding window), \`tokenBucket(options?)\`.
- Sanitizing: \`escapeHtml\`, \`sanitizeHtml\`, \`detectSqlInjection\`, \`detectXss\`, \`sanitizeString\`, \`sanitizeObject\`, \`SanitizationPipe\`, \`XssPipe\`, \`SqlInjectionPipe\`.
- API keys: \`ApiKeyManager\`, \`createApiKeyManager({ prefix?, length?, charset?, expiresIn?, hashAlgorithm? })\`, \`ApiKeyRotationScheduler\`; crypto \`CryptoUtils\`.

**@galaxy-stack/orbit-throttler**
- \`ThrottlerModule.forRoot(options)\` / \`forRootAsync\`; tokens \`THROTTLER_OPTIONS\`, \`THROTTLER_GUARD\`, \`THROTTLER_STORAGE\`; \`ThrottlerGuard\` rejects with \`ThrottlerException\` (an Error, so an unmapped rejection surfaces as a 500); storage \`ThrottlerMemoryStorage\` / \`ThrottlerRedisStorage\`; decorators \`Throttle(limit, ttl)\`, \`SkipThrottle(skip?)\`.

If a signature you need is missing here, report it as a knowledge gap instead of silently reading the declarations.`,
  },
];

export function getKnowledge(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE.find(k => k.id === id);
}
