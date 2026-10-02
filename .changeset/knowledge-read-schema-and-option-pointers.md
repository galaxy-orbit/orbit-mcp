---
"@galaxy-stack/orbit-mcp": patch
---

Accept the call shapes the skill documents, and point at the option interfaces.

The 2026-10-02 gymflow rerun (CLI 2.0.13 + orbit-mcp 0.4.0 straight from npm) failed four MCP calls
with `data must have required property 'id'`: `orbit_knowledge_read` still declared `id` as required
even though 0.4.0 made `{ section }` and `{ symbol }` first-class — both are documented in the bundled
skill — and `symbol` was missing from the schema entirely. A schema-level contract test now validates
every documented shape (and that each of them answers at runtime) before the harness rejects one.

The same run spent 49 shell commands grepping `node_modules/**/dist/*.js` for the `SecurityModule`,
`CsrfOptions`, `HelmetOptions` and `CorsOptions` shapes, which the generated surface already carries.
The security checklist now names those symbols, `orbit_recipe` gains `security-module-options`,
`security-options`, `csrf-options`, `helmet-options` and `cors-options` tasks, and the topic says
plainly not to grep the compiled output for them.