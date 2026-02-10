/* ═══ TOUR ═══ */
function _getTourSteps(){
  const _ja=S.lang==='ja';
  return [
  {title:_ja?'🌱 スキルレベル':'🌱 Skill Level',desc:_ja?'Beginner / Intermediate / Pro を選ぶと、質問の選択肢が自動調整されます。':'Choose Beginner / Intermediate / Pro to auto-adjust question options.'},
  {title:_ja?'📝 テンプレート':'📝 Templates',desc:_ja?'26種類のプリセットから選ぶと、回答が自動入力されます。':'Pick from 26 presets to auto-fill answers.'},
  {title:_ja?'💬 質問フロー':'💬 Q&A Flow',desc:_ja?'Phase 1-3 の質問に答えるだけ。スキップも後で回答も可能です。':'Just answer Phase 1-3 questions. Skip and answer later anytime.'},
  {title:_ja?'✎ 回答編集':'✎ Edit Answers',desc:_ja?'送信済みの回答に表示される ✎ ボタンで修正できます。':'Click the ✎ button on submitted answers to edit them.'},
  {title:_ja?'📦 60+ファイル生成':'📦 60+ File Generation',desc:_ja?'全質問回答後、8つの柱で60+ファイルが自動生成されます。':'After all questions, 60+ files auto-generate across 8 pillars.'},
  {title:_ja?'⚡ 並列探索':'⚡ Parallel Explorer',desc:_ja?'Pillar ⑤ で7スタックを比較。回答に基づくおすすめランキング付き。':'Compare 7 stacks in Pillar ⑤ with recommendation ranking based on your answers.'},
  {title:'📊 Dashboard',desc:_ja?'Pillar ⑥ でコンテキスト可視化＋'+_TECH_COUNT+'技術DBを閲覧。':'Visualize context + browse '+_TECH_COUNT+' tech DB in Pillar ⑥.'},
  {title:_ja?'🤖 AIランチャー':'🤖 AI Launcher',desc:_ja?'Pillar ⑧ で仕様書をAIツールにワンクリック投入。6テンプレート＋トークン推定。':'Feed specs to AI tools in one click from Pillar ⑧. 6 templates + token estimation.'},
  {title:_ja?'💾 データ保存の注意':'💾 Save Your Work',desc:_ja?'全データはブラウザのlocalStorageに保存されます。閲覧履歴の消去やブラウザ変更でデータが消失します。作業後は必ず📤 JSONエクスポートと📦 ZIPダウンロードで保存してください。':'All data is stored in browser localStorage. Clearing browser data or switching browsers will erase everything. Always export JSON 📤 and download ZIP 📦 after work.'},
  {title:_ja?'⚠️ 注意事項を確認':'⚠️ Read Cautions',desc:_ja?'ヘルプ（F1）の「⚠️ 注意事項」タブにスキルレベル設定・言語切替・ストレージ上限などの重要な注意点をまとめています。':'Check the "⚠️ Cautions" tab in Help (F1) for important notes on skill level, language switching, storage limits, and more.'},
  ];
}
let tourStep=-1;
function startTour(){
  const steps=_getTourSteps();
  if(steps.length===0)return;
  tourStep=0;showTourStep();
}
function showTourStep(){
  const tc=$('tourContainer');
  const steps=_getTourSteps();
  if(tourStep<0||tourStep>=steps.length){closeTour();return;}
  const step=steps[tourStep];
  const dots=steps.map((_,i)=>'<div class="tour-dot'+(i===tourStep?' on':'')+'">&lt;/div>').join('');
  tc.innerHTML='<div class="tour-card"><h4 class="tour-title">'+step.title+'</h4><p class="tour-desc">'+step.desc+'</p><div class="tour-dots">'+dots+'</div><div class="tour-acts" id="tourActs"></div></div>';
  const acts=$('tourActs');
  if(tourStep>0){const pb=document.createElement('button');pb.className='btn btn-g btn-xs';pb.textContent=t('tourPrev');pb.onclick=()=>{tourStep--;showTourStep();};acts.appendChild(pb);}
  const nb=document.createElement('button');nb.className='btn btn-p btn-xs';nb.textContent=tourStep===steps.length-1?t('tourDone'):t('tourNext');
  nb.onclick=()=>{tourStep++;showTourStep();};acts.appendChild(nb);
}
function closeTour(){tourStep=-1;$('tourContainer').innerHTML='';_lsSet('devforge-tour-done','1');}
