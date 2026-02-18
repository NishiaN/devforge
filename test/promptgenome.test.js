// test/promptgenome.test.js — P17 Prompt Genome Engine tests

const {test} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read generator module
const p17Code = fs.readFileSync(path.join(__dirname, '../src/generators/p17-promptgenome.js'), 'utf8');

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

// Mock DEV_METHODOLOGY_MAP (a subset from P16, needed because P17 references it)
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

// Eval generator code
eval(p17Code.replace(/const (CRITERIA_FRAMEWORK|AI_MATURITY_MODEL|_APPROACHES|_SYNERGY_RAW|APPROACH_KPI|getSynergy|gen65|gen66|gen67|gen68|genPillar17_PromptGenome)/g, 'var $1').replace(/function (_cri|_mat)/g, 'var $1 = function'));

test('[P17] CRITERIA_FRAMEWORK: has 8 axes', () => {
  assert.ok(Array.isArray(CRITERIA_FRAMEWORK), 'CRITERIA_FRAMEWORK is an array');
  assert.strictEqual(CRITERIA_FRAMEWORK.length, 8, 'has exactly 8 axes');
  const keys = CRITERIA_FRAMEWORK.map(c => c.key);
  assert.ok(keys.includes('Context'), 'includes Context');
  assert.ok(keys.includes('Role'), 'includes Role');
  assert.ok(keys.includes('Instructions'), 'includes Instructions');
  assert.ok(keys.includes('Thought Process'), 'includes Thought Process');
  assert.ok(keys.includes('Execution Rules'), 'includes Execution Rules');
  assert.ok(keys.includes('Reflection'), 'includes Reflection');
  assert.ok(keys.includes('Iteration'), 'includes Iteration');
  assert.ok(keys.includes('Adaptation'), 'includes Adaptation');
});

test('[P17] CRITERIA_FRAMEWORK: weight sum equals 100', () => {
  const totalWeight = CRITERIA_FRAMEWORK.reduce((sum, c) => sum + c.weight, 0);
  assert.strictEqual(totalWeight, 100, `Weight sum should be 100, got ${totalWeight}`);
});

test('[P17] CRITERIA_FRAMEWORK: each axis has bilingual properties', () => {
  const requiredProps = ['key', 'weight', 'rubric_ja', 'rubric_en', 'guide_ja', 'guide_en'];
  CRITERIA_FRAMEWORK.forEach(c => {
    requiredProps.forEach(prop => {
      assert.ok(c[prop] !== undefined, `${c.key} has ${prop}`);
      if (typeof c[prop] === 'string') {
        assert.ok(c[prop].length > 0, `${c.key}.${prop} is not empty`);
      }
    });
  });
});

test('[P17] AI_MATURITY_MODEL: has 3 levels', () => {
  assert.ok(Array.isArray(AI_MATURITY_MODEL), 'AI_MATURITY_MODEL is an array');
  assert.strictEqual(AI_MATURITY_MODEL.length, 3, 'has exactly 3 levels');
  assert.strictEqual(AI_MATURITY_MODEL[0].lv, 1, 'first level is 1');
  assert.strictEqual(AI_MATURITY_MODEL[1].lv, 2, 'second level is 2');
  assert.strictEqual(AI_MATURITY_MODEL[2].lv, 3, 'third level is 3');
});

test('[P17] AI_MATURITY_MODEL: each level has bilingual 8 properties', () => {
  const requiredProps = ['lv', 'label_ja', 'label_en', 'chars_ja', 'chars_en', 'pats_ja', 'pats_en', 'prac_ja', 'prac_en'];
  AI_MATURITY_MODEL.forEach(mat => {
    requiredProps.forEach(prop => {
      assert.ok(mat[prop] !== undefined, `Level ${mat.lv} has ${prop}`);
      if (typeof mat[prop] === 'string') {
        assert.ok(mat[prop].length > 0, `Level ${mat.lv}.${prop} is not empty`);
      }
    });
  });
});

test('[P17] _APPROACHES: has 12 entries', () => {
  assert.ok(Array.isArray(_APPROACHES), '_APPROACHES is an array');
  assert.strictEqual(_APPROACHES.length, 12, 'has exactly 12 approaches');
  _APPROACHES.forEach(ap => {
    assert.ok(ap.id, 'has id');
    assert.ok(ap.ja, 'has ja');
    assert.ok(ap.en, 'has en');
  });
});

test('[P17] getSynergy: same index returns 5', () => {
  for (let i = 0; i < 12; i++) {
    assert.strictEqual(getSynergy(i, i), 5, `getSynergy(${i}, ${i}) should be 5`);
  }
});

test('[P17] getSynergy: symmetric (i,j) === (j,i)', () => {
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      assert.strictEqual(getSynergy(i, j), getSynergy(j, i), `getSynergy(${i},${j}) should equal getSynergy(${j},${i})`);
    }
  }
});

