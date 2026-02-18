// test/promptops.test.js — P18 Prompt Engineering OS tests

const {test} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read generator module
const p18Code = fs.readFileSync(path.join(__dirname, '../src/generators/p18-promptops.js'), 'utf8');

// Mock environment
global.S = {genLang: 'ja', files: {}};
global.detectDomain = (purpose) => {
  if (/学習|教育|LMS/.test(purpose)) return 'education';
  if (/EC|ショッピング/.test(purpose)) return 'ec';
  if (/金融|フィンテック/.test(purpose)) return 'fintech';
  if (/医療|ヘルスケア/.test(purpose)) return 'health';
  if (/SaaS/.test(purpose)) return 'saas';
  if (/logistics|物流/.test(purpose)) return 'logistics';
  return 'saas';
};

// Mock DEV_METHODOLOGY_MAP (P16 dependency)
global.DEV_METHODOLOGY_MAP = {
  education: {
    primary_ja: 'フロー状態設計 + プログレッシブ開示', primary_en: 'Flow State + Progressive Disclosure',
    secondary_ja: '認知負荷最小化 + インクルーシブ', secondary_en: 'Cognitive Load Min. + Inclusive',
    rationale_ja: '学習は集中フロー維持が最重要。', rationale_en: 'Learning requires sustained flow.',
    kw_ja: ['フロー維持','マイクロラーニング','段階的開示','アクセシブル'],
    kw_en: ['Flow state','Microlearning','Progressive disclosure','Accessible']
  },
  fintech: {
    primary_ja: 'レジリエント + データドリブン', primary_en: 'Resilient + Data-Driven',
    secondary_ja: '認知負荷最小化 + インクルーシブ', secondary_en: 'Cognitive Load Min. + Inclusive',
    rationale_ja: '金融は信頼が命。', rationale_en: 'Finance demands trust.',
    kw_ja: ['冪等性','自己修復','透明な取引履歴','金融リテラシー配慮'],
    kw_en: ['Idempotency','Self-healing','Transparent transaction history','Financial literacy consideration']
  },
  health: {
    primary_ja: 'レジリエント + データドリブン', primary_en: 'Resilient + Data-Driven',
    secondary_ja: 'インクルーシブ + 認知負荷最小化', secondary_en: 'Inclusive + Cognitive Load Min.',
    rationale_ja: '医療は信頼性が最重要。', rationale_en: 'Healthcare demands reliability.',
    kw_ja: ['PHI保護','HIPAA準拠','患者安全','アクセシビリティ'],
    kw_en: ['PHI protection','HIPAA compliance','Patient safety','Accessibility']
  },
  saas: {
    primary_ja: 'プログレッシブ開示 + データドリブン', primary_en: 'Progressive Disclosure + Data-Driven',
    secondary_ja: '時間価値最大化 + アトミック設計', secondary_en: 'Time Value Max. + Atomic Design',
    rationale_ja: 'SaaSは自己学習とオンボーディングが成否を分ける。', rationale_en: 'SaaS success depends on onboarding.',
    kw_ja: ['セルフサービス','使用量可視化','コンポーネントライブラリ','PQLトラッキング'],
    kw_en: ['Self-service','Usage visibility','Component library','PQL tracking']
  },
  _default: {
    primary_ja: 'データドリブン + プログレッシブ開示', primary_en: 'Data-Driven + Progressive Disclosure',
    secondary_ja: '時間価値最大化 + レジリエント', secondary_en: 'Time Value Max. + Resilient',
    rationale_ja: '汎用的なアプローチ。', rationale_en: 'General-purpose approach.',
    kw_ja: ['データ活用','段階開示','効率化','安定性'],
    kw_en: ['Data utilization','Progressive disclosure','Efficiency','Stability']
  }
};

// Mock CRITERIA_FRAMEWORK (P17 dependency)
global.CRITERIA_FRAMEWORK = [
  {key:'Context',weight:15},{key:'Role',weight:10},{key:'Instructions',weight:20},
  {key:'Thought Process',weight:10},{key:'Execution Rules',weight:15},{key:'Reflection',weight:10},
  {key:'Iteration',weight:10},{key:'Adaptation',weight:10}
];

