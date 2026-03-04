/* ═══ PILLAR ㉕ PERFORMANCE INTELLIGENCE ═══ */
/* Generates: docs/99-102 — Performance Strategy, DB Perf, Cache Strategy, Monitoring */

/* Domain-specific performance extras */
var DOMAIN_PERF_EXTRA={
  fintech:{
    db_ja:['トランザクション分離レベル Serializable の使用 (競合検出)','AuditLogテーブルへのPartitioned Index (月次パーティション)','決済レコードのRead Replica活用 (レポート参照)'],
    db_en:['Use Serializable transaction isolation (conflict detection)','Partitioned index on AuditLog table (monthly partitions)','Read replica for payment record reporting queries'],
    cache_ja:['口座残高・残高照会はキャッシュ禁止 (Always Fresh)','セッショントークンは Redis TTL 15分 (セキュリティ)','レートリミット用 Redis カウンター (Sliding Window)'],
    cache_en:['Account balance: never cache (Always Fresh)','Session tokens: Redis TTL 15 min (security)','Rate limiting: Redis sliding window counter'],
    alert_ja:['決済API P95 > 3s → 🔴 Critical (即時対応)','エラー率 > 0.5% → 🔴 Critical (即時対応)','DB接続プール枯渇 > 90% → 🟠 Warning'],
    alert_en:['Payment API P95 > 3s → 🔴 Critical (immediate)','Error rate > 0.5% → 🔴 Critical (immediate)','DB connection pool > 90% → 🟠 Warning']},
  health:{
    db_ja:['患者記録のRow-Level Securityで検索最適化 (RLS Policy Index)','PHIカラムに暗号化 + 検索用インデックス分離','時系列バイタルデータ → TimescaleDB / PostgreSQL hypertable'],
    db_en:['Patient record RLS with optimized policy indexes','PHI columns: encryption + separate search index','Time-series vitals → TimescaleDB / PostgreSQL hypertable'],
    cache_ja:['PHI (保護医療情報) のキャッシュ禁止','診断コード・薬品マスタは長期キャッシュ可 (変化なし)','セッションは暗号化Redis (HIPAA準拠)'],
    cache_en:['Never cache PHI (protected health information)','Diagnosis codes/drug master: long-term cacheable (static)','Session: encrypted Redis (HIPAA compliant)'],
    alert_ja:['API可用性 < 99.9% → 🔴 Critical','レスポンス P99 > 2s → 🟠 Warning','バックアップ失敗 → 🔴 Critical (即時)'],
    alert_en:['API availability < 99.9% → 🔴 Critical','Response P99 > 2s → 🟠 Warning','Backup failure → 🔴 Critical (immediate)']},
  ec:{
    db_ja:['在庫テーブルに SELECT FOR UPDATE SKIP LOCKED (非ブロッキング在庫ロック)','注文ステータス推移は状態機械テーブル + インデックス','商品検索は全文検索インデックス (pg_trgm / Elasticsearch)'],
    db_en:['Inventory: SELECT FOR UPDATE SKIP LOCKED (non-blocking lock)','Order status transitions: state machine table + indexes','Product search: full-text index (pg_trgm / Elasticsearch)'],
    cache_ja:['商品カタログ: CDN + アプリキャッシュ 5分 (変更時Purge)','カート: Redis セッション (TTL 24h)','在庫数: Redis カウンター (DECRBY) + DB定期同期'],
    cache_en:['Product catalog: CDN + app cache 5min (purge on change)','Cart: Redis session (TTL 24h)','Inventory count: Redis DECRBY counter + DB sync'],
    alert_ja:['チェックアウト成功率 < 98% → 🔴 Critical','カート放棄率急増 +20% → 🟠 Warning','決済ゲートウェイ遅延 > 5s → 🟠 Warning'],
    alert_en:['Checkout success rate < 98% → 🔴 Critical','Cart abandonment spike +20% → 🟠 Warning','Payment gateway latency > 5s → 🟠 Warning']},
  ai:{
    db_ja:['ベクトル検索: pgvector に HNSW インデックス (ANN精度90%↑)','会話履歴テーブル: user_id + created_at複合インデックス','大量埋め込みベクトル: バッチ処理 + 非同期更新'],
    db_en:['Vector search: pgvector HNSW index (90%+ ANN accuracy)','Conversation history: composite index (user_id + created_at)','Bulk embeddings: batch processing + async updates'],
    cache_ja:['同一プロンプトへのLLM APIレスポンスをRedisキャッシュ (TTL 1h)','埋め込みベクトルはDB永続化 (再生成コスト削減)','コンテキストウィンドウ管理で不要トークン削減'],
    cache_en:['Cache LLM API responses for identical prompts (Redis TTL 1h)','Persist embedding vectors in DB (avoid regeneration cost)','Context window management to minimize unnecessary tokens'],
    alert_ja:['LLM APIエラー率 > 1% → 🔴 Critical','レスポンスP95 > 10s → 🟠 Warning','月次APIコスト > 予算の80% → 🟡 Info'],
    alert_en:['LLM API error rate > 1% → 🔴 Critical','Response P95 > 10s → 🟠 Warning','Monthly API cost > 80% of budget → 🟡 Info']},
  education:{
    db_ja:['学習履歴テーブルに (user_id, course_id, created_at) 複合インデックス','コース検索: pg_trgm 全文検索インデックス (タイトル・説明文)','進捗集計はマテリアライズドビューで週次更新 (重いSUM回避)'],
    db_en:['Learning history: composite index (user_id, course_id, created_at)','Course search: pg_trgm full-text index (title, description)','Progress aggregation: materialized view refreshed weekly (avoid heavy SUM)'],
    cache_ja:['コース一覧・シラバス: CDN + 15分キャッシュ (更新時Purge)','学習者の進捗データ: Redis TTL 5分 (頻繁更新対応)','修了証PDF: S3事前生成 + CDN配信'],
    cache_en:['Course catalog/syllabus: CDN + 15min cache (purge on update)','Learner progress: Redis TTL 5min (frequent update tolerance)','Certificate PDFs: pre-generated on S3 + CDN delivery'],
    alert_ja:['動画配信エラー率 > 0.5% → 🔴 Critical','ページ読込P95 > 4s → 🟠 Warning','同時受講者急増 +50% → 🟡 Info'],
    alert_en:['Video delivery error rate > 0.5% → 🔴 Critical','Page load P95 > 4s → 🟠 Warning','Concurrent learner spike +50% → 🟡 Info']},
  saas:{
    db_ja:['テナントIDを全テーブルの複合インデックス先頭に配置 (RLS効率化)','プランの機能フラグ: JSONBカラム + GINインデックス (plan_features)','使用量メトリクス: TimescaleDB 時系列集計 (月次請求計算)'],
    db_en:['Place tenant_id first in all composite indexes (RLS efficiency)','Plan feature flags: JSONB column + GIN index (plan_features)','Usage metrics: TimescaleDB time-series aggregation (monthly billing)'],
    cache_ja:['テナント設定・プラン情報: Redis TTL 1h (変更時即時無効化)','ダッシュボード集計: 5分ごとバックグラウンド更新 (リアルタイム不要)','セッション: Redis Cluster (マルチリージョン対応)'],
    cache_en:['Tenant config/plan info: Redis TTL 1h (invalidate on change)','Dashboard aggregations: background refresh every 5min (no real-time needed)','Session: Redis Cluster (multi-region support)'],
    alert_ja:['API可用性 < 99.9% → 🔴 Critical (SLA違反)','P95 > 500ms → 🟠 Warning','テナントあたりDB接続 > 50 → 🟠 Warning'],
    alert_en:['API availability < 99.9% → 🔴 Critical (SLA breach)','P95 > 500ms → 🟠 Warning','Connections per tenant > 50 → 🟠 Warning']},
  booking:{
    db_ja:['空き枠検索: GIST インデックス (timestamp range) + 行ロック最適化','予約競合検知: SELECT FOR UPDATE SKIP LOCKED (オーバーブッキング防止)','キャンセル待ちキュー: PostgreSQL LISTEN/NOTIFY でリアルタイム通知'],
    db_en:['Availability search: GIST index (timestamp range) + row lock optimization','Booking conflict: SELECT FOR UPDATE SKIP LOCKED (prevent overbooking)','Waitlist queue: PostgreSQL LISTEN/NOTIFY for real-time notification'],
    cache_ja:['空き状況カレンダー: Redis TTL 60秒 (高頻度参照)','料金マスタ: CDN + 1h キャッシュ (日次更新)','ユーザーセッション: Redis TTL 30分'],
    cache_en:['Availability calendar: Redis TTL 60sec (high-frequency read)','Pricing master: CDN + 1h cache (daily update)','User session: Redis TTL 30min'],
    alert_ja:['予約API P95 > 2s → 🔴 Critical','競合エラー率 > 0.1% → 🟠 Warning (ロック競合増大)','同時予約リクエスト > 100/sec → 🟡 Info'],
    alert_en:['Booking API P95 > 2s → 🔴 Critical','Conflict error rate > 0.1% → 🟠 Warning (lock contention)','Concurrent booking requests > 100/sec → 🟡 Info']},
  logistics:{
    db_ja:['荷物追跡イベント: 追記専用テーブル + (tracking_id, created_at) インデックス','配送ルート計算: PostGIS 地理空間インデックス (GIST)','在庫位置情報: Redis Geo (GEOADD/GEODIST) でリアルタイム管理'],
    db_en:['Shipment tracking events: append-only table + (tracking_id, created_at) index','Route calculation: PostGIS geospatial index (GIST)','Inventory location: Redis Geo (GEOADD/GEODIST) for real-time management'],
    cache_ja:['追跡ステータス: Redis TTL 30秒 (高頻度更新)','配送会社API応答: Redis TTL 5分 (外部API節約)','集計レポート: 夜間バッチ生成 + S3保存'],
    cache_en:['Tracking status: Redis TTL 30sec (high-frequency update)','Carrier API response: Redis TTL 5min (save external API calls)','Aggregated reports: nightly batch generation + S3 storage'],
    alert_ja:['追跡API P95 > 1s → 🔴 Critical','配送会社API エラー率 > 2% → 🟠 Warning','キュー滞留 > 10,000件 → 🟠 Warning'],
    alert_en:['Tracking API P95 > 1s → 🔴 Critical','Carrier API error rate > 2% → 🟠 Warning','Queue backlog > 10,000 items → 🟠 Warning']},
  manufacturing:{
    db_ja:['センサーデータ: TimescaleDB ハイパーテーブル (時系列最適化)','製品ロット追跡: (lot_id, process_step) 複合インデックス + ビットマップスキャン','設備稼働ログ: パーティションテーブル (月次) + 自動アーカイブ'],
    db_en:['Sensor data: TimescaleDB hypertable (time-series optimized)','Product lot tracking: (lot_id, process_step) composite index + bitmap scan','Equipment operation log: monthly partitioned table + auto archive'],
    cache_ja:['リアルタイムセンサー値: Redis Pub/Sub (TTL 10秒)','工程マスタ・BOM: Redis TTL 30分 (変更時無効化)','品質KPI: 5分集計バッファ + ダッシュボード更新'],
    cache_en:['Real-time sensor values: Redis Pub/Sub (TTL 10sec)','Process master/BOM: Redis TTL 30min (invalidate on change)','Quality KPI: 5min aggregation buffer + dashboard update'],
    alert_ja:['センサー欠損 > 5秒 → 🔴 Critical (設備異常疑い)','製品不良率 > 閾値 → 🔴 Critical','DBディスク使用率 > 80% → 🟠 Warning'],
    alert_en:['Sensor data gap > 5sec → 🔴 Critical (equipment anomaly suspected)','Product defect rate > threshold → 🔴 Critical','DB disk usage > 80% → 🟠 Warning']},
  hr:{
    db_ja:['従業員検索: 部署/役職/スキルの複合インデックス + 全文検索','給与履歴: Partitioned Table (年次) + 暗号化カラム','勤怠ログ: 追記専用テーブル + (employee_id, date) インデックス'],
    db_en:['Employee search: composite index (dept/title/skill) + full-text','Salary history: partitioned table (yearly) + encrypted columns','Attendance log: append-only table + (employee_id, date) index'],
    cache_ja:['組織図: Redis TTL 10分 (変更反映遅延許容)','給与明細PDF: S3事前生成 + 認証付きURL (1h有効)','在籍確認API: Redis TTL 5分'],
    cache_en:['Org chart: Redis TTL 10min (minor delay acceptable)','Payslip PDFs: pre-generated on S3 + signed URL (1h validity)','Employment verification API: Redis TTL 5min'],
    alert_ja:['給与計算バッチ 遅延 > 1h → 🔴 Critical','個人情報テーブル 異常アクセス → 🔴 Critical (セキュリティ)','API P95 > 3s → 🟠 Warning'],
    alert_en:['Payroll batch delay > 1h → 🔴 Critical','PII table abnormal access → 🔴 Critical (security)','API P95 > 3s → 🟠 Warning']},
  realestate:{
    db_ja:['物件検索: PostGIS + GIST インデックス (エリア・距離絞込)','物件画像メタデータ: JSONB + GINインデックス (属性検索)','閲覧履歴: (user_id, listing_id, viewed_at) 複合インデックス'],
    db_en:['Property search: PostGIS + GIST index (area/distance filtering)','Property image metadata: JSONB + GIN index (attribute search)','View history: composite index (user_id, listing_id, viewed_at)'],
    cache_ja:['物件リスト: CDN + 60秒キャッシュ (価格変動対応)','地図タイル: CDN長期キャッシュ (変更なし)','お気に入り・比較リスト: Redis TTL 24h'],
    cache_en:['Property listings: CDN + 60sec cache (price change tolerance)','Map tiles: CDN long-term cache (static)','Favorites/comparison list: Redis TTL 24h'],
    alert_ja:['物件検索 P95 > 2s → 🟠 Warning (PostGIS最適化)','画像配信エラー率 > 0.5% → 🔴 Critical','同時地図クエリ > 500/sec → 🟡 Info'],
    alert_en:['Property search P95 > 2s → 🟠 Warning (PostGIS optimization)','Image delivery error rate > 0.5% → 🔴 Critical','Concurrent map queries > 500/sec → 🟡 Info']},
  insurance:{
    db_ja:['保険契約: (policy_id, status, expiry_date) インデックス + パーティション','請求履歴: 追記専用 + AuditLog (改ざん検知)','リスク評価スコア: マテリアライズドビュー (夜間再計算)'],
    db_en:['Insurance policies: index (policy_id, status, expiry_date) + partition','Claim history: append-only + AuditLog (tamper detection)','Risk score: materialized view (nightly recalculation)'],
    cache_ja:['保険料計算: Redis TTL 1h (レート表キャッシュ)','契約照会: Redis TTL 5分 (高頻度参照)','帳票PDF: S3事前生成 + 認証付きURL'],
    cache_en:['Premium calculation: Redis TTL 1h (rate table cache)','Policy lookup: Redis TTL 5min (high-frequency read)','Document PDFs: pre-generated on S3 + signed URL'],
    alert_ja:['請求処理バッチ 遅延 > 2h → 🔴 Critical','保険料計算エラー率 > 0.01% → 🔴 Critical (財務影響)','DB応答P99 > 2s → 🟠 Warning'],
    alert_en:['Claims batch delay > 2h → 🔴 Critical','Premium calc error rate > 0.01% → 🔴 Critical (financial impact)','DB response P99 > 2s → 🟠 Warning']},
};

