/* ═══ STACK COMPATIBILITY & SEMANTIC CONSISTENCY RULES — 91 rules (ERROR×13 + WARN×53 + INFO×25) ═══ */
const COMPAT_RULES=[
  // ── FE ↔ Mobile (2 ERROR) ──
  {id:'fe-mob-expo',p:['frontend','mobile'],lv:'error',
   t:a=>inc(a.mobile,'Expo')&&!inc(a.frontend,'React'),
   ja:'ExpoはReact Native専用です。フロントをReact系に変更してください',
   en:'Expo requires React. Change frontend to a React-based option',
   why_ja:'ExpoはReact Nativeのコンポーネントシステムに完全依存しています。Vue/Svelte等のコンポーネントはExpoのネイティブAPIと互換性がなく、ビルド時にモジュール解決エラーでクラッシュします。',
   why_en:'Expo is built entirely on React Native\'s component system. Components from Vue/Svelte etc. cannot bind to Expo\'s native APIs and will crash with module resolution errors at build time.',
   fix:{f:'frontend',s:'React + Next.js'}},
  {id:'fe-mob-astro',p:['frontend','mobile'],lv:'error',
   t:a=>inc(a.frontend,'Astro')&&inc(a.mobile,'Expo'),
   ja:'AstroはSSG専用でExpoと併用できません。React + Next.jsを推奨',
   en:'Astro is SSG-only and incompatible with Expo. Use React + Next.js',
   why_ja:'AstroはHTMLを静的出力するSSGです。ExpoのネイティブAPIはReact Nativeランタイムを必要とし、AstroのHTML出力とは根本的に異なるアーキテクチャです。両者を組み合わせる実行パスは存在しません。',
   why_en:'Astro is an SSG that outputs HTML. Expo\'s native APIs require the React Native runtime — an architecture fundamentally different from Astro\'s HTML output. There is no execution path that combines both.',
   fix:{f:'frontend',s:'React + Next.js'}},
  {id:'be-mobile-static',p:['backend','mobile'],lv:'info',
   t:a=>isStaticBE(a)&&a.mobile&&!inc(a.mobile,'なし')&&!inc(a.mobile,'None')&&a.mobile!=='none'&&!inc(a.mobile,'PWA'),
   ja:'モバイルアプリにはAPI用バックエンドが必要です。Supabase/Firebase等のBaaSを検討してください',
   en:'Mobile apps need an API backend. Consider BaaS like Supabase/Firebase',
   fix:{f:'backend',s:'Supabase'}},
  // ── Mobile ↔ Auth (3 WARN) ──
  {id:'mob-noauth',p:['mobile','auth'],lv:'warn',
   t:a=>{
    if(!a.mobile||!a.auth)return false;
    const hasMobile=a.mobile&&!inc(a.mobile,'なし')&&!inc(a.mobile,'None')&&a.mobile!=='none'&&!inc(a.mobile,'PWA');
    const hasAuth=a.auth&&!inc(a.auth,'なし')&&!inc(a.auth,'None')&&a.auth!=='none';
    return hasMobile&&!hasAuth;
   },
   ja:'モバイルアプリでは認証がほぼ必須です。Supabase Auth/Firebase Auth推奨',
   en:'Mobile apps almost always need authentication. Use Supabase Auth/Firebase Auth',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Expo')&&inc(a.auth,'NextAuth'),
   ja:'NextAuthはWeb専用。React Nativeには@react-native-google-signin等のアダプター必要',
   en:'NextAuth is web-only. React Native needs adapters like @react-native-google-signin',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-flutter-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Flutter')&&(inc(a.auth,'NextAuth')||inc(a.auth,'Auth.js')),
   ja:'FlutterではNextAuth/Auth.jsは直接利用できません。Firebase Auth/Supabase Auth推奨',
   en:'NextAuth/Auth.js is web-only. Flutter needs Firebase Auth/Supabase Auth',
   fix:{f:'auth',s:'Supabase Auth'}},
  // ── BE ↔ ORM (4 ERROR, 1 WARN) ──
  {id:'be-orm-py-prisma',p:['backend','orm'],lv:'error',
   t:a=>isPyBE(a)&&inc(a.orm,'Prisma')||isPyBE(a)&&inc(a.orm,'Drizzle')||isPyBE(a)&&inc(a.orm,'TypeORM')||isPyBE(a)&&inc(a.orm,'Kysely'),
   ja:'Prisma/Drizzle/TypeORM/KyselyはNode.js専用です。SQLAlchemyを選択してください',
   en:'Prisma/Drizzle/TypeORM/Kysely are Node.js-only. Choose SQLAlchemy',
   why_ja:'これらのORMはTypeScriptの型システムとNode.jsランタイムに依存しています。Pythonインタープリターはnpmパッケージを実行できず、インポート時に即座にModuleNotFoundErrorが発生します。PythonにはSQLAlchemy/Tortoise-ORMがあります。',
   why_en:'These ORMs depend on TypeScript\'s type system and the Node.js runtime. Python cannot run npm packages — importing them causes immediate ModuleNotFoundError. Python has its own ORMs: SQLAlchemy and Tortoise-ORM.',
   fix:{f:'orm',s:'SQLAlchemy (Python)'}},
  {id:'be-orm-java-prisma',p:['backend','orm'],lv:'error',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&(inc(a.orm,'Prisma')||inc(a.orm,'Drizzle')||inc(a.orm,'Kysely')||inc(a.orm,'TypeORM')||inc(a.orm,'SQLAlchemy')),
   ja:'Prisma/Drizzle/TypeORM/Kysely/SQLAlchemyはJava/Goに非対応です',
   en:'Prisma/Drizzle/TypeORM/Kysely/SQLAlchemy are not compatible with Java/Go backends',
   why_ja:'これらのORMはNode.js(npm)またはPython(pip)のランタイムに依存しています。JavaはJVM上で、GoはGoランタイムで動作するため、実行環境が根本的に異なります。Java/GoにはJPA/Hibernate・GORM等の専用ORMがあります。',
   why_en:'These ORMs depend on the Node.js (npm) or Python (pip) runtimes. Java runs on the JVM and Go uses its own runtime — fundamentally incompatible environments. Java/Go have their own ORMs: JPA/Hibernate and GORM.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'be-orm-node-sqla',p:['backend','orm'],lv:'error',
   t:a=>isNodeBE(a)&&inc(a.orm,'SQLAlchemy'),
   ja:'SQLAlchemyはPython専用です。Prisma/Drizzleを選択してください',
   en:'SQLAlchemy is Python-only. Choose Prisma or Drizzle',
   why_ja:'SQLAlchemyはPythonのデコレーター・型アノテーション・asyncioと密結合しており、PyPIパッケージとして配布されています。Node.jsのnpmには存在せず、`require(\'sqlalchemy\')`は常にエラーになります。',
   why_en:'SQLAlchemy is tightly coupled to Python\'s decorators, type annotations, and asyncio, and is distributed as a PyPI package. It does not exist on npm — `require(\'sqlalchemy\')` will always throw.',
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
   chain:[{f:'database',s:'Supabase (PostgreSQL)'},{f:'orm',s:'None / Using BaaS'}]},
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
  // ── BE ↔ Deploy (7 WARN) ──
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
  {id:'be-dep-heavy-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.deploy,'Netlify')&&(inc(a.backend,'Django')||inc(a.backend,'Spring')||inc(a.backend,'Laravel')),
   ja:'Django/Spring/LaravelのNetlifyデプロイは大幅な制限があります。Railway推奨',
   en:'Django/Spring/Laravel have severe limitations on Netlify. Railway recommended',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-nest-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Netlify'),
   ja:'NestJSのNetlifyデプロイは制限があります。Railway推奨',
   en:'NestJS on Netlify has limitations. Railway recommended',
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
  // ── ORM ↔ DB (4 WARN/ERROR) ──
  {id:'orm-prisma-mongo',p:['orm','database'],lv:'warn',
   t:a=>inc(a.orm,'Prisma')&&inc(a.database,'MongoDB'),
   ja:'PrismaのMongoDB対応はPreview段階です。本番環境では注意が必要',
   en:'Prisma MongoDB support is in Preview. Use with caution in production'},
  {id:'orm-drizzle-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Drizzle')&&inc(a.database,'Firestore'),
   ja:'DrizzleはSQL専用です。Firestore非対応',
   en:'Drizzle is SQL-only, not compatible with Firestore',
   why_ja:'DrizzleはSQL構文（SELECT/JOIN/WHERE）を型安全に生成するORMです。FirestoreはGoogleのドキュメントDBでSQLインターフェースを持たず、DrizzleのクエリをFirestore APIに変換するアダプターは存在しません。',
   why_en:'Drizzle generates type-safe SQL (SELECT/JOIN/WHERE). Firestore is a document DB with no SQL interface — there is no adapter to translate Drizzle queries into Firestore API calls.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'orm-drizzle-mongo',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Drizzle')&&inc(a.database,'MongoDB'),
   ja:'DrizzleはSQL専用です。MongoDB非対応',
   en:'Drizzle is SQL-only, not compatible with MongoDB',
   why_ja:'DrizzleのスキーマはSQL TABLE定義に基づいており、JOINやトランザクションもSQL前提です。MongoDBはドキュメント指向でSQL文法を持たないため、Drizzleとの接続はサポートされていません。MongoDBにはPrismaが対応しています。',
   why_en:'Drizzle schemas are based on SQL TABLE definitions, and JOINs/transactions assume SQL semantics. MongoDB is document-oriented with no SQL grammar. Drizzle cannot connect to it — use Prisma which supports MongoDB.',
   fix:{f:'orm',s:'Prisma'}},
  {id:'orm-kysely-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Kysely')&&inc(a.database,'Firestore'),
   ja:'KyselyはSQL専用です。Firestore非対応',
   en:'Kysely is SQL-only, not compatible with Firestore',
   why_ja:'KyselyはSQL型安全クエリビルダーです。Firestoreはコレクション/ドキュメントモデルを持つNoSQLで、KyselyのSQL表現（db.selectFrom等）を実行するドライバーがFirestoreには存在しません。',
   why_en:'Kysely is a type-safe SQL query builder. Firestore uses a collection/document model with no SQL driver — there is no way to execute Kysely\'s SQL expressions (db.selectFrom etc.) against Firestore.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'orm-kysely-mongo',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Kysely')&&inc(a.database,'MongoDB'),
   ja:'KyselyはSQL専用です。MongoDB非対応',
   en:'Kysely is SQL-only, not compatible with MongoDB',
   why_ja:'KyselyはPostgreSQL/MySQL/SQLite用のSQL型システムと専用ダイアレクトを持ちます。MongoDBはSQLを使用せず独自のAPIを持つため、Kyselyのダイアレクトレイヤーを通じた接続はサポートされていません。',
   why_en:'Kysely has a SQL type system and dialects for PostgreSQL/MySQL/SQLite. MongoDB uses its own API without SQL — connection through Kysely\'s dialect layer is not supported.',
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
  {id:'dep-db-cf-fs',p:['deploy','database'],lv:'warn',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'Firestore'),
   ja:'Cloudflare Workers + Firestoreはレイテンシー高。D1/KV/Durableを推奨',
   en:'Cloudflare + Firestore has high latency. Consider D1/KV/Durable Objects',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  // ── Deploy ↔ Backend (Cloudflare Workers compatibility) (1 ERROR, 1 WARN, 1 INFO) ──
  {id:'be-dep-heavy-cf',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.backend,'Django')||inc(a.backend,'Spring')||inc(a.backend,'Laravel')),
   ja:'Django/Spring/LaravelはCloudflare Workers非対応（V8制限）。Hono/Express推奨',
   en:'Django/Spring/Laravel incompatible with Cloudflare Workers (V8 limits). Use Hono/Express',
   why_ja:'Cloudflare WorkersはV8 JavaScriptエンジン上で動作し、PythonランタイムもJVM（Java）もPHP実行環境も提供しません。Django・Spring・Laravelはそれぞれのランタイムに依存するため、Workersにデプロイ自体が不可能です。JavaScriptベースのHonoまたはExpressを使用してください。',
   why_en:'Cloudflare Workers run on the V8 JavaScript engine — there is no Python runtime for Django, no JVM for Spring, and no PHP for Laravel. These frameworks depend on their respective runtimes and simply cannot be deployed to Workers. Use a JavaScript-based framework like Hono or Express instead.',
   fix:{f:'backend',s:'Node.js + Hono'}},
  {id:'be-dep-node-cf',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.backend,'Express')||inc(a.backend,'NestJS'))&&!inc(a.backend,'Hono'),
   ja:'Express/NestJSは一部Node API非対応。Cloudflare Workers最適化にはHono推奨',
   en:'Express/NestJS have Node API limitations on Cloudflare. Hono is optimized for Workers',
   fix:{f:'backend',s:'Node.js + Hono'}},
  {id:'be-dep-hono-cf',p:['backend','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.backend,'Hono'),
   ja:'✨ Hono + Cloudflare Workersは最適な組み合わせです（超高速Edge実行）',
   en:'✨ Hono + Cloudflare Workers is optimal (ultra-fast edge execution)'},
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
   why_ja:'金融（取引・口座情報）・医療（PHI・カルテ）・法務（機密文書）のドメインでは、未認証アクセスは法規制違反（FISC・HIPAA・弁護士法等）となるリスクがあります。ユーザーID確認なしには監査ログ・アクセス制御・データ保護が成立しません。認証は機能ではなくコンプライアンス要件です。',
   why_en:'In fintech (transactions, accounts), health (PHI, records), and legal (confidential documents) domains, unauthenticated access risks regulatory violations (PCI-DSS, HIPAA, bar regulations). Without user identity, audit logs, access control, and data protection are impossible. Authentication is a compliance requirement, not a feature.',
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
  // ── Misc (3 INFO) ──
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
  {id:'mob-flutter-firebase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Firebase'),
   ja:'✨ Flutter + Firebaseは最適な組み合わせです（FlutterFire統合）',
   en:'✨ Flutter + Firebase is an excellent combination (FlutterFire integration)'},
  {id:'mob-flutter-supabase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Supabase'),
   ja:'✨ Flutter + Supabaseは良い組み合わせです（supabase_flutter パッケージを使用）',
   en:'✨ Flutter + Supabase works well — use the supabase_flutter package for native SDK access'},
  {id:'mob-expo-drizzle',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Drizzle'),
   ja:'DrizzleはサーバーサイドORMです。Expo(React Native)では動作しません。モバイルにはRNSQLiteまたはBaaSを使用してください',
   en:'Drizzle is a server-side ORM and will not work in Expo (React Native). Use RN SQLite or a BaaS backend instead',
   fix:{f:'orm',s:'Prisma'}},
  {id:'mob-expo-kysely',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Kysely'),
   ja:'KyselyはサーバーサイドSQLビルダーです。Expo(React Native)では動作しません。BaaSバックエンドを使用してください',
   en:'Kysely is a server-side SQL builder and will not work in Expo. Use a BaaS backend instead',
   fix:{f:'orm',s:'Prisma'}},
  // ── Semantic Consistency Rules (Phase A) ── 8 rules ──
  // A1: scope_out「ネイティブ」 vs mobile有効
  {id:'sem-scope-mobile',p:['scope_out','mobile'],lv:'error',
   t:a=>(inc(a.scope_out,'ネイティブ')||inc(a.scope_out,'native')||inc(a.scope_out,'Native'))&&a.mobile&&a.mobile!=='none'&&!inc(a.mobile,'PWA'),
   ja:'スコープ外に「ネイティブアプリ」がありますが、モバイル対応が有効です。生成文書が矛盾します — どちらかを修正してください',
   en:'Scope excludes "native apps" but mobile support is enabled. Generated docs will conflict — fix one or the other',
   why_ja:'「スコープ外」に記述した機能は、仕様書・タスクリスト・テスト計画のすべてで「実装しない」として扱われます。一方でモバイル対応を有効にすると、React Native/ExpoのセットアップやAppStoreデプロイ手順が生成されます。この矛盾により、チームメンバーやAIがどちらの指示に従うべきか判断できなくなります。',
   why_en:'Features listed in "scope out" are treated as "will not implement" across the spec, task list, and test plan. Enabling mobile support simultaneously generates React Native/Expo setup and App Store deployment steps. This contradiction makes it impossible for team members or AI to know which instruction to follow.'},
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
   chain:[{f:'backend',s:'Supabase'},{f:'database',s:'Supabase (PostgreSQL)'}]},
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
   why_ja:'認証なしの決済エンドポイントは誰でも決済処理を呼び出せる状態です。悪意あるユーザーによる不正決済・二重請求・チャージバック詐欺の温床となります。PCI-DSS要件でも認証は必須です。',
   why_en:'Unauthenticated payment endpoints allow anyone to trigger charges. This enables fraudulent payments, double-charging, and chargeback fraud. PCI-DSS compliance also mandates authentication.',
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
  // ── DB設計 (2 WARN + 1 INFO) ──
  {id:'db-mongo-prisma',p:['database','orm'],lv:'warn',
   t:a=>inc(a.database,'MongoDB')&&inc(a.orm,'Prisma'),
   ja:'PrismaのMongoDBサポートは実験的です。Mongooseまたはネイティブドライバーを推奨します',
   en:'Prisma MongoDB support is experimental. Consider Mongoose or the native MongoDB driver'},
  {id:'db-sqlite-prod',p:['database','deploy'],lv:'warn',
   t:a=>{
     const isSQLite=inc(a.database,'SQLite');
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     return isSQLite&&isProd;
   },
   ja:'SQLiteはサーバーレス/クラウドデプロイには不向きです。PostgreSQL (Neon) またはTursoを推奨します',
   en:'SQLite is not suitable for serverless/cloud deployment. Use PostgreSQL (Neon) or Turso',
   why_ja:'SQLiteはファイルベースDBで、並行書き込みが発生するとロック競合を起こします。複数のサーバーレスインスタンスが同時にアクセスすると書き込みが競合し、タイムアウトやデータ破損のリスクがあります。',
   why_en:'SQLite is file-based and serializes writes. Multiple serverless instances competing simultaneously cause lock contention, timeouts, and potential data corruption.',
   fix:{f:'database',s:'Neon (PostgreSQL)'}},
  {id:'db-mysql-kysely',p:['database','orm'],lv:'info',
   t:a=>inc(a.database,'MySQL')&&inc(a.orm,'Kysely'),
   ja:'Kysely + MySQLではmysql2パッケージとMySQLDialectの設定が必要です',
   en:'Kysely + MySQL requires the mysql2 package and MySQLDialect configuration'},
  // ── API品質 (2 WARN) ──
  {id:'api-graphql-no-dataloader',p:['backend'],lv:'warn',
   t:a=>inc(a.backend,'GraphQL'),
   ja:'GraphQL使用時はDataLoaderを導入してN+1問題を防いでください。facebook/dataloaderまたはDataLoader for NestJSを推奨',
   en:'GraphQL detected: implement DataLoader to prevent N+1 queries. Recommended: facebook/dataloader or NestJS DataLoader',
   why_ja:'GraphQLでは、ユーザー一覧10件を取得しそれぞれのプロフィールを取得すると10+1=11回のDBクエリが発生します（N+1問題）。DataLoaderはリクエストをバッチ化し1回のクエリにまとめます。',
   why_en:'GraphQL fetching 10 users and their profiles triggers 10+1=11 DB queries (N+1). DataLoader batches all requests into a single query, dramatically reducing DB load.'},
  {id:'api-rest-no-ratelimit',p:['backend'],lv:'info',
   t:a=>{
     if(!a.backend)return false;
     const isREST=!inc(a.backend,'GraphQL')&&!inc(a.backend,'Supabase')&&!inc(a.backend,'Firebase')&&!inc(a.backend,'Convex');
     const hasAPI=inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'NestJS')||inc(a.backend,'Hono')||inc(a.backend,'FastAPI')||inc(a.backend,'Django')||inc(a.backend,'Spring');
     return isREST&&hasAPI;
   },
   ja:'REST APIにはレート制限の実装を推奨します。express-rate-limit / slowDown (Node) / slowapi (Python) / bucket4j (Spring)',
   en:'REST API: implement rate limiting to prevent abuse. Recommended: express-rate-limit (Node) / slowapi (Python) / bucket4j (Spring)'},
  // ── テスト品質 (1 WARN + 2 INFO) ──
  {id:'test-e2e-auth-storagestate',p:['auth','frontend'],lv:'warn',
   t:a=>{
     const hasAuth=a.auth&&!inc(a.auth,'なし')&&!inc(a.auth,'None')&&a.auth!=='';
     const hasWebFE=inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte');
     const hasMobileOnly=inc(a.mobile,'Expo')||inc(a.mobile,'React Native');
     return hasAuth&&hasWebFE&&!hasMobileOnly;
   },
   ja:'認証付きE2EテストはPlaywright storageStateでセッションを再利用し、不安定なログインフローを防いでください',
   en:'E2E tests with auth: use Playwright storageState to reuse sessions and prevent flaky login flows'},
  {id:'test-playwright-webkit',p:['frontend'],lv:'info',
   t:a=>(inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte'))&&(!a.mobile||inc(a.mobile,'なし')||inc(a.mobile,'None')),
   ja:'PlaywrightのWebKitプロジェクト設定でSafariクロスブラウザテストを追加することを推奨します',
   en:'Add Playwright WebKit project to enable Safari cross-browser test coverage'},
  {id:'test-mutation-stryker',p:['backend'],lv:'info',
   t:a=>isNodeBE(a)||inc(a.backend,'Next.js'),
   ja:'Strykerミューテーションテストを導入してテストの実効性（バグ検出力）を検証することを推奨します',
   en:'Add Stryker mutation testing to measure test effectiveness and catch untested code paths'},
  // ── AI安全性 (3 WARN + 2 INFO) ──
  {id:'ai-guardrail-missing',p:['ai_auto','mvp_features'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return !/(guardrail|ガードレール|安全|safety|filter|フィルタ|sanitize|moderate|モデレート|validation|検証)/i.test(a.mvp_features||'');
   },
   ja:'AI機能が有効ですが、mvp_featuresにガードレール/安全フィルタの記述がありません。入力検証・出力モデレーション・レート制限を実装してください (docs/96参照)',
   en:'AI features active but no guardrail/safety filter in mvp_features. Implement input validation, output moderation, and rate limiting (see docs/96)'},
  {id:'ai-noauth-llm',p:['ai_auto','auth'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
   },
   ja:'AI機能が有効ですが認証が設定されていません。LLMエンドポイントは認証なしでは悪用・コスト爆発のリスクがあります',
   en:'AI features active but no authentication. Unauthenticated LLM endpoints risk abuse and cost explosion',
   why_ja:'認証なしのLLMエンドポイントは誰でも無制限にAPIを呼び出せます。悪意あるユーザーが数万回のリクエストを送ると、月額APIコストが数十万円に膨れ上がる「コスト爆発」が実際に発生しています。',
   why_en:'Unauthenticated LLM endpoints allow unlimited API calls by anyone. Malicious actors sending thousands of requests can cause "cost explosion" — real incidents have resulted in $10,000+ monthly API bills.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'ai-pii-masking',p:['ai_auto','data_entities'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     const piiE=['Patient','MedicalRecord','Transaction','BankAccount','CreditCard','Prescription','Diagnosis','PersonalInfo'];
     return piiE.some(e=>inc(a.data_entities,e));
   },
   ja:'個人情報エンティティ（Patient/Transaction等）がAI機能と併用されています。LLMへの送信前にPIIをマスキング/仮名化してください (docs/95参照)',
   en:'PII entities (Patient/Transaction/etc.) used with AI features. Mask or pseudonymize PII before sending to LLM (see docs/95)'},
  {id:'ai-ratelimit-reminder',p:['ai_auto','backend'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return isNodeBE(a)||isPyBE(a)||inc(a.backend,'Spring');
   },
   ja:'AI機能のあるAPIにはトークン消費量ベースのレート制限を実装してください。@upstash/ratelimit (Node) または slowapi with token tracking (Python) を推奨します',
   en:'Add token-budget rate limiting to AI API endpoints. Recommended: @upstash/ratelimit (Node) or slowapi with token tracking (Python)'},
  {id:'ai-local-model-infra',p:['ai_auto','deploy'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     const isLocal=/(Ollama|LM Studio|ローカルLLM|local LLM|llama|mistral|open.?source|セルフホスト|self.?host)/i.test(a.ai_auto);
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     return isLocal&&isProd;
   },
   ja:'ローカル/セルフホストLLMとクラウドデプロイの組み合わせはGPUインスタンス（RunPod/Lambda Labs）またはvLLM/Ollamaサーバーの別途ホスティングが必要です',
   en:'Local/self-hosted LLM with cloud deployment requires GPU instances (RunPod/Lambda Labs) or separate vLLM/Ollama hosting'},
  // ── クロスピラー P21/P22/P25 (INFO×3) ──
  {id:'api-openapi-remind',p:['mvp_features','data_entities'],lv:'info',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     return ents>=4&&!/(OpenAPI|swagger|api.spec|仕様書)/i.test(a.mvp_features||'');
   },
   ja:'エンティティが4件以上あります。docs/84_openapi_specification.md のOpenAPI 3.1仕様を活用してAPIコントラクトを明確にしてください',
   en:'4+ entities detected. Use OpenAPI 3.1 spec (docs/84) to clarify API contracts and generate client SDKs'},
  {id:'orm-n1-risk',p:['orm','data_entities'],lv:'info',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     const hasRelORM=/(Prisma|TypeORM|Drizzle|SQLAlchemy)/i.test(a.orm||'');
     return hasRelORM&&ents>=5;
   },
   ja:'エンティティが5件以上ありORMを使用しています。N+1問題に注意してください。docs/100_database_performance.md のEAGER LOADING設定を確認してください',
   en:'5+ entities with relational ORM: N+1 risk is high. See docs/100 for eager loading and batch query patterns',
   why_ja:'N+1問題はORMのデフォルト挙動で発生します。例：ユーザー100件を取得→各ユーザーの投稿をループで取得=101クエリ。include/selectでEager Loadingを指定すれば1クエリになります（docs/100参照）。',
   why_en:'N+1 is ORM default behavior. Example: fetch 100 users → loop fetching each user\'s posts = 101 queries. Using include/select for Eager Loading reduces this to 1 query (see docs/100).'},
  {id:'prod-backup-remind',p:['deploy','database'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasDB=a.database&&!/なし|None/i.test(a.database);
     return isProd&&hasDB;
   },
   ja:'本番デプロイ+DB構成を検出しました。docs/90_backup_disaster_recovery.md のRTO/RPO目標とバックアップ戦略を必ず設定してください',
   en:'Production deployment + DB detected. Set RTO/RPO targets and backup strategy per docs/90 before going live'},
  // ── クロスレイヤー整合性 CL-1〜CL-12 (WARN×7 + INFO×5) ──
  {id:'infra-pg-no-pool',p:['deploy','database'],lv:'warn',
   t:a=>{
     const isServerless=/Vercel|Netlify|Cloudflare/i.test(a.deploy||'');
     const isPg=/(PostgreSQL|Neon|Supabase)/i.test(a.database||'');
     const hasPool=/(PgBouncer|Pooler|connection.?pool|pgpool|コネクションプール|接続プール)/i.test((a.mvp_features||'')+(a.backend||''));
     return isServerless&&isPg&&!hasPool;
   },
   ja:'Serverless+PostgreSQL構成です。コネクションプーリング（Neon Pooler/Supabase Pooler/PgBouncer）なしでは接続数枯渇が起きます（docs/100参照）',
   en:'Serverless + PostgreSQL without connection pooling. Neon Pooler/Supabase Pooler/PgBouncer required to prevent connection exhaustion (see docs/100)',
   why_ja:'Serverless関数は起動のたびに新規DB接続を作成します。PgBouncer等のプーリングなしでは数百の同時接続が発生しPostgreSQLの接続上限（通常100）を超えてサービス停止します。',
   why_en:'Serverless functions create new DB connections on each invocation. Without pooling, hundreds of simultaneous connections exceed PostgreSQL\'s limit (typically 100), causing service outages.'},
  {id:'be-python-sync-driver',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'FastAPI')&&/(PostgreSQL|Neon)/i.test(a.database||''),
   ja:'FastAPI + PostgreSQL: 非同期ドライバ（asyncpg または psycopg3）を使用してください。psycopg2はFastAPIのasync処理をブロックします',
   en:'FastAPI + PostgreSQL: use async driver (asyncpg or psycopg3). psycopg2 blocks FastAPI async handlers',
   why_ja:'FastAPIはasync/awaitベースです。同期ドライバのpsycopg2を使うとDBクエリ中にイベントループがブロックされ、他のリクエストが全て待機状態になります。asyncpgなら並行処理を維持できます。',
   why_en:'FastAPI is async/await-based. Synchronous psycopg2 blocks the event loop during DB queries, freezing all other requests. asyncpg maintains concurrency by never blocking the loop.'},
  {id:'auth-enterprise-jwt',p:['auth','purpose'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const isEnterprise=['fintech','legal','insurance','government'].includes(dom);
     const hasCustomJWT=/Custom JWT|custom.?jwt/i.test(a.auth||'');
     return isEnterprise&&hasCustomJWT;
   },
   ja:'Enterprise/Fintech/LegalドメインでカスタムJWTを使用しています。トークン失効・監査ログ・コンプライアンス対応のコストが高騰します。OIDC（NextAuth.js/Auth.js）を推奨します',
   en:'Custom JWT in Enterprise/Fintech/Legal domain. Token revocation, audit logs, and compliance costs are high. Use OIDC (NextAuth.js/Auth.js)',
   fix:{f:'auth',s:'Auth.js/NextAuth'}},
  {id:'api-large-no-pagination',p:['data_entities','mvp_features'],lv:'warn',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     const hasPagination=/(ページネーション|pagination|cursor|infinite.?scroll|limit|offset)/i.test(a.mvp_features||'');
     return ents>=5&&!hasPagination;
   },
   ja:'エンティティが5件以上ありますが、mvp_featuresにページネーションの記述がありません。一覧画面でのパフォーマンス問題を防ぐためカーソルページネーションを実装してください',
   en:'5+ entities but no pagination in mvp_features. Implement cursor-based pagination to prevent list view performance issues'},
  {id:'infra-prod-no-monitoring',p:['deploy','mvp_features'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasMonitor=/(監視|monitoring|Sentry|Datadog|OpenTelemetry|APM|ログ管理|logging|alert|アラート)/i.test(a.mvp_features||'');
     return isProd&&!hasMonitor;
   },
   ja:'本番デプロイ構成ですが、監視/APM（Sentry/Datadog/OpenTelemetry）がmvp_featuresに含まれていません（docs/102参照）',
   en:'Production deployment without monitoring/APM in mvp_features. See docs/102 for Sentry/Datadog/OpenTelemetry setup'},
  {id:'supa-no-rls',p:['backend','data_entities'],lv:'info',
   t:a=>{
     const hasSupa=inc(a.backend,'Supabase');
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     const hasRLS=/(RLS|Row Level Security|行レベルセキュリティ)/i.test(a.mvp_features||'');
     return hasSupa&&ents>=2&&!hasRLS;
   },
   ja:'Supabaseを使用しています。Row Level Security（RLS）ポリシーを全テーブルに設定してください。設定なしでは全データが認証なしで読み取り可能になります（docs/43参照）',
   en:'Supabase in use: enable Row Level Security (RLS) on all tables. Without RLS, all data is readable without authentication (see docs/43)',
   why_ja:'SupabaseはデフォルトでanonymousロールがDB全体にアクセスできます。RLSを有効化しないと、Supabase URLとanon keyを知っている誰もが全ユーザーのデータを読み取れます。これは設計上の意図的なデフォルトであり、開発者側で必ず有効化が必要です。',
   why_en:'Supabase grants the anonymous role full DB access by default. Without RLS enabled, anyone with your URL and anon key can read all user data. This is intentional by design — developers must explicitly enable RLS.'},
  {id:'fe-seo-nossr',p:['frontend','purpose'],lv:'warn',
   t:a=>{
     const seoDomain=['content','media','ec','creator','newsletter','portfolio','travel'].includes(detectDomain(a.purpose||''));
     const isCSR=/(React|Vue|Angular|Svelte)\b/i.test(a.frontend||'')&&!/(Next|Nuxt|SvelteKit|Astro)/i.test(a.frontend||'');
     return seoDomain&&isCSR;
   },
   ja:'SEOが重要なドメインですが、CSRのみのフレームワークを選択しています。Next.js/Nuxt/Astroへの変更でSEOを大幅に改善できます',
   en:'SEO-critical domain with CSR-only framework. Switch to Next.js/Nuxt/Astro for significant SEO improvement',
   fix:{f:'frontend',s:'React + Next.js'}},
  {id:'a11y-no-axe',p:['frontend','mvp_features'],lv:'info',
   t:a=>{
     const hasWebFE=inc(a.frontend,'Next')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte')||inc(a.frontend,'Angular');
     const hasA11y=/(axe|a11y|アクセシビリティ|accessibility|WCAG|WAI-ARIA)/i.test(a.mvp_features||'');
     return hasWebFE&&!hasA11y;
   },
   ja:'アクセシビリティテスト（axe-core/Pa11y）をCI/CDに組み込むことを推奨します（docs/91参照）',
   en:'Add accessibility testing (axe-core/Pa11y) to CI/CD pipeline for inclusive design (see docs/91)'},
  {id:'zt-db-privilege',p:['database','deploy'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasPgMy=/(PostgreSQL|MySQL|Neon)/i.test(a.database||'');
     const hasRoles=/(role|権限|privilege|最小権限|least privilege)/i.test(a.mvp_features||'');
     return isProd&&hasPgMy&&!hasRoles;
   },
   ja:'本番PostgreSQL/MySQL構成です。アプリ用の最小権限ロール（SELECT/INSERT/UPDATE のみ）を作成し、rootユーザーでの接続を避けてください（docs/43参照）',
   en:'Production PostgreSQL/MySQL: create least-privilege app roles (SELECT/INSERT/UPDATE only). Never connect as root (see docs/43)'},
  {id:'api-cors-wildcard',p:['backend','deploy'],lv:'warn',
   t:a=>{
     const hasAPI=inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'NestJS')||inc(a.backend,'Hono')||inc(a.backend,'FastAPI')||inc(a.backend,'Django')||inc(a.backend,'Spring');
     const hasCORS=/(CORS|cors|cross.?origin)/i.test(a.mvp_features||'');
     return hasAPI&&!hasCORS;
   },
   ja:'APIサーバー構成でCORS設定の記述がありません。ワイルドカード（*）許可は禁止し、許可オリジンを明示的に設定してください（docs/43参照）',
   en:'API server without CORS in mvp_features. Never allow wildcard (*) origins — set explicit allowed origins (see docs/43)'},
  {id:'api-graphql-depth-limit',p:['backend','mvp_features'],lv:'warn',
   t:a=>{
     const hasGQL=inc(a.backend,'GraphQL')||/(GraphQL|Apollo)/i.test(a.mvp_features||'');
     const hasDepth=/(depth.?limit|complexity.?limit|深度制限|クエリ制限)/i.test(a.mvp_features||'');
     return hasGQL&&!hasDepth;
   },
   ja:'GraphQLを使用しています。クエリ深度制限（graphql-depth-limit）を設定しないと、悪意ある深いネストクエリでサーバーが停止します',
   en:'GraphQL in use: add query depth limiting (graphql-depth-limit) and complexity limits. Deeply nested queries without limits can crash your server',
   why_ja:'GraphQLは再帰的なクエリを許可します。depth: 100のネストクエリを1リクエストで送ると指数関数的にDBクエリが増加し、DDoS攻撃なしにサーバーをクラッシュさせられます。深度3-10が推奨上限です。',
   why_en:'GraphQL allows recursive queries. A depth-100 nested query exponentially multiplies DB queries, crashing your server without any DDoS tools needed. Depth limits of 3-10 are recommended.'},
  {id:'db-migration-tool',p:['database','orm'],lv:'info',
   t:a=>{
     const hasPgMy=/(PostgreSQL|MySQL|Neon|Supabase)/i.test(a.database||'');
     const hasMigration=/(Prisma|Drizzle|Alembic|Flyway|Liquibase|Kysely|TypeORM|migrate|マイグレーション)/i.test((a.orm||'')+(a.mvp_features||''));
     return hasPgMy&&!hasMigration;
   },
   ja:'SQLデータベースを使用しています。マイグレーションツール（Prisma Migrate/Drizzle Kit/Alembic）の設定を推奨します（docs/88参照）',
   en:'SQL database without migration tool detected. Set up schema migrations (Prisma Migrate/Drizzle Kit/Alembic) for safe schema evolution (see docs/88)'},
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
  }).map(r=>({id:r.id,pair:r.p,level:r.lv,msg:S.lang==='ja'?r.ja:r.en,fix:r.fix||(r.fixFn?r.fixFn(answers):null),chain:r.chain||null,why:S.lang==='ja'?r.why_ja||null:r.why_en||null}));
}

