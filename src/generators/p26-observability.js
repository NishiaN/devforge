/* ═══ PILLAR ㉖ OBSERVABILITY INTELLIGENCE ═══ */
/* Generates: docs/103-106 — Architecture, Structured Logging, Metrics/Alerting, Distributed Tracing */

var OTEL_STACK={
  vercel:{collector:'Vercel OTel (built-in)',exporter:'@vercel/otel',backend:'Grafana Cloud / Honeycomb'},
  railway:{collector:'OpenTelemetry Collector (Docker)',exporter:'opentelemetry-sdk-node',backend:'Grafana + Loki + Tempo'},
  aws:{collector:'AWS ADOT Collector',exporter:'@opentelemetry/exporter-otlp-grpc',backend:'AWS X-Ray + CloudWatch'},
  cloudflare:{collector:'Cloudflare Logpush',exporter:'@opentelemetry/api (edge-compatible)',backend:'Grafana Cloud'},
  firebase:{collector:'Firebase Crashlytics + Cloud Logging',exporter:'firebase-admin logging',backend:'Google Cloud Ops'},
  supabase:{collector:'Supabase Dashboard Logs',exporter:'pino (server-side)',backend:'Supabase Log Explorer'},
  default:{collector:'OpenTelemetry Collector',exporter:'opentelemetry-sdk-node',backend:'Grafana + Loki + Tempo'},
};

var LOG_LEVELS=[
  {level:'ERROR',code:50,ja:'サービス影響あり・即時対応要',en:'Service impact, immediate action required'},
  {level:'WARN', code:40,ja:'注意が必要・SLA影響前に対処',en:'Needs attention before SLA impact'},
  {level:'INFO', code:30,ja:'正常業務フロー・監査証跡',en:'Normal business flow, audit trail'},
  {level:'DEBUG',code:20,ja:'開発・デバッグ用（本番無効化）',en:'Dev/debug only (disabled in prod)'},
  {level:'TRACE',code:10,ja:'詳細トレース（開発環境のみ）',en:'Detailed trace (dev env only)'},
];

var RED_METRICS=[
  {name:'Rate',ja:'リクエストレート',formula:'http_requests_total / time_window',alert:'Spike >3x baseline',unit:'req/s'},
  {name:'Errors',ja:'エラーレート',formula:'http_requests_errors_total / http_requests_total',alert:'>1% for 5min',unit:'%'},
  {name:'Duration',ja:'レイテンシ (P95)',formula:'histogram_quantile(0.95, http_request_duration_seconds)',alert:'P95 >500ms',unit:'ms'},
];

var USE_METRICS=[
  {name:'Utilization',ja:'CPU使用率',formula:'node_cpu_seconds_total (irate)',alert:'>85% for 10min',unit:'%'},
  {name:'Saturation',ja:'飽和度',formula:'node_load1 / CPU cores',alert:'>2.0 for 5min',unit:'ratio'},
  {name:'Errors',ja:'インフラエラー',formula:'node_disk_io_error_total, net errors',alert:'>0 for 1min',unit:'count'},
];

function _obsBackend(a){
  var be=a.backend||'';
  if(/Python|FastAPI|Django/i.test(be))return 'python';
  if(/Spring|Java/i.test(be))return 'java';
  if(/Supabase/i.test(be))return 'supabase';
  if(/Firebase/i.test(be))return 'firebase';
  return 'node';
}
function _obsDB(a){
  var db=a.database||'';
  if(/MongoDB/i.test(db))return 'mongo';
  if(/MySQL/i.test(db))return 'mysql';
  if(/SQLite/i.test(db))return 'sqlite';
  return 'postgres';
}
function _obsTarget(a){
  var dep=a.deploy||'';
  if(/Vercel/i.test(dep))return 'vercel';
  if(/Railway/i.test(dep))return 'railway';
  if(/AWS|ECS|Lambda/i.test(dep))return 'aws';
  if(/Cloudflare/i.test(dep))return 'cloudflare';
  if(/Firebase/i.test(dep))return 'firebase';
  if(/Supabase/i.test(dep))return 'supabase';
  return 'default';
}

function genPillar26_Observability(a,pn){
  gen103(a,pn);gen104(a,pn);gen105(a,pn);gen106(a,pn);
  const _aiAuto=a.ai_auto||'';
  if(_aiAuto&&!/なし|none/i.test(_aiAuto))gen106_2(a,pn);
}

function gen103(a,pn){
  const G=S.genLang==='ja';
  const be=_obsBackend(a);
  const dep=_obsTarget(a);
  const stack=OTEL_STACK[dep]||OTEL_STACK.default;
  const isBaaS=be==='supabase'||be==='firebase';
  const isPy=be==='python';
  const exporterLabel=isPy?'opentelemetry-sdk (Python / pip)':stack.exporter;
  let doc='# '+pn+' — '+(G?'オブザーバビリティアーキテクチャ':'Observability Architecture')+'\n';
  doc+='> '+(G?'ログ・メトリクス・分散トレーシング の3本柱による可観測性設計':'Three-pillar observability: Logs · Metrics · Distributed Tracing')+'\n\n';

  doc+='## '+(G?'オブザーバビリティの3本柱':'The Three Pillars of Observability')+'\n\n';
  doc+='| '+(G?'柱':'Pillar')+' | '+(G?'目的':'Purpose')+' | '+(G?'主要ツール':'Primary Tools')+' | '+(G?'保持期間':'Retention')+'|\n';
  doc+='|------|------|------|------|\n';
  doc+='| **'+(G?'ログ':'Logs')+'** | '+(G?'イベント詳細・エラー内容':'Event details, error context')+' | Pino / Winston / structlog | 30-90d |\n';
  doc+='| **'+(G?'メトリクス':'Metrics')+'** | '+(G?'時系列数値・SLO追跡':'Time-series numbers, SLO tracking')+' | Prometheus / prom-client | 1-13mo |\n';
  doc+='| **'+(G?'トレース':'Traces')+'** | '+(G?'リクエスト追跡・ボトルネック特定':'Request tracing, bottleneck identification')+' | OpenTelemetry + Tempo | 7-30d |\n\n';

  doc+='## '+(G?'オブザーバビリティパイプライン':'Observability Pipeline')+'\n\n';
  doc+='```mermaid\nflowchart LR\n';
  doc+='  subgraph "'+(G?'アプリケーション':'Application')+'"\n';
  doc+='    APP["'+(G?'アプリ':'App')+'"]\n';
  doc+='    SDK["OTel SDK"]\n';
  doc+='    APP-->SDK\n';
  doc+='  end\n';
  doc+='  subgraph "'+(G?'コレクター':'Collector')+'"\n';
  doc+='    COL["'+stack.collector+'"]\n';
  doc+='  end\n';
  doc+='  subgraph "'+(G?'バックエンド':'Backend')+'"\n';
  doc+='    BK["'+stack.backend+'"]\n';
  doc+='  end\n';
  doc+='  SDK-->COL-->BK\n';
  doc+='```\n\n';

  doc+='## '+(G?'デプロイ環境別ツール選定 ('+dep+')':'Tool Selection by Deploy Target ('+dep+')')+'\n\n';
  doc+='| '+(G?'コンポーネント':'Component')+' | '+(G?'選定':'Selection')+'|\n';
  doc+='|------|------|\n';
  doc+='| OTel Collector | `'+stack.collector+'` |\n';
  doc+='| Exporter | `'+exporterLabel+'` |\n';
  doc+='| Backend | '+stack.backend+' |\n';
  if(isBaaS){
    var baasStack=OTEL_STACK[be]||OTEL_STACK.supabase;
    doc+='| '+(G?'アプリログ (BaaS)':'App Logs (BaaS)')+' | `'+baasStack.collector+'` |\n';
    doc+='| '+(G?'サーバーサイドExporter':'Server-side Exporter')+' | `'+baasStack.exporter+'` |\n';
    doc+='| '+(G?'ログバックエンド':'Log Backend')+' | '+baasStack.backend+' |\n';
  }
  doc+='\n';

  if(isBaaS){
    doc+='### '+(G?'BaaS環境の注意点':'BaaS Environment Notes')+'\n';
    doc+=G
      ?'BaaS（'+a.backend+'）はサーバーサイドログが制限されます。クライアントサイドでは `console.error` を構造化し、サーバーFunction内でのみ `pino` を使用してください。\n\n'
      :'BaaS ('+a.backend+') limits server-side logging. Structure `console.error` on the client; use `pino` only inside server Functions.\n\n';
  }

  doc+='## '+(G?'サービスレベル目標 (SLO) — 可観測性最小要件':'SLO Minimum Observability Requirements')+'\n\n';
  doc+='```yaml\n';
  doc+='slos:\n';
  doc+='  availability:\n';
  doc+='    target: 99.9%\n';
  doc+='    window: 30d\n';
  doc+='    measurement: "1 - (error_requests / total_requests)"\n';
  doc+='  latency_p95:\n';
  doc+='    target: 500ms\n';
  doc+='    window: 7d\n';
  doc+='    measurement: "histogram_quantile(0.95, http_request_duration_seconds)"\n';
  doc+='  error_budget:\n';
  doc+='    burn_rate_alert: 14.4  # 1h window consumes 14.4x normal budget\n';
  doc+='```\n\n';

  doc+='## '+(G?'導入ロードマップ':'Implementation Roadmap')+'\n\n';
  doc+=(G?'1. **Week 1**: 構造化ログ導入 (JSON format + trace-id)\n':'1. **Week 1**: Structured logging (JSON format + trace-id)\n');
  doc+=(G?'2. **Week 2**: メトリクス収集 (prom-client RED/USE)\n':'2. **Week 2**: Metrics collection (prom-client RED/USE)\n');
  doc+=(G?'3. **Week 3**: 分散トレーシング (OpenTelemetry auto-instrumentation)\n':'3. **Week 3**: Distributed tracing (OpenTelemetry auto-instrumentation)\n');
  doc+=(G?'4. **Week 4**: ダッシュボード & アラートルール (Grafana as-code)\n\n':'4. **Week 4**: Dashboard & alert rules (Grafana as-code)\n\n');

  S.files['docs/103_observability_architecture.md']=doc;
}

