/* ═══ TOUR — Spotlight-based interactive walkthrough ═══ */
function _getTourSteps(){
  const _ja=S.lang==='ja';
  var steps=[
  {title:_ja?'🌱 スキルレベル':'🌱 Skill Level',desc:_ja?'Beginner / Intermediate / Pro を選ぶと、質問の選択肢が自動調整されます。':'Choose Beginner / Intermediate / Pro to auto-adjust question options.',target:'skillSel'},
  {title:_ja?'📝 テンプレート':'📝 Templates',desc:_ja?'📦標準157種 ＋ 🎓分野別503種のプリセット。モード切替で選択。⚔️比較で違いを一覧。選ぶと回答が自動入力。':'📦 157 standard + 🎓 503 field presets. Toggle mode to switch. Use ⚔️ Compare for side-by-side. Pick one to auto-fill answers.',target:'presetToggle'},
  {title:_ja?'💬 質問フロー':'💬 Q&A Flow',desc:_ja?'Phase 1-3 の質問に答えるだけ。Beginner: Phase 2自動スキップ＆⭐おすすめ技術をハイライト。スキップ＆後で回答も可能。':'Just answer Phase 1-3 questions. Beginners: Phase 2 auto-skipped & ⭐ recommended tech highlighted. Skip & answer later anytime.',target:'cbody'},
  {title:_ja?'✎ 回答編集':'✎ Edit Answers',desc:_ja?'送信済みの回答に表示される ✎ ボタンで修正できます。':'Click the ✎ button on submitted answers to edit them.',target:'cbody'},
  {title:_ja?'📦 209+ファイル生成':'📦 209+ File Generation',desc:_ja?'全質問回答後、27の柱で209+ファイルが自動生成されます。':'After all questions, 209+ files auto-generate across 27 pillars.',target:'genBtn'},
  {title:_ja?'⚡ 並列探索':'⚡ Parallel Explorer',desc:_ja?'Pillar ⑤ で7スタックを比較。回答に基づくおすすめランキング付き。':'Compare 7 stacks in Pillar ⑤ with recommendation ranking based on your answers.',target:'sbIconbar'},
  {title:'📊 Dashboard',desc:_ja?'Pillar ⑥ でコンテキスト可視化＋'+_TECH_COUNT+'技術DBを閲覧。':'Visualize context + browse '+_TECH_COUNT+' tech DB in Pillar ⑥.',target:'sbIconbar'},
  {title:_ja?'🤖 AIランチャー':'🤖 AI Launcher',desc:_ja?'Pillar ⑧ で仕様書をAIツールにワンクリック投入。57テンプレート＋トークン推定。':'Feed specs to AI tools in one click from Pillar ⑧. 57 templates + token estimation.',target:'sbIconbar'},
  {title:_ja?'🎭 9人の専門家ブレスト':'🎭 9-Expert Brainstorm',desc:_ja?'AIランチャーの「🎭 9人の専門家ブレスト」で、9つの異なる視点からアイデアを爆発させましょう。':'Use "🎭 9-Expert Brainstorm" in AI Launcher to explode ideas from 9 perspectives.',target:'sbIconbar'},
  {title:_ja?'💾 データ保存の注意':'💾 Save Your Work',desc:_ja?'全データはブラウザのlocalStorageに保存されます。作業後は必ず📤 JSONエクスポートと📦 ZIPダウンロードで保存してください。IndexedDB自動バックアップも有効です。':'All data is stored in browser localStorage. Always export JSON 📤 and download ZIP 📦. IndexedDB auto-backup is also active.',target:'exportBtnWrap'},
  {title:_ja?'⚠️ 注意事項を確認':'⚠️ Read Cautions',desc:_ja?'ヘルプ（F1）の「⚠️ 注意事項」タブにスキルレベル設定・言語切替・ストレージ上限などの重要な注意点をまとめています。':'Check the "⚠️ Cautions" tab in Help (F1) for important notes on skill level, language switching, storage limits, and more.',target:'helpBtn'},
  ];
  // Lv0-1: essential steps only (skill, templates, Q&A, generation, save, cautions)
  if(S.skillLv<=1){var _ti=[0,1,2,4,9,10];return _ti.map(function(i){return steps[i];});}
  return steps;
}
let tourStep=-1;
let _tourSpotlight=null;

function _tourUpdateSpotlight(el){
  if(!el||!_tourSpotlight)return;
  el.scrollIntoView({behavior:'smooth',block:'nearest'});
  setTimeout(()=>{
    const r=el.getBoundingClientRect();
    const pad=6;
    _tourSpotlight.style.top=(r.top-pad+window.scrollY)+'px';
    _tourSpotlight.style.left=(r.left-pad+window.scrollX)+'px';
    _tourSpotlight.style.width=(r.width+pad*2)+'px';
    _tourSpotlight.style.height=(r.height+pad*2)+'px';
    _tourSpotlight.style.display='block';
  },100);
}

function _tourClearSpotlight(){
  if(_tourSpotlight){_tourSpotlight.style.display='none';}
}

function startTour(){
  const steps=_getTourSteps();
  if(steps.length===0)return;
  // Create spotlight overlay if not exists
  if(!_tourSpotlight){
    _tourSpotlight=document.createElement('div');
    _tourSpotlight.id='tourSpotlight';
    _tourSpotlight.className='tour-spotlight';
    _tourSpotlight.style.display='none';
    document.body.appendChild(_tourSpotlight);
  }
  tourStep=0;showTourStep();
}

function showTourStep(){
  const tc=$('tourContainer');
  const steps=_getTourSteps();
  if(tourStep<0||tourStep>=steps.length){closeTour();return;}
  const step=steps[tourStep];
  const dots=steps.map((_,i)=>'<div class="tour-dot'+(i===tourStep?' on':'')+'"></div>').join('');
  const _ja=S.lang==='ja';
  const pos=_ja?((tourStep+1)+'/'+steps.length):(( tourStep+1)+'/'+steps.length);
  tc.innerHTML='<div class="tour-card"><div class="tour-card-hd"><h4 class="tour-title">'+step.title+'</h4><span class="tour-pos">'+pos+'</span></div><p class="tour-desc">'+step.desc+'</p><div class="tour-dots">'+dots+'</div><div class="tour-acts" id="tourActs"></div></div>';
  const acts=$('tourActs');
  if(tourStep>0){const pb=document.createElement('button');pb.className='btn btn-g btn-xs';pb.textContent=t('tourPrev');pb.onclick=()=>{tourStep--;showTourStep();};acts.appendChild(pb);}
  const nb=document.createElement('button');nb.className='btn btn-p btn-xs';nb.textContent=tourStep===steps.length-1?t('tourDone'):t('tourNext');
  nb.onclick=()=>{tourStep++;showTourStep();};acts.appendChild(nb);
  // Skip button
  const sb=document.createElement('button');sb.className='btn btn-g btn-xs';sb.textContent=_ja?'終了':'Skip';sb.style.marginLeft='auto';sb.onclick=closeTour;acts.appendChild(sb);
  // Spotlight target
  _tourClearSpotlight();
  if(step.target){
    const el=$(step.target);
    if(el)_tourUpdateSpotlight(el);
  }
}

function closeTour(){
  tourStep=-1;
  $('tourContainer').innerHTML='';
  _tourClearSpotlight();
  _lsSet('devforge-tour-done','1');
}
