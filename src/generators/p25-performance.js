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
