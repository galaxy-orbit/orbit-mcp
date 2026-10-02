import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { KNOWLEDGE, RECIPE_TASKS, TOPIC_ALIASES, findSection, getKnowledge, sectionAliases, sectionsOf, type KnowledgeEntry } from './knowledge';
import { API_SURFACE_CONTENT, API_SURFACE_PACKAGES, API_SURFACE_SYMBOLS } from './generated/api-surface';

export interface McpTool {
  name: string;
  description: string;
  annotations?: Record<string, unknown>;
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
    description:
      'Read Orbit knowledge. Pass id for a topic, id+section for one section of it, section alone for a short alias such as throttler or database, or symbol for a single export. Start with orbit_knowledge_topics. Nothing is strictly required, but pass at least one of id, section or symbol.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Topic id from orbit_knowledge_topics; optional when section or symbol is given.' },
        section: {
          type: 'string',
          description: 'Section id, or a short alias such as throttler, database, migrations or security. Works with or without id.',
        },
        symbol: {
          type: 'string',
          description: 'One exported symbol, e.g. ThrottlerGuard; answers with its package and the declaration line.',
        },
      },
    },
  },
  {
    name: 'orbit_scaffold_module',
    annotations: { title: 'orbit scaffold module', readOnlyHint: true },
    description:
      'Generate an in-memory Orbit feature module (module, controller with Zod validation, service, optional test) as copy-paste-ready code. This is a starting shape only — it wires NO database. For a real database follow the api-surface topic section "installing-and-wiring-the-database-layer" (DatabaseModule + DrizzleRepository) instead of adapting this output.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Feature name in kebab-case, e.g. "user"' },
        withTests: { type: 'boolean', description: 'Include a bun:test unit test file' },
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
  {
    name: 'orbit_environment',
    annotations: { title: 'orbit environment', readOnlyHint: true },
    description:
      'Report which @galaxy-stack/orbit-* packages the project installs, next to the versions this knowledge base was generated from. Call this once instead of reading node_modules/*/package.json: a version delta explains most "the docs do not match my install" cases, and it names the delta instead of leaving you to guess.',
    inputSchema: {
      type: 'object',
      properties: {
        projectRoot: { type: 'string', description: 'Project root holding node_modules. Defaults to the server working directory.' },
      },
    },
  },
  {
    name: 'orbit_recipe',
    annotations: { title: 'orbit recipe', readOnlyHint: true },
    description:
      'Fetch one verified recipe for a concrete task: throttle-per-route, rate-limit, security-baseline, csrf, database-wiring, migrations, middleware, cors, filters, guards, zod-validation, e2e-test, graphql, microservices. Use this instead of reading package READMEs (they contradict their own types) or re-deriving wiring from declarations.',
    inputSchema: {
      type: 'object',
      properties: {
        task: { type: 'string', description: 'Task id or a short phrase, e.g. "throttle a route", "drizzle migrations".' },
      },
      required: ['task'],
    },
  },
];

function pascal(name: string): string {
  return name.split(/[-_]/).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
}

const DOCS_STAMP = `> orbit-mcp docs - the generated **api-surface** topic carries every export of the \`@galaxy-stack/orbit-*\` packages (signatures, interface members, class methods).\nRead one package section, or one symbol with \`{ symbol: "ThrottlerGuard" }\`, instead of opening \`node_modules/**/*.d.ts\`.\n\`orbit_environment\` reports the versions your project installs next to the ones this knowledge was generated from; \`orbit_recipe\` returns one verified wiring recipe.\nTopics \`pitfalls\` and \`absent\` hold the measured runtime traps, and the names that do NOT exist.\nIf a signature you need is genuinely missing, report it as a knowledge gap instead of silently re-deriving it.\nVersion-specific behaviour depends on the project install, so nothing here hard-codes one.`;

/** Lowercase, dash-separated form used for section ids and alias lookup. */
function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

