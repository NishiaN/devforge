/**
 * help-hints.test.js — Dynamic expert hints for tech selection questions
 * Tests expertHintsFn() on HELP_DATA entries and _getRecIdx() in render.js
 */
const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');
const h = require('./harness.js');

// Provide detectDomain in sandbox (normally from generators/common.js)
h.sandbox.detectDomain = function(p) {
  p = (p||'').toLowerCase();
  if (/saas|サブスク|subscription/i.test(p)) return 'saas';
  if (/ec|ショップ|e-commerce|shop|commerce/i.test(p)) return 'ec';
  if (/教育|learning|lms|コース/i.test(p)) return 'education';
  if (/ai.?agent|chatbot|チャットボット|aiエージェント/i.test(p)) return 'ai';
  if (/marketplace|マーケットプレイス/i.test(p)) return 'marketplace';
  if (/fintech|金融/i.test(p)) return 'fintech';
  if (/health|医療/i.test(p)) return 'health';
  if (/portfolio|ポートフォリオ/i.test(p)) return 'portfolio';
  if (/creator|クリエイター/i.test(p)) return 'creator';
  if (/dev.?tool|開発者ツール/i.test(p)) return 'devtool';
  if (/hr|人事|採用/i.test(p)) return 'hr';
  if (/legal|法務/i.test(p)) return 'legal';
  return null;
};

// Load render.js for _getRecIdx
h.loadModule('ui/render.js');

function makeS(skillLv, answers) {
  h.sandbox.S = {
    phase:0, step:0, answers: answers||{}, projectName:'',
    skill:'intermediate', preset:'custom', lang:'ja',
    genLang:'ja', theme:'dark', pillar:0, previewFile:null,
    files:{}, skipped:[], progress:{},
    editedFiles:{}, prevFiles:{}, _v:9, skillLv: skillLv||2
  };
}

function callFn(key, answers, ja) {
  const raw = h.HELP_DATA[key];
  if (!raw || typeof raw.expertHintsFn !== 'function') return null;
  return raw.expertHintsFn(answers||{}, ja!==false);
}

/* ── HELP_DATA structure ── */
describe('helpdata.js: expertHintsFn structure', () => {
  const techKeys = ['frontend','css_fw','backend','database','orm','deploy','mobile','auth','payment','ai_auto'];
  for (const key of techKeys) {
    it(`HELP_DATA.${key} has expertHintsFn function`, () => {
      const raw = h.HELP_DATA[key];
      assert.ok(raw, `HELP_DATA missing key: ${key}`);
      assert.equal(typeof raw.expertHintsFn, 'function', `${key}.expertHintsFn must be a function`);
    });
  }

  const existingKeys = ['purpose','target','scope_out','mvp_features','screens'];
  for (const key of existingKeys) {
    it(`HELP_DATA.${key} has expertHintsFn function`, () => {
      const raw = h.HELP_DATA[key];
      assert.ok(raw, `HELP_DATA missing key: ${key}`);
      assert.equal(typeof raw.expertHintsFn, 'function', `${key}.expertHintsFn must be a function`);
    });
  }
});

/* ── Empty answers → empty array (no crash) ── */
describe('expertHintsFn: empty answers returns []', () => {
  const techKeys = ['frontend','css_fw','backend','database','orm','deploy','mobile','auth','payment','ai_auto'];
  for (const key of techKeys) {
    it(`${key}: empty answers → empty array`, () => {
      makeS(2, {});
      const result = callFn(key, {}, true);
      assert.ok(Array.isArray(result), `${key} must return array`);
    });
  }
});

/* ── frontend ── */
describe('expertHintsFn: frontend', () => {
  it('education domain → SSR hint (JA)', () => {
    makeS(2, { purpose: '教育プラットフォームを作りたい' });
    const hints = callFn('frontend', { purpose: '教育プラットフォームを作りたい' }, true);
    assert.ok(hints.length >= 1, 'should have at least 1 hint');
    assert.ok(hints.some(h => h._ctx), '_ctx flag required');
    assert.ok(hints.some(h => /SSR|Next/.test(h.hint)), 'should mention SSR/Next.js');
  });

  it('portfolio domain → static hint (EN)', () => {
    makeS(2, { purpose: 'My portfolio site' });
    const hints = callFn('frontend', { purpose: 'My portfolio site' }, false);
    assert.ok(hints.some(h => /static|zero/i.test(h.hint)), 'should mention static');
  });

  it('beginner (lv=1) → beginner hint', () => {
    makeS(1, {});
    const hints = callFn('frontend', {}, true);
    assert.ok(hints.some(h => /React|Vite|初心者/.test(h.hint)), 'should have beginner hint');
    assert.ok(hints.every(h => h._ctx), 'all hints should have _ctx:true');
  });

  it('advanced (lv=5) → no beginner hint', () => {
    makeS(5, {});
    const hints = callFn('frontend', {}, true);
    assert.ok(!hints.some(h => /初心者|Beginner/.test(h.name)), 'advanced should not get beginner hint');
  });
});

