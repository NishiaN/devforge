/* ═══ WIZARD CORE ═══ */
function findQStep(qId){
  if(typeof getQ!=='function')return null;
  const qs=getQ();
  for(let p=1;p<=3;p++){
    const ph=qs[p];if(!ph)continue;
    for(let s=0;s<ph.questions.length;s++){
      if(ph.questions[s].id===qId)return{phase:p,step:s,q:ph.questions[s]};}
  }
  return null;
}
function _applyCompatFix(btn,f,s){
  S.answers[f]=s;save();
  const _ja=S.lang==='ja';
  const p=btn.parentNode;
  p.textContent='';
  const sp=document.createElement('span');
  sp.textContent='✅ '+(_ja?'修正済':'Fixed')+': '+f+' → '+s;
  p.appendChild(sp);
}
function _applyCascadingFix(btn,chainJson){
  const chain=_jp(chainJson,[]);
  if(!chain.length)return;
  chain.forEach(function(c){if(c&&c.f&&c.s)S.answers[c.f]=c.s;});
  save();
  const _ja=S.lang==='ja';
  const p=btn.parentNode;p.textContent='';
  const sp=document.createElement('span');
  sp.textContent='✅ '+(_ja?'一括修正済: ':'Batch fixed: ')+chain.map(function(c){return c.f+' → '+c.s;}).join(', ');
  p.appendChild(sp);
}
function initPills(){
  const _ja=S.lang==='ja';
  const c=$('sbPills');if(!c)return;c.innerHTML='';
  const qs=getQ();
  for(let i=1;i<=3;i++){
    const ph=qs[i];if(!ph)continue;
    const d=document.createElement('div');d.className='pd-phase';d.id='pp'+i;
    d.innerHTML='<span class="pd-dot"></span>'+ph.name;
    d.setAttribute('tabindex','0');d.setAttribute('role','button');
    d.onclick=()=>{if(S.phase>=i){S.phase=i;S.step=0;save();showQ();updProgress();}};
    d.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();d.click();}};
    c.appendChild(d);
    /* Question list under each phase */
    const ul=document.createElement('ul');ul.className='pd-qlist';ul.id='pq'+i;
    ph.questions.forEach((q,si)=>{
      const li=document.createElement('li');li.className='pd-q';
      li.setAttribute('data-qid',q.id);
      const shortQ=q.q.length>18?q.q.slice(0,18)+'…':q.q;
      li.innerHTML='<span class="pd-qmark"></span>'+shortQ;
      li.setAttribute('tabindex','0');
      li.onclick=(e)=>{e.stopPropagation();if(S.phase>i||(S.phase===i&&S.step>=si)){S.phase=i;S.step=si;save();showQ();updProgress();}};
      li.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();li.click();}};
      ul.appendChild(li);
    });
    c.appendChild(ul);
  }
  const tl=$('pdTitle');if(tl)tl.textContent=_ja?'進捗':'Progress';
  const gb=$('pdGenBtn');if(gb)gb.textContent=_ja?'🚀 生成':'🚀 Generate';
}
function isQActive(q){
  if(!q.condition)return true;
  const[k,fn]=Object.entries(q.condition)[0];
  return fn(S.answers[k]||'');
}
function updProgress(){
  const qs=getQ();let total=0,done=0;
  for(let p=1;p<=3;p++){const ph=qs[p];if(!ph)continue;ph.questions.forEach(q=>{if(!isQActive(q))return;total++;if(S.answers[q.id])done++;});}
  const pct=total?Math.round(done/total*100):0;
  $('pbar').style.width=pct+'%';
  const _pstrip=$('pbar').parentElement;if(_pstrip)_pstrip.setAttribute('aria-valuenow',pct);
  
  const pdBar=$('pdBar');if(pdBar)pdBar.style.width=pct+'%';
  const pdPct=$('pdPct');if(pdPct)pdPct.textContent=done+'/'+total+' ('+pct+'%)';
  const cxMiniEl=$('cxMini');if(cxMiniEl&&typeof getComplexityMini==='function')cxMiniEl.innerHTML=getComplexityMini();
  for(let i=1;i<=3;i++){
    const el=$('pp'+i);if(el){el.classList.toggle('active',S.phase===i);el.classList.toggle('done',S.phase>i);}
    /* Update question-level status */
    const ph=qs[i];if(!ph)continue;
    ph.questions.forEach((q,si)=>{
      const li=document.querySelector('.pd-q[data-qid="'+q.id+'"]');
      if(!li)return;
      const active=isQActive(q);
      li.classList.toggle('answered',active&&!!S.answers[q.id]);
      li.classList.toggle('current',active&&S.phase===i&&S.step===si);
      li.classList.toggle('q-na',!active);
    });
  }
  updTOC();
}

function addMsg(type,text,tip,qid,helpId){
  const _ja=S.lang==='ja';
  const body=$('cbody'),d=document.createElement('div');d.className='msg';d.dataset.phase=String(S.phase);
  const cls=type==='bot'?'m-bot':'m-usr';
  const w=document.createElement('div');w.className=cls;w.style.position='relative';
  const lbl=document.createElement('div');lbl.className='m-lbl';
  lbl.textContent=type==='bot'?(_ja?'AI アシスタント':'AI Assistant'):(_ja?'あなた':'You');
  if(type==='bot'&&helpId&&HELP_DATA[helpId]){
    const hb=document.createElement('span');hb.className='q-help';hb.textContent='?';hb.title=_ja?'ヘルプ':'Help';
    hb.setAttribute('role','button');
    hb.setAttribute('aria-label',_ja?'ヘルプ':'Help');
    hb.tabIndex=0;
    hb.onclick=(e)=>showHelp(helpId,e);
    hb.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showHelp(helpId,e);}};
    lbl.appendChild(hb);
  }
  const bd=document.createElement('div');bd.className='m-body';
  text.split('\n').forEach((l,i,a)=>{bd.appendChild(document.createTextNode(l));if(i<a.length-1)bd.appendChild(document.createElement('br'));});
  w.appendChild(lbl);w.appendChild(bd);
  if(type==='user'&&qid){
    const eb=document.createElement('button');
    eb.className='m-edit';eb.textContent='✎';eb.title=_ja?'編集':'Edit';
    eb.onclick=()=>editAnswer(qid,d);
    w.appendChild(eb);
    d.dataset.qid=qid;
  }
  d.appendChild(w);body.appendChild(d);
  if(tip){const tt=document.createElement('div');tt.className='msg';tt.innerHTML='<div class="m-tip">💡 '+esc(tip)+'</div>';body.appendChild(tt);}
  body.scrollTop=body.scrollHeight;
  return d;
}

