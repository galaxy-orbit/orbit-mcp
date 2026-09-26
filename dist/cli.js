#!/usr/bin/env node
// @bun

// src/knowledge.ts
var KNOWLEDGE = [
  {
    id: "module-pattern",
    title: "Module pattern",
    summary: "Organize features into@Module classes with imports/providers/controllers/exports.",
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
- The root AppModule imports every feature module and nothing else.`
  },
  {
    id: "controller-pattern",
    title: "Controller and route decorators",
    summary: "@Controller for path prefix; @Get/@Post/@Put/@Patch/@Delete for routes; @Body/@Param/@Query for inputs.",
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

Return values are serialized to JSON automatically. Throwing HttpException subclasses sets the status code.`
  },
  {
    id: "di-pattern",
    title: "Dependency injection",
    summary: "@Injectable classes are resolved by constructor; three scopes: singleton (default), request, transient.",
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

Register providers on a module; import that module elsewhere to gain access to its exported providers.`
  },
  {
    id: "graphql-pattern",
    title: "GraphQL resolvers and security",
    summary: "@Resolver/@Query/@Mutation build the schema; GraphQLModule.forRoot({ security }) enables depth/complexity/alias/introspection guards.",
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

Rules run during validation before any resolver executes: depthLimit, complexityLimit (list fan-out multiplier), aliasLimit, blockIntrospection.`
  },
  {
    id: "security-checklist",
    title: "Security checklist",
    summary: "Helmet headers, CSRF, rate limiting, validation, GraphQL query limits, JWT auth.",
    content: `Minimum hardening for an Orbit backend:

1. SecurityModule.forRoot({ helmet: true, csrf: true }) \u2014 sets OWASP-recommended headers (HSTS, nosniff, frameguard, COOP/CORP) and double-submit CSRF.
2. ThrottlerModule \u2014 per-route or global rate limiting.
3. ValidationPipe with Zod schemas on every @Body input.
4. GraphQLModule: introspection off in production + security limits (depth/complexity/aliases).
5. AuthModule JWT guards on protected controllers: @UseGuards(JwtAuthGuard).
6. Never log secrets; Logger redacts by default.
7. Sanitize any stored HTML (Sanitizer from orbit-security strips script/style).`
  },
  {
    id: "database-pattern",
    title: "Database and repository",
    summary: "DatabaseModule (Drizzle + bun:sqlite) with Repository pattern and transactions.",
    content: `Register the database once, then use repositories per feature:

\`\`\`ts
DatabaseModule.forRoot({ filename: 'app.db' })

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(db: DatabaseService) { super(db, usersTable); }
}
\`\`\`

- bun:sqlite driver by default \u2014 no external database needed for local development.
- Transactions: await this.db.transaction(async tx => { ... }).
- Migrations live in drizzle/ directory; run via CLI.`
  },
  {
    id: "testing-pattern",
    title: "Testing",
    summary: "OrbitFactory.create(AppModule, { port: 0 }) boots a real HTTP server; bun:test for unit, e2e via fetch on app.port.",
    content: `Unit-test providers directly; integration-test through a REAL HTTP server. There is no separate test factory and OrbitApplication has no handle() \u2014 OrbitFactory boots Bun.serve and you fetch it on the ephemeral port:

\`\`\`ts
import { describe, test, expect } from 'bun:test';
import { OrbitFactory } from '@galaxy-stack/orbit-core';

const app = await OrbitFactory.create(AppModule, { port: 0 });
await app.listen(0);
const base = \`http://127.0.0.1:\${app.port}\`;

const res = await fetch(\`\${base}/api/users\`);
expect(res.status).toBe(200);
\`\`\``
  },
  {
    id: "package-map",
    title: "Package map",
    summary: "All @galaxy-stack/orbit-* packages and what they provide.",
    content: `Core: orbit-core (DI, modules, controllers, pipeline), orbit-common (shared utils), orbit-platform-bun (Bun.serve adapter), orbit-config (@galaxy-stack/orbit-config env/config loader), orbit-validation (Zod pipe).

Data: orbit-database (Drizzle + bun:sqlite), orbit-cache (in-memory/Redis cache manager).

API: orbit-graphql (schema builder + security rules), orbit-graphql-federation (Apollo Federation gateway + subgraphs), orbit-swagger (OpenAPI UI), orbit-websockets (gateway + pubsub).

Microservices: orbit-microservices core plus transports orbit-microservices-{tcp,redis,nats,rmq,kafka,grpc}.

Quality: orbit-auth (JWT), orbit-security (helmet/CSRF/API-key/sanitizer), orbit-throttler, orbit-terminus (health), orbit-schedule (cron), orbit-logger, orbit-telemetry (OTel), orbit-observability (metrics/tracing).

Tooling: orbit-cli (scaffold), orbit-testing, orbit-devtools (dashboard), orbit-mcp (AI guidance server), orbit-docs, vscode-snippets.`
  },
  {
    id: "microservices-pattern",
    title: "Microservices transports",
    summary: "ClientProxy for RPC/events across 6 transports; server decorators expose handlers.",
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

Transports: TCP (zero deps), Redis, NATS, RabbitMQ, Kafka, gRPC \u2014 each in its own @galaxy-stack/orbit-microservices-* package.`
  }
];

// src/tools.ts
var TOOLS = [
  {
    name: "orbit_knowledge_topics",
    annotations: { title: "orbit knowledge topics", readOnlyHint: true },
    description: "List all available Orbit framework knowledge topics with summaries.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "orbit_knowledge_read",
    annotations: { title: "orbit knowledge read", readOnlyHint: true },
    description: "Read one Orbit knowledge topic by id (use orbit_knowledge_topics first).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Topic id from orbit_knowledge_topics" }
      },
      required: ["id"]
    }
  },
  {
    name: "orbit_scaffold_module",
    annotations: { title: "orbit scaffold module", readOnlyHint: true },
    description: "Generate a complete Orbit feature module (module, controller, service, optional Zod DTO and tests) as copy-paste-ready code.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: 'Feature name in kebab-case, e.g. "user"' },
        withDatabase: { type: "boolean", description: "Include a Drizzle table + repository (bun:sqlite)" },
        withTests: { type: "boolean", description: "Include unit + e2e test files" },
        withSwagger: { type: "boolean", description: "Include OpenAPI decorators" }
      },
      required: ["name"]
    }
  },
  {
    name: "orbit_scaffold_graphql",
    annotations: { title: "orbit scaffold graphql", readOnlyHint: true },
    description: "Generate a GraphQL feature: resolver, object types, input types, and module wiring with security limits.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Feature name in kebab-case" },
        withLoaders: { type: "boolean", description: "Include DataLoader wiring" }
      },
      required: ["name"]
    }
  },
  {
    name: "orbit_security_review",
    annotations: { title: "orbit security review", readOnlyHint: true },
    description: "Run a static checklist against pasted source code and report missing security hardening with concrete fixes.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Source code to review" },
        context: { type: "string", enum: ["rest", "graphql", "both"], description: "Surface to review" }
      },
      required: ["code"]
    }
  }
];
function pascal(name) {
  return name.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}
var DOCS_STAMP = `> orbit-mcp docs \u2014 ngu\u1ED3n ch\xEDnh th\u1EE9c cho API c\u1EE7a @galaxy-stack/orbit-core 0.2.x. C\xE0i \u0111\u1EB7t: \`bun add @galaxy-stack/orbit-core\` (bun t\u1EF1 ch\u1ECDn version m\u1EDBi nh\u1EA5t, kh\xF4ng c\u1EA7n npm view \u0111\u1EC3 pin). Sau khi c\xE0i, tra exports th\u1EADt b\u1EB1ng c\xE1ch \u0111\u1ECDc .d.ts trong node_modules (\u0111\u01B0\u1EE3c ph\xE9p) \u2014 KH\xD4NG \u0111\u1ECDc source .js hay grep c\u1EA3 c\xE2y node_modules.
`;
function executeTool(name, args) {
  const text = (t) => ({ content: [{ type: "text", text: t }] });
  switch (name) {
    case "orbit_knowledge_topics":
      return text(`${DOCS_STAMP}
${KNOWLEDGE.map((k) => `- **${k.id}** \u2014 ${k.title}: ${k.summary}`).join(`
`)}`);
    case "orbit_knowledge_read": {
      const entry = KNOWLEDGE.find((k) => k.id === args.id);
      if (!entry)
        return text(`Unknown topic "${args.id}". Use orbit_knowledge_topics to list ids.`);
      return text(`# ${entry.title}

${DOCS_STAMP}
${entry.content}`);
    }
    case "orbit_scaffold_module": {
      const name2 = String(args.name || "feature");
      const kebab = name2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      const cls = pascal(name2);
      const files = [];
      files.push(`// src/${kebab}/${kebab}.module.ts
import { Module } from '@galaxy-stack/orbit-core';
import { ${cls}Controller } from './${kebab}.controller';
import { ${cls}Service } from './${kebab}.service';

@Module({
  controllers: [${cls}Controller],
  providers: [${cls}Service],
  exports: [${cls}Service],
})
export class ${cls}Module {}`);
      files.push(`// src/${kebab}/${kebab}.service.ts
import { Injectable } from '@galaxy-stack/orbit-core';

export interface Create${cls}Input {
  name: string;
}

@Injectable()
export class ${cls}Service {
  private readonly items = new Map<string, { id: string; name: string }>();

  list() { return [...this.items.values()]; }

  find(id: string) { return this.items.get(id); }

  create(input: Create${cls}Input) {
    const item = { id: crypto.randomUUID(), name: input.name };
    this.items.set(item.id, item);
    return item;
  }
}`);
      files.push(`// src/${kebab}/${kebab}.controller.ts
import { Controller, Get, Post, Body, Param, NotFoundError } from '@galaxy-stack/orbit-core';
import { ${cls}Service } from './${kebab}.service';

@Controller('${kebab}')
export class ${cls}Controller {
  constructor(private readonly service: ${cls}Service) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  find(@Param('id') id: string) {
    const item = this.service.find(id);
    if (!item) throw new NotFoundError('${cls} not found');
    return item;
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: { name: string }) { return this.service.create(body); }
}`);
      if (args.withTests) {
        files.push(`// src/${kebab}/${kebab}.service.test.ts
import { describe, test, expect } from 'bun:test';
import { ${cls}Service } from './${kebab}.service';

describe('${cls}Service', () => {
  test('creates and finds items', () => {
    const service = new ${cls}Service();
    const created = service.create({ name: 'demo' });
    expect(service.find(created.id)?.name).toBe('demo');
  });
});`);
      }
      return text(files.join(`

`));
    }
    case "orbit_scaffold_graphql": {
      const name2 = String(args.name || "feature");
      const kebab = name2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      const cls = pascal(name2);
      const loader = args.withLoaders ? `
  @ResolveField(() => Author)
  author(@Parent() parent: ${cls}, @Loader('authorLoader') loader: DataLoader) {
    return loader.load(parent.authorId);
  }` : "";
      return text(`// src/${kebab}/${kebab}.resolver.ts
import { Resolver, Query, Mutation, Args${args.withLoaders ? ", ResolveField, Parent, Loader" : ""} } from '@galaxy-stack/orbit-graphql';
${args.withLoaders ? `import { DataLoader } from '@galaxy-stack/orbit-graphql';
` : ""}
@Resolver(() => ${cls})
export class ${cls}Resolver {
  constructor(private readonly service: ${cls}Service) {}

  @Query(() => [${cls}])
  ${kebab}() { return this.service.list(); }

  @Mutation(() => ${cls})
  create${cls}(@Args('input') input: Create${cls}Input) {
    return this.service.create(input);
  }${loader}
}

// Module wiring with production security limits:
// GraphQLModule.forRoot({
//   introspection: process.env.NODE_ENV !== 'production',
//   security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 },
//   resolvers: [${cls}Resolver],
// })`);
    }
    case "orbit_security_review": {
      const code = String(args.code || "");
      const surface = args.context || "both";
      const findings = [];
      const has = (re) => re.test(code);
      if (surface !== "graphql" && has(/@(Post|Put|Patch|Delete)\(/)) {
        if (!has(/ValidationPipe|Zod|schema\.parse|@Is/))
          findings.push("[HIGH] Mutation endpoints lack input validation. Add ValidationPipe with a Zod schema: @UsePipes(new ValidationPipe(schema)) on the handler or module.");
        if (!has(/UseGuards|AuthGuard|jwt|session/i))
          findings.push("[HIGH] State-changing endpoint without an auth guard. Add @UseGuards(JwtAuthGuard) or equivalent.");
        if (!has(/Throttle|RateLimit|throttler/i))
          findings.push("[MEDIUM] No rate limiting on writes. Enable ThrottlerModule globally or @Throttle() per route.");
      }
      if (surface !== "rest" && has(/GraphQLModule|@Resolver\(/)) {
        if (has(/introspection:\s*true/))
          findings.push("[HIGH] introspection: true hardcoded \u2014 expose it only outside production.");
        if (!has(/security:\s*{|maxDepth|maxComplexity/))
          findings.push("[HIGH] GraphQLModule without security limits. Add security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 }.");
        if (has(/playground:\s*true/))
          findings.push("[MEDIUM] Playground enabled \u2014 disable in production.");
      }
      if (has(/password|secret|token|api[_-]?key/i)) {
        if (has(/console\.log|Logger\.(log|info|debug)\(.*(password|secret|token|api[_-]?key)/i))
          findings.push("[CRITICAL] Potential secret logging detected. Redact secrets before logging.");
        if (!has(/process\.env|ConfigService/) && has(/(password|secret|apiKey|api_key)\s*[:=]\s*['"][^'"]{6,}/))
          findings.push("[CRITICAL] Hardcoded secret detected. Move to environment variables via ConfigModule.");
      }
      if (has(/innerHTML\s*=|dangerouslySetInnerHTML/) && !has(/sanitize|Sanitizer|DOMPurify/))
        findings.push("[HIGH] Unsanitized HTML sink. Sanitize with orbit-security Sanitizer before rendering.");
      if (has(/SecurityModule|helmet/i)) {} else if (surface !== "graphql") {
        findings.push("[MEDIUM] No SecurityModule/helmet usage detected. Enable SecurityModule.forRoot({ helmet: true }).");
      }
      if (findings.length === 0)
        return text("No security findings detected by the checklist. This is not a substitute for penetration testing.");
      return text(findings.map((f, i) => `${i + 1}. ${f}`).join(`
`));
    }
    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
}

// src/server.ts
var PROTOCOL_VERSION = "2025-03-26";
var SERVER_INFO = {
  name: "@galaxy-stack/orbit-mcp",
  version: "0.1.7"
};
var PROMPTS = [
  {
    name: "build_orbit_feature",
    description: "Design and implement a new Orbit feature module end-to-end (module, controller, service, validation, tests).",
    arguments: [
      { name: "feature", description: 'Feature name, e.g. "orders"', required: true },
      { name: "storage", description: "Storage choice: memory | sqlite | none", required: false }
    ]
  },
  {
    name: "harden_graphql_api",
    description: "Audit and harden an Orbit GraphQL API: introspection, depth/complexity/alias limits, auth guards.",
    arguments: [
      { name: "code", description: "Current GraphQL module code", required: true }
    ]
  },
  {
    name: "migrate_from_nestjs",
    description: "Map NestJS concepts/decorators to Orbit equivalents and produce a migration plan.",
    arguments: [
      { name: "nest_code", description: "NestJS source to migrate", required: true }
    ]
  }
];
function promptText(name, args) {
  switch (name) {
    case "build_orbit_feature":
      return `Build an Orbit feature module named "${args.feature}"${args.storage ? ` using ${args.storage} storage` : ""}.

Requirements:
1. Create module, controller, service (orbit_scaffold_module tool can draft the skeleton).
2. Validate all inputs with a Zod schema and ValidationPipe.
3. Add auth guards to mutating routes.
4. Wire the module into AppModule.
5. Include unit tests (bun:test) and an e2e test through app.handle(Request).
6. Run bun test to verify.`;
    case "harden_graphql_api":
      return `Harden this Orbit GraphQL module:

${args.code}

Use the orbit_security_review tool (context: graphql) for the checklist, then apply fixes: disable introspection outside production, add security { maxDepth, maxComplexity, maxAliases }, guard protected resolvers, and disable the playground in production.`;
    case "migrate_from_nestjs":
      return `Map this NestJS code to Orbit:

${args.nest_code}

Concept mapping: @nestjs/common decorators -> @galaxy-stack/orbit-core; class-validator DTOs -> Zod schemas + orbit-validation; @nestjs/graphql -> orbit-graphql; Bull queues -> (roadmap) orbit-queue; EventEmitter2 -> (roadmap) orbit-event-bus. Read the orbit://knowledge/* resources for detailed patterns. Produce: 1) mapping table, 2) migrated files, 3) test plan.`;
    default:
      return `Unknown prompt: ${name}`;
  }
}
function ok(id, result) {
  return { jsonrpc: "2.0", id, result };
}
function err(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
function handleRequest(req) {
  const { id = null, method, params = {} } = reqBell(req);
  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        serverInfo: SERVER_INFO
      });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const { name, arguments: args } = params;
      try {
        const result = executeTool(name, args || {});
        return ok(id, result);
      } catch (e) {
        return ok(id, {
          content: [{ type: "text", text: `Tool error: ${e.message}` }],
          isError: true
        });
      }
    }
    case "resources/list":
      return ok(id, {
        resources: KNOWLEDGE.map((k) => ({
          uri: `orbit://knowledge/${k.id}`,
          name: k.title,
          description: k.summary,
          mimeType: "text/markdown"
        }))
      });
    case "resources/read": {
      const uri = params.uri || "";
      const idPart = uri.replace("orbit://knowledge/", "");
      const entry = KNOWLEDGE.find((k) => k.id === idPart);
      if (!entry)
        return err(id, -32602, `Unknown resource: ${uri}`);
      return ok(id, {
        contents: [{
          uri,
          mimeType: "text/markdown",
          text: `# ${entry.title}

${entry.content}`
        }]
      });
    }
    case "prompts/list":
      return ok(id, { prompts: PROMPTS });
    case "prompts/get": {
      const prompt = PROMPTS.find((p) => p.name === params.name);
      if (!prompt)
        return err(id, -32602, `Unknown prompt: ${params.name}`);
      return ok(id, {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: promptText(params.name, params.arguments || {})
          }
        }]
      });
    }
    default:
      return err(id, -32601, `Method not found: ${method}`);
  }
}
function reqBell(req) {
  return req;
}
async function serveStdio(input = process.stdin, output = process.stdout) {
  let buffer = "";
  const out = output;
  for await (const chunk of input) {
    buffer += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf(`
`)) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line)
        continue;
      let response;
      try {
        const req = JSON.parse(line);
        if (req.jsonrpc !== "2.0" || typeof req.method !== "string") {
          response = err(req.id ?? null, -32600, "Invalid Request");
        } else if (req.id === undefined) {
          continue;
        } else {
          response = handleRequest(req);
        }
      } catch {
        response = err(null, -32700, "Parse error");
      }
      out.write(JSON.stringify(response) + `
`);
    }
  }
}
if (import.meta.main) {
  serveStdio().catch((e) => {
    console.error("orbit-mcp fatal:", e);
    process.exit(1);
  });
}
export {
  serveStdio,
  handleRequest,
  SERVER_INFO,
  PROTOCOL_VERSION
};
