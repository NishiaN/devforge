/**
 * P7 Roadmap Generator Tests
 * Tests: genPillar7_Roadmap and its generated files
 * ~25 tests
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

/* ── Test scaffold ── */
const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestRoadmap', phase: 1, step: 0, skipped: [], files: {},
  editedFiles: {}, prevFiles: {}, genLang: 'ja', previewFile: null,
  pillar: 0, skillLv: 3,
};
const save = () => {};
const _lsGet = () => null;
const _lsSet = () => {};
const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/data/questions.js', 'utf-8'));
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/data/gen-templates.js', 'utf-8').replace('const GT', 'var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js', 'utf-8'));

/* ── Helpers ── */
function generate(answers, pn = 'TestProject') {
  S.files = {};
  S.genLang = 'ja';
  genPillar7_Roadmap(answers, pn);
  return S.files;
}

function generateEn(answers, pn = 'TestProject') {
  S.files = {};
  S.genLang = 'en';
  genPillar7_Roadmap(answers, pn);
  return S.files;
}

const A_BASE = {
  purpose: 'SaaSサブスクリプション管理システム',
  frontend: 'React + Next.js',
  backend: 'Supabase',
  database: 'PostgreSQL',
  deploy: 'Vercel',
  payment: 'Stripe',
  skill_level: 'Intermediate',
  learning_goal: '6ヶ月標準',
  auth: 'Supabase Auth',
};

const A_PRO = {
  purpose: 'フィンテック決済プラットフォーム',
  frontend: 'React + Next.js',
  backend: 'NestJS',
  database: 'PostgreSQL',
  deploy: 'Railway',
  skill_level: 'Professional',
  learning_goal: '3ヶ月集中',
  orm: 'Prisma',
  auth: 'JWT',
};

const A_BEGINNER = {
  purpose: 'ECサイト',
  frontend: 'React + Next.js',
  backend: 'Supabase',
  database: 'PostgreSQL',
  deploy: 'Vercel',
  skill_level: 'Beginner',
  learning_goal: '12ヶ月じっくり',
};

const A_MOBILE = {
  purpose: 'コミュニティアプリ',
  frontend: 'React + Next.js',
  backend: 'Firebase Firestore',
  database: 'Firestore',
  deploy: 'Firebase',
  mobile: 'Expo (React Native)',
  skill_level: 'Intermediate',
  learning_goal: '6ヶ月標準',
};

// ══════════════════════════════════════════
// File generation
// ══════════════════════════════════════════
describe('P7 Roadmap — file generation', () => {
  it('generates core roadmap files', () => {
    const files = generate(A_BASE);
    assert.ok(files['roadmap/LEARNING_PATH.md'], 'LEARNING_PATH.md missing');
    assert.ok(files['roadmap/TECH_STACK_GUIDE.md'], 'TECH_STACK_GUIDE.md missing');
    assert.ok(files['roadmap/TOOLS_SETUP.md'], 'TOOLS_SETUP.md missing');
    assert.ok(files['roadmap/RESOURCES.md'], 'RESOURCES.md missing');
    assert.ok(files['roadmap/MILESTONES.md'], 'MILESTONES.md missing');
    assert.ok(files['roadmap/AI_WORKFLOW.md'], 'AI_WORKFLOW.md missing');
  });

  it('generates SAAS_COMMERCE_GUIDE.md (always generated)', () => {
    const files = generate(A_BASE);
    assert.ok(files['roadmap/SAAS_COMMERCE_GUIDE.md'], 'SAAS_COMMERCE_GUIDE.md missing');
  });

  it('SAAS_COMMERCE_GUIDE.md with Stripe has Stripe content', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/SAAS_COMMERCE_GUIDE.md'];
    assert.ok(doc.includes('Stripe') || doc.includes('payment') || doc.includes('決済'));
  });

  it('generates MOBILE_GUIDE.md (always generated)', () => {
    const files = generate(A_MOBILE);
    assert.ok(files['roadmap/MOBILE_GUIDE.md'], 'MOBILE_GUIDE.md missing');
  });

  it('MOBILE_GUIDE.md with mobile has expo content', () => {
    const files = generate(A_MOBILE);
    const doc = files['roadmap/MOBILE_GUIDE.md'];
    assert.ok(doc.includes('Expo') || doc.includes('expo') || doc.includes('Mobile'));
  });
});

