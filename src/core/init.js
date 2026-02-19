/* ═══ INIT ═══ */
/* Global error handler */
window.onerror=(msg,src,line)=>{console.error('DevForge error:',{msg,src,line});toast('⚠️ '+msg);};
window.onunhandledrejection=e=>{console.error('Unhandled:',e.reason);toast('⚠️ '+(e.reason?.message||e.reason));};
let _mermaidReady=false;let _mermaidLoading=false;
// OS theme auto-detection (HCD: ⑥文脈適合)
let theme=_lsGet('devforge-theme');
const themeManual=_lsGet('devforge-theme-manual')==='true';
if(!theme&&!themeManual){
  // First visit: detect OS preference
  const prefersLight=window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches;
  theme=prefersLight?'light':'dark';
}else if(!theme){
  theme='dark'; // Default fallback
}
// Real-time OS theme tracking (unless manually overridden)
if(!themeManual&&window.matchMedia){
  const mq=window.matchMedia('(prefers-color-scheme: light)');
  mq.addEventListener('change',e=>{
    if(_lsGet('devforge-theme-manual')!=='true'){
      theme=e.matches?'light':'dark';
      applyTheme();
    }
  });
}
function _initMermaidTheme(){try{mermaid.initialize({startOnLoad:false,theme:theme==='light'?'default':'dark',securityLevel:'strict'});}catch(e){}}
function loadMermaid(cb){
  if(_mermaidReady){cb();return;}
  if(_mermaidLoading){setTimeout(()=>loadMermaid(cb),200);return;}
  _mermaidLoading=true;
  const s=document.createElement('script');
  s.src='https://cdnjs.cloudflare.com/ajax/libs/mermaid/10.9.1/mermaid.min.js';
  s.integrity='sha384-WmdflGW9aGfoBdHc4rRyWzYuAjEmDwMdGdiPNacbwfGKxBW/SO6guzuQ76qjnSlr';
  s.crossOrigin='anonymous';
  s.onload=()=>{
    _initMermaidTheme();
    _mermaidReady=true;_mermaidLoading=false;cb();
  };
  s.onerror=()=>{_mermaidLoading=false;console.warn('Mermaid CDN load failed');cb();};
  document.head.appendChild(s);
}
async function _ensureMermaid(){
  if(_mermaidReady)return true;
  return new Promise(r=>{loadMermaid(()=>r(_mermaidReady));});
}
function applyTheme(){document.documentElement.setAttribute('data-theme',theme);const btn=$('themeBtn');if(btn)btn.textContent=theme==='light'?'☀️':'🌙';if(_mermaidReady)_initMermaidTheme();}
function toggleTheme(){theme=theme==='light'?'dark':'light';_lsSet('devforge-theme',theme);_lsSet('devforge-theme-manual','true');applyTheme();}
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
  if($('searchBtn'))$('searchBtn').title=ja?'検索 (Ctrl+P)':'Search (Ctrl+P)';
  // Landing stat labels
  const statLbls=document.querySelectorAll('.stat-item .lbl');
  const slJa=['生成ファイル','技術エントリ','柱 (Pillars)','AIツール対応'];
  const slEn=['Generated Files','Tech Entries','Pillars','AI Tools'];
  statLbls.forEach((el,i)=>{if(i<4)el.textContent=ja?slJa[i]:slEn[i];});
  // Info cards
  const icards=document.querySelectorAll('.icard');
  const icJa=[['😱 3つの悪夢を解決','真っ白な画面の絶望・終わらない連携地獄・「俺の環境では動く」症候群…DevForgeが全て自動解決'],['🧪 20の柱×134+ファイル','設計書を自動生成 → AIに投入 → 実コード。質問に答えるだけで仕様・環境・AIルール全てを自動生成。'],['📱 モバイル対応','Expo / React Native 開発パス・EAS Build・OTA更新'],['🤖 AI自律開発','Vibe Coding・マルチAgent・Claude Code Subagents'],['💳 決済・CMS・EC','Stripe・microCMS・Medusa・Shopify Hydrogen'],['📦 フルエクスポート','ZIP・PDF・全ファイル結合コピー・URLシェア']];
  const icEn=[['😱 Solve 3 Dev Nightmares','Blank screen paralysis, endless integration hell, "works on my machine" syndrome… DevForge auto-resolves all'],['🧪 20 Pillars × 134+ Files','Auto-generate specs → Feed to AI → Real code. Answer questions to auto-generate specs, env, AI rules & strategy.'],['📱 Mobile Support','Expo / React Native dev path, EAS Build, OTA updates'],['🤖 AI Autonomous Dev','Vibe Coding, Multi-Agent, Claude Code Subagents'],['💳 Payment/CMS/EC','Stripe, microCMS, Medusa, Shopify Hydrogen'],['📦 Full Export','ZIP, PDF, Copy All Files, URL Share']];
  icards.forEach((el,i)=>{if(i<6){const d=ja?icJa[i]:icEn[i];const h4=el.querySelector('h4');const p=el.querySelector('p');if(h4)h4.textContent=d[0];if(p)p.textContent=d[1];}});
  // Pillar badges
  const pbadges=document.querySelectorAll('.pbadge');
  const pbJa=['①SDD統合','②DevContainer','③MCP設定','④AIルール','⑤並列探索','⑥Dashboard','⑦ロードマップ','⑧AIランチャー','⑨デザインシステム','⑩リバースEng','⑪実装ガイド','⑫セキュリティ','⑬戦略インテリジェンス','⑭運用インテリジェンス','⑮未来戦略','⑯開発IQ','⑰プロンプトゲノム','⑱Prompt Ops','⑲エンタープライズ','⑳CI/CD'];
  const pbEn=['①SDD','②DevContainer','③MCP','④AI Rules','⑤Explorer','⑥Dashboard','⑦Roadmap','⑧AI Launcher','⑨Design System','⑩Reverse Eng','⑪Impl Guide','⑫Security','⑬Strategic Intelligence','⑭Ops Intelligence','⑮Future Strategy','⑯Dev IQ','⑰Prompt Genome','⑱Prompt Ops','⑲Enterprise','⑳CI/CD'];
  pbadges.forEach((el,i)=>{if(i<20)el.textContent=ja?pbJa[i]:pbEn[i];});
  // Pillar badge tooltips
  const pbTipJa=['仕様書・タスク・検証の統合設計ドキュメント5本組','VSCode/Cursor対応Docker開発環境を即時構築','Model Context Protocol設定でAIをプロジェクト対応','10+ツール対応AIルール（Claude/Cursor/Copilot等）','7スタック並列比較＋おすすめランキング','コンテキスト可視化＋技術DBブラウザ','インタラクティブ学習ロードマップ（Layer別進捗）','36プロンプトテンプレート＋AIモデル推薦','デザイントークン＋シーケンス図自動生成','ゴール逆算型プランニング（リバースエンジニアリング）','業種別実装パターン＋AI運用手順書','OWASP/STRIDE対応セキュリティ監査プロンプト','業界特化設計図＋技術レーダー＋ステークホルダー戦略','SLO/SLI・Feature Flags・12 Ops Capabilities設計','市場・UX・エコシステム・規制フォーサイト（2026-2035）','32ドメイン×12手法のポリモーフィック開発戦略','CRITERIA 8軸プロンプト品質スコア＋AI成熟度評価','ReAct自律ワークフロー＋LLMOpsダッシュボード','マルチテナント設計＋組織モデル＋エンタープライズUI','9ステージCI/CDパイプライン＋デプロイ戦略設計'];
  const pbTipEn=['5-doc spec suite: constitution, spec, plan, tasks, verification','Instant Docker dev env compatible with VSCode/Cursor','MCP config to give AI full project awareness','10+ AI tool configs (Claude, Cursor, Copilot, Windsurf, etc.)','Compare 7 stacks in parallel with recommendation ranking','Context visualization + browsable tech DB','Interactive learning roadmap with layer-based progress','36 prompt templates + AI model recommendations','Design tokens + sequence diagrams auto-generation','Goal-driven reverse engineering planning','Domain-specific implementation patterns + AI runbook','OWASP/STRIDE security audit prompts (context-aware)','Industry blueprint + tech radar + stakeholder strategy','SLO/SLI, Feature Flags, 12 Ops Capabilities design','Market, UX, ecosystem & regulatory foresight (2026-2035)','Polymorphic dev strategy: 32 domains × 12 approaches','CRITERIA 8-axis prompt quality scoring + AI maturity model','ReAct autonomous workflow + LLMOps dashboard','Multi-tenant design + org model + enterprise UI components','9-stage CI/CD pipeline + deploy strategy design'];
  pbadges.forEach((el,i)=>{if(i<20)el.title=ja?pbTipJa[i]:pbTipEn[i];});
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
  const kbJa=['ヘルプ・マニュアル','ショートカット一覧','コマンドパレット','テーマ切替','言語切替','エクスポート','全ファイルコピー','プロジェクト管理','サイドバー切替','エクスプローラー','ダッシュボード','ロードマップ','AI起動'];
  const kbEn=['Help / Manual','Shortcut List','Command Palette','Toggle Theme','Toggle Language','Export','Copy All Files','Project Manager','Toggle Sidebar','Explorer','Dashboard','Roadmap','AI Launcher'];
  kbRows.forEach((el,i)=>{if(i<13)el.textContent=ja?kbJa[i]:kbEn[i];});
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
  if(typeof updateSidebarLabels==='function')updateSidebarLabels();
  initPills();
  // Refresh presets for lang
  if($('presetRow'))initPresets();
  // Update html lang attribute and document title (D3)
  document.documentElement.lang=S.lang;
  document.title=ja?'DevForge v9.5 — AI駆動開発 統合プラットフォーム':'DevForge v9.5 — AI-Driven Development Platform';
  // Compare button translation (D4)
  const cl=$('compareLbl');if(cl)cl.textContent=ja?'テンプレート比較':'Compare Templates';
  // Update QBar labels when language changes
  if(typeof updateQbar==='function')updateQbar();
  // Sync skill slider and label to current S.skillLv
  var sl=$('skillLvSlider');if(sl)sl.value=S.skillLv;
  if(typeof _updateSkillLabel==='function')_updateSkillLabel(S.skillLv);
  // Lv0 hero supplemental hint
  var h0=$('heroLv0Hint');
  if(h0){
    h0.style.display=S.skillLv===0?'block':'none';
    h0.textContent=ja?'難しい知識は不要。質問に答えるだけ':'No technical knowledge needed. Just answer questions.';
  }
}

