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

function showManual(sec){
  const o=$('helpOverlay');o.classList.add('show');
  pushModal(o,()=>{o.classList.remove('show');releaseFocus(o);});
  const _ja=S.lang==='ja';
  const MANUAL=[
    {id:'overview',title:_ja?'概要':'Overview',body:_ja?'<h2>DevForge v9.0 とは</h2><p>質問に答えるだけで、プロジェクトに必要な86+ファイルを自動生成するAI駆動開発プラットフォームです。'+_TECH_COUNT+'テクノロジー対応。</p>'+
      '<h3>11の柱</h3><table><tr><th>柱</th><th>内容</th><th>ファイル数</th></tr><tr><td>①SDD統合</td><td>Spec Kit互換の仕様書</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker開発環境</td><td>4</td></tr><tr><td>③MCP設定</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AIルール</td><td>10+ツール設定+スキル</td><td>10+</td></tr>'+
      '<tr><td>⑤並列探索</td><td>スタック比較+おすすめランキング</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>コンテキスト可視化+技術DB</td><td>UI</td></tr><tr><td>⑦ロードマップ</td><td>学習パス（インタラクティブ）</td><td>9+UI</td></tr><tr><td>⑧AIランチャー</td><td>プロンプトテンプレート+トークン推定</td><td>UI</td></tr><tr><td>⑨デザインシステム</td><td>デザイントークン+シーケンス図</td><td>2</td></tr><tr><td>⑩リバースEng</td><td>ゴール逆算型プランニング</td><td>2</td></tr><tr><td>⑪実装ガイド</td><td>業種別実装パターン+AI運用手順</td><td>3</td></tr></table>'+
      '<p>+ docs（40仕様書）+ 共通ファイル（4）= <strong>86+ファイル</strong></p>':'<h2>What is DevForge v9.0?</h2><p>An AI-driven dev platform that auto-generates 86+ project files just by answering questions. Supports '+_TECH_COUNT+' technologies.</p>'+
      '<h3>11 Pillars</h3><table><tr><th>Pillar</th><th>Content</th><th>Files</th></tr><tr><td>①SDD</td><td>Spec Kit compatible specs</td><td>5</td></tr><tr><td>②DevContainer</td><td>Docker dev environment</td><td>4</td></tr><tr><td>③MCP</td><td>Model Context Protocol</td><td>3</td></tr><tr><td>④AI Rules</td><td>10+ tool configs + skills</td><td>10+</td></tr>'+
      ''+
      '<tr><td>⑤Explorer</td><td>Stack comparison + recommendation</td><td>UI</td></tr><tr><td>⑥Dashboard</td><td>Context visualization + Tech DB</td><td>UI</td></tr><tr><td>⑦Roadmap</td><td>Learning path (interactive)</td><td>9+UI</td></tr><tr><td>⑧AI Launcher</td><td>Prompt templates + token estimation</td><td>UI</td></tr><tr><td>⑨Design System</td><td>Design tokens + Sequence diagrams</td><td>2</td></tr><tr><td>⑩Reverse Eng</td><td>Goal-driven reverse planning</td><td>2</td></tr><tr><td>⑪Impl Guide</td><td>Domain-specific impl patterns + AI runbook</td><td>3</td></tr></table>'+
      '<p>+ docs (40 specs) + common (4) = <strong>86+ files</strong></p>'},
    {id:'start',title:_ja?'はじめ方':'Getting Started',body:_ja?
      '<h2>はじめ方</h2><p>1. スキルレベルを選択（Beginner/Intermediate/Pro）<br>2. プロジェクト名を入力<br>3. テンプレート選択（任意・41種類）<br>4. Phase 1-3の質問に回答（スキップ＆後で回答可）<br>5. 生成ボタンで86+ファイル作成<br>6. ZIPダウンロードまたはPDF印刷</p>'+
      '<h3>UX機能</h3>'+
      '<p>• 🌱⚡🔥 スキルレベルで質問の選択肢が動的変化<br>• 🎯 41プリセットテンプレート<br>• ✎ 回答の編集（✎ボタン）<br>• ⏭️ スキップ＆後で回答<br>• 📊 複雑度分析（0-100スコア）<br>• 📁 プロジェクト管理（Ctrl+M）<br>• 🎙️ 音声入力<br>• ? 質問ごとのヘルプアイコン<br>• 🔀 ドラッグ&ドロップ優先度ソート</p>'+
      '<h3>V8 新機能</h3>'+
      '<p>• 📱 モバイル開発パス (Expo/React Native)<br>• 🤖 AI自律開発ガイド (Vibe Coding/マルチAgent)<br>• 💳 決済・CMS・EC統合ガイド<br>• ⚡ 並列スタック比較 (7パターン)<br>• 📊 技術マスターテーブル / Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ インタラクティブロードマップ (進捗管理)</p>'+
      '<h3>V8.3 新機能</h3>'+
      '<p>• 📊 Mermaid図ライブレンダリング (ER図・画面遷移・ガント)<br>• 📝 OpenAPI準拠API仕様書<br>• ✅ テストケースマトリクス (機能×正常/異常)<br>• 📋 リリースチェックリスト (デプロイ先別動的生成)<br>• 🔨 WBS 3階層+工数見積り<br>• 🎯 プロンプトプレイブック (フェーズ別AI投入プロンプト集)<br>• 📎 GitHub Issues風タスク分解<br>• 📋 全ファイル結合コピー (AI一括投入用)</p>'+
      '<h3>V9 新機能</h3>'+
      '<p>• 🧪 品質インテリジェンスエンジン (業種別QA戦略・テストマトリクス・インシデント対応)<br>• 🎨 デザインシステム自動生成 (デザイントークン・シーケンス図)<br>• 🔄 リバースエンジニアリング (ゴール逆算型プランニング・24ドメイン対応)<br>• 🏗️ 実装インテリジェンス (業種別実装パターン・AI運用手順書・擬似コード)<br>• 🧠 AI開発OS (コンテキスト圧縮・ファイル選択マトリクス・サブエージェント分離)<br>• 🌐 24ドメイン対応 (AI, IoT, 不動産, 法務, 人事, 金融 等を追加)<br>• 📦 86+ファイル生成 (docs 40種, AIルール12+, スキル8+)<br>• 🎯 41プリセット (CRM, SNS, 物流, アンケート, 求人 追加)</p>'
      :
      '<h2>Getting Started</h2><p>1. Select your skill level (Beginner/Intermediate/Pro)<br>2. Enter project name<br>3. Choose a template (optional, 41 types)<br>4. Answer Phase 1-3 questions (skip & answer later OK)<br>5. Click Generate for 86+ files<br>6. Download ZIP or print PDF</p>'+
      '<h3>UX Features</h3>'+
      '<p>• 🌱⚡🔥 Dynamic options by skill level<br>• 🎯 41 preset templates<br>• ✎ Edit answers (✎ button)<br>• ⏭️ Skip & answer later<br>• 📊 Complexity analysis (0-100 score)<br>• 📁 Project manager (Ctrl+M)<br>• 🎙️ Voice input<br>• ? Help icon per question<br>• 🔀 Drag & drop priority sort</p>'+
      '<h3>V8 Features</h3>'+
      '<p>• 📱 Mobile dev path (Expo/React Native)<br>• 🤖 AI autonomous guide (Vibe Coding/Multi-Agent)<br>• 💳 Payment/CMS/EC integration<br>• ⚡ Parallel stack comparison (7 patterns)<br>• 📊 Tech Master Table ('+_TECH_COUNT+' entries)<br>• 🗺️ Interactive roadmap (progress tracking)</p>'+
      '<h3>V8.3 Features</h3>'+
      '<p>• 📊 Mermaid diagram live rendering (ER/screen flow/Gantt)<br>• 📝 OpenAPI-compliant API specs<br>• ✅ Test case matrix (feature × normal/abnormal)<br>• 📋 Release checklist (per deploy target)<br>• 🔨 WBS 3-level + effort estimation<br>• 🎯 Prompt playbook (phase-specific AI prompts)<br>• 📎 GitHub Issues-style task breakdown<br>• 📋 Copy all files combined (for bulk AI input)</p>'+
      '<h3>V9 Features</h3>'+
      '<p>• 🧪 Quality Intelligence Engine (industry-specific QA strategies, test matrix, incident response)<br>• 🎨 Design System generation (design tokens, sequence diagrams)<br>• 🔄 Reverse Engineering (goal-driven reverse planning, 24 domains)<br>• 🏗️ Implementation Intelligence (domain-specific impl patterns, AI runbook, pseudo-code)<br>• 🧠 AI Development OS (context compression, file selection matrix, sub-agent isolation)<br>• 🌐 24 domain support (AI, IoT, Real Estate, Legal, HR, FinTech added)<br>• 📦 86+ file generation (40 docs, 12+ AI rules, 8+ skills)<br>• 🎯 41 presets (CRM, Social, Logistics, Survey, Job Board added)</p>'
    },
    {id:'pillars',title:_ja?'11の柱':'11 Pillars',body:_ja?
      '<h2>11の柱の詳細</h2><h3>① SDD統合 (5ファイル)</h3>'+
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
      '<p>生成した仕様書をAIツールに一括投入。6つのプロンプトテンプレート（レビュー・実装・テスト・リファクタ・セキュリティ・ドキュメント）。フォルダ別トークン推定・モデル適合度表示。</p>'+
      '<h3>⑨ デザインシステム (2ファイル)</h3>'+
      '<p>design_system.md (デザイントークン・色・タイポ・コンポーネントカタログ) / sequence_diagrams.md (認証・CRUD・決済フローのMermaidシーケンス図) — フレームワーク別実装ガイド。</p>'+
      '<h3>⑩ リバースエンジニアリング (2ファイル)</h3>'+
      '<p>reverse_engineering.md (ゴール定義→逆算フロー・マイルストーンGantt・リスク分析) / goal_decomposition.md (ゴールツリー・サブゴール分解・ギャップ分析・優先度マトリクス・依存関係チェーン) — 24ドメイン対応の逆算型プランニング。</p>'+
      '<h3>⑪ 実装インテリジェンス (3ファイル)</h3>'+
      '<p>implementation_playbook.md (業種別実装パターン・擬似コード・スタック固有ガイダンス・横断的関心事チェックリスト) / ai_dev_runbook.md (AI運用ワークフロー・コンテキスト管理・エラー復旧プロトコル) / impl-patterns.md (Manus Skills形式の実装スキルカタログ、ai_auto≠noneの場合) — 24ドメイン対応の実装ガイド。</p>'
      :
      '<h2>11 Pillars in Detail</h2><h3>① SDD Integration (5 files)</h3>'+
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
      '<p>Bulk-feed generated specs to AI tools. 6 prompt templates (Review, Implement, Test, Refactor, Security, Docs). Per-folder token estimation and model fit display.</p>'+
      '<h3>⑨ Design System (2 files)</h3>'+
      '<p>design_system.md (design tokens, colors, typography, component catalog) / sequence_diagrams.md (auth, CRUD, payment Mermaid sequence diagrams) — Framework-specific guides.</p>'+
      '<h3>⑩ Reverse Engineering (2 files)</h3>'+
      '<p>reverse_engineering.md (goal definition → reverse flow, milestone Gantt, risk analysis) / goal_decomposition.md (goal tree, sub-goal breakdown, gap analysis, priority matrix, dependency chain) — 24 domain-specific reverse planning.</p>'+
      '<h3>⑪ Implementation Intelligence (3 files)</h3>'+
      '<p>implementation_playbook.md (domain-specific impl patterns, pseudo-code, stack guidance, cross-cutting concerns checklist) / ai_dev_runbook.md (AI operation workflow, context management, error recovery protocol) / impl-patterns.md (implementation skills in Manus Skills format, if ai_auto≠none) — 24 domain-specific implementation guide.</p>'
    },
    {id:'export',title:_ja?'エクスポート':'Export',body:_ja?
      '<h2>エクスポート方法</h2><p><strong>ZIP</strong>: 全86+ファイルをフォルダ構造付きでZIP圧縮ダウンロード。<br><strong>PDF</strong>: Markdownファイルを整形してブラウザのPDF印刷で出力。<br><strong>URL共有</strong>: プロジェクト設定をBase64エンコードしてURL共有。<br><strong>全ファイルコピー</strong>: 全ドキュメントを1テキストに結合してクリップボードにコピー（Ctrl+Shift+C）。AIへの一括投入に最適。</p><h3>テンプレート保存</h3><p>プロジェクト設定をlocalStorageに保存し、次回起動時に読み込み可能。</p>'
      :
      '<h2>Export Methods</h2><p><strong>ZIP</strong>: Download all 86+ files as a ZIP with folder structure.<br><strong>PDF</strong>: Format Markdown files and print via browser PDF.<br><strong>URL Sharing</strong>: Base64-encode project settings and share via URL.<br><strong>Copy All Files</strong>: Combine all documents into one text and copy to clipboard (Ctrl+Shift+C). Ideal for bulk AI input.</p><h3>Template Save</h3><p>Save project settings to localStorage and load them on next launch.</p>'
    },
    {id:'guide',title:_ja?'🚀 活用ガイド':'🚀 Usage Guide',body:_ja?
      '<h2>🚀 生成ファイル活用ガイド</h2>'+
      '<p>DevForge v9 は世界で唯一の<strong>仕様駆動AIプロジェクトジェネレーター</strong>です。他のツールが「コード」を生成するのに対し、DevForge は「開発の知性」── 設計・環境・ルール・学習計画を86+ファイルで生成します。</p>'+
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
      '<p><strong>6工程自動パイプライン:</strong> 柱⑧の6テンプレートを順番実行 → 📋仕様レビュー → 🔨実装 → 🧪テスト → ♻️リファクタ → 🔒セキュリティ → 📝ドキュメント更新。仕様書が全工程の入力。</p>'+
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
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 レベル別ガイドを表示</button></p>'
      :
      '<h2>🚀 Generated Files Usage Guide</h2>'+
      '<p>DevForge v9 is the world\'s only <strong>spec-driven AI project generator</strong>. While other tools generate code, DevForge generates "development intelligence" — design, environment, rules, and learning plans through 86+ files.</p>'+
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
      '<p><strong>6-Stage Pipeline:</strong> Pillar ⑧ templates in sequence → 📋Review → 🔨Implement → 🧪Test → ♻️Refactor → 🔒Security → 📝Docs update.</p>'+
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
      '<p class="guide-action-p"><button class="btn btn-p btn-sm" onclick="closeManual();showPostGenGuide(true)">🚀 Show Level Guide</button></p>'
    },
    {id:'techdb',title:_ja?'技術DB':'Tech DB',body:_ja?
      '<h2>技術マスターテーブル</h2><p>'+_TECH_COUNT+'テクノロジーを16カテゴリに分類。Context Dashboardから閲覧可能。</p><h3>カテゴリ一覧</h3><p>言語 / フロントエンド / モバイル / バックエンド / BaaS / 決済・CMS・EC / DevOps / AIツール / AI自律 / 手法 / テスト / API / ビルド / データ / セキュリティ</p><h3>フィルタ機能</h3><p>カテゴリ / 必須度 / キーワード検索で絞り込み可能。</p>'
      :
      '<h2>Tech Master Table</h2><p>'+_TECH_COUNT+' technologies classified into 16 categories. Browse from Context Dashboard.</p><h3>Categories</h3><p>Languages / Frontend / Mobile / Backend / BaaS / Payment・CMS・EC / DevOps / AI Tools / AI Autonomous / Methodologies / Testing / API / Build / Data / Security</p><h3>Filter</h3><p>Filter by category, requirement level, or keyword search.</p>'
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
      '<p>生成される86+ファイルは<strong>設計ドキュメント</strong>（SDD仕様書・DevContainer設定・AIルール等）です。npm installで即座に動くアプリケーションコードではありません。Claude Code / Cursor等のAIツールに入力して実コードを生成する運用が前提です。</p>'+
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
      '<p>86+ generated files are <strong>design documents</strong> (SDD specs, DevContainer configs, AI rules). They are not runnable app code. Feed them to AI tools like Claude Code / Cursor to generate actual code.</p>'+
      '<h3>🟡 Skill Level</h3>'+
      '<p>Changing skill level mid-project may cause inconsistencies with existing answers. <strong>Set it correctly at the start.</strong></p>'+
      '<h3>🟡 Language Switch</h3>'+
      '<p>UI language switches instantly, but <strong>generated file contents do not change</strong>. Choose the language explicitly during generation.</p>'+
      '<h3>🔵 Other</h3>'+
      '<p>・ZIP export requires JSZip via CDN (use "Copy All" Ctrl+Shift+C offline)<br>・Switch to light mode before PDF export<br>・URL sharing may truncate on SNS for complex projects</p>'
    },
    {id:'about',title:'About',body:'<h2>DevForge v9.0</h2><p>'+(_ja?'AI駆動開発 統合プラットフォーム':'AI-Driven Dev Platform')+'</p><p>Version 9.0.0 — 2026 Edition (Modular Architecture)</p><p>'+(_ja?''+_TECH_COUNT+'テクノロジー ・ 86+ファイル ・ 11の柱 ・ 41テンプレート ・ Mermaid図 ・ プロンプトプレイブック':''+_TECH_COUNT+' technologies ・ 86+ files ・ 11 pillars ・ 41 templates ・ Mermaid diagrams ・ Prompt playbook')+'</p><p>© 2026 エンジニアリングのタネ制作委員会<br>by にしあん</p>'},
  ];
  const nav=$('helpNav');
  // Keep search input, clear nav links after it
  const searchEl=$('helpSearch');
  while(nav.lastChild&&nav.lastChild!==searchEl)nav.removeChild(nav.lastChild);
  if(searchEl)searchEl.value='';
  window._manual=MANUAL;
  MANUAL.forEach(s=>{
    const a=document.createElement('a');a.textContent=s.title;a.href='#';a.dataset.id=s.id;
    a.onclick=e=>{e.preventDefault();$('helpBody').innerHTML=s.body;document.querySelectorAll('.help-nav a').forEach(x=>x.classList.remove('on'));a.classList.add('on');};
    if(s.id===(sec||'overview'))a.classList.add('on');
    nav.appendChild(a);
  });
  $('helpBody').innerHTML=MANUAL.find(s=>s.id===(sec||'overview')).body;
  trapFocus(o);
}
function filterManual(q){
  if(!window._manual)return;
  const links=document.querySelectorAll('#helpNav a');
  const term=q.toLowerCase().trim();
  if(!term){
    links.forEach(a=>a.classList.remove('dim'));
    const active=document.querySelector('#helpNav a.on');
    if(active){const s=window._manual.find(m=>m.id===active.dataset.id);if(s)$('helpBody').innerHTML=s.body;}
    return;
  }
  let firstMatch=null;
  links.forEach(a=>{
    const s=window._manual.find(m=>m.id===a.dataset.id);
    if(!s)return;
    const text=(s.title+' '+s.body.replace(/<[^>]*>/g,'')).toLowerCase();
    const match=text.includes(term);
    a.classList.toggle('dim',!match);
    if(match&&!firstMatch)firstMatch=s;
  });
  if(firstMatch){
    const re=new RegExp('('+term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','gi');
    const highlighted=firstMatch.body.replace(/>([^<]+)</g,(m,txt)=>'>'+txt.replace(re,'<mark>$1</mark>')+'<');
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

