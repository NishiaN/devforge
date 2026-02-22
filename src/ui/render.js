/* ═══ V9 RENDER FUNCTIONS ═══ */
const _TECHDB_MAP={
  frontend:'front',backend:'back',css_fw:'front',
  database:'back',orm:'back',mobile:'mobile',
  ai_auto:'ai_auto',payment:'payment',ai_tools:'ai',
  deploy:'devops',dev_methods:'method'
};
const _CAT_LABELS={
  ja:{lang:'言語',front:'フロントエンド',mobile:'モバイル',back:'バックエンド',
      baas:'BaaS',payment:'決済/CMS/EC',devops:'DevOps',ai:'AIツール',
      ai_auto:'AI自律',method:'手法',test:'テスト',api:'API',
      build:'ビルド',data:'データ',security:'セキュリティ'},
  en:{lang:'Language',front:'Frontend',mobile:'Mobile',back:'Backend',
      baas:'BaaS',payment:'Payment/CMS/EC',devops:'DevOps',ai:'AI Tools',
      ai_auto:'AI Autonomous',method:'Methods',test:'Testing',api:'API',
      build:'Build',data:'Data',security:'Security'}
};

function renderInputFor(q,onSubmit,allowSkip){
  const _ja=S.lang==='ja';
  const zone=$('izone');
  const existingBanner=zone.querySelector('.edit-banner')||zone.querySelector('.skipped-banner');
  if(!existingBanner)zone.innerHTML='';
  if(q.type==='chip-text')renderChips(zone,q,false,onSubmit,true);
  else if(q.type==='chip-multi')renderChips(zone,q,true,onSubmit,true);
  else if(q.type==='options')renderOpts(zone,q,onSubmit);
  // Add TECH_DB browser button
  if(_TECHDB_MAP[q.id]&&typeof TECH_DB!=='undefined'){
    const _ja=S.lang==='ja';
    const tb=document.createElement('button');
    tb.className='btn btn-xs btn-tech-browse';
    tb.textContent=_ja?'🔍 技術マスターから選択...':'🔍 Browse Tech Master...';
    tb.onclick=()=>showTechBrowser(q.id,val=>{
      // options型: 直接サブミット、chip-multi型: チップ追加
      if(q.type==='options'){onSubmit(val);}
      else{
        // chip-multiの場合、カスタムチップとして追加
        const gr=zone.querySelector('.cgrid');
        if(gr){
          const ch=document.createElement('div');ch.className='chip active';
          ch.textContent='✓ '+val;ch.dataset.val=val;
          ch.onclick=()=>ch.classList.toggle('active');
          gr.appendChild(ch);
        }
      }
    });
    zone.appendChild(tb);
  }
  if(allowSkip!==false){
    const sk=document.createElement('div');sk.style.cssText='padding:4px 20px 10px;text-align:right;';
    const btn=document.createElement('button');btn.className='skip-btn';btn.textContent=S.skillLv<=1?(_ja?'スキップ（後で回答OK）':'Skip (answer later)'):t('skip');
    btn.onclick=()=>skipQ(q.id);
    sk.appendChild(btn);zone.appendChild(sk);
  }
}

