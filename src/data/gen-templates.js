/* ═══ GENERATOR TEMPLATES — Bilingual dictionary for Pillar ⑦ Roadmap ═══ */
const GT=(()=>{
const ja={
  none:'なし',
  /* LEARNING_PATH.md */
  lp_title:'学習ロードマップ',lp_skill:'スキルレベル',lp_target:'目標期間',
  l1:'Web基盤',l2:'フロントエンド',l3:'バックエンド',l3m:'モバイル',
  l4:'DevOps',l5:'AI駆動開発',l6:'収益化',l7:'駆動開発手法',l7span:'全期間',
  html5b:'HTML5 基礎（2-4週）',css3b:'CSS3 基礎（3-6週）',jsb:'JavaScript ES6+（4-12週）',
  tsAdv:'TypeScript deep dive',cssAdv:'最新CSS (Container Queries, :has())',
  setup:'セットアップ・基礎',stMgmt:'状態管理',dataFetch:'データフェッチ',
  testing:'テスト',dbDesign:'データベース設計',auth:'認証・認可',
  mobEnv:'環境構築',mobNav:'ナビゲーション・画面設計',
  mobNative:'ネイティブ機能（カメラ/通知）',mobStore:'ストアビルド・提出',
  deploy:'デプロイ',monitor:'モニタリング基盤',aiUse:'活用',
  mcpCfg:'MCP設定・活用',aiOpt:'AI Agent Rules 最適化',practice:'実践',
  billing:'課金フロー実装',opsScale:'運用・スケール',
  /* TECH_STACK_GUIDE.md */
  ts_title:'技術スタックガイド',ts_selected:'選択された技術スタック',
  cat:'カテゴリ',tech:'技術',rationale:'理由',
  feLabel:'フロントエンド',beLabel:'バックエンド',dbLabel:'データベース',
  deployLabel:'デプロイ',mobileLabel:'モバイル',payLabel:'決済/CMS',
  nextR:'SSR/SSG対応、SEO最適化',vueR:'学習コスト低、柔軟性',feGenR:'高性能、エコシステム充実',
  supaR:'BaaS型、高速MVP開発',expR:'軽量、学習コスト低',nestR:'エンタープライズ対応、DI',beGenR:'スケーラブル',
  pgR:'ACID準拠、JSON対応、Supabase互換',dbGenR:'柔軟なスキーマ',
  vercelR:'Next.js最適化、自動デプロイ',deployGenR:'高い柔軟性',
  expoR:'React知識転用、OTA更新',mobGenR:'クロスプラットフォーム対応',
  payR:'SaaS/EC収益化基盤',
  ts_deps:'技術間の関連性',ts_versions:'推奨バージョン',
  /* MOBILE_GUIDE.md */
  mob_title:'モバイル開発ガイド',mob_env:'環境構築',mob_dir:'ディレクトリ構造',
  mob_home:'ホーム画面',mob_explore:'探索画面',mob_profile:'プロフィール',
  mob_root:'ルートレイアウト',mob_eas:'設定',mob_libs:'推奨ライブラリ',
  mob_anim:'アニメーション',mob_list:'高速リスト',mob_img:'画像最適化',
  mob_none:'現在のプロジェクトではモバイル開発は対象外です。\n将来的にExpo (React Native)での対応を推奨します。',
  /* TOOLS_SETUP.md */
  tool_title:'開発ツールセットアップガイド',tool_essential:'必須ツール',
  tool_rec:'推奨',tool_pkgmgr:'パッケージマネージャー',tool_init:'プロジェクト初期化',
  tool_docker:'データベース (Docker使用)',tool_ai:'AIコーディングツール',
  tool_ext:'拡張機能',tool_used:'使用時',tool_vsInst:'VS Code拡張からインストール',
  tool_official:'公式サイトからインストール',tool_env:'環境変数テンプレート',
  /* RESOURCES.md */
  res_title:'学習リソース集',res_official:'公式ドキュメント',
  res_ai:'AI駆動開発',res_bp:'ベストプラクティス',res_docs:'ドキュメント',
  res_proto:'プロトコル',res_patterns:'パターン',
  res_books:'推奨書籍・コース',res_fullstack:'フルスタックWeb開発入門',
  res_tsPractice:'TypeScript実践ガイド',res_design:'で学ぶ設計原則',
  res_saas:'SaaS開発とStripe決済実装',res_headless:'ヘッドレスアーキテクチャ入門',
  res_beg:'初心者向け',res_int:'中級者向け',
  /* MILESTONES.md */
  ms_title:'マイルストーン計画',ms_target:'目標期間',
  ms_m:['環境構築・基礎','コア機能実装','UI/UX・テスト','デプロイ・CI/CD','最適化・モニタリング','本番運用・改善','スケール・次フェーズ'],
  ms_criteria:'マイルストーン達成基準を定義',ms_review:'週次レビュー実施',ms_retro:'振り返り・改善',
  /* AI_WORKFLOW.md */
  aiw_title:'AI駆動開発ワークフローガイド',aiw_flow:'AI開発フロー',
  aiw_s1:'.spec/ を読む',aiw_s2:'タスク選択',aiw_s3:'AI実装',aiw_s4:'レビュー',aiw_s5:'テスト',aiw_s6:'コミット',
  aiw_select:'AIツール使い分け',aiw_task:'タスク',aiw_rec:'推奨ツール',
  aiw_newfile:'新規ファイル作成',aiw_bugfix:'バグ修正',aiw_testgen:'テスト生成',aiw_refactor:'リファクタリング',
  aiw_ctx:'コンテキスト理解',aiw_term:'ターミナル直接操作',aiw_inline:'インライン補完',aiw_multi:'マルチファイル編集',
  aiw_mcp:'MCP活用パターン',aiw_mcp1:'最新ライブラリドキュメント参照',aiw_mcp2:'プロジェクト構造の理解',aiw_mcp3:'E2Eテスト自動化',
  aiw_prompt:'プロンプトテンプレート',aiw_addFeature:'新機能追加',
  aiw_promptText:`.spec/tasks.mdの[タスク名]を実装してください。
.spec/specification.mdの要件に従い、
.spec/technical-plan.mdのアーキテクチャに沿って実装してください。
テストも同時に作成してください。`,
  aiw_bugfixPrompt:'バグ修正',
  aiw_bugfixText:`以下のエラーを修正してください:
[エラー内容を貼り付け]

手順:
1. docs/25_error_logs.mdを参照し、既知の問題か確認
2. 根本原因を特定
3. 修正とテストを実装
4. docs/25_error_logs.mdにエラーを記録`,
  aiw_refactorPrompt:'リファクタリング',
  aiw_refactorText:`以下のコードをリファクタリングしてください:
[対象ファイル/コードを貼り付け]

手順:
1. .spec/specification.mdの要件を再確認
2. 問題点を特定 (SOLID原則違反、重複コード等)
3. 段階的に改善 (テストを壊さない)
4. docs/24_progress.mdを更新`,
  /* AI_AUTONOMOUS.md */
  aia_title:'AI自律開発ガイド',aia_level:'レベル',
  aia_vibe:'Vibe Codingの実践',aia_vibeDesc:'自然言語で意図を伝え、AIが実装する開発スタイル。',
  aia_basic:'基本フロー',
  aia_f1:'意図を明確に伝える',aia_f1ex:'「ユーザー一覧画面を作って」',
  aia_f2:'AIが実装',aia_f2ex:'コード生成・テスト・リファクタリング',
  aia_f3:'レビュー・修正',aia_f3ex:'人間が最終確認',
  aia_f4:'イテレーション',aia_f4ex:'フィードバックを繰り返し',
  aia_tools:'推奨ツール',
  aia_vibe1:'Cursor + Claude: 基本的なVibe Coding',aia_vibe2:'Claude Code: ターミナルベースの自律実装',aia_vibe3:'Antigravity: Agent-first IDE（Editor + Manager View）',
  aia_multi1:'Claude Code Subagents: 並列タスク実行',aia_multi2:'Claude-Flow: マルチAgent協調',aia_multi3:'AGENTS.md: Agent間の役割定義',
  aia_full1:'Devin: 完全自律型AIエンジニア',aia_full2:'Claude Code Tasks: DAGタスク管理',aia_full3:'Gas Town: K8s for AI Agents',aia_async1:'Jules (Google): 非同期コーディングAgent',
  aia_bp:'ベストプラクティス',
  aia_bp1:'.spec/を必ず最初に読ませる',aia_bp2:'小さなタスクに分割する',aia_bp3:'テストを先に書かせる (TDD)',aia_bp4:'コミット前に必ずレビュー',
  aia_none:'現在のプロジェクトではAI自律開発は対象外です。\nまずはAIコーディングツール（',aia_none2:'）の基本活用から始めましょう。',
  /* SAAS_COMMERCE_GUIDE.md */
  sc_title:'SaaS・EC収益化ガイド',sc_selected:'選択',
  sc_compare:'決済プラットフォーム比較',sc_platform:'プラットフォーム',sc_rate:'料率',sc_feat:'特徴',
  sc_stripe:'API最強、カスタマイズ自在',sc_paddle:'SaaS特化、税務自動',sc_lemon:'Stripe傘下、個人開発者向け',
  sc_impl:'Stripe実装ガイド',sc_webhook:'Webhook処理',
  sc_paid:'決済完了',sc_renew:'サブスク更新',sc_cancel:'解約',
  sc_cms:'ヘッドレスCMS実装',sc_ec:'ヘッドレスEC',
  sc_prodMgmt:'商品管理',sc_payment:'決済',sc_ship:'配送',sc_fulfill:'カスタムFulfillment',
  sc_none:'現在のプロジェクトでは決済・EC機能は対象外です。\n将来的にStripe決済やヘッドレスCMSの導入を推奨します。',
  /* Dashboard roadmap labels */
  dRoadDeploy:'デプロイ',dRoadReset:'🔄 リセット',dRoadFiles:'📁 ファイル一覧',dRoadProgress:'📈 全体進捗',
};
const en={
  none:'None',
  lp_title:'Learning Roadmap',lp_skill:'Skill Level',lp_target:'Target',
  l1:'Web Fundamentals',l2:'Frontend',l3:'Backend',l3m:'Mobile',
  l4:'DevOps',l5:'AI-Driven Dev',l6:'Monetization',l7:'Dev Methodologies',l7span:'Entire Duration',
  html5b:'HTML5 Basics (2-4 weeks)',css3b:'CSS3 Basics (3-6 weeks)',jsb:'JavaScript ES6+ (4-12 weeks)',
  tsAdv:'TypeScript deep dive',cssAdv:'Modern CSS (Container Queries, :has())',
  setup:'Setup & Basics',stMgmt:'State Management',dataFetch:'Data Fetching',
  testing:'Testing',dbDesign:'Database Design',auth:'Auth & Authorization',
  mobEnv:'Environment Setup',mobNav:'Navigation & Screen Design',
  mobNative:'Native Features (Camera/Push)',mobStore:'Store Build & Submission',
  deploy:'Deploy',monitor:'Monitoring Setup',aiUse:'Integration',
  mcpCfg:'MCP Configuration',aiOpt:'AI Agent Rules Optimization',practice:'Practice',
  billing:'Billing Flow Implementation',opsScale:'Operations & Scaling',
  ts_title:'Tech Stack Guide',ts_selected:'Selected Tech Stack',
  cat:'Category',tech:'Technology',rationale:'Rationale',
  feLabel:'Frontend',beLabel:'Backend',dbLabel:'Database',
  deployLabel:'Deploy',mobileLabel:'Mobile',payLabel:'Payment/CMS',
  nextR:'SSR/SSG support, SEO optimized',vueR:'Low learning curve, flexible',feGenR:'High performance, rich ecosystem',
  supaR:'BaaS, rapid MVP',expR:'Lightweight, easy to learn',nestR:'Enterprise-grade, DI',beGenR:'Scalable',
  pgR:'ACID compliant, JSON support, Supabase compatible',dbGenR:'Flexible schema',
  vercelR:'Next.js optimized, auto-deploy',deployGenR:'High flexibility',
  expoR:'Reuse React skills, OTA updates',mobGenR:'Cross-platform',
  payR:'SaaS/EC monetization platform',
  ts_deps:'Technology Dependencies',ts_versions:'Recommended Versions',
  mob_title:'Mobile Dev Guide',mob_env:'Environment Setup',mob_dir:'Directory Structure',
  mob_home:'Home screen',mob_explore:'Explore screen',mob_profile:'Profile',
  mob_root:'Root layout',mob_eas:' Config',mob_libs:'Recommended Libraries',
  mob_anim:'Animations',mob_list:'High-perf list',mob_img:'Image optimization',
  mob_none:'Mobile development is not in scope for this project.\nConsider Expo (React Native) for future mobile support.',
  tool_title:'Dev Tools Setup Guide',tool_essential:'Essential Tools',
  tool_rec:'Recommended',tool_pkgmgr:'Package Manager',tool_init:'Project Init',
  tool_docker:'Database (via Docker)',tool_ai:'AI Coding Tools',
  tool_ext:'Extensions',tool_used:'if used',tool_vsInst:'Install from VS Code extensions',
  tool_official:'Install from official site',tool_env:'Environment Variables',
  res_title:'Learning Resources',res_official:'Official Documentation',
  res_ai:'AI-Driven Development',res_bp:'Best Practices',res_docs:'Docs',
  res_proto:'Protocol',res_patterns:'Patterns',
  res_books:'Recommended Books & Courses',res_fullstack:'Full-Stack Web Development',
  res_tsPractice:'TypeScript in Practice',res_design:' Design Principles',
  res_saas:'SaaS Development with Stripe',res_headless:'Headless Architecture Guide',
  res_beg:'Beginner',res_int:'Intermediate',
  ms_title:'Milestone Plan',ms_target:'Target',
  ms_m:['Setup & Foundations','Core Feature Implementation','UI/UX & Testing','Deploy & CI/CD','Optimization & Monitoring','Production & Improvement','Scale & Next Phase'],
  ms_criteria:'Define milestone acceptance criteria',ms_review:'Conduct weekly reviews',ms_retro:'Retrospective & improvement',
  aiw_title:'AI-Driven Dev Workflow Guide',aiw_flow:'AI Dev Flow',
  aiw_s1:'.spec/ review',aiw_s2:'Task selection',aiw_s3:'AI implementation',aiw_s4:'Review',aiw_s5:'Test',aiw_s6:'Commit',
  aiw_select:'AI Tool Selection',aiw_task:'Task',aiw_rec:'Recommended',
  aiw_newfile:'New file creation',aiw_bugfix:'Bug fix',aiw_testgen:'Test generation',aiw_refactor:'Refactoring',
  aiw_ctx:'Context awareness',aiw_term:'Direct terminal access',aiw_inline:'Inline completion',aiw_multi:'Multi-file editing',
  aiw_mcp:'MCP Usage Patterns',aiw_mcp1:'Latest library docs reference',aiw_mcp2:'Project structure comprehension',aiw_mcp3:'E2E test automation',
  aiw_prompt:'Prompt Templates',aiw_addFeature:'Add New Feature',
  aiw_promptText:`Implement [task name] from .spec/tasks.md.
Follow the requirements in .spec/specification.md
and the architecture defined in .spec/technical-plan.md.
Create tests alongside the implementation.`,
  aiw_bugfixPrompt:'Bug Fix',
  aiw_bugfixText:`Fix the following error:
[Paste error here]

Steps:
1. Reference docs/25_error_logs.md to check if it is a known issue
2. Identify root cause
3. Implement fix and tests
4. Log error to docs/25_error_logs.md`,
  aiw_refactorPrompt:'Refactoring',
  aiw_refactorText:`Refactor the following code:
[Paste target file/code here]

Steps:
1. Re-verify requirements in .spec/specification.md
2. Identify issues (SOLID violations, code duplication, etc.)
3. Improve gradually (do not break tests)
4. Update docs/24_progress.md`,
  aia_title:'AI Autonomous Dev Guide',aia_level:'Level',
  aia_vibe:'Vibe Coding in Practice',aia_vibeDesc:'A development style where you express intent in natural language and AI implements it.',
  aia_basic:'Basic Flow',
  aia_f1:'Communicate intent clearly',aia_f1ex:'"Create a user list screen"',
  aia_f2:'AI implements',aia_f2ex:'Code generation, testing, refactoring',
  aia_f3:'Review & fix',aia_f3ex:'Human final review',
  aia_f4:'Iteration',aia_f4ex:'Repeat feedback cycles',
  aia_tools:'Recommended Tools',
  aia_vibe1:'Cursor + Claude: Basic Vibe Coding',aia_vibe2:'Claude Code: Terminal-based autonomous implementation',aia_vibe3:'Antigravity: Agent-first IDE (Editor + Manager View)',
  aia_multi1:'Claude Code Subagents: Parallel task execution',aia_multi2:'Claude-Flow: Multi-Agent coordination',aia_multi3:'AGENTS.md: Agent role definitions',
  aia_full1:'Devin: Fully autonomous AI engineer',aia_full2:'Claude Code Tasks: DAG task management',aia_full3:'Gas Town: K8s for AI Agents',aia_async1:'Jules (Google): Async coding agent',
  aia_bp:'Best Practices',
  aia_bp1:'Always feed .spec/ first',aia_bp2:'Break into small tasks',aia_bp3:'Write tests first (TDD)',aia_bp4:'Always review before committing',
  aia_none:'AI autonomous development is not in scope.\nStart with AI coding tools (',aia_none2:') for the basics.',
  sc_title:'SaaS & E-Commerce Guide',sc_selected:'Selected',
  sc_compare:'Payment Platform Comparison',sc_platform:'Platform',sc_rate:'Rate',sc_feat:'Features',
  sc_stripe:'Best API, highly customizable',sc_paddle:'SaaS-focused, auto tax',sc_lemon:'Stripe-owned, indie-friendly',
  sc_impl:'Stripe Implementation',sc_webhook:'Webhook Handler',
  sc_paid:'Payment completed',sc_renew:'Subscription renewed',sc_cancel:'Cancelled',
  sc_cms:'Headless CMS',sc_ec:'Headless E-Commerce',
  sc_prodMgmt:'Product Management',sc_payment:'Payment',sc_ship:'Shipping',sc_fulfill:'Custom Fulfillment',
  sc_none:'Payment/E-Commerce features are not in scope.\nConsider Stripe payments or Headless CMS for future implementation.',
  dRoadDeploy:'Deploy',dRoadReset:'🔄 Reset',dRoadFiles:'📁 File List',dRoadProgress:'📈 Overall Progress',
};
return {ja,en,t:(key)=>(({ja,en})[S.genLang||S.lang]||en)[key]||en[key]||key};
})();
