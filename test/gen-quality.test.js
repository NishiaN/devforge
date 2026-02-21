/**
 * Generation Quality Tests — Phase ④
 *
 * End-to-end verification: 25/25 pre-filled answers (Phase N/O/K)
 * produce richer, more contextual generated documents than 11 minimal answers.
 *
 * Each suite targets one specific answer group and traces it through
 * to the exact generated file(s) that consume it.
 *
 * Answer groups under test:
 *   N-6/G-1  success KPI      → docs/01_project_overview.md, .spec/constitution.md
 *   N-5      ai_tools         → roadmap/TOOLS_SETUP.md, .spec/technical-plan.md
 *   N-8      scope_out        → .spec/constitution.md §7
 *   N-4      org_model        → .spec/technical-plan.md §4.5 (multi-tenant)
 *   G-2/G-3  skill_level +    → roadmap/LEARNING_PATH.md (timeline, layer labels)
 *            learning_goal
 *   N-7/ORM  BaaS backend     → roadmap/LEARNING_PATH.md §Layer 3 ORM
 *   Domain   detectDomain     → .spec/constitution.md §3 fallback KPI
 *   E2E      full generation  → file count, token richness, bilingual parity
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

/* ═══ Scaffold (same pattern as snapshot.test.js) ═══ */
const S = {
  answers:{}, skill:'intermediate', lang:'ja', preset:'custom',
  projectName:'T', phase:1, step:0, skipped:[], files:{},
  editedFiles:{}, prevFiles:{}, genLang:'ja', previewFile:null,
  pillar:0, skillLv:3,
};
const save=()=>{};const _lsGet=()=>null;const _lsSet=()=>{};const _lsRm=()=>{};
const sanitize=v=>v;

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

/* ═══ Generation helpers ═══ */

/** Run only the SDD+docs generators (covers most 25/25 answer tests) */
function gSDD(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar1_SDD(answers,'QTest');
  genDocs21(answers,'QTest');
  return S.files;
}

/** Run only roadmap generator (covers skill_level, learning_goal, ai_tools, ORM) */
function gRoadmap(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar7_Roadmap(answers,'QTest');
  return S.files;
}

/** Full 25-pillar generation (for E2E token and file count tests) */
function gFull(answers, lang, skill) {
  S.files={}; S.genLang=lang||'ja'; S.skill=skill||'intermediate';
  genPillar1_SDD(answers,'QTest');
  genPillar2_DevContainer(answers,'QTest');
  genCommonFiles(answers,'QTest');
  genDocs21(answers,'QTest');
  genPillar3_MCP(answers,'QTest');
  genPillar4_AIRules(answers,'QTest');
  genPillar5_QualityIntelligence(answers,'QTest');
  genPillar7_Roadmap(answers,'QTest');
  genPillar9_DesignSystem(answers,'QTest');
  genPillar10_ReverseEngineering(answers,'QTest');
  genPillar11_ImplIntelligence(answers,'QTest');
  genPillar12_SecurityIntelligence(answers,'QTest');
  genPillar13_StrategicIntelligence(answers,'QTest');
  genPillar14_OpsIntelligence(answers,'QTest');
  genPillar15(answers);
  genPillar16_DevIQ(answers,'QTest');
  genPillar17_PromptGenome(answers,'QTest');
  genPillar18_PromptOps(answers,'QTest');
  genPillar19_EnterpriseSaaS(answers,'QTest');
  genPillar20_CICDIntelligence(answers,'QTest');
  genPillar21_APIIntelligence(answers,'QTest');
  genPillar22_DatabaseIntelligence(answers,'QTest');
  genPillar23_TestingIntelligence(answers,'QTest');
  genPillar24_AISafety(answers,'QTest');
  genPillar25_Performance(answers,'QTest');
  return Object.assign({},S.files);
}

function tokens(t) { return Math.round((t||'').length/3.5); }

/* ─── Answer-set builders ─── */

/** 11-answer minimal base (pre-25/25 baseline) */
const A11 = {
  purpose: 'SaaS型サブスク管理プラットフォーム',
  target: 'ビジネスユーザー, 20-40代',
  frontend: 'React + Next.js',
  backend: 'Supabase',
  database: 'Supabase (PostgreSQL)',
  auth: 'Supabase Auth',
  deploy: 'Vercel',
  payment: 'Stripe Billing (サブスク)',
  mvp_features: 'ユーザー認証, サブスク管理, ダッシュボード',
  data_entities: 'User, Subscription, Invoice, Plan',
  screens: 'ランディング, ダッシュボード, 設定, 管理画面',
};

/** 25-answer full set (post Phase N/O inference) */
const A25 = Object.assign({}, A11, {
  dev_methods:      'TDD（テスト駆動）, SDD（仕様駆動）',
  ai_auto:          'マルチAgent協調',
  mobile:           'なし',
  deadline:         '3ヶ月',
  // Phase N inferred:
  dev_env_type:     'ローカル開発',
  org_model:        'マルチテナント(RLS)',
  ai_tools:         'Cursor, Claude Code, GitHub Copilot',
  success:          '📈 月間1000ユーザー, 💰 MRR10万円, 🔄 チャーン5%以下',
  scope_out:        'ネイティブアプリ, AI機能',
  future_features:  '分析レポート, モバイルアプリ, AI機能, チーム機能',
  // Phase O inferred:
  skill_level:      'Intermediate',
  learning_goal:    '3ヶ月集中',
  learning_path:    'React + BaaS',
});

/* ══════════════════════════════════════════════════════════════════
   Suite 1 — Success KPI (N-6/G-1): propagates to overview + constitution
   ════════════════════════════════════════════════════════════════ */
