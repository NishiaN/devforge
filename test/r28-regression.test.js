// Round 28 regression tests — G1-G4 improvements
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {answers:{},skill:'intermediate',lang:'ja',preset:'custom',projectName:'T',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'ja',previewFile:null,pillar:0};
const save=()=>{};const _lsGet=()=>null;const _lsSet=()=>{};const _lsRm=()=>{};const sanitize=v=>v;
eval(fs.readFileSync('src/data/questions.js','utf-8'));
eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/data/compat-rules.js','utf-8'));
eval(fs.readFileSync('src/generators/common.js','utf-8').replace(/const /g,'var '));
eval(fs.readFileSync('src/generators/p1-sdd.js','utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js','utf-8'));
eval(fs.readFileSync('src/generators/p10-reverse.js','utf-8').replace('const REVERSE_FLOW_MAP','var REVERSE_FLOW_MAP'));
eval(fs.readFileSync('src/generators/docs.js','utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js','utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js','utf-8').replace('const GT','var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js','utf-8'));

function gen(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate'; S.answers = answers;
  genPillar1_SDD(answers, name);
  genPillar2_DevContainer(answers, name);
  genCommonFiles(answers, name);
  genDocs21(answers, name);
  genPillar3_MCP(answers, name);
  genPillar4_AIRules(answers, name);
  genPillar7_Roadmap(answers, name);
  return { ...S.files };
}

// EC project with Payment, Cart, User (REST API pattern)
const ec = gen({
  purpose: 'ECサイト', target: '一般消費者, ショップオーナー',
  frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
  deploy: 'Railway', auth: 'NextAuth, Google OAuth', payment: 'Stripe',
  mvp_features: 'ユーザー認証, 商品管理, カート・決済, 注文管理, レビュー機能',
  screens: 'トップ, 商品一覧, 商品詳細, カート, 決済, 注文履歴',
  data_entities: 'User, Product, Category, Order, Cart, Payment',
  dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma'
}, 'EC-Shop');

// LMS project (Supabase, for verification check)
const lms = gen({
  purpose: 'SaaS型学習管理システム', target: '学生, 講師, 管理者',
  frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  deploy: 'Vercel', auth: 'Supabase Auth', payment: 'Stripe',
  mvp_features: 'ユーザー認証, コース管理, 進捗管理, サブスクリプション',
  screens: 'ランディング, ダッシュボード, コース詳細, 設定, 管理画面, 決済ページ',
  data_entities: 'User, Course, Lesson, Progress, Enrollment',
  dev_methods: 'TDD', ai_tools: 'Cursor'
}, 'LMS');

// Blog (no scope_out, no Stripe)
const blog = gen({
  purpose: 'ブログプラットフォーム', target: 'ブロガー',
  frontend: 'React + Vite', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  deploy: 'Netlify', auth: 'Supabase Auth',
  mvp_features: '記事投稿, カテゴリ管理, コメント機能',
  screens: 'ランディング, ダッシュボード, 記事詳細, 設定',
  data_entities: 'User, Post, Category, Tag, Comment',
  dev_methods: 'TDD', ai_tools: 'Cursor'
}, 'Blog');

