/* ═══ V9 PROJECT MANAGER ═══ */
function getProjects(){return JSON.parse(_lsGet('devforge-projects')||'{}');}
function saveProject(){
  if(!S.projectName)return;
  const ps=getProjects();
  ps[S.projectName]={state:JSON.parse(JSON.stringify(S)),date:new Date().toISOString()};
  _lsSet('devforge-projects',JSON.stringify(ps));
}
function switchProject(name){
  const ps=getProjects();const p=ps[name];
  if(p&&p.state){Object.assign(S,p.state);save();location.reload();}
}
function deleteProject(name){
  const ps=getProjects();delete ps[name];
  _lsSet('devforge-projects',JSON.stringify(ps));
  if(S.projectName===name){_lsRm(KEY);location.reload();}
  else showPM();
}
function exportProject(){
  const _ja=S.lang==='ja';
  const ps=getProjects();const p=ps[S.projectName];
  if(!p){toast(_ja?'保存されたプロジェクトがありません':'No saved project');return;}
  const blob=new Blob([JSON.stringify(p,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download=fileSlug(S.projectName)+'.devforge.json';a.click();
  URL.revokeObjectURL(url);
  toast(_ja?'📁 プロジェクトをエクスポートしました':'📁 Project exported');
  _lsSet('devforge-last-export',new Date().toISOString());
}
function importProject(){
  const _ja=S.lang==='ja';
  const inp=document.createElement('input');inp.type='file';inp.accept='.json,.devforge.json';
  inp.onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const data=JSON.parse(ev.target.result);
        if(!data.state||!data.state.projectName){toast(_ja?'❌ 無効なファイル形式':'❌ Invalid file format');return;}
        data.state.projectName=sanitizeName(data.state.projectName);
        const ps=getProjects();
        ps[data.state.projectName]=data;
        _lsSet('devforge-projects',JSON.stringify(ps));
        Object.assign(S,data.state);save();
        toast(_ja?'✅ インポート完了':'✅ Import complete');
        location.reload();
      }catch(err){toast(_ja?'❌ 読み込みエラー':'❌ Read error');}
    };
    reader.readAsText(f);
  };
  inp.click();
}
function newProject(){
  if(S.projectName)saveProject();
  _lsRm(KEY);location.reload();
}
function showPM(){
  const _ja=S.lang==='ja';
  const ov=$('pmOverlay');ov.style.display='flex';
  pushModal(ov,()=>{ov.style.display='none';releaseFocus(ov);});
  const ps=getProjects();const names=Object.keys(ps);
  let html='<div class="pm-modal"><h3>'+t('pmTitle')+'</h3>';
  if(names.length===0){html+='<p class="dash-empty">'+t('pmEmpty')+'</p>';}
  else{
    names.forEach(name=>{
      const isCurrent=name===S.projectName;
      const meta=ps[name].date?new Date(ps[name].date).toLocaleDateString():'';
      html+='<div class="pm-item'+(isCurrent?' current':'')+'" onclick="switchProject(\''+name.replace(/'/g,"\\'")+'\')"><div><div class="pm-item-name">'+esc(name)+(isCurrent?' ✓':'')+'</div><div class="pm-item-meta">'+meta+'</div></div><div class="pm-item-acts"><button onclick="event.stopPropagation();deleteProject(\''+name.replace(/'/g,"\\'")+'\')">🗑️</button></div></div>';
    });
  }
  html+='<div class="pm-actions"><button class="btn btn-s" onclick="newProject()">➕ '+(_ja?'新規プロジェクト':'New Project')+'</button><button class="btn btn-s" onclick="importProject()">📥 '+(_ja?'インポート':'Import')+'</button>';
  if(S.projectName)html+='<button class="btn btn-s" onclick="exportProject()">📤 '+(_ja?'エクスポート':'Export')+'</button>';
  html+='<button class="btn btn-g btn-sm" onclick="closePM()">'+(_ja?'閉じる':'Close')+'</button></div></div>';
  ov.innerHTML=html;
  trapFocus(ov);
}
function closePM(){$('pmOverlay').style.display='none';releaseFocus($('pmOverlay'));removeModal($('pmOverlay'));}
