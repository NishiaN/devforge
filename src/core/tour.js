/* ═══ TOUR — Step-card interactive walkthrough ═══ */
function _getTourSteps(){
  const _ja=S.lang==='ja';
  var steps=[
  {title:_ja?'🌱 スキルレベル':'🌱 Skill Level',desc:_ja?
    'Beginner / Intermediate / Pro の3段階。<br>💡 Beginner: Phase 2（技術質問）を自動スキップ＆⭐推奨技術をハイライト。<br>💡 Pro: 企業向けドキュメント・高度な監査ログ・RFC 2119セキュリティ分析を追加生成。<br>設定後もいつでも変更可能。変更時は回答が一部リセットされる場合があります。':
    'Three tiers: Beginner / Intermediate / Pro.<br>💡 Beginner: Phase 2 (tech questions) auto-skipped & ⭐ recommended tech highlighted.<br>💡 Pro: Adds enterprise docs, advanced audit logs, RFC 2119 security analysis.<br>You can change level anytime — some answers may reset on change.'},
  {title:_ja?'📝 テンプレート':'📝 Templates',desc:_ja?
    '📦 標準257種 ＋ 🎓 分野別602種のプリセットを選択できます。<br>💡 「モード切替」で標準↔分野を切り替え。⚔️ 比較ボタンで2プリセットを並べて比較。<br>💡 「おすすめ」フィルターで選択肢を絞り込み。選ぶと25項目の回答が自動入力。<br>間違えて選んだ場合は Ctrl+Z（Cmd+Z）で直前のプリセット適用を取り消せます。':
    '📦 257 standard + 🎓 602 field presets available.<br>💡 Use "Mode Toggle" to switch standard ↔ field. ⚔️ Compare button shows 2 presets side-by-side.<br>💡 "Recommended" filter narrows choices. Selecting auto-fills 25 answers.<br>Changed your mind? Ctrl+Z (Cmd+Z) undoes the last preset application.'},
  {title:_ja?'💬 質問フロー':'💬 Q&A Flow',desc:_ja?
    'Phase 1（ビジネス）→ Phase 2（技術スタック）→ Phase 3（開発方針）の3段階。<br>💡 Enter キーで送信。「あとで」ボタンでスキップも可。<br>💡 互換性チェックはリアルタイムに自動実行。矛盾があれば赤いアラートで通知。<br>Lv2以上では全ERROR解消まで次フェーズに進めない保護モード（ガードレール）が有効。':
    'Three phases: Phase 1 (Business) → Phase 2 (Tech stack) → Phase 3 (Dev policy).<br>💡 Press Enter to submit. Use "Skip" to answer later.<br>💡 Compatibility checks run automatically in real time — red alerts for conflicts.<br>Lv2+ enables guardrail mode: must resolve all ERRORs before proceeding.'},
  {title:_ja?'✎ 回答編集':'✎ Edit Answers',desc:_ja?
    '送信済みの回答に表示される ✎ ボタンで修正できます。<br>💡 編集後は互換性チェックが自動再実行されます。<br>💡 Phase 1（ビジネス要件）を変更すると、Phase 2・3の技術選択に連鎖影響が出る場合があります。<br>特にドメイン（目的文）変更はAPIルール・エンティティ構成に大きな影響を与えます。':
    'Click the ✎ button on submitted answers to edit.<br>💡 Compatibility checks re-run automatically after edits.<br>💡 Changing Phase 1 (business requirements) can cascade to Phase 2 & 3 tech choices.<br>Especially, changing the domain (purpose text) heavily affects API rules & entity structure.'},
  {title:_ja?'📦 225+ファイル生成':'📦 225+ File Generation',desc:_ja?
    '全質問回答後、28の柱で225+ファイルを自動生成。<br>💡 生成内訳: .spec/（仕様書5点）/ docs/（134ドキュメント）/ .claude/（AIエージェント設定）/ .github/（CI/CDワークフロー）/ db/（シードデータ）など。<br>💡 ピラータブの 🔄 ボタンで個別ピラーのみ再生成可能。回答を微調整したあとの部分更新に便利。':
    'All answers collected → 225+ files auto-generate across 28 pillars.<br>💡 Breakdown: .spec/ (5 specs) / docs/ (134 docs) / .claude/ (AI agent configs) / .github/ (CI/CD) / db/ (seed data) & more.<br>💡 Click 🔄 on any pillar tab to regenerate just that pillar — perfect for partial updates after tweaking answers.'},
  {title:_ja?'⚡ 並列探索':'⚡ Parallel Explorer',desc:_ja?
    'Pillar ⑤ では7つのスタック構成を一画面で比較できます。<br>💡 各スタックにはPros/Consと採用理由が表示され、あなたの回答に基づいたおすすめランキングも確認できます。<br>💡 フロントエンド・バックエンド・DB・インフラなど層別にフィルタリング可能。技術選定の判断材料として活用してください。':
    'Pillar ⑤ lets you compare 7 stack configurations side-by-side.<br>💡 Each stack shows Pros/Cons and reasoning, plus a recommendation ranking based on your answers.<br>💡 Filter by layer: frontend / backend / DB / infra. Use it as input for your tech selection decisions.'},
  {title:'📊 Dashboard',desc:_ja?
    'Pillar ⑥ ではプロジェクトのコンテキスト可視化と技術DBを閲覧できます。<br>💡 TechDB: '+_TECH_COUNT+'以上の技術エントリーを15カテゴリに分類。フリーワード＋カテゴリでフィルタ可能。<br>💡 ドメイン・スコープ・ペルソナなどを一画面でレビュー。仕様書作成前の確認に最適。':
    'Pillar ⑥: Project context visualization + tech DB explorer.<br>💡 TechDB: '+_TECH_COUNT+'+ entries across 15 categories. Filter by free text + category.<br>💡 Review domain, scope, personas on one screen — ideal before writing specs.'},
  {title:_ja?'🤖 AIランチャー':'🤖 AI Launcher',desc:_ja?
    'Pillar ⑧ の AIランチャーで仕様書をAIツールにワンクリック投入。<br>💡 109テンプレートをコード生成・レビュー・ドキュメント・ブレストなどのカテゴリで整理。<br>💡 あなたのスキルレベルに合わせたテンプレートを優先表示（スキル適応レコメンド）。<br>💡 トークン推定・モデル選択・出力プレビューも搭載。Claude / GPT-4o / Gemini に対応。':
    'Pillar ⑧: Feed specs to AI tools in one click from AI Launcher.<br>💡 109 prompt templates organized by category: code-gen, review, docs, brainstorm & more.<br>💡 Templates are prioritized by your skill level (skill-adaptive recommendation).<br>💡 Token estimation, model selection, and output preview built in. Works with Claude / GPT-4o / Gemini.'},
  {title:_ja?'🎭 9人の専門家ブレスト':'🎭 9-Expert Brainstorm',desc:_ja?
    'AIランチャーの「🎭 9人の専門家ブレスト」テンプレートで多角的なアイデア発想。<br>💡 9つの視点の例: CTO（技術負債）/ PM（優先順位）/ UXデザイナー（体験摩擦）/ セキュリティ専門家（脅威モデル）など。<br>💡 生成仕様書を自動挿入した状態でプロンプト生成。仕様ベースの的確な質問が可能。<br>💡 各専門家の出力を連鎖させて深掘りするチェーンプロンプトも活用できます。':
    'Use "🎭 9-Expert Brainstorm" in AI Launcher for multi-perspective ideation.<br>💡 9 expert viewpoints: CTO (tech debt) / PM (priorities) / UX Designer (friction) / Security (threat model) / etc.<br>💡 Auto-inserts your generated specs into the prompt for spec-grounded questions.<br>💡 Chain prompts: use each expert\'s output to drill deeper with follow-up questions.'},
  {title:_ja?'💾 データ保存の注意':'💾 Save Your Work',desc:_ja?
    '全データはブラウザの localStorage に保存されます（上限約5MB）。<br>💡 3重バックアップを推奨: 📤 JSON エクスポート（完全な回答・ファイルセット）/ 📦 ZIP ダウンロード（生成ファイル一式）/ 🗄 IndexedDB 自動バックアップ（ブラウザ内）。<br>💡 Cmd+K（Ctrl+K）のコマンドパレットから「バックアップ一覧」で過去のスナップショットを復元できます。':
    'All data stored in browser localStorage (≈5MB limit).<br>💡 3-layer backup recommended: 📤 JSON export (full answers + file set) / 📦 ZIP download (generated files) / 🗄 IndexedDB auto-backup (in-browser).<br>💡 Cmd+K (Ctrl+K) → Command Palette → "Backup List" to restore past snapshots.'},
  {title:_ja?'⚠️ 注意事項を確認':'⚠️ Read Cautions',desc:_ja?
    'ヘルプ（F1）の「⚠️ 注意事項」タブで重要な注意点を確認してください。<br>💡 スキルレベル変更時: Lv2未満 ↔ Lv2以上 をまたぐと一部の回答がリセットされます。<br>💡 言語切替（JA↔EN）: 生成言語が変わります。生成後に切り替えると再生成が必要です。<br>💡 ストレージ上限（5MB）超過時はアラートが表示されます。定期的にJSONエクスポートしてください。':
    'Check the "⚠️ Cautions" tab in Help (F1) for important notes.<br>💡 Skill level change: Switching across Lv2 boundary may reset some answers.<br>💡 Language toggle (JA↔EN): Changes generation language. Re-generate required after switching post-generation.<br>💡 Storage limit (5MB): Alert shown when exceeded. Export JSON regularly to stay safe.'},
  ];
  // Lv0-1: essential steps only (skill, templates, Q&A, generation, save, cautions)
  if(S.skillLv<=1){var _ti=[0,1,2,4,9,10];return _ti.map(function(i){return steps[i];});}
  return steps;
}
let tourStep=-1;

