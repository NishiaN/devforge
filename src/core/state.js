/* ═══ GLOBAL STATE ═══ */
const $=id=>document.getElementById(id);
const KEY='devforge-v9';
const V=9;
let S={phase:0,step:0,answers:{},projectName:'',skill:'intermediate',preset:'custom',lang:'ja',genLang:'ja',theme:'dark',pillar:0,previewFile:null,files:{},skipped:[],progress:{},editedFiles:{},prevFiles:{},_v:V};
function esc(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML;}
function sanitize(s,max=500){if(!s||typeof s!=='string')return '';return s.replace(/<[^>]*>/g,'').slice(0,max).trim();}
function sanitizeName(s){if(!s||typeof s!=='string')return '';return s.replace(/[<>"'&\\\/]/g,'').slice(0,100).trim();}
function fileSlug(s){if(!s)return 'devforge-project';const r=s.replace(/[^a-zA-Z0-9\s_-]/g,'').replace(/[\s_]+/g,'-').replace(/-{2,}/g,'-').replace(/^-|-$/g,'').slice(0,80);return r||'devforge-project';}
function toast(m){const t=document.createElement('div');t.className='toast-msg';t.textContent=m;t.setAttribute('role','alert');document.body.appendChild(t);if(typeof announce==='function')announce(m);setTimeout(()=>t.remove(),2200);}
function hasDM(m){return (S.answers.dev_methods||'').includes(m);}
let _lsOK=true;try{localStorage.setItem('_t','1');localStorage.removeItem('_t');}catch(e){_lsOK=false;}
function _lsGet(k){if(!_lsOK)return null;try{return localStorage.getItem(k);}catch(e){return null;}}
function _lsSet(k,v){if(!_lsOK)return;try{localStorage.setItem(k,v);}catch(e){}}
function _lsRm(k){if(!_lsOK)return;try{localStorage.removeItem(k);}catch(e){}}
function save(){_lsSet(KEY,JSON.stringify(S));}
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
    Object.assign(S,o);
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
