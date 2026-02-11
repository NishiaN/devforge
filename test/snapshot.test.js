// Snapshot test — structural regression detection for generated output
// Verifies file counts, section existence, token ranges, and key content markers
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {answers:{},skill:'intermediate',lang:'ja',preset:'custom',projectName:'T',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'ja',previewFile:null,pillar:0};
const save=()=>{};const _lsGet=()=>null;const _lsSet=()=>{};const _lsRm=()=>{};const sanitize=v=>v;

eval(fs.readFileSync('src/data/questions.js','utf-8'));
eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/data/compat-rules.js','utf-8'));
eval(fs.readFileSync('src/generators/common.js','utf-8'));
eval(fs.readFileSync('src/generators/p1-sdd.js','utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js','utf-8'));
eval(fs.readFileSync('src/generators/docs.js','utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js','utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js','utf-8').replace('const GT','var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js','utf-8'));
eval(fs.readFileSync('src/generators/p9-designsystem.js','utf-8'));

// ═══ Helper ═══
function generate(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate';
  S.answers = answers;
  genPillar1_SDD(answers, name);
  genPillar2_DevContainer(answers, name);
  genCommonFiles(answers, name);
  genDocs21(answers, name);
  genPillar3_MCP(answers, name);
  genPillar4_AIRules(answers, name);
  genPillar7_Roadmap(answers, name);
  genPillar9_DesignSystem(answers, name);
  return { ...S.files };
}

function tokens(text) { return Math.round((text || '').length / 3.5); }