const CORE_WEB_VITALS=[
  {metric:'LCP',name:'Largest Contentful Paint',ja:'最大コンテンツ描画',good:'≤ 2.5s',ni:'2.5-4.0s',poor:'> 4.0s',tip:'Optimize hero images, server response time, render-blocking resources'},
  {metric:'INP',name:'Interaction to Next Paint',ja:'次の描画までの時間',good:'≤ 200ms',ni:'200-500ms',poor:'> 500ms',tip:'Minimize long tasks, defer non-critical JS, use web workers'},
  {metric:'CLS',name:'Cumulative Layout Shift',ja:'累積レイアウトシフト',good:'≤ 0.1',ni:'0.1-0.25',poor:'> 0.25',tip:'Set explicit width/height on images and embeds, avoid dynamic content above fold'},
  {metric:'FCP',name:'First Contentful Paint',ja:'最初のコンテンツ描画',good:'≤ 1.8s',ni:'1.8-3.0s',poor:'> 3.0s',tip:'Eliminate render-blocking resources, preconnect to critical origins'},
  {metric:'TTFB',name:'Time to First Byte',ja:'最初のバイトまでの時間',good:'≤ 800ms',ni:'800-1800ms',poor:'> 1800ms',tip:'Use CDN edge caching, optimize server-side rendering, database query optimization'},
];

