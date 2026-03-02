const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

global.S = { genLang: 'ja', files: {}, lang: 'ja', answers: {} };

eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/data/compat-rules.js', 'utf-8'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p26-observability.js', 'utf-8'));

describe('Pillar ㉖ Observability Intelligence', () => {

  test('all 4 docs are generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    assert.ok(S.files['docs/103_observability_architecture.md'], 'docs/103 should be generated');
    assert.ok(S.files['docs/104_structured_logging.md'], 'docs/104 should be generated');
    assert.ok(S.files['docs/105_metrics_alerting.md'], 'docs/105 should be generated');
    assert.ok(S.files['docs/106_distributed_tracing.md'], 'docs/106 should be generated');
  });

  test('all 4 docs are non-empty', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    assert.ok(S.files['docs/103_observability_architecture.md'].length > 100, 'docs/103 should be non-empty');
    assert.ok(S.files['docs/104_structured_logging.md'].length > 100, 'docs/104 should be non-empty');
    assert.ok(S.files['docs/105_metrics_alerting.md'].length > 100, 'docs/105 should be non-empty');
    assert.ok(S.files['docs/106_distributed_tracing.md'].length > 100, 'docs/106 should be non-empty');
  });

  test('docs/103 contains "Observability" or "オブザーバビリティ"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(
      doc103.includes('Observability') || doc103.includes('オブザーバビリティ'),
      'docs/103 should contain "Observability" or "オブザーバビリティ"'
    );
  });

  test('docs/104 contains "Logging" or "ログ"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc104 = S.files['docs/104_structured_logging.md'];
    assert.ok(
      doc104.includes('Logging') || doc104.includes('ログ'),
      'docs/104 should contain "Logging" or "ログ"'
    );
  });

  test('docs/105 contains "Metrics" or "メトリクス"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc105 = S.files['docs/105_metrics_alerting.md'];
    assert.ok(
      doc105.includes('Metrics') || doc105.includes('メトリクス'),
      'docs/105 should contain "Metrics" or "メトリクス"'
    );
  });

  test('docs/106 contains "Tracing" or "トレーシング"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc106 = S.files['docs/106_distributed_tracing.md'];
    assert.ok(
      doc106.includes('Tracing') || doc106.includes('トレーシング') || doc106.includes('Distributed'),
      'docs/106 should contain "Tracing" or "トレーシング"'
    );
  });

  test('Vercel deploy: docs/103 contains "Vercel"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Vercel' };
    genPillar26_Observability(answers, 'TestProject');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(doc103.includes('Vercel'), 'docs/103 should reference Vercel when deploying to Vercel');
  });

  test('Railway deploy: docs/103 contains "Railway" or "OTel"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'React', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(
      doc103.includes('Railway') || doc103.includes('OTel') || doc103.includes('OpenTelemetry'),
      'docs/103 should reference Railway or OTel for Railway deploy'
    );
  });

  test('BaaS backend (Supabase): all 4 docs are generated normally', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Supabase', database: 'Supabase', deploy: 'Vercel' };
    genPillar26_Observability(answers, 'TestBaaS');
    assert.ok(S.files['docs/103_observability_architecture.md'], 'docs/103 should be generated for BaaS');
    assert.ok(S.files['docs/104_structured_logging.md'], 'docs/104 should be generated for BaaS');
    assert.ok(S.files['docs/105_metrics_alerting.md'], 'docs/105 should be generated for BaaS');
    assert.ok(S.files['docs/106_distributed_tracing.md'], 'docs/106 should be generated for BaaS');
  });

  test('English output: docs/103 contains "Observability Architecture"', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = { purpose: 'Build a SaaS app', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(doc103, 'docs/103 should be generated in English mode');
    assert.ok(doc103.includes('Observability Architecture'), 'docs/103 should contain "Observability Architecture" in English mode');
  });

  test('Japanese output: docs/103 contains "オブザーバビリティ"', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(doc103, 'docs/103 should be generated in Japanese mode');
    assert.ok(doc103.includes('オブザーバビリティ'), 'docs/103 should contain "オブザーバビリティ" in Japanese mode');
  });

  test('docs/105 contains alert thresholds content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc105 = S.files['docs/105_metrics_alerting.md'];
    assert.ok(
      doc105.includes('threshold') || doc105.includes('閾値') || doc105.includes('alert') || doc105.includes('Alert') || doc105.includes('error rate') || doc105.includes('エラー'),
      'docs/105 should contain alert thresholds content'
    );
  });

  test('docs/106 contains trace context content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestProject');
    const doc106 = S.files['docs/106_distributed_tracing.md'];
    assert.ok(
      doc106.includes('trace') || doc106.includes('Trace') || doc106.includes('トレース') || doc106.includes('span') || doc106.includes('Span'),
      'docs/106 should contain trace/span context content'
    );
  });

  test('Python backend: docs/103 contains Python or opentelemetry reference', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'React', backend: 'Python/FastAPI', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestPython');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(doc103, 'docs/103 should be generated for Python backend');
    // Python backend uses 'opentelemetry-sdk (Python / pip)' as exporterLabel
    assert.ok(
      doc103.includes('Python') || doc103.includes('opentelemetry') || doc103.includes('pip'),
      'docs/103 should reference Python or opentelemetry for Python backend'
    );
  });

  test('Node.js backend: docs/103 contains opentelemetry or OTel reference', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = { purpose: 'SaaSアプリを開発する', frontend: 'Next.js', backend: 'Express', database: 'PostgreSQL', deploy: 'Railway' };
    genPillar26_Observability(answers, 'TestNode');
    const doc103 = S.files['docs/103_observability_architecture.md'];
    assert.ok(doc103, 'docs/103 should be generated for Node.js backend');
    assert.ok(
      doc103.includes('opentelemetry') || doc103.includes('OTel') || doc103.includes('OpenTelemetry'),
      'docs/103 should contain opentelemetry or OTel reference for Node.js backend'
    );
  });

});
