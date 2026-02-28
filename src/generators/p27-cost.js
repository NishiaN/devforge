/* ═══ PILLAR ㉗ COST OPTIMIZATION INTELLIGENCE ═══ */
/* Generates: docs/109-112 — Cost Architecture, Resource Optimization, FinOps Strategy, Cost Monitoring */

var COST_PLATFORM={
  vercel:{model_ja:'従量課金 (Function呼び出し・帯域)',model_en:'Usage-based (function calls + bandwidth)',free:'Hobby (100GB帯域/月)',pro:'Pro $20/月',opt_ja:'Edge Functions活用・画像最適化・キャッシュヘッダー設定',opt_en:'Use Edge Functions, image optimization, cache headers'},
  railway:{model_ja:'リソース従量課金 (CPU・メモリ・転送量)',model_en:'Resource usage (CPU, memory, transfer)',free:'Starter $5クレジット/月',pro:'Pro $0.000463/vCPU秒',opt_ja:'不要サービスのsuspend・小サイズインスタンス選択',opt_en:'Suspend idle services, right-size instances'},
  aws:{model_ja:'EC2/ECS: インスタンス時間 + データ転送',model_en:'EC2/ECS: instance hours + data transfer',free:'Free Tier (t2.micro 750h/月)',pro:'Reserved Instances (最大72%割引)',opt_ja:'RI活用・Auto Scaling・S3 Intelligent-Tiering',opt_en:'Use RIs, Auto Scaling, S3 Intelligent-Tiering'},
  gcp:{model_ja:'Cloud Run: リクエスト + CPU秒 + メモリ',model_en:'Cloud Run: requests + CPU-seconds + memory',free:'Always Free (2M req/月)',pro:'Committed Use Discounts (最大57%)',opt_ja:'min-instances=0設定・Committed Use Discount活用',opt_en:'Set min-instances=0, use Committed Use Discounts'},
  netlify:{model_ja:'帯域 + ビルド分',model_en:'Bandwidth + build minutes',free:'Starter (100GB帯域・300min)',pro:'Pro $19/月',opt_ja:'大型アセットはCDN別出し・ビルドキャッシュ活用',opt_en:'Offload large assets to CDN, use build cache'},
  default:{model_ja:'クラウド従量課金',model_en:'Cloud usage-based pricing',free:'Free tier available',pro:'Pro plan',opt_ja:'不要リソースの削除・自動スケーリング設定',opt_en:'Remove unused resources, configure auto-scaling'},
};

function _costPlatform(a){
  var dep=(a.deploy||'').toLowerCase();
  if(/vercel/i.test(dep))return 'vercel';
  if(/railway/i.test(dep))return 'railway';
  if(/aws|ecs|lambda/i.test(dep))return 'aws';
  if(/gcp|cloud.run|google/i.test(dep))return 'gcp';
  if(/netlify/i.test(dep))return 'netlify';
  return 'default';
}
function _costDB(a){
  var db=(a.database||'').toLowerCase();
  if(/supabase/i.test(db))return {name:'Supabase',free:'Free (500MB DB)',pro:'Pro $25/月 (8GB DB)',opt_ja:'pgBouncer接続プール・不要RLSポリシーの削除',opt_en:'Use pgBouncer pooling, remove unused RLS policies'};
  if(/firebase/i.test(db))return {name:'Firebase',free:'Spark (1GB)',pro:'Blaze (従量課金)',opt_ja:'Firestoreルール最適化・インデックス管理',opt_en:'Optimize Firestore rules, manage indexes'};
  if(/mongodb/i.test(db))return {name:'MongoDB Atlas',free:'Free (512MB)',pro:'Flex $9〜/月',opt_ja:'不要インデックスの削除・コンパクション実行',opt_en:'Remove unused indexes, run compaction'};
  if(/neon/i.test(db))return {name:'Neon',free:'Free (0.5GB)',pro:'Launch $19/月',opt_ja:'Auto-suspend有効化・コンピュートサイズ最小化',opt_en:'Enable auto-suspend, minimize compute size'};
  return {name:'PostgreSQL',free:'Self-hosted (free)',pro:'Managed DB from $20/月',opt_ja:'接続プール・vacuum定期実行・クエリ最適化',opt_en:'Connection pooling, regular vacuum, query optimization'};
}