const BUNDLE_TOOLS={
  nextjs:{analyzer:'@next/bundle-analyzer',cmd:'ANALYZE=true next build',size:{js:'<200KB (gzip)',css:'<50KB'},
    tips:['Dynamic imports for heavy components','next/image for automatic optimization','next/font for zero-layout-shift fonts']},
  react:{analyzer:'rollup-plugin-visualizer (Vite)',cmd:'vite build --mode analyze',size:{js:'<150KB (gzip)',css:'<40KB'},
    tips:['React.lazy() + Suspense for code splitting','Tree-shaking with ES modules','Bundle size monitoring with size-limit']},
  vue:{analyzer:'rollup-plugin-visualizer',cmd:'vite build',size:{js:'<180KB (gzip)',css:'<45KB'},
    tips:['Async components: defineAsyncComponent()','Vite automatic code splitting per route','vite-bundle-analyzer for visualization']},
  svelte:{analyzer:'rollup-plugin-visualizer',cmd:'vite build --report',size:{js:'<80KB (gzip)',css:'<30KB'},
    tips:['Svelte compiles to minimal JS (no runtime)','Dynamic imports: import() for heavy modules']},
  astro:{analyzer:'astro-compress',cmd:'astro build',size:{js:'<20KB (gzip)',css:'<30KB'},
    tips:['Islands architecture: partial hydration only','client:visible for below-fold components']},
};

const CACHE_LAYERS=[
  {layer:'CDN/Edge',ja:'CDNエッジキャッシュ',en:'CDN Edge Cache',
   tools:['Vercel Edge Network','Cloudflare Pages','AWS CloudFront'],
   headers:['Cache-Control: public, max-age=31536000, immutable (static assets)','Cache-Control: s-maxage=60, stale-while-revalidate=86400 (SSR pages)'],
   ttl:'static: 1year / pages: 60s-1h'},
  {layer:'App Cache',ja:'アプリケーションキャッシュ',en:'Application Cache',
   tools:['Redis (Upstash Serverless)','Memcached','Node-cache (in-memory)'],
   headers:['SET key value EX 3600','GET key (cache hit)','DEL key (invalidation)'],
   ttl:'session: 24h / computed: 5-60min / rate-limit: 1min'},
  {layer:'DB Query Cache',ja:'DBクエリキャッシュ',en:'DB Query Cache',
   tools:['PgBouncer connection pool','Prisma Accelerate','PostgreSQL shared_buffers'],
   headers:['SELECT * FROM users WHERE id=$1 — cache result 5min','Invalidate on write (CUD operations)'],
   ttl:'reads: 1-5min / aggregates: 15min'},
  {layer:'Client Cache',ja:'クライアントキャッシュ',en:'Client Cache',
   tools:['Service Worker (PWA)','HTTP Cache-Control','TanStack Query staleTime'],
   headers:['staleTime: 5 * 60 * 1000 (React Query)','Cache-Control: no-store (sensitive APIs)'],
   ttl:'SWR: 60s / static: browser max'},
];

const DB_PERF_PATTERNS=[
  {id:'index',ja:'インデックス設計',en:'Index Design',
   sql:'-- Composite index for common query patterns\nCREATE INDEX CONCURRENTLY idx_posts_user_created\n  ON posts (user_id, created_at DESC)\n  WHERE deleted_at IS NULL; -- Partial index',
   tips:['EXPLAIN ANALYZE before adding indexes','Avoid index on low-cardinality columns (boolean, status with few values)','Covering index: INCLUDE clause to avoid heap fetch']},
  {id:'n1',ja:'N+1問題',en:'N+1 Problem',
   sql:'-- Bad: N queries for N users\nconst users = await prisma.user.findMany();\nfor (const u of users) { await prisma.post.findMany({ where: { userId: u.id } }); }\n\n// Good: Single query with include\nconst users = await prisma.user.findMany({ include: { posts: true } });',
   tips:['Prisma: always use include/select','TypeORM: eager relations or QueryBuilder JOIN','DataLoader for GraphQL (batch + cache per request)']},
  {id:'pool',ja:'コネクションプール',en:'Connection Pool',
   sql:'// Prisma: connection_limit in DATABASE_URL\n// postgresql://user:pass@host/db?connection_limit=10&pool_timeout=20\n\n// PgBouncer (transaction mode)\nmax_client_conn = 100\ndefault_pool_size = 10',
   tips:['Serverless: pgbouncer or Neon connection pooling','connection_limit = (CPU cores × 2) + disk count','Monitor: pg_stat_activity for active connections']},
  {id:'slowquery',ja:'スロークエリ検出',en:'Slow Query Detection',
   sql:"-- PostgreSQL slow query log\nALTER SYSTEM SET log_min_duration_statement = '100'; -- log queries >100ms\nSELECT RELOAD_CONF();\n\n-- pg_stat_statements for top slow queries\nSELECT query, calls, mean_exec_time FROM pg_stat_statements\nORDER BY mean_exec_time DESC LIMIT 10;",
   tips:['Prisma: use $queryRaw for complex queries with EXPLAIN','Supabase: Dashboard → Database → Query Performance','Set pg_stat_statements.track = all in postgresql.conf']},
];

const MONITORING_TOOLS=[
  {tool:'Vercel Analytics',ja:'Vercel Analyticsは自動的にCore Web Vitalsを計測し、ページ別・デバイス別に集計します',en:'Vercel Analytics automatically measures Core Web Vitals per page and device',setup:"import { Analytics } from '@vercel/analytics/react';\n// Add <Analytics /> to root layout"},
  {tool:'Sentry Performance',ja:'Sentryはトランザクション・スパンでバックエンド処理時間を追跡し、P50/P75/P95で集計します',en:'Sentry tracks backend processing time via transactions and spans, aggregated at P50/P75/P95',setup:"Sentry.init({ tracesSampleRate: 0.1 }); // 10% sampling"},
  {tool:'Lighthouse CI',ja:'Lighthouse CIはPull Request毎にパフォーマンス回帰を検知し、予算超過でCI失敗にできます',en:'Lighthouse CI detects performance regressions on every PR and fails CI on budget violations',setup:'npm install -g @lhci/cli\nlhci autorun --config=lighthouserc.json'},
  {tool:'OpenTelemetry',ja:'OpenTelemetryで分散トレーシングを実装し、マイクロサービス間のレイテンシを可視化します',en:'Implement distributed tracing with OpenTelemetry to visualize latency across microservices',setup:"import { trace } from '@opentelemetry/api';\nconst tracer = trace.getTracer('app');"},
];

