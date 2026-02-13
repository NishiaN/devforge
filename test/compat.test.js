// Compat rules functional test (48 rules: 10 ERROR + 30 WARN + 8 INFO)
const S={lang:'ja',skill:'pro'};
eval(require('fs').readFileSync('src/data/compat-rules.js','utf-8'));
eval(require('fs').readFileSync('src/generators/common.js','utf-8')); // For detectDomain

const tests=[
  {name:'Expo+Vue=ERROR',a:{frontend:'Vue 3 + Nuxt',mobile:'Expo (React Native)'},expect:'error'},
  {name:'Astro+Expo=ERROR',a:{frontend:'Astro',mobile:'Expo (React Native)'},expect:'error'},
  {name:'Static+Mobile=INFO',a:{backend:'なし（静的サイト）',mobile:'Expo (React Native)'},expect:'info',id:'be-mobile-static'},
  {name:'Python+Prisma=ERROR',a:{backend:'Python + FastAPI',orm:'Prisma'},expect:'error'},
  {name:'Java+Prisma=ERROR',a:{backend:'Java + Spring Boot',orm:'Prisma'},expect:'error'},
  {name:'Node+SQLAlchemy=ERROR',a:{backend:'Node.js + Express',orm:'SQLAlchemy (Python)'},expect:'error'},
  {name:'Static+ORM=WARN',a:{backend:'なし（静的サイト）',orm:'Prisma'},expect:'warn',id:'be-orm-static'},
  {name:'Firebase+MongoDB=WARN',a:{backend:'Firebase',database:'MongoDB'},expect:'warn'},
  {name:'Supabase+Firestore=WARN',a:{backend:'Supabase',database:'Firebase Firestore'},expect:'warn'},
  {name:'Static+DB=WARN',a:{backend:'なし（静的サイト）',database:'PostgreSQL'},expect:'warn'},
  {name:'Python+Firestore=WARN',a:{backend:'Python + FastAPI',database:'Firebase Firestore'},expect:'warn'},
  {name:'Drizzle+MongoDB=ERROR',a:{orm:'Drizzle ORM',database:'MongoDB'},expect:'error',id:'orm-drizzle-mongo'},
  {name:'Java+Vercel=WARN',a:{backend:'Java + Spring Boot',deploy:'Vercel'},expect:'warn'},
  {name:'Firebase+Vercel=WARN',a:{backend:'Firebase',deploy:'Vercel'},expect:'warn'},
  {name:'Supabase+FirebaseH=WARN',a:{backend:'Supabase',deploy:'Firebase Hosting'},expect:'warn'},
  {name:'NestJS+Vercel=WARN',a:{backend:'Node.js + NestJS',deploy:'Vercel'},expect:'warn'},
  {name:'Django+Vercel=WARN',a:{backend:'Python + Django',deploy:'Vercel'},expect:'warn'},
  {name:'Angular+Vercel=WARN',a:{frontend:'Angular',deploy:'Vercel'},expect:'warn'},
  {name:'Nuxt+FirebaseH=WARN',a:{frontend:'Vue 3 + Nuxt',deploy:'Firebase Hosting'},expect:'warn'},
  {name:'FullAuto+Beginner=WARN',a:{ai_auto:'フル自律開発',skill_level:'Beginner'},expect:'warn'},
  {name:'Orch+Intermediate=WARN',a:{ai_auto:'オーケストレーター',skill_level:'Intermediate'},expect:'warn'},
  {name:'Multi+Beginner=WARN',a:{ai_auto:'マルチAgent協調',skill_level:'Beginner'},expect:'warn'},
  {name:'Static+Stripe=WARN',a:{backend:'なし（静的サイト）',payment:'Stripe決済'},expect:'warn'},
  {name:'Saleor+Express=WARN',a:{backend:'Node.js + Express',payment:'Saleor (Python EC)'},expect:'warn'},
  // OK cases (should have no issues)
  {name:'React+Expo=OK',a:{frontend:'React + Next.js',mobile:'Expo (React Native)'},expect:'none'},
  {name:'Express+Prisma=OK',a:{backend:'Node.js + Express',orm:'Prisma'},expect:'none'},
  {name:'Next+Vercel=OK',a:{frontend:'React + Next.js',deploy:'Vercel'},expect:'none'},
  {name:'Supabase+SupaDB=OK',a:{backend:'Supabase',database:'Supabase (PostgreSQL)'},expect:'none'},
  {name:'Firebase+Firestore=OK',a:{backend:'Firebase',database:'Firebase Firestore'},expect:'none'},
  {name:'Pro+FullAuto=OK',a:{ai_auto:'フル自律開発',skill_level:'Professional'},expect:'none'},
  {name:'Antigravity+Windsurf=warn',a:{ai_tools:'Google Antigravity, Windsurf'},expect:'warn'},
  {name:'Antigravity only=OK',a:{ai_tools:'Google Antigravity, Claude Code'},expect:'none'},
  {name:'OpenRouter=info',a:{ai_tools:'Cursor, OpenRouter'},expect:'info'},
  // ── Phase A: Semantic Consistency Rules ──
  // A1: scope_out native vs mobile
  {name:'Scope:ネイティブ+Mobile=ERROR',a:{scope_out:'ネイティブアプリ, リアルタイム通信',mobile:'Expo (React Native)'},expect:'error',id:'sem-scope-mobile'},
  {name:'Scope:native+Mobile=ERROR',a:{scope_out:'native apps, realtime',mobile:'Expo (React Native)'},expect:'error',id:'sem-scope-mobile'},
  {name:'Scope:ネイティブ+NoMobile=OK',a:{scope_out:'ネイティブアプリ',mobile:'none'},expect:'none'},
  {name:'Scope:ネイティブ+PWA=OK',a:{scope_out:'ネイティブアプリ',mobile:'PWA'},expect:'none'},
  // A2: scope_out 決済 vs payment
  {name:'Scope:決済+Stripe=WARN',a:{scope_out:'決済機能, 多言語対応',payment:'Stripe決済'},expect:'warn',id:'sem-scope-payment'},
  {name:'Scope:EC+Pay=WARN',a:{scope_out:'EC機能',payment:'Stripe決済'},expect:'warn',id:'sem-scope-payment'},
  // A3: scope_out EC vs entities
  {name:'Scope:EC+Product=WARN',a:{scope_out:'EC機能',data_entities:'User, Product, Order'},expect:'warn',id:'sem-scope-entities'},
  // A4: Vercel+Express (no Next.js)
  {name:'Vercel+Express-noNext=WARN',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React (Vite SPA)'},expect:'warn',id:'sem-deploy-express'},
  {name:'Vercel+Express+Next=OK(info)',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React + Next.js'},expect:'info',id:'sem-deploy-bff'},
  // A5: Supabase + NextAuth
  {name:'Supabase+NextAuth=WARN',a:{backend:'Supabase',auth:'Auth.js/NextAuth'},expect:'warn',id:'sem-auth-supa-nextauth'},
  {name:'Supabase+SupaAuth=OK',a:{backend:'Supabase',auth:'Supabase Auth'},expect:'none'},
  // A6: non-Supabase + Supabase Auth
  {name:'Express+SupaAuth=WARN',a:{backend:'Node.js + Express',auth:'Supabase Auth'},expect:'warn',id:'sem-auth-nosupa-supaauth'},
  // A7: education + Product/Order
  {name:'Education+Product=INFO',a:{purpose:'教育・学習支援プラットフォーム',data_entities:'User, Course, Product, Order'},expect:'info',id:'sem-purpose-entities'},
  {name:'Education+Course=OK',a:{purpose:'教育・学習支援プラットフォーム',data_entities:'User, Course, Lesson, Progress'},expect:'none'},
  // A8: Next+Express+Vercel (BFF info)
  {name:'Next+Express+Vercel=INFO',a:{deploy:'Vercel',backend:'Node.js + Express',frontend:'React + Next.js'},expect:'info',id:'sem-deploy-bff'},
  // Security Rules
  {name:'Fintech+NoMFA=WARN',a:{purpose:'金融取引プラットフォーム',mvp_features:'認証, 取引履歴'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Health+NoMFA=WARN',a:{purpose:'医療記録管理システム',mvp_features:'認証, カルテ管理'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Legal+NoMFA=WARN',a:{purpose:'法務文書管理',mvp_features:'認証, 契約管理'},expect:'warn',id:'dom-sec-nomfa'},
  {name:'Fintech+MFA=OK',a:{purpose:'金融取引プラットフォーム',mvp_features:'認証, MFA, 取引履歴'},expect:'none'},
  {name:'Payment+NoAuth=ERROR',a:{payment:'Stripe決済',auth:'なし'},expect:'error',id:'dom-sec-pay-noauth'},
  {name:'Payment+Auth=OK',a:{payment:'Stripe決済',auth:'Supabase Auth'},expect:'none'},
  {name:'Sensitive+NoAuth=WARN',a:{data_entities:'Patient, MedicalRecord',auth:'なし'},expect:'warn',id:'dom-sec-sensitive-noauth'},
  {name:'Transaction+NoAuth=WARN',a:{data_entities:'User, Transaction, Payment',auth:'なし'},expect:'warn',id:'dom-sec-sensitive-noauth'},
  {name:'Sensitive+Auth=OK',a:{data_entities:'Patient, MedicalRecord',auth:'Supabase Auth'},expect:'none'},
];

let pass=0,fail=0;
tests.forEach(t=>{
  const res=checkCompat(t.a);
  let ok;
  if(t.id){
    // Check for specific rule by ID
    const match=res.find(r=>r.id===t.id);
    if(t.expect==='none') ok=!match;
    else ok=match&&match.level===t.expect;
  } else {
    const got=res.length===0?'none':res[0].level;
    ok=got===t.expect;
  }
  const got=t.id?(res.find(r=>r.id===t.id)||{level:'none'}).level:(res.length===0?'none':res[0].level);
  console.log((ok?'✅':'❌')+' '+t.name+' → '+got+(ok?'':' (expected '+t.expect+')'));
  ok?pass++:fail++;
});
console.log('---');
console.log(pass+'/'+tests.length+' passed, '+fail+' failed');

// ── calcSynergy Unit Tests ──
console.log('\n━━ calcSynergy Tests ━━');
const synergyTests = [
  {
    name: 'Null/undefined input returns default',
    input: null,
    expect: { overall: 60, d1: 60, d2: 60, d3: 60, d4: 60, d5: 60 }
  },
  {
    name: 'High synergy: Next.js + Supabase + Vercel + education',
    input: {
      frontend: 'React + Next.js',
      backend: 'Supabase',
      database: 'Supabase (PostgreSQL)',
      deploy: 'Vercel',
      purpose: '教育・学習支援プラットフォーム',
      skill_level: 'Professional'
    },
    expectMin: { overall: 85, d1: 85, d2: 85, d3: 80, d4: 85 }
  },
  {
    name: 'Low synergy: Angular + Express + Firebase Hosting',
    input: {
      frontend: 'Angular',
      backend: 'Node.js + Express',
      deploy: 'Firebase Hosting',
      skill_level: 'Professional'
    },
    expectMax: { overall: 75, d1: 75 }
  },
  {
    name: 'Domain bonus: fintech + PostgreSQL + Stripe',
    input: {
      purpose: '金融取引プラットフォーム',
      database: 'PostgreSQL',
      payment: 'Stripe決済',
      skill_level: 'Professional'
    },
    expectMin: { overall: 70, d3: 80 }
  },
  {
    name: 'BaaS ecosystem unity: Supabase full stack',
    input: {
      backend: 'Supabase',
      database: 'Supabase (PostgreSQL)',
      auth: 'Supabase Auth',
      skill_level: 'Professional'
    },
    expectMin: { overall: 75, d1: 80, d2: 85 }
  },
  {
    name: 'Beginner + complex stack lowers d5',
    input: {
      frontend: 'React + Next.js',
      backend: 'Node.js + Express',
      database: 'PostgreSQL',
      orm: 'Prisma',
      skill_level: 'Beginner'
    },
    expectMax: { d5: 70 }
  },
  {
    name: 'Pro always gets d5=90',
    input: {
      frontend: 'Vue 3 + Nuxt',
      backend: 'Python + Django',
      skill_level: 'Professional'
    },
    expectMin: { d5: 90 },
    expectMax: { d5: 90 }
  }
];

let synergyPass = 0, synergyFail = 0;
synergyTests.forEach(t => {
  const result = calcSynergy(t.input);
  let ok = true;
  let reason = '';

  if (t.expect) {
    // Exact match test
    Object.keys(t.expect).forEach(k => {
      if (result[k] !== t.expect[k]) {
        ok = false;
        reason = `${k}: got ${result[k]}, expected ${t.expect[k]}`;
      }
    });
  } else {
    // Min/max range test
    if (t.expectMin) {
      Object.keys(t.expectMin).forEach(k => {
        if (result[k] < t.expectMin[k]) {
          ok = false;
          reason = `${k}: got ${result[k]}, expected >= ${t.expectMin[k]}`;
        }
      });
    }
    if (t.expectMax) {
      Object.keys(t.expectMax).forEach(k => {
        if (result[k] > t.expectMax[k]) {
          ok = false;
          reason = `${k}: got ${result[k]}, expected <= ${t.expectMax[k]}`;
        }
      });
    }
  }

  console.log((ok ? '✅' : '❌') + ' ' + t.name + (ok ? '' : ` (${reason})`));
  ok ? synergyPass++ : synergyFail++;
});
console.log('---');
console.log(synergyPass + '/' + synergyTests.length + ' calcSynergy tests passed');