// Mock AI_MATURITY_MODEL (P17 dependency)
global.AI_MATURITY_MODEL = [
  {lv:1,label_ja:'AI支援 (Assisted)',label_en:'AI Assisted'},
  {lv:2,label_ja:'AI協調 (Augmented)',label_en:'AI Augmented'},
  {lv:3,label_ja:'AI自律 (Autonomous)',label_en:'AI Autonomous'}
];

// Eval generator code — transform const/function declarations for eval compatibility
const evalCode = p18Code
  .replace(/var (REACT_PROTOCOL|LLMOPS_STACK|PROMPT_LIFECYCLE)/g, 'var $1')
  .replace(/function (_rp|_los)/g, 'var $1 = function');
eval(evalCode);

// ============================================================================
// DATA STRUCTURE TESTS
// ============================================================================

test('[P18] REACT_PROTOCOL: has 6 phases', () => {
  assert.ok(Array.isArray(REACT_PROTOCOL), 'REACT_PROTOCOL is an array');
  assert.strictEqual(REACT_PROTOCOL.length, 6, 'has exactly 6 phases');
  const ids = REACT_PROTOCOL.map(p => p.id);
  assert.ok(ids.includes('concept'), 'includes concept phase');
  assert.ok(ids.includes('design'), 'includes design phase');
  assert.ok(ids.includes('implement'), 'includes implement phase');
  assert.ok(ids.includes('test'), 'includes test phase');
  assert.ok(ids.includes('review'), 'includes review phase');
  assert.ok(ids.includes('deploy'), 'includes deploy phase');
});

test('[P18] REACT_PROTOCOL: each phase has 4 ReAct stages (reason/act/observe/verify)', () => {
  REACT_PROTOCOL.forEach(phase => {
    assert.ok(phase.reason, `${phase.id} has reason`);
    assert.ok(phase.act, `${phase.id} has act`);
    assert.ok(phase.observe, `${phase.id} has observe`);
    assert.ok(phase.verify, `${phase.id} has verify`);
  });
});

test('[P18] REACT_PROTOCOL: each phase has bilingual properties', () => {
  REACT_PROTOCOL.forEach(phase => {
    assert.ok(phase.name_ja && phase.name_ja.length > 0, `${phase.id} has name_ja`);
    assert.ok(phase.name_en && phase.name_en.length > 0, `${phase.id} has name_en`);
    assert.ok(phase.reason.ja && phase.reason.ja.length > 0, `${phase.id} reason has ja`);
    assert.ok(phase.reason.en && phase.reason.en.length > 0, `${phase.id} reason has en`);
    assert.ok(phase.act.ja && phase.act.ja.length > 0, `${phase.id} act has ja`);
    assert.ok(phase.act.en && phase.act.en.length > 0, `${phase.id} act has en`);
  });
});

test('[P18] LLMOPS_STACK: has 3 maturity levels', () => {
  assert.ok(Array.isArray(LLMOPS_STACK), 'LLMOPS_STACK is an array');
  assert.strictEqual(LLMOPS_STACK.length, 3, 'has exactly 3 levels');
  assert.strictEqual(LLMOPS_STACK[0].lv, 1, 'first level is 1');
  assert.strictEqual(LLMOPS_STACK[1].lv, 2, 'second level is 2');
  assert.strictEqual(LLMOPS_STACK[2].lv, 3, 'third level is 3');
});

test('[P18] LLMOPS_STACK: each level has bilingual tools/metrics/setup', () => {
  const requiredProps = ['lv','label_ja','label_en','tools_ja','tools_en','metrics_ja','metrics_en','setup_ja','setup_en'];
  LLMOPS_STACK.forEach(s => {
    requiredProps.forEach(prop => {
      assert.ok(s[prop] !== undefined, `Level ${s.lv} has ${prop}`);
      if (Array.isArray(s[prop])) {
        assert.ok(s[prop].length > 0, `Level ${s.lv}.${prop} is not empty`);
      } else if (typeof s[prop] === 'string') {
        assert.ok(s[prop].length > 0, `Level ${s.lv}.${prop} is not empty`);
      }
    });
  });
});