function _perfFE(a){
  var fe=a.frontend||'';
  if(/Next\.js/i.test(fe))return 'nextjs';
  if(/Astro/i.test(fe))return 'astro';
  if(/Svelte/i.test(fe))return 'svelte';
  if(/Vue/i.test(fe))return 'vue';
  return 'react';
}
function _perfBE(a){
  var be=a.backend||'';
  if(/Python|FastAPI|Django/i.test(be))return 'python';
  if(/Spring|Java/i.test(be))return 'java';
  if(/Supabase/i.test(be))return 'supabase';
  if(/Firebase/i.test(be))return 'firebase';
  return 'node';
}
function _perfDB(a){
  var db=a.database||'';
  if(/MongoDB/i.test(db))return 'mongo';
  if(/MySQL/i.test(db))return 'mysql';
  if(/SQLite/i.test(db))return 'sqlite';
  return 'postgres'; // PostgreSQL, Neon, Supabase, etc.
}

function genPillar25_Performance(a,pn){
  gen99(a,pn);gen100(a,pn);gen101(a,pn);gen102(a,pn);
}

function gen99(a,pn){
  const G=S.genLang==='ja';
  const feKey=_perfFE(a);
  const bt=BUNDLE_TOOLS[feKey]||BUNDLE_TOOLS.react;
  const be=a.backend||'';
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);
  const isPy=/Python|FastAPI|Django/i.test(be);
  const isNext=/Next\.js/i.test(a.frontend||'');
  var lv99=S.skillLv!=null?S.skillLv:(S.skill==='beginner'?1:S.skill==='pro'?5:3);
  var isBeg99=(lv99<=1);var isPro99=(lv99>=5);

  let doc='# '+pn+' — '+(G?'パフォーマンス戦略書':'Performance Strategy')+'\n';
  doc+='> '+(G?'Core Web Vitals・バンドル最適化・レスポンスタイム設計':'Core Web Vitals · Bundle Optimization · Response Time Design')+'\n\n';

  // Domain SLO context
  const _p25dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):null;
  const _p25ops=typeof DOMAIN_OPS!=='undefined'&&_p25dom?(DOMAIN_OPS[_p25dom]||null):null;
  if(_p25ops&&_p25ops.slo){
    doc+='## '+(G?'ドメイン標準SLO ('+_p25dom+')':'Domain Standard SLO ('+_p25dom+')')+'\n\n';
    doc+='| '+(G?'指標':'Metric')+' | '+(G?'目標値':'Target')+' |\n|------|------|\n';
    doc+='| Availability (SLO) | **'+_p25ops.slo+'** |\n';
    if(_p25ops.backup_ja&&_p25ops.backup_ja.length>0){
      doc+='| '+(G?'バックアップ/リカバリ':'Backup/Recovery')+' | '+(G?_p25ops.backup_ja[0]:_p25ops.backup_en[0])+' |\n';
    }
    doc+='\n> '+(G?'このドメインのSLOに基づき、以下の Core Web Vitals 目標値・監視閾値を設定してください。':'Set Core Web Vitals targets and alert thresholds based on the SLO above for this domain.')+'\n\n';
  }

  doc+='## '+(G?'Core Web Vitals 目標値':'Core Web Vitals Targets')+'\n\n';
  doc+='| Metric | '+(G?'指標名':'Description')+' | 🟢 Good | 🟡 NI | 🔴 Poor | '+(G?'改善ポイント':'Optimization Tip')+'|\n';
  doc+='|--------|'+(G?'------':'-------')+'|---------|-------|---------|------|\n';
  CORE_WEB_VITALS.forEach(v=>{
    doc+='| **'+v.metric+'** | '+(G?v.ja:v.name)+' | '+v.good+' | '+v.ni+' | '+v.poor+' | '+v.tip+' |\n';
  });

  doc+='\n## '+(G?'フロントエンドバンドル最適化':'Frontend Bundle Optimization')+'\n\n';
  doc+='**'+(G?'分析ツール':'Analyzer')+': `'+bt.analyzer+'`**\n\n';
  doc+='```bash\n'+bt.cmd+'\n```\n\n';
  doc+='**'+(G?'バジェット目標':'Budget Targets')+':** JS: '+bt.size.js+' / CSS: '+bt.size.css+'\n\n';
  doc+=(G?'### 最適化チェックリスト':'### Optimization Checklist')+'\n';
  bt.tips.forEach(t=>{ doc+='- '+t+'\n'; });

  if(isNext){
    doc+='\n### Next.js '+(G?'特有の最適化':'Specific Optimizations')+'\n';
    doc+='```typescript\n';
    doc+='// Dynamic import with loading state\n';
    doc+="import dynamic from 'next/dynamic';\n";
    doc+="const HeavyChart = dynamic(() => import('./HeavyChart'), {\n";
    doc+="  loading: () => <Skeleton />,\n  ssr: false,\n});\n\n";
    doc+='// Image optimization\n';
    doc+="import Image from 'next/image';\n";
    doc+='// <Image src={src} width={800} height={400} priority={isAboveFold} />\n```\n';
  }

  doc+='\n## '+(G?'バックエンドレスポンスタイム目標':'Backend Response Time Targets')+'\n\n';
  doc+='| '+(G?'エンドポイント種別':'Endpoint Type')+' | P50 | P95 | P99 |\n';
  doc+='|'+(G?'------':'-------')+'|-----|-----|-----|\n';
  doc+='| '+(G?'静的API (キャッシュあり)':'Static API (cached)')+' | <10ms | <50ms | <100ms |\n';
  doc+='| '+(G?'DB読み取り (単純)':'DB read (simple)')+' | <50ms | <200ms | <500ms |\n';
  doc+='| '+(G?'DB読み取り (複雑JOIN)':'DB read (complex JOIN)')+' | <100ms | <500ms | <1000ms |\n';
  doc+='| '+(G?'AI API呼び出し':'AI API call')+' | <1000ms | <3000ms | <8000ms |\n';
  doc+='| '+(G?'ファイルアップロード':'File upload')+' | <500ms | <2000ms | <5000ms |\n';

  if(!isBaaS){
    doc+='\n### '+(G?'バックエンド最適化ポイント':'Backend Optimization Points')+'\n';
    if(isPy){
      doc+='```python\n# FastAPI: async endpoints + connection pool\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\n@app.get("/items")\nasync def get_items(db: AsyncSession = Depends(get_db)):\n    result = await db.execute(select(Item).options(selectinload(Item.tags)))\n    return result.scalars().all()\n```\n';
    } else {
      var _orm25=(typeof resolveORM==='function')?resolveORM(a).name:'Prisma ORM';
      if(/Drizzle/i.test(_orm25)){
        doc+='```typescript\n// Drizzle: select only needed fields\nconst users = await db.select({ id: users.id, name: users.name, email: users.email })\n  .from(users).limit(20).offset((page - 1) * 20).orderBy(desc(users.createdAt));\n```\n';
      } else if(/Kysely/i.test(_orm25)){
        doc+='```typescript\n// Kysely: select specific columns\nconst users = await db.selectFrom(\'users\')\n  .select([\'id\', \'name\', \'email\'])\n  .limit(20).offset((page - 1) * 20).orderBy(\'createdAt\', \'desc\').execute();\n```\n';
      } else if(/TypeORM/i.test(_orm25)){
        doc+='```typescript\n// TypeORM: select specific columns\nconst users = await userRepo.find({\n  select: [\'id\', \'name\', \'email\'],\n  take: 20, skip: (page - 1) * 20,\n  order: { createdAt: \'DESC\' },\n});\n```\n';
      } else {
        doc+='```typescript\n// Prisma: select only needed fields\nconst users = await prisma.user.findMany({\n  select: { id: true, name: true, email: true }, // avoid SELECT *\n  take: 20, // pagination\n  skip: (page - 1) * 20,\n  orderBy: { createdAt: \'desc\' },\n});\n```\n';
      }
    }
  }

  // Capacity planning section (non-solo)
  if((a.scale||'medium')!=='solo'){
    var _isLargeScale=/large/i.test(a.scale||'');
    var _mau=_isLargeScale?'100,000':'10,000';
    var _qps=_isLargeScale?'60':'6';
    var _ents99=(a.entities||a.data_entities||'User, Post').split(',').map(function(e){return e.trim();}).filter(Boolean);
    doc+='\n## '+(G?'📐 キャパシティ見積り (Little\'s Law)':'📐 Capacity Planning (Little\'s Law)')+'\n\n';
    doc+=(G
      ?'> **Little\'s Law**: L = λ × W（システム内平均リクエスト数 = スループット × 平均応答時間）\n\n'
      :'> **Little\'s Law**: L = λ × W (avg requests in system = throughput × avg response time)\n\n'
    );
    doc+='### '+(G?'ファネルベース QPS / TPS 試算 ('+_mau+' MAU)':'Funnel-Based QPS / TPS Estimate ('+_mau+' MAU)')+'\n\n';
    doc+='| '+(G?'指標':'Metric')+' | '+(G?'値':'Value')+' | '+(G?'計算式':'Formula')+' |\n';
    doc+='|------|------|------|\n';
    doc+='| MAU | '+_mau+' | '+(G?'月間アクティブユーザー':'Monthly Active Users')+' |\n';
    doc+='| DAU | '+(_isLargeScale?'30,000':'3,000')+' | MAU × 30% |\n';
    doc+='| '+(G?'平均セッション/日':'Avg sessions/day')+' | 3 | '+(G?'行動分析ベース':'Based on behavior analysis')+' |\n';
    doc+='| '+(G?'リクエスト/セッション':'Requests/session')+' | 10 | '+(G?'ページ遷移・API呼出':'Page nav + API calls')+' |\n';
    doc+='| '+(G?'ピーク係数':'Peak factor')+' | 3× | '+(G?'日次ピーク÷平均':'Daily peak ÷ average')+' |\n';
    doc+='| **'+(G?'平均 QPS':'Avg QPS')+'** | **'+_qps+'** | DAU × 3 × 10 ÷ 86400 |\n';
    doc+='| **'+(G?'ピーク QPS':'Peak QPS')+'** | **'+(_isLargeScale?'180':'18')+'** | '+(G?'平均':'Avg')+' × 3× |\n';
    doc+='\n> '+(G?'💡 ピーク QPS が **'+(_isLargeScale?'180':'18')+'** であれば、シングルサーバー (4 vCPU) で対応可能です。スケールアップは QPS > 200 を目安に検討してください。':
      '💡 Peak QPS of **'+(_isLargeScale?'180':'18')+'** is handleable on a single server (4 vCPU). Consider scaling up when QPS > 200.')+'\n\n';
    doc+='### '+(G?'ストレージ見積り':'Storage Estimate')+'\n\n';
    doc+='| '+(G?'エンティティ':'Entity')+' | '+(G?'行サイズ目安':'Row size')+' | '+(G?'年間レコード数':'Records/year')+' | '+(G?'年間容量':'Annual size')+' |\n';
    doc+='|------|------|------|------|\n';
    _ents99.slice(0,4).forEach(function(e){
      doc+='| '+e+' | ~500 B | ~'+(_isLargeScale?'360K':'36K')+' | ~'+(_isLargeScale?'180MB':'18MB')+' |\n';
    });
    doc+='| '+(G?'添付ファイル (S3)':'Attachments (S3)')+' | ~2MB/件 | ~'+(_isLargeScale?'120K':'12K')+' | ~'+(_isLargeScale?'240GB':'24GB')+' |\n';
    doc+='\n> '+(G?'📌 DB は 3年分でも数GB規模。ストレージコストはオブジェクトストレージ (S3/GCS) が支配的になります。':
      '📌 DB stays in GB range even over 3 years. Object storage (S3/GCS) will dominate storage cost.')+'\n';
  }

  // ─── Beginner: パフォーマンスの基本 ───
  if(isBeg99){
    doc+='\n---\n\n## '+(G?'🔰 パフォーマンス入門: 必須の3ルール':'🔰 Performance Basics: 3 Essential Rules')+'\n\n';
    doc+=(G?'まず用語を理解しましょう。**レイテンシ**はリクエストが完了するまでの時間（例: 200ms）、**スループット**は単位時間あたりのリクエスト処理数（例: 100 req/s）です。\n\n':'First, learn the terms: **Latency** is the time for a single request to complete (e.g., 200ms); **Throughput** is requests processed per second (e.g., 100 req/s).\n\n');
    doc+=(G?'**Rule 1: まず計測、次に最適化** — 感覚でコードを書き直すのは禁物です。Chrome DevTools の Network タブ、Lighthouse を使って現状を数値で把握してください。\n\n':'**Rule 1: Measure first, then optimize** — Never rewrite code by gut feeling. Use Chrome DevTools Network tab and Lighthouse to measure baseline numbers.\n\n');
    doc+=(G?'**Rule 2: 画像を最適化する** — Webパフォーマンス問題の多くは画像サイズが原因です。`next/image`や`<img loading="lazy">`を使い、WebP/AVIF形式に変換してください。\n\n':'**Rule 2: Optimize images** — Most web performance issues come from oversized images. Use `next/image` or `<img loading="lazy">` and convert to WebP/AVIF.\n\n');
    doc+=(G?'**Rule 3: キャッシュを活用する** — 同じデータを何度もDBから取得しないでください。`Cache-Control`ヘッダーとCDNを設定するだけで応答速度が劇的に改善します。\n\n':'**Rule 3: Use caching** — Avoid repeated DB fetches for the same data. Just configuring `Cache-Control` headers and a CDN can dramatically improve response times.\n\n');
  }

  // ─── Pro: Flame Graph + パフォーマンスバジェット ───
  if(isPro99){
    doc+='\n---\n\n## '+(G?'⚙️ Flame Graph 分析':'⚙️ Flame Graph Analysis')+'\n\n';
    doc+='```bash\n# Node.js CPU profiling with clinic flame\nnpx clinic flame -- node server.js\n\n# 0x — flamegraph for Node.js\nnpx 0x -o -- node server.js\n# Then load test:\nnpx autocannon -c 100 -d 30 http://localhost:3000/api/heavy-endpoint\n```\n\n';
    doc+='| '+(G?'シグナル':'Signal')+' | '+(G?'意味':'Meaning')+' | '+(G?'対処':'Action')+'|\n';
    doc+='|------|------|------|\n';
    doc+='| '+( G?'細長い塔（同期ブロック）':'Tall narrow towers (sync block)')+' | '+( G?'イベントループをブロック中':'Blocking event loop')+' | '+( G?'非同期化 or Worker Threads':'Make async or use Worker Threads')+'|\n';
    doc+='| '+( G?'幅広いフレーム（CPU多消費）':'Wide frames (CPU-heavy)')+' | '+( G?'ホットパスの最適化余地あり':'Hot path needs optimization')+' | '+( G?'アルゴリズム改善 / キャッシュ':'Improve algorithm / add cache')+'|\n';
    doc+='| '+( G?'JSON.parse/stringify 多発':'Frequent JSON.parse/stringify')+' | '+( G?'シリアライズがボトルネック':'Serialization bottleneck')+' | '+( G?'fast-json-stringify / MessagePack':'fast-json-stringify / MessagePack')+'|\n\n';
    doc+='## '+(G?'パフォーマンスバジェット自動化 (Lighthouse CI)':'Performance Budget Automation (Lighthouse CI)')+'\n\n';
    doc+='```yaml\n# lighthouserc.yml\nci:\n  collect:\n    url: [\'http://localhost:3000\']\n    numberOfRuns: 3\n  assert:\n    assertions:\n      first-contentful-paint: [\'warn\', {maxNumericValue: 1800}]\n      largest-contentful-paint: [\'error\', {maxNumericValue: 2500}]\n      total-blocking-time: [\'error\', {maxNumericValue: 200}]\n      cumulative-layout-shift: [\'error\', {maxNumericValue: 0.1}]\n      performance-score: [\'error\', {minScore: 0.9}]\n```\n\n';
    doc+='```bash\n# Run in CI\nnpx lhci autorun --config=lighthouserc.yml\n```\n\n';
  }

  S.files['docs/99_performance_strategy.md']=doc;
}

