/* ═══ PRESET & START ═══ */
function _updateSkillLabel(lv){
  const _ja=S.lang==='ja';
  var n=SKILL_NAMES[lv]||SKILL_NAMES[3];
  var el=$('skillFineLabel');
  if(el)el.textContent=n.emoji+' '+(_ja?n.ja:n.en);
}
function pickSkillLv(n){
  n=Math.max(0,Math.min(6,+n));
  S.skillLv=n;
  S.skill=skillTier(n);
  // sync card highlight
  var cards=document.querySelectorAll('.skcard');
  cards.forEach(function(c){c.classList.remove('on');c.setAttribute('aria-checked','false');});
  var tIdx={'beginner':0,'intermediate':1,'pro':2}[S.skill];
  if(cards[tIdx]){cards[tIdx].classList.add('on');cards[tIdx].setAttribute('aria-checked','true');}
  _updateSkillLabel(n);
  save();
}
function pickSkill(lv){
  S.skill=lv;
  // Set skillLv to tier's default level
  var defaultLv={'beginner':1,'intermediate':3,'pro':5}[lv]||3;
  S.skillLv=defaultLv;
  document.querySelectorAll('.skcard').forEach(c=>{c.classList.toggle('on',c.dataset.lv===lv);c.setAttribute('aria-checked',String(c.dataset.lv===lv));});
  // Sync slider and label
  var sl=$('skillLvSlider');if(sl){sl.value=S.skillLv;}
  _updateSkillLabel(S.skillLv);
  save();
}

/* Preset category map */
const PRESET_CAT_MAP={
  saas:'saas_ai',ai_agent:'saas_ai',ai_content:'saas_ai',automation:'saas_ai',chatbot:'saas_ai',devtool:'saas_ai',
  ec:'ec_market',marketplace:'ec_market',booking:'ec_market',event:'ec_market',restaurant:'ec_market',
  creator:'media_sns',newsletter:'media_sns',cms:'media_sns',community:'media_sns',linkbio:'media_sns',social:'media_sns',gamify:'media_sns',pwa:'media_sns',
  hr:'business',helpdesk:'business',crm:'business',knowledge_base:'business',contract_mgmt:'business',survey:'business',job_board:'business',
  dashboard:'data_iot',iot:'data_iot',collab:'data_iot',field_service:'data_iot',logistics:'data_iot',
  fintech:'life_pro',health:'life_pro',property_mgmt:'life_pro',veterinary:'life_pro',clinic:'life_pro',construction_pay:'life_pro',lms:'life_pro',tutoring:'life_pro',portfolio:'life_pro',
  factory:'data_iot',agri:'life_pro',energy:'data_iot',media_platform:'media_sns',gov_portal:'business',travel_booking:'life_pro',insurance_mgmt:'life_pro',
};
const PRESET_CATS_JA=[{key:'all',label:'すべて',desc:'全48プリセット'},{key:'saas_ai',label:'☁️ SaaS・AI',desc:'クラウドサービス・AI自動化'},{key:'ec_market',label:'🛒 EC・マーケット',desc:'販売・予約・イベント'},{key:'media_sns',label:'📱 メディア・SNS',desc:'情報発信・クリエイター・交流'},{key:'business',label:'🏢 ビジネス・業務',desc:'業務効率化・HR・CRM'},{key:'data_iot',label:'📊 データ・IoT',desc:'分析・デバイス管理・コラボ'},{key:'life_pro',label:'🏥 生活・専門',desc:'医療・教育・不動産・物流'}];
const PRESET_CATS_EN=[{key:'all',label:'All',desc:'All 48 presets'},{key:'saas_ai',label:'☁️ SaaS & AI',desc:'Cloud services & AI automation'},{key:'ec_market',label:'🛒 E-Commerce',desc:'Sales, booking & events'},{key:'media_sns',label:'📱 Media & SNS',desc:'Content, creator & community'},{key:'business',label:'🏢 Business',desc:'Workflow, HR & CRM'},{key:'data_iot',label:'📊 Data & IoT',desc:'Analytics, devices & collab'},{key:'life_pro',label:'🏥 Life & Pro',desc:'Healthcare, education & logistics'}];
let _presetCatFilter='all';

