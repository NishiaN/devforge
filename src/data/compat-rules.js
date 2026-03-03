/* ═══ STACK COMPATIBILITY & SEMANTIC CONSISTENCY RULES — 302 rules (ERROR×33 + WARN×141 + INFO×128) ═══ */
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
   why_ja:'静的バックエンドはサーバーサイド処理を持たないためモバイルアプリからのAPI呼び出しを受け取れません。SupabaseやFirebaseのようなBaaSを選択することで認証・データ永続化・リアルタイム更新をモバイルSDK経由で統合的に実現できます。',
   why_en:'A static-only backend has no server-side processing and cannot receive API calls from a mobile app. Choosing a BaaS like Supabase or Firebase provides authentication, data persistence, and real-time updates via native mobile SDKs.',
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
   why_ja:'モバイルアプリはストアに公開され不特定多数にダウンロードされます。認証なしではAPIエンドポイントが誰でもアクセス可能になり、データの不正読み取りや改ざんのリスクがあります。',
   why_en:'Mobile apps are published to stores and downloaded by anyone. Without authentication, API endpoints are publicly accessible — allowing unauthorized data reads and modifications.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Expo')&&inc(a.auth,'NextAuth'),
   ja:'NextAuthはWeb専用。React Nativeには@react-native-google-signin等のアダプター必要',
   en:'NextAuth is web-only. React Native needs adapters like @react-native-google-signin',
   why_ja:'NextAuthはNext.js APIルートやHTTPセッションCookieに依存しており、React Nativeのネイティブ環境ではHTTPリクエストの仕組みが根本的に異なります。Expo GoはNext.jsサーバーを同梱しておらず、NextAuthのコールバックURLをハンドルできません。',
   why_en:'NextAuth depends on Next.js API routes and HTTP session cookies. React Native\'s native environment handles HTTP requests fundamentally differently — Expo Go does not bundle a Next.js server and cannot handle NextAuth callback URLs.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'mob-auth-flutter-nextauth',p:['mobile','auth'],lv:'warn',
   t:a=>a.mobile&&inc(a.mobile,'Flutter')&&(inc(a.auth,'NextAuth')||inc(a.auth,'Auth.js')),
   ja:'FlutterではNextAuth/Auth.jsは直接利用できません。Firebase Auth/Supabase Auth推奨',
   en:'NextAuth/Auth.js is web-only. Flutter needs Firebase Auth/Supabase Auth',
   why_ja:'FlutterはDartで動作し、NextAuth/Auth.jsはNode.js + JavaScriptに完全依存しています。Dartランタイムはnpmパッケージを実行できず、NextAuthのOAuthコールバック処理・セッション管理もFlutterのHTTP環境とは互換性がありません。',
   why_en:'Flutter runs on Dart, while NextAuth/Auth.js fully depends on Node.js and JavaScript. The Dart runtime cannot execute npm packages, and NextAuth\'s OAuth callback handling and session management are incompatible with Flutter\'s HTTP environment.',
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
   why_ja:'静的サイト（GitHub Pages・S3・Firebase Hosting等）はHTMLファイルをCDNから配信するだけで、サーバーサイドのランタイムがありません。',
   why_en:'Static sites (GitHub Pages, S3, Firebase Hosting, etc.) deliver HTML files from a CDN with no server-side runtime. ORM is a tool for executing DB queries on a server — installing it in a static site creates dead code that is never used at build time.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  // ── BE ↔ DB (4 WARN) ──
  {id:'be-db-fb-notfs',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.database&&!inc(a.database,'Firestore'),
   ja:'Firebase利用時はFirestoreが最適です',
   en:'Firestore is the optimal DB for Firebase',
   why_ja:'FirebaseのエコシステムはFirestoreを中心に設計されています。Firebase SDK（`firebase/firestore`）・Cloud Functions・Firebase Auth・Firebase StorageはすべてFirestoreのリアルタイムリスナー・セキュリティルール・オフライン同期と統合されます。',
   why_en:'Firebase\'s ecosystem is designed around Firestore. The Firebase SDK (`firebase/firestore`), Cloud Functions, Firebase Auth, and Firebase Storage all integrate with Firestore\'s realtime listeners, security rules, and offline sync.',
   fix:{f:'database',s:'Firestore'}},
  {id:'be-db-supa-notpg',p:['backend','database'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&a.database&&!inc(a.database,'Supabase')&&!inc(a.database,'PostgreSQL')&&!inc(a.database,'Neon'),
   ja:'Supabase利用時はSupabase (PostgreSQL)が統合されています',
   en:'Supabase integrates best with Supabase (PostgreSQL)',
   why_ja:'SupabaseはPostgreSQLをホスティングするBaaSです。別のDBを選択するとSupabaseの行レベルセキュリティ（RLS）・リアルタイム購読・StorageなどのコアSDKが動作しなくなります。Supabase (PostgreSQL)を選択することで全機能を統合的に利用できます。',
   why_en:'Supabase is a BaaS that hosts PostgreSQL. Selecting a different database disables Supabase core SDK features: row-level security (RLS), real-time subscriptions, and Storage. Selecting Supabase (PostgreSQL) enables the full integrated feature set.',
   chain:[{f:'database',s:'Supabase (PostgreSQL)'},{f:'orm',s:'None / Using BaaS'}]},
  {id:'be-db-static-db',p:['backend','database'],lv:'warn',
   t:a=>isStaticBE(a)&&a.database&&!inc(a.database,'なし')&&a.database!=='None',
   ja:'静的サイトではDBは通常不要です',
   en:'Static sites typically do not need a database',
   why_ja:'静的サイト（HTMLファイル配信のみ）はサーバーサイドDBへのアクセス手段を持ちません。DBを設定しても生成ドキュメントに不整合が生じます。動的データが必要な場合はバックエンドの変更を検討してください。',
   why_en:'A static site (HTML-only delivery) has no server-side access to a database. Setting a database causes inconsistencies in generated docs. If you need dynamic data, consider changing the backend instead.',
   fix:{f:'database',s:'None'}},
  {id:'be-db-py-fs',p:['backend','database'],lv:'warn',
   t:a=>isPyBE(a)&&inc(a.database,'Firestore'),
   ja:'PythonとFirestoreの相性は中程度。PostgreSQLが推奨です',
   en:'Python + Firestore compatibility is moderate. PostgreSQL recommended',
   why_ja:'Googleが提供するFirestore Pythonライブラリ（google-cloud-firestore）は動作しますが、ORMが存在しないため型安全性が低くなります。またFirestoreのJavaScript SDK（リアルタイムリスナー等）はPythonに完全移植されておらず、FastAPI/Djangoのasync処理との統合も複雑です。',
   why_en:'The Google Firestore Python library (google-cloud-firestore) works, but there is no ORM — type safety is low. The JavaScript SDK features (realtime listeners etc.) are not fully ported to Python, and integration with FastAPI/Django async is complex.',
   fix:{f:'database',s:'PostgreSQL'}},
  // ── BE ↔ Deploy (7 WARN) ──
  {id:'be-dep-java-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Java')||inc(a.backend,'Go'))&&inc(a.deploy,'Vercel'),
   ja:'VercelはNode.js/Python前提です。Railway/AWS/Dockerが必要',
   en:'Vercel supports Node.js/Python. Use Railway/AWS/Docker for Java/Go',
   why_ja:'VercelのビルドランタイムはNode.js・Python・Edge（V8）のみをネイティブサポートします。Javaは別途JVMイメージを構築してDockerで動かすか、Railway/AWS ECS/Fly.ioにデプロイする必要があります。',
   why_en:'Vercel\'s build runtimes natively support only Node.js, Python, and Edge (V8). Java requires a separate JVM image via Docker — deploy to Railway/AWS ECS/Fly.io instead. Go can run on Vercel but official support is limited and requires third-party configuration.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-spring-vercel',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'Spring')&&inc(a.deploy,'Vercel'),
   ja:'VercelはJVMをサポートしません。Spring BootにはRailway/AWS/Fly.ioが必要',
   en:'Vercel does not support the JVM. Spring Boot requires Railway/AWS/Fly.io',
   why_ja:'VercelのビルドランタイムはNode.js・Python・Edge（V8）のみをネイティブサポートします。Spring BootはJVM上で動作し、カスタムDockerイメージを使わない限りVercelでは実行できません。',
   why_en:'Vercel\'s build runtimes natively support only Node.js, Python, and Edge (V8). Spring Boot runs on the JVM and cannot execute on Vercel without custom Docker images.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-fb-notfbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Firebase')&&a.deploy&&!inc(a.deploy,'Firebase'),
   ja:'Firebase利用時はFirebase Hostingが最適です',
   en:'Firebase Hosting is optimal when using Firebase backend',
   why_ja:'FirebaseバックエンドにはFirebase HostingがCloud Functions・Firestore・Authenticationと同一GCPプロジェクト内でシームレスに統合されます。他のデプロイ先では追加のCORS設定・認証連携・環境変数管理が必要になります。',
   why_en:'Firebase Hosting integrates seamlessly with Cloud Functions, Firestore, and Authentication within the same GCP project. Other deploy targets require additional CORS configuration, auth integration, and environment variable management.',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  {id:'be-dep-supa-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&inc(a.deploy,'Firebase'),
   ja:'SupabaseにはVercelまたはSupabase Hostingが推奨です',
   en:'Use Vercel or Supabase Hosting with Supabase backend',
   why_ja:'Firebase HostingはFirebase専用サービスでSupabaseとの公式統合がありません。VercelはSupabaseとのネイティブ統合（環境変数自動設定）を提供し、Supabase Hostingはゼロ設定でデプロイできます。',
   why_en:'Firebase Hosting is a Firebase-exclusive service with no official Supabase integration. Vercel provides native Supabase integration (auto environment variable setup), and Supabase Hosting enables zero-config deployment.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'be-dep-nest-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Vercel'),
   ja:'NestJSのサーバーレスデプロイは制限があります。Railwayが推奨',
   en:'NestJS serverless deploys have limitations. Railway recommended',
   why_ja:'NestJSはExpressをラップした「常駐サーバー」前提のフレームワークです。VercelのServerless Functionsはリクエストごとに起動・終了するため、NestJSの依存注入コンテナ初期化に伴うコールドスタート（1-3秒）が毎回発生します。',
   why_en:'NestJS is designed as a persistent server wrapping Express. Vercel Serverless Functions start and stop per request — NestJS\'s DI container initialization causes 1-3 second cold starts every time.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-django-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Django')&&inc(a.deploy,'Vercel'),
   ja:'DjangoのVercelデプロイは制限あり。Railway/Fly.ioが推奨',
   en:'Django on Vercel has limitations. Railway/Fly.io recommended',
   why_ja:'Djangoは管理サイト・セッション・Celeryタスクキューなど「常駐プロセス」前提の機能を多く持ちます。VercelのServerless Functions（最大実行60秒・ファイルシステム書込不可）ではDjango ORMのコネクションプールやキャッシュバックエンドが正常動作しません。',
   why_en:'Django relies heavily on persistent processes — admin site, sessions, Celery task queues. Vercel Serverless Functions (60-second max execution, read-only filesystem) break Django ORM connection pooling and cache backends.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-fastapi-vercel',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'FastAPI')&&inc(a.deploy,'Vercel'),
   ja:'FastAPIのVercelデプロイはコールドスタート遅延と50MBサイズ制限があります。Railway/Fly.ioが推奨',
   en:'FastAPI on Vercel has cold start delays and 50MB size limits. Railway/Fly.io recommended',
   why_ja:'VercelのPython Serverless FunctionsはASGIアダプター（Mangum等）を介してFastAPIを動かせますが、コールドスタート時に`uvicorn`・`starlette`・`pydantic`のロードで1〜3秒の遅延が発生します。',
   why_en:'Vercel Python Serverless Functions can run FastAPI via ASGI adapters (e.g. Mangum), but cold starts load uvicorn, starlette, and pydantic — causing 1–3 second delays. Bundle size limits (50MB on Hobby, 250MB on Pro) can be exceeded with ML libraries.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-heavy-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.deploy,'Netlify')&&(inc(a.backend,'Django')||inc(a.backend,'Spring')||inc(a.backend,'Laravel')),
   ja:'Django/Spring/LaravelのNetlifyデプロイは大幅な制限があります。Railway推奨',
   en:'Django/Spring/Laravel have severe limitations on Netlify. Railway recommended',
   why_ja:'NetlifyのFunctionsはAWS Lambda上で動作し、Python/Java/PHPのランタイムを公式にはサポートしていません。',
   why_en:'Netlify Functions run on AWS Lambda and officially support only Node.js and Go. Deploying Django/Spring/Laravel requires unofficial build plugins or custom container builds, but file system access, persistent processes, and task queues won\'t work.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-fastapi-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'FastAPI')&&inc(a.deploy,'Netlify'),
   ja:'FastAPIのNetlifyデプロイは10秒タイムアウト・コールドスタート・ステートレス制限があります。Railway推奨',
   en:'FastAPI on Netlify has a 10-second timeout, cold starts, and stateless constraints. Railway recommended',
   why_ja:'NetlifyのAWS Lambda互換Python Functionsは最大実行時間が10秒（Background Functionsで15分）に制限されます。FastAPIの`BackgroundTasks`・WebSocket・SSE・非同期バックグラウンド処理が動作しません。',
   why_en:'Netlify AWS Lambda-compatible Python Functions limit execution to 10 seconds (15 minutes for Background Functions). FastAPI\'s BackgroundTasks, WebSockets, SSE, and async background processing will not work.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-nest-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Netlify'),
   ja:'NestJSのNetlifyデプロイは制限があります。Railway推奨',
   en:'NestJS on Netlify has limitations. Railway recommended',
   why_ja:'NetlifyはNode.js Functionsをサポートしますが、NestJSのDIコンテナ初期化・モジュールシステム・ライフサイクルフックはServerless環境との相性が悪く、コールドスタート時間が長くなります。',
   why_en:'Netlify supports Node.js Functions, but NestJS DI container initialization, module system, and lifecycle hooks are poorly suited to serverless — cold starts are long. Persistent features like `@nestjs/websockets`, `@nestjs/schedule`, and Bull queues also won\'t work.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-nest-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.deploy,'Firebase Hosting'),
   ja:'NestJSはFirebase Hosting（静的CDN）では動作しません。Railway/Fly.ioを推奨します',
   en:'NestJS cannot run on Firebase Hosting (static CDN). Use Railway/Fly.io instead',
   why_ja:'Firebase HostingはHTML/CSS/JS等の静的ファイルをCDNから配信するサービスであり、Node.jsランタイムを持ちません。NestJSは常駐HTTPサーバーとして動作するため、コンテナ型ホスティングのRailway/Fly.ioが必要です。',
   why_en:'Firebase Hosting is a static CDN delivering HTML/CSS/JS files — it has no Node.js runtime. NestJS runs as a persistent HTTP server requiring container-based hosting like Railway/Fly.io.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-deno-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Deno')&&inc(a.deploy,'Netlify'),
   ja:'DenoはNetlifyのNode.js Functionsランタイムでは動作しません。Deno Deployを推奨します',
   en:'Deno runtime is not supported on Netlify Functions (Node.js only). Use Deno Deploy instead',
   why_ja:'Netlify Functionsは内部でNode.jsランタイムを使用しており、Denoのネイティブランタイム（独自モジュールシステム・組み込みTypeScriptサポート・Permissionシステム）とは互換性がありません。Deno固有のAPIや`Deno.*`名前空間が使えなくなります。',
   why_en:'Netlify Functions use a Node.js runtime internally and are incompatible with Deno\'s native module system, built-in TypeScript support, and Permission model. Deno-specific APIs and the `Deno.*` namespace become inaccessible.',
   fix:{f:'deploy',s:'Deno Deploy'}},
  // ── FE ↔ Deploy (2 WARN) ──
  {id:'fe-dep-angular-vercel',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Angular')&&inc(a.deploy,'Vercel'),
   ja:'AngularのVercel対応は限定的。Firebase HostingまたはAWSが推奨',
   en:'Angular on Vercel is limited. Use Firebase Hosting or AWS',
   why_ja:'VercelはNext.js/NuxtなどのReactエコシステムに最適化されており、AngularのSSR（Angular Universal）はVercelの設定が複雑になります。',
   why_en:'Vercel is optimized for the React ecosystem (Next.js/Nuxt). Angular SSR (Angular Universal) requires complex Vercel configuration — Angular CLI build output doesn\'t match Vercel\'s framework detection, requiring custom `vercel.json`, and ISR is unavailable.',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  {id:'fe-dep-nuxt-fbh',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Nuxt')&&inc(a.deploy,'Firebase'),
   ja:'Nuxt 3はVercel/Netlifyが最適デプロイ先です',
   en:'Nuxt 3 deploys best on Vercel or Netlify',
   why_ja:'Nuxt 3はVue.jsエコシステム専用のフレームワークで、Firebase HostingはSSR（サーバーサイドレンダリング）のサポートが限定的です。VercelはNuxt公式推奨デプロイ先でNitroサーバー・ISR・Edge Functionsをネイティブサポートします。',
   why_en:'Nuxt 3 is a Vue.js framework with limited SSR support on Firebase Hosting. Vercel is the Nuxt official recommended deployment target with native Nitro server, ISR, and Edge Functions support.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-remix-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Remix')&&inc(a.deploy,'Firebase'),
   ja:'RemixはNode.jsサーバー必須。Firebase HostingはSSRを提供しません',
   en:'Remix requires a Node.js server runtime; Firebase Hosting cannot serve SSR',
   why_ja:'RemixはすべてのページレンダリングをNode.jsサーバー上でサーバーサイドレンダリング（SSR）します。Firebase Hosting は静的CDN（HTML/CSS/JSファイルの配信のみ）で、Node.jsランタイムを持ちません。',
   why_en:'Remix renders all pages via server-side rendering (SSR) on a Node.js server. Firebase Hosting is a static CDN (delivers HTML/CSS/JS only) with no Node.js runtime. Running Remix on Firebase requires a complex setup with Cloud Functions as the server.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-sveltekit-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'SvelteKit')&&inc(a.deploy,'Firebase'),
   ja:'SvelteKit SSRはNode.jsサーバーが必要。Firebase HostingはSSRに対応しません',
   en:'SvelteKit SSR requires a server runtime; Firebase Hosting is a static CDN',
   why_ja:'SvelteKitはSSR・エッジレンダリング・APIルートをサポートするフルスタックフレームワークです。Firebase Hostingは静的ファイルのCDN配信のみをサポートし、Node.jsサーバーランタイムがありません。',
   why_en:'SvelteKit is a full-stack framework supporting SSR, edge rendering, and API routes. Firebase Hosting only delivers static files via CDN with no Node.js runtime.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-nextjs-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Next.js')&&inc(a.deploy,'Firebase Hosting'),
   ja:'Next.js SSR/App RouterはFirebase Hosting（静的CDN）では動作しません。Vercelへの変更を推奨します',
   en:'Next.js SSR/App Router requires a Node.js server; Firebase Hosting is a static CDN',
   why_ja:'Next.js 13+のApp Router（Server Components・Server Actions）とPages RouterのSSRはNode.jsサーバーが常駐している必要があります。Firebase Hostingは静的CDNであり、Node.jsプロセスを実行できません。',
   why_en:'Next.js 13+ App Router (Server Components, Server Actions) and Pages Router SSR require a resident Node.js server. Firebase Hosting is a static CDN that cannot run Node.js processes.',
   fix:{f:'deploy',s:'Vercel'}},
  {id:'fe-astro-firebase',p:['frontend','deploy'],lv:'warn',
   t:a=>inc(a.frontend,'Astro')&&inc(a.deploy,'Firebase Hosting'),
   ja:'Astro SSRモードはサーバーランタイムが必要。Firebase HostingはSSRをサポートしません',
   en:'Astro SSR mode requires a server runtime; Firebase Hosting is a static CDN only',
   why_ja:'AstroはSSRモード（`output: \'server\'`または`\'hybrid\'`）でサーバーサイドレンダリングを行います。Firebase Hostingは静的ファイルのCDN配信のみをサポートし、Node.jsサーバーを実行できません。純粋な静的サイト（`output: \'static\'`）のみFirebase Hostingで動作します。',
   why_en:'Astro in SSR mode (`output: \'server\'` or `\'hybrid\'`) performs server-side rendering like Next.js and SvelteKit. Firebase Hosting only serves static files via CDN and cannot run a Node.js server.',
   fix:{f:'deploy',s:'Vercel'}},
  // ── AI Auto ↔ Skill (3 WARN) ──
  {id:'ai-sk-auto-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>inc(a.ai_auto,'自律')||inc(a.ai_auto,'Autonomous'),
   ja:'フル自律開発には上級スキルが必要です。段階的に進めましょう',
   en:'Full autonomous dev requires advanced skills. Progress gradually',
   why_ja:'自律AIエージェントはコードを読み・判断し・修正を繰り返す「Agentic Loop」を実行します。エラー時にAIが誤った修正を連鎖的に行うと、コードベース全体が壊れる可能性があります。',
   why_en:'Autonomous AI agents run an "Agentic Loop" — reading code, making decisions, and iterating fixes. When AI makes incorrect fixes, errors can cascade and corrupt the entire codebase.',
   cond:a=>a.skill_level==='Beginner'},
  {id:'ai-sk-orch-notpro',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'オーケストレーター')||inc(a.ai_auto,'Orchestrator'))&&a.skill_level!=='Professional',
   ja:'オーケストレーターはCI/CD統合の経験が必要です',
   en:'Orchestrator requires CI/CD integration experience',
   why_ja:'AIオーケストレーター（LangChain/LlamaIndex/Mastra等）はGitHub Actions・テストランナー・クラウドAPIを組み合わせて自律的なパイプラインを構築します。',
   why_en:'AI orchestrators (LangChain/LlamaIndex/Mastra etc.) build autonomous pipelines combining GitHub Actions, test runners, and cloud APIs. When an agent fails, debugging "which step failed and why" requires deep CI/CD and DevOps knowledge.'},
  {id:'ai-sk-multi-beg',p:['ai_auto','skill_level'],lv:'warn',
   t:a=>(inc(a.ai_auto,'マルチ')||inc(a.ai_auto,'Multi'))&&a.skill_level==='Beginner',
   ja:'マルチAgent協調は中級以上の経験が推奨です',
   en:'Multi-Agent coordination recommended for intermediate+',
   why_ja:'マルチAgentシステムでは複数のAIエージェントが並列でコードを変更します。エージェント間のコンテキスト共有・コンフリクト解決・トークン予算管理を適切に設計しないと、互いの変更が競合してコードが壊れます。',
   why_en:'Multi-Agent systems have multiple AI agents modifying code in parallel. Without proper design for context sharing, conflict resolution, and token budget management between agents, their changes will conflict and break code.'},
  // ── BE ↔ Payment (2 WARN) ──
  {id:'be-pay-static-stripe',p:['backend','payment'],lv:'warn',
   t:a=>isStaticBE(a)&&a.payment&&(inc(a.payment,'Stripe')),
   ja:'Stripe webhookにはサーバーが必要。Supabase Edge Functionsで対応可能',
   en:'Stripe webhooks need a server. Supabase Edge Functions can help',
   why_ja:'Stripeは支払完了・失敗・払い戻し等のイベントをWebhook（HTTP POST）で通知します。静的サイトにはPOSTリクエストを受け取るエンドポイントが存在しないため、決済完了の確認・在庫更新・メール送信などを実行できません。',
   why_en:'Stripe sends payment events (completed, failed, refunded) via Webhook (HTTP POST). Static sites have no endpoint to receive POST requests, making it impossible to confirm payment completion, update inventory, or send emails.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'be-pay-saleor-notpy',p:['backend','payment'],lv:'warn',
   t:a=>a.payment&&inc(a.payment,'Saleor')&&!isPyBE(a),
   ja:'SaleorはPython/Django製です。Python系バックエンドが必要',
   en:'Saleor is built with Python/Django. Python backend required',
   why_ja:'SaleorはDjangoで構築されたECプラットフォームで、GraphQL APIはAriadne（Python GraphQLライブラリ）で実装されています。',
   why_en:'Saleor is an EC platform built with Django — its GraphQL API is implemented with Ariadne (Python GraphQL library). Node.js/Go backends can call it via HTTP, but extending Django\'s custom business logic (signals, middleware, custom commands) requires Python.',
   fix:{f:'backend',s:'Python + Django'}},
  {id:'ai-antigravity-windsurf',p:['ai_tools'],lv:'warn',
   t:a=>inc(a.ai_tools,'Antigravity')&&inc(a.ai_tools,'Windsurf'),
   ja:'AntigravityはWindsurf統合版です。どちらか一方で十分です',
   en:'Antigravity integrates Windsurf. One is sufficient',
   why_ja:'AntigravityはWindsurf AIを内蔵したGoogle版IDE拡張です。両方を選択すると設定の重複・ルールファイルの競合・トークン消費の無駄が発生します。どちらか一方を選択してください。',
   why_en:'Antigravity is a Google IDE extension with Windsurf AI built in. Selecting both causes duplicate configurations, rule file conflicts, and wasted token consumption. Choose one or the other.',
   fix:{f:'ai_tools',s:'Google Antigravity'}},
  {id:'ai-openrouter-hub',p:['ai_tools'],lv:'info',
   t:a=>inc(a.ai_tools,'OpenRouter'),
   ja:'OpenRouterはBYOKハブです。Aider/Cline等のAPIバックエンドとして活用できます',
   en:'OpenRouter is a BYOK hub. Use as API backend for Aider/Cline etc.',
   why_ja:'OpenRouterはOpenAI互換APIで複数LLMへのルーティングを提供するBYOK（Bring Your Own Key）ハブです。単体で使うのではなく、Aider・Cline・Cursor等のツールのAPIバックエンドとして活用することで複数モデルを統一インターフェースで利用できます。',
   why_en:'OpenRouter is a BYOK (Bring Your Own Key) hub that provides OpenAI-compatible API routing to multiple LLMs. Use it as the API backend for tools like Aider, Cline, or Cursor rather than standalone, enabling unified access to multiple models through one interface.'},
  // ── ORM ↔ DB (4 WARN/ERROR) ──
  {id:'orm-prisma-mongo',p:['orm','database'],lv:'warn',
   t:a=>inc(a.orm,'Prisma')&&inc(a.database,'MongoDB'),
   ja:'PrismaのMongoDB対応はPreview段階です。本番環境では注意が必要',
   en:'Prisma MongoDB support is in Preview. Use with caution in production',
   why_ja:'orm-levelの`db-mongo-prisma`と異なりこのルールはORMを起点に検出します。PrismaのMongoDBプロバイダーは`prisma migrate`が使えず手動でスキーマを管理する必要があります。',
   why_en:'Unlike the database-level db-mongo-prisma rule, this detects from the ORM side. Prisma\'s MongoDB provider disables `prisma migrate` — schemas must be managed manually.'},
  {id:'orm-mongoose-pg',p:['orm','database'],lv:'warn',
   t:a=>inc(a.orm,'Mongoose')&&!inc(a.database,'Mongo'),
   ja:'MongooseはMongoDBのODMです。PostgreSQL等のRDBには対応していません',
   en:'Mongoose is a MongoDB ODM and cannot connect to PostgreSQL or other SQL databases',
   why_ja:'MongooseはMongoDBのドキュメント構造（コレクション・ドキュメント・$演算子）に特化したObject Document Mapper（ODM）です。PostgreSQL・MySQL・SQLiteへの接続ドライバーを持たず、SQLクエリを生成する機能もありません。',
   why_en:'Mongoose is an Object Document Mapper (ODM) specialized for MongoDB\'s document model (collections, documents, $ operators). It has no drivers for PostgreSQL, MySQL, or SQLite, and cannot generate SQL queries.',
   fix:{f:'orm',s:'Prisma ORM'}},
  {id:'orm-mongoose-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Mongoose')&&inc(a.database,'Firestore'),
   ja:'MongooseはMongoDBのODMです。Firestore非対応',
   en:'Mongoose is a MongoDB ODM and cannot connect to Firestore',
   why_ja:'MongooseはMongoDBのドキュメント構造（コレクション・ドキュメント・$演算子）に特化したObject Document Mapper（ODM）です。FirestoreはGoogleが提供するNoSQLドキュメントDBで、独自のAPI（@google-cloud/firestore SDK）を使用します。',
   why_en:'Mongoose is an Object Document Mapper (ODM) specialized for MongoDB\'s collection/document model. Firestore is Google\'s NoSQL document DB with its own API (@google-cloud/firestore SDK).',
   fix:{f:'database',s:'MongoDB'}},
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
   why_ja:'VercelはデータベースをホスティングしないPaaS（フロント/サーバーレス関数専用）です。セルフホストのPostgreSQLをVercelと組み合わせる場合、接続文字列の環境変数管理・SSL設定・コネクションプーリングをすべて自前で構築する必要があります。',
   why_en:'Vercel is a PaaS for frontend and serverless functions — it does not host databases. Combining self-hosted PostgreSQL with Vercel requires manual management of connection strings, SSL, and connection pooling.',
   fix:{f:'database',s:'Neon (PostgreSQL)'}},
  {id:'dep-db-cf-pg',p:['deploy','database'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'PostgreSQL'),
   ja:'Cloudflare Workers→外部DBはHyperdriveまたはD1への移行を推奨',
   en:'Cloudflare Workers → external DB: use Hyperdrive or consider D1',
   why_ja:'Cloudflare Workers V8ランタイムはTCPソケットAPIを持たないため、従来のPostgresクライアント（pg）が直接DB接続を確立できません。Cloudflareが提供するHyperdriveを使えばWorkers→外部PostgreSQLのコネクションプーリングが可能です。',
   why_en:'The Cloudflare Workers V8 runtime has no TCP socket API, so traditional Postgres clients (pg) cannot establish direct DB connections. Using Cloudflare\'s Hyperdrive enables connection pooling from Workers to external PostgreSQL.'},
  {id:'dep-db-cf-fs',p:['deploy','database'],lv:'warn',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.database,'Firestore'),
   ja:'Cloudflare Workers + Firestoreはレイテンシー高。D1/KV/Durableを推奨',
   en:'Cloudflare + Firestore has high latency. Consider D1/KV/Durable Objects',
   why_ja:'Cloudflare WorkersはグローバルEdgeで実行されますが、Firestoreはリージョン固定（us-central1等）のGCPサービスです。エッジからリージョンへのRTTが50-150ms追加されるため、Edgeの低レイテンシーの利点が消えます。',
   why_en:'Cloudflare Workers run on global Edge, but Firestore is a region-pinned GCP service (e.g., us-central1). The RTT from Edge to region adds 50-150ms, negating the low-latency advantage of Edge.',
   fix:{f:'deploy',s:'Firebase Hosting'}},
  // ── Deploy ↔ Backend (Cloudflare Workers compatibility) (1 ERROR, 1 WARN, 1 INFO) ──
  {id:'be-dep-heavy-cf',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.backend,'Django')||inc(a.backend,'Spring')||inc(a.backend,'Laravel')),
   ja:'Django/Spring/LaravelはCloudflare Workers非対応（V8制限）。Hono/Express推奨',
   en:'Django/Spring/Laravel incompatible with Cloudflare Workers (V8 limits). Use Hono/Express',
   why_ja:'Cloudflare WorkersはV8 JavaScriptエンジン上で動作し、PythonランタイムもJVM（Java）もPHP実行環境も提供しません。Django・Spring・Laravelはそれぞれのランタイムに依存するため、Workersにデプロイ自体が不可能です。JavaScriptベースのHonoまたはExpressを使用してください。',
   why_en:'Cloudflare Workers run on the V8 JavaScript engine — there is no Python runtime for Django, no JVM for Spring, and no PHP for Laravel. These frameworks depend on their respective runtimes and simply cannot be deployed to Workers.',
   fix:{f:'backend',s:'Node.js + Hono'}},
  {id:'be-dep-go-cf',p:['backend','deploy'],lv:'error',
   t:a=>(inc(a.backend,'Go')||inc(a.backend,'Gin'))&&inc(a.deploy,'Cloudflare'),
   ja:'Cloudflare WorkersはV8エンジン専用です。GoバイナリはWorkersで実行できません。Railway/Fly.ioへの変更を推奨します',
   en:'Cloudflare Workers run on V8 only. Go binaries cannot execute there. Use Railway or Fly.io instead',
   why_ja:'Cloudflare WorkersはV8 JavaScriptエンジン上で動作するサーバーレス環境です。GoはネイティブバイナリにコンパイルされるためV8上では実行できません。',
   why_en:'Cloudflare Workers is a serverless environment running on the V8 JavaScript engine. Go compiles to native binaries and cannot execute on V8.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-node-cf',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.backend,'Express')||inc(a.backend,'NestJS'))&&!inc(a.backend,'Hono'),
   ja:'Express/NestJSは一部Node API非対応。Cloudflare Workers最適化にはHono推奨',
   en:'Express/NestJS have Node API limitations on Cloudflare. Hono is optimized for Workers',
   why_ja:'Cloudflare Workersは完全なNode.js互換ではなく、`fs`・`path`・`crypto`（一部）・`net`などのNode API が動作しません。ExressはNode.jsネイティブAPIに依存する部分があり、動作は可能でも非推奨のシムを介します。',
   why_en:'Cloudflare Workers do not fully support Node.js — `fs`, `path`, partial `crypto`, and `net` APIs are unavailable. Express has dependencies on native Node APIs, so it works only via deprecated shims.',
   fix:{f:'backend',s:'Node.js + Hono'}},
  {id:'be-dep-bun-cf',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'Bun')&&inc(a.deploy,'Cloudflare'),
   ja:'BunランタイムはCloudflare Workersではサポートされていません（V8のみ）',
   en:'Bun runtime is not supported on Cloudflare Workers (V8 JavaScript only)',
   why_ja:'Cloudflare WorkersはV8エンジン上で動作するJavaScript/Wasmサンドボックスです。BunはV8ではなくJavaScriptCoreエンジンとRust製の独自I/Oレイヤーを使用しており、Workers環境では実行できません。',
   why_en:'Cloudflare Workers run in a V8-based JavaScript/Wasm sandbox. Bun uses JavaScriptCore (not V8) and a Rust-based I/O layer — it cannot execute in the Workers environment.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-bun-vercel',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'Bun')&&inc(a.deploy,'Vercel'),
   ja:'VercelはBunランタイムをサポートしません（Node.js/Python/Edgeのみ）',
   en:'Vercel does not support the Bun runtime (Node.js/Python/Edge only)',
   why_ja:'VercelのサーバーレスランタイムはNode.js（各LTSバージョン）・Python・Edge（V8）のみを公式サポートしています。',
   why_en:'Vercel\'s serverless runtime officially supports only Node.js (various LTS versions), Python, and Edge (V8).',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-deno-vercel',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'Deno')&&inc(a.deploy,'Vercel'),
   ja:'VercelはDenoランタイムをサポートしません（Node.js/Python/Edgeのみ）。Deno Deployを推奨します',
   en:'Vercel does not support the Deno runtime (Node.js/Python/Edge only). Use Deno Deploy instead',
   why_ja:'VercelのサーバーレスランタイムはNode.js・Python・Edge（V8）のみを公式サポートします。',
   why_en:'Vercel\'s serverless runtime officially supports only Node.js, Python, and Edge (V8). Deno uses V8 but has its own permission model, built-in TypeScript, and standard library — a standalone runtime that Vercel\'s build infrastructure does not support.',
   fix:{f:'deploy',s:'Deno Deploy'}},
  {id:'be-dep-bun-netlify',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'Bun')&&inc(a.deploy,'Netlify'),
   ja:'NetlifyはBunランタイムをサポートしません（Node.js/Goのみ）。RailwayでBunを動かしてください',
   en:'Netlify does not support the Bun runtime (Node.js/Go only). Use Railway to run Bun instead',
   why_ja:'NetlifyのFunctionsはAWS Lambda互換でNode.jsとGoを公式サポートします。BunはJavaScriptCoreエンジンとRust製I/Oレイヤーを持つ独立ランタイムであり、Netlifyのビルドインフラはnpmパッケージとしてのbunをサポートしておらず、Bun固有のAPI（Bun.serve・Bun.file等）はNetlify環境で動作しません。RailwayはBunのDockerコンテナを直接実行でき最も簡単な移行先です。',
   why_en:'Netlify Functions are AWS Lambda-compatible, officially supporting Node.js and Go.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-hono-cf',p:['backend','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&inc(a.backend,'Hono'),
   ja:'✨ Hono + Cloudflare Workersは最適な組み合わせです（超高速Edge実行）',
   en:'✨ Hono + Cloudflare Workers is optimal (ultra-fast edge execution)',
   why_ja:'HonoはCloudflare Workers向けに設計された超軽量Webフレームワークです。Workers ランタイム上でネイティブ動作し、コールドスタートがほぼゼロ・全世界200+エッジロケーションで実行されます。',
   why_en:'Hono is an ultra-lightweight web framework designed natively for Cloudflare Workers. It runs natively on the Workers runtime with near-zero cold start and executes across 200+ global edge locations.'},
  {id:'db-prisma-cf-workers',p:['orm','deploy'],lv:'warn',
   t:a=>inc(a.orm,'Prisma')&&inc(a.deploy,'Cloudflare'),
   ja:'PrismaはCloudflare Workers非対応（Node.js専用コード生成）。Drizzle/Kyselyを推奨',
   en:'Prisma generates Node.js-specific code incompatible with Cloudflare Workers. Use Drizzle or Kysely',
   why_ja:'Prisma Clientは生成時にNode.jsのfs・path・child_processモジュールに依存したコードを出力します。Cloudflare WorkersのV8サンドボックスはこれらのNode.js APIを提供しないため、Prismaのクエリエンジン（.soバイナリ）をロードできず実行時エラーになります。',
   why_en:'Prisma Client generates code that depends on Node.js modules (fs, path, child_process) at build time. Cloudflare Workers\' V8 sandbox does not provide these Node.js APIs, so Prisma\'s query engine (.so binary) cannot be loaded, causing runtime errors.',
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
   why_ja:'金融（取引・口座情報）・医療（PHI・カルテ）・法務（機密文書）のドメインでは、未認証アクセスは法規制違反（FISC・HIPAA・弁護士法等）となるリスクがあります。ユーザーID確認なしには監査ログ・アクセス制御・データ保護が成立しません。',
   why_en:'In fintech (transactions, accounts), health (PHI, records), and legal (confidential documents) domains, unauthenticated access risks regulatory violations (PCI-DSS, HIPAA, bar regulations).',
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
   why_ja:'ECプロジェクトで決済を未設定のままにすると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdにPCI-DSS要件・決済フロー・返金処理が含まれません。',
   why_en:'Leaving payment unset in an EC project means generated docs (docs/13_payment.md, docs/45_compliance_matrix.md) will lack PCI-DSS requirements, payment flows, and refund handling.'},
  {id:'dom-saas-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
    if(!a.purpose||!a.payment)return false;
    const dom=detectDomain(a.purpose);
    const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
    return dom==='saas'&&!hasPay;
   },
   ja:'SaaSドメインで決済未選択です。収益モデルの根幹であるStripe等の決済方式を選択してください',
   en:'SaaS domain without payment. Stripe or another payment method is core to SaaS revenue — please select one',
   why_ja:'SaaSの収益モデルはサブスクリプション課金が基本です。決済を未設定のままにすると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdにサブスク管理・プラン切替・解約フロー・インボイス発行が含まれません。',
   why_en:'SaaS revenue is built on subscription billing. Leaving payment unset means generated docs lack subscription management, plan switching, cancellation flows, and invoice generation.'},
  // ── Domain ↔ Backend/Infra (4 WARN) ──
  {id:'dom-health-firebase',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='health'&&inc(a.backend,'Firebase');
   },
   ja:'医療ドメインでFirebaseを使用しています。FirebaseのデフォルトではHIPAAのBAA（業務提携契約）が自動適用されません。Supabase（PostgreSQL+RLS）またはカスタムバックエンドを推奨します',
   en:'Healthcare domain using Firebase. Firebase does not automatically provide a HIPAA Business Associate Agreement (BAA). Consider Supabase (PostgreSQL + RLS) or a custom HIPAA-compliant backend',
   why_ja:'HIPAA準拠には「ビジネスアソシエイト契約（BAA）」が必要ですが、FirebaseのBAAはGoogle Cloud Blazeプランで明示的に申請が必要で、Realtime Databaseは適用対象外の場合があります。',
   why_en:'HIPAA compliance requires a Business Associate Agreement (BAA). Firebase\'s BAA requires explicit activation on the Google Cloud Blaze plan, and Realtime Database may not qualify.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-government-firebase',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='government'&&inc(a.backend,'Firebase');
   },
   ja:'行政ドメインでFirebaseを使用しています。政府クラウド（ISMAP認定）・個人情報保護法への準拠にはAWS GovCloud/Azure Government等の認証済みクラウドが必要です',
   en:'Government domain using Firebase. Government cloud compliance (ISMAP, FedRAMP) requires certified cloud infrastructure such as AWS GovCloud or Azure Government',
   why_ja:'行政システムは住民の個人情報（マイナンバー・住所・医療情報等）を扱うため、ISMAP（情報システムセキュリティ管理・評価制度）認定クラウドの利用が政府調達基準で求められます。',
   why_en:'Government systems handling citizen personal data (national ID, address, medical records) require ISMAP-certified cloud in Japan, or FedRAMP-authorized in the US, per government procurement standards.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-iot-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='iot'&&isStaticBE(a);
   },
   ja:'IoTドメインで静的バックエンドが選択されています。センサーデータ収集・デバイス制御にはリアルタイム対応のバックエンドが必要です。Firebase Realtime DB/Supabaseを推奨します',
   en:'IoT domain with a static backend selected. Sensor data ingestion and device management require a real-time backend. Firebase Realtime DB or Supabase recommended',
   why_ja:'IoTシステムでは、センサーデバイスが常時データを送信し、バックエンドはMQTT/WebSocket/REST APIでデータを受信・処理・蓄積する必要があります。静的サイトにはサーバーサイドの処理が存在せず、デバイスからのデータを受け取る手段がありません。',
   why_en:'IoT systems require sensors constantly transmitting data, with the backend receiving, processing, and storing it via MQTT/WebSocket/REST API. Static sites have no server-side processing and cannot receive device data.',
   fix:{f:'backend',s:'Firebase'}},
  {id:'dom-community-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const noAuth=inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return dom==='community'&&noAuth;
   },
   ja:'コミュニティドメインで認証が未設定です。コミュニティプラットフォームではユーザーID・投稿所有者・モデレーション機能のために認証が必須です',
   en:'Community domain without authentication. Community platforms require user identity for post ownership, social features, and content moderation',
   why_ja:'コミュニティプラットフォームの基本機能（投稿・フォロー・いいね・通報・モデレーション）は全てユーザーIDに依存します。認証なしでは投稿の帰属が不明確になり、スパム・荒らし対策も不可能です。',
   why_en:'Core community features (posting, following, likes, reporting, moderation) all depend on user identity. Without authentication, post ownership is unknown and spam/troll prevention is impossible.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'dom-fintech-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail)/i.test(a.data_entities||'');
     return dom==='fintech'&&!hasAudit;
   },
   ja:'フィンテックドメインですが、data_entitiesに監査ログエンティティ（AuditLog/TransactionLog）が見当たりません。金融規制（PCI-DSS/FISC/SOX）では取引操作の完全な監査証跡が必須です',
   en:'Fintech domain without an audit log entity (AuditLog/TransactionLog). Financial regulations (PCI-DSS/SOX/FISC) require complete immutable audit trails for all financial operations',
   why_ja:'PCI-DSS Requirement 10では、カード会員データ環境の全アクセスログを最低12ヶ月保持することが義務付けられています。AuditLogエンティティは誰がいつ何をしたかを記録し、不正検知・コンプライアンス証明・インシデント調査を可能にします。',
   why_en:'PCI-DSS Requirement 10 mandates retaining full access logs for cardholder data environments for at least 12 months. An AuditLog entity records who did what when, enabling fraud detection, compliance proof, and incident investigation.'},
  // ── Domain ↔ Payment/Realtime (4 WARN) ──
  {id:'dom-booking-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='booking'&&!hasPay;
   },
   ja:'予約ドメインで決済が未設定です。無断キャンセル防止のためデポジット・事前決済（Stripe等）の導入を推奨します',
   en:'Booking domain without payment. Add deposit/prepayment (Stripe etc.) to prevent no-shows and secure reservations',
   why_ja:'予約システムで決済がないと、ユーザーは無制限に予約を作成・放棄できます。飲食店や宿泊施設では無断キャンセルが深刻な損失になります。',
   why_en:'Without payment in a booking system, users can create and abandon unlimited reservations. No-shows are a serious revenue loss for restaurants and hotels.',
   fix:{f:'payment',s:'Stripe決済'}},
  {id:'dom-marketplace-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='marketplace'&&!hasPay;
   },
   ja:'マーケットプレイスドメインで決済が未設定です。出品者への送金・手数料徴収にはStripe Connect等のプラットフォーム決済が必須です',
   en:'Marketplace domain without payment. Platform payments with seller payouts (Stripe Connect) are essential for marketplace transactions',
   why_ja:'マーケットプレイスは買い手→プラットフォーム（手数料控除）→出品者という資金フローが核心です。通常のStripe決済では売り手への送金（Payout）機能がありません。',
   why_en:'The marketplace core is a funds flow: buyer → platform (minus commission) → seller. Standard Stripe payments lack seller payout functionality.',
   fix:{f:'payment',s:'Stripe決済 (Connect)'}},
  {id:'dom-collab-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='collab'&&isStaticBE(a);
   },
   ja:'コラボレーションドメインで静的バックエンドが選択されています。共同編集・リアルタイム同期にはサーバーサイドが必要です。Supabase Realtime/Firebase/Convexを推奨します',
   en:'Collaboration domain with a static backend. Real-time sync and co-editing require a server-side backend. Supabase Realtime, Firebase, or Convex recommended',
   why_ja:'共同編集ツール（Google Docsスタイル）は複数ユーザーの変更をリアルタイムで全員に配信するサーバーが必須です。静的サイトにはWebSocket/SSEサーバーが存在せず、ブラウザ間の変更を仲介できません。',
   why_en:'Collaborative editing tools (Google Docs style) require a server to broadcast changes between multiple users in real time. Static sites have no WebSocket/SSE server to mediate browser-to-browser updates.',
   fix:{f:'backend',s:'Supabase'}},
  {id:'dom-gamify-static',p:['purpose','backend'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     return dom==='gamify'&&isStaticBE(a);
   },
   ja:'ゲーミフィケーションドメインで静的バックエンドが選択されています。リーダーボード・ポイント管理・バッジ付与にはサーバーサイドが必要です。Firebase/Supabaseを推奨します',
   en:'Gamification domain with a static backend. Leaderboards, point tracking, and badge assignment require server-side persistence. Firebase or Supabase recommended',
   why_ja:'ゲーミフィケーションの核心機能（ポイント付与・ランキング集計・バッジ解除・チャレンジ管理）は全て永続的なデータストアが必要です。静的サイトはローカルストレージのみで、マルチユーザー競争・不正防止・リーダーボードを実現できません。',
   why_en:'Core gamification features (point awarding, ranking aggregation, badge unlocking, challenge management) all require persistent data storage. Static sites are limited to localStorage — they cannot support multi-user competition, cheat prevention, or leaderboards.',
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
   why_ja:'イベント管理システムの収益化はチケット販売・参加費徴収が中心です。決済なしでは、参加者管理・キャンセル払い戻し・早期割引・定員管理のドキュメントが生成されません。',
   why_en:'Event management system revenue comes primarily from ticket sales and registration fees. Without payment, docs for attendee management, cancellation refunds, early-bird discounts, and capacity management are not generated.',
   fix:{f:'payment',s:'Stripe決済'}},
  {id:'dom-creator-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='creator'&&!hasPay;
   },
   ja:'クリエイタードメインで決済が未設定です。コンテンツ販売・投げ銭・サブスク収益化のためStripe Connect等のプラットフォーム決済を推奨します',
   en:'Creator domain without payment. Stripe Connect or similar platform payments are essential for content sales, tips, and subscription monetization',
   why_ja:'クリエイタープラットフォームの核心はクリエイターへの収益分配です。単純なStripe決済ではプラットフォーム手数料控除・複数クリエイターへの送金が困難です。',
   why_en:'The core of a creator platform is revenue distribution to creators. Standard Stripe payments make it difficult to deduct platform fees and send money to multiple creators.',
   fix:{f:'payment',s:'Stripe決済 (Connect)'}},
  {id:'dom-travel-nopay',p:['purpose','payment'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='travel'&&!hasPay;
   },
   ja:'旅行・観光ドメインで決済が未設定です。宿泊・ツアー予約の事前決済（Stripe等）の統合を推奨します',
   en:'Travel/tourism domain without payment. Add prepayment (Stripe etc.) for accommodation and tour bookings to prevent no-shows',
   why_ja:'旅行プラットフォームでは宿泊・ツアー・交通の予約において事前決済が必要です。決済なしでは無断キャンセル・ノーショーが発生し収益が失われます。',
   why_en:'Travel platforms require prepayment for accommodation, tour, and transport bookings. Without payment, no-shows and last-minute cancellations result in revenue loss.',
   fix:{f:'payment',s:'Stripe決済'}},
  {id:'dom-realestate-nopay',p:['purpose','payment'],lv:'info',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasPay=a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none';
     return dom==='realestate'&&!hasPay;
   },
   ja:'不動産ドメインで決済が未設定です。仲介手数料・保証金の収受にStripe等の決済統合を検討してください',
   en:'Real estate domain without payment. Consider adding Stripe for brokerage fees, deposits, or rental payments',
   why_ja:'不動産プラットフォームでは仲介手数料・敷金礼金・月次賃料の収受が中核機能です。決済なしではプラットフォームの収益化が困難になります。Stripeの`Payment Links`で手数料収受、`Subscription`で月次賃料管理、`Connect`で物件オーナーへの送金が実現できます。',
   why_en:'Real estate platforms need to collect brokerage fees, security deposits, and monthly rent as core features. Without payment, platform monetization is difficult.'},
  {id:'dom-newsletter-noemail',p:['purpose','mvp_features'],lv:'info',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasEmail=/(Resend|SendGrid|MailerSend|Postmark|SES|SMTP|nodemailer|メール配信|email.?service|mail.?service)/i.test(a.mvp_features||'');
     return dom==='newsletter'&&!hasEmail;
   },
   ja:'ニュースレタードメインですが、mvp_featuresにメール配信サービス（Resend/SendGrid/MailerSend）の記述がありません',
   en:'Newsletter domain without an email delivery service in mvp_features. Add Resend, SendGrid, or MailerSend for reliable bulk email delivery',
   why_ja:'自前SMTPでのメール大量配信はIPレピュテーション問題・スパムフォルダへの振り分け・バウンス管理が複雑です。Resend（React Email連携・開発者向け）、SendGrid（無料枠100通/日・大量配信実績）、MailerSend（直感的なAPI・コスト安）が主要選択肢です。',
   why_en:'Bulk email via self-hosted SMTP struggles with IP reputation, spam folder placement, and complex bounce management.'},
  {id:'dom-government-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const noAuth=inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return dom==='government'&&noAuth;
   },
   ja:'行政・政府ドメインで認証が未設定です。住民個人情報を扱う行政システムは認証必須です。Supabase Auth/Keycloakを推奨します',
   en:'Government domain without authentication. Government systems handling citizen data require authentication. Supabase Auth or Keycloak recommended',
   why_ja:'行政システムは住民の個人情報（氏名・住所・マイナンバー等）を扱います。認証なしでは誰でもデータにアクセスでき、個人情報保護法・マイナンバー法・各地方条例違反になります。Supabase AuthはRLSと組み合わせて役職ベースのアクセス制御が可能です。',
   why_en:'Government systems handle citizen personal data (name, address, national ID, etc.). Without authentication, anyone can access data — violating privacy law, data protection regulations, and government security standards.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'dom-insurance-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail|ClaimLog)/i.test(a.data_entities||'');
     return dom==='insurance'&&!hasAudit;
   },
   ja:'保険ドメインですが、AuditLog/ClaimLog等の監査エンティティが見当たりません。保険規制（IAIS基準・各国監督当局）は操作ログの保存を要求します',
   en:'Insurance domain without AuditLog/ClaimLog entity. Insurance regulations (IAIS standards, national supervisory authorities) require operation log retention',
   why_ja:'保険業界は金融庁・IAISのガイドラインにより、全ての保険証券変更・クレーム処理・保険料計算の操作ログを義務付けています。AuditLogがないと、クレーム不正・証券改ざんの追跡が不可能になります。',
   why_en:'The insurance industry is required by financial regulators and IAIS guidelines to maintain operation logs for all policy changes, claims processing, and premium calculations. Without AuditLog, detecting claim fraud or policy tampering becomes impossible.'},
  {id:'dom-hr-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail|ActivityLog)/i.test(a.data_entities||'');
     return dom==='hr'&&!hasAudit;
   },
   ja:'HRドメインですが、AuditLog等の監査エンティティが見当たりません。労働法・個人情報保護法は人事操作ログの保持を要求します',
   en:'HR domain without AuditLog entity. Labor law and privacy regulations require operation logs for personnel changes',
   why_ja:'HR（人事）システムは給与・採用・評価・解雇など機微な人事データを扱います。労働基準法・個人情報保護法では、給与計算変更・評価スコア修正・アクセス権変更等のすべての操作ログをイミュータブルに記録する義務があります。',
   why_en:'HR systems handle sensitive personnel data — salaries, hiring, performance reviews, terminations. Labor law and privacy regulations require immutable logs of all HR operations: payroll changes, performance score edits, access right modifications.'},
  {id:'dom-legal-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasAudit=/(AuditLog|TransactionLog|EventLog|AuditTrail|AccessLog)/i.test(a.data_entities||'');
     return dom==='legal'&&!hasAudit;
   },
   ja:'法務ドメインですが、AuditLog/AccessLog等の監査エンティティが見当たりません。弁護士法・個人情報保護法は機密文書へのアクセスログ保持を要求します',
   en:'Legal domain without AuditLog/AccessLog entity. Attorney regulations and privacy law require access logs for confidential documents',
   why_ja:'法務システムは機密性の高い契約書・訴訟資料・法的意見書を扱います。弁護士法の守秘義務・個人情報保護法・eDiscovery要件により、誰がいつどの文書にアクセスしたかをイミュータブルに記録する監査証跡が必要です。',
   why_en:'Legal systems handle highly confidential contracts, litigation materials, and legal opinions. Attorney confidentiality obligations, privacy law, and eDiscovery requirements mandate immutable audit trails of who accessed which document and when.'},
  {id:'dom-education-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const noAuth=!a.auth||inc(a.auth,'なし')||inc(a.auth,'None')||a.auth==='none';
     return dom==='education'&&noAuth;
   },
   ja:'教育・LMSドメインで認証が未設定です。学習者データ（FERPA/COPPA対応）および未成年者保護のために認証が必要です',
   en:'Education/LMS domain without authentication. Authentication is required for student data protection (FERPA/COPPA compliance and minor protection)',
   why_ja:'教育系プラットフォームは学習者の個人情報（成績・出席・行動ログ）を扱います。FERPAは米国で学生教育記録の保護を義務付け、COPPAは13歳未満の子どもの個人情報収集を規制します。',
   why_en:'Education platforms handle learner personal data (grades, attendance, activity logs). FERPA mandates protection of student education records in the US; COPPA regulates collection of personal information from children under 13.',
   fix:{f:'auth',s:'Firebase Auth'}},
  {id:'dom-media-nocdn',p:['purpose','mvp_features'],lv:'info',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     const hasCDN=/(CDN|CloudFront|Cloudflare|Fastly|Akamai|R2|S3|bunny|配信最適化|ストリーミング最適化)/i.test(a.mvp_features||'');
     return dom==='media'&&!hasCDN;
   },
   ja:'メディア・ストリーミングドメインですが、mvp_featuresにCDN/配信最適化の記述がありません。大容量コンテンツ配信にはCDN必須です',
   en:'Media/streaming domain without CDN in mvp_features. CDN is essential for large-scale content delivery',
   why_ja:'動画・音声・画像の大容量コンテンツをオリジンサーバーから直接配信すると、サーバー費用が膨大になりレイテンシも悪化します。Cloudflare R2（egress無料）+ Cloudflare CDN、AWS S3 + CloudFront（99.9% SLA）、Bunny.net（コスト最安）が主要選択肢です。',
   why_en:'Serving large video/audio/image content directly from the origin server results in massive bandwidth costs and poor latency. Main options: Cloudflare R2 (free egress) + Cloudflare CDN, AWS S3 + CloudFront (99.9% SLA), Bunny.net (lowest cost).'},
  // ── AI Auto ↔ Tools (1 WARN) ──
  {id:'ai-auto-notools',p:['ai_auto','ai_tools'],lv:'warn',
   t:a=>{
    if(!a.ai_auto||!a.ai_tools)return false;
    const hasAuto=a.ai_auto&&!inc(a.ai_auto,'なし')&&!inc(a.ai_auto,'None')&&a.ai_auto!=='none';
    const hasTools=a.ai_tools&&!inc(a.ai_tools,'なし')&&!inc(a.ai_tools,'None')&&a.ai_tools!=='none';
    return hasAuto&&!hasTools;
   },
   ja:'AI自律レベル設定済みですが、AIツール未選択です。Cursor/Claude Code等を選択してください',
   en:'AI autonomous level set but no AI tools selected. Choose Cursor/Claude Code etc.',
   why_ja:'AI自律レベル（Vibe Coding・マルチAgent等）を設定すると、対応するAIツール向けのルールファイル（.cursorrules・CLAUDE.md等）が生成されます。AIツールを未選択のままにすると、これらのルールファイルが生成されず、AI自律開発の設定が無効になります。',
   why_en:'Setting an AI autonomy level (Vibe Coding, Multi-Agent, etc.) triggers generation of tool-specific rule files (.cursorrules, CLAUDE.md, etc.). Leaving AI tools unselected means these rule files are not generated and the AI autonomy configuration has no effect.'},
  // ── Convex ↔ FE/ORM (2 WARN/INFO) ──
  {id:'be-convex-noreact',p:['backend','frontend'],lv:'warn',
   t:a=>inc(a.backend,'Convex')&&!inc(a.frontend,'React')&&!inc(a.frontend,'Next'),
   ja:'ConvexはReact最適化されています。React/Next.js推奨',
   en:'Convex is optimized for React. React/Next.js recommended',
   why_ja:'Convexの公式クライアントライブラリはReact Hooksを中心に設計されており、`useQuery`・`useMutation`・`useAction`などのHookがリアルタイム同期を実現します。Vue/Svelte/Angularには公式SDKが存在せず、コミュニティ製の非公式アダプターに頼ることになります。',
   why_en:'Convex\'s official client library is designed around React Hooks — `useQuery`, `useMutation`, and `useAction` drive realtime sync. There are no official SDKs for Vue/Svelte/Angular — only unofficial community adapters.'},
  {id:'be-convex-orm',p:['backend','orm'],lv:'info',
   t:a=>inc(a.backend,'Convex')&&a.orm&&!inc(a.orm,'なし')&&!inc(a.orm,'None')&&a.orm!=='none',
   ja:'ConvexはTypeScript定義で完結します。ORMは通常不要',
   en:'Convex uses TypeScript definitions. ORM typically not needed',
   why_ja:'ConvexはORMそのものです。`defineTable()`でスキーマを定義し、`ctx.db.query()`・`ctx.db.insert()`・`ctx.db.patch()`でデータ操作を行います。PrismaやDrizzleをConvexと組み合わせても、ConvexのDBには接続できず、むしろ別DBへの接続が必要になり二重管理になります。',
   why_en:'Convex IS the ORM. You define schemas with `defineTable()` and manipulate data with `ctx.db.query()`, `ctx.db.insert()`, and `ctx.db.patch()`.',
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
   why_ja:'Cursor・Windsurf・Clineなど複数のAIコーディングツールを同時使用する場合、各ツールが異なるルールを読み込むと一貫性のないコードが生成されます。',
   why_en:'Using multiple AI coding tools simultaneously (Cursor, Windsurf, Cline, etc.) can produce inconsistent code if each tool reads different rules.'},
  {id:'mobile-expo-rn',p:['mobile'],lv:'info',
   t:a=>inc(a.mobile,'bare')||inc(a.mobile,'Bare'),
   ja:'React Native bareは柔軟性が高いですが、Expoの方が開発速度が速いです',
   en:'React Native bare offers flexibility, but Expo is faster for development',
   why_ja:'React Native bare workflowはExpoのマネージドレイヤーを除いた純粋なReact Nativeです。カスタムネイティブモジュール（BLE・ARKit等）を使いたい場合や、Expoのバージョン制約に縛られたくない場合に選びます。',
   why_en:'React Native bare workflow is pure React Native without Expo\'s managed layer. Choose it when you need custom native modules (BLE, ARKit, etc.) or cannot accept Expo\'s version constraints.',
   fix:{f:'mobile',s:'Expo (Managed)'}},
  {id:'mob-flutter-firebase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Firebase'),
   ja:'✨ Flutter + Firebaseは最適な組み合わせです（FlutterFire統合）',
   en:'✨ Flutter + Firebase is an excellent combination (FlutterFire integration)',
   why_ja:'FlutterFireはFlutter向けの公式Firebaseプラグイン群で、Authentication・Firestore・Cloud Messaging・Crashlyticsが専用ウィジェット・Stream APIと統合されています。モバイル・Web・デスクトップを単一コードベースでFirebaseと接続できる最もサポートが厚いスタックです。',
   why_en:'FlutterFire is the official Firebase plugin suite for Flutter, integrating Authentication, Firestore, Cloud Messaging, and Crashlytics with dedicated widgets and Stream APIs.'},
  {id:'mob-flutter-supabase',p:['mobile','backend'],lv:'info',
   t:a=>inc(a.mobile,'Flutter')&&inc(a.backend,'Supabase'),
   ja:'✨ Flutter + Supabaseは良い組み合わせです（supabase_flutter パッケージを使用）',
   en:'✨ Flutter + Supabase works well — use the supabase_flutter package for native SDK access',
   why_ja:'supabase_flutterはFlutter向け公式Supabaseクライアントで、Authentication・Realtime・Storage・Edge FunctionsをFlutter StreamとStatefulWidgetで扱えます。PostgreSQL RLSとの組み合わせで型安全なマルチテナントデータアクセスが実現できます。',
   why_en:'supabase_flutter is the official Supabase client for Flutter, exposing Authentication, Realtime, Storage, and Edge Functions as Flutter Streams and StatefulWidgets. Combined with PostgreSQL RLS, it enables type-safe multi-tenant data access.'},
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
   why_ja:'KyselyはNode.js固有のDBドライバーAPIに依存したSQLクエリビルダーです。FlutterのDartランタイムはNode.jsモジュールを実行できず、Kyselyをインポートしてもビルド時エラーになります。',
   why_en:'Kysely is a SQL query builder that depends on Node.js-specific DB driver APIs. Flutter\'s Dart runtime cannot execute Node.js modules — importing Kysely will cause a build-time error.',
   fix:{f:'orm',s:'None / Using BaaS'}},
  {id:'mob-expo-drizzle',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Drizzle'),
   ja:'DrizzleはサーバーサイドORMです。Expo(React Native)では動作しません。モバイルにはRNSQLiteまたはBaaSを使用してください',
   en:'Drizzle is a server-side ORM and will not work in Expo (React Native). Use RN SQLite or a BaaS backend instead',
   why_ja:'DrizzleはNode.jsのネイティブモジュール（pg・mysql2・better-sqlite3）と連携して動作します。React NativeのJavaScriptエンジン（Hermes/JSC）はNode.jsではないため、これらのネイティブドライバーをバンドルできません。',
   why_en:'Drizzle works with Node.js native modules (pg, mysql2, better-sqlite3). React Native\'s JavaScript engine (Hermes/JSC) is not Node.js — these native drivers cannot be bundled. For database access in Expo, use expo-sqlite (local) or Supabase/Firebase (cloud).',
   fix:{f:'orm',s:'Prisma'}},
  {id:'mob-expo-kysely',p:['mobile','orm'],lv:'warn',
   t:a=>inc(a.mobile,'Expo')&&inc(a.orm,'Kysely'),
   ja:'KyselyはサーバーサイドSQLビルダーです。Expo(React Native)では動作しません。BaaSバックエンドを使用してください',
   en:'Kysely is a server-side SQL builder and will not work in Expo. Use a BaaS backend instead',
   why_ja:'KyselyはSQL接続にNode.js固有のAPIを使用します（pg・mysql2ドライバー）。Expo/React Nativeの実行環境はNode.jsを含まず、これらのネイティブモジュールをバンドルできません。',
   why_en:'Kysely uses Node.js-specific APIs for SQL connections (pg, mysql2 drivers). The Expo/React Native runtime does not include Node.js and cannot bundle these native modules.',
   fix:{f:'orm',s:'Prisma'}},
  // ── Semantic Consistency Rules (Phase A) ── 8 rules ──
  // A1: scope_out「ネイティブ」 vs mobile有効
  {id:'sem-scope-mobile',p:['scope_out','mobile'],lv:'error',
   t:a=>(inc(a.scope_out,'ネイティブ')||inc(a.scope_out,'native')||inc(a.scope_out,'Native'))&&a.mobile&&a.mobile!=='none'&&!inc(a.mobile,'PWA'),
   ja:'スコープ外に「ネイティブアプリ」がありますが、モバイル対応が有効です。生成文書が矛盾します — どちらかを修正してください',
   en:'Scope excludes "native apps" but mobile support is enabled. Generated docs will conflict — fix one or the other',
   why_ja:'「スコープ外」に記述した機能は、仕様書・タスクリスト・テスト計画のすべてで「実装しない」として扱われます。一方でモバイル対応を有効にすると、React Native/ExpoのセットアップやAppStoreデプロイ手順が生成されます。',
   why_en:'Features listed in "scope out" are treated as "will not implement" across the spec, task list, and test plan. Enabling mobile support simultaneously generates React Native/Expo setup and App Store deployment steps.'},
  // A2: scope_out「決済/EC」 vs payment有効
  {id:'sem-scope-payment',p:['scope_out','payment'],lv:'warn',
   t:a=>(inc(a.scope_out,'決済')||inc(a.scope_out,'EC')||inc(a.scope_out,'payment')||inc(a.scope_out,'Payment'))&&a.payment&&!inc(a.payment,'なし')&&!inc(a.payment,'None')&&a.payment!=='none',
   ja:'スコープ外に「決済/EC」がありますが、決済方式が選択されています。仕様書のスコープ定義に矛盾が生じます',
   en:'Scope excludes "payment/EC" but a payment method is selected. Spec scope definition will conflict',
   why_ja:'スコープ外（scope_out）に「決済」と記載すると、生成されるdocs/13_payment.md・docs/45_compliance_matrix.mdに「このフェーズでは決済を実装しない」と明記されます。',
   why_en:'Setting "payment" in scope_out causes generated docs (docs/13_payment.md, docs/45_compliance_matrix.md) to state "payment will not be implemented this phase." Simultaneously selecting a payment method (Stripe, etc.'},
  // A3: scope_out「EC」 vs entities に Product/Order
  {id:'sem-scope-entities',p:['scope_out','data_entities'],lv:'warn',
   t:a=>(inc(a.scope_out,'EC')||inc(a.scope_out,'commerce')||inc(a.scope_out,'Commerce'))&&(inc(a.data_entities,'Product')||inc(a.data_entities,'Order')||inc(a.data_entities,'Cart')),
   ja:'スコープ外に「EC」がありますが、エンティティにProduct/Orderが含まれています。ERとスコープが矛盾します',
   en:'Scope excludes "EC" but entities include Product/Order. ER and scope will conflict',
   why_ja:'スコープ外設定は生成ドキュメントに「EC機能は今フェーズで実装しない」と明記されます。同時にエンティティにProduct/Orderが含まれると、ERダイアグラムにEC関連テーブルが描かれ矛盾が生じます。',
   why_en:'The scope_out setting writes "EC features will not be implemented this phase" into generated docs. If Product/Order entities are simultaneously present in the ER diagram, the AI receives contradictory specs and cannot determine which instruction to implement.'},
  // A4: deploy=Vercel && backend=Express/Fastify（常駐サーバー型）
  {id:'sem-deploy-express',p:['deploy','backend'],lv:'warn',
   t:a=>inc(a.deploy,'Vercel')&&(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&!inc(a.frontend,'Next.js'),
   ja:'VercelでExpress/Fastifyを動かすにはServerless Functionsに変換が必要です。Next.js API RoutesまたはRailway/Renderへの分離を検討してください',
   en:'Running Express/Fastify on Vercel requires Serverless Functions. Consider Next.js API Routes or split to Railway/Render',
   why_ja:'Express/FastifyはHTTPサーバーを起動し続ける「常駐プロセス」モデルです。Vercelでは1リクエストごとに関数が起動・終了するServerless Functionsとして動作させる必要があり、`express`を`vercel`ランタイムでラップするか全ルートをAPI Routes化する必要があります。',
   why_en:'Express/Fastify use a persistent server model — a continuously running HTTP process. On Vercel, they must be wrapped as Serverless Functions that start and stop per request, requiring either an `express` adapter or converting all routes to API Routes.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-express-fbh',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&inc(a.deploy,'Firebase Hosting')&&!inc(a.backend,'Next'),
   ja:'Express/FastifyはFirebase Hosting（静的CDN）では動作しません。Railway/Renderを推奨します',
   en:'Express/Fastify cannot run on Firebase Hosting (static CDN). Use Railway/Render instead',
   why_ja:'Firebase Hostingは静的ファイル配信専用のCDNでNode.jsランタイムがありません。ExpressサーバーはHTTPリスナーを起動し続ける常駐プロセスであり、Firebase Hosting上では実行できません。',
   why_en:'Firebase Hosting is a static CDN with no Node.js runtime — Express servers cannot run there. Express needs a persistent HTTP listener that Firebase Hosting cannot provide.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-express-netlify',p:['backend','deploy'],lv:'warn',
   t:a=>(inc(a.backend,'Express')||inc(a.backend,'Fastify'))&&inc(a.deploy,'Netlify')&&!inc(a.frontend,'Next'),
   ja:'Express/FastifyのNetlifyデプロイは制限があります。Railway/Renderを推奨します',
   en:'Express/Fastify on Netlify has serverless limitations. Railway/Render recommended',
   why_ja:'NetlifyのFunctionsはリクエストごとに起動・終了するサーバーレス環境です。Expressを`netlify-lambda`でラップすることは可能ですが、WebSocket・セッション保持・ファイルシステム書込などのステートフル機能が動作せず、関数実行時間の上限（10秒）も多くのExpressユースケースには不十分です。',
   why_en:'Netlify Functions are serverless — they start and stop per request. Wrapping Express with `netlify-lambda` is possible but stateful features (WebSockets, session state, filesystem writes) won\'t work.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-java-netlify',p:['backend','deploy'],lv:'error',
   t:a=>(inc(a.backend,'Spring')||inc(a.backend,'Go')||inc(a.backend,'Gin'))&&inc(a.deploy,'Netlify'),
   ja:'NetlifyはLambda/Node.js専用でJVMランタイムがありません。Spring Boot/GinはRailway/Fly.io/Renderにデプロイしてください',
   en:'Netlify has no JVM runtime. Spring Boot cannot run on Netlify Functions. Use Railway, Fly.io, or Render',
   why_ja:'NetlifyのFunctionsはAWS Lambda互換で、Node.js・Go・Rustなど一部言語のみサポートします。JVMを必要とするSpring Bootは起動時に数百MBのヒープメモリと数秒の起動時間を要し、サーバーレス環境での制約（実行時間上限・メモリ上限）を大幅に超えます。',
   why_en:'Netlify Functions are AWS Lambda-compatible, supporting only Node.js, Go, and Rust. Spring Boot requires a JVM with hundreds of MB heap memory and several seconds of startup time, far exceeding the memory and timeout limits of serverless environments.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-py-fbh',p:['backend','deploy'],lv:'error',
   t:a=>isPyBE(a)&&inc(a.deploy,'Firebase Hosting'),
   ja:'Firebase HostingはCDN専用でPythonランタイムがありません。FastAPI/DjangoはRailway/Render/Fly.ioにデプロイしてください',
   en:'Firebase Hosting is a CDN-only service with no Python runtime. Deploy FastAPI/Django to Railway, Render, or Fly.io',
   why_ja:'Firebase HostingはHTMLファイルをCDNエッジから配信するサービスであり、サーバーサイドのプロセスを実行する機能がありません。Pythonアプリケーションはポートを持つHTTPサーバーとして常駐する必要があり、Firebase Hostingの構造とは根本的に異なります。',
   why_en:'Firebase Hosting serves HTML files from CDN edges with no capability to run server-side processes. Python applications need to run as persistent HTTP servers on a port — fundamentally incompatible with Firebase Hosting\'s architecture.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-java-fbh',p:['backend','deploy'],lv:'error',
   t:a=>(inc(a.backend,'Spring')||inc(a.backend,'Go')||inc(a.backend,'Gin'))&&inc(a.deploy,'Firebase Hosting'),
   ja:'Firebase HostingはCDN専用でJava/Goランタイムがありません。Spring Boot/GinはRailway/Render/Fly.ioにデプロイしてください',
   en:'Firebase Hosting has no Java or Go runtime. Deploy Spring Boot or Gin to Railway, Render, or Fly.io',
   why_ja:'Firebase HostingはJavaやGoのバイナリを実行する環境を提供しません。Spring BootはJVM上で動作するHTTPサーバーであり、GoのGinフレームワークもOSプロセスとして実行される必要があります。これらはFirebase Hosting上ではデプロイ可能な形式ではありません。',
   why_en:'Firebase Hosting provides no environment to run Java or Go binaries. Spring Boot runs as a JVM-based HTTP server; Go\'s Gin framework also needs to execute as an OS process. Neither is deployable on Firebase Hosting. Use Cloud Run (by Google) or Railway/Render instead.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'be-dep-py-cf',p:['backend','deploy'],lv:'error',
   t:a=>inc(a.backend,'FastAPI')&&inc(a.deploy,'Cloudflare'),
   ja:'Cloudflare WorkersはV8エンジン専用です。FastAPIはPythonであり実行できません。Railway/Fly.ioへの変更を推奨します',
   en:'Cloudflare Workers run on V8 only. FastAPI is Python and cannot execute there. Use Railway or Fly.io instead',
   why_ja:'Cloudflare WorkersはV8 JavaScriptエンジン上で動作するサーバーレス環境です。PythonインタープリターはV8上では実行できないため、FastAPIアプリケーションをデプロイすることは不可能です。',
   why_en:'Cloudflare Workers is a serverless environment that runs on the V8 JavaScript engine. The Python interpreter cannot run on V8, making it impossible to deploy FastAPI applications.',
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
   why_ja:'Supabase AuthはSupabaseプロジェクト（DB + Auth + Storage）と一体のサービスです。Express/Django等の独自バックエンドからSupabase JWTを検証するにはJWT Secretの共有設定が必要で、RLSポリシーも正しく機能しません。',
   why_en:'Supabase Auth is integrated with a Supabase project (DB + Auth + Storage). Verifying Supabase JWTs from a separate backend (Express/Django) requires sharing the JWT Secret, and RLS policies won\'t work correctly.',
   chain:[{f:'backend',s:'Supabase'},{f:'database',s:'Supabase (PostgreSQL)'}]},
  {id:'sem-auth-nofb-fbauth',p:['auth','backend'],lv:'warn',
   t:a=>inc(a.auth,'Firebase Auth')&&!inc(a.backend,'Firebase')&&!inc(a.backend,'Supabase'),
   ja:'Firebase Authが選択されていますが、バックエンドがFirebaseではありません。Admin SDKでのJWT検証設定が必要になります',
   en:'Firebase Auth selected but backend is not Firebase. Admin SDK JWT verification setup will be required',
   why_ja:'Firebase Authはトークン発行のみ担当し、APIサーバー側でのJWT検証にはFirebase Admin SDKの初期化（サービスアカウント鍵）が必要です。',
   why_en:'Firebase Auth only issues tokens — your API server needs Firebase Admin SDK (service account key) for JWT verification.',
   fix:{f:'backend',s:'Firebase'}},
  {id:'auth-dual-baas',p:['auth'],lv:'warn',
   t:a=>inc(a.auth,'Firebase Auth')&&inc(a.auth,'Supabase Auth'),
   ja:'Firebase AuthとSupabase Authが両方選択されています。認証の単一責任原則に反し、JWT検証ロジックが複雑化します。どちらか一方に統一してください',
   en:'Both Firebase Auth and Supabase Auth are selected. Dual auth providers violate the single source of truth principle. Pick one',
   why_ja:'Firebase AuthとSupabase Authは共にJWTを発行しますが、それぞれ異なる秘密鍵で署名され、異なるuserIdを持ちます。両方を同一APIで受け付けるには、各リクエストで署名者を判別してから適切なSDKで検証する必要があり、ミドルウェアが複雑になります。',
   why_en:'Firebase Auth and Supabase Auth both issue JWTs but sign them with different keys and assign different userIds. Accepting both in the same API requires detecting the issuer per request before verifying with the appropriate SDK, complicating middleware.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'auth-firebase-supabase-rls',p:['auth'],lv:'warn',
   t:a=>inc(a.auth,'Firebase Auth')&&(inc(a.database,'Supabase')||inc(a.backend,'Supabase')),
   ja:'Firebase AuthはSupabaseのRLSポリシー（auth.uid()）と互換性がありません。Supabase Authへの変更を推奨します',
   en:'Firebase Auth JWTs are incompatible with Supabase RLS policies (auth.uid()). Switch to Supabase Auth',
   why_ja:'SupabaseのRow Level Security（RLS）はPostgreSQLの`auth.uid()`関数でユーザーIDを取得します。この関数はSupabase Authが発行したJWTのみを読み取れ、Firebase AuthのJWT（異なる発行者・ペイロード構造）は認識しません。',
   why_en:'Supabase Row Level Security (RLS) uses PostgreSQL\'s `auth.uid()` function to get the user ID, which reads only Supabase Auth-issued JWTs. Firebase Auth JWTs use a different issuer and payload format that `auth.uid()` cannot parse.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'auth-cognito-supabase',p:['auth'],lv:'warn',
   t:a=>inc(a.auth,'Cognito')&&(inc(a.database,'Supabase')||inc(a.backend,'Supabase')),
   ja:'AWS CognitoのJWTはSupabaseのRLS（auth.uid()）と互換性がありません。Supabase Authへの変更を推奨します',
   en:'AWS Cognito JWTs are incompatible with Supabase RLS (auth.uid()). Switch to Supabase Auth',
   why_ja:'SupabaseのRLSは`auth.uid()`でユーザーIDを取得しますが、この関数はSupabase Authが発行したJWTのみ解析できます。AWS CognitoのJWT（異なるissuer・sub形式・カスタムクレーム構造）はauth.uid()では認識されず、全RLSポリシーが機能不全になります。',
   why_en:'Supabase RLS uses `auth.uid()` to get the user ID, but this function only parses JWTs issued by Supabase Auth.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'auth-nextauth-supabase-rls',p:['auth'],lv:'warn',
   t:a=>inc(a.auth,'NextAuth')&&(inc(a.database,'Supabase')||inc(a.backend,'Supabase')),
   ja:'NextAuthのJWTはSupabaseのRLSポリシー（auth.uid()）と互換性がありません。Supabase Authへの変更を推奨します',
   en:'NextAuth JWTs are incompatible with Supabase RLS policies (auth.uid()). Switch to Supabase Auth',
   why_ja:'SupabaseのRow Level Security（RLS）はPostgreSQLの`auth.uid()`関数でユーザーIDを取得します。この関数はSupabase Authが発行したJWTのみを読み取れます。',
   why_en:'Supabase Row Level Security (RLS) uses PostgreSQL\'s `auth.uid()` function to get the user ID, which only reads JWTs issued by Supabase Auth. NextAuth (Auth.js) JWTs use a different issuer and payload structure that `auth.uid()` cannot parse — it returns null.',
   fix:{f:'auth',s:'Supabase Auth'}},
  {id:'auth-clerk-firebase',p:['auth'],lv:'warn',
   t:a=>inc(a.auth,'Clerk')&&(inc(a.backend,'Firebase')||inc(a.database,'Firestore')),
   ja:'ClerkのJWTはFirebaseセキュリティルール（request.auth.uid）と互換性がありません。Firebase Authへの変更を推奨します',
   en:'Clerk JWTs are incompatible with Firebase Security Rules (request.auth.uid). Switch to Firebase Auth',
   why_ja:'FirebaseのセキュリティルールはCloud FirestoreとStorageの両方で`request.auth.uid`によるアクセス制御を行います。このフィールドはFirebase Authが発行したIDトークンからのみ読み取れます。',
   why_en:'Firebase Security Rules for Firestore and Storage use `request.auth.uid` for access control. This field is populated only from Firebase Auth-issued ID tokens.',
   fix:{f:'auth',s:'Firebase Auth'}},
  // A7: purpose=教育系 && entities に Product/Order（ドメイン不一致）
  {id:'sem-purpose-entities',p:['purpose','data_entities'],lv:'info',
   t:a=>(inc(a.purpose,'教育')||inc(a.purpose,'学習')||inc(a.purpose,'Education')||inc(a.purpose,'Learning')||inc(a.purpose,'LMS'))&&(inc(a.data_entities,'Product')||inc(a.data_entities,'Order')),
   ja:'教育・学習系のプロジェクトにProduct/Orderエンティティがあります。教材販売が目的でなければCourse/Lessonへの変更を検討してください',
   en:'Education project has Product/Order entities. Consider Course/Lesson unless this is for course sales',
   why_ja:'エンティティ名は生成されるDBスキーマ・APIエンドポイント・テスト・ドキュメントに直接使われます。教育プラットフォームでProductとOrderを使うと、EC系の命名規則（SKU・カート・返品ポリシー）が混入した仕様書が生成されます。',
   why_en:'Entity names are used directly in generated DB schemas, API endpoints, tests, and documentation. Using Product and Order in an education platform causes generated specs to include EC naming conventions (SKU, cart, return policy).',
   fixFn:a=>({f:'data_entities',s:(a.data_entities||'').replace(/Product/g,'Course').replace(/Order/g,'Enrollment')})},
  // A8: deploy=Vercel && backend含Express && frontend含Next.js（BFF曖昧）
  {id:'sem-deploy-bff',p:['deploy','backend','frontend'],lv:'info',
   t:a=>inc(a.deploy,'Vercel')&&inc(a.backend,'Express')&&inc(a.frontend,'Next.js'),
   ja:'Next.js + Express + Vercelの構成です。ExpressをNext.js API Routesに統合するか、Expressを別ホスト（Railway等）にする設計判断が必要です。生成文書ではAPI Routes統合を前提とします',
   en:'Next.js + Express + Vercel stack detected. Decide whether to merge Express into Next.js API Routes or host Express separately. Generated docs will assume API Routes integration',
   why_ja:'VercelはExpressのようなステートフルサーバーをデプロイできません（サーバーレス関数のみ）。Next.js API RoutesはVercelサーバーレス関数として動作し、Expressを置き換えられます。',
   why_en:'Vercel cannot deploy stateful servers like Express (serverless functions only). Next.js API Routes run as Vercel serverless functions and can replace Express.'},
  // ── Security Rules (3 rules: 1 ERROR + 2 WARN) ──
  // S1: 金融/医療/法務 + MFA未設定
  {id:'dom-sec-nomfa',p:['purpose','mvp_features'],lv:'warn',
   t:a=>{
     const dom=detectDomain(a.purpose||'');
     if(!dom)return false;
     const isSensitiveDomain=['fintech','health','legal'].includes(dom);
     const hasMFA=inc(a.mvp_features,'MFA')||inc(a.mvp_features,'二要素')||inc(a.mvp_features,'2FA')||inc(a.mvp_features,'多要素');
     const scale=a.scale||'medium';
     return isSensitiveDomain&&!hasMFA&&scale!=='solo';
   },
   ja:'金融/医療/法務系のプロジェクトですが、MFA（多要素認証）が設定されていません。セキュリティ強化のためMFA導入を推奨します',
   en:'Finance/health/legal project without MFA (multi-factor authentication). MFA is strongly recommended for security',
   why_ja:'パスワード単体では不十分です。金融・医療・法務では、流出したパスワード1つで全データへのアクセスが可能になります。PCI-DSS v4ではMFAが必須（Requirement 8.4）、HIPAAでもリスク軽減措置として強く推奨されます。',
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
   why_ja:'PrismaのMongoDB対応は「Preview」段階で、リレーション・マイグレーション・トランザクションなど主要機能が制限されています。本番環境でPrisma Migrateを使うとコレクション構造が壊れる既知の問題があります。',
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
   why_ja:'Redisはインメモリデータストアであり、デフォルトではサーバー再起動でデータが消失します（AOF/RDBによる永続化設定が可能ですが、本番での管理コストが高い）。',
   why_en:'Redis is an in-memory data store — by default, data is lost on server restart (AOF/RDB persistence is configurable but costly to manage in production).',
   fix:{f:'database',s:'PostgreSQL'}},
  {id:'db-mysql-kysely',p:['database','orm'],lv:'info',
   t:a=>inc(a.database,'MySQL')&&inc(a.orm,'Kysely'),
   ja:'Kysely + MySQLではmysql2パッケージとMySQLDialectの設定が必要です',
   en:'Kysely + MySQL requires the mysql2 package and MySQLDialect configuration',
   why_ja:'Kyselyはデータベースドライバーをダイアレクト（方言）プラグインとして抽象化しています。PostgreSQLには`@kysely-org/kysely`にバンドルされた`PostgresDialect`がありますが、MySQLサポートは別途`mysql2`パッケージのインストールと`MysqlDialect`の明示的な設定が必要です。',
   why_en:'Kysely abstracts database drivers as dialect plugins. PostgreSQL has `PostgresDialect` bundled in `@kysely-org/kysely`, but MySQL support requires separately installing the `mysql2` package and explicitly configuring `MysqlDialect`.'},
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
   why_ja:'レート制限なしのAPIは1秒間に数千リクエストを処理しようとしてDBコネクションプールが枯渇します。悪意ある攻撃者は認証ブルートフォース（1秒1000回試行）・スクレイピング・サービス妨害が可能になります。',
   why_en:'APIs without rate limiting attempt to process thousands of requests per second, exhausting the DB connection pool. Malicious actors can perform authentication brute force (1000 attempts/second), scraping, or denial-of-service.'},
  // ── テスト品質 (1 WARN + 2 INFO) ──
  {id:'test-e2e-auth-storagestate',p:['auth','frontend'],lv:'warn',
   t:a=>{
     const hasAuth=a.auth&&!inc(a.auth,'なし')&&!inc(a.auth,'None')&&a.auth!=='';
     const hasWebFE=inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte');
     const hasMobileOnly=inc(a.mobile,'Expo')||inc(a.mobile,'React Native');
     // Only warn when E2E testing is explicitly planned (Playwright/Cypress in features)
     const hasE2E=/(playwright|cypress)/i.test(a.mvp_features||'');
     return hasAuth&&hasWebFE&&!hasMobileOnly&&hasE2E;
   },
   ja:'認証付きE2EテストはPlaywright storageStateでセッションを再利用し、不安定なログインフローを防いでください',
   en:'E2E tests with auth: use Playwright storageState to reuse sessions and prevent flaky login flows',
   why_ja:'E2Eテストごとにログインフローを実行すると、ネットワーク遅延・メール確認・MFAなどによりテストが不安定になります。Playwright storageStateはログイン済みセッションをJSONファイルに保存し、以降のテストはログイン不要で開始できます。',
   why_en:'Running a full login flow for each E2E test makes tests flaky — network delays, email verification, and MFA cause intermittent failures. Playwright storageState saves the authenticated session to a JSON file, allowing subsequent tests to skip login entirely.'},
  {id:'test-playwright-webkit',p:['frontend'],lv:'info',
   t:a=>(inc(a.frontend,'Next.js')||inc(a.frontend,'React')||inc(a.frontend,'Vue')||inc(a.frontend,'Svelte'))&&(!a.mobile||inc(a.mobile,'なし')||inc(a.mobile,'None')),
   ja:'PlaywrightのWebKitプロジェクト設定でSafariクロスブラウザテストを追加することを推奨します',
   en:'Add Playwright WebKit project to enable Safari cross-browser test coverage',
   why_ja:'SafariはChromium・Firefoxと異なるJavaScriptエンジン（JavaScriptCore）を使用し、独自のCSS実装・Web API差分があります。PlaywrightのWebKitプロジェクトをplaywright.config.tsに追加することで、macOS実機なしにSafari互換性を自動テストできます。',
   why_en:'Safari uses a different JavaScript engine (JavaScriptCore) from Chromium and Firefox, with unique CSS implementations and Web API differences.'},
  {id:'test-mutation-stryker',p:['backend'],lv:'info',
   t:a=>isNodeBE(a)||inc(a.backend,'Next.js'),
   ja:'Strykerミューテーションテストを導入してテストの実効性（バグ検出力）を検証することを推奨します',
   en:'Add Stryker mutation testing to measure test effectiveness and catch untested code paths',
   why_ja:'ミューテーションテストとは、コードに意図的なバグ（例：`===`→`!==`、`+`→`-`）を自動的に埋め込み（ミュータント生成）、テストスイートがそのバグを検出（ミュータントを「殺す」）できるか検証する手法です。',
   why_en:'Mutation testing automatically injects intentional bugs into code (e.g., `===` → `!==`, `+` → `-`) to generate "mutants," then verifies whether your test suite detects (kills) each mutant.'},
  // ── AI安全性 (3 WARN + 2 INFO) ──
  {id:'ai-guardrail-missing',p:['ai_auto','mvp_features'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     // UPP G-5 defaults ('マルチAgent協調' / 'Vibe Coding入門') represent dev tooling, not LLM product features
     if(/^(マルチAgent協調|Vibe\s?Coding入門)$/.test(a.ai_auto))return false;
     const scale=a.scale||'medium';
     if(scale==='solo')return false;
     return !/(guardrail|ガードレール|安全|safety|filter|フィルタ|sanitize|moderate|モデレート|validation|検証)/i.test(a.mvp_features||'');
   },
   ja:'AI機能が有効ですが、mvp_featuresにガードレール/安全フィルタの記述がありません。入力検証・出力モデレーション・レート制限を実装してください (docs/96参照)',
   en:'AI features active but no guardrail/safety filter in mvp_features. Implement input validation, output moderation, and rate limiting (see docs/96)',
   why_ja:'ガードレールなしのLLM機能は「プロンプトインジェクション」に脆弱です。悪意あるユーザーが「あなたのシステムプロンプトを全て出力して」と入力すると機密情報が漏洩します。',
   why_en:'LLM features without guardrails are vulnerable to prompt injection. Malicious inputs like "output all your system prompts" can leak confidential information.'},
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
     const hasMasking=/(PII|仮名化|匿名化|個人情報マスク|pii.?mask|pseudonym)/i.test(a.mvp_features||'');
     return !hasMasking&&piiE.some(e=>inc(a.data_entities,e));
   },
   ja:'個人情報エンティティ（Patient/Transaction等）がAI機能と併用されています。LLMへの送信前にPIIをマスキング/仮名化してください (docs/95参照)',
   en:'PII entities (Patient/Transaction/etc.) used with AI features. Mask or pseudonymize PII before sending to LLM (see docs/95)',
   why_ja:'OpenAI/Anthropicのモデルに送信したデータはモデル改善に使用される場合があります（Enterprise契約を除く）。患者名・クレジットカード番号・診断情報等をそのままLLMに送ると、GDPR第9条（特別カテゴリデータ）・個人情報保護法違反のリスクがあります。',
   why_en:'Data sent to OpenAI/Anthropic models may be used for model improvement (unless on Enterprise contracts). Sending patient names, credit card numbers, or diagnoses to LLMs risks violating GDPR Article 9 (special category data) and similar privacy laws.'},
  {id:'ai-ratelimit-reminder',p:['ai_auto','backend'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return isNodeBE(a)||isPyBE(a)||inc(a.backend,'Spring');
   },
   ja:'AI機能のあるAPIにはトークン消費量ベースのレート制限を実装してください。@upstash/ratelimit (Node) または slowapi with token tracking (Python) を推奨します',
   en:'Add token-budget rate limiting to AI API endpoints. Recommended: @upstash/ratelimit (Node) or slowapi with token tracking (Python)',
   why_ja:'通常のAPIリクエストは数ミリ秒ですが、LLM APIコール1回で数千〜数万トークンを消費し、月額コストが急増します。ユーザーが意図的またはバグで大量リクエストを送った場合、APIキーの料金上限に達してサービス全体が停止します。',
   why_en:'Regular API requests take milliseconds, but a single LLM API call consumes thousands to tens of thousands of tokens, rapidly increasing monthly costs.'},
  {id:'ai-local-model-infra',p:['ai_auto','deploy'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     const isLocal=/(Ollama|LM Studio|ローカルLLM|local LLM|llama|mistral|open.?source|セルフホスト|self.?host)/i.test(a.ai_auto);
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     return isLocal&&isProd;
   },
   ja:'ローカル/セルフホストLLMとクラウドデプロイの組み合わせはGPUインスタンス（RunPod/Lambda Labs）またはvLLM/Ollamaサーバーの別途ホスティングが必要です',
   en:'Local/self-hosted LLM with cloud deployment requires GPU instances (RunPod/Lambda Labs) or separate vLLM/Ollama hosting',
   why_ja:'OllamaやLM Studioはローカル開発マシン（GPU搭載）でLLMを動かすツールです。Vercel/Railway等のクラウドサーバーレス環境にはGPUがなく、CPUのみでLlama-3-70Bを実行すると1トークン生成に数秒かかり実用不可です。',
   why_en:'Ollama and LM Studio run LLMs on local development machines (with GPU). Cloud serverless environments like Vercel/Railway have no GPU — running Llama-3-70B on CPU alone takes several seconds per token, making it impractical.'},
  // ── クロスピラー P21/P22/P25 (INFO×3) ──
  {id:'api-openapi-remind',p:['mvp_features','data_entities'],lv:'info',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     return ents>=4&&!/(OpenAPI|swagger|api.spec|仕様書)/i.test(a.mvp_features||'');
   },
   ja:'エンティティが4件以上あります。docs/84_openapi_specification.md のOpenAPI 3.1仕様を活用してAPIコントラクトを明確にしてください',
   en:'4+ entities detected. Use OpenAPI 3.1 spec (docs/84) to clarify API contracts and generate client SDKs',
   why_ja:'エンティティが4件以上になると、APIエンドポイントは通常20件を超えます。OpenAPI 3.1仕様書がないと、フロントエンド・バックエンド・AIエージェント間でAPIの期待値が口頭合意・コード読み取りに頼ることになります。',
   why_en:'With 4+ entities, API endpoints typically exceed 20. Without an OpenAPI 3.1 spec, expected values between frontend, backend, and AI agents rely on verbal agreements or code reading.'},
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
   why_ja:'RTO（Recovery Time Objective）はシステム復旧までの許容時間、RPO（Recovery Point Objective）はデータ損失の許容量です。バックアップ戦略のないDB障害では、最悪ケースでデータが完全に失われます。',
   why_en:'RTO (Recovery Time Objective) is the acceptable time to restore a system; RPO (Recovery Point Objective) is the acceptable data loss window. Without a backup strategy, a DB failure at worst means complete data loss.'},
  // ── クロスレイヤー整合性 CL-1〜CL-12 (WARN×7 + INFO×5) ──
  {id:'infra-pg-no-pool',p:['deploy','database'],lv:'warn',
   t:a=>{
     const isServerless=/Vercel|Netlify|Cloudflare/i.test(a.deploy||'');
     const isPg=/(PostgreSQL|Neon|Supabase)/i.test(a.database||'');
     const hasPool=/(PgBouncer|Pooler|connection.?pool|pgpool|コネクションプール|接続プール)/i.test((a.mvp_features||'')+(a.backend||''));
     const isSupabase=inc(a.backend,'Supabase')||inc(a.database,'Supabase');
     return isServerless&&isPg&&!hasPool&&!isSupabase;
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
   why_ja:'JWTは一度発行すると有効期限まで取り消せません。ユーザーをBANしてもトークンが生きている限りAPIに到達できます。コンプライアンス監査では全認証イベントのログが必要ですが、カスタムJWTでは実装コストが非常に高くなります。',
   why_en:'JWTs cannot be revoked once issued — a banned user\'s token still reaches your API until expiry. Compliance audits require full authentication event logs, which are expensive to build with custom JWT.',
   fix:{f:'auth',s:'Auth.js/NextAuth'}},
  {id:'api-large-no-pagination',p:['data_entities','mvp_features'],lv:'warn',
   t:a=>{
     const ents=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean).length;
     const hasPagination=/(ページネーション|pagination|cursor|infinite.?scroll|limit|offset)/i.test(a.mvp_features||'');
     const scale=a.scale||'medium';
     return ents>=7&&!hasPagination&&scale!=='solo';
   },
   ja:'エンティティが7件以上ありますが、mvp_featuresにページネーションの記述がありません。一覧画面でのパフォーマンス問題を防ぐためカーソルページネーションを実装してください',
   en:'7+ entities but no pagination in mvp_features. Implement cursor-based pagination to prevent list view performance issues',
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
   why_ja:'本番環境でエラーが発生しても、監視がなければユーザーからの苦情が来るまで気づきません。Sentryはエラーを自動キャプチャしスタックトレース・ユーザー影響数・再現率をダッシュボードに表示します。',
   why_en:'Without monitoring, you won\'t know when errors occur in production until users complain. Sentry automatically captures errors and shows stack traces, user impact counts, and reproduction rates in a dashboard.'},
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
   why_ja:'GooglebotはJavaScriptを実行しますが、CSRページはレンダリング遅延が生じ、クロール予算の消費も激しいです。特に`<title>`や`<meta description>`がJS実行後に設定される場合、インデックス登録が大幅に遅れます。',
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
   why_ja:'WCAG 2.1 AA準拠はEUのEAA（欧州アクセシビリティ法、2025年6月施行）・米国ADA（障害者法）・日本の障害者差別解消法で要求されています。',
   why_en:'WCAG 2.1 AA compliance is required by the EU\'s EAA (European Accessibility Act, enforced June 2025), the US ADA (Americans with Disabilities Act), and similar laws globally.'},
  {id:'zt-db-privilege',p:['database','deploy'],lv:'info',
   t:a=>{
     const isProd=/Vercel|Railway|Fly\.io|Render|Heroku|AWS|GCP|Azure/i.test(a.deploy||'');
     const hasPgMy=/(PostgreSQL|MySQL|Neon)/i.test(a.database||'');
     const hasRoles=/(role|権限|privilege|最小権限|least privilege)/i.test(a.mvp_features||'');
     return isProd&&hasPgMy&&!hasRoles;
   },
   ja:'本番PostgreSQL/MySQL構成です。アプリ用の最小権限ロール（SELECT/INSERT/UPDATE のみ）を作成し、rootユーザーでの接続を避けてください（docs/43参照）',
   en:'Production PostgreSQL/MySQL: create least-privilege app roles (SELECT/INSERT/UPDATE only). Never connect as root (see docs/43)',
   why_ja:'アプリケーションがrootまたはsuperuser権限でDBに接続していると、SQLインジェクション脆弱性が発覚した場合に攻撃者がDB全体を削除・書き換えできます。',
   why_en:'When an application connects to a DB as root/superuser, a SQL injection vulnerability gives attackers the ability to delete or rewrite the entire DB.'},
  {id:'api-cors-wildcard',p:['backend','deploy'],lv:'warn',
   t:a=>{
     const hasAPI=inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'NestJS')||inc(a.backend,'Hono')||inc(a.backend,'FastAPI')||inc(a.backend,'Django')||inc(a.backend,'Spring');
     const hasCORS=/(CORS|cors|cross.?origin)/i.test(a.mvp_features||'');
     return hasAPI&&!hasCORS;
   },
   ja:'APIサーバー構成でCORS設定の記述がありません。ワイルドカード（*）許可は禁止し、許可オリジンを明示的に設定してください（docs/43参照）',
   en:'API server without CORS in mvp_features. Never allow wildcard (*) origins — set explicit allowed origins (see docs/43)',
   why_ja:'CORSはブラウザの保護機構です。`Access-Control-Allow-Origin: *` を設定すると、悪意あるサイトがユーザーのブラウザ経由でAPIを呼び出せるようになります（CSRF攻撃）。認証Cookieを使用している場合は特に危険で、ユーザーになりすましてデータを読み書きされます。',
   why_en:'CORS is a browser protection mechanism. Setting `Access-Control-Allow-Origin: *` allows malicious sites to call your API through the user\'s browser (CSRF attack).'},
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
   why_ja:'マイグレーションツールなしでDBスキーマを変更すると、本番DBとコードのスキーマが乖離します。手動ALTER TABLEは本番環境への適用漏れ・適用順序ミス・ロールバック不能が頻発します。',
   why_en:'Changing DB schemas without migration tooling causes divergence between production DB and code schemas. Manual ALTER TABLE frequently results in missed production deployments, incorrect ordering, and inability to roll back.'},
  // ── Semantic / Runtime Compatibility (2 ERROR, 5 WARN, 3 INFO) ──
  {id:'be-firebase-prisma',p:['backend','orm'],lv:'error',
   t:a=>inc(a.backend,'Firebase')&&inc(a.orm,'Prisma'),
   ja:'FirebaseはNoSQL（Firestore）のため、SQLベースのPrismaは使用できません。FirebaseはFirebase Admin SDKでアクセスしてください',
   en:'Firebase uses Firestore (NoSQL). Prisma is a SQL ORM and is incompatible. Use the Firebase Admin SDK directly',
   why_ja:'PrismaはPostgreSQL/MySQL/SQLiteなどのRDB専用ORMです。FirebaseのデータストアはFirestoreというドキュメント型NoSQLであり、SQL接続文字列もスキーマ定義も存在しません。',
   why_en:'Prisma is a SQL-only ORM for PostgreSQL/MySQL/SQLite. Firebase\'s datastore is Firestore, a document-based NoSQL with no SQL connection string or schema definition. Prisma\'s `generate` command has no driver to connect to Firestore and will error at build time.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'be-firebase-typeorm',p:['backend','orm'],lv:'error',
   t:a=>inc(a.backend,'Firebase')&&inc(a.orm,'TypeORM'),
   ja:'FirebaseはNoSQL（Firestore）のため、SQL用のTypeORMは使用できません。Firebase Admin SDKを使用してください',
   en:'Firebase uses Firestore (NoSQL). TypeORM is a SQL ORM and is incompatible. Use the Firebase Admin SDK directly',
   why_ja:'TypeORMはPostgreSQL/MySQL/SQLiteなどのRDB専用ORMです。FirebaseのデータストアはFirestoreというドキュメント型NoSQLであり、SQL接続文字列・テーブル定義・マイグレーションが存在しません。',
   why_en:'TypeORM is a SQL-only ORM for PostgreSQL/MySQL/SQLite. Firebase\'s datastore is Firestore, a document-based NoSQL with no SQL connection strings, table definitions, or migrations.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'be-nextjs-typeorm',p:['backend','orm'],lv:'warn',
   t:a=>inc(a.backend,'Next.js')&&inc(a.orm,'TypeORM'),
   ja:'Next.js（サーバーレス）とTypeORMの組み合わせはDBコネクションリークを引き起こします。PrismaまたはDrizzleへの変更を推奨します',
   en:'TypeORM in Next.js serverless causes DB connection leaks. Use Prisma or Drizzle instead',
   why_ja:'TypeORMはDataSourceをモジュールスコープで管理しますが、Next.jsのサーバーレス環境では関数呼び出しごとに新しいプロセスが起動し、コネクションプールが累積します。',
   why_en:'TypeORM manages its DataSource at module scope, but Next.js serverless spawns new processes per invocation, causing connection pool accumulation. Prisma provides an official global client pattern using `globalThis` caching designed for Next.js Hot Reload.',
   fix:{f:'orm',s:'Prisma ORM'}},
  {id:'orm-typeorm-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'TypeORM')&&inc(a.database,'Firestore'),
   ja:'TypeORMはSQL専用ORMです。FirestoreはNoSQLのため接続できません。Firebase Admin SDKを直接使用してください',
   en:'TypeORM is a SQL-only ORM and cannot connect to Firestore (NoSQL). Use the Firebase Admin SDK directly',
   why_ja:'TypeORMはデータソースにSQL接続文字列（postgresql://...等）を要求します。Firestoreにはそのような接続プロトコルが存在せず、TypeORMのドライバーもFirestoreに対応していません。`DataSource.initialize()`はFirestoreを対象にした場合にビルド時エラーになります。',
   why_en:'TypeORM requires a SQL connection string (e.g. postgresql://...) for its DataSource. Firestore has no such connection protocol and TypeORM has no Firestore driver. `DataSource.initialize()` targeting Firestore will error at build time.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'orm-prisma-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'Prisma')&&inc(a.database,'Firestore'),
   ja:'PrismaはSQL専用ORMです。FirestoreはNoSQLのため接続できません。Firebase Admin SDKを直接使用してください',
   en:'Prisma is a SQL-only ORM and cannot connect to Firestore (NoSQL). Use the Firebase Admin SDK directly',
   why_ja:'PrismaはPostgreSQL・MySQL・SQLite・SQL ServerなどのRDB専用ORMです。Firestoreはドキュメント型NoSQLであり、SQL接続文字列・スキーマ定義・マイグレーションが存在しません。`prisma generate`はFirestore用のコネクターを持たないためビルドエラーになります。',
   why_en:'Prisma is a SQL-only ORM for PostgreSQL, MySQL, SQLite, and SQL Server. Firestore is a document-based NoSQL with no SQL connection string, schema definition, or migrations. `prisma generate` has no Firestore connector and will error at build time.',
   fix:{f:'orm',s:'Firebase Admin SDK'}},
  {id:'orm-sqla-fs',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.database,'Firestore'),
   ja:'SQLAlchemyはSQL専用ORMです。FirestoreはNoSQLのため接続できません。Firebase Admin SDK（Python）を使用してください',
   en:'SQLAlchemy is SQL-only and cannot connect to Firestore (NoSQL). Use the Firebase Admin SDK for Python',
   why_ja:'SQLAlchemyはPostgreSQL/MySQL/SQLite等のSQLデータベースに対してDB-API 2.0準拠のドライバーで接続します。',
   why_en:'SQLAlchemy connects to PostgreSQL/MySQL/SQLite via DB-API 2.0 compliant drivers. Firestore is a NoSQL service accessed via HTTP/gRPC through the google-cloud-firestore library.',
   fix:{f:'orm',s:'None / Firebase Admin SDK'}},
  {id:'orm-sqla-mongo',p:['orm','database'],lv:'error',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.database,'MongoDB'),
   ja:'SQLAlchemyにMongoDBドライバーはありません。MongoDBにはMongoEngine/Motor/PyMongoを使用してください',
   en:'SQLAlchemy has no MongoDB driver. Use MongoEngine, Motor, or PyMongo for MongoDB',
   why_ja:'SQLAlchemyはリレーショナルデータベース専用のORMであり、MongoDBへの公式サポートは存在しません。過去に`ming`等の非公式アダプターが存在しましたが現在は非推奨です。',
   why_en:'SQLAlchemy is an ORM exclusively for relational databases with no official MongoDB support. Legacy unofficial adapters like `ming` exist but are deprecated. For MongoDB in Python, use PyMongo (official driver), Motor (async), or MongoEngine (ODM).',
   fix:{f:'orm',s:'None / PyMongo'}},
  {id:'orm-typeorm-mongo',p:['orm','database'],lv:'info',
   t:a=>inc(a.orm,'TypeORM')&&inc(a.database,'MongoDB'),
   ja:'TypeORMのMongoDB対応は実験的段階で、主要機能（リレーション・マイグレーション）に制限があります。Mongooseの使用を検討してください',
   en:'TypeORM\'s MongoDB support is experimental with limited relations and migrations. Consider using Mongoose instead',
   why_ja:'TypeORMはMongoDB用の`MongoEntityManager`を提供していますが、`@ManyToOne`等のリレーションマッピング・マイグレーション・トランザクションが動作しない既知の問題があります。',
   why_en:'TypeORM provides `MongoEntityManager` for MongoDB but has known issues with relation mapping (`@ManyToOne` etc.), migrations, and transactions. Mongoose is a mature ODM that provides schemas, validation, and population aligned with MongoDB\'s document structure.'},
  {id:'db-supabase-typeorm',p:['database','orm'],lv:'warn',
   t:a=>inc(a.database,'Supabase')&&inc(a.orm,'TypeORM'),
   ja:'TypeORMはSupabaseのRLS（行単位セキュリティ）を迂回します。Supabase公式クライアントまたはDrizzle ORMの使用を推奨します',
   en:'TypeORM bypasses Supabase Row Level Security (RLS). Use the Supabase JS client or Drizzle ORM instead',
   why_ja:'TypeORMはPostgresに直接接続するため、Supabaseが提供するRLSポリシー（`auth.uid()`ベースのアクセス制御）を完全に迂回します。これによりマルチテナントのデータ分離が機能せず、`select * from orders`で全ユーザーのデータが返る状態になります。',
   why_en:'TypeORM connects directly to Postgres, completely bypassing Supabase RLS policies (auth.uid()-based access control). This breaks multi-tenant data isolation — `select * from orders` returns all users\' data. The Supabase JS client automatically applies JWT-based RLS.',
   fix:{f:'orm',s:'Drizzle ORM'}},
  {id:'orm-prisma-supabase',p:['database','orm'],lv:'info',
   t:a=>inc(a.database,'Supabase')&&inc(a.orm,'Prisma'),
   ja:'PrismaはSupabaseのRLSポリシーを適用しません。Supabase JSクライアントとの併用か、Drizzleへの移行を検討してください',
   en:'Prisma bypasses Supabase RLS policies. Consider pairing with Supabase JS client or switching to Drizzle',
   why_ja:'PrismaはPostgres直接接続のため、SupabaseのRLS（`auth.uid()`ベースの行単位アクセス制御）を迂回します。',
   why_en:'Prisma connects directly to Postgres, bypassing Supabase\'s RLS. This is acceptable for server-only APIs but causes data access layer split when combined with Supabase Realtime or edge functions. Drizzle ORM is Supabase\'s officially recommended ORM.'},
  {id:'mt-supabase-no-rls',p:['backend','org_model'],lv:'error',
   t:a=>inc(a.backend,'Supabase')&&a.org_model&&/(company|b2b|チーム|team|組織|enterprise|B2B)/i.test(a.org_model||'')&&!/(RLS|Row Level Security|行単位セキュリティ)/i.test(a.mvp_features||''),
   ja:'マルチテナント構成でSupabaseを使用していますが、RLS（行単位セキュリティ）の設定が見当たりません。テナント間のデータ漏洩リスクがあります',
   en:'Multi-tenant Supabase without Row Level Security (RLS) detected. Risk of cross-tenant data leakage',
   why_ja:'SupabaseはPostgreSQLのRLSを利用してテナント間のデータ分離を実現します。RLSなしでは、異なる組織のユーザーが互いのデータを読み取れる状態になります（例: `SELECT * FROM orders`で全テナントのデータが返る）。',
   why_en:'Supabase uses PostgreSQL RLS to achieve data isolation between tenants. Without RLS, users of different organizations can read each other\'s data (e.g., `SELECT * FROM orders` returns all tenant data).',
   fix:{f:'mvp_features',s:'RLS (Row Level Security) per-tenant isolation'}},
  {id:'deploy-sqlite-vercel',p:['database','deploy'],lv:'warn',
   t:a=>inc(a.database,'SQLite')&&inc(a.deploy,'Vercel'),
   ja:'VercelはエフェメラルなファイルシステムのためSQLiteの書き込みはリクエスト間で消失します。Supabase/Neon/PlanetScaleへの変更を推奨します',
   en:'Vercel has an ephemeral filesystem. SQLite writes are lost between requests. Switch to Supabase/Neon/PlanetScale',
   why_ja:'Vercelのサーバーレス関数はリクエストごとに新しいコンテナ上で実行され、ファイルシステムへの書き込みは次のリクエストでは残りません。SQLiteはファイルシステムにDBファイルを保持するため、書き込みが全て揮発します。',
   why_en:'Vercel serverless functions run in a new container per request, and filesystem writes do not persist to the next request. SQLite stores the DB file on the filesystem, so all writes are volatile. It works only in development; in production, all data is lost.',
   fix:{f:'database',s:'Neon (Serverless PostgreSQL)'}},
  {id:'db-pg-vercel-nopool',p:['database','deploy'],lv:'warn',
   t:a=>{
     const isPg=/(PostgreSQL|Neon)/i.test(a.database||'');
     const isVercel=inc(a.deploy,'Vercel');
     const hasPool=/(PgBouncer|pgpool|pool|Neon|connection.?pool)/i.test((a.database||'')+(a.mvp_features||''));
     const isSupabase=inc(a.backend,'Supabase')||inc(a.database,'Supabase');
     return isPg&&isVercel&&!hasPool&&!isSupabase;
   },
   ja:'Vercelサーバーレス＋PostgreSQLではコネクション枯渇が発生します。PgBouncer/Neonのサーバーレス対応接続プールを使用してください',
   en:'Vercel serverless + PostgreSQL risks connection pool exhaustion. Use PgBouncer or Neon\'s serverless-compatible connection pooler',
   why_ja:'Vercelのサーバーレス関数は同時実行数が急増するとそれぞれが独立したDB接続を張ります。PostgreSQLの最大接続数（通常100〜200）を瞬時に超え、`too many connections`エラーが発生します。',
   why_en:'Vercel serverless functions each open an independent DB connection when concurrent requests spike, instantly exceeding PostgreSQL\'s max connections (typically 100-200) and causing `too many connections` errors.',
   fix:{f:'database',s:'Neon (Serverless PostgreSQL)'}},
  {id:'be-nestjs-beginner',p:['backend','skill_level'],lv:'warn',
   t:a=>inc(a.backend,'NestJS')&&inc(a.skill_level,'Beginner'),
   ja:'NestJSはDI・デコレーター・TypeScriptが前提の上級者向けフレームワークです。BeginnerにはExpress/Honoを推奨します',
   en:'NestJS requires DI, decorators and TypeScript expertise. For Beginners, Express or Hono is recommended',
   why_ja:'NestJSはAngularに着想を得たDI（依存性注入）コンテナ・モジュールシステム・デコレーター群を持つエンタープライズ向けフレームワークです。',
   why_en:'NestJS is an enterprise framework inspired by Angular, with a DI container, module system, and decorators.',
   fix:{f:'backend',s:'Express + Node.js'}},
  {id:'orm-sqlalchemy-vercel',p:['orm','deploy'],lv:'warn',
   t:a=>inc(a.orm,'SQLAlchemy')&&inc(a.deploy,'Vercel'),
   ja:'SQLAlchemy（Python）はVercelのNode.js中心のサーバーレス環境と相性が悪く、コールドスタート遅延や関数サイズ制限に抵触する可能性があります',
   en:'SQLAlchemy (Python) is poorly suited for Vercel\'s Node.js-oriented serverless. Expect cold start delays and potential function size limit issues',
   why_ja:'VercelはデフォルトでHobbyプラン関数サイズ50MB制限があり、Python関数でSQLAlchemy+Alembicを組み合わせると容易にこの制限を超えます。またPythonのコールドスタートはNode.jsより遅く（〜1〜3秒）、ユーザー体験に影響します。',
   why_en:'Vercel has a 50MB function size limit by default (Hobby plan), easily exceeded when combining SQLAlchemy + Alembic in Python functions. Python cold starts are also slower than Node.js (~1-3 seconds), impacting user experience.',
   fix:{f:'deploy',s:'Railway'}},
  {id:'pay-stripe-static-be',p:['payment','backend'],lv:'warn',
   t:a=>inc(a.payment,'Stripe')&&isStaticBE(a),
   ja:'StripeのWebhook（payment_intent.succeeded等）処理には必ずサーバーサイドが必要です。静的サイト構成では決済完了を安全に確認できません',
   en:'Stripe Webhooks (payment_intent.succeeded etc.) require server-side processing. A static-only stack cannot safely confirm payment completion',
   why_ja:'Stripe Webhookは決済確定・失敗・返金などのイベントをサーバーに非同期で通知します。このエンドポイントが存在しないと、決済ステータスの更新・メール送信・注文確定処理が実行できません。',
   why_en:'Stripe Webhooks asynchronously notify your server about payment confirmation, failure, refund, etc. Without an endpoint to receive these, you cannot update payment status, send emails, or confirm orders.',
   fix:{f:'backend',s:'Express + Node.js'}},
  {id:'fe-nextjs-realtime-naked',p:['frontend','mvp_features'],lv:'info',
   t:a=>inc(a.frontend,'Next')&&/(WebSocket|websocket|リアルタイム|realtime|チャット|chat|通知|notification)/i.test(a.mvp_features||'')&&!/(Pusher|Ably|Socket\.io|Supabase Realtime|Firebase|Convex|liveblocks)/i.test(a.mvp_features||''),
   ja:'Next.js App RouterではネイティブWebSocketサーバーが動作しません。Pusher/Ably/Supabase Realtimeの利用を推奨します（docs/49参照）',
   en:'Next.js App Router does not support native WebSocket servers. Use Pusher/Ably/Supabase Realtime for realtime features (see docs/49)',
   why_ja:'Next.jsのApp Router（Vercel Edge Runtime）はステートレス関数として実行されるため、永続的なWebSocket接続を保持できません。Pusher/Ably/Supabase Realtimeはマネージドなリアルタイム配信サービスで、スケーラブルな接続管理を提供します。',
   why_en:'Next.js App Router (Vercel Edge Runtime) runs as stateless functions and cannot maintain persistent WebSocket connections. Pusher/Ably/Supabase Realtime are managed realtime delivery services providing scalable connection management.'},
  {id:'auth-baas-custom-jwt',p:['backend','auth'],lv:'info',
   t:a=>(inc(a.backend,'Firebase')||inc(a.backend,'Supabase'))&&inc(a.auth,'JWT')&&!inc(a.auth,'Firebase')&&!inc(a.auth,'Supabase'),
   ja:'Firebase/SupabaseとカスタムJWTを併用すると認証の正本（SoT）が分裂します。BaaSの組み込み認証（Firebase Auth/Supabase Auth）に統一してください',
   en:'Mixing Firebase/Supabase with custom JWT splits your auth source of truth. Unify on the BaaS built-in auth (Firebase Auth/Supabase Auth)',
   why_ja:'Firebase/SupabaseはそれぞれFirebase Auth/Supabase AuthというJWT発行機構を内蔵しており、RLS・セキュリティルール・SDK全体がこの内蔵JWTと統合されています。',
   why_en:'Firebase/Supabase each have a built-in JWT issuance mechanism integrated with their RLS, security rules, and SDKs. Issuing custom JWTs breaks Firestore security rules (`request.auth.uid`) and Supabase\'s `auth.uid()`.'},
  {id:'deploy-cloudflare-node-orm',p:['orm','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&(inc(a.orm,'Prisma')||inc(a.orm,'TypeORM')||inc(a.orm,'SQLAlchemy')),
   ja:'Cloudflare WorkersはNode.js互換でないEdge Runtimeです。Prisma/TypeORM/SQLAlchemyはEdge非対応のため`@prisma/client/edge`等の専用モードが必要です',
   en:'Cloudflare Workers runs on a non-Node.js Edge Runtime. Prisma/TypeORM/SQLAlchemy require Edge-specific modes — use `@prisma/client/edge` or Drizzle ORM',
   why_ja:'Cloudflare WorkersはV8 Isolate Edge Runtimeであり、Node.js固有API（`fs`/`net`等）が利用できません。PrismaはデフォルトクライアントがNode.js前提のため`@prisma/client/edge`インポートとNeon HTTP接続が必要です。TypeORMはEdge未対応。',
   why_en:'Cloudflare Workers runs on V8 Isolate Edge Runtime, lacking Node.js-specific APIs (`fs`/`net` etc.). Prisma\'s default client assumes Node.js — Workers requires the `@prisma/client/edge` import with Neon HTTP connections. TypeORM has no Edge support.'},
  // ── P26 Observability INFO (5) ──
  {id:'obs-cf-no-sdk-node',p:['backend','deploy'],lv:'info',
   t:a=>inc(a.deploy,'Cloudflare')&&isNodeBE(a),
   ja:'Cloudflare WorkersではNode.js用 `@opentelemetry/sdk-node` は動作しません。`@microlabs/otel-cf-workers` の `instrument()` ラッパーを使用してください',
   en:'`@opentelemetry/sdk-node` does not run in Cloudflare Workers (no Node.js runtime). Use `@microlabs/otel-cf-workers` with the `instrument()` wrapper instead',
   why_ja:'Cloudflare WorkersはV8 Isolateベースで `process`/`require` 等のNode.js APIが利用できません。`@opentelemetry/sdk-node` はNode.jsプロセス起動時に自動計装するため Workers では動作しません。',
   why_en:'Cloudflare Workers runs on V8 Isolate without Node.js APIs (`process`/`require` etc.). `@opentelemetry/sdk-node` auto-instruments at Node.js process startup and cannot run in Workers.'},
  {id:'obs-vercel-otel',p:['deploy'],lv:'info',
   t:a=>inc(a.deploy,'Vercel'),
   ja:'Vercelでは `@vercel/otel` + `instrumentation.ts` の `registerOTel()` + `instrumentationHook: true` (next.config) が必要です',
   en:'Vercel requires `@vercel/otel` + `registerOTel()` in `instrumentation.ts` + `instrumentationHook: true` in next.config for OpenTelemetry',
   why_ja:'Vercelは独自のOTel統合パッケージ `@vercel/otel` を提供しており、Next.js App RouterのEdge/Node.js両ランタイムに対応しています。標準の `@opentelemetry/sdk-node` は使用できますが、`next.config.js` の `instrumentationHook: true` と `instrumentation.ts` の `registerOTel()` が必須です。',
   why_en:'Vercel provides its own OTel integration package `@vercel/otel` supporting both Edge and Node.js runtimes in Next.js App Router.'},
  {id:'obs-baas-limited',p:['backend','deploy'],lv:'info',
   t:a=>inc(a.backend,'Firebase')||inc(a.backend,'Supabase'),
   ja:'Firebase/Supabaseではサーバーサイドのカスタムトレースが制限されます。クライアントサイドの Speed Insights / Web Vitals と Cloud Logging / Supabase Logs の活用を推奨します',
   en:'Firebase/Supabase have limited server-side custom tracing. Use client-side Speed Insights/Web Vitals + Cloud Logging/Supabase Logs for observability',
   why_ja:'Firebase FunctionsやSupabase Edge Functionsはマネージド環境のため、OTelコレクターの直接デプロイやカスタムエクスポーターの設定が制限されています。',
   why_en:'Firebase Functions and Supabase Edge Functions are managed environments that restrict direct OTel collector deployment and custom exporter configuration.'},
  {id:'obs-py-structlog',p:['backend'],lv:'info',
   t:a=>isPyBE(a),
   ja:'PythonバックエンドにはStructlog + `opentelemetry-sdk` (pip) の組み合わせを推奨します。`[REDACTED]` プロセッサでPII自動マスキングを設定してください',
   en:'For Python backends, use structlog + `opentelemetry-sdk` (pip). Configure the `[REDACTED]` processor for automatic PII masking in logs',
   why_ja:'Pythonの標準`logging`モジュールはJSON構造化ログに対応していません。`structlog` はコンテキスト変数・プロセッサチェーン・JSONレンダラーをサポートし、`opentelemetry-sdk` と組み合わせることでOTelトレース連携 (trace_id/span_idの自動インジェクション) が可能になります。`mask_sensitive()` プロセッサを追加してemail/token等のPIIを `[REDACTED]` に置換することでGDPR/個人情報保護法への対応が容易になります。',
   why_en:'Python\'s standard `logging` module lacks JSON structured logging support. `structlog` provides context variables, processor chains, and JSON renderer, and when combined with `opentelemetry-sdk`, enables OTel trace correlation (automatic trace_id/span_id injection).'},
  {id:'obs-java-javaagent',p:['backend'],lv:'info',
   t:a=>inc(a.backend,'Spring')||inc(a.backend,'Java'),
   ja:'JavaバックエンドはOpenTelemetry Java Agentの JVMオプション (`-javaagent:opentelemetry-javaagent.jar`) によるゼロコード計装を推奨します',
   en:'Java backends should use the OpenTelemetry Java Agent JVM option (`-javaagent:opentelemetry-javaagent.jar`) for zero-code auto-instrumentation',
   why_ja:'OpenTelemetry Java Agentはバイトコード操作によりSpring Boot / Hibernate / JDBC / gRPC等を自動計装します。アプリケーションコードの変更なしに全てのHTTPリクエスト・DB呼び出し・外部APIコールが自動的にトレースされます。',
   why_en:'The OpenTelemetry Java Agent uses bytecode manipulation to auto-instrument Spring Boot / Hibernate / JDBC / gRPC and more — no application code changes needed. All HTTP requests, DB calls, and external API calls are automatically traced.'},
  // ── Phase C: Domain + Stack + Security + Performance (4 WARN + 10 INFO) ──
  {id:'dom-gaming-noauth',p:['purpose','auth'],lv:'warn',
   t:a=>/ゲーム|gaming|ゲーミング|オンラインゲーム|マルチプレイ/i.test(a.purpose||'')&&/(none|なし)/i.test(a.auth||'')&&(a.scale||'medium')!=='solo',
   ja:'ゲームプラットフォームで認証なし設定が検出されました。スコア改ざん・不正アクセス・チート対策のために認証を必ず実装してください',
   en:'Game platform detected with no-auth setting. Authentication is essential to prevent score tampering, unauthorized access, and cheating',
   fix:{f:'auth',s:'Supabase Auth'},
   why_ja:'ゲームプラットフォームでは認証なしのAPIが公開されると、スコア・アイテム・ランキングのデータが改ざんされるリスクがあります。JWT検証のないREST APIはチートツールからの不正リクエストを受け入れてしまいます。',
   why_en:'Game platforms with unauthenticated APIs expose scores, items, and leaderboards to tampering. REST APIs without JWT verification accept requests from cheating tools.'},
  {id:'dom-childcare-minors',p:['purpose','payment'],lv:'warn',
   t:a=>/保育|育児|childcare|子ども|子供|幼児|託児|nursery/i.test(a.purpose||'')&&a.payment&&!/(none|なし)/i.test(a.payment||'')&&!/(MFA|多要素|二要素|2FA)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo',
   ja:'子どもデータを扱うサービスで決済機能があるにもかかわらずMFAが未設定です。保護者アカウントへの不正アクセス防止のためMFAを実装してください',
   en:'Childcare service with payment has no MFA configured. Implement MFA to prevent unauthorized access to parent accounts handling child data',
   fixFn:function(a){return {f:'mvp_features',s:(a.mvp_features||'')+(a.mvp_features?', ':'')+'MFA（多要素認証）'};},
   why_ja:'保育・育児サービスでは保護者の個人情報・決済情報・子どもの健康記録が集積されます。不正アクセスによる個人情報漏洩はPII保護法・児童オンラインプライバシー保護（COPPA類似規制）への違反となり得ます。',
   why_en:'Childcare services aggregate parent PII, payment information, and child health records. Unauthorized access resulting in data breaches may violate PII protection laws and COPPA-like child privacy regulations.'},
  {id:'dom-cybersec-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>/セキュリティ.*SOC|SOC.*セキュリティ|脅威.*インテリジェンス|脆弱性.*スキャン|サイバー.*セキュリティ|DevSecOps|cybersec|threat.*intel/i.test(a.purpose||'')&&!/(AuditLog|SecurityEvent|VulnScan|RemediationTask|ThreatIndicator|Playbook)/i.test(a.data_entities||'')&&(a.scale||'medium')!=='solo',
   ja:'セキュリティ/SOCプラットフォームで監査ログ・セキュリティイベントエンティティが未定義です。AuditLog または SecurityEvent を必ず含めてください',
   en:'Security/SOC platform without audit log or security event entities. AuditLog or SecurityEvent must be included for compliance and incident tracing',
   fixFn:function(a){return {f:'data_entities',s:(a.data_entities||'')+(a.data_entities?', ':'')+'AuditLog, SecurityEvent'};},
   why_ja:'セキュリティ運用センター(SOC)や脅威インテリジェンスプラットフォームでは、インシデント対応・コンプライアンス証跡のために全操作のログ記録が必須です。',
   why_en:'SOC and threat intelligence platforms require comprehensive operation logging for incident response and compliance audit trails.'},
  {id:'sec-sensitive-entity-norls',p:['backend','data_entities'],lv:'warn',
   t:a=>inc(a.backend,'Supabase')&&/(MedicalRecord|HealthLog|ClinicalTrial|PatientData|PersonalHealth|BiometricData)/i.test(a.data_entities||'')&&!(a.org_model&&a.org_model.length>0)&&(a.scale||'medium')!=='solo',
   ja:'Supabaseバックエンドで医療・健康の機密エンティティが検出されましたが組織モデルが未設定です。Row Level Security (RLS) の設定を確認してください',
   en:'Supabase backend with sensitive medical/health entities detected, but org_model is unset. Verify Row Level Security (RLS) configuration',
   fix:{f:'org_model',s:'マルチテナント(RLS)'},
   why_ja:'SupabaseはデフォルトでRLSが無効のため、テーブルへのアクセス制御を明示的に設定しないとすべてのデータが公開状態になります。',
   why_en:'Supabase has RLS disabled by default, so without explicit table access control policies, all data becomes publicly accessible. Medical entities like MedicalRecord fall under HIPAA and privacy law regulations.'},
  {id:'dom-logistics-nopay',p:['purpose'],lv:'info',
   t:a=>/(配送|物流|ロジスティクス|デリバリー|配達|運送|フリート|fleet|logistics|delivery)/i.test(a.purpose||'')&&(!a.payment||/(none|なし)/i.test(a.payment||''))&&(a.scale||'medium')!=='solo',
   ja:'物流・配送サービスで決済機能が未設定です。配送料・代引き・サブスク配送など課金モデルの検討を推奨します',
   en:'Logistics/delivery service without payment configured. Consider monetization via delivery fees, COD, or subscription delivery models',
   why_ja:'物流・配送プラットフォームでは配送料徴収・代引き(COD)・月額サブスクリプション等の収益化モデルが一般的です。Stripeの Connect APIを使うとマーケットプレイス型の手数料分配も実現できます。',
   why_en:'Logistics/delivery platforms commonly monetize via delivery fee collection, cash-on-delivery (COD), or monthly subscription models. Stripe Connect API also enables marketplace-style fee splitting.'},
  {id:'dom-health-mobile-noencrypt',p:['purpose','mobile'],lv:'info',
   t:a=>/(健康|health|フィットネス|ウェルネス|wellness|医療|患者|診察)/i.test(a.purpose||'')&&inc(a.mobile,'Expo')&&(a.scale||'medium')!=='solo',
   ja:'健康・医療アプリでモバイルが有効です。端末内の健康データ保存には expo-secure-store の使用と転送時TLS強制を確認してください',
   en:'Health/medical app with mobile enabled. Use expo-secure-store for on-device health data storage and enforce TLS for data in transit',
   why_ja:'HealthKit / Google Fit連携データや生体情報はデバイスローカルに保存される場合があります。React Native / Expoでは `AsyncStorage` はプレーンテキスト保存のためPII保護に不適切です。',
   why_en:'HealthKit/Google Fit data and biometrics may be stored locally on device. In React Native/Expo, `AsyncStorage` stores plain text and is unsuitable for PII protection.'},
  {id:'dom-rpa-nomonitor',p:['purpose'],lv:'info',
   t:a=>/(RPA|自動化.*ボット|ボット.*自動化|automation.*bot|bot.*automation|ワークフロー.*自動化|バッチ.*自動化)/i.test(a.purpose||'')&&!/(監視|モニタリング|monitor|alert|アラート|ログ.*収集)/i.test((a.mvp_features||'')+(a.purpose||''))&&(a.scale||'medium')!=='solo',
   ja:'RPA・自動化プラットフォームで実行監視・アラート機能が未設定です。ジョブ失敗の早期検知のためロギングと死活監視を追加してください',
   en:'RPA/automation platform without execution monitoring or alert features. Add logging and health monitoring for early detection of job failures',
   why_ja:'RPAボットや自動化ジョブは無人実行のため、失敗時の検知が遅れるとビジネス影響が大きくなります。最低限: 実行ログDB記録・失敗時Slack/Email通知・cronジョブの死活確認(heartbeat check)を実装してください。',
   why_en:'RPA bots and automation jobs run unattended, so delayed failure detection has large business impact. At minimum, implement: execution log DB recording, Slack/email notification on failure, and cron job heartbeat checks.'},
  {id:'be-firebase-stripe-webhook',p:['backend','payment'],lv:'info',
   t:a=>inc(a.backend,'Firebase')&&a.payment&&!/(none|なし)/i.test(a.payment||''),
   ja:'FirebaseバックエンドでStripe等の決済が設定されています。Webhook受信には Firebase Cloud Functions が必要です。署名検証と冪等性の実装を確認してください',
   en:'Firebase backend with payment configured. Stripe webhooks require Firebase Cloud Functions. Ensure signature verification and idempotency implementation',
   why_ja:'Firebase Hostingは静的ホスティングのためStripe Webhookのエンドポイントを直接ホストできません。',
   why_en:'Firebase Hosting is static hosting and cannot directly host Stripe webhook endpoints.'},
  {id:'mob-expo-websocket',p:['mobile','purpose'],lv:'info',
   t:a=>inc(a.mobile,'Expo')&&/(リアルタイム|real.?time|チャット|chat|ライブ|live|push.*通知|通知.*配信)/i.test(a.purpose||'')&&(a.scale||'medium')!=='solo',
   ja:'ExpoモバイルアプリでリアルタイムやPush通知を扱っています。WebSocket管理には `socket.io-client`、Push通知には `expo-notifications` の実装を確認してください',
   en:'Expo mobile app with real-time or push notification features. Use `socket.io-client` for WebSocket and `expo-notifications` for push notifications',
   why_ja:'React Native / ExpoのデフォルトのfetchAPIは双方向通信をサポートしません。WebSocketには `socket.io-client`（Socket.IO対応バックエンド）または `ws`モジュールを使用し、Expo managed workflowでのBackground Fetchには `expo-background-fetch` が必要です。',
   why_en:'React Native/Expo\'s default fetch API does not support bidirectional communication. Use `socket.io-client` (for Socket.IO backends) or the `ws` module for WebSocket, and `expo-background-fetch` for Background Fetch in Expo managed workflow.'},
  {id:'be-express-nosecurity-headers',p:['backend'],lv:'info',
   t:a=>inc(a.backend,'Express')&&(a.scale||'medium')!=='solo',
   ja:'ExpressバックエンドではHelmet.jsによるセキュリティヘッダー設定を推奨します (`X-Frame-Options`, `Content-Security-Policy`, `HSTS`)',
   en:'Express backend: Helmet.js is recommended for security headers (`X-Frame-Options`, `Content-Security-Policy`, `HSTS`)',
   why_ja:'Node.js Expressはデフォルトでセキュリティ関連HTTPヘッダーを送信しません。`helmet()` ミドルウェアを追加するだけで XSS/Clickjacking/MIME-Sniffing対策の15種類のヘッダーが自動設定されます。`app.use(helmet())` を全ルートの前に一行追加することで対応できます。',
   why_en:'Node.js Express does not send security-related HTTP headers by default. Adding the `helmet()` middleware automatically sets 15 types of headers for XSS/Clickjacking/MIME-Sniffing protection. A single line `app.use(helmet())` before all routes is sufficient.'},
  {id:'sec-mobile-biometric',p:['mobile','payment'],lv:'info',
   t:a=>inc(a.mobile,'Expo')&&a.payment&&!/(none|なし)/i.test(a.payment||'')&&(a.scale||'medium')!=='solo',
   ja:'Expoモバイルアプリで決済機能があります。生体認証 (`expo-local-authentication`) による取引確認フローの追加を検討してください',
   en:'Expo mobile app with payment: consider adding biometric authentication (`expo-local-authentication`) for transaction confirmation flow',
   why_ja:'モバイル決済アプリでは生体認証（指紋・Face ID）による取引確認が標準的なUXとなっています。`expo-local-authentication` の `authenticateAsync()` を決済確定前に呼び出すことで、端末紛失時の不正決済リスクを低減できます。',
   why_en:'Biometric authentication (fingerprint, Face ID) for transaction confirmation has become standard UX in mobile payment apps.'},
  {id:'perf-realtime-noredis',p:['backend','purpose'],lv:'info',
   t:a=>isNodeBE(a)&&/(リアルタイム|real.?time|WebSocket|チャット|chat|通知.*配信)/i.test(a.purpose||'')&&!/Redis/.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo',
   ja:'Node.jsバックエンドでリアルタイム機能があります。複数インスタンス間のWebSocket同期にはRedis Pub/Sub (ioredis + Socket.IO adapter) の導入を検討してください',
   en:'Node.js backend with real-time features: consider Redis Pub/Sub (ioredis + Socket.IO adapter) for WebSocket synchronization across multiple instances',
   why_ja:'Node.jsプロセスが複数インスタンス起動（水平スケール）されると、インスタンスをまたぐWebSocketメッセージのブロードキャストができなくなります。',
   why_en:'When Node.js processes run across multiple instances (horizontal scaling), broadcasting WebSocket messages across instances becomes impossible. Using `@socket.io/redis-adapter` + `ioredis` leverages Redis as a message bus for broadcasting to all instances.'},
  {id:'perf-mobile-offline',p:['mobile','purpose'],lv:'info',
   t:a=>inc(a.mobile,'Expo')&&/(配送.*現場|物流.*現場|農業.*現場|医療.*現場|製造.*現場|フィールド|field.?service|現場作業)/i.test(a.purpose||'')&&!/offline|オフライン/.test((a.mvp_features||'')+(a.purpose||''))&&(a.scale||'medium')!=='solo',
   ja:'フィールドサービス向けモバイルアプリです。電波不安定環境を考慮したオフラインファーストアーキテクチャ (`@react-native-community/netinfo` + ローカルDB) の検討を推奨します',
   en:'Field service mobile app: consider offline-first architecture (`@react-native-community/netinfo` + local DB) for environments with poor connectivity',
   why_ja:'物流配達員・農業現場・医療訪問・製造フロア等では電波が不安定な環境が多く、オンライン必須のアプリは作業中断リスクがあります。',
   why_en:'Logistics delivery workers, agricultural sites, medical home visits, and manufacturing floors often have unstable connectivity. Online-only apps risk work interruption.'},
  {id:'be-batch-serverless',p:['data_entities','deploy'],lv:'info',
   t:a=>/(DataPipeline|ETLJob|BatchJob|PipelineRun|BatchRun)/i.test(a.data_entities||'')&&/(Vercel|Firebase Hosting)/i.test(a.deploy||'')&&(a.scale||'medium')!=='solo',
   ja:'バッチ/ETLエンティティがサーバーレス環境にデプロイされています。Vercel/Firebase Hostingのサーバーレス関数はタイムアウト制限があります。長時間バッチには Railway/Cloud Run への移行を検討してください',
   en:'Batch/ETL entities deployed on serverless (Vercel/Firebase Hosting). Serverless function timeout limits apply. Consider Railway/Cloud Run for long-running batch jobs',
   why_ja:'VercelのEdge Functionsは最大25秒、Serverless Functionsは最大60秒（Pro）のタイムアウト制限があります。Firebase Functionsも最大540秒です。大容量データのETL処理や長時間バッチジョブは制限内に収まらない可能性があります。',
   why_en:'Vercel Edge Functions have a max 25s timeout; Serverless Functions up to 60s (Pro). Firebase Functions max 540s. Large-scale ETL processing and long-running batch jobs may exceed these limits.'},
  // ── ext11: IoT (2 WARN) ──
  {id:'iot-nomqtt',p:['purpose','backend'],lv:'warn',
   t:a=>/(IoTセンサーデータ.*収集|IoT.*センサーデータ.*収集|sensor.*data.*collect)/i.test(a.purpose||'')&&(isNodeBE(a)||isPyBE(a))&&!/(MQTT|WebSocket|リアルタイム|real.?time|SSE|Server.Sent)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo',
   ja:'IoTセンサープラットフォームです。センサーデータの低遅延リアルタイム収集にはMQTT・WebSocket・SSEプロトコルの採用を推奨します',
   en:'IoT sensor platform detected. Recommend MQTT, WebSocket, or SSE for low-latency real-time sensor data collection',
   why_ja:'HTTPポーリングでIoTセンサーデータを収集すると、ポーリング間隔分の遅延とサーバー負荷が発生します。MQTTはバイナリ軽量プロトコル（パケット最小2バイト）でTCP上の双方向通信が可能です。',
   why_en:'HTTP polling for IoT sensor data causes polling-interval delays and server load spikes. MQTT is a lightweight binary protocol (minimum 2-byte packet) supporting bidirectional TCP communication.'},
  {id:'iot-edge-note',p:['purpose','deploy'],lv:'warn',
   t:a=>/(IoTセンサー|IoT.*センサー|センサーデータ.*収集)/i.test(a.purpose||'')&&/(Vercel|Netlify|Firebase Hosting)/i.test(a.deploy||'')&&(a.scale||'medium')==='large',
   ja:'大規模IoTセンサープラットフォームがサーバーレス環境にデプロイされています。エッジコンピューティング（Cloudflare Workers / AWS IoT Greengrass）との組み合わせでレイテンシ削減を検討してください',
   en:'Large-scale IoT sensor platform on serverless deployment. Consider edge computing (Cloudflare Workers / AWS IoT Greengrass) to reduce latency',
   why_ja:'大量センサーデータを全て中央サーバーで処理すると、回線帯域・処理遅延・コストが問題になります。エッジコンピューティングでは現場側（IoTゲートウェイ）で前処理・フィルタリングを行い、必要なデータのみクラウドに送信します。',
   why_en:'Processing all sensor data centrally creates bandwidth, latency, and cost issues at scale. Edge computing pre-processes and filters data at the field (IoT gateway) and sends only relevant data to the cloud.'},
  // ── ext11: Web3 (2 WARN) ──
  {id:'web3-nowalletauth',p:['purpose','auth'],lv:'warn',
   t:a=>/(NFT|ブロックチェーン|blockchain|web3|仮想通貨|crypto|DeFi|decentrali)/i.test(a.purpose||'')&&!/(wallet|ウォレット|MetaMask|WalletConnect|web3.auth|Privy|RainbowKit)/i.test((a.auth||'')+(a.mvp_features||'')),
   ja:'Web3/NFTプロジェクトです。ユーザー認証にウォレット接続（MetaMask/WalletConnect/Privy等）の統合を推奨します',
   en:'Web3/NFT project detected. Recommend integrating wallet authentication (MetaMask/WalletConnect/Privy etc.)',
   why_ja:'Web3アプリでメール/パスワード認証のみを使うと「Web2の認証をWeb3に貼り付けた」設計になります。ブロックチェーンウォレット認証（EIP-4361 SIWE: Sign-In With Ethereum）はユーザーが秘密鍵を管理し、中央サーバーに認証情報を預けないセキュアな設計です。',
   why_en:'Using only email/password auth in a Web3 app means "Web2 auth pasted onto Web3" architecture. Blockchain wallet authentication (EIP-4361 SIWE: Sign-In With Ethereum) gives users key control without storing credentials on a central server.'},
  {id:'web3-audit-note',p:['purpose','backend'],lv:'warn',
   t:a=>/(スマートコントラクト|smart.?contract|Solidity|EVM|Hardhat|Foundry)/i.test(a.purpose||'')&&!/(audit|セキュリティ審査|コントラクト検査|contract.*audit|スマコン.*検査)/i.test(a.mvp_features||''),
   ja:'スマートコントラクト開発が含まれています。デプロイ前にCertik・OpenZeppelin等によるスマートコントラクトのセキュリティ監査を計画してください',
   en:'Smart contract development detected. Plan a security audit (Certik, OpenZeppelin, etc.) before deployment',
   why_ja:'スマートコントラクトは一度デプロイすると変更できません。The DAO事件（2016年、約60億円）やPoly Network事件（2021年、約700億円）のように、コントラクトの脆弱性は壊滅的な被害をもたらします。',
   why_en:'Smart contracts are immutable once deployed. Vulnerabilities cause catastrophic damage — like The DAO hack (2016, ~$60M) and Poly Network (2021, ~$600M).'},
  // ── ext11: Fleet (2 INFO) ──
  {id:'fleet-notelemetry',p:['purpose','data_entities'],lv:'info',
   t:a=>/(配車|fleet|フリート|車両管理|配送.*フリート|truck.*dispatch)/i.test(a.purpose||'')&&/(FleetVehicle|Vehicle)/i.test(a.data_entities||'')&&!/(GPS|位置情報|テレメトリ|telemetry|リアルタイム.*追跡|live.*track)/i.test((a.mvp_features||'')+(a.data_entities||''))&&(a.scale||'medium')==='large',
   ja:'大規模フリート管理システムです。車両のリアルタイムGPS追跡・テレメトリデータ収集の実装を検討してください（MQTT + GeoJSON + PostGIS推奨）',
   en:'Large-scale fleet management system. Consider implementing real-time GPS tracking and telemetry data collection (MQTT + GeoJSON + PostGIS recommended)',
   why_ja:'リアルタイムGPS追跡なしでは、ドライバーの現在位置確認や突発的な再配車ができません。PostGIS（PostgreSQL地理空間拡張）+ ST_Within()クエリで「半径2km以内の空き車両を検索」が可能になります。',
   why_en:'Without real-time GPS tracking, you cannot verify driver locations or handle dynamic re-routing. PostGIS (PostgreSQL geospatial extension) + ST_Within() queries enable "find available vehicles within 2km radius".'},
  {id:'fleet-nodriver-hours',p:['purpose','data_entities'],lv:'info',
   t:a=>/(配車|fleet|フリート|ドライバー管理|driver.*manag)/i.test(a.purpose||'')&&/(FleetDriver|Driver)/i.test(a.data_entities||'')&&!/(拘束時間|運転時間|労働時間.*コンプライアンス|driver.hours|HOS|hours.of.service)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模フリート管理でドライバーエンティティが含まれています。運送業の拘束時間・運転時間規制（改善基準告示）対応の実装を検討してください',
   en:'Large-scale fleet system with driver entity. Consider implementing driver hours compliance tracking (transport regulations / HOS rules)',
   why_ja:'日本の「改善基準告示」では、ドライバーの1日拘束時間は最大16時間、連続運転は4時間以内と規定されています。違反すると運行停止・免許停止のリスクがあります。',
   why_en:'Transport regulations (HOS rules in the US, Japanese Kaizen Standards) limit driver working hours (e.g., max 11-hour driving time, 14-hour on-duty limit in the US). Violations risk operational suspensions and fines.'},
  // ── ext11: Clinical/LIMS (2 WARN) ──
  {id:'lims-nochain-custody',p:['purpose','data_entities'],lv:'warn',
   t:a=>/(LIMS|検体.*管理|検体.*追跡|laboratory.*info|lab.*info)/i.test(a.purpose||'')&&/(LIMSSample|Sample|Specimen)/i.test(a.data_entities||'')&&!/(CustodyLog|ChainOfCustody|検体移送|移送記録|SampleTransfer)/i.test(a.data_entities||'')&&(a.scale||'medium')==='large',
   ja:'大規模LIMSに検体追跡があります。規制対応（GLP/GMP）に必要な検体チェーン・オブ・カストディ（移送記録）エンティティの実装を推奨します',
   en:'Large-scale LIMS with sample tracking. Recommend implementing chain-of-custody entity for regulatory compliance (GLP/GMP)',
   why_ja:'GLP（Good Laboratory Practice）規制では検体の取扱いにおける移送・保管・処理の全記録が要求されます。各ステップで「誰が・いつ・どこで」検体を扱ったかをCustodyLogエンティティに記録し、改ざん防止のためimmutableログ（追記のみ）として設計してください。',
   why_en:'GLP (Good Laboratory Practice) regulations require complete records of sample handling — transport, storage, and processing. Record "who, when, where" for each step in a CustodyLog entity, and design it as immutable (append-only) to prevent tampering.'},
  {id:'lims-noregulation',p:['purpose','backend'],lv:'warn',
   t:a=>/(LIMS|検査.*機関|臨床.*検査|medical.*lab|clinical.*lab)/i.test(a.purpose||'')&&!/(PMDA|GxP|GLP|GMP|FDA.*21CFR|ISO.*13485|CLIA)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模医療・検査機関向けLIMSです。PMDA/FDA/ISO 13485等の規制対応要件（バリデーション・電子記録・監査証跡）を設計書に明記することを推奨します',
   en:'Large-scale medical lab LIMS detected. Recommend explicitly documenting regulatory compliance requirements (PMDA/FDA/ISO 13485 validation, electronic records, audit trail)',
   why_ja:'医療診断機器に接続するLIMSや臨床検査システムはPMDA（日本）・FDA 21 CFR Part 11（米国）規制の対象になります。「バリデーション計画書」「IQ/OQ/PQプロトコル」「電子署名規定」の整備が必要です。',
   why_en:'LIMS connected to medical diagnostics fall under PMDA (Japan) or FDA 21 CFR Part 11 (US) regulations. You must prepare Validation Plans, IQ/OQ/PQ protocols, and Electronic Signature specifications.'},
  // ── ext11: POS (2 WARN) ──
  {id:'pos-nopayment',p:['purpose'],lv:'warn',
   t:a=>/(クラウドPOS|\bPOS\b|レジシステム|レジ専用|point.of.sale)/i.test(a.purpose||'')&&(!a.payment||/なし|None|none/i.test(a.payment)),
   ja:'POSシステムに決済処理が設定されていません。Stripe Terminal / Square API 等の統合を検討してください',
   en:'POS system without payment configuration. Consider integrating Stripe Terminal or Square API for payment processing',
   why_ja:'POSシステムの核心機能は「決済処理」です。Stripe Terminalはクレジット/ICカード/電子マネーをAPIで統合でき、stripe-terminal-jsで実機カードリーダーとも接続できます。Square APIは中小小売向けに特化し、日本市場ではカフェ・レストランで普及しています。',
   why_en:'The core function of a POS system is payment processing. Stripe Terminal integrates credit/IC cards/e-money via API and connects to physical card readers via stripe-terminal-js. Square API specializes in SMB retail and is popular in Japan for cafes and restaurants.'},
  {id:'pos-noinventory',p:['purpose'],lv:'warn',
   t:a=>/(クラウドPOS|\bPOS\b|レジシステム|レジ専用|point.of.sale)/i.test(a.purpose||'')&&!/(StockItem|Inventory|在庫|POSInventory|ProductStock)/i.test((a.data_entities||'')+(a.mvp_features||'')),
   ja:'POSシステムに在庫管理エンティティが見当たりません。StockItem/Inventoryエンティティを追加して売上連動の在庫自動更新を実装することを推奨します',
   en:'POS system missing inventory management entity. Recommend adding StockItem/Inventory entity for automatic inventory updates linked to sales',
   why_ja:'POSで商品を販売するたびに在庫を自動デクリメントしないと、実在庫と帳簿在庫が乖離します。トランザクション処理（BEGIN/COMMIT）でSaleTransactionとStockItem.quantityを原子的に更新し、在庫0になったら販売停止アラートを送る設計が必須です。',
   why_en:'Without automatic inventory decrement on each POS sale, physical stock and book inventory diverge. Use transactions (BEGIN/COMMIT) to atomically update SaleTransaction and StockItem.quantity, with an alert when stock hits 0.'},
  // ── ext11: Event (1 WARN) ──
  {id:'event-capacity',p:['purpose','data_entities'],lv:'warn',
   t:a=>/(チケット販売|event.*ticket|ticket.*platform|ticketing|チケット.*購入)/i.test(a.purpose||'')&&/(EventTicket|Ticket)/i.test(a.data_entities||'')&&!/(TicketTier|TicketType|Capacity|SeatMap|座席|SeatPlan)/i.test(a.data_entities||'')&&(a.scale||'medium')!=='solo',
   ja:'イベントチケットプラットフォームですが、座席ティア・定員管理エンティティが見当たりません。TicketTier/SeatMapエンティティで販売可能枚数と座席種別を管理することを推奨します',
   en:'Event ticketing platform missing seat tier/capacity entity. Recommend TicketTier/SeatMap entity to manage ticket quotas and seat categories',
   why_ja:'定員管理なしのチケット販売では「定員オーバーによる二重販売」が発生します。TicketTier.totalQtyとTicketTier.soldQtyを比較するチェックをトランザクション内で行い、SELECT ... FOR UPDATEでレース条件を防いでください。',
   why_en:'Ticket sales without capacity management risk overselling (double booking). Use a transaction with SELECT ... FOR UPDATE to compare TicketTier.totalQty vs TicketTier.soldQty.'},
  // ── ext11: Security (4 INFO) ──
  {id:'sec-rate-limit-api',p:['payment','backend'],lv:'info',
   t:a=>!/なし|None|none/i.test(a.payment||'none')&&isNodeBE(a)&&!/(rate.?limit|レート制限|throttl|express-rate-limit)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模決済機能付きNode.jsアプリです。express-rate-limit または @nestjs/throttler によるAPIレート制限の実装を推奨します',
   en:'Large-scale Node.js app with payment. Recommend implementing API rate limiting with express-rate-limit or @nestjs/throttler',
   why_ja:'レート制限なしの決済APIはカード番号総当たり攻撃（credential stuffing）やAPIコスト爆発のリスクがあります。express-rate-limitでIP単位に1分あたり最大リクエスト数を設定してください。',
   why_en:'Payment APIs without rate limiting risk credential stuffing attacks and API cost explosion. Set per-IP request limits with express-rate-limit. Configure payment endpoints especially strictly (e.g., /api/payment max 5/minute) and return 429 Too Many Requests on excess.'},
  {id:'sec-csrf-spa',p:['frontend','backend','auth'],lv:'info',
   t:a=>/(React|Next\.js|Vue|Angular|Svelte)/i.test(a.frontend||'')&&isNodeBE(a)&&/(session|cookie.*auth|Cookie.based|セッション.*認証)/i.test(a.auth||'')&&!/(CSRF|csrf.?token|Double Submit Cookie|SameSite)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模SPAでセッション/Cookie認証を使用しています。CSRF保護（csurf / SameSite Cookieポリシー / Double Submit Cookie）の実装を推奨します',
   en:'Large-scale SPA using session/cookie authentication. Recommend CSRF protection (csurf / SameSite Cookie policy / Double Submit Cookie)',
   why_ja:'Cookie認証のSPAでCSRF保護がない場合、攻撃者が悪意あるサイトにユーザーを誘導し、そのユーザーのセッションで不正リクエストを実行できます（CSRF攻撃）。expressではcsurfミドルウェア、またはCookieにSameSite=Strictを設定することで防御できます。',
   why_en:'SPAs using Cookie authentication without CSRF protection allow attackers to trick users into visiting malicious sites and execute unauthorized requests using their session (CSRF attack).'},
  {id:'sec-dep-scan',p:['backend'],lv:'info',
   t:a=>isNodeBE(a)&&!/(Snyk|Dependabot|依存関係スキャン|dependency.*scan|脆弱性スキャン|audit.*npm|npm.*audit)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模Node.jsアプリです。Snyk / GitHub Dependabot等による依存パッケージの脆弱性スキャンをCI/CDパイプラインに組み込むことを推奨します',
   en:'Large-scale Node.js app. Recommend integrating dependency vulnerability scanning (Snyk / GitHub Dependabot) into your CI/CD pipeline',
   why_ja:'npmパッケージのサプライチェーン攻撃（例: 2021年のua-parser-js事件）では、広く使われるパッケージに悪意あるコードが埋め込まれます。npm auditをCI/CDに組み込み、Snyk（無料プランあり）で既知CVEを自動検出してください。',
   why_en:'npm package supply chain attacks (e.g., the 2021 ua-parser-js incident) embed malicious code in widely-used packages. Integrate npm audit into CI/CD and use Snyk (free plan available) for automatic CVE detection.'},
  {id:'sec-audit-trail-large',p:['data_entities','backend'],lv:'info',
   t:a=>a.data_entities.split(',').length>=8&&isNodeBE(a)&&!/(AuditLog|AuditTrail|ActivityLog|ChangeLog|EventLog)/i.test(a.data_entities||'')&&(a.scale||'medium')==='large',
   ja:'大規模アプリ（エンティティ8+）でAuditLogエンティティが見当たりません。本番運用の障害解析・コンプライアンス対応に重要なAuditTrailエンティティの実装を推奨します',
   en:'Large-scale app (8+ entities) without AuditLog entity. Recommend implementing AuditTrail entity for production incident analysis and compliance',
   why_ja:'「誰が・いつ・何を変更したか」を記録するAuditLogは、本番障害の原因特定・コンプライアンス監査・不正アクセス調査に不可欠です。Prismaでは$transactionと組み合わせ、各更新操作後にAuditLogレコードを自動生成するミドルウェアパターンが効果的です。',
   why_en:'AuditLog recording "who, when, what changed" is essential for production incident root cause analysis, compliance audits, and unauthorized access investigations.'},
  // ── ext11: Performance (3 INFO) ──
  {id:'perf-db-noindex',p:['data_entities','database'],lv:'info',
   t:a=>a.data_entities.split(',').length>=7&&/(PostgreSQL|Supabase|MySQL)/i.test(a.database||'')&&!/(インデックス|index.*最適化|index.*tuning|db.*index|クエリ最適化)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模アプリ（エンティティ7+）でインデックス設計の記述がありません。主要検索フィールドへのDBインデックス設計（EXPLAIN ANALYZEによる最適化）を推奨します',
   en:'Large-scale app (7+ entities) without DB index design mention. Recommend index design on major search fields (optimize with EXPLAIN ANALYZE)',
   why_ja:'エンティティ数が7以上になると、外部キー・検索フィールド・ソートフィールドへのインデックスが重要になります。Prismaでは@@index([userId, createdAt])のような複合インデックスをschema.prismaに定義できます。',
   why_en:'With 7+ entities, indexes on foreign keys, search fields, and sort fields become critical. In Prisma, define composite indexes like @@index([userId, createdAt]) in schema.prisma.'},
  {id:'perf-cdn-media',p:['purpose','frontend'],lv:'info',
   t:a=>/(動画.*配信|動画.*スト[リー]|video.*stream|media.*delivery|メディア.*配信|配信.*プラットフォーム.*動画)/i.test(a.purpose||'')&&/(React|Vue|Next\.js|Svelte)/i.test(a.frontend||'')&&!/(CDN|CloudFront|Cloudflare|Cloudinary|Fastly)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模動画・メディア配信プラットフォームです。CDN（CloudFront / Cloudflare / Cloudinary）によるメディア配信最適化を設計に組み込むことを推奨します',
   en:'Large-scale video/media delivery platform. Recommend integrating CDN (CloudFront / Cloudflare / Cloudinary) for optimized media delivery',
   why_ja:'動画ファイルをオリジンサーバーから直接配信すると、帯域幅コストが膨大になり、地理的に遠いユーザーへの遅延も大きくなります。',
   why_en:'Serving video files directly from an origin server causes enormous bandwidth costs and high latency for geographically distant users.'},
  {id:'perf-cache-strategy',p:['backend','data_entities'],lv:'info',
   t:a=>isNodeBE(a)&&a.data_entities.split(',').length>=7&&!/(キャッシュ|Redis.*キャッシュ|cache.*strateg|in-memory.*cache|CDN.*cache)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'大規模Node.jsアプリ（エンティティ7+）でキャッシュ戦略の記述がありません。Redis（ioredis）によるAPIレスポンスキャッシュの実装を検討してください',
   en:'Large-scale Node.js app (7+ entities) without cache strategy mention. Consider implementing API response caching with Redis (ioredis)',
   why_ja:'エンティティ数7以上のAPIで全リクエストをDBに問い合わせると、DBコネクション枯渇・レスポンス遅延が発生します。Redisで頻繁に読まれる参照データ（商品カタログ、設定値）をキャッシュし、TTL（Time-To-Live）で自動失効させる設計が効果的です。',
   why_en:'Querying the DB for every request in an API with 7+ entities causes connection exhaustion and response delays. Cache frequently-read reference data (product catalogs, configuration) in Redis with TTL (Time-To-Live) for automatic expiration.'},
  // ── ext11: AI Safety (2 WARN) ──
  {id:'ai-model-drift',p:['ai_auto','data_entities'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return /(MLModel|TrainedModel|ModelVersion|ModelRegistry|ModelArtifact)/i.test(a.data_entities||'')&&!/(ドリフト|drift|モデル.*監視|model.*monitor|データ分布.*変化)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large';
   },
   ja:'AI/MLモデルエンティティが大規模AIシステムに存在しています。本番環境でのモデルドリフト検知・パフォーマンス監視（Langfuse / Evidently AI等）の実装を推奨します',
   en:'AI/ML model entity exists in large-scale AI system. Recommend implementing model drift detection and performance monitoring (Langfuse / Evidently AI etc.) for production',
   why_ja:'機械学習モデルは時間経過とともに入力データの分布が変化し（コンセプトドリフト）、精度が低下します。詐欺検知モデルは不正パターンの進化につれ性能が劣化し、未検知の不正が増加します。',
   why_en:'ML model accuracy degrades over time as input data distribution changes (concept drift). Fraud detection models lose performance as fraudulent patterns evolve, increasing missed detections.'},
  {id:'ai-canary-deploy',p:['ai_auto','deploy'],lv:'warn',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     return (a.scale||'medium')==='large'&&!/(カナリア|canary|blue.*green|feature.?flag|段階的.*ロールアウト|gradual.*rollout)/i.test(a.mvp_features||'');
   },
   ja:'大規模AIシステムです。本番AIモデル更新時のカナリアリリース・段階的ロールアウト・フィーチャーフラグ戦略の実装を推奨します',
   en:'Large-scale AI system. Recommend canary release, gradual rollout, and feature flag strategy for safe AI model updates in production',
   why_ja:'AIモデルの更新は「全ユーザーに即時切り替え」すると予期しない挙動の影響範囲が最大化します。カナリアリリースでは最初5%のトラフィックで新モデルをテストし、問題なければ段階的に拡大します。',
   why_en:'Switching all users to a new AI model simultaneously maximizes the impact of unexpected behavior. Canary releases test the new model on 5% of traffic first, then gradually expand if stable.'},
  // ── ext12: Bun/Deno/Runtime compat (4 WARN) ──
  {id:'bun-nestjs-compat',p:['backend'],lv:'warn',
   t:a=>inc(a.backend,'Bun + Hono')===false&&inc(a.backend,'Bun')&&(inc(a.backend,'NestJS')||inc(a.backend,'Express')),
   ja:'Bun RuntimeでNestJS/Expressを使用する場合、一部のNode.js固有APIで互換性の問題が発生する可能性があります。Hono + Bunの組み合わせを推奨します',
   en:'Running NestJS/Express on Bun Runtime may cause compatibility issues with some Node.js-specific APIs. Hono + Bun is recommended',
   why_ja:'BunはNode.js互換を目指していますが、NestJSが内部で使用するReflect Metadataのデコレータ実装が異なる場合があります。Hono + Bunは公式にサポートされており、ビルトインHTTPサーバーによるネイティブ速度を発揮できます。',
   why_en:'Bun targets Node.js compatibility but decorator implementations for Reflect Metadata used by NestJS may differ. Hono + Bun is officially supported and delivers native speed via its built-in HTTP server.'},
  {id:'deno-express-incompat',p:['backend'],lv:'warn',
   t:a=>inc(a.backend,'Deno')&&inc(a.backend,'Express'),
   ja:'DenoはNode.js互換モードでExpressを動かせますが、本番利用では非推奨です。Deno + Honoの使用を推奨します',
   en:'Deno can run Express in Node.js compat mode but it\'s not recommended for production. Use Deno + Hono instead',
   why_ja:'Expressはnpmパッケージです。Denoの`npm:`スコープで読み込めますが、Expressが依存する`http`モジュールのshimが完全ではないケースがあります。Hono(`jsr:@hono/hono`)はDenoでネイティブ動作し、型安全・JSR対応済みです。',
   why_en:'Express is an npm package loadable via Deno\'s `npm:` scope, but `http` module shims may be incomplete for production. Hono (`jsr:@hono/hono`) runs natively on Deno with type safety and JSR support.'},
  {id:'bun-docker-image',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Bun')&&(inc(a.deploy,'Docker')||inc(a.deploy,'Railway')||inc(a.deploy,'Fly.io')),
   ja:'Bun RuntimeをDockerで使用する場合、公式イメージ`oven/bun`の使用を推奨します。Node.js Dockerイメージでは最適なパフォーマンスが得られません',
   en:'When using Bun Runtime with Docker, use the official `oven/bun` image. Node.js Docker images won\'t deliver optimal Bun performance',
   why_ja:'`oven/bun`はBunのバイナリを直接含む公式Dockerイメージです。Node.jsイメージ上でBunをインストールする方法では、JavaScriptCoreエンジンの最適化が活かされません。',
   why_en:'`oven/bun` is the official Docker image with the Bun binary. Installing Bun on a Node.js image bypasses JavaScriptCore engine optimizations.'},
  {id:'deno-deploy-mismatch',p:['backend','deploy'],lv:'warn',
   t:a=>inc(a.backend,'Deno')&&(inc(a.deploy,'Railway')||inc(a.deploy,'Render')),
   ja:'Deno RuntimeはRailway/RenderではDockerコンテナとして動作させる必要があります。Deno Deployはネイティブ対応で推奨されます',
   en:'Deno Runtime on Railway/Render requires Docker container setup. Deno Deploy is natively supported and recommended',
   why_ja:'Railway/RenderはDenoをファーストクラスでサポートしていません。Deno Deploy（deno.com/deploy）はGitHub連携・V8エッジランタイムで即座にデプロイでき、管理コストがゼロです。',
   why_en:'Railway/Render don\'t natively support Deno. Deno Deploy (deno.com/deploy) provides instant GitHub-integrated V8 edge deployment with zero management cost.'},
  // ── ext12: DB + AI/Vector rules (3 INFO) ──
  {id:'db-pgvector-missing',p:['ai_auto'],lv:'info',
   t:a=>{
     if(!a.ai_auto||/なし|None/i.test(a.ai_auto))return false;
     const db=a.database||a.backend||'';
     if(!inc(db,'PostgreSQL')&&!inc(db,'Supabase'))return false;
     return !/(pgvector|vector.*search|ベクトル検索|semantic.*search|embedding)/i.test(a.mvp_features||'');
   },
   ja:'AI機能にPostgreSQLを使用しています。pgvector拡張機能によるベクトル類似度検索を追加することでRAG・セマンティック検索が実装できます',
   en:'Using PostgreSQL for AI features. Adding pgvector extension for vector similarity search enables RAG and semantic search',
   why_ja:'pgvectorはPostgreSQL内でベクトル埋め込みをネイティブに保存・検索できる拡張機能です。Supabaseでは`vecs`ライブラリで扱えます。外部ベクトルDBを追加しなくても既存PostgreSQLでRAGが実現できます。',
   why_en:'pgvector enables native vector embedding storage and similarity search in PostgreSQL. Supabase supports it via the `vecs` library. RAG can be implemented on existing PostgreSQL without adding external vector DBs.'},
  {id:'db-turso-drizzle',p:['database'],lv:'info',
   t:a=>inc(a.database,'Turso')&&!inc(a.orm,'Drizzle'),
   ja:'TursoはDrizzle ORMとの親和性が最高です。ORM選択でDrizzleへの変更を推奨します（公式libsqlドライバー対応）',
   en:'Turso works best with Drizzle ORM. Consider switching to Drizzle (official libsql driver support)',
   why_ja:'Drizzleは`drizzle-orm/libsql`アダプターでTursoに型安全なクエリを提供します。ローカルSQLite→本番Tursoへのシームレスな移行が可能です。',
   why_en:'Drizzle provides type-safe queries via `drizzle-orm/libsql` adapter with seamless migration from local SQLite to production Turso.'},
  {id:'db-d1-large-scale',p:['database'],lv:'info',
   t:a=>inc(a.database,'D1')&&(a.scale||'medium')==='large',
   ja:'Cloudflare D1は大規模スケールでの利用に制限があります（最大10GB）。高トラフィック・大容量にはNeon/TiDB Serverlessの検討を推奨します',
   en:'Cloudflare D1 has limitations (max 10GB) for large-scale usage. Consider Neon/TiDB Serverless for high-traffic workloads',
   why_ja:'D1は1DB最大10GB（2024年時点）、単一ライターによるグローバル非同期レプリケーション型です。大規模SaaSでは書き込みスループットが律速になります。NeonはPostgreSQL互換で読み書き分離・自動スケーリングを提供します。',
   why_en:'D1 supports up to 10GB per database with single-writer global async replication. Write throughput becomes a bottleneck for large SaaS. Neon provides PostgreSQL-compatible read/write separation with autoscaling.'},
  // ── ext12: CSS/DevMethod/Mobile-Pay rules (4 INFO + 4 WARN in header) ──
  {id:'css-expo-tailwind',p:['css_fw','mobile'],lv:'info',
   t:a=>inc(a.mobile,'Expo')&&inc(a.css_fw,'Tailwind'),
   ja:'ExpoでTailwindを使用する場合、NativeWindライブラリが必要です（TailwindクラスをReact Nativeスタイルに変換）',
   en:'Using Tailwind with Expo requires NativeWind (converts Tailwind classes to React Native styles)',
   why_ja:'ブラウザ向けTailwindCSSはReact Nativeに直接適用できません。NativeWind v4はTailwindv4設定を読み込みRNの`StyleSheet`に変換するバベルプラグインです。`expo install nativewind`でセットアップしてください。',
   why_en:'Browser-targeted Tailwind CSS cannot be applied to React Native directly. NativeWind v4 reads Tailwind v4 config and converts to RN `StyleSheet` via Babel plugin. Set up with `expo install nativewind`.'},
  {id:'css-svelte-bootstrap',p:['css_fw','frontend'],lv:'info',
   t:a=>inc(a.frontend,'Svelte')&&inc(a.css_fw,'Bootstrap'),
   ja:'SvelteKitでBootstrapを使用する場合、BootstrapのJSコンポーネントがSvelteのリアクティビティと競合することがあります。Tailwind + skeleton UIを推奨します',
   en:'Bootstrap JS components may conflict with Svelte\'s reactivity. Tailwind + skeleton UI is recommended',
   why_ja:'Bootstrap v5のDropdown/ModalはVanilla JSベースでSvelteのリアクティビティシステムと競合するケースがあります。skeleton UIはSvelte公式サポートのUIフレームワークです。',
   why_en:'Bootstrap v5 Dropdown/Modal are Vanilla JS-based and may conflict with Svelte\'s reactivity system. skeleton UI has official Svelte support.'},
  {id:'method-ddd-no-repo',p:['dev_methods','backend'],lv:'info',
   t:a=>/(DDD|ドメイン駆動)/i.test(a.dev_methods||'')&&(inc(a.backend,'Express')||inc(a.backend,'Fastify')||inc(a.backend,'Hono'))&&!/(Repository|リポジトリ|Clean Architecture|クリーンアーキテクチャ)/i.test(a.mvp_features||''),
   ja:'DDD（ドメイン駆動設計）を選択し、軽量バックエンドを使用しています。Repositoryパターン・ドメイン層の分離を明示的に実装計画に含めることを推奨します',
   en:'DDD selected with a lightweight backend. Explicitly plan Repository pattern and domain layer separation for clean DDD implementation',
   why_ja:'DDD+Express/Fastify/Hono構成ではフレームワークがアーキテクチャを強制しないため、Repositoryパターン・UseCase層・ドメインサービスを手動で設計する必要があります。NestJS+デコレータを利用するとDDDパターンの実装が容易になります。',
   why_en:'DDD with Express/Fastify/Hono requires manually designing Repository, UseCase, and domain service layers since the framework provides no structure. NestJS + decorators simplifies DDD pattern implementation.'},
  {id:'method-ddd-simple',p:['dev_methods'],lv:'info',
   t:a=>{
     if(!/(DDD|ドメイン駆動)/i.test(a.dev_methods||''))return false;
     const ents=(a.data_entities||a.entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
     return ents.length>0&&ents.length<5;
   },
   ja:'DDD（ドメイン駆動設計）を選択していますが、エンティティ数が4件以下です。シンプルなシステムではDDDのオーバーヘッドが開発コストを増加させる場合があります',
   en:'DDD selected with fewer than 5 entities. For simple systems, DDD overhead may increase development cost',
   why_ja:'DDDは複雑なビジネスルールを持つ大規模システムで効果を発揮します。エンティティが4件以下のシンプルなCRUDアプリではリポジトリパターン・集約の定義コストが開発速度を下げます。TDD+SDDの組み合わせで十分な品質が得られます。',
   why_en:'DDD excels in large-scale systems with complex business rules. For simple CRUD apps with fewer than 5 entities, defining repositories and aggregates slows development. TDD + SDD delivers sufficient quality for small-scale projects.'},
  {id:'mob-stripe-native',p:['mobile','payment'],lv:'info',
   t:a=>inc(a.mobile,'Expo')&&a.payment&&!isNone(a.payment),
   ja:'ExpoアプリでStripe決済を実装する場合、`@stripe/stripe-react-native`の使用が必要です（WebビューのStripe.jsは非推奨）',
   en:'For Stripe payment in Expo apps, use `@stripe/stripe-react-native` (Stripe.js in WebView is not recommended)',
   why_ja:'Stripeは`@stripe/stripe-react-native`を公式提供しており、Apple Pay・Google Pay・カードフォームをネイティブUIで実装できます。WebViewでStripe.jsを使う方法はAppStore審査でリジェクトされるリスクがあります。',
   why_en:'Stripe officially provides `@stripe/stripe-react-native` with native UI for Apple Pay, Google Pay, and card forms. Using Stripe.js in WebView risks App Store rejection.'},
  // ── Phase D: Manufacturing/Medical/Education/FinTech/CrossLayer (2E+7W+6I) ──
  {id:'dom-manufacturing-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{var pur=a.purpose||'';var ents=a.data_entities||'';
    return /製造.*品質管理|製造.*プロセス管理|工場.*管理システム|生産.*品質.*検査/i.test(pur)&&!/AuditLog/.test(ents)&&(a.scale||'medium')==='large';},
   ja:'製造管理システム（大規模）で監査ログが未定義です。ISOや品質管理規格の証跡要件を満たすためAuditLogエンティティを追加してください',
   en:'Manufacturing management system (large scale) without AuditLog entity. Add AuditLog to meet ISO quality management traceability requirements',
   fixFn:function(a){return {f:'data_entities',s:(a.data_entities||'')+(a.data_entities?', ':'')+'AuditLog'};},
   why_ja:'ISO 9001・IATF 16949等の品質管理規格は製造工程の全変更操作に対して追跡可能な記録を求めます。AuditLogエンティティなしでは「いつ・誰が・何を変更したか」の追跡が困難となり、品質認証審査で指摘事項になります。',
   why_en:'Quality management standards like ISO 9001 and IATF 16949 require traceable records for all manufacturing process changes. Without an AuditLog entity, tracking "when/who/what changed" becomes difficult, leading to findings in quality certification audits.'},
  {id:'dom-manufacturing-noiot',p:['purpose'],lv:'info',
   t:a=>/工場.*設備.*監視|設備稼働.*監視|製造.*センサー?連携|OT.*IT.*統合|スマートファクトリー/i.test(a.purpose||'')&&!/(IoT|センサー?|MQTT|OPC-UA)/i.test((a.mvp_features||'')+(a.backend||''))&&(a.scale||'medium')!=='solo',
   ja:'スマートファクトリー・設備監視システムでIoT/センサー連携が未設定です。MQTT・OPC-UAなどのプロトコルの検討を推奨します',
   en:'Smart factory/equipment monitoring system without IoT/sensor integration. Consider protocols like MQTT or OPC-UA',
   why_ja:'工場の設備監視・スマートファクトリーシステムではPLC・センサー・OT機器とのデータ収集が中核機能です。',
   why_en:'Equipment monitoring and smart factory systems require data collection from PLCs, sensors, and OT devices as a core function.'},
  {id:'dom-medical-noencrypt',p:['purpose','data_entities'],lv:'error',
   t:a=>{var pur=a.purpose||'';var ents=a.data_entities||'';
    return /電子カルテ.*システム|EHR.*プラットフォーム|EMR.*システム|病院.*診療録.*管理|clinical.*records.*platform/i.test(pur)&&/(PatientRecord|MedicalRecord|ClinicalData|EHRRecord)/i.test(ents)&&!/(暗号化|encryption|AES|TDE|HIPAA|at.rest)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo';},
   ja:'電子カルテ・EHRシステムで患者レコードエンティティに対して暗号化設定が未確認です。HIPAA・個人情報保護法のデータ保護要件を満たすために暗号化を必ず実装してください',
   en:'EHR/clinical records system with patient record entities but no encryption configured. Encryption is required to meet HIPAA and privacy law data protection requirements',
   why_ja:'電子カルテ・EHRシステムは最高機密レベルの医療情報（診断・処方・検査結果）を扱います。HIPAA（米国）・個人情報保護法（日本）では保存データの暗号化（AES-256）と転送時のTLS 1.2+が要件です。',
   why_en:'EHR/clinical records systems handle the highest-confidentiality medical information (diagnoses, prescriptions, test results). HIPAA (US) and privacy laws (Japan) require encryption at rest (AES-256) and TLS 1.2+ in transit.'},
  {id:'dom-medical-noaudit',p:['purpose','data_entities'],lv:'warn',
   t:a=>{var pur=a.purpose||'';var ents=a.data_entities||'';
    return /電子カルテ|EHR|EMR|病院.*診療|クリニック.*管理.*システム|clinical.*management/i.test(pur)&&/(PatientRecord|MedicalRecord|ClinicalData|Prescription|Diagnosis)/i.test(ents)&&!/AuditLog/.test(ents)&&(a.scale||'medium')!=='solo';},
   ja:'電子カルテ・クリニック管理システムで監査ログが未定義です。医療情報システムでは操作ログの記録が法的要件となる場合があります',
   en:'EHR/clinic management system without AuditLog entity. Audit logging is often a legal requirement for medical information systems',
   fixFn:function(a){return {f:'data_entities',s:(a.data_entities||'')+(a.data_entities?', ':'')+'AuditLog'};},
   why_ja:'医療情報システムでは処方・診断・カルテ閲覧の全操作に対して厚生労働省の「医療情報システムの安全管理ガイドライン」が操作ログの保存を求めています。AuditLogには操作者・日時・操作種別・参照データ範囲を記録し、5〜10年保存することを推奨します。',
   why_en:'Ministry of Health guidelines require operation logs for all access to prescriptions, diagnoses, and medical records. AuditLog should record operator, timestamp, operation type, and data scope accessed, with 5-10 year retention.'},
  {id:'dom-education-nolti',p:['purpose'],lv:'info',
   t:a=>/学習管理システム|LMS.*プラットフォーム|eラーニング.*プラットフォーム|e-learning.*platform|learning.*management.*system/i.test(a.purpose||'')&&!/(LTI|SCORM|xAPI|AICC)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo',
   ja:'LMS・eラーニングプラットフォームでLTI/SCORM連携が未設定です。Canvas・Moodleなど既存LMSとの相互運用性のためLTI 1.3対応の検討を推奨します',
   en:'LMS/e-learning platform without LTI/SCORM integration. Consider LTI 1.3 support for interoperability with existing LMS like Canvas or Moodle',
   why_ja:'LMSプラットフォームが教育機関向けである場合、Canvas・Moodle・Blackboard等の既存LMSとのシステム統合要求が高い可能性があります。LTI 1.3標準に対応することで外部ツールとのSSO・グレード同期・コンテンツ共有が容易になります。',
   why_en:'When an LMS targets educational institutions, system integration requirements with existing LMS like Canvas, Moodle, and Blackboard are likely high. LTI 1.3 compliance enables SSO, grade sync, and content sharing with external tools.'},
  {id:'dom-fintech-no2fa',p:['purpose'],lv:'error',
   t:a=>/オンライン.*銀行.*システム|デジタル.*銀行.*プラットフォーム|証券.*取引.*システム|暗号資産.*取引所.*システム|digital.*banking.*platform|stock.*trading.*system/i.test(a.purpose||'')&&!/(MFA|2FA|多要素|二要素|TOTP|FIDO|WebAuthn)/i.test((a.auth||'')+(a.mvp_features||''))&&(a.scale||'medium')!=='solo',
   ja:'銀行・証券取引システムで多要素認証（MFA/2FA）が未設定です。金融業法・FISC安全対策基準ではMFAの実装が必須要件です',
   en:'Banking/securities trading system without MFA/2FA configured. MFA is mandatory under financial industry regulations and FISC security standards',
   why_ja:'金融庁ガイドライン・FISC安全対策基準・PCI DSS v4.0は銀行・証券システムのオンライン取引に対してMFA（多要素認証）を必須要件として規定しています。',
   why_en:'FSA guidelines, FISC security standards, and PCI DSS v4.0 mandate MFA for online transactions in banking and securities systems. Select appropriate MFA from three levels: TOTP (FIDO2/WebAuthn), hardware tokens, or SMS OTP (low-risk operations only).'},
  {id:'ai-medical-legal-noguard',p:['purpose','ai_auto'],lv:'warn',
   t:a=>{var ai=a.ai_auto||'';return ai&&!/(none|なし)/i.test(ai)&&/(医療.*AI.*診断|AI.*医療.*診断|法律.*AI.*判断|AI.*法律.*判断|medical.*AI.*diagnosis|legal.*AI.*decision)/i.test(a.purpose||'')&&!/(ガードレール|guardrail|HITL|human.in.the.loop|免責|disclaimer)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo';},
   ja:'AI医療診断・法律判断システムでガードレール（HITL/免責表示/ハルシネーション検知）が未設定です。AI Act・医療機器規制・弁護士法への準拠のため必ず実装してください',
   en:'AI medical diagnosis/legal decision system without guardrails (HITL/disclaimer/hallucination detection). Required for compliance with AI Act, medical device regulations, and legal practice laws',
   why_ja:'AI医療診断・法律判断はEU AI Act Annex III「高リスクAI」分類の対象となり、ヒトによる監視（HITL）・説明可能性・ハルシネーション検知が法的要件です。',
   why_en:'AI medical diagnosis and legal decision systems fall under EU AI Act Annex III "High-Risk AI" classification, requiring human oversight (HITL), explainability, and hallucination detection.'},
  {id:'fe-react-legacy-state',p:['frontend','mvp_features'],lv:'info',
   t:a=>inc(a.frontend,'React')&&/(Redux(?! Toolkit)|MobX)/i.test(a.mvp_features||''),
   ja:'ReactプロジェクトでRedux（非Toolkit）またはMobXが指定されています。React 18+ではZustand・Jotai・TanStack Queryの使用でボイラープレートを大幅に削減できます',
   en:'React project with legacy Redux (non-Toolkit) or MobX. For React 18+, Zustand, Jotai, or TanStack Query can significantly reduce boilerplate',
   why_ja:'React 18+ではServerComponents・Suspense・use()フックにより状態管理の境界が変化しています。非Toolkit Reduxはアクション・リデューサー・セレクターの大量ボイラープレートが必要です。',
   why_en:'React 18+ changes state management boundaries with ServerComponents, Suspense, and the use() hook. Non-Toolkit Redux requires large amounts of action/reducer/selector boilerplate.'},
  {id:'perf-large-entity-noindex',p:['data_entities'],lv:'warn',
   t:a=>{var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim().length>0;});return ents.length>=12&&!/(インデックス|複合インデックス|DB.*INDEX|database.*index)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large';},
   ja:'エンティティが12件以上あり大規模スケールです。主要な検索・結合クエリへのDBインデックス設計を明示的に検討してください',
   en:'12+ entities at large scale. Explicitly consider DB index design for primary search and join queries to maintain query performance',
   why_ja:'エンティティが12件以上になると外部キー結合・複合条件検索が増加し、インデックスなしではN+1クエリやフルスキャンが深刻なパフォーマンス問題となります。特に「ユーザーID+状態」「日付範囲+テナントID」のような複合インデックスは必須です。',
   why_en:'12+ entities increase foreign key joins and multi-condition searches. Without indexes, N+1 queries and full scans become serious performance issues. Composite indexes on "user_id + status" and "date_range + tenant_id" patterns are critical.'},
  {id:'sec-sensitive-nobackup',p:['data_entities'],lv:'warn',
   t:a=>/(MedicalRecord|PatientRecord|FinancialRecord|ClinicalData|PersonalHealthData)/i.test(a.data_entities||'')&&!/(バックアップ|backup|BCP|DR|Disaster.Recovery|ポイントインタイムリカバリ)/i.test(a.mvp_features||'')&&(a.scale||'medium')==='large',
   ja:'機密性の高い医療・財務エンティティが定義されていますが大規模システムでバックアップ設計が未設定です。データ消失リスクに対してBCP・DR計画を含めてください',
   en:'High-sensitivity medical/financial entities in large-scale system without backup design. Include BCP/DR planning to address data loss risk',
   why_ja:'MedicalRecord・PatientRecord等の機密データは法的保存義務（5〜10年）があり、消失時の法的責任が極めて大きくなります。最低限: Point-in-Time Recovery（PITR）の設定、日次スナップショット、地理的冗長バックアップを実装し、復元手順を文書化してください。',
   why_en:'Medical/financial records like MedicalRecord have legal retention obligations (5-10 years), and legal liability for loss is extremely high.'},
  {id:'cl-monorepo-notools',p:['dev_methods'],lv:'info',
   t:a=>/モノレポ|monorepo/i.test(a.dev_methods||'')&&!/(Turborepo|Nx|pnpm.*workspace|Lerna|changesets)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo',
   ja:'開発方法論にモノレポが選択されていますが、モノレポ管理ツール（Turborepo・Nx・pnpm workspace）が未設定です。ビルドキャッシュと依存関係管理のためツール設定を推奨します',
   en:'Monorepo development methodology selected but no monorepo management tools (Turborepo, Nx, pnpm workspace) configured. Recommend tool setup for build caching and dependency management',
   why_ja:'モノレポはリポジトリ管理を一元化できる反面、適切なツールなしではCI/CDが全パッケージをリビルドし開発速度が大幅に低下します。Turborepoはリモートキャッシュ・依存グラフに基づく差分ビルドで最大10倍の高速化が可能です。',
   why_en:'While monorepos centralize repository management, without proper tooling CI/CD rebuilds all packages, significantly slowing development. Turborepo enables up to 10x speedup via remote caching and incremental builds.'},
  {id:'cl-baas-customlogic',p:['backend','data_entities'],lv:'info',
   t:a=>{var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim().length>0;});return inc(a.backend,'Firebase')&&ents.length>=10&&(a.scale||'medium')!=='solo';},
   ja:'Firebaseバックエンドでエンティティが10件以上あります。複雑なビジネスロジック・トランザクション・結合クエリが必要な場合はCloud Functionsまたはバックエンドサービスの追加を検討してください',
   en:'Firebase backend with 10+ entities. If complex business logic, transactions, or join queries are needed, consider Firebase Cloud Functions or adding a backend service',
   why_ja:'FirebaseのCloud Firestoreはリレーショナル結合クエリが苦手で、エンティティが10件以上になると複雑なビジネスロジック実装にCloud Functionsが必須になりがちです。代替としてSupabase（PostgreSQL+RLS）が複雑なロジックに適しています。',
   why_en:'Firebase Cloud Firestore struggles with relational join queries. With 10+ entities, complex business logic often forces reliance on Cloud Functions. Supabase (PostgreSQL + RLS) is a strong alternative for complex logic.'},
  {id:'cl-ai-nomonitoring',p:['ai_auto'],lv:'warn',
   t:a=>{var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim().length>0;});return /(フル自律|オーケストレーター)/i.test(a.ai_auto||'')&&!/(Langfuse|observability|モニタリング|monitoring|AI.*ログ|トレーシング|tracing)/i.test(a.mvp_features||'')&&(a.scale||'medium')!=='solo'&&ents.length>=1;},
   ja:'高度なAI自律化（フル自律・オーケストレーター・マルチAgent）が設定されていますが、AI実行のモニタリング・トレーシングが未設定です。Langfuseなどの観測ツールを追加してください',
   en:'Advanced AI autonomy (full-auto/orchestrator/multi-agent) configured without AI execution monitoring/tracing. Add observability tools like Langfuse',
   why_ja:'フル自律・マルチAgentシステムはLLM呼び出しが連鎖するため、コスト爆発・ループ・ハルシネーション連鎖を早期に検知できないと深刻な障害につながります。Langfuse（オープンソース）はトークンコスト・レイテンシ・エラー率をトレース単位で記録します。',
   why_en:'Full-auto and multi-agent systems involve chained LLM calls, so cost explosions, loops, and cascading hallucinations can cause serious failures if not detected early. Langfuse (open-source) records token costs, latency, and error rates per trace.'},
  {id:'cl-api-noversioning',p:['backend'],lv:'info',
   t:a=>(isNodeBE(a)||isPyBE(a))&&(a.scale||'medium')==='large'&&!/(\/v[12]\b|api.*version|バージョニング.*API|API.*v1|REST.*v1)/i.test(a.mvp_features||''),
   ja:'大規模なNode.js/Python APIでAPIバージョニング設計が未設定です。/v1/ /v2/ のパスベースバージョニングまたはヘッダーベースの戦略を検討してください',
   en:'Large-scale Node.js/Python API without API versioning design. Consider path-based (/v1/, /v2/) or header-based API versioning strategy',
   why_ja:'大規模APIでクライアント（モバイルアプリ・外部連携）が増えると後方互換性のない変更のたびに全クライアントの一斉更新が必要になります。最初から `/api/v1/` のパスプレフィックスを設計に組み込むことで将来の段階移行が可能になります。',
   why_en:'As large-scale APIs gain more clients, every breaking change requires simultaneous updates across all clients. Building `/api/v1/` path prefixes into the design enables gradual migration.'},
  {id:'cl-payment-nowebhook',p:['payment','backend'],lv:'warn',
   t:a=>{var pay=a.payment||'';return !/(none|なし)/i.test(pay)&&pay.length>0&&(isNodeBE(a)||isPyBE(a))&&(a.scale||'medium')==='large'&&!/(Webhook|webhook|署名検証|stripe.*webhook|決済.*イベント)/i.test(a.mvp_features||'');},
   ja:'大規模Node.js/Python APIで決済統合がありますがWebhook処理が未設定です。payment_intent.succeeded等のイベントをWebhookで受信し、署名検証と冪等性を実装してください',
   en:'Large-scale Node.js/Python API with payment but no Webhook handling configured. Implement Webhook event reception (e.g., payment_intent.succeeded) with signature verification and idempotency',
   why_ja:'クレジットカード決済・サブスクリプション管理ではStripe WebhookでのイベントドリブンなDB更新が必須です。Webhookなしでは決済成功のポーリングが必要となりリアルタイム性・信頼性が著しく低下します。',
   why_en:'Credit card payment and subscription management require event-driven DB updates via Stripe Webhook. Without Webhook, polling for payment success degrades real-time capability and reliability.'},
  // ── Auth Best Practices (5 rules) ──
  {id:'auth-token-localstorage',p:['auth','mvp_features'],lv:'warn',
   t:a=>/Custom JWT|JWT/i.test(a.auth||'')&&/localStorage|ローカルストレージ|local.?storage/i.test(a.mvp_features||'')&&!/(HttpOnly|httponly|cookie)/i.test(a.mvp_features||''),
   ja:'JWTトークンをLocalStorageに保管しています。XSS攻撃でトークンが窃取されるリスクがあります。HttpOnly CookieまたはメモリでAccess Tokenを保持してください',
   en:'JWT token stored in LocalStorage. XSS attacks can steal tokens. Use HttpOnly Cookie or in-memory Access Token storage instead',
   fix:{f:'mvp_features',s:'HttpOnly Cookie + Secure + SameSite=Strict'},
   why_ja:'LocalStorageはJavaScriptから完全にアクセス可能なため、XSSが成立した瞬間にトークンが窃取されます。推奨パターン: Access TokenはReact stateなどのメモリに保持し、Refresh TokenをHttpOnly Cookie（SameSite=Strict）に保管。',
   why_en:'LocalStorage is fully accessible to JavaScript — XSS immediately exposes tokens. Recommended pattern: Access Token in React state (memory), Refresh Token in HttpOnly Cookie (SameSite=Strict). BaaS SDKs implement this automatically.'},
  {id:'auth-apikey-enduser',p:['auth'],lv:'info',
   t:a=>/API.*Key|APIキー|api.?key/i.test(a.auth||'')&&!/(B2B|サービス間|service.?to.?service|developer.*api|開発者.*API|M2M)/i.test((a.target||'')+(a.purpose||'')),
   ja:'エンドユーザー向けアプリでAPI Key認証が設定されています。API Keyはサーバー間・M2M通信向けです。エンドユーザーにはOAuth 2.0/OIDCまたはセッション認証を推奨します',
   en:'API Key authentication for end-user app. API Keys are for server-to-server/M2M communication. Use OAuth 2.0/OIDC or session auth for end users',
   why_ja:'API Keyをブラウザやモバイルアプリに埋め込むと、開発者ツール・ログ・ネットワーク傍受で容易に漏洩します。OAuth 2.0のAuthorization Code Flow + PKCEで短期間のアクセストークンを発行するパターンが安全です。',
   why_en:'API Keys embedded in browsers or mobile apps are easily exposed via dev tools, logs, or network sniffing. Use OAuth 2.0 Authorization Code Flow + PKCE to issue short-lived access tokens securely.'},
  {id:'auth-stateful-distributed',p:['auth'],lv:'info',
   t:a=>(/(Auth\.js|NextAuth|セッション.*認証|session.?auth)/i.test(a.auth||''))&&/(k8s|kubernetes|マイクロサービス|microservice|分散.*環境|distributed)/i.test((a.mvp_features||'')+(a.backend||'')),
   ja:'セッション認証と分散インフラが混在しています。ステートフルセッションは分散環境（k8s/マイクロサービス）で単一障害点になります。Redisなどの共有セッションストアを導入してください',
   en:'Stateful session auth with distributed infrastructure. Sessions become a SPOF in k8s/microservices. Add a shared session store like Redis',
   why_ja:'セッション認証は水平スケール時にスティッキーセッションが必要になるか、セッションDBがボトルネックになります。Redis Clusterや外部セッションストア（connect-redis等）を使うことで水平スケールに対応できます。JWTへの移行も選択肢の一つです。',
   why_en:'Session auth requires sticky sessions when scaling horizontally, or the session DB becomes a bottleneck. Use Redis Cluster or an external session store (e.g., connect-redis) for horizontal scaling. Migrating to JWT is also an option.'},
  {id:'auth-no-mfa-payment',p:['payment','auth'],lv:'warn',
   t:a=>{var pay=a.payment||'';var au=a.auth||'';return !/(none|なし)/i.test(pay)&&pay.length>0&&!/(none|なし)/i.test(au)&&au.length>0&&!/(MFA|2FA|多要素|二要素|TOTP|FIDO|WebAuthn)/i.test((a.mvp_features||'')+au)&&(a.scale||'medium')==='large';},
   ja:'決済機能があるシステム（大規模）でMFAが設定されていません。決済を扱うアプリではMFA（TOTP/WebAuthn）の実装を強く推奨します',
   en:'Large-scale system with payment but no MFA. Systems handling payments should strongly consider MFA (TOTP/WebAuthn)',
   why_ja:'決済機能があるシステムではアカウント乗っ取り（ATO）攻撃により不正決済が発生するリスクがあります。TOTPやWebAuthn（パスキー）を実装することでフィッシング・クレデンシャルスタッフィング攻撃への耐性が向上します。',
   why_en:'Payment systems face Account Takeover (ATO) risks causing fraudulent charges. TOTP or WebAuthn (passkeys) implementation increases resistance to phishing and credential stuffing. Step-up authentication for high-value transactions is also effective.'},
  {id:'auth-oauth-no-fallback',p:['auth'],lv:'info',
   t:a=>{var au=a.auth||'';return /(Google|GitHub|Apple.*Sign|Twitter|LINE)/i.test(au)&&!/(メール|Email|Password|パスワード)/i.test(au)&&(a.scale||'medium')!=='solo';},
   ja:'ソーシャルログインのみが設定されています。プロバイダー障害時にログイン不可になるリスクがあります。Email/Password認証をフォールバックとして併用することを推奨します',
   en:'Only social login configured. Provider outages will block all logins. Consider adding Email/Password as a fallback',
   why_ja:'Googleログインのみに依存した場合、Google OAuth障害やプロバイダーによるアカウント停止時にユーザーが完全にログインできなくなります。Email/Passwordをフォールバックとして提供することでリスクを分散できます。',
   why_en:'Relying solely on a social provider means any OAuth outage or provider account suspension locks all users out. Adding Email/Password as a fallback distributes this risk effectively.'},
  // ── Scaling & Architecture (6 rules) ──
  {id:'scale-serverless-nopool',p:['deploy','database'],lv:'warn',
   t:a=>{var dep=a.deploy||'';var db=a.database||'';var be=a.backend||'';
    var isServerless=/Vercel|Netlify|Cloudflare\s*Workers?|Lambda|Functions/i.test(dep);
    var isSQLdb=/(PostgreSQL|MySQL|Neon|PlanetScale)/i.test(db)&&!/(Supabase|Firebase|Firestore|Convex)/i.test(db);
    var isBaaS=/(Firebase|Supabase|Convex)/i.test(be);
    var hasPool=/(PgBouncer|connection.?pool|Prisma\s*Accelerate|Neon.?pool)/i.test((a.mvp_features||'')+(a.backend||''));
    return isServerless&&isSQLdb&&!isBaaS&&!hasPool&&(a.scale||'medium')!=='solo';},
   ja:'サーバーレス環境でSQL DBへ直接接続するとリクエスト毎にDB接続が生成されmax_connectionsが枯渇します。PgBouncer/Prisma Accelerate/Neon poolingの導入を推奨します',
   en:'Direct SQL DB connections from serverless environments create a new connection per request, exhausting max_connections. Use PgBouncer/Prisma Accelerate/Neon pooling',
   why_ja:'Vercel/Netlify/CF WorkersなどのサーバーレスFunctionはリクエスト毎にコールドスタートし、DB接続を都度確立します。PostgreSQLのデフォルトmax_connections=100では、同時接続数が増えると即座に枯渇します。',
   why_en:'Serverless functions (Vercel/Netlify/CF Workers) cold-start on each request and establish a new DB connection. With PostgreSQL default max_connections=100, concurrent requests quickly exhaust the pool.'},
  {id:'scale-large-single-db',p:['scale','data_entities','database'],lv:'warn',
   t:a=>{var be=a.backend||'';var db=a.database||'';
    var entities=(a.data_entities||'').split(/[,、]\s*/).filter(Boolean);
    var hasReplica=/(Read\s*Replica|レプリカ|クラスタ|cluster|partition|パーティション|Citus|Aurora)/i.test(a.mvp_features||'');
    var isBaaS=/(Firebase|Supabase|Convex)/i.test(be);
    var isSQLdb=/(PostgreSQL|MySQL|Neon|PlanetScale)/i.test(db)&&!/(Supabase|Firebase|Firestore)/i.test(db);
    var isServerBE=/(Express|NestJS|FastAPI|Django|Spring|Hono|Fastify)/i.test(be);
    return a.scale==='large'&&entities.length>=8&&!hasReplica&&!isBaaS&&isSQLdb&&isServerBE;},
   ja:'大規模アプリ（8エンティティ以上）でSQLDBが単一インスタンス構成です。SPOFになるためRead Replica/クラスタリング/パーティショニングの導入を検討してください',
   en:'Large-scale app (8+ entities) with single SQL DB instance is a SPOF. Consider Read Replica/clustering/partitioning',
   why_ja:'エンティティ数が8以上かつscale=largeの場合、読み取り負荷の集中によりDB応答が劣化します。PostgreSQL Read Replicaを追加することで読み取りを分散しプライマリの書き込み性能を維持できます。',
   why_en:'With 8+ entities at large scale, read-heavy workloads degrade DB response. Adding PostgreSQL Read Replicas distributes reads and preserves primary write performance. For even larger scale, consider Citus sharding or Aurora Global Database.'},
  {id:'scale-large-no-lb',p:['scale','backend'],lv:'info',
   t:a=>{var isBaaS=/(Firebase|Supabase|Convex)/i.test(a.backend||'');
    var hasLB=/(LB|ロードバランス|Load\s*Balanc|auto.?scal|オートスケール|k8s|kubernetes|ECS|ALB)/i.test(a.mvp_features||'');
    var isManaged=/Vercel|Netlify|Railway|Fly\.io|Cloudflare/i.test(a.deploy||'');
    return a.scale==='large'&&!isBaaS&&!hasLB&&!isManaged;},
   ja:'大規模アプリでロードバランシング・オートスケーリング戦略が未設定です。水平スケールアーキテクチャの検討を推奨します。docs/120参照',
   en:'Large-scale app without load balancing/auto-scaling strategy. Consider horizontal scale architecture. See docs/120',
   why_ja:'scale=largeで単一バックエンドサーバーはSPOFになります。ALB(Application Load Balancer) + Auto Scaling Group、またはk8s + HPA（Horizontal Pod Autoscaler）を組み合わせることで高可用性を実現できます。',
   why_en:'A single backend server at large scale is a SPOF. Combine ALB + Auto Scaling Group, or k8s + HPA (Horizontal Pod Autoscaler) for high availability. Algorithm: Least Connections or Consistent Hashing suits most web apps. See: docs/120_system_design_guide.md §3'},
  {id:'scale-realtime-large',p:['scale','purpose','backend'],lv:'warn',
   t:a=>{var be=a.backend||'';
    var isRT=/リアルタイム|realtime|chat|チャット|WebSocket|ライブ.*配信|live.*stream/i.test(a.purpose||'');
    var hasRedisAdapter=/(Redis\s*Adapter|redis-adapter|@socket\.io\/redis)/i.test(a.mvp_features||'');
    var isBaaS=/(Firebase|Supabase|Convex)/i.test(be);
    var isNodeBE=/(Express|NestJS|Hono|Fastify)/i.test(be);
    return a.scale==='large'&&isRT&&!hasRedisAdapter&&!isBaaS&&isNodeBE;},
   ja:'大規模リアルタイム機能（WebSocket/チャット）で水平スケール時にSocket.io Redis Adapterが必要です（@socket.io/redis-adapter）',
   en:'Large-scale realtime features (WebSocket/chat) require Socket.io Redis Adapter for horizontal scaling (@socket.io/redis-adapter)',
   why_ja:'WebSocketは永続接続を維持するため、水平スケール時に「同じサーバーへの接続」を保証する仕組みが必要です。Redis Adapter（@socket.io/redis-adapter）を使うことで複数のSocket.ioサーバー間でイベントをブロードキャスト共有できます。',
   why_en:'WebSocket maintains persistent connections, so horizontal scaling requires a mechanism to share messages across servers. Redis Adapter (@socket.io/redis-adapter) broadcasts events between multiple Socket.io instances.'},
  {id:'api-graphql-no-persisted',p:['backend','scale'],lv:'info',
   t:a=>{var _be=a.backend||'';var _fe=a.frontend||'';
    var isGQL=/GraphQL/i.test(_be)||/GraphQL/i.test(_fe);
    var hasPersisted=/(Persisted\s*Quer|APQ|Automatic\s*Persisted|パーシステッド)/i.test(a.mvp_features||'');
    return isGQL&&(a.scale||'medium')!=='solo'&&!hasPersisted;},
   ja:'GraphQL APIでPersisted Queriesが未設定です。帯域削減・DoS対策のためAPQ（Automatic Persisted Queries）の導入を推奨します',
   en:'GraphQL API without Persisted Queries. Use APQ (Automatic Persisted Queries) for bandwidth reduction and DoS protection',
   why_ja:'GraphQLクエリは文字列で送信されるため複雑なクエリは大きなリクエストボディになります。Automatic Persisted Queries（APQ）はクエリをハッシュ値で参照することで帯域を最大70%削減できます。',
   why_en:'GraphQL queries are sent as strings, making complex queries large request bodies. APQ (Automatic Persisted Queries) references queries by hash, reducing bandwidth up to 70%.'},
  {id:'db-nosql-acid-risk',p:['database','purpose'],lv:'info',
   t:a=>{var db=a.database||'';
    var isNoSQL=/MongoDB|Firestore|DynamoDB/i.test(db);
    var isFinDomain=/決済|金融|fintech|保険|insurance|法務|legal|銀行|bank|証券|securities/i.test(a.purpose||'');
    return isNoSQL&&isFinDomain;},
   ja:'NoSQL DB（MongoDB/Firestore等）と金融/保険/法務ドメインの組み合わせです。NoSQLはACIDトランザクション保証が限定的で金融データの整合性確保が複雑になります。PostgreSQL等のRDB推奨。docs/120参照',
   en:'NoSQL DB with finance/insurance/legal domain. NoSQL has limited ACID transaction guarantees, complicating financial data consistency. Consider PostgreSQL or another RDBMS. See docs/120',
   why_ja:'MongoDBはマルチドキュメントトランザクションをサポートしますがデフォルトは結果整合性（BASE）です。金融取引・保険契約・法務文書では「ある操作が成功したか失敗したか」の厳密な保証（ACID）が必要です。',
   why_en:'MongoDB supports multi-document transactions but defaults to eventual consistency (BASE). Financial transactions, insurance contracts, and legal documents require strict ACID guarantees.'},
  // ── Security Design Rules (6 rules) — docs/121 ──
  {id:'sec-no-secrets-mgr',p:['scale','backend'],lv:'warn',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isBaas=/Firebase|Supabase|Convex/i.test(be);
    var isStatic=/なし（静的|None|static/i.test(be);
    var hasSensEnt=/MedicalRecord|PatientRecord|ClinicalData|FinancialTransaction|CreditCard|BankAccount/i.test(a.data_entities||'');
    var feats=a.mvp_features||'';
    var hasSecMgr=/Vault|Doppler|SOPS|Secrets Manager|Secret Manager/i.test(feats);
    return sc==='large'&&!isBaas&&!isStatic&&hasSensEnt&&!hasSecMgr;},
   ja:'大規模環境に機密エンティティが存在しますがシークレット管理ツールが未設定です。APIキーやDB接続文字列の漏洩リスクがあります。Vault/Dopplerの導入を推奨します。docs/121参照',
   en:'Large-scale environment with sensitive entities but no secrets management tool configured. Risk of API key/DB credential leakage. Recommend Vault/Doppler. See docs/121',
   why_ja:'シークレット（DBパスワード・APIキー・JWTシークレット）をコードやコンテナ環境変数に直接埋め込むと、ソースコード漏洩・コンテナイメージ抽出・ログ出力などで露出します。',
   why_en:'Embedding secrets (DB passwords, API keys, JWT secrets) directly in code or container env vars exposes them via source leaks, container image extraction, or log output.'},
  {id:'sec-no-sbom',p:['deploy','scale'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var dep=a.deploy||'';
    var isContainer=/Railway|Fly\.io|ECS|Cloud Run|Render|Coolify|Docker/i.test(dep);
    var feats=a.mvp_features||'';
    var hasSbom=/SBOM|CycloneDX|Syft|sbom/i.test(feats);
    return sc==='large'&&isContainer&&!hasSbom;},
   ja:'大規模コンテナデプロイでSBOM（ソフトウェア部品表）が未設定です。CycloneDX/Syftでのサプライチェーンセキュリティ対策を推奨します。docs/121参照',
   en:'Large-scale container deployment without SBOM (Software Bill of Materials). Recommend CycloneDX/Syft for supply chain security. See docs/121',
   why_ja:'SBOM（Software Bill of Materials）はすべての依存コンポーネントを一覧化し、新たなCVE（Common Vulnerabilities and Exposures）が発見された際に影響範囲を即座に特定できます。Log4Shell事件では多くの企業がLog4jを使用しているかどうかすら把握できず対応が遅延しました。',
   why_en:'SBOM (Software Bill of Materials) lists all dependency components, enabling instant impact assessment when new CVEs are discovered. During Log4Shell, many organizations could not determine if they used Log4j, delaying response.'},
  {id:'sec-sensitive-no-classify',p:['data_entities','scale'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var ents=a.data_entities||'';
    var hasSens=/Patient|Medical|ClinicalData|Transaction|Payment|Credit|Health|Insurance/i.test(ents);
    var feats=(a.mvp_features||'')+(a.purpose||'');
    var hasClassify=/データ分類|data classification|PII|PHI|PCI|Restricted|Confidential/i.test(feats);
    return sc!=='solo'&&hasSens&&!hasClassify;},
   ja:'機密エンティティ（患者/医療/決済/健康）が存在しますがデータ分類フレームワークが未定義です。PII/PHI/PCIティアの定義を推奨します。docs/121参照',
   en:'Sensitive entities (patient/medical/payment/health) exist without a data classification framework. Recommend defining PII/PHI/PCI tiers. See docs/121',
   why_ja:'データ分類なしでは「このフィールドの暗号化は必要か？」「誰がアクセスできるか？」「どのくらい保存するか？」の判断基準がなく、過剰/過少な保護が発生します。',
   why_en:'Without data classification, there is no basis for deciding "does this field need encryption?", "who can access it?", or "how long to retain it?", leading to under/over-protection.'},
  {id:'sec-no-sast',p:['backend','scale'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isBaas=/Firebase|Supabase|Convex/i.test(be);
    var isStatic=/なし（静的|None|static/i.test(be);
    var feats=a.mvp_features||'';
    var hasSast=/SAST|Semgrep|CodeQL|SonarQube|静的解析/i.test(feats);
    return sc==='large'&&!isBaas&&!isStatic&&!hasSast;},
   ja:'大規模環境でSASTツール（静的解析）が未設定です。Semgrep/CodeQLのCI/CD統合を推奨します。docs/121参照',
   en:'Large-scale environment without SAST tool configured. Recommend integrating Semgrep/CodeQL in CI/CD. See docs/121',
   why_ja:'大規模プロジェクトでは手動コードレビューだけでセキュリティ脆弱性を見つけることが困難です。',
   why_en:'At large scale, manual code review alone cannot catch all security vulnerabilities. SAST (Static Application Security Testing) tools analyze code without building it, auto-detecting patterns like SQL injection, XSS, and hardcoded secrets at the PR level.'},
  {id:'sec-container-no-scan',p:['deploy','scale'],lv:'warn',
   t:a=>{
    var sc=a.scale||'medium';
    var dep=a.deploy||'';
    var isContainer=/Railway|Fly\.io|ECS|Cloud Run|Render|Coolify|Docker/i.test(dep);
    var hasSensEnt=/MedicalRecord|PatientRecord|ClinicalData|FinancialTransaction|CreditCard|BankAccount/i.test(a.data_entities||'');
    var feats=a.mvp_features||'';
    var hasScan=/Trivy|Grype|コンテナスキャン|container scan/i.test(feats);
    return isContainer&&sc==='large'&&hasSensEnt&&!hasScan;},
   ja:'大規模コンテナデプロイに機密エンティティが存在しますがコンテナイメージスキャンが未設定です。Trivy/Gryeでの脆弱性スキャンを推奨します。docs/121参照',
   en:'Large-scale container deployment with sensitive entities but no container image scanning configured. Recommend Trivy/Grype vulnerability scanning. See docs/121',
   why_ja:'コンテナイメージには多数のOSパッケージ・ライブラリが含まれており、その中に既知の脆弱性（CVE）が含まれている可能性があります。',
   why_en:'Container images contain many OS packages and libraries that may include known vulnerabilities (CVEs).'},
  {id:'sec-no-security-metrics',p:['scale','purpose'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var dom=detectDomain(a.purpose||'');
    var isHiSec=/fintech|health|insurance|government|legal/i.test(dom);
    var feats=a.mvp_features||'';
    var hasMetrics=/MTTD|MTTR|セキュリティメトリクス|security metrics|脆弱性エイジング|vulnerability aging/i.test(feats);
    return sc==='large'&&isHiSec&&!hasMetrics;},
   ja:'大規模高セキュリティドメインでセキュリティメトリクス（MTTD/MTTR）が未定義です。定量的なセキュリティ管理の導入を推奨します。docs/121参照',
   en:'Large-scale high-security domain without security metrics (MTTD/MTTR) defined. Recommend implementing quantitative security management. See docs/121',
   why_ja:'「セキュリティインシデントが発生してから検知まで何時間かかっているか」（MTTD）「検知から修復まで何時間かかっているか」（MTTR）を測定しないと改善できません。',
   why_en:'Without measuring "how long from incident to detection" (MTTD) and "how long from detection to remediation" (MTTR), improvement is impossible. Finance, healthcare, and government domains specifically require regular security reporting as a regulatory requirement.'},
  // ── API Performance (+4: 1W+3I) ──
  {id:'perf-no-compression',p:['backend','scale'],lv:'warn',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isStatic=/静的サイト|static site/i.test(be)||!be;
    var isBaaS=/Supabase|Firebase|Convex/i.test(be);
    var feats=a.mvp_features||'';
    var hasCompress=/compress|brotli|gzip|圧縮ミドルウェア/i.test(feats);
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    return sc==='large'&&!isBaaS&&!isStatic&&!hasCompress&&ents.length>=8;},
   ja:'大規模バックエンドでレスポンス圧縮（Gzip/Brotli）が未設定です。JSON APIで30-70%の帯域削減が可能です。docs/101参照',
   en:'Large-scale backend without response compression (Gzip/Brotli) configured. 30-70% bandwidth reduction possible for JSON APIs. See docs/101',
   why_ja:'大規模サービスでは、JSONレスポンスにGzip/Brotli圧縮を適用することで帯域コストを30-70%削減できます。Expressでは`compression`パッケージを追加するだけで有効化でき、nginxリバースプロキシでもgzip/brotliディレクティブで設定可能です。',
   why_en:'For large-scale services, applying Gzip/Brotli compression to JSON responses can reduce bandwidth costs by 30-70%. In Express, simply adding the `compression` package enables it; nginx reverse proxies can also configure gzip/brotli directives.'},
  {id:'perf-no-etag',p:['backend','scale'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isStatic=/静的サイト|static site/i.test(be)||!be;
    var isBaaS=/Supabase|Firebase|Convex/i.test(be);
    var feats=a.mvp_features||'';
    var hasETag=/ETag|条件付きリクエスト|conditional request|304/i.test(feats);
    return sc==='large'&&!isBaaS&&!isStatic&&!hasETag;},
   ja:'大規模バックエンドでETag/条件付きリクエストが未設定です。帯域30-90%削減と不要な処理の削減が可能です。docs/101参照',
   en:'Large-scale backend without ETag/conditional requests configured. Possible 30-90% bandwidth reduction and elimination of redundant processing. See docs/101',
   why_ja:'ETagは`If-None-Match`リクエストヘッダーと組み合わせることで、リソースが変更されていない場合に304 Not Modifiedを返し、レスポンスボディの転送を不要にします。',
   why_en:'ETag combined with the `If-None-Match` request header allows returning 304 Not Modified when resources haven\'t changed, eliminating response body transfer.'},
  {id:'api-no-deprecation-plan',p:['backend','scale'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isStatic=/静的サイト|static site/i.test(be)||!be;
    var isBaaS=/Supabase|Firebase|Convex/i.test(be);
    var feats=a.mvp_features||'';
    var hasDeprecation=/Deprecation|Sunset|廃止計画|バージョン移行/i.test(feats);
    return sc==='large'&&!isBaaS&&!isStatic&&!hasDeprecation;},
   ja:'大規模APIでバージョン廃止計画（Deprecation/Sunsetヘッダー）が未定義です。クライアント影響を最小化する移行戦略の策定を推奨します。docs/83参照',
   en:'Large-scale API without version deprecation plan (Deprecation/Sunset headers) defined. Recommend establishing a migration strategy to minimize client impact. See docs/83',
   why_ja:'APIバージョンの廃止を突然行うとクライアントが壊れます。RFC 8594のSunsetヘッダーを使うことで、廃止日を事前に通知できます。',
   why_en:'Abruptly deprecating API versions breaks clients. Using RFC 8594 Sunset headers provides advance notice of deprecation dates.'},
  {id:'perf-rest-no-fieldselect',p:['backend','data_entities'],lv:'info',
   t:a=>{
    var sc=a.scale||'medium';
    var be=a.backend||'';
    var isBaaS=/Supabase|Firebase|Convex/i.test(be);
    var isGraphQL=/GraphQL/i.test(be)||(a.frontend&&/GraphQL/i.test(a.frontend));
    var feats=a.mvp_features||'';
    var hasFieldSelect=/sparse fieldset|fields=|フィールド選択|field select/i.test(feats);
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    return !isBaaS&&!isGraphQL&&ents.length>=8&&sc!=='solo'&&!hasFieldSelect;},
   ja:'8件超エンティティのREST APIでフィールド選択（?fields=）が未実装です。過剰なペイロード転送を防ぐSparse Fieldsetsの実装を推奨します。docs/83参照',
   en:'REST API with 8+ entities without field selection (?fields=) implemented. Recommend Sparse Fieldsets to prevent over-fetching payload transfer. See docs/83',
   why_ja:'GraphQLはフィールド選択をネイティブに解決しますが、REST APIでは全フィールドを返すのがデフォルトです。',
   why_en:'While GraphQL natively solves field selection, REST APIs default to returning all fields.'},

  // ── docs/122 Concurrency & docs/123 Frontend rules (+8) ──
  {id:'scale-booking-no-idempotency',p:['purpose','payment','scale'],lv:'warn',
   t:function(a){
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isBookingDom=/booking|ec|fintech|marketplace|event|travel/.test(dom||'');
    var hasPay=a.payment&&!/なし|none/i.test(a.payment);
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    var hasIdempotency=/idempotency|冪等|idempotent/i.test((a.mvp_features||'')+(a.data_entities||''));
    return isBookingDom&&hasPay&&(a.scale==='large')&&ents.length>=8&&!hasIdempotency;},
   ja:'大規模な予約/EC/Fintechドメインで決済あり構成です。冪等性 (Idempotency Key) の実装が必要です。docs/122参照',
   en:'Large-scale booking/EC/Fintech domain with payment. Idempotency Key implementation required. See docs/122',
   fix:{f:'mvp_features',s:'Idempotency Key実装'},
   why_ja:'ネットワーク障害やタイムアウト時にクライアントがリトライすると、決済が二重実行される危険があります。X-Idempotency-KeyヘッダーとDB UNIQUE制約の組み合わせで重複リクエストを安全に処理できます。',
   why_en:'On network failure or timeout, client retries can cause double-charging. Combining X-Idempotency-Key header with DB UNIQUE constraint safely handles duplicate requests. Large systems with 8+ entities have high transaction volume making idempotency essential.'},

  {id:'fe-spa-payment-no-csp',p:['frontend','payment','scale'],lv:'warn',
   t:function(a){
    var isSPA=/React|Vue|Angular|Svelte|Next|Nuxt|SvelteKit/i.test(a.frontend||'');
    var hasPay=a.payment&&!/なし|none/i.test(a.payment);
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    var hasCSP=/CSP|Content.Security.Policy|content.security/i.test((a.mvp_features||'')+(a.data_entities||''));
    return isSPA&&hasPay&&(a.scale==='large')&&ents.length>=8&&!hasCSP;},
   ja:'大規模SPAで決済あり構成です。CSP (Content Security Policy) の設定が必要です。docs/123参照',
   en:'Large-scale SPA with payment. CSP (Content Security Policy) configuration required. See docs/123',
   fix:{f:'mvp_features',s:'CSP設定'},
   why_ja:'SPAはXSSに対して脆弱で、決済フロントエンドへの攻撃はPCI DSSコンプライアンス違反につながります。CSPヘッダーはスクリプトの実行元を制限し、XSSによるクレジットカード情報窃取を防止します。',
   why_en:'SPAs are vulnerable to XSS, and attacks on payment frontends lead to PCI DSS compliance violations. CSP headers restrict script execution origins, preventing credit card theft via XSS. Large payment systems also require SRI (Subresource Integrity) combination.'},

  {id:'scale-large-no-circuit-breaker',p:['backend','scale'],lv:'info',
   t:function(a){
    var isBaaS=/Firebase|Supabase|Convex/i.test(a.backend||'');
    var isStatic=/なし（静的|None|static/i.test(a.backend||'');
    var hasCircuitBreaker=/circuit.breaker|resilience|サーキットブレーカー|opossum|hystrix/i.test((a.mvp_features||'')+(a.data_entities||''));
    return (a.scale==='large')&&!isBaaS&&!isStatic&&!hasCircuitBreaker;},
   ja:'大規模バックエンドでサーキットブレーカーの実装が検討されていません。外部サービス障害の波及防止に有効です。docs/122参照',
   en:'Large-scale backend without circuit breaker consideration. Effective for preventing cascading failures from external service outages. See docs/122',
   fix:{f:'mvp_features',s:'サーキットブレーカー実装'},
   why_ja:'外部API・マイクロサービスへの依存がある大規模システムでは、1つのサービス障害が全体に波及するカスケード障害のリスクがあります。',
   why_en:'Large systems with external API/microservice dependencies face cascading failure risk where one service outage propagates system-wide. Circuit breakers (opossum etc.) immediately cut calls to failed services, maintaining overall system stability.'},

  {id:'scale-write-heavy-no-queue',p:['purpose','scale'],lv:'info',
   t:function(a){
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isWriteHeavy=/booking|ec|manufacturing|event|logistics/.test(dom||'');
    var hasQueue=/queue|Kafka|BullMQ|SQS|RabbitMQ|キュー|非同期処理/i.test((a.mvp_features||'')+(a.data_entities||''));
    return (a.scale==='large')&&isWriteHeavy&&!hasQueue;},
   ja:'大規模な書込多ドメインでメッセージキューの検討がありません。高負荷時の安定性向上に有効です。docs/122参照',
   en:'Large write-heavy domain without message queue consideration. Effective for improving stability under high load. See docs/122',
   fix:{f:'mvp_features',s:'メッセージキュー (BullMQ/SQS)'},
   why_ja:'予約・EC・製造・イベントなど書込が集中するドメインでは、同期処理だけでは高負荷時にデータベースが飽和します。メッセージキュー (BullMQ/SQS/RabbitMQ) を使用した非同期処理により、書込負荷を分散し、ピーク時の安定性を大幅に向上できます。',
   why_en:'Write-intensive domains (booking, EC, manufacturing, events) can saturate the database under high load with synchronous processing alone. Message queues (BullMQ/SQS/RabbitMQ) with async processing distribute write load and significantly improve peak stability.'},

  {id:'fe-large-no-codesplit',p:['frontend','scale'],lv:'info',
   t:function(a){
    var isSPA=/React|Vue|Angular/i.test(a.frontend||'');
    var hasCodeSplit=/code.split|lazy|dynamic.import|コード分割/i.test((a.mvp_features||'')+(a.data_entities||''));
    return isSPA&&(a.scale==='large')&&!hasCodeSplit;},
   ja:'大規模SPAでコード分割 (Code Splitting) の検討がありません。初期ロードパフォーマンス向上に有効です。docs/123参照',
   en:'Large-scale SPA without code splitting consideration. Effective for improving initial load performance. See docs/123',
   fix:{f:'mvp_features',s:'コード分割 (React.lazy/dynamic import)'},
   why_ja:'大規模SPAでは機能追加とともにバンドルサイズが増大し、初回ロードが遅くなります。React.lazy/Suspense やNext.jsのdynamic importでルートベースのコード分割を実施すると、Initial JSを200KB以下に抑えLCPを2.5秒以内に改善できます。詳細: docs/123_frontend_architecture_guide.md §3',
   why_en:'As features grow in large SPAs, bundle size increases and initial load slows. Route-based code splitting with React.lazy/Suspense or Next.js dynamic import keeps Initial JS under 200KB and improves LCP to under 2.5s. See docs/123_frontend_architecture_guide.md §3'},

  {id:'org-rls-large-no-audit',p:['org_model','scale'],lv:'info',
   t:function(a){
    var hasRLS=/RLS/i.test(a.org_model||'');
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    var hasAudit=/AuditLog|AuditTrail|ActivityLog|監査ログ/i.test(a.data_entities||'');
    return hasRLS&&(a.scale==='large')&&ents.length>=6&&!hasAudit;},
   ja:'RLSマルチテナント大規模構成で監査ログ (AuditLog) エンティティが未定義です。テナント間操作の追跡に必要です。',
   en:'Large-scale RLS multi-tenant config without AuditLog entity. Required for tracking cross-tenant operations.',
   fix:{f:'data_entities',s:'AuditLog'},
   why_ja:'RLS (Row Level Security) はテナント間のデータ分離を保証しますが、不正アクセス試行や設定ミスによるデータ漏洩が発生した場合、AuditLogがなければ原因追跡が困難です。',
   why_en:'While RLS guarantees data isolation between tenants, without AuditLog it is difficult to trace the cause of unauthorized access attempts or misconfiguration-induced data leaks.'},

  {id:'dev-tdd-no-coverage',p:['dev_methods','scale'],lv:'info',
   t:function(a){
    var hasTDD=/TDD/i.test(a.dev_methods||'');
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    var hasCoverage=/coverage|カバレッジ|カバー率/i.test((a.mvp_features||'')+(a.data_entities||''));
    return hasTDD&&(a.scale!=='solo')&&ents.length>=6&&!hasCoverage;},
   ja:'TDD採用でカバレッジ計測が明示されていません。TDDの効果を定量的に確認するためカバレッジ目標の設定を推奨します。',
   en:'TDD adopted without explicit coverage measurement. Recommend setting coverage targets to quantitatively verify TDD effectiveness.',
   fix:{f:'mvp_features',s:'カバレッジ計測 (80%以上)'},
   why_ja:'TDDはテストファーストで開発することで品質を高める手法ですが、カバレッジ目標 (通常80%以上) がないとリグレッションが見落とされる危険があります。',
   why_en:'TDD improves quality through test-first development, but without coverage targets (typically 80%+) regressions can be missed. Integrate coverage reports into CI/CD with `vitest --coverage` or `jest --coverage` and fail builds when coverage drops below threshold.'},

  {id:'ai-prompt-no-version',p:['ai_auto','scale'],lv:'info',
   t:function(a){
    var isOrchestrator=/orchestrator|multi.agent|マルチエージェント/i.test(a.ai_auto||'');
    var ents=(a.data_entities||'').split(',').filter(function(e){return e.trim();});
    var hasPromptVersion=/prompt.version|プロンプトバージョン|prompt.*管理|version.*prompt/i.test((a.mvp_features||'')+(a.data_entities||''));
    return isOrchestrator&&(a.scale==='large')&&!hasPromptVersion;},
   ja:'大規模マルチエージェント構成でプロンプトバージョン管理が未定義です。プロンプト変更の追跡と品質管理に必要です。docs/115参照',
   en:'Large-scale multi-agent config without prompt version management. Required for tracking prompt changes and quality control. See docs/115',
   fix:{f:'mvp_features',s:'プロンプトバージョン管理'},
   why_ja:'マルチエージェント・オーケストレーター構成では、プロンプトの変更が出力品質に直接影響します。バージョン管理なしでプロンプトを変更すると、どの変更が品質劣化を引き起こしたか追跡できません。',
   why_en:'In multi-agent/orchestrator configs, prompt changes directly affect output quality. Without version control, changes cannot be traced to quality degradation.'},
  // ── Observability / Monitoring (6 INFO) ──
  {id:'obs-large-no-structured-log',p:['scale','backend'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var isBaaS=inc(a.backend,'Firebase')||inc(a.backend,'Supabase')||inc(a.backend,'Convex');
    var isStatic=inc(a.backend,'なし')||inc(a.backend,'None')||inc(a.backend,'static');
    var hasStructLog=/struct.*log|winston|pino|structured/i.test((a.mvp_features||'')+(a.data_entities||''));
    return a.scale==='large'&&ents.length>=10&&!isBaaS&&!isStatic&&!hasStructLog;},
   ja:'大規模構成で構造化ログが未設定です。非構造化ログは検索・集計が困難でインシデント対応時間が増大します。docs/17参照',
   en:'Large-scale config without structured logging. Unstructured logs make search/aggregation hard and increase incident response time. See docs/17',
   fix:{f:'mvp_features',s:'構造化ログ (Winston/Pino)'},
   why_ja:'大規模サービスでは1秒間に数千件のログが出力されます。非構造化テキストログは grep 検索しかできず、障害時の原因特定に数時間かかることがあります。',
   why_en:'Large services emit thousands of log lines per second. Unstructured text logs require grep searches, taking hours to identify root causes during incidents. Use Winston/Pino for JSON structured logging and aggregate efficiently with Datadog/CloudWatch Logs Insights.'},
  {id:'obs-no-error-tracking',p:['scale','data_entities'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var hasErrorTrack=/sentry|bugsnag|rollbar|エラー追跡|error.track/i.test((a.mvp_features||'')+(a.data_entities||''));
    return a.scale==='large'&&ents.length>=10&&!hasErrorTrack;},
   ja:'大規模構成でエラー追跡ツール (Sentry等) が未設定です。本番エラーの検知が遅延しSLAに影響します。docs/17参照',
   en:'Large-scale config without error tracking tool (Sentry etc.). Production error detection delays impact SLA. See docs/17',
   fix:{f:'mvp_features',s:'Sentry エラー追跡'},
   why_ja:'Sentry等のエラー追跡ツールがない場合、本番エラーはユーザーからの問い合わせで初めて検知されます。大規模サービスでは1日数百件のエラーが発生することがあり、早期検知なしでは SLA 99.9% の維持が困難です。',
   why_en:'Without Sentry-type error tracking, production errors are only discovered via user complaints. Large services can generate hundreds of errors per day, making it difficult to maintain 99.9% SLA without early detection.'},
  {id:'obs-no-alerting-config',p:['scale','data_entities'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var hasAlert=/alert|アラート|pagerduty|opsgenie|slack.*webhook/i.test((a.mvp_features||'')+(a.data_entities||''));
    return a.scale==='large'&&ents.length>=10&&!hasAlert;},
   ja:'大規模構成でアラート設定が未定義です。閾値超過時の自動通知がなければインシデント対応が遅延します。docs/17参照',
   en:'Large-scale config without alerting configuration. No automatic notification on threshold breach delays incident response. See docs/17',
   fix:{f:'mvp_features',s:'アラート設定 (PagerDuty/Slack)'},
   why_ja:'CPU 85%超過やエラーレート 1%超過時に自動アラートがなければ、担当者が手動で監視ダッシュボードを確認するまで問題が放置されます。PagerDuty/OpsGenie/Slack Webhook を組み合わせた on-call ローテーションの設定を推奨します。',
   why_en:'Without automatic alerts on CPU 85%+ or error rate 1%+, issues go unnoticed until someone manually checks dashboards. Recommend configuring PagerDuty/OpsGenie/Slack Webhook with on-call rotation.'},
  {id:'obs-no-health-endpoint',p:['scale','backend'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var isBaaS=inc(a.backend,'Firebase')||inc(a.backend,'Supabase')||inc(a.backend,'Convex');
    var isStatic=inc(a.backend,'なし')||inc(a.backend,'None')||inc(a.backend,'static');
    var hasHealth=/health|ヘルスチェック|\/health|readiness|liveness/i.test((a.mvp_features||'')+(a.data_entities||''));
    return a.scale==='large'&&ents.length>=10&&!isBaaS&&!isStatic&&!hasHealth;},
   ja:'大規模構成で /health エンドポイントが未定義です。ロードバランサーや k8s の死活監視に必須です。docs/17参照',
   en:'Large-scale config without /health endpoint. Required for load balancer and k8s liveness/readiness probes. See docs/17',
   fix:{f:'mvp_features',s:'/health エンドポイント'},
   why_ja:'ロードバランサーや Kubernetes は /health エンドポイントの応答でサービスの正常稼働を判断します。このエンドポイントが存在しない場合、障害時にトラフィックが異常なインスタンスに送られ続けます。',
   why_en:'Load balancers and Kubernetes use /health responses to determine service health. Without it, traffic continues to be routed to unhealthy instances during failures. Implement health checks including DB connection and queue connectivity verification.'},
  {id:'obs-production-no-sla',p:['scale','purpose'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isRegulated=/fintech|health|legal|government|insurance/i.test(dom);
    var hasSLA=/sla|slo|可用性.*99|availability.*99/i.test((a.mvp_features||'')+(a.success||''));
    return a.scale==='large'&&ents.length>=10&&isRegulated&&!hasSLA;},
   ja:'規制ドメインの大規模構成でSLA目標が未定義です。金融・医療等では可用性・RTO/RPOの明示が規制要件となります。docs/17参照',
   en:'Regulated domain large-scale config without defined SLA targets. In finance/health, availability and RTO/RPO must be explicit per regulations. See docs/17',
   fix:{f:'success',s:'可用性 99.9% / RTO 30分 / RPO 1時間'},
   why_ja:'金融・医療・法務・行政ドメインでは、SLA（可用性目標）・RTO（目標復旧時間）・RPO（目標復旧時点）を契約や規制文書で明示する義務があります。未定義のまま運用を開始すると、障害時の責任範囲が不明確になり法的リスクが発生します。',
   why_en:'In finance, health, legal, and government domains, SLA (availability), RTO (recovery time), and RPO (recovery point) must be documented in contracts or regulatory filings. Operating without defined targets creates legal risk when outages occur.'},
  {id:'obs-no-log-retention',p:['scale','purpose'],lv:'info',
   t:function(a){
    var ents=(a.data_entities||'').split(/[,、]/).filter(function(e){return e.trim();});
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isRegulated=/fintech|health|legal|government|insurance/i.test(dom);
    var hasRetention=/log.*retent|ログ保持|log.*polic|保管期間|retention.*polic/i.test((a.mvp_features||'')+(a.data_entities||''));
    return a.scale==='large'&&ents.length>=10&&isRegulated&&!hasRetention;},
   ja:'規制ドメインの大規模構成でログ保持ポリシーが未定義です。金融・医療等では監査ログを数年間保持する規制要件があります。docs/17参照',
   en:'Regulated domain large-scale config without log retention policy. Finance/health regulations require audit log retention for multiple years. See docs/17',
   fix:{f:'mvp_features',s:'ログ保持ポリシー (7年/3年)'},
   why_ja:'金融業界（金融商品取引法）では取引記録を7年、医療（HIPAA）では患者記録を6年以上保持する義務があります。ログを自動削除するデフォルト設定のまま運用すると、監査時に証拠が提出できず行政指導の対象になります。',
   why_en:'Finance regulations (e.g., Securities Exchange Act) require 7-year transaction record retention; healthcare (HIPAA) requires 6+ years. Default auto-delete settings can eliminate required evidence, leading to regulatory violations during audits.'},
  // ── ext17: Infrastructure & Reliability (6 INFO) ──
  {id:'db-large-no-read-replica',p:['scale','database'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var db=a.database||'';var isPostgresLike=/postgres|mysql|planetscale|neon/i.test(db);
    var hasReplica=/replica|read.?only|リードレプリカ|read.replica/i.test((a.mvp_features||'')+(a.future_features||''));
    return a.scale==='large'&&isPostgresLike&&ents.length>=10&&!hasReplica;},
   ja:'大規模PostgreSQL/MySQL構成でリードレプリカが未検討です。読み取り負荷の高いクエリをレプリカに分散し、書き込みDBの負荷を軽減することを検討してください。docs/120参照',
   en:'Large PostgreSQL/MySQL config without read replica consideration. Distribute read-heavy queries to replicas to reduce write DB load. See docs/120',
   fix:{f:'future_features',s:'リードレプリカ / Read Replica'},
   why_ja:'大規模アプリでは読み取りクエリが書き込みの5-10倍を占めることが多く、リードレプリカなしでは単一DBがボトルネックになります。PostgreSQLの物理レプリケーションやPlanetScaleのブランチ機能で読み取りスケールを実現できます。',
   why_en:'In large apps, read queries often outnumber writes 5-10x. Without read replicas, a single DB becomes a bottleneck. PostgreSQL physical replication or PlanetScale branching enables read scaling.'},
  {id:'db-no-connection-pool',p:['scale','backend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var be=a.backend||'';var isBaaS=be.indexOf('Firebase')!==-1||be.indexOf('Supabase')!==-1||be.indexOf('Amplify')!==-1;
    var isStatic=be.indexOf('なし')!==-1||be.indexOf('None')!==-1||be.indexOf('static')!==-1;
    var hasPool=/pgbouncer|connection.pool|コネクションプール|prisma.*pool|pool.*size/i.test((a.mvp_features||'')+(a.future_features||''));
    return a.scale==='large'&&!isBaaS&&!isStatic&&ents.length>=10&&!hasPool;},
   ja:'大規模バックエンドでコネクションプールが未設定です。PgBouncer等のプール設定なしでは同時接続数超過によるDB接続エラーが発生します。docs/120参照',
   en:'Large backend without connection pooling. Without PgBouncer or pool config, excessive simultaneous connections cause DB errors. See docs/120',
   fix:{f:'mvp_features',s:'コネクションプール設定 (PgBouncer)'},
   why_ja:'PostgreSQLはデフォルトで100接続が上限です。コネクションプールなしでNode.jsアプリが各リクエストでDB接続を開くと、高負荷時に接続枯渇が発生します。PgBouncerやPrismaのconnection_limitで安全な上限を設定してください。',
   why_en:'PostgreSQL defaults to 100 connections. Without pooling, Node.js apps opening per-request DB connections exhaust the pool under load. Use PgBouncer or Prisma connection_limit to set safe limits.'},
  {id:'fe-large-no-error-boundary',p:['scale','frontend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var fe=a.frontend||'';var isReact=fe.indexOf('React')!==-1||fe.indexOf('Next')!==-1;
    var hasEB=/error.boundary|ErrorBoundary|エラーバウンダリ/i.test((a.mvp_features||'')+(a.future_features||''));
    return isReact&&a.scale==='large'&&ents.length>=10&&!hasEB;},
   ja:'大規模Reactアプリ(10+エンティティ)でError Boundaryが未実装です。未捕捉の例外がUI全体をクラッシュさせるリスクがあります。docs/123参照',
   en:'Large React app (10+ entities) without Error Boundary. Uncaught exceptions can crash the entire UI. See docs/123',
   fix:{f:'mvp_features',s:'Error Boundary実装'},
   why_ja:'Reactでは子コンポーネントでthrowされた例外がError Boundaryで補足されない場合、画面全体が白画面になります。大規模アプリでは非同期データ取得の失敗やAPIエラーが頻発するため、セクション別のError Boundaryが不可欠です。',
   why_en:'In React, exceptions thrown in child components without an Error Boundary result in a full white screen. Large apps frequently encounter async data fetch failures and API errors, making per-section Error Boundaries essential.'},
  {id:'ops-no-rollback-plan',p:['scale','deploy'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var dep=a.deploy||'';var hasRollback=/rollback|blue.green|canary|ロールバック|カナリア/i.test((a.mvp_features||'')+(a.future_features||'')+dep);
    return a.scale==='large'&&ents.length>=10&&!hasRollback;},
   ja:'大規模構成でロールバック戦略が未定義です。Blue-Green deploymentやCanary releaseなどの手法でリリース障害時の迅速な復旧計画を策定してください。docs/117参照',
   en:'Large-scale config without rollback strategy. Define Blue-Green deployment or Canary release for rapid recovery from release failures. See docs/117',
   fix:{f:'future_features',s:'Blue-Greenデプロイ / ロールバック戦略'},
   why_ja:'大規模リリースで問題が発生した場合、ロールバック手順が未定義だと復旧に数時間かかることがあります。Blue-Greenはトラフィック切り替えで即座にロールバック可能、Canaryは段階的なリリースでリスクを最小化します。',
   why_en:'Without a defined rollback procedure, recovering from a bad release in a large system can take hours. Blue-Green enables instant rollback via traffic switching; Canary minimizes risk through phased rollout.'},
  {id:'sec-no-secret-rotation',p:['scale','purpose'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isRegulated=/fintech|health|legal|government|insurance/i.test(dom);
    var hasRotation=/secret.*rotat|rotat.*secret|シークレット.*ローテーション|ローテーション.*シークレット|key.*rotat|rotat.*key/i.test((a.mvp_features||'')+(a.future_features||''));
    return a.scale==='large'&&isRegulated&&ents.length>=10&&!hasRotation;},
   ja:'規制ドメインの大規模構成でシークレットローテーションが未検討です。APIキー・DB認証情報の定期的な自動ローテーションをHashiCorp Vault等で実装してください。docs/121参照',
   en:'Regulated domain large-scale config without secret rotation. Implement automatic periodic rotation of API keys and DB credentials via HashiCorp Vault. See docs/121',
   fix:{f:'future_features',s:'シークレット自動ローテーション'},
   why_ja:'規制業界では認証情報の定期ローテーションが義務付けられることがあります（PCI DSS: 90日以内）。長期間同じシークレットを使い続けると、漏洩時の被害期間が長くなります。HashiCorp VaultやAWS Secrets Managerで自動ローテーションを設定してください。',
   why_en:'Regulated industries often mandate periodic credential rotation (PCI DSS: within 90 days). Long-lived secrets increase breach exposure windows. Use HashiCorp Vault or AWS Secrets Manager for automated rotation.'},
  {id:'perf-large-no-cdn',p:['scale','frontend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var fe=a.frontend||'';var isSPA=fe.indexOf('React')!==-1||fe.indexOf('Vue')!==-1||fe.indexOf('Angular')!==-1||fe.indexOf('Next')!==-1||fe.indexOf('Nuxt')!==-1;
    var dep=a.deploy||'';var hasCDN=/cdn|cloudflare|cloudfront|fastly|CDN/i.test((a.mvp_features||'')+(a.future_features||'')+dep);
    return isSPA&&a.scale==='large'&&ents.length>=10&&!hasCDN;},
   ja:'大規模SPA構成でCDNが未検討です。静的アセットをCDNで配信することでロード時間を50-80%削減できます。Cloudflare/CloudFront等の導入を検討してください。docs/101参照',
   en:'Large SPA config without CDN. Serving static assets via CDN can reduce load time by 50-80%. Consider Cloudflare/CloudFront. See docs/101',
   fix:{f:'future_features',s:'CDN導入 (Cloudflare / CloudFront)'},
   why_ja:'SPAの静的アセット（JS/CSS/画像）をオリジンサーバーから直接配信すると、地理的に遠いユーザーのレイテンシが増大します。CDNはエッジノードでアセットをキャッシュし、世界中のユーザーに低レイテンシで配信します。',
   why_en:'Serving SPA static assets (JS/CSS/images) directly from origin increases latency for geographically distant users. CDNs cache assets at edge nodes for low-latency global delivery. This directly impacts LCP scores in Core Web Vitals.'},
  // ── ext18: Testing Maturity & Quality (2 INFO) ──
  {id:'test-no-coverage-gate',p:['scale','dev_methods'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var dm=a.dev_methods||'';var hasTDD=/TDD|BDD|テスト駆動/i.test(dm);
    var hasCov=/coverage.*gate|カバレッジ.*ゲート|coverageThreshold|coverage.*threshold/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasTDD&&a.scale!=='solo'&&ents.length>=6&&!hasCov;},
   ja:'TDD/BDD採用構成でカバレッジゲートが未設定です。CI/CDパイプラインにcoverageThreshold(Statements 80%/Branches 75%)を設定し品質ゲートとして活用してください。docs/124参照',
   en:'TDD/BDD config without coverage gate. Set coverageThreshold (Statements 80%/Branches 75%) in CI/CD pipeline as quality gate. See docs/124',
   fix:{f:'future_features',s:'カバレッジゲート設定 (80%)'},
   why_ja:'TDDを採用してもカバレッジ閾値がなければ品質基準が曖昧になります。CIでcoverageThresholdを強制することで、テスト漏れを自動検出し「テストを書いたが実は未テスト」状態を防ぎます。',
   why_en:'TDD without coverage thresholds leaves quality standards ambiguous. Enforcing coverageThreshold in CI automatically detects test gaps and prevents "tests written but actually untested" scenarios.'},
  {id:'test-large-no-e2e',p:['scale','frontend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var fe=a.frontend||'';var hasFE=fe.length>0&&fe.indexOf('なし')===-1&&fe.indexOf('None')===-1;
    var hasE2E=/playwright|cypress|e2e|エンドツーエンド|end.to.end/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasFE&&a.scale==='large'&&ents.length>=8&&!hasE2E;},
   ja:'大規模フロントエンド構成でE2Eテストが未設定です。PlaywrightによるE2Eテストでクリティカルユーザーフローを自動検証してください。docs/124参照',
   en:'Large frontend config without E2E tests. Use Playwright E2E tests to automatically verify critical user flows. See docs/124',
   fix:{f:'future_features',s:'Playwright E2Eテスト'},
   why_ja:'大規模アプリではユニットテストだけでは統合バグを見逃します。PlaywrightのE2Eテストはブラウザで実際の操作を再現し、ログイン→決済→確認メールの全フロー検証が可能です。',
   why_en:'In large apps, unit tests alone miss integration bugs. Playwright E2E tests reproduce real browser interactions, validating complete flows like login→payment→confirmation email.'},
  // ── ext18: ML/AI Observability (2 INFO) ──
  {id:'ml-no-model-monitoring',p:['scale','ai_auto'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var ai=a.ai_auto||'';var hasAI=ai.length>0&&ai!=='なし'&&ai!=='なし（手動）'&&/AI|Agent|LLM|ML|オーケストレーター|フル自律|マルチAgent/i.test(ai);
    var hasMonitor=/langfuse|langsmith|helicone|braintrust|model.*monitor|モデル監視|drift|drifting/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasAI&&a.scale!=='solo'&&ents.length>=6&&!hasMonitor;},
   ja:'AI/LLM統合構成でモデル監視が未設定です。Langfuse/LangSmith等でプロンプト品質・レイテンシ・コスト・ドリフトを継続的に監視してください。docs/115参照',
   en:'AI/LLM integration without model monitoring. Continuously monitor prompt quality, latency, cost & drift using Langfuse/LangSmith. See docs/115',
   fix:{f:'future_features',s:'LLMモニタリング (Langfuse)'},
   why_ja:'LLMは同じプロンプトでも時間経過で出力品質が変化します（モデルドリフト）。Langfuseでレイテンシ・コスト・ハルシネーション率をトラッキングし、プロンプトのA/Bテストや改善を継続的に実施してください。',
   why_en:'LLMs experience output quality drift over time even with identical prompts. Track latency, cost, and hallucination rates via Langfuse, and continuously A/B test and improve prompts.'},
  {id:'ai-no-eval-framework',p:['scale','ai_auto'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var ai=a.ai_auto||'';var hasLLM=/オーケストレーター|フル自律|マルチAgent|Orchestrator|FullAuto|MultiAgent/i.test(ai);
    var hasEval=/eval|evaluation|評価フレームワーク|golden.*test|promptfoo|braintrust/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasLLM&&a.scale!=='solo'&&ents.length>=6&&!hasEval;},
   ja:'高度なAIエージェント構成で評価フレームワークが未設定です。Promptfoo/Braintrust等でゴールデンセットテストと回帰評価を実施してください。docs/115参照',
   en:'Advanced AI agent config without evaluation framework. Implement golden set tests and regression evaluation using Promptfoo/Braintrust. See docs/115',
   fix:{f:'future_features',s:'LLM評価フレームワーク (Promptfoo)'},
   why_ja:'オーケストレーターやマルチエージェント構成では、個々のエージェントの品質低下が全体に波及します。Promptfooでゴールデンセットテストを設定し、プロンプト変更の影響を自動評価してください。',
   why_en:'In orchestrator/multi-agent configs, quality degradation in individual agents cascades to the whole system. Use Promptfoo golden set tests to automatically evaluate the impact of prompt changes.'},
  // ── ext18: Accessibility & Cache Strategy (2 INFO) ──
  {id:'a11y-no-wcag-target',p:['scale','frontend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var fe=a.frontend||'';var hasFE=fe.indexOf('React')!==-1||fe.indexOf('Vue')!==-1||fe.indexOf('Angular')!==-1||fe.indexOf('Next')!==-1||fe.indexOf('Nuxt')!==-1;
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isPublic=/education|gov|welfare|health|government|福祉|教育|行政/i.test(dom)||(a.target||'').includes('一般');
    var hasA11y=/wcag|a11y|アクセシビリティ|axe|screen.*reader|スクリーンリーダー/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasFE&&isPublic&&a.scale!=='solo'&&ents.length>=6&&!hasA11y;},
   ja:'公共・教育・福祉ドメインのUI構成でWCAG 2.1 AAアクセシビリティ目標が未設定です。axe-coreによる自動テスト導入とスクリーンリーダー対応を検討してください。docs/20参照',
   en:'Public/education/welfare domain UI without WCAG 2.1 AA accessibility target. Consider axe-core automated testing and screen reader support. See docs/20',
   fix:{f:'future_features',s:'WCAG 2.1 AA対応 (axe-core)'},
   why_ja:'教育・行政・福祉分野では障害者差別解消法やJIS X 8341-3に基づくアクセシビリティ対応が求められます。axe-coreをCI/CDに組み込むことで、色コントラスト・ARIAラベル・キーボード操作の不備を自動検出できます。',
   why_en:'Education, government, and welfare sectors require accessibility compliance under disability discrimination laws and WCAG standards. Integrating axe-core in CI/CD automatically detects color contrast, ARIA label, and keyboard navigation issues.'},
  {id:'cache-large-no-redis',p:['scale','backend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var be=a.backend||'';var isBaaS=be.indexOf('Firebase')!==-1||be.indexOf('Supabase')!==-1||be.indexOf('Amplify')!==-1;
    var isStatic=be.indexOf('なし')!==-1||be.indexOf('None')!==-1;
    var dom=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
    var isHighTraffic=/ec|saas|content|community|marketplace|analytics/i.test(dom);
    var hasCache=/redis|memcached|キャッシュ|cache.*layer|upstash/i.test((a.mvp_features||'')+(a.future_features||''));
    return !isBaaS&&!isStatic&&isHighTraffic&&a.scale==='large'&&ents.length>=8&&!hasCache;},
   ja:'高トラフィックドメインの大規模構成でキャッシュ層が未設定です。Redis/Upstash等によるセッション・APIレスポンス・データキャッシュを実装してください。docs/120参照',
   en:'High-traffic domain large config without cache layer. Implement session, API response & data caching via Redis/Upstash. See docs/120',
   fix:{f:'future_features',s:'Redisキャッシュ層 (Upstash)'},
   why_ja:'ECサイトやSaaSの大規模構成では、DBへの同一クエリが秒間数百回発生することがあります。Redisでセッションとよく使うAPIレスポンスをキャッシュすることで、DBレイテンシを90%以上削減できます。',
   why_en:'Large-scale e-commerce and SaaS systems can receive hundreds of identical DB queries per second. Caching sessions and frequently-used API responses in Redis reduces DB latency by 90%+.'},
  // ── ext18: Message Queue & Feature Flag (2 INFO) ──
  {id:'queue-no-deadletter',p:['scale','backend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var hasMQ=/queue|bullmq|rabbitmq|kafka|sqs|pubsub|キュー|メッセージ/i.test((a.mvp_features||'')+(a.future_features||''));
    var hasDLQ=/dead.?letter|dlq|デッドレター/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasMQ&&a.scale!=='solo'&&ents.length>=6&&!hasDLQ;},
   ja:'メッセージキュー構成でDead Letter Queue(DLQ)が未設定です。処理失敗メッセージの隔離・再試行戦略としてDLQを必ず設定してください。docs/120参照',
   en:'Message queue config without Dead Letter Queue (DLQ). Always configure DLQ for isolating and retrying failed messages. See docs/120',
   fix:{f:'future_features',s:'Dead Letter Queue (DLQ) 設定'},
   why_ja:'DLQなしのキュー構成では、処理失敗メッセージが無限再試行ループに入り、後続メッセージをブロックします。DLQで失敗メッセージを隔離し、アラートを受けて手動調査・再送信を行うことで信頼性が向上します。',
   why_en:'Queue configs without DLQ cause failed messages to enter infinite retry loops, blocking subsequent messages. Isolating failed messages in DLQ, receiving alerts, and enabling manual investigation/resubmission improves reliability.'},
  {id:'feat-flag-no-cleanup',p:['scale','dev_methods'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var hasFeatFlag=/feature.flag|feature.*toggle|フィーチャーフラグ|LaunchDarkly|flagsmith|unleash/i.test((a.mvp_features||'')+(a.future_features||''));
    var hasCleanup=/flag.*cleanup|フラグ.*削除|フラグ.*ライフサイクル|stale.*flag|flag.*lifecycle/i.test((a.mvp_features||'')+(a.future_features||''));
    return hasFeatFlag&&a.scale!=='solo'&&ents.length>=6&&!hasCleanup;},
   ja:'フィーチャーフラグ使用構成でフラグライフサイクル管理が未設定です。古いフラグの定期削除ルールを設定しコードの複雑性増大を防いでください。',
   en:'Feature flag config without flag lifecycle management. Set up regular stale flag removal rules to prevent code complexity growth.',
   fix:{f:'future_features',s:'フィーチャーフラグ ライフサイクル管理'},
   why_ja:'フィーチャーフラグを削除せず放置すると、条件分岐が積み重なりコードの認知負荷が増大します（Martin Fowler "Feature Toggle" アンチパターン）。各フラグにTTLと所有者を設定し、四半期ごとに棚卸しを実施してください。',
   why_en:'Unremoved feature flags accumulate conditional branches, increasing cognitive load (Martin Fowler\'s "Feature Toggle" anti-pattern). Set TTL and owners for each flag and conduct quarterly inventory reviews.'},
  // ── 参考資料ベース品質改善 (2 INFO) ──
  {id:'api-realtime-http-polling',p:['scale','backend'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var hasRT=/realtime|リアルタイム|chat|チャット|notification|通知|push/i.test((a.purpose||'')+(a.mvp_features||''));
    var hasWS=/WebSocket|websocket|socket\.io|sse|server.sent/i.test((a.backend||'')+(a.mvp_features||'')+(a.future_features||''));
    var isBaaS=/Supabase|Firebase|Convex/i.test(a.backend||'');
    var isNode=/Express|Fastify|NestJS|Hono|Bun|Deno/i.test(a.backend||'');
    return hasRT&&!hasWS&&!isBaaS&&isNode&&a.scale==='large'&&ents.length>=6;},
   ja:'リアルタイム機能 + Node.js + large構成でWebSocket/SSEが未検討です。HTTP長時間ポーリングはスケール時に接続数コストが高く、WebSocketまたはSSEへの移行を推奨します。docs/83, docs/120参照',
   en:'Realtime features + Node.js + large scale without WebSocket/SSE consideration. HTTP long-polling is costly at scale. Recommend migrating to WebSocket or SSE. See docs/83, docs/120',
   fix:{f:'future_features',s:'WebSocket / SSE リアルタイム実装'},
   why_ja:'HTTPポーリングでは各クライアントが定期的に新規コネクションを確立するため、1000同時接続で毎分60,000リクエストが発生します。WebSocketは1接続を維持し続けるためサーバーコストを大幅に削減できます。',
   why_en:'HTTP polling generates ~60,000 requests/min with 1,000 concurrent clients (1 req/sec each). WebSocket maintains 1 persistent connection per client, dramatically reducing server load.'},
  {id:'sec-large-no-authz-model',p:['scale','data_entities'],lv:'info',
   t:function(a){var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var isBaaS=/Supabase|Firebase|Convex/i.test(a.backend||'');
    var hasAuthzModel=/RBAC|ABAC|ACL|RLS|認可モデル|authz|authorization.model|権限設計/i.test((a.mvp_features||'')+(a.future_features||'')+(a.purpose||''));
    return a.scale==='large'&&ents.length>=10&&!isBaaS&&!hasAuthzModel;},
   ja:'large構成 + 10エンティティ以上で認可モデルが未設計です。RBACをベースにABACを補完するハイブリッドアプローチを推奨します。docs/43, docs/119参照',
   en:'Large scale + 10+ entities without authorization model design. Recommend RBAC-base + ABAC-supplement hybrid approach. See docs/43, docs/119',
   fix:{f:'future_features',s:'RBAC + ABAC 認可モデル設計'},
   why_ja:'エンティティ数が10を超えると、単純なロールベース管理では「ロール爆発」が発生します。RBAC（粗粒度のロール制御）とABAC（細粒度の属性ベース制御）を組み合わせることで、柔軟かつ管理可能な権限設計が実現できます。',
   why_en:'With 10+ entities, pure role-based management causes "role explosion". Combining RBAC (coarse-grained role control) with ABAC (fine-grained attribute-based control) achieves flexible yet manageable permission design.'},
  {id:'ai-high-risk-no-xai',p:['ai_auto','purpose'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    if(ents.length<6)return false;
    var purpose=(a.purpose||'').toLowerCase();
    var isHighRisk=/医療|health|病院|クリニック|fintech|金融|保険|insurance|法務|legal|弁護士/.test(purpose);
    var hasXAI=/xai|shap|lime|説明可能|explainab|interpret/i.test((a.mvp_features||'')+(a.future_features||'')+(purpose));
    return isHighRisk&&!hasXAI;},
   ja:'高リスクドメインのAI機能にXAI/説明可能性設計がありません。EU AI Act Article 13により高リスクAIは意思決定の透明性・説明が義務付けられます。docs/98-2参照',
   en:'AI features in high-risk domain without XAI/explainability design. EU AI Act Article 13 mandates transparency and explanation for high-risk AI decisions. See docs/98-2',
   fix:{f:'future_features',s:'XAI/説明可能性 (SHAP/LIME) 実装'},
   why_ja:'医療・金融・法務ドメインのAIは「高リスク」に分類され、EU AI ActはSHAP等の技術的手段による判断根拠の提供を義務付けます。未対応は規制違反リスクとなります。',
   why_en:'AI in medical/financial/legal domains is classified "high-risk" under EU AI Act, requiring explanation of decisions via SHAP etc. Non-compliance creates regulatory risk.'},
  {id:'ai-no-cost-monitoring',p:['ai_auto','scale'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    var ents=(a.data_entities||'').split(',').map(function(e){return e.trim();}).filter(Boolean);
    var hasMonitoring=/langfuse|helicone|cost.track|token.count|ai_cost|コスト監視|トークン/i.test((a.mvp_features||'')+(a.future_features||''));
    return a.scale==='large'&&ents.length>=8&&!hasMonitoring;},
   ja:'large構成のAI機能にLLMコスト監視・予算アラート設定が確認できません。大規模運用ではトークンコストが急増するリスクがあります。docs/106-2参照',
   en:'Large-scale AI features without LLM cost monitoring or budget alerts. Token costs can spike rapidly at scale. See docs/106-2',
   fix:{f:'future_features',s:'LLMコスト監視 (Langfuse/Helicone)'},
   why_ja:'AI機能は使用量に比例してコストが線形増加します。大規模システムでは月次コストが予算の10倍を超えることがあり、早期の監視体制構築が不可欠です。',
   why_en:'AI costs scale linearly with usage. At large scale, monthly costs can exceed 10x budget. Early monitoring infrastructure is essential to prevent cost runaway.'},
  {id:'ai-agent-no-boundary',p:['ai_auto','scale'],lv:'warn',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    var isAgent=/orchestrator|オーケストレーター|multi.?agent|マルチ.?エージェント/i.test(aiAuto);
    if(!isAgent)return false;
    var isSolo=a.scale==='solo';
    if(isSolo)return false;
    var hasBoundary=/agent.?boundary|permission.?matrix|zero.?trust|read.?only|権限境界|最小権限|エージェント.*監査/i.test((a.mvp_features||'')+(a.future_features||''));
    return !hasBoundary;},
   ja:'マルチエージェント/オーケストレーター構成に権限境界・監査設定が未定義です。エージェントの権限昇格・データ漏洩リスクを防ぐためゼロトラスト設計が必要です。docs/43参照',
   en:'Multi-agent/orchestrator configuration without permission boundaries or audit settings. Zero-trust design required to prevent privilege escalation and data leakage. See docs/43',
   fix:{f:'future_features',s:'エージェント権限境界・ゼロトラスト設計'},
   why_ja:'エージェントは自律的に行動するため、従来の認証モデルでは不十分です。各エージェントを「信頼しない」原則で設計し、全アクションを監査証跡に記録することが重要です。',
   why_en:'Agents act autonomously, making traditional auth models insufficient. Design each agent with "never trust" principles and log all actions to an immutable audit trail.'},
  {id:'ai-no-fairness-pipeline',p:['ai_auto','purpose'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    var purpose=(a.purpose||'').toLowerCase();
    var isHighRisk=/医療|health|病院|クリニック|fintech|金融|保険|insurance|法務|legal|弁護士|採用|hiring/.test(purpose);
    var hasFairness=/fairness|公平性|fairlearn|bias.detection|バイアス検出|demographic.parity/i.test((a.mvp_features||'')+(a.future_features||''));
    return isHighRisk&&!hasFairness;},
   ja:'高リスクドメインのAI機能にバイアス/フェアネスパイプラインが未設定です。Fairlearnによる定量的フェアネス評価とCI/CDフェアネスゲートの実装を推奨します。docs/129参照',
   en:'AI features in high-risk domain without bias/fairness pipeline. Recommend Fairlearn-based quantitative fairness evaluation and CI/CD fairness gates. See docs/129',
   fix:{f:'future_features',s:'フェアネスパイプライン (Fairlearn) 実装'},
   why_ja:'医療・金融・採用ドメインのAIは差別的結果を生む可能性があります。Demographic Parityなどの定量指標で定期検証し、閾値超過時に自動再学習トリガーを設けることが重要です。',
   why_en:'AI in medical/financial/hiring domains can produce discriminatory outcomes. Regular quantitative checks with metrics like Demographic Parity and automated retraining triggers are essential.'},
  {id:'ai-large-no-governance',p:['ai_auto','scale'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    if(a.scale!=='large')return false;
    var hasGov=/ai.?governance|aiガバナンス|ai.?review.?board|ai審査委員会|risk.?classification|リスク分類/i.test((a.mvp_features||'')+(a.future_features||'')+(a.purpose||''));
    return !hasGov;},
   ja:'large構成のAI機能にAIガバナンスフレームワークが未設定です。AI審査委員会・リスク分類・AI影響評価 (AIA) の実装を推奨します。docs/130参照',
   en:'Large-scale AI without AI governance framework. Recommend AI Review Board, risk classification, and AI Impact Assessment (AIA). See docs/130',
   fix:{f:'future_features',s:'AIガバナンスフレームワーク (AI Review Board)'},
   why_ja:'大規模AIシステムは単一障害点になりえます。AI審査委員会で承認プロセスを標準化し、ISO/IEC 42001やNIST AI RMFに準拠した管理体制を構築することが組織リスク管理の基盤です。',
   why_en:'Large-scale AI systems can become single points of failure. Standardize approval via an AI Review Board and build management aligned with ISO/IEC 42001 and NIST AI RMF.'},
  {id:'ai-no-drift-monitoring',p:['ai_auto','scale'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    if(a.scale==='solo')return false;
    var hasDrift=/drift|retraining|再学習|evidently|psi|distribution.shift|分布変化|concept.drift/i.test((a.mvp_features||'')+(a.future_features||''));
    return !hasDrift;},
   ja:'AI機能にドリフト検出・自動再学習パイプラインが未設定です。Evidently AIによる定期的なデータ/コンセプトドリフト監視を推奨します。docs/131参照',
   en:'AI features without drift detection or automated retraining pipeline. Recommend periodic data/concept drift monitoring via Evidently AI. See docs/131',
   fix:{f:'future_features',s:'ドリフト検出・自動再学習 (Evidently AI)'},
   why_ja:'AIモデルは時間経過とともに性能が劣化します（コンセプトドリフト）。PSI>0.2などの閾値監視と自動再学習パイプラインにより、モデル品質を持続的に維持できます。',
   why_en:'AI model performance degrades over time (concept drift). Threshold monitoring like PSI>0.2 with automated retraining pipelines enables sustained model quality maintenance.'},
  // ── v9.9 Phase D: Mobile / Frontend / AI boundary rules (+6) ──
  {id:'mob-flutter-firebase-auth-mismatch',p:['mobile','auth','backend'],lv:'warn',
   t:function(a){
    if(!inc(a.mobile,'Flutter'))return false;
    if(!inc(a.auth,'Firebase Auth'))return false;
    if(inc(a.backend,'Firebase')||inc(a.backend,'Supabase'))return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    if(/custom auth|jwt/i.test(feats))return false;
    return true;},
   ja:'Flutter + Firebase AuthをBaaS以外のバックエンドで使用しています。カスタムトークン検証が必要です',
   en:'Flutter + Firebase Auth used with non-BaaS backend. Custom token verification required',
   fix:{f:'auth',s:'Better Auth (JWT)'},
   why_ja:'Firebase AuthのIDトークンはバックエンドでfirebase-admin SDKによる検証が必要です。BaaS以外ではこの検証実装が漏れやすく、認証バイパス脆弱性につながります。',
   why_en:'Firebase Auth ID tokens require backend verification via firebase-admin SDK. Without BaaS, this verification is often missed, leading to auth bypass vulnerabilities.'},
  {id:'fe-spa-baas-realtime-scale',p:['frontend','backend','scale'],lv:'info',
   t:function(a){
    if(!/vite|vue.*vite|svelte.*kit/i.test(a.frontend||''))return false;
    if(!/supabase|firebase/i.test(a.backend||''))return false;
    if((a.scale||'medium')!=='large')return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    if(/connection pool|fan.out|接続プール|ファンアウト/i.test(feats))return false;
    return true;},
   ja:'大規模SPA + BaaS構成ではリアルタイム接続のファンアウト問題が発生する可能性があります',
   en:'Large-scale SPA + BaaS: realtime fan-out issues possible at scale',
   fix:{f:'future_features',s:'WebSocket接続プール管理'},
   why_ja:'Supabase/FirebaseのリアルタイムリスナーはクライアントごとにWebSocket接続を確立します。大規模では接続数爆発 (10k+)が発生し、レート制限やコスト増大の原因になります。',
   why_en:'Supabase/Firebase realtime listeners open one WebSocket per client. At scale, connection explosion (10k+) causes rate-limiting and cost spikes.'},
  {id:'ai-large-no-rate-limit',p:['ai_auto','scale'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    if((a.scale||'medium')!=='large')return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    if(/rate.?limit|throttl|レートリミット|スロットル/i.test(feats))return false;
    return true;},
   ja:'大規模AI機能にレートリミットが設定されていません。LLMエンドポイントのコスト爆発を防ぐため設定を推奨します',
   en:'Large-scale AI without rate limiting. Recommend configuring LLM endpoint rate limits to prevent cost explosion',
   fix:{f:'future_features',s:'LLMエンドポイントレートリミット'},
   why_ja:'LLMエンドポイントへの無制限リクエストは月数万ドルのコスト爆発を招きます。ユーザーごとのリクエスト数制限とトークンバジェット管理で予防できます。',
   why_en:'Unrestricted LLM endpoint requests can cause cost explosion running thousands of dollars/month. Per-user request limits and token budget management prevent this.'},
  {id:'ai-agent-no-fallback',p:['ai_auto','backend'],lv:'info',
   t:function(a){
    var aiAuto=a.ai_auto||'';
    if(!aiAuto||/なし|none/i.test(aiAuto))return false;
    if(!/agent|orchestrat|オーケストレ|マルチ/i.test(aiAuto))return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    if(/fallback|retry|circuit.?breaker|フォールバック|リトライ/i.test(feats))return false;
    return true;},
   ja:'AIエージェント/オーケストレーターにフォールバック・リトライ戦略が設定されていません',
   en:'AI agent/orchestrator without fallback or retry strategy configured',
   fix:{f:'future_features',s:'AIエージェントフォールバック・リトライ戦略'},
   why_ja:'LLM APIは断続的な障害(タイムアウト/レート制限/モデル過負荷)が発生します。エクスポネンシャルバックオフとサーキットブレーカーで信頼性を確保してください。',
   why_en:'LLM APIs have intermittent failures (timeouts, rate limits, model overload). Exponential backoff and circuit breakers ensure reliability.'},
  {id:'fe-large-no-ssr',p:['frontend','scale'],lv:'info',
   t:function(a){
    if((a.scale||'medium')!=='large')return false;
    if(!/react.*vite|vite.*react|vue.*vite|vite.*vue/i.test(a.frontend||''))return false;
    if(/next|nuxt|astro/i.test(a.frontend||''))return false;
    return true;},
   ja:'大規模SPAにSSRフレームワーク(Next.js/Nuxt/Astro)がありません。SEO・初期ロードパフォーマンスの改善を検討してください',
   en:'Large-scale SPA without SSR framework (Next.js/Nuxt/Astro). Consider for SEO & initial load performance',
   fix:{f:'frontend',s:'React + Next.js'},
   why_ja:'大規模SPA (React/Vue Vite) は初回コンテンツ表示が遅く、SEOスコアが低下します。Next.js/Nuxt等のSSRはFCP・LCPメトリクスを大幅改善します。',
   why_en:'Large SPAs (React/Vue Vite) suffer slow first content paint and poor SEO scores. Next.js/Nuxt SSR significantly improves FCP/LCP metrics.'},
  {id:'mob-payment-no-ssl-pin',p:['mobile','payment'],lv:'info',
   t:function(a){
    if(!a.mobile||/なし|none|PWA/i.test(a.mobile))return false;
    if(!/flutter|expo|react.native/i.test(a.mobile))return false;
    if(!a.payment||/なし|none/i.test(a.payment))return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    if(/ssl.pin|certificate.pin|証明書ピン/i.test(feats))return false;
    return true;},
   ja:'モバイル決済アプリにSSL Pinningが設定されていません。中間者攻撃対策を推奨します',
   en:'Mobile payment app without SSL Certificate Pinning. Recommend MITM protection',
   fix:{f:'future_features',s:'SSL Certificate Pinning (モバイル決済保護)'},
   why_ja:'モバイル決済アプリはMITM攻撃の標的になります。SSL/TLS証明書ピンニングにより、偽証明書による通信傍受を防止できます。Flutter: security_pinningパッケージ。',
   why_en:'Mobile payment apps are MITM targets. SSL certificate pinning prevents interception via forged certificates. Flutter: security_pinning package.'},
  {id:'fe-css-framework-conflict',p:['frontend'],lv:'warn',
   t:function(a){
    var fe=(a.frontend||'').toLowerCase();
    var feats=(a.mvp_features||'').toLowerCase();
    var hasTailwind=/tailwind/i.test(fe)||/tailwind/i.test(feats);
    var hasBootstrap=/bootstrap/i.test(fe)||/bootstrap/i.test(feats);
    return hasTailwind&&hasBootstrap;},
   ja:'TailwindCSSとBootstrapを同時使用するとCSS競合が発生します。いずれか一方に統一してください',
   en:'Using Tailwind CSS and Bootstrap together causes CSS conflicts. Unify to one framework',
   fix:{f:'mvp_features',s:'TailwindCSS (Bootstrap 削除)'},
   why_ja:'TailwindのユーティリティクラスとBootstrapのコンポーネントスタイルはCSS優先度で競合し、意図しないスタイル崩れが発生します。バンドルサイズも不必要に増加します。',
   why_en:'Tailwind utility classes and Bootstrap component styles conflict in CSS specificity, causing unintended style breakage and unnecessary bundle size increase.'},
  {id:'be-serverless-cold-start',p:['backend','deploy'],lv:'info',
   t:function(a){
    var deploy=(a.deploy||'').toLowerCase();
    var be=(a.backend||'').toLowerCase();
    var isServerless=/lambda|workers|vercel|netlify|cloud.function/i.test(deploy);
    var isHeavyFW=/nestjs|spring|django/i.test(be);
    return isServerless&&isHeavyFW;},
   ja:'サーバーレス環境でNestJS/Spring/Djangoを使うとコールドスタート遅延が発生します (1-5秒)',
   en:'NestJS/Spring/Django on serverless causes cold start latency (1-5 seconds)',
   fix:{f:'backend',s:'Hono (軽量・コールドスタート最小)'},
   why_ja:'NestJS等の重量フレームワークは起動時に大量のDIコンテナ初期化が走り、コールドスタートが1-5秒になります。Honoは5-50msで起動します。',
   why_en:'Heavy frameworks like NestJS initialize large DI containers at startup, causing 1-5s cold starts. Hono starts in 5-50ms.'},
  {id:'be-serverless-db-pool',p:['backend','deploy','database'],lv:'warn',
   t:function(a){
    var deploy=(a.deploy||'');
    var db=(a.database||'');
    var isServerless=/lambda|workers|Vercel|Netlify|Cloud Function/i.test(deploy);
    var isRDB=/PostgreSQL|MySQL|Neon|Supabase/i.test(db);
    var isBaaS=/Supabase|Firebase|Convex/i.test(a.backend||'');
    if(isBaaS)return false;
    var feats=(a.mvp_features||'')+(a.future_features||'');
    var hasPool=/pgbouncer|prisma.accelerate|connection.pool|接続プール/i.test(feats);
    return isServerless&&isRDB&&!hasPool;},
   ja:'サーバーレス環境でRDBを使用する際はコネクションプールが必要です (PgBouncer / Prisma Accelerate)',
   en:'RDB on serverless requires connection pooling (PgBouncer / Prisma Accelerate)',
   fix:{f:'future_features',s:'Prisma Accelerate (コネクションプール)'},
   why_ja:'サーバーレス関数は各リクエストで新規DBコネクションを張るため、コネクション枯渇が発生します。PgBouncer/Prisma Accelerateで接続を再利用してください。',
   why_en:'Serverless functions open a new DB connection per request, causing connection exhaustion. Use PgBouncer or Prisma Accelerate to pool connections.'},
  {id:'test-framework-conflict',p:['dev_methods'],lv:'warn',
   t:function(a){
    var methods=(a.dev_methods||'').toLowerCase();
    var hasJest=/jest/i.test(methods);
    var hasVitest=/vitest/i.test(methods);
    return hasJest&&hasVitest;},
   ja:'JestとVitestを同時指定しています。テストフレームワークは1つに統一してください',
   en:'Both Jest and Vitest are specified. Unify to a single test framework',
   fix:{f:'dev_methods',s:'Vitest (Viteプロジェクト推奨)'},
   why_ja:'JestとVitestは設定・モジュール解決が異なり、同時使用するとトランスパイル競合やCI設定の重複が発生します。Viteを使う場合はVitestに統一してください。',
   why_en:'Jest and Vitest differ in config and module resolution. Concurrent use causes transpile conflicts and CI config duplication. Unify to Vitest for Vite projects.'},
  {id:'auth-clerk-flutter-mismatch',p:['auth','mobile'],lv:'info',
   t:function(a){
    var hasClerk=/clerk/i.test(a.auth||'');
    var hasFlutter=/flutter/i.test(a.mobile||'');
    return hasClerk&&hasFlutter;},
   ja:'ClerkはFlutter向けの公式SDKが限定的です。Firebase Auth / Supabase Authの使用を検討してください',
   en:'Clerk has limited official Flutter SDK support. Consider Firebase Auth or Supabase Auth',
   fix:{f:'auth',s:'Firebase Authentication'},
   why_ja:'ClerkはWebフレームワーク(Next.js等)向けに最適化されており、Flutter向けSDKはサードパーティ依存です。公式サポートのFirebase Auth/Supabase Authを推奨します。',
   why_en:'Clerk is optimized for web (Next.js etc.) and Flutter SDK relies on third parties. Firebase Auth / Supabase Auth offer full official Flutter support.'},
  {id:'fe-ssr-missing-csp',p:['frontend'],lv:'info',
   t:function(a){
    var fe=(a.frontend||'');
    var isSSR=/Next\.js|Nuxt/i.test(fe);
    var feats=(a.mvp_features||'')+(a.future_features||'');
    var hasCsp=/CSP|content.security|コンテンツセキュリティ/i.test(feats);
    return isSSR&&!hasCsp;},
   ja:'Next.js/NuxtのSSRアプリにCSP設定が見当たりません。XSS防止のため設定を推奨します',
   en:'No CSP configuration found for Next.js/Nuxt SSR app. Recommended for XSS prevention',
   fix:{f:'future_features',s:'Content Security Policy (CSP) 設定'},
   why_ja:'SSRアプリはクライアント/サーバー両サイドでスクリプト実行が発生します。CSPヘッダーでインラインスクリプト・外部スクリプトを制限し、XSSの影響範囲を最小化します。',
   why_en:'SSR apps execute scripts on both client and server sides. CSP headers restrict inline and external scripts, minimizing XSS attack surface.'},
  // v9.11 Phase E: domain coverage & DB partitioning rules (+4)
  {id:'db-mongo-no-schema-validation',p:['database'],lv:'info',
   t:function(a){
    var db=(a.database||'');
    var feats=(a.mvp_features||'')+(a.future_features||'');
    return /MongoDB|Mongo/i.test(db)&&!/schema.validat|スキーマバリデーション|mongoose|zod|yup/i.test(feats);},
   ja:'MongoDBを使用していますがスキーマバリデーション設定が見当たりません。Mongooseのスキーマ定義またはアプリ層のバリデーションを推奨します',
   en:'MongoDB detected but no schema validation found. Mongoose schema definitions or app-layer validation (Zod/Yup) recommended',
   fix:{f:'future_features',s:'MongoDBスキーマバリデーション (Mongoose / Zod)'},
   why_ja:'MongoDBのスキーマレス設計は柔軟ですが、バリデーションなしでは不正データがDBに混入します。Mongooseスキーマ+カスタムバリデーターで整合性を確保できます。',
   why_en:'MongoDB\'s schema-less design is flexible, but without validation, invalid data enters the DB. Mongoose schema + custom validators ensure integrity.'},
  {id:'test-no-contract-test',p:['backend','scale'],lv:'info',
   t:function(a){
    var scale=a.scale||'medium';
    var be=(a.backend||'');
    var feats=(a.mvp_features||'')+(a.future_features||'');
    var isMicro=/NestJS|Express|Spring|FastAPI|Django/i.test(be);
    var hasContract=/contract.test|Pact|コントラクト/i.test(feats);
    return scale==='large'&&isMicro&&!hasContract;},
   ja:'マイクロサービス構成 (large規模) でコントラクトテストが未設定です。サービス間APIの結合破損を早期検出するためPactの導入を推奨します',
   en:'Microservice setup (large scale) lacks contract testing. Recommend Pact to detect cross-service API contract breaks early',
   fix:{f:'future_features',s:'コントラクトテスト (Pact)'},
   why_ja:'マイクロサービスが増えるとAPIの変更がConsumerを静かに壊します。PactのConsumer-Driven Contractで変更前に結合破損を検出できます。',
   why_en:'As microservices grow, API changes silently break consumers. Pact Consumer-Driven Contracts detect breakage before deployment.'},
  {id:'obs-no-domain-metrics',p:['purpose','backend','scale'],lv:'info',
   t:function(a){
    var feats=(a.mvp_features||'')+(a.future_features||'');
    var hasDomainMetrics=/KPI|SLO|SLI|ビジネスメトリクス|business.metric|domain.metric|ドメインメトリクス/i.test(feats);
    return !hasDomainMetrics;},
   ja:'ドメイン固有ビジネスメトリクスの設定が見当たりません。技術メトリクスに加えてKPI監視を設定することでシステム価値を可視化できます',
   en:'No domain-specific business metrics detected. Adding KPI monitoring alongside technical metrics makes system value visible',
   fix:{f:'future_features',s:'ドメインKPIダッシュボード (Grafana / Datadog)'},
   why_ja:'技術メトリクス (CPU/メモリ) だけでは事業インパクトが見えません。コンバージョン率・成約率などのKPIを監視することで障害の事業影響を即座に把握できます。',
   why_en:'Technical metrics (CPU/memory) don\'t show business impact. Monitoring KPIs like conversion rate enables instant assessment of business impact from incidents.'},
  {id:'db-large-no-partitioning',p:['database','scale'],lv:'warn',
   t:function(a){
    var scale=a.scale||'medium';
    var db=(a.database||'');
    var feats=(a.mvp_features||'')+(a.future_features||'');
    var isRDB=/PostgreSQL|MySQL|MariaDB/i.test(db);
    var hasPartition=/partition|sharding|シャーディング|パーティシ/i.test(feats);
    var hasHighVol=/audit.log|AuditLog|event.log|EventLog|センサー|IoT|ログ収集/i.test((a.data_entities||'')+(feats));
    return scale==='large'&&isRDB&&!hasPartition&&hasHighVol;},
   ja:'large規模 + 高ボリュームエンティティ (監査ログ/イベント/センサー) でDBパーティショニング戦略が未定義です',
   en:'Large-scale high-volume entities (audit logs/events/sensors) detected but no DB partitioning strategy defined',
   fix:{f:'future_features',s:'DBパーティショニング戦略 (Range/Hash)'},
   why_ja:'監査ログ・イベントテーブルはGB/月単位で増加します。Rangeパーティションで古いデータを自動アーカイブし、クエリはパーティション刈り込みで高速化されます。',
   why_en:'Audit log and event tables grow GB/month. Range partitioning auto-archives old data; queries accelerate via partition pruning.'},
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