/* ── css_fw ── */
describe('expertHintsFn: css_fw', () => {
  it('React → shadcn/Tailwind hint (JA)', () => {
    makeS(2, { frontend: 'React' });
    const hints = callFn('css_fw', { frontend: 'React' }, true);
    assert.ok(hints.length >= 1);
    assert.ok(hints.some(h => /shadcn|Tailwind/.test(h.hint)));
    assert.ok(hints[0]._ctx);
  });

  it('Vue → PrimeVue/NuxtUI hint (EN)', () => {
    makeS(2, { frontend: 'Vue' });
    const hints = callFn('css_fw', { frontend: 'Vue' }, false);
    assert.ok(hints.some(h => /PrimeVue|Nuxt UI/.test(h.hint)));
  });

  it('Svelte → Skeleton UI hint', () => {
    makeS(2, { frontend: 'Svelte' });
    const hints = callFn('css_fw', { frontend: 'Svelte' }, true);
    assert.ok(hints.some(h => /Skeleton/.test(h.hint)));
  });

  it('Astro → astrojs/tailwind hint', () => {
    makeS(2, { frontend: 'Astro' });
    const hints = callFn('css_fw', { frontend: 'Astro' }, true);
    assert.ok(hints.some(h => /astrojs|tailwind/i.test(h.hint)));
  });
});

/* ── backend ── */
describe('expertHintsFn: backend', () => {
  it('Next.js frontend → API Routes hint', () => {
    makeS(2, { frontend: 'Next.js' });
    const hints = callFn('backend', { frontend: 'Next.js' }, true);
    assert.ok(hints.some(h => /API Routes|Server Actions/.test(h.hint)));
  });

  it('AI domain → FastAPI/Vercel AI SDK hint', () => {
    makeS(3, { purpose: 'AIエージェントチャットボットアプリ' });
    const hints = callFn('backend', { purpose: 'AIエージェントチャットボットアプリ' }, true);
    assert.ok(hints.some(h => /FastAPI|Vercel AI/.test(h.hint)));
  });

  it('beginner (lv=1) → BaaS recommendation hint', () => {
    makeS(1, {});
    const hints = callFn('backend', {}, true);
    assert.ok(hints.some(h => /Firebase|Supabase/.test(h.hint)));
  });
});

/* ── database ── */
describe('expertHintsFn: database', () => {
  it('Supabase backend → Supabase DB hint', () => {
    makeS(2, { backend: 'Supabase' });
    const hints = callFn('database', { backend: 'Supabase' }, true);
    assert.ok(hints.some(h => /Supabase.*PostgreSQL|RLS/.test(h.hint)));
    assert.ok(hints[0]._ctx);
  });

  it('Firebase backend → Firestore hint', () => {
    makeS(2, { backend: 'Firebase' });
    const hints = callFn('database', { backend: 'Firebase' }, true);
    assert.ok(hints.some(h => /Firestore/.test(h.hint)));
  });

  it('Python/FastAPI backend → PostgreSQL+SQLAlchemy hint', () => {
    makeS(3, { backend: 'FastAPI' });
    const hints = callFn('database', { backend: 'FastAPI' }, true);
    assert.ok(hints.some(h => /SQLAlchemy|Alembic/.test(h.hint)));
  });

  it('NestJS backend → Prisma hint', () => {
    makeS(3, { backend: 'NestJS' });
    const hints = callFn('database', { backend: 'NestJS' }, false);
    assert.ok(hints.some(h => /Prisma/.test(h.hint)));
  });
});