function gen100(a,pn){
  const G=S.genLang==='ja';
  const dbKey=_perfDB(a);
  const beKey=_perfBE(a);
  const isMongo=dbKey==='mongo';
  const isBaaS=/Supabase|Firebase|Convex/i.test(a.backend||'');
  const orm=a.orm||'';

  let doc='# '+pn+' — '+(G?'データベースパフォーマンス設計':'Database Performance Design')+'\n';
  doc+='> '+(G?'インデックス・N+1解消・コネクションプール・スロークエリ対策':'Index Design · N+1 Fix · Connection Pooling · Slow Query Detection')+'\n\n';

  DB_PERF_PATTERNS.forEach(p=>{
    doc+='## '+(G?p.ja:p.en)+'\n\n';
    if(p.id==='n1'&&isMongo){
      doc+=(G?'MongoDB向け N+1対策:':'MongoDB N+1 fix:')+'\n';
      doc+='```javascript\n// Mongoose: populate vs aggregate\n// Bad: nested findById per user\n// Good:\nconst users = await User.find().populate(\'posts\', \'title createdAt\');\n// Or use aggregation pipeline for complex cases\n```\n\n';
    } else if(p.id==='index'&&isMongo){
      doc+='```javascript\n// MongoDB compound index\nawait db.collection(\'posts\').createIndex(\n  { userId: 1, createdAt: -1 },\n  { partialFilterExpression: { deletedAt: { $exists: false } } }\n);\n```\n\n';
    } else {
      doc+='```sql\n'+p.sql+'\n```\n\n';
    }
    doc+=(G?'**ポイント:**':'**Tips:**')+'\n';
    var _ormName100=(typeof resolveORM==='function')?resolveORM(a).name:'Prisma ORM';
    p.tips.forEach(function(t){
      var tip=t;
      if(!/Prisma/i.test(_ormName100)) tip=tip.replace(/Prisma/g,_ormName100);
      doc+='- '+tip+'\n';
    });
    doc+='\n';
  });

  if(isBaaS&&/Supabase/i.test(a.backend||'')){
    doc+='## Supabase '+(G?'パフォーマンス最適化':'Performance Optimization')+'\n\n';
    doc+='```sql\n-- Supabase: Enable pg_stat_statements\nCREATE EXTENSION IF NOT EXISTS pg_stat_statements;\n\n-- Check slow queries in Dashboard → Database → Query Performance\n-- Or via SQL:\nSELECT query, calls, mean_exec_time, total_exec_time\nFROM pg_stat_statements\nORDER BY mean_exec_time DESC LIMIT 10;\n\n-- Add index via Supabase Studio or migration\nCREATE INDEX CONCURRENTLY ON your_table (column_name);\n```\n';
    doc+='\n**'+(G?'Supabase 推奨設定:':'Supabase recommended settings:')+' ** Row Level Security ON / Connection Pooling (Session Mode for transactions, Transaction Mode for serverless)\n';
  }

  if(/TypeORM/i.test(orm)){
    doc+='\n## TypeORM '+(G?'パフォーマンスTips':'Performance Tips')+'\n\n';
    doc+='```typescript\n// QueryBuilder for complex queries\nconst users = await dataSource\n  .createQueryBuilder(User, \'u\')\n  .leftJoinAndSelect(\'u.posts\', \'p\')\n  .where(\'u.createdAt > :date\', { date: thirtyDaysAgo })\n  .orderBy(\'u.createdAt\', \'DESC\')\n  .take(20)\n  .cache(60000) // 1min query cache\n  .getMany();\n```\n';
  }

  if(/Kysely/i.test(orm)){
    doc+='\n## Kysely '+(G?'パフォーマンスTips':'Performance Tips')+'\n\n';
    doc+='```typescript\n// Kysely: compile queries for reuse\nconst compiled = db.selectFrom(\'users\')\n  .selectAll()\n  .where(\'id\', \'=\', sql.lit(0))\n  .compile();\n// Reuse compiled query with different params\n```\n';
  }

  // Domain-specific DB performance tips
  var _d100=detectDomain(a.purpose||'');
  var _dp100=_d100&&DOMAIN_PERF_EXTRA[_d100];
  if(_dp100){
    doc+='\n## '+(G?'ドメイン固有DBパフォーマンス ('+_d100+')':'Domain DB Performance ('+_d100+')')+'\n\n';
    (G?_dp100.db_ja:_dp100.db_en).forEach(function(t){doc+='- '+t+'\n';});
    doc+='\n';
  }

  S.files['docs/100_database_performance.md']=doc;
}