describe('Q1: Success KPI → project_overview + constitution', () => {

  it('A25 success appears verbatim in docs/01_project_overview.md', () => {
    const f = gSDD(A25);
    const ov = f['docs/01_project_overview.md'] || '';
    assert.ok(ov.includes('MRR10万円'), 'project_overview must contain the custom success KPI');
  });

  it('A25 success appears in .spec/constitution.md §3', () => {
    const f = gSDD(A25);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(con.includes('MRR10万円'), 'constitution §3 must contain the custom success KPI');
  });

  it('A11 (no success) → docs/01_project_overview.md shows N/A (baseline)', () => {
    const f = gSDD(A11);
    const ov = f['docs/01_project_overview.md'] || '';
    // Without success answer, overview falls back to 'N/A'
    assert.ok(ov.includes('N/A'), 'without success answer overview shows N/A — 25/25 fills this gap');
  });

  it('A11 (no success) but domain=education → constitution uses domain KPI fallback, not N/A', () => {
    const eduAnswers = Object.assign({}, A11, {
      purpose: '教育プラットフォーム — コース管理・進捗管理',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      auth: 'Email/Password',
    });
    const f = gSDD(eduAnswers);
    const con = f['.spec/constitution.md'] || '';
    // constitution has domain fallback KPI (コース完了率) even without explicit success answer
    assert.ok(
      con.includes('コース完了率') || con.includes('Course completion'),
      'without success answer, constitution uses education domain KPI fallback'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 2 — AI Tools (N-5): TOOLS_SETUP.md lists each tool explicitly
   ════════════════════════════════════════════════════════════════ */
describe('Q2: ai_tools → roadmap/TOOLS_SETUP.md tool enumeration', () => {

  it('A25 with 3 ai_tools → TOOLS_SETUP lists Cursor, Claude Code, GitHub Copilot', () => {
    const f = gRoadmap(A25);
    const ts = f['roadmap/TOOLS_SETUP.md'] || '';
    assert.ok(ts.includes('Cursor'),         'TOOLS_SETUP must list Cursor');
    assert.ok(ts.includes('Claude'),          'TOOLS_SETUP must list Claude Code');
    assert.ok(ts.includes('Copilot'),         'TOOLS_SETUP must list GitHub Copilot');
  });

  it('A11 (no ai_tools) → TOOLS_SETUP AI section defaults to Cursor only', () => {
    const f = gRoadmap(A11);
    const ts = f['roadmap/TOOLS_SETUP.md'] || '';
    // Dynamic tool section uses bold format "- **ToolName**:"
    assert.ok(ts.includes('- **Cursor**:'),   'default ai_tools should show Cursor as bold dynamic entry');
    assert.ok(!ts.includes('- **Claude'),      'without ai_tools answer, Claude Code dynamic entry absent — 25/25 adds it');
    assert.ok(!ts.includes('- **GitHub Copilot'), 'without ai_tools answer, Copilot dynamic entry absent — 25/25 adds it');
  });

  it('A25 ai_tools first entry appears in LEARNING_PATH Layer 5', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Cursor'), 'LEARNING_PATH Layer 5 shows first ai_tool (Cursor)');
  });

  it('ai_tools with Antigravity → TOOLS_SETUP links antigravity.google', () => {
    const orchestratorAnswers = Object.assign({}, A25, {
      ai_tools: 'Cursor, Claude Code, GitHub Copilot, Google Antigravity',
      ai_auto: 'オーケストレーター',
    });
    const f = gRoadmap(orchestratorAnswers);
    const ts = f['roadmap/TOOLS_SETUP.md'] || '';
    assert.ok(ts.includes('Antigravity') || ts.includes('antigravity'), 'Antigravity in ai_tools → TOOLS_SETUP has its URL/name');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 3 — Scope Out (N-8): constitution §7 reflects custom scope
   ════════════════════════════════════════════════════════════════ */
describe('Q3: scope_out → .spec/constitution.md §7 Out of Scope', () => {

  it('A25 custom scope_out → constitution §7 contains it', () => {
    const f = gSDD(A25);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(con.includes('AI機能'), 'custom scope_out "AI機能" must appear in constitution §7');
  });

  it('A11 (no scope_out) + saas domain → constitution uses domain default (ネイティブアプリ)', () => {
    const f = gSDD(A11);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(
      con.includes('ネイティブアプリ') || con.includes('Native app'),
      'without scope_out, constitution uses saas domain default (ネイティブアプリ)'
    );
  });

  it('A11 without scope_out: "AI機能" NOT in §7 (25/25 adds precision)', () => {
    const f = gSDD(A11);
    const con = f['.spec/constitution.md'] || '';
    // domain default for saas does NOT include AI機能 — only 25/25 adds it
    assert.ok(!con.includes('AI機能'), 'without 25/25 scope_out, AI機能 should not appear in constitution §7');
  });

  it('mobile=Expo → scope_out rewrites ネイティブアプリ to ストア配布用ネイティブビルド', () => {
    const expoAnswers = Object.assign({}, A11, {
      mobile: 'Expo (React Native)',
      scope_out: 'ネイティブアプリ, AI機能',
    });
    const f = gSDD(expoAnswers);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(
      con.includes('ストア配布用ネイティブビルド') || con.includes('Native app store builds'),
      'when mobile=Expo, scope_out rewrites native app exclusion to store builds language'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 4 — Multi-Tenant org_model (N-4): §4.5 in technical-plan.md
   ════════════════════════════════════════════════════════════════ */
describe('Q4: org_model マルチテナント → technical-plan §4.5', () => {

  it('A25 org_model=マルチテナント(RLS) → technical-plan has §4.5 section', () => {
    const f = gSDD(A25);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(
      tp.includes('4.5') && (tp.includes('マルチテナント') || tp.includes('Multi-Tenant')),
      'multi-tenant org_model must add §4.5 to technical-plan'
    );
  });

  it('A25 org_model=マルチテナント → technical-plan has RLS Mermaid diagram', () => {
    const f = gSDD(A25);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('RLS') && tp.includes('mermaid'), 'multi-tenant technical-plan must include RLS mermaid diagram');
  });

  it('A25 multi-tenant → technical-plan §4.5 has 4-tier permission model (owner/admin/member/viewer)', () => {
    const f = gSDD(A25);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(
      tp.includes('owner') && tp.includes('admin') && tp.includes('member') && tp.includes('viewer'),
      'multi-tenant §4.5 must contain 4-tier permission table'
    );
  });

  it('A11 (no org_model) → technical-plan does NOT have §4.5 multi-tenant section', () => {
    const f = gSDD(A11);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(
      !tp.includes('4.5') || !(tp.includes('マルチテナント') || tp.includes('Multi-Tenant')),
      'without org_model answer, §4.5 must not appear — 25/25 adds this section'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 5 — Roadmap Personalization (G-2 skill_level + G-3 learning_goal)
   ════════════════════════════════════════════════════════════════ */
describe('Q5: skill_level + learning_goal → LEARNING_PATH timeline', () => {

  it('skill_level=Beginner → LEARNING_PATH Layer 1 shows [Month 1-2] timeframe', () => {
    const begAnswers = Object.assign({}, A25, { skill_level: 'Beginner' });
    const f = gRoadmap(begAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('[Month 1-2]'), 'Beginner skill_level should produce monthly timeline in Layer 1');
  });

  it('skill_level=Professional → LEARNING_PATH Layer 1 shows [Week 1-2] timeframe', () => {
    const proAnswers = Object.assign({}, A25, { skill_level: 'Professional' });
    const f = gRoadmap(proAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('[Week 1-2]'), 'Professional skill_level should produce weekly timeline in Layer 1');
  });

  it('learning_goal=3ヶ月集中 with payment → Layer 6 shows Month 2-3', () => {
    const shortGoal = Object.assign({}, A25, {
      skill_level: 'Intermediate',
      learning_goal: '3ヶ月集中',
      payment: 'Stripe Billing (サブスク)',
    });
    const f = gRoadmap(shortGoal);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Month 2-3'), '3-month goal should produce Layer 6 at "Month 2-3"');
  });

  it('learning_goal=12ヶ月じっくり with payment → Layer 6 shows Month 11-12', () => {
    const longGoal = Object.assign({}, A25, {
      skill_level: 'Intermediate',
      learning_goal: '12ヶ月じっくり',
      payment: 'Stripe Billing (サブスク)',
    });
    const f = gRoadmap(longGoal);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Month 11-12'), '12-month goal should produce Layer 6 at "Month 11-12"');
  });

  it('LEARNING_PATH shows skill_level label in header', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Intermediate'), 'LEARNING_PATH header must echo the skill_level value');
  });

  it('LEARNING_PATH shows learning_goal in header', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('3ヶ月集中'), 'LEARNING_PATH header must echo the learning_goal value');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 6 — BaaS vs Traditional ORM in LEARNING_PATH Layer 3
   ════════════════════════════════════════════════════════════════ */
describe('Q6: backend (BaaS vs Traditional) → LEARNING_PATH Layer 3 ORM', () => {

  it('Supabase backend → LEARNING_PATH Layer 3 shows "Supabase Client" (not Prisma)', () => {
    const supaAnswers = Object.assign({}, A25, {
      backend: 'Supabase', database: 'Supabase (PostgreSQL)', auth: 'Supabase Auth',
    });
    const f = gRoadmap(supaAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Supabase Client'), 'Supabase backend → Layer 3 ORM should be "Supabase Client"');
    assert.ok(!lp.includes('Prisma ORM'), 'Supabase backend should NOT show Prisma ORM in Layer 3');
  });

  it('Firebase backend → LEARNING_PATH Layer 3 shows "Firebase SDK"', () => {
    const fbAnswers = Object.assign({}, A25, {
      backend: 'Firebase', database: 'Firebase Firestore', auth: 'Firebase Auth',
    });
    const f = gRoadmap(fbAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Firebase SDK'), 'Firebase backend → Layer 3 ORM should be "Firebase SDK"');
  });

  it('Express backend (non-BaaS) → LEARNING_PATH Layer 3 shows "Prisma ORM"', () => {
    const expAnswers = Object.assign({}, A25, {
      backend: 'Node.js + Express', database: 'PostgreSQL', auth: 'Email/Password',
    });
    const f = gRoadmap(expAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Prisma ORM'), 'Express backend → Layer 3 should default to Prisma ORM');
  });

  it('Express + Drizzle ORM → LEARNING_PATH Layer 3 shows "Drizzle ORM"', () => {
    const drizzleAnswers = Object.assign({}, A25, {
      backend: 'Node.js + Express', database: 'PostgreSQL', auth: 'Email/Password',
      orm: 'Drizzle',
    });
    const f = gRoadmap(drizzleAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Drizzle ORM'), 'Drizzle orm answer → Layer 3 should show Drizzle ORM');
  });

  it('NestJS + TypeORM → LEARNING_PATH Layer 3 shows "TypeORM" (not Prisma ORM)', () => {
    const typeormAnswers = Object.assign({}, A25, {
      backend: 'NestJS', database: 'PostgreSQL', auth: 'Email/Password', orm: 'TypeORM',
    });
    const f = gRoadmap(typeormAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('TypeORM'), 'TypeORM orm answer → Layer 3 should show TypeORM');
    assert.ok(!lp.includes('Prisma ORM'), 'TypeORM orm should NOT fall back to Prisma ORM');
  });

  it('FastAPI + SQLAlchemy → LEARNING_PATH Layer 3 shows "SQLAlchemy" (not Prisma ORM)', () => {
    const saAnswers = Object.assign({}, A25, {
      backend: 'FastAPI (Python)', database: 'PostgreSQL', auth: 'Email/Password', orm: 'SQLAlchemy',
    });
    const f = gRoadmap(saAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('SQLAlchemy'), 'SQLAlchemy orm answer → Layer 3 should show SQLAlchemy');
    assert.ok(!lp.includes('Prisma ORM'), 'SQLAlchemy orm should NOT fall back to Prisma ORM');
  });

  it('Express + Kysely → LEARNING_PATH Layer 3 shows "Kysely" (not Prisma ORM)', () => {
    const kyselyAnswers = Object.assign({}, A25, {
      backend: 'Node.js + Express', database: 'PostgreSQL', auth: 'Email/Password', orm: 'Kysely',
    });
    const f = gRoadmap(kyselyAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Kysely'), 'Kysely orm answer → Layer 3 should show Kysely');
    assert.ok(!lp.includes('Prisma ORM'), 'Kysely orm should NOT fall back to Prisma ORM');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 9 — future_features connects to constitution §8 + LEARNING_PATH
   ════════════════════════════════════════════════════════════════ */
describe('Q9: future_features → constitution §8 + LEARNING_PATH roadmap', () => {

  it('A25 future_features → constitution.md has §8 Post-MVP section', () => {
    const f = gSDD(A25);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(
      con.includes('8.') && (con.includes('Post-MVP') || con.includes('MVP後の拡張計画')),
      'constitution must have §8 Post-MVP Feature Roadmap section'
    );
  });

  it('A25 future_features → constitution §8 lists features from future_features answer', () => {
    const f = gSDD(A25);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(con.includes('分析レポート'), 'constitution §8 must list 分析レポート from future_features');
    assert.ok(con.includes('チーム機能'), 'constitution §8 must list チーム機能 from future_features');
  });

  it('A11 (no future_features) → constitution §8 shows default fallback', () => {
    const f = gSDD(A11);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(
      con.includes('8.') && con.includes('Phase 2'),
      'without future_features, constitution §8 still shows default Phase 2 entries'
    );
  });

  it('A25 future_features → LEARNING_PATH has feature expansion roadmap section', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(
      lp.includes('機能拡張ロードマップ') || lp.includes('Feature Expansion Roadmap'),
      'LEARNING_PATH must include Feature Expansion Roadmap section when future_features is set'
    );
  });

  it('A25 future_features items appear in LEARNING_PATH expansion section', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(
      lp.includes('分析レポート') || lp.includes('AI機能') || lp.includes('チーム機能'),
      'LEARNING_PATH expansion section must list future_features items'
    );
  });

  it('A11 (no future_features) → LEARNING_PATH has no expansion section', () => {
    const f = gRoadmap(A11);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(
      !lp.includes('機能拡張ロードマップ') && !lp.includes('Feature Expansion Roadmap'),
      'without future_features, LEARNING_PATH must not have Feature Expansion Roadmap section'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 10 — learning_path → LEARNING_PATH header
   ════════════════════════════════════════════════════════════════ */
describe('Q10: learning_path → LEARNING_PATH.md header', () => {

  it('A25 learning_path appears in LEARNING_PATH header line', () => {
    const f = gRoadmap(A25);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('React + BaaS'), 'LEARNING_PATH header must include learning_path value');
  });

  it('A11 (no learning_path) → LEARNING_PATH header valid, no empty label shown', () => {
    const f = gRoadmap(A11);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    const header = (lp.split('\n')[1] || '');
    assert.ok(!header.includes('学習パス:  |') && !header.includes('Learning Path:  |'),
      'without learning_path, header must not show empty label pipe');
  });

  it('Fullstack+Mobile learning_path → header shows Fullstack+Mobile', () => {
    const mobileAnswers = Object.assign({}, A25, { learning_path: 'Fullstack+Mobile' });
    const f = gRoadmap(mobileAnswers);
    const lp = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(lp.includes('Fullstack+Mobile'), 'Fullstack+Mobile learning_path must appear in LEARNING_PATH header');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 11 — ai_tools → prompt_composition_guide (P17 gen67)
   ════════════════════════════════════════════════════════════════ */

/** Run only P17 Prompt Genome */
function gP17(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar17_PromptGenome(answers,'QTest');
  return S.files;
}

describe('Q11: ai_tools → docs/67_prompt_composition_guide.md tool table', () => {

  it('A25 with Cursor, Claude Code, GitHub Copilot → guide has tool-specific table', () => {
    const f = gP17(A25);
    const guide = f['docs/67_prompt_composition_guide.md'] || '';
    assert.ok(guide.includes('Cursor'), 'prompt_composition_guide must list Cursor in tool table');
    assert.ok(guide.includes('Claude Code'), 'prompt_composition_guide must list Claude Code');
    assert.ok(guide.includes('Copilot'), 'prompt_composition_guide must list GitHub Copilot');
  });

  it('A11 (no ai_tools) → guide defaults to Cursor entry only', () => {
    const f = gP17(A11);
    const guide = f['docs/67_prompt_composition_guide.md'] || '';
    assert.ok(guide.includes('Cursor'), 'without ai_tools, guide defaults to Cursor');
    assert.ok(!guide.includes('Claude Code'), 'without ai_tools, Claude Code entry absent — 25/25 adds it');
  });

  it('ai_tools with Aider → guide has Aider row with diff-based pattern', () => {
    const aiderAnswers = Object.assign({}, A25, { ai_tools: 'Cursor, Aider' });
    const f = gP17(aiderAnswers);
    const guide = f['docs/67_prompt_composition_guide.md'] || '';
    assert.ok(guide.includes('Aider'), 'Aider in ai_tools → prompt guide must have Aider row');
  });

  it('EN generation: tool table has English headers', () => {
    const f = gP17(A25, 'en');
    const guide = f['docs/67_prompt_composition_guide.md'] || '';
    assert.ok(
      guide.includes('Tool-Specific Prompt Optimization') || guide.includes('Optimal Pattern'),
      'EN prompt_composition_guide must have English tool table header'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 12 — dev_env_type → release_engineering (P20 gen80)
   ════════════════════════════════════════════════════════════════ */

/** Run only P20 CI/CD */
function gP20(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar20_CICDIntelligence(answers,'QTest');
  return S.files;
}

describe('Q12: dev_env_type → docs/80_release_engineering.md branch strategy', () => {

  it('dev_env_type=ローカル開発 → release_engineering has Local Dev branch strategy', () => {
    const f = gP20(A25);
    const rel = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      rel.includes('ローカル開発') || rel.includes('Local Dev') || rel.includes('Feature Branch'),
      'ローカル開発 dev_env_type must produce Local Dev branch strategy section'
    );
  });

  it('dev_env_type=クラウド開発 → release_engineering has Cloud Dev branch strategy', () => {
    const cloudAnswers = Object.assign({}, A25, { dev_env_type: 'クラウド開発' });
    const f = gP20(cloudAnswers);
    const rel = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      rel.includes('クラウド開発') || rel.includes('Cloud Dev'),
      'クラウド開発 dev_env_type must produce Cloud Dev branch strategy section'
    );
    assert.ok(
      rel.includes('Trunk-Based') || rel.includes('trunk'),
      'Cloud Dev strategy must recommend Trunk-Based Development'
    );
  });

  it('dev_env_type=ハイブリッド → release_engineering has Hybrid branch strategy', () => {
    const hybridAnswers = Object.assign({}, A25, { dev_env_type: 'ハイブリッド開発' });
    const f = gP20(hybridAnswers);
    const rel = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      rel.includes('ハイブリッド') || rel.includes('Hybrid'),
      'ハイブリッド dev_env_type must produce Hybrid branch strategy section'
    );
  });

  it('A11 (no dev_env_type) → release_engineering always has branch strategy section', () => {
    const f = gP20(A11);
    const rel = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      rel.includes('Branch Strategy by Dev Environment') || rel.includes('開発環境別ブランチ戦略'),
      'release_engineering always has branch strategy section (defaults to local dev)'
    );
  });

  it('EN generation: release_engineering has English branch strategy', () => {
    const f = gP20(A25, 'en');
    const rel = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      rel.includes('Branch Strategy by Dev Environment') || rel.includes('Local Dev'),
      'EN release_engineering must have English branch strategy'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 7 — Domain KPI fallback quality (constitution §3 without success answer)
   ════════════════════════════════════════════════════════════════ */
describe('Q7: domain-specific KPI fallback in constitution §3', () => {

  it('EC domain (no success) → constitution has GMV metric', () => {
    const ecAnswers = Object.assign({}, A11, {
      purpose: 'ECサイト — 商品販売・在庫管理',
      backend: 'Node.js + Express', database: 'PostgreSQL', auth: 'Email/Password',
      payment: 'Stripe決済', data_entities: 'Product, Order, Category, User',
    });
    const f = gSDD(ecAnswers);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(con.includes('GMV') || con.includes('CVR'), 'EC domain constitution must reference GMV or CVR');
  });

  it('SaaS domain (no success) → constitution has MRR and チャーン率', () => {
    const saasAnswers = Object.assign({}, A11, {
      purpose: 'SaaS型プロジェクト管理ツール サブスク課金',
    });
    const f = gSDD(saasAnswers);
    const con = f['.spec/constitution.md'] || '';
    assert.ok(con.includes('MRR') || con.includes('チャーン'), 'SaaS domain constitution must have MRR/churn KPI');
  });

  it('Custom success overrides domain KPI — education domain with explicit success', () => {
    const customAnswers = Object.assign({}, A11, {
      purpose: '教育 LMS コース管理',
      success: 'CUSTOM_KPI_VALUE_12345',
    });
    const f = gSDD(customAnswers);
    const con = f['.spec/constitution.md'] || '';
    // custom success takes priority over domain fallback
    assert.ok(con.includes('CUSTOM_KPI_VALUE_12345'), 'explicit success answer must override domain KPI in constitution');
    assert.ok(!con.includes('コース完了率'), 'domain fallback KPI must not appear when explicit success is set');
  });

  it('overview: custom success takes priority over N/A', () => {
    const customAnswers = Object.assign({}, A11, { success: 'MY_UNIQUE_KPI_999' });
    const f = gSDD(customAnswers);
    const ov = f['docs/01_project_overview.md'] || '';
    assert.ok(ov.includes('MY_UNIQUE_KPI_999'), 'custom success appears verbatim in overview');
    assert.ok(!ov.includes('N/A'), 'with custom success, overview must not show N/A');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 8 — Full E2E Quality: file count, token richness, bilingual parity
   ════════════════════════════════════════════════════════════════ */
describe('Q8: Full E2E generation — file count, tokens, 25 vs 11 delta', () => {

  it('A25 full generation: file count in 108-162 range', () => {
    const f = gFull(A25);
    const count = Object.keys(f).length;
    assert.ok(count >= 108 && count <= 166, `A25 full gen file count should be 108-166, got ${count}`);
  });

  it('A25 full generation: total tokens ≥ 14000 (rich content across 24 pillars)', () => {
    const f = gFull(A25);
    const total = Object.values(f).reduce((s,v)=>s+tokens(v),0);
    assert.ok(total >= 14000, `A25 total tokens should be ≥14000, got ${total}`);
  });

  it('A25 full generation: technical-plan is content-rich (≥ 800 tokens from org_model §4.5)', () => {
    const f = gFull(A25);
    const t = tokens(f['.spec/technical-plan.md'] || '');
    assert.ok(t >= 800, `technical-plan should be ≥800 tokens with 25/25 answers (org_model adds §4.5), got ${t}`);
  });

  it('A25 generates more total tokens than A11 (25/25 produces richer docs)', () => {
    const f25 = gFull(A25);
    const f11 = gFull(A11);
    const t25 = Object.values(f25).reduce((s,v)=>s+tokens(v),0);
    const t11 = Object.values(f11).reduce((s,v)=>s+tokens(v),0);
    assert.ok(t25 > t11, `25-answer generation (${t25}) must produce more tokens than 11-answer (${t11})`);
  });

  it('A25 EN generation: same file count as JA (bilingual parity)', () => {
    const fJA = gFull(A25, 'ja');
    const fEN = gFull(A25, 'en');
    const cJA = Object.keys(fJA).length;
    const cEN = Object.keys(fEN).length;
    assert.equal(cEN, cJA, `EN and JA generation should produce same file count (JA=${cJA}, EN=${cEN})`);
  });

  it('A25 EN generation: project_overview has "Success Metrics" section', () => {
    const f = gSDD(A25, 'en');
    const ov = f['docs/01_project_overview.md'] || '';
    assert.ok(ov.includes('Success Metrics'), 'EN project_overview must have "Success Metrics" section header');
  });

  it('A25 JA generation: project_overview has "成功指標" section', () => {
    const f = gSDD(A25, 'ja');
    const ov = f['docs/01_project_overview.md'] || '';
    assert.ok(ov.includes('成功指標'), 'JA project_overview must have "成功指標" section header');
  });

  it('A25 LEARNING_PATH is personalized (≥ 200 tokens)', () => {
    const f = gRoadmap(A25);
    const t = tokens(f['roadmap/LEARNING_PATH.md'] || '');
    assert.ok(t >= 200, `LEARNING_PATH with 25/25 answers should be ≥200 tokens, got ${t}`);
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 13 — Phase ⑥ 是正更新: ギャップ修正の検証
   ════════════════════════════════════════════════════════════════ */
describe('Q13: Phase ⑥ Gap Fixes — compliance, mobile security, AI guardrails', () => {

  const AMobile = Object.assign({}, A25, {
    mobile: 'Expo (React Native)',
    ai_auto: 'マルチAgent協調',
    target: '管理者, 一般ユーザー',
  });

  function gSec(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja';
    genPillar12_SecurityIntelligence(answers, 'QTest');
    return S.files;
  }

  function gOps(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja';
    genPillar14_OpsIntelligence(answers, 'QTest');
    return S.files;
  }

  function gPrompt(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja';
    genPillar17_PromptGenome(answers, 'QTest');
    return S.files;
  }

  function gCICD(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja';
    genPillar20_CICDIntelligence(answers, 'QTest');
    return S.files;
  }

  // C2: APPI appears in doc45 compliance matrix (saas domain includes appi)
  it('C2: doc45 compliance matrix includes APPI (個人情報保護法)', () => {
    const f = gSec(A25);
    const doc45 = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(
      doc45.includes('APPI') || doc45.includes('個人情報保護法'),
      `doc45 must include APPI compliance for saas domain, got: ${doc45.slice(0,400)}`
    );
  });

  // C3: MASVS in doc46 when mobile
  it('C3: doc46 contains MASVS section when mobile=Expo', () => {
    const f = gSec(AMobile);
    const doc46 = f['docs/46_ai_security.md'] || '';
    assert.ok(doc46.includes('MASVS'), `doc46 must include MASVS when mobile=Expo, got ${doc46.slice(0,200)}`);
  });

  it('C3: doc46 does NOT contain MASVS when no mobile', () => {
    const f = gSec(A25);
    const doc46 = f['docs/46_ai_security.md'] || '';
    assert.ok(!doc46.includes('MASVS-STORAGE'), 'doc46 should not include MASVS when mobile=なし');
  });

  // C4: created_by + deleted_at in technical-plan.md (entity schema section)
  it('C4: technical-plan.md contains created_by field', () => {
    const f = gSDD(A25);
    const plan = f['.spec/technical-plan.md'] || '';
    assert.ok(plan.includes('created_by'), `technical-plan.md must contain created_by, got: ${plan.slice(0,400)}`);
  });

  it('C4+H5: technical-plan.md contains deleted_at field (soft delete)', () => {
    const f = gSDD(A25);
    const plan = f['.spec/technical-plan.md'] || '';
    assert.ok(plan.includes('deleted_at'), 'technical-plan.md must contain deleted_at (soft delete)');
  });

  // C5: AI Guardrails in doc67 when ai_auto set
  it('C5: doc67 contains Guardrail section when ai_auto set', () => {
    const f = gPrompt(AMobile);
    const doc67 = f['docs/67_prompt_composition_guide.md'] || '';
    assert.ok(
      doc67.includes('Guardrail') || doc67.includes('ガードレール'),
      `doc67 must include AI guardrails section when ai_auto≠none, got ${doc67.slice(0,300)}`
    );
  });

  // C6: Crash-Free Rate in runbook when mobile
  it('C6: runbook contains Crash-Free Rate SLI when mobile=Expo', () => {
    const f = gOps(AMobile);
    const runbook = f['docs/53_ops_runbook.md'] || '';
    assert.ok(
      runbook.includes('Crash-Free') || runbook.includes('クラッシュフリー'),
      `runbook must include Crash-Free Rate SLI when mobile=Expo`
    );
  });

  // H1: NIST SSDF in doc43
  it('H1: doc43 contains NIST SSDF reference', () => {
    const f = gSec(A25);
    const doc43 = f['docs/43_security_intelligence.md'] || '';
    assert.ok(
      doc43.includes('NIST SSDF') || doc43.includes('SP 800-218'),
      `doc43 must reference NIST SSDF (SP 800-218)`
    );
  });

  // H2: WCAG 2.2 in a11y doc
  it('H2: docs/20_a11y contains WCAG 2.2 (not 2.1)', () => {
    const f = gSDD(A25);
    const a11y = f['docs/20_a11y.md'] || '';
    assert.ok(a11y.includes('WCAG 2.2'), 'a11y doc must reference WCAG 2.2');
    assert.ok(!a11y.includes('WCAG 2.1'), 'a11y doc must NOT reference deprecated WCAG 2.1');
  });

  // H3: Cookie consent in doc45
  it('H3: doc45 contains Cookie consent section', () => {
    const f = gSec(A25);
    const doc45 = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc45.includes('Cookie'), `doc45 must include Cookie consent section`);
  });

  // H8: Notification monitoring in runbook
  it('H8: runbook contains notification delivery monitoring', () => {
    const f = gOps(A25);
    const runbook = f['docs/53_ops_runbook.md'] || '';
    assert.ok(
      runbook.includes('通知') || runbook.includes('Notification'),
      `runbook must include notification delivery monitoring`
    );
  });

  // C1: App Store checklist in doc80 when mobile
  it('C1: doc80 contains App Store submission checklist when mobile=Expo', () => {
    const f = gCICD(AMobile);
    const doc80 = f['docs/80_release_engineering.md'] || '';
    assert.ok(
      doc80.includes('App Store') || doc80.includes('Google Play'),
      `doc80 must include store submission checklist when mobile=Expo`
    );
  });

  it('C1: doc80 does NOT contain store checklist when mobile=なし', () => {
    const f = gCICD(A25);
    const doc80 = f['docs/80_release_engineering.md'] || '';
    assert.ok(!doc80.includes('App Store Submission') && !doc80.includes('提出前チェックリスト'),
      'doc80 should not include store checklist when no mobile');
  });

  // M5: Boundary value testing in doc33
  it('M5: doc33 contains boundary value test methodology', () => {
    const f = gFull(A25);
    const doc33 = f['docs/33_test_matrix.md'] || '';
    assert.ok(
      doc33.includes('境界値') || doc33.includes('Boundary'),
      `doc33 must include boundary value test methodology`
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 14 — Architecture Integrity Check (docs/82) + resolveORM/resolveAuth
   ════════════════════════════════════════════════════════════════ */
describe('Suite 14: Architecture Integrity Check (docs/82) + ORM/Auth resolvers', () => {

  /** Helper: run genArchIntegrityCheck and return docs/82 content */
  function gArch(answers, lang) {
    const f = gFull(answers, lang || 'ja');
    // Simulate finishGen: run audit + integrity check
    const compat = checkCompat(answers);
    const audit = postGenerationAudit(f, answers);
    genArchIntegrityCheck(f, answers, compat, audit);
    return f;
  }

  // ── resolveORM tests ──
  it('resolveORM: Drizzle ORM answer → {name:"Drizzle ORM", dir:"drizzle"}', () => {
    const r = resolveORM({ orm: 'Drizzle ORM', backend: 'Node.js + Express' });
    assert.strictEqual(r.name, 'Drizzle ORM');
    assert.strictEqual(r.dir, 'drizzle');
    assert.strictEqual(r.isBaaS, false);
  });

  it('resolveORM: TypeORM answer → {name:"TypeORM", dir:"typeorm"}', () => {
    const r = resolveORM({ orm: 'TypeORM', backend: 'NestJS' });
    assert.strictEqual(r.name, 'TypeORM');
    assert.strictEqual(r.dir, 'typeorm');
  });

  it('resolveORM: SQLAlchemy answer → {name:"SQLAlchemy", dir:"alembic", isPython:true}', () => {
    const r = resolveORM({ orm: 'SQLAlchemy', backend: 'Python + FastAPI' });
    assert.strictEqual(r.name, 'SQLAlchemy');
    assert.strictEqual(r.dir, 'alembic');
    assert.strictEqual(r.isPython, true);
  });

  it('resolveORM: Kysely answer → {name:"Kysely", dir:"kysely"}', () => {
    const r = resolveORM({ orm: 'Kysely', backend: 'Node.js + Express' });
    assert.strictEqual(r.name, 'Kysely');
    assert.strictEqual(r.dir, 'kysely');
  });

  it('resolveORM: no orm + Python backend → SQLAlchemy default', () => {
    const r = resolveORM({ backend: 'Python + FastAPI' });
    assert.strictEqual(r.name, 'SQLAlchemy');
    assert.strictEqual(r.isPython, true);
  });

  it('resolveORM: Supabase backend → BaaS mode {isBaaS:true, dir:"supabase"}', () => {
    const r = resolveORM({ backend: 'Supabase' });
    assert.strictEqual(r.isBaaS, true);
    assert.strictEqual(r.dir, 'supabase');
    assert.ok(r.name.includes('Supabase'));
  });

  it('resolveORM: Firebase backend → BaaS mode {dir:"functions"}', () => {
    const r = resolveORM({ backend: 'Firebase' });
    assert.strictEqual(r.isBaaS, true);
    assert.strictEqual(r.dir, 'functions');
  });

  it('resolveORM: no orm + Node.js → Prisma ORM default', () => {
    const r = resolveORM({ backend: 'Node.js + Express' });
    assert.strictEqual(r.name, 'Prisma ORM');
    assert.strictEqual(r.dir, 'prisma');
  });

  // ── resolveAuth JWT fallback tests ──
  it('resolveAuth: Python backend JWT fallback → PyJWT', () => {
    const r = resolveAuth({ backend: 'Python + FastAPI', auth: '' });
    assert.ok(r.tokenVerify.includes('PyJWT') || r.tokenVerify.includes('python-jose'),
      'Python backend should use PyJWT tokenVerify');
  });

  it('resolveAuth: Spring backend JWT fallback → java-jwt / jjwt', () => {
    const r = resolveAuth({ backend: 'Spring Boot', auth: '' });
    assert.ok(r.tokenVerify.includes('java-jwt') || r.tokenVerify.includes('jjwt'),
      'Spring backend should use java-jwt/jjwt tokenVerify');
  });

  it('resolveAuth: Go backend JWT fallback → golang-jwt', () => {
    const r = resolveAuth({ backend: 'Go + Gin', auth: '' });
    assert.ok(r.tokenVerify.includes('golang-jwt'),
      'Go backend should use golang-jwt tokenVerify');
  });

  it('resolveAuth: Node.js backend JWT fallback → jsonwebtoken / jose', () => {
    const r = resolveAuth({ backend: 'Node.js + Express', auth: '' });
    assert.ok(r.tokenVerify.includes('jsonwebtoken') || r.tokenVerify.includes('jose'),
      'Node.js backend should use jsonwebtoken/jose tokenVerify');
  });

  // ── docs/82 generation tests ──
  it('docs/82 exists after full generation (standard preset)', () => {
    const f = gArch(A25);
    assert.ok(f['docs/82_architecture_integrity_check.md'],
      'docs/82_architecture_integrity_check.md must be generated');
  });

  it('docs/82 contains score section', () => {
    const f = gArch(A25);
    const doc82 = f['docs/82_architecture_integrity_check.md'] || '';
    assert.ok(
      doc82.includes('/10') && (doc82.includes('スコア') || doc82.includes('Score')),
      'docs/82 must contain architecture compliance score section'
    );
  });

  it('docs/82 contains violation table header', () => {
    const f = gArch(A25);
    const doc82 = f['docs/82_architecture_integrity_check.md'] || '';
    assert.ok(
      doc82.includes('違反') || doc82.includes('Violation'),
      'docs/82 must contain violation table'
    );
  });

  it('docs/82 Python+Prisma mismatch → score < 10', () => {
    const pyAnswers = Object.assign({}, A25, {
      backend: 'Python + FastAPI',
      database: 'PostgreSQL',
      auth: 'JWT',
      orm: 'Prisma ORM',
    });
    const f = gArch(pyAnswers);
    const doc82 = f['docs/82_architecture_integrity_check.md'] || '';
    // Score should be below 10 due to ORM-backend mismatch
    const scoreMatch = doc82.match(/(\d+\.\d+)\/10/);
    assert.ok(scoreMatch, 'docs/82 must contain X.X/10 score');
    const scoreVal = parseFloat(scoreMatch[1]);
    assert.ok(scoreVal < 10, 'Python+Prisma mismatch should reduce score below 10, got ' + scoreVal);
  });

  it('docs/82 EN generation: titles in English', () => {
    const f = gArch(A25, 'en');
    const doc82 = f['docs/82_architecture_integrity_check.md'] || '';
    assert.ok(
      doc82.includes('Architecture Integrity Check Report') ||
      doc82.includes('Architecture Compliance Score') ||
      doc82.includes('Strengths'),
      'docs/82 EN must contain English section titles'
    );
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 15 — Python/Split deployment 是正: SQLAlchemy Mixin / Async Queue / CORS
   ════════════════════════════════════════════════════════════════ */
describe('Suite 15: Python/Split deployment corrections', () => {

  // Python FastAPI is always split (Vite SPA + separate FastAPI server)
  const pyAnswers = Object.assign({}, A25, {
    frontend: 'React + Vite',   // SPA — no Next.js SSR, resolveArch → 'split'
    backend: 'Python + FastAPI',
    database: 'PostgreSQL',
    orm: 'SQLAlchemy (Python)',
    deploy: 'Vercel',
  });

  /** Helper: run p1-sdd only */
  function gSDD(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate';
    genPillar1_SDD(answers, 'QTest');
    return S.files;
  }

  /** Helper: run p2-devcontainer only */
  function gDev(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate';
    genPillar2_DevContainer(answers, 'QTest');
    return S.files;
  }

  // ── 違反#1: SQLAlchemy Soft Delete Mixin ──
  it('#1 Python backend → technical-plan contains SoftDeleteMixin', () => {
    const f = gSDD(pyAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('SoftDeleteMixin'), 'technical-plan must contain SoftDeleteMixin for Python backend');
  });

  it('#1 Python backend → technical-plan contains active_query pattern', () => {
    const f = gSDD(pyAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('active_query'), 'technical-plan must contain active_query method');
  });

  it('#1 Python backend → technical-plan contains deleted_at IS NULL reference', () => {
    const f = gSDD(pyAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('deleted_at'), 'technical-plan must contain deleted_at mixin reference');
  });

  it('#1 Non-Python backend → no SoftDeleteMixin section', () => {
    const nodeAnswers = Object.assign({}, A25, { backend: 'Node.js + Express' });
    const f = gSDD(nodeAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(!tp.includes('SoftDeleteMixin'), 'Node.js backend should not have SoftDeleteMixin section');
  });

  // ── 違反#2: 非同期ジョブ基盤 ──
  it('#2 Python + background feature → technical-plan contains BackgroundTasks', () => {
    const bgAnswers = Object.assign({}, pyAnswers, { mvp_features: 'ユーザー管理, バックグラウンド処理, データエクスポート' });
    const f = gSDD(bgAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('BackgroundTasks'), 'Python + background feature must include BackgroundTasks section');
  });

  it('#2 Python + export feature → technical-plan contains Celery', () => {
    const bgAnswers = Object.assign({}, pyAnswers, { mvp_features: 'ユーザー管理, データエクスポート' });
    const f = gSDD(bgAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('Celery'), 'Python + export feature must include Celery section');
  });

  it('#2 Non-Python without background → no async queue section', () => {
    const nodeAnswers = Object.assign({}, A25, { backend: 'Node.js + Express' });
    const f = gSDD(nodeAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(!tp.includes('BackgroundTasks'), 'Non-Python without background should not have BackgroundTasks');
  });

  it('#2 Decision matrix contains threshold comparison', () => {
    const bgAnswers = Object.assign({}, pyAnswers, { mvp_features: 'バックグラウンド処理' });
    const f = gSDD(bgAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('10'), 'Async section should include 10s threshold decision');
  });

  // ── 違反#3: CORS環境変数 ──
  it('#3 split deployment → technical-plan contains CORS section', () => {
    const splitAnswers = Object.assign({}, pyAnswers, { deploy: 'Vercel', backend: 'Python + FastAPI' });
    // arch.pattern='split' when backend is separate server
    const f = gSDD(splitAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('CORS') || tp.includes('ALLOWED_ORIGINS'), 'Split deployment must include CORS section');
  });

  it('#3 split deployment → technical-plan contains FRONTEND_URL variable', () => {
    const f = gSDD(pyAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('FRONTEND_URL'), 'Split deployment must document FRONTEND_URL env var');
  });

  it('#3 split deployment → technical-plan contains API_BASE_URL variable', () => {
    const f = gSDD(pyAnswers);
    const tp = f['.spec/technical-plan.md'] || '';
    assert.ok(tp.includes('API_BASE_URL'), 'Split deployment must document API_BASE_URL env var');
  });

  it('#3 Python .env.example contains FRONTEND_URL', () => {
    const f = gDev(pyAnswers);
    const env = f['.env.example'] || '';
    assert.ok(env.includes('FRONTEND_URL'), '.env.example must contain FRONTEND_URL for Python backend');
  });

  it('#3 Python .env.example contains BACKEND_API_URL', () => {
    const f = gDev(pyAnswers);
    const env = f['.env.example'] || '';
    assert.ok(env.includes('BACKEND_API_URL'), '.env.example must contain BACKEND_API_URL for Python backend');
  });

  // ── 違反#4: alembic (前回実装済み確認) ──
  it('#4 Python + PostgreSQL post-create contains alembic upgrade head', () => {
    const f = gDev(pyAnswers);
    const ps = f['.devcontainer/post-create.sh'] || '';
    assert.ok(ps.includes('alembic upgrade head'), 'post-create.sh must contain alembic upgrade head for Python+PostgreSQL');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 16 — Pillar ㉑ API Intelligence (docs/83-86)
   ════════════════════════════════════════════════════════════════ */

/** Run only P21 API Intelligence */
function gAPI(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar21_APIIntelligence(answers,'QTest');
  return S.files;
}

const apiAnswers = Object.assign({}, A25, {
  backend: 'Express.js + Node.js',
  frontend: 'React + Vite',
  database: 'PostgreSQL (Neon)',
  auth: 'JWT',
  entities: 'User, Post, Comment',
  payment: 'なし',
  orm: 'Prisma ORM',
});

const pyApiAnswers = Object.assign({}, apiAnswers, {
  backend: 'FastAPI (Python)',
  database: 'PostgreSQL (Neon)',
  orm: 'SQLAlchemy',
});

const baasApiAnswers = Object.assign({}, A25, {
  backend: 'Supabase',
  auth: 'Supabase Auth',
});

const graphqlAnswers = Object.assign({}, apiAnswers, {
  backend: 'Express.js + Node.js + GraphQL',
  frontend: 'React + Next.js',
});

describe('Suite 16: Pillar ㉑ API Intelligence', () => {

  // ── docs/83 API Design Principles ──
  it('generates docs/83_api_design_principles.md', () => {
    const f = gAPI(apiAnswers);
    assert.ok(f['docs/83_api_design_principles.md'], 'docs/83 must be generated');
  });

  it('docs/83 REST: contains resource naming principle', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Resource Naming') || doc.includes('リソース命名'), 'docs/83 must contain resource naming');
  });

  it('docs/83 REST: contains URL design conventions section', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('/api/v1/'), 'docs/83 must include URL convention examples');
  });

  it('docs/83 Python (FastAPI): contains FastAPI implementation patterns', () => {
    const f = gAPI(pyApiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('FastAPI') || doc.includes('APIRouter'), 'docs/83 must contain FastAPI patterns for Python backend');
  });

  it('docs/83 BaaS (Supabase): describes BaaS client SDK approach', () => {
    const f = gAPI(baasApiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('BaaS'), 'docs/83 must describe BaaS client SDK for BaaS backend');
  });

  it('docs/83 GraphQL: describes GraphQL design principles', () => {
    const f = gAPI(graphqlAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('GraphQL') || doc.includes('DataLoader'), 'docs/83 must contain GraphQL principles');
  });

  it('docs/83 EN generation works', () => {
    const f = gAPI(apiAnswers, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('API Design Principles'), 'docs/83 EN must have English title');
    assert.ok(doc.includes('Resource Naming'), 'docs/83 EN must have English content');
  });

  // ── docs/84 OpenAPI Specification ──
  it('generates docs/84_openapi_specification.md', () => {
    const f = gAPI(apiAnswers);
    assert.ok(f['docs/84_openapi_specification.md'], 'docs/84 must be generated');
  });

  it('docs/84 contains OpenAPI 3.1 spec structure', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('openapi: "3.1.0"') || doc.includes("openapi: '3.1.0'"), 'docs/84 must contain OpenAPI 3.1 version');
  });

  it('docs/84 generates entity schemas from answers.entities', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('User') && doc.includes('Post'), 'docs/84 must include schemas for entities from answers');
  });

  it('docs/84 includes JWT security scheme when auth is JWT', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('BearerAuth') || doc.includes('bearer'), 'docs/84 must include bearer auth security scheme for JWT');
  });

  it('docs/84 BaaS: adds note about minimal custom REST API', () => {
    const f = gAPI(baasApiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('Edge Functions'), 'docs/84 BaaS must note that custom REST is minimal');
  });

  it('docs/84 FastAPI: mentions FastAPI built-in /docs', () => {
    const f = gAPI(pyApiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('FastAPI') || doc.includes('/docs'), 'docs/84 must mention FastAPI auto-doc for Python backend');
  });

  // ── docs/85 API Security Checklist ──
  it('generates docs/85_api_security_checklist.md', () => {
    const f = gAPI(apiAnswers);
    assert.ok(f['docs/85_api_security_checklist.md'], 'docs/85 must be generated');
  });

  it('docs/85 contains OWASP API Security Top 10', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('OWASP') && doc.includes('API1:2023'), 'docs/85 must include OWASP API Top 10');
  });

  it('docs/85 contains critical items: input validation and SQL injection', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('SQLインジェクション') || doc.includes('SQL Injection'), 'docs/85 must include SQL injection check');
    assert.ok(doc.includes('入力検証') || doc.includes('Input validation'), 'docs/85 must include input validation check');
  });

  it('docs/85 BaaS (Supabase): adds RLS checklist section', () => {
    const f = gAPI(baasApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('RLS') || doc.includes('Row Level Security'), 'docs/85 BaaS must include RLS checks');
  });

  it('docs/85 EN generation works', () => {
    const f = gAPI(apiAnswers, 'en');
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('API Security Checklist'), 'docs/85 EN must have English title');
    assert.ok(doc.includes('CRITICAL'), 'docs/85 EN must include CRITICAL section');
  });

  // ── docs/86 API Testing Strategy ──
  it('generates docs/86_api_testing_strategy.md', () => {
    const f = gAPI(apiAnswers);
    assert.ok(f['docs/86_api_testing_strategy.md'], 'docs/86 must be generated');
  });

  it('docs/86 contains test pyramid section', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('Test Pyramid') || doc.includes('テストピラミッド'), 'docs/86 must contain test pyramid');
  });

  it('docs/86 Node backend: contains supertest example', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('supertest'), 'docs/86 Node backend must include supertest example');
  });

  it('docs/86 Python backend: contains pytest/httpx example', () => {
    const f = gAPI(pyApiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('pytest') || doc.includes('httpx'), 'docs/86 Python backend must include pytest/httpx example');
  });

  it('docs/86 contains k6 load testing example', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('k6'), 'docs/86 must include k6 load testing');
  });

  it('docs/86 contains CI integration section', () => {
    const f = gAPI(apiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('CI') || doc.includes('github/workflows'), 'docs/86 must include CI integration');
  });

  it('docs/86 EN generation works', () => {
    const f = gAPI(apiAnswers, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('API Testing Strategy'), 'docs/86 EN must have English title');
    assert.ok(doc.includes('Test Pyramid'), 'docs/86 EN must have English content');
  });

  // ── All 4 files present ──
  it('all 4 docs/83-86 files are generated for standard preset', () => {
    const f = gAPI(apiAnswers);
    ['docs/83_api_design_principles.md','docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md','docs/86_api_testing_strategy.md'].forEach(path => {
      assert.ok(f[path], path+' must be generated');
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 17 — Pillar ㉒ DB Intelligence (docs/87-90)
   ════════════════════════════════════════════════════════════════ */

/** Run only P22 Database Intelligence */
function gDB(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar22_DatabaseIntelligence(answers,'QTest');
  return S.files;
}

const dbAnswers = Object.assign({}, A25, {
  backend: 'Express.js + Node.js',
  database: 'PostgreSQL (Neon)',
  orm: 'Prisma ORM',
});

const drizzleAnswers = Object.assign({}, dbAnswers, { orm: 'Drizzle ORM' });
const pyDbAnswers = Object.assign({}, A25, {
  backend: 'FastAPI (Python)',
  database: 'PostgreSQL (Neon)',
  orm: 'SQLAlchemy',
});
const mongoAnswers = Object.assign({}, dbAnswers, {
  database: 'MongoDB',
  orm: '',
});
const baasDbAnswers = Object.assign({}, A25, {
  backend: 'Supabase',
  auth: 'Supabase Auth',
});

describe('Suite 17: Pillar ㉒ DB Intelligence', () => {

  // ── docs/87 Database Design Principles ──
  it('generates docs/87_database_design_principles.md', () => {
    const f = gDB(dbAnswers);
    assert.ok(f['docs/87_database_design_principles.md'], 'docs/87 must be generated');
  });

  it('docs/87 contains soft delete principle', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('deleted_at') || doc.includes('Soft Delete'), 'docs/87 must contain soft delete pattern');
  });

  it('docs/87 Prisma: contains Prisma schema example', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('schema.prisma') || doc.includes('prisma'), 'docs/87 Prisma must include Prisma schema');
  });

  it('docs/87 SQLAlchemy: contains SQLAlchemy model example', () => {
    const f = gDB(pyDbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('SQLAlchemy') || doc.includes('DeclarativeBase'), 'docs/87 Python must include SQLAlchemy model');
  });

  it('docs/87 MongoDB: contains document design principles', () => {
    const f = gDB(mongoAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('MongoDB') || doc.includes('Embed'), 'docs/87 MongoDB must include document design');
  });

  it('docs/87 EN generation works', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Database Design Principles'), 'docs/87 EN must have English title');
    assert.ok(doc.includes('Naming Conventions') || doc.includes('Schema Design'), 'docs/87 EN must have English content');
  });

  // ── docs/88 Query Optimization ──
  it('generates docs/88_query_optimization_guide.md', () => {
    const f = gDB(dbAnswers);
    assert.ok(f['docs/88_query_optimization_guide.md'], 'docs/88 must be generated');
  });

  it('docs/88 contains N+1 problem section', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('N+1') || doc.includes('n+1'), 'docs/88 must contain N+1 problem');
  });

  it('docs/88 Prisma: contains include or findMany pattern', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('include') || doc.includes('findMany'), 'docs/88 Prisma must include eager loading pattern');
  });

  it('docs/88 contains connection pooling section', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('Connection Pool') || doc.includes('connection pool') || doc.includes('pgBouncer') || doc.includes('Prisma Accelerate'), 'docs/88 must contain connection pooling');
  });

  it('docs/88 EN generation works', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('Query Optimization'), 'docs/88 EN must have English title');
  });

  // ── docs/89 Migration Strategy ──
  it('generates docs/89_migration_strategy.md', () => {
    const f = gDB(dbAnswers);
    assert.ok(f['docs/89_migration_strategy.md'], 'docs/89 must be generated');
  });

  it('docs/89 contains zero-downtime migration principle', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('ゼロダウンタイム') || doc.includes('Zero-Downtime') || doc.includes('zero-downtime'), 'docs/89 must contain zero-downtime principle');
  });

  it('docs/89 Drizzle: contains drizzle-kit migrate command', () => {
    const f = gDB(drizzleAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('drizzle-kit') || doc.includes('Drizzle'), 'docs/89 Drizzle must include drizzle-kit workflow');
  });

  it('docs/89 Python: contains Alembic workflow', () => {
    const f = gDB(pyDbAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('alembic') || doc.includes('Alembic'), 'docs/89 Python must include Alembic workflow');
  });

  it('docs/89 EN generation works', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('Migration Strategy'), 'docs/89 EN must have English title');
  });

  // ── docs/90 Backup & DR ──
  it('generates docs/90_backup_disaster_recovery.md', () => {
    const f = gDB(dbAnswers);
    assert.ok(f['docs/90_backup_disaster_recovery.md'], 'docs/90 must be generated');
  });

  it('docs/90 contains RTO/RPO table', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('RTO') && doc.includes('RPO'), 'docs/90 must contain RTO/RPO definitions');
  });

  it('docs/90 Supabase: contains Supabase PITR reference', () => {
    const f = gDB(baasDbAnswers);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('PITR'), 'docs/90 BaaS must reference Supabase PITR');
  });

  it('docs/90 contains DR runbook', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('DR') || doc.includes('Runbook') || doc.includes('runbook') || doc.includes('復旧'), 'docs/90 must contain DR runbook');
  });

  it('docs/90 EN generation works', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Backup') || doc.includes('Disaster Recovery'), 'docs/90 EN must have English title');
  });

  // ── All 4 files present ──
  it('all 4 docs/87-90 files are generated for standard preset', () => {
    const f = gDB(dbAnswers);
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md'].forEach(p => {
      assert.ok(f[p], p+' must be generated');
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 18 — Pillar ㉓ Testing Intelligence (docs/91-94)
   ════════════════════════════════════════════════════════════════ */

/** Run only P23 Testing Intelligence */
function gTest(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar23_TestingIntelligence(answers,'QTest');
  return Object.assign({},S.files);
}

const testAnswers = Object.assign({}, A25, {
  backend: 'Next.js (App Router) + tRPC',
  frontend: 'React / Next.js',
  orm: 'Prisma ORM',
  database: 'PostgreSQL (Neon)',
  mobile: 'なし',
  auth: 'NextAuth.js / Auth.js',
});

const pyTestAnswers = Object.assign({}, A25, {
  backend: 'Python / FastAPI',
  frontend: 'React / Next.js',
  orm: 'SQLAlchemy',
  database: 'PostgreSQL (Neon)',
  mobile: 'なし',
  auth: 'JWT (カスタム実装)',
});

const mobileTestAnswers = Object.assign({}, A25, {
  backend: 'Supabase',
  frontend: 'React / Next.js',
  orm: '',
  database: 'Supabase Database',
  mobile: 'Expo (React Native)',
  auth: 'Supabase Auth',
});

describe('Suite 18: Pillar ㉓ Testing Intelligence', () => {

  // ── docs/91 Testing Strategy ──
  it('generates docs/91_testing_strategy.md', () => {
    const f = gTest(testAnswers);
    assert.ok(f['docs/91_testing_strategy.md'], 'docs/91 must be generated');
  });

  it('docs/91 contains test pyramid', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('ピラミッド') || doc.includes('Pyramid') || doc.includes('Unit') || doc.includes('単体'), 'docs/91 must contain test pyramid concept');
  });

  it('docs/91 Next.js: contains Jest or Vitest', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('Jest') || doc.includes('Vitest'), 'docs/91 Next.js must reference Jest or Vitest');
  });

  it('docs/91 Python: contains pytest', () => {
    const f = gTest(pyTestAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('pytest'), 'docs/91 Python must reference pytest');
  });

  it('docs/91 EN generation works', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('Testing Strategy') || doc.includes('Test Strategy'), 'docs/91 EN must have English title');
  });

  // ── docs/92 Coverage Design ──
  it('generates docs/92_coverage_design.md', () => {
    const f = gTest(testAnswers);
    assert.ok(f['docs/92_coverage_design.md'], 'docs/92 must be generated');
  });

  it('docs/92 contains coverage targets', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('80') || doc.includes('カバレッジ') || doc.includes('coverage') || doc.includes('Coverage'), 'docs/92 must contain coverage target');
  });

  it('docs/92 Node: references Istanbul or V8', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('Istanbul') || doc.includes('V8') || doc.includes('c8') || doc.includes('nyc'), 'docs/92 Node must reference Istanbul/V8 coverage tool');
  });

  it('docs/92 Python: references pytest-cov', () => {
    const f = gTest(pyTestAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('pytest-cov') || doc.includes('coverage.py'), 'docs/92 Python must reference pytest-cov');
  });

  // ── docs/93 E2E Test Architecture ──
  it('generates docs/93_e2e_test_architecture.md', () => {
    const f = gTest(testAnswers);
    assert.ok(f['docs/93_e2e_test_architecture.md'], 'docs/93 must be generated');
  });

  it('docs/93 contains Playwright', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.includes('Playwright'), 'docs/93 must reference Playwright');
  });

  it('docs/93 mobile: references Detox or Maestro', () => {
    const f = gTest(mobileTestAnswers);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.includes('Detox') || doc.includes('Maestro'), 'docs/93 mobile must reference Detox or Maestro');
  });

  it('docs/93 EN generation works', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.includes('E2E') || doc.includes('End-to-End'), 'docs/93 EN must have E2E reference');
  });

  // ── docs/94 Performance Testing ──
  it('generates docs/94_performance_testing.md', () => {
    const f = gTest(testAnswers);
    assert.ok(f['docs/94_performance_testing.md'], 'docs/94 must be generated');
  });

  it('docs/94 contains Core Web Vitals', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('LCP') || doc.includes('Core Web Vitals') || doc.includes('Web Vitals'), 'docs/94 must reference Core Web Vitals');
  });

  it('docs/94 Node: references k6', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('k6'), 'docs/94 Node must reference k6 load testing');
  });

  it('docs/94 Python: references Locust', () => {
    const f = gTest(pyTestAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('Locust') || doc.includes('locust'), 'docs/94 Python must reference Locust');
  });

  // ── All 4 files present ──
  it('all 4 docs/91-94 files are generated for standard preset', () => {
    const f = gTest(testAnswers);
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md'].forEach(p => {
      assert.ok(f[p], p+' must be generated');
    });
  });

  it('all 4 docs/91-94 files EN generation works', () => {
    const f = gTest(testAnswers, 'en');
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md'].forEach(p => {
      assert.ok(f[p], p+' EN '+p+' must be generated');
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 19 — Pillar ㉔ AI Safety Intelligence (docs/95-98)
   ════════════════════════════════════════════════════════════════ */

/** Run only P24 AI Safety */
function gAISafety(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar24_AISafety(answers,'QTest');
  return Object.assign({},S.files);
}

const aiAnswers = Object.assign({}, A25, {
  backend: 'Next.js (App Router) + tRPC',
  frontend: 'React / Next.js',
  ai_auto: 'マルチAIエージェント活用',
  auth: 'NextAuth.js / Auth.js',
});

const claudeAnswers = Object.assign({}, A25, {
  backend: 'Python / FastAPI',
  ai_auto: 'Claude APIを活用した自律エージェント',
  auth: 'JWT (カスタム実装)',
});

const noAIAnswers = Object.assign({}, A25, {
  backend: 'Node.js + Express',
  ai_auto: 'なし',
  auth: 'JWT (カスタム実装)',
});

describe('Suite 19: Pillar ㉔ AI Safety Intelligence', () => {

  // ── docs/95 AI Safety Framework ──
  it('generates docs/95_ai_safety_framework.md', () => {
    const f = gAISafety(aiAnswers);
    assert.ok(f['docs/95_ai_safety_framework.md'], 'docs/95 must be generated');
  });

  it('docs/95 contains risk categories table', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('Hallucination') || doc.includes('ハルシネーション'), 'docs/95 must contain hallucination risk');
  });

  it('docs/95 contains prompt injection risk', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('Prompt Injection') || doc.includes('プロンプトインジェクション'), 'docs/95 must contain prompt injection');
  });

  it('docs/95 Claude provider: contains Claude-specific config', () => {
    const f = gAISafety(claudeAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('claude') || doc.includes('Claude') || doc.includes('Anthropic'), 'docs/95 Claude must reference Claude/Anthropic');
  });

  it('docs/95 EN generation works', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('AI Safety Framework') || doc.includes('Safety'), 'docs/95 EN must have English title');
  });

  // ── docs/96 AI Guardrail Implementation ──
  it('generates docs/96_ai_guardrail_implementation.md', () => {
    const f = gAISafety(aiAnswers);
    assert.ok(f['docs/96_ai_guardrail_implementation.md'], 'docs/96 must be generated');
  });

  it('docs/96 contains 4-layer guardrail architecture', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('Layer') || doc.includes('レイヤー'), 'docs/96 must contain guardrail layers');
  });

  it('docs/96 contains input sanitization code', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('sanitize') || doc.includes('サニタイズ'), 'docs/96 must contain sanitization implementation');
  });

  it('docs/96 contains rate limiting implementation', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('ratelimit') || doc.includes('rate-limit') || doc.includes('レート制限'), 'docs/96 must contain rate limiting');
  });

  // ── docs/97 AI Model Evaluation ──
  it('generates docs/97_ai_model_evaluation.md', () => {
    const f = gAISafety(aiAnswers);
    assert.ok(f['docs/97_ai_model_evaluation.md'], 'docs/97 must be generated');
  });

  it('docs/97 contains evaluation metrics table', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('Hallucination') || doc.includes('Accuracy'), 'docs/97 must contain evaluation metrics');
  });

  it('docs/97 contains RAGAS hallucination evaluation', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('ragas') || doc.includes('RAGAS') || doc.includes('faithfulness'), 'docs/97 must contain RAGAS evaluation');
  });

  it('docs/97 EN generation works', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('Evaluation') || doc.includes('Model'), 'docs/97 EN must have English content');
  });

  // ── docs/98 Prompt Injection Defense ──
  it('generates docs/98_prompt_injection_defense.md', () => {
    const f = gAISafety(aiAnswers);
    assert.ok(f['docs/98_prompt_injection_defense.md'], 'docs/98 must be generated');
  });

  it('docs/98 contains attack patterns', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(doc.includes('Direct Injection') || doc.includes('Indirect'), 'docs/98 must contain injection attack patterns');
  });

  it('docs/98 contains defense checklist', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(doc.includes('[ ]') || doc.includes('checklist') || doc.includes('チェックリスト'), 'docs/98 must contain defense checklist');
  });

  it('docs/98 no-AI: still generates (defensive docs always needed)', () => {
    const f = gAISafety(noAIAnswers);
    assert.ok(f['docs/98_prompt_injection_defense.md'], 'docs/98 must be generated even without AI config');
  });

  // ── All 4 files present ──
  it('all 4 docs/95-98 files are generated for standard preset', () => {
    const f = gAISafety(aiAnswers);
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md'].forEach(p => {
      assert.ok(f[p], p+' must be generated');
    });
  });

  it('all 4 docs/95-98 files EN generation works', () => {
    const f = gAISafety(aiAnswers, 'en');
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md'].forEach(p => {
      assert.ok(f[p], p+' EN must be generated');
    });
  });
});