/** Render one routed section, naming the topic it came from when it was a redirect. */
function readRouted(target: { topic: string; section: string }, prefix?: string): string {
  const entry = getKnowledge(target.topic);
  const section = entry === undefined ? undefined : findSection(entry, target.section);
  if (entry === undefined || section === undefined) return `Nothing routed for topic ${target.topic} section ${target.section}.`;
  const lead = prefix === undefined ? '' : `${prefix} — routed to topic "${entry.id}".\n\n`;
  return `${lead}# ${entry.title} — ${section.title}\n\n${DOCS_STAMP}\n${section.body}`;
}

function renderRecipe(topicId: string, sectionId: string, asked: string, fuzzy: boolean): string {
  const entry = getKnowledge(topicId);
  const section = entry === undefined ? undefined : findSection(entry, sectionId);
  if (entry === undefined || section === undefined) {
    return `No recipe named ${JSON.stringify(asked)}. Tasks: ${Object.keys(RECIPE_TASKS).sort().join(', ')}.`;
  }
  const note = fuzzy ? `Closest recipe for ${JSON.stringify(asked)}.` : `Recipe for ${JSON.stringify(asked)}.`;
  return `${note}\n\n# ${section.title}\n\n${DOCS_STAMP}\n${section.body}\n\n_Full topic: orbit_knowledge_read({ id: "${entry.id}" }). All tasks: ${Object.keys(RECIPE_TASKS).sort().join(', ')}._`;
}

function unknownSection(entry: KnowledgeEntry, asked: string): string {
  const ids = sectionsOf(entry).map(section => section.id);
  return `Unknown section ${JSON.stringify(asked)} for topic ${entry.id}. Available sections: ${ids.join(', ')}. Aliases: ${sectionAliases().join(', ')}.`;
}

/** One exported symbol: which package owns it and the declaration line itself. */
function readSymbol(symbol: string): string {
  const owner = API_SURFACE_SYMBOLS[symbol];
  if (owner === undefined) {
    return `"${symbol}" is not exported by any @galaxy-stack/orbit-* package in the generated surface (${API_SURFACE_PACKAGES.map(entry => entry.name + '@' + entry.version).join(', ')}). Either it does not exist — see topic "absent" — or your install differs: call orbit_environment.`;
  }
  const pattern = new RegExp('(^|[^A-Za-z0-9_$])' + symbol.replace(/[^A-Za-z0-9_$]/g, '\\$&') + '([^A-Za-z0-9_$]|$)');
  const line = API_SURFACE_CONTENT.split('\n').find(candidate => candidate.startsWith('- ') && pattern.test(candidate));
  return `# ${symbol}\n\n${DOCS_STAMP}\n\nPackage: @galaxy-stack/${owner}\nDeclaration: ${line === undefined ? '(not found in the generated text)' : line.slice(2)}\n\nWhole package section: orbit_knowledge_read({ id: "api-surface", section: "${owner}" }).`;
}

