const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', lang: 'ja', files: {}, answers: {}, skill: 'intermediate', skillLv: 3 };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p28-xai.js', 'utf-8'));

const BASE_ANSWERS = {
  purpose: 'AIを活用したSaaSアプリを開発する',
  frontend: 'React + Next.js',
  backend: 'Node.js + Express',
  database: 'PostgreSQL',
  ai_auto: 'Claude APIを使った自動化',
  deploy: 'Railway',
  scale: 'medium',
};

const NO_AI_ANSWERS = {
  purpose: 'タスク管理SaaSアプリを開発する',
  frontend: 'React + Next.js',
  backend: 'Node.js + Express',
  database: 'PostgreSQL',
  ai_auto: 'なし',
  deploy: 'Railway',
  scale: 'medium',
};

const HIGH_RISK_AI_ANSWERS = {
  ...BASE_ANSWERS,
  purpose: '医療診断AIシステムを開発する',
};

describe('Pillar ㉘ XAI Intelligence', () => {

  test('docs/128 が常時生成される', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/128_xai_intelligence_architecture.md'], 'docs/128 should always be generated');
    assert.ok(S.files['docs/128_xai_intelligence_architecture.md'].length > 200, 'docs/128 should be non-empty');
  });

  test('docs/129 が常時生成される', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/129_fairness_bias_pipeline.md'], 'docs/129 should always be generated');
    assert.ok(S.files['docs/129_fairness_bias_pipeline.md'].length > 200, 'docs/129 should be non-empty');
  });

  test('docs/130 が常時生成される', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/130_ai_governance_framework.md'], 'docs/130 should always be generated');
    assert.ok(S.files['docs/130_ai_governance_framework.md'].length > 200, 'docs/130 should be non-empty');
  });

  test('docs/131 が常時生成される', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/131_model_lifecycle_intelligence.md'], 'docs/131 should always be generated');
    assert.ok(S.files['docs/131_model_lifecycle_intelligence.md'].length > 200, 'docs/131 should be non-empty');
  });

  test('docs/131-2 はAI有効+高リスクドメインで生成される', () => {
    S.files = {};
    genPillar28_XAIIntelligence(HIGH_RISK_AI_ANSWERS, 'MedAIProject');
    assert.ok(
      S.files['docs/131-2_ai_red_team_adversarial.md'],
      'docs/131-2 should be generated for AI + high-risk domain (health)'
    );
  });

  test('docs/131-2 はAIなしの場合は生成されない', () => {
    S.files = {};
    genPillar28_XAIIntelligence(NO_AI_ANSWERS, 'PlainProject');
    assert.ok(
      !S.files['docs/131-2_ai_red_team_adversarial.md'],
      'docs/131-2 should NOT be generated when AI is disabled'
    );
  });

  test('FAIRNESS_METRICS は5エントリを持つ', () => {
    assert.ok(typeof FAIRNESS_METRICS !== 'undefined', 'FAIRNESS_METRICS should be defined');
    assert.strictEqual(FAIRNESS_METRICS.length, 5, 'FAIRNESS_METRICS should have 5 entries');
  });

  test('DRIFT_DETECTORS は5エントリを持つ', () => {
    assert.ok(typeof DRIFT_DETECTORS !== 'undefined', 'DRIFT_DETECTORS should be defined');
    assert.strictEqual(DRIFT_DETECTORS.length, 5, 'DRIFT_DETECTORS should have 5 entries');
  });

  test('AI_RISK_TIERS は4エントリを持つ', () => {
    assert.ok(typeof AI_RISK_TIERS !== 'undefined', 'AI_RISK_TIERS should be defined');
    assert.strictEqual(AI_RISK_TIERS.length, 4, 'AI_RISK_TIERS should have 4 entries');
  });

  test('docs/128 に XAI または 説明可能 が含まれる', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    const doc = S.files['docs/128_xai_intelligence_architecture.md'];
    assert.ok(
      doc.includes('XAI') || doc.includes('説明可能') || doc.includes('Explainability'),
      'docs/128 should contain XAI/explainability content'
    );
  });

  test('docs/129 に fairness または 公平性 が含まれる', () => {
    S.files = {};
    genPillar28_XAIIntelligence(BASE_ANSWERS, 'TestProject');
    const doc = S.files['docs/129_fairness_bias_pipeline.md'];
    assert.ok(
      doc.includes('Fairness') || doc.includes('fairness') || doc.includes('公平性') || doc.includes('Bias') || doc.includes('バイアス'),
      'docs/129 should contain fairness/bias content'
    );
  });

  test('English mode: 4 docs が生成される', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar28_XAIIntelligence({ ...BASE_ANSWERS, purpose: 'Build an AI-powered SaaS app' }, 'TestProject');
    assert.ok(S.files['docs/128_xai_intelligence_architecture.md'], 'docs/128 should be generated in English mode');
    assert.ok(S.files['docs/129_fairness_bias_pipeline.md'], 'docs/129 should be generated in English mode');
    assert.ok(S.files['docs/130_ai_governance_framework.md'], 'docs/130 should be generated in English mode');
    assert.ok(S.files['docs/131_model_lifecycle_intelligence.md'], 'docs/131 should be generated in English mode');
    S.genLang = 'ja';
  });

  test('Fintech AI domain: docs/131-2 が生成される', () => {
    S.files = {};
    const fintechAI = { ...BASE_ANSWERS, purpose: 'フィンテックAI審査システムを開発する' };
    genPillar28_XAIIntelligence(fintechAI, 'FintechAIProject');
    assert.ok(
      S.files['docs/131-2_ai_red_team_adversarial.md'],
      'docs/131-2 should be generated for AI + fintech (high-risk) domain'
    );
  });

});
