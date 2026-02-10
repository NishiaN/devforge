/* ═══ V9 EDIT ANSWER ═══ */
function editAnswer(qid,msgEl){
  const _ja=S.lang==='ja';
  let targetQ=null;
  for(const ph of Object.values(getQ())){for(const q of ph.questions){if(q.id===qid){targetQ=q;break;}}}
  if(!targetQ)return;
  const savedPhase=S.phase,savedStep=S.step;
  let isEditing=true;
  msgEl.style.outline='2px solid var(--warn)';msgEl.style.borderRadius='var(--radius)';
  toast(_ja?'回答を編集中…':'Editing answer…');
  const zone=$('izone');zone.innerHTML='';
  const banner=document.createElement('div');banner.className='edit-banner';
  banner.innerHTML='<span>'+(_ja?'✏️ 「'+esc(targetQ.q)+'」を編集中':'✏️ Editing: '+esc(targetQ.q))+'</span>';
  const cancelBtn=document.createElement('button');cancelBtn.className='btn btn-g btn-xs';cancelBtn.textContent=_ja?'キャンセル':'Cancel';
  cancelBtn.onclick=()=>{
    if(!isEditing)return;isEditing=false;
    msgEl.style.outline='';msgEl.style.borderRadius='';zone.innerHTML='';
    S.phase=savedPhase;S.step=savedStep;
    if(Object.keys(S.files).length>0){showExportGrid();}else{findNext();}
  };
  banner.appendChild(cancelBtn);zone.appendChild(banner);
  renderInputFor(targetQ,(newVal)=>{
    if(!isEditing)return;isEditing=false;
    S.answers[qid]=newVal;
    const bd=msgEl.querySelector('.m-body');bd.textContent='';
    String(newVal).split('\n').forEach((l,i,a)=>{bd.appendChild(document.createTextNode(l));if(i<a.length-1)bd.appendChild(document.createElement('br'));});
    msgEl.style.outline='';msgEl.style.borderRadius='';zone.innerHTML='';
    showCompatAlert(S.answers);
    save();toast(_ja?'回答を更新しました':'Answer updated');
    // If files already generated, regenerate silently (no language chooser)
    if(Object.keys(S.files).length>0&&S.genLang){
      doGenerate(S.genLang);
      // doGenerate's setTimeout will restore export grid + file tree
    } else {
      // Still in Q&A flow — resume wizard
      S.phase=savedPhase;S.step=savedStep;findNext();
    }
  },false);
}