function renderChips(zone,q,multi,onSubmit,withVoice){
  const _ja=S.lang==='ja';
  const sel=new Set();
  var _preAns=(S.answers&&S.answers[q.id])?String(S.answers[q.id]):'';
  // Strip [P0]/[P1]/[P2] prefixes from saved sortable answers before populating sel
  if(multi&&_preAns){_preAns.split(',').map(v=>v.trim().replace(/^(\[P\d+\]\s*)+/,'')).filter(Boolean).forEach(v=>sel.add(v));}
  const cz=document.createElement('div');cz.className='czone';
  const lb=document.createElement('div');lb.className='czlabel';lb.textContent=_ja?(multi?'選択してください（複数可・自由入力併用）':'選択するか下に入力'):(multi?'Select multiple or type below':'Select or type below');
  cz.appendChild(lb);
  const gr=document.createElement('div');gr.className='cgrid';
  if(!multi){gr.setAttribute('role','listbox');gr.setAttribute('aria-label',_ja?'選択肢':'Options');}
  (q.chips||[]).forEach(ch=>{
    const c=document.createElement('div');c.className='chip';
    if(multi&&sel.has(ch)){c.classList.add('on');}
    c.setAttribute('tabindex','0');
    c.setAttribute('role',multi?'checkbox':'option');
    if(multi){
      c.setAttribute('aria-checked',sel.has(ch)?'true':'false');
      const ck=document.createElement('span');ck.className='ck';ck.textContent='✓';ck.setAttribute('aria-hidden','true');c.appendChild(ck);
    }else{
      c.setAttribute('aria-selected','false');
    }
    c.appendChild(document.createTextNode(ch));
    c.onclick=()=>{
      if(multi){
        if(sel.has(ch)){sel.delete(ch);c.classList.remove('on');c.setAttribute('aria-checked','false');}
        else{sel.add(ch);c.classList.add('on');c.setAttribute('aria-checked','true');}
        updCount();
      }else{onSubmit(ch);}
    };
    c.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}};
    gr.appendChild(c);
  });
  // sel内でq.chipsにマッチしなかった項目（プリセット由来など）を可視チップとして追加
  if(multi){
    const chipSet=new Set(q.chips||[]);
    sel.forEach(v=>{
      if(!chipSet.has(v)){
        const c=document.createElement('div');c.className='chip on';
        c.setAttribute('tabindex','0');c.setAttribute('role','checkbox');c.setAttribute('aria-checked','true');
        const ck=document.createElement('span');ck.className='ck';ck.textContent='✓';ck.setAttribute('aria-hidden','true');c.appendChild(ck);
        c.appendChild(document.createTextNode(v));
        c.onclick=()=>{if(sel.has(v)){sel.delete(v);c.classList.remove('on');c.setAttribute('aria-checked','false');}else{sel.add(v);c.classList.add('on');c.setAttribute('aria-checked','true');}updCount();};
        c.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}};
        gr.appendChild(c);
      }
    });
  }
  cz.appendChild(gr);zone.appendChild(cz);
  const ft=document.createElement('div');ft.className='cfoot';
  const inp=document.createElement('input');inp.className='cadd';inp.placeholder=q.placeholder||(_ja?'自由入力…':'Type here…');
  inp.setAttribute('aria-label', _ja?'自由入力':'Free text input');
  if(!multi&&_preAns)inp.value=_preAns;
  if(multi){
    inp.addEventListener('keypress',e=>{
      if(e.key==='Enter'&&inp.value.trim()){
        const v=inp.value.trim();
        if(sel.has(v)){inp.value='';return;}
        sel.add(v);
        const c=document.createElement('div');c.className='chip on';
        const ck=document.createElement('span');ck.className='ck';ck.textContent='✓';c.appendChild(ck);
        c.appendChild(document.createTextNode(v));c.onclick=()=>{sel.delete(v);c.remove();updCount();};
        gr.appendChild(c);inp.value='';updCount();
      }
    });
    const countBadge=document.createElement('span');countBadge.className='chip-count-badge';
    function updCount(){countBadge.textContent=sel.size?(_ja?sel.size+'件選択中':sel.size+' selected'):'';}
    updCount();
    const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('confirm');
    btn.onclick=()=>{if(inp.value.trim())sel.add(inp.value.trim());if(!sel.size){toast(t('selectMin'));return;}
      const items=Array.from(sel);
      if(q.sortable&&items.length>1){renderDnD(zone,items,onSubmit,function(){renderChips(zone,q,multi,onSubmit,withVoice);});}
      else{onSubmit(items.join(', '));}
    };
    ft.appendChild(countBadge);ft.appendChild(inp);ft.appendChild(btn);
    if(withVoice&&voiceRec){const vb=document.createElement('button');vb.className='voice-btn';vb.textContent='🎙️';vb.title=_ja?'音声入力':'Voice Input';vb.setAttribute('aria-label',_ja?'音声入力':'Voice Input');vb.onclick=()=>toggleVoice(vb);ft.appendChild(vb);}
  } else {
    inp.addEventListener('keypress',e=>{if(e.key==='Enter'&&inp.value.trim())onSubmit(inp.value.trim());});
    const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('send');
    btn.onclick=()=>{if(inp.value.trim())onSubmit(inp.value.trim());};
    ft.appendChild(inp);ft.appendChild(btn);
    if(withVoice&&voiceRec){const vb=document.createElement('button');vb.className='voice-btn';vb.textContent='🎙️';vb.title=_ja?'音声入力':'Voice Input';vb.setAttribute('aria-label',_ja?'音声入力':'Voice Input');vb.onclick=()=>toggleVoice(vb);ft.appendChild(vb);}
  }
  zone.appendChild(ft);
}