function startTour(){
  const steps=_getTourSteps();
  if(steps.length===0)return;
  tourStep=0;showTourStep();
}

function showTourStep(){
  const tc=$('tourContainer');
  const steps=_getTourSteps();
  if(tourStep<0||tourStep>=steps.length){closeTour();return;}
  const step=steps[tourStep];
  const dots=steps.map((_,i)=>'<div class="tour-dot'+(i===tourStep?' on':'')+'"></div>').join('');
  const _ja=S.lang==='ja';
  const pos=(tourStep+1)+'/'+steps.length;
  tc.innerHTML='<div class="tour-card"><div class="tour-card-hd"><h4 class="tour-title">'+step.title+'</h4><span class="tour-pos">'+pos+'</span></div><p class="tour-desc">'+step.desc+'</p><div class="tour-dots">'+dots+'</div><div class="tour-acts" id="tourActs"></div></div>';
  const acts=$('tourActs');
  if(tourStep>0){const pb=document.createElement('button');pb.className='btn btn-g btn-xs';pb.textContent=t('tourPrev');pb.onclick=()=>{tourStep--;showTourStep();};acts.appendChild(pb);}
  const nb=document.createElement('button');nb.className='btn btn-p btn-xs';nb.textContent=tourStep===steps.length-1?t('tourDone'):t('tourNext');
  nb.onclick=()=>{tourStep++;showTourStep();};acts.appendChild(nb);
  // Skip button
  const sb=document.createElement('button');sb.className='btn btn-g btn-xs';sb.textContent=_ja?'終了':'Skip';sb.style.marginLeft='auto';sb.onclick=closeTour;acts.appendChild(sb);
}

function closeTour(){
  tourStep=-1;
  $('tourContainer').innerHTML='';
  _lsSet('devforge-tour-done','1');
}
