/* ═══ PILLAR ⑭: OPS INTELLIGENCE ═══ */

function genPillar14_OpsIntelligence(a, pn) {
  const G = S.genLang === 'ja';
  const domain = detectDomain(a.purpose) || '_default';
  const arch = resolveArch(a);
  const ops = DOMAIN_OPS[domain] || DOMAIN_OPS._default;
  const deployTarget = a.deploy || 'Vercel';
  const isBaaS = arch.isBaaS;
  const db = a.database || 'PostgreSQL';

  // ═══ File 53: Ops Runbook (Ops Plane Design) ═══
  let runbook = `# ${pn} ${G ? '— 運用設計書 (Ops Plane)' : '— Ops Runbook (Ops Plane)'}\n\n`;
  runbook += G
    ? `**ドメイン**: ${domain} | **SLO**: ${ops.slo} | **アーキテクチャ**: ${arch.pattern}\n\n`
    : `**Domain**: ${domain} | **SLO**: ${ops.slo} | **Architecture**: ${arch.pattern}\n\n`;

  // Section 1: Ops Plane Architecture
  runbook += `## ${G ? '1. Ops Plane アーキテクチャ' : '1. Ops Plane Architecture'}\n\n`;
  runbook += G
    ? `**設計原則**: アプリケーション平面(App Plane)と運用平面(Ops Plane)を明確に分離し、運用操作が開発フローを阻害しないようにする。\n\n`
    : `**Design Principle**: Clearly separate Application Plane (App Plane) and Operations Plane (Ops Plane) so operational tasks don't interfere with development flow.\n\n`;

  runbook += '```mermaid\ngraph TB\n';
  runbook += '  subgraph "App Plane"\n';
  runbook += '    A1[' + (G ? 'ユーザーリクエスト' : 'User Requests') + ']\n';
  runbook += '    A2[' + (G ? 'ビジネスロジック' : 'Business Logic') + ']\n';
  runbook += '    A3[' + (G ? 'データベース' : 'Database') + ']\n';
  runbook += '  end\n';
  runbook += '  subgraph "Ops Plane"\n';
  runbook += '    O1[' + (G ? 'Feature Flags' : 'Feature Flags') + ']\n';
  runbook += '    O2[' + (G ? 'Observability' : 'Observability') + ']\n';
  runbook += '    O3[' + (G ? 'Job Queue' : 'Job Queue') + ']\n';
  runbook += '    O4[' + (G ? 'Backup/Recovery' : 'Backup/Recovery') + ']\n';
  runbook += '  end\n';
  runbook += '  A1 --> A2\n  A2 --> A3\n';
  runbook += '  O1 -.-> A2\n  O2 -.-> A1\n  O2 -.-> A2\n  O2 -.-> A3\n';
  runbook += '  A2 --> O3\n  A3 --> O4\n';
  runbook += '```\n\n';

  // Section 2: Feature Flags & Kill Switches
  runbook += `## ${G ? '2. Feature Flags & Kill Switches' : '2. Feature Flags & Kill Switches'}\n\n`;
  runbook += G
    ? `**目的**: 本番環境でコード変更なしに機能の有効化/無効化を制御し、障害時の迅速な対応を可能にする。\n\n`
    : `**Purpose**: Control feature enable/disable in production without code changes, enabling rapid response to incidents.\n\n`;

  runbook += `### ${G ? 'ドメイン固有フラグ' : 'Domain-Specific Flags'}\n\n`;
  const flags = G ? ops.flags_ja : ops.flags_en;
  flags.forEach((flag, i) => {
    runbook += `${i + 1}. **${flag}**\n`;
  });
  runbook += '\n';

  // Implementation pattern
  runbook += `### ${G ? '実装パターン' : 'Implementation Pattern'}\n\n`;
  if (isBaaS) {
    runbook += G
      ? `**環境変数ベース** (推奨): \`NEXT_PUBLIC_FEATURE_*\` でクライアント側制御、Server Actions で \`process.env.FEATURE_*\` でサーバー側制御\n\n`
      : `**Environment Variables** (recommended): \`NEXT_PUBLIC_FEATURE_*\` for client-side, \`process.env.FEATURE_*\` for server-side in Server Actions\n\n`;
    runbook += '```typescript\n';
    runbook += '// Client-side flag check\n';
    runbook += 'const isPaymentEnabled = process.env.NEXT_PUBLIC_FEATURE_PAYMENT === \'true\';\n\n';
    runbook += '// Server-side flag check (Server Action)\n';
    runbook += 'export async function processPayment() {\n';
    runbook += '  if (process.env.FEATURE_PAYMENT_PROCESSING !== \'true\') {\n';
    runbook += '    throw new Error(\'Payment processing is disabled\');\n';
    runbook += '  }\n';
    runbook += '  // ... payment logic\n';
    runbook += '}\n```\n\n';
  } else {
    runbook += G
      ? `**データベーステーブル** (柔軟性): \`feature_flags\` テーブルで管理し、API経由で動的に変更\n\n`
      : `**Database Table** (flexible): Manage in \`feature_flags\` table, dynamically change via API\n\n`;
    runbook += '```sql\n';
    runbook += 'CREATE TABLE feature_flags (\n';
    runbook += '  name VARCHAR(100) PRIMARY KEY,\n';
    runbook += '  enabled BOOLEAN NOT NULL DEFAULT false,\n';
    runbook += '  description TEXT,\n';
    runbook += '  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n';
    runbook += ');\n';
    runbook += '```\n\n';
  }

  // Section 3: SLO/SLI Definition
  runbook += `## ${G ? '3. SLO/SLI 定義' : '3. SLO/SLI Definition'}\n\n`;
  runbook += G
    ? `**目標SLO**: ${ops.slo} (ドメイン: ${domain})\n\n`
    : `**Target SLO**: ${ops.slo} (Domain: ${domain})\n\n`;

  runbook += `### ${G ? 'SLI (Service Level Indicators)' : 'SLI (Service Level Indicators)'}\n\n`;
  runbook += G
    ? `| 指標 | 目標値 | 計測方法 |\n|------|--------|----------|\n`
    : `| Indicator | Target | Measurement |\n|-----------|--------|-------------|\n`;

  // Domain-specific SLI targets
  const sliTargets = {
    fintech: [
      { metric: G ? '取引成功率' : 'Transaction Success Rate', target: '99.99%', method: G ? 'transaction_logs集計' : 'Aggregate transaction_logs' },
      { metric: G ? 'API応答時間 (P99)' : 'API Response Time (P99)', target: '200ms', method: G ? 'APM/ログ' : 'APM/Logs' },
      { metric: G ? '不正検知精度' : 'Fraud Detection Accuracy', target: '92%+', method: G ? 'ML評価指標' : 'ML evaluation metrics' }
    ],
    health: [
      { metric: G ? 'データ可用性' : 'Data Availability', target: '99.99%', method: G ? 'ヘルスチェックエンドポイント' : 'Health check endpoint' },
      { metric: G ? 'PHI暗号化率' : 'PHI Encryption Rate', target: '100%', method: G ? '監査ログ検証' : 'Audit log verification' },
      { metric: G ? '通知到達率' : 'Notification Delivery Rate', target: '95%+', method: G ? '送信/配信ログ比較' : 'Compare sent/delivered logs' }
    ],
    education: [
      { metric: G ? '学習進捗保存率' : 'Progress Save Rate', target: '99.9%', method: G ? 'localStorage + バックエンド同期' : 'localStorage + backend sync' },
      { metric: G ? 'コンテンツ配信成功率' : 'Content Delivery Success', target: '99.9%', method: G ? 'CDN/ストレージログ' : 'CDN/storage logs' },
      { metric: G ? '試験可用性' : 'Exam Availability', target: '99.95%', method: G ? '試験開始成功率' : 'Exam start success rate' }
    ],
    ec: [
      { metric: G ? '決済成功率' : 'Payment Success Rate', target: '99.5%', method: G ? 'Stripe Webhookログ' : 'Stripe webhook logs' },
      { metric: G ? 'カート処理時間' : 'Cart Processing Time', target: '<500ms', method: G ? 'APMトレース' : 'APM traces' },
      { metric: G ? '在庫同期精度' : 'Inventory Sync Accuracy', target: '99.9%', method: G ? '差分検証ジョブ' : 'Diff verification job' }
    ],
    _default: [
      { metric: G ? 'アップタイム' : 'Uptime', target: ops.slo, method: G ? 'ヘルスチェックエンドポイント' : 'Health check endpoint' },
      { metric: G ? 'API応答時間 (P95)' : 'API Response Time (P95)', target: '<1s', method: G ? 'APM' : 'APM' },
      { metric: G ? 'エラー率' : 'Error Rate', target: '<1%', method: G ? 'ログ集計' : 'Log aggregation' }
    ]
  };

  const slis = sliTargets[domain] || sliTargets._default;
  slis.forEach(sli => {
    runbook += `| ${sli.metric} | ${sli.target} | ${sli.method} |\n`;
  });
  runbook += '\n';

  // Section 4: Observability Stack
  runbook += `## ${G ? '4. Observability Stack' : '4. Observability Stack'}\n\n`;
  runbook += `### ${G ? 'ログ・メトリクス・トレース' : 'Logs, Metrics, Traces'}\n\n`;

  // Deploy target specific observability
  if (deployTarget.includes('Vercel')) {
    runbook += G
      ? `**Vercel統合**: Vercel Analytics (Core Web Vitals), Vercel Log Drains → Datadog/Axiom\n\n`
      : `**Vercel Integration**: Vercel Analytics (Core Web Vitals), Vercel Log Drains → Datadog/Axiom\n\n`;
    runbook += '```typescript\n';
    runbook += '// app/layout.tsx\n';
    runbook += 'import { Analytics } from \'@vercel/analytics/react\';\n';
    runbook += 'export default function RootLayout({ children }) {\n';
    runbook += '  return <html><body>{children}<Analytics /></body></html>;\n';
    runbook += '}\n```\n\n';
  } else if (deployTarget.includes('Railway') || deployTarget.includes('Render')) {
    runbook += G
      ? `**Container環境**: Prometheus (メトリクス), Grafana (可視化), Loki (ログ集約)\n\n`
      : `**Container Environment**: Prometheus (metrics), Grafana (visualization), Loki (log aggregation)\n\n`;
    runbook += '```yaml\n';
    runbook += '# docker-compose.yml (monitoring stack)\n';
    runbook += 'services:\n';
    runbook += '  prometheus:\n';
    runbook += '    image: prom/prometheus\n';
    runbook += '    volumes:\n';
    runbook += '      - ./prometheus.yml:/etc/prometheus/prometheus.yml\n';
    runbook += '  grafana:\n';
    runbook += '    image: grafana/grafana\n';
    runbook += '    depends_on: [prometheus]\n';
    runbook += '```\n\n';
  } else if (deployTarget.includes('AWS')) {
    runbook += G
      ? `**AWS統合**: CloudWatch (ログ+メトリクス), X-Ray (トレース), CloudWatch Insights (クエリ)\n\n`
      : `**AWS Integration**: CloudWatch (logs+metrics), X-Ray (traces), CloudWatch Insights (queries)\n\n`;
  } else {
    runbook += G
      ? `**汎用スタック**: Sentry (エラー追跡), Axiom (ログ), ホスティングプラットフォームのビルトインツール\n\n`
      : `**Generic Stack**: Sentry (error tracking), Axiom (logs), hosting platform built-in tools\n\n`;
  }

  // Section 5: Job Management & Queues
  runbook += `## ${G ? '5. Job Management & Queues' : '5. Job Management & Queues'}\n\n`;
  runbook += `### ${G ? 'バックグラウンドジョブ' : 'Background Jobs'}\n\n`;
  const jobs = G ? ops.jobs_ja : ops.jobs_en;
  jobs.forEach((job, i) => {
    runbook += `${i + 1}. **${job}**\n`;
  });
  runbook += '\n';

  runbook += `### ${G ? '実装方法' : 'Implementation'}\n\n`;
  if (isBaaS) {
    runbook += G
      ? `**BaaS環境**: \n- **Vercel Cron Jobs**: \`vercel.json\` で定期実行 (簡易ジョブ)\n- **Supabase pg_cron**: PostgreSQL拡張で定期SQL実行 (DB操作)\n- **Inngest/Trigger.dev**: 複雑ワークフロー向けサードパーティ\n\n`
      : `**BaaS Environment**: \n- **Vercel Cron Jobs**: Define in \`vercel.json\` for periodic execution (simple jobs)\n- **Supabase pg_cron**: PostgreSQL extension for scheduled SQL (DB operations)\n- **Inngest/Trigger.dev**: Third-party for complex workflows\n\n`;
    runbook += '```json\n';
    runbook += '// vercel.json\n';
    runbook += '{\n';
    runbook += '  "crons": [{\n';
    runbook += '    "path": "/api/cron/daily-aggregation",\n';
    runbook += '    "schedule": "0 0 * * *"\n';
    runbook += '  }]\n';
    runbook += '}\n```\n\n';
  } else {
    runbook += G
      ? `**Traditional/Container環境**: \n- **BullMQ** (Node.js): Redis ベースのジョブキュー (推奨)\n- **node-cron**: シンプルな定期実行\n- **Celery** (Python): 分散タスクキュー\n\n`
      : `**Traditional/Container Environment**: \n- **BullMQ** (Node.js): Redis-based job queue (recommended)\n- **node-cron**: Simple scheduled execution\n- **Celery** (Python): Distributed task queue\n\n`;
    runbook += '```typescript\n';
    runbook += '// BullMQ example\n';
    runbook += 'import { Queue, Worker } from \'bullmq\';\n';
    runbook += 'const myQueue = new Queue(\'aggregation\');\n';
    runbook += 'await myQueue.add(\'daily\', { date: new Date() }, { repeat: { cron: \'0 0 * * *\' } });\n';
    runbook += '```\n\n';
  }

  // Section 6: Backup & Recovery
  runbook += `## ${G ? '6. Backup & Recovery' : '6. Backup & Recovery'}\n\n`;
  const backups = G ? ops.backup_ja : ops.backup_en;
  backups.forEach((backup, i) => {
    runbook += `${i + 1}. ${backup}\n`;
  });
  runbook += '\n';

  runbook += `### ${G ? '実装パス' : 'Implementation Path'}\n\n`;
  if (db === 'PostgreSQL' || db === 'Supabase') {
    runbook += '```bash\n';
    runbook += '# PostgreSQL WAL-based continuous backup\n';
    runbook += 'pg_basebackup -D /backup/base -Fp -Xs -P\n';
    runbook += '# Point-in-time recovery (PITR)\n';
    runbook += 'restore_command = \'cp /archive/%f %p\'\n';
    runbook += 'recovery_target_time = \'2026-02-13 12:00:00\'\n';
    runbook += '```\n\n';
  } else if (db.includes('Firebase') || db.includes('MongoDB')) {
    runbook += '```bash\n';
    runbook += '# Firestore export (daily)\n';
    runbook += 'gcloud firestore export gs://[BUCKET]/backups/$(date +%Y%m%d)\n';
    runbook += '# MongoDB backup\n';
    runbook += 'mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)\n';
    runbook += '```\n\n';
  }

  // Section 7: Rate Limiting & Throttling
  runbook += `## ${G ? '7. Rate Limiting & Throttling' : '7. Rate Limiting & Throttling'}\n\n`;
  runbook += G
    ? `**ドメイン別デフォルト閾値**:\n\n`
    : `**Domain-Specific Default Thresholds**:\n\n`;

  const rateLimits = {
    fintech: { api: '100 req/min/user', payment: '10 txn/min/user', alert: '5 failed/min → 一時ロック' },
    health: { api: '60 req/min/user', diagnostic: '5 req/min/user', alert: '3 failed → 手動確認' },
    education: { api: '120 req/min/user', quiz: '10 submit/min', alert: '連続失敗5回 → カンニング検知' },
    ec: { api: '100 req/min/user', checkout: '3 attempt/min', alert: '10 failed → 不正検知' },
    saas: { api: '100 req/min/user', signup: '5/hour/IP', alert: 'rate limit超過 → スロットリング' },
    _default: { api: '60 req/min/user', write: '30 req/min/user', alert: '閾値80% → アラート' }
  };

  const limits = rateLimits[domain] || rateLimits._default;
  runbook += G
    ? `- **API全体**: ${limits.api}\n- **重要操作**: ${limits.write || limits.payment || limits.diagnostic || limits.quiz || limits.checkout || limits.signup}\n- **アラート**: ${limits.alert}\n\n`
    : `- **Overall API**: ${limits.api}\n- **Critical Operations**: ${limits.write || limits.payment || limits.diagnostic || limits.quiz || limits.checkout || limits.signup}\n- **Alerting**: ${limits.alert}\n\n`;

  if (!isBaaS) {
    runbook += '```typescript\n';
    runbook += '// Redis-based rate limiter (express middleware)\n';
    runbook += 'import rateLimit from \'express-rate-limit\';\n';
    runbook += 'import RedisStore from \'rate-limit-redis\';\n';
    runbook += 'const limiter = rateLimit({\n';
    runbook += '  store: new RedisStore({ client: redis }),\n';
    runbook += '  windowMs: 60 * 1000, max: 100\n';
    runbook += '});\n';
    runbook += 'app.use(\'/api\', limiter);\n';
    runbook += '```\n\n';
  }

  S.files['docs/53_ops_runbook.md'] = runbook;

  // ═══ File 54: Ops Checklist (Day-1 Operations) ═══
  let checklist = `# ${pn} ${G ? '— 運用準備チェックリスト (Day-1)' : '— Ops Readiness Checklist (Day-1)'}\n\n`;
  checklist += G
    ? `**目的**: 本番環境リリース前に、運用に必要な12のカテゴリーの準備状況を確認する。\n\n`
    : `**Purpose**: Verify readiness across 12 operational capability categories before production release.\n\n`;

  // 12 Ops Capabilities Matrix
  checklist += `## ${G ? '12 Ops Capabilities Matrix' : '12 Ops Capabilities Matrix'}\n\n`;

  const capabilities = [
    // 観測 (Observability) - 4 categories
    {
      cat: G ? '🔍 1. ログ集約' : '🔍 1. Log Aggregation',
      items: G
        ? ['アプリケーションログ出力先設定済み', 'エラーログ構造化 (JSON形式)', 'ログレベル設定 (info/warn/error)', 'センシティブ情報マスキング']
        : ['Application log destination configured', 'Error logs structured (JSON format)', 'Log levels configured (info/warn/error)', 'Sensitive info masked']
    },
    {
      cat: G ? '📊 2. メトリクス収集' : '📊 2. Metrics Collection',
      items: G
        ? ['SLI指標計測コード実装済み', 'APM/計測ツール統合', 'ビジネスメトリクス定義', 'メトリクス保持期間設定']
        : ['SLI measurement code implemented', 'APM/instrumentation integrated', 'Business metrics defined', 'Metrics retention configured']
    },
    {
      cat: G ? '🔔 3. アラート設定' : '🔔 3. Alerting Setup',
      items: G
        ? ['SLO違反アラート設定', 'エラー率閾値アラート', '通知チャネル設定 (Slack/Email)', 'エスカレーションパス定義']
        : ['SLO breach alerts configured', 'Error rate threshold alerts', 'Notification channels (Slack/Email)', 'Escalation path defined']
    },
    {
      cat: G ? '🔎 4. トレーシング' : '🔎 4. Distributed Tracing',
      items: G
        ? ['重要パストレース実装', 'トレースIDログ出力', 'ボトルネック特定可能', 'トレース保持期間設定']
        : ['Critical path tracing implemented', 'Trace ID in logs', 'Bottleneck identification enabled', 'Trace retention configured']
    },
    // 制御 (Control) - 3 categories
    {
      cat: G ? '🚩 5. Feature Flags' : '🚩 5. Feature Flags',
      items: G
        ? ['フラグ管理システム選定済み', 'ドメイン固有フラグ定義', 'Kill Switch実装', 'フラグ変更ログ記録']
        : ['Flag management system chosen', 'Domain-specific flags defined', 'Kill switches implemented', 'Flag change logging']
    },
    {
      cat: G ? '⚖️ 6. Rate Limiting' : '⚖️ 6. Rate Limiting',
      items: G
        ? ['API Rate Limit実装', 'ドメイン別閾値設定', '超過時レスポンス定義', 'ホワイトリスト機能']
        : ['API rate limits implemented', 'Domain-specific thresholds set', 'Exceeded response defined', 'Whitelist capability']
    },
    {
      cat: G ? '🎛️ 7. Admin Console' : '🎛️ 7. Admin Console',
      items: G
        ? ['管理画面アクセス制御 (RBAC)', '監査ログ記録', 'Feature Flag切替UI', '緊急停止機能']
        : ['Admin console access control (RBAC)', 'Audit logging', 'Feature flag toggle UI', 'Emergency stop feature']
    },
    // 復旧 (Recovery) - 3 categories
    {
      cat: G ? '💾 8. バックアップ' : '💾 8. Backup',
      items: G
        ? ['自動バックアップ設定', 'RPO/RTO定義文書化', 'バックアップ検証手順', 'オフサイト保存']
        : ['Automated backup configured', 'RPO/RTO documented', 'Backup verification procedure', 'Off-site storage']
    },
    {
      cat: G ? '🔄 9. リストア手順' : '🔄 9. Restore Procedure',
      items: G
        ? ['リストアRunbook作成', 'PITR手順文書化', 'リストアテスト実施済み', 'RTO目標達成確認']
        : ['Restore runbook created', 'PITR procedure documented', 'Restore test completed', 'RTO target verified']
    },
    {
      cat: G ? '🚨 10. インシデント対応' : '🚨 10. Incident Response',
      items: G
        ? ['対応フロー定義 (docs/34参照)', 'オンコール体制', 'エスカレーション基準', 'ポストモーテムプロセス']
        : ['Response flow defined (see docs/34)', 'On-call rotation', 'Escalation criteria', 'Post-mortem process']
    },
    // ガバナンス (Governance) - 2 categories
    {
      cat: G ? '📝 11. 変更管理' : '📝 11. Change Management',
      items: G
        ? ['デプロイ承認プロセス', 'Canary/Blue-Green戦略', 'ロールバック手順', '変更ログ記録']
        : ['Deploy approval process', 'Canary/Blue-Green strategy', 'Rollback procedure', 'Change log recording']
    },
    {
      cat: G ? '🔐 12. セキュリティ監査' : '🔐 12. Security Audit',
      items: G
        ? ['OWASP Top 10対策確認 (docs/48参照)', 'シークレット管理検証', 'アクセスログ監視', '定期脆弱性スキャン']
        : ['OWASP Top 10 mitigations verified (see docs/48)', 'Secrets management validated', 'Access log monitoring', 'Regular vulnerability scans']
    }
  ];

  capabilities.forEach(cap => {
    checklist += `### ${cap.cat}\n\n`;
    cap.items.forEach(item => {
      checklist += `- [ ] ${item}\n`;
    });
    checklist += '\n';
  });

  // Domain-Specific Hardening
  checklist += `## ${G ? 'ドメイン固有強化項目' : 'Domain-Specific Hardening'}\n\n`;
  checklist += G ? `**${domain}ドメイン** の追加要件:\n\n` : `**${domain} Domain** additional requirements:\n\n`;
  const hardening = G ? ops.hardening_ja : ops.hardening_en;
  hardening.forEach((item, i) => {
    checklist += `- [ ] ${item}\n`;
  });
  checklist += '\n';

  // Admin Console Security
  checklist += `## ${G ? 'Admin Console セキュリティ' : 'Admin Console Security'}\n\n`;
  checklist += G
    ? `**原則**: 管理機能は最強の攻撃面。通常ユーザーと同じ認証フローではなく、追加の保護層が必要。\n\n`
    : `**Principle**: Admin features are the strongest attack surface. They require additional protection layers beyond normal user auth.\n\n`;

  checklist += G
    ? `- [ ] **多要素認証 (MFA) 必須**: 管理者アカウントは全員MFA有効化\n`
    : `- [ ] **MFA Mandatory**: All admin accounts must have MFA enabled\n`;
  checklist += G
    ? `- [ ] **IP制限**: 管理画面アクセスを社内IP/VPNに制限\n`
    : `- [ ] **IP Restriction**: Limit admin console access to office IP/VPN\n`;
  checklist += G
    ? `- [ ] **権限分離**: 閲覧者/編集者/管理者の3段階以上\n`
    : `- [ ] **Permission Separation**: At least 3 tiers (viewer/editor/admin)\n`;
  checklist += G
    ? `- [ ] **監査ログ**: 全管理操作をログ記録 (who/what/when)\n`
    : `- [ ] **Audit Logging**: Log all admin operations (who/what/when)\n`;
  checklist += G
    ? `- [ ] **セッションタイムアウト**: 15分無操作で自動ログアウト\n`
    : `- [ ] **Session Timeout**: Auto-logout after 15min inactivity\n`;
  checklist += G
    ? `- [ ] **操作確認**: 破壊的操作 (削除/無効化) は確認ダイアログ必須\n\n`
    : `- [ ] **Confirmation Dialog**: Destructive actions (delete/disable) require confirmation\n\n`;

  // Monitoring Thresholds
  checklist += `## ${G ? 'モニタリング閾値' : 'Monitoring Thresholds'}\n\n`;
  checklist += G ? `**${domain}ドメイン** のデフォルトアラート設定:\n\n` : `**${domain} Domain** default alert settings:\n\n`;
  checklist += G
    ? `| メトリクス | Warning | Critical | アクション |\n|----------|---------|----------|----------|\n`
    : `| Metric | Warning | Critical | Action |\n|--------|---------|----------|--------|\n`;

  const thresholds = {
    fintech: [
      { metric: G ? 'エラー率' : 'Error Rate', warn: '0.1%', crit: '0.5%', action: G ? 'Kill Switch検討' : 'Consider Kill Switch' },
      { metric: G ? '取引遅延' : 'Txn Latency', warn: '500ms', crit: '1s', action: G ? 'スケール検討' : 'Consider Scaling' },
      { metric: G ? '不正検知スコア' : 'Fraud Score', warn: '5%', crit: '10%', action: G ? '手動レビュー' : 'Manual Review' }
    ],
    education: [
      { metric: G ? 'エラー率' : 'Error Rate', warn: '1%', crit: '3%', action: G ? '調査' : 'Investigate' },
      { metric: G ? '進捗保存失敗' : 'Progress Save Fail', warn: '0.5%', crit: '1%', action: G ? 'バックアップ確認' : 'Check Backup' },
      { metric: G ? 'CDN遅延' : 'CDN Latency', warn: '2s', crit: '5s', action: G ? 'CDN確認' : 'Check CDN' }
    ],
    _default: [
      { metric: G ? 'エラー率' : 'Error Rate', warn: '1%', crit: '5%', action: G ? '調査' : 'Investigate' },
      { metric: G ? 'API遅延 (P95)' : 'API Latency (P95)', warn: '1s', crit: '3s', action: G ? 'スケール検討' : 'Consider Scaling' },
      { metric: G ? 'ディスク使用率' : 'Disk Usage', warn: '80%', crit: '90%', action: G ? 'クリーンアップ' : 'Cleanup' }
    ]
  };

  const thresholdsTable = thresholds[domain] || thresholds._default;
  thresholdsTable.forEach(t => {
    checklist += `| ${t.metric} | ${t.warn} | ${t.crit} | ${t.action} |\n`;
  });
  checklist += '\n';

  checklist += G
    ? `## 次のステップ\n\n1. 上記チェックリストを全項目確認\n2. 不足項目は \`docs/34_incident_response.md\` および \`docs/53_ops_runbook.md\` を参照して実装\n3. ステージング環境で障害シミュレーション実施\n4. 本番リリース後、最初の1週間は密に監視\n`
    : `## Next Steps\n\n1. Verify all checklist items above\n2. Implement missing items referencing \`docs/34_incident_response.md\` and \`docs/53_ops_runbook.md\`\n3. Run failure simulations in staging environment\n4. Monitor closely for the first week after production release\n`;

  S.files['docs/54_ops_checklist.md'] = checklist;

  // ── docs/55: Ops Plane Design ──
  let opsPlane = `# ${G ? 'Ops Plane 設計書' : 'Ops Plane Design'}\n\n`;
  opsPlane += `**${G ? 'プロジェクト' : 'Project'}**: ${S.projectName}  \n`;
  opsPlane += `**${G ? '生成日時' : 'Generated'}**: ${new Date().toISOString().split('T')[0]}  \n`;
  opsPlane += `**${G ? '対象ドメイン' : 'Domain'}**: ${domain}  \n`;
  opsPlane += `**${G ? 'SLO' : 'SLO'}**: ${ops.slo}  \n\n`;

  opsPlane += G
    ? `> **この文書の目的**: DevForge v9は世界で唯一、ドメイン×アーキテクチャ×デプロイ先の組み合わせから **Ops Plane (運用面)** を自動設計します。App Plane (アプリケーション面) とOps Planeの責任分離、12 Ops Capabilities の実装パターン、Circuit Breaker 設計、Dev×Ops AI Agent 分離を含む、実運用を見据えた設計書です。\n\n`
    : `> **Purpose of this document**: DevForge v9 is the world's only tool that auto-designs the **Ops Plane** based on Domain × Architecture × Deployment target combinations. This document covers App Plane / Ops Plane responsibility separation, 12 Ops Capabilities implementation patterns, Circuit Breaker design, and Dev×Ops AI Agent separation for production-ready operations.\n\n`;

  // § 1. Ops Plane Architecture
  opsPlane += `---\n\n## ${G ? '§ 1. Ops Plane アーキテクチャ（深層設計）' : '§ 1. Ops Plane Architecture (Deep Design)'}\n\n`;

  opsPlane += G
    ? `### App Plane vs Ops Plane の分離原則\n\n**参考**: 「アプリケーションに運用の仕組みを内蔵させる」(12 Ops Capabilities / Ops Plane設計)\n\n- **App Plane**: ビジネスロジック・UI・API・データモデル\n- **Ops Plane**: 監視・制御・復旧・ガバナンス\n\n分離により、**運用変更がアプリコードに影響しない** 設計を実現。\n\n`
    : `### App Plane vs Ops Plane Separation Principles\n\n**Reference**: "Build Operations into Applications" (12 Ops Capabilities / Ops Plane Design)\n\n- **App Plane**: Business logic, UI, API, Data model\n- **Ops Plane**: Observation, Control, Recovery, Governance\n\nSeparation ensures **operational changes don't affect app code**.\n\n`;

  // Mermaid diagram
  opsPlane += '```mermaid\n';
  opsPlane += 'graph TB\n';
  opsPlane += '  subgraph Observation\n';
  opsPlane += '    O1[Logs] --> O2[Metrics]\n';
  opsPlane += '    O2 --> O3[Traces]\n';
  opsPlane += '    O3 --> O4[Business Analytics]\n';
  opsPlane += '  end\n';
  opsPlane += '  subgraph Control\n';
  opsPlane += '    C1[Feature Flags] --> C2[Circuit Breaker]\n';
  opsPlane += '    C2 --> C3[Rate Limiting]\n';
  opsPlane += '  end\n';
  opsPlane += '  subgraph Recovery\n';
  opsPlane += '    R1[Job Retry] --> R2[Data Recovery]\n';
  opsPlane += '    R2 --> R3[Backup Validation]\n';
  opsPlane += '  end\n';
  opsPlane += '  subgraph Governance\n';
  opsPlane += '    G1[Audit Log] --> G2[RBAC+Approval]\n';
  opsPlane += '  end\n';
  opsPlane += '  Observation --> Control\n';
  opsPlane += '  Control --> Recovery\n';
  opsPlane += '  Recovery --> Governance\n';
  opsPlane += '```\n\n';

  // Built-in vs External decision framework
  opsPlane += G
    ? `### 内蔵 vs 外付け 判断フレーム\n\n| 機能 | 内蔵推奨 | 外付け推奨 | 理由 |\n|------|---------|-----------|------|\n| Feature Flag | ✅ | | アプリケーションロジックと密結合 |\n| Kill Switch | ✅ | | 緊急停止は最速レスポンス必須 |\n| Rate Limiting | ✅ | △ | BaaS: Edge Function, Traditional: アプリ層 + CDN/LB |\n| Logs | | ✅ | 集約・分析は外部サービスが高機能 |\n| SIEM | | ✅ | セキュリティ分析は専門ツール必須 |\n| Backup | △ | ✅ | BaaS: プロバイダ機能、Traditional: 自前設計 |\n\n`
    : `### Built-in vs External Decision Framework\n\n| Feature | Built-in | External | Reason |\n|---------|----------|----------|--------|\n| Feature Flag | ✅ | | Tightly coupled with app logic |\n| Kill Switch | ✅ | | Emergency stop requires fastest response |\n| Rate Limiting | ✅ | △ | BaaS: Edge Function, Traditional: App layer + CDN/LB |\n| Logs | | ✅ | Aggregation & analysis require external services |\n| SIEM | | ✅ | Security analysis needs specialized tools |\n| Backup | △ | ✅ | BaaS: provider feature, Traditional: self-designed |\n\n`;

  // Domain-specific Ops Plane priority
  opsPlane += G
    ? `### ドメイン別 Ops Plane 優先度\n\n| ドメイン | 最優先層 | 理由 |\n|---------|---------|------|\n| fintech | Governance | 監査ログ・承認フローが規制要件 |\n| ec | Control | Feature Flag でキャンペーン制御 |\n| health | Governance | PHI アクセス監査必須 |\n| education | Observation | 学習分析がビジネス価値直結 |\n| portfolio | Recovery | データロストはキャリア損失 |\n\n`
    : `### Domain-Specific Ops Plane Priority\n\n| Domain | Top Priority | Reason |\n|--------|--------------|--------|\n| fintech | Governance | Audit log & approval flow for regulations |\n| ec | Control | Feature flags for campaign control |\n| health | Governance | PHI access audit required |\n| education | Observation | Learning analytics = direct business value |\n| portfolio | Recovery | Data loss = career loss |\n\n`;

  // § 2. 12 Ops Capabilities Implementation Guide
  opsPlane += `---\n\n## ${G ? '§ 2. 12 Ops Capabilities 実装ガイド' : '§ 2. 12 Ops Capabilities Implementation Guide'}\n\n`;
  opsPlane += G
    ? `> **参照**: \`docs/54_ops_checklist.md\` はチェックリスト形式。本セクションは実装パターンを詳述。\n\n`
    : `> **Reference**: \`docs/54_ops_checklist.md\` provides a checklist. This section details implementation patterns.\n\n`;

  // Observation Capabilities
  opsPlane += `### ${G ? 'Observation Layer (Cap 1-4)' : 'Observation Layer (Cap 1-4)'}\n\n`;
  opsPlane += G
    ? `**Cap 1: ログ集約**\n- **BaaS**: Vercel Log Drains → Datadog/Axiom\n- **Traditional**: Winston/Pino → Elasticsearch/Loki\n- **構造化ログ例**: \`{ timestamp, level, service, traceId, userId, action, result, duration }\`\n\n`
    : `**Cap 1: Log Aggregation**\n- **BaaS**: Vercel Log Drains → Datadog/Axiom\n- **Traditional**: Winston/Pino → Elasticsearch/Loki\n- **Structured log example**: \`{ timestamp, level, service, traceId, userId, action, result, duration }\`\n\n`;

  opsPlane += G
    ? `**Cap 2: メトリクス (RED Method)**\n- **Rate** (req/sec): ドメイン別正常範囲 (fintech: 100-500, ec: 200-1000)\n- **Errors** (error %): SLO 閾値から自動導出 (99.99% → 0.01% error budget)\n- **Duration** (p50/p95/p99): スタック別ベースライン (Next.js SSR: p95 < 500ms)\n\n`
    : `**Cap 2: Metrics (RED Method)**\n- **Rate** (req/sec): Domain-specific normal range (fintech: 100-500, ec: 200-1000)\n- **Errors** (error %): Auto-derived from SLO threshold (99.99% → 0.01% error budget)\n- **Duration** (p50/p95/p99): Stack-specific baseline (Next.js SSR: p95 < 500ms)\n\n`;

  opsPlane += G
    ? `**Cap 3: 分散トレーシング**\n- **BaaS**: Vercel + OpenTelemetry → Honeycomb\n- **Traditional**: OpenTelemetry SDK + Jaeger/Tempo\n- **重点トレース**: 決済フロー (fintech/ec)、PHI アクセス (health)、認証 (all)\n\n`
    : `**Cap 3: Distributed Tracing**\n- **BaaS**: Vercel + OpenTelemetry → Honeycomb\n- **Traditional**: OpenTelemetry SDK + Jaeger/Tempo\n- **Key traces**: Payment flow (fintech/ec), PHI access (health), Auth (all)\n\n`;

  opsPlane += G
    ? `**Cap 4: ビジネス分析**\n- **ドメイン別 KPI メトリクス**:\n  - fintech: 取引成功率、不正検知率\n  - education: 学習完了率、エンゲージメント時間\n  - ec: カート放棄率、決済成功率\n\n`
    : `**Cap 4: Business Analytics**\n- **Domain-specific KPI metrics**:\n  - fintech: Transaction success rate, fraud detection rate\n  - education: Course completion rate, engagement time\n  - ec: Cart abandonment rate, payment success rate\n\n`;

  // Control Capabilities
  opsPlane += `### ${G ? 'Control Layer (Cap 5-7)' : 'Control Layer (Cap 5-7)'}\n\n`;
  opsPlane += G
    ? `**Cap 5: Feature Flag**\n- **env var vs DB vs External Service 比較**:\n\n| 方式 | デプロイ不要 | 動的切替 | ユーザー別 | 推奨ケース |\n|------|------------|---------|----------|----------|\n| env var | ✗ | ✗ | ✗ | 開発環境のみ |\n| DB | ✓ | ✓ | △ | BaaS (Supabase RLS) |\n| External (LaunchDarkly) | ✓ | ✓ | ✓ | エンタープライズ |\n\n`
    : `**Cap 5: Feature Flag**\n- **env var vs DB vs External Service comparison**:\n\n| Method | No Deploy | Dynamic | Per-User | Recommended Use |\n|--------|-----------|---------|----------|------------------|\n| env var | ✗ | ✗ | ✗ | Dev environment only |\n| DB | ✓ | ✓ | △ | BaaS (Supabase RLS) |\n| External (LaunchDarkly) | ✓ | ✓ | ✓ | Enterprise |\n\n`;

  opsPlane += G
    ? `**Cap 6: Kill Switch / Circuit Breaker** (§ 3 で詳述)\n\n`
    : `**Cap 6: Kill Switch / Circuit Breaker** (detailed in § 3)\n\n`;

  opsPlane += G
    ? `**Cap 7: Rate Limiting**\n- **Token Bucket vs Sliding Window 比較**:\n\n| 方式 | バースト許容 | 実装複雑度 | 推奨ユースケース |\n|------|------------|-----------|----------------|\n| Token Bucket | ✓ | 低 | API 一般保護 |\n| Sliding Window | ✗ | 中 | 厳密な分単位制限 |\n\n- **スタック別実装**: BaaS (Upstash Rate Limit), Traditional (Express middleware + Redis)\n\n`
    : `**Cap 7: Rate Limiting**\n- **Token Bucket vs Sliding Window comparison**:\n\n| Method | Burst Allow | Complexity | Recommended Use |\n|--------|-------------|------------|------------------|\n| Token Bucket | ✓ | Low | General API protection |\n| Sliding Window | ✗ | Medium | Strict per-minute limits |\n\n- **Stack-specific impl**: BaaS (Upstash Rate Limit), Traditional (Express middleware + Redis)\n\n`;

  // Recovery Capabilities
  opsPlane += `### ${G ? 'Recovery Layer (Cap 8-10)' : 'Recovery Layer (Cap 8-10)'}\n\n`;
  opsPlane += G
    ? `**Cap 8: ジョブ再実行**\n- **DLQ + Exponential Backoff パターン**:\n  - 初回: 即座\n  - 2回目: 1分後\n  - 3回目: 5分後\n  - 4回目以降: DLQ (Dead Letter Queue) へ\n- **スタック別実装**: BaaS (Inngest/Trigger.dev), Traditional (BullMQ)\n\n`
    : `**Cap 8: Job Retry**\n- **DLQ + Exponential Backoff pattern**:\n  - 1st: Immediate\n  - 2nd: After 1 min\n  - 3rd: After 5 min\n  - 4th+: Move to DLQ (Dead Letter Queue)\n- **Stack-specific impl**: BaaS (Inngest/Trigger.dev), Traditional (BullMQ)\n\n`;

  opsPlane += G
    ? `**Cap 9: データリカバリ**\n- **Soft Delete + Event Replay パターン**:\n  - 削除は \`deleted_at\` フラグのみ (物理削除しない)\n  - イベントソーシング活用時は過去の状態を再現可能\n- **復旧手順**: \`UPDATE SET deleted_at = NULL WHERE id = ?;\` (管理画面 + 4-eyes 承認必須)\n\n`
    : `**Cap 9: Data Recovery**\n- **Soft Delete + Event Replay pattern**:\n  - Deletion = \`deleted_at\` flag only (no physical delete)\n  - Event sourcing enables past state reconstruction\n- **Recovery procedure**: \`UPDATE SET deleted_at = NULL WHERE id = ?;\` (Admin UI + 4-eyes approval required)\n\n`;

  opsPlane += G
    ? `**Cap 10: バックアップ検証**\n- **自動リストアテスト (CI統合)**:\n  - 週次: ステージング環境で最新バックアップから復元\n  - 検証項目: データ整合性、FK制約、パフォーマンス\n- **RPO/RTO**: \`docs/53_ops_runbook.md\` 参照 (ドメイン別要件)\n\n`
    : `**Cap 10: Backup Validation**\n- **Automated restore testing (CI integration)**:\n  - Weekly: Restore from latest backup in staging\n  - Validation: Data integrity, FK constraints, performance\n- **RPO/RTO**: See \`docs/53_ops_runbook.md\` (domain-specific requirements)\n\n`;

  // Governance Capabilities
  opsPlane += `### ${G ? 'Governance Layer (Cap 11-12)' : 'Governance Layer (Cap 11-12)'}\n\n`;
  opsPlane += G
    ? `**Cap 11: 監査ログ** (§ 4 で詳述)\n\n`
    : `**Cap 11: Audit Log** (detailed in § 4)\n\n`;

  opsPlane += G
    ? `**Cap 12: RBAC + 承認フロー** (§ 6 で詳述)\n\n`
    : `**Cap 12: RBAC + Approval Flow** (detailed in § 6)\n\n`;

  // § 3. Circuit Breaker
  opsPlane += `---\n\n## ${G ? '§ 3. Circuit Breaker / Graceful Degradation' : '§ 3. Circuit Breaker / Graceful Degradation'}\n\n`;

  // Mermaid state diagram
  opsPlane += '```mermaid\n';
  opsPlane += 'stateDiagram-v2\n';
  opsPlane += '  [*] --> Closed\n';
  opsPlane += '  Closed --> Open : Failure threshold exceeded\n';
  opsPlane += '  Open --> HalfOpen : Timeout elapsed\n';
  opsPlane += '  HalfOpen --> Closed : Success\n';
  opsPlane += '  HalfOpen --> Open : Failure\n';
  opsPlane += '```\n\n';

  // Auto-derive thresholds from SLO
  const cbThresholds = {
    '99.99%': { fail: 3, window: '10s', timeout: '30s' },
    '99.9%': { fail: 5, window: '30s', timeout: '45s' },
    '99.5%': { fail: 5, window: '60s', timeout: '60s' },
    '99%': { fail: 10, window: '60s', timeout: '60s' }
  };
  const cbThreshold = cbThresholds[ops.slo] || cbThresholds['99%'];

  opsPlane += G
    ? `### ドメイン別閾値 (SLO から自動導出)\n\n**${domain} (SLO: ${ops.slo})**\n- 失敗回数閾値: ${cbThreshold.fail} 回\n- 監視ウィンドウ: ${cbThreshold.window}\n- タイムアウト: ${cbThreshold.timeout}\n\n`
    : `### Domain-Specific Thresholds (Auto-derived from SLO)\n\n**${domain} (SLO: ${ops.slo})**\n- Failure threshold: ${cbThreshold.fail} failures\n- Monitoring window: ${cbThreshold.window}\n- Timeout: ${cbThreshold.timeout}\n\n`;

  // Fallback strategies
  opsPlane += G
    ? `### フォールバック戦略テーブル\n\n| ドメイン | フォールバック戦略 | 例 |\n|---------|------------------|----|\n| fintech | Queue → Retry | 決済失敗時キューイング + 非同期リトライ |\n| ec | Cached Price | 在庫APIダウン時、最終価格表示 + 注文保留 |\n| education | Offline Mode | 動画視聴オフライン、進捗は再接続時同期 |\n| health | Read-only Mode | 書き込みAPI停止、参照のみ許可 |\n\n`
    : `### Fallback Strategy Table\n\n| Domain | Fallback Strategy | Example |\n|--------|-------------------|----------|\n| fintech | Queue → Retry | Queue payment failures + async retry |\n| ec | Cached Price | Display last price when inventory API down + hold order |\n| education | Offline Mode | Video playback offline, sync progress on reconnect |\n| health | Read-only Mode | Stop write API, allow read-only access |\n\n`;

  // Implementation pattern
  opsPlane += G
    ? `### 実装パターン\n\n**BaaS**: Edge Function timeout + retry\n- Vercel: \`maxDuration: 60\` + Inngest retry policy\n\n**Traditional**: opossum (Node.js) / resilience4j (Java)\n\`\`\`javascript\nconst breaker = new CircuitBreaker(externalAPI, {\n  timeout: ${cbThreshold.timeout.replace('s', '000')},\n  errorThresholdPercentage: 50,\n  resetTimeout: 30000\n});\n\`\`\`\n\n`
    : `### Implementation Pattern\n\n**BaaS**: Edge Function timeout + retry\n- Vercel: \`maxDuration: 60\` + Inngest retry policy\n\n**Traditional**: opossum (Node.js) / resilience4j (Java)\n\`\`\`javascript\nconst breaker = new CircuitBreaker(externalAPI, {\n  timeout: ${cbThreshold.timeout.replace('s', '000')},\n  errorThresholdPercentage: 50,\n  resetTimeout: 30000\n});\n\`\`\`\n\n`;

  // § 4. Evidence-Based Operations
  opsPlane += `---\n\n## ${G ? '§ 4. Evidence-Based Operations (証拠ベース運用)' : '§ 4. Evidence-Based Operations'}\n\n`;

  opsPlane += G
    ? `### AuditEvent スキーマ\n\n\`\`\`typescript\ninterface AuditEvent {\n  run_id: string;        // 操作セッションID\n  actor: string;         // ユーザーID or AgentID\n  action: string;        // CREATE/UPDATE/DELETE/EXECUTE\n  target: string;        // 対象リソース (table.id)\n  result: 'success' | 'failure';\n  metadata: Record<string, any>; // ドメイン固有フィールド\n  ip: string;\n  user_agent: string;\n  timestamp: Date;\n}\n\`\`\`\n\n`
    : `### AuditEvent Schema\n\n\`\`\`typescript\ninterface AuditEvent {\n  run_id: string;        // Operation session ID\n  actor: string;         // UserID or AgentID\n  action: string;        // CREATE/UPDATE/DELETE/EXECUTE\n  target: string;        // Target resource (table.id)\n  result: 'success' | 'failure';\n  metadata: Record<string, any>; // Domain-specific fields\n  ip: string;\n  user_agent: string;\n  timestamp: Date;\n}\n\`\`\`\n\n`;

  // Domain-specific required audit fields
  opsPlane += G
    ? `### ドメイン別必須証跡フィールド\n\n| ドメイン | metadata 必須フィールド | コンプライアンス対応 |\n|---------|---------------------|------------------|\n| fintech | amount, currency, transaction_id | PCI DSS, SOX |\n| health | patient_id, PHI_flag, access_reason | HIPAA |\n| legal | contract_id, version, signatory | 電子契約法 |\n| ec | order_id, payment_method | 特定商取引法 |\n\n`
    : `### Domain-Specific Required Audit Fields\n\n| Domain | Required metadata fields | Compliance |\n|--------|------------------------|-------------|\n| fintech | amount, currency, transaction_id | PCI DSS, SOX |\n| health | patient_id, PHI_flag, access_reason | HIPAA |\n| legal | contract_id, version, signatory | Digital Contract Law |\n| ec | order_id, payment_method | Consumer Protection Law |\n\n`;

  // Implementation pattern
  opsPlane += G
    ? `### 実装パターン\n\n**BaaS (Supabase)**:\n\`\`\`sql\nCREATE TABLE audit_events (...) WITH (oids = false);\nCREATE POLICY "Admin read audit" ON audit_events FOR SELECT USING (auth.role() = 'admin');\n-- Trigger: INSERT時に自動記録\n\`\`\`\n\n**Traditional (Express)**:\n\`\`\`javascript\napp.use((req, res, next) => {\n  res.on('finish', () => {\n    db.audit_events.insert({\n      run_id: req.headers['x-run-id'],\n      actor: req.user?.id || 'anonymous',\n      action: req.method,\n      target: req.path,\n      result: res.statusCode < 400 ? 'success' : 'failure',\n      metadata: { body: req.body },\n      ip: req.ip,\n      user_agent: req.headers['user-agent'],\n      timestamp: new Date()\n    });\n  });\n  next();\n});\n\`\`\`\n\n`
    : `### Implementation Pattern\n\n**BaaS (Supabase)**:\n\`\`\`sql\nCREATE TABLE audit_events (...) WITH (oids = false);\nCREATE POLICY "Admin read audit" ON audit_events FOR SELECT USING (auth.role() = 'admin');\n-- Trigger: Auto-record on INSERT\n\`\`\`\n\n**Traditional (Express)**:\n\`\`\`javascript\napp.use((req, res, next) => {\n  res.on('finish', () => {\n    db.audit_events.insert({\n      run_id: req.headers['x-run-id'],\n      actor: req.user?.id || 'anonymous',\n      action: req.method,\n      target: req.path,\n      result: res.statusCode < 400 ? 'success' : 'failure',\n      metadata: { body: req.body },\n      ip: req.ip,\n      user_agent: req.headers['user-agent'],\n      timestamp: new Date()\n    });\n  });\n  next();\n});\n\`\`\`\n\n`;

  // Retention policy
  opsPlane += G
    ? `### 保持期間 × コンプライアンス\n\n| ドメイン | 最低保持期間 | 根拠法令 | 参照 |\n|---------|------------|---------|------|\n| fintech | 7年 | 法人税法、PCI DSS | \`docs/45_compliance_matrix.md\` |\n| health | 5年 (未成年は20歳まで) | 医療法 | \`docs/45_compliance_matrix.md\` |\n| legal | 10年 | 民法 | \`docs/45_compliance_matrix.md\` |\n| ec | 2年 | 特定商取引法 | \`docs/45_compliance_matrix.md\` |\n\n`
    : `### Retention Period × Compliance\n\n| Domain | Min Retention | Legal Basis | Reference |\n|--------|--------------|-------------|------------|\n| fintech | 7 years | Corporate Tax Law, PCI DSS | \`docs/45_compliance_matrix.md\` |\n| health | 5 years (minors until age 20) | Medical Care Act | \`docs/45_compliance_matrix.md\` |\n| legal | 10 years | Civil Code | \`docs/45_compliance_matrix.md\` |\n| ec | 2 years | Consumer Protection Law | \`docs/45_compliance_matrix.md\` |\n\n`;

  // § 5. Dev × Ops AI Responsibility Separation
  opsPlane += `---\n\n## ${G ? '§ 5. Dev × Ops AI 責任分離マトリクス' : '§ 5. Dev × Ops AI Responsibility Separation Matrix'}\n\n`;
  opsPlane += G
    ? `> **参考**: 「OpenClawとはセルフホスト型パーソナルAIアシスタントエージェント」(Dev×Ops責任分離)\n\n`
    : `> **Reference**: "OpenClaw Self-Hosted Personal AI Assistant Agent" (Dev×Ops Responsibility Separation)\n\n`;

  // Mermaid diagram
  opsPlane += '```mermaid\n';
  opsPlane += 'graph LR\n';
  opsPlane += '  DevAgent[Dev Agent<br/>Claude Code] -->|Code/Test/PR| SharedContract[Shared Contract<br/>.spec/ + CLAUDE.md<br/>docs/53-55]\n';
  opsPlane += '  OpsAgent[Ops Agent<br/>Human/AI] -->|Monitor/Flag/Incident| SharedContract\n';
  opsPlane += '  SharedContract -->|Spec| DevAgent\n';
  opsPlane += '  SharedContract -->|SLO/Runbook| OpsAgent\n';
  opsPlane += '```\n\n';

  // Responsibility table
  opsPlane += G
    ? `### 責任分担テーブル\n\n| 責務 | Dev Agent (Claude Code) | Ops Agent (Human/AI) | 共有契約 |\n|------|------------------------|---------------------|----------|\n| 機能実装 | ✅ | | .spec/tasks.md |\n| テスト作成 | ✅ | | docs/36_test_strategy.md |\n| コードレビュー | ✅ | | .cursor/rules |\n| バグ修正 | ✅ | | docs/37_bug_prevention.md |\n| モニタリング | | ✅ | docs/53_ops_runbook.md |\n| Feature Flag 操作 | | ✅ | docs/53_ops_runbook.md |\n| インシデント対応 | | ✅ | docs/34_incident_response.md |\n| バックアップ検証 | | ✅ | docs/54_ops_checklist.md |\n| SLO 定義 | | ✅ | docs/53_ops_runbook.md |\n| 破壊的操作 (DELETE) | | ✅ (4-eyes) | CLAUDE.md (permission) |\n\n`
    : `### Responsibility Table\n\n| Responsibility | Dev Agent (Claude Code) | Ops Agent (Human/AI) | Shared Contract |\n|----------------|------------------------|---------------------|------------------|\n| Feature Impl | ✅ | | .spec/tasks.md |\n| Test Creation | ✅ | | docs/36_test_strategy.md |\n| Code Review | ✅ | | .cursor/rules |\n| Bug Fix | ✅ | | docs/37_bug_prevention.md |\n| Monitoring | | ✅ | docs/53_ops_runbook.md |\n| Feature Flag Ops | | ✅ | docs/53_ops_runbook.md |\n| Incident Response | | ✅ | docs/34_incident_response.md |\n| Backup Validation | | ✅ | docs/54_ops_checklist.md |\n| SLO Definition | | ✅ | docs/53_ops_runbook.md |\n| Destructive Ops (DELETE) | | ✅ (4-eyes) | CLAUDE.md (permission) |\n\n`;

  // CLAUDE.md bloat prevention
  opsPlane += G
    ? `### CLAUDE.md 肥大化防止パターン\n\n**v9.3.0 3-layer split 戦略**:\n1. **CLAUDE.md (薄いルート)**: ~1.5K tokens (プロジェクト概要のみ)\n2. **\`.claude/rules/\` (パス別ルール)**: spec.md / frontend.md / backend.md / test.md / ops.md\n3. **\`.claude/settings.json\`**: パーミッション・危険コマンド警告\n\n**自動ロード**: Claude Code が \`docs/53-55\` を編集 → \`.claude/rules/ops.md\` が自動的にコンテキスト注入\n\n`
    : `### CLAUDE.md Bloat Prevention Pattern\n\n**v9.3.0 3-layer split strategy**:\n1. **CLAUDE.md (thin root)**: ~1.5K tokens (project overview only)\n2. **\`.claude/rules/\` (path-specific rules)**: spec.md / frontend.md / backend.md / test.md / ops.md\n3. **\`.claude/settings.json\`**: Permissions, dangerous command warnings\n\n**Auto-load**: Claude Code edits \`docs/53-55\` → \`.claude/rules/ops.md\` auto-injected to context\n\n`;

  // Skills utilization
  opsPlane += G
    ? `### Skills の活用指針\n\n- **Manus Skills 形式** (\`skills/\` ディレクトリ) を活用し、反復タスクを自動化\n- **agents/** サブディレクトリで Coordinator/Reviewer エージェントを定義\n- **skill_map.md**: スキル間の依存関係マップ\n\n**参照**: \`docs/42_skill_guide.md\`, \`skills/project.md\`\n\n`
    : `### Skills Utilization Guidelines\n\n- Use **Manus Skills format** (\`skills/\` directory) to automate repetitive tasks\n- Define Coordinator/Reviewer agents in **agents/** subdirectory\n- **skill_map.md**: Inter-skill dependency map\n\n**Reference**: \`docs/42_skill_guide.md\`, \`skills/project.md\`\n\n`;

  // Safety boundaries
  opsPlane += G
    ? `### 安全境界\n\n**サンドボックス**: Dev Agent は \`src/\` 配下のみ編集可 (Ops Agent は全体)\n\n**パーミッション** (\`.claude/settings.json\`):\n- \`"disallowedCommands": ["rm -rf", "DROP TABLE", "git push --force main"]\`\n- \`"requireConfirmation": ["git push", "npm publish", "kubectl delete"]\`\n\n**危険コマンド確認リスト** (→ \`.claude/settings.json\` 参照):\n- git reset --hard\n- git clean -f\n- docker system prune -a\n\n`
    : `### Safety Boundaries\n\n**Sandbox**: Dev Agent can only edit \`src/\` (Ops Agent: full access)\n\n**Permissions** (\`.claude/settings.json\`):\n- \`"disallowedCommands": ["rm -rf", "DROP TABLE", "git push --force main"]\`\n- \`"requireConfirmation": ["git push", "npm publish", "kubectl delete"]\`\n\n**Dangerous Command Confirmation List** (→ see \`.claude/settings.json\`):\n- git reset --hard\n- git clean -f\n- docker system prune -a\n\n`;

  // § 6. Admin Console Architecture
  opsPlane += `---\n\n## ${G ? '§ 6. Admin Console アーキテクチャ' : '§ 6. Admin Console Architecture'}\n\n`;
  opsPlane += G
    ? `> **警告**: Admin Console = 最大の攻撃面。実装は慎重に。\n\n`
    : `> **Warning**: Admin Console = largest attack surface. Implement carefully.\n\n`;

  // RBAC 4-tier model
  opsPlane += G
    ? `### RBAC 4段階モデル\n\n| Role | 権限 | 例 |\n|------|------|----|\n| Viewer | 参照のみ | ダッシュボード閲覧、ログ検索 |\n| Operator | 非破壊的操作 | Feature Flag ON/OFF、ジョブ再実行 |\n| Admin | 破壊的操作 (4-eyes) | ユーザー削除、データ復元 |\n| SuperAdmin | システム設定変更 | RBAC変更、バックアップ削除 |\n\n`
    : `### RBAC 4-Tier Model\n\n| Role | Permissions | Examples |\n|------|-------------|----------|\n| Viewer | Read-only | Dashboard view, log search |\n| Operator | Non-destructive ops | Feature Flag ON/OFF, job retry |\n| Admin | Destructive ops (4-eyes) | User delete, data recovery |\n| SuperAdmin | System config changes | RBAC change, backup delete |\n\n`;

  // 4-eyes approval pattern
  opsPlane += G
    ? `### 4-eyes 承認パターン\n\n破壊的操作 (DELETE, DROP, TRUNCATE) は **2名承認必須**:\n\n1. Operator が操作リクエスト作成\n2. Admin が承認\n3. 自動実行 or 手動実行 (操作種別による)\n4. 監査ログに run_id 記録\n\n**実装例** (BaaS):\n\`\`\`sql\nCREATE TABLE approval_requests (\n  id UUID PRIMARY KEY,\n  requester_id UUID NOT NULL,\n  approver_id UUID,\n  action TEXT NOT NULL,\n  target TEXT NOT NULL,\n  status TEXT DEFAULT 'pending',\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\n`
    : `### 4-Eyes Approval Pattern\n\nDestructive ops (DELETE, DROP, TRUNCATE) require **2-person approval**:\n\n1. Operator creates operation request\n2. Admin approves\n3. Auto-execute or manual execute (depends on operation type)\n4. Record run_id in audit log\n\n**Implementation example** (BaaS):\n\`\`\`sql\nCREATE TABLE approval_requests (\n  id UUID PRIMARY KEY,\n  requester_id UUID NOT NULL,\n  approver_id UUID,\n  action TEXT NOT NULL,\n  target TEXT NOT NULL,\n  status TEXT DEFAULT 'pending',\n  created_at TIMESTAMPTZ DEFAULT NOW()\n);\n\`\`\`\n\n`;

  // Domain-specific admin features
  opsPlane += G
    ? `### ドメイン別 Admin 機能テーブル\n\n| ドメイン | 必須機能 | セキュリティ要件 |\n|---------|---------|----------------|\n| fintech | 取引管理、不正検知ダッシュボード | MFA必須、IP制限 |\n| health | PHI アクセスログ、患者データ匿名化 | HIPAA準拠、監査証跡 |\n| ec | 在庫オーバーライド、返金処理 | 承認フロー、金額上限 |\n| education | 学習進捗管理、証明書発行 | FERPA準拠、保護者同意 |\n\n`
    : `### Domain-Specific Admin Features Table\n\n| Domain | Required Features | Security Requirements |\n|--------|-------------------|----------------------|\n| fintech | Transaction mgmt, fraud detection dashboard | MFA required, IP restriction |\n| health | PHI access log, patient data anonymization | HIPAA compliant, audit trail |\n| ec | Inventory override, refund processing | Approval flow, amount limit |\n| education | Learning progress mgmt, certificate issuance | FERPA compliant, parental consent |\n\n`;

  // Security hardening checklist
  opsPlane += G
    ? `### セキュリティ強化チェックリスト\n\n- [ ] **MFA 必須** (Admin 以上)\n- [ ] **IP 制限** (オフィス IP のみ許可)\n- [ ] **セッションタイムアウト**: 15分\n- [ ] **確認ダイアログ**: 破壊的操作は「DELETE」と入力必須\n- [ ] **監査ログ**: 全操作を \`audit_events\` に記録\n- [ ] **RLS (Row Level Security)**: Supabase 利用時は role 別にポリシー設定\n- [ ] **Rate Limiting**: Admin API も保護 (100 req/min)\n\n`
    : `### Security Hardening Checklist\n\n- [ ] **MFA required** (Admin and above)\n- [ ] **IP restriction** (office IP only)\n- [ ] **Session timeout**: 15 minutes\n- [ ] **Confirmation dialog**: Type \"DELETE\" for destructive ops\n- [ ] **Audit log**: Record all ops in \`audit_events\`\n- [ ] **RLS (Row Level Security)**: Set role-based policies in Supabase\n- [ ] **Rate Limiting**: Protect Admin API too (100 req/min)\n\n`;

  // Final notes
  opsPlane += `---\n\n## ${G ? '次のステップ' : 'Next Steps'}\n\n`;
  opsPlane += G
    ? `1. **\`docs/53_ops_runbook.md\` を熟読** — SLO/SLI、Feature Flags、Observability スタックの詳細\n2. **\`docs/54_ops_checklist.md\` で準備状況確認** — 12 Ops Capabilities の実装状況をチェック\n3. **Admin Console を実装** — RBAC + 4-eyes 承認 + 監査ログ\n4. **ステージング環境で障害シミュレーション実施**\n5. **本番デプロイ前に SRE レビュー** (可能なら外部レビュー)\n\n`
    : `1. **Read \`docs/53_ops_runbook.md\` thoroughly** — SLO/SLI, Feature Flags, Observability stack details\n2. **Verify readiness with \`docs/54_ops_checklist.md\`** — Check 12 Ops Capabilities implementation status\n3. **Implement Admin Console** — RBAC + 4-eyes approval + audit log\n4. **Run failure simulations in staging**\n5. **SRE review before production deploy** (external review if possible)\n\n`;

  opsPlane += G
    ? `---\n\n**🌍 世界で唯一のポイント**: DevForge v9 は **ドメイン適応型 Ops Plane 設計自動生成エンジン** です。他のジェネレータ (Yeoman, create-t3-app, Projen) は運用設計を一切出力しません。Circuit Breaker をドメイン SLO から自動導出し、Evidence-Based Operations スキーマを「設計時」に定義し、Dev×Ops AI 責任分離マトリクスを生成ドキュメントとして出力する初のツールです。\n`
    : `---\n\n**🌍 World's Only Feature**: DevForge v9 is the **Domain-Adaptive Ops Plane Design Auto-Generation Engine**. Other generators (Yeoman, create-t3-app, Projen) do not generate operational design documents. It is the first tool to auto-derive Circuit Breaker thresholds from domain SLO, define Evidence-Based Operations schema at design time, and output Dev×Ops AI responsibility separation matrix as generated documentation.\n`;

  S.files['docs/55_ops_plane_design.md'] = opsPlane;
}