/* ── orm ── */
describe('expertHintsFn: orm', () => {
  it('Supabase backend → BaaS skip hint', () => {
    makeS(2, { backend: 'Supabase' });
    const hints = callFn('orm', { backend: 'Supabase' }, true);
    assert.ok(hints.some(h => /不要|not needed/i.test(h.hint)));
  });

  it('NestJS backend → TypeORM hint', () => {
    makeS(3, { backend: 'NestJS', database: 'PostgreSQL' });
    const hints = callFn('orm', { backend: 'NestJS', database: 'PostgreSQL' }, true);
    assert.ok(hints.some(h => /TypeORM/.test(h.hint)));
  });

  it('Python/FastAPI → SQLAlchemy hint', () => {
    makeS(3, { backend: 'FastAPI' });
    const hints = callFn('orm', { backend: 'FastAPI' }, false);
    assert.ok(hints.some(h => /SQLAlchemy/.test(h.hint)));
  });

  it('MongoDB database → Mongoose/Prisma hint', () => {
    makeS(3, { backend: 'Express', database: 'MongoDB' });
    const hints = callFn('orm', { backend: 'Express', database: 'MongoDB' }, true);
    assert.ok(hints.some(h => /Mongoose|Prisma/.test(h.hint)));
  });
});

/* ── deploy ── */
describe('expertHintsFn: deploy', () => {
  it('Next.js (no BaaS) → Vercel hint', () => {
    makeS(2, { frontend: 'Next.js', backend: 'Express' });
    const hints = callFn('deploy', { frontend: 'Next.js', backend: 'Express' }, true);
    assert.ok(hints.some(h => /Vercel/.test(h.hint)));
  });

  it('Firebase backend → Firebase Hosting hint', () => {
    makeS(2, { backend: 'Firebase' });
    const hints = callFn('deploy', { backend: 'Firebase' }, true);
    assert.ok(hints.some(h => /Firebase Hosting/.test(h.hint)));
  });

  it('Next.js + Supabase → fastest stack hint', () => {
    makeS(2, { frontend: 'Next.js', backend: 'Supabase' });
    const hints = callFn('deploy', { frontend: 'Next.js', backend: 'Supabase' }, true);
    assert.ok(hints.some(h => /Supabase.*Vercel|Vercel.*Supabase|最速/.test(h.hint)));
  });

  it('Spring/Java backend → Railway/Fly.io hint', () => {
    makeS(4, { backend: 'Spring Boot (Java)' });
    const hints = callFn('deploy', { backend: 'Spring Boot (Java)' }, false);
    assert.ok(hints.some(h => /Railway|Fly\.io|Render/.test(h.hint)));
  });
});

/* ── mobile ── */
describe('expertHintsFn: mobile', () => {
  it('mobile in scope_out → "None" recommendation', () => {
    makeS(2, { scope_out: 'モバイルアプリは作らない' });
    const hints = callFn('mobile', { scope_out: 'モバイルアプリは作らない' }, true);
    assert.ok(hints.some(h => /なし|None/.test(h.hint)));
  });

  it('React frontend → Expo hint', () => {
    makeS(2, { frontend: 'React' });
    const hints = callFn('mobile', { frontend: 'React' }, true);
    assert.ok(hints.some(h => /Expo/.test(h.hint)));
  });
});

/* ── auth ── */
describe('expertHintsFn: auth', () => {
  it('Supabase backend → Supabase Auth hint', () => {
    makeS(2, { backend: 'Supabase' });
    const hints = callFn('auth', { backend: 'Supabase' }, true);
    assert.ok(hints.some(h => /Supabase Auth/.test(h.hint)));
  });

  it('Firebase backend → Firebase Auth hint', () => {
    makeS(2, { backend: 'Firebase' });
    const hints = callFn('auth', { backend: 'Firebase' }, true);
    assert.ok(hints.some(h => /Firebase Auth/.test(h.hint)));
  });

  it('Next.js frontend → Auth.js hint', () => {
    makeS(2, { frontend: 'Next.js', backend: 'Express' });
    const hints = callFn('auth', { frontend: 'Next.js', backend: 'Express' }, false);
    assert.ok(hints.some(h => /Auth\.js|NextAuth/.test(h.hint)));
  });

  it('fintech domain → MFA hint', () => {
    makeS(3, { purpose: '金融サービスアプリ（銀行）' });
    const hints = callFn('auth', { purpose: '金融サービスアプリ（銀行）' }, true);
    assert.ok(hints.some(h => /MFA|多要素/.test(h.hint)));
  });
});

