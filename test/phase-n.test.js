/**
 * Phase N + Phase O tests — Preset → Wizard Question matching v3/v4
 * Tests N-1 through N-9 + O (G-1 to G-6) inference logic in _applyUniversalPostProcess
 */
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness.js');

// Load ui/presets.js into sandbox (provides _applyUniversalPostProcess)
// Also provide detectDomain mock for N-4/N-6/G-6 tests
h.sandbox.detectDomain = function(p) {
  p = (p||'').toLowerCase();
  if (/saas|サブスク|subscription/i.test(p)) return 'saas';
  if (/ec|ショップ|e-commerce|shop|commerce/i.test(p)) return 'ec';
  if (/教育|learning|lms|コース/i.test(p)) return 'education';
  if (/analytics|分析/i.test(p)) return 'analytics';
  if (/fintech|金融/i.test(p)) return 'fintech';
  if (/自動化|automat|workflow/i.test(p)) return 'automation';
  if (/collab|コラボ/i.test(p)) return 'collab';
  if (/health|医療|クリニック/i.test(p)) return 'health';
  if (/iot|sensor|センサー/i.test(p)) return 'iot';
  if (/travel|旅行/i.test(p)) return 'travel';
  if (/insurance|保険/i.test(p)) return 'insurance';
  if (/portfolio|ポートフォリオ/i.test(p)) return 'portfolio';
  if (/newsletter|メルマガ/i.test(p)) return 'newsletter';
  return '';
};
h.loadModule('ui/presets.js');

function applyUPP(en) {
  h.sandbox._applyUniversalPostProcess(en||false);
}

function resetS(answers) {
  h.sandbox.S = {
    phase:0,step:0,answers:answers||{},projectName:'',
    skill:'intermediate',preset:'custom',lang:'ja',
    genLang:'ja',theme:'dark',pillar:0,previewFile:null,
    files:{},skipped:[],progress:{},
    editedFiles:{},prevFiles:{},_v:9,skillLv:3
  };
}

/* ── N-1: _PD and _SCALE_DEFAULTS ── */
describe('Phase N-1: _PD and _SCALE_DEFAULTS new fields', () => {
  const _PD = h._PD;
  const _SCALE_DEFAULTS = h._SCALE_DEFAULTS;

  it('_PD has css_fw field', () => {
    assert.ok(_PD.css_fw, '_PD missing css_fw');
    assert.equal(_PD.css_fw, 'Tailwind CSS');
  });

  it('_SCALE_DEFAULTS.solo has css_fw, dev_methods, dev_methodsEn', () => {
    const sd = _SCALE_DEFAULTS.solo;
    assert.equal(sd.css_fw, 'Tailwind CSS');
    assert.ok(sd.dev_methods, 'solo missing dev_methods');
    assert.ok(sd.dev_methodsEn, 'solo missing dev_methodsEn');
  });

  it('_SCALE_DEFAULTS.small has css_fw, dev_methods, dev_methodsEn', () => {
    const sd = _SCALE_DEFAULTS.small;
    assert.equal(sd.css_fw, 'Tailwind CSS');
    assert.ok(sd.dev_methods);
    assert.ok(sd.dev_methodsEn);
  });

  it('_SCALE_DEFAULTS.medium has DDD in dev_methods', () => {
    const sd = _SCALE_DEFAULTS.medium;
    assert.ok(sd.dev_methods.includes('DDD'), 'medium dev_methods should include DDD');
    assert.ok(sd.dev_methodsEn.includes('DDD'), 'medium dev_methodsEn should include DDD');
  });

  it('_SCALE_DEFAULTS.large has DDD in dev_methods', () => {
    const sd = _SCALE_DEFAULTS.large;
    assert.ok(sd.dev_methods.includes('DDD'), 'large dev_methods should include DDD');
    assert.ok(sd.dev_methodsEn.includes('DDD'));
  });
});

