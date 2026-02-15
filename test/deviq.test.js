// test/deviq.test.js — P16 Polymorphic Development Intelligence tests

const {test} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read generator module
const p16Code = fs.readFileSync(path.join(__dirname, '../src/generators/p16-deviq.js'), 'utf8');

// Mock environment
global.S = {genLang: 'ja', files: {}};
global.detectDomain = (purpose) => {
  if (/学習|教育|LMS/.test(purpose)) return 'education';
  if (/EC|ショッピング/.test(purpose)) return 'ec';
  if (/金融|フィンテック/.test(purpose)) return 'fintech';
  if (/医療|ヘルスケア/.test(purpose)) return 'health';
  if (/SaaS/.test(purpose)) return 'saas';
  if (/マーケットプレイス/.test(purpose)) return 'marketplace';
  return 'saas';
};

// Eval generator code (convert const to var to make them global)
eval(p16Code.replace(/const (DEV_METHODOLOGY_MAP|PHASE_PROMPTS|INDUSTRY_STRATEGY|NEXT_GEN_UX|mapDomainToIndustry|gen60|gen61|gen62|gen63|genPillar16_DevIQ)/g, 'var $1'));

test('[P16] DEV_METHODOLOGY_MAP: has 32 domains + _default', () => {
  const domains = Object.keys(DEV_METHODOLOGY_MAP);
  assert.ok(domains.includes('education'), 'includes education');
  assert.ok(domains.includes('ec'), 'includes ec');
  assert.ok(domains.includes('fintech'), 'includes fintech');
  assert.ok(domains.includes('health'), 'includes health');
  assert.ok(domains.includes('saas'), 'includes saas');
  assert.ok(domains.includes('marketplace'), 'includes marketplace');
  assert.ok(domains.includes('community'), 'includes community');
  assert.ok(domains.includes('content'), 'includes content');
  assert.ok(domains.includes('analytics'), 'includes analytics');
  assert.ok(domains.includes('booking'), 'includes booking');
  assert.ok(domains.includes('iot'), 'includes iot');
  assert.ok(domains.includes('realestate'), 'includes realestate');
  assert.ok(domains.includes('legal'), 'includes legal');
  assert.ok(domains.includes('hr'), 'includes hr');
  assert.ok(domains.includes('portfolio'), 'includes portfolio');
  assert.ok(domains.includes('tool'), 'includes tool');
  assert.ok(domains.includes('ai'), 'includes ai');
  assert.ok(domains.includes('automation'), 'includes automation');
  assert.ok(domains.includes('event'), 'includes event');
  assert.ok(domains.includes('gamify'), 'includes gamify');
  assert.ok(domains.includes('collab'), 'includes collab');
  assert.ok(domains.includes('devtool'), 'includes devtool');
  assert.ok(domains.includes('creator'), 'includes creator');
  assert.ok(domains.includes('newsletter'), 'includes newsletter');
  assert.ok(domains.includes('manufacturing'), 'includes manufacturing');
  assert.ok(domains.includes('logistics'), 'includes logistics');
  assert.ok(domains.includes('agriculture'), 'includes agriculture');
  assert.ok(domains.includes('energy'), 'includes energy');
  assert.ok(domains.includes('media'), 'includes media');
  assert.ok(domains.includes('government'), 'includes government');
  assert.ok(domains.includes('travel'), 'includes travel');
  assert.ok(domains.includes('insurance'), 'includes insurance');
  assert.ok(domains.includes('_default'), 'includes _default');
  assert.strictEqual(domains.length, 33, 'exactly 33 entries (32 domains + _default)');
});