test('[P18] PROMPT_LIFECYCLE: has 5 stages', () => {
  assert.ok(Array.isArray(PROMPT_LIFECYCLE), 'PROMPT_LIFECYCLE is an array');
  assert.strictEqual(PROMPT_LIFECYCLE.length, 5, 'has exactly 5 stages');
  const ids = PROMPT_LIFECYCLE.map(s => s.id);
  assert.ok(ids.includes('draft'), 'includes draft');
  assert.ok(ids.includes('review'), 'includes review');
  assert.ok(ids.includes('test'), 'includes test');
  assert.ok(ids.includes('deploy'), 'includes deploy');
  assert.ok(ids.includes('monitor'), 'includes monitor');
});

test('[P18] PROMPT_LIFECYCLE: each stage has bilingual desc/check', () => {
  PROMPT_LIFECYCLE.forEach(s => {
    assert.ok(s.name_ja && s.name_ja.length > 0, `${s.id} has name_ja`);
    assert.ok(s.name_en && s.name_en.length > 0, `${s.id} has name_en`);
    assert.ok(s.desc_ja && s.desc_ja.length > 0, `${s.id} has desc_ja`);
    assert.ok(s.desc_en && s.desc_en.length > 0, `${s.id} has desc_en`);
    assert.ok(Array.isArray(s.check_ja) && s.check_ja.length >= 3, `${s.id} has check_ja array with ≥3 items`);
    assert.ok(Array.isArray(s.check_en) && s.check_en.length >= 3, `${s.id} has check_en array with ≥3 items`);
  });
});

// ============================================================================
// GENERATOR TESTS
// ============================================================================

test('[P18] genPillar18_PromptOps: generates 4 docs for education domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js', ai_auto: 'なし'};
  const pn = 'LMS Platform';

  genPillar18_PromptOps(answers, pn);

  assert.ok(S.files['docs/69_prompt_ops_pipeline.md'], 'generates docs/69');
  assert.ok(S.files['docs/70_react_workflow.md'], 'generates docs/70');
  assert.ok(S.files['docs/71_llmops_dashboard.md'], 'generates docs/71');
  assert.ok(S.files['docs/72_prompt_registry.md'], 'generates docs/72');
});

test('[P18] genPillar18_PromptOps: generates 4 docs for fintech domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: 'フィンテックアプリ', frontend: 'Next.js', backend: 'Django', ai_auto: 'マルチAgent協調'};
  const pn = 'FinApp';

  genPillar18_PromptOps(answers, pn);

  assert.ok(S.files['docs/69_prompt_ops_pipeline.md'], 'generates docs/69');
  assert.ok(S.files['docs/70_react_workflow.md'], 'generates docs/70');
  assert.ok(S.files['docs/71_llmops_dashboard.md'], 'generates docs/71');
  assert.ok(S.files['docs/72_prompt_registry.md'], 'generates docs/72');
});

test('[P18] genPillar18_PromptOps: English output generates 4 docs', () => {
  S.genLang = 'en';
  S.files = {};
  const answers = {purpose: 'SaaS platform', frontend: 'Vue', backend: 'Express', ai_auto: ''};
  const pn = 'SaaS App';

  genPillar18_PromptOps(answers, pn);

  assert.ok(S.files['docs/69_prompt_ops_pipeline.md'], 'generates docs/69');
  assert.ok(S.files['docs/70_react_workflow.md'], 'generates docs/70');
  assert.ok(S.files['docs/71_llmops_dashboard.md'], 'generates docs/71');
  assert.ok(S.files['docs/72_prompt_registry.md'], 'generates docs/72');

  const doc69 = S.files['docs/69_prompt_ops_pipeline.md'];
  assert.ok(doc69.includes('Prompt Ops Pipeline'), 'doc69 has English title');
  assert.ok(doc69.includes('Lifecycle'), 'doc69 has Lifecycle section');
});

