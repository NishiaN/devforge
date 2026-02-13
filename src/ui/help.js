/* ═══ V9 HELP POPUP ═══ */
function showHelp(id,e){
  const _ja=S.lang==='ja';
  const raw=HELP_DATA[id];if(!raw)return;const data=raw[S.lang]||raw.ja;
  const popup=$('helpPopup');
  popup.style.display='block';
  popup.style.top=Math.min(e.clientY+10,window.innerHeight-250)+'px';
  popup.style.left=Math.max(0,Math.min(e.clientX-100,window.innerWidth-380))+'px';
  const safeLink=data.link&&(data.link.startsWith('https://')||data.link.startsWith('http://'))?data.link:'';
  popup.innerHTML='<button class="hp-close" onclick="closeHelpPopup()" aria-label="'+t('helpClose')+'">✕</button><h4>'+esc(data.title)+'</h4><p>'+esc(data.desc)+'</p>'+(data.example?'<div class="hp-ex">'+esc(data.example)+'</div>':'')+(safeLink?'<a class="hp-link" href="'+esc(safeLink)+'" target="_blank" rel="noopener">📎 '+(_ja?'参考リンク':'Reference')+'</a>':'');
  setTimeout(()=>{document.addEventListener('click',closeHelpOnClick,{once:true});},100);
}
function closeHelpPopup(){$('helpPopup').style.display='none';}
function closeHelpOnClick(e){if(!$('helpPopup').contains(e.target))closeHelpPopup();}

