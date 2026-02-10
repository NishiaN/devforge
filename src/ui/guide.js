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
  ]:[
    ['Follow the Roadmap','Dashboard Pillar ⑦ is your learning plan. Check off from Layer 1. Hit 📖 for official docs.'],
    ['Remember 3 Files','<code>README.md</code>(GitHub ready) / <code>.devcontainer/</code>(instant dev env) / <code>CLAUDE.md</code>(AI understands your project)'],
    ['Feed Everything to AI','"Copy All" (Ctrl+Shift+C) → Paste into AI → Start coding with full context.'],
  ]):isP?(_ja?[
    ['Agent Teams並列開発','AGENTS.mdでエージェント役割定義 → Claude Code Subagents / Antigravity Manager Viewで並列実行。'],
    ['SDD仕様駆動','<code>.spec/</code>がSSoT。tasks.mdをタスクキューとしてAIに投入。verification.mdで品質判定。'],
    ['6工程パイプライン','柱⑧のランチャーで📋レビュー→🔨実装→🧪テスト→♻️リファクタ→🔒セキュリティ→📝ドキュメント。'],
  ]:[
    ['Agent Teams Parallel Dev','AGENTS.md defines roles → Run with Claude Code Subagents / Antigravity Manager View.'],
    ['SDD Spec-Driven','<code>.spec/</code> is your SSoT. Feed tasks.md as task queue. Verify with verification.md.'],
    ['6-Stage Pipeline','Pillar ⑧ launcher: 📋Review → 🔨Implement → 🧪Test → ♻️Refactor → 🔒Security → 📝Docs.'],
  ]):(_ja?[
    ['SDD仕様駆動開発','<code>.spec/</code>がSSoT。AIへの指示は「tasks.mdの○○を実装して、specification.mdに従って」で完結。'],
    ['マルチAIツール統一','柱④の10ファイルでCursor/Claude Code/Copilot/Windsurf/Cline/Gemini全対応。フォルダに置くだけ。'],
    ['MCP拡張','mcp-config.jsonをプロジェクトルートに配置 → AIがcontext7/filesystem/playwright等を即利用。'],
  ]:[
    ['SDD Spec-Driven Dev','<code>.spec/</code> is your SSoT. Tell AI: "implement X from tasks.md following specification.md".'],
    ['Multi-AI Tool Unity','Pillar ④ generates 10 files covering Cursor/Claude Code/Copilot/Windsurf/Cline/Gemini. Just drop in.'],
    ['MCP Extension','Place mcp-config.json in root → AI instantly uses context7, filesystem, playwright MCPs.'],
  ]);
  const lvKey=isB?'b':isP?'p':'i';
  const prog=JSON.parse(_lsGet('devforge-guide-prog')||'{}');
  const stepsHtml=steps.map((s,i)=>{
    const done=prog[lvKey+i];
    return `<div class="guide-step${done?' guide-step-done':''}" data-gi="${lvKey}${i}"><label class="guide-ck"><input type="checkbox" ${done?'checked':''} onchange="toggleGuideStep('${lvKey}${i}',this.checked,this.closest('.guide-step'))"><span class="guide-ckbox">${done?'✓':''}</span></label><div class="guide-step-num ${level.cls}">${i+1}</div><div><div class="guide-step-title">${s[0]}</div><div class="guide-step-desc">${s[1]}</div></div></div>`;
  }).join('');
  const doneCount=steps.filter((_,i)=>prog[lvKey+i]).length;
  const progBar=`<div class="guide-prog"><div class="guide-prog-bar"><div class="guide-prog-fill" style="width:${Math.round(doneCount/steps.length*100)}%"></div></div><span class="guide-prog-txt">${doneCount}/${steps.length}</span></div>`;
  overlay.innerHTML=`<div class="guide-modal">
    <div class="guide-header">
      <span class="guide-em">${level.em}</span>
      <div>
        <div class="guide-title">${_ja?'生成完了！次にやること':'Generation Complete! Next Steps'}</div>
        <div class="guide-sub ${level.cls}">${level.name} ${_ja?'向けガイド':'Guide'}</div>
      </div>
      <button class="guide-close" onclick="this.closest('.guide-overlay').remove()">✕</button>
    </div>
    <div class="guide-badge">${_ja?'世界で唯一の仕様駆動AIプロジェクトジェネレーター':'The world\'s only spec-driven AI project generator'}</div>
    ${progBar}
    <div class="guide-steps">${stepsHtml}</div>
    <div class="guide-actions">
      <button class="btn btn-s btn-sm" onclick="this.closest('.guide-overlay').remove();showManual('guide')">${_ja?'📖 詳細ガイドを読む':'📖 Full Guide'}</button>
      <button class="btn btn-p btn-sm" onclick="this.closest('.guide-overlay').remove()">${_ja?'✨ 始める':'✨ Let\'s Go'}</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);
}
function toggleGuideStep(key,checked,el){
  const prog=JSON.parse(_lsGet('devforge-guide-prog')||'{}');
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
