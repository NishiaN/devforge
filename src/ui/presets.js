/* ═══ PRESET & START ═══ */
function pickSkill(lv){S.skill=lv;document.querySelectorAll('.skcard').forEach(c=>{c.classList.toggle('on',c.dataset.lv===lv);c.setAttribute('aria-checked',String(c.dataset.lv===lv));});save();}

function initPresets(){
  const row=$('presetRow');row.innerHTML='';
  const _ja=S.lang==='ja';
  Object.entries(PR).forEach(([k,v])=>{
    if(k==='custom'||!v.name)return;
    const c=document.createElement('span');c.className='prchip';
    c.textContent=(v.icon||'')+(v.icon?' ':'')+(!_ja&&v.nameEn?v.nameEn:v.name);
    c.onclick=(e)=>pickPreset(k,e);
    // Preview tooltip
    const _en=!_ja;
    const desc=(_en&&v.purposeEn)?v.purposeEn:v.purpose||'';
    const fe=v.frontend||'-';
    const be=v.backend||'-';
    const fts=(_en&&v.featuresEn?v.featuresEn:v.features)||[];
    const ftStr=Array.isArray(fts)?fts.slice(0,3).join(', ')+(fts.length>3?' …':''):fts;
    c.title=`${desc}\n─────\nFrontend: ${fe}\nBackend: ${be}\nFeatures: ${ftStr}`;
    row.appendChild(c);
  });
  // Compare button
  const cb=document.createElement('span');cb.className='prchip prchip-cmp';
  cb.textContent=_ja?'⚔️ 比較':'⚔️ Compare';
  cb.onclick=()=>showPresetCompare();
  row.appendChild(cb);
}

function showPresetCompare(){
  const _ja=S.lang==='ja';const _en=S.lang==='en';
  const keys=Object.keys(PR).filter(k=>k!=='custom'&&PR[k].name);
  const opts=keys.map(k=>{const p=PR[k];return `<option value="${k}">${p.icon||''} ${_en&&p.nameEn?p.nameEn:p.name}</option>`;}).join('');
  const ov=document.createElement('div');ov.className='guide-overlay';ov.id='cmpOv';
  ov.onclick=e=>{if(e.target===ov)ov.remove();};
  ov.innerHTML=`<div class="guide-modal" style="max-width:680px;width:95%;">
    <div class="guide-header"><span class="guide-em">⚔️</span><div><div class="guide-title">${_ja?'テンプレート比較':'Template Comparison'}</div><div class="guide-sub">${_ja?'2つのプリセットを並べて比較':'Compare two presets side by side'}</div></div><button class="guide-close" onclick="$('cmpOv').remove()">✕</button></div>
    <div class="cmp-selectors"><select id="cmpA" onchange="renderCompare()">${opts}</select><span class="cmp-vs">VS</span><select id="cmpB" onchange="renderCompare()">${opts.replace('value="'+keys[0]+'"','value="'+keys[1]+'"')}</select></div>
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
  const p=PR[S.preset];const _en=S.lang==='en';
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
  const presetName=p&&p.name?(_en&&p.nameEn?p.nameEn:p.name):'';
  const preFilledCount=Object.keys(S.answers).length;
  save();saveProject();
  $('onboard').style.display='none';
  $('ws').style.display='flex';
  initPills();updProgress();showQ();
  if(presetName&&preFilledCount>0){
    toast(_ja?`✅ "${presetName}" を適用 — ${preFilledCount}件の回答を自動入力`:`✅ Applied "${presetName}" — ${preFilledCount} answers pre-filled`);
  }
}
