/* ═══ INIT ═══ */
/* Global error handler */
window.onerror=(msg,src,line)=>{console.error('DevForge error:',{msg,src,line});toast('⚠️ '+msg);};
window.onunhandledrejection=e=>{console.error('Unhandled:',e.reason);toast('⚠️ '+(e.reason?.message||e.reason));};
let _mermaidReady=false;let _mermaidLoading=false;
let theme=_lsGet('devforge-theme')||'dark';
function _initMermaidTheme(){try{mermaid.initialize({startOnLoad:false,theme:theme==='light'?'default':'dark',securityLevel:'loose'});}catch(e){}}
function loadMermaid(cb){
  if(_mermaidReady){cb();return;}
  if(_mermaidLoading){setTimeout(()=>loadMermaid(cb),200);return;}
  _mermaidLoading=true;
  const s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js';
  s.onload=()=>{
    _initMermaidTheme();
    _mermaidReady=true;_mermaidLoading=false;cb();
  };
  s.onerror=()=>{_mermaidLoading=false;console.warn('Mermaid CDN load failed');cb();};
  document.head.appendChild(s);
}
function applyTheme(){document.documentElement.setAttribute('data-theme',theme);const btn=$('themeBtn');if(btn)btn.textContent=theme==='light'?'☀️':'🌙';if(_mermaidReady)_initMermaidTheme();}
function toggleTheme(){theme=theme==='light'?'dark':'light';_lsSet('devforge-theme',theme);applyTheme();}
function toggleLang(){S.lang=S.lang==='ja'?'en':'ja';save();applyLang();if(voiceRec)voiceRec.lang=S.lang==='ja'?'ja-JP':'en-US';}
function applyLang(){
  const l=S.lang;
  const ja=l==='ja';
  // Hero section
  if($('heroTitle'))$('heroTitle').textContent=t('heroTitle');
  if($('heroDesc'))$('heroDesc').textContent=t('heroDesc');
  if($('startBtn'))$('startBtn').textContent=t('startBtn');
  ['statFiles','statTech','statPillars','statAI'].forEach(k=>{if($(k))$(k).textContent=t(k);});
  if($('statTechNum'))$('statTechNum').textContent=_TECH_COUNT;
  if($('skillAsk'))$('skillAsk').textContent=t('skillAsk');
  document.querySelectorAll('.sk-title').forEach((el,i)=>{el.textContent=t(['skBeginner','skIntermediate','skPro'][i]);});
  document.querySelectorAll('.sk-desc').forEach((el,i)=>{el.textContent=t(['skBeginnerDesc','skIntermediateDesc','skProDesc'][i]);});
  // Topbar buttons
  const lb=$('langBtn');if(lb)lb.textContent=ja?'🌐 EN':'🌐 JA';
  if($('helpBtn'))$('helpBtn').title=ja?'ヘルプ':'Help';
  if($('kbBtn'))$('kbBtn').title=ja?'ショートカット':'Shortcuts';
  if($('pmBtn'))$('pmBtn').title=ja?'プロジェクト管理':'Projects';
  // Landing stat labels
  const statLbls=document.querySelectorAll('.stat-item .lbl');
  const slJa=['生成ファイル','技術エントリ','柱 (Pillars)','AIツール対応'];
  const slEn=['Generated Files','Tech Entries','Pillars','AI Tools'];
  statLbls.forEach((el,i)=>{if(i<4)el.textContent=ja?slJa[i]:slEn[i];});
  // Info cards
  const icards=document.querySelectorAll('.icard');
  const icJa=[['📝 60+ファイル生成','SDD仕様書・Docker・MCP・AIルール10種・ロードマップ9種・仕様書23種'],['🧪 8つの柱','SDD・DevContainer・MCP・AIルール・並列探索・Dashboard・ロードマップ'],['📱 モバイル対応','Expo / React Native 開発パス・EAS Build・OTA更新'],['🤖 AI自律開発','Vibe Coding・マルチAgent・Claude Code Subagents'],['💳 決済・CMS・EC','Stripe・microCMS・Medusa・Shopify Hydrogen'],['📦 フルエクスポート','ZIP・PDF・全ファイル結合コピー・URLシェア']];
  const icEn=[['📝 60+ File Generation','SDD specs, Docker, MCP, 10 AI rules, 9 roadmaps, 23 specs'],['🧪 8 Pillars','SDD, DevContainer, MCP, AI Rules, Explorer, Dashboard, Roadmap, AI Launcher'],['📱 Mobile Support','Expo / React Native dev path, EAS Build, OTA updates'],['🤖 AI Autonomous Dev','Vibe Coding, Multi-Agent, Claude Code Subagents'],['💳 Payment/CMS/EC','Stripe, microCMS, Medusa, Shopify Hydrogen'],['📦 Full Export','ZIP, PDF, Copy All Files, URL Share']];
  icards.forEach((el,i)=>{if(i<6){const d=ja?icJa[i]:icEn[i];const h4=el.querySelector('h4');const p=el.querySelector('p');if(h4)h4.textContent=d[0];if(p)p.textContent=d[1];}});
  // Pillar badges
  const pbadges=document.querySelectorAll('.pbadge');
  const pbJa=['①SDD統合','②DevContainer','③MCP設定','④AIエージェント×10','⑤並列探索','⑥Context Dashboard','⑦技術ロードマップ','⑧AIランチャー'];
  const pbEn=['①SDD','②DevContainer','③MCP Config','④AI Agent×10','⑤Explorer','⑥Context Dashboard','⑦Tech Roadmap','⑧AI Launcher'];
  pbadges.forEach((el,i)=>{if(i<8)el.textContent=ja?pbJa[i]:pbEn[i];});
  // Keyboard shortcuts overlay
  const kbT=$('kbTitle');if(kbT)kbT.textContent=t('kbTitle');
  const kbLabels=document.querySelectorAll('.kblbl');
  const kbArr=t('kb');
  kbLabels.forEach((el,i)=>{if(i<kbArr.length)el.textContent=kbArr[i];});
  // Input placeholder
  const ni=$('nameIn');if(ni)ni.placeholder=ja?'プロジェクト名を入力...':'Enter project name...';
  // Preview panel header
  const panPT=$('panPTitle');if(panPT)panPT.textContent=ja?'📁 生成ファイル':'📁 Generated Files';
  // Preview tabs
  if($('prevTabs')&&$('prevTabs').children.length>0){
    const tabs=$('prevTabs').children;
    if(tabs[0])tabs[0].textContent=ja?'ツリー':'Tree';
    if(tabs[1])tabs[1].textContent=ja?'プレビュー':'Preview';
  }
  // Pillar tabs
  if($('pillarTabs')&&$('pillarTabs').children.length>0){
    const names=t('pillar');
    if(Array.isArray(names)){Array.from($('pillarTabs').children).forEach((b,i)=>{if(names[i])b.textContent=names[i];});}
  }
  // Keyboard shortcuts overlay
  const kbRows=document.querySelectorAll('.kb-row span:first-child');
  const kbJa=['ヘルプ・マニュアル','ショートカット一覧','テーマ切替','言語切替','エクスポート','戻る','プロジェクト管理'];
  const kbEn=['Help / Manual','Shortcut List','Toggle Theme','Toggle Language','Export','Undo','Project Manager'];
  kbRows.forEach((el,i)=>{if(i<7)el.textContent=ja?kbJa[i]:kbEn[i];});
  // Mobile tabs
  const mobtabs=document.querySelectorAll('.mobtab');
  if(mobtabs.length>=2){mobtabs[0].textContent=ja?'💬 チャット':'💬 Chat';mobtabs[1].textContent=ja?'📄 プレビュー':'📄 Preview';}
  // Footer
  const footer=document.querySelector('.app-footer');if(footer)footer.textContent=ja?'© 2026 エンジニアリングのタネ制作委員会 ｜ 作成者：にしあん':'© 2026 Engineering no Tane Committee | Created by にしあん';
  // Placeholder in prevBody
  const prevP=$('prevBody');if(prevP&&prevP.querySelector('p')&&!Object.keys(S.files||{}).length){
    const p=prevP.querySelector('p');if(p&&!S.previewFile)p.textContent=ja?'質問に回答するとリアルタイムでプレビューが更新されます':'Preview updates in real-time as you answer questions';
  }
  // Phase pills
  initPills();
  // Refresh presets for lang
  if($('presetRow'))initPresets();
}

// Initialize
load();
applyTheme();
initPresets();
initVoice();
applyLang();
// Load from URL if shared
(function loadFromURL(){
  try{
    const h=location.hash;if(!h||!h.startsWith('#df='))return;
    const data=JSON.parse(atob(h.slice(4)));
    if(data.projectName){data.projectName=sanitizeName(data.projectName);Object.assign(S,data);save();location.hash='';location.reload();}
  }catch(e){}
})();
// Restore session
if(S.projectName&&S.phase>0){
  $('onboard').style.display='none';
  $('ws').style.display='flex';
  initPills();updProgress();
  if(Object.keys(S.files).length>0){initPrevTabs();initPillarTabs();showFileTree();}
  findNext();
}
// Tour
if(!_lsGet('devforge-tour-done')){setTimeout(()=>startTour(),1000);}
