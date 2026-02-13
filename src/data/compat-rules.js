/* ═══ STACK COMPATIBILITY & SEMANTIC CONSISTENCY RULES — 48 rules (ERROR×10 + WARN×30 + INFO×8) ═══ */
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
  {id:'be-mobile-static',p:['backend','mobile'],lv:'info',
   t:a=>isStaticBE(a)&&a.mobile&&!inc(a.mobile,'なし')&&!inc(a.mobile,'None')&&a.mobile!=='none'&&!inc(a.mobile,'PWA'),
   ja:'モバイルアプリにはAPI用バックエンドが必要です。Supabase/Firebase等のBaaSを検討してください',
   en:'Mobile apps need an API backend. Consider BaaS like Supabase/Firebase',
   fix:{f:'backend',s:'Supabase'}},
  // ── BE ↔ ORM (3 ERROR, 1 WARN) ──
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
  {id:'be-orm-static',p:['backend','orm'],lv:'warn',
   t:a=>isStaticBE(a)&&a.orm&&!inc(a.orm,'なし')&&!inc(a.orm,'None')&&a.orm!=='none',
   ja:'静的サイトではORMは不要です',
   en:'ORM is unnecessary for static sites',
   fix:{f:'orm',s:'None / Using BaaS'}},
  // ── BE ↔ DB (4 WARN) ──
  {id:'be-db-fb-notfs',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.database&&!inc(a.database,'Firestore'),
   ja:'Firebase利用時はFirestoreが最適です',
   en:'Firestore is the optimal DB for Firebase',
   fix:{f:'database',s:'Firestore'}},
  {id:'be-db-supa-notpg',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&a.database&&!inc(a.database,'Supabase')&&!inc(a.database,'PostgreSQL')&&!inc(a.database,'Neon'),
   ja:'Supabase利用時はSupabase (PostgreSQL)が統合されています',
   en:'Supabase integrates best with Supabase (PostgreSQL)',
   fix:{f:'database',s:'Supabase (PostgreSQL)'}},
  {id:'be-db-static-db',p:['backend','database'],lv:'warn',
   t:a=>isStaticBE(a)&&a.database&&!inc(a.database,'なし')&&a.database!=='None',
   ja:'静的サイトではDBは通常不要です',
   en:'Static sites typically do not need a database',
   fix:{f:'database',s:'None'}},
  {id:'be-db-py-fs',p:['backend','database'],lv:'warn',
   t:a=>isPyBE(a)&&inc(a.database,'Firestore'),
   ja:'PythonとFirestoreの相性は中程度。PostgreSQLが推奨です',
   en:'Python + Firestore compatibility is moderate. PostgreSQL recommended',
   fix:{f:'database',s:'PostgreSQL'}},
  // ── BE ↔ Deploy (5 WARN) ──
  {id:'be-dep-java-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&inc(a.deploy,'Vercel'),
   ja:'VercelはNode.js/Python前提です。Railway/AWS/Dockerが必要',
   en:'Vercel supports Node.js/Python. Use Railway/AWS/Docker for Java/Go',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-fb-notfbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.deploy&&!inc(a.deploy,'Firebase'),
   ja:'Firebase利用時はFirebase Hostingが最適です',
   en:'Firebase Hosting is optimal when using Firebase backend',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  {id:'be-dep-supa-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&inc(a.deploy,'Firebase'),
   ja:'SupabaseにはVercelまたはSupabase Hostingが推奨です',
   en:'Use Vercel or Supabase Hosting with Supabase backend',
   fix:{f:'deploy',s:'Vercel'}},
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
   en:'Angular on Vercel is limited. Use Firebase Hosting or AWS',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  {id:'fe-dep-nuxt-fbh',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Nuxt')&&inc(a.deploy,'Firebase'),
   ja:'Nuxt 3はVercel/Netlifyが最適デプロイ先です',
   en:'Nuxt 3 deploys best on Vercel or Netlify',
   fix:{f:'deploy',s:'Vercel'}},
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
   en:'Stripe webhooks need a server. Supabase Edge Functions can help',
   fix:{f:'backend',s:'Supabase'}},
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
  // ── ORM ↔ DB (2 WARN/ERROR) ──
  {id:'orm-prisma-mongo',p:['orm','database'],lv:'warn',
   t:a=>inc(a.orm,'Prisma')&&inc(a.database,'MongoDB'),
   ja:'PrismaのMongoDB対応はPreview段階です。本番環境では注意が必要',
   en:'Prisma MongoDB support is in Preview. Use with caution in production'},
  {id:'orm-drizzle-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Drizzle')&&inc(a.database,'Firestore'),
   ja:'DrizzleはSQL専用です。Firestore非対応',
   en:'Drizzle is SQL-only, not compatible with Firestore',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'orm-drizzle-mongo',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Drizzle')&&inc(a.database,'MongoDB'),
   ja:'DrizzleはSQL専用です。MongoDB非対応',
   en:'Drizzle is SQL-only, not compatible with MongoDB',
   fix:{f:'orm',s:'Prisma'}},
  // ── Deploy ↔ DB (2 WARN/INFO) ──
  {id:'dep-db-vercel-pg',p:['deploy','database'],lv:'warn',
   t:a=>inc(a.deploy,'Vercel')&&inc(a.database,'PostgreSQL')&&!inc(a.database,'Neon')&&!inc(a.database,'Supabase'),
   ja:'Vercel+PostgreSQLは外部ホスティング必要。Neon/Supabase/Vercel Postgresを推奨',
   en:'Vercel+PostgreSQL needs external hosting. Use Neon/Supabase/Vercel Postgres',
   fix:{f:'database',s:'Neon (PostgreSQL)'}},
  {id:'dep-db-cf-pg',p:['deploy','database'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'PostgreSQL'),
   ja:'Cloudflare Workers→外部DBはHyperdriveまたはD1への移行を推奨',
   en:'Cloudflare Workers → external DB: use Hyperdrive or consider D1'},
  // ── Domain ↔ Auth/Payment (2 ERROR/WARN) ──
  {id:'dom-sec-noauth',p:['purpose','auth'],lv:'error',
   t:a=>{
    if(!a.purpose||!a.auth)return false;
    const dom=detectDomain(a.purpose);
    const highSecDomains=['fintech','health','legal'];
    const hasAuth=a.auth&&!inc(a.auth,'なし')&&!inc(a.auth,'None')&&a.auth!=='none';
    return highSecDomains.includes(dom)&&!hasAuth;
   },
   ja:'金融/医療/法務ドメインでは認証必須です',
   en:'Auth is required for fintech/health/legal domains',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'dom-ec-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
    if(!a.purpose||!a.payment)return false;
    const dom=detectDomain(a.purpose);
    const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
    return dom==='ec'&&!hasPay;
   },
   ja:'ECドメインで決済未選択です。Stripe等の決済方式を検討してください',
   en:'EC domain without payment. Consider Stripe or other payment methods'},
  // ── AI Auto ↔ Tools (1 WARN) ──
  {id:'ai-auto-notools',p:['ai_auto','ai_tools'],lv:'warn',
   t:a=>{
    if(!a.ai_auto||!a.ai_tools)return false;
    const hasAuto=a.ai_auto&&!inc(a.ai_auto,'なし')&&!inc(a.ai_auto,'None')&&a.ai_auto!=='none';
    const hasTools=a.ai_tools&&!inc(a.ai_tools,'なし')&&!inc(a.ai_tools,'None')&&a.ai_tools!=='none';
    return hasAuto&&!hasTools;
   },
   ja:'AI自律レベル設定済みですが、AIツール未選択です。Cursor/Claude Code等を選択してください',
   en:'AI autonomous level set but no AI tools selected. Choose Cursor/Claude Code etc.'},
  // ── Convex ↔ FE/ORM (2 WARN/INFO) ──
  {id:'be-convex-noreact',p:['backend','frontend'],lv:'warn',
   t:a=>inc(a.backend,'Convex')&&!inc(a.frontend,'React')&&!inc(a.frontend,'Next'),
   ja:'ConvexはReact最適化されています。React/Next.js推奨',
   en:'Convex is optimized for React. React/Next.js recommended'},
  {id:'be-convex-orm',p:['backend','orm'],lv:'info',
   t:a=>inc(a.backend,'Convex')&&a.orm&&!inc(a.orm,'なし')&&!inc(a.orm,'None')&&a.orm!=='none',
   ja:'ConvexはTypeScript定義で完結します。ORMは通常不要',
   en:'Convex uses TypeScript definitions. ORM typically not needed',
   fix:{f:'orm',s:'None / Using BaaS'}},
  // ── Misc (2 INFO) ──
  {id:'ai-tools-multi',p:['ai_tools'],lv:'info',
   t:a=>{
    if(!a.ai_tools)return false;
    const tools=(a.ai_tools||'').split(',').filter(x=>x.trim()).length;
    return tools>=3;
   },
   ja:'複数AIツール(3+)選択時は、CLAUDE.md等のAIルールが統一管理されます',
   en:'Multiple AI tools (3+) selected: AI rules are unified via CLAUDE.md'},
  {id:'mobile-expo-rn',p:['mobile'],lv:'info',
   t:a=>inc(a.mobile,'bare')||inc(a.mobile,'Bare'),
   ja:'React Native bareは柔軟性が高いですが、Expoの方が開発速度が速いです',
   en:'React Native bare offers flexibility, but Expo is faster for development',
   fix:{f:'mobile',s:'Expo (Managed)'}},
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
   en:'Education project has Product/Order entities. Consider Course/Lesson unless this is for course sales',
   fixFn:a=>({f:'data_entities',s:(a.data_entities||'').replace(/Product/g,'Course').replace(/Order/g,'Enrollment')})},
  // A8: deploy=Vercel && backend含Express && frontend含Next.js（BFF曖昧）
  {id:'sem-deploy-bff',p:['deploy','backend','frontend'],lv:'info',
   t:a=>inc(a.deploy,'Vercel')&&inc(a.backend,'Express')&&inc(a.frontend,'Next.js'),
   ja:'Next.js + Express + Vercelの構成です。ExpressをNext.js API Routesに統合するか、Expressを別ホスト（Railway等）にする設計判断が必要です。生成文書ではAPI Routes統合を前提とします',
   en:'Next.js + Express + Vercel stack detected. Decide whether to merge Express into Next.js API Routes or host Express separately. Generated docs will assume API Routes integration'},
  // ── Security Rules (3 rules: 1 ERROR + 2 WARN) ──
  // S1: 金融/医療/法務 + MFA未設定
  {id:'dom-sec-nomfa',p:['purpose','mvp_features'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     if(!dom)return false;
     const isSensitiveDomain=['fintech','health','legal'].includes(dom);
     const hasMFA=inc(a.mvp_features,'MFA')||inc(a.mvp_features,'二要素')||inc(a.mvp_features,'2FA')||inc(a.mvp_features,'多要素');
     return isSensitiveDomain&&!hasMFA;
   },
   ja:'金融/医療/法務系のプロジェクトですが、MFA（多要素認証）が設定されていません。セキュリティ強化のためMFA導入を推奨します',
   en:'Finance/health/legal project without MFA (multi-factor authentication). MFA is strongly recommended for security'},
  // S2: 決済あり + 認証なし
  {id:'dom-sec-pay-noauth',p:['payment','auth'],lv:'error',
   t:a=>{
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     const noAuth=!a.auth||inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return hasPay&&noAuth;
   },
   ja:'決済機能が有効ですが、認証が設定されていません。決済機能には必ず認証が必要です',
   en:'Payment is enabled but authentication is not configured. Payment features require authentication',
   fix:{f:'auth',s:'Supabase Auth'}},
  // S3: 機密エンティティ + 認証なし
  {id:'dom-sec-sensitive-noauth',p:['data_entities','auth'],lv:'warn',
   t:a=>{
     const sensitiveEntities=['Patient','Transaction','Payment','MedicalRecord','Claim','Contract','Invoice','BankAccount','CreditCard','Prescription','Diagnosis'];
     const hasSensitive=sensitiveEntities.some(e=>inc(a.data_entities,e));
     const noAuth=!a.auth||inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return hasSensitive&&noAuth;
   },
   ja:'Patient/Transaction等の機密情報を扱うエンティティがありますが、認証が設定されていません。個人情報保護のため認証の導入を推奨します',
   en:'Sensitive entities (Patient/Transaction/etc.) detected without authentication. Authentication is recommended for privacy protection',
   fix:{f:'auth',s:'Supabase Auth'}},
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
  }).map(r=>({id:r.id,pair:r.p,level:r.lv,msg:S.lang==='ja'?r.ja:r.en,fix:r.fix||(r.fixFn?r.fixFn(answers):null)}));
}

