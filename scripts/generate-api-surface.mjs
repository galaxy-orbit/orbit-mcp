#!/usr/bin/env node
/**
 * Generate the orbit-mcp API-surface knowledge topic from the declarations of the
 * installed @galaxy-stack/orbit-* packages.
 *
 * Why generated: the previous topic was hand-written prose mirroring dist/*.d.ts, and it
 * drifted — a 2026-10-01 E2E audit traced 88-124 node_modules reads per run to agents
 * re-deriving exactly this surface. The declarations are the source of truth; this script
 * copies them (signatures, interface members, class methods), records the versions it copied,
 * and refuses to guess.
 *
 * Usage:
 *   node scripts/generate-api-surface.mjs            # write src/generated/api-surface.ts
 *   node scripts/generate-api-surface.mjs --check    # exit 1 when the committed file is stale
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const OUT = join(ROOT, 'src', 'generated', 'api-surface.ts');

/** Packages whose public surface the topic carries, in display order. */
const PACKAGES = [
  'orbit-core',
  'orbit-common',
  'orbit-database',
  'orbit-security',
  'orbit-throttler',
  'orbit-graphql',
  'orbit-validation',
  'orbit-microservices',
  'orbit-swagger',
];

/** Members listed per interface / class before the list is elided. */
const MAX_INTERFACE_MEMBERS = 14;
const MAX_SIGNATURE = 160;

const DECLARATION = /^export\s+(?:declare\s+)?(?:abstract\s+)?(class|function|const|let|var|enum|interface|type|namespace)\s+([A-Za-z_$][\w$]*)/;
const RE_EXPORT = /^export\s*(?:type\s*)?\{([^}]*)\}/;
const PROPERTY = /^\s*(?:readonly\s+)?(?:\[[^\]]+\]\s*:\s*)?([A-Za-z_$][\w$]*)\s*(\??)\s*:/;
const METHOD = /^\s*(?:public\s+|abstract\s+)?(?:static\s+)?([A-Za-z_$][\w$]*)\s*[(<]/;
const HIDDEN = /^\s*(?:private|protected|#)/;

function walkDeclarations(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      found.push(...walkDeclarations(path));
      continue;
    }
    if (!entry.endsWith('.d.ts') || entry.endsWith('.d.ts.map') || entry.endsWith('.test.d.ts')) continue;
    found.push(path);
  }
  return found;
}

/** Slice a declaration that may span lines: stops at brace depth 0 followed by ; or }. */
function sliceDeclaration(lines, start) {
  let text = '';
  let depth = 0;
  for (let index = start; index < lines.length && index < start + 24; index += 1) {
    const line = lines[index];
    text += (text.length === 0 ? '' : ' ') + line.trim();
    for (const character of line) {
      if (character === '{') depth += 1;
      else if (character === '}') depth -= 1;
    }
    if (depth <= 0 && /[;}]\s*$/.test(text.trim())) break;
  }
  return text.replace(/\s+/g, ' ').trim();
}

