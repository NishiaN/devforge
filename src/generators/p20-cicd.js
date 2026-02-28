// P20: CI/CD Intelligence
// Generates: docs/77_cicd_pipeline_design.md, 78_deployment_strategy.md,
//            79_quality_gate_matrix.md, 80_release_engineering.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// Factory: Pipeline stage
function _ps(id, name_ja, name_en, desc_ja, desc_en, tools, gate_ja, gate_en) {
  return {id, name_ja, name_en, desc_ja, desc_en, tools, gate_ja, gate_en};
}
var PIPELINE_STAGES = [
  _ps('checkout', 'チェックアウト', 'Checkout', 'ソースコード取得・ブランチ検証', 'Fetch source code, validate branch', 'actions/checkout@v4', 'ブランチ保護ルール', 'Branch protection rules'),
  _ps('install', 'インストール', 'Install', '依存関係のキャッシュ付きインストール', 'Install dependencies with cache', 'npm ci / pnpm i --frozen-lockfile', 'lockfileの整合性', 'lockfile integrity'),
  _ps('lint', 'Lint/型チェック', 'Lint & Type Check', 'ESLint・TypeScript・Prettier検査', 'ESLint, TypeScript, Prettier checks', 'eslint, tsc --noEmit, prettier --check', 'エラー0件', 'Zero errors'),
  _ps('test', 'テスト実行', 'Run Tests', 'ユニット・統合テスト並列実行', 'Unit & integration tests in parallel', 'vitest, jest, playwright', 'カバレッジ閾値達成', 'Coverage threshold met'),
  _ps('build', 'ビルド', 'Build', 'プロダクションビルド・バンドル最適化', 'Production build & bundle optimization', 'next build / vite build / tsc', 'ビルド成功・サイズ予算内', 'Build success & size budget'),
  _ps('security_scan', 'セキュリティスキャン', 'Security Scan', 'SAST・依存関係脆弱性スキャン', 'SAST & dependency vulnerability scan', 'trivy, snyk, semgrep, npm audit', '重大脆弱性0件', 'Zero critical vulnerabilities'),
  _ps('deploy_staging', 'ステージングデプロイ', 'Deploy Staging', 'ステージング環境への自動デプロイ', 'Auto-deploy to staging environment', 'deploy CLI / container push', 'デプロイ成功・ヘルスチェックOK', 'Deploy success & health check OK'),
  _ps('e2e_test', 'E2Eテスト', 'E2E Tests', 'ステージング環境でのE2E・スモーク', 'E2E & smoke tests on staging', 'playwright, cypress, k6', '主要フロー全パス', 'All critical flows pass'),
  _ps('deploy_prod', '本番デプロイ', 'Deploy Production', '本番環境への段階的デプロイ', 'Staged deploy to production', 'deploy CLI / kubectl apply', 'ヘルスチェック・SLO維持', 'Health check & SLO maintained'),
];

// Factory: Deploy strategy
function _ds(id, name_ja, name_en, desc_ja, desc_en, pros_ja, cons_ja, when_ja, rollback_ja) {
  return {id, name_ja, name_en, desc_ja, desc_en, pros_ja, cons_ja, when_ja, rollback_ja};
}
var DEPLOY_STRATEGIES = [
  _ds('blue_green', 'ブルーグリーン', 'Blue-Green',
    '2環境を並列維持しトラフィックを瞬時切替', 'Maintain 2 envs, instant traffic switch',
    'ゼロダウンタイム・瞬時ロールバック', 'インフラコスト×2・データ同期必要',
    'fintech/healthcare/EC 本番デプロイ', 'ロードバランサーを旧環境に戻す（秒単位）'),
  _ds('canary', 'カナリアリリース', 'Canary',
    '一部トラフィック(5-20%)から段階的に展開', 'Gradually expand from 5-20% traffic',
    'リスク最小化・メトリクス監視で早期検知', 'ロールアウト期間が長い・複雑なルーティング',
    'SaaS新機能・リスク軽減重視', 'カナリア割合を0%に戻しデプロイ削除'),
  _ds('rolling', 'ローリング', 'Rolling',
    'インスタンスを順次置換（ダウンタイム最小）', 'Replace instances sequentially (minimal downtime)',
    'リソース効率◎・シンプル', '部分的バージョン混在・ロールバック遅め',
    '標準Webアプリ・Kubernetes標準戦略', '前リビジョンにロールアウト'),
  _ds('recreate', 'Recreate', 'Recreate',
    '旧版を全停止してから新版を起動', 'Stop all old, then start all new',
    '実装シンプル・バージョン混在なし', 'ダウンタイム発生',
    '開発/ステージング環境・非重要サービス', '旧イメージで再デプロイ'),
];

// Factory: Quality gate
function _qg(id, name_ja, name_en, tools_ja, tools_en, threshold_ja, threshold_en, blocking) {
  return {id, name_ja, name_en, tools_ja, tools_en, threshold_ja, threshold_en, blocking};
}
var QUALITY_GATES = [
  _qg('code_quality', 'コード品質', 'Code Quality', 'ESLint / TypeScript / Prettier', 'ESLint / TypeScript / Prettier', 'エラー0件・警告50件以下', 'Zero errors, max 50 warnings', true),
  _qg('test_coverage', 'テストカバレッジ', 'Test Coverage', 'Vitest / Jest / Istanbul', 'Vitest / Jest / Istanbul', 'ライン80%以上・ブランチ75%以上', 'Line ≥80%, Branch ≥75%', true),
  _qg('security', 'セキュリティ', 'Security', 'Trivy / Snyk / Semgrep / npm audit', 'Trivy / Snyk / Semgrep / npm audit', 'Critical 0件・High 0件（SLA内修正）', 'Critical=0, High=0 (fix within SLA)', true),
  _qg('performance', 'パフォーマンス', 'Performance', 'Lighthouse CI / k6 / Bundle Analyzer', 'Lighthouse CI / k6 / Bundle Analyzer', 'LCP<2.5s・FCP<1.8s・バンドル予算内', 'LCP<2.5s, FCP<1.8s, bundle within budget', false),
  _qg('accessibility', 'アクセシビリティ', 'Accessibility', 'axe-core / pa11y / WAVE', 'axe-core / pa11y / WAVE', 'WCAG 2.2 AA Critical 0件', 'WCAG 2.2 AA Critical violations=0', false),
];

// Factory: Release model
function _rm(id, name_ja, name_en, branches_ja, best_for_ja, branches_en, best_for_en) {
  return {id, name_ja, name_en, branches_ja, best_for_ja, branches_en, best_for_en};
}
var RELEASE_MODELS = [
  _rm('trunk', 'トランクベース開発', 'Trunk-Based Development',
    'main（単一）+ 短命フィーチャーブランチ（<2日）+ Feature Flags',
    'SaaS・スタートアップ・高頻度リリース（複数回/日）',
    'main (single) + short-lived feature branches (<2 days) + Feature Flags',
    'SaaS, startups, high-frequency releases (multiple/day)'),
  _rm('gitflow', 'GitFlow', 'GitFlow',
    'main / develop / feature/* / release/* / hotfix/*',
    '従来型・大規模チーム・定期リリース・安定性重視',
    'main / develop / feature/* / release/* / hotfix/*',
    'Traditional, large teams, scheduled releases, stability-focused'),
  _rm('github_flow', 'GitHub Flow', 'GitHub Flow',
    'main + PR（feature/fix/*）+ 本番即時デプロイ',
    '小規模チーム・継続的デリバリー・シンプル運用',
    'main + PR (feature/fix/*) + immediate production deploy',
    'Small teams, continuous delivery, simple operations'),
];

