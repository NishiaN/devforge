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
  ['sbProgress','sbFiles','sbSummary'].forEach(function(id){
    const el=$(id);if(el)el.addEventListener('scroll',_sbScrUpdate);
  });
  updateSidebarLabels();
  renderPillarGrid();
}

function sbScrollSect(delta){
  const el=_sbActiveSect();if(el)el.scrollTop+=delta;
}

function _sbActiveSect(){
  var ids=['sbProgress','sbFiles','sbSummary'];
  for(var i=0;i<ids.length;i++){var el=$(ids[i]);if(el&&el.style.display!=='none')return el;}
  return null;
}

function _sbScrUpdate(){
  const up=$('sbScrUp'),dn=$('sbScrDn');if(!up||!dn)return;
  const el=_sbActiveSect();
  if(!el||el.scrollHeight<=el.clientHeight+5){
    up.className='sb-scr sb-scr-up inactive';
    dn.className='sb-scr sb-scr-dn inactive';
    return;
  }
  const atTop=el.scrollTop<=5;
  const atBot=el.scrollTop>=el.scrollHeight-el.clientHeight-5;
  up.className='sb-scr sb-scr-up'+(atTop?' inactive':' active');
  dn.className='sb-scr sb-scr-dn'+(atBot?' inactive':' active');
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
  const spEl=$('sbProgress');const sfEl=$('sbFiles');const ssEl=$('sbSummary');
  document.querySelectorAll('.sb-tab').forEach(t=>{t.classList.toggle('on',t.dataset.tab===tab);t.setAttribute('aria-selected',String(t.dataset.tab===tab));});
  if(spEl)spEl.style.display=tab==='progress'?'':'none';
  if(sfEl){sfEl.style.display=tab==='files'?'':'none';if(tab==='files')renderSidebarFiles();}
  if(ssEl){ssEl.style.display=tab==='summary'?'':'none';if(tab==='summary')renderSidebarSummary();}
  _sbScrUpdate();
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
  if(S.skillLv<=1){
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
  // All files grouped by folder (F7: Lv0-1 collapses to reduce visual noise)
  if(S.skillLv<=1){
    h+='<details class="sb-all-collapse"><summary class="ft-section-header">📁 '+(_ja?'全ファイル ('+keys.length+')':'All Files ('+keys.length+')')+'</summary>';
  }else{
    h+='<li class="ft-section-header">📁 '+(_ja?'全ファイル':'All Files')+'</li>';
  }
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
  if(S.skillLv<=1){h+='</details>';}
  h+='</ul>';
  el.innerHTML=h;
  const activeEl=el.querySelector('.ft-file.active');
  if(activeEl)activeEl.scrollIntoView({block:'nearest',behavior:'smooth'});
  _sbScrUpdate();
}

function filterSidebarTree(q){
  const items=document.querySelectorAll('#sbFileList .ft-file');
  const qLow=q.toLowerCase();
  items.forEach(li=>{
    const path=li.dataset.path||'';
    li.style.display=(!q||path.toLowerCase().includes(qLow))?'':'none';
  });
}

function renderCompatBadge(){
  const el=$('sbCompatBadge');if(!el)return;
  if(typeof checkCompat!=='function'){el.innerHTML='';return;}
  const _ja=S.lang==='ja';
  const issues=checkCompat(S.answers||{}).filter(function(i){return !S.compatAcked.includes(i.id);});
  const errors=issues.filter(function(i){return i.level==='error';}).length;
  const warns=issues.filter(function(i){return i.level==='warn';}).length;
  const infos=issues.filter(function(i){return i.level==='info';}).length;
  if(!errors&&!warns&&!infos){
    el.innerHTML='<div class="compat-badge-ok">✅ '+(_ja?'スタック相性: 良好':'Stack: Compatible')+'</div>';
    return;
  }
  let h='<div class="compat-badge-row">';
  if(errors)h+='<span class="cb-error">❌ '+errors+'</span>';
  if(warns)h+='<span class="cb-warn">⚠️ '+warns+'</span>';
  if(infos)h+='<span class="cb-info">ℹ️ '+infos+'</span>';
  h+=(_ja?'<span class="cb-label">未解決の警告</span>':'<span class="cb-label">open issues</span>');
  h+='</div>';
  el.innerHTML=h;
}

function goToQ(phase,step){
  S.phase=phase;S.step=step;save();
  if(typeof showQ==='function')showQ();
  if(typeof updProgress==='function')updProgress();
}

function renderSidebarSummary(){
  const el=$('sbSummary');if(!el)return;
  const _ja=S.lang==='ja';
  if(typeof getQ!=='function'||typeof isQActive!=='function'){el.innerHTML='<p class="sb-empty">'+(_ja?'質問データ未読込':'Questions not loaded')+'</p>';return;}
  const qs=getQ();let h='';
  for(let p=1;p<=3;p++){
    const ph=qs[p];if(!ph)continue;
    const phLabel=_ja?['','Phase 1','Phase 2','Phase 3'][p]:['','Phase 1','Phase 2','Phase 3'][p];
    h+='<div class="sb-sum-title">'+phLabel+'</div><ul class="sb-sum-list">';
    ph.questions.forEach(function(q,si){
      if(!isQActive(q))return;
      const ans=S.answers[q.id]||'';
      const answered=!!ans;
      const qLabel=(_ja&&q.label)?q.label:(q.labelEn||q.label||q.id);
      const shortAns=answered?String(ans).replace(/\[P\d+\]\s*/g,'').split(',')[0].trim().slice(0,20):'';
      const isNow=(S.phase===p&&S.step===si);
      h+='<li class="sb-sum-item'+(answered?' answered':'')+(isNow?' current':'')+'" tabindex="0" role="button" onclick="goToQ('+p+','+si+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();goToQ('+p+','+si+')}">'
        +'<span class="sb-sum-mark">'+(answered?'✅':'➖')+'</span>'
        +'<span class="sb-sum-q">'+esc(qLabel)+'</span>'
        +(shortAns?'<span class="sb-sum-ans" title="'+escAttr(String(ans))+'">'+esc(shortAns)+'</span>':'')
        +'</li>';
    });
    h+='</ul>';
  }
  if(!h)h='<p class="sb-empty">'+(_ja?'質問未表示':'No questions')+'</p>';
  el.innerHTML=h;
  _sbScrUpdate();
}

