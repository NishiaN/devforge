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
  if(typeof renderCompatBadge==='function')renderCompatBadge();
  S.step++;save();
  setTimeout(()=>{
    const ph=getQ()[S.phase];
    if(!ph||S.step>=ph.questions.length)phaseEnd();
    else showQ();
  },300);
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
    else if(iss.fix){h+=`<button class="btn btn-xs btn-s compat-fix" onclick="_applyCompatFix(this,'${escAttr(iss.fix.f)}','${escAttr(iss.fix.s)}')">${_ja?'修正':'Fix'}</button>`;}
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
    else if(iss.fix){h+='<button class="btn btn-xs btn-s compat-fix" onclick="_applyCompatFix(this,\''+escAttr(iss.fix.f)+'\',\''+escAttr(iss.fix.s)+'\')">'+(  _ja?'修正':'Fix')+'</button>';}
    if(iss.pair&&iss.pair.length){iss.pair.forEach(function(fid){const loc=findQStep(fid);if(loc){const lbl=_ja?(loc.q.label||fid):(loc.q.labelEn||loc.q.label||fid);h+='<button class="btn btn-xs btn-g compat-jump" onclick="goToQ('+loc.phase+','+loc.step+')">📍 '+esc(lbl)+'</button>';}});}
    h+='<button class="btn btn-xs btn-g compat-ack" onclick="ackCompat(this,\''+escAttr(iss.id)+'\')">'+(  _ja?'✓ 承知':'✓ OK')+'</button>';
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
  const btn=document.createElement('button');btn.className='btn btn-p';btn.style.cssText='padding:14px 40px;font-size:14px;margin:20px;';
  btn.textContent=t('genBtn');
  btn.onclick=()=>{generateAll();};
  zone.appendChild(btn);
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

