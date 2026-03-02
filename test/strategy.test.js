const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// Simplified state for testing
global.S = {
  genLang: 'ja',
  files: {},
  lang: 'ja',
  answers: {}
};

// Load modules
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p13-strategy.js', 'utf-8').replace(/const /g, 'var '));

describe('Pillar ⑬ Strategic Intelligence', () => {

  test('generates all 6 documents', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '学習管理システムを開発する',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    };
    genPillar13_StrategicIntelligence(answers, 'TestLMS');
    assert.ok(S.files['docs/48_industry_blueprint.md'], 'Should generate docs/48_industry_blueprint.md');
    assert.ok(S.files['docs/49_tech_radar.md'], 'Should generate docs/49_tech_radar.md');
    assert.ok(S.files['docs/50_stakeholder_strategy.md'], 'Should generate docs/50_stakeholder_strategy.md');
    assert.ok(S.files['docs/51_operational_excellence.md'], 'Should generate docs/51_operational_excellence.md');
    assert.ok(S.files['docs/52_advanced_scenarios.md'], 'Should generate docs/52_advanced_scenarios.md');
    assert.ok(S.files['docs/48-2_cost_estimation.md'], 'Should generate docs/48-2_cost_estimation.md');
  });

  test('all generated documents are non-empty', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'ECサイトを開発する',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar13_StrategicIntelligence(answers, 'TestEC');
    const docs = [
      'docs/48_industry_blueprint.md',
      'docs/49_tech_radar.md',
      'docs/50_stakeholder_strategy.md',
      'docs/51_operational_excellence.md',
      'docs/52_advanced_scenarios.md',
      'docs/48-2_cost_estimation.md'
    ];
    docs.forEach(doc => {
      const content = S.files[doc];
      assert.ok(content && content.length > 0, doc + ' should not be empty');
    });
  });

  test('doc48 contains Industry Blueprint title in Japanese mode', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'SaaSアプリを開発する',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestSaaS');
    const doc48 = S.files['docs/48_industry_blueprint.md'];
    assert.ok(doc48.includes('業種別設計図'), 'doc48 should contain Japanese title "業種別設計図"');
  });

  test('doc48 contains Industry Blueprint title in English mode', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar13_StrategicIntelligence({
      purpose: 'Build a SaaS application',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestSaaSEn');
    const doc48 = S.files['docs/48_industry_blueprint.md'];
    assert.ok(doc48.includes('Industry Blueprint'), 'doc48 should contain English title "Industry Blueprint"');
  });

  test('education domain: FERPA appears in doc48', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: '大学向けの学習管理システム(LMS)を開発する',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestEduFERPA');
    const doc48 = S.files['docs/48_industry_blueprint.md'];
    assert.ok(doc48.includes('FERPA'), 'Education domain should mention FERPA in doc48');
  });

  test('EC domain: PCI DSS appears in doc48', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'ECサイト・オンラインショッピングプラットフォームを開発する',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway',
      payment: 'stripe'
    }, 'TestECPCI');
    const doc48 = S.files['docs/48_industry_blueprint.md'];
    assert.ok(doc48.includes('PCI DSS'), 'EC domain should mention PCI DSS in doc48');
  });

  test('fintech domain: compliance-related text appears in doc48', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: '金融取引プラットフォームを開発する',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestFintech');
    const doc48 = S.files['docs/48_industry_blueprint.md'];
    // Fintech domain includes KYC/AML or financial law references
    assert.ok(
      doc48.includes('KYC') || doc48.includes('AML') || doc48.includes('金融商品取引法') || doc48.includes('Financial instruments'),
      'Fintech domain should mention compliance terms in doc48'
    );
  });

  test('doc49 contains Tech Radar title in Japanese mode', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'マーケットプレイスを開発する',
      frontend: 'Vue',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    }, 'TestMarket');
    const doc49 = S.files['docs/49_tech_radar.md'];
    assert.ok(doc49.includes('技術トレンドレーダー'), 'doc49 should contain Japanese title "技術トレンドレーダー"');
  });

  test('doc49 contains Tech Radar title in English mode', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar13_StrategicIntelligence({
      purpose: 'Build a marketplace platform',
      frontend: 'Vue',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    }, 'TestMarketEn');
    const doc49 = S.files['docs/49_tech_radar.md'];
    assert.ok(doc49.includes('Technology Radar') || doc49.includes('Tech Radar'), 'doc49 should contain English "Tech Radar" or "Technology Radar"');
  });

  test('doc49 contains Adopt/Trial/Assess/Hold classification', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'コミュニティプラットフォームを開発する',
      frontend: 'React',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    }, 'TestCommunity');
    const doc49 = S.files['docs/49_tech_radar.md'];
    assert.ok(doc49.includes('Adopt'), 'doc49 should contain Adopt category');
    assert.ok(doc49.includes('Trial'), 'doc49 should contain Trial category');
    assert.ok(doc49.includes('Assess'), 'doc49 should contain Assess category');
    assert.ok(doc49.includes('Hold'), 'doc49 should contain Hold category');
  });

  test('doc50 contains Stakeholder title in Japanese mode', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'SaaS分析ツールを開発する',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestAnalytics');
    const doc50 = S.files['docs/50_stakeholder_strategy.md'];
    assert.ok(doc50.includes('ステークホルダー'), 'doc50 should contain Japanese "ステークホルダー"');
  });

  test('doc50 contains Stakeholder title in English mode', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar13_StrategicIntelligence({
      purpose: 'Build an analytics SaaS tool',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestAnalyticsEn');
    const doc50 = S.files['docs/50_stakeholder_strategy.md'];
    assert.ok(doc50.includes('Stakeholder'), 'doc50 should contain English "Stakeholder"');
  });

  test('doc51 contains Operational Excellence title in Japanese mode', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: '予約管理システムを開発する',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestBooking');
    const doc51 = S.files['docs/51_operational_excellence.md'];
    assert.ok(doc51.includes('運用卓越性'), 'doc51 should contain Japanese "運用卓越性"');
  });

  test('doc51 contains Operational Excellence title in English mode', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar13_StrategicIntelligence({
      purpose: 'Build a booking management system',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestBookingEn');
    const doc51 = S.files['docs/51_operational_excellence.md'];
    assert.ok(doc51.includes('Operational Excellence'), 'doc51 should contain English "Operational Excellence"');
  });

  test('doc51 contains DORA metrics and RTO/RPO content', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'ヘルスケアアプリを開発する',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestHealth');
    const doc51 = S.files['docs/51_operational_excellence.md'];
    assert.ok(doc51.includes('DORA'), 'doc51 should mention DORA metrics');
    assert.ok(doc51.includes('RTO') && doc51.includes('RPO'), 'doc51 should define RTO and RPO');
  });

  test('_default fallback: empty purpose still generates all 6 docs', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: '',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestDefault');
    const docs = [
      'docs/48_industry_blueprint.md',
      'docs/49_tech_radar.md',
      'docs/50_stakeholder_strategy.md',
      'docs/51_operational_excellence.md',
      'docs/52_advanced_scenarios.md',
      'docs/48-2_cost_estimation.md'
    ];
    docs.forEach(doc => {
      const content = S.files[doc];
      assert.ok(content && content.length > 0, '_default fallback: ' + doc + ' should be generated and non-empty');
    });
  });

  test('cost estimation doc contains development effort and infra sections', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'ECサイトを開発する',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Vercel',
      payment: 'stripe'
    }, 'TestCostEC');
    const costDoc = S.files['docs/48-2_cost_estimation.md'];
    assert.ok(costDoc.includes('開発工数見積もり') || costDoc.includes('Development Effort'), 'Cost doc should have development effort section');
    assert.ok(costDoc.includes('インフラコスト') || costDoc.includes('Infrastructure Cost'), 'Cost doc should have infrastructure cost section');
    assert.ok(costDoc.includes('MVP'), 'Cost doc should reference MVP phase');
  });

  test('health domain triggers break-glass scenario in doc52', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar13_StrategicIntelligence({
      purpose: 'ヘルスケア電子カルテシステムを開発する',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestHealthScenario');
    const doc52 = S.files['docs/52_advanced_scenarios.md'];
    assert.ok(
      doc52.includes('Break-glass') || doc52.includes('break-glass'),
      'Health domain should include break-glass emergency access scenario in doc52'
    );
  });

  test('Strangler Fig pattern appears in doc52 for all domains', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar13_StrategicIntelligence({
      purpose: 'Build a logistics management platform',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestLogistics');
    const doc52 = S.files['docs/52_advanced_scenarios.md'];
    assert.ok(
      doc52.includes('Strangler Fig') || doc52.includes('strangler'),
      'doc52 should include Strangler Fig pattern (available for all domains)'
    );
  });
});
