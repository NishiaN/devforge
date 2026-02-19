// test/skill-level.test.js — 7-level skill system tests

const {test, describe} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// ═══ Setup: load state.js to get SKILL_TIERS, skillTier, SKILL_NAMES ═══
const stateCode = fs.readFileSync(path.join(__dirname, '../src/core/state.js'), 'utf8');

// Mock browser globals needed by state.js
global.document = {
  getElementById: () => null,
  createElement: (tag) => ({
    textContent: '',
    innerHTML: '',
    className: '',
    setAttribute: () => {},
    querySelector: () => null,
    appendChild: () => {},
    remove: () => {},
  }),
  body: { appendChild: () => {} },
};

// Eval only the top portion of state.js (SKILL_TIERS, skillTier, SKILL_NAMES, S)
// We stop before toast/repositionToasts which reference DOM heavily
eval(stateCode
  .replace(/^const \$=/m, 'var $_id=')  // rename $ to avoid conflict
  .replace(/^let S=/m, 'var S=')
);

// ═══ Setup: load launcher.js to get templateOrder, PT, AI_REC ═══
const launcherCode = fs.readFileSync(path.join(__dirname, '../src/ui/launcher.js'), 'utf8');

// Mock globals needed by launcher.js
global.S = global.S || {genLang: 'ja', lang: 'ja', answers: {}, projectName: 'TestProject', skill: 'intermediate', skillLv: 3};
global.esc = (s) => String(s);
global.escAttr = (s) => String(s);
global.t = (key) => key;
global.toast = () => {};
global.save = () => {};

// We need to capture templateOrder, PT, AI_REC from inside showAILauncher
// launcher.js defines these inside the showAILauncher function — extract them by running that section
// Instead, we parse the templateOrder and AI_REC from the source text
const templateOrderMatch = launcherCode.match(/const templateOrder=(\[.*?\]);/);
const aiRecMatch = launcherCode.match(/const AI_REC=(\{.*?\});/);

let templateOrder = null;
let AI_REC = null;

if (templateOrderMatch) {
  templateOrder = JSON.parse(templateOrderMatch[1].replace(/'/g, '"'));
}
if (aiRecMatch) {
  // AI_REC uses single quotes, parse carefully
  try {
    eval('var _tmpAI_REC = ' + aiRecMatch[1]);
    AI_REC = _tmpAI_REC;
  } catch(e) {
    // fallback: parse manually
  }
}

// Also extract the PT object for ux_audit check — search in source
const ptUxAuditJa = launcherCode.includes("ux_audit:{icon:'🔬'");
const ptUxAuditEn = launcherCode.includes("'UX Proficiency Audit'");

// ═══ Setup: load p11-implguide.js to get gen81 ═══
const p11Code = fs.readFileSync(path.join(__dirname, '../src/generators/p11-implguide.js'), 'utf8');

// Mock globals needed by p11-implguide.js
global.detectDomain = (purpose) => {
  if (!purpose) return 'saas';
  if (/学習|教育|LMS/.test(purpose)) return 'education';
  if (/EC|ショッピング/.test(purpose)) return 'ec';
  if (/SaaS/.test(purpose)) return 'saas';
  return 'saas';
};
global.detectAppType = (a) => 'spa';
global.reqLabel = (s) => s;
global.hasDM = () => false;

// Provide a minimal DOMAIN_IMPL_PATTERN to satisfy p11 (gen81 doesn't use it but other fns do)
global.DOMAIN_IMPL_PATTERN = { _default: { impl_ja: ['テスト'], impl_en: ['test'] } };
global.APP_TYPE_MAP = { spa: { stack_ja: 'SPA', stack_en: 'SPA', impl_ja: [], impl_en: [] } };
global.SKILL_IMPL_GUIDE = { beginner: { ja: [], en: [] }, intermediate: { ja: [], en: [] }, pro: { ja: [], en: [] } };

// Extract gen81 from p11 using brace counting (more reliable than regex)
function extractFn(code, fnName) {
  const startIdx = code.indexOf('function ' + fnName + '()');
  if (startIdx === -1) return null;
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < code.length; i++) {
    if (code[i] === '{') depth++;
    if (code[i] === '}') { depth--; if (depth === 0) { endIdx = i; break; } }
  }
  return code.substring(startIdx, endIdx + 1);
}

const gen81Code = extractFn(p11Code, 'gen81');
if (gen81Code) {
  eval(gen81Code);
}

// ═══ TESTS ═══

describe('[SkillLevel] SKILL_TIERS mapping', () => {
  test('skillTier(0) === "beginner"', () => {
    assert.strictEqual(skillTier(0), 'beginner');
  });
  test('skillTier(1) === "beginner"', () => {
    assert.strictEqual(skillTier(1), 'beginner');
  });
  test('skillTier(2) === "intermediate"', () => {
    assert.strictEqual(skillTier(2), 'intermediate');
  });
  test('skillTier(3) === "intermediate"', () => {
    assert.strictEqual(skillTier(3), 'intermediate');
  });
  test('skillTier(4) === "pro"', () => {
    assert.strictEqual(skillTier(4), 'pro');
  });
  test('skillTier(5) === "pro"', () => {
    assert.strictEqual(skillTier(5), 'pro');
  });
  test('skillTier(6) === "pro"', () => {
    assert.strictEqual(skillTier(6), 'pro');
  });
});

describe('[SkillLevel] skillTier() out-of-range fallback', () => {
  test('skillTier(-1) === "intermediate" (fallback)', () => {
    assert.strictEqual(skillTier(-1), 'intermediate');
  });
  test('skillTier(99) === "intermediate" (fallback)', () => {
    assert.strictEqual(skillTier(99), 'intermediate');
  });
});

describe('[SkillLevel] SKILL_TIERS array', () => {
  test('SKILL_TIERS.length === 7', () => {
    assert.strictEqual(SKILL_TIERS.length, 7);
  });
});

describe('[SkillLevel] SKILL_NAMES array', () => {
  test('SKILL_NAMES.length === 7', () => {
    assert.strictEqual(SKILL_NAMES.length, 7);
  });
  test('each SKILL_NAMES entry has ja, en, and emoji', () => {
    SKILL_NAMES.forEach((entry, i) => {
      assert.ok(typeof entry.ja === 'string' && entry.ja.length > 0, `SKILL_NAMES[${i}].ja is non-empty string`);
      assert.ok(typeof entry.en === 'string' && entry.en.length > 0, `SKILL_NAMES[${i}].en is non-empty string`);
      assert.ok(typeof entry.emoji === 'string' && entry.emoji.length > 0, `SKILL_NAMES[${i}].emoji is non-empty string`);
    });
  });
});

describe('[SkillLevel] Migration from old skill string', () => {
  test('old skill="beginner" migrates to skillLv=1', () => {
    // Replicate the migration logic from state.js load():
    // if skillLv is not set (old save), use: S.skill==='beginner' ? 1 : S.skill==='pro' ? 5 : 3
    const mockOldState = { skill: 'beginner' }; // no skillLv field
    const migratedLv = (typeof mockOldState.skillLv === 'number' && mockOldState.skillLv >= 0 && mockOldState.skillLv <= 6)
      ? mockOldState.skillLv
      : (mockOldState.skill === 'beginner' ? 1 : mockOldState.skill === 'pro' ? 5 : 3);
    assert.strictEqual(migratedLv, 1, 'old beginner maps to skillLv=1');
  });
  test('old skill="pro" migrates to skillLv=5', () => {
    const mockOldState = { skill: 'pro' };
    const migratedLv = (typeof mockOldState.skillLv === 'number' && mockOldState.skillLv >= 0 && mockOldState.skillLv <= 6)
      ? mockOldState.skillLv
      : (mockOldState.skill === 'beginner' ? 1 : mockOldState.skill === 'pro' ? 5 : 3);
    assert.strictEqual(migratedLv, 5, 'old pro maps to skillLv=5');
  });
  test('old skill="intermediate" migrates to skillLv=3', () => {
    const mockOldState = { skill: 'intermediate' };
    const migratedLv = (typeof mockOldState.skillLv === 'number' && mockOldState.skillLv >= 0 && mockOldState.skillLv <= 6)
      ? mockOldState.skillLv
      : (mockOldState.skill === 'beginner' ? 1 : mockOldState.skill === 'pro' ? 5 : 3);
    assert.strictEqual(migratedLv, 3, 'old intermediate maps to skillLv=3');
  });
});

describe('[SkillLevel] templateOrder count', () => {
  test('launcher templateOrder has 37 entries', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable from launcher.js');
    assert.strictEqual(templateOrder.length, 37, `templateOrder.length should be 37, got ${templateOrder ? templateOrder.length : 'null'}`);
  });
});