function downloadHearingSheet(){
  const _ja=S.lang==='ja';
  const pname=($('nameIn')&&$('nameIn').value.trim())||(_ja?'プロジェクト名':'Project Name');
  const today=new Date().toISOString().slice(0,10);
  var md='';
  if(_ja){
    md='# ヒアリングシート: '+pname+'\n';
    md+='> 記入日: '+today+' / 記入者: / 会社名:\n\n';
    md+='## 記入方法\n';
    md+='各セクションの「▶ 記入例」を参考に記入してください。\n';
    md+='記入後、DevForge v9「📋 ヒアリング結果から入力」に貼り付けると8項目が自動マッピングされます。\n\n';
    md+='---\n\n';
    md+='## 目的\n';
    md+='> プロジェクトの目的・解決したい課題を記入してください。\n\n';
    md+='▶ 記入例: 社内の在庫管理をシステム化し、入出庫の手作業ミスをゼロにする。\n\n';
    md+='（ここに記入）\n\n';
    md+='## ターゲットユーザー\n';
    md+='> 主な利用者・対象ユーザー層を記入してください。\n\n';
    md+='▶ 記入例: 倉庫担当者(20名)・店舗マネージャー・経営管理部\n\n';
    md+='（ここに記入）\n\n';
    md+='## 機能要件（MVP）\n';
    md+='> 最低限必要な機能をカンマ区切りまたは箇条書きで記入してください。\n\n';
    md+='▶ 記入例: 入出庫登録, 在庫一覧・検索, アラート通知, CSVエクスポート\n\n';
    md+='（ここに記入）\n\n';
    md+='## データエンティティ\n';
    md+='> 管理するデータの種類（テーブル名）をカンマ区切りで記入してください。\n\n';
    md+='▶ 記入例: User, Product, Warehouse, StockMovement, Alert\n\n';
    md+='（ここに記入）\n\n';
    md+='## 成功指標 (KPI)\n';
    md+='> プロジェクト成功の定義・測定指標を記入してください。\n\n';
    md+='▶ 記入例: 入出庫ミス率90%削減、棚卸し作業時間50%短縮、月次レポート自動化\n\n';
    md+='（ここに記入）\n\n';
    md+='## スケジュール\n';
    md+='> リリース目標日・マイルストーンを記入してください。\n\n';
    md+='▶ 記入例: 2025年9月末MVP、2025年12月末本番リリース\n\n';
    md+='（ここに記入）\n\n';
    md+='## スコープ外\n';
    md+='> 今回対応しない機能・範囲を記入してください（未定の場合は「なし」）。\n\n';
    md+='▶ 記入例: モバイルアプリ, 多言語対応, 外部ERPとの自動連携\n\n';
    md+='（ここに記入）\n\n';
    md+='## 画面一覧\n';
    md+='> 必要な画面・ページを列挙してください。\n\n';
    md+='▶ 記入例: ログイン, ダッシュボード, 在庫一覧, 入出庫登録, アラート設定, レポート\n\n';
    md+='（ここに記入）\n\n';
    md+='---\n\n';
    md+='> **DevForge v9 インポート方法**: ウィザード起動後、Phase 1 Step 0の「📋 ヒアリング結果から入力」をクリックし、このシートの内容を貼り付けてください。8項目が自動マッピングされます。\n';
  } else {
    md='# Hearing Sheet: '+pname+'\n';
    md+='> Date: '+today+' / Author: / Company:\n\n';
    md+='## How to Fill\n';
    md+='Fill in each section using the "Example" as a guide.\n';
    md+='After filling, paste this into DevForge v9 "📋 Import from Hearing Notes" to auto-map 8 fields.\n\n';
    md+='---\n\n';
    md+='## Purpose\n';
    md+='> Describe the project goal and problem to solve.\n\n';
    md+='Example: Digitize warehouse inventory management to eliminate manual entry errors.\n\n';
    md+='(Fill here)\n\n';
    md+='## Target Users\n';
    md+='> Describe the primary users of the system.\n\n';
    md+='Example: Warehouse staff (20 people), Store managers, Finance department\n\n';
    md+='(Fill here)\n\n';
    md+='## MVP Features\n';
    md+='> List the minimum required features, comma-separated or as bullet points.\n\n';
    md+='Example: Stock registration, Inventory search, Alert notifications, CSV export\n\n';
    md+='(Fill here)\n\n';
    md+='## Data Entities\n';
    md+='> List data types (table names) to manage, comma-separated.\n\n';
    md+='Example: User, Product, Warehouse, StockMovement, Alert\n\n';
    md+='(Fill here)\n\n';
    md+='## KPI\n';
    md+='> Define success metrics and measurable goals.\n\n';
    md+='Example: 90% reduction in stock errors, 50% faster stock-taking, automated monthly reports\n\n';
    md+='(Fill here)\n\n';
    md+='## Schedule\n';
    md+='> Target release dates and milestones.\n\n';
    md+='Example: MVP by Sep 2025, Production release by Dec 2025\n\n';
    md+='(Fill here)\n\n';
    md+='## Scope Out\n';
    md+='> Features explicitly out of scope (write "none" if nothing excluded).\n\n';
    md+='Example: Mobile app, Multi-language, Automatic ERP integration\n\n';
    md+='(Fill here)\n\n';
    md+='## Screens\n';
    md+='> List required screens or pages.\n\n';
    md+='Example: Login, Dashboard, Inventory List, Stock Entry, Alert Settings, Reports\n\n';
    md+='(Fill here)\n\n';
    md+='---\n\n';
    md+='> **DevForge v9 Import**: After launching the wizard, click "📋 Import from Hearing Notes" at Phase 1 Step 0 and paste this sheet. 8 fields will be auto-mapped.\n';
  }
  var blob=new Blob([md],{type:'text/markdown;charset=utf-8'});
  var url=URL.createObjectURL(blob);
  var a=document.createElement('a');
  a.href=url;a.download='hearing-sheet.md';
  document.body.appendChild(a);a.click();
  document.body.removeChild(a);URL.revokeObjectURL(url);
  toast(_ja?'📋 ヒアリングシートをダウンロードしました':'📋 Hearing sheet downloaded');
}
function showHearingImport(){
  const _ja=S.lang==='ja';
  const overlay=document.createElement('div');
  overlay.className='modal-overlay';overlay.id='hearingImportModal';
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
  let html='<div class="modal-box" style="max-width:600px;width:95vw">';
  html+='<div class="modal-header"><h3 class="modal-title">📋 '+(_ja?'ヒアリング結果からインポート':'Import from Hearing Notes')+'</h3>';
  html+='<button class="modal-close" onclick="document.getElementById(\'hearingImportModal\').remove()" aria-label="Close">✕</button></div>';
  html+='<div class="modal-body">';
  html+='<p style="font-size:12px;color:var(--text-muted);margin-bottom:8px">'+(_ja?'ヒアリングシートのMarkdownをペーストしてください。目的・ターゲット・機能要件・エンティティ・KPI・スケジュール・スコープ外・画面一覧を自動マッピングします。':'Paste your hearing sheet Markdown. Purpose, target, features, entities, KPI, schedule, scope-out, and screens will be auto-mapped.')+'</p>';
  html+='<div id="hearingDropZone" class="hearing-drop-zone">';
  html+='<span>'+(_ja?'📂 .mdファイルをドラッグ&ドロップ':'📂 Drag & drop .md file here')+'</span>';
  html+='<button class="btn btn-xs btn-s" onclick="document.getElementById(\'hearingFileIn\').click()" style="margin-left:8px">'+(_ja?'ファイル選択':'Choose File')+'</button>';
  html+='<input type="file" id="hearingFileIn" accept=".md,.txt,.markdown" style="display:none">';
  html+='</div>';
  html+='<textarea id="hearingImportTA" style="width:100%;height:180px;background:var(--bg-3);border:1px solid var(--border);border-radius:6px;padding:8px;font-size:12px;font-family:var(--mono);color:var(--text);resize:vertical;box-sizing:border-box" placeholder="'+(_ja?'## 目的\n...\n## ターゲット\n...\n## 機能要件\n...\n## KPI\n...\n## スケジュール\n...\n## スコープ外\n...\n## 画面一覧\n...':'## Purpose\n...\n## Target\n...\n## Features\n...\n## KPI\n...\n## Schedule\n...\n## Out of scope\n...\n## Screens\n...')+'"></textarea>';
  html+='<div id="hearingPreview" style="margin-top:12px"></div>';
  html+='<div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">';
  html+='<button class="btn btn-sm" onclick="previewHearingImport()">'+(_ja?'🔍 プレビュー':'🔍 Preview')+'</button>';
  html+='<button class="btn btn-sm btn-primary" id="hearingApplyBtn" style="display:none" onclick="applyHearingImport()">'+(_ja?'✅ 適用':'✅ Apply')+'</button>';
  html+='</div></div></div>';
  overlay.innerHTML=html;
  overlay.onclick=e=>{if(e.target===overlay)overlay.remove();};
  document.body.appendChild(overlay);
  // File input handler
  const fi=overlay.querySelector('#hearingFileIn');
  if(fi)fi.onchange=function(e){
    const f=e.target.files[0];if(!f)return;
    var reader=new FileReader();
    reader.onload=function(ev){
      const ta2=overlay.querySelector('#hearingImportTA');
      if(ta2){ta2.value=ev.target.result;previewHearingImport();}
    };
    reader.readAsText(f);
  };
  // Drag & drop handlers
  const dz=overlay.querySelector('#hearingDropZone');
  const ta=overlay.querySelector('#hearingImportTA');
  if(dz){
    dz.ondragover=function(e){e.preventDefault();dz.classList.add('hearing-drop-active');};
    dz.ondragleave=function(){dz.classList.remove('hearing-drop-active');};
    dz.ondrop=function(e){
      e.preventDefault();dz.classList.remove('hearing-drop-active');
      const f=e.dataTransfer.files[0];if(!f)return;
      var reader=new FileReader();
      reader.onload=function(ev){if(ta){ta.value=ev.target.result;previewHearingImport();}};
      reader.readAsText(f);
    };
  }
  // textarea にもドロップ可能にする
  if(ta){
    ta.ondragover=function(e){e.preventDefault();dz&&dz.classList.add('hearing-drop-active');};
    ta.ondragleave=function(){dz&&dz.classList.remove('hearing-drop-active');};
    ta.ondrop=function(e){
      e.preventDefault();dz&&dz.classList.remove('hearing-drop-active');
      const f=e.dataTransfer&&e.dataTransfer.files[0];
      if(f){
        var reader=new FileReader();
        reader.onload=function(ev){ta.value=ev.target.result;previewHearingImport();};
        reader.readAsText(f);
        e.stopPropagation();
      }
    };
    ta.focus();
  }
}
function parseHearingData(text){
  const result={};
  if(!text)return result;
  const safe=s=>sanitize(String(s||'').trim().replace(/\n+/g,' ').replace(/\s+/g,' '),300);
  // Section-based parsing: find ##/### headings and extract content
  const sections={};
  const lines=text.split('\n');
  let curKey=null,curLines=[];
  const flush=()=>{if(curKey&&curLines.length){const v=curLines.join('\n').trim();if(v)sections[curKey]=(sections[curKey]?sections[curKey]+'\n':'')+v;}};
  for(const line of lines){
    const hm=line.match(/^#{1,3}\s+(.+)$/);
    if(hm){flush();curKey=hm[1].trim().toLowerCase();curLines=[];}
    else if(curKey&&line.trim()){
      const lt=line.trim();
      if(/^>/.test(lt)||/^▶|^記入例|^Example:/i.test(lt)||/^---+$/.test(lt)||/^（ここに記入）$|^\(Fill here\)$/i.test(lt))continue;
      var cl=lt.replace(/^[-*•]\s*/,'').trim().replace(/^（([^）]*)）$/,'$1').replace(/^\(([^)]*)\)$/,'$1').trim();
      if(cl)curLines.push(cl);
    }
  }
  flush();
  const getSection=(...keys)=>{
    for(const k of keys){
      const found=Object.keys(sections).find(sk=>sk.includes(k.toLowerCase()));
      if(found&&sections[found].trim())return sections[found].trim();
    }
    return '';
  };
  const extractList=text=>{
    if(!text)return '';
    const items=text.split('\n').map(l=>l.replace(/^[-*\d.]+\s*/,'').trim()).filter(Boolean);
    return items.join(', ');
  };
  const purpose=getSection('目的','purpose','概要','overview','プロジェクト');
  if(purpose)result.purpose={val:safe(purpose),conf:'detected'};
  const target=getSection('ターゲット','target','ユーザー','user','対象');
  if(target)result.target={val:safe(extractList(target)||target),conf:'detected'};
  const features=getSection('機能要件','機能','features','feature','mvp','要件');
  if(features)result.mvp_features={val:safe(extractList(features)||features),conf:'detected'};
  const entities=getSection('データ','entity','entities','エンティティ','テーブル','table');
  if(entities)result.data_entities={val:safe(extractList(entities)||entities),conf:'detected'};
  const kpi=getSection('成功指標','kpi','指標','success','kpi','目標','goal');
  if(kpi)result.success={val:safe(extractList(kpi)||kpi),conf:'detected'};
  const schedule=getSection('スケジュール','schedule','deadline','期間','リリース','release');
  if(schedule)result.deadline={val:safe(schedule),conf:'estimated'};
  const scopeOut=getSection('スコープ外','scope','除外','out of scope','対象外','やらないこと');
  if(scopeOut)result.scope_out={val:safe(extractList(scopeOut)||scopeOut),conf:'detected'};
  const screens=getSection('画面','screen','page','ページ','画面一覧','ui');
  if(screens)result.screens={val:safe(extractList(screens)||screens),conf:'detected'};
  return result;
}
function previewHearingImport(){
  const _ja=S.lang==='ja';
  const ta=document.getElementById('hearingImportTA');if(!ta)return;
  const text=ta.value;
  if(!text.trim()){
    const prev=document.getElementById('hearingPreview');
    if(prev)prev.innerHTML='<p style="color:var(--warn);font-size:12px">'+(_ja?'⚠️ テキストを入力してください':'⚠️ Please enter text')+'</p>';
    return;
  }
  const parsed=parseHearingData(text);
  window._hearingParsed=parsed;
  const fieldLabels=_ja?{purpose:'目的',target:'ターゲット',mvp_features:'機能要件',data_entities:'データエンティティ',success:'成功指標',deadline:'スケジュール',scope_out:'スコープ外',screens:'画面一覧'}:{purpose:'Purpose',target:'Target',mvp_features:'MVP Features',data_entities:'Entities',success:'KPI',deadline:'Schedule',scope_out:'Scope Out',screens:'Screens'};
  const allFields=['purpose','target','mvp_features','data_entities','success','deadline','scope_out','screens'];
  let html='<table class="hearing-preview-table"><thead><tr><th>'+(_ja?'項目':'Field')+'</th><th>'+(_ja?'状態':'Status')+'</th><th>'+(_ja?'マッピング値（先頭60文字）':'Mapped Value (first 60 chars)')+'</th></tr></thead><tbody>';
  allFields.forEach(f=>{
    const r=parsed[f];
    const icon=r?(r.conf==='detected'?'<span class="hearing-field-status status-ok">✅</span>':'<span class="hearing-field-status status-est">⚠️</span>'):'<span class="hearing-field-status status-none">❌</span>';
    const conf=r?(r.conf==='detected'?(_ja?'検出':'Detected'):(_ja?'推定':'Estimated')):(_ja?'未検出':'Not found');
    const val=r?esc(String(r.val).slice(0,60)):'—';
    html+='<tr><td>'+esc(fieldLabels[f]||f)+'</td><td>'+icon+' '+esc(conf)+'</td><td style="font-size:11px;font-family:var(--mono)">'+val+'</td></tr>';
  });
  html+='</tbody></table>';
  const detectedCount=Object.keys(parsed).length;
  html+='<p style="font-size:12px;margin-top:8px;color:var(--text-muted)">'+(_ja?'🔍 '+detectedCount+'/'+allFields.length+' 項目を検出しました。「適用」で回答に反映されます。':'🔍 Detected '+detectedCount+'/'+allFields.length+' fields. Click "Apply" to map to wizard answers.')+'</p>';
  const prev=document.getElementById('hearingPreview');if(prev)prev.innerHTML=html;
  const applyBtn=document.getElementById('hearingApplyBtn');
  if(applyBtn)applyBtn.style.display=detectedCount>0?'':'none';
}
function applyHearingImport(){
  const _ja=S.lang==='ja';
  const parsed=window._hearingParsed||{};
  if(!Object.keys(parsed).length){toast(_ja?'⚠️ インポートするデータがありません':'⚠️ No data to import');return;}
  Object.entries(parsed).forEach(([field,r])=>{if(r&&r.val)S.answers[field]=r.val;});
  if(typeof _applyUniversalPostProcess==='function')_applyUniversalPostProcess();
  save();
  const modal=document.getElementById('hearingImportModal');if(modal)modal.remove();
  const count=Object.keys(parsed).length;
  toast(_ja?'✅ '+count+'項目をインポートしました':'✅ Imported '+count+' fields');
  if(typeof updProgress==='function')updProgress();
}