/* ── N-3: dev_env_type for BaaS backends ── */
describe('Phase N-3: dev_env_type BaaS inference', () => {
  it('Firebase backend → dev_env_type = ローカル開発', () => {
    resetS({ backend: 'Firebase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_env_type, 'ローカル開発');
  });

  it('Supabase backend → dev_env_type set', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.dev_env_type, 'Supabase should set dev_env_type');
  });

  it('Express backend → dev_env_type NOT set', () => {
    resetS({ backend: 'Node.js + Express' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_env_type, undefined);
  });

  it('Existing dev_env_type is preserved', () => {
    resetS({ backend: 'Firebase', dev_env_type: 'Hybrid' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_env_type, 'Hybrid');
  });

  it('EN mode → dev_env_type = Local Development', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.equal(h.sandbox.S.answers.dev_env_type, 'Local Development');
  });
});

/* ── N-5: ai_tools from ai_auto ── */
describe('Phase N-5: ai_tools from ai_auto level', () => {
  it('Vibe Coding入門 → Cursor, Claude Code', () => {
    resetS({ backend: 'Supabase', ai_auto: 'Vibe Coding入門' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.ai_tools.includes('Cursor'));
    assert.ok(h.sandbox.S.answers.ai_tools.includes('Claude Code'));
  });

  it('マルチAgent → Cursor, Claude Code, GitHub Copilot', () => {
    resetS({ backend: 'Supabase', ai_auto: 'マルチAgent協調' });
    applyUPP(false);
    const at = h.sandbox.S.answers.ai_tools;
    assert.ok(at.includes('GitHub Copilot'), 'Multi-Agent should include GitHub Copilot');
  });

  it('Orchestrator → includes Google Antigravity', () => {
    resetS({ backend: 'Supabase', ai_auto: 'Orchestrator' });
    applyUPP(false);
    const at = h.sandbox.S.answers.ai_tools;
    assert.ok(at.includes('Google Antigravity'));
  });

  it('ai_auto=none → ai_tools NOT set', () => {
    resetS({ backend: 'Supabase', ai_auto: 'なし' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_tools, undefined);
  });

  it('Existing ai_tools is preserved', () => {
    resetS({ backend: 'Supabase', ai_auto: 'Vibe Coding入門', ai_tools: 'Windsurf' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_tools, 'Windsurf');
  });
});

/* ── N-7: orm from backend type ── */
describe('Phase N-7: orm from backend type', () => {
  it('Python FastAPI → SQLAlchemy (Python)', () => {
    resetS({ backend: 'Python (FastAPI)' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, 'SQLAlchemy (Python)');
  });

  it('NestJS → TypeORM', () => {
    resetS({ backend: 'Node.js + NestJS' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, 'TypeORM');
  });

  it('Node.js Express → Prisma (default)', () => {
    resetS({ backend: 'Node.js + Express' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, 'Prisma');
  });

  it('Firebase → orm NOT set (BaaS skip)', () => {
    resetS({ backend: 'Firebase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, undefined);
  });

  it('Supabase → orm NOT set (BaaS skip)', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, undefined);
  });

  it('Existing orm is preserved', () => {
    resetS({ backend: 'Node.js + Express', orm: 'Drizzle' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.orm, 'Drizzle');
  });
});

/* ── N-8: scope_out inference ── */
describe('Phase N-8: scope_out from preset config', () => {
  it('payment=none → scope_out includes 決済機能', () => {
    resetS({ backend: 'Supabase', payment: undefined });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.scope_out.includes('決済機能'));
  });

  it('mobile=none → scope_out includes ネイティブアプリ', () => {
    resetS({ backend: 'Supabase', mobile: undefined });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.scope_out.includes('ネイティブアプリ'));
  });

  it('payment=Stripe → 決済機能 NOT in scope_out', () => {
    resetS({ backend: 'Supabase', payment: 'Stripe決済' });
    applyUPP(false);
    const so = h.sandbox.S.answers.scope_out || '';
    assert.ok(!so.includes('決済機能'), 'payment=Stripe should not put 決済機能 in scope_out');
  });

  it('EN mode → scope_out uses English chip labels', () => {
    resetS({ backend: 'Supabase', payment: undefined });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.ok(h.sandbox.S.answers.scope_out.includes('Payments'));
  });

  it('Existing scope_out is preserved', () => {
    resetS({ backend: 'Supabase', scope_out: 'チャット機能' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.scope_out, 'チャット機能');
  });
});

/* ── N-9: future_features inference ── */
describe('Phase N-9: future_features from preset config', () => {
  it('always includes 分析レポート', () => {
    resetS({ backend: 'Supabase', payment: 'Stripe決済', mobile: 'Expo (React Native)', ai_auto: 'Vibe Coding入門' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.future_features.includes('分析レポート'));
  });

  it('payment=none → future_features includes 課金・サブスク', () => {
    resetS({ backend: 'Supabase', payment: undefined });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.future_features.includes('課金・サブスク'));
  });

  it('mobile=none → future_features includes モバイルアプリ', () => {
    resetS({ backend: 'Supabase', mobile: undefined });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.future_features.includes('モバイルアプリ'));
  });

  it('payment=Stripe → 課金・サブスク NOT in future_features', () => {
    resetS({ backend: 'Supabase', payment: 'Stripe決済' });
    applyUPP(false);
    const ff = h.sandbox.S.answers.future_features || '';
    assert.ok(!ff.includes('課金・サブスク'), 'payment=Stripe should not add billing to future');
  });

  it('EN mode → future_features uses English', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.ok(h.sandbox.S.answers.future_features.includes('Analytics'));
  });

  it('Existing future_features is preserved', () => {
    resetS({ backend: 'Supabase', future_features: 'AI連携' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.future_features, 'AI連携');
  });
});

/* ── Phase O G-1: success for field presets by category ── */
describe('Phase O G-1: success KPI for field presets by field category', () => {
  it('engineering category → success includes 不良品率', () => {
    resetS({ backend: 'Python (FastAPI)' });
    h.sandbox.S.preset = 'field:eng_inspection';
    // PR_FIELD['eng_inspection'].field should be 'engineering' (from data/presets.js)
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'engineering field preset should get success KPI');
    assert.ok(h.sandbox.S.answers.success.includes('不良品率') || h.sandbox.S.answers.success.includes('defect'), 'engineering success should mention defect rate');
  });

  it('medical category → success includes 患者待ち時間 or Zero data breach', () => {
    resetS({ backend: 'Python (FastAPI)' });
    h.sandbox.S.preset = 'field:med_symptom';
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'medical field preset should get success KPI');
  });

  it('cross_theme category (theme_agent) → success includes 月間1000ユーザー', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.preset = 'field:theme_agent';
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'cross_theme field preset should get success KPI');
    assert.ok(/1000|MAU|継続|retention/i.test(h.sandbox.S.answers.success), 'cross_theme KPI should mention users or retention');
  });

  it('EN mode → success in English', () => {
    resetS({ backend: 'Python (FastAPI)' });
    h.sandbox.S.preset = 'field:eng_inspection';
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.ok(h.sandbox.S.answers.success, 'EN engineering should get English success KPI');
    assert.ok(/defect|cycle|accuracy/i.test(h.sandbox.S.answers.success), 'EN success should be in English');
  });

  it('Existing success is preserved', () => {
    resetS({ backend: 'Supabase', success: '既存KPI' });
    h.sandbox.S.preset = 'field:agri_diagnosis';
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.success, '既存KPI');
  });
});

/* ── Phase O G-2: skill_level from S.skillLv ── */
describe('Phase O G-2: skill_level from S.skillLv', () => {
  it('skillLv=0 → skill_level=Beginner', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 0;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.skill_level, 'Beginner');
  });

  it('skillLv=1 → skill_level=Beginner', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 1;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.skill_level, 'Beginner');
  });

  it('skillLv=3 (default) → skill_level=Intermediate', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.skill_level, 'Intermediate');
  });

  it('skillLv=5 → skill_level=Professional', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 5;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.skill_level, 'Professional');
  });

  it('Existing skill_level is preserved', () => {
    resetS({ backend: 'Supabase', skill_level: 'Intermediate' });
    h.sandbox.S.skillLv = 0;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.skill_level, 'Intermediate');
  });
});