// ═══ Scenario A: LMS (Supabase + Stripe + Admin) ═══
describe('Snapshot A: LMS/Supabase/Stripe', () => {
  const files = generate({
    purpose: 'SaaS型学習管理システム', target: '学生, 講師, 管理者',
    frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    deploy: 'Vercel', auth: 'Supabase Auth, Google OAuth', payment: 'Stripe',
    mvp_features: 'ユーザー認証, コース管理, 進捗管理, サブスクリプション, 管理ダッシュボード',
    screens: 'ランディング, ダッシュボード, コース詳細, 設定, 管理画面, 決済ページ',
    data_entities: 'User, Course, Lesson, Progress, Enrollment',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma', scope_out: 'ネイティブアプリ',
    ai_auto: 'マルチAgent協調'
  }, 'LMS');

  test('file count in range 60-76', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 60 && count <= 76, `Expected 60-76 files, got ${count}`);
  });

  test('total tokens in range 12000-18000', () => {
    const total = Object.values(files).reduce((s, v) => s + tokens(v), 0);
    assert.ok(total >= 12000 && total <= 18000, `Expected 12K-18K tokens, got ${total}`);
  });

  // Core files existence
  test('all .spec/ files exist', () => {
    ['constitution.md','specification.md','technical-plan.md','tasks.md','verification.md'].forEach(f => {
      assert.ok(files['.spec/' + f], `.spec/${f} missing`);
    });
  });

  test('AI_BRIEF.md exists and < 1400 tokens', () => {
    assert.ok(files['AI_BRIEF.md'], 'AI_BRIEF.md missing');
    const t = tokens(files['AI_BRIEF.md']);
    assert.ok(t < 1400, `AI_BRIEF.md too large: ${t} tokens`);
  });

  test('progress tracker and error logs exist', () => {
    assert.ok(files['docs/24_progress.md'], 'docs/24_progress.md missing');
    assert.ok(files['docs/25_error_logs.md'], 'docs/25_error_logs.md missing');
  });

  test('CI/CD workflow exists', () => {
    assert.ok(files['.github/workflows/ci.yml'], 'ci.yml missing');
  });

  // ── Content markers (regression detection) ──
  test('specification has acceptance criteria', () => {
    const spec = files['.spec/specification.md'];
    assert.ok(spec.includes('受入条件'), 'Missing 受入条件');
    assert.ok((spec.match(/- \[ \]/g) || []).length >= 15, 'Expected 15+ acceptance criteria checkboxes');
  });

  test('tech-plan has DB schema with columns', () => {
    const tp = files['.spec/technical-plan.md'];
    // Each entity should have domain-specific columns
    assert.ok(tp.includes('instructor_id'), 'Course missing instructor_id');
    assert.ok(tp.includes('lesson_id'), 'Progress missing lesson_id');
    assert.ok(tp.includes('enrolled_at'), 'Enrollment missing enrolled_at');
  });

  test('tech-plan has Stripe design section', () => {
    const tp = files['.spec/technical-plan.md'];
    assert.ok(tp.includes('invoice.paid'), 'Missing Stripe webhook flow');
    assert.ok(tp.includes('stripe_subscription_id'), 'Missing subscription table');
  });

  test('tech-plan has per-table RLS policies', () => {
    const tp = files['.spec/technical-plan.md'];
    assert.ok((tp.match(/CREATE POLICY/g) || []).length >= 8, 'Expected 8+ RLS policies');
  });

  test('ER diagram has rich entity columns', () => {
    const er = files['docs/04_er_diagram.md'];
    assert.ok(er.includes('instructor_id'), 'ER missing Course.instructor_id');
    assert.ok(er.includes('score'), 'ER missing Progress.score');
    assert.ok(er.includes('enrolled_at'), 'ER missing Enrollment.enrolled_at');
  });

  test('API uses entity-specific columns', () => {
    const api = files['docs/05_api_design.md'];
    assert.ok(!api.includes("insert({ name })"), 'API still using generic { name }');
    assert.ok(!api.includes("'progresss'"), 'Table pluralization bug: progresss');
    assert.ok(api.includes("'progress'"), 'Progress table missing');
    assert.ok(api.includes("'enrollments'"), 'Enrollments table missing');
  });

  test('screen design has intelligent flow', () => {
    const sd = files['docs/06_screen_design.md'];
    assert.ok(sd.includes('管理者のみ') || sd.includes('admin only'), 'Missing admin-only flow marker');
    const compCount = sd.split('\n').filter(l => l.includes('  - ') && !l.includes('URL')).length;
    assert.ok(compCount >= 15, `Expected 15+ component items, got ${compCount}`);
  });

  test('security has RBAC and Stripe sections', () => {
    const sec = files['docs/08_security.md'];
    assert.ok(sec.includes('RBAC'), 'Missing RBAC section');
    assert.ok(sec.includes('Stripe') || sec.includes('決済'), 'Missing payment security');
  });

  test('test cases are feature-specific', () => {
    const tc = files['docs/07_test_cases.md'];
    // Should NOT have 6 identical generic tests for all features
    assert.ok(tc.includes('Webhook') || tc.includes('webhook'), 'Missing Stripe-specific test case');
    assert.ok(tc.includes('draft') || tc.includes('published'), 'Missing course status test');
    assert.ok(tc.includes('進捗') || tc.includes('progress'), 'Missing progress-specific test');
  });

  test('AI_BRIEF.md content completeness', () => {
    const brief = files['AI_BRIEF.md'];
    assert.ok(brief.includes('DB Schema'), 'Missing DB Schema section');
    assert.ok(brief.includes('RLS Policies'), 'Missing RLS section');
    assert.ok(brief.includes('Payment (Stripe)'), 'Missing Stripe section');
    assert.ok(brief.includes('RBAC'), 'Missing RBAC section');
    assert.ok(brief.includes('instructor_id'), 'Missing domain-specific columns');
    assert.ok(brief.includes('Supabase Auth'), 'Missing auth info');
  });

  test('CLAUDE.md has workflow cycle and context management', () => {
    const claude = files['CLAUDE.md'];
    assert.ok(claude.includes('Workflow Cycle'), 'Missing Workflow Cycle section');
    assert.ok(claude.includes('Context Management'), 'Missing Context Management section');
    assert.ok(claude.includes('docs/24_progress.md'), 'Missing progress.md reference');
    assert.ok(claude.includes('docs/25_error_logs.md'), 'Missing error_logs.md reference');
  });

  test('AI_BRIEF.md has context protocol', () => {
    const brief = files['AI_BRIEF.md'];
    assert.ok(brief.includes('Context Protocol'), 'Missing Context Protocol section');
    assert.ok(brief.includes('docs/24_progress.md'), 'Missing progress.md reference');
    assert.ok(brief.includes('docs/25_error_logs.md'), 'Missing error_logs.md reference');
  });

  test('progress tracker has sprints and features', () => {
    const progress = files['docs/24_progress.md'];
    assert.ok(progress.includes('Sprint 0'), 'Missing Sprint 0');
    assert.ok(progress.includes('Sprint 1-2'), 'Missing Sprint 1-2');
    assert.ok(progress.includes('Sprint 3'), 'Missing Sprint 3');
    assert.ok(progress.includes('ユーザー認証') || progress.includes('コース管理'), 'Missing features');
    assert.ok((progress.match(/- \[ \]/g) || []).length >= 10, 'Expected 10+ task checkboxes');
  });

  test('error logs has format and example', () => {
    const errors = files['docs/25_error_logs.md'];
    assert.ok(errors.includes('RLS') || errors.includes('API'), 'Missing example error type');
    assert.ok(errors.includes('症状') || errors.includes('Symptom'), 'Missing symptom field');
    assert.ok(errors.includes('原因') || errors.includes('Cause'), 'Missing cause field');
    assert.ok(errors.includes('解決策') || errors.includes('Fix'), 'Missing fix field');
    assert.ok(errors.includes('防止策') || errors.includes('Prevention'), 'Missing prevention field');
  });

  test('design system has tokens and components', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds, 'docs/26_design_system.md missing');
    assert.ok(ds.includes('デザイントークン') || ds.includes('Design Tokens'), 'Missing Design Tokens section');
    assert.ok(ds.includes('カラーパレット') || ds.includes('Color Palette'), 'Missing Color Palette');
    assert.ok(ds.includes('Tailwind') || ds.includes('shadcn'), 'Missing framework-specific guidance');
    assert.ok(ds.includes('AI実装ガイドライン') || ds.includes('AI Implementation Guidelines'), 'Missing AI guidelines');
  });

  test('sequence diagrams has auth and CRUD flows', () => {
    const seq = files['docs/27_sequence_diagrams.md'];
    assert.ok(seq, 'docs/27_sequence_diagrams.md missing');
    assert.ok(seq.includes('sequenceDiagram'), 'Missing mermaid sequence diagrams');
    assert.ok(seq.includes('認証フロー') || seq.includes('Authentication Flow'), 'Missing auth flow');
    assert.ok(seq.includes('Supabase Auth') || seq.includes('signIn'), 'Missing Supabase auth details');
    assert.ok(seq.includes('Stripe') || seq.includes('checkout'), 'Missing Stripe payment flow');
  });

  test('skills catalog exists with domain skills', () => {
    assert.ok(files['skills/catalog.md'], 'skills/catalog.md missing');
    const cat = files['skills/catalog.md'];
    assert.match(cat, /Factory Template|工場テンプレート/);
    assert.match(cat, /Purpose|目的/);
  });

  test('skills catalog has detailed skills with Input/Process/Output', () => {
    const cat = files['skills/catalog.md'];
    assert.match(cat, /Input|入力/, 'Missing Input field in skills');
    assert.match(cat, /Process|処理/, 'Missing Process field in skills');
    assert.match(cat, /Output|出力/, 'Missing Output field in skills');
    // Check for at least one detailed skill example
    const detailedSkillPattern = /教材設計|機能仕様|API設計|Curriculum|Feature Spec|API Design/;
    assert.match(cat, detailedSkillPattern, 'Missing detailed skill examples');
  });

  test('pipelines has Mermaid flowcharts', () => {
    assert.ok(files['skills/pipelines.md'], 'skills/pipelines.md missing');
    const pipe = files['skills/pipelines.md'];
    assert.match(pipe, /graph LR|graph TD/);
    assert.match(pipe, /Trigger|トリガー/);
  });
});

