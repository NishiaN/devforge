/* ═══ PREVIEW SYSTEM ═══ */
let _prevHistory=[];
let _prevHistIdx=-1;
let _prevNavFlag=false;
let _viewHistory=[];
let _viewHistIdx=-1;
let _viewNavFlag=false;

function _sanitizeHTML(html){
  const allowedTags=['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','a','strong','em','code','pre','blockquote','table','thead','tbody','tr','th','td','img','div','span','b','i','u','s','del','ins','sup','sub','dl','dt','dd'];
  const allowedAttrs={a:['href','title','class','target','rel'],img:['src','alt','title','class'],code:['class'],pre:['class'],div:['class'],span:['class'],table:['class'],th:['colspan','rowspan'],td:['colspan','rowspan']};
  const temp=document.createElement('div');temp.innerHTML=html;
  function clean(el){
    const tag=el.tagName.toLowerCase();
    if(!allowedTags.includes(tag)){el.remove();return;}
    const attrs=allowedAttrs[tag]||[];
    Array.from(el.attributes).forEach(a=>{
      if(!attrs.includes(a.name)){el.removeAttribute(a.name);}
      else if(a.name==='href'||a.name==='src'){
        const v=a.value.toLowerCase();
        if(v.startsWith('javascript:')||v.startsWith('data:')||v.startsWith('vbscript:')||v.startsWith('about:')){el.removeAttribute(a.name);}
        else if(!v.startsWith('http://')&&!v.startsWith('https://')&&!v.startsWith('mailto:')&&!v.startsWith('#')&&!v.startsWith('./')&&!v.startsWith('../')){el.removeAttribute(a.name);}
      }
    });
    Array.from(el.children).forEach(c=>clean(c));
  }
  Array.from(temp.children).forEach(c=>clean(c));
  return temp.innerHTML;
}
function _miniMD(raw){
  if(!raw)return '';
  const escH=(s)=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const lines=raw.split('\n');
  let html='',inCode=false,inList=false,listType='',inTable=false,tableHeaders=[],inQuote=false,para='';
  const flushPara=()=>{if(para.trim()){html+='<p>'+_procInline(para.trim())+'</p>';para='';}};
  const _procInline=(s)=>{
    s=s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/\*(.+?)\*/g,'<em>$1</em>');
    s=s.replace(/`(.+?)`/g,'<code>$1</code>');
    s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(m,txt,url)=>{
      const u=url.trim().toLowerCase();
      if(!u.startsWith('http://')&&!u.startsWith('https://')&&!u.startsWith('./')&&!u.startsWith('../')&&!u.startsWith('#'))return m;
      return '<a href="'+escH(url)+'">'+txt+'</a>';
    });
    return s;
  };
  for(let i=0;i<lines.length;i++){
    const line=lines[i],trim=line.trim();
    if(inCode){
      if(trim==='```'){html+='</code></pre>';inCode=false;}
      else html+=escH(line)+'\n';
      continue;
    }
    if(trim.startsWith('```')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      const lang=trim.slice(3).trim();
      html+='<pre><code'+(lang?' class="language-'+escH(lang)+'"':'')+'>';
      inCode=true;continue;
    }
    if(trim.startsWith('####')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      html+='<h4>'+_procInline(trim.slice(4).trim())+'</h4>';continue;
    }
    if(trim.startsWith('###')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      html+='<h3>'+_procInline(trim.slice(3).trim())+'</h3>';continue;
    }
    if(trim.startsWith('##')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      html+='<h2>'+_procInline(trim.slice(2).trim())+'</h2>';continue;
    }
    if(trim.startsWith('#')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      html+='<h1>'+_procInline(trim.slice(1).trim())+'</h1>';continue;
    }
    if(/^(\-{3,}|\*{3,})$/.test(trim)){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      html+='<hr>';continue;
    }
    if(trim.startsWith('|')&&trim.endsWith('|')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);inQuote&&(html+='</blockquote>',inQuote=false);
      const cells=trim.slice(1,-1).split('|').map(c=>c.trim());
      if(!inTable){html+='<table><thead><tr>';cells.forEach(c=>html+='<th>'+_procInline(c)+'</th>');html+='</tr></thead><tbody>';tableHeaders=cells;inTable=true;}
      else if(cells.every(c=>/^:?\-+:?$/.test(c))){}
      else{html+='<tr>';cells.forEach(c=>html+='<td>'+_procInline(c)+'</td>');html+='</tr>';}
      continue;
    }
    if(inTable&&!trim.startsWith('|')){html+='</tbody></table>';inTable=false;}
    if(trim.startsWith('>')){
      flushPara();inList&&(html+=listType==='ol'?'</ol>':'</ul>',inList=false);
      if(!inQuote){html+='<blockquote>';inQuote=true;}
      html+='<p>'+_procInline(trim.slice(1).trim())+'</p>';continue;
    }
    if(inQuote&&!trim.startsWith('>')){html+='</blockquote>';inQuote=false;}
    const ulMatch=trim.match(/^[\-\*]\s+(\[[ x]\]\s+)?(.+)$/);
    const olMatch=trim.match(/^\d+\.\s+(.+)$/);
    if(ulMatch||olMatch){
      flushPara();inQuote&&(html+='</blockquote>',inQuote=false);
      const isCheck=ulMatch&&ulMatch[1];
      const text=ulMatch?(ulMatch[2]||''):olMatch[1];
      const newType=olMatch?'ol':'ul';
      if(!inList){html+='<'+newType+'>';listType=newType;inList=true;}
      else if(listType!==newType){html+='</'+listType+'><'+newType+'>';listType=newType;}
      if(isCheck){const checked=ulMatch[1].includes('x');html+='<li><input type="checkbox"'+(checked?' checked':'')+' disabled> '+_procInline(text)+'</li>';}
      else html+='<li>'+_procInline(text)+'</li>';
      continue;
    }
    if(inList&&!ulMatch&&!olMatch){html+=listType==='ol'?'</ol>':'</ul>';inList=false;}
    if(!trim){flushPara();continue;}
    para+=(para?' ':'')+trim;
  }
  flushPara();
  if(inCode)html+='</code></pre>';
  if(inList)html+=listType==='ol'?'</ol>':'</ul>';
  if(inQuote)html+='</blockquote>';
  if(inTable)html+='</tbody></table>';
  return html;
}
function _patchLinks(html){
  return html.replace(/<a href="(https?:\/\/[^"]+)"/g,'<a href="$1" target="_blank" rel="noopener"');
}
function safeMD(raw){
  if(window._noMarked||typeof marked==='undefined')return _miniMD(raw);
  const html=marked.parse(raw);
  return _patchLinks(_sanitizeHTML(html));
}
function diffBtn(path){
  return (S.prevFiles[path]||S.editedFiles[path])?'<button class="btn btn-xs btn-s btn-diff" onclick="showDiff(\''+escAttr(path)+'\')">🔀 Diff</button>':'';
}

