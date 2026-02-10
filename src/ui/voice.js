/* ═══ V9 VOICE INPUT ═══ */
function initVoice(){
  const _ja=S.lang==='ja';
  if(!('webkitSpeechRecognition' in window)&&!('SpeechRecognition' in window))return;
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  voiceRec=new SR();voiceRec.lang=_ja?'ja-JP':'en-US';voiceRec.interimResults=false;voiceRec.maxAlternatives=1;
  voiceRec.onresult=(e)=>{
    const text=e.results[0][0].transcript;
    const inp=document.querySelector('.cadd');
    if(inp){inp.value+=text;inp.focus();}
    if(voiceBtn){voiceBtn.classList.remove('recording');voiceBtn.textContent='🎙️';}
  };
  voiceRec.onend=()=>{if(voiceBtn){voiceBtn.classList.remove('recording');voiceBtn.textContent='🎙️';}};
}
function toggleVoice(btn){
  const _ja=S.lang==='ja';
  if(!voiceRec)return;
  voiceBtn=btn;
  if(btn.classList.contains('recording')){voiceRec.stop();btn.classList.remove('recording');btn.textContent='🎙️';}
  else{voiceRec.lang=_ja?'ja-JP':'en-US';voiceRec.start();btn.classList.add('recording');btn.textContent='⏹️';}
}