// ── Stack Synergy Score Data ──
const SYNERGY_FE_BE={'Next.js|Supabase':95,'Next.js|Firebase':92,'Next.js|Vercel':98,'Next.js|Express':85,'Next.js|NestJS':88,'Next.js|Convex':93,'React|Express':80,'React|Firebase':88,'React|Supabase':90,'Vue|Nuxt|Express':82,'Vue|Nuxt|Firebase':85,'Svelte|SvelteKit|Supabase':90,'Astro|static':95,'Astro|Supabase':88,'Angular|NestJS':90,'Angular|Firebase':92};
const SYNERGY_DEPLOY={'Next.js|Vercel':98,'Nuxt|Vercel':95,'Nuxt|Netlify':93,'SvelteKit|Vercel':94,'Astro|Vercel':96,'Astro|Netlify':95,'Astro|Cloudflare':93,'React|Vercel':90,'React|Netlify':88,'Firebase|Firebase':98,'Supabase|Vercel':95,'Express|Railway':92,'NestJS|Railway':94,'Django|Railway':93,'FastAPI|Railway':91,'Spring|Railway':88,'Convex|Vercel':96};
const SYNERGY_DOMAIN={'fintech|Supabase':15,'fintech|PostgreSQL':12,'fintech|Stripe':18,'health|Supabase':14,'health|PostgreSQL':12,'legal|PostgreSQL':10,'ec|Stripe':20,'ec|Saleor':18,'ec|Supabase':12,'education|Firebase':10,'education|Supabase':12,'saas|Supabase':15,'saas|Stripe':18,'iot|Firebase':12,'iot|Supabase':10,'community|Firebase':14,'content|Supabase':12,'marketplace|Stripe':15};