function headOf(text) {
  const brace = text.indexOf('{');
  return (brace === -1 ? text : text.slice(0, brace)).replace(/[;{]\s*$/, '').trim();
}

/** Collect name / name? members (properties and methods) from a braced body starting at start. */
function membersOf(lines, start) {
  const members = [];
  let depth = 0;
  let opened = false;
  for (let index = start; index < lines.length; index += 1) {
    const line = lines[index];
    for (const character of line) {
      if (character === '{') { depth += 1; opened = true; }
      else if (character === '}') depth -= 1;
    }
    if (!opened) continue;
    if (depth <= 0) break;
    if (HIDDEN.test(line)) continue;
    const property = PROPERTY.exec(line);
    if (property !== null) {
      members.push(property[1] + (property[2] === '?' ? '?' : ''));
      continue;
    }
    const method = METHOD.exec(line);
    if (method === null || method[1] === 'constructor' || method[1] === 'if' || method[1] === 'return') continue;
    members.push(method[1] + '()');
  }
  const unique = [...new Set(members)];
  return unique.length > MAX_INTERFACE_MEMBERS ? [...unique.slice(0, MAX_INTERFACE_MEMBERS), '…'] : unique;
}

function brace(parts) {
  return parts.length === 0 ? '' : ' { ' + parts.join(', ') + ' }';
}

/** Public surface of one package: symbol -> { kind, text }. */
function surfaceOf(packageRoot) {
  const symbols = new Map();
  for (const file of walkDeclarations(join(packageRoot, 'dist')).sort()) {
    const lines = readFileSync(file, 'utf8').split('\n');
    for (let index = 0; index < lines.length; index += 1) {
      const declaration = DECLARATION.exec(lines[index]);
      if (declaration !== null) {
        const kind = declaration[1];
        const name = declaration[2];
        let text;
        if (kind === 'class' || kind === 'interface') {
          text = headOf(sliceDeclaration(lines, index)).replace(/^export\s+(?:declare\s+)?/, '') + brace(membersOf(lines, index));
        } else if (kind === 'function' || kind === 'const' || kind === 'let' || kind === 'var') {
          text = sliceDeclaration(lines, index).replace(/^export\s+declare\s+/, '');
        } else {
          text = kind + ' ' + name;
        }
        const existing = symbols.get(name);
        if (existing === undefined || (existing.kind === 'export' && kind !== 'export')) symbols.set(name, { kind, text });
        continue;
      }
      const reExport = RE_EXPORT.exec(lines[index]);
      if (reExport === null) continue;
      for (const part of reExport[1].split(',')) {
        const cleaned = part.trim().replace(/^type\s+/, '');
        if (cleaned.length === 0) continue;
        const alias = cleaned.split(/\s+as\s+/).pop().trim();
        if (!/^[A-Za-z_$][\w$]*$/.test(alias) || symbols.has(alias)) continue;
        symbols.set(alias, { kind: 'export', text: alias + ' (re-exported)' });
      }
    }
  }
  return symbols;
}

function renderPackageSymbols(symbols) {
  const names = [...symbols.keys()].sort((left, right) => left.localeCompare(right));
  const lines = names.map((name) => {
    const text = symbols.get(name).text;
    return '- ' + (text.length > MAX_SIGNATURE ? text.slice(0, MAX_SIGNATURE - 3) + '...' : text);
  });
  return { names, body: lines.join('\n') };
}

function build() {
  const packages = [];
  for (const packageName of PACKAGES) {
    const packageRoot = join(ROOT, 'node_modules', '@galaxy-stack', packageName);
    let manifest;
    try {
      manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
    } catch {
      throw new Error('missing devDependency @galaxy-stack/' + packageName + ' — run: bun install');
    }
    const rendered = renderPackageSymbols(surfaceOf(packageRoot));
    packages.push({ name: packageName, version: manifest.version, names: rendered.names, body: rendered.body });
  }

  const sections = packages.map((entry) =>
    '### ' + entry.name + '\n_@galaxy-stack/' + entry.name + '@' + entry.version + ' — ' + entry.names.length + ' exported symbols, copied from its dist/*.d.ts._\n\n' + entry.body,
  );
  const preamble = [
    'The complete public surface of every `@galaxy-stack/orbit-*` package, **generated from the declarations of the installed packages** by `scripts/generate-api-surface.mjs`, so it cannot drift from the versions listed at the end. Read the section for the package you need — or pass `symbol` to jump straight to one symbol — instead of opening `node_modules/**/*.d.ts`.',
    '',
    'Each line is a real declaration: signatures for functions and classes, member names for interfaces (a trailing `?` marks an optional member) and methods for classes. It is an inventory, not a tutorial: wiring recipes, runtime behaviour that differs from these declarations, and the symbols that do **not** exist live in the other topics (`pitfalls`, `absent`, `recipes`).',
    '',
    'The versions *your* project installs — and whether they differ from the ones below — come from the `orbit_environment` tool in one call.',
  ].join('\n');
  const compiledAgainst = '_Generated from: ' + packages.map((entry) => entry.name + '@' + entry.version).join(', ') + '._\n\n' +
    'If a project installs a different version, the declarations of *that* install win for the delta. Call `orbit_environment` to see the difference in one call, then report a genuinely missing symbol as a knowledge gap instead of silently re-deriving the whole surface.';

  const content = ['### Export surface\n' + preamble, ...sections, '### Compiled against\n' + compiledAgainst].join('\n\n');
  const symbolIndex = {};
  for (const entry of packages) for (const name of entry.names) if (symbolIndex[name] === undefined) symbolIndex[name] = entry.name;

  const source = [
    '/* Generated by scripts/generate-api-surface.mjs — do not edit by hand. */',
    '',
    'export const API_SURFACE_VERSION = 1;',
    '',
    '/** Exact package versions the surface below was copied from. */',
    'export const API_SURFACE_PACKAGES: readonly { readonly name: string; readonly version: string }[] = Object.freeze([',
    ...packages.map((entry) => '  Object.freeze({ name: ' + JSON.stringify(entry.name) + ', version: ' + JSON.stringify(entry.version) + ' }),'),
    ']);',
    '',
    '/** sha256 of the generated topic content; the contract test compares it. */',
    'export const API_SURFACE_DIGEST = ' + JSON.stringify(createHash('sha256').update(content).digest('hex')) + ';',
    '',
    '/** Exported symbol -> owning package, for symbol lookup and drift checks. */',
    'export const API_SURFACE_SYMBOLS: Readonly<Record<string, string>> = Object.freeze(' + JSON.stringify(symbolIndex, null, 2) + ');',
    '',
    '/** The generated topic content, with one ### section per package. */',
    'export const API_SURFACE_CONTENT = ' + JSON.stringify(content) + ';',
    '',
  ].join('\n');

  return { source, content, packages, symbols: symbolIndex };
}

const built = build();
if (process.argv.includes('--check')) {
  let committed = '';
  try {
    committed = readFileSync(OUT, 'utf8');
  } catch {
    console.error('generate-api-surface: ' + relative(ROOT, OUT) + ' is missing; run without --check');
    process.exit(1);
  }
  if (committed !== built.source) {
    console.error('generate-api-surface: ' + relative(ROOT, OUT) + ' is stale — regenerate and commit it.');
    process.exit(1);
  }
  console.log('generate-api-surface: up to date (' + built.content.length + ' characters, ' + Object.keys(built.symbols).length + ' symbols)');
  process.exit(0);
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, built.source);
console.log('generate-api-surface: wrote ' + relative(ROOT, OUT));
console.log('  packages: ' + built.packages.map((entry) => entry.name + '@' + entry.version).join(', '));
console.log('  topic: ' + built.content.length + ' characters, ' + Object.keys(built.symbols).length + ' unique symbols');