// ── Stack Synergy Score Data ──
const SYNERGY_FE_BE={'Next.js|Supabase':95,'Next.js|Firebase':92,'Next.js|Vercel':98,'Next.js|Express':85,'Next.js|NestJS':88,'Next.js|Convex':93,'React|Express':80,'React|Firebase':88,'React|Supabase':90,'Vue|Nuxt|Express':82,'Vue|Nuxt|Firebase':85,'Svelte|SvelteKit|Supabase':90,'Astro|static':95,'Astro|Supabase':88,'Angular|NestJS':90,'Angular|Firebase':92};
const SYNERGY_DEPLOY={'Next.js|Vercel':98,'Nuxt|Vercel':95,'Nuxt|Netlify':93,'SvelteKit|Vercel':94,'Astro|Vercel':96,'Astro|Netlify':95,'Astro|Cloudflare':93,'React|Vercel':90,'React|Netlify':88,'Firebase|Firebase':98,'Supabase|Vercel':95,'Express|Railway':92,'NestJS|Railway':94,'Django|Railway':93,'FastAPI|Railway':91,'Spring|Railway':88,'Convex|Vercel':96};
const SYNERGY_DOMAIN={'fintech|Supabase':15,'fintech|PostgreSQL':12,'fintech|Stripe':18,'health|Supabase':14,'health|PostgreSQL':12,'legal|PostgreSQL':10,'ec|Stripe':20,'ec|Saleor':18,'ec|Supabase':12,'education|Firebase':10,'education|Supabase':12,'saas|Supabase':15,'saas|Stripe':18,'iot|Firebase':12,'iot|Supabase':10,'community|Firebase':14,'content|Supabase':12,'marketplace|Stripe':15,
  // Extended domain synergy coverage (32 domains)
  'realestate|Supabase':12,'realestate|PostgreSQL':10,'realestate|Stripe':14,
  'analytics|Supabase':14,'analytics|PostgreSQL':12,
  'hr|Supabase':12,'hr|PostgreSQL':10,
  'portfolio|Astro':18,'portfolio|Vercel':15,
  'tool|Supabase':12,'tool|Vercel':10,
  'ai|Supabase':14,'ai|Firebase':12,'ai|Stripe':10,
  'automation|Supabase':12,'automation|Vercel':10,
  'event|Stripe':16,'event|Supabase':12,
  'gamify|Firebase':16,'gamify|Supabase':10,
  'collab|Supabase':15,'collab|Firebase':14,'collab|Stripe':10,
  'devtool|Supabase':12,'devtool|Stripe':14,'devtool|Vercel':12,
  'creator|Stripe':18,'creator|Supabase':12,'creator|Firebase':10,
  'newsletter|Supabase':14,'newsletter|Stripe':12,
  'manufacturing|PostgreSQL':12,'manufacturing|Supabase':10,
  'logistics|Supabase':12,'logistics|PostgreSQL':10,
  'agriculture|Supabase':10,'agriculture|Firebase':8,
  'energy|Supabase':12,'energy|PostgreSQL':10,
  'media|Supabase':14,'media|Stripe':12,'media|Firebase':10,
  'government|PostgreSQL':12,'government|Supabase':10,
  'travel|Stripe':16,'travel|Supabase':14,
  'insurance|PostgreSQL':12,'insurance|Supabase':10,'insurance|Stripe':12};

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