function showQ(){
  const qs=getQ();
  const ph=qs[S.phase];if(!ph)return;
  // Skip conditional questions
  while(S.step<ph.questions.length){
    const q=ph.questions[S.step];
    if(!isQActive(q)){S.step++;continue;}
    break;
  }
  if(S.step>=ph.questions.length){phaseEnd();return;}
  const q=ph.questions[S.step];
  $('pdTitle').textContent=ph.name;
  updProgress();
  // Show hearing import button at Phase 1 Step 0 for Lv2+
  if(S.phase===1&&S.step===0&&S.skillLv>=2&&!document.getElementById('hearingImportBanner')){
    const _ja=S.lang==='ja';
    const body=$('cbody');if(body){
      const banner=document.createElement('div');banner.className='msg';banner.id='hearingImportBanner';
      const d=document.createElement('div');d.className='hearing-import-banner';
      const btn=document.createElement('button');btn.className='btn btn-sm btn-g';
      btn.textContent='📋 '+(_ja?'ヒアリング結果から入力':'Import from Hearing Notes');
      btn.onclick=()=>showHearingImport();
      d.appendChild(btn);
      const tip=document.createElement('span');tip.className='hearing-import-tip';
      tip.textContent=_ja?'（ヒアリングシートのMarkdownを貼り付けて自動入力）':'(Paste hearing sheet Markdown for auto-fill)';
      d.appendChild(tip);
      banner.appendChild(d);body.appendChild(banner);body.scrollTop=body.scrollHeight;
    }
  }
  addMsg('bot',q.q,q.tip,null,q.help);
  if(q.id==='scope_out'){const body=$('chatBody');if(body){const _ja=S.lang==='ja';const w=document.createElement('div');w.className='msg';w.innerHTML='<div class="compat-warn"><span class="compat-icon">⚠️</span><span class="compat-msg">'+(_ja?'よくある失敗: スコープ外を定義しないと「機能追加地獄」に陥り、MVPが完成しません。':'Common pitfall: Without defining scope-out, you\'ll fall into "feature hell" and never ship your MVP.')+'</span></div>';body.appendChild(w);body.scrollTop=body.scrollHeight;}}
  renderInputFor(q,(val)=>{
    if(S.skillLv>=5){showConfirm(val,()=>{doSubmit(q.id,val);});}
    else{doSubmit(q.id,val);}
  },true);
}

