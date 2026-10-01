---
"@galaxy-stack/orbit-mcp": patch
---

Repair literal placeholder artefacts in the published text.

The generated-surface release tooling replaced its own backtick placeholders in the wrong order,
so a handful of prose spans shipped a literal `@@` where a code span should close: the skill, the
`pitfalls` and `absent` topics, and one sentence of the generated `api-surface` preamble. The
wording is unchanged; only the broken markers are repaired, and the generator no longer produces
them.