// Breadcrumb navigation (HCD: ③認知負荷 ②使いやすさ)
function getBreadcrumb(path){
  const _ja=S.lang==='ja';
  const pillarNames=t('pillar');
  const pillarName=pillarNames[S.pillar]||'Files';

  let crumbs=[{label:_ja?'ファイル':'Files',action:'showFileTree()'}];

  // Add pillar if not the default
  if(S.pillar>0){
    crumbs.push({label:pillarName,action:'showFileTree()'});
  }

  // Parse path
  const parts=path.split('/');
  let accumulated='';

  parts.forEach((part,i)=>{
    accumulated+=part;
    if(i<parts.length-1){
      // Directory
      accumulated+='/';
      crumbs.push({label:part,action:'showFileTree()'}); // Could filter to show only this dir
    }else{
      // File (current, not clickable)
      crumbs.push({label:part,action:null,current:true});
    }
  });

  // Build HTML
  let html='<div class="breadcrumb">';
  crumbs.forEach((c,i)=>{
    if(i>0)html+='<span class="breadcrumb-sep">›</span>';
    if(c.current){
      html+=`<span class="breadcrumb-current" aria-current="page">${esc(c.label)}</span>`;
    }else{
      html+=`<button class="breadcrumb-link" onclick="${c.action}">${esc(c.label)}</button>`;
    }
  });
  html+='</div>';
  return html;
}

function prevToolbar(path,showRaw){
  const _ja=S.lang==='ja';
  const rawBtn=showRaw?`<button class="btn btn-xs btn-s" onclick="toggleMdRaw('${escAttr(path)}')">📝 Raw</button>`:'';
  const canBack=_prevHistIdx>0;
  const canFwd=_prevHistIdx<_prevHistory.length-1;
  const navBtns=`<button class="btn btn-xs btn-s prev-nav-btn${canBack?'':' disabled'}" aria-disabled="${canBack?'false':'true'}" onclick="prevBack()" title="${_ja?'戻る':'Back'}">◀</button><button class="btn btn-xs btn-s prev-nav-btn${canFwd?'':' disabled'}" aria-disabled="${canFwd?'false':'true'}" onclick="prevForward()" title="${_ja?'進む':'Forward'}">▶</button>`;
  return `<div class="prev-toolbar">${navBtns}${getBreadcrumb(path)}<div class="prev-toolbar-r">${rawBtn}<button class="btn btn-xs btn-s" onclick="openEditor('${escAttr(path)}')">✏️ ${_ja?'編集':'Edit'}</button>${diffBtn(path)}<button class="btn btn-xs btn-s" onclick="copyFileContent('${escAttr(path)}')">📋 ${_ja?'コピー':'Copy'}</button><button class="btn btn-xs btn-s" onclick="printCurrentFile()">🖨️ ${_ja?'印刷':'Print'}</button></div></div>`;
}
function initPrevTabs(){
  const _ja=S.lang==='ja';
  const tabs=$('prevTabs');tabs.innerHTML='';
  const ja=_ja;
  [ja?'ツリー':'Tree',ja?'プレビュー':'Preview'].forEach((n,i)=>{
    const b=document.createElement('button');b.className='ptab'+(i===0?' on':'');
    b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===0));
    b.textContent=n;b.onclick=()=>{
      document.querySelectorAll('.ptab').forEach(t=>{t.classList.remove('on');t.setAttribute('aria-selected','false');});
      b.classList.add('on');b.setAttribute('aria-selected','true');
      if(i===0)showFileTree();else showFilePreview();
    };tabs.appendChild(b);
  });
}

