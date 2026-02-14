// test/future.test.js — P15 Future Strategy Intelligence tests

const {test} = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Read generator module
const p15Code = fs.readFileSync(path.join(__dirname, '../src/generators/p15-future.js'), 'utf8');

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
eval(p15Code.replace(/const (DOMAIN_MARKET|PERSONA_ARCHETYPES|GTM_STRATEGY|REGULATORY_HORIZON)/g, 'var $1'));

test('[P15] DOMAIN_MARKET: has 24 domains + _default', () => {
  const domains = Object.keys(DOMAIN_MARKET);
  assert.ok(domains.includes('education'), 'includes education');
  assert.ok(domains.includes('ec'), 'includes ec');
  assert.ok(domains.includes('fintech'), 'includes fintech');
  assert.ok(domains.includes('health'), 'includes health');
  assert.ok(domains.includes('saas'), 'includes saas');
  assert.ok(domains.includes('marketplace'), 'includes marketplace');
  assert.ok(domains.includes('community'), 'includes community');
  assert.ok(domains.includes('content'), 'includes content');
  assert.ok(domains.includes('booking'), 'includes booking');
  assert.ok(domains.includes('iot'), 'includes iot');
  assert.ok(domains.includes('realestate'), 'includes realestate');
  assert.ok(domains.includes('legal'), 'includes legal');
  assert.ok(domains.includes('hr'), 'includes hr');
  assert.ok(domains.includes('analytics'), 'includes analytics');
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
  assert.ok(domains.includes('_default'), 'includes _default');
  assert.strictEqual(domains.length, 25, 'exactly 25 entries (24 domains + _default)');
});

test('[P15] DOMAIN_MARKET: each domain has bilingual 6 properties', () => {
  const requiredProps = ['moat_ja', 'moat_en', 'gtm_ja', 'gtm_en', 'ux_ja', 'ux_en', 'eco_ja', 'eco_en', 'reg_ja', 'reg_en', 'esg_ja', 'esg_en'];
  Object.entries(DOMAIN_MARKET).forEach(([domain, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${domain} has ${prop}`);
      assert.strictEqual(typeof data[prop], 'string', `${domain}.${prop} is string`);
      assert.ok(data[prop].length > 0, `${domain}.${prop} is not empty`);
    });
  });
});

test('[P15] PERSONA_ARCHETYPES: has 24 domains + _default', () => {
  const domains = Object.keys(PERSONA_ARCHETYPES);
  assert.strictEqual(domains.length, 25, 'exactly 25 entries (24 domains + _default)');
  assert.ok(domains.includes('education'), 'includes education');
  assert.ok(domains.includes('fintech'), 'includes fintech');
  assert.ok(domains.includes('_default'), 'includes _default');
});

test('[P15] PERSONA_ARCHETYPES: each domain has bilingual 3 personas', () => {
  const requiredProps = ['primary_ja', 'primary_en', 'secondary_ja', 'secondary_en', 'edge_ja', 'edge_en'];
  Object.entries(PERSONA_ARCHETYPES).forEach(([domain, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${domain} has ${prop}`);
      assert.strictEqual(typeof data[prop], 'string', `${domain}.${prop} is string`);
      assert.ok(data[prop].length > 0, `${domain}.${prop} is not empty`);
    });
  });
});

test('[P15] GTM_STRATEGY: has 4 stakeholder types', () => {
  const types = Object.keys(GTM_STRATEGY);
  assert.strictEqual(types.length, 4, 'exactly 4 stakeholder types');
  assert.ok(types.includes('startup'), 'includes startup');
  assert.ok(types.includes('enterprise'), 'includes enterprise');
  assert.ok(types.includes('developer'), 'includes developer');
  assert.ok(types.includes('team'), 'includes team');
});

test('[P15] GTM_STRATEGY: each type has bilingual model/channel/cac_ltv', () => {
  const requiredProps = ['model_ja', 'model_en', 'channel_ja', 'channel_en', 'cac_ltv_ja', 'cac_ltv_en'];
  Object.entries(GTM_STRATEGY).forEach(([type, data]) => {
    requiredProps.forEach(prop => {
      assert.ok(data[prop], `${type} has ${prop}`);
      assert.strictEqual(typeof data[prop], 'string', `${type}.${prop} is string`);
      assert.ok(data[prop].length > 0, `${type}.${prop} is not empty`);
    });
  });
});

