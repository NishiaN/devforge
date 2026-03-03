function saveTemplate(){
  const _ja=S.lang==='ja';
  const templates=_jp(_lsGet('devforge-templates'),[]);
  const tpl={name:S.projectName,answers:{...S.answers},preset:S.preset,date:new Date().toISOString()};
  templates.push(tpl);
  _lsSet('devforge-templates',JSON.stringify(templates));
  addMsg('bot',_ja?`💾 テンプレート「${S.projectName}」を保存しました。次回起動時に読み込めます。`:`💾 Template "${S.projectName}" saved. Load it next time.`);
}

/* ── URL State Sharing ── */
function shareURL(){
  const _ja=S.lang==='ja';
  const data={projectName:S.projectName,answers:S.answers,preset:S.preset,skillLv:S.skillLv,lang:S.lang};
  const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const url=location.origin+location.pathname+'#df='+encoded;
  navigator.clipboard.writeText(url).then(()=>{
    var msg=_ja?'🔗 URLをクリップボードにコピーしました。このURLを共有すると同じ設定で開けます。':'🔗 URL copied to clipboard. Share it to open with the same settings.';
    if(S.skillLv>=6)msg+=_ja?' あなたの知見が次の開発者を助けます！SNSやブログでの共有もおすすめです。':' Your insights help the next developer! Consider sharing on social media or blogs.';
    addMsg('bot',msg);
  }).catch(()=>{
    addMsg('bot',`🔗 ${_ja?'共有URL':'Share URL'}:\n${url}`);
  });
}

// ── Context-Aware Guide Data ──
const DOMAIN_FIRST_STEPS={
  fintech:{ja:['security.md確認 (PCI DSS/KYC)','認証+MFA設定','決済フロー実装'],en:['Review security.md (PCI DSS/KYC)','Setup Auth+MFA','Implement payment flow']},
  health:{ja:['security.md→HIPAA対応','Auth+RBAC設定','ERスキーマ検証'],en:['Review security.md→HIPAA','Auth+RBAC setup','Verify ER schema']},
  education:{ja:['specification.mdで学習フロー確認','CLAUDE.md→AI投入','reverse_engineering.mdで逆算'],en:['Review specification.md learning flow','Feed CLAUDE.md→AI','Use reverse_engineering.md']},
  ec:{ja:['security.md+決済フロー','ER.mdでProduct/Order確認','test_cases.mdで決済テスト'],en:['Review security.md+payment','Check ER.md Product/Order','Test payment via test_cases.md']},
  saas:{ja:['security.md→テナント分離','specification.md→課金設計','CLAUDE.md→AI開発'],en:['Review security.md→multi-tenancy','Spec.md→billing design','CLAUDE.md→AI dev']},
  _default:{ja:['CLAUDE.md→AI投入','specification.md要件確認','tasks.mdタスク計画'],en:['Feed CLAUDE.md→AI','Review specification.md','Plan with tasks.md']}
};
const AI_TOOL_RECIPES={
  Cursor:{ja:['Step 1: .cursor/rules配置','Step 2: Ctrl+Shift+I Agent起動','Step 3: tasks.mdから指示'],en:['Step 1: Place .cursor/rules','Step 2: Ctrl+Shift+I Agent','Step 3: Instruct from tasks.md']},
  'Claude Code':{ja:['Step 1: CLAUDE.md自動読込','Step 2: /init初期化','Step 3: AI_BRIEF.md→仕様順投入'],en:['Step 1: CLAUDE.md auto-loaded','Step 2: /init','Step 3: Feed AI_BRIEF.md→specs']},
  Copilot:{ja:['Step 1: copilot-instructions.md配置','Step 2: Tab補完+Chat','Step 3: #fileでコンテキスト指定'],en:['Step 1: Place copilot-instructions.md','Step 2: Tab+Chat','Step 3: Use #file context']},
  Windsurf:{ja:['Step 1: .windsurfrules自動読込','Step 2: Cascadeモード起動','Step 3: MCP設定で拡張'],en:['Step 1: .windsurfrules auto-loaded','Step 2: Launch Cascade','Step 3: Extend with MCP']},
  Cline:{ja:['Step 1: フォルダを開いて.clinerules確認','Step 2: tasks.mdの最優先タスクを選択','Step 3: 「このタスクを実装して」で実行'],en:['Step 1: Open folder, check .clinerules','Step 2: Select top task from tasks.md','Step 3: Run with "implement this task"']},
  Gemini:{ja:['Step 1: CLAUDE.mdの内容をプロンプトに貼り付け','Step 2: tasks.mdの最優先タスクを指定','Step 3: コード生成を実行'],en:['Step 1: Paste CLAUDE.md content into prompt','Step 2: Specify top task from tasks.md','Step 3: Execute code generation']},
  _default:{ja:['Step 1: CLAUDE.md貼り付け','Step 2: Ctrl+Shift+C全コピー','Step 3: tasks.md順に指示'],en:['Step 1: Paste CLAUDE.md','Step 2: Ctrl+Shift+C copy all','Step 3: Instruct via tasks.md']}
};
function getADRs(a,_ja){
  const adrs=[];
  if(inc(a.backend,'Supabase'))adrs.push({icon:'🔐',t:_ja?'Auth: Supabase Auth (RLS)':'Auth: Supabase Auth (RLS)',d:_ja?'PostgreSQL行レベルセキュリティ':'PostgreSQL row-level security'});
  if(inc(a.backend,'Firebase'))adrs.push({icon:'🔐',t:_ja?'Auth: Firebase Auth':'Auth: Firebase Auth',d:_ja?'Firestoreルールで制御':'Controlled via Firestore rules'});
  if(inc(a.frontend,'Next'))adrs.push({icon:'🖥',t:_ja?'Rendering: SSR/ISR':'Rendering: SSR/ISR',d:_ja?'SEO→SSR, 動的→ISR, 管理→CSR':'SEO→SSR, dynamic→ISR, admin→CSR'});
  if(inc(a.frontend,'Vite')||inc(a.frontend,'SPA'))adrs.push({icon:'🖥',t:_ja?'Rendering: SPA (CSR)':'Rendering: SPA (CSR)',d:_ja?'クライアントサイドレンダリング':'Client-side rendering'});
  if(inc(a.deploy,'Railway'))adrs.push({icon:'☁',t:_ja?'Deploy: 分離型':'Deploy: Decoupled',d:_ja?'FE/BE独立スケーリング':'Independent FE/BE scaling'});
  if(inc(a.database,'PostgreSQL'))adrs.push({icon:'🗃',t:_ja?'DB: PostgreSQL':'DB: PostgreSQL',d:_ja?'ACID準拠、JSON対応':'ACID compliant, JSON support'});
  if(inc(a.payment,'Stripe'))adrs.push({icon:'💳',t:_ja?'Payment: Stripe':'Payment: Stripe',d:_ja?'Checkout→Webhook→非同期確定':'Checkout→Webhook→async confirm'});
  return adrs;
}

