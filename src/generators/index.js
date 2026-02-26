/* ═══ FILE GENERATION ENGINE — 26 PILLARS ═══ */
function generateAll(){
  const _be=S.answers.backend||'';
  const _minKeys=(/なし|None|static/i.test(_be))?['frontend','backend']:['frontend','backend','database'];
  if(_minKeys.some(k=>!S.answers[k])){
    if(S.skillLv<=1){
      toast(S.lang==='ja'?'💬 まずチャットの質問に答えてから生成できます':'💬 Answer the chat questions first, then generate');
    }else{
      toast(S.lang==='ja'?'⚠️ 基本項目（FE/BE/DB）を先に回答してください':'⚠️ Answer basic items (FE/BE/DB) first');
    }
    return;
  }
  showGenLangChooser();
}
function showGenLangChooser(){
  const _j=S.lang==='ja';
  const ov=document.createElement('div');ov.className='gen-lang-overlay';ov.id='genLangOv';
  ov.innerHTML=`<div class="gen-lang-modal">
    <h3>${_j?'📄 生成ファイルの言語':'📄 File Language'}</h3>
    <p>${_j?'生成するドキュメントの言語を選択してください':'Choose the language for generated documents'}</p>
    <div class="gen-lang-btns">
      <div class="gen-lang-btn" onclick="doGenerate('ja')"><span class="flag">🇯🇵</span>日本語</div>
      <div class="gen-lang-btn" onclick="doGenerate('en')"><span class="flag">🇺🇸</span>English</div>
    </div>
  </div>`;
  document.body.appendChild(ov);
}
function doGenerate(lang){
  // Minimum answer safeguard
  const _be2=S.answers.backend||'';
  const _minKeys=(/なし|None|static/i.test(_be2))?['frontend','backend']:['frontend','backend','database'];
  const _missing=_minKeys.filter(k=>!S.answers[k]);
  if(_missing.length>0){
    toast(S.lang==='ja'?'⚠️ 必須項目が未回答です: '+_missing.join(', '):'⚠️ Required fields unanswered: '+_missing.join(', '));
    return;
  }
  snapshotFiles();
  S.genLang=lang;save();
  const ov=$('genLangOv');if(ov)ov.remove();
  const _j=S.lang==='ja';
  // Pre-generation compatibility gate
  const _cErrs=checkCompat(S.answers).filter(c=>c.level==='error');
  if(_cErrs.length>0){
    const msg=_cErrs.map(e=>'❌ '+e.msg).join('\n');
    if(!confirm((_j?'⚠️ スタック相性エラーが検出されました:\n\n':'⚠️ Stack compatibility errors detected:\n\n')+msg+'\n\n'+(_j?'このまま生成しますか？':'Continue generating?')))return;
  }
  addMsg('bot',S.lang==='ja'?'🔨 ファイルを生成中...':'🔨 Generating files...');

  // Smart loading UI (HCD: ⑤感情体験 ③認知負荷)
  const pillarIcons=['📋','🐳','🔌','🤖','✅','🗺️','🎨','🔍','💡','🔒','📊','⚙️','🔮','🧬','🧩','🔧','🏢','🚀','🌐','🗄️','📄','📦','🧪','🛡️','⚡','🔭'];
  const pillarNames=_j?['SDD','DevContainer','MCP','AIルール','品質','ロードマップ','デザイン','リバース','実装','セキュリティ','戦略','運用','未来','開発IQ','ゲノム','Prompt Ops','Enterprise','CI/CD','API','DB','仕様書','共通','テスト','AI安全','パフォ','可観測']:['SDD','DevContainer','MCP','AI Rules','Quality','Roadmap','Design','Reverse','Impl','Security','Strategy','Ops','Future','Dev IQ','Genome','Prompt Ops','Enterprise','CI/CD','API','DB','Docs','Common','Testing','AI Safety','Perf','Observ'];
  let pillarGrid='<div class="gen-pillar-grid">';
  for(let i=0;i<26;i++){
    pillarGrid+=`<div class="gen-pillar-card" id="genPillar${i}" data-status="pending">
      <div class="gen-pillar-icon">${pillarIcons[i]}</div>
      <div class="gen-pillar-name">${pillarNames[i]}</div>
      <div class="gen-pillar-check">✓</div>
    </div>`;
  }
  pillarGrid+='</div>';

  $('izone').innerHTML=`<div class="gen-spinner">
    <div class="gen-prog-wrap">
      <div class="gen-prog-bar"><div class="gen-prog-fill" id="genProgFill"></div></div>
      <div class="gen-prog-label" id="genProgLabel"></div>
    </div>
    ${pillarGrid}
    <div class="spin gen-spinner-icon">⚙️</div>
  </div>`;

  const a=S.answers;const pn=S.projectName;
  S.files={};S._zipDone=false;const _errs=[];
  // Reset sidebar pillar grid to inactive at generation start
  {const _sbGr=$('sbPillarGrid');if(_sbGr)_sbGr.querySelectorAll('.sb-pillar-icon').forEach(ic=>{ic.className='sb-pillar-icon inactive';});}
  const steps=[
    {fn:()=>genPillar1_SDD(a,pn),lbl:_j?'柱① SDD仕様書':'Pillar ① SDD',err:'P1-SDD'},
    {fn:()=>genPillar2_DevContainer(a,pn),lbl:_j?'柱② DevContainer':'Pillar ② DevContainer',err:'P2-Dev'},
    {fn:()=>genPillar3_MCP(a,pn),lbl:_j?'柱③ MCP':'Pillar ③ MCP',err:'P3-MCP'},
    {fn:()=>genPillar4_AIRules(a,pn),lbl:_j?'柱④ AIルール':'Pillar ④ AI Rules',err:'P4-AI'},
    {fn:()=>genPillar5_QualityIntelligence(a,pn),lbl:_j?'品質インテリジェンス':'Quality Intelligence',err:'P5-QA'},
    {fn:()=>genPillar7_Roadmap(a,pn),lbl:_j?'柱⑦ ロードマップ':'Pillar ⑦ Roadmap',err:'P7-Road'},
    {fn:()=>genPillar9_DesignSystem(a,pn),lbl:_j?'柱⑨ デザインシステム':'Pillar ⑨ Design System',err:'P9-DS'},
    {fn:()=>genPillar10_ReverseEngineering(a,pn),lbl:_j?'柱⑩ リバースEng':'Pillar ⑩ Reverse Eng',err:'P10-Rev'},
    {fn:()=>{genPillar11_ImplIntelligence(a,pn);gen81();},lbl:_j?'柱⑪ 実装インテリジェンス':'Pillar ⑪ Impl Intelligence',err:'P11-Impl'},
    {fn:()=>genPillar12_SecurityIntelligence(a,pn),lbl:_j?'柱⑫ セキュリティ':'Pillar ⑫ Security',err:'P12-Sec'},
    {fn:()=>genPillar13_StrategicIntelligence(a,pn),lbl:_j?'柱⑬ 戦略インテリジェンス':'Pillar ⑬ Strategic Intelligence',err:'P13-Strategy'},
    {fn:()=>genPillar14_OpsIntelligence(a,pn),lbl:_j?'柱⑭ 運用インテリジェンス':'Pillar ⑭ Ops Intelligence',err:'P14-Ops'},
    {fn:()=>genPillar15(a),lbl:_j?'柱⑮ 未来戦略インテリジェンス':'Pillar ⑮ Future Strategy Intelligence',err:'P15-Future'},
    {fn:()=>genPillar16_DevIQ(a,pn),lbl:_j?'柱⑯ 開発IQ':'Pillar ⑯ Dev IQ',err:'P16-DevIQ'},
    {fn:()=>genPillar17_PromptGenome(a,pn),lbl:_j?'柱⑰ プロンプトゲノム':'Pillar ⑰ Prompt Genome',err:'P17-PG'},
    {fn:()=>genPillar18_PromptOps(a,pn),lbl:_j?'柱⑱ Prompt Ops':'Pillar ⑱ Prompt Ops',err:'P18-POps'},
    {fn:()=>genPillar19_EnterpriseSaaS(a,pn),lbl:_j?'柱⑲ エンタープライズ':'Pillar ⑲ Enterprise',err:'P19-Ent'},
    {fn:()=>genPillar20_CICDIntelligence(a,pn),lbl:_j?'柱⑳ CI/CDインテリジェンス':'Pillar ⑳ CI/CD Intelligence',err:'P20-CICD'},
    {fn:()=>genPillar21_APIIntelligence(a,pn),lbl:_j?'柱㉑ APIインテリジェンス':'Pillar ㉑ API Intelligence',err:'P21-API'},
    {fn:()=>genPillar22_DatabaseIntelligence(a,pn),lbl:_j?'柱㉒ DBインテリジェンス':'Pillar ㉒ DB Intelligence',err:'P22-DB'},
    {fn:()=>genPillar23_TestingIntelligence(a,pn),lbl:_j?'柱㉓ テストインテリジェンス':'Pillar ㉓ Testing Intelligence',err:'P23-Test'},
    {fn:()=>genPillar24_AISafety(a,pn),lbl:_j?'柱㉔ AI安全性インテリジェンス':'Pillar ㉔ AI Safety Intelligence',err:'P24-AISafety'},
    {fn:()=>genPillar25_Performance(a,pn),lbl:_j?'柱㉕ パフォーマンスインテリジェンス':'Pillar ㉕ Performance Intelligence',err:'P25-Perf'},
    {fn:()=>genPillar26_Observability(a,pn),lbl:_j?'柱㉖ オブザーバビリティ':'Pillar ㉖ Observability',err:'P26-Obs'},
    {fn:()=>genDocs21(a,pn),lbl:_j?'仕様書28種':'28 Spec Docs',err:'Docs'},
    {fn:()=>genCommonFiles(a,pn),lbl:_j?'共通ファイル':'Common Files',err:'Common'},
  ];
  let si=0;
  function runStep(){
    if(si>=steps.length){finishGen(_errs);return;}
    const s=steps[si];const pct=Math.round((si/steps.length)*100);
    const fill=$('genProgFill');if(fill)fill.style.width=pct+'%';
    const lbl=$('genProgLabel');if(lbl)lbl.textContent=s.lbl;

    // Update pillar card status (HCD: ⑤感情体験 ③認知負荷)
    const card=$('genPillar'+si);
    if(card){
      card.setAttribute('data-status','processing');
      if(typeof announce==='function')announce(s.lbl);
    }
    // Update sidebar pillar icon to processing
    const _sbGrid=$('sbPillarGrid');
    const _sbIc=_sbGrid?_sbGrid.children[si]:null;
    if(_sbIc){_sbIc.classList.remove('inactive','completed');_sbIc.classList.add('processing');}

    setTimeout(()=>{
      try{s.fn();}catch(e){_errs.push(s.err);console.error('❌ '+s.err+' error:',e);}

      // Mark as completed
      if(card)card.setAttribute('data-status','completed');
      // Update sidebar pillar icon to completed
      if(_sbIc){_sbIc.classList.remove('processing','inactive');_sbIc.classList.add('completed');}

      si++;runStep();
    },60);
  }
  setTimeout(runStep,300);
}
function finishGen(_errs){
    if(_errs.length){toast('⚠️ '+_errs.length+(S.lang==='ja'?' 件のエラー: ':' errors: ')+_errs.join(', '));}
    // Phase C: Post-generation audit
    const _auditFindings=postGenerationAudit(S.files,S.answers);
    // Phase D: Architecture Integrity Check Report (docs/82)
    const _compatForReport=checkCompat(S.answers);
    const _integrityScore=genArchIntegrityCheck(S.files,S.answers,_compatForReport,_auditFindings);
    const fill=$('genProgFill');if(fill)fill.style.width='100%';
    const lbl=$('genProgLabel');if(lbl)lbl.textContent=S.lang==='ja'?'✅ 完了':'✅ Done';
    const _fc=Object.keys(S.files).length;
    const _ja=S.lang==='ja';
    addMsg('bot',_ja?`✅ 生成完了！全${_fc}ファイルが準備できました。ファイルツリーからプレビューするか、エクスポートしてください。`:`✅ Generation complete! All ${_fc} files are ready. Preview in the file tree or export.`);
    // Show audit results if any
    if(_auditFindings.length>0){
      const _sb=$('cbody');
      const aErrs=_auditFindings.filter(f=>f.level==='error');
      const aWarns=_auditFindings.filter(f=>f.level==='warn');
      const aInfos=_auditFindings.filter(f=>f.level==='info');
      let auditHtml='<div class="audit-results"><h4>'+(S.lang==='ja'?'🔍 生成後セルフ検証':'🔍 Post-Generation Audit')+'</h4>';
      if(aErrs.length) auditHtml+='<div class="audit-summary-err">❌ '+aErrs.length+(S.lang==='ja'?' 件の問題':' issues')+'</div>';
      if(aWarns.length) auditHtml+='<div class="audit-summary-warn">⚠️ '+aWarns.length+(S.lang==='ja'?' 件の注意':' warnings')+'</div>';
      if(aInfos.length) auditHtml+='<div class="audit-summary-info">ℹ️ '+aInfos.length+(S.lang==='ja'?' 件の参考':' notes')+'</div>';
      _auditFindings.forEach(f=>{
        const cls=f.level==='error'?'compat-error':f.level==='warn'?'compat-warn':'compat-info';
        const icon=f.level==='error'?'❌':f.level==='warn'?'⚠️':'ℹ️';
        auditHtml+=`<div class="${cls}"><span class="compat-icon">${icon}</span><span class="compat-msg">${esc(f.msg)}</span></div>`;
      });
      auditHtml+='</div>';
      const ad=document.createElement('div');ad.className='msg';ad.innerHTML=auditHtml;_sb.appendChild(ad);
    }
    // Show integrity score badge (docs/82 link)
    if(typeof _integrityScore==='number'){
      const _siEmoji=_integrityScore>=9?'✅':_integrityScore>=7?'⚠️':'❌';
      const _siCls=_integrityScore>=9?'compat-info':_integrityScore>=7?'compat-warn':'compat-error';
      const _sid=document.createElement('div');_sid.className='msg';
      _sid.innerHTML='<div class="'+_siCls+'"><span class="compat-icon">'+_siEmoji+'</span><span class="compat-msg"><strong>'+(_ja?'アーキテクチャ整合性スコア':'Architecture Integrity Score')+': '+_integrityScore.toFixed(1)+'/10</strong> — <a href="#" onclick="previewFile(\'docs/82_architecture_integrity_check.md\');return false;">'+(_ja?'報告書を開く →':'Open Report →')+'</a></span></div>';
      $('cbody').appendChild(_sid);
    }
    if($('statFileNum'))$('statFileNum').textContent=_fc;
    // Save recommendation notice
    const _sn=document.createElement('div');_sn.className='msg';
    const _sb2=$('cbody');
    _sn.innerHTML=`<div class="compat-warn"><span class="compat-icon">💾</span><span class="compat-msg">${_ja?'データはブラウザのみに保存されています。<strong>📦 ZIP</strong> と <strong>📤 JSONエクスポート</strong> で必ずローカル保存してください。':'Data is only stored in your browser. Be sure to save locally with <strong>📦 ZIP</strong> and <strong>📤 JSON Export</strong>.'}</span></div>`;
    _sb2.appendChild(_sn);_sb2.scrollTop=_sb2.scrollHeight;
    showExportGrid();
    showFileTree();
    if(typeof switchSidebarTab==='function')switchSidebarTab('files');
    if(typeof renderPillarGrid==='function')renderPillarGrid();
    initPrevTabs();initPillarTabs();updProgress();save();
    createQbar();
    setTimeout(showPostGenGuide,400);
}
function showExportGrid(){
  const _ja=S.lang==='ja';const fc=Object.keys(S.files).length;
  const totalChars=Object.values(S.files).reduce((s,v)=>s+v.length,0);
  const tokens=Math.round(totalChars/4);
  const sizeKB=Math.round(totalChars/1024);
  const summary=`<div class="export-summary">
    <span>📁 ${fc} ${_ja?'ファイル':'files'}</span>
    <span>📏 ~${sizeKB.toLocaleString()}KB</span>
    ${S.skillLv>=2?`<span>🔤 ~${tokens.toLocaleString()} ${_ja?'トークン':'tokens'}</span>`:''}
  </div>`;

  // Hero card for ZIP (HCD: ③認知負荷 ①目的達成)
  // C2: Lv0-1向け urgency wrapper で視覚的に強調
  const heroCard=(S.skillLv<=1?
    `<div class="export-hero export-hero-urgent" onclick="exportZIP()">
      <div class="export-hero-urgent-label">💾 ${_ja?'データ消失防止のため今すぐ保存！':'Save now to prevent data loss!'}</div>
      <div class="export-hero-badge">${_ja?'推奨':'Recommended'}</div>
      <div class="export-hero-icon">📦</div>
      <div class="export-hero-content">
        <h3>${_ja?'ZIP ダウンロード':'ZIP Download'}</h3>
        <p>${_ja?'全'+fc+'ファイルを一括保存。最も確実で便利な方法です。':'Save all '+fc+' files at once. Most reliable and convenient.'}</p>
      </div>
    </div>`
  :
    `<div class="export-hero" onclick="exportZIP()">
      <div class="export-hero-badge">${_ja?'推奨':'Recommended'}</div>
      <div class="export-hero-icon">📦</div>
      <div class="export-hero-content">
        <h3>${_ja?'ZIP ダウンロード':'ZIP Download'}</h3>
        <p>${_ja?'全'+fc+'ファイルを一括保存。最も確実で便利な方法です。':'Save all '+fc+' files at once. Most reliable and convenient.'}</p>
      </div>
    </div>`
  );

  // Lv4+ Power Ops panel
  const _powerOps=(S.skillLv>=4?(function(){
    var _ja=S.lang==='ja';
    return '<div class="power-ops-panel">'+
      '<div class="power-ops-title">'+(_ja?'⚡ パワーOps':'⚡ Power Ops')+'</div>'+
      '<div class="power-ops-btns">'+
      '<button class="btn btn-xs btn-s" onclick="showDiffView()">'+(_ja?'📊 差分比較':'📊 Diff View')+'</button>'+
      '<button class="btn btn-xs btn-s" onclick="shareURL()">'+(_ja?'🔗 URL共有':'🔗 Share URL')+'</button>'+
      '<button class="btn btn-xs btn-s" onclick="showPM()">'+(_ja?'📁 プロジェクト管理':'📁 Projects')+'</button>'+
      '</div></div>';
  })():'');

  // AI Quick Start card (GAP1: post-gen AI workflow guide)
  const _aiQs=(function(){
    if(typeof AI_TOOL_RECIPES==='undefined')return '';
    const tools=(S.answers.ai_tools||'').split(',').map(t=>t.trim()).filter(t=>t);
    const tool=tools.find(t=>AI_TOOL_RECIPES[t])||'_default';
    const recipe=AI_TOOL_RECIPES[tool]||AI_TOOL_RECIPES._default;
    const steps=_ja?recipe.ja:recipe.en;
    const name=tool==='_default'?(_ja?'汎用ワークフロー':'Generic Workflow'):tool;
    const _lv0=S.skillLv<=1;
    // Lv0-1: physical drag-and-drop micro-steps (P3)
    const _lv0Steps=_ja?[
      '📦 ZIPをダウンロード → ダブルクリックで展開 → フォルダをデスクトップに保存',
      '🤖 Cursorを起動 →「フォルダーを開く」で展開フォルダを選択 → チャットに「@CLAUDE.md」と入力して送信',
      '📝 チャットに「tasks.mdの最優先タスクを実装して」と入力 → Enter で開発スタート'
    ]:[
      '📦 Download ZIP → Double-click to extract → Save folder to Desktop',
      '🤖 Open Cursor → "Open Folder" → Select extracted folder → Type "@CLAUDE.md" in chat and send',
      '📝 Type "Implement the top-priority task from tasks.md" in chat → Enter to start'
    ];
    return '<div class="ai-quickstart">'+
      '<div class="ai-qs-title">🚀 '+esc(_ja?'AIツールで開発を開始: '+name:'Start AI Dev with: '+name)+'</div>'+
      (_lv0?
        '<div class="ai-qs-micro-label">🔰 '+(_ja?'初心者向け：この3ステップだけ！':'Beginner: Just these 3 steps!')+'</div>'+
        '<div class="ai-qs-steps">'+_lv0Steps.map(function(s,i){return '<div class="ai-qs-detail ai-qs-detail-micro"><span class="ai-qs-num">'+(i+1)+'</span> '+esc(s)+'</div>';}).join('')+'</div>'
      :
        '<div class="ai-qs-flow">'+
          '<div class="ai-qs-step"><span class="ai-qs-num">①</span>'+(_ja?'ZIP DL':'ZIP DL')+'</div>'+
          '<span class="ai-qs-arrow">→</span>'+
          '<div class="ai-qs-step"><span class="ai-qs-num">②</span>'+esc(_ja?'展開 → '+name+' で開く':'Extract → Open in '+name)+'</div>'+
          '<span class="ai-qs-arrow">→</span>'+
          '<div class="ai-qs-step"><span class="ai-qs-num">③</span>'+esc((steps&&steps[0])||'')+'</div>'+
        '</div>'+
        '<div class="ai-qs-steps">'+(steps||[]).map(function(s){return '<div class="ai-qs-detail">'+esc(s)+'</div>';}).join('')+'</div>'
      )+
      '<div class="ai-qs-note">💡 '+(_ja?'生成物は設計ドキュメントです。AIツールに投入すると実コードが生成されます。':'Generated files are design docs. Feed to your AI tool to generate real code.')+'</div>'+
      // C3: AI context recovery prompts (collapsible)
      (function(){
        var _rp=_ja?[
          {lbl:'コンテキスト再注入',txt:'まずCLAUDE.mdを読んでプロジェクトを把握してください。次にtasks.mdの最優先タスクを実装してください。'},
          {lbl:'エラー修正依頼',txt:'エラーが発生しました。specification.mdの設計に従って修正してください。エラー内容：'}
        ]:[
          {lbl:'Re-inject Context',txt:'First read CLAUDE.md to understand the project. Then implement the top-priority task from tasks.md.'},
          {lbl:'Error Fix Request',txt:'An error occurred. Fix it following the design in specification.md. Error details: '}
        ];
        // F6: Lv0-1 shows recovery prompts expanded (always visible); Lv2+ keeps <details> fold
        return (S.skillLv<=1?
          '<div class="ai-qs-recovery-open"><div class="ai-qs-recovery-title">🆘 '+(_ja?'AIが文脈を忘れたら？':'If AI loses context?')+'</div>':
          '<details class="ai-qs-recovery"><summary>🆘 '+(_ja?'AIが文脈を忘れたら？':'If AI loses context?')+'</summary>')+
          '<div class="ai-qs-rp-list">'+_rp.map(function(r){
            return '<div class="ai-qs-rp"><span class="ai-qs-rp-lbl">'+esc(r.lbl)+'</span>'+
              '<button class="btn btn-xs btn-s" onclick="navigator.clipboard.writeText(\''+escAttr(r.txt)+'\').then(function(){toast(\''+(_ja?'📋 コピー済み':'📋 Copied')+'\')})">'+ (_ja?'コピー':'Copy') +'</button></div>';
          }).join('')+'</div>'+(S.skillLv<=1?'</div>':'</details>');
      })()+
    '</div>';
  })();

  // Export group
  const exportGroup=`
    <div class="export-group-label">📤 ${_ja?'エクスポート':'Export'}</div>
    <div class="export-grid export-grid-compact">
      <div class="export-card" role="button" tabindex="0" onclick="exportPDF()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">📄</div><h4>${_ja?'PDF 印刷':'PDF Print'}</h4><p>${_ja?'仕様書をPDF化':'Export specs as PDF'}</p></div>
      <div class="export-card" role="button" tabindex="0" onclick="copyAllFiles()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">📋</div><h4>${_ja?'全ファイルコピー':'Copy All'}</h4><p>${_ja?'テキスト結合コピー':'Copy combined text'}</p></div>
      <div class="export-card" role="button" tabindex="0" onclick="copyForAI()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">🤖</div><h4>${_ja?'AI向けMD':'AI Markdown'}</h4><p>${_ja?'TOC付きMD形式':'MD with TOC for AI'}</p></div>
      <div class="export-card" role="button" tabindex="0" onclick="exportAnswersJSON()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">💾</div><h4>${_ja?'回答JSON保存':'Save Answers'}</h4><p>${_ja?'Q&A設定をJSONで保存':'Save Q&A as JSON'}</p></div>
      <div class="export-card" role="button" tabindex="0" onclick="importAnswersJSON()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">📂</div><h4>${_ja?'回答JSON読込':'Load Answers'}</h4><p>${_ja?'JSONから設定を復元':'Restore Q&A from JSON'}</p></div>
    </div>
  `;

  // Management group
  const mgmtGroup=`
    <div class="export-group-label">⚙️ ${_ja?'管理':'Management'}</div>
    <div class="export-grid export-grid-compact">
      <div class="export-card" role="button" tabindex="0" onclick="saveTemplate()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">💾</div><h4>${_ja?'テンプレート保存':'Save Template'}</h4><p>${_ja?'設定を保存':'Save settings'}</p></div>
      <div class="export-card" role="button" tabindex="0" onclick="shareURL()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"`+(S.skillLv>=4?' style="display:none"':'')+`><div class="icon">🔗</div><h4>${_ja?'URL共有':'Share URL'}</h4><p>${_ja?'設定をURLで共有':'Share via URL'}</p></div>
      <div class="export-card export-card-regen" role="button" tabindex="0" onclick="generateAll()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"><div class="icon">🔄</div><h4>${_ja?'再生成':'Regenerate'}</h4><p>${_ja?'全ファイル再作成':'Rebuild all files'}</p></div>
    </div>
  `;

  // Danger zone
  const dangerZone=`
    <div class="export-danger-zone">
      <div class="export-danger-label">⚠️ ${_ja?'注意が必要な操作':'Caution Required'}</div>
      <div class="export-card export-card-danger" role="button" tabindex="0" onclick="clearFiles()" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}">
        <div class="icon">🗑️</div>
        <h4>${_ja?'生成ファイルをクリア':'Clear Generated Files'}</h4>
        <p>${_ja?fc+'ファイルを削除（5秒間Undo可能）':'Delete '+fc+' files (Undo within 5s)'}</p>
      </div>
    </div>
  `;

  // C1: "Start Here" 3-file spotlight for Lv0-1 (addresses #1 complaint: "where do I start?")
  const _startHere=(function(){
    if(S.skillLv>1)return '';
    var _sf=[
      {path:'CLAUDE.md',icon:'🧠',ja:'AIにプロジェクト全体を理解させる最重要ファイル',en:'Most important: gives AI full project context'},
      {path:'.spec/tasks.md',icon:'📝',ja:'やることリスト。「最優先タスクを実装して」と伝えるベース',en:'Task list. Tell AI "implement the top-priority task"'},
      {path:'.cursorrules',icon:'⚡',ja:'Cursorが自動読み込み。AIルールを即時適用',en:'Auto-loaded by Cursor. AI rules applied automatically'}
    ].filter(function(f){return !!S.files[f.path];});
    if(!_sf.length)return '';
    return '<div class="start-here-card">'+
      '<div class="start-here-title">📂 '+(_ja?'まずこの3ファイルを読もう！':'Start Here: Read These 3 Files First!')+'</div>'+
      _sf.map(function(f){
        return '<div class="start-here-file" onclick="previewFile(\''+escAttr(f.path)+'\')" role="button" tabindex="0" onkeydown="if(event.key===\'Enter\'||event.key===\' \')this.click()">'+
          '<span class="start-here-icon">'+f.icon+'</span>'+
          '<div class="start-here-info">'+
            '<span class="start-here-name">'+esc(f.path.replace('.spec/',''))+'</span>'+
            '<span class="start-here-desc">'+esc(_ja?f.ja:f.en)+'</span>'+
          '</div>'+
          '<span class="start-here-arr">→</span>'+
        '</div>';
      }).join('')+
    '</div>';
  })();

  $('izone').innerHTML=summary+heroCard+_powerOps+_aiQs+_startHere+exportGroup+mgmtGroup+dangerZone;
}

