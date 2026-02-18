// test/enterprise.test.js — P19 Enterprise SaaS Blueprint tests

const {test} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read generator module
const p19Code = fs.readFileSync(path.join(__dirname, '../src/generators/p19-enterprise.js'), 'utf8');

// Mock environment
global.S = {genLang: 'ja', files: {}};
global.detectDomain = (purpose) => {
  if (/学習|教育|LMS/.test(purpose)) return 'education';
  if (/EC|ショッピング/.test(purpose)) return 'ec';
  if (/金融|フィンテック/.test(purpose)) return 'fintech';
  if (/医療|ヘルスケア/.test(purpose)) return 'health';
  if (/SaaS/.test(purpose)) return 'saas';
  if (/HR|人事/.test(purpose)) return 'hr';
  if (/analytics|分析/.test(purpose)) return 'analytics';
  if (/collab|コラボ/.test(purpose)) return 'collab';
  if (/portfolio/.test(purpose)) return 'portfolio';
  return 'saas';
};

// Eval generator code
eval(p19Code);

// ============================================================================
// DATA STRUCTURE TESTS
// ============================================================================

test('[P19] ENTERPRISE_ARCH_PATTERNS: has 4 patterns', () => {
  assert.ok(typeof ENTERPRISE_ARCH_PATTERNS === 'object', 'is an object');
  const keys = Object.keys(ENTERPRISE_ARCH_PATTERNS);
  assert.strictEqual(keys.length, 4, 'has exactly 4 patterns');
  assert.ok('rls' in ENTERPRISE_ARCH_PATTERNS, 'has rls pattern');
  assert.ok('schema' in ENTERPRISE_ARCH_PATTERNS, 'has schema pattern');
  assert.ok('db' in ENTERPRISE_ARCH_PATTERNS, 'has db pattern');
  assert.ok('hybrid' in ENTERPRISE_ARCH_PATTERNS, 'has hybrid pattern');
});

test('[P19] ENTERPRISE_ARCH_PATTERNS: each has required properties', () => {
  const requiredProps = ['pattern', 'tenantIsolation', 'rbacModel', 'scalingStrategy', 'rlsExample'];
  Object.entries(ENTERPRISE_ARCH_PATTERNS).forEach(([key, val]) => {
    requiredProps.forEach(prop => {
      assert.ok(val[prop] !== undefined && val[prop].length > 0, `${key}.${prop} is non-empty`);
    });
  });
});

test('[P19] WORKFLOW_TEMPLATES: has 5 workflows', () => {
  assert.ok(typeof WORKFLOW_TEMPLATES === 'object', 'is an object');
  const keys = Object.keys(WORKFLOW_TEMPLATES);
  assert.strictEqual(keys.length, 5, 'has exactly 5 workflows');
  assert.ok('approval' in WORKFLOW_TEMPLATES, 'has approval');
  assert.ok('ticket' in WORKFLOW_TEMPLATES, 'has ticket');
  assert.ok('order' in WORKFLOW_TEMPLATES, 'has order');
  assert.ok('contract' in WORKFLOW_TEMPLATES, 'has contract');
  assert.ok('onboarding' in WORKFLOW_TEMPLATES, 'has onboarding');
});

test('[P19] WORKFLOW_TEMPLATES: each has states, transitions, roles, bilingual sla', () => {
  Object.entries(WORKFLOW_TEMPLATES).forEach(([key, wf]) => {
    assert.ok(Array.isArray(wf.states) && wf.states.length >= 4, `${key} has >=4 states`);
    assert.ok(Array.isArray(wf.transitions) && wf.transitions.length >= 3, `${key} has >=3 transitions`);
    assert.ok((typeof wf.roles === 'string' || Array.isArray(wf.roles)) && wf.roles.length > 0, `${key} has roles`);
    assert.ok(wf.name_ja && wf.name_ja.length > 0, `${key} has name_ja`);
    assert.ok(wf.name && wf.name.length > 0, `${key} has name`);
    assert.ok(wf.sla_ja && wf.sla_ja.length > 0, `${key} has sla_ja`);
    assert.ok(wf.sla_en && wf.sla_en.length > 0, `${key} has sla_en`);
  });
});

test('[P19] ADMIN_DASHBOARD_SPECS: has 4 categories', () => {
  assert.ok(typeof ADMIN_DASHBOARD_SPECS === 'object', 'is an object');
  const keys = Object.keys(ADMIN_DASHBOARD_SPECS);
  assert.strictEqual(keys.length, 4, 'has exactly 4 categories');
  assert.ok('overview' in ADMIN_DASHBOARD_SPECS, 'has overview');
  assert.ok('users' in ADMIN_DASHBOARD_SPECS, 'has users');
  assert.ok('billing' in ADMIN_DASHBOARD_SPECS, 'has billing');
  assert.ok('ops' in ADMIN_DASHBOARD_SPECS, 'has ops');
});

