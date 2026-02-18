/* ═══ KEYBOARD & ACCESSIBILITY ═══ */

/* Focus trap for modals */
function trapFocus(modalEl){
  const focusable=modalEl.querySelectorAll('button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])');
  if(!focusable.length)return;
  const first=focusable[0];const last=focusable[focusable.length-1];
  function handler(e){
    if(e.key!=='Tab')return;
    if(e.shiftKey){if(document.activeElement===first){e.preventDefault();last.focus();}}
    else{if(document.activeElement===last){e.preventDefault();first.focus();}}
  }
  modalEl._trapHandler=handler;
  modalEl.addEventListener('keydown',handler);
  first.focus();
}
function releaseFocus(modalEl){
  if(modalEl._trapHandler){modalEl.removeEventListener('keydown',modalEl._trapHandler);delete modalEl._trapHandler;}
}

/* Announce to screen readers */
function announce(msg){
  let el=$('srAnnounce');
  if(!el){el=document.createElement('div');el.id='srAnnounce';el.setAttribute('role','status');el.setAttribute('aria-live','assertive');el.className='sr-only';document.body.appendChild(el);}
  el.textContent='';setTimeout(()=>{el.textContent=msg;},50);
}

/* Modal stack for Escape handling */
const _modalStack=[];
function pushModal(el,closeFn){_modalStack.push({el,closeFn});}
function popModal(){
  const top=_modalStack.pop();
  if(top&&top.closeFn)top.closeFn();
  return !!top;
}
function removeModal(el){
  const idx=_modalStack.findIndex(m=>m.el===el);
  if(idx>=0)_modalStack.splice(idx,1);
}

document.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(k==='f1'||(e.ctrlKey&&k==='h')){e.preventDefault();showManual();}
  if(e.ctrlKey&&k==='k'){e.preventDefault();showKB();}
  if(e.ctrlKey&&k==='p'){e.preventDefault();if(typeof showCommandPalette==='function')showCommandPalette();}
  if(e.ctrlKey&&k==='t'){e.preventDefault();toggleTheme();}
  if(e.ctrlKey&&k==='l'){e.preventDefault();toggleLang();}
  if(e.ctrlKey&&k==='e'){e.preventDefault();exportZIP();}
  if(e.ctrlKey&&e.shiftKey&&k==='c'){e.preventDefault();copyAllFiles();}
  if(e.altKey&&k==='arrowleft'){e.preventDefault();viewBack();}
  if(e.altKey&&k==='arrowright'){e.preventDefault();viewForward();}
  if(e.ctrlKey&&k==='m'){e.preventDefault();showPM();}
  if(e.ctrlKey&&k==='4'){e.preventDefault();if(typeof showExplorer==='function')showExplorer();}
  if(e.ctrlKey&&k==='5'){e.preventDefault();S.pillar=5;if(typeof showFileTree==='function')showFileTree();}
  if(e.ctrlKey&&k==='6'){e.preventDefault();S.pillar=6;if(typeof showRoadmapUI==='function')showRoadmapUI();}
  if(e.ctrlKey&&k==='7'){e.preventDefault();if(typeof showAILauncher==='function')showAILauncher();}
  if(e.ctrlKey&&k==='b'){e.preventDefault();if(typeof toggleSidebar==='function')toggleSidebar();}
  if(e.key==='Escape'){
    if(!popModal()){
      // Fallback: close any visible modal
      closeManual();closeHelpPopup();
      const co=$('confirmOverlay');if(co)co.style.display='none';
      const pm=$('pmOverlay');if(pm){pm.style.display='none';releaseFocus(pm);}
      const kb=$('kbOverlay');if(kb){kb.classList.remove('show');releaseFocus(kb);}
    }
  }
});

// Mobile swipe gestures (HCD: ④身体負荷 ②使いやすさ)
if(window.innerWidth<=768){
  let _swipeStartX=0;
  let _swipeStartY=0;
  document.addEventListener('touchstart',e=>{
    _swipeStartX=e.touches[0].clientX;
    _swipeStartY=e.touches[0].clientY;
  },{passive:true});

  document.addEventListener('touchend',e=>{
    const diffX=e.changedTouches[0].clientX-_swipeStartX;
    const diffY=e.changedTouches[0].clientY-_swipeStartY;
    if(Math.abs(diffX)<50||Math.abs(diffY)>50)return; // Minimum swipe distance + vertical scroll tolerance

    if(diffX>0){
      // Swipe right → show chat
      const tabs=document.querySelectorAll('.mobtab');
      if(tabs.length>0&&tabs[0])tabs[0].click();
    }else{
      // Swipe left → show preview
      const tabs=document.querySelectorAll('.mobtab');
      if(tabs.length>1&&tabs[1])tabs[1].click();
    }
  },{passive:true});
}