function clearFiles(){
  const _ja=S.lang==='ja';const fc=Object.keys(S.files).length;
  if(!fc){toast(_ja?'クリアするファイルがありません':'No files to clear');return;}

  // Backup for undo
  const backup={
    files:JSON.parse(JSON.stringify(S.files)),
    editedFiles:JSON.parse(JSON.stringify(S.editedFiles)),
    prevFiles:JSON.parse(JSON.stringify(S.prevFiles)),
    genLang:S.genLang,
    previewFile:S.previewFile
  };

  // Clear
  S.files={};S._zipDone=false;S.editedFiles={};S.prevFiles={};S.genLang=null;S.previewFile=null;
  save();showFileTree();showExportGrid();if(typeof renderPillarGrid==='function')renderPillarGrid();
  if($('qbar'))$('qbar').remove();

  // Show undo toast
  toast(_ja?fc+' ファイルをクリアしました':'Cleared '+fc+' files',{
    type:'success',
    duration:5000,
    actionLabel:_ja?'元に戻す':'Undo',
    undoFn:()=>{
      S.files=backup.files;
      S.editedFiles=backup.editedFiles;
      S.prevFiles=backup.prevFiles;
      S.genLang=backup.genLang;
      S.previewFile=backup.previewFile;
      save();showFileTree();showExportGrid();createQbar();if(typeof renderPillarGrid==='function')renderPillarGrid();
      toast(_ja?'✅ 復元しました':'✅ Restored',{type:'success'});
    }
  });
}