/* ── Domain-specific cost factor map ── */
var DOMAIN_COST_FACTORS={
  fintech:{
    ja:['コンプライアンス監査ログストレージ (月$20-100)','HSM/KMS 暗号鍵管理 ($5-50/月)','本番環境冗長化 (HA構成で×2-3コスト)','SOC2/PCI-DSS 監査ツール ($200-500/月)'],
    en:['Compliance audit log storage ($20-100/mo)','HSM/KMS key management ($5-50/mo)','HA production redundancy (2-3× cost)','SOC2/PCI-DSS audit tooling ($200-500/mo)']},
  health:{
    ja:['HIPAA準拠ストレージ暗号化 (+20-30%コスト)','BAA締結クラウドサービス (AWS/GCP医療グレード)','監査ログ7年保存ストレージ','緊急系HA構成 (RPO<1min → 高コスト)'],
    en:['HIPAA-compliant encrypted storage (+20-30% cost)','BAA-signed cloud services (AWS/GCP healthcare tier)','7-year audit log retention storage','HA for critical systems (RPO<1min → high cost)']},
  ec:{
    ja:['決済手数料 Stripe: 3.6%+¥40/件','CDN帯域 (商品画像・動画で高コスト傾向)','在庫DB書き込み負荷 (ピーク時コスト増)','不正検知 API ($0.001-0.01/トランザクション)'],
    en:['Payment fees: Stripe 2.9%+$0.30/txn','CDN bandwidth (product images/video intensive)','Inventory DB write load (peaks spike cost)','Fraud detection API ($0.001-0.01/txn)']},
  media:{
    ja:['動画ストレージ・CDN転送が支出の60-80%を占める','エンコード (AWS MediaConvert $0.0075/min)','グローバルCDN帯域 ($0.01-0.085/GB)','オリジンサーバーはスケール可能に設計'],
    en:['Video storage & CDN transfer = 60-80% of spend','Encoding (AWS MediaConvert $0.0075/min)','Global CDN bandwidth ($0.01-0.085/GB)','Design origin for horizontal scale']},
  ai:{
    ja:['LLM APIコスト (GPT-4o: $2.5/1M input tok)','ベクトルDB (Pinecone $70〜/月 or Supabase pgvector)','GPU推論 (A100: $3-5/h on demand)','リクエストキャッシュでAPI呼び出し30-50%削減'],
    en:['LLM API cost (GPT-4o: $2.5/1M input tok)','Vector DB (Pinecone $70+/mo or pgvector free)','GPU inference (A100: $3-5/h on-demand)','Request caching reduces API calls 30-50%']},
  analytics:{
    ja:['データウェアハウス BigQuery: $5/TB クエリ','ストリーム処理 Kafka/Kinesis ($0.015/shard-h)','BI可視化 Metabase/Grafana Cloud (Free〜$500)','データ保持ポリシーでストレージ最適化'],
    en:['Data warehouse: BigQuery $5/TB queried','Stream processing: Kafka/Kinesis ($0.015/shard-h)','BI viz: Metabase/Grafana Cloud (Free-$500)','Data retention policy optimizes storage']},
  iot:{
    ja:['デバイス接続料 AWS IoT Core: $0.08/百万メッセージ','時系列DB (InfluxDB Cloud $250〜 or TimescaleDB)','Edge処理でクラウド転送量を70%削減可能','OTAアップデート配信コスト考慮'],
    en:['Device messaging: AWS IoT Core $0.08/1M msgs','Time-series DB (InfluxDB Cloud $250+ or TimescaleDB)','Edge processing reduces cloud transfer by 70%','Factor in OTA update distribution cost']},
  education:{
    ja:['動画配信CDN (コース動画で帯域大)','ユーザー急増期(入学シーズン)のスケーリングコスト','LMS認定・セキュリティ監査 ($200-1000/年)','無料枠ユーザーのコスト配分戦略が重要'],
    en:['Video CDN (course videos drive bandwidth)','Seasonal scaling cost (enrollment periods)','LMS certification & security audit ($200-1000/yr)','Free-tier user cost allocation strategy critical']},
};
function _costDomain(domain,G){
  var d=DOMAIN_COST_FACTORS[domain];
  if(!d)return null;
  return G?d.ja:d.en;
}

