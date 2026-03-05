/* ═══ V9 PROJECT MANAGER ═══ */
const _SAFE_KEYS=['phase','step','answers','projectName','skill','skillLv','preset','lang','genLang','theme','pillar','previewFile','files','skipped','progress','editedFiles','prevFiles','_v'];
function getProjects(){return _jp(_lsGet('devforge-projects'),{});}
function saveProject(){
  if(!S.projectName)return;
  const ps=getProjects();
  ps[S.projectName]={state:JSON.parse(JSON.stringify(S)),date:new Date().toISOString()};
  _lsSet('devforge-projects',JSON.stringify(ps));
}
function switchProject(name){
  const ps=getProjects();const p=ps[name];
  if(p&&p.state){
    _SAFE_KEYS.forEach(k=>{if(Object.prototype.hasOwnProperty.call(p.state,k)){const v=p.state[k];S[k]=(v&&typeof v==='object'&&!Array.isArray(v))?_filterProto(v):v;}});
    save();location.reload();
  }
}
function deleteProject(name){
  const _ja=S.lang==='ja';
  if(!confirm(_ja?'「'+name+'」を削除しますか？':'Delete "'+name+'"?'))return;
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
        const data=_jp(ev.target.result,null);
        if(!data.state||!data.state.projectName){toast(_ja?'❌ 無効なファイル形式':'❌ Invalid file format');return;}
        data.state.projectName=sanitizeName(data.state.projectName);
        if(data.state.answers){
          Object.keys(data.state.answers).forEach(k=>{
            if(['__proto__','constructor','prototype'].includes(k)){delete data.state.answers[k];return;}
            if(typeof data.state.answers[k]==='string'){
              data.state.answers[k]=sanitize(data.state.answers[k]);
            } else {
              delete data.state.answers[k];
            }
          });
        }
        if(data.state.files){
          Object.keys(data.state.files).forEach(k=>{
            if(['__proto__','constructor','prototype'].includes(k)){delete data.state.files[k];return;}
            if(typeof data.state.files[k]!=='string'){delete data.state.files[k];}
          });
        }
        ['editedFiles','prevFiles'].forEach(function(fld){
          if(data.state[fld]&&typeof data.state[fld]==='object'){
            Object.keys(data.state[fld]).forEach(k=>{
              if(['__proto__','constructor','prototype'].includes(k)){delete data.state[fld][k];return;}
              if(typeof data.state[fld][k]!=='string'){delete data.state[fld][k];}
            });
          }
        });
        if(data.state.skipped&&!Array.isArray(data.state.skipped))delete data.state.skipped;
        const ps=getProjects();
        ps[data.state.projectName]=data;
        _lsSet('devforge-projects',JSON.stringify(ps));
        _SAFE_KEYS.forEach(k=>{if(Object.prototype.hasOwnProperty.call(data.state,k))S[k]=data.state[k];});
        save();
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
      const estKB=Math.round(JSON.stringify(ps[name]).length/512);
      html+='<div class="pm-item'+(isCurrent?' current':'')+'" onclick="switchProject(\''+escAttr(name)+'\')"><div><div class="pm-item-name">'+esc(name)+(isCurrent?' ✓':'')+'</div><div class="pm-item-meta">'+meta+' · ~'+estKB+'KB</div></div><div class="pm-item-acts"><button onclick="event.stopPropagation();deleteProject(\''+escAttr(name)+'\')" aria-label="'+(escAttr(_ja?'削除':'Delete'))+'">🗑️</button></div></div>';
    });
  }
  const usg=typeof _lsUsage==='function'?_lsUsage():{used:0,pct:0};
  const usgColor=usg.pct>=80?'var(--danger)':usg.pct>=60?'var(--warn)':'var(--success)';
  html+='<div class="pm-storage"><div class="pm-storage-label"><span>'+(usg.pct)+'% '+(_ja?'使用中':'used')+' (~'+Math.round(usg.used/1024)+'KB / 5120KB)</span></div><div class="pm-storage-bar"><div class="pm-storage-fill" style="width:'+Math.min(100,usg.pct)+'%;background:'+usgColor+'"></div></div></div>';
  html+='<div class="pm-actions"><button class="btn btn-s" onclick="newProject()">➕ '+(_ja?'新規プロジェクト':'New Project')+'</button><button class="btn btn-s" onclick="importProject()">📥 '+(_ja?'インポート':'Import')+'</button>';
  if(S.projectName)html+='<button class="btn btn-s" onclick="exportProject()">📤 '+(_ja?'エクスポート':'Export')+'</button>';
  html+='<button class="btn btn-g btn-sm" onclick="closePM()">'+(_ja?'閉じる':'Close')+'</button></div></div>';
  ov.innerHTML=html;
  trapFocus(ov);
}
function closePM(){$('pmOverlay').style.display='none';releaseFocus($('pmOverlay'));removeModal($('pmOverlay'));}
