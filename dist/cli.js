#!/usr/bin/env node
// @bun

// src/tools.ts
import { readdirSync, readFileSync } from "fs";
import { join } from "path";

// src/generated/api-surface.ts
var API_SURFACE_PACKAGES = Object.freeze([
  Object.freeze({ name: "orbit-core", version: "0.2.3" }),
  Object.freeze({ name: "orbit-common", version: "0.1.15" }),
  Object.freeze({ name: "orbit-database", version: "0.1.10" }),
  Object.freeze({ name: "orbit-security", version: "0.1.10" }),
  Object.freeze({ name: "orbit-throttler", version: "0.1.10" }),
  Object.freeze({ name: "orbit-graphql", version: "0.1.15" }),
  Object.freeze({ name: "orbit-validation", version: "0.1.11" }),
  Object.freeze({ name: "orbit-microservices", version: "0.1.10" }),
  Object.freeze({ name: "orbit-swagger", version: "0.1.11" })
]);
var API_SURFACE_SYMBOLS = Object.freeze({
  Abstract: "orbit-core",
  ActiveRequest: "orbit-core",
  All: "orbit-core",
  ArgumentMetadata: "orbit-core",
  BadGatewayException: "orbit-core",
  BadRequestException: "orbit-core",
  BeforeApplicationShutdown: "orbit-core",
  BunFactory: "orbit-core",
  CallHandler: "orbit-core",
  CanActivate: "orbit-core",
  circuitBreaker: "orbit-core",
  CircuitBreaker: "orbit-core",
  CircuitBreakerOptions: "orbit-core",
  circuitBreakerRegistry: "orbit-core",
  CircuitBreakerRegistry: "orbit-core",
  CircuitBreakerStats: "orbit-core",
  CircuitOpenError: "orbit-core",
  CircuitState: "orbit-core",
  CircuitTimeoutError: "orbit-core",
  ClassProvider: "orbit-core",
  ClusterManager: "orbit-core",
  ClusterMessage: "orbit-core",
  ClusterOptions: "orbit-core",
  CompiledModule: "orbit-core",
  CONFIG_OPTIONS: "orbit-core",
  ConfigFactory: "orbit-core",
  ConfigModule: "orbit-core",
  ConfigModuleOptions: "orbit-core",
  ConfigNamespace: "orbit-core",
  ConfigService: "orbit-core",
  CONFIGURATION_SERVICE_TOKEN: "orbit-core",
  CONFIGURATION_TOKEN: "orbit-core",
  ConflictException: "orbit-core",
  Container: "orbit-core",
  Controller: "orbit-core",
  cors: "orbit-core",
  CorsMiddleware: "orbit-core",
  CorsOptions: "orbit-core",
  createTimeoutHandler: "orbit-core",
  createZodDto: "orbit-core",
  DefaultValuePipe: "orbit-core",
  Delete: "orbit-core",
  DynamicModule: "orbit-core",
  emitRequestTelemetry: "orbit-core",
  ExceptionFilter: "orbit-core",
  ExecutionContext: "orbit-core",
  ExecutionPipeline: "orbit-core",
  ExistingProvider: "orbit-core",
  FactoryProvider: "orbit-core",
  ForbiddenException: "orbit-core",
  forwardRef: "orbit-core",
  ForwardReference: "orbit-core",
  GalaxyApplication: "orbit-core",
  GalaxyFactory: "orbit-core",
  GalaxyInterceptor: "orbit-core",
  GalaxyMiddleware: "orbit-core",
  GatewayTimeoutException: "orbit-core",
  Get: "orbit-core",
  getGracefulShutdownManager: "orbit-core",
  getProviderToken: "orbit-core",
  GoneException: "orbit-core",
  gracefulShutdown: "orbit-core",
  GracefulShutdownManager: "orbit-core",
  GracefulShutdownOptions: "orbit-core",
  hasBeforeApplicationShutdown: "orbit-core",
  hasConfigureMethod: "orbit-core",
  hasOnApplicationBootstrap: "orbit-core",
  hasOnApplicationShutdown: "orbit-core",
  hasOnModuleDestroy: "orbit-core",
  hasOnModuleInit: "orbit-core",
  Head: "orbit-core",
  HttpArgumentsHost: "orbit-core",
  HttpException: "orbit-core",
  HttpMethod: "orbit-core",
  Inject: "orbit-core",
  Injectable: "orbit-core",
  InjectableOptions: "orbit-core",
  InjectionToken: "orbit-core",
  InternalServerErrorException: "orbit-core",
  isClassProvider: "orbit-core",
  isExistingProvider: "orbit-core",
  isFactoryProvider: "orbit-core",
  isForwardReference: "orbit-core",
  isPrimaryProcess: "orbit-core",
  isValueProvider: "orbit-core",
  isWorkerProcess: "orbit-core",
  METADATA_KEYS: "orbit-core",
  MetadataKey: "orbit-core",
  MethodNotAllowedException: "orbit-core",
  Middleware: "orbit-core",
  MiddlewareClass: "orbit-core",
  MiddlewareConfigProxy: "orbit-core",
  MiddlewareConfigProxyImpl: "orbit-core",
  MiddlewareConfiguration: "orbit-core",
  MiddlewareConsumer: "orbit-core",
  MiddlewareConsumerImpl: "orbit-core",
  MiddlewareFunction: "orbit-core",
  MiddlewareRegistry: "orbit-core",
  Module: "orbit-core",
  ModuleCompiler: "orbit-core",
  ModuleImport: "orbit-core",
  ModuleMetadata: "orbit-core",
  ModuleScanner: "orbit-core",
  NestInterceptor: "orbit-core",
  NestModule: "orbit-core",
  NotAcceptableException: "orbit-core",
  NotFoundException: "orbit-core",
  notifyReady: "orbit-core",
  NotImplementedException: "orbit-core",
  OnApplicationBootstrap: "orbit-core",
  OnApplicationShutdown: "orbit-core",
  OnModuleDestroy: "orbit-core",
  OnModuleInit: "orbit-core",
  onRequestTelemetry: "orbit-core",
  onShutdown: "orbit-core",
  Optional: "orbit-core",
  Options: "orbit-core",
  OrbitApplication: "orbit-core",
  OrbitApplicationOptions: "orbit-core",
  OrbitFactory: "orbit-core",
  OrbitMiddleware: "orbit-core",
  ParamMetadata: "orbit-core",
  ParseArrayPipe: "orbit-core",
  ParseBoolPipe: "orbit-core",
  ParseEnumPipe: "orbit-core",
  ParseFloatPipe: "orbit-core",
  ParseIntPipe: "orbit-core",
  ParseUUIDPipe: "orbit-core",
  Patch: "orbit-core",
  PayloadTooLargeException: "orbit-core",
  PipeTransform: "orbit-core",
  Post: "orbit-core",
  Provider: "orbit-core",
  Put: "orbit-core",
  Reflector: "orbit-core",
  registerAs: "orbit-core",
  RequestHandler: "orbit-core",
  RequestTelemetry: "orbit-core",
  RequestTimeoutError: "orbit-core",
  ResolvedMiddleware: "orbit-core",
  RouteDefinition: "orbit-core",
  RouteExplorer: "orbit-core",
  RouteInfo: "orbit-core",
  RouteInfoOrController: "orbit-core",
  Scope: "orbit-core",
  serveStatic: "orbit-core",
  ServiceUnavailableException: "orbit-core",
  StaticMiddleware: "orbit-core",
  StaticServeOptions: "orbit-core",
  timeout: "orbit-core",
  TimeoutMiddleware: "orbit-core",
  TimeoutOptions: "orbit-core",
  TrimPipe: "orbit-core",
  Type: "orbit-core",
  UnauthorizedException: "orbit-core",
  UnprocessableEntityException: "orbit-core",
  UnsupportedMediaTypeException: "orbit-core",
  ValidationPipe: "orbit-core",
  ValidationPipeOptions: "orbit-core",
  ValueProvider: "orbit-core",
  Version: "orbit-core",
  VERSION_METADATA: "orbit-core",
  VERSION_NEUTRAL: "orbit-core",
  versioningManager: "orbit-core",
  VersioningManager: "orbit-core",
  VersioningOptions: "orbit-core",
  VersioningType: "orbit-core",
  withCircuitBreaker: "orbit-core",
  WorkerInfo: "orbit-core",
  ZodSchema: "orbit-core",
  ZodValidationPipe: "orbit-core",
  applySecureHeaderRecord: "orbit-common",
  applyTransforms: "orbit-common",
  ArgumentsHost: "orbit-common",
  Body: "orbit-common",
  buildSecureHeaders: "orbit-common",
  Catch: "orbit-common",
  DefaultValue: "orbit-common",
  getCatchExceptions: "orbit-common",
  getFilters: "orbit-common",
  getGuards: "orbit-common",
  getHeaders: "orbit-common",
  getHttpCode: "orbit-common",
  getInterceptors: "orbit-common",
  getParamMetadata: "orbit-common",
  getPipes: "orbit-common",
  getRedirect: "orbit-common",
  GuardClass: "orbit-common",
  GUARDS_METADATA: "orbit-common",
  Header: "orbit-common",
  Headers: "orbit-common",
  HttpCode: "orbit-common",
  Ip: "orbit-common",
  OrbitInterceptor: "orbit-common",
  Param: "orbit-common",
  ParamType: "orbit-common",
  Query: "orbit-common",
  Redirect: "orbit-common",
  Render: "orbit-common",
  Req: "orbit-common",
  Request: "orbit-common",
  Res: "orbit-common",
  Response: "orbit-common",
  SecureHeaderOptions: "orbit-common",
  Session: "orbit-common",
  ToArray: "orbit-common",
  ToBoolean: "orbit-common",
  ToDate: "orbit-common",
  ToFloat: "orbit-common",
  ToInt: "orbit-common",
  ToLowerCase: "orbit-common",
  ToUpperCase: "orbit-common",
  Transform: "orbit-common",
  TRANSFORM_METADATA: "orbit-common",
  TransformFn: "orbit-common",
  TransformOptions: "orbit-common",
  Trim: "orbit-common",
  UploadedFile: "orbit-common",
  UploadedFiles: "orbit-common",
  UseFilters: "orbit-common",
  UseGuards: "orbit-common",
  UseInterceptors: "orbit-common",
  UsePipes: "orbit-common",
  withSecureHeaders: "orbit-common",
  BaseRepository: "orbit-database",
  BunDataSource: "orbit-database",
  Column: "orbit-database",
  COLUMN_METADATA: "orbit-database",
  ColumnMetadata: "orbit-database",
  ColumnOptions: "orbit-database",
  createDataSource: "orbit-database",
  DATA_SOURCE: "orbit-database",
  DATABASE_OPTIONS: "orbit-database",
  DatabaseFeatureOptions: "orbit-database",
  DatabaseModule: "orbit-database",
  DatabaseModuleAsyncOptions: "orbit-database",
  DatabaseModuleOptions: "orbit-database",
  DataSource: "orbit-database",
  DrizzleRepository: "orbit-database",
  Entity: "orbit-database",
  ENTITY_METADATA: "orbit-database",
  EntityMetadata: "orbit-database",
  EntityOptions: "orbit-database",
  InjectRepository: "orbit-database",
  PoolOptions: "orbit-database",
  PRIMARY_KEY_METADATA: "orbit-database",
  PrimaryGeneratedColumn: "orbit-database",
  PrimaryKey: "orbit-database",
  Repository: "orbit-database",
  REPOSITORY_METADATA: "orbit-database",
  Transactional: "orbit-database",
  TRANSACTIONAL_METADATA: "orbit-database",
  TransactionOptions: "orbit-database",
  ApiKeyManager: "orbit-security",
  ApiKeyMetadata: "orbit-security",
  ApiKeyOptions: "orbit-security",
  ApiKeyRotationScheduler: "orbit-security",
  ApiKeyValidation: "orbit-security",
  ContentSecurityPolicyOptions: "orbit-security",
  createApiKeyManager: "orbit-security",
  CRYPTO_UTILS: "orbit-security",
  CryptoUtils: "orbit-security",
  CSRF_MIDDLEWARE: "orbit-security",
  CsrfCookieOptions: "orbit-security",
  CsrfException: "orbit-security",
  CsrfMiddleware: "orbit-security",
  CsrfOptions: "orbit-security",
  detectSqlInjection: "orbit-security",
  detectXss: "orbit-security",
  escapeHtml: "orbit-security",
  HashAlgorithm: "orbit-security",
  HELMET_MIDDLEWARE: "orbit-security",
  HelmetMiddleware: "orbit-security",
  HelmetOptions: "orbit-security",
  HstsOptions: "orbit-security",
  rateLimit: "orbit-security",
  RateLimitInfo: "orbit-security",
  RateLimitOptions: "orbit-security",
  ReferrerPolicy: "orbit-security",
  SanitizationPipe: "orbit-security",
  sanitizeHtml: "orbit-security",
  sanitizeObject: "orbit-security",
  SanitizerOptions: "orbit-security",
  sanitizeString: "orbit-security",
  SECURITY_MODULE_OPTIONS: "orbit-security",
  SecurityModule: "orbit-security",
  SecurityModuleOptions: "orbit-security",
  SlidingWindowRateLimiter: "orbit-security",
  SqlInjectionPipe: "orbit-security",
  stripHtml: "orbit-security",
  tokenBucket: "orbit-security",
  TokenBucketRateLimiter: "orbit-security",
  unescapeHtml: "orbit-security",
  XssPipe: "orbit-security",
  SkipThrottle: "orbit-throttler",
  Throttle: "orbit-throttler",
  THROTTLE_METADATA: "orbit-throttler",
  THROTTLE_SKIP_METADATA: "orbit-throttler",
  ThrottleOptions: "orbit-throttler",
  THROTTLER_GUARD: "orbit-throttler",
  THROTTLER_OPTIONS: "orbit-throttler",
  THROTTLER_STORAGE: "orbit-throttler",
  ThrottlerAsyncOptions: "orbit-throttler",
  ThrottlerContext: "orbit-throttler",
  ThrottlerException: "orbit-throttler",
  ThrottlerGuard: "orbit-throttler",
  ThrottlerMemoryStorage: "orbit-throttler",
  ThrottlerModule: "orbit-throttler",
  ThrottlerModuleOptions: "orbit-throttler",
  ThrottlerOptions: "orbit-throttler",
  ThrottlerRedisOptions: "orbit-throttler",
  ThrottlerRedisStorage: "orbit-throttler",
  ThrottlerRequest: "orbit-throttler",
  ThrottlerStorage: "orbit-throttler",
  ThrottlerStorageRecord: "orbit-throttler",
  aliasLimit: "orbit-graphql",
  Args: "orbit-graphql",
  ARGS_METADATA: "orbit-graphql",
  ARGS_TYPE_METADATA: "orbit-graphql",
  ArgsOptions: "orbit-graphql",
  ArgsType: "orbit-graphql",
  blockIntrospection: "orbit-graphql",
  complexityLimit: "orbit-graphql",
  ComplexityOptions: "orbit-graphql",
  Context: "orbit-graphql",
  CONTEXT_METADATA: "orbit-graphql",
  createDataLoader: "orbit-graphql",
  createDataLoaderContext: "orbit-graphql",
  createSubscriptionServer: "orbit-graphql",
  DataLoader: "orbit-graphql",
  DATALOADER_METADATA: "orbit-graphql",
  DataLoaderConfig: "orbit-graphql",
  DataLoaderContext: "orbit-graphql",
  DataLoaderFactory: "orbit-graphql",
  DataLoaderOptions: "orbit-graphql",
  DEFAULT_GRAPHQL_SECURITY: "orbit-graphql",
  depthLimit: "orbit-graphql",
  ENUM_METADATA: "orbit-graphql",
  Field: "orbit-graphql",
  FIELD_METADATA: "orbit-graphql",
  FieldMetadata: "orbit-graphql",
  FieldOptions: "orbit-graphql",
  Float: "orbit-graphql",
  getParamsMetadata: "orbit-graphql",
  GRAPHQL_SCHEMA: "orbit-graphql",
  GraphQLHandler: "orbit-graphql",
  GraphQLModule: "orbit-graphql",
  GraphQLModuleAsyncOptions: "orbit-graphql",
  GraphQLModuleOptions: "orbit-graphql",
  GraphQLSecurityOptions: "orbit-graphql",
  GraphQLWebSocketServer: "orbit-graphql",
  ID: "orbit-graphql",
  Info: "orbit-graphql",
  INFO_METADATA: "orbit-graphql",
  INPUT_TYPE_METADATA: "orbit-graphql",
  InputType: "orbit-graphql",
  Int: "orbit-graphql",
  INTERFACE_TYPE_METADATA: "orbit-graphql",
  InterfaceType: "orbit-graphql",
  Loader: "orbit-graphql",
  Mutation: "orbit-graphql",
  MUTATION_METADATA: "orbit-graphql",
  MutationOptions: "orbit-graphql",
  OBJECT_TYPE_METADATA: "orbit-graphql",
  ObjectType: "orbit-graphql",
  Parent: "orbit-graphql",
  PARENT_METADATA: "orbit-graphql",
  PubSub: "orbit-graphql",
  PubSubEngine: "orbit-graphql",
  QUERY_METADATA: "orbit-graphql",
  QueryOptions: "orbit-graphql",
  registerEnumType: "orbit-graphql",
  RESOLVE_FIELD_METADATA: "orbit-graphql",
  ResolveField: "orbit-graphql",
  ResolveFieldOptions: "orbit-graphql",
  Resolver: "orbit-graphql",
  RESOLVER_METADATA: "orbit-graphql",
  RESOLVER_NAME_METADATA: "orbit-graphql",
  ResolverMethodMetadata: "orbit-graphql",
  ResolverOptions: "orbit-graphql",
  Root: "orbit-graphql",
  ROOT_METADATA: "orbit-graphql",
  SchemaBuilder: "orbit-graphql",
  SchemaGraph: "orbit-graphql",
  SchemaGraphEdge: "orbit-graphql",
  SchemaGraphNode: "orbit-graphql",
  Subscription: "orbit-graphql",
  SUBSCRIPTION_METADATA: "orbit-graphql",
  SubscriptionHandler: "orbit-graphql",
  SubscriptionOptions: "orbit-graphql",
  TypeOptions: "orbit-graphql",
  WebSocketServerOptions: "orbit-graphql",
  withFilter: "orbit-graphql",
  Client: "orbit-microservices",
  CLIENT_METADATA: "orbit-microservices",
  ClientAsyncRegistration: "orbit-microservices",
  ClientOptions: "orbit-microservices",
  ClientProxy: "orbit-microservices",
  ClientRegistration: "orbit-microservices",
  ClientsModule: "orbit-microservices",
  Closeable: "orbit-microservices",
  Ctx: "orbit-microservices",
  CustomTransportStrategy: "orbit-microservices",
  EventPattern: "orbit-microservices",
  getTransport: "orbit-microservices",
  GrpcMethod: "orbit-microservices",
  GrpcStreamMethod: "orbit-microservices",
  IncomingMessage: "orbit-microservices",
  MessageContext: "orbit-microservices",
  MessageHandler: "orbit-microservices",
  MessagePattern: "orbit-microservices",
  MicroserviceFactory: "orbit-microservices",
  MicroserviceOptions: "orbit-microservices",
  OutgoingMessage: "orbit-microservices",
  PacketId: "orbit-microservices",
  PATTERN_HANDLER_METADATA: "orbit-microservices",
  PATTERN_METADATA: "orbit-microservices",
  PatternMetadata: "orbit-microservices",
  Payload: "orbit-microservices",
  PayloadOptions: "orbit-microservices",
  ReadPacket: "orbit-microservices",
  RedisOptions: "orbit-microservices",
  registerTransport: "orbit-microservices",
  Server: "orbit-microservices",
  TcpOptions: "orbit-microservices",
  Transport: "orbit-microservices",
  TRANSPORT_METADATA: "orbit-microservices",
  TransportOptions: "orbit-microservices",
  WritePacket: "orbit-microservices",
  API_BEARER_AUTH_METADATA: "orbit-swagger",
  API_BODY_METADATA: "orbit-swagger",
  API_EXCLUDE_METADATA: "orbit-swagger",
  API_OPERATION_METADATA: "orbit-swagger",
  API_PARAM_METADATA: "orbit-swagger",
  API_PROPERTY_METADATA: "orbit-swagger",
  API_RESPONSE_METADATA: "orbit-swagger",
  API_SECURITY_METADATA: "orbit-swagger",
  API_TAGS_METADATA: "orbit-swagger",
  ApiBadRequestResponse: "orbit-swagger",
  ApiBearerAuth: "orbit-swagger",
  ApiBody: "orbit-swagger",
  ApiBodyOptions: "orbit-swagger",
  ApiCreatedResponse: "orbit-swagger",
  ApiExcludeController: "orbit-swagger",
  ApiExcludeEndpoint: "orbit-swagger",
  ApiForbiddenResponse: "orbit-swagger",
  ApiInternalServerErrorResponse: "orbit-swagger",
  ApiNotFoundResponse: "orbit-swagger",
  ApiOkResponse: "orbit-swagger",
  ApiOperation: "orbit-swagger",
  ApiOperationOptions: "orbit-swagger",
  ApiParam: "orbit-swagger",
  ApiParamOptions: "orbit-swagger",
  ApiProperty: "orbit-swagger",
  ApiPropertyOptional: "orbit-swagger",
  ApiPropertyOptions: "orbit-swagger",
  ApiQuery: "orbit-swagger",
  ApiQueryOptions: "orbit-swagger",
  ApiResponse: "orbit-swagger",
  ApiResponseOptions: "orbit-swagger",
  ApiSecurity: "orbit-swagger",
  ApiTags: "orbit-swagger",
  ApiUnauthorizedResponse: "orbit-swagger",
  DocumentBuilder: "orbit-swagger",
  OpenAPIComponents: "orbit-swagger",
  OpenAPIDocument: "orbit-swagger",
  OpenAPIExample: "orbit-swagger",
  OpenAPIExternalDocs: "orbit-swagger",
  OpenAPIHeader: "orbit-swagger",
  OpenAPIInfo: "orbit-swagger",
  OpenAPIMediaType: "orbit-swagger",
  OpenAPIOAuthFlow: "orbit-swagger",
  OpenAPIOAuthFlows: "orbit-swagger",
  OpenAPIOperation: "orbit-swagger",
  OpenAPIParameter: "orbit-swagger",
  OpenAPIPathItem: "orbit-swagger",
  OpenAPIRequestBody: "orbit-swagger",
  OpenAPIResponse: "orbit-swagger",
  OpenAPISchema: "orbit-swagger",
  OpenAPISecurityRequirement: "orbit-swagger",
  OpenAPISecurityScheme: "orbit-swagger",
  OpenAPIServer: "orbit-swagger",
  OpenAPITag: "orbit-swagger",
  SwaggerDocumentOptions: "orbit-swagger",
  SwaggerExplorer: "orbit-swagger",
  SwaggerModule: "orbit-swagger",
  SwaggerModuleOptions: "orbit-swagger"
});
var API_SURFACE_CONTENT = "### Export surface\nThe complete public surface of every `@galaxy-stack/orbit-*` package, **generated from the declarations of the installed packages** by `scripts/generate-api-surface.mjs`, so it cannot drift from the versions listed at the end. Read the section for the package you need \u2014 or pass `symbol` to jump straight to one symbol \u2014 instead of opening `node_modules/**/*.d.ts`.\n\nEach line is a real declaration: signatures for functions and classes, member names for interfaces (a trailing `?` marks an optional member) and methods for classes. It is an inventory, not a tutorial: wiring recipes, runtime behaviour that differs from these declarations, and the symbols that do **not** exist live in the other topics (`pitfalls`, `absent`, `recipes`).\n\nThe versions *your* project installs \u2014 and whether they differ from the ones below \u2014 come from the `orbit_environment` tool in one call.\n\n### orbit-core\n_@galaxy-stack/orbit-core@0.2.3 \u2014 171 exported symbols, copied from its dist/*.d.ts._\n\n- interface Abstract<T = any> extends Function { prototype }\n- interface ActiveRequest { id, startedAt, path?, method? }\n- const All: (path?: string) => MethodDecorator;\n- interface ArgumentMetadata { type, metatype?, data? }\n- BadGatewayException (re-exported)\n- BadRequestException (re-exported)\n- interface BeforeApplicationShutdown { beforeApplicationShutdown() }\n- const BunFactory: typeof OrbitFactory;\n- interface CallHandler<T = any> { handle() }\n- interface CanActivate { canActivate() }\n- function circuitBreaker<T>(action: () => Promise<T>, options?: CircuitBreakerOptions): Promise<T>;\n- class CircuitBreaker<T> { execute(), reset(), forceOpen(), forceClosed() }\n- interface CircuitBreakerOptions { failureThreshold?, successThreshold?, timeout?, resetTimeout?, volumeThreshold?, onStateChange?, onSuccess?, onFailure?, is...\n- const circuitBreakerRegistry: CircuitBreakerRegistry;\n- class CircuitBreakerRegistry { register(), get(), getOrCreate(), remove(), clear(), getAllStats(), resetAll() }\n- interface CircuitBreakerStats { state, failures, successes, totalCalls, lastFailureTime, lastSuccessTime, consecutiveSuccesses, consecutiveFailures }\n- class CircuitOpenError extends Error\n- type CircuitState\n- class CircuitTimeoutError extends Error\n- interface ClassProvider<T = any> { provide, useClass, scope? }\n- class ClusterManager { start(), broadcast(), sendToWorker(), shutdown(), getStats(), totalWorkers, activeWorkers, crashedWorkers, totalRespawns }\n- interface ClusterMessage { type, workerId?, payload? }\n- interface ClusterOptions { workers?, workerScript?, respawn?, respawnDelay?, maxRespawns?, gracefulTimeout? }\n- interface CompiledModule { metatype, imports, controllers, providers, exports }\n- const CONFIG_OPTIONS: unique symbol;\n- interface ConfigFactory<T = Record<string, any>>\n- class ConfigModule { forRoot(), forFeature() }\n- interface ConfigModuleOptions { isGlobal?, envFilePath?, ignoreEnvFile?, ignoreEnvVars?, validate?, validationSchema?, validationOptions?, allowUnknown?, abo...\n- interface ConfigNamespace<T = Record<string, any>> { KEY, asProvider(), provide, useFactory }\n- class ConfigService<K = Record<string, any>> { get(), getOrThrow(), set(), setEnableCache() }\n- const CONFIGURATION_SERVICE_TOKEN: unique symbol;\n- const CONFIGURATION_TOKEN: unique symbol;\n- ConflictException (re-exported)\n- class Container { register(), registerMany(), has(), resolve(), get(), clear(), getAllInstances() }\n- function Controller(prefix?: string): ClassDecorator;\n- function cors(options?: CorsOptions): CorsMiddleware;\n- class CorsMiddleware implements OrbitMiddleware { use() }\n- interface CorsOptions { origin?, methods?, allowedHeaders?, exposedHeaders?, credentials?, maxAge?, preflightContinue?, optionsSuccessStatus? }\n- function createTimeoutHandler(timeoutMs: number, handler: (request: Request) => Promise<Response>): (request: Request) => Promise<Response>;\n- function createZodDto<T extends ZodSchema>(schema: T): { new (data?: any): any; schema: T; };\n- class DefaultValuePipe<T = any> implements PipeTransform<T | undefined, T> { transform() }\n- const Delete: (path?: string) => MethodDecorator;\n- interface DynamicModule extends ModuleMetadata { module, global? }\n- function emitRequestTelemetry(telemetry: RequestTelemetry): void;\n- interface ExceptionFilter<T = any> { catch() }\n- interface ExecutionContext { getRequest(), getResponse(), getHandler(), getClass(), switchToHttp() }\n- class ExecutionPipeline { hasPipes(), execute(), transformWithPipes() }\n- interface ExistingProvider<T = any> { provide, useExisting }\n- interface FactoryProvider<T = any> { provide, useFactory, inject?, scope? }\n- ForbiddenException (re-exported)\n- function forwardRef<T>(fn: () => T): ForwardReference<T>;\n- interface ForwardReference<T = any> { forwardRef }\n- type GalaxyApplication\n- const GalaxyFactory: typeof OrbitFactory;\n- interface GalaxyInterceptor<T = any, R = any> { intercept() }\n- interface GalaxyMiddleware { use() }\n- GatewayTimeoutException (re-exported)\n- const Get: (path?: string) => MethodDecorator;\n- function getGracefulShutdownManager(options?: GracefulShutdownOptions): GracefulShutdownManager;\n- function getProviderToken<T>(provider: Provider<T>): InjectionToken<T>;\n- GoneException (re-exported)\n- function gracefulShutdown(options?: GracefulShutdownOptions): GracefulShutdownManager;\n- class GracefulShutdownManager { registerServer(), stop, registerShutdownCallback(), trackRequest(), completeRequest(), setupSignalHandlers(), initiateShutdow...\n- interface GracefulShutdownOptions { timeout?, signals?, onShutdown?, forceExitCode? }\n- function hasBeforeApplicationShutdown(instance: any): instance is BeforeApplicationShutdown;\n- function hasConfigureMethod(module: any): module is NestModule;\n- function hasOnApplicationBootstrap(instance: any): instance is OnApplicationBootstrap;\n- function hasOnApplicationShutdown(instance: any): instance is OnApplicationShutdown;\n- function hasOnModuleDestroy(instance: any): instance is OnModuleDestroy;\n- function hasOnModuleInit(instance: any): instance is OnModuleInit;\n- const Head: (path?: string) => MethodDecorator;\n- interface HttpArgumentsHost { getRequest(), getResponse() }\n- HttpException (re-exported)\n- type HttpMethod\n- function Inject(token: InjectionToken): ParameterDecorator;\n- function Injectable(options?: InjectableOptions): ClassDecorator;\n- interface InjectableOptions { scope? }\n- type InjectionToken\n- InternalServerErrorException (re-exported)\n- function isClassProvider<T>(provider: Provider<T>): provider is ClassProvider<T>;\n- function isExistingProvider<T>(provider: Provider<T>): provider is ExistingProvider<T>;\n- function isFactoryProvider<T>(provider: Provider<T>): provider is FactoryProvider<T>;\n- function isForwardReference<T>(ref: any): ref is ForwardReference<T>;\n- function isPrimaryProcess(): boolean;\n- function isValueProvider<T>(provider: Provider<T>): provider is ValueProvider<T>;\n- function isWorkerProcess(): boolean;\n- const METADATA_KEYS: { readonly INJECTABLE: \"orbit:injectable\"; readonly CONTROLLER: \"orbit:controller\"; readonly MODULE: \"orbit:module\"; readonly ROUTE_PATH...\n- type MetadataKey\n- MethodNotAllowedException (re-exported)\n- type Middleware\n- type MiddlewareClass\n- interface MiddlewareConfigProxy { forRoutes(), exclude() }\n- class MiddlewareConfigProxyImpl implements MiddlewareConfigProxy { exclude(), forRoutes() }\n- interface MiddlewareConfiguration { middlewares, forRoutes, excludeRoutes }\n- interface MiddlewareConsumer { apply() }\n- class MiddlewareConsumerImpl implements MiddlewareConsumer { apply(), addConfiguration(), getConfigurations() }\n- type MiddlewareFunction\n- class MiddlewareRegistry { registerGlobal(), registerForModule(), getMiddlewaresForRoute() }\n- function Module(metadata: ModuleMetadata): ClassDecorator;\n- class ModuleCompiler { compile(), getMiddlewareConfigurations() }\n- type ModuleImport\n- interface ModuleMetadata { imports?, controllers?, providers?, exports? }\n- class ModuleScanner { scan(), getGlobalProviders(), getAllModules() }\n- type NestInterceptor\n- interface NestModule { configure() }\n- NotAcceptableException (re-exported)\n- NotFoundException (re-exported)\n- function notifyReady(): void;\n- NotImplementedException (re-exported)\n- interface OnApplicationBootstrap { onApplicationBootstrap() }\n- interface OnApplicationShutdown { onApplicationShutdown() }\n- interface OnModuleDestroy { onModuleDestroy() }\n- interface OnModuleInit { onModuleInit() }\n- function onRequestTelemetry(listener: RequestTelemetryListener): () => void;\n- function onShutdown(callback: () => void | Promise<void>): void;\n- function Optional(): ParameterDecorator;\n- const Options: (path?: string) => MethodDecorator;\n- class OrbitApplication { port, setRoutes(), getRoutes(), modules, setModules(), setMiddlewareConfigurations(), use(), forRoutes?, exclude?, enableCors(), use...\n- interface OrbitApplicationOptions { port?, hostname?, logger?, cors?, security? }\n- class OrbitFactory { create() }\n- type OrbitMiddleware\n- interface ParamMetadata { type, data?, index }\n- class ParseArrayPipe implements PipeTransform<string, any[]> { transform() }\n- class ParseBoolPipe implements PipeTransform<string, boolean> { transform() }\n- class ParseEnumPipe<T extends Record<string, any>> implements PipeTransform<string, string | number> { transform() }\n- class ParseFloatPipe implements PipeTransform<string, number> { transform() }\n- class ParseIntPipe implements PipeTransform<string, number> { transform() }\n- class ParseUUIDPipe implements PipeTransform<string, string> { transform() }\n- const Patch: (path?: string) => MethodDecorator;\n- PayloadTooLargeException (re-exported)\n- interface PipeTransform<T = any, R = any> { transform() }\n- const Post: (path?: string) => MethodDecorator;\n- type Provider\n- const Put: (path?: string) => MethodDecorator;\n- class Reflector { getMetadata(), getOwnMetadata(), defineMetadata(), hasMetadata(), getConstructorParams(), isInjectable(), isController(), isModule(), getCo...\n- function registerAs<T extends Record<string, any>>(namespace: string, factory: () => T): (() => T) & { KEY: string; };\n- class RequestHandler { handle() }\n- interface RequestTelemetry { method, path, status, durationMs, error?, name, message, stack? }\n- class RequestTimeoutError extends Error { elapsed, path, method }\n- interface ResolvedMiddleware { fn, forRoutes, excludeRoutes }\n- interface RouteDefinition { path, method, controller, methodName, handler }\n- class RouteExplorer { explore(), getParamMetadata() }\n- interface RouteInfo { path, method? }\n- type RouteInfoOrController\n- enum Scope\n- function serveStatic(options?: Partial<StaticServeOptions>): StaticMiddleware;\n- ServiceUnavailableException (re-exported)\n- class StaticMiddleware implements OrbitMiddleware { clearCache(), use() }\n- interface StaticServeOptions { root, prefix?, index?, dotFiles?, maxAge?, immutable?, etag?, lastModified?, cacheMaxSize?, cacheTtl?, cacheDebug? }\n- function timeout(options?: TimeoutOptions): TimeoutMiddleware;\n- class TimeoutMiddleware implements OrbitMiddleware { use() }\n- interface TimeoutOptions { timeout?, message?, statusCode?, onTimeout? }\n- class TrimPipe implements PipeTransform<string, string> { transform() }\n- interface Type<T = any> extends Function { new() }\n- UnauthorizedException (re-exported)\n- UnprocessableEntityException (re-exported)\n- UnsupportedMediaTypeException (re-exported)\n- class ValidationPipe implements PipeTransform { transform() }\n- interface ValidationPipeOptions { transform?, whitelist?, forbidNonWhitelisted?, disableErrorMessages?, errorHttpStatusCode?, exceptionFactory?, schema? }\n- interface ValueProvider<T = any> { provide, useValue }\n- function Version(version: string | string[] | typeof VERSION_NEUTRAL): MethodDecorator & ClassDecorator;\n- const VERSION_METADATA = \"versioning:version\";\n- const VERSION_NEUTRAL: unique symbol;\n- const versioningManager: VersioningManager;\n- class VersioningManager { configure(), getOptions(), extractVersion(), matchVersion(), buildVersionedPath() }\n- interface VersioningOptions { type, defaultVersion?, header?, key?, prefix?, extractor? }\n- type VersioningType\n- function withCircuitBreaker<T>(name: string, action: () => Promise<T>, options?: CircuitBreakerOptions): () => Promise<T>;\n- interface WorkerInfo { id, worker, status, startedAt, respawnCount, lastError? }\n- interface ZodSchema { parse(), safeParse(), success, data?, error? }\n- class ZodValidationPipe implements PipeTransform { transform() }\n\n### orbit-common\n_@galaxy-stack/orbit-common@0.1.15 \u2014 79 exported symbols, copied from its dist/*.d.ts._\n\n- function applySecureHeaderRecord(response: Response, secure: Record<string, string>): Response;\n- function applyTransforms<T extends object>(instance: T): T;\n- interface ArgumentMetadata { type, metatype?, data? }\n- interface ArgumentsHost { getArgs(), getArgByIndex(), getType() }\n- class BadGatewayException extends HttpException\n- class BadRequestException extends HttpException\n- const Body: (data?: string) => ParameterDecorator;\n- function buildSecureHeaders(options?: SecureHeaderOptions): Record<string, string>;\n- interface CallHandler<T = any> { handle() }\n- interface CanActivate { canActivate() }\n- function Catch(...exceptions: Type<any>[]): ClassDecorator;\n- class ConflictException extends HttpException\n- function DefaultValue(defaultVal: any): PropertyDecorator;\n- interface ExceptionFilter<T = any> { catch() }\n- interface ExecutionContext { getRequest(), getResponse(), getHandler(), getClass(), switchToHttp() }\n- class ForbiddenException extends HttpException\n- class GatewayTimeoutException extends HttpException\n- function getCatchExceptions(target: Type): Type<any>[];\n- function getFilters(target: Object, propertyKey?: string | symbol): (Type<ExceptionFilter> | ExceptionFilter)[];\n- function getGuards(target: Object, propertyKey?: string | symbol): (GuardClass | CanActivate)[];\n- function getHeaders(target: Object, propertyKey: string | symbol): Record<string, string>;\n- function getHttpCode(target: Object, propertyKey: string | symbol): number | undefined;\n- function getInterceptors(target: Object, propertyKey?: string | symbol): (Type<OrbitInterceptor> | OrbitInterceptor)[];\n- function getParamMetadata(target: Object, propertyKey: string | symbol): ParamMetadata[];\n- function getPipes(target: Object, propertyKey?: string | symbol): (Type<PipeTransform> | PipeTransform)[];\n- function getRedirect(target: Object, propertyKey: string | symbol): { url: string; statusCode: number; } | undefined;\n- class GoneException extends HttpException\n- type GuardClass\n- const GUARDS_METADATA = \"orbit:guards\";\n- function Header(name: string, value: string): MethodDecorator;\n- const Headers: (data?: string) => ParameterDecorator;\n- interface HttpArgumentsHost { getRequest(), getResponse(), getNext() }\n- function HttpCode(statusCode: number): MethodDecorator;\n- class HttpException extends Error { getResponse(), getStatus(), toJSON() }\n- class InternalServerErrorException extends HttpException\n- const Ip: (data?: string) => ParameterDecorator;\n- class MethodNotAllowedException extends HttpException\n- class NotAcceptableException extends HttpException\n- class NotFoundException extends HttpException\n- class NotImplementedException extends HttpException\n- interface OrbitInterceptor<T = any, R = any> { intercept() }\n- const Param: (data?: string) => ParameterDecorator;\n- interface ParamMetadata { type, data?, index }\n- enum ParamType\n- class PayloadTooLargeException extends HttpException\n- interface PipeTransform<T = any, R = any> { transform() }\n- const Query: (data?: string) => ParameterDecorator;\n- function Redirect(url: string, statusCode?: number): MethodDecorator;\n- function Render(template: string): MethodDecorator;\n- const Req: (data?: string) => ParameterDecorator;\n- const Request: (data?: string) => ParameterDecorator;\n- const Res: (data?: string) => ParameterDecorator;\n- const Response: (data?: string) => ParameterDecorator;\n- interface SecureHeaderOptions { hsts?, maxAge?, includeSubDomains?, preload?, frameguard?, noSniff?, referrerPolicy?, crossOriginOpenerPolicy?, crossOriginRe...\n- class ServiceUnavailableException extends HttpException\n- const Session: (data?: string) => ParameterDecorator;\n- function ToArray(): PropertyDecorator;\n- function ToBoolean(): PropertyDecorator;\n- function ToDate(): PropertyDecorator;\n- function ToFloat(): PropertyDecorator;\n- function ToInt(): PropertyDecorator;\n- function ToLowerCase(): PropertyDecorator;\n- function ToUpperCase(): PropertyDecorator;\n- function Transform(transformFn: TransformFn, options?: TransformOptions): PropertyDecorator;\n- const TRANSFORM_METADATA: unique symbol;\n- interface TransformFn\n- interface TransformOptions { toClassOnly?, toPlainOnly?, groups? }\n- function Trim(): PropertyDecorator;\n- interface Type<T = any> extends Function { new() }\n- class UnauthorizedException extends HttpException\n- class UnprocessableEntityException extends HttpException\n- class UnsupportedMediaTypeException extends HttpException\n- const UploadedFile: (data?: string) => ParameterDecorator;\n- const UploadedFiles: (data?: string) => ParameterDecorator;\n- function UseFilters(...filters: (Type<ExceptionFilter> | ExceptionFilter)[]): MethodDecorator & ClassDecorator;\n- function UseGuards(...guards: (GuardClass | CanActivate)[]): MethodDecorator & ClassDecorator;\n- function UseInterceptors(...interceptors: (Type<OrbitInterceptor> | OrbitInterceptor)[]): MethodDecorator & ClassDecorator;\n- function UsePipes(...pipes: (Type<PipeTransform> | PipeTransform)[]): MethodDecorator & ClassDecorator;\n- function withSecureHeaders(response: Response, options?: SecureHeaderOptions): Response;\n\n### orbit-database\n_@galaxy-stack/orbit-database@0.1.10 \u2014 29 exported symbols, copied from its dist/*.d.ts._\n\n- abstract class BaseRepository<T> implements Repository<T> { findAll(), findOne(), findBy(), create(), update(), delete(), count() }\n- class BunDataSource implements DataSource { initialize(), destroy(), registerTable(), getRepository(), transaction(), query(), getDrizzle(), getClient() }\n- function Column(options?: ColumnOptions): PropertyDecorator;\n- const COLUMN_METADATA = \"database:columns\";\n- interface ColumnMetadata { name, type, nullable?, primary?, unique?, default? }\n- interface ColumnOptions { name?, type?, nullable?, unique?, default?, primary? }\n- function createDataSource(options: DatabaseModuleOptions): BunDataSource;\n- const DATA_SOURCE: unique symbol;\n- const DATABASE_OPTIONS: unique symbol;\n- interface DatabaseFeatureOptions { entities, tables }\n- class DatabaseModule { forRoot(), isGlobal?, forRootAsync(), forFeature() }\n- interface DatabaseModuleAsyncOptions { imports?, useFactory, inject?, isGlobal? }\n- interface DatabaseModuleOptions { type, url?, host?, port?, database?, username?, password?, ssl?, pool?, logging? }\n- interface DataSource { isInitialized, initialize(), destroy(), getRepository(), transaction(), query() }\n- class DrizzleRepository<T> extends BaseRepository<T> { findAll(), findOne(), findBy(), create(), update(), delete(), count(), getQueryBuilder(), getRawDb(), ...\n- function Entity(options?: EntityOptions | string): ClassDecorator;\n- const ENTITY_METADATA = \"database:entity\";\n- interface EntityMetadata { name, tableName, columns, primaryKey? }\n- interface EntityOptions { name? }\n- function InjectRepository(entity: any): ParameterDecorator;\n- interface PoolOptions { min?, max?, idleTimeoutMs?, acquireTimeoutMs? }\n- const PRIMARY_KEY_METADATA = \"database:primaryKey\";\n- function PrimaryGeneratedColumn(type?: 'increment' | 'uuid'): PropertyDecorator;\n- function PrimaryKey(): PropertyDecorator;\n- interface Repository<T> { findAll(), findOne(), findBy(), create(), update(), delete(), count() }\n- const REPOSITORY_METADATA = \"database:repository\";\n- function Transactional(options?: TransactionOptions): MethodDecorator;\n- const TRANSACTIONAL_METADATA = \"database:transactional\";\n- interface TransactionOptions { isolationLevel?, readOnly? }\n\n### orbit-security\n_@galaxy-stack/orbit-security@0.1.10 \u2014 41 exported symbols, copied from its dist/*.d.ts._\n\n- class ApiKeyManager { generate(), key, metadata, validate(), rotate(), revoke(), list(), get(), onRotation(), createMiddleware() }\n- interface ApiKeyMetadata { id, name, prefix, hash, createdAt, expiresAt?, lastUsedAt?, scopes?, metadata? }\n- interface ApiKeyOptions { prefix?, length?, charset?, expiresIn?, hashAlgorithm? }\n- class ApiKeyRotationScheduler { schedule(), cancel(), cancelAll() }\n- interface ApiKeyValidation { valid, key?, error? }\n- interface ContentSecurityPolicyOptions { directives?, reportOnly? }\n- function createApiKeyManager(options?: ApiKeyOptions): ApiKeyManager;\n- const CRYPTO_UTILS: unique symbol;\n- class CryptoUtils { randomBytes(), randomUUID(), hash(), hmac(), verifyHmac(), timingSafeEqual(), encrypt(), ciphertext, iv, tag?, decrypt(), generateSecret(...\n- const CSRF_MIDDLEWARE: unique symbol;\n- interface CsrfCookieOptions { name?, path?, httpOnly?, secure?, sameSite?, maxAge? }\n- class CsrfException extends Error\n- class CsrfMiddleware { use(), generateToken() }\n- interface CsrfOptions { cookie?, ignoreMethods?, getToken?, sessionKey? }\n- function detectSqlInjection(str: string): boolean;\n- function detectXss(str: string): boolean;\n- function escapeHtml(str: string): string;\n- type HashAlgorithm\n- const HELMET_MIDDLEWARE: unique symbol;\n- class HelmetMiddleware { use(), getHeaders() }\n- interface HelmetOptions { contentSecurityPolicy?, crossOriginEmbedderPolicy?, policy, crossOriginOpenerPolicy?, crossOriginResourcePolicy?, dnsPrefetchContro...\n- interface HstsOptions { maxAge?, includeSubDomains?, preload? }\n- function rateLimit(options?: RateLimitOptions): SlidingWindowRateLimiter;\n- interface RateLimitInfo { limit, current, remaining, resetTime }\n- interface RateLimitOptions { windowMs?, maxRequests?, keyGenerator?, skipFailedRequests?, skipSuccessfulRequests?, message?, statusCode?, headers?, onLimitRe...\n- type ReferrerPolicy\n- class SanitizationPipe { transform() }\n- function sanitizeHtml(str: string, options?: SanitizerOptions): string;\n- function sanitizeObject<T extends Record<string, unknown>>(obj: T, options?: SanitizerOptions): T;\n- interface SanitizerOptions { stripHtml?, escapeHtml?, trimWhitespace?, normalizeWhitespace?, maxLength?, allowedTags?, allowedAttributes? }\n- function sanitizeString(str: string, options?: SanitizerOptions): string;\n- const SECURITY_MODULE_OPTIONS: unique symbol;\n- class SecurityModule { forRoot(), forRootAsync(), imports?, useFactory, inject?, isGlobal? }\n- interface SecurityModuleOptions { helmet?, csrf?, isGlobal? }\n- class SlidingWindowRateLimiter { getInfo(), increment(), reset(), destroy(), createMiddleware() }\n- class SqlInjectionPipe { transform() }\n- function stripHtml(str: string): string;\n- function tokenBucket(options?: RateLimitOptions): TokenBucketRateLimiter;\n- class TokenBucketRateLimiter { consume(), getInfo(), createMiddleware() }\n- function unescapeHtml(str: string): string;\n- class XssPipe { transform() }\n\n### orbit-throttler\n_@galaxy-stack/orbit-throttler@0.1.10 \u2014 21 exported symbols, copied from its dist/*.d.ts._\n\n- function SkipThrottle(skip?: boolean): MethodDecorator & ClassDecorator;\n- function Throttle(limit: number, ttl: number): MethodDecorator & ClassDecorator;\n- const THROTTLE_METADATA = \"throttle:options\";\n- const THROTTLE_SKIP_METADATA = \"throttle:skip\";\n- interface ThrottleOptions { limit?, ttl? }\n- const THROTTLER_GUARD: unique symbol;\n- const THROTTLER_OPTIONS: unique symbol;\n- const THROTTLER_STORAGE: unique symbol;\n- interface ThrottlerAsyncOptions { imports?, useFactory, inject? }\n- interface ThrottlerContext { getRequest(), getResponse(), getHandler(), getClass() }\n- class ThrottlerException extends Error { retryAfter }\n- class ThrottlerGuard { canActivate(), reset(), getStorage() }\n- class ThrottlerMemoryStorage implements ThrottlerStorage { increment(), get(), reset(), destroy() }\n- class ThrottlerModule { forRoot(), forRootAsync() }\n- interface ThrottlerModuleOptions extends ThrottlerOptions { storage?, errorMessage? }\n- interface ThrottlerOptions { ttl, limit, ignoreUserAgents?, skipIf?, getTracker? }\n- interface ThrottlerRedisOptions { host?, port?, password?, db?, keyPrefix? }\n- class ThrottlerRedisStorage implements ThrottlerStorage { connect(), increment(), get(), reset(), disconnect() }\n- interface ThrottlerRequest { ip?, headers?, url?, method? }\n- interface ThrottlerStorage { increment(), get(), reset() }\n- interface ThrottlerStorageRecord { totalHits, expiresAt, isBlocked, timeToExpire }\n\n### orbit-graphql\n_@galaxy-stack/orbit-graphql@0.1.15 \u2014 80 exported symbols, copied from its dist/*.d.ts._\n\n- function aliasLimit(maxAliases: number): (context: ValidationContext) => ASTVisitor;\n- function Args(): ParameterDecorator;\n- const ARGS_METADATA = \"graphql:args\";\n- const ARGS_TYPE_METADATA = \"graphql:argsType\";\n- interface ArgsOptions { name?, type?, nullable?, defaultValue?, description? }\n- function ArgsType(options?: TypeOptions): ClassDecorator;\n- function blockIntrospection(): (context: ValidationContext) => ASTVisitor;\n- function complexityLimit(options: ComplexityOptions): (context: ValidationContext) => ASTVisitor;\n- interface ComplexityOptions { maxComplexity, defaultFieldCost?, defaultListFactor?, fieldCosts?, listFactors? }\n- const Context: (options?: ArgsOptions | string) => ParameterDecorator;\n- const CONTEXT_METADATA = \"graphql:context\";\n- function createDataLoader<K, V>(batchFn: (keys: K[]) => Promise<(V | Error)[]>, options?: Omit<DataLoaderOptions<K, V>, 'batchFn'>): DataLoader<K, V>;\n- function createDataLoaderContext(): DataLoaderContext;\n- function createSubscriptionServer(options: WebSocketServerOptions): GraphQLWebSocketServer;\n- class DataLoader<K, V> { load(), loadMany(), clear(), clearAll(), prime() }\n- const DATALOADER_METADATA = \"graphql:dataloader\";\n- interface DataLoaderConfig\n- class DataLoaderContext { registerLoader(), getLoader(), clearAll() }\n- interface DataLoaderFactory<K = any, V = any>\n- interface DataLoaderOptions<K, V> { batchFn, cacheKeyFn?, cache?, maxBatchSize?, batchScheduleFn? }\n- const DEFAULT_GRAPHQL_SECURITY: Required<Omit<GraphQLSecurityOptions, 'fieldCosts' | 'listFactors' | 'disableIntrospection'>>;\n- function depthLimit(maxDepth: number): (context: ValidationContext) => ASTVisitor;\n- const ENUM_METADATA = \"graphql:enum\";\n- function Field(): PropertyDecorator;\n- const FIELD_METADATA = \"graphql:field\";\n- interface FieldMetadata extends FieldOptions { propertyKey, typeFn?, isArray? }\n- interface FieldOptions { name?, description?, nullable?, defaultValue?, deprecationReason?, complexity? }\n- const Float: unique symbol;\n- function getParamsMetadata(target: any, methodName: string): ParamMetadata[];\n- const GRAPHQL_SCHEMA: unique symbol;\n- class GraphQLHandler { getSchema(), handle() }\n- class GraphQLModule { forRoot(), forRootAsync() }\n- interface GraphQLModuleAsyncOptions { imports?, useFactory, inject? }\n- interface GraphQLModuleOptions { autoSchemaFile?, secureHeaders?, security?, sortSchema?, playground?, introspection?, path?, context?, request, formatError?...\n- interface GraphQLSecurityOptions { maxDepth?, maxComplexity?, fieldCosts?, listFactors?, maxAliases?, disableIntrospection? }\n- class GraphQLWebSocketServer { handleConnection() }\n- const ID: unique symbol;\n- const Info: (options?: ArgsOptions | string) => ParameterDecorator;\n- const INFO_METADATA = \"graphql:info\";\n- const INPUT_TYPE_METADATA = \"graphql:inputType\";\n- function InputType(options?: TypeOptions): ClassDecorator;\n- const Int: unique symbol;\n- const INTERFACE_TYPE_METADATA = \"graphql:interfaceType\";\n- function InterfaceType(options?: TypeOptions): ClassDecorator;\n- function Loader(loaderName: string): ParameterDecorator;\n- function Mutation(): MethodDecorator;\n- const MUTATION_METADATA = \"graphql:mutation\";\n- interface MutationOptions extends QueryOptions\n- const OBJECT_TYPE_METADATA = \"graphql:objectType\";\n- function ObjectType(options?: TypeOptions): ClassDecorator;\n- interface ParamMetadata { index, type, options? }\n- const Parent: (options?: ArgsOptions | string) => ParameterDecorator;\n- const PARENT_METADATA = \"graphql:parent\";\n- class PubSub implements PubSubEngine { publish(), subscribe(), unsubscribe(), asyncIterator() }\n- interface PubSubEngine { publish(), subscribe(), unsubscribe(), asyncIterator() }\n- function Query(): MethodDecorator;\n- const QUERY_METADATA = \"graphql:query\";\n- interface QueryOptions { name?, description?, nullable?, deprecationReason?, complexity? }\n- function registerEnumType<T extends object>(enumType: T, options: { name: string; description?: string; valuesMap?: Record<keyof T, { description?: string; d...\n- const RESOLVE_FIELD_METADATA = \"graphql:resolveField\";\n- function ResolveField(): MethodDecorator;\n- interface ResolveFieldOptions { name?, description?, nullable?, complexity? }\n- function Resolver(): ClassDecorator;\n- const RESOLVER_METADATA = \"graphql:resolver\";\n- const RESOLVER_NAME_METADATA = \"graphql:resolverName\";\n- interface ResolverMethodMetadata { methodName, typeFn?, options }\n- interface ResolverOptions { isAbstract? }\n- const Root: (options?: ArgsOptions | string) => ParameterDecorator;\n- const ROOT_METADATA = \"graphql:root\";\n- class SchemaBuilder { addResolver(), build(), schemaGraph() }\n- interface SchemaGraph { nodes, edges }\n- interface SchemaGraphEdge { from, to, via }\n- interface SchemaGraphNode { name, kind, fields, type }\n- function Subscription(): MethodDecorator;\n- const SUBSCRIPTION_METADATA = \"graphql:subscription\";\n- type SubscriptionHandler\n- interface SubscriptionOptions extends QueryOptions { filter?, resolve? }\n- interface TypeOptions { name?, description?, isAbstract? }\n- interface WebSocketServerOptions { schema, context?, request, socket, onConnect?, onDisconnect?, keepAlive? }\n- function withFilter<T, TContext = any>(asyncIteratorFn: (rootValue: any, args: any, context: TContext, info: any) => AsyncIterator<T>, filterFn: (payload: T,...\n\n### orbit-validation\n_@galaxy-stack/orbit-validation@0.1.11 \u2014 19 exported symbols, copied from its dist/*.d.ts._\n\n- function applyTransforms<T extends object>(instance: T): T;\n- function createZodDto<T extends ZodSchema>(schema: T): { new (data?: any): any; schema: T; };\n- function DefaultValue(defaultVal: any): PropertyDecorator;\n- function ToArray(): PropertyDecorator;\n- function ToBoolean(): PropertyDecorator;\n- function ToDate(): PropertyDecorator;\n- function ToFloat(): PropertyDecorator;\n- function ToInt(): PropertyDecorator;\n- function ToLowerCase(): PropertyDecorator;\n- function ToUpperCase(): PropertyDecorator;\n- function Transform(transformFn: TransformFn, options?: TransformOptions): PropertyDecorator;\n- const TRANSFORM_METADATA: unique symbol;\n- interface TransformFn\n- interface TransformOptions { toClassOnly?, toPlainOnly?, groups? }\n- function Trim(): PropertyDecorator;\n- class ValidationPipe implements PipeTransform { transform() }\n- interface ValidationPipeOptions { transform?, whitelist?, forbidNonWhitelisted?, disableErrorMessages?, errorHttpStatusCode?, exceptionFactory?, schema? }\n- interface ZodSchema { parse(), safeParse(), success, data?, error? }\n- class ZodValidationPipe implements PipeTransform { transform() }\n\n### orbit-microservices\n_@galaxy-stack/orbit-microservices@0.1.10 \u2014 36 exported symbols, copied from its dist/*.d.ts._\n\n- function Client(options?: ClientOptions): PropertyDecorator;\n- const CLIENT_METADATA: unique symbol;\n- interface ClientAsyncRegistration { name, useFactory, transport?, options?, inject? }\n- interface ClientOptions { transport?, options?, host?, port? }\n- abstract class ClientProxy { connect(), close(), send(), emit() }\n- interface ClientRegistration { name, transport?, options?, host?, port? }\n- class ClientsModule { register(), registerAsync() }\n- interface Closeable { close() }\n- function Ctx(): ParameterDecorator;\n- interface CustomTransportStrategy extends Closeable { listen() }\n- function EventPattern<T = string>(pattern: T): MethodDecorator;\n- function getTransport(transport: Transport): { server: any; client: any; } | undefined;\n- function GrpcMethod(service?: string, method?: string): MethodDecorator;\n- function GrpcStreamMethod(service?: string, method?: string): MethodDecorator;\n- interface IncomingMessage<T = any> { pattern, data, id? }\n- interface MessageContext { getPattern(), getData(), getArgs() }\n- interface MessageHandler<TData = any, TResult = any>\n- function MessagePattern<T = string>(pattern: T): MethodDecorator;\n- class MicroserviceFactory { create() }\n- interface MicroserviceOptions { transport?, options? }\n- interface OutgoingMessage<T = any> { response, id?, err?, isDisposed? }\n- interface PacketId { id }\n- const PATTERN_HANDLER_METADATA: unique symbol;\n- const PATTERN_METADATA: unique symbol;\n- interface PatternMetadata { pattern, isEventHandler?, transport? }\n- function Payload(property?: string): ParameterDecorator;\n- interface PayloadOptions { type? }\n- interface ReadPacket<T = any> { pattern, data }\n- interface RedisOptions extends TransportOptions { host?, port?, password?, db? }\n- function registerTransport(transport: Transport, serverClass: new (options?: any) => Server, clientClass: new (options?: any) => ClientProxy): void;\n- abstract class Server implements CustomTransportStrategy { listen(), close(), addHandler(), getHandlers(), getHandlerByPattern() }\n- interface TcpOptions extends TransportOptions { host?, port? }\n- enum Transport\n- const TRANSPORT_METADATA: unique symbol;\n- interface TransportOptions { host?, port?, retryAttempts?, retryDelay? }\n- interface WritePacket<T = any> { err?, response?, isDisposed? }\n\n### orbit-swagger\n_@galaxy-stack/orbit-swagger@0.1.11 \u2014 58 exported symbols, copied from its dist/*.d.ts._\n\n- const API_BEARER_AUTH_METADATA = \"swagger:bearerAuth\";\n- const API_BODY_METADATA = \"swagger:body\";\n- const API_EXCLUDE_METADATA = \"swagger:exclude\";\n- const API_OPERATION_METADATA = \"swagger:operation\";\n- const API_PARAM_METADATA = \"swagger:param\";\n- const API_PROPERTY_METADATA = \"swagger:property\";\n- const API_RESPONSE_METADATA = \"swagger:response\";\n- const API_SECURITY_METADATA = \"swagger:security\";\n- const API_TAGS_METADATA = \"swagger:tags\";\n- function ApiBadRequestResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiBearerAuth(name?: string): ClassDecorator & MethodDecorator;\n- function ApiBody(options: ApiBodyOptions): MethodDecorator;\n- interface ApiBodyOptions { description?, required?, type?, isArray?, schema? }\n- function ApiCreatedResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiExcludeController(): ClassDecorator;\n- function ApiExcludeEndpoint(): MethodDecorator;\n- function ApiForbiddenResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiInternalServerErrorResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiNotFoundResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiOkResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- function ApiOperation(options: ApiOperationOptions): MethodDecorator;\n- interface ApiOperationOptions { summary?, description?, operationId?, deprecated? }\n- function ApiParam(options: ApiParamOptions): MethodDecorator;\n- interface ApiParamOptions { name, description?, required?, type?, enum?, example?, in? }\n- function ApiProperty(options?: ApiPropertyOptions): PropertyDecorator;\n- function ApiPropertyOptional(options?: Omit<ApiPropertyOptions, 'required'>): PropertyDecorator;\n- interface ApiPropertyOptions { description?, required?, type?, isArray?, enum?, default?, example?, minimum?, maximum?, minLength?, maxLength?, pattern?, nul...\n- function ApiQuery(options: ApiQueryOptions): MethodDecorator;\n- interface ApiQueryOptions extends Omit<ApiParamOptions, 'in'>\n- function ApiResponse(options: ApiResponseOptions): MethodDecorator;\n- interface ApiResponseOptions { status, description?, type?, isArray?, schema? }\n- function ApiSecurity(name: string, scopes?: string[]): ClassDecorator & MethodDecorator;\n- function ApiTags(...tags: string[]): ClassDecorator & MethodDecorator;\n- function ApiUnauthorizedResponse(options?: Omit<ApiResponseOptions, 'status'>): MethodDecorator;\n- class DocumentBuilder { setTitle(), setDescription(), setVersion(), setTermsOfService(), setContact(), setLicense(), addServer(), setExternalDoc(), addTag(),...\n- interface OpenAPIComponents { schemas?, responses?, parameters?, requestBodies?, headers?, securitySchemes? }\n- interface OpenAPIDocument { openapi, info, servers?, paths, components?, security?, tags?, externalDocs? }\n- interface OpenAPIExample { summary?, description?, value?, externalValue? }\n- interface OpenAPIExternalDocs { description?, url }\n- interface OpenAPIHeader { description?, required?, schema? }\n- interface OpenAPIInfo { title, description?, termsOfService?, contact?, name?, url?, email?, license?, name, version }\n- interface OpenAPIMediaType { schema?, example?, examples? }\n- interface OpenAPIOAuthFlow { authorizationUrl?, tokenUrl?, refreshUrl?, scopes }\n- interface OpenAPIOAuthFlows { implicit?, password?, clientCredentials?, authorizationCode? }\n- interface OpenAPIOperation { operationId?, summary?, description?, tags?, parameters?, requestBody?, responses, security?, deprecated? }\n- interface OpenAPIParameter { name, in, description?, required?, deprecated?, schema?, example? }\n- interface OpenAPIPathItem { summary?, description?, get?, post?, put?, patch?, delete?, options?, head?, trace?, parameters? }\n- interface OpenAPIRequestBody { description?, required?, content }\n- interface OpenAPIResponse { description, headers?, content? }\n- interface OpenAPISchema { type?, format?, title?, description?, default?, nullable?, enum?, items?, properties?, required?, additionalProperties?, allOf?, on...\n- interface OpenAPISecurityRequirement\n- interface OpenAPISecurityScheme { type, description?, name?, in?, scheme?, bearerFormat?, flows?, openIdConnectUrl? }\n- interface OpenAPIServer { url, description?, variables?, default, enum? }\n- interface OpenAPITag { name, description?, externalDocs? }\n- interface SwaggerDocumentOptions { include?, exclude?, extraModels?, ignoreGlobalPrefix?, deepScanRoutes?, operationIdFactory? }\n- class SwaggerExplorer { exploreControllers() }\n- class SwaggerModule { createDocument(), setup(), getDocument() }\n- interface SwaggerModuleOptions { path?, useGlobalPrefix?, jsonDocumentUrl?, yamlDocumentUrl?, swaggerUiEnabled? }\n\n### Compiled against\n_Generated from: orbit-core@0.2.3, orbit-common@0.1.15, orbit-database@0.1.10, orbit-security@0.1.10, orbit-throttler@0.1.10, orbit-graphql@0.1.15, orbit-validation@0.1.11, orbit-microservices@0.1.10, orbit-swagger@0.1.11._\n\nIf a project installs a different version, the declarations of *that* install win for the delta. Call `orbit_environment` to see the difference in one call, then report a genuinely missing symbol as a knowledge gap instead of silently re-deriving the whole surface.";