test('[P18] doc69: contains Prompt Lifecycle and Pipeline content', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const doc69 = S.files['docs/69_prompt_ops_pipeline.md'];
  assert.ok(doc69.includes('Prompt Ops'), 'has title');
  assert.ok(doc69.includes('Prompt Lifecycle'), 'has lifecycle section');
  assert.ok(doc69.includes('バージョン制御'), 'has version control');
  assert.ok(doc69.includes('A/B'), 'has A/B test');
  assert.ok(doc69.includes('ロールバック'), 'has rollback section');
  assert.ok(doc69.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P18] doc70: contains ReAct protocol and self-debug loop', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const doc70 = S.files['docs/70_react_workflow.md'];
  assert.ok(doc70.includes('ReAct'), 'has ReAct in title');
  assert.ok(doc70.includes('Reason'), 'has Reason stage');
  assert.ok(doc70.includes('Act'), 'has Act stage');
  assert.ok(doc70.includes('Observe'), 'has Observe stage');
  assert.ok(doc70.includes('Verify'), 'has Verify stage');
  assert.ok(doc70.includes('自己デバッグ'), 'has self-debug loop');
  assert.ok(doc70.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P18] doc71: contains LLMOps metrics and maturity adaptation', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム', ai_auto: 'マルチAgent協調'}, 'TestProject');

  const doc71 = S.files['docs/71_llmops_dashboard.md'];
  assert.ok(doc71.includes('LLMOps'), 'has LLMOps title');
  assert.ok(doc71.includes('CRITERIA'), 'has CRITERIA reference (P17 integration)');
  assert.ok(doc71.includes('コスト最適化'), 'has cost optimization');
  assert.ok(doc71.includes('Level 2'), 'has Level 2 (maturity adaptation)');
  assert.ok(doc71.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P18] doc72: contains [META] structure and Template-ID', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const doc72 = S.files['docs/72_prompt_registry.md'];
  assert.ok(doc72.includes('[META]'), 'has [META] structure');
  assert.ok(doc72.includes('Template-ID'), 'has Template-ID');
  assert.ok(doc72.includes('バージョン履歴'), 'has version history');
  assert.ok(doc72.includes('CHANGELOG'), 'has changelog format');
  assert.ok(doc72.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P18] matLv selection changes LLMOPS_STACK in doc71', () => {
  // Level 1 (default)
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: 'SaaS', ai_auto: 'なし'}, 'Proj');
  assert.ok(S.files['docs/71_llmops_dashboard.md'].includes('Level 1'), 'Level 1 for なし');

  // Level 2 (マルチ)
  S.files = {};
  genPillar18_PromptOps({purpose: 'SaaS', ai_auto: 'マルチAgent協調'}, 'Proj');
  assert.ok(S.files['docs/71_llmops_dashboard.md'].includes('Level 2'), 'Level 2 for マルチ');

  // Level 3 (自律)
  S.files = {};
  genPillar18_PromptOps({purpose: 'SaaS', ai_auto: '完全自律'}, 'Proj');
  assert.ok(S.files['docs/71_llmops_dashboard.md'].includes('Level 3'), 'Level 3 for 自律');
});