function genPillar27_CostOptimization(a,pn){
  gen109(a,pn);gen110(a,pn);gen111(a,pn);gen112(a,pn);
}

function gen109(a,pn){
  const G=S.genLang==='ja';
  const dep=_costPlatform(a);
  const plt=COST_PLATFORM[dep]||COST_PLATFORM.default;
  const db=_costDB(a);
  const scale=a.scale||'medium';
  let doc='# '+pn+' — '+(G?'コストアーキテクチャ設計書':'Cost Architecture')+'\n';
  doc+='> '+(G?'FinOps原則に基づくクラウドコスト最適化設計':'Cloud cost optimization design based on FinOps principles')+'\n\n';

  doc+='## '+(G?'コスト概要 ('+(a.deploy||'クラウド')+')':'Cost Overview ('+(a.deploy||'Cloud')+')')+'\n\n';
  doc+='| '+(G?'コンポーネント':'Component')+' | '+(G?'モデル':'Model')+' | '+(G?'想定コスト':'Est. Cost')+' | '+(G?'最適化ポイント':'Optimization')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| '+(G?'ホスティング':'Hosting')+' | '+(G?plt.model_ja:plt.model_en)+' | '+plt.pro+' | '+(G?plt.opt_ja:plt.opt_en)+' |\n';
  doc+='| DB | '+db.name+' | '+db.pro+' | '+(G?db.opt_ja:db.opt_en)+' |\n';
  doc+='| CDN / Cache | Cloudflare / Vercel Edge | $0-10/月 | '+(G?'静的アセットを最大限キャッシュ':'Cache static assets aggressively')+' |\n';
  doc+='| '+(G?'モニタリング':'Monitoring')+' | Grafana Cloud / Sentry | $0-29/月 | '+(G?'Freeプランで十分か確認':'Check if Free tier is sufficient')+' |\n';
  doc+='| CI/CD | GitHub Actions | 2000 min/月無料 | '+(G?'キャッシュで実行時間短縮':'Use caching to reduce build time')+' |\n\n';

  doc+='## '+(G?'スケール別コスト試算':'Cost Estimate by Scale')+'\n\n';
  doc+='| '+(G?'フェーズ':'Phase')+' | '+(G?'ユーザー規模':'Users')+' | '+(G?'月額目安 (USD)':'Monthly Est. (USD)')+' | '+(G?'主なコスト':'Main Cost')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| MVP | <100 | $0-20 | '+(G?'無料枠内で運用可':'Within free tier')+' |\n';
  doc+='| Growth | 100-10K | $20-150 | '+(G?'DBとホスティングが主':'DB + hosting dominant')+' |\n';
  doc+='| Scale | 10K-100K | $150-1500 | '+(G?'CDN・キャッシュ・Read Replicaが効果的':'CDN, cache, read replicas effective')+' |\n';
  doc+='| Enterprise | 100K+ | $1500+ | '+(G?'Reserved/Committed Use で30-70%削減':'Reserved/Committed Use saves 30-70%')+' |\n\n';

  doc+='## '+(G?'コスト配分タグ戦略':'Cost Allocation Tag Strategy')+'\n\n```\n';
  doc+=G?'必須タグ (全リソースに付与):\n':'Required tags (apply to all resources):\n';
  doc+='project: '+pn.replace(/\s/g,'-').toLowerCase()+'\n';
  doc+='environment: [dev | staging | prod]\n';
  doc+='team: [frontend | backend | infra]\n';
  doc+='cost-center: [engineering | product]\n```\n\n';

  doc+='## '+(G?'無料枠チェックリスト':'Free Tier Checklist')+'\n\n';
  doc+='- [ ] '+plt.free+' ('+(a.deploy||'hosting')+')\n';
  doc+='- [ ] '+db.free+' ('+db.name+')\n';
  doc+='- [ ] GitHub Actions 2000 min/月\n';
  doc+='- [ ] Cloudflare Free (CDN, DDoS保護)\n';
  doc+='- [ ] Sentry Free (5K events/月)\n';

  /* Domain-specific cost factors */
  var _cd=detectDomain(a.purpose);
  var _cf=_cd?_costDomain(_cd,G):null;
  if(_cf&&_cf.length){
    doc+='\n## '+(G?'ドメイン固有コスト要因 ('+_cd+')':'Domain-Specific Cost Factors ('+_cd+')')+'\n\n';
    doc+=(G?'> このプロジェクトのドメイン固有コスト要因を考慮してください:':'> Consider these domain-specific cost factors for your project:')+'\n\n';
    _cf.forEach(function(f){doc+='- '+f+'\n';});
  }

  S.files['docs/109_cost_architecture.md']=doc;
}