test('[P19] ADMIN_DASHBOARD_SPECS: each has kpis, bilingual widgets', () => {
  Object.entries(ADMIN_DASHBOARD_SPECS).forEach(([key, spec]) => {
    assert.ok(Array.isArray(spec.kpis) && spec.kpis.length >= 2, `${key} has >=2 kpis`);
    assert.ok(Array.isArray(spec.widgets_ja) && spec.widgets_ja.length >= 3, `${key} has >=3 widgets_ja`);
    assert.ok(Array.isArray(spec.widgets_en) && spec.widgets_en.length >= 3, `${key} has >=3 widgets_en`);
    assert.ok(spec.category && spec.category.length > 0, `${key} has category`);
    assert.ok(spec.category_ja && spec.category_ja.length > 0, `${key} has category_ja`);
  });
});

test('[P19] ENTERPRISE_COMPONENTS: has 8 components', () => {
  assert.ok(typeof ENTERPRISE_COMPONENTS === 'object', 'is an object');
  const keys = Object.keys(ENTERPRISE_COMPONENTS);
  assert.strictEqual(keys.length, 8, 'has exactly 8 components');
  const expected = ['StatusBadge', 'ApprovalBar', 'DataTable', 'NotificationBell', 'OrgSwitcher', 'OnboardingStepper', 'AuditTimeline', 'InviteManager'];
  expected.forEach(name => {
    assert.ok(name in ENTERPRISE_COMPONENTS, `has ${name}`);
  });
});

test('[P19] ENTERPRISE_COMPONENTS: each has name, props_ja, variants_ja, a11y_ja, framework', () => {
  const requiredProps = ['name', 'props_ja', 'variants_ja', 'a11y_ja', 'framework'];
  Object.entries(ENTERPRISE_COMPONENTS).forEach(([key, comp]) => {
    requiredProps.forEach(prop => {
      assert.ok(comp[prop] !== undefined, `${key}.${prop} exists`);
      if (Array.isArray(comp[prop])) {
        assert.ok(comp[prop].length > 0, `${key}.${prop} is non-empty`);
      } else {
        assert.ok(comp[prop].length > 0, `${key}.${prop} is non-empty string`);
      }
    });
  });
});

// ============================================================================
// GENERATOR OUTPUT TESTS
// ============================================================================

test('[P19] gen73: enterprise architecture doc (JA) contains org ER diagram', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'マルチテナントSaaS', org_model: 'マルチテナント(RLS)'};
  const doc = gen73(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('RLS') || doc.includes('Row-Level'), 'contains RLS reference');
  assert.ok(doc.includes('Organization') || doc.includes('組織'), 'contains org entity');
  assert.ok(doc.includes('OrgMember') || doc.includes('org_member'), 'contains OrgMember');
  assert.ok(doc.includes('mermaid') || doc.includes('erDiagram') || doc.includes('graph'), 'contains diagram');
  assert.ok(doc.includes('権限') || doc.includes('パーミッション') || doc.includes('RBAC') || doc.includes('Owner'), 'contains permission/RBAC reference');
});

test('[P19] gen73: enterprise architecture doc (EN) contains permission matrix', () => {
  global.S = {genLang: 'en', files: {}};
  const a = {purpose: 'Multi-tenant SaaS', org_model: 'Multi-tenant (RLS)'};
  const doc = gen73(false, 'saas', 'Multi-tenant (RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('Organization') || doc.includes('org'), 'contains organization reference');
  assert.ok(doc.includes('Permission') || doc.includes('RBAC') || doc.includes('Owner'), 'contains permission/RBAC');
  assert.ok(doc.includes('RLS') || doc.includes('Row-Level Security'), 'contains RLS');
  assert.ok(typeof doc === 'string' && doc.length > 200, 'doc is non-empty');
});

test('[P19] gen74: workflow engine doc contains state machine diagrams', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'SaaS承認システム', org_model: 'マルチテナント(RLS)'};
  const doc = gen74(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('stateDiagram') || doc.includes('mermaid'), 'contains state diagram');
  assert.ok(doc.includes('approval') || doc.includes('承認'), 'contains approval workflow');
  assert.ok(doc.includes('SLA') || doc.includes('sla'), 'contains SLA');
  assert.ok(typeof doc === 'string' && doc.length > 200, 'doc is non-empty');
});

test('[P19] gen75: admin dashboard doc contains KPI cards and workload', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'SaaS管理システム', org_model: 'マルチテナント(RLS)'};
  const doc = gen75(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('KPI') || doc.includes('kpi') || doc.includes('ダッシュボード'), 'contains KPI/dashboard');
  assert.ok(doc.includes('MRR') || doc.includes('ARR') || doc.includes('チャーン') || doc.includes('churn'), 'contains business metrics');
  assert.ok(typeof doc === 'string' && doc.length > 200, 'doc is non-empty');
});

