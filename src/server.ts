/**
 * Orbit MCP server — stdio JSON-RPC 2.0 (Model Context Protocol, 2025-03-26 spec subset).
 * Zero runtime dependencies; runs under Bun or Node >= 18.
 *
 * Capabilities:
 *  - tools/list, tools/call      : framework knowledge + code generation + security review
 *  - resources/list, resources/read : documentation entries as orbit://knowledge/<id>
 *  - prompts/list, prompts/get   : ready-made task prompts for AI agents
 */

import { TOOLS, executeTool } from './tools';
import { KNOWLEDGE } from './knowledge';

export const PROTOCOL_VERSION = '2025-03-26';
export const SERVER_INFO = {
  name: '@galaxy-stack/orbit-mcp',
  version: '0.1.6',
};

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: JsonRpcId;
  method: string;
  params?: any;
}

const PROMPTS = [
  {
    name: 'build_orbit_feature',
    description: 'Design and implement a new Orbit feature module end-to-end (module, controller, service, validation, tests).',
    arguments: [
      { name: 'feature', description: 'Feature name, e.g. "orders"', required: true },
      { name: 'storage', description: 'Storage choice: memory | sqlite | none', required: false },
    ],
  },
  {
    name: 'harden_graphql_api',
    description: 'Audit and harden an Orbit GraphQL API: introspection, depth/complexity/alias limits, auth guards.',
    arguments: [
      { name: 'code', description: 'Current GraphQL module code', required: true },
    ],
  },
  {
    name: 'migrate_from_nestjs',
    description: 'Map NestJS concepts/decorators to Orbit equivalents and produce a migration plan.',
    arguments: [
      { name: 'nest_code', description: 'NestJS source to migrate', required: true },
    ],
  },
];

function promptText(name: string, args: Record<string, string>): string {
  switch (name) {
    case 'build_orbit_feature':
      return `Build an Orbit feature module named "${args.feature}"${args.storage ? ` using ${args.storage} storage` : ''}.\n\nRequirements:\n1. Create module, controller, service (orbit_scaffold_module tool can draft the skeleton).\n2. Validate all inputs with a Zod schema and ValidationPipe.\n3. Add auth guards to mutating routes.\n4. Wire the module into AppModule.\n5. Include unit tests (bun:test) and an e2e test through app.handle(Request).\n6. Run bun test to verify.`;
    case 'harden_graphql_api':
      return `Harden this Orbit GraphQL module:\n\n${args.code}\n\nUse the orbit_security_review tool (context: graphql) for the checklist, then apply fixes: disable introspection outside production, add security { maxDepth, maxComplexity, maxAliases }, guard protected resolvers, and disable the playground in production.`;
    case 'migrate_from_nestjs':
      return `Map this NestJS code to Orbit:\n\n${args.nest_code}\n\nConcept mapping: @nestjs/common decorators -> @galaxy-stack/orbit-core; class-validator DTOs -> Zod schemas + orbit-validation; @nestjs/graphql -> orbit-graphql; Bull queues -> (roadmap) orbit-queue; EventEmitter2 -> (roadmap) orbit-event-bus. Read the orbit://knowledge/* resources for detailed patterns. Produce: 1) mapping table, 2) migrated files, 3) test plan.`;
    default:
      return `Unknown prompt: ${name}`;
  }
}

function ok(id: JsonRpcId, result: unknown) {
  return { jsonrpc: '2.0', id, result };
}

function err(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

export function handleRequest(req: JsonRpcRequest): any {
  const { id = null, method, params = {} } = reqBell(req);

  switch (method) {
    case 'initialize':
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
        serverInfo: SERVER_INFO,
      });

    case 'ping':
      return ok(id, {});

    case 'tools/list':
      return ok(id, { tools: TOOLS });

    case 'tools/call': {
      const { name, arguments: args } = params;
      try {
        const result = executeTool(name, args || {});
        return ok(id, result);
      } catch (e: any) {
        return ok(id, {
          content: [{ type: 'text', text: `Tool error: ${e.message}` }],
          isError: true,
        });
      }
    }

    case 'resources/list':
      return ok(id, {
        resources: KNOWLEDGE.map(k => ({
          uri: `orbit://knowledge/${k.id}`,
          name: k.title,
          description: k.summary,
          mimeType: 'text/markdown',
        })),
      });

    case 'resources/read': {
      const uri: string = params.uri || '';
      const idPart = uri.replace('orbit://knowledge/', '');
      const entry = KNOWLEDGE.find(k => k.id === idPart);
      if (!entry) return err(id, -32602, `Unknown resource: ${uri}`);
      return ok(id, {
        contents: [{
          uri,
          mimeType: 'text/markdown',
          text: `# ${entry.title}\n\n${entry.content}`,
        }],
      });
    }

    case 'prompts/list':
      return ok(id, { prompts: PROMPTS });

    case 'prompts/get': {
      const prompt = PROMPTS.find(p => p.name === params.name);
      if (!prompt) return err(id, -32602, `Unknown prompt: ${params.name}`);
      return ok(id, {
        messages: [{
          role: 'user',
          content: {
            type: 'text',
            text: promptText(params.name, params.arguments || {}),
          },
        }],
      });
    }

    default:
      return err(id, -32601, `Method not found: ${method}`);
  }
}

// Guard against malformed ids so responses always carry a valid id field.
function reqBell(req: JsonRpcRequest): JsonRpcRequest {
  return req;
}

/** Read newline-delimited JSON-RPC from stdin, write responses to stdout. */
export async function serveStdio(
  input: NodeJS.ReadableStream = process.stdin,
  output: NodeJS.WritableStream = process.stdout
): Promise<void> {
  let buffer = '';
  const out = output as NodeJS.WriteStream;

  for await (const chunk of input as any) {
    buffer += typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk);
    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line) continue;
      let response: unknown;
      try {
        const req = JSON.parse(line) as JsonRpcRequest;
        if (req.jsonrpc !== '2.0' || typeof req.method !== 'string') {
          response = err(req.id ?? null, -32600, 'Invalid Request');
        } else if (req.id === undefined) {
          // Notifications produce no response
          continue;
        } else {
          response = handleRequest(req);
        }
      } catch {
        response = err(null, -32700, 'Parse error');
      }
      out.write(JSON.stringify(response) + '\n');
    }
  }
}

if (import.meta.main) {
  serveStdio().catch((e) => {
    console.error('orbit-mcp fatal:', e);
    process.exit(1);
  });
}
