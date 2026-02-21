/* ═══ TOUR ═══ */
function _getTourSteps(){
  const _ja=S.lang==='ja';
  var steps=[
  {title:_ja?'🌱 スキルレベル':'🌱 Skill Level',desc:_ja?'Beginner / Intermediate / Pro を選ぶと、質問の選択肢が自動調整されます。':'Choose Beginner / Intermediate / Pro to auto-adjust question options.'},
  {title:_ja?'📝 テンプレート':'📝 Templates',desc:_ja?'📦標準48種 ＋ 🎓分野別82種のプリセット。モード切替で選択。⚔️比較で違いを一覧。選ぶと回答が自動入力。':'📦 48 standard + 🎓 82 field presets. Toggle mode to switch. Use ⚔️ Compare for side-by-side. Pick one to auto-fill answers.'},
  {title:_ja?'💬 質問フロー':'💬 Q&A Flow',desc:_ja?'Phase 1-3 の質問に答えるだけ。Beginner: Phase 2自動スキップ＆⭐おすすめ技術をハイライト。スキップ＆後で回答も可能。':'Just answer Phase 1-3 questions. Beginners: Phase 2 auto-skipped & ⭐ recommended tech highlighted. Skip & answer later anytime.'},
  {title:_ja?'✎ 回答編集':'✎ Edit Answers',desc:_ja?'送信済みの回答に表示される ✎ ボタンで修正できます。':'Click the ✎ button on submitted answers to edit them.'},
  {title:_ja?'📦 135+ファイル生成':'📦 135+ File Generation',desc:_ja?'全質問回答後、20の柱で135+ファイルが自動生成されます。':'After all questions, 135+ files auto-generate across 20 pillars.'},
  {title:_ja?'⚡ 並列探索':'⚡ Parallel Explorer',desc:_ja?'Pillar ⑤ で7スタックを比較。回答に基づくおすすめランキング付き。':'Compare 7 stacks in Pillar ⑤ with recommendation ranking based on your answers.'},
  {title:'📊 Dashboard',desc:_ja?'Pillar ⑥ でコンテキスト可視化＋'+_TECH_COUNT+'技術DBを閲覧。':'Visualize context + browse '+_TECH_COUNT+' tech DB in Pillar ⑥.'},
  {title:_ja?'🤖 AIランチャー':'🤖 AI Launcher',desc:_ja?'Pillar ⑧ で仕様書をAIツールにワンクリック投入。37テンプレート＋トークン推定。':'Feed specs to AI tools in one click from Pillar ⑧. 37 templates + token estimation.'},
  {title:_ja?'🎭 9人の専門家ブレスト':'🎭 9-Expert Brainstorm',desc:_ja?'AIランチャーの「🎭 9人の専門家ブレスト」で、9つの異なる視点からアイデアを爆発させましょう。クリエイティブ・技術・ビジネス・ユーザー・ディスラプター等の専門家がAIの中に召喚されます。':'Use "🎭 9-Expert Brainstorm" in AI Launcher to explode ideas from 9 perspectives. Creative, Technical, Business, User, and Disruptor experts are summoned inside your AI.'},
  {title:_ja?'💾 データ保存の注意':'💾 Save Your Work',desc:_ja?'全データはブラウザのlocalStorageに保存されます。閲覧履歴の消去やブラウザ変更でデータが消失します。作業後は必ず📤 JSONエクスポートと📦 ZIPダウンロードで保存してください。':'All data is stored in browser localStorage. Clearing browser data or switching browsers will erase everything. Always export JSON 📤 and download ZIP 📦 after work.'},
  {title:_ja?'⚠️ 注意事項を確認':'⚠️ Read Cautions',desc:_ja?'ヘルプ（F1）の「⚠️ 注意事項」タブにスキルレベル設定・言語切替・ストレージ上限などの重要な注意点をまとめています。':'Check the "⚠️ Cautions" tab in Help (F1) for important notes on skill level, language switching, storage limits, and more.'},
  ];
  // Lv0-1: essential steps only (skill, templates, Q&A, generation, save, cautions)
  if(S.skillLv<=1){var _ti=[0,1,2,4,9,10];return _ti.map(function(i){return steps[i];});}
  return steps;
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
  const dots=steps.map((_,i)=>'<div class="tour-dot'+(i===tourStep?' on':'')+'"></div>').join('');
  tc.innerHTML='<div class="tour-card"><h4 class="tour-title">'+step.title+'</h4><p class="tour-desc">'+step.desc+'</p><div class="tour-dots">'+dots+'</div><div class="tour-acts" id="tourActs"></div></div>';
  const acts=$('tourActs');
  if(tourStep>0){const pb=document.createElement('button');pb.className='btn btn-g btn-xs';pb.textContent=t('tourPrev');pb.onclick=()=>{tourStep--;showTourStep();};acts.appendChild(pb);}
  const nb=document.createElement('button');nb.className='btn btn-p btn-xs';nb.textContent=tourStep===steps.length-1?t('tourDone'):t('tourNext');
  nb.onclick=()=>{tourStep++;showTourStep();};acts.appendChild(nb);
}
function closeTour(){tourStep=-1;$('tourContainer').innerHTML='';_lsSet('devforge-tour-done','1');}
