const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', files: {}, lang: 'ja', answers: {} };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/data/compat-rules.js', 'utf-8'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p10-reverse.js', 'utf-8').replace('const REVERSE_FLOW_MAP', 'var REVERSE_FLOW_MAP').replace('const _mmSafe', 'var _mmSafe'));

describe('Pillar ⑩ Reverse Engineering', () => {

  test('docs/29_reverse_engineering.md is always generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(S.files['docs/29_reverse_engineering.md'], 'docs/29 should always be generated');
  });

  test('docs/30_goal_decomposition.md is always generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(S.files['docs/30_goal_decomposition.md'], 'docs/30 should always be generated');
  });

  test('docs/41_growth_intelligence.md is always generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(S.files['docs/41_growth_intelligence.md'], 'docs/41 should always be generated');
  });

  test('docs/38_business_model.md is NOT generated when payment is not set', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(!S.files['docs/38_business_model.md'], 'docs/38 should NOT be generated when payment is absent');
  });

  test('docs/38_business_model.md is NOT generated when payment is "none"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel', payment: 'none' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(!S.files['docs/38_business_model.md'], 'docs/38 should NOT be generated when payment is "none"');
  });

  test('docs/38_business_model.md IS generated when payment is "stripe"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel', payment: 'stripe' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    assert.ok(S.files['docs/38_business_model.md'], 'docs/38 should be generated when payment is stripe');
  });

  test('education domain: docs/29 contains KPI-related content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: '学習管理システムを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestLMS');
    const doc29 = S.files['docs/29_reverse_engineering.md'];
    assert.ok(doc29, 'docs/29 should be generated for education domain');
    assert.ok(
      doc29.includes('KPI') || doc29.includes('kpi') || doc29.includes('修了') || doc29.includes('学習'),
      'docs/29 should contain education KPI-related content'
    );
  });

  test('EC domain: docs/29 or docs/30 contains shopping/product content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'ECサイトを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestEC');
    const doc29 = S.files['docs/29_reverse_engineering.md'] || '';
    const doc30 = S.files['docs/30_goal_decomposition.md'] || '';
    assert.ok(
      doc29.includes('CVR') || doc29.includes('売上') || doc29.includes('商品') ||
      doc30.includes('CVR') || doc30.includes('売上') || doc30.includes('商品'),
      'EC domain docs should contain shopping/product-related content'
    );
  });

  test('English output (genLang="en"): docs/29 has English headers', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = { purpose: 'Build a SaaS app', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc29 = S.files['docs/29_reverse_engineering.md'];
    assert.ok(doc29, 'docs/29 should be generated in English mode');
    assert.ok(doc29.includes('Reverse Engineering') || doc29.includes('Goal'), 'docs/29 should contain English headers');
  });

  test('Japanese output (genLang="ja"): docs/29 has Japanese text', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc29 = S.files['docs/29_reverse_engineering.md'];
    assert.ok(doc29, 'docs/29 should be generated in Japanese mode');
    assert.ok(doc29.includes('ゴール') || doc29.includes('リバース') || doc29.includes('逆算'), 'docs/29 should contain Japanese text');
  });

  test('docs/30 contains entities from data_entities answer', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'SaaSアプリを開発する',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel',
      data_entities: 'User, Team, Project'
    };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc30 = S.files['docs/30_goal_decomposition.md'];
    assert.ok(doc30, 'docs/30 should be generated');
    assert.ok(doc30.includes('User') || doc30.includes('Team') || doc30.includes('Project'), 'docs/30 should reference entities from data_entities');
  });

  test('docs/41 contains growth-related content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc41 = S.files['docs/41_growth_intelligence.md'];
    assert.ok(doc41, 'docs/41 should be generated');
    assert.ok(
      doc41.includes('成長') || doc41.includes('グロース') || doc41.includes('Growth') || doc41.includes('growth'),
      'docs/41 should contain growth-related content'
    );
  });

  test('docs/38 contains payment/revenue content when payment is set', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel', payment: 'stripe' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc38 = S.files['docs/38_business_model.md'];
    assert.ok(doc38, 'docs/38 should be generated');
    assert.ok(
      doc38.includes('収益') || doc38.includes('revenue') || doc38.includes('Revenue') || doc38.includes('payment') || doc38.includes('Payment'),
      'docs/38 should contain payment/revenue-related content'
    );
  });

  test('default domain fallback: unusual purpose still generates all docs', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'ユニークなカスタムアプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar10_ReverseEngineering(answers, 'TestCustom');
    assert.ok(S.files['docs/29_reverse_engineering.md'], 'docs/29 should be generated for default domain');
    assert.ok(S.files['docs/30_goal_decomposition.md'], 'docs/30 should be generated for default domain');
    assert.ok(S.files['docs/41_growth_intelligence.md'], 'docs/41 should be generated for default domain');
  });

  test('fintech domain: docs/29 contains fintech-related content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'フィンテック決済アプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar10_ReverseEngineering(answers, 'TestFintech');
    const doc29 = S.files['docs/29_reverse_engineering.md'];
    assert.ok(doc29, 'docs/29 should be generated for fintech domain');
    assert.ok(
      doc29.includes('取引') || doc29.includes('規制') || doc29.includes('準拠') || doc29.includes('compliance') || doc29.includes('transaction'),
      'docs/29 should contain fintech-specific content'
    );
  });

  test('SaaS domain: docs/41 contains SaaS-related content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSプロダクトを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestSaaS');
    const doc41 = S.files['docs/41_growth_intelligence.md'];
    assert.ok(doc41, 'docs/41 should be generated for SaaS domain');
    assert.ok(
      doc41.includes('MRR') || doc41.includes('チャーン') || doc41.includes('Churn') || doc41.includes('SaaS') || doc41.includes('サブスク'),
      'docs/41 should contain SaaS-specific growth content'
    );
  });

  test('docs/29 is non-empty', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'ECサイトを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc29 = S.files['docs/29_reverse_engineering.md'];
    assert.ok(doc29 && doc29.length > 100, 'docs/29 should be non-empty (> 100 chars)');
  });

  test('docs/30 is non-empty', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'ECサイトを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar10_ReverseEngineering(answers, 'TestProject');
    const doc30 = S.files['docs/30_goal_decomposition.md'];
    assert.ok(doc30 && doc30.length > 100, 'docs/30 should be non-empty (> 100 chars)');
  });

});
