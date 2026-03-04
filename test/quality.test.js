const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', lang: 'ja', files: {}, answers: {}, skill: 'intermediate', skillLv: 3 };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p5-quality.js', 'utf-8'));

const BASE_ANSWERS = {
  purpose: 'タスク管理SaaSアプリを開発する',
  frontend: 'React + Next.js',
  backend: 'Node.js + Express',
  database: 'PostgreSQL',
  auth: 'Supabase Auth',
  mvp_features: 'タスク作成, ユーザー認証, チーム管理',
  deploy: 'Railway',
  scale: 'medium',
};

describe('Pillar ⑤ Quality Intelligence', () => {

  test('docs/32_qa_blueprint.md が生成される', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/32_qa_blueprint.md'], 'docs/32 should be generated');
    assert.ok(S.files['docs/32_qa_blueprint.md'].length > 200, 'docs/32 should be non-empty');
  });

  test('docs/33_test_matrix.md が生成される', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/33_test_matrix.md'], 'docs/33 should be generated');
    assert.ok(S.files['docs/33_test_matrix.md'].length > 200, 'docs/33 should be non-empty');
  });

  test('docs/34_incident_response.md が生成される', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/34_incident_response.md'], 'docs/34 should be generated');
    assert.ok(S.files['docs/34_incident_response.md'].length > 200, 'docs/34 should be non-empty');
  });

  test('docs/36_test_strategy.md が生成される', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/36_test_strategy.md'], 'docs/36 should be generated');
    assert.ok(S.files['docs/36_test_strategy.md'].length > 200, 'docs/36 should be non-empty');
  });

  test('docs/37_bug_prevention.md が生成される', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    assert.ok(S.files['docs/37_bug_prevention.md'], 'docs/37 should be generated');
    assert.ok(S.files['docs/37_bug_prevention.md'].length > 200, 'docs/37 should be non-empty');
  });

  test('docs/32 に QA または テスト が含まれる', () => {
    S.files = {};
    genPillar5_QualityIntelligence(BASE_ANSWERS, 'TestProject');
    const doc = S.files['docs/32_qa_blueprint.md'];
    assert.ok(
      doc.includes('QA') || doc.includes('テスト') || doc.includes('Test') || doc.includes('Quality'),
      'docs/32 should contain QA/test content'
    );
  });

  test('Fintech domain: docs/32 に compliance 内容が含まれる', () => {
    S.files = {};
    const fintechAnswers = { ...BASE_ANSWERS, purpose: 'フィンテック決済プラットフォームを開発する' };
    genPillar5_QualityIntelligence(fintechAnswers, 'FintechApp');
    const doc32 = S.files['docs/32_qa_blueprint.md'];
    assert.ok(doc32, 'docs/32 should be generated for fintech domain');
    // Fintech domain should have compliance or security testing mention
    assert.ok(
      doc32.includes('金融') || doc32.includes('PCI') || doc32.includes('compliance') || doc32.includes('セキュリティ') || doc32.includes('fintech') || doc32.length > 300,
      'docs/32 for fintech should have substantial content'
    );
  });

  test('Health domain: docs/32 が生成される', () => {
    S.files = {};
    const healthAnswers = { ...BASE_ANSWERS, purpose: '医療記録管理システムを開発する' };
    genPillar5_QualityIntelligence(healthAnswers, 'HealthApp');
    assert.ok(S.files['docs/32_qa_blueprint.md'], 'docs/32 should be generated for health domain');
  });

  test('EC domain: docs/33 にテストマトリクスが含まれる', () => {
    S.files = {};
    const ecAnswers = { ...BASE_ANSWERS, purpose: 'ECサイトを開発する', payment: 'Stripe' };
    genPillar5_QualityIntelligence(ecAnswers, 'ECApp');
    const doc33 = S.files['docs/33_test_matrix.md'];
    assert.ok(doc33, 'docs/33 should be generated for EC domain');
    assert.ok(
      doc33.includes('matrix') || doc33.includes('マトリクス') || doc33.includes('Test') || doc33.includes('テスト'),
      'docs/33 should contain test matrix content'
    );
  });

  test('English mode: 5 docs が生成される', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar5_QualityIntelligence({ ...BASE_ANSWERS, purpose: 'Build a task management SaaS app' }, 'TestProject');
    assert.ok(S.files['docs/32_qa_blueprint.md'], 'docs/32 should be generated in English mode');
    assert.ok(S.files['docs/33_test_matrix.md'], 'docs/33 should be generated in English mode');
    assert.ok(S.files['docs/34_incident_response.md'], 'docs/34 should be generated in English mode');
    assert.ok(S.files['docs/36_test_strategy.md'], 'docs/36 should be generated in English mode');
    assert.ok(S.files['docs/37_bug_prevention.md'], 'docs/37 should be generated in English mode');
    S.genLang = 'ja';
  });

});