function doSubmit(qid,val){
  S.answers[qid]=sanitize(val.trim?val.trim():String(val));
  addMsg('user',String(val),null,qid);
  showCompatAlert(S.answers);
  if(qid==='purpose')showDomainHint(S.answers[qid]);
  if(typeof renderCompatBadge==='function')renderCompatBadge();
  if(typeof renderWizPreviewCard==='function')renderWizPreviewCard();
  S.step++;save();
  setTimeout(()=>{
    const ph=getQ()[S.phase];
    if(!ph||S.step>=ph.questions.length)phaseEnd();
    else showQ();
  },300);
}
function showDomainHint(purposeVal){
  if(!purposeVal||typeof detectDomain!=='function')return;
  const _ja=S.lang==='ja';
  const dom=detectDomain(purposeVal);
  if(!dom)return;
  const _hints={
    fintech:{ja:'💡 fintechドメイン: MFA・AuditLog・コンプライアンス対応が必須です。後の質問でこれらを設定できます。docs/121参照',en:'💡 Fintech domain: MFA, AuditLog, and compliance are required. You can configure these in later questions. See docs/121'},
    health:{ja:'💡 healthドメイン: PHI暗号化・厳格なアクセス制御・監査ログが規制要件です。個人情報保護の設定を必ず確認してください。docs/08参照',en:'💡 Health domain: PHI encryption, strict access control, and audit logs are regulatory requirements. Be sure to configure data protection. See docs/08'},
    ec:{ja:'💡 ecドメイン: 決済セキュリティ・在庫管理の同時更新競合・高負荷対策が重要です。楽観ロックとStripe Webhook署名を設定してください。docs/05参照',en:'💡 E-commerce domain: Payment security, inventory concurrency, and high-load handling are key. Configure optimistic locking and Stripe Webhook validation. See docs/05'},
    education:{ja:'💡 educationドメイン: 未成年ユーザーのCOPPA/GDPR対応・LTI連携・コンテンツ著作権確認が重要です。年齢確認フローを検討してください。docs/20参照',en:'💡 Education domain: COPPA/GDPR for minors, LTI integration, and content copyright are key. Consider age verification flows. See docs/20'},
    legal:{ja:'💡 legalドメイン: 電子署名の法的有効性・契約書バージョン管理・改ざん不可の監査ログが必要です。docs/08参照',en:'💡 Legal domain: E-signature validity, contract version control, and tamper-proof audit logs are required. See docs/08'},
    government:{ja:'💡 governmentドメイン: WCAG 2.1 AAアクセシビリティ・個人情報の目的外利用防止・申請フロー全経路のE2Eテストが必要です。docs/20参照',en:'💡 Government domain: WCAG 2.1 AA accessibility, purpose-limitation for personal data, and full E2E test coverage of application flows are required. See docs/20'},
    manufacturing:{ja:'💡 manufacturingドメイン: IoT連携・リアルタイム設備監視・監査ログが重要です。データ収集の信頼性設計を検討してください。docs/03参照',en:'💡 Manufacturing domain: IoT integration, real-time equipment monitoring, and audit logs are key. Design for data collection reliability. See docs/03'},
    iot:{ja:'💡 iotドメイン: エッジ・クラウド間の通信プロトコル (MQTT/AMQP)・デバイス認証・障害時のデータバッファリングが必要です。docs/120参照',en:'💡 IoT domain: Edge-cloud protocols (MQTT/AMQP), device authentication, and data buffering on failures are required. See docs/120'},
    ai:{ja:'💡 aiドメイン: プロンプトインジェクション対策・出力フィルタリング・コスト管理（トークン上限）が重要です。docs/115参照',en:'💡 AI domain: Prompt injection protection, output filtering, and cost control (token limits) are important. See docs/115'},
    travel:{ja:'💡 travelドメイン: 予約の冪等性設計・在庫競合・決済フロー統合が重要です。二重予約防止ロジックを実装してください。docs/122参照',en:'💡 Travel domain: Booking idempotency, inventory concurrency, and payment flow integration are key. Implement double-booking prevention. See docs/122'},
    insurance:{ja:'💡 insuranceドメイン: 保険規制コンプライアンス・保険料計算ロジックの監査・長期データ保持ポリシーが必要です。docs/121参照',en:'💡 Insurance domain: Regulatory compliance, audit of premium calculation logic, and long-term data retention policy are required. See docs/121'},
    booking:{ja:'💡 bookingドメイン: 予約の冪等性（二重予約防止）・TimeSlot競合排他制御・キャンセルポリシーのビジネスルールが重要です。docs/122参照',en:'💡 Booking domain: Idempotency (prevent double-booking), TimeSlot exclusive control, and cancellation policy rules are key. See docs/122'},
    saas:{ja:'💡 saasドメイン: マルチテナントデータ分離・課金サイクル管理・解約率最適化が重要です。全クエリにテナントIDを必須条件として追加してください。docs/73,74参照',en:'💡 SaaS domain: Multi-tenant isolation, billing cycle management, and churn optimization are critical. Enforce tenant ID in every query. See docs/73,74'},
    marketplace:{ja:'💡 marketplaceドメイン: 売買双方向の信頼性設計・決済エスクロー・詐欺検出が重要です。Review改ざん防止ロジックを設計してください。docs/05参照',en:'💡 Marketplace domain: Two-sided trust design, payment escrow, and fraud detection are key. Design tamper-proof review systems. See docs/05'},
    gamify:{ja:'💡 gamifyドメイン: ゲームループ設計・リアルタイムリーダーボード・Achievement管理が重要です。ランキング競合更新にRedisを活用してください。docs/87参照',en:'💡 Gamification domain: Game loop design, real-time leaderboards, and achievement management are key. Use Redis for concurrent ranking updates. See docs/87'},
    event:{ja:'💡 eventドメイン: チケット在庫競合排他・二重購入防止・タイムシリーズデータ管理が重要です。冪等性キーで決済重複を防いでください。docs/122参照',en:'💡 Event domain: Ticket inventory exclusion, double-purchase prevention, and time-series data are key. Use idempotency keys to prevent duplicate payments. See docs/122'},
    newsletter:{ja:'💡 newsletterドメイン: メール配信率確保(SPF/DKIM/DMARC)・配信停止ルール・バウンス処理が重要です。CAN-SPAM/GDPRのオプトアウト対応を確認してください。docs/20参照',en:'💡 Newsletter domain: Deliverability (SPF/DKIM/DMARC), unsubscribe rules, and bounce handling are key. Verify CAN-SPAM/GDPR opt-out compliance. See docs/20'},
    creator:{ja:'💡 creatorドメイン: コンテンツ収益化モデル・著作権管理・CDN配信最適化が重要です。クリエイター報酬計算の透明性と監査ログを確保してください。docs/05参照',en:'💡 Creator domain: Content monetization, copyright management, and CDN optimization are key. Ensure transparent creator payout calculation with audit logs. See docs/05'},
    community:{ja:'💡 communityドメイン: コンテンツモデレーション・スパム防止・ユーザー通報フローが重要です。有害コンテンツ検出のAIフィルタリングを検討してください。docs/46参照',en:'💡 Community domain: Content moderation, spam prevention, and user reporting flows are key. Consider AI filtering for harmful content detection. See docs/46'},
    logistics:{ja:'💡 logisticsドメイン: 配送ルート最適化・リアルタイム追跡・倉庫在庫管理が重要です。IoTセンサーとのMQTT連携を設計してください。docs/120参照',en:'💡 Logistics domain: Route optimization, real-time tracking, and warehouse inventory are key. Design MQTT integration for IoT sensors. See docs/120'},
    agriculture:{ja:'💡 agricultureドメイン: IoTセンサーデータ収集・季節性データ管理・オフライン対応が重要です。農場環境でのネットワーク断絶時のデータバッファリングを設計してください。docs/120参照',en:'💡 Agriculture domain: IoT sensor collection, seasonal data, and offline operation are key. Design data buffering for network outages in field environments. See docs/120'},
    energy:{ja:'💡 energyドメイン: リアルタイム消費量監視・ピーク負荷予測・規制報告コンプライアンスが重要です。スマートメーターとのAMQP/MQTT連携を設計してください。docs/121参照',en:'💡 Energy domain: Real-time consumption monitoring, peak load prediction, and regulatory reporting are key. Design AMQP/MQTT integration for smart meters. See docs/121'},
    media:{ja:'💡 mediaドメイン: CDNストリーミング最適化・DRMコンテンツ保護・アダプティブビットレートが重要です。著作権管理と配信地域制限を設計してください。docs/115参照',en:'💡 Media domain: CDN streaming optimization, DRM content protection, and adaptive bitrate are key. Design copyright management and geo-restrictions. See docs/115'},
    automation:{ja:'💡 automationドメイン: ワークフロー冪等性設計・障害時の再実行制御・監査証跡が重要です。タスクキューのAt-least-once保証を設計してください。docs/87参照',en:'💡 Automation domain: Workflow idempotency, failure retry control, and audit trails are key. Design at-least-once guarantees for task queues. See docs/87'},
    collab:{ja:'💡 collabドメイン: リアルタイム共同編集(CRDT/OT)・競合解決・オフライン同期が重要です。Yjs/Automergeの選定を検討してください。docs/83参照',en:'💡 Collaboration domain: Real-time co-editing (CRDT/OT), conflict resolution, and offline sync are key. Evaluate Yjs/Automerge for CRDT. See docs/83'},
    devtool:{ja:'💡 devtoolドメイン: 開発者体験設計・APIバージョニング・破壊的変更管理が重要です。セマンティックバージョニングとchangelogの自動化を検討してください。docs/83参照',en:'💡 Dev Tool domain: Developer experience design, API versioning, and breaking change management are key. Automate semantic versioning and changelog. See docs/83'},
    analytics:{ja:'💡 analyticsドメイン: データパイプライン設計・イベントスキーマ標準化・GDPRデータ同意管理が重要です。イベントソーシングとデータリネージを設計してください。docs/87参照',en:'💡 Analytics domain: Data pipeline design, event schema standardization, and GDPR consent management are key. Design event sourcing and data lineage. See docs/87'},
    content:{ja:'💡 contentドメイン: CMS設計・多言語コンテンツ管理・SEO最適化が重要です。ヘッドレスCMSのAPIファーストアーキテクチャを検討してください。docs/05参照',en:'💡 Content domain: CMS design, multilingual content management, and SEO optimization are key. Consider a headless CMS with API-first architecture. See docs/05'},
    hr:{ja:'💡 hrドメイン: 従業員個人情報保護・GDPR対応・役割ベースアクセス制御が重要です。給与データの暗号化と監査ログを必ず実装してください。docs/08参照',en:'💡 HR domain: Employee data protection, GDPR compliance, and role-based access control are critical. Always implement salary data encryption and audit logs. See docs/08'},
    realestate:{ja:'💡 realestateドメイン: 物件検索最適化・フィルタリング・宅建業法等の法的コンプライアンスが重要です。地図API連携と画像CDN最適化を検討してください。docs/05参照',en:'💡 Real Estate domain: Property search optimization, faceted filtering, and legal compliance are key. Consider map API integration and image CDN optimization. See docs/05'},
    portfolio:{ja:'💡 portfolioドメイン: CDN最適化・画像圧縮・SEOメタデータが重要です。Lighthouse スコア90+を目標に静的サイト生成(SSG)を検討してください。docs/00参照',en:'💡 Portfolio domain: CDN optimization, image compression, and SEO metadata are key. Aim for Lighthouse score 90+ with static site generation (SSG). See docs/00'},
    tool:{ja:'💡 toolドメイン: シングルパーパス設計・高速起動・UX簡潔性が重要です。インストール摩擦を最小化し、ゼロ設定で即使えるUXを目指してください。docs/00参照',en:'💡 Tool domain: Single-purpose design, fast startup, and UX simplicity are key. Minimize installation friction and aim for zero-config immediate usability. See docs/00'}
  };
  const hint=_hints[dom];
  if(!hint)return;
  const body=$('cbody');if(!body)return;
  const d=document.createElement('div');d.className='msg';
  d.innerHTML='<div class="compat-info"><span class="compat-icon">ℹ️</span><span class="compat-msg">'+esc(_ja?hint.ja:hint.en)+'</span></div>';
  body.appendChild(d);
  body.scrollTop=body.scrollHeight;
}
function ackCompat(btn,ruleId){
  if(!S.compatAcked.includes(ruleId))S.compatAcked.push(ruleId);
  save();
  const _ja=S.lang==='ja';
  const wrap=btn.parentNode;
  wrap.classList.add('compat-acked');
  btn.textContent=_ja?'✓ 承知済み':'✓ Acknowledged';
  btn.disabled=true;
  if(typeof renderCompatBadge==='function')renderCompatBadge();
}
function showCompatAlert(answers){
  // Lv0-1: show errors only — warn/info are too technical for beginners and safe stack is auto-selected
  const issues=checkCompat(answers).filter(i=>S.skillLv<=1?i.level==='error':(i.level==='error'||i.level==='warn'||i.level==='info')).filter(i=>!S.compatAcked.includes(i.id));
  if(!issues.length)return;
  const _ja=S.lang==='ja';const body=$('cbody');
  issues.forEach(iss=>{
    const d=document.createElement('div');d.className='msg';
    const icon=iss.level==='error'?'❌':iss.level==='warn'?'⚠️':'ℹ️';
    const cls=iss.level==='error'?'compat-error':iss.level==='warn'?'compat-warn':'compat-info';
    let h=`<div class="${cls}"><span class="compat-icon">${icon}</span><span class="compat-msg">${esc(iss.msg)}</span>`;
    if(iss.chain){h+=`<button class="btn btn-xs btn-s compat-fix" onclick="_applyCascadingFix(this,'${escAttr(JSON.stringify(iss.chain))}')">${_ja?'一括修正':'Batch Fix'}</button>`;}
    else if(iss.fix&&typeof iss.fix==='object'&&iss.fix.f){h+=`<button class="btn btn-xs btn-s compat-fix" onclick="_applyCompatFix(this,'${escAttr(iss.fix.f)}','${escAttr(iss.fix.s)}')">${_ja?'修正':'Fix'}</button>`;}
    if(iss.pair&&iss.pair.length){iss.pair.forEach(function(fid){const loc=findQStep(fid);if(loc){const lbl=_ja?(loc.q.label||fid):(loc.q.labelEn||loc.q.label||fid);h+='<button class="btn btn-xs btn-g compat-jump" onclick="goToQ('+loc.phase+','+loc.step+')">📍 '+esc(lbl)+'</button>';}});}
    if(iss.level!=='error'){h+='<button class="btn btn-xs btn-g compat-ack" onclick="ackCompat(this,\''+escAttr(iss.id)+'\')">'+(  _ja?'✓ 承知':'✓ OK')+'</button>';}
    if(iss.why)h+=`<details class="compat-why"><summary class="compat-why-toggle">${_ja?'▶ なぜ？':'▶ Why?'}</summary><div class="compat-why-body">${esc(iss.why)}</div></details>`;
    h+='</div>';d.innerHTML=h;body.appendChild(d);
  });
  body.scrollTop=body.scrollHeight;
}

