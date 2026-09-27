# Changelog

All notable changes to this package are documented here.
Releases are versioned with [Changesets](https://github.com/changesets/changesets).

## @galaxy-stack/orbit-mcp@0.1.13

- `McpTool` declares the optional `annotations` field the tool definitions use;
  `tsc --emitDeclarationOnly` previously failed with TS2353 and emitted no types.
- `build:types` emits declarations into `dist/` and the publish workflow runs it,
  so npm ships `dist/index.d.ts`.
- Add smithery.yaml for Smithery registry publishing and expose a configSchema sample.

## @galaxy-stack/orbit-mcp@0.1.3

- Fix broken npm bin entry: rebuilt bundles could lose the Node shebang, so the
  shell tried to execute the bundle as a bash script and the MCP server exited
  before the handshake. `bun run build` now guarantees the shebang via banner
  plus a post-build guard (`scripts/fix-bin-shebang.mjs`).
- Sync server info version with the package version.

## @galaxy-stack/orbit-mcp@0.1.0

- Initial standalone release migrated from the Orbit monorepo.