test('[P16] DEV_METHODOLOGY_MAP: each domain has bilingual 8 properties', () => {
  const requiredProps = ['primary_ja', 'primary_en', 'secondary_ja', 'secondary_en', 'rationale_ja', 'rationale_en', 'kw_ja', 'kw_en'];
  Object.entries(DEV_METHODOLOGY_MAP).forEach(([domain, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${domain} has ${prop}`);
      if (prop.endsWith('_ja') || prop.endsWith('_en')) {
        if (prop.startsWith('kw_')) {
          assert.ok(Array.isArray(data[prop]), `${domain}.${prop} is array`);
          assert.ok(data[prop].length >= 4, `${domain}.${prop} has at least 4 keywords`);
        } else {
          assert.strictEqual(typeof data[prop], 'string', `${domain}.${prop} is string`);
          assert.ok(data[prop].length > 0, `${domain}.${prop} is not empty`);
        }
      }
    });
  });
});

test('[P16] PHASE_PROMPTS: has 6 phases (p0-p5)', () => {
  const phases = Object.keys(PHASE_PROMPTS);
  assert.strictEqual(phases.length, 6, 'exactly 6 phases');
  assert.ok(phases.includes('p0'), 'includes p0');
  assert.ok(phases.includes('p1'), 'includes p1');
  assert.ok(phases.includes('p2'), 'includes p2');
  assert.ok(phases.includes('p3'), 'includes p3');
  assert.ok(phases.includes('p4'), 'includes p4');
  assert.ok(phases.includes('p5'), 'includes p5');
});

test('[P16] PHASE_PROMPTS: each phase has bilingual title and 3 templates', () => {
  Object.entries(PHASE_PROMPTS).forEach(([phaseKey, phase]) => {
    assert.ok(phase.title_ja, `${phaseKey} has title_ja`);
    assert.ok(phase.title_en, `${phaseKey} has title_en`);
    assert.ok(Array.isArray(phase.tpl), `${phaseKey} has tpl array`);
    assert.strictEqual(phase.tpl.length, 3, `${phaseKey} has exactly 3 templates`);

    phase.tpl.forEach((tpl, idx) => {
      assert.ok(tpl.id, `${phaseKey} template ${idx} has id`);
      assert.ok(tpl.label_ja, `${phaseKey} template ${idx} has label_ja`);
      assert.ok(tpl.label_en, `${phaseKey} template ${idx} has label_en`);
      assert.ok(tpl.prompt_ja, `${phaseKey} template ${idx} has prompt_ja`);
      assert.ok(tpl.prompt_en, `${phaseKey} template ${idx} has prompt_en`);
    });
  });
});

test('[P16] INDUSTRY_STRATEGY: has 15 industries', () => {
  const industries = Object.keys(INDUSTRY_STRATEGY);
  assert.strictEqual(industries.length, 15, 'exactly 15 industries');
  assert.ok(industries.includes('healthcare'), 'includes healthcare');
  assert.ok(industries.includes('finance'), 'includes finance');
  assert.ok(industries.includes('manufacturing'), 'includes manufacturing');
  assert.ok(industries.includes('education'), 'includes education');
  assert.ok(industries.includes('retail'), 'includes retail');
  assert.ok(industries.includes('realestate'), 'includes realestate');
  assert.ok(industries.includes('logistics'), 'includes logistics');
  assert.ok(industries.includes('agriculture'), 'includes agriculture');
  assert.ok(industries.includes('energy'), 'includes energy');
  assert.ok(industries.includes('media'), 'includes media');
  assert.ok(industries.includes('government'), 'includes government');
  assert.ok(industries.includes('travel'), 'includes travel');
  assert.ok(industries.includes('hr'), 'includes hr');
  assert.ok(industries.includes('legal'), 'includes legal');
  assert.ok(industries.includes('insurance'), 'includes insurance');
});

test('[P16] INDUSTRY_STRATEGY: each industry has bilingual 6 properties', () => {
  const requiredProps = ['regs_ja', 'regs_en', 'stack_ja', 'stack_en', 'pitfalls_ja', 'pitfalls_en'];
  Object.entries(INDUSTRY_STRATEGY).forEach(([industry, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${industry} has ${prop}`);
      if (prop.startsWith('regs_') || prop.startsWith('pitfalls_')) {
        assert.ok(Array.isArray(data[prop]), `${industry}.${prop} is array`);
        assert.ok(data[prop].length > 0, `${industry}.${prop} is not empty`);
      } else {
        assert.strictEqual(typeof data[prop], 'string', `${industry}.${prop} is string`);
        assert.ok(data[prop].length > 0, `${industry}.${prop} is not empty`);
      }
    });
  });
});