test('[P15] REGULATORY_HORIZON: has timeline and AI Act risk classification', () => {
  assert.ok(REGULATORY_HORIZON.timeline_ja, 'has timeline_ja');
  assert.ok(REGULATORY_HORIZON.timeline_en, 'has timeline_en');
  assert.ok(Array.isArray(REGULATORY_HORIZON.timeline_ja), 'timeline_ja is array');
  assert.ok(Array.isArray(REGULATORY_HORIZON.timeline_en), 'timeline_en is array');
  assert.ok(REGULATORY_HORIZON.timeline_ja.length >= 5, 'timeline_ja has >= 5 entries');
  assert.ok(REGULATORY_HORIZON.timeline_en.length >= 5, 'timeline_en has >= 5 entries');

  assert.ok(REGULATORY_HORIZON.ai_act_risk_ja, 'has ai_act_risk_ja');
  assert.ok(REGULATORY_HORIZON.ai_act_risk_en, 'has ai_act_risk_en');
  assert.ok(REGULATORY_HORIZON.ai_act_risk_ja.high, 'ai_act_risk_ja has high');
  assert.ok(REGULATORY_HORIZON.ai_act_risk_ja.limited, 'ai_act_risk_ja has limited');
  assert.ok(REGULATORY_HORIZON.ai_act_risk_ja.minimal, 'ai_act_risk_ja has minimal');

  assert.ok(REGULATORY_HORIZON.data_sovereignty_ja, 'has data_sovereignty_ja');
  assert.ok(REGULATORY_HORIZON.data_sovereignty_en, 'has data_sovereignty_en');
  assert.ok(Array.isArray(REGULATORY_HORIZON.data_sovereignty_ja), 'data_sovereignty_ja is array');
  assert.ok(Array.isArray(REGULATORY_HORIZON.data_sovereignty_en), 'data_sovereignty_en is array');
});

test('[P15] genPillar15: generates 4 documents for education domain', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {
    purpose: '大学向けLMS',
    stakeholder: 'startup',
    architecture: 'baas',
    deployment: 'vercel',
    ai_auto: 'none'
  };
  genPillar15(answers);

  assert.ok(S.files['docs/56_market_positioning.md'], 'generates 56_market_positioning.md');
  assert.ok(S.files['docs/57_user_experience_strategy.md'], 'generates 57_user_experience_strategy.md');
  assert.ok(S.files['docs/58_ecosystem_strategy.md'], 'generates 58_ecosystem_strategy.md');
  assert.ok(S.files['docs/59_regulatory_foresight.md'], 'generates 59_regulatory_foresight.md');

  const doc56 = S.files['docs/56_market_positioning.md'];
  assert.ok(doc56.includes('市場ポジショニング'), 'doc56 has title');
  assert.ok(doc56.includes('education'), 'doc56 includes domain');
  assert.ok(doc56.includes('MOAT'), 'doc56 has MOAT section');
  assert.ok(doc56.includes('PLG'), 'doc56 has GTM strategy');
  assert.ok(doc56.includes('```mermaid'), 'doc56 has mermaid diagram');

  const doc57 = S.files['docs/57_user_experience_strategy.md'];
  assert.ok(doc57.includes('ユーザー体験'), 'doc57 has title');
  assert.ok(doc57.includes('ペルソナ'), 'doc57 has persona section');
  assert.ok(doc57.includes('ジャーニー'), 'doc57 has journey section');
  assert.ok(doc57.includes('```mermaid'), 'doc57 has mermaid diagram');

  const doc58 = S.files['docs/58_ecosystem_strategy.md'];
  assert.ok(doc58.includes('エコシステム'), 'doc58 has title');
  assert.ok(doc58.includes('API'), 'doc58 has API section');
  assert.ok(doc58.includes('DX'), 'doc58 has DX section');
  assert.ok(doc58.includes('FinOps'), 'doc58 has FinOps section');
  assert.ok(doc58.includes('```mermaid'), 'doc58 has mermaid diagram');

  const doc59 = S.files['docs/59_regulatory_foresight.md'];
  assert.ok(doc59.includes('規制フォーサイト'), 'doc59 has title');
  assert.ok(doc59.includes('2026'), 'doc59 has timeline');
  assert.ok(doc59.includes('EU AI Act'), 'doc59 has AI Act section');
  assert.ok(doc59.includes('ESG'), 'doc59 has ESG section');
  assert.ok(doc59.includes('```mermaid'), 'doc59 has mermaid diagram');
});

test('[P15] genPillar15: generates English docs when genLang=en', () => {
  global.S = {genLang: 'en', files: {}};
  const answers = {
    purpose: 'University LMS',
    stakeholder: 'enterprise',
    architecture: 'traditional',
    deployment: 'aws'
  };
  genPillar15(answers);

  const doc56 = S.files['docs/56_market_positioning.md'];
  assert.ok(doc56.includes('Market Positioning'), 'doc56 has English title');
  assert.ok(doc56.includes('MOAT'), 'doc56 has MOAT section');
  assert.ok(!doc56.includes('市場'), 'doc56 does not have Japanese');

  const doc57 = S.files['docs/57_user_experience_strategy.md'];
  assert.ok(doc57.includes('User Experience'), 'doc57 has English title');
  assert.ok(doc57.includes('Persona'), 'doc57 has persona section');

  const doc58 = S.files['docs/58_ecosystem_strategy.md'];
  assert.ok(doc58.includes('Ecosystem'), 'doc58 has English title');

  const doc59 = S.files['docs/59_regulatory_foresight.md'];
  assert.ok(doc59.includes('Regulatory Foresight'), 'doc59 has English title');
});