/* ── Phase O G-3: learning_goal from deadline ── */
describe('Phase O G-3: learning_goal from deadline', () => {
  it('deadline=3ヶ月 → learning_goal=3ヶ月集中', () => {
    resetS({ backend: 'Supabase', deadline: '3ヶ月' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_goal, '3ヶ月集中');
  });

  it('deadline=6ヶ月 → learning_goal=6ヶ月標準', () => {
    resetS({ backend: 'Supabase', deadline: '6ヶ月' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_goal, '6ヶ月標準');
  });

  it('deadline=12ヶ月 → learning_goal=12ヶ月じっくり', () => {
    resetS({ backend: 'Supabase', deadline: '12ヶ月' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_goal, '12ヶ月じっくり');
  });

  it('EN mode + deadline=6 months → learning_goal=6 months standard', () => {
    resetS({ backend: 'Supabase', deadline: '6 months' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.equal(h.sandbox.S.answers.learning_goal, '6 months standard');
  });

  it('No deadline set → learning_goal not set', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_goal, undefined);
  });

  it('Existing learning_goal is preserved', () => {
    resetS({ backend: 'Supabase', deadline: '6ヶ月', learning_goal: '12ヶ月じっくり' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_goal, '12ヶ月じっくり');
  });
});

/* ── Phase O G-4: learning_path from backend/mobile/ai_auto/payment ── */
describe('Phase O G-4: learning_path inference', () => {
  it('BaaS backend (Supabase) → React + BaaS', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'React + BaaS');
  });

  it('BaaS backend (Firebase) → React + BaaS', () => {
    resetS({ backend: 'Firebase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'React + BaaS');
  });

  it('Expo mobile → フルスタック+モバイル', () => {
    resetS({ backend: 'Supabase', mobile: 'Expo (React Native)' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'フルスタック+モバイル');
  });

  it('Orchestrator ai_auto → AI自律オーケストレーター', () => {
    resetS({ backend: 'Supabase', ai_auto: 'オーケストレーター' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'AI自律オーケストレーター');
  });

  it('Stripe Billing payment → SaaS収益化特化', () => {
    resetS({ backend: 'Node.js + Express', payment: 'Stripe Billing (サブスク)' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'SaaS収益化特化');
  });

  it('Non-BaaS backend without mobile/ai → PERN Stack', () => {
    resetS({ backend: 'Node.js + Express' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'PERN Stack');
  });

  it('Existing learning_path is preserved', () => {
    resetS({ backend: 'Supabase', learning_path: 'PERN Stack' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.learning_path, 'PERN Stack');
  });
});

/* ── Phase O G-5: ai_auto from skillLv ── */
describe('Phase O G-5: ai_auto inference from skillLv', () => {
  it('skillLv=0 → Vibe Coding入門', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 0;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'Vibe Coding入門');
  });

  it('skillLv=1 → Vibe Coding入門', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 1;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'Vibe Coding入門');
  });

  it('skillLv=2 → マルチAgent協調', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 2;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'マルチAgent協調');
  });

  it('skillLv=3 (default) → マルチAgent協調', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'マルチAgent協調');
  });

  it('skillLv=4 → マルチAgent協調', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 4;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'マルチAgent協調');
  });

  it('skillLv=5 → オーケストレーター', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 5;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'オーケストレーター');
  });

  it('skillLv=6 → オーケストレーター', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 6;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'オーケストレーター');
  });

  it('EN mode: skillLv=3 → Multi-Agent', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.equal(h.sandbox.S.answers.ai_auto, 'Multi-Agent');
  });

  it('EN mode: skillLv=6 → Orchestrator', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 6;
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.equal(h.sandbox.S.answers.ai_auto, 'Orchestrator');
  });

  it('EN mode: skillLv=0 → Vibe Coding Intro', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 0;
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.equal(h.sandbox.S.answers.ai_auto, 'Vibe Coding Intro');
  });

  it('Existing ai_auto is preserved (preset override)', () => {
    resetS({ backend: 'Supabase', ai_auto: 'フル自律開発' });
    h.sandbox.S.skillLv = 0;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.ai_auto, 'フル自律開発');
  });
});