export function executeTool(name: string, args: Record<string, any>): { content: Array<{ type: 'text'; text: string }>; isError?: boolean } {
  const text = (t: string) => ({ content: [{ type: 'text' as const, text: t }] });

  switch (name) {
    case 'orbit_knowledge_topics':
      return text(
        `${DOCS_STAMP}\n${KNOWLEDGE.map(k => {
          const ids = sectionsOf(k);
          const index = ids.length > 1
            ? `\n  sections: ${sectionAliases().join(', ')}`
            : '';
          return `- **${k.id}** — ${k.title}: ${k.summary}${index}`;
        }).join(`\n`)}`
      );

    case 'orbit_knowledge_read': {
      const id = typeof args.id === 'string' ? args.id.trim() : '';
      const sectionArg = typeof args.section === 'string' ? args.section.trim() : '';
      const symbolArg = typeof args.symbol === 'string' ? args.symbol.trim() : '';

      if (symbolArg.length > 0) return text(readSymbol(symbolArg));
      if (id.length > 0) {
        const entry = getKnowledge(id);
        if (entry === undefined) return text(`Unknown topic "${id}". Use orbit_knowledge_topics to list ids.`);
        if (sectionArg.length > 0) {
          const section = findSection(entry, sectionArg);
          if (section !== undefined) return text(`# ${entry.title} — ${section.title}\n\n${DOCS_STAMP}\n${section.body}`);
          const routed = TOPIC_ALIASES[slugify(sectionArg)];
          if (routed !== undefined && routed.topic !== id) return text(readRouted(routed, `${JSON.stringify(sectionArg)} is not a section of "${id}"`));
          return text(unknownSection(entry, sectionArg));
        }
        const ids = sectionsOf(entry).map(s => s.id);
        const index = ids.length > 1 ? `\nSections (re-read only what you need with { id: "${entry.id}", section }): ${ids.join(', ')}` : '';
        return text(`# ${entry.title}\n\n${DOCS_STAMP}${index}\n${entry.content}`);
      }
      if (sectionArg.length > 0) {
        const routed = TOPIC_ALIASES[slugify(sectionArg)];
        if (routed !== undefined) return text(readRouted(routed));
        for (const entry of KNOWLEDGE) {
          const section = findSection(entry, sectionArg);
          if (section !== undefined) return text(`# ${entry.title} — ${section.title}\n\n${DOCS_STAMP}\n${section.body}`);
        }
        return text(`Unknown section ${JSON.stringify(sectionArg)}. Aliases: ${sectionAliases().join(', ')}. Topics: ${KNOWLEDGE.map(k => k.id).join(', ')}.`);
      }
      return text(`Pass { id } for a topic, { section } for an alias, or { symbol } for one export. Topics: ${KNOWLEDGE.map(k => k.id).join(', ')}.`);
    }
    case 'orbit_recipe': {
      const asked = typeof args.task === 'string' ? args.task.trim() : '';
      if (asked.length === 0) return text(`Pass a task. Known tasks: ${Object.keys(RECIPE_TASKS).sort().join(', ')}.`);
      const wanted = slugify(asked);
      const direct = RECIPE_TASKS[wanted];
      if (direct !== undefined) return text(renderRecipe(direct.topic, direct.section, asked, false));
      const tokens = wanted.split('-').filter(token => token.length > 2);
      let best: { score: number; topic: string; section: string } | undefined;
      for (const [taskId, target] of Object.entries(RECIPE_TASKS)) {
        const score = taskId.split('-').filter(token => tokens.includes(token)).length;
        if (score > 0 && (best === undefined || score > best.score)) best = { score, topic: target.topic, section: target.section };
      }
      if (best === undefined) {
        return text(`No recipe matches ${JSON.stringify(asked)}. Known tasks: ${Object.keys(RECIPE_TASKS).sort().join(', ')}. Every topic: ${KNOWLEDGE.map(k => k.id).join(', ')}.`);
      }
      return text(renderRecipe(best.topic, best.section, asked, true));
    }
    case 'orbit_environment': {
      // Synchronous on purpose: the MCP request path stays synchronous, and a handful of small
      // package.json reads costs less than making every handler async.
      const root = typeof args.projectRoot === 'string' && args.projectRoot.trim().length > 0 ? args.projectRoot.trim() : process.cwd();
      const scope = join(root, 'node_modules', '@galaxy-stack');
      let names: string[] = [];
      try {
        names = readdirSync(scope).filter(name => name.startsWith('orbit-') || name === 'galaxy-ui' || name.startsWith('nebula'));
      } catch {
        return text(`No ${scope} directory. The project at ${root} has no @galaxy-stack packages installed yet — scaffold/install first, or pass projectRoot.`);
      }
      const installed: Array<{ name: string; version: string }> = [];
      for (const name of names.sort()) {
        try {
          const manifest = JSON.parse(readFileSync(join(scope, name, 'package.json'), 'utf8')) as { version?: unknown };
          installed.push({ name, version: typeof manifest.version === 'string' ? manifest.version : 'unknown' });
        } catch {
          installed.push({ name, version: 'unreadable package.json' });
        }
      }
      const generated = new Map(API_SURFACE_PACKAGES.map(entry => [entry.name, entry.version]));
      const rows = installed.map(entry => {
        const expected = generated.get(entry.name);
        const state = expected === undefined
          ? 'not part of the generated surface'
          : expected === entry.version ? 'same as the surface' : `surface was generated from ${expected}`;
        return `- ${entry.name}${entry.version ? '@' + entry.version : ''} — ${state}`;
      });
      const absent = API_SURFACE_PACKAGES.filter(entry => !installed.some(item => item.name === entry.name)).map(entry => entry.name);
      return text([
        `# Orbit environment (${root})`,
        '',
        DOCS_STAMP,
        '',
        ...(rows.length === 0 ? ['- no @galaxy-stack packages found'] : rows),
        ...(absent.length === 0 ? [] : ['', `Not installed here: ${absent.join(', ')}.`]),
        '',
        `Generated surface: ${API_SURFACE_PACKAGES.map(entry => entry.name + '@' + entry.version).join(', ')}.`,
        'A different version means the declarations of THAT install win for the delta: read the package section with orbit_knowledge_read({ id: "api-surface", section: "<package>" }) and report a genuinely missing symbol as a knowledge gap.',
      ].join('\n'));
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

      // Import sources matter: route decorators and the pipe come from orbit-core, parameter and
      // method decorators come from orbit-common. Importing Body/Param/HttpCode from orbit-core
      // throws "Export named 'Body' not found", and the exception class is NotFoundException —
      // there is no NotFoundError in either package.
      files.push(`// src/${kebab}/${kebab}.controller.ts
import { Controller, Get, Post, ZodValidationPipe } from '@galaxy-stack/orbit-core';
import { Body, HttpCode, NotFoundException, Param, UsePipes } from '@galaxy-stack/orbit-common';
import { z } from 'zod';
import { ${cls}Service } from './${kebab}.service';

/** @Body accepts only a field name, so the schema is bound with @UsePipes at method level. */
export const Create${cls}Schema = z.object({ name: z.string().min(1) });

@Controller('${kebab}')
export class ${cls}Controller {
  constructor(private readonly service: ${cls}Service) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  find(@Param('id') id: string) {
    const item = this.service.find(id);
    if (!item) throw new NotFoundException('${cls} not found');
    return item;
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(Create${cls}Schema))
  create(@Body() body: z.infer<typeof Create${cls}Schema>) { return this.service.create(body); }
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

      return text(files.join(`\n\n`));
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
${args.withLoaders ? `import { DataLoader } from '@galaxy-stack/orbit-graphql';\n` : ''}

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
        if (!has(/ValidationPipe|ZodValidationPipe|ZodArgumentPipe|schema\.parse/))
          findings.push('[HIGH] Mutation endpoints lack input validation. Bind a Zod schema with @UsePipes(new ZodValidationPipe(schema)) — @Body(new ValidationPipe(...)) is not supported because @Body only accepts a field name.');
        if (!has(/UseGuards|AuthGuard|jwt|session/i))
          findings.push('[HIGH] State-changing endpoint without an auth guard. Add @UseGuards(JwtAuthGuard) or equivalent.');
        if (!has(/Throttle|RateLimit|throttler/i))
          findings.push('[MEDIUM] No rate limiting on writes. Import ThrottlerModule.forRoot({ ttl, limit }) — it is global and already provides ThrottlerGuard — then extend a shared @UseGuards(ThrottlerGuard) base controller and tighten write handlers with @Throttle(limit, ttl).');
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
        findings.push('[MEDIUM] No SecurityModule/helmet usage detected. Enable SecurityModule.forRoot({ helmet: {} }) — helmet takes an options object or false, never true.');
      }

      if (findings.length === 0) return text('No security findings detected by the checklist. This is not a substitute for penetration testing.');
      return text(findings.map((f, i) => `${i + 1}. ${f}`).join('\n'));
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}