/* ─── Field Preset Mode ─────────────────────────────────────── */
var _presetMode='standard';   // 'standard' | 'field'
var _fieldScale='small';      // 'solo'|'small'|'medium'|'large'
var _fieldCatFilter='all';    // field category key or 'all'

function _renderFieldChips(){
  const _ja=S.lang==='ja';const _en=!_ja;
  const row=$('presetRow');if(!row||typeof PR_FIELD==='undefined')return;
  Array.from(row.querySelectorAll('.prchip')).forEach(c=>c.remove());
  const insertBefore=row.querySelector('.preset-footer');
  Object.entries(PR_FIELD).forEach(function([k,v]){
    if(!v||!v.name)return;
    if(_fieldCatFilter!=='all'&&v.field!==_fieldCatFilter)return;
    const c=document.createElement('span');c.className='prchip';
    c.textContent=(v.icon||'')+(v.icon?' ':'')+(_en&&v.nameEn?v.nameEn:v.name);
    if(S.preset===('field:'+k))c.classList.add('on');
    c.onclick=function(e){pickFieldPreset(k,e);};
    // Tooltip: scaleHint + meta
    const sh=v.scaleHint&&v.scaleHint[_fieldScale]?(_ja?v.scaleHint[_fieldScale].ja:v.scaleHint[_fieldScale].en):'';
    const m=v.meta||{};
    const revLbl=_ja?'💰':'💰';const regLbl=_ja?'📋規制:':'📋Reg:';const agLbl=_ja?'🤖':'🤖';
    const mmLbl=_ja?'🖼️':'🖼️';const odLbl=_ja?'☁️':'☁️';const apiLbl=_ja?'🔌API:':'🔌API:';
    const metaStr=regLbl+(m.regulation||'-')+' | '+agLbl+(m.agentLv||'-')+' | '+mmLbl+(m.multimodal||'-')+' | '+odLbl+(m.onDevice||'-');
    const purpose=(_en&&v.purposeEn)?v.purposeEn:v.purpose||'';
    c.title=purpose+(sh?'\n─────\n'+sh:'')+'\n─────\n'+metaStr;
    if(insertBefore)row.insertBefore(c,insertBefore);else row.appendChild(c);
  });
}

function pickFieldPreset(k,e){
  const _ja=S.lang==='ja';const _en=!_ja;
  const v=PR_FIELD[k];if(!v)return;
  S.preset='field:'+k;
  document.querySelectorAll('.prchip').forEach(c=>c.classList.remove('on'));
  if(e&&e.target)e.target.classList.add('on');
  if(v.name)$('nameIn').value=(_en&&v.nameEn)?v.nameEn:v.name;
  save();
}

function _switchPresetMode(mode){
  _presetMode=mode;
  const row=$('presetRow');if(!row)return;
  // Sync mode toggle button styles
  const btns=row.querySelectorAll('.preset-mode-btn');
  btns.forEach(function(b){b.classList.toggle('active',b.dataset.mode===mode);});
  // Show/hide scale+field-cat bars
  const scaleSel=row.querySelector('.scale-selector');if(scaleSel)scaleSel.style.display=mode==='field'?'flex':'none';
  const fcBar=row.querySelector('.field-cat-bar');if(fcBar)fcBar.style.display=mode==='field'?'flex':'none';
  const stdBar=row.querySelector('.preset-cat-bar');if(stdBar)stdBar.style.display=mode==='standard'?'flex':'none';
  if(mode==='standard')_renderPresetChips();else _renderFieldChips();
}

