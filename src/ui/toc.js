/* ═══ V9 TOC NAVIGATION ═══ */
function updTOC(){
  const toc=$('tocPanel');if(!toc||!S.projectName)return;
  toc.style.display='block';
  const qs=getQ();let items=[];
  for(let p=1;p<=3;p++){
    const ph=qs[p];if(!ph)continue;
    for(const q of ph.questions){
      if(q.condition){const[k,fn]=Object.entries(q.condition)[0];if(!fn(S.answers[k]||''))continue;}
      const done=!!S.answers[q.id];
      const active=S.phase===p&&ph.questions.indexOf(q)===S.step;
      items.push('<div class="toc-item'+(done?' done':'')+(active?' active':'')+'" onclick="jumpToQ(\''+q.id+'\')" title="'+esc(q.q)+'"><span class="toc-dot"></span><span>'+esc(q.q)+'</span></div>');
    }
  }
  toc.innerHTML=items.join('');
}
function jumpToQ(qid){
  const el=document.querySelector('[data-qid="'+qid+'"]');
  if(el)el.scrollIntoView({behavior:'smooth',block:'center'});
}

