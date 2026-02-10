/* ═══ STACK COMPATIBILITY & SEMANTIC CONSISTENCY RULES — 31 rules (ERROR×6 + WARN×22 + INFO×3) ═══ */
const COMPAT_RULES=[
  // ── FE ↔ Mobile (2 ERROR) ──
  {id:'fe-mob-expo',p:['frontend','mobile'],lv:'error',
   t:a=>inc(a.mobile,'Expo')&&!inc(a.frontend,'React'),
   ja:'ExpoはReact Native専用です。フロントをReact系に変更してください',
   en:'Expo requires React. Change frontend to a React-based option',
   fix:{f:'frontend',s:'React + Next.js'}},
  {id:'fe-mob-astro',p:['frontend','mobile'],lv:'error',
   t:a=>inc(a.frontend,'Astro')&&inc(a.mobile,'Expo'),
   ja:'AstroはSSG専用でExpoと併用できません。React + Next.jsを推奨',
   en:'Astro is SSG-only and incompatible with Expo. Use React + Next.js',
   fix:{f:'frontend',s:'React + Next.js'}},
  // ── BE ↔ ORM (3 ERROR) ──
  {id:'be-orm-py-prisma',p:['backend','orm'],lv:'error',
   t:a=>isPyBE(a)&&inc(a.orm,'Prisma')||isPyBE(a)&&inc(a.orm,'Drizzle')||isPyBE(a)&&inc(a.orm,'TypeORM'),
   ja:'Prisma/Drizzle/TypeORMはNode.js専用です。SQLAlchemyを選択してください',
   en:'Prisma/Drizzle/TypeORM are Node.js-only. Choose SQLAlchemy',
   fix:{f:'orm',s:'SQLAlchemy (Python)'}},
  {id:'be-orm-java-prisma',p:['backend','orm'],lv:'error',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&(inc(a.orm,'Prisma')||inc(a.orm,'Drizzle')),
   ja:'Prisma/DrizzleはNode.js/TypeScript専用です',
   en:'Prisma/Drizzle are Node.js/TypeScript-only',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'be-orm-node-sqla',p:['backend','orm'],lv:'error',
   t:a=>isNodeBE(a)&&inc(a.orm,'SQLAlchemy'),
   ja:'SQLAlchemyはPython専用です。Prisma/Drizzleを選択してください',
   en:'SQLAlchemy is Python-only. Choose Prisma or Drizzle',
   fix:{f:'orm',s:'Prisma'}},
  // ── BE ↔ DB (4 WARN) ──
  {id:'be-db-fb-notfs',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.database&&!inc(a.database,'Firestore'),
   ja:'Firebase利用時はFirestoreが最適です',
   en:'Firestore is the optimal DB for Firebase'},
  {id:'be-db-supa-notpg',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&a.database&&!inc(a.database,'Supabase')&&!inc(a.database,'PostgreSQL')&&!inc(a.database,'Neon'),
   ja:'Supabase利用時はSupabase (PostgreSQL)が統合されています',
   en:'Supabase integrates best with Supabase (PostgreSQL)'},
  {id:'be-db-static-db',p:['backend','database'],lv:'warn',
   t:a=>isStaticBE(a)&&a.database&&!inc(a.database,'なし')&&a.database!=='None',
   ja:'静的サイトではDBは通常不要です',
   en:'Static sites typically do not need a database'},
  {id:'be-db-py-fs',p:['backend','database'],lv:'warn',
   t:a=>isPyBE(a)&&inc(a.database,'Firestore'),
   ja:'PythonとFirestoreの相性は中程度。PostgreSQLが推奨です',
   en:'Python + Firestore compatibility is moderate. PostgreSQL recommended'},
  // ── BE ↔ Deploy (5 WARN) ──
  {id:'be-dep-java-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&inc(a.deploy,'Vercel'),
   ja:'VercelはNode.js/Python前提です。Railway/AWS/Dockerが必要',
   en:'Vercel supports Node.js/Python. Use Railway/AWS/Docker for Java/Go',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-fb-notfbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.deploy&&!inc(a.deploy,'Firebase'),
   ja:'Firebase利用時はFirebase Hostingが最適です',
   en:'Firebase Hosting is optimal when using Firebase backend'},
  {id:'be-dep-supa-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&inc(a.deploy,'Firebase'),
   ja:'SupabaseにはVercelまたはSupabase Hostingが推奨です',
   en:'Use Vercel or Supabase Hosting with Supabase backend'},
  {id:'be-dep-nest-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Vercel'),
   ja:'NestJSのサーバーレスデプロイは制限があります。Railwayが推奨',
   en:'NestJS serverless deploys have limitations. Railway recommended',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-django-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Django')&&inc(a.deploy,'Vercel'),
   ja:'DjangoのVercelデプロイは制限あり。Railway/Fly.ioが推奨',
   en:'Django on Vercel has limitations. Railway/Fly.io recommended',
   fix:{f:'deploy',s:'Railway'}},
  // ── FE ↔ Deploy (2 WARN) ──
  {id:'fe-dep-angular-vercel',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Angular')&&inc(a.deploy,'Vercel'),
   ja:'AngularのVercel対応は限定的。Firebase HostingまたはAWSが推奨',
   en:'Angular on Vercel is limited. Use Firebase Hosting or AWS'},
  {id:'fe-dep-nuxt-fbh',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Nuxt')&&inc(a.deploy,'Firebase'),
   ja:'Nuxt 3はVercel/Netlifyが最適デプロイ先です',
   en:'Nuxt 3 deploys best on Vercel or Netlify'},
  // ── AI Auto ↔ Skill (3 WARN) ──
  {id:'ai-sk-auto-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>inc(a.ai_auto,'自律')||inc(a.ai_auto,'Autonomous'),
   ja:'フル自律開発には上級スキルが必要です。段階的に進めましょう',
   en:'Full autonomous dev requires advanced skills. Progress gradually',
   cond:a=>a.skill_level==='Beginner'},
  {id:'ai-sk-orch-notpro',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'オーケストレーター')||inc(a.ai_auto,'Orchestrator'))&&a.skill_level!=='Professional',
   ja:'オーケストレーターはCI/CD統合の経験が必要です',
   en:'Orchestrator requires CI/CD integration experience'},
  {id:'ai-sk-multi-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'マルチ')||inc(a.ai_auto,'Multi'))&&a.skill_level==='Beginner',
   ja:'マルチAgent協調は中級以上の経験が推奨です',
   en:'Multi-Agent coordination recommended for intermediate+'},
  // ── BE ↔ Payment (2 WARN) ──
  {id:'be-pay-static-stripe',p:['backend','payment'],lv:'warn',
   t:a=>isStaticBE(a)&&a.payment&&(inc(a.payment,'Stripe')),
   ja:'Stripe webhookにはサーバーが必要。Supabase Edge Functionsで対応可能',
   en:'Stripe webhooks need a server. Supabase Edge Functions can help'},
  {id:'be-pay-saleor-notpy',p:['backend','payment'],lv:'warn',
   t:a=>a.payment&&inc(a.payment,'Saleor')&&!isPyBE(a),
   ja:'SaleorはPython/Django製です。Python系バックエンドが必要',
   en:'Saleor is built with Python/Django. Python backend required',
   fix:{f:'backend',s:'Python + Django'}},
  {id:'ai-antigravity-windsurf',p:['ai_tools'],lv:'warn',
   t:a=>inc(a.ai_tools,'Antigravity')&&inc(a.ai_tools,'Windsurf'),
   ja:'AntigravityはWindsurf統合版です。どちらか一方で十分です',
   en:'Antigravity integrates Windsurf. One is sufficient',
   fix:{f:'ai_tools',s:'Google Antigravity'}},
  {id:'ai-openrouter-hub',p:['ai_tools'],lv:'info',
   t:a=>inc(a.ai_tools,'OpenRouter'),
   ja:'OpenRouterはBYOKハブです。Aider/Cline等のAPIバックエンドとして活用できます',
   en:'OpenRouter is a BYOK hub. Use as API backend for Aider/Cline etc.'},
  // ── Semantic Consistency Rules (Phase A) ── 8 rules ──
  // A1: scope_out「ネイティブ」 vs mobile有効
  {id:'sem-scope-mobile',p:['scope_out','mobile'],lv:'error',
   t:a=>(inc(a.scope_out,'ネイティブ')||inc(a.scope_out,'native')||inc(a.scope_out,'Native'))&&a.mobile&&a.mobile!=='none'&&!inc(a.mobile,'PWA'),
   ja:'スコープ外に「ネイティブアプリ」がありますが、モバイル対応が有効です。生成文書が矛盾します — どちらかを修正してください',
   en:'Scope excludes "native apps" but mobile support is enabled. Generated docs will conflict — fix one or the other'},
  // A2: scope_out「決済/EC」 vs payment有効
  {id:'sem-scope-payment',p:['scope_out','payment'],lv:'warn',
   t:a=>(inc(a.scope_out,'決済')||inc(a.scope_out,'EC')||inc(a.scope_out,'payment')||inc(a.scope_out,'Payment'))&&a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none',
   ja:'スコープ外に「決済/EC」がありますが、決済方式が選択されています。仕様書のスコープ定義に矛盾が生じます',
   en:'Scope excludes "payment/EC" but a payment method is selected. Spec scope definition will conflict'},
  // A3: scope_out「EC」 vs entities に Product/Order
  {id:'sem-scope-entities',p:['scope_out','data_entities'],lv:'warn',
   t:a=>(inc(a.scope_out,'EC')||inc(a.scope_out,'commerce')||inc(a.scope_out,'Commerce'))&&(inc(a.data_entities,'Product')||inc(a.data_entities,'Order')||inc(a.data_entities,'Cart')),
   ja:'スコープ外に「EC」がありますが、エンティティにProduct/Orderが含まれています。ERとスコープが矛盾します',
   en:'Scope excludes "EC" but entities include Product/Order. ER and scope will conflict'},
  // A4: deploy=Vercel && backend=Express/Fastify（常駐サーバー型）
  {id:'sem-deploy-express',p:['deploy','backend'],lv:'warn',
   t:a=>inc(a.deploy,'Vercel')&&(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&!inc(a.frontend,'Next.js'),
   ja:'VercelでExpress/Fastifyを動かすにはServerless Functionsに変換が必要です。Next.js API RoutesまたはRailway/Renderへの分離を検討してください',
   en:'Running Express/Fastify on Vercel requires Serverless Functions. Consider Next.js API Routes or split to Railway/Render',
   fix:{f:'deploy',s:'Railway'}},
  // A5: backend=Supabase && auth に NextAuth/Auth.js
  {id:'sem-auth-supa-nextauth',p:['auth','backend'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&(inc(a.auth,'NextAuth')||inc(a.auth,'Auth.js')),
   ja:'Supabase利用時はSupabase Authが統合されています。NextAuth/Auth.jsとの併用は認証SoTが二重化します',
   en:'Supabase includes built-in Auth. Using NextAuth/Auth.js creates dual auth sources of truth',
   fix:{f:'auth',s:'Supabase Auth'}},
  // A6: backend≠Supabase && auth に Supabase Auth
  {id:'sem-auth-nosupa-supaauth',p:['auth','backend'],lv:'warn',
   t:a=>!inc(a.backend,'Supabase')&&inc(a.auth,'Supabase Auth'),
   ja:'Supabase Authが選択されていますが、バックエンドがSupabaseではありません。認証の接続先が不明確になります',
   en:'Supabase Auth selected but backend is not Supabase. Auth connection target will be unclear',
   fix:{f:'backend',s:'Supabase'}},
  // A7: purpose=教育系 && entities に Product/Order（ドメイン不一致）
  {id:'sem-purpose-entities',p:['purpose','data_entities'],lv:'info',
   t:a=>(inc(a.purpose,'教育')||inc(a.purpose,'学習')||inc(a.purpose,'Education')||inc(a.purpose,'Learning')||inc(a.purpose,'LMS'))&&(inc(a.data_entities,'Product')||inc(a.data_entities,'Order')),
   ja:'教育・学習系のプロジェクトにProduct/Orderエンティティがあります。教材販売が目的でなければCourse/Lessonへの変更を検討してください',
   en:'Education project has Product/Order entities. Consider Course/Lesson unless this is for course sales'},
  // A8: deploy=Vercel && backend含Express && frontend含Next.js（BFF曖昧）
  {id:'sem-deploy-bff',p:['deploy','backend','frontend'],lv:'info',
   t:a=>inc(a.deploy,'Vercel')&&inc(a.backend,'Express')&&inc(a.frontend,'Next.js'),
   ja:'Next.js + Express + Vercelの構成です。ExpressをNext.js API Routesに統合するか、Expressを別ホスト（Railway等）にする設計判断が必要です。生成文書ではAPI Routes統合を前提とします',
   en:'Next.js + Express + Vercel stack detected. Decide whether to merge Express into Next.js API Routes or host Express separately. Generated docs will assume API Routes integration'},
];
// helpers
function inc(v,k){return v&&typeof v==='string'&&v.indexOf(k)!==-1;}
function isPyBE(a){return inc(a.backend,'Python')||inc(a.backend,'FastAPI')||inc(a.backend,'Django');}
function isNodeBE(a){return inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'NestJS')||inc(a.backend,'Hono');}
function isStaticBE(a){return inc(a.backend,'なし')||inc(a.backend,'None')||inc(a.backend,'static');}
function checkCompat(answers){
  if(!answers)return[];
  return COMPAT_RULES.filter(r=>{
    try{
      if(r.cond&&!r.cond(answers))return false;
      const keys=r.p;
      if(keys.some(k=>!answers[k]))return false;
      return r.t(answers);
    }catch(e){return false;}
  }).map(r=>({id:r.id,pair:r.p,level:r.lv,msg:S.lang==='ja'?r.ja:r.en,fix:r.fix||null}));
}
