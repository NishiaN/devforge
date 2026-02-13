/* ═══ FILE GENERATION ENGINE — 12 PILLARS ═══ */
function generateAll(){
  const _minKeys=['frontend','backend','database'];
  if(_minKeys.some(k=>!S.answers[k])){
    toast(S.lang==='ja'?'⚠️ 基本項目（FE/BE/DB）を先に回答してください':'⚠️ Answer basic items (FE/BE/DB) first');
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
  const _minKeys=['frontend','backend','database'];
  const _missing=_minKeys.filter(k=>!S.answers[k]);
  if(_missing.length>0){
    toast(S.lang==='ja'?'⚠️ 必須項目が未回答です: '+_missing.join(', '):'⚠️ Required fields unanswered: '+_missing.join(', '));
    return;
  }
  snapshotFiles();
  S.genLang=lang;save();
  const ov=$('genLangOv');if(ov)ov.remove();
  // Pre-generation compatibility gate
  const _cErrs=checkCompat(S.answers).filter(c=>c.level==='error');
  if(_cErrs.length>0){
    const _j=S.lang==='ja';
    const msg=_cErrs.map(e=>'❌ '+e.msg).join('\n');
    if(!confirm((_j?'⚠️ スタック相性エラーが検出されました:\n\n':'⚠️ Stack compatibility errors detected:\n\n')+msg+'\n\n'+(_j?'このまま生成しますか？':'Continue generating?')))return;
  }
  addMsg('bot',S.lang==='ja'?'🔨 ファイルを生成中...':'🔨 Generating files...');
  $('izone').innerHTML='<div class="gen-spinner"><div class="gen-prog-wrap"><div class="gen-prog-bar"><div class="gen-prog-fill" id="genProgFill"></div></div><div class="gen-prog-label" id="genProgLabel"></div></div><div class="spin gen-spinner-icon">⚙️</div></div>';
  
  const a=S.answers;const pn=S.projectName;
  S.files={};const _errs=[];const _j=S.lang==='ja';
  const steps=[
    {fn:()=>genPillar1_SDD(a,pn),lbl:_j?'柱① SDD仕様書':'Pillar ① SDD',err:'P1-SDD'},
    {fn:()=>genPillar2_DevContainer(a,pn),lbl:_j?'柱② DevContainer':'Pillar ② DevContainer',err:'P2-Dev'},
    {fn:()=>genPillar3_MCP(a,pn),lbl:_j?'柱③ MCP':'Pillar ③ MCP',err:'P3-MCP'},
    {fn:()=>genPillar4_AIRules(a,pn),lbl:_j?'柱④ AIルール':'Pillar ④ AI Rules',err:'P4-AI'},
    {fn:()=>genPillar5_QualityIntelligence(a,pn),lbl:_j?'品質インテリジェンス':'Quality Intelligence',err:'P5-QA'},
    {fn:()=>genPillar7_Roadmap(a,pn),lbl:_j?'柱⑦ ロードマップ':'Pillar ⑦ Roadmap',err:'P7-Road'},
    {fn:()=>genPillar9_DesignSystem(a,pn),lbl:_j?'柱⑨ デザインシステム':'Pillar ⑨ Design System',err:'P9-DS'},
    {fn:()=>genPillar10_ReverseEngineering(a,pn),lbl:_j?'柱⑩ リバースEng':'Pillar ⑩ Reverse Eng',err:'P10-Rev'},
    {fn:()=>genPillar11_ImplIntelligence(a,pn),lbl:_j?'柱⑪ 実装インテリジェンス':'Pillar ⑪ Impl Intelligence',err:'P11-Impl'},
    {fn:()=>genPillar12_SecurityIntelligence(a,pn),lbl:_j?'柱⑫ セキュリティ':'Pillar ⑫ Security',err:'P12-Sec'},
    {fn:()=>genPillar13_StrategicIntelligence(a,pn),lbl:_j?'柱⑬ 戦略インテリジェンス':'Pillar ⑬ Strategic Intelligence',err:'P13-Strategy'},
    {fn:()=>genDocs21(a,pn),lbl:_j?'仕様書28種':'28 Spec Docs',err:'Docs'},
    {fn:()=>genCommonFiles(a,pn),lbl:_j?'共通ファイル':'Common Files',err:'Common'},
  ];
  let si=0;
  function runStep(){
    if(si>=steps.length){finishGen(_errs);return;}
    const s=steps[si];const pct=Math.round((si/steps.length)*100);
    const fill=$('genProgFill');if(fill)fill.style.width=pct+'%';
    const lbl=$('genProgLabel');if(lbl)lbl.textContent=s.lbl;
    if(typeof announce==='function')announce(s.lbl);
    setTimeout(()=>{
      try{s.fn();}catch(e){_errs.push(s.err);console.error('❌ '+s.err+' error:',e);}
      si++;runStep();
    },60);
  }
  setTimeout(runStep,300);
}
function finishGen(_errs){
    if(_errs.length){toast('⚠️ '+_errs.length+(S.lang==='ja'?' 件のエラー: ':' errors: ')+_errs.join(', '));}
    // Phase C: Post-generation audit
    const _auditFindings=postGenerationAudit(S.files,S.answers);
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
    if($('statFileNum'))$('statFileNum').textContent=_fc;
    // Save recommendation notice
    const _sn=document.createElement('div');_sn.className='msg';
    const _sb2=$('cbody');
    _sn.innerHTML=`<div class="compat-warn"><span class="compat-icon">💾</span><span class="compat-msg">${_ja?'データはブラウザのみに保存されています。<strong>📦 ZIP</strong> と <strong>📤 JSONエクスポート</strong> で必ずローカル保存してください。':'Data is only stored in your browser. Be sure to save locally with <strong>📦 ZIP</strong> and <strong>📤 JSON Export</strong>.'}</span></div>`;
    _sb2.appendChild(_sn);_sb2.scrollTop=_sb2.scrollHeight;
    showExportGrid();
    showFileTree();
    initPrevTabs();initPillarTabs();updProgress();save();
    // Quick action bar
    if(!$('qbar')){
      const qb=document.createElement('div');qb.id='qbar';qb.className='qbar';
      qb.innerHTML=`<button class="qbar-btn" onclick="exportZIP()">📦 ZIP</button><button class="qbar-btn" onclick="copyAllFiles()">📋 ${_ja?'全コピー':'Copy All'}</button><button class="qbar-btn" onclick="S.pillar=5;showFileTree()">📊 Dashboard</button><button class="qbar-btn" onclick="S.pillar=6;showRoadmapUI()">🗺️ Roadmap</button><button class="qbar-x" onclick="this.parentNode.remove()">✕</button>`;
      const ws=$('ws');if(ws)ws.appendChild(qb);
    }
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
    <span>🔤 ~${tokens.toLocaleString()} ${_ja?'トークン':'tokens'}</span>
  </div>`;
  $('izone').innerHTML=summary+`<div class="export-grid">
    <div class="export-card" onclick="exportZIP()"><div class="icon">📦</div><h4>${_ja?'ZIP ダウンロード':'ZIP Download'}</h4><p>${_ja?'全'+fc+'ファイルをZIPで保存':'Save all '+fc+' files as ZIP'}</p></div>
    <div class="export-card" onclick="exportPDF()"><div class="icon">📄</div><h4>${_ja?'PDF 印刷':'PDF Print'}</h4><p>${_ja?'仕様書をPDF化':'Export specs as PDF'}</p></div>
    <div class="export-card" onclick="copyAllFiles()"><div class="icon">📋</div><h4>${_ja?'全ファイルコピー':'Copy All Files'}</h4><p>${_ja?'全結合テキストをコピー':'Copy all combined text'}</p></div>
    <div class="export-card" onclick="copyForAI()"><div class="icon">🤖</div><h4>${_ja?'AI向けMarkdown':'AI Markdown'}</h4><p>${_ja?'TOC付きMD形式でコピー':'Copy as MD with TOC for AI'}</p></div>
    <div class="export-card" onclick="saveTemplate()"><div class="icon">💾</div><h4>${_ja?'テンプレート保存':'Save Template'}</h4><p>${_ja?'設定を保存して再利用':'Save settings for reuse'}</p></div>
    <div class="export-card" onclick="shareURL()"><div class="icon">🔗</div><h4>${_ja?'URL共有':'Share URL'}</h4><p>${_ja?'設定をURLで共有':'Share settings via URL'}</p></div>
    <div class="export-card export-card-regen" onclick="generateAll()"><div class="icon">🔄</div><h4>${_ja?'再生成':'Regenerate'}</h4><p>${_ja?'回答から全ファイル再作成':'Rebuild all files from answers'}</p></div>
    <div class="export-card export-card-danger" onclick="clearFiles()"><div class="icon">🗑️</div><h4>${_ja?'生成ファイルをクリア':'Clear Generated Files'}</h4><p>${_ja?fc+'ファイルを削除（回答は保持）':'Delete '+fc+' files (answers kept)'}</p></div>
  </div>`;
}

function clearFiles(){
  const _ja=S.lang==='ja';const fc=Object.keys(S.files).length;
  if(!fc){toast(_ja?'クリアするファイルがありません':'No files to clear');return;}
  const msg=_ja?fc+'ファイルの生成結果をクリアします。\n回答データは保持されます。続行しますか？':'Clear '+fc+' generated files?\nYour answers will be kept.';
  if(!confirm(msg))return;
  S.files={};S.editedFiles={};S.prevFiles={};S.genLang=null;S.previewFile=null;
  save();showFileTree();showExportGrid();
  toast(_ja?'✅ 生成ファイルをクリアしました':'✅ Generated files cleared');
}