function gen104(a,pn){
  const G=S.genLang==='ja';
  const be=_obsBackend(a);
  const isBaaS=be==='supabase'||be==='firebase';
  const isPy=be==='python';
  const isJava=be==='java';
  const orm=a.orm||'';
  const hasPrisma=/Prisma/i.test(orm);
  const hasSQLAlchemy=/SQLAlchemy/i.test(orm);
  let doc='# '+pn+' — '+(G?'構造化ログ実装ガイド':'Structured Logging Implementation Guide')+'\n';
  doc+='> '+(G?'JSON形式・ログレベル設計・トレースID相関・センシティブデータマスキング':'JSON format · Log level design · Trace ID correlation · Sensitive data masking')+'\n\n';

  doc+='## '+(G?'ログレベル設計':'Log Level Design')+'\n\n';
  doc+='| Level | Code | '+(G?'用途':'Use Case')+' | '+(G?'本番出力':'Prod Output')+'|\n';
  doc+='|-------|------|------|------|\n';
  LOG_LEVELS.forEach(function(l){
    doc+='| **'+l.level+'** | '+l.code+' | '+(G?l.ja:l.en)+' | '+(l.code>=30?'Yes':'No')+' |\n';
  });
  doc+='\n';

  if(isPy){
    doc+='## '+(G?'Python structlog セットアップ':'Python structlog Setup')+'\n\n';
    doc+='```python\n';
    doc+='import structlog\nimport logging\n\n';
    doc+='# '+(G?'センシティブデータマスキング (パスワード等を [REDACTED] に置換)':'Sensitive data masking (replace passwords etc. with [REDACTED])')+'\n';
    doc+='def mask_sensitive(_, __, event_dict):\n';
    doc+="    for key in ('password', 'token', 'secret', 'authorization'):\n";
    doc+='        if key in event_dict:\n';
    doc+="            event_dict[key] = '[REDACTED]'\n";
    doc+='    return event_dict\n\n';
    doc+='structlog.configure(\n';
    doc+='    processors=[\n';
    doc+='        structlog.contextvars.merge_contextvars,\n';
    doc+='        mask_sensitive,\n';
    doc+='        structlog.processors.add_log_level,\n';
    doc+='        structlog.processors.TimeStamper(fmt="iso"),\n';
    doc+='        structlog.processors.JSONRenderer(),\n';
    doc+='    ],\n';
    doc+='    wrapper_class=structlog.make_filtering_bound_logger(logging.INFO),\n';
    doc+=')\n\n';
    doc+='log = structlog.get_logger()\n\n';
    doc+='# '+(G?'トレースコンテキスト付きログ':'Log with trace context')+'\n';
    doc+='log.info("user_login",\n';
    doc+='    user_id=user.id,\n';
    doc+='    trace_id=request.headers.get("traceparent"),\n';
    doc+='    duration_ms=elapsed,\n';
    doc+=')\n';
    doc+='```\n\n';
    if(hasSQLAlchemy){
      doc+='### SQLAlchemy '+(G?'クエリログ (スロークエリ検出)':'Query Logging (Slow Query Detection)')+'\n\n';
      doc+='```python\n';
      doc+='from sqlalchemy import event\nfrom time import perf_counter\nimport logging\n\n';
      doc+='logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)\n';
      doc+='# '+(G?'開発時のみ echo=True。本番では必ず False':'echo=True for dev only; always False in prod')+'\n';
      doc+='engine = create_engine(DATABASE_URL, echo=False)\n\n';
      doc+='@event.listens_for(engine, "before_cursor_execute")\n';
      doc+='def _before(conn, cursor, statement, params, context, executemany):\n';
      doc+='    conn.info["query_start"] = perf_counter()\n\n';
      doc+='@event.listens_for(engine, "after_cursor_execute")\n';
      doc+='def _after(conn, cursor, statement, params, context, executemany):\n';
      doc+='    elapsed_ms = (perf_counter() - conn.info.pop("query_start")) * 1000\n';
      doc+='    if elapsed_ms > 100:\n';
      doc+="        log.warn('slow_query', query=statement, duration_ms=round(elapsed_ms, 2))\n";
      doc+='```\n\n';
    }
  } else if(isJava){
    doc+='## '+(G?'Java SLF4J + Logback JSON セットアップ':'Java SLF4J + Logback JSON Setup')+'\n\n';
    doc+='```xml\n';
    doc+='<!-- build.gradle.kts / pom.xml -->\n';
    doc+='<!-- implementation("net.logstash.logback:logstash-logback-encoder:7.4") -->\n\n';
    doc+='<!-- logback-spring.xml -->\n';
    doc+='<appender name="JSON" class="ch.qos.logback.core.ConsoleAppender">\n';
    doc+='  <encoder class="net.logstash.logback.encoder.LogstashEncoder">\n';
    doc+='    <!-- REDACTED: mask sensitive fields -->\n';
    doc+='    <maskPattern>(?&lt;=password=)[^&amp;]+</maskPattern>\n';
    doc+='    <maskPattern>(?&lt;=token=)[^&amp;]+</maskPattern>\n';
    doc+='  </encoder>\n';
    doc+='</appender>\n';
    doc+='<root level="INFO"><appender-ref ref="JSON" /></root>\n';
    doc+='```\n\n';
    doc+='```java\n';
    doc+='import org.slf4j.Logger;\n';
    doc+='import org.slf4j.LoggerFactory;\n';
    doc+='import org.slf4j.MDC;\n\n';
    doc+='private static final Logger log = LoggerFactory.getLogger('+(pn||'App')+'Service.class);\n\n';
    doc+='// '+(G?'MDCでトレースID・ユーザーIDを全ログに付与':'Propagate trace_id + user_id to all logs via MDC')+'\n';
    doc+='MDC.put("trace_id", request.getHeader("traceparent"));\n';
    doc+='MDC.put("user_id", userId);\n';
    doc+='try {\n';
    doc+='    log.info("request_start");\n';
    doc+='    log.warn("slow_query detected — duration_ms={}", elapsedMs);\n';
    doc+='} finally {\n';
    doc+='    MDC.clear();\n';
    doc+='}\n';
    doc+='```\n\n';
  } else if(!isBaaS){
    doc+='## '+(G?'Node.js Pino セットアップ':'Node.js Pino Setup')+'\n\n';
    doc+='```bash\nnpm install pino pino-pretty\n```\n\n';
    doc+='```typescript\n';
    doc+="import pino from 'pino';\n\n";
    doc+='const logger = pino({\n';
    doc+="  level: process.env.LOG_LEVEL || 'info',\n";
    doc+="  base: { service: '"+pn+"', env: process.env.NODE_ENV },\n";
    doc+='  timestamp: pino.stdTimeFunctions.isoTime,\n';
    doc+='  redact: {\n';
    doc+="    paths: ['*.password', '*.token', '*.secret', 'req.headers.authorization'],\n";
    doc+="    censor: '[REDACTED]',\n";
    doc+='  },\n';
    doc+='});\n\n';
    doc+='// '+(G?'トレース相関付きログ':'Log with trace correlation')+'\n';
    doc+="logger.info({ trace_id: req.headers['x-trace-id'], user_id: session.userId }, 'request_start');\n";
    doc+="logger.error({ err, trace_id, duration_ms }, 'operation_failed');\n";
    doc+='```\n\n';
    var hasDrizzle=/Drizzle/i.test(orm);
    var hasTypeORM=/TypeORM/i.test(orm);
    var hasKysely=/Kysely/i.test(orm);
    if(hasPrisma){
      doc+='### Prisma '+(G?'クエリログ (スロークエリ検出)':'Query Logging (Slow Query Detection)')+'\n\n';
      doc+='```typescript\n';
      doc+='const prisma = new PrismaClient({\n';
      doc+='  log: [\n';
      doc+="    { level: 'query', emit: 'event' },\n";
      doc+="    { level: 'error', emit: 'event' },\n";
      doc+='  ],\n';
      doc+='});\n\n';
      doc+="prisma.$on('query', (e) => {\n";
      doc+='  if (e.duration > 100) {\n';
      doc+="    logger.warn({ query: e.query, duration_ms: e.duration }, 'slow_query');\n";
      doc+='  }\n';
      doc+='});\n';
      doc+='```\n\n';
    }
    if(hasTypeORM){
      doc+='### TypeORM '+(G?'クエリログ (スロークエリ検出)':'Query Logging (Slow Query Detection)')+'\n\n';
      doc+='```typescript\n';
      doc+="import { DataSource } from 'typeorm';\n\n";
      doc+='const AppDataSource = new DataSource({\n';
      doc+="  type: 'postgres',\n";
      doc+='  // ...\n';
      doc+='  maxQueryExecutionTime: 100, // '+(G?'100ms超のクエリをスロークエリとして記録':'Log queries exceeding 100ms as slow')+'\n';
      doc+='  logger: {\n';
      doc+='    logQuery(query: string, parameters?: unknown[]) {\n';
      doc+="      logger.debug({ query, parameters }, 'db_query');\n";
      doc+='    },\n';
      doc+='    logQueryError(error: string | Error, query: string) {\n';
      doc+="      logger.error({ error, query }, 'db_query_error');\n";
      doc+='    },\n';
      doc+='    logQuerySlow(time: number, query: string, parameters?: unknown[]) {\n';
      doc+="      logger.warn({ duration_ms: time, query }, 'slow_query');\n";
      doc+='    },\n';
      doc+='    logSchemaBuild(_message: string) {},\n';
      doc+='    logMigration(_message: string) {},\n';
      doc+='    log(_level: string, _message: unknown) {},\n';
      doc+='  },\n';
      doc+='});\n';
      doc+='```\n\n';
    }
    if(hasDrizzle){
      doc+='### Drizzle '+(G?'クエリログ (カスタムロガー)':'Query Logging (Custom Logger)')+'\n\n';
      doc+='```typescript\n';
      doc+="import { drizzle } from 'drizzle-orm/node-postgres';\n\n";
      doc+='const db = drizzle(client, {\n';
      doc+='  logger: {\n';
      doc+='    logQuery(query: string, params: unknown[]) {\n';
      doc+="      logger.debug({ query, params }, 'db_query');\n";
      doc+='    },\n';
      doc+='  },\n';
      doc+='});\n\n';
      doc+='// '+(G?'本番ではDEBUG無効。スロークエリはPG側で検出:':'In prod, DEBUG is off. Detect slow queries server-side:')+'\n';
      doc+="// ALTER SYSTEM SET log_min_duration_statement = '100';\n";
      doc+='```\n\n';
    }
    if(hasKysely){
      doc+='### Kysely '+(G?'クエリログ (log コールバック)':'Query Logging (log callback)')+'\n\n';
      doc+='```typescript\n';
      doc+="import { Kysely, PostgresDialect } from 'kysely';\n\n";
      doc+='const db = new Kysely<Database>({\n';
      doc+='  dialect: new PostgresDialect({ pool }),\n';
      doc+='  log: (event) => {\n';
      doc+="    if (event.level === 'error') {\n";
      doc+="      logger.error({ query: event.query.sql, error: event.error }, 'db_query_error');\n";
      doc+='    } else if (event.queryDurationMillis > 100) {\n';
      doc+="      logger.warn({ query: event.query.sql, duration_ms: event.queryDurationMillis }, 'slow_query');\n";
      doc+='    }\n';
      doc+='  },\n';
      doc+='});\n';
      doc+='```\n\n';
    }
  } else {
    doc+='## '+(G?'BaaS環境のクライアント構造化ログ':'BaaS Environment Client Structured Logging')+'\n\n';
    doc+='```typescript\n';
    doc+='const log = {\n';
    doc+='  info: (msg: string, ctx: Record<string,unknown>) =>\n';
    doc+='    console.info(JSON.stringify({ level: \'info\', msg, ...ctx, ts: Date.now() })),\n';
    doc+='  error: (msg: string, err: unknown, ctx?: Record<string,unknown>) =>\n';
    doc+='    console.error(JSON.stringify({ level: \'error\', msg, err: String(err), ...ctx, ts: Date.now() })),\n';
    doc+='};\n';
    doc+='```\n\n';
  }

  doc+='## '+(G?'JSON ログフォーマット標準':'Standard JSON Log Format')+'\n\n';
  doc+='```json\n';
  doc+='{\n';
  doc+='  "level": "info",\n';
  doc+='  "msg": "user_login",\n';
  doc+='  "service": "'+pn+'",\n';
  doc+='  "time": "2025-01-15T10:30:00.000Z",\n';
  doc+='  "trace_id": "4bf92f3577b34da6a3ce929d0e0e4736",\n';
  doc+='  "span_id": "00f067aa0ba902b7",\n';
  doc+='  "user_id": "usr_123",\n';
  doc+='  "duration_ms": 45,\n';
  doc+='  "env": "production"\n';
  doc+='}\n';
  doc+='```\n\n';

  doc+='## '+(G?'センシティブデータマスキング':'Sensitive Data Masking')+'\n\n';
  doc+='```typescript\n';
  doc+='// '+(G?'Pino redact 設定に追加するマスキングパス':'Masking paths to add to pino redact config')+'\n';
  doc+='const SENSITIVE_PATHS = [\n';
  doc+="  '*.password', '*.token', '*.secret', '*.apiKey',\n";
  doc+="  '*.creditCard', '*.ssn', '*.dob',\n";
  doc+="  'req.headers.authorization', 'req.headers.cookie',\n";
  doc+='];\n\n';
  doc+='// '+(G?'メールアドレスの部分マスク':'Email partial masking')+'\n';
  doc+='function maskEmail(email: string): string {\n';
  doc+="  const [, domain] = email.split('@');\n";
  doc+="  return '***@' + domain;\n";
  doc+='}\n';
  doc+='```\n\n';

  doc+='## '+(G?'ログ出力先 (本番)':'Log Destination (Production)')+'\n\n';
  if(be==='supabase'){
    doc+=G?'Supabase Dashboard → Logs → Edge Functions でリアルタイム確認。\n\n':'Check in Supabase Dashboard → Logs → Edge Functions.\n\n';
  } else if(be==='firebase'){
    doc+=G?'Firebase Console → Functions → Logs (Cloud Logging) で確認。\n\n':'Check in Firebase Console → Functions → Logs (Cloud Logging).\n\n';
  } else {
    doc+='```bash\n';
    doc+='# '+(G?'Grafana Alloy経由でLokiに転送':'Ship logs to Loki via Grafana Alloy')+'\n';
    doc+='# stdout → Grafana Alloy agent → Loki\n';
    doc+='NODE_ENV=production LOG_LEVEL=info node server.js\n';
    doc+='```\n\n';
  }

  S.files['docs/104_structured_logging.md']=doc;
}