function initPillarTabs(){
  const tabs=$('pillarTabs');tabs.innerHTML='';
  const names=t('pillar');
  names.forEach((n,i)=>{
    const b=document.createElement('button');b.className='piltab'+(i===0?' on':'');
    b.setAttribute('role','tab');b.setAttribute('aria-selected',String(i===0));
    b.textContent=n;b.onclick=()=>{
      S.pillar=i;
      document.querySelectorAll('.piltab').forEach(t=>{t.classList.remove('on');t.setAttribute('aria-selected','false');});
      b.classList.add('on');b.setAttribute('aria-selected','true');
      if(i===4) showExplorer();
      else if(i===5) showDashboard();
      else if(i===6) showRoadmapUI();
      else if(i===7) showAILauncher();
      else if(i===8) showFileTree(); // Design System
      else if(i===9) showFileTree(); // Reverse Engineering
      else if(i===10) showFileTree(); // Implementation Intelligence
      else if(i===11) showFileTree(); // Security Intelligence
      else if(i===12) showFileTree(); // Strategic Intelligence
      else showFileTree();
    };tabs.appendChild(b);
  });
}

// Pin/Unpin file (HCD: ②使いやすさ C継続利用)
function togglePin(path){
  if(!S.pinnedFiles)S.pinnedFiles=[];
  const idx=S.pinnedFiles.indexOf(path);
  const _ja=S.lang==='ja';
  if(idx>=0){
    S.pinnedFiles.splice(idx,1);
    toast(_ja?'📌 ピン留め解除しました':'📌 Unpinned',{type:'info'});
  }else{
    S.pinnedFiles.push(path);
    toast(_ja?'📌 ピン留めしました':'📌 Pinned',{type:'success'});
  }
  save();
  showFileTree();
}

function clearFileHistory(){
  const _ja=S.lang==='ja';
  if((!S.recentFiles||!S.recentFiles.length)&&(!S.pinnedFiles||!S.pinnedFiles.length)){
    toast(_ja?'クリアする履歴がありません':'No history to clear');return;
  }
  const backup={recentFiles:[...(S.recentFiles||[])],pinnedFiles:[...(S.pinnedFiles||[])]};
  S.recentFiles=[];
  S.pinnedFiles=[];
  _prevHistory=[];_prevHistIdx=-1;
  _viewHistory=[];_viewHistIdx=-1;
  save();showFileTree();
  toast(_ja?'履歴をクリアしました':'History cleared',{
    type:'success',duration:5000,
    actionLabel:_ja?'元に戻す':'Undo',
    undoFn:()=>{
      S.recentFiles=backup.recentFiles;
      S.pinnedFiles=backup.pinnedFiles;
      save();showFileTree();
      toast(_ja?'✅ 復元しました':'✅ Restored',{type:'success'});
    }
  });
}

function updatePreview(){
  showFileTree();
}