// src/knowledge.ts
var KNOWLEDGE = [
  {
    id: "module-pattern",
    title: "Module pattern",
    summary: "Organize features into@Module classes with imports/providers/controllers/exports.",
    content: `Every Orbit feature lives in a class decorated with @Module(). The module wires up its own controllers, providers, and child modules:

\`\`\`ts
import { Module } from '@galaxy-stack/orbit-core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [DatabaseModule.forRoot({ filename: 'app.db' })],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
\`\`\`

Rules:
- providers list everything the module instantiates (services, repositories).
- exports must list providers that other modules may inject.
- imports list other modules (or dynamic modules such as CacheModule.forRoot(...)).
- The root AppModule imports every feature module and nothing else.`
  },
  {
    id: "controller-pattern",
    title: "Controller and route decorators",
    summary: "@Controller for path prefix; @Get/@Post/@Put/@Patch/@Delete for routes; @Body/@Param/@Query for inputs.",
    content: `Controllers declare REST routes. Method argument decorators extract request data:

\`\`\`ts
import { Controller, Get, Post } from '@galaxy-stack/orbit-core';
import { Body, Param, Query, HttpCode } from '@galaxy-stack/orbit-common';

@Controller('users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get()
  list(@Query('page') page = '1') {
    return this.users.list(Number(page));
  }

  @Get(':id')
  find(@Param('id') id: string) {
    return this.users.find(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() body: CreateUserDto) {
    return this.users.create(body);
  }
}
\`\`\`

Return values are serialized to JSON automatically. Throwing HttpException subclasses sets the status code.`
  },
  {
    id: "di-pattern",
    title: "Dependency injection",
    summary: "@Injectable classes are resolved by constructor; three scopes: singleton (default), request, transient.",
    content: `Mark providers with @Injectable() and inject them through constructor parameters:

\`\`\`ts
@Injectable({ scope: Scope.REQUEST }) // optional scoping
export class UserService {
  constructor(private readonly db: DatabaseService) {}
}
\`\`\`

Scope semantics:
- singleton (default): one instance per application.
- request: one instance per HTTP request.
- transient: a new instance per injection site.

Register providers on a module; import that module elsewhere to gain access to its exported providers.`
  },
  {
    id: "graphql-pattern",
    title: "GraphQL resolvers and security",
    summary: "@Resolver/@Query/@Mutation build the schema; GraphQLModule.forRoot({ security }) enables depth/complexity/alias/introspection guards.",
    content: `Define resolvers with class decorators; Orbit generates the executable schema:

\`\`\`ts
import { Resolver, Query, Mutation, Args } from '@galaxy-stack/orbit-graphql';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() { return this.userService.list(); }

  @Mutation(() => User)
  createUser(@Args('input') input: CreateUserInput) {
    return this.userService.create(input);
  }
}
\`\`\`

Production hardening (built into GraphQLModule):

\`\`\`ts
GraphQLModule.forRoot({
  introspection: process.env.NODE_ENV !== 'production',
  security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 },
})
\`\`\`

Rules run during validation before any resolver executes: depthLimit, complexityLimit (list fan-out multiplier), aliasLimit, blockIntrospection.`
  },
  {
    id: "validation-pattern",
    title: "Validation with Zod",
    summary: "Bind a Zod schema with ZodValidationPipe (or ValidationPipe); @Body has no pipe argument.",
    content: `Validate request payloads with Zod. The CLI installs zod@4; the framework pipes accept both the Zod v4 \`issues\` and the legacy v3 \`errors\` error shape.

Import sources: decorators \`Controller/Get/Post/Module\` and the pipe classes \`ValidationPipe/ZodValidationPipe\` come from \`@galaxy-stack/orbit-core\`; parameter and method decorators \`Body/Param/Query/HttpCode/UsePipes/UseGuards\` come from \`@galaxy-stack/orbit-common\`. Importing \`Body\` from orbit-core throws "Export named 'Body' not found".

Simple handler \u2014 bind the schema to the pipe at method level:

\`\`\`ts
import { Controller, Post, ZodValidationPipe } from '@galaxy-stack/orbit-core';
import { Body, UsePipes } from '@galaxy-stack/orbit-common';
import { z } from 'zod';

const CreateMemberSchema = z.object({ name: z.string().min(2), email: z.string().email() });

@Controller('members')
export class MembersController {
  @Post()
  @UsePipes(new ZodValidationPipe(CreateMemberSchema))
  create(@Body() dto: z.infer<typeof CreateMemberSchema>) { return this.members.create(dto); }
}
\`\`\`

Rules:
- Do NOT write \`@Body(new ZodValidationPipe(...))\`: \`@Body\` accepts only a field name (\`@Body('name')\`).
- \`@UsePipes\` is method/class level and runs for EVERY argument of the method. When a handler mixes a validated body with \`@Param\`/\`@Query\` strings, write one scoped pipe that checks \`metadata.type === 'body'\` and returns other argument kinds untouched.
- **\`@HttpCode(n)\` masks failure statuses in \`@galaxy-stack/orbit-core\` <= 0.2.3.** The shipped build does
  \`status: httpCode || response.status\`, so a handler decorated \`@HttpCode(201)\` answers **201** even when a pipe
  rejected the body or \`ThrottlerGuard\` rejected the request \u2014 the body still carries \`400\`/\`429\` while the
  status says success. Measured on 0.2.3: \`POST\` with a rejecting pipe and no \`@HttpCode\` -> **400**; the same
  handler with \`@HttpCode(201)\` -> **201**; throttling on \`@Get()\` without \`@HttpCode\` -> \`200,200,429,429\`;
  with \`@HttpCode\` -> all 201. The fix (\`response.status >= 400 ? response.status : httpCode\`) is already in
  \`orbit-core/src/router/route-explorer.ts\` but is **not in the published 0.2.3 dist**. Workaround until it ships:
  keep \`@HttpCode\` off any handler that can fail and return an explicit \`Response\` with the success status.
  Do not conclude that \`ZodValidationPipe\` or \`ValidationPipe\` is broken \u2014 it is not. The earlier
  "unreliable on Bun" note here was a misdiagnosis of exactly this symptom.
- Invalid input returns 400 through \`BadRequestException\`.`
  },
  {
    id: "security-checklist",
    title: "Security checklist",
    summary: "Helmet headers, CSRF, rate limiting, validation, GraphQL query limits, JWT auth.",
    content: `Minimum hardening for an Orbit backend:

1. SecurityModule.forRoot({ helmet: {}, csrf: { ignoreMethods: ['GET', 'HEAD'] } }) \u2014 sets OWASP-recommended headers (HSTS, nosniff, frameguard, COOP/CORP) and double-submit CSRF. Both options are objects-or-false, never \`true\`: \`helmet?: HelmetOptions | false\`, \`csrf?: CsrfOptions | false\`. Writing \`{ helmet: true, csrf: true }\` is a type error.
2. ThrottlerModule \u2014 per-route or global rate limiting.
3. ValidationPipe with Zod schemas on every @Body input.
4. GraphQLModule: introspection off in production + security limits (depth/complexity/aliases).
5. AuthModule JWT guards on protected controllers: @UseGuards(JwtAuthGuard).
6. Never log secrets; Logger redacts by default.
7. Sanitize any stored HTML (Sanitizer from orbit-security strips script/style).`
  },
  {
    id: "database-pattern",
    title: "Database and repository",
    summary: "DatabaseModule (Drizzle + bun:sqlite) with Repository pattern and transactions.",
    content: `Register the database once, then use repositories per feature:

\`\`\`ts
DatabaseModule.forRoot({ filename: 'app.db' })

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(db: DatabaseService) { super(db, usersTable); }
}
\`\`\`

- bun:sqlite driver by default \u2014 no external database needed for local development.
- Transactions: await this.db.transaction(async tx => { ... }).
- Migrations live in drizzle/ directory; run via CLI.`
  },
  {
    id: "testing-pattern",
    title: "Testing",
    summary: "OrbitFactory.create(AppModule, { port: 0 }) boots a real HTTP server; bun:test for unit, e2e via fetch on app.port.",
    content: `Unit-test providers directly; integration-test through a REAL HTTP server. There is no separate test factory and OrbitApplication has no handle() \u2014 OrbitFactory boots Bun.serve and you fetch it on the ephemeral port:

\`\`\`ts
import { describe, test, expect } from 'bun:test';
import { OrbitFactory } from '@galaxy-stack/orbit-core';

const app = await OrbitFactory.create(AppModule, { port: 0 });
await app.listen(0);
const base = \`http://127.0.0.1:\${app.port}\`;

const res = await fetch(\`\${base}/api/users\`);
expect(res.status).toBe(200);
\`\`\``
  },
  {
    id: "package-map",
    title: "Package map",
    summary: "All @galaxy-stack/orbit-* packages and what they provide. For the export surface of orbit-core/common/database/security/throttler see the api-surface topic.",
    content: `Export surface: see the **api-surface** topic \u2014 it lists what each package exports and the key signatures, so the declarations in node_modules do not have to be read for that.

Core: orbit-core (DI, modules, controllers, pipeline), orbit-common (shared utils), orbit-platform-bun (Bun.serve adapter), orbit-config (@galaxy-stack/orbit-config env/config loader), orbit-validation (Zod pipe).

Data: orbit-database (Drizzle + bun:sqlite), orbit-cache (in-memory/Redis cache manager).

API: orbit-graphql (schema builder + security rules), orbit-graphql-federation (Apollo Federation gateway + subgraphs), orbit-swagger (OpenAPI UI), orbit-websockets (gateway + pubsub).

Microservices: orbit-microservices core plus transports orbit-microservices-{tcp,redis,nats,rmq,kafka,grpc}.

Quality: orbit-auth (JWT), orbit-security (helmet/CSRF/API-key/sanitizer), orbit-throttler, orbit-terminus (health), orbit-schedule (cron), orbit-logger, orbit-telemetry (OTel), orbit-observability (metrics/tracing).

Tooling: orbit-cli (scaffold), orbit-testing, orbit-devtools (dashboard), orbit-mcp (AI guidance server), orbit-docs, vscode-snippets.`
  },
  {
    id: "microservices-pattern",
    title: "Microservices transports",
    summary: "ClientProxy for RPC/events across 6 transports; server decorators expose handlers.",
    content: `Server side:

\`\`\`ts
@MessageHandler('user.created')
handleUserCreated(payload: any) { ... }

@EventHandler('audit.*')
handleAudit(pattern: string, payload: any) { ... }
\`\`\`

Client side:

\`\`\`ts
constructor(@Inject('USER_CLIENT') private client: ClientProxy) {}
send = this.client.send('user.get', { id: 1 });  // RPC (observable)
emit = this.client.emit('user.created', data);   // fire-and-forget
\`\`\`

Transports: TCP (zero deps), Redis, NATS, RabbitMQ, Kafka, gRPC \u2014 each in its own @galaxy-stack/orbit-microservices-* package.`
  },
  {
    id: "api-surface",
    title: "API surface of every orbit package (generated)",
    summary: "Generated inventory of every export in @galaxy-stack/orbit-*: signatures, interface members and class methods, one section per package, with the versions it was copied from.",
    content: API_SURFACE_CONTENT
  },
  {
    id: "recipes",
    title: "Wiring recipes - verified against a real install",
    summary: "How the pieces fit together: application surface, middleware/CORS/static, security and throttling wiring, database install and migrations, request pipeline contracts.",
    content: `These recipes were verified end to end against a real install. The generated export inventory lives in the api-surface topic; when a signature here disagrees with your installed declarations, orbit_environment tells you in one call whether your version differs.

### Application API and global registration

- \`OrbitApplication\` (from \`OrbitFactory.create\`) exposes exactly: \`use(middleware, { forRoutes?, exclude? })\`, \`enableCors(CorsOptions?)\`, \`useStaticAssets(Partial<StaticServeOptions>)\`, \`listen(port?)\`, \`close(signal?)\`, \`enableShutdownHooks()\`, \`onShutdown(cb)\`, \`getContainer()\`, \`getServer()\`, \`getRoutes()\`, \`setRoutes()\`, \`setModules()\`, \`setMiddlewareConfigurations()\`.
- There is NO \`useGlobalPipes\`, \`useGlobalGuards\` or \`useGlobalFilters\`: apply \`@UsePipes\`/\`@UseGuards\`/\`@UseFilters\` on the controller (or a shared base controller) or register the class in the module providers. CORS and static assets are app-level calls.
### Middleware, CORS and static serving

- A module registers middleware by implementing \`NestModule\`: \`configure(consumer: MiddlewareConsumer)\` then \`consumer.apply(HelmetMiddleware).forRoutes('*')\`, narrowed with \`.exclude(...)\`; \`apply\` takes \`MiddlewareFunction | MiddlewareClass | GalaxyMiddleware\`.
- Middleware class: \`GalaxyMiddleware.use(request: Request, next: () => Promise<Response>): Promise<Response>\` (alias \`OrbitMiddleware\`).
- \`CorsOptions = { origin?: string | string[] | boolean | ((origin: string) => boolean), methods?, allowedHeaders?, exposedHeaders?, credentials?, maxAge?, preflightContinue?, optionsSuccessStatus? }\`, passed as \`OrbitFactory.create(AppModule, { cors: { ... } })\`.
- \`StaticServeOptions = { root, prefix?, index?, dotFiles?: 'allow'|'deny'|'ignore', maxAge?, immutable?, etag?, lastModified?, cacheMaxSize?, cacheTtl?, cacheDebug? }\`.
### Security and throttling wiring - trust the declarations, not the package READMEs

- \`orbit-security/README.md\` shows \`csrf: { enabled, tokenKey, cookieName }\`, but \`CsrfOptions\` is \`{ cookie?: { name?, path?, httpOnly?, secure?, sameSite?, maxAge? }, ignoreMethods?, getToken?, sessionKey? }\` - there is no \`enabled\` flag (omit \`csrf\` to disable) and the cookie name lives in \`cookie.name\`.
- \`orbit-throttler/README.md\` shows \`new RedisThrottlerStorage(...)\` (the export is \`ThrottlerRedisStorage\`) and a \`throttlers: [...]\` list, but \`ThrottlerModuleOptions\` extends \`ThrottlerOptions\` with only \`storage?\` / \`errorMessage?\` and requires \`ttl\` + \`limit\`.
- Accurate: \`SecurityModule.forRoot({ helmet: { frameguard: { action: 'deny' } }, csrf: { cookie: { name: 'XSRF-TOKEN', httpOnly: true }, ignoreMethods: ['GET'] } })\` and \`ThrottlerModule.forRoot({ ttl: 60, limit: 100, storage: new ThrottlerMemoryStorage() })\`.
- Guards: \`@UseGuards(ApiKeyGuard)\` with \`CanActivate.canActivate(context): boolean | Promise<boolean>\`. Filters: \`@Catch(ThrottlerException)\` + \`ExceptionFilter.catch(exception, host)\` applied with \`@UseFilters\` - without it a throttled request becomes a 500.
- Middleware: a module implements \`configure(consumer: MiddlewareConsumer)\` then \`consumer.apply(HelmetMiddleware).forRoutes('*')\`, narrowed with \`.exclude(...)\`.
- Custom throttler storage implements \`ThrottlerStorage { increment(key, ttl), get(key), reset(key) }\`.
### Database wiring \u2014 the concrete pattern

- SQLite lives in \`database\`, not \`url\`: \`DatabaseModule.forRoot({ type: 'sqlite', database: './app.db' })\` (\`:memory:\` accepted).
- Feature module: \`DatabaseModule.forFeature([Member], new Map([[Member, 'members']]))\` \u2014 entities plus the entity-to-table map, second argument required.
- Entities: \`@Entity('members')\`, \`@PrimaryGeneratedColumn('increment' | 'uuid')\`, \`@Column({ nullable?: boolean, ... })\`.
- Repositories: prefer the concrete \`DrizzleRepository<T>\` (\`new DrizzleRepository(db, table, Member)\`) over hand-implementing \`BaseRepository<T>\`; the base also declares \`count(where?)\` as abstract, and \`DrizzleRepository\` exposes \`getQueryBuilder()\`, \`getRawDb()\`, \`getTable()\`.
- Transactions: \`@Transactional()\` on a service method wraps the repository calls inside it.
- Data source: \`createDataSource(options)\` / \`BunDataSource\`; inject with the \`DATA_SOURCE\` token for the raw handle.
### Request pipeline contracts (guards, pipes, interceptors, filters)

These are the exact interfaces the pipeline passes around (from
\`orbit-core/dist/pipeline/execution-pipeline.d.ts\`, re-exported by \`orbit-common\`):

\`\`\`ts
interface ExecutionContext {
  getRequest<T = any>(): T;
  getResponse<T = any>(): T;
  getHandler(): Function;
  getClass(): Type;
  switchToHttp(): HttpArgumentsHost;      // { getRequest<T>(): T; getResponse<T>(): T }
}
interface CanActivate { canActivate(context: ExecutionContext): boolean | Promise<boolean>; }
interface PipeTransform<T = any, R = any> { transform(value: T, metadata: ArgumentMetadata): R | Promise<R>; }
interface CallHandler<T = any> { handle(): Promise<T>; }
interface GalaxyInterceptor<T = any, R = any> { intercept(context: ExecutionContext, next: CallHandler<T>): Promise<R> | R; }
interface ExceptionFilter<T = any> { catch(exception: T, context: ExecutionContext): any; }
interface ArgumentMetadata { type: 'body' | 'query' | 'param' | 'custom'; metatype?: Type; data?: string; }
\`\`\`

- The runtime pipeline hands an **\`ExecutionContext\`** to guards, interceptors and the filters it
  resolves \u2014 read the request/response with \`context.getRequest()\` / \`context.getResponse()\` (or
  \`context.switchToHttp().getResponse()\`), and the handler/class with \`getHandler()\` / \`getClass()\`.
  The runtime never calls \`getArgs()\` / \`getArgByIndex()\`.
- **Two \`ExceptionFilter\` interfaces ship and they disagree \u2014 pick deliberately, there is no third.**
  \`@galaxy-stack/orbit-core\` (\`dist/pipeline/execution-pipeline.d.ts\`) declares
  \`catch(exception, context: ExecutionContext)\`, which is what the pipeline actually passes.
  \`@galaxy-stack/orbit-common\` (\`dist/decorators/catch.decorator.d.ts\`, next to \`Catch\`/\`UseFilters\`)
  declares \`catch(exception, host: ArgumentsHost)\` and that \`ArgumentsHost\` **does** declare
  \`getArgs()\`, \`getArgByIndex()\`, \`getType()\` \u2014 calling them throws at runtime. Safe shape: type the
  second parameter \`any\` (or \`ExecutionContext\`) and use only \`getRequest()\`/\`getResponse()\`.
- **Guard context types differ per guard.** A hand-written guard receives \`ExecutionContext\`, but
  \`ThrottlerGuard\` receives its own \`ThrottlerContext\` (\`{ getRequest(): ThrottlerRequest;\`
  \`getResponse(): any; getHandler(): Function; getClass(): any }\`) where
  \`ThrottlerRequest = { ip?: string; headers?: Record<string,string>; url?: string; method?: string }\` \u2014
  a plain object, so \`context.getRequest().headers['x-api-key']\` works and \`.body\` does not exist.
- A filter's \`catch(exception, context)\` **returns whatever becomes the response** (status/body are
  derived from what you return, e.g. \`new Response(JSON.stringify({ error }), { status: 429 })\` for a
  \`ThrottlerException\`).
- Registration: \`@UseGuards/@UsePipes/@UseInterceptors/@UseFilters\` on the handler or controller, or
  provider-level classes; \`ExecutionPipeline\` resolves them per controller and caches the metadata.

### Installing and wiring the database layer

\`orbit new\` does **not** install a database layer. When a task needs one, add both
packages \u2014 \`drizzle-orm\` is a **peer dependency** (>=0.29) of \`orbit-database@0.1.x\` and
nothing works without it:

\`\`\`sh
bun add @galaxy-stack/orbit-database drizzle-orm
\`\`\`

Two legitimate shapes:

- **orbit-database + Drizzle** \u2014 \`@Entity\`/\`@Column\`, \`DatabaseModule.forRoot/forFeature\`,
  \`DrizzleRepository\`, \`@Transactional\`.
- **Plain \`bun:sqlite\`** \u2014 \`import { Database } from 'bun:sqlite'\` behind a token provider
  plus SQL migrations; no peer dependency. Pick one deliberately and say which in the report.

Complete orbit-database wiring, matching the declarations:

\`\`\`ts
// tables.ts \u2014 Drizzle tables come from drizzle-orm; the entity decorators point at them
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const membersTable = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

// member.entity.ts
@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('increment') id!: number;
  @Column() name!: string;
}

// members.module.ts
@Module({
  imports: [DatabaseModule.forFeature([Member], new Map([[Member, membersTable]]))],
  controllers: [MembersController],
  providers: [
    MembersService,
    { provide: MemberRepository, useFactory: (db: any) => new MemberRepository(db, membersTable), inject: [DATA_SOURCE] },
  ],
})
export class MembersModule {}

// member.repository.ts \u2014 DrizzleRepository(db, table, entityClass)
export class MemberRepository extends DrizzleRepository<Member> {
  constructor(db: any, table: any) { super(db, table, Member); }
}
\`\`\`

App module: \`DatabaseModule.forRoot({ type: 'sqlite', database: './app.db' })\` (\`database\`, not
\`url\`, for SQLite; \`:memory:\` works for tests).

### Migrations with drizzle-kit and the bun:sqlite migrator

Measured gap: agents that picked the Drizzle shape still opened \`orbit-database/dist/**\` and
\`drizzle-orm/bun-sqlite/migrator.d.ts\` because nothing here said how migrations are generated or applied.
This is the whole workflow, and it is what a real GymFlow backend used.

1. Config file at the backend root \u2014 \`drizzle-kit\` reads it when you run \`bunx drizzle-kit generate\`:

\`\`\`ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/database/schema.ts',   // your sqliteTable definitions
  out: './drizzle',                     // timestamped .sql files land here
  dbCredentials: { url: process.env.DATABASE_FILE ?? \`./app.db\` },
  verbose: true,
  strict: true,
});
\`\`\`

2. Apply them with the bun:sqlite migrator \u2014 \`drizzle-orm/bun-sqlite/migrator\` exports \`migrate(db, { migrationsFolder })\`:

\`\`\`ts
// src/database/migrate.ts
import { resolve } from 'node:path';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { createDatabase, type AppDatabase } from './client';

/** Resolved from this file so the command works from any working directory. */
export const MIGRATIONS_FOLDER = resolve(import.meta.dir, '../../drizzle');

export function applyMigrations(target: AppDatabase): void {
  migrate(target.db, { migrationsFolder: MIGRATIONS_FOLDER });
}

if (import.meta.main) {
  const connection = createDatabase();
  try {
    applyMigrations(connection);
    console.log(\`Migrated \${databaseFile()}\`);
  } finally {
    connection.sqlite.close();   // bun:sqlite keeps the process alive without this
  }
}
\`\`\`

- Wrap the file in \`if (import.meta.main)\` so importing it in a test does not migrate anything.
- Expose the handle as \`{ db, sqlite }\` from your client module: \`drizzle(sqlite)\` gives the
  drizzle instance, and \`sqlite.close()\` is what lets the process exit.
- Scripts: \`"db:generate": "bunx drizzle-kit generate"\`, \`"db:migrate": "bun run src/database/migrate.ts"\`.
- \`orbit-database\` is optional for this shape. \`DatabaseModule.forRoot/forFeature\` + \`DrizzleRepository\` is the
  other legitimate shape; pick one deliberately and say which in the report.
- A probe or script that boots a server or opens the database must close it and call
  \`process.exit()\` before it ends, or \`run_command\` waits until its timeout. Measured: a boot probe without a
  close burned the full 120s timeout.

### Rate limiting and throttling recipes \u2014 the complete wiring

**Pick the mechanism first.** The app-level limiter protects every route in one place; the guard gives
per-route budgets and a 429 with Retry-After.

- App-level limiter (no guard): \`const limiter = rateLimit({ windowMs: 60_000, maxRequests: 100 })\`
  then mount \`limiter.createMiddleware()\` through the middleware machinery
  (\`consumer.apply(limiter.createMiddleware()).forRoutes('*')\` or \`app.use(...)\`).
  \`SlidingWindowRateLimiter\` exposes \`increment(key): boolean\`, \`getInfo(key)\`, \`reset(key)\`,
  \`destroy()\`; \`tokenBucket()\` returns a \`TokenBucketRateLimiter\` with \`consume(key, tokens?)\`.

**Route-level throttling \u2014 the whole DI story is one import.** \`ThrottlerModule.forRoot()\` is
\`global: true\` and already registers \`{ provide: THROTTLER_OPTIONS, useValue: options }\`, \`THROTTLER_STORAGE\`,
\`{ provide: THROTTLER_GUARD, useFactory: (options, storage) => new ThrottlerGuard({ ...options, storage }), inject: [THROTTLER_OPTIONS, THROTTLER_STORAGE] }\`
and \`{ provide: ThrottlerGuard, useExisting: THROTTLER_GUARD }\`. **Do not hand-write that factory and do not
construct the guard yourself** \u2014 \`@UseGuards(ThrottlerGuard)\` resolves from the container as soon as the
module is imported by the root module:

\`\`\`ts
// app.module.ts
@Module({
  imports: [
    SecurityModule.forRoot({
      helmet: { frameguard: { action: 'deny' } },
      csrf: { cookie: { name: 'XSRF-TOKEN', httpOnly: true, sameSite: 'lax' }, ignoreMethods: ['GET', 'HEAD'] },
    }),
    ThrottlerModule.forRoot({ ttl: 60, limit: 100 }),
    MembersModule, PackagesModule, PaymentsModule, CheckinsModule,
  ],
})
export class AppModule {}
\`\`\`

**Attach the guard and the 429 filter once, via a shared base controller.** Orbit has no
\`useGlobalGuards\`/\`useGlobalFilters\`, but \`Reflect.getMetadata\` walks the prototype chain, so a
class-level decorator on an abstract base class is inherited by every subclass \u2014 one file instead of
re-editing every controller:

\`\`\`ts
// common/guarded.controller.ts
import { Catch, UseFilters, UseGuards, type ExceptionFilter } from '@galaxy-stack/orbit-common';
import { ThrottlerException, ThrottlerGuard } from '@galaxy-stack/orbit-throttler';

/** ThrottlerException extends Error and carries statusCode = 429, but the orbit-core pipeline only
 *  maps HttpException \u2014 without this filter a throttled request answers 500. */
@Catch(ThrottlerException)
export class ThrottlerExceptionFilter implements ExceptionFilter<ThrottlerException> {
  catch(exception: ThrottlerException, context: any) {
    return new Response(
      JSON.stringify({ statusCode: 429, message: exception.message, retryAfter: exception.retryAfter }),
      { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(exception.retryAfter ?? 60) } },
    );
  }
}

@UseGuards(ThrottlerGuard)
@UseFilters(ThrottlerExceptionFilter)
export abstract class GuardedController {}

// members.controller.ts \u2014 tighten only the write handlers
@Controller('api/members')
export class MembersController extends GuardedController {
  @Post()
  @Throttle(20, 60)   // limit, ttl \u2014 order matters
  create(/* ... */) {}
}
\`\`\`

- \`Throttle(limit, ttl)\` \u2014 **limit first**; \`Throttle({ limit, ttl })\` and \`SkipThrottle(skip?)\` also exist. \`ttl\` is **seconds**.
- A filter \`catch(exception, context)\` may return a \`Response\` (used verbatim) or any value that becomes the
  response body via \`transformToResponse\` \u2014 return a \`Response\` when you need status 429.
- Custom throttler storage implements \`ThrottlerStorage { increment(key, ttl), get(key), reset(key) }\`;
  memory storage is the default and \`ThrottlerRedisStorage\` targets Redis (the README name
  \`RedisThrottlerStorage\` does not exist).
- Enabling CSRF makes every non-GET request need the token, including your own e2e suite \u2014 keep
  \`ignoreMethods: ['GET', 'HEAD']\` and give \`getToken(req)\` when API clients cannot carry cookies.

`
  },
  {
    id: "pitfalls",
    title: "Pitfalls - runtime behaviour the declarations do not tell you",
    summary: "Measured traps: status codes masked by @HttpCode, the two ExceptionFilter interfaces, throttler DI, missing global registration, and version-specific bugs.",
    content: `Runtime behaviour that contradicts the declarations, plus bugs that are version specific. Every line here was measured against a real install - nothing is inferred. When a signature is missing from the generated surface, report it as a knowledge gap instead of silently reading the declarations.

### HttpCode masks failure statuses (orbit-core <= 0.2.3)
The shipped build does \`status: httpCode || response.status\`, so a handler decorated \`@HttpCode(201)\` answers 201 even when a pipe rejected the body or \`ThrottlerGuard\` rejected the request. Measured on 0.2.3: a rejecting pipe without \`@HttpCode\` answers 400 correctly; the same handler with \`@HttpCode(201)\` answers 201; throttling answers \`200,200,429,429\` without \`@HttpCode\` and 201,201,201 with it. Workaround until the runtime fix ships: keep \`@HttpCode\` off any handler that can fail and return an explicit \`Response\` with the success status. Do not blame \`ZodValidationPipe\`.

### There are two ExceptionFilter interfaces
\`orbit-core\` types a filter against an \`ExecutionContext\` (\`getRequest()\`, \`getResponse()\`, \`getHandler()\`, \`getClass()\`); \`orbit-common\` exports one typed against a Nest \`ArgumentsHost\` that declares \`getArgs()\` / \`getArgByIndex()\` / \`getType()\`. The runtime hands the core interface. Type the second parameter \`any\` and use only the four methods above.

### A filter's return value becomes the response
Return a \`Response\` when you need a specific status; returning a plain object yields 200/204.

### ThrottlerGuard needs DI and a 429 filter
\`ThrottlerModule.forRoot()\` is \`global: true\` and already provides \`THROTTLER_OPTIONS\`, \`THROTTLER_STORAGE\` and \`THROTTLER_GUARD\` - do not hand-write the factory. \`ThrottlerException\` extends \`Error\` and the pipeline only maps \`HttpException\`, so an uncaught rejection answers 500: add one \`@Catch(ThrottlerException)\` filter on a shared base controller. \`@Throttle(limit, ttl)\` takes the limit first and \`ttl\` is seconds.

### No global pipes, guards or filters
There is no \`useGlobalPipes\` / \`useGlobalGuards\` / \`useGlobalFilters\`. Use \`@UsePipes\` / \`@UseGuards\` / \`@UseFilters\` on a shared abstract base controller - \`Reflect.getMetadata\` walks the prototype chain, so class-level decorators are inherited and you edit one file instead of every controller.

### The scaffold tools return text
\`orbit_scaffold_module\` and \`orbit_scaffold_graphql\` generate copy-paste-ready code; they never write files. The module scaffold wires no database on purpose - follow the recipes topic for the real wiring.

### Never run bunx @galaxy-stack/orbit-cli@latest
\`bunx\` re-resolves from the registry on every call and stalls for minutes when it is slow. The \`orbit\` and \`nebula\` binaries are already on \`PATH\`.

### Processes that boot a server or open the database must exit
Close the handle (\`sqlite.close()\`) and call \`process.exit()\` in any script or probe that boots the app, or \`run_command\` waits until its timeout - measured: a boot probe without a close burned the full 120s.

### The package READMEs contradict their own types
\`trust the declarations, not the READMEs\` is literal: \`security/README.md\` teaches \`csrf: { enabled, tokenKey, cookieName }\` and \`throttler/README.md\` teaches \`throttlers: [...]\` and \`RedisThrottlerStorage\`; none of those exist. The generated api-surface topic is the authority.`
  },
  {
    id: "absent",
    title: "What does NOT exist - stop searching for it",
    summary: "The NestJS APIs and the wrong symbol names agents keep looking for; each one has a real replacement.",
    content: `Everything below was searched for in real runs and does not exist in Orbit. If you are about to look for one of these, stop and use the replacement; if something you need is missing from the generated surface, report it as a knowledge gap.

### APIs that are NestJS, not Orbit
- \`app.setGlobalPrefix(...)\` - the prefix belongs to the controller path: \`@Controller('api/v1/members')\`.
- \`app.useGlobalPipes\` / \`app.useGlobalGuards\` / \`app.useGlobalFilters\` - decorate a shared abstract base controller instead.
- \`app.handle(Request)\` for e2e - \`OrbitApplication\` has no public \`handle()\`; boot with \`OrbitFactory.create(AppModule, { port: 0 })\` and \`fetch\` the real port.

### Symbol names that look right but are wrong
- \`NotFoundError\` - the class is \`NotFoundException\` (orbit-common).
- \`RedisThrottlerStorage\` - the export is \`ThrottlerRedisStorage\`.
- \`throttlers: [...]\` and \`csrf: { enabled, tokenKey, cookieName }\` - README-only shapes; the real option interfaces are in the generated api-surface topic.
- \`ThrottlerModuleOptions.ttl\` / \`.limit\` are not own members - they are inherited from \`ThrottlerOptions\` via \`extends\`.

### Imports that will not resolve
- \`Body\`, \`Param\`, \`Query\`, \`HttpCode\`, \`UseGuards\`, \`UsePipes\`, \`Catch\` from \`@galaxy-stack/orbit-core\` - these live in \`@galaxy-stack/orbit-common\`; importing them from core throws \`Export named '...' not found\`.
- \`@Body(new ZodValidationPipe(schema))\` - \`@Body\` takes an optional field name only; put the pipe at method level with \`@UsePipes(...)\`.

### Capabilities this CLI does not have
- There is no \`manage_session\`, \`preview\` or browser/perception tool in the catalog. To exercise a running app, start it detached with \`run_command\` and probe it with \`curl\`, then stop it.
- The scaffold flag \`withDatabase\` does not exist (it never did anything); wire the database with \`DatabaseModule\` + \`DrizzleRepository\` per the recipes topic.`
  }
];
function sectionsOf(entry) {
  const lines = entry.content.split(`
`);
  const sections = [];
  let title = null;
  let buffer = [];
  const flush = () => {
    const body = buffer.join(`
`).trim();
    if (!body)
      return;
    const resolvedTitle = title ?? entry.title;
    sections.push({ id: slug(resolvedTitle), title: resolvedTitle, body });
  };
  for (const line of lines) {
    const heading = /^###\s+(.+?)\s*$/.exec(line);
    if (heading) {
      flush();
      title = heading[1];
      buffer = [];
      continue;
    }
    buffer.push(line);
  }
  flush();
  return sections;
}
function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
var SECTION_ALIASES = {
  exports: "export-surface",
  api: "export-surface",
  application: "application-api-and-global-registration",
  middleware: "middleware-cors-and-static-serving",
  cors: "middleware-cors-and-static-serving",
  security: "security-and-throttling-wiring-trust-the-declarations-not-th",
  database: "database-wiring-the-concrete-pattern",
  db: "installing-and-wiring-the-database-layer",
  pipeline: "request-pipeline-contracts-guards-pipes-interceptors-filters",
  guards: "request-pipeline-contracts-guards-pipes-interceptors-filters",
  filters: "request-pipeline-contracts-guards-pipes-interceptors-filters",
  install: "installing-and-wiring-the-database-layer",
  migrations: "migrations-with-drizzle-kit-and-the-bun-sqlite-migrator",
  migrate: "migrations-with-drizzle-kit-and-the-bun-sqlite-migrator",
  versions: "compiled-against",
  throttler: "rate-limiting-and-throttling-recipes-the-complete-wiring",
  "rate-limit": "rate-limiting-and-throttling-recipes-the-complete-wiring"
};
var RECIPE_ALIASES = [
  "application",
  "middleware",
  "cors",
  "security",
  "database",
  "db",
  "install",
  "migrations",
  "migrate",
  "pipeline",
  "guards",
  "filters",
  "throttler",
  "rate-limit"
];
var TOPIC_ALIASES = (() => {
  const table = {
    api: { topic: "api-surface", section: "export-surface" },
    exports: { topic: "api-surface", section: "export-surface" },
    versions: { topic: "api-surface", section: "compiled-against" },
    "compiled-against": { topic: "api-surface", section: "compiled-against" }
  };
  for (const alias of RECIPE_ALIASES)
    table[alias] = { topic: "recipes", section: SECTION_ALIASES[alias] };
  for (const entry of API_SURFACE_PACKAGES)
    table[entry.name] = { topic: "api-surface", section: entry.name };
  return table;
})();
var RECIPE_TASKS = {
  "throttle-per-route": { topic: "recipes", section: SECTION_ALIASES["throttler"] },
  "rate-limit": { topic: "recipes", section: SECTION_ALIASES["throttler"] },
  throttling: { topic: "recipes", section: SECTION_ALIASES["throttler"] },
  "security-baseline": { topic: "recipes", section: SECTION_ALIASES["security"] },
  helmet: { topic: "security-checklist", section: "security-checklist" },
  csrf: { topic: "security-checklist", section: "security-checklist" },
  "database-wiring": { topic: "recipes", section: SECTION_ALIASES["database"] },
  "install-database": { topic: "recipes", section: SECTION_ALIASES["install"] },
  migrations: { topic: "recipes", section: SECTION_ALIASES["migrations"] },
  "drizzle-migrations": { topic: "recipes", section: SECTION_ALIASES["migrations"] },
  "application-surface": { topic: "recipes", section: SECTION_ALIASES["application"] },
  middleware: { topic: "recipes", section: SECTION_ALIASES["middleware"] },
  cors: { topic: "recipes", section: SECTION_ALIASES["middleware"] },
  "static-files": { topic: "recipes", section: SECTION_ALIASES["middleware"] },
  filters: { topic: "recipes", section: SECTION_ALIASES["pipeline"] },
  guards: { topic: "recipes", section: SECTION_ALIASES["pipeline"] },
  "request-pipeline": { topic: "recipes", section: SECTION_ALIASES["pipeline"] },
  "zod-validation": { topic: "validation-pattern", section: "validation-pattern" },
  "e2e-test": { topic: "testing-pattern", section: "testing-pattern" },
  graphql: { topic: "graphql-pattern", section: "graphql-pattern" },
  microservices: { topic: "microservices-pattern", section: "microservices-pattern" },
  "status-code-bug": { topic: "pitfalls", section: "httpcode-masks-failure-statuses-orbit-core-0-2-3" },
  "wrong-import": { topic: "absent", section: "imports-that-will-not-resolve" },
  "nest-apis-that-do-not-exist": { topic: "absent", section: "apis-that-are-nestjs-not-orbit" }
};
function sectionAliases() {
  return [...new Set([...Object.keys(SECTION_ALIASES), ...Object.keys(TOPIC_ALIASES), ...Object.keys(RECIPE_TASKS)])].sort();
}
function findSection(entry, section) {
  const wanted = slug(section);
  const sections = sectionsOf(entry);
  const aliased = SECTION_ALIASES[wanted];
  if (aliased) {
    const hit = sections.find((s) => s.id === aliased);
    if (hit)
      return hit;
  }
  return sections.find((s) => s.id === wanted) ?? sections.find((s) => s.id.startsWith(wanted) || wanted.startsWith(s.id));
}
function getKnowledge(id) {
  return KNOWLEDGE.find((k) => k.id === id);
}