// ═══ Scenario B: Blog (Vite + Netlify, no Stripe, no Admin) ═══
describe('Snapshot B: Blog/Vite/Netlify', () => {
  const files = generate({
    purpose: 'ブログプラットフォーム', target: 'ブロガー',
    frontend: 'React + Vite', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    deploy: 'Netlify', auth: 'Supabase Auth',
    mvp_features: '記事投稿, カテゴリ管理',
    screens: 'ランディング, ダッシュボード, 記事詳細, 設定',
    data_entities: 'User, Post, Category, Tag, Comment',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: ''
  }, 'Blog');

  test('file count in range 57-76', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 57 && count <= 76, `Expected 57-76 files, got ${count}`);
  });

  test('no Stripe content when payment absent', () => {
    const tp = files['.spec/technical-plan.md'];
    assert.ok(!tp.includes('Stripe'), 'Unexpected Stripe in tech-plan');
    const brief = files['AI_BRIEF.md'];
    assert.ok(!brief.includes('Payment (Stripe)'), 'Unexpected Stripe in AI_BRIEF');
    const seq = files['docs/27_sequence_diagrams.md'];
    assert.ok(!seq.includes('Stripe'), 'Unexpected Stripe in sequence diagrams');
  });

  test('no RBAC when no admin target', () => {
    const sec = files['docs/08_security.md'];
    assert.ok(!sec.includes('RBAC'), 'Unexpected RBAC in security');
    const brief = files['AI_BRIEF.md'];
    assert.ok(!brief.includes('RBAC'), 'Unexpected RBAC in AI_BRIEF');
  });

  test('content-domain entities have correct columns', () => {
    const er = files['docs/04_er_diagram.md'];
    assert.ok(er.includes('slug'), 'Post/Category missing slug');
    assert.ok(er.includes('published_at'), 'Post missing published_at');
  });

  test('API has correct table names', () => {
    const api = files['docs/05_api_design.md'];
    assert.ok(api.includes("'posts'"), 'Missing posts table');
    assert.ok(api.includes("'categories'"), 'Missing categories table');
    assert.ok(api.includes("'tags'"), 'Missing tags table');
    assert.ok(api.includes("'comments'"), 'Missing comments table');
  });

  test('deploy checklist matches Netlify', () => {
    const rl = files['docs/09_release_checklist.md'];
    assert.ok(rl.includes('Netlify'), 'Release checklist not adapted to Netlify');
  });

  test('no skills catalog/pipelines when ai_auto absent', () => {
    assert.ok(!files['skills/catalog.md'], 'skills/catalog.md should not exist without ai_auto');
    assert.ok(!files['skills/pipelines.md'], 'skills/pipelines.md should not exist without ai_auto');
  });
});