/* Tech question IDs where "⭐ おすすめ" badge is shown */
const _REC_BADGE_QS=new Set(['frontend','css_fw','backend','database','orm','deploy','mobile','auth']);

/* Returns the recommended option index based on prior answers */
function _getRecIdx(qId,options){
  if(!options||!options.length)return 0;
  var a=S.answers;var fe=a.frontend||'';var be=a.backend||'';
  var labels=options.map(function(o){return typeof o==='string'?o:o.label;});
  function findIdx(rx){for(var i=0;i<labels.length;i++){if(rx.test(labels[i]))return i;}return -1;}
  if(qId==='database'){
    if(/Supabase/i.test(be)){var si=findIdx(/Supabase/i);if(si>=0)return si;}
    if(/Firebase/i.test(be)){var fi=findIdx(/Firebase/i);if(fi>=0)return fi;}
  }
  if(qId==='deploy'){
    if(/Firebase/i.test(be)){var fhi=findIdx(/Firebase/i);if(fhi>=0)return fhi;}
  }
  if(qId==='css_fw'){
    if(/React/i.test(fe)){var shi=findIdx(/shadcn/i);if(shi>=0)return shi;}
  }
  if(qId==='mobile'){
    if(/React/i.test(fe)){var exi=findIdx(/Expo/i);if(exi>=0)return exi;}
  }
  if(qId==='orm'){
    if(/NestJS/i.test(be)){var ti=findIdx(/TypeORM/i);if(ti>=0)return ti;}
    if(/Python|FastAPI|Django/i.test(be)){var ai=findIdx(/SQLAlchemy/i);if(ai>=0)return ai;}
  }
  return 0;
}

function renderOpts(zone,q,onSubmit){
  const _ja=S.lang==='ja';
  const cards=document.createElement('div');cards.className='ocards';
  cards.setAttribute('role','listbox');
  cards.setAttribute('aria-label',_ja?'選択肢':'Options');
  const showBadge=_REC_BADGE_QS.has(q.id);
  const _recIdx=showBadge?_getRecIdx(q.id,q.options):0;
  (q.options||[]).forEach((o,idx)=>{
    const c=document.createElement('div');c.className='ocard';
    c.setAttribute('tabindex','0');
    c.setAttribute('role','option');
    c.setAttribute('aria-selected','false');
    const h=document.createElement('h5');
    const label=typeof o==='string'?o:o.label;
    h.textContent=label;
    // ⭐ Recommended badge — dynamically positioned based on prior answers
    if(showBadge&&idx===_recIdx&&S.skillLv<4){
      const badge=document.createElement('span');badge.className='ocard-rec-badge';
      badge.textContent=_ja?'⭐ おすすめ':'⭐ Recommended';
      h.appendChild(badge);
    }
    c.appendChild(h);
    if(o.desc){const p=document.createElement('p');p.textContent=o.desc;c.appendChild(p);}
    c.onclick=()=>onSubmit(label);
    c.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}};
    cards.appendChild(c);
  });
  zone.appendChild(cards);
}

