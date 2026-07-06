/* ═══ V9 HELP POPUP ═══ */
function showHelp(id,e){
  const _ja=S.lang==='ja';
  const raw=HELP_DATA[id];if(!raw)return;const data=raw[S.lang]||raw.ja;
  const popup=$('helpPopup');
  popup.style.display='block';
  // v9.24 P4: provisional position → re-clamp with measured height (content varies; 250px固定だと下端が切れる)
  popup.style.top=Math.min(e.clientY+10,window.innerHeight-250)+'px';
  popup.style.left=Math.max(0,Math.min(e.clientX-100,window.innerWidth-380))+'px';
  requestAnimationFrame(()=>{
    const h=popup.offsetHeight||250;
    const maxTop=Math.max(8,window.innerHeight-h-8);
    const want=e.clientY+10;
    popup.style.top=Math.min(want,maxTop)+'px';
    popup.style.maxHeight=(window.innerHeight-16)+'px';
    popup.style.overflowY='auto';
  });
  const safeLink=data.link&&(data.link.startsWith('https://')||data.link.startsWith('http://'))?data.link:'';
  var _dynHints=[];
  if(typeof raw.expertHintsFn==='function'){
    try{_dynHints=raw.expertHintsFn(S.answers,_ja)||[];}catch(e){_dynHints=[];}
  }
  var _staticHints=data.expertHints||[];
  window._ehData=_dynHints.concat(_staticHints);
  window._ehIdx=0;
  const ehHtml=_renderExpertHint(_ja);
  popup.innerHTML='<button class="hp-close" onclick="closeHelpPopup()" aria-label="'+t('helpClose')+'">✕</button><h4>'+esc(data.title)+'</h4><p>'+esc(data.desc)+'</p>'+(data.example?'<div class="hp-ex">'+esc(data.example)+'</div>':'')+(safeLink?'<a class="hp-link" href="'+escAttr(safeLink)+'" target="_blank" rel="noopener">📎 '+(_ja?'参考リンク':'Reference')+'</a>':'')+ehHtml;
  setTimeout(()=>{document.addEventListener('click',closeHelpOnClick,{once:true});},100);
}
function _renderExpertHint(_ja){
  if(!window._ehData||!window._ehData.length)return '';
  const eh=window._ehData[window._ehIdx];if(!eh)return '';
  var ctxCls=eh._ctx?' help-eh-ctx':'';
  return '<div class="help-expert-hint'+ctxCls+'"><div class="help-eh-head"><span>'+eh.icon+' '+esc(eh.name)+'</span><button class="help-eh-next" onclick="cycleExpertHint()" title="'+(_ja?'次のヒント':'Next hint')+'" aria-label="'+(_ja?'次のヒント':'Next hint')+'">🔄</button></div><div class="help-eh-text">'+esc(eh.hint)+'</div></div>';
}
function cycleExpertHint(){
  if(!window._ehData||!window._ehData.length)return;
  window._ehIdx=(window._ehIdx+1)%window._ehData.length;
  const eh=window._ehData[window._ehIdx];if(!eh)return;
  const popup=$('helpPopup');if(!popup)return;
  const hint=popup.querySelector('.help-expert-hint');if(!hint)return;
  hint.querySelector('.help-eh-head span').textContent=eh.icon+' '+eh.name;
  hint.querySelector('.help-eh-text').textContent=eh.hint;
  if(eh._ctx){hint.classList.add('help-eh-ctx');}else{hint.classList.remove('help-eh-ctx');}
}
function closeHelpPopup(){$('helpPopup').style.display='none';}
function closeHelpOnClick(e){if(!$('helpPopup').contains(e.target))closeHelpPopup();}

