import { describe, test, expect } from 'bun:test';
import { handleRequest } from './server';

describe('orbit-mcp server', () => {
  test('initialize returns protocol version and capabilities', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 1, method: 'initialize' });
    expect(res.result.protocolVersion).toBe('2025-03-26');
    expect(res.result.capabilities.tools).toBeDefined();
    expect(res.result.capabilities.resources).toBeDefined();
    expect(res.result.capabilities.prompts).toBeDefined();
    expect(res.result.serverInfo.name).toBe('@galaxy-stack/orbit-mcp');
  });

  test('ping responds with empty result', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 2, method: 'ping' });
    expect(res.result).toEqual({});
  });

  test('unknown method returns -32601', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 3, method: 'nope' });
    expect(res.error.code).toBe(-32601);
  });

  test('tools/list includes the seven tools with schemas', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 4, method: 'tools/list' });
    const names = res.result.tools.map((t: any) => t.name);
    expect(names).toEqual([
      'orbit_knowledge_topics',
      'orbit_knowledge_read',
      'orbit_scaffold_module',
      'orbit_scaffold_graphql',
      'orbit_security_review',
      'orbit_environment',
      'orbit_recipe',
    ]);
    for (const tool of res.result.tools) {
      expect(tool.inputSchema.type).toBe('object');
      expect(tool.description.length).toBeGreaterThan(10);
    }
  });

  test('tools/call orbit_knowledge_read returns markdown', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 5, method: 'tools/call',
      params: { name: 'orbit_knowledge_read', arguments: { id: 'module-pattern' } },
    });
    expect(res.result.content[0].text).toContain('@Module');
  });

  test('tools/call orbit_knowledge_read unknown id is reported in content', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 6, method: 'tools/call',
      params: { name: 'orbit_knowledge_read', arguments: { id: 'nope' } },
    });
    expect(res.result.content[0].text).toContain('Unknown topic');
  });

  test('resources/list exposes all knowledge entries', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 7, method: 'resources/list' });
    expect(res.result.resources.length).toBeGreaterThanOrEqual(9);
    expect(res.result.resources[0].uri).toMatch(/^orbit:\/\/knowledge\//);
  });

  test('resources/read returns contents', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 8, method: 'resources/read',
      params: { uri: 'orbit://knowledge/security-checklist' },
    });
    expect(res.result.contents[0].text).toContain('SecurityModule');
  });

  test('resources/read unknown uri errors', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 9, method: 'resources/read',
      params: { uri: 'orbit://knowledge/nope' },
    });
    expect(res.error.code).toBe(-32602);
  });

  test('prompts/list returns prompts with arguments', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 10, method: 'prompts/list' });
    expect(res.result.prompts.length).toBe(3);
    expect(res.result.prompts[0].name).toBe('build_orbit_feature');
  });

  test('prompts/get build_orbit_feature includes feature name', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 11, method: 'prompts/get',
      params: { name: 'build_orbit_feature', arguments: { feature: 'orders', storage: 'sqlite' } },
    });
    expect(res.result.messages[0].content.text).toContain('"orders"');
    expect(res.result.messages[0].content.text).toContain('sqlite');
  });

  test('prompts/get unknown name errors', () => {
    const res = handleRequest({
      jsonrpc: '2.0', id: 12, method: 'prompts/get',
      params: { name: 'nope' },
    });
    expect(res.error.code).toBe(-32602);
  });
});

describe('orbit_scaffold_module tool', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 20, method: 'tools/call',
    params: { name: 'orbit_scaffold_module', arguments: args },
  }).result.content[0].text as string;

  test('generates module, controller, service with kebab-case naming', () => {
    const out = call({ name: 'user-profile' });
    expect(out).toContain('UserProfileModule');
    expect(out).toContain("@Controller('user-profile')");
    expect(out).toContain('user-profile.module.ts');
  });

  test('respects withTests flag', () => {
    const without = call({ name: 'order' });
    const withTests = call({ name: 'order', withTests: true });
    expect(without).not.toContain('.service.test.ts');
    expect(withTests).toContain("import { describe, test, expect } from 'bun:test'");
  });

  test('camelCase input normalizes to kebab-case routes', () => {
    const out = call({ name: 'shoppingCart' });
    expect(out).toContain("@Controller('shopping-cart')");
    expect(out).toContain('ShoppingCartModule');
  });
});