test('[P18] Mermaid diagrams: valid syntax in all 4 docs', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const allDocs = [
    {name: 'doc69', content: S.files['docs/69_prompt_ops_pipeline.md']},
    {name: 'doc70', content: S.files['docs/70_react_workflow.md']},
    {name: 'doc71', content: S.files['docs/71_llmops_dashboard.md']},
    {name: 'doc72', content: S.files['docs/72_prompt_registry.md']}
  ];

  allDocs.forEach(({name, content}) => {
    if (!content) return;
    const mermaidBlocks = content.match(/```mermaid[\s\S]*?```/g);
    assert.ok(mermaidBlocks && mermaidBlocks.length > 0, `${name}: has at least one mermaid block`);
    if (mermaidBlocks) {
      mermaidBlocks.forEach(block => {
        assert.ok(/```mermaid\s*(graph|flowchart|gantt|sequenceDiagram|classDiagram)/i.test(block),
          `${name}: Mermaid block has valid diagram type`);
      });
    }
  });
});

test('[P18] No ${...} template literal contamination in output', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム', frontend: 'React', backend: 'Node.js'}, 'TestProject');

  Object.entries(S.files).forEach(([filePath, content]) => {
    if (!filePath.startsWith('docs/6') && !filePath.startsWith('docs/7')) return;
    const templateLiterals = content.match(/\$\{[^}]+\}/g);
    if (templateLiterals) {
      assert.fail(`${filePath} contains unexpected template literals: ${templateLiterals.join(', ')}`);
    }
  });
});

test('[P18] Domain-specific tool extension: fintech adds compliance_check', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: 'フィンテックアプリ', ai_auto: ''}, 'FinApp');

  const doc70 = S.files['docs/70_react_workflow.md'];
  assert.ok(doc70.includes('compliance_check'), 'fintech domain adds compliance_check tool');

  const doc69 = S.files['docs/69_prompt_ops_pipeline.md'];
  assert.ok(doc69.includes('規制') || doc69.includes('compliance') || doc69.includes('金融'), 'fintech adds regulatory check');
});

test('[P18] Domain-specific tool extension: health adds phi_scan', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '医療ヘルスケアアプリ', ai_auto: ''}, 'HealthApp');

  const doc70 = S.files['docs/70_react_workflow.md'];
  assert.ok(doc70.includes('phi_scan'), 'health domain adds phi_scan tool');
});

test('[P18] CRITERIA_FRAMEWORK reference: doc71 integrates P17 CRITERIA data', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const doc71 = S.files['docs/71_llmops_dashboard.md'];
  assert.ok(doc71.includes('Context'), 'doc71 references CRITERIA Context axis');
  assert.ok(doc71.includes('Instructions'), 'doc71 references CRITERIA Instructions axis');
  assert.ok(doc71.includes('Execution Rules'), 'doc71 references CRITERIA Execution Rules axis');
  assert.ok(doc71.includes('docs/65'), 'doc71 cross-references P17 doc65');
});

test('[P18] DEV_METHODOLOGY_MAP reference: P16 data used in gen69/gen72', () => {
  S.genLang = 'ja';
  S.files = {};
  genPillar18_PromptOps({purpose: '学習管理システム'}, 'TestProject');

  const doc69 = S.files['docs/69_prompt_ops_pipeline.md'];
  assert.ok(doc69.length > 500, 'doc69 has substantial content');

  const doc72 = S.files['docs/72_prompt_registry.md'];
  assert.ok(doc72.includes('education') || doc72.includes('EDU'), 'doc72 uses detected domain from DEV_METHODOLOGY_MAP');
});

test('[P18] All 4 docs generated for multiple domains', () => {
  const testCases = [
    {purpose: '学習管理システム', ai_auto: ''},
    {purpose: 'フィンテックアプリ', ai_auto: 'マルチAgent'},
    {purpose: 'SaaS tool', ai_auto: '自律オーケストレーション'}
  ];

  testCases.forEach(answers => {
    S.genLang = 'ja';
    S.files = {};
    genPillar18_PromptOps(answers, 'TestProject');

    assert.ok(S.files['docs/69_prompt_ops_pipeline.md'], `generates doc69 for ${answers.purpose}`);
    assert.ok(S.files['docs/70_react_workflow.md'], `generates doc70 for ${answers.purpose}`);
    assert.ok(S.files['docs/71_llmops_dashboard.md'], `generates doc71 for ${answers.purpose}`);
    assert.ok(S.files['docs/72_prompt_registry.md'], `generates doc72 for ${answers.purpose}`);
  });
});
