/* ═══ COMMAND PALETTE (Ctrl+P) ═══ */
// Unified command + file search with keyboard navigation

let _cpSelectedIdx=0;
let _cpResults=[];

function showCommandPalette(){
  if($('cmdpalette'))return; // Already open

  const _ja=S.lang==='ja';
  const overlay=document.createElement('div');
  overlay.id='cmdpalette';
  overlay.className='cmdpalette-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',_ja?'コマンドパレット':'Command Palette');

  overlay.innerHTML=`
    <div class="cmdpalette-box">
      <div class="cmdpalette-input-wrap">
        <span class="cmdpalette-icon">⌘</span>
        <input type="text" id="cmdpaletteInput" class="cmdpalette-input" placeholder="${_ja?'コマンド・ファイル検索 / > で本文検索':'Search commands, files / > for content search'}" autocomplete="off" />
      </div>
      <div id="cmdpaletteResults" class="cmdpalette-results" role="listbox"></div>
    </div>
  `;

  document.body.appendChild(overlay);
  pushModal(overlay,closeCmdPalette);

  const input=$('cmdpaletteInput');
  const resultsDiv=$('cmdpaletteResults');

  // Focus input
  setTimeout(()=>input.focus(),50);

  // Initial results (all commands)
  updateCmdResults('',_ja,input,resultsDiv);

  // Input handler
  input.addEventListener('input',()=>{
    updateCmdResults(input.value.trim().toLowerCase(),_ja,input,resultsDiv);
  });

  // Keyboard navigation
  input.addEventListener('keydown',(e)=>{
    if(e.key==='ArrowDown'){
      e.preventDefault();
      _cpSelectedIdx=Math.min(_cpSelectedIdx+1,_cpResults.length-1);
      highlightCmdResult(resultsDiv);
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      _cpSelectedIdx=Math.max(_cpSelectedIdx-1,0);
      highlightCmdResult(resultsDiv);
    }else if(e.key==='Enter'){
      e.preventDefault();
      if(_cpResults[_cpSelectedIdx]){
        executeCmdResult(_cpResults[_cpSelectedIdx]);
        closeCmdPalette();
      }
    }else if(e.key==='Escape'){
      e.preventDefault();
      closeCmdPalette();
    }
  });

  // Close on overlay click
  overlay.addEventListener('click',(e)=>{
    if(e.target===overlay)closeCmdPalette();
  });

  // Focus trap
  trapFocus(overlay);
}