var _beginnerPresets=new Set(['saas','lms','portfolio','cms','ec']);
function _renderPresetChips(){
  const row=$('presetRow');if(!row)return;
  const _ja=S.lang==='ja';const _en=!_ja;
  // Remove existing chips (keep category bar + footer)
  Array.from(row.querySelectorAll('.prchip')).forEach(c=>c.remove());
  const insertBefore=row.querySelector('.preset-footer');
  Object.entries(PR).forEach(([k,v])=>{
    if(k==='custom'||!v.name)return;
    // Lv0-1: show only 5 beginner-safe presets
    if(S.skillLv<=1&&!_beginnerPresets.has(k))return;
    const cat=PRESET_CAT_MAP[k]||'saas_ai';
    if(_presetCatFilter!=='all'&&cat!==_presetCatFilter)return;
    const c=document.createElement('span');c.className='prchip';
    c.textContent=(v.icon||'')+(v.icon?' ':'')+(_en&&v.nameEn?v.nameEn:v.name);
    if(S.preset===k)c.classList.add('on');
    c.onclick=(e)=>pickPreset(k,e);
    const desc=(_en&&v.purposeEn)?v.purposeEn:v.purpose||'';
    const fe=v.frontend||'-';const be=v.backend||'-';
    const fts=(_en&&v.featuresEn?v.featuresEn:v.features)||[];
    const ftStr=Array.isArray(fts)?fts.slice(0,3).join(', ')+(fts.length>3?' …':''):fts;
    c.title=desc+'\n─────\nFrontend: '+fe+'\nBackend: '+be+'\nFeatures: '+ftStr;
    if(insertBefore)row.insertBefore(c,insertBefore);else row.appendChild(c);
  });
}

