/* ═══ GLOBAL STATE ═══ */
const $=id=>document.getElementById(id);
const KEY='devforge-v9';
const V=9;
var SKILL_TIERS=['beginner','beginner','intermediate','intermediate','pro','pro','pro'];
function skillTier(lv){return SKILL_TIERS[lv]||'intermediate';}
var SKILL_NAMES=[
  {ja:'完全初心者',en:'Absolute Beginner',emoji:'🔰'},
  {ja:'初心者',en:'Beginner',emoji:'🌱'},
  {ja:'慣れ始め',en:'Getting Started',emoji:'📗'},
  {ja:'中級者',en:'Intermediate',emoji:'⚡'},
  {ja:'上級者',en:'Advanced',emoji:'🔥'},
  {ja:'エキスパート',en:'Expert',emoji:'💎'},
  {ja:'伝道者',en:'Evangelist',emoji:'👑'}
];
let S={phase:0,step:0,answers:{},answersSnapshot:null,projectName:'',skill:'intermediate',skillLv:3,preset:'custom',lang:'ja',genLang:'ja',theme:'dark',pillar:0,previewFile:null,files:{},skipped:[],progress:{},editedFiles:{},prevFiles:{},qbarDismissed:false,pinnedFiles:[],recentFiles:[],sidebarOpen:true,exportedOnce:false,compatAcked:[],_v:V};
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function escAttr(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');}
function _jp(s,d){if(s==null)return d;try{return JSON.parse(s);}catch(e){return d;}}
function sanitize(s,max=500){if(!s||typeof s!=='string')return '';return s.replace(/<[^>]*>/g,'').slice(0,max).trim();}
function sanitizeName(s){if(!s||typeof s!=='string')return '';return s.replace(/[<>"'&\\\/]/g,'').slice(0,100).trim();}
function fileSlug(s){if(!s)return 'devforge-project';const r=s.replace(/[^a-zA-Z0-9\s_-]/g,'').replace(/[\s_]+/g,'-').replace(/-{2,}/g,'-').replace(/^-|-$/g,'').slice(0,80);return r||'devforge-project';}
function _filterProto(obj){if(!obj||typeof obj!=='object')return obj;['__proto__','constructor','prototype'].forEach(k=>{delete obj[k];});return obj;}
// Toast stacking state
let _toastStack=[];
const _maxToasts=5;

function toast(m,opts){
  if(typeof m==='string'&&!opts){opts={};}else if(typeof m==='object'){opts=m;m=opts.message||'';}
  const {type='info',duration=2200,undoFn=null,action=null,actionLabel='Undo'}=opts;

  const t=document.createElement('div');
  t.className='toast-msg toast-'+type;
  t.setAttribute('role','alert');

  let html='<span class="toast-text">'+esc(m)+'</span>';

  // Undo button
  if(undoFn){
    html+='<button class="toast-action" aria-label="'+esc(actionLabel)+'">'+esc(actionLabel)+'</button>';
  }else if(action){
    html+='<button class="toast-action" aria-label="'+esc(actionLabel)+'">'+esc(actionLabel)+'</button>';
  }

  t.innerHTML=html;

  // Action handlers
  if(undoFn){
    const btn=t.querySelector('.toast-action');
    if(btn){
      btn.onclick=()=>{
        undoFn();
        t.remove();
        _toastStack=_toastStack.filter(x=>x!==t);
        repositionToasts();
      };
    }
  }else if(action){
    const btn=t.querySelector('.toast-action');
    if(btn){
      btn.onclick=()=>{
        action();
        t.remove();
        _toastStack=_toastStack.filter(x=>x!==t);
        repositionToasts();
      };
    }
  }

  // Stack management
  if(_toastStack.length>=_maxToasts){
    const oldest=_toastStack.shift();
    if(oldest)oldest.remove();
  }

  _toastStack.push(t);
  document.body.appendChild(t);

  repositionToasts();

  if(typeof announce==='function')announce(m);

  // Auto-remove
  const autoRemove=setTimeout(()=>{
    t.classList.add('toast-exit');
    setTimeout(()=>{
      t.remove();
      _toastStack=_toastStack.filter(x=>x!==t);
      repositionToasts();
    },200);
  },duration);

  // Clear timeout if manually dismissed
  t._autoRemove=autoRemove;
}

function repositionToasts(){
  const qb=$('qbar');
  const qbHeight=qb&&!S.qbarDismissed?72:0;
  _toastStack.forEach((t,i)=>{
    const bottom=qbHeight+16+(i*60);
    t.style.bottom=bottom+'px';
  });
}
function hasDM(m){return (S.answers.dev_methods||'').includes(m);}
let _lsOK=true;try{localStorage.setItem('_t','1');localStorage.removeItem('_t');}catch(e){_lsOK=false;}
function _lsGet(k){if(!_lsOK)return null;try{return localStorage.getItem(k);}catch(e){return null;}}
function _lsSet(k,v){if(!_lsOK)return;try{localStorage.setItem(k,v);}catch(e){}}
function _lsRm(k){if(!_lsOK)return;try{localStorage.removeItem(k);}catch(e){}}
function _lsUsage(){try{const bytes=JSON.stringify(localStorage).length*2;return{used:bytes,pct:Math.round(bytes/(5*1024*1024)*100)};}catch(e){return{used:0,pct:0};}}

// IndexedDB auto-backup (max 5 generations, debounced 60s)
const _IDB_NAME='devforge-backup';
const _IDB_STORE='snapshots';
const _IDB_MAX=5;
let _idbDb=null;
let _idbTimer=null;
function _idbOpen(cb){
  if(_idbDb){cb(_idbDb);return;}
  if(!window.indexedDB){cb(null);return;}
  try{
    const req=indexedDB.open(_IDB_NAME,1);
    req.onupgradeneeded=e=>{const db=e.target.result;if(!db.objectStoreNames.contains(_IDB_STORE))db.createObjectStore(_IDB_STORE,{keyPath:'ts'});};
    req.onsuccess=e=>{_idbDb=e.target.result;cb(_idbDb);};
    req.onerror=()=>cb(null);
  }catch(e){cb(null);}
}
function _idbSave(){
  _idbOpen(db=>{
    if(!db)return;
    const ts=Date.now();
    const data=JSON.stringify(S);
    const label=new Date(ts).toLocaleString();
    try{
      const tx=db.transaction(_IDB_STORE,'readwrite');
      const store=tx.objectStore(_IDB_STORE);
      store.put({ts,data,label});
      // Trim to max 5 entries
      const req=store.getAll();
      req.onsuccess=e=>{
        const all=(e.target.result||[]).sort((a,b)=>b.ts-a.ts);
        if(all.length>_IDB_MAX){
          const tx2=db.transaction(_IDB_STORE,'readwrite');
          const s2=tx2.objectStore(_IDB_STORE);
          all.slice(_IDB_MAX).forEach(item=>s2.delete(item.ts));
        }
      };
    }catch(e){}
  });
}
function idbBackupDebounced(){
  clearTimeout(_idbTimer);
  _idbTimer=setTimeout(_idbSave,60000);
}
function idbBackupImmediate(){
  clearTimeout(_idbTimer);
  _idbSave();
}
function idbListBackups(cb){
  _idbOpen(db=>{
    if(!db){cb([]);return;}
    try{
      const tx=db.transaction(_IDB_STORE,'readonly');
      const req=tx.objectStore(_IDB_STORE).getAll();
      req.onsuccess=e=>cb((e.target.result||[]).sort((a,b)=>b.ts-a.ts));
      req.onerror=()=>cb([]);
    }catch(e){cb([]);}
  });
}
function idbRestoreBackup(ts,cb){
  _idbOpen(db=>{
    if(!db){cb(false);return;}
    try{
      const tx=db.transaction(_IDB_STORE,'readonly');
      const req=tx.objectStore(_IDB_STORE).get(ts);
      req.onsuccess=e=>{
        if(!e.target.result){cb(false);return;}
        try{
          const o=JSON.parse(e.target.result.data);
          const _ja=S.lang==='ja';
          // Re-use the load() logic by temporarily injecting to localStorage then reloading
          if(_lsOK){
            _lsSet(KEY,e.target.result.data);
            load();
            save();
            cb(true);
          }else{cb(false);}
        }catch(err){cb(false);}
      };
      req.onerror=()=>cb(false);
    }catch(e){cb(false);}
  });
}
function showIDBRestoreUI(){
  const _ja=S.lang==='ja';
  idbListBackups(backups=>{
    const overlay=document.createElement('div');
    overlay.className='modal-overlay';
    overlay.id='idbRestoreModal';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label',_ja?'バックアップから復元':'Restore from Backup');
    let html='<div class="modal-box" style="max-width:460px"><div class="modal-header">';
    html+='<h3 class="modal-title">💾 '+(_ja?'バックアップから復元':'Restore from Backup')+'</h3>';
    html+='<button class="modal-close" onclick="document.getElementById(\'idbRestoreModal\').remove()" aria-label="Close">✕</button>';
    html+='</div><div class="modal-body">';
    if(!backups.length){
      html+='<p style="text-align:center;color:var(--text-muted);padding:20px 0">'+
        (_ja?'💾 まだバックアップがありません。<br>操作を続けると60秒後に自動保存されます。':
             '💾 No backups yet.<br>Backups are auto-saved 60 seconds after your last action.')+'</p>';
    }else{
    html+='<p style="margin:0 0 12px;color:var(--text-muted);font-size:13px">'+(_ja?'保存されたバックアップを選択して復元します。現在の作業内容は上書きされます。':'Select a saved backup to restore. Your current work will be overwritten.')+'</p>';
    backups.forEach((b,i)=>{
      html+='<div style="display:flex;align-items:center;gap:8px;padding:8px;border:1px solid var(--border);border-radius:6px;margin-bottom:6px">';
      html+='<span style="font-size:20px">💾</span><div style="flex:1"><div style="font-weight:500">'+esc(b.label)+'</div>';
      if(i===0)html+='<div style="font-size:11px;color:var(--accent)">'+(_ja?'最新':'Latest')+'</div>';
      html+='</div>';
      html+='<button class="btn btn-sm btn-primary" onclick="idbDoRestore('+b.ts+')">'+(_ja?'復元':'Restore')+'</button>';
      html+='</div>';
    });
    }
    html+='</div></div>';
    overlay.innerHTML=html;
    overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
    document.body.appendChild(overlay);
  });
}
function idbDoRestore(ts){
  const _ja=S.lang==='ja';
  const modal=document.getElementById('idbRestoreModal');
  if(modal)modal.remove();
  idbRestoreBackup(ts,ok=>{
    if(ok){
      toast(_ja?'✅ バックアップから復元しました':'✅ Restored from backup',{type:'success'});
      if(typeof renderApp==='function')renderApp();
      else location.reload();
    }else{
      toast(_ja?'❌ 復元に失敗しました':'❌ Restore failed',{type:'error'});
    }
  });
}

// Save indicator (HCD: ⑥文脈適合)
function showSaveIndicator(){
  let ind=$('saveIndicator');
  if(!ind){
    ind=document.createElement('div');
    ind.id='saveIndicator';
    ind.className='save-indicator';
    ind.innerHTML='💾';
    document.body.appendChild(ind);
  }
  ind.classList.add('save-indicator-show');
  setTimeout(()=>ind.classList.remove('save-indicator-show'),800);
}

var _storWarnAt=0;
function save(){const d=JSON.stringify(S);const sz=d.length;const now=Date.now();if(now-_storWarnAt>30000){const lsU=_lsUsage();if(lsU.pct>=90){toast(S.lang==='ja'?'🚨 ストレージ'+lsU.pct+'%使用中。古いプロジェクトを削除してください':'🚨 Storage '+lsU.pct+'% full. Delete old projects.',{type:'error',duration:6000});_storWarnAt=now;}else if(lsU.pct>=80){toast(S.lang==='ja'?'⚠️ ストレージ'+lsU.pct+'%使用中。ZIPエクスポート推奨':'⚠️ Storage '+lsU.pct+'% full. Export ZIP recommended.',{type:'warn',duration:4000});_storWarnAt=now;}else if(sz>4*1024*1024){toast(S.lang==='ja'?'⚠️ データ容量が4MBを超えました。ZIPでエクスポートし生成ファイルをクリアしてください':'⚠️ Data exceeded 4MB. Export ZIP and clear generated files.',{type:'error',duration:5000});_storWarnAt=now;}else if(sz>3.5*1024*1024){toast(S.lang==='ja'?'💾 データ容量が3.5MBに近づいています。ZIPエクスポートを推奨します':'💾 Storage nearing 3.5MB. Export ZIP recommended.',{type:'warn',duration:4000});_storWarnAt=now;}}if(_lsOK){try{localStorage.setItem(KEY,d);}catch(e){toast(S.lang==='ja'?'❌ 保存失敗: ブラウザストレージが満杯です。ZIPでエクスポートしてください':'❌ Save failed: Browser storage full. Export as ZIP.',{type:'error',duration:6000});return;}}showSaveIndicator();idbBackupDebounced();}
function load(){
  let d=_lsGet(KEY);
  if(!d){d=_lsGet('devforge-v8');if(d)_lsRm('devforge-v8');}
  // Migrate legacy dfv8_ keys to devforge- namespace
  const _legacyTpl=_lsGet('dfv8_templates');if(_legacyTpl){_lsSet('devforge-templates',_legacyTpl);_lsRm('dfv8_templates');}
  // Migrate dfv8_road_* keys
  try{const ps=_jp(_lsGet('devforge-projects'),{});Object.keys(ps).forEach(n=>{const lk='dfv8_road_'+n;const nk='devforge-road-'+n;const v=_lsGet(lk);if(v&&!_lsGet(nk)){_lsSet(nk,v);}_lsRm(lk);});}catch(e){}
  if(!d)return;
  try{
    const o=JSON.parse(d);
    if(typeof o.phase==='number')S.phase=o.phase;
    if(typeof o.step==='number')S.step=o.step;
    if(o.answers&&typeof o.answers==='object'&&!Array.isArray(o.answers))S.answers=_filterProto(o.answers);
    if(typeof o.projectName==='string')S.projectName=o.projectName;
    if(typeof o.skill==='string')S.skill=o.skill;
    if(typeof o.skillLv==='number'&&!isNaN(o.skillLv)&&o.skillLv>=0&&o.skillLv<=6){S.skillLv=Math.min(6,Math.max(0,Math.round(o.skillLv)));S.skill=skillTier(S.skillLv);}else{S.skillLv=S.skill==='beginner'?1:S.skill==='pro'?5:3;}
    if(typeof o.preset==='string')S.preset=o.preset;
    if(typeof o.lang==='string')S.lang=o.lang;
    if(typeof o.genLang==='string')S.genLang=o.genLang;
    if(typeof o.theme==='string')S.theme=o.theme;
    if(typeof o.pillar==='number')S.pillar=o.pillar;
    if(typeof o.previewFile==='string'||o.previewFile===null)S.previewFile=o.previewFile;
    if(o.files&&typeof o.files==='object'&&!Array.isArray(o.files))S.files=_filterProto(o.files);
    if(Array.isArray(o.skipped))S.skipped=o.skipped;
    if(o.progress&&typeof o.progress==='object'&&!Array.isArray(o.progress))S.progress=o.progress;
    if(o.editedFiles&&typeof o.editedFiles==='object'&&!Array.isArray(o.editedFiles))S.editedFiles=_filterProto(o.editedFiles);
    if(o.prevFiles&&typeof o.prevFiles==='object'&&!Array.isArray(o.prevFiles))S.prevFiles=_filterProto(o.prevFiles);
    if(typeof o.qbarDismissed==='boolean')S.qbarDismissed=o.qbarDismissed;
    if(Array.isArray(o.pinnedFiles))S.pinnedFiles=o.pinnedFiles;
    if(Array.isArray(o.recentFiles))S.recentFiles=o.recentFiles;
    if(typeof o.sidebarOpen==='boolean')S.sidebarOpen=o.sidebarOpen;
    if(typeof o.exportedOnce==='boolean')S.exportedOnce=o.exportedOnce;
    if(Array.isArray(o.compatAcked))S.compatAcked=o.compatAcked;
    if(o.answersSnapshot&&typeof o.answersSnapshot==='object')S.answersSnapshot=_filterProto(o.answersSnapshot);
    if(typeof o._v==='number')S._v=o._v;
    if(!S._v||S._v<V){
      S.genLang=S.genLang||S.lang||'ja';
      S.editedFiles=S.editedFiles||{};
      S.prevFiles=S.prevFiles||{};
      S._v=V;
      save();
    }
  }catch(e){_lsRm(KEY);}
}
if(typeof window!=='undefined'&&window.addEventListener)window.addEventListener('beforeunload',function(){idbBackupImmediate();});
let voiceRec=null,voiceBtn=null,_confirmCb=null;