function showFileTree(){
  const _ja=S.lang==='ja';
  const body=$('prevBody');
  const pillar=S.pillar;
  
  // Special UI pillars
  if(pillar===4){showExplorer();return;}
  if(pillar===5){showDashboard();return;}
  if(pillar===6){showRoadmapUI();return;}
  if(pillar===7){showAILauncher();return;}
  pushView({pillar:pillar,type:'tree',file:null});
  // pillar===8: Design System - show file tree (no special UI)

  const tree=buildFileTree();
  const hasFiles=Object.keys(S.files).length>0;
  
  let h='<div class="ft-search"><input type="text" id="ftSearch" placeholder="'+(_ja?'🔍 ファイル検索…':'🔍 Search files…')+'" aria-label="'+(_ja?'ファイル検索':'Search files')+'" oninput="filterFileTree(this.value)"></div>';
  h+='<ul class="file-tree" id="ftList">';

  // Pinned files section (HCD: ②使いやすさ C継続利用)
  if(S.pinnedFiles&&S.pinnedFiles.length>0){
    h+='<li class="ft-section-header">📌 '+(_ja?'ピン留め':'Pinned')+'</li>';
    S.pinnedFiles.forEach(path=>{
      if(!S.files[path])return; // Skip if file no longer exists
      const isActive=S.previewFile===path;
      const fileName=path.split('/').pop();
      h+=`<li data-path="${esc(path)}" class="tree-item ft-pinned${isActive?' active':''}" role="treeitem" tabindex="0" onclick="previewFile('${escAttr(path)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();previewFile('${escAttr(path)}')}">
        📄 ${esc(fileName)}<button class="ft-unpin" onclick="event.stopPropagation();togglePin('${escAttr(path)}')" title="${_ja?'ピン留め解除':'Unpin'}">📌</button>
      </li>`;
    });
  }

  // Recent files section
  if(S.recentFiles&&S.recentFiles.length>0){
    h+='<li class="ft-section-header">🕐 '+(_ja?'最近':'Recent')+'</li>';
    S.recentFiles.slice(0,5).forEach(path=>{ // Show max 5 recent
      if(!S.files[path])return;
      const isActive=S.previewFile===path;
      const isPinned=S.pinnedFiles&&S.pinnedFiles.includes(path);
      if(isPinned)return; // Don't show in recent if already pinned
      const fileName=path.split('/').pop();
      h+=`<li data-path="${esc(path)}" class="tree-item ft-recent${isActive?' active':''}" role="treeitem" tabindex="0" onclick="previewFile('${escAttr(path)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();previewFile('${escAttr(path)}')}">
        📄 ${esc(fileName)}
      </li>`;
    });
  }

  if((S.pinnedFiles&&S.pinnedFiles.length>0)||(S.recentFiles&&S.recentFiles.length>0)){
    h+='<li class="ft-clear-history"><button class="ft-clear-btn" onclick="clearFileHistory()" title="'+(_ja?'履歴をクリア':'Clear history')+'">🗑️ '+(_ja?'履歴クリア':'Clear')+'</button></li>';
    h+='<li class="ft-separator">────────────────</li>';
  }

  tree.forEach(f=>{
    if(!f.name||f.name==='───────────'){h+='<li class="ft-separator">────────────────</li>';return;}
    if(f.folder) h+=`<li class="folder">📁 ${f.name}/</li>`;
    else {
      const isGen=hasFiles&&S.files[f.path];
      const isActive=S.previewFile===f.path;
      const isEdited=S.editedFiles&&S.editedFiles[f.path];
      const isPinned=S.pinnedFiles&&S.pinnedFiles.includes(f.path);
      const pinBtn=isGen?`<button class="ft-pin${isPinned?' ft-pin-active':''}" onclick="event.stopPropagation();togglePin('${escAttr(f.path)}')" title="${_ja?(isPinned?'ピン留め解除':'ピン留め'):(isPinned?'Unpin':'Pin')}">${isPinned?'📌':'○'}</button>`:'';
      h+=`<li data-path="${esc(f.path)}" onclick="previewFile('${escAttr(f.path)}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();previewFile('${escAttr(f.path)}')}" class="tree-item${isActive?' active':''}${f.name.startsWith('  ')?' tree-indent':''}${isGen?'':' tree-disabled'}" role="treeitem" tabindex="0">
        ${isGen?'📄':'⬜'} ${esc(f.name.trim())}${isEdited?'<span class="tree-edited" title="Edited">●</span>':''}${isGen?'<span class="tree-gen">✓</span>':''}${pinBtn}
      </li>`;
    }
  });
  h+='</ul>';
  
  if(hasFiles){
    const count=Object.keys(S.files).length;
    const editCount=S.editedFiles?Object.keys(S.editedFiles).length:0;
    h+=`<div class="prev-footer">
      ${count} ${_ja?'ファイル生成済み':'files generated'}${editCount?` · <span class="tree-edited">${editCount} ${_ja?'編集済み':'edited'}</span>`:''}
    </div>`;
  }
  
  body.innerHTML=h;
  if(typeof renderSidebarFiles==='function')renderSidebarFiles();
}