function showCompatSummary(issues){
  const _ja=S.lang==='ja';
  const filtered=issues.filter(function(i){return !S.compatAcked.includes(i.id);});
  if(!filtered.length)return;
  const body=$('cbody');if(!body)return;
  const d=document.createElement('div');d.className='msg';
  const hasWarn=filtered.some(function(i){return i.level==='warn';});
  let h='<div class="compat-summary-card">';
  h+='<div class="compat-summary-title">'+(hasWarn?'⚠️':'ℹ️')+' ';
  h+=(_ja?'スタック警告サマリー（'+filtered.length+'件）':'Stack Warning Summary ('+filtered.length+')');
  h+='</div>';
  filtered.forEach(function(iss){
    const icon=iss.level==='warn'?'⚠️':'ℹ️';
    const cls=iss.level==='warn'?'compat-warn':'compat-info';
    h+='<div class="'+cls+' compat-sum-item"><span class="compat-icon">'+icon+'</span><span class="compat-msg">'+esc(iss.msg)+'</span>';
    if(iss.chain){h+='<button class="btn btn-xs btn-s compat-fix" onclick="_applyCascadingFix(this,\''+escAttr(JSON.stringify(iss.chain))+'\')">'+(  _ja?'一括修正':'Batch Fix')+'</button>';}
    else if(iss.fix&&typeof iss.fix==='object'&&iss.fix.f){h+='<button class="btn btn-xs btn-s compat-fix" onclick="_applyCompatFix(this,\''+escAttr(iss.fix.f)+'\',\''+escAttr(iss.fix.s)+'\')">'+(  _ja?'修正':'Fix')+'</button>';}
    if(iss.pair&&iss.pair.length){iss.pair.forEach(function(fid){const loc=findQStep(fid);if(loc){const lbl=_ja?(loc.q.label||fid):(loc.q.labelEn||loc.q.label||fid);h+='<button class="btn btn-xs btn-g compat-jump" onclick="goToQ('+loc.phase+','+loc.step+')">📍 '+esc(lbl)+'</button>';}});}
    h+='<button class="btn btn-xs btn-g compat-ack" onclick="ackCompat(this,\''+escAttr(iss.id)+'\')">'+(  _ja?'✓ 承知':'✓ OK')+'</button>';
    if(iss.why)h+='<details class="compat-why"><summary class="compat-why-toggle">'+(_ja?'▶ なぜ？':'▶ Why?')+'</summary><div class="compat-why-body">'+esc(iss.why)+'</div></details>';
    h+='</div>';
  });
  h+='<div class="compat-summary-actions">';
  h+='<button class="btn btn-g btn-sm compat-sum-dismiss" onclick="this.closest(\'.compat-summary-card\').classList.add(\'dismissed\')">'+(  _ja?'このまま続ける':'Continue anyway')+'</button>';
  h+='</div></div>';
  d.innerHTML=h;body.appendChild(d);
  body.scrollTop=body.scrollHeight;
}