describe('orbit_scaffold_graphql tool', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 21, method: 'tools/call',
    params: { name: 'orbit_scaffold_graphql', arguments: args },
  }).result.content[0].text as string;

  test('generates resolver with security wiring comment', () => {
    const out = call({ name: 'product' });
    expect(out).toContain('ProductResolver');
    expect(out).toContain('maxDepth: 10');
    expect(out).toContain('introspection: process.env.NODE_ENV');
  });

  test('withLoaders adds DataLoader imports', () => {
    const out = call({ name: 'product', withLoaders: true });
    expect(out).toContain('DataLoader');
    expect(out).toContain('ResolveField');
  });
});

describe('orbit_security_review tool', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 22, method: 'tools/call',
    params: { name: 'orbit_security_review', arguments: args },
  }).result.content[0].text as string;

  test('flags unprotected mutating REST route', () => {
    const out = call({
      context: 'rest',
      code: "@Post() create(@Body() body: any) { return save(body); }",
    });
    expect(out).toContain('input validation');
    expect(out).toContain('auth guard');
  });

  test('flags GraphQL module without security limits', () => {
    const out = call({
      context: 'graphql',
      code: "GraphQLModule.forRoot({ playground: true, introspection: true })",
    });
    expect(out).toContain('introspection: true hardcoded');
    expect(out).toContain('security limits');
  });

  test('flags hardcoded secrets', () => {
    const out = call({
      context: 'rest',
      code: "const apiKey = 'sk-1234567890abcdef';",
    });
    expect(out).toContain('Hardcoded secret');
  });

  test('clean code passes with no findings', () => {
    const out = call({
      context: 'rest',
      code: "SecurityModule.forRoot({ helmet: true, csrf: true }); @Post() @UseGuards(JwtAuthGuard) @Throttle() create(@Body(new ValidationPipe(schema)) body: unknown, @Session() session: any) { return save(schema.parse(body)); }",
    });
    expect(out).toContain('No security findings');
  });

  test('flags unsanitized HTML sink', () => {
    const out = call({
      context: 'rest',
      code: "element.innerHTML = userInput;",
    });
    expect(out).toContain('Unsanitized HTML');
  });
});

describe('orbit_knowledge_read sections', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 30, method: 'tools/call',
    params: { name: 'orbit_knowledge_read', arguments: args },
  }).result.content[0].text as string;

  test('topic list advertises section ids for the api-surface topic', () => {
    const out = handleRequest({
      jsonrpc: '2.0', id: 31, method: 'tools/call',
      params: { name: 'orbit_knowledge_topics', arguments: {} },
    }).result.content[0].text as string;
    const rows = out.split(`\n`);
    const at = rows.findIndex(l => l.startsWith('- **api-surface**'));
    const line = rows.slice(at, at + 2).join(' ');
    expect(line).toBeDefined();
    expect(line).toContain('sections:');
    expect(line).toContain('throttler');
  });

  test('reading one generated package section is much cheaper than the whole topic', () => {
    const whole = call({ id: 'api-surface' });
    const part = call({ id: 'api-surface', section: 'orbit-throttler' });
    expect(part.length).toBeLessThan(whole.length / 4);
    expect(part).toContain('ThrottlerGuard');
    expect(part).not.toContain('DatabaseModule');
  });

  test('a prefix of a generated package section resolves', () => {
    const exact = call({ id: 'api-surface', section: 'orbit-throttler' });
    const prefix = call({ id: 'api-surface', section: 'orbit-throttl' });
    expect(prefix).toBe(exact);
  });

  test('a recipe alias asked of the api-surface topic is routed to the recipes topic', () => {
    const routed = call({ id: 'api-surface', section: 'throttler' });
    expect(routed).toContain('routed to topic "recipes"');
    expect(routed).toContain('ThrottlerGuard');
    const direct = call({ id: 'recipes', section: 'throttler' });
    expect(direct).toContain('ThrottlerGuard');
  });

  test('a section alias without an id resolves through the cross-topic table', () => {
    const routed = call({ section: 'database-wiring' });
    expect(routed).toContain('DatabaseModule');
    const versions = call({ section: 'versions' });
    expect(versions).toContain('Generated from:');
  });

  test('an unknown section lists the available ids instead of failing silently', () => {
    const out = call({ id: 'api-surface', section: 'nope' });
    expect(out).toContain('Unknown section');
    expect(out).toContain('Aliases:');
    expect(out).toContain('throttler');
  });

});