function gen105(a,pn){
  const G=S.genLang==='ja';
  const be=_obsBackend(a);
  const dep=_obsTarget(a);
  const isPy=be==='python';
  const isBaaS=be==='supabase'||be==='firebase';
  const domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):null;
  let doc='# '+pn+' — '+(G?'メトリクス & アラート設計':'Metrics & Alerting Design')+'\n';
  doc+='> '+(G?'RED/USEメソッド・SLI/SLO・エラーバジェット・アラートルール as Code':'RED/USE method · SLI/SLO · Error budget · Alert rules as code')+'\n\n';

  doc+='## '+(G?'REDメソッド (サービスメトリクス)':'RED Method (Service Metrics)')+'\n\n';
  doc+='| '+(G?'メトリクス':'Metric')+' | '+(G?'PromQLクエリ例':'PromQL Query')+' | '+(G?'アラート条件':'Alert Condition')+'|\n';
  doc+='|------|------|------|\n';
  RED_METRICS.forEach(function(m){
    doc+='| **'+m.name+' ('+m.unit+')**'+(G?' — '+m.ja:'')+' | `'+m.formula+'` | `'+m.alert+'` |\n';
  });
  doc+='\n';

  doc+='## '+(G?'USEメソッド (インフラメトリクス)':'USE Method (Infrastructure Metrics)')+'\n\n';
  doc+='| '+(G?'メトリクス':'Metric')+' | '+(G?'PromQLクエリ例':'PromQL Query')+' | '+(G?'アラート条件':'Alert Condition')+'|\n';
  doc+='|------|------|------|\n';
  USE_METRICS.forEach(function(m){
    doc+='| **'+m.name+' ('+m.unit+')**'+(G?' — '+m.ja:'')+' | `'+m.formula+'` | `'+m.alert+'` |\n';
  });
  doc+='\n';

  if(!isBaaS){
    doc+='## '+(G?'prom-client カスタムメトリクス実装':'prom-client Custom Metrics Implementation')+'\n\n';
    if(isPy){
      doc+='```bash\npip install prometheus-client\n```\n\n';
      doc+='```python\n';
      doc+='from prometheus_client import Counter, Histogram, start_http_server\n\n';
      doc+='REQUEST_COUNT = Counter(\n';
      doc+="    'http_requests_total',\n";
      doc+="    'Total HTTP requests',\n";
      doc+="    ['method', 'endpoint', 'status']\n";
      doc+=')\n\n';
      doc+='REQUEST_LATENCY = Histogram(\n';
      doc+="    'http_request_duration_seconds',\n";
      doc+="    'HTTP request latency',\n";
      doc+="    ['method', 'endpoint'],\n";
      doc+='    buckets=[0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5]\n';
      doc+=')\n\n';
      doc+='# '+(G?'メトリクスエンドポイント (port 9090)':'Expose metrics endpoint (port 9090)')+'\n';
      doc+='start_http_server(9090)\n';
      doc+='```\n\n';
    } else {
      doc+='```bash\nnpm install prom-client\n```\n\n';
      doc+='```typescript\n';
      doc+="import { Counter, Histogram, Registry } from 'prom-client';\n\n";
      doc+='const register = new Registry();\n\n';
      doc+='export const httpRequestsTotal = new Counter({\n';
      doc+="  name: 'http_requests_total',\n";
      doc+="  help: 'Total number of HTTP requests',\n";
      doc+="  labelNames: ['method', 'route', 'status'] as const,\n";
      doc+='  registers: [register],\n';
      doc+='});\n\n';
      doc+='export const httpDuration = new Histogram({\n';
      doc+="  name: 'http_request_duration_seconds',\n";
      doc+="  help: 'HTTP request duration in seconds',\n";
      doc+="  labelNames: ['method', 'route'] as const,\n";
      doc+='  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5],\n';
      doc+='  registers: [register],\n';
      doc+='});\n\n';
      doc+='// '+(G?'Expressミドルウェア':'Express middleware')+'\n';
      doc+='app.use((req, res, next) => {\n';
      doc+='  const end = httpDuration.startTimer({ method: req.method, route: req.path });\n';
      doc+="  res.on('finish', () => {\n";
      doc+='    httpRequestsTotal.inc({ method: req.method, route: req.path, status: res.statusCode });\n';
      doc+='    end();\n';
      doc+='  });\n';
      doc+='  next();\n';
      doc+='});\n```\n\n';
    }
  }

  var domainMetrics={
    fintech:[{name:'txn_success_rate',ja:'決済成功率',threshold:'>99.5%'},{name:'fraud_detected_total',ja:'不正検知数',threshold:'Alert on any spike'}],
    health:[{name:'appointment_completion_rate',ja:'予約完了率',threshold:'>95%'},{name:'pii_access_audit_total',ja:'PII アクセス監査',threshold:'Alert on anomaly'}],
    ec:[{name:'cart_abandonment_rate',ja:'カート放棄率',threshold:'<70%'},{name:'checkout_success_rate',ja:'チェックアウト成功率',threshold:'>98%'}],
    saas:[{name:'active_tenants_total',ja:'アクティブテナント数',threshold:'Monitor growth'},{name:'api_quota_used_ratio',ja:'APIクォータ使用率',threshold:'Alert >80%'}],
    education:[{name:'course_completion_rate',ja:'コース完了率',threshold:'>60%'},{name:'active_learners_total',ja:'アクティブ学習者数',threshold:'Monitor growth'}],
    logistics:[{name:'delivery_on_time_rate',ja:'定時配送率',threshold:'>95%'},{name:'route_optimization_savings',ja:'ルート最適化削減率',threshold:'Monitor'}],
    analytics:[{name:'pipeline_success_rate',ja:'パイプライン成功率',threshold:'>99%'},{name:'data_freshness_seconds',ja:'データ鮮度（秒）',threshold:'Alert >300s'}],
    manufacturing:[{name:'oee_ratio',ja:'設備総合効率 (OEE)',threshold:'>85%'},{name:'defect_rate',ja:'不良率',threshold:'<1%'}],
    iot:[{name:'device_heartbeat_total',ja:'デバイス死活監視',threshold:'Alert on missing 2+ beats'},{name:'sensor_error_rate',ja:'センサーエラー率',threshold:'<0.1%'}],
    booking:[{name:'booking_conversion_rate',ja:'予約コンバージョン率',threshold:'>15%'},{name:'cancellation_rate',ja:'キャンセル率',threshold:'<20%'}],
    hr:[{name:'turnover_rate',ja:'離職率',threshold:'<15%'},{name:'hiring_lead_days',ja:'採用リードタイム（日）',threshold:'<30d'}],
    realestate:[{name:'deal_close_rate',ja:'物件成約率',threshold:'>10%'},{name:'avg_listing_days',ja:'平均掲載日数',threshold:'<60d'}],
    insurance:[{name:'claim_processing_days',ja:'請求処理日数',threshold:'<5d'},{name:'loss_ratio',ja:'損害率',threshold:'<70%'}],
    energy:[{name:'plant_uptime',ja:'設備稼働率',threshold:'>99%'},{name:'energy_efficiency',ja:'エネルギー効率',threshold:'Monitor'}],
    government:[{name:'application_completion_rate',ja:'申請処理完了率',threshold:'>95%'},{name:'avg_processing_days',ja:'平均処理日数',threshold:'<10d'}],
    travel:[{name:'booking_completion_rate',ja:'予約完了率',threshold:'>20%'},{name:'cancellation_rate',ja:'キャンセル率',threshold:'<15%'}],
    gamify:[{name:'concurrent_users',ja:'同時接続数',threshold:'Monitor'},{name:'matchmaking_p95',ja:'マッチング待ち時間 P95',threshold:'<30s'}],
    media:[{name:'cdn_latency_p95',ja:'コンテンツ配信レイテンシ P95',threshold:'<200ms'},{name:'buffering_rate',ja:'バッファリング率',threshold:'<1%'}],
    legal:[{name:'document_completion_rate',ja:'文書処理完了率',threshold:'>98%'},{name:'review_turnaround_hours',ja:'レビュー平均時間（時）',threshold:'<48h'}],
    automation:[{name:'workflow_success_rate',ja:'ワークフロー成功率',threshold:'>99%'},{name:'avg_execution_seconds',ja:'平均実行時間（秒）',threshold:'<30s'}],
    agriculture:[{name:'crop_yield_rate',ja:'作物収穫率',threshold:'Monitor'},{name:'irrigation_efficiency',ja:'灌漑効率',threshold:'Monitor'}],
    ai:[{name:'model_accuracy',ja:'モデル精度',threshold:'>95%'},{name:'inference_latency_p95',ja:'推論レイテンシP95',threshold:'<200ms'}],
    collab:[{name:'concurrent_editors',ja:'同時編集者数',threshold:'Monitor'},{name:'sync_conflict_rate',ja:'同期コンフリクト率',threshold:'<0.1%'}],
    community:[{name:'daily_active_users',ja:'DAU',threshold:'Monitor growth'},{name:'content_report_rate',ja:'コンテンツ報告率',threshold:'<0.5%'}],
    content:[{name:'publish_success_rate',ja:'公開成功率',threshold:'>99%'},{name:'avg_time_to_publish',ja:'平均公開時間（秒）',threshold:'<5s'}],
    creator:[{name:'creator_retention_rate',ja:'クリエイター継続率',threshold:'>70%'},{name:'payout_success_rate',ja:'支払成功率',threshold:'>99.5%'}],
    devtool:[{name:'api_response_p95',ja:'APIレスポンスP95',threshold:'<100ms'},{name:'sdk_error_rate',ja:'SDKエラー率',threshold:'<0.1%'}],
    event:[{name:'registration_completion_rate',ja:'参加登録完了率',threshold:'>80%'},{name:'checkin_success_rate',ja:'チェックイン成功率',threshold:'>99%'}],
    marketplace:[{name:'transaction_success_rate',ja:'取引成功率',threshold:'>99%'},{name:'seller_response_time',ja:'出品者応答時間（時）',threshold:'<24h'}],
    newsletter:[{name:'delivery_rate',ja:'配信到達率',threshold:'>99%'},{name:'open_rate',ja:'開封率',threshold:'>20%'}],
    portfolio:[{name:'page_load_p95',ja:'ページ読込P95',threshold:'<1s'},{name:'uptime',ja:'稼働率',threshold:'>99.9%'}],
    tool:[{name:'task_completion_rate',ja:'タスク完了率',threshold:'>95%'},{name:'error_rate',ja:'エラー率',threshold:'<1%'}],
  };
  var dm=domainMetrics[domain]||(domainMetrics.saas);
  doc+='## '+(G?'ドメイン固有ビジネスメトリクス'+(domain?' ('+domain+')':''):'Domain Business Metrics'+(domain?' ('+domain+')':''))+'\n\n';
  doc+='| '+(G?'メトリクス名':'Metric')+' | '+(G?'説明':'Description')+' | '+(G?'閾値':'Threshold')+'|\n';
  doc+='|------|------|------|\n';
  dm.forEach(function(m){
    doc+='| `'+m.name+'` | '+(G?m.ja:m.name.replace(/_/g,' '))+' | '+m.threshold+' |\n';
  });
  doc+='\n';

  doc+='## '+(G?'SLI/SLO定義 (OpenSLO形式)':'SLI/SLO Definitions (OpenSLO format)')+'\n\n';
  doc+='```yaml\n';
  doc+='slos:\n';
  doc+='  - name: availability\n';
  doc+='    objective: 99.9\n';
  doc+='    sli:\n';
  doc+='      raw:\n';
  doc+='        error_ratio_query: |\n';
  doc+='          sum(rate(http_requests_total{status=~"5.."}[5m]))\n';
  doc+='          / sum(rate(http_requests_total[5m]))\n';
  doc+='  - name: latency_p95\n';
  doc+='    objective: 99.0\n';
  doc+='    sli:\n';
  doc+='      raw:\n';
  doc+='        error_ratio_query: |\n';
  doc+='          histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5\n';
  doc+='```\n\n';

  doc+='## '+(G?'アラートルール (Prometheus Alertmanager)':'Alert Rules (Prometheus Alertmanager)')+'\n\n';
  doc+='```yaml\n';
  doc+='groups:\n';
  doc+='  - name: '+pn.replace(/\s/g,'_')+'_slo\n';
  doc+='    rules:\n';
  doc+='      - alert: HighErrorRate\n';
  doc+='        expr: |\n';
  doc+='          sum(rate(http_requests_total{status=~"5.."}[5m]))\n';
  doc+='          / sum(rate(http_requests_total[5m])) > 0.01\n';
  doc+='        for: 5m\n';
  doc+='        labels:\n';
  doc+='          severity: critical\n';
  doc+='        annotations:\n';
  doc+='          summary: "Error rate > 1% for 5 minutes"\n';
  doc+='      - alert: SlowP95\n';
  doc+='        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.5\n';
  doc+='        for: 5m\n';
  doc+='        labels:\n';
  doc+='          severity: warning\n';
  doc+='        annotations:\n';
  doc+='          summary: "P95 latency > 500ms"\n';
  doc+='```\n\n';

  doc+='## '+(G?'通知設定 (Slack / PagerDuty)':'Notification Setup (Slack / PagerDuty)')+'\n\n';
  doc+='```yaml\n';
  doc+='# alertmanager.yml\n';
  doc+='route:\n';
  doc+='  receiver: slack-critical\n';
  doc+='  routes:\n';
  doc+='    - match: { severity: critical }\n';
  doc+='      receiver: pagerduty-oncall\n';
  doc+='    - match: { severity: warning }\n';
  doc+='      receiver: slack-warnings\n';
  doc+='receivers:\n';
  doc+='  - name: slack-critical\n';
  doc+='    slack_configs:\n';
  doc+="      - channel: '#alerts-critical'\n";
  doc+="        api_url: '${SLACK_WEBHOOK_URL}'\n";
  doc+='  - name: pagerduty-oncall\n';
  doc+='    pagerduty_configs:\n';
  doc+="      - routing_key: '${PAGERDUTY_KEY}'\n";
  doc+='```\n\n';

  S.files['docs/105_metrics_alerting.md']=doc;
}

