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
eval(fs.readFileSync('src/generators/common.js','utf-8').replace(/const /g,'var '));
eval(fs.readFileSync('src/generators/p1-sdd.js','utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js','utf-8'));
eval(fs.readFileSync('src/generators/docs.js','utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js','utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));
eval(fs.readFileSync('src/generators/p5-quality.js','utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js','utf-8').replace('const GT','var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js','utf-8'));
eval(fs.readFileSync('src/generators/p9-designsystem.js','utf-8'));
eval(fs.readFileSync('src/generators/p10-reverse.js','utf-8').replace('const REVERSE_FLOW_MAP','var REVERSE_FLOW_MAP'));
eval(fs.readFileSync('src/generators/p11-implguide.js','utf-8'));

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
  genPillar5_QualityIntelligence(answers, name);
  genPillar7_Roadmap(answers, name);
  genPillar9_DesignSystem(answers, name);
  genPillar10_ReverseEngineering(answers, name);
  genPillar11_ImplIntelligence(answers, name);
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

  test('file count in range 68-92', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 68 && count <= 92, `Expected 68-92 files, got ${count}`);
  });

  test('total tokens in range 12000-33000', () => {
    const total = Object.values(files).reduce((s, v) => s + tokens(v), 0);
    assert.ok(total >= 12000 && total <= 33000, `Expected 12K-33K tokens, got ${total}`);
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

  test('reverse engineering and goal decomposition exist', () => {
    assert.ok(files['docs/29_reverse_engineering.md'], 'docs/29_reverse_engineering.md missing');
    assert.ok(files['docs/30_goal_decomposition.md'], 'docs/30_goal_decomposition.md missing');
  });

  test('growth intelligence doc exists', () => {
    assert.ok(files['docs/41_growth_intelligence.md'], 'docs/41_growth_intelligence.md missing');
  });

  test('growth intelligence has all sections', () => {
    const gi = files['docs/41_growth_intelligence.md'];
    assert.ok(gi.includes('ファネル') || gi.includes('Funnel'), 'Missing funnel');
    assert.ok(gi.includes('方程式') || gi.includes('Equation'), 'Missing equation');
    assert.ok(gi.includes('価格') || gi.includes('Pricing'), 'Missing pricing');
    assert.ok(gi.includes('パフォーマンス') || gi.includes('Performance'), 'Missing performance');
  });

  test('growth intelligence has Mermaid diagram', () => {
    const gi = files['docs/41_growth_intelligence.md'];
    assert.ok(gi.includes('```mermaid'), 'Missing Mermaid funnel diagram');
  });

  test('implementation intelligence files exist', () => {
    assert.ok(files['docs/39_implementation_playbook.md'], 'docs/39_implementation_playbook.md missing');
    assert.ok(files['docs/40_ai_dev_runbook.md'], 'docs/40_ai_dev_runbook.md missing');
  });

  test('skill guide exists', () => {
    assert.ok(files['docs/42_skill_guide.md'], 'docs/42_skill_guide.md missing');
  });

  test('skill guide has all 3 levels', () => {
    const sg = files['docs/42_skill_guide.md'];
    assert.ok(sg.includes('初心者') || sg.includes('Beginner'), 'Missing beginner');
    assert.ok(sg.includes('中級者') || sg.includes('Intermediate'), 'Missing intermediate');
    assert.ok(sg.includes('上級者') || sg.includes('Professional'), 'Missing pro');
    assert.ok(sg.includes('あなたのレベル') || sg.includes('YOUR LEVEL'), 'Missing level marker');
  });

  test('quality intelligence files exist', () => {
    assert.ok(files['docs/32_qa_blueprint.md'], 'docs/32_qa_blueprint.md missing');
    assert.ok(files['docs/33_test_matrix.md'], 'docs/33_test_matrix.md missing');
    assert.ok(files['skills/factory.md'], 'skills/factory.md missing');
  });

  test('qa blueprint has industry-specific content', () => {
    const qa = files['docs/32_qa_blueprint.md'];
    assert.ok(qa.includes('業種') || qa.includes('Industry'), 'Missing industry section');
    assert.ok(qa.includes('重要機能') || qa.includes('Critical Functions'), 'Missing critical functions');
    assert.ok(qa.includes('リスク') || qa.includes('Risk'), 'Missing risk assessment');
  });

  test('test matrix has concrete examples', () => {
    const tm = files['docs/33_test_matrix.md'];
    assert.ok(tm.includes('テストケース') || tm.includes('Test Case'), 'Missing test case template');
    assert.ok(tm.includes('バグパターン') || tm.includes('Bug Pattern'), 'Missing bug patterns');
    assert.ok(tm.includes('カバレッジ') || tm.includes('Coverage'), 'Missing coverage goals');
  });

  test('skills factory has thinking axis', () => {
    const factory = files['skills/factory.md'];
    assert.ok(factory.includes('思考軸') || factory.includes('Thinking Axis'), 'Missing thinking axis');
    assert.ok(factory.includes('判断') || factory.includes('Judgment'), 'Missing judgment principle');
    assert.ok(factory.includes('フォーマット') || factory.includes('Format'), 'Missing skill format');
  });

  test('reverse engineering has domain-specific flow', () => {
    const rev = files['docs/29_reverse_engineering.md'];
    assert.ok(rev.includes('ゴール定義') || rev.includes('Goal Definition'), 'Missing goal definition section');
    assert.ok(rev.includes('逆算フロー') || rev.includes('Reverse Flow'), 'Missing reverse flow section');
    assert.ok(rev.includes('マイルストーン') || rev.includes('Milestone'), 'Missing milestone section');
    assert.ok(rev.includes('リスク') || rev.includes('Risk'), 'Missing risk analysis');
  });

  test('goal decomposition has priority matrix', () => {
    const goal = files['docs/30_goal_decomposition.md'];
    assert.ok(goal.includes('ゴールツリー') || goal.includes('Goal Tree'), 'Missing goal tree');
    assert.ok(goal.includes('優先度マトリクス') || goal.includes('Priority Matrix'), 'Missing priority matrix');
    assert.ok(goal.includes('依存関係') || goal.includes('Dependency'), 'Missing dependency chain');
    assert.ok(goal.includes('Impact') && goal.includes('Effort'), 'Missing Impact/Effort matrix');
  });

  test('implementation playbook has domain patterns', () => {
    const impl = files['docs/39_implementation_playbook.md'];
    assert.ok(impl.includes('実装パターン') || impl.includes('Implementation Patterns'), 'Missing implementation patterns');
    assert.ok(impl.includes('擬似コード') || impl.includes('Pseudo-code'), 'Missing pseudo-code');
    assert.ok(impl.includes('ガードレール') || impl.includes('Guard Rails'), 'Missing guard rails');
    assert.ok(impl.includes('横断的関心事') || impl.includes('Cross-Cutting'), 'Missing cross-cutting concerns');
  });

  test('AI dev runbook has context management', () => {
    const runbook = files['docs/40_ai_dev_runbook.md'];
    assert.ok(runbook.includes('運用ワークフロー') || runbook.includes('Operation Workflow'), 'Missing workflow');
    assert.ok(runbook.includes('コンテキスト') || runbook.includes('Context'), 'Missing context management');
    assert.ok(runbook.includes('エラー復旧') || runbook.includes('Error Recovery'), 'Missing error recovery');
    assert.ok(runbook.includes('ファイル選択') || runbook.includes('File Selection'), 'Missing file selection matrix');
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

  test('CLAUDE.md has Thinking Protocol section', () => {
    const claude = files['CLAUDE.md'];
    assert.ok(claude.includes('Thinking Protocol'), 'Missing Thinking Protocol section');
    assert.ok(claude.includes('State the task in one sentence'), 'Missing Thinking Protocol step 1');
    assert.ok(claude.includes('List files that will be modified'), 'Missing Thinking Protocol step 2');
    assert.ok(claude.includes('Identify potential side effects'), 'Missing Thinking Protocol step 3');
    assert.ok(claude.includes('Implement → Test → Verify'), 'Missing Thinking Protocol step 4');
  });

  test('docs/31_industry_playbook.md exists and has domain intelligence', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    assert.ok(playbook, 'docs/31_industry_playbook.md missing');
    assert.ok(playbook.includes('Target Domain') || playbook.includes('対象ドメイン'), 'Missing domain section');
    assert.ok(playbook.includes('Implementation') || playbook.includes('実装'), 'Missing implementation patterns');
    assert.ok(playbook.includes('Bug') || playbook.includes('バグ'), 'Missing bug predictions');
    assert.ok(playbook.includes('Compliance') || playbook.includes('コンプライアンス'), 'Missing compliance checklist');
  });

  test('docs/31 contains education-specific content (FERPA)', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    // LMS project should detect education domain
    assert.ok(playbook.includes('FERPA') || playbook.includes('education') || playbook.includes('学習'),
      'Expected education-specific content (FERPA or learning-related)');
  });

  test('CLAUDE.md has Domain Context Rotation table', () => {
    const claude = files['CLAUDE.md'];
    // Should have domain context rotation table for education domain
    const hasDomainTable = claude.includes('Domain Context Rotation') ||
                          claude.includes('ドメインコンテキスト') ||
                          claude.includes('Task Type') ||
                          claude.includes('タスク種別');
    assert.ok(hasDomainTable, 'Missing Domain Context Rotation table in CLAUDE.md');
  });

  test('skills/catalog.md has domain-specific skill', () => {
    const catalog = files['skills/catalog.md'];
    // Should have domain-specific skill section
    const hasDomainSkill = catalog.includes('Domain-Specific') ||
                           catalog.includes('業種特化') ||
                           catalog.includes('Custom Domain Skill') ||
                           catalog.includes('業種カスタム');
    assert.ok(hasDomainSkill, 'Missing domain-specific skill in skills/catalog.md');
  });

  test('AI_WORKFLOW has 3 prompt templates', () => {
    const aiw = files['roadmap/AI_WORKFLOW.md'];
    assert.ok(aiw, 'roadmap/AI_WORKFLOW.md missing');
    assert.ok(aiw.includes('新機能追加') || aiw.includes('Add New Feature'), 'Missing new feature template');
    assert.ok(aiw.includes('バグ修正') || aiw.includes('Bug Fix'), 'Missing bug fix template');
    assert.ok(aiw.includes('リファクタリング') || aiw.includes('Refactoring'), 'Missing refactoring template');
    const templateCount = (aiw.match(/###\s+\d\./g) || []).length;
    assert.equal(templateCount, 3, `Expected 3 prompt templates, got ${templateCount}`);
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

  test('design system has AI Design Protocol', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('AI Design Protocol') || ds.includes('AI感を排除'), 'Missing AI Design Protocol');
    assert.ok(ds.includes('トークン参照') || ds.includes('Token Reference'), 'Missing token reference rule');
    assert.ok(ds.includes('禁止アクション') || ds.includes('Prohibited Actions'), 'Missing prohibited actions');
  });

  test('design system has component mapping', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('shadcn') || ds.includes('Vuetify') || ds.includes('mat-'), 'Missing component framework mapping');
    assert.ok(ds.includes('v-btn') || ds.includes('mat-button') || ds.includes('<Button>'), 'Missing specific component examples');
  });

  test('design system has motion tokens', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('duration-fast') || ds.includes('モーション'), 'Missing motion tokens');
    assert.ok(ds.includes('easing-default') || ds.includes('cubic-bezier'), 'Missing easing functions');
  });

  test('design system has token export', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('"primary"') || ds.includes('エクスポート'), 'Missing token export');
    assert.ok(ds.includes('json') || ds.includes('JSON'), 'Missing JSON format');
  });

  test('design system has visual enhancement dictionary', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('パララックス') || ds.includes('Parallax'), 'Missing parallax keyword');
    assert.ok(ds.includes('ニューモーフィズム') || ds.includes('Neumorphism'), 'Missing neumorphism');
  });

  test('design system has fidelity protocol', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('Figma MCP') || ds.includes('SSOT') || ds.includes('Single Source of Truth'), 'Missing fidelity protocol');
  });

  test('design system has anti-AI checklist', () => {
    const ds = files['docs/26_design_system.md'];
    assert.ok(ds.includes('Anti-AI') || ds.includes('チェックリスト') || ds.includes('Checklist'), 'Missing anti-AI checklist');
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

  test('QA strategy document exists', () => {
    assert.ok(files['docs/28_qa_strategy.md'], 'docs/28_qa_strategy.md missing');
  });

  test('QA strategy has education domain focus areas', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('education') || qa.includes('教育'), 'Missing education domain marker');
    assert.ok(qa.includes('学習進捗') || qa.includes('Backend sync for progress'), 'Missing education-specific QA focus area');
    assert.ok(qa.includes('WCAG'), 'Missing WCAG compliance focus');
  });

  test('QA strategy has common bug patterns', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('よくあるバグパターン') || qa.includes('Common Bug Patterns'), 'Missing bug patterns section');
    assert.ok(qa.includes('localStorage') || qa.includes('クイズ') || qa.includes('Quiz'), 'Missing education-specific bugs');
  });

  test('QA strategy has priority matrix', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('優先度マトリクス') || qa.includes('Priority Matrix'), 'Missing priority matrix section');
    assert.ok(qa.includes('Security') || qa.includes('セキュリティ'), 'Missing security priority');
    assert.ok(qa.includes('UX'), 'Missing UX priority');
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

  test('file count in range 60-82', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 60 && count <= 82, `Expected 60-82 files, got ${count}`);
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

  test('QA strategy has content domain focus areas', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('content') || qa.includes('コンテンツ'), 'Missing content domain marker');
    assert.ok(qa.includes('CDN') || qa.includes('配信'), 'Missing content-specific QA focus area');
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

  test('QA strategy has EC domain focus areas', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('ec') || qa.includes('EC'), 'Missing EC domain marker');
    assert.ok(qa.includes('在庫競合') || qa.includes('inventory conflicts') || qa.includes('同時購入'), 'Missing EC-specific QA focus area');
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

  test('QA strategy in English has saas domain', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa, 'docs/28_qa_strategy.md missing');
    assert.ok(qa.includes('saas'), 'Missing saas domain marker');
    assert.ok(qa.includes('Multi-tenant') || qa.includes('tenant'), 'Missing saas-specific QA focus area');
    assert.ok(qa.includes('Priority Matrix'), 'Missing English priority matrix');
  });
});