describe('orbit_knowledge_read symbol lookup', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 40, method: 'tools/call',
    params: { name: 'orbit_knowledge_read', arguments: args },
  }).result.content[0].text as string;

  test('a known export names its package and shows the declaration line', () => {
    const out = call({ symbol: 'ThrottlerGuard' });
    expect(out).toContain('Package: @galaxy-stack/orbit-throttler');
    expect(out).toContain('class ThrottlerGuard');
    expect(out).toContain('orbit_knowledge_read({ id: "api-surface", section: "orbit-throttler" })');
  });

  test('an unknown symbol points at the absent topic instead of guessing', () => {
    const out = call({ symbol: 'NotFoundError' });
    expect(out).toContain('is not exported by any @galaxy-stack/orbit-* package');
    expect(out).toContain('absent');
  });

  test('an empty call lists the ways to read', () => {
    const out = call({});
    expect(out).toContain('Topics:');
  });
});

describe('orbit_recipe tool', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 41, method: 'tools/call',
    params: { name: 'orbit_recipe', arguments: args },
  }).result.content[0].text as string;

  test('a task id returns the verified recipe', () => {
    const out = call({ task: 'throttle-per-route' });
    expect(out).toContain('ThrottlerModule.forRoot');
    expect(out).toContain('ThrottlerExceptionFilter');
  });

  test('a phrase is matched against the task table', () => {
    const out = call({ task: 'drizzle migrations' });
    expect(out).toContain('migrate(db');
  });

  test('an unknown task lists the known ones', () => {
    const out = call({ task: 'build a rocket' });
    expect(out).toContain('No recipe matches');
    expect(out).toContain('throttle-per-route');
  });
});

describe('orbit_environment tool', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 42, method: 'tools/call',
    params: { name: 'orbit_environment', arguments: args },
  }).result.content[0].text as string;

  test('reports this repo install against the generated surface', () => {
    const out = call({});
    expect(out).toContain('orbit-core@');
    expect(out).toContain('same as the surface');
    expect(out).toContain('Generated surface:');
  });

  test('a root without @galaxy-stack packages says so instead of throwing', () => {
    const out = call({ projectRoot: '/tmp' });
    expect(out).toContain('Not installed here: orbit-core');
    expect(out).toContain('Generated surface:');
  });
});

describe('orbit_scaffold_module correctness', () => {
  const call = (args: any) => handleRequest({
    jsonrpc: '2.0', id: 40, method: 'tools/call',
    params: { name: 'orbit_scaffold_module', arguments: args },
  }).result.content[0].text as string;

  test('never emits the non-existent NotFoundError class', () => {
    const out = call({ name: 'payments', withTests: true });
    expect(out).not.toContain('NotFoundError');
    expect(out).toContain('NotFoundException');
  });

  test('imports parameter and method decorators from orbit-common, not orbit-core', () => {
    const out = call({ name: 'payments' });
    const coreImports = out
      .split(`\n`)
      .filter(l => l.includes("from '@galaxy-stack/orbit-core'"));
    expect(coreImports.length).toBeGreaterThan(0);
    for (const line of coreImports) {
      for (const banned of ['Body', 'Param', 'Query', 'HttpCode', 'UsePipes', 'UseGuards', 'HttpException']) {
        expect(line).not.toMatch(new RegExp(`\\b${banned}\\b`));
      }
    }
    const commonImports = out.split(`\n`).find(l => l.includes("from '@galaxy-stack/orbit-common'")) as string;
    expect(commonImports).toContain('Body');
    expect(commonImports).toContain('HttpCode');
  });

  test('every decorator used in the generated controller is imported', () => {
    const out = call({ name: 'payments' });
    const controller = out.slice(out.indexOf('payments.controller.ts'));
    const used = new Set(controller.match(/@[A-Z][A-Za-z]+/g) ?? []);
    for (const decorator of used) {
      const bare = decorator.slice(1);
      if (bare === 'Module') continue;
      expect(controller).toContain(bare);
      const imported = new RegExp(`import[^\n]*\\b${bare}\\b`).test(controller);
      expect(imported).toBe(true);
    }
  });
});