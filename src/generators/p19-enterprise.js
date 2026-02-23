// P19: Enterprise SaaS Blueprint
// Generates: docs/73_enterprise_architecture.md, 74_workflow_engine.md,
//            75_admin_dashboard_spec.md, 76_enterprise_components.md

// ============================================================================
// DATA CONSTANTS
// ============================================================================

// Factory: Enterprise Architecture Pattern
function _ep(pattern, tenantIsolation, rbacModel, scalingStrategy, rlsExample) {
  return {pattern, tenantIsolation, rbacModel, scalingStrategy, rlsExample};
}
var ENTERPRISE_ARCH_PATTERNS = {
  rls: _ep('Row-Level Security (RLS)',
    'org_id column on all tables + Supabase/Postgres RLS policies',
    'Owner > Admin > Member > Viewer (4-tier)',
    'Single DB, scales to millions of tenants with row filtering',
    'USING (org_id IN (SELECT org_id FROM org_members WHERE user_id = auth.uid()))'
  ),
  schema: _ep('Schema-per-tenant',
    'Separate Postgres schema per tenant (search_path = tenant_{id})',
    'Role inherited from schema owner + row-level for sub-roles',
    'Good isolation, ~1K tenant limit per instance; use with pgBouncer',
    'SET search_path TO tenant_<org_id>; -- per connection'
  ),
  db: _ep('Database-per-tenant',
    'Separate DB instance per tenant (connection string in config table)',
    'Full DB-level role separation, no cross-tenant queries possible',
    'Maximum isolation; high cost; use for regulated industries (fintech/health)',
    'N/A — isolation at DB level; use separate Supabase projects'
  ),
  hybrid: _ep('Hybrid (RLS + Feature Flags)',
    'RLS for data + LaunchDarkly/Unleash for feature gating per org plan',
    'RLS roles + plan-based feature entitlements (free/pro/enterprise)',
    'Best of both: data isolation + flexible feature rollout per org tier',
    'USING (org_id IN (...)) AND EXISTS (SELECT 1 FROM org_features WHERE org_id = org_members.org_id AND feature = \'advanced_reports\')'
  )
};

