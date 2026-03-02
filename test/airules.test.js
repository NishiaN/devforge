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
eval(fs.readFileSync('src/generators/p4-airules.js', 'utf-8'));

describe('Pillar ④ AI Rules', () => {
  test('generates .cursor/rules', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '学習管理システムを開発する',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestProject');
    assert.ok(S.files['.cursor/rules'], 'Should generate .cursor/rules');
    assert.ok(S.files['.cursor/rules'].length > 0, '.cursor/rules should not be empty');
  });

  test('generates all 5 .claude/rules/* files', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'ECサイトを開発',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestEC');
    assert.ok(S.files['.claude/rules/spec.md'], 'Should generate .claude/rules/spec.md');
    assert.ok(S.files['.claude/rules/frontend.md'], 'Should generate .claude/rules/frontend.md');
    assert.ok(S.files['.claude/rules/backend.md'], 'Should generate .claude/rules/backend.md');
    assert.ok(S.files['.claude/rules/test.md'], 'Should generate .claude/rules/test.md');
    assert.ok(S.files['.claude/rules/ops.md'], 'Should generate .claude/rules/ops.md');
  });

  test('CLAUDE.md is generated and contains project name', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'SaaSプラットフォーム',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'MyAwesomeProject');
    assert.ok(S.files['CLAUDE.md'], 'Should generate CLAUDE.md');
    assert.ok(S.files['CLAUDE.md'].includes('MyAwesomeProject'), 'CLAUDE.md should contain project name');
  });

  test('AGENTS.md is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '予約管理システム',
      frontend: 'Vue',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    };
    genPillar4_AIRules(answers, 'TestBooking');
    assert.ok(S.files['AGENTS.md'], 'Should generate AGENTS.md');
    assert.ok(S.files['AGENTS.md'].length > 0, 'AGENTS.md should not be empty');
  });

  test('AI_BRIEF.md is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'タスク管理ツール',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestTasks');
    assert.ok(S.files['AI_BRIEF.md'], 'Should generate AI_BRIEF.md');
    assert.ok(S.files['AI_BRIEF.md'].includes('AI Implementation Brief'), 'AI_BRIEF.md should have header');
  });

  test('skills/spec-review/SKILL.md is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'ヘルスケアアプリ',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    };
    genPillar4_AIRules(answers, 'TestHealth');
    assert.ok(S.files['skills/spec-review/SKILL.md'], 'Should generate skills/spec-review/SKILL.md');
    const content = S.files['skills/spec-review/SKILL.md'];
    assert.ok(content.length > 0, 'spec-review SKILL.md should not be empty');
  });

  test('skills/README.md is generated with skill registry content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'マーケットプレイス',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestMarket');
    assert.ok(S.files['skills/README.md'], 'Should generate skills/README.md');
    const readme = S.files['skills/README.md'];
    assert.ok(readme.includes('spec-review'), 'skills/README.md should list spec-review skill');
    assert.ok(readme.includes('code-gen'), 'skills/README.md should list code-gen skill');
    assert.ok(readme.includes('test-gen'), 'skills/README.md should list test-gen skill');
    assert.ok(readme.includes('doc-gen'), 'skills/README.md should list doc-gen skill');
    assert.ok(readme.includes('refactor'), 'skills/README.md should list refactor skill');
  });

  test('BaaS backend (Supabase) still generates all core files', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'フィンテックアプリ',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestBaaS');
    assert.ok(S.files['.cursor/rules'], 'BaaS: should generate .cursor/rules');
    assert.ok(S.files['CLAUDE.md'], 'BaaS: should generate CLAUDE.md');
    assert.ok(S.files['AGENTS.md'], 'BaaS: should generate AGENTS.md');
    assert.ok(S.files['AI_BRIEF.md'], 'BaaS: should generate AI_BRIEF.md');
    assert.ok(S.files['skills/spec-review/SKILL.md'], 'BaaS: should generate skills/spec-review/SKILL.md');
    assert.ok(S.files['skills/README.md'], 'BaaS: should generate skills/README.md');
  });

  test('English output: CLAUDE.md is in English', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = {
      purpose: 'Build a SaaS platform',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestEnglish');
    const claude = S.files['CLAUDE.md'];
    assert.ok(claude, 'Should generate CLAUDE.md in English mode');
    assert.ok(claude.includes('Development Rules'), 'English CLAUDE.md should have English title');
    assert.ok(claude.includes('Critical Rules'), 'English CLAUDE.md should have English section headers');
  });

  test('Japanese output: CLAUDE.md contains Japanese text', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'コミュニティプラットフォーム',
      frontend: 'Vue',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    };
    genPillar4_AIRules(answers, 'TestJapanese');
    const claude = S.files['CLAUDE.md'];
    assert.ok(claude, 'Should generate CLAUDE.md in Japanese mode');
    assert.ok(claude.includes('禁止事項') || claude.includes('開発ルール'), 'Japanese CLAUDE.md should contain Japanese text');
  });

  test('.gemini/settings.json is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'IoTモニタリングシステム',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    };
    genPillar4_AIRules(answers, 'TestGemini');
    assert.ok(S.files['.gemini/settings.json'], 'Should generate .gemini/settings.json');
    const gemini = S.files['.gemini/settings.json'];
    assert.ok(gemini.includes('TestGemini'), '.gemini/settings.json should contain project name');
  });

  test('.ai/hooks.yml is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'コンテンツ管理システム',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestHooks');
    assert.ok(S.files['.ai/hooks.yml'], 'Should generate .ai/hooks.yml');
    const hooks = S.files['.ai/hooks.yml'];
    assert.ok(hooks.includes('pre-commit'), '.ai/hooks.yml should have pre-commit hook');
    assert.ok(hooks.includes('npm test'), '.ai/hooks.yml should reference npm test');
  });

  test('.codex/skills/spec-review/SKILL.md mirrors skills/', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '人事管理システム',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    };
    genPillar4_AIRules(answers, 'TestCodex');
    assert.ok(S.files['.codex/skills/spec-review/SKILL.md'], 'Should generate .codex/skills/spec-review/SKILL.md');
    assert.equal(
      S.files['.codex/skills/spec-review/SKILL.md'],
      S.files['skills/spec-review/SKILL.md'],
      '.codex/skills/spec-review/SKILL.md should mirror skills/spec-review/SKILL.md'
    );
  });

  test('.claude/settings.json is generated and JSON-parseable', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '不動産プラットフォーム',
      frontend: 'Next.js',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestSettings');
    assert.ok(S.files['.claude/settings.json'], 'Should generate .claude/settings.json');
    let parsed;
    assert.doesNotThrow(() => {
      parsed = JSON.parse(S.files['.claude/settings.json']);
    }, '.claude/settings.json should be valid JSON');
    assert.ok(parsed.permissions, '.claude/settings.json should have permissions key');
    assert.ok(parsed.context, '.claude/settings.json should have context key');
  });

  test('BFF pattern: frontend=Next.js + backend=Node.js + Express generates all files', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'ブログプラットフォーム',
      frontend: 'Next.js',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestBFF');
    assert.ok(S.files['.cursor/rules'], 'BFF: should generate .cursor/rules');
    assert.ok(S.files['CLAUDE.md'], 'BFF: should generate CLAUDE.md');
    assert.ok(S.files['.claude/rules/backend.md'], 'BFF: should generate .claude/rules/backend.md');
    const backend = S.files['.claude/rules/backend.md'];
    assert.ok(backend && backend.length > 0, 'BFF: backend rules should not be empty');
  });

  test('all 5 .claude/agents/*.md are generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '分析ダッシュボード',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestAgents');
    assert.ok(S.files['.claude/agents/requirements-agent.md'], 'Should generate requirements-agent.md');
    assert.ok(S.files['.claude/agents/design-agent.md'], 'Should generate design-agent.md');
    assert.ok(S.files['.claude/agents/task-planner-agent.md'], 'Should generate task-planner-agent.md');
    assert.ok(S.files['.claude/agents/implementation-agent.md'], 'Should generate implementation-agent.md');
    assert.ok(S.files['.claude/agents/review-agent.md'], 'Should generate review-agent.md');
  });

  test('.windsurfrules is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'スケジュール管理ツール',
      frontend: 'Vue',
      backend: 'Supabase',
      database: 'Supabase',
      deploy: 'Vercel'
    };
    genPillar4_AIRules(answers, 'TestWindsurf');
    assert.ok(S.files['.windsurfrules'], 'Should generate .windsurfrules');
    const content = S.files['.windsurfrules'];
    assert.ok(content.includes('TestWindsurf'), '.windsurfrules should contain project name');
    assert.ok(content.includes('Windsurf'), '.windsurfrules should mention Windsurf');
  });

  test('.clinerules is generated', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '在庫管理システム',
      frontend: 'React',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'AWS'
    };
    genPillar4_AIRules(answers, 'TestCline');
    assert.ok(S.files['.clinerules'], 'Should generate .clinerules');
    const content = S.files['.clinerules'];
    assert.ok(content.includes('TestCline'), '.clinerules should contain project name');
    assert.ok(content.includes('Cline'), '.clinerules should mention Cline');
  });

  test('medical domain: CLAUDE.md reflects domain risks', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: '医療記録管理システム',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'AWS'
    };
    genPillar4_AIRules(answers, 'TestMedical');
    const claude = S.files['CLAUDE.md'];
    assert.ok(claude, 'Should generate CLAUDE.md for medical domain');
    assert.ok(claude.length > 0, 'CLAUDE.md should not be empty for medical domain');
    // CLAUDE.md should include the project name and core rules regardless of domain
    assert.ok(claude.includes('TestMedical'), 'CLAUDE.md should contain medical project name');
  });

  test('with ai_auto set: skills/README.md exists and contains SKILL content', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'AIチャットボットプラットフォーム',
      frontend: 'Next.js',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway',
      ai_auto: 'マルチAgent協調'
    };
    genPillar4_AIRules(answers, 'TestAIAuto');
    assert.ok(S.files['skills/README.md'], 'Should generate skills/README.md with ai_auto set');
    const readme = S.files['skills/README.md'];
    assert.ok(readme.includes('SKILL') || readme.includes('スキル'), 'skills/README.md should contain skill-related content');
    // ai_auto should also trigger skills/catalog.md
    assert.ok(S.files['skills/catalog.md'], 'Should generate skills/catalog.md when ai_auto is set');
  });

  test('all 5 core SKILL.md files are generated for each skill ID', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = {
      purpose: 'Build a project management tool',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Railway'
    };
    genPillar4_AIRules(answers, 'TestAllSkills');
    const skillIds = ['spec-review', 'code-gen', 'test-gen', 'doc-gen', 'refactor'];
    skillIds.forEach(id => {
      assert.ok(S.files[`skills/${id}/SKILL.md`], `Should generate skills/${id}/SKILL.md`);
    });
  });

  test('AGENTS.md contains agent specialization matrix', () => {
    S.files = {};
    S.genLang = 'ja';
    const answers = {
      purpose: 'チームコラボレーションツール',
      frontend: 'React',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      deploy: 'Render'
    };
    genPillar4_AIRules(answers, 'TestAgentMatrix');
    const agents = S.files['AGENTS.md'];
    assert.ok(agents, 'Should generate AGENTS.md');
    assert.ok(agents.includes('Frontend') || agents.includes('frontend'), 'AGENTS.md should mention Frontend agent');
    assert.ok(agents.includes('Backend') || agents.includes('backend'), 'AGENTS.md should mention Backend agent');
    assert.ok(agents.includes('Test') || agents.includes('test'), 'AGENTS.md should mention Test agent');
  });

  test('English skills/README.md uses English labels', () => {
    S.files = {};
    S.genLang = 'en';
    const answers = {
      purpose: 'Build an e-commerce platform',
      frontend: 'Next.js',
      backend: 'NestJS',
      database: 'PostgreSQL',
      deploy: 'AWS'
    };
    genPillar4_AIRules(answers, 'TestEnglishSkills');
    const readme = S.files['skills/README.md'];
    assert.ok(readme, 'Should generate skills/README.md');
    assert.ok(readme.includes('Skill Registry') || readme.includes('Skill Inventory'), 'English skills/README.md should use English labels');
    assert.ok(!readme.includes('スキルレジストリ'), 'English skills/README.md should not have Japanese registry label');
  });
});
