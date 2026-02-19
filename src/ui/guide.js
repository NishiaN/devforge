/* ═══ POST-GENERATION GUIDE ═══ */
function showPostGenGuide(force){
  if(!force&&_lsGet('devforge-guide-shown'))return;
  _lsSet('devforge-guide-shown','1');
  const _ja=S.lang==='ja';
  const lv=S.answers.skill_level||'Intermediate';
  const isB=lv.includes('Beginner');const isP=lv.includes('Professional');
  const overlay=document.createElement('div');
  overlay.className='guide-overlay';
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  const level=isB?{em:'🌱',name:_ja?'Beginner':'Beginner',cls:'guide-lv-b'}:isP?{em:'⚡',name:_ja?'Professional':'Professional',cls:'guide-lv-p'}:{em:'🔥',name:_ja?'Intermediate':'Intermediate',cls:'guide-lv-i'};
  const steps=isB?(_ja?[
    ['ロードマップに従う','ダッシュボード柱⑦のロードマップUIがそのまま学習計画。Layer 1から順にチェック。📖で公式ドキュメントにジャンプ。'],
    ['3ファイルだけ覚える','<code>README.md</code>(GitHub公開用) / <code>.devcontainer/</code>(開発環境一発) / <code>CLAUDE.md</code>(AIに全仕様を理解させる)'],
    ['AIに丸ごと渡す','「全ファイルコピー」(Ctrl+Shift+C)でAIに貼り付け → 仕様を把握した状態で開発スタート。'],
    ['バックアップ必須','ZIP+JSONで2重保存。localStorageのみに依存しない。📦ZIPダウンロード + 📤JSONエクスポートを必ず実行。'],
    ['生成物は設計書','134+ファイルは設計ドキュメント。AIツールに投入して実コードを生成。npm installで動くコードではない。'],
    ['AIで発想を広げる','AIランチャー柱⑧の「🎭 9人の専門家ブレスト」で、9つの視点からアイデアを生成。「平凡な答え」から脱却しましょう。'],
  ]:[
    ['Follow the Roadmap','Dashboard Pillar ⑦ is your learning plan. Check off from Layer 1. Hit 📖 for official docs.'],
    ['Remember 3 Files','<code>README.md</code>(GitHub ready) / <code>.devcontainer/</code>(instant dev env) / <code>CLAUDE.md</code>(AI understands your project)'],
    ['Feed Everything to AI','"Copy All" (Ctrl+Shift+C) → Paste into AI → Start coding with full context.'],
    ['Always Backup','ZIP+JSON dual backup. Don\'t rely only on localStorage. 📦ZIP Download + 📤JSON Export are mandatory.'],
    ['Files are Design Docs','134+ files are design documents. Feed to AI tools to generate real code. Not npm-installable code.'],
    ['Expand Ideas with AI','Use "🎭 9-Expert Brainstorm" in AI Launcher Pillar ⑧ to generate ideas from 9 perspectives. Break out of "average answers".'],
  ]):isP?(_ja?[
    ['Agent Teams並列開発','AGENTS.mdでエージェント役割定義 → Claude Code Subagents / Antigravity Manager Viewで並列実行。'],
    ['SDD仕様駆動','<code>.spec/</code>がSSoT。tasks.mdをタスクキューとしてAIに投入。verification.mdで品質判定。'],
    ['36テンプレートパイプライン','柱⑧で📋レビュー→🔨実装→🧪テスト→♻️リファクタ→🔒セキュリティ→📝ドキュメント→🛡️Ops準備。全工程自動化。'],
    ['3-layer CLAUDE.md','ルートCLAUDE.md(薄い ~1.5Kトークン) + .claude/rules/(パス別5ファイル) + .claude/settings.json でトークン最小化。'],
    ['Ops Plane統合','docs/53-55でSLO/SLI設計・Feature Flags・Circuit Breaker・12 Ops Capabilities。運用自動化。'],
    ['創造工学×AI活用','柱⑧「🎭 9人の専門家ブレスト」+「🎯 UXジャーニー設計」+「🤖 AIモデル使い分け」で創造的思考→UX設計→AI最適化の全工程をカバー。'],
  ]:[
    ['Agent Teams Parallel Dev','AGENTS.md defines roles → Run with Claude Code Subagents / Antigravity Manager View.'],
    ['SDD Spec-Driven','<code>.spec/</code> is your SSoT. Feed tasks.md as task queue. Verify with verification.md.'],
    ['36-Template Pipeline','Pillar ⑧: 📋Review → 🔨Implement → 🧪Test → ♻️Refactor → 🔒Security → 📝Docs → 🛡️Ops. Full automation.'],
    ['3-layer CLAUDE.md','Root CLAUDE.md (thin ~1.5K tokens) + .claude/rules/ (path-specific 5 files) + .claude/settings.json minimizes tokens.'],
    ['Ops Plane Integration','docs/53-55 for SLO/SLI design, Feature Flags, Circuit Breaker, 12 Ops Capabilities. Ops automation.'],
    ['Creative Eng × AI','Pillar ⑧ "🎭 9-Expert Brainstorm" + "🎯 UX Journey Design" + "🤖 AI Model Selection" covers the full pipeline: creative thinking → UX design → AI optimization.'],
  ]):(_ja?[
    ['SDD仕様駆動開発','<code>.spec/</code>がSSoT。AIへの指示は「tasks.mdの○○を実装して、specification.mdに従って」で完結。'],
    ['マルチAIツール統一','柱④の10+ファイルでCursor/Claude Code/Copilot/Windsurf/Cline/Gemini全対応。フォルダに置くだけ。'],
    ['MCP拡張','mcp-config.jsonをプロジェクトルートに配置 → AIがcontext7/filesystem/playwright等を即利用。'],
    ['セキュリティ＆Ops参照','docs/43-47セキュリティインテリジェンス（OWASP・STRIDE・コンプライアンス）、docs/53-55 Ops設計書（SLO/SLI・12 Capabilities）を参照。'],
    ['.claude/rules/カスタマイズ','5つのパス別ルール(spec.md/frontend.md/backend.md/test.md/ops.md)をプロジェクトに合わせて編集。パス別自動ロード。'],
    ['9専門家でブレスト','柱⑧「🎭 9人の専門家ブレスト」で多角的アイデア生成。ビジネス・技術・ユーザー・ディスラプターの4視点で最低限チェック。'],
  ]:[
    ['SDD Spec-Driven Dev','<code>.spec/</code> is your SSoT. Tell AI: "implement X from tasks.md following specification.md".'],
    ['Multi-AI Tool Unity','Pillar ④ generates 10+ files covering Cursor/Claude Code/Copilot/Windsurf/Cline/Gemini. Just drop in.'],
    ['MCP Extension','Place mcp-config.json in root → AI instantly uses context7, filesystem, playwright MCPs.'],
    ['Security & Ops Reference','docs/43-47 Security Intelligence (OWASP, STRIDE, Compliance), docs/53-55 Ops docs (SLO/SLI, 12 Capabilities).'],
    ['.claude/rules/ Customization','Edit 5 path-specific rules (spec.md/frontend.md/backend.md/test.md/ops.md) for your project. Auto-loaded by path.'],
    ['9-Expert Brainstorm','Use Pillar ⑧ "🎭 9-Expert Brainstorm" for multi-perspective ideas. Check at minimum 4 viewpoints: Business, Technical, User, and Disruptor.'],
  ]);
  // Lv6 community sharing step — visible for Evangelists only
  if(S.skillLv>=6){
    steps.push([
      _ja?'📢 コミュニティで共有':'📢 Share with Community',
      _ja?'生成した設計書をコミュニティで共有しましょう。URLコピーボタンで簡単に共有できます。あなたの知見が次の開発者を助けます。<button class="btn btn-xs btn-s" onclick="shareURL()" style="margin-top:6px;">URLをコピーして共有</button>':'Share your generated specs with the community. Use the URL copy button for easy sharing. Your insights help the next developer.<button class="btn btn-xs btn-s" onclick="shareURL()" style="margin-top:6px;">Copy URL &amp; Share</button>'
    ]);
  }
  const lvKey=isB?'b':isP?'p':'i';
  const prog=_jp(_lsGet('devforge-guide-prog'),{});
  const stepsHtml=steps.map((s,i)=>{
    const done=prog[lvKey+i];
    return `<div class="guide-step${done?' guide-step-done':''}" data-gi="${lvKey}${i}"><label class="guide-ck"><input type="checkbox" ${done?'checked':''} onchange="toggleGuideStep('${lvKey}${i}',this.checked,this.closest('.guide-step'))"><span class="guide-ckbox">${done?'✓':''}</span></label><div class="guide-step-num ${level.cls}">${i+1}</div><div><div class="guide-step-title">${s[0]}</div><div class="guide-step-desc">${s[1]}</div></div></div>`;
  }).join('');
  const doneCount=steps.filter((_,i)=>prog[lvKey+i]).length;
  const progPct=Math.round(doneCount/steps.length*100);
  const progBar=`<div class="guide-prog"><div class="guide-prog-bar" role="progressbar" aria-valuenow="${progPct}" aria-valuemin="0" aria-valuemax="100"><div class="guide-prog-fill" style="width:${progPct}%"></div></div><span class="guide-prog-txt">${doneCount}/${steps.length}</span></div>`;
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',_ja?'次にやることガイド':'Next Steps Guide');
  overlay.innerHTML=`<div class="guide-modal">
    <div class="guide-header">
      <span class="guide-em">${level.em}</span>
      <div>
        <div class="guide-title">${_ja?'生成完了！次にやること':'Generation Complete! Next Steps'}</div>
        <div class="guide-sub ${level.cls}">${level.name} ${_ja?'向けガイド':'Guide'}</div>
      </div>
      <button class="guide-close" aria-label="${_ja?'閉じる':'Close'}" onclick="this.closest('.guide-overlay').remove()">✕</button>
    </div>
    <div class="guide-badge">${_ja?'世界で唯一の仕様駆動AIプロジェクトジェネレーター':'The world\'s only spec-driven AI project generator'}</div>
    ${progBar}
    <div class="guide-steps">${stepsHtml}</div>
    <div class="guide-actions">
      <button class="btn btn-s btn-sm" onclick="window.open('devforge-v9-usage-guide.html','_blank','noopener')">${_ja?'📖 活用ガイド（別ページ）':'📖 Usage Guide (Full)'}</button>
      <button class="btn btn-s btn-sm" onclick="window.open('tech-selection-guide.html','_blank','noopener')">${_ja?'📊 技術選定ガイド':'📊 Tech Selection Guide'}</button>
      <button class="btn btn-s btn-sm" onclick="this.closest('.guide-overlay').remove();showManual('guide')">${_ja?'📖 詳細ガイド':'📖 Full Guide'}</button>
      <button class="btn btn-s btn-sm" onclick="this.closest('.guide-overlay').remove();showManual('workflow')">${_ja?'📘 ワークフロー':'📘 Workflow'}</button>
      <button class="btn btn-p btn-sm" onclick="this.closest('.guide-overlay').remove()">${_ja?'✨ 始める':'✨ Let\'s Go'}</button>
    </div>
  </div>`;
  // Keyboard accessibility
  overlay.addEventListener('keydown',e=>{
    if(e.key==='Escape')overlay.remove();
    if(e.key==='Tab'){
      const focusable=overlay.querySelectorAll('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
      const first=focusable[0];const last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  document.body.appendChild(overlay);
  // Initial focus
  const closeBtn=overlay.querySelector('.guide-close');
  if(closeBtn)closeBtn.focus();
}
function toggleGuideStep(key,checked,el){
  const prog=_jp(_lsGet('devforge-guide-prog'),{});
  if(checked)prog[key]=1;else delete prog[key];
  _lsSet('devforge-guide-prog',JSON.stringify(prog));
  if(el)el.classList.toggle('guide-step-done',checked);
  if(el){const ckbox=el.querySelector('.guide-ckbox');if(ckbox)ckbox.textContent=checked?'✓':'';}
  // Update progress bar
  const overlay=el?.closest('.guide-overlay');
  if(!overlay)return;
  const total=overlay.querySelectorAll('.guide-step').length;
  const done=overlay.querySelectorAll('.guide-step-done').length;
  const fill=overlay.querySelector('.guide-prog-fill');
  const txt=overlay.querySelector('.guide-prog-txt');
  if(fill)fill.style.width=Math.round(done/total*100)+'%';
  if(txt)txt.textContent=done+'/'+total;
}
