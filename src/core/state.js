/* ═══ GLOBAL STATE ═══ */
const $=id=>document.getElementById(id);
const KEY='devforge-v9';
const V=9;
let S={phase:0,step:0,answers:{},projectName:'',skill:'intermediate',preset:'custom',lang:'ja',genLang:'ja',theme:'dark',pillar:0,previewFile:null,files:{},skipped:[],progress:{},editedFiles:{},prevFiles:{},qbarDismissed:false,pinnedFiles:[],recentFiles:[],_v:V};
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function escAttr(s){return String(s).replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/"/g,'&quot;');}
function _jp(s,d){if(s==null)return d;try{return JSON.parse(s);}catch(e){return d;}}
function sanitize(s,max=500){if(!s||typeof s!=='string')return '';return s.replace(/<[^>]*>/g,'').slice(0,max).trim();}
function sanitizeName(s){if(!s||typeof s!=='string')return '';return s.replace(/[<>"'&\\\/]/g,'').slice(0,100).trim();}
function fileSlug(s){if(!s)return 'devforge-project';const r=s.replace(/[^a-zA-Z0-9\s_-]/g,'').replace(/[\s_]+/g,'-').replace(/-{2,}/g,'-').replace(/^-|-$/g,'').slice(0,80);return r||'devforge-project';}
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

function save(){const d=JSON.stringify(S);if(d.length>4*1024*1024)console.warn('DevForge: state exceeds 4MB');_lsSet(KEY,d);showSaveIndicator();}
function load(){
  let d=_lsGet(KEY);
  if(!d){d=_lsGet('devforge-v8');if(d)_lsRm('devforge-v8');}
  // Migrate legacy dfv8_ keys to devforge- namespace
  const _legacyTpl=_lsGet('dfv8_templates');if(_legacyTpl){_lsSet('devforge-templates',_legacyTpl);_lsRm('dfv8_templates');}
  // Migrate dfv8_road_* keys
  try{const ps=JSON.parse(_lsGet('devforge-projects')||'{}');Object.keys(ps).forEach(n=>{const lk='dfv8_road_'+n;const nk='devforge-road-'+n;const v=_lsGet(lk);if(v&&!_lsGet(nk)){_lsSet(nk,v);}_lsRm(lk);});}catch(e){}
  if(!d)return;
  try{
    const o=JSON.parse(d);
    if(typeof o.phase==='number')S.phase=o.phase;
    if(typeof o.step==='number')S.step=o.step;
    if(o.answers&&typeof o.answers==='object'&&!Array.isArray(o.answers))S.answers=o.answers;
    if(typeof o.projectName==='string')S.projectName=o.projectName;
    if(typeof o.skill==='string')S.skill=o.skill;
    if(typeof o.preset==='string')S.preset=o.preset;
    if(typeof o.lang==='string')S.lang=o.lang;
    if(typeof o.genLang==='string')S.genLang=o.genLang;
    if(typeof o.theme==='string')S.theme=o.theme;
    if(typeof o.pillar==='number')S.pillar=o.pillar;
    if(typeof o.previewFile==='string'||o.previewFile===null)S.previewFile=o.previewFile;
    if(o.files&&typeof o.files==='object'&&!Array.isArray(o.files))S.files=o.files;
    if(Array.isArray(o.skipped))S.skipped=o.skipped;
    if(o.progress&&typeof o.progress==='object'&&!Array.isArray(o.progress))S.progress=o.progress;
    if(o.editedFiles&&typeof o.editedFiles==='object'&&!Array.isArray(o.editedFiles))S.editedFiles=o.editedFiles;
    if(o.prevFiles&&typeof o.prevFiles==='object'&&!Array.isArray(o.prevFiles))S.prevFiles=o.prevFiles;
    if(typeof o.qbarDismissed==='boolean')S.qbarDismissed=o.qbarDismissed;
    if(Array.isArray(o.pinnedFiles))S.pinnedFiles=o.pinnedFiles;
    if(Array.isArray(o.recentFiles))S.recentFiles=o.recentFiles;
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
let voiceRec=null,voiceBtn=null,_confirmCb=null;