function buildFileTree(){
  const _ja=S.lang==='ja';
  const files=[];
  const pillar=S.pillar;
  if(pillar===0){ // SDD
    files.push({folder:true,name:'.spec'});
    ['constitution.md','specification.md','technical-plan.md','tasks.md','verification.md'].forEach(f=>
      files.push({name:'  '+f,path:'.spec/'+f}));
  } else if(pillar===1){ // DevContainer
    files.push({folder:true,name:'.devcontainer'});
    ['devcontainer.json','Dockerfile','docker-compose.yml','post-create.sh'].forEach(f=>
      files.push({name:'  '+f,path:'.devcontainer/'+f}));
    files.push({name:'.env.example',path:'.env.example'});
    files.push({name:'.gitattributes',path:'.gitattributes'});
    files.push({name:'.editorconfig',path:'.editorconfig'});
    files.push({name:'docs/64_cross_platform_guide.md',path:'docs/64_cross_platform_guide.md'});
  } else if(pillar===2){ // MCP
    files.push({folder:true,name:'.mcp'});
    ['project-context.md','tools-manifest.json','README.md'].forEach(f=>
      files.push({name:'  '+f,path:'.mcp/'+f}));
    files.push({name:'mcp-config.json',path:'mcp-config.json'});
  } else if(pillar===3){ // AI Rules
    ['.cursor/rules','.github/copilot-instructions.md','.windsurfrules','.clinerules',
     '.kiro/spec.md','CLAUDE.md','.claude/rules/spec.md','.claude/rules/frontend.md',
     '.claude/rules/backend.md','.claude/rules/test.md','.claude/rules/ops.md',
     '.claude/settings.json','AI_BRIEF.md','AGENTS.md','codex-instructions.md',
     'skills/project.md','skills/catalog.md','skills/pipelines.md','skills/factory.md',
     'skills/README.md','skills/skill_map.md','skills/agents/coordinator.md','skills/agents/reviewer.md',
     '.ai/hooks.yml','.gemini/settings.json'
    ].forEach(f=>files.push({name:f,path:f}));
  } else if(pillar===4){ // Explorer
    files.push({name:_ja?'(並列実装探索 — UIのみ)':'(Parallel Explorer — UI only)',path:'_explorer'});
  } else if(pillar===5){ // Dashboard
    files.push({name:_ja?'(Context Dashboard — UIのみ)':'(Context Dashboard — UI only)',path:'_dashboard'});
  } else if(pillar===6){ // Roadmap
    files.push({folder:true,name:'roadmap'});
    ['LEARNING_PATH.md','TECH_STACK_GUIDE.md','MOBILE_GUIDE.md','TOOLS_SETUP.md',
     'RESOURCES.md','MILESTONES.md','AI_WORKFLOW.md','AI_AUTONOMOUS.md','SAAS_COMMERCE_GUIDE.md'
    ].forEach(f=>files.push({name:'  '+f,path:'roadmap/'+f}));
  } else if(pillar===7){ // AI Launcher
    files.push({name:_ja?'(AIランチャー — UIのみ)':'(AI Launcher — UI only)',path:'_launcher'});
  } else if(pillar===8){ // Design System
    files.push({folder:true,name:'docs'});
    ['26_design_system','27_sequence_diagrams'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===9){ // Reverse Engineering
    files.push({folder:true,name:'docs'});
    ['29_reverse_engineering','30_goal_decomposition','41_growth_intelligence'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===10){ // Implementation Intelligence
    files.push({folder:true,name:'docs'});
    ['39_implementation_playbook','40_ai_dev_runbook','42_skill_guide','81_ux_proficiency_audit'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
    if(S.files['skills/impl-patterns.md']){
      files.push({folder:true,name:'skills'});
      files.push({name:'  impl-patterns.md',path:'skills/impl-patterns.md'});
    }
  } else if(pillar===11){ // Security Intelligence
    files.push({folder:true,name:'docs'});
    ['43_security_intelligence','44_threat_model','45_compliance_matrix','46_ai_security','47_security_testing'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===12){ // Strategic Intelligence
    files.push({folder:true,name:'docs'});
    ['48_industry_blueprint','49_tech_radar','50_stakeholder_strategy','51_operational_excellence','52_advanced_scenarios'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===13){ // Ops Intelligence
    files.push({folder:true,name:'docs'});
    ['53_ops_runbook','54_ops_checklist','55_ops_plane_design'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===14){ // Future Strategy Intelligence
    files.push({folder:true,name:'docs'});
    ['56_market_positioning','57_user_experience_strategy','58_ecosystem_strategy','59_regulatory_foresight'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===15){ // Dev IQ (P16)
    files.push({folder:true,name:'docs'});
    ['60_methodology_intelligence','61_ai_brainstorm_playbook','62_industry_deep_dive','63_next_gen_ux_strategy'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===16){ // Prompt Genome (P17)
    files.push({folder:true,name:'docs'});
    ['65_prompt_genome','66_ai_maturity_assessment','67_prompt_composition_guide','68_prompt_kpi_dashboard'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===17){ // Prompt Ops (P18)
    files.push({folder:true,name:'docs'});
    ['69_prompt_ops_pipeline','70_react_workflow','71_llmops_dashboard','72_prompt_registry'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===18){ // Enterprise SaaS (P19)
    files.push({folder:true,name:'docs'});
    ['73_enterprise_architecture','74_workflow_engine','75_admin_dashboard_spec','76_enterprise_components'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===19){ // CI/CD Intelligence (P20)
    files.push({folder:true,name:'docs'});
    ['77_cicd_pipeline_design','78_deployment_strategy','79_quality_gate_matrix','80_release_engineering'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  } else if(pillar===20){ // API Intelligence (P21)
    files.push({folder:true,name:'docs'});
    ['83_api_design_principles','84_openapi_specification','85_api_security_checklist','86_api_testing_strategy'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  }
  // Common files
  files.push({name:'───────────',path:''});
  files.push({folder:true,name:'.github/workflows'});
  files.push({name:'  ci.yml',path:'.github/workflows/ci.yml'});
  files.push({name:'───────────',path:''});
  files.push({folder:true,name:'docs'});
  ['01_project_overview','02_requirements','03_architecture','04_er_diagram',
   '05_api_design','06_screen_design','07_test_cases','08_security',
   '09_release_checklist','10_gantt','11_wbs','12_driven_dev','13_glossary',
   '14_risk','15_meeting','16_review','17_monitoring',
   '18_data_migration','19_performance','20_a11y','21_changelog',
   '22_prompt_playbook','23_tasks','24_progress','25_error_logs',
   '26_design_system','27_sequence_diagrams','28_qa_strategy','31_industry_playbook',
   '32_qa_blueprint','33_test_matrix','34_incident_response','35_sitemap',
   '36_test_strategy','37_bug_prevention','38_business_model',
   '82_architecture_integrity_check',
   '83_api_design_principles','84_openapi_specification','85_api_security_checklist','86_api_testing_strategy'].forEach(f=>
    files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  files.push({name:'───────────',path:''});
  ['README.md','.gitignore','package.json','LICENSE'].forEach(f=>files.push({name:f,path:f}));
  return files;
}
function previewFile(path){
  const _ja=S.lang==='ja';
  if(!path||path==='')return;
  if(!_prevNavFlag){
    if(_prevHistIdx<_prevHistory.length-1){
      _prevHistory=_prevHistory.slice(0,_prevHistIdx+1);
    }
    _prevHistory.push(path);
    _prevHistIdx=_prevHistory.length-1;
  }
  _prevNavFlag=false;
  pushView({pillar:S.pillar,type:'preview',file:path});
  S.previewFile=path;

  // Track recent files (HCD: ②使いやすさ C継続利用)
  if(!S.recentFiles)S.recentFiles=[];
  S.recentFiles=S.recentFiles.filter(p=>p!==path); // Remove duplicates
  S.recentFiles.unshift(path); // Add to front
  if(S.recentFiles.length>10)S.recentFiles=S.recentFiles.slice(0,10); // Max 10

  save();
  if(typeof renderSidebarFiles==='function')renderSidebarFiles();
  // Update QBar to show file actions (Edit/Copy)
  if(typeof updateQbar==='function')updateQbar();
  document.querySelectorAll('.file-tree li').forEach(li=>{
    li.classList.toggle('active',li.getAttribute('data-path')===path);
  });
  if(S.files[path]){
    const raw=S.files[path];
    if(path.endsWith('.md')&&raw.includes('```mermaid')){
      let html=safeMD(raw);
      let _mmBlocks=[];
      html=html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
        (m,code)=>{const id='_mm'+_mmBlocks.length;
        _mmBlocks.push(code.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
        return '<div class="mermaid" id="'+id+'"></div>';});
      $('prevBody').innerHTML=prevToolbar(path,true)+`<div id="mdRendered" class="md-rendered">${html}</div>`;
      _mmBlocks.forEach((c,i)=>{const el=document.getElementById('_mm'+i);if(el){el.textContent=c;el.setAttribute('data-mermaid-code',c);}});
      _markBrokenLinks();
      loadMermaid(async ()=>{
        if(_mermaidReady){
          try{
            const nodes=document.querySelectorAll('#mdRendered .mermaid');
            if(nodes.length>0){
              if(mermaid.run) await mermaid.run({nodes:nodes});
              else if(mermaid.init) mermaid.init(undefined,nodes);
            }
          }catch(e){console.warn('Mermaid render:',e);}
        }
        _addCodeCopyBtns();
        _addTableCopyBtns();
        _addMermaidCopyBtns();
      });
    } else if(path.endsWith('.md')){
      const html=safeMD(raw);
      $('prevBody').innerHTML=prevToolbar(path,true)+`<div id="mdRendered" class="md-rendered">${html}</div>`;
      _markBrokenLinks();
      _addCodeCopyBtns();
      _addTableCopyBtns();
    } else {
      $('prevBody').innerHTML=prevToolbar(path,false)+`<pre>${escHtml(raw)}</pre>`;
    }
    // Switch preview tab to active
    document.querySelectorAll('.ptab').forEach((t,i)=>{t.classList.toggle('on',i===1);});
  } else {
    $('prevBody').innerHTML=`<p class="empty-preview-sm">${_ja?'ファイルは生成後にプレビュー可能です':'File preview available after generation'}</p>`;
  }
}

let _mdRawMode=false;
function toggleMdRaw(path){
  _mdRawMode=!_mdRawMode;
  if(_mdRawMode){
    const el=$('mdRendered');
    if(el) el.outerHTML=`<pre id="mdRaw">${escHtml(S.files[path])}</pre>`;
  } else { previewFile(path); }
}

function copyFileContent(path){
  if(S.files[path]){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(S.files[path]).then(()=>toast(t('copyDone'))).catch(()=>{_fallbackCopy(S.files[path]);toast(t('copyDone'));});
    } else {_fallbackCopy(S.files[path]);toast(t('copyDone'));}
  }
}

function _fallbackCopy(text){const ta=document.createElement('textarea');ta.value=text;ta.style.cssText='position:fixed;left:-9999px;';document.body.appendChild(ta);ta.select();try{document.execCommand('copy');}catch(e){}ta.remove();}

function _getTableText(table){
  let md='';
  const rows=table.querySelectorAll('tr');
  rows.forEach((row,i)=>{
    const cells=row.querySelectorAll('th, td');
    const cellTexts=Array.from(cells).map(c=>c.textContent.trim());
    md+='| '+cellTexts.join(' | ')+' |\n';
    if(i===0&&cells[0].tagName.toLowerCase()==='th'){
      md+='| '+cellTexts.map(()=>'---').join(' | ')+' |\n';
    }
  });
  return md;
}

function _addCodeCopyBtns(){
  const _ja=S.lang==='ja';
  document.querySelectorAll('#mdRendered pre').forEach(pre=>{
    const btn=document.createElement('button');
    btn.className='code-copy-btn';
    btn.textContent='📋';
    btn.title=_ja?'コードをコピー':'Copy code';
    btn.onclick=()=>{
      const code=pre.querySelector('code');
      const text=code?code.textContent:pre.textContent;
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(text)
          .then(()=>{btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));})
          .catch(()=>{_fallbackCopy(text);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));});
      }else{_fallbackCopy(text);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));}
    };
    pre.appendChild(btn);
  });
}

function _addTableCopyBtns(){
  const _ja=S.lang==='ja';
  document.querySelectorAll('#mdRendered table').forEach(table=>{
    const wrapper=document.createElement('div');
    wrapper.className='table-wrapper';
    table.parentNode.insertBefore(wrapper,table);
    wrapper.appendChild(table);
    const btn=document.createElement('button');
    btn.className='table-copy-btn';
    btn.textContent='📋';
    btn.title=_ja?'表をコピー':'Copy table';
    btn.onclick=()=>{
      const text=_getTableText(table);
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(text)
          .then(()=>{btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));})
          .catch(()=>{_fallbackCopy(text);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));});
      }else{_fallbackCopy(text);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));}
    };
    wrapper.appendChild(btn);
  });
}

