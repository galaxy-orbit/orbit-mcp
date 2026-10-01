# Changelog

All notable changes to this package are documented here.
Releases are versioned with [Changesets](https://github.com/changesets/changesets).

## @galaxy-stack/orbit-mcp@0.3.1

- Repair literal `@@` placeholders that shipped in the generated `api-surface` preamble, the
  `pitfalls` and `absent` topics and the bundled `orbit-framework` skill; the release tooling had
  replaced its backtick placeholders in the wrong order. Wording unchanged.
- Track the released version in `package.json` again (the publish workflow versions the package in
  CI, so the repository had stayed at 0.2.0 while npm served 0.3.0).
## @galaxy-stack/orbit-mcp@0.3.0

- Generate the `api-surface` topic from the declarations of the nine `@galaxy-stack/orbit-*`
  packages (487 symbols, one section per package) and commit it; the generator's `--check` mode plus
  a CI step fail the build when the committed surface drifts from the installed packages. Extending coverage to another package is one line in the generator.
- Add `orbit_environment` (installed versions next to the versions the surface was generated from)
  and `orbit_recipe` (one verified wiring recipe per task).
- `orbit_knowledge_read` gains `symbol` lookup and cross-topic alias routing.
- Add the `pitfalls` and `absent` topics; move the superseded hand-written export list into the
  generated topic and the wiring content into `recipes`.
- Rewrite the bundled `orbit-framework` skill as a rulebook + router (122 lines) that points at the
  knowledge instead of duplicating it.
- Tests: 39 unit tests and 23 stdio smoke assertions.
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