function calcSynergy(a){
  if(!a||!a.frontend||!a.backend)return{overall:60,d1:60,d2:60,d3:60,d4:60,d5:60,domain:null};
  const fe=a.frontend||'';const be=a.backend||'';const dep=a.deploy||'';const db=a.database||'';const pay=a.payment||'';
  // D1: FE↔BE affinity
  let d1=60;
  const feKey=fe.split(' ')[0];const beKey=be.split(' ')[0]||be.split('+')[1]?.trim()||be;
  const key1=feKey+'|'+beKey;const key2=fe.includes('Next')?'Next.js|'+beKey:null;
  d1=SYNERGY_FE_BE[key1]||SYNERGY_FE_BE[key2]||60;
  if(inc(fe,'React')&&inc(be,'Express'))d1=80;
  if(inc(fe,'React')&&inc(be,'Supabase'))d1=90;
  if(inc(fe,'Vue')&&inc(be,'Express'))d1=82;
  if(inc(fe,'Svelte')&&inc(be,'Supabase'))d1=90;
  // D2: Ecosystem unity
  let d2=50;
  const isBaaS=inc(be,'Firebase')||inc(be,'Supabase')||inc(be,'Convex');
  if(isBaaS&&((inc(be,'Firebase')&&inc(db,'Firestore'))||(inc(be,'Supabase')&&inc(db,'Supabase'))||(inc(be,'Convex')&&!db)))d2+=20;
  if(inc(fe,'Next')&&inc(dep,'Vercel'))d2+=15;
  if(inc(fe,'Nuxt')&&(inc(dep,'Vercel')||inc(dep,'Netlify')))d2+=12;
  if(inc(fe,'Astro')&&(inc(dep,'Vercel')||inc(dep,'Netlify')||inc(dep,'Cloudflare')))d2+=15;
  d2=Math.min(100,d2);
  // D3: Domain fit
  let d3=60;
  const dom=detectDomain(a.purpose||'');
  if(dom){
    const keys=[dom+'|'+beKey,dom+'|'+db.split(' ')[0],dom+'|'+pay.split(' ')[0]];
    keys.forEach(k=>{if(SYNERGY_DOMAIN[k])d3+=SYNERGY_DOMAIN[k];});
    d3=Math.min(100,d3);
  }
  // D4: Deploy alignment
  let d4=60;
  const depKey1=(fe.includes('Next')?'Next.js':feKey)+'|'+dep.split(' ')[0];
  const depKey2=beKey+'|'+dep.split(' ')[0];
  d4=SYNERGY_DEPLOY[depKey1]||SYNERGY_DEPLOY[depKey2]||60;
  if(inc(be,'Firebase')&&inc(dep,'Firebase'))d4=98;
  if(inc(be,'Supabase')&&inc(dep,'Vercel'))d4=95;
  // D5: Complexity balance
  let d5=70;
  const skill=a.skill_level||'Intermediate';
  const complexStack=(inc(be,'NestJS')||inc(be,'Spring')||inc(be,'Django'))?1:0;
  const hasMobile=a.mobile&&!inc(a.mobile,'なし')&&!inc(a.mobile,'None')&&a.mobile!=='none'?1:0;
  const hasPayment=pay&&!inc(pay,'なし')&&!inc(pay,'None')&&pay!=='none'?1:0;
  const complexity=complexStack+hasMobile+hasPayment;
  if(skill==='Beginner'&&complexity>=2)d5=40;
  else if(skill==='Beginner'&&complexity===1)d5=60;
  else if(skill==='Professional')d5=90;
  else d5=70;
  const overall=Math.round(d1*0.25+d2*0.25+d3*0.2+d4*0.2+d5*0.1);
  return{overall,d1:Math.round(d1),d2:Math.round(d2),d3:Math.round(d3),d4:Math.round(d4),d5:Math.round(d5),domain:dom};
}