function gen110(a,pn){
  const G=S.genLang==='ja';
  const dep=_costPlatform(a);
  let doc='# '+pn+' — '+(G?'リソース最適化ガイド':'Resource Optimization Guide')+'\n';
  doc+='> '+(G?'コンピュート・DB・ネットワークの効率化戦略':'Compute, DB, and network efficiency strategies')+'\n\n';

  doc+='## '+(G?'コンピュート最適化':'Compute Optimization')+'\n\n';
  if(dep==='aws'){
    doc+='### Auto Scaling (ECS / EC2)\n```yaml\nTargetTrackingScalingPolicy:\n  TargetValue: 70  # CPU 70%目標\n  ScaleOutCooldown: 60\n  ScaleInCooldown: 300\n```\n\n';
  }else if(dep==='gcp'){
    doc+='### Cloud Run Auto Scaling\n```yaml\nspec:\n  template:\n    metadata:\n      annotations:\n        autoscaling.knative.dev/minScale: "0"\n        autoscaling.knative.dev/maxScale: "100"\n```\n\n';
  }else{
    doc+='### '+(G?'スケーリング設定':'Scaling Configuration')+'\n';
    doc+='- '+(G?'最小インスタンス数: 0 (非アクティブ時コスト削減)':'Min instances: 0 (cost saving when idle)')+'\n';
    doc+='- '+(G?'最大インスタンス数: スパイク対応値を設定':'Max instances: set for traffic spikes')+'\n';
    doc+='- '+(G?'スケールイン猶予: 300秒 (チャタリング防止)':'Scale-in cooldown: 300s (prevent thrashing)')+'\n\n';
  }

  doc+='## '+(G?'データベース最適化':'Database Optimization')+'\n\n```sql\n';
  doc+=G?'-- N+1クエリ防止 (eager-load):\n':'-- Prevent N+1 queries (eager-load):\n';
  doc+='SELECT u.*, p.* FROM users u\nLEFT JOIN profiles p ON p.user_id = u.id\nWHERE u.active = true LIMIT 50;\n\n';
  doc+=G?'-- インデックス追加 (検索頻度の高いカラム):\n':'-- Add indexes for high-frequency search columns:\n';
  doc+='CREATE INDEX CONCURRENTLY idx_users_email ON users(email);\nCREATE INDEX CONCURRENTLY idx_created ON users(created_at DESC);\n```\n\n';

  doc+='## '+(G?'キャッシュ戦略':'Cache Strategy')+'\n\n';
  doc+='| '+(G?'対象':'Target')+' | '+(G?'方式':'Method')+' | TTL | '+(G?'実装':'Implementation')+'|\n';
  doc+='|---|---|---|---|\n';
  doc+='| '+(G?'静的アセット':'Static assets')+' | CDN | 365d | Cache-Control: max-age=31536000 |\n';
  doc+='| API '+(G?'レスポンス':'response')+' | Redis/Edge | 60-300s | stale-while-revalidate |\n';
  doc+='| DB '+(G?'クエリ結果':'queries')+' | Redis | 5-60s | '+(G?'ホットデータのみ':'hot data only')+'|\n\n';

  doc+='## '+(G?'ネットワーク最適化':'Network Optimization')+'\n\n';
  doc+='- **Brotli/gzip**: '+(G?'API レスポンスを30-70%削減':'Reduce API response by 30-70%')+'\n';
  doc+='- **HTTP/2**: '+(G?'多重化でリクエスト並列化':'Multiplex requests in parallel')+'\n';
  doc+='- **'+(G?'画像最適化':'Image optimization')+'**: WebP/AVIF + CDN\n';
  doc+='- **Bundle**: Tree-shaking + Code Splitting → <200KB\n\n';

  doc+='## '+(G?'右サイジング推奨':'Right-Sizing Recommendations')+'\n\n';
  doc+='| '+(G?'メトリクス':'Metric')+' | '+(G?'推奨アクション':'Action')+'|\n|---|---|\n';
  doc+='| CPU <20% (7日平均) | '+(G?'1段階下のインスタンスへダウングレード':'Downgrade one instance size')+' |\n';
  doc+='| '+(G?'メモリ':'Memory')+' <30% (7日平均) | '+(G?'RAMを半減してコスト削減':'Halve RAM to reduce cost')+' |\n';
  doc+='| DB接続 <10% (ピーク) | '+(G?'接続プール縮小':'Reduce connection pool size')+' |\n';

  S.files['docs/110_resource_optimization.md']=doc;
}