function showTechBrowser(qId, onSelect){
  const _ja=S.lang==='ja';
  const cats=_TECHDB_MAP[qId];
  if(!cats)return;
  // 対象カテゴリのエントリをフィルタ
  const primaryCat=cats;
  const allCats=[...new Set(TECH_DB.filter(t=>t.cat===primaryCat).map(t=>t.cat))];
  // モーダル構築
  const ov=document.createElement('div');ov.className='techdb-overlay';
  ov.setAttribute('role','dialog');
  ov.setAttribute('aria-modal','true');
  ov.setAttribute('aria-label',_ja?'技術マスター':'Tech Master');
  ov.onclick=e=>{if(e.target===ov)ov.remove();};
  ov.addEventListener('keydown',e=>{
    if(e.key==='Escape')ov.remove();
  });
  const modal=document.createElement('div');modal.className='techdb-modal';
  // ヘッダー + 検索
  const hd=document.createElement('div');hd.className='techdb-hd';
  hd.innerHTML='<h3>'+(_ja?'技術マスターから選択':'Browse Tech Master')+'</h3>';
  const search=document.createElement('input');search.className='techdb-search';
  search.placeholder=_ja?'検索...':'Search...';
  search.setAttribute('aria-label', _ja?'技術マスター検索':'Tech Master search');
  hd.appendChild(search);modal.appendChild(hd);
  // カテゴリタブ + アイテムグリッド
  const body=document.createElement('div');body.className='techdb-body';
  const catList=document.createElement('div');catList.className='techdb-cats';
  const itemGrid=document.createElement('div');itemGrid.className='techdb-items';
  // 全カテゴリ表示（primaryCatをデフォルト選択）
  const labels=_CAT_LABELS[_ja?'ja':'en'];
  Object.keys(labels).forEach(cat=>{
    const items=TECH_DB.filter(t=>t.cat===cat);
    if(!items.length)return;
    const btn=document.createElement('div');btn.className='techdb-cat';
    btn.textContent=labels[cat]+' ('+items.length+')';
    btn.dataset.cat=cat;
    if(cat===primaryCat)btn.classList.add('sel');
    btn.onclick=()=>{
      catList.querySelectorAll('.techdb-cat').forEach(c=>c.classList.remove('sel'));
      btn.classList.add('sel');
      renderItems(cat);
    };
    catList.appendChild(btn);
  });
  function renderItems(cat){
    itemGrid.innerHTML='';
    const items=TECH_DB.filter(t=>t.cat===cat);
    const q=search.value.toLowerCase();
    items.filter(t=>!q||t.name.toLowerCase().includes(q)).forEach(t=>{
      const card=document.createElement('div');card.className='techdb-item';
      card.innerHTML='<b>'+esc(t.name)+'</b><span class="techdb-req">'+
        (typeof reqLabel==='function'?reqLabel(t.req):t.req)+'</span>'+
        (t.price?'<span class="techdb-price">'+(typeof priceLabel==='function'?priceLabel(t.price):t.price)+'</span>':'');
      card.onclick=()=>{onSelect(t.name);ov.remove();};
      itemGrid.appendChild(card);
    });
  }
  search.oninput=()=>{
    const sel=catList.querySelector('.techdb-cat.sel');
    renderItems(sel?sel.dataset.cat:primaryCat);
  };
  body.appendChild(catList);body.appendChild(itemGrid);
  modal.appendChild(body);ov.appendChild(modal);
  document.body.appendChild(ov);
  renderItems(primaryCat);
  // Initial focus on search
  setTimeout(()=>search.focus(),50);
}