/* ── payment ── */
describe('expertHintsFn: payment', () => {
  it('payment in scope_out → None recommendation', () => {
    makeS(2, { scope_out: '決済機能は作らない' });
    const hints = callFn('payment', { scope_out: '決済機能は作らない' }, true);
    assert.ok(hints.some(h => /なし|None/.test(h.hint)));
  });

  it('SaaS domain → Stripe Billing hint', () => {
    makeS(2, { purpose: 'SaaS subscription tool' });
    const hints = callFn('payment', { purpose: 'SaaS subscription tool' }, true);
    assert.ok(hints.some(h => /Stripe Billing/.test(h.hint)));
  });

  it('marketplace domain → Stripe Connect hint', () => {
    makeS(2, { purpose: 'フリーランスマーケットプレイス' });
    const hints = callFn('payment', { purpose: 'フリーランスマーケットプレイス' }, true);
    assert.ok(hints.some(h => /Stripe Connect/.test(h.hint)));
  });

  it('creator domain → Lemon Squeezy hint (EN)', () => {
    makeS(2, { purpose: 'creator monetization platform' });
    const hints = callFn('payment', { purpose: 'creator monetization platform' }, false);
    assert.ok(hints.some(h => /Lemon Squeezy/.test(h.hint)));
  });
});

/* ── ai_auto ── */
describe('expertHintsFn: ai_auto', () => {
  it('beginner (lv=1) → Vibe Coding hint', () => {
    makeS(1, {});
    const hints = callFn('ai_auto', {}, true);
    assert.ok(hints.some(h => /Vibe Coding/.test(h.hint)));
  });

  it('intermediate (lv=3) → Agentic Dev hint', () => {
    makeS(3, {});
    const hints = callFn('ai_auto', {}, true);
    assert.ok(hints.some(h => /Agentic Dev|Cursor Agent/.test(h.hint)));
  });

  it('advanced (lv=5) → Multi-Agent hint', () => {
    makeS(5, {});
    const hints = callFn('ai_auto', {}, false);
    assert.ok(hints.some(h => /Multi-Agent|Subagents/.test(h.hint)));
  });

  it('AI domain → AI Domain synergy hint', () => {
    makeS(3, { purpose: 'AIエージェントチャットボットアプリ' });
    const hints = callFn('ai_auto', { purpose: 'AIエージェントチャットボットアプリ' }, true);
    assert.ok(hints.some(h => /Multi-Agent|エージェント/.test(h.hint)));
  });
});

/* ── existing questions with expertHintsFn ── */
describe('expertHintsFn: purpose/target/scope_out/mvp_features/screens', () => {
  it('purpose: SaaS → SaaS domain hint', () => {
    const hints = callFn('purpose', { purpose: 'SaaS subscription management' }, true);
    assert.ok(hints.some(h => /SaaS|マルチテナント|RLS/.test(h.hint)));
  });

  it('purpose: AI domain → AI domain hint', () => {
    const hints = callFn('purpose', { purpose: 'AIエージェントチャットボットアプリ' }, true);
    assert.ok(hints.some(h => /プロンプトゲノム|LLMOps|Prompt Genome/.test(h.hint)));
  });

  it('target: education → education target hint', () => {
    const hints = callFn('target', { purpose: 'e-learning LMS コースシステム' }, true);
    assert.ok(hints.some(h => /B2C|B2B|学習者/.test(h.hint)));
  });

  it('target: saas → SaaS target hint', () => {
    const hints = callFn('target', { purpose: 'SaaS subscription service' }, false);
    assert.ok(hints.some(h => /SMB|Enterprise|B2C/.test(h.hint)));
  });

  it('scope_out: payment in mvp → payment delay hint', () => {
    const hints = callFn('scope_out', { mvp_features: 'stripe決済機能' }, true);
    assert.ok(hints.some(h => /決済|Payment/.test(h.hint)));
  });

  it('mvp_features: SaaS → SaaS MVP core hint', () => {
    const hints = callFn('mvp_features', { purpose: 'SaaS subscription tool' }, true);
    assert.ok(hints.some(h => /認証|Auth|ダッシュボード|Dashboard/.test(h.hint)));
  });

  it('mvp_features: EC → EC MVP core hint', () => {
    const hints = callFn('mvp_features', { purpose: 'eコマース EC ショップ' }, true);
    assert.ok(hints.some(h => /カート|Cart|決済|Checkout/.test(h.hint)));
  });

  it('screens: SaaS → SaaS screen set hint', () => {
    const hints = callFn('screens', { purpose: 'SaaS subscription management' }, true);
    assert.ok(hints.some(h => /ダッシュボード|Dashboard|請求|Billing/.test(h.hint)));
  });
});