function gen111(a,pn){
  const G=S.genLang==='ja';
  const scale=a.scale||'medium';
  const budget=scale==='solo'?50:scale==='large'?2000:500;
  const phase=scale==='solo'?(G?'🐛 Crawl':'🐛 Crawl'):scale==='large'?(G?'🏃 Run':'🏃 Run'):(G?'🚶 Walk':'🚶 Walk');
  let doc='# '+pn+' — '+(G?'FinOps 戦略':'FinOps Strategy')+'\n';
  doc+='> '+(G?'クラウド支出の可視化・最適化・ガバナンス':'Cloud spend visibility, optimization, and governance')+'\n\n';

  doc+='## '+(G?'FinOps 成熟度モデル':'FinOps Maturity Model')+'\n\n';
  doc+='| '+(G?'フェーズ':'Phase')+' | '+(G?'特徴':'Characteristics')+' | '+(G?'目標':'Goal')+'|\n|---|---|---|\n';
  doc+='| 🐛 Crawl | '+(G?'コスト可視化・タグ付け開始':'Cost visibility, tagging started')+' | '+(G?'無駄の把握':'Identify waste')+' |\n';
  doc+='| 🚶 Walk | '+(G?'予算アラート・最適化実施':'Budget alerts, optimization')+' | '+(G?'10-30%削減':'10-30% reduction')+' |\n';
  doc+='| 🏃 Run | '+(G?'自動化・予測・文化定着':'Automation, forecasting, culture')+' | '+(G?'継続的最適化':'Continuous optimization')+' |\n\n';
  doc+='**'+(G?'推奨フェーズ ('+scale+')':'Recommended Phase ('+scale+')')+'**: '+phase+'\n\n';

  doc+='## '+(G?'予算・アラート設定例':'Budget & Alert Example')+'\n\n```yaml\nbudgets:\n  - name: '+pn.replace(/\s/g,'-').toLowerCase()+'-monthly\n    amount: '+budget+'\n    currency: USD\n    alerts:\n      - threshold: 50%\n        action: email\n      - threshold: 80%\n        action: slack\n      - threshold: 100%\n        action: pagerduty\n```\n\n';

  doc+='## '+(G?'コスト最適化バックログ':'Cost Optimization Backlog')+'\n\n';
  doc+='| '+(G?'項目':'Item')+' | '+(G?'削減効果':'Impact')+' | '+(G?'工数':'Effort')+' | '+(G?'優先度':'Priority')+'|\n|---|---|---|---|\n';
  doc+='| '+(G?'未使用リソースの削除':'Delete unused resources')+' | High | Low | P0 |\n';
  doc+='| Reserved Instance (1yr) | 30-40% | Low | P0 |\n';
  doc+='| '+(G?'画像最適化 (WebP/AVIF)':'Image optimization (WebP/AVIF)')+' | 20-40% CDN | Medium | P1 |\n';
  doc+='| '+(G?'DBコネクション最適化':'DB connection tuning')+' | 15% | Low | P1 |\n';
  doc+='| Spot/Preemptible VMs | 60-90% compute | High | P2 |\n\n';

  doc+='## '+(G?'FinOps レビュー体制':'FinOps Review Cadence')+'\n\n';
  doc+='| '+(G?'頻度':'Frequency')+' | '+(G?'アクション':'Action')+'|\n|---|---|\n';
  doc+='| '+(G?'週次':'Weekly')+' | '+(G?'コストスパイクの確認・異常アラート対応':'Review cost spikes, respond to alerts')+' |\n';
  doc+='| '+(G?'月次':'Monthly')+' | '+(G?'予算 vs 実績・最適化バックログ更新':'Budget vs actual, update backlog')+' |\n';
  doc+='| '+(G?'四半期':'Quarterly')+' | '+(G?'RI/Committed Use見直し・アーキレビュー':'Review RIs, architecture review')+' |\n';

  S.files['docs/111_finops_strategy.md']=doc;
}