// ═══ Scenario C: EC (Express + Railway, non-BaaS) ═══
describe('Snapshot C: EC/Express/Railway', () => {
  const files = generate({
    purpose: 'ECサイト', target: '一般消費者',
    frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
    deploy: 'Railway', auth: 'NextAuth, Google OAuth', payment: 'Stripe',
    mvp_features: '商品管理, カート・決済, 注文管理',
    screens: 'トップ, 商品一覧, 商品詳細, カート, 決済, 注文履歴',
    data_entities: 'User, Product, Category, Order, Cart, Payment',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma'
  }, 'EC-Shop');

  test('uses REST API pattern (not Supabase SDK)', () => {
    const api = files['docs/05_api_design.md'];
    assert.ok(api.includes('/api/v1/'), 'Missing REST endpoints');
    assert.ok(!api.includes('supabase.from'), 'Unexpected Supabase SDK');
  });

  test('API response includes entity-specific fields', () => {
    const api = files['docs/05_api_design.md'];
    assert.ok(api.includes('price') || api.includes('stock'), 'Product API missing domain fields');
  });

  test('no RLS policies (non-BaaS)', () => {
    const tp = files['.spec/technical-plan.md'];
    assert.ok(!tp.includes('CREATE POLICY'), 'Unexpected RLS in non-BaaS project');
  });

  test('deploy checklist matches Railway', () => {
    const rl = files['docs/09_release_checklist.md'];
    assert.ok(rl.includes('Railway'), 'Release checklist not adapted to Railway');
  });

  test('AI_BRIEF has correct auth (NextAuth)', () => {
    const brief = files['AI_BRIEF.md'];
    assert.ok(brief.includes('Auth.js') || brief.includes('NextAuth'), 'Missing NextAuth in AI_BRIEF');
  });
});

// ═══ Scenario D: English output ═══
describe('Snapshot D: English Output', () => {
  const files = generate({
    purpose: 'Task management SaaS', target: 'Teams, Freelancers',
    frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    deploy: 'Vercel', auth: 'Supabase Auth',
    mvp_features: 'Auth, Task Management, Dashboard',
    screens: 'Landing, Dashboard, Settings',
    data_entities: 'User, Workspace, Project, Task',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: ''
  }, 'TaskFlow', 'en');

  test('English output has no Japanese in spec', () => {
    const spec = files['.spec/specification.md'];
    // Check for absence of common Japanese characters in key structural parts
    const headerLines = spec.split('\n').filter(l => l.startsWith('#'));
    const hasJP = headerLines.some(l => /[ぁ-んァ-ヶ一-龥]/.test(l));
    assert.ok(!hasJP, 'Japanese characters found in English spec headers');
  });

  test('English AI_BRIEF is coherent', () => {
    const brief = files['AI_BRIEF.md'];
    assert.ok(brief.includes('Start coding'), 'Missing English intro');
    assert.ok(brief.includes('DB Schema'), 'Missing DB Schema');
    assert.ok(brief.includes('Workspace'), 'Missing entity in brief');
  });
});
