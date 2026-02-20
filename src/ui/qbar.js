/* ═══ QUICK ACTION BAR (HCD-optimized) ═══ */
// Context-aware action groups, FAB minimize/restore, keyboard navigation, ARIA support

function createQbar(){
  if($('qbar'))return; // Already exists
  const ws=$('ws');if(!ws)return;

  const _ja=S.lang==='ja';
  const isPreview=!!S.previewFile;
  const hasFiles=Object.keys(S.files).length>0;
  const skill=S.skill||'intermediate';

  const qb=document.createElement('div');
  qb.id='qbar';
  qb.className='qbar';
  qb.setAttribute('role','toolbar');
  qb.setAttribute('aria-label',_ja?'クイックアクション':'Quick Actions');

  let html='';

  // Export group
  if(hasFiles){
    html+=`<div class="qbar-group" data-group="export">`;
    html+=`<button class="qbar-action qbar-primary" onclick="exportZIP()" title="${_ja?'ZIP形式でダウンロード (Ctrl+E)':'Download as ZIP (Ctrl+E)'}" aria-label="${_ja?'ZIPエクスポート':'Export ZIP'}">
      <span class="qbar-icon">📦</span><span class="qbar-label">ZIP</span>
      <span class="qbar-kb">Ctrl+E</span>
    </button>`;
    html+=`<button class="qbar-action" onclick="copyAllFiles()" title="${_ja?'全ファイルをクリップボードにコピー (Ctrl+Shift+C)':'Copy all files to clipboard (Ctrl+Shift+C)'}" aria-label="${_ja?'全コピー':'Copy All'}">
      <span class="qbar-icon">📋</span><span class="qbar-label">${_ja?'全コピー':'Copy All'}</span>
      <span class="qbar-kb">Ctrl+⇧+C</span>
    </button>`;

    // AI MD / PDF for intermediate+
    if(skill!=='beginner'){
      html+=`<button class="qbar-action" onclick="showAIMarkdown()" title="${_ja?'AI向けマークダウン生成':'Generate AI-optimized Markdown'}" aria-label="AI MD">
        <span class="qbar-icon">🤖</span><span class="qbar-label">AI MD</span>
      </button>`;
    }
    html+=`</div>`;
    html+=`<span class="qbar-sep" role="separator"></span>`;
  }

  // Navigate group
  if(hasFiles){
    html+=`<div class="qbar-group" data-group="navigate">`;
    html+=`<button class="qbar-action" onclick="S.pillar=5;showFileTree();updateQbar()" title="${_ja?'ダッシュボード表示 (Ctrl+5)':'Show Dashboard (Ctrl+5)'}" aria-label="${_ja?'ダッシュボード':'Dashboard'}">
      <span class="qbar-icon">📊</span><span class="qbar-label">${_ja?'Dashboard':'Dashboard'}</span>
      <span class="qbar-kb">Ctrl+5</span>
    </button>`;
    html+=`<button class="qbar-action" onclick="S.pillar=6;showRoadmapUI();updateQbar()" title="${_ja?'ロードマップ表示 (Ctrl+6)':'Show Roadmap (Ctrl+6)'}" aria-label="${_ja?'ロードマップ':'Roadmap'}">
      <span class="qbar-icon">🗺️</span><span class="qbar-label">${_ja?'Roadmap':'Roadmap'}</span>
      <span class="qbar-kb">Ctrl+6</span>
    </button>`;

    // AI Launcher for all skill levels; Explorer for intermediate+
    html+=`<button class="qbar-action" onclick="showAILauncher()" title="${_ja?'AIプロンプト起動 (Ctrl+7)':'Launch AI Prompts (Ctrl+7)'}" aria-label="${_ja?'AI起動':'AI Launcher'}">
      <span class="qbar-icon">🚀</span><span class="qbar-label">${_ja?'AI起動':'Launcher'}</span>
      <span class="qbar-kb">Ctrl+7</span>
    </button>`;
    if(skill!=='beginner'){
      html+=`<button class="qbar-action" onclick="showExplorer()" title="${_ja?'エクスプローラー (Ctrl+4)':'Explorer (Ctrl+4)'}" aria-label="Explorer">
        <span class="qbar-icon">🗂️</span><span class="qbar-label">Explorer</span>
        <span class="qbar-kb">Ctrl+4</span>
      </button>`;
    }
    html+=`</div>`;
    html+=`<span class="qbar-sep" role="separator"></span>`;
  }

  // Create group
  if(hasFiles){
    html+=`<div class="qbar-group" data-group="create">`;
    html+=`<button class="qbar-action" onclick="doGenerate()" title="${_ja?'再生成':'Regenerate'}" aria-label="${_ja?'再生成':'Regenerate'}">
      <span class="qbar-icon">🔄</span><span class="qbar-label">${_ja?'再生成':'Regen'}</span>
    </button>`;
    html+=`<button class="qbar-action" onclick="shareURL()" title="${_ja?'共有URL生成':'Share URL'}" aria-label="${_ja?'共有':'Share'}">
      <span class="qbar-icon">🔗</span><span class="qbar-label">${_ja?'共有':'Share'}</span>
    </button>`;
    html+=`</div>`;
    html+=`<span class="qbar-sep" role="separator"></span>`;
  }

  // File group (only when previewing a file)
  if(isPreview){
    html+=`<div class="qbar-group" data-group="file">`;
    html+=`<button class="qbar-action" onclick="if(S.previewFile)openEditor(S.previewFile)" title="${_ja?'ファイル編集':'Edit File'}" aria-label="${_ja?'編集':'Edit'}">
      <span class="qbar-icon">✏️</span><span class="qbar-label">${_ja?'編集':'Edit'}</span>
    </button>`;
    html+=`<button class="qbar-action" onclick="if(S.previewFile)copyFile(S.previewFile)" title="${_ja?'ファイルをコピー':'Copy File'}" aria-label="${_ja?'コピー':'Copy'}">
      <span class="qbar-icon">📄</span><span class="qbar-label">${_ja?'コピー':'Copy'}</span>
    </button>`;
    html+=`</div>`;
    html+=`<span class="qbar-sep" role="separator"></span>`;
  }

  // Minimize button (converts to FAB)
  html+=`<button class="qbar-minimize" onclick="dismissQbar()" title="${_ja?'最小化':'Minimize'}" aria-label="${_ja?'最小化':'Minimize'}">
    <span class="qbar-icon">−</span>
  </button>`;

  qb.innerHTML=html;

  // Keyboard navigation
  qb.addEventListener('keydown',(e)=>{
    const actions=Array.from(qb.querySelectorAll('.qbar-action, .qbar-minimize'));
    const idx=actions.indexOf(e.target);
    if(idx<0)return;

    if(e.key==='ArrowRight'){
      e.preventDefault();
      const next=actions[idx+1]||actions[0];
      next.focus();
    }else if(e.key==='ArrowLeft'){
      e.preventDefault();
      const prev=actions[idx-1]||actions[actions.length-1];
      prev.focus();
    }else if(e.key==='Home'){
      e.preventDefault();
      actions[0].focus();
    }else if(e.key==='End'){
      e.preventDefault();
      actions[actions.length-1].focus();
    }
  });

  ws.appendChild(qb);

  // Restore from minimized state
  if(!S.qbarDismissed){
    qb.classList.add('qbar-visible');
  }
}

