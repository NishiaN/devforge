/* ═══ PREVIEW SYSTEM ═══ */
function safeMD(raw){
  if(window._noMarked||typeof marked==='undefined')return '<pre>'+esc(raw)+'</pre>';
  return marked.parse(raw);
}
function diffBtn(path){
  return (S.prevFiles[path]||S.editedFiles[path])?'<button class="btn btn-xs btn-s btn-diff" onclick="showDiff(\''+path+'\')">🔀 Diff</button>':'';
}
function prevToolbar(path,showRaw){
  const _ja=S.lang==='ja';
  const rawBtn=showRaw?`<button class="btn btn-xs btn-s" onclick="toggleMdRaw('${path}')">📝 Raw</button>`:'';
  return `<div class="prev-toolbar"><span class="prev-path">📄 ${path}</span><div class="prev-toolbar-r">${rawBtn}<button class="btn btn-xs btn-s" onclick="openEditor('${path}')">✏️ ${_ja?'編集':'Edit'}</button>${diffBtn(path)}<button class="btn btn-xs btn-s" onclick="copyFileContent('${path}')">📋 ${_ja?'コピー':'Copy'}</button></div></div>`;
}
function initPrevTabs(){
  const _ja=S.lang==='ja';
  const tabs=$('prevTabs');tabs.innerHTML='';
  const ja=_ja;
  [ja?'ツリー':'Tree',ja?'プレビュー':'Preview'].forEach((n,i)=>{
    const b=document.createElement('button');b.className='ptab'+(i===0?' on':'');
    b.textContent=n;b.onclick=()=>{
      document.querySelectorAll('.ptab').forEach(t=>t.classList.remove('on'));b.classList.add('on');
      if(i===0)showFileTree();else showFilePreview();
    };tabs.appendChild(b);
  });
}

function initPillarTabs(){
  const tabs=$('pillarTabs');tabs.innerHTML='';
  const names=t('pillar');
  names.forEach((n,i)=>{
    const b=document.createElement('button');b.className='piltab'+(i===0?' on':'');
    b.textContent=n;b.onclick=()=>{
      S.pillar=i;document.querySelectorAll('.piltab').forEach(t=>t.classList.remove('on'));b.classList.add('on');
      if(i===4) showExplorer();
      else if(i===5) showDashboard();
      else if(i===6&&Object.keys(S.files).length>0) showRoadmapUI();
      else if(i===7) showAILauncher();
      else if(i===8) showFileTree(); // Design System
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
      h+=`<li data-path="${f.path}" onclick="previewFile('${f.path}')" class="tree-item${isActive?' active':''}${f.name.startsWith('  ')?' tree-indent':''}${isGen?'':' tree-disabled'}">
        ${isGen?'📄':'⬜'} ${f.name.trim()}${isEdited?'<span class="tree-edited" title="Edited">●</span>':''}${isGen?'<span class="tree-gen">✓</span>':''}
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
  } else if(pillar===2){ // MCP
    files.push({folder:true,name:'.mcp'});
    ['project-context.md','tools-manifest.json'].forEach(f=>
      files.push({name:'  '+f,path:'.mcp/'+f}));
    files.push({name:'mcp-config.json',path:'mcp-config.json'});
  } else if(pillar===3){ // AI Rules
    ['.cursor/rules','.github/copilot-instructions.md','.windsurfrules','.clinerules',
     '.kiro/spec.md','CLAUDE.md','AGENTS.md','codex-instructions.md','skills/project.md','skills/catalog.md','skills/pipelines.md','.ai/hooks.yml'
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
  }
  // Common files
  files.push({name:'───────────',path:''});
  files.push({folder:true,name:'docs'});
  ['01_project_overview','02_requirements','03_architecture','04_er_diagram',
   '05_api_design','06_screen_design','07_test_cases','08_security',
   '09_release_checklist','10_gantt','11_wbs','12_driven_dev','13_glossary',
   '14_risk','15_meeting','16_review','17_monitoring',
   '18_data_migration','19_performance','20_a11y','21_changelog',
   '22_prompt_playbook','23_tasks','24_progress','25_error_logs',
   '26_design_system','27_sequence_diagrams','28_qa_strategy'].forEach(f=>
    files.push({name:'  '+f+'.md',path:'docs/'+f+'.md'}));
  files.push({name:'───────────',path:''});
  ['README.md','.gitignore','package.json','LICENSE'].forEach(f=>files.push({name:f,path:f}));
  return files;
}
function previewFile(path){
  const _ja=S.lang==='ja';
  if(!path||path==='')return;
  S.previewFile=path;save();
  document.querySelectorAll('.file-tree li').forEach(li=>{
    li.classList.toggle('active',li.getAttribute('data-path')===path);
  });
  if(S.files[path]){
    const raw=S.files[path];
    if(path.endsWith('.md')&&raw.includes('```mermaid')){
      let html=safeMD(raw);
      html=html.replace(/<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g,
        (m,code)=>'<div class="mermaid">'+code.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>')+'</div>');
      $('prevBody').innerHTML=prevToolbar(path,true)+`<div id="mdRendered" class="md-rendered">${html}</div>`;
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

function showFilePreview(){
  const _ja=S.lang==='ja';
  if(S.previewFile&&S.files[S.previewFile]){
    previewFile(S.previewFile);
  } else {
    $('prevBody').innerHTML=`<p class="dash-empty">${_ja?'ファイルツリーからファイルを選択してください':'Select a file from the tree'}</p>`;
  }
}

function escHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

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

