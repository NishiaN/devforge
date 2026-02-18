// mermaid.test.js — Validates Mermaid diagram syntax in generated documentation
// Ensures all ```mermaid blocks are well-formed and properly closed
// ~9 tests

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

// ── Helper ──
function generate(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate';
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
