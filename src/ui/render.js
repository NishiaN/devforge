/* ═══ V9 RENDER FUNCTIONS ═══ */
function renderInputFor(q,onSubmit,allowSkip){
  const zone=$('izone');
  const existingBanner=zone.querySelector('.edit-banner')||zone.querySelector('.skipped-banner');
  if(!existingBanner)zone.innerHTML='';
  if(q.type==='chip-text')renderChips(zone,q,false,onSubmit,true);
  else if(q.type==='chip-multi')renderChips(zone,q,true,onSubmit,true);
  else if(q.type==='options')renderOpts(zone,q,onSubmit);
  if(allowSkip!==false){
    const sk=document.createElement('div');sk.style.cssText='padding:4px 20px 10px;text-align:right;';
    const btn=document.createElement('button');btn.className='skip-btn';btn.textContent=t('skip');
    btn.onclick=()=>skipQ(q.id);
    sk.appendChild(btn);zone.appendChild(sk);
  }
}

function renderChips(zone,q,multi,onSubmit,withVoice){
  const _ja=S.lang==='ja';
  const sel=new Set();
  const cz=document.createElement('div');cz.className='czone';
  const lb=document.createElement('div');lb.className='czlabel';lb.textContent=_ja?(multi?'選択してください（複数可・自由入力併用）':'選択するか下に入力'):(multi?'Select multiple or type below':'Select or type below');
  cz.appendChild(lb);
  const gr=document.createElement('div');gr.className='cgrid';
  (q.chips||[]).forEach(ch=>{
    const c=document.createElement('div');c.className='chip';
    c.setAttribute('tabindex','0');
    c.setAttribute('role',multi?'checkbox':'option');
    if(multi){const ck=document.createElement('span');ck.className='ck';ck.textContent='✓';c.appendChild(ck);}
    c.appendChild(document.createTextNode(ch));
    c.onclick=()=>{
      if(multi){if(sel.has(ch)){sel.delete(ch);c.classList.remove('on')}else{sel.add(ch);c.classList.add('on')}}
      else{onSubmit(ch);}
    };
    c.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}};
    gr.appendChild(c);
  });
  cz.appendChild(gr);zone.appendChild(cz);
  const ft=document.createElement('div');ft.className='cfoot';
  const inp=document.createElement('input');inp.className='cadd';inp.placeholder=q.placeholder||(_ja?'自由入力…':'Type here…');
  if(multi){
    inp.addEventListener('keypress',e=>{
      if(e.key==='Enter'&&inp.value.trim()){
        const v=inp.value.trim();sel.add(v);
        const c=document.createElement('div');c.className='chip on';
        const ck=document.createElement('span');ck.className='ck';ck.textContent='✓';c.appendChild(ck);
        c.appendChild(document.createTextNode(v));c.onclick=()=>{sel.delete(v);c.remove();};
        gr.appendChild(c);inp.value='';
      }
    });
    const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('confirm');
    btn.onclick=()=>{if(inp.value.trim())sel.add(inp.value.trim());if(!sel.size){toast(t('selectMin'));return;}
      const items=Array.from(sel);
      if(q.sortable&&items.length>1){renderDnD(zone,items,onSubmit);}
      else{onSubmit(items.join(', '));}
    };
    ft.appendChild(inp);ft.appendChild(btn);
    if(withVoice&&voiceRec){const vb=document.createElement('button');vb.className='voice-btn';vb.textContent='🎙️';vb.title=_ja?'音声入力':'Voice Input';vb.onclick=()=>toggleVoice(vb);ft.appendChild(vb);}
  } else {
    inp.addEventListener('keypress',e=>{if(e.key==='Enter'&&inp.value.trim())onSubmit(inp.value.trim());});
    const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('send');
    btn.onclick=()=>{if(inp.value.trim())onSubmit(inp.value.trim());};
    ft.appendChild(inp);ft.appendChild(btn);
    if(withVoice&&voiceRec){const vb=document.createElement('button');vb.className='voice-btn';vb.textContent='🎙️';vb.title=_ja?'音声入力':'Voice Input';vb.onclick=()=>toggleVoice(vb);ft.appendChild(vb);}
  }
  zone.appendChild(ft);
}