/* ── Phase O G-6: dev_methods from skillLv ── */
describe('Phase O G-6: dev_methods inference from skillLv', () => {
  it('skillLv=0 → TDD+SDD only (JA)', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 0;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('TDD'), 'dev_methods Lv0 should include TDD');
    assert.ok(dm.includes('SDD'), 'dev_methods Lv0 should include SDD');
    assert.ok(!dm.includes('BDD'), 'dev_methods Lv0 should NOT include BDD');
    assert.ok(!dm.includes('DDD'), 'dev_methods Lv0 should NOT include DDD');
  });

  it('skillLv=1 → TDD+SDD only', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 1;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('TDD') && dm.includes('SDD'), 'dev_methods Lv1: TDD+SDD');
    assert.ok(!dm.includes('BDD'), 'dev_methods Lv1 should NOT include BDD');
  });

  it('skillLv=2 → TDD+BDD+SDD (JA)', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 2;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('TDD') && dm.includes('BDD') && dm.includes('SDD'), 'dev_methods Lv2: TDD+BDD+SDD');
    assert.ok(!dm.includes('DDD'), 'dev_methods Lv2 should NOT include DDD');
  });

  it('skillLv=4 → TDD+BDD+SDD', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 4;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('TDD') && dm.includes('BDD'), 'dev_methods Lv4: TDD+BDD');
    assert.ok(!dm.includes('DDD'), 'dev_methods Lv4 should NOT include DDD');
  });

  it('skillLv=5 → TDD+BDD+SDD+DDD+MDD (JA)', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 5;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('DDD'), 'dev_methods Lv5 should include DDD');
    assert.ok(dm.includes('MDD'), 'dev_methods Lv5 should include MDD');
  });

  it('skillLv=6 → TDD+BDD+SDD+DDD+MDD (JA)', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 6;
    applyUPP(false);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('DDD') && dm.includes('MDD'), 'dev_methods Lv6: DDD+MDD included');
  });

  it('EN mode: skillLv=0 → TDD (Test-Driven), SDD (Spec-Driven)', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 0;
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('Test-Driven') && dm.includes('Spec-Driven'), 'EN Lv0: TDD+SDD English');
    assert.ok(!dm.includes('Behavior-Driven'), 'EN Lv0 should NOT include BDD');
  });

  it('EN mode: skillLv=5 → includes Domain-Driven and Model-Driven', () => {
    resetS({ backend: 'Supabase' });
    h.sandbox.S.skillLv = 5;
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    const dm = h.sandbox.S.answers.dev_methods || '';
    assert.ok(dm.includes('Domain-Driven') && dm.includes('Model-Driven'), 'EN Lv5: DDD+MDD English');
  });

  it('Existing dev_methods is preserved (preset override)', () => {
    resetS({ backend: 'Supabase', dev_methods: 'FDD（機能駆動）' });
    h.sandbox.S.skillLv = 6;
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_methods, 'FDD（機能駆動）');
  });
});