function _addMermaidCopyBtns(){
  const _ja=S.lang==='ja';
  document.querySelectorAll('#mdRendered .mermaid').forEach(mermaid=>{
    const code=mermaid.getAttribute('data-mermaid-code');
    if(!code)return;
    const btn=document.createElement('button');
    btn.className='mermaid-copy-btn';
    btn.textContent='📋';
    btn.title=_ja?'Mermaidコードをコピー':'Copy Mermaid code';
    btn.onclick=()=>{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(code)
          .then(()=>{btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));})
          .catch(()=>{_fallbackCopy(code);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));});
      }else{_fallbackCopy(code);btn.textContent='✅';setTimeout(()=>btn.textContent='📋',1500);toast(t('copyDone'));}
    };
    mermaid.appendChild(btn);
  });
}

function prevBack(){
  if(_prevHistIdx>0){
    _prevHistIdx--;
    _prevNavFlag=true;
    previewFile(_prevHistory[_prevHistIdx]);
  }
}

function prevForward(){
  if(_prevHistIdx<_prevHistory.length-1){
    _prevHistIdx++;
    _prevNavFlag=true;
    previewFile(_prevHistory[_prevHistIdx]);
  }
}

async function printCurrentFile(){
  const path=S.previewFile;
  if(!path||!S.files[path])return;
  const raw=S.files[path];
  const G=S.genLang==='ja';
  let content=path.endsWith('.md')?safeMD(raw):'<pre>'+escHtml(raw)+'</pre>';
  if(path.endsWith('.md'))content=await _renderMermaidSVG(content);
  const css='body{font-family:-apple-system,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#1e222d;}'+'pre{background:#f5f5f5;padding:16px;border-radius:8px;overflow-x:auto;}'+'table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f0f0f0;}'+'div[style*="page-break-inside:avoid"] svg{max-width:100%;height:auto;}'+'@media print{div[style*="page-break-inside:avoid"]{page-break-inside:avoid;}svg{max-width:100%;}}';
  const _CSP_META='<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; img-src data: blob:;">';
  const html='<!DOCTYPE html><html><head>'+_CSP_META+'<title>'+escHtml(path)+'</title><style>'+css+'</style></head><body>'+'<h1 style="border-bottom:2px solid #3b82f6;padding-bottom:8px;">'+escHtml(path)+'</h1>'+content+'</body></html>';
  const win=window.open('','_blank');
  if(win){win.document.write(html);win.document.close();}
  else{
    const blob=new Blob([html],{type:'text/html'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=fileSlug(S.projectName)+'-'+path.replace(/\//g,'_');a.click();
  }
}

function showFilePreview(){
  const _ja=S.lang==='ja';
  if(S.previewFile&&S.files[S.previewFile]){
    previewFile(S.previewFile);
  } else {
    $('prevBody').innerHTML=`<p class="dash-empty">${_ja?'ファイルツリーからファイルを選択してください':'Select a file from the tree'}</p>`;
  }
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

function _viewEq(a,b){return a&&b&&a.pillar===b.pillar&&a.type===b.type&&a.file===b.file;}

function pushView(vs){
  if(_viewNavFlag)return;
  if(_viewHistIdx>=0&&_viewEq(_viewHistory[_viewHistIdx],vs))return;
  if(_viewHistIdx<_viewHistory.length-1)_viewHistory=_viewHistory.slice(0,_viewHistIdx+1);
  _viewHistory.push(vs);
  if(_viewHistory.length>50){_viewHistory=_viewHistory.slice(-50);}
  _viewHistIdx=_viewHistory.length-1;
  updViewNav();
}

function _restoreView(vs){
  _viewNavFlag=true;
  S.pillar=vs.pillar;
  document.querySelectorAll('.piltab').forEach((t,i)=>{
    t.classList.toggle('on',i===vs.pillar);
    t.setAttribute('aria-selected',String(i===vs.pillar));
  });
  switch(vs.type){
    case 'tree':showFileTree();break;
    case 'preview':if(vs.file){_prevNavFlag=true;previewFile(vs.file);}break;
    case 'explorer':showExplorer();break;
    case 'dashboard':showDashboard();break;
    case 'techdb':renderTechDB();break;
    case 'roadmap':showRoadmapUI();break;
    case 'launcher':showAILauncher();break;
    default:showFileTree();
  }
  _viewNavFlag=false;
  updViewNav();
}

function viewBack(){
  if(_viewHistIdx>0){_viewHistIdx--;_restoreView(_viewHistory[_viewHistIdx]);}
}

function viewForward(){
  if(_viewHistIdx<_viewHistory.length-1){_viewHistIdx++;_restoreView(_viewHistory[_viewHistIdx]);}
}

function updViewNav(){
  const bb=$('viewBackBtn'),fb=$('viewFwdBtn');
  if(!bb||!fb)return;
  const _ja=S.lang==='ja';
  bb.classList.toggle('disabled',_viewHistIdx<=0);
  bb.setAttribute('aria-disabled',String(_viewHistIdx<=0));
  fb.classList.toggle('disabled',_viewHistIdx>=_viewHistory.length-1);
  fb.setAttribute('aria-disabled',String(_viewHistIdx>=_viewHistory.length-1));
  bb.title=_ja?'前の画面':'Previous Screen';
  fb.title=_ja?'次の画面':'Next Screen';
}

function filterFileTree(q){
  const list=$('ftList');if(!list)return;
  const items=list.querySelectorAll('li');
  const lq=q.toLowerCase();
  items.forEach(li=>{
    if(li.classList.contains('ft-separator')||li.classList.contains('folder')){
      li.style.display=q?'none':'';return;
    }
    const path=li.dataset.path||li.textContent;
    li.style.display=(!q||path.toLowerCase().includes(lq))?'':'none';
  });
}

function _resolveFileRef(href,currentFile){
  if(!href)return null;
  const h=href.trim();
  if(h.startsWith('http://')||h.startsWith('https://')||h.startsWith('#'))return null;
  let resolved=null;
  if(h.startsWith('./')){
    const dir=currentFile.includes('/')?currentFile.substring(0,currentFile.lastIndexOf('/')+1):'';
    resolved=dir+h.slice(2);
  }else if(h.startsWith('../')){
    const parts=currentFile.split('/');parts.pop();
    const upParts=h.split('/');
    for(let i=0;i<upParts.length;i++){
      if(upParts[i]==='..'){parts.pop();}
      else if(upParts[i]!=='.'&&upParts[i]!==''){resolved=parts.join('/')+(parts.length?'/':'')+upParts.slice(i).join('/');break;}
    }
  }else{
    resolved=h;
  }
  if(resolved&&S.files[resolved])return resolved;
  const basename=resolved?resolved.split('/').pop().replace(/^\d+_/,''):'';
  if(basename){
    for(const key in S.files){
      const keyBase=key.split('/').pop().replace(/^\d+_/,'');
      if(keyBase===basename||key.endsWith('/'+basename))return key;
    }
  }
  return null;
}

function _markBrokenLinks(){
  const links=document.querySelectorAll('.md-rendered a[href]');
  links.forEach(a=>{
    const href=a.getAttribute('href');
    if(!href||href.startsWith('http://')||href.startsWith('https://')||href.startsWith('#'))return;
    const resolved=_resolveFileRef(href,S.previewFile||'');
    if(!resolved)a.classList.add('link-broken');
  });
}

function _initLinkInterceptor(){
  document.addEventListener('click',e=>{
    const a=e.target.closest('.md-rendered a[href]');
    if(!a)return;
    const href=a.getAttribute('href');
    if(!href)return;
    if(href.startsWith('http://')||href.startsWith('https://')){
      e.preventDefault();
      window.open(href,'_blank','noopener');
      return;
    }
    if(href.startsWith('#')){
      e.preventDefault();
      const id=href.slice(1);
      const el=document.getElementById(id);
      if(el)el.scrollIntoView({behavior:'smooth'});
      return;
    }
    e.preventDefault();
    const resolved=_resolveFileRef(href,S.previewFile||'');
    if(resolved){
      previewFile(resolved);
    }else{
      const _ja=S.lang==='ja';
      toast((_ja?'ファイルが見つかりません: ':'File not found: ')+href);
    }
  },true);
}

