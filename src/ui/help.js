/* ═══ V9 HELP POPUP ═══ */
function showHelp(id,e){
  const raw=HELP_DATA[id];if(!raw)return;const data=raw[S.lang]||raw.ja;
  const popup=$('helpPopup');
  popup.style.display='block';
  popup.style.top=Math.min(e.clientY+10,window.innerHeight-250)+'px';
  popup.style.left=Math.min(e.clientX-100,window.innerWidth-380)+'px';
  popup.innerHTML='<button class="hp-close" onclick="closeHelpPopup()">✕</button><h4>'+esc(data.title)+'</h4><p>'+esc(data.desc)+'</p>'+(data.example?'<div class="hp-ex">'+esc(data.example)+'</div>':'');
  setTimeout(()=>{document.addEventListener('click',closeHelpOnClick,{once:true});},100);
}
function closeHelpPopup(){$('helpPopup').style.display='none';}
function closeHelpOnClick(e){if(!$('helpPopup').contains(e.target))closeHelpPopup();}

