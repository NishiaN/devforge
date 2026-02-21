/* ═══ HELP DATA ═══ */
const HELP_DATA={
  purpose:{
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
    ja:{title:'フロントエンド',desc:'既に知っている技術を選ぶのが最速。',example:'初心者→React、SSR→Next.js',link:'https://stateofjs.com'},
    en:{title:'Frontend',desc:'Choosing a tech you already know is fastest.',example:'Beginner→React, SSR→Next.js',link:'https://stateofjs.com'}
  },
  backend:{
    ja:{title:'バックエンド/DB',desc:'BaaS(Firebase/Supabase)はサーバーコード不要で最速。',example:'静的サイト→なし、認証あり→Firebase/Supabase'},
    en:{title:'Backend/DB',desc:'BaaS (Firebase/Supabase) needs no server code — fastest path.',example:'Static→None, Auth needed→Firebase/Supabase'}
  },
  ai_tools:{
    ja:{title:'AIツール',desc:'Cursor/Antigravity=AI IDE、Claude Code/Aider=CLI、Copilot/Tabnine=補完拡張、OpenRouter=API統合ハブ。',example:'推奨: Cursor or Antigravity + Claude Code'},
    en:{title:'AI Tools',desc:'Cursor/Antigravity=AI IDE, Claude Code/Aider=CLI, Copilot/Tabnine=completion ext, OpenRouter=API hub.',example:'Recommended: Cursor or Antigravity + Claude Code'}
  },
  deploy:{
    ja:{title:'デプロイ先',desc:'Vercel/Netlify=無料枠で十分。',example:'Next.js→Vercel、静的→Netlify'},
    en:{title:'Deployment',desc:'Vercel/Netlify free tier is enough to start.',example:'Next.js→Vercel, Static→Netlify'}
  },
  dev_methods:{
    ja:{title:'駆動開発手法',desc:'TDD=テスト先行、BDD=振る舞い設計、DDD=ドメインモデル中心。',example:'推奨: TDD（必須）+ BDD'},
    en:{title:'Dev Methodologies',desc:'TDD=test-first, BDD=behavior-driven, DDD=domain-model-centric.',example:'Recommended: TDD (essential) + BDD'}
  },
  mvp_features:{
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
    ja:{title:'認証方式',desc:'OAuth(Google/GitHub)は実装簡単でUX向上。',example:'最小: メール/PW + Google OAuth'},
    en:{title:'Authentication',desc:'OAuth (Google/GitHub) is easy to implement and improves UX.',example:'Minimum: Email/PW + Google OAuth'}
  },
  screens:{
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
    ja:{title:'決済・CMS・EC',desc:'Stripe=最も導入しやすい。MoR=税務処理代行。',example:'SaaS→Stripe、グローバル→Paddle'},
    en:{title:'Payment/CMS/EC',desc:'Stripe is easiest to integrate. MoR = Merchant of Record (handles tax).',example:'SaaS→Stripe, Global→Paddle'}
  },
  css_fw:{
    ja:{title:'CSSフレームワーク',desc:'Tailwind CSSが2026年の事実上の標準。ユーティリティファーストで高速開発。',example:'推奨: Tailwind CSS + shadcn/ui'},
    en:{title:'CSS Framework',desc:'Tailwind CSS is the de facto standard in 2026. Utility-first for rapid dev.',example:'Recommended: Tailwind CSS + shadcn/ui'}
  },
  orm:{
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
    ja:{title:'データベース',desc:'PostgreSQL=本格的なRDB（Supabase/Neonで無料運用可）、SQLite=ローカル/組込み用途、MongoDB=NoSQL柔軟なスキーマ。BaaS選択時はBaaS側のDBが使われるため不要。',example:'迷ったらPostgreSQL + Prisma。Supabaseなら無料で本番運用可能'},
    en:{title:'Database',desc:'PostgreSQL=production RDB (free via Supabase/Neon), SQLite=local/embedded, MongoDB=NoSQL flexible schema. Not needed if using BaaS (BaaS provides its own DB).',example:'Default: PostgreSQL + Prisma. Supabase offers free production hosting'}
  },
  mobile:{
    ja:{title:'モバイル対応',desc:'PWA=Webベースでインストール不要、Expo=React Native簡易構築（EAS Build対応）、React Native=ネイティブ制御が必要な場合。モバイル不要なら「なし」でOK。',example:'まずPWAで検証、ストア配信が必要になったらExpoに移行が最速ルート'},
    en:{title:'Mobile Support',desc:'PWA=web-based no install needed, Expo=simplified React Native (EAS Build), React Native=when native control needed. Select "None" if mobile is not required.',example:'Start with PWA for validation, migrate to Expo when store distribution is needed'}
  },
  ai_auto:{
    ja:{title:'AI自律開発レベル',desc:'Vibe Coding=AIにざっくり指示してコード生成、Agentic Dev=Cursor Agent/Cline等がマルチファイル自動編集、Multi-Agent=複数Agentが並列作業、Full Autonomous=Claude Code Subagents/Jules等で非同期自律開発。',example:'初心者→Vibe Coding、中級→Agentic Dev、上級→Multi-Agent以上'},
    en:{title:'AI Autonomous Level',desc:'Vibe Coding=rough instructions to AI, Agentic Dev=Cursor Agent/Cline multi-file editing, Multi-Agent=parallel agent work, Full Autonomous=Claude Code Subagents/Jules async development.',example:'Beginner→Vibe Coding, Intermediate→Agentic Dev, Advanced→Multi-Agent+'}
  },
  learning_goal:{
    ja:{title:'学習目標',desc:'このプロジェクトで習得したい技術領域を選択。選択に応じてロードマップの学習パスが最適化されます。',example:'「フルスタック開発」を選ぶとフロントからデプロイまで網羅的なパスが生成されます'},
    en:{title:'Learning Goal',desc:'Select the technical area you want to master through this project. The roadmap learning path optimizes based on your selection.',example:'Choosing "Full-Stack Dev" generates a comprehensive path from frontend to deployment'}
  },
};