// Deploy target config: cmd, preview, env, features
var DEPLOY_TARGET_CONFIG = {
  'Vercel': {
    cmd: 'vercel --prod --token $VERCEL_TOKEN',
    preview: 'vercel --token $VERCEL_TOKEN',
    env: 'VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID',
    features: 'Preview deployments per PR, Edge Runtime, Analytics, ISR',
    features_ja: 'PR毎プレビューデプロイ、Edge Runtime、Analytics、ISR'
  },
  'Firebase': {
    cmd: 'firebase deploy --only hosting --token $FIREBASE_TOKEN',
    preview: 'firebase hosting:channel:deploy pr-$PR_NUMBER',
    env: 'FIREBASE_TOKEN, FIREBASE_PROJECT_ID',
    features: 'Preview channels, CDN, Firebase Extensions, Emulator Suite',
    features_ja: 'プレビューチャンネル、CDN、Firebase拡張、エミュレータ'
  },
  'Cloudflare Pages': {
    cmd: 'wrangler pages deploy dist/ --project-name $CF_PROJECT',
    preview: 'wrangler pages deploy dist/ --branch pr-$PR_NUMBER',
    env: 'CF_API_TOKEN, CF_ACCOUNT_ID, CF_PROJECT',
    features: 'Edge deployment, Workers integration, D1 database, R2 storage',
    features_ja: 'エッジデプロイ、Workers統合、D1 DB、R2ストレージ'
  },
  'Railway': {
    cmd: 'railway up --service $RAILWAY_SERVICE',
    preview: 'railway up --service $RAILWAY_SERVICE --detach',
    env: 'RAILWAY_TOKEN, RAILWAY_SERVICE',
    features: 'Auto-deploy from git, private networking, managed Postgres',
    features_ja: 'git自動デプロイ、プライベートネット、マネージドPostgres'
  },
  'Fly.io': {
    cmd: 'fly deploy --app $FLY_APP --remote-only',
    preview: 'fly deploy --app $FLY_APP-pr-$PR_NUMBER --remote-only',
    env: 'FLY_API_TOKEN, FLY_APP',
    features: 'Anycast routing, Machines API, LiteFS, global distribution',
    features_ja: 'Anycastルーティング、Machines API、LiteFS、グローバル配信'
  },
  'Render': {
    cmd: 'curl -X POST "$RENDER_DEPLOY_HOOK"',
    preview: 'curl -X POST "$RENDER_PREVIEW_HOOK?branch=pr-$PR_NUMBER"',
    env: 'RENDER_DEPLOY_HOOK, RENDER_PREVIEW_HOOK',
    features: 'Preview envs, managed databases, cron jobs, private services',
    features_ja: 'プレビュー環境、マネージドDB、cronジョブ、プライベートサービス'
  },
  'AWS': {
    cmd: 'aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment',
    preview: 'aws lightsail create-deployment --service-name $LS_SERVICE',
    env: 'AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, ECS_CLUSTER, ECS_SERVICE',
    features: 'ECS/EKS, CDK IaC, CodePipeline, CloudWatch, multi-AZ HA',
    features_ja: 'ECS/EKS、CDK IaC、CodePipeline、CloudWatch、マルチAZ HA'
  },
  'Docker': {
    cmd: 'kubectl set image deployment/$K8S_DEPLOY app=$IMAGE_TAG --namespace=$K8S_NS',
    preview: 'kubectl apply -f k8s/preview/$PR_NUMBER/ --namespace=preview',
    env: 'KUBECONFIG, K8S_DEPLOY, K8S_NS, REGISTRY_URL',
    features: 'Kubernetes orchestration, Helm charts, Horizontal Pod Autoscaler, rolling updates',
    features_ja: 'Kubernetesオーケストレーション、Helmチャート、HPA、ローリングアップデート'
  },
  'Netlify': {
    cmd: 'netlify deploy --prod --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID',
    preview: 'netlify deploy --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID',
    env: 'NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID',
    features: 'Deploy previews, Edge Functions, Forms, Identity, Split Testing',
    features_ja: 'デプロイプレビュー、Edge Functions、フォーム、ID管理、A/Bテスト'
  },
};