function updateCmdResults(query,_ja,input,resultsDiv){
  _cpSelectedIdx=0;
  _cpResults=[];

  const hasFiles=Object.keys(S.files).length>0;

  // Build command list
  const commands=[
    // Export group
    ...(hasFiles?[
      {cat:'export',icon:'📦',label:_ja?'ZIPエクスポート':'Export ZIP',labelEn:'Export ZIP',kb:'Ctrl+E',action:()=>exportZIP()},
      {cat:'export',icon:'📋',label:_ja?'全ファイルコピー':'Copy All Files',labelEn:'Copy All Files',kb:'Ctrl+Shift+C',action:()=>copyAllFiles()},
      {cat:'export',icon:'📤',label:_ja?'JSONエクスポート':'Export JSON',labelEn:'Export JSON',action:()=>exportProject()},
      {cat:'export',icon:'🤖',label:_ja?'AI向けマークダウン':'AI Markdown',labelEn:'AI Markdown',action:()=>showAIMarkdown()},
      {cat:'export',icon:'💾',label:_ja?'回答JSON保存':'Save Answers JSON',labelEn:'Save Answers JSON',action:()=>exportAnswersJSON()},
      {cat:'export',icon:'📂',label:_ja?'回答JSON読込':'Load Answers JSON',labelEn:'Load Answers JSON',action:()=>importAnswersJSON()},
    ]:[]),
    // Navigate group
    ...(hasFiles?[
      {cat:'navigate',icon:'📊',label:_ja?'ダッシュボード':'Dashboard',labelEn:'Dashboard',kb:'Ctrl+5',action:()=>{S.pillar=5;save();showFileTree();}},
      {cat:'navigate',icon:'🗺️',label:_ja?'ロードマップ':'Roadmap',labelEn:'Roadmap',kb:'Ctrl+6',action:()=>{S.pillar=6;save();showRoadmapUI();}},
      {cat:'navigate',icon:'🚀',label:_ja?'AIプロンプト起動':'AI Launcher',labelEn:'AI Launcher',kb:'Ctrl+7',action:()=>showAILauncher()},
      {cat:'navigate',icon:'🗂️',label:_ja?'エクスプローラー':'Explorer',labelEn:'Explorer',kb:'Ctrl+4',action:()=>showExplorer()},
    ]:[]),
    // App group
    {cat:'app',icon:'💡',label:_ja?'ヘルプ':'Help',labelEn:'Help',kb:'F1',action:()=>showManual()},
    {cat:'app',icon:'⌨️',label:_ja?'ショートカット一覧':'Shortcuts',labelEn:'Shortcuts',kb:'Ctrl+K',action:()=>showKB()},
    {cat:'app',icon:'🌓',label:_ja?'テーマ切替':'Toggle Theme',labelEn:'Toggle Theme',kb:'Ctrl+T',action:()=>toggleTheme()},
    {cat:'app',icon:'🌐',label:_ja?'言語切替':'Toggle Language',labelEn:'Toggle Language',kb:'Ctrl+L',action:()=>toggleLang()},
    {cat:'app',icon:'📁',label:_ja?'プロジェクト管理':'Project Manager',labelEn:'Project Manager',kb:'Ctrl+M',action:()=>showPM()},
    {cat:'app',icon:'🗑️',label:_ja?'履歴クリア':'Clear History',labelEn:'Clear History',action:()=>clearFileHistory()},
    {cat:'app',icon:'🔁',label:_ja?'バックアップから復元':'Restore from Backup',labelEn:'Restore from Backup',action:()=>showIDBRestoreUI()},
    ...(S.answersSnapshot?[{cat:'app',icon:'↩️',label:_ja?'プリセット適用を取り消し':'Undo Preset Application',labelEn:'Undo Preset Application',action:()=>undoPreset()}]:[]),
    // Create group
    ...(hasFiles?[
      {cat:'create',icon:'🔄',label:_ja?'再生成':'Regenerate',labelEn:'Regenerate',action:()=>doGenerate()},
      {cat:'create',icon:'🔗',label:_ja?'共有URL生成':'Share URL',labelEn:'Share URL',action:()=>shareURL()},
      {cat:'create',icon:'🗑️',label:_ja?'ファイルクリア':'Clear Files',labelEn:'Clear Files',action:()=>clearFiles()},
    ]:[]),
  ];

  // Filter commands
  let filtered=commands.filter(c=>{
    const lbl=(_ja?c.label:c.labelEn||c.label).toLowerCase();
    return lbl.includes(query);
  });

  // File path search or content search (> prefix)
  let files=[];
  let contentMatches=[];
  const isContentSearch=query.startsWith('>');
  if(hasFiles&&query.length>0){
    if(isContentSearch){
      const cq=query.slice(1).trim().toLowerCase();
      if(cq.length>1){
        Object.entries(S.files).forEach(([path,content])=>{
          if(typeof content!=='string')return;
          const ci=content.toLowerCase().indexOf(cq);
          if(ci!==-1){
            const st=Math.max(0,ci-25);
            const en=Math.min(content.length,ci+60);
            const snip=(st>0?'…':'')+content.slice(st,en).replace(/\n/g,' ')+(en<content.length?'…':'');
            contentMatches.push({path,snip});
          }
        });
        contentMatches=contentMatches.slice(0,15);
      }
    }else{
      files=Object.keys(S.files).filter(path=>path.toLowerCase().includes(query)).slice(0,20);
    }
  }

  // Combine results
  _cpResults=[
    ...filtered,
    ...files.map(path=>({cat:'file',icon:'📄',label:path,action:()=>previewFile(path)})),
    ...contentMatches.map(m=>({cat:'content',icon:'🔍',label:m.path,sub:m.snip,action:()=>previewFile(m.path)}))
  ];

  // Render
  let html='';
  if(isContentSearch&&query.slice(1).trim().length<=1){
    html=`<div class="cmdpalette-empty">${_ja?'「> キーワード」で本文検索':'Type \"> keyword\" to search file content'}</div>`;
  }else if(_cpResults.length===0){
    html=`<div class="cmdpalette-empty">${_ja?'一致する結果がありません':'No results found'}</div>`;
  }else{
    _cpResults.forEach((r,i)=>{
      const catLabel=getCatLabel(r.cat,_ja);
      const selected=i===_cpSelectedIdx?' cmdpalette-item-selected':'';
      const aria=i===_cpSelectedIdx?' aria-selected="true"':' aria-selected="false"';
      html+=`<div class="cmdpalette-item${selected}" role="option"${aria} data-idx="${i}">`;
      html+=`<span class="cmdpalette-item-icon">${r.icon}</span>`;
      html+=`<span class="cmdpalette-item-label">${esc(r.label)}</span>`;
      if(r.sub)html+=`<span class="cmdpalette-item-sub">${esc(r.sub)}</span>`;
      html+=`<span class="cmdpalette-item-cat">${catLabel}</span>`;
      if(r.kb)html+=`<span class="cmdpalette-item-kb">${esc(r.kb)}</span>`;
      html+=`</div>`;
    });
  }

  resultsDiv.innerHTML=html;

  // Click handlers
  resultsDiv.querySelectorAll('.cmdpalette-item').forEach((el,i)=>{
    el.onclick=()=>{
      executeCmdResult(_cpResults[i]);
      closeCmdPalette();
    };
  });
}

function highlightCmdResult(resultsDiv){
  resultsDiv.querySelectorAll('.cmdpalette-item').forEach((el,i)=>{
    if(i===_cpSelectedIdx){
      el.classList.add('cmdpalette-item-selected');
      el.setAttribute('aria-selected','true');
      el.scrollIntoView({block:'nearest'});
    }else{
      el.classList.remove('cmdpalette-item-selected');
      el.setAttribute('aria-selected','false');
    }
  });
}

function executeCmdResult(result){
  if(!result||!result.action)return;
  setTimeout(()=>result.action(),100); // Delay to allow modal close
}

function closeCmdPalette(){
  const cp=$('cmdpalette');
  if(cp){
    removeModal(cp);
    cp.remove();
    releaseFocus(cp);
  }
  _cpSelectedIdx=0;
  _cpResults=[];
}

function getCatLabel(cat,_ja){
  const labels={
    export:_ja?'エクスポート':'Export',
    navigate:_ja?'ナビゲート':'Navigate',
    app:_ja?'アプリ':'App',
    create:_ja?'作成':'Create',
    file:_ja?'ファイル':'File',
    content:_ja?'本文':'Content'
  };
  return labels[cat]||cat;
}