function _foldPhase(phaseNum){
  const _ja=S.lang==='ja';
  const body=$('cbody');if(!body)return;
  const msgs=body.querySelectorAll('.msg[data-phase="'+phaseNum+'"]');
  if(msgs.length<3)return;
  const det=document.createElement('details');det.className='phase-fold';
  const sum=document.createElement('summary');
  sum.className='phase-fold-sum';
  sum.textContent=(_ja?'Phase '+phaseNum+' の会話（'+msgs.length+'件）':'Phase '+phaseNum+' conversation ('+msgs.length+')');
  det.appendChild(sum);
  const first=msgs[0];
  body.insertBefore(det,first);
  msgs.forEach(function(m){det.appendChild(m);});
}

function phaseEnd(){
  if(S.phase<3){
    // Beginner auto-mode: skip Phase 2 tech questions and auto-fill with best-practice defaults
    if(S.phase===1&&S.skillLv<=1){
      if(typeof autoFillPhase2Defaults==='function')autoFillPhase2Defaults();
      const _ja=S.lang==='ja';
      const _stackName=S.skillLv===0?(_ja?'Next.js + Firebase + Vercel':'Next.js + Firebase + Vercel'):(_ja?'Next.js + Supabase + Vercel':'Next.js + Supabase + Vercel');
      const autoMsg=_ja
        ?'✅ 技術構成は初心者向けベストプラクティスで自動選択しました（'+_stackName+'）\n💡 Phase 2をスキップして機能設計へ進みます。後から設定画面で変更できます。'
        :'✅ Tech stack auto-selected using beginner best practices ('+_stackName+')\n💡 Skipping Phase 2 to go straight to feature design. You can change settings later.';
      addMsg('bot',autoMsg);
      if(typeof announce==='function')announce(autoMsg);
      S.phase=3;S.step=0;save();
      setTimeout(()=>showQ(),600);
      return;
    }
    if(S.skillLv>=2){
      const _phErrors=checkCompat(S.answers).filter(i=>i.level==='error');
      if(_phErrors.length>0){
        const _ja=S.lang==='ja';
        const _errMsg=_ja?'⛔ 致命的エラーが'+_phErrors.length+'件あります。赤いエラーを全て修正してから次のフェーズへ進んでください。':'⛔ '+_phErrors.length+' critical error(s) detected. Fix all red errors before advancing to the next phase.';
        addMsg('bot',_errMsg);
        if(typeof announce==='function')announce(_errMsg);
        return;
      }
    }
    if(S.skillLv>=2){
      const _warnIssues=checkCompat(S.answers).filter(function(i){return i.level==='warn'||i.level==='info';});
      if(_warnIssues.length>0)showCompatSummary(_warnIssues);
    }
    const msg=t('phEnd'+S.phase);
    addMsg('bot',msg);
    if(typeof announce==='function')announce(msg);
    if(S.skillLv<=1){const _ja=S.lang==='ja';var _phMsg=S.phase===1?(_ja?'✅ Phase 1完了！あと2ステップ':'✅ Phase 1 done! 2 more steps'):S.phase===2?(_ja?'✅ Phase 2完了！あと1ステップ':'✅ Phase 2 done! 1 more step'):(_ja?'✅ 最終Phase完了！':'✅ Final phase done!');toast(_phMsg);}
    _foldPhase(S.phase);S.phase++;S.step=0;save();
    setTimeout(()=>showQ(),400);
  } else {
    handleSkipped();
  }
}