test('[P16] NEXT_GEN_UX: has 4 keywords', () => {
  const keywords = Object.keys(NEXT_GEN_UX);
  assert.strictEqual(keywords.length, 4, 'exactly 4 keywords');
  assert.ok(keywords.includes('agentic'), 'includes agentic');
  assert.ok(keywords.includes('generative_ui'), 'includes generative_ui');
  assert.ok(keywords.includes('spatial'), 'includes spatial');
  assert.ok(keywords.includes('calm'), 'includes calm');
});

test('[P16] NEXT_GEN_UX: each keyword has bilingual 6 properties', () => {
  const requiredProps = ['label_ja', 'label_en', 'desc_ja', 'desc_en', 'prompt_ja', 'prompt_en'];
  Object.entries(NEXT_GEN_UX).forEach(([keyword, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${keyword} has ${prop}`);
      assert.strictEqual(typeof data[prop], 'string', `${keyword}.${prop} is string`);
      assert.ok(data[prop].length > 0, `${keyword}.${prop} is not empty`);
    });
  });
});

test('[P16] genPillar16_DevIQ: generates 4 docs for education domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js', database: 'PostgreSQL'};
  const pn = 'LMS Platform';

  genPillar16_DevIQ(answers, pn);

  assert.ok(S.files['docs/60_methodology_intelligence.md'], 'generates docs/60');
  assert.ok(S.files['docs/61_ai_brainstorm_playbook.md'], 'generates docs/61');
  assert.ok(S.files['docs/62_industry_deep_dive.md'], 'generates docs/62');
  assert.ok(S.files['docs/63_next_gen_ux_strategy.md'], 'generates docs/63');
});

test('[P16] genPillar16_DevIQ: generates 4 docs for fintech domain (Japanese)', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: 'フィンテックアプリ', frontend: 'Next.js', backend: 'Django', database: 'MySQL'};
  const pn = 'FinApp';

  genPillar16_DevIQ(answers, pn);

  assert.ok(S.files['docs/60_methodology_intelligence.md'], 'generates docs/60');
  assert.ok(S.files['docs/61_ai_brainstorm_playbook.md'], 'generates docs/61');
  assert.ok(S.files['docs/62_industry_deep_dive.md'], 'generates docs/62');
  assert.ok(S.files['docs/63_next_gen_ux_strategy.md'], 'generates docs/63');
});

test('[P16] genPillar16_DevIQ: English output', () => {
  S.genLang = 'en';
  S.files = {};
  const answers = {purpose: 'e-commerce platform', frontend: 'Vue', backend: 'Express', database: 'MongoDB'};
  const pn = 'ECommerce Platform';

  genPillar16_DevIQ(answers, pn);

  assert.ok(S.files['docs/60_methodology_intelligence.md'], 'generates docs/60');
  assert.ok(S.files['docs/61_ai_brainstorm_playbook.md'], 'generates docs/61');
  assert.ok(S.files['docs/62_industry_deep_dive.md'], 'generates docs/62');
  assert.ok(S.files['docs/63_next_gen_ux_strategy.md'], 'generates docs/63');

  // Verify English content
  const doc60 = S.files['docs/60_methodology_intelligence.md'];
  assert.ok(doc60.includes('Methodology Intelligence'), 'doc60 has English title');
  assert.ok(doc60.includes('Optimal Methodology Selection'), 'doc60 has English section');
});

test('[P16] doc60: contains methodology intelligence content', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar16_DevIQ(answers, pn);

  const doc60 = S.files['docs/60_methodology_intelligence.md'];
  assert.ok(doc60.includes('開発手法インテリジェンス'), 'has title');
  assert.ok(doc60.includes('最適開発手法の選定'), 'has selection section');
  assert.ok(doc60.includes('第一選択'), 'has primary methodology');
  assert.ok(doc60.includes('第二選択'), 'has secondary methodology');
  assert.ok(doc60.includes('12設計アプローチ適合度評価'), 'has fit evaluation');
  assert.ok(doc60.includes('実装優先順位'), 'has priority section');
  assert.ok(doc60.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P16] doc61: contains AI brainstorm prompts', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js'};
  const pn = 'TestProject';

  genPillar16_DevIQ(answers, pn);

  const doc61 = S.files['docs/61_ai_brainstorm_playbook.md'];
  assert.ok(doc61.includes('AI壁打ちプロンプト・プレイブック'), 'has title');
  assert.ok(doc61.includes('Phase 0'), 'has Phase 0');
  assert.ok(doc61.includes('Phase 1'), 'has Phase 1');
  assert.ok(doc61.includes('Phase 2'), 'has Phase 2');
  assert.ok(doc61.includes('Phase 3'), 'has Phase 3');
  assert.ok(doc61.includes('Phase 4'), 'has Phase 4');
  assert.ok(doc61.includes('Phase 5'), 'has Phase 5');
  assert.ok(doc61.includes('プロジェクト固有の文脈を注入済み'), 'mentions context injection');
});

test('[P16] doc62: contains industry deep dive', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '医療アプリ'};
  const pn = 'HealthApp';

  genPillar16_DevIQ(answers, pn);

  const doc62 = S.files['docs/62_industry_deep_dive.md'];
  assert.ok(doc62.includes('業界特化ディープダイブ'), 'has title');
  assert.ok(doc62.includes('規制・コンプライアンス') || doc62.includes('主要規制'), 'has regulations section');
  // Healthcare should have industry strategy
  assert.ok(doc62.includes('HIPAA') || doc62.includes('医療'), 'has healthcare-specific content');
});

test('[P16] doc63: contains next-gen UX strategy', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar16_DevIQ(answers, pn);

  const doc63 = S.files['docs/63_next_gen_ux_strategy.md'];
  assert.ok(doc63.includes('次世代UX戦略'), 'has title');
  assert.ok(doc63.includes('Polymorphic Engine'), 'has Polymorphic Engine concept');
  assert.ok(doc63.includes('The Context Loop'), 'has Context Loop');
  assert.ok(doc63.includes('Sensing'), 'has Sensing stage');
  assert.ok(doc63.includes('Thinking'), 'has Thinking stage');
  assert.ok(doc63.includes('Morphing'), 'has Morphing stage');
  assert.ok(doc63.includes('Acting'), 'has Acting stage');
  assert.ok(doc63.includes('4つの次世代UXキーワード') || doc63.includes('エージェンティック'), 'has UX keywords');
  assert.ok(doc63.includes('```mermaid'), 'has Mermaid diagram');
});

test('[P16] Mermaid diagrams: valid syntax', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム'};
  const pn = 'TestProject';

  genPillar16_DevIQ(answers, pn);

  const allDocs = [
    S.files['docs/60_methodology_intelligence.md'],
    S.files['docs/62_industry_deep_dive.md'],
    S.files['docs/63_next_gen_ux_strategy.md']
  ];

  allDocs.forEach((doc, idx) => {
    if (!doc) return;
    const mermaidBlocks = doc.match(/```mermaid[\s\S]*?```/g);
    if (mermaidBlocks) {
      mermaidBlocks.forEach(block => {
        // Check no unclosed quotes
        const quoteCount = (block.match(/"/g) || []).length;
        assert.strictEqual(quoteCount % 2, 0, `doc ${idx}: Mermaid block has balanced quotes`);

        // Check valid diagram types
        assert.ok(/```mermaid\s*(graph|flowchart|gantt|sequenceDiagram|classDiagram)/i.test(block),
          `doc ${idx}: Mermaid block has valid diagram type`);
      });
    }
  });
});

test('[P16] No ${...} template literal contamination in output', () => {
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: '学習管理システム', frontend: 'React', backend: 'Node.js'};
  const pn = 'TestProject';

  genPillar16_DevIQ(answers, pn);

  Object.entries(S.files).forEach(([path, content]) => {
    if (!path.startsWith('docs/6')) return; // Only check P16 docs

    // Check for ${...} patterns (template literal leaks)
    const templateLiterals = content.match(/\$\{[^}]+\}/g);
    if (templateLiterals) {
      // Allow documented examples like {projectName}, {feature} in prompts
      const invalidLiterals = templateLiterals.filter(lit =>
        !content.includes('```') || // Outside code blocks
        !/{projectName}|{feature}|{domain}|{methodology}|{stack}|{screen}/.test(lit)
      );
      assert.strictEqual(invalidLiterals.length, 0,
        `${path} contains unexpected template literals: ${invalidLiterals.join(', ')}`);
    }
  });
});

test('[P16] mapDomainToIndustry: correct mappings', () => {
  assert.strictEqual(mapDomainToIndustry('health'), 'healthcare');
  assert.strictEqual(mapDomainToIndustry('fintech'), 'finance');
  assert.strictEqual(mapDomainToIndustry('manufacturing'), 'manufacturing');
  assert.strictEqual(mapDomainToIndustry('education'), 'education');
  assert.strictEqual(mapDomainToIndustry('ec'), 'retail');
  assert.strictEqual(mapDomainToIndustry('realestate'), 'realestate');
  assert.strictEqual(mapDomainToIndustry('logistics'), 'logistics');
  assert.strictEqual(mapDomainToIndustry('agriculture'), 'agriculture');
  assert.strictEqual(mapDomainToIndustry('energy'), 'energy');
  assert.strictEqual(mapDomainToIndustry('content'), 'media');
  assert.strictEqual(mapDomainToIndustry('media'), 'media');
  assert.strictEqual(mapDomainToIndustry('government'), 'government');
  assert.strictEqual(mapDomainToIndustry('travel'), 'travel');
  assert.strictEqual(mapDomainToIndustry('hr'), 'hr');
  assert.strictEqual(mapDomainToIndustry('legal'), 'legal');
  assert.strictEqual(mapDomainToIndustry('insurance'), 'insurance');
  // Unmapped domains should return null
  assert.strictEqual(mapDomainToIndustry('saas'), null);
  assert.strictEqual(mapDomainToIndustry('portfolio'), null);
});

test('[P16] Generated docs have consistent bilingual structure', () => {
  // Test Japanese
  S.genLang = 'ja';
  S.files = {};
  const answers = {purpose: 'EC', frontend: 'React'};
  const pn = 'ECサイト';
  genPillar16_DevIQ(answers, pn);
  const jaDoc60 = S.files['docs/60_methodology_intelligence.md'];

  // Test English
  S.genLang = 'en';
  S.files = {};
  const answersEn = {purpose: 'e-commerce', frontend: 'React'};
  const pnEn = 'EC Site';
  genPillar16_DevIQ(answersEn, pnEn);
  const enDoc60 = S.files['docs/60_methodology_intelligence.md'];

  // Both should have similar structure
  assert.ok(jaDoc60.includes('プロジェクト'), 'JA has project info');
  assert.ok(enDoc60.includes('Project'), 'EN has project info');

  assert.ok(jaDoc60.includes('ドメイン'), 'JA has domain');
  assert.ok(enDoc60.includes('Domain'), 'EN has domain');

  assert.ok(jaDoc60.includes('第一選択'), 'JA has primary selection');
  assert.ok(enDoc60.includes('Primary'), 'EN has primary selection');
});

test('[P16] All 4 docs generated for each domain category', () => {
  const testDomains = ['education', 'fintech', 'health', 'ec', 'saas'];
  const testPurposes = {
    education: '学習管理システム',
    fintech: 'フィンテックアプリ',
    health: '医療アプリ',
    ec: 'ECサイト',
    saas: 'SaaSツール'
  };

  testDomains.forEach(domain => {
    S.genLang = 'ja';
    S.files = {};
    const answers = {purpose: testPurposes[domain]};
    const pn = 'TestProject_' + domain;

    genPillar16_DevIQ(answers, pn);

    assert.ok(S.files['docs/60_methodology_intelligence.md'], `${domain}: generates doc60`);
    assert.ok(S.files['docs/61_ai_brainstorm_playbook.md'], `${domain}: generates doc61`);
    assert.ok(S.files['docs/62_industry_deep_dive.md'], `${domain}: generates doc62`);
    assert.ok(S.files['docs/63_next_gen_ux_strategy.md'], `${domain}: generates doc63`);

    // Verify domain is mentioned
    const doc60 = S.files['docs/60_methodology_intelligence.md'];
    assert.ok(doc60.includes(domain), `${domain}: domain mentioned in doc60`);
  });
});