function gen106(a,pn){
  const G=S.genLang==='ja';
  const be=_obsBackend(a);
  const dep=_obsTarget(a);
  const isPy=be==='python';
  const isJava=be==='java';
  const isBaaS=be==='supabase'||be==='firebase';
  const stack=OTEL_STACK[dep]||OTEL_STACK.default;
  let doc='# '+pn+' — '+(G?'分散トレーシング & ダッシュボード設計':'Distributed Tracing & Dashboard Design')+'\n';
  doc+='> '+(G?'OpenTelemetry SDK自動計装・手動スパン・W3C TraceContext・Grafanaダッシュボード as Code':'OpenTelemetry auto-instrumentation · Manual spans · W3C TraceContext · Grafana dashboard as code')+'\n\n';

  doc+='## '+(G?'OpenTelemetry セットアップ':'OpenTelemetry Setup')+'\n\n';
  if(!isBaaS){
    if(isPy){
      doc+='```bash\n';
      doc+='pip install opentelemetry-sdk opentelemetry-exporter-otlp opentelemetry-instrumentation-fastapi\n';
      doc+='```\n\n';
      doc+='```python\n';
      doc+='# instrumentation.py — load BEFORE app imports\n';
      doc+='from opentelemetry import trace\n';
      doc+='from opentelemetry.sdk.trace import TracerProvider\n';
      doc+='from opentelemetry.sdk.trace.export import BatchSpanProcessor\n';
      doc+='from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter\n';
      doc+='from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor\n\n';
      doc+='provider = TracerProvider()\n';
      doc+='provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(\n';
      doc+='    endpoint="http://otel-collector:4317"\n';
      doc+=')))\n';
      doc+='trace.set_tracer_provider(provider)\n\n';
      doc+='FastAPIInstrumentor.instrument()  # Auto-instruments all routes\n\n';
      doc+='# '+(G?'手動スパン例':'Manual span example')+'\n';
      doc+='tracer = trace.get_tracer("'+pn.replace(/\s/g,'_').toLowerCase()+'")\n\n';
      doc+='async def process_order(order_id: str):\n';
      doc+='    with tracer.start_as_current_span("process_order") as span:\n';
      doc+='        span.set_attribute("order.id", order_id)\n';
      doc+='        span.set_attribute("order.region", "jp")\n';
      doc+='        pass  # business logic here\n';
      doc+='```\n\n';
    } else if(isJava){
      doc+='```bash\n';
      doc+='# '+(G?'Java エージェント方式 — コード変更不要で自動計装':'Java agent approach — zero-code auto-instrumentation')+'\n';
      doc+='wget https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases/latest/download/opentelemetry-javaagent.jar\n';
      doc+='```\n\n';
      doc+='```bash\n';
      doc+='# '+(G?'起動コマンドに -javaagent を追加するだけ':'Add -javaagent to JVM startup args')+'\n';
      doc+='java -javaagent:opentelemetry-javaagent.jar \\\n';
      doc+='  -Dotel.service.name='+pn.replace(/\s/g,'-').toLowerCase()+' \\\n';
      doc+='  -Dotel.exporter.otlp.endpoint=http://otel-collector:4317 \\\n';
      doc+='  -Dotel.traces.sampler=traceidratio \\\n';
      doc+='  -Dotel.traces.sampler.arg=0.1 \\\n';
      doc+='  -jar app.jar\n';
      doc+='```\n\n';
      doc+='```java\n';
      doc+='// '+(G?'手動スパン例 (OpenTelemetry Java API)':'Manual span example (OpenTelemetry Java API)')+'\n';
      doc+='import io.opentelemetry.api.GlobalOpenTelemetry;\n';
      doc+='import io.opentelemetry.api.trace.Tracer;\n\n';
      doc+='private static final Tracer tracer =\n';
      doc+='    GlobalOpenTelemetry.getTracer("'+pn.replace(/\s/g,'-').toLowerCase()+'");\n\n';
      doc+='Span span = tracer.spanBuilder("processOrder").startSpan();\n';
      doc+='try (Scope scope = span.makeCurrent()) {\n';
      doc+='    span.setAttribute("order.id", orderId);\n';
      doc+='    span.setAttribute("order.region", "jp");\n';
      doc+='    // business logic here\n';
      doc+='} finally {\n';
      doc+='    span.end();\n';
      doc+='}\n';
      doc+='```\n\n';
    } else if(dep==='vercel'){
      doc+='```bash\n';
      doc+='npm install @vercel/otel @opentelemetry/api\n';
      doc+='```\n\n';
      doc+='```typescript\n';
      doc+='// instrumentation.ts — '+(G?'Next.js の instrumentationHook で自動ロード':'auto-loaded via Next.js instrumentationHook')+'\n';
      doc+="import { registerOTel } from '@vercel/otel';\n\n";
      doc+='export function register() {\n';
      doc+="  registerOTel({ serviceName: '"+pn.replace(/\s/g,'-').toLowerCase()+"' });\n";
      doc+='}\n';
      doc+='```\n\n';
      doc+='```javascript\n';
      doc+='// next.config.js\n';
      doc+='module.exports = {\n';
      doc+='  experimental: { instrumentationHook: true },\n';
      doc+='};\n';
      doc+='```\n\n';
      doc+='```typescript\n';
      doc+='// '+(G?'手動スパン例':'Manual span example')+'\n';
      doc+="import { trace } from '@opentelemetry/api';\n";
      doc+="const tracer = trace.getTracer('"+pn.replace(/\s/g,'-').toLowerCase()+"');\n\n";
      doc+='async function processOrder(orderId: string) {\n';
      doc+="  return tracer.startActiveSpan('processOrder', async (span) => {\n";
      doc+="    span.setAttribute('order.id', orderId);\n";
      doc+='    try {\n';
      doc+='      // business logic here\n';
      doc+='    } finally {\n';
      doc+='      span.end();\n';
      doc+='    }\n';
      doc+='  });\n';
      doc+='}\n';
      doc+='```\n\n';
    } else if(dep==='cloudflare'){
      doc+='```bash\n';
      doc+='npm install @opentelemetry/api (edge-compatible) @microlabs/otel-cf-workers\n';
      doc+='```\n\n';
      doc+='```typescript\n';
      doc+='// '+(G?'Cloudflare Workers — Node.js SDK は非対応。edge-compatible API を使用':'Cloudflare Workers — Node.js SDK unsupported; use edge-compatible API')+'\n';
      doc+="import { trace, context, propagation } from '@opentelemetry/api';\n";
      doc+="import { instrument } from '@microlabs/otel-cf-workers';\n\n";
      doc+='export default instrument(\n';
      doc+='  { fetch: app.fetch },  // '+(G?'Hono/Workers fetch ハンドラ':'Hono/Workers fetch handler')+'\n';
      doc+='  (env: Env) => ({\n';
      doc+="    exporter: { url: 'https://api.honeycomb.io/v1/traces' },\n";
      doc+="    service: { name: '"+pn.replace(/\s/g,'-').toLowerCase()+"' },\n";
      doc+='  })\n';
      doc+=');\n\n';
      doc+='// '+(G?'手動スパン例 (Edge 環境)':'Manual span example (Edge environment)')+'\n';
      doc+="const tracer = trace.getTracer('"+pn.replace(/\s/g,'-').toLowerCase()+"');\n\n";
      doc+='async function handleRequest(request: Request) {\n';
      doc+="  return tracer.startActiveSpan('handleRequest', async (span) => {\n";
      doc+="    span.setAttribute('http.method', request.method);\n";
      doc+="    span.setAttribute('http.url', request.url);\n";
      doc+='    try {\n';
      doc+='      // business logic here\n';
      doc+='    } finally {\n';
      doc+='      span.end();\n';
      doc+='    }\n';
      doc+='  });\n';
      doc+='}\n';
      doc+='```\n\n';
    } else {
      doc+='```bash\n';
      doc+='npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node \\\n';
      doc+='  @opentelemetry/exporter-otlp-grpc @opentelemetry/api\n';
      doc+='```\n\n';
      doc+='```typescript\n';
      doc+='// instrumentation.ts — load via --require flag\n';
      doc+="import { NodeSDK } from '@opentelemetry/sdk-node';\n";
      doc+="import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';\n";
      doc+="import { OTLPTraceExporter } from '@opentelemetry/exporter-otlp-grpc';\n\n";
      doc+='const sdk = new NodeSDK({\n';
      doc+="  serviceName: '"+pn.replace(/\s/g,'-').toLowerCase()+"',\n";
      doc+="  traceExporter: new OTLPTraceExporter({ url: 'http://otel-collector:4317' }),\n";
      doc+='  instrumentations: [getNodeAutoInstrumentations({\n';
      doc+="    '@opentelemetry/instrumentation-http': { enabled: true },\n";
      doc+="    '@opentelemetry/instrumentation-express': { enabled: true },\n";
      doc+="    '@opentelemetry/instrumentation-pg': { enabled: true },\n";
      doc+='  })],\n';
      doc+='});\n\n';
      doc+='sdk.start();\n\n';
      doc+='// '+(G?'手動スパン例':'Manual span example')+'\n';
      doc+="import { trace } from '@opentelemetry/api';\n";
      doc+="const tracer = trace.getTracer('"+pn.replace(/\s/g,'-').toLowerCase()+"');\n\n";
      doc+='async function processOrder(orderId: string) {\n';
      doc+="  return tracer.startActiveSpan('processOrder', async (span) => {\n";
      doc+="    span.setAttribute('order.id', orderId);\n";
      doc+="    span.setAttribute('order.region', 'jp');\n";
      doc+='    try {\n';
      doc+='      // business logic here\n';
      doc+='    } finally {\n';
      doc+='      span.end();\n';
      doc+='    }\n';
      doc+='  });\n';
      doc+='}\n';
      doc+='```\n\n';
    }
  } else {
    doc+='### '+(G?'BaaS環境のトレーシング':'BaaS Environment Tracing')+'\n\n';
    doc+=G
      ?'BaaS（'+a.backend+'）では完全な分散トレーシングは制限されます。Edge Functions内でOpenTelemetryを使用し、クライアントサイドはVercel Speed Insights / Firebase Performance Monitoringを活用してください。\n\n'
      :'Full distributed tracing is limited in BaaS ('+a.backend+'). Use OpenTelemetry inside Edge Functions; leverage Vercel Speed Insights / Firebase Performance Monitoring on the client.\n\n';
  }

  doc+='## '+(G?'W3C TraceContext 伝播':'W3C TraceContext Propagation')+'\n\n';
  doc+='```typescript\n';
  doc+='// '+(G?'トレースコンテキストはHTTPヘッダで自動伝播:':'Trace context propagated automatically via HTTP headers:')+'\n';
  doc+='// traceparent: 00-{trace-id}-{span-id}-{flags}\n';
  doc+='// tracestate:  vendor-specific state\n\n';
  doc+='// '+(G?'ログ相関用トレースID取得':'Extract trace-id for logging correlation')+'\n';
  doc+="import { context, trace } from '@opentelemetry/api';\n\n";
  doc+='function getTraceId(): string {\n';
  doc+='  const span = trace.getActiveSpan();\n';
  doc+="  return span?.spanContext().traceId ?? '';\n";
  doc+='}\n\n';
  doc+='// '+(G?'構造化ログに埋め込む':'Embed in structured logs')+'\n';
  doc+="logger.info({ trace_id: getTraceId(), user_id }, 'business_event');\n";
  doc+='```\n\n';

  doc+='## '+(G?'サンプリング戦略':'Sampling Strategy')+'\n\n';
  doc+='```typescript\n';
  doc+='// '+(G?'テールサンプリング: エラーと低速リクエストを全保持、正常は10%':'Tail-based sampling: keep all errors + slow requests, sample 10% normal')+'\n';
  doc+="import { ParentBasedSampler, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';\n\n";
  doc+='const sampler = new ParentBasedSampler({\n';
  doc+='  root: new TraceIdRatioBasedSampler(0.1),\n';
  doc+='});\n\n';
  doc+='// '+(G?'OTel Collectorのtail samplingプロセッサ設定:':'OTel Collector tail sampling processor config:')+'\n';
  doc+='//   - type: latency, threshold_ms: 500\n';
  doc+='//   - type: status_code, status_codes: [ERROR]\n';
  doc+='```\n\n';

  doc+='## '+(G?'Grafana ダッシュボード as Code':'Grafana Dashboard as Code')+'\n\n';
  doc+='```json\n';
  doc+='{\n';
  doc+='  "title": "'+pn+' — Service Overview",\n';
  doc+='  "panels": [\n';
  doc+='    {\n';
  doc+='      "title": "Request Rate (RED)",\n';
  doc+='      "type": "timeseries",\n';
  doc+='      "targets": [{ "expr": "sum(rate(http_requests_total[5m]))" }]\n';
  doc+='    },\n';
  doc+='    {\n';
  doc+='      "title": "Error Rate",\n';
  doc+='      "type": "gauge",\n';
  doc+='      "targets": [{ "expr": "sum(rate(http_requests_total{status=~\\"5..\\"}[5m])) / sum(rate(http_requests_total[5m]))" }],\n';
  doc+='      "thresholds": { "steps": [{"value": 0.01, "color": "red"}] }\n';
  doc+='    },\n';
  doc+='    {\n';
  doc+='      "title": "P95 Latency",\n';
  doc+='      "type": "stat",\n';
  doc+='      "targets": [{ "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))" }]\n';
  doc+='    }\n';
  doc+='  ]\n';
  doc+='}\n';
  doc+='```\n\n';

  doc+='## '+(G?'コスト最適化':'Cost Optimization')+'\n\n';
  doc+='| '+(G?'戦略':'Strategy')+' | '+(G?'削減効果':'Saving')+' | '+(G?'実装':'Implementation')+'|\n';
  doc+='|------|------|------|\n';
  doc+='| '+(G?'サンプリング率調整 (10%)':'Sampling rate (10%)')+' | ~90% traces cost | `TraceIdRatioBasedSampler(0.1)` |\n';
  doc+='| '+(G?'ログ保持期間短縮 (30d→7d dev)':'Log retention (30d→7d dev)')+' | ~50-75% log cost | Loki retention config |\n';
  doc+='| '+(G?'メトリクス解像度緩和 (1m→5m)':'Metrics resolution (1m→5m)')+' | ~80% metrics cost | Prometheus scrape_interval |\n';
  doc+='| '+(G?'高カーディナリティラベル排除':'High cardinality label elimination')+' | Varies | Remove user_id from metric labels |\n\n';

  doc+='## '+(G?'運用チェックリスト':'Operations Checklist')+'\n\n';
  doc+=G?'- [ ] OTel Collector ヘルスチェック `/metrics` 疎通確認\n':'- [ ] OTel Collector health check `/metrics` endpoint verified\n';
  doc+=G?'- [ ] ログに機密データが出力されていないか週次レビュー\n':'- [ ] Weekly review: no sensitive data appears in logs\n';
  doc+=G?'- [ ] SLOエラーバジェット消費率を週次でレポート\n':'- [ ] Weekly error budget burn rate report\n';
  doc+=G?'- [ ] Grafanaダッシュボードをコードとして管理 (GitOps)\n':'- [ ] Manage Grafana dashboards as code (GitOps)\n';
  doc+=G?'- [ ] アラート疲れ防止: ページング閾値は月1回以下を目安に\n':'- [ ] Alert fatigue prevention: paging threshold should fire <1/month\n';
  doc+=G?'- [ ] 障害ポストモーテム: 5 Whys + トレースからタイムライン再構築\n\n':'- [ ] Post-incident: 5 Whys + timeline reconstructed from traces\n\n';

  S.files['docs/106_distributed_tracing.md']=doc;
}