function updateSidebarLabels(){
  const _ja=S.lang==='ja';
  const sfEl=$('sbFiles');
  if(sfEl&&sfEl.style.display!=='none')renderSidebarFiles();
  const ssEl=$('sbSummary');if(ssEl&&ssEl.style.display!=='none')renderSidebarSummary();
  renderCompatBadge();
  // Update toggle button tooltip
  const tog=$('sbToggle');
  if(tog)tog.title=_ja?'サイドバー切替 (Ctrl+B)':'Toggle Sidebar (Ctrl+B)';
  renderPillarGrid();
}

/* ═══ PILLAR ICON GRID ═══ */
var PILLAR_ICONS=['📋','🐳','🔌','🤖','✅','🗺️','🎨','🔍','💡','🔒','📊','⚙️','🔮','🧬','🧩','🔧','🏢','🚀','🌐','🗄️','📄','📦','🧪','🛡️','⚡','🔭'];
var GEN_TO_PILLAR=[0,1,2,3,0,6,8,9,10,11,12,13,14,15,16,17,18,19,20,21,0,0,22,23,24,25];
var PILLAR_FIRST_FILE=['.spec/constitution.md','.devcontainer/devcontainer.json','.mcp/project-context.md',null,null,null,'roadmap/LEARNING_PATH.md',null,'docs/26_design_system.md','docs/29_reverse_engineering.md','docs/39_implementation_playbook.md','docs/43_security_intelligence.md','docs/48_industry_blueprint.md','docs/53_ops_runbook.md','docs/56_market_positioning.md','docs/60_methodology_intelligence.md','docs/65_prompt_genome.md','docs/69_prompt_ops_pipeline.md','docs/73_enterprise_architecture.md','docs/77_cicd_pipeline_design.md','docs/83_api_design_principles.md','docs/87_database_design_principles.md','docs/91_testing_strategy.md','docs/95_ai_safety_framework.md','docs/99_performance_strategy.md','docs/103_observability_architecture.md'];

function renderPillarGrid(){
  const g=$('sbPillarGrid');if(!g)return;
  const _ja=S.lang==='ja';
  const hasFiles=Object.keys(S.files||{}).length>0;
  const names=_ja?['SDD','DevContainer','MCP','AIルール','品質','ロードマップ','デザイン','リバース','実装','セキュリティ','戦略','運用','未来','開発IQ','ゲノム','Prompt Ops','Enterprise','CI/CD','API','DB','仕様書','共通','テスト','AI安全','パフォ','可観測']:['SDD','DevContainer','MCP','AI Rules','Quality','Roadmap','Design','Reverse','Impl','Security','Strategy','Ops','Future','Dev IQ','Genome','Prompt Ops','Enterprise','CI/CD','API','DB','Docs','Common','Testing','AI Safety','Perf','Observ'];
  // F8: beginner-friendly tooltips for Lv0-1 visible pillars
  var _bgTips=S.skillLv<=1?(_ja?{0:'仕様書を見る',3:'AIルールを見る',7:'AIプロンプトを起動',8:'デザインを見る'}:{0:'View Specs',3:'View AI Rules',7:'Launch AI Prompts',8:'View Design'}):null;
  // Lv0-1: show only 4 essential pillars (same set as hero badge filter)
  var _bpFilter=S.skillLv<=1?new Set([0,3,7,8]):null;
  let h='';
  for(let i=0;i<26;i++){
    const cls='sb-pillar-icon'+(hasFiles?' completed':' inactive');
    const hidden=_bpFilter&&!_bpFilter.has(i)?'style="display:none"':'';
    const tip=_bgTips&&_bgTips[i]!==undefined?_bgTips[i]:names[i];
    h+='<button class="'+cls+'" title="'+escAttr(tip)+'" onclick="clickPillarIcon('+i+')" aria-label="'+escAttr(tip)+'" '+hidden+'>'+PILLAR_ICONS[i]+'</button>';
  }
  g.innerHTML=h;
}

function clickPillarIcon(genIdx){
  if(!Object.keys(S.files||{}).length)return;
  const p=GEN_TO_PILLAR[genIdx];
  S.pillar=p;save();
  document.querySelectorAll('.piltab').forEach(function(t,i){
    t.classList.toggle('on',i===p);
    t.setAttribute('aria-selected',String(i===p));
  });
  if(p===4){if(typeof showExplorer==='function')showExplorer();return;}
  if(p===5){if(typeof showDashboard==='function')showDashboard();return;}
  if(p===7){if(typeof showAILauncher==='function')showAILauncher();return;}
  if(typeof showFileTree==='function')showFileTree();
  const f=PILLAR_FIRST_FILE[p];
  if(f&&S.files[f]&&typeof previewFile==='function')previewFile(f);
}
