// CI/CD Intelligence (P20) — Unit & Integration Tests
const { describe, it } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

// Minimal runtime environment
const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'TestProject', phase: 1, step: 0, skipped: [], files: {},
  editedFiles: {}, prevFiles: {}, genLang: 'ja', previewFile: null, pillar: 0
};
const save = () => {};
const _lsGet = () => null; const _lsSet = () => {}; const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p20-cicd.js', 'utf-8'));

// ─────────────────────────────────────────────────────────────────────────────
// DATA STRUCTURE TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('P20: Data Structures', () => {
  it('PIPELINE_STAGES has exactly 9 stages', () => {
    assert.strictEqual(PIPELINE_STAGES.length, 9);
  });

  it('PIPELINE_STAGES have required fields', () => {
    PIPELINE_STAGES.forEach(s => {
      assert.ok(s.id, 'stage.id missing');
      assert.ok(s.name_ja, 'stage.name_ja missing');
      assert.ok(s.name_en, 'stage.name_en missing');
      assert.ok(s.tools, 'stage.tools missing');
      assert.ok(s.gate_ja, 'stage.gate_ja missing');
      assert.ok(s.gate_en, 'stage.gate_en missing');
    });
  });

  it('DEPLOY_STRATEGIES has exactly 4 strategies', () => {
    assert.strictEqual(DEPLOY_STRATEGIES.length, 4);
  });

  it('DEPLOY_STRATEGIES have required fields', () => {
    DEPLOY_STRATEGIES.forEach(s => {
      assert.ok(s.id, 'strategy.id missing');
      assert.ok(s.name_ja, 'strategy.name_ja missing');
      assert.ok(s.name_en, 'strategy.name_en missing');
      assert.ok(s.rollback_ja, 'strategy.rollback_ja missing');
    });
  });

  it('QUALITY_GATES has exactly 5 gates', () => {
    assert.strictEqual(QUALITY_GATES.length, 5);
  });

  it('QUALITY_GATES have blocking field as boolean', () => {
    QUALITY_GATES.forEach(qg => {
      assert.strictEqual(typeof qg.blocking, 'boolean');
    });
  });

  it('RELEASE_MODELS has exactly 3 models', () => {
    assert.strictEqual(RELEASE_MODELS.length, 3);
  });

  it('RELEASE_MODELS have required fields', () => {
    RELEASE_MODELS.forEach(m => {
      assert.ok(m.id, 'model.id missing');
      assert.ok(m.name_ja, 'model.name_ja missing');
      assert.ok(m.name_en, 'model.name_en missing');
      assert.ok(m.branches_ja, 'model.branches_ja missing');
      assert.ok(m.branches_en, 'model.branches_en missing');
    });
  });

  it('DEPLOY_TARGET_CONFIG has exactly 9 targets', () => {
    assert.strictEqual(Object.keys(DEPLOY_TARGET_CONFIG).length, 9);
  });

  it('DEPLOY_TARGET_CONFIG targets have required fields', () => {
    Object.entries(DEPLOY_TARGET_CONFIG).forEach(([key, cfg]) => {
      assert.ok(cfg.cmd, `${key}.cmd missing`);
      assert.ok(cfg.preview, `${key}.preview missing`);
      assert.ok(cfg.env, `${key}.env missing`);
      assert.ok(cfg.features, `${key}.features missing`);
      assert.ok(cfg.features_ja, `${key}.features_ja missing`);
    });
  });

  it('DEPLOY_TARGET_CONFIG includes key targets', () => {
    ['Vercel', 'Firebase', 'AWS', 'Docker', 'Netlify'].forEach(key => {
      assert.ok(DEPLOY_TARGET_CONFIG[key], `Missing deploy target: ${key}`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// GENERATOR OUTPUT TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('P20: Generator Outputs (Japanese)', () => {
  const a = {
    purpose: 'SaaS型タスク管理アプリ', target: '開発者',
    frontend: 'React + Next.js', backend: 'Supabase',
    database: 'Supabase (PostgreSQL)', deploy: 'Vercel',
    auth: 'Supabase Auth'
  };
  const pn = 'TaskApp';
  const dtCfg = DEPLOY_TARGET_CONFIG['Vercel'];
  const domain = 'saas';

  it('gen77 generates doc 77 with Mermaid graph', () => {
    const out = gen77(true, domain, dtCfg, a, pn);
    assert.ok(out.includes('CI/CDパイプライン設計'), 'Missing Japanese title');
    assert.ok(out.includes('```mermaid'), 'Missing mermaid block');
    assert.ok(out.includes('graph TD'), 'Missing graph TD');
    assert.ok(out.includes('TaskApp'), 'Missing project name');
    assert.ok(out.includes('Vercel'), 'Missing deploy target');
  });

  it('gen77 includes GitHub Actions YAML', () => {
    const out = gen77(true, domain, dtCfg, a, pn);
    assert.ok(out.includes('```yaml'), 'Missing yaml block');
    assert.ok(out.includes('actions/checkout@v4'), 'Missing checkout action');
    assert.ok(out.includes('npm ci'), 'Missing install command');
  });

  it('gen78 generates doc 78 with environment strategy', () => {
    const out = gen78(true, domain, dtCfg, a, pn);
    assert.ok(out.includes('デプロイ戦略'), 'Missing Japanese title');
    assert.ok(out.includes('Staging'), 'Missing staging env');
    assert.ok(out.includes('Production'), 'Missing production env');
    assert.ok(out.includes('ロールバック'), 'Missing rollback section');
  });

  it('gen79 generates doc 79 with quality gate matrix', () => {
    const out = gen79(true, domain, dtCfg, a, pn);
    assert.ok(out.includes('品質ゲートマトリクス'), 'Missing Japanese title');
    assert.ok(out.includes('コード品質'), 'Missing code quality gate');
    assert.ok(out.includes('テストカバレッジ'), 'Missing coverage gate');
    assert.ok(out.includes('LCP'), 'Missing LCP metric');
  });

  it('gen80 generates doc 80 with branch model', () => {
    const out = gen80(true, domain, dtCfg, a, pn);
    assert.ok(out.includes('リリースエンジニアリング'), 'Missing Japanese title');
    assert.ok(out.includes('gitGraph'), 'Missing Mermaid gitGraph');
    assert.ok(out.includes('MAJOR.MINOR.PATCH'), 'Missing semver');
    assert.ok(out.includes('renovate'), 'Missing Renovate config');
  });
});

describe('P20: Generator Outputs (English)', () => {
  const a = {
    purpose: 'SaaS task management app', target: 'developers',
    frontend: 'React + Next.js', backend: 'Supabase',
    database: 'Supabase (PostgreSQL)', deploy: 'AWS',
    auth: 'Supabase Auth'
  };
  const pn = 'TaskApp';
  const dtCfg = DEPLOY_TARGET_CONFIG['AWS'];
  const domain = 'saas';

  it('gen77 EN generates with English titles', () => {
    const out = gen77(false, domain, dtCfg, a, pn);
    assert.ok(out.includes('CI/CD Pipeline Design'), 'Missing English title');
    assert.ok(out.includes('Stage Details'), 'Missing stage details');
    assert.ok(out.includes('aws ecs'), 'Missing AWS deploy cmd');
  });

  it('gen78 EN generates with English content', () => {
    const out = gen78(false, domain, dtCfg, a, pn);
    assert.ok(out.includes('Deployment Strategy'), 'Missing English title');
    assert.ok(out.includes('Rollback Automation'), 'Missing rollback section');
  });

  it('gen79 EN generates with English content', () => {
    const out = gen79(false, domain, dtCfg, a, pn);
    assert.ok(out.includes('Quality Gate Matrix'), 'Missing English title');
    assert.ok(out.includes('Code Quality'), 'Missing code quality');
    assert.ok(out.includes('Test Coverage'), 'Missing test coverage');
  });

  it('gen80 EN generates with English content', () => {
    const out = gen80(false, domain, dtCfg, a, pn);
    assert.ok(out.includes('Release Engineering'), 'Missing English title');
    assert.ok(out.includes('Semantic Versioning'), 'Missing semver title');
    assert.ok(out.includes('SBOM'), 'Missing SBOM section');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('P20: Integration Tests', () => {
  it('genPillar20_CICDIntelligence generates all 4 docs for any domain', () => {
    const domains = ['saas', 'ec', 'fintech', 'healthcare', 'iot', 'logistics', 'tool', 'portfolio'];
    domains.forEach(purposeWord => {
      S.files = {}; S.genLang = 'ja';
      const a = { purpose: purposeWord + ' app', deploy: 'Vercel' };
      genPillar20_CICDIntelligence(a, 'TestProject');
      assert.ok(S.files['docs/77_cicd_pipeline_design.md'], `doc77 missing for domain: ${purposeWord}`);
      assert.ok(S.files['docs/78_deployment_strategy.md'], `doc78 missing for domain: ${purposeWord}`);
      assert.ok(S.files['docs/79_quality_gate_matrix.md'], `doc79 missing for domain: ${purposeWord}`);
      assert.ok(S.files['docs/80_release_engineering.md'], `doc80 missing for domain: ${purposeWord}`);
    });
  });

  it('fintech domain includes compliance gate and dual approval', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar20_CICDIntelligence({ purpose: 'fintech payment app', deploy: 'Vercel' }, 'FintechApp');
    const p77 = S.files['docs/77_cicd_pipeline_design.md'];
    const p78 = S.files['docs/78_deployment_strategy.md'];
    const p79 = S.files['docs/79_quality_gate_matrix.md'];
    assert.ok(p77.includes('デュアル承認') || p77.includes('Dual Approval') || p77.includes('承認'), 'Missing fintech dual approval in doc77');
    assert.ok(p78.includes('承認') || p78.includes('Approval'), 'Missing fintech approval in doc78');
    assert.ok(p79.includes('コンプライアンス') || p79.includes('Compliance') || p79.includes('PCI'), 'Missing fintech compliance gate in doc79');
  });

  it('JA/EN generates different language content', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Vercel' }, 'TestApp');
    const ja77 = S.files['docs/77_cicd_pipeline_design.md'];

    S.files = {}; S.genLang = 'en';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Vercel' }, 'TestApp');
    const en77 = S.files['docs/77_cicd_pipeline_design.md'];

    assert.ok(ja77.includes('パイプライン'), 'JA should have Japanese text');
    assert.ok(en77.includes('Pipeline'), 'EN should have English text');
    assert.notEqual(ja77, en77, 'JA and EN should differ');
  });

  it('Vercel config differs from Docker config', () => {
    S.files = {}; S.genLang = 'en';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Vercel' }, 'App');
    const vercel77 = S.files['docs/77_cicd_pipeline_design.md'];

    S.files = {}; S.genLang = 'en';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Docker (self-hosted)' }, 'App');
    const docker77 = S.files['docs/77_cicd_pipeline_design.md'];

    assert.ok(vercel77.includes('vercel'), 'Vercel config should include vercel command');
    assert.ok(docker77.includes('kubectl'), 'Docker config should include kubectl command');
  });

  it('Docker JA key normalization works', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Docker (自前)' }, 'App');
    const docker77ja = S.files['docs/77_cicd_pipeline_design.md'];
    assert.ok(docker77ja.includes('kubectl'), 'Docker JA should normalize to Docker config');
  });

  it('no template literal contamination in generated docs', () => {
    S.files = {}; S.genLang = 'ja';
    genPillar20_CICDIntelligence({ purpose: 'saas app', deploy: 'Vercel' }, 'MyProject');
    [77, 78, 79, 80].forEach(n => {
      const key = 'docs/' + n + '_' + ['cicd_pipeline_design', 'deployment_strategy', 'quality_gate_matrix', 'release_engineering'][n - 77] + '.md';
      const content = S.files[key] || '';
      // ${{ }} is valid GitHub Actions syntax; check for ${variable} (JS template literal leakage)
      assert.ok(!content.match(/\$\{[^{]/), `doc${n} should not contain JS template literal syntax`);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DEPLOY TARGET SPECIFIC TESTS
// ─────────────────────────────────────────────────────────────────────────────
describe('P20: Deploy Target Specific', () => {
  it('Vercel config references vercel CLI', () => {
    const dtCfg = DEPLOY_TARGET_CONFIG['Vercel'];
    assert.ok(dtCfg.cmd.includes('vercel'), 'Vercel cmd should reference vercel');
    assert.ok(dtCfg.preview.includes('vercel'), 'Vercel preview should reference vercel');
  });

  it('AWS config references aws CLI', () => {
    const dtCfg = DEPLOY_TARGET_CONFIG['AWS'];
    assert.ok(dtCfg.cmd.includes('aws'), 'AWS cmd should reference aws CLI');
  });

  it('Docker config references kubectl', () => {
    const dtCfg = DEPLOY_TARGET_CONFIG['Docker'];
    assert.ok(dtCfg.cmd.includes('kubectl'), 'Docker cmd should reference kubectl');
    assert.ok(dtCfg.features.includes('Kubernetes') || dtCfg.features_ja.includes('Kubernetes'), 'Docker features should mention Kubernetes');
  });

  it('Netlify config references netlify CLI', () => {
    const dtCfg = DEPLOY_TARGET_CONFIG['Netlify'];
    assert.ok(dtCfg.cmd.includes('netlify'), 'Netlify cmd should reference netlify');
  });
});