// Factory: Workflow state machine
function _wf(name, name_ja, states, transitions, roles, sla_ja, sla_en) {
  return {name, name_ja, states, transitions, roles, sla_ja, sla_en};
}
var WORKFLOW_TEMPLATES = {
  approval: _wf('Approval', '承認ワークフロー',
    ['draft', 'pending', 'approved', 'rejected', 'cancelled'],
    [['draft','pending','Submit for review'],['pending','approved','Approver approves'],['pending','rejected','Approver rejects'],['rejected','draft','Requester revises'],['pending','cancelled','Requester cancels']],
    ['Requester: create/edit draft, cancel', 'Approver: approve/reject', 'Admin: override any state'],
    '承認期限: SLA 48h / エスカレーション: 72h で上位承認者へ自動通知',
    'Approval SLA: 48h / Escalation: auto-notify senior approver after 72h'
  ),
  ticket: _wf('Ticket', 'チケット管理',
    ['open', 'in_progress', 'review', 'resolved', 'closed'],
    [['open','in_progress','Assign to agent'],['in_progress','review','Mark for review'],['review','resolved','Verify fix'],['resolved','closed','Auto-close after 7d'],['resolved','open','Customer re-opens']],
    ['Customer: create/reopen', 'Agent: move to in_progress/review', 'Manager: close/escalate'],
    '応答時間: P1=1h, P2=4h, P3=24h / 解決時間: P1=4h, P2=8h, P3=72h',
    'Response: P1=1h, P2=4h, P3=24h / Resolution: P1=4h, P2=8h, P3=72h'
  ),
  order: _wf('Order', '注文フロー',
    ['created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    [['created','paid','Payment confirmed'],['paid','processing','Fulfillment starts'],['processing','shipped','Carrier pickup'],['shipped','delivered','Delivery confirmed'],['created','cancelled','Customer cancels'],['paid','cancelled','Refund initiated']],
    ['Customer: create/cancel unpaid', 'Warehouse: processing/ship', 'System: auto-delivered via webhook'],
    '処理時間: 支払→発送 24h以内 / 配達確認: 配送完了から48h以内に自動確認',
    'Processing: payment→ship within 24h / Delivery confirm: auto-confirm within 48h'
  ),
  contract: _wf('Contract', '契約管理',
    ['draft', 'review', 'negotiation', 'signed', 'active', 'expired'],
    [['draft','review','Submit for review'],['review','negotiation','Request changes'],['negotiation','review','Re-submit revised'],['review','signed','All parties sign'],['signed','active','Effective date reached'],['active','expired','End date reached']],
    ['Author: create/edit draft', 'Legal: review/negotiate', 'Signatory: sign', 'System: activate/expire'],
    'レビュー期限: 5営業日 / 署名期限: 10営業日 / 期限切れ: 終了日+30日でアーカイブ',
    'Review deadline: 5 business days / Signing deadline: 10 days / Expiry: archive 30d after end date'
  ),
  onboarding: _wf('Onboarding', 'オンボーディング',
    ['invited', 'registered', 'profile_setup', 'team_joined', 'active'],
    [['invited','registered','User registers'],['registered','profile_setup','Complete profile'],['profile_setup','team_joined','Join/create team'],['team_joined','active','Complete checklist']],
    ['System: send invite/reminders', 'User: progress through steps', 'Admin: monitor/resend invites'],
    'フォローアップ: 招待後24h未登録→リマインダー / 7日未完了→管理者通知',
    'Follow-up: 24h no register→reminder / 7d incomplete→admin notify'
  )
};

// Factory: Admin dashboard specification
function _adm(category, category_ja, kpis, widgets_ja, widgets_en) {
  return {category, category_ja, kpis, widgets_ja, widgets_en};
}
var ADMIN_DASHBOARD_SPECS = {
  overview: _adm('Overview', '概要', ['total_users', 'active_orgs', 'mrr', 'churn_rate'],
    ['総ユーザー数 (前週比)', 'アクティブ組織数', 'MRR (月次課金収入)', 'チャーン率 (7日移動平均)', '日次新規登録グラフ', '機能別利用率ヒートマップ'],
    ['Total users (vs. last week)', 'Active organizations', 'MRR (monthly recurring revenue)', 'Churn rate (7-day moving avg)', 'Daily registration chart', 'Feature adoption heatmap']
  ),
  users: _adm('User Analytics', 'ユーザー分析', ['dau_mau', 'retention', 'cohort'],
    ['DAU/MAU比率', '7日/30日リテンション', 'コホート分析テーブル', 'ユーザーセグメント分布', 'スキルレベル別利用パターン', 'オンボーディング完了率'],
    ['DAU/MAU ratio', '7-day / 30-day retention', 'Cohort analysis table', 'User segment distribution', 'Usage patterns by skill level', 'Onboarding completion rate']
  ),
  billing: _adm('Billing', '課金管理', ['mrr', 'arr', 'arpu', 'ltv'],
    ['プラン別収益内訳', 'MRR推移グラフ (12ヶ月)', 'アップグレード/ダウングレード率', 'ARPU (ユーザー単価)', 'LTV予測', 'Stripe Webhook受信ステータス'],
    ['Revenue by plan', 'MRR trend (12 months)', 'Upgrade/downgrade rate', 'ARPU (average revenue per user)', 'LTV forecast', 'Stripe Webhook status']
  ),
  ops: _adm('Operations', '運用管理', ['sla_compliance', 'ticket_resolution', 'uptime'],
    ['SLA遵守率 (目標99%)', 'チケット平均解決時間', 'サービス稼働率', '未解決チケット (優先度別)', '監査ログ最近50件', 'APIエラー率ダッシュボード'],
    ['SLA compliance rate (target 99%)', 'Avg ticket resolution time', 'Service uptime', 'Open tickets by priority', 'Recent 50 audit log entries', 'API error rate dashboard']
  )
};

// Factory: Enterprise UI Component
function _ec(name, props_ja, variants_ja, a11y_ja, framework) {
  return {name, props_ja, variants_ja, a11y_ja, framework};
}
var ENTERPRISE_COMPONENTS = {
  StatusBadge: _ec('StatusBadge',
    ['status: string (draft|pending|approved|rejected|active|expired)', 'size?: sm|md|lg', 'variant?: solid|outline|subtle'],
    ['pending → 黄色 (⏳)', 'approved → 緑 (✅)', 'rejected → 赤 (❌)', 'active → 青 (🔵)', 'expired → グレー'],
    ['role="status" aria-label="{status}"', 'カラーだけでなくアイコン+テキストで状態を伝達'],
    'shadcn/ui Badge + カスタムバリアント / Vuetify v-chip / Angular Material chip'
  ),
  ApprovalBar: _ec('ApprovalBar',
    ['request: ApprovalRequest', 'onApprove: (id) => void', 'onReject: (id, reason) => void', 'currentUserRole: string'],
    ['pending (承認待ち: 承認/却下ボタン表示)', 'approved (完了: 緑バナー)', 'rejected (却下: 理由表示)'],
    ['button aria-label="承認"/"却下"', '却下時はモーダルでreason入力必須', 'aria-disabled={!canApprove}'],
    'shadcn/ui AlertDialog + Button / Headless UI Dialog'
  ),
  DataTable: _ec('DataTable',
    ['data: T[]', 'columns: ColumnDef<T>[]', 'sortable?: boolean', 'filterable?: boolean', 'paginated?: boolean', 'onRowSelect?: (rows) => void', 'bulkActions?: Action[]'],
    ['基本テーブル', 'ソート有効', 'フィルタ有効', 'ページネーション', '行選択+一括操作'],
    ['role="table" + aria-sort', 'ページネーション aria-label="ページ {n}"', 'フィルタ label 対応'],
    'TanStack Table v8 + shadcn/ui / AG Grid Community / Vuetify v-data-table'
  ),
  NotificationBell: _ec('NotificationBell',
    ['count: number', 'items: Notification[]', 'onRead: (id) => void', 'onReadAll: () => void', 'maxDisplay?: number'],
    ['未読あり (赤バッジ+数字)', '未読なし (通常アイコン)', 'ドロップダウン展開 (最新5件)'],
    ['aria-label="通知 {count}件未読"', 'role="alert" aria-live="polite" (新着時)', '通知リスト role="list"'],
    'shadcn/ui Popover + Badge / Radix UI Popover'
  ),
  OrgSwitcher: _ec('OrgSwitcher',
    ['orgs: Organization[]', 'current: Organization', 'onChange: (org) => void', 'canCreate?: boolean'],
    ['単一組織 (表示のみ)', '複数組織 (切替ドロップダウン)', '組織作成ボタン付き'],
    ['combobox role + aria-expanded', '選択中組織に aria-selected="true"', 'キーボードナビゲーション対応'],
    'shadcn/ui Command + Popover / Headless UI Combobox'
  ),
  OnboardingStepper: _ec('OnboardingStepper',
    ['steps: Step[]', 'current: number', 'onComplete: () => void', 'onStepClick?: (n) => void'],
    ['水平ステッパー (デスクトップ)', '垂直ステッパー (モバイル)', '進捗バー付き'],
    ['aria-current="step" for active', 'completed steps aria-label="{step} 完了"', 'progress bar aria-valuenow'],
    'shadcn/ui Steps (custom) / Vuetify v-stepper / Angular Material stepper'
  ),
  AuditTimeline: _ec('AuditTimeline',
    ['events: AuditEvent[]', 'filter?: { action, user, dateRange }', 'maxItems?: number'],
    ['コンパクト (アイコン+サマリー)', '詳細 (フルメタデータ表示)', 'フィルタパネル付き'],
    ['role="feed" aria-label="監査ログ"', '各エントリ role="article"', 'time datetime="{ISO}"'],
    'カスタムコンポーネント (shadcn/ui Card) / Vuetify v-timeline'
  ),
  InviteManager: _ec('InviteManager',
    ['invites: OrgInvite[]', 'onCreate: (email, role) => void', 'onRevoke: (id) => void', 'onResend: (id) => void'],
    ['招待一覧テーブル (保留中/期限切れ)', '招待作成フォーム (メール+ロール選択)', '一括招待 (CSVインポート)'],
    ['フォーム label 対応', '削除確認 AlertDialog', 'aria-live="polite" (招待送信完了)'],
    'shadcn/ui Table + Dialog + Form / React Hook Form + Zod validation'
  )
};

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================

function gen73(G, domain, orgModel, isMultiTenant, a, pn) {
  var d = G ? '# エンタープライズアーキテクチャ — ' + pn + '\n\n' :
              '# Enterprise Architecture — ' + pn + '\n\n';
  d += G ? '> マルチテナント設計・組織データモデル・権限マトリクス・RLSポリシーテンプレート。\n\n' :
           '> Multi-tenant design, organization data model, permission matrix, RLS policy templates.\n\n';

  // Architecture pattern selection — map chip values to pattern keys
  var selKey = 'rls';
  if (/ワークスペース|workspace/i.test(orgModel)) selKey = 'schema';
  else if (/組織.*チーム|org.*team|hierarchy|階層/i.test(orgModel)) selKey = 'hybrid';
  else if (/database.*per|db.*per/i.test(orgModel)) selKey = 'db';
  var pat = ENTERPRISE_ARCH_PATTERNS[selKey];

  d += G ? '## 🏗️ テナント分離戦略\n\n' : '## 🏗️ Tenant Isolation Strategy\n\n';
  d += G ? '| パターン | テナント分離 | RBACモデル | スケーリング |\n|---------|------------|------------|------------|\n' :
           '| Pattern | Tenant Isolation | RBAC Model | Scaling |\n|---------|-----------------|------------|----------|\n';
  Object.entries(ENTERPRISE_ARCH_PATTERNS).forEach(function(entry) {
    var k = entry[0]; var p = entry[1];
    var sel = (k === selKey);
    d += '| ' + (sel ? '**✅ ' : '') + p.pattern + (sel ? ' (' + (G ? '選択中' : 'selected') + ')**' : '') + ' | ' + p.tenantIsolation.substring(0, 40) + '... | ' + p.rbacModel + ' | ' + p.scalingStrategy.substring(0, 45) + '... |\n';
  });
  d += '\n';

  d += G ? '### 採用パターン詳細: ' + pat.pattern + '\n\n' : '### Selected Pattern Detail: ' + pat.pattern + '\n\n';
  d += G ? '- **テナント分離**: ' + pat.tenantIsolation + '\n' : '- **Tenant Isolation**: ' + pat.tenantIsolation + '\n';
  d += G ? '- **RBACモデル**: ' + pat.rbacModel + '\n' : '- **RBAC Model**: ' + pat.rbacModel + '\n';
  d += G ? '- **スケーリング**: ' + pat.scalingStrategy + '\n\n' : '- **Scaling**: ' + pat.scalingStrategy + '\n\n';

  // Organization ER Diagram
  d += G ? '## 📊 組織データモデル (ER図)\n\n' : '## 📊 Organization Data Model (ER Diagram)\n\n';
  d += '```mermaid\nerDiagram\n';
  d += '  User {\n    uuid id PK\n    varchar email UK\n    varchar role\n  }\n';
  d += '  Organization {\n    uuid id PK\n    varchar slug UK\n    varchar plan\n    varchar status\n  }\n';
  d += '  OrgMember {\n    uuid org_id FK\n    uuid user_id FK\n    varchar role\n    timestamp joined_at\n  }\n';
  d += '  OrgInvite {\n    uuid id PK\n    uuid org_id FK\n    varchar email\n    varchar role\n    uuid token UK\n    timestamp expires_at\n  }\n';
  if (domain === 'saas' || domain === 'collab' || domain === 'tool') {
    d += '  Workspace {\n    uuid id PK\n    uuid org_id FK\n    varchar slug\n    varchar plan\n  }\n';
    d += '  Organization ||--o{ Workspace : "has"\n';
  }
  d += '  Organization ||--o{ OrgMember : "has"\n';
  d += '  Organization ||--o{ OrgInvite : "sends"\n';
  d += '  User ||--o{ OrgMember : "belongs to"\n';
  d += '```\n\n';

  // Permission Matrix
  d += G ? '## 🔐 権限マトリクス\n\n' : '## 🔐 Permission Matrix\n\n';
  d += G ? '| リソース | Owner | Admin | Member | Viewer |\n|--------|-------|-------|--------|--------|\n' :
           '| Resource | Owner | Admin | Member | Viewer |\n|---------|-------|-------|--------|--------|\n';
  var resources = G ? [
    ['組織設定', '✅ CRUD', '✅ 読込・更新', '❌', '❌'],
    ['メンバー管理', '✅ CRUD', '✅ 招待・削除', '👁️ 一覧表示', '❌'],
    ['招待管理', '✅ CRUD', '✅ 招待・取消', '❌', '❌'],
    ['プロジェクト', '✅ CRUD', '✅ CRUD', '✅ 作成・更新', '👁️ 読込のみ'],
    ['請求・課金', '✅ CRUD', '👁️ 読込のみ', '❌', '❌'],
    ['監査ログ', '✅ 読込', '✅ 読込', '❌', '❌']
  ] : [
    ['Org Settings', '✅ CRUD', '✅ Read/Update', '❌', '❌'],
    ['Member Mgmt', '✅ CRUD', '✅ Invite/Remove', '👁️ List only', '❌'],
    ['Invite Mgmt', '✅ CRUD', '✅ Invite/Revoke', '❌', '❌'],
    ['Projects', '✅ CRUD', '✅ CRUD', '✅ Create/Update', '👁️ Read only'],
    ['Billing', '✅ CRUD', '👁️ Read only', '❌', '❌'],
    ['Audit Log', '✅ Read', '✅ Read', '❌', '❌']
  ];
  resources.forEach(function(r) {
    d += '| ' + r.join(' | ') + ' |\n';
  });
  d += '\n';

  // RLS Policy Templates
  d += G ? '## 🛡️ RLSポリシーテンプレート\n\n' : '## 🛡️ RLS Policy Templates\n\n';
  d += G ? '### 組織スコープ分離 (全テーブル共通)\n\n' : '### Org-scoped isolation (shared across tables)\n\n';
  d += '```sql\n';
  d += '-- ' + (G ? '組織メンバーのみ読込可能' : 'Only org members can read') + '\n';
  d += 'CREATE POLICY "org_isolation" ON resources\n';
  d += '  FOR SELECT USING (\n';
  d += '    org_id IN (\n';
  d += '      SELECT org_id FROM org_members\n';
  d += '      WHERE user_id = auth.uid()\n';
  d += '    )\n';
  d += '  );\n\n';
  d += '-- ' + (G ? 'Admin以上のみ書込可能' : 'Admin or above can write') + '\n';
  d += 'CREATE POLICY "admin_write" ON org_settings\n';
  d += '  FOR ALL USING (\n';
  d += '    org_id IN (\n';
  d += '      SELECT org_id FROM org_members\n';
  d += '      WHERE user_id = auth.uid()\n';
  d += '      AND role IN (\'owner\', \'admin\')\n';
  d += '    )\n';
  d += '  );\n\n';
  d += '-- ' + (G ? 'Ownerのみ組織削除可能' : 'Only owner can delete org') + '\n';
  d += 'CREATE POLICY "owner_only_delete" ON organizations\n';
  d += '  FOR DELETE USING (\n';
  d += '    id IN (\n';
  d += '      SELECT org_id FROM org_members\n';
  d += '      WHERE user_id = auth.uid()\n';
  d += '      AND role = \'owner\'\n';
  d += '    )\n';
  d += '  );\n```\n\n';

  // Invite Flow Sequence
  d += G ? '## 📧 招待フロー シーケンス図\n\n' : '## 📧 Invite Flow Sequence Diagram\n\n';
  d += '```mermaid\nsequenceDiagram\n';
  d += '  participant A as Admin\n';
  d += '  participant S as Server\n';
  d += '  participant E as Email\n';
  d += '  participant U as ' + (G ? '招待ユーザー' : 'Invited User') + '\n';
  d += '  A->>S: POST /invites {email, role}\n';
  d += '  S->>S: ' + (G ? 'OrgInvite 作成 (token=UUID, expires=+7d)' : 'Create OrgInvite (token=UUID, expires=+7d)') + '\n';
  d += '  S->>E: ' + (G ? '招待メール送信 (/invite?token=UUID)' : 'Send invite email (/invite?token=UUID)') + '\n';
  d += '  U->>S: GET /invite?token=UUID\n';
  d += '  S->>S: ' + (G ? 'token検証・期限チェック' : 'Validate token & expiry') + '\n';
  d += '  U->>S: POST /invite/accept {token}\n';
  d += '  S->>S: ' + (G ? 'OrgMember作成 / redeemed_at=NOW()' : 'Create OrgMember / set redeemed_at=NOW()') + '\n';
  d += '  S->>U: ' + (G ? '組織ダッシュボードへリダイレクト' : 'Redirect to org dashboard') + '\n';
  d += '```\n\n';

  // Scaling decision tree
  d += G ? '## 📈 スケーリング判断基準\n\n' : '## 📈 Scaling Decision Tree\n\n';
  d += '```mermaid\ngraph TD\n';
  d += '  S{' + (G ? '規制要件は?' : 'Regulatory req?') + '} -->|' + (G ? '金融/医療' : 'Fintech/Health') + '| DB[' + (G ? 'DB-per-tenant' : 'DB-per-tenant') + ']\n';
  d += '  S -->|' + (G ? 'なし' : 'None') + '| T{' + (G ? 'テナント数?' : 'Tenant count?') + '}\n';
  d += '  T -->|< 100| R[RLS]\n';
  d += '  T -->|100-1000| H[' + (G ? 'Hybrid (RLS+FF)' : 'Hybrid (RLS+FF)') + ']\n';
  d += '  T -->|> 1000| SC[' + (G ? 'Schema-per-tenant' : 'Schema-per-tenant') + ']\n';
  d += '  style R fill:#22c55e,color:#fff\n';
  d += '  style H fill:#f59e0b,color:#fff\n';
  d += '  style SC fill:#3b82f6,color:#fff\n';
  d += '  style DB fill:#ef4444,color:#fff\n';
  d += '```\n';

  // Domain-specific enterprise hardening from DOMAIN_OPS
  var _g73ops = typeof DOMAIN_OPS !== 'undefined' ? (DOMAIN_OPS[domain] || null) : null;
  if(_g73ops && _g73ops.hardening_ja && _g73ops.hardening_ja.length > 0) {
    d += '\n## ' + (G ? 'ドメイン固有エンタープライズ要件 (' + domain + ')' : 'Domain-Specific Enterprise Requirements (' + domain + ')') + '\n\n';
    var _g73h = G ? _g73ops.hardening_ja : _g73ops.hardening_en;
    _g73h.forEach(function(h){ d += '- ✅ ' + h + '\n'; });
    if(_g73ops.backup_ja && _g73ops.backup_ja.length > 0) {
      d += '\n### ' + (G ? 'エンタープライズ BCP 要件' : 'Enterprise BCP Requirements') + '\n\n';
      var _g73b = G ? _g73ops.backup_ja : _g73ops.backup_en;
      _g73b.forEach(function(b){ d += '- 🔒 ' + b + '\n'; });
    }
    d += '\n';
  }

  return d;
}

function gen74(G, domain, orgModel, isMultiTenant, a, pn) {
  var d = G ? '# ワークフローエンジン設計 — ' + pn + '\n\n' :
              '# Workflow Engine Design — ' + pn + '\n\n';
  d += G ? '> ビジネスプロセスのステートマシン定義・承認チェーン・SLAトラッキング。\n\n' :
           '> Business process state machines, approval chains, SLA tracking.\n\n';

  // Select relevant workflows by domain
  var selectedWorkflows = [];
  if (/saas|collab|tool|automation|hr/i.test(domain)) selectedWorkflows.push('approval');
  if (/saas|tool|automation|ai/i.test(domain)) selectedWorkflows.push('ticket');
  if (/ec|marketplace|logistics/i.test(domain)) selectedWorkflows.push('order');
  if (/legal|fintech|insurance/i.test(domain)) selectedWorkflows.push('contract');
  if (/saas|hr|collab/i.test(domain)) selectedWorkflows.push('onboarding');
  if (selectedWorkflows.length === 0) selectedWorkflows = ['approval', 'onboarding'];

  // State machine diagrams
  d += G ? '## 🔄 ステートマシン定義\n\n' : '## 🔄 State Machine Definitions\n\n';
  selectedWorkflows.forEach(function(wfKey) {
    var wf = WORKFLOW_TEMPLATES[wfKey];
    d += '### ' + (G ? wf.name_ja : wf.name) + '\n\n';
    d += '```mermaid\nstateDiagram-v2\n';
    d += '  [*] --> ' + wf.states[0] + '\n';
    wf.transitions.forEach(function(t) {
      d += '  ' + t[0] + ' --> ' + t[1] + ' : ' + t[2] + '\n';
    });
    d += '  ' + wf.states[wf.states.length - 1] + ' --> [*]\n';
    d += '```\n\n';

    // Roles per workflow
    d += G ? '**ロール別操作権限:**\n\n' : '**Role-based operations:**\n\n';
    wf.roles.forEach(function(r) { d += '- ' + r + '\n'; });
    d += '\n';

    // SLA
    d += G ? '**SLA / エスカレーション:** ' + wf.sla_ja + '\n\n' :
             '**SLA / Escalation:** ' + wf.sla_en + '\n\n';
    d += '---\n\n';
  });

  // Approval chain patterns
  d += G ? '## 🔗 承認チェーンパターン\n\n' : '## 🔗 Approval Chain Patterns\n\n';
  d += G ? '| パターン | 説明 | 適用シーン |\n|---------|------|----------|\n' :
           '| Pattern | Description | Use Case |\n|---------|-------------|----------|\n';
  var chains = G ? [
    ['単一承認', '1人の承認者が承認/却下', '小規模チーム・軽微な変更'],
    ['順次承認 (Sequential)', 'A→B→C の順で全員の承認が必要', '予算申請・契約締結'],
    ['並列承認 (Parallel)', 'A・B・C 全員が同時並行で承認', '複数部署承認が必要な案件'],
    ['委任承認 (Delegation)', '上位承認者が代理承認者を指定可能', '長期不在・権限委任'],
    ['閾値承認 (Threshold)', 'N人中M人以上が承認で通過', '過半数決議・委員会承認']
  ] : [
    ['Single approval', 'One approver approves/rejects', 'Small team, minor changes'],
    ['Sequential', 'A→B→C all must approve in order', 'Budget requests, contracts'],
    ['Parallel', 'A, B, C all approve simultaneously', 'Multi-department approvals'],
    ['Delegation', 'Senior approver can designate proxy', 'Long absence, delegated authority'],
    ['Threshold', 'M of N approvers must approve', 'Majority vote, committee decisions']
  ];
  chains.forEach(function(c) { d += '| ' + c.join(' | ') + ' |\n'; });
  d += '\n';

  // SLA tracking
  d += G ? '## ⏱️ SLAトラッキング実装\n\n' : '## ⏱️ SLA Tracking Implementation\n\n';
  d += '```typescript\n';
  d += '// SLA ' + (G ? '期限管理' : 'deadline management') + '\n';
  d += 'interface SLAConfig {\n  workflowType: string;\n  slaHours: number;\n  escalationHours: number;\n  escalateTo: string; // role\n}\n\n';
  d += '// Cron job: ' + (G ? '期限チェック（15分ごと）' : 'deadline check (every 15 min)') + '\n';
  d += 'async function checkSLABreaches() {\n';
  d += '  const overdue = await db.query(`\n';
  d += '    SELECT * FROM approval_requests\n';
  d += '    WHERE status = \'pending\'\n';
  d += '    AND created_at < NOW() - INTERVAL \'1 hour\' * sla_hours\n';
  d += '    AND escalated_at IS NULL\n';
  d += '  `);\n';
  d += '  for (const req of overdue) {\n';
  d += '    await notifyEscalation(req);\n';
  d += '    await markEscalated(req.id);\n';
  d += '  }\n';
  d += '}\n```\n\n';

  // Domain-specific workflow customization
  d += G ? '## 🎯 ' + domain + 'ドメイン固有のワークフロー最適化\n\n' :
           '## 🎯 ' + domain + ' Domain Workflow Customization\n\n';
  var customizations = {
    fintech: G ? ['送金承認ワークフロー (金額閾値)', 'コンプライアンスレビュー', 'KYC/AML承認プロセス'] :
                 ['Transfer approval (amount threshold)', 'Compliance review', 'KYC/AML approval process'],
    legal: G ? ['契約書レビューチェーン', 'eSign統合 (DocuSign)', '条項交渉ステップ'] :
               ['Contract review chain', 'eSign integration (DocuSign)', 'Clause negotiation steps'],
    ec: G ? ['返金承認フロー', '大口注文承認', '在庫アラート承認'] :
            ['Refund approval flow', 'Large order approval', 'Inventory alert approval'],
    collab: G ? ['コンテンツ公開承認', 'メンバー招待承認', 'ワークスペース作成申請'] :
                ['Content publish approval', 'Member invite approval', 'Workspace creation request'],
    health: G ? ['診断・処方承認ワークフロー', 'PHIアクセス監査証跡', '緊急連絡プロトコル'] :
                ['Diagnosis/prescription approval', 'PHI access audit trail', 'Emergency contact protocol'],
    saas: G ? ['プラン変更承認 (大口)', 'テナント削除確認フロー', 'API制限引き上げ申請'] :
              ['Plan change approval (enterprise)', 'Tenant deletion confirmation', 'API quota raise request'],
    marketplace: G ? ['出品者審査ワークフロー', '紛争エスカレーション', 'GMV上限緩和申請'] :
                     ['Seller verification workflow', 'Dispute escalation', 'GMV limit raise request'],
    insurance: G ? ['クレーム査定承認チェーン', 'アクチュアリーレビュー', '高額支払承認 (閾値超)'] :
                   ['Claim assessment approval chain', 'Actuarial review', 'High-value payment approval (over threshold)'],
    hr: G ? ['採用オファー承認フロー', '給与変更承認チェーン', '退職手続きワークフロー'] :
           ['Offer letter approval flow', 'Salary change approval chain', 'Offboarding workflow'],
    government: G ? ['申請審査・承認ワークフロー', 'アクセシビリティ例外申請', '個人情報開示審査'] :
                    ['Application review & approval workflow', 'Accessibility exception request', 'Personal data disclosure review'],
    booking: G ? ['キャンセルポリシー例外承認', '大口予約確定フロー', 'オーバーブッキング調整'] :
                  ['Cancellation policy exception approval', 'Large booking confirmation flow', 'Overbooking adjustment'],
    analytics: G ? ['ダッシュボード公開承認ワークフロー', 'データアクセス権限申請', 'カスタムレポート公開レビュー'] :
                   ['Dashboard publish approval workflow', 'Data access permission request', 'Custom report publish review'],
    automation: G ? ['ワークフローテンプレート承認フロー', '外部API接続申請', '自動化ルール有効化承認'] :
                    ['Workflow template approval flow', 'External API connection request', 'Automation rule activation approval'],
    logistics: G ? ['配送ルート変更承認', '特急配送エスカレーション', '倉庫キャパシティ超過申請'] :
                   ['Delivery route change approval', 'Express shipping escalation', 'Warehouse capacity overflow request'],
    tool: G ? ['APIキー発行承認ワークフロー', 'レート制限引き上げ申請', 'Webhook エンドポイント登録承認'] :
              ['API key issuance approval workflow', 'Rate limit raise request', 'Webhook endpoint registration approval']
  };
  var domCustom = customizations[domain] || (G ? ['承認ワークフロー', 'オンボーディング自動化', '状態変更通知'] :
                                                  ['Approval workflow', 'Onboarding automation', 'State change notifications']);
  domCustom.forEach(function(c) { d += '- ' + c + '\n'; });
  d += '\n';

  // Notification triggers
  d += G ? '## 🔔 状態変化通知トリガー\n\n' : '## 🔔 State Change Notification Triggers\n\n';
  d += G ? '| 状態変化 | 通知先 | チャネル |\n|---------|-------|--------|\n' :
           '| State change | Notify to | Channel |\n|-------------|-----------|----------|\n';
  var triggers = G ? [
    ['draft → pending', '承認者全員', 'メール + アプリ内通知'],
    ['pending → approved', '申請者 + Slackチャンネル', 'メール + Slack Webhook'],
    ['pending → rejected', '申請者', 'メール + アプリ内通知 (理由付き)'],
    ['SLA超過', '申請者 + 管理者', 'メール + Slack @mention'],
    ['invited → registered', '招待者 + 管理者', 'アプリ内通知']
  ] : [
    ['draft → pending', 'All approvers', 'Email + in-app notification'],
    ['pending → approved', 'Requester + Slack channel', 'Email + Slack Webhook'],
    ['pending → rejected', 'Requester', 'Email + in-app (with reason)'],
    ['SLA breach', 'Requester + Admin', 'Email + Slack @mention'],
    ['invited → registered', 'Inviter + Admin', 'In-app notification']
  ];
  triggers.forEach(function(t) { d += '| ' + t.join(' | ') + ' |\n'; });

  return d;
}

function gen75(G, domain, orgModel, isMultiTenant, a, pn) {
  var d = G ? '# 管理ダッシュボード仕様 — ' + pn + '\n\n' :
              '# Admin Dashboard Specification — ' + pn + '\n\n';
  d += G ? '> KPIカード定義・チャート仕様・ユーザー分析・ロールベースビュー。\n\n' :
           '> KPI card definitions, chart specs, user analytics, role-based views.\n\n';

  // Dashboard layout wireframe
  d += G ? '## 🖥️ 管理画面レイアウト\n\n' : '## 🖥️ Admin Dashboard Layout\n\n';
  d += '```\n';
  d += '┌─────────────────────────────────────────────────────────────┐\n';
  d += '│  ' + (G ? '組織スイッチャー' : 'OrgSwitcher') + '    ' + pn + ' Admin     🔔 ' + (G ? '通知' : 'Notif') + '  👤 ' + (G ? 'プロフィール' : 'Profile') + '  │\n';
  d += '├──────────┬──────────────────────────────────────────────────┤\n';
  d += '│          │  📊 ' + (G ? '概要' : 'Overview') + '                                      │\n';
  d += '│  📊 ' + (G ? '概要' : 'Ovrvw') + '   │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │\n';
  d += '│  👥 ' + (G ? 'ユーザー' : 'Users ') + '  │  │ ' + (G ? '総ユーザー' : 'Total  ') + ' │ │ MRR    │ │ ' + (G ? 'チャーン' : 'Churn ') + ' │ │ ' + (G ? 'アクティブ' : 'Active ') + '│  │\n';
  d += '│  💰 ' + (G ? '課金' : 'Billing') + '  │  │ 12,450 │ │ $48K   │ │ 2.1%  │ │ 87%   │  │\n';
  d += '│  🎫 ' + (G ? 'チケット' : 'Tickets') + '│  └────────┘ └────────┘ └────────┘ └────────┘  │\n';
  d += '│  ⚙️ ' + (G ? '設定' : 'Settings') + '  │  📈 ' + (G ? '週次トレンド (折れ線グラフ)' : 'Weekly Trend (line chart)') + '               │\n';
  d += '│          │  ┌───────────────────────────────────────────┐  │\n';
  d += '│          │  │  [Chart.js / Recharts Line Chart]         │  │\n';
  d += '│          │  └───────────────────────────────────────────┘  │\n';
  d += '│          │  📋 ' + (G ? '最近のアクティビティ' : 'Recent Activity') + '   ⚠️ ' + (G ? 'SLAアラート' : 'SLA Alerts') + '         │\n';
  d += '└──────────┴──────────────────────────────────────────────────┘\n';
  d += '```\n\n';

  // KPI Card definitions
  d += G ? '## 📊 KPIカード定義\n\n' : '## 📊 KPI Card Definitions\n\n';
  Object.entries(ADMIN_DASHBOARD_SPECS).forEach(function(entry) {
    var spec = entry[1];
    d += '### ' + (G ? spec.category_ja : spec.category) + '\n\n';
    d += G ? '| ウィジェット | クエリ/計算式 | 閾値/警告 |\n|------------|-------------|----------|\n' :
             '| Widget | Query / Formula | Threshold / Alert |\n|--------|-----------------|-------------------|\n';
    spec.widgets_ja.forEach(function(w, i) {
      var we = spec.widgets_en[i] || w;
      d += '| ' + (G ? w : we) + ' | ' + (G ? '`SELECT COUNT(*) FROM ...`' : '`SELECT COUNT(*) FROM ...`') + ' | — |\n';
    });
    d += '\n';
  });

  // Weekly trends chart spec
  d += G ? '## 📈 週次トレンドチャート仕様\n\n' : '## 📈 Weekly Trend Chart Specification\n\n';
  d += '```typescript\n';
  d += '// Recharts ' + (G ? 'ライン チャート設定' : 'Line Chart Config') + '\n';
  d += 'const weeklyTrendConfig = {\n';
  d += '  dataKey: \'date\',\n';
  d += '  lines: [\n';
  d += '    { dataKey: \'new_users\', color: \'#4f46e5\', name: \'' + (G ? '新規ユーザー' : 'New Users') + '\' },\n';
  d += '    { dataKey: \'active_users\', color: \'#22c55e\', name: \'' + (G ? 'アクティブユーザー' : 'Active Users') + '\' },\n';
  d += '    { dataKey: \'mrr\', color: \'#f59e0b\', name: \'MRR ($)\' }\n';
  d += '  ],\n';
  d += '  timeRange: \'last_12_weeks\',\n';
  d += '  refreshInterval: 300 // ' + (G ? '5分ごと' : 'every 5 min') + '\n';
  d += '};\n```\n\n';

  // User workload analytics
  d += G ? '## 👥 ユーザー作業量分析\n\n' : '## 👥 User Workload Analytics\n\n';
  d += G ? '| メトリクス | 説明 | アクション |\n|-----------|------|----------|\n' :
           '| Metric | Description | Action |\n|--------|-------------|--------|\n';
  var workload = G ? [
    ['上位承認者', '承認待ち件数が最も多い担当者', '負荷分散・委任推奨'],
    ['ボトルネック特定', '平均待機時間が長いステップ', 'SLA見直し・担当者追加'],
    ['期限超過率', 'SLA違反の割合 (目標<5%)', 'エスカレーション設定見直し'],
    ['非アクティブメンバー', '30日間ログインなし', 'リテンションキャンペーン']
  ] : [
    ['Top approvers', 'Users with most pending approvals', 'Load balance / suggest delegation'],
    ['Bottleneck identification', 'Steps with longest avg wait time', 'Revise SLA / add staff'],
    ['SLA breach rate', 'Ratio of SLA violations (target <5%)', 'Review escalation settings'],
    ['Inactive members', '30d no login', 'Retention campaign']
  ];
  workload.forEach(function(w) { d += '| ' + w.join(' | ') + ' |\n'; });
  d += '\n';

  // Stale item alerts
  d += G ? '## ⚠️ 滞留アイテムアラート\n\n' : '## ⚠️ Stale Item Alerts\n\n';
  var staleItems = G ? [
    '承認待ち 48h超 → 承認者と申請者に自動リマインダー',
    'チケット未対応 24h超 → 管理者にSlack通知',
    '期限切れ招待 → 管理画面でバッジ表示 (自動再送オプション付き)',
    'MRRダウン 10%超 → アラートメール + 原因分析レポート生成'
  ] : [
    'Approval pending > 48h → auto-reminder to approver and requester',
    'Ticket unassigned > 24h → Slack notify to manager',
    'Expired invites → badge in admin panel (with auto-resend option)',
    'MRR drop > 10% → alert email + cause analysis report'
  ];
  staleItems.forEach(function(s) { d += '- ' + s + '\n'; });
  d += '\n';

  // Role-based dashboard views
  d += G ? '## 🔐 ロールベース ダッシュボードビュー\n\n' : '## 🔐 Role-based Dashboard Views\n\n';
  d += G ? '| 表示要素 | Owner | Admin | Manager | Member |\n|---------|-------|-------|---------|--------|\n' :
           '| Element | Owner | Admin | Manager | Member |\n|---------|-------|-------|---------|--------|\n';
  var views = G ? [
    ['課金・MRR', '✅', '👁️ 読込', '❌', '❌'],
    ['ユーザー管理', '✅', '✅', '👁️ 自チームのみ', '❌'],
    ['監査ログ', '✅', '✅', '❌', '❌'],
    ['SLAダッシュボード', '✅', '✅', '✅', '❌'],
    ['自分のチケット', '✅', '✅', '✅', '✅']
  ] : [
    ['Billing / MRR', '✅', '👁️ Read', '❌', '❌'],
    ['User management', '✅', '✅', '👁️ Own team', '❌'],
    ['Audit log', '✅', '✅', '❌', '❌'],
    ['SLA dashboard', '✅', '✅', '✅', '❌'],
    ['Own tickets', '✅', '✅', '✅', '✅']
  ];
  views.forEach(function(v) { d += '| ' + v.join(' | ') + ' |\n'; });

  return d;
}

function gen76(G, domain, orgModel, isMultiTenant, a, pn) {
  var d = G ? '# エンタープライズコンポーネントカタログ — ' + pn + '\n\n' :
              '# Enterprise Component Catalog — ' + pn + '\n\n';
  d += G ? '> 8つのエンタープライズUIコンポーネント仕様。Props・バリアント・A11y・フレームワーク対応。\n\n' :
           '> 8 enterprise UI component specifications. Props, Variants, A11y, Framework mapping.\n\n';

  // Component specs
  d += G ? '## 🧩 コンポーネント仕様\n\n' : '## 🧩 Component Specifications\n\n';
  Object.entries(ENTERPRISE_COMPONENTS).forEach(function(entry) {
    var name = entry[0]; var comp = entry[1];
    d += '### `<' + name + '>`\n\n';
    d += G ? '**Props:**\n\n' : '**Props:**\n\n';
    comp.props_ja.forEach(function(p) { d += '- `' + p + '`\n'; });
    d += '\n';
    d += G ? '**バリアント:**\n\n' : '**Variants:**\n\n';
    comp.variants_ja.forEach(function(v) { d += '- ' + v + '\n'; });
    d += '\n';
    d += G ? '**アクセシビリティ:**\n\n' : '**Accessibility:**\n\n';
    comp.a11y_ja.forEach(function(a) { d += '- ' + a + '\n'; });
    d += '\n';
    d += G ? '**フレームワーク対応:** ' + comp.framework + '\n\n' :
             '**Framework mapping:** ' + comp.framework + '\n\n';
    d += '---\n\n';
  });

  // Composition patterns
  d += G ? '## 🔧 コンポジションパターン\n\n' : '## 🔧 Composition Patterns\n\n';
  d += '```tsx\n';
  d += '// ' + (G ? '承認管理ページの組み合わせ例' : 'Approval management page composition') + '\n';
  d += 'export function ApprovalPage() {\n';
  d += '  return (\n';
  d += '    <OrgSwitcher orgs={orgs} current={current} onChange={switchOrg} />\n';
  d += '    <DataTable\n';
  d += '      data={approvals}\n';
  d += '      columns={approvalColumns}\n';
  d += '      sortable filterable paginated\n';
  d += '      bulkActions={[{ label: \'' + (G ? '一括承認' : 'Bulk Approve') + '\', action: bulkApprove }]}\n';
  d += '    />\n';
  d += '    <ApprovalBar\n';
  d += '      request={selected}\n';
  d += '      onApprove={approve}\n';
  d += '      onReject={reject}\n';
  d += '      currentUserRole={userRole}\n';
  d += '    />\n';
  d += '    <NotificationBell count={unread} items={notifications} onRead={markRead} />\n';
  d += '  );\n';
  d += '}\n```\n\n';

  // MVP → Pro → Enterprise roadmap
  d += G ? '## 🗺️ MVP → Pro → Enterprise コンポーネントロードマップ\n\n' :
           '## 🗺️ MVP → Pro → Enterprise Component Roadmap\n\n';
  d += G ? '| コンポーネント | MVP | Pro | Enterprise |\n|-------------|-----|-----|------------|\n' :
           '| Component | MVP | Pro | Enterprise |\n|-----------|-----|-----|------------|\n';
  var roadmap = [
    ['DataTable', G ? '基本テーブル' : 'Basic table', G ? 'ソート+フィルタ' : 'Sort + filter', G ? 'バーチャルスクロール+一括操作' : 'Virtual scroll + bulk ops'],
    ['StatusBadge', G ? '色+テキスト' : 'Color + text', G ? '全ステータス+アイコン' : 'All statuses + icon', G ? 'カスタムステータス+API連携' : 'Custom statuses + API'],
    ['ApprovalBar', G ? 'シンプル承認' : 'Simple approve', G ? '理由入力+通知' : 'Reason + notify', G ? 'マルチ承認+委任' : 'Multi-approver + delegation'],
    ['OrgSwitcher', G ? 'なし' : 'N/A', G ? '組織切替' : 'Org switch', G ? '組織作成+招待' : 'Create org + invite'],
    ['AuditTimeline', G ? 'なし' : 'N/A', G ? '基本ログ' : 'Basic log', G ? 'フィルタ+エクスポート' : 'Filter + export'],
    ['InviteManager', G ? 'メール招待のみ' : 'Email invite only', G ? 'ロール選択' : 'Role selection', G ? 'CSV一括招待+SSO' : 'CSV bulk invite + SSO']
  ];
  roadmap.forEach(function(r) { d += '| ' + r.join(' | ') + ' |\n'; });
  d += '\n';

  // Real-time update patterns
  d += G ? '## ⚡ リアルタイム更新パターン\n\n' : '## ⚡ Real-time Update Patterns\n\n';
  d += '```typescript\n';
  d += '// Supabase Realtime ' + (G ? '統合例 (NotificationBell)' : 'integration (NotificationBell)') + '\n';
  d += 'useEffect(() => {\n';
  d += '  const sub = supabase\n';
  d += '    .channel(\'notifications\')\n';
  d += '    .on(\'postgres_changes\', {\n';
  d += '      event: \'INSERT\',\n';
  d += '      schema: \'public\',\n';
  d += '      table: \'notifications\',\n';
  d += '      filter: \'user_id=eq.\' + userId\n';
  d += '    }, (payload) => {\n';
  d += '      setNotifications(prev => [payload.new, ...prev]);\n';
  d += '    })\n';
  d += '    .subscribe();\n';
  d += '  return () => supabase.removeChannel(sub);\n';
  d += '}, [userId]);\n```\n\n';

  // Dark/Light mode adaptation
  d += G ? '## 🎨 ダーク/ライトモード対応\n\n' : '## 🎨 Dark / Light Mode Adaptation\n\n';
  d += '```css\n';
  d += '/* ' + (G ? 'ステータスバッジ カラーシステム' : 'Status badge color system') + ' */\n';
  d += ':root {\n';
  d += '  --status-pending: hsl(45 90% 50%);\n  --status-approved: hsl(142 70% 45%);\n';
  d += '  --status-rejected: hsl(0 72% 51%);\n  --status-active: hsl(221 83% 53%);\n';
  d += '}\n[data-theme="dark"] {\n';
  d += '  --status-pending: hsl(45 80% 60%);\n  --status-approved: hsl(142 60% 55%);\n';
  d += '  --status-rejected: hsl(0 65% 62%);\n  --status-active: hsl(221 75% 65%);\n}\n```\n';

  // H7: FAQ / Knowledge Base component (SaaS-like domains)
  d += G ? '## 📚 FAQ / ナレッジベース システム\n\n' : '## 📚 FAQ / Knowledge Base System\n\n';
  d += G ? '### 記事構造\n\n' : '### Article Structure\n\n';
  d += '```\n';
  d += (G ? 'カテゴリ (階層型)' : 'Categories (hierarchical)') + '\n';
  d += '  └── ' + (G ? '記事 (Markdown)' : 'Articles (Markdown)') + '\n';
  d += '       ├── ' + (G ? 'タイトル・スラッグ・タグ' : 'title, slug, tags') + '\n';
  d += '       ├── ' + (G ? '公開/非公開フラグ' : 'published/draft flag') + '\n';
  d += '       └── ' + (G ? 'バージョン履歴 (Git ベース)' : 'version history (Git-based)') + '\n```\n\n';
  d += G ? '### 機能要件\n\n' : '### Feature Requirements\n\n';
  d += '- ' + (G ? '全文検索 + タグフィルタリング (Algolia / PostgreSQL FTS)' : 'Full-text search + tag filtering (Algolia / PostgreSQL FTS)') + '\n';
  d += '- ' + (G ? '記事フィードバックウィジェット (役に立ちましたか？ Yes/No)' : 'Article feedback widget (Was this helpful? Yes/No)') + '\n';
  d += '- ' + (G ? 'RAG 統合: ナレッジベースを AI チャットの文脈ソースとして利用' : 'RAG integration: Use KB as context source for AI chat') + '\n';
  d += '- ' + (G ? '関連記事サジェスト (コサイン類似度)' : 'Related article suggestions (cosine similarity)') + '\n\n';

  return d;
}

function genPillar19_EnterpriseSaaS(a, pn) {
  var G = S.genLang === 'ja';
  var domain = detectDomain(a.purpose || '') || 'saas';
  var orgModel = a.org_model || '';
  var mvpFeatures = a.mvp_features || '';
  var isMultiTenant = /マルチ|multi|RLS|組織|org/i.test(orgModel) ||
                      /マルチテナント|Multi-tenant|RBAC/i.test(mvpFeatures);

  // Only generate for relevant domains
  var relevantDomain = /saas|analytics|hr|collab|tool|automation|fintech|legal|ec|marketplace|logistics|insurance/i.test(domain);
  if (!relevantDomain && !isMultiTenant) return;

  S.files['docs/73_enterprise_architecture.md'] = gen73(G, domain, orgModel, isMultiTenant, a, pn);
  S.files['docs/74_workflow_engine.md'] = gen74(G, domain, orgModel, isMultiTenant, a, pn);
  S.files['docs/75_admin_dashboard_spec.md'] = gen75(G, domain, orgModel, isMultiTenant, a, pn);
  S.files['docs/76_enterprise_components.md'] = gen76(G, domain, orgModel, isMultiTenant, a, pn);
}