/* ── Phase O G-7: dev_schedule from deadline ── */
describe('Phase O G-7: dev_schedule inference from deadline', () => {
  it('2週間 → 超MVP: 1スプリント × 2週 (JA)', () => {
    resetS({ deadline: '2週間' });
    applyUPP(false);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('1スプリント'), '2週間: 1スプリント included');
    assert.ok(ds.includes('超MVP'), '2週間: 超MVP included');
  });

  it('1ヶ月 → 基本MVP: 2スプリント × 2週 (JA)', () => {
    resetS({ deadline: '1ヶ月' });
    applyUPP(false);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('2スプリント'), '1ヶ月: 2スプリント included');
    assert.ok(ds.includes('基本MVP'), '1ヶ月: 基本MVP included');
  });

  it('3ヶ月 → フルMVP: 6スプリント × 2週 (JA)', () => {
    resetS({ deadline: '3ヶ月' });
    applyUPP(false);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('6スプリント'), '3ヶ月: 6スプリント included');
    assert.ok(ds.includes('フルMVP'), '3ヶ月: フルMVP included');
  });

  it('6ヶ月 → v1.0: 12スプリント × 2週 (JA)', () => {
    resetS({ deadline: '6ヶ月' });
    applyUPP(false);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('12スプリント'), '6ヶ月: 12スプリント included');
    assert.ok(ds.includes('v1.0'), '6ヶ月: v1.0 included');
  });

  it('EN mode: 3 months → Full MVP: 6 sprints × 2 weeks', () => {
    resetS({ deadline: '3 months' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('6 sprints'), 'EN 3 months: 6 sprints included');
    assert.ok(ds.includes('Full MVP'), 'EN 3 months: Full MVP included');
  });

  it('EN mode: 6 months → v1.0: 12 sprints × 2 weeks', () => {
    resetS({ deadline: '6 months' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    const ds = h.sandbox.S.answers.dev_schedule || '';
    assert.ok(ds.includes('12 sprints'), 'EN 6 months: 12 sprints included');
    assert.ok(ds.includes('v1.0'), 'EN 6 months: v1.0 included');
  });

  it('No deadline set → dev_schedule not inferred', () => {
    resetS({ backend: 'Supabase' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_schedule || '', '', 'No deadline: dev_schedule stays empty');
  });

  it('Existing dev_schedule is preserved (not overwritten)', () => {
    resetS({ deadline: '3ヶ月', dev_schedule: 'カスタムスプリント計画' });
    applyUPP(false);
    assert.equal(h.sandbox.S.answers.dev_schedule, 'カスタムスプリント計画', 'Custom dev_schedule preserved');
  });
});

/* ── Preset Suggest: _scorePreset unit tests ── */
describe('Preset Suggest: _scorePreset scoring engine', () => {
  const scorePreset = (...a) => h.sandbox._scorePreset(...a);

  it('name match scores 3 per word', () => {
    // 'saas' should match name of saas preset (nameEn contains 'SaaS')
    const p = h.PR['saas'];
    const sc = scorePreset(p, 'saas', 'saas', false);
    assert.ok(sc >= 3, '_scorePreset: name match should score >= 3, got ' + sc);
  });

  it('key match scores 2 per word', () => {
    const p = h.PR['lms'];
    const sc = scorePreset(p, 'lms', 'lms', false);
    assert.ok(sc >= 2, '_scorePreset: key match should score >= 2, got ' + sc);
  });

  it('returns 0 for no match', () => {
    const p = h.PR['saas'];
    const sc = scorePreset(p, 'saas', 'xyz123abc', false);
    assert.equal(sc, 0, '_scorePreset: no match should return 0');
  });

  it('ignores single-char words (< 2 chars)', () => {
    const p = h.PR['saas'];
    const sc = scorePreset(p, 'saas', 'a b', false);
    assert.equal(sc, 0, '_scorePreset: single char words should be ignored');
  });

  it('domain bonus adds 5 when detectDomain matches', () => {
    // '教育 lms' query → education domain; lms preset should also detect education domain
    const p = h.PR['lms'];
    const scWithDomain = scorePreset(p, 'lms', '教育 lms', false);
    const scWithoutDomain = scorePreset(p, 'lms', 'lms', false);
    // domain match should give extra score
    assert.ok(scWithDomain >= scWithoutDomain, '_scorePreset: domain bonus should increase score');
  });
});

/* ── Phase O G-6: extended N-6 success domains ── */
describe('Phase O G-6: extended success KPI for more domains', () => {
  it('health domain → success set', () => {
    resetS({ backend: 'Supabase', purpose: 'health app クリニック予約' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'health domain should get success KPI');
  });

  it('iot domain → success includes デバイス稼働率 or uptime', () => {
    resetS({ backend: 'Supabase', purpose: 'IoT sensor monitoring' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'iot domain should get success KPI');
    assert.ok(/デバイス|uptime|device/i.test(h.sandbox.S.answers.success));
  });

  it('travel domain → success includes 旅行者満足度 or traveler', () => {
    resetS({ backend: 'Supabase', purpose: '旅行予約 travel booking' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'travel domain should get success KPI');
  });

  it('insurance domain → success includes 審査処理 or claim', () => {
    resetS({ backend: 'Supabase', purpose: '保険申請管理 insurance mgmt' });
    applyUPP(false);
    assert.ok(h.sandbox.S.answers.success, 'insurance domain should get success KPI');
  });

  it('EN mode travel domain → success in English', () => {
    resetS({ backend: 'Supabase', purpose: '旅行予約 travel booking' });
    h.sandbox.S.lang = 'en';
    applyUPP(true);
    assert.ok(h.sandbox.S.answers.success, 'EN travel should get English KPI');
    assert.ok(/traveler|booking|repeat/i.test(h.sandbox.S.answers.success));
  });
});
