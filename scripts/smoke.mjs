#!/usr/bin/env node
/**
 * Smoke test for the orbit-mcp server: speaks newline-delimited JSON-RPC to the real stdio server
 * and asserts the behaviours the 2026-10-01 E2E audit found broken.
 *
 *   node scripts/smoke.mjs            # runs `bun run src/server.ts` from the package root
 *
 * Zero dependencies on purpose: the server itself has none, so the check stays runnable anywhere bun is.
 */
import { spawn } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const child = spawn('bun', ['run', resolve(pkgRoot, 'src/server.ts')], { cwd: pkgRoot, stdio: ['pipe', 'pipe', 'pipe'] });

const pending = new Map();
let buffer = '';
let nextId = 1;
child.stdout.on('data', (chunk) => {
  buffer += chunk.toString('utf8');
  const lines = buffer.split('\n');
  buffer = lines.pop() ?? '';
  for (const line of lines) {
    if (!line.trim()) continue;
    let message;
    try { message = JSON.parse(line); } catch { continue; }
    const settle = pending.get(message.id);
    if (settle) { pending.delete(message.id); settle(message); }
  }
});
child.stderr.on('data', () => {});

function call(method, params) {
  const id = nextId++;
  return new Promise((resolve_, reject) => {
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('timeout: ' + method)); }, 20000);
    pending.set(id, (message) => { clearTimeout(timer); resolve_(message); });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n');
  });
}

const tool = async (name, args = {}) => {
  const message = await call('tools/call', { name, arguments: args });
  const text = message.result?.content?.[0]?.text ?? JSON.stringify(message.error ?? message.result);
  try { return JSON.parse(text); } catch { return text; }
};

let failures = 0;
const check = (label, ok, detail) => {
  console.log((ok ? 'ok   ' : 'FAIL ') + label + (ok ? '' : '  -> ' + String(detail).slice(0, 200)));
  if (!ok) failures += 1;
};