test('[P19] gen76: enterprise components doc contains component specs', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'SaaS UIシステム', org_model: 'マルチテナント(RLS)'};
  const doc = gen76(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('StatusBadge') || doc.includes('ステータス'), 'contains StatusBadge or ステータス');
  assert.ok(doc.includes('ApprovalBar') || doc.includes('承認'), 'contains ApprovalBar or 承認');
  assert.ok(doc.includes('DataTable') || doc.includes('テーブル'), 'contains DataTable');
  assert.ok(doc.includes('a11y') || doc.includes('aria') || doc.includes('アクセシビリティ'), 'contains a11y reference');
  assert.ok(typeof doc === 'string' && doc.length > 200, 'doc is non-empty');
});

// ============================================================================
// INTEGRATION TESTS
// ============================================================================

test('[P19] genPillar19: generates 4 files for SaaS multi-tenant', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'マルチテナントSaaS管理ツール', org_model: 'マルチテナント(RLS)'};
  genPillar19_EnterpriseSaaS(a, 'TestSaaS');
  assert.ok('docs/73_enterprise_architecture.md' in S.files, 'generates doc 73');
  assert.ok('docs/74_workflow_engine.md' in S.files, 'generates doc 74');
  assert.ok('docs/75_admin_dashboard_spec.md' in S.files, 'generates doc 75');
  assert.ok('docs/76_enterprise_components.md' in S.files, 'generates doc 76');
});

test('[P19] genPillar19: EN output for analytics domain', () => {
  global.S = {genLang: 'en', files: {}};
  const a = {purpose: 'Analytics SaaS platform for enterprise', org_model: 'Multi-tenant (RLS)'};
  genPillar19_EnterpriseSaaS(a, 'AnalyticsPro');
  assert.ok('docs/73_enterprise_architecture.md' in S.files, 'generates doc 73');
  const doc73 = S.files['docs/73_enterprise_architecture.md'];
  assert.ok(typeof doc73 === 'string' && doc73.length > 100, 'doc 73 has content');
  assert.ok(doc73.includes('Organization') || doc73.includes('RLS'), 'doc 73 has enterprise content');
});

test('[P19] genPillar19: skips irrelevant domains (portfolio)', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'portfolio website for designer', org_model: ''};
  genPillar19_EnterpriseSaaS(a, 'PortfolioSite');
  assert.ok(!('docs/73_enterprise_architecture.md' in S.files), 'skips for portfolio domain');
});

test('[P19] genPillar19: mvp_features multi-tenant triggers generation', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'ツール', org_model: '', mvp_features: 'マルチテナント対応'};
  genPillar19_EnterpriseSaaS(a, 'MultiTool');
  // purpose=tool domain is relevant, so files should be generated
  assert.ok('docs/73_enterprise_architecture.md' in S.files, 'generates for tool domain');
});

test('[P19] gen73: bilingual output works (JA vs EN)', () => {
  const a = {purpose: 'SaaS', org_model: 'マルチテナント(RLS)'};
  const docJa = gen73(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  const docEn = gen73(false, 'saas', 'Multi-tenant (RLS)', true, a, 'TestApp');
  assert.ok(typeof docJa === 'string' && docJa.length > 100, 'JA doc is non-empty');
  assert.ok(typeof docEn === 'string' && docEn.length > 100, 'EN doc is non-empty');
  // JA and EN docs should differ
  assert.notStrictEqual(docJa, docEn, 'JA and EN docs differ');
});

test('[P19] no template literal contamination in data strings', () => {
  const allDataStrings = [
    ...Object.values(ENTERPRISE_ARCH_PATTERNS).map(p => JSON.stringify(p)),
    ...Object.values(WORKFLOW_TEMPLATES).map(w => JSON.stringify(w)),
    ...Object.values(ADMIN_DASHBOARD_SPECS).map(a => JSON.stringify(a)),
    ...Object.values(ENTERPRISE_COMPONENTS).map(c => JSON.stringify(c))
  ].join(' ');
  // Should not contain unevaluated ${...} patterns
  assert.ok(!/\$\{[^}]+\}/.test(allDataStrings), 'no unevaluated template literals in data');
});

test('[P19] gen74: mermaid stateDiagram present in output', () => {
  global.S = {genLang: 'ja', files: {}};
  const a = {purpose: 'SaaS承認ワークフロー', org_model: 'マルチテナント(RLS)'};
  const doc = gen74(true, 'saas', 'マルチテナント(RLS)', true, a, 'TestApp');
  assert.ok(doc.includes('stateDiagram') || doc.includes('mermaid'), 'has mermaid state diagram');
});
