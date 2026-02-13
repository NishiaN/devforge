/* ═══ PREVIEW SYSTEM ═══ */
let _prevHistory=[];
let _prevHistIdx=-1;
let _prevNavFlag=false;
let _viewHistory=[];
let _viewHistIdx=-1;
let _viewNavFlag=false;

function _sanitizeHTML(html){
  const allowedTags=['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','a','strong','em','code','pre','blockquote','table','thead','tbody','tr','th','td','img','div','span','b','i','u','s','del','ins','sup','sub','dl','dt','dd'];
  const allowedAttrs={a:['href','title','class'],img:['src','alt','title','class'],code:['class'],pre:['class'],div:['class'],span:['class'],table:['class'],th:['colspan','rowspan'],td:['colspan','rowspan']};
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
function safeMD(raw){
  if(window._noMarked||typeof marked==='undefined')return '<pre>'+esc(raw)+'</pre>';
  const html=marked.parse(raw);
  return _sanitizeHTML(html);
}
function diffBtn(path){
  return (S.prevFiles[path]||S.editedFiles[path])?'<button class="btn btn-xs btn-s btn-diff" onclick="showDiff(\''+escAttr(path)+'\')">🔀 Diff</button>':'';
}
function prevToolbar(path,showRaw){
  const _ja=S.lang==='ja';
  const rawBtn=showRaw?`<button class="btn btn-xs btn-s" onclick="toggleMdRaw('${escAttr(path)}')">📝 Raw</button>`:'';
  const canBack=_prevHistIdx>0;
  const canFwd=_prevHistIdx<_prevHistory.length-1;
  const navBtns=`<button class="btn btn-xs btn-s prev-nav-btn${canBack?'':' disabled'}" onclick="prevBack()" title="${_ja?'戻る':'Back'}">◀</button><button class="btn btn-xs btn-s prev-nav-btn${canFwd?'':' disabled'}" onclick="prevForward()" title="${_ja?'進む':'Forward'}">▶</button>`;
  return `<div class="prev-toolbar">${navBtns}<span class="prev-path">📄 ${esc(path)}</span><div class="prev-toolbar-r">${rawBtn}<button class="btn btn-xs btn-s" onclick="openEditor('${escAttr(path)}')">✏️ ${_ja?'編集':'Edit'}</button>${diffBtn(path)}<button class="btn btn-xs btn-s" onclick="copyFileContent('${escAttr(path)}')">📋 ${_ja?'コピー':'Copy'}</button><button class="btn btn-xs btn-s" onclick="printCurrentFile()">🖨️ ${_ja?'印刷':'Print'}</button></div></div>`;
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
      else if(i===6&&Object.keys(S.files).length>0) showRoadmapUI();
      else if(i===7) showAILauncher();
      else if(i===8) showFileTree(); // Design System
      else if(i===9) showFileTree(); // Reverse Engineering
      else if(i===10) showFileTree(); // Implementation Intelligence
      else if(i===11) showFileTree(); // Security Intelligence
      else showFileTree();
    };tabs.appendChild(b);
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
  if(pillar===6&&Object.keys(S.files).length>0){showRoadmapUI();return;}
  if(pillar===7){showAILauncher();return;}
  pushView({pillar:pillar,type:'tree',file:null});
  // pillar===8: Design System - show file tree (no special UI)

  const tree=buildFileTree();
  const hasFiles=Object.keys(S.files).length>0;
  
  let h='<div class="ft-search"><input type="text" id="ftSearch" placeholder="'+(_ja?'🔍 ファイル検索…':'🔍 Search files…')+'" oninput="filterFileTree(this.value)"></div>';
  h+='<ul class="file-tree" id="ftList">';
  tree.forEach(f=>{
    if(!f.name||f.name==='───────────'){h+='<li class="ft-separator">────────────────</li>';return;}
    if(f.folder) h+=`<li class="folder">📁 ${f.name}/</li>`;
    else {
      const isGen=hasFiles&&S.files[f.path];
      const isActive=S.previewFile===f.path;
      const isEdited=S.editedFiles&&S.editedFiles[f.path];
      h+=`<li data-path="${esc(f.path)}" onclick="previewFile('${escAttr(f.path)}')" class="tree-item${isActive?' active':''}${f.name.startsWith('  ')?' tree-indent':''}${isGen?'':' tree-disabled'}">
        ${isGen?'📄':'⬜'} ${esc(f.name.trim())}${isEdited?'<span class="tree-edited" title="Edited">●</span>':''}${isGen?'<span class="tree-gen">✓</span>':''}
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
  } else if(pillar===2){ // MCP
    files.push({folder:true,name:'.mcp'});
    ['project-context.md','tools-manifest.json','README.md'].forEach(f=>
      files.push({name:'  '+f,path:'.mcp/'+f}));
    files.push({name:'mcp-config.json',path:'mcp-config.json'});
  } else if(pillar===3){ // AI Rules
    ['.cursor/rules','.github/copilot-instructions.md','.windsurfrules','.clinerules',
     '.kiro/spec.md','CLAUDE.md','AI_BRIEF.md','AGENTS.md','codex-instructions.md',
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
    ['39_implementation_playbook','40_ai_dev_runbook','42_skill_guide'].forEach(f=>
      files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
    if(S.files['skills/impl-patterns.md']){
      files.push({folder:true,name:'skills'});
      files.push({name:'  impl-patterns.md',path:'skills/impl-patterns.md'});
    }
  } else if(pillar===11){ // Security Intelligence
    files.push({folder:true,name:'docs'});
    ['43_security_intelligence','44_threat_model','45_compliance_matrix','46_ai_security','47_security_testing'].forEach(f=>
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
   '36_test_strategy','37_bug_prevention','38_business_model'].forEach(f=>
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
  S.previewFile=path;save();
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
      _mmBlocks.forEach((c,i)=>{const el=document.getElementById('_mm'+i);if(el)el.textContent=c;});
      loadMermaid(()=>{
        if(_mermaidReady){
          try{
            const nodes=document.querySelectorAll('#mdRendered .mermaid');
            if(nodes.length>0){
              if(mermaid.run) mermaid.run({nodes:nodes});
              else if(mermaid.init) mermaid.init(undefined,nodes);
            }
          }catch(e){console.warn('Mermaid render:',e);}
        }
      });
    } else if(path.endsWith('.md')){
      const html=safeMD(raw);
      $('prevBody').innerHTML=prevToolbar(path,true)+`<div id="mdRendered" class="md-rendered">${html}</div>`;
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

function printCurrentFile(){
  const path=S.previewFile;
  if(!path||!S.files[path])return;
  const raw=S.files[path];
  const G=S.genLang==='ja';
  const content=path.endsWith('.md')?safeMD(raw):'<pre>'+escHtml(raw)+'</pre>';
  const css='body{font-family:-apple-system,sans-serif;padding:40px;max-width:800px;margin:0 auto;color:#1e222d;}'+'pre{background:#f5f5f5;padding:16px;border-radius:8px;overflow-x:auto;}'+'table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:8px;text-align:left;}th{background:#f0f0f0;}';
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
  fb.classList.toggle('disabled',_viewHistIdx>=_viewHistory.length-1);
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

