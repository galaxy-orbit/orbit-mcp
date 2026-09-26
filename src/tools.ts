import { KNOWLEDGE, type KnowledgeEntry } from './knowledge';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export const TOOLS: McpTool[] = [
  {
    name: 'orbit_knowledge_topics',
    annotations: { title: 'orbit knowledge topics', readOnlyHint: true },
    description: 'List all available Orbit framework knowledge topics with summaries.',
    inputSchema: { type: 'object', properties: {} },
  },
  {
    name: 'orbit_knowledge_read',
    annotations: { title: 'orbit knowledge read', readOnlyHint: true },
    description: 'Read one Orbit knowledge topic by id (use orbit_knowledge_topics first).',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Topic id from orbit_knowledge_topics' },
      },
      required: ['id'],
    },
  },
  {
    name: 'orbit_scaffold_module',
    annotations: { title: 'orbit scaffold module', readOnlyHint: true },
    description: 'Generate a complete Orbit feature module (module, controller, service, optional Zod DTO and tests) as copy-paste-ready code.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Feature name in kebab-case, e.g. "user"' },
        withDatabase: { type: 'boolean', description: 'Include a Drizzle table + repository (bun:sqlite)' },
        withTests: { type: 'boolean', description: 'Include unit + e2e test files' },
        withSwagger: { type: 'boolean', description: 'Include OpenAPI decorators' },
      },
      required: ['name'],
    },
  },
  {
    name: 'orbit_scaffold_graphql',
    annotations: { title: 'orbit scaffold graphql', readOnlyHint: true },
    description: 'Generate a GraphQL feature: resolver, object types, input types, and module wiring with security limits.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Feature name in kebab-case' },
        withLoaders: { type: 'boolean', description: 'Include DataLoader wiring' },
      },
      required: ['name'],
    },
  },
  {
    name: 'orbit_security_review',
    annotations: { title: 'orbit security review', readOnlyHint: true },
    description: 'Run a static checklist against pasted source code and report missing security hardening with concrete fixes.',
    inputSchema: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Source code to review' },
        context: { type: 'string', enum: ['rest', 'graphql', 'both'], description: 'Surface to review' },
      },
      required: ['code'],
    },
  },
];

function pascal(name: string): string {
  return name.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const DOCS_STAMP = `> orbit-mcp docs — nguồn chính thức cho API của @galaxy-stack/orbit-core 0.2.x. Cài đặt: \`bun add @galaxy-stack/orbit-core\` (bun tự chọn version mới nhất, không cần npm view để pin). Sau khi cài, tra exports thật bằng cách đọc .d.ts trong node_modules (được phép) — KHÔNG đọc source .js hay grep cả cây node_modules.\n`;

export function executeTool(name: string, args: Record<string, any>): { content: Array<{ type: 'text'; text: string }>; isError?: boolean } {
  const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });

  switch (name) {
    case 'orbit_knowledge_topics':
      return text(
        `${DOCS_STAMP}\n${KNOWLEDGE.map(k => `- **${k.id}** — ${k.title}: ${k.summary}`).join('\n')}`
      );

    case 'orbit_knowledge_read': {
      const entry = KNOWLEDGE.find(k => k.id === args.id);
      if (!entry) return text(`Unknown topic "${args.id}". Use orbit_knowledge_topics to list ids.`);
      return text(`# ${entry.title}\n\n${DOCS_STAMP}\n${entry.content}`);
    }

    case 'orbit_scaffold_module': {
      const name = String(args.name || 'feature');
      const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const cls = pascal(name);
      const files: string[] = [];

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

      return text(files.join('\n\n'));
    }

    case 'orbit_scaffold_graphql': {
      const name = String(args.name || 'feature');
      const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      const cls = pascal(name);
      const loader = args.withLoaders ? `
  @ResolveField(() => Author)
  author(@Parent() parent: ${cls}, @Loader('authorLoader') loader: DataLoader) {
    return loader.load(parent.authorId);
  }` : '';
      return text(`// src/${kebab}/${kebab}.resolver.ts
import { Resolver, Query, Mutation, Args${args.withLoaders ? ', ResolveField, Parent, Loader' : ''} } from '@galaxy-stack/orbit-graphql';
${args.withLoaders ? "import { DataLoader } from '@galaxy-stack/orbit-graphql';\n" : ''}
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

    case 'orbit_security_review': {
      const code = String(args.code || '');
      const surface = args.context || 'both';
      const findings: string[] = [];

      const has = (re: RegExp) => re.test(code);

      if (surface !== 'graphql' && has(/@(Post|Put|Patch|Delete)\(/)) {
        if (!has(/ValidationPipe|Zod|schema\.parse|@Is/))
          findings.push('[HIGH] Mutation endpoints lack input validation. Add ValidationPipe with a Zod schema: @UsePipes(new ValidationPipe(schema)) on the handler or module.');
        if (!has(/UseGuards|AuthGuard|jwt|session/i))
          findings.push('[HIGH] State-changing endpoint without an auth guard. Add @UseGuards(JwtAuthGuard) or equivalent.');
        if (!has(/Throttle|RateLimit|throttler/i))
          findings.push('[MEDIUM] No rate limiting on writes. Enable ThrottlerModule globally or @Throttle() per route.');
      }

      if (surface !== 'rest' && has(/GraphQLModule|@Resolver\(/)) {
        if (has(/introspection:\s*true/))
          findings.push('[HIGH] introspection: true hardcoded — expose it only outside production.');
        if (!has(/security:\s*{|maxDepth|maxComplexity/))
          findings.push('[HIGH] GraphQLModule without security limits. Add security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 }.');
        if (has(/playground:\s*true/))
          findings.push('[MEDIUM] Playground enabled — disable in production.');
      }

      if (has(/password|secret|token|api[_-]?key/i)) {
        if (has(/console\.log|Logger\.(log|info|debug)\(.*(password|secret|token|api[_-]?key)/i))
          findings.push('[CRITICAL] Potential secret logging detected. Redact secrets before logging.');
        if (!has(/process\.env|ConfigService/) && has(/(password|secret|apiKey|api_key)\s*[:=]\s*['"][^'"]{6,}/))
          findings.push('[CRITICAL] Hardcoded secret detected. Move to environment variables via ConfigModule.');
      }

      if (has(/innerHTML\s*=|dangerouslySetInnerHTML/) && !has(/sanitize|Sanitizer|DOMPurify/))
        findings.push('[HIGH] Unsanitized HTML sink. Sanitize with orbit-security Sanitizer before rendering.');

      if (has(/SecurityModule|helmet/i)) {
        // fine
      } else if (surface !== 'graphql') {
        findings.push('[MEDIUM] No SecurityModule/helmet usage detected. Enable SecurityModule.forRoot({ helmet: true }).');
      }

      if (findings.length === 0) return text('No security findings detected by the checklist. This is not a substitute for penetration testing.');
      return text(findings.map((f, i) => `${i + 1}. ${f}`).join('\n'));
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}
