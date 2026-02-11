// Round 27 regression tests — B1-B7 bug fixes
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

const S = {answers:{},skill:'intermediate',lang:'ja',preset:'custom',projectName:'T',phase:1,step:0,skipped:[],files:{},editedFiles:{},prevFiles:{},genLang:'ja',previewFile:null,pillar:0};
const save=()=>{};const _lsGet=()=>null;const _lsSet=()=>{};const _lsRm=()=>{};const sanitize=v=>v;
eval(fs.readFileSync('src/data/questions.js','utf-8'));
eval(fs.readFileSync('src/data/presets.js','utf-8').replace('const PR','var PR'));
eval(fs.readFileSync('src/data/compat-rules.js','utf-8'));
eval(fs.readFileSync('src/generators/common.js','utf-8').replace('const DOMAIN_PLAYBOOK','var DOMAIN_PLAYBOOK'));
eval(fs.readFileSync('src/generators/p1-sdd.js','utf-8'));
eval(fs.readFileSync('src/generators/p2-devcontainer.js','utf-8'));
eval(fs.readFileSync('src/generators/p10-reverse.js','utf-8').replace('const REVERSE_FLOW_MAP','var REVERSE_FLOW_MAP'));
eval(fs.readFileSync('src/generators/docs.js','utf-8'));
eval(fs.readFileSync('src/generators/p3-mcp.js','utf-8'));
eval(fs.readFileSync('src/generators/p4-airules.js','utf-8'));
eval(fs.readFileSync('src/data/gen-templates.js','utf-8').replace('const GT','var GT'));
eval(fs.readFileSync('src/generators/p7-roadmap.js','utf-8'));

function gen(answers, name, lang) {
  S.files = {}; S.genLang = lang || 'ja'; S.skill = 'intermediate'; S.answers = answers;
  genPillar1_SDD(answers, name);
  genPillar2_DevContainer(answers, name);
  genCommonFiles(answers, name);
  genDocs21(answers, name);
  genPillar3_MCP(answers, name);
  genPillar4_AIRules(answers, name);
  genPillar7_Roadmap(answers, name);
  return { ...S.files };
}

// Community project with Event entity (triggers B3: FK(Venue) without Venue in entities)
const community = gen({
  purpose: 'コミュニティフォーラム', target: 'コミュニティメンバー, 管理者',
  frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  deploy: 'Netlify', auth: 'Supabase Auth, Google OAuth', payment: 'Stripe',
  mvp_features: 'ユーザー認証, 投稿管理, コメント, グループ管理, イベント管理',
  screens: 'ランディング, ダッシュボード, 詳細, 設定, 管理画面, 決済ページ',
  data_entities: 'User, Post, Comment, Group, Event',
  dev_methods: 'TDD', ai_tools: 'Cursor', scope_out: 'ネイティブアプリ, 動画配信'
}, 'CommunityApp');

// LMS project (for B1 price check)
const lms = gen({
  purpose: 'SaaS型学習管理システム', target: '学生, 講師, 管理者',
  frontend: 'React + Next.js', backend: 'Supabase', database: 'Supabase (PostgreSQL)',
  deploy: 'Vercel', auth: 'Supabase Auth', payment: 'Stripe',
  mvp_features: 'ユーザー認証, コース管理, 進捗管理, サブスクリプション',
  screens: 'ランディング, ダッシュボード, コース詳細, 設定, 管理画面, 決済ページ',
  data_entities: 'User, Course, Lesson, Progress, Enrollment',
  dev_methods: 'TDD', ai_tools: 'Cursor'
}, 'LMS');

describe('B1: Enterprise price consistency', () => {
  test('spec and tech-plan have same Enterprise price', () => {
    const spec = lms['.spec/specification.md'];
    const tp = lms['.spec/technical-plan.md'];
    const specPrice = spec.match(/Enterprise\s*\|\s*¥([\d,]+)/);
    const tpPrice = tp.match(/Enterprise\s*\|\s*¥([\d,]+)/);
    assert.ok(specPrice, 'Enterprise price not found in spec');
    assert.ok(tpPrice, 'Enterprise price not found in tech-plan');
    assert.equal(specPrice[1], tpPrice[1], `Price mismatch: spec ¥${specPrice[1]} vs tech-plan ¥${tpPrice[1]}`);
  });
});

describe('B2: API FK sample values are semantic', () => {
  test('post_id should NOT have userId as value', () => {
    const api = community['docs/05_api_design.md'];
    assert.ok(!api.includes('post_id: userId'), 'post_id still uses userId as sample value');
  });

  test('venue_id should NOT have userId as value', () => {
    const api = community['docs/05_api_design.md'];
    assert.ok(!api.includes('venue_id: userId'), 'venue_id still uses userId as sample value');
  });

  test('FK columns use semantic variable names', () => {
    const api = community['docs/05_api_design.md'];
    // user_id → userId is correct (it IS a user reference)
    assert.ok(api.includes('user_id: userId') || api.includes('owner_id: ownerId'), 'User FK should use userId/ownerId');
    // post_id should use postId
    assert.ok(api.includes('post_id: postId'), 'post_id should use postId');
  });
});