function skipQ(qid){
  if(!S.skipped.includes(qid))S.skipped.push(qid);
  addMsg('bot',t('skipMsg'));
  S.step++;save();
  setTimeout(()=>{
    const ph=getQ()[S.phase];
    if(!ph||S.step>=ph.questions.length)phaseEnd();
    else showQ();
  },250);
}

function handleSkipped(){
  S.skipped=S.skipped.filter(id=>!S.answers[id]);
  if(S.skipped.length===0){finish();return;}
  addMsg('bot',t('skippedTitle')+S.skipped.length+t('skippedSuffix'));
  askNextSkipped();
}

function askNextSkipped(){
  S.skipped=S.skipped.filter(id=>!S.answers[id]);
  if(S.skipped.length===0){addMsg('bot',t('skippedDone'));finish();return;}
  const qid=S.skipped[0];
  let targetQ=null;
  for(const ph of Object.values(getQ())){for(const q of ph.questions){if(q.id===qid){targetQ=q;break;}}}
  if(!targetQ){S.skipped.shift();askNextSkipped();return;}
  const zone=$('izone');zone.innerHTML='';
  const banner=document.createElement('div');banner.className='skipped-banner';
  banner.innerHTML='<span>'+t('skippedBanner')+S.skipped.length+t('skippedBannerSuffix')+'</span>';
  zone.appendChild(banner);
  addMsg('bot',targetQ.q,targetQ.tip,null,targetQ.help);
  renderInputFor(targetQ,(val)=>{
    S.answers[qid]=sanitize(val.trim?val.trim():String(val));
    addMsg('user',String(val),null,qid);
    S.skipped.shift();
    showCompatAlert(S.answers);save();
    setTimeout(()=>askNextSkipped(),250);
  },false);
}

