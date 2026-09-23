<div align="center">

# @galaxy-stack/orbit-mcp

**Model Context Protocol server for the Orbit framework**

Give AI coding agents first-class knowledge of Orbit: framework patterns, code scaffolding, and security review — through the [Model Context Protocol](https://modelcontextprotocol.io).

[![npm version](https://img.shields.io/npm/v/@galaxy-stack/orbit-mcp.svg)](https://www.npmjs.com/package/@galaxy-stack/orbit-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Bun](https://img.shields.io/badge/runtime-Bun-f9f1e1?logo=bun)](https://bun.sh)

</div>

## What it does

Orbit MCP turns any AI coding agent (Claude, Cursor, Codex, …) into an Orbit-aware collaborator. It exposes:

| Capability | Tools / Resources | Purpose |
|---|---|---|
| **Knowledge** | `orbit_knowledge_topics`, `orbit_knowledge_read`, `orbit://knowledge/*` | Module/controller/DI/GraphQL/microservices patterns, package map, security checklist |
| **Scaffolding** | `orbit_scaffold_module`, `orbit_scaffold_graphql` | Generate complete feature modules with validation, guards, and tests |
| **Security review** | `orbit_security_review` | Static checklist against pasted code — missing validation, guards, rate limits, GraphQL limits, hardcoded secrets, unsanitized HTML |
| **Prompts** | `build_orbit_feature`, `harden_graphql_api`, `migrate_from_nestjs` | Ready-made task prompts for agents |

## Quick start

Add to your agent's MCP config:

```json
{
  "mcpServers": {
    "orbit": {
      "command": "bunx",
      "args": ["@galaxy-stack/orbit-mcp"]
    }
  }
}
```

Or run directly from a checkout:

```sh
bun run src/server.ts
```

## Example session

> **Agent:** List what you know about Orbit.
>
> `orbit_knowledge_topics` →
> `- module-pattern — Module pattern: Organize features into @Module classes…`
> `- security-checklist — Security checklist: Helmet headers, CSRF, rate limiting…`
> `…`

> **Agent:** Review this controller for security issues.
>
> `orbit_security_review` with the pasted code →
> `1. [HIGH] Mutation endpoints lack input validation. Add ValidationPipe with a Zod schema…`
> `2. [HIGH] State-changing endpoint without an auth guard…`

## Companion skill

The [`skills/orbit-framework/SKILL.md`](skills/orbit-framework/SKILL.md) file is a
portable skill definition covering the same guidance for agents that prefer
skills over MCP. Copy it into your agent's skills directory or reference it in
your prompt.

## Protocol

Implements MCP `2025-03-26` over stdio (newline-delimited JSON-RPC 2.0):
`initialize`, `ping`, `tools/list`, `tools/call`, `resources/list`,
`resources/read`, `prompts/list`, `prompts/get`. Zero runtime dependencies —
runs under Bun or Node >= 18.

## License

MIT