test('[P15] genPillar15: adapts to fintech domain', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {
    purpose: 'フィンテック決済アプリ',
    stakeholder: 'enterprise',
    architecture: 'baas',
    deployment: 'aws',
    ai_auto: 'full'
  };
  genPillar15(answers);

  const doc56 = S.files['docs/56_market_positioning.md'];
  assert.ok(doc56.includes('fintech') || doc56.includes('金融'), 'doc56 mentions fintech');

  const doc59 = S.files['docs/59_regulatory_foresight.md'];
  assert.ok(doc59.includes('高リスク') || doc59.includes('High-Risk'), 'doc59 classifies AI as high-risk for fintech');
  assert.ok(doc59.includes('DORA') || doc59.includes('金融商品取引法'), 'doc59 mentions fintech regulations');
});

test('[P15] doc56 Market: includes TAM/SAM/SOM', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: 'EC', stakeholder: 'startup', architecture: 'baas', deployment: 'vercel'};
  genPillar15(answers);
  const doc = S.files['docs/56_market_positioning.md'];
  assert.ok(doc.includes('TAM'), 'includes TAM');
  assert.ok(doc.includes('SWOT'), 'includes SWOT');
  assert.ok(doc.includes('ユニットエコノミクス') || doc.includes('Unit Economics'), 'includes unit economics');
});

test('[P15] doc57 UX: includes Time-to-Value goals', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: 'SaaS', stakeholder: 'team', architecture: 'baas', deployment: 'vercel'};
  genPillar15(answers);
  const doc = S.files['docs/57_user_experience_strategy.md'];
  assert.ok(doc.includes('Time-to-Value'), 'includes Time-to-Value');
  assert.ok(doc.includes('WCAG'), 'includes accessibility');
  assert.ok(doc.includes('ダークパターン') || doc.includes('Dark Pattern'), 'includes dark pattern avoidance');
  assert.ok(doc.includes('RICE'), 'includes RICE prioritization');
});

test('[P15] doc58 Ecosystem: adapts FinOps to deployment', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: 'Analytics', stakeholder: 'developer', architecture: 'baas', deployment: 'cloudflare'};
  genPillar15(answers);
  const doc = S.files['docs/58_ecosystem_strategy.md'];
  assert.ok(doc.includes('Cloudflare'), 'mentions Cloudflare');
  assert.ok(doc.includes('FinOps'), 'includes FinOps section');
  assert.ok(doc.includes('API'), 'includes API strategy');
});

test('[P15] doc59 Regulatory: timeline has 2026-2030 entries', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: 'Health', stakeholder: 'enterprise', architecture: 'traditional', deployment: 'aws', ai_auto: 'full'};
  genPillar15(answers);
  const doc = S.files['docs/59_regulatory_foresight.md'];
  assert.ok(doc.includes('2026') && doc.includes('2030'), 'includes 2026-2030 timeline');
  assert.ok(doc.includes('EU AI Act'), 'mentions EU AI Act');
  assert.ok(doc.includes('ESG'), 'includes ESG section');
  assert.ok(doc.includes('カーボン') || doc.includes('Carbon'), 'mentions carbon footprint');
});

test('[P15] All mermaid diagrams are syntactically valid', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: 'Marketplace', stakeholder: 'startup', architecture: 'baas', deployment: 'vercel'};
  genPillar15(answers);

  Object.entries(S.files).forEach(([path, content]) => {
    const mermaidBlocks = content.match(/```mermaid\n([\s\S]*?)```/g);
    if (mermaidBlocks) {
      mermaidBlocks.forEach(block => {
        assert.ok(block.includes('```mermaid'), 'has opening fence');
        assert.ok(block.includes('```\n') || block.endsWith('```'), 'has closing fence');
        const inner = block.replace(/```mermaid\n|```/g, '').trim();
        assert.ok(inner.length > 0, 'mermaid block is not empty');
      });
    }
  });
});

test('[P15] No ${...} template literals in Japanese content', () => {
  global.S = {genLang: 'ja', files: {}};
  const answers = {purpose: '教育', stakeholder: 'startup', architecture: 'baas', deployment: 'vercel'};
  genPillar15(answers);

  Object.values(S.files).forEach(content => {
    // Check for ${...} outside of code blocks
    const nonCodeContent = content.replace(/```[\s\S]*?```/g, '');
    const hasTemplateLiteral = /\$\{[^}]+\}/.test(nonCodeContent);
    assert.ok(!hasTemplateLiteral, 'No unescaped ${} in Japanese content');
  });
});