// src/tools.ts
var TOOLS = [
  {
    name: "orbit_knowledge_topics",
    annotations: { title: "orbit knowledge topics", readOnlyHint: true },
    description: "List all available Orbit framework knowledge topics with summaries.",
    inputSchema: { type: "object", properties: {} }
  },
  {
    name: "orbit_knowledge_read",
    annotations: { title: "orbit knowledge read", readOnlyHint: true },
    description: "Read one Orbit knowledge topic by id (use orbit_knowledge_topics first). Pass section to fetch only one part of a large topic, which is much cheaper after a context compaction.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Topic id from orbit_knowledge_topics" },
        section: {
          type: "string",
          description: "Optional section id from orbit_knowledge_topics, e.g. throttler or database. Omit for the whole topic."
        }
      },
      required: ["id"]
    }
  },
  {
    name: "orbit_scaffold_module",
    annotations: { title: "orbit scaffold module", readOnlyHint: true },
    description: 'Generate an in-memory Orbit feature module (module, controller with Zod validation, service, optional test) as copy-paste-ready code. This is a starting shape only \u2014 it wires NO database. For a real database follow the api-surface topic section "installing-and-wiring-the-database-layer" (DatabaseModule + DrizzleRepository) instead of adapting this output.',
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: 'Feature name in kebab-case, e.g. "user"' },
        withTests: { type: "boolean", description: "Include a bun:test unit test file" }
      },
      required: ["name"]
    }
  },
  {
    name: "orbit_scaffold_graphql",
    annotations: { title: "orbit scaffold graphql", readOnlyHint: true },
    description: "Generate a GraphQL feature: resolver, object types, input types, and module wiring with security limits.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Feature name in kebab-case" },
        withLoaders: { type: "boolean", description: "Include DataLoader wiring" }
      },
      required: ["name"]
    }
  },
  {
    name: "orbit_security_review",
    annotations: { title: "orbit security review", readOnlyHint: true },
    description: "Run a static checklist against pasted source code and report missing security hardening with concrete fixes.",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Source code to review" },
        context: { type: "string", enum: ["rest", "graphql", "both"], description: "Surface to review" }
      },
      required: ["code"]
    }
  },
  {
    name: "orbit_environment",
    annotations: { title: "orbit environment", readOnlyHint: true },
    description: 'Report which @galaxy-stack/orbit-* packages the project installs, next to the versions this knowledge base was generated from. Call this once instead of reading node_modules/*/package.json: a version delta explains most "the docs do not match my install" cases, and it names the delta instead of leaving you to guess.',
    inputSchema: {
      type: "object",
      properties: {
        projectRoot: { type: "string", description: "Project root holding node_modules. Defaults to the server working directory." }
      }
    }
  },
  {
    name: "orbit_recipe",
    annotations: { title: "orbit recipe", readOnlyHint: true },
    description: "Fetch one verified recipe for a concrete task: throttle-per-route, rate-limit, security-baseline, csrf, database-wiring, migrations, middleware, cors, filters, guards, zod-validation, e2e-test, graphql, microservices. Use this instead of reading package READMEs (they contradict their own types) or re-deriving wiring from declarations.",
    inputSchema: {
      type: "object",
      properties: {
        task: { type: "string", description: 'Task id or a short phrase, e.g. "throttle a route", "drizzle migrations".' }
      },
      required: ["task"]
    }
  }
];
function pascal(name) {
  return name.split(/[-_]/).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join("");
}
var DOCS_STAMP = `> orbit-mcp docs - the generated **api-surface** topic carries every export of the \`@galaxy-stack/orbit-*\` packages (signatures, interface members, class methods).
Read one package section, or one symbol with \`{ symbol: "ThrottlerGuard" }\`, instead of opening \`node_modules/**/*.d.ts\`.
\`orbit_environment\` reports the versions your project installs next to the ones this knowledge was generated from; \`orbit_recipe\` returns one verified wiring recipe.
Topics \`pitfalls\` and \`absent\` hold the measured runtime traps, and the names that do NOT exist.
If a signature you need is genuinely missing, report it as a knowledge gap instead of silently re-deriving it.
Version-specific behaviour depends on the project install, so nothing here hard-codes one.`;
function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}
function readRouted(target, prefix) {
  const entry = getKnowledge(target.topic);
  const section = entry === undefined ? undefined : findSection(entry, target.section);
  if (entry === undefined || section === undefined)
    return `Nothing routed for topic ${target.topic} section ${target.section}.`;
  const lead = prefix === undefined ? "" : `${prefix} \u2014 routed to topic "${entry.id}".

`;
  return `${lead}# ${entry.title} \u2014 ${section.title}

${DOCS_STAMP}
${section.body}`;
}
function renderRecipe(topicId, sectionId, asked, fuzzy) {
  const entry = getKnowledge(topicId);
  const section = entry === undefined ? undefined : findSection(entry, sectionId);
  if (entry === undefined || section === undefined) {
    return `No recipe named ${JSON.stringify(asked)}. Tasks: ${Object.keys(RECIPE_TASKS).sort().join(", ")}.`;
  }
  const note = fuzzy ? `Closest recipe for ${JSON.stringify(asked)}.` : `Recipe for ${JSON.stringify(asked)}.`;
  return `${note}

# ${section.title}

${DOCS_STAMP}
${section.body}

_Full topic: orbit_knowledge_read({ id: "${entry.id}" }). All tasks: ${Object.keys(RECIPE_TASKS).sort().join(", ")}._`;
}
function unknownSection(entry, asked) {
  const ids = sectionsOf(entry).map((section) => section.id);
  return `Unknown section ${JSON.stringify(asked)} for topic ${entry.id}. Available sections: ${ids.join(", ")}. Aliases: ${sectionAliases().join(", ")}.`;
}
function readSymbol(symbol) {
  const owner = API_SURFACE_SYMBOLS[symbol];
  if (owner === undefined) {
    return `"${symbol}" is not exported by any @galaxy-stack/orbit-* package in the generated surface (${API_SURFACE_PACKAGES.map((entry) => entry.name + "@" + entry.version).join(", ")}). Either it does not exist \u2014 see topic "absent" \u2014 or your install differs: call orbit_environment.`;
  }
  const pattern = new RegExp("(^|[^A-Za-z0-9_$])" + symbol.replace(/[^A-Za-z0-9_$]/g, "\\$&") + "([^A-Za-z0-9_$]|$)");
  const line = API_SURFACE_CONTENT.split(`
`).find((candidate) => candidate.startsWith("- ") && pattern.test(candidate));
  return `# ${symbol}

${DOCS_STAMP}

Package: @galaxy-stack/${owner}
Declaration: ${line === undefined ? "(not found in the generated text)" : line.slice(2)}

Whole package section: orbit_knowledge_read({ id: "api-surface", section: "${owner}" }).`;
}
function executeTool(name, args) {
  const text = (t) => ({ content: [{ type: "text", text: t }] });
  switch (name) {
    case "orbit_knowledge_topics":
      return text(`${DOCS_STAMP}
${KNOWLEDGE.map((k) => {
        const ids = sectionsOf(k);
        const index = ids.length > 1 ? `
  sections: ${sectionAliases().join(", ")}` : "";
        return `- **${k.id}** \u2014 ${k.title}: ${k.summary}${index}`;
      }).join(`
`)}`);
    case "orbit_knowledge_read": {
      const id = typeof args.id === "string" ? args.id.trim() : "";
      const sectionArg = typeof args.section === "string" ? args.section.trim() : "";
      const symbolArg = typeof args.symbol === "string" ? args.symbol.trim() : "";
      if (symbolArg.length > 0)
        return text(readSymbol(symbolArg));
      if (id.length > 0) {
        const entry = getKnowledge(id);
        if (entry === undefined)
          return text(`Unknown topic "${id}". Use orbit_knowledge_topics to list ids.`);
        if (sectionArg.length > 0) {
          const section = findSection(entry, sectionArg);
          if (section !== undefined)
            return text(`# ${entry.title} \u2014 ${section.title}

${DOCS_STAMP}
${section.body}`);
          const routed = TOPIC_ALIASES[slugify(sectionArg)];
          if (routed !== undefined && routed.topic !== id)
            return text(readRouted(routed, `${JSON.stringify(sectionArg)} is not a section of "${id}"`));
          return text(unknownSection(entry, sectionArg));
        }
        const ids = sectionsOf(entry).map((s) => s.id);
        const index = ids.length > 1 ? `
Sections (re-read only what you need with { id: "${entry.id}", section }): ${ids.join(", ")}` : "";
        return text(`# ${entry.title}

${DOCS_STAMP}${index}
${entry.content}`);
      }
      if (sectionArg.length > 0) {
        const routed = TOPIC_ALIASES[slugify(sectionArg)];
        if (routed !== undefined)
          return text(readRouted(routed));
        for (const entry of KNOWLEDGE) {
          const section = findSection(entry, sectionArg);
          if (section !== undefined)
            return text(`# ${entry.title} \u2014 ${section.title}

${DOCS_STAMP}
${section.body}`);
        }
        return text(`Unknown section ${JSON.stringify(sectionArg)}. Aliases: ${sectionAliases().join(", ")}. Topics: ${KNOWLEDGE.map((k) => k.id).join(", ")}.`);
      }
      return text(`Pass { id } for a topic, { section } for an alias, or { symbol } for one export. Topics: ${KNOWLEDGE.map((k) => k.id).join(", ")}.`);
    }
    case "orbit_recipe": {
      const asked = typeof args.task === "string" ? args.task.trim() : "";
      if (asked.length === 0)
        return text(`Pass a task. Known tasks: ${Object.keys(RECIPE_TASKS).sort().join(", ")}.`);
      const wanted = slugify(asked);
      const direct = RECIPE_TASKS[wanted];
      if (direct !== undefined)
        return text(renderRecipe(direct.topic, direct.section, asked, false));
      const tokens = wanted.split("-").filter((token) => token.length > 2);
      let best;
      for (const [taskId, target] of Object.entries(RECIPE_TASKS)) {
        const score = taskId.split("-").filter((token) => tokens.includes(token)).length;
        if (score > 0 && (best === undefined || score > best.score))
          best = { score, topic: target.topic, section: target.section };
      }
      if (best === undefined) {
        return text(`No recipe matches ${JSON.stringify(asked)}. Known tasks: ${Object.keys(RECIPE_TASKS).sort().join(", ")}. Every topic: ${KNOWLEDGE.map((k) => k.id).join(", ")}.`);
      }
      return text(renderRecipe(best.topic, best.section, asked, true));
    }
    case "orbit_environment": {
      const root = typeof args.projectRoot === "string" && args.projectRoot.trim().length > 0 ? args.projectRoot.trim() : process.cwd();
      const scope = join(root, "node_modules", "@galaxy-stack");
      let names = [];
      try {
        names = readdirSync(scope).filter((name2) => name2.startsWith("orbit-") || name2 === "galaxy-ui" || name2.startsWith("nebula"));
      } catch {
        return text(`No ${scope} directory. The project at ${root} has no @galaxy-stack packages installed yet \u2014 scaffold/install first, or pass projectRoot.`);
      }
      const installed = [];
      for (const name2 of names.sort()) {
        try {
          const manifest = JSON.parse(readFileSync(join(scope, name2, "package.json"), "utf8"));
          installed.push({ name: name2, version: typeof manifest.version === "string" ? manifest.version : "unknown" });
        } catch {
          installed.push({ name: name2, version: "unreadable package.json" });
        }
      }
      const generated = new Map(API_SURFACE_PACKAGES.map((entry) => [entry.name, entry.version]));
      const rows = installed.map((entry) => {
        const expected = generated.get(entry.name);
        const state = expected === undefined ? "not part of the generated surface" : expected === entry.version ? "same as the surface" : `surface was generated from ${expected}`;
        return `- ${entry.name}${entry.version ? "@" + entry.version : ""} \u2014 ${state}`;
      });
      const absent = API_SURFACE_PACKAGES.filter((entry) => !installed.some((item) => item.name === entry.name)).map((entry) => entry.name);
      return text([
        `# Orbit environment (${root})`,
        "",
        DOCS_STAMP,
        "",
        ...rows.length === 0 ? ["- no @galaxy-stack packages found"] : rows,
        ...absent.length === 0 ? [] : ["", `Not installed here: ${absent.join(", ")}.`],
        "",
        `Generated surface: ${API_SURFACE_PACKAGES.map((entry) => entry.name + "@" + entry.version).join(", ")}.`,
        'A different version means the declarations of THAT install win for the delta: read the package section with orbit_knowledge_read({ id: "api-surface", section: "<package>" }) and report a genuinely missing symbol as a knowledge gap.'
      ].join(`
`));
    }
    case "orbit_scaffold_module": {
      const name2 = String(args.name || "feature");
      const kebab = name2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      const cls = pascal(name2);
      const files = [];
      files.push(`// src/${kebab}/${kebab}.module.ts
import { Module } from '@galaxy-stack/orbit-core';
import { ${cls}Controller } from './${kebab}.controller';
import { ${cls}Service } from './${kebab}.service';

@Module({
  controllers: [${cls}Controller],
  providers: [${cls}Service],
  exports: [${cls}Service],
})
export class ${cls}Module {}`);
      files.push(`// src/${kebab}/${kebab}.service.ts
import { Injectable } from '@galaxy-stack/orbit-core';

export interface Create${cls}Input {
  name: string;
}

@Injectable()
export class ${cls}Service {
  private readonly items = new Map<string, { id: string; name: string }>();

  list() { return [...this.items.values()]; }

  find(id: string) { return this.items.get(id); }

  create(input: Create${cls}Input) {
    const item = { id: crypto.randomUUID(), name: input.name };
    this.items.set(item.id, item);
    return item;
  }
}`);
      files.push(`// src/${kebab}/${kebab}.controller.ts
import { Controller, Get, Post, ZodValidationPipe } from '@galaxy-stack/orbit-core';
import { Body, HttpCode, NotFoundException, Param, UsePipes } from '@galaxy-stack/orbit-common';
import { z } from 'zod';
import { ${cls}Service } from './${kebab}.service';

/** @Body accepts only a field name, so the schema is bound with @UsePipes at method level. */
export const Create${cls}Schema = z.object({ name: z.string().min(1) });

@Controller('${kebab}')
export class ${cls}Controller {
  constructor(private readonly service: ${cls}Service) {}

  @Get()
  list() { return this.service.list(); }

  @Get(':id')
  find(@Param('id') id: string) {
    const item = this.service.find(id);
    if (!item) throw new NotFoundException('${cls} not found');
    return item;
  }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(Create${cls}Schema))
  create(@Body() body: z.infer<typeof Create${cls}Schema>) { return this.service.create(body); }
}`);
      if (args.withTests) {
        files.push(`// src/${kebab}/${kebab}.service.test.ts
import { describe, test, expect } from 'bun:test';
import { ${cls}Service } from './${kebab}.service';

describe('${cls}Service', () => {
  test('creates and finds items', () => {
    const service = new ${cls}Service();
    const created = service.create({ name: 'demo' });
    expect(service.find(created.id)?.name).toBe('demo');
  });
});`);
      }
      return text(files.join(`

`));
    }
    case "orbit_scaffold_graphql": {
      const name2 = String(args.name || "feature");
      const kebab = name2.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
      const cls = pascal(name2);
      const loader = args.withLoaders ? `
  @ResolveField(() => Author)
  author(@Parent() parent: ${cls}, @Loader('authorLoader') loader: DataLoader) {
    return loader.load(parent.authorId);
  }` : "";
      return text(`// src/${kebab}/${kebab}.resolver.ts
import { Resolver, Query, Mutation, Args${args.withLoaders ? ", ResolveField, Parent, Loader" : ""} } from '@galaxy-stack/orbit-graphql';
${args.withLoaders ? `import { DataLoader } from '@galaxy-stack/orbit-graphql';
` : ""}

@Resolver(() => ${cls})
export class ${cls}Resolver {
  constructor(private readonly service: ${cls}Service) {}

  @Query(() => [${cls}])
  ${kebab}() { return this.service.list(); }

  @Mutation(() => ${cls})
  create${cls}(@Args('input') input: Create${cls}Input) {
    return this.service.create(input);
  }${loader}
}

// Module wiring with production security limits:
// GraphQLModule.forRoot({
//   introspection: process.env.NODE_ENV !== 'production',
//   security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 },
//   resolvers: [${cls}Resolver],
// })`);
    }
    case "orbit_security_review": {
      const code = String(args.code || "");
      const surface = args.context || "both";
      const findings = [];
      const has = (re) => re.test(code);
      if (surface !== "graphql" && has(/@(Post|Put|Patch|Delete)\(/)) {
        if (!has(/ValidationPipe|ZodValidationPipe|ZodArgumentPipe|schema\.parse/))
          findings.push("[HIGH] Mutation endpoints lack input validation. Bind a Zod schema with @UsePipes(new ZodValidationPipe(schema)) \u2014 @Body(new ValidationPipe(...)) is not supported because @Body only accepts a field name.");
        if (!has(/UseGuards|AuthGuard|jwt|session/i))
          findings.push("[HIGH] State-changing endpoint without an auth guard. Add @UseGuards(JwtAuthGuard) or equivalent.");
        if (!has(/Throttle|RateLimit|throttler/i))
          findings.push("[MEDIUM] No rate limiting on writes. Import ThrottlerModule.forRoot({ ttl, limit }) \u2014 it is global and already provides ThrottlerGuard \u2014 then extend a shared @UseGuards(ThrottlerGuard) base controller and tighten write handlers with @Throttle(limit, ttl).");
      }
      if (surface !== "rest" && has(/GraphQLModule|@Resolver\(/)) {
        if (has(/introspection:\s*true/))
          findings.push("[HIGH] introspection: true hardcoded \u2014 expose it only outside production.");
        if (!has(/security:\s*{|maxDepth|maxComplexity/))
          findings.push("[HIGH] GraphQLModule without security limits. Add security: { maxDepth: 10, maxComplexity: 1000, maxAliases: 30 }.");
        if (has(/playground:\s*true/))
          findings.push("[MEDIUM] Playground enabled \u2014 disable in production.");
      }
      if (has(/password|secret|token|api[_-]?key/i)) {
        if (has(/console\.log|Logger\.(log|info|debug)\(.*(password|secret|token|api[_-]?key)/i))
          findings.push("[CRITICAL] Potential secret logging detected. Redact secrets before logging.");
        if (!has(/process\.env|ConfigService/) && has(/(password|secret|apiKey|api_key)\s*[:=]\s*['"][^'"]{6,}/))
          findings.push("[CRITICAL] Hardcoded secret detected. Move to environment variables via ConfigModule.");
      }
      if (has(/innerHTML\s*=|dangerouslySetInnerHTML/) && !has(/sanitize|Sanitizer|DOMPurify/))
        findings.push("[HIGH] Unsanitized HTML sink. Sanitize with orbit-security Sanitizer before rendering.");
      if (has(/SecurityModule|helmet/i)) {} else if (surface !== "graphql") {
        findings.push("[MEDIUM] No SecurityModule/helmet usage detected. Enable SecurityModule.forRoot({ helmet: {} }) \u2014 helmet takes an options object or false, never true.");
      }
      if (findings.length === 0)
        return text("No security findings detected by the checklist. This is not a substitute for penetration testing.");
      return text(findings.map((f, i) => `${i + 1}. ${f}`).join(`
`));
    }
    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
}

// src/server.ts
import { readFileSync as readFileSync2 } from "fs";
import { fileURLToPath } from "url";
function packageVersion() {
  try {
    const path = fileURLToPath(new URL("../package.json", import.meta.url));
    const parsed = JSON.parse(readFileSync2(path, "utf8"));
    return typeof parsed.version === "string" && parsed.version.length > 0 ? parsed.version : "0.0.0";
  } catch {
    return "0.0.0";
  }
}
var PROTOCOL_VERSION = "2025-03-26";
var SERVER_INFO = {
  name: "@galaxy-stack/orbit-mcp",
  version: packageVersion()
};
var PROMPTS = [
  {
    name: "build_orbit_feature",
    description: "Design and implement a new Orbit feature module end-to-end (module, controller, service, validation, tests).",
    arguments: [
      { name: "feature", description: 'Feature name, e.g. "orders"', required: true },
      { name: "storage", description: "Storage choice: memory | sqlite | none", required: false }
    ]
  },
  {
    name: "harden_graphql_api",
    description: "Audit and harden an Orbit GraphQL API: introspection, depth/complexity/alias limits, auth guards.",
    arguments: [
      { name: "code", description: "Current GraphQL module code", required: true }
    ]
  },
  {
    name: "migrate_from_nestjs",
    description: "Map NestJS concepts/decorators to Orbit equivalents and produce a migration plan.",
    arguments: [
      { name: "nest_code", description: "NestJS source to migrate", required: true }
    ]
  }
];
function promptText(name, args) {
  switch (name) {
    case "build_orbit_feature":
      return `Build an Orbit feature module named "${args.feature}"${args.storage ? ` using ${args.storage} storage` : ""}.

Requirements:
1. Create module, controller, service (orbit_scaffold_module tool can draft the skeleton).
2. Validate all inputs with a Zod schema and ValidationPipe.
3. Add auth guards to mutating routes.
4. Wire the module into AppModule.
5. Include unit tests (bun:test) and an e2e test through app.handle(Request).
6. Run bun test to verify.`;
    case "harden_graphql_api":
      return `Harden this Orbit GraphQL module:

${args.code}

Use the orbit_security_review tool (context: graphql) for the checklist, then apply fixes: disable introspection outside production, add security { maxDepth, maxComplexity, maxAliases }, guard protected resolvers, and disable the playground in production.`;
    case "migrate_from_nestjs":
      return `Map this NestJS code to Orbit:

${args.nest_code}

Concept mapping: @nestjs/common decorators -> @galaxy-stack/orbit-core; class-validator DTOs -> Zod schemas + orbit-validation; @nestjs/graphql -> orbit-graphql; Bull queues -> (roadmap) orbit-queue; EventEmitter2 -> (roadmap) orbit-event-bus. Read the orbit://knowledge/* resources for detailed patterns. Produce: 1) mapping table, 2) migrated files, 3) test plan.`;
    default:
      return `Unknown prompt: ${name}`;
  }
}
function ok(id, result) {
  return { jsonrpc: "2.0", id, result };
}
function err(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
function handleRequest(req) {
  const { id = null, method, params = {} } = reqBell(req);
  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: {},
          resources: {},
          prompts: {}
        },
        serverInfo: SERVER_INFO
      });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const { name, arguments: args } = params;
      try {
        const result = executeTool(name, args || {});
        return ok(id, result);
      } catch (e) {
        return ok(id, {
          content: [{ type: "text", text: `Tool error: ${e.message}` }],
          isError: true
        });
      }
    }
    case "resources/list":
      return ok(id, {
        resources: KNOWLEDGE.map((k) => ({
          uri: `orbit://knowledge/${k.id}`,
          name: k.title,
          description: k.summary,
          mimeType: "text/markdown"
        }))
      });
    case "resources/read": {
      const uri = params.uri || "";
      const idPart = uri.replace("orbit://knowledge/", "");
      const entry = KNOWLEDGE.find((k) => k.id === idPart);
      if (!entry)
        return err(id, -32602, `Unknown resource: ${uri}`);
      return ok(id, {
        contents: [{
          uri,
          mimeType: "text/markdown",
          text: `# ${entry.title}

${entry.content}`
        }]
      });
    }
    case "prompts/list":
      return ok(id, { prompts: PROMPTS });
    case "prompts/get": {
      const prompt = PROMPTS.find((p) => p.name === params.name);
      if (!prompt)
        return err(id, -32602, `Unknown prompt: ${params.name}`);
      return ok(id, {
        messages: [{
          role: "user",
          content: {
            type: "text",
            text: promptText(params.name, params.arguments || {})
          }
        }]
      });
    }
    default:
      return err(id, -32601, `Method not found: ${method}`);
  }
}
function reqBell(req) {
  return req;
}
async function serveStdio(input = process.stdin, output = process.stdout) {
  let buffer = "";
  const out = output;
  for await (const chunk of input) {
    buffer += typeof chunk === "string" ? chunk : new TextDecoder().decode(chunk);
    let newlineIndex;
    while ((newlineIndex = buffer.indexOf(`
`)) !== -1) {
      const line = buffer.slice(0, newlineIndex).trim();
      buffer = buffer.slice(newlineIndex + 1);
      if (!line)
        continue;
      let response;
      try {
        const req = JSON.parse(line);
        if (req.jsonrpc !== "2.0" || typeof req.method !== "string") {
          response = err(req.id ?? null, -32600, "Invalid Request");
        } else if (req.id === undefined) {
          continue;
        } else {
          response = handleRequest(req);
        }
      } catch {
        response = err(null, -32700, "Parse error");
      }
      out.write(JSON.stringify(response) + `
`);
    }
  }
}
if (import.meta.main) {
  serveStdio().catch((e) => {
    console.error("orbit-mcp fatal:", e);
    process.exit(1);
  });
}
export {
  serveStdio,
  handleRequest,
  SERVER_INFO,
  PROTOCOL_VERSION
};
