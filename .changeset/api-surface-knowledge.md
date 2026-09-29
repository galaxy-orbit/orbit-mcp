---
"@galaxy-stack/orbit-mcp": minor
---

Serve the API surface instead of asking agents to read declarations.

An end-to-end run of a 25-prompt flow showed the agent touching `node_modules` 752
times, concentrated in `orbit-core/index.d.ts` (91), `orbit-common/index.d.ts` (32),
`orbit-database/*` (~90) and `orbit-security/*` (~30) — every read was the agent
re-deriving which symbols a package exports and what the key signatures are.

The knowledge base now carries an `api-surface` topic with:

- package exports and signatures for orbit-core, orbit-common, orbit-database,
  orbit-security and orbit-throttler, including factory options, DI/controller
  decorators, versioning, config tokens, exception constructors, parameter
  decorators, `ArgumentMetadata`, transform options and the `OrbitApplication`
  surface (with the explicit note that there is no `useGlobalPipes`,
  `useGlobalGuards` or `useGlobalFilters`);
- the concrete database wiring pattern (`sqlite` uses `database`, not `url`;
  `DatabaseModule.forFeature(entities, tableMap)`; `DrizzleRepository(db, table, Entity)`
  over hand-writing `BaseRepository`);
- security and throttling wiring, plus the three shipped READMEs that contradict their
  own types (`csrf { enabled, tokenKey, cookieName }`, `RedisThrottlerStorage`, and a
  `throttlers: [...]` array that `ThrottlerModuleOptions` does not have);
- middleware, CORS and static-serving contracts, and rate-limiting recipes
  (`rateLimit(...).createMiddleware()`, `ThrottlerModule.forRoot({ ttl, limit })`,
  the `@Catch(ThrottlerException)` 429 filter, the `ThrottlerStorage` contract);
- the versions the map was compiled from (orbit-core@0.2.3, orbit-common@0.1.15,
  orbit-database@0.1.10, orbit-security@0.1.10, orbit-throttler@0.1.10) and the rule
  that `package.json` is for the installed version while a delta is reported rather
  than silently re-derived.

The docs stamp (`DOCS_STAMP`) no longer tells agents to read `.d.ts` files to learn the
API: it points at this topic and the bundled `orbit-framework` skill, keeps
`package.json` for the version, and asks for a knowledge-gap report instead of a silent
declaration read. Measured after the change: the same steps dropped from 50/51/53 reads
to 0-2, with the security step down from 110 to 11-33 (the residual reads are the model
double-checking).
