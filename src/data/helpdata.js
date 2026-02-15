/* ═══ HELP DATA ═══ */
const HELP_DATA={
  purpose:{
    ja:{title:'プロジェクトの目的',desc:'「誰が・何を・なぜ」使うのかを1文で表現しましょう。',example:'例: "フリーランスが見積書を5分で作成できるSaaS"'},
    en:{title:'Project Purpose',desc:'Express "who uses what and why" in one sentence.',example:'e.g. "A SaaS where freelancers create invoices in 5 min"'}
  },
  target:{
    ja:{title:'ターゲットユーザー',desc:'具体的なペルソナを2〜3人イメージすると設計がブレません。',example:'例: "30代エンジニア、副業で受注管理に困っている"'},
    en:{title:'Target Users',desc:'Imagine 2-3 specific personas to keep your design focused.',example:'e.g. "30s engineer struggling with freelance order management"'}
  },
  success:{
    ja:{title:'成功指標（KPI）',desc:'プロジェクト種別に応じた指標を自動提案。📈成長 💰収益 🔄継続 😊満足 ⚡技術 の10カテゴリから3〜5つ選択。',example:'例: EC→"GMV月100万" / 教育→"完了率80%+"'},
    en:{title:'Success Metrics (KPI)',desc:'Auto-suggested by project type. Pick 3-5 from 10 categories: 📈Growth 💰Revenue 🔄Retention 😊Satisfaction ⚡Perf.',example:'e.g. EC→"$10K GMV" / Education→"80%+ completion"'}
  },
  scope_out:{
    ja:{title:'スコープ外',desc:'「やらないこと」を決めるのがMVP成功の鍵。',example:'例: "v1ではモバイルアプリは作らない"'},
    en:{title:'Out of Scope',desc:'Deciding what NOT to do is key to MVP success.',example:'e.g. "No mobile app in v1"'}
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
    ja:{title:'MVP機能',desc:'3〜5個に絞る。「これがないと使えない」機能だけ選択。',example:'最小: 認証 + メイン機能1つ + 設定'},
    en:{title:'MVP Features',desc:'Narrow to 3-5. Only pick features users cannot live without.',example:'Minimum: Auth + 1 core feature + Settings'}
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
    ja:{title:'主要画面',desc:'ユーザーフローに沿って画面を洗い出し。',example:'LP → ログイン → ダッシュボード → 詳細'},
    en:{title:'Key Screens',desc:'Map out screens following the user flow.',example:'LP → Login → Dashboard → Detail'}
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