describe('B3: FK references to undefined entities are filtered', () => {
  test('Event without Venue in entities: no venue_id column', () => {
    const er = community['docs/04_er_diagram.md'];
    assert.ok(!er.includes('venue_id'), 'venue_id present but Venue entity not defined');
  });

  test('tech-plan has no FK to undefined entity', () => {
    const tp = community['.spec/technical-plan.md'];
    // Extract all FK references
    const fks = tp.match(/FK\((\w+)\)/g) || [];
    const entities = ['User', 'Post', 'Comment', 'Group', 'Event'];
    fks.forEach(fk => {
      const ref = fk.match(/FK\((\w+)\)/)[1];
      assert.ok(entities.includes(ref), `FK(${ref}) references undefined entity`);
    });
  });

  test('AI_BRIEF has no FK arrows to undefined entity', () => {
    const brief = community['AI_BRIEF.md'];
    // Should not contain → Venue
    assert.ok(!brief.includes('→ Venue'), 'AI_BRIEF references undefined Venue entity');
  });
});

describe('B4: Constitution has domain-inferred KPIs', () => {
  const getKPISection = (files) => {
    const con = files['.spec/constitution.md'];
    return con.split(/## [34]/)[1] || ''; // Between section 3 and 4
  };

  test('community project has community-specific KPIs', () => {
    const kpi = getKPISection(community);
    assert.ok(!kpi.includes('（未定義）'), 'KPI section shows (undefined)');
    assert.ok(kpi.includes('MAU') || kpi.includes('リテンション') || kpi.includes('投稿'),
      'Community KPI should mention MAU/retention/posts');
  });

  test('LMS project has education-specific KPIs', () => {
    const kpi = getKPISection(lms);
    assert.ok(!kpi.includes('（未定義）'), 'KPI section shows (undefined)');
    assert.ok(kpi.includes('完了率') || kpi.includes('学習') || kpi.includes('completion'),
      'Education KPI should mention completion/learning');
  });

  test('EC project has commerce-specific KPIs', () => {
    const ec = gen({
      purpose: 'ECサイト', target: '一般消費者',
      frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
      deploy: 'Railway', auth: 'NextAuth', payment: 'Stripe',
      mvp_features: '商品管理, カート, 注文管理', screens: 'トップ, 商品一覧',
      data_entities: 'User, Product, Order, Cart', dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma'
    }, 'Shop');
    const kpi = getKPISection(ec);
    assert.ok(!kpi.includes('（未定義）'), 'KPI section shows (undefined)');
    assert.ok(kpi.includes('GMV') || kpi.includes('CVR') || kpi.includes('LTV'),
      'EC KPI should mention GMV/CVR/LTV');
  });
});

describe('B5: No raw SQL rule has migration exception', () => {
  test('BaaS: forbidden mentions "application code" limitation', () => {
    const claude = community['CLAUDE.md'];
    assert.ok(claude.includes('application code'), '"No raw SQL" missing "application code" qualifier');
  });

  test('BaaS: migration SQL is explicitly OK', () => {
    const claude = community['CLAUDE.md'];
    assert.ok(claude.includes('migration') || claude.includes('DDL'),
      'Missing migration/DDL exception');
  });
});

describe('B6: Stripe API path consistency', () => {
  test('spec and tech-plan use same webhook path', () => {
    const spec = lms['.spec/specification.md'];
    const tp = lms['.spec/technical-plan.md'];
    // Both should use /api/webhook/stripe
    const specPath = spec.includes('/api/webhook/stripe');
    const tpPath = tp.includes('/api/webhook/stripe');
    assert.ok(specPath, 'spec missing /api/webhook/stripe');
    assert.ok(tpPath, 'tech-plan missing /api/webhook/stripe');
  });

  test('no stale supabase/functions path in spec', () => {
    const spec = lms['.spec/specification.md'];
    assert.ok(!spec.includes('supabase/functions/stripe-webhook'),
      'spec still has old supabase/functions path');
  });
});

describe('B7: DevContainer ports consistency', () => {
  test('Supabase: compose has supabase ports', () => {
    const compose = community['.devcontainer/docker-compose.yml'];
    assert.ok(compose.includes('54321'), 'compose missing Supabase API port 54321');
    assert.ok(compose.includes('54323'), 'compose missing Supabase Studio port 54323');
  });

  test('non-BaaS: compose does NOT have supabase ports', () => {
    const ec = gen({
      purpose: 'ECサイト', target: '一般消費者',
      frontend: 'React + Next.js', backend: 'Node.js + Express', database: 'PostgreSQL',
      deploy: 'Railway', auth: 'NextAuth', payment: 'Stripe',
      mvp_features: '商品管理', screens: 'トップ',
      data_entities: 'User, Product, Order', dev_methods: 'TDD', ai_tools: 'Cursor', orm: 'Prisma'
    }, 'Shop');
    const compose = ec['.devcontainer/docker-compose.yml'];
    assert.ok(!compose.includes('54321'), 'non-BaaS compose should not have supabase ports');
  });

  test('devcontainer.json forwardPorts matches compose ports', () => {
    const dc = JSON.parse(community['.devcontainer/devcontainer.json']);
    const compose = community['.devcontainer/docker-compose.yml'];
    dc.forwardPorts.forEach(port => {
      assert.ok(compose.includes(String(port)), `Port ${port} in devcontainer.json but not in compose`);
    });
  });
});