/*
   Suite 20 — Pillar ㉕ Performance Intelligence (docs/99-102)
   Tests: generate, content, stack-aware, EN
*/
function gPerf(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar25_Performance(answers,'QTest');
  return S.files;
}

const perfAnswers = {
  frontend:'React + Next.js', backend:'Node.js + NestJS',
  database:'PostgreSQL', deploy:'Vercel', orm:'Prisma',
  auth:'Supabase Auth', mobile:'なし',
};
const perfPythonAnswers = {
  frontend:'React + Next.js', backend:'Python + FastAPI',
  database:'PostgreSQL', deploy:'Railway', orm:'SQLAlchemy (Python)',
  mobile:'なし',
};
const perfCFAnswers = {
  frontend:'React + Next.js', backend:'Node.js + Hono',
  database:'Neon (PostgreSQL)', deploy:'Cloudflare Workers',
  mobile:'なし',
};

describe('Suite 20: Pillar ㉕ Performance Intelligence', () => {

  // ── docs/99 Performance Strategy ──
  it('generates docs/99_performance_strategy.md', () => {
    const f = gPerf(perfAnswers);
    assert.ok(f['docs/99_performance_strategy.md'], 'docs/99 must be generated');
  });

  it('docs/99 contains Core Web Vitals table', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('LCP') && doc.includes('INP') && doc.includes('CLS'), 'docs/99 must contain LCP/INP/CLS');
  });

  it('docs/99 Next.js: contains dynamic import optimization', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('next/dynamic') || doc.includes('Dynamic import'), 'docs/99 Next.js must contain dynamic import');
  });

  it('docs/99 contains response time targets table', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('P95') || doc.includes('P50'), 'docs/99 must contain response time targets');
  });

  // ── docs/100 Database Performance ──
  it('generates docs/100_database_performance.md', () => {
    const f = gPerf(perfAnswers);
    assert.ok(f['docs/100_database_performance.md'], 'docs/100 must be generated');
  });

  it('docs/100 contains N+1 pattern', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('N+1') || doc.includes('include'), 'docs/100 must contain N+1 fix');
  });

  it('docs/100 contains index design', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('INDEX') || doc.includes('インデックス'), 'docs/100 must contain index design');
  });

  it('docs/100 contains slow query detection', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('slow') || doc.includes('スロークエリ') || doc.includes('pg_stat'), 'docs/100 must contain slow query content');
  });

  // ── docs/101 Cache Strategy ──
  it('generates docs/101_cache_strategy.md', () => {
    const f = gPerf(perfAnswers);
    assert.ok(f['docs/101_cache_strategy.md'], 'docs/101 must be generated');
  });

  it('docs/101 contains Redis/Upstash implementation', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.includes('Redis') || doc.includes('Upstash'), 'docs/101 must contain Redis/Upstash cache');
  });

  it('docs/101 Vercel: contains Vercel edge cache config', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.includes('Vercel') || doc.includes('Cache-Control'), 'docs/101 Vercel must contain edge cache');
  });

  // ── docs/102 Performance Monitoring ──
  it('generates docs/102_performance_monitoring.md', () => {
    const f = gPerf(perfAnswers);
    assert.ok(f['docs/102_performance_monitoring.md'], 'docs/102 must be generated');
  });

  it('docs/102 contains Lighthouse CI configuration', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.includes('lighthouserc') || doc.includes('Lighthouse'), 'docs/102 must contain Lighthouse CI config');
  });

  it('docs/102 contains performance budget table', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.includes('Budget') || doc.includes('バジェット') || doc.includes('bundle'), 'docs/102 must contain budget info');
  });

  // ── All 4 files + EN ──
  it('all 4 docs/99-102 files generated', () => {
    const f = gPerf(perfAnswers);
    ['docs/99_performance_strategy.md','docs/100_database_performance.md',
     'docs/101_cache_strategy.md','docs/102_performance_monitoring.md'].forEach(p => {
      assert.ok(f[p], p+' must be generated');
    });
  });

  it('all 4 docs/99-102 EN generation works', () => {
    const f = gPerf(perfAnswers, 'en');
    ['docs/99_performance_strategy.md','docs/100_database_performance.md',
     'docs/101_cache_strategy.md','docs/102_performance_monitoring.md'].forEach(p => {
      assert.ok(f[p], p+' EN must be generated');
    });
  });
});
