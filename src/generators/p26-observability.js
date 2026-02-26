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
}

function gen103(a,pn){
  const G=S.genLang==='ja';
  const be=_obsBackend(a);
  const dep=_obsTarget(a);
  const stack=OTEL_STACK[dep]||OTEL_STACK.default;
  const isBaaS=be==='supabase'||be==='firebase';
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
  doc+='  subgraph '+(G?'アプリケーション':'Application')+'\n';
  doc+='    APP['+(G?'アプリ':'App')+']\n';
  doc+='    SDK[OTel SDK]\n';
  doc+='    APP-->SDK\n';
  doc+='  end\n';
  doc+='  subgraph '+(G?'コレクター':'Collector')+'\n';
  doc+='    COL['+stack.collector+']\n';
  doc+='  end\n';
  doc+='  subgraph '+(G?'バックエンド':'Backend')+'\n';
  doc+='    BK['+stack.backend+']\n';
  doc+='  end\n';
  doc+='  SDK-->COL-->BK\n';
  doc+='```\n\n';

  doc+='## '+(G?'デプロイ環境別ツール選定 ('+dep+')':'Tool Selection by Deploy Target ('+dep+')')+'\n\n';
  doc+='| '+(G?'コンポーネント':'Component')+' | '+(G?'選定':'Selection')+'|\n';
  doc+='|------|------|\n';
  doc+='| OTel Collector | `'+stack.collector+'` |\n';
  doc+='| Exporter | `'+stack.exporter+'` |\n';
  doc+='| Backend | '+stack.backend+' |\n\n';

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
    doc+='structlog.configure(\n';
    doc+='    processors=[\n';
    doc+='        structlog.contextvars.merge_contextvars,\n';
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
      doc+='### SQLAlchemy '+(G?'クエリログ':'Query Logging')+'\n\n';
      doc+='```python\n';
      doc+='import logging\n';
      doc+='logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)\n';
      doc+='# '+(G?'開発時のみ echo=True。本番では必ず False':'echo=True for dev only; always False in prod')+'\n';
      doc+='engine = create_engine(DATABASE_URL, echo=False)\n';
      doc+='```\n\n';
    }
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