function finish(){
  showGenerate();
  showComplexity();
}

function showGenerate(){
  const zone=$('izone');zone.innerHTML='';
  const _ja=S.lang==='ja';
  if(!S.exportedOnce){
    const wb=document.createElement('div');wb.className='export-warn-banner';wb.setAttribute('role','alert');
    const wt=document.createElement('span');wt.textContent='💾 '+(_ja?'生成後のデータはブラウザを閉じると失われます。必ずJSONまたはZIPで保存してください。':'Generated data is lost if browser storage is cleared. Always save as JSON or ZIP.');
    const wd=document.createElement('button');wd.className='btn btn-xs';wd.textContent=_ja?'✓ 分かった':'✓ Got it';
    wd.onclick=()=>{S.exportedOnce=true;save();wb.remove();};
    wb.appendChild(wt);wb.appendChild(wd);zone.appendChild(wb);
  }
  // Answer review panel
  const rv=document.createElement('div');rv.innerHTML=buildAnswerReview();zone.appendChild(rv);
  const btn=document.createElement('button');btn.className='btn btn-p';btn.style.cssText='padding:14px 40px;font-size:14px;margin:20px;';
  btn.textContent=t('genBtn');
  btn.onclick=()=>{generateAll();};
  zone.appendChild(btn);
}

function buildAnswerReview(){
  const _ja=S.lang==='ja';
  const qs=getQ();const a=S.answers;
  let h='<div class="review-panel"><h3>'+(_ja?'📋 回答サマリー — 確認してから生成してください':'📋 Answer Summary — Review before generating')+'</h3>';
  [1,2,3].forEach(p=>{
    const ph=qs[p];if(!ph)return;
    const rows=ph.questions.filter(q=>isQActive(q)&&a[q.id]).map(q=>{
      const qLabel=typeof q.q==='string'?q.q.replace(/^[🔤🎯🚀✅💡🏢🔐💰📱🤖🔧⚙️🌐📦]+\s*/,'').slice(0,45):'';
      return '<div class="review-row"><span class="review-q">'+esc(qLabel)+'</span><span class="review-a">'+esc(String(a[q.id]).slice(0,60))+'</span></div>';
    }).join('');
    if(!rows)return;
    h+='<div class="review-section">';
    h+='<div class="review-section-head"><span>'+esc(ph.name)+'</span>';
    h+='<button class="btn btn-xs" onclick="reviewEditPhase('+p+')">'+(_ja?'✏️ 編集':'✏️ Edit')+'</button></div>';
    h+=rows+'</div>';
  });
  h+='</div>';
  return h;
}

function reviewEditPhase(phase){
  S.phase=phase;S.step=0;save();showQ();
}

function findNext(){
  const qs=getQ();
  for(let p=1;p<=3;p++){const ph=qs[p];if(!ph)continue;
    for(let s=0;s<ph.questions.length;s++){
      const q=ph.questions[s];
      if(!isQActive(q))continue;
      if(!S.answers[q.id]){S.phase=p;S.step=s;save();showQ();return;}
    }
  }
  finish();
}