function renderOpts(zone,q,onSubmit){
  const cards=document.createElement('div');cards.className='ocards';
  (q.options||[]).forEach(o=>{
    const c=document.createElement('div');c.className='ocard';
    c.setAttribute('tabindex','0');
    c.setAttribute('role','option');
    const h=document.createElement('h5');h.textContent=typeof o==='string'?o:o.label;c.appendChild(h);
    if(o.desc){const p=document.createElement('p');p.textContent=o.desc;c.appendChild(p);}
    c.onclick=()=>onSubmit(typeof o==='string'?o:o.label);
    c.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}};
    cards.appendChild(c);
  });
  zone.appendChild(cards);
}

function renderDnD(zone,items,onSubmit){
  const _ja=S.lang==='ja';
  zone.innerHTML='';
  const wrap=document.createElement('div');wrap.style.cssText='padding:10px 20px;';
  const lbl=document.createElement('div');lbl.className='czlabel';lbl.textContent=t('sortLabel');
  wrap.appendChild(lbl);
  const list=document.createElement('ul');list.className='dnd-list';
  let dragItem=null;
  items.forEach((item,i)=>{
    const li=document.createElement('li');li.className='dnd-item';li.draggable=true;li.dataset.idx=i;
    const grip=document.createElement('span');grip.className='dnd-grip';grip.textContent='⠿';
    const label=document.createElement('span');label.className='dnd-label';label.textContent=item;
    const pri=document.createElement('span');pri.className='dnd-priority';
    li.appendChild(grip);li.appendChild(label);li.appendChild(pri);
    li.addEventListener('dragstart',e=>{dragItem=li;li.style.opacity='0.4';e.dataTransfer.effectAllowed='move';});
    li.addEventListener('dragend',()=>{dragItem=null;li.style.opacity='1';list.querySelectorAll('.dnd-item').forEach(el=>el.classList.remove('drag-over'));updPri();});
    li.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';li.classList.add('drag-over');});
    li.addEventListener('dragleave',()=>li.classList.remove('drag-over'));
    li.addEventListener('drop',e=>{e.preventDefault();li.classList.remove('drag-over');if(dragItem&&dragItem!==li){const rect=li.getBoundingClientRect();const mid=rect.top+rect.height/2;if(e.clientY<mid)list.insertBefore(dragItem,li);else list.insertBefore(dragItem,li.nextSibling);}});
    list.appendChild(li);
  });
  wrap.appendChild(list);
  function updPri(){
  const _ja=S.lang==='ja';
    const els=list.querySelectorAll('.dnd-item');const n=els.length;
    els.forEach((el,i)=>{
      const p=el.querySelector('.dnd-priority');
      if(i<Math.ceil(n*0.3)){p.textContent=_ja?'P0 必須':'P0 Must';p.className='dnd-priority p0';}
      else if(i<Math.ceil(n*0.7)){p.textContent=_ja?'P1 重要':'P1 Important';p.className='dnd-priority p1';}
      else{p.textContent=_ja?'P2 任意':'P2 Optional';p.className='dnd-priority p2';}
    });
  }
  updPri();
  const ft=document.createElement('div');ft.style.cssText='padding:6px 20px 12px;display:flex;gap:6px;justify-content:flex-end;';
  const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('sortConfirm');
  btn.onclick=()=>{
    const ordered=Array.from(list.querySelectorAll('.dnd-label')).map(el=>el.textContent);
    const priLabels=Array.from(list.querySelectorAll('.dnd-priority')).map(el=>el.textContent.split(' ')[0]);
    onSubmit(ordered.map((item,i)=>'['+priLabels[i]+'] '+item).join(', '));
  };
  ft.appendChild(btn);wrap.appendChild(ft);zone.appendChild(wrap);
}

