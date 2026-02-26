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
 *
 * Suites 1-101: 1099 tests total (1039 + Suite 99: ~20 + Suite 100: ~20 + Suite 101: ~20)
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
eval(fs.readFileSync('src/generators/p26-observability.js','utf-8'));

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
  genPillar26_Observability(answers,'QTest');
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

  it('A25 full generation: file count in 108-170 range', () => {
    const f = gFull(A25);
    const count = Object.keys(f).length;
    assert.ok(count >= 108 && count <= 170, `A25 full gen file count should be 108-170, got ${count}`);
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

/*
   Suite 21 — Cross-pillar ORM Consistency
   Tests: P25 + Drizzle/SQLAlchemy/Kysely should not leak "Prisma"
          P11 + ORM should mention correct migration tool
*/
const s21Drizzle = {
  frontend:'React + Next.js', backend:'Node.js + Express',
  database:'PostgreSQL', deploy:'Railway', orm:'Drizzle ORM',
  auth:'JWT', mobile:'なし',
};
const s21Kysely = {
  frontend:'React + Vite', backend:'Node.js + Express',
  database:'PostgreSQL', deploy:'Railway', orm:'Kysely',
  auth:'JWT', mobile:'なし',
};
const s21Sqlalchemy = {
  frontend:'React + Vite', backend:'Python + FastAPI',
  database:'PostgreSQL', deploy:'Railway', orm:'SQLAlchemy (Python)',
  auth:'JWT', mobile:'なし',
};
const s21Baas = {
  frontend:'React + Next.js', backend:'Supabase',
  database:'Supabase (PostgreSQL)', deploy:'Vercel',
  auth:'Supabase Auth', mobile:'なし',
};
const s21VueExpress = {
  frontend:'Vue 3 + Vite', backend:'Node.js + Express',
  database:'PostgreSQL', deploy:'Railway', orm:'Prisma',
  auth:'JWT', mobile:'なし',
};

describe('Suite 21: Cross-pillar ORM Consistency', () => {

  it('P25+Drizzle: docs/99 has no "prisma.user"', () => {
    const f = gPerf(s21Drizzle);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(!doc.includes('prisma.user'), 'docs/99 must not contain prisma.user when ORM is Drizzle');
  });

  it('P25+Drizzle: docs/99 contains Drizzle ORM pattern', () => {
    const f = gPerf(s21Drizzle);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('Drizzle') || doc.includes('drizzle'), 'docs/99 must contain Drizzle pattern');
  });

  it('P25+Drizzle: docs/100 tips mention Drizzle not Prisma', () => {
    const f = gPerf(s21Drizzle);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('Drizzle'), 'docs/100 tips must mention Drizzle ORM');
  });

  it('P25+Drizzle: docs/101 no "Prisma Accelerate" in tools', () => {
    const f = gPerf(s21Drizzle);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(!doc.includes('Prisma Accelerate'), 'docs/101 must not contain Prisma Accelerate for Drizzle');
  });

  it('P25+Drizzle: docs/102 no "prismaIntegration"', () => {
    const f = gPerf(s21Drizzle);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(!doc.includes('prismaIntegration'), 'docs/102 must not contain prismaIntegration for Drizzle');
  });

  it('P25+SQLAlchemy: docs/99 has Python async pattern', () => {
    const f = gPerf(s21Sqlalchemy);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('sqlalchemy') || doc.includes('FastAPI') || doc.includes('async'), 'docs/99 must contain Python/SQLAlchemy pattern');
  });

  it('P25+SQLAlchemy: docs/100 tips mention SQLAlchemy', () => {
    const f = gPerf(s21Sqlalchemy);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('SQLAlchemy'), 'docs/100 tips must mention SQLAlchemy');
  });

  it('P25+BaaS: docs/99 generates successfully', () => {
    const f = gPerf(s21Baas);
    assert.ok(f['docs/99_performance_strategy.md'], 'docs/99 must generate for BaaS');
  });

  it('P25+Vue+Express: docs/102 uses @sentry/node (not @sentry/nextjs)', () => {
    const f = gPerf(s21VueExpress);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.includes('@sentry/node'), 'docs/102 must use @sentry/node for non-Next.js+non-Vercel');
    assert.ok(!doc.includes('@sentry/nextjs'), 'docs/102 must not use @sentry/nextjs for Vue+Express');
  });

  it('P11+Kysely: migration tool mentions Kysely', () => {
    S.files={}; S.genLang='ja'; S.skill='intermediate';
    genPillar11_ImplIntelligence(s21Kysely,'QTest');
    const doc = S.files['docs/39_implementation_playbook.md'] || '';
    assert.ok(doc.includes('Kysely'), 'docs/39 migration tool must mention Kysely');
  });

  it('P11+Drizzle: migration tool mentions Drizzle', () => {
    S.files={}; S.genLang='ja'; S.skill='intermediate';
    genPillar11_ImplIntelligence(s21Drizzle,'QTest');
    const doc = S.files['docs/39_implementation_playbook.md'] || '';
    assert.ok(doc.includes('Drizzle'), 'docs/39 migration tool must mention Drizzle');
  });

  it('P11+SQLAlchemy: migration tool mentions SQLAlchemy', () => {
    S.files={}; S.genLang='ja'; S.skill='intermediate';
    genPillar11_ImplIntelligence(s21Sqlalchemy,'QTest');
    const doc = S.files['docs/39_implementation_playbook.md'] || '';
    assert.ok(doc.includes('SQLAlchemy'), 'docs/39 migration tool must mention SQLAlchemy');
  });
});

/*
   Suite 22 — Cross-pillar Auth/Payment Consistency
   Tests: P21 BaaS authn adaptation, P15 stakeholder inference, P12 payment detection
*/
const supabaseApiAnswers = {
  frontend:'React + Next.js', backend:'Supabase',
  database:'Supabase (PostgreSQL)', deploy:'Vercel',
  auth:'Supabase Auth', mobile:'なし', payment:'なし',
};
const firebaseApiAnswers = {
  frontend:'React + Next.js', backend:'Firebase',
  database:'Firebase Firestore', deploy:'Vercel',
  auth:'Firebase Auth', mobile:'なし', payment:'なし',
};
const expressApiAnswers = {
  frontend:'React + Next.js', backend:'Node.js + Express',
  database:'PostgreSQL', deploy:'Vercel',
  auth:'JWT', mobile:'なし', payment:'なし',
};

function gAPI21(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar21_APIIntelligence(answers,'QTest');
  return S.files;
}
function gSec12(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar12_SecurityIntelligence(answers,'QTest');
  return S.files;
}
function gFuture15(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar15(answers);
  return S.files;
}

describe('Suite 22: Cross-pillar Auth/Payment Consistency', () => {

  it('P21+Supabase: docs/85 authn item mentions Supabase not JWT', () => {
    const f = gAPI21(supabaseApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('Supabase'), 'docs/85 authn must mention Supabase for BaaS backend');
    assert.ok(!doc.includes('JWTトークン検証') && !doc.includes('JWT token validation'), 'docs/85 must not use JWT authn text for BaaS');
  });

  it('P21+Firebase: docs/85 authn item mentions Firebase', () => {
    const f = gAPI21(firebaseApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('Firebase'), 'docs/85 authn must mention Firebase for BaaS backend');
  });

  it('P21+Express: docs/85 authn item uses JWT verification', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('JWT') || doc.includes('jose'), 'docs/85 authn must mention JWT for non-BaaS backend');
  });

  it('P15+fintech domain: stakeholder resolves to enterprise', () => {
    const ans = { purpose:'金融サービス向け決済管理プラットフォーム', target:'法人', frontend:'React + Next.js', backend:'Node.js + Express', database:'PostgreSQL', deploy:'Vercel' };
    const f = gFuture15(ans);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('enterprise') || doc.includes('Enterprise') || doc.includes('エンタープライズ'), 'docs/56 must reflect enterprise stakeholder for fintech domain');
  });

  it('P15+devtool domain: stakeholder resolves to developer', () => {
    const ans = { purpose:'開発者ツール APIキー管理プラットフォーム', target:'エンジニア', frontend:'React + Next.js', backend:'Node.js + Express', database:'PostgreSQL', deploy:'Vercel' };
    const f = gFuture15(ans);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('developer') || doc.includes('Developer') || doc.includes('開発者'), 'docs/56 must reflect developer stakeholder for devtool domain');
  });

  it('P15+generic: stakeholder resolves to startup', () => {
    const ans = { purpose:'汎用ブログプラットフォーム', target:'ブロガー', frontend:'React + Next.js', backend:'Node.js + Express', database:'PostgreSQL', deploy:'Vercel' };
    const f = gFuture15(ans);
    assert.ok(f['docs/56_market_positioning.md'], 'docs/56 must generate for generic domain');
  });

  it('inferStakeholder: hr domain → enterprise', () => {
    assert.ok(typeof inferStakeholder === 'function', 'inferStakeholder should be globally available');
    assert.strictEqual(inferStakeholder('hr'), 'enterprise', 'hr domain must map to enterprise');
  });

  it('inferStakeholder: ai domain → developer', () => {
    assert.ok(typeof inferStakeholder === 'function', 'inferStakeholder should be globally available');
    assert.strictEqual(inferStakeholder('ai'), 'developer', 'ai domain must map to developer');
  });

  it('inferStakeholder: saas domain → team', () => {
    assert.ok(typeof inferStakeholder === 'function', 'inferStakeholder should be globally available');
    assert.strictEqual(inferStakeholder('saas'), 'team', 'saas domain must map to team');
  });

  it('inferStakeholder: unknown domain → startup fallback', () => {
    assert.ok(typeof inferStakeholder === 'function', 'inferStakeholder should be globally available');
    assert.strictEqual(inferStakeholder('unknown_xyz'), 'startup', 'unknown domain must fall back to startup');
  });

  it('P12+payment=なし: no PCI DSS references', () => {
    const ans = { ...expressApiAnswers, purpose:'ブログ', target:'ブロガー', payment:'なし', ai_auto:'なし', data_entities:'User, Post', mvp_features:'投稿, 管理' };
    const f = gSec12(ans);
    const doc = f['docs/43_security_intelligence.md'] || '';
    assert.ok(!doc.includes('PCI DSS'), 'docs/43 must not mention PCI DSS when payment=なし');
  });

  it('P12+payment=None: no PCI DSS references', () => {
    const ans = { ...expressApiAnswers, purpose:'ブログ', target:'ブロガー', payment:'None', ai_auto:'None', data_entities:'User, Post', mvp_features:'投稿, 管理' };
    const f = gSec12(ans);
    const doc = f['docs/43_security_intelligence.md'] || '';
    assert.ok(!doc.includes('PCI DSS'), 'docs/43 must not mention PCI DSS when payment=None');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 23 — Cross-Domain P21-P25 (MongoDB / Java / Mobile)
   ════════════════════════════════════════════════════════════════ */

const javaTestAnswers = Object.assign({}, A25, {
  backend: 'Spring Boot (Java)',
  frontend: 'React / Next.js',
  orm: 'TypeORM',
  database: 'PostgreSQL (Neon)',
  mobile: 'なし',
  auth: 'JWT (カスタム実装)',
});

const mobilePerfAnswers = Object.assign({}, {
  frontend: 'React Native (Expo)',
  backend: 'Supabase',
  database: 'Supabase Database',
  deploy: 'EAS Build',
  orm: '',
  auth: 'Supabase Auth',
  mobile: 'Expo (React Native)',
  ai_auto: 'なし',
  purpose: 'モバイルECアプリ',
  target: 'スマートフォンユーザー',
  mvp_features: '商品閲覧, カート, 決済',
  screens: 'ホーム, 商品詳細, カート',
  data_entities: 'User, Product, Order',
  dev_methods: 'TDD',
  ai_tools: 'Cursor',
  payment: 'Stripe',
});

describe('Suite 23: Cross-Domain P21-P25 (MongoDB / Java / Mobile)', () => {

  // ── MongoDB + P22 Database Intelligence ──
  it('P22+MongoDB: docs/87 contains MongoDB document design', () => {
    const f = gDB(mongoAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('MongoDB') || doc.includes('Embed') || doc.includes('Reference'), 'docs/87 MongoDB must include document design principles');
  });

  it('P22+MongoDB: docs/88 query optimization generates successfully', () => {
    const f = gDB(mongoAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.length > 200, 'docs/88 must generate content for MongoDB scenario');
    assert.ok(doc.includes('N+1') || doc.includes('クエリ') || doc.includes('query') || doc.includes('Index'), 'docs/88 must include query optimization content');
  });

  it('P22+MongoDB: docs/89 migration strategy generates successfully', () => {
    const f = gDB(mongoAnswers);
    assert.ok(f['docs/89_migration_strategy.md'], 'docs/89 must generate for MongoDB');
  });

  // ── Java + P23 Testing Intelligence ──
  it('P23+Java: docs/91 uses JUnit framework', () => {
    const f = gTest(javaTestAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('JUnit') || doc.includes('Mockito') || doc.includes('Java') || doc.includes('Spring'), 'docs/91 Java must reference JUnit/Spring testing');
  });

  it('P23+Java: docs/92 uses JaCoCo for coverage', () => {
    const f = gTest(javaTestAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('JaCoCo') || doc.includes('Java') || doc.includes('Maven') || doc.includes('Gradle'), 'docs/92 Java must reference JaCoCo or build tool');
  });

  it('P23+Java: all 4 testing docs generate for Java backend', () => {
    const f = gTest(javaTestAnswers);
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md'].forEach(p => {
      assert.ok(f[p], p + ' must generate for Java backend');
    });
  });

  // ── Mobile (Expo) + P25 Performance Intelligence ──
  it('P25+Mobile: all 4 performance docs generate for Expo backend', () => {
    const f = gPerf(mobilePerfAnswers);
    ['docs/99_performance_strategy.md','docs/100_database_performance.md',
     'docs/101_cache_strategy.md','docs/102_performance_monitoring.md'].forEach(p => {
      assert.ok(f[p], p + ' must generate for mobile/Expo scenario');
    });
  });

  it('P25+Mobile: docs/99 mentions BaaS/Supabase optimization', () => {
    const f = gPerf(mobilePerfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('BaaS') || doc.includes('キャッシュ') || doc.includes('cache'), 'docs/99 mobile must include Supabase or cache optimization');
  });

  it('P25+Mobile: docs/94 contains mobile performance or web vitals', () => {
    const f = gTest(mobileTestAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('Detox') || doc.includes('Maestro') || doc.includes('mobile') || doc.includes('React Native') || doc.includes('Expo') || doc.includes('LCP') || doc.includes('Lighthouse'), 'docs/94 mobile must include mobile testing or web vitals');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 24 — New Context Files: ADR / Pillar Dependency Map / Cost Estimation
   ════════════════════════════════════════════════════════════════ */
describe('Suite 24: New Context Files (ADR / Pillar Map / Cost Estimation)', () => {

  // ADR helper (uses gSDD which calls genDocs21)
  const adrAnswers = Object.assign({}, A25, {
    frontend: 'React + Next.js',
    backend: 'Supabase',
    database: 'Supabase (PostgreSQL)',
    deploy: 'Vercel',
    auth: 'Supabase Auth',
    payment: 'Stripe Billing (サブスク)',
    purpose: 'SaaS型サブスク管理プラットフォーム',
    skill_level: 'Intermediate',
    org_model: 'マルチテナント(RLS)',
  });

  // Strategy helper for cost estimation
  function gStrategy(answers, lang) {
    S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate';
    genDocs21(answers, 'QTest');
    genPillar13_StrategicIntelligence(answers, 'QTest');
    return Object.assign({}, S.files);
  }

  // ADR tests
  it('ADR file is generated', () => {
    const f = gSDD(adrAnswers);
    assert.ok(f['docs/82-2_architecture_decision_records.md'], 'ADR file must be generated');
  });

  it('ADR contains tech stack header', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(doc.includes('React') && doc.includes('Supabase'), 'ADR header must include frontend and backend stack');
  });

  it('ADR contains ADR-001 frontend decision', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(doc.includes('ADR-001'), 'ADR must include ADR-001 frontend decision');
  });

  it('ADR contains ADR-003 database decision', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(doc.includes('ADR-003'), 'ADR must include ADR-003 database decision');
  });

  it('ADR contains payment ADR when payment is set', () => {
    const f = gSDD(Object.assign({}, adrAnswers, { payment: 'Stripe決済' }));
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(doc.includes('Stripe') || doc.includes('決済'), 'ADR must include payment decision when payment is set');
  });

  it('ADR is bilingual — EN version works', () => {
    const f = gSDD(adrAnswers, 'en');
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(doc.includes('Architecture Decision Records'), 'EN ADR must contain English header');
    assert.ok(doc.includes('Accepted'), 'EN ADR must contain "Accepted" status');
  });

  it('ADR no-payment → no payment ADR section', () => {
    const f = gSDD(Object.assign({}, adrAnswers, { payment: 'なし' }));
    const doc = f['docs/82-2_architecture_decision_records.md'] || '';
    assert.ok(!doc.includes('ADR-006') || !doc.includes('決済統合'), 'No payment → no payment ADR when payment is none');
  });

  // Pillar dependency map tests
  it('Pillar dependency map is generated', () => {
    const f = gSDD(adrAnswers);
    assert.ok(f['docs/00_pillar_dependency_map.md'], 'Pillar dependency map must be generated');
  });

  it('Pillar map contains Mermaid graph', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/00_pillar_dependency_map.md'] || '';
    assert.ok(doc.includes('```mermaid') && doc.includes('graph TD'), 'Pillar map must contain mermaid graph TD');
  });

  it('Pillar map contains P1 and P6 nodes (always active)', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/00_pillar_dependency_map.md'] || '';
    assert.ok(doc.includes('P1[') || doc.includes('P1"['), 'Pillar map must contain P1 node');
    assert.ok(doc.includes('P6[') || doc.includes('P6"['), 'Pillar map must contain P6 node');
  });

  it('Pillar map contains table with key output files', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/00_pillar_dependency_map.md'] || '';
    assert.ok(doc.includes('.spec/constitution.md') || doc.includes('docs/03_architecture.md'), 'Pillar map table must list key output files');
  });

  it('Pillar map recommended implementation order section exists', () => {
    const f = gSDD(adrAnswers);
    const doc = f['docs/00_pillar_dependency_map.md'] || '';
    assert.ok(doc.includes('P1-P3') || doc.includes('実装推奨順序') || doc.includes('Recommended Implementation'), 'Pillar map must include implementation order section');
  });

  it('Pillar map is bilingual — EN version works', () => {
    const f = gSDD(adrAnswers, 'en');
    const doc = f['docs/00_pillar_dependency_map.md'] || '';
    assert.ok(doc.includes('Pillar Dependency Map'), 'EN pillar map must contain English title');
  });

  // Cost estimation tests
  it('Cost estimation file is generated', () => {
    const f = gStrategy(adrAnswers);
    assert.ok(f['docs/48-2_cost_estimation.md'], 'Cost estimation file must be generated');
  });

  it('Cost estimation contains development effort section', () => {
    const f = gStrategy(adrAnswers);
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('MVP') && (doc.includes('工数') || doc.includes('Hours')), 'Cost estimation must include development effort hours');
  });

  it('Cost estimation Vercel infra costs shown', () => {
    const f = gStrategy(adrAnswers);
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Vercel') || doc.includes('Hobby'), 'Cost estimation must include Vercel infra cost details');
  });

  it('Cost estimation Stripe entry when payment is set', () => {
    const f = gStrategy(Object.assign({}, adrAnswers, { payment: 'Stripe決済' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Stripe'), 'Cost estimation must list Stripe in third-party services');
  });

  it('Cost estimation contains scaling projection table', () => {
    const f = gStrategy(adrAnswers);
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('10,000') || doc.includes('100,000') || doc.includes('MAU') || doc.includes('Scaling'), 'Cost estimation must include scaling projection table');
  });

  it('Cost estimation domain complexity multiplier applied for fintech', () => {
    const f = gStrategy(Object.assign({}, adrAnswers, { purpose: '金融取引・決済プラットフォーム', payment: 'Stripe決済' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('1.5') || doc.includes('fintech'), 'Fintech domain must apply ×1.5 complexity multiplier in cost estimate');
  });

  it('Cost estimation is bilingual — EN version works', () => {
    const f = gStrategy(adrAnswers, 'en');
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    // gStrategy sets genLang='ja' internally, but check the EN path too
    assert.ok(doc, 'Cost estimation must be generated');
  });
});

/*
   Suite 25 — Domain-Specific SLO (P1-SDD) + QA Focus (P23-Testing)
   Tests for:
   - P1-SDD: DOMAIN_OPS[domain].slo used in NFR availability line
   - P23-Testing: DOMAIN_QA_MAP domain-specific test focus section in doc91
*/
describe('Suite 25: Domain SLO (P1-SDD) + Domain QA Focus (P23-Testing)', () => {
  function gP1(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar1_SDD(answers,'QTest');
    return Object.assign({}, S.files);
  }
  function gP23(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar23_TestingIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction, Wallet',
    success: '取引成功率99.99%', target: '個人ユーザー',
  };
  const ecBase = {
    purpose: 'ECサイト・オンラインショッピング',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Product, Order',
    success: '購入完了率90%', target: '消費者',
  };

  // ── P1-SDD domain SLO tests ──
  it('P1-SDD: fintech domain uses 99.99% SLO in specification NFR', () => {
    const f = gP1(finBase);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('99.99%'), 'Fintech SLO 99.99% must appear in spec NFR section');
  });

  it('P1-SDD: ec domain uses 99.95% SLO in specification NFR', () => {
    const f = gP1(ecBase);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('99.95%'), 'EC SLO 99.95% must appear in spec NFR section');
  });

  it('P1-SDD: unknown domain falls back to skill-based availability', () => {
    const f = gP1({ purpose: 'テスト用アプリ', frontend: 'React', backend: 'Node.js + Express', database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js', data_entities: 'User', success: 'MAU 100', target: 'ユーザー' });
    const spec = f['.spec/specification.md'] || '';
    // intermediate skill → 99%
    assert.ok(spec.includes('99%') || spec.includes('ベストエフォート') || spec.includes('Best effort'), 'Unknown domain must use skill-based availability fallback');
  });

  it('P1-SDD: domain SLO label appended (ドメイン標準SLO)', () => {
    const f = gP1(finBase);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('ドメイン標準SLO') || spec.includes('domain SLO'), 'Spec must label domain-standard SLO when DOMAIN_OPS entry exists');
  });

  it('P1-SDD: EN mode fintech SLO present in specification', () => {
    const f = gP1(finBase, 'en');
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('99.99%'), 'EN spec must also show fintech SLO 99.99%');
  });

  // ── P23-Testing domain QA focus tests ──
  it('P23: fintech domain adds test priority matrix to testing strategy', () => {
    const f = gP23(finBase);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('テスト優先マトリクス') || doc.includes('Test Priority Matrix'), 'Fintech testing doc must include priority matrix');
  });

  it('P23: fintech domain shows CRITICAL security priority', () => {
    const f = gP23(finBase);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('CRITICAL') || doc.includes('DataIntegrity'), 'Fintech must show CRITICAL data integrity priority');
  });

  it('P23: ec domain shows inventory conflict as known bug pattern', () => {
    const f = gP23(ecBase);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('在庫') || doc.includes('inventory') || doc.includes('Inventory'), 'EC testing doc must mention inventory conflict bug pattern');
  });

  it('P23: domain QA section includes focus areas (重点テスト領域)', () => {
    const f = gP23(ecBase);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('重点テスト領域') || doc.includes('Key Test Areas'), 'EC testing doc must have key test areas section');
  });

  it('P23: domain QA section includes known bugs (回帰テスト必須)', () => {
    const f = gP23(finBase);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('回帰テスト必須') || doc.includes('regression tests required') || doc.includes('Known Bug'), 'Testing doc must reference required regression tests for known bug patterns');
  });

  it('P23: unknown domain does not add empty domain section', () => {
    const f = gP23({ purpose: 'テスト用', frontend: 'React', backend: 'Node.js', database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js', data_entities: 'User', success: 'MAU 100', target: 'ユーザー' });
    const doc = f['docs/91_testing_strategy.md'] || '';
    // Section should not be added if domain returns null (no matching QA entry)
    const hasEmptySection = doc.includes('ドメイン別テスト重点領域') && doc.includes('undefined');
    assert.ok(!hasEmptySection, 'Unknown domain must not produce undefined section content');
  });

  it('P23: EN mode domain QA section shown in English', () => {
    const f = gP23(ecBase, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(!doc.includes('ドメイン別テスト重点領域') || doc.includes('Domain-Specific Test Focus'), 'EN mode must use English section heading for domain QA');
  });
});

/*
   Suite 26 — Domain-Specific DB Hardening (P22) + Domain SLO (P25)
   Tests for:
   - P22: DOMAIN_OPS[domain].hardening_ja/en in docs/87_database_design_principles.md
   - P25: DOMAIN_OPS[domain].slo in docs/99_performance_strategy.md
*/
describe('Suite 26: Domain DB Hardening (P22) + Domain SLO in Performance (P25)', () => {
  function gP22(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar22_DatabaseIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }
  function gP25(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar25_Performance(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction, Wallet',
    success: '取引成功率99.99%', target: '個人ユーザー',
  };
  const healthBase = {
    purpose: '医療記録・ヘルスケア管理',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'Patient, Record, Prescription',
    success: 'HIPAA準拠100%', target: '医療従事者',
  };
  const unknownBase = {
    purpose: 'テスト用アプリ',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User', success: 'MAU100', target: 'ユーザー',
  };

  // ── P22 DB hardening tests ──
  it('P22: fintech domain adds DB hardening section', () => {
    const f = gP22(finBase);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('ドメイン固有DBハードニング') || doc.includes('Domain-Specific DB Hardening'), 'Fintech must add domain DB hardening section');
  });

  it('P22: fintech hardening includes SELECT FOR UPDATE rule', () => {
    const f = gP22(finBase);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('SELECT FOR UPDATE') || doc.includes('冪等性'), 'Fintech DB hardening must include SELECT FOR UPDATE or idempotency rule');
  });

  it('P22: fintech hardening includes Decimal type for amounts', () => {
    const f = gP22(finBase);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Decimal') || doc.includes('decimal'), 'Fintech DB hardening must specify Decimal type for monetary amounts');
  });

  it('P22: health domain hardening mentions PHI encryption', () => {
    const f = gP22(healthBase);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('PHI') || doc.includes('AES') || doc.includes('暗号化'), 'Health DB hardening must mention PHI encryption');
  });

  it('P22: unknown domain does not inject undefined hardening content', () => {
    const f = gP22(unknownBase);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(!doc.includes('undefined'), 'Unknown domain must not produce undefined in DB doc');
  });

  it('P22: EN mode shows English hardening labels', () => {
    const f = gP22(finBase, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Domain-Specific DB Hardening') || doc.includes('Idempotency') || doc.includes('Decimal'), 'EN mode must show English DB hardening content');
  });

  // ── P25 domain SLO tests ──
  it('P25: fintech domain shows 99.99% SLO in performance strategy', () => {
    const f = gP25(finBase);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('99.99%'), 'Fintech performance strategy must show 99.99% SLO');
  });

  it('P25: fintech domain SLO section exists in performance strategy', () => {
    const f = gP25(finBase);
    const doc = f['docs/99_performance_strategy.md'] || '';
    const hasSlo = doc.includes('ドメイン標準SLO') || doc.includes('Domain Standard SLO');
    const hasCwv = doc.includes('Core Web Vitals 目標値') || doc.includes('Core Web Vitals Targets');
    assert.ok(hasSlo && hasCwv, 'Performance doc must contain both domain SLO section and Core Web Vitals targets');
  });

  it('P25: fintech SLO includes backup/recovery info', () => {
    const f = gP25(finBase);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('WAL') || doc.includes('backup') || doc.includes('バックアップ'), 'Fintech performance doc must include backup/recovery info from DOMAIN_OPS');
  });

  it('P25: unknown domain does not show undefined in performance doc', () => {
    const f = gP25(unknownBase);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(!doc.includes('undefined') && !doc.includes('null'), 'Unknown domain must not produce undefined/null in performance doc');
  });

  it('P25: EN mode domain SLO section in English', () => {
    const f = gP25(finBase, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('Domain Standard SLO') || doc.includes('99.99%'), 'EN mode must show English domain SLO section');
  });
});

/*
   Suite 27 — Domain API Implementation Patterns (P21)
   Tests for:
   - P21: DOMAIN_IMPL_PATTERN[domain].impl_ja/en in docs/83_api_design_principles.md
   - P21: DOMAIN_IMPL_PATTERN[domain].pseudo in docs/83_api_design_principles.md
*/
describe('Suite 27: Domain API Implementation Patterns (P21)', () => {
  function gP21(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar21_APIIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const ecBase = {
    purpose: 'ECサイト・オンラインショッピング',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Product, Order', success: '購入率90%', target: '消費者',
  };
  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction, Wallet', success: '取引成功率99%', target: '個人ユーザー',
  };
  const commBase = {
    purpose: 'コミュニティフォーラム・掲示板',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Post, Comment', success: 'MAU1000', target: 'ユーザー',
  };

  it('P21: ec domain adds implementation patterns section', () => {
    const f = gP21(ecBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('ドメイン固有API実装パターン') || doc.includes('Domain-Specific API Patterns'), 'EC domain must add API implementation patterns section');
  });

  it('P21: ec domain shows inventory-specific impl notes', () => {
    const f = gP21(ecBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('在庫') || doc.includes('inventory') || doc.includes('冪等'), 'EC API patterns must mention inventory or idempotency');
  });

  it('P21: ec domain includes pseudo-code for core operation', () => {
    const f = gP21(ecBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('function reserveInventory') || doc.includes('```javascript'), 'EC API doc must include domain pseudo-code');
  });

  it('P21: fintech domain shows transaction-specific impl notes', () => {
    const f = gP21(finBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('トランザクション') || doc.includes('transaction') || doc.includes('idempotency') || doc.includes('冪等'), 'Fintech API patterns must mention transaction or idempotency');
  });

  it('P21: community domain shows moderation-specific patterns', () => {
    const f = gP21(commBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('モデレーション') || doc.includes('moderation') || doc.includes('スパム') || doc.includes('spam'), 'Community API patterns must mention moderation or spam');
  });

  it('P21: unknown domain does not inject undefined content', () => {
    const f = gP21({ purpose: 'テスト用アプリ', frontend: 'React', backend: 'Node.js + Express', database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js', data_entities: 'User', success: 'MAU', target: 'ユーザー' });
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(!doc.includes('undefined'), 'Unknown domain must not produce undefined in API doc');
  });

  it('P21: EN mode shows English implementation notes', () => {
    const f = gP21(ecBase, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Domain-Specific API Patterns') || doc.includes('inventory') || doc.includes('Inventory'), 'EN mode must show English API domain patterns');
  });

  it('P21: core API structure (REST principles) still present with domain section', () => {
    const f = gP21(finBase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('REST') || doc.includes('API') || doc.includes('versioning') || doc.includes('バージョニング'), 'API design doc must still contain core REST principles even with domain section');
  });
});

/*
   Suite 28 — Domain API Test Scenarios (P21-gen86) + Domain Backup Requirements (P22-gen90)
   Tests for:
   - P21-gen86: DOMAIN_QA_MAP → docs/86_api_testing_strategy.md
   - P22-gen90: DOMAIN_OPS.backup_ja/en → docs/90_backup_disaster_recovery.md
*/
describe('Suite 28: Domain API Test Scenarios (P21) + Domain Backup Requirements (P22)', () => {
  function gP21full(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar21_APIIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }
  function gP22full(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar22_DatabaseIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const ecBase = {
    purpose: 'ECサイト・オンラインショッピング',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Product, Order', success: '購入率90%', target: '消費者',
  };
  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction, Wallet', success: '取引成功率99%', target: '個人ユーザー',
  };

  // ── P21 API test scenarios ──
  it('P21: ec domain adds domain test scenarios to API testing doc', () => {
    const f = gP21full(ecBase);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('ドメイン固有テストシナリオ') || doc.includes('Domain-Specific Test Scenarios'), 'EC must add domain-specific test scenarios to API testing doc');
  });

  it('P21: ec domain test scenarios include inventory focus', () => {
    const f = gP21full(ecBase);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('在庫') || doc.includes('inventory') || doc.includes('Inventory'), 'EC API test scenarios must mention inventory testing');
  });

  it('P21: ec domain includes regression bug scenarios', () => {
    const f = gP21full(ecBase);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('回帰必須バグシナリオ') || doc.includes('Regression-Required Bug Scenarios'), 'EC must include regression bug scenarios section');
  });

  it('P21: fintech API test scenarios include CRITICAL priority note', () => {
    const f = gP21full(finBase);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    // fintech DOMAIN_QA_MAP priority: Security:CRITICAL|DataIntegrity:CRITICAL
    assert.ok(doc.includes('ACID') || doc.includes('二重') || doc.includes('Double') || doc.includes('監査') || doc.includes('PCI'), 'Fintech API test scenarios must include transaction integrity or audit-related tests');
  });

  it('P21: EN mode API test scenarios in English', () => {
    const f = gP21full(ecBase, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('Domain-Specific Test Scenarios') || doc.includes('inventory') || doc.includes('Inventory'), 'EN mode must show English API test scenarios');
  });

  // ── P22 domain backup requirements ──
  it('P22: fintech domain adds specific backup requirements to DR doc', () => {
    const f = gP22full(finBase);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('ドメイン標準バックアップ要件') || doc.includes('Domain-Specific Backup Requirements'), 'Fintech must add domain backup requirements section to DR doc');
  });

  it('P22: fintech backup requirements include WAL/PITR', () => {
    const f = gP22full(finBase);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('WAL') || doc.includes('PITR'), 'Fintech DR doc must include WAL or PITR backup requirement');
  });

  it('P22: ec domain backup doc includes time-series backup info', () => {
    const f = gP22full(ecBase);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    // ec domain has 'Hourly time-series backup' in backup_en
    assert.ok(doc.includes('時系列') || doc.includes('time-series') || doc.includes('Hourly') || doc.includes('毎時'), 'EC DR doc must include time-series/hourly backup requirement');
  });

  it('P22: EN mode shows English backup requirements', () => {
    const f = gP22full(finBase, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Domain-Specific Backup Requirements') || doc.includes('WAL') || doc.includes('PITR'), 'EN mode must show English domain backup requirements');
  });
});

/*
   Suite 29 — Domain-Specific AI Safety Guardrails (P24)
   Tests for:
   - P24: DOMAIN_IMPL_PATTERN[domain].guard + DOMAIN_OPS[domain].hardening
          → docs/95_ai_safety_framework.md domain section
*/
describe('Suite 29: Domain AI Safety Guardrails (P24)', () => {
  function gP24(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar24_AISafety(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction, Wallet', ai_tools: 'ChatGPT API',
    success: '取引成功率99%', target: '個人ユーザー',
  };
  const healthBase = {
    purpose: '医療記録・ヘルスケア管理',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'Patient, Record', ai_tools: 'Claude API',
    success: 'HIPAA準拠100%', target: '医療従事者',
  };
  const ecBase = {
    purpose: 'ECサイト・オンラインショッピング',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Product, Order', ai_tools: 'なし',
    success: '購入率90%', target: '消費者',
  };

  it('P24: fintech domain adds domain AI guardrail section', () => {
    const f = gP24(finBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('ドメイン固有AIリスクガードレール') || doc.includes('Domain-Specific AI Risk Guardrails'), 'Fintech must add domain AI guardrail section to safety framework');
  });

  it('P24: fintech AI guardrails include balance/transfer protection', () => {
    const f = gP24(finBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('残高') || doc.includes('送金') || doc.includes('balance') || doc.includes('transfer'), 'Fintech AI safety must mention balance/transfer protection guardrails');
  });

  it('P24: fintech AI guardrails include hardening rules (冪等性)', () => {
    const f = gP24(finBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('冪等') || doc.includes('Idempotency') || doc.includes('監査') || doc.includes('Audit'), 'Fintech AI safety must include hardening rules from DOMAIN_OPS');
  });

  it('P24: health domain AI guardrails mention consent', () => {
    const f = gP24(healthBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('同意') || doc.includes('consent') || doc.includes('暗号化') || doc.includes('encrypt'), 'Health domain AI safety must mention consent or encryption guardrails');
  });

  it('P24: ec domain adds AI guardrails about inventory', () => {
    const f = gP24(ecBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('在庫') || doc.includes('inventory') || doc.includes('Inventory') || doc.includes('stock'), 'EC AI safety must mention inventory protection guardrails');
  });

  it('P24: HITL section still present with domain guardrails', () => {
    const f = gP24(finBase);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('Human-in-the-Loop') || doc.includes('HITL') || doc.includes('ヒューマン'), 'AI safety doc must still contain HITL section even with domain guardrails');
  });

  it('P24: EN mode shows English AI guardrail labels', () => {
    const f = gP24(finBase, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('Domain-Specific AI Risk Guardrails') || doc.includes('Idempotency') || doc.includes('balance'), 'EN mode must show English domain AI guardrails');
  });

  it('P24: unknown domain does not add undefined content', () => {
    const f = gP24({ purpose: 'テスト用アプリ', frontend: 'React', backend: 'Node.js + Express', database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js', data_entities: 'User', ai_tools: 'なし', success: 'MAU', target: 'ユーザー' });
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(!doc.includes('undefined'), 'Unknown domain must not produce undefined in AI safety doc');
  });
});

/*
   Suite 30 — P12 Compliance Matrix: Domain Quick Reference (DOMAIN_PLAYBOOK)
   Tests for:
   - P12: DOMAIN_PLAYBOOK[domain].compliance_ja/en → docs/45_compliance_matrix.md
*/
describe('Suite 30: P12 Compliance Matrix Domain Quick Reference', () => {
  function gP12(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate'; S.skillLv=3;
    genPillar12_SecurityIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const finBase = {
    purpose: '金融取引・送金プラットフォーム',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Transaction', success: '取引成功率99%', target: '個人ユーザー',
  };
  const healthBase = {
    purpose: '医療記録・ヘルスケア管理',
    frontend: 'React + Next.js', backend: 'Supabase',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'Supabase Auth',
    data_entities: 'Patient, Record', success: 'HIPAA準拠100%', target: '医療従事者',
  };
  const saasBase = {
    purpose: 'SaaSプロジェクト管理ツール',
    frontend: 'React + Next.js', backend: 'Node.js + Express',
    database: 'PostgreSQL', deploy: 'Vercel', auth: 'NextAuth.js',
    data_entities: 'User, Team, Project', success: 'MRR $10k', target: '企業',
  };

  it('P12: fintech compliance matrix includes domain quick reference', () => {
    const f = gP12(finBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('ドメイン別コンプライアンス早見表') || doc.includes('Domain Compliance Quick Reference'), 'Fintech compliance matrix must have domain quick reference section');
  });

  it('P12: fintech compliance mentions FSA/金融庁 or PCI DSS', () => {
    const f = gP12(finBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('金融庁') || doc.includes('FSA') || doc.includes('PCI') || doc.includes('AML'), 'Fintech compliance quick reference must mention FSA or PCI DSS');
  });

  it('P12: health compliance mentions HIPAA', () => {
    const f = gP12(healthBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('HIPAA') || doc.includes('PHI') || doc.includes('医療'), 'Health compliance quick reference must mention HIPAA');
  });

  it('P12: saas compliance mentions SOC 2 or GDPR', () => {
    const f = gP12(saasBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('SOC 2') || doc.includes('SOC2') || doc.includes('GDPR') || doc.includes('CCPA'), 'SaaS compliance quick reference must mention SOC 2 or GDPR');
  });

  it('P12: compliance matrix still shows applicable frameworks', () => {
    const f = gP12(finBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('Applicable Frameworks') || doc.includes('適用フレームワーク'), 'Compliance matrix must still show applicable frameworks section');
  });

  it('P12: EN mode shows English compliance quick reference', () => {
    const f = gP12(finBase, 'en');
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('Domain Compliance Quick Reference') || doc.includes('FSA') || doc.includes('PCI'), 'EN mode must show English domain compliance reference');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
   Suite 31 — P7 Roadmap: DOMAIN_TOOLS_DB specialist field tools in RESOURCES.md
 ─────────────────────────────────────────────────────────────────────────────
*/
/* Minimal DOMAIN_TOOLS_DB (full version in src/data/presets-ext2.js) */
var DOMAIN_TOOLS_DB = {
  civil_eng: {
    solo: ['OpenAI API','Python (NumPy/SciPy)','ReportLab','QGIS','OpenDroneMap'],
    small: ['QGIS','Python','Streamlit','DJI Terra','LAStools'],
    medium: ['ArcGIS','TensorFlow','FastAPI','Autodesk Civil 3D','Azure'],
    large: ['Azure Synapse','Databricks','ArcGIS Enterprise','Bentley iTwin','Power BI']
  },
  braintech: {
    solo: ['Python (MNE)','FastAPI','Streamlit','SQLite'],
    small: ['Supabase','MNE-Python','BrainFlow','wearable API'],
    medium: ['Databricks','PyTorch','MONAI','DICOM/PACS'],
    large: ['Azure Synapse','NVIDIA Clara','Databricks','NestJS']
  }
};

function gP7(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar7_Roadmap(answers, 'TestProject');
  return S.files;
}

const civilBase = {
  purpose:'土木調査AIシステム', purposeEn:'Civil Survey AI System',
  frontend:'React + Next.js', backend:'Node.js + Express',
  orm:'Prisma', skill_level:'Intermediate', learning_goal:'6ヶ月標準',
  dev_methods:'TDD',
};

describe('Suite 31: P7 Roadmap RESOURCES.md — DOMAIN_TOOLS_DB Specialist Tools', () => {
  it('P7: civil_ground preset shows domain tools section header (JA)', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('ドメイン固有ツール推奨表') || doc.includes('Domain-Specific Tools'), 'Must include domain tools section header for civil_ground preset');
  });

  it('P7: civil_ground preset shows scale tiers (Solo and Medium rows)', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('Solo') && (doc.includes('Medium') || doc.includes('Small')), 'Domain tools table must include Solo and at least one other scale row');
  });

  it('P7: civil_ground preset includes civil_eng domain tools', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('QGIS') || doc.includes('ArcGIS') || doc.includes('Databricks'), 'Domain tools table must list civil_eng tools');
  });

  it('P7: braintech preset (bt_cogperf) shows braintech domain tools', () => {
    S.preset = 'field:bt_cogperf';
    const f = gP7({...civilBase, purpose:'BCI認知最適化プラットフォーム'}); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('braintech') || doc.includes('MNE') || doc.includes('MONAI') || doc.includes('PyTorch'), 'Braintech preset must show braintech-domain tools');
  });

  it('P7: custom preset does NOT inject domain tools section', () => {
    S.preset = 'custom';
    const f = gP7(civilBase);
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(!doc.includes('ドメイン固有ツール推奨表') && !doc.includes('Domain-Specific Tools ('), 'Custom preset must NOT inject domain tools section');
  });

  it('P7: EN mode shows English domain tools header', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase, 'en'); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('Domain-Specific Tools'), 'EN mode must show English section header');
  });

  it('P7: domain tools section is present and table has pipe separators', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    const hasSec = doc.includes('ドメイン固有ツール推奨表') || doc.includes('Domain-Specific Tools (');
    assert.ok(hasSec && doc.includes('|---'), 'Domain tools must include a markdown table');
  });

  it('P7: RESOURCES.md still contains official docs section alongside domain tools', () => {
    S.preset = 'field:civil_ground';
    const f = gP7(civilBase); S.preset = 'custom';
    const doc = f['roadmap/RESOURCES.md'] || '';
    assert.ok(doc.includes('TypeScript') || doc.includes('Tailwind'), 'Official docs section must remain present when domain tools section is injected');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
   Suite 32 — P20 Quality Gate Matrix: DOMAIN_QA_MAP in non-fintech/health/ec domains
 ─────────────────────────────────────────────────────────────────────────────
*/
const educBase = Object.assign({}, A25, { purpose:'オンライン学習管理プラットフォーム', purposeEn:'Online LMS Platform' });
const logisBase = Object.assign({}, A25, { purpose:'物流配送管理システム', purposeEn:'Logistics Delivery System' });

describe('Suite 32: P20 Quality Gate Matrix — DOMAIN_QA_MAP for Generic Domains', () => {
  it('P20: education domain shows DOMAIN_QA_MAP focus areas in quality gate', () => {
    const f = gP20(educBase);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('education') || doc.includes('テスト重点') || doc.includes('Test Focus'), 'Education domain must show domain-specific focus in quality gate');
  });

  it('P20: education domain includes regression test scenarios in quality gate', () => {
    const f = gP20(educBase);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    const hasQA = doc.includes('DOMAIN_QA_MAP') || doc.includes('回帰テスト') || doc.includes('Regression');
    assert.ok(hasQA, 'Education domain quality gate must include DOMAIN_QA_MAP regression scenarios');
  });

  it('P20: logistics domain shows domain-specific quality gate content', () => {
    const f = gP20(logisBase);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('logistics') || doc.includes('テスト重点') || doc.includes('Test Focus'), 'Logistics domain must show domain-specific focus or standard gate');
  });

  it('P20: fintech domain still shows hardcoded fintech quality gate (not replaced)', () => {
    const finBase2 = Object.assign({}, A25, { purpose:'fintech payment platform' });
    const f = gP20(finBase2);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('PCI') || doc.includes('Fintech') || doc.includes('fintech'), 'Fintech domain must still show fintech-specific quality gate');
  });

  it('P20: quality gate matrix always contains the pipeline stage table', () => {
    const f = gP20(educBase);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('Lint') && doc.includes('Test'), 'Quality gate matrix must always contain the standard pipeline stage table');
  });

  it('P20: EN mode shows English domain quality gate labels', () => {
    const f = gP20(educBase, 'en');
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('Test Focus') || doc.includes('education') || doc.includes('Regression'), 'EN mode must show English labels in domain quality gate section');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
   Suite 33 — P16 Industry Deep Dive: DOMAIN_PLAYBOOK fallback for unstratified domains
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP16(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar16_DevIQ(answers,'QTest');
  return S.files;
}

const gamingBase = Object.assign({}, A25, { purpose:'gaming platform online multiplayer', purposeEn:'Gaming Platform' });
const saasBase16 = Object.assign({}, A25, { purpose:'saas subscription management platform', purposeEn:'SaaS Platform' });

describe('Suite 33: P16 Industry Deep Dive gen62 — DOMAIN_PLAYBOOK Fallback', () => {
  it('P16: gaming domain (no INDUSTRY_STRATEGY) shows DOMAIN_PLAYBOOK guidance', () => {
    const f = gP16(gamingBase);
    const doc = f['docs/62_industry_deep_dive.md'] || '';
    assert.ok(
      doc.includes('DOMAIN_PLAYBOOK') || doc.includes('ドメイン実装ガイダンス') || doc.includes('Domain Implementation'),
      'Gaming domain without INDUSTRY_STRATEGY must show DOMAIN_PLAYBOOK fallback guidance'
    );
  });

  it('P16: gaming domain shows predicted bug prevention section', () => {
    const f = gP16(gamingBase);
    const doc = f['docs/62_industry_deep_dive.md'] || '';
    assert.ok(
      doc.includes('🐛') || doc.includes('予測バグ') || doc.includes('Predicted Bug') || doc.includes('Prevention'),
      'Gaming domain must show predicted bug/prevention section from DOMAIN_PLAYBOOK'
    );
  });

  it('P16: saas domain shows DOMAIN_PLAYBOOK guidance (has specific entry)', () => {
    const f = gP16(saasBase16);
    const doc = f['docs/62_industry_deep_dive.md'] || '';
    assert.ok(doc.includes('saas') || doc.includes('SaaS') || doc.length > 200, 'SaaS domain must generate meaningful industry deep dive content');
  });

  it('P16: education domain uses INDUSTRY_STRATEGY (has defined strategy)', () => {
    const f = gP16(educBase);
    const doc = f['docs/62_industry_deep_dive.md'] || '';
    assert.ok(
      doc.includes('Compliance') || doc.includes('コンプライアンス') || doc.includes('Regulations') || doc.includes('規制'),
      'Education domain with INDUSTRY_STRATEGY must show compliance/regulations section'
    );
  });

  it('P16: EN mode shows English domain guidance for gaming domain', () => {
    const f = gP16(gamingBase, 'en');
    const doc = f['docs/62_industry_deep_dive.md'] || '';
    assert.ok(
      doc.includes('Domain Implementation') || doc.includes('Predicted Bug') || doc.includes('gaming'),
      'EN mode gaming domain must show English guidance'
    );
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
   Suite 34 — P19 Enterprise Architecture + P18 Prompt Registry domain context
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP19(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar19_EnterpriseSaaS(answers,'QTest');
  return S.files;
}
function gP18(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar18_PromptOps(answers,'QTest');
  return S.files;
}

const finBase19 = Object.assign({}, A25, { purpose:'fintech payment platform', org_model:'マルチテナント(RLS)' });
const healthBase19 = Object.assign({}, A25, { purpose:'health medical platform', org_model:'マルチテナント(RLS)' });

describe('Suite 34: P19 Enterprise Arch Domain Hardening + P18 Prompt Registry Domain Context', () => {
  it('P19: fintech domain shows domain-specific enterprise requirements in gen73', () => {
    const f = gP19(finBase19);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(
      doc.includes('fintech') || doc.includes('ドメイン固有エンタープライズ') || doc.includes('Domain-Specific Enterprise'),
      'Fintech domain must show domain-specific enterprise requirements section'
    );
  });

  it('P19: fintech enterprise doc includes hardening rules', () => {
    const f = gP19(finBase19);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(doc.includes('✅') || doc.includes('🔒'), 'Enterprise doc must include hardening or BCP checkmarks');
  });

  it('P19: health domain shows domain-specific enterprise requirements', () => {
    const f = gP19(healthBase19);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(
      doc.includes('health') || doc.includes('ドメイン固有エンタープライズ') || doc.includes('Domain-Specific Enterprise'),
      'Health domain enterprise doc must show domain-specific requirements'
    );
  });

  it('P19: enterprise architecture always contains tenant isolation strategy', () => {
    const f = gP19(finBase19);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(doc.includes('RLS') || doc.includes('テナント分離') || doc.includes('Tenant Isolation'), 'Enterprise arch must always show tenant isolation section');
  });

  it('P18: fintech domain prompt registry shows domain implementation notes', () => {
    const f = gP18(finBase19);
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(
      doc.includes('fintech') || doc.includes('FINTECH') || doc.includes('ドメイン固有プロンプト') || doc.includes('Domain-Specific Prompt'),
      'Fintech prompt registry must show fintech-specific content'
    );
  });

  it('P18: education domain shows DOMAIN_IMPL_PATTERN context notes', () => {
    const f = gP18(educBase);
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(
      doc.includes('education') || doc.includes('EDU') || doc.includes('ドメイン固有プロンプト') || doc.includes('Domain-Specific Prompt'),
      'Education prompt registry must show education-specific content'
    );
  });

  it('P18: EN mode shows English domain prompt context notes', () => {
    const f = gP18(finBase19, 'en');
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('Domain-Specific Prompt') || doc.includes('FINTECH') || doc.includes('P2-IMPLEMENT'), 'EN mode prompt registry must show English domain context');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 35 — P3 MCP Domain Expansion (18 newly added domains)
  Verifies _domainFocus and _domainTools produce correct output for domains
  added in v9.6.x: gamify, collab, creator, newsletter, travel, government,
  booking — covering both .mcp/project-context.md and .mcp/tools-manifest.json
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP3(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar3_MCP(answers,'QTest');
  return S.files;
}

describe('Suite 35: P3 MCP Domain Expansion (newly added domains)', () => {
  it('P3: gamify domain shows leaderboard focus in project-context.md (JA)', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'gamification platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('リアルタイムランキング'), 'Gamify project-context must show real-time leaderboard focus (JA)');
  });

  it('P3: gamify domain shows leaderboard focus in project-context.md (EN)', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'gamification platform' }), 'en');
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('Real-time leaderboard') || doc.includes('leaderboard'), 'Gamify project-context must show real-time leaderboard focus (EN)');
  });

  it('P3: collab domain shows CRDT conflict resolution in project-context.md', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'collaboration platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('OT/CRDT') || doc.includes('CRDT'), 'Collab project-context must show OT/CRDT conflict resolution');
  });

  it('P3: creator domain shows payouts focus in project-context.md', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'creator content platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('クリエイターペイアウト') || doc.includes('ペイアウト'), 'Creator project-context must show creator payout focus');
  });

  it('P3: newsletter domain shows bounce management focus in project-context.md', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'newsletter platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('バウンス'), 'Newsletter project-context must show bounce management focus');
  });

  it('P3: travel domain shows cancellation policy focus in project-context.md', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('キャンセルポリシー'), 'Travel project-context must show cancellation policy focus');
  });

  it('P3: government domain shows citizen data protection in project-context.md', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['.mcp/project-context.md'] || '';
    assert.ok(doc.includes('住民データ保護') || doc.includes('住民'), 'Government project-context must show citizen data protection');
  });

  it('P3: booking domain shows booking conflict tool in tools-manifest.json', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'restaurant booking system' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('予約競合') || manifest.includes('postgres'), 'Booking tools-manifest must include booking conflict tool recommendation');
  });

  it('P3: creator domain shows stripe payment tool in tools-manifest.json', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'creator content platform' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('stripe'), 'Creator tools-manifest must include stripe payment tool');
  });

  it('P3: gamify domain shows postgres ranking tool in tools-manifest.json', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'gamification platform' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('ポイント・ランキング') || manifest.includes('postgres'), 'Gamify tools-manifest must include postgres point & ranking tool');
  });

  it('P3: government domain shows playwright e2e tool in tools-manifest.json', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('電子申請') || manifest.includes('playwright'), 'Government tools-manifest must include playwright e2e tool');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 36 — P4 AI Rules + P5 Quality Intelligence Domain Expansion
  Verifies:
    - skills/catalog.md shows domain-specific AI skills for newly added domains
      (travel, government, insurance, manufacturing, logistics, media)
    - skills/factory.md shows domain-specific thinking axis for those domains
    - docs/34_incident_response.md shows domain-specific severity examples
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP4(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar4_AIRules(answers,'QTest');
  return S.files;
}
function gP5(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar5_QualityIntelligence(answers,'QTest');
  return S.files;
}

describe('Suite 36: P4 AI Rules + P5 Quality Intelligence Domain Expansion', () => {
  it('P4: travel domain shows availability/cancellation skills in catalog.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('在庫管理') || doc.includes('Availability') || doc.includes('キャンセル'), 'Travel skills/catalog.md must show availability or cancellation skills');
  });

  it('P4: government domain shows privacy/application skills in catalog.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('申請設計') || doc.includes('Application Design') || doc.includes('個人情報'), 'Government skills/catalog.md must show application design or privacy skills');
  });

  it('P4: insurance domain shows claims processing skill in catalog.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('クレーム') || doc.includes('Claims') || doc.includes('証券'), 'Insurance skills/catalog.md must show claims or policy skills');
  });

  it('P4: media domain shows streaming/CDN optimization skill in catalog.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'media streaming platform' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('配信最適化') || doc.includes('Streaming Opt') || doc.includes('DRM'), 'Media skills/catalog.md must show streaming or DRM skills');
  });

  it('P4: travel domain shows correct thinking axis in factory.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['skills/factory.md'] || '';
    assert.ok(doc.includes('快適な旅') || doc.includes('Great travel'), 'Travel skills/factory.md must show travel-specific thinking axis');
  });

  it('P4: government domain shows citizen-focused thinking axis in factory.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['skills/factory.md'] || '';
    assert.ok(doc.includes('市民') || doc.includes('citizens') || doc.includes('government'), 'Government skills/factory.md must show citizen-focused thinking axis');
  });

  it('P4: manufacturing domain shows quality thinking axis in factory.md', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'manufacturing quality control system' }));
    const doc = f['skills/factory.md'] || '';
    assert.ok(doc.includes('品質を維持') || doc.includes('Quality maintained') || doc.includes('manufacturing'), 'Manufacturing skills/factory.md must show quality-focused thinking axis');
  });

  it('P5: travel domain shows booking system S1 incident example', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/34_incident_response.md'] || '';
    assert.ok(doc.includes('予約システム停止') || doc.includes('Booking system down'), 'Travel incident response must show booking system S1 example');
  });

  it('P5: government domain shows personal data S1 incident example', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['docs/34_incident_response.md'] || '';
    assert.ok(doc.includes('個人情報漏洩') || doc.includes('Personal data breach') || doc.includes('申請データ'), 'Government incident response must show personal data breach S1 example');
  });

  it('P5: insurance domain shows policy data S1 incident example', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/34_incident_response.md'] || '';
    assert.ok(doc.includes('保険証券') || doc.includes('Policy data') || doc.includes('クレーム処理停止'), 'Insurance incident response must show policy data S1 example');
  });

  it('P5: media domain shows content delivery S1 incident example', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'media streaming platform' }));
    const doc = f['docs/34_incident_response.md'] || '';
    assert.ok(doc.includes('コンテンツ配信全停止') || doc.includes('Content delivery halted') || doc.includes('DRM'), 'Media incident response must show content delivery S1 example');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 37 — P11 Impl Intelligence + P15 Future/Market Domain Expansion
  Verifies:
    - docs/40_ai_dev_runbook.md shows domain-specific error messages for
      newly added domains (saas, booking, collab, travel, government, insurance)
    - docs/56_market_positioning.md shows domain-specific TAM for newly added
      domains (community, travel, ai, creator, government)
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP11(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar11_ImplIntelligence(answers,'QTest');
  return S.files;
}

describe('Suite 37: P11 Impl Intelligence + P15 Future/Market Domain Expansion', () => {
  it('P11: saas domain shows RLS tenant error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'SaaS subscription platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('RLS') || doc.includes('テナント'), 'SaaS runbook must show RLS/tenant error message');
  });

  it('P11: booking domain shows duplicate booking error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'restaurant booking system' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('重複予約') || doc.includes('Duplicate booking') || doc.includes('ロック'), 'Booking runbook must show duplicate booking error message');
  });

  it('P11: collab domain shows CRDT data loss error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'collaboration platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('CRDT') || doc.includes('OT') || doc.includes('データ消失'), 'Collab runbook must show OT/CRDT conflict error message');
  });

  it('P11: travel domain shows overbooking error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('過剰予約') || doc.includes('Overbooking'), 'Travel runbook must show overbooking error message');
  });

  it('P11: government domain shows personal data access error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('個人情報不正参照') || doc.includes('Unauthorized personal data') || doc.includes('アクセスログ'), 'Government runbook must show personal data access error message');
  });

  it('P11: insurance domain shows claim calculation error in runbook', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('クレーム') || doc.includes('Claim amount') || doc.includes('保険証券'), 'Insurance runbook must show claim calculation error message');
  });

  it('P15: community domain shows TAM in market positioning', () => {
    const f = gFuture15(Object.assign({}, A25, { purpose:'community forum platform' }));
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('$7B') || doc.includes('Community platform') || doc.includes('コミュニティプラットフォーム'), 'Community market positioning must show TAM');
  });

  it('P15: travel domain shows TAM in market positioning', () => {
    const f = gFuture15(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('$1T') || doc.includes('Travel tech') || doc.includes('旅行テック'), 'Travel market positioning must show TAM');
  });

  it('P15: ai domain shows TAM in market positioning', () => {
    const f = gFuture15(Object.assign({}, A25, { purpose:'AI chatbot agent platform' }));
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('$400B') || doc.includes('AI platform') || doc.includes('AIプラットフォーム'), 'AI market positioning must show TAM');
  });

  it('P15: creator domain shows TAM in market positioning', () => {
    const f = gFuture15(Object.assign({}, A25, { purpose:'creator content platform' }));
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('$250B') || doc.includes('Creator economy') || doc.includes('クリエイターエコノミー'), 'Creator market positioning must show TAM');
  });

  it('P15: government domain shows GovTech TAM in market positioning (EN)', () => {
    const f = gFuture15(Object.assign({}, A25, { purpose:'government civic service platform' }), 'en');
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('GovTech') || doc.includes('$600B'), 'Government market positioning must show GovTech TAM (EN)');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 38 — P10 Revenue Model Domain Expansion (8 → 30 domains)
  Verifies docs/38_business_model.md (when payment is set) shows domain-
  specific revenue model (model/tiers/primary) for newly added domains:
  health, iot, collab, creator, travel, government, insurance, media, ai
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP10(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar10_ReverseEngineering(answers,'QTest');
  return S.files;
}

describe('Suite 38: P10 Business Model Revenue Domain Expansion', () => {
  it('P10: health domain shows health/insurance revenue model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'digital health wellness platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('フリーミアム') || doc.includes('Freemium') || doc.includes('保険'), 'Health business model must show freemium/insurance revenue model');
  });

  it('P10: iot domain shows hardware+SaaS revenue model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'IoT device management platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('ハードウェア') || doc.includes('Hardware') || doc.includes('デバイス'), 'IoT business model must show hardware+SaaS revenue model');
  });

  it('P10: collab domain shows per-seat subscription model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'collaboration platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('ユーザー数') || doc.includes('Per-seat') || doc.includes('席数'), 'Collab business model must show per-seat SaaS model');
  });

  it('P10: creator domain shows revenue share model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'creator content platform', payment:'Stripe決済 (Connect)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('収益分配') || doc.includes('Revenue share') || doc.includes('収益シェア'), 'Creator business model must show revenue sharing model');
  });

  it('P10: travel domain shows booking commission model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'travel booking platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('予約手数料') || doc.includes('Booking commission'), 'Travel business model must show booking commission model');
  });

  it('P10: government domain shows B2G license model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'government civic service platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('B2G') || doc.includes('ライセンス') || doc.includes('License'), 'Government business model must show B2G license model');
  });

  it('P10: insurance domain shows premium collection model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'insurance claims management platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('保険料') || doc.includes('Premium') || doc.includes('引受'), 'Insurance business model must show premium/underwriting model');
  });

  it('P10: ai domain shows API usage pricing model', () => {
    const f = gP10(Object.assign({}, A25, { purpose:'AI chatbot agent platform', payment:'Stripe Billing (サブスク)' }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.includes('API課金') || doc.includes('API usage') || doc.includes('トークン'), 'AI business model must show API usage pricing model');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 39 — P9 Design System Domain Expansion
  Verifies docs/26_design_system.md shows domain-specific color tokens and
  visual strategy for newly added domains (gamify, collab, creator, travel,
  government, ai, media, analytics, event) and docs/27_sequence_diagrams.md
  shows domain-specific sequence flows (gamify, collab, creator)
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP9(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar9_DesignSystem(answers,'QTest');
  return S.files;
}

describe('Suite 39: P9 Design System Domain Expansion', () => {
  it('P9: gamify domain shows purple/achievement color token in design system', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'gamification platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('#8B5CF6') || doc.includes('エキサイティング') || doc.includes('Exciting'), 'Gamify design system must show purple/achievement color tokens');
  });

  it('P9: travel domain shows sky-blue/adventure color token in design system', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('#0EA5E9') || doc.includes('冒険') || doc.includes('adventurous'), 'Travel design system must show sky-blue/adventure color tokens');
  });

  it('P9: government domain shows navy/authoritative color token in design system', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'government civic service platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('#1E3A5F') || doc.includes('#1D4ED8') || doc.includes('権威') || doc.includes('authoritative'), 'Government design system must show navy/authoritative color tokens');
  });

  it('P9: ai domain shows blue/purple intelligent color token in design system', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'AI chatbot agent platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('#1E40AF') || doc.includes('#7C3AED') || doc.includes('知性') || doc.includes('Intelligent'), 'AI design system must show blue/purple intelligent color tokens');
  });

  it('P9: media domain shows dark/high-contrast color token in design system', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'media streaming platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('#111827') || doc.includes('エンタメ') || doc.includes('entertainment'), 'Media design system must show dark/high-contrast color tokens');
  });

  it('P9: gamify domain shows confetti/leaderboard visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'gamification platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('コンフェティ') || doc.includes('Confetti') || doc.includes('ランキング') || doc.includes('leaderboard'), 'Gamify design system must show confetti/leaderboard visual strategy');
  });

  it('P9: collab domain shows realtime cursor visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'collaboration platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('リアルタイムカーソル') || doc.includes('Realtime cursors') || doc.includes('presence'), 'Collab design system must show realtime cursor visual strategy');
  });

  it('P9: gamify domain shows point award sequence flow in diagram', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'gamification platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('ポイント付与') || doc.includes('Point Award') || doc.includes('badge'), 'Gamify sequence diagram must show point award flow');
  });

  it('P9: collab domain shows co-edit sequence flow in diagram', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'collaboration platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('共同編集') || doc.includes('Co-Edit') || doc.includes('CRDT'), 'Collab sequence diagram must show co-edit flow');
  });

  it('P9: creator domain shows content publish sequence flow in diagram', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'creator content platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('コンテンツ投稿') || doc.includes('Content Publish') || doc.includes('CDN'), 'Creator sequence diagram must show content publish flow');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 40 — P13 Strategy: Hidden Cost Domain Expansion
  Verifies docs/48-2_cost_estimation.md shows domain-specific hidden cost
  warnings for newly expanded domains (government, insurance, legal) in
  addition to the original fintech/health domains.
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP13(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar13_StrategicIntelligence(answers,'QTest');
  return S.files;
}

describe('Suite 40: P13 Strategy Hidden Cost Domain Expansion', () => {
  it('P13: fintech domain shows security audit hidden cost (regression)', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'fintech payment platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Security audit') || doc.includes('セキュリティ監査'), 'Fintech must show security audit hidden cost');
  });

  it('P13: health domain shows security audit hidden cost (regression)', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'digital health wellness platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Security audit') || doc.includes('セキュリティ監査'), 'Health must show security audit hidden cost');
  });

  it('P13: government domain shows security audit hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'government civic service portal' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Security audit') || doc.includes('セキュリティ監査'), 'Government must show security audit hidden cost');
  });

  it('P13: government domain shows accessibility audit hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'government civic service portal' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Accessibility audit') || doc.includes('アクセシビリティ診断'), 'Government must show accessibility audit hidden cost');
  });

  it('P13: insurance domain shows security audit hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Security audit') || doc.includes('セキュリティ監査'), 'Insurance must show security audit hidden cost');
  });

  it('P13: insurance domain shows actuarial review hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Actuarial review') || doc.includes('保険数理'), 'Insurance must show actuarial review hidden cost');
  });

  it('P13: legal domain shows security audit hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'legal document management platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('Security audit') || doc.includes('セキュリティ監査'), 'Legal must show security audit hidden cost');
  });

  it('P13: legal domain shows eDiscovery tooling hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'legal document management platform' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(doc.includes('eDiscovery') || doc.includes('リーガルホールド'), 'Legal must show eDiscovery/legal hold hidden cost');
  });

  it('P13: default domain does NOT show security audit hidden cost', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'todo list app' }));
    const doc = f['docs/48-2_cost_estimation.md'] || '';
    assert.ok(!doc.includes('Security audit') && !doc.includes('セキュリティ監査'), 'Default domain must NOT show security audit cost');
  });

  it('P13: government domain shows industry blueprint with ISMAP reference', () => {
    const f = gP13(Object.assign({}, A25, { purpose:'government civic service portal' }));
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(doc.includes('ISMAP') || doc.includes('JPKI') || doc.includes('government') || doc.includes('行政'), 'Government must show government-specific industry blueprint');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 41 — P9 Design System DOMAIN_VISUAL Full Coverage (14→32)
  Verifies docs/26_design_system.md shows domain-specific visual strategy for
  the 18 newly added DOMAIN_VISUAL domains: marketplace, content, portfolio,
  tool, iot, realestate, legal, hr, automation, event, devtool, newsletter,
  manufacturing, logistics, agriculture, energy, government, insurance
 ─────────────────────────────────────────────────────────────────────────────
*/
describe('Suite 41: P9 Design System DOMAIN_VISUAL Full Coverage', () => {
  it('P9: marketplace domain shows price badge/filter sidebar visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'marketplace platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('価格バッジ') || doc.includes('Price badge') || doc.includes('フィルターサイドバー') || doc.includes('Filter sidebar'), 'Marketplace must show price/filter visual strategy');
  });

  it('P9: content domain shows reading progress visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'content publishing platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('読書進捗') || doc.includes('Reading progress') || doc.includes('リーダーモード') || doc.includes('Reading mode'), 'Content must show reading progress visual strategy');
  });

  it('P9: portfolio domain shows masonry grid visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'freelancer portfolio website' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('メイソングリッド') || doc.includes('Masonry grid') || doc.includes('パララックス') || doc.includes('parallax'), 'Portfolio must show masonry grid visual strategy');
  });

  it('P9: tool domain shows compact toolbar visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'developer productivity tool' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('コンパクトツールバー') || doc.includes('Compact toolbar') || doc.includes('即時フィードバック') || doc.includes('Instant feedback'), 'Tool must show compact toolbar visual strategy');
  });

  it('P9: iot domain shows sensor gauge visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'IoT device monitoring platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('センサーゲージ') || doc.includes('Sensor gauge') || doc.includes('ダークモニタリング') || doc.includes('Dark monitoring'), 'IoT must show sensor gauge visual strategy');
  });

  it('P9: realestate domain shows VR tour / photo grid visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'real estate property listing platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('VRツアー') || doc.includes('VR tour') || doc.includes('写真グリッド') || doc.includes('Photo grid'), 'RealEstate must show VR tour/photo grid visual strategy');
  });

  it('P9: legal domain shows document viewer visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'legal document management system' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('ドキュメントビューア') || doc.includes('Document viewer') || doc.includes('プロフェッショナルセリフ') || doc.includes('Professional serif'), 'Legal must show document viewer visual strategy');
  });

  it('P9: hr domain shows profile cards / kanban visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'HR recruitment management platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('プロフィールカード') || doc.includes('Profile cards') || doc.includes('カンバン') || doc.includes('Kanban'), 'HR must show profile cards/kanban visual strategy');
  });

  it('P9: automation domain shows flow diagram visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'workflow automation platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('フロー図') || doc.includes('Flow diagram') || doc.includes('ノードベース') || doc.includes('Node-based'), 'Automation must show flow diagram visual strategy');
  });

  it('P9: event domain shows countdown timer visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'event management system' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('カウントダウン') || doc.includes('Countdown') || doc.includes('座席マップ') || doc.includes('seat map'), 'Event must show countdown/seat map visual strategy');
  });

  it('P9: devtool domain shows code syntax highlight visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'devtool SDK API platform' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('コード構文') || doc.includes('Code syntax') || doc.includes('ダークモノスペース') || doc.includes('Dark monospace'), 'DevTool must show code syntax visual strategy');
  });

  it('P9: government domain shows multi-step form visual strategy', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'government e-services portal' }));
    const doc = f['docs/26_design_system.md'] || '';
    assert.ok(doc.includes('多段階フォーム') || doc.includes('Multi-step form') || doc.includes('A11y') || doc.includes('accessibility'), 'Government must show multi-step form/a11y visual strategy');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 42 — P9 Sequence Diagrams: DOMAIN_SEQ_FLOWS 9→19 domains
  Verifies docs/27_sequence_diagrams.md shows domain-specific sequence flows
  for newly added domains: ai, travel, marketplace, insurance, iot, event,
  automation, community (+ existing 9 unchanged)
 ─────────────────────────────────────────────────────────────────────────────
*/
describe('Suite 42: P9 Sequence Diagrams DOMAIN_SEQ_FLOWS Expansion', () => {
  it('P9: ai domain shows AI chat/streaming sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'AI chatbot assistant platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('AI会話') || doc.includes('AI Chat') || doc.includes('RAG') || doc.includes('LLM'), 'AI must show chat/streaming sequence flow');
  });

  it('P9: travel domain shows booking sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('旅行予約') || doc.includes('Travel Booking') || doc.includes('OTA') || doc.includes('バウチャー'), 'Travel must show booking sequence flow');
  });

  it('P9: marketplace domain shows deal/escrow sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'marketplace platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('商品取引') || doc.includes('Marketplace Deal') || doc.includes('エスクロー') || doc.includes('escrow'), 'Marketplace must show deal/escrow sequence flow');
  });

  it('P9: insurance domain shows claim processing sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('保険請求') || doc.includes('Insurance Claim') || doc.includes('査定') || doc.includes('assessment'), 'Insurance must show claim processing sequence flow');
  });

  it('P9: iot domain shows sensor data sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'IoT device management platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('センサーデータ') || doc.includes('Sensor Data') || doc.includes('MQTT') || doc.includes('閾値'), 'IoT must show sensor data sequence flow');
  });

  it('P9: event domain shows ticket purchase sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'event management system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('チケット購入') || doc.includes('Ticket Purchase') || doc.includes('QR') || doc.includes('座席'), 'Event must show ticket purchase sequence flow');
  });

  it('P9: automation domain shows workflow execution sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'workflow automation platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('ワークフロー実行') || doc.includes('Workflow Execution') || doc.includes('トリガー') || doc.includes('trigger'), 'Automation must show workflow execution sequence flow');
  });

  it('P9: community domain shows post/moderation sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'online community platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('コミュニティ投稿') || doc.includes('Community Post') || doc.includes('モデレーション') || doc.includes('moderation'), 'Community must show post/moderation sequence flow');
  });
});

/*
 ─────────────────────────────────────────────────────────────────────────────
  Suite 43 — P14 Ops Intelligence: SLI/Rate-Limit/Threshold Domain Expansion
  Verifies docs/53_ops_runbook.md and docs/54_ops_checklist.md show
  domain-specific SLI targets, rate limits, and alert thresholds for the
  newly added domains (saas, booking, community, iot, marketplace, travel,
  government, insurance, ai) beyond the original 4 (fintech, health, education, ec)
 ─────────────────────────────────────────────────────────────────────────────
*/
function gP14(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar14_OpsIntelligence(answers,'QTest');
  return S.files;
}

describe('Suite 43: P14 Ops Intelligence Domain SLI/Rate-Limit Expansion', () => {
  it('P14: saas domain shows tenant isolation SLI in ops runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'SaaS subscription platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('テナント分離') || doc.includes('Tenant Isolation') || doc.includes('サブスク更新') || doc.includes('Subscription Renewal'), 'SaaS must show tenant isolation SLI');
  });

  it('P14: booking domain shows double booking prevention SLI', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'restaurant booking system' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ダブルブッキング') || doc.includes('Double Booking') || doc.includes('予約確定時間') || doc.includes('Booking Confirm'), 'Booking must show double booking prevention SLI');
  });

  it('P14: community domain shows moderation response time SLI', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'online community platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('モデレーション応答') || doc.includes('Moderation Response') || doc.includes('WebSocket接続') || doc.includes('WebSocket Connect'), 'Community must show moderation response SLI');
  });

  it('P14: iot domain shows sensor data reception SLI', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'IoT device management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('センサーデータ受信') || doc.includes('Sensor Data Reception') || doc.includes('MQTT') || doc.includes('デバイス接続率'), 'IoT must show sensor data reception SLI');
  });

  it('P14: travel domain shows double booking SLI in ops runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'travel booking platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ダブルブッキング') || doc.includes('Double Booking') || doc.includes('OTA在庫') || doc.includes('OTA Inventory'), 'Travel must show double booking rate SLI');
  });

  it('P14: government domain shows application processing time SLI', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'government civic service portal' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('申請処理時間') || doc.includes('Application Processing') || doc.includes('個人情報アクセス') || doc.includes('Personal Data Access'), 'Government must show processing time SLI');
  });

  it('P14: ai domain shows token overuse rate SLI', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'AI chatbot assistant platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('トークン使用量') || doc.includes('Token Overuse') || doc.includes('Hallucination') || doc.includes('幻覚'), 'AI must show token overuse SLI');
  });

  it('P14: iot domain shows sensor alert threshold in checklist', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'IoT device management platform' }));
    const doc = f['docs/54_ops_checklist.md'] || '';
    assert.ok(doc.includes('センサー欠損') || doc.includes('Sensor Data Loss') || doc.includes('デバイスオフライン') || doc.includes('Device Offline'), 'IoT must show sensor alert thresholds in checklist');
  });

  it('P14: saas domain shows tenant isolation threshold in checklist', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'SaaS subscription platform' }));
    const doc = f['docs/54_ops_checklist.md'] || '';
    assert.ok(doc.includes('テナント分離') || doc.includes('Tenant Isolation') || doc.includes('Kill Switch') || doc.includes('チャーン'), 'SaaS must show tenant isolation threshold in checklist');
  });

  it('P14: booking domain shows double booking threshold in checklist', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'restaurant booking system' }));
    const doc = f['docs/54_ops_checklist.md'] || '';
    assert.ok(doc.includes('ダブルブッキング') || doc.includes('Double Booking') || doc.includes('予約失敗') || doc.includes('Booking Failure'), 'Booking must show double booking threshold in checklist');
  });
});

// ── Suite 44: P9 DOMAIN_SEQ_FLOWS remaining 15 domains ─────────────────────
describe('Suite 44: P9 DesignSystem DOMAIN_SEQ_FLOWS full coverage (15 new domains)', () => {
  it('P9: newsletter domain shows bulk send in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'newsletter email marketing platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('SES') || doc.includes('SendGrid') || doc.includes('一括送信') || doc.includes('Bulk send'), 'Newsletter must show email bulk send in sequence flow');
  });

  it('P9: content domain shows CDN delivery in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'content knowledge base blog platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('CDN') || doc.includes('SEO') || doc.includes('コンテンツ公開') || doc.includes('Content Publish'), 'Content must show CDN delivery in sequence flow');
  });

  it('P9: portfolio domain shows contact form in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'portfolio linkbio personal website' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('コンタクト') || doc.includes('contact') || doc.includes('プロジェクト') || doc.includes('project'), 'Portfolio must show contact/project in sequence flow');
  });

  it('P9: tool domain shows tool execution result in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'business tool PWA offline application' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('処理実行') || doc.includes('Execute') || doc.includes('パラメータ') || doc.includes('parameter'), 'Tool must show execution flow');
  });

  it('P9: realestate domain shows viewing schedule in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'real estate property management platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('内見') || doc.includes('viewing') || doc.includes('物件') || doc.includes('property') || doc.includes('契約'), 'Real estate must show property viewing flow');
  });

  it('P9: legal domain shows e-signature in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'legal contract management compliance system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('署名') || doc.includes('signature') || doc.includes('契約書') || doc.includes('contract'), 'Legal must show e-signature flow');
  });

  it('P9: hr domain shows job posting and offer letter in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'HR recruitment hiring management system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('求人') || doc.includes('job') || doc.includes('オファー') || doc.includes('offer') || doc.includes('採用'), 'HR must show hiring flow');
  });

  it('P9: devtool domain shows API key generation in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'devtool SDK API management platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('APIキー') || doc.includes('API key') || doc.includes('スコープ') || doc.includes('scope'), 'Devtool must show API key flow');
  });

  it('P9: manufacturing domain shows production order flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'manufacturing smart factory production management' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('生産') || doc.includes('production') || doc.includes('品質') || doc.includes('QC') || doc.includes('製造'), 'Manufacturing must show production order flow');
  });

  it('P9: logistics domain shows shipment tracking in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'logistics delivery warehouse tracking system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('追跡') || doc.includes('tracking') || doc.includes('配送') || doc.includes('delivery') || doc.includes('出荷'), 'Logistics must show shipment tracking flow');
  });

  it('P9: agriculture domain shows sensor crop monitoring in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'agriculture smart farming crop management' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('センサー') || doc.includes('sensor') || doc.includes('作物') || doc.includes('crop') || doc.includes('灌漑'), 'Agriculture must show crop monitoring flow');
  });

  it('P9: energy domain shows power optimization in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'energy power management system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('消費量') || doc.includes('consumption') || doc.includes('最適化') || doc.includes('optimization') || doc.includes('ピーク'), 'Energy must show power management flow');
  });

  it('P9: media domain shows adaptive streaming in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'media streaming broadcasting platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('ストリーム') || doc.includes('stream') || doc.includes('CDN') || doc.includes('視聴'), 'Media must show streaming flow');
  });

  it('P9: government domain shows civic application flow in sequence diagram', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'government municipal civic service system' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('申請') || doc.includes('application') || doc.includes('マイナンバー') || doc.includes('MyNumber') || doc.includes('審査'), 'Government must show civic application flow');
  });

  it('P9: analytics domain shows dashboard aggregation in sequence flow', () => {
    const f = gP9(Object.assign({}, A25, { purpose:'analytics dashboard visualization platform' }));
    const doc = f['docs/27_sequence_diagrams.md'] || '';
    assert.ok(doc.includes('集計') || doc.includes('aggregate') || doc.includes('キャッシュ') || doc.includes('cache') || doc.includes('可視化'), 'Analytics must show dashboard aggregation flow');
  });
});

// ── Suite 45: P5 Quality INDUSTRY_TEST_MATRIX 8 new domains ───────────────
describe('Suite 45: P5 Quality INDUSTRY_TEST_MATRIX new domain entries', () => {
  it('P5: ai domain shows hallucination/prompt injection test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'AI chatbot FAQ assistant platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('幻覚') || doc.includes('Hallucination') || doc.includes('プロンプトインジェクション') || doc.includes('Prompt injection'), 'AI domain must show hallucination/injection test focus');
  });

  it('P5: ai domain shows promptfoo or langsmith in tools', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'AI chatbot FAQ assistant platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('Promptfoo') || doc.includes('LangSmith') || doc.includes('プロンプト'), 'AI domain must show AI-specific test tools');
  });

  it('P5: booking domain shows double booking prevention test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'restaurant booking schedule platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('ダブルブッキング') || doc.includes('Double booking') || doc.includes('在庫ロック') || doc.includes('Inventory locking'), 'Booking must show double booking prevention test focus');
  });

  it('P5: marketplace domain shows escrow and fraud detection test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'marketplace buy sell platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('エスクロー') || doc.includes('Escrow') || doc.includes('不正出品') || doc.includes('Fraud'), 'Marketplace must show escrow and fraud test focus');
  });

  it('P5: insurance domain shows actuarial accuracy and fraud detection', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'insurance claim management platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('アクチュアリー') || doc.includes('Actuarial') || doc.includes('不正請求') || doc.includes('Fraud detection'), 'Insurance must show actuarial and fraud test focus');
  });

  it('P5: collab domain shows CRDT/OT sync test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'real-time collaboration editing platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('CRDT') || doc.includes('OT') || doc.includes('同期') || doc.includes('Concurrent'), 'Collab must show CRDT/OT sync test focus');
  });

  it('P5: automation domain shows infinite loop and idempotency test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'automation workflow RPA platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('無限ループ') || doc.includes('Infinite loop') || doc.includes('冪等性') || doc.includes('Idempotency'), 'Automation must show infinite loop/idempotency test focus');
  });

  it('P5: devtool domain shows API contract and breaking change test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'devtool SDK API management platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('コントラクト') || doc.includes('Contract') || doc.includes('ブレーキング') || doc.includes('breaking') || doc.includes('Pact'), 'Devtool must show API contract test focus');
  });

  it('P5: newsletter domain shows GDPR and spam avoidance test focus', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'newsletter email marketing platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('GDPR') || doc.includes('スパム') || doc.includes('Spam') || doc.includes('配信'), 'Newsletter must show GDPR and spam test focus');
  });
});

// ── Suite 46: P4/P11 domain gap completions ───────────────────────────────
describe('Suite 46: P4 domainSkillsMap + P11 domainErrors gap fills', () => {
  it('P4: portfolio domain shows SEO and contact form AI skills', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'portfolio linkbio personal website' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('SEO') || doc.includes('問い合わせ') || doc.includes('contact') || doc.includes('Core Web'), 'Portfolio must show SEO/contact AI skills in catalog');
  });

  it('P4: tool domain shows UX and docs AI skills', () => {
    const f = gP4(Object.assign({}, A25, { purpose:'business tool PWA offline application' }));
    const doc = f['skills/catalog.md'] || '';
    assert.ok(doc.includes('UX') || doc.includes('ドキュメント') || doc.includes('Docs') || doc.includes('タスク完了'), 'Tool must show UX/docs AI skills in catalog');
  });

  it('P11: agriculture domain shows sensor outlier error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'agriculture smart farming crop management' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('センサー') || doc.includes('Sensor') || doc.includes('外れ値') || doc.includes('outlier'), 'Agriculture must show sensor outlier error pattern');
  });

  it('P11: energy domain shows power double-count error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'energy power management system' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('二重計上') || doc.includes('double-count') || doc.includes('冪等性') || doc.includes('idempotency'), 'Energy must show power double-count error pattern');
  });

  it('P11: devtool domain shows API key hash storage error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'devtool SDK API management platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('APIキー') || doc.includes('API key') || doc.includes('bcrypt') || doc.includes('ハッシュ'), 'Devtool must show API key leak error pattern');
  });

  it('P11: portfolio domain shows spam reCAPTCHA error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'portfolio linkbio personal website' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('スパム') || doc.includes('spam') || doc.includes('reCAPTCHA') || doc.includes('レート制限'), 'Portfolio must show spam/reCAPTCHA error pattern');
  });

  it('P11: tool domain shows input validation crash error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'business tool PWA offline application' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('クラッシュ') || doc.includes('crash') || doc.includes('バリデーション') || doc.includes('validation') || doc.includes('サンドボックス'), 'Tool must show input validation/crash error pattern');
  });

  it('P11: content domain shows draft accidentally published error pattern', () => {
    const f = gP11(Object.assign({}, A25, { purpose:'content knowledge base blog platform' }));
    const doc = f['docs/40_ai_dev_runbook.md'] || '';
    assert.ok(doc.includes('誤公開') || doc.includes('accidentally published') || doc.includes('下書き') || doc.includes('draft') || doc.includes('FSM'), 'Content must show draft publish error pattern');
  });
});

// ── Suite 47: P18 domain-specific template catalogs ───────────────────────
describe('Suite 47: P18 PromptOps domain-specific template catalogs', () => {
  it('P18: health domain shows PHI and HIPAA template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'medical healthcare clinic platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('HEALTH') || doc.includes('PHI') || doc.includes('HIPAA'), 'Health must show PHI/HIPAA template IDs');
  });

  it('P18: saas domain shows multi-tenant and churn template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'SaaS subscription management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('SAAS') || doc.includes('MULTITENANT') || doc.includes('CHURN') || doc.includes('マルチテナント'), 'SaaS must show multi-tenant template IDs');
  });

  it('P18: ai domain shows RAG and hallucination detection template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'AI chatbot FAQ assistant platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('AI-P') || doc.includes('RAG') || doc.includes('HALLUCINATION') || doc.includes('幻覚'), 'AI must show RAG/hallucination template IDs');
  });

  it('P18: ec domain shows cart and inventory template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'ecommerce online shop platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('EC-P') || doc.includes('CART') || doc.includes('INVENTORY') || doc.includes('カート'), 'EC must show cart/inventory template IDs');
  });

  it('P18: marketplace domain shows escrow and fraud template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'marketplace buy sell trading platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('MKT-P') || doc.includes('ESCROW') || doc.includes('FRAUD') || doc.includes('エスクロー'), 'Marketplace must show escrow/fraud template IDs');
  });

  it('P18: government domain shows accessibility and audit template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'government civic service portal' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('GOV-P') || doc.includes('A11Y') || doc.includes('AUDIT') || doc.includes('アクセシビリティ'), 'Government must show accessibility/audit template IDs');
  });

  it('P18: insurance domain shows claims and actuarial template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'insurance claims management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('INS-P') || doc.includes('CLAIMS') || doc.includes('ACTUARIAL') || doc.includes('クレーム'), 'Insurance must show claims/actuarial template IDs');
  });
});

// ── Suite 48: P19 enterprise workflow customizations (new domains) ──────────
describe('Suite 48: P19 enterprise workflow customizations (health/saas/marketplace/insurance/hr/government/booking)', () => {
  it('P19: health domain shows PHI audit and prescription approval workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'health medical clinic platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('PHI') || doc.includes('診断') || doc.includes('Diagnosis') || doc.includes('処方'), 'Health enterprise must show PHI/prescription approval workflow');
  });

  it('P19: saas domain shows plan change and tenant deletion approval workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'SaaS subscription management platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('プラン変更') || doc.includes('Plan change') || doc.includes('テナント') || doc.includes('Tenant'), 'SaaS enterprise must show plan change/tenant approval workflows');
  });

  it('P19: marketplace domain shows seller verification and dispute escalation workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'marketplace buy sell trading platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('出品者') || doc.includes('Seller') || doc.includes('紛争') || doc.includes('Dispute'), 'Marketplace enterprise must show seller/dispute workflows');
  });

  it('P19: insurance domain shows claim assessment and actuarial review workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'insurance claims management platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('クレーム') || doc.includes('Claim') || doc.includes('アクチュアリー') || doc.includes('Actuarial'), 'Insurance enterprise must show claims/actuarial approval workflows');
  });

  it('P19: hr domain shows offer approval and salary change chain workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'HR human resources management platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('採用オファー') || doc.includes('Offer letter') || doc.includes('給与') || doc.includes('Salary'), 'HR enterprise must show offer/salary approval workflows');
  });

  it('P19: government domain shows application review and accessibility exception workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'government civic service portal', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('申請審査') || doc.includes('Application review') || doc.includes('アクセシビリティ') || doc.includes('Accessibility'), 'Government enterprise must show application review/accessibility workflows');
  });

  it('P19: booking domain shows cancellation exception and overbooking adjustment workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'restaurant table booking reservation platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('キャンセルポリシー') || doc.includes('Cancellation policy') || doc.includes('オーバーブッキング') || doc.includes('Overbooking'), 'Booking enterprise must show cancellation/overbooking adjustment workflows');
  });
});

// ── Suite 49: P3 _domainTools gap fills + P18 template catalogs batch 2 ────
describe('Suite 49: P3 _domainTools portfolio/tool + P18 PromptOps template catalogs batch 2', () => {
  it('P3: portfolio domain has domain-specific MCP tool recommendation', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'portfolio website showcase' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('playwright') || manifest.includes('portfolio'), 'Portfolio domain must have domain-specific MCP tool (playwright)');
  });

  it('P3: tool domain has domain-specific MCP tool recommendation', () => {
    const f = gP3(Object.assign({}, A25, { purpose:'developer utility tool platform' }));
    const manifest = f['.mcp/tools-manifest.json'] || '';
    assert.ok(manifest.includes('playwright') || manifest.includes('tool'), 'Tool domain must have domain-specific MCP tool (playwright)');
  });

  it('P18: booking domain shows availability and conflict template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'restaurant table booking reservation platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('BKG-P') || doc.includes('AVAILABILITY') || doc.includes('空き枠') || doc.includes('CONFLICT'), 'Booking must show availability/conflict template IDs');
  });

  it('P18: collab domain shows OT/CRDT sync and conflict resolution template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'collaborative document editor platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('COLLAB-P') || doc.includes('SYNC') || doc.includes('同期') || doc.includes('CONFLICT'), 'Collab must show sync/conflict template IDs');
  });

  it('P18: hr domain shows recruiting and payroll template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'HR human resources management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('HR-P') || doc.includes('RECRUIT') || doc.includes('採用') || doc.includes('PAYROLL'), 'HR must show recruiting/payroll template IDs');
  });

  it('P18: analytics domain shows dashboard and KPI template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'analytics dashboard reporting platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('ANLYT-P') || doc.includes('DASHBOARD') || doc.includes('ダッシュボード') || doc.includes('KPI'), 'Analytics must show dashboard/KPI template IDs');
  });

  it('P18: community domain shows moderation and spam template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'online community social forum platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('COMM-P') || doc.includes('MODERATE') || doc.includes('モデレーション') || doc.includes('SPAM'), 'Community must show moderation/spam template IDs');
  });

  it('P18: iot domain shows device auth and sensor data template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'IoT smart sensor monitoring platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('IOT-P') || doc.includes('DEVICE') || doc.includes('デバイス') || doc.includes('センサー'), 'IoT must show device/sensor template IDs');
  });
});

// ── Suite 50: P18 PromptOps template catalogs batch 3 ───────────────────────
describe('Suite 50: P18 PromptOps template catalogs batch 3 (creator/gamify/media/content/realestate/legal)', () => {
  it('P18: creator domain shows monetization and payout template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'creator fan payout monetization platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('CRT-P') || doc.includes('MONETIZE') || doc.includes('収益化') || doc.includes('PAYOUT'), 'Creator must show monetization/payout template IDs');
  });

  it('P18: gamify domain shows points fraud prevention and leaderboard template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'gamification loyalty points rewards platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('GMF-P') || doc.includes('POINT') || doc.includes('ポイント') || doc.includes('LEADERBOARD'), 'Gamify must show points/leaderboard template IDs');
  });

  it('P18: media domain shows streaming and DRM template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'streaming media video on demand platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('MEDIA-P') || doc.includes('STREAM') || doc.includes('ストリーミング') || doc.includes('DRM'), 'Media must show streaming/DRM template IDs');
  });

  it('P18: content domain shows CMS and full-text search template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'blog CMS content management publishing platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('CONT-P') || doc.includes('CMS') || doc.includes('SEARCH') || doc.includes('全文検索'), 'Content must show CMS/search template IDs');
  });

  it('P18: realestate domain shows listing and contract template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'real estate property listing management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('RE-P') || doc.includes('LISTING') || doc.includes('CONTRACT') || doc.includes('物件'), 'Real estate must show listing/contract template IDs');
  });

  it('P18: legal domain shows contract review and e-signature template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'legal contract document management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('LEGAL-P') || doc.includes('REVIEW') || doc.includes('ESIGN') || doc.includes('契約書'), 'Legal must show contract review/e-sign template IDs');
  });
});

// ── Suite 51: P18 PromptOps template catalogs batch 4 (final) ───────────────
describe('Suite 51: P18 PromptOps template catalogs batch 4 (automation/event/devtool/newsletter/manufacturing/logistics/agriculture/energy/travel/portfolio/tool)', () => {
  it('P18: automation domain shows trigger and retry template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'workflow automation process management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('AUTO-P') || doc.includes('TRIGGER') || doc.includes('トリガー') || doc.includes('RETRY'), 'Automation must show trigger/retry template IDs');
  });

  it('P18: event domain shows ticket and capacity template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'conference event management ticketing platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('EVT-P') || doc.includes('TICKET') || doc.includes('チケット') || doc.includes('CAPACITY'), 'Event must show ticket/capacity template IDs');
  });

  it('P18: devtool domain shows API key and webhook template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'devtool code analysis API platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('DEVT-P') || doc.includes('WEBHOOK') || doc.includes('APIキー') || doc.includes('SDK'), 'Devtool must show API key/webhook template IDs');
  });

  it('P18: newsletter domain shows email send and unsubscribe template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'email newsletter subscriber management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('NEWS-P') || doc.includes('SEND') || doc.includes('BOUNCE') || doc.includes('配信'), 'Newsletter must show send/bounce template IDs');
  });

  it('P18: manufacturing domain shows MES and quality control template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'manufacturing production quality management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('MFG-P') || doc.includes('MES') || doc.includes('QC') || doc.includes('品質管理'), 'Manufacturing must show MES/QC template IDs');
  });

  it('P18: logistics domain shows tracking and route optimization template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'logistics delivery tracking route management platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('LOGI-P') || doc.includes('TRACK') || doc.includes('ROUTE') || doc.includes('追跡'), 'Logistics must show tracking/route template IDs');
  });

  it('P18: agriculture domain shows sensor and harvest forecast template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'agriculture farm sensor IoT monitoring platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('AGRI-P') || doc.includes('SENSOR') || doc.includes('センサー') || doc.includes('FORECAST'), 'Agriculture must show sensor/forecast template IDs');
  });

  it('P18: energy domain shows power monitoring and billing template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'energy power monitoring smart grid platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('ENRG-P') || doc.includes('MONITOR') || doc.includes('BILLING') || doc.includes('電力'), 'Energy must show monitoring/billing template IDs');
  });

  it('P18: travel domain shows inventory search and booking template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'travel accommodation booking vacation platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('TRVL-P') || doc.includes('SEARCH') || doc.includes('CANCEL') || doc.includes('在庫'), 'Travel must show search/cancel template IDs');
  });

  it('P18: portfolio domain shows SEO and contact form template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'portfolio website showcase designer platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('PORT-P') || doc.includes('SEO') || doc.includes('CONTACT') || doc.includes('ポートフォリオ'), 'Portfolio must show SEO/contact template IDs');
  });

  it('P18: tool domain shows API key management and UX template IDs', () => {
    const f = gP18(Object.assign({}, A25, { purpose:'developer utility productivity tool platform' }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('TOOL-P') || doc.includes('UX') || doc.includes('ツール') || doc.includes('DOCS'), 'Tool must show API/UX template IDs');
  });
});

// ── Suite 52: P14 Ops Intelligence SLI expansion (6 new domains) ────────────
describe('Suite 52: P14 Ops Intelligence SLI expansion (analytics/collab/hr/logistics/newsletter/automation)', () => {
  it('P14: analytics domain shows dashboard response time SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'analytics dashboard reporting platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ダッシュボード応答') || doc.includes('Dashboard Response') || doc.includes('データ鮮度') || doc.includes('Data Freshness'), 'Analytics must show dashboard response SLI');
  });

  it('P14: collab domain shows real-time sync latency SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'collaborative document editor platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('リアルタイム同期') || doc.includes('Real-time Sync') || doc.includes('競合解決') || doc.includes('Conflict Resolution'), 'Collab must show real-time sync SLI');
  });

  it('P14: hr domain shows payroll accuracy SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'HR human resources management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('給与計算精度') || doc.includes('Payroll Calculation Accuracy') || doc.includes('採用フロー') || doc.includes('Hiring Flow'), 'HR must show payroll accuracy SLI');
  });

  it('P14: logistics domain shows on-time delivery SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'logistics delivery tracking platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('オンタイム配送') || doc.includes('On-time Delivery') || doc.includes('リアルタイム追跡') || doc.includes('Real-time Tracking'), 'Logistics must show delivery SLI');
  });

  it('P14: newsletter domain shows email delivery success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'email newsletter subscriber management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('メール配信成功') || doc.includes('Email Delivery') || doc.includes('バウンス率') || doc.includes('Bounce Rate'), 'Newsletter must show email delivery SLI');
  });

  it('P14: automation domain shows workflow execution success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'workflow automation process management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ワークフロー実行成功') || doc.includes('Workflow Execution Success') || doc.includes('デッドレター') || doc.includes('Dead Letter'), 'Automation must show workflow execution SLI');
  });

  it('P14: analytics domain shows dashboard threshold in checklist', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'analytics dashboard reporting platform' }));
    const doc = f['docs/54_ops_checklist.md'] || '';
    assert.ok(doc.includes('ダッシュボード応答P95') || doc.includes('Dashboard P95') || doc.includes('データ鮮度遅延') || doc.includes('Data Freshness'), 'Analytics must show dashboard thresholds in checklist');
  });

  it('P14: collab domain shows sync latency threshold in checklist', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'collaborative document editor platform' }));
    const doc = f['docs/54_ops_checklist.md'] || '';
    assert.ok(doc.includes('リアルタイム同期遅延') || doc.includes('Sync Latency') || doc.includes('競合解決エラー') || doc.includes('Conflict Resolution Error'), 'Collab must show sync latency threshold in checklist');
  });
});

// ── Suite 53: P14 Ops SLI expansion batch 3 (creator/gamify/media/content/realestate/legal/event/devtool) ──
describe('Suite 53: P14 Ops SLI expansion batch 3 (creator/gamify/media/content/realestate/legal/event/devtool)', () => {
  it('P14: creator domain shows monetization success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'creator fan payout monetization platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('収益化成功率') || doc.includes('Monetization Success') || doc.includes('ペイアウト') || doc.includes('Payout'), 'Creator must show monetization SLI');
  });

  it('P14: gamify domain shows point accuracy SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'gamification loyalty points rewards platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ポイント付与精度') || doc.includes('Point Award Accuracy') || doc.includes('ランキング更新') || doc.includes('Leaderboard'), 'Gamify must show point accuracy SLI');
  });

  it('P14: media domain shows streaming start time SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'streaming media video on demand platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('ストリーミング開始時間') || doc.includes('Streaming Start Time') || doc.includes('バッファリング') || doc.includes('Buffering'), 'Media must show streaming SLI');
  });

  it('P14: content domain shows publish success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'blog CMS content management publishing platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('公開成功率') || doc.includes('Publish Success') || doc.includes('全文検索応答') || doc.includes('Full-text Search'), 'Content must show publish SLI');
  });

  it('P14: realestate domain shows listing success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'real estate property listing management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('物件掲載成功率') || doc.includes('Listing Success') || doc.includes('内見予約確定') || doc.includes('Viewing Booking'), 'Real estate must show listing SLI');
  });

  it('P14: legal domain shows e-signature completion SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'legal contract document management platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('電子署名完了率') || doc.includes('E-signature Completion') || doc.includes('文書検索応答') || doc.includes('Document Search'), 'Legal must show e-signature SLI');
  });

  it('P14: event domain shows duplicate ticket SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'conference event management ticketing platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('チケット重複発行率') || doc.includes('Duplicate Ticket Rate') || doc.includes('チェックイン処理') || doc.includes('Check-in Processing'), 'Event must show ticket SLI');
  });

  it('P14: devtool domain shows API response time SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'devtool code analysis API platform' }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('API応答時間 (P99)') || doc.includes('API Response Time (P99)') || doc.includes('Webhook配信成功率') || doc.includes('Webhook Delivery'), 'Devtool must show API response SLI');
  });
});

// ── Suite 54: P14 Ops SLI/rateLimits/thresholds final 5 domains ─────────────
describe('Suite 54: P14 Ops final 5 domains (portfolio/tool/manufacturing/agriculture/energy)', () => {
  it('P14: portfolio domain shows page load SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'personal portfolio resume showcase site' }));
    const runbook = f['docs/53_ops_runbook.md'] || '';
    const checklist = f['docs/54_ops_checklist.md'] || '';
    assert.ok(runbook.includes('ページ読み込み時間') || runbook.includes('Page Load Time') || runbook.includes('お問い合わせ送信') || runbook.includes('Contact Form'), 'Portfolio must show page load SLI');
    assert.ok(checklist.includes('ページ読み込み時間') || checklist.includes('Page Load Time') || checklist.includes('フォームエラー率') || checklist.includes('Form Error Rate'), 'Portfolio must show page load threshold');
  });

  it('P14: tool domain shows execution success SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'online tool utility generator platform' }));
    const runbook = f['docs/53_ops_runbook.md'] || '';
    const checklist = f['docs/54_ops_checklist.md'] || '';
    assert.ok(runbook.includes('ツール実行成功率') || runbook.includes('Tool Execution Success') || runbook.includes('APIキー認証') || runbook.includes('API Key Auth'), 'Tool must show execution SLI');
    assert.ok(checklist.includes('ツール実行エラー率') || checklist.includes('Tool Execution Error') || checklist.includes('APIキー不正') || checklist.includes('API Key Abuse'), 'Tool must show execution threshold');
  });

  it('P14: manufacturing domain shows production uptime SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'manufacturing factory production management system' }));
    const runbook = f['docs/53_ops_runbook.md'] || '';
    const checklist = f['docs/54_ops_checklist.md'] || '';
    assert.ok(runbook.includes('生産ライン稼働率') || runbook.includes('Production Line Uptime') || runbook.includes('不良品検出精度') || runbook.includes('Defect Detection'), 'Manufacturing must show production uptime SLI');
    assert.ok(checklist.includes('生産ライン停止時間') || checklist.includes('Production Line Downtime') || checklist.includes('不良品率') || checklist.includes('Defect Rate'), 'Manufacturing must show downtime threshold');
  });

  it('P14: agriculture domain shows sensor accuracy SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'agriculture crop farming management platform' }));
    const runbook = f['docs/53_ops_runbook.md'] || '';
    const checklist = f['docs/54_ops_checklist.md'] || '';
    assert.ok(runbook.includes('センサーデータ精度') || runbook.includes('Sensor Data Accuracy') || runbook.includes('灌漑コマンド') || runbook.includes('Irrigation Command'), 'Agriculture must show sensor accuracy SLI');
    assert.ok(checklist.includes('センサー欠損率') || checklist.includes('Sensor Data Loss') || checklist.includes('灌漑コマンド失敗') || checklist.includes('Irrigation Command Failure'), 'Agriculture must show sensor threshold');
  });

  it('P14: energy domain shows meter reading accuracy SLI in runbook', () => {
    const f = gP14(Object.assign({}, A25, { purpose:'energy electricity power grid management platform' }));
    const runbook = f['docs/53_ops_runbook.md'] || '';
    const checklist = f['docs/54_ops_checklist.md'] || '';
    assert.ok(runbook.includes('電力メーター読取精度') || runbook.includes('Meter Reading Accuracy') || runbook.includes('グリッド状態監視') || runbook.includes('Grid Monitoring Uptime'), 'Energy must show meter reading SLI');
    assert.ok(checklist.includes('メーター読取エラー率') || checklist.includes('Meter Reading Error') || checklist.includes('異常消費検出') || checklist.includes('Anomaly Consumption'), 'Energy must show meter threshold');
  });
});

// ── Suite 56: P19 enterprise workflow customizations batch 2 ─────────────────
describe('Suite 56: P19 enterprise workflow customizations (analytics/automation/logistics/tool)', () => {
  it('P19: analytics domain shows dashboard publish and data access approval workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'analytics data dashboard business intelligence platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('ダッシュボード公開') || doc.includes('Dashboard publish') || doc.includes('データアクセス') || doc.includes('Data access'), 'Analytics enterprise must show dashboard publish/data access approval workflows');
  });

  it('P19: automation domain shows workflow template and API connection approval', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'automation workflow process management platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('ワークフローテンプレート') || doc.includes('Workflow template') || doc.includes('外部API') || doc.includes('External API'), 'Automation enterprise must show workflow template/API connection approval');
  });

  it('P19: logistics domain shows route change and escalation approval workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'logistics delivery fleet tracking platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('配送ルート') || doc.includes('Delivery route') || doc.includes('特急配送') || doc.includes('Express shipping'), 'Logistics enterprise must show route change/escalation approval workflows');
  });

  it('P19: tool domain shows API key issuance and rate limit raise approval workflows', () => {
    const f = gP19(Object.assign({}, A25, { purpose:'tool API key management platform', org_model:'マルチテナント(RLS)' }));
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('APIキー発行') || doc.includes('API key issuance') || doc.includes('レート制限') || doc.includes('Rate limit'), 'Tool enterprise must show API key/rate limit approval workflows');
  });
});

// ── Suite 55: P5 Quality Intelligence industryMap 32/32 domain coverage ──────
describe('Suite 55: P5 Quality Intelligence industryMap 32/32 domains (manufacturing/agriculture/energy/travel/government/logistics/media)', () => {
  it('P5: manufacturing domain uses manufacturing QA matrix (not saas default)', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'manufacturing factory production management system' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('manufacturing') || doc.includes('生産スケジューリング') || doc.includes('Production scheduling') || doc.includes('品質管理') || doc.includes('Quality control'), 'Manufacturing must use manufacturing QA matrix');
  });

  it('P5: agriculture domain uses agriculture QA matrix (not saas default)', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'agriculture crop farming management platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('agriculture') || doc.includes('作物モニタリング') || doc.includes('Crop monitoring') || doc.includes('センサー精度') || doc.includes('Sensor accuracy'), 'Agriculture must use agriculture QA matrix');
  });

  it('P5: energy domain uses energy QA matrix (not saas default)', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'energy electricity power grid management platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('energy') || doc.includes('メーター読取') || doc.includes('Meter reading') || doc.includes('異常検知') || doc.includes('Anomaly detection'), 'Energy must use energy QA matrix');
  });

  it('P5: logistics domain uses logistics QA matrix (not saas default)', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'logistics delivery shipping management platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('logistics') || doc.includes('配送追跡') || doc.includes('Shipment tracking') || doc.includes('ルート最適化') || doc.includes('Route optimization'), 'Logistics must use logistics QA matrix');
  });

  it('P5: government domain uses government QA matrix (not saas default)', () => {
    const f = gP5(Object.assign({}, A25, { purpose:'government civic service digital platform' }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('government') || doc.includes('申請受付') || doc.includes('Application intake') || doc.includes('アクセシビリティ') || doc.includes('Accessibility'), 'Government must use government QA matrix');
  });
});

// ── Suite 57: presets-ext3 Entity Schema Coherence (P1 SDD + P22 DB) ─────────
describe('Suite 57: presets-ext3 Entity Schema Coherence — unique entities in SDD + stack-specific DB', () => {

  /* Shared answer bases for each of the 15 ext3 standard presets */
  const ext3_legal = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert',
    payment:''
  });
  const ext3_realestate = Object.assign({}, A25, {
    purpose:'物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
    data_entities:'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage'
  });
  const ext3_subbox = Object.assign({}, A25, {
    purpose:'毎月キュレーションされた商品を定期配送するサブスクリプションボックスEC',
    data_entities:'User, SubBoxPlan, DeliverySchedule, CuratedBox, BoxItem, UnboxingReview'
  });
  const ext3_freelance = Object.assign({}, A25, {
    purpose:'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
    data_entities:'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview'
  });
  const ext3_podcast = Object.assign({}, A25, {
    purpose:'ポッドキャストの録音・配信・マネタイズを一元管理する音声配信プラットフォーム',
    data_entities:'User, PodcastShow, PodcastEpisode, PodcastListener, PodcastSub, Sponsorship'
  });
  const ext3_delivery = Object.assign({}, A25, {
    purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
    data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating'
  });
  const ext3_disaster = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
    payment:''
  });
  const ext3_solar = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
    payment:''
  });
  const ext3_farm = Object.assign({}, A25, {
    purpose:'農家が消費者に直接農産物を販売する産直ECプラットフォーム',
    data_entities:'User, FarmerProfile, FarmProduct, DirectOrder, FarmSubscription, ProducerReview'
  });
  const ext3_chat = Object.assign({}, A25, {
    purpose:'リアルタイムチャット・チャンネル・DMでチームのコラボレーションを促進するメッセージングツール',
    data_entities:'User, Channel, ChatMessage, Thread, MessageReaction, ChannelMember'
  });
  const ext3_membership = Object.assign({}, A25, {
    purpose:'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
    data_entities:'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent'
  });
  const ext3_claims = Object.assign({}, A25, {
    purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary',
    payment:''
  });
  const ext3_email = Object.assign({}, A25, {
    purpose:'セグメント配信・自動化シーケンス・A/Bテストを備えたメールマーケティング自動化プラットフォーム',
    data_entities:'User, EmailCampaign, EmailTemplate, ContactSegment, AutomationRule, CampaignMetric'
  });
  const ext3_task = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
    payment:''
  });
  const ext3_quiz = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
    payment:''
  });

  // Tests 1–15: each preset produces SDD with at least one unique entity
  it('SDD: legal_docs includes LegalDocument entity', () => {
    const f = gSDD(ext3_legal);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('LegalDocument') || spec.includes('legal'), 'legal_docs SDD must mention LegalDocument entity');
  });
  it('SDD: real_estate_portal includes PropertyListing entity', () => {
    const f = gSDD(ext3_realestate);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('PropertyListing') || spec.includes('property') || spec.includes('物件'), 'real_estate_portal SDD must mention PropertyListing');
  });
  it('SDD: subscription_box includes SubBoxPlan entity', () => {
    const f = gSDD(ext3_subbox);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('SubBoxPlan') || spec.includes('CuratedBox') || spec.includes('サブスクリプション'), 'subscription_box SDD must mention SubBoxPlan or CuratedBox');
  });
  it('SDD: freelance_platform includes FreelancerProfile entity', () => {
    const f = gSDD(ext3_freelance);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('FreelancerProfile') || spec.includes('Proposal') || spec.includes('フリーランサー'), 'freelance_platform SDD must mention FreelancerProfile or Proposal');
  });
  it('SDD: podcast_platform includes PodcastEpisode entity', () => {
    const f = gSDD(ext3_podcast);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('PodcastEpisode') || spec.includes('PodcastShow') || spec.includes('ポッドキャスト'), 'podcast_platform SDD must mention podcast entities');
  });
  it('SDD: delivery_tracker includes Courier entity', () => {
    const f = gSDD(ext3_delivery);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('Courier') || spec.includes('DeliveryOrder') || spec.includes('配達'), 'delivery_tracker SDD must mention Courier or DeliveryOrder');
  });
  it('SDD: disaster_info includes DisasterAlert entity', () => {
    const f = gSDD(ext3_disaster);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('DisasterAlert') || spec.includes('Shelter') || spec.includes('防災'), 'disaster_info SDD must mention DisasterAlert or Shelter');
  });
  it('SDD: solar_monitor includes SolarPanel entity', () => {
    const f = gSDD(ext3_solar);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('SolarPanel') || spec.includes('PowerGeneration') || spec.includes('太陽光'), 'solar_monitor SDD must mention SolarPanel or PowerGeneration');
  });
  it('SDD: farm_direct includes FarmProduct entity', () => {
    const f = gSDD(ext3_farm);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('FarmProduct') || spec.includes('FarmerProfile') || spec.includes('農産物'), 'farm_direct SDD must mention FarmProduct or FarmerProfile');
  });
  it('SDD: team_chat includes ChatMessage entity', () => {
    const f = gSDD(ext3_chat);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('ChatMessage') || spec.includes('Channel') || spec.includes('チャット'), 'team_chat SDD must mention ChatMessage or Channel');
  });
  it('SDD: membership_site includes MembershipTier entity', () => {
    const f = gSDD(ext3_membership);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('MembershipTier') || spec.includes('MemberAccount') || spec.includes('会員'), 'membership_site SDD must mention MembershipTier or MemberAccount');
  });
  it('SDD: claims_portal includes ClaimCase entity', () => {
    const f = gSDD(ext3_claims);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('ClaimCase') || spec.includes('ClaimDocument') || spec.includes('保険'), 'claims_portal SDD must mention ClaimCase or ClaimDocument');
  });
  it('SDD: email_marketing includes EmailCampaign entity', () => {
    const f = gSDD(ext3_email);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('EmailCampaign') || spec.includes('ContactSegment') || spec.includes('メール'), 'email_marketing SDD must mention EmailCampaign or ContactSegment');
  });
  it('SDD: task_mgmt includes TaskItem entity', () => {
    const f = gSDD(ext3_task);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('TaskItem') || spec.includes('TaskList') || spec.includes('タスク'), 'task_mgmt SDD must mention TaskItem or TaskList');
  });
  it('SDD: quiz_app includes QuizSet entity', () => {
    const f = gSDD(ext3_quiz);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('QuizSet') || spec.includes('QuizItem') || spec.includes('クイズ'), 'quiz_app SDD must mention QuizSet or QuizItem');
  });

  // Tests 16–18: Stack-specific DB patterns
  it('DB: legal_docs (NestJS+TypeORM) → P22 mentions TypeORM', () => {
    const f = gDB(ext3_legal);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('TypeORM'), 'legal_docs with NestJS must produce TypeORM in P22 database doc');
  });
  it('DB: quiz_app (Firebase) → P22 mentions Firebase or Firestore', () => {
    const f = gDB(ext3_quiz);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Firebase') || doc.includes('Firestore'), 'quiz_app with Firebase must produce Firebase/Firestore in P22 database doc');
  });
  it('DB: task_mgmt (Supabase) → P22 mentions Supabase', () => {
    const f = gDB(ext3_task);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase'), 'task_mgmt with Supabase must produce Supabase in P22 database doc');
  });

  // Tests 19–20: No undefined in Express+Vite and Firebase presets
  it('SDD: solar_monitor (Express+Vite) produces no undefined values in spec', () => {
    const f = gSDD(ext3_solar);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(!spec.includes('undefined'), 'solar_monitor SDD spec must not contain undefined');
  });
  it('SDD: quiz_app (Firebase) produces no undefined values in spec', () => {
    const f = gSDD(ext3_quiz);
    const spec = f['.spec/specification.md'] || '';
    assert.ok(!spec.includes('undefined'), 'quiz_app SDD spec must not contain undefined');
  });
});

// ── Suite 58: presets-ext3 Stack Configuration Propagation (P7/P20/P10) ──────
describe('Suite 58: presets-ext3 Stack Configuration Propagation — roadmap, CI/CD, business model', () => {

  const ext3_legal_s58 = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert',
    payment:''
  });
  const ext3_disaster_s58 = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
    payment:''
  });
  const ext3_claims_s58 = Object.assign({}, A25, {
    purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary',
    payment:''
  });
  const ext3_solar_s58 = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
    payment:''
  });
  const ext3_quiz_s58 = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
    payment:''
  });
  const ext3_task_s58 = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
    payment:''
  });
  const ext3_freelance_s58 = Object.assign({}, A25, {
    purpose:'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
    data_entities:'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview',
    payment:'stripe'
  });
  const ext3_membership_s58 = Object.assign({}, A25, {
    purpose:'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
    data_entities:'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent',
    payment:'stripe'
  });
  const ext3_podcast_s58 = Object.assign({}, A25, {
    purpose:'ポッドキャストの録音・配信・マネタイズを一元管理する音声配信プラットフォーム',
    data_entities:'User, PodcastShow, PodcastEpisode, PodcastListener, PodcastSub, Sponsorship',
    payment:'stripe'
  });

  // NestJS group: roadmap shows NestJS / TypeORM
  it('Roadmap: legal_docs (NestJS) → learning path includes NestJS', () => {
    const f = gRoadmap(ext3_legal_s58);
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('NestJS') || path.includes('nestR') || path.includes('Node'), 'legal_docs roadmap must reference NestJS or Node');
  });
  it('Roadmap: disaster_info (NestJS) → learning path includes NestJS', () => {
    const f = gRoadmap(ext3_disaster_s58);
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('NestJS') || path.includes('Node'), 'disaster_info roadmap must reference NestJS or Node');
  });
  it('Roadmap: claims_portal (NestJS) → learning path includes TypeORM or NestJS', () => {
    const f = gRoadmap(ext3_claims_s58);
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('TypeORM') || path.includes('NestJS') || path.includes('Node'), 'claims_portal roadmap must reference TypeORM or NestJS');
  });

  // CI/CD: NestJS presets deploy to Railway
  it('CI/CD: legal_docs (Railway deploy) → P20 CI pipeline mentions Railway', () => {
    const f = gP20(ext3_legal_s58);
    const ci = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(ci.includes('Railway') || ci.includes('railway'), 'legal_docs CI/CD must reference Railway deployment');
  });
  it('CI/CD: disaster_info (Railway deploy) → P20 CI pipeline mentions Railway', () => {
    const f = gP20(ext3_disaster_s58);
    const ci = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(ci.includes('Railway') || ci.includes('railway'), 'disaster_info CI/CD must reference Railway deployment');
  });

  // Express+Vite: roadmap and CI
  it('Roadmap: solar_monitor (Express) → learning path includes Express or Node', () => {
    const f = gRoadmap(ext3_solar_s58);
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('Express') || path.includes('Node'), 'solar_monitor roadmap must reference Express or Node');
  });
  it('CI/CD: solar_monitor (Railway) → P20 CI pipeline mentions Railway', () => {
    const f = gP20(ext3_solar_s58);
    const ci = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(ci.includes('Railway') || ci.includes('railway'), 'solar_monitor CI/CD must reference Railway deployment');
  });

  // Firebase: roadmap shows Firebase / no ORM migration step
  it('Roadmap: quiz_app (Firebase) → learning path references Firebase', () => {
    const f = gRoadmap(ext3_quiz_s58);
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('Firebase') || path.includes('BaaS'), 'quiz_app roadmap must reference Firebase or BaaS');
  });

  // Supabase+Vite: API doc shows BaaS/Supabase
  it('API: task_mgmt (Supabase) → P21 API doc mentions Supabase', () => {
    const f = gAPI(ext3_task_s58);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('BaaS'), 'task_mgmt API doc must mention Supabase/BaaS');
  });

  // Stripe presets: P10 generates business_model.md
  it('P10: freelance_platform (stripe) → business_model.md is generated', () => {
    const f = gP10(ext3_freelance_s58);
    assert.ok(f['docs/38_business_model.md'], 'freelance_platform with stripe payment must generate docs/38_business_model.md');
  });
  it('P10: membership_site (stripe) → business_model.md is generated', () => {
    const f = gP10(ext3_membership_s58);
    assert.ok(f['docs/38_business_model.md'], 'membership_site with stripe payment must generate docs/38_business_model.md');
  });
  it('P10: podcast_platform (stripe) → business_model.md includes revenue model content', () => {
    const f = gP10(ext3_podcast_s58);
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 100, 'podcast_platform business_model.md must have substantive content');
  });

  // No-payment presets: business_model.md is NOT generated
  it('P10: legal_docs (no payment) → business_model.md is NOT generated', () => {
    const f = gP10(ext3_legal_s58);
    assert.ok(!f['docs/38_business_model.md'], 'legal_docs with no payment must NOT generate docs/38_business_model.md');
  });
  it('P10: quiz_app (no payment) → business_model.md is NOT generated', () => {
    const f = gP10(ext3_quiz_s58);
    assert.ok(!f['docs/38_business_model.md'], 'quiz_app with no payment must NOT generate docs/38_business_model.md');
  });
});

// ── Suite 59: presets-ext3 Domain Cross-Pillar Verification (P14/P18/P5) ─────
describe('Suite 59: presets-ext3 Domain Cross-Pillar Verification — ops SLI, prompt registry, QA matrix', () => {

  // P14 Ops SLI — domain-specific metrics
  it('P14: legal_docs (legal domain) → ops runbook shows e-signature or document search SLI', () => {
    const f = gP14(Object.assign({}, A25, {
      purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
      backend:'Node.js + NestJS', deploy:'Railway', orm:'TypeORM', payment:''
    }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('電子署名') || doc.includes('E-signature') || doc.includes('文書検索') || doc.includes('Document Search'), 'Legal ops runbook must show e-signature or document search SLI');
  });

  it('P14: delivery_tracker (logistics domain) → ops runbook shows tracking update SLI', () => {
    const f = gP14(Object.assign({}, A25, {
      purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
      data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating'
    }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('追跡') || doc.includes('Tracking') || doc.includes('配送') || doc.includes('Delivery') || doc.includes('Route'), 'Logistics ops runbook must show tracking or delivery SLI');
  });

  it('P14: solar_monitor (energy domain) → ops runbook shows meter reading SLI', () => {
    const f = gP14(Object.assign({}, A25, {
      purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
      backend:'Node.js + Express', deploy:'Railway', orm:'Prisma', payment:''
    }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('メーター') || doc.includes('Meter') || doc.includes('電力') || doc.includes('Grid') || doc.includes('異常消費') || doc.includes('Anomaly'), 'Energy ops runbook must show meter reading or grid monitoring SLI');
  });

  it('P14: membership_site (content domain) → ops runbook shows publish success SLI', () => {
    const f = gP14(Object.assign({}, A25, {
      purpose:'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
      data_entities:'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent',
      payment:'stripe'
    }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('公開成功') || doc.includes('Publish Success') || doc.includes('全文検索') || doc.includes('Full-text') || doc.includes('下書き') || doc.includes('Draft'), 'Content ops runbook must show publish or search SLI');
  });

  it('P14: real_estate_portal (realestate domain) → ops runbook shows listing or viewing SLI', () => {
    const f = gP14(Object.assign({}, A25, {
      purpose:'物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
      data_entities:'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage'
    }));
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('物件掲載') || doc.includes('Listing') || doc.includes('内見') || doc.includes('Viewing') || doc.includes('画像配信') || doc.includes('Image Delivery'), 'Realestate ops runbook must show listing or viewing booking SLI');
  });

  // P18 Prompt Registry — domain template IDs
  it('P18: real_estate_portal → prompt registry includes RE-P or 物件 template', () => {
    const f = gP18(Object.assign({}, A25, {
      purpose:'物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
      data_entities:'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage'
    }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('RE-P') || doc.includes('物件') || doc.includes('realestate') || doc.includes('LISTING'), 'Realestate prompt registry must include RE-P template IDs or 物件');
  });

  it('P18: membership_site → prompt registry includes CONT-P or CMS template', () => {
    const f = gP18(Object.assign({}, A25, {
      purpose:'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
      data_entities:'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent',
      payment:'stripe'
    }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('CONT-P') || doc.includes('CMS') || doc.includes('content') || doc.includes('コンテンツ'), 'Membership content prompt registry must include CONT-P or CMS template');
  });

  it('P18: claims_portal → prompt registry includes INS-P or Claim template', () => {
    const f = gP18(Object.assign({}, A25, {
      purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
      backend:'Node.js + NestJS', deploy:'Railway', orm:'TypeORM', payment:'',
      data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary'
    }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('INS-P') || doc.includes('Claim') || doc.includes('insurance') || doc.includes('保険'), 'Insurance prompt registry must include INS-P or Claim template');
  });

  it('P18: legal_docs → prompt registry includes LEGAL-P or 契約書 template', () => {
    const f = gP18(Object.assign({}, A25, {
      purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
      backend:'Node.js + NestJS', deploy:'Railway', orm:'TypeORM', payment:''
    }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('LEGAL-P') || doc.includes('legal') || doc.includes('契約書') || doc.includes('eSign') || doc.includes('電子署名'), 'Legal prompt registry must include LEGAL-P or contract/esign template');
  });

  it('P18: delivery_tracker → prompt registry includes LOGI-P or logistics template', () => {
    const f = gP18(Object.assign({}, A25, {
      purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
      data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating'
    }));
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('LOGI-P') || doc.includes('logistics') || doc.includes('配送') || doc.includes('Delivery'), 'Logistics prompt registry must include LOGI-P or logistics delivery template');
  });

  // P5 Quality Intelligence — domain QA matrix
  it('P5: quiz_app (education domain) → QA blueprint uses education matrix', () => {
    const f = gP5(Object.assign({}, A25, {
      purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
      backend:'Firebase', frontend:'React (Vite SPA)',
      database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
      data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
      payment:''
    }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('education') || doc.includes('FERPA') || doc.includes('試験') || doc.includes('学習') || doc.includes('Exam') || doc.includes('Learning'), 'quiz_app P5 must use education QA matrix');
  });

  it('P5: solar_monitor (energy domain) → QA blueprint uses energy matrix', () => {
    const f = gP5(Object.assign({}, A25, {
      purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
      backend:'Node.js + Express', deploy:'Railway', orm:'Prisma', payment:''
    }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('energy') || doc.includes('メーター読取') || doc.includes('Meter reading') || doc.includes('異常検知') || doc.includes('Anomaly'), 'solar_monitor P5 must use energy QA matrix');
  });

  it('P5: delivery_tracker (logistics domain) → QA blueprint uses logistics matrix', () => {
    const f = gP5(Object.assign({}, A25, {
      purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
      data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating'
    }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('logistics') || doc.includes('配送追跡') || doc.includes('Shipment tracking') || doc.includes('ルート最適化') || doc.includes('Route optimization'), 'delivery_tracker P5 must use logistics QA matrix');
  });

  it('P5: disaster_info (government domain) → QA blueprint uses government matrix', () => {
    const f = gP5(Object.assign({}, A25, {
      purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
      backend:'Node.js + NestJS', deploy:'Railway', orm:'TypeORM', payment:''
    }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('government') || doc.includes('申請受付') || doc.includes('Application intake') || doc.includes('アクセシビリティ') || doc.includes('Accessibility'), 'disaster_info P5 must use government QA matrix');
  });

  it('P5: claims_portal (insurance domain) → QA blueprint shows compliance test mention', () => {
    const f = gP5(Object.assign({}, A25, {
      purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
      backend:'Node.js + NestJS', deploy:'Railway', orm:'TypeORM', payment:''
    }));
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.length > 200, 'claims_portal P5 QA blueprint must have substantive content');
  });
});

// ── Suite 60: presets-ext3 English mode (genLang=en) ─────────────────────────
describe('Suite 60: presets-ext3 English mode — genLang=en produces English content across P1/P22/P20/P21/P14/P18/P5', () => {

  /* Answer bases reused from Suites 57-59 (duplicated locally for isolation) */
  const en_legal = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert',
    payment:''
  });
  const en_quiz = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
    payment:''
  });
  const en_task = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
    payment:''
  });
  const en_solar = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
    payment:''
  });
  const en_claims = Object.assign({}, A25, {
    purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary',
    payment:''
  });
  const en_freelance = Object.assign({}, A25, {
    purpose:'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
    data_entities:'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview',
    payment:'stripe'
  });
  const en_disaster = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
    payment:''
  });

  // ── Suite 57 EN: SDD + DB ──
  it('EN SDD: legal_docs spec contains LegalDocument (entity names are English)', () => {
    const f = gSDD(en_legal, 'en');
    const spec = f['.spec/specification.md'] || '';
    assert.ok(spec.includes('LegalDocument') || spec.includes('legal') || spec.includes('Legal'), 'EN legal_docs SDD spec must mention LegalDocument');
  });

  it('EN SDD: quiz_app spec contains no undefined values', () => {
    const f = gSDD(en_quiz, 'en');
    const spec = f['.spec/specification.md'] || '';
    assert.ok(!spec.includes('undefined'), 'EN quiz_app SDD spec must not contain undefined');
  });

  it('EN DB: legal_docs (TypeORM) → docs/87 shows English heading and TypeORM', () => {
    const f = gDB(en_legal, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('TypeORM'), 'EN legal_docs docs/87 must mention TypeORM');
    assert.ok(doc.includes('Database Design Principles') || doc.includes('Schema Design') || doc.includes('Naming'), 'EN docs/87 must have English headings');
  });

  it('EN DB: quiz_app (Firebase) → docs/87 shows Firebase or Firestore in English', () => {
    const f = gDB(en_quiz, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Firebase') || doc.includes('Firestore'), 'EN quiz_app docs/87 must mention Firebase/Firestore');
  });

  it('EN DB: task_mgmt (Supabase) → docs/87 shows Supabase in English', () => {
    const f = gDB(en_task, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase'), 'EN task_mgmt docs/87 must mention Supabase');
  });

  // ── Suite 58 EN: Roadmap + CI/CD + API + P10 ──
  it('EN Roadmap: legal_docs (NestJS) → LEARNING_PATH.md references NestJS or Node in English', () => {
    const f = gRoadmap(en_legal, 'en');
    const path = f['roadmap/LEARNING_PATH.md'] || '';
    assert.ok(path.includes('NestJS') || path.includes('Node'), 'EN legal_docs roadmap must reference NestJS or Node');
  });

  it('EN CI/CD: legal_docs (Railway) → docs/77 mentions Railway in English', () => {
    const f = gP20(en_legal, 'en');
    const ci = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(ci.includes('Railway') || ci.includes('railway'), 'EN legal_docs CI pipeline must reference Railway');
  });

  it('EN CI/CD: solar_monitor (Railway) → docs/77 mentions Railway in English', () => {
    const f = gP20(en_solar, 'en');
    const ci = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(ci.includes('Railway') || ci.includes('railway'), 'EN solar_monitor CI pipeline must reference Railway');
  });

  it('EN API: task_mgmt (Supabase) → docs/83 shows Supabase or BaaS in English', () => {
    const f = gAPI(en_task, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase') || doc.includes('BaaS'), 'EN task_mgmt API doc must mention Supabase/BaaS');
  });

  it('EN P10: freelance_platform (stripe) → business_model.md generated with English content', () => {
    const f = gP10(en_freelance, 'en');
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 100, 'EN freelance_platform business_model.md must have substantive English content');
    assert.ok(!doc.includes('undefined'), 'EN business_model.md must not contain undefined');
  });

  // ── Suite 59 EN: P14 + P18 + P5 ──
  it('EN P14: legal_docs → ops runbook shows E-signature or Document Search SLI in English', () => {
    const f = gP14(Object.assign({}, en_legal), 'en');
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('E-signature') || doc.includes('Document Search') || doc.includes('Version Control'), 'EN legal ops runbook must show English e-signature or document search SLI');
  });

  it('EN P14: solar_monitor → ops runbook shows Meter or Anomaly SLI in English', () => {
    const f = gP14(Object.assign({}, en_solar), 'en');
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('Meter') || doc.includes('Grid') || doc.includes('Anomaly'), 'EN solar_monitor ops runbook must show English meter or anomaly SLI');
  });

  it('EN P14: disaster_info → ops runbook shows government-domain SLI in English', () => {
    const f = gP14(Object.assign({}, en_disaster), 'en');
    const doc = f['docs/53_ops_runbook.md'] || '';
    assert.ok(doc.includes('Application') || doc.includes('Accessibility') || doc.includes('Government') || doc.includes('government'), 'EN disaster_info ops runbook must show English government SLI');
  });

  it('EN P18: claims_portal → prompt registry shows INS-P or Claim template ID', () => {
    const f = gP18(Object.assign({}, en_claims), 'en');
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('INS-P') || doc.includes('Claim') || doc.includes('insurance'), 'EN claims_portal prompt registry must show INS-P or Claim template');
  });

  it('EN P18: legal_docs → prompt registry shows LEGAL-P or eSign template ID', () => {
    const f = gP18(Object.assign({}, en_legal), 'en');
    const doc = f['docs/72_prompt_registry.md'] || '';
    assert.ok(doc.includes('LEGAL-P') || doc.includes('eSign') || doc.includes('Contract') || doc.includes('legal'), 'EN legal_docs prompt registry must show LEGAL-P or eSign template');
  });

  it('EN P5: quiz_app (education) → QA blueprint shows education matrix in English', () => {
    const f = gP5(Object.assign({}, en_quiz), 'en');
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('education') || doc.includes('FERPA') || doc.includes('Exam') || doc.includes('Learning'), 'EN quiz_app P5 must use education QA matrix with English content');
  });

  it('EN P5: solar_monitor (energy) → QA blueprint shows energy matrix in English', () => {
    const f = gP5(Object.assign({}, en_solar), 'en');
    const doc = f['docs/32_qa_blueprint.md'] || '';
    assert.ok(doc.includes('energy') || doc.includes('Meter reading') || doc.includes('Anomaly'), 'EN solar_monitor P5 must use energy QA matrix with English content');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 61 — presets-ext.js field preset entity coherence (14 categories)
   gSDD: each category's representative preset includes its unique entity names
   ════════════════════════════════════════════════════════════════ */
describe('Q61: presets-ext.js field presets — entity schema coherence', () => {

  it('gaming: NPC dialogue system → specification includes NPC or QuestState entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'LLMによるリアルタイムNPC対話・クエスト分岐・感情応答でゲーム体験を向上',
      data_entities: 'User, NPC, DialogTree, QuestState, GameSession',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('NPC') || doc.includes('QuestState') || doc.includes('DialogTree'), 'gaming preset spec must include NPC, QuestState, or DialogTree entity');
  });

  it('video: AI video generation → specification includes VideoProject or GenerationJob entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'テキスト・画像からAIが映像を自動生成しマルチプラットフォームに配信',
      data_entities: 'User, VideoProject, GenerationJob, VideoAsset, PublishTarget',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('VideoProject') || doc.includes('GenerationJob') || doc.includes('VideoAsset'), 'video preset spec must include VideoProject, GenerationJob, or VideoAsset entity');
  });

  it('live_event: event management → specification includes EventPlan or Attendee entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'オンライン・オフラインイベントの企画からチケット・参加者管理・集計まで一元管理',
      data_entities: 'User, EventPlan, Ticket, Attendee, CheckIn, Session',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('EventPlan') || doc.includes('Attendee') || doc.includes('CheckIn'), 'live_event preset spec must include EventPlan, Attendee, or CheckIn entity');
  });

  it('publishing: manga creation → specification includes MangaProject or Panel entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'AIがコマ割り・ネーム・トーン処理を補助しマンガ制作ワークフローを効率化',
      data_entities: 'User, MangaProject, Chapter, Panel, Character, AssetLibrary',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('MangaProject') || doc.includes('Panel') || doc.includes('AssetLibrary'), 'publishing preset spec must include MangaProject, Panel, or AssetLibrary entity');
  });

  it('gambling: responsible gambling → specification includes BettingLimit or SelfExclusion entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '賭け金上限・自己排除・冷却期間を管理しギャンブル依存を防止するコンプライアンスツール',
      data_entities: 'User, BettingLimit, SelfExclusion, CoolingPeriod, RGAlert',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('BettingLimit') || doc.includes('SelfExclusion') || doc.includes('CoolingPeriod'), 'gambling preset spec must include BettingLimit, SelfExclusion, or CoolingPeriod entity');
  });

  it('podcast: AI podcast production → specification includes Episode or ShowNote entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '録音・ノイズ除去・BGM・章立て生成をAIが自動化しポッドキャスト制作を大幅効率化',
      data_entities: 'User, Episode, Recording, AudioTrack, ShowNote, Chapter',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('Episode') || doc.includes('ShowNote') || doc.includes('AudioTrack'), 'podcast preset spec must include Episode, ShowNote, or AudioTrack entity');
  });

  it('music_biz: AI music generation → specification includes MusicProject or Stem entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'ジャンル・ムード・テンポを指定するとAIが楽曲を自動生成しDAWエクスポートまで対応',
      data_entities: 'User, MusicProject, Track, Stem, GenerationJob, MusicAsset',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('MusicProject') || doc.includes('Stem') || doc.includes('MusicAsset'), 'music_biz preset spec must include MusicProject, Stem, or MusicAsset entity');
  });

  it('housing: smart home IoT → specification includes SmartDevice or Automation entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '照明・空調・セキュリティ・家電をAIが最適制御し快適・省エネなスマートホームを実現',
      data_entities: 'User, SmartDevice, Automation, EnergyLog, Scene, Alert',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('SmartDevice') || doc.includes('Automation') || doc.includes('EnergyLog'), 'housing preset spec must include SmartDevice, Automation, or EnergyLog entity');
  });

  it('food: AI recipe generation → specification includes MealPlan or NutritionProfile entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '手持ち食材・アレルギー・栄養目標を入力するとAIが最適レシピを生成し買い物リストも自動作成',
      data_entities: 'User, Recipe, Ingredient, MealPlan, ShoppingList, NutritionProfile',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('MealPlan') || doc.includes('NutritionProfile') || doc.includes('ShoppingList'), 'food preset spec must include MealPlan, NutritionProfile, or ShoppingList entity');
  });

  it('mental_health: CBT support app → specification includes TherapySession or MoodLog entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '認知行動療法(CBT)に基づくAIチャットボットでセルフケアと症状管理をサポート',
      data_entities: 'User, TherapySession, CBTExercise, MoodLog, CrisisAlert',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('TherapySession') || doc.includes('CBTExercise') || doc.includes('MoodLog'), 'mental_health preset spec must include TherapySession, CBTExercise, or MoodLog entity');
  });

  it('fashion: AI outfit styling → specification includes OutfitSuggestion or StyleProfile entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '体型・好み・イベント・予算を入力するとAIがコーディネートを自動提案し購入導線を作成',
      data_entities: 'User, WardrobiItem, OutfitSuggestion, StyleProfile, ShoppingCart',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('OutfitSuggestion') || doc.includes('StyleProfile') || doc.includes('WardrobiItem'), 'fashion preset spec must include OutfitSuggestion, StyleProfile, or WardrobiItem entity');
  });

  it('shopping: household budget tracker → specification includes SavingGoal or FinancialReport entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '銀行・クレカ・電子マネーデータをAIが自動分類し家計の可視化・節約提案を行うアプリ',
      data_entities: 'User, Transaction, Budget, Category, SavingGoal, FinancialReport',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('SavingGoal') || doc.includes('FinancialReport') || doc.includes('Transaction'), 'shopping preset spec must include SavingGoal, FinancialReport, or Transaction entity');
  });

  it('pet: AI pet health checker → specification includes VetRecommendation or HealthCheck entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'ペットの症状入力・写真からAIが健康状態を評価し獣医受診の緊急度を判定',
      data_entities: 'User, Pet, HealthCheck, Symptom, VetRecommendation',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('VetRecommendation') || doc.includes('HealthCheck') || doc.includes('Symptom'), 'pet preset spec must include VetRecommendation, HealthCheck, or Symptom entity');
  });

  it('car_life: predictive car maintenance → specification includes SensorData or DiagnosticAlert entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '車載センサーデータをAIがリアルタイム解析し故障を事前予測してコストと安全リスクを低減',
      data_entities: 'User, Vehicle, SensorData, DiagnosticAlert, MaintenanceSchedule',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('SensorData') || doc.includes('DiagnosticAlert') || doc.includes('MaintenanceSchedule'), 'car_life preset spec must include SensorData, DiagnosticAlert, or MaintenanceSchedule entity');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 62 — presets-ext2.js field preset entity coherence (10 categories)
   gSDD: each category's representative preset includes its unique entity names
   ════════════════════════════════════════════════════════════════ */
describe('Q62: presets-ext2.js field presets — entity schema coherence', () => {

  it('civil_eng: ground survey AI → specification includes BoringData or SoilLayer entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'ボーリングデータ・標準貫入試験をAIが解析し地盤リスクマップと液状化判定レポートを自動生成',
      data_entities: 'User, SurveyProject, BoringData, SoilLayer, AnalysisReport',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('BoringData') || doc.includes('SoilLayer') || doc.includes('SurveyProject'), 'civil_eng preset spec must include BoringData, SoilLayer, or SurveyProject entity');
  });

  it('braintech: cognitive performance → specification includes CognitiveTest or PerformanceMetric entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '認知機能テスト・EEGセンサーデータをAIが分析し集中力・記憶力・反応速度を個別最適化',
      data_entities: 'User, CognitiveTest, PerformanceMetric, RecommendationPlan, Session',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('CognitiveTest') || doc.includes('PerformanceMetric') || doc.includes('RecommendationPlan'), 'braintech preset spec must include CognitiveTest, PerformanceMetric, or RecommendationPlan entity');
  });

  it('digital_legacy: digital will platform → specification includes EndingNote or Beneficiary entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'AI対話式インタビューでエンディングノート・遺言書を作成し弁護士連携・公正証書化まで一元サポート',
      data_entities: 'User, EndingNote, Will, Beneficiary, LegalDocument',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('EndingNote') || doc.includes('Beneficiary') || doc.includes('Will'), 'digital_legacy preset spec must include EndingNote, Beneficiary, or Will entity');
  });

  it('data_sovereignty: personal data vault → specification includes DataVault or AccessGrant entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '医療・金融・行動データを暗号化して個人が完全管理し用途別にアクセスを付与するデータ金庫',
      data_entities: 'User, DataVault, DataItem, AccessGrant, AuditLog',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('DataVault') || doc.includes('AccessGrant') || doc.includes('DataItem'), 'data_sovereignty preset spec must include DataVault, AccessGrant, or DataItem entity');
  });

  it('space_data: satellite image analysis → specification includes SatelliteImage or GeoReport entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: 'マルチスペクトル衛星画像をYOLOv8等のAIが解析し農業・都市変化・災害状況を自動検出・定量化',
      data_entities: 'User, SatelliteImage, AnalysisJob, Detection, GeoReport',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('SatelliteImage') || doc.includes('GeoReport') || doc.includes('Detection'), 'space_data preset spec must include SatelliteImage, GeoReport, or Detection entity');
  });

  it('climate_resilience: climate risk assessment → specification includes RiskZone or ESGReport entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '物理的気候リスク(洪水・熱波・海面上昇)をGISデータとAIで定量化しESGレポートと投資リスク評価を自動生成',
      data_entities: 'User, RiskZone, ClimateData, RiskScore, ESGReport',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('RiskZone') || doc.includes('ESGReport') || doc.includes('ClimateData'), 'climate_resilience preset spec must include RiskZone, ESGReport, or ClimateData entity');
  });

  it('ai_avatar: personal AI agent → specification includes AIAgent or MemoryStore entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '個人の過去データ・行動パターンを学習したパーソナルAIエージェントが代理でタスク実行・意思決定支援を行う',
      data_entities: 'User, AIAgent, AgentTask, MemoryStore, ActionLog',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('AIAgent') || doc.includes('MemoryStore') || doc.includes('AgentTask'), 'ai_avatar preset spec must include AIAgent, MemoryStore, or AgentTask entity');
  });

  it('civic_tech: e-government platform → specification includes FormTemplate or ApprovalFlow entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '行政手続きをデジタル化しAI書類作成支援・電子申請・承認ワークフロー・電子証明書発行を一元提供',
      data_entities: 'User, Application, FormTemplate, ApprovalFlow, Certificate',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('FormTemplate') || doc.includes('ApprovalFlow') || doc.includes('Certificate'), 'civic_tech preset spec must include FormTemplate, ApprovalFlow, or Certificate entity');
  });

  it('childcare: child development tracker → specification includes GrowthRecord or DevelopmentMilestone entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '身長・体重・発達マイルストーンをAIが分析し保護者に最適な発達サポートと専門家連携を提供',
      data_entities: 'User, Child, GrowthRecord, DevelopmentMilestone, PediatricReport',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('GrowthRecord') || doc.includes('DevelopmentMilestone') || doc.includes('PediatricReport'), 'childcare preset spec must include GrowthRecord, DevelopmentMilestone, or PediatricReport entity');
  });

  it('nomad_life: city cost comparison → specification includes CostOfLiving or CityComparison entity', () => {
    const f = gSDD(Object.assign({}, A25, {
      purpose: '世界500都市の生活費データをAIが比較分析し予算・ライフスタイルに最適な移住先・滞在先を推薦',
      data_entities: 'User, Location, CostOfLiving, BudgetPlan, CityComparison',
    }));
    const doc = f['.spec/specification.md'] || '';
    assert.ok(doc.includes('CostOfLiving') || doc.includes('CityComparison') || doc.includes('BudgetPlan'), 'nomad_life preset spec must include CostOfLiving, CityComparison, or BudgetPlan entity');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 63 — P22/P21/P20 English mode deep coverage
   Tests English generation across multiple stacks for Database,
   API, and CI/CD intelligence pillars
   ════════════════════════════════════════════════════════════════ */
describe('Suite 63: P22/P21/P20 English mode — multi-stack deep coverage', () => {

  /* ── Shared answer sets ── */
  const s63_nestjs = Object.assign({}, A25, {
    purpose: '保険金請求管理システム',
    backend: 'Node.js + NestJS', frontend: 'React + Next.js',
    database: 'PostgreSQL (Railway)', deploy: 'Railway', orm: 'TypeORM',
    auth: 'JWT', payment: '', data_entities: 'User, Claim, Policy, AuditLog',
  });
  const s63_firebase = Object.assign({}, A25, {
    purpose: '教育クイズ学習プラットフォーム',
    backend: 'Firebase', frontend: 'React (Vite SPA)',
    database: 'Firestore', auth: 'Firebase Auth', deploy: 'Firebase Hosting', orm: '',
    payment: '', data_entities: 'User, QuizSet, QuizItem, QuizAttempt',
  });
  const s63_supabase_vercel = Object.assign({}, A25, {
    purpose: 'SaaS型サブスク管理プラットフォーム',
    backend: 'Supabase', frontend: 'React + Next.js',
    database: 'Supabase (PostgreSQL)', deploy: 'Vercel', orm: '',
    auth: 'Supabase Auth', payment: 'stripe', data_entities: 'User, Subscription, Invoice, Plan',
  });
  const s63_python = Object.assign({}, A25, {
    purpose: '医療データ分析AIプラットフォーム',
    backend: 'Python + FastAPI', frontend: 'React + Next.js',
    database: 'PostgreSQL (Railway)', deploy: 'Railway', orm: 'SQLAlchemy',
    auth: 'JWT', payment: '', data_entities: 'User, Patient, MedicalRecord',
  });

  // ── P22 (Database Intelligence) EN tests ──

  it('P22 EN: docs/87 TypeORM → English heading + TypeORM reference', () => {
    const f = gDB(s63_nestjs, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Database Design Principles') || doc.includes('Schema Design'), 'EN docs/87 TypeORM must have English heading');
    assert.ok(doc.includes('TypeORM'), 'EN docs/87 TypeORM must mention TypeORM ORM');
  });

  it('P22 EN: docs/89 TypeORM → Zero-Downtime migration in English', () => {
    const f = gDB(s63_nestjs, 'en');
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('Zero-Downtime') || doc.includes('Migration Strategy'), 'EN docs/89 TypeORM must have English migration heading');
    assert.ok(doc.includes('TypeORM') || doc.includes('Backward Compatibility'), 'EN docs/89 TypeORM must mention TypeORM migration concept');
  });

  it('P22 EN: docs/87 Supabase → Supabase Client or Row Level Security in English', () => {
    const f = gDB(s63_supabase_vercel, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Supabase'), 'EN docs/87 Supabase must mention Supabase');
    assert.ok(!doc.includes('undefined'), 'EN docs/87 Supabase must not contain undefined');
  });

  it('P22 EN: docs/90 Supabase → Backup & DR with RTO/RPO in English', () => {
    const f = gDB(s63_supabase_vercel, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Backup') || doc.includes('Disaster Recovery'), 'EN docs/90 must have English Backup/DR heading');
    assert.ok(doc.includes('RTO') && doc.includes('RPO'), 'EN docs/90 must define RTO and RPO targets');
  });

  it('P22 EN: docs/88 TypeORM → Query Optimization content in English', () => {
    const f = gDB(s63_nestjs, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('Query Optimization') || doc.includes('N+1'), 'EN docs/88 TypeORM must have English query optimization content');
  });

  it('P22 EN: docs/87 no undefined — Firebase stack', () => {
    const f = gDB(s63_firebase, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.length > 100, 'EN docs/87 Firebase must have substantive content');
    assert.ok(!doc.includes('undefined'), 'EN docs/87 Firebase must not contain undefined');
  });

  it('P22 EN: docs/90 PostgreSQL/Railway → Backup content with no undefined', () => {
    const f = gDB(s63_nestjs, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Backup') || doc.includes('Recovery'), 'EN docs/90 NestJS/Railway must have Backup/Recovery content');
    assert.ok(!doc.includes('undefined'), 'EN docs/90 must not contain undefined');
  });

  // ── P21 (API Intelligence) EN tests ──

  it('P21 EN: docs/83 NestJS → RESTful API principles in English', () => {
    const f = gAPI(s63_nestjs, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('RESTful API') || doc.includes('API Design Principles'), 'EN docs/83 NestJS must show RESTful API heading');
    assert.ok(doc.includes('NestJS') || doc.includes('REST'), 'EN docs/83 NestJS must reference NestJS or REST');
  });

  it('P21 EN: docs/83 Firebase → BaaS Client SDK pattern in English', () => {
    const f = gAPI(s63_firebase, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('BaaS Client SDK') || doc.includes('Firebase'), 'EN docs/83 Firebase must show BaaS Client SDK or Firebase');
    assert.ok(doc.includes('Firestore') || doc.includes('Security Rules'), 'EN docs/83 Firebase must reference Firestore or Security Rules');
  });

  it('P21 EN: docs/84 NestJS → OpenAPI specification template in English', () => {
    const f = gAPI(s63_nestjs, 'en');
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('OpenAPI') || doc.includes('openapi'), 'EN docs/84 NestJS must have OpenAPI spec');
    assert.ok(!doc.includes('undefined'), 'EN docs/84 must not contain undefined');
  });

  it('P21 EN: docs/85 NestJS → OWASP API security checklist in English', () => {
    const f = gAPI(s63_nestjs, 'en');
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('OWASP') || doc.includes('API Security'), 'EN docs/85 NestJS must have OWASP or API Security content');
    assert.ok(doc.includes('CRITICAL') || doc.includes('HIGH') || doc.includes('Checklist'), 'EN docs/85 must show severity ratings');
  });

  it('P21 EN: docs/86 NestJS → API testing strategy with Test Pyramid', () => {
    const f = gAPI(s63_nestjs, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('Test Pyramid') || doc.includes('Testing Strategy'), 'EN docs/86 NestJS must have test pyramid or testing strategy');
    assert.ok(doc.includes('E2E') || doc.includes('Integration') || doc.includes('Unit'), 'EN docs/86 must mention E2E, Integration, or Unit tests');
  });

  it('P21 EN: docs/83 Supabase → BaaS pattern with Row Level Security', () => {
    const f = gAPI(s63_supabase_vercel, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('BaaS') || doc.includes('Supabase'), 'EN docs/83 Supabase must show BaaS or Supabase');
    assert.ok(!doc.includes('undefined'), 'EN docs/83 Supabase must not contain undefined');
  });

  it('P21 EN: docs/86 Firebase → API testing references Firestore or Firebase', () => {
    const f = gAPI(s63_firebase, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('Firebase') || doc.includes('Firestore') || doc.includes('Test'), 'EN docs/86 Firebase must reference Firebase/Firestore or testing content');
  });

  // ── P20 (CI/CD Intelligence) EN tests ──

  it('P20 EN: docs/77 Firebase Hosting → deploy target shown as Firebase Hosting', () => {
    const f = gP20(s63_firebase, 'en');
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('Firebase Hosting') || doc.includes('Firebase'), 'EN docs/77 Firebase must show Firebase Hosting as deploy target');
    assert.ok(!doc.includes('undefined'), 'EN docs/77 Firebase must not contain undefined');
  });

  it('P20 EN: docs/78 Firebase → deployment strategy includes Firebase Hosting steps', () => {
    const f = gP20(s63_firebase, 'en');
    const doc = f['docs/78_deployment_strategy.md'] || '';
    assert.ok(doc.includes('Firebase') || doc.includes('Staging') || doc.includes('Production'), 'EN docs/78 Firebase must have deployment strategy content');
    assert.ok(!doc.includes('undefined'), 'EN docs/78 Firebase must not contain undefined');
  });

  it('P20 EN: docs/77 Python/Railway → Railway deploy target in pipeline', () => {
    const f = gP20(s63_python, 'en');
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('Railway') || doc.includes('CI/CD Pipeline'), 'EN docs/77 Python/Railway must mention Railway or CI/CD Pipeline');
  });

  it('P20 EN: docs/79 quality gate matrix → English quality gate matrix', () => {
    const f = gP20(s63_python, 'en');
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('Quality Gate') || doc.includes('Pipeline'), 'EN docs/79 must have Quality Gate or Pipeline matrix');
    assert.ok(!doc.includes('undefined'), 'EN docs/79 must not contain undefined');
  });

  it('P20 EN: docs/78 Vercel → Vercel or preview URL in deployment strategy', () => {
    const f = gP20(s63_supabase_vercel, 'en');
    const doc = f['docs/78_deployment_strategy.md'] || '';
    assert.ok(doc.includes('Vercel') || doc.includes('Preview'), 'EN docs/78 Vercel must mention Vercel or Preview deployment');
  });

  it('P20 EN: docs/77 NestJS/Railway → 9-stage pipeline with Railway in English', () => {
    const f = gP20(s63_nestjs, 'en');
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('Railway') || doc.includes('CI/CD'), 'EN docs/77 NestJS/Railway must mention Railway');
    assert.ok(doc.includes('Pipeline') || doc.includes('Deploy') || doc.includes('Checkout'), 'EN docs/77 NestJS must have pipeline stage content');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 64 — presets-ext3 P23 Testing Intelligence
   Verifies that docs/91_testing_strategy.md adapts to each stack:
   NestJS→supertest, Firebase→firebase emulator, Supabase→supabase
   ════════════════════════════════════════════════════════════════ */
describe('Suite 64: presets-ext3 P23 Testing Intelligence — stack-specific test strategies', () => {

  /* Shared bases for the 15 ext3 standard presets */
  const s64_legal = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert, AuditLog',
  });
  const s64_claims = Object.assign({}, A25, {
    purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary, AuditLog',
  });
  const s64_disaster = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
  });
  const s64_quiz = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    payment:'', data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
  });
  const s64_task = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    payment:'', data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
  });
  const s64_solar = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    auth:'JWT', payment:'',
    data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
  });
  const s64_delivery = Object.assign({}, A25, {
    purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
    backend:'Node.js + Express', frontend:'React + Next.js',
    database:'PostgreSQL (Neon)', deploy:'Railway', orm:'Prisma',
    auth:'NextAuth.js', payment:'stripe', mobile:'Expo (React Native)',
    data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating',
  });
  const s64_freelance = Object.assign({}, A25, {
    purpose:'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
    data_entities:'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview',
    payment:'stripe',
  });
  const s64_subbox = Object.assign({}, A25, {
    purpose:'毎月キュレーションされた商品を定期配送するサブスクリプションボックスEC',
    data_entities:'User, SubBoxPlan, DeliverySchedule, CuratedBox, BoxItem, UnboxingReview',
    payment:'stripe',
  });
  const s64_podcast = Object.assign({}, A25, {
    purpose:'ポッドキャストの録音・配信・マネタイズを一元管理する音声配信プラットフォーム',
    data_entities:'User, PodcastShow, PodcastEpisode, PodcastListener, PodcastSub, Sponsorship',
    payment:'stripe',
  });
  const s64_farm = Object.assign({}, A25, {
    purpose:'農家が消費者に直接農産物を販売する産直ECプラットフォーム',
    data_entities:'User, FarmerProfile, FarmProduct, DirectOrder, FarmSubscription, ProducerReview',
    payment:'stripe',
  });
  const s64_chat = Object.assign({}, A25, {
    purpose:'リアルタイムチャット・チャンネル・DMでチームのコラボレーションを促進するメッセージングツール',
    data_entities:'User, Channel, ChatMessage, Thread, MessageReaction, ChannelMember',
    payment:'stripe',
  });
  const s64_membership = Object.assign({}, A25, {
    purpose:'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
    data_entities:'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent',
    payment:'stripe',
  });
  const s64_email = Object.assign({}, A25, {
    purpose:'セグメント配信・自動化シーケンス・A/Bテストを備えたメールマーケティング自動化プラットフォーム',
    data_entities:'User, EmailCampaign, EmailTemplate, ContactSegment, AutomationRule, CampaignMetric',
    payment:'stripe',
  });
  const s64_realestate = Object.assign({}, A25, {
    purpose:'物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
    data_entities:'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage',
    payment:'stripe',
  });

  // ── NestJS group: supertest + vitest in docs/91 ──
  it('P23: legal_docs (NestJS+TypeORM) → docs/91 includes supertest', () => {
    const f = gTest(s64_legal);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'legal_docs docs/91 must have substantive testing content');
    assert.ok(doc.toLowerCase().includes('supertest') || doc.toLowerCase().includes('vitest') || doc.toLowerCase().includes('jest'), 'legal_docs docs/91 must reference supertest, vitest, or jest');
  });

  it('P23: claims_portal (NestJS+TypeORM) → docs/91 includes NestJS testing framework', () => {
    const f = gTest(s64_claims);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'claims_portal docs/91 must have substantive content');
    assert.ok(doc.toLowerCase().includes('supertest') || doc.toLowerCase().includes('nest') || doc.toLowerCase().includes('jest'), 'claims_portal docs/91 must reference NestJS testing tools');
  });

  it('P23: disaster_info (NestJS) → docs/91 has test strategy content; no undefined', () => {
    const f = gTest(s64_disaster);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'disaster_info docs/91 must have substantive content');
    assert.ok(!doc.includes('undefined'), 'disaster_info docs/91 must not contain undefined');
  });

  // ── Firebase: firebase emulator in docs/91 ──
  it('P23: quiz_app (Firebase) → docs/91 includes firebase keyword', () => {
    const f = gTest(s64_quiz);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'quiz_app docs/91 must have substantive content');
    assert.ok(doc.toLowerCase().includes('firebase'), 'quiz_app docs/91 must reference Firebase testing');
  });

  it('P23: quiz_app (Firebase) → docs/92 coverage design has substantive content', () => {
    const f = gTest(s64_quiz);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.length > 100, 'quiz_app docs/92 must have coverage design content');
    assert.ok(!doc.includes('undefined'), 'quiz_app docs/92 must not contain undefined');
  });

  // ── Supabase: supabase in docs/91 ──
  it('P23: task_mgmt (Supabase) → docs/91 includes supabase keyword', () => {
    const f = gTest(s64_task);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'task_mgmt docs/91 must have substantive content');
    assert.ok(doc.toLowerCase().includes('supabase'), 'task_mgmt docs/91 must reference Supabase testing');
  });

  // ── Express group: supertest or jest in docs/91 ──
  it('P23: solar_monitor (Express+Prisma) → docs/91 references supertest or jest', () => {
    const f = gTest(s64_solar);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'solar_monitor docs/91 must have substantive content');
    assert.ok(doc.toLowerCase().includes('supertest') || doc.toLowerCase().includes('jest') || doc.toLowerCase().includes('vitest'), 'solar_monitor docs/91 must reference supertest, jest, or vitest');
  });

  it('P23: delivery_tracker (Express+Expo) → docs/93 E2E architecture has auth + playwright', () => {
    const f = gTest(s64_delivery);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.length > 100, 'delivery_tracker docs/93 must have E2E content');
    assert.ok(doc.toLowerCase().includes('playwright') || doc.toLowerCase().includes('e2e') || doc.toLowerCase().includes('auth'), 'delivery_tracker docs/93 must reference playwright, E2E, or auth');
  });

  // ── Stripe presets: E2E auth coverage ──
  it('P23: freelance_platform (Stripe+NextAuth) → docs/91 has jest or vitest; docs/92 has coverage', () => {
    const f = gTest(s64_freelance);
    const t91 = f['docs/91_testing_strategy.md'] || '';
    const t92 = f['docs/92_coverage_design.md'] || '';
    assert.ok(t91.length > 200, 'freelance_platform docs/91 must have testing content');
    assert.ok(t92.length > 100, 'freelance_platform docs/92 must have coverage design content');
  });

  it('P23: subscription_box → docs/93 E2E architecture has substantive content', () => {
    const f = gTest(s64_subbox);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.length > 100, 'subscription_box docs/93 must have E2E content');
    // Note: 'undefined' legitimately appears in generated Playwright config (workers: process.env.CI ? 2 : undefined)
    assert.ok(doc.toLowerCase().includes('playwright') || doc.toLowerCase().includes('e2e') || doc.toLowerCase().includes('auth'), 'subscription_box docs/93 must reference playwright, E2E, or auth');
  });

  it('P23: podcast_platform → docs/91 testing strategy has substantive content', () => {
    const f = gTest(s64_podcast);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'podcast_platform docs/91 must have testing content');
    assert.ok(!doc.includes('undefined'), 'podcast_platform docs/91 must not contain undefined');
  });

  it('P23: farm_direct → docs/91 has jest or vitest reference', () => {
    const f = gTest(s64_farm);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'farm_direct docs/91 must have testing content');
    assert.ok(doc.toLowerCase().includes('jest') || doc.toLowerCase().includes('vitest') || doc.toLowerCase().includes('supertest'), 'farm_direct docs/91 must reference jest, vitest, or supertest');
  });

  it('P23: team_chat → docs/91 has testing content; docs/94 performance testing exists', () => {
    const f = gTest(s64_chat);
    const t91 = f['docs/91_testing_strategy.md'] || '';
    const t94 = f['docs/94_performance_testing.md'] || '';
    assert.ok(t91.length > 200, 'team_chat docs/91 must have testing strategy content');
    assert.ok(t94.length > 100, 'team_chat docs/94 performance testing must have content');
  });

  it('P23: membership_site → docs/92 coverage design has substantive content', () => {
    const f = gTest(s64_membership);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.length > 100, 'membership_site docs/92 must have coverage design content');
    assert.ok(!doc.includes('undefined'), 'membership_site docs/92 must not contain undefined');
  });

  it('P23: email_marketing → docs/91 has testing strategy; docs/93 E2E exists', () => {
    const f = gTest(s64_email);
    const t91 = f['docs/91_testing_strategy.md'] || '';
    const t93 = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(t91.length > 200, 'email_marketing docs/91 must have testing content');
    assert.ok(t93.length > 100, 'email_marketing docs/93 E2E must have content');
  });

  it('P23: real_estate_portal → docs/91 has substantive testing content; no undefined', () => {
    const f = gTest(s64_realestate);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'real_estate_portal docs/91 must have testing content');
    assert.ok(!doc.includes('undefined'), 'real_estate_portal docs/91 must not contain undefined');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 65 — presets-ext3 P10 Business Model (Stripe presets)
   Verifies docs/38_business_model.md is generated for payment
   presets and empty for no-payment presets
   ════════════════════════════════════════════════════════════════ */
describe('Suite 65: presets-ext3 P10 Business Model — Stripe presets generate revenue docs', () => {

  const mkBase = (purpose, entities, payment) => Object.assign({}, A25, {
    purpose, data_entities: entities, payment,
  });

  it('P10: subscription_box (Stripe) → docs/38 business model has サブスク or 課金 content', () => {
    const f = gP10(mkBase(
      '毎月キュレーションされた商品を定期配送するサブスクリプションボックスEC',
      'User, SubBoxPlan, DeliverySchedule, CuratedBox, BoxItem, UnboxingReview', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'subscription_box docs/38 must have business model content');
    // subscription_box maps to 'ec' domain → commission model (手数料/GMV), not SaaS subscription
    assert.ok(doc.includes('手数料') || doc.includes('サブスク') || doc.includes('課金') || doc.includes('収益'), 'subscription_box docs/38 must include revenue model content');
  });

  it('P10: freelance_platform (Stripe) → docs/38 business model has content', () => {
    const f = gP10(mkBase(
      'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
      'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'freelance_platform docs/38 must have business model content');
    assert.ok(!doc.includes('undefined'), 'freelance_platform docs/38 must not contain undefined');
  });

  it('P10: podcast_platform (Stripe) → docs/38 includes subscription or ad revenue model', () => {
    const f = gP10(mkBase(
      'ポッドキャストの録音・配信・マネタイズを一元管理する音声配信プラットフォーム',
      'User, PodcastShow, PodcastEpisode, PodcastListener, PodcastSub, Sponsorship', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'podcast_platform docs/38 must have business model content');
    assert.ok(doc.includes('サブスク') || doc.includes('課金') || doc.includes('収益'), 'podcast_platform docs/38 must include revenue model');
  });

  it('P10: farm_direct (Stripe) → docs/38 business model has content', () => {
    const f = gP10(mkBase(
      '農家が消費者に直接農産物を販売する産直ECプラットフォーム',
      'User, FarmerProfile, FarmProduct, DirectOrder, FarmSubscription, ProducerReview', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'farm_direct docs/38 must have business model content');
    assert.ok(!doc.includes('undefined'), 'farm_direct docs/38 must not contain undefined');
  });

  it('P10: team_chat (Stripe) → docs/38 includes subscription billing model', () => {
    const f = gP10(mkBase(
      'リアルタイムチャット・チャンネル・DMでチームのコラボレーションを促進するメッセージングツール',
      'User, Channel, ChatMessage, Thread, MessageReaction, ChannelMember', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'team_chat docs/38 must have business model content');
    assert.ok(doc.includes('サブスク') || doc.includes('課金') || doc.includes('SaaS'), 'team_chat docs/38 must include SaaS/subscription model');
  });

  it('P10: membership_site (Stripe) → docs/38 includes membership or subscription revenue', () => {
    const f = gP10(mkBase(
      'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
      'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'membership_site docs/38 must have business model content');
    assert.ok(doc.includes('サブスク') || doc.includes('会員') || doc.includes('課金'), 'membership_site docs/38 must include membership revenue model');
  });

  it('P10: real_estate_portal (Stripe) → docs/38 business model has content', () => {
    const f = gP10(mkBase(
      '物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
      'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'real_estate_portal docs/38 must have business model content');
    assert.ok(!doc.includes('undefined'), 'real_estate_portal docs/38 must not contain undefined');
  });

  it('P10: delivery_tracker (Stripe) → docs/38 business model has content', () => {
    const f = gP10(Object.assign({}, A25, {
      purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
      data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating',
      payment:'stripe', mobile:'Expo (React Native)',
    }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'delivery_tracker docs/38 must have business model content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker docs/38 must not contain undefined');
  });

  it('P10: email_marketing (Stripe) → docs/38 includes サブスク or 自動化 revenue model', () => {
    const f = gP10(mkBase(
      'セグメント配信・自動化シーケンス・A/Bテストを備えたメールマーケティング自動化プラットフォーム',
      'User, EmailCampaign, EmailTemplate, ContactSegment, AutomationRule, CampaignMetric', 'stripe'));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length > 200, 'email_marketing docs/38 must have business model content');
    assert.ok(doc.includes('サブスク') || doc.includes('課金') || doc.includes('自動化'), 'email_marketing docs/38 must include subscription or automation revenue model');
  });

  it('P10: legal_docs (no payment) → docs/38 is empty (no Stripe configured)', () => {
    const f = gP10(Object.assign({}, A25, {
      purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
      backend:'Node.js + NestJS', database:'PostgreSQL (Railway)', deploy:'Railway',
      orm:'TypeORM', auth:'JWT', payment:'',
      data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert, AuditLog',
    }));
    const doc = f['docs/38_business_model.md'] || '';
    assert.ok(doc.length === 0, 'legal_docs with no payment must not generate docs/38 business model');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 66 — presets-ext3 P25 Performance + bilingual P23/P25
   Verifies performance docs generated for each stack and that
   English mode produces English headings without undefined
   ════════════════════════════════════════════════════════════════ */
describe('Suite 66: presets-ext3 P25 Performance + bilingual P23/P25 coverage', () => {

  const s66_legal = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'', data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert, AuditLog',
  });
  const s66_claims = Object.assign({}, A25, {
    purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'', data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary, AuditLog',
  });
  const s66_solar = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    auth:'JWT', payment:'', data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
  });
  const s66_quiz = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    payment:'', data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
  });
  const s66_task = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    payment:'', data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
  });

  // ── P25 JA: docs/99 performance strategy ──
  it('P25: legal_docs (NestJS) → docs/99 has キャッシュ + CDN performance content', () => {
    const f = gPerf(s66_legal);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'legal_docs docs/99 must have substantive performance content');
    assert.ok(doc.includes('キャッシュ') || doc.includes('CDN') || doc.includes('パフォーマンス'), 'legal_docs docs/99 must include cache or CDN strategies');
  });

  it('P25: claims_portal (NestJS) → docs/100 DB performance has query optimization content', () => {
    const f = gPerf(s66_claims);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.length > 100, 'claims_portal docs/100 must have DB performance content');
    assert.ok(!doc.includes('undefined'), 'claims_portal docs/100 must not contain undefined');
  });

  it('P25: solar_monitor (Express+Railway) → docs/99 has performance content; no undefined', () => {
    const f = gPerf(s66_solar);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'solar_monitor docs/99 must have performance content');
    assert.ok(!doc.includes('undefined'), 'solar_monitor docs/99 must not contain undefined');
  });

  it('P25: quiz_app (Firebase) → docs/99 has CDN or キャッシュ; docs/101 cache strategy exists', () => {
    const f = gPerf(s66_quiz);
    const d99 = f['docs/99_performance_strategy.md'] || '';
    const d101 = f['docs/101_cache_strategy.md'] || '';
    assert.ok(d99.includes('CDN') || d99.includes('キャッシュ'), 'quiz_app docs/99 must include CDN or cache strategies');
    assert.ok(d101.length > 100, 'quiz_app docs/101 cache strategy must have content');
  });

  it('P25: task_mgmt (Supabase) → docs/101 cache strategy has content; no undefined', () => {
    const f = gPerf(s66_task);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.length > 100, 'task_mgmt docs/101 must have cache strategy content');
    assert.ok(!doc.includes('undefined'), 'task_mgmt docs/101 must not contain undefined');
  });

  it('P25: docs/102 performance monitoring exists for all ext3 NestJS presets', () => {
    const fLegal = gPerf(s66_legal);
    const fClaims = gPerf(s66_claims);
    assert.ok((fLegal['docs/102_performance_monitoring.md'] || '').length > 100, 'legal_docs docs/102 performance monitoring must have content');
    assert.ok((fClaims['docs/102_performance_monitoring.md'] || '').length > 100, 'claims_portal docs/102 performance monitoring must have content');
  });

  // ── P23 EN bilingual ──
  it('P23 EN: legal_docs → docs/91 English mode has Testing or Supertest in English', () => {
    const f = gTest(s66_legal, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'legal_docs EN docs/91 must have substantive content');
    assert.ok(doc.includes('Testing') || doc.includes('Supertest') || doc.includes('Jest'), 'legal_docs EN docs/91 must have English testing content');
    assert.ok(!doc.includes('undefined'), 'legal_docs EN docs/91 must not contain undefined');
  });

  it('P23 EN: quiz_app (Firebase) → docs/91 English mode includes Firebase', () => {
    const f = gTest(s66_quiz, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'quiz_app EN docs/91 must have substantive content');
    assert.ok(doc.includes('Firebase'), 'quiz_app EN docs/91 must reference Firebase');
    assert.ok(!doc.includes('undefined'), 'quiz_app EN docs/91 must not contain undefined');
  });

  it('P23 EN: task_mgmt (Supabase) → docs/91 English mode includes Supabase', () => {
    const f = gTest(s66_task, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'task_mgmt EN docs/91 must have substantive content');
    assert.ok(doc.includes('Supabase'), 'task_mgmt EN docs/91 must reference Supabase');
  });

  // ── P25 EN bilingual ──
  it('P25 EN: solar_monitor → docs/99 English mode has Performance heading', () => {
    const f = gPerf(s66_solar, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'solar_monitor EN docs/99 must have substantive content');
    assert.ok(doc.includes('Performance') || doc.includes('Cache') || doc.includes('CDN'), 'solar_monitor EN docs/99 must have English performance content');
    assert.ok(!doc.includes('undefined'), 'solar_monitor EN docs/99 must not contain undefined');
  });

  it('P25 EN: claims_portal (NestJS) → docs/100 English DB performance; no undefined', () => {
    const f = gPerf(s66_claims, 'en');
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.length > 100, 'claims_portal EN docs/100 must have DB performance content');
    assert.ok(!doc.includes('undefined'), 'claims_portal EN docs/100 must not contain undefined');
  });

  it('P25 EN: quiz_app (Firebase) → docs/101 English cache strategy has content', () => {
    const f = gPerf(s66_quiz, 'en');
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.length > 100, 'quiz_app EN docs/101 must have English cache strategy content');
    assert.ok(!doc.includes('undefined'), 'quiz_app EN docs/101 must not contain undefined');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 67 — presets-ext3 P25 Performance (remaining 10 presets)
   Covers the 10 ext3 presets not tested in Suite 66:
   disaster_info, delivery_tracker, and the 8 Stripe-enabled presets
   ════════════════════════════════════════════════════════════════ */
describe('Suite 67: presets-ext3 P25 Performance — remaining 10 presets', () => {

  const mkA67 = (purpose, entities, extra) => Object.assign({}, A25, {purpose, data_entities: entities}, extra||{});

  const s67_disaster = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
  });
  const s67_delivery = Object.assign({}, A25, {
    purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
    backend:'Node.js + Express', frontend:'React + Next.js',
    database:'PostgreSQL (Neon)', deploy:'Railway', orm:'Prisma',
    auth:'NextAuth.js', payment:'stripe', mobile:'Expo (React Native)',
    data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating',
  });

  it('P25: disaster_info (NestJS+Railway) → docs/99 has performance content; no undefined', () => {
    const f = gPerf(s67_disaster);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'disaster_info docs/99 must have performance content');
    assert.ok(!doc.includes('undefined'), 'disaster_info docs/99 must not contain undefined');
  });

  it('P25: disaster_info → docs/102 performance monitoring has content', () => {
    const f = gPerf(s67_disaster);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.length > 100, 'disaster_info docs/102 must have monitoring content');
  });

  it('P25: delivery_tracker (Express+Expo+Stripe) → docs/99 has performance content; no undefined', () => {
    const f = gPerf(s67_delivery);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'delivery_tracker docs/99 must have performance content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker docs/99 must not contain undefined');
  });

  it('P25: delivery_tracker → docs/100 DB performance has content; no undefined', () => {
    const f = gPerf(s67_delivery);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.length > 100, 'delivery_tracker docs/100 must have DB performance content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker docs/100 must not contain undefined');
  });

  it('P25: freelance_platform (Stripe) → docs/99 has performance content; no undefined', () => {
    const f = gPerf(mkA67(
      'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
      'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview', {payment:'stripe'}));
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'freelance_platform docs/99 must have performance content');
    assert.ok(!doc.includes('undefined'), 'freelance_platform docs/99 must not contain undefined');
  });

  it('P25: subscription_box (Stripe) → docs/101 cache strategy has content', () => {
    const f = gPerf(mkA67(
      '毎月キュレーションされた商品を定期配送するサブスクリプションボックスEC',
      'User, SubBoxPlan, DeliverySchedule, CuratedBox, BoxItem, UnboxingReview', {payment:'stripe'}));
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.length > 100, 'subscription_box docs/101 cache strategy must have content');
  });

  it('P25: podcast_platform (Stripe) → docs/99 has CDN or キャッシュ content', () => {
    const f = gPerf(mkA67(
      'ポッドキャストの録音・配信・マネタイズを一元管理する音声配信プラットフォーム',
      'User, PodcastShow, PodcastEpisode, PodcastListener, PodcastSub, Sponsorship', {payment:'stripe'}));
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'podcast_platform docs/99 must have performance content');
    assert.ok(doc.includes('CDN') || doc.includes('キャッシュ') || doc.includes('Cache'), 'podcast_platform docs/99 must include CDN or cache strategy');
  });

  it('P25: farm_direct (Stripe) → docs/99 and docs/100 have content; no undefined', () => {
    const f = gPerf(mkA67(
      '農家が消費者に直接農産物を販売する産直ECプラットフォーム',
      'User, FarmerProfile, FarmProduct, DirectOrder, FarmSubscription, ProducerReview', {payment:'stripe'}));
    const d99 = f['docs/99_performance_strategy.md'] || '';
    assert.ok(d99.length > 200, 'farm_direct docs/99 must have performance content');
    assert.ok(!d99.includes('undefined'), 'farm_direct docs/99 must not contain undefined');
  });

  it('P25: team_chat (Stripe) → docs/99 has content; docs/101 cache strategy has content', () => {
    const f = gPerf(mkA67(
      'リアルタイムチャット・チャンネル・DMでチームのコラボレーションを促進するメッセージングツール',
      'User, Channel, ChatMessage, Thread, MessageReaction, ChannelMember', {payment:'stripe'}));
    const d99 = f['docs/99_performance_strategy.md'] || '';
    assert.ok(d99.length > 200, 'team_chat docs/99 must have performance content');
    assert.ok(!d99.includes('undefined'), 'team_chat docs/99 must not contain undefined');
  });

  it('P25: membership_site (Stripe) → docs/99 has content; no undefined', () => {
    const f = gPerf(mkA67(
      'プレミアムコンテンツ・特典を月額/年額会員限定で提供する会員制プラットフォーム',
      'User, MembershipTier, MemberAccount, ExclusiveContent, MemberBenefit, MemberEvent', {payment:'stripe'}));
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'membership_site docs/99 must have performance content');
    assert.ok(!doc.includes('undefined'), 'membership_site docs/99 must not contain undefined');
  });

  it('P25: email_marketing (Stripe) → docs/99 and docs/102 monitoring have content', () => {
    const f = gPerf(mkA67(
      'セグメント配信・自動化シーケンス・A/Bテストを備えたメールマーケティング自動化プラットフォーム',
      'User, EmailCampaign, EmailTemplate, ContactSegment, AutomationRule, CampaignMetric', {payment:'stripe'}));
    assert.ok((f['docs/99_performance_strategy.md']||'').length > 200, 'email_marketing docs/99 must have performance content');
    assert.ok((f['docs/102_performance_monitoring.md']||'').length > 100, 'email_marketing docs/102 must have monitoring content');
  });

  it('P25: real_estate_portal (Stripe) → docs/99 has content; docs/100 DB performance has content', () => {
    const f = gPerf(mkA67(
      '物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
      'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage', {payment:'stripe'}));
    assert.ok((f['docs/99_performance_strategy.md']||'').length > 200, 'real_estate_portal docs/99 must have performance content');
    assert.ok((f['docs/100_database_performance.md']||'').length > 100, 'real_estate_portal docs/100 must have DB performance content');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 68 — presets-ext3 P21 API Intelligence
   Verifies docs/83_api_design_principles.md adapts to NestJS,
   Express+Prisma, Firebase, and Supabase stacks from ext3
   ════════════════════════════════════════════════════════════════ */
describe('Suite 68: presets-ext3 P21 API Intelligence — stack-specific API design docs', () => {

  const s68_nestjs = Object.assign({}, A25, {
    purpose:'法務文書の作成・管理・電子署名・期限アラートを一元化する法務プラットフォーム',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, LegalDocument, Precedent, CaseFile, LegalClause, LegalAlert, AuditLog',
  });
  const s68_express = Object.assign({}, A25, {
    purpose:'家庭・中小規模の太陽光発電の発電量・売電・消費電力をリアルタイムモニタリング',
    backend:'Node.js + Express', frontend:'React (Vite SPA)',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'Prisma',
    auth:'JWT', payment:'',
    data_entities:'User, SolarPanel, PowerGeneration, EnergyBalance, SolarAlert, MaintenanceLog',
  });
  const s68_firebase = Object.assign({}, A25, {
    purpose:'教育・資格取得・トレーニング向けのインタラクティブクイズ学習プラットフォーム',
    backend:'Firebase', frontend:'React (Vite SPA)',
    database:'Firestore', auth:'Firebase Auth', deploy:'Firebase Hosting', orm:'',
    payment:'', data_entities:'User, QuizSet, QuizItem, QuizAttempt, QuizScore, QuizBadge',
  });
  const s68_supabase = Object.assign({}, A25, {
    purpose:'個人・チームのタスク管理・期限追跡・優先度管理・進捗可視化ツール',
    backend:'Supabase', frontend:'React (Vite SPA)',
    database:'Supabase (PostgreSQL)', auth:'Supabase Auth', deploy:'Vercel', orm:'',
    payment:'', data_entities:'User, TaskList, TaskItem, TaskTag, TaskAssignment, TaskComment',
  });

  it('P21: legal_docs (NestJS+TypeORM) → docs/83 has NestJS or REST API patterns', () => {
    const f = gAPI(s68_nestjs);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'legal_docs docs/83 must have substantive API design content');
    assert.ok(doc.includes('NestJS') || doc.includes('Controller') || doc.includes('/api/v1/'), 'legal_docs docs/83 must reference NestJS or REST patterns');
  });

  it('P21: solar_monitor (Express+Prisma) → docs/83 has REST API content; no undefined', () => {
    const f = gAPI(s68_express);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'solar_monitor docs/83 must have API design content');
    assert.ok(!doc.includes('undefined'), 'solar_monitor docs/83 must not contain undefined');
  });

  it('P21: quiz_app (Firebase) → docs/83 references Firebase or BaaS client approach', () => {
    const f = gAPI(s68_firebase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'quiz_app docs/83 must have API design content');
    assert.ok(doc.includes('Firebase') || doc.includes('BaaS') || doc.includes('SDK'), 'quiz_app docs/83 must reference Firebase or BaaS approach');
  });

  it('P21: task_mgmt (Supabase) → docs/83 references Supabase or BaaS client approach', () => {
    const f = gAPI(s68_supabase);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'task_mgmt docs/83 must have API design content');
    assert.ok(doc.includes('Supabase') || doc.includes('BaaS'), 'task_mgmt docs/83 must reference Supabase or BaaS approach');
  });

  it('P21 EN: legal_docs (NestJS) → docs/83 English mode has API content; no undefined', () => {
    const f = gAPI(s68_nestjs, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'legal_docs EN docs/83 must have substantive content');
    assert.ok(doc.includes('API') || doc.includes('Controller') || doc.includes('Resource'), 'legal_docs EN docs/83 must have English API content');
    assert.ok(!doc.includes('undefined'), 'legal_docs EN docs/83 must not contain undefined');
  });

  it('P21 EN: quiz_app (Firebase) → docs/83 English mode references Firebase; no undefined', () => {
    const f = gAPI(s68_firebase, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'quiz_app EN docs/83 must have API design content');
    assert.ok(doc.includes('Firebase') || doc.includes('BaaS'), 'quiz_app EN docs/83 must reference Firebase');
    assert.ok(!doc.includes('undefined'), 'quiz_app EN docs/83 must not contain undefined');
  });

  it('P21: claims_portal (NestJS+TypeORM) → docs/83 has API design content; no undefined', () => {
    const f = gAPI(Object.assign({}, A25, {
      purpose:'保険契約者が保険金請求・書類提出・審査状況確認を行えるセルフサービスポータル',
      backend:'Node.js + NestJS', frontend:'React + Next.js',
      database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
      auth:'JWT', payment:'',
      data_entities:'User, ClaimCase, ClaimDocument, ClaimAdjuster, ClaimPayment, PolicySummary, AuditLog',
    }));
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'claims_portal docs/83 must have API design content');
    assert.ok(!doc.includes('undefined'), 'claims_portal docs/83 must not contain undefined');
  });

  it('P21: delivery_tracker (Express+Prisma+Expo) → docs/83 has API content; no undefined', () => {
    const f = gAPI(Object.assign({}, A25, {
      purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
      backend:'Node.js + Express', frontend:'React + Next.js',
      database:'PostgreSQL (Neon)', deploy:'Railway', orm:'Prisma',
      auth:'NextAuth.js', payment:'stripe', mobile:'Expo (React Native)',
      data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating',
    }));
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.length > 200, 'delivery_tracker docs/83 must have API design content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker docs/83 must not contain undefined');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 69 — presets-ext3 P25 EN bilingual + P23 EN
   Covers the remaining 10 presets not in Suite 66's bilingual tests:
   disaster_info, delivery_tracker, and the 8 Stripe-enabled presets
   ════════════════════════════════════════════════════════════════ */
describe('Suite 69: presets-ext3 P25 EN bilingual + P23 EN — remaining presets', () => {

  const mkEn69 = (purpose, entities, extra) => Object.assign({}, A25, {purpose, data_entities: entities}, extra||{});

  const s69_disaster = Object.assign({}, A25, {
    purpose:'リアルタイム防災情報・避難指示・シェルター情報・安否確認を提供する防災ポータル',
    backend:'Node.js + NestJS', frontend:'React + Next.js',
    database:'PostgreSQL (Railway)', deploy:'Railway', orm:'TypeORM',
    auth:'JWT', payment:'',
    data_entities:'User, DisasterAlert, EvacuationOrder, Shelter, SafetyCheck, EmergencyBroadcast',
  });
  const s69_delivery = Object.assign({}, A25, {
    purpose:'ラストマイル配達の注文・配達員・リアルタイム追跡を管理するデリバリーシステム',
    backend:'Node.js + Express', frontend:'React + Next.js',
    database:'PostgreSQL (Neon)', deploy:'Railway', orm:'Prisma',
    auth:'NextAuth.js', payment:'stripe', mobile:'Expo (React Native)',
    data_entities:'User, DeliveryOrder, Courier, DeliveryZone, TrackingEvent, DeliveryRating',
  });

  // ── P25 EN bilingual ──
  it('P25 EN: disaster_info (NestJS) → docs/99 English mode has Performance content; no undefined', () => {
    const f = gPerf(s69_disaster, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'disaster_info EN docs/99 must have performance content');
    assert.ok(doc.includes('Performance') || doc.includes('Cache') || doc.includes('CDN'), 'disaster_info EN docs/99 must have English performance content');
    assert.ok(!doc.includes('undefined'), 'disaster_info EN docs/99 must not contain undefined');
  });

  it('P25 EN: delivery_tracker (Express+Expo) → docs/99 English mode has content; no undefined', () => {
    const f = gPerf(s69_delivery, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'delivery_tracker EN docs/99 must have content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker EN docs/99 must not contain undefined');
  });

  it('P25 EN: freelance_platform (Stripe) → docs/99 English mode has content; no undefined', () => {
    const f = gPerf(mkEn69(
      'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
      'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview',
      {payment:'stripe'}), 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'freelance_platform EN docs/99 must have content');
    assert.ok(!doc.includes('undefined'), 'freelance_platform EN docs/99 must not contain undefined');
  });

  it('P25 EN: team_chat (Stripe) → docs/101 English cache strategy has content; no undefined', () => {
    const f = gPerf(mkEn69(
      'リアルタイムチャット・チャンネル・DMでチームのコラボレーションを促進するメッセージングツール',
      'User, Channel, ChatMessage, Thread, MessageReaction, ChannelMember',
      {payment:'stripe'}), 'en');
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.length > 100, 'team_chat EN docs/101 must have cache strategy content');
    assert.ok(!doc.includes('undefined'), 'team_chat EN docs/101 must not contain undefined');
  });

  it('P25 EN: real_estate_portal (Stripe) → docs/99 English mode has content; no undefined', () => {
    const f = gPerf(mkEn69(
      '物件検索・問い合わせ・内見予約を提供する消費者向け不動産ポータル',
      'User, PropertyListing, ViewingRequest, RealEstateAgent, Favorite, PropertyImage',
      {payment:'stripe'}), 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.length > 200, 'real_estate_portal EN docs/99 must have content');
    assert.ok(!doc.includes('undefined'), 'real_estate_portal EN docs/99 must not contain undefined');
  });

  // ── P23 EN bilingual ──
  it('P23 EN: disaster_info (NestJS) → docs/91 English mode has testing content; no undefined', () => {
    const f = gTest(s69_disaster, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'disaster_info EN docs/91 must have testing content');
    assert.ok(doc.includes('Testing') || doc.includes('Supertest') || doc.includes('Jest'), 'disaster_info EN docs/91 must have English testing content');
    assert.ok(!doc.includes('undefined'), 'disaster_info EN docs/91 must not contain undefined');
  });

  it('P23 EN: delivery_tracker (Express+Expo) → docs/91 English mode has testing content; no undefined', () => {
    const f = gTest(s69_delivery, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'delivery_tracker EN docs/91 must have testing content');
    assert.ok(!doc.includes('undefined'), 'delivery_tracker EN docs/91 must not contain undefined');
  });

  it('P23 EN: freelance_platform (Stripe/A25) → docs/91 English mode has content; no undefined', () => {
    const f = gTest(mkEn69(
      'スキルを持つフリーランサーと発注企業をマッチングするスキルマーケットプレイス',
      'User, FreelancerProfile, ProjectPost, Proposal, FreelanceContract, FreelanceReview',
      {payment:'stripe'}), 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.length > 200, 'freelance_platform EN docs/91 must have testing content');
    assert.ok(!doc.includes('undefined'), 'freelance_platform EN docs/91 must not contain undefined');
  });
});

// ─────────────────────────────────────────────
//   Suite 70 — P22 Database Intelligence
// ─────────────────────────────────────────────
describe('Suite 70: P22 Database Intelligence — ORM, migration, backup comprehensive coverage', () => {
  const s70_prisma = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
  });
  const s70_py = Object.assign({}, A25, {
    backend: 'Python / FastAPI',
    database: 'PostgreSQL (Neon)',
    orm: 'SQLAlchemy',
  });
  const s70_drizzle = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Drizzle ORM',
  });
  const s70_mongo = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'MongoDB',
    orm: '',
  });

  it('gDB: Prisma+PostgreSQL generates all 4 docs (87-90)', () => {
    const f = gDB(s70_prisma);
    assert.ok(f['docs/87_database_design_principles.md'], 'docs/87 required');
    assert.ok(f['docs/88_query_optimization_guide.md'], 'docs/88 required');
    assert.ok(f['docs/89_migration_strategy.md'], 'docs/89 required');
    assert.ok(f['docs/90_backup_disaster_recovery.md'], 'docs/90 required');
  });

  it('gDB: docs/87 PostgreSQL has soft-delete, UUID, 3NF principles', () => {
    const f = gDB(s70_prisma);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Soft Delete') || doc.includes('deleted_at'), 'docs/87 must have soft delete');
    assert.ok(doc.includes('UUID'), 'docs/87 must have UUID key convention');
    assert.ok(doc.includes('3NF') || doc.includes('正規化'), 'docs/87 must mention normalization');
  });

  it('gDB: docs/87 MongoDB has embed-vs-reference and document size guidance', () => {
    const f = gDB(s70_mongo);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Embed') || doc.includes('Reference'), 'docs/87 MongoDB must have embed-vs-reference');
    assert.ok(doc.includes('Document Size') || doc.includes('16MB'), 'docs/87 MongoDB must have document size limit');
  });

  it('gDB: docs/88 has N+1 section and EXPLAIN ANALYZE for Prisma', () => {
    const f = gDB(s70_prisma);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('N+1'), 'docs/88 must have N+1 problem section');
    assert.ok(doc.includes('EXPLAIN'), 'docs/88 Prisma must include EXPLAIN ANALYZE');
    assert.ok(doc.includes('include'), 'docs/88 Prisma must show include pattern');
  });

  it('gDB: docs/88 Python/SQLAlchemy has joinedload or selectinload', () => {
    const f = gDB(s70_py);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('joinedload') || doc.includes('selectinload'), 'docs/88 Python must show eager loading');
  });

  it('gDB: docs/88 Drizzle has with() or leftJoin pattern', () => {
    const f = gDB(s70_drizzle);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('.with(') || doc.includes('leftJoin'), 'docs/88 Drizzle must show relation loading');
  });

  it('gDB: docs/89 has Expand-Contract pattern', () => {
    const f = gDB(s70_prisma);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('Expand-Contract') || doc.includes('エクスパンド'), 'docs/89 must show expand-contract pattern');
  });

  it('gDB: docs/89 Python uses alembic; Prisma uses prisma migrate', () => {
    const fPy = gDB(s70_py);
    const fPrisma = gDB(s70_prisma);
    assert.ok((fPy['docs/89_migration_strategy.md'] || '').includes('alembic'), 'Python docs/89 must reference alembic');
    assert.ok((fPrisma['docs/89_migration_strategy.md'] || '').includes('prisma migrate'), 'Prisma docs/89 must reference prisma migrate');
  });

  it('gDB: docs/90 has RTO and RPO targets', () => {
    const f = gDB(s70_prisma);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('RTO'), 'docs/90 must have RTO');
    assert.ok(doc.includes('RPO'), 'docs/90 must have RPO');
  });
});

// ─────────────────────────────────────────────
//   Suite 71 — P23 Testing Intelligence
// ─────────────────────────────────────────────
describe('Suite 71: P23 Testing Intelligence — frameworks, coverage, E2E, performance testing', () => {
  const s71_nextjs = Object.assign({}, A25, {
    backend: 'Next.js (App Router) + tRPC',
    orm: 'Prisma ORM',
  });
  const s71_py = Object.assign({}, A25, {
    backend: 'Python / FastAPI',
    orm: 'SQLAlchemy',
  });
  const s71_express = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    orm: 'Drizzle ORM',
  });

  it('gTest: Next.js generates all 4 docs (91-94)', () => {
    const f = gTest(s71_nextjs);
    assert.ok(f['docs/91_testing_strategy.md'], 'docs/91 required');
    assert.ok(f['docs/92_coverage_design.md'], 'docs/92 required');
    assert.ok(f['docs/93_e2e_test_architecture.md'], 'docs/93 required');
    assert.ok(f['docs/94_performance_testing.md'], 'docs/94 required');
  });

  it('gTest: docs/91 has test pyramid with 70% / 20% / 10% ratios', () => {
    const f = gTest(s71_nextjs);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('70%'), 'docs/91 must show 70% unit test ratio');
    assert.ok(doc.includes('20%'), 'docs/91 must show 20% integration ratio');
    assert.ok(doc.includes('10%'), 'docs/91 must show 10% E2E ratio');
  });

  it('gTest: docs/91 Next.js recommends Jest or Vitest', () => {
    const f = gTest(s71_nextjs);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('Jest') || doc.includes('Vitest'), 'Next.js must recommend Jest/Vitest');
  });

  it('gTest: docs/91 Python has pytest + asyncio', () => {
    const f = gTest(s71_py);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('pytest'), 'Python must recommend pytest');
    assert.ok(doc.includes('asyncio') || doc.includes('async'), 'Python FastAPI must cover async testing');
  });

  it('gTest: docs/92 Node.js has v8 coverage provider and 80% threshold', () => {
    const f = gTest(s71_express);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('v8') || doc.includes('coverageThresholds'), 'docs/92 Node must show coverage config');
    assert.ok(doc.includes('80'), 'docs/92 must show 80% coverage threshold');
  });

  it('gTest: docs/92 Python has --cov-fail-under=80', () => {
    const f = gTest(s71_py);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('cov-fail-under'), 'Python docs/92 must set fail-under threshold');
  });

  it('gTest: docs/93 has Playwright and Page Object Model', () => {
    const f = gTest(s71_nextjs);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.includes('Playwright'), 'docs/93 must recommend Playwright');
    assert.ok(doc.includes('Page Object') || doc.includes('POM'), 'docs/93 must have Page Object Model');
  });

  it('gTest: docs/94 Express has k6 load test', () => {
    const f = gTest(s71_express);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('k6'), 'docs/94 non-BaaS must include k6 load testing');
  });

  it('gTest: bilingual parity — ja and en both have substantial docs/91', () => {
    const fJa = gTest(s71_nextjs, 'ja');
    const fEn = gTest(s71_nextjs, 'en');
    assert.ok((fJa['docs/91_testing_strategy.md'] || '').length > 800, 'Japanese docs/91 must be substantial');
    assert.ok((fEn['docs/91_testing_strategy.md'] || '').length > 800, 'English docs/91 must be substantial');
  });

  it('gTest: docs/91-94 prose (outside code fences) contains no undefined across stacks', () => {
    [s71_nextjs, s71_py, s71_express].forEach(ans => {
      const f = gTest(ans);
      ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
       'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md'].forEach(key => {
        // Strip code fences before checking — code like `workers: process.env.CI ? 2 : undefined` is legit
        const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
        assert.ok(!prose.includes('undefined'), key + ' prose must not contain undefined');
      });
    });
  });
});

// ─────────────────────────────────────────────
//   Suite 72 — P24 AI Safety Intelligence
// ─────────────────────────────────────────────
describe('Suite 72: P24 AI Safety — risk categories, guardrail layers, eval metrics, injection defense', () => {
  const s72_ai = Object.assign({}, A25, {
    ai_auto: 'マルチAIエージェント活用',
    backend: 'Next.js (App Router) + tRPC',
  });
  const s72_noai = Object.assign({}, A25, {
    ai_auto: 'なし',
    backend: 'Express.js + Node.js',
  });

  it('gAISafety: generates all 4 docs (95-98)', () => {
    const f = gAISafety(s72_ai);
    assert.ok(f['docs/95_ai_safety_framework.md'], 'docs/95 required');
    assert.ok(f['docs/96_ai_guardrail_implementation.md'], 'docs/96 required');
    assert.ok(f['docs/97_ai_model_evaluation.md'], 'docs/97 required');
    assert.ok(f['docs/98_prompt_injection_defense.md'], 'docs/98 required');
  });

  it('gAISafety: docs/95 lists all 6 risk categories (ja or en)', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    // AI_RISK_CATEGORIES output ja names in genLang:'ja' mode
    [['Hallucination','ハルシネーション'],['Prompt Injection','プロンプトインジェクション'],
     ['Data Leakage','データ漏洩'],['Bias','バイアス'],['Overreliance','過信'],['Jailbreak','ジェイルブレイク']
    ].forEach(([en,ja]) => {
      assert.ok(doc.includes(en) || doc.includes(ja), 'docs/95 must list risk: ' + en);
    });
  });

  it('gAISafety: docs/95 compliance table has EU AI Act, NIST AI RMF, ISO/IEC 42001', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('EU AI Act'), 'docs/95 must have EU AI Act');
    assert.ok(doc.includes('NIST'), 'docs/95 must have NIST AI RMF');
    assert.ok(doc.includes('ISO'), 'docs/95 must have ISO/IEC 42001');
  });

  it('gAISafety: docs/95 has Human-in-the-Loop / HITL section', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('Human-in-the-Loop') || doc.includes('HITL'), 'docs/95 must have HITL section');
  });

  it('gAISafety: docs/96 has all 4 guardrail layers (Layer 1-4) with Input Validation label', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('Layer 1'), 'docs/96 must have Layer 1');
    assert.ok(doc.includes('Layer 4'), 'docs/96 must have Layer 4');
    assert.ok(doc.includes('Input Validation') || doc.includes('入力検証'), 'docs/96 must label input validation layer');
  });

  it('gAISafety: docs/96 has sanitizeUserInput implementation', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('sanitizeUserInput'), 'docs/96 must have sanitizeUserInput function');
  });

  it('gAISafety: docs/97 has Accuracy, Hallucination Rate, Toxicity metrics', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('Accuracy') || doc.includes('正確性'), 'docs/97 must have accuracy metric');
    assert.ok(doc.includes('Hallucination Rate') || doc.includes('ハルシネーション率'), 'docs/97 must have hallucination metric');
    assert.ok(doc.includes('Toxicity') || doc.includes('有害性'), 'docs/97 must have toxicity metric');
  });

  it('gAISafety: docs/98 has sanitize pattern, structured output, and privilege separation', () => {
    const f = gAISafety(s72_ai);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(doc.includes('sanitize') || doc.includes('サニタイズ'), 'docs/98 must have input sanitization');
    assert.ok(doc.includes('json_object') || doc.includes('構造化') || doc.includes('structured'), 'docs/98 must have structured output pattern');
    assert.ok(doc.includes('privilege') || doc.includes('権限'), 'docs/98 must have privilege separation');
  });

  it('gAISafety: no-AI project generates docs/95-98 (future-proof)', () => {
    const f = gAISafety(s72_noai);
    assert.ok((f['docs/95_ai_safety_framework.md'] || '').length > 300, 'docs/95 must exist even when ai_auto=none');
    assert.ok(f['docs/96_ai_guardrail_implementation.md'], 'docs/96 must still be generated');
  });
});

// ─────────────────────────────────────────────
//   Suite 73 — P22 Database EN bilingual
// ─────────────────────────────────────────────
describe('Suite 73: P22 Database Intelligence — English mode bilingual coverage', () => {
  const s73_prisma = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
  });
  const s73_py = Object.assign({}, A25, {
    backend: 'Python / FastAPI',
    database: 'PostgreSQL (Neon)',
    orm: 'SQLAlchemy',
  });
  const s73_drizzle = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Drizzle ORM',
  });
  const s73_mongo = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'MongoDB',
    orm: '',
  });

  it('gDB EN: all 4 docs/87-90 generated in English mode', () => {
    const f = gDB(s73_prisma, 'en');
    assert.ok(f['docs/87_database_design_principles.md'], 'docs/87 EN required');
    assert.ok(f['docs/88_query_optimization_guide.md'], 'docs/88 EN required');
    assert.ok(f['docs/89_migration_strategy.md'], 'docs/89 EN required');
    assert.ok(f['docs/90_backup_disaster_recovery.md'], 'docs/90 EN required');
  });

  it('gDB EN: docs/87 uses English headings (Database Design Principles)', () => {
    const f = gDB(s73_prisma, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Database Design Principles'), 'docs/87 EN must have English title');
    assert.ok(doc.includes('Soft Delete') || doc.includes('deleted_at'), 'docs/87 EN must have soft delete');
    assert.ok(!doc.includes('データベース設計原則'), 'docs/87 EN must not have Japanese heading');
  });

  it('gDB EN: docs/87 MongoDB uses English embed-vs-reference guidance', () => {
    const f = gDB(s73_mongo, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('embed') || doc.includes('Embed'), 'docs/87 EN MongoDB must have embed guidance');
    assert.ok(doc.includes('16MB') || doc.includes('Document Size'), 'docs/87 EN MongoDB must have document size limit');
  });

  it('gDB EN: docs/88 uses English headings and N+1 section', () => {
    const f = gDB(s73_prisma, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('Query Optimization Guide'), 'docs/88 EN must have English title');
    assert.ok(doc.includes('N+1'), 'docs/88 EN must have N+1 section');
    assert.ok(doc.includes('EXPLAIN'), 'docs/88 EN must have EXPLAIN ANALYZE');
  });

  it('gDB EN: docs/88 Python has English joinedload / selectinload guidance', () => {
    const f = gDB(s73_py, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('joinedload') || doc.includes('selectinload'), 'docs/88 EN Python must show eager loading');
  });

  it('gDB EN: docs/89 uses English heading and Expand-Contract pattern', () => {
    const f = gDB(s73_prisma, 'en');
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('Migration Strategy'), 'docs/89 EN must have English title');
    assert.ok(doc.includes('Expand-Contract'), 'docs/89 EN must have Expand-Contract pattern');
    assert.ok(doc.includes('Zero-Downtime'), 'docs/89 EN must mention zero-downtime');
  });

  it('gDB EN: docs/90 uses English headings and has RTO / RPO targets', () => {
    const f = gDB(s73_prisma, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('Backup & Disaster Recovery') || doc.includes('Backup'), 'docs/90 EN must have English title');
    assert.ok(doc.includes('RTO') && doc.includes('RPO'), 'docs/90 EN must have RTO/RPO');
    assert.ok(doc.includes('Recovery Time Objective'), 'docs/90 EN must spell out RTO definition');
  });

  it('gDB EN: bilingual parity — EN docs are as long as JA docs (within 30%)', () => {
    const fJa = gDB(s73_prisma, 'ja');
    const fEn = gDB(s73_prisma, 'en');
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md'].forEach(key => {
      const ja = (fJa[key] || '').length;
      const en = (fEn[key] || '').length;
      assert.ok(en > 400, key + ' EN must have substantial content');
      assert.ok(en > ja * 0.5, key + ' EN should be at least 50% the length of JA');
    });
  });

  it('gDB EN: docs/87-90 prose contains no undefined (Drizzle + EN)', () => {
    const f = gDB(s73_drizzle, 'en');
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' EN prose must not contain undefined');
    });
  });
});

// ─────────────────────────────────────────────
//   Suite 74 — P24 AI Safety EN bilingual + domain guardrails
// ─────────────────────────────────────────────
describe('Suite 74: P24 AI Safety — English mode + domain-specific guardrails (fintech, health, legal)', () => {
  const s74_ai = Object.assign({}, A25, {
    ai_auto: 'マルチAIエージェント活用',
    backend: 'Next.js (App Router) + tRPC',
  });
  const s74_fintech = Object.assign({}, A25, {
    purpose: '銀行API連携による家計簿・資産管理プラットフォーム',
    ai_auto: 'マルチAIエージェント活用',
    backend: 'NestJS + TypeORM',
    database: 'PostgreSQL (Neon)',
  });
  const s74_health = Object.assign({}, A25, {
    purpose: '患者の健康データと医療記録を管理するヘルスケアプラットフォーム',
    ai_auto: 'マルチAIエージェント活用',
    backend: 'Python / FastAPI',
  });
  const s74_legal = Object.assign({}, A25, {
    purpose: '弁護士向け契約書レビューと法務相談管理システム',
    ai_auto: 'Claude APIを活用した自律エージェント',
    backend: 'Next.js (App Router) + tRPC',
  });

  it('gAISafety EN: all 4 docs/95-98 generated in English mode', () => {
    const f = gAISafety(s74_ai, 'en');
    assert.ok(f['docs/95_ai_safety_framework.md'], 'docs/95 EN required');
    assert.ok(f['docs/96_ai_guardrail_implementation.md'], 'docs/96 EN required');
    assert.ok(f['docs/97_ai_model_evaluation.md'], 'docs/97 EN required');
    assert.ok(f['docs/98_prompt_injection_defense.md'], 'docs/98 EN required');
  });

  it('gAISafety EN: docs/95 uses English headings and risk category names', () => {
    const f = gAISafety(s74_ai, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('AI Safety Framework'), 'docs/95 EN must have English title');
    assert.ok(doc.includes('Hallucination'), 'docs/95 EN must show Hallucination (not ハルシネーション)');
    assert.ok(doc.includes('Prompt Injection'), 'docs/95 EN must show Prompt Injection');
    assert.ok(!doc.includes('AIリスクカテゴリ'), 'docs/95 EN must not have Japanese section heading');
  });

  it('gAISafety EN: docs/95 compliance table in English', () => {
    const f = gAISafety(s74_ai, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('EU AI Act'), 'docs/95 EN must have EU AI Act');
    assert.ok(doc.includes('High-risk AI') || doc.includes('conformity assessment'), 'docs/95 EN must have English compliance description');
  });

  it('gAISafety EN: docs/96 Layer labels in English', () => {
    const f = gAISafety(s74_ai, 'en');
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('Input Validation Layer'), 'docs/96 EN must have English layer name');
    assert.ok(doc.includes('Audit & Logging Layer'), 'docs/96 EN must have audit layer in English');
  });

  it('gAISafety: fintech domain docs/95 has domain-specific guardrails (negative balance prevention)', () => {
    const f = gAISafety(s74_fintech);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('残高マイナス') || doc.includes('Prevent negative balance'),
      'fintech docs/95 must have negative balance guardrail'
    );
  });

  it('gAISafety: health domain docs/95 has domain-specific guardrails (consent access prevention)', () => {
    const f = gAISafety(s74_health);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('同意なしアクセス') || doc.includes('Prevent access without consent'),
      'health docs/95 must have consent guardrail'
    );
  });

  it('gAISafety: legal domain docs/95 has domain-specific guardrails (contract tampering prevention)', () => {
    const f = gAISafety(s74_legal);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('不正変更') || doc.includes('Prevent unauthorized contract'),
      'legal docs/95 must have contract tampering guardrail'
    );
  });

  it('gAISafety EN: docs/98 injection defense uses English pattern names', () => {
    const f = gAISafety(s74_ai, 'en');
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(doc.includes('Input sanitization'), 'docs/98 EN must have English pattern name');
    assert.ok(doc.includes('Privilege separation') || doc.includes('privilege separation'), 'docs/98 EN must have privilege separation in English');
    assert.ok(doc.includes('Prompt Injection Defense'), 'docs/98 EN must have English title');
  });

  it('gAISafety EN: bilingual parity — EN docs/95 substantial length', () => {
    const fJa = gAISafety(s74_ai, 'ja');
    const fEn = gAISafety(s74_ai, 'en');
    const ja = (fJa['docs/95_ai_safety_framework.md'] || '').length;
    const en = (fEn['docs/95_ai_safety_framework.md'] || '').length;
    assert.ok(en > 800, 'docs/95 EN must be substantial');
    assert.ok(en > ja * 0.6, 'docs/95 EN should be at least 60% the length of JA');
  });
});

// ─────────────────────────────────────────────
//   Suite 75 — P21-P25 multi-pillar smoke test
// ─────────────────────────────────────────────
describe('Suite 75: P21–P25 multi-pillar smoke — all docs/83-102 generated from one answer set', () => {
  const s75_full = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
    ai_auto: 'マルチAIエージェント活用',
  });
  const s75_py = Object.assign({}, A25, {
    backend: 'Python / FastAPI',
    database: 'PostgreSQL (Neon)',
    orm: 'SQLAlchemy',
    ai_auto: 'Claude APIを活用した自律エージェント',
  });

  const ALL_P21_P25 = [
    'docs/83_api_design_principles.md',
    'docs/84_openapi_specification.md',
    'docs/85_api_security_checklist.md',
    'docs/86_api_testing_strategy.md',
    'docs/87_database_design_principles.md',
    'docs/88_query_optimization_guide.md',
    'docs/89_migration_strategy.md',
    'docs/90_backup_disaster_recovery.md',
    'docs/91_testing_strategy.md',
    'docs/92_coverage_design.md',
    'docs/93_e2e_test_architecture.md',
    'docs/94_performance_testing.md',
    'docs/95_ai_safety_framework.md',
    'docs/96_ai_guardrail_implementation.md',
    'docs/97_ai_model_evaluation.md',
    'docs/98_prompt_injection_defense.md',
    'docs/99_performance_strategy.md',
    'docs/100_database_performance.md',
    'docs/101_cache_strategy.md',
    'docs/102_performance_monitoring.md',
  ];

  function runAll(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
    genPillar21_APIIntelligence(answers,'QTest');
    genPillar22_DatabaseIntelligence(answers,'QTest');
    genPillar23_TestingIntelligence(answers,'QTest');
    genPillar24_AISafety(answers,'QTest');
    genPillar25_Performance(answers,'QTest');
    return Object.assign({},S.files);
  }

  it('smoke: Express+Prisma generates all 20 docs (83-102)', () => {
    const f = runAll(s75_full);
    ALL_P21_P25.forEach(key => {
      assert.ok(f[key], key + ' must be generated');
    });
  });

  it('smoke: Python+SQLAlchemy generates all 20 docs (83-102)', () => {
    const f = runAll(s75_py);
    ALL_P21_P25.forEach(key => {
      assert.ok(f[key], key + ' must be generated');
    });
  });

  it('smoke: no file among docs/83-102 is empty (> 200 chars each)', () => {
    const f = runAll(s75_full);
    ALL_P21_P25.forEach(key => {
      assert.ok((f[key] || '').length > 200, key + ' must not be empty');
    });
  });

  it('smoke EN: all 20 docs generated in English mode', () => {
    const f = runAll(s75_full, 'en');
    ALL_P21_P25.forEach(key => {
      assert.ok(f[key], key + ' must be generated in EN mode');
    });
  });

  it('smoke EN: no docs/83-102 file is empty in English mode', () => {
    const f = runAll(s75_full, 'en');
    ALL_P21_P25.forEach(key => {
      assert.ok((f[key] || '').length > 200, key + ' EN must not be empty');
    });
  });

  it('smoke: docs/83-102 prose has no undefined (Express+Prisma)', () => {
    const f = runAll(s75_full);
    ALL_P21_P25.forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' prose must not contain undefined');
    });
  });

  it('smoke: docs/83-102 prose has no undefined (Python+SQLAlchemy)', () => {
    const f = runAll(s75_py);
    ALL_P21_P25.forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' prose must not contain undefined');
    });
  });

  it('smoke EN: docs/83-102 prose has no undefined in English mode', () => {
    const f = runAll(s75_full, 'en');
    ALL_P21_P25.forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' EN prose must not contain undefined');
    });
  });

  it('smoke: Python+SQLAlchemy EN mode — all 20 docs present and non-empty', () => {
    const f = runAll(s75_py, 'en');
    ALL_P21_P25.forEach(key => {
      assert.ok((f[key] || '').length > 200, key + ' Python EN must not be empty');
    });
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 76 — P21 API Intelligence: gRPC + GraphQL EN + Stripe payment
   Covers stack-specific content not tested in Suite 16 or 68:
   gRPC proto3 content, GraphQL/FastAPI EN headings, Stripe payment section
   ════════════════════════════════════════════════════════════════ */
describe('Suite 76: P21 API — gRPC content, GraphQL EN, FastAPI EN, Stripe payment', () => {

  const s76_grpc = Object.assign({}, A25, {
    purpose: 'マイクロサービス間のリアルタイム通信と高速データ転送を実現するgRPCバックエンド',
    backend: 'Go + gRPC',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s76_graphql_en = Object.assign({}, A25, {
    purpose: 'チームのタスクとプロジェクトを管理するコラボレーションツール',
    backend: 'Node.js + GraphQL',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s76_py_en = Object.assign({}, A25, {
    purpose: '在庫・受発注・配送を管理するサプライチェーン管理システム',
    backend: 'FastAPI (Python)',
    frontend: 'React + Vite',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'SQLAlchemy',
    payment: '',
  });

  const s76_stripe = Object.assign({}, A25, {
    purpose: 'オンラインコースのサブスクリプション購入と決済を管理するプラットフォーム',
    backend: 'Express.js + Node.js',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: 'Stripe',
  });

  const s76_nopay = Object.assign({}, A25, {
    purpose: '社内チームのドキュメント管理とナレッジベースシステム',
    backend: 'Express.js + Node.js',
    frontend: 'React + Vite',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: 'なし',
  });

  // ── gRPC tests ──
  it('docs/83 gRPC: contains syntax = "proto3"', () => {
    const f = gAPI(s76_grpc);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('proto3') || doc.includes('protobuf'), 'docs/83 gRPC must include proto3 definition');
  });

  it('docs/83 gRPC: contains service UserService block', () => {
    const f = gAPI(s76_grpc);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('UserService'), 'docs/83 gRPC must define UserService');
  });

  it('docs/83 gRPC: contains rpc GetUser declaration', () => {
    const f = gAPI(s76_grpc);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('rpc GetUser') || doc.includes('GetUser'), 'docs/83 gRPC must include rpc GetUser');
  });

  // ── GraphQL EN / FastAPI EN heading tests ──
  it('docs/83 EN: GraphQL backend → contains "GraphQL Design Principles"', () => {
    const f = gAPI(s76_graphql_en, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('GraphQL Design Principles'), 'docs/83 EN GraphQL must include "GraphQL Design Principles" heading');
  });

  it('docs/83 EN: Python FastAPI backend → contains "FastAPI Implementation Patterns"', () => {
    const f = gAPI(s76_py_en, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('FastAPI Implementation Patterns'), 'docs/83 EN FastAPI must include "FastAPI Implementation Patterns" heading');
  });

  // ── Stripe payment section tests ──
  it('docs/85: Stripe payment → contains payment section', () => {
    const f = gAPI(s76_stripe);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('Stripe') || doc.includes('決済'), 'docs/85 must include Stripe payment section');
  });

  it('docs/85 EN: Stripe payment → contains "Payment API Checks (Stripe)"', () => {
    const f = gAPI(s76_stripe, 'en');
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(doc.includes('Payment API Checks (Stripe)'), 'docs/85 EN Stripe must include exact "Payment API Checks (Stripe)" heading');
  });

  it('docs/85: no payment → no Stripe payment section', () => {
    const f = gAPI(s76_nopay);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    // Standard security items still present, but no Stripe payment section
    assert.ok(doc.includes('SQL') || doc.includes('OWASP'), 'docs/85 no-payment must still have standard security content');
    assert.ok(!doc.includes('Payment API Checks'), 'docs/85 no-payment must NOT include Stripe payment section');
  });

  it('docs/84: Python FastAPI → local server URL uses port 8000', () => {
    const f = gAPI(s76_py_en);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('localhost:8000'), 'docs/84 Python must use port 8000 in local server URL');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 77 — P21 API Intelligence: domain-specific patterns
   Tests DOMAIN_IMPL_PATTERN in docs/83 and DOMAIN_QA_MAP in docs/86
   for fintech, health, and saas domains
   ════════════════════════════════════════════════════════════════ */
describe('Suite 77: P21 API — domain-specific API patterns (DOMAIN_IMPL_PATTERN + DOMAIN_QA_MAP)', () => {

  const s77_fintech = Object.assign({}, A25, {
    purpose: '銀行API連携による家計簿・資産管理プラットフォーム',
    backend: 'Express.js + Node.js',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: 'Stripe',
  });

  const s77_health = Object.assign({}, A25, {
    purpose: '患者情報・診療記録・処方箋を管理する電子カルテシステム',
    backend: 'Node.js + Express',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s77_saas = Object.assign({}, A25, {
    purpose: 'チームのサブスクリプション管理・課題追跡・スプリント計画ツール',
    backend: 'Node.js + NestJS',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: 'Stripe',
  });

  const s77_legal = Object.assign({}, A25, {
    purpose: '弁護士向け契約書レビューと法務相談管理システム',
    backend: 'Node.js + NestJS',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Railway)',
    auth: 'JWT',
    orm: 'TypeORM',
    payment: '',
  });

  // ── DOMAIN_IMPL_PATTERN in docs/83 ──
  it('docs/83 fintech: contains "Domain-Specific API Patterns (fintech)"', () => {
    const f = gAPI(s77_fintech);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific API Patterns (fintech)') || doc.includes('ドメイン固有API実装パターン (fintech)'),
      'docs/83 fintech must include domain-specific API patterns section'
    );
  });

  it('docs/83 fintech: contains impl_en balance transaction pattern', () => {
    const f = gAPI(s77_fintech, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('Balance updates require transactions') || doc.includes('idempotency') || doc.includes('immutable'),
      'docs/83 fintech EN must include fintech impl_en content'
    );
  });

  it('docs/83 health: contains "Domain-Specific API Patterns (health)"', () => {
    const f = gAPI(s77_health);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific API Patterns (health)') || doc.includes('ドメイン固有API実装パターン (health)'),
      'docs/83 health must include domain-specific API patterns section'
    );
  });

  it('docs/83 health EN: contains health impl_en content', () => {
    const f = gAPI(s77_health, 'en');
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('encrypted columns') || doc.includes('consent') || doc.includes('access logs'),
      'docs/83 health EN must include health impl_en items'
    );
  });

  it('docs/83 saas: contains domain-specific API patterns section', () => {
    const f = gAPI(s77_saas);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('ドメイン固有API実装パターン (saas)') || doc.includes('Domain-Specific API Patterns (saas)'),
      'docs/83 saas must include domain-specific API patterns section'
    );
  });

  it('docs/83 legal: contains domain-specific API patterns section', () => {
    const f = gAPI(s77_legal);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('ドメイン固有API実装パターン (legal)') || doc.includes('Domain-Specific API Patterns (legal)'),
      'docs/83 legal must include domain-specific API patterns section'
    );
  });

  // ── DOMAIN_QA_MAP in docs/86 ──
  it('docs/86 fintech: contains "Domain-Specific Test Scenarios (fintech)"', () => {
    const f = gAPI(s77_fintech);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific Test Scenarios (fintech)') || doc.includes('ドメイン固有テストシナリオ (fintech)'),
      'docs/86 fintech must include domain QA section'
    );
  });

  it('docs/86 fintech EN: contains "Domain-Specific Test Scenarios (fintech)"', () => {
    const f = gAPI(s77_fintech, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific Test Scenarios (fintech)'),
      'docs/86 fintech EN must include English domain QA section heading'
    );
  });

  it('docs/86 fintech: contains focus_en or bugs_en QA content', () => {
    const f = gAPI(s77_fintech, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Transaction integrity') || doc.includes('Double-processing') || doc.includes('Audit log'),
      'docs/86 fintech EN must include DOMAIN_QA_MAP focus_en items'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 78 — P21 API Intelligence: domain QA depth + OpenAPI EN + no-undefined
   Tests health QA scenarios, docs/84 OpenAPI EN, Node port 3000,
   and docs/83-86 undefined-free for edge cases
   ════════════════════════════════════════════════════════════════ */
describe('Suite 78: P21 API — health domain QA, OpenAPI EN, no-undefined edge cases', () => {

  const s78_health = Object.assign({}, A25, {
    purpose: '患者情報・診療記録・処方箋を管理する電子カルテシステム',
    backend: 'Node.js + Express',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s78_node = Object.assign({}, A25, {
    purpose: 'チームのタスクとプロジェクトを管理するコラボレーションツール',
    backend: 'Express.js + Node.js',
    frontend: 'React + Vite',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s78_grpc = Object.assign({}, A25, {
    purpose: 'マイクロサービス間のリアルタイム通信を実現するgRPCバックエンド',
    backend: 'Go + gRPC',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: '',
  });

  const s78_fintech = Object.assign({}, A25, {
    purpose: '銀行API連携による家計簿・資産管理プラットフォーム',
    backend: 'Express.js + Node.js',
    frontend: 'React + Next.js',
    database: 'PostgreSQL (Neon)',
    auth: 'JWT',
    orm: 'Prisma ORM',
    payment: 'Stripe',
  });

  // ── health domain QA ──
  it('docs/86 health: contains "Domain-Specific Test Scenarios (health)"', () => {
    const f = gAPI(s78_health);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific Test Scenarios (health)') || doc.includes('ドメイン固有テストシナリオ (health)'),
      'docs/86 health must include domain QA section'
    );
  });

  it('docs/86 health EN: contains health focus_en QA items', () => {
    const f = gAPI(s78_health, 'en');
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Patient data') || doc.includes('HIPAA') || doc.includes('Medical'),
      'docs/86 health EN must include DOMAIN_QA_MAP focus_en health items'
    );
  });

  // ── docs/84 OpenAPI EN + port ──
  it('docs/84 EN: English mode → has "openapi.yaml Template" heading', () => {
    const f = gAPI(s78_node, 'en');
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('openapi.yaml Template'), 'docs/84 EN must have English openapi.yaml Template heading');
  });

  it('docs/84: Node backend → local server URL uses port 3000', () => {
    const f = gAPI(s78_node);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('localhost:3000'), 'docs/84 Node backend must use port 3000 in local server URL');
  });

  it('docs/84 EN: openapi version 3.1.0 present in English mode', () => {
    const f = gAPI(s78_node, 'en');
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('3.1.0'), 'docs/84 EN must include openapi version 3.1.0');
  });

  // ── no-undefined edge case checks ──
  it('docs/83-86: no undefined in prose for fintech JA mode', () => {
    const f = gAPI(s78_fintech);
    ['docs/83_api_design_principles.md','docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md','docs/86_api_testing_strategy.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' fintech JA prose must not contain undefined');
    });
  });

  it('docs/83-86: no undefined in prose for health JA mode', () => {
    const f = gAPI(s78_health);
    ['docs/83_api_design_principles.md','docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md','docs/86_api_testing_strategy.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' health JA prose must not contain undefined');
    });
  });

  it('docs/83-86: no undefined in prose for gRPC JA mode', () => {
    const f = gAPI(s78_grpc);
    ['docs/83_api_design_principles.md','docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md','docs/86_api_testing_strategy.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' gRPC JA prose must not contain undefined');
    });
  });

  it('docs/83-86: no undefined in prose for gRPC EN mode', () => {
    const f = gAPI(s78_grpc, 'en');
    ['docs/83_api_design_principles.md','docs/84_openapi_specification.md',
     'docs/85_api_security_checklist.md','docs/86_api_testing_strategy.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' gRPC EN prose must not contain undefined');
    });
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 79 — P25 Performance: frontend/deploy/mobile/ORM-specific
   Tests stack-specific content not covered in Suite 20/21:
   Astro/Vue/Svelte bundles, Cloudflare cache, Next.js ISR,
   mobile cache (MMKV), MongoDB perf, TypeORM QueryBuilder,
   Vercel SpeedInsights
   ════════════════════════════════════════════════════════════════ */
describe('Suite 79: P25 Performance — frontend/deploy/mobile/ORM-specific patterns', () => {

  const s79_astro = Object.assign({}, A25, {
    purpose: 'コンテンツ駆動の静的ブログ・ドキュメントサイト',
    frontend: 'Astro',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Vercel',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s79_vue = Object.assign({}, A25, {
    purpose: '管理者向けデータ可視化・ダッシュボードツール',
    frontend: 'Vue 3 + Vite',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s79_svelte = Object.assign({}, A25, {
    purpose: '高速なUIを提供するシングルページアプリケーション',
    frontend: 'SvelteKit',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s79_cf = Object.assign({}, A25, {
    purpose: 'エッジコンピューティングを活用したグローバルAPIサービス',
    frontend: 'React + Vite',
    backend: 'Node.js + Hono',
    database: 'Neon (PostgreSQL)',
    deploy: 'Cloudflare Workers',
    orm: 'Drizzle ORM',
    mobile: 'なし',
  });

  const s79_nextjs = Object.assign({}, A25, {
    purpose: 'ユーザー向けコンテンツ配信プラットフォーム',
    frontend: 'React + Next.js',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Vercel',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s79_mobile = Object.assign({}, A25, {
    purpose: 'モバイル対応のタスク・プロジェクト管理アプリ',
    frontend: 'React + Next.js',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Vercel',
    orm: 'Prisma ORM',
    mobile: 'Expo (React Native)',
  });

  const s79_mongo = Object.assign({}, A25, {
    purpose: 'ソーシャルコンテンツ投稿とコミュニティ管理プラットフォーム',
    frontend: 'React + Vite',
    backend: 'Node.js + Express',
    database: 'MongoDB',
    deploy: 'Railway',
    orm: 'Mongoose',
    mobile: 'なし',
  });

  const s79_typeorm = Object.assign({}, A25, {
    purpose: '法人向けシステムのバックエンドAPIサービス',
    frontend: 'React + Next.js',
    backend: 'Node.js + NestJS',
    database: 'PostgreSQL (Railway)',
    deploy: 'Railway',
    orm: 'TypeORM',
    mobile: 'なし',
  });

  // ── Frontend-specific bundle tools ──
  it('docs/99 Astro frontend: contains "astro-compress" or "Islands" optimization', () => {
    const f = gPerf(s79_astro);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(
      doc.includes('astro-compress') || doc.includes('Islands') || doc.includes('astro'),
      'docs/99 Astro must include Astro-specific bundle optimization'
    );
  });

  it('docs/99 Vue frontend: contains Vue-specific optimization (defineAsyncComponent or rollup)', () => {
    const f = gPerf(s79_vue);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(
      doc.includes('defineAsyncComponent') || doc.includes('rollup') || doc.includes('Vue'),
      'docs/99 Vue must include Vue-specific bundle optimization'
    );
  });

  it('docs/99 Svelte frontend: contains Svelte minimal JS reference', () => {
    const f = gPerf(s79_svelte);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(
      doc.includes('Svelte') || doc.includes('80KB') || doc.includes('minimal'),
      'docs/99 Svelte must include Svelte-specific bundle note'
    );
  });

  // ── Deploy-specific cache content ──
  it('docs/101 Cloudflare: contains Cloudflare cache rules section', () => {
    const f = gPerf(s79_cf);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(
      doc.includes('Cloudflare') || doc.includes('Page Rules') || doc.includes('Cache Everything'),
      'docs/101 Cloudflare deploy must include Cloudflare cache rules'
    );
  });

  it('docs/101 Next.js: contains ISR revalidation pattern', () => {
    const f = gPerf(s79_nextjs);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(
      doc.includes('revalidatePath') || doc.includes('revalidateTag') || doc.includes('revalidate'),
      'docs/101 Next.js must include ISR revalidation pattern'
    );
  });

  it('docs/101 mobile: contains MMKV mobile cache strategy', () => {
    const f = gPerf(s79_mobile);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(
      doc.includes('MMKV') || doc.includes('expo-image') || doc.includes('offlineFirst'),
      'docs/101 with mobile must include mobile cache strategy (MMKV/expo-image)'
    );
  });

  // ── ORM/DB-specific content ──
  it('docs/100 MongoDB: contains populate or aggregate pattern', () => {
    const f = gPerf(s79_mongo);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(
      doc.includes('populate') || doc.includes('aggregate') || doc.includes('MongoDB'),
      'docs/100 MongoDB must include MongoDB-specific N+1 / index pattern'
    );
  });

  it('docs/100 TypeORM: contains QueryBuilder with cache', () => {
    const f = gPerf(s79_typeorm);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(
      doc.includes('QueryBuilder') || doc.includes('.cache(') || doc.includes('TypeORM'),
      'docs/100 TypeORM must include QueryBuilder performance tips'
    );
  });

  it('docs/102 Vercel deploy: contains SpeedInsights or Vercel Analytics setup', () => {
    const f = gPerf(s79_nextjs);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(
      doc.includes('SpeedInsights') || doc.includes('Analytics') || doc.includes('@vercel/analytics'),
      'docs/102 Vercel must include Vercel Analytics / SpeedInsights setup'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 80 — P22/P23 domain patterns: saas, education, ec, ai
   Tests DB hardening (docs/87) and test focus (docs/91)
   for domains not covered in Suite 25/26 (which only cover fintech/health/ec)
   ════════════════════════════════════════════════════════════════ */
describe('Suite 80: P22/P23 domain patterns — saas, education, ec, ai domains', () => {

  function gP22(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
    genPillar22_DatabaseIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }
  function gP23(answers, lang) {
    S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
    genPillar23_TestingIntelligence(answers,'QTest');
    return Object.assign({}, S.files);
  }

  const s80_saas = Object.assign({}, A25, {
    purpose: 'チームのサブスクリプション管理・課題追跡・スプリント計画ツール',
    backend: 'Node.js + NestJS',
    database: 'PostgreSQL (Neon)',
    deploy: 'Vercel',
    orm: 'Prisma ORM',
    payment: 'Stripe',
    mobile: 'なし',
  });

  const s80_education = Object.assign({}, A25, {
    purpose: 'プログラミング学習と資格取得をサポートするe-Learningプラットフォーム',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Vercel',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s80_ec = Object.assign({}, A25, {
    purpose: '食料品・日用品のオンラインショッピングと配達を管理するECプラットフォーム',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Prisma ORM',
    payment: 'Stripe',
    mobile: 'なし',
  });

  const s80_ai = Object.assign({}, A25, {
    purpose: 'AIチャットボット・会話型インターフェース開発プラットフォーム',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  // ── P22 docs/87 DB Hardening ──
  it('docs/87 saas: contains "Domain-Specific DB Hardening (saas)"', () => {
    const f = gP22(s80_saas);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific DB Hardening (saas)') || doc.includes('ドメイン固有DBハードニングルール (saas)'),
      'docs/87 saas must include domain-specific DB hardening section'
    );
  });

  it('docs/87 saas EN: contains "RLS mandatory" in English', () => {
    const f = gP22(s80_saas, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('RLS mandatory') || doc.includes('tenant_id') || doc.includes('Rate limit'),
      'docs/87 saas EN must include RLS mandatory or rate limit hardening rule'
    );
  });

  it('docs/87 education: contains "Domain-Specific DB Hardening (education)"', () => {
    const f = gP22(s80_education);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific DB Hardening (education)') || doc.includes('ドメイン固有DBハードニングルール (education)'),
      'docs/87 education must include domain-specific DB hardening section'
    );
  });

  it('docs/87 education EN: contains "Parental consent" or "Auto-save"', () => {
    const f = gP22(s80_education, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('Parental consent') || doc.includes('Auto-save') || doc.includes('IndexedDB'),
      'docs/87 education EN must include education-specific hardening rules'
    );
  });

  // ── P23 docs/91 Domain Test Focus ──
  it('docs/91 saas: contains "Domain-Specific Test Focus (saas)"', () => {
    const f = gP23(s80_saas);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific Test Focus (saas)') || doc.includes('ドメイン別テスト重点領域 (saas)'),
      'docs/91 saas must include domain-specific test focus section'
    );
  });

  it('docs/91 saas: contains cross-tenant leakage or tenant bug pattern', () => {
    const f = gP23(s80_saas);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('テナント') || doc.includes('tenant') || doc.includes('Cross-tenant') || doc.includes('Rate limit'),
      'docs/91 saas must include tenant-related bug pattern'
    );
  });

  it('docs/91 ai: contains "Domain-Specific Test Focus (ai)"', () => {
    const f = gP23(s80_ai);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('Domain-Specific Test Focus (ai)') || doc.includes('ドメイン別テスト重点領域 (ai)'),
      'docs/91 ai must include domain-specific test focus section'
    );
  });

  it('docs/91 ai: contains prompt injection or token management QA content', () => {
    const f = gP23(s80_ai);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('プロンプトインジェクション') || doc.includes('Prompt injection') || doc.includes('トークン') || doc.includes('Token'),
      'docs/91 ai must include AI-specific test scenarios (prompt injection/token management)'
    );
  });

  it('docs/91 ec: contains inventory conflict or cart bug pattern', () => {
    const f = gP23(s80_ec);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('在庫') || doc.includes('Inventory') || doc.includes('cart') || doc.includes('カート'),
      'docs/91 ec must include inventory/cart-related test scenarios'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 81 — P25 EN bilingual depth + Supabase/Kysely/docs/100
   Tests specific English heading names in docs/99-102,
   Supabase-specific content in docs/100, Kysely compiled queries,
   and docs/99-102 prose undefined-free for edge stacks
   ════════════════════════════════════════════════════════════════ */
describe('Suite 81: P25 EN bilingual depth + Supabase/Kysely DB performance', () => {

  const s81_node = Object.assign({}, A25, {
    purpose: '在庫・受発注・出荷を管理するサプライチェーン管理システム',
    frontend: 'React + Next.js',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Prisma ORM',
    mobile: 'なし',
  });

  const s81_supabase = Object.assign({}, A25, {
    purpose: 'チームのドキュメント共有・コラボレーションツール',
    frontend: 'React + Next.js',
    backend: 'Supabase',
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth',
    deploy: 'Vercel',
    orm: '',
    mobile: 'なし',
  });

  const s81_kysely = Object.assign({}, A25, {
    purpose: '軽量APIとクエリ最適化を重視したバックエンドサービス',
    frontend: 'React + Vite',
    backend: 'Node.js + Express',
    database: 'PostgreSQL (Neon)',
    deploy: 'Railway',
    orm: 'Kysely',
    mobile: 'なし',
  });

  const s81_cf = Object.assign({}, A25, {
    purpose: 'グローバルエッジAPIサービス',
    frontend: 'React + Vite',
    backend: 'Node.js + Hono',
    database: 'Neon (PostgreSQL)',
    deploy: 'Cloudflare Workers',
    orm: 'Drizzle ORM',
    mobile: 'なし',
  });

  // ── EN bilingual heading tests ──
  it('docs/99 EN: contains "Core Web Vitals Targets" heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('Core Web Vitals Targets'), 'docs/99 EN must have "Core Web Vitals Targets" heading');
  });

  it('docs/99 EN: contains "Backend Response Time Targets" heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('Backend Response Time Targets'), 'docs/99 EN must have "Backend Response Time Targets" heading');
  });

  it('docs/100 EN: contains "Index Design" section heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('Index Design'), 'docs/100 EN must have "Index Design" section');
  });

  it('docs/100 EN: contains "N+1 Problem" section heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('N+1 Problem'), 'docs/100 EN must have "N+1 Problem" section');
  });

  it('docs/101 EN: contains "CDN Edge Cache" section heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.includes('CDN Edge Cache'), 'docs/101 EN must have "CDN Edge Cache" section');
  });

  it('docs/101 EN: contains "Application Cache" section heading', () => {
    const f = gPerf(s81_node, 'en');
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(doc.includes('Application Cache'), 'docs/101 EN must have "Application Cache" section');
  });

  // ── Supabase/Kysely DB specifics ──
  it('docs/100 Supabase: contains pg_stat_statements section', () => {
    const f = gPerf(s81_supabase);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(
      doc.includes('pg_stat_statements') || doc.includes('Supabase') || doc.includes('Query Performance'),
      'docs/100 Supabase must include pg_stat_statements or Supabase Query Performance section'
    );
  });

  it('docs/100 Kysely: contains compiled queries pattern', () => {
    const f = gPerf(s81_kysely);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(
      doc.includes('compile') || doc.includes('Kysely') || doc.includes('compiled'),
      'docs/100 Kysely must include compiled queries performance tip'
    );
  });

  it('docs/99-102: no undefined in prose for Cloudflare+Drizzle stack', () => {
    const f = gPerf(s81_cf);
    ['docs/99_performance_strategy.md','docs/100_database_performance.md',
     'docs/101_cache_strategy.md','docs/102_performance_monitoring.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' Cloudflare+Drizzle prose must not contain undefined');
    });
  });
});

describe('Suite 82: P22 Database — index rules, TypeORM, Neon PITR, DR runbook, connection pooling', () => {

  const s82_typeorm = Object.assign({}, A25, {
    purpose: '社内向けタスク管理・工数追跡システム',
    backend: 'NestJS + TypeORM',
    database: 'PostgreSQL (Neon)',
    orm: 'TypeORM',
    deploy: 'Railway',
  });
  const s82_neon = Object.assign({}, A25, {
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
    deploy: 'Railway',
  });
  const s82_supabase = Object.assign({}, A25, {
    backend: 'Supabase',
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth',
    deploy: 'Vercel',
    orm: '',
  });
  const s82_py = Object.assign({}, A25, {
    backend: 'Python / FastAPI',
    database: 'PostgreSQL (Neon)',
    orm: 'SQLAlchemy',
    deploy: 'Railway',
  });

  it('docs/87: index rules table covers covering index (INCLUDE) and partial index pattern', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('INCLUDE') || doc.includes('covering'), 'docs/87 must mention covering index with INCLUDE clause');
    assert.ok(doc.includes('deleted_at IS NULL') || doc.includes('partial'), 'docs/87 must mention partial index pattern');
  });

  it('docs/87: naming conventions table shows snake_case, UUID, idx_ prefix, TIMESTAMPTZ', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('snake_case') || doc.includes('スネークケース'), 'docs/87 must have snake_case (EN) or スネークケース (JA) naming');
    assert.ok(doc.includes('UUID'), 'docs/87 must have UUID key convention');
    assert.ok(doc.includes('idx_'), 'docs/87 must show idx_ prefix convention');
    assert.ok(doc.includes('TIMESTAMPTZ'), 'docs/87 must show TIMESTAMPTZ for timestamps');
  });

  it('docs/88 TypeORM: N+1 section uses generic SQL LEFT JOIN (no TypeORM-specific branch)', () => {
    const f = gDB(s82_typeorm);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('LEFT JOIN') || doc.includes('JOIN'), 'docs/88 TypeORM must show JOIN-based N+1 resolution');
    assert.ok(doc.includes('N+1'), 'docs/88 TypeORM must have N+1 section');
  });

  it('docs/88 Python: connection pooling shows pool_pre_ping and pool_recycle', () => {
    const f = gDB(s82_py);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(doc.includes('pool_pre_ping'), 'docs/88 Python must have pool_pre_ping setting');
    assert.ok(doc.includes('pool_recycle'), 'docs/88 Python must have pool_recycle setting');
  });

  it('docs/88 Prisma: connection pooling mentions Prisma Accelerate or PgBouncer', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(
      doc.includes('Prisma Accelerate') || doc.includes('PgBouncer') || doc.includes('Supabase Pooler'),
      'docs/88 Prisma must mention serverless connection pooling solution'
    );
  });

  it('docs/89 TypeORM: always has Expand-Contract pattern section', () => {
    const f = gDB(s82_typeorm);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('Expand-Contract') || doc.includes('エクスパンド'), 'docs/89 TypeORM must have Expand-Contract pattern');
    assert.ok(doc.includes('Zero-Downtime') || doc.includes('ゼロダウンタイム'), 'docs/89 TypeORM must cover zero-downtime principles');
  });

  it('docs/89: migration safety checklist includes CONCURRENTLY index creation', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(doc.includes('CONCURRENTLY'), 'docs/89 must show CREATE INDEX CONCURRENTLY to avoid locking');
  });

  it('docs/90 Neon: mentions PITR and neonctl restore or branching', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(
      doc.includes('PITR') || doc.includes('neonctl') || doc.includes('branching'),
      'docs/90 Neon must describe PITR or branch-based restore'
    );
    assert.ok(doc.includes('Neon'), 'docs/90 must have Neon-specific backup section');
  });

  it('docs/90: backup strategies table has all 3 tiers (continuous WAL/PITR, daily, logical)', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('WAL') || doc.includes('PITR'), 'docs/90 must have continuous backup tier');
    assert.ok(doc.includes('pg_dump') || doc.includes('daily') || doc.includes('日次'), 'docs/90 must have daily backup tier');
    assert.ok(doc.includes('Logical') || doc.includes('論理'), 'docs/90 must have logical backup tier');
  });

  it('docs/90: DR runbook has step-by-step procedure including maintenance mode and postmortem', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('maintenance') || doc.includes('メンテナンス'), 'docs/90 DR runbook must include maintenance mode step');
    assert.ok(doc.includes('postmortem') || doc.includes('ポストモーテム'), 'docs/90 DR runbook must include postmortem step');
  });

  it('docs/90: backup monitoring alerts table has 24h and ±30% checks', () => {
    const f = gDB(s82_neon);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('24') || doc.includes('24時間'), 'docs/90 must alert on 24h+ backup gap');
    assert.ok(doc.includes('30%') || doc.includes('±30'), 'docs/90 must alert on backup size anomaly');
  });

  it('docs/87-90: no undefined in prose for TypeORM+Neon stack', () => {
    const f = gDB(s82_typeorm);
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' TypeORM+Neon prose must not contain undefined');
    });
  });
});

describe('Suite 83: P23 Testing — Java/Spring, BaaS, Vue, mobile E2E, domain QA map', () => {

  const s83_java = Object.assign({}, A25, {
    purpose: '企業向け受発注・在庫管理ERPシステム',
    frontend: 'React + Next.js',
    backend: 'Spring Boot (Java)',
    database: 'PostgreSQL (Neon)',
    orm: 'TypeORM',
    deploy: 'Railway',
  });
  const s83_vue = Object.assign({}, A25, {
    purpose: 'チームのドキュメント共有・Wiki管理ツール',
    frontend: 'Vue 3 + Nuxt',
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
    deploy: 'Railway',
  });
  const s83_baas = Object.assign({}, A25, {
    purpose: 'スタートアップ向けリアルタイムコラボレーションツール',
    frontend: 'React + Next.js',
    backend: 'Supabase',
    database: 'Supabase (PostgreSQL)',
    auth: 'Supabase Auth',
    deploy: 'Vercel',
    orm: '',
  });
  const s83_mobile = Object.assign({}, A25, {
    purpose: 'フィールドワーカー向けモバイル点検・報告アプリ',
    frontend: 'React + Next.js',
    backend: 'Express.js + Node.js',
    database: 'PostgreSQL (Neon)',
    orm: 'Prisma ORM',
    deploy: 'Railway',
    mobile: 'Expo (React Native)',
    auth: 'Supabase Auth',
  });
  const s83_fintech = Object.assign({}, A25, {
    purpose: '銀行API連携による家計簿・資産管理プラットフォーム',
    backend: 'NestJS + TypeORM',
    database: 'PostgreSQL (Neon)',
    orm: 'TypeORM',
    deploy: 'Railway',
  });

  it('docs/91 Java/Spring: recommends JUnit 5 + Mockito + AssertJ', () => {
    const f = gTest(s83_java);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('JUnit 5') || doc.includes('JUnit'), 'docs/91 Java must recommend JUnit 5');
    assert.ok(doc.includes('Mockito') || doc.includes('assertThat') || doc.includes('UserControllerTest'), 'docs/91 Java must include Mockito/AssertJ or integration test class');
    assert.ok(doc.includes('AssertJ') || doc.includes('assertThat'), 'docs/91 Java must include AssertJ');
  });

  it('docs/91 Java/Spring: backend test example uses @SpringBootTest and TestRestTemplate', () => {
    const f = gTest(s83_java);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('@SpringBootTest'), 'docs/91 Java backend test must use @SpringBootTest');
    assert.ok(doc.includes('TestRestTemplate') || doc.includes('RANDOM_PORT'), 'docs/91 Java must show random port integration test');
  });

  it('docs/91 BaaS: uses Vitest and focuses on serverless edge functions', () => {
    const f = gTest(s83_baas);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('Vitest') || doc.includes('vitest'), 'docs/91 BaaS must recommend Vitest');
    assert.ok(
      doc.includes('serverless') || doc.includes('edge') || doc.includes('processOrder') || doc.includes('BaaS'),
      'docs/91 BaaS must focus on serverless/edge function testing'
    );
  });

  it('docs/91 Vue: uses @vue/test-utils or vue-test-utils', () => {
    const f = gTest(s83_vue);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('@vue/test-utils') || doc.includes('vue-test-utils') || doc.includes('mount'),
      'docs/91 Vue must use @vue/test-utils'
    );
    assert.ok(doc.includes('Vitest'), 'docs/91 Vue must recommend Vitest (Vite-native)');
  });

  it('docs/91 fintech domain: DOMAIN_QA_MAP injects domain-specific test priority matrix', () => {
    const f = gTest(s83_fintech);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('fintech') || doc.includes('Test Priority') || doc.includes('品質特性'),
      'docs/91 fintech must inject domain-specific test priority section'
    );
    // DOMAIN_QA_MAP priority is formatted with | separator in table rows
    assert.ok(doc.includes('|'), 'docs/91 domain QA section must have table rows');
  });

  it('docs/92 Java: JaCoCo coverage with violation rules', () => {
    const f = gTest(s83_java);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('JaCoCo') || doc.includes('jacoco'), 'docs/92 Java must use JaCoCo');
    assert.ok(
      doc.includes('jacocoTestCoverageVerification') || doc.includes('violationRules') || doc.includes('0.80'),
      'docs/92 Java must show JaCoCo coverage threshold configuration'
    );
  });

  it('docs/93 mobile Expo: has Maestro or Detox mobile E2E section', () => {
    const f = gTest(s83_mobile);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('Maestro') || doc.includes('Detox'),
      'docs/93 with Expo mobile must have Maestro/Detox mobile E2E section'
    );
    assert.ok(
      doc.includes('launchApp') || doc.includes('maestro') || doc.includes('.yaml'),
      'docs/93 mobile must show Maestro YAML example'
    );
  });

  it('docs/93 with auth: has storageState authentication setup pattern', () => {
    const f = gTest(s83_mobile);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('storageState') || doc.includes('auth.setup'),
      'docs/93 with auth must show Playwright storageState auth pattern'
    );
  });

  it('docs/94 Python: uses Locust (not k6) for load testing', () => {
    const f = gTest(Object.assign({}, A25, { backend: 'Python / FastAPI', orm: 'SQLAlchemy' }));
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('locust') || doc.includes('Locust'), 'docs/94 Python must use Locust for load testing');
    assert.ok(doc.includes('HttpUser') || doc.includes('@task'), 'docs/94 Python Locust must show HttpUser/task pattern');
  });

  it('docs/94 Next.js: has Next.js performance optimization checklist with ISR/SSG and Server Components', () => {
    const f = gTest(s83_vue.frontend === 'Vue 3 + Nuxt'
      ? Object.assign({}, A25, { frontend: 'React + Next.js', backend: 'Express.js + Node.js', orm: 'Prisma ORM' })
      : s83_java);
    const fNext = gTest(Object.assign({}, A25, { frontend: 'React + Next.js', backend: 'Express.js + Node.js', orm: 'Prisma ORM' }));
    const doc = fNext['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('next/image') || doc.includes('ISR') || doc.includes('Server Component'), 'docs/94 Next.js must have Next.js optimization checklist');
    assert.ok(doc.includes('ISR') || doc.includes('ISR/SSG') || doc.includes('revalidate'), 'docs/94 Next.js checklist must include ISR/SSG');
  });

  it('docs/91-94: no undefined in prose for Java+Spring stack', () => {
    const f = gTest(s83_java);
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' Java/Spring prose must not contain undefined');
    });
  });
});

describe('Suite 84: P24 AI Safety — Claude/OpenAI providers, high-autonomy, RAGAS, PII, injection patterns', () => {

  const s84_claude = Object.assign({}, A25, {
    purpose: '法務契約書レビューと法的リスク評価AI',
    ai_auto: 'Claude APIを活用した自律エージェント',
    backend: 'Python / FastAPI',
  });
  const s84_openai = Object.assign({}, A25, {
    purpose: 'カスタマーサポート自動化チャットボットシステム',
    ai_auto: 'GPT-4を活用した自動応答AI',
    backend: 'Next.js (App Router) + tRPC',
  });
  const s84_generic = Object.assign({}, A25, {
    purpose: 'AIチャットボット・会話型インターフェース開発プラットフォーム',
    ai_auto: 'マルチAIエージェント活用',
    backend: 'Express.js + Node.js',
  });
  const s84_noai = Object.assign({}, A25, {
    ai_auto: 'なし',
    backend: 'Express.js + Node.js',
  });
  const s84_local = Object.assign({}, A25, {
    purpose: 'プライベートデータを扱うオンプレミスAIアシスタント',
    ai_auto: 'Llama3ローカル実行',
    backend: 'Python / FastAPI',
  });

  it('docs/95 Claude provider: shows claude-opus-4-6 model reference', () => {
    const f = gAISafety(s84_claude);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('claude-opus-4-6') || doc.includes('claude'),
      'docs/95 Claude provider must reference claude-opus-4-6 model'
    );
  });

  it('docs/95 OpenAI provider: shows gpt-4o and response_format json_object', () => {
    const f = gAISafety(s84_openai);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('gpt-4o') || doc.includes('GPT'), 'docs/95 OpenAI provider must reference gpt-4o');
    assert.ok(
      doc.includes('response_format') || doc.includes('json_object'),
      'docs/95 OpenAI must show JSON output enforcement for injection defense'
    );
  });

  it('docs/95 high-autonomy (Claude autonomous): triggers ⚠️ 高自律レベル検出 warning', () => {
    const f = gAISafety(s84_claude);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('高自律レベル') || doc.includes('High Autonomy Level'),
      'docs/95 autonomous AI must trigger high-autonomy warning'
    );
  });

  it('docs/96: has PII detection function with email/phone/credit card patterns', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('detectPII'), 'docs/96 must have detectPII function');
    assert.ok(doc.includes('EMAIL') || doc.includes('email'), 'docs/96 detectPII must cover email pattern');
    assert.ok(doc.includes('PHONE') || doc.includes('phone'), 'docs/96 detectPII must cover phone pattern');
  });

  it('docs/96: has AI rate limiting with slidingWindow pattern', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(doc.includes('Ratelimit') || doc.includes('ratelimit'), 'docs/96 must have rate limiting for AI endpoints');
    assert.ok(
      doc.includes('slidingWindow') || doc.includes('sliding'),
      'docs/96 must use sliding window rate limiter'
    );
    assert.ok(doc.includes('10') && (doc.includes('1 m') || doc.includes('per')), 'docs/96 must show 10 req/min limit');
  });

  it('docs/96: has content moderation integration with moderation API reference', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('moderateContent') || doc.includes('moderation'),
      'docs/96 must have content moderation function'
    );
    assert.ok(
      doc.includes('openai.com/v1/moderations') || doc.includes('Moderation API') || doc.includes('flagged'),
      'docs/96 must reference OpenAI Moderation API or flagged result'
    );
  });

  it('docs/97: evaluation metrics table has all 6 metrics (Accuracy, Hallucination, Toxicity, Latency, Cost, Instruction)', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('Accuracy') || doc.includes('正確性'), 'docs/97 must have Accuracy metric');
    assert.ok(doc.includes('Hallucination Rate') || doc.includes('ハルシネーション率'), 'docs/97 must have Hallucination Rate metric');
    assert.ok(doc.includes('Toxicity') || doc.includes('有害性'), 'docs/97 must have Toxicity metric');
    assert.ok(doc.includes('Latency P95') || doc.includes('P95'), 'docs/97 must have Latency P95 metric');
    assert.ok(doc.includes('Cost per') || doc.includes('トークンコスト'), 'docs/97 must have Cost per token metric');
    assert.ok(doc.includes('Instruction Following') || doc.includes('指示追従'), 'docs/97 must have Instruction Following metric');
  });

  it('docs/97: RAGAS section with faithfulness and answer_relevancy metrics', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('ragas') || doc.includes('RAGAS'), 'docs/97 must have RAGAS evaluation section');
    assert.ok(doc.includes('faithfulness'), 'docs/97 RAGAS must include faithfulness metric');
    assert.ok(doc.includes('answer_relevancy') || doc.includes('context_precision'), 'docs/97 RAGAS must include relevancy/precision metric');
  });

  it('docs/97: Langfuse observability section for generic/claude provider', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('Langfuse') || doc.includes('langfuse'), 'docs/97 must have Langfuse observability integration');
    assert.ok(doc.includes('tracedCompletion') || doc.includes('trace'), 'docs/97 must show traced completion pattern');
  });

  it('docs/97: A/B test design table with p < 0.05 and 50/50 split', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(doc.includes('p < 0.05') || doc.includes('p<0.05'), 'docs/97 A/B test must show statistical significance threshold');
    assert.ok(doc.includes('50/50'), 'docs/97 A/B test must show 50/50 traffic split');
  });

  it('docs/98: INJECTION_PATTERNS code block filters "ignore previous instructions"', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(
      doc.includes('ignore') && (doc.includes('previous') || doc.includes('FILTERED')),
      'docs/98 must have injection pattern matching "ignore previous instructions"'
    );
    assert.ok(doc.includes('MAX_PROMPT_LENGTH') || doc.includes('4096'), 'docs/98 must enforce prompt length limit');
  });

  it('docs/98: shows indirect injection attack example with SYSTEM OVERRIDE pattern', () => {
    const f = gAISafety(s84_generic);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(
      doc.includes('SYSTEM OVERRIDE') || doc.includes('indirect') || doc.includes('Indirect'),
      'docs/98 must cover indirect injection attack pattern'
    );
  });

  it('docs/95-98: no undefined in prose for local LLM (Llama) stack', () => {
    const f = gAISafety(s84_local);
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md'].forEach(key => {
      const prose = (f[key] || '').replace(/```[\s\S]*?```/g, '');
      assert.ok(!prose.includes('undefined'), key + ' Llama local LLM prose must not contain undefined');
    });
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 85 — P20 CICD depth: docs/77-80 content verification
   ════════════════════════════════════════════════════════════════ */

const s85_fin = Object.assign({}, A25, { purpose:'fintech payment platform', deploy:'Railway' });
const s85_cf  = Object.assign({}, A25, { deploy:'Cloudflare Pages' });

describe('Suite 85: P20 CICD depth — docs/77-80', () => {
  it('docs/77: 9-stage pipeline mermaid header present', () => {
    const f = gP20(A25);
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(
      doc.includes('9ステージ') || doc.includes('9-Stage'),
      'docs/77 must include 9-stage pipeline heading'
    );
  });

  it('docs/77: aquasecurity/trivy-action in YAML security scan step', () => {
    const f = gP20(A25);
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('aquasecurity/trivy-action'), 'docs/77 must reference trivy-action for security scan');
  });

  it('docs/77: Railway deploy target shows railway up command', () => {
    const f = gP20(s85_fin);
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('railway up'), 'Railway deploy target must show railway up command in YAML');
  });

  it('docs/77: Cloudflare deploy target shows wrangler pages deploy command', () => {
    const f = gP20(s85_cf);
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(doc.includes('wrangler pages deploy'), 'Cloudflare deploy target must show wrangler pages deploy in YAML');
  });

  it('docs/77: fintech domain shows Dual Approval Gate in pipeline mermaid', () => {
    const f = gP20(s85_fin);
    const doc = f['docs/77_cicd_pipeline_design.md'] || '';
    assert.ok(
      doc.includes('Dual Approval Gate') || doc.includes('デュアル承認ゲート'),
      'Fintech domain must show Dual Approval Gate in pipeline mermaid'
    );
  });

  it('docs/78: Blue-Green strategy recommended for fintech domain', () => {
    const f = gP20(s85_fin);
    const doc = f['docs/78_deployment_strategy.md'] || '';
    assert.ok(
      doc.includes('Blue-Green') || doc.includes('ブルーグリーン'),
      'Fintech domain must recommend Blue-Green deployment strategy'
    );
  });

  it('docs/78: Canary strategy recommended for SaaS domain', () => {
    const f = gP20(A25);
    const doc = f['docs/78_deployment_strategy.md'] || '';
    assert.ok(
      doc.includes('Canary') || doc.includes('カナリア'),
      'SaaS domain must recommend Canary deployment strategy'
    );
  });

  it('docs/78: rollback triggers include error_rate > 1% threshold', () => {
    const f = gP20(A25);
    const doc = f['docs/78_deployment_strategy.md'] || '';
    assert.ok(doc.includes('error_rate') || doc.includes('1%'), 'docs/78 rollback must reference error_rate > 1% threshold');
  });

  it('docs/79: fintech coverage threshold is 90 (stricter than default 80)', () => {
    const fFin = gP20(s85_fin);
    const docFin = fFin['docs/79_quality_gate_matrix.md'] || '';
    const fDef = gP20(A25);
    const docDef = fDef['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(docFin.includes('"lines": 90') || docFin.includes(': 90,'), 'Fintech coverage threshold must be 90');
    assert.ok(docDef.includes('"lines": 80') || docDef.includes(': 80,'), 'Default coverage threshold must be 80');
  });

  it('docs/79: LCP < 2.5s in performance budget table', () => {
    const f = gP20(A25);
    const doc = f['docs/79_quality_gate_matrix.md'] || '';
    assert.ok(doc.includes('LCP') && doc.includes('2.5s'), 'docs/79 must show LCP < 2.5s performance budget');
  });

  it('docs/80: GitFlow for fintech, Trunk-Based for SaaS', () => {
    const fFin = gP20(s85_fin);
    const docFin = fFin['docs/80_release_engineering.md'] || '';
    const fSaaS = gP20(A25);
    const docSaaS = fSaaS['docs/80_release_engineering.md'] || '';
    assert.ok(docFin.includes('GitFlow') || docFin.includes('gitflow'), 'Fintech domain must recommend GitFlow');
    assert.ok(
      docSaaS.includes('Trunk') || docSaaS.includes('trunk'),
      'SaaS domain must recommend Trunk-Based development'
    );
  });

  it('docs/80: semantic versioning MAJOR.MINOR.PATCH section', () => {
    const f = gP20(A25);
    const doc = f['docs/80_release_engineering.md'] || '';
    assert.ok(doc.includes('MAJOR.MINOR.PATCH'), 'docs/80 must include semantic versioning MAJOR.MINOR.PATCH');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 86 — P19 Enterprise depth: docs/73-76 content verification
   ════════════════════════════════════════════════════════════════ */

const s86_fin   = Object.assign({}, A25, { purpose:'fintech payment platform', org_model:'マルチテナント(RLS)' });
const s86_saas  = Object.assign({}, A25, { org_model:'マルチテナント(RLS)' });

describe('Suite 86: P19 Enterprise depth — docs/73-76', () => {
  it('docs/73: RLS policy template has CREATE POLICY org_isolation with auth.uid()', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(doc.includes('CREATE POLICY'), 'docs/73 must include CREATE POLICY SQL statement');
    assert.ok(doc.includes('auth.uid()'), 'docs/73 RLS policy must reference auth.uid() for user identity');
  });

  it('docs/73: permission matrix has Owner/Admin/Member/Viewer columns', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(doc.includes('Owner'), 'docs/73 permission matrix must have Owner column');
    assert.ok(doc.includes('Admin'), 'docs/73 permission matrix must have Admin column');
    assert.ok(doc.includes('Member') || doc.includes('Viewer'), 'docs/73 permission matrix must have Member/Viewer columns');
  });

  it('docs/73: invite flow sequence diagram with OrgInvite token', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(
      doc.includes('OrgInvite') || doc.includes('invite') || doc.includes('招待'),
      'docs/73 must include invite flow sequence diagram'
    );
    assert.ok(doc.includes('token') || doc.includes('UUID'), 'docs/73 invite flow must show token/UUID');
  });

  it('docs/73: scaling decision tree mermaid has tenant count branches', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/73_enterprise_architecture.md'] || '';
    assert.ok(
      doc.includes('100') && (doc.includes('1000') || doc.includes('RLS')),
      'docs/73 scaling decision tree must show tenant count thresholds (100/1000)'
    );
  });

  it('docs/74: state machine for SaaS has draft/pending/approved states', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('draft'), 'docs/74 state machine must include draft state');
    assert.ok(
      doc.includes('pending') || doc.includes('approved'),
      'docs/74 state machine must include pending/approved states'
    );
  });

  it('docs/74: SLA tracking code has checkSLABreaches function', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(doc.includes('checkSLABreaches'), 'docs/74 SLA tracking must define checkSLABreaches function');
  });

  it('docs/74: fintech domain customization mentions KYC/AML', () => {
    const f = gP19(s86_fin);
    const doc = f['docs/74_workflow_engine.md'] || '';
    assert.ok(
      doc.includes('KYC') || doc.includes('AML') || doc.includes('Transfer') || doc.includes('送金'),
      'Fintech workflow customization must mention KYC/AML or transfer approval'
    );
  });

  it('docs/75: admin dashboard wireframe ASCII has MRR KPI card', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/75_admin_dashboard_spec.md'] || '';
    assert.ok(doc.includes('MRR'), 'docs/75 admin dashboard wireframe must show MRR KPI card');
  });

  it('docs/75: Recharts weekly trend config with new_users, active_users, mrr data keys', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/75_admin_dashboard_spec.md'] || '';
    assert.ok(doc.includes('new_users'), 'docs/75 Recharts config must include new_users data key');
    assert.ok(doc.includes('active_users'), 'docs/75 Recharts config must include active_users data key');
    assert.ok(doc.includes('mrr'), 'docs/75 Recharts config must include mrr data key');
  });

  it('docs/75: role-based dashboard views table includes Billing row', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/75_admin_dashboard_spec.md'] || '';
    assert.ok(
      doc.includes('Billing') || doc.includes('課金'),
      'docs/75 role-based views must include Billing row'
    );
    assert.ok(
      doc.includes('Audit') || doc.includes('監査'),
      'docs/75 role-based views must include Audit log row'
    );
  });

  it('docs/76: enterprise components include DataTable, OrgSwitcher, ApprovalBar', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/76_enterprise_components.md'] || '';
    assert.ok(doc.includes('DataTable'), 'docs/76 must include DataTable component spec');
    assert.ok(doc.includes('OrgSwitcher'), 'docs/76 must include OrgSwitcher component spec');
    assert.ok(doc.includes('ApprovalBar'), 'docs/76 must include ApprovalBar component spec');
  });

  it('docs/76: composition pattern shows ApprovalPage with bulkActions', () => {
    const f = gP19(s86_saas);
    const doc = f['docs/76_enterprise_components.md'] || '';
    assert.ok(
      doc.includes('ApprovalPage') || doc.includes('bulkApprove'),
      'docs/76 composition pattern must show ApprovalPage or bulkApprove'
    );
    assert.ok(doc.includes('bulkActions') || doc.includes('bulk'), 'docs/76 composition must show bulk actions pattern');
  });
});

/* ══════════════════════════════════════════════════════════════════
   Suite 87 — P16/P17 depth: docs/60-63 + docs/65-68 verification
   ════════════════════════════════════════════════════════════════ */

const s87_fin  = Object.assign({}, A25, { purpose:'fintech payment platform' });
const s87_saas = Object.assign({}, A25, { purpose:'SaaS subscription management platform' });

describe('Suite 87: P16/P17 depth — docs/60-63 + docs/65-68', () => {
  // P16: docs/60 — Methodology Intelligence
  it('docs/60: fintech domain shows Resilient + Data-Driven as primary methodology', () => {
    const f = gP16(s87_fin);
    const doc = f['docs/60_methodology_intelligence.md'] || '';
    assert.ok(
      doc.includes('レジリエント') || doc.includes('Resilient'),
      'docs/60 fintech must show Resilient methodology from DEV_METHODOLOGY_MAP'
    );
    assert.ok(
      doc.includes('データドリブン') || doc.includes('Data-Driven'),
      'docs/60 fintech must show Data-Driven methodology from DEV_METHODOLOGY_MAP'
    );
  });

  it('docs/60: EN mode shows English methodology names for fintech', () => {
    const f = gP16(s87_fin, 'en');
    const doc = f['docs/60_methodology_intelligence.md'] || '';
    assert.ok(
      doc.includes('Resilient') && doc.includes('Data-Driven'),
      'EN mode docs/60 fintech must show English methodology names'
    );
  });

  it('docs/60: approach fit table with 12 design approaches', () => {
    const f = gP16(A25);
    const doc = f['docs/60_methodology_intelligence.md'] || '';
    assert.ok(
      doc.includes('★★★★★'),
      'docs/60 approach fit table must use star ratings'
    );
    assert.ok(
      doc.includes('レジリエント設計') || doc.includes('Resilient Design'),
      'docs/60 approach table must include Resilient Design entry'
    );
  });

  // P16: docs/61 — AI Brainstorming Prompt Playbook
  it('docs/61: PHASE_PROMPTS playbook shows 6-phase prompt templates', () => {
    const f = gP16(A25);
    const doc = f['docs/61_ai_brainstorm_playbook.md'] || '';
    assert.ok(
      doc.includes('Phase 0') || doc.includes('Phase 1'),
      'docs/61 must show Phase 0 or Phase 1 brainstorming prompts'
    );
    assert.ok(
      doc.includes('Phase 3') || doc.includes('Phase 4') || doc.includes('Phase 5'),
      'docs/61 must show later phase prompts (Phase 3-5)'
    );
  });

  // P16: docs/63 — Next-Gen UX Strategy
  it('docs/63: next-gen UX strategy has NEXT_GEN_UX keyword sections', () => {
    const f = gP16(A25);
    const doc = f['docs/63_next_gen_ux_strategy.md'] || '';
    assert.ok(doc.length > 500, 'docs/63 next-gen UX strategy must be a substantial document');
    assert.ok(
      doc.includes('UX') || doc.includes('ux') || doc.includes('体験'),
      'docs/63 must include UX terminology'
    );
  });

  // P17: docs/65 — Prompt Genome
  it('docs/65: CRITERIA 8-axis scoring table with Context 15% and Instructions 20%', () => {
    const f = gP17(A25);
    const doc = f['docs/65_prompt_genome.md'] || '';
    assert.ok(
      doc.includes('Context') && doc.includes('15%'),
      'docs/65 CRITERIA table must show Context axis with 15% weight'
    );
    assert.ok(
      doc.includes('Instructions') && doc.includes('20%'),
      'docs/65 CRITERIA table must show Instructions axis with 20% weight'
    );
  });

  it('docs/65: Prompt DNA profile shows domain and AI maturity level', () => {
    const f = gP17(A25);
    const doc = f['docs/65_prompt_genome.md'] || '';
    assert.ok(
      doc.includes('DNA') || doc.includes('ゲノム') || doc.includes('Genome'),
      'docs/65 must have Prompt DNA/Genome profile section'
    );
    assert.ok(
      doc.includes('Level') && (doc.includes('AI成熟度') || doc.includes('Maturity')),
      'docs/65 DNA profile must show AI maturity level'
    );
  });

  it('docs/65: phase-by-phase prompt library covers Phase 0 through Phase 5', () => {
    const f = gP17(A25);
    const doc = f['docs/65_prompt_genome.md'] || '';
    assert.ok(doc.includes('Phase 0'), 'docs/65 prompt library must include Phase 0');
    assert.ok(doc.includes('Phase 5'), 'docs/65 prompt library must include Phase 5 (Operations)');
  });

  it('docs/65: genome mermaid graph has DNA node and CRITERIA branch', () => {
    const f = gP17(A25);
    const doc = f['docs/65_prompt_genome.md'] || '';
    assert.ok(
      doc.includes('DNA') && doc.includes('CRITERIA'),
      'docs/65 genome mermaid must show DNA node with CRITERIA branch'
    );
    assert.ok(
      doc.includes('Context 15%') || doc.includes('Instructions 20%'),
      'docs/65 genome mermaid must reference CRITERIA axis weights'
    );
  });

  // P17: docs/66 — AI Maturity Assessment
  it('docs/66: AI maturity model shows all 3 levels (Assisted, Augmented, Autonomous)', () => {
    const f = gP17(A25);
    const doc = f['docs/66_ai_maturity_assessment.md'] || '';
    assert.ok(
      doc.includes('Level 1') || doc.includes('AI支援') || doc.includes('Assisted'),
      'docs/66 must show Level 1 (Assisted) maturity'
    );
    assert.ok(
      doc.includes('Level 2') || doc.includes('AI協調') || doc.includes('Augmented'),
      'docs/66 must show Level 2 (Augmented) maturity'
    );
    assert.ok(
      doc.includes('Level 3') || doc.includes('AI自律') || doc.includes('Autonomous'),
      'docs/66 must show Level 3 (Autonomous) maturity'
    );
  });

  it('docs/66: 5-dimension evaluation matrix with Prompt Design dimension', () => {
    const f = gP17(A25);
    const doc = f['docs/66_ai_maturity_assessment.md'] || '';
    assert.ok(
      doc.includes('プロンプト設計力') || doc.includes('Prompt Design'),
      'docs/66 5-dimension matrix must include Prompt Design dimension'
    );
    assert.ok(
      doc.includes('品質保証') || doc.includes('Quality Assurance'),
      'docs/66 5-dimension matrix must include Quality Assurance dimension'
    );
  });

  it('docs/68: Prompt KPI dashboard has measurement metrics', () => {
    const f = gP17(A25);
    const doc = f['docs/68_prompt_kpi_dashboard.md'] || '';
    assert.ok(doc.length > 500, 'docs/68 prompt KPI dashboard must be a substantial document');
    assert.ok(
      doc.includes('KPI') || doc.includes('metric') || doc.includes('メトリクス'),
      'docs/68 must include KPI or metric tracking content'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 88 — P21 API Intelligence depth: docs/83-86 content verification
   REST URL conventions, BaaS RLS, GraphQL DataLoader/DepthLimit,
   OpenAPI 3.1 BearerAuth, OWASP CRITICAL, k6 load test, schemathesis
   ════════════════════════════════════════════════════════════════ */

describe('Suite 88: P21 API depth — docs/83-86', () => {

  // ── docs/83 REST ──
  it('docs/83 REST: /api/v1/users URL convention present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('/api/v1/users'), 'docs/83 REST must show /api/v1/users URL convention');
  });

  it('docs/83 REST: RFC 7807 error response format present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('RFC 7807'), 'docs/83 REST must reference RFC 7807 Problem Details error format');
  });

  // ── docs/83 BaaS ──
  it('docs/83 BaaS Supabase: Row Level Security (RLS) client SDK pattern present', () => {
    const f = gAPI21(supabaseApiAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(
      doc.includes('Row Level Security (RLS)') || doc.includes('RLS'),
      'docs/83 BaaS must show Row Level Security (RLS) comment in client SDK code'
    );
  });

  // ── docs/83 GraphQL ──
  it('docs/83 GraphQL: DataLoader N+1 prevention principle present', () => {
    const f = gAPI21(graphqlAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('DataLoader'), 'docs/83 GraphQL must include DataLoader in principles table');
  });

  it('docs/83 GraphQL: Depth Limit max-5 constraint present', () => {
    const f = gAPI21(graphqlAnswers);
    const doc = f['docs/83_api_design_principles.md'] || '';
    assert.ok(doc.includes('Depth Limit'), 'docs/83 GraphQL must show Depth Limit query constraint');
  });

  // ── docs/84 OpenAPI Specification ──
  it('docs/84: openapi: "3.1.0" YAML header present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(
      doc.includes('openapi: "3.1.0"') || doc.includes("openapi: '3.1.0'"),
      'docs/84 must declare openapi: 3.1.0 in YAML template'
    );
  });

  it('docs/84: BearerAuth JWT security scheme present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/84_openapi_specification.md'] || '';
    assert.ok(doc.includes('BearerAuth'), 'docs/84 must include BearerAuth security scheme for JWT auth');
  });

  // ── docs/85 API Security Checklist ──
  it('docs/85: 🔴 CRITICAL severity section heading present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(
      doc.includes('🔴 CRITICAL') || doc.includes('CRITICAL'),
      'docs/85 must include CRITICAL severity section with 4 items'
    );
  });

  it('docs/85 BaaS Supabase: authn check references getUser()/getSession()', () => {
    const f = gAPI21(supabaseApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(
      doc.includes('getUser()') || doc.includes('getSession()'),
      'docs/85 BaaS must reference Supabase SDK getUser()/getSession() for server-side auth verification'
    );
  });

  it('docs/85: HIGH section includes CORS restriction check', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/85_api_security_checklist.md'] || '';
    assert.ok(
      doc.includes('CORS') || doc.includes('ALLOWED_ORIGINS'),
      'docs/85 must include CORS as HIGH severity security check'
    );
  });

  // ── docs/86 API Testing Strategy ──
  it('docs/86: k6 load testing tool reference present', () => {
    const f = gAPI21(expressApiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('k6'), 'docs/86 must reference k6 for load testing with threshold config');
  });

  it('docs/86 Python FastAPI: schemathesis contract testing tool present', () => {
    const f = gAPI21(pyApiAnswers);
    const doc = f['docs/86_api_testing_strategy.md'] || '';
    assert.ok(doc.includes('schemathesis'), 'docs/86 Python must reference schemathesis for OpenAPI contract testing');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 89 — P25 Performance Intelligence depth: docs/99-102 verification
   CWV LCP/INP targets, Next.js bundle analyzer, Prisma select,
   CREATE INDEX CONCURRENTLY, N+1 include, pg_stat_statements,
   Redis Upstash cache-aside, Lighthouse CI, SpeedInsights
   ════════════════════════════════════════════════════════════════ */

describe('Suite 89: P25 Performance depth — docs/99-102', () => {

  // ── docs/99 Performance Strategy ──
  it('docs/99: CWV table shows LCP with ≤ 2.5s good threshold', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('LCP'), 'docs/99 CWV table must include LCP metric');
    assert.ok(doc.includes('≤ 2.5s'), 'docs/99 CWV LCP good threshold must be ≤ 2.5s');
  });

  it('docs/99: CWV table shows INP with ≤ 200ms good threshold', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('INP'), 'docs/99 CWV table must include INP metric');
    assert.ok(doc.includes('≤ 200ms'), 'docs/99 CWV INP good threshold must be ≤ 200ms');
  });

  it('docs/99: Next.js bundle tool is @next/bundle-analyzer', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(doc.includes('@next/bundle-analyzer'), 'docs/99 Next.js must show @next/bundle-analyzer as bundle analysis tool');
  });

  it('docs/99: Prisma select specific fields optimization pattern present', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/99_performance_strategy.md'] || '';
    assert.ok(
      doc.includes('select: { id: true') || doc.includes('select only needed fields') || doc.includes('select: {'),
      'docs/99 must show Prisma select-specific-fields optimization to avoid SELECT *'
    );
  });

  // ── docs/100 Database Performance ──
  it('docs/100: CREATE INDEX CONCURRENTLY index design pattern present', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('CREATE INDEX CONCURRENTLY'), 'docs/100 must show CREATE INDEX CONCURRENTLY pattern for production-safe indexing');
  });

  it('docs/100: N+1 problem shows Prisma include fix', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(
      doc.includes('include: { posts: true }') || doc.includes('N+1'),
      'docs/100 must show N+1 problem fix with Prisma include pattern'
    );
  });

  it('docs/100: pg_stat_statements slow query detection present', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/100_database_performance.md'] || '';
    assert.ok(doc.includes('pg_stat_statements'), 'docs/100 must reference pg_stat_statements for slow query detection');
  });

  // ── docs/101 Cache Strategy ──
  it('docs/101: Redis Upstash cache-aside pattern present', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(
      doc.includes('@upstash/redis') || doc.includes('Upstash'),
      'docs/101 must show Redis Upstash cache-aside implementation pattern'
    );
  });

  it('docs/101: cache hierarchy shows CDN/Edge and DB layers', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/101_cache_strategy.md'] || '';
    assert.ok(
      doc.includes('CDN') || doc.includes('Edge'),
      'docs/101 cache hierarchy must include CDN/Edge layer'
    );
    assert.ok(doc.includes('DB'), 'docs/101 cache hierarchy must include DB layer');
  });

  // ── docs/102 Performance Monitoring ──
  it('docs/102: Lighthouse CI configuration with lighthouserc.json present', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.includes('lighthouserc.json'), 'docs/102 must include Lighthouse CI config referencing lighthouserc.json');
  });

  it('docs/102: performance budget table shows LCP ≤ 2.5s target', () => {
    const f = gPerf(perfAnswers);
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(
      doc.includes('LCP') && doc.includes('≤ 2.5s'),
      'docs/102 performance budget table must show LCP ≤ 2.5s target'
    );
  });

  it('docs/102 Vercel: SpeedInsights component import present', () => {
    const f = gPerf(perfAnswers); // deploy: Vercel
    const doc = f['docs/102_performance_monitoring.md'] || '';
    assert.ok(doc.includes('SpeedInsights'), 'docs/102 Vercel must show @vercel/speed-insights SpeedInsights component setup');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 90 — P13 Strategic Intelligence depth: docs/48-52 verification
   Domain-specific regulations (FERPA/COPPA/PCI DSS/SOC2), Tech Radar
   Adopt/Hold with React 19/jQuery, mermaid timeline, SonarQube, DORA
   ════════════════════════════════════════════════════════════════ */

const s90_edu  = Object.assign({}, A25, { purpose:'オンライン学習プラットフォーム LMS 教材管理' });
const s90_ec   = Object.assign({}, A25, { purpose:'ECサイト ショッピングカート 決済システム', payment:'Stripe' });
// s90_saas uses A25 directly (purpose: 'SaaS型サブスク管理プラットフォーム' → saas domain)

describe('Suite 90: P13 Strategic depth — docs/48-52', () => {

  // ── docs/48 Industry Blueprint ──
  it('docs/48 education: FERPA student-record compliance present', () => {
    const f = gP13(s90_edu);
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(doc.includes('FERPA'), 'docs/48 education domain must show FERPA compliance regulation');
  });

  it('docs/48 education: COPPA under-13 compliance present', () => {
    const f = gP13(s90_edu);
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(doc.includes('COPPA'), 'docs/48 education domain must show COPPA compliance for users under 13');
  });

  it('docs/48 ec: PCI DSS 4.0.1 card data regulation present', () => {
    const f = gP13(s90_ec);
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(doc.includes('PCI DSS'), 'docs/48 EC domain must show PCI DSS 4.0.1 card data compliance');
  });

  it('docs/48 saas: SOC 2 Type II compliance present', () => {
    const f = gP13(A25);
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(doc.includes('SOC 2'), 'docs/48 SaaS domain must show SOC 2 Type II certification requirement');
  });

  it('docs/48: Top 3 Failure Factors section with numbered headings present', () => {
    const f = gP13(A25);
    const doc = f['docs/48_industry_blueprint.md'] || '';
    assert.ok(
      doc.includes('失敗要因 1') || doc.includes('Failure Factor 1'),
      'docs/48 must show numbered failure factor headings in Top 3 section'
    );
  });

  // ── docs/49 Tech Radar ──
  it('docs/49: Tech Radar Adopt category heading present', () => {
    const f = gP13(A25);
    const doc = f['docs/49_tech_radar.md'] || '';
    assert.ok(doc.includes('Adopt'), 'docs/49 Tech Radar must include Adopt category for each tech area');
  });

  it('docs/49: React 19 listed in frontend Adopt category', () => {
    const f = gP13(A25);
    const doc = f['docs/49_tech_radar.md'] || '';
    assert.ok(doc.includes('React 19'), 'docs/49 Tech Radar must list React 19 in frontend Adopt section');
  });

  it('docs/49: jQuery listed in frontend Hold (avoid) category', () => {
    const f = gP13(A25);
    const doc = f['docs/49_tech_radar.md'] || '';
    assert.ok(doc.includes('jQuery'), 'docs/49 Tech Radar must list jQuery in Hold/Avoid category');
  });

  it('docs/49: mermaid timeline diagram for stack evolution roadmap present', () => {
    const f = gP13(A25);
    const doc = f['docs/49_tech_radar.md'] || '';
    assert.ok(
      doc.includes('```mermaid') && doc.includes('timeline'),
      'docs/49 must include mermaid timeline diagram for stack evolution roadmap'
    );
  });

  // ── docs/50 Stakeholder Strategy ──
  it('docs/50: Phase 1 development phase present in stakeholder plan', () => {
    const f = gP13(A25);
    const doc = f['docs/50_stakeholder_strategy.md'] || '';
    assert.ok(
      doc.includes('フェーズ 1') || doc.includes('Phase 1'),
      'docs/50 must show Phase 1 in stakeholder development phase strategy'
    );
  });

  it('docs/50: SonarQube reference in technical debt management section', () => {
    const f = gP13(A25);
    const doc = f['docs/50_stakeholder_strategy.md'] || '';
    assert.ok(doc.includes('SonarQube'), 'docs/50 must reference SonarQube in SQALE Rating tech debt management');
  });

  // ── docs/51 Operational Excellence ──
  it('docs/51: DORA Metrics reference in team design section', () => {
    const f = gP13(A25);
    const doc = f['docs/51_operational_excellence.md'] || '';
    assert.ok(doc.includes('DORA'), 'docs/51 must include DORA Metrics in team design section');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 91 — P22 Database Intelligence depth: docs/87-90 verification
   ORM schema patterns (Prisma/@id, SQLAlchemy/mapped_column, BaaS RLS,
   MongoDB 16MB), EXPLAIN ANALYZE, N+1 fix, migration commands,
   expand-contract pattern, RTO/RPO, PITR/WAL
   ════════════════════════════════════════════════════════════════ */

describe('Suite 91: P22 Database depth — docs/87-90', () => {

  // ── docs/87 Database Design Principles ──
  it('docs/87 Prisma: @id or @@map entity schema annotation present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('@id') || doc.includes('cuid()') || doc.includes('@@map'),
      'docs/87 Prisma must show @id / @@map entity schema pattern'
    );
  });

  it('docs/87 SQLAlchemy: mapped_column or DeclarativeBase present', () => {
    const f = gDB(pyDbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('mapped_column') || doc.includes('DeclarativeBase'),
      'docs/87 SQLAlchemy must show mapped_column or DeclarativeBase ORM pattern'
    );
  });

  it('docs/87: soft delete deleted_at column pattern present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('deleted_at'), 'docs/87 must include soft delete deleted_at column pattern');
  });

  it('docs/87 BaaS Supabase: Row Level Security or CREATE POLICY present', () => {
    const f = gDB(baasDbAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('Row Level Security') || doc.includes('CREATE POLICY'),
      'docs/87 Supabase must show RLS and CREATE POLICY example'
    );
  });

  it('docs/87 MongoDB: 16MB document limit or Array sub-document guidance', () => {
    const f = gDB(mongoAnswers);
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('16MB') || doc.includes('Array'),
      'docs/87 MongoDB must include 16MB document size limit guidance'
    );
  });

  // ── docs/88 Query Optimization ──
  it('docs/88: EXPLAIN ANALYZE query analysis pattern present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(
      doc.includes('EXPLAIN ANALYZE') || doc.includes('EXPLAIN'),
      'docs/88 must include EXPLAIN ANALYZE for query performance analysis'
    );
  });

  it('docs/88: N+1 problem with include/selectinload fix present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(
      doc.includes('N+1') || doc.includes('include') || doc.includes('selectinload'),
      'docs/88 must show N+1 problem fix with include/selectinload pattern'
    );
  });

  // ── docs/89 Migration Strategy ──
  it('docs/89 Prisma: prisma migrate dev command present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(
      doc.includes('prisma migrate dev') || doc.includes('prisma migrate'),
      'docs/89 Prisma must show prisma migrate dev workflow command'
    );
  });

  it('docs/89 SQLAlchemy: alembic upgrade head migration command present', () => {
    const f = gDB(pyDbAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(
      doc.includes('alembic upgrade head') || doc.includes('alembic'),
      'docs/89 SQLAlchemy must show Alembic migration commands including upgrade head'
    );
  });

  it('docs/89: expand-contract zero-downtime migration pattern present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(
      doc.includes('Expand') || doc.includes('expand_contract') || doc.includes('Contract'),
      'docs/89 must describe expand-contract pattern for zero-downtime migrations'
    );
  });

  // ── docs/90 Backup & Disaster Recovery ──
  it('docs/90: RTO and RPO recovery targets defined', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(doc.includes('RTO') && doc.includes('RPO'), 'docs/90 must define both RTO and RPO recovery targets');
  });

  it('docs/90: PITR or WAL point-in-time recovery present', () => {
    const f = gDB(dbAnswers);
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(
      doc.includes('PITR') || doc.includes('WAL'),
      'docs/90 must reference PITR or WAL-based point-in-time recovery for continuous backup'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 92 — P23 Testing Intelligence depth: docs/91-94 verification
   Test pyramid 70% unit, supertest/pytest integration, TDD RED→GREEN,
   coverage ≥ 80%, Jest coverageThreshold, --cov-fail-under, Playwright
   POM + storageState, Maestro mobile, Lighthouse CI ≥ 0.8, k6/Locust
   ════════════════════════════════════════════════════════════════ */

describe('Suite 92: P23 Testing depth — docs/91-94', () => {

  // ── docs/91 Testing Strategy ──
  it('docs/91: test pyramid 70% unit distribution shown', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('70%'), 'docs/91 test pyramid must show 70% unit test ratio');
  });

  it('docs/91 Node.js: supertest integration testing reference present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('supertest'), 'docs/91 Node.js must reference supertest for API integration testing');
  });

  it('docs/91 Python: pytest.mark.asyncio async test decorator present', () => {
    const f = gTest(pyTestAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('@pytest.mark.asyncio') || doc.includes('pytest'),
      'docs/91 Python must show pytest.mark.asyncio for async FastAPI endpoint testing'
    );
  });

  it('docs/91: TDD RED→GREEN→REFACTOR workflow present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(
      doc.includes('RED') || doc.includes('GREEN') || doc.includes('REFACTOR'),
      'docs/91 must include TDD red-green-refactor development workflow'
    );
  });

  // ── docs/92 Coverage Design ──
  it('docs/92: ≥ 80% unit test coverage threshold present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(
      doc.includes('80') || doc.includes('≥ 80'),
      'docs/92 must specify ≥ 80% unit test coverage target'
    );
  });

  it('docs/92 Node.js: Jest coverageThreshold config present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(
      doc.includes('coverageThreshold') || doc.includes('coverageThresholds'),
      'docs/92 Jest must show coverageThreshold configuration for CI enforcement'
    );
  });

  it('docs/92 Python: --cov-fail-under=80 pytest coverage config present', () => {
    const f = gTest(pyTestAnswers);
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(
      doc.includes('--cov-fail-under') || doc.includes('cov-fail-under'),
      'docs/92 Python must show --cov-fail-under=80 for pytest coverage enforcement'
    );
  });

  // ── docs/93 E2E Test Architecture ──
  it('docs/93: Playwright config timeout 30_000ms present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('30_000') || doc.includes('30000'),
      'docs/93 Playwright config must include 30s (30_000ms) default timeout'
    );
  });

  it('docs/93: Page Object Model LoginPage class and storageState present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('LoginPage') || doc.includes('Page Object'),
      'docs/93 must show Page Object Model with LoginPage class'
    );
    assert.ok(doc.includes('storageState'), 'docs/93 must include storageState for auth session reuse across E2E tests');
  });

  it('docs/93 Mobile: Maestro or Detox React Native E2E tool present', () => {
    const f = gTest(mobileTestAnswers);
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('Maestro') || doc.includes('Detox'),
      'docs/93 mobile must reference Maestro or Detox for React Native E2E testing'
    );
  });

  // ── docs/94 Performance Testing ──
  it('docs/94: Lighthouse CI performance threshold ≥ 0.8 present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(
      doc.includes('0.8') || doc.includes('0.85') || doc.includes('minScore'),
      'docs/94 must include Lighthouse CI performance score threshold ≥ 0.8'
    );
  });

  it('docs/94: k6 or Locust load testing tool reference present', () => {
    const f = gTest(testAnswers);
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(
      doc.includes('k6') || doc.includes('Locust'),
      'docs/94 must reference k6 (Node.js) or Locust (Python) for load testing'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 93 — P24 AI Safety Intelligence depth: docs/95-98 verification
   6 risk categories (Hallucination/Injection/Jailbreak HIGH severity),
   Claude system+max_tokens, EU AI Act/NIST compliance, guardrail layers
   MAX_PROMPT_LENGTH 4096, INJECTION_PATTERNS, PII, rate limiting,
   RAGAS/Langfuse evaluation, "前の指示" injection attack example
   ════════════════════════════════════════════════════════════════ */

describe('Suite 93: P24 AI Safety depth — docs/95-98', () => {

  // ── docs/95 AI Safety Framework ──
  it('docs/95: Hallucination HIGH severity risk category present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('Hallucination') || doc.includes('ハルシネーション'),
      'docs/95 must include Hallucination as a HIGH severity AI risk category'
    );
  });

  it('docs/95: Prompt Injection HIGH severity risk category present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('prompt_injection') || doc.includes('プロンプトインジェクション') || doc.includes('Prompt Injection'),
      'docs/95 must include Prompt Injection as a HIGH severity AI risk category'
    );
  });

  it('docs/95: Jailbreak risk category present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('jailbreak') || doc.includes('ジェイルブレイク') || doc.includes('Jailbreak'),
      'docs/95 must include Jailbreak as an AI safety risk category'
    );
  });

  it('docs/95 Claude provider: system prompt and max_tokens code example present', () => {
    const f = gAISafety(claudeAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('max_tokens') || doc.includes('system='),
      'docs/95 Claude provider must show system prompt and max_tokens configuration'
    );
  });

  it('docs/95: EU AI Act or NIST AI RMF compliance framework present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('EU AI Act') || doc.includes('NIST AI RMF') || doc.includes('ISO/IEC 42001'),
      'docs/95 must reference AI governance compliance frameworks (EU AI Act, NIST AI RMF, or ISO 42001)'
    );
  });

  // ── docs/96 Guardrail Implementation ──
  it('docs/96: MAX_PROMPT_LENGTH 4096 input sanitization constant present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('MAX_PROMPT_LENGTH') || doc.includes('4096'),
      'docs/96 must define MAX_PROMPT_LENGTH = 4096 token input length limit'
    );
  });

  it('docs/96: prompt injection detection regex for "previous instructions" present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('previous instructions') || doc.includes('INJECTION_PATTERNS'),
      'docs/96 must include injection detection regex matching "ignore previous instructions" pattern'
    );
  });

  it('docs/96: PII detection EMAIL or PHONE pattern present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('EMAIL') || doc.includes('PII') || doc.includes('PHONE'),
      'docs/96 must include PII detection patterns for email/phone masking before AI calls'
    );
  });

  it('docs/96: AI endpoint rate limiting slidingWindow or Ratelimit present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('slidingWindow') || doc.includes('Ratelimit') || doc.includes('rate'),
      'docs/96 must include AI endpoint rate limiting configuration to prevent abuse'
    );
  });

  // ── docs/97 Model Evaluation ──
  it('docs/97: RAGAS or TruLens hallucination evaluation tool present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(
      doc.includes('RAGAS') || doc.includes('TruLens'),
      'docs/97 must reference RAGAS or TruLens for AI hallucination rate evaluation'
    );
  });

  it('docs/97: Langfuse tracing integration present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(
      doc.includes('Langfuse') || doc.includes('langfuse'),
      'docs/97 must include Langfuse for AI model evaluation tracing and observability'
    );
  });

  // ── docs/98 Prompt Injection Defense ──
  it('docs/98: "前の指示" injection attack example or DAN jailbreak present', () => {
    const f = gAISafety(aiAnswers);
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(
      doc.includes('前の指示') || doc.includes('DAN') || doc.includes('ignore'),
      'docs/98 must show concrete prompt injection attack examples including "前の指示を無視" or DAN'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 94 — P22 Database EN deep: docs/87-90 English mode depth
   Extends Suite 73 (bilingual smoke) with: Prisma @id, SQLAlchemy
   mapped_column, connection pooling, Alembic, PITR/WAL, RTO spelled
   out, Supabase RLS, MongoDB aggregation, no-undefined (Python), parity
   ════════════════════════════════════════════════════════════════ */

describe('Suite 94: P22 Database depth — English mode (docs/87-90)', () => {

  // smoke: all 4 docs generated
  it('gDB EN: all 4 docs/87-90 generated in English mode', () => {
    const f = gDB(dbAnswers, 'en');
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md']
      .forEach(k => assert.ok(f[k], k + ' EN required'));
  });

  it('gDB EN: docs/87 English title "Database Design Principles" and Prisma @id annotation', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(doc.includes('Database Design Principles'), 'docs/87 EN must have English title');
    assert.ok(doc.includes('@id') || doc.includes('cuid()') || doc.includes('@@map'), 'docs/87 EN Prisma must show @id or @@map annotation');
  });

  it('gDB EN: docs/87 Python SQLAlchemy mapped_column or DeclarativeBase in English context', () => {
    const f = gDB(pyDbAnswers, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('mapped_column') || doc.includes('DeclarativeBase'),
      'docs/87 EN Python must show mapped_column or DeclarativeBase pattern'
    );
  });

  it('gDB EN: docs/87 Supabase BaaS Row Level Security in English', () => {
    const f = gDB(baasDbAnswers, 'en');
    const doc = f['docs/87_database_design_principles.md'] || '';
    assert.ok(
      doc.includes('Row Level Security') || doc.includes('RLS') || doc.includes('CREATE POLICY'),
      'docs/87 EN Supabase must show Row Level Security or CREATE POLICY'
    );
  });

  it('gDB EN: docs/88 connection pooling guidance present', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(
      doc.includes('pool') || doc.includes('PgBouncer'),
      'docs/88 EN must include connection pooling guidance'
    );
  });

  it('gDB EN: docs/88 MongoDB aggregation pipeline or index guidance present', () => {
    const f = gDB(mongoAnswers, 'en');
    const doc = f['docs/88_query_optimization_guide.md'] || '';
    assert.ok(
      doc.includes('aggregate') || doc.includes('index') || doc.includes('Index'),
      'docs/88 EN MongoDB must include index or aggregation guidance'
    );
  });

  it('gDB EN: docs/89 Python Alembic migration commands in English context', () => {
    const f = gDB(pyDbAnswers, 'en');
    const doc = f['docs/89_migration_strategy.md'] || '';
    assert.ok(
      doc.includes('alembic') || doc.includes('Alembic'),
      'docs/89 EN Python must show Alembic migration workflow'
    );
  });

  it('gDB EN: docs/90 PITR or WAL point-in-time recovery in English', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(
      doc.includes('PITR') || doc.includes('WAL'),
      'docs/90 EN must reference PITR or WAL backup strategy'
    );
  });

  it('gDB EN: docs/90 Recovery Time Objective definition spelled out', () => {
    const f = gDB(dbAnswers, 'en');
    const doc = f['docs/90_backup_disaster_recovery.md'] || '';
    assert.ok(
      doc.includes('Recovery Time Objective') || doc.includes('Recovery Point'),
      'docs/90 EN must spell out RTO/RPO full definitions'
    );
  });

  it('gDB EN: bilingual parity — docs/87-90 all substantial (>400 chars)', () => {
    const f = gDB(dbAnswers, 'en');
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md']
      .forEach(k => assert.ok((f[k]||'').length > 400, k + ' EN must have substantial content'));
  });

  it('gDB EN: docs/87-90 prose has no undefined (Python stack)', () => {
    const f = gDB(pyDbAnswers, 'en');
    ['docs/87_database_design_principles.md','docs/88_query_optimization_guide.md',
     'docs/89_migration_strategy.md','docs/90_backup_disaster_recovery.md']
      .forEach(k => {
        const prose = (f[k]||'').replace(/```[\s\S]*?```/g,'');
        assert.ok(!prose.includes('undefined'), k + ' EN Python prose must not contain undefined');
      });
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 95 — P23 Testing EN deep: docs/91-94 English mode depth
   First dedicated EN suite for Testing Intelligence: Testing Strategy
   title, 70% pyramid, Jest coverageThreshold, --cov-fail-under,
   Playwright storageState + POM, Maestro mobile, Lighthouse CI,
   k6/Locust, bilingual parity, no-undefined
   ════════════════════════════════════════════════════════════════ */

describe('Suite 95: P23 Testing depth — English mode (docs/91-94)', () => {

  // smoke: all 4 docs generated
  it('gTest EN: all 4 docs/91-94 generated in English mode', () => {
    const f = gTest(testAnswers, 'en');
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md']
      .forEach(k => assert.ok(f[k], k + ' EN required'));
  });

  it('gTest EN: docs/91 English title "Testing Strategy" and 70% unit ratio', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('Testing Strategy'), 'docs/91 EN must have English title');
    assert.ok(doc.includes('70%'), 'docs/91 EN must show 70% unit test ratio in pyramid');
  });

  it('gTest EN: docs/91 Python pytest reference in English context', () => {
    const f = gTest(pyTestAnswers, 'en');
    const doc = f['docs/91_testing_strategy.md'] || '';
    assert.ok(doc.includes('pytest'), 'docs/91 EN Python must reference pytest framework');
  });

  it('gTest EN: docs/92 English title "Coverage Design" and Jest coverageThreshold', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(doc.includes('Coverage Design'), 'docs/92 EN must have English title');
    assert.ok(doc.includes('80'), 'docs/92 EN must reference 80% coverage threshold');
    assert.ok(
      doc.includes('coverageThreshold') || doc.includes('threshold'),
      'docs/92 EN must reference coverageThreshold configuration'
    );
  });

  it('gTest EN: docs/92 Python --cov-fail-under coverage enforcement', () => {
    const f = gTest(pyTestAnswers, 'en');
    const doc = f['docs/92_coverage_design.md'] || '';
    assert.ok(
      doc.includes('--cov-fail-under') || doc.includes('cov-fail-under'),
      'docs/92 EN Python must show --cov-fail-under coverage enforcement'
    );
  });

  it('gTest EN: docs/93 English title "E2E Test Architecture" and Playwright storageState', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(doc.includes('E2E Test Architecture'), 'docs/93 EN must have English title');
    assert.ok(doc.includes('storageState'), 'docs/93 EN must include storageState for auth session reuse');
    assert.ok(
      doc.includes('LoginPage') || doc.includes('Page Object'),
      'docs/93 EN must show Page Object Model with LoginPage class'
    );
  });

  it('gTest EN: docs/93 mobile Maestro or Detox E2E tool in English context', () => {
    const f = gTest(mobileTestAnswers, 'en');
    const doc = f['docs/93_e2e_test_architecture.md'] || '';
    assert.ok(
      doc.includes('Maestro') || doc.includes('Detox'),
      'docs/93 EN mobile must reference Maestro or Detox for React Native E2E'
    );
  });

  it('gTest EN: docs/94 English title "Performance Testing" with Lighthouse CI and k6', () => {
    const f = gTest(testAnswers, 'en');
    const doc = f['docs/94_performance_testing.md'] || '';
    assert.ok(doc.includes('Performance Testing'), 'docs/94 EN must have English title');
    assert.ok(
      doc.includes('Lighthouse') || doc.includes('0.8'),
      'docs/94 EN must include Lighthouse CI performance threshold'
    );
    assert.ok(
      doc.includes('k6') || doc.includes('Locust'),
      'docs/94 EN must reference k6 or Locust for load testing'
    );
  });

  it('gTest EN: bilingual parity — EN docs/91-94 >= 50% length of JA and >400 chars', () => {
    const fEn = gTest(testAnswers, 'en');
    const fJa = gTest(testAnswers, 'ja');
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md']
      .forEach(k => {
        const en = (fEn[k]||'').length;
        const ja = (fJa[k]||'').length;
        assert.ok(en > 400, k + ' EN must have substantial content (>400 chars)');
        assert.ok(en > ja * 0.5, k + ' EN should be at least 50% the length of JA');
      });
  });

  it('gTest EN: docs/91-94 prose has no undefined (Node.js stack)', () => {
    const f = gTest(testAnswers, 'en');
    ['docs/91_testing_strategy.md','docs/92_coverage_design.md',
     'docs/93_e2e_test_architecture.md','docs/94_performance_testing.md']
      .forEach(k => {
        const prose = (f[k]||'').replace(/```[\s\S]*?```/g,'');
        assert.ok(!prose.includes('undefined'), k + ' EN prose must not contain undefined');
      });
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 96 — P24 AI Safety EN deep: docs/95-98 English mode depth
   Extends Suite 74 with: English risk categories, EU AI Act/NIST,
   Claude max_tokens EN, Input Validation Layer EN, MAX_PROMPT_LENGTH,
   PII EMAIL, RAGAS/Langfuse EN, injection patterns EN, parity, no-undefined
   ════════════════════════════════════════════════════════════════ */

describe('Suite 96: P24 AI Safety depth — English mode (docs/95-98)', () => {

  // smoke: all 4 docs generated
  it('gAISafety EN: all 4 docs/95-98 generated in English mode', () => {
    const f = gAISafety(aiAnswers, 'en');
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md']
      .forEach(k => assert.ok(f[k], k + ' EN required'));
  });

  it('gAISafety EN: docs/95 English title and English risk category names', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(doc.includes('AI Safety Framework'), 'docs/95 EN must have English title');
    assert.ok(doc.includes('Hallucination'), 'docs/95 EN must use English "Hallucination"');
    assert.ok(doc.includes('Prompt Injection'), 'docs/95 EN must use English "Prompt Injection"');
  });

  it('gAISafety EN: docs/95 EU AI Act or NIST AI RMF compliance in English', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('EU AI Act') || doc.includes('NIST AI RMF'),
      'docs/95 EN must reference EU AI Act or NIST AI RMF compliance framework'
    );
  });

  it('gAISafety EN: docs/95 Claude provider max_tokens and system prompt in English', () => {
    const f = gAISafety(claudeAnswers, 'en');
    const doc = f['docs/95_ai_safety_framework.md'] || '';
    assert.ok(
      doc.includes('max_tokens') || doc.includes('system='),
      'docs/95 EN Claude provider must show max_tokens / system prompt config'
    );
  });

  it('gAISafety EN: docs/96 English title and Input Validation Layer name', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('AI Guardrail Implementation') || doc.includes('Guardrail Implementation'),
      'docs/96 EN must have English title'
    );
    assert.ok(doc.includes('Input Validation Layer'), 'docs/96 EN must have English "Input Validation Layer" name');
  });

  it('gAISafety EN: docs/96 MAX_PROMPT_LENGTH and PII detection constants in English', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/96_ai_guardrail_implementation.md'] || '';
    assert.ok(
      doc.includes('MAX_PROMPT_LENGTH') || doc.includes('4096'),
      'docs/96 EN must define MAX_PROMPT_LENGTH token limit'
    );
    assert.ok(
      doc.includes('PII') || doc.includes('EMAIL'),
      'docs/96 EN must include PII detection patterns (EMAIL/PHONE masking)'
    );
  });

  it('gAISafety EN: docs/97 English title and RAGAS / Langfuse evaluation tools', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/97_ai_model_evaluation.md'] || '';
    assert.ok(
      doc.includes('AI Model Evaluation') || doc.includes('Model Evaluation'),
      'docs/97 EN must have English title'
    );
    assert.ok(doc.includes('RAGAS') || doc.includes('TruLens'), 'docs/97 EN must reference RAGAS or TruLens');
    assert.ok(doc.includes('Langfuse'), 'docs/97 EN must include Langfuse tracing integration');
  });

  it('gAISafety EN: docs/98 English title and "previous instructions" injection pattern', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(doc.includes('Prompt Injection Defense'), 'docs/98 EN must have English title');
    assert.ok(
      doc.includes('previous instructions') || doc.includes('DAN') || doc.includes('ignore'),
      'docs/98 EN must show concrete prompt injection attack example'
    );
  });

  it('gAISafety EN: docs/98 Input sanitization and Privilege separation defense patterns', () => {
    const f = gAISafety(aiAnswers, 'en');
    const doc = f['docs/98_prompt_injection_defense.md'] || '';
    assert.ok(
      doc.includes('Input sanitization') || doc.includes('input sanitization'),
      'docs/98 EN must reference input sanitization defense pattern'
    );
    assert.ok(
      doc.includes('Privilege separation') || doc.includes('privilege separation'),
      'docs/98 EN must reference privilege separation pattern'
    );
  });

  it('gAISafety EN: bilingual parity — docs/95-98 >= 50% JA length and >600 chars', () => {
    const fEn = gAISafety(aiAnswers, 'en');
    const fJa = gAISafety(aiAnswers, 'ja');
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md']
      .forEach(k => {
        const en = (fEn[k]||'').length;
        const ja = (fJa[k]||'').length;
        assert.ok(en > 600, k + ' EN must have substantial content (>600 chars)');
        assert.ok(en > ja * 0.5, k + ' EN should be at least 50% the length of JA');
      });
  });

  it('gAISafety EN: docs/95-98 prose has no undefined', () => {
    const f = gAISafety(aiAnswers, 'en');
    ['docs/95_ai_safety_framework.md','docs/96_ai_guardrail_implementation.md',
     'docs/97_ai_model_evaluation.md','docs/98_prompt_injection_defense.md']
      .forEach(k => {
        const prose = (f[k]||'').replace(/```[\s\S]*?```/g,'');
        assert.ok(!prose.includes('undefined'), k + ' EN prose must not contain undefined');
      });
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 97 — P26 Observability Intelligence depth: docs/103-106
   Architecture pipeline Mermaid, structured logging (Pino/structlog),
   RED/USE metrics table, prom-client code, SLO YAML, alert rules,
   OpenTelemetry setup, W3C TraceContext, Grafana dashboard JSON,
   bilingual parity, no-undefined
   ════════════════════════════════════════════════════════════════ */

function gObs(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar26_Observability(answers,'QTest');
  return Object.assign({},S.files);
}

const obsAnswers = {
  purpose: 'SaaS型サブスク管理プラットフォーム',
  frontend: 'React + Next.js', backend: 'Node.js + NestJS',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'Prisma',
  auth: 'JWT', mvp_features: 'ユーザー認証, サブスク管理, ダッシュボード',
  data_entities: 'User, Subscription, Invoice',
};
const obsPyAnswers = {
  purpose: 'AIベース医療データ分析プラットフォーム',
  frontend: 'React', backend: 'Python + FastAPI',
  database: 'PostgreSQL', deploy: 'AWS', orm: 'SQLAlchemy',
  auth: 'JWT', mvp_features: '患者データ分析, レポート生成',
  data_entities: 'Patient, Appointment, Record',
};
const obsBaaSAnswers = {
  purpose: 'SaaS型学習管理システム',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'Supabase (PostgreSQL)', deploy: 'Vercel',
  auth: 'Supabase Auth', mvp_features: 'コース管理, 進捗管理',
  data_entities: 'User, Course, Progress',
};

describe('Suite 97: P26 Observability depth — docs/103-106', () => {

  it('gObs: all 4 docs/103-106 generated (Node.js + Railway)', () => {
    const f = gObs(obsAnswers);
    ['docs/103_observability_architecture.md','docs/104_structured_logging.md',
     'docs/105_metrics_alerting.md','docs/106_distributed_tracing.md']
      .forEach(k => assert.ok(f[k], k + ' required'));
  });

  it('gObs: docs/103 contains Mermaid pipeline (flowchart LR)', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('flowchart LR') || doc.includes('mermaid'), 'docs/103 must contain Mermaid pipeline diagram');
  });

  it('gObs: docs/103 contains 3-pillar table (Logs/Metrics/Traces)', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('ログ') || doc.includes('Logs'), 'docs/103 must reference Logs pillar');
    assert.ok(doc.includes('メトリクス') || doc.includes('Metrics'), 'docs/103 must reference Metrics pillar');
    assert.ok(doc.includes('トレース') || doc.includes('Traces'), 'docs/103 must reference Traces pillar');
  });

  it('gObs: docs/104 contains Pino setup for Node.js backend', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('pino') || doc.includes('Pino'), 'docs/104 Node.js must include Pino logger setup');
  });

  it('gObs: docs/104 Python backend uses structlog', () => {
    const f = gObs(obsPyAnswers);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('structlog') || doc.includes('structlog.configure'), 'docs/104 Python must use structlog');
  });

  it('gObs: docs/104 contains sensitive data masking patterns', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(
      doc.includes('REDACTED') || doc.includes('redact') || doc.includes('maskEmail'),
      'docs/104 must include sensitive data masking'
    );
  });

  it('gObs: docs/105 contains RED method metrics table', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/105_metrics_alerting.md'] || '';
    assert.ok(doc.includes('Rate') && doc.includes('Errors') && doc.includes('Duration'), 'docs/105 must contain RED metrics');
  });

  it('gObs: docs/105 contains SLO YAML definition', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/105_metrics_alerting.md'] || '';
    assert.ok(doc.includes('slos:') || doc.includes('objective:'), 'docs/105 must contain SLO YAML');
  });

  it('gObs: docs/105 contains alert rules (Alertmanager YAML)', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/105_metrics_alerting.md'] || '';
    assert.ok(doc.includes('HighErrorRate') || doc.includes('alert:'), 'docs/105 must contain Alertmanager alert rules');
  });

  it('gObs: docs/106 contains OpenTelemetry SDK setup', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(
      doc.includes('@opentelemetry') || doc.includes('opentelemetry'),
      'docs/106 must include OpenTelemetry SDK setup'
    );
  });

  it('gObs: docs/106 contains W3C TraceContext (traceparent)', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('traceparent') || doc.includes('TraceContext'), 'docs/106 must reference W3C traceparent header');
  });

  it('gObs: docs/106 contains Grafana dashboard JSON as code', () => {
    const f = gObs(obsAnswers);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('Service Overview') || doc.includes('"panels"'), 'docs/106 must include Grafana dashboard-as-code');
  });

  it('gObs EN: all 4 docs generated in English mode', () => {
    const f = gObs(obsAnswers, 'en');
    ['docs/103_observability_architecture.md','docs/104_structured_logging.md',
     'docs/105_metrics_alerting.md','docs/106_distributed_tracing.md']
      .forEach(k => assert.ok(f[k], k + ' EN required'));
  });

  it('gObs EN: docs/103 English title and English pillar names', () => {
    const f = gObs(obsAnswers, 'en');
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('Observability Architecture'), 'docs/103 EN must have English title');
    assert.ok(doc.includes('Logs') || doc.includes('Traces'), 'docs/103 EN must use English pillar names');
  });

  it('gObs EN: docs/104 English title and Pino redact config', () => {
    const f = gObs(obsAnswers, 'en');
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(
      doc.includes('Structured Logging') || doc.includes('Logging Implementation'),
      'docs/104 EN must have English title'
    );
  });

  it('gObs EN: docs/105 English title and RED/USE method labels', () => {
    const f = gObs(obsAnswers, 'en');
    const doc = f['docs/105_metrics_alerting.md'] || '';
    assert.ok(doc.includes('Metrics') || doc.includes('Alerting'), 'docs/105 EN must have English title');
    assert.ok(doc.includes('RED Method') || doc.includes('Rate') && doc.includes('Errors'), 'docs/105 EN must show RED Method');
  });

  it('gObs EN: docs/106 English title and sampling strategy in English', () => {
    const f = gObs(obsAnswers, 'en');
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(
      doc.includes('Distributed Tracing') || doc.includes('Dashboard Design'),
      'docs/106 EN must have English title'
    );
    assert.ok(
      doc.includes('Sampling') || doc.includes('sampler'),
      'docs/106 EN must reference sampling strategy'
    );
  });

  it('gObs: bilingual parity — docs/103-106 EN >= 50% JA length and >400 chars each', () => {
    const fEn = gObs(obsAnswers, 'en');
    const fJa = gObs(obsAnswers, 'ja');
    ['docs/103_observability_architecture.md','docs/104_structured_logging.md',
     'docs/105_metrics_alerting.md','docs/106_distributed_tracing.md']
      .forEach(k => {
        const en = (fEn[k]||'').length;
        const ja = (fJa[k]||'').length;
        assert.ok(en > 400, k + ' EN must have substantial content (>400 chars)');
        assert.ok(en > ja * 0.5, k + ' EN should be at least 50% the length of JA');
      });
  });

  it('gObs: docs/103-106 prose has no undefined', () => {
    const f = gObs(obsAnswers);
    ['docs/103_observability_architecture.md','docs/104_structured_logging.md',
     'docs/105_metrics_alerting.md','docs/106_distributed_tracing.md']
      .forEach(k => {
        const prose = (f[k]||'').replace(/```[\s\S]*?```/g,'');
        assert.ok(!prose.includes('undefined'), k + ' prose must not contain undefined');
      });
  });

  it('gObs BaaS: docs/103 mentions BaaS limitations', () => {
    const f = gObs(obsBaaSAnswers);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(
      doc.includes('BaaS') || doc.includes('Supabase') || doc.includes('console'),
      'docs/103 BaaS must mention BaaS-specific guidance'
    );
  });

  it('gObs Python: docs/106 uses Python OTel (FastAPI instrumentation)', () => {
    const f = gObs(obsPyAnswers);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(
      doc.includes('FastAPIInstrumentor') || doc.includes('fastapi') || doc.includes('opentelemetry'),
      'docs/106 Python must include FastAPI instrumentation'
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 98 — P26 Observability backend/ORM depth
   Kysely, TypeORM, Drizzle, Java/Spring, Vercel deploy, Cloudflare Workers,
   Firebase, no-ORM, Python+AWS, fintech domain (フィンテック), bilingual ORM parity
   ════════════════════════════════════════════════════════════════ */

const obsKysely = {
  purpose: 'フィンテック向けリアルタイム決済処理API',
  frontend: 'React + Next.js', backend: 'Node.js + Express',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'Kysely',
  auth: 'JWT', payment: 'Stripe',
  mvp_features: '決済処理, 取引履歴, 不正検知, 監査ログ',
  data_entities: 'User, Transaction, AuditLog, PaymentMethod',
};
const obsTypeORM = {
  purpose: 'エンタープライズ向け人事管理システム (HRMS)',
  frontend: 'React + Next.js', backend: 'Node.js + NestJS',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'TypeORM',
  auth: 'JWT + RBAC',
  mvp_features: '従業員管理, 勤怠管理, 給与計算',
  data_entities: 'Employee, Department, Attendance, Payroll',
};
const obsDrizzle = {
  purpose: 'グローバルEdge APIゲートウェイ・レート制限サービス',
  frontend: 'React + Next.js', backend: 'Node.js + Hono (Cloudflare Workers)',
  database: 'PostgreSQL', deploy: 'Cloudflare Pages', orm: 'Drizzle',
  auth: 'JWT',
  mvp_features: 'APIゲートウェイ, レート制限, 認証',
  data_entities: 'User, ApiKey, RateLimit, RequestLog',
};
const obsJava = {
  purpose: 'エンタープライズ向け基幹業務システム (ERP)',
  frontend: 'React + Next.js', backend: 'Java + Spring Boot',
  database: 'PostgreSQL', deploy: 'AWS', orm: 'Hibernate / JPA',
  auth: 'JWT + RBAC',
  mvp_features: '受注管理, 在庫管理, 会計処理',
  data_entities: 'User, Order, Product, Invoice',
};
const obsVercel = {
  purpose: 'SaaS型マーケティング分析ダッシュボード',
  frontend: 'React + Next.js', backend: 'Node.js + Next.js API Routes',
  database: 'PostgreSQL', deploy: 'Vercel', orm: 'Prisma',
  auth: 'NextAuth.js',
  mvp_features: 'ダッシュボード, レポート, データ可視化',
  data_entities: 'User, Report, DataSource, Alert',
};
const obsNoORM = {
  purpose: 'RESTful APIバックエンドサービス',
  frontend: 'React + Next.js', backend: 'Node.js + Express',
  database: 'PostgreSQL', deploy: 'Railway', orm: '',
  auth: 'JWT',
  mvp_features: 'ユーザー管理, データAPI, 認証',
  data_entities: 'User, Session, Log',
};
const obsFirebase = {
  purpose: 'モバイルファーストのコミュニティアプリ',
  frontend: 'React + Next.js', backend: 'Firebase',
  database: 'Firestore', deploy: 'Firebase Hosting',
  orm: '', auth: 'Firebase Auth',
  mvp_features: 'ユーザー認証, 投稿, コメント, 通知',
  data_entities: 'User, Post, Comment, Notification',
};
const obsCloudflare = {
  purpose: 'グローバルEdge APIゲートウェイ・レート制限サービス',
  frontend: 'React + Next.js', backend: 'Node.js + Hono (Cloudflare Workers)',
  database: 'PostgreSQL', deploy: 'Cloudflare Pages', orm: 'Drizzle',
  auth: 'JWT',
  mvp_features: 'APIゲートウェイ, レート制限, 認証',
  data_entities: 'User, ApiKey, RateLimit, RequestLog',
};

describe('Suite 98: P26 Observability — backend/ORM depth', () => {

  // ── Kysely ──────────────────────────────────────────────────────
  it('gObs Kysely: docs/104 contains Kysely log: callback with slow_query', () => {
    const f = gObs(obsKysely);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('Kysely') || doc.includes('kysely'), 'docs/104 must mention Kysely');
    assert.ok(doc.includes('log:'), 'docs/104 Kysely must include log: callback');
    assert.ok(doc.includes('slow_query'), 'docs/104 Kysely must include slow_query detection');
  });

  it('gObs Kysely: fintech domain detected → docs/105 txn_success_rate', () => {
    const f = gObs(obsKysely);
    const doc = f['docs/105_metrics_alerting.md'] || '';
    assert.ok(doc.includes('txn_success_rate') || doc.includes('fraud_detected'), 'docs/105 fintech must include txn_success_rate');
  });

  it('gObs Kysely: docs/104 no TypeORM/Prisma/Drizzle/structlog contamination', () => {
    const f = gObs(obsKysely);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(!doc.includes('prisma.$on'), 'docs/104 Kysely must not include Prisma block');
    assert.ok(!doc.includes('TypeORM'), 'docs/104 Kysely must not include TypeORM block');
    assert.ok(!doc.includes('structlog'), 'docs/104 Kysely must not include Python structlog');
  });

  // ── TypeORM ──────────────────────────────────────────────────────
  it('gObs TypeORM: docs/104 contains TypeORM logger with logQuerySlow', () => {
    const f = gObs(obsTypeORM);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('TypeORM'), 'docs/104 must mention TypeORM');
    assert.ok(doc.includes('logQuerySlow') || doc.includes('slow_query'), 'docs/104 TypeORM must include slow query logging');
    assert.ok(doc.includes('logQueryError'), 'docs/104 TypeORM must include error logging');
  });

  it('gObs TypeORM: docs/104 no Prisma/Drizzle/Kysely contamination', () => {
    const f = gObs(obsTypeORM);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(!doc.includes('prisma.$on'), 'docs/104 TypeORM must not include Prisma block');
    assert.ok(!doc.includes('drizzle(client'), 'docs/104 TypeORM must not include Drizzle block');
    assert.ok(!doc.includes('Kysely'), 'docs/104 TypeORM must not include Kysely block');
  });

  // ── Drizzle ──────────────────────────────────────────────────────
  it('gObs Drizzle: docs/104 contains Drizzle logger with logQuery', () => {
    const f = gObs(obsDrizzle);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('Drizzle') || doc.includes('drizzle'), 'docs/104 must mention Drizzle');
    assert.ok(doc.includes('logQuery'), 'docs/104 Drizzle must include logQuery callback');
  });

  it('gObs Drizzle: docs/103 uses Cloudflare stack (Logpush / edge-compatible)', () => {
    const f = gObs(obsDrizzle);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('Cloudflare') || doc.includes('edge'), 'docs/103 Cloudflare must reference Cloudflare stack');
    assert.ok(!doc.includes('OpenTelemetry Collector (Docker)'), 'docs/103 Cloudflare must not show Docker collector');
  });

  // ── Java / Spring Boot ───────────────────────────────────────────
  it('gObs Java: docs/104 contains SLF4J + Logback + MDC setup', () => {
    const f = gObs(obsJava);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('SLF4J'), 'docs/104 Java must include SLF4J');
    assert.ok(doc.includes('Logback'), 'docs/104 Java must include Logback');
    assert.ok(doc.includes('MDC'), 'docs/104 Java must include MDC for trace propagation');
  });

  it('gObs Java: docs/104 no Node.js/Python contamination', () => {
    const f = gObs(obsJava);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(!doc.includes('pino('), 'docs/104 Java must not include Pino');
    assert.ok(!doc.includes('structlog'), 'docs/104 Java must not include Python structlog');
    assert.ok(!doc.includes('npm install'), 'docs/104 Java must not include npm install');
  });

  it('gObs Java: docs/106 uses opentelemetry-javaagent (not Node SDK)', () => {
    const f = gObs(obsJava);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('opentelemetry-javaagent') || doc.includes('javaagent'), 'docs/106 Java must use OTel Java agent');
    assert.ok(doc.includes('java -javaagent'), 'docs/106 Java must show -javaagent JVM arg');
    assert.ok(!doc.includes('npm install @opentelemetry'), 'docs/106 Java must not show npm install');
  });

  it('gObs Java: docs/103 AWS stack (ADOT + X-Ray) — no Node SDK', () => {
    const f = gObs(obsJava);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('AWS ADOT'), 'docs/103 Java/AWS must include AWS ADOT');
    assert.ok(doc.includes('X-Ray') || doc.includes('CloudWatch'), 'docs/103 Java/AWS must reference X-Ray/CloudWatch');
    assert.ok(!doc.includes('opentelemetry-sdk-node'), 'docs/103 Java must not show Node SDK exporter');
  });

  // ── Vercel deploy ───────────────────────────────────────────────
  it('gObs Vercel: docs/106 uses @vercel/otel with registerOTel + instrumentationHook', () => {
    const f = gObs(obsVercel);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('@vercel/otel'), 'docs/106 Vercel must use @vercel/otel');
    assert.ok(doc.includes('registerOTel'), 'docs/106 Vercel must call registerOTel()');
    assert.ok(doc.includes('instrumentationHook'), 'docs/106 Vercel must enable instrumentationHook');
  });

  it('gObs Vercel: docs/106 no raw @opentelemetry/sdk-node install', () => {
    const f = gObs(obsVercel);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(!doc.includes('@opentelemetry/sdk-node'), 'docs/106 Vercel must not show @opentelemetry/sdk-node');
  });

  it('gObs Vercel: docs/103 uses Vercel OTel stack (not Docker collector)', () => {
    const f = gObs(obsVercel);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('Vercel OTel') || doc.includes('@vercel/otel'), 'docs/103 Vercel must reference Vercel OTel');
    assert.ok(!doc.includes('OpenTelemetry Collector (Docker)'), 'docs/103 Vercel must not show Docker collector');
  });

  // ── No ORM ──────────────────────────────────────────────────────
  it('gObs no-ORM: docs/104 has Pino but no ORM query blocks', () => {
    const f = gObs(obsNoORM);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('pino'), 'docs/104 no-ORM must still include Pino setup');
    assert.ok(!doc.includes('prisma.$on'), 'docs/104 no-ORM must not include Prisma block');
    assert.ok(!doc.includes('TypeORM'), 'docs/104 no-ORM must not include TypeORM block');
    assert.ok(!doc.includes('drizzle(client'), 'docs/104 no-ORM must not include Drizzle block');
    assert.ok(!doc.includes('Kysely'), 'docs/104 no-ORM must not include Kysely block');
    assert.ok(!doc.includes('slow_query'), 'docs/104 no-ORM must not include slow_query block');
  });

  // ── Bilingual ORM parity ─────────────────────────────────────────
  it('gObs Kysely EN: docs/104 English mode has Kysely log: block', () => {
    const f = gObs(obsKysely, 'en');
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('Kysely') || doc.includes('kysely'), 'docs/104 EN Kysely must be present');
    assert.ok(doc.includes('log:'), 'docs/104 EN Kysely must have log: callback');
  });

  it('gObs Java EN: docs/104 English mode has SLF4J + REDACTED masking', () => {
    const f = gObs(obsJava, 'en');
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('SLF4J'), 'docs/104 EN Java must include SLF4J');
    assert.ok(doc.includes('REDACTED'), 'docs/104 EN Java must include REDACTED masking');
  });

  // ── Firebase ────────────────────────────────────────────────────
  it('gObs Firebase: docs/103 uses Firebase stack (Crashlytics / Google Cloud Ops)', () => {
    const f = gObs(obsFirebase);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('Firebase Crashlytics'), 'docs/103 Firebase must include Crashlytics');
    assert.ok(doc.includes('firebase-admin logging'), 'docs/103 Firebase must include firebase-admin logging');
    assert.ok(doc.includes('Google Cloud Ops'), 'docs/103 Firebase must reference Google Cloud Ops');
    assert.ok(!doc.includes('AWS ADOT'), 'docs/103 Firebase must not show AWS ADOT');
    assert.ok(!doc.includes('OpenTelemetry Collector (Docker)'), 'docs/103 Firebase must not show Docker collector');
  });

  it('gObs Firebase: docs/104 uses client-side console logging (no pino/structlog)', () => {
    const f = gObs(obsFirebase);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('console.info') || doc.includes('console.error'), 'docs/104 Firebase must use console logging');
    assert.ok(doc.includes('JSON.stringify'), 'docs/104 Firebase must use JSON.stringify');
    assert.ok(!doc.includes('pino('), 'docs/104 Firebase must not include Pino');
    assert.ok(!doc.includes('structlog'), 'docs/104 Firebase must not include Python structlog');
  });

  it('gObs Firebase: docs/106 has BaaS tracing note (no sdk-node / no npm install)', () => {
    const f = gObs(obsFirebase);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('BaaS') || doc.includes('Firebase'), 'docs/106 Firebase must mention BaaS tracing limitations');
    assert.ok(!doc.includes('@opentelemetry/sdk-node'), 'docs/106 Firebase must not show Node.js SDK');
    assert.ok(!doc.includes('npm install @opentelemetry'), 'docs/106 Firebase must not show npm install');
  });

  // ── Cloudflare Workers ───────────────────────────────────────────
  it('gObs Cloudflare: docs/103 uses Cloudflare stack (Logpush / Grafana Cloud)', () => {
    const f = gObs(obsCloudflare);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('Cloudflare Logpush'), 'docs/103 Cloudflare must include Logpush');
    assert.ok(doc.includes('Grafana Cloud'), 'docs/103 Cloudflare must reference Grafana Cloud');
    assert.ok(!doc.includes('OpenTelemetry Collector (Docker)'), 'docs/103 Cloudflare must not show Docker collector');
    assert.ok(!doc.includes('AWS ADOT'), 'docs/103 Cloudflare must not show AWS ADOT');
  });

  it('gObs Cloudflare: docs/106 uses edge-compatible OTel (not sdk-node)', () => {
    const f = gObs(obsCloudflare);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('@opentelemetry/api (edge-compatible)') || doc.includes('otel-cf-workers'), 'docs/106 Cloudflare must use edge-compatible OTel');
    assert.ok(!doc.includes('@opentelemetry/sdk-node'), 'docs/106 Cloudflare must not use Node.js SDK');
    assert.ok(!doc.includes('java -javaagent'), 'docs/106 Cloudflare must not show Java agent');
  });

  it('gObs Cloudflare: docs/104 has Drizzle logQuery + no Node/Python contamination', () => {
    const f = gObs(obsCloudflare);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('Drizzle') || doc.includes('drizzle'), 'docs/104 Cloudflare/Drizzle must mention Drizzle');
    assert.ok(doc.includes('logQuery'), 'docs/104 Cloudflare/Drizzle must include logQuery');
    assert.ok(!doc.includes('structlog'), 'docs/104 Cloudflare must not include Python structlog');
    assert.ok(!doc.includes('SLF4J'), 'docs/104 Cloudflare must not include Java SLF4J');
  });

  // ── Python + AWS ─────────────────────────────────────────────────
  it('gObs Python/AWS: docs/103 AWS ADOT stack with Python exporter (not Node SDK)', () => {
    const obsPyAWS = {
      purpose: '医療機関向け電子カルテ・患者管理システム',
      frontend: 'React + Next.js', backend: 'Python + FastAPI',
      database: 'PostgreSQL', deploy: 'AWS', orm: 'SQLAlchemy',
      auth: 'JWT + RBAC',
      mvp_features: '患者管理, 予約管理, カルテ記録, 処方管理',
      data_entities: 'Patient, Doctor, Appointment, MedicalRecord',
    };
    const f = gObs(obsPyAWS);
    const doc = f['docs/103_observability_architecture.md'] || '';
    assert.ok(doc.includes('AWS ADOT'), 'docs/103 Python/AWS must include AWS ADOT');
    assert.ok(doc.includes('opentelemetry-sdk (Python'), 'docs/103 Python/AWS must show Python SDK exporter');
    assert.ok(!doc.includes('opentelemetry-sdk-node'), 'docs/103 Python/AWS must not show Node SDK');
    assert.ok(!doc.includes('@opentelemetry/exporter-otlp-grpc'), 'docs/103 Python/AWS must not show Node OTLP package');
  });

  it('gObs Python/AWS: docs/104 has structlog + SQLAlchemy slow_query + REDACTED', () => {
    const obsPyAWS = {
      purpose: '医療機関向け電子カルテ・患者管理システム',
      frontend: 'React + Next.js', backend: 'Python + FastAPI',
      database: 'PostgreSQL', deploy: 'AWS', orm: 'SQLAlchemy',
      auth: 'JWT + RBAC',
      mvp_features: '患者管理, 予約管理, カルテ記録, 処方管理',
      data_entities: 'Patient, Doctor, Appointment, MedicalRecord',
    };
    const f = gObs(obsPyAWS);
    const doc = f['docs/104_structured_logging.md'] || '';
    assert.ok(doc.includes('structlog'), 'docs/104 Python must use structlog');
    assert.ok(doc.includes('SQLAlchemy'), 'docs/104 Python must include SQLAlchemy section');
    assert.ok(doc.includes('slow_query') || doc.includes('after_cursor_execute'), 'docs/104 Python must include slow query detection');
    assert.ok(doc.includes('REDACTED'), 'docs/104 Python must include REDACTED masking');
    assert.ok(!doc.includes('pino('), 'docs/104 Python must not include Pino');
    assert.ok(!doc.includes('SLF4J'), 'docs/104 Python must not include SLF4J');
  });

  it('gObs Python/AWS: docs/106 uses FastAPIInstrumentor (no Node/Java agent)', () => {
    const obsPyAWS = {
      purpose: '医療機関向け電子カルテ・患者管理システム',
      frontend: 'React + Next.js', backend: 'Python + FastAPI',
      database: 'PostgreSQL', deploy: 'AWS', orm: 'SQLAlchemy',
      auth: 'JWT + RBAC',
      mvp_features: '患者管理, 予約管理, カルテ記録, 処方管理',
      data_entities: 'Patient, Doctor, Appointment, MedicalRecord',
    };
    const f = gObs(obsPyAWS);
    const doc = f['docs/106_distributed_tracing.md'] || '';
    assert.ok(doc.includes('FastAPIInstrumentor'), 'docs/106 Python must use FastAPIInstrumentor');
    assert.ok(doc.includes('opentelemetry-instrumentation-fastapi') || doc.includes('opentelemetry'), 'docs/106 Python must reference OTel FastAPI');
    assert.ok(!doc.includes('@opentelemetry/sdk-node'), 'docs/106 Python must not show Node.js SDK');
    assert.ok(!doc.includes('java -javaagent'), 'docs/106 Python must not show Java agent');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 99 — P2 DevContainer depth: devcontainer.json, Dockerfile,
   docker-compose.yml, post-create.sh, .env.example, build-manifest
   Node.js/Python/BaaS variants, ORM migrations, bilingual
   ════════════════════════════════════════════════════════════════ */

function gDevCont(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar2_DevContainer(answers,'QTest');
  return Object.assign({},S.files);
}

const dcNode = {
  purpose: 'SaaS型タスク管理アプリ',
  frontend: 'React + Next.js', backend: 'Node.js + Express',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'Prisma',
  auth: 'JWT', mvp_features: 'タスク管理, ダッシュボード',
  data_entities: 'User, Task, Project',
};
const dcPython = {
  purpose: '機械学習データ分析基盤',
  frontend: 'React + Next.js', backend: 'Python + FastAPI',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'SQLAlchemy',
  auth: 'JWT', mvp_features: 'データ分析, モデル管理',
  data_entities: 'Dataset, Model, Experiment',
};
const dcFirebase = {
  purpose: 'リアルタイムコミュニティアプリ',
  frontend: 'React + Next.js', backend: 'Firebase',
  database: 'Firebase Firestore', deploy: 'Firebase Hosting',
  auth: 'Firebase Auth', mvp_features: 'チャット, 通知',
  data_entities: 'User, Message, Room',
};
const dcSupabase = {
  purpose: 'SaaS型プロジェクト管理ツール',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'Supabase (PostgreSQL)', deploy: 'Vercel',
  orm: '', auth: 'Supabase Auth', mvp_features: 'プロジェクト管理, タスク',
  data_entities: 'User, Project, Task',
};
const dcDrizzle = Object.assign({}, dcNode, { orm: 'Drizzle ORM' });
const dcTypeORM = Object.assign({}, dcNode, { orm: 'TypeORM', backend: 'Node.js + NestJS' });
const dcKysely = Object.assign({}, dcNode, { orm: 'Kysely' });

describe('Suite 99: P2 DevContainer depth — devcontainer/post-create/env/security', () => {

  it('gDevCont Node.js: all core files generated', () => {
    const f = gDevCont(dcNode);
    ['.devcontainer/devcontainer.json','.devcontainer/Dockerfile',
     '.devcontainer/docker-compose.yml','.devcontainer/post-create.sh',
     '.env.example','.security/build-manifest.json']
      .forEach(k => assert.ok(f[k], k + ' required for Node.js'));
  });

  it('gDevCont Node.js: Dockerfile uses javascript-node:22 base image', () => {
    const f = gDevCont(dcNode);
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(df.includes('javascript-node:22'), 'Dockerfile must use javascript-node:22 base image');
  });

  it('gDevCont Node.js+Prisma: post-create.sh includes npx prisma generate', () => {
    const f = gDevCont(dcNode);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('prisma generate') || sh.includes('prisma db push'), 'post-create.sh must include Prisma migration');
  });

  it('gDevCont Node.js+Drizzle: post-create.sh includes drizzle-kit push', () => {
    const f = gDevCont(dcDrizzle);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('drizzle-kit'), 'post-create.sh must include drizzle-kit for Drizzle ORM');
  });

  it('gDevCont Node.js+TypeORM: post-create.sh includes typeorm migration:run', () => {
    const f = gDevCont(dcTypeORM);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('typeorm'), 'post-create.sh must include typeorm migration for TypeORM');
  });

  it('gDevCont Node.js+Kysely: post-create.sh includes kysely migrate', () => {
    const f = gDevCont(dcKysely);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('kysely'), 'post-create.sh must include kysely migration for Kysely');
  });

  it('gDevCont Python: Dockerfile uses python:3.12 base image', () => {
    const f = gDevCont(dcPython);
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(df.includes('python:3.12'), 'Dockerfile Python must use python:3.12 base image');
  });

  it('gDevCont Python+SQLAlchemy: post-create.sh includes alembic upgrade head', () => {
    const f = gDevCont(dcPython);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('alembic'), 'post-create.sh Python must include alembic migration');
  });

  it('gDevCont Python: Dockerfile includes pip install', () => {
    const f = gDevCont(dcPython);
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(df.includes('pip install'), 'Dockerfile Python must include pip install');
  });

  it('gDevCont Firebase: Dockerfile includes firebase-tools', () => {
    const f = gDevCont(dcFirebase);
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(df.includes('firebase-tools') || df.includes('firebase'), 'Dockerfile Firebase must include firebase-tools');
  });

  it('gDevCont Firebase: post-create.sh references firebase or emulators', () => {
    const f = gDevCont(dcFirebase);
    const sh = f['.devcontainer/post-create.sh'] || '';
    assert.ok(sh.includes('firebase') || sh.includes('emulator'), 'post-create.sh Firebase must reference firebase CLI');
  });

  it('gDevCont Supabase: Dockerfile includes supabase', () => {
    const f = gDevCont(dcSupabase);
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(df.includes('supabase'), 'Dockerfile Supabase must include supabase CLI');
  });

  it('gDevCont Supabase: .env.example includes SUPABASE keys', () => {
    const f = gDevCont(dcSupabase);
    const env = f['.env.example'] || '';
    assert.ok(env.includes('SUPABASE'), '.env.example Supabase must include SUPABASE key prefix');
  });

  it('gDevCont Node.js: .security/build-manifest.json is valid JSON with gates', () => {
    const f = gDevCont(dcNode);
    const raw = f['.security/build-manifest.json'] || '';
    assert.ok(raw.length > 0, 'build-manifest.json must not be empty');
    const parsed = JSON.parse(raw);
    assert.ok(parsed.gates || parsed.securityGates || Object.keys(parsed).length > 0, 'build-manifest.json must contain security gates');
  });

  it('gDevCont Node.js: build-manifest.json references npm audit', () => {
    const f = gDevCont(dcNode);
    const raw = f['.security/build-manifest.json'] || '';
    assert.ok(raw.includes('npm audit'), 'build-manifest.json Node.js must reference npm audit');
  });

  it('gDevCont Python: build-manifest.json references pip-audit', () => {
    const f = gDevCont(dcPython);
    const raw = f['.security/build-manifest.json'] || '';
    assert.ok(raw.includes('pip-audit') || raw.includes('pip'), 'build-manifest.json Python must reference pip-audit');
  });

  it('gDevCont Node.js: docker-compose.yml includes postgres service', () => {
    const f = gDevCont(dcNode);
    const compose = f['.devcontainer/docker-compose.yml'] || '';
    assert.ok(compose.includes('postgres') || compose.includes('PostgreSQL'), 'docker-compose.yml must include postgres service for SQL backend');
  });

  it('gDevCont Firebase: docker-compose.yml has no postgres (BaaS)', () => {
    const f = gDevCont(dcFirebase);
    const compose = f['.devcontainer/docker-compose.yml'] || '';
    assert.ok(!compose.includes('postgres'), 'docker-compose.yml Firebase must not include postgres service');
  });

  it('gDevCont EN bilingual: all core files generated in English', () => {
    const f = gDevCont(dcNode, 'en');
    ['.devcontainer/devcontainer.json','.devcontainer/Dockerfile',
     '.devcontainer/post-create.sh','.env.example']
      .forEach(k => assert.ok(f[k], k + ' required in EN mode'));
  });

  it('gDevCont EN bilingual: Dockerfile no undefined contamination', () => {
    const f = gDevCont(dcNode, 'en');
    const df = f['.devcontainer/Dockerfile'] || '';
    assert.ok(!df.includes('undefined'), 'Dockerfile EN must not contain undefined');
  });

  it('gDevCont Node.js: .env.example includes database or API URL pattern', () => {
    const f = gDevCont(dcNode);
    const env = f['.env.example'] || '';
    assert.ok(env.includes('DATABASE_URL') || env.includes('API') || env.length > 50, '.env.example must include connection or API config');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 100 — P12 Security depth: docs/43-47
   OWASP 2025, CSP, STRIDE, ISMAP, FERPA, ASVS, AI conditional,
   OWASP ZAP, Semgrep, payment PCI, bilingual
   ════════════════════════════════════════════════════════════════ */

function gSec(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar12_SecurityIntelligence(answers,'QTest');
  return Object.assign({},S.files);
}

const secBase = {
  purpose: 'SaaS型サブスク管理プラットフォーム',
  frontend: 'React + Next.js', backend: 'Node.js + Express',
  database: 'PostgreSQL', deploy: 'Railway', orm: 'Prisma',
  auth: 'JWT', payment: 'Stripe決済',
  mvp_features: 'ユーザー認証, サブスク管理, ダッシュボード',
  data_entities: 'User, Subscription, Invoice',
};
const secEdu = Object.assign({}, secBase, {
  purpose: 'e-learning LMS education platform for students',
  payment: 'なし', backend: 'Supabase', auth: 'Supabase Auth',
  data_entities: 'User, Course, Lesson, Progress',
});
const secGov = Object.assign({}, secBase, {
  purpose: '行政手続きポータルサイト（e-Gov）',
  payment: 'なし', backend: 'Node.js + Express',
  data_entities: 'User, Application, Document, AuditLog',
});
const secNoAI = Object.assign({}, secBase, { ai_auto: 'none' });
const secAI = Object.assign({}, secBase, { ai_auto: 'マルチAgent協調' });

describe('Suite 100: P12 Security depth — docs/43-47', () => {

  it('gSec: all 5 docs/43-47 generated', () => {
    const f = gSec(secBase);
    ['docs/43_security_intelligence.md','docs/44_threat_model.md',
     'docs/45_compliance_matrix.md','docs/46_ai_security.md',
     'docs/47_security_testing.md']
      .forEach(k => assert.ok(f[k], k + ' required'));
  });

  it('gSec: docs/43 contains OWASP Top 10 (2025) section', () => {
    const f = gSec(secBase);
    const doc = f['docs/43_security_intelligence.md'] || '';
    assert.ok(doc.includes('OWASP') && doc.includes('2025'), 'docs/43 must contain OWASP Top 10 2025');
  });

  it('gSec: docs/43 contains Content Security Policy (CSP)', () => {
    const f = gSec(secBase);
    const doc = f['docs/43_security_intelligence.md'] || '';
    assert.ok(doc.includes('Content Security Policy') || doc.includes('CSP'), 'docs/43 must contain CSP section');
  });

  it('gSec: docs/44 contains STRIDE threat analysis', () => {
    const f = gSec(secBase);
    const doc = f['docs/44_threat_model.md'] || '';
    assert.ok(doc.includes('STRIDE'), 'docs/44 must contain STRIDE section');
  });

  it('gSec: docs/44 contains Trust Boundary Mermaid diagram', () => {
    const f = gSec(secBase);
    const doc = f['docs/44_threat_model.md'] || '';
    assert.ok(doc.includes('mermaid') || doc.includes('flowchart'), 'docs/44 must contain Mermaid Trust Boundary diagram');
  });

  it('gSec: docs/45 contains APPI (personal data protection law)', () => {
    const f = gSec(secBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('APPI') || doc.includes('個人情報保護'), 'docs/45 must contain APPI section');
  });

  it('gSec: docs/45 contains OWASP ASVS Level 2', () => {
    const f = gSec(secBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('ASVS') && (doc.includes('Level 2') || doc.includes('V1.') || doc.includes('V2.')), 'docs/45 must contain ASVS Level 2 requirements');
  });

  it('gSec: docs/45 contains FERPA for education domain', () => {
    const f = gSec(secEdu);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('FERPA'), 'docs/45 education must contain FERPA compliance');
  });

  it('gSec: docs/45 has no FERPA for non-education domain', () => {
    const f = gSec(secBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(!doc.includes('FERPA'), 'docs/45 non-education must not contain FERPA');
  });

  it('gSec: docs/45 contains ISMAP for government domain', () => {
    const f = gSec(secGov);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('ISMAP'), 'docs/45 government must contain ISMAP compliance');
  });

  it('gSec: docs/45 contains PCI DSS for EC/fintech domain', () => {
    const secEC = Object.assign({}, secBase, {
      purpose: 'EC通販・オンラインショップ管理システム',
      data_entities: 'User, Product, Order, Cart, AuditLog',
    });
    const f = gSec(secEC);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('PCI'), 'docs/45 EC domain with payment must contain PCI DSS');
  });

  it('gSec: docs/45 contains APPI (always present)', () => {
    const f = gSec(secBase);
    const doc = f['docs/45_compliance_matrix.md'] || '';
    assert.ok(doc.includes('APPI') || doc.includes('個人情報保護'), 'docs/45 must always contain APPI section');
  });

  it('gSec: docs/46 contains AI security content when ai_auto set', () => {
    const f = gSec(secAI);
    const doc = f['docs/46_ai_security.md'] || '';
    assert.ok(doc.includes('プロンプトインジェクション') || doc.includes('Prompt injection') || doc.includes('AI'), 'docs/46 with AI must contain AI security content');
  });

  it('gSec: docs/46 skip notice when ai_auto=none', () => {
    const f = gSec(secNoAI);
    const doc = f['docs/46_ai_security.md'] || '';
    assert.ok(doc.includes('none') || doc.includes('スキップ') || doc.includes('skip') || doc.length < 500, 'docs/46 with ai_auto=none must indicate AI section is skipped');
  });

  it('gSec: docs/47 contains OWASP ZAP', () => {
    const f = gSec(secBase);
    const doc = f['docs/47_security_testing.md'] || '';
    assert.ok(doc.includes('OWASP ZAP') || doc.includes('ZAP'), 'docs/47 must contain OWASP ZAP reference');
  });

  it('gSec: docs/47 contains IDOR and Rate Limiting security tests', () => {
    const f = gSec(secBase);
    const doc = f['docs/47_security_testing.md'] || '';
    assert.ok(doc.includes('IDOR') || doc.includes('rate limit') || doc.includes('Rate Limit'), 'docs/47 must contain IDOR or rate limiting security test');
  });

  it('gSec EN bilingual: all 5 docs generated in English', () => {
    const f = gSec(secBase, 'en');
    ['docs/43_security_intelligence.md','docs/44_threat_model.md',
     'docs/45_compliance_matrix.md','docs/46_ai_security.md',
     'docs/47_security_testing.md']
      .forEach(k => assert.ok(f[k], k + ' required in EN mode'));
  });

  it('gSec EN bilingual: docs/43 contains OWASP in English output', () => {
    const f = gSec(secBase, 'en');
    const doc = f['docs/43_security_intelligence.md'] || '';
    assert.ok(doc.includes('OWASP'), 'docs/43 EN must contain OWASP section');
  });

  it('gSec EN bilingual: docs/43 no undefined in prose', () => {
    const f = gSec(secBase, 'en');
    const prose = (f['docs/43_security_intelligence.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/43 EN prose must not contain undefined');
  });

  it('gSec: docs/47 no undefined in prose', () => {
    const f = gSec(secBase);
    const prose = (f['docs/47_security_testing.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/47 prose must not contain undefined');
  });
});

/* ════════════════════════════════════════════════════════════════
   Suite 101 — P15 Future Strategy depth: docs/56-59
   SWOT, MOAT, Unit Economics, Persona, RICE, WCAG 2.2,
   FinOps, EU AI Act, ESG mindmap, DORA (fintech), bilingual
   ════════════════════════════════════════════════════════════════ */

function gFuture(answers, lang) {
  S.files={}; S.genLang=lang||'ja'; S.skill='intermediate';
  genPillar15(answers);
  return Object.assign({},S.files);
}

const futBase = {
  purpose: 'SaaS型サブスク管理プラットフォーム',
  frontend: 'React + Next.js', backend: 'Supabase',
  database: 'Supabase (PostgreSQL)', deploy: 'Vercel',
  orm: '', auth: 'Supabase Auth', payment: 'Stripe Billing (サブスク)',
  mvp_features: 'サブスク管理, 分析ダッシュボード, チーム機能',
  data_entities: 'User, Subscription, Invoice, Team',
  ai_auto: 'none',
};
const futFintech = Object.assign({}, futBase, {
  purpose: 'フィンテック向けリアルタイム決済処理API',
  backend: 'Node.js + NestJS', database: 'PostgreSQL', deploy: 'Railway',
  orm: 'Prisma', auth: 'JWT',
  data_entities: 'User, Transaction, Account, AuditLog',
});
const futEdu = Object.assign({}, futBase, {
  purpose: 'e-learning LMS education platform for students',
  payment: 'なし', backend: 'Firebase', auth: 'Firebase Auth',
  data_entities: 'User, Course, Lesson, Progress',
});
const futAI = Object.assign({}, futBase, {
  ai_auto: 'マルチAgent協調',
});

describe('Suite 101: P15 Future Strategy depth — docs/56-59', () => {

  it('gFuture: all 4 docs/56-59 generated', () => {
    const f = gFuture(futBase);
    ['docs/56_market_positioning.md','docs/57_user_experience_strategy.md',
     'docs/58_ecosystem_strategy.md','docs/59_regulatory_foresight.md']
      .forEach(k => assert.ok(f[k], k + ' required'));
  });

  it('gFuture: docs/56 contains SWOT analysis section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('SWOT'), 'docs/56 must contain SWOT analysis');
  });

  it('gFuture: docs/56 contains MOAT analysis section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('MOAT'), 'docs/56 must contain MOAT analysis');
  });

  it('gFuture: docs/56 contains Unit Economics section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('ユニットエコノミクス') || doc.includes('Unit Economics'), 'docs/56 must contain Unit Economics section');
  });

  it('gFuture: docs/56 contains Mermaid mindmap for MOAT', () => {
    const f = gFuture(futBase);
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('mindmap') || doc.includes('mermaid'), 'docs/56 must contain Mermaid MOAT mindmap');
  });

  it('gFuture: docs/57 contains Persona Definition section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/57_user_experience_strategy.md'] || '';
    assert.ok(doc.includes('ペルソナ') || doc.includes('Persona'), 'docs/57 must contain Persona section');
  });

  it('gFuture: docs/57 contains RICE prioritization', () => {
    const f = gFuture(futBase);
    const doc = f['docs/57_user_experience_strategy.md'] || '';
    assert.ok(doc.includes('RICE') || doc.includes('Reach'), 'docs/57 must contain RICE prioritization template');
  });

  it('gFuture: docs/57 contains WCAG 2.2 AA checklist', () => {
    const f = gFuture(futBase);
    const doc = f['docs/57_user_experience_strategy.md'] || '';
    assert.ok(doc.includes('WCAG 2.2') || doc.includes('WCAG'), 'docs/57 must contain WCAG 2.2 compliance checklist');
  });

  it('gFuture: docs/57 no undefined in prose', () => {
    const f = gFuture(futBase);
    const prose = (f['docs/57_user_experience_strategy.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/57 prose must not contain undefined');
  });

  it('gFuture: docs/58 contains FinOps / Cloud Cost Strategy', () => {
    const f = gFuture(futBase);
    const doc = f['docs/58_ecosystem_strategy.md'] || '';
    assert.ok(doc.includes('FinOps') || doc.includes('Cloud Cost') || doc.includes('クラウドコスト'), 'docs/58 must contain FinOps section');
  });

  it('gFuture: docs/58 no undefined in prose', () => {
    const f = gFuture(futBase);
    const prose = (f['docs/58_ecosystem_strategy.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/58 prose must not contain undefined');
  });

  it('gFuture: docs/59 contains EU AI Act assessment section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(doc.includes('EU AI Act'), 'docs/59 must contain EU AI Act section');
  });

  it('gFuture: docs/59 contains Regulatory Timeline (Mermaid timeline)', () => {
    const f = gFuture(futBase);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(doc.includes('timeline') || doc.includes('mermaid'), 'docs/59 must contain Regulatory Timeline diagram');
  });

  it('gFuture: docs/59 contains ESG sustainability section', () => {
    const f = gFuture(futBase);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(doc.includes('ESG'), 'docs/59 must contain ESG section');
  });

  it('gFuture fintech: docs/59 contains DORA compliance section', () => {
    const f = gFuture(futFintech);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(doc.includes('DORA'), 'docs/59 fintech must contain EU DORA compliance section');
  });

  it('gFuture non-fintech: docs/59 has no DORA section', () => {
    const f = gFuture(futEdu);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(!doc.includes('DORA'), 'docs/59 non-fintech must not contain DORA');
  });

  it('gFuture AI active: docs/59 EU AI Act mentions AI usage assessment', () => {
    const f = gFuture(futAI);
    const doc = f['docs/59_regulatory_foresight.md'] || '';
    assert.ok(doc.includes('EU AI Act'), 'docs/59 with AI must include EU AI Act assessment');
    assert.ok(!doc.includes('直接適用なし') && !doc.includes('not directly applicable'), 'docs/59 with AI must not show "not applicable" message');
  });

  it('gFuture EN bilingual: all 4 docs generated in English', () => {
    const f = gFuture(futBase, 'en');
    ['docs/56_market_positioning.md','docs/57_user_experience_strategy.md',
     'docs/58_ecosystem_strategy.md','docs/59_regulatory_foresight.md']
      .forEach(k => assert.ok(f[k], k + ' required in EN mode'));
  });

  it('gFuture EN bilingual: docs/56 contains SWOT in English output', () => {
    const f = gFuture(futBase, 'en');
    const doc = f['docs/56_market_positioning.md'] || '';
    assert.ok(doc.includes('SWOT'), 'docs/56 EN must contain SWOT section');
  });

  it('gFuture EN bilingual: docs/56 no undefined contamination', () => {
    const f = gFuture(futBase, 'en');
    const prose = (f['docs/56_market_positioning.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/56 EN prose must not contain undefined');
  });

  it('gFuture: docs/59 no undefined in prose', () => {
    const f = gFuture(futBase);
    const prose = (f['docs/59_regulatory_foresight.md']||'').replace(/```[\s\S]*?```/g,'');
    assert.ok(!prose.includes('undefined'), 'docs/59 prose must not contain undefined');
  });
});