function showManual(sec){
  const o=$('helpOverlay');o.classList.add('show');
  pushModal(o,()=>{o.classList.remove('show');releaseFocus(o);});
  const _ja=S.lang==='ja';
  const MANUAL=[
    {id:'overview',title:_ja?'概要':'Overview',body:_ja?'<h2>DevForge v9.6 とは</h2><p>質問に答えるだけで、プロジェクトに必要な185+ファイルを自動生成するAI駆動開発プラットフォームです。'+_TECH_COUNT+'テクノロジー対応。</p>'+
      '<h3>28の柱</h3><table><tr><th>柱</th><th>内容</th><th>ファイル数</th></tr><tr><td>①SDD統合</td><td>Spec Kit互換の仕様書</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker開発環境</td><td>4</td></tr><tr><td>③MCP設定</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AIルール</td><td>10+ツール設定+スキル</td><td>10+</td></tr>'+
      '<tr><td>⑤並列探索</td><td>スタック比較+おすすめランキング</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>コンテキスト可視化+技術DB</td><td>UI</td></tr><tr><td>⑦ロードマップ</td><td>学習パス（インタラクティブ）</td><td>9+UI</td></tr><tr><td>⑧AIランチャー</td><td>プロンプトテンプレート+トークン推定</td><td>UI</td></tr><tr><td>⑨デザインシステム</td><td>デザイントークン+シーケンス図</td><td>2</td></tr><tr><td>⑩リバースEng</td><td>ゴール逆算型プランニング</td><td>2</td></tr><tr><td>⑪実装ガイド</td><td>業種別実装パターン+AI運用手順</td><td>3</td></tr><tr><td>⑫セキュリティ</td><td>OWASP・STRIDE・コンプライアンス</td><td>5</td></tr><tr><td>⑬戦略インテリジェンス</td><td>業種別設計図・技術レーダー・ステークホルダー戦略・先端シナリオ</td><td>5</td></tr><tr><td>⑭運用インテリジェンス</td><td>Ops Plane設計・12 Ops Capabilities・SLO/SLI</td><td>3</td></tr><tr><td>⑮未来戦略</td><td>市場ポジショニング・UX戦略・エコシステム・規制対応</td><td>4</td></tr><tr><td>⑯開発IQ</td><td>最適手法選定・AIプロンプトプレイブック・業界特化・次世代UX</td><td>4</td></tr><tr><td>⑰プロンプトゲノム</td><td>CRITERIA 8軸スコア・AI成熟度・シナジーマトリクス・KPIダッシュボード</td><td>4</td></tr><tr><td>⑱Prompt Ops</td><td>ReAct自律ワークフロー・LLMOpsダッシュボード・Prompt CI/CD・[META]レジストリ</td><td>4</td></tr><tr><td>⑲エンタープライズSaaS</td><td>マルチテナント設計・組織モデル・ワークフローエンジン・エンタープライズUIコンポーネント</td><td>4</td></tr><tr><td>⑳CI/CDインテリジェンス</td><td>パイプライン設計・デプロイ戦略・品質ゲートマトリクス・リリースエンジニアリング</td><td>4</td></tr><tr><td>㉑APIデザイン</td><td>REST原則・OpenAPI仕様・APIセキュリティ・テスト戦略</td><td>4</td></tr><tr><td>㉒データベース設計</td><td>インデックス戦略・命名規則・マイグレーション・バックアップ</td><td>4</td></tr><tr><td>㉓テストインテリジェンス</td><td>テストピラミッド・カバレッジ・E2E・Web Vitals</td><td>4</td></tr><tr><td>㉔AI安全性</td><td>リスク分類・ガードレール・モデル評価・インジェクション防御</td><td>4</td></tr><tr><td>㉕パフォーマンス</td><td>DB最適化・キャッシュ戦略・APM・パフォーマンス監視</td><td>4</td></tr><tr><td>㉖可観測性</td><td>構造化ログ・RED/USEメトリクス・OpenTelemetry・Grafanaダッシュボード</td><td>4</td></tr><tr><td>㉗コスト最適化</td><td>クラウドコスト設計・FinOpsサイクル・予算アラート自動化・AIコスト分析</td><td>4</td></tr><tr><td>㉘XAIインテリジェンス</td><td>フェアネスパイプライン・AIガバナンス・モデルライフサイクル管理・レッドチーム</td><td>4-5</td></tr></table>'+
      '<p>+ docs（112仕様書）+ 共通ファイル（4）= <strong>189+ファイル</strong></p>':'<h2>What is DevForge v9.6?</h2><p>An AI-driven dev platform that auto-generates 185+ project files just by answering questions. Supports '+_TECH_COUNT+' technologies.</p>'+
      '<h3>28 Pillars</h3><table><tr><th>Pillar</th><th>Content</th><th>Files</th></tr><tr><td>①SDD</td><td>Spec Kit compatible specs</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker dev environment</td><td>4</td></tr><tr><td>③MCP</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AI Rules</td><td>10+ tool configs + skills</td><td>10+</td></tr>'+
      '<tr><td>⑤Explorer</td><td>Stack comparison + recommendation</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>Context visualization + Tech DB</td><td>UI</td></tr><tr><td>⑦Roadmap</td><td>Learning path (interactive)</td><td>9+UI</td></tr><tr><td>⑧AI Launcher</td><td>Prompt templates + token estimation</td><td>UI</td></tr><tr><td>⑨Design System</td><td>Design tokens + Sequence diagrams</td><td>2</td></tr><tr><td>⑩Reverse Eng</td><td>Goal-driven reverse planning</td><td>2</td></tr><tr><td>⑪Impl Guide</td><td>Domain-specific impl patterns + AI runbook</td><td>3</td></tr><tr><td>⑫Security</td><td>OWASP, STRIDE, Compliance</td><td>5</td></tr><tr><td>⑬Strategic Intelligence</td><td>Industry blueprint, Tech radar, Stakeholder strategy, Advanced scenarios</td><td>5</td></tr><tr><td>⑭Ops Intelligence</td><td>Ops Plane design, 12 Ops Capabilities, SLO/SLI</td><td>3</td></tr><tr><td>⑮Future Strategy</td><td>Market positioning, UX strategy, Ecosystem, Regulatory</td><td>4</td></tr><tr><td>⑯Dev IQ</td><td>Optimal methodology, AI brainstorm playbook, Industry deep dive, Next-gen UX</td><td>4</td></tr><tr><td>⑰Prompt Genome</td><td>CRITERIA 8-axis scoring, AI maturity, Synergy matrix, KPI dashboard</td><td>4</td></tr><tr><td>⑱Prompt Ops</td><td>ReAct workflow, LLMOps dashboard, Prompt CI/CD, [META] registry</td><td>4</td></tr><tr><td>⑲Enterprise SaaS</td><td>Multi-tenant design, Org model, Workflow engine, Enterprise UI components</td><td>4</td></tr><tr><td>⑳CI/CD Intelligence</td><td>Pipeline design, Deploy strategy, Quality gate matrix, Release engineering</td><td>4</td></tr><tr><td>㉑API Design</td><td>REST principles, OpenAPI spec, API security, testing strategy</td><td>4</td></tr><tr><td>㉒Database Design</td><td>Index strategy, naming conventions, migration, backup</td><td>4</td></tr><tr><td>㉓Test Intelligence</td><td>Test pyramid, coverage, E2E, Web Vitals</td><td>4</td></tr><tr><td>㉔AI Safety</td><td>Risk categories, guardrails, model evaluation, injection defense</td><td>4</td></tr><tr><td>㉕Performance</td><td>DB performance, cache strategy, APM, monitoring</td><td>4</td></tr><tr><td>㉖Observability</td><td>Structured logging, RED/USE metrics, OpenTelemetry tracing, Grafana dashboard</td><td>4</td></tr><tr><td>㉗Cost Optimization</td><td>Cloud cost architecture, FinOps cycle, budget alert automation, AI cost analysis</td><td>4</td></tr><tr><td>㉘XAI Intelligence</td><td>Fairness pipeline, AI governance, model lifecycle management, red team methodology</td><td>4-5</td></tr></table>'+
      '<p>+ docs (112 specs) + common (4) = <strong>189+ files</strong></p>'},
    {id:'start',title:_ja?'はじめ方':'Getting Started',body:_ja?
      '<h2>はじめ方</h2><p>1. スキルレベルを選択（Beginner/Intermediate/Pro）<br>2. プロジェクト名を入力<br>3. テンプレート選択（任意・133種類）<br>4. Phase 1-3の質問に回答（スキップ＆後で回答可）<br>5. 生成ボタンで185+ファイル作成<br>6. ZIPダウンロードまたはPDF印刷</p>'+
      '<h3>UX機能</h3>'+
      '<p>• 🌱⚡🔥 スキルレベルで質問の選択肢が動的変化<br>• 🎯 133プリセットテンプレート<br>• ✎ 回答の編集（✎ボタン）<br>• ⏭️ スキップ＆後で回答<br>• 📊 複雑度分析（0-100スコア）<br>• 📁 プロジェクト管理（Ctrl+M）<br>• 🎙️ 音声入力<br>• ? 質問ごとのヘルプアイコン<br>• 🔀 ドラッグ&ドロップ優先度ソート</p>'+
      '<h3>V8 新機能</h3>'+
      '<p>• 📱 モバイル開発パス (Expo/React Native)<br>• 🤖 AI自律開発ガイド (Vibe Coding/マルチAgent)<br>• 💳 決済・CMS・EC統合ガイド<br>• ⚡ 並列スタック比較 (7パターン)<br>• 📊 技術マスターテーブル / Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ インタラクティブロードマップ (進捗管理)</p>'+
      '<h3>V8.3 新機能</h3>'+
      '<p>• 📊 Mermaid図ライブレンダリング (ER図・画面遷移・ガント)<br>• 📝 OpenAPI準拠API仕様書<br>• ✅ テストケースマトリクス (機能×正常/異常)<br>• 📋 リリースチェックリスト (デプロイ先別動的生成)<br>• 🔨 WBS 3階層+工数見積り<br>• 🎯 プロンプトプレイブック (フェーズ別AI投入プロンプト集)<br>• 📎 GitHub Issues風タスク分解<br>• 📋 全ファイル結合コピー (AI一括投入用)</p>'+
      '<h3>V9 新機能</h3>'+
      '<p>• 🧪 品質インテリジェンスエンジン (業種別QA戦略・テストマトリクス・インシデント対応)<br>• 🎨 デザインシステム自動生成 (デザイントークン・シーケンス図)<br>• 🔄 リバースエンジニアリング (ゴール逆算型プランニング・32ドメイン対応)<br>• 🏗️ 実装インテリジェンス (業種別実装パターン・AI運用手順書・擬似コード)<br>• 🧠 AI開発OS (コンテキスト圧縮・ファイル選択マトリクス・サブエージェント分離)<br>• 🌐 32ドメイン対応 (AI, IoT, 不動産, 法務, 人事, 金融, 製造, 物流, 農業, エネルギー, メディア, 行政, 旅行, 保険 等を追加)<br>• 📦 185+ファイル生成 (docs 108種, AIルール12+, スキル8+)<br>• 🎯 133プリセット (製造, 農業, エネルギー, メディア, 行政, 旅行, 保険 等追加)<br>• 🏗️ 未来戦略インテリジェンス (市場ポジショニング・UX戦略・エコシステム・規制フォーサイト)<br>• 📄 CLAUDE.md 3-layer分割 (薄いルート + パス別ルール + 設定)<br>• 🧬 開発IQインテリジェンス ⑯ (32ドメイン×12手法のポリモーフィック開発戦略)<br>• 🧩 プロンプトゲノムエンジン ⑰ (CRITERIA 8軸品質スコア付きプロンプトDNA自動生成)<br>• 🔧 Prompt Engineering OS ⑱ (ReAct自律ワークフロー・LLMOpsダッシュボード・Prompt CI/CD・[META]レジストリ)<br>• 🏢 エンタープライズSaaS Blueprint ⑲ (マルチテナント設計・組織モデル・ワークフローエンジン・エンタープライズUIコンポーネント)</p>'+
      '<p class="workflow-ref">📘 <strong>生成後の手順は <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">生成後ワークフローガイド</a> を参照</strong></p>'
      :
      '<h2>Getting Started</h2><p>1. Select your skill level (Beginner/Intermediate/Pro)<br>2. Enter project name<br>3. Choose a template (optional, 133 types)<br>4. Answer Phase 1-3 questions (skip & answer later OK)<br>5. Click Generate for 185+ files<br>6. Download ZIP or print PDF</p>'+
      '<h3>UX Features</h3>'+
      '<p>• 🌱⚡🔥 Dynamic options by skill level<br>• 🎯 133 preset templates<br>• ✎ Edit answers (✎ button)<br>• ⏭️ Skip & answer later<br>• 📊 Complexity analysis (0-100 score)<br>• 📁 Project manager (Ctrl+M)<br>• 🎙️ Voice input<br>• ? Help icon per question<br>• 🔀 Drag & drop priority sort</p>'+
      '<h3>V8 Features</h3>'+
      '<p>• 📱 Mobile dev path (Expo/React Native)<br>• 🤖 AI autonomous guide (Vibe Coding/Multi-Agent)<br>• 💳 Payment/CMS/EC integration<br>• ⚡ Parallel stack comparison (7 patterns)<br>• 📊 Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ Interactive roadmap (progress tracking)</p>'+
      '<h3>V8.3 Features</h3>'+
      '<p>• 📊 Mermaid diagram live rendering (ER/screen flow/Gantt)<br>• 📝 OpenAPI-compliant API specs<br>• ✅ Test case matrix (feature × normal/abnormal)<br>• 📋 Release checklist (per deploy target)<br>• 🔨 WBS 3-level + effort estimation<br>• 🎯 Prompt playbook (phase-specific AI prompts)<br>• 📎 GitHub Issues-style task breakdown<br>• 📋 Copy all files combined (for bulk AI input)</p>'+
      '<h3>V9 Features</h3>'+
      '<p>• 🧪 Quality Intelligence Engine (industry-specific QA strategies, test matrix, incident response)<br>• 🎨 Design System generation (design tokens, sequence diagrams)<br>• 🔄 Reverse Engineering (goal-driven reverse planning, 32 domains)<br>• 🏗️ Implementation Intelligence (domain-specific impl patterns, AI runbook, pseudo-code)<br>• 🧠 AI Development OS (context compression, file selection matrix, sub-agent isolation)<br>• 🌐 32 domain support (AI, IoT, Real Estate, Legal, HR, FinTech, Manufacturing, Logistics, Agriculture, Energy, Media, Government, Travel, Insurance added)<br>• 📦 185+ file generation (108 docs, 12+ AI rules, 8+ skills)<br>• 🎯 133 presets (Factory, Agriculture, Energy, Media, Gov Portal, Travel, Insurance, and more added)<br>• 🏗️ Future Strategy Intelligence (market positioning, UX strategy, ecosystem, regulatory foresight)<br>• 📄 CLAUDE.md 3-layer split (thin root + path-specific rules + settings)<br>• 🧬 Dev IQ Intelligence ⑯ (polymorphic development strategy for 32 domains × 12 approaches)<br>• 🧩 Prompt Genome Engine ⑰ (project-specific Prompt DNA with CRITERIA 8-axis quality scoring)<br>• 🔧 Prompt Engineering OS ⑱ (ReAct autonomous workflow, LLMOps dashboard, Prompt CI/CD, [META] registry)<br>• 🏢 Enterprise SaaS Blueprint ⑲ (multi-tenant design, org model, workflow engine, enterprise UI components)</p>'+
      '<p class="workflow-ref">📘 <strong>For post-generation workflow, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'
    },
    {id:'pillars',title:_ja?'28の柱':'28 Pillars',body:_ja?
      '<h2>28の柱の詳細</h2><h3>① SDD統合 (5ファイル)</h3>'+
      '<p>constitution.md / specification.md / technical-plan.md / tasks.md / verification.md</p>'+
      '<h3>② DevContainer (4ファイル)</h3>'+
      '<p>devcontainer.json / Dockerfile / docker-compose.yml / post-create.sh — VSCode/Cursorで開くだけ。</p>'+
      '<h3>③ MCP設定 (3ファイル)</h3>'+
      '<p>project-context.md / tools-manifest.json / mcp-config.json</p>'+
      '<h3>④ AIルール (12+ファイル)</h3>'+
      '<p>Cursor / Antigravity / Claude Code (CLAUDE.md, AGENTS.md) / Copilot / Windsurf / Cline / Kiro / Codex / Skills (project/catalog/pipelines) / Hooks</p>'+
      '<h3>⑤ 並列実装探索 (UI)</h3>'+
      '<p>7パターンのスタックを2つ選んで比較。開発速度・スケーラビリティ・学習容易性・エコシステムで評価。</p>'+
      '<h3>⑥ Context Dashboard (UI)</h3>'+
      '<p>トークン数・モデル適合度・ファイルサイズ分布・技術マスターテーブル('+_TECH_COUNT+')を一覧表示。</p>'+
      '<h3>⑦ ロードマップ (9ファイル+UI)</h3>'+
      '<p>LEARNING_PATH / TECH_STACK_GUIDE / MOBILE_GUIDE / TOOLS_SETUP / RESOURCES / MILESTONES / AI_WORKFLOW / AI_AUTONOMOUS / SAAS_COMMERCE_GUIDE — インタラクティブUIで進捗管理可能。</p>'+
      '<h3>⑧ AIプロンプトランチャー (UI)</h3>'+
      '<p>生成した仕様書をAIツールに一括投入。40のプロンプトテンプレート（レビュー・実装・テスト・リファクタ・セキュリティ・ドキュメント・QA・デバッグ・アーキテクチャ・パフォーマンス・API統合・アクセシビリティ・マイグレーション・メトリクス・i18n・グロース・リバースエンジニアリング・インシデント対応・Ops準備・戦略インテリジェンス・リスクコンプライアンス・オンボーディング・CI/CD設計・最適手法選定・9人の専門家ブレスト・UXジャーニー設計・AIモデル使い分け・業界特化分析・次世代UX・認知負荷分析・プロンプトゲノム分析・AI成熟度レビュー・ReActデバッグ・プロンプトOpsレビュー・エンタープライズアーキテクチャ・ワークフロー監査・UX監査・DBインテリジェンス・AI安全性インテリジェンス・テストインテリジェンス）。フォルダ別トークン推定・モデル適合度表示。<strong>詳細は「📋 プロンプトマニュアル」参照</strong>。</p>'+
      '<h3>⑨ デザインシステム (2ファイル)</h3>'+
      '<p>design_system.md (デザイントークン・色・タイポ・コンポーネントカタログ) / sequence_diagrams.md (認証・CRUD・決済フローのMermaidシーケンス図) — フレームワーク別実装ガイド。</p>'+
      '<h3>⑩ リバースエンジニアリング (2ファイル)</h3>'+
      '<p>reverse_engineering.md (ゴール定義→逆算フロー・マイルストーンGantt・リスク分析) / goal_decomposition.md (ゴールツリー・サブゴール分解・ギャップ分析・優先度マトリクス・依存関係チェーン) — 32ドメイン対応の逆算型プランニング。</p>'+
      '<h3>⑪ 実装インテリジェンス (4ファイル)</h3>'+
      '<p>implementation_playbook.md (業種別実装パターン・擬似コード・スタック固有ガイダンス・横断的関心事チェックリスト) / ai_dev_runbook.md (AI運用ワークフロー・コンテキスト管理・エラー復旧プロトコル) / skill_guide.md (スキルレベル別使用ガイド・注意事項・チェックリスト) / impl-patterns.md (Manus Skills形式の実装スキルカタログ、ai_auto≠noneの場合) — 32ドメイン対応の実装ガイド。</p>'+
      '<h3>⑫ セキュリティインテリジェンス (5ファイル)</h3>'+
      '<p>security_intelligence.md (OWASP Top 10 2025監査・セキュリティヘッダー・責任分界・シークレット管理・認証セキュリティ) / threat_model.md (STRIDEエンティティ別脅威分析・攻撃対象領域・対策マトリクス) / compliance_matrix.md (PCI DSS・HIPAA・GDPR・ISMAP・SOC 2・FERPAドメイン別チェックリスト) / ai_security.md (AI生成コードレビュー・パッケージ幻覚検知・敵対的AIプロンプト・Agent Security) / security_testing.md (RLSテスト・Zodスキーマ・IDORテスト・OWASP ZAP設定・ペネトレーションテストチェックリスト) — スタック適応型セキュリティ自動生成エンジン。</p>'+
      '<h3>⑬ 戦略インテリジェンス (5ファイル)</h3>'+
      '<p>industry_blueprint.md (業種別規制・推奨アーキテクチャ・失敗要因・ビジネスモデル比較) / tech_radar.md (2026-2030技術トレンドレーダー・Adopt/Trial/Assess/Hold分類・スタック進化ロードマップ) / stakeholder_strategy.md (ステークホルダー別開発戦略・技術的負債管理・チーム構成・予算配分ガイド) / operational_excellence.md (技術的負債管理フレームワーク・DR/BCP・Green IT・Conway\'s Law対応チーム設計) — 32ドメイン対応の業種別戦略インテリジェンス。世界唯一の戦略ドキュメント自動生成エンジン。</p>'+
      '<h3>⑭ 運用インテリジェンス (3ファイル)</h3>'+
      '<p>ops_runbook.md (Ops Plane設計・Feature Flags・SLO/SLI・Observability・Jobs・Backup・Rate Limiting) / ops_checklist.md (12 Ops Capabilities Matrix・Day-1運用準備) / ops_plane_design.md (Ops Plane Architecture・12 Ops Capabilities実装パターン・Circuit Breaker・証拠ベース運用・Dev×Ops AI責任分離・Admin Consoleセキュリティ) — ドメイン適応型Ops Plane設計自動生成エンジン。世界唯一の運用設計書自動生成。</p>'+
      '<h3>⑮ 未来戦略インテリジェンス (4ファイル)</h3>'+
      '<p>market_positioning.md (市場ポジショニング・競合分析・MOAT・GTM戦略・ユニットエコノミクス) / user_experience_strategy.md (UX戦略・ペルソナ・ユーザージャーニー・アクセシビリティ・デジタルウェルビーイング) / ecosystem_strategy.md (エコシステム戦略・API-as-Product・DX・FinOps・コミュニティ) / regulatory_foresight.md (規制対応・2026-2030展望・EU AI Act・ESGメトリクス) — 32ドメイン対応の未来戦略自動生成。</p>'+
      '<h3>⑯ 開発IQインテリジェンス (4ファイル)</h3>'+
      '<p>dev_methodology.md (32ドメイン対応の開発方法論・TDD/DDD/BDD/FDD・ポリモーフィック開発戦略) / phase_prompts.md (6フェーズ×設計アプローチ別AIプロンプト・実装ガイダンス) / industry_dev_strategy.md (15業種別開発戦略・推奨スタック・KPI・失敗パターン回避) / next_gen_ux.md (次世代UX手法・Voice-First・Spatial Computing・Haptic Feedback・Predictive UI) — 32ドメイン×12設計アプローチのポリモーフィック開発インテリジェンス。</p>'+
      '<h3>⑰ プロンプトゲノムエンジン (4ファイル)</h3>'+
      '<p>65_prompt_genome.md (プロジェクト固有プロンプトDNA・CRITERIA 8軸品質スコア付き全フェーズプロンプト) / 66_ai_maturity_assessment.md (チームAI成熟度5次元評価・Assisted→Augmented→Autonomous段階的ロードマップ) / 67_prompt_composition_guide.md (12設計アプローチ×12シナジーマトリクス・4層テンプレートアーキテクチャ・複合プロンプトパターン) / 68_prompt_kpi_dashboard.md (アプローチ別成功KPI・測定計画・AI効果測定ダッシュボード) — 世界初のプロジェクト固有プロンプトDNA自動生成エンジン。CRITERIA品質スコア付き。</p>'+
      '<h3>⑱ Prompt Engineering OS (4ファイル)</h3>'+
      '<p>69_prompt_ops_pipeline.md (Prompt CI/CDパイプライン・5ステージライフサイクル・バージョン管理・A/Bテスト・ロールバック) / 70_react_workflow.md (ReAct自律ワークフロー・6フェーズ×Reason→Act→Observe→Verify・自己デバッグループ・障害回復) / 71_llmops_dashboard.md (LLMOps評価ダッシュボード・CRITERIA統合メトリクス・コスト最適化・可観測性) / 72_prompt_registry.md ([META]構造化プロンプトレジストリ・Template-ID命名・バージョン履歴・ドメイン別カタログ) — 世界初Prompt DevOpsプラットフォーム自動生成。⑰のPrompt DNAを運用化。</p>'+
      '<h3>⑲ エンタープライズSaaS Blueprint (4ファイル)</h3>'+
      '<p>73_enterprise_architecture.md (マルチテナントアーキテクチャ・組織ERモデル・RLSポリシー・権限マトリクス・招待フロー) / 74_workflow_engine.md (承認・チケット・注文・契約・オンボーディングのステートマシン・SLAトラッキング) / 75_admin_dashboard_spec.md (管理ダッシュボードワイヤーフレーム・KPIカード・週次トレンド・ユーザーワークロード分析) / 76_enterprise_components.md (8+エンタープライズUIコンポーネント仕様・Props・バリアント・A11y・フレームワーク対応) — SaaS/Analytics/HR/Collab/Toolドメインで自動生成。世界唯一のエンタープライズSaaSアーキテクチャ自動生成エンジン。</p>'+
      '<h3>⑳ CI/CDインテリジェンス (4ファイル)</h3>'+
      '<p>77_cicd_pipeline_design.md (9ステージパイプライン設計・Mermaid graph TD・デプロイ先別GitHub Actions YAML・キャッシュ戦略・マトリクステスト) / 78_deployment_strategy.md (dev/staging/prod環境戦略・blue-green/canary/rolling/recreate戦略選択・ロールバック自動化・シークレット管理) / 79_quality_gate_matrix.md (ステージ×ゲートマトリクス・カバレッジ閾値・パフォーマンス予算・ドメイン固有ゲート・Mermaidフロー) / 80_release_engineering.md (Trunk-Based/GitFlow/GitHub Flow選択・Mermaid gitGraph・セマンティックバージョニング・Renovate設定・SBOM生成) — 全ドメイン生成。デプロイ先9種（Vercel/Firebase/CF/Railway/Fly/Render/AWS/Docker/Netlify）に最適化されたCI/CDパイプライン自動設計エンジン。</p>'+
      '<h3>㉑ APIデザインインテリジェンス (4ファイル)</h3>'+
      '<p>83_api_design_principles.md (REST原則・バージョニング・エラーハンドリング) / 84_openapi_specification.md (OpenAPI 3.1完全仕様・スキーマ定義・Swagger UI設定) / 85_api_security_checklist.md (OWASP API Security Top 10 2023・認証・レート制限) / 86_api_testing_strategy.md (k6負荷テスト・コントラクトテスト・モック戦略) — REST/GraphQL/gRPC/BaaSアプローチ別の完全APIインテリジェンス。</p>'+
      '<h3>㉒ データベース設計インテリジェンス (4ファイル)</h3>'+
      '<p>87_database_design.md (正規化・インデックス戦略・命名規則・パーティション設計) / 88_migration_strategy.md (マイグレーションパターン・ロールバック手順・データ整合性) / 89_database_security.md (RLSポリシー・暗号化・監査ログ・アクセス制御) / 90_query_optimization.md (クエリ最適化・N+1問題対策・実行計画分析) — ORM別(Prisma/Drizzle/TypeORM/SQLAlchemy/Kysely)対応。</p>'+
      '<h3>㉓ テストインテリジェンス (4ファイル)</h3>'+
      '<p>91_test_strategy.md (テストピラミッド・カバレッジ目標・TDDワークフロー) / 92_unit_integration_tests.md (フレームワーク別ユニット・統合テストパターン・モック戦略) / 93_e2e_tests.md (Playwright設定・認証storageState・CI並列化・視覚回帰テスト) / 94_performance_testing.md (Web Vitals計測・Lighthouse CI・k6負荷テスト・SLO検証) — フロントエンド/バックエンド/BaaS別対応。</p>'+
      '<h3>㉔ AI安全性インテリジェンス (4ファイル)</h3>'+
      '<p>95_ai_risk_assessment.md (AI機能リスク分類・脅威モデリング・ステークホルダー影響評価) / 96_guardrail_implementation.md (入力/出力/コンテンツ/アクセス制御の4層ガードレール実装) / 97_ai_model_evaluation.md (精度・公平性・透明性・セキュリティ・プライバシーの評価フレームワーク) / 98_prompt_injection_defense.md (インジェクション検出・多層防御・AI固有セキュリティテスト) — Claude/OpenAI/Gemini/ローカルLLMプロバイダー別対応。</p>'+
      '<h3>㉕ パフォーマンスインテリジェンス (4ファイル)</h3>'+
      '<p>99_performance_strategy.md (Core Web Vitals・バンドル最適化・画像最適化・SSR/SSG戦略) / 100_database_performance.md (ORM別クエリ最適化・インデックス設計・接続プール・スロークエリ分析) / 101_cache_strategy.md (多層キャッシュ(Redis/CDN/メモリ)・TTL戦略・キャッシュ無効化パターン) / 102_performance_monitoring.md (APMプロバイダー別設定(Sentry/DataDog/NewRelic)・SLO/SLI・コスト最適化) — 全ドメイン対応のパフォーマンスインテリジェンス。</p>'+
      '<h3>㉖ 可観測性インテリジェンス (4ファイル)</h3>'+
      '<p>103_observability_architecture.md (OpenTelemetryパイプライン・デプロイ先別ツール選択・SLO YAML) / 104_structured_logging.md (バックエンド別構造化ログ実装・Pino/structlog/SLF4J・[REDACTED]マスキング) / 105_metrics_alerting.md (RED/USEメトリクス・prom-client・ドメイン別ビジネスメトリクス・Alertmanager) / 106_distributed_tracing.md (OpenTelemetry SDK設定・バックエンド/デプロイ別実装・W3C TraceContext) — 全ドメイン対応の可観測性インテリジェンス。</p>'+
      '<h3>㉗ コスト最適化インテリジェンス (4ファイル)</h3>'+
      '<p>109_cost_architecture.md (クラウドコスト設計・スケール別見積り・タグ戦略・無料枠チェックリスト) / 110_resource_optimization.md (コンピュート最適化・DBコスト削減・キャッシュ戦略・ネットワーク最適化) / 111_finops_strategy.md (FinOps成熟度モデル・予算アラートYAML・最適化バックログ・レビューケイデンス) / 112_cost_monitoring.md (監視ツール・アラートしきい値・月次チェックリスト・AIコスト分析プロンプト) — 全デプロイ先対応のコスト最適化インテリジェンス。</p>'
      :
      '<h2>28 Pillars in Detail</h2><h3>① SDD Integration (5 files)</h3>'+
      '<p>constitution.md / specification.md / technical-plan.md / tasks.md / verification.md</p>'+
      '<h3>② DevContainer (4 files)</h3>'+
      '<p>devcontainer.json / Dockerfile / docker-compose.yml / post-create.sh — Just open in VS Code/Cursor.</p>'+
      '<h3>③ MCP Config (3 files)</h3>'+
      '<p>project-context.md / tools-manifest.json / mcp-config.json</p>'+
      '<h3>④ AI Rules (12+ files)</h3>'+
      '<p>Cursor / Antigravity / Claude Code (CLAUDE.md, AGENTS.md) / Copilot / Windsurf / Cline / Kiro / Codex / Skills (project/catalog/pipelines) / Hooks</p>'+
      '<h3>⑤ Parallel Explorer (UI)</h3>'+
      '<p>Compare 2 of 7 stack patterns. Scored by dev speed, scalability, learning curve, and ecosystem.</p>'+
      '<h3>⑥ Context Dashboard (UI)</h3>'+
      '<p>Token counts, model fit, file size distribution, and Tech Master Table ('+_TECH_COUNT+') at a glance.</p>'+
      '<h3>⑦ Roadmap (9 files + UI)</h3>'+
      '<p>LEARNING_PATH / TECH_STACK_GUIDE / MOBILE_GUIDE / TOOLS_SETUP / RESOURCES / MILESTONES / AI_WORKFLOW / AI_AUTONOMOUS / SAAS_COMMERCE_GUIDE — Interactive UI for progress tracking.</p>'+
      '<h3>⑧ AI Prompt Launcher (UI)</h3>'+
      '<p>Bulk-feed generated specs to AI tools. 50 prompt templates (Review, Implement, Test, Refactor, Security, Docs, QA, Debug, Architecture, Performance, API, Accessibility, Migration, Metrics, i18n, Growth, Reverse Engineering, Incident Response, Ops Readiness, Strategic Intelligence, Risk & Compliance, Onboarding, CI/CD Design, Optimal Methodology, 9-Expert Brainstorm, UX Journey Design, AI Model Selection, Industry Deep Dive, Next-Gen UX, Cognitive Load, Prompt Genome Analysis, AI Maturity Review, ReAct Debug Loop, Prompt Ops Review, Enterprise Architecture Review, Workflow Process Audit, UX Process Audit, DB Intelligence, AI Safety Intelligence, Test Intelligence). Per-folder token estimation and model fit display. <strong>See "📋 Prompt Manual" for details</strong>.</p>'+
      '<h3>⑨ Design System (2 files)</h3>'+
      '<p>design_system.md (design tokens, colors, typography, component catalog) / sequence_diagrams.md (auth, CRUD, payment Mermaid sequence diagrams) — Framework-specific guides.</p>'+
      '<h3>⑩ Reverse Engineering (2 files)</h3>'+
      '<p>reverse_engineering.md (goal definition → reverse flow, milestone Gantt, risk analysis) / goal_decomposition.md (goal tree, sub-goal breakdown, gap analysis, priority matrix, dependency chain) — 32 domain-specific reverse planning.</p>'+
      '<h3>⑪ Implementation Intelligence (4 files)</h3>'+
      '<p>implementation_playbook.md (domain-specific impl patterns, pseudo-code, stack guidance, cross-cutting concerns checklist) / ai_dev_runbook.md (AI operation workflow, context management, error recovery protocol) / skill_guide.md (skill-level usage guide, cautions, checklists) / impl-patterns.md (implementation skills in Manus Skills format, if ai_auto≠none) — 32 domain-specific implementation guide.</p>'+
      '<h3>⑫ Security Intelligence (5 files)</h3>'+
      '<p>security_intelligence.md (OWASP Top 10 2025 audit, security headers, shared responsibility model, secrets management, auth security) / threat_model.md (STRIDE entity threat analysis, attack surface, mitigation matrix) / compliance_matrix.md (PCI DSS, HIPAA, GDPR, ISMAP, SOC 2, FERPA domain-specific checklists) / ai_security.md (AI-generated code review, package hallucination detection, adversarial AI prompts, agent security) / security_testing.md (RLS tests, Zod schemas, IDOR tests, OWASP ZAP config, penetration testing checklist) — Stack-adaptive security auto-generation engine.</p>'+
      '<h3>⑬ Strategic Intelligence (5 files)</h3>'+
      '<p>industry_blueprint.md (industry regulations, recommended architecture, failure factors, business model comparison) / tech_radar.md (2026-2030 tech trend radar, Adopt/Trial/Assess/Hold classification, stack evolution roadmap) / stakeholder_strategy.md (stakeholder-specific dev strategy, tech debt management, team composition, budget allocation guide) / operational_excellence.md (tech debt management framework, DR/BCP, Green IT, Conway\'s Law team design) — 32 domain-specific industry strategic intelligence. World\'s only strategic document auto-generation engine.</p>'+
      '<h3>⑭ Ops Intelligence (3 files)</h3>'+
      '<p>ops_runbook.md (Ops Plane design, Feature Flags, SLO/SLI, Observability, Jobs, Backup, Rate Limiting) / ops_checklist.md (12 Ops Capabilities Matrix, Day-1 ops readiness) / ops_plane_design.md (Ops Plane Architecture, 12 Ops Capabilities implementation patterns, Circuit Breaker, Evidence-Based Operations, Dev×Ops AI responsibility separation, Admin Console security) — Domain-adaptive Ops Plane design auto-generation engine. World\'s only ops design document auto-generation.</p>'+
      '<h3>⑮ Future Strategy Intelligence (4 files)</h3>'+
      '<p>market_positioning.md (market positioning, competitive analysis, MOAT, GTM strategy, unit economics) / user_experience_strategy.md (UX strategy, personas, user journeys, accessibility, digital wellbeing) / ecosystem_strategy.md (ecosystem strategy, API-as-Product, DX, FinOps, community) / regulatory_foresight.md (regulatory foresight, 2026-2030 horizon, EU AI Act, ESG metrics) — 32 domain-specific future strategy auto-generation.</p>'+
      '<h3>⑯ Dev IQ Intelligence (4 files)</h3>'+
      '<p>dev_methodology.md (32 domain development methodologies, TDD/DDD/BDD/FDD, polymorphic development strategy) / phase_prompts.md (6-phase × design approach AI prompts, implementation guidance) / industry_dev_strategy.md (15 industry development strategies, recommended stacks, KPIs, failure pattern avoidance) / next_gen_ux.md (next-gen UX methods, Voice-First, Spatial Computing, Haptic Feedback, Predictive UI) — Polymorphic development intelligence for 32 domains × 12 design approaches.</p>'+
      '<h3>⑰ Prompt Genome Engine (4 files)</h3>'+
      '<p>65_prompt_genome.md (project-specific Prompt DNA, full-phase prompts with CRITERIA 8-axis quality scores) / 66_ai_maturity_assessment.md (team AI maturity 5-dimension assessment, Assisted→Augmented→Autonomous progressive roadmap) / 67_prompt_composition_guide.md (12 design approaches × 12 synergy matrix, 4-layer template architecture, composite prompt patterns) / 68_prompt_kpi_dashboard.md (per-approach success KPIs, measurement plan, AI effectiveness dashboard) — World\'s first project-specific Prompt DNA auto-generation engine with CRITERIA quality scoring.</p>'+
      '<h3>⑱ Prompt Engineering OS (4 files)</h3>'+
      '<p>69_prompt_ops_pipeline.md (Prompt CI/CD pipeline, 5-stage lifecycle, version control, A/B test framework, rollback procedure) / 70_react_workflow.md (ReAct autonomous workflow, 6 phases × Reason→Act→Observe→Verify, self-debug loop, failure recovery patterns) / 71_llmops_dashboard.md (LLMOps evaluation dashboard, CRITERIA-integrated metrics, cost optimization, observability) / 72_prompt_registry.md ([META] structured prompt registry, Template-ID naming, version history, domain-specific catalog) — World\'s first Prompt DevOps platform auto-generation. Operationalizes Prompt DNA from ⑰.</p>'+
      '<h3>⑲ Enterprise SaaS Blueprint (4 files)</h3>'+
      '<p>73_enterprise_architecture.md (multi-tenant architecture, org ER model, RLS policies, permission matrix, invite flow) / 74_workflow_engine.md (approval, ticket, order, contract, onboarding state machines, SLA tracking) / 75_admin_dashboard_spec.md (admin dashboard wireframe, KPI cards, weekly trends, user workload analytics) / 76_enterprise_components.md (8+ enterprise UI component specs, Props, Variants, A11y, framework mapping) — Auto-generated for SaaS/Analytics/HR/Collab/Tool domains. World\'s only enterprise SaaS architecture auto-generation engine.</p>'+
      '<h3>⑳ CI/CD Intelligence (4 files)</h3>'+
      '<p>77_cicd_pipeline_design.md (9-stage pipeline design, Mermaid graph TD, deploy-target GitHub Actions YAML, cache strategy, matrix tests) / 78_deployment_strategy.md (dev/staging/prod env strategy, blue-green/canary/rolling/recreate strategy selection, rollback automation, secrets management) / 79_quality_gate_matrix.md (stage × gate matrix, coverage thresholds, performance budget, domain-specific gates, Mermaid flow) / 80_release_engineering.md (Trunk-Based/GitFlow/GitHub Flow selection, Mermaid gitGraph, semantic versioning, Renovate config, SBOM generation) — Generated for all domains. CI/CD pipeline auto-design engine optimized for 9 deploy targets (Vercel/Firebase/CF/Railway/Fly/Render/AWS/Docker/Netlify).</p>'+
      '<h3>㉑ API Design Intelligence (4 files)</h3>'+
      '<p>83_api_design_principles.md (REST principles, versioning, error handling) / 84_openapi_specification.md (OpenAPI 3.1 full spec, schema definitions, Swagger UI config) / 85_api_security_checklist.md (OWASP API Security Top 10 2023, auth, rate limiting) / 86_api_testing_strategy.md (k6 load testing, contract tests, mock strategy) — Complete API intelligence for REST/GraphQL/gRPC/BaaS approaches.</p>'+
      '<h3>㉒ Database Design Intelligence (4 files)</h3>'+
      '<p>87_database_design.md (normalization, index strategy, naming conventions, partitioning) / 88_migration_strategy.md (migration patterns, rollback procedures, data integrity) / 89_database_security.md (RLS policies, encryption, audit logs, access control) / 90_query_optimization.md (query optimization, N+1 prevention, execution plan analysis) — ORM-specific: Prisma/Drizzle/TypeORM/SQLAlchemy/Kysely.</p>'+
      '<h3>㉓ Test Intelligence (4 files)</h3>'+
      '<p>91_test_strategy.md (test pyramid, coverage targets, TDD workflow) / 92_unit_integration_tests.md (per-framework unit &amp; integration test patterns, mock strategy) / 93_e2e_tests.md (Playwright config, auth storageState, CI parallelization, visual regression) / 94_performance_testing.md (Web Vitals, Lighthouse CI, k6 load testing, SLO validation) — Frontend (Next.js/React/Vue/Svelte) and backend (Python/Java/Node/BaaS) specific.</p>'+
      '<h3>㉔ AI Safety Intelligence (4 files)</h3>'+
      '<p>95_ai_risk_assessment.md (AI feature risk categories, threat modeling, stakeholder impact) / 96_guardrail_implementation.md (4-layer guardrails: input/output/content/access control) / 97_ai_model_evaluation.md (accuracy, fairness, transparency, security, privacy evaluation) / 98_prompt_injection_defense.md (injection detection, defense-in-depth, AI-specific security testing) — Provider-specific: Claude/OpenAI/Gemini/Local LLM.</p>'+
      '<h3>㉕ Performance Intelligence (4 files)</h3>'+
      '<p>99_performance_strategy.md (Core Web Vitals, bundle optimization, image optimization, SSR/SSG) / 100_database_performance.md (per-ORM query optimization, index design, connection pool, slow query analysis) / 101_cache_strategy.md (multi-layer cache: Redis/CDN/memory, TTL strategy, cache invalidation) / 102_performance_monitoring.md (APM config: Sentry/DataDog/NewRelic, SLO/SLI, cost optimization) — Performance intelligence for all domains.</p>'+
      '<h3>㉖ Observability Intelligence (4 files)</h3>'+
      '<p>103_observability_architecture.md (OpenTelemetry pipeline, deploy-target tool selection, SLO YAML) / 104_structured_logging.md (per-backend structured logging: Pino/structlog/SLF4J, [REDACTED] masking) / 105_metrics_alerting.md (RED/USE metrics, prom-client, domain business metrics, Alertmanager rules) / 106_distributed_tracing.md (OpenTelemetry SDK setup per backend/deploy, W3C TraceContext, Grafana dashboard as code) — Observability intelligence for all domains.</p>'+
      '<h3>㉗ Cost Optimization Intelligence (4 files)</h3>'+
      '<p>109_cost_architecture.md (cloud cost design, scale estimates, tag strategy, free tier checklist) / 110_resource_optimization.md (compute optimization, DB cost reduction, cache strategy, network optimization) / 111_finops_strategy.md (FinOps maturity model, budget alert YAML, optimization backlog, review cadence) / 112_cost_monitoring.md (monitoring tools, alert thresholds, monthly checklist, AI cost analysis prompt) — Cost optimization intelligence for all deploy targets.</p>'
    },
    {id:'export',title:_ja?'エクスポート':'Export',body:_ja?
      '<h2>エクスポート方法</h2><p><strong>ZIP</strong>: 全185+ファイルをフォルダ構造付きでZIP圧縮ダウンロード。<br><strong>PDF</strong>: Markdownファイルを整形してブラウザのPDF印刷で出力。<br><strong>URL共有</strong>: プロジェクト設定をBase64エンコードしてURL共有。<br><strong>全ファイルコピー</strong>: 全ドキュメントを1テキストに結合してクリップボードにコピー（Ctrl+Shift+C）。AIへの一括投入に最適。</p><h3>テンプレート保存</h3><p>プロジェクト設定をlocalStorageに保存し、次回起動時に読み込み可能。</p>'+
      '<p class="workflow-ref">📘 <strong>エクスポート後の開発手順は <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">生成後ワークフローガイド</a> を参照</strong></p>'
      :
      '<h2>Export Methods</h2><p><strong>ZIP</strong>: Download all 185+ files as a ZIP with folder structure.<br><strong>PDF</strong>: Format Markdown files and print via browser PDF.<br><strong>URL Sharing</strong>: Base64-encode project settings and share via URL.<br><strong>Copy All Files</strong>: Combine all documents into one text and copy to clipboard (Ctrl+Shift+C). Ideal for bulk AI input.</p><h3>Template Save</h3><p>Save project settings to localStorage and load them on next launch.</p>'+
      '<p class="workflow-ref">📘 <strong>For development workflow after export, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'
    },
    {id:'guide',title:_ja?'🚀 活用ガイド':'🚀 Usage Guide',body:function(){
      const baseBody=_ja?
      '<h2>🚀 生成ファイル活用ガイド</h2>'+
      '<p>DevForge v9 は世界で唯一の<strong>仕様駆動AIプロジェクトジェネレーター</strong>です。他のツールが「コード」を生成するのに対し、DevForge は「開発の知性」── 設計・環境・ルール・学習計画を185+ファイルで生成します。</p>'+
      '<h3>🌱 Beginner — まず動かす</h3>'+
      '<h4>⭐ 具体的な使用方法（手順詳細）</h4>'+
      '<p><strong>Step 1: ロードマップに従う</strong><br>ダッシュボード（柱⑦）のロードマップUIがそのまま学習計画。Layer 1から順にチェック。📖ボタンで公式ドキュメントに直接ジャンプ。各技術の学習順序が最適化されています。</p>'+
      '<p><strong>Step 2: 3つだけ覚える</strong><br>• <code>README.md</code> — GitHubにそのまま公開OK<br>• <code>.devcontainer/</code> — VS Code/Cursorで開くだけで環境完成<br>• <code>CLAUDE.md</code> — AIに「これ読んで」で全仕様を理解させる</p>'+
      '<p><strong>Step 3: AIに丸ごと渡す</strong><br>「全ファイルコピー」(Ctrl+Shift+C) → AIツールに貼り付け → 仕様を把握した状態で開発スタート。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-c">Ctrl+Shift+C<br>コピー</span><span class="hg-a">→</span><span class="hg-n hg-p">AI貼付<br>Cursor等</span><span class="hg-a">→</span><span class="hg-n hg-g">開発<br>スタート</span></div>'+
      '<h4>⭐ 注意事項（リスク回避）</h4>'+
      '<p>• <strong>必ずZIP+JSONバックアップ</strong> — localStorageは消失リスクあり。作業後は必ず📦ZIPダウンロード + 📤JSONエクスポートの2段構え<br>'+
      '• <strong>生成ファイルは設計書</strong> — 185+ファイルは実行コードではなく設計ドキュメント。AIツールに投入して実コードを生成<br>'+
      '• <strong>スキルレベルは途中で変更しない</strong> — 回答との不整合が起きる。最初に正しく設定<br>'+
      '• <strong>モデル適合度80%超時はフォルダ選択で絞る</strong> — ダッシュボードでモデル適合度確認。80%超時はランチャーのフォルダ選択で.spec/のみ等に絞る</p>'+
      '<h4>⭐ よくある失敗例</h4>'+
      '<table><tr><th>失敗</th><th>原因</th><th>対策</th></tr>'+
      '<tr><td>ファイルを直接実行</td><td>設計書をコードと誤認</td><td>AIに投入して実コード生成</td></tr>'+
      '<tr><td>全ファイル一度にAIに投入</td><td>トークン超過</td><td>.spec/のみで開始</td></tr>'+
      '<tr><td>バックアップしない</td><td>localStorage依存</td><td>ZIP+JSON必須</td></tr>'+
      '<tr><td>tasks.mdを使わない</td><td>非構造的な指示</td><td>Issue番号順に進める</td></tr></table>'+
      '<h3>🔥 Intermediate — 効率を極める</h3>'+
      '<h4>⭐⭐ 効率的な活用方法</h4>'+
      '<p><strong>SDD仕様駆動開発:</strong> <code>.spec/</code> がプロジェクトのSSoT（信頼できる唯一の情報源）。constitution.md(憲法) → specification.md(要件) → tasks.md(タスク) → verification.md(完了基準)。AIへの指示は「tasks.mdの○○を実装して」の一文で完結。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">constitution<br>原則</span><span class="hg-a">→</span><span class="hg-n hg-c">specification<br>要件</span><span class="hg-a">→</span><span class="hg-n hg-p">tasks<br>タスク</span><span class="hg-a">→</span><span class="hg-n hg-g">verification<br>完了基準</span></div>'+
      '<p><strong>マルチAIツール統一:</strong> 柱④で生成される10+ファイルがCursor/.cursor/rules、Claude Code/CLAUDE.md、Copilot/.github/copilot-instructions.md、Windsurf/.windsurfrules、Cline/.clinerules、Gemini/.gemini/settings.json等を同時カバー。どのツールに乗り換えても同じルール。</p>'+
      '<p><strong>MCP拡張:</strong> mcp-config.jsonをプロジェクトルートに配置 → context7(最新ドキュメント)、filesystem(構造把握)、playwright(E2Eテスト)等をAIが即利用。</p>'+
      '<h4>⭐⭐ カスタマイズのポイント</h4>'+
      '<p>• <strong>.claude/rules/の5ファイル</strong> — spec.md(仕様開発用)・frontend.md(FE開発用)・backend.md(BE開発用)・test.md(テスト開発用)・ops.md(運用開発用)をプロジェクト固有ルールに編集。パス別自動ロード。<br>'+
      '• <strong>docs/43-47 セキュリティインテリジェンス</strong> — OWASP監査・STRIDE脅威モデル・コンプライアンスマトリクス・AI Security・セキュリティテスト設定をカスタマイズ<br>'+
      '• <strong>docs/48-52 戦略インテリジェンス</strong> — 業種別設計図・技術レーダー・ステークホルダー戦略・オペレーショナルエクセレンスで業種別最適化<br>'+
      '• <strong>ランチャーのテンプレートチェーン</strong> — 📋レビュー→🔨実装→🧪テスト→♻️リファクタの順次実行で効率化</p>'+
      '<h4>⭐⭐ 品質向上のチェックリスト</h4>'+
      '<p>✅ verification.mdで各機能の受入基準確認<br>✅ docs/32 QA Blueprintの品質ゲート通過<br>✅ モデル適合度80%以内で運用<br>✅ docs/33 Test Matrixでカバレッジ検証<br>✅ ランチャー🔒セキュリティテンプレートで監査実施<br>✅ docs/53-55 Ops関連ドキュメントで運用準備確認</p>'+
      '<h3>⚡ Professional — 自動化を支配する</h3>'+
      '<h4>⭐⭐⭐ 高度な統合・自動化</h4>'+
      '<p><strong>Agent Teams並列開発:</strong> AGENTS.mdでエージェント役割を定義 → Claude Code Subagents / Antigravity Manager View で並列実行。tasks.mdがタスクキューとして機能。</p>'+
      '<p><strong>CI/CDゲート化:</strong> .ai/hooks.yml → GitHub Actions変換。docs/09_release_checklist.mdをデプロイゲートに。verification.mdを品質基準に。</p>'+
      '<p><strong>50テンプレートパイプライン:</strong> 柱⑧の全テンプレート順次実行 → 📋レビュー→🔨実装→🧪テスト→♻️リファクタ→🔒セキュリティ→📝ドキュメント→🛡️Ops準備→🏢エンタープライズアーキテクチャ。仕様書が全工程の入力。<strong>（📖 詳細はプロンプトマニュアル参照）</strong></p>'+
      '<h4>⭐⭐⭐ パフォーマンス最適化</h4>'+
      '<p>• <strong>CLAUDE.md 3-layer split</strong> — ルートCLAUDE.md（薄い ~1.5Kトークン） + .claude/rules/（パス別5ファイル） + .claude/settings.json でトークン消費を最小化<br>'+
      '• <strong>フォルダ選択最適化</strong> — デバッグ時: docs/25+37のみ、仕様確認時: .spec/のみ等、状況に応じて選択<br>'+
      '• <strong>コンテキスト・ローテーション戦略</strong> — docs/40 WSCIワークフロー活用。AI開発OS全体でコンテキスト管理</p>'+
      '<h4>⭐⭐⭐ エッジケース対応</h4>'+
      '<p>• <strong>docs/44 STRIDE脅威モデル</strong> — 攻撃面の網羅確認。エンティティ別脅威分析・攻撃対象領域・対策マトリクス<br>'+
      '• <strong>docs/46 AI Security</strong> — 敵対的プロンプト・パッケージ幻覚・AI生成コードレビュー・Agent Securityで対策<br>'+
      '• <strong>docs/54 Ops Checklist</strong> — 12 Ops Capabilities（Feature Flags・SLO/SLI・Observability・Jobs・Backup等）の完全実装<br>'+
      '• <strong>docs/55 Circuit Breaker・Evidence-Based Ops</strong> — Ops Plane Architecture・Admin Consoleセキュリティ設計</p>'+
      '<h3>⚔️ 他ツールとの比較</h3>'+
      '<table><tr><th>機能</th><th>DevForge v9</th><th>create-next-app</th><th>AI直接依頼</th></tr>'+
      '<tr><td>SDD仕様書5点</td><td>✅ 自動</td><td>✗</td><td>△ 手動</td></tr>'+
      '<tr><td>10ツールAIルール</td><td>✅ 自動</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>互換性チェック</td><td>✅ 自動</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>ロードマップ</td><td>✅ 自動</td><td>✗</td><td>△ 手動</td></tr>'+
      '<tr><td>DevContainer</td><td>✅ 自動</td><td>✗</td><td>△ 手動</td></tr>'+
      '<tr><td>MCP+Agent設定</td><td>✅ 自動</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>'+_TECH_COUNT+' Tech DB</td><td>✅ 内蔵</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>オフライン動作</td><td>✅</td><td>✅</td><td>✗</td></tr></table>'+
      '<h3>📋 ファイル活用マップ</h3>'+
      '<table><tr><th>ファイル</th><th>🌱初心者</th><th>🔥中級者</th><th>⚡上級者</th></tr>'+
      '<tr><td><code>CLAUDE.md</code></td><td>そのまま</td><td>カスタマイズ</td><td>Agent共有設定</td></tr>'+
      '<tr><td><code>.spec/</code></td><td>読むだけ</td><td>AIに1つずつ</td><td>タスクキュー化</td></tr>'+
      '<tr><td><code>.devcontainer/</code></td><td>そのまま</td><td>カスタマイズ</td><td>チーム標準化</td></tr>'+
      '<tr><td><code>.claude/rules/</code> (5ファイル)</td><td>触らない</td><td>カスタマイズ</td><td>パス別最適化</td></tr>'+
      '<tr><td><code>roadmap/</code></td><td>学習ガイド</td><td>進捗管理</td><td>オンボーディング</td></tr>'+
      '<tr><td><code>docs/</code> 80ファイル</td><td>後で参照</td><td>レビュー素材</td><td>CI/CDゲート</td></tr>'+
      '<tr><td><code>docs/29-30</code> リバースEng</td><td>読むだけ</td><td>逆算計画</td><td>マイルストーン管理</td></tr>'+
      '<tr><td><code>docs/43-47</code> セキュリティ</td><td>不要</td><td>セキュリティ監査</td><td>セキュリティゲート</td></tr>'+
      '<tr><td><code>docs/48-52</code> 戦略</td><td>不要</td><td>業種確認</td><td>戦略統合</td></tr>'+
      '<tr><td><code>docs/53-55</code> Ops</td><td>不要</td><td>SLO参照</td><td>運用自動化</td></tr>'+
      '<tr><td><code>docs/56-59</code> 未来戦略</td><td>不要</td><td>市場確認</td><td>戦略統合</td></tr>'+
      '<tr><td>柱④ AIルール</td><td>触らない</td><td>ルール追加</td><td>全ツール統一</td></tr>'+
      '<tr><td>柱⑧ ランチャー</td><td>使わない</td><td>部分利用</td><td>全工程自動化</td></tr>'+
      '<tr><td><code>.mcp/ + config</code></td><td>後で</td><td>そのまま</td><td>カスタムMCP</td></tr>'+
      '<tr><td><code>skills/</code></td><td>不要</td><td>参照</td><td>エージェントパイプライン</td></tr>'+
      '<tr><td><code>AGENTS.md</code></td><td>不要</td><td>参照</td><td>並列Agent</td></tr>'+
      '<tr><td><code>.ai/hooks.yml</code></td><td>不要</td><td>参照</td><td>CI/CD統合</td></tr></table>'+
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 レベル別ガイドを表示</button> <button class="btn btn-s btn-sm" onclick="showManual(\'workflow\')">📘 生成後ワークフロー</button></p>'+
      '<p class="guide-action-p"><button class="btn btn-s btn-sm" onclick="window.open(\'devforge-v9-usage-guide.html\',\'_blank\',\'noopener\')">📖 活用ガイド（別ページ）</button> <button class="btn btn-s btn-sm" onclick="window.open(\'tech-selection-guide.html\',\'_blank\',\'noopener\')">📊 技術選定ガイド</button></p>':
      '<h2>🚀 Generated Files Usage Guide</h2>'+
      '<p>DevForge v9 is the world\'s only <strong>spec-driven AI project generator</strong>. While other tools generate code, DevForge generates "development intelligence" — design, environment, rules, and learning plans through 185+ files.</p>'+
      '<h3>🌱 Beginner — Get Started</h3>'+
      '<h4>⭐ Specific Usage Methods (Detailed Steps)</h4>'+
      '<p><strong>Step 1: Follow the Roadmap</strong><br>The Dashboard (Pillar ⑦) roadmap UI is your learning plan. Check off from Layer 1. Hit 📖 to jump to official docs. Learning order is optimized for each tech stack.</p>'+
      '<p><strong>Step 2: Remember Just 3 Files</strong><br>• <code>README.md</code> — Publish directly to GitHub<br>• <code>.devcontainer/</code> — Open in VS Code/Cursor and dev env is ready<br>• <code>CLAUDE.md</code> — Tell AI "read this" and it understands your entire project</p>'+
      '<p><strong>Step 3: Feed Everything to AI</strong><br>"Copy All Files" (Ctrl+Shift+C) → Paste into AI tool → Start coding with full project context.</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Ctrl+Shift+C<br>Copy</span><span class="hg-a">→</span><span class="hg-n hg-p">Paste to<br>AI Tool</span><span class="hg-a">→</span><span class="hg-n hg-g">Start<br>Coding</span></div>'+
      '<h4>⭐ Cautions (Risk Avoidance)</h4>'+
      '<p>• <strong>Always Backup ZIP+JSON</strong> — localStorage has loss risk. After work: 📦ZIP Download + 📤JSON Export (2-layer backup)<br>'+
      '• <strong>Files are Design Docs</strong> — 185+ files are not executable code but design documents. Feed them to AI tools to generate real code<br>'+
      '• <strong>Don\'t Change Skill Level Mid-Project</strong> — Causes inconsistency with answers. Set correctly at the start<br>'+
      '• <strong>Use Folder Selection When Model Fit >80%</strong> — Check model fit in Dashboard. If >80%, narrow down to .spec/ only via launcher folder selection</p>'+
      '<h4>⭐ Common Pitfalls</h4>'+
      '<table><tr><th>Pitfall</th><th>Cause</th><th>Solution</th></tr>'+
      '<tr><td>Try to run files directly</td><td>Mistook design docs as code</td><td>Feed to AI to generate real code</td></tr>'+
      '<tr><td>Feed all files to AI at once</td><td>Token overflow</td><td>Start with .spec/ only</td></tr>'+
      '<tr><td>No backup</td><td>Rely only on localStorage</td><td>ZIP+JSON mandatory</td></tr>'+
      '<tr><td>Don\'t use tasks.md</td><td>Unstructured AI instructions</td><td>Follow Issue numbers in order</td></tr></table>'+
      '<h3>🔥 Intermediate — Maximize Efficiency</h3>'+
      '<h4>⭐⭐ Efficient Usage Methods</h4>'+
      '<p><strong>SDD Workflow:</strong> <code>.spec/</code> is your SSoT (Single Source of Truth). constitution.md(principles) → specification.md(requirements) → tasks.md(tasks) → verification.md(acceptance criteria). Tell AI: "implement X from tasks.md following specification.md".</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">constitution<br>principles</span><span class="hg-a">→</span><span class="hg-n hg-c">specification<br>requirements</span><span class="hg-a">→</span><span class="hg-n hg-p">tasks<br>tasks</span><span class="hg-a">→</span><span class="hg-n hg-g">verification<br>acceptance</span></div>'+
      '<p><strong>Multi-AI Tool Unity:</strong> Pillar ④ generates 10+ files covering Cursor/.cursor/rules, Claude Code/CLAUDE.md, Copilot/.github/copilot-instructions.md, Windsurf/.windsurfrules, Cline/.clinerules, Gemini/.gemini/settings.json etc. Same rules regardless of which tool you switch to.</p>'+
      '<p><strong>MCP Extension:</strong> Place mcp-config.json in project root → AI instantly uses context7 (latest docs), filesystem (structure understanding), playwright (E2E test) MCPs.</p>'+
      '<h4>⭐⭐ Customization Points</h4>'+
      '<p>• <strong>.claude/rules/ 5 files</strong> — Edit spec.md (for spec dev), frontend.md (for FE dev), backend.md (for BE dev), test.md (for test dev), ops.md (for ops dev) for project-specific rules. Auto-loaded by path.<br>'+
      '• <strong>docs/43-47 Security Intelligence</strong> — Customize OWASP audit, STRIDE threat model, compliance matrix, AI Security, security testing config<br>'+
      '• <strong>docs/48-52 Strategic Intelligence</strong> — Use industry blueprint, tech radar, stakeholder strategy, operational excellence for domain-specific optimization<br>'+
      '• <strong>Launcher Template Chains</strong> — Sequential execution: 📋Review→🔨Implement→🧪Test→♻️Refactor for efficiency</p>'+
      '<h4>⭐⭐ Quality Improvement Checklist</h4>'+
      '<p>✅ Check acceptance criteria in verification.md for each feature<br>✅ Pass quality gates in docs/32 QA Blueprint<br>✅ Keep model fit ≤80%<br>✅ Verify coverage with docs/33 Test Matrix<br>✅ Run audit with launcher 🔒Security template<br>✅ Confirm ops readiness with docs/53-55 Ops docs</p>'+
      '<h3>⚡ Professional — Master Automation</h3>'+
      '<h4>⭐⭐⭐ Advanced Integration & Automation</h4>'+
      '<p><strong>Agent Teams Parallel Dev:</strong> AGENTS.md defines agent roles → Run with Claude Code Subagents / Antigravity Manager View in parallel. tasks.md serves as task queue.</p>'+
      '<p><strong>CI/CD Gates:</strong> .ai/hooks.yml → GitHub Actions conversion. docs/09_release_checklist.md as deploy gate. verification.md as quality baseline.</p>'+
      '<p><strong>34-Template Pipeline:</strong> Pillar ⑧ full template sequential execution → 📋Review→🔨Implement→🧪Test→♻️Refactor→🔒Security→📝Docs→🛡️Ops Readiness→🏢Enterprise Arch. Specs feed all stages. <strong>(📖 See Prompt Manual for details)</strong></p>'+
      '<h4>⭐⭐⭐ Performance Optimization</h4>'+
      '<p>• <strong>CLAUDE.md 3-layer split</strong> — Root CLAUDE.md (thin ~1.5K tokens) + .claude/rules/ (path-specific 5 files) + .claude/settings.json minimizes token consumption<br>'+
      '• <strong>Folder Selection Optimization</strong> — Debugging: docs/25+37 only, Spec check: .spec/ only etc. Select by context<br>'+
      '• <strong>Context Rotation Strategy</strong> — Use docs/40 WSCI workflow. Manage context across AI Dev OS</p>'+
      '<h4>⭐⭐⭐ Edge Case Handling</h4>'+
      '<p>• <strong>docs/44 STRIDE Threat Model</strong> — Comprehensive attack surface check. Entity-specific threat analysis, attack surface, mitigation matrix<br>'+
      '• <strong>docs/46 AI Security</strong> — Adversarial prompts, package hallucination, AI code review, Agent Security countermeasures<br>'+
      '• <strong>docs/54 Ops Checklist</strong> — Complete implementation of 12 Ops Capabilities (Feature Flags, SLO/SLI, Observability, Jobs, Backup etc.)<br>'+
      '• <strong>docs/55 Circuit Breaker・Evidence-Based Ops</strong> — Ops Plane Architecture, Admin Console security design</p>'+
      '<h3>⚔️ Comparison with Other Tools</h3>'+
      '<table><tr><th>Feature</th><th>DevForge v9</th><th>create-next-app</th><th>AI Direct</th></tr>'+
      '<tr><td>SDD 5 Spec Docs</td><td>✅ Auto</td><td>✗</td><td>△ Manual</td></tr>'+
      '<tr><td>10-Tool AI Rules</td><td>✅ Auto</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>Compat Check</td><td>✅ Auto</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>Roadmap</td><td>✅ Auto</td><td>✗</td><td>△ Manual</td></tr>'+
      '<tr><td>DevContainer</td><td>✅ Auto</td><td>✗</td><td>△ Manual</td></tr>'+
      '<tr><td>MCP+Agent Setup</td><td>✅ Auto</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>'+_TECH_COUNT+' Tech DB</td><td>✅ Built-in</td><td>✗</td><td>✗</td></tr>'+
      '<tr><td>Offline</td><td>✅</td><td>✅</td><td>✗</td></tr></table>'+
      '<h3>📋 File Usage Map</h3>'+
      '<table><tr><th>File</th><th>🌱Beginner</th><th>🔥Intermediate</th><th>⚡Pro</th></tr>'+
      '<tr><td><code>CLAUDE.md</code></td><td>As-is</td><td>Customize</td><td>Agent config</td></tr>'+
      '<tr><td><code>.spec/</code></td><td>Read only</td><td>Feed AI one by one</td><td>Task queue</td></tr>'+
      '<tr><td><code>.devcontainer/</code></td><td>As-is</td><td>Customize</td><td>Team standard</td></tr>'+
      '<tr><td><code>.claude/rules/</code> (5 files)</td><td>Don\'t touch</td><td>Customize</td><td>Path-specific tuning</td></tr>'+
      '<tr><td><code>roadmap/</code></td><td>Learning</td><td>Progress</td><td>Onboarding</td></tr>'+
      '<tr><td><code>docs/</code> 76 files</td><td>Later</td><td>Review material</td><td>CI/CD gates</td></tr>'+
      '<tr><td><code>docs/29-30</code> Reverse Eng</td><td>Read only</td><td>Reverse planning</td><td>Milestone mgmt</td></tr>'+
      '<tr><td><code>docs/43-47</code> Security</td><td>Skip</td><td>Security audit</td><td>Security gates</td></tr>'+
      '<tr><td><code>docs/48-52</code> Strategy</td><td>Skip</td><td>Industry check</td><td>Full strategy</td></tr>'+
      '<tr><td><code>docs/53-55</code> Ops</td><td>Skip</td><td>SLO reference</td><td>Ops automation</td></tr>'+
      '<tr><td><code>docs/56-59</code> Future Strategy</td><td>Skip</td><td>Market check</td><td>Full integration</td></tr>'+
      '<tr><td>Pillar ④ AI Rules</td><td>Don\'t touch</td><td>Add rules</td><td>Unified ops</td></tr>'+
      '<tr><td>Pillar ⑧ Launcher</td><td>Skip</td><td>Partial use</td><td>Full pipeline</td></tr>'+
      '<tr><td><code>.mcp/ + config</code></td><td>Later</td><td>As-is</td><td>Custom MCP</td></tr>'+
      '<tr><td><code>skills/</code></td><td>Skip</td><td>Reference</td><td>Agent pipeline</td></tr>'+
      '<tr><td><code>AGENTS.md</code></td><td>Skip</td><td>Reference</td><td>Multi-Agent</td></tr>'+
      '<tr><td><code>.ai/hooks.yml</code></td><td>Skip</td><td>Reference</td><td>CI/CD Integration</td></tr></table>'+
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 Show Level Guide</button> <button class="btn btn-s btn-sm" onclick="showManual(\'workflow\')">📘 Post-Gen Workflow</button></p>'+
      '<p class="guide-action-p"><button class="btn btn-s btn-sm" onclick="window.open(\'devforge-v9-usage-guide.html\',\'_blank\',\'noopener\')">📖 Usage Guide (Full Page)</button> <button class="btn btn-s btn-sm" onclick="window.open(\'tech-selection-guide.html\',\'_blank\',\'noopener\')">📊 Tech Selection Guide</button></p>';
      let h=baseBody;
      // Add domain-specific first steps
      const a=S.answers||{};
      const dom=detectDomain(a.purpose||'')||'_default';
      const steps=DOMAIN_FIRST_STEPS[dom]||DOMAIN_FIRST_STEPS._default;
      h+=_ja?'<h3>🎯 ドメイン別 初手ステップ</h3>':'<h3>🎯 Domain-Specific First Steps</h3>';
      h+='<div class="guide-domain-steps">';
      ((_ja?steps.ja:steps.en)||[]).forEach((s,i)=>{h+=`<div class="guide-step-mini"><span class="guide-step-num-mini">${i+1}</span><span>${s}</span></div>`;});
      h+='</div>';
      // Add AI tool recipe
      const tools=(a.ai_tools||'').split(',').map(t=>t.trim()).filter(t=>t);
      const tool=tools.find(t=>AI_TOOL_RECIPES[t])||'_default';
      const recipe=AI_TOOL_RECIPES[tool]||AI_TOOL_RECIPES._default;
      h+=_ja?'<h3>🤖 AIツール別ワークフロー</h3>':'<h3>🤖 AI Tool Workflow</h3>';
      h+=`<div class="guide-ai-recipe"><h4>${tool==='_default'?(_ja?'汎用ワークフロー':'Generic Workflow'):tool}</h4>`;
      ((_ja?recipe.ja:recipe.en)||[]).forEach(s=>{h+=`<div class="guide-recipe-step">${s}</div>`;});
      h+='</div>';
      // Add ADRs
      const adrs=getADRs(a,_ja);
      if(adrs.length>0){
        h+=_ja?'<h3>📐 Architecture Decision Records (ADR)</h3>':'<h3>📐 Architecture Decision Records (ADR)</h3>';
        h+=_ja?'<p class="guide-adr-intro">ユーザーの選択から自動抽出された設計判断:</p>':'<p class="guide-adr-intro">Auto-extracted design decisions from your choices:</p>';
        h+='<div class="guide-adrs">';
        adrs.forEach(adr=>{h+=`<div class="guide-adr"><span class="guide-adr-icon">${adr.icon}</span><div><strong>${adr.t}</strong><p>${adr.d}</p></div></div>`;});
        h+='</div>';
      }
      return h;
    }},
    {id:'workflow',title:_ja?'📘 生成後ワークフロー':'📘 Post-Gen Workflow',body:_ja?
      '<h2>📘 生成後ワークフロー完全ガイド</h2>'+
      '<p class="guide-workflow-intro">DevForge v9で185+ファイルを生成した後、<strong>実際に動くアプリを作るまでの一気通貫の手順</strong>を5フェーズで解説します。</p>'+
      '<h3>① 基礎概念 — DevForgeの生成物を理解する</h3>'+
      '<div class="workflow-concept"><p><strong>重要:</strong> DevForgeが生成するのは<strong class="workflow-highlight">設計ドキュメント</strong>であり、実行可能なアプリケーションコードではありません。</p>'+
      '<p><strong>SDD（仕様駆動開発）の思想:</strong> <code>.spec/</code>がSSoT（信頼できる唯一の情報源）として機能します。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-c">AIツールに<br>投入</span><span class="hg-a">→</span><span class="hg-n hg-p">実コード<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-g">動くアプリ<br>完成</span></div></div>'+
      '<h4>185+ファイルの全体像</h4>'+
      '<table class="workflow-files"><tr><th>カテゴリ</th><th>内容</th><th>ファイル数</th></tr>'+
      '<tr><td>.spec/</td><td>仕様駆動開発の5点セット</td><td>5</td></tr>'+
      '<tr><td>.devcontainer/</td><td>Docker開発環境</td><td>4</td></tr>'+
      '<tr><td>.mcp/</td><td>Model Context Protocol設定</td><td>3</td></tr>'+
      '<tr><td>AIルール</td><td>10+ツール対応（Cursor, Claude Code等）</td><td>12+</td></tr>'+
      '<tr><td>.claude/</td><td>パス別AIルール+設定</td><td>6</td></tr>'+
      '<tr><td>docs/</td><td>76種類の仕様書・設計書</td><td>76</td></tr>'+
      '<tr><td>roadmap/</td><td>学習パス</td><td>9</td></tr>'+
      '<tr><td>共通</td><td>README, LICENSE等</td><td>4</td></tr>'+
      '<tr><td>未来戦略</td><td>市場・UX・エコシステム・規制</td><td>4</td></tr></table>'+
      '<h3>①-B レベル別ワークフロー — あなたの道を選ぶ</h3>'+
      '<div class="workflow-level-guide">'+
      '<h4>🌱 Beginner Track</h4>'+
      '<h5>推奨ワークフロー（6ステップ）</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>.spec/constitution.md を読む（プロジェクトの使命）</li>'+
      '<li>.spec/tasks.md → Sprint 1 のタスクを1つ選ぶ</li>'+
      '<li>CLAUDE.md 全文をAIツールにコピペ（Ctrl+Shift+C）</li>'+
      '<li>「tasks.mdのタスクXを、specification.mdに従って実装して」と指示</li>'+
      '<li>docs/07_test_cases.md を参照しながらテスト</li>'+
      '<li>ZIP+JSONで必ずバックアップ</li></ol>'+
      '<p><strong>NFR目標:</strong> 応答1000ms / ベストエフォート可用性 / 50同時接続</p>'+
      '<h5>注意事項</h5>'+
      '<ul class="workflow-level-cautions">'+
      '<li>生成ファイルを直接実行しない（設計書であり実行コードではない）</li>'+
      '<li>全185+ファイルを一度にAIに投入しない（.spec/から開始）</li>'+
      '<li>AIに「何を作ればいいですか？」と聞かない（tasks.mdに全て書いてある）</li>'+
      '<li>バックアップを忘れない（localStorage消失リスク）</li></ul>'+
      '<h5>よくある失敗</h5>'+
      '<table class="workflow-level-pitfalls"><tr><th>失敗</th><th>原因</th><th>対策</th></tr>'+
      '<tr><td>AIの回答が矛盾</td><td>コンテキスト未共有</td><td>CLAUDE.md毎回ロード</td></tr>'+
      '<tr><td>何を聞くかわからない</td><td>仕様書未読</td><td>constitution→tasks順</td></tr>'+
      '<tr><td>MVP未完成</td><td>全機能同時着手</td><td>Sprint 1だけに集中</td></tr></table>'+
      '<h4>🔥 Intermediate Track</h4>'+
      '<h5>推奨ワークフロー</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>AI_BRIEF.md でコンテキスト圧縮（~1200トークン）</li>'+
      '<li>SDD順序: constitution → specification → tasks → verification</li>'+
      '<li>ランチャーで🔍レビュー → 🚀MVP → 🧪テスト → ♻️リファクタのチェーン実行</li>'+
      '<li>.claude/rules/ の5ファイルをプロジェクト固有にカスタマイズ</li>'+
      '<li>docs/43-47 セキュリティ + docs/53-55 Ops で品質保証</li>'+
      '<li>docs/56-59 未来戦略で市場ポジショニング確認</li></ol>'+
      '<p><strong>NFR目標:</strong> 応答500ms / 99%可用性 / 200同時接続</p>'+
      '<h5>カスタマイズ優先度</h5>'+
      '<ol class="workflow-level-priority">'+
      '<li>.spec/constitution.md → ビジネス価値精査</li>'+
      '<li>.claude/rules/*.md → プロジェクト固有ルール</li>'+
      '<li>docs/08_security.md → 業界コンプライアンス</li>'+
      '<li>docs/56_market_positioning.md → GTM戦略</li></ol>'+
      '<h5>品質チェックリスト</h5>'+
      '<p class="workflow-level-checklist">'+
      '✅ verification.md 受入基準<br>'+
      '✅ docs/32 QA Blueprint 品質ゲート<br>'+
      '✅ ランチャー🔒セキュリティ監査<br>'+
      '✅ docs/53-55 Ops準備<br>'+
      '✅ docs/57 UX戦略 アクセシビリティ確認</p>'+
      '<h4>⚡ Professional Track</h4>'+
      '<h5>推奨ワークフロー</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>AGENTS.md でエージェント役割定義 → 並列開発</li>'+
      '<li>50テンプレート全パイプライン: レビュー→実装→テスト→リファクタ→セキュリティ→Docs→Ops→エンタープライズ</li>'+
      '<li>CLAUDE.md 3-layer (root ~1.5K + .claude/rules/ + settings.json)</li>'+
      '<li>mcp-config.json + skills/pipelines.md で自動化</li>'+
      '<li>docs/55 Circuit Breaker + Evidence-Based Ops</li>'+
      '<li>docs/58 エコシステム戦略 + docs/59 規制フォーサイトで長期設計</li></ol>'+
      '<p><strong>NFR目標:</strong> 応答200ms(p95) / 99.9%可用性 / 1000+同時接続</p>'+
      '<h5>エッジケース対応</h5>'+
      '<ul class="workflow-level-edge">'+
      '<li>docs/44 STRIDE脅威モデル → 攻撃面網羅</li>'+
      '<li>docs/46 AI Security → 敵対的プロンプト対策</li>'+
      '<li>docs/54 12 Ops Capabilities → 完全実装</li>'+
      '<li>docs/59 規制対応 → EU AI Act / ESG</li></ul>'+
      '<h5>自動化チェック</h5>'+
      '<p class="workflow-level-checklist">'+
      '✅ .ai/hooks.yml → CI/CDゲート化<br>'+
      '✅ 全50テンプレートパイプライン完走<br>'+
      '✅ SLO 99.9%設計完了<br>'+
      '✅ Feature Flags全キルスイッチ設定</p>'+
      '</div>'+
      '<h3>② 準備 — 生成直後にやること</h3>'+
      '<ol class="workflow-steps">'+
      '<li><strong>監査結果の確認</strong><br>生成後のチャットパネルに表示される<code>❌ エラー</code> / <code>⚠️ 警告</code>をチェック。互換性問題や設定ミスがないか確認します。</li>'+
      '<li><strong>バックアップ（重要！）</strong><br><code>📦 ZIPダウンロード</code> + <code>📤 JSONエクスポート</code>の2段構え。<span class="workflow-warn">localStorageのみなのでデータ消失リスクあり</span>。</li>'+
      '<li><strong>開発環境構築</strong><br>'+
      '<strong>Option A（推奨）:</strong> ZIP解凍 → VS Code/Cursorで開く → DevContainerが自動構築<br>'+
      '<strong>Option B:</strong> 既存プロジェクトにファイルをコピー</li>'+
      '<li><strong>AIツール設定</strong><br>以下の表を参考に設定:</li></ol>'+
      '<table class="workflow-ai-tools"><tr><th>AIツール</th><th>自動読込ファイル</th><th>追加設定</th></tr>'+
      '<tr><td>Cursor</td><td>.cursor/rules</td><td>なし</td></tr>'+
      '<tr><td>Claude Code</td><td>CLAUDE.md</td><td>なし</td></tr>'+
      '<tr><td>Windsurf</td><td>.windsurfrules</td><td>なし</td></tr>'+
      '<tr><td>Cline</td><td>.clinerules</td><td>なし</td></tr>'+
      '<tr><td>Copilot</td><td>copilot-instructions.md</td><td>.github/に配置</td></tr>'+
      '<tr><td>その他</td><td>AI_BRIEF.md</td><td>手動貼付</td></tr></table>'+
      '<p class="workflow-note">💡 MCP設定: <code>mcp-config.json</code>をプロジェクトルートに配置</p>'+
      '<li><strong>Gitリポジトリ初期化</strong><br>'+
      '<code>git init</code> → <code>.gitignore</code> 確認（Node.js用テンプレート推奨）→ 初回コミット<br>'+
      '<span class="workflow-note">💡 ブランチ戦略: <code>main</code> + <code>develop</code> + feature branches推奨</span></li>'+
      '<li><strong>環境変数の設定</strong><br>'+
      '<code>.env.example</code> → <code>.env</code> にコピーして実際の値を設定。<span class="workflow-warn">⚠️ .envをgitにコミットしない</span></li></ol>'+
      '<h3>③ 手順 — 5フェーズ開発ワークフロー</h3>'+
      '<div class="workflow-phases">'+
      '<div class="workflow-phase"><h4>Phase A: プロジェクト理解（Day 1）</h4>'+
      '<ul><li><strong>ファイル読み順:</strong> <code>constitution.md</code> → <code>specification.md</code> → <code>technical-plan.md</code></li>'+
      '<li><strong>Dashboardチェック:</strong> シナジースコア / モデル適合 / ヘルススコアを確認</li>'+
      '<li><strong>設計確認:</strong> ER図（docs/04）+ API設計（docs/05）を把握</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase B: 環境構築（Day 1-2）</h4>'+
      '<ul><li><strong>DevContainerパス:</strong> フォルダを開く → "Reopen in Container"</li>'+
      '<li><strong>手動パス:</strong> package.json scripts + .env.exampleを参考に構築</li>'+
      '<li><strong>データベースセットアップ:</strong> docs/04_er_diagram.md のER図に基づきスキーマ定義 → Supabase: Dashboard or <code>supabase migration new</code> / Prisma: <code>npx prisma migrate dev</code> / Drizzle: <code>npx drizzle-kit push</code></li>'+
      '<li><strong>.env設定:</strong> DB接続文字列・APIキー・JWTシークレット等を <code>.env</code> に設定（.env.example参照）</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase C: AIと一緒に開発（Day 2+）</h4>'+
      '<p><strong>アプローチ1: シンプル</strong></p>'+
      '<div class="hg-flow"><span class="hg-n hg-c">Ctrl+Shift+C<br>全コピー</span><span class="hg-a">→</span><span class="hg-n hg-p">AIに貼付</span><span class="hg-a">→</span><span class="hg-n hg-g">"Issue #1を<br>実装して"</span></div>'+
      '<p><strong>アプローチ2: 構造化</strong></p>'+
      '<ul><li>ランチャーの🔍レビュー → 🚀MVP実装テンプレートを活用</li>'+
      '<li><code>tasks.md</code>のIssue番号順に進める</li>'+
      '<li>タスクループ: <code>タスク読む → 実装 → テスト → 完了マーク</code></li>'+
      '<li><code>verification.md</code>で受入基準チェック</li></ul>'+
      '<h5>推奨テンプレート順序</h5>'+
      '<ol class="workflow-template-order"><li>🔍 仕様レビュー</li><li>🚀 MVP実装</li><li>🧪 テスト生成</li><li>🔒 セキュリティ監査</li><li>📝 ドキュメント更新</li></ol>'+
      '<h5>AIが期待通りの出力をしない場合</h5>'+
      '<ul><li><strong>コンテキスト不足:</strong> CLAUDE.mdを再ロード → .spec/から明示的に参照させる</li>'+
      '<li><strong>ハルシネーション:</strong> docs/46_ai_security.md「パッケージ幻覚検知」チェックリスト活用</li>'+
      '<li><strong>コンテキスト超過:</strong> ランチャーのフォルダ選択で.spec/のみに絞る → docs/40のWSCI戦略に従う</li>'+
      '<li><strong>仕様と矛盾:</strong> verification.md の受入基準をプロンプトに含める</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase D: 品質保証</h4>'+
      '<ul><li>ランチャーテンプレート: 🧪テスト → 🔒セキュリティ → ♿a11y</li>'+
      '<li>参照先: docs/07, docs/28, docs/33</li>'+
      '<li>エラーログ: docs/25_error_logs.mdに記録</li>'+
      '<li><strong>セキュリティチェーン:</strong> docs/43（OWASP）→ docs/44（STRIDE）→ docs/45（コンプライアンス）→ docs/47（テスト設定）</li>'+
      '<li><strong>UX戦略:</strong> docs/57 のアクセシビリティ基準・ペルソナ適合確認</li>'+
      '<li><strong>規制確認:</strong> docs/59 の業種別規制チェック（fintech/health/education等）</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase E: リリース</h4>'+
      '<ul><li>docs/24_progress.mdで進捗更新</li>'+
      '<li>docs/09_release_checklist.mdに従う</li>'+
      '<li>CI/CD: .github/workflows/ci.ymlが事前設定済み</li>'+
      '<li><strong>モニタリング設定:</strong> docs/53 のSLO目標に基づきモニタリング → docs/54 の12 Ops Capabilitiesでアラート閾値設定</li>'+
      '<li><strong>インシデント準備:</strong> docs/34_incident_response.md のランブック確認・初回訓練実施</li></ul>'+
      '<h5>デプロイ先別ノート</h5>'+
      '<ul><li><strong>Vercel:</strong> vercel.json + Edge Functions + ISR → Preview Deployments有効化</li>'+
      '<li><strong>Railway:</strong> Dockerfile or Nixpack自動検出 → 環境変数はDashboard設定</li>'+
      '<li><strong>AWS:</strong> Amplify/ECS/Lambda選択 → IAM + VPC + CloudWatch連携</li>'+
      '<li><strong>Cloudflare:</strong> Pages + Workers → D1/R2連携 + Wrangler CLI</li></ul>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Build</span><span class="hg-a">→</span><span class="hg-n hg-c">Test</span><span class="hg-a">→</span><span class="hg-n hg-p">Fix</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span><span class="hg-a">→</span><span class="hg-n">Monitor</span></div></div></div>'+
      '<h3>④ 応用 — 上級テクニック</h3>'+
      '<ul class="workflow-advanced"><li><strong>テンプレートチェーン:</strong> ランチャーで複数テンプレートを順次実行（→ 📋プロンプトマニュアル参照）</li>'+
      '<li><strong>マルチエージェント開発:</strong> AGENTS.md + Claude Code Subagents</li>'+
      '<li><strong>再生成:</strong> スコープ変更後、再生成ボタン（回答は保持）</li>'+
      '<li><strong>チームオンボーディング:</strong> ロードマップ（柱⑦）で新メンバー育成</li>'+
      '<li><strong>グロース戦略:</strong> docs/41_growth_intelligence.md活用</li>'+
      '<li><strong>ゴール再検証:</strong> docs/29-30でピボット時の方向性確認</li>'+
      '<li><strong>未来戦略参照:</strong> docs/56-59で市場ポジショニング・UX戦略・エコシステム・規制対応</li></ul>'+
      '<h3>④-B リリース後の運用とイテレーション</h3>'+
      '<div class="workflow-iteration">'+
      '<h4>Sprint 2+ イテレーションワークフロー</h4>'+
      '<ul><li>フィードバック収集 (docs/57 ペルソナ・ジャーニー参照)</li>'+
      '<li>タスク優先度見直し (docs/30 優先度マトリクス + docs/56 MOAT)</li>'+
      '<li>リファクタ判断 (ランチャー📊メトリクス→♻️リファクタ)</li>'+
      '<li>ループ: フィードバック→タスク追加→実装→QA→リリース→モニタリング</li></ul>'+
      '<h4>運用モニタリングとSLO追跡</h4>'+
      '<ul><li>docs/53 SLO/SLI実測値照合</li>'+
      '<li>docs/55 Circuit Breakerパターン</li>'+
      '<li>SLO未達時: docs/34 ポストモーテム</li></ul>'+
      '<h4>Feature Flags管理</h4>'+
      '<ul><li>docs/53 Feature Flags設計</li>'+
      '<li>カナリア→段階的→フルリリース</li></ul>'+
      '<h4>市場ポジショニング再評価</h4>'+
      '<ul><li>docs/56 MOAT・GTM四半期レビュー</li>'+
      '<li>docs/58 API戦略・エコシステム</li>'+
      '<li>docs/59 規制変更チェック (EU AI Act/ESG)</li></ul></div>'+
      '<h3>⑤ よくある失敗と回避策</h3>'+
      '<table class="workflow-pitfalls"><tr><th>失敗</th><th>原因</th><th>対策</th></tr>'+
      '<tr><td>ファイルを直接実行しようとする</td><td>DevForgeの出力を誤解</td><td>設計ドキュメントをAIに投入してコード生成</td></tr>'+
      '<tr><td>バックアップしない</td><td>localStorageに依存</td><td>毎回ZIP+JSONエクスポート</td></tr>'+
      '<tr><td>互換性警告を無視</td><td>ダッシュボード未確認</td><td>⚠️警告に対処してから開発開始</td></tr>'+
      '<tr><td>全ファイルを一度にAIに投入</td><td>コンテキストウィンドウ超過</td><td>ランチャーのフォルダ選択でトークン管理</td></tr>'+
      '<tr><td>tasks.mdを使わない</td><td>非構造的なAI指示</td><td>Issue番号順に実装</td></tr>'+
      '<tr><td>verification.mdをスキップ</td><td>受入基準なし</td><td>機能ごとにverification.mdで確認</td></tr>'+
      '<tr><td>途中でスキルレベル変更</td><td>質問選択肢の不整合</td><td>最初に正しく設定</td></tr>'+
      '<tr><td>MCP未設定</td><td>AIツール連携が不完全</td><td>mcp-config.jsonを配置</td></tr>'+
      '<tr><td>Git/環境変数を忘れる</td><td>初期設定の省略</td><td>②準備のgit init+.env設定を必ず実施</td></tr>'+
      '<tr><td>リリース後の運用を想定しない</td><td>MVP偏重</td><td>④-Bの運用・イテレーション計画を確認</td></tr></table>'+
      '<h3>⑥ まとめ — クイックリファレンス</h3>'+
      '<div class="workflow-summary"><h4>12項目チェックリスト</h4>'+
      '<ol class="workflow-checklist"><li>✅ 監査結果確認（❌ / ⚠️ なし）</li><li>✅ ZIP + JSONバックアップ済み</li>'+
      '<li>✅ DevContainer起動 or 手動環境構築完了</li><li>✅ AIツールにルールファイル認識済み</li>'+
      '<li>✅ constitution.md → specification.md 読了</li><li>✅ tasks.mdを開いてタスク把握</li>'+
      '<li>✅ Issue #1から順次実装開始</li><li>✅ verification.mdで受入基準確認</li>'+
      '<li>✅ テスト・セキュリティ監査実施</li><li>✅ リリースチェックリストで最終確認</li>'+
      '<li>✅ 環境変数(.env)設定済み・git除外確認</li><li>✅ モニタリング・SLO設定完了</li></ol>'+
      '<h4>全体フロー図</h4>'+
      '<div class="hg-flow"><span class="hg-n hg-b">生成</span><span class="hg-a">→</span><span class="hg-n hg-c">バックアップ</span><span class="hg-a">→</span><span class="hg-n hg-p">環境構築</span><span class="hg-a">→</span><span class="hg-n">仕様理解</span><span class="hg-a">→</span><span class="hg-n">AI開発</span><span class="hg-a">→</span><span class="hg-n">QA</span><span class="hg-a">→</span><span class="hg-n hg-g">リリース</span><span class="hg-a">→</span><span class="hg-n">イテレーション</span></div>'+
      '<p class="workflow-footer"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 レベル別ガイドを表示</button></p></div>'
      :
      '<h2>📘 Complete Post-Generation Workflow Guide</h2>'+
      '<p class="guide-workflow-intro">After generating 185+ files with DevForge v9, follow this <strong>end-to-end workflow</strong> in 5 phases to build a working app.</p>'+
      '<h3>① Fundamentals — Understanding DevForge Output</h3>'+
      '<div class="workflow-concept"><p><strong>Important:</strong> DevForge generates <strong class="workflow-highlight">design documents</strong>, not runnable application code.</p>'+
      '<p><strong>SDD (Spec-Driven Development) Philosophy:</strong> <code>.spec/</code> serves as your SSoT (Single Source of Truth).</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Feed to<br>AI Tool</span><span class="hg-a">→</span><span class="hg-n hg-p">Generate<br>Real Code</span><span class="hg-a">→</span><span class="hg-n hg-g">Working<br>App</span></div></div>'+
      '<h4>185+ Files Overview</h4>'+
      '<table class="workflow-files"><tr><th>Category</th><th>Content</th><th>Files</th></tr>'+
      '<tr><td>.spec/</td><td>SDD 5-point set</td><td>5</td></tr>'+
      '<tr><td>.devcontainer/</td><td>Docker dev environment</td><td>4</td></tr>'+
      '<tr><td>.mcp/</td><td>Model Context Protocol config</td><td>3</td></tr>'+
      '<tr><td>AI Rules</td><td>10+ tool support (Cursor, Claude Code, etc.)</td><td>12+</td></tr>'+
      '<tr><td>.claude/</td><td>Path-specific AI rules + config</td><td>6</td></tr>'+
      '<tr><td>docs/</td><td>76 spec/design documents</td><td>76</td></tr>'+
      '<tr><td>roadmap/</td><td>Learning paths</td><td>9</td></tr>'+
      '<tr><td>Common</td><td>README, LICENSE, etc.</td><td>4</td></tr>'+
      '<tr><td>Future Strategy</td><td>Market, UX, Ecosystem, Regulatory</td><td>4</td></tr></table>'+
      '<h3>①-B Level-Specific Workflow — Choose Your Path</h3>'+
      '<div class="workflow-level-guide">'+
      '<h4>🌱 Beginner Track</h4>'+
      '<h5>Recommended Workflow (6 Steps)</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>Read .spec/constitution.md (project mission)</li>'+
      '<li>.spec/tasks.md → Pick one task from Sprint 1</li>'+
      '<li>Copy CLAUDE.md full text to AI tool (Ctrl+Shift+C)</li>'+
      '<li>Instruct: "Implement task X from tasks.md following specification.md"</li>'+
      '<li>Test while referencing docs/07_test_cases.md</li>'+
      '<li>Always backup with ZIP+JSON</li></ol>'+
      '<p><strong>NFR Targets:</strong> 1000ms response / Best-effort availability / 50 concurrent connections</p>'+
      '<h5>Cautions</h5>'+
      '<ul class="workflow-level-cautions">'+
      '<li>Don\'t run generated files directly (they are design docs, not executable code)</li>'+
      '<li>Don\'t feed all 185+ files to AI at once (start with .spec/)</li>'+
      '<li>Don\'t ask AI "What should I build?" (tasks.md has everything)</li>'+
      '<li>Don\'t forget backups (localStorage loss risk)</li></ul>'+
      '<h5>Common Pitfalls</h5>'+
      '<table class="workflow-level-pitfalls"><tr><th>Pitfall</th><th>Cause</th><th>Solution</th></tr>'+
      '<tr><td>AI contradicts itself</td><td>Missing context</td><td>Load CLAUDE.md every time</td></tr>'+
      '<tr><td>Don\'t know what to ask</td><td>Specs not read</td><td>constitution→tasks order</td></tr>'+
      '<tr><td>MVP incomplete</td><td>All features at once</td><td>Focus on Sprint 1 only</td></tr></table>'+
      '<h4>🔥 Intermediate Track</h4>'+
      '<h5>Recommended Workflow</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>AI_BRIEF.md for context compression (~1200 tokens)</li>'+
      '<li>SDD order: constitution → specification → tasks → verification</li>'+
      '<li>Launcher chain: 🔍Review → 🚀MVP → 🧪Test → ♻️Refactor</li>'+
      '<li>Customize .claude/rules/ 5 files for project-specific rules</li>'+
      '<li>docs/43-47 Security + docs/53-55 Ops for quality assurance</li>'+
      '<li>docs/56-59 Future Strategy for market positioning</li></ol>'+
      '<p><strong>NFR Targets:</strong> 500ms response / 99% availability / 200 concurrent connections</p>'+
      '<h5>Customization Priority</h5>'+
      '<ol class="workflow-level-priority">'+
      '<li>.spec/constitution.md → Business value scrutiny</li>'+
      '<li>.claude/rules/*.md → Project-specific rules</li>'+
      '<li>docs/08_security.md → Industry compliance</li>'+
      '<li>docs/56_market_positioning.md → GTM strategy</li></ol>'+
      '<h5>Quality Checklist</h5>'+
      '<p class="workflow-level-checklist">'+
      '✅ verification.md acceptance criteria<br>'+
      '✅ docs/32 QA Blueprint quality gates<br>'+
      '✅ Launcher 🔒Security audit<br>'+
      '✅ docs/53-55 Ops readiness<br>'+
      '✅ docs/57 UX Strategy accessibility check</p>'+
      '<h4>⚡ Professional Track</h4>'+
      '<h5>Recommended Workflow</h5>'+
      '<ol class="workflow-level-steps">'+
      '<li>AGENTS.md define agent roles → Parallel development</li>'+
      '<li>Full 34-template pipeline: Review→Implement→Test→Refactor→Security→Docs→Ops</li>'+
      '<li>CLAUDE.md 3-layer (root ~1.5K + .claude/rules/ + settings.json)</li>'+
      '<li>mcp-config.json + skills/pipelines.md for automation</li>'+
      '<li>docs/55 Circuit Breaker + Evidence-Based Ops</li>'+
      '<li>docs/58 Ecosystem Strategy + docs/59 Regulatory Foresight for long-term design</li></ol>'+
      '<p><strong>NFR Targets:</strong> 200ms response(p95) / 99.9% availability / 1000+ concurrent connections</p>'+
      '<h5>Edge Case Handling</h5>'+
      '<ul class="workflow-level-edge">'+
      '<li>docs/44 STRIDE Threat Model → Comprehensive attack surface</li>'+
      '<li>docs/46 AI Security → Adversarial prompt countermeasures</li>'+
      '<li>docs/54 12 Ops Capabilities → Complete implementation</li>'+
      '<li>docs/59 Regulatory → EU AI Act / ESG</li></ul>'+
      '<h5>Automation Checks</h5>'+
      '<p class="workflow-level-checklist">'+
      '✅ .ai/hooks.yml → CI/CD gate integration<br>'+
      '✅ All 50 template pipeline complete<br>'+
      '✅ SLO 99.9% design complete<br>'+
      '✅ Feature Flags all kill switches configured</p>'+
      '</div>'+
      '<h3>② Preparation — What to Do Right After Generation</h3>'+
      '<ol class="workflow-steps">'+
      '<li><strong>Check Audit Results</strong><br>Review <code>❌ Errors</code> / <code>⚠️ Warnings</code> in the chat panel after generation. Fix compatibility issues or config errors.</li>'+
      '<li><strong>Backup (Critical!)</strong><br><code>📦 Download ZIP</code> + <code>📤 Export JSON</code> in tandem. <span class="workflow-warn">Data only exists in localStorage = loss risk</span>.</li>'+
      '<li><strong>Set Up Dev Environment</strong><br>'+
      '<strong>Option A (Recommended):</strong> Extract ZIP → Open in VS Code/Cursor → DevContainer auto-builds<br>'+
      '<strong>Option B:</strong> Copy files to existing project</li>'+
      '<li><strong>Configure AI Tools</strong><br>Refer to the table below:</li></ol>'+
      '<table class="workflow-ai-tools"><tr><th>AI Tool</th><th>Auto-Loaded File</th><th>Additional Setup</th></tr>'+
      '<tr><td>Cursor</td><td>.cursor/rules</td><td>None</td></tr>'+
      '<tr><td>Claude Code</td><td>CLAUDE.md</td><td>None</td></tr>'+
      '<tr><td>Windsurf</td><td>.windsurfrules</td><td>None</td></tr>'+
      '<tr><td>Cline</td><td>.clinerules</td><td>None</td></tr>'+
      '<tr><td>Copilot</td><td>copilot-instructions.md</td><td>Place in .github/</td></tr>'+
      '<tr><td>Others</td><td>AI_BRIEF.md</td><td>Paste manually</td></tr></table>'+
      '<p class="workflow-note">💡 MCP Setup: Place <code>mcp-config.json</code> in project root</p>'+
      '<li><strong>Initialize Git Repository</strong><br>'+
      '<code>git init</code> → Verify <code>.gitignore</code> (Node.js template recommended) → Initial commit<br>'+
      '<span class="workflow-note">💡 Branch strategy: <code>main</code> + <code>develop</code> + feature branches recommended</span></li>'+
      '<li><strong>Configure Environment Variables</strong><br>'+
      'Copy <code>.env.example</code> → <code>.env</code> and set actual values. <span class="workflow-warn">⚠️ Do NOT commit .env to git</span></li></ol>'+
      '<h3>③ Workflow — 5-Phase Development Process</h3>'+
      '<div class="workflow-phases">'+
      '<div class="workflow-phase"><h4>Phase A: Project Understanding (Day 1)</h4>'+
      '<ul><li><strong>Reading Order:</strong> <code>constitution.md</code> → <code>specification.md</code> → <code>technical-plan.md</code></li>'+
      '<li><strong>Dashboard Check:</strong> Synergy Score / Model Fit / Health Score</li>'+
      '<li><strong>Design Review:</strong> ER diagram (docs/04) + API design (docs/05)</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase B: Environment Setup (Day 1-2)</h4>'+
      '<ul><li><strong>DevContainer Path:</strong> Open folder → "Reopen in Container"</li>'+
      '<li><strong>Manual Path:</strong> Follow package.json scripts + .env.example</li>'+
      '<li><strong>Database Setup:</strong> Define schema based on ER diagram in docs/04_er_diagram.md → Supabase: Dashboard or <code>supabase migration new</code> / Prisma: <code>npx prisma migrate dev</code> / Drizzle: <code>npx drizzle-kit push</code></li>'+
      '<li><strong>.env Configuration:</strong> Set DB connection string, API keys, JWT secret, etc. in <code>.env</code> (refer to .env.example)</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase C: AI-Assisted Development (Day 2+)</h4>'+
      '<p><strong>Approach 1: Simple</strong></p>'+
      '<div class="hg-flow"><span class="hg-n hg-c">Ctrl+Shift+C<br>Copy All</span><span class="hg-a">→</span><span class="hg-n hg-p">Paste to<br>AI</span><span class="hg-a">→</span><span class="hg-n hg-g">"Implement<br>Issue #1"</span></div>'+
      '<p><strong>Approach 2: Structured</strong></p>'+
      '<ul><li>Use Launcher\'s 🔍 Review → 🚀 MVP Build templates</li>'+
      '<li>Work through <code>tasks.md</code> in Issue# order</li>'+
      '<li>Task Loop: <code>Read Task → Implement → Test → Mark Complete</code></li>'+
      '<li>Check acceptance criteria in <code>verification.md</code></li></ul>'+
      '<h5>Recommended Template Order</h5>'+
      '<ol class="workflow-template-order"><li>🔍 Spec Review</li><li>🚀 MVP Build</li><li>🧪 Test Generation</li><li>🔒 Security Audit</li><li>📝 Doc Update</li></ol>'+
      '<h5>When AI Output Doesn\'t Meet Expectations</h5>'+
      '<ul><li><strong>Insufficient Context:</strong> Reload CLAUDE.md → Explicitly reference from .spec/</li>'+
      '<li><strong>Hallucination:</strong> Use "Package Hallucination Detection" checklist in docs/46_ai_security.md</li>'+
      '<li><strong>Context Overflow:</strong> Narrow folder selection to .spec/ only in Launcher → Follow WSCI strategy in docs/40</li>'+
      '<li><strong>Contradicts Spec:</strong> Include acceptance criteria from verification.md in prompt</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase D: Quality Assurance</h4>'+
      '<ul><li>Launcher templates: 🧪 Test → 🔒 Security → ♿ a11y</li>'+
      '<li>Reference: docs/07, docs/28, docs/33</li>'+
      '<li>Error Log: Record in docs/25_error_logs.md</li>'+
      '<li><strong>Security Chain:</strong> docs/43 (OWASP) → docs/44 (STRIDE) → docs/45 (Compliance) → docs/47 (Test Config)</li>'+
      '<li><strong>UX Strategy:</strong> Verify accessibility standards and persona fit in docs/57</li>'+
      '<li><strong>Regulatory Check:</strong> Domain-specific compliance in docs/59 (fintech/health/education, etc.)</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase E: Release</h4>'+
      '<ul><li>Update progress in docs/24_progress.md</li>'+
      '<li>Follow docs/09_release_checklist.md</li>'+
      '<li>CI/CD: Pre-configured in .github/workflows/ci.yml</li>'+
      '<li><strong>Monitoring Setup:</strong> Configure monitoring based on SLO targets in docs/53 → Set alert thresholds per 12 Ops Capabilities in docs/54</li>'+
      '<li><strong>Incident Preparedness:</strong> Review runbook in docs/34_incident_response.md and conduct initial drill</li></ul>'+
      '<h5>Deployment Platform Notes</h5>'+
      '<ul><li><strong>Vercel:</strong> vercel.json + Edge Functions + ISR → Enable Preview Deployments</li>'+
      '<li><strong>Railway:</strong> Dockerfile or Nixpack auto-detection → Set env vars via Dashboard</li>'+
      '<li><strong>AWS:</strong> Choose Amplify/ECS/Lambda → Integrate IAM + VPC + CloudWatch</li>'+
      '<li><strong>Cloudflare:</strong> Pages + Workers → D1/R2 integration + Wrangler CLI</li></ul>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Build</span><span class="hg-a">→</span><span class="hg-n hg-c">Test</span><span class="hg-a">→</span><span class="hg-n hg-p">Fix</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span><span class="hg-a">→</span><span class="hg-n">Monitor</span></div></div></div>'+
      '<h3>④ Advanced — Expert Techniques</h3>'+
      '<ul class="workflow-advanced"><li><strong>Template Chaining:</strong> Execute multiple templates sequentially in Launcher (→ See 📋 Prompt Manual)</li>'+
      '<li><strong>Multi-Agent Development:</strong> AGENTS.md + Claude Code Subagents</li>'+
      '<li><strong>Regeneration:</strong> After scope changes, regenerate (answers preserved)</li>'+
      '<li><strong>Team Onboarding:</strong> Use Roadmap (Pillar ⑦) for new members</li>'+
      '<li><strong>Growth Strategy:</strong> Leverage docs/41_growth_intelligence.md</li>'+
      '<li><strong>Goal Re-validation:</strong> Use docs/29-30 for pivot direction</li>'+
      '<li><strong>Future Strategy Reference:</strong> docs/56-59 for market positioning, UX strategy, ecosystem, regulatory</li></ul>'+
      '<h3>④-B Post-Release Operations & Iteration</h3>'+
      '<div class="workflow-iteration">'+
      '<h4>Sprint 2+ Iteration Workflow</h4>'+
      '<ul><li>Feedback collection (refer to docs/57 personas & journeys)</li>'+
      '<li>Reprioritize tasks (docs/30 priority matrix + docs/56 MOAT)</li>'+
      '<li>Refactoring decisions (Launcher 📊Metrics→♻️Refactor)</li>'+
      '<li>Loop: Feedback→Add tasks→Implement→QA→Release→Monitor</li></ul>'+
      '<h4>Operational Monitoring & SLO Tracking</h4>'+
      '<ul><li>Verify SLO/SLI actual values against docs/53</li>'+
      '<li>Apply Circuit Breaker patterns from docs/55</li>'+
      '<li>On SLO miss: docs/34 postmortem</li></ul>'+
      '<h4>Feature Flags Management</h4>'+
      '<ul><li>Feature Flags design from docs/53</li>'+
      '<li>Canary→Gradual→Full release</li></ul>'+
      '<h4>Market Positioning Re-evaluation</h4>'+
      '<ul><li>Quarterly MOAT & GTM review from docs/56</li>'+
      '<li>API strategy & ecosystem from docs/58</li>'+
      '<li>Regulatory change check (EU AI Act/ESG) from docs/59</li></ul></div>'+
      '<h3>⑤ Common Pitfalls & Solutions</h3>'+
      '<table class="workflow-pitfalls"><tr><th>Pitfall</th><th>Cause</th><th>Solution</th></tr>'+
      '<tr><td>Trying to run files directly</td><td>Misunderstanding DevForge output</td><td>Feed design docs to AI to generate code</td></tr>'+
      '<tr><td>Not backing up</td><td>Relying only on localStorage</td><td>ZIP + JSON export every time</td></tr>'+
      '<tr><td>Ignoring compatibility warnings</td><td>Skipping Dashboard check</td><td>Address ⚠️ warnings before dev</td></tr>'+
      '<tr><td>Feeding all files to AI at once</td><td>Context window overflow</td><td>Use Launcher folder selection for token mgmt</td></tr>'+
      '<tr><td>Not using tasks.md</td><td>Unstructured AI instructions</td><td>Implement in Issue# order</td></tr>'+
      '<tr><td>Skipping verification.md</td><td>No acceptance criteria</td><td>Check verification.md per feature</td></tr>'+
      '<tr><td>Changing skill level mid-project</td><td>Question option inconsistency</td><td>Set correctly at start</td></tr>'+
      '<tr><td>MCP not configured</td><td>Incomplete AI tool integration</td><td>Place mcp-config.json</td></tr>'+
      '<tr><td>Forgetting Git/env vars</td><td>Skipping initial setup</td><td>Always complete git init+.env config in ② Preparation</td></tr>'+
      '<tr><td>Not planning post-release ops</td><td>MVP-only focus</td><td>Review ops & iteration plan in ④-B</td></tr></table>'+
      '<h3>⑥ Summary — Quick Reference</h3>'+
      '<div class="workflow-summary"><h4>12-Item Checklist</h4>'+
      '<ol class="workflow-checklist"><li>✅ Audit results reviewed (no ❌ / ⚠️)</li><li>✅ ZIP + JSON backup done</li>'+
      '<li>✅ DevContainer running or manual env setup complete</li><li>✅ AI tool recognizes rule files</li>'+
      '<li>✅ Read constitution.md → specification.md</li><li>✅ Opened tasks.md and identified tasks</li>'+
      '<li>✅ Started implementing from Issue #1</li><li>✅ Checked acceptance criteria in verification.md</li>'+
      '<li>✅ Ran tests & security audit</li><li>✅ Final check with release checklist</li>'+
      '<li>✅ .env configured & excluded from git</li><li>✅ Monitoring & SLO setup complete</li></ol>'+
      '<h4>Overall Flow Diagram</h4>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Backup</span><span class="hg-a">→</span><span class="hg-n hg-p">Setup Env</span><span class="hg-a">→</span><span class="hg-n">Understand<br>Specs</span><span class="hg-a">→</span><span class="hg-n">AI Dev</span><span class="hg-a">→</span><span class="hg-n">QA</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span><span class="hg-a">→</span><span class="hg-n">Iterate</span></div>'+
      '<p class="workflow-footer"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 Show Level Guide</button></p></div>'
    },
    {id:'launcher-guide',title:_ja?'📋 プロンプトマニュアル':'📋 Prompt Manual',body:_ja?
      '<h2>🤖 AIプロンプトランチャー 使い方マニュアル</h2>'+
      '<h3>🔧 仕組み (How It Works)</h3>'+
      '<div class="hg-flow"><span class="hg-n hg-b">📂<br>フォルダ選択</span><span class="hg-a">→</span><span class="hg-n hg-c">📋<br>テンプレート選択</span><span class="hg-a">→</span><span class="hg-n hg-p">⚙️<br>プロンプト自動合成</span><span class="hg-a">→</span><span class="hg-n hg-g">📋<br>コピー→AI投入</span></div>'+
      '<p><strong>5パート自動合成:</strong></p>'+
      '<table><tr><th>パート</th><th>内容</th></tr>'+
      '<tr><td>① System</td><td>AIの役割定義（テックリード、QAエンジニア、セキュリティ専門家 等）</td></tr>'+
      '<tr><td>② Context</td><td>プロジェクト情報（スタック構成、認証方式、エンティティ）</td></tr>'+
      '<tr><td>③ Task</td><td>具体的な指示（レビュー手順、実装ステップ、テスト戦略）</td></tr>'+
      '<tr><td>④ Format</td><td>出力形式（Markdown表、コードブロック、Mermaid図）</td></tr>'+
      '<tr><td>⑤ Files</td><td>選択したフォルダの全ファイル内容</td></tr></table>'+
      '<h3>📊 開発ライフサイクルフロー</h3>'+
      '<table><tr><th>フェーズ</th><th>テンプレート</th></tr>'+
      '<tr><td><strong>設計</strong></td><td>🔍仕様レビュー / 📐アーキテクチャ / 🎯ゴール逆算</td></tr>'+
      '<tr><td><strong>開発</strong></td><td>🚀MVP実装 / 🔌API統合 / 🌍i18n</td></tr>'+
      '<tr><td><strong>QA</strong></td><td>🧪テスト / 🐛QA / 🔒セキュリティ / ♿a11y / ⚡パフォーマンス / 📊メトリクス</td></tr>'+
      '<tr><td><strong>運用</strong></td><td>♻️リファクタ / 🔧デバッグ / 🚨インシデント / 🛡️Ops準備 / 📝ドキュメント / 🔄マイグレーション / ⚙️CI/CD</td></tr>'+
      '<tr><td><strong>ビジネス</strong></td><td>📈グロース / 🏢戦略</td></tr>'+
      '<tr><td><strong>ガバナンス</strong></td><td>⚖️リスク・コンプライアンス</td></tr>'+
      '<tr><td><strong>チーム</strong></td><td>🎓オンボーディング</td></tr>'+
      '<tr><td><strong>AI知性</strong></td><td>🧬最適手法 / 💡ブレスト / 🏭業界 / 🔮UX / 🧠認知負荷</td></tr>'+
      '<tr><td><strong>プロンプトEng</strong></td><td>🧩ゲノム / 📊成熟度 / 🔄ReAct / 🔧Prompt Ops</td></tr>'+
      '<tr><td><strong>エンタープライズ</strong></td><td>🏢エンタープライズアーキテクチャ / 📋ワークフロー監査</td></tr></table>'+
      '<h3>🌱🔥⚡ スキルレベル別ベストプラクティス</h3>'+
      '<p><strong>🌱 Beginner — まず動かす</strong></p>'+
      '<ul><li>🔍仕様レビュー + 🚀MVP実装 の2つから始める</li>'+
      '<li><code>.spec/</code> フォルダだけを選択してトークン節約</li>'+
      '<li>生成されたプロンプトをそのままコピペでOK</li></ul>'+
      '<p><strong>🔥 Intermediate — チェーン活用</strong></p>'+
      '<ul><li>レビュー → 実装 → テスト → リファクタ の順にチェーン実行</li>'+
      '<li><code>.spec/</code> + <code>docs/</code> を含めて包括的なコンテキストを提供</li>'+
      '<li>モデル適合度を確認し、80%以内に収める</li></ul>'+
      '<p><strong>⚡ Professional — パイプライン化</strong></p>'+
      '<ul><li>全50テンプレートをパイプラインとして順次実行</li>'+
      '<li>フォルダ選択を最適化（デバッグ時は<code>docs/25</code>+<code>docs/37</code>のみ等）</li>'+
      '<li><code>docs/39_implementation_playbook.md</code> と <code>docs/40_ai_dev_runbook.md</code> も活用</li></ul>'+
      '<h3>📋 全50テンプレート早見表</h3>'+
      '<table><tr><th>Icon</th><th>名前</th><th>フェーズ</th><th>主要参照ドキュメント</th></tr>'+
      '<tr><td>🔍</td><td>仕様レビュー</td><td>設計</td><td>.spec/*</td></tr>'+
      '<tr><td>📐</td><td>アーキテクチャ</td><td>設計</td><td>docs/03, docs/27, docs/26</td></tr>'+
      '<tr><td>🎯</td><td>ゴール逆算</td><td>設計</td><td>docs/29, docs/30</td></tr>'+
      '<tr><td>🚀</td><td>MVP実装</td><td>開発</td><td>docs/23, docs/39, docs/40, docs/31</td></tr>'+
      '<tr><td>🔌</td><td>API統合</td><td>開発</td><td>docs/05, docs/04, docs/08</td></tr>'+
      '<tr><td>🌍</td><td>i18n</td><td>開発</td><td>(コード分析)</td></tr>'+
      '<tr><td>🧪</td><td>テスト生成</td><td>QA</td><td>docs/07, docs/33, docs/36</td></tr>'+
      '<tr><td>🐛</td><td>QA・バグ検出</td><td>QA</td><td>docs/28, docs/32, docs/33</td></tr>'+
      '<tr><td>🔒</td><td>セキュリティ</td><td>QA</td><td>docs/08, docs/43-47, docs/53</td></tr>'+
      '<tr><td>♿</td><td>a11y監査</td><td>QA</td><td>docs/26, docs/06</td></tr>'+
      '<tr><td>⚡</td><td>パフォーマンス</td><td>QA</td><td>docs/19, docs/17, docs/41</td></tr>'+
      '<tr><td>📊</td><td>メトリクス</td><td>QA</td><td>(コード分析)</td></tr>'+
      '<tr><td>♻️</td><td>リファクタ</td><td>運用</td><td>.spec/*</td></tr>'+
      '<tr><td>🔧</td><td>デバッグ</td><td>運用</td><td>docs/25, docs/37, docs/34</td></tr>'+
      '<tr><td>🚨</td><td>インシデント</td><td>運用</td><td>docs/34, docs/25, docs/53, docs/55</td></tr>'+
      '<tr><td>🛡️</td><td>Ops準備</td><td>運用</td><td>docs/53, docs/54, docs/55, docs/17</td></tr>'+
      '<tr><td>📝</td><td>ドキュメント</td><td>運用</td><td>(全体)</td></tr>'+
      '<tr><td>🔄</td><td>マイグレーション</td><td>運用</td><td>docs/04</td></tr>'+
      '<tr><td>⚙️</td><td>CI/CD</td><td>運用</td><td>docs/09, docs/36, docs/53, docs/54</td></tr>'+
      '<tr><td>📈</td><td>グロース</td><td>ビジネス</td><td>docs/41, docs/48, docs/50</td></tr>'+
      '<tr><td>🏢</td><td>戦略</td><td>ビジネス</td><td>docs/48-52, docs/41</td></tr>'+
      '<tr><td>⚖️</td><td>リスク・コンプライアンス</td><td>ガバナンス</td><td>docs/14, docs/44, docs/45, docs/53</td></tr>'+
      '<tr><td>🧬</td><td>最適手法選定</td><td>AI知性</td><td>docs/60</td></tr>'+
      '<tr><td>🎭</td><td>9人の専門家ブレスト</td><td>AI知性</td><td>docs/61, docs/03</td></tr>'+
      '<tr><td>🎯</td><td>UXジャーニー設計</td><td>AI知性</td><td>docs/06, docs/57</td></tr>'+
      '<tr><td>🔬</td><td>UX習熟度監査</td><td>AI知性</td><td>docs/81, docs/06</td></tr>'+
      '<tr><td>🤖</td><td>AIモデル使い分け</td><td>AI知性</td><td>docs/60, docs/61</td></tr>'+
      '<tr><td>🏭</td><td>業界特化分析</td><td>AI知性</td><td>docs/62, docs/45</td></tr>'+
      '<tr><td>🔮</td><td>次世代UX</td><td>AI知性</td><td>docs/63</td></tr>'+
      '<tr><td>🧠</td><td>認知負荷分析</td><td>AI知性</td><td>docs/60, docs/26</td></tr>'+
      '<tr><td>🧩</td><td>ゲノム分析</td><td>プロンプトEng</td><td>docs/65, docs/67</td></tr>'+
      '<tr><td>📊</td><td>AI成熟度</td><td>プロンプトEng</td><td>docs/66, docs/68</td></tr>'+
      '<tr><td>🔄</td><td>ReActデバッグ</td><td>プロンプトEng</td><td>docs/70</td></tr>'+
      '<tr><td>🔧</td><td>Prompt Ops</td><td>プロンプトEng</td><td>docs/69, docs/71, docs/72, docs/65</td></tr>'+
      '<tr><td>🏢</td><td>エンタープライズアーキテクチャ</td><td>エンタープライズ</td><td>docs/73, docs/74</td></tr>'+
      '<tr><td>📋</td><td>ワークフロー監査</td><td>エンタープライズ</td><td>docs/74, docs/75, docs/76</td></tr>'+
      '<tr><td>🎓</td><td>オンボーディング</td><td>チーム</td><td>docs/42, docs/37, .claude/rules/, docs/55</td></tr></table>'+
      '<h3>💡 Tips</h3>'+
      '<p><strong>フォルダ選択のコツ:</strong> 不要なフォルダのチェックを外してトークン節約。例: デバッグ時は<code>docs/</code>の大半は不要。</p>'+
      '<p><strong>モデル適合度の見方:</strong> 80%以下が理想。超過する場合はフォルダを絞る。</p>'+
      '<p><strong>テンプレートのチェーン例:</strong></p>'+
      '<ul><li>新機能追加: 🔍レビュー → 🚀実装 → 🧪テスト → 📝ドキュメント</li>'+
      '<li>バグ修正: 🔧デバッグ → ♻️リファクタ → 🧪テスト → 🚨インシデント対応</li>'+
      '<li>パフォーマンス改善: ⚡パフォーマンス → 📊メトリクス → ♻️リファクタ → 🧪テスト</li>'+
      '<li>本番リリース準備: 🔒セキュリティ → 🛡️Ops準備 → ⚙️CI/CD → 🎓オンボーディング</li>'+
      '<li>事業戦略レビュー: 🏢戦略 → 📈グロース → ⚖️リスク → 🎯ゴール逆算</li>'+
      '<li>AI成熟度向上: 🧩ゲノム分析 → 📊AI成熟度 → 🔧Prompt Ops → 🧬最適手法</li>'+
      '<li>自律デバッグ: 🔄ReActデバッグ → 🔧デバッグ → 🧪テスト → ♻️リファクタ</li></ul>':
      '<h2>🤖 AI Prompt Launcher User Manual</h2>'+
      '<h3>🔧 How It Works</h3>'+
      '<div class="hg-flow"><span class="hg-n hg-b">📂<br>Select Folders</span><span class="hg-a">→</span><span class="hg-n hg-c">📋<br>Pick Template</span><span class="hg-a">→</span><span class="hg-n hg-p">⚙️<br>Auto-compose</span><span class="hg-a">→</span><span class="hg-n hg-g">📋<br>Copy→Feed AI</span></div>'+
      '<p><strong>5-Part Auto-Composition:</strong></p>'+
      '<table><tr><th>Part</th><th>Content</th></tr>'+
      '<tr><td>① System</td><td>AI role definition (Tech Lead, QA Engineer, Security Expert, etc.)</td></tr>'+
      '<tr><td>② Context</td><td>Project info (stack, auth, entities)</td></tr>'+
      '<tr><td>③ Task</td><td>Specific instructions (review steps, implementation flow, test strategy)</td></tr>'+
      '<tr><td>④ Format</td><td>Output format (Markdown table, code blocks, Mermaid diagrams)</td></tr>'+
      '<tr><td>⑤ Files</td><td>All file contents from selected folders</td></tr></table>'+
      '<h3>📊 Development Lifecycle Flow</h3>'+
      '<table><tr><th>Phase</th><th>Templates</th></tr>'+
      '<tr><td><strong>Design</strong></td><td>🔍Spec Review / 📐Architecture / 🎯Goal Reverse</td></tr>'+
      '<tr><td><strong>Development</strong></td><td>🚀MVP Build / 🔌API Integration / 🌍i18n</td></tr>'+
      '<tr><td><strong>QA</strong></td><td>🧪Test Gen / 🐛QA / 🔒Security / ♿a11y / ⚡Performance / 📊Metrics</td></tr>'+
      '<tr><td><strong>Operations</strong></td><td>♻️Refactor / 🔧Debug / 🚨Incident / 🛡️Ops Readiness / 📝Docs / 🔄Migration / ⚙️CI/CD</td></tr>'+
      '<tr><td><strong>Business</strong></td><td>📈Growth / 🏢Strategy</td></tr>'+
      '<tr><td><strong>Governance</strong></td><td>⚖️Risk & Compliance</td></tr>'+
      '<tr><td><strong>Team</strong></td><td>🎓Onboarding</td></tr>'+
      '<tr><td><strong>AI Intelligence</strong></td><td>🧬Methodology / 💡Brainstorm / 🏭Industry / 🔮Next-Gen UX / 🧠Cognitive</td></tr>'+
      '<tr><td><strong>Prompt Eng</strong></td><td>🧩Genome / 📊Maturity / 🔄ReAct Debug / 🔧Prompt Ops</td></tr>'+
      '<tr><td><strong>Enterprise</strong></td><td>🏢Enterprise Architecture / 📋Workflow Process Audit</td></tr></table>'+
      '<h3>🌱🔥⚡ Best Practices by Skill Level</h3>'+
      '<p><strong>🌱 Beginner — Get Started</strong></p>'+
      '<ul><li>Start with 🔍Spec Review + 🚀MVP Build</li>'+
      '<li>Select only <code>.spec/</code> folder to save tokens</li>'+
      '<li>Copy-paste generated prompts as-is</li></ul>'+
      '<p><strong>🔥 Intermediate — Chain Execution</strong></p>'+
      '<ul><li>Execute in sequence: Review → Implement → Test → Refactor</li>'+
      '<li>Include <code>.spec/</code> + <code>docs/</code> for comprehensive context</li>'+
      '<li>Keep model fit under 80%</li></ul>'+
      '<p><strong>⚡ Professional — Full Pipeline</strong></p>'+
      '<ul><li>Execute all 50 templates as a pipeline</li>'+
      '<li>Optimize folder selection (e.g., for debugging: only <code>docs/25</code>+<code>docs/37</code>)</li>'+
      '<li>Leverage <code>docs/39_implementation_playbook.md</code> and <code>docs/40_ai_dev_runbook.md</code></li></ul>'+
      '<h3>📋 All 40 Templates Quick Reference</h3>'+
      '<table><tr><th>Icon</th><th>Name</th><th>Phase</th><th>Key Docs</th></tr>'+
      '<tr><td>🔍</td><td>Spec Review</td><td>Design</td><td>.spec/*</td></tr>'+
      '<tr><td>📐</td><td>Architecture</td><td>Design</td><td>docs/03, docs/27, docs/26</td></tr>'+
      '<tr><td>🎯</td><td>Goal Reverse</td><td>Design</td><td>docs/29, docs/30</td></tr>'+
      '<tr><td>🚀</td><td>MVP Build</td><td>Dev</td><td>docs/23, docs/39, docs/40, docs/31</td></tr>'+
      '<tr><td>🔌</td><td>API Integration</td><td>Dev</td><td>docs/05, docs/04, docs/08</td></tr>'+
      '<tr><td>🌍</td><td>i18n</td><td>Dev</td><td>(code analysis)</td></tr>'+
      '<tr><td>🧪</td><td>Test Generation</td><td>QA</td><td>docs/07, docs/33, docs/36</td></tr>'+
      '<tr><td>🐛</td><td>QA & Bug Detection</td><td>QA</td><td>docs/28, docs/32, docs/33</td></tr>'+
      '<tr><td>🔒</td><td>Security</td><td>QA</td><td>docs/08, docs/43-47, docs/53</td></tr>'+
      '<tr><td>♿</td><td>a11y Audit</td><td>QA</td><td>docs/26, docs/06</td></tr>'+
      '<tr><td>⚡</td><td>Performance</td><td>QA</td><td>docs/19, docs/17, docs/41</td></tr>'+
      '<tr><td>📊</td><td>Metrics</td><td>QA</td><td>(code analysis)</td></tr>'+
      '<tr><td>♻️</td><td>Refactor</td><td>Ops</td><td>.spec/*</td></tr>'+
      '<tr><td>🔧</td><td>Debug</td><td>Ops</td><td>docs/25, docs/37, docs/34</td></tr>'+
      '<tr><td>🚨</td><td>Incident</td><td>Ops</td><td>docs/34, docs/25, docs/53, docs/55</td></tr>'+
      '<tr><td>🛡️</td><td>Ops Readiness</td><td>Ops</td><td>docs/53, docs/54, docs/55, docs/17</td></tr>'+
      '<tr><td>📝</td><td>Documentation</td><td>Ops</td><td>(all)</td></tr>'+
      '<tr><td>🔄</td><td>Migration</td><td>Ops</td><td>docs/04</td></tr>'+
      '<tr><td>⚙️</td><td>CI/CD</td><td>Ops</td><td>docs/09, docs/36, docs/53, docs/54</td></tr>'+
      '<tr><td>📈</td><td>Growth</td><td>Business</td><td>docs/41, docs/48, docs/50</td></tr>'+
      '<tr><td>🏢</td><td>Strategy</td><td>Business</td><td>docs/48-52, docs/41</td></tr>'+
      '<tr><td>⚖️</td><td>Risk & Compliance</td><td>Governance</td><td>docs/14, docs/44, docs/45, docs/53</td></tr>'+
      '<tr><td>🧬</td><td>Optimal Methodology</td><td>AI Intelligence</td><td>docs/60</td></tr>'+
      '<tr><td>🎭</td><td>9-Expert Brainstorm</td><td>AI Intelligence</td><td>docs/61, docs/03</td></tr>'+
      '<tr><td>🎯</td><td>UX Journey Design</td><td>AI Intelligence</td><td>docs/06, docs/57</td></tr>'+
      '<tr><td>🔬</td><td>UX Proficiency Audit</td><td>AI Intelligence</td><td>docs/81, docs/06</td></tr>'+
      '<tr><td>🤖</td><td>AI Model Selection</td><td>AI Intelligence</td><td>docs/60, docs/61</td></tr>'+
      '<tr><td>🏭</td><td>Industry Deep Dive</td><td>AI Intelligence</td><td>docs/62, docs/45</td></tr>'+
      '<tr><td>🔮</td><td>Next-Gen UX</td><td>AI Intelligence</td><td>docs/63</td></tr>'+
      '<tr><td>🧠</td><td>Cognitive Load</td><td>AI Intelligence</td><td>docs/60, docs/26</td></tr>'+
      '<tr><td>🧩</td><td>Prompt Genome</td><td>Prompt Eng</td><td>docs/65, docs/67</td></tr>'+
      '<tr><td>📊</td><td>AI Maturity</td><td>Prompt Eng</td><td>docs/66, docs/68</td></tr>'+
      '<tr><td>🔄</td><td>ReAct Debug</td><td>Prompt Eng</td><td>docs/70</td></tr>'+
      '<tr><td>🔧</td><td>Prompt Ops</td><td>Prompt Eng</td><td>docs/69, docs/71, docs/72, docs/65</td></tr>'+
      '<tr><td>🏢</td><td>Enterprise Architecture</td><td>Enterprise</td><td>docs/73, docs/74</td></tr>'+
      '<tr><td>📋</td><td>Workflow Process Audit</td><td>Enterprise</td><td>docs/74, docs/75, docs/76</td></tr>'+
      '<tr><td>🎓</td><td>Onboarding</td><td>Team</td><td>docs/42, docs/37, .claude/rules/, docs/55</td></tr></table>'+
      '<h3>💡 Tips</h3>'+
      '<p><strong>Folder Selection:</strong> Uncheck unnecessary folders to save tokens. Example: for debugging, most of <code>docs/</code> is unnecessary.</p>'+
      '<p><strong>Model Fit Indicator:</strong> 80% or below is ideal. If exceeded, reduce folder selection.</p>'+
      '<p><strong>Template Chaining Examples:</strong></p>'+
      '<ul><li>New feature: 🔍Review → 🚀Implement → 🧪Test → 📝Docs</li>'+
      '<li>Bug fix: 🔧Debug → ♻️Refactor → 🧪Test → 🚨Incident</li>'+
      '<li>Performance: ⚡Performance → 📊Metrics → ♻️Refactor → 🧪Test</li>'+
      '<li>Production release prep: 🔒Security → 🛡️Ops Readiness → ⚙️CI/CD → 🎓Onboarding</li>'+
      '<li>Business strategy review: 🏢Strategy → 📈Growth → ⚖️Risk → 🎯Goal Reverse</li>'+
      '<li>AI maturity upgrade: 🧩Genome → 📊Maturity → 🔧Prompt Ops → 🧬Methodology</li>'+
      '<li>Autonomous debugging: 🔄ReAct Debug → 🔧Debug → 🧪Test → ♻️Refactor</li></ul>'
    },
    {id:'techdb',title:_ja?'技術DB':'Tech DB',body:_ja?
      '<h2>技術マスターテーブル</h2><p>'+_TECH_COUNT+'テクノロジーを15カテゴリに分類。Context Dashboardから閲覧可能。</p><h3>カテゴリ一覧</h3><p>言語 / フロントエンド / モバイル / バックエンド / BaaS / 決済・CMS・EC / DevOps / AIツール / AI自律 / 手法 / テスト / API / ビルド / データ / セキュリティ</p><h3>フィルタ機能</h3><p>カテゴリ / 必須度 / キーワード検索で絞り込み可能。</p>'
      :
      '<h2>Tech Master Table</h2><p>'+_TECH_COUNT+' technologies classified into 15 categories. Browse from Context Dashboard.</p><h3>Categories</h3><p>Languages / Frontend / Mobile / Backend / BaaS / Payment・CMS・EC / DevOps / AI Tools / AI Autonomous / Methodologies / Testing / API / Build / Data / Security</p><h3>Filter</h3><p>Filter by category, requirement level, or keyword search.</p>'
    },
    {id:'keys',title:_ja?'ショートカット':'Shortcuts',body:_ja?
      '<h2>キーボードショートカット</h2><table><tr><td><code>F1</code> / <code>Ctrl+H</code></td><td>ヘルプ表示</td></tr><tr><td><code>Ctrl+K</code></td><td>ショートカット一覧</td></tr><tr><td><code>Ctrl+T</code></td><td>テーマ切替</td></tr><tr><td><code>Ctrl+L</code></td><td>言語切替</td></tr><tr><td><code>Ctrl+E</code></td><td>エクスポート</td></tr><tr><td><code>Ctrl+Shift+C</code></td><td>全ファイルコピー</td></tr><tr><td><code>Ctrl+M</code></td><td>プロジェクト管理</td></tr><tr><td><code>Escape</code></td><td>モーダルを閉じる</td></tr></table>'
      :
      '<h2>Keyboard Shortcuts</h2><table><tr><td><code>F1</code> / <code>Ctrl+H</code></td><td>Open help</td></tr><tr><td><code>Ctrl+K</code></td><td>Shortcut list</td></tr><tr><td><code>Ctrl+T</code></td><td>Toggle theme</td></tr><tr><td><code>Ctrl+L</code></td><td>Toggle language</td></tr><tr><td><code>Ctrl+E</code></td><td>Export</td></tr><tr><td><code>Ctrl+Shift+C</code></td><td>Copy all files</td></tr><tr><td><code>Ctrl+M</code></td><td>Project manager</td></tr><tr><td><code>Escape</code></td><td>Close modal</td></tr></table>'
    },
    {id:'caution',title:_ja?'⚠️ 注意事項':'⚠️ Cautions',body:_ja?
      '<h2>使用上の注意・留意点</h2>'+
      '<h3>🔴 データ保存について</h3>'+
      '<p>全データはブラウザの<strong>localStorage</strong>に保存されます。以下の操作で<strong>全データが消失</strong>します:</p>'+
      '<p>・ブラウザの「閲覧履歴を消去」→「Cookieとサイトデータ」を削除<br>・シークレット/プライベートモードでの使用<br>・ブラウザや端末の変更</p>'+
      '<p>→ 対策: 作業後は必ず<strong>📤 JSONエクスポート</strong>と<strong>📦 ZIPダウンロード</strong>で保存してください。</p>'+
      '<h3>🔴 ストレージ上限</h3>'+
      '<p>localStorageの上限は約5MBです。20〜30プロジェクトで上限に達する可能性があります。古いプロジェクトはエクスポート後に削除してください。</p>'+
      '<h3>🟡 生成ファイルについて</h3>'+
      '<p>生成される185+ファイルは<strong>設計ドキュメント</strong>（SDD仕様書・DevContainer設定・AIルール等）です。npm installで即座に動くアプリケーションコードではありません。Claude Code / Cursor等のAIツールに入力して実コードを生成する運用が前提です。</p>'+
      '<p class="workflow-ref">📘 <strong>詳しい手順は <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">生成後ワークフローガイド</a> を参照</strong></p>'+
      '<h3>🟡 スキルレベル</h3>'+
      '<p>スキルレベルにより表示される選択肢が変わります。途中変更すると既回答との不整合が起きうるため、<strong>最初に正しく設定</strong>してください。</p>'+
      '<h3>🟡 言語切り替え</h3>'+
      '<p>UIの日英切り替えは即座に反映されますが、<strong>生成済みファイルの内容は切り替わりません</strong>。英語ドキュメントが必要な場合は生成時の言語選択で明示的に選んでください。</p>'+
      '<h3>🔵 その他</h3>'+
      '<p>・ZIPエクスポートはCDN経由のJSZipに依存します（オフライン時は「全ファイルコピー」Ctrl+Shift+Cで代替）<br>・PDF出力時はライトモード推奨（ダーク背景がそのまま印刷されます）<br>・URL共有は回答が多いとURLが長くなりSNS等で切れる場合があります</p>'
      :
      '<h2>Usage Cautions & Notes</h2>'+
      '<h3>🔴 Data Storage</h3>'+
      '<p>All data is stored in <strong>localStorage</strong>. Data will be <strong>lost</strong> if you:</p>'+
      '<p>・Clear browser data (cookies & site data)<br>・Use incognito/private mode<br>・Switch browsers or devices</p>'+
      '<p>→ Always <strong>📤 Export JSON</strong> and <strong>📦 Download ZIP</strong> after work.</p>'+
      '<h3>🔴 Storage Limit</h3>'+
      '<p>localStorage limit is ~5MB. You may reach the limit with 20-30 projects. Export and delete old projects.</p>'+
      '<h3>🟡 Generated Files</h3>'+
      '<p>185+ generated files are <strong>design documents</strong> (SDD specs, DevContainer configs, AI rules). They are not runnable app code. Feed them to AI tools like Claude Code / Cursor to generate actual code.</p>'+
      '<p class="workflow-ref">📘 <strong>For detailed workflow, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'+
      '<h3>🟡 Skill Level</h3>'+
      '<p>Changing skill level mid-project may cause inconsistencies with existing answers. <strong>Set it correctly at the start.</strong></p>'+
      '<h3>🟡 Language Switch</h3>'+
      '<p>UI language switches instantly, but <strong>generated file contents do not change</strong>. Choose the language explicitly during generation.</p>'+
      '<h3>🔵 Other</h3>'+
      '<p>・ZIP export requires JSZip via CDN (use "Copy All" Ctrl+Shift+C offline)<br>・Switch to light mode before PDF export<br>・URL sharing may truncate on SNS for complex projects</p>'
    },
    {id:'about',title:'About',body:'<h2>DevForge v9.6</h2><p>'+(_ja?'AI駆動開発 統合プラットフォーム':'AI-Driven Dev Platform')+'</p><p>Version 9.6.0 — 2026 Edition (Modular Architecture)</p><p>'+(_ja?''+_TECH_COUNT+'テクノロジー ・ 189+ファイル ・ 27の柱 ・ 143プリセット ・ Mermaid図 ・ プロンプトプレイブック':''+_TECH_COUNT+' technologies ・ 189+ files ・ 27 pillars ・ 143 presets ・ Mermaid diagrams ・ Prompt playbook')+'</p><p>© 2026 エンジニアリングのタネ制作委員会<br>by にしあん</p>'},
  ];
  const nav=$('helpNav');
  // Keep search input, clear nav links after it
  const searchEl=$('helpSearch');
  while(nav.lastChild&&nav.lastChild!==searchEl)nav.removeChild(nav.lastChild);
  if(searchEl)searchEl.value='';
  window._manual=MANUAL;
  MANUAL.forEach(s=>{
    const a=document.createElement('a');a.textContent=s.title;a.href='#';a.dataset.id=s.id;
    a.onclick=e=>{e.preventDefault();$('helpBody').innerHTML=typeof s.body==='function'?s.body():s.body;document.querySelectorAll('.help-nav a').forEach(x=>x.classList.remove('on'));a.classList.add('on');};
    if(s.id===(sec||'overview'))a.classList.add('on');
    nav.appendChild(a);
  });
  // Tour restart button (P3: persistent re-discovery)
  const tourBtn=document.createElement('button');tourBtn.className='help-tour-btn';
  tourBtn.textContent=_ja?'🔄 ツアーを再開':'🔄 Restart Tour';
  tourBtn.onclick=()=>{closeManual();if(typeof startTour==='function')startTour();};
  nav.appendChild(tourBtn);
  const initSec=MANUAL.find(s=>s.id===(sec||'overview'));
  $('helpBody').innerHTML=typeof initSec.body==='function'?initSec.body():initSec.body;
  trapFocus(o);
}
function filterManual(q){
  if(!window._manual)return;
  const links=document.querySelectorAll('#helpNav a');
  const term=q.toLowerCase().trim();
  if(!term){
    links.forEach(a=>a.classList.remove('dim'));
    const active=document.querySelector('#helpNav a.on');
    if(active){const s=window._manual.find(m=>m.id===active.dataset.id);if(s)$('helpBody').innerHTML=typeof s.body==='function'?s.body():s.body;}
    return;
  }
  let firstMatch=null;
  links.forEach(a=>{
    const s=window._manual.find(m=>m.id===a.dataset.id);
    if(!s)return;
    const bodyText=typeof s.body==='function'?s.body():s.body;
    const text=(s.title+' '+bodyText.replace(/<[^>]*>/g,'')).toLowerCase();
    const match=text.includes(term);
    a.classList.toggle('dim',!match);
    if(match&&!firstMatch)firstMatch=s;
  });
  if(firstMatch){
    const re=new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    const bodyText=typeof firstMatch.body==='function'?firstMatch.body():firstMatch.body;
    const highlighted=bodyText.replace(/>([^<]+)</g,(m,txt)=>'>'+txt.replace(re,'<mark>$1</mark>')+'<');
    $('helpBody').innerHTML=highlighted;
    links.forEach(a=>{a.classList.remove('on');if(a.dataset.id===firstMatch.id)a.classList.add('on');});
  }
}
function closeManual(){const o=$('helpOverlay');o.classList.remove('show');releaseFocus(o);removeModal(o);}
function showKB(){const el=$('kbOverlay');el.classList.add('show');trapFocus(el);pushModal(el,()=>{el.classList.remove('show');releaseFocus(el);});}
function closeKB(){const el=$('kbOverlay');el.classList.remove('show');releaseFocus(el);removeModal(el);}

function mobSw(t){
  const tabs=document.querySelectorAll('.mobtab');
  tabs.forEach(m=>{m.classList.remove('on');m.setAttribute('aria-selected','false');});
  if(t==='c'){$('panC').classList.remove('hide');$('panP').classList.remove('show');tabs[0].classList.add('on');tabs[0].setAttribute('aria-selected','true');}
  else{$('panC').classList.add('hide');$('panP').classList.add('show');tabs[1].classList.add('on');tabs[1].setAttribute('aria-selected','true');}
}

