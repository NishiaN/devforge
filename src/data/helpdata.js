/* ═══ HELP DATA ═══ */
const HELP_DATA={
  purpose:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(domain==='saas')hints.push({icon:'📈',name:_ja?'SaaSドメイン':'SaaS Domain',hint:_ja?'SaaS系と認識。マルチテナントRLS・サブスク設計ドキュメントが自動生成されます。':'SaaS domain detected. Multi-tenant RLS and subscription design docs will be auto-generated.',_ctx:true});
      if(domain==='ai')hints.push({icon:'🤖',name:_ja?'AIドメイン':'AI Domain',hint:_ja?'AI系と認識。AIエージェント設計書・プロンプトゲノム・LLMOpsパイプラインが自動生成されます。':'AI domain detected. AI agent design, Prompt Genome, and LLMOps pipeline will be auto-generated.',_ctx:true});
      if(domain==='fintech'||domain==='health'||domain==='legal')hints.push({icon:'🔐',name:_ja?'コンプライアンス系':'Compliance Domain',hint:_ja?'規制業種と認識。セキュリティ設計・コンプライアンスチェックリストが強化されます。':'Regulated industry detected. Security design and compliance checklist will be enhanced.',_ctx:true});
      return hints;
    },
    ja:{title:'プロジェクトの目的',desc:'「誰が・何を・なぜ」使うのかを1文で表現しましょう。',example:'例: "フリーランスが見積書を5分で作成できるSaaS"',
      expertHints:[
        {icon:'🎨',name:'クリエイティブ',hint:'このアプリで、ユーザーにどんな「物語」を体験させたいですか？'},
        {icon:'⚙️',name:'技術専門家',hint:'既存の技術で不可能だったことを、新技術でどう実現しますか？'},
        {icon:'📊',name:'ビジネス',hint:'ユーザーは今、何にお金を払っていて、それより何が優れていますか？'},
        {icon:'📚',name:'学術研究者',hint:'この問題について、学術的に最も有効とされるアプローチは何ですか？'},
        {icon:'🔬',name:'科学者',hint:'この仮説を検証するために、最小のMVPで測定すべきデータは何ですか？'},
        {icon:'👤',name:'ユーザー',hint:'ターゲットが朝起きて最初に感じるフラストレーションは何ですか？'},
        {icon:'💥',name:'ディスラプター',hint:'この業界で「当たり前」とされていることを、もし逆にしたらどうなりますか？'},
        {icon:'😄',name:'ユーモリスト',hint:'このアプリを使うとき、思わず笑顔になる瞬間はどこですか？'},
        {icon:'🧭',name:'冒険家',hint:'もし失敗のリスクがゼロなら、最も大胆な機能は何ですか？'}
      ]},
    en:{title:'Project Purpose',desc:'Express "who uses what and why" in one sentence.',example:'e.g. "A SaaS where freelancers create invoices in 5 min"',
      expertHints:[
        {icon:'🎨',name:'Creative',hint:'What "story" do you want users to experience with this app?'},
        {icon:'⚙️',name:'Technical',hint:'What was previously impossible that new technology now enables?'},
        {icon:'📊',name:'Business',hint:'What do users currently pay for, and how are you better?'},
        {icon:'📚',name:'Academic',hint:'What is the most evidence-backed approach to this problem?'},
        {icon:'🔬',name:'Scientist',hint:'What is the minimum measurable data your MVP must capture to validate this hypothesis?'},
        {icon:'👤',name:'User Rep',hint:'What is the first frustration your target user feels when they wake up?'},
        {icon:'💥',name:'Disruptor',hint:'What if you did the exact opposite of what this industry considers "standard"?'},
        {icon:'😄',name:'Humorist',hint:'At what moment will users smile unexpectedly when using this app?'},
        {icon:'🧭',name:'Adventurer',hint:'If failure risk were zero, what is the boldest feature you would build?'}
      ]}
  },
  target:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(domain==='education')hints.push({icon:'🎓',name:_ja?'教育系ターゲット':'Education Target',hint:_ja?'教育系 → 学習者(B2C)か企業研修(B2B)かで機能設計が大きく変わります。最初に明確化を。':'Education → B2C learners vs B2B corporate training drives very different feature sets. Clarify first.',_ctx:true});
      if(domain==='saas')hints.push({icon:'💼',name:_ja?'SaaSターゲット':'SaaS Target',hint:_ja?'SaaS系 → 個人(B2C)か中小企業(SMB)か大企業(Enterprise)かでプライシング・機能が変わります。':'SaaS → Individual (B2C) vs SMB vs Enterprise changes pricing tiers and feature requirements.',_ctx:true});
      return hints;
    },
    ja:{title:'ターゲットユーザー',desc:'具体的なペルソナを2〜3人イメージすると設計がブレません。',example:'例: "30代エンジニア、副業で受注管理に困っている"',
      expertHints:[
        {icon:'🎨',name:'クリエイティブ',hint:'あなたのユーザーが今日体験した「小さな感動」は何でしたか？'},
        {icon:'⚙️',name:'技術専門家',hint:'ターゲットユーザーの技術リテラシーは？その制約がアーキテクチャに与える影響は？'},
        {icon:'📊',name:'ビジネス',hint:'このユーザー層の年間「不満解消」予算はいくらですか？'},
        {icon:'👤',name:'ユーザー',hint:'ユーザーが現在使っているワークアラウンドは何ですか？（Excel/メモ帳/脳内管理）'},
        {icon:'💥',name:'ディスラプター',hint:'「こんな人は使わない」と思っていたユーザー層が実は最大の市場では？'},
        {icon:'🔬',name:'科学者',hint:'ユーザー行動の中で「習慣化」できる部分はどこですか？'},
        {icon:'🧭',name:'冒険家',hint:'3年後にこのアプリの「熱狂的ファン」になっているのはどんな人ですか？'}
      ]},
    en:{title:'Target Users',desc:'Imagine 2-3 specific personas to keep your design focused.',example:'e.g. "30s engineer struggling with freelance order management"',
      expertHints:[
        {icon:'🎨',name:'Creative',hint:'What was a small moment of delight your users experienced today?'},
        {icon:'⚙️',name:'Technical',hint:'What is this user\'s tech literacy, and how does that constrain your architecture?'},
        {icon:'📊',name:'Business',hint:'What is this user segment\'s annual budget for "solving frustrations"?'},
        {icon:'👤',name:'User Rep',hint:'What workaround are users currently using? (Excel/notepad/memory)'},
        {icon:'💥',name:'Disruptor',hint:'Could the user segment you thought "would never use this" actually be your biggest market?'},
        {icon:'🔬',name:'Scientist',hint:'Which part of user behavior can be turned into a habit loop?'},
        {icon:'🧭',name:'Adventurer',hint:'Who will be the "super fan" of this app in 3 years?'}
      ]}
  },
  success:{
    ja:{title:'成功指標（KPI）',desc:'プロジェクト種別に応じた指標を自動提案。📈成長 💰収益 🔄継続 😊満足 ⚡技術 の10カテゴリから3〜5つ選択。',example:'例: EC→"GMV月100万" / 教育→"完了率80%+"'},
    en:{title:'Success Metrics (KPI)',desc:'Auto-suggested by project type. Pick 3-5 from 10 categories: 📈Growth 💰Revenue 🔄Retention 😊Satisfaction ⚡Perf.',example:'e.g. EC→"$10K GMV" / Education→"80%+ completion"'}
  },
  scope_out:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var feats=a.mvp_features||'';
      if(/決済|payment|stripe/i.test(feats))hints.push({icon:'💳',name:_ja?'決済含む予定':'Payment in MVP',hint:_ja?'MVP機能に決済が含まれています。v2以降に延期するとリリースが2週間早まる可能性があります。':'Payment is in your MVP. Moving it to v2 could accelerate initial release by 2 weeks.',_ctx:true});
      if(/モバイル|mobile|expo/i.test(feats))hints.push({icon:'📱',name:_ja?'モバイル含む予定':'Mobile in MVP',hint:_ja?'MVP機能にモバイルが含まれています。まずWebで検証→モバイル展開が最短ルートです。':'Mobile is in your MVP. Validate with Web first, then expand to mobile — fastest route.',_ctx:true});
      return hints;
    },
    ja:{title:'スコープ外',desc:'「やらないこと」を決めるのがMVP成功の鍵。',example:'例: "v1ではモバイルアプリは作らない"',
      expertHints:[
        {icon:'📊',name:'ビジネス',hint:'「これは後でいい」と言えるものを全てリストアップ。半分以上あるはずです。'},
        {icon:'👤',name:'ユーザー',hint:'最初の1週間でユーザーが絶対に使わない機能は？それは全てスコープ外です。'},
        {icon:'💥',name:'ディスラプター',hint:'機能を1つだけ残すとしたら？それ以外は全てスコープ外の候補。'},
        {icon:'⚙️',name:'技術専門家',hint:'実装に1週間以上かかる機能はv1のスコープ外にしてください。'},
        {icon:'🧭',name:'冒険家',hint:'スコープ外を明確にしないプロジェクトの90%は完成しません。'}
      ]},
    en:{title:'Out of Scope',desc:'Deciding what NOT to do is key to MVP success.',example:'e.g. "No mobile app in v1"',
      expertHints:[
        {icon:'📊',name:'Business',hint:'"This can wait" — list everything that qualifies. There should be more than half.'},
        {icon:'👤',name:'User Rep',hint:'Which features won\'t users touch in the first week? Those are all out of scope.'},
        {icon:'💥',name:'Disruptor',hint:'If you could only keep one feature, what would it be? Everything else is a scope-out candidate.'},
        {icon:'⚙️',name:'Technical',hint:'Any feature taking more than a week to implement belongs in v2, not v1.'},
        {icon:'🧭',name:'Adventurer',hint:'90% of projects without a clear scope-out never ship. Define it now.'}
      ]}
  },
  deadline:{
    ja:{title:'リリース目標',desc:'2週間=超MVP、1ヶ月=基本MVP、3ヶ月=本格版。',example:'TIP: 2週間でまずデプロイ、その後改善サイクルが最速'},
    en:{title:'Release Target',desc:'2 weeks = ultra MVP, 1 month = basic MVP, 3 months = full version.',example:'TIP: Deploy in 2 weeks first, then iterate fast'}
  },
  frontend:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      var lv=typeof S!=='undefined'?S.skillLv:2;
      if(domain==='education'||domain==='content')hints.push({icon:'⚡',name:_ja?'SSR推奨':'SSR Recommended',hint:_ja?'教育/コンテンツ系はSEOが重要 → Next.jsのSSR/ISRでページランク有利になります。':'Education/content sites need SEO → Next.js SSR/ISR gives better page ranking.',_ctx:true});
      if(domain==='ec'||domain==='marketplace')hints.push({icon:'🛒',name:_ja?'EC向け':'EC Fit',hint:_ja?'EC系はISR(増分静的再生成)で商品ページを高速化 → Next.js推奨。':'EC sites benefit from ISR for fast product pages → Next.js recommended.',_ctx:true});
      if(domain==='ai')hints.push({icon:'🤖',name:_ja?'AI向け':'AI App',hint:_ja?'AI系アプリはVercel AI SDK対応のNext.js/SvelteKitが最速構成です。':'AI apps: Next.js or SvelteKit with Vercel AI SDK is the fastest stack.',_ctx:true});
      if(domain==='portfolio')hints.push({icon:'📄',name:_ja?'静的推奨':'Static Recommended',hint:_ja?'ポートフォリオは静的サイト(Astro/Next.js)で十分。サーバーコスト¥0です。':'Portfolio sites: static (Astro/Next.js) is enough — zero server cost.',_ctx:true});
      if(lv<=1)hints.push({icon:'🔰',name:_ja?'初心者向け':'For Beginners',hint:_ja?'初心者はReact(Vite)から始めると学習コスト最小。Next.jsはステップアップ後がおすすめ。':'Beginners: start with React (Vite) — lowest learning curve. Move to Next.js later.',_ctx:true});
      return hints;
    },
    ja:{title:'フロントエンド',desc:'既に知っている技術を選ぶのが最速。',example:'初心者→React、SSR→Next.js',link:'https://stateofjs.com'},
    en:{title:'Frontend',desc:'Choosing a tech you already know is fastest.',example:'Beginner→React, SSR→Next.js',link:'https://stateofjs.com'}
  },
  backend:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var fe=a.frontend||'';
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      var lv=typeof S!=='undefined'?S.skillLv:2;
      if(/Next\.js|NextJS/i.test(fe))hints.push({icon:'⚡',name:_ja?'Next.js連携':'Next.js Pair',hint:_ja?'Next.js選択済み → API Routes/Server Actionsでバックエンド不要なケースも。追加が必要ならSupabaseが最速。':'Next.js chosen → API Routes/Server Actions may eliminate a separate backend. If needed, Supabase is fastest.',_ctx:true});
      if(domain==='ai')hints.push({icon:'🤖',name:_ja?'AIアプリ向け':'AI App',hint:_ja?'AIアプリ → FastAPI(Python)またはVercel AI SDK(Node)が2026年のデファクト。LangChainはPython版が成熟。':'AI app → FastAPI (Python) or Vercel AI SDK (Node) are 2026 defacto. LangChain Python is mature.',_ctx:true});
      if(domain==='fintech'||domain==='insurance'||domain==='legal')hints.push({icon:'🏦',name:_ja?'金融/法務系':'Fintech/Legal',hint:_ja?'金融/法務系 → Spring Boot(Java)またはNestJS(TypeScript)が型安全性と監査ログで業界標準です。':'Fintech/Legal → Spring Boot (Java) or NestJS (TypeScript) are industry standards for type safety and audit logging.',_ctx:true});
      if(lv<=1)hints.push({icon:'🔰',name:_ja?'初心者推奨':'Beginner Rec',hint:_ja?'スキルLv初心者 → Firebase/Supabaseを強く推奨。サーバーレスでデプロイ・認証・DBが即日稼働します。':'Skill Lv Beginner → Firebase/Supabase strongly recommended. Serverless: deploy + auth + DB in one day.',_ctx:true});
      return hints;
    },
    ja:{title:'バックエンド/DB',desc:'BaaS(Firebase/Supabase)はサーバーコード不要で最速。',example:'静的サイト→なし、認証あり→Firebase/Supabase'},
    en:{title:'Backend/DB',desc:'BaaS (Firebase/Supabase) needs no server code — fastest path.',example:'Static→None, Auth needed→Firebase/Supabase'}
  },
  ai_tools:{
    ja:{title:'AIツール',desc:'Cursor/Antigravity=AI IDE、Claude Code/Aider=CLI、Copilot/Tabnine=補完拡張、OpenRouter=API統合ハブ。',example:'推奨: Cursor or Antigravity + Claude Code'},
    en:{title:'AI Tools',desc:'Cursor/Antigravity=AI IDE, Claude Code/Aider=CLI, Copilot/Tabnine=completion ext, OpenRouter=API hub.',example:'Recommended: Cursor or Antigravity + Claude Code'}
  },
  deploy:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var fe=a.frontend||'';
      var be=a.backend||'';
      if(/Next\.js|NextJS/i.test(fe)&&!/Firebase|Supabase/i.test(be))hints.push({icon:'▲',name:_ja?'Vercel最速':'Vercel Fastest',hint:_ja?'Next.js選択済み → Vercelが最速デプロイ先。Vercel公式はNext.js作者の会社で最適化済み。':'Next.js chosen → Vercel is the fastest deployment. Vercel created Next.js — fully optimized.',_ctx:true});
      if(/Firebase/i.test(be))hints.push({icon:'🔥',name:_ja?'Firebase Hosting':'Firebase Hosting',hint:_ja?'Firebase選択済み → Firebase Hostingが自然な選択。全機能がGCPエコシステムで統合されます。':'Firebase chosen → Firebase Hosting is the natural fit. All features integrate in GCP ecosystem.',_ctx:true});
      if(/Next\.js|NextJS/i.test(fe)&&/Supabase/i.test(be))hints.push({icon:'💚',name:_ja?'最速構成':'Fastest Stack',hint:_ja?'Next.js + Supabase → Vercelデプロイが最速。Edge Functions + Supabase Connection Poolingで本番対応完了。':'Next.js + Supabase → Vercel deploy is fastest. Edge Functions + Supabase pooling = production-ready.',_ctx:true});
      if(/Spring|Java|Go|Rust|C#/i.test(be))hints.push({icon:'🚂',name:_ja?'カスタムサーバー':'Custom Server',hint:_ja?'カスタムサーバー → Railway/Fly.io/Renderがコンテナデプロイで最も手軽。k8sは後で検討可。':'Custom server → Railway / Fly.io / Render for easy container deploy. Consider k8s later.',_ctx:true});
      return hints;
    },
    ja:{title:'デプロイ先',desc:'Vercel/Netlify=無料枠で十分。',example:'Next.js→Vercel、静的→Netlify'},
    en:{title:'Deployment',desc:'Vercel/Netlify free tier is enough to start.',example:'Next.js→Vercel, Static→Netlify'}
  },
  dev_methods:{
    ja:{title:'駆動開発手法',desc:'TDD=テスト先行、BDD=振る舞い設計、DDD=ドメインモデル中心。',example:'推奨: TDD（必須）+ BDD'},
    en:{title:'Dev Methodologies',desc:'TDD=test-first, BDD=behavior-driven, DDD=domain-model-centric.',example:'Recommended: TDD (essential) + BDD'}
  },
  mvp_features:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(domain==='saas')hints.push({icon:'💡',name:_ja?'SaaS MVP核心':'SaaS MVP Core',hint:_ja?'SaaS系 → 認証 + ダッシュボード + サブスク管理が最小MVP構成。この3つがあれば課金開始可能。':'SaaS → Auth + Dashboard + Subscription = minimum MVP. These 3 enable billing from day 1.',_ctx:true});
      if(domain==='ec'||domain==='marketplace')hints.push({icon:'🛒',name:_ja?'EC MVP核心':'EC MVP Core',hint:_ja?'EC系 → 商品一覧 + カート + 決済が核心三点。在庫管理・レビューはv2以降で十分。':'EC → Product listing + Cart + Checkout = core triad. Inventory and reviews → v2.',_ctx:true});
      if(domain==='education')hints.push({icon:'📚',name:_ja?'教育MVP核心':'Education MVP Core',hint:_ja?'教育系 → コース一覧 + レッスン + 進捗トラッキングが最小MVP。認定証はv2。':'Education → Course list + Lessons + Progress tracking = minimum MVP. Certificates → v2.',_ctx:true});
      return hints;
    },
    ja:{title:'MVP機能',desc:'3〜5個に絞る。「これがないと使えない」機能だけ選択。',example:'最小: 認証 + メイン機能1つ + 設定',
      expertHints:[
        {icon:'⚙️',name:'技術専門家',hint:'この機能リストの中で、技術的に最もリスクが高いものはどれですか？先に検証すべきです。'},
        {icon:'📊',name:'ビジネス',hint:'各機能の「開発コスト/収益貢献度」比率を計算してください。ROI最大の機能だけ残す。'},
        {icon:'👤',name:'ユーザー',hint:'ユーザーが「これができないなら使わない」と言う機能は何ですか？それだけ作ればいい。'},
        {icon:'💥',name:'ディスラプター',hint:'競合が全部持っている機能を全て外したら、何が残りますか？それが差別化の核心。'},
        {icon:'🔬',name:'科学者',hint:'この機能の中で「使われるか検証できていない」ものはどれですか？仮説として明示してください。'},
        {icon:'🧭',name:'冒険家',hint:'今の機能リストを半分に削ったとき、残すのはどれですか？'},
        {icon:'🔐',name:'APIアーキテクト',hint:'各機能はAPIエンドポイントに対応しますか？「GET /posts」「POST /orders」のように列挙するとOpenAPI仕様(docs/84)が自動生成されます。'}
      ]},
    en:{title:'MVP Features',desc:'Narrow to 3-5. Only pick features users cannot live without.',example:'Minimum: Auth + 1 core feature + Settings',
      expertHints:[
        {icon:'⚙️',name:'Technical',hint:'Which feature has the highest technical risk? Validate that one first.'},
        {icon:'📊',name:'Business',hint:'Calculate development cost vs revenue contribution for each feature. Keep only the highest ROI ones.'},
        {icon:'👤',name:'User Rep',hint:'Which feature would make users say "then I won\'t use it"? Build only that.'},
        {icon:'💥',name:'Disruptor',hint:'If you removed every feature competitors have, what remains? That\'s your differentiation core.'},
        {icon:'🔬',name:'Scientist',hint:'Which features are unvalidated hypotheses? Flag them explicitly.'},
        {icon:'🧭',name:'Adventurer',hint:'If you cut this list in half, which ones survive?'},
        {icon:'🔐',name:'API Architect',hint:'Does each feature map to an API endpoint? Listing them as "GET /posts, POST /orders" helps auto-generate the OpenAPI spec (docs/84).'}
      ]}
  },
  org_model:{
    ja:{title:'組織・テナント構造',desc:'マルチテナント選択でRLSポリシー・組織ERモデル・承認フローが自動生成されます。',example:'SaaS: マルチテナント(RLS) / 社内ツール: シングルテナント'},
    en:{title:'Organization & Tenant Structure',desc:'Multi-tenant selection auto-generates RLS policies, org ER model, and approval workflows.',example:'SaaS: Multi-tenant (RLS) / Internal tool: Single-tenant'}
  },
  future_features:{
    ja:{title:'将来追加機能',desc:'Phase 2, 3として計画。MVPリリース後に再評価。',example:'課金→PMF確認後、モバイル→DAU 1000+時'},
    en:{title:'Future Features',desc:'Plan as Phase 2-3. Re-evaluate after MVP launch.',example:'Billing→after PMF, Mobile→at DAU 1000+'}
  },
  data_entities:{
    ja:{title:'データテーブル',desc:'英語・単数形・PascalCaseが標準。',example:'User, Post, Comment（Usersではなく単数形）'},
    en:{title:'Data Tables',desc:'English, singular, PascalCase is standard.',example:'User, Post, Comment (singular, not Users)'}
  },
  auth:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var be=a.backend||'';
      var fe=a.frontend||'';
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(/Supabase/i.test(be))hints.push({icon:'💚',name:_ja?'Supabase Auth':'Supabase Auth',hint:_ja?'Supabase選択済み → Supabase Authが最適。Magic Link/OAuth/MFAが組み込み済みです。':'Supabase chosen → Supabase Auth is the natural fit. Magic Link / OAuth / MFA built-in.',_ctx:true});
      if(/Firebase/i.test(be))hints.push({icon:'🔥',name:_ja?'Firebase Auth':'Firebase Auth',hint:_ja?'Firebase選択済み → Firebase Authが最適。Google/Apple/匿名ログインが1行追加で対応可能です。':'Firebase chosen → Firebase Auth is best. Google/Apple/anonymous sign-in with one line.',_ctx:true});
      if(/Next\.js|NextJS/i.test(be)||/Next\.js|NextJS/i.test(fe))hints.push({icon:'🔑',name:_ja?'Auth.js推奨':'Auth.js Rec',hint:_ja?'Next.js環境 → Auth.js(旧NextAuth)がエコシステム標準。JWTセッション + 40+プロバイダー対応。':'Next.js → Auth.js (formerly NextAuth) is the ecosystem standard. JWT + 40+ providers.',_ctx:true});
      if(domain==='fintech'||domain==='health'||domain==='hr')hints.push({icon:'🔐',name:_ja?'MFA必須':'MFA Required',hint:_ja?'金融/医療/HR系 → MFA(多要素認証)は業界標準。TOTP + SMS + 生体認証の多層実装を推奨します。':'Fintech/Health/HR → MFA is industry standard. TOTP + SMS + biometric multi-layer implementation.',_ctx:true});
      return hints;
    },
    ja:{title:'認証方式',desc:'OAuth(Google/GitHub)は実装簡単でUX向上。',example:'最小: メール/PW + Google OAuth'},
    en:{title:'Authentication',desc:'OAuth (Google/GitHub) is easy to implement and improves UX.',example:'Minimum: Email/PW + Google OAuth'}
  },
  screens:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(domain==='saas')hints.push({icon:'🖥️',name:_ja?'SaaS画面構成':'SaaS Screen Set',hint:_ja?'SaaS基本画面: LP→サインアップ→メール認証→ダッシュボード→設定→請求。この6画面がコア。':'SaaS core screens: LP→Sign-up→Email verify→Dashboard→Settings→Billing. These 6 are the core.',_ctx:true});
      if(domain==='ec'||domain==='marketplace')hints.push({icon:'🛒',name:_ja?'EC画面構成':'EC Screen Set',hint:_ja?'EC基本画面: LP→商品一覧→商品詳細→カート→決済→注文確認→マイページ。':'EC core screens: LP→Product list→Product detail→Cart→Checkout→Order confirm→My page.',_ctx:true});
      return hints;
    },
    ja:{title:'主要画面',desc:'ユーザーフローに沿って画面を洗い出し。',example:'LP → ログイン → ダッシュボード → 詳細',
      expertHints:[
        {icon:'🎨',name:'クリエイティブ',hint:'ユーザーが初めてアプリを開いた瞬間、どんな感情を感じてほしいですか？その感情から逆算して画面を設計してください。'},
        {icon:'⚙️',name:'技術専門家',hint:'この画面リストで、サーバーサイドレンダリングが必要な画面はどれですか？最初から分類しておくとアーキテクチャが安定します。'},
        {icon:'👤',name:'ユーザー',hint:'ユーザーが最も頻繁に訪問する画面はどれですか？そこに全エネルギーを集中してください。'},
        {icon:'💥',name:'ディスラプター',hint:'「ダッシュボード」や「設定」を作らないとしたら、本当に必要な画面は何ですか？'},
        {icon:'😄',name:'ユーモリスト',hint:'この画面の中で「思わずスクリーンショットを撮りたくなる」デザインができる画面はどれですか？'},
        {icon:'🧭',name:'冒険家',hint:'一番難しい画面から作り始めたら、後の全てが簡単に感じます。どれが最難関ですか？'},
        {icon:'⚡',name:'パフォーマンス',hint:'どの画面がCore Web Vitals (LCP/INP/CLS)の問題を起こしやすいですか？早期特定でバンドル最適化(docs/101)が活きます。'}
      ]},
    en:{title:'Key Screens',desc:'Map out screens following the user flow.',example:'LP → Login → Dashboard → Detail',
      expertHints:[
        {icon:'🎨',name:'Creative',hint:'What emotion should users feel the moment they first open your app? Design backwards from that emotion.'},
        {icon:'⚙️',name:'Technical',hint:'Which screens need server-side rendering? Classify early to stabilize your architecture.'},
        {icon:'👤',name:'User Rep',hint:'Which screen will users visit most frequently? Invest all your energy there.'},
        {icon:'💥',name:'Disruptor',hint:'If you refused to build a "Dashboard" or "Settings", what screens are truly necessary?'},
        {icon:'😄',name:'Humorist',hint:'Which screen could be designed so beautifully that users take screenshots to share?'},
        {icon:'🧭',name:'Adventurer',hint:'Start with the hardest screen first — everything else will feel easy. Which is the hardest?'},
        {icon:'⚡',name:'Performance',hint:'Which screens are most likely to fail Core Web Vitals (LCP/INP/CLS)? Identify them early to apply bundle optimization (docs/101).'}
      ]}
  },
  payment:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var scope=a.scope_out||'';
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(/決済|payment/i.test(scope))hints.push({icon:'🚫',name:_ja?'スコープ外済み':'Already Out',hint:_ja?'スコープ外で決済を除外済み → 「なし」を選択してリリースを速めてください。':'Payment is already out-of-scope → Select "None" to speed up your release.',_ctx:true});
      if(domain==='saas')hints.push({icon:'💳',name:_ja?'SaaS課金':'SaaS Billing',hint:_ja?'SaaS系 → Stripe Billingが定番。サブスク/従量課金/請求書が全て対応しています。':'SaaS → Stripe Billing is standard. Supports subscriptions, usage-based, and invoices.',_ctx:true});
      if(domain==='marketplace')hints.push({icon:'🏪',name:_ja?'マーケット向け':'Marketplace Fit',hint:_ja?'マーケットプレイス → Stripe Connectで出品者への送金・手数料分配が最も簡単です。':'Marketplace → Stripe Connect for seller payouts and fee splitting is easiest.',_ctx:true});
      if(domain==='creator')hints.push({icon:'🎨',name:_ja?'クリエイター向け':'Creator Fit',hint:_ja?'クリエイター系 → Lemon SqueezyはMoR(税代行)付きでグローバル販売に最適です。':'Creator → Lemon Squeezy with MoR (tax handling) is ideal for global sales.',_ctx:true});
      if(domain==='ec')hints.push({icon:'🛒',name:_ja?'EC向け':'EC Fit',hint:_ja?'EC系 → Stripeの標準決済フロー。商品カタログはStripe Productsで管理可能です。':'EC → Stripe standard checkout flow. Manage product catalog with Stripe Products.',_ctx:true});
      return hints;
    },
    ja:{title:'決済・CMS・EC',desc:'Stripe=最も導入しやすい。MoR=税務処理代行。',example:'SaaS→Stripe、グローバル→Paddle'},
    en:{title:'Payment/CMS/EC',desc:'Stripe is easiest to integrate. MoR = Merchant of Record (handles tax).',example:'SaaS→Stripe, Global→Paddle'}
  },
  css_fw:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var fe=a.frontend||'';
      if(/React/i.test(fe))hints.push({icon:'🎨',name:_ja?'React向け':'React Fit',hint:_ja?'React選択済み → shadcn/ui + Tailwind CSSが2026年最強コンボ。コピペで美しいUIが完成します。':'React chosen → shadcn/ui + Tailwind CSS is the 2026 power combo. Copy-paste beautiful UI.',_ctx:true});
      if(/Vue/i.test(fe))hints.push({icon:'💚',name:_ja?'Vue向け':'Vue Fit',hint:_ja?'Vue選択済み → PrimeVue or Nuxt UI + Tailwind CSSが最適な組み合わせです。':'Vue chosen → PrimeVue or Nuxt UI + Tailwind CSS is best fit.',_ctx:true});
      if(/Svelte/i.test(fe))hints.push({icon:'🔥',name:_ja?'Svelte向け':'Svelte Fit',hint:_ja?'Svelte選択済み → Skeleton UI + Tailwind CSSがコミュニティ標準です。':'Svelte chosen → Skeleton UI + Tailwind CSS is the community standard.',_ctx:true});
      if(/Astro/i.test(fe))hints.push({icon:'🚀',name:_ja?'Astro向け':'Astro Fit',hint:_ja?'Astro選択済み → @astrojs/tailwind公式インテグレーションが推奨。UIはShadcn(Astro版)が便利。':'Astro chosen → @astrojs/tailwind official integration recommended. Use Shadcn for Astro.',_ctx:true});
      return hints;
    },
    ja:{title:'CSSフレームワーク',desc:'Tailwind CSSが2026年の事実上の標準。ユーティリティファーストで高速開発。',example:'推奨: Tailwind CSS + shadcn/ui'},
    en:{title:'CSS Framework',desc:'Tailwind CSS is the de facto standard in 2026. Utility-first for rapid dev.',example:'Recommended: Tailwind CSS + shadcn/ui'}
  },
  orm:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var be=a.backend||'';
      var db=a.database||'';
      if(/Supabase|Firebase/i.test(be))hints.push({icon:'☁️',name:_ja?'BaaS不要':'BaaS Skip',hint:_ja?'BaaS(Supabase/Firebase)選択済み → ORMは不要です。BaaS SDKが全てのDB操作を抽象化します。':'BaaS (Supabase/Firebase) chosen → ORM not needed. BaaS SDK abstracts all DB operations.',_ctx:true});
      if(/NestJS/i.test(be))hints.push({icon:'🏗️',name:_ja?'NestJS向け':'NestJS Fit',hint:_ja?'NestJS選択済み → TypeORMがNestJS公式デコレーター統合で最適。PrismaもNestJSで使用可能です。':'NestJS chosen → TypeORM has official NestJS decorator integration. Prisma also works well.',_ctx:true});
      if(/Python|FastAPI|Django/i.test(be))hints.push({icon:'🐍',name:_ja?'Python向け':'Python Fit',hint:_ja?'Pythonバックエンド → SQLAlchemy一択。Django使用時はDjango ORMで代替可能です。':'Python backend → SQLAlchemy is the clear choice. Django users can use Django ORM.',_ctx:true});
      if(/MongoDB/i.test(db))hints.push({icon:'🍃',name:_ja?'MongoDB向け':'MongoDB Fit',hint:_ja?'MongoDB選択済み → PrismaのMongoDB対応(プレビュー)またはMongoose。Drizzle/KyselyはSQL専用で非対応。':'MongoDB chosen → Prisma MongoDB (preview) or Mongoose. Drizzle/Kysely are SQL-only.',_ctx:true});
      if(/Hono|Fastify|Express/i.test(be)&&!/NestJS/i.test(be))hints.push({icon:'⚡',name:_ja?'軽量Node向け':'Lightweight Node',hint:_ja?'軽量Nodeフレームワーク → Drizzle ORMまたはKyselyが最適。型安全SQL生成で軽量さを維持できます。':'Lightweight Node framework → Drizzle ORM or Kysely is best. Type-safe SQL, stays lightweight.',_ctx:true});
      return hints;
    },
    ja:{title:'ORM',desc:'ORMはデータベース操作を型安全に行うためのツール。BaaS使用時は不要。',example:'推奨: Prisma (型安全・Studio付き)'},
    en:{title:'ORM',desc:'ORM enables type-safe database operations. Not needed with BaaS.',example:'Recommended: Prisma (type-safe, Studio included)'}
  },
  dev_env_type:{
    ja:{title:'開発環境タイプ',desc:'BaaS利用時の開発ワークフローを選択します。',example:'ローカル=オフライン開発可能、クラウド=本番相当データ、ハイブリッド=両方'},
    en:{title:'Dev Environment Type',desc:'Choose development workflow when using BaaS.',example:'Local=offline OK, Cloud=production data, Hybrid=both'}
  },
  learning_path:{
    ja:{title:'学習パターン',desc:'技術スタックの組み合わせに基づいた学習パスを選択。',example:'初心者→BaaS、中級→PERN、上級→AI Orchestrator'},
    en:{title:'Learning Path',desc:'Choose a learning path based on your tech stack combination.',example:'Beginner→BaaS, Intermediate→PERN, Advanced→AI Orchestrator'}
  },
  skill_level:{
    ja:{title:'スキルレベル',desc:'選択により質問の選択肢が動的に変化します。Beginner=基本選択肢のみ、Intermediate=中級選択肢追加、Pro=全選択肢解放。途中変更は非推奨。',example:'迷ったらIntermediate。後から選択肢が足りなければProに変更可能'},
    en:{title:'Skill Level',desc:'Your choice dynamically adjusts available options. Beginner=basic options only, Intermediate=adds mid-level options, Pro=unlocks all. Avoid changing mid-project.',example:'If unsure, pick Intermediate. You can switch to Pro later if needed'}
  },
  database:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var be=a.backend||'';
      if(/Supabase/i.test(be))hints.push({icon:'💚',name:_ja?'Supabase連携':'Supabase Match',hint:_ja?'Supabase選択済み → DBはSupabase(PostgreSQL)を選択するとRLS・リアルタイム・Edge Functionsが全自動連携します。':'Supabase chosen → Select Supabase (PostgreSQL) to auto-integrate RLS, realtime, and Edge Functions.',_ctx:true});
      if(/Firebase/i.test(be))hints.push({icon:'🔥',name:_ja?'Firebase連携':'Firebase Match',hint:_ja?'Firebase選択済み → Firestoreを選択。SQLは不要でNoSQLコレクション設計にフォーカスしてください。':'Firebase chosen → Select Firestore. No SQL needed — focus on NoSQL collection design.',_ctx:true});
      if(/Python|FastAPI|Django/i.test(be))hints.push({icon:'🐍',name:_ja?'Python向け':'Python Fit',hint:_ja?'Pythonバックエンド → PostgreSQL + SQLAlchemyが最も成熟した組み合わせ。Alembicでマイグレーション管理。':'Python backend → PostgreSQL + SQLAlchemy is the most mature combo. Alembic for migrations.',_ctx:true});
      if(/Node|Express|NestJS|Hono|Fastify/i.test(be))hints.push({icon:'🟢',name:_ja?'Node向け':'Node Fit',hint:_ja?'Nodeバックエンド → PostgreSQL + Prismaが型安全性とDXで最優秀。Prisma Studioでデータ確認も可能。':'Node backend → PostgreSQL + Prisma wins for type safety and DX. Prisma Studio for data inspection.',_ctx:true});
      return hints;
    },
    ja:{title:'データベース',desc:'PostgreSQL=本格的なRDB（Supabase/Neonで無料運用可）、SQLite=ローカル/組込み用途、MongoDB=NoSQL柔軟なスキーマ。BaaS選択時はBaaS側のDBが使われるため不要。',example:'迷ったらPostgreSQL + Prisma。Supabaseなら無料で本番運用可能'},
    en:{title:'Database',desc:'PostgreSQL=production RDB (free via Supabase/Neon), SQLite=local/embedded, MongoDB=NoSQL flexible schema. Not needed if using BaaS (BaaS provides its own DB).',example:'Default: PostgreSQL + Prisma. Supabase offers free production hosting'}
  },
  mobile:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var fe=a.frontend||'';
      var scope=a.scope_out||'';
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      if(/モバイル|mobile/i.test(scope))hints.push({icon:'🚫',name:_ja?'スコープ外済み':'Already Out',hint:_ja?'スコープ外でモバイルを除外済み → 「なし」を選択してコストを節約してください。':'Mobile is already out-of-scope → Select "None" to save development cost.',_ctx:true});
      if(/React/i.test(fe))hints.push({icon:'📱',name:_ja?'React→Expo':'React → Expo',hint:_ja?'React選択済み → Expo(React Native)でコード最大共有。WebとネイティブでJSX再利用可能です。':'React chosen → Expo (React Native) for maximum code sharing. Reuse JSX between web and native.',_ctx:true});
      if(domain==='devtool'||domain==='analytics')hints.push({icon:'💻',name:_ja?'デスクトップ優先':'Desktop First',hint:_ja?'開発者ツール/分析系 → モバイルよりデスクトップが主戦場。まず「なし」で進めることを推奨します。':'DevTool/Analytics → Desktop is the primary battleground. Starting with "None" is recommended.',_ctx:true});
      return hints;
    },
    ja:{title:'モバイル対応',desc:'PWA=Webベースでインストール不要、Expo=React Native簡易構築（EAS Build対応）、React Native=ネイティブ制御が必要な場合。モバイル不要なら「なし」でOK。',example:'まずPWAで検証、ストア配信が必要になったらExpoに移行が最速ルート'},
    en:{title:'Mobile Support',desc:'PWA=web-based no install needed, Expo=simplified React Native (EAS Build), React Native=when native control needed. Select "None" if mobile is not required.',example:'Start with PWA for validation, migrate to Expo when store distribution is needed'}
  },
  ai_auto:{
    expertHintsFn:function(a,_ja){
      var hints=[];
      var domain=typeof detectDomain==='function'?detectDomain(a.purpose||''):'';
      var lv=typeof S!=='undefined'?S.skillLv:2;
      if(lv<=1)hints.push({icon:'🔰',name:_ja?'初心者向け':'For Beginners',hint:_ja?'スキルLv初心者 → Vibe Codingから始めましょう。AIに「〜を作って」と伝えるだけで開発が進みます。':'Skill Lv Beginner → Start with Vibe Coding. Just tell the AI "build me ..." and development moves forward.',_ctx:true});
      else if(lv>=2&&lv<=4)hints.push({icon:'⚡',name:_ja?'中級向け':'For Intermediate',hint:_ja?'スキルLv中級 → Agentic Dev(Cursor Agent/Cline)でマルチファイル自動編集が劇的に作業効率を向上させます。':'Skill Lv Intermediate → Agentic Dev (Cursor Agent/Cline) for multi-file auto-editing dramatically boosts productivity.',_ctx:true});
      else if(lv>=5)hints.push({icon:'👑',name:_ja?'上級向け':'For Advanced',hint:_ja?'スキルLv上級 → Multi-Agent以上を検討。Claude Code Subagents/Julesで非同期並列開発が可能です。':'Skill Lv Advanced → Consider Multi-Agent+. Claude Code Subagents/Jules enable async parallel development.',_ctx:true});
      if(domain==='ai')hints.push({icon:'🤖',name:_ja?'AIドメイン':'AI Domain',hint:_ja?'AIアプリ開発 → Multi-Agent(複数エージェント並列)が最も相性良好。エージェント監督エージェントのパターンが有効です。':'AI app development → Multi-Agent (parallel agents) has best synergy. Agent-supervises-agent design pattern is effective.',_ctx:true});
      return hints;
    },
    ja:{title:'AI自律開発レベル',desc:'Vibe Coding=AIにざっくり指示してコード生成、Agentic Dev=Cursor Agent/Cline等がマルチファイル自動編集、Multi-Agent=複数Agentが並列作業、Full Autonomous=Claude Code Subagents/Jules等で非同期自律開発。',example:'初心者→Vibe Coding、中級→Agentic Dev、上級→Multi-Agent以上'},
    en:{title:'AI Autonomous Level',desc:'Vibe Coding=rough instructions to AI, Agentic Dev=Cursor Agent/Cline multi-file editing, Multi-Agent=parallel agent work, Full Autonomous=Claude Code Subagents/Jules async development.',example:'Beginner→Vibe Coding, Intermediate→Agentic Dev, Advanced→Multi-Agent+'}
  },
  learning_goal:{
    ja:{title:'学習目標',desc:'このプロジェクトで習得したい技術領域を選択。選択に応じてロードマップの学習パスが最適化されます。',example:'「フルスタック開発」を選ぶとフロントからデプロイまで網羅的なパスが生成されます'},
    en:{title:'Learning Goal',desc:'Select the technical area you want to master through this project. The roadmap learning path optimizes based on your selection.',example:'Choosing "Full-Stack Dev" generates a comprehensive path from frontend to deployment'}
  },
};
