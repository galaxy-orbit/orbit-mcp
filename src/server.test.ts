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

  test('tools/list includes all five tools with schemas', () => {
    const res = handleRequest({ jsonrpc: '2.0', id: 4, method: 'tools/list' });
    const names = res.result.tools.map((t: any) => t.name);
    expect(names).toEqual([
      'orbit_knowledge_topics',
      'orbit_knowledge_read',
      'orbit_scaffold_module',
      'orbit_scaffold_graphql',
      'orbit_security_review',
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