function gen101(a,pn){
  const G=S.genLang==='ja';
  const deploy=a.deploy||'';
  const fe=a.frontend||'';
  const be=a.backend||'';
  const isBaaS=/Supabase|Firebase|Convex/i.test(be);
  const isVercel=/Vercel/i.test(deploy);
  const isCF=/Cloudflare/i.test(deploy);
  const isNext=/Next\.js/i.test(fe);
  const hasMobile=a.mobile&&!/なし|None/i.test(a.mobile)&&a.mobile!=='';

  let doc='# '+pn+' — '+(G?'キャッシュ戦略':'Cache Strategy')+'\n';
  doc+='> '+(G?'CDN・アプリキャッシュ・HTTPヘッダー・サービスワーカー':'CDN · App Cache · HTTP Headers · Service Worker')+'\n\n';

  doc+='## '+(G?'キャッシュ階層設計':'Cache Layer Architecture')+'\n\n';
  doc+='```\n';
  doc+=(G?'ユーザー':'User')+' → '+(G?'CDN/エッジ':'CDN/Edge')+' → '+(G?'アプリサーバー':'App Server')+' → '+(G?'Redisキャッシュ':'Redis Cache')+' → DB\n';
  doc+=(G?'      キャッシュHIT率目標: CDN 60-80% / App 30-50%':'      Cache hit rate targets: CDN 60-80% / App 30-50%')+'\n```\n\n';

  var _ormName101=(typeof resolveORM==='function')?resolveORM(a).name:'Prisma ORM';
  CACHE_LAYERS.forEach(function(l){
    doc+='## '+(G?l.ja:l.en)+'\n\n';
    var toolsList=l.tools.map(function(tool){
      if(!/Prisma/i.test(_ormName101)&&/Prisma Accelerate/i.test(tool)){
        return tool.replace('Prisma Accelerate',_ormName101+' query optimization');
      }
      return tool;
    });
    doc+='**'+(G?'ツール':'Tools')+':** '+toolsList.join(', ')+'\n\n';
    doc+='```\n'+l.headers.join('\n')+'\n```\n';
    doc+='**TTL:** '+l.ttl+'\n\n';
  });

  if(isNext){
    doc+='## Next.js '+(G?'キャッシュ設計':'Cache Design')+'\n\n';
    doc+='```typescript\n// App Router: fetch cache with revalidation\nconst data = await fetch(\'https://api.example.com/data\', {\n  next: { revalidate: 60 }, // ISR: revalidate every 60s\n});\n\n// On-demand revalidation\nimport { revalidatePath, revalidateTag } from \'next/cache\';\nawait revalidatePath(\'/products\'); // After mutation\nawait revalidateTag(\'products\');  // Tag-based\n\n// Route Segment Config\nexport const revalidate = 3600; // 1h for whole page\nexport const dynamic = \'force-static\'; // Build-time only\n```\n';
  }

  if(isVercel){
    doc+='\n## Vercel '+(G?'エッジキャッシュ設定':'Edge Cache Configuration')+'\n\n';
    doc+='```typescript\n// vercel.json\n{\n  "headers": [\n    {\n      "source": "/_next/static/(.*)",\n      "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]\n    },\n    {\n      "source": "/api/(.*)",\n      "headers": [{"key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate=86400"}]\n    }\n  ]\n}\n```\n';
  }

  if(isCF){
    doc+='\n## Cloudflare '+(G?'キャッシュルール':'Cache Rules')+'\n\n';
    doc+='```\n# Cloudflare Page Rules\n# Static assets: Cache Everything, Edge TTL 1 year\n/assets/*  → Cache Level: Cache Everything, Edge TTL: 1 year\n# API: Bypass cache\n/api/*     → Cache Level: Bypass\n```\n';
  }

  doc+='\n## Redis (Upstash) '+(G?'アプリキャッシュ実装':'App Cache Implementation')+'\n\n';
  doc+='```typescript\nimport { Redis } from \'@upstash/redis\';\nconst redis = new Redis({ url: process.env.UPSTASH_URL!, token: process.env.UPSTASH_TOKEN! });\n\n// Cache-aside pattern\nasync function getUser(id: string) {\n  const cached = await redis.get<User>(\'user:\'+id);\n  if (cached) return cached;\n  const user = await prisma.user.findUnique({ where: { id } });\n  await redis.setex(\'user:\'+id, 3600, user); // TTL: 1h\n  return user;\n}\n\n// Invalidation on update\nasync function updateUser(id: string, data: Partial<User>) {\n  const user = await prisma.user.update({ where: { id }, data });\n  await redis.del(\'user:\'+id); // Invalidate cache\n  return user;\n}\n```\n';

  if(hasMobile){
    doc+='\n## '+(G?'モバイルキャッシュ戦略':'Mobile Cache Strategy')+'\n\n';
    doc+=(G?'- **MMKV** (React Native): 高速Key-Valueストレージ (AsyncStorageの10倍高速)':
         '- **MMKV** (React Native): Fast Key-Value storage (10x faster than AsyncStorage)')+'\n';
    doc+=(G?'- **React Query** `staleTime: 5分` でAPIキャッシュ、オフライン対応は `networkMode: \'offlineFirst\'`':
         '- **React Query** `staleTime: 5min` for API caching, offline support with `networkMode: \'offlineFirst\'`')+'\n';
    doc+=(G?'- **Image caching**: expo-image の `cachePolicy: \'memory-disk\'` で画像をローカルキャッシュ':
         '- **Image caching**: expo-image with `cachePolicy: \'memory-disk\'` for local image caching')+'\n';
  }

  // Domain-specific cache considerations
  var _d101=detectDomain(a.purpose||'');
  var _dp101=_d101&&DOMAIN_PERF_EXTRA[_d101];
  if(_dp101){
    doc+='\n## '+(G?'ドメイン固有キャッシュ戦略 ('+_d101+')':'Domain Cache Strategy ('+_d101+')')+'\n\n';
    (G?_dp101.cache_ja:_dp101.cache_en).forEach(function(c){doc+='- '+c+'\n';});
    doc+='\n';
  }

  if(!isBaaS){
    doc+='\n## '+(G?'ETag / 条件付きリクエスト':'ETag / Conditional Requests')+'\n\n';
    doc+=(G
      ?'ETagを使うと同一リソースが未変更の場合に **304 Not Modified** を返し、帯域を **30–90%** 削減できます。\n\n'
      :'ETag enables **304 Not Modified** responses for unchanged resources, reducing bandwidth by **30–90%**.\n\n'
    );
    doc+=(G?'### Express 実装例':'### Express Implementation')+'\n\n';
    doc+='```typescript\nimport crypto from \'crypto\';\n\n// Option 1: Express built-in weak ETag\napp.set(\'etag\', \'strong\');\n\n// Option 2: Custom strong ETag with content hash\napp.get(\'/api/products\', async (req, res) => {\n  const data = await getProducts();\n  const etag = \'"\' + crypto.createHash(\'sha256\')\n    .update(JSON.stringify(data)).digest(\'hex\').slice(0, 16) + \'"\';\n  if (req.headers[\'if-none-match\'] === etag) {\n    return res.status(304).end();\n  }\n  res.setHeader(\'ETag\', etag);\n  res.setHeader(\'Cache-Control\', \'max-age=60, must-revalidate\');\n  res.json(data);\n});\n```\n';
    if(isNext){
      doc+='\n'+(G?'### Next.js API Route 実装例':'### Next.js API Route')+'\n\n';
      doc+='```typescript\n// app/api/products/route.ts\nimport { NextRequest, NextResponse } from \'next/server\';\nimport crypto from \'crypto\';\n\nexport async function GET(req: NextRequest) {\n  const data = await getProducts();\n  const etag = \'"\' + crypto.createHash(\'sha256\')\n    .update(JSON.stringify(data)).digest(\'hex\').slice(0,16) + \'"\';\n  const clientEtag = req.headers.get(\'if-none-match\');\n  if (clientEtag === etag) {\n    return new NextResponse(null, { status: 304, headers: { ETag: etag } });\n  }\n  return NextResponse.json(data, { headers: { ETag: etag, \'Cache-Control\': \'max-age=60, must-revalidate\' } });\n}\n```\n';
    }
    doc+='\n## '+(G?'レスポンス圧縮ミドルウェア':'Response Compression Middleware')+'\n\n';
    doc+=(G
      ?'Gzip/Brotli圧縮でJSONペイロードを **30–70%** 削減できます。特に大規模レスポンスで効果大。\n\n'
      :'Gzip/Brotli compression reduces JSON payloads by **30–70%**, especially effective for large responses.\n\n'
    );
    doc+='```typescript\n// Express: compression middleware\nimport compression from \'compression\';\napp.use(compression({\n  level: 6,          // Balanced CPU vs compression ratio\n  threshold: 1024,   // Only compress responses > 1KB\n  filter: (req, res) => {\n    if (req.headers[\'x-no-compression\']) return false;\n    return compression.filter(req, res);\n  }\n}));\n```\n\n';
    doc+='```nginx\n# nginx: Gzip + Brotli dual compression\ngzip on;\ngzip_types application/json text/plain application/xml;\ngzip_min_length 1024;\ngzip_comp_level 6;\nbrotli on;\nbrotli_types application/json text/plain;\nbrotli_comp_level 4;\n```\n\n';
    doc+='| '+(G?'方式':'Method')+' | '+(G?'圧縮率':'Ratio')+' | CPU | '+(G?'ブラウザ対応':'Browser')+' | '+(G?'推奨用途':'Use Case')+' |\n';
    doc+='|------|------|-----|------|------|\n';
    doc+='| Brotli | ~26% better than gzip | '+(G?'高':'High')+' | Chrome/Firefox/Edge | '+(G?'静的アセット / CDN':'Static assets / CDN')+' |\n';
    doc+='| Gzip | '+(G?'標準':'Standard')+' | '+(G?'中':'Med')+' | '+(G?'全ブラウザ':'All browsers')+' | '+(G?'API / 汎用':'API / General')+' |\n';
    doc+='\n';
  }

  doc+='## '+(G?'Stale-While-Revalidate APIパターン':'Stale-While-Revalidate API Pattern')+'\n\n';
  doc+=(G
    ?'エンドポイント種別ごとの推奨 `Cache-Control` ヘッダー設計:\n\n'
    :'Recommended `Cache-Control` header design by endpoint type:\n\n'
  );
  doc+='| '+(G?'エンドポイント種別':'Endpoint Type')+' | Cache-Control | '+(G?'説明':'Notes')+' |\n';
  doc+='|------|------|------|\n';
  doc+='| '+(G?'静的参照データ (マスター等)':'Static reference data (master etc.)')+' | `public, max-age=3600, stale-while-revalidate=86400` | '+(G?'1h新鮮 + 1d猶予':'1h fresh + 1d grace')+' |\n';
  doc+='| '+(G?'共有リソース一覧':'Shared resource list')+' | `public, s-maxage=60, stale-while-revalidate=600` | '+(G?'CDN 1min + 10min猶予':'CDN 1min + 10min grace')+' |\n';
  doc+='| '+(G?'ユーザー固有データ':'User-specific data')+' | `private, max-age=0, stale-while-revalidate=60` | '+(G?'秘匿 + 60s猶予':'Private + 60s grace')+' |\n';
  doc+='| '+(G?'リアルタイムデータ':'Realtime data')+' | `no-store` | '+(G?'キャッシュ不可':'No caching')+' |\n';
  doc+='| '+(G?'Mutation後のGET':'GET after mutation')+' | `no-cache` | '+(G?'毎回再検証':'Revalidate each time')+' |\n';
  doc+='\n';

  S.files['docs/101_cache_strategy.md']=doc;
}

