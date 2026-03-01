/* ═══ PRESET & START ═══ */
/* ── Preset Recommendation Wizard (3 questions → top 3 presets) ── */
function showPresetRecommend(){
  const _ja=S.lang==='ja';
  var answers={};
  var step=0;
  var questions=_ja?[
    {q:'何を作りたいですか？',opts:[{l:'SaaS / 管理システム',k:'saas'},{l:'EC / マーケットプレイス',k:'ec'},{l:'社内ツール / 業務効率化',k:'internal'},{l:'教育・学習 / コンテンツ',k:'education'}]},
    {q:'チーム規模は？',opts:[{l:'👤 個人 (solo)',k:'solo'},{l:'🏠 2-5名',k:'small'},{l:'🏢 6-20名',k:'medium'},{l:'🏭 20名以上',k:'large'}]},
    {q:'技術経験は？',opts:[{l:'🌱 ほぼない (初心者)',k:'beginner'},{l:'📗 1-2年 (初中級)',k:'junior'},{l:'⚡ 2-4年 (中級)',k:'mid'},{l:'🔥 4年以上 (上級)',k:'senior'}]}
  ]:[
    {q:'What are you building?',opts:[{l:'SaaS / Admin System',k:'saas'},{l:'E-Commerce / Marketplace',k:'ec'},{l:'Internal Tool / Ops',k:'internal'},{l:'Education / Content',k:'education'}]},
    {q:'Team size?',opts:[{l:'👤 Solo',k:'solo'},{l:'🏠 2-5 people',k:'small'},{l:'🏢 6-20 people',k:'medium'},{l:'🏭 20+ people',k:'large'}]},
    {q:'Your experience?',opts:[{l:'🌱 New to dev',k:'beginner'},{l:'📗 1-2 years',k:'junior'},{l:'⚡ 2-4 years',k:'mid'},{l:'🔥 4+ years',k:'senior'}]}
  ];

  function scorePreset(p,ans){
    var score=0;
    var purpose=(p.purpose||'').toLowerCase();
    var k=ans.type||'saas';
    if(k==='saas'&&/管理|dashboard|crm|erp|saas|analytics|admin/i.test(purpose))score+=3;
    else if(k==='ec'&&/ec|shop|market|commerce|booking|予約|販売/i.test(purpose))score+=3;
    else if(k==='internal'&&/社内|internal|workflow|勤怠|hr|erp|管理|tool/i.test(purpose))score+=3;
    else if(k==='education'&&/学習|教育|educat|learning|course|lms|チュータ/i.test(purpose))score+=3;
    var scale=ans.size||'small';
    if(scale==='solo'&&/シンプル|simple|portfolio|blog|personal/i.test(purpose))score+=1;
    if(scale==='medium'&&/チーム|team|collab/i.test(purpose))score+=1;
    var exp=ans.exp||'mid';
    if(exp==='beginner'&&/シンプル|simple|firebase|supabase|baas/i.test(purpose))score+=1;
    if(exp==='senior'&&/enterprise|マイクロ|microservice|grpc|事業者/i.test(purpose))score+=1;
    return score;
  }

  function renderStep(){
    var modal=$('presetRecommendModal');if(!modal)return;
    var body=modal.querySelector('.modal-body');
    if(step>=questions.length){
      // Show results
      var all=Object.keys(PR||{}).map(k=>{var p=PR[k];return{key:k,p,score:scorePreset(p,answers)};}).sort((a,b)=>b.score-a.score).slice(0,3);
      var html='<div style="margin-bottom:12px;font-weight:600;color:var(--accent)">'+(_ja?'🎯 おすすめプリセット TOP 3':'🎯 Top 3 Recommended Presets')+'</div>';
      all.forEach(function(item,i){
        var p=item.p;var n=_ja?p.name:p.nameEn||p.name;
        html+='<div style="display:flex;align-items:start;gap:12px;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;cursor:pointer;background:var(--bg-3)"';
        html+=' onclick="pickPreset(\''+item.key+'\');document.getElementById(\'presetRecommendModal\').remove()">';
        html+='<span style="font-size:24px">'+(p.icon||'📦')+'</span>';
        html+='<div><div style="font-weight:600">'+esc(n)+'</div>';
        html+='<div style="font-size:12px;color:var(--text-muted);margin-top:2px">'+esc((_ja?p.purpose:p.purposeEn||p.purpose||'').slice(0,80))+'</div></div>';
        html+='</div>';
      });
      body.innerHTML=html;
      return;
    }
    var q=questions[step];
    var html='<div style="margin-bottom:12px"><span style="font-size:12px;color:var(--text-3)">'+(step+1)+'/'+questions.length+'</span><div style="font-weight:600;margin-top:4px">'+esc(q.q)+'</div></div>';
    q.opts.forEach(function(opt){
      html+='<button class="btn btn-g" style="width:100%;text-align:left;margin-bottom:6px;padding:10px 12px"';
      html+=' onclick="window._prRecAns(\''+opt.k+'\')">'+esc(opt.l)+'</button>';
    });
    body.innerHTML=html;
  }

  window._prRecAns=function(k){
    if(step===0)answers.type=k;
    else if(step===1)answers.size=k;
    else answers.exp=k;
    step++;renderStep();
  };

  var overlay=document.createElement('div');
  overlay.className='modal-overlay';overlay.id='presetRecommendModal';
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label',_ja?'プリセット提案':'Preset Recommendation');
  var html='<div class="modal-box" style="max-width:400px"><div class="modal-header">';
  html+='<h3 class="modal-title">🎯 '+(_ja?'3問でプリセットを提案':'Find Your Preset in 3 Questions')+'</h3>';
  html+='<button class="modal-close" onclick="document.getElementById(\'presetRecommendModal\').remove()" aria-label="Close">✕</button>';
  html+='</div><div class="modal-body"></div></div>';overlay.innerHTML=html;
  overlay.onclick=function(e){if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  renderStep();
}
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
  var _hdl=$('hearingDlBtn');if(_hdl)_hdl.style.display=n>=2?'':'none';
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
  var _hdl2=$('hearingDlBtn');if(_hdl2)_hdl2.style.display=S.skillLv>=2?'':'none';
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
var _presetSearchQuery='';

function _renderFieldChips(){
  const _ja=S.lang==='ja';const _en=!_ja;
  const row=$('presetRow');if(!row||typeof PR_FIELD==='undefined')return;
  Array.from(row.querySelectorAll('.prchip')).forEach(c=>c.remove());
  const insertBefore=row.querySelector('.preset-footer');
  Object.entries(PR_FIELD).forEach(function([k,v]){
    if(!v||!v.name)return;
    if(_fieldCatFilter!=='all'&&v.field!==_fieldCatFilter)return;
    if(_presetSearchQuery&&_scorePreset(v,k,_presetSearchQuery,true)<=0)return;
    const c=document.createElement('span');c.className='prchip';
    c.textContent=(v.icon||'')+(v.icon?' ':'')+(_en&&v.nameEn?v.nameEn:v.name);
    if(S.preset===('field:'+k))c.classList.add('on');
    c.onclick=function(e){pickFieldPreset(k,e);};
    // Tooltip: scaleHint + meta
    const sh=v.scaleHint&&v.scaleHint[_fieldScale]?(_ja?v.scaleHint[_fieldScale].ja:v.scaleHint[_fieldScale].en):'';
    const m=v.meta||{};
    const regLbl=_ja?'📋規制:':'📋Reg:';
    const metaStr=regLbl+(m.regulation||'-')+' | 🤖'+(m.agentLv||'-')+' | 🖼️'+(m.multimodal||'-')+' | ☁️'+(m.onDevice||'-');
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
  _renderThemeOverlayPanel();
}

/* ── Theme Overlay (コンポーザブル) ── */
var _selectedThemeOverlays=new Set();

function toggleThemeChip(themeKey,btn){
  if(_selectedThemeOverlays.has(themeKey)){
    _selectedThemeOverlays.delete(themeKey);
    if(btn)btn.classList.remove('selected');
  } else {
    _selectedThemeOverlays.add(themeKey);
    if(btn)btn.classList.add('selected');
  }
}

function _renderThemeOverlayPanel(){
  if(typeof THEME_OVERLAYS==='undefined')return;
  const _ja=S.lang==='ja';
  var panel=$('themeOverlayPanel');
  if(!panel){
    panel=document.createElement('div');
    panel.id='themeOverlayPanel';panel.className='theme-overlay-panel';
    const row=$('presetRow');if(row)row.appendChild(panel);
  }
  _selectedThemeOverlays.clear();
  var themeChips=[
    {k:'theme_security',l:_ja?'🔐 セキュリティ':'🔐 Security'},
    {k:'theme_a11y',l:_ja?'♿ アクセシビリティ':'♿ Accessibility'},
    {k:'theme_sustainability',l:_ja?'🌿 サステナビリティ':'🌿 Sustainability'},
    {k:'theme_agent',l:_ja?'🤖 AIエージェント':'🤖 AI Agent'},
    {k:'theme_analytics',l:_ja?'📊 分析':'📊 Analytics'},
    {k:'theme_on_device',l:_ja?'📱 オンデバイス':'📱 On-Device'}
  ];
  var chipsHtml='';
  themeChips.forEach(function(tc){
    chipsHtml+='<button class="theme-chip" data-theme="'+tc.k+'" onclick="toggleThemeChip(\''+tc.k+'\',this)">'+tc.l+'</button>';
  });
  panel.innerHTML='<p class="theme-overlay-title">'+(_ja?'🔀 テーマを重ね掛け (任意)':'🔀 Apply theme overlays (optional)')+'</p>'
    +'<div class="theme-chips">'+chipsHtml+'</div>';
  panel.style.display='block';
}

function applyThemeOverlay(themeKey){
  if(typeof THEME_OVERLAYS==='undefined')return;
  var ov=THEME_OVERLAYS[themeKey];if(!ov)return;
  var _en=S.genLang==='en';
  // features: append (deduplicate)
  var curF=(S.answers.mvp_features||'').split(',').map(function(s){return s.trim().replace(/^\[P\d+\]\s*/,'');}).filter(Boolean);
  var addF=_en?ov.addFeaturesEn:ov.addFeatures;
  if(Array.isArray(addF))addF.forEach(function(f){if(!curF.includes(f))curF.push(f);});
  S.answers.mvp_features=curF.join(', ');
  // entities: append
  if(ov.addEntities){
    var curE=(S.answers.data_entities||'').split(',').map(function(s){return s.trim();}).filter(Boolean);
    ov.addEntities.split(',').forEach(function(e){var t=e.trim();if(t&&!curE.includes(t))curE.push(t);});
    S.answers.data_entities=curE.join(', ');
  }
  // screens: append
  var curS=(S.answers.screens||'').split(',').map(function(s){return s.trim().replace(/^\[P\d+\]\s*/,'');}).filter(Boolean);
  var addS=_en?ov.addScreensEn:ov.addScreens;
  if(Array.isArray(addS))addS.forEach(function(s){if(!curS.includes(s))curS.push(s);});
  S.answers.screens=curS.join(', ');
  // metaOverride: regulation upgrade only
  if(ov.metaOverride&&ov.metaOverride.regulation){
    var regOrder=['low','moderate','medium','high','strict','highest'];
    var curReg=S.answers._meta_regulation||'low';
    var newReg=ov.metaOverride.regulation;
    if(regOrder.indexOf(newReg)>regOrder.indexOf(curReg)){
      S.answers._meta_regulation=newReg;
    }
  }
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
    if(_presetSearchQuery&&_scorePreset(v,k,_presetSearchQuery,false)<=0)return;
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

/* ── Preset Suggest ──────────────────────────────────────────────── */
function _scorePreset(preset, key, query, isField){
  var words=query.toLowerCase().split(/[\s,、・\/]+/).filter(Boolean);
  if(!words.length) return 0;
  var score=0;
  var nm=((preset.name||'')+(preset.nameEn||'')).toLowerCase();
  var pu=((preset.purpose||'')+(preset.purposeEn||'')).toLowerCase();
  var ent=((preset.entities||'')).toLowerCase();
  for(var i=0;i<words.length;i++){
    var w=words[i];
    if(w.length<2) continue;
    if(nm.indexOf(w)>=0) score+=3;
    if(pu.indexOf(w)>=0) score+=2;
    if(ent.indexOf(w)>=0) score+=1;
    if(key.indexOf(w)>=0) score+=2;
  }
  if(typeof detectDomain==='function'){
    var qDomain=detectDomain(query);
    if(qDomain){
      var pDomain=detectDomain(preset.purpose||'');
      if(pDomain===qDomain) score+=5;
    }
  }
  return score;
}

function _suggestPresets(query){
  var box=$('presetSuggestBox');if(!box)return;
  const _ja=S.lang==='ja';var _en=!_ja;
  query=(query||'').trim();
  if(query.length<2){box.innerHTML='';box.style.display='none';return;}
  var results=[];
  Object.entries(PR).forEach(function(e){
    var k=e[0],v=e[1];
    if(k==='custom'||!v.name)return;
    if(S.skillLv<=1&&!_beginnerPresets.has(k))return;
    var sc=_scorePreset(v,k,query,false);
    if(sc>0)results.push({key:k,preset:v,score:sc,isField:false});
  });
  if(S.skillLv>=2&&typeof PR_FIELD!=='undefined'){
    Object.entries(PR_FIELD).forEach(function(e){
      var k=e[0],v=e[1];
      if(!v||!v.name)return;
      var sc=_scorePreset(v,k,query,true);
      if(sc>0)results.push({key:k,preset:v,score:sc,isField:true});
    });
  }
  results.sort(function(a,b){return b.score-a.score;});
  results=results.slice(0,5);
  if(!results.length){
    box.innerHTML='<div class="ps-empty">'+(_ja?'一致するプリセットがありません':'No matching presets')+'</div>';
    box.style.display='block';return;
  }
  var out='';
  results.forEach(function(r){
    var p=r.preset;
    var pnm=(_en&&p.nameEn?p.nameEn:p.name)||'';
    if(p.icon)pnm=p.icon+' '+pnm;
    var desc=(_en&&p.purposeEn?p.purposeEn:p.purpose||'').slice(0,60);
    var badge=r.isField?'<span class="ps-badge-field">🎓</span>':'<span class="ps-badge-std">📦</span>';
    out+='<div class="ps-item" onclick="_pickSuggested(\''+escAttr(r.key)+'\','+r.isField+')" role="button" tabindex="0">';
    out+=badge+'<span class="ps-name">'+esc(pnm)+'</span>';
    out+='<span class="ps-desc">'+esc(desc)+'</span>';
    out+='<span class="ps-score">'+r.score+'pt</span>';
    out+='</div>';
  });
  box.innerHTML=out;box.style.display='block';
}

function _pickSuggested(key,isField){
  const _ja=S.lang==='ja';
  if(isField&&_presetMode!=='field'&&S.skillLv>=2){_switchPresetMode('field');}
  if(!isField&&_presetMode!=='standard'){_switchPresetMode('standard');}
  if(isField){pickFieldPreset(key,null);}
  else{pickPreset(key,null);}
  var box=$('presetSuggestBox');if(box){box.innerHTML='';box.style.display='none';}
  var sin=$('presetSuggestIn');if(sin)sin.value='';
  _presetSearchQuery='';
  var sugClr=document.querySelector('.preset-suggest-clear');if(sugClr)sugClr.style.display='none';
  if(_presetMode==='field')_renderFieldChips();else _renderPresetChips();
  var pName='';
  if(!isField&&PR[key]){pName=_ja&&PR[key].name?PR[key].name:(PR[key].nameEn||PR[key].name||'');}
  else if(isField&&typeof PR_FIELD!=='undefined'&&PR_FIELD[key]){pName=(!_ja&&PR_FIELD[key].nameEn?PR_FIELD[key].nameEn:PR_FIELD[key].name)||'';}
  if(pName){
    document.querySelectorAll('.prchip').forEach(function(c){
      if(c.textContent.indexOf(pName)>=0){
        c.classList.add('on');
        if(typeof c.scrollIntoView==='function')c.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
    });
  }
}

function initPresets(){
  const row=$('presetRow');row.innerHTML='';
  const _ja=S.lang==='ja';
  if(S.preset&&S.preset.slice(0,6)==='field:'&&typeof PR_FIELD!=='undefined'){_presetMode='field';}

  // ── Preset Suggest Input ──
  var suggestWrap=document.createElement('div');suggestWrap.className='preset-suggest-wrap';
  var suggestIn=document.createElement('input');suggestIn.type='text';suggestIn.className='preset-suggest-in';
  suggestIn.id='presetSuggestIn';
  suggestIn.placeholder=_ja?'🔍 何を作りたい？ 例: 農業IoT / 教育チューター / 医療カルテ':'🔍 What to build? e.g., farm IoT / tutoring / medical records';
  suggestIn.setAttribute('aria-label',_ja?'プリセット検索':'Search presets');
  var suggestBox=document.createElement('div');suggestBox.className='preset-suggest-box';suggestBox.id='presetSuggestBox';
  suggestWrap.appendChild(suggestIn);
  var suggestClear=document.createElement('button');suggestClear.className='preset-suggest-clear';
  suggestClear.textContent='×';suggestClear.style.display='none';
  suggestClear.setAttribute('aria-label',_ja?'検索クリア':'Clear search');
  suggestClear.onclick=function(){
    suggestIn.value='';_presetSearchQuery='';suggestClear.style.display='none';
    var box=$('presetSuggestBox');if(box){box.innerHTML='';box.style.display='none';}
    if(_presetMode==='field')_renderFieldChips();else _renderPresetChips();suggestIn.focus();
  };
  suggestWrap.appendChild(suggestClear);suggestWrap.appendChild(suggestBox);
  // Recommend button
  var recBtn=document.createElement('button');recBtn.className='btn btn-g btn-sm';
  recBtn.style.cssText='margin-top:6px;width:100%;font-size:12px';
  recBtn.textContent=_ja?'🎯 3問でおすすめを探す':'🎯 Find My Preset (3 Qs)';
  recBtn.onclick=showPresetRecommend;
  suggestWrap.appendChild(recBtn);
  row.appendChild(suggestWrap);
  var _suggestTimer=null;
  suggestIn.addEventListener('input',function(){
    clearTimeout(_suggestTimer);
    var q=suggestIn.value.trim();_presetSearchQuery=q;
    suggestClear.style.display=q?'block':'none';
    _suggestTimer=setTimeout(function(){
      _suggestPresets(suggestIn.value);
      if(_presetMode==='field')_renderFieldChips();else _renderPresetChips();
    },300);
  });

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
      b.textContent=fc.label+(stars?' '+stars:'');b.title=(fc.desc||'')+(stars?' | '+(_ja?'成長トレンド: ':'Growth Trend: ')+stars:'');
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
    S.preset='custom';save();
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
  const _ja=S.lang==='ja';
  S.preset=k;
  document.querySelectorAll('.prchip').forEach(c=>c.classList.remove('on'));
  if(e&&e.target)e.target.classList.add('on');
  const p=PR[k];
  if(p&&p.name)$('nameIn').value=(!_ja&&p.nameEn)?p.nameEn:p.name;
  save();
}

function undoPreset(){
  const _ja=S.lang==='ja';
  if(!S.answersSnapshot){toast(_ja?'元に戻すスナップショットがありません':'No snapshot to restore');return;}
  S.answers=Object.assign({},S.answersSnapshot);
  S.answersSnapshot=null;
  save();
  if(typeof showQ==='function')showQ();
  toast(_ja?'↩️ プリセット適用前の回答に戻しました':'↩️ Restored pre-preset answers',{type:'info'});
}
function start(){
  const _ja=S.lang==='ja';
  const name=sanitizeName($('nameIn').value);
  if(!name){toast(_ja?'プロジェクト名を入力してください':'Please enter a project name');return;}
  S.projectName=name;S.phase=1;S.step=0;S.skipped=[];
  // Save answer snapshot before applying preset (for undo)
  if(S.preset&&S.preset!=='custom'){
    S.answersSnapshot=JSON.parse(JSON.stringify(S.answers));
  }
  // Lv0 forced preset: absolute beginners get SaaS preset auto-selected
  if(S.skillLv===0&&S.preset==='custom'){
    S.preset='saas';
    toast(_ja?'初心者向けにSaaSプリセットを自動選択しました':'Auto-selected SaaS preset for beginners');
  }
  const _en=S.lang==='en';
  // ── Field Preset Mode: apply scale defaults then field preset overrides ──
  var _isFieldPreset=S.preset&&S.preset.slice(0,6)==='field:';
  if(_isFieldPreset&&typeof PR_FIELD!=='undefined'&&typeof _SCALE_DEFAULTS!=='undefined'){
    const fk=S.preset.slice(6);
    const fp=PR_FIELD[fk];
    const sd=_SCALE_DEFAULTS[_fieldScale]||_SCALE_DEFAULTS.small;
    if(fp){
      // Layer 1: Apply scale defaults first
      if(sd.frontend)S.answers.frontend=sd.frontend;
      if(sd.backend)S.answers.backend=sd.backend;
      if(sd.deploy)S.answers.deploy=sd.deploy;
      if(sd.ai_auto)S.answers.ai_auto=sd.ai_auto;
      if(sd.database)S.answers.database=sd.database;
      if(sd.auth){S.answers.auth=_en&&sd.auth==='メール/パスワード'?'Email/Password':sd.auth;}
      if(sd.css_fw)S.answers.css_fw=sd.css_fw;
      if(sd.dev_methods){S.answers.dev_methods=_en&&sd.dev_methodsEn?sd.dev_methodsEn:sd.dev_methods;}
      if(_en&&S.answers.ai_auto){
        var _aiMap={'Vibe Coding入門':'Vibe Coding Intro','エージェント型開発':'Agentic Dev','マルチAgent協調':'Multi-Agent','フル自律開発':'Full Autonomous','オーケストレーター':'Orchestrator'};
        S.answers.ai_auto=_aiMap[S.answers.ai_auto]||S.answers.ai_auto;
      }
      // Layer 2: Category defaults (target, screens, payment, mobile)
      var _catDef=(typeof FIELD_CAT_DEFAULTS!=='undefined')?FIELD_CAT_DEFAULTS[fp.field]:null;
      if(_catDef){
        if(_catDef.target){
          var _ct=_en&&_catDef.targetEn?_catDef.targetEn:_catDef.target;
          S.answers.target=Array.isArray(_ct)?_ct.join(', '):_ct;
        }
        if(_catDef.screens){
          var _cs=_en&&_catDef.screensEn?_catDef.screensEn:_catDef.screens;
          S.answers.screens=Array.isArray(_cs)?_cs.join(', '):_cs;
        }
        var _payMapL2=_en
          ?{stripe:'Stripe',stripe_billing:'Stripe Billing (Sub)',ec_build:'Stripe, Medusa (OSS EC)'}
          :{stripe:'Stripe決済',stripe_billing:'Stripe Billing (サブスク)',ec_build:'Stripe決済, Medusa (OSS EC)'};
        if(_catDef.payment&&_catDef.payment!=='none'){
          S.answers.payment=_payMapL2[_catDef.payment]||_catDef.payment;
        }
        if(_catDef.mobile&&_catDef.mobile!=='none'){
          S.answers.mobile=_catDef.mobile;
        }
        if(_catDef.org_model){var _omMapL2={'マルチテナント(RLS)':'Multi-tenant (RLS)','ワークスペース型':'Workspace-based','シングルテナント':'Single-tenant','組織+チーム階層':'Org + Team hierarchy'};S.answers.org_model=_en?(_omMapL2[_catDef.org_model]||_catDef.org_model):_catDef.org_model;}
      }
      // Layer 3: Field preset specifics (overrides Layer 2)
      if(fp.purpose)S.answers.purpose=(_en&&fp.purposeEn)?fp.purposeEn:fp.purpose;
      if(fp.target){var _ft=_en&&fp.targetEn?fp.targetEn:fp.target;S.answers.target=Array.isArray(_ft)?_ft.join(', '):_ft;}
      if(fp.features){var _ff=_en&&fp.featuresEn?fp.featuresEn:fp.features;S.answers.mvp_features=Array.isArray(_ff)?_ff.join(', '):_ff;}
      if(fp.entities)S.answers.data_entities=fp.entities;
      if(fp.payment&&fp.payment!=='none'){S.answers.payment=_payMapL2[fp.payment]||fp.payment;}
      if(fp.mobile&&fp.mobile!=='none')S.answers.mobile=fp.mobile;
      if(fp.screens){var _fsc=_en&&fp.screensEn?fp.screensEn:fp.screens;S.answers.screens=Array.isArray(_fsc)?_fsc.join(', '):_fsc;}
      // Layer 4: meta→answer inference
      if(fp.meta){
        // revenue='subscription' → payment (if not already set by L2/L3)
        if(fp.meta.revenue==='subscription'&&(!S.answers.payment||/なし|None/i.test(S.answers.payment))){
          S.answers.payment=_en?'Stripe Billing (Sub)':'Stripe Billing (サブスク)';
        }
        // onDevice='edge_cloud' + multimodal contains 'image' → mobile (if not already set by L2/L3)
        if(fp.meta.onDevice==='edge_cloud'&&/image/i.test(fp.meta.multimodal||'')
          &&(!S.answers.mobile||/なし|None/i.test(S.answers.mobile))){
          S.answers.mobile='Expo (React Native)';
        }
        // regulation='strict' → dev_methods (always override — security must be enforced)
        if(fp.meta.regulation==='strict'){
          S.answers.dev_methods=_en
            ?'TDD (Test-Driven), SDD (Spec-Driven), Security-First'
            :'TDD（テスト駆動）, SDD（仕様駆動）, セキュリティファースト';
        }
        // btob + strict → org_model enterprise upgrade (if single-tenant default from L2)
        if(fp.meta.revenue==='btob'&&fp.meta.regulation==='strict'){
          var _cur=S.answers.org_model||'';
          if(!_cur||/シングルテナント|Single-tenant/i.test(_cur)){
            S.answers.org_model=_en?'Org + Team hierarchy':'組織+チーム階層';
          }
        }
      }
    }
    // Theme Overlays: apply selected cross-cutting concerns
    if(_selectedThemeOverlays&&_selectedThemeOverlays.size>0){
      _selectedThemeOverlays.forEach(function(themeKey){applyThemeOverlay(themeKey);});
    }
    // N-2: deadline default based on scale
    if(!S.answers.deadline){
      S.answers.deadline=(_fieldScale==='large'||_fieldScale==='medium')?(_en?'6 months':'6ヶ月'):(_en?'3 months':'3ヶ月');
    }
    _applyUniversalPostProcess(_en);
    var presetName=fp&&fp.name?(_en&&fp.nameEn?fp.nameEn:fp.name):'';
    var preFilledCount=Object.keys(S.answers).length;
    save();saveProject();
    const onbF=$('onboard');const wsF=$('ws');
    onbF.classList.add('phase-exit');
    setTimeout(()=>{onbF.style.display='none';$('app').classList.add('ws-on');wsF.style.display='flex';wsF.classList.add('phase-enter');setTimeout(()=>wsF.classList.remove('phase-enter'),300);},200);
    if(typeof initSidebar==='function')initSidebar();
    initPills();updProgress();
    if(S.skillLv<=1){addMsg('bot',_ja?'🌱 質問に答えるだけで設計書が自動生成されます。難しく考えなくてOK！スキップもできます。':'🌱 Just answer the questions and design docs will be auto-generated. Don\'t overthink it — you can skip any question!');}
    showQ();
    if(presetName&&preFilledCount>0){toast(_ja?'✅ "'+presetName+'" ['+_fieldScale+'] を適用 — '+preFilledCount+'件の回答を自動入力':'✅ Applied "'+presetName+'" [Scale: '+_fieldScale+'] — '+preFilledCount+' answers pre-filled',{duration:4000,action:undoPreset,actionLabel:_ja?'↩️ Undo':'↩️ Undo'});}
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
    if(p.screens){const sc=_en&&p.screensEn?p.screensEn:p.screens;S.answers.screens=Array.isArray(sc)?sc.join(', '):sc;}
    if(p.org_model){var _omMap={'マルチテナント(RLS)':'Multi-tenant (RLS)','ワークスペース型':'Workspace-based','シングルテナント':'Single-tenant','組織+チーム階層':'Org + Team hierarchy'};S.answers.org_model=_en?(_omMap[p.org_model]||p.org_model):p.org_model;}
    if(p.deploy)S.answers.deploy=p.deploy;
    if(p.css_fw)S.answers.css_fw=p.css_fw;
    if(p.dev_methods)S.answers.dev_methods=_en&&p.dev_methodsEn?p.dev_methodsEn:p.dev_methods;
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
  // N-2: deadline default (3ヶ月 for standard presets)
  if(!S.answers.deadline) S.answers.deadline=_en?'3 months':'3ヶ月';
  _applyUniversalPostProcess(_en);
  var presetName=p&&p.name?(_en&&p.nameEn?p.nameEn:p.name):'';
  var preFilledCount=Object.keys(S.answers).length;
  save();saveProject();

  // View transition animation (HCD: ⑤感情体験)
  const onb=$('onboard');
  const ws=$('ws');
  onb.classList.add('phase-exit');
  setTimeout(()=>{
    onb.style.display='none';
    $('app').classList.add('ws-on');
    ws.style.display='flex';
    ws.classList.add('phase-enter');
    setTimeout(()=>ws.classList.remove('phase-enter'),300);
  },200);

  if(typeof initSidebar==='function')initSidebar();
  initPills();updProgress();
  if(S.skillLv<=1){addMsg('bot',_ja?'🌱 質問に答えるだけで設計書が自動生成されます。難しく考えなくてOK！スキップもできます。':'🌱 Just answer the questions and design docs will be auto-generated. Don\'t overthink it — you can skip any question!');}
  showQ();
  if(presetName&&preFilledCount>0){
    toast(_ja?'✅ "'+presetName+'" を適用 — '+preFilledCount+'件の回答を自動入力':'✅ Applied "'+presetName+'" — '+preFilledCount+' answers pre-filled',{duration:4000,action:undoPreset,actionLabel:_ja?'↩️ Undo':'↩️ Undo'});
  }
}

/* Universal post-processing: infer database & auth from backend (all presets, all skill levels) */
function _applyUniversalPostProcess(_en){
  const _ja=S.lang==='ja';
  const be=S.answers.backend||'';
  const _isStatic=!be||/なし|None|static/i.test(be);
  // Database/Auth defaults: only for non-static backends
  if(!_isStatic){
    if(!S.answers.database){
      if(/Firebase/i.test(be))S.answers.database='Firebase Firestore';
      else if(/Supabase/i.test(be))S.answers.database='Supabase (PostgreSQL)';
      else S.answers.database='PostgreSQL';
    }
    if(!S.answers.auth){
      if(/Firebase/i.test(be))S.answers.auth='Firebase Auth';
      else if(/Supabase/i.test(be))S.answers.auth='Supabase Auth';
      else S.answers.auth=_en?'Email/Password':_ja?'メール/パスワード':'Email/Password';
    }
  }
  // N-3: dev_env_type for BaaS backends
  if(!S.answers.dev_env_type&&/Firebase|Supabase|Convex/i.test(be)){
    S.answers.dev_env_type=_ja?'ローカル開発':'Local Development';
  }
  // N-4: org_model inference from domain (if not already set by preset/Layer 2-3)
  if(!S.answers.org_model&&S.answers.purpose){
    var _dom2=(typeof detectDomain==='function')?detectDomain(S.answers.purpose||''):'';
    var _orgInfer={saas:'マルチテナント(RLS)',analytics:'シングルテナント',collab:'ワークスペース型',hr:'シングルテナント',tool:'シングルテナント',automation:'ワークスペース型',fintech:'シングルテナント',legal:'シングルテナント',ec:'シングルテナント',marketplace:'マルチテナント(RLS)',logistics:'シングルテナント',insurance:'シングルテナント'};
    var _orgInferEn={saas:'Multi-tenant (RLS)',analytics:'Single-tenant',collab:'Workspace-based',hr:'Single-tenant',tool:'Single-tenant',automation:'Workspace-based',fintech:'Single-tenant',legal:'Single-tenant',ec:'Single-tenant',marketplace:'Multi-tenant (RLS)',logistics:'Single-tenant',insurance:'Single-tenant'};
    if(_dom2&&_orgInfer[_dom2]){S.answers.org_model=_en?(_orgInferEn[_dom2]||_orgInfer[_dom2]):_orgInfer[_dom2];}
  }
  // G-5: ai_auto from skillLv (when not already set by preset or scale defaults)
  if(!S.answers.ai_auto){
    var _slv5=typeof S.skillLv==='number'?S.skillLv:3;
    if(_slv5>=5) S.answers.ai_auto=_en?'Orchestrator':'オーケストレーター';
    else if(_slv5>=2) S.answers.ai_auto=_en?'Multi-Agent':'マルチAgent協調';
    else S.answers.ai_auto=_en?'Vibe Coding Intro':'Vibe Coding入門';
  }
  // N-5: ai_tools from ai_auto level
  if(!S.answers.ai_tools){
    var _aL=S.answers.ai_auto||'';
    if(_aL&&!/none|なし/i.test(_aL)){
      if(/オーケストレーター|Orchestrator/i.test(_aL)||/フル自律|Full Autonomous/i.test(_aL)){
        S.answers.ai_tools='Cursor, Claude Code, GitHub Copilot, Google Antigravity';
      } else if(/マルチAgent|Multi-Agent/i.test(_aL)){
        S.answers.ai_tools='Cursor, Claude Code, GitHub Copilot';
      } else {
        S.answers.ai_tools='Cursor, Claude Code';
      }
    }
  }
  // N-6 (G-6 extended): success KPI from domain — all 32 domains (standard presets only)
  if(!S.answers.success&&S.answers.purpose&&!(S.preset||'').startsWith('field:')){
    var _domSuc=(typeof detectDomain==='function')?detectDomain(S.answers.purpose||''):'';
    var _sucJa={saas:'📈 月間1000ユーザー, 💰 月売上10万円(MRR), 🔄 月間チャーン5%以下',ec:'💰 GMV月100万円, 💰 CV率3%+, 🏪 カート放棄30%以下',marketplace:'💰 GMV月100万円, 💰 テイクレート10%, 🏪 取引完了率95%+',education:'📚 コース完了率80%+, 📚 クイズ合格率70%+, 🔄 7日連続利用率50%+',community:'👥 日次投稿50件+, 👥 メンバー月10%増, 🔄 DAU/MAU比率30%+',fintech:'💰 月間取引高1000万円, 🏢 不正検知率99%+, ⚡ 決済成功率99.5%+',analytics:'🏢 レポート作成1分以内, 📈 月間1000ユーザー, 😊 CSAT 4.5/5',booking:'🏪 予約転換率60%+, 🏪 リソース稼働率80%+, 😊 CSAT 4.5/5',hr:'🏢 採用日数30日以内, 🏢 オファー承諾率80%+, 😊 従業員満足度4/5',automation:'🤖 手動作業70%削減, 🤖 処理時間50%短縮, ⚡ エラー率0.1%以下',ai:'🤖 AI正答率90%+, 🤖 有人対応20%以下, 😊 CSAT 4.5/5',collab:'👥 同時編集5人+, 🔄 機能利用率80%+, 😊 NPS 50以上',
      content:'📝 月間1万PV, ⏱ 平均滞在3分+, 📧 読者登録率10%+',health:'😊 日次利用者500人+, 🏥 機能活用率80%+, ⚡ 応答1秒以内',iot:'📡 デバイス稼働率99%+, ⚡ センサー応答1秒以内, 🚨 異常検知率95%+',realestate:'🏠 物件成約率15%+, 📊 内覧率30%+, 😊 CSAT 4.5/5',legal:'⚖️ 文書処理24時間以内, 🔒 機密漏洩ゼロ, 😊 顧客満足度4/5+',portfolio:'👁 月間閲覧5000回+, 📧 コンタクト月10件+, ⭐ 採用内定率向上',tool:'⚡ 処理速度業界比30%向上, 🔄 週次アクティブ率60%+, 😊 CSAT 4.5/5',event:'🎫 チケット販売1000枚/月, 🏪 キャンセル率5%以下, 😊 参加満足度4.5/5',gamify:'🎮 DAU/MAU 40%+, 🔄 7日継続率60%+, 🏆 達成バッジ取得率70%+',devtool:'⭐ GitHub Stars 1000+, 🔄 週次アクティブ開発者500+, 📦 月間インストール10K+',creator:'🎨 投稿数100件/月, 👥 フォロワー10%増/月, 💰 クリエイター収益1万円/月+',newsletter:'📧 開封率35%+, 🔗 クリック率10%+, 📈 購読者月5%増',manufacturing:'🏭 生産効率20%向上, 🚨 不良品率0.1%以下, ⚡ ライン稼働率95%+',logistics:'📦 配送精度99%+, ⚡ 在庫回転率向上30%, 🚚 遅延率2%以下',agriculture:'🌱 収量予測精度85%+, 📱 現場入力完了率90%+, ⚡ 農薬最適化20%削減',energy:'⚡ エネルギー削減15%+, 📊 計測精度99%+, 🚨 異常検知率95%+',media:'📺 月間視聴1万時間+, 🔄 継続率60%+, 📈 広告収益月10万円+',government:'🏛 申請処理3日以内, 😊 市民満足度4/5+, 🔒 データ漏洩ゼロ',travel:'✈️ 予約CV率8%+, 😊 旅行者満足度4.5/5, 🔄 リピート率40%+',insurance:'🔒 審査処理24時間以内, 💰 損害率10%削減, 😊 顧客維持率95%+'};
    var _sucEn={saas:'📈 1,000 MAU, 💰 $1K MRR, 🔄 <5% monthly churn',ec:'💰 $10K GMV, 💰 3%+ conversion, 🏪 <30% cart abandon',marketplace:'💰 $10K GMV, 💰 10% take rate, 🏪 95%+ fulfillment',education:'📚 80%+ completion, 📚 70%+ quiz pass, 🔄 50%+ 7-day streak',community:'👥 50+ posts/day, 👥 10%+ member growth/mo, 🔄 30%+ DAU/MAU',fintech:'💰 $100K transactions/mo, 🏢 99%+ fraud detection, ⚡ 99.5%+ payment success',analytics:'🏢 Reports in <1min, 📈 1,000 MAU, 😊 CSAT 4.5/5',booking:'🏪 60%+ booking conv., 🏪 80%+ utilization, 😊 CSAT 4.5/5',hr:'🏢 <30 days time-to-hire, 🏢 80%+ offer acceptance, 😊 4/5 employee satisfaction',automation:'🤖 70% manual reduction, 🤖 50% time saved, ⚡ <0.1% error rate',ai:'🤖 90%+ AI accuracy, 🤖 <20% human handoff, 😊 CSAT 4.5/5',collab:'👥 5+ concurrent editors, 🔄 80%+ feature adoption, 😊 NPS 50+',
      content:'📝 10K monthly PVs, ⏱ 3+ min avg session, 📧 10%+ subscriber conversion',health:'😊 500+ daily users, 🏥 80%+ feature adoption, ⚡ <1s response time',iot:'📡 99%+ device uptime, ⚡ <1s sensor response, 🚨 95%+ anomaly detection',realestate:'🏠 15%+ deal close rate, 📊 30%+ viewing rate, 😊 CSAT 4.5/5',legal:'⚖️ 24hr document processing, 🔒 Zero confidential breach, 😊 4/5+ client satisfaction',portfolio:'👁 5K+ monthly views, 📧 10+ contacts/month, ⭐ Higher job offer rate',tool:'⚡ 30% faster than alternatives, 🔄 60%+ weekly active rate, 😊 CSAT 4.5/5',event:'🎫 1,000 tickets/month, 🏪 <5% cancellation, 😊 4.5/5 attendee satisfaction',gamify:'🎮 40%+ DAU/MAU ratio, 🔄 60%+ 7-day retention, 🏆 70%+ badge completion',devtool:'⭐ 1K+ GitHub stars, 🔄 500+ weekly active devs, 📦 10K+ monthly installs',creator:'🎨 100+ posts/month, 👥 10%+ follower growth/mo, 💰 $100+ monthly creator revenue',newsletter:'📧 35%+ open rate, 🔗 10%+ click rate, 📈 5%+ subscriber growth/mo',manufacturing:'🏭 20% efficiency gain, 🚨 <0.1% defect rate, ⚡ 95%+ line uptime',logistics:'📦 99%+ delivery accuracy, ⚡ 30% inventory turnover, 🚚 <2% delay rate',agriculture:'🌱 85%+ yield prediction, 📱 90%+ field entry completion, ⚡ 20% pesticide reduction',energy:'⚡ 15%+ energy reduction, 📊 99%+ measurement accuracy, 🚨 95%+ anomaly detection',media:'📺 10K+ watch hours/mo, 🔄 60%+ retention rate, 📈 $1K+ monthly ad revenue',government:'🏛 3-day processing, 😊 4/5+ citizen satisfaction, 🔒 Zero data breach',travel:'✈️ 8%+ booking conversion, 😊 4.5/5 traveler satisfaction, 🔄 40%+ repeat rate',insurance:'🔒 24hr claim processing, 💰 10% loss ratio reduction, 😊 95%+ retention'};
    if(_domSuc&&(_en?_sucEn[_domSuc]:_sucJa[_domSuc])){S.answers.success=_en?_sucEn[_domSuc]:_sucJa[_domSuc];}
  }
  // N-7: orm from backend type
  if(!S.answers.orm&&be&&!/Firebase|Supabase|Convex|なし|None|static/i.test(be)){
    if(/Python/i.test(be))S.answers.orm='SQLAlchemy (Python)';
    else if(/NestJS/i.test(be))S.answers.orm='TypeORM';
    else S.answers.orm='Prisma';
  }
  // N-8: scope_out from current preset config (excluded features → scope_out)
  if(!S.answers.scope_out){
    var _so=[];var _soE=[];
    var _pa=S.answers.payment||'';var _mo=S.answers.mobile||'';var _aa=S.answers.ai_auto||'';
    if(_pa&&/none|なし/i.test(_pa)){_so.push('決済機能');_soE.push('Payments');}
    if(_mo&&/none|なし/i.test(_mo)){_so.push('ネイティブアプリ');_soE.push('Native app');}
    if(_aa&&/none|なし/i.test(_aa)){_so.push('AI機能');_soE.push('AI features');}
    if(_so.length>0){S.answers.scope_out=_en?_soE.join(', '):_so.join(', ');}
  }
  // N-9: future_features from preset config (out-of-scope items become future features)
  if(!S.answers.future_features){
    var _ff=[];var _ffE=[];
    var _pa2=S.answers.payment||'';var _mo2=S.answers.mobile||'';var _aa2=S.answers.ai_auto||'';
    _ff.push('分析レポート');_ffE.push('Analytics');
    if(!_pa2||/none|なし/i.test(_pa2)){_ff.push('課金・サブスク');_ffE.push('Billing');}
    if(!_mo2||/none|なし/i.test(_mo2)){_ff.push('モバイルアプリ');_ffE.push('Mobile app');}
    if(!_aa2||/none|なし/i.test(_aa2)){_ff.push('AI機能');_ffE.push('AI features');}
    _ff.push('チーム機能');_ffE.push('Team features');
    S.answers.future_features=_en?_ffE.join(', '):_ff.join(', ');
  }
  // G-1: success KPI for field presets (category-based, 20 field categories)
  if(!S.answers.success&&(S.preset||'').startsWith('field:')){
    var _fpKey2=(S.preset||'').slice(6);
    var _fp2=(typeof PR_FIELD!=='undefined'&&_fpKey2)?PR_FIELD[_fpKey2]:null;
    var _fpField2=_fp2?_fp2.field:'';
    var _sucFldJa={engineering:'🏭 工程時間30%短縮, 🚨 不良品率0.1%以下, ⚡ 計測精度99%+',science:'📊 分析精度90%+, 📝 論文引用数向上, 🔬 実験サイクル50%短縮',agriculture:'🌱 収量20%向上, 📱 現場記録完了率90%+, ⚡ 農薬使用量30%削減',medical:'🏥 診断サポート精度90%+, ⚡ 患者待ち時間30%削減, 🔒 データ漏洩ゼロ',social:'📈 DAU 1000人+, 💬 エンゲージ率20%+, 🔄 月次継続率85%+',humanities:'📚 リサーチ効率50%向上, 📝 執筆量30%増, 👥 コラボ参加率70%+',education_field:'📚 学習完了率80%+, 📊 テスト成績10%向上, 🔄 7日継続率60%+',art:'🎨 作品投稿数月200件+, 👥 クリエイター数500人+, 💰 月間売上10万円+',interdisciplinary:'🤝 プロジェクト完了率90%+, 👥 学際コラボ数月10件+, 📈 成果発表率80%+',environment:'🌿 CO2削減量10%+, 📊 ESGスコア向上, 🚨 異常早期発見率95%+',architecture:'🏠 設計効率40%向上, 📊 承認フロー50%短縮, 😊 顧客満足度4.5/5',sports:'⚡ パフォーマンス指標10%向上, 🏆 目標達成率80%+, 🔄 トレーニング継続率90%+',welfare:'👴 サービス提供効率30%向上, 📱 記録入力時間50%短縮, 😊 利用者満足度4/5+',tourism:'✈️ 予約CV率10%+, 😊 旅行者満足度4.5/5, 🔄 リピート訪問率40%+',biotech:'🔬 実験データ精度95%+, 📊 承認申請期間30%短縮, 🔒 GxP準拠100%',mobility:'🚗 交通最適化15%向上, 📡 データ収集精度99%+, ⚡ 応答時間1秒以内',cybersecurity:'🔒 脅威検知率99%+, ⚡ インシデント応答1時間以内, 📊 誤検知率0.1%以下',fintech_field:'💰 取引精度99.99%+, 🔒 不正検知率99%+, ⚡ 決済応答1秒以内',smart_factory:'🏭 OEE90%+, 🚨 異常予知精度90%+, ⚡ 計画外停止30%削減',cross_theme:'📈 月間1000ユーザー, 🔄 継続率80%+, 😊 CSAT 4.5/5'};
    var _sucFldEn={engineering:'🏭 30% cycle time reduction, 🚨 <0.1% defect rate, ⚡ 99%+ measurement accuracy',science:'📊 90%+ analysis accuracy, 📝 Citation impact improvement, 🔬 50% faster experiment cycles',agriculture:'🌱 20% yield increase, 📱 90%+ field record completion, ⚡ 30% pesticide reduction',medical:'🏥 90%+ diagnostic support accuracy, ⚡ 30% wait time reduction, 🔒 Zero data breach',social:'📈 1,000+ DAU, 💬 20%+ engagement rate, 🔄 85%+ monthly retention',humanities:'📚 50% faster research, 📝 30% more output, 👥 70%+ collaboration rate',education_field:'📚 80%+ course completion, 📊 10% grade improvement, 🔄 60%+ 7-day streak',art:'🎨 200+ works/month, 👥 500+ creators, 💰 $1K+ monthly creator revenue',interdisciplinary:'🤝 90%+ project completion, 👥 10+ cross-discipline collabs/month, 📈 80%+ publication rate',environment:'🌿 10%+ CO2 reduction, 📊 ESG score improvement, 🚨 95%+ early anomaly detection',architecture:'🏠 40% design efficiency, 📊 50% faster approvals, 😊 4.5/5 client satisfaction',sports:'⚡ 10% performance improvement, 🏆 80%+ goal achievement, 🔄 90%+ training adherence',welfare:'👴 30% efficiency gain, 📱 50% faster record input, 😊 4/5+ user satisfaction',tourism:'✈️ 10%+ booking conversion, 😊 4.5/5 traveler satisfaction, 🔄 40%+ repeat visitors',biotech:'🔬 95%+ experimental accuracy, 📊 30% faster regulatory approval, 🔒 100% GxP compliance',mobility:'🚗 15% traffic optimization, 📡 99%+ data collection accuracy, ⚡ <1s response time',cybersecurity:'🔒 99%+ threat detection, ⚡ <1hr incident response, 📊 <0.1% false positive rate',fintech_field:'💰 99.99%+ transaction accuracy, 🔒 99%+ fraud detection, ⚡ <1s payment response',smart_factory:'🏭 OEE 90%+, 🚨 90%+ predictive accuracy, ⚡ 30% less unplanned downtime',cross_theme:'📈 1,000+ MAU, 🔄 80%+ retention, 😊 CSAT 4.5/5'};
    if(_fpField2&&_sucFldJa[_fpField2]){S.answers.success=_en?(_sucFldEn[_fpField2]||_sucFldJa[_fpField2]):_sucFldJa[_fpField2];}
  }
  // G-2: skill_level from S.skillLv (options: Beginner / Intermediate / Professional)
  if(!S.answers.skill_level){
    var _slv2=typeof S.skillLv==='number'?S.skillLv:3;
    S.answers.skill_level=_slv2<=1?'Beginner':_slv2>=5?'Professional':'Intermediate';
  }
  // G-3: learning_goal from deadline (options mapped to question labels)
  if(!S.answers.learning_goal&&S.answers.deadline){
    var _dl=S.answers.deadline||'';
    if(/12ヶ月|12 month/i.test(_dl)){S.answers.learning_goal=_en?'12 months thorough':'12ヶ月じっくり';}
    else if(/6ヶ月|6 month/i.test(_dl)){S.answers.learning_goal=_en?'6 months standard':'6ヶ月標準';}
    else{S.answers.learning_goal=_en?'3 months intensive':'3ヶ月集中';}
  }
  // G-4: learning_path from backend/mobile/ai_auto/payment
  if(!S.answers.learning_path){
    var _mo3=S.answers.mobile||'';var _aa3=S.answers.ai_auto||'';var _pm3=S.answers.payment||'';
    if(/オーケストレーター|Orchestrator/i.test(_aa3)||/フル自律|Full Autonomous/i.test(_aa3)){
      S.answers.learning_path=_en?'AI Orchestrator':'AI自律オーケストレーター';
    } else if(/Billing|サブスク/i.test(_pm3)&&/Stripe/i.test(_pm3)){
      S.answers.learning_path=_en?'SaaS Monetization':'SaaS収益化特化';
    } else if(/Expo|Flutter/i.test(_mo3)&&!/none|なし/i.test(_mo3)){
      S.answers.learning_path=_en?'Fullstack+Mobile':'フルスタック+モバイル';
    } else if(/Firebase|Supabase|Convex/i.test(be)){
      S.answers.learning_path='React + BaaS';
    } else {
      S.answers.learning_path='PERN Stack';
    }
  }
  // G-7: dev_schedule from deadline (sprint plan inference)
  if(!S.answers.dev_schedule&&S.answers.deadline){
    var _dl7=S.answers.deadline||'';
    if(/2週間|2 week/i.test(_dl7)){
      S.answers.dev_schedule=_en?'2 weeks (Ultra MVP: 1 sprint × 2 weeks)':'2週間（超MVP: 1スプリント × 2週）';
    } else if(/1ヶ月|1 month/i.test(_dl7)){
      S.answers.dev_schedule=_en?'1 month (Basic MVP: 2 sprints × 2 weeks)':'1ヶ月（基本MVP: 2スプリント × 2週）';
    } else if(/6ヶ月|6 month/i.test(_dl7)){
      S.answers.dev_schedule=_en?'6 months (v1.0: 12 sprints × 2 weeks)':'6ヶ月（v1.0: 12スプリント × 2週）';
    } else {
      S.answers.dev_schedule=_en?'3 months (Full MVP: 6 sprints × 2 weeks)':'3ヶ月（フルMVP: 6スプリント × 2週）';
    }
  }
  // G-6: dev_methods from S.skillLv (when not set by preset)
  if(!S.answers.dev_methods){
    var _slv6=typeof S.skillLv==='number'?S.skillLv:3;
    if(_slv6>=5){
      S.answers.dev_methods=_en
        ?'TDD (Test-Driven), BDD (Behavior-Driven), SDD (Spec-Driven), DDD (Domain-Driven), MDD (Model-Driven)'
        :'TDD（テスト駆動）, BDD（振る舞い駆動）, SDD（仕様駆動）, DDD（ドメイン駆動）, MDD（モデル駆動）';
    } else if(_slv6>=2){
      S.answers.dev_methods=_en
        ?'TDD (Test-Driven), BDD (Behavior-Driven), SDD (Spec-Driven)'
        :'TDD（テスト駆動）, BDD（振る舞い駆動）, SDD（仕様駆動）';
    } else {
      S.answers.dev_methods=_en
        ?'TDD (Test-Driven), SDD (Spec-Driven)'
        :'TDD（テスト駆動）, SDD（仕様駆動）';
    }
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