function updateQbar(){
  const qb=$('qbar');
  if(!qb)return;
  qb.remove();
  createQbar();
}

function dismissQbar(){
  const qb=$('qbar');
  if(!qb)return;

  qb.classList.remove('qbar-visible');
  qb.classList.add('qbar-hiding');

  setTimeout(()=>{
    qb.remove();
    showQbarFAB();
    S.qbarDismissed=true;
    save();
  },200);
}

function showQbarFAB(){
  if($('qbar-fab'))return;

  const _ja=S.lang==='ja';
  const fab=document.createElement('button');
  fab.id='qbar-fab';
  fab.className='qbar-fab';
  fab.setAttribute('aria-label',_ja?'クイックアクションを復元':'Restore Quick Actions');
  fab.title=_ja?'クイックアクションを復元':'Restore Quick Actions';
  fab.innerHTML=`<span class="qbar-icon">⚡</span>`;
  fab.onclick=restoreQbar;

  const ws=$('ws');
  if(ws)ws.appendChild(fab);
}

function restoreQbar(){
  const fab=$('qbar-fab');
  if(fab)fab.remove();

  S.qbarDismissed=false;
  save();
  createQbar();

  const qb=$('qbar');
  if(qb){
    qb.classList.add('qbar-visible');
  }
}

// Helper: Show AI Markdown export
function showAIMarkdown(){
  const _ja=S.lang==='ja';
  // Generate AI-optimized markdown combining all key files
  let md='# '+S.projectName+' — AI Context\n\n';

  const keyFiles=['.spec/constitution.md','.spec/specification.md','CLAUDE.md','docs/01_architecture.md','docs/02_er.md','docs/03_api.md'];
  keyFiles.forEach(path=>{
    if(S.files[path]){
      md+='## '+path+'\n\n';
      md+='```\n'+S.files[path]+'\n```\n\n';
    }
  });

  const blob=new Blob([md],{type:'text/markdown'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=fileSlug(S.projectName)+'-ai-context.md';
  a.click();
  URL.revokeObjectURL(url);

  toast(_ja?'AI向けマークダウンをダウンロードしました':'Downloaded AI-optimized Markdown');
}

// Helper: Copy single file
function copyFile(path){
  const _ja=S.lang==='ja';
  if(!S.files[path])return;

  navigator.clipboard.writeText(S.files[path]).then(()=>{
    toast(_ja?`${path} をコピーしました`:`Copied ${path}`);
  }).catch(()=>{
    toast(_ja?'コピー失敗':'Copy failed');
  });
}