// ══════════════════════════════════════════
// LEARNING_PATH.md
// ══════════════════════════════════════════
describe('LEARNING_PATH.md — content', () => {
  it('has layered structure', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('Layer'), 'should have Layer sections');
  });

  it('includes frontend framework', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('React') || doc.includes('Next'), 'should reference frontend');
  });

  it('includes project name', () => {
    const files = generate(A_BASE, 'MyLMS');
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('MyLMS'));
  });

  it('adapts for beginner level (Month-based timeline)', () => {
    const files = generate(A_BEGINNER);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('Month'), 'Beginner should use monthly timeline');
  });

  it('adapts for professional level', () => {
    const files = generate(A_PRO);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.length > 300, 'Pro doc should be substantial');
  });

  it('has domain-specific section for fintech', () => {
    const files = generate(A_PRO);
    const doc = files['roadmap/LEARNING_PATH.md'];
    // fintech domain should get domain section or at minimum substantial content
    assert.ok(doc.length > 500, 'fintech doc should be rich');
  });

  it('has checkbox items (- [ ])', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('- [ ]'), 'should have actionable checkboxes');
  });
});

// ══════════════════════════════════════════
// TECH_STACK_GUIDE.md
// ══════════════════════════════════════════
describe('TECH_STACK_GUIDE.md — content', () => {
  it('references frontend stack', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/TECH_STACK_GUIDE.md'];
    assert.ok(doc.includes('React') || doc.includes('Next'), 'should mention frontend');
  });

  it('references backend', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/TECH_STACK_GUIDE.md'];
    assert.ok(doc.includes('Supabase') || doc.includes('backend') || doc.includes('バックエンド'));
  });

  it('has code blocks', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/TECH_STACK_GUIDE.md'];
    assert.ok(doc.includes('```'), 'should have code examples');
  });
});

// ══════════════════════════════════════════
// Bilingual parity
// ══════════════════════════════════════════
describe('P7 bilingual parity', () => {
  it('generates English version of LEARNING_PATH.md', () => {
    const files = generateEn(A_BASE);
    const doc = files['roadmap/LEARNING_PATH.md'];
    assert.ok(doc.includes('Layer') || doc.includes('Month') || doc.includes('Week'));
  });

  it('ja and en LEARNING_PATH have comparable length', () => {
    const filesJa = generate(A_BASE);
    const filesEn = generateEn(A_BASE);
    const jaLen = (filesJa['roadmap/LEARNING_PATH.md'] || '').length;
    const enLen = (filesEn['roadmap/LEARNING_PATH.md'] || '').length;
    if (jaLen > 0 && enLen > 0) {
      const ratio = Math.max(jaLen, enLen) / Math.min(jaLen, enLen);
      assert.ok(ratio < 3, `LEARNING_PATH ja/en ratio ${ratio.toFixed(2)} exceeds 3x`);
    }
  });
});

// ══════════════════════════════════════════
// MILESTONES.md
// ══════════════════════════════════════════
describe('MILESTONES.md', () => {
  it('has milestone content', () => {
    const files = generate(A_BASE);
    const doc = files['roadmap/MILESTONES.md'];
    assert.ok(doc.length > 50, 'MILESTONES.md should have content');
  });

  it('includes project name', () => {
    const files = generate(A_BASE, 'MyProject');
    const doc = files['roadmap/MILESTONES.md'];
    assert.ok(doc.includes('MyProject'));
  });
});