describe('[SkillLevel] ux_audit template exists', () => {
  test('PT["ux_audit"] exists with ja label', () => {
    assert.ok(ptUxAuditJa, 'launcher.js should contain ux_audit with ja label');
  });
  test('PT["ux_audit"] exists with en label', () => {
    assert.ok(ptUxAuditEn, 'launcher.js should contain "UX Proficiency Audit" (en label)');
  });
});

describe('[SkillLevel] AI_REC ux_audit', () => {
  test('AI_REC["ux_audit"] === "Claude"', () => {
    assert.ok(AI_REC !== null, 'AI_REC should be parseable from launcher.js');
    assert.strictEqual(AI_REC['ux_audit'], 'Claude', `AI_REC.ux_audit should be 'Claude', got '${AI_REC ? AI_REC['ux_audit'] : 'null'}'`);
  });
});

describe('[SkillLevel] gen81() output', () => {
  test('gen81() generates docs/81_ux_proficiency_audit.md', () => {
    assert.ok(typeof gen81 === 'function', 'gen81 should be a function');
    // Mutate the existing S rather than replacing it (gen81 uses S as a free variable)
    S.genLang = 'ja';
    S.answers = {target: 'ユーザー', screens: 'ダッシュボード', auth: 'NextAuth', mvp_features: 'ログイン, ダッシュボード'};
    S.projectName = 'TestProject';
    S.files = {};
    gen81();
    assert.ok(S.files['docs/81_ux_proficiency_audit.md'], 'docs/81_ux_proficiency_audit.md should be generated');
  });
  test('gen81() output has all 7 level headers (Lv.0 through Lv.6)', () => {
    S.genLang = 'ja';
    S.answers = {target: 'ユーザー', screens: 'ダッシュボード', auth: 'NextAuth', mvp_features: 'ログイン'};
    S.projectName = 'TestProject';
    S.files = {};
    gen81();
    const doc = S.files['docs/81_ux_proficiency_audit.md'];
    assert.ok(doc, 'doc should exist');
    assert.ok(doc.includes('Lv.0'), 'doc should contain Lv.0 header');
    assert.ok(doc.includes('Lv.1'), 'doc should contain Lv.1 header');
    assert.ok(doc.includes('Lv.2'), 'doc should contain Lv.2 header');
    assert.ok(doc.includes('Lv.3'), 'doc should contain Lv.3 header');
    assert.ok(doc.includes('Lv.4'), 'doc should contain Lv.4 header');
    assert.ok(doc.includes('Lv.5'), 'doc should contain Lv.5 header');
    assert.ok(doc.includes('Lv.6'), 'doc should contain Lv.6 header');
  });
});
