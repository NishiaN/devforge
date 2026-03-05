// mermaid.test.js — Validates Mermaid diagram syntax in generated documentation
// Ensures all ```mermaid blocks are well-formed and properly closed
// ~21 tests

const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

// ── Setup (mirrors snapshot.test.js pattern) ──
const S = {
  answers: {}, skill: 'intermediate', lang: 'ja', preset: 'custom',
  projectName: 'T', phase: 1, step: 0, skipped: [], files: {},
  editedFiles: {}, prevFiles: {}, genLang: 'ja', previewFile: null, pillar: 0,
};
const save = () => {};
const _lsGet = () => null;
const _lsSet = () => {};
const _lsRm = () => {};
const sanitize = v => v;

eval(fs.readFileSync('src/data/questions.js', 'utf-8'));
eval(fs.readFileSync('src/data/presets.js', 'utf-8').replace('const PR', 'var PR'));
eval(fs.readFileSync('src/data/compat-rules.js', 'utf-8'));
eval(fs.readFileSync('src/generators/common.js', 'utf-8').replace(/const /g, 'var '));
eval(fs.readFileSync('src/generators/p1-sdd.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js', 'utf-8'));
eval(fs.readFileSync('src/generators/docs.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p5-quality.js', 'utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js', 'utf-8').replace('const GT', 'var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p9-designsystem.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p10-reverse.js', 'utf-8').replace('const REVERSE_FLOW_MAP', 'var REVERSE_FLOW_MAP'));
eval(fs.readFileSync('src/generators/p11-implguide.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p12-security.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p13-strategy.js', 'utf-8').replace(/const (INDUSTRY_INTEL|STAKEHOLDER_STRATEGY|OPERATIONAL_FRAMEWORKS|OPERATIONAL_FRAMEWORKS_EXT|EXTREME_SCENARIOS|PRAGMATIC_SCENARIOS|TECH_RADAR_BASE)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p14-ops.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p15-future.js', 'utf-8').replace(/const (DOMAIN_MARKET|PERSONA_ARCHETYPES|GTM_STRATEGY|REGULATORY_HORIZON)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p16-deviq.js', 'utf-8').replace(/const (DEV_METHODOLOGY_MAP|PHASE_PROMPTS|INDUSTRY_STRATEGY|NEXT_GEN_UX|mapDomainToIndustry|gen60|gen61|gen62|gen63|genPillar16_DevIQ)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p17-promptgenome.js', 'utf-8').replace(/const (CRITERIA_FRAMEWORK|AI_MATURITY_MODEL|APPROACH_KPI|_APPROACHES|_SYNERGY_RAW)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p18-promptops.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p19-enterprise.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p20-cicd.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p21-api.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p22-database.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p23-testing.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p24-aisafety.js', 'utf-8').replace(/const (AI_RISK_CATEGORIES|GUARDRAIL_LAYERS|MODEL_EVAL_METRICS|INJECTION_DEFENSE_PATTERNS|COMPLIANCE_AI)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p25-performance.js', 'utf-8').replace(/const (CORE_WEB_VITALS|BUNDLE_TOOLS|CACHE_LAYERS|DB_PERF_PATTERNS|MONITORING_TOOLS)/g, 'var $1'));
eval(fs.readFileSync('src/generators/p26-observability.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p27-cost.js', 'utf-8'));
eval(fs.readFileSync('src/generators/p28-xai.js', 'utf-8'));

// ── Helper ──
function generate(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate'; S.skillLv = 3;
  S.answers = answers;
  genPillar1_SDD(answers, name);
  genPillar2_DevContainer(answers, name);
  genCommonFiles(answers, name);
  genDocs21(answers, name);
  genPillar3_MCP(answers, name);
  genPillar4_AIRules(answers, name);
  genPillar5_QualityIntelligence(answers, name);
  genPillar7_Roadmap(answers, name);
  genPillar9_DesignSystem(answers, name);
  genPillar10_ReverseEngineering(answers, name);
  genPillar11_ImplIntelligence(answers, name);
  genPillar12_SecurityIntelligence(answers, name);
  genPillar13_StrategicIntelligence(answers, name);
  genPillar14_OpsIntelligence(answers, name);
  genPillar15(answers);
  genPillar16_DevIQ(answers, name);
  genPillar17_PromptGenome(answers, name);
  genPillar18_PromptOps(answers, name);
  genPillar19_EnterpriseSaaS(answers, name);
  genPillar20_CICDIntelligence(answers, name);
  genPillar21_APIIntelligence(answers, name);
  genPillar22_DatabaseIntelligence(answers, name);
  genPillar23_TestingIntelligence(answers, name);
  genPillar24_AISafety(answers, name);
  genPillar25_Performance(answers, name);
  genPillar26_Observability(answers, name);
  genPillar27_CostOptimization(answers, name);
  genPillar28_XAIIntelligence(answers, name);
  return { ...S.files };
}

// ── Mermaid validation helpers ──

/**
 * Count Mermaid code blocks in content
 */
function countMermaidBlocks(content) {
  return (content.match(/```mermaid/g) || []).length;
}

/**
 * Verify all ```mermaid blocks have a matching closing ```
 */
function allMermaidBlocksClosed(content) {
  const opens = (content.match(/```mermaid/g) || []).length;
  if (opens === 0) return true;
  // Split by opening tag, each subsequent part must contain a closing ```
  const parts = content.split('```mermaid');
  for (let i = 1; i < parts.length; i++) {
    if (!parts[i].match(/\n```/)) return false;
  }
  return true;
}

/**
 * Extract diagram types from mermaid blocks (e.g. 'erDiagram', 'graph', 'sequenceDiagram')
 */
function getMermaidDiagramTypes(content) {
  const types = [];
  const re = /```mermaid\s*\n(\w+)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    types.push(m[1]);
  }
  return types;
}

// ── Generate test files ──
const files = generate({
  purpose: 'SaaS型学習管理システム', target: '学生, 講師',
  frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  deploy: 'Vercel', auth: 'Supabase Auth', payment: 'Stripe',
  mvp_features: 'ユーザー認証, コース管理, 進捗管理',
  screens: 'ダッシュボード, コース詳細, 設定',
  data_entities: 'User, Course, Lesson, Progress, Enrollment',
  dev_methods: 'TDD', ai_tools: 'Cursor',
}, 'LMS');

// ══════════════════════════════════════════════
// ER Diagram
// ══════════════════════════════════════════════
describe('Mermaid: ER Diagram (docs/04_er_diagram.md)', () => {
  const content = files['docs/04_er_diagram.md'];

  test('ER diagram file exists', () => {
    assert.ok(content, 'docs/04_er_diagram.md missing');
  });

  test('contains at least one mermaid block', () => {
    assert.ok(countMermaidBlocks(content) >= 1, 'No mermaid blocks found');
  });

  test('uses erDiagram diagram type', () => {
    const types = getMermaidDiagramTypes(content);
    assert.ok(types.includes('erDiagram'), `Expected erDiagram, got: ${types.join(', ')}`);
  });

  test('all mermaid blocks are properly closed', () => {
    assert.ok(allMermaidBlocksClosed(content), 'Unclosed mermaid block in ER diagram');
  });
});

// ══════════════════════════════════════════════
// Screen Design (flowchart)
// ══════════════════════════════════════════════
describe('Mermaid: Screen Design (docs/06_screen_design.md)', () => {
  const content = files['docs/06_screen_design.md'];

  test('screen design file exists', () => {
    assert.ok(content, 'docs/06_screen_design.md missing');
  });

  test('uses flowchart diagram type', () => {
    const types = getMermaidDiagramTypes(content);
    const hasFlowchart = types.some(t => t === 'flowchart' || t.startsWith('graph'));
    assert.ok(hasFlowchart, `Expected flowchart, got: ${types.join(', ')}`);
  });

  test('all mermaid blocks are properly closed', () => {
    assert.ok(allMermaidBlocksClosed(content), 'Unclosed mermaid block in screen design');
  });
});

// ══════════════════════════════════════════════
// Gantt Chart
// ══════════════════════════════════════════════
describe('Mermaid: Gantt Chart (docs/10_gantt.md)', () => {
  const content = files['docs/10_gantt.md'];

  test('gantt file exists', () => {
    assert.ok(content, 'docs/10_gantt.md missing');
  });

  test('uses gantt diagram type', () => {
    const types = getMermaidDiagramTypes(content);
    assert.ok(types.includes('gantt'), `Expected gantt, got: ${types.join(', ')}`);
  });

  test('all mermaid blocks are properly closed', () => {
    assert.ok(allMermaidBlocksClosed(content), 'Unclosed mermaid block in gantt');
  });
});

// ══════════════════════════════════════════════
// Sequence Diagrams
// ══════════════════════════════════════════════
describe('Mermaid: Sequence Diagrams (docs/27_sequence_diagrams.md)', () => {
  const content = files['docs/27_sequence_diagrams.md'];

  test('sequence diagram file exists', () => {
    assert.ok(content, 'docs/27_sequence_diagrams.md missing');
  });

  test('uses sequenceDiagram type', () => {
    const types = getMermaidDiagramTypes(content);
    assert.ok(types.includes('sequenceDiagram'), `Expected sequenceDiagram, got: ${types.join(', ')}`);
  });

  test('all mermaid blocks are properly closed', () => {
    assert.ok(allMermaidBlocksClosed(content), 'Unclosed mermaid block in sequence diagrams');
  });
});

// ══════════════════════════════════════════════
// Growth Intelligence
// ══════════════════════════════════════════════
describe('Mermaid: Growth Intelligence (docs/41_growth_intelligence.md)', () => {
  const content = files['docs/41_growth_intelligence.md'];

  test('growth intelligence mermaid blocks are properly closed', () => {
    assert.ok(allMermaidBlocksClosed(content), 'Unclosed mermaid block in growth intelligence');
  });
});

// ══════════════════════════════════════════════
// P17-P28: Broad Mermaid validity check
// ══════════════════════════════════════════════

// Valid Mermaid diagram start keywords
const VALID_MERMAID_STARTS = /^(graph|flowchart|sequenceDiagram|erDiagram|gantt|pie|classDiagram|stateDiagram|gitGraph|journey|quadrantChart|timeline|block-beta|xychart)/;

/**
 * Check that all mermaid blocks in content have valid start keywords
 */
function allMermaidBlocksValid(content) {
  const re = /```mermaid\s*\n([\s\S]*?)\n```/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const body = (m[1] || '').trim();
    if (!body) return false;
    if (!VALID_MERMAID_STARTS.test(body)) return false;
  }
  return true;
}

describe('Mermaid: P20 CI/CD (deployment strategy)', () => {
  const content = files['docs/78_deployment_strategy.md'];
  test('P20 deployment doc exists', () => { assert.ok(content, 'docs/78_deployment_strategy.md missing'); });
  test('P20 all mermaid blocks closed', () => { assert.ok(allMermaidBlocksClosed(content || ''), 'Unclosed mermaid in P20'); });
  test('P20 all mermaid blocks have valid start keywords', () => { assert.ok(allMermaidBlocksValid(content || ''), 'Invalid mermaid start keyword in P20'); });
});

describe('Mermaid: P22 Database', () => {
  const content = files['docs/87_database_design_principles.md'];
  test('P22 DB doc exists', () => { assert.ok(content, 'docs/87_database_design_principles.md missing'); });
  test('P22 all mermaid blocks closed', () => { assert.ok(allMermaidBlocksClosed(content || ''), 'Unclosed mermaid in P22'); });
});

describe('Mermaid: P26 Observability', () => {
  const content = files['docs/103_observability_architecture.md'];
  test('P26 observability doc exists', () => { assert.ok(content, 'docs/103_observability_architecture.md missing'); });
  test('P26 all mermaid blocks closed', () => { assert.ok(allMermaidBlocksClosed(content || ''), 'Unclosed mermaid in P26'); });
  test('P26 all mermaid blocks have valid start keywords', () => { assert.ok(allMermaidBlocksValid(content || ''), 'Invalid mermaid start keyword in P26'); });
});

describe('Mermaid: P27 Cost (new Mermaid cycle diagram)', () => {
  const content = files['docs/109_cost_architecture.md'];
  test('P27 cost doc exists', () => { assert.ok(content, 'docs/109_cost_architecture.md missing'); });
  test('P27 cost doc contains mermaid block', () => { assert.ok(countMermaidBlocks(content || '') >= 1, 'No mermaid block in P27 cost doc'); });
  test('P27 all mermaid blocks closed', () => { assert.ok(allMermaidBlocksClosed(content || ''), 'Unclosed mermaid in P27'); });
  test('P27 mermaid uses flowchart', () => {
    const types = getMermaidDiagramTypes(content || '');
    const hasFlowchart = types.some(t => t === 'flowchart' || t.startsWith('graph'));
    assert.ok(hasFlowchart, `Expected flowchart in P27, got: ${types.join(', ')}`);
  });
});

describe('Mermaid: P3 MCP (new sequence diagram)', () => {
  const content = files['docs/132_mcp_integration_guide.md'];
  test('P3 MCP integration guide exists', () => { assert.ok(content, 'docs/132_mcp_integration_guide.md missing'); });
  test('P3 MCP doc has sequenceDiagram', () => {
    const types = getMermaidDiagramTypes(content || '');
    assert.ok(types.includes('sequenceDiagram'), `Expected sequenceDiagram in P3, got: ${types.join(', ')}`);
  });
  test('P3 all mermaid blocks closed', () => { assert.ok(allMermaidBlocksClosed(content || ''), 'Unclosed mermaid in P3 MCP'); });
});

describe('Mermaid: All files — no invalid blocks', () => {
  test('no empty mermaid blocks across all generated files', () => {
    const allContent = Object.values(files).join('\n');
    const re = /```mermaid\s*\n([\s\S]*?)\n```/g;
    const emptyBlocks = [];
    let m;
    while ((m = re.exec(allContent)) !== null) {
      if (!(m[1] || '').trim()) emptyBlocks.push('empty block found');
    }
    assert.strictEqual(emptyBlocks.length, 0, `Found ${emptyBlocks.length} empty mermaid block(s)`);
  });
});