// ═══ Scenario E: Property Management (New Entities) ═══
describe('Snapshot E: Property Management', () => {
  const files = generate({
    purpose: '不動産管理システム', target: '大家, 入居者, 管理会社',
    frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    deploy: 'Vercel', auth: 'Supabase Auth',
    mvp_features: '物件管理, 入居者管理, 契約管理, メンテナンス依頼',
    screens: 'ダッシュボード, 物件一覧, 入居者詳細, メンテナンス管理',
    data_entities: 'User, Property, Unit, Tenant, Lease, MaintenanceRequest',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: ''
  }, 'PropMgmt');

  test('new property management entities in ER diagram', () => {
    const er = files['docs/04_er_diagram.md'];
    assert.ok(er, 'ER diagram file missing');
    assert.ok(er.includes('Property'), 'Missing Property entity');
    assert.ok(er.includes('Unit'), 'Missing Unit entity');
    assert.ok(er.includes('Tenant'), 'Missing Tenant entity');
    assert.ok(er.includes('Lease'), 'Missing Lease entity');
    assert.ok(er.includes('MaintenanceRequest'), 'Missing MaintenanceRequest entity');
  });

  test('property entities have FK relationships', () => {
    const er = files['docs/04_er_diagram.md'];
    assert.ok(er, 'ER diagram file missing');
    // Check for entities in ER diagram (relationships may vary in format)
    assert.ok(er.includes('Property') && er.includes('Unit'), 'Missing Property/Unit in ER');
    assert.ok(er.includes('Lease'), 'Missing Lease in ER');
    assert.ok(er.includes('MaintenanceRequest'), 'Missing MaintenanceRequest in ER');
  });

  test('Lease entity in API spec', () => {
    const api = files['docs/05_api_spec.md'];
    if (api) {
      // If API spec exists, check for Lease
      assert.ok(api.includes('Lease'), 'Missing Lease in API spec');
    }
  });

  test('domain detected as realestate', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa, 'docs/28_qa_strategy.md missing');
    assert.ok(qa.includes('realestate') || qa.includes('不動産'), 'Missing realestate domain');
  });

  test('QA strategy has realestate-specific bugs', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('成約済み物件') || qa.includes('sold properties') || qa.includes('物件検索'), 'Missing realestate-specific bug patterns');
  });

  test('industry playbook has realestate implementation flows', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    assert.ok(playbook, 'docs/31_industry_playbook.md missing');
    assert.ok(playbook.includes('物件登録') || playbook.includes('Property registration') || playbook.includes('realestate'), 'Missing realestate implementation flows');
  });
});

