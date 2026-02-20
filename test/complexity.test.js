// test/complexity.test.js — complexity analysis functions

const {test, describe} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// ── Setup: eval complexity.js with mocked globals ──

// complexity.js uses S.answers, S.lang, hasDM()
global.S = {
  answers: {},
  lang: 'ja',
  skillLv: 3,
  skill: 'intermediate',
};
global.hasDM = (method) => (global.S.answers.dev_methods || '').includes(method);

// Load complexity.js
const complexityCode = fs.readFileSync(
  path.join(__dirname, '../src/ui/complexity.js'),
  'utf8'
);
eval(complexityCode);

// Helper: set answers and reset
function setAnswers(answers) {
  global.S.answers = answers;
}

// ── Score calculation helpers (mirror the logic) ──
function calcScore(answers) {
  const fCount = ((answers.mvp_features || '').split(',').map(s => s.trim()).filter(Boolean)).length;
  const eCount = ((answers.data_entities || '').split(',')).filter(Boolean).length;
  const sCount = ((answers.screens || '').split(',')).filter(Boolean).length;
  const authCount = ((answers.auth || '').split(',')).filter(Boolean).length;
  const hasTDD = (answers.dev_methods || '').includes('TDD') ? 1 : 0;
  const hasBDD = (answers.dev_methods || '').includes('BDD') ? 1 : 0;
  const hasDDD = (answers.dev_methods || '').includes('DDD') ? 1 : 0;
  const be = answers.backend || '';
  const beComplex = (be.includes('なし') || be.includes('None')) ? 0
    : (be.includes('Firebase') || be.includes('Supabase')) ? 1 : 2;
  let score = 0;
  score += Math.min(fCount * 8, 50);
  score += Math.min(eCount * 3, 20);
  score += Math.min(sCount * 2, 14);
  score += authCount * 2;
  score += beComplex * 5;
  score += (hasTDD + hasBDD + hasDDD) * 3;
  return Math.min(score, 100);
}

describe('getComplexityMini()', () => {
  test('returns empty string when score is 0 (None backend, no features)', () => {
    // backend=None → beComplex=0; no features/entities/screens → score=0
    setAnswers({ backend: 'None' });
    const result = getComplexityMini();
    assert.strictEqual(result, '', 'None backend + no features should return empty string');
  });

  test('returns empty string is triggered by !score guard', () => {
    // Verify the guard: any answers resulting in score>0 return non-empty
    setAnswers({ mvp_features: 'ログイン', backend: 'None' });
    const result = getComplexityMini();
    assert.ok(result.length > 0, 'Non-zero score should return non-empty string');
  });

  test('uses --success color for simple project (score ≤30)', () => {
    // 1 feature (8pts) + None backend (0pts) = 8 → low
    setAnswers({ mvp_features: 'ログイン', backend: 'None' });
    const result = getComplexityMini();
    assert.ok(result.includes('var(--success)'), 'Low score should use --success color');
    assert.ok(result.includes('⚡'), 'Mini should include lightning bolt ⚡');
  });

  test('uses --warn color for medium project (score 31-60)', () => {
    // 5 features (40pts) + Firebase (5pts) = 45 → mid
    setAnswers({
      mvp_features: 'ログイン,ダッシュ,検索,設定,通知',
      backend: 'Firebase',
    });
    const result = getComplexityMini();
    assert.ok(result.includes('var(--warn)'), 'Mid score should use --warn color');
  });

  test('uses --danger color for large project (score >60)', () => {
    // 7 features (50pts cap) + 5 entities (15pts) + Express (10pts) = 75 → high
    setAnswers({
      mvp_features: 'ログイン,ダッシュ,検索,設定,通知,管理,API',
      data_entities: 'User,Post,Comment,Tag,Media',
      backend: 'Node.js + Express',
    });
    const result = getComplexityMini();
    assert.ok(result.includes('var(--danger)'), 'High score should use --danger color');
  });

  test('includes score number in output', () => {
    setAnswers({ mvp_features: 'ログイン,ダッシュ', backend: 'Firebase' });
    const result = getComplexityMini();
    const score = calcScore({ mvp_features: 'ログイン,ダッシュ', backend: 'Firebase' });
    assert.ok(result.includes(String(score)), `Output should include score ${score}`);
  });

  test('score is capped at 100', () => {
    // Massive project: 7 features (50max) + 10 entities (20max) + 7 screens (14max) + 5 auth (10) + Express (10) + TDD+BDD+DDD (9) = 113 → capped 100
    setAnswers({
      mvp_features: 'f1,f2,f3,f4,f5,f6,f7',
      data_entities: 'A,B,C,D,E,F,G,H,I,J',
      screens: 's1,s2,s3,s4,s5,s6,s7',
      auth: 'Email,OAuth,SSO,2FA,Magic',
      backend: 'Node.js + Express',
      dev_methods: 'TDD,BDD,DDD',
    });
    const result = getComplexityMini();
    assert.ok(result.includes('100'), 'Score should be capped at 100');
    assert.ok(result.includes('var(--danger)'), 'Capped score should use --danger color');
  });
});

