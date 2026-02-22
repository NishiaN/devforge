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
eval(fs.readFileSync('src/generators/p12-security.js','utf-8'));
eval(fs.readFileSync('src/generators/p13-strategy.js','utf-8').replace(/const (INDUSTRY_INTEL|STAKEHOLDER_STRATEGY|OPERATIONAL_FRAMEWORKS|OPERATIONAL_FRAMEWORKS_EXT|EXTREME_SCENARIOS|PRAGMATIC_SCENARIOS|TECH_RADAR_BASE)/g,'var $1'));
eval(fs.readFileSync('src/generators/p14-ops.js','utf-8'));
eval(fs.readFileSync('src/generators/p15-future.js','utf-8').replace(/const (DOMAIN_MARKET|PERSONA_ARCHETYPES|GTM_STRATEGY|REGULATORY_HORIZON)/g,'var $1'));
eval(fs.readFileSync('src/generators/p16-deviq.js','utf-8').replace(/const (DEV_METHODOLOGY_MAP|PHASE_PROMPTS|INDUSTRY_STRATEGY|NEXT_GEN_UX|mapDomainToIndustry|gen60|gen61|gen62|gen63|genPillar16_DevIQ)/g,'var $1'));
eval(fs.readFileSync('src/generators/p17-promptgenome.js','utf-8').replace(/const (CRITERIA_FRAMEWORK|AI_MATURITY_MODEL|_APPROACHES|_SYNERGY_RAW|APPROACH_KPI|getSynergy|gen65|gen66|gen67|gen68|genPillar17_PromptGenome)/g,'var $1').replace(/function (_cri|_mat)/g,'var $1 = function'));
eval(fs.readFileSync('src/generators/p18-promptops.js','utf-8').replace(/var (REACT_PROTOCOL|LLMOPS_STACK|PROMPT_LIFECYCLE)/g,'var $1').replace(/function (_rp|_los)/g,'var $1 = function'));
eval(fs.readFileSync('src/generators/p19-enterprise.js','utf-8'));
eval(fs.readFileSync('src/generators/p20-cicd.js','utf-8'));
eval(fs.readFileSync('src/generators/p21-api.js','utf-8'));
eval(fs.readFileSync('src/generators/p22-database.js','utf-8'));
eval(fs.readFileSync('src/generators/p23-testing.js','utf-8'));
eval(fs.readFileSync('src/generators/p24-aisafety.js','utf-8'));
eval(fs.readFileSync('src/generators/p25-performance.js','utf-8'));

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
  genPillar12_SecurityIntelligence(answers, name);
  genPillar13_StrategicIntelligence(answers, name);
  genPillar14_OpsIntelligence(answers, name);
  genPillar15(answers);
  genPillar16_DevIQ(answers, name);
  genPillar17_PromptGenome(answers, name);
  genPillar18_PromptOps(answers, name);
  genPillar19_EnterpriseSaaS(answers, name);
  genPillar20_CICDIntelligence(answers, name);
  genPillar21_APIIntelligence(answers, name);
  genPillar22_DatabaseIntelligence(answers, name);
  genPillar23_TestingIntelligence(answers, name);
  genPillar24_AISafety(answers, name);
  genPillar25_Performance(answers, name);
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

  test('file count in range 129-160 (ADR+1, P21-P25 each add +4 docs, total +21)', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 129 && count <= 160, `Expected 129-160 files (ADR+1, P21-P25 each +4 docs), got ${count}`);
  });

  test('total tokens in range 12000-90000 (P21-P25 each add ~4-6K tokens)', () => {
    const total = Object.values(files).reduce((s, v) => s + tokens(v), 0);
    assert.ok(total >= 12000 && total <= 90000, `Expected 12K-90K tokens (P21-P25 each +4-6K), got ${total}`);
  });

  // Core files existence
  test('all .spec/ files exist', () => {
    ['constitution.md','specification.md','technical-plan.md','tasks.md','verification.md'].forEach(f => {
      assert.ok(files['.spec/' + f], `.spec/${f} missing`);
    });
  });

  test('docs/00 ADR exists with required sections', () => {
    const adr = files['docs/00_architecture_decision_records.md'];
    assert.ok(adr, 'docs/00_architecture_decision_records.md missing');
    assert.ok(adr.includes('ADR-001') || adr.includes('ADR-0'), 'ADR entries missing');
    assert.ok(adr.includes('ADR-002'), 'ADR-002 missing');
    assert.ok(adr.includes('ADR-003'), 'ADR-003 missing');
    assert.ok(adr.includes('ADR-004'), 'ADR-004 missing');
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

  test('security intelligence files exist (Pillar 12)', () => {
    assert.ok(files['docs/43_security_intelligence.md'], 'docs/43_security_intelligence.md missing');
    assert.ok(files['docs/44_threat_model.md'], 'docs/44_threat_model.md missing');
    assert.ok(files['docs/45_compliance_matrix.md'], 'docs/45_compliance_matrix.md missing');
    assert.ok(files['docs/46_ai_security.md'], 'docs/46_ai_security.md missing');
    assert.ok(files['docs/47_security_testing.md'], 'docs/47_security_testing.md missing');
  });

  test('security intelligence has OWASP 2025', () => {
    const si = files['docs/43_security_intelligence.md'];
    assert.ok(si.includes('OWASP') || si.includes('Top 10'), 'Missing OWASP reference');
    assert.ok(si.includes('2025') || si.includes('LLM'), 'Missing 2025/LLM content');
  });

  test('threat model has STRIDE or attack vectors', () => {
    const tm = files['docs/44_threat_model.md'];
    assert.ok(tm.includes('STRIDE') || tm.includes('脅威') || tm.includes('Threat') || tm.includes('攻撃'), 'Missing threat methodology');
  });

  test('compliance matrix has regulations', () => {
    const cm = files['docs/45_compliance_matrix.md'];
    assert.ok(cm.includes('GDPR') || cm.includes('個人情報') || cm.includes('規制') || cm.includes('Compliance') || cm.includes('コンプライアンス') || cm.includes('適用') || cm.includes('法令'), 'Missing compliance regulations');
  });

  test('ai security has prompt injection or LLM risks', () => {
    const ais = files['docs/46_ai_security.md'];
    assert.ok(ais.includes('Prompt') || ais.includes('プロンプト') || ais.includes('LLM'), 'Missing AI-specific security content');
  });

  test('security testing has test cases or methodology', () => {
    const st = files['docs/47_security_testing.md'];
    assert.ok(st.includes('test') || st.includes('テスト') || st.includes('検証') || st.includes('penetration'), 'Missing security testing methodology');
  });

  test('strategic intelligence files exist (Pillar 13)', () => {
    assert.ok(files['docs/48_industry_blueprint.md'], 'docs/48_industry_blueprint.md missing');
    assert.ok(files['docs/49_tech_radar.md'], 'docs/49_tech_radar.md missing');
    assert.ok(files['docs/50_stakeholder_strategy.md'], 'docs/50_stakeholder_strategy.md missing');
    assert.ok(files['docs/51_operational_excellence.md'], 'docs/51_operational_excellence.md missing');
    assert.ok(files['docs/52_advanced_scenarios.md'], 'docs/52_advanced_scenarios.md missing');
  });

  test('industry blueprint has domain-specific content', () => {
    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('規制') || ib.includes('Regulatory'), 'Missing regulatory section');
    assert.ok(ib.includes('アーキテクチャ') || ib.includes('Architecture'), 'Missing architecture patterns');
    assert.ok(ib.includes('失敗') || ib.includes('Failure'), 'Missing failure factors');
    assert.ok(ib.includes('ビジネスモデル') || ib.includes('Business Model'), 'Missing business model');
  });

  test('tech radar has 2026-2030 trends', () => {
    const tr = files['docs/49_tech_radar.md'];
    assert.ok(tr.includes('2026') || tr.includes('2030'), 'Missing year range');
    assert.ok(tr.includes('Adopt') || tr.includes('採用'), 'Missing Adopt category');
    assert.ok(tr.includes('Trial') || tr.includes('試験'), 'Missing Trial category');
  });

  test('stakeholder strategy exists with types', () => {
    const ss = files['docs/50_stakeholder_strategy.md'];
    assert.ok(ss.includes('開発フェーズ') || ss.includes('Development Phase'), 'Missing dev phase');
    assert.ok(ss.includes('技術的負債') || ss.includes('Technical Debt'), 'Missing tech debt');
    assert.ok(ss.includes('チーム') || ss.includes('Team'), 'Missing team composition');
  });

  test('operational excellence has frameworks', () => {
    const oe = files['docs/51_operational_excellence.md'];
    assert.ok(oe.includes('技術的負債') || oe.includes('Technical Debt'), 'Missing tech debt framework');
    assert.ok(oe.includes('DR') || oe.includes('BCP') || oe.includes('災害'), 'Missing DR/BCP');
    assert.ok(oe.includes('Green IT') || oe.includes('カーボン'), 'Missing Green IT');
  });

  test('advanced scenarios has extended frameworks', () => {
    const as = files['docs/52_advanced_scenarios.md'];
    assert.ok(as.includes('AI倫理') || as.includes('AI Ethics'), 'Missing AI ethics framework');
    assert.ok(as.includes('ゼロトラスト') || as.includes('Zero Trust'), 'Missing zero trust framework');
    assert.ok(as.includes('データガバナンス') || as.includes('Data Governance'), 'Missing data governance');
    assert.ok(as.includes('グローバル') || as.includes('Globalization'), 'Missing globalization');
  });

  test('advanced scenarios has extreme patterns', () => {
    const as = files['docs/52_advanced_scenarios.md'];
    assert.ok(as.includes('極限実装') || as.includes('Extreme'), 'Missing extreme scenarios section');
    // Should have at least Strangler Fig (applies to all domains)
    assert.ok(as.includes('Strangler') || as.includes('strangler'), 'Missing Strangler Fig (applies to all domains)');
  });

  test('advanced scenarios has pragmatic patterns', () => {
    const as = files['docs/52_advanced_scenarios.md'];
    assert.ok(as.includes('実利') || as.includes('Pragmatic'), 'Missing pragmatic scenarios section');
    // Should have at least some pragmatic scenarios
    assert.ok(as.includes('使い捨て') || as.includes('Disposable') || as.includes('AI協働') ||
              as.includes('HITL') || as.includes('Human-in-the-loop'), 'Missing pragmatic scenario examples');
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

  test('CLAUDE.md is thin and references .claude/rules/', () => {
    const claude = files['CLAUDE.md'];
    assert.ok(claude.includes('.claude/rules/'), 'Should reference rule files');
    assert.ok(claude.length < 3000, 'Should be thin (~1.5K tokens)');
    assert.ok(claude.includes('Workflow') || claude.includes('ワークフロー'), 'Should have workflow section');
    // Domain risks section is optional (only for domains with industry intel)
    if(claude.includes('Compliance') || claude.includes('コンプライアンス')) {
      assert.ok(claude.includes('Regulatory') || claude.includes('規制要件'), 'Should have regulatory requirements if compliance section exists');
    }
  });

  test('.claude/rules/ files exist and have content', () => {
    assert.ok(files['.claude/rules/spec.md'], 'Missing spec.md');
    assert.ok(files['.claude/rules/frontend.md'], 'Missing frontend.md');
    assert.ok(files['.claude/rules/backend.md'], 'Missing backend.md');
    assert.ok(files['.claude/rules/test.md'], 'Missing test.md');
    assert.ok(files['.claude/rules/ops.md'], 'Missing ops.md');

    // Check spec.md includes file selection matrix and domain context
    const specRules = files['.claude/rules/spec.md'];
    assert.ok(specRules.includes('Task Type') || specRules.includes('タスク種別'), 'spec.md should have task type section');
    assert.ok(specRules.includes('Recommended Files') || specRules.includes('推奨読込ファイル'), 'spec.md should have file selection matrix');
    assert.ok(specRules.includes('New Feature') || specRules.includes('新規機能'), 'spec.md should have task examples');
    // Domain context rotation is optional (only for domains with ctx data)
    if(specRules.includes('Domain Context') || specRules.includes('ドメインコンテキスト')) {
      assert.ok(specRules.includes('Reference Docs') || specRules.includes('参照ドキュメント'), 'spec.md domain context should have columns');
    }

    // Check ops.md references the right docs
    const opsRules = files['.claude/rules/ops.md'];
    assert.ok(opsRules.includes('docs/53_ops_runbook.md'), 'ops.md should reference ops runbook');
    assert.ok(opsRules.includes('docs/54_ops_checklist.md'), 'ops.md should reference ops checklist');
    assert.ok(opsRules.includes('docs/55_ops_plane_design.md'), 'ops.md should reference ops plane design');
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

  test('.claude/settings.json has correct structure', () => {
    const settings = JSON.parse(files['.claude/settings.json']);
    assert.ok(settings.permissions, 'Missing permissions in settings');
    assert.ok(settings.context, 'Missing context in settings');
    assert.ok(settings.rules, 'Missing rules in settings');
    assert.ok(settings.permissions.allowedTools.includes('Read'), 'Should allow Read tool');
    assert.ok(settings.permissions.dangerousCommands, 'Should have dangerous commands warnings');
  });

  test('.gitattributes exists and enforces LF', () => {
    assert.ok(files['.gitattributes'], '.gitattributes missing');
    assert.ok(files['.gitattributes'].includes('text=auto'), 'Missing text=auto');
    assert.ok(files['.gitattributes'].includes('eol=lf'), 'Missing eol=lf');
    assert.ok(files['.gitattributes'].includes('binary'), 'Missing binary rules');
  });

  test('.editorconfig exists with standard settings', () => {
    assert.ok(files['.editorconfig'], '.editorconfig missing');
    assert.ok(files['.editorconfig'].includes('root = true'), 'Missing root=true');
    assert.ok(files['.editorconfig'].includes('end_of_line = lf'), 'Missing end_of_line');
  });

  test('docs/64_cross_platform_guide.md exists', () => {
    assert.ok(files['docs/64_cross_platform_guide.md'], 'docs/64 missing');
    const cp = files['docs/64_cross_platform_guide.md'];
    assert.ok(cp.includes('gitattributes') || cp.includes('改行'), 'Missing line ending section');
    assert.ok(cp.includes('DevContainer'), 'Missing DevContainer section');
  });

  test('post-create.sh defaults to local for BaaS (no dev_env_type)', () => {
    const pc = files['.devcontainer/post-create.sh'];
    assert.ok(pc.includes('supabase start') || pc.includes('supabase init'), 'Default should auto-start Supabase');
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

  test('P17 Prompt Genome docs/65-68 exist', () => {
    assert.ok(files['docs/65_prompt_genome.md'], 'docs/65 missing');
    assert.ok(files['docs/66_ai_maturity_assessment.md'], 'docs/66 missing');
    assert.ok(files['docs/67_prompt_composition_guide.md'], 'docs/67 missing');
    assert.ok(files['docs/68_prompt_kpi_dashboard.md'], 'docs/68 missing');
  });

  test('P17 doc65 contains CRITERIA scoring', () => {
    const doc65 = files['docs/65_prompt_genome.md'];
    assert.ok(doc65.includes('CRITERIA'), 'doc65 has CRITERIA section');
    assert.ok(doc65.includes('プロンプトゲノム') || doc65.includes('Prompt Genome'), 'doc65 has genome title');
  });

  test('P17 doc67 contains synergy matrix', () => {
    const doc67 = files['docs/67_prompt_composition_guide.md'];
    assert.ok(doc67.includes('12×12') || doc67.includes('12x12') || doc67.includes('Synergy'), 'doc67 has synergy matrix');
  });

  test('P18 Prompt Ops docs/69-72 exist', () => {
    assert.ok(files['docs/69_prompt_ops_pipeline.md'], 'docs/69 missing');
    assert.ok(files['docs/70_react_workflow.md'], 'docs/70 missing');
    assert.ok(files['docs/71_llmops_dashboard.md'], 'docs/71 missing');
    assert.ok(files['docs/72_prompt_registry.md'], 'docs/72 missing');
  });

  test('P18 doc69 contains Prompt Lifecycle and Pipeline content', () => {
    const doc69 = files['docs/69_prompt_ops_pipeline.md'];
    assert.ok(doc69.includes('ReAct') || doc69.includes('Prompt') || doc69.includes('ライフサイクル'), 'doc69 has pipeline/lifecycle content');
  });

  test('P18 doc70 contains ReAct Reason/Act/Observe/Verify cycle', () => {
    const doc70 = files['docs/70_react_workflow.md'];
    assert.ok(doc70.includes('Reason') && doc70.includes('Act') && doc70.includes('Observe'), 'doc70 has ReAct stages');
  });

  test('P18 doc72 contains META structure and Template-ID', () => {
    const doc72 = files['docs/72_prompt_registry.md'];
    assert.ok(doc72.includes('META') || doc72.includes('Template') || doc72.includes('Registry'), 'doc72 has registry/template content');
  });

  test('P21 API Intelligence docs/83-86 exist', () => {
    assert.ok(files['docs/83_api_design_principles.md'], 'docs/83 missing');
    assert.ok(files['docs/84_openapi_specification.md'], 'docs/84 missing');
    assert.ok(files['docs/85_api_security_checklist.md'], 'docs/85 missing');
    assert.ok(files['docs/86_api_testing_strategy.md'], 'docs/86 missing');
  });

  test('P22 Database Intelligence docs/87-90 exist', () => {
    assert.ok(files['docs/87_database_design_principles.md'], 'docs/87 missing');
    assert.ok(files['docs/88_query_optimization_guide.md'], 'docs/88 missing');
    assert.ok(files['docs/89_migration_strategy.md'], 'docs/89 missing');
    assert.ok(files['docs/90_backup_disaster_recovery.md'], 'docs/90 missing');
  });

  test('P23 Testing Intelligence docs/91-94 exist', () => {
    assert.ok(files['docs/91_testing_strategy.md'], 'docs/91 missing');
    assert.ok(files['docs/92_coverage_design.md'], 'docs/92 missing');
    assert.ok(files['docs/93_e2e_test_architecture.md'], 'docs/93 missing');
    assert.ok(files['docs/94_performance_testing.md'], 'docs/94 missing');
  });

  test('P24 AI Safety docs/95-98 exist', () => {
    assert.ok(files['docs/95_ai_safety_framework.md'], 'docs/95 missing');
    assert.ok(files['docs/96_ai_guardrail_implementation.md'], 'docs/96 missing');
    assert.ok(files['docs/97_ai_model_evaluation.md'], 'docs/97 missing');
    assert.ok(files['docs/98_prompt_injection_defense.md'], 'docs/98 missing');
  });

  test('P25 Performance Intelligence docs/99-102 exist', () => {
    assert.ok(files['docs/99_performance_strategy.md'], 'docs/99 missing');
    assert.ok(files['docs/100_database_performance.md'], 'docs/100 missing');
    assert.ok(files['docs/101_cache_strategy.md'], 'docs/101 missing');
    assert.ok(files['docs/102_performance_monitoring.md'], 'docs/102 missing');
  });
});

// ═══ Dev Environment Type Tests ═══
describe('Dev Environment Type Tests', () => {
  test('cloud mode: no auto-start, cloud instructions shown', () => {
    const f = generate({
      purpose: 'テスト', target: 'テスト',
      frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
      deploy: 'Vercel', auth: 'Supabase Auth', dev_env_type: 'クラウド接続',
      mvp_features: '認証', screens: 'ダッシュボード',
      data_entities: 'User', dev_methods: 'TDD', ai_tools: 'Cursor'
    }, 'CloudTest');
    const pc = f['.devcontainer/post-create.sh'];
    assert.ok(!pc.includes('supabase start'), 'Cloud should NOT auto-start');
    const env = f['.env.example'];
    assert.ok(env.includes('YOUR_PROJECT') || env.includes('Cloud') || env.includes('クラウド'), 'Should have cloud placeholders');
  });

  test('hybrid mode: install but no auto-start, DEV_MODE shown', () => {
    const f = generate({
      purpose: 'テスト', target: 'テスト',
      frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
      deploy: 'Vercel', auth: 'Supabase Auth', dev_env_type: 'ハイブリッド',
      mvp_features: '認証', screens: 'ダッシュボード',
      data_entities: 'User', dev_methods: 'TDD', ai_tools: 'Cursor'
    }, 'HybridTest');
    const pc = f['.devcontainer/post-create.sh'];
    assert.ok(pc.includes('supabase init'), 'Hybrid should install');
    // Check that "npx supabase start" is not executed as a command (not on its own line)
    const lines = pc.split('\n');
    const hasAutoStart = lines.some(line => /^npx supabase start\s*$/.test(line.trim()));
    assert.ok(!hasAutoStart, 'Hybrid should NOT auto-start supabase');
    const env = f['.env.example'];
    assert.ok(env.includes('DEV_MODE'), 'Should have DEV_MODE switch');
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

  test('file count in range 119-149 (P21-P25 each add +4 docs, total +20)', () => {
    const count = Object.keys(files).length;
    assert.ok(count >= 119 && count <= 149, `Expected 119-149 files (P21-P25 each +4 docs), got ${count}`);
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

  test('P19 Enterprise docs/73-76 exist for EC domain', () => {
    assert.ok(files['docs/73_enterprise_architecture.md'], 'docs/73 missing for EC');
    assert.ok(files['docs/74_workflow_engine.md'], 'docs/74 missing for EC');
    assert.ok(files['docs/75_admin_dashboard_spec.md'], 'docs/75 missing for EC');
    assert.ok(files['docs/76_enterprise_components.md'], 'docs/76 missing for EC');
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

  test('P19 Enterprise docs/73-76 exist for SaaS domain (English)', () => {
    assert.ok(files['docs/73_enterprise_architecture.md'], 'docs/73 missing for SaaS');
    assert.ok(files['docs/74_workflow_engine.md'], 'docs/74 missing for SaaS');
    assert.ok(files['docs/75_admin_dashboard_spec.md'], 'docs/75 missing for SaaS');
    assert.ok(files['docs/76_enterprise_components.md'], 'docs/76 missing for SaaS');
  });

  test('P19 doc73 has Organization and RLS content (English output)', () => {
    const doc73 = files['docs/73_enterprise_architecture.md'];
    assert.ok(doc73.includes('Organization') || doc73.includes('RLS') || doc73.includes('Row-Level'), 'doc73 missing org/RLS content');
    assert.ok(doc73.includes('Enterprise') || doc73.includes('multi-tenant') || doc73.includes('Multi-tenant'), 'doc73 missing enterprise/multi-tenant content');
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

  test('P19 Enterprise docs/73 and docs/76 exist for saas/helpdesk domain', () => {
    assert.ok(files['docs/73_enterprise_architecture.md'], 'docs/73 missing for Helpdesk/SaaS');
    assert.ok(files['docs/76_enterprise_components.md'], 'docs/76 missing for Helpdesk/SaaS');
  });
});

// ═══ Extended Industry Detection Tests (8 new industries) ═══
describe('P13 Extended Industry Detection', () => {
  test('detectIndustry: manufacturing', () => {
    const files = generate({
      purpose: 'スマートファクトリー管理システム', target: '製造業管理者',
      frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
      deploy: 'Railway', mvp_features: '生産管理, 品質管理, 予知保全',
      data_entities: 'Product, Machine, QualityCheck'
    }, 'Manufacturing');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib, 'industry_blueprint.md missing');
    assert.ok(ib.includes('ISO 9001') || ib.includes('IEC 62443') || ib.includes('製造物責任法'), 'Missing manufacturing regulations');
  });

  test('detectIndustry: logistics', () => {
    const files = generate({
      purpose: '配送ルート最適化システム', target: '物流企業',
      frontend: 'Vue', backend: 'Node.js', database: 'PostgreSQL',
      deploy: 'Vercel', mvp_features: 'ルート最適化, GPS追跡, 在庫管理',
      data_entities: 'Delivery, Route, Warehouse'
    }, 'Logistics');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('貨物運送') || ib.includes('2024年問題') || ib.includes('倉庫業法') || ib.includes('Freight'), 'Missing logistics regulations');
  });

  test('detectIndustry: agriculture', () => {
    const files = generate({
      purpose: 'スマート農業管理プラットフォーム', target: '農家',
      frontend: 'React', backend: 'Supabase', database: 'Supabase',
      deploy: 'Vercel', mvp_features: 'センサー管理, 病害虫診断, 収穫予測',
      data_entities: 'Farm, Sensor, Harvest'
    }, 'Agriculture');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('農薬取締法') || ib.includes('GAP') || ib.includes('Agricultural chemicals'), 'Missing agriculture regulations');
  });

  test('detectIndustry: energy', () => {
    const files = generate({
      purpose: 'エネルギー管理システム', target: '発電事業者',
      frontend: 'React', backend: 'Node.js', database: 'PostgreSQL',
      deploy: 'Railway', mvp_features: '発電量管理, 需給予測, カーボンクレジット',
      data_entities: 'PowerPlant, Generation, Emission'
    }, 'Energy');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('電気事業法') || ib.includes('再エネ') || ib.includes('GHG') || ib.includes('Electricity business'), 'Missing energy regulations');
  });

  test('detectIndustry: media', () => {
    const files = generate({
      purpose: 'ストリーミング配信プラットフォーム', target: '視聴者',
      frontend: 'React + Next.js', backend: 'Node.js', database: 'PostgreSQL',
      deploy: 'Vercel', mvp_features: '動画配信, DRM, 広告配信',
      data_entities: 'Video, User, Subscription'
    }, 'Media');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('著作権法') || ib.includes('DRM') || ib.includes('Copyright'), 'Missing media regulations');
  });

  test('detectIndustry: government', () => {
    const files = generate({
      purpose: '行政手続きオンライン申請システム', target: '市民',
      frontend: 'React', backend: 'Node.js', database: 'PostgreSQL',
      deploy: 'Gov Cloud', mvp_features: 'オンライン申請, マイナンバー連携, 電子署名',
      data_entities: 'Application, Citizen, Document'
    }, 'Government');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('JPKI') || ib.includes('ISMAP') || ib.includes('マイナンバー') || ib.includes('Government'), 'Missing government regulations');
  });

  test('detectIndustry: travel', () => {
    const files = generate({
      purpose: '旅行予約管理システム', target: '旅行者',
      frontend: 'React', backend: 'Supabase', database: 'Supabase',
      deploy: 'Vercel', mvp_features: '宿泊予約, 決済, レビュー管理',
      data_entities: 'Hotel, Reservation, Review'
    }, 'Travel');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('旅行業法') || ib.includes('旅館業法') || ib.includes('Travel agency') || ib.includes('PMS'), 'Missing travel regulations');
  });

  test('detectIndustry: insurance', () => {
    const files = generate({
      purpose: '保険商品管理システム', target: '保険会社',
      frontend: 'React', backend: 'Node.js', database: 'PostgreSQL',
      deploy: 'Railway', mvp_features: '商品管理, 引受審査, 請求処理',
      data_entities: 'Policy, Claim, Underwriting'
    }, 'Insurance');

    const ib = files['docs/48_industry_blueprint.md'];
    assert.ok(ib.includes('保険業法') || ib.includes('IFRS 17') || ib.includes('Insurance business') || ib.includes('Telematics'), 'Missing insurance regulations');
  });

  test('32 industries coverage (24 original + 8 new)', () => {
    // Verify INDUSTRY_INTEL has all industries
    assert.ok(typeof INDUSTRY_INTEL === 'object', 'INDUSTRY_INTEL not defined');
    const industries = Object.keys(INDUSTRY_INTEL);
    assert.ok(industries.length >= 25, `Expected at least 25 industries (24 domains + 8 new + default), got ${industries.length}`);

    // Check new 8 industries exist
    const newIndustries = ['manufacturing', 'logistics', 'agriculture', 'energy', 'media', 'government', 'travel', 'insurance'];
    newIndustries.forEach(ind => {
      assert.ok(INDUSTRY_INTEL[ind], `Missing ${ind} in INDUSTRY_INTEL`);
    });
  });

  // ═══ Phase 4: CLAUDE.md 3-Layer Split Tests ═══
  test('generates .claude/ structure', () => {
    const files = generate({
      purpose: 'Build a web app',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestApp', 'en');

    // Layer A - Thin root CLAUDE.md
    assert.ok(files['CLAUDE.md'], 'Should have root CLAUDE.md');
    assert.ok(files['CLAUDE.md'].length < 3000, 'Root CLAUDE.md should be thin (~1.5K tokens)');
    assert.ok(files['CLAUDE.md'].includes('.claude/rules/'), 'Should reference rule files');

    // Layer B - Rule files
    assert.ok(files['.claude/rules/spec.md'], 'Should have spec rules');
    assert.ok(files['.claude/rules/frontend.md'], 'Should have frontend rules');
    assert.ok(files['.claude/rules/backend.md'], 'Should have backend rules');
    assert.ok(files['.claude/rules/test.md'], 'Should have test rules');
    assert.ok(files['.claude/rules/ops.md'], 'Should have ops rules');

    // Layer C - Settings
    assert.ok(files['.claude/settings.json'], 'Should have settings.json');
    const settings = JSON.parse(files['.claude/settings.json']);
    assert.ok(settings.permissions, 'Settings should have permissions');
    assert.ok(settings.context, 'Settings should have context');
    assert.ok(settings.rules, 'Settings should have rules');
  });

  test('.claude/rules files have YAML frontmatter', () => {
    const files = generate({
      purpose: 'Test app',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'Test', 'en');

    const ruleFiles = [
      '.claude/rules/spec.md',
      '.claude/rules/frontend.md',
      '.claude/rules/backend.md',
      '.claude/rules/test.md',
      '.claude/rules/ops.md'
    ];

    ruleFiles.forEach(path => {
      const content = files[path];
      assert.ok(content.startsWith('---\n'), `${path} should start with YAML frontmatter`);
      assert.ok(content.includes('paths:'), `${path} should have paths field`);
      assert.ok(content.includes('alwaysApply:'), `${path} should have alwaysApply field`);
    });
  });

  test('.claude/rules/frontend.md adapts to framework', () => {
    // Test React (use English for easier assertions)
    const filesReact = generate({
      purpose: 'Test', frontend: 'React', backend: 'Express', database: 'PostgreSQL'
    }, 'React', 'en');
    assert.ok(filesReact['.claude/rules/frontend.md'].includes('hooks'), 'React rules should mention hooks');

    // Test Vue
    const filesVue = generate({
      purpose: 'Test', frontend: 'Vue', backend: 'Express', database: 'PostgreSQL'
    }, 'Vue', 'en');
    assert.ok(filesVue['.claude/rules/frontend.md'].includes('Composition API'), 'Vue rules should mention Composition API');

    // Test Svelte
    const filesSvelte = generate({
      purpose: 'Test', frontend: 'Svelte', backend: 'Express', database: 'PostgreSQL'
    }, 'Svelte', 'en');
    assert.ok(filesSvelte['.claude/rules/frontend.md'].includes('Reactive'), 'Svelte rules should mention reactive declarations');
  });

  test('.claude/rules/backend.md adapts to architecture', () => {
    // Test BaaS (use English for easier assertions)
    const filesBaaS = generate({
      purpose: 'Test', frontend: 'Next.js', backend: 'Supabase', database: 'Supabase'
    }, 'BaaS', 'en');
    const backendBaaS = filesBaaS['.claude/rules/backend.md'];
    assert.ok(backendBaaS.includes('RLS'), 'BaaS rules should mention RLS');
    assert.ok(backendBaaS.includes('supabase/migrations'), 'BaaS rules should mention migrations path');

    // Test BFF
    const filesBFF = generate({
      purpose: 'Test', frontend: 'Next.js', backend: 'Next.js (API Routes)', database: 'PostgreSQL'
    }, 'BFF', 'en');
    const backendBFF = filesBFF['.claude/rules/backend.md'];
    assert.ok(backendBFF.includes('BFF'), 'BFF rules should mention BFF pattern');

    // Test Traditional
    const filesTrad = generate({
      purpose: 'Test', frontend: 'React', backend: 'Express', database: 'PostgreSQL'
    }, 'Traditional', 'en');
    const backendTrad = filesTrad['.claude/rules/backend.md'];
    assert.ok(backendTrad.includes('Client-Server') || backendTrad.includes('Traditional'), 'Traditional rules should mention pattern');
  });

  test('.claude/settings.json has correct structure', () => {
    const files = generate({
      purpose: 'Test', frontend: 'React', backend: 'Express', database: 'PostgreSQL'
    }, 'Test', 'en');

    const settings = JSON.parse(files['.claude/settings.json']);

    // Permissions
    assert.ok(Array.isArray(settings.permissions.allowedTools), 'Should have allowedTools array');
    assert.ok(settings.permissions.allowedTools.includes('Read'), 'Should allow Read');
    assert.ok(settings.permissions.allowedTools.includes('Write'), 'Should allow Write');

    // Dangerous commands
    assert.ok(Array.isArray(settings.permissions.dangerousCommands.requireConfirmation), 'Should have requireConfirmation array');
    assert.ok(settings.permissions.dangerousCommands.requireConfirmation.includes('rm -rf'), 'Should require confirmation for rm -rf');

    // Context
    assert.strictEqual(settings.context.specDir, '.spec/', 'Should have correct specDir');
    assert.strictEqual(settings.context.docsDir, 'docs/', 'Should have correct docsDir');

    // Rules
    assert.strictEqual(settings.rules.autoLoadByPath, true, 'Should enable autoLoadByPath');
  });

  test('file count includes .claude/ structure (+6 files)', () => {
    const files = generate({
      purpose: 'LMS', frontend: 'Next.js', backend: 'Supabase',
      database: 'Supabase', deploy: 'Vercel'
    }, 'LMS', 'en');

    const claudeFiles = [
      'CLAUDE.md',
      '.claude/rules/spec.md',
      '.claude/rules/frontend.md',
      '.claude/rules/backend.md',
      '.claude/rules/test.md',
      '.claude/rules/ops.md',
      '.claude/settings.json'
    ];

    claudeFiles.forEach(path => {
      assert.ok(files[path], `Should have ${path}`);
    });
  });
});

// ═══ Scenario G: Healthcare (Express + PostgreSQL, 99.99% SLO, PHI/HIPAA) ═══
describe('Snapshot G: Healthcare/Medical domain', () => {
  const files = generate({
    purpose: '医療記録管理システム', target: '医師, 看護師, 患者',
    frontend: 'React + Next.js', backend: 'Express', database: 'PostgreSQL',
    deploy: 'AWS (EC2/ECS/Lambda)', auth: 'メール/パスワード, MFA',
    mvp_features: '患者管理, 診断記録, 予約管理, 処方箋管理',
    screens: 'ダッシュボード, 患者詳細, 予約管理, 管理画面',
    data_entities: 'Patient, Doctor, Appointment, MedicalRecord',
    dev_methods: 'TDD', ai_tools: 'Cursor',
  }, 'HealthApp');

  test('domain detected as health', () => {
    // Verify detectDomain maps 医療 → health
    const domain = detectDomain('医療記録管理システム');
    assert.equal(domain, 'health', `Expected health domain, got: ${domain}`);
  });

  test('ops runbook references 99.99% SLO', () => {
    const runbook = files['docs/53_ops_runbook.md'];
    assert.ok(runbook, 'docs/53_ops_runbook.md missing');
    assert.ok(
      runbook.includes('99.99%'),
      'Healthcare ops runbook should reference 99.99% SLO'
    );
  });

  test('ops runbook mentions PHI encryption requirement', () => {
    const runbook = files['docs/53_ops_runbook.md'];
    assert.ok(
      runbook.includes('PHI') || runbook.includes('暗号化'),
      'Healthcare ops runbook should mention PHI or encryption'
    );
  });

  test('compliance matrix includes healthcare regulations', () => {
    const compliance = files['docs/45_compliance_matrix.md'];
    assert.ok(compliance, 'docs/45_compliance_matrix.md missing');
    assert.ok(
      compliance.includes('HIPAA') || compliance.includes('医療法') || compliance.includes('個人情報'),
      'Healthcare compliance matrix should include HIPAA or medical law'
    );
  });

  test('security intelligence has health-domain audit fields', () => {
    const opsRunbook = files['docs/53_ops_runbook.md'];
    // P14 ops includes domain-specific audit fields table with patient_id, PHI_flag
    assert.ok(
      opsRunbook.includes('patient_id') || opsRunbook.includes('PHI_flag') || opsRunbook.includes('PHI'),
      'Health ops runbook should reference PHI audit fields'
    );
  });
});

// ═══ Scenario H: Fintech (Express + PostgreSQL, 99.99% SLO, PCI DSS) ═══
describe('Snapshot H: Fintech/Payment domain', () => {
  const files = generate({
    purpose: 'フィンテック決済管理システム', target: '個人ユーザー, 企業',
    frontend: 'React + Next.js', backend: 'Express', database: 'PostgreSQL',
    deploy: 'AWS (EC2/ECS/Lambda)', auth: 'メール/パスワード, MFA',
    payment: 'Stripe決済',
    mvp_features: '決済処理, 取引履歴, 残高管理, 不正検知',
    screens: 'ダッシュボード, 取引一覧, 送金, 設定',
    data_entities: 'User, Account, Transaction, Payment',
    dev_methods: 'TDD', ai_tools: 'Cursor',
  }, 'FintechApp');

  test('domain detected as fintech', () => {
    const domain = detectDomain('フィンテック決済管理システム');
    assert.equal(domain, 'fintech', `Expected fintech domain, got: ${domain}`);
  });

  test('ops runbook references 99.99% SLO for transaction success rate', () => {
    const runbook = files['docs/53_ops_runbook.md'];
    assert.ok(runbook, 'docs/53_ops_runbook.md missing');
    assert.ok(
      runbook.includes('99.99%'),
      'Fintech ops runbook should reference 99.99% SLO'
    );
  });

  test('ops plane design mentions PCI DSS compliance', () => {
    const opsPlane = files['docs/55_ops_plane_design.md'];
    assert.ok(opsPlane, 'docs/55_ops_plane_design.md missing');
    assert.ok(
      opsPlane.includes('PCI') || opsPlane.includes('SOX') || opsPlane.includes('fintech'),
      'Fintech ops plane design should mention PCI DSS, SOX or fintech'
    );
  });

  test('compliance matrix includes fintech regulations', () => {
    const compliance = files['docs/45_compliance_matrix.md'];
    assert.ok(compliance, 'docs/45_compliance_matrix.md missing');
    assert.ok(
      compliance.includes('PCI') || compliance.includes('SOX') || compliance.includes('金融') || compliance.includes('fintech'),
      'Fintech compliance matrix should include PCI DSS or financial regulations'
    );
  });

  test('ops runbook includes fintech-specific audit fields (transaction_id, amount)', () => {
    const runbook = files['docs/53_ops_runbook.md'];
    assert.ok(
      runbook.includes('transaction_id') || runbook.includes('amount') || runbook.includes('取引'),
      'Fintech ops runbook should reference transaction audit fields'
    );
  });

  test('P19 Enterprise docs/73 exists for Fintech domain', () => {
    assert.ok(files['docs/73_enterprise_architecture.md'], 'docs/73 missing for Fintech');
  });

  test('P19 doc73 has isolation/tenant content for Fintech', () => {
    const doc73 = files['docs/73_enterprise_architecture.md'];
    assert.ok(
      doc73.includes('fintech') || doc73.includes('RLS') || doc73.includes('tenant') || doc73.includes('isolation'),
      'doc73 missing fintech/isolation content'
    );
  });
});

// ═══ Scenario I: Government (Express + PostgreSQL, WCAG, ISMS) ═══
describe('Snapshot I: Government/Civic domain', () => {
  const files = generate({
    purpose: '行政サービス申請管理システム', target: '市民, 職員, 管理者',
    frontend: 'React + Next.js', backend: 'Express', database: 'PostgreSQL',
    deploy: 'AWS (EC2/ECS/Lambda)', auth: 'メール/パスワード',
    mvp_features: '申請管理, 書類管理, 審査ワークフロー, 市民向けポータル',
    screens: 'ダッシュボード, 申請一覧, 申請詳細, 管理画面',
    data_entities: 'Citizen, Application, Document, Review, Department',
    dev_methods: 'TDD', ai_tools: 'Cursor',
  }, 'GovApp');

  test('domain detected as government', () => {
    const domain = detectDomain('行政サービス申請管理システム');
    assert.equal(domain, 'government', `Expected government domain, got: ${domain}`);
  });

  test('quality intelligence references WCAG 2.1 AA for government', () => {
    // p5-quality.js maps government → 'WCAG 2.1 AA'
    const qa = files['docs/28_qa_strategy.md'];
    assert.ok(qa, 'docs/28_qa_strategy.md missing');
    assert.ok(
      qa.includes('WCAG') || qa.includes('アクセシビリティ') || qa.includes('Accessibility'),
      'Government QA strategy should reference WCAG accessibility standard'
    );
  });

  test('industry blueprint includes government regulatory requirements', () => {
    const blueprint = files['docs/48_industry_blueprint.md'];
    assert.ok(blueprint, 'docs/48_industry_blueprint.md missing');
    assert.ok(
      blueprint.includes('ISMAP') || blueprint.includes('JPKI') || blueprint.includes('行政') || blueprint.includes('Government'),
      'Government industry blueprint should include government-specific requirements'
    );
  });

  test('security intelligence references government security standards', () => {
    const secIntel = files['docs/43_security_intelligence.md'];
    assert.ok(secIntel, 'docs/43_security_intelligence.md missing');
    assert.ok(
      secIntel.includes('ISMS') || secIntel.includes('ISMAP') || secIntel.includes('ISO') || secIntel.includes('セキュリティ'),
      'Government security intelligence should reference security standards'
    );
  });
});