// ============================================================================
// GENERATOR: doc 77 — CI/CD Pipeline Design
// ============================================================================
function gen77(G, domain, dtCfg, a, pn) {
  var dt = a.deploy || 'Vercel';
  var fe = a.frontend || 'React + Next.js';
  var be = a.backend || '';
  var pm = /pnpm/i.test(fe + be) ? 'pnpm' : /yarn/i.test(fe + be) ? 'yarn' : 'npm';
  var isPM = pm === 'pnpm' ? 'pnpm i --frozen-lockfile' : pm === 'yarn' ? 'yarn install --frozen-lockfile' : 'npm ci';
  var isFintechOrInsurance = /fintech|insurance/i.test(domain);
  var isHealthcare = /health/i.test(domain);
  var isEC = /^(ec|marketplace)$/.test(domain);
  var isIoT = /iot/i.test(domain);

  var doc = '';
  doc += '# ' + (G ? 'CI/CDパイプライン設計' : 'CI/CD Pipeline Design') + '\n\n';
  doc += '> **Project:** ' + pn + '  \n';
  doc += '> **Deploy Target:** ' + dt + '  \n';
  doc += '> **Domain:** ' + domain + '  \n';
  doc += '> **Generated:** ' + new Date().toISOString().split('T')[0] + '\n\n';

  doc += '## ' + (G ? '9ステージパイプライン全体図' : '9-Stage Pipeline Overview') + '\n\n';
  doc += '```mermaid\n';
  doc += 'graph TD\n';
  doc += '  A["📥 ' + (G ? 'チェックアウト' : 'Checkout') + '"] --> B["📦 ' + (G ? 'インストール' : 'Install') + '"]\n';
  doc += '  B --> C["🔍 Lint & Type Check"]\n';
  doc += '  C --> D["🧪 ' + (G ? 'テスト実行' : 'Run Tests') + '"]\n';
  doc += '  D --> E["🏗️ ' + (G ? 'ビルド' : 'Build') + '"]\n';
  doc += '  E --> F["🔒 ' + (G ? 'セキュリティスキャン' : 'Security Scan') + '"]\n';
  doc += '  F --> G1["🚀 ' + (G ? 'ステージングデプロイ' : 'Deploy Staging') + '"]\n';
  doc += '  G1 --> H["🎭 E2E ' + (G ? 'テスト' : 'Tests') + '"]\n';
  doc += '  H --> I["🌐 ' + (G ? '本番デプロイ' : 'Deploy Production') + '"]\n';
  if (isFintechOrInsurance) {
    doc += '  I --> J["✅ ' + (G ? 'デュアル承認ゲート' : 'Dual Approval Gate') + '"]\n';
    doc += '  J --> K["🏦 ' + (G ? 'コンプライアンス監査' : 'Compliance Audit') + '"]\n';
  }
  if (isHealthcare) {
    doc += '  I --> J["🏥 ' + (G ? 'HIPAA準拠ステージング' : 'HIPAA Compliance Stage') + '"]\n';
  }
  doc += '\n';
  doc += '  style A fill:#4a9eff,color:#fff\n';
  doc += '  style I fill:#28a745,color:#fff\n';
  if (isFintechOrInsurance || isHealthcare) doc += '  style J fill:#dc3545,color:#fff\n';
  doc += '```\n\n';

  doc += '## ' + (G ? 'ステージ詳細' : 'Stage Details') + '\n\n';
  doc += '| # | ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? 'ツール' : 'Tools') + ' | ' + (G ? '品質ゲート' : 'Quality Gate') + ' |\n';
  doc += '|---|' + (G ? 'ステージ' : 'Stage') + '|' + (G ? 'ツール' : 'Tools') + '|' + (G ? '品質ゲート' : 'Quality Gate') + '|\n';
  doc += '|---|---|---|---|\n';
  PIPELINE_STAGES.forEach(function(s, i) {
    doc += '| ' + (i + 1) + ' | ' + (G ? s.name_ja : s.name_en) + ' | `' + s.tools + '` | ' + (G ? s.gate_ja : s.gate_en) + ' |\n';
  });
  doc += '\n';

  // Domain-specific stages
  if (isFintechOrInsurance) {
    doc += '### ' + (G ? '⚠️ Fintech/Insurance 追加ステージ' : '⚠️ Fintech/Insurance Additional Stages') + '\n\n';
    doc += '| ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? '内容' : 'Content') + ' |\n';
    doc += '|---|---|\n';
    doc += '| ' + (G ? 'デュアル承認デプロイ' : 'Dual Approval Deploy') + ' | ' + (G ? '本番デプロイ前に2名以上の承認者が必要。GitHub Environments + Required Reviewers で実装' : 'Require 2+ approvers before production deploy. Implement via GitHub Environments + Required Reviewers') + ' |\n';
    doc += '| ' + (G ? 'コンプライアンス監査ログ' : 'Compliance Audit Log') + ' | ' + (G ? '全デプロイをAudit Logに記録（JFSA/PCI-DSS要件）' : 'Record all deployments in Audit Log (JFSA/PCI-DSS requirements)') + ' |\n';
    doc += '| ' + (G ? '変更管理チケット' : 'Change Management Ticket') + ' | ' + (G ? 'Jira/GitHub Issueの承認チケットとパイプラインを連携' : 'Link pipeline to Jira/GitHub Issue approval tickets') + ' |\n\n';
  }
  if (isHealthcare) {
    doc += '### ' + (G ? '⚠️ Healthcare HIPAA 追加ステージ' : '⚠️ Healthcare HIPAA Additional Stages') + '\n\n';
    doc += '| ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? '内容' : 'Content') + ' |\n';
    doc += '|---|---|\n';
    doc += '| PHI ' + (G ? 'スキャン' : 'Scan') + ' | ' + (G ? 'PHI（保護対象医療情報）がコードやログに漏れていないか検査。git-secrets / Semgrep PHI rules' : 'Scan for PHI (Protected Health Information) leakage in code/logs. git-secrets / Semgrep PHI rules') + ' |\n';
    doc += '| BAA ' + (G ? '確認' : 'Check') + ' | ' + (G ? 'Business Associate Agreement 締結状況の定期確認' : 'Periodic verification of Business Associate Agreement status') + ' |\n\n';
  }
  if (isEC) {
    doc += '### ' + (G ? '⚠️ EC/Marketplace 追加ステージ' : '⚠️ EC/Marketplace Additional Stages') + '\n\n';
    doc += '| ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? '内容' : 'Content') + ' |\n';
    doc += '|---|---|\n';
    doc += '| ' + (G ? '決済スモークテスト' : 'Payment Smoke Test') + ' | ' + (G ? 'Stripe testモードで決済フロー確認（チェックアウト→webhook受信）' : 'Verify payment flow in Stripe test mode (checkout → webhook received)') + ' |\n';
    doc += '| ' + (G ? '負荷テスト' : 'Load Test') + ' | ' + (G ? 'k6で同時100ユーザーシミュレーション（セール時を想定）' : 'k6 simulation with 100 concurrent users (simulating sales events)') + ' |\n\n';
  }
  if (isIoT) {
    doc += '### ' + (G ? '⚠️ IoT 追加ステージ' : '⚠️ IoT Additional Stages') + '\n\n';
    doc += '| ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? '内容' : 'Content') + ' |\n';
    doc += '|---|---|\n';
    doc += '| ' + (G ? 'ファームウェアビルド' : 'Firmware Build') + ' | ' + (G ? 'クロスコンパイル（ARM/RISC-V）・フラッシュイメージ生成' : 'Cross-compile (ARM/RISC-V), generate flash image') + ' |\n';
    doc += '| OTA ' + (G ? '署名検証' : 'Signature Verify') + ' | ' + (G ? 'OTAパッケージの署名・整合性検証' : 'Sign and verify integrity of OTA update packages') + ' |\n\n';
  }

  doc += '## ' + (G ? 'デプロイ先別GitHub Actions設定' : 'GitHub Actions Config by Deploy Target') + ' (' + dt + ')\n\n';
  doc += '```yaml\n';
  doc += '# .github/workflows/ci-cd.yml\n';
  doc += 'name: CI/CD Pipeline\n';
  doc += 'on:\n';
  doc += '  push:\n';
  doc += '    branches: [main, develop]\n';
  doc += '  pull_request:\n';
  doc += '    branches: [main]\n\n';
  doc += 'env:\n';
  doc += '  NODE_VERSION: "20"\n';
  doc += '  ' + dtCfg.env.split(',')[0].trim() + ': ${{ secrets.' + dtCfg.env.split(',')[0].trim() + ' }}\n\n';
  doc += 'jobs:\n';
  doc += '  ci:\n';
  doc += '    runs-on: ubuntu-latest\n';
  doc += '    steps:\n';
  doc += '      - uses: actions/checkout@v4\n';
  doc += '      - uses: actions/setup-node@v4\n';
  doc += '        with: { node-version: ${{ env.NODE_VERSION }}, cache: "' + pm + '" }\n';
  doc += '      - run: ' + isPM + '\n';
  doc += '      - run: ' + pm + ' run lint\n';
  doc += '      - run: ' + pm + ' run type-check\n';
  doc += '      - run: ' + pm + ' test --coverage\n';
  doc += '      - run: ' + pm + ' run build\n';
  doc += '      - uses: aquasecurity/trivy-action@master\n';
  doc += '        with: { scan-type: "fs", severity: "CRITICAL,HIGH" }\n\n';
  doc += '  deploy-staging:\n';
  doc += '    needs: ci\n';
  doc += '    if: github.ref == \'refs/heads/develop\'\n';
  doc += '    runs-on: ubuntu-latest\n';
  doc += '    steps:\n';
  doc += '      - uses: actions/checkout@v4\n';
  doc += '      - run: ' + dtCfg.preview + '\n\n';
  doc += '  deploy-prod:\n';
  doc += '    needs: [ci, deploy-staging]\n';
  doc += '    if: github.ref == \'refs/heads/main\'\n';
  if (isFintechOrInsurance) {
    doc += '    environment:\n';
    doc += '      name: production\n';
    doc += '      # Required reviewers: set 2+ in GitHub repo settings\n';
  }
  doc += '    runs-on: ubuntu-latest\n';
  doc += '    steps:\n';
  doc += '      - uses: actions/checkout@v4\n';
  doc += '      - run: ' + dtCfg.cmd + '\n';
  doc += '```\n\n';

  doc += '## ' + (G ? 'キャッシュ戦略' : 'Cache Strategy') + '\n\n';
  doc += '| ' + (G ? 'キャッシュ対象' : 'Cache Target') + ' | ' + (G ? 'キー' : 'Key') + ' | ' + (G ? '効果' : 'Effect') + ' |\n';
  doc += '|---|---|---|\n';
  doc += '| node_modules | `${{ runner.os }}-' + pm + '-${{ hashFiles(\'**/lockfile\') }}` | ' + (G ? 'インストール時間60-80%削減' : 'Reduce install time 60-80%') + ' |\n';
  doc += '| Next.js .next/cache | `${{ runner.os }}-nextjs-${{ hashFiles(\'**/*.ts\') }}` | ' + (G ? '差分ビルドで50-70%高速化' : 'Incremental build 50-70% faster') + ' |\n';
  doc += '| Playwright browsers | `${{ runner.os }}-playwright-${{ hashFiles(\'**/package-lock.json\') }}` | ' + (G ? 'ブラウザDL不要（〜2分短縮）' : 'Skip browser download (~2min saved)') + ' |\n\n';

  doc += '## ' + (G ? 'マトリクステスト（Node × OS）' : 'Matrix Tests (Node × OS)') + '\n\n';
  doc += '```yaml\n';
  doc += 'strategy:\n';
  doc += '  matrix:\n';
  doc += '    node: [18, 20, 22]\n';
  doc += '    os: [ubuntu-latest, windows-latest]  # macOS optional\n';
  doc += '```\n\n';

  doc += '## ' + (G ? 'デプロイ先固有機能' : 'Deploy Target Features') + ': ' + dt + '\n\n';
  doc += (G ? dtCfg.features_ja : dtCfg.features) + '\n\n';
  doc += '**' + (G ? 'プレビューデプロイコマンド' : 'Preview Deploy Command') + ':**\n';
  doc += '```bash\n' + dtCfg.preview + '\n```\n';

  return doc;
}

