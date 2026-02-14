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
eval(fs.readFileSync('src/generators/p14-ops.js', 'utf-8'));

describe('Pillar ⑭ Ops Intelligence', () => {
  test('generates docs/53_ops_runbook.md', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '学習管理システムを開発する',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar14_OpsIntelligence(answers, 'TestLMS');
    assert.ok(S.files['docs/53_ops_runbook.md'], 'Should generate ops runbook');
    const content = S.files['docs/53_ops_runbook.md'];
    assert.ok(content && content.length > 0, 'Runbook should not be empty');
  });

  test('ops runbook has all required sections', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'ECサイトを開発',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar14_OpsIntelligence(answers, 'TestEC');
    const runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('Ops Plane'), 'Should have Ops Plane section');
    assert.ok(runbook.includes('Feature Flags'), 'Should have Feature Flags section');
    assert.ok(runbook.includes('SLO'), 'Should have SLO/SLI section');
    assert.ok(runbook.includes('Observability'), 'Should have Observability section');
    assert.ok(runbook.includes('Job'), 'Should have Job Management section');
    assert.ok(runbook.includes('Backup'), 'Should have Backup section');
    assert.ok(runbook.includes('Rate Limit'), 'Should have Rate Limiting section');
  });

  test('generates docs/54_ops_checklist.md', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = {
      purpose: 'Build a fintech app',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar14_OpsIntelligence(answers, 'TestFintech');
    assert.ok(S.files['docs/54_ops_checklist.md'], 'Should generate ops checklist');
    const checklist = S.files['docs/54_ops_checklist.md'];
    assert.ok(checklist && checklist.length > 0, 'Checklist should not be empty');
  });

  test('ops checklist has 12 capability categories', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'SaaSアプリ開発',
      frontend: 'Vue',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    };
    genPillar14_OpsIntelligence(answers, 'TestSaaS');
    const checklist = S.files['docs/54_ops_checklist.md'];
    // Check for all 12 categories (using emoji markers)
    assert.ok(checklist.includes('🔍'), 'Should have log aggregation');
    assert.ok(checklist.includes('📊'), 'Should have metrics collection');
    assert.ok(checklist.includes('🔔'), 'Should have alerting');
    assert.ok(checklist.includes('🔎'), 'Should have tracing');
    assert.ok(checklist.includes('🚩'), 'Should have feature flags');
    assert.ok(checklist.includes('⚖️'), 'Should have rate limiting');
    assert.ok(checklist.includes('🎛️'), 'Should have admin console');
    assert.ok(checklist.includes('💾'), 'Should have backup');
    assert.ok(checklist.includes('🔄'), 'Should have restore procedure');
    assert.ok(checklist.includes('🚨'), 'Should have incident response');
    assert.ok(checklist.includes('📝'), 'Should have change management');
    assert.ok(checklist.includes('🔐'), 'Should have security audit');
  });

  test('SLO adapts to domain', () => {
    // Fintech should have 99.99%
    S.files = {};
    S.genLang = 'en';
    genPillar14_OpsIntelligence({
      purpose: 'Build a fintech trading platform for stock investment',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestFintech');
    let runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('99.99%'), 'Fintech should have 99.99% SLO');

    // Portfolio should have 99%
    S.files = {};
    genPillar14_OpsIntelligence({
      purpose: 'Build a personal portfolio website',
      frontend: 'Next.js',
      backend: 'None (static)',
      database: 'None',
      deploy: 'Vercel'
    }, 'TestPortfolio');
    runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('99%'), 'Portfolio should have 99% SLO');
  });

  test('Feature Flags section exists', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar14_OpsIntelligence({
      purpose: '予約管理システム',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestBooking');
    const runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('Feature Flags'), 'Should have Feature Flags section');
    assert.ok(runbook.includes('予約受付停止') || runbook.includes('Booking intake'), 'Should have domain-specific flags');
  });

  test('Job patterns adapt to deployment target', () => {
    // BaaS environment should suggest Vercel Cron / pg_cron
    S.files = {};
    S.genLang = 'en';
    genPillar14_OpsIntelligence({
      purpose: 'Build an education platform',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    }, 'TestEdu');
    let runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('Vercel Cron') || runbook.includes('pg_cron'), 'BaaS should suggest Vercel Cron or pg_cron');

    // Traditional should suggest BullMQ
    S.files = {};
    genPillar14_OpsIntelligence({
      purpose: 'Build a marketplace',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestMarketplace');
    runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('BullMQ') || runbook.includes('node-cron'), 'Traditional should suggest BullMQ or node-cron');
  });

  test('Backup requirements adapt to architecture', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar14_OpsIntelligence({
      purpose: 'ヘルスケアアプリ',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    }, 'TestHealth');
    const runbook = S.files['docs/53_ops_runbook.md'];
    assert.ok(runbook.includes('RPO') && runbook.includes('RTO'), 'Should define RPO/RTO');
    assert.ok(runbook.includes('暗号化') || runbook.includes('encrypt'), 'Health domain should mention encryption');
  });

  test('supports all 24 domains', () => {
    const domains = [
      'education', 'ec', 'saas', 'fintech', 'health', 'booking',
      'marketplace', 'community', 'content', 'analytics', 'iot',
      'realestate', 'legal', 'hr', 'portfolio', 'tool', 'ai',
      'automation', 'event', 'gamify', 'collab', 'devtool',
      'creator', 'newsletter'
    ];

    domains.forEach(domain => {
      const ops = DOMAIN_OPS[domain];
      assert.ok(ops, `Should have ops config for ${domain}`);
      assert.ok(ops.slo, `${domain} should have SLO`);
      assert.ok(ops.flags_ja && ops.flags_ja.length > 0, `${domain} should have Japanese flags`);
      assert.ok(ops.flags_en && ops.flags_en.length > 0, `${domain} should have English flags`);
    });
  });

  test('English output works correctly', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar14_OpsIntelligence({
      purpose: 'Build a real estate platform',
      frontend: 'Next.js',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestRealEstate');
    const runbook = S.files['docs/53_ops_runbook.md'];
    const checklist = S.files['docs/54_ops_checklist.md'];
    // Should not contain Japanese
    assert.ok(!runbook.includes('運用設計書'), 'English runbook should not have Japanese title');
    assert.ok(runbook.includes('Ops Runbook'), 'English runbook should have English title');
    assert.ok(!checklist.includes('運用準備'), 'English checklist should not have Japanese title');
    assert.ok(checklist.includes('Ops Readiness'), 'English checklist should have English title');
  });

  test('domain-specific hardening items included', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar14_OpsIntelligence({
      purpose: '金融アプリ開発',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestFintech2');
    const checklist = S.files['docs/54_ops_checklist.md'];
    assert.ok(checklist.includes('ドメイン固有強化') || checklist.includes('Domain-Specific Hardening'), 'Should have domain-specific hardening section');
    // Fintech should mention idempotency
    assert.ok(checklist.includes('冪等性') || checklist.includes('Idempotency'), 'Fintech should mention idempotency');
  });

  test('generates docs/55_ops_plane_design.md', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar14_OpsIntelligence({
      purpose: 'LMS開発',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    }, 'TestOpsPlane');
    assert.ok(S.files['docs/55_ops_plane_design.md'], 'Should generate ops plane design');
    const content = S.files['docs/55_ops_plane_design.md'];
    assert.ok(content.length > 0, 'Ops plane design should not be empty');
    assert.ok(content.includes('Ops Plane'), 'Should mention Ops Plane');
  });

  test('ops plane design has all 6 sections', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar14_OpsIntelligence({
      purpose: 'E-commerce platform',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestSections');
    const opsPlane = S.files['docs/55_ops_plane_design.md'];
    // Check for all 6 sections
    assert.ok(opsPlane.includes('Ops Plane Architecture') || opsPlane.includes('Ops Plane アーキテクチャ'), 'Should have § 1');
    assert.ok(opsPlane.includes('12 Ops Capabilities') || opsPlane.includes('12 Ops Capabilities 実装ガイド'), 'Should have § 2');
    assert.ok(opsPlane.includes('Circuit Breaker') || opsPlane.includes('Graceful Degradation'), 'Should have § 3');
    assert.ok(opsPlane.includes('Evidence-Based Operations') || opsPlane.includes('証拠ベース運用'), 'Should have § 4');
    assert.ok(opsPlane.includes('Dev × Ops') || opsPlane.includes('Responsibility Separation') || opsPlane.includes('責任分離'), 'Should have § 5');
    assert.ok(opsPlane.includes('Admin Console') || opsPlane.includes('Admin Console アーキテクチャ'), 'Should have § 6');
  });

  test('circuit breaker thresholds adapt to domain', () => {
    S.files = {};
    S.genLang = 'ja';
    genPillar14_OpsIntelligence({
      purpose: '医療システム開発',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'Railway'
    }, 'TestCircuitBreaker');
    const opsPlane = S.files['docs/55_ops_plane_design.md'];
    // Should have circuit breaker diagram or threshold information
    assert.ok(opsPlane.includes('stateDiagram') || opsPlane.includes('Closed') || opsPlane.includes('Open') || opsPlane.includes('HalfOpen'), 'Should have circuit breaker state machine');
  });

  test('audit schema has required fields', () => {
    S.files = {};
    S.genLang = 'en';
    genPillar14_OpsIntelligence({
      purpose: 'Fintech application',
      frontend: 'React',
      backend: 'Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    }, 'TestAudit');
    const opsPlane = S.files['docs/55_ops_plane_design.md'];
    // Check for AuditEvent schema fields
    assert.ok(opsPlane.includes('run_id') || opsPlane.includes('actor') || opsPlane.includes('action'), 'Should define AuditEvent schema with required fields');
  });
});
