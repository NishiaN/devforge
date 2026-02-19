/* ═══ SIDEBAR ═══ */
function initSidebar(){
  const sb=$('sidebar');
  if(!sb)return;
  if(!S.sidebarOpen){
    sb.classList.add('collapsed');
    const ib=$('sbIconbar');if(ib)ib.style.display='flex';
  }else{
    sb.classList.remove('collapsed');
    const ib=$('sbIconbar');if(ib)ib.style.display='none';
  }
  updateSidebarLabels();
}

function toggleSidebar(){
  S.sidebarOpen=!S.sidebarOpen;
  const sb=$('sidebar');
  const ib=$('sbIconbar');
  if(sb)sb.classList.toggle('collapsed',!S.sidebarOpen);
  if(ib)ib.style.display=S.sidebarOpen?'none':'flex';
  save();
}

function switchSidebarTab(tab){
  const spEl=$('sbProgress');
  const sfEl=$('sbFiles');
  document.querySelectorAll('.sb-tab').forEach(t=>t.classList.toggle('on',t.dataset.tab===tab));
  if(spEl)spEl.style.display=tab==='progress'?'':'none';
  if(sfEl){sfEl.style.display=tab==='files'?'':'none';if(tab==='files')renderSidebarFiles();}
}

function renderSidebarFiles(){
  const el=$('sbFiles');
  if(!el)return;
  const _ja=S.lang==='ja';
  const files=S.files||{};
  const keys=Object.keys(files);
  if(!keys.length){
    el.innerHTML='<p class="sb-empty">'+(_ja?'ファイル未生成':'No files yet')+'</p>';
    return;
  }
  let h='';
  // Beginner: show key files banner first
  if(S.skill==='beginner'){
    const keyFiles=[
      {p:'README.md',l:_ja?'README.md — プロジェクト概要':'README.md — Project overview'},
      {p:'CLAUDE.md',l:_ja?'CLAUDE.md — AIに全仕様を理解させる':'CLAUDE.md — Give AI full context'},
      {p:'.devcontainer/devcontainer.json',l:_ja?'devcontainer.json — 開発環境一発起動':'devcontainer.json — Instant dev env'},
      {p:'.spec/constitution.md',l:_ja?'constitution.md — 最初に読む原則':'constitution.md — Principles (read first)'},
    ];
    const validKeyFiles=keyFiles.filter(kf=>files[kf.p]);
    if(validKeyFiles.length){
      h+='<div class="sb-key-banner">🌱 '+(_ja?'まずこれを読もう':'Start Here')+'</div>';
      h+='<ul class="sb-key-files">';
      validKeyFiles.forEach(kf=>{
        const active=S.previewFile===kf.p;
        h+='<li class="ft-file'+(active?' active':'')+'" data-path="'+escAttr(kf.p)+'"><a href="#" onclick="previewFile(\''+escAttr(kf.p)+'\');return false;" title="'+escAttr(kf.p)+'">'+esc(kf.l)+'</a></li>';
      });
      h+='</ul>';
    }
  }
  h+='<div class="sb-file-search"><input type="text" id="sbSearchInput" placeholder="'+(_ja?'🔍 検索':'🔍 Search')+'" oninput="filterSidebarTree(this.value)" aria-label="'+(_ja?'ファイル検索':'Search files')+'"></div>';
  h+='<ul class="sb-file-tree" id="sbFileList">';
  // Pinned
  const pinned=S.pinnedFiles||[];
  const validPinned=pinned.filter(p=>files[p]);
  if(validPinned.length){
    h+='<li class="ft-section-header">📌 '+(_ja?'ピン留め':'Pinned')+'</li>';
    validPinned.forEach(p=>{
      const active=S.previewFile===p;
      h+='<li class="ft-file'+(active?' active':'')+'" data-path="'+escAttr(p)+'"><a href="#" onclick="previewFile(\''+escAttr(p)+'\');return false;" title="'+escAttr(p)+'">'+esc(p.split('/').pop())+'</a></li>';
    });
  }
  // Recent
  const recent=(S.recentFiles||[]).filter(p=>files[p]&&!validPinned.includes(p)).slice(0,5);
  if(recent.length){
    h+='<li class="ft-section-header">🕒 '+(_ja?'最近':'Recent')+'</li>';
    recent.forEach(p=>{
      const active=S.previewFile===p;
      h+='<li class="ft-file'+(active?' active':'')+'" data-path="'+escAttr(p)+'"><a href="#" onclick="previewFile(\''+escAttr(p)+'\');return false;" title="'+escAttr(p)+'">'+esc(p.split('/').pop())+'</a></li>';
    });
  }
  // All files grouped by folder
  h+='<li class="ft-section-header">📁 '+(_ja?'全ファイル':'All Files')+'</li>';
  let lastFolder='';
  keys.forEach(p=>{
    const parts=p.split('/');
    const folder=parts.length>1?parts[0]:'';
    if(folder&&folder!==lastFolder){
      h+='<li class="ft-folder">📂 '+esc(folder)+'</li>';
      lastFolder=folder;
    }
    const active=S.previewFile===p;
    const fname=parts[parts.length-1];
    h+='<li class="ft-file'+(active?' active':'')+'" data-path="'+escAttr(p)+'"><a href="#" onclick="previewFile(\''+escAttr(p)+'\');return false;" title="'+escAttr(p)+'">'+esc(fname)+'</a></li>';
  });
  h+='</ul>';
  el.innerHTML=h;
}

function filterSidebarTree(q){
  const items=document.querySelectorAll('#sbFileList .ft-file');
  const qLow=q.toLowerCase();
  items.forEach(li=>{
    const path=li.dataset.path||'';
    li.style.display=(!q||path.toLowerCase().includes(qLow))?'':'none';
  });
}

function updateSidebarLabels(){
  const _ja=S.lang==='ja';
  const sfEl=$('sbFiles');
  if(sfEl&&sfEl.style.display!=='none')renderSidebarFiles();
  // Update toggle button tooltip
  const tog=$('sbToggle');
  if(tog)tog.title=_ja?'サイドバー切替 (Ctrl+B)':'Toggle Sidebar (Ctrl+B)';
}