// ============================================================================
// GENERATOR: doc 78 — Deployment Strategy
// ============================================================================
function gen78(G, domain, dtCfg, a, pn) {
  var dt = a.deploy || 'Vercel';
  var isFintechOrInsurance = /fintech|insurance/i.test(domain);
  var isHealthcare = /health/i.test(domain);
  var isSaaS = /saas/.test(domain);

  // Choose recommended strategy
  var recStrategy = isFintechOrInsurance ? 'blue_green' :
                    isSaaS ? 'canary' :
                    /iot|manufacturing|logistics/.test(domain) ? 'rolling' : 'canary';
  var rec = DEPLOY_STRATEGIES.filter(function(s) { return s.id === recStrategy; })[0] || DEPLOY_STRATEGIES[0];

  var doc = '';
  doc += '# ' + (G ? 'デプロイ戦略' : 'Deployment Strategy') + '\n\n';
  doc += '> **Project:** ' + pn + ' | **Domain:** ' + domain + '\n\n';

  doc += '## ' + (G ? '環境戦略 (dev / staging / prod)' : 'Environment Strategy (dev / staging / prod)') + '\n\n';
  doc += '```mermaid\n';
  doc += 'flowchart LR\n';
  doc += '  Dev["🖥️ ' + (G ? 'ローカル開発<br/>Localhost' : 'Local Dev<br/>Localhost') + '"]\n';
  doc += '  PR["🔀 PR ' + (G ? 'プレビュー<br/>自動生成URL' : 'Preview<br/>Auto-generated URL') + '"]\n';
  doc += '  Stg["🧪 Staging<br/>' + (G ? 'main→staging' : 'main→staging') + '"]\n';
  doc += '  Prod["🌐 Production<br/>' + (G ? 'タグ/承認後' : 'Tag/Approval') + '"]\n';
  doc += '  Dev -->|PR作成| PR\n';
  doc += '  PR -->|マージ| Stg\n';
  doc += '  Stg -->|' + (isFintechOrInsurance ? G ? '承認×2' : '2× Approval' : G ? '自動昇格' : 'Auto-promote') + '| Prod\n';
  doc += '```\n\n';

  doc += '| ' + (G ? '環境' : 'Env') + ' | ' + (G ? '目的' : 'Purpose') + ' | ' + (G ? 'トリガー' : 'Trigger') + ' | ' + (G ? 'データ' : 'Data') + ' |\n';
  doc += '|---|---|---|---|\n';
  doc += '| ' + (G ? '開発' : 'Dev') + ' | ' + (G ? 'ローカル開発・TDD' : 'Local dev & TDD') + ' | `git push` | ' + (G ? 'モックデータ' : 'Mock data') + ' |\n';
  doc += '| PR ' + (G ? 'プレビュー' : 'Preview') + ' | ' + (G ? 'コードレビュー・QA確認' : 'Code review & QA check') + ' | PR ' + (G ? '作成' : 'created') + ' | ' + (G ? 'シードデータ' : 'Seeded data') + ' |\n';
  doc += '| Staging | ' + (G ? 'E2E・負荷テスト・リリース前確認' : 'E2E, load test, pre-release check') + ' | main ' + (G ? 'マージ' : 'merge') + ' | ' + (G ? '本番相当の匿名化データ' : 'Anonymized prod-equivalent data') + ' |\n';
  doc += '| Production | ' + (G ? 'エンドユーザー向け本番稼動' : 'End-user production') + ' | ' + (G ? 'タグ付け/承認' : 'Tag/approval') + ' | ' + (G ? '本番データ' : 'Live data') + ' |\n\n';

  doc += '## ' + (G ? 'デプロイ戦略選択' : 'Deploy Strategy Selection') + '\n\n';
  doc += '### ' + (G ? '推奨: ' : 'Recommended: ') + rec.name_ja + ' (' + rec.name_en + ')\n\n';
  doc += '> ' + (G ? rec.desc_ja : rec.desc_en) + '\n\n';
  doc += '| ' + (G ? '項目' : 'Item') + ' | ' + (G ? '内容' : 'Detail') + ' |\n';
  doc += '|---|---|\n';
  doc += '| ' + (G ? 'メリット' : 'Pros') + ' | ' + rec.pros_ja + ' |\n';
  doc += '| ' + (G ? 'デメリット' : 'Cons') + ' | ' + rec.cons_ja + ' |\n';
  doc += '| ' + (G ? '適用場面' : 'When') + ' | ' + rec.when_ja + ' |\n';
  doc += '| ' + (G ? 'ロールバック' : 'Rollback') + ' | ' + rec.rollback_ja + ' |\n\n';

  doc += '### ' + (G ? '全戦略比較' : 'All Strategies Comparison') + '\n\n';
  doc += '| ' + (G ? '戦略' : 'Strategy') + ' | ' + (G ? 'ダウンタイム' : 'Downtime') + ' | ' + (G ? 'コスト' : 'Cost') + ' | ' + (G ? 'ロールバック速度' : 'Rollback Speed') + ' | ' + (G ? '推奨ドメイン' : 'Best for') + ' |\n';
  doc += '|---|---|---|---|---|\n';
  doc += '| ' + (G ? 'ブルーグリーン' : 'Blue-Green') + ' | なし/None | 高/High | 秒/Seconds | ' + (G ? 'fintech/EC/healthcare' : 'fintech/EC/healthcare') + ' |\n';
  doc += '| ' + (G ? 'カナリア' : 'Canary') + ' | なし/None | 中/Med | 分/Minutes | SaaS/SNS |\n';
  doc += '| ' + (G ? 'ローリング' : 'Rolling') + ' | ' + (G ? '最小' : 'Min') + ' | 低/Low | 分/Minutes | ' + (G ? '一般Webアプリ' : 'General web apps') + ' |\n';
  doc += '| Recreate | あり/Yes | 最低/Min | ' + (G ? '即時' : 'Instant') + ' | ' + (G ? '開発/ステージング' : 'Dev/Staging') + ' |\n\n';

  doc += '## ' + (G ? 'ロールバック自動化' : 'Rollback Automation') + '\n\n';
  doc += '```yaml\n';
  doc += '# ' + (G ? '自動ロールバック条件' : 'Auto-rollback conditions') + '\n';
  doc += 'rollback_triggers:\n';
  doc += '  - error_rate: "> 1%"  # ' + (G ? 'エラー率閾値' : 'Error rate threshold') + '\n';
  doc += '  - p95_latency: "> 2000ms"\n';
  doc += '  - health_check: "fail × 3"\n';
  doc += '  - ' + (isFintechOrInsurance ? 'payment_error_rate: "> 0.1%"\n' : 'slo_breach: "true"\n');
  doc += 'rollback_command: "' + (rec.id === 'blue_green' ? G ? 'LBを旧環境に切り替え' : 'Switch LB to old environment' : G ? '前リリースにrevert' : 'Revert to previous release') + '"\n';
  doc += 'notify: ["slack:#deploy-alerts", "pagerduty"]\n';
  doc += '```\n\n';

  doc += '## ' + (G ? 'シークレット管理' : 'Secrets Management') + '\n\n';
  doc += '| ' + (G ? 'シークレット' : 'Secret') + ' | ' + (G ? '保管場所' : 'Storage') + ' | ' + (G ? 'ローテーション' : 'Rotation') + ' |\n';
  doc += '|---|---|---|\n';
  doc += '| API Keys | GitHub Secrets / Vault | ' + (G ? '90日毎' : 'Every 90 days') + ' |\n';
  doc += '| ' + (G ? 'DB接続文字列' : 'DB Connection String') + ' | ' + (G ? 'Env（暗号化）' : 'Env (encrypted)') + ' | ' + (G ? 'DB更新時' : 'On DB update') + ' |\n';
  doc += '| JWT Secret | GitHub Secrets | ' + (G ? '30日毎' : 'Every 30 days') + ' |\n';
  if (isFintechOrInsurance) {
    doc += '| PCI-DSS Keys | AWS KMS / HashiCorp Vault | ' + (G ? '15日毎（PCI要件）' : 'Every 15 days (PCI req)') + ' |\n';
  }
  if (isHealthcare) {
    doc += '| PHI Encryption Key | AWS KMS | ' + (G ? 'HIPAA要件に従い定期更新' : 'Regular rotation per HIPAA') + ' |\n';
  }
  doc += '\n';

  doc += '## ' + (G ? 'ドメイン固有カスタマイズ' : 'Domain-Specific Customization') + '\n\n';
  if (isFintechOrInsurance) {
    doc += '### 🏦 Fintech/Insurance\n';
    doc += '- ' + (G ? '本番デプロイに2名以上の承認者（GitHub Environments Required Reviewers）' : 'Production deploy requires 2+ approvers (GitHub Environments Required Reviewers)') + '\n';
    doc += '- ' + (G ? '変更凍結期間（決算期・規制報告期）の自動デプロイロック' : 'Auto deploy-lock during change freeze periods (fiscal reporting)') + '\n';
    doc += '- ' + (G ? '全デプロイ履歴のイミュータブル監査ログ（JFSA/PCI-DSS要件）' : 'Immutable audit log of all deployments (JFSA/PCI-DSS)') + '\n\n';
  } else if (isHealthcare) {
    doc += '### 🏥 Healthcare (HIPAA)\n';
    doc += '- ' + (G ? 'ステージング環境は本番と同一VPCアーキテクチャで隔離' : 'Staging in isolated VPC matching production architecture') + '\n';
    doc += '- ' + (G ? 'PHIを含む環境変数はAWS Secrets Manager必須' : 'PHI env vars must use AWS Secrets Manager') + '\n';
    doc += '- ' + (G ? 'BAA締結済みサービスのみCIパイプラインに使用可' : 'Only BAA-signed services may be used in CI pipeline') + '\n\n';
  } else if (isSaaS) {
    doc += '### ☁️ SaaS\n';
    doc += '- ' + (G ? 'Feature Flag連携で段階的機能ロールアウト（org単位）' : 'Feature Flag integration for per-org gradual rollout') + '\n';
    doc += '- ' + (G ? 'テナント分離ポリシーをデプロイ後の自動テストで検証' : 'Verify tenant isolation policy via automated post-deploy tests') + '\n\n';
  } else {
    doc += '### 🌐 ' + domain + '\n';
    doc += '- ' + (G ? '標準カナリアデプロイ（5% → 25% → 100%）' : 'Standard canary deploy (5% → 25% → 100%)') + '\n';
    doc += '- ' + (G ? 'SLO監視を継続し自動ロールバック閾値を設定' : 'Monitor SLO continuously with auto-rollback threshold') + '\n\n';
  }

  return doc;
}