function renderDnD(zone,items,onSubmit,onBack){
  const _ja=S.lang==='ja';
  zone.innerHTML='';
  const wrap=document.createElement('div');wrap.style.cssText='padding:10px 20px;';
  const lbl=document.createElement('div');lbl.className='czlabel';lbl.textContent=t('sortLabel');
  wrap.appendChild(lbl);

  // Keyboard hint (HCD: A アクセシビリティ ④身体負荷)
  const hint=document.createElement('div');hint.className='dnd-hint';
  hint.textContent=_ja?'ドラッグまたは↑↓キーで並び替え ・ ×ボタンで項目を削除':'Drag or ↑↓ to reorder · Click × to remove items';
  wrap.appendChild(hint);

  const list=document.createElement('ul');list.className='dnd-list';list.setAttribute('role','listbox');
  let dragItem=null;
  items.forEach((item,i)=>{
    const li=document.createElement('li');
    li.className='dnd-item';
    li.draggable=true;
    li.dataset.idx=i;
    li.setAttribute('tabindex','0');
    li.setAttribute('role','option');
    li.setAttribute('aria-label',(_ja?'項目 ':'Item ')+(i+1)+': '+item);
    const grip=document.createElement('span');grip.className='dnd-grip';grip.textContent='⠿';grip.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.className='dnd-label';label.textContent=item;
    const pri=document.createElement('span');pri.className='dnd-priority';
    const del=document.createElement('button');del.className='dnd-del';del.textContent='×';del.setAttribute('aria-label',(_ja?'削除: ':'Delete: ')+item);
    del.onclick=(e)=>{e.stopPropagation();li.remove();const rem=list.querySelectorAll('.dnd-item').length;if(!rem){if(onBack){onBack();}else{zone.innerHTML='';toast(_ja?'すべての項目を削除しました。チップから再選択してください':'All items deleted. Please re-select from chips.');}return;}updPri();};
    li.appendChild(grip);li.appendChild(label);li.appendChild(pri);li.appendChild(del);
    li.addEventListener('dragstart',e=>{dragItem=li;li.style.opacity='0.4';e.dataTransfer.effectAllowed='move';});
    li.addEventListener('dragend',()=>{dragItem=null;li.style.opacity='1';list.querySelectorAll('.dnd-item').forEach(el=>el.classList.remove('drag-over'));updPri();});
    li.addEventListener('dragover',e=>{e.preventDefault();e.dataTransfer.dropEffect='move';li.classList.add('drag-over');});
    li.addEventListener('dragleave',()=>li.classList.remove('drag-over'));
    li.addEventListener('drop',e=>{e.preventDefault();li.classList.remove('drag-over');if(dragItem&&dragItem!==li){const rect=li.getBoundingClientRect();const mid=rect.top+rect.height/2;if(e.clientY<mid)list.insertBefore(dragItem,li);else list.insertBefore(dragItem,li.nextSibling);}});

    // Keyboard navigation (HCD: A アクセシビリティ ④身体負荷)
    li.addEventListener('keydown',e=>{
      if(e.key==='ArrowUp'){
        e.preventDefault();
        const prev=li.previousElementSibling;
        if(prev&&prev.classList.contains('dnd-item')){
          list.insertBefore(li,prev);
          li.focus();
          updPri();
          if(typeof announce==='function')announce(_ja?'上に移動しました':'Moved up');
        }
      }else if(e.key==='ArrowDown'){
        e.preventDefault();
        const next=li.nextElementSibling;
        if(next&&next.classList.contains('dnd-item')){
          list.insertBefore(next,li);
          li.focus();
          updPri();
          if(typeof announce==='function')announce(_ja?'下に移動しました':'Moved down');
        }
      }
    });

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
  if(onBack){
    const backBtn=document.createElement('button');
    backBtn.className='btn btn-g btn-sm';
    backBtn.textContent=_ja?'← 選び直す':'← Re-select';
    backBtn.onclick=()=>onBack();
    ft.appendChild(backBtn);
  }
  const btn=document.createElement('button');btn.className='btn btn-p btn-sm';btn.textContent=t('sortConfirm');
  btn.onclick=()=>{
    const ordered=Array.from(list.querySelectorAll('.dnd-label')).map(el=>el.textContent);
    const priLabels=Array.from(list.querySelectorAll('.dnd-priority')).map(el=>el.textContent.split(' ')[0]);
    onSubmit(ordered.map((item,i)=>'['+priLabels[i]+'] '+item).join(', '));
  };
  ft.appendChild(btn);wrap.appendChild(ft);zone.appendChild(wrap);
}