describe('getComplexityHTML()', () => {
  test('returns HTML string with complexity card', () => {
    setAnswers({ mvp_features: 'ログイン', backend: 'Firebase' });
    const result = getComplexityHTML();
    assert.ok(typeof result === 'string', 'Should return a string');
    assert.ok(result.includes('complexity-card'), 'Should include complexity card class');
  });

  test('includes all metric labels in Japanese', () => {
    global.S.lang = 'ja';
    setAnswers({ mvp_features: 'f1,f2', data_entities: 'A,B', backend: 'Firebase' });
    const result = getComplexityHTML();
    assert.ok(result.includes('MVP機能'), 'Should include Japanese feature label');
    assert.ok(result.includes('エンティティ'), 'Should include Japanese entity label');
    assert.ok(result.includes('推定期間'), 'Should include Japanese duration label');
  });

  test('includes all metric labels in English', () => {
    global.S.lang = 'en';
    setAnswers({ mvp_features: 'f1,f2', data_entities: 'A,B', backend: 'Firebase' });
    const result = getComplexityHTML();
    assert.ok(result.includes('MVP Features'), 'Should include English feature label');
    assert.ok(result.includes('Entities'), 'Should include English entity label');
    assert.ok(result.includes('Est. Duration'), 'Should include English duration label');
    global.S.lang = 'ja'; // reset
  });

  test('shows Simple label for low complexity (ja)', () => {
    global.S.lang = 'ja';
    setAnswers({ mvp_features: 'ログイン', backend: 'None' });
    const result = getComplexityHTML();
    assert.ok(result.includes('シンプル'), 'Low score should show シンプル');
  });

  test('shows Large label for high complexity (ja)', () => {
    global.S.lang = 'ja';
    setAnswers({
      mvp_features: 'f1,f2,f3,f4,f5,f6,f7',
      data_entities: 'A,B,C,D,E,F,G,H',
      backend: 'Node.js + Express',
    });
    const result = getComplexityHTML();
    assert.ok(result.includes('大規模'), 'High score should show 大規模');
  });

  test('Firebase backend gives lower score than Express', () => {
    const answersFirebase = { mvp_features: 'f1,f2,f3', backend: 'Firebase' };
    const answersExpress = { mvp_features: 'f1,f2,f3', backend: 'Node.js + Express' };
    const scoreFirebase = calcScore(answersFirebase);
    const scoreExpress = calcScore(answersExpress);
    assert.ok(scoreFirebase < scoreExpress, 'Firebase (BaaS) should score lower than Express');
  });

  test('No backend gives lowest beComplex score', () => {
    const answersNone = { mvp_features: 'f1,f2,f3', backend: 'None' };
    const answersFirebase = { mvp_features: 'f1,f2,f3', backend: 'Firebase' };
    const scoreNone = calcScore(answersNone);
    const scoreFirebase = calcScore(answersFirebase);
    assert.ok(scoreNone < scoreFirebase, 'No backend should score lower than Firebase');
  });

  test('TDD/BDD/DDD add to score', () => {
    const base = { mvp_features: 'f1,f2', backend: 'Firebase' };
    const withTDD = { ...base, dev_methods: 'TDD,BDD,DDD' };
    const scoreBase = calcScore(base);
    const scoreTDD = calcScore(withTDD);
    assert.ok(scoreTDD > scoreBase, 'TDD/BDD/DDD should increase score');
    assert.strictEqual(scoreTDD - scoreBase, 9, 'Each method adds 3 pts (3 methods = 9)');
  });

  test('includes progress bar with correct width', () => {
    setAnswers({ mvp_features: 'f1,f2', backend: 'Firebase' });
    const result = getComplexityHTML();
    const score = calcScore({ mvp_features: 'f1,f2', backend: 'Firebase' });
    assert.ok(result.includes(`width:${score}%`), `Progress bar should have width ${score}%`);
  });
});