// Initialize
load();
applyTheme();
initPresets();
initVoice();
applyLang();
_initLinkInterceptor();
// D-2: Add keyboard support for skill cards
document.querySelectorAll('.skcard').forEach(el=>{
  el.onkeydown=(e)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();el.click();}};
});
// Load from URL if shared
(function loadFromURL(){
  try{
    const h=location.hash;if(!h||!h.startsWith('#df='))return;
    const data=JSON.parse(atob(h.slice(4)));
    if(data.projectName){
      S.projectName=sanitizeName(data.projectName);
      if(data.answers){
        const safeAnswers={};
        Object.keys(data.answers).forEach(k=>{
          if(['__proto__','constructor','prototype'].includes(k))return;
          if(typeof data.answers[k]==='string'){
            safeAnswers[k]=sanitize(data.answers[k]);
          }
        });
        S.answers=safeAnswers;
      }
      if(data.preset&&typeof data.preset==='string')S.preset=data.preset;
      if(data.skill&&['beginner','intermediate','pro'].includes(data.skill))S.skill=data.skill;
      if(typeof data.skillLv==='number'&&data.skillLv>=0&&data.skillLv<=6){
        S.skillLv=data.skillLv; S.skill=skillTier(data.skillLv);
      }
      if(data.lang&&['ja','en'].includes(data.lang))S.lang=data.lang;
      save();location.hash='';location.reload();
    }
  }catch(e){}
})();
// Restore session
if(S.projectName&&S.phase>0){
  $('onboard').style.display='none';
  $('ws').style.display='flex';
  if(typeof initSidebar==='function')initSidebar();
  initPills();updProgress();
  if(Object.keys(S.files).length>0){initPrevTabs();initPillarTabs();showFileTree();createQbar();}
  findNext();
}

// What's New indicator (HCD: C継続利用)
const CURRENT_VERSION='9.5.0';
const lastSeenVersion=_lsGet('devforge-last-version');
if(lastSeenVersion!==CURRENT_VERSION){
  const helpBtn=$('helpBtn')||document.querySelector('[onclick*="showManual"]');
  if(helpBtn){
    const dot=document.createElement('span');
    dot.className='whats-new-dot';
    dot.title=S.lang==='ja'?'新機能あり':'New features';
    helpBtn.style.position='relative';
    helpBtn.appendChild(dot);

    // Clear dot when help is opened
    const _origShowManual=window.showManual;
    window.showManual=function(){
      _lsSet('devforge-last-version',CURRENT_VERSION);
      if(dot)dot.remove();
      if(_origShowManual)_origShowManual();
    };
  }
}

// Tour
if(!_lsGet('devforge-tour-done')){setTimeout(()=>startTour(),1000);}