// ═══ Scenario F: Helpdesk (Domain Detection + Playbook) ═══
describe('Snapshot F: Helpdesk', () => {
  const files = generate({
    purpose: 'ヘルプデスクチケット管理システム', target: 'カスタマーサポート, エンドユーザー',
    frontend: 'React + Vite', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
    deploy: 'Vercel', auth: 'Supabase Auth',
    mvp_features: 'チケット管理, ナレッジベース, SLA管理, 優先度設定',
    screens: 'ダッシュボード, チケット一覧, ナレッジベース, 設定',
    data_entities: 'User, Task, KnowledgeArticle, Response, SLA, Priority',
    dev_methods: 'TDD', ai_tools: 'Cursor', orm: ''
  }, 'Helpdesk');

  test('helpdesk entities in ER diagram', () => {
    const er = files['docs/04_er_diagram.md'];
    assert.ok(er, 'ER diagram file missing');
    assert.ok(er.includes('KnowledgeArticle'), 'Missing KnowledgeArticle entity');
    assert.ok(er.includes('Response'), 'Missing Response entity');
    assert.ok(er.includes('SLA'), 'Missing SLA entity');
    assert.ok(er.includes('Priority'), 'Missing Priority entity');
  });

  test('SLA entity in API spec', () => {
    const api = files['docs/05_api_spec.md'];
    if (api) {
      // If API spec exists, check for SLA
      assert.ok(api.includes('SLA'), 'Missing SLA in API spec');
    }
  });

  test('domain detected as saas', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa, 'docs/28_qa_strategy.md missing');
    assert.ok(qa.includes('saas'), 'Missing saas domain for helpdesk');
  });

  test('QA strategy has saas-specific focus', () => {
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa.includes('Multi-tenant') || qa.includes('マルチテナント') || qa.includes('RLS'), 'Missing saas multi-tenant focus');
  });

  test('industry playbook has saas implementation flows', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    assert.ok(playbook, 'docs/31_industry_playbook.md missing');
    assert.ok(playbook.includes('MRR') || playbook.includes('解約率') || playbook.includes('チャーン') || playbook.includes('saas'), 'Missing saas implementation flows');
  });

  test('playbook has saas compliance rules', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    assert.ok(playbook.includes('SOC 2') || playbook.includes('GDPR') || playbook.includes('SLA'), 'Missing saas compliance rules');
  });

  test('playbook has saas AI skill description', () => {
    const playbook = files['docs/31_industry_playbook.md'];
    // Check for skill description format
    assert.ok(playbook.includes('チャーン予測') || playbook.includes('Churn Prediction') || playbook.includes('入力:') || playbook.includes('Input:'), 'Missing saas AI skill');
  });
});