function gen102(a,pn){
  const G=S.genLang==='ja';
  const deploy=a.deploy||'';
  const be=a.backend||'';
  const isVercel=/Vercel/i.test(deploy);
  const isSentry=!isVercel;

  let doc='# '+pn+' — '+(G?'パフォーマンスモニタリング':'Performance Monitoring')+'\n';
  doc+='> '+(G?'RUM・Lighthouse CI・アラート設定・パフォーマンスバジェット':'RUM · Lighthouse CI · Alerts · Performance Budget')+'\n\n';

  doc+='## '+(G?'モニタリングスタック':'Monitoring Stack')+'\n\n';
  MONITORING_TOOLS.forEach(m=>{
    doc+='### '+m.tool+'\n';
    doc+=(G?m.ja:m.en)+'\n\n';
    doc+='```\n'+m.setup+'\n```\n\n';
  });

  doc+='## Lighthouse CI '+(G?'設定':'Configuration')+'\n\n';
  doc+='```json\n// lighthouserc.json\n{\n  "ci": {\n    "collect": { "startServerCommand": "npm start", "url": ["http://localhost:3000"], "numberOfRuns": 3 },\n    "assert": {\n      "assertions": {\n        "categories:performance": ["error", {"minScore": 0.8}],\n        "categories:accessibility": ["warn", {"minScore": 0.9}],\n        "first-contentful-paint": ["error", {"maxNumericValue": 2000}],\n        "interactive": ["error", {"maxNumericValue": 3500}],\n        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}]\n      }\n    },\n    "upload": { "target": "temporary-public-storage" }\n  }\n}\n```\n\n';

  doc+='## '+(G?'GitHub Actions パフォーマンス検証':'GitHub Actions Performance Check')+'\n\n';
  doc+='```yaml\n# .github/workflows/perf.yml\nname: Performance Budget\non: [pull_request]\njobs:\n  lighthouse:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run build\n      - uses: treosh/lighthouse-ci-action@v11\n        with:\n          configPath: ./lighthouserc.json\n          uploadArtifacts: true\n```\n\n';

  doc+='## '+(G?'パフォーマンスバジェット一覧':'Performance Budget Table')+'\n\n';
  doc+='| '+(G?'指標':'Metric')+' | '+(G?'目標':'Target')+' | '+(G?'警告':'Warning')+' | '+(G?'失敗':'Fail')+'|\n';
  doc+='|'+(G?'----':'------')+'|--------|---------|------|\n';
  doc+='| LCP | ≤ 2.5s | > 2.5s | > 4.0s |\n';
  doc+='| INP | ≤ 200ms | > 200ms | > 500ms |\n';
  doc+='| CLS | ≤ 0.1 | > 0.1 | > 0.25 |\n';
  doc+='| JS Bundle | ≤ 200KB | > 200KB | > 400KB |\n';
  doc+='| '+(G?'API P95':'API P95')+' | ≤ 200ms | > 200ms | > 1000ms |\n';
  doc+='| '+(G?'ページ読込':'Page Load')+' | ≤ 3s | > 3s | > 6s |\n\n';

  if(isVercel){
    doc+='## Vercel Analytics '+(G?'設定':'Setup')+'\n\n';
    doc+='```typescript\n// app/layout.tsx\nimport { Analytics } from \'@vercel/analytics/react\';\nimport { SpeedInsights } from \'@vercel/speed-insights/next\';\n\nexport default function RootLayout({ children }) {\n  return (\n    <html>\n      <body>\n        {children}\n        <Analytics />\n        <SpeedInsights />\n      <\/body>\n    </html>\n  );\n}\n```\n\n';
    doc+=(G?'Vercel Analyticsは自動でRUM (Real User Monitoring) を収集します。Dashboard → Analytics → Web Vitals で確認できます。':
         'Vercel Analytics automatically collects RUM (Real User Monitoring). View in Dashboard → Analytics → Web Vitals.')+'\n';
  } else {
    doc+='## Sentry '+(G?'パフォーマンストレーシング':'Performance Tracing')+'\n\n';
    var _sentryPkg=(/Next/i.test(a.frontend||''))?'@sentry/nextjs':'@sentry/node';
    var _orm102=(typeof resolveORM==='function')?resolveORM(a).name:'Prisma ORM';
    var _ormInteg=/Prisma/i.test(_orm102)?'Sentry.prismaIntegration(), // Prisma query tracing':'// ORM: '+_orm102+' (manual span tracking)';
    doc+='```typescript\n// sentry.server.config.ts\nimport * as Sentry from \''+_sentryPkg+'\';\nSentry.init({\n  tracesSampleRate: 0.1, // 10% sampling in production\n  profilesSampleRate: 0.1,\n  integrations: [\n    '+_ormInteg+'\n  ],\n});\n```\n\n';
  }

  doc+='\n## '+(G?'アラート設定指針':'Alert Configuration Guidelines')+'\n\n';
  doc+='| '+(G?'アラート条件':'Alert Condition')+' | '+(G?'重大度':'Severity')+' | '+(G?'対応時間':'Response Time')+'|\n';
  doc+='|'+(G?'----------':'-----')+'|---------|------|\n';
  doc+='| API P95 > 1000ms '+(G?'が5分継続':'for 5 min')+' | 🔴 Critical | '+(G?'即時':'Immediate')+'|\n';
  doc+='| '+(G?'エラー率':'Error rate')+' > 1% | 🔴 Critical | '+(G?'即時':'Immediate')+'|\n';
  doc+='| LCP > 4s '+(G?'の訪問者':'visitors')+' > 20% | 🟠 Warning | '+(G?'1時間以内':'Within 1h')+'|\n';
  doc+='| '+(G?'メモリ使用率':'Memory usage')+' > 85% | 🟠 Warning | '+(G?'1時間以内':'Within 1h')+'|\n';
  doc+='| JS Bundle '+(G?'サイズ増加':'size increase')+' > 50KB | 🟡 Info | '+(G?'次回PR':'Next PR')+'|\n';

  // Domain-specific monitoring alerts
  var _d102=detectDomain(a.purpose||'');
  var _dp102=_d102&&DOMAIN_PERF_EXTRA[_d102];
  if(_dp102){
    doc+='\n## '+(G?'ドメイン固有アラート ('+_d102+')':'Domain-Specific Alerts ('+_d102+')')+'\n\n';
    (G?_dp102.alert_ja:_dp102.alert_en).forEach(function(al){doc+='- '+al+'\n';});
    doc+='\n';
  }

  S.files['docs/102_performance_monitoring.md']=doc;
}