/* ── doc106-2: AIランタイム監視ガイド ── */
function gen106_2(a,pn){
  const G=S.genLang==='ja';
  const provider=typeof _aiProvider==='function'?_aiProvider(a):'generic';
  const dep=_obsTarget(a);
  const scale=a.scale||'medium';
  const isLarge=/large|大規模/i.test(scale);
  const isCritical=isLarge||/health|medical|fintech|insurance/i.test(a.purpose||'');
  const aiAuto=a.ai_auto||'';
  const isOrchestrator=/orchestrator|オーケストレーター/i.test(aiAuto);
  const isMultiAgent=/multi.?agent|マルチ.?エージェント/i.test(aiAuto);

  let doc=G?
    '# AIランタイム監視ガイド / AI Runtime Monitoring Guide\n\n':
    '# AI Runtime Monitoring Guide\n\n';

  doc+=G?
    '> AI機能の本番運用における品質・コスト・安全性を継続的に監視するための専用ガイドです。\n> LLMコスト管理、ハルシネーション検出、ガードレール監視のベストプラクティスを提供します。\n\n':
    '> Dedicated guide for continuous quality, cost, and safety monitoring of AI features in production.\n> Best practices for LLM cost management, hallucination detection, and guardrail monitoring.\n\n';

  // §1 AI専用SLI/SLO定義
  doc+='## '+(G?'§1 AI専用SLI/SLO定義':'§1 AI-Specific SLI/SLO Definitions')+'\n\n';
  doc+='| '+(G?'メトリクス':'Metric')+' | SLO ('+(G?'重要':'Critical')+') | SLO ('+(G?'一般':'General')+') | '+(G?'計測方法':'Measurement')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| '+(G?'ハルシネーション率':'Hallucination Rate')+' | '+(isCritical?'≤2%':'≤3%')+' | ≤5% | RAGAS / '+(G?'リファレンス照合':'Reference cross-check')+'|\n';
  doc+='| P95 '+(G?'レイテンシ':'Latency')+' | ≤2000ms | ≤5000ms | OTel histogram |\n';
  doc+='| '+(G?'リクエスト当たりトークン使用量':'Tokens per Request')+' | ≤4096 avg | ≤8192 avg | Provider API |\n';
  doc+='| '+(G?'インタラクション単価':'Cost per Interaction')+' | ≤$0.05 | ≤$0.20 | Token × pricing |\n';
  doc+='| '+(G?'ガードレール発火率':'Guardrail Fire Rate')+' | ≤5% | ≤10% | Custom metric |\n';
  doc+='| '+(G?'モデル可用性':'Model Availability')+' | ≥99.5% | ≥99.0% | Uptime check |\n';
  doc+='| '+(G?'ユーザー満足度':'User Satisfaction')+' | ≥80% 👍 | ≥60% 👍 | Feedback API |\n';
  doc+='| API'+(G?'エラー率':'Error Rate')+' | ≤0.5% | ≤2% | HTTP status |\n\n';

  doc+='```yaml\n';
  doc+='# ai-slos.yaml (OpenSLO format)\n';
  doc+='slos:\n';
  doc+='  - name: ai_hallucination_rate\n';
  doc+='    objective: '+(isCritical?'98.0':'95.0')+'\n';
  doc+='    sli:\n';
  doc+='      raw:\n';
  doc+='        good_events_query: "ai_responses_faithful_total"\n';
  doc+='        total_events_query: "ai_responses_total"\n';
  doc+='  - name: ai_latency_p95\n';
  doc+='    objective: 95.0\n';
  doc+='    sli:\n';
  doc+='      raw:\n';
  doc+='        error_ratio_query: |\n';
  doc+='          histogram_quantile(0.95, rate(ai_request_duration_ms_bucket[5m])) > 2000\n';
  doc+='  - name: ai_cost_per_interaction\n';
  doc+='    objective: 95.0\n';
  doc+='    sli:\n';
  doc+='      raw:\n';
  doc+='        error_ratio_query: "avg(ai_cost_per_request_usd) > 0.05"\n';
  doc+='```\n\n';

  // §2 LLMコスト追跡
  doc+='## '+(G?'§2 LLMコスト追跡ダッシュボード':'§2 LLM Cost Tracking Dashboard')+'\n\n';

  if(provider==='claude'){
    doc+='```typescript\n';
    doc+='// lib/ai/cost-tracker.ts (Claude/Anthropic)\n';
    doc+='const CLAUDE_PRICING = {\n';
    doc+='  \'claude-opus-4-6\':  { input: 0.000015, output: 0.000075 },  // per token\n';
    doc+='  \'claude-sonnet-4-6\': { input: 0.000003, output: 0.000015 },\n';
    doc+='  \'claude-haiku-4-5\': { input: 0.00000025, output: 0.00000125 },\n';
    doc+='};\n\n';
  } else if(provider==='openai'){
    doc+='```typescript\n';
    doc+='// lib/ai/cost-tracker.ts (OpenAI)\n';
    doc+='const OPENAI_PRICING = {\n';
    doc+='  \'gpt-4o\':      { input: 0.0000025, output: 0.00001 },\n';
    doc+='  \'gpt-4o-mini\': { input: 0.00000015, output: 0.0000006 },\n';
    doc+='  \'gpt-4-turbo\': { input: 0.00001, output: 0.00003 },\n';
    doc+='};\n\n';
  } else {
    doc+='```typescript\n';
    doc+='// lib/ai/cost-tracker.ts\n';
    doc+='const AI_PRICING: Record<string, { input: number; output: number }> = {\n';
    doc+='  // Add your LLM provider pricing here (cost per token)\n';
    doc+='  \'default\': { input: 0.000001, output: 0.000002 },\n';
    doc+='};\n\n';
  }

  doc+='// Middleware: intercept all AI calls\n';
  doc+='export function createCostTrackingMiddleware(registry: Registry) {\n';
  doc+='  const tokenCounter = new Counter({\n';
  doc+='    name: \'ai_tokens_total\',\n';
  doc+='    help: \'Total LLM tokens consumed\',\n';
  doc+='    labelNames: [\'model\', \'type\', \'endpoint\'] as const,\n';
  doc+='    registers: [registry],\n';
  doc+='  });\n';
  doc+='  const costGauge = new Gauge({\n';
  doc+='    name: \'ai_cost_usd_total\',\n';
  doc+='    help: \'Cumulative LLM cost in USD\',\n';
  doc+='    labelNames: [\'model\', \'endpoint\'] as const,\n';
  doc+='    registers: [registry],\n';
  doc+='  });\n\n';
  doc+='  return async function trackCost<T>(fn: () => Promise<T & { usage?: { input_tokens: number; output_tokens: number }; model?: string }>) {\n';
  doc+='    const result = await fn();\n';
  doc+='    if (result.usage && result.model) {\n';
  doc+='      const pricing = AI_PRICING[result.model] || AI_PRICING[\'default\'];\n';
  doc+='      const cost = result.usage.input_tokens * pricing.input +\n';
  doc+='                   result.usage.output_tokens * pricing.output;\n';
  doc+='      tokenCounter.inc({ model: result.model, type: \'input\', endpoint: \'api\' }, result.usage.input_tokens);\n';
  doc+='      tokenCounter.inc({ model: result.model, type: \'output\', endpoint: \'api\' }, result.usage.output_tokens);\n';
  doc+='      costGauge.inc({ model: result.model, endpoint: \'api\' }, cost);\n';
  doc+='      // Alert if cost anomaly: >2x baseline\n';
  doc+='      if (cost > COST_BASELINE * 2) logger.warn({ cost, model: result.model }, \'ai_cost_spike\');\n';
  doc+='    }\n';
  doc+='    return result;\n';
  doc+='  };\n';
  doc+='}\n';
  doc+='```\n\n';

  doc+='### '+(G?'日次コスト集計クエリ (Prometheus)':'Daily Cost Aggregation Query (Prometheus)')+'\n\n';
  doc+='```promql\n';
  doc+='# '+(G?'本日のAIコスト総額 (USD)':'Total AI cost today (USD)')+'\n';
  doc+='sum(increase(ai_cost_usd_total[24h]))\n\n';
  doc+='# '+(G?'モデル別コスト分布':'Cost breakdown by model')+'\n';
  doc+='sum by (model) (increase(ai_cost_usd_total[24h]))\n\n';
  doc+='# '+(G?'コスト異常検知: 過去7日平均の2倍超':'Anomaly: >2x 7-day average')+'\n';
  doc+='sum(rate(ai_cost_usd_total[1h])) * 24\n';
  doc+='  > 2 * sum(rate(ai_cost_usd_total[7d])) * 24\n';
  doc+='```\n\n';

  // §3 本番ハルシネーション検出
  doc+='## '+(G?'§3 本番ハルシネーション検出':'§3 Production Hallucination Detection')+'\n\n';
  doc+='```typescript\n';
  doc+='// lib/ai/hallucination-detector.ts\n\n';
  doc+='// Strategy 1: Reference-based (RAG contexts)\n';
  doc+='export async function detectHallucinationByRAG(\n';
  doc+='  response: string,\n';
  doc+='  retrievedContexts: string[]\n';
  doc+='): Promise<{ isHallucination: boolean; faithfulnessScore: number }> {\n';
  doc+='  // Use RAGAS faithfulness metric\n';
  doc+='  const contextText = retrievedContexts.join(\'\\n\');\n';
  doc+='  const supportedClaims = countSupportedClaims(response, contextText);\n';
  doc+='  const totalClaims = countTotalClaims(response);\n';
  doc+='  const faithfulnessScore = totalClaims > 0 ? supportedClaims / totalClaims : 1;\n';
  doc+='  return { isHallucination: faithfulnessScore < 0.85, faithfulnessScore };\n';
  doc+='}\n\n';
  doc+='// Strategy 2: Self-consistency (sample multiple responses)\n';
  doc+='export async function detectHallucinationByConsistency(\n';
  doc+='  prompt: string,\n';
  doc+='  sampleCount: number = 3\n';
  doc+='): Promise<{ consistent: boolean; agreement: number }> {\n';
  doc+='  const responses = await Promise.all(\n';
  doc+='    Array.from({ length: sampleCount }, () => llmClient.complete(prompt))\n';
  doc+='  );\n';
  doc+='  const agreement = computeSemanticSimilarity(responses);\n';
  doc+='  return { consistent: agreement > 0.8, agreement };\n';
  doc+='}\n\n';
  doc+='// Record metric for Prometheus\n';
  doc+='export function recordHallucinationMetric(detected: boolean) {\n';
  doc+='  hallucinationCounter.inc({ detected: detected ? \'yes\' : \'no\' });\n';
  doc+='  if (detected) logger.warn(\'hallucination_detected\');\n';
  doc+='}\n';
  doc+='```\n\n';

  // §4 プロンプト品質モニタリング
  doc+='## '+(G?'§4 プロンプト品質モニタリング & ドリフト検出':'§4 Prompt Quality Monitoring & Drift Detection')+'\n\n';
  doc+='```typescript\n';
  doc+='// lib/ai/prompt-monitor.ts\n\n';
  doc+='interface PromptVersion {\n';
  doc+='  id: string;\n';
  doc+='  hash: string;\n';
  doc+='  deployedAt: string;\n';
  doc+='  metrics: {\n';
  doc+='    avgLatencyMs: number;\n';
  doc+='    hallucinationRate: number;\n';
  doc+='    userSatisfaction: number;\n';
  doc+='    costPerRequest: number;\n';
  doc+='  };\n';
  doc+='}\n\n';
  doc+='export class PromptMonitor {\n';
  doc+='  private versions = new Map<string, PromptVersion>();\n\n';
  doc+='  trackPromptPerformance(promptHash: string, metrics: PromptVersion[\'metrics\']) {\n';
  doc+='    const existing = this.versions.get(promptHash);\n';
  doc+='    if (!existing) return;\n';
  doc+='    // Detect performance degradation\n';
  doc+='    const degraded = (\n';
  doc+='      metrics.hallucinationRate > existing.metrics.hallucinationRate * 1.5 ||\n';
  doc+='      metrics.avgLatencyMs > existing.metrics.avgLatencyMs * 2 ||\n';
  doc+='      metrics.userSatisfaction < existing.metrics.userSatisfaction * 0.8\n';
  doc+='    );\n';
  doc+='    if (degraded) {\n';
  doc+='      logger.warn({ promptHash, metrics }, \'prompt_performance_degraded\');\n';
  doc+='      // Trigger rollback alert\n';
  doc+='      alertingService.fire(\'prompt_rollback_recommended\', { promptHash });\n';
  doc+='    }\n';
  doc+='  }\n';
  doc+='}\n';
  doc+='```\n\n';

  // §5 ガードレール分析
  doc+='## '+(G?'§5 ガードレール分析':'§5 Guardrail Analytics')+'\n\n';
  doc+='```typescript\n';
  doc+='// lib/ai/guardrail-analytics.ts\n\n';
  doc+='export class GuardrailAnalytics {\n';
  doc+='  recordEvent(type: \'input_filter\' | \'output_reject\' | \'content_block\' | \'false_positive\' | \'escalation\') {\n';
  doc+='    guardrailCounter.inc({ type });\n';
  doc+='    if (type === \'escalation\') {\n';
  doc+='      logger.error(\'guardrail_escalation\', { type, ts: Date.now() });\n';
  doc+='    }\n';
  doc+='  }\n\n';
  doc+='  getFireRate(window = \'1h\'): Promise<number> {\n';
  doc+='    // Returns: blocked / total requests in window\n';
  doc+='    return metricsClient.query(\n';
  doc+='      `sum(rate(guardrail_events_total{type!="false_positive"}[${window}]))\n';
  doc+='       / sum(rate(ai_requests_total[${window}]))`\n';
  doc+='    );\n';
  doc+='  }\n';
  doc+='}\n';
  doc+='```\n\n';

  doc+='### '+(G?'ガードレールダッシュボードパネル (Grafana)':'Guardrail Dashboard Panels (Grafana)')+'\n\n';
  doc+='```promql\n';
  doc+='# '+(G?'入力フィルタ発火率 (5分ウィンドウ)':'Input filter fire rate (5min window)')+'\n';
  doc+='sum(rate(guardrail_events_total{type="input_filter"}[5m]))\n';
  doc+='/ sum(rate(ai_requests_total[5m]))\n\n';
  doc+='# '+(G?'出力バリデーション拒否率':'Output validation rejection rate')+'\n';
  doc+='sum(rate(guardrail_events_total{type="output_reject"}[5m]))\n';
  doc+='/ sum(rate(ai_requests_total[5m]))\n\n';
  doc+='# '+(G?'偽陽性率 (精度指標)':'False positive rate (precision metric)')+'\n';
  doc+='sum(rate(guardrail_events_total{type="false_positive"}[24h]))\n';
  doc+='/ sum(rate(guardrail_events_total[24h]))\n';
  doc+='```\n\n';

  // §6 AI運用ランブック
  doc+='## '+(G?'§6 AI運用ランブック':'§6 AI Operations Runbook')+'\n\n';

  var runbook=[
    {title:G?'モデル劣化対応':'Model Degradation Response',
     steps:G?
       ['ハルシネーション率アラートを確認','RAGAS スコアの傾向をグラフで分析','プロンプトバージョン履歴を確認','前バージョンへのロールバックを実行','原因分析後にプロンプト修正版をデプロイ']:
       ['Confirm hallucination rate alert','Analyze RAGAS score trend graph','Check prompt version history','Execute rollback to previous version','Deploy fixed prompt after root cause analysis']},
    {title:G?'コストスパイク対応':'Cost Spike Response',
     steps:G?
       ['ai_cost_usd_total メトリクスでスパイク原因モデルを特定','異常に長いプロンプト/レスポンスのリクエストを特定','レート制限の閾値を一時引き下げ','コスト起因モデルをコスト効率の良いモデルに切り替え','根本原因修正後に閾値を元に戻す']:
       ['Identify spiking model via ai_cost_usd_total metric','Identify requests with abnormally long prompts/responses','Temporarily lower rate limit thresholds','Switch offending model to cost-efficient alternative','Restore thresholds after root cause fix']},
    {title:G?'ハルシネーション多発対応':'Frequent Hallucination Response',
     steps:G?
       ['影響エンドポイントと入力パターンを特定','RAGコンテキストの品質を確認 (retrieval precision)','システムプロンプトに追加制約を一時追加','Human-in-the-loop の閾値を引き上げ (>0.7 → レビュー必須)','モデル変更またはRAGパイプライン改修']:
       ['Identify affected endpoints and input patterns','Verify RAG context quality (retrieval precision)','Add temporary constraints to system prompt','Raise human-in-the-loop threshold (>0.7 → review required)','Change model or revamp RAG pipeline']},
    {title:G?'プロバイダー障害フォールバック':'Provider Failure Fallback',
     steps:G?
       ['プロバイダーステータスページ確認','フォールバックモデルへの自動切り替えを確認','Circuit Breaker の状態を確認','ユーザーへの機能縮退通知を検討','SLA記録の更新']:
       ['Check provider status page','Verify automatic failover to fallback model','Confirm circuit breaker state','Consider degraded feature notice to users','Update SLA records']},
  ];

  runbook.forEach(function(r){
    doc+='### '+r.title+'\n\n';
    r.steps.forEach(function(s,i){doc+=(i+1)+'. '+s+'\n';});
    doc+='\n';
  });

  doc+=G?'## 📚 関連ドキュメント\n\n':'## 📚 Related Documents\n\n';
  doc+='- [AI Safety Framework](./95_ai_safety_framework.md)\n';
  doc+='- [XAI & AI Transparency](./98-2_xai_transparency_guide.md)\n';
  doc+='- [Observability Architecture](./103_observability_architecture.md)\n';
  doc+='- [Metrics & Alerting](./105_metrics_alerting.md)\n';
  doc+='- [Distributed Tracing](./106_distributed_tracing.md)\n';

  S.files['docs/106-2_ai_runtime_monitoring.md']=doc;
}