// ============================================================================
// GENERATOR: doc 79 — Quality Gate Matrix
// ============================================================================
function gen79(G, domain, dtCfg, a, pn) {
  var isFintechOrInsurance = /fintech|insurance/i.test(domain);
  var isHealthcare = /health/i.test(domain);
  var isEC = /^(ec|marketplace)$/.test(domain);

  var doc = '';
  doc += '# ' + (G ? '品質ゲートマトリクス' : 'Quality Gate Matrix') + '\n\n';
  doc += '> **Project:** ' + pn + ' | **Domain:** ' + domain + '\n\n';

  doc += '## ' + (G ? 'パイプラインステージ × 品質ゲート' : 'Pipeline Stage × Quality Gate Matrix') + '\n\n';
  doc += '| ' + (G ? 'ステージ' : 'Stage') + ' | ' + (G ? 'コード品質' : 'Code Quality') + ' | ' + (G ? 'テストカバレッジ' : 'Test Coverage') + ' | ' + (G ? 'セキュリティ' : 'Security') + ' | ' + (G ? 'パフォーマンス' : 'Performance') + ' | A11y |\n';
  doc += '|---|:---:|:---:|:---:|:---:|:---:|\n';
  doc += '| ' + (G ? 'Lint/型チェック' : 'Lint & Type Check') + ' | 🔴必須 | - | - | - | - |\n';
  doc += '| ' + (G ? 'テスト' : 'Test') + ' | ✅ | 🔴必須 | 🔴必須 | - | - |\n';
  doc += '| ' + (G ? 'ビルド' : 'Build') + ' | ✅ | ✅ | ✅ | ⚠️ | - |\n';
  doc += '| ' + (G ? 'ステージングデプロイ後' : 'Post Staging') + ' | ✅ | ✅ | 🔴必須 | 🔴必須 | ⚠️ |\n';
  doc += '| E2E | ✅ | ✅ | ✅ | 🔴必須 | 🔴必須 |\n';
  doc += '| ' + (G ? '本番デプロイ後' : 'Post Production') + ' | ✅ | ✅ | ✅ | 🔴必須 | ✅ |\n\n';
  doc += '🔴 = ' + (G ? 'ブロッキング (失敗時デプロイ停止)' : 'Blocking (stop deploy on fail)') + '  ⚠️ = ' + (G ? '警告 (継続可)' : 'Warning (continue OK)') + '\n\n';

  doc += '## ' + (G ? '品質ゲート詳細' : 'Quality Gate Details') + '\n\n';
  QUALITY_GATES.forEach(function(qg) {
    doc += '### ' + (G ? qg.name_ja : qg.name_en) + ' ' + (qg.blocking ? '🔴' : '⚠️') + '\n\n';
    doc += '| ' + (G ? '項目' : 'Item') + ' | ' + (G ? '詳細' : 'Detail') + ' |\n';
    doc += '|---|---|\n';
    doc += '| ' + (G ? 'ツール' : 'Tools') + ' | ' + (G ? qg.tools_ja : qg.tools_en) + ' |\n';
    doc += '| ' + (G ? '閾値' : 'Threshold') + ' | ' + (G ? qg.threshold_ja : qg.threshold_en) + ' |\n';
    doc += '| ' + (G ? 'ブロッキング' : 'Blocking') + ' | ' + (qg.blocking ? G ? '✅ はい' : '✅ Yes' : G ? '❌ いいえ（警告のみ）' : '❌ No (warning only)') + ' |\n\n';
  });

  doc += '## ' + (G ? 'カバレッジ閾値' : 'Coverage Thresholds') + '\n\n';
  doc += '```json\n';
  doc += '// vitest.config.ts / jest.config.ts\n';
  doc += '{\n';
  doc += '  "coverage": {\n';
  doc += '    "thresholds": {\n';
  doc += '      "lines": ' + (isFintechOrInsurance ? 90 : isHealthcare ? 85 : 80) + ',\n';
  doc += '      "branches": ' + (isFintechOrInsurance ? 85 : 75) + ',\n';
  doc += '      "functions": ' + (isFintechOrInsurance ? 90 : 80) + ',\n';
  doc += '      "statements": ' + (isFintechOrInsurance ? 90 : 80) + '\n';
  doc += '    }\n';
  doc += '  }\n';
  doc += '}\n';
  doc += '```\n\n';

  doc += '## ' + (G ? 'パフォーマンス予算' : 'Performance Budget') + '\n\n';
  doc += '| ' + (G ? '指標' : 'Metric') + ' | ' + (G ? '目標値' : 'Target') + ' | ' + (G ? 'ツール' : 'Tool') + ' |\n';
  doc += '|---|---|---|\n';
  doc += '| LCP | < 2.5s | Lighthouse CI |\n';
  doc += '| FCP | < 1.8s | Lighthouse CI |\n';
  doc += '| TBT | < 200ms | Lighthouse CI |\n';
  doc += '| CLS | < 0.1 | Lighthouse CI |\n';
  doc += '| ' + (G ? 'JSバンドル' : 'JS Bundle') + ' | < 250KB (gzip) | Bundle Analyzer |\n';
  doc += '| API p95 | < ' + (isFintechOrInsurance ? '200' : '500') + 'ms | k6 |\n';
  if (isEC) {
    doc += '| ' + (G ? '決済フロー完了時間' : 'Checkout Flow Time') + ' | < 3s | Playwright |\n';
  }
  doc += '\n';

  doc += '## ' + (G ? 'ドメイン固有品質ゲート' : 'Domain-Specific Quality Gates') + '\n\n';
  if (isFintechOrInsurance) {
    doc += '### 🏦 Fintech/Insurance\n\n';
    doc += '| ' + (G ? 'ゲート' : 'Gate') + ' | ' + (G ? '条件' : 'Condition') + ' | ' + (G ? 'ツール' : 'Tool') + ' |\n';
    doc += '|---|---|---|\n';
    doc += '| ' + (G ? 'コンプライアンス監査' : 'Compliance Audit') + ' | ' + (G ? 'PCI-DSS/JFSA要件チェックリスト100%' : 'PCI-DSS/JFSA checklist 100%') + ' | Custom script |\n';
    doc += '| ' + (G ? '暗号化検証' : 'Encryption Check') + ' | ' + (G ? 'TLS 1.3以上・AES-256確認' : 'TLS 1.3+ & AES-256 verification') + ' | ssllabs-scan |\n';
    doc += '| ' + (G ? '冪等性テスト' : 'Idempotency Test') + ' | ' + (G ? '同一リクエスト×3で重複処理なし' : 'No duplicate processing on 3x same request') + ' | Custom E2E |\n\n';
  } else if (isHealthcare) {
    doc += '### 🏥 Healthcare\n\n';
    doc += '| ' + (G ? 'ゲート' : 'Gate') + ' | ' + (G ? '条件' : 'Condition') + ' | ' + (G ? 'ツール' : 'Tool') + ' |\n';
    doc += '|---|---|---|\n';
    doc += '| PHI ' + (G ? 'リーク検査' : 'Leak Check') + ' | ' + (G ? 'PHIパターンがコード/ログ/APIレスポンスに存在しない' : 'No PHI pattern in code/logs/API responses') + ' | git-secrets, Semgrep |\n';
    doc += '| HIPAA ' + (G ? '監査' : 'Audit') + ' | ' + (G ? '全アクセスログに医療従事者IDと患者IDの記録' : 'All access logs record provider ID + patient ID') + ' | Custom |\n\n';
  } else if (isEC) {
    doc += '### 🛒 EC/Marketplace\n\n';
    doc += '| ' + (G ? 'ゲート' : 'Gate') + ' | ' + (G ? '条件' : 'Condition') + ' | ' + (G ? 'ツール' : 'Tool') + ' |\n';
    doc += '|---|---|---|\n';
    doc += '| ' + (G ? '決済E2E' : 'Payment E2E') + ' | ' + (G ? 'Stripe testモードで全決済フロー成功' : 'All payment flows succeed in Stripe test mode') + ' | Playwright + Stripe CLI |\n';
    doc += '| ' + (G ? '在庫整合性' : 'Inventory Check') + ' | ' + (G ? '在庫数が負にならない（同時購入シナリオ）' : 'Stock never goes negative (concurrent purchase scenario)') + ' | k6 custom scenario |\n\n';
  } else {
    var _gen79dqa = typeof DOMAIN_QA_MAP !== 'undefined' ? (DOMAIN_QA_MAP[domain] || null) : null;
    if(_gen79dqa && _gen79dqa.focus_ja && _gen79dqa.focus_ja.length > 0) {
      doc += '### ' + (G ? domain + ' テスト重点領域' : domain + ' Test Focus Areas') + '\n\n';
      doc += '| ' + (G ? 'ゲート' : 'Gate') + ' | ' + (G ? '条件' : 'Condition') + ' | ' + (G ? 'ツール' : 'Tool') + ' |\n';
      doc += '|---|---|---|\n';
      var _g79focus = G ? _gen79dqa.focus_ja : _gen79dqa.focus_en;
      _g79focus.forEach(function(f){doc += '| '+f+' | '+(G?'✅ 確認済':'✅ Verified')+' | '+(G?'カスタムE2E':'Custom E2E')+' |\n';});
      doc += '\n';
      if(_gen79dqa.bugs_ja && _gen79dqa.bugs_ja.length > 0) {
        doc += '#### ' + (G ? '回帰テスト必須シナリオ (DOMAIN_QA_MAP)' : 'Required Regression Test Scenarios (DOMAIN_QA_MAP)') + '\n\n';
        var _g79bugs = G ? _gen79dqa.bugs_ja : _gen79dqa.bugs_en;
        _g79bugs.forEach(function(b){doc += '- 🔴 '+b+'\n';});
        doc += '\n';
      }
    } else {
      doc += '### 🌐 ' + domain + '\n\n';
      doc += (G ? '標準品質ゲートを適用。ドメイン固有の追加ゲートは必要に応じて設定してください。' : 'Apply standard quality gates. Add domain-specific gates as needed.') + '\n\n';
    }
  }

  // Feature-Specific Acceptance Gates (via getFeatureDetail)
  var _cicdFeatures = (a.mvp_features || '').split(/[,、]/).map(function(f){return f.trim();}).filter(Boolean);
  var _cicdFdItems = [];
  _cicdFeatures.forEach(function(f) {
    var fd = typeof getFeatureDetail === 'function' ? getFeatureDetail(f) : null;
    if (!fd) return;
    var criteria = G ? (fd.criteria_ja || []) : (fd.criteria_en || []);
    if (criteria.length > 0) _cicdFdItems.push({name: f, criteria: criteria.slice(0, 3)});
  });
  if (_cicdFdItems.length > 0) {
    doc += '## ' + (G ? 'フィーチャー別デプロイ前受入ゲート' : 'Feature-Specific Pre-Deploy Acceptance Gates') + '\n\n';
    doc += (G ? '機能仕様から導出した受入条件。ステージング環境でのE2E検証に含めてください。\n\n' : 'Acceptance criteria derived from feature specs. Include in staging E2E validation.\n\n');
    doc += '| ' + (G ? 'フィーチャー' : 'Feature') + ' | ' + (G ? '受入条件' : 'Acceptance Criterion') + ' | ' + (G ? '検証' : 'Verified') + ' |\n';
    doc += '|---|---|:---:|\n';
    _cicdFdItems.forEach(function(item) {
      item.criteria.forEach(function(c, ci) {
        doc += '| ' + (ci === 0 ? item.name : '') + ' | ' + c + ' | ⬜ |\n';
      });
    });
    doc += '\n';
  }

  doc += '## ' + (G ? '品質ゲートMermaid' : 'Quality Gate Flow (Mermaid)') + '\n\n';
  doc += '```mermaid\n';
  doc += 'flowchart TD\n';
  doc += '  S["' + (G ? 'PR作成' : 'PR Created') + '"] --> L{"Lint OK?"}\n';
  doc += '  L -->|No| F1["❌ ' + (G ? 'ブロック' : 'Block') + '"]\n';
  doc += '  L -->|Yes| T{"' + (G ? 'テスト+カバレッジ' : 'Test+Coverage') + ' OK?"}\n';
  doc += '  T -->|No| F2["❌ ' + (G ? 'ブロック' : 'Block') + '"]\n';
  doc += '  T -->|Yes| SC{"' + (G ? 'セキュリティスキャン' : 'Security Scan') + ' OK?"}\n';
  doc += '  SC -->|No| F3["❌ ' + (G ? 'ブロック' : 'Block') + '"]\n';
  doc += '  SC -->|Yes| D["✅ ' + (G ? 'ステージングデプロイ' : 'Deploy Staging') + '"]\n';
  doc += '  D --> P{"' + (G ? 'パフォーマンス予算' : 'Perf Budget') + ' OK?"}\n';
  doc += '  P -->|No| F4["⚠️ ' + (G ? '警告' : 'Warning') + '"]\n';
  doc += '  P -->|Yes| PROD["🌐 ' + (G ? '本番デプロイ' : 'Deploy Prod') + '"]\n';
  doc += '```\n';

  return doc;
}