test('[P17] getSynergy: all values in range 1-5', () => {
  for (let i = 0; i < 12; i++) {
    for (let j = 0; j < 12; j++) {
      const s = getSynergy(i, j);
      assert.ok(s >= 1 && s <= 5, `getSynergy(${i},${j})=${s} should be 1-5`);
    }
  }
});

test('[P17] APPROACH_KPI: covers all 12 approaches', () => {
  const kpiKeys = Object.keys(APPROACH_KPI);
  assert.strictEqual(kpiKeys.length, 12, 'has exactly 12 KPI entries');
  const approachIds = _APPROACHES.map(ap => ap.id);
  approachIds.forEach(id => {
    assert.ok(APPROACH_KPI[id], `APPROACH_KPI has entry for ${id}`);
  });
});

test('[P17] APPROACH_KPI: each entry has bilingual metrics and tools', () => {
  Object.entries(APPROACH_KPI).forEach(([key, kpi]) => {
    assert.ok(Array.isArray(kpi.metrics_ja), `${key} has metrics_ja array`);
    assert.ok(Array.isArray(kpi.metrics_en), `${key} has metrics_en array`);
    assert.strictEqual(kpi.metrics_ja.length, 4, `${key} has 4 ja metrics`);
    assert.strictEqual(kpi.metrics_en.length, 4, `${key} has 4 en metrics`);
    assert.ok(kpi.tools_ja, `${key} has tools_ja`);
    assert.ok(kpi.tools_en, `${key} has tools_en`);
  });
});

test('[P17] genPillar17_PromptGenome: generates 4 docs for education domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js', ai_auto: 'なし'};
  const pn = 'LMS Platform';

  genPillar17_PromptGenome(answers, pn);

  assert.ok(S.files['docs/65_prompt_genome.md'], 'generates docs/65');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'], 'generates docs/66');
  assert.ok(S.files['docs/67_prompt_composition_guide.md'], 'generates docs/67');
  assert.ok(S.files['docs/68_prompt_kpi_dashboard.md'], 'generates docs/68');
});

test('[P17] genPillar17_PromptGenome: generates 4 docs for fintech domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: 'フィンテックアプリ', frontend: 'Next.js', backend: 'Django', ai_auto: 'マルチAgent協調'};
  const pn = 'FinApp';

  genPillar17_PromptGenome(answers, pn);

  assert.ok(S.files['docs/65_prompt_genome.md'], 'generates docs/65');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'], 'generates docs/66');
  assert.ok(S.files['docs/67_prompt_composition_guide.md'], 'generates docs/67');
  assert.ok(S.files['docs/68_prompt_kpi_dashboard.md'], 'generates docs/68');
});

test('[P17] genPillar17_PromptGenome: English output generates 4 docs', () => {
  S.genLang = 'en';
  S.files = {};
  const answers = {purpose: 'SaaS platform', frontend: 'Vue', backend: 'Express', ai_auto: ''};
  const pn = 'SaaS App';

  genPillar17_PromptGenome(answers, pn);

  assert.ok(S.files['docs/65_prompt_genome.md'], 'generates docs/65');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'], 'generates docs/66');
  assert.ok(S.files['docs/67_prompt_composition_guide.md'], 'generates docs/67');
  assert.ok(S.files['docs/68_prompt_kpi_dashboard.md'], 'generates docs/68');

  const doc65 = S.files['docs/65_prompt_genome.md'];
  assert.ok(doc65.includes('Prompt Genome'), 'doc65 has English title');
  assert.ok(doc65.includes('CRITERIA'), 'doc65 has CRITERIA section');
  assert.ok(doc65.includes('Prompt DNA Profile'), 'doc65 has DNA Profile section');
});

test('[P17] doc65: contains CRITERIA table and DNA profile', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  const doc65 = S.files['docs/65_prompt_genome.md'];
  assert.ok(doc65.includes('プロンプトゲノム'), 'has title');
  assert.ok(doc65.includes('プロンプトDNAプロファイル'), 'has DNA profile');
  assert.ok(doc65.includes('CRITERIA 8軸品質スコアリング'), 'has CRITERIA table');
  assert.ok(doc65.includes('フェーズ別プロンプトライブラリ'), 'has phase prompt library');
  assert.ok(doc65.includes('Context'), 'has Context axis');
  assert.ok(doc65.includes('Instructions'), 'has Instructions axis');
  assert.ok(doc65.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P17] doc66: contains maturity assessment content', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', ai_auto: ''};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  const doc66 = S.files['docs/66_ai_maturity_assessment.md'];
  assert.ok(doc66.includes('AI成熟度アセスメント'), 'has title');
  assert.ok(doc66.includes('現在の成熟度レベル'), 'has current level section');
  assert.ok(doc66.includes('5次元評価マトリクス'), 'has 5-dimension matrix');
  assert.ok(doc66.includes('段階的採用ロードマップ'), 'has roadmap section');
  assert.ok(doc66.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P17] doc67: contains synergy matrix and 4-layer architecture', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  const doc67 = S.files['docs/67_prompt_composition_guide.md'];
  assert.ok(doc67.includes('プロンプト合成ガイド'), 'has title');
  assert.ok(doc67.includes('12×12 シナジーマトリクス'), 'has synergy matrix');
  assert.ok(doc67.includes('4層テンプレートアーキテクチャ'), 'has 4-layer architecture');
  assert.ok(doc67.includes('Layer 1'), 'has Layer 1');
  assert.ok(doc67.includes('Layer 2'), 'has Layer 2');
  assert.ok(doc67.includes('Layer 3'), 'has Layer 3');
  assert.ok(doc67.includes('Layer 4'), 'has Layer 4');
  assert.ok(doc67.includes('複合プロンプトパターン'), 'has composite prompt patterns');
});

