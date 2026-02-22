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

// Extract DOC_GROUPS and TEMPLATE_SCOPE from launcher source
let DOC_GROUPS_parsed = null;
let TEMPLATE_SCOPE_parsed = null;
try {
  eval(launcherCode.match(/const DOC_GROUPS=(\{[\s\S]*?\});/)[0].replace('const ','var '));
  DOC_GROUPS_parsed = DOC_GROUPS;
} catch(e) {}
try {
  eval(launcherCode.match(/const TEMPLATE_SCOPE=(\{[\s\S]*?\});/)[0].replace('const ','var '));
  TEMPLATE_SCOPE_parsed = TEMPLATE_SCOPE;
} catch(e) {}

// Also extract the PT object for ux_audit check — search in source
const ptUxAuditJa = launcherCode.includes("ux_audit:{icon:'🔬'");
const ptUxAuditEn = launcherCode.includes("'UX Proficiency Audit'");

// P21-P25 new template presence checks
const ptDbIntelJa = launcherCode.includes("db_intelligence:{icon:'🗄️'");
const ptDbIntelEn = launcherCode.includes("'DB Design Intelligence'");
const ptAiSafetyJa = launcherCode.includes("ai_safety:{icon:'🤖🛡️'");
const ptAiSafetyEn = launcherCode.includes("'AI Safety Review'");
const ptTestIntelJa = launcherCode.includes("test_intel:{icon:'🔬🧪'");
const ptTestIntelEn = launcherCode.includes("'Testing Strategy Intelligence'");

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
  test('launcher templateOrder has 40 entries', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable from launcher.js');
    assert.strictEqual(templateOrder.length, 40, `templateOrder.length should be 40, got ${templateOrder ? templateOrder.length : 'null'}`);
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

describe('[SkillLevel] db_intelligence template exists', () => {
  test('PT["db_intelligence"] exists with ja label', () => {
    assert.ok(ptDbIntelJa, 'launcher.js should contain db_intelligence with ja icon+key');
  });
  test('PT["db_intelligence"] exists with en label', () => {
    assert.ok(ptDbIntelEn, 'launcher.js should contain "DB Design Intelligence" (en label)');
  });
});

describe('[SkillLevel] ai_safety template exists', () => {
  test('PT["ai_safety"] exists with ja label', () => {
    assert.ok(ptAiSafetyJa, 'launcher.js should contain ai_safety with ja icon+key');
  });
  test('PT["ai_safety"] exists with en label', () => {
    assert.ok(ptAiSafetyEn, 'launcher.js should contain "AI Safety Review" (en label)');
  });
});

describe('[SkillLevel] test_intel template exists', () => {
  test('PT["test_intel"] exists with ja label', () => {
    assert.ok(ptTestIntelJa, 'launcher.js should contain test_intel with ja icon+key');
  });
  test('PT["test_intel"] exists with en label', () => {
    assert.ok(ptTestIntelEn, 'launcher.js should contain "Testing Strategy Intelligence" (en label)');
  });
});

describe('[SkillLevel] AI_REC new templates', () => {
  test('AI_REC["db_intelligence"] === "Gemini"', () => {
    assert.ok(AI_REC !== null, 'AI_REC should be parseable from launcher.js');
    assert.strictEqual(AI_REC['db_intelligence'], 'Gemini', `AI_REC.db_intelligence should be 'Gemini', got '${AI_REC ? AI_REC['db_intelligence'] : 'null'}'`);
  });
  test('AI_REC["ai_safety"] === "Claude"', () => {
    assert.ok(AI_REC !== null, 'AI_REC should be parseable from launcher.js');
    assert.strictEqual(AI_REC['ai_safety'], 'Claude', `AI_REC.ai_safety should be 'Claude', got '${AI_REC ? AI_REC['ai_safety'] : 'null'}'`);
  });
  test('AI_REC["test_intel"] === "Copilot"', () => {
    assert.ok(AI_REC !== null, 'AI_REC should be parseable from launcher.js');
    assert.strictEqual(AI_REC['test_intel'], 'Copilot', `AI_REC.test_intel should be 'Copilot', got '${AI_REC ? AI_REC['test_intel'] : 'null'}'`);
  });
});

describe('[SkillLevel] DOC_GROUPS and TEMPLATE_SCOPE coverage', () => {
  test('DOC_GROUPS is parseable from launcher.js', () => {
    assert.ok(DOC_GROUPS_parsed !== null, 'DOC_GROUPS should be parseable from launcher.js');
    assert.ok(typeof DOC_GROUPS_parsed === 'object', 'DOC_GROUPS should be an object');
    assert.ok(Object.keys(DOC_GROUPS_parsed).length >= 10, 'DOC_GROUPS should have at least 10 groups');
  });
  test('TEMPLATE_SCOPE is parseable from launcher.js', () => {
    assert.ok(TEMPLATE_SCOPE_parsed !== null, 'TEMPLATE_SCOPE should be parseable from launcher.js');
    assert.ok(typeof TEMPLATE_SCOPE_parsed === 'object', 'TEMPLATE_SCOPE should be an object');
  });
  test('all 40 templateOrder keys exist in TEMPLATE_SCOPE', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable');
    assert.ok(TEMPLATE_SCOPE_parsed !== null, 'TEMPLATE_SCOPE should be parseable');
    const missing = templateOrder.filter(k => !TEMPLATE_SCOPE_parsed[k]);
    assert.strictEqual(missing.length, 0, `templateOrder keys missing from TEMPLATE_SCOPE: ${missing.join(', ')}`);
  });
  test('all TEMPLATE_SCOPE docs entries reference valid DOC_GROUPS keys', () => {
    assert.ok(DOC_GROUPS_parsed !== null, 'DOC_GROUPS should be parseable');
    assert.ok(TEMPLATE_SCOPE_parsed !== null, 'TEMPLATE_SCOPE should be parseable');
    const validGroups = new Set(Object.keys(DOC_GROUPS_parsed));
    const invalid = [];
    Object.entries(TEMPLATE_SCOPE_parsed).forEach(([tpl, scope]) => {
      (scope.docs || []).forEach(gid => {
        if (!validGroups.has(gid)) invalid.push(`${tpl}.docs.${gid}`);
      });
    });
    assert.strictEqual(invalid.length, 0, `Invalid DOC_GROUPS refs in TEMPLATE_SCOPE: ${invalid.join(', ')}`);
  });
  test('DOC_GROUPS doc numbers have no duplicates across groups', () => {
    assert.ok(DOC_GROUPS_parsed !== null, 'DOC_GROUPS should be parseable');
    const seen = {};
    const dupes = [];
    Object.entries(DOC_GROUPS_parsed).forEach(([gid, g]) => {
      (g.nums || []).forEach(n => {
        if (seen[n]) dupes.push(`${n} in both ${seen[n]} and ${gid}`);
        else seen[n] = gid;
      });
    });
    assert.strictEqual(dupes.length, 0, `Duplicate doc numbers in DOC_GROUPS: ${dupes.join(', ')}`);
  });
  test('all TEMPLATE_SCOPE entries include core group', () => {
    assert.ok(TEMPLATE_SCOPE_parsed !== null, 'TEMPLATE_SCOPE should be parseable');
    const missingCore = Object.entries(TEMPLATE_SCOPE_parsed)
      .filter(([,scope]) => !(scope.docs || []).includes('core'))
      .map(([k]) => k);
    assert.strictEqual(missingCore.length, 0, `Templates missing core in docs scope: ${missingCore.join(', ')}`);
  });
});

describe('[SkillLevel] new templates in templateOrder', () => {
  test('templateOrder contains db_intelligence', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable');
    assert.ok(templateOrder.includes('db_intelligence'), 'templateOrder should include db_intelligence');
  });
  test('templateOrder contains ai_safety', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable');
    assert.ok(templateOrder.includes('ai_safety'), 'templateOrder should include ai_safety');
  });
  test('templateOrder contains test_intel', () => {
    assert.ok(templateOrder !== null, 'templateOrder should be parseable');
    assert.ok(templateOrder.includes('test_intel'), 'templateOrder should include test_intel');
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