// ═══ G1: REST API entity-specific methods ═══
describe('G1: REST API method control', () => {
  const api = ec['docs/05_api_design.md'];

  test('Payment: no DELETE or PUT (immutable records)', () => {
    assert.ok(!api.includes('DELETE /api/v1/payment'), 'Payment should not have DELETE');
    assert.ok(!api.includes('PUT /api/v1/payment'), 'Payment should not have PUT');
  });

  test('Payment: has GET and POST only', () => {
    assert.ok(api.includes('GET /api/v1/payment'), 'Payment should have GET');
    assert.ok(api.includes('POST /api/v1/payment'), 'Payment should have POST');
  });

  test('User: PATCH instead of PUT', () => {
    assert.ok(!api.includes('PUT /api/v1/user'), 'User should not have PUT');
    assert.ok(api.includes('PATCH /api/v1/user'), 'User should have PATCH');
  });

  test('User: no DELETE', () => {
    assert.ok(!api.includes('DELETE /api/v1/user'), 'User should not have DELETE');
  });

  test('Cart: has PATCH (not PUT)', () => {
    assert.ok(!api.includes('PUT /api/v1/cart'), 'Cart should not have PUT');
    assert.ok(api.includes('PATCH /api/v1/cart'), 'Cart should have PATCH');
  });

  test('Product: has full CRUD (standard entity)', () => {
    assert.ok(api.includes('GET /api/v1/product'), 'Product GET');
    assert.ok(api.includes('POST /api/v1/product'), 'Product POST');
    assert.ok(api.includes('PUT /api/v1/product'), 'Product PUT');
    assert.ok(api.includes('DELETE /api/v1/product'), 'Product DELETE');
  });

  test('Method count varies by entity', () => {
    // Payment should have fewer methods than Product
    const payMethods = (api.match(/####.*\/api\/v1\/payment/g) || []).length;
    const prodMethods = (api.match(/####.*\/api\/v1\/product/g) || []).length;
    assert.ok(payMethods < prodMethods,
      `Payment (${payMethods}) should have fewer methods than Product (${prodMethods})`);
  });
});

// ═══ G2: docs/23_tasks.md AC linked to FEATURE_DETAILS ═══
describe('G2: Task AC specificity', () => {
  const tasks23 = ec['docs/23_tasks.md'];

  test('Feature tasks have domain-specific AC (not generic 3-line)', () => {
    // Check ユーザー認証 issue has auth-specific criteria
    const authIssue = tasks23.split(/## Issue #/g).find(s => s.includes('ユーザー認証'));
    assert.ok(authIssue, 'Auth issue should exist');
    // Should NOT just have generic "実装完了/テスト通過/レビュー完了"
    const hasSpecificAC = authIssue.includes('メール') || authIssue.includes('ログイン') ||
      authIssue.includes('OAuth') || authIssue.includes('email');
    assert.ok(hasSpecificAC, 'Auth AC should have domain-specific criteria');
  });

  test('Setup tasks still have generic AC (expected)', () => {
    const setupIssue = tasks23.split(/## Issue #/g).find(s => s.includes('環境構築'));
    assert.ok(setupIssue, 'Setup issue should exist');
    assert.ok(setupIssue.includes('実装完了'), 'Setup AC should have generic criteria');
  });

  test('Feature AC criteria count > 1 for known features', () => {
    const authIssue = tasks23.split(/## Issue #/g).find(s => s.includes('ユーザー認証'));
    const checkboxes = (authIssue.match(/- \[ \]/g) || []).length;
    assert.ok(checkboxes >= 3, `Auth AC should have 3+ criteria, got ${checkboxes}`);
  });

  test('Not all issues share same AC text', () => {
    const issues = tasks23.split(/## Issue #/g).filter(s => s.length > 10);
    const acs = issues.map(s => {
      const acStart = s.indexOf('Acceptance Criteria');
      return acStart >= 0 ? s.substring(acStart, acStart + 200) : '';
    }).filter(Boolean);
    const unique = new Set(acs);
    assert.ok(unique.size >= 2, `Expected diverse ACs, got ${unique.size} unique patterns`);
  });
});

// ═══ G3: scope_out domain inference ═══
describe('G3: scope_out inference', () => {
  test('Blog (no scope_out input): not （未定義）', () => {
    const con = blog['.spec/constitution.md'];
    assert.ok(!con.includes('（未定義）'), 'scope_out should not be （未定義）');
  });

  test('Blog: has inferred scope items', () => {
    const con = blog['.spec/constitution.md'];
    const scopeSection = con.split('スコープ外')[1]?.split('##')[0] || '';
    assert.ok(scopeSection.includes('ネイティブ') || scopeSection.includes('アプリ') ||
      scopeSection.includes('動画'),
      'Blog scope_out should have inferred content-domain items');
  });

  test('EC project with explicit scope_out: preserved', () => {
    const ecExplicit = gen({
      purpose: 'ECサイト', target: '消費者',
      frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
      deploy: 'Railway', auth: 'NextAuth', payment: 'Stripe',
      mvp_features: '商品管理', screens: 'トップ',
      data_entities: 'User, Product', dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma',
      scope_out: 'カスタムスコープ外項目'
    }, 'EC2');
    const con = ecExplicit['.spec/constitution.md'];
    assert.ok(con.includes('カスタムスコープ外項目'), 'Explicit scope_out should be preserved');
  });

  test('EC project without scope_out: ec-domain inferred', () => {
    const con = ec['.spec/constitution.md'];
    const scopeSection = con.split('スコープ外')[1]?.split('##')[0] || '';
    assert.ok(scopeSection.includes('ネイティブ') || scopeSection.includes('POS') ||
      scopeSection.includes('物流'),
      'EC scope_out should have ec-domain items');
  });
});

// ═══ G4: verification.md feature-specific checklist ═══
describe('G4: verification.md feature checklist', () => {
  test('LMS verification has section 5', () => {
    const ver = lms['.spec/verification.md'];
    assert.ok(ver.includes('## 5.') || ver.includes('機能別検証'),
      'verification.md should have feature verification section');
  });

  test('LMS verification has feature-specific items', () => {
    const ver = lms['.spec/verification.md'];
    const hasAuth = ver.includes('認証') && ver.includes('- [ ]');
    assert.ok(hasAuth, 'Should have auth-related verification checkboxes');
  });

  test('LMS verification has more items than generic 4', () => {
    const ver = lms['.spec/verification.md'];
    const checkboxes = (ver.match(/- \[ \]/g) || []).length;
    assert.ok(checkboxes >= 10, `Expected 10+ checkboxes, got ${checkboxes}`);
  });

  test('EC verification has different items than LMS', () => {
    const verLMS = lms['.spec/verification.md'];
    const verEC = ec['.spec/verification.md'];
    // EC should mention 商品/カート/注文, LMS should mention コース/進捗
    const lmsHasCourse = verLMS.includes('コース') || verLMS.includes('course');
    const ecHasProduct = verEC.includes('商品') || verEC.includes('product');
    assert.ok(lmsHasCourse || ecHasProduct,
      'Verification should contain domain-specific feature items');
  });
});
