/* ═══ WIZARD CORE ═══ */
function initPills(){
  const _ja=S.lang==='ja';
  const c=$('sbPills');if(!c)return;c.innerHTML='';
  const qs=getQ();
  for(let i=1;i<=3;i++){
    const ph=qs[i];if(!ph)continue;
    const d=document.createElement('div');d.className='pd-phase';d.id='pp'+i;
    d.innerHTML='<span class="pd-dot"></span>'+ph.name;
    d.onclick=()=>{if(S.phase>=i){S.phase=i;S.step=0;save();showQ();updProgress();}};
    c.appendChild(d);
    /* Question list under each phase */
    const ul=document.createElement('ul');ul.className='pd-qlist';ul.id='pq'+i;
    ph.questions.forEach((q,si)=>{
      const li=document.createElement('li');li.className='pd-q';
      li.setAttribute('data-qid',q.id);
      const shortQ=q.q.length>18?q.q.slice(0,18)+'…':q.q;
      li.innerHTML='<span class="pd-qmark"></span>'+shortQ;
      li.onclick=(e)=>{e.stopPropagation();if(S.phase>i||(S.phase===i&&S.step>=si)){S.phase=i;S.step=si;save();showQ();updProgress();}};
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
  
  const pdBar=$('pdBar');if(pdBar)pdBar.style.width=pct+'%';
  const pdPct=$('pdPct');if(pdPct)pdPct.textContent=done+'/'+total+' ('+pct+'%)';
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
  const body=$('cbody'),d=document.createElement('div');d.className='msg';
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
  renderInputFor(q,(val)=>{
    if(S.skill==='pro'){showConfirm(val,()=>{doSubmit(q.id,val);});}
    else{doSubmit(q.id,val);}
  },true);
}

function doSubmit(qid,val){
  S.answers[qid]=sanitize(val.trim?val.trim():String(val));
  addMsg('user',String(val),null,qid);
  showCompatAlert(S.answers);
  S.step++;save();
  setTimeout(()=>{
    const ph=getQ()[S.phase];
    if(!ph||S.step>=ph.questions.length)phaseEnd();
    else showQ();
  },300);
}
function showCompatAlert(answers){
  const issues=checkCompat(answers).filter(i=>i.level==='error'||i.level==='warn'||i.level==='info');
  if(!issues.length)return;
  const _ja=S.lang==='ja';const body=$('cbody');
  issues.forEach(iss=>{
    const d=document.createElement('div');d.className='msg';
    const icon=iss.level==='error'?'❌':iss.level==='warn'?'⚠️':'ℹ️';
    const cls=iss.level==='error'?'compat-error':iss.level==='warn'?'compat-warn':'compat-info';
    let h=`<div class="${cls}"><span class="compat-icon">${icon}</span><span class="compat-msg">${esc(iss.msg)}</span>`;
    if(iss.fix)h+=`<button class="btn btn-xs btn-s compat-fix" onclick="S.answers['${escAttr(iss.fix.f)}']='${escAttr(iss.fix.s)}';save();this.parentNode.innerHTML='✅ ${_ja?'修正済':'Fixed'}: ${escHtml(iss.fix.f)} → ${escHtml(iss.fix.s)}'">${_ja?'修正':'Fix'}</button>`;
    h+='</div>';d.innerHTML=h;body.appendChild(d);
  });
  body.scrollTop=body.scrollHeight;
}

function phaseEnd(){
  if(S.phase<3){
    const msg=t('phEnd'+S.phase);
    addMsg('bot',msg);
    if(typeof announce==='function')announce(msg);
    S.phase++;S.step=0;save();
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
      if(!S.answers[q.id]){S.phase=p;S.step=s;showQ();return;}
    }
  }
  finish();
}