try {
  const init = await call('initialize', {});
  check('initialize handshake', init.result?.protocolVersion === '2025-03-26', JSON.stringify(init).slice(0, 160));

  const tools = await call('tools/list', {});
  const names = (tools.result?.tools ?? []).map((t) => t.name);
  const expectedTools = ['orbit_knowledge_topics', 'orbit_knowledge_read', 'orbit_scaffold_module', 'orbit_scaffold_graphql', 'orbit_security_review', 'orbit_environment', 'orbit_recipe'];
  check('tools/list exposes the seven tools', JSON.stringify(names) === JSON.stringify(expectedTools), names.join(','));

  const topics = await tool('orbit_knowledge_topics', {});
  const surfaceLine = String(topics).split('\n').find((l) => l.startsWith('- **api-surface**')) ?? '';
  const surfaceRow = String(topics).split('\n').slice(String(topics).split('\n').indexOf(surfaceLine), String(topics).split('\n').indexOf(surfaceLine) + 2).join(' ');
  check('api-surface advertises section ids', surfaceRow.includes('sections:') && surfaceRow.includes('throttler'), surfaceRow.slice(0, 160));

  const whole = await tool('orbit_knowledge_read', { id: 'api-surface' });
  const section = await tool('orbit_knowledge_read', { id: 'api-surface', section: 'throttler' });
  check('section read is much smaller than the whole topic', String(section).length < String(whole).length / 2, String(section).length + ' vs ' + String(whole).length);
  check('section read carries the throttler recipe', String(section).includes('ThrottlerGuard') && String(section).includes('ThrottlerModule.forRoot'), 'missing');
  check('section read does not leak unrelated sections', !String(section).includes('DatabaseModule.forRoot'), 'leaked');

  const alias = await tool('orbit_knowledge_read', { id: 'api-surface', section: 'database' });
  check('short alias resolves', String(alias).includes('DatabaseModule.forRoot'), String(alias).slice(0, 120));

  const unknown = await tool('orbit_knowledge_read', { id: 'api-surface', section: 'no-such-section' });
  check('unknown section lists the valid ids', String(unknown).includes('Unknown section') && String(unknown).includes('Aliases:'), String(unknown).slice(0, 160));

  // The generated surface replaced the hand-written export list: one section per package, and the
  // declaration line itself for a symbol, so an agent never has to open dist/*.d.ts.
  const generated = await tool('orbit_knowledge_read', { id: 'api-surface', section: 'orbit-throttler' });
  check('generated package section carries declarations', String(generated).includes('class ThrottlerGuard') && String(generated).includes('interface ThrottlerModuleOptions'), String(generated).slice(0, 160));
  check('generated package section stays small', String(generated).length < 4000, String(generated).length);
  const symbol = await tool('orbit_knowledge_read', { symbol: 'ThrottlerException' });
  check('symbol lookup names the owning package', String(symbol).includes('@galaxy-stack/orbit-throttler') && String(symbol).includes('retryAfter'), String(symbol).slice(0, 160));
  const missingSymbol = await tool('orbit_knowledge_read', { symbol: 'NotFoundError' });
  check('missing symbol points at the absent topic', String(missingSymbol).includes('is not exported by any') && String(missingSymbol).includes('absent'), String(missingSymbol).slice(0, 160));
  const absent = await tool('orbit_knowledge_read', { id: 'absent' });
  check('absent topic lists the Nest-only APIs', String(absent).includes('setGlobalPrefix') && String(absent).includes('useGlobalGuards'), String(absent).slice(0, 160));
  const pitfalls = await tool('orbit_knowledge_read', { id: 'pitfalls' });
  check('pitfalls topic carries the HttpCode trap', String(pitfalls).includes('httpCode || response.status'), String(pitfalls).slice(0, 160));

  // Recipes and the version comparison are the two new tools the audit asked for.
  const recipe = await tool('orbit_recipe', { task: 'throttle-per-route' });
  check('orbit_recipe returns the verified recipe', String(recipe).includes('ThrottlerModule.forRoot') && String(recipe).includes('ThrottlerExceptionFilter'), String(recipe).slice(0, 160));
  const fuzzyRecipe = await tool('orbit_recipe', { task: 'drizzle migrations' });
  check('orbit_recipe matches a phrase', String(fuzzyRecipe).includes('migrate(db'), String(fuzzyRecipe).slice(0, 160));
  const environment = await tool('orbit_environment', {});
  check('orbit_environment compares install with the surface', String(environment).includes('orbit-core@0.2.3 — same as the surface'), String(environment).slice(0, 200));
  check('orbit_environment names the generated versions', String(environment).includes('Generated surface: orbit-core@0.2.3'), String(environment).slice(-200));

  const scaffold = await tool('orbit_scaffold_module', { name: 'payments', withTests: true });
  const body = String(scaffold);
  check('scaffold never emits NotFoundError', !body.includes('NotFoundError'), 'found NotFoundError');
  check('scaffold uses NotFoundException', body.includes('NotFoundException'), 'missing');
  const coreImports = body.split('\n').filter((line) => line.includes("from '@galaxy-stack/orbit-core'"));
  const banned = ['Body', 'Param', 'Query', 'HttpCode', 'UsePipes', 'UseGuards', 'NotFoundException'];
  const leaky = coreImports.filter((line) => banned.some((name) => new RegExp('\\b' + name + '\\b').test(line)));
  check('scaffold imports decorators from orbit-common only', leaky.length === 0, leaky.join(' | '));
  check('scaffold imports every decorator it uses', !body.includes('@HttpCode') || /import[^\n]*HttpCode/.test(body), 'HttpCode used but not imported');

  const review = await tool('orbit_security_review', { context: 'rest', code: 'SecurityModule.forRoot({ helmet: true, csrf: true }); @Post() create(@Body() b: any) { return b; }' });
  check('security review still reports findings', String(review).length > 20, String(review).slice(0, 120));
  check('security review advice no longer teaches helmet: true', !/Enable SecurityModule\.forRoot\(\{ helmet: true \}\)/.test(String(review)), String(review).slice(0, 200));
} finally {
  child.kill();
}

console.log(failures === 0 ? 'SMOKE OK' : 'SMOKE FAILURES: ' + failures);
process.exit(failures === 0 ? 0 : 1);