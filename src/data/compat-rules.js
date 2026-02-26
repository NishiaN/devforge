/* ═══ STACK COMPATIBILITY & SEMANTIC CONSISTENCY RULES — 136 rules (ERROR×22 + WARN×83 + INFO×31) ═══ */
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
   why_ja:'モバイルアプリはストアに公開され不特定多数にダウンロードされます。認証なしではAPIエンドポイントが誰でもアクセス可能になり、データの不正読み取りや改ざんのリスクがあります。またApp Store/Google Playのレビューガイドラインでも、ユーザーデータを扱う場合は認証の実装が求められます。',
   why_en:'Mobile apps are published to stores and downloaded by anyone. Without authentication, API endpoints are publicly accessible — allowing unauthorized data reads and modifications. App Store and Google Play review guidelines also require authentication when handling user data.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Expo')&&inc(a.auth,'NextAuth'),
   ja:'NextAuthはWeb専用。React Nativeには@react-native-google-signin等のアダプター必要',
   en:'NextAuth is web-only. React Native needs adapters like @react-native-google-signin',
   why_ja:'NextAuthはNext.js APIルートやHTTPセッションCookieに依存しており、React Nativeのネイティブ環境ではHTTPリクエストの仕組みが根本的に異なります。Expo GoはNext.jsサーバーを同梱しておらず、NextAuthのコールバックURLをハンドルできません。モバイルにはSupabase AuthやFirebase Authのネイティブ対応ライブラリを使用してください。',
   why_en:'NextAuth depends on Next.js API routes and HTTP session cookies. React Native\'s native environment handles HTTP requests fundamentally differently — Expo Go does not bundle a Next.js server and cannot handle NextAuth callback URLs. Use mobile-native libraries like Supabase Auth or Firebase Auth instead.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-flutter-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Flutter')&&(inc(a.auth,'NextAuth')||inc(a.auth,'Auth.js')),
   ja:'FlutterではNextAuth/Auth.jsは直接利用できません。Firebase Auth/Supabase Auth推奨',
   en:'NextAuth/Auth.js is web-only. Flutter needs Firebase Auth/Supabase Auth',
   why_ja:'FlutterはDartで動作し、NextAuth/Auth.jsはNode.js + JavaScriptに完全依存しています。Dartランタイムはnpmパッケージを実行できず、NextAuthのOAuthコールバック処理・セッション管理もFlutterのHTTP環境とは互換性がありません。FlutterFire（Firebase Auth）またはsupabase_flutterを使用してください。',
   why_en:'Flutter runs on Dart, while NextAuth/Auth.js fully depends on Node.js and JavaScript. The Dart runtime cannot execute npm packages, and NextAuth\'s OAuth callback handling and session management are incompatible with Flutter\'s HTTP environment. Use FlutterFire (Firebase Auth) or supabase_flutter instead.',
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
   why_ja:'静的サイト（GitHub Pages・S3・Firebase Hosting等）はHTMLファイルをCDNから配信するだけで、サーバーサイドのランタイムがありません。ORMはサーバー上でDBクエリを実行するためのツールであり、静的サイトにインストールしてもビルド時に使われないデッドコードになります。データが必要な場合はBaaSのFirebase/Supabaseのクライアントライブラリを直接使用してください。',
   why_en:'Static sites (GitHub Pages, S3, Firebase Hosting, etc.) deliver HTML files from a CDN with no server-side runtime. ORM is a tool for executing DB queries on a server — installing it in a static site creates dead code that is never used at build time. If you need data, use the Firebase/Supabase client library directly.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  // ── BE ↔ DB (4 WARN) ──
  {id:'be-db-fb-notfs',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.database&&!inc(a.database,'Firestore'),
   ja:'Firebase利用時はFirestoreが最適です',
   en:'Firestore is the optimal DB for Firebase',
   why_ja:'FirebaseのエコシステムはFirestoreを中心に設計されています。Firebase SDK（`firebase/firestore`）・Cloud Functions・Firebase Auth・Firebase StorageはすべてFirestoreのリアルタイムリスナー・セキュリティルール・オフライン同期と統合されます。PostgreSQL/MySQLを選ぶとFirebaseのBaaS機能を捨て、別途DBサーバーの管理が必要になり、Firebaseを使う意味が薄れます。',
   why_en:'Firebase\'s ecosystem is designed around Firestore. The Firebase SDK (`firebase/firestore`), Cloud Functions, Firebase Auth, and Firebase Storage all integrate with Firestore\'s realtime listeners, security rules, and offline sync. Choosing PostgreSQL/MySQL abandons Firebase\'s BaaS capabilities and requires separately managing a DB server, negating the benefit of using Firebase.',
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
   why_ja:'Googleが提供するFirestore Pythonライブラリ（google-cloud-firestore）は動作しますが、ORMが存在しないため型安全性が低くなります。またFirestoreのJavaScript SDK（リアルタイムリスナー等）はPythonに完全移植されておらず、FastAPI/Djangoのasync処理との統合も複雑です。PostgreSQL + SQLAlchemyの方がPythonエコシステムに深く統合されています。',
   why_en:'The Google Firestore Python library (google-cloud-firestore) works, but there is no ORM — type safety is low. The JavaScript SDK features (realtime listeners etc.) are not fully ported to Python, and integration with FastAPI/Django async is complex. PostgreSQL + SQLAlchemy integrates far more deeply with the Python ecosystem.',
   fix:{f:'database',s:'PostgreSQL'}},
  // ── BE ↔ Deploy (7 WARN) ──
  {id:'be-dep-java-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&inc(a.deploy,'Vercel'),
   ja:'VercelはNode.js/Python前提です。Railway/AWS/Dockerが必要',
   en:'Vercel supports Node.js/Python. Use Railway/AWS/Docker for Java/Go',
   why_ja:'VercelのビルドランタイムはNode.js・Python・Edge（V8）のみをネイティブサポートします。Javaは別途JVMイメージを構築してDockerで動かすか、Railway/AWS ECS/Fly.ioにデプロイする必要があります。GoはVercelで動かせますが公式サポートは限定的でサードパーティの追加設定が必要です。',
   why_en:'Vercel\'s build runtimes natively support only Node.js, Python, and Edge (V8). Java requires a separate JVM image via Docker — deploy to Railway/AWS ECS/Fly.io instead. Go can run on Vercel but official support is limited and requires third-party configuration.',
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
   why_ja:'NestJSはExpressをラップした「常駐サーバー」前提のフレームワークです。VercelのServerless Functionsはリクエストごとに起動・終了するため、NestJSの依存注入コンテナ初期化に伴うコールドスタート（1-3秒）が毎回発生します。また接続プール・スケジューラ・WebSocketなどの状態保持機能が機能しません。',
   why_en:'NestJS is designed as a persistent server wrapping Express. Vercel Serverless Functions start and stop per request — NestJS\'s DI container initialization causes 1-3 second cold starts every time. Stateful features like connection pools, schedulers, and WebSockets also don\'t work in this model.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-django-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Django')&&inc(a.deploy,'Vercel'),
   ja:'DjangoのVercelデプロイは制限あり。Railway/Fly.ioが推奨',
   en:'Django on Vercel has limitations. Railway/Fly.io recommended',
   why_ja:'Djangoは管理サイト・セッション・Celeryタスクキューなど「常駐プロセス」前提の機能を多く持ちます。VercelのServerless Functions（最大実行60秒・ファイルシステム書込不可）ではDjango ORMのコネクションプールやキャッシュバックエンドが正常動作しません。asgi対応のRailway/Fly.ioなら制限なく動かせます。',
   why_en:'Django relies heavily on persistent processes — admin site, sessions, Celery task queues. Vercel Serverless Functions (60-second max execution, read-only filesystem) break Django ORM connection pooling and cache backends. Railway/Fly.io with ASGI support runs Django without these restrictions.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-heavy-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.deploy,'Netlify')&&(inc(a.backend,'Django')||inc(a.backend,'Spring')||inc(a.backend,'Laravel')),
   ja:'Django/Spring/LaravelのNetlifyデプロイは大幅な制限があります。Railway推奨',
   en:'Django/Spring/Laravel have severe limitations on Netlify. Railway recommended',
   why_ja:'NetlifyのFunctionsはAWS Lambda上で動作し、Python/Java/PHPのランタイムを公式にはサポートしていません。Django/Spring/Laravelをデプロイするには非公式なビルドプラグインを使うか、コンテナをカスタムビルドする必要がありますが、ファイルシステム・常駐プロセス・Celeryタスクキューなどが動作しません。Railway/Fly.ioは専用コンテナで制限なく動かせます。',
   why_en:'Netlify Functions run on AWS Lambda and officially support only Node.js and Go. Deploying Django/Spring/Laravel requires unofficial build plugins or custom container builds, but file system access, persistent processes, and task queues won\'t work. Railway/Fly.io run dedicated containers without these restrictions.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-nest-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Netlify'),
   ja:'NestJSのNetlifyデプロイは制限があります。Railway推奨',
   en:'NestJS on Netlify has limitations. Railway recommended',
   why_ja:'NetlifyはNode.js Functionsをサポートしますが、NestJSのDIコンテナ初期化・モジュールシステム・ライフサイクルフックはServerless環境との相性が悪く、コールドスタート時間が長くなります。また`@nestjs/websockets`・`@nestjs/schedule`・Bull キューなど常駐型機能が動作しません。Railwayなら常駐Dockerコンテナとして本来の性能を発揮できます。',
   why_en:'Netlify supports Node.js Functions, but NestJS DI container initialization, module system, and lifecycle hooks are poorly suited to serverless — cold starts are long. Persistent features like `@nestjs/websockets`, `@nestjs/schedule`, and Bull queues also won\'t work. Railway runs NestJS as a persistent Docker container at full performance.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-nest-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Firebase Hosting'),
   ja:'NestJSはFirebase Hosting（静的CDN）では動作しません。Railway/Fly.ioを推奨します',
   en:'NestJS cannot run on Firebase Hosting (static CDN). Use Railway/Fly.io instead',
   why_ja:'Firebase HostingはHTML/CSS/JS等の静的ファイルをCDNから配信するサービスであり、Node.jsランタイムを持ちません。NestJSは常駐HTTPサーバーとして動作するため、コンテナ型ホスティングのRailway/Fly.ioが必要です。Firebase Cloud Functionsへの分割も可能ですが、NestJSのDIコンテナはコールドスタートが重く推奨しません。',
   why_en:'Firebase Hosting is a static CDN delivering HTML/CSS/JS files — it has no Node.js runtime. NestJS runs as a persistent HTTP server requiring container-based hosting like Railway/Fly.io. Splitting to Cloud Functions is possible but NestJS\'s DI container incurs heavy cold starts.',
   fix:{f:'deploy',s:'Railway'}},
  // ── FE ↔ Deploy (2 WARN) ──
  {id:'fe-dep-angular-vercel',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Angular')&&inc(a.deploy,'Vercel'),
   ja:'AngularのVercel対応は限定的。Firebase HostingまたはAWSが推奨',
   en:'Angular on Vercel is limited. Use Firebase Hosting or AWS',
   why_ja:'VercelはNext.js/NuxtなどのReactエコシステムに最適化されており、AngularのSSR（Angular Universal）はVercelの設定が複雑になります。Angular CLIのビルド出力がVercelのフレームワーク検出と一致しないためカスタム`vercel.json`が必要で、ISR（Incremental Static Regeneration）も使えません。Firebase Hosting + Cloud Runの組み合わせがAngular Universal SSRに最適です。',
   why_en:'Vercel is optimized for the React ecosystem (Next.js/Nuxt). Angular SSR (Angular Universal) requires complex Vercel configuration — Angular CLI build output doesn\'t match Vercel\'s framework detection, requiring custom `vercel.json`, and ISR is unavailable. Firebase Hosting + Cloud Run is the optimal combination for Angular Universal SSR.',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  {id:'fe-dep-nuxt-fbh',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Nuxt')&&inc(a.deploy,'Firebase'),
   ja:'Nuxt 3はVercel/Netlifyが最適デプロイ先です',
   en:'Nuxt 3 deploys best on Vercel or Netlify',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-remix-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Remix')&&inc(a.deploy,'Firebase'),
   ja:'RemixはNode.jsサーバー必須。Firebase HostingはSSRを提供しません',
   en:'Remix requires a Node.js server runtime; Firebase Hosting cannot serve SSR',
   why_ja:'RemixはすべてのページレンダリングをNode.jsサーバー上でサーバーサイドレンダリング（SSR）します。Firebase Hosting は静的CDN（HTML/CSS/JSファイルの配信のみ）で、Node.jsランタイムを持ちません。RemixをFirebaseで動かすには別途Cloud Functionsをサーバーとして用意する複雑な構成が必要です。VercelまたはFly.ioが推奨デプロイ先です。',
   why_en:'Remix renders all pages via server-side rendering (SSR) on a Node.js server. Firebase Hosting is a static CDN (delivers HTML/CSS/JS only) with no Node.js runtime. Running Remix on Firebase requires a complex setup with Cloud Functions as the server. Vercel or Fly.io are the recommended deploy targets.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-sveltekit-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'SvelteKit')&&inc(a.deploy,'Firebase'),
   ja:'SvelteKit SSRはNode.jsサーバーが必要。Firebase HostingはSSRに対応しません',
   en:'SvelteKit SSR requires a server runtime; Firebase Hosting is a static CDN',
   why_ja:'SvelteKitはSSR・エッジレンダリング・APIルートをサポートするフルスタックフレームワークです。Firebase Hostingは静的ファイルのCDN配信のみをサポートし、Node.jsサーバーランタイムがありません。SvelteKitをFirebaseで動かすにはCloud Functionsを組み合わせる必要がありますが、コールドスタート遅延・設定の複雑さが問題になります。VercelまたはNetlifyが推奨です。',
   why_en:'SvelteKit is a full-stack framework supporting SSR, edge rendering, and API routes. Firebase Hosting only delivers static files via CDN with no Node.js runtime. Running SvelteKit on Firebase requires combining Cloud Functions, causing cold-start delays and configuration complexity. Vercel or Netlify are recommended.',
   fix:{f:'deploy',s:'Vercel'}},
  // ── AI Auto ↔ Skill (3 WARN) ──
  {id:'ai-sk-auto-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>inc(a.ai_auto,'自律')||inc(a.ai_auto,'Autonomous'),
   ja:'フル自律開発には上級スキルが必要です。段階的に進めましょう',
   en:'Full autonomous dev requires advanced skills. Progress gradually',
   why_ja:'自律AIエージェントはコードを読み・判断し・修正を繰り返す「Agentic Loop」を実行します。エラー時にAIが誤った修正を連鎖的に行うと、コードベース全体が壊れる可能性があります。上級者はAIの判断ミスを即座に察知できますが、初学者はそのサイクルを適切に監督するのが困難です。まずはアシスト→レビュー提案の段階から始めることを推奨します。',
   why_en:'Autonomous AI agents run an "Agentic Loop" — reading code, making decisions, and iterating fixes. When AI makes incorrect fixes, errors can cascade and corrupt the entire codebase. Experienced developers instantly detect AI misjudgments, but beginners struggle to supervise the cycle. Start with assisted → review-suggestion mode first.',
   cond:a=>a.skill_level==='Beginner'},
  {id:'ai-sk-orch-notpro',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'オーケストレーター')||inc(a.ai_auto,'Orchestrator'))&&a.skill_level!=='Professional',
   ja:'オーケストレーターはCI/CD統合の経験が必要です',
   en:'Orchestrator requires CI/CD integration experience',
   why_ja:'AIオーケストレーター（LangChain/LlamaIndex/Mastra等）はGitHub Actions・テストランナー・クラウドAPIを組み合わせて自律的なパイプラインを構築します。エージェントが失敗したとき「どのステップで・なぜ失敗したか」をデバッグするにはCI/CDとDevOpsの知識が不可欠です。上級者向けの設計パターンです。',
   why_en:'AI orchestrators (LangChain/LlamaIndex/Mastra etc.) build autonomous pipelines combining GitHub Actions, test runners, and cloud APIs. When an agent fails, debugging "which step failed and why" requires deep CI/CD and DevOps knowledge. This is an advanced design pattern.'},
  {id:'ai-sk-multi-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'マルチ')||inc(a.ai_auto,'Multi'))&&a.skill_level==='Beginner',
   ja:'マルチAgent協調は中級以上の経験が推奨です',
   en:'Multi-Agent coordination recommended for intermediate+',
   why_ja:'マルチAgentシステムでは複数のAIエージェントが並列でコードを変更します。エージェント間のコンテキスト共有・コンフリクト解決・トークン予算管理を適切に設計しないと、互いの変更が競合してコードが壊れます。中級者はGitのマージ戦略・トランザクション設計の知識でこれを管理できますが、初学者には難しいパターンです。',
   why_en:'Multi-Agent systems have multiple AI agents modifying code in parallel. Without proper design for context sharing, conflict resolution, and token budget management between agents, their changes will conflict and break code. Intermediate developers can manage this with Git merge strategies and transaction design knowledge — but it\'s a difficult pattern for beginners.'},
  // ── BE ↔ Payment (2 WARN) ──
  {id:'be-pay-static-stripe',p:['backend','payment'],lv:'warn',
   t:a=>isStaticBE(a)&&a.payment&&(inc(a.payment,'Stripe')),
   ja:'Stripe webhookにはサーバーが必要。Supabase Edge Functionsで対応可能',
   en:'Stripe webhooks need a server. Supabase Edge Functions can help',
   why_ja:'Stripeは支払完了・失敗・払い戻し等のイベントをWebhook（HTTP POST）で通知します。静的サイトにはPOSTリクエストを受け取るエンドポイントが存在しないため、決済完了の確認・在庫更新・メール送信などを実行できません。Supabase Edge Functionsを使えば最小構成のサーバーレスエンドポイントを追加できます。',
   why_en:'Stripe sends payment events (completed, failed, refunded) via Webhook (HTTP POST). Static sites have no endpoint to receive POST requests, making it impossible to confirm payment completion, update inventory, or send emails. Supabase Edge Functions add a minimal serverless endpoint to handle these events.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'be-pay-saleor-notpy',p:['backend','payment'],lv:'warn',
   t:a=>a.payment&&inc(a.payment,'Saleor')&&!isPyBE(a),
   ja:'SaleorはPython/Django製です。Python系バックエンドが必要',
   en:'Saleor is built with Python/Django. Python backend required',
   why_ja:'SaleorはDjangoで構築されたECプラットフォームで、GraphQL APIはAriadne（Python GraphQLライブラリ）で実装されています。Node.js/GoのバックエンドからはカスタムAPIエンドポイントを通じてHTTPで呼び出せますが、Djangoのカスタムビジネスロジック（シグナル・ミドルウェア・カスタムコマンド）を拡張するにはPythonが必要です。',
   why_en:'Saleor is an EC platform built with Django — its GraphQL API is implemented with Ariadne (Python GraphQL library). Node.js/Go backends can call it via HTTP, but extending Django\'s custom business logic (signals, middleware, custom commands) requires Python.',
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
   en:'Prisma MongoDB support is in Preview. Use with caution in production',
   why_ja:'orm-levelの`db-mongo-prisma`と異なりこのルールはORMを起点に検出します。PrismaのMongoDBプロバイダーは`prisma migrate`が使えず手動でスキーマを管理する必要があります。また$lookup（JOIN相当）・aggregation・バルク書き込みなどMongoDBの主要機能がPrismaから完全にサポートされていません。MongooseかMongoDBネイティブドライバーを推奨します。',
   why_en:'Unlike the database-level db-mongo-prisma rule, this detects from the ORM side. Prisma\'s MongoDB provider disables `prisma migrate` — schemas must be managed manually. MongoDB\'s key features like $lookup (JOIN equivalent), aggregation, and bulk writes are also not fully supported by Prisma. Use Mongoose or the native MongoDB driver.'},
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
   why_ja:'VercelはデータベースをホスティングしないPaaS（フロント/サーバーレス関数専用）です。セルフホストのPostgreSQLをVercelと組み合わせる場合、接続文字列の環境変数管理・SSL設定・コネクションプーリングをすべて自前で構築する必要があります。NeonはServerless Postgresとして接続プーリングとスケールゼロを組み込んでいるため最適です。',
   why_en:'Vercel is a PaaS for frontend and serverless functions — it does not host databases. Combining self-hosted PostgreSQL with Vercel requires manual management of connection strings, SSL, and connection pooling. Neon provides built-in connection pooling and scale-to-zero as Serverless Postgres, making it the optimal choice.',
   fix:{f:'database',s:'Neon (PostgreSQL)'}},
  {id:'dep-db-cf-pg',p:['deploy','database'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'PostgreSQL'),
   ja:'Cloudflare Workers→外部DBはHyperdriveまたはD1への移行を推奨',
   en:'Cloudflare Workers → external DB: use Hyperdrive or consider D1',
   why_ja:'Cloudflare Workers V8ランタイムはTCPソケットAPIを持たないため、従来のPostgresクライアント（pg）が直接DB接続を確立できません。Cloudflareが提供するHyperdriveを使えばWorkers→外部PostgreSQLのコネクションプーリングが可能です。あるいはCloudflare D1（SQLite互換のエッジDB）への移行で、TCPを介さないネイティブバインディングが得られます。',
   why_en:'The Cloudflare Workers V8 runtime has no TCP socket API, so traditional Postgres clients (pg) cannot establish direct DB connections. Using Cloudflare\'s Hyperdrive enables connection pooling from Workers to external PostgreSQL. Alternatively, migrating to Cloudflare D1 (SQLite-compatible edge DB) provides native bindings without TCP.'},
  {id:'dep-db-cf-fs',p:['deploy','database'],lv:'warn',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'Firestore'),
   ja:'Cloudflare Workers + Firestoreはレイテンシー高。D1/KV/Durableを推奨',
   en:'Cloudflare + Firestore has high latency. Consider D1/KV/Durable Objects',
   why_ja:'Cloudflare WorkersはグローバルEdgeで実行されますが、Firestoreはリージョン固定（us-central1等）のGCPサービスです。エッジからリージョンへのRTTが50-150ms追加されるため、Edgeの低レイテンシーの利点が消えます。D1（SQLite on Edge）またはKV（グローバルキーバリュー）を使えばEdge内でデータを完結させられます。',
   why_en:'Cloudflare Workers run on global Edge, but Firestore is a region-pinned GCP service (e.g., us-central1). The RTT from Edge to region adds 50-150ms, negating the low-latency advantage of Edge. D1 (SQLite on Edge) or KV (global key-value) keeps data within the Edge network.',
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
   why_ja:'Cloudflare Workersは完全なNode.js互換ではなく、`fs`・`path`・`crypto`（一部）・`net`などのNode API が動作しません。ExressはNode.jsネイティブAPIに依存する部分があり、動作は可能でも非推奨のシムを介します。HonoはWeb Standards API（Fetch/URL/Headers）だけで動作し、Workersで最高の性能を発揮します。',
   why_en:'Cloudflare Workers do not fully support Node.js — `fs`, `path`, partial `crypto`, and `net` APIs are unavailable. Express has dependencies on native Node APIs, so it works only via deprecated shims. Hono is built on Web Standards APIs (Fetch/URL/Headers) and delivers peak performance on Workers.',
   fix:{f:'backend',s:'Node.js + Hono'}},
  {id:'be-dep-hono-cf',p:['backend','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.backend,'Hono'),
   ja:'✨ Hono + Cloudflare Workersは最適な組み合わせです（超高速Edge実行）',
   en:'✨ Hono + Cloudflare Workers is optimal (ultra-fast edge execution)'},
  {id:'db-prisma-cf-workers',p:['orm','deploy'],lv:'warn',
   t:a=>inc(a.orm,'Prisma')&&inc(a.deploy,'Cloudflare'),
   ja:'PrismaはCloudflare Workers非対応（Node.js専用コード生成）。Drizzle/Kyselyを推奨',
   en:'Prisma generates Node.js-specific code incompatible with Cloudflare Workers. Use Drizzle or Kysely',
   why_ja:'Prisma Clientは生成時にNode.jsのfs・path・child_processモジュールに依存したコードを出力します。Cloudflare WorkersのV8サンドボックスはこれらのNode.js APIを提供しないため、Prismaのクエリエンジン（.soバイナリ）をロードできず実行時エラーになります。DrizzleまたはKyselyはエッジランタイムを考慮して設計されており、Workers上で正常動作します。',
   why_en:'Prisma Client generates code that depends on Node.js modules (fs, path, child_process) at build time. Cloudflare Workers\' V8 sandbox does not provide these Node.js APIs, so Prisma\'s query engine (.so binary) cannot be loaded, causing runtime errors. Drizzle and Kysely are designed with edge runtimes in mind and work correctly on Workers.',
   fix:{f:'orm',s:'Drizzle'}},
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
   en:'EC domain without payment. Consider Stripe or other payment methods',
   why_ja:'ECプロジェクトで決済を未設定のままにすると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdにPCI-DSS要件・決済フロー・返金処理が含まれません。後から決済を追加する場合、DBスキーマ（Order/Transaction）・認証要件・Webhookエンドポイントの大規模な改修が必要になります。初期設計段階での選択が最もコストが低いです。',
   why_en:'Leaving payment unset in an EC project means generated docs (docs/13_payment.md, docs/45_compliance_matrix.md) will lack PCI-DSS requirements, payment flows, and refund handling. Adding payment later requires major rework of DB schema (Order/Transaction), auth requirements, and webhook endpoints. Selecting it at design time has the lowest cost.'},
  {id:'dom-saas-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
    if(!a.purpose||!a.payment)return false;
    const dom=detectDomain(a.purpose);
    const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
    return dom==='saas'&&!hasPay;
   },
   ja:'SaaSドメインで決済未選択です。収益モデルの根幹であるStripe等の決済方式を選択してください',
   en:'SaaS domain without payment. Stripe or another payment method is core to SaaS revenue — please select one',
   why_ja:'SaaSの収益モデルはサブスクリプション課金が基本です。決済を未設定のままにすると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdにサブスク管理・プラン切替・解約フロー・インボイス発行が含まれません。StripeのBilling APIはサブスク管理・プロ数量課金・トライアル期間・Webhookイベントを一括で提供します。',
   why_en:'SaaS revenue is built on subscription billing. Leaving payment unset means generated docs lack subscription management, plan switching, cancellation flows, and invoice generation. Stripe Billing provides subscription management, metered billing, trial periods, and webhook events in one API.'},
  // ── Domain ↔ Backend/Infra (4 WARN) ──
  {id:'dom-health-firebase',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='health'&&inc(a.backend,'Firebase');
   },
   ja:'医療ドメインでFirebaseを使用しています。FirebaseのデフォルトではHIPAAのBAA（業務提携契約）が自動適用されません。Supabase（PostgreSQL+RLS）またはカスタムバックエンドを推奨します',
   en:'Healthcare domain using Firebase. Firebase does not automatically provide a HIPAA Business Associate Agreement (BAA). Consider Supabase (PostgreSQL + RLS) or a custom HIPAA-compliant backend',
   why_ja:'HIPAA準拠には「ビジネスアソシエイト契約（BAA）」が必要ですが、FirebaseのBAAはGoogle Cloud Blazeプランで明示的に申請が必要で、Realtime Databaseは適用対象外の場合があります。Supabaseはrow-level security（RLS）によるテナント分離をデフォルトで提供し、医療システムのアクセス制御に適しています。PHI（患者健康情報）の取り扱いは法的に厳格な管理が求められます。',
   why_en:'HIPAA compliance requires a Business Associate Agreement (BAA). Firebase\'s BAA requires explicit activation on the Google Cloud Blaze plan, and Realtime Database may not qualify. Supabase provides row-level security (RLS) for tenant isolation by default, well-suited for healthcare access control. Protected Health Information (PHI) is subject to strict legal data handling requirements.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-government-firebase',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='government'&&inc(a.backend,'Firebase');
   },
   ja:'行政ドメインでFirebaseを使用しています。政府クラウド（ISMAP認定）・個人情報保護法への準拠にはAWS GovCloud/Azure Government等の認証済みクラウドが必要です',
   en:'Government domain using Firebase. Government cloud compliance (ISMAP, FedRAMP) requires certified cloud infrastructure such as AWS GovCloud or Azure Government',
   why_ja:'行政システムは住民の個人情報（マイナンバー・住所・医療情報等）を扱うため、ISMAP（情報システムセキュリティ管理・評価制度）認定クラウドの利用が政府調達基準で求められます。FirebaseはISMAP登録クラウドではなく、また行政データを海外サーバーに保存することは個人情報保護法・マイナンバー法との整合性が問題になります。Supabaseはセルフホスト構成でISMAP対応クラウド上に構築可能です。',
   why_en:'Government systems handling citizen personal data (national ID, address, medical records) require ISMAP-certified cloud in Japan, or FedRAMP-authorized in the US, per government procurement standards. Firebase is not registered on ISMAP and storing government data on overseas servers raises compliance concerns under privacy and national ID laws. Supabase can be self-hosted on ISMAP-compliant infrastructure.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-iot-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='iot'&&isStaticBE(a);
   },
   ja:'IoTドメインで静的バックエンドが選択されています。センサーデータ収集・デバイス制御にはリアルタイム対応のバックエンドが必要です。Firebase Realtime DB/Supabaseを推奨します',
   en:'IoT domain with a static backend selected. Sensor data ingestion and device management require a real-time backend. Firebase Realtime DB or Supabase recommended',
   why_ja:'IoTシステムでは、センサーデバイスが常時データを送信し、バックエンドはMQTT/WebSocket/REST APIでデータを受信・処理・蓄積する必要があります。静的サイトにはサーバーサイドの処理が存在せず、デバイスからのデータを受け取る手段がありません。Firebase Realtime DatabaseはIoTデバイスとのリアルタイム同期に優れており、Firebase Cloud Functionsでデータ加工・アラート配信も可能です。',
   why_en:'IoT systems require sensors constantly transmitting data, with the backend receiving, processing, and storing it via MQTT/WebSocket/REST API. Static sites have no server-side processing and cannot receive device data. Firebase Realtime Database excels at realtime sync with IoT devices, and Firebase Cloud Functions handle data processing and alert delivery.',
   fix:{f:'backend',s:'Firebase'}},
  {id:'dom-community-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const noAuth=inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return dom==='community'&&noAuth;
   },
   ja:'コミュニティドメインで認証が未設定です。コミュニティプラットフォームではユーザーID・投稿所有者・モデレーション機能のために認証が必須です',
   en:'Community domain without authentication. Community platforms require user identity for post ownership, social features, and content moderation',
   why_ja:'コミュニティプラットフォームの基本機能（投稿・フォロー・いいね・通報・モデレーション）は全てユーザーIDに依存します。認証なしでは投稿の帰属が不明確になり、スパム・荒らし対策も不可能です。Firebase AuthまたはSupabase Authは数分で実装でき、ソーシャルログイン（Google/GitHub）も標準装備しています。',
   why_en:'Core community features (posting, following, likes, reporting, moderation) all depend on user identity. Without authentication, post ownership is unknown and spam/troll prevention is impossible. Firebase Auth or Supabase Auth can be implemented in minutes and include social login (Google/GitHub) out of the box.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'dom-fintech-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail)/i.test(a.data_entities||'');
     return dom==='fintech'&&!hasAudit;
   },
   ja:'フィンテックドメインですが、data_entitiesに監査ログエンティティ（AuditLog/TransactionLog）が見当たりません。金融規制（PCI-DSS/FISC/SOX）では取引操作の完全な監査証跡が必須です',
   en:'Fintech domain without an audit log entity (AuditLog/TransactionLog). Financial regulations (PCI-DSS/SOX/FISC) require complete immutable audit trails for all financial operations',
   why_ja:'PCI-DSS Requirement 10では、カード会員データ環境の全アクセスログを最低12ヶ月保持することが義務付けられています。AuditLogエンティティは誰がいつ何をしたかを記録し、不正検知・コンプライアンス証明・インシデント調査を可能にします。後から追加する場合、既存トランザクションのログが欠落し監査に合格できません。',
   why_en:'PCI-DSS Requirement 10 mandates retaining full access logs for cardholder data environments for at least 12 months. An AuditLog entity records who did what when, enabling fraud detection, compliance proof, and incident investigation. Adding it later means existing transactions have no logs, making audits impossible to pass.'},
  // ── Domain ↔ Payment/Realtime (4 WARN) ──
  {id:'dom-booking-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='booking'&&!hasPay;
   },
   ja:'予約ドメインで決済が未設定です。無断キャンセル防止のためデポジット・事前決済（Stripe等）の導入を推奨します',
   en:'Booking domain without payment. Add deposit/prepayment (Stripe etc.) to prevent no-shows and secure reservations',
   why_ja:'予約システムで決済がないと、ユーザーは無制限に予約を作成・放棄できます。飲食店や宿泊施設では無断キャンセルが深刻な損失になります。Stripeのデポジット機能（Payment Intents + capture_method:manual）で「仮押さえ→来店確認後に確定」というフローを実現でき、キャンセル時のみ解放することでノーショー率を大幅に削減できます。',
   why_en:'Without payment in a booking system, users can create and abandon unlimited reservations. No-shows are a serious revenue loss for restaurants and hotels. Stripe\'s deposit flow (Payment Intents + capture_method:manual) enables "hold → confirm on arrival → capture," releasing the hold only on cancellation, dramatically reducing no-show rates.',
   fix:{f:'payment',s:'Stripe決済'}},
  {id:'dom-marketplace-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='marketplace'&&!hasPay;
   },
   ja:'マーケットプレイスドメインで決済が未設定です。出品者への送金・手数料徴収にはStripe Connect等のプラットフォーム決済が必須です',
   en:'Marketplace domain without payment. Platform payments with seller payouts (Stripe Connect) are essential for marketplace transactions',
   why_ja:'マーケットプレイスは買い手→プラットフォーム（手数料控除）→出品者という資金フローが核心です。通常のStripe決済では売り手への送金（Payout）機能がありません。Stripe Connectの「Connected Account」で出品者のKYC・銀行口座登録・自動分配を管理し、プラットフォーム手数料を自動控除できます。PayPal Marketplacesも同様の機能を提供します。',
   why_en:'The marketplace core is a funds flow: buyer → platform (minus commission) → seller. Standard Stripe payments lack seller payout functionality. Stripe Connect\'s "Connected Accounts" manage seller KYC, bank account registration, and automatic splits, deducting platform commissions automatically. PayPal Marketplaces offers similar functionality.',
   fix:{f:'payment',s:'Stripe決済 (Connect)'}},
  {id:'dom-collab-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='collab'&&isStaticBE(a);
   },
   ja:'コラボレーションドメインで静的バックエンドが選択されています。共同編集・リアルタイム同期にはサーバーサイドが必要です。Supabase Realtime/Firebase/Convexを推奨します',
   en:'Collaboration domain with a static backend. Real-time sync and co-editing require a server-side backend. Supabase Realtime, Firebase, or Convex recommended',
   why_ja:'共同編集ツール（Google Docsスタイル）は複数ユーザーの変更をリアルタイムで全員に配信するサーバーが必須です。静的サイトにはWebSocket/SSEサーバーが存在せず、ブラウザ間の変更を仲介できません。SupabaseのRealtime（PostgreSQL変更監視）やFirebase Realtime Databaseは数行のコードでリアルタイム同期を実現します。高度な同時編集にはYjs+WebSocket（Hocuspocus）の組み合わせが標準です。',
   why_en:'Collaborative editing tools (Google Docs style) require a server to broadcast changes between multiple users in real time. Static sites have no WebSocket/SSE server to mediate browser-to-browser updates. Supabase Realtime (PostgreSQL change streaming) and Firebase Realtime Database achieve real-time sync in a few lines. For advanced concurrent editing, Yjs + WebSocket (Hocuspocus) is the standard combination.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-gamify-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='gamify'&&isStaticBE(a);
   },
   ja:'ゲーミフィケーションドメインで静的バックエンドが選択されています。リーダーボード・ポイント管理・バッジ付与にはサーバーサイドが必要です。Firebase/Supabaseを推奨します',
   en:'Gamification domain with a static backend. Leaderboards, point tracking, and badge assignment require server-side persistence. Firebase or Supabase recommended',
   why_ja:'ゲーミフィケーションの核心機能（ポイント付与・ランキング集計・バッジ解除・チャレンジ管理）は全て永続的なデータストアが必要です。静的サイトはローカルストレージのみで、マルチユーザー競争・不正防止・リーダーボードを実現できません。Firebaseはリアルタイムリーダーボード更新に優れており、Cloud Functionsでポイントバリデーションやバッジロジックのサーバーサイド処理も可能です。',
   why_en:'Core gamification features (point awarding, ranking aggregation, badge unlocking, challenge management) all require persistent data storage. Static sites are limited to localStorage — they cannot support multi-user competition, cheat prevention, or leaderboards. Firebase excels at real-time leaderboard updates, and Cloud Functions handle server-side point validation and badge logic.',
   fix:{f:'backend',s:'Firebase'}},
  // ── Domain ↔ Monetization/Service (2 WARN + 1 INFO) ──
  {id:'dom-event-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='event'&&!hasPay;
   },
   ja:'イベントドメインで決済が未設定です。チケット販売・参加費徴収のためStripe等の決済統合を推奨します',
   en:'Event domain without payment. Integrate Stripe or similar for ticket sales and registration fees',
   why_ja:'イベント管理システムの収益化はチケット販売・参加費徴収が中心です。決済なしでは、参加者管理・キャンセル払い戻し・早期割引・定員管理のドキュメントが生成されません。Stripeの`Payment Intents`でシンプルなチケット決済、`PaymentLinks`でノーコードチケット販売が実現できます。返金・部分返金の自動化にはStripe Refundsも活用してください。',
   why_en:'Event management system revenue comes primarily from ticket sales and registration fees. Without payment, docs for attendee management, cancellation refunds, early-bird discounts, and capacity management are not generated. Stripe `Payment Intents` handles simple ticket payments; `PaymentLinks` enables no-code ticket sales. Use Stripe Refunds for automated full/partial refund flows.',
   fix:{f:'payment',s:'Stripe決済'}},
  {id:'dom-creator-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='creator'&&!hasPay;
   },
   ja:'クリエイタードメインで決済が未設定です。コンテンツ販売・投げ銭・サブスク収益化のためStripe Connect等のプラットフォーム決済を推奨します',
   en:'Creator domain without payment. Stripe Connect or similar platform payments are essential for content sales, tips, and subscription monetization',
   why_ja:'クリエイタープラットフォームの核心はクリエイターへの収益分配です。単純なStripe決済ではプラットフォーム手数料控除・複数クリエイターへの送金が困難です。Stripe Connectの「Express Account」でKYC・銀行口座登録・自動分配を管理し、`transfer_group`で投げ銭の即時送金・月次まとめ払いを選択できます。ファン→プラットフォーム（手数料控除）→クリエイターの資金フローが核心です。',
   why_en:'The core of a creator platform is revenue distribution to creators. Standard Stripe payments make it difficult to deduct platform fees and send money to multiple creators. Stripe Connect "Express Accounts" manage KYC, bank account registration, and automatic splits; `transfer_group` supports instant tip transfers or monthly batched payouts. The funds flow: fan → platform (minus fee) → creator is central.',
   fix:{f:'payment',s:'Stripe決済 (Connect)'}},
  {id:'dom-newsletter-noemail',p:['purpose','mvp_features'],lv:'info',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasEmail=/(Resend|SendGrid|MailerSend|Postmark|SES|SMTP|nodemailer|メール配信|email.?service|mail.?service)/i.test(a.mvp_features||'');
     return dom==='newsletter'&&!hasEmail;
   },
   ja:'ニュースレタードメインですが、mvp_featuresにメール配信サービス（Resend/SendGrid/MailerSend）の記述がありません',
   en:'Newsletter domain without an email delivery service in mvp_features. Add Resend, SendGrid, or MailerSend for reliable bulk email delivery',
   why_ja:'自前SMTPでのメール大量配信はIPレピュテーション問題・スパムフォルダへの振り分け・バウンス管理が複雑です。Resend（React Email連携・開発者向け）、SendGrid（無料枠100通/日・大量配信実績）、MailerSend（直感的なAPI・コスト安）が主要選択肢です。メール開封率・クリック率の分析、配信停止（unsubscribe）管理、バウンス自動処理もAPIで提供されます。',
   why_en:'Bulk email via self-hosted SMTP struggles with IP reputation, spam folder placement, and complex bounce management. Resend (React Email integration, developer-friendly), SendGrid (100 free emails/day, proven at scale), and MailerSend (intuitive API, cost-effective) are the main options. Email open rates, click tracking, unsubscribe management, and automatic bounce handling are all provided via API.'},
  {id:'dom-government-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const noAuth=inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return dom==='government'&&noAuth;
   },
   ja:'行政・政府ドメインで認証が未設定です。住民個人情報を扱う行政システムは認証必須です。Supabase Auth/Keycloakを推奨します',
   en:'Government domain without authentication. Government systems handling citizen data require authentication. Supabase Auth or Keycloak recommended',
   why_ja:'行政システムは住民の個人情報（氏名・住所・マイナンバー等）を扱います。認証なしでは誰でもデータにアクセスでき、個人情報保護法・マイナンバー法・各地方条例違反になります。Supabase AuthはRLSと組み合わせて役職ベースのアクセス制御が可能です。より厳格なケースではKeycloak（OpenID Connect/SAML対応）が政府標準として採用されています。',
   why_en:'Government systems handle citizen personal data (name, address, national ID, etc.). Without authentication, anyone can access data — violating privacy law, data protection regulations, and government security standards. Supabase Auth combined with RLS enables role-based access control. For stricter requirements, Keycloak (OpenID Connect/SAML) is adopted as a government authentication standard.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'dom-insurance-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail|ClaimLog)/i.test(a.data_entities||'');
     return dom==='insurance'&&!hasAudit;
   },
   ja:'保険ドメインですが、AuditLog/ClaimLog等の監査エンティティが見当たりません。保険規制（IAIS基準・各国監督当局）は操作ログの保存を要求します',
   en:'Insurance domain without AuditLog/ClaimLog entity. Insurance regulations (IAIS standards, national supervisory authorities) require operation log retention',
   why_ja:'保険業界は金融庁・IAISのガイドラインにより、全ての保険証券変更・クレーム処理・保険料計算の操作ログを義務付けています。AuditLogがないと、クレーム不正・証券改ざんの追跡が不可能になります。PostgreSQLのトリガー+AuditLogテーブルで全DML操作を自動記録し、誰が・いつ・何を変更したかをイミュータブルに保存することを推奨します。',
   why_en:'The insurance industry is required by financial regulators and IAIS guidelines to maintain operation logs for all policy changes, claims processing, and premium calculations. Without AuditLog, detecting claim fraud or policy tampering becomes impossible. Use PostgreSQL triggers + AuditLog table to automatically record all DML operations, immutably storing who changed what and when.'},
  {id:'dom-legal-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail|AccessLog)/i.test(a.data_entities||'');
     return dom==='legal'&&!hasAudit;
   },
   ja:'法務ドメインですが、AuditLog/AccessLog等の監査エンティティが見当たりません。弁護士法・個人情報保護法は機密文書へのアクセスログ保持を要求します',
   en:'Legal domain without AuditLog/AccessLog entity. Attorney regulations and privacy law require access logs for confidential documents',
   why_ja:'法務システムは機密性の高い契約書・訴訟資料・法的意見書を扱います。弁護士法の守秘義務・個人情報保護法・eDiscovery要件により、誰がいつどの文書にアクセスしたかをイミュータブルに記録する監査証跡が必要です。AuditLogがないと、不正アクセス・情報漏洩の事後調査が不可能になり、クライアントへの説明責任を果たせません。',
   why_en:'Legal systems handle highly confidential contracts, litigation materials, and legal opinions. Attorney confidentiality obligations, privacy law, and eDiscovery requirements mandate immutable audit trails of who accessed which document and when. Without AuditLog, post-incident investigation of unauthorized access or data leaks is impossible, making client accountability unachievable.'},
  {id:'dom-media-nocdn',p:['purpose','mvp_features'],lv:'info',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasCDN=/(CDN|CloudFront|Cloudflare|Fastly|Akamai|R2|S3|bunny|配信最適化|ストリーミング最適化)/i.test(a.mvp_features||'');
     return dom==='media'&&!hasCDN;
   },
   ja:'メディア・ストリーミングドメインですが、mvp_featuresにCDN/配信最適化の記述がありません。大容量コンテンツ配信にはCDN必須です',
   en:'Media/streaming domain without CDN in mvp_features. CDN is essential for large-scale content delivery',
   why_ja:'動画・音声・画像の大容量コンテンツをオリジンサーバーから直接配信すると、サーバー費用が膨大になりレイテンシも悪化します。Cloudflare R2（egress無料）+ Cloudflare CDN、AWS S3 + CloudFront（99.9% SLA）、Bunny.net（コスト最安）が主要選択肢です。HLS/DASHによるアダプティブビットレートストリーミングでモバイル回線でも高品質配信が可能です。',
   why_en:'Serving large video/audio/image content directly from the origin server results in massive bandwidth costs and poor latency. Main options: Cloudflare R2 (free egress) + Cloudflare CDN, AWS S3 + CloudFront (99.9% SLA), Bunny.net (lowest cost). HLS/DASH adaptive bitrate streaming enables high-quality delivery even on mobile networks.'},
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
   en:'Convex is optimized for React. React/Next.js recommended',
   why_ja:'Convexの公式クライアントライブラリはReact Hooksを中心に設計されており、`useQuery`・`useMutation`・`useAction`などのHookがリアルタイム同期を実現します。Vue/Svelte/Angularには公式SDKが存在せず、コミュニティ製の非公式アダプターに頼ることになります。Reactを使わない場合はSupabase/Firebaseの方が広いフレームワーク対応があります。',
   why_en:'Convex\'s official client library is designed around React Hooks — `useQuery`, `useMutation`, and `useAction` drive realtime sync. There are no official SDKs for Vue/Svelte/Angular — only unofficial community adapters. If you\'re not using React, Supabase or Firebase offer broader framework support.'},
  {id:'be-convex-orm',p:['backend','orm'],lv:'info',
   t:a=>inc(a.backend,'Convex')&&a.orm&&!inc(a.orm,'なし')&&!inc(a.orm,'None')&&a.orm!=='none',
   ja:'ConvexはTypeScript定義で完結します。ORMは通常不要',
   en:'Convex uses TypeScript definitions. ORM typically not needed',
   why_ja:'ConvexはORMそのものです。`defineTable()`でスキーマを定義し、`ctx.db.query()`・`ctx.db.insert()`・`ctx.db.patch()`でデータ操作を行います。PrismaやDrizzleをConvexと組み合わせても、ConvexのDBには接続できず、むしろ別DBへの接続が必要になり二重管理になります。Convexを使うならORMは「なし」にしてください。',
   why_en:'Convex IS the ORM. You define schemas with `defineTable()` and manipulate data with `ctx.db.query()`, `ctx.db.insert()`, and `ctx.db.patch()`. Adding Prisma or Drizzle alongside Convex cannot connect to Convex\'s DB — it would require a separate DB, creating double management. If using Convex, set ORM to "None".',
   fix:{f:'orm',s:'None / Using BaaS'}},
  // ── Misc (3 INFO) ──
  {id:'ai-tools-multi',p:['ai_tools'],lv:'info',
   t:a=>{
    if(!a.ai_tools)return false;
    const tools=(a.ai_tools||'').split(',').filter(x=>x.trim()).length;
    return tools>=3;
   },
   ja:'複数AIツール(3+)選択時は、CLAUDE.md等のAIルールが統一管理されます',
   en:'Multiple AI tools (3+) selected: AI rules are unified via CLAUDE.md',
   why_ja:'Cursor・Windsurf・Clineなど複数のAIコーディングツールを同時使用する場合、各ツールが異なるルールを読み込むと一貫性のないコードが生成されます。DevForgeはCLAUDE.md・.cursorrules・.windsurfrules・.clinerules・AGENTS.mdを自動生成し、すべてのAIツールが同一のプロジェクト規約（コーディング規則・禁止パターン・アーキテクチャ決定）に従うよう統一管理します。',
   why_en:'Using multiple AI coding tools simultaneously (Cursor, Windsurf, Cline, etc.) can produce inconsistent code if each tool reads different rules. DevForge automatically generates CLAUDE.md, .cursorrules, .windsurfrules, .clinerules, and AGENTS.md, ensuring all AI tools follow the same project conventions (coding rules, forbidden patterns, architecture decisions).'},
  {id:'mobile-expo-rn',p:['mobile'],lv:'info',
   t:a=>inc(a.mobile,'bare')||inc(a.mobile,'Bare'),
   ja:'React Native bareは柔軟性が高いですが、Expoの方が開発速度が速いです',
   en:'React Native bare offers flexibility, but Expo is faster for development',
   why_ja:'React Native bare workflowはExpoのマネージドレイヤーを除いた純粋なReact Nativeです。カスタムネイティブモジュール（BLE・ARKit等）を使いたい場合や、Expoのバージョン制約に縛られたくない場合に選びます。しかし、Xcodeビルド設定・CocoaPods・Gradleを自分で管理する必要があり、OTA（Over-the-Air）アップデートも自前で構築が必要です。Expo GoやEAS Buildで対応できるなら、Expoの方が開発速度は速くなります。',
   why_en:'React Native bare workflow is pure React Native without Expo\'s managed layer. Choose it when you need custom native modules (BLE, ARKit, etc.) or cannot accept Expo\'s version constraints. However, you must manage Xcode build settings, CocoaPods, and Gradle yourself, and OTA (Over-the-Air) updates must be built from scratch. If Expo Go or EAS Build can handle your needs, Expo provides significantly faster development.',
   fix:{f:'mobile',s:'Expo (Managed)'}},
  {id:'mob-flutter-firebase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Firebase'),
   ja:'✨ Flutter + Firebaseは最適な組み合わせです（FlutterFire統合）',
   en:'✨ Flutter + Firebase is an excellent combination (FlutterFire integration)'},
  {id:'mob-flutter-supabase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Supabase'),
   ja:'✨ Flutter + Supabaseは良い組み合わせです（supabase_flutter パッケージを使用）',
   en:'✨ Flutter + Supabase works well — use the supabase_flutter package for native SDK access'},
  {id:'mob-flutter-drizzle',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.orm,'Drizzle'),
   ja:'DrizzleはNode.js専用ORMです。FlutterはDartで動作するため使用できません。Supabase/Firebase等のBaaSを使用してください',
   en:'Drizzle is a Node.js ORM. Flutter runs on Dart and cannot use it. Use a BaaS like Supabase or Firebase instead',
   why_ja:'DrizzleはNode.jsのネイティブDBドライバー（pg・mysql2・better-sqlite3）と連携します。FlutterはDartランタイムで動作しており、npmパッケージを実行する仕組みがありません。FlutterからDBにアクセスするにはsupabase_flutter SDK・FlutterFire・REST APIを経由してください。',
   why_en:'Drizzle integrates with Node.js native DB drivers (pg, mysql2, better-sqlite3). Flutter runs on the Dart runtime, which has no mechanism to execute npm packages. To access a database from Flutter, use the supabase_flutter SDK, FlutterFire, or a REST API backend.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'mob-flutter-kysely',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.orm,'Kysely'),
   ja:'KyselyはNode.js専用SQLビルダーです。FlutterはDartで動作するため使用できません。Supabase/Firebase等のBaaSを使用してください',
   en:'Kysely is a Node.js SQL builder. Flutter runs on Dart and cannot use it. Use a BaaS like Supabase or Firebase instead',
   why_ja:'KyselyはNode.js固有のDBドライバーAPIに依存したSQLクエリビルダーです。FlutterのDartランタイムはNode.jsモジュールを実行できず、Kyselyをインポートしてもビルド時エラーになります。Flutterでの永続化はsupabase_flutter（PostgreSQL）・FlutterFire（Firestore）・drift（ローカルSQLite）を選択してください。',
   why_en:'Kysely is a SQL query builder that depends on Node.js-specific DB driver APIs. Flutter\'s Dart runtime cannot execute Node.js modules — importing Kysely will cause a build-time error. For persistence in Flutter, choose supabase_flutter (PostgreSQL), FlutterFire (Firestore), or drift (local SQLite).',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'mob-expo-drizzle',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Drizzle'),
   ja:'DrizzleはサーバーサイドORMです。Expo(React Native)では動作しません。モバイルにはRNSQLiteまたはBaaSを使用してください',
   en:'Drizzle is a server-side ORM and will not work in Expo (React Native). Use RN SQLite or a BaaS backend instead',
   why_ja:'DrizzleはNode.jsのネイティブモジュール（pg・mysql2・better-sqlite3）と連携して動作します。React NativeのJavaScriptエンジン（Hermes/JSC）はNode.jsではないため、これらのネイティブドライバーをバンドルできません。Expo内でDBにアクセスする場合はexpo-sqlite（ローカル）またはSupabase/Firebase（クラウド）を使用してください。',
   why_en:'Drizzle works with Node.js native modules (pg, mysql2, better-sqlite3). React Native\'s JavaScript engine (Hermes/JSC) is not Node.js — these native drivers cannot be bundled. For database access in Expo, use expo-sqlite (local) or Supabase/Firebase (cloud).',
   fix:{f:'orm',s:'Prisma'}},
  {id:'mob-expo-kysely',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Kysely'),
   ja:'KyselyはサーバーサイドSQLビルダーです。Expo(React Native)では動作しません。BaaSバックエンドを使用してください',
   en:'Kysely is a server-side SQL builder and will not work in Expo. Use a BaaS backend instead',
   why_ja:'KyselyはSQL接続にNode.js固有のAPIを使用します（pg・mysql2ドライバー）。Expo/React Nativeの実行環境はNode.jsを含まず、これらのネイティブモジュールをバンドルできません。モバイルアプリからDBに接続するにはSupabase/FirebaseのRESTまたはSDKを使用するか、バックエンドAPIを経由してください。',
   why_en:'Kysely uses Node.js-specific APIs for SQL connections (pg, mysql2 drivers). The Expo/React Native runtime does not include Node.js and cannot bundle these native modules. To access a database from a mobile app, use Supabase/Firebase REST or SDK, or route through a backend API.',
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
   en:'Scope excludes "payment/EC" but a payment method is selected. Spec scope definition will conflict',
   why_ja:'スコープ外（scope_out）に「決済」と記載すると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdに「このフェーズでは決済を実装しない」と明記されます。同時に決済方式（Stripe等）を選ぶと、Stripe SDKのセットアップ・Webhook設定・PCI-DSS対応手順が生成されます。この矛盾した出力をAIが受け取ると、どちらの仕様を実装するか判断できなくなります。',
   why_en:'Setting "payment" in scope_out causes generated docs (docs/13_payment.md, docs/45_compliance_matrix.md) to state "payment will not be implemented this phase." Simultaneously selecting a payment method (Stripe, etc.) generates Stripe SDK setup, Webhook configuration, and PCI-DSS compliance steps. An AI receiving these contradictory specs cannot determine which instruction to implement.'},
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
   why_ja:'Express/FastifyはHTTPサーバーを起動し続ける「常駐プロセス」モデルです。Vercelでは1リクエストごとに関数が起動・終了するServerless Functionsとして動作させる必要があり、`express`を`vercel`ランタイムでラップするか全ルートをAPI Routes化する必要があります。WebSocketやEventEmitter等のセッション状態も失われます。',
   why_en:'Express/Fastify use a persistent server model — a continuously running HTTP process. On Vercel, they must be wrapped as Serverless Functions that start and stop per request, requiring either an `express` adapter or converting all routes to API Routes. Stateful features like WebSockets and EventEmitter are also lost.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-express-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&inc(a.deploy,'Firebase Hosting')&&!inc(a.backend,'Next'),
   ja:'Express/FastifyはFirebase Hosting（静的CDN）では動作しません。Railway/Renderを推奨します',
   en:'Express/Fastify cannot run on Firebase Hosting (static CDN). Use Railway/Render instead',
   why_ja:'Firebase Hostingは静的ファイル配信専用のCDNでNode.jsランタイムがありません。ExpressサーバーはHTTPリスナーを起動し続ける常駐プロセスであり、Firebase Hosting上では実行できません。APIサーバーにはRailway/Render/Fly.ioを使い、フロントエンドのみFirebase Hostingに配置する構成を推奨します。',
   why_en:'Firebase Hosting is a static CDN with no Node.js runtime — Express servers cannot run there. Express needs a persistent HTTP listener that Firebase Hosting cannot provide. Use Railway/Render/Fly.io for the API server, with Firebase Hosting optionally serving the frontend only.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-express-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&inc(a.deploy,'Netlify')&&!inc(a.frontend,'Next'),
   ja:'Express/FastifyのNetlifyデプロイは制限があります。Railway/Renderを推奨します',
   en:'Express/Fastify on Netlify has serverless limitations. Railway/Render recommended',
   why_ja:'NetlifyのFunctionsはリクエストごとに起動・終了するサーバーレス環境です。Expressを`netlify-lambda`でラップすることは可能ですが、WebSocket・セッション保持・ファイルシステム書込などのステートフル機能が動作せず、関数実行時間の上限（10秒）も多くのExpressユースケースには不十分です。',
   why_en:'Netlify Functions are serverless — they start and stop per request. Wrapping Express with `netlify-lambda` is possible but stateful features (WebSockets, session state, filesystem writes) won\'t work. The 10-second execution limit is also insufficient for many Express use cases.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-py-fbh',p:['backend','deploy'],lv:'error',
   t:a=>isPyBE(a)&&inc(a.deploy,'Firebase Hosting'),
   ja:'Firebase HostingはCDN専用でPythonランタイムがありません。FastAPI/DjangoはRailway/Render/Fly.ioにデプロイしてください',
   en:'Firebase Hosting is a CDN-only service with no Python runtime. Deploy FastAPI/Django to Railway, Render, or Fly.io',
   why_ja:'Firebase HostingはHTMLファイルをCDNエッジから配信するサービスであり、サーバーサイドのプロセスを実行する機能がありません。Pythonアプリケーションはポートを持つHTTPサーバーとして常駐する必要があり、Firebase Hostingの構造とは根本的に異なります。Railway/Render/Fly.ioはDockerfileからPythonサーバーをそのまま動かせます。',
   why_en:'Firebase Hosting serves HTML files from CDN edges with no capability to run server-side processes. Python applications need to run as persistent HTTP servers on a port — fundamentally incompatible with Firebase Hosting\'s architecture. Railway/Render/Fly.io can run Python servers directly from a Dockerfile.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-java-fbh',p:['backend','deploy'],lv:'error',
   t:a=>(inc(a.backend,'Spring')||inc(a.backend,'Go')||inc(a.backend,'Gin'))&&inc(a.deploy,'Firebase Hosting'),
   ja:'Firebase HostingはCDN専用でJava/Goランタイムがありません。Spring Boot/GinはRailway/Render/Fly.ioにデプロイしてください',
   en:'Firebase Hosting has no Java or Go runtime. Deploy Spring Boot or Gin to Railway, Render, or Fly.io',
   why_ja:'Firebase HostingはJavaやGoのバイナリを実行する環境を提供しません。Spring BootはJVM上で動作するHTTPサーバーであり、GoのGinフレームワークもOSプロセスとして実行される必要があります。これらはFirebase Hosting上ではデプロイ可能な形式ではありません。Cloud Run（Google製）またはRailway/Renderを使用してください。',
   why_en:'Firebase Hosting provides no environment to run Java or Go binaries. Spring Boot runs as a JVM-based HTTP server; Go\'s Gin framework also needs to execute as an OS process. Neither is deployable on Firebase Hosting. Use Cloud Run (by Google) or Railway/Render instead.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-py-cf',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'FastAPI')&&inc(a.deploy,'Cloudflare'),
   ja:'Cloudflare WorkersはV8エンジン専用です。FastAPIはPythonであり実行できません。Railway/Fly.ioへの変更を推奨します',
   en:'Cloudflare Workers run on V8 only. FastAPI is Python and cannot execute there. Use Railway or Fly.io instead',
   why_ja:'Cloudflare WorkersはV8 JavaScriptエンジン上で動作するサーバーレス環境です。PythonインタープリターはV8上では実行できないため、FastAPIアプリケーションをデプロイすることは不可能です。PythonをCloudflare環境で使いたい場合はCloudflare Workers AI Python（実験的）の利用を検討できますが、FastAPIのWSGI/ASGIサーバーは動作しません。',
   why_en:'Cloudflare Workers is a serverless environment that runs on the V8 JavaScript engine. The Python interpreter cannot run on V8, making it impossible to deploy FastAPI applications. If Python is needed in the Cloudflare ecosystem, Cloudflare Workers AI Python (experimental) could be considered, but FastAPI\'s WSGI/ASGI server will not work.',
   fix:{f:'deploy',s:'Railway'}},
  // A5: backend=Supabase && auth に NextAuth/Auth.js
  {id:'sem-auth-supa-nextauth',p:['auth','backend'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&(inc(a.auth,'NextAuth')||inc(a.auth,'Auth.js')),
   ja:'Supabase利用時はSupabase Authが統合されています。NextAuth/Auth.jsとの併用は認証SoTが二重化します',
   en:'Supabase includes built-in Auth. Using NextAuth/Auth.js creates dual auth sources of truth',
   why_ja:'SupabaseとNextAuthを同時に使うと「誰が正しいユーザーか」を管理するシステムが2つ存在します。NextAuthのJWTとSupabaseのJWTは別物で、Supabase RLSポリシーはSupabase Auth JWTしか認識しません。結果としてRLSが機能せず、データ保護が崩壊します。',
   why_en:'Using both Supabase and NextAuth means two systems claim to be the source of truth for user identity. NextAuth JWTs and Supabase JWTs are different — Supabase RLS policies only recognize Supabase Auth JWTs. The result is broken RLS and collapsed data protection.',
   fix:{f:'auth',s:'Supabase Auth'}},
  // A6: backend≠Supabase && auth に Supabase Auth
  {id:'sem-auth-nosupa-supaauth',p:['auth','backend'],lv:'warn',
   t:a=>!inc(a.backend,'Supabase')&&inc(a.auth,'Supabase Auth'),
   ja:'Supabase Authが選択されていますが、バックエンドがSupabaseではありません。認証の接続先が不明確になります',
   en:'Supabase Auth selected but backend is not Supabase. Auth connection target will be unclear',
   why_ja:'Supabase AuthはSupabaseプロジェクト（DB + Auth + Storage）と一体のサービスです。Express/Django等の独自バックエンドからSupabase JWTを検証するにはJWT Secretの共有設定が必要で、RLSポリシーも正しく機能しません。Supabase Authを使うなら、バックエンドもSupabaseに統一するか、Next.js + Supabase SSRパターンを採用するのが最適です。',
   why_en:'Supabase Auth is integrated with a Supabase project (DB + Auth + Storage). Verifying Supabase JWTs from a separate backend (Express/Django) requires sharing the JWT Secret, and RLS policies won\'t work correctly. If using Supabase Auth, unify the backend on Supabase or adopt the Next.js + Supabase SSR pattern.',
   chain:[{f:'backend',s:'Supabase'},{f:'database',s:'Supabase (PostgreSQL)'}]},
  {id:'sem-auth-nofb-fbauth',p:['auth','backend'],lv:'warn',
   t:a=>inc(a.auth,'Firebase Auth')&&!inc(a.backend,'Firebase')&&!inc(a.backend,'Supabase'),
   ja:'Firebase Authが選択されていますが、バックエンドがFirebaseではありません。Admin SDKでのJWT検証設定が必要になります',
   en:'Firebase Auth selected but backend is not Firebase. Admin SDK JWT verification setup will be required',
   why_ja:'Firebase Authはトークン発行のみ担当し、APIサーバー側でのJWT検証にはFirebase Admin SDKの初期化（サービスアカウント鍵）が必要です。Express/FastAPI等の独自バックエンドでAdmin SDKを使うと、認証SoTが分散し、Firebase側のトークン失効・権限変更をバックエンドがリアルタイムで追跡できなくなります。バックエンドをFirebaseに統一するか、Next.js + Firebase AuthのSSRパターンが最もシンプルです。',
   why_en:'Firebase Auth only issues tokens — your API server needs Firebase Admin SDK (service account key) for JWT verification. Using Admin SDK in Express/FastAPI scatters the auth source of truth and makes it difficult for the backend to track Firebase-side token revocation or permission changes in real time. The simplest approach is to unify the backend on Firebase or use the Next.js + Firebase Auth SSR pattern.',
   fix:{f:'backend',s:'Firebase'}},
  // A7: purpose=教育系 && entities に Product/Order（ドメイン不一致）
  {id:'sem-purpose-entities',p:['purpose','data_entities'],lv:'info',
   t:a=>(inc(a.purpose,'教育')||inc(a.purpose,'学習')||inc(a.purpose,'Education')||inc(a.purpose,'Learning')||inc(a.purpose,'LMS'))&&(inc(a.data_entities,'Product')||inc(a.data_entities,'Order')),
   ja:'教育・学習系のプロジェクトにProduct/Orderエンティティがあります。教材販売が目的でなければCourse/Lessonへの変更を検討してください',
   en:'Education project has Product/Order entities. Consider Course/Lesson unless this is for course sales',
   why_ja:'エンティティ名は生成されるDBスキーマ・APIエンドポイント・テスト・ドキュメントに直接使われます。教育プラットフォームでProductとOrderを使うと、EC系の命名規則（SKU・カート・返品ポリシー）が混入した仕様書が生成されます。学習管理システム（LMS）ではCourse・Lesson・Enrollment・Progressが標準的なドメイン語彙です。',
   why_en:'Entity names are used directly in generated DB schemas, API endpoints, tests, and documentation. Using Product and Order in an education platform causes generated specs to include EC naming conventions (SKU, cart, return policy). Learning Management Systems (LMS) use Course, Lesson, Enrollment, and Progress as standard domain vocabulary.',
   fixFn:a=>({f:'data_entities',s:(a.data_entities||'').replace(/Product/g,'Course').replace(/Order/g,'Enrollment')})},
  // A8: deploy=Vercel && backend含Express && frontend含Next.js（BFF曖昧）
  {id:'sem-deploy-bff',p:['deploy','backend','frontend'],lv:'info',
   t:a=>inc(a.deploy,'Vercel')&&inc(a.backend,'Express')&&inc(a.frontend,'Next.js'),
   ja:'Next.js + Express + Vercelの構成です。ExpressをNext.js API Routesに統合するか、Expressを別ホスト（Railway等）にする設計判断が必要です。生成文書ではAPI Routes統合を前提とします',
   en:'Next.js + Express + Vercel stack detected. Decide whether to merge Express into Next.js API Routes or host Express separately. Generated docs will assume API Routes integration',
   why_ja:'VercelはExpressのようなステートフルサーバーをデプロイできません（サーバーレス関数のみ）。Next.js API RoutesはVercelサーバーレス関数として動作し、Expressを置き換えられます。一方、SocketIO・長時間バックグラウンド処理・大容量ファイル処理が必要な場合はExpressをRailway/Fly.ioに分離する「BFF（Backend for Frontend）」構成が必要です。',
   why_en:'Vercel cannot deploy stateful servers like Express (serverless functions only). Next.js API Routes run as Vercel serverless functions and can replace Express. However, if you need SocketIO, long-running background processing, or large file handling, you need to host Express separately on Railway/Fly.io as a "BFF (Backend for Frontend)" architecture.'},
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
   en:'Finance/health/legal project without MFA (multi-factor authentication). MFA is strongly recommended for security',
   why_ja:'パスワード単体では不十分です。金融・医療・法務では、流出したパスワード1つで全データへのアクセスが可能になります。PCI-DSS v4ではMFAが必須（Requirement 8.4）、HIPAAでもリスク軽減措置として強く推奨されます。TOTP/SMS等で第2ファクターを追加してください。',
   why_en:'Passwords alone are insufficient. In finance/health/legal, a single leaked password grants access to all data. PCI-DSS v4 mandates MFA (Requirement 8.4); HIPAA strongly recommends it as a risk mitigation measure. Add a second factor (TOTP/SMS).'},
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
   why_ja:'Patient・MedicalRecord・BankAccount等のエンティティは個人情報保護法（GDPR/個人情報保護法）の対象です。認証なしでは誰でもこれらのデータにアクセスでき、データ漏洩が発生した場合に法的責任が生じます。最低限のJWT認証でも大幅にリスクを低減できます。',
   why_en:'Patient, MedicalRecord, BankAccount entities are subject to privacy laws (GDPR, HIPAA). Without authentication, anyone can access this data — a breach creates serious legal liability. Even basic JWT auth dramatically reduces the risk surface.',
   fix:{f:'auth',s:'Supabase Auth'}},
  // ── DB設計 (2 WARN + 1 INFO) ──
  {id:'db-mongo-prisma',p:['database','orm'],lv:'warn',
   t:a=>inc(a.database,'MongoDB')&&inc(a.orm,'Prisma'),
   ja:'PrismaのMongoDBサポートは実験的です。Mongooseまたはネイティブドライバーを推奨します',
   en:'Prisma MongoDB support is experimental. Consider Mongoose or the native MongoDB driver',
   why_ja:'PrismaのMongoDB対応は「Preview」段階で、リレーション・マイグレーション・トランザクションなど主要機能が制限されています。本番環境でPrisma Migrateを使うとコレクション構造が壊れる既知の問題があります。MongooseはMongoDBネイティブのAPIに沿った安定したODMです。',
   why_en:'Prisma\'s MongoDB support is in "Preview" — major features like relations, migrations, and transactions are limited. Using Prisma Migrate in production has known issues corrupting collection structures. Mongoose is a stable ODM that follows MongoDB\'s native API.'},
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
  {id:'db-redis-primary',p:['database'],lv:'warn',
   t:a=>inc(a.database,'Redis')&&!inc(a.database,'PostgreSQL')&&!inc(a.database,'MySQL')&&!inc(a.database,'Supabase')&&!inc(a.database,'Mongo')&&!inc(a.database,'Neon'),
   ja:'Redisのみが主DBとして選択されています。Redisはキャッシュ・セッション用途向きで、永続データの主DBには不適切です。PostgreSQL/MongoDB等を主DBに追加してください',
   en:'Redis is selected as the only database. Redis is designed for caching and sessions, not as a primary persistent data store. Add PostgreSQL or MongoDB as the main DB',
   why_ja:'Redisはインメモリデータストアであり、デフォルトではサーバー再起動でデータが消失します（AOF/RDBによる永続化設定が可能ですが、本番での管理コストが高い）。ACIDトランザクション・外部キー・複雑なクエリには対応しておらず、アプリケーションの主DBとして使うと、データ整合性の維持が困難になります。PostgreSQLを主DB、Redisをセッション管理・キャッシュ・キュー用途に分離する構成を推奨します。',
   why_en:'Redis is an in-memory data store — by default, data is lost on server restart (AOF/RDB persistence is configurable but costly to manage in production). It lacks ACID transactions, foreign keys, and complex queries, making it unsuitable as an application\'s primary DB. The recommended pattern is PostgreSQL as the primary DB with Redis for session management, caching, and queuing.',
   fix:{f:'database',s:'PostgreSQL'}},
  {id:'db-mysql-kysely',p:['database','orm'],lv:'info',
   t:a=>inc(a.database,'MySQL')&&inc(a.orm,'Kysely'),
   ja:'Kysely + MySQLではmysql2パッケージとMySQLDialectの設定が必要です',
   en:'Kysely + MySQL requires the mysql2 package and MySQLDialect configuration',
   why_ja:'Kyselyはデータベースドライバーをダイアレクト（方言）プラグインとして抽象化しています。PostgreSQLには`@kysely-org/kysely`にバンドルされた`PostgresDialect`がありますが、MySQLサポートは別途`mysql2`パッケージのインストールと`MysqlDialect`の明示的な設定が必要です。これを忘れると「DialectAdapter is not defined」エラーが実行時に発生します。',
   why_en:'Kysely abstracts database drivers as dialect plugins. PostgreSQL has `PostgresDialect` bundled in `@kysely-org/kysely`, but MySQL support requires separately installing the `mysql2` package and explicitly configuring `MysqlDialect`. Forgetting this causes a "DialectAdapter is not defined" runtime error.'},
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
   en:'REST API: implement rate limiting to prevent abuse. Recommended: express-rate-limit (Node) / slowapi (Python) / bucket4j (Spring)',
   why_ja:'レート制限なしのAPIは1秒間に数千リクエストを処理しようとしてDBコネクションプールが枯渇します。悪意ある攻撃者は認証ブルートフォース（1秒1000回試行）・スクレイピング・サービス妨害が可能になります。`express-rate-limit`は1行で追加でき、IPアドレスベースのウィンドウカウンターでリクエストを制限します。',
   why_en:'APIs without rate limiting attempt to process thousands of requests per second, exhausting the DB connection pool. Malicious actors can perform authentication brute force (1000 attempts/second), scraping, or denial-of-service. `express-rate-limit` adds protection in one line using IP-based window counters to limit requests.'},
  // ── テスト品質 (1 WARN + 2 INFO) ──
  {id:'test-e2e-auth-storagestate',p:['auth','frontend'],lv:'warn',
   t:a=>{
     const hasAuth=a.auth&&!inc(a.auth,'なし')&&!inc(a.auth,'None')&&a.auth!=='';
     const hasWebFE=inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte');
     const hasMobileOnly=inc(a.mobile,'Expo')||inc(a.mobile,'React Native');
     return hasAuth&&hasWebFE&&!hasMobileOnly;
   },
   ja:'認証付きE2EテストはPlaywright storageStateでセッションを再利用し、不安定なログインフローを防いでください',
   en:'E2E tests with auth: use Playwright storageState to reuse sessions and prevent flaky login flows',
   why_ja:'E2Eテストごとにログインフローを実行すると、ネットワーク遅延・メール確認・MFAなどによりテストが不安定になります。Playwright storageStateはログイン済みセッションをJSONファイルに保存し、以降のテストはログイン不要で開始できます。CI環境ではセットアップスクリプトで一度だけ認証し、全テストで共有することでテスト速度が2-5倍向上します。',
   why_en:'Running a full login flow for each E2E test makes tests flaky — network delays, email verification, and MFA cause intermittent failures. Playwright storageState saves the authenticated session to a JSON file, allowing subsequent tests to skip login entirely. In CI, authenticate once in a setup script and share the state — test speed improves 2-5x.'},
  {id:'test-playwright-webkit',p:['frontend'],lv:'info',
   t:a=>(inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte'))&&(!a.mobile||inc(a.mobile,'なし')||inc(a.mobile,'None')),
   ja:'PlaywrightのWebKitプロジェクト設定でSafariクロスブラウザテストを追加することを推奨します',
   en:'Add Playwright WebKit project to enable Safari cross-browser test coverage'},
  {id:'test-mutation-stryker',p:['backend'],lv:'info',
   t:a=>isNodeBE(a)||inc(a.backend,'Next.js'),
   ja:'Strykerミューテーションテストを導入してテストの実効性（バグ検出力）を検証することを推奨します',
   en:'Add Stryker mutation testing to measure test effectiveness and catch untested code paths',
   why_ja:'ミューテーションテストとは、コードに意図的なバグ（例：`===`→`!==`、`+`→`-`）を自動的に埋め込み（ミュータント生成）、テストスイートがそのバグを検出（ミュータントを「殺す」）できるか検証する手法です。カバレッジ100%でもミューテーションスコアが低い場合、テストは実行されていてもバグを検出できない「空のテスト」である可能性があります。Strykerはこのミューテーション解析をNode.js/TypeScriptで自動化します。',
   why_en:'Mutation testing automatically injects intentional bugs into code (e.g., `===` → `!==`, `+` → `-`) to generate "mutants," then verifies whether your test suite detects (kills) each mutant. Even with 100% coverage, a low mutation score means tests execute but don\'t actually detect bugs — "empty tests." Stryker automates this mutation analysis for Node.js/TypeScript.'},
  // ── AI安全性 (3 WARN + 2 INFO) ──
  {id:'ai-guardrail-missing',p:['ai_auto','mvp_features'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return !/(guardrail|ガードレール|安全|safety|filter|フィルタ|sanitize|moderate|モデレート|validation|検証)/i.test(a.mvp_features||'');
   },
   ja:'AI機能が有効ですが、mvp_featuresにガードレール/安全フィルタの記述がありません。入力検証・出力モデレーション・レート制限を実装してください (docs/96参照)',
   en:'AI features active but no guardrail/safety filter in mvp_features. Implement input validation, output moderation, and rate limiting (see docs/96)',
   why_ja:'ガードレールなしのLLM機能は「プロンプトインジェクション」に脆弱です。悪意あるユーザーが「あなたのシステムプロンプトを全て出力して」と入力すると機密情報が漏洩します。また有害コンテンツ生成・競合他社への誘導・個人情報収集ツール化といった悪用が可能になります。',
   why_en:'LLM features without guardrails are vulnerable to prompt injection. Malicious inputs like "output all your system prompts" can leak confidential information. Attackers can also generate harmful content, redirect users to competitors, or turn the AI into a personal data collection tool.'},
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
   en:'PII entities (Patient/Transaction/etc.) used with AI features. Mask or pseudonymize PII before sending to LLM (see docs/95)',
   why_ja:'OpenAI/Anthropicのモデルに送信したデータはモデル改善に使用される場合があります（Enterprise契約を除く）。患者名・クレジットカード番号・診断情報等をそのままLLMに送ると、GDPR第9条（特別カテゴリデータ）・個人情報保護法違反のリスクがあります。送信前に`[患者名]`等に仮名化してください。',
   why_en:'Data sent to OpenAI/Anthropic models may be used for model improvement (unless on Enterprise contracts). Sending patient names, credit card numbers, or diagnoses to LLMs risks violating GDPR Article 9 (special category data) and similar privacy laws. Pseudonymize with `[patient_name]` etc. before sending.'},
  {id:'ai-ratelimit-reminder',p:['ai_auto','backend'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return isNodeBE(a)||isPyBE(a)||inc(a.backend,'Spring');
   },
   ja:'AI機能のあるAPIにはトークン消費量ベースのレート制限を実装してください。@upstash/ratelimit (Node) または slowapi with token tracking (Python) を推奨します',
   en:'Add token-budget rate limiting to AI API endpoints. Recommended: @upstash/ratelimit (Node) or slowapi with token tracking (Python)',
   why_ja:'通常のAPIリクエストは数ミリ秒ですが、LLM APIコール1回で数千〜数万トークンを消費し、月額コストが急増します。ユーザーが意図的またはバグで大量リクエストを送った場合、APIキーの料金上限に達してサービス全体が停止します。トークンバジェット方式では「1ユーザーあたり1分間に10,000トークンまで」という制限をかけ、コスト上限を保証します。',
   why_en:'Regular API requests take milliseconds, but a single LLM API call consumes thousands to tens of thousands of tokens, rapidly increasing monthly costs. If users intentionally or accidentally send many requests, hitting the API key spending limit stops the entire service. Token budget rate limiting guarantees a cost ceiling, e.g., "10,000 tokens per user per minute."'},
  {id:'ai-local-model-infra',p:['ai_auto','deploy'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     const isLocal=/(Ollama|LM Studio|ローカルLLM|local LLM|llama|mistral|open.?source|セルフホスト|self.?host)/i.test(a.ai_auto);
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     return isLocal&&isProd;
   },
   ja:'ローカル/セルフホストLLMとクラウドデプロイの組み合わせはGPUインスタンス（RunPod/Lambda Labs）またはvLLM/Ollamaサーバーの別途ホスティングが必要です',
   en:'Local/self-hosted LLM with cloud deployment requires GPU instances (RunPod/Lambda Labs) or separate vLLM/Ollama hosting',
   why_ja:'OllamaやLM Studioはローカル開発マシン（GPU搭載）でLLMを動かすツールです。Vercel/Railway等のクラウドサーバーレス環境にはGPUがなく、CPUのみでLlama-3-70Bを実行すると1トークン生成に数秒かかり実用不可です。本番環境でセルフホストLLMを使う場合はRunPod・Lambda Labs・Vast.aiのGPUインスタンスか、vLLMサーバーを別途用意し、アプリはそのAPIエンドポイントを呼び出す設計にしてください。',
   why_en:'Ollama and LM Studio run LLMs on local development machines (with GPU). Cloud serverless environments like Vercel/Railway have no GPU — running Llama-3-70B on CPU alone takes several seconds per token, making it impractical. For production self-hosted LLM, provision a GPU instance on RunPod, Lambda Labs, or Vast.ai, or set up a separate vLLM server, with your app calling its API endpoint.'},
  // ── クロスピラー P21/P22/P25 (INFO×3) ──
  {id:'api-openapi-remind',p:['mvp_features','data_entities'],lv:'info',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     return ents>=4&&!/(OpenAPI|swagger|api.spec|仕様書)/i.test(a.mvp_features||'');
   },
   ja:'エンティティが4件以上あります。docs/84_openapi_specification.md のOpenAPI 3.1仕様を活用してAPIコントラクトを明確にしてください',
   en:'4+ entities detected. Use OpenAPI 3.1 spec (docs/84) to clarify API contracts and generate client SDKs',
   why_ja:'エンティティが4件以上になると、APIエンドポイントは通常20件を超えます。OpenAPI 3.1仕様書がないと、フロントエンド・バックエンド・AIエージェント間でAPIの期待値が口頭合意・コード読み取りに頼ることになります。OpenAPI仕様からは自動的にTypeScriptクライアントSDK（openapi-typescript）・バリデーション・APIドキュメントサイトが生成でき、チーム規模が大きいほど効果があります。',
   why_en:'With 4+ entities, API endpoints typically exceed 20. Without an OpenAPI 3.1 spec, expected values between frontend, backend, and AI agents rely on verbal agreements or code reading. From an OpenAPI spec, you can automatically generate TypeScript client SDKs (openapi-typescript), validation, and API documentation sites — the larger the team, the greater the benefit.'},
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
   en:'Production deployment + DB detected. Set RTO/RPO targets and backup strategy per docs/90 before going live',
   why_ja:'RTO（Recovery Time Objective）はシステム復旧までの許容時間、RPO（Recovery Point Objective）はデータ損失の許容量です。バックアップ戦略のないDB障害では、最悪ケースでデータが完全に失われます。NeonのPoint-in-Time Recoveryは1分単位で復元可能、SupabaseはPITR（有料プラン）でDBスナップショットを提供します。本番リリース前に自動バックアップのテストを必ず実施してください。',
   why_en:'RTO (Recovery Time Objective) is the acceptable time to restore a system; RPO (Recovery Point Objective) is the acceptable data loss window. Without a backup strategy, a DB failure at worst means complete data loss. Neon\'s Point-in-Time Recovery restores to minute-level precision; Supabase offers PITR DB snapshots (paid plans). Always test automated backups before production launch.'},
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
   why_ja:'JWTは一度発行すると有効期限まで取り消せません。ユーザーをBANしてもトークンが生きている限りAPIに到達できます。コンプライアンス監査では全認証イベントのログが必要ですが、カスタムJWTでは実装コストが非常に高くなります。Auth.jsはトークン失効・監査ログ・OIDCを標準装備しています。',
   why_en:'JWTs cannot be revoked once issued — a banned user\'s token still reaches your API until expiry. Compliance audits require full authentication event logs, which are expensive to build with custom JWT. Auth.js provides token revocation, audit logs, and OIDC out of the box.',
   fix:{f:'auth',s:'Auth.js/NextAuth'}},
  {id:'api-large-no-pagination',p:['data_entities','mvp_features'],lv:'warn',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     const hasPagination=/(ページネーション|pagination|cursor|infinite.?scroll|limit|offset)/i.test(a.mvp_features||'');
     return ents>=5&&!hasPagination;
   },
   ja:'エンティティが5件以上ありますが、mvp_featuresにページネーションの記述がありません。一覧画面でのパフォーマンス問題を防ぐためカーソルページネーションを実装してください',
   en:'5+ entities but no pagination in mvp_features. Implement cursor-based pagination to prevent list view performance issues',
   why_ja:'SELECT * FROM posts はデータが少ない開発中は問題ありませんが、本番で10万件になると全件をメモリにロードし応答に数秒かかります。カーソルベースのページネーション（WHERE id > cursor LIMIT 20）はインデックスを活用し常に一定速度を保ちます。',
   why_en:'SELECT * FROM posts is fine in development with 100 rows, but in production with 100,000 rows it loads everything into memory and takes seconds. Cursor-based pagination (WHERE id > cursor LIMIT 20) uses an index and maintains constant speed regardless of data size.'},
  {id:'infra-prod-no-monitoring',p:['deploy','mvp_features'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasMonitor=/(監視|monitoring|Sentry|Datadog|OpenTelemetry|APM|ログ管理|logging|alert|アラート)/i.test(a.mvp_features||'');
     return isProd&&!hasMonitor;
   },
   ja:'本番デプロイ構成ですが、監視/APM（Sentry/Datadog/OpenTelemetry）がmvp_featuresに含まれていません（docs/102参照）',
   en:'Production deployment without monitoring/APM in mvp_features. See docs/102 for Sentry/Datadog/OpenTelemetry setup',
   why_ja:'本番環境でエラーが発生しても、監視がなければユーザーからの苦情が来るまで気づきません。Sentryはエラーを自動キャプチャしスタックトレース・ユーザー影響数・再現率をダッシュボードに表示します。OpenTelemetryは分散トレーシング（どのAPIコールが遅いか）を可視化します。「エラーが起きたら直す」ではなく「エラーが起きる前に検知する」体制が本番品質のサービスには必要です。',
   why_en:'Without monitoring, you won\'t know when errors occur in production until users complain. Sentry automatically captures errors and shows stack traces, user impact counts, and reproduction rates in a dashboard. OpenTelemetry visualizes distributed tracing (which API calls are slow). Production-quality services require a posture of "detect before errors happen," not "fix after errors happen."'},
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
   why_ja:'GooglebotはJavaScriptを実行しますが、CSRページはレンダリング遅延が生じ、クロール予算の消費も激しいです。特に`<title>`や`<meta description>`がJS実行後に設定される場合、インデックス登録が大幅に遅れます。SSR/SSGではHTMLに直接埋め込まれるため即座にインデックスされます。',
   why_en:'Googlebot executes JavaScript, but CSR pages suffer render delays and consume heavy crawl budget. When `<title>` and `<meta description>` are set after JS execution, indexing is significantly delayed. SSR/SSG embeds them directly in HTML, enabling immediate indexing.',
   fix:{f:'frontend',s:'React + Next.js'}},
  {id:'a11y-no-axe',p:['frontend','mvp_features'],lv:'info',
   t:a=>{
     const hasWebFE=inc(a.frontend,'Next')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte')||inc(a.frontend,'Angular');
     const hasA11y=/(axe|a11y|アクセシビリティ|accessibility|WCAG|WAI-ARIA)/i.test(a.mvp_features||'');
     return hasWebFE&&!hasA11y;
   },
   ja:'アクセシビリティテスト（axe-core/Pa11y）をCI/CDに組み込むことを推奨します（docs/91参照）',
   en:'Add accessibility testing (axe-core/Pa11y) to CI/CD pipeline for inclusive design (see docs/91)',
   why_ja:'WCAG 2.1 AA準拠はEUのEAA（欧州アクセシビリティ法、2025年6月施行）・米国ADA（障害者法）・日本の障害者差別解消法で要求されています。axe-coreはChrome拡張またはPlaywrightプラグインで、ARIAラベル欠如・コントラスト比・キーボードフォーカス等のアクセシビリティ違反を自動検出します。CI/CDに組み込めばリグレッション（既存のアクセシビリティ違反の再混入）を防止できます。',
   why_en:'WCAG 2.1 AA compliance is required by the EU\'s EAA (European Accessibility Act, enforced June 2025), the US ADA (Americans with Disabilities Act), and similar laws globally. axe-core detects accessibility violations (missing ARIA labels, insufficient contrast ratios, keyboard focus issues) via Chrome extension or Playwright plugin. Integrating it into CI/CD prevents regressions (re-introducing previously fixed accessibility violations).'},
  {id:'zt-db-privilege',p:['database','deploy'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasPgMy=/(PostgreSQL|MySQL|Neon)/i.test(a.database||'');
     const hasRoles=/(role|権限|privilege|最小権限|least privilege)/i.test(a.mvp_features||'');
     return isProd&&hasPgMy&&!hasRoles;
   },
   ja:'本番PostgreSQL/MySQL構成です。アプリ用の最小権限ロール（SELECT/INSERT/UPDATE のみ）を作成し、rootユーザーでの接続を避けてください（docs/43参照）',
   en:'Production PostgreSQL/MySQL: create least-privilege app roles (SELECT/INSERT/UPDATE only). Never connect as root (see docs/43)',
   why_ja:'アプリケーションがrootまたはsuperuser権限でDBに接続していると、SQLインジェクション脆弱性が発覚した場合に攻撃者がDB全体を削除・書き換えできます。最小権限ロール（アプリ用: SELECT/INSERT/UPDATE/DELETE + マイグレーション用: CREATE/ALTER/DROP を分離）を作成することで、攻撃の影響範囲を限定できます。PostgreSQLでは`GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO app_role;`で設定できます。',
   why_en:'When an application connects to a DB as root/superuser, a SQL injection vulnerability gives attackers the ability to delete or rewrite the entire DB. Creating least-privilege roles (app role: SELECT/INSERT/UPDATE/DELETE; migration role: CREATE/ALTER/DROP, separated) limits the blast radius of an attack. In PostgreSQL, set it with `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES TO app_role;`.'},
  {id:'api-cors-wildcard',p:['backend','deploy'],lv:'warn',
   t:a=>{
     const hasAPI=inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'NestJS')||inc(a.backend,'Hono')||inc(a.backend,'FastAPI')||inc(a.backend,'Django')||inc(a.backend,'Spring');
     const hasCORS=/(CORS|cors|cross.?origin)/i.test(a.mvp_features||'');
     return hasAPI&&!hasCORS;
   },
   ja:'APIサーバー構成でCORS設定の記述がありません。ワイルドカード（*）許可は禁止し、許可オリジンを明示的に設定してください（docs/43参照）',
   en:'API server without CORS in mvp_features. Never allow wildcard (*) origins — set explicit allowed origins (see docs/43)',
   why_ja:'CORSはブラウザの保護機構です。`Access-Control-Allow-Origin: *` を設定すると、悪意あるサイトがユーザーのブラウザ経由でAPIを呼び出せるようになります（CSRF攻撃）。認証Cookieを使用している場合は特に危険で、ユーザーになりすましてデータを読み書きされます。',
   why_en:'CORS is a browser protection mechanism. Setting `Access-Control-Allow-Origin: *` allows malicious sites to call your API through the user\'s browser (CSRF attack). When using authentication cookies, this is especially dangerous — attackers can read and write data as the user.'},
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
   en:'SQL database without migration tool detected. Set up schema migrations (Prisma Migrate/Drizzle Kit/Alembic) for safe schema evolution (see docs/88)',
   why_ja:'マイグレーションツールなしでDBスキーマを変更すると、本番DBとコードのスキーマが乖離します。手動ALTER TABLEは本番環境への適用漏れ・適用順序ミス・ロールバック不能が頻発します。Prisma Migrateは差分を`migrations/`ディレクトリに保存し、`prisma migrate deploy`で本番に安全に適用・ロールバックができます。チーム開発では特にスキーマのバージョン管理が重要です。',
   why_en:'Changing DB schemas without migration tooling causes divergence between production DB and code schemas. Manual ALTER TABLE frequently results in missed production deployments, incorrect ordering, and inability to roll back. Prisma Migrate saves diffs to a `migrations/` directory and applies them safely with `prisma migrate deploy`. Schema version control is especially critical in team development.'},
  // ── Semantic / Runtime Compatibility (2 ERROR, 5 WARN, 3 INFO) ──
  {id:'be-firebase-prisma',p:['backend','orm'],lv:'error',
   t:a=>inc(a.backend,'Firebase')&&inc(a.orm,'Prisma'),
   ja:'FirebaseはNoSQL（Firestore）のため、SQLベースのPrismaは使用できません。FirebaseはFirebase Admin SDKでアクセスしてください',
   en:'Firebase uses Firestore (NoSQL). Prisma is a SQL ORM and is incompatible. Use the Firebase Admin SDK directly',
   why_ja:'PrismaはPostgreSQL/MySQL/SQLiteなどのRDB専用ORMです。FirebaseのデータストアはFirestoreというドキュメント型NoSQLであり、SQL接続文字列もスキーマ定義も存在しません。Prismaの`generate`コマンドはFirestoreに接続するドライバーを持たないため、ビルド時にエラーになります。',
   why_en:'Prisma is a SQL-only ORM for PostgreSQL/MySQL/SQLite. Firebase\'s datastore is Firestore, a document-based NoSQL with no SQL connection string or schema definition. Prisma\'s `generate` command has no driver to connect to Firestore and will error at build time.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'be-firebase-typeorm',p:['backend','orm'],lv:'error',
   t:a=>inc(a.backend,'Firebase')&&inc(a.orm,'TypeORM'),
   ja:'FirebaseはNoSQL（Firestore）のため、SQL用のTypeORMは使用できません。Firebase Admin SDKを使用してください',
   en:'Firebase uses Firestore (NoSQL). TypeORM is a SQL ORM and is incompatible. Use the Firebase Admin SDK directly',
   why_ja:'TypeORMはPostgreSQL/MySQL/SQLiteなどのRDB専用ORMです。FirebaseのデータストアはFirestoreというドキュメント型NoSQLであり、SQL接続文字列・テーブル定義・マイグレーションが存在しません。TypeORMの`@Entity`・`@Column`デコレーターはFirestoreのドキュメント構造と互換性がなく、ビルド時にデータソース接続エラーが発生します。',
   why_en:'TypeORM is a SQL-only ORM for PostgreSQL/MySQL/SQLite. Firebase\'s datastore is Firestore, a document-based NoSQL with no SQL connection strings, table definitions, or migrations. TypeORM\'s `@Entity` and `@Column` decorators are incompatible with Firestore\'s document structure and will cause datasource connection errors at build time.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'orm-typeorm-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'TypeORM')&&inc(a.database,'Firestore'),
   ja:'TypeORMはSQL専用ORMです。FirestoreはNoSQLのため接続できません。Firebase Admin SDKを直接使用してください',
   en:'TypeORM is a SQL-only ORM and cannot connect to Firestore (NoSQL). Use the Firebase Admin SDK directly',
   why_ja:'TypeORMはデータソースにSQL接続文字列（postgresql://...等）を要求します。Firestoreにはそのような接続プロトコルが存在せず、TypeORMのドライバーもFirestoreに対応していません。`DataSource.initialize()`はFirestoreを対象にした場合にビルド時エラーになります。FirestoreにはFirebase Admin SDK（Node.js）またはsupabase-js（Supabase使用時）を使用してください。',
   why_en:'TypeORM requires a SQL connection string (e.g. postgresql://...) for its DataSource. Firestore has no such connection protocol and TypeORM has no Firestore driver. `DataSource.initialize()` targeting Firestore will error at build time. Use the Firebase Admin SDK (Node.js) or supabase-js (if using Supabase) instead.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'orm-sqla-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.database,'Firestore'),
   ja:'SQLAlchemyはSQL専用ORMです。FirestoreはNoSQLのため接続できません。Firebase Admin SDK（Python）を使用してください',
   en:'SQLAlchemy is SQL-only and cannot connect to Firestore (NoSQL). Use the Firebase Admin SDK for Python',
   why_ja:'SQLAlchemyはPostgreSQL/MySQL/SQLite等のSQLデータベースに対してDB-API 2.0準拠のドライバーで接続します。Firestoreはgoogle-cloud-firestoreライブラリ経由でHTTP/gRPCプロトコルで接続するNoSQLであり、SQLAlchemyのエンジン・セッション・マッピング機能を使うことは技術的に不可能です。',
   why_en:'SQLAlchemy connects to PostgreSQL/MySQL/SQLite via DB-API 2.0 compliant drivers. Firestore is a NoSQL service accessed via HTTP/gRPC through the google-cloud-firestore library. Using SQLAlchemy\'s engine, session, or mapping functionality against Firestore is technically impossible.',
   fix:{f:'orm',s:'None / Firebase Admin SDK'}},
  {id:'orm-sqla-mongo',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.database,'MongoDB'),
   ja:'SQLAlchemyにMongoDBドライバーはありません。MongoDBにはMongoEngine/Motor/PyMongoを使用してください',
   en:'SQLAlchemy has no MongoDB driver. Use MongoEngine, Motor, or PyMongo for MongoDB',
   why_ja:'SQLAlchemyはリレーショナルデータベース専用のORMであり、MongoDBへの公式サポートは存在しません。過去に`ming`等の非公式アダプターが存在しましたが現在は非推奨です。PythonでMongoDBを扱うにはPyMongo（公式ドライバー）・Motor（非同期対応）・MongoEngine（ODM）を選択してください。',
   why_en:'SQLAlchemy is an ORM exclusively for relational databases with no official MongoDB support. Legacy unofficial adapters like `ming` exist but are deprecated. For MongoDB in Python, use PyMongo (official driver), Motor (async), or MongoEngine (ODM).',
   fix:{f:'orm',s:'None / PyMongo'}},
  {id:'orm-typeorm-mongo',p:['orm','database'],lv:'info',
   t:a=>inc(a.orm,'TypeORM')&&inc(a.database,'MongoDB'),
   ja:'TypeORMのMongoDB対応は実験的段階で、主要機能（リレーション・マイグレーション）に制限があります。Mongooseの使用を検討してください',
   en:'TypeORM\'s MongoDB support is experimental with limited relations and migrations. Consider using Mongoose instead',
   why_ja:'TypeORMはMongoDB用の`MongoEntityManager`を提供していますが、`@ManyToOne`等のリレーションマッピング・マイグレーション・トランザクションが動作しない既知の問題があります。MongooseはMongoDBのドキュメント構造に沿ったスキーマ・バリデーション・ポピュレーションを提供する成熟したODMです。',
   why_en:'TypeORM provides `MongoEntityManager` for MongoDB but has known issues with relation mapping (`@ManyToOne` etc.), migrations, and transactions. Mongoose is a mature ODM that provides schemas, validation, and population aligned with MongoDB\'s document structure.'},
  {id:'mt-supabase-no-rls',p:['backend','org_model'],lv:'error',
   t:a=>inc(a.backend,'Supabase')&&a.org_model&&/(company|b2b|チーム|team|組織|enterprise|B2B)/i.test(a.org_model||'')&&!/(RLS|Row Level Security|行単位セキュリティ)/i.test(a.mvp_features||''),
   ja:'マルチテナント構成でSupabaseを使用していますが、RLS（行単位セキュリティ）の設定が見当たりません。テナント間のデータ漏洩リスクがあります',
   en:'Multi-tenant Supabase without Row Level Security (RLS) detected. Risk of cross-tenant data leakage',
   why_ja:'SupabaseはPostgreSQLのRLSを利用してテナント間のデータ分離を実現します。RLSなしでは、異なる組織のユーザーが互いのデータを読み取れる状態になります（例: `SELECT * FROM orders`で全テナントのデータが返る）。`ALTER TABLE orders ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON orders USING (org_id = auth.jwt()->>\'org_id\');`の設定が必須です。',
   why_en:'Supabase uses PostgreSQL RLS to achieve data isolation between tenants. Without RLS, users of different organizations can read each other\'s data (e.g., `SELECT * FROM orders` returns all tenant data). You must configure: `ALTER TABLE orders ENABLE ROW LEVEL SECURITY; CREATE POLICY tenant_isolation ON orders USING (org_id = auth.jwt()->>\'org_id\');`',
   fix:{f:'mvp_features',s:'RLS (Row Level Security) per-tenant isolation'}},
  {id:'deploy-sqlite-vercel',p:['database','deploy'],lv:'warn',
   t:a=>inc(a.database,'SQLite')&&inc(a.deploy,'Vercel'),
   ja:'VercelはエフェメラルなファイルシステムのためSQLiteの書き込みはリクエスト間で消失します。Supabase/Neon/PlanetScaleへの変更を推奨します',
   en:'Vercel has an ephemeral filesystem. SQLite writes are lost between requests. Switch to Supabase/Neon/PlanetScale',
   why_ja:'Vercelのサーバーレス関数はリクエストごとに新しいコンテナ上で実行され、ファイルシステムへの書き込みは次のリクエストでは残りません。SQLiteはファイルシステムにDBファイルを保持するため、書き込みが全て揮発します。開発環境でのみ動作し、本番環境では全データが消失します。Neon（サーバーレスPostgreSQL）はVercelと同じリージョンに配置でき相性が良いです。',
   why_en:'Vercel serverless functions run in a new container per request, and filesystem writes do not persist to the next request. SQLite stores the DB file on the filesystem, so all writes are volatile. It works only in development; in production, all data is lost. Neon (serverless PostgreSQL) can be placed in the same region as Vercel and works well together.',
   fix:{f:'database',s:'Neon (Serverless PostgreSQL)'}},
  {id:'db-pg-vercel-nopool',p:['database','deploy'],lv:'warn',
   t:a=>{
     const isPg=/(PostgreSQL|Neon)/i.test(a.database||'');
     const isVercel=inc(a.deploy,'Vercel');
     const hasPool=/(PgBouncer|pgpool|pool|Neon|connection.?pool)/i.test((a.database||'')+(a.mvp_features||''));
     return isPg&&isVercel&&!hasPool;
   },
   ja:'Vercelサーバーレス＋PostgreSQLではコネクション枯渇が発生します。PgBouncer/Neonのサーバーレス対応接続プールを使用してください',
   en:'Vercel serverless + PostgreSQL risks connection pool exhaustion. Use PgBouncer or Neon\'s serverless-compatible connection pooler',
   why_ja:'Vercelのサーバーレス関数は同時実行数が急増するとそれぞれが独立したDB接続を張ります。PostgreSQLの最大接続数（通常100〜200）を瞬時に超え、`too many connections`エラーが発生します。Neonはサーバーレス対応のHTTP接続方式を提供しており、Vercelとの組み合わせでコネクション枯渇を防ぎます。既存のPostgreSQLならPgBouncerをプロキシとして挟むことで解消できます。',
   why_en:'Vercel serverless functions each open an independent DB connection when concurrent requests spike, instantly exceeding PostgreSQL\'s max connections (typically 100-200) and causing `too many connections` errors. Neon provides a serverless-compatible HTTP connection mode that prevents pool exhaustion with Vercel. For existing PostgreSQL, PgBouncer as a proxy resolves the issue.',
   fix:{f:'database',s:'Neon (Serverless PostgreSQL)'}},
  {id:'be-nestjs-beginner',p:['backend','skill_level'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.skill_level,'Beginner'),
   ja:'NestJSはDI・デコレーター・TypeScriptが前提の上級者向けフレームワークです。BeginnerにはExpress/Honoを推奨します',
   en:'NestJS requires DI, decorators and TypeScript expertise. For Beginners, Express or Hono is recommended',
   why_ja:'NestJSはAngularに着想を得たDI（依存性注入）コンテナ・モジュールシステム・デコレーター群を持つエンタープライズ向けフレームワークです。基本的なAPIを実装するだけでも`@Module`,`@Controller`,`@Injectable`,`@Body`等の概念理解が必要で、エラー時のデバッグが難しく学習コストが高いです。Express/Honoは数十行でAPIサーバーを立ち上げられ、段階的に学習できます。',
   why_en:'NestJS is an enterprise framework inspired by Angular, with a DI container, module system, and decorators. Even implementing a basic API requires understanding `@Module`, `@Controller`, `@Injectable`, and `@Body` — debugging errors is difficult and learning costs are high. Express/Hono can start an API server in dozens of lines with a gentler learning curve.',
   fix:{f:'backend',s:'Express + Node.js'}},
  {id:'orm-sqlalchemy-vercel',p:['orm','deploy'],lv:'warn',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.deploy,'Vercel'),
   ja:'SQLAlchemy（Python）はVercelのNode.js中心のサーバーレス環境と相性が悪く、コールドスタート遅延や関数サイズ制限に抵触する可能性があります',
   en:'SQLAlchemy (Python) is poorly suited for Vercel\'s Node.js-oriented serverless. Expect cold start delays and potential function size limit issues',
   why_ja:'VercelはデフォルトでHobbyプラン関数サイズ50MB制限があり、Python関数でSQLAlchemy+Alembicを組み合わせると容易にこの制限を超えます。またPythonのコールドスタートはNode.jsより遅く（〜1〜3秒）、ユーザー体験に影響します。PythonバックエンドにはRailway/Render/Fly.ioが適しています。',
   why_en:'Vercel has a 50MB function size limit by default (Hobby plan), easily exceeded when combining SQLAlchemy + Alembic in Python functions. Python cold starts are also slower than Node.js (~1-3 seconds), impacting user experience. Railway/Render/Fly.io are better suited for Python backends.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'pay-stripe-static-be',p:['payment','backend'],lv:'warn',
   t:a=>inc(a.payment,'Stripe')&&isStaticBE(a),
   ja:'StripeのWebhook（payment_intent.succeeded等）処理には必ずサーバーサイドが必要です。静的サイト構成では決済完了を安全に確認できません',
   en:'Stripe Webhooks (payment_intent.succeeded etc.) require server-side processing. A static-only stack cannot safely confirm payment completion',
   why_ja:'Stripe Webhookは決済確定・失敗・返金などのイベントをサーバーに非同期で通知します。このエンドポイントが存在しないと、決済ステータスの更新・メール送信・注文確定処理が実行できません。クライアントサイドのみでは`payment_intent.succeeded`を信頼できず、ユーザーが決済せずに注文確定できる脆弱性が生まれます。Next.js APIルート（`/api/webhook`）またはExpressサーバーが必要です。',
   why_en:'Stripe Webhooks asynchronously notify your server about payment confirmation, failure, refund, etc. Without an endpoint to receive these, you cannot update payment status, send emails, or confirm orders. Client-side only cannot reliably trust `payment_intent.succeeded`, creating a vulnerability where users can confirm orders without paying. You need a Next.js API route (`/api/webhook`) or Express server.',
   fix:{f:'backend',s:'Express + Node.js'}},
  {id:'fe-nextjs-realtime-naked',p:['frontend','mvp_features'],lv:'info',
   t:a=>inc(a.frontend,'Next')&&/(WebSocket|websocket|リアルタイム|realtime|チャット|chat|通知|notification)/i.test(a.mvp_features||'')&&!/(Pusher|Ably|Socket\.io|Supabase Realtime|Firebase|Convex|liveblocks)/i.test(a.mvp_features||''),
   ja:'Next.js App RouterではネイティブWebSocketサーバーが動作しません。Pusher/Ably/Supabase Realtimeの利用を推奨します（docs/49参照）',
   en:'Next.js App Router does not support native WebSocket servers. Use Pusher/Ably/Supabase Realtime for realtime features (see docs/49)',
   why_ja:'Next.jsのApp Router（Vercel Edge Runtime）はステートレス関数として実行されるため、永続的なWebSocket接続を保持できません。Pusher/Ably/Supabase Realtimeはマネージドなリアルタイム配信サービスで、スケーラブルな接続管理を提供します。self-hostedが必要な場合はSocket.ioサーバーを別途Railway等に立てる構成が一般的です。',
   why_en:'Next.js App Router (Vercel Edge Runtime) runs as stateless functions and cannot maintain persistent WebSocket connections. Pusher/Ably/Supabase Realtime are managed realtime delivery services providing scalable connection management. For self-hosted, a Socket.io server on Railway is a common architecture.'},
  {id:'auth-baas-custom-jwt',p:['backend','auth'],lv:'info',
   t:a=>(inc(a.backend,'Firebase')||inc(a.backend,'Supabase'))&&inc(a.auth,'JWT')&&!inc(a.auth,'Firebase')&&!inc(a.auth,'Supabase'),
   ja:'Firebase/SupabaseとカスタムJWTを併用すると認証の正本（SoT）が分裂します。BaaSの組み込み認証（Firebase Auth/Supabase Auth）に統一してください',
   en:'Mixing Firebase/Supabase with custom JWT splits your auth source of truth. Unify on the BaaS built-in auth (Firebase Auth/Supabase Auth)',
   why_ja:'Firebase/SupabaseはそれぞれFirebase Auth/Supabase AuthというJWT発行機構を内蔵しており、RLS・セキュリティルール・SDK全体がこの内蔵JWTと統合されています。カスタムJWTを独自に発行すると、Firestoreセキュリティルールの`request.auth.uid`やSupabaseの`auth.uid()`が機能しなくなります。BaaS使用時はBaaS組み込みの認証フローを使用してください。',
   why_en:'Firebase/Supabase each have a built-in JWT issuance mechanism integrated with their RLS, security rules, and SDKs. Issuing custom JWTs breaks Firestore security rules (`request.auth.uid`) and Supabase\'s `auth.uid()`. When using BaaS, always use the BaaS built-in auth flow.'},
  {id:'deploy-cloudflare-node-orm',p:['orm','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.orm,'Prisma')||inc(a.orm,'TypeORM')||inc(a.orm,'SQLAlchemy')),
   ja:'Cloudflare WorkersはNode.js互換でないEdge Runtimeです。Prisma/TypeORM/SQLAlchemyはEdge非対応のため`@prisma/client/edge`等の専用モードが必要です',
   en:'Cloudflare Workers runs on a non-Node.js Edge Runtime. Prisma/TypeORM/SQLAlchemy require Edge-specific modes — use `@prisma/client/edge` or Drizzle ORM',
   why_ja:'Cloudflare WorkersはV8 Isolate Edge Runtimeであり、Node.js固有API（`fs`/`net`等）が利用できません。PrismaはデフォルトクライアントがNode.js前提のため`@prisma/client/edge`インポートとNeon HTTP接続が必要です。TypeORMはEdge未対応。SQLAlchemyはPython専用でWorkers（JS/WASM）では動作しません。Edge対応ORM筆頭はDrizzle ORM + Neon HTTPです。',
   why_en:'Cloudflare Workers runs on V8 Isolate Edge Runtime, lacking Node.js-specific APIs (`fs`/`net` etc.). Prisma\'s default client assumes Node.js — Workers requires the `@prisma/client/edge` import with Neon HTTP connections. TypeORM has no Edge support. SQLAlchemy is Python-only and doesn\'t run in Workers (JS/WASM). The leading Edge-compatible ORM is Drizzle ORM + Neon HTTP.'},
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
  'insurance|PostgreSQL':12,'insurance|Supabase':10,'insurance|Stripe':12,
  'booking|Stripe':18,'booking|Supabase':14,'booking|Firebase':10,
  'marketplace|Supabase':12,'marketplace|Firebase':8};

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
