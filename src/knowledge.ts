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
import { Controller, Get, Post, Body, Param, Query, HttpCode } from '@galaxy-stack/orbit-core';

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
    summary: 'OrbitTestFactory boots an isolated app; bun:test for unit, e2e via handle(Request).',
    content: `Unit-test providers directly; integration-test through the HTTP surface:

\`\`\`ts
import { describe, test, expect } from 'bun:test';

describe('UserService', () => {
  test('creates a user', () => {
    const service = new UserService(new InMemoryDb());
    expect(service.create({ name: 'a' }).id).toBeDefined();
  });
});
\`\`\`

E2E: build the module, get the handler, pass a Request:

\`\`\`ts
const module = await OrbitTestFactory.create(AppModule).compile();
const app = module.get(OrbitApplication);
const res = await app.handle(new Request('http://localhost/users'));
expect(res.status).toBe(200);
\`\`\``,
  },
  {
    id: 'package-map',
    title: 'Package map',
    summary: 'All @galaxy-stack/orbit-* packages and what they provide.',
    content: `Core: orbit-core (DI, modules, controllers, pipeline), orbit-common (shared utils), orbit-platform-bun (Bun.serve adapter), orbit-config (@galaxy-stack/orbit-config env/config loader), orbit-validation (Zod pipe).

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
];

export function getKnowledge(id: string): KnowledgeEntry | undefined {
  return KNOWLEDGE.find(k => k.id === id);
}