test('[P17] doc68: contains KPI dashboard content', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  const doc68 = S.files['docs/68_prompt_kpi_dashboard.md'];
  assert.ok(doc68.includes('プロンプトKPIダッシュボード'), 'has title');
  assert.ok(doc68.includes('アプローチ別KPIマトリクス'), 'has KPI matrix');
  assert.ok(doc68.includes('測定計画'), 'has measurement plan');
  assert.ok(doc68.includes('AI効果測定指標'), 'has AI effectiveness metrics');
  assert.ok(doc68.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P17] Maturity level: correctly inferred from ai_auto answer', () => {
  // Level 1 (default)
  S.genLang = 'ja';
  S.files = {};
  genPillar17_PromptGenome({purpose: 'SaaS', ai_auto: 'なし'}, 'Proj');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'].includes('Level 1'), 'Level 1 for なし');

  // Level 2 (マルチ)
  S.files = {};
  genPillar17_PromptGenome({purpose: 'SaaS', ai_auto: 'マルチAgent協調'}, 'Proj');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'].includes('Level 2'), 'Level 2 for マルチ');

  // Level 3 (自律)
  S.files = {};
  genPillar17_PromptGenome({purpose: 'SaaS', ai_auto: '完全自律'}, 'Proj');
  assert.ok(S.files['docs/66_ai_maturity_assessment.md'].includes('Level 3'), 'Level 3 for 自律');
});

test('[P17] Mermaid diagrams: valid syntax', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  const allDocs = [
    S.files['docs/65_prompt_genome.md'],
    S.files['docs/66_ai_maturity_assessment.md'],
    S.files['docs/68_prompt_kpi_dashboard.md']
  ];

  allDocs.forEach((doc, idx) => {
    if (!doc) return;
    const mermaidBlocks = doc.match(/```mermaid[\s\S]*?```/g);
    if (mermaidBlocks) {
      mermaidBlocks.forEach(block => {
        const quoteCount = (block.match(/"/g) || []).length;
        assert.strictEqual(quoteCount % 2, 0, `doc ${idx}: Mermaid block has balanced quotes`);
        assert.ok(/```mermaid\s*(graph|flowchart|gantt|sequenceDiagram|classDiagram)/i.test(block),
          `doc ${idx}: Mermaid block has valid diagram type`);
      });
    }
  });
});

test('[P17] No ${...} template literal contamination in output', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js'};
  const pn = 'TestProject';

  genPillar17_PromptGenome(answers, pn);

  Object.entries(S.files).forEach(([filePath, content]) => {
    if (!filePath.startsWith('docs/6')) return; // Only check P17 docs
    const templateLiterals = content.match(/\$\{[^}]+\}/g);
    if (templateLiterals) {
      assert.fail(`${filePath} contains unexpected template literals: ${templateLiterals.join(', ')}`);
    }
  });
});

test('[P17] All 4 docs generated for multiple domains', () => {
  const testCases = [
    {purpose: '学習管理システム', ai_auto: ''},
    {purpose: 'フィンテックアプリ', ai_auto: 'マルチAgent'},
    {purpose: 'SaaS tool', ai_auto: '自律オーケストレーション'}
  ];

  testCases.forEach(answers => {
    S.genLang = 'ja';
    S.files = {};
    genPillar17_PromptGenome(answers, 'TestProject');

    assert.ok(S.files['docs/65_prompt_genome.md'], `generates doc65 for ${answers.purpose}`);
    assert.ok(S.files['docs/66_ai_maturity_assessment.md'], `generates doc66 for ${answers.purpose}`);
    assert.ok(S.files['docs/67_prompt_composition_guide.md'], `generates doc67 for ${answers.purpose}`);
    assert.ok(S.files['docs/68_prompt_kpi_dashboard.md'], `generates doc68 for ${answers.purpose}`);
  });
});