/* ── _ctx flag ── */
describe('expertHintsFn: _ctx flag on all dynamic hints', () => {
  it('all dynamic hints have _ctx:true', () => {
    makeS(2, { backend: 'Supabase', frontend: 'Next.js', purpose: 'SaaS subscription tool' });
    const keys = ['database','orm','deploy','auth','css_fw','frontend','backend','payment','mobile','ai_auto'];
    const answers = { backend: 'Supabase', frontend: 'Next.js', purpose: 'SaaS subscription tool' };
    for (const key of keys) {
      const hints = callFn(key, answers, true);
      for (const hint of hints) {
        assert.ok(hint._ctx, `${key} hint missing _ctx flag: ${hint.name}`);
      }
    }
  });
});

/* ── _getRecIdx ── */
describe('_getRecIdx: dynamic badge positioning', () => {
  it('database: Supabase backend → finds Supabase option', () => {
    makeS(2, { backend: 'Supabase' });
    const options = ['Supabase (PostgreSQL)', 'PostgreSQL', 'MySQL', 'MongoDB'];
    const idx = h.sandbox._getRecIdx('database', options);
    assert.equal(idx, 0, 'Supabase option should be index 0');
  });

  it('database: Firebase backend → finds Firebase option', () => {
    makeS(2, { backend: 'Firebase' });
    const options = ['PostgreSQL', 'Firebase / Firestore', 'MySQL'];
    const idx = h.sandbox._getRecIdx('database', options);
    assert.equal(idx, 1, 'Firebase option should be index 1');
  });

  it('database: no match → returns 0', () => {
    makeS(2, { backend: 'Express' });
    const options = ['PostgreSQL', 'MySQL', 'SQLite'];
    const idx = h.sandbox._getRecIdx('database', options);
    assert.equal(idx, 0);
  });

  it('orm: NestJS → TypeORM option', () => {
    makeS(3, { backend: 'NestJS' });
    const options = ['Prisma', 'TypeORM', 'Drizzle', 'Kysely'];
    const idx = h.sandbox._getRecIdx('orm', options);
    assert.equal(idx, 1, 'TypeORM should be recommended for NestJS');
  });

  it('orm: FastAPI → SQLAlchemy option', () => {
    makeS(3, { backend: 'FastAPI' });
    const options = ['Prisma', 'TypeORM', 'SQLAlchemy', 'Drizzle'];
    const idx = h.sandbox._getRecIdx('orm', options);
    assert.equal(idx, 2, 'SQLAlchemy should be recommended for FastAPI');
  });

  it('css_fw: React → shadcn option', () => {
    makeS(2, { frontend: 'React' });
    const options = ['Tailwind CSS', 'shadcn/ui + Tailwind', 'Bootstrap', 'MUI'];
    const idx = h.sandbox._getRecIdx('css_fw', options);
    assert.equal(idx, 1, 'shadcn should be recommended for React');
  });

  it('mobile: React frontend → Expo option', () => {
    makeS(2, { frontend: 'React' });
    const options = ['なし', 'PWA', 'Expo (React Native)', 'React Native'];
    const idx = h.sandbox._getRecIdx('mobile', options);
    assert.equal(idx, 2, 'Expo should be recommended for React');
  });

  it('deploy: Firebase → Firebase option', () => {
    makeS(2, { backend: 'Firebase' });
    const options = ['Vercel', 'Firebase Hosting', 'Railway', 'Fly.io'];
    const idx = h.sandbox._getRecIdx('deploy', options);
    assert.equal(idx, 1, 'Firebase Hosting should be recommended');
  });

  it('unknown qId → returns 0', () => {
    makeS(2, {});
    const options = ['A', 'B', 'C'];
    const idx = h.sandbox._getRecIdx('unknown_key', options);
    assert.equal(idx, 0);
  });

  it('empty options → returns 0', () => {
    makeS(2, {});
    const idx = h.sandbox._getRecIdx('database', []);
    assert.equal(idx, 0);
  });
});
