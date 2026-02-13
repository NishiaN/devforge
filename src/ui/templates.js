function saveTemplate(){
  const _ja=S.lang==='ja';
  const templates=JSON.parse(_lsGet('devforge-templates')||'[]');
  const tpl={name:S.projectName,answers:{...S.answers},preset:S.preset,date:new Date().toISOString()};
  templates.push(tpl);
  _lsSet('devforge-templates',JSON.stringify(templates));
  addMsg('bot',_ja?`💾 テンプレート「${S.projectName}」を保存しました。次回起動時に読み込めます。`:`💾 Template "${S.projectName}" saved. Load it next time.`);
}

function loadTemplateList(){
  const templates=JSON.parse(_lsGet('devforge-templates')||'[]');
  if(templates.length===0)return;
  const row=$('presetRow');
  templates.forEach((tpl,i)=>{
    const c=document.createElement('div');c.className='prchip';
    c.textContent='💾 '+tpl.name;
    c.onclick=()=>{
      S.preset='custom';S.answers={...tpl.answers};
      $('nameIn').value=tpl.name;
      document.querySelectorAll('.prchip').forEach(x=>x.classList.remove('on'));c.classList.add('on');
    };
    row.appendChild(c);
  });
}

/* ── URL State Sharing ── */
function shareURL(){
  const _ja=S.lang==='ja';
  const data={p:S.projectName,a:S.answers,pr:S.preset};
  const encoded=btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  const url=location.origin+location.pathname+'#df='+encoded;
  navigator.clipboard.writeText(url).then(()=>{
    addMsg('bot',_ja?`🔗 URLをクリップボードにコピーしました。このURLを共有すると同じ設定で開けます。`:`🔗 URL copied to clipboard. Share it to open with the same settings.`);
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
    {id:'overview',title:_ja?'概要':'Overview',body:_ja?'<h2>DevForge v9.0 とは</h2><p>質問に答えるだけで、プロジェクトに必要な88+ファイルを自動生成するAI駆動開発プラットフォームです。'+_TECH_COUNT+'テクノロジー対応。</p>'+
      '<h3>12の柱</h3><table><tr><th>柱</th><th>内容</th><th>ファイル数</th></tr><tr><td>①SDD統合</td><td>Spec Kit互換の仕様書</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker開発環境</td><td>4</td></tr><tr><td>③MCP設定</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AIルール</td><td>10+ツール設定+スキル</td><td>10+</td></tr>'+
      '<tr><td>⑤並列探索</td><td>スタック比較+おすすめランキング</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>コンテキスト可視化+技術DB</td><td>UI</td></tr><tr><td>⑦ロードマップ</td><td>学習パス（インタラクティブ）</td><td>9+UI</td></tr><tr><td>⑧AIランチャー</td><td>プロンプトテンプレート+トークン推定</td><td>UI</td></tr><tr><td>⑨デザインシステム</td><td>デザイントークン+シーケンス図</td><td>2</td></tr><tr><td>⑩リバースEng</td><td>ゴール逆算型プランニング</td><td>2</td></tr><tr><td>⑪実装ガイド</td><td>業種別実装パターン+AI運用手順</td><td>3</td></tr><tr><td>⑫セキュリティ</td><td>OWASP・STRIDE・コンプライアンス</td><td>5</td></tr></table>'+
      '<p>+ docs（40仕様書）+ 共通ファイル（4）= <strong>88+ファイル</strong></p>':'<h2>What is DevForge v9.0?</h2><p>An AI-driven dev platform that auto-generates 88+ project files just by answering questions. Supports '+_TECH_COUNT+' technologies.</p>'+
      '<h3>12 Pillars</h3><table><tr><th>Pillar</th><th>Content</th><th>Files</th></tr><tr><td>①SDD</td><td>Spec Kit compatible specs</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker dev environment</td><td>4</td></tr><tr><td>③MCP</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AI Rules</td><td>10+ tool configs + skills</td><td>10+</td></tr>'+
      ''+
      '<tr><td>⑤Explorer</td><td>Stack comparison + recommendation</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>Context visualization + Tech DB</td><td>UI</td></tr><tr><td>⑦Roadmap</td><td>Learning path (interactive)</td><td>9+UI</td></tr><tr><td>⑧AI Launcher</td><td>Prompt templates + token estimation</td><td>UI</td></tr><tr><td>⑨Design System</td><td>Design tokens + Sequence diagrams</td><td>2</td></tr><tr><td>⑩Reverse Eng</td><td>Goal-driven reverse planning</td><td>2</td></tr><tr><td>⑪Impl Guide</td><td>Domain-specific impl patterns + AI runbook</td><td>3</td></tr><tr><td>⑫Security</td><td>OWASP, STRIDE, Compliance</td><td>5</td></tr></table>'+
      '<p>+ docs (40 specs) + common (4) = <strong>88+ files</strong></p>'},
    {id:'start',title:_ja?'はじめ方':'Getting Started',body:_ja?
      '<h2>はじめ方</h2><p>1. スキルレベルを選択（Beginner/Intermediate/Pro）<br>2. プロジェクト名を入力<br>3. テンプレート選択（任意・41種類）<br>4. Phase 1-3の質問に回答（スキップ＆後で回答可）<br>5. 生成ボタンで88+ファイル作成<br>6. ZIPダウンロードまたはPDF印刷</p>'+
      '<h3>UX機能</h3>'+
      '<p>• 🌱⚡🔥 スキルレベルで質問の選択肢が動的変化<br>• 🎯 41プリセットテンプレート<br>• ✎ 回答の編集（✎ボタン）<br>• ⏭️ スキップ＆後で回答<br>• 📊 複雑度分析（0-100スコア）<br>• 📁 プロジェクト管理（Ctrl+M）<br>• 🎙️ 音声入力<br>• ? 質問ごとのヘルプアイコン<br>• 🔀 ドラッグ&ドロップ優先度ソート</p>'+
      '<h3>V8 新機能</h3>'+
      '<p>• 📱 モバイル開発パス (Expo/React Native)<br>• 🤖 AI自律開発ガイド (Vibe Coding/マルチAgent)<br>• 💳 決済・CMS・EC統合ガイド<br>• ⚡ 並列スタック比較 (7パターン)<br>• 📊 技術マスターテーブル / Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ インタラクティブロードマップ (進捗管理)</p>'+
      '<h3>V8.3 新機能</h3>'+
      '<p>• 📊 Mermaid図ライブレンダリング (ER図・画面遷移・ガント)<br>• 📝 OpenAPI準拠API仕様書<br>• ✅ テストケースマトリクス (機能×正常/異常)<br>• 📋 リリースチェックリスト (デプロイ先別動的生成)<br>• 🔨 WBS 3階層+工数見積り<br>• 🎯 プロンプトプレイブック (フェーズ別AI投入プロンプト集)<br>• 📎 GitHub Issues風タスク分解<br>• 📋 全ファイル結合コピー (AI一括投入用)</p>'+
      '<h3>V9 新機能</h3>'+
      '<p>• 🧪 品質インテリジェンスエンジン (業種別QA戦略・テストマトリクス・インシデント対応)<br>• 🎨 デザインシステム自動生成 (デザイントークン・シーケンス図)<br>• 🔄 リバースエンジニアリング (ゴール逆算型プランニング・24ドメイン対応)<br>• 🏗️ 実装インテリジェンス (業種別実装パターン・AI運用手順書・擬似コード)<br>• 🧠 AI開発OS (コンテキスト圧縮・ファイル選択マトリクス・サブエージェント分離)<br>• 🌐 24ドメイン対応 (AI, IoT, 不動産, 法務, 人事, 金融 等を追加)<br>• 📦 88+ファイル生成 (docs 40種, AIルール12+, スキル8+)<br>• 🎯 41プリセット (CRM, SNS, 物流, アンケート, 求人 追加)</p>'+
      '<p class="workflow-ref">📘 <strong>生成後の手順は <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">生成後ワークフローガイド</a> を参照</strong></p>'
      :
      '<h2>Getting Started</h2><p>1. Select your skill level (Beginner/Intermediate/Pro)<br>2. Enter project name<br>3. Choose a template (optional, 41 types)<br>4. Answer Phase 1-3 questions (skip & answer later OK)<br>5. Click Generate for 88+ files<br>6. Download ZIP or print PDF</p>'+
      '<h3>UX Features</h3>'+
      '<p>• 🌱⚡🔥 Dynamic options by skill level<br>• 🎯 41 preset templates<br>• ✎ Edit answers (✎ button)<br>• ⏭️ Skip & answer later<br>• 📊 Complexity analysis (0-100 score)<br>• 📁 Project manager (Ctrl+M)<br>• 🎙️ Voice input<br>• ? Help icon per question<br>• 🔀 Drag & drop priority sort</p>'+
      '<h3>V8 Features</h3>'+
      '<p>• 📱 Mobile dev path (Expo/React Native)<br>• 🤖 AI autonomous guide (Vibe Coding/Multi-Agent)<br>• 💳 Payment/CMS/EC integration<br>• ⚡ Parallel stack comparison (7 patterns)<br>• 📊 Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ Interactive roadmap (progress tracking)</p>'+
      '<h3>V8.3 Features</h3>'+
      '<p>• 📊 Mermaid diagram live rendering (ER/screen flow/Gantt)<br>• 📝 OpenAPI-compliant API specs<br>• ✅ Test case matrix (feature × normal/abnormal)<br>• 📋 Release checklist (per deploy target)<br>• 🔨 WBS 3-level + effort estimation<br>• 🎯 Prompt playbook (phase-specific AI prompts)<br>• 📎 GitHub Issues-style task breakdown<br>• 📋 Copy all files combined (for bulk AI input)</p>'+
      '<h3>V9 Features</h3>'+
      '<p>• 🧪 Quality Intelligence Engine (industry-specific QA strategies, test matrix, incident response)<br>• 🎨 Design System generation (design tokens, sequence diagrams)<br>• 🔄 Reverse Engineering (goal-driven reverse planning, 24 domains)<br>• 🏗️ Implementation Intelligence (domain-specific impl patterns, AI runbook, pseudo-code)<br>• 🧠 AI Development OS (context compression, file selection matrix, sub-agent isolation)<br>• 🌐 24 domain support (AI, IoT, Real Estate, Legal, HR, FinTech added)<br>• 📦 88+ file generation (40 docs, 12+ AI rules, 8+ skills)<br>• 🎯 41 presets (CRM, Social, Logistics, Survey, Job Board added)</p>'+
      '<p class="workflow-ref">📘 <strong>For post-generation workflow, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'
    },
    {id:'pillars',title:_ja?'12の柱':'12 Pillars',body:_ja?
      '<h2>12の柱の詳細</h2><h3>① SDD統合 (5ファイル)</h3>'+
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
      '<p>生成した仕様書をAIツールに一括投入。20のプロンプトテンプレート（レビュー・実装・テスト・リファクタ・セキュリティ・ドキュメント・QA・デバッグ・アーキテクチャ・パフォーマンス・API統合・アクセシビリティ・マイグレーション・メトリクス・i18n・グロース・リバースエンジニアリング・インシデント対応・オンボーディング・CI/CD設計）。フォルダ別トークン推定・モデル適合度表示。<strong>詳細は「📋 プロンプトマニュアル」参照</strong>。</p>'+
      '<h3>⑨ デザインシステム (2ファイル)</h3>'+
      '<p>design_system.md (デザイントークン・色・タイポ・コンポーネントカタログ) / sequence_diagrams.md (認証・CRUD・決済フローのMermaidシーケンス図) — フレームワーク別実装ガイド。</p>'+
      '<h3>⑩ リバースエンジニアリング (2ファイル)</h3>'+
      '<p>reverse_engineering.md (ゴール定義→逆算フロー・マイルストーンGantt・リスク分析) / goal_decomposition.md (ゴールツリー・サブゴール分解・ギャップ分析・優先度マトリクス・依存関係チェーン) — 24ドメイン対応の逆算型プランニング。</p>'+
      '<h3>⑪ 実装インテリジェンス (4ファイル)</h3>'+
      '<p>implementation_playbook.md (業種別実装パターン・擬似コード・スタック固有ガイダンス・横断的関心事チェックリスト) / ai_dev_runbook.md (AI運用ワークフロー・コンテキスト管理・エラー復旧プロトコル) / skill_guide.md (スキルレベル別使用ガイド・注意事項・チェックリスト) / impl-patterns.md (Manus Skills形式の実装スキルカタログ、ai_auto≠noneの場合) — 24ドメイン対応の実装ガイド。</p>'+
      '<h3>⑫ セキュリティインテリジェンス (5ファイル)</h3>'+
      '<p>security_intelligence.md (OWASP Top 10 2025監査・セキュリティヘッダー・責任分界・シークレット管理・認証セキュリティ) / threat_model.md (STRIDEエンティティ別脅威分析・攻撃対象領域・対策マトリクス) / compliance_matrix.md (PCI DSS・HIPAA・GDPR・ISMAP・SOC 2・FERPAドメイン別チェックリスト) / ai_security.md (AI生成コードレビュー・パッケージ幻覚検知・敵対的AIプロンプト・Agent Security) / security_testing.md (RLSテスト・Zodスキーマ・IDORテスト・OWASP ZAP設定・ペネトレーションテストチェックリスト) — スタック適応型セキュリティ自動生成エンジン。</p>'
      :
      '<h2>12 Pillars in Detail</h2><h3>① SDD Integration (5 files)</h3>'+
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
      '<p>Bulk-feed generated specs to AI tools. 20 prompt templates (Review, Implement, Test, Refactor, Security, Docs, QA, Debug, Architecture, Performance, API, Accessibility, Migration, Metrics, i18n, Growth, Reverse Engineering, Incident Response, Onboarding, CI/CD Design). Per-folder token estimation and model fit display. <strong>See "📋 Prompt Manual" for details</strong>.</p>'+
      '<h3>⑨ Design System (2 files)</h3>'+
      '<p>design_system.md (design tokens, colors, typography, component catalog) / sequence_diagrams.md (auth, CRUD, payment Mermaid sequence diagrams) — Framework-specific guides.</p>'+
      '<h3>⑩ Reverse Engineering (2 files)</h3>'+
      '<p>reverse_engineering.md (goal definition → reverse flow, milestone Gantt, risk analysis) / goal_decomposition.md (goal tree, sub-goal breakdown, gap analysis, priority matrix, dependency chain) — 24 domain-specific reverse planning.</p>'+
      '<h3>⑪ Implementation Intelligence (4 files)</h3>'+
      '<p>implementation_playbook.md (domain-specific impl patterns, pseudo-code, stack guidance, cross-cutting concerns checklist) / ai_dev_runbook.md (AI operation workflow, context management, error recovery protocol) / skill_guide.md (skill-level usage guide, cautions, checklists) / impl-patterns.md (implementation skills in Manus Skills format, if ai_auto≠none) — 24 domain-specific implementation guide.</p>'+
      '<h3>⑫ Security Intelligence (5 files)</h3>'+
      '<p>security_intelligence.md (OWASP Top 10 2025 audit, security headers, shared responsibility model, secrets management, auth security) / threat_model.md (STRIDE entity threat analysis, attack surface, mitigation matrix) / compliance_matrix.md (PCI DSS, HIPAA, GDPR, ISMAP, SOC 2, FERPA domain-specific checklists) / ai_security.md (AI-generated code review, package hallucination detection, adversarial AI prompts, agent security) / security_testing.md (RLS tests, Zod schemas, IDOR tests, OWASP ZAP config, penetration testing checklist) — Stack-adaptive security auto-generation engine.</p>'
    },
    {id:'export',title:_ja?'エクスポート':'Export',body:_ja?
      '<h2>エクスポート方法</h2><p><strong>ZIP</strong>: 全88+ファイルをフォルダ構造付きでZIP圧縮ダウンロード。<br><strong>PDF</strong>: Markdownファイルを整形してブラウザのPDF印刷で出力。<br><strong>URL共有</strong>: プロジェクト設定をBase64エンコードしてURL共有。<br><strong>全ファイルコピー</strong>: 全ドキュメントを1テキストに結合してクリップボードにコピー（Ctrl+Shift+C）。AIへの一括投入に最適。</p><h3>テンプレート保存</h3><p>プロジェクト設定をlocalStorageに保存し、次回起動時に読み込み可能。</p>'+
      '<p class="workflow-ref">📘 <strong>エクスポート後の開発手順は <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">生成後ワークフローガイド</a> を参照</strong></p>'
      :
      '<h2>Export Methods</h2><p><strong>ZIP</strong>: Download all 88+ files as a ZIP with folder structure.<br><strong>PDF</strong>: Format Markdown files and print via browser PDF.<br><strong>URL Sharing</strong>: Base64-encode project settings and share via URL.<br><strong>Copy All Files</strong>: Combine all documents into one text and copy to clipboard (Ctrl+Shift+C). Ideal for bulk AI input.</p><h3>Template Save</h3><p>Save project settings to localStorage and load them on next launch.</p>'+
      '<p class="workflow-ref">📘 <strong>For development workflow after export, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'
    },
    {id:'guide',title:_ja?'🚀 活用ガイド':'🚀 Usage Guide',body:function(){
      const baseBody=_ja?
      '<h2>🚀 生成ファイル活用ガイド</h2>'+
      '<p>DevForge v9 は世界で唯一の<strong>仕様駆動AIプロジェクトジェネレーター</strong>です。他のツールが「コード」を生成するのに対し、DevForge は「開発の知性」── 設計・環境・ルール・学習計画を88+ファイルで生成します。</p>'+
      '<h3>🌱 Beginner — まず動かす</h3>'+
      '<p><strong>Step 1: ロードマップに従う</strong><br>ダッシュボード（柱⑦）のロードマップUIがそのまま学習計画。Layer 1から順にチェック。📖ボタンで公式ドキュメントに直接ジャンプ。</p>'+
      '<p><strong>Step 2: 3つだけ覚える</strong><br>• <code>README.md</code> — GitHubにそのまま公開OK<br>• <code>.devcontainer/</code> — VS Code/Cursorで開くだけで環境完成<br>• <code>CLAUDE.md</code> — AIに「これ読んで」で全仕様を理解</p>'+
      '<p><strong>Step 3: AIに丸ごと渡す</strong><br>「全ファイルコピー」(Ctrl+Shift+C) → AI に貼り付け → 仕様を把握した状態で開発スタート。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-c">Ctrl+Shift+C<br>コピー</span><span class="hg-a">→</span><span class="hg-n hg-p">AI貼付<br>Cursor等</span><span class="hg-a">→</span><span class="hg-n hg-g">開発<br>スタート</span></div>'+
      '<h3>🔥 Intermediate — 効率を極める</h3>'+
      '<p><strong>SDD仕様駆動開発:</strong> <code>.spec/</code> がプロジェクトのSSoT（信頼できる唯一の情報源）。constitution.md(憲法) → specification.md(要件) → tasks.md(タスク) → verification.md(完了基準)。AIへの指示は「tasks.mdの○○を実装して」の一文で完結。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">constitution<br>原則</span><span class="hg-a">→</span><span class="hg-n hg-c">specification<br>要件</span><span class="hg-a">→</span><span class="hg-n hg-p">tasks<br>タスク</span><span class="hg-a">→</span><span class="hg-n hg-g">verification<br>完了基準</span></div>'+
      '<p><strong>マルチAIツール統一:</strong> 柱④で生成される10ファイルがCursor/.cursor/rules、Claude Code/CLAUDE.md、Copilot/.github/copilot-instructions.md、Windsurf/.windsurfrules、Cline/.clinerules、Gemini/.gemini/settings.json等を同時カバー。どのツールに乗り換えても同じルール。</p>'+
      '<p><strong>MCP拡張:</strong> mcp-config.jsonをプロジェクトルートに配置 → context7(最新ドキュメント)、filesystem(構造把握)、playwright(E2Eテスト)等をAIが即利用。</p>'+
      '<h3>⚡ Professional — 自動化を支配する</h3>'+
      '<p><strong>Agent Teams並列開発:</strong> AGENTS.mdでエージェント役割を定義 → Claude Code Subagents / Antigravity Manager View で並列実行。tasks.mdがタスクキューとして機能。</p>'+
      '<p><strong>CI/CDゲート化:</strong> .ai/hooks.yml → GitHub Actions変換。docs/09_release_checklist.mdをデプロイゲートに。verification.mdを品質基準に。</p>'+
      '<p><strong>開発パイプライン:</strong> 柱⑧の20テンプレートを活用 → 📋仕様レビュー → 🔨実装 → 🧪テスト → ♻️リファクタ → 🔒セキュリティ → 📝ドキュメント更新。+ 🔧デバッグ・📐アーキテクチャ・⚡パフォーマンス等の専門テンプレートも利用可能。仕様書が全工程の入力。<strong>（📖 詳細はプロンプトマニュアル参照）</strong></p>'+
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
      '<tr><td><code>roadmap/</code></td><td>学習ガイド</td><td>進捗管理</td><td>オンボーディング</td></tr>'+
      '<tr><td><code>docs/</code> 40ファイル</td><td>後で参照</td><td>レビュー素材</td><td>CI/CDゲート</td></tr>'+
      '<tr><td><code>docs/29_reverse_engineering</code></td><td>読むだけ</td><td>逆算計画</td><td>マイルストーン管理</td></tr>'+
      '<tr><td><code>docs/30_goal_decomposition</code></td><td>後で参照</td><td>優先順位付け</td><td>タスク依存分析</td></tr>'+
      '<tr><td>柱④ AIルール</td><td>触らない</td><td>ルール追加</td><td>全ツール統一</td></tr>'+
      '<tr><td>柱⑧ ランチャー</td><td>使わない</td><td>部分利用</td><td>全工程自動化</td></tr>'+
      '<tr><td><code>.mcp/ + config</code></td><td>後で</td><td>そのまま</td><td>カスタムMCP</td></tr>'+
      '<tr><td><code>AGENTS.md</code></td><td>不要</td><td>参照</td><td>並列Agent</td></tr>'+
      '<tr><td><code>.ai/hooks.yml</code></td><td>不要</td><td>参照</td><td>CI/CD統合</td></tr></table>'+
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 レベル別ガイドを表示</button> <button class="btn btn-s btn-sm" onclick="showManual(\'workflow\')">📘 生成後ワークフロー</button></p>':
      '<h2>🚀 Generated Files Usage Guide</h2>'+
      '<p>DevForge v9 is the world\'s only <strong>spec-driven AI project generator</strong>. While other tools generate code, DevForge generates "development intelligence" — design, environment, rules, and learning plans through 88+ files.</p>'+
      '<h3>🌱 Beginner — Get Started</h3>'+
      '<p><strong>Step 1: Follow the Roadmap</strong><br>The Dashboard (Pillar ⑦) roadmap UI is your learning plan. Check off from Layer 1. Hit 📖 to jump to official docs.</p>'+
      '<p><strong>Step 2: Remember Just 3 Files</strong><br>• <code>README.md</code> — Publish directly to GitHub<br>• <code>.devcontainer/</code> — Open in VS Code/Cursor and dev env is ready<br>• <code>CLAUDE.md</code> — Tell AI "read this" and it understands your entire project</p>'+
      '<p><strong>Step 3: Feed Everything to AI</strong><br>"Copy All Files" (Ctrl+Shift+C) → Paste into AI → Start coding with full project context.</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Ctrl+Shift+C<br>Copy</span><span class="hg-a">→</span><span class="hg-n hg-p">Paste to<br>AI Tool</span><span class="hg-a">→</span><span class="hg-n hg-g">Start<br>Coding</span></div>'+
      '<h3>🔥 Intermediate — Maximize Efficiency</h3>'+
      '<p><strong>SDD Workflow:</strong> <code>.spec/</code> is your SSoT. constitution.md(principles) → specification.md(requirements) → tasks.md(tasks) → verification.md(acceptance criteria). Tell AI: "implement task X from tasks.md following specification.md".</p>'+
      '<p><strong>Multi-AI Tool Unity:</strong> Pillar ④ generates 10 files covering Cursor, Claude Code, Copilot, Windsurf, Cline, Gemini etc. Same rules regardless of which tool you use.</p>'+
      '<p><strong>MCP Extension:</strong> Place mcp-config.json in project root → AI instantly uses context7, filesystem, playwright MCPs.</p>'+
      '<h3>⚡ Professional — Master Automation</h3>'+
      '<p><strong>Agent Teams:</strong> AGENTS.md defines agent roles → Run with Claude Code Subagents / Antigravity Manager View. tasks.md serves as task queue.</p>'+
      '<p><strong>CI/CD Gates:</strong> .ai/hooks.yml → GitHub Actions. docs/09_release_checklist.md as deploy gate. verification.md as quality baseline.</p>'+
      '<p><strong>Dev Pipeline:</strong> 20 templates in Pillar ⑧ → 📋Review → 🔨Implement → 🧪Test → ♻️Refactor → 🔒Security → 📝Docs. Plus 🔧Debug, 📐Architecture, ⚡Performance and more specialized templates. <strong>(📖 See Prompt Manual for details)</strong></p>'+
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
      '<tr><td><code>roadmap/</code></td><td>Learning</td><td>Progress</td><td>Onboarding</td></tr>'+
      '<tr><td><code>docs/</code> 40 files</td><td>Later</td><td>Review material</td><td>CI/CD gates</td></tr>'+
      '<tr><td>Pillar ④ AI Rules</td><td>Don\'t touch</td><td>Add rules</td><td>Unified ops</td></tr>'+
      '<tr><td>Pillar ⑧ Launcher</td><td>Skip</td><td>Partial use</td><td>Full pipeline</td></tr>'+
      '<tr><td><code>.mcp/ + config</code></td><td>Later</td><td>As-is</td><td>Custom MCP</td></tr>'+
      '<tr><td><code>AGENTS.md</code></td><td>Skip</td><td>Reference</td><td>Multi-Agent</td></tr>'+
      '<tr><td><code>.ai/hooks.yml</code></td><td>Skip</td><td>Reference</td><td>CI/CD Integration</td></tr></table>'+
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 Show Level Guide</button> <button class="btn btn-s btn-sm" onclick="showManual(\'workflow\')">📘 Post-Gen Workflow</button></p>';
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
      '<p class="guide-workflow-intro">DevForge v9で88+ファイルを生成した後、<strong>実際に動くアプリを作るまでの一気通貫の手順</strong>を5フェーズで解説します。</p>'+
      '<h3>① 基礎概念 — DevForgeの生成物を理解する</h3>'+
      '<div class="workflow-concept"><p><strong>重要:</strong> DevForgeが生成するのは<strong class="workflow-highlight">設計ドキュメント</strong>であり、実行可能なアプリケーションコードではありません。</p>'+
      '<p><strong>SDD（仕様駆動開発）の思想:</strong> <code>.spec/</code>がSSoT（信頼できる唯一の情報源）として機能します。</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-c">AIツールに<br>投入</span><span class="hg-a">→</span><span class="hg-n hg-p">実コード<br>生成</span><span class="hg-a">→</span><span class="hg-n hg-g">動くアプリ<br>完成</span></div></div>'+
      '<h4>88+ファイルの全体像</h4>'+
      '<table class="workflow-files"><tr><th>カテゴリ</th><th>内容</th><th>ファイル数</th></tr>'+
      '<tr><td>.spec/</td><td>仕様駆動開発の5点セット</td><td>5</td></tr>'+
      '<tr><td>.devcontainer/</td><td>Docker開発環境</td><td>4</td></tr>'+
      '<tr><td>.mcp/</td><td>Model Context Protocol設定</td><td>3</td></tr>'+
      '<tr><td>AIルール</td><td>10+ツール対応（Cursor, Claude Code等）</td><td>12+</td></tr>'+
      '<tr><td>docs/</td><td>40種類の仕様書・設計書</td><td>40</td></tr>'+
      '<tr><td>roadmap/</td><td>学習パス</td><td>9</td></tr>'+
      '<tr><td>共通</td><td>README, LICENSE等</td><td>4</td></tr></table>'+
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
      '<h3>③ 手順 — 5フェーズ開発ワークフロー</h3>'+
      '<div class="workflow-phases">'+
      '<div class="workflow-phase"><h4>Phase A: プロジェクト理解（Day 1）</h4>'+
      '<ul><li><strong>ファイル読み順:</strong> <code>constitution.md</code> → <code>specification.md</code> → <code>technical-plan.md</code></li>'+
      '<li><strong>Dashboardチェック:</strong> シナジースコア / モデル適合 / ヘルススコアを確認</li>'+
      '<li><strong>設計確認:</strong> ER図（docs/04）+ API設計（docs/05）を把握</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase B: 環境構築（Day 1-2）</h4>'+
      '<ul><li><strong>DevContainerパス:</strong> フォルダを開く → "Reopen in Container"</li>'+
      '<li><strong>手動パス:</strong> package.json scripts + .env.exampleを参考に構築</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase C: AIと一緒に開発（Day 2+）</h4>'+
      '<p><strong>アプローチ1: シンプル</strong></p>'+
      '<div class="hg-flow"><span class="hg-n hg-c">Ctrl+Shift+C<br>全コピー</span><span class="hg-a">→</span><span class="hg-n hg-p">AIに貼付</span><span class="hg-a">→</span><span class="hg-n hg-g">"Issue #1を<br>実装して"</span></div>'+
      '<p><strong>アプローチ2: 構造化</strong></p>'+
      '<ul><li>ランチャーの🔍レビュー → 🚀MVP実装テンプレートを活用</li>'+
      '<li><code>tasks.md</code>のIssue番号順に進める</li>'+
      '<li>タスクループ: <code>タスク読む → 実装 → テスト → 完了マーク</code></li>'+
      '<li><code>verification.md</code>で受入基準チェック</li></ul>'+
      '<h5>推奨テンプレート順序</h5>'+
      '<ol class="workflow-template-order"><li>🔍 仕様レビュー</li><li>🚀 MVP実装</li><li>🧪 テスト生成</li><li>🔒 セキュリティ監査</li><li>📝 ドキュメント更新</li></ol></div>'+
      '<div class="workflow-phase"><h4>Phase D: 品質保証</h4>'+
      '<ul><li>ランチャーテンプレート: 🧪テスト → 🔒セキュリティ → ♿a11y</li>'+
      '<li>参照先: docs/07, docs/28, docs/33</li>'+
      '<li>エラーログ: docs/25_error_logs.mdに記録</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase E: リリース</h4>'+
      '<ul><li>docs/24_progress.mdで進捗更新</li>'+
      '<li>docs/09_release_checklist.mdに従う</li>'+
      '<li>CI/CD: .github/workflows/ci.ymlが事前設定済み</li></ul>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Build</span><span class="hg-a">→</span><span class="hg-n hg-c">Test</span><span class="hg-a">→</span><span class="hg-n hg-p">Fix</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span><span class="hg-a">→</span><span class="hg-n">Monitor</span></div></div></div>'+
      '<h3>④ 応用 — 上級テクニック</h3>'+
      '<ul class="workflow-advanced"><li><strong>テンプレートチェーン:</strong> ランチャーで複数テンプレートを順次実行（→ 📋プロンプトマニュアル参照）</li>'+
      '<li><strong>マルチエージェント開発:</strong> AGENTS.md + Claude Code Subagents</li>'+
      '<li><strong>再生成:</strong> スコープ変更後、再生成ボタン（回答は保持）</li>'+
      '<li><strong>チームオンボーディング:</strong> ロードマップ（柱⑦）で新メンバー育成</li>'+
      '<li><strong>グロース戦略:</strong> docs/41_growth_intelligence.md活用</li>'+
      '<li><strong>ゴール再検証:</strong> docs/29-30でピボット時の方向性確認</li></ul>'+
      '<h3>⑤ よくある失敗と回避策</h3>'+
      '<table class="workflow-pitfalls"><tr><th>失敗</th><th>原因</th><th>対策</th></tr>'+
      '<tr><td>ファイルを直接実行しようとする</td><td>DevForgeの出力を誤解</td><td>設計ドキュメントをAIに投入してコード生成</td></tr>'+
      '<tr><td>バックアップしない</td><td>localStorageに依存</td><td>毎回ZIP+JSONエクスポート</td></tr>'+
      '<tr><td>互換性警告を無視</td><td>ダッシュボード未確認</td><td>⚠️警告に対処してから開発開始</td></tr>'+
      '<tr><td>全ファイルを一度にAIに投入</td><td>コンテキストウィンドウ超過</td><td>ランチャーのフォルダ選択でトークン管理</td></tr>'+
      '<tr><td>tasks.mdを使わない</td><td>非構造的なAI指示</td><td>Issue番号順に実装</td></tr>'+
      '<tr><td>verification.mdをスキップ</td><td>受入基準なし</td><td>機能ごとにverification.mdで確認</td></tr>'+
      '<tr><td>途中でスキルレベル変更</td><td>質問選択肢の不整合</td><td>最初に正しく設定</td></tr>'+
      '<tr><td>MCP未設定</td><td>AIツール連携が不完全</td><td>mcp-config.jsonを配置</td></tr></table>'+
      '<h3>⑥ まとめ — クイックリファレンス</h3>'+
      '<div class="workflow-summary"><h4>10項目チェックリスト</h4>'+
      '<ol class="workflow-checklist"><li>✅ 監査結果確認（❌ / ⚠️ なし）</li><li>✅ ZIP + JSONバックアップ済み</li>'+
      '<li>✅ DevContainer起動 or 手動環境構築完了</li><li>✅ AIツールにルールファイル認識済み</li>'+
      '<li>✅ constitution.md → specification.md 読了</li><li>✅ tasks.mdを開いてタスク把握</li>'+
      '<li>✅ Issue #1から順次実装開始</li><li>✅ verification.mdで受入基準確認</li>'+
      '<li>✅ テスト・セキュリティ監査実施</li><li>✅ リリースチェックリストで最終確認</li></ol>'+
      '<h4>全体フロー図</h4>'+
      '<div class="hg-flow"><span class="hg-n hg-b">生成</span><span class="hg-a">→</span><span class="hg-n hg-c">バックアップ</span><span class="hg-a">→</span><span class="hg-n hg-p">環境構築</span><span class="hg-a">→</span><span class="hg-n">仕様理解</span><span class="hg-a">→</span><span class="hg-n">AI開発</span><span class="hg-a">→</span><span class="hg-n">QA</span><span class="hg-a">→</span><span class="hg-n hg-g">リリース</span></div>'+
      '<p class="workflow-footer"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 レベル別ガイドを表示</button></p></div>'
      :
      '<h2>📘 Complete Post-Generation Workflow Guide</h2>'+
      '<p class="guide-workflow-intro">After generating 88+ files with DevForge v9, follow this <strong>end-to-end workflow</strong> in 5 phases to build a working app.</p>'+
      '<h3>① Fundamentals — Understanding DevForge Output</h3>'+
      '<div class="workflow-concept"><p><strong>Important:</strong> DevForge generates <strong class="workflow-highlight">design documents</strong>, not runnable application code.</p>'+
      '<p><strong>SDD (Spec-Driven Development) Philosophy:</strong> <code>.spec/</code> serves as your SSoT (Single Source of Truth).</p>'+
      '<div class="hg-flow"><span class="hg-n hg-b">DevForge<br>Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Feed to<br>AI Tool</span><span class="hg-a">→</span><span class="hg-n hg-p">Generate<br>Real Code</span><span class="hg-a">→</span><span class="hg-n hg-g">Working<br>App</span></div></div>'+
      '<h4>88+ Files Overview</h4>'+
      '<table class="workflow-files"><tr><th>Category</th><th>Content</th><th>Files</th></tr>'+
      '<tr><td>.spec/</td><td>SDD 5-point set</td><td>5</td></tr>'+
      '<tr><td>.devcontainer/</td><td>Docker dev environment</td><td>4</td></tr>'+
      '<tr><td>.mcp/</td><td>Model Context Protocol config</td><td>3</td></tr>'+
      '<tr><td>AI Rules</td><td>10+ tool support (Cursor, Claude Code, etc.)</td><td>12+</td></tr>'+
      '<tr><td>docs/</td><td>40 spec/design documents</td><td>40</td></tr>'+
      '<tr><td>roadmap/</td><td>Learning paths</td><td>9</td></tr>'+
      '<tr><td>Common</td><td>README, LICENSE, etc.</td><td>4</td></tr></table>'+
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
      '<h3>③ Workflow — 5-Phase Development Process</h3>'+
      '<div class="workflow-phases">'+
      '<div class="workflow-phase"><h4>Phase A: Project Understanding (Day 1)</h4>'+
      '<ul><li><strong>Reading Order:</strong> <code>constitution.md</code> → <code>specification.md</code> → <code>technical-plan.md</code></li>'+
      '<li><strong>Dashboard Check:</strong> Synergy Score / Model Fit / Health Score</li>'+
      '<li><strong>Design Review:</strong> ER diagram (docs/04) + API design (docs/05)</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase B: Environment Setup (Day 1-2)</h4>'+
      '<ul><li><strong>DevContainer Path:</strong> Open folder → "Reopen in Container"</li>'+
      '<li><strong>Manual Path:</strong> Follow package.json scripts + .env.example</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase C: AI-Assisted Development (Day 2+)</h4>'+
      '<p><strong>Approach 1: Simple</strong></p>'+
      '<div class="hg-flow"><span class="hg-n hg-c">Ctrl+Shift+C<br>Copy All</span><span class="hg-a">→</span><span class="hg-n hg-p">Paste to<br>AI</span><span class="hg-a">→</span><span class="hg-n hg-g">"Implement<br>Issue #1"</span></div>'+
      '<p><strong>Approach 2: Structured</strong></p>'+
      '<ul><li>Use Launcher\'s 🔍 Review → 🚀 MVP Build templates</li>'+
      '<li>Work through <code>tasks.md</code> in Issue# order</li>'+
      '<li>Task Loop: <code>Read Task → Implement → Test → Mark Complete</code></li>'+
      '<li>Check acceptance criteria in <code>verification.md</code></li></ul>'+
      '<h5>Recommended Template Order</h5>'+
      '<ol class="workflow-template-order"><li>🔍 Spec Review</li><li>🚀 MVP Build</li><li>🧪 Test Generation</li><li>🔒 Security Audit</li><li>📝 Doc Update</li></ol></div>'+
      '<div class="workflow-phase"><h4>Phase D: Quality Assurance</h4>'+
      '<ul><li>Launcher templates: 🧪 Test → 🔒 Security → ♿ a11y</li>'+
      '<li>Reference: docs/07, docs/28, docs/33</li>'+
      '<li>Error Log: Record in docs/25_error_logs.md</li></ul></div>'+
      '<div class="workflow-phase"><h4>Phase E: Release</h4>'+
      '<ul><li>Update progress in docs/24_progress.md</li>'+
      '<li>Follow docs/09_release_checklist.md</li>'+
      '<li>CI/CD: Pre-configured in .github/workflows/ci.yml</li></ul>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Build</span><span class="hg-a">→</span><span class="hg-n hg-c">Test</span><span class="hg-a">→</span><span class="hg-n hg-p">Fix</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span><span class="hg-a">→</span><span class="hg-n">Monitor</span></div></div></div>'+
      '<h3>④ Advanced — Expert Techniques</h3>'+
      '<ul class="workflow-advanced"><li><strong>Template Chaining:</strong> Execute multiple templates sequentially in Launcher (→ See 📋 Prompt Manual)</li>'+
      '<li><strong>Multi-Agent Development:</strong> AGENTS.md + Claude Code Subagents</li>'+
      '<li><strong>Regeneration:</strong> After scope changes, regenerate (answers preserved)</li>'+
      '<li><strong>Team Onboarding:</strong> Use Roadmap (Pillar ⑦) for new members</li>'+
      '<li><strong>Growth Strategy:</strong> Leverage docs/41_growth_intelligence.md</li>'+
      '<li><strong>Goal Re-validation:</strong> Use docs/29-30 for pivot direction</li></ul>'+
      '<h3>⑤ Common Pitfalls & Solutions</h3>'+
      '<table class="workflow-pitfalls"><tr><th>Pitfall</th><th>Cause</th><th>Solution</th></tr>'+
      '<tr><td>Trying to run files directly</td><td>Misunderstanding DevForge output</td><td>Feed design docs to AI to generate code</td></tr>'+
      '<tr><td>Not backing up</td><td>Relying only on localStorage</td><td>ZIP + JSON export every time</td></tr>'+
      '<tr><td>Ignoring compatibility warnings</td><td>Skipping Dashboard check</td><td>Address ⚠️ warnings before dev</td></tr>'+
      '<tr><td>Feeding all files to AI at once</td><td>Context window overflow</td><td>Use Launcher folder selection for token mgmt</td></tr>'+
      '<tr><td>Not using tasks.md</td><td>Unstructured AI instructions</td><td>Implement in Issue# order</td></tr>'+
      '<tr><td>Skipping verification.md</td><td>No acceptance criteria</td><td>Check verification.md per feature</td></tr>'+
      '<tr><td>Changing skill level mid-project</td><td>Question option inconsistency</td><td>Set correctly at start</td></tr>'+
      '<tr><td>MCP not configured</td><td>Incomplete AI tool integration</td><td>Place mcp-config.json</td></tr></table>'+
      '<h3>⑥ Summary — Quick Reference</h3>'+
      '<div class="workflow-summary"><h4>10-Item Checklist</h4>'+
      '<ol class="workflow-checklist"><li>✅ Audit results reviewed (no ❌ / ⚠️)</li><li>✅ ZIP + JSON backup done</li>'+
      '<li>✅ DevContainer running or manual env setup complete</li><li>✅ AI tool recognizes rule files</li>'+
      '<li>✅ Read constitution.md → specification.md</li><li>✅ Opened tasks.md and identified tasks</li>'+
      '<li>✅ Started implementing from Issue #1</li><li>✅ Checked acceptance criteria in verification.md</li>'+
      '<li>✅ Ran tests & security audit</li><li>✅ Final check with release checklist</li></ol>'+
      '<h4>Overall Flow Diagram</h4>'+
      '<div class="hg-flow"><span class="hg-n hg-b">Generate</span><span class="hg-a">→</span><span class="hg-n hg-c">Backup</span><span class="hg-a">→</span><span class="hg-n hg-p">Setup Env</span><span class="hg-a">→</span><span class="hg-n">Understand<br>Specs</span><span class="hg-a">→</span><span class="hg-n">AI Dev</span><span class="hg-a">→</span><span class="hg-n">QA</span><span class="hg-a">→</span><span class="hg-n hg-g">Release</span></div>'+
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
      '<tr><td><strong>運用</strong></td><td>♻️リファクタ / 🔧デバッグ / 🚨インシデント / 📝ドキュメント / 🔄マイグレーション / 🔄CI/CD</td></tr>'+
      '<tr><td><strong>ビジネス</strong></td><td>📈グロース</td></tr>'+
      '<tr><td><strong>チーム</strong></td><td>🎓オンボーディング</td></tr></table>'+
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
      '<ul><li>全20テンプレートをパイプラインとして順次実行</li>'+
      '<li>フォルダ選択を最適化（デバッグ時は<code>docs/25</code>+<code>docs/37</code>のみ等）</li>'+
      '<li><code>docs/39_implementation_playbook.md</code> と <code>docs/40_ai_dev_runbook.md</code> も活用</li></ul>'+
      '<h3>📋 全20テンプレート早見表</h3>'+
      '<table><tr><th>Icon</th><th>名前</th><th>フェーズ</th><th>主要参照ドキュメント</th></tr>'+
      '<tr><td>🔍</td><td>仕様レビュー</td><td>設計</td><td>.spec/*</td></tr>'+
      '<tr><td>📐</td><td>アーキテクチャ</td><td>設計</td><td>docs/03, docs/27, docs/26</td></tr>'+
      '<tr><td>🎯</td><td>ゴール逆算</td><td>設計</td><td>docs/29, docs/30</td></tr>'+
      '<tr><td>🚀</td><td>MVP実装</td><td>開発</td><td>docs/23, docs/39</td></tr>'+
      '<tr><td>🔌</td><td>API統合</td><td>開発</td><td>docs/05, docs/04, docs/08</td></tr>'+
      '<tr><td>🌍</td><td>i18n</td><td>開発</td><td>(コード分析)</td></tr>'+
      '<tr><td>🧪</td><td>テスト生成</td><td>QA</td><td>docs/07, docs/33, docs/36</td></tr>'+
      '<tr><td>🐛</td><td>QA・バグ検出</td><td>QA</td><td>docs/28, docs/32, docs/33</td></tr>'+
      '<tr><td>🔒</td><td>セキュリティ</td><td>QA</td><td>docs/08</td></tr>'+
      '<tr><td>♿</td><td>a11y監査</td><td>QA</td><td>docs/26, docs/06</td></tr>'+
      '<tr><td>⚡</td><td>パフォーマンス</td><td>QA</td><td>docs/41</td></tr>'+
      '<tr><td>📊</td><td>メトリクス</td><td>QA</td><td>(コード分析)</td></tr>'+
      '<tr><td>♻️</td><td>リファクタ</td><td>運用</td><td>.spec/*</td></tr>'+
      '<tr><td>🔧</td><td>デバッグ</td><td>運用</td><td>docs/25, docs/37, docs/34</td></tr>'+
      '<tr><td>🚨</td><td>インシデント</td><td>運用</td><td>docs/34, docs/25</td></tr>'+
      '<tr><td>📝</td><td>ドキュメント</td><td>運用</td><td>(全体)</td></tr>'+
      '<tr><td>🔄</td><td>マイグレーション</td><td>運用</td><td>docs/04</td></tr>'+
      '<tr><td>🔄</td><td>CI/CD</td><td>運用</td><td>docs/09, docs/36</td></tr>'+
      '<tr><td>📈</td><td>グロース</td><td>ビジネス</td><td>docs/41</td></tr>'+
      '<tr><td>🎓</td><td>オンボーディング</td><td>チーム</td><td>docs/42, docs/37</td></tr></table>'+
      '<h3>💡 Tips</h3>'+
      '<p><strong>フォルダ選択のコツ:</strong> 不要なフォルダのチェックを外してトークン節約。例: デバッグ時は<code>docs/</code>の大半は不要。</p>'+
      '<p><strong>モデル適合度の見方:</strong> 80%以下が理想。超過する場合はフォルダを絞る。</p>'+
      '<p><strong>テンプレートのチェーン例:</strong></p>'+
      '<ul><li>新機能追加: 🔍レビュー → 🚀実装 → 🧪テスト → 📝ドキュメント</li>'+
      '<li>バグ修正: 🔧デバッグ → ♻️リファクタ → 🧪テスト → 🚨インシデント対応</li>'+
      '<li>パフォーマンス改善: ⚡パフォーマンス → 📊メトリクス → ♻️リファクタ → 🧪テスト</li></ul>':
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
      '<tr><td><strong>Operations</strong></td><td>♻️Refactor / 🔧Debug / 🚨Incident / 📝Docs / 🔄Migration / 🔄CI/CD</td></tr>'+
      '<tr><td><strong>Business</strong></td><td>📈Growth</td></tr>'+
      '<tr><td><strong>Team</strong></td><td>🎓Onboarding</td></tr></table>'+
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
      '<ul><li>Execute all 20 templates as a pipeline</li>'+
      '<li>Optimize folder selection (e.g., for debugging: only <code>docs/25</code>+<code>docs/37</code>)</li>'+
      '<li>Leverage <code>docs/39_implementation_playbook.md</code> and <code>docs/40_ai_dev_runbook.md</code></li></ul>'+
      '<h3>📋 All 20 Templates Quick Reference</h3>'+
      '<table><tr><th>Icon</th><th>Name</th><th>Phase</th><th>Key Docs</th></tr>'+
      '<tr><td>🔍</td><td>Spec Review</td><td>Design</td><td>.spec/*</td></tr>'+
      '<tr><td>📐</td><td>Architecture</td><td>Design</td><td>docs/03, docs/27, docs/26</td></tr>'+
      '<tr><td>🎯</td><td>Goal Reverse</td><td>Design</td><td>docs/29, docs/30</td></tr>'+
      '<tr><td>🚀</td><td>MVP Build</td><td>Dev</td><td>docs/23, docs/39</td></tr>'+
      '<tr><td>🔌</td><td>API Integration</td><td>Dev</td><td>docs/05, docs/04, docs/08</td></tr>'+
      '<tr><td>🌍</td><td>i18n</td><td>Dev</td><td>(code analysis)</td></tr>'+
      '<tr><td>🧪</td><td>Test Generation</td><td>QA</td><td>docs/07, docs/33, docs/36</td></tr>'+
      '<tr><td>🐛</td><td>QA & Bug Detection</td><td>QA</td><td>docs/28, docs/32, docs/33</td></tr>'+
      '<tr><td>🔒</td><td>Security</td><td>QA</td><td>docs/08</td></tr>'+
      '<tr><td>♿</td><td>a11y Audit</td><td>QA</td><td>docs/26, docs/06</td></tr>'+
      '<tr><td>⚡</td><td>Performance</td><td>QA</td><td>docs/41</td></tr>'+
      '<tr><td>📊</td><td>Metrics</td><td>QA</td><td>(code analysis)</td></tr>'+
      '<tr><td>♻️</td><td>Refactor</td><td>Ops</td><td>.spec/*</td></tr>'+
      '<tr><td>🔧</td><td>Debug</td><td>Ops</td><td>docs/25, docs/37, docs/34</td></tr>'+
      '<tr><td>🚨</td><td>Incident</td><td>Ops</td><td>docs/34, docs/25</td></tr>'+
      '<tr><td>📝</td><td>Documentation</td><td>Ops</td><td>(all)</td></tr>'+
      '<tr><td>🔄</td><td>Migration</td><td>Ops</td><td>docs/04</td></tr>'+
      '<tr><td>🔄</td><td>CI/CD</td><td>Ops</td><td>docs/09, docs/36</td></tr>'+
      '<tr><td>📈</td><td>Growth</td><td>Business</td><td>docs/41</td></tr>'+
      '<tr><td>🎓</td><td>Onboarding</td><td>Team</td><td>docs/42, docs/37</td></tr></table>'+
      '<h3>💡 Tips</h3>'+
      '<p><strong>Folder Selection:</strong> Uncheck unnecessary folders to save tokens. Example: for debugging, most of <code>docs/</code> is unnecessary.</p>'+
      '<p><strong>Model Fit Indicator:</strong> 80% or below is ideal. If exceeded, reduce folder selection.</p>'+
      '<p><strong>Template Chaining Examples:</strong></p>'+
      '<ul><li>New feature: 🔍Review → 🚀Implement → 🧪Test → 📝Docs</li>'+
      '<li>Bug fix: 🔧Debug → ♻️Refactor → 🧪Test → 🚨Incident</li>'+
      '<li>Performance: ⚡Performance → 📊Metrics → ♻️Refactor → 🧪Test</li></ul>'
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
      '<p>生成される88+ファイルは<strong>設計ドキュメント</strong>（SDD仕様書・DevContainer設定・AIルール等）です。npm installで即座に動くアプリケーションコードではありません。Claude Code / Cursor等のAIツールに入力して実コードを生成する運用が前提です。</p>'+
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
      '<p>88+ generated files are <strong>design documents</strong> (SDD specs, DevContainer configs, AI rules). They are not runnable app code. Feed them to AI tools like Claude Code / Cursor to generate actual code.</p>'+
      '<p class="workflow-ref">📘 <strong>For detailed workflow, see <a href="#" onclick="event.preventDefault();showManual(\'workflow\')">Post-Gen Workflow Guide</a></strong></p>'+
      '<h3>🟡 Skill Level</h3>'+
      '<p>Changing skill level mid-project may cause inconsistencies with existing answers. <strong>Set it correctly at the start.</strong></p>'+
      '<h3>🟡 Language Switch</h3>'+
      '<p>UI language switches instantly, but <strong>generated file contents do not change</strong>. Choose the language explicitly during generation.</p>'+
      '<h3>🔵 Other</h3>'+
      '<p>・ZIP export requires JSZip via CDN (use "Copy All" Ctrl+Shift+C offline)<br>・Switch to light mode before PDF export<br>・URL sharing may truncate on SNS for complex projects</p>'
    },
    {id:'about',title:'About',body:'<h2>DevForge v9.0</h2><p>'+(_ja?'AI駆動開発 統合プラットフォーム':'AI-Driven Dev Platform')+'</p><p>Version 9.0.0 — 2026 Edition (Modular Architecture)</p><p>'+(_ja?''+_TECH_COUNT+'テクノロジー ・ 88+ファイル ・ 11の柱 ・ 41テンプレート ・ Mermaid図 ・ プロンプトプレイブック':''+_TECH_COUNT+' technologies ・ 88+ files ・ 11 pillars ・ 41 templates ・ Mermaid diagrams ・ Prompt playbook')+'</p><p>© 2026 エンジニアリングのタネ制作委員会<br>by にしあん</p>'},
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

