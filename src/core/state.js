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
let S={phase:0,step:0,answers:{},projectName:'',skill:'intermediate',skillLv:3,preset:'custom',lang:'ja',genLang:'ja',theme:'dark',pillar:0,previewFile:null,files:{},skipped:[],progress:{},editedFiles:{},prevFiles:{},qbarDismissed:false,pinnedFiles:[],recentFiles:[],sidebarOpen:true,_v:V};
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
function save(){const d=JSON.stringify(S);const sz=d.length;const now=Date.now();if(now-_storWarnAt>30000){if(sz>4*1024*1024){toast(S.lang==='ja'?'⚠️ データ容量が4MBを超えました。ZIPでエクスポートし生成ファイルをクリアしてください':'⚠️ Data exceeded 4MB. Export ZIP and clear generated files.',{type:'error',duration:5000});_storWarnAt=now;}else if(sz>3.5*1024*1024){toast(S.lang==='ja'?'💾 データ容量が3.5MBに近づいています。ZIPエクスポートを推奨します':'💾 Storage nearing 3.5MB. Export ZIP recommended.',{type:'warn',duration:4000});_storWarnAt=now;}}if(_lsOK){try{localStorage.setItem(KEY,d);}catch(e){toast(S.lang==='ja'?'❌ 保存失敗: ブラウザストレージが満杯です。ZIPでエクスポートしてください':'❌ Save failed: Browser storage full. Export as ZIP.',{type:'error',duration:6000});return;}}showSaveIndicator();}
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