// ============================================================================
// GENERATOR: doc 80 — Release Engineering
// ============================================================================
function gen80(G, domain, dtCfg, a, pn) {
  var isSaaS = /saas/.test(domain);
  var isFintechOrInsurance = /fintech|insurance/i.test(domain);
  var isSmallTeam = /tool|portfolio|creator/.test(domain);

  // Choose branch model
  var recModel = isFintechOrInsurance ? 'gitflow' :
                 isSaaS || isSmallTeam ? 'trunk' : 'github_flow';
  var rec = RELEASE_MODELS.filter(function(m) { return m.id === recModel; })[0] || RELEASE_MODELS[0];

  var doc = '';
  doc += '# ' + (G ? 'リリースエンジニアリング' : 'Release Engineering') + '\n\n';
  doc += '> **Project:** ' + pn + ' | **Domain:** ' + domain + '\n\n';

  doc += '## ' + (G ? 'ブランチモデル' : 'Branch Model') + '\n\n';
  doc += '### ' + (G ? '推奨: ' : 'Recommended: ') + rec.name_ja + '\n\n';
  doc += '> ' + (G ? rec.branches_ja : rec.branches_en) + '\n\n';
  doc += '**' + (G ? '最適なケース:' : 'Best for:') + '** ' + (G ? rec.best_for_ja : rec.best_for_en) + '\n\n';

  doc += '```mermaid\n';
  doc += 'gitGraph\n';
  if (rec.id === 'trunk') {
    doc += '   commit id: "main: feat-A"\n';
    doc += '   branch feature/short-lived\n';
    doc += '   commit id: "feat: new feature"\n';
    doc += '   checkout main\n';
    doc += '   merge feature/short-lived id: "merge+deploy"\n';
    doc += '   commit id: "main: feat-B"\n';
  } else if (rec.id === 'gitflow') {
    doc += '   commit id: "main: v1.0.0"\n';
    doc += '   branch develop\n';
    doc += '   commit id: "develop: init"\n';
    doc += '   branch feature/auth\n';
    doc += '   commit id: "feat: auth"\n';
    doc += '   checkout develop\n';
    doc += '   merge feature/auth\n';
    doc += '   branch release/1.1.0\n';
    doc += '   commit id: "release: bump"\n';
    doc += '   checkout main\n';
    doc += '   merge release/1.1.0 id: "v1.1.0"\n';
  } else {
    doc += '   commit id: "main: v1.0"\n';
    doc += '   branch feat/user-auth\n';
    doc += '   commit id: "feat: auth impl"\n';
    doc += '   checkout main\n';
    doc += '   merge feat/user-auth id: "deploy"\n';
  }
  doc += '```\n\n';

  doc += '| ' + (G ? 'モデル' : 'Model') + ' | ' + (G ? 'ブランチ構成' : 'Branches') + ' | ' + (G ? '推奨シーン' : 'Best for') + ' |\n';
  doc += '|---|---|---|\n';
  RELEASE_MODELS.forEach(function(m) {
    doc += '| **' + m.name_en + '** | `' + (G ? m.branches_ja : m.branches_en).substring(0, 40) + '...` | ' + (G ? m.best_for_ja : m.best_for_en) + ' |\n';
  });
  doc += '\n';

  doc += '## ' + (G ? 'セマンティックバージョニング' : 'Semantic Versioning') + '\n\n';
  doc += '```\n';
  doc += 'MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]\n\n';
  doc += 'MAJOR: ' + (G ? '破壊的変更（APIの後方非互換）' : 'Breaking changes (backward-incompatible API)') + '\n';
  doc += 'MINOR: ' + (G ? '新機能追加（後方互換）' : 'New features (backward-compatible)') + '\n';
  doc += 'PATCH: ' + (G ? 'バグ修正（後方互換）' : 'Bug fixes (backward-compatible)') + '\n\n';
  doc += G ? '例:' : 'Example:';
  doc += '\n  1.0.0 → 1.0.1  (バグ修正/bugfix)\n';
  doc += '  1.0.1 → 1.1.0  (新機能/feature)\n';
  doc += '  1.1.0 → 2.0.0  (破壊的変更/breaking)\n';
  doc += '```\n\n';

  doc += '```yaml\n';
  doc += '# .github/workflows/release.yml\n';
  doc += '# ' + (G ? 'セマンティックリリース自動化' : 'Semantic release automation') + '\n';
  doc += 'name: Release\n';
  doc += 'on:\n';
  doc += '  push:\n';
  doc += '    branches: [main]\n';
  doc += 'jobs:\n';
  doc += '  release:\n';
  doc += '    runs-on: ubuntu-latest\n';
  doc += '    steps:\n';
  doc += '      - uses: actions/checkout@v4\n';
  doc += '        with: { fetch-depth: 0 }\n';
  doc += '      - uses: cycjimmy/semantic-release-action@v4\n';
  doc += '        env:\n';
  doc += '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}\n';
  doc += '          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}\n';
  doc += '```\n\n';

  doc += '## CHANGELOG ' + (G ? '自動化 (Conventional Commits)' : 'Automation (Conventional Commits)') + '\n\n';
  doc += '```\n';
  doc += G ? 'コミットメッセージ規約:' : 'Commit message convention:';
  doc += '\n  feat: '     + (G ? '新機能（MINOR）' : 'New feature (MINOR)') + '\n';
  doc += '  fix: '       + (G ? 'バグ修正（PATCH）' : 'Bug fix (PATCH)') + '\n';
  doc += '  feat!: '     + (G ? '破壊的変更（MAJOR）' : 'Breaking change (MAJOR)') + '\n';
  doc += '  chore: '     + (G ? 'ビルド・ツール変更（リリースなし）' : 'Build/tooling (no release)') + '\n';
  doc += '  docs: '      + (G ? 'ドキュメント（リリースなし）' : 'Docs (no release)') + '\n';
  doc += '  refactor: '  + (G ? 'リファクタリング（PATCH or リリースなし）' : 'Refactor (PATCH or no release)') + '\n';
  doc += '  test: '      + (G ? 'テスト追加（リリースなし）' : 'Test additions (no release)') + '\n';
  doc += '```\n\n';

  // M7: Release Notes Template
  doc += '## ' + (G ? 'リリースノート テンプレート' : 'Release Notes Template') + '\n\n';
  doc += '```markdown\n';
  doc += '## v{VERSION} (' + (G ? 'YYYY-MM-DD' : 'YYYY-MM-DD') + ')\n\n';
  doc += '### ' + (G ? '✨ 新機能' : '✨ New Features') + '\n';
  doc += '- \n\n';
  doc += '### ' + (G ? '🔧 改善' : '🔧 Improvements') + '\n';
  doc += '- \n\n';
  doc += '### ' + (G ? '🐛 バグ修正' : '🐛 Bug Fixes') + '\n';
  doc += '- \n\n';
  doc += '### ' + (G ? '💥 破壊的変更' : '💥 Breaking Changes') + '\n';
  doc += (G ? '> なし (ある場合は移行手順を記載)\n' : '> None (document migration steps if present)\n');
  doc += '```\n\n';

  doc += '## ' + (G ? '依存関係の自動更新' : 'Dependency Auto-Update') + '\n\n';
  doc += '```yaml\n';
  doc += '# .github/renovate.json\n';
  doc += '{\n';
  doc += '  "$schema": "https://docs.renovatebot.com/renovate-schema.json",\n';
  doc += '  "extends": ["config:best-practices"],\n';
  doc += '  "schedule": ["before 6am on monday"],\n';
  doc += '  "automerge": true,\n';
  doc += '  "packageRules": [\n';
  doc += '    {\n';
  doc += '      "matchDepTypes": ["devDependencies"],\n';
  doc += '      "automerge": true\n';
  doc += '    },\n';
  if (isFintechOrInsurance) {
    doc += '    {\n';
    doc += '      "matchPackagePatterns": [".*"],\n';
    doc += '      "automerge": false,\n';
    doc += '      "reviewers": ["@security-team"],\n';
    doc += '      "labels": ["security-review"]\n';
    doc += '    },\n';
  }
  doc += '    {\n';
  doc += '      "matchUpdateTypes": ["major"],\n';
  doc += '      "automerge": false,\n';
  doc += '      "reviewers": ["@team/lead"]\n';
  doc += '    }\n';
  doc += '  ]\n';
  doc += '}\n';
  doc += '```\n\n';

  doc += '## SBOM (' + (G ? 'ソフトウェア部品表)' : 'Software Bill of Materials)') + '\n\n';
  doc += '```yaml\n';
  doc += '# GitHub Actions - SBOM generation\n';
  doc += '- uses: anchore/sbom-action@v0\n';
  doc += '  with:\n';
  doc += '    artifact-name: sbom-' + pn.toLowerCase().replace(/\s/g, '-') + '.spdx.json\n';
  doc += '    format: spdx-json\n';
  doc += '    output-file: sbom.spdx.json\n';
  doc += '```\n\n';
  doc += (G ? 'SBOMはリリースアーティファクトとして保存し、サプライチェーンセキュリティ（SLSA Level 2以上）に使用します。' : 'Store SBOM as release artifact for supply chain security (SLSA Level 2+).') + '\n\n';

  doc += '## ' + (G ? '緊急ホットフィックスフロー' : 'Emergency Hotfix Flow') + '\n\n';
  doc += '```mermaid\n';
  doc += 'flowchart LR\n';
  doc += '  A["🚨 ' + (G ? '本番障害検知' : 'Production incident') + '"] --> B["hotfix/' + (G ? '障害内容' : 'issue') + ' ' + (G ? 'ブランチ作成' : 'branch') + '"]\n';
  doc += '  B --> C["' + (G ? '修正実装' : 'Implement fix') + '"]\n';
  doc += '  C --> D["CI ' + (G ? 'パス確認' : 'pass check') + '"]\n';
  doc += '  D --> E["main ' + (G ? 'へPR/マージ' : 'PR & merge') + '"]\n';
  doc += '  E --> F["🚀 ' + (G ? '緊急デプロイ' : 'Emergency deploy') + '"]\n';
  if (rec.id === 'gitflow') {
    doc += '  F --> G["develop ' + (G ? 'にバックポート' : 'backport') + '"]\n';
  }
  doc += '```\n\n';

  // dev_env_type: branch strategy by dev environment
  var devEnv = a.dev_env_type || '';
  var isCloud = /Cloud|クラウド/i.test(devEnv);
  var isHybrid = /Hybrid|ハイブリッド/i.test(devEnv);
  doc += '## ' + (G ? '開発環境別ブランチ戦略' : 'Branch Strategy by Dev Environment') + '\n\n';
  if (isCloud) {
    doc += (G ? '**クラウド開発**: Trunk-Based Development推奨 — プレビューデプロイでPR単位の確認が可能\n' : '**Cloud Dev**: Trunk-Based Development — preview deploys enable PR-level verification\n');
  } else if (isHybrid) {
    doc += (G ? '**ハイブリッド**: GitHub Flow推奨 — ローカルテスト+クラウドプレビューの併用\n' : '**Hybrid**: GitHub Flow — combine local tests with cloud previews\n');
  } else {
    doc += (G ? '**ローカル開発**: Feature Branch + CI推奨 — ローカルテスト完了後にPR作成\n' : '**Local Dev**: Feature Branch + CI — create PRs after local tests pass\n');
  }
  doc += '\n';

  // C1: App Store submission checklist (mobile apps only)
  var _mobC1 = a.mobile || '';
  if (_mobC1 && !/なし|none/i.test(_mobC1) && /expo|react.?native|flutter/i.test(_mobC1)) {
    doc += '## ' + (G ? 'App Store / Google Play 提出前チェックリスト' : 'App Store / Google Play Submission Checklist') + '\n\n';
    doc += '### Apple App Store\n\n';
    doc += '- [ ] ' + (G ? 'デモアカウント情報 (App Review Team用)' : 'Demo account credentials for App Review Team') + '\n';
    doc += '- [ ] ' + (G ? '年齢区分設定 (Age Rating Questionnaire)' : 'Age rating questionnaire completed') + '\n';
    doc += '- [ ] ' + (G ? 'Privacy Nutrition Labels — データ収集・使用目的の申告' : 'Privacy Nutrition Labels — declare data collection & use') + '\n';
    doc += '- [ ] ' + (G ? 'App Privacy Policy URL の登録' : 'App Privacy Policy URL registered') + '\n';
    doc += '- [ ] ' + (G ? 'エクスポートコンプライアンス (暗号化使用申告)' : 'Export compliance (encryption usage declaration)') + '\n';
    doc += '- [ ] ' + (G ? 'スクリーンショット全解像度 (6.9", 6.5", 5.5")' : 'Screenshots for all required sizes (6.9", 6.5", 5.5")') + '\n\n';
    doc += '### Google Play\n\n';
    doc += '- [ ] ' + (G ? 'Data Safety Section — データ収集・共有・セキュリティの申告' : 'Data Safety Section — declare data collection, sharing, and security') + '\n';
    doc += '- [ ] ' + (G ? 'ターゲット API レベル (最新 Android 要件に準拠)' : 'Target API level meets latest Android requirements') + '\n';
    doc += '- [ ] ' + (G ? 'コンテンツレーティング (IARC) 完了' : 'Content rating (IARC) completed') + '\n';
    doc += '- [ ] ' + (G ? 'プライバシーポリシー URL の登録' : 'Privacy policy URL registered') + '\n';
    doc += '- [ ] ' + (G ? '高解像度アイコン (512x512 PNG)' : 'Hi-res icon (512x512 PNG)') + '\n\n';
  }

  return doc;
}

// ============================================================================
// ORCHESTRATOR
// ============================================================================
function genPillar20_CICDIntelligence(a, pn) {
  var G = S.genLang === 'ja';
  var domain = detectDomain(a.purpose || '') || 'saas';
  var dt = a.deploy || 'Vercel';
  // Normalize Docker key (JA: 'Docker (自前)', EN: 'Docker (self-hosted)' → 'Docker')
  var dtKey = /Docker/i.test(dt) ? 'Docker' : dt;
  var dtCfg = DEPLOY_TARGET_CONFIG[dtKey] || DEPLOY_TARGET_CONFIG['Vercel'];

  S.files['docs/77_cicd_pipeline_design.md'] = gen77(G, domain, dtCfg, a, pn);
  S.files['docs/78_deployment_strategy.md'] = gen78(G, domain, dtCfg, a, pn);
  S.files['docs/79_quality_gate_matrix.md'] = gen79(G, domain, dtCfg, a, pn);
  S.files['docs/80_release_engineering.md'] = gen80(G, domain, dtCfg, a, pn);
}
