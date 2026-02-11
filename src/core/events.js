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
  if(e.ctrlKey&&k==='t'){e.preventDefault();toggleTheme();}
  if(e.ctrlKey&&k==='l'){e.preventDefault();toggleLang();}
  if(e.ctrlKey&&k==='e'){e.preventDefault();exportZIP();}
  if(e.ctrlKey&&e.shiftKey&&k==='c'){e.preventDefault();copyAllFiles();}
  if(e.ctrlKey&&k==='m'){e.preventDefault();showPM();}
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