function gen112(a,pn){
  const G=S.genLang==='ja';
  const dep=_costPlatform(a);
  let doc='# '+pn+' — '+(G?'コスト監視・アラート':'Cost Monitoring & Alerting')+'\n';
  doc+='> '+(G?'リアルタイムコスト監視と異常検知の設定ガイド':'Real-time cost monitoring and anomaly detection')+'\n\n';

  doc+='## '+(G?'監視ツール構成':'Monitoring Tools')+'\n\n';
  doc+='| '+(G?'ツール':'Tool')+' | '+(G?'用途':'Use')+' | '+(G?'コスト':'Cost')+'|\n|---|---|---|\n';
  if(dep==='aws'){
    doc+='| AWS Cost Explorer | '+(G?'コスト分析・予測':'Cost analysis + forecast')+' | $0.01/API call |\n';
    doc+='| AWS Budgets | '+(G?'予算アラート':'Budget alerts')+' | $0.02/budget/月 |\n';
    doc+='| CloudWatch | '+(G?'リソース使用率監視':'Resource monitoring')+' | Free (basic) |\n';
  }else{
    doc+='| Grafana Cloud | '+(G?'コスト可視化':'Cost visualization')+' | Free (3 users) |\n';
    doc+='| Infracost | CI/CD '+(G?'コスト見積':'cost estimation')+' | Open source |\n';
    doc+='| OpenCost | K8s '+(G?'コスト割り当て':'cost allocation')+' | Open source |\n';
  }
  doc+='| Sentry | '+(G?'エラー率監視':'Error rate monitoring')+' | Free (5K events) |\n\n';

  doc+='## '+(G?'アラートしきい値設定':'Alert Thresholds')+'\n\n```yaml\nalerts:\n  cost_spike:\n    condition: '+(G?'前日比 +30%以上':'daily increase > 30%')+'\n    action: slack #cost-alerts\n  unused_resource:\n    condition: CPU <5% for 7d\n    action: notify\n  budget_forecast:\n    condition: forecast >90%\n    action: email + slack\n```\n\n';

  doc+='## '+(G?'月次コストレビューチェックリスト':'Monthly Review Checklist')+'\n\n';
  doc+='- [ ] '+(G?'実績コスト vs 予算の確認':'Actual cost vs budget check')+'\n';
  doc+='- [ ] '+(G?'+20%以上増加のサービスを特定':'Identify services with >20% MoM increase')+'\n';
  doc+='- [ ] '+(G?'未使用リソースの棚卸し':'Audit unused resources')+'\n';
  doc+='- [ ] '+(G?'RI / Committed Use の有効期限確認':'Check RI/CUD expiration dates')+'\n';
  doc+='- [ ] docs/111_finops_strategy.md '+(G?'の最適化バックログ更新':'optimization backlog update')+'\n\n';

  doc+='## '+(G?'AI コスト分析プロンプト':'AI Cost Analysis Prompt')+'\n\n```\n';
  doc+=G?'以下のコスト請求データを分析して最適化提案を出してください。\n[先月の請求書サマリーを貼り付け]\n\n分析:\n1. コストドライバー TOP3 の特定\n2. 前月比異常増加サービスのフラグ\n3. 即時削減施策と推定削減額\n4. docs/111_finops_strategy.md バックログへの追加項目':'Analyze the following cloud cost data and provide optimization recommendations.\n[Paste last month\'s billing summary]\n\nAnalyze:\n1. Identify TOP 3 cost drivers\n2. Flag services with abnormal MoM increases\n3. Immediate actions with estimated savings\n4. Items to add to docs/111_finops_strategy.md backlog';
  doc+='\n```\n';

  S.files['docs/112_cost_monitoring.md']=doc;
}
