/* ═══ V9 HELP POPUP ═══ */
function showHelp(id,e){
  const _ja=S.lang==='ja';
  const raw=HELP_DATA[id];if(!raw)return;const data=raw[S.lang]||raw.ja;
  const popup=$('helpPopup');
  popup.style.display='block';
  popup.style.top=Math.min(e.clientY+10,window.innerHeight-250)+'px';
  popup.style.left=Math.max(0,Math.min(e.clientX-100,window.innerWidth-380))+'px';
  const safeLink=data.link&&(data.link.startsWith('https://')||data.link.startsWith('http://'))?data.link:'';
  window._ehData=data.expertHints||[];
  window._ehIdx=window._ehData.length?Math.floor(Math.random()*window._ehData.length):0;
  const ehHtml=_renderExpertHint(_ja);
  popup.innerHTML='<button class="hp-close" onclick="closeHelpPopup()" aria-label="'+t('helpClose')+'">✕</button><h4>'+esc(data.title)+'</h4><p>'+esc(data.desc)+'</p>'+(data.example?'<div class="hp-ex">'+esc(data.example)+'</div>':'')+(safeLink?'<a class="hp-link" href="'+esc(safeLink)+'" target="_blank" rel="noopener">📎 '+(_ja?'参考リンク':'Reference')+'</a>':'')+ehHtml;
  setTimeout(()=>{document.addEventListener('click',closeHelpOnClick,{once:true});},100);
}
function _renderExpertHint(_ja){
  if(!window._ehData||!window._ehData.length)return '';
  const eh=window._ehData[window._ehIdx];if(!eh)return '';
  return '<div class="help-expert-hint"><div class="help-eh-head"><span>'+eh.icon+' '+esc(eh.name)+'</span><button class="help-eh-next" onclick="cycleExpertHint()" title="'+(_ja?'次のヒント':'Next hint')+'">🔄</button></div><div class="help-eh-text">'+esc(eh.hint)+'</div></div>';
}
function cycleExpertHint(){
  if(!window._ehData||!window._ehData.length)return;
  window._ehIdx=(window._ehIdx+1)%window._ehData.length;
  const eh=window._ehData[window._ehIdx];if(!eh)return;
  const popup=$('helpPopup');if(!popup)return;
  const hint=popup.querySelector('.help-expert-hint');if(!hint)return;
  hint.querySelector('.help-eh-head span').textContent=eh.icon+' '+eh.name;
  hint.querySelector('.help-eh-text').textContent=eh.hint;
}
function closeHelpPopup(){$('helpPopup').style.display='none';}
function closeHelpOnClick(e){if(!$('helpPopup').contains(e.target))closeHelpPopup();}