function initPresets(){
  const row=$('presetRow');row.innerHTML='';
  const _ja=S.lang==='ja';

  // ── Mode Toggle (📦 標準 | 🎓 分野別) — hidden for Lv0-1 ──
  if(S.skillLv>=2&&typeof PR_FIELD!=='undefined'){
    const modeBar=document.createElement('div');modeBar.className='preset-mode-toggle';
    const modes=_ja?[{k:'standard',l:'📦 標準'},{k:'field',l:'🎓 分野別'}]:[{k:'standard',l:'📦 Standard'},{k:'field',l:'🎓 Field'}];
    modes.forEach(function(m){
      const b=document.createElement('button');b.className='preset-mode-btn'+((_presetMode===m.k)?' active':'');
      b.dataset.mode=m.k;b.textContent=m.l;
      b.onclick=function(){_switchPresetMode(m.k);};
      modeBar.appendChild(b);
    });
    row.appendChild(modeBar);
  }

  // ── Scale Selector (field mode only) ──
  const scaleKeys=['solo','small','medium','large'];
  const scaleLabels=_ja?['👤 個人','🏠 小規模','🏢 中規模','🏭 大規模']:['👤 Solo','🏠 Small','🏢 Medium','🏭 Large'];
  const scaleSel=document.createElement('div');scaleSel.className='scale-selector';
  scaleSel.style.display=_presetMode==='field'?'flex':'none';
  scaleKeys.forEach(function(sk,i){
    const b=document.createElement('button');b.className='scale-btn'+((_fieldScale===sk)?' active':'');
    b.textContent=scaleLabels[i];b.dataset.scale=sk;
    b.onclick=function(){
      _fieldScale=sk;
      scaleSel.querySelectorAll('.scale-btn').forEach(function(sb){sb.classList.toggle('active',sb.dataset.scale===sk);});
      _renderFieldChips();
    };
    scaleSel.appendChild(b);
  });
  row.appendChild(scaleSel);

  // ── Field Category Bar (field mode only) ──
  const fcBar=document.createElement('div');fcBar.className='field-cat-bar';
  fcBar.style.display=_presetMode==='field'?'flex':'none';
  if(typeof FIELD_CATS_JA!=='undefined'&&typeof FIELD_CATS_EN!=='undefined'){
    const fcats=_ja?FIELD_CATS_JA:FIELD_CATS_EN;
    const trend=typeof FIELD_TREND!=='undefined'?FIELD_TREND:{};
    fcats.forEach(function(fc){
      const b=document.createElement('button');b.className='field-cat-btn'+((_fieldCatFilter===fc.key)?' active':'');
      const stars=fc.key!=='all'&&trend[fc.key]?'⭐'.repeat(trend[fc.key]):'';
      b.textContent=fc.label+(stars?' '+stars:'');b.title=(fc.desc||'')+(stars?' | 成長トレンド:'+stars:'');
      b.onclick=function(){
        _fieldCatFilter=fc.key;
        fcBar.querySelectorAll('.field-cat-btn').forEach(function(fb){fb.classList.toggle('active',fb===b);});
        _renderFieldChips();
      };
      fcBar.appendChild(b);
    });
  }
  row.appendChild(fcBar);

  // ── Standard Category Bar ──
  const catBar=document.createElement('div');catBar.className='preset-cat-bar';catBar.id='presetCatBar';
  catBar.style.display=_presetMode==='standard'?'flex':'none';
  const cats=_ja?PRESET_CATS_JA:PRESET_CATS_EN;
  cats.forEach(cat=>{
    const btn=document.createElement('button');
    btn.className='preset-cat-btn'+(_presetCatFilter===cat.key?' active':'');
    btn.textContent=cat.label;btn.title=cat.desc;
    btn.onclick=()=>{
      _presetCatFilter=cat.key;
      row.querySelectorAll('.preset-cat-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      _renderPresetChips();
    };
    catBar.appendChild(btn);
  });
  // Lv0-1: hide category bar (only 5 presets shown, no need for filters)
  if(S.skillLv<=1)catBar.style.display='none';
  row.appendChild(catBar);

  // Footer area (compare + custom + notice) — appended BEFORE chips so _renderPresetChips can insertBefore it
  const footer=document.createElement('div');footer.className='preset-footer';
  // Compare button (hidden for Lv0-1)
  const cb=document.createElement('span');cb.className='prchip prchip-cmp';
  cb.textContent=_ja?'⚔️ 比較':'⚔️ Compare';
  cb.onclick=()=>showPresetCompare();
  if(S.skillLv<=1)cb.style.display='none';
  footer.appendChild(cb);
  // "Start from scratch" custom mode chip
  const cs=document.createElement('span');cs.className='prchip prchip-custom';
  cs.textContent=_ja?'📝 白紙から始める':'📝 Start from scratch';
  cs.onclick=()=>{
    S.preset='custom';
    document.querySelectorAll('.prchip').forEach(c=>c.classList.remove('sel'));
    cs.classList.add('sel');
    toast(_ja?'カスタムモード — 全質問に回答します':'Custom mode — answer all questions');
  };
  footer.appendChild(cs);
  // localStorage safety notice
  const notice=document.createElement('div');notice.className='preset-storage-notice';
  notice.innerHTML='<span>💾 '+(  _ja
    ?'データはこのブラウザのみに保存されます。履歴消去で消えます — 完了後は必ずZIPで保存を'
    :'Data is saved in this browser only. Clearing history erases it — always download ZIP when done'
  )+'</span>';
  footer.appendChild(notice);
  row.appendChild(footer);
  // Render chips (inserted before footer)
  if(_presetMode==='field')_renderFieldChips();else _renderPresetChips();
}

function showPresetCompare(){
  const _ja=S.lang==='ja';const _en=S.lang==='en';
  const keys=Object.keys(PR).filter(k=>k!=='custom'&&PR[k].name);
  const opts=keys.map(k=>{const p=PR[k];return `<option value="${k}">${p.icon||''} ${_en&&p.nameEn?p.nameEn:p.name}</option>`;}).join('');
  const ov=document.createElement('div');ov.className='guide-overlay';ov.id='cmpOv';
  ov.setAttribute('role','dialog');
  ov.setAttribute('aria-modal','true');
  ov.setAttribute('aria-label',_ja?'テンプレート比較':'Template Comparison');
  ov.onclick=e=>{if(e.target===ov)ov.remove();};
  ov.addEventListener('keydown',e=>{if(e.key==='Escape')ov.remove();});
  ov.innerHTML=`<div class="guide-modal" style="max-width:680px;width:95%;">
    <div class="guide-header"><span class="guide-em">⚔️</span><div><div class="guide-title">${_ja?'テンプレート比較':'Template Comparison'}</div><div class="guide-sub">${_ja?'2つのプリセットを並べて比較':'Compare two presets side by side'}</div></div><button class="guide-close" aria-label="${_ja?'閉じる':'Close'}" onclick="$('cmpOv').remove()">✕</button></div>
    <div class="cmp-selectors"><select id="cmpA" aria-label="${_ja?'比較対象A':'Comparison subject A'}" onchange="renderCompare()">${opts}</select><span class="cmp-vs">VS</span><select id="cmpB" aria-label="${_ja?'比較対象B':'Comparison subject B'}" onchange="renderCompare()">${opts.replace('value="'+keys[0]+'"','value="'+keys[1]+'"')}</select></div>
    <div id="cmpBody"></div>
  </div>`;
  document.body.appendChild(ov);
  $('cmpB').value=keys[1];
  renderCompare();
}
function renderCompare(){
  const _ja=S.lang==='ja';const _en=S.lang==='en';
  const a=PR[$('cmpA').value];const b=PR[$('cmpB').value];
  const n=k=>(_en&&k+'En' in a)?a[k+'En']:a[k];
  const nb=k=>(_en&&k+'En' in b)?b[k+'En']:b[k];
  const ft=v=>{const f=Array.isArray(v)?v:[];return f.length;};
  const rows=[
    [_ja?'目的':'Purpose',n('purpose')||'-',nb('purpose')||'-'],
    ['Frontend',a.frontend||'-',b.frontend||'-'],
    ['Backend',a.backend||'-',b.backend||'-'],
    [_ja?'機能数':'Features',ft(_en?a.featuresEn:a.features),ft(_en?b.featuresEn:b.features)],
    ['Mobile',a.mobile||'none',b.mobile||'none'],
    ['AI',a.ai_auto||'none',b.ai_auto||'none'],
    [_ja?'決済':'Payment',a.payment||'none',b.payment||'none'],
    ['Entities',(a.entities||'').split(',').length,(b.entities||'').split(',').length],
  ];
  let h='<table class="cmp-table"><tr><th></th><th>'+(a.icon||'')+' '+(n('name')||'')+'</th><th>'+(b.icon||'')+' '+(nb('name')||'')+'</th></tr>';
  rows.forEach(r=>{
    const diff=String(r[1])!==String(r[2]);
    h+=`<tr${diff?' class="cmp-diff"':''}><td class="cmp-label">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`;
  });
  h+='</table>';
  $('cmpBody').innerHTML=h;
}

function pickPreset(k,e){
  S.preset=k;
  document.querySelectorAll('.prchip').forEach(c=>c.classList.remove('on'));
  if(e&&e.target)e.target.classList.add('on');
  const p=PR[k];
  if(p&&p.name)$('nameIn').value=(S.lang==='en'&&p.nameEn)?p.nameEn:p.name;
  save();
}

function start(){
  const _ja=S.lang==='ja';
  const name=sanitizeName($('nameIn').value);
  if(!name){toast(_ja?'プロジェクト名を入力してください':'Please enter a project name');return;}
  S.projectName=name;S.phase=1;S.step=0;S.skipped=[];
  // Lv0 forced preset: absolute beginners get SaaS preset auto-selected
  if(S.skillLv===0&&S.preset==='custom'){
    S.preset='saas';
    loadPreset('saas');
    toast(_ja?'初心者向けにSaaSプリセットを自動選択しました':'Auto-selected SaaS preset for beginners');
  }
  const _en=S.lang==='en';
  // ── Field Preset Mode: apply scale defaults then field preset overrides ──
  var _isFieldPreset=S.preset&&S.preset.indexOf('field:')==='field:'.indexOf('field:')&&S.preset.slice(0,6)==='field:';
  if(_isFieldPreset&&typeof PR_FIELD!=='undefined'&&typeof _SCALE_DEFAULTS!=='undefined'){
    const fk=S.preset.slice(6);
    const fp=PR_FIELD[fk];
    const sd=_SCALE_DEFAULTS[_fieldScale]||_SCALE_DEFAULTS.small;
    if(fp){
      // Apply scale defaults first
      if(sd.frontend)S.answers.frontend=sd.frontend;
      if(sd.backend)S.answers.backend=sd.backend;
      if(sd.deploy)S.answers.deploy=sd.deploy;
      if(sd.ai_auto)S.answers.ai_auto=sd.ai_auto;
      // Then apply field preset specifics
      if(fp.purpose)S.answers.purpose=(_en&&fp.purposeEn)?fp.purposeEn:fp.purpose;
      if(fp.target){const t=_en&&fp.targetEn?fp.targetEn:fp.target;S.answers.target=Array.isArray(t)?t.join(', '):t;}
      if(fp.features){const f=_en&&fp.featuresEn?fp.featuresEn:fp.features;S.answers.mvp_features=Array.isArray(f)?f.join(', '):f;}
      if(fp.entities)S.answers.data_entities=fp.entities;
    }
    var presetName=fp&&fp.name?(_en&&fp.nameEn?fp.nameEn:fp.name):'';
    var preFilledCount=Object.keys(S.answers).length;
    save();saveProject();
    const onbF=$('onboard');const wsF=$('ws');
    onbF.classList.add('phase-exit');
    setTimeout(()=>{onbF.style.display='none';wsF.style.display='flex';wsF.classList.add('phase-enter');setTimeout(()=>wsF.classList.remove('phase-enter'),300);},200);
    if(typeof initSidebar==='function')initSidebar();
    initPills();updProgress();
    if(S.skillLv<=1){addMsg('bot',_ja?'🌱 質問に答えるだけで設計書が自動生成されます。難しく考えなくてOK！スキップもできます。':'🌱 Just answer the questions and design docs will be auto-generated. Don\'t overthink it — you can skip any question!');}
    showQ();
    if(presetName&&preFilledCount>0){toast(_ja?'✅ "'+presetName+'" ['+(_ja?_fieldScale:'Scale:')+_fieldScale+'] を適用 — '+preFilledCount+'件の回答を自動入力':'✅ Applied "'+presetName+'" [Scale:'+_fieldScale+'] — '+preFilledCount+' answers pre-filled');}
    return;
  }
  const p=PR[S.preset];
  if(p&&p.name){
    if(p.purpose)S.answers.purpose=(_en&&p.purposeEn)?p.purposeEn:p.purpose;
    if(p.target){const t=_en&&p.targetEn?p.targetEn:p.target;S.answers.target=Array.isArray(t)?t.join(', '):t;}
    if(p.frontend)S.answers.frontend=p.frontend;
    if(p.backend)S.answers.backend=p.backend;
    if(p.features){const f=_en&&p.featuresEn?p.featuresEn:p.features;S.answers.mvp_features=Array.isArray(f)?f.join(', '):f;}
    if(p.entities)S.answers.data_entities=p.entities;
    if(p.mobile&&p.mobile!=='none')S.answers.mobile=p.mobile;
    if(p.ai_auto&&p.ai_auto!=='none'){
      if(_en){
        const _aiMap={'Vibe Coding入門':'Vibe Coding Intro','エージェント型開発':'Agentic Dev','マルチAgent協調':'Multi-Agent','フル自律開発':'Full Autonomous','オーケストレーター':'Orchestrator'};
        S.answers.ai_auto=_aiMap[p.ai_auto]||p.ai_auto;
      } else { S.answers.ai_auto=p.ai_auto; }
    }
    if(p.payment&&p.payment!=='none'){
      const _payMap=_en
        ?{stripe:'Stripe',ec_build:'Stripe, Medusa (OSS EC)',stripe_billing:'Stripe Billing (Sub)'}
        :{stripe:'Stripe決済',ec_build:'Stripe決済, Medusa (OSS EC)',stripe_billing:'Stripe Billing (サブスク)'};
      S.answers.payment=_payMap[p.payment]||p.payment;
    }
  }
  var presetName=p&&p.name?(_en&&p.nameEn?p.nameEn:p.name):'';
  var preFilledCount=Object.keys(S.answers).length;
  save();saveProject();

  // View transition animation (HCD: ⑤感情体験)
  const onb=$('onboard');
  const ws=$('ws');
  onb.classList.add('phase-exit');
  setTimeout(()=>{
    onb.style.display='none';
    ws.style.display='flex';
    ws.classList.add('phase-enter');
    setTimeout(()=>ws.classList.remove('phase-enter'),300);
  },200);

  if(typeof initSidebar==='function')initSidebar();
  initPills();updProgress();
  if(S.skillLv<=1){addMsg('bot',_ja?'🌱 質問に答えるだけで設計書が自動生成されます。難しく考えなくてOK！スキップもできます。':'🌱 Just answer the questions and design docs will be auto-generated. Don\'t overthink it — you can skip any question!');}
  showQ();
  if(presetName&&preFilledCount>0){
    toast(_ja?'✅ "'+presetName+'" を適用 — '+preFilledCount+'件の回答を自動入力':'✅ Applied "'+presetName+'" — '+preFilledCount+' answers pre-filled');
  }
}

/* Auto-fill Phase 2 (tech stack) defaults for Beginner mode */
function autoFillPhase2Defaults(){
  const _ja=S.lang==='ja';
  // Only fill fields not already set by preset
  if(!S.answers.frontend)S.answers.frontend='React + Next.js';
  if(!S.answers.css_fw)S.answers.css_fw='Tailwind CSS';
  // Lv0: use Firebase (simpler BaaS, no SQL required)
  if(S.skillLv===0&&!S.answers.backend){S.answers.backend='Firebase';}
  if(!S.answers.backend)S.answers.backend='Supabase';
  if(!S.answers.database){
    if(/Firebase/i.test(S.answers.backend))S.answers.database='Firebase Firestore';
    else if(/Supabase/i.test(S.answers.backend))S.answers.database='Supabase (PostgreSQL)';
    else S.answers.database='PostgreSQL';
  }
  if(!S.answers.auth){
    if(/Firebase/i.test(S.answers.backend))S.answers.auth='Firebase Auth';
    else if(/Supabase/i.test(S.answers.backend))S.answers.auth='Supabase Auth';
    else S.answers.auth=_ja?'メール/パスワード':'Email/Password';
  }
  if(!S.answers.mobile)S.answers.mobile=_ja?'なし':'None';
  if(!S.answers.ai_auto)S.answers.ai_auto=_ja?'Vibe Coding入門':'Vibe Coding Intro';
  if(!S.answers.deploy)S.answers.deploy='Vercel';
  if(!S.answers.dev_methods)S.answers.dev_methods=_ja?'TDD（テスト駆動）, SDD（仕様駆動）':'TDD (Test-Driven), SDD (Spec-Driven)';
  if(!S.answers.payment)S.answers.payment=_ja?'なし':'None';
  save();
}
