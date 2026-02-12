/* ── Pillar ⑥ Context Dashboard (Enhanced) ── */
function showDashboard(){
  pushView({pillar:5,type:'dashboard',file:null});
  const body=$('prevBody');
  const _ja=S.lang==='ja';
  const a=S.answers;
  const fileCount=Object.keys(S.files).length||0;
  const totalChars=Object.values(S.files).reduce((s,f)=>s+f.length,0);
  const tokens=Math.round(totalChars/4);
  const answered=Object.keys(a).length;
  
  let h=`<div class="dash-head"><h3>📊 Context Dashboard</h3><p>${_ja?'プロジェクトのコンテキスト情報を一覧':'Project context overview'}</p></div>`;
  
  // Backup reminder banner
  const lastExp=_lsGet('devforge-last-export');
  const daysSince=lastExp?Math.floor((Date.now()-new Date(lastExp).getTime())/86400000):-1;
  if(daysSince<0){
    h+=`<div class="dash-backup dash-backup-red"><span>⚠️ ${_ja?'まだエクスポートしていません — データはブラウザのみに保存されています':'No exports yet — data only exists in this browser'}</span><button class="btn btn-xs btn-p" onclick="exportProject();_lsSet('devforge-last-export',new Date().toISOString());">📤 ${_ja?'今すぐ保存':'Export Now'}</button></div>`;
  } else if(daysSince>=3){
    h+=`<div class="dash-backup dash-backup-yellow"><span>💾 ${_ja?'最終エクスポート: '+daysSince+'日前':'Last export: '+daysSince+' days ago'}</span><button class="btn btn-xs btn-s" onclick="exportProject();_lsSet('devforge-last-export',new Date().toISOString());">📤 ${_ja?'バックアップ':'Backup'}</button></div>`;
  }
  
  // Usage guide card
  if(!_lsGet('devforge-guide-dismiss')){
    h+=`<div class="dash-backup dash-guide"><span>🚀 ${_ja?'生成ファイルの活用ガイドを確認しましょう':'Check the generated files usage guide'}</span><button class="btn btn-xs btn-p" onclick="showPostGenGuide(true)">${_ja?'ガイドを見る':'View Guide'}</button><button class="btn btn-xs btn-s" onclick="showManual('workflow')">${_ja?'📘 手順':'📘 Workflow'}</button><button class="btn btn-xs btn-g" onclick="this.closest('.dash-backup').remove();_lsSet('devforge-guide-dismiss','1')">✕</button></div>`;
  }
  
  // Summary stats
  h+=`<div class="ctx-summary">
    <div class="ctx-stat"><div class="num">${fileCount}</div><div class="lbl">${_ja?'生成ファイル':'Files'}</div></div>
    <div class="ctx-stat"><div class="num">${Math.round(tokens).toLocaleString()}</div><div class="lbl">${_ja?'推定トークン':'Est. Tokens'}</div></div>
    <div class="ctx-stat"><div class="num">${answered}</div><div class="lbl">${_ja?'回答済み質問':'Answered'}</div></div>
    <div class="ctx-stat"><div class="num">${TECH_DB.length}</div><div class="lbl">${_ja?'技術DB':'Tech DB'}</div></div>
  </div>`;
  
  // Model fit analysis
  const models=[
    {name:'Claude Opus 4.6',ctx:1000000,color:'var(--accent)'},
    {name:'Claude Sonnet 4.5',ctx:200000,color:'var(--accent-2)'},
    {name:'GPT-5.2',ctx:400000,color:'var(--success)'},
    {name:'Gemini 2.5 Pro',ctx:1000000,color:'var(--warn)'},
    {name:'Claude Haiku 4.5',ctx:200000,color:'var(--accent)'},
    {name:'Gemini 3 Flash',ctx:200000,color:'var(--warn)'},
  ];
  h+='<h4 class="dash-h4">🤖 '+(_ja?'モデル適合度':'Model Fit')+'</h4><div class="model-grid">';
  models.forEach(m=>{
    const pct=Math.min(100,Math.round(tokens/m.ctx*100));
    const fit=pct<80?'high':pct<95?'mid':'low';
    const fitClass=fit==='high'?'fit-high':fit==='mid'?'fit-mid':'fit-low';
    h+=`<div class="model-card"><h4>${m.name}</h4><div class="fit ${fitClass}">${fit==='high'?(_ja?'\u2705 適合':'\u2705 Fit'):fit==='mid'?(_ja?'\u26A0\uFE0F 注意':'\u26A0\uFE0F Caution'):(_ja?'\u274C 超過':'\u274C Over')}</div>
    <div class="dash-model-ctx">${_ja?'コンテキスト':'Context'}: ${(m.ctx/1000).toFixed(0)}K tokens</div>
    <div class="ctx-bar"><div class="ctx-bar-fill" style="width:${pct}%;background:${m.color}"></div></div>
    <div class="dash-model-pct">${pct}% ${_ja?'使用':'used'}</div></div>`;
  });
  h+='</div>';

  // File size breakdown by pillar
  if(fileCount>0){
    h+='<h4 class="dash-h4-mt">📂 '+(_ja?'ファイルサイズ分布':'File Size Distribution')+'</h4>';
    const cats=_ja?{'SDD (.spec/)':0,'DevContainer':0,'MCP':0,'AIルール':0,'Roadmap':0,'Docs':0,'Common':0}:{'SDD (.spec/)':0,'DevContainer':0,'MCP':0,'AI Rules':0,'Roadmap':0,'Docs':0,'Common':0};
    Object.entries(S.files).forEach(([p,c])=>{
      const len=c.length;
      if(p.startsWith('.spec/'))cats['SDD (.spec/)']+=len;
      else if(p.startsWith('.devcontainer/'))cats['DevContainer']+=len;
      else if(p.includes('mcp'))cats['MCP']+=len;
      else if(p.startsWith('roadmap/'))cats['Roadmap']+=len;
      else if(p.startsWith('docs/'))cats['Docs']+=len;
      else if(['.cursor/rules','.windsurfrules','.clinerules','CLAUDE.md','AGENTS.md'].some(x=>p.includes(x)))cats[_ja?'AIルール':'AI Rules']+=len;
      else cats['Common']+=len;
    });
    const maxLen=Math.max(...Object.values(cats),1);
    Object.entries(cats).forEach(([name,len])=>{
      const pct=Math.round(len/maxLen*100);
      h+=`<div class="dash-fbar-row">
        <span class="dash-fbar-name">${name}</span>
        <div class="dash-fbar"><div class="dash-fbar-fill" style="width:${pct}%"></div></div>
        <span class="dash-fbar-size">${(len/1024).toFixed(1)}KB</span>
      </div>`;
    });
  }

  // Tech DB category breakdown — grouped bar chart
  h+='<h4 class="dash-h4-mt">📊 '+(_ja?'技術マスターテーブル統計':'Tech DB Statistics')+'</h4>';
  const catLabels=_ja?{lang:'言語',front:'FE',mobile:'モバイル',back:'BE',baas:'BaaS',payment:'決済/CMS',devops:'DevOps',ai:'AIツール',ai_auto:'AI自律',method:'手法',test:'テスト',api:'API',build:'ビルド',data:'データ',security:'セキュリティ'}:{lang:'Lang',front:'FE',mobile:'Mobile',back:'BE',baas:'BaaS',payment:'Payment/CMS',devops:'DevOps',ai:'AI Tools',ai_auto:'AI Auto',method:'Methods',test:'Testing',api:'API',build:'Build',data:'Data',security:'Security'};
  const catCounts=TECH_DB.reduce((acc,t)=>{acc[t.cat]=(acc[t.cat]||0)+1;return acc;},{});
  const dbMax=Math.max(...Object.values(catCounts));
  const domGrps=_ja?[
    {n:'🖥 コア開発',c:['lang','front','back','mobile'],cl:'dg-core'},
    {n:'🤖 AI & 自動化',c:['ai','ai_auto'],cl:'dg-ai'},
    {n:'☁️ インフラ & サービス',c:['baas','devops','payment'],cl:'dg-infra'},
    {n:'🛡 品質 & 設計',c:['method','test','api','build','data','security'],cl:'dg-qa'}
  ]:[
    {n:'🖥 Core Dev',c:['lang','front','back','mobile'],cl:'dg-core'},
    {n:'🤖 AI & Automation',c:['ai','ai_auto'],cl:'dg-ai'},
    {n:'☁️ Infra & Services',c:['baas','devops','payment'],cl:'dg-infra'},
    {n:'🛡 Quality & Design',c:['method','test','api','build','data','security'],cl:'dg-qa'}
  ];
  domGrps.forEach(g=>{
    const items=g.c.filter(c=>catCounts[c]).map(c=>({l:catLabels[c]||c,v:catCounts[c]})).sort((a,b)=>b.v-a.v);
    const sub=items.reduce((s,i)=>s+i.v,0);
    h+=`<div class="dg ${g.cl}"><div class="dg-hd"><span class="dg-nm">${g.n}</span><span class="dg-sub">${sub}</span></div>`;
    items.forEach(i=>{
      const pct=Math.round(i.v/dbMax*100);
      h+=`<div class="dg-bar"><span class="dg-lbl">${i.l}</span><div class="dg-track"><div class="dg-fill" style="width:${pct}%"></div></div><span class="dg-cnt">${i.v}</span></div>`;
    });
    h+='</div>';
  });
  h+=`<div class="dg-total"><span>📊 ${_ja?'技術マスターテーブル':'Tech Master Table'}</span><strong>${TECH_DB.length}</strong></div>`;

  // Project info
  h+=`<h4 class="dash-h4-mt">📋 ${_ja?'プロジェクト情報':'Project Info'}</h4><div class="dash-info">`;
  const info=_ja?[['プロジェクト名',S.projectName],['フロント',a.frontend],['バック',a.backend],['DB',a.database],['デプロイ',a.deploy],['モバイル',a.mobile],['AI自律',a.ai_auto],['決済/CMS',a.payment],['駆動開発',a.dev_methods],['スキル',a.skill_level]]:[['Project',S.projectName],['Frontend',a.frontend],['Backend',a.backend],['DB',a.database],['Deploy',a.deploy],['Mobile',a.mobile],['AI Auto',a.ai_auto],['Payment/CMS',a.payment],['Dev Methods',a.dev_methods],['Skill',a.skill_level]];
  info.forEach(([k,v])=>{if(v&&v!==(_ja?'（未指定）':'(Unset)')&&v!=='(Unset)')h+=`<div class="exp-row"><span class="label">${k}</span><span class="val">${v}</span></div>`;});
  h+='</div>';
  
  // Stack Synergy Score
  const syn=calcSynergy(a);
  const synColor=syn.overall>=75?'var(--success)':syn.overall>=50?'var(--warn)':'var(--danger)';
  const synLabel=syn.overall>=75?(_ja?'High Synergy':'High Synergy'):syn.overall>=50?(_ja?'Medium Synergy':'Medium Synergy'):(_ja?'Low Synergy':'Low Synergy');
  h+=`<h4 class="dash-h4-mt">⚡ ${_ja?'スタック相乗効果スコア':'Stack Synergy Score'}</h4>`;
  h+=`<div class="synergy-card">`;
  h+=`<div class="synergy-header"><div class="synergy-label">${synLabel}</div><div class="synergy-score" style="background:${synColor}20;color:${synColor};">${syn.overall}</div></div>`;
  h+=`<div class="synergy-bar"><div class="synergy-bar-fill" style="width:${syn.overall}%;background:${synColor};"></div></div>`;
  h+=`<div class="synergy-dims">`;
  const dims=[
    {l:_ja?'FE↔BE親和度':'FE↔BE Affinity',v:syn.d1},
    {l:_ja?'エコ統一度':'Ecosystem Unity',v:syn.d2},
    {l:_ja?'ドメイン適合':'Domain Fit',v:syn.d3},
    {l:_ja?'デプロイ整合':'Deploy Alignment',v:syn.d4},
    {l:_ja?'複雑度バランス':'Complexity Balance',v:syn.d5}
  ];
  dims.forEach(d=>{
    const c=d.v>=75?'var(--success)':d.v>=50?'var(--warn)':'var(--danger)';
    h+=`<div class="synergy-dim"><span class="synergy-dim-lbl">${d.l}</span><div class="synergy-dim-bar"><div class="synergy-dim-fill" style="width:${d.v}%;background:${c};"></div></div><span class="synergy-dim-val">${d.v}</span></div>`;
  });
  h+=`</div>`;
  if(syn.domain)h+=`<div class="synergy-domain">${_ja?'検出ドメイン':'Detected Domain'}: <strong>${syn.domain}</strong></div>`;
  h+=`</div>`;

  // Stack compatibility report
  const compat=checkCompat(a);
  const errs=compat.filter(c=>c.level==='error');
  const warns=compat.filter(c=>c.level==='warn');
  const infos=compat.filter(c=>c.level==='info');
  const ok=8-(errs.length>0?1:0)-(warns.length>0?1:0);
  h+=`<h4 class="dash-h4-mt">🔍 ${_ja?'スタック相性 & 整合性チェック':'Stack Compatibility & Consistency'}</h4>`;
  if(compat.length===0){
    h+=`<div class="compat-ok">✅ ${_ja?`スタック相性・意味的整合ともに問題なし（${COMPAT_RULES.length}ルール検証済）`:`No issues found (${COMPAT_RULES.length} rules verified)`}</div>`;
  } else {
    h+=`<div class="compat-summary"><span class="compat-s-ok">✅ ${_ja?'問題なし':'OK'}: ${COMPAT_RULES.length-compat.length}</span>`;
    const fixWarns=compat.filter(c=>c.fix&&c.level==='warn');
    if(warns.length)h+=`<span class="compat-s-warn">⚠️ ${_ja?'注意':'Warn'}: ${warns.length}</span>`;
    if(fixWarns.length>1)h+=`<button class="btn btn-xs btn-s compat-fixlv" onclick="fixAllCompat('warn')">🔧 ${fixWarns.length}</button>`;
    const fixErrs=compat.filter(c=>c.fix&&c.level==='error');
    if(errs.length)h+=`<span class="compat-s-err">❌ ${_ja?'要修正':'Fix'}: ${errs.length}</span>`;
    if(fixErrs.length>1)h+=`<button class="btn btn-xs btn-s compat-fixlv" onclick="fixAllCompat('error')">🔧 ${fixErrs.length}</button>`;
    if(infos.length)h+=`<span class="compat-s-info">ℹ️ ${_ja?'参考':'Info'}: ${infos.length}</span>`;
    const fixable=compat.filter(c=>c.fix);
    if(fixable.length>1)h+=`<button class="btn btn-xs btn-p compat-fixall" onclick="fixAllCompat()">🔧 ${_ja?'一括修正 ('+fixable.length+'件)':'Fix All ('+fixable.length+')'}</button>`;
    h+='</div>';
    compat.forEach(c=>{
      const icon=c.level==='error'?'❌':c.level==='warn'?'⚠️':'ℹ️';
      const cls=c.level==='error'?'compat-error':c.level==='warn'?'compat-warn':'compat-info';
      const pair=c.pair.map(p=>{const n={frontend:'FE',backend:'BE',database:'DB',deploy:'Deploy',mobile:'Mobile',orm:'ORM',ai_auto:'AI',skill_level:'Skill',payment:'Pay',dev_methods:'DevMethod',auth:'Auth',scope_out:'Scope',data_entities:'Entity',purpose:'Purpose',mvp_features:'MVP'};return n[p]||p;}).join(' ↔ ');
      h+=`<div class="${cls}"><span class="compat-pair">${pair}</span><span class="compat-msg">${c.msg}</span>`;
      if(c.fix)h+=`<button class="btn btn-xs btn-s compat-fix" onclick="S.answers['${c.fix.f}']='${c.fix.s}';save();showDashboard();">→ ${c.fix.s}</button>`;
      h+='</div>';
    });
  }
  h+='<h4 class="dash-h4-mt">'+(_ja?'📐 プロジェクト複雑度':'📐 Project Complexity')+'</h4>';
  h+=getComplexityHTML();
  
  // Project health score
  h+=getHealthHTML(_ja,fileCount,answered);

  // File Dependency Tree
  if(fileCount>0){
    h+=`<h4 class="dash-h4-mt">🔗 ${_ja?'ファイル依存関係':'File Dependencies'}</h4>`;
    const groups=[
      {id:'spec',icon:'📋',title:_ja?'仕様理解フロー':'Spec Flow',files:[
        {p:'.spec/constitution.md',l:_ja?'原則(最初に読む)':'Principles (read first)',d:0},
        {p:'.spec/specification.md',l:_ja?'要件定義':'Requirements',d:1},
        {p:'.spec/technical-plan.md',l:_ja?'技術計画':'Technical Plan',d:1},
        {p:'.spec/tasks.md',l:_ja?'タスク分解':'Tasks',d:2},
        {p:'.spec/verification.md',l:_ja?'完了基準':'Acceptance',d:2}
      ]},
      {id:'ai',icon:'🤖',title:_ja?'AI開発フロー':'AI Dev Flow',files:[
        {p:'CLAUDE.md',l:_ja?'AI設定(自動読込)':'AI config (auto-loaded)',d:0},
        {p:'AI_BRIEF.md',l:_ja?'要約(最初の投入)':'Brief (first input)',d:1},
        {p:'AGENTS.md',l:_ja?'Agent役割定義':'Agent roles',d:1},
        {p:'.cursor/rules',l:_ja?'Cursorルール':'Cursor rules',d:1},
        {p:'skills/project.md',l:_ja?'スキル定義':'Skills',d:2}
      ]},
      {id:'qa',icon:'🧪',title:_ja?'品質・テストフロー':'QA & Test Flow',files:[
        {p:'docs/28_qa_strategy.md',l:_ja?'QA戦略':'QA Strategy',d:0},
        {p:'docs/32_qa_blueprint.md',l:_ja?'QA設計図':'QA Blueprint',d:1},
        {p:'docs/33_test_matrix.md',l:_ja?'テストマトリクス':'Test Matrix',d:1},
        {p:'docs/36_test_strategy.md',l:_ja?'テスト戦略':'Test Strategy',d:1},
        {p:'docs/37_bug_prevention.md',l:_ja?'バグ防止':'Bug Prevention',d:2}
      ]},
      {id:'rev',icon:'🔄',title:_ja?'ゴール逆算フロー':'Reverse Flow',files:[
        {p:'docs/29_reverse_engineering.md',l:_ja?'ゴール定義':'Goal Definition',d:0},
        {p:'docs/30_goal_decomposition.md',l:_ja?'ゴール分解':'Goal Breakdown',d:1},
        {p:'docs/39_implementation_playbook.md',l:_ja?'実装パターン':'Impl Patterns',d:2},
        {p:'docs/40_ai_dev_runbook.md',l:_ja?'AI運用手順':'AI Runbook',d:2}
      ]}
    ];
    groups.forEach(g=>{
      const count=g.files.filter(f=>S.files[f.p]).length;
      h+=`<div class="fdep-group"><div class="fdep-header" onclick="toggleFdep('${g.id}')"><span class="fdep-icon">▶</span><span class="fdep-title">${g.icon} ${g.title}</span><span class="fdep-count">${count}/${g.files.length}</span></div>`;
      h+=`<div class="fdep-body" id="fdep-${g.id}">`;
      g.files.forEach(f=>{
        const exists=!!S.files[f.p];
        const ind='fdep-ind-'+f.d;
        h+=`<div class="fdep-item ${ind} ${exists?'fdep-exists':'fdep-missing'}">`;
        if(exists)h+=`<a href="#" onclick="event.preventDefault();previewFile('${f.p}')">● ${f.l}</a>`;
        else h+=`<span>○ ${f.l}</span>`;
        h+=`</div>`;
      });
      h+=`</div></div>`;
    });
  }

  // File size distribution by Pillar
  if(Object.keys(S.files).length>0){
    const pillarMap={'.spec/':'P1 SDD','.devcontainer/':'P2 DevContainer','mcp-config':'P3 MCP','.cursor/':'P4 AI Rules','.clinerules':'P4','.windsurfrules':'P4','.gemini/':'P4','.github/':'P4','CLAUDE.md':'P4','AGENTS.md':'P4','codex-instructions':'P4','.kiro/':'P4','skills/':'P4','roadmap/':'P7 Roadmap','docs/':'Docs','README.md':'Common','.gitignore':'Common','LICENSE':'Common','package.json':'Common','.ai/':'Common','.mcp/':'P3 MCP'};
    const pillarSizes={};
    Object.entries(S.files).forEach(([p,c])=>{
      let pil='Other';
      for(const[k,v]of Object.entries(pillarMap)){if(p.startsWith(k)||p.includes(k)){pil=v;break;}}
      pillarSizes[pil]=(pillarSizes[pil]||0)+c.length;
    });
    const sorted=Object.entries(pillarSizes).sort((a,b)=>b[1]-a[1]);
    const max=sorted[0]?sorted[0][1]:1;
    const pillarColors={'P1 SDD':'var(--accent)','P2 DevContainer':'var(--accent-2)','P3 MCP':'var(--success)','P4 AI Rules':'var(--warn)','P5 Quality':'var(--danger)','P7 Roadmap':'var(--danger)','P9 Design System':'var(--accent)','P10 Reverse Eng':'var(--success)','P11 Impl Intelligence':'var(--accent-2)','Docs':'var(--layer-5)','Common':'var(--text-3)'};
    h+='<h4 class="dash-h4-mt">'+(_ja?'📦 ファイルサイズ分布':'📦 File Size Distribution')+'</h4>';
    h+='<div class="fsize-chart">';
    sorted.forEach(([pil,sz])=>{
      const pct=Math.round(sz/max*100);
      const kb=(sz/1024).toFixed(1);
      const col=pillarColors[pil]||'var(--text-3)';
      h+=`<div class="fsize-row"><span class="fsize-lbl">${pil}</span><div class="fsize-bar-wrap"><div class="fsize-bar" style="width:${pct}%;background:${col}"></div></div><span class="fsize-val">${kb}KB</span></div>`;
    });
    h+='</div>';
  }
  
  // Tech DB button
  h+=`<div class="dash-center"><button class="btn btn-s" onclick="renderTechDB()">📊 ${_ja?'技術マスターテーブル':'Tech Master Table'} (${TECH_DB.length} ${_ja?'エントリ':'entries'})</button></div>`;
  
  body.innerHTML=h;
}

function getHealthHTML(_ja,fileCount,answered){
  const qs=getQ();
  let totalQ=0;
  for(let p=1;p<=3;p++){
    if(qs[p])qs[p].questions.forEach(q=>{
      if(!isQActive(q))return;
      totalQ++;
    });
  }
  const answerPct=totalQ?Math.round(answered/totalQ*100):0;
  // Pillar coverage
  const pillarChecks=[
    {key:'.spec/',label:_ja?'①SDD':'①SDD'},
    {key:'.devcontainer/',label:_ja?'②DevContainer':'②DevContainer'},
    {key:'mcp',label:_ja?'③MCP':'③MCP'},
    {key:'CLAUDE.md',label:_ja?'④AIルール':'④AI Rules'},
    {key:'docs/32_',label:_ja?'⑤品質インテリジェンス':'⑤Quality Intelligence'},
    {key:'roadmap/',label:_ja?'⑦ロードマップ':'⑦Roadmap'},
    {key:'docs/26_',label:_ja?'⑨デザインシステム':'⑨Design System'},
    {key:'docs/29_',label:_ja?'⑩リバースEng':'⑩Reverse Eng'},
    {key:'docs/39_',label:_ja?'⑪実装ガイド':'⑪Impl Guide'},
  ];
  const fileKeys=Object.keys(S.files);
  let pillarOK=0;
  const pillarResults=pillarChecks.map(pc=>{
    const ok=fileKeys.some(f=>f.includes(pc.key));
    if(ok)pillarOK++;
    return {label:pc.label,ok};
  });
  const pillarPct=pillarChecks.length?Math.round(pillarOK/pillarChecks.length*100):0;
  // Required files
  const requiredFiles=['constitution.md','tasks.md','CLAUDE.md'];
  let reqOK=0;
  const reqResults=requiredFiles.map(rf=>{
    const ok=fileKeys.some(f=>f.endsWith(rf));
    if(ok)reqOK++;
    return {name:rf,ok};
  });
  const reqPct=requiredFiles.length?Math.round(reqOK/requiredFiles.length*100):0;
  // Overall score
  const score=Math.round(answerPct*0.3+pillarPct*0.4+reqPct*0.3);
  const color=score>=80?'var(--success)':score>=50?'var(--warn)':'var(--danger)';
  const label=score>=80?(_ja?'✅ 良好':'✅ Healthy'):score>=50?(_ja?'⚠️ 部分的':'⚠️ Partial'):(_ja?'🔴 不完全':'🔴 Incomplete');
  let h=`<h4 class="dash-h4-mt">🏥 ${_ja?'プロジェクト健全性':'Project Health'}</h4>`;
  h+=`<div class="complexity-card"><div class="complexity-header"><div><div class="dash-total complexity-label">${label}</div></div><div class="complexity-score" style="background:${color}20;color:${color};">${score}</div></div>`;
  h+=`<div class="complexity-bar"><div class="complexity-fill" style="width:${score}%;background:${color};"></div></div>`;
  h+=`<div class="complexity-grid">`;
  h+=`<div class="complexity-item"><span>${_ja?'回答完了率':'Answers'}</span><span>${answerPct}%</span></div>`;
  h+=`<div class="complexity-item"><span>${_ja?'Pillarカバー':'Pillar Coverage'}</span><span>${pillarOK}/${pillarChecks.length}</span></div>`;
  h+=`<div class="complexity-item"><span>${_ja?'必須ファイル':'Required Files'}</span><span>${reqOK}/${requiredFiles.length}</span></div>`;
  h+=`<div class="complexity-item"><span>${_ja?'生成ファイル数':'Total Files'}</span><span>${fileCount}</span></div>`;
  h+=`</div>`;
  // Detail items
  if(score<100){
    h+=`<div class="dash-total dash-total-mt">`;
    pillarResults.filter(r=>!r.ok).forEach(r=>{h+=`<span>❌ ${r.label} </span>`;});
    reqResults.filter(r=>!r.ok).forEach(r=>{h+=`<span>❌ ${r.name} </span>`;});
    if(answerPct<100)h+=`<span>⚠️ ${totalQ-answered} ${_ja?'件未回答':'unanswered'}</span>`;
    h+=`</div>`;
  }
  h+=`</div>`;
  return h;
}

/* ── Tech Master Table ── */
function renderTechDB(){
  pushView({pillar:5,type:'techdb',file:null});
  const body=$('prevBody');
  const _ja=S.lang==='ja';const cats=_ja?{lang:'言語',front:'フロント',mobile:'モバイル',back:'バックエンド',baas:'BaaS',payment:'決済/CMS/EC',devops:'DevOps',ai:'AIツール',ai_auto:'AI自律',method:'手法',test:'テスト',api:'API',build:'ビルド',data:'データ',security:'セキュリティ'}:{lang:'Language',front:'Frontend',mobile:'Mobile',back:'Backend',baas:'BaaS',payment:'Payment/CMS/EC',devops:'DevOps',ai:'AI Tools',ai_auto:'AI Autonomous',method:'Methods',test:'Testing',api:'API',build:'Build',data:'Data',security:'Security'};
  
  let h=`<div class="dash-head"><h3>📊 ${_ja?'技術マスターテーブル':'Tech Master Table'}</h3><p>${TECH_DB.length}${_ja?'エントリ — フィルタで絞り込み':'entries — use filters to narrow down'}</p></div>`;
  h+=`<div class="tech-filter">
    <select id="tfCat" onchange="filterTechDB()"><option value="">${_ja?'全カテゴリ':'All Categories'}</option>${Object.entries(cats).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select>
    <select id="tfReq" onchange="filterTechDB()"><option value="">${_ja?'全必須度':'All Levels'}</option><option value="required">${_ja?'必須':'Required'}</option><option value="recommended">${_ja?'推奨':'Recommended'}</option><option value="optional">${_ja?'選択':'Optional'}</option></select>
    <input id="tfSearch" placeholder="${_ja?'検索...':'Search...'}" oninput="filterTechDB()">
    <span id="tfCount" class="dash-tfcount">${TECH_DB.length}${_ja?'件':' items'}</span>
  </div>`;
  h+=`<div class="dash-tbl-wrap"><table class="tech-table"><thead><tr><th>${_ja?'技術名':'Tech'}</th><th>${_ja?'カテゴリ':'Category'}</th><th>${_ja?'種別':'Type'}</th><th>${_ja?'必須度':'Required'}</th><th>${_ja?'レベル':'Level'}</th></tr></thead><tbody id="techTbody">`;
  TECH_DB.forEach(t=>{
    const reqClass='req-'+t.req.replace(/\d$/,'');
    h+=`<tr data-cat="${t.cat}" data-req="${t.req}" data-name="${t.name.toLowerCase()}"><td><strong>${t.name}</strong>${t.price?' <span class="dash-price">'+priceLabel(t.price)+'</span>':''}</td><td>${cats[t.cat]||t.cat}</td><td>${t.sub}</td><td><span class="req-badge ${reqClass}">${reqLabel(t.req)}</span></td><td>${t.level}</td></tr>`;
  });
  h+='</tbody></table></div>';
  h+=`<div class="dash-back"><button class="btn btn-s" onclick="showDashboard()">← ${_ja?'ダッシュボード':'Dashboard'}</button></div>`;
  body.innerHTML=h;
}

function filterTechDB(){
  const _ja=S.lang==='ja';
  const cat=$('tfCat').value;const req=$('tfReq').value;const search=$('tfSearch').value.toLowerCase();
  const rows=document.querySelectorAll('#techTbody tr');let count=0;
  rows.forEach(r=>{
    const show=(!cat||r.dataset.cat===cat)&&(!req||r.dataset.req.includes(req))&&(!search||r.dataset.name.includes(search));
    r.style.display=show?'':'none';if(show)count++;
  });
  $('tfCount').textContent=count+(_ja?'件':' items');
}

function fixAllCompat(level){
  const _ja=S.lang==='ja';
  const compat=checkCompat(S.answers);
  const fixable=compat.filter(c=>c.fix&&(!level||c.level===level));
  if(fixable.length===0)return;
  fixable.forEach(c=>{S.answers[c.fix.f]=c.fix.s;});
  save();
  toast(_ja?'🔧 '+fixable.length+'件の問題を修正しました':'🔧 Fixed '+fixable.length+' issue(s)');
  showDashboard();
}

function toggleFdep(id){
  const body=$('fdep-'+id);
  if(!body)return;
  const header=body.previousElementSibling;
  const icon=header.querySelector('.fdep-icon');
  const isOpen=body.classList.contains('fdep-open');
  body.classList.toggle('fdep-open');
  if(icon)icon.textContent=isOpen?'▶':'▼';
}

/* ── Interactive Roadmap UI (Enhanced) ── */
function showRoadmapUI(){
  pushView({pillar:6,type:'roadmap',file:null});
  const _ja=S.lang==='ja';
  const body=$('prevBody');
  if(!S.files['roadmap/LEARNING_PATH.md']){
    body.innerHTML='<p class="dash-empty">'+(_ja?'ファイル生成後に利用可能です':'Available after file generation')+'</p>';return;
  }
  const a=S.answers;
  const level=a.skill_level||'Intermediate';
  const isB=level.includes('Beginner');const isP=level.includes('Professional');
  const timeMul=isB?2.0:isP?0.5:1.0;
  const mob=a.mobile||(_ja?'なし':'None');const ai=a.ai_auto||(_ja?'なし':'None');const pay=a.payment||(_ja?'なし':'None');const noMob=mob==='なし'||mob==='None';const noAI=ai==='なし'||ai==='None';const noPay=pay==='なし'||pay==='None';
  const fe=a.frontend||'React + Next.js';const be=a.backend||'Node.js + Express';const dep=a.deploy||'Vercel';

  /* ── Resource lookups ── */
  function res(key){return RESOURCES[key]||null;}
  function feRes(){if(fe.includes('Vue'))return res('vue');if(fe.includes('Svelte'))return res('svelte');if(fe.includes('Astro'))return res('astro');if(fe.includes('Vite'))return res('react');return res('nextjs');}
  function beRes(){if(be.includes('Fastify'))return res('fastify');if(be.includes('NestJS'))return res('nestjs');if(be.includes('FastAPI'))return res('fastapi');if(be.includes('Django'))return res('django');if(be.includes('Spring'))return res('spring');if(be.includes('Go'))return res('go');if(be.includes('Hono'))return res('hono');if(be.includes('Firebase'))return res('firebase');if(be.includes('Supabase'))return res('supabase');return res('express');}
  function depRes(){if(dep.includes('Cloudflare'))return res('cloudflare');if(dep.includes('Railway'))return res('railway');return res('vercel');}
  function authRes(){const au=a.auth||'';if(au.includes('Clerk'))return res('clerk');if(au.includes('Supabase'))return res('supabase');return res('nextauth');}
  function methRes(m){if(m.includes('BDD'))return res('bdd');if(m.includes('DDD'))return res('ddd');return res('tdd');}

  /* ── Build layers with hrs + res ── */
  const layers=[
    {name:_ja?'Layer 1: Web基盤':'Layer 1: Web Fundamentals',color:'var(--layer-1)',items:[
      {text:_ja?'HTML5 / CSS3基礎':'HTML5 / CSS3 Basics',wk:isB?'Week 1-4':'Week 1',hrs:isB?40:8,res:res('html')},
      {text:'Tailwind CSS',wk:isB?'Week 3-8':'Week 1-2',hrs:isB?20:6,res:res('tailwind')},
      {text:'JavaScript ES6+ / TypeScript',wk:isB?'Week 5-12':'Week 1-2',hrs:isB?60:8,res:res('js')},
    ]},
    {name:_ja?'Layer 2: フロントエンド':'Layer 2: Frontend',color:'var(--layer-2)',items:[
      {text:fe+(_ja?' セットアップ':' Setup'),hrs:8,res:feRes()},
      {text:_ja?'shadcn/ui + コンポーネント設計':'shadcn/ui + Component Design',hrs:12,res:res('shadcn')},
      {text:_ja?'状態管理 (Zustand/Redux)':'State Management (Zustand/Redux)',hrs:10,res:res('zustand')},
      {text:'React Query / SWR',hrs:6,res:res('rquery')},
      {text:_ja?'テスト (Vitest + Playwright)':'Testing (Vitest + Playwright)',hrs:12,res:res('vitest')},
    ]},
    {name:_ja?'Layer 3: バックエンド':'Layer 3: Backend',color:'var(--layer-3)',items:[
      {text:be+(_ja?' セットアップ':' Setup'),hrs:8,res:beRes()},
      {text:_ja?'データベース設計 + ORM':'Database Design + ORM',hrs:16,res:res('prisma')},
      {text:_ja?'REST API / tRPC 実装':'REST API / tRPC Implementation',hrs:16,res:beRes()},
      {text:(_ja?'認証・認可':'Auth & Authorization')+' ('+(a.auth||'NextAuth')+')',hrs:12,res:authRes()},
    ]},
  ];
  if(!noMob) layers.push({name:_ja?'Layer 3.5: モバイル':'Layer 3.5: Mobile',color:'var(--layer-3h)',items:[
    {text:mob+(_ja?' 環境構築':' Setup'),hrs:10,res:mob.includes('Flutter')?res('flutter'):mob.includes('bare')?res('rn'):res('expo')},
    {text:_ja?'ナビゲーション・画面設計':'Navigation & Screen Design',hrs:12,res:mob.includes('Flutter')?res('flutter'):res('expo')},
    {text:_ja?'ネイティブ機能':'Native Features',hrs:10,res:mob.includes('Flutter')?res('flutter'):res('expo')},
    {text:_ja?'EASビルド・ストア提出':'EAS Build & Store Submit',hrs:8,res:res('expo')},
  ]});
  layers.push({name:'Layer 4: DevOps',color:'var(--layer-4)',items:[
    {text:'Docker + DevContainer',hrs:8,res:res('docker')},
    {text:'GitHub Actions CI/CD',hrs:8,res:res('ghactions')},
    {text:dep+(_ja?' デプロイ':' Deploy'),hrs:4,res:depRes()},
  ]});
  layers.push({name:_ja?'Layer 5: AI駆動開発':'Layer 5: AI-Driven Dev',color:'var(--layer-5)',items:[
    {text:_ja?'AI IDEセットアップ ('+((a.ai_tools||'Cursor').split(', ').slice(0,3).join(' / '))+')':'AI IDE Setup ('+((a.ai_tools||'Cursor').split(', ').slice(0,3).join(' / '))+')',hrs:4,res:res((a.ai_tools||'').includes('Antigravity')?'antigravity':'cursor')},
    {text:_ja?'MCP設定・活用':'MCP Configuration',hrs:6,res:res('mcp')},
    {text:_ja?'AI Agent Rules最適化':'AI Agent Rules Optimization',hrs:4,res:res('claudecode')},
    ...(!noAI?[{text:ai+(_ja?' 実践':' Practice'),hrs:8,res:res('cursor')}]:[]),
  ]});
  if(!noPay) layers.push({name:_ja?'Layer 6: 収益化':'Layer 6: Monetization',color:'var(--layer-6)',items:[
    {text:pay+(_ja?' 実装':' Implementation'),hrs:12,res:res('stripe')},
    {text:_ja?'課金フロー構築':'Billing Flow',hrs:10,res:res('stripe')},
  ]});
  layers.push({name:_ja?'Layer 7: 駆動開発手法':'Layer 7: Dev Methodologies',color:'var(--layer-7)',items:(a.dev_methods||'TDD').split(', ').map(m=>({text:m+(_ja?' 実践':' Practice'),hrs:8,res:methRes(m)}))});

  /* Apply time multiplier */
  layers.forEach(l=>l.items.forEach(it=>{if(!it.wk)it.hrs=Math.round((it.hrs||8)*timeMul);}));

  /* ── Load saved progress ── */
  const roadState=JSON.parse((_lsGet('devforge-road-'+S.projectName))||'{}');
  const collapseState=JSON.parse((_lsGet('devforge-road-col-'+S.projectName))||'{}');
  layers.forEach((l,li)=>l.items.forEach((item,ii)=>{item.done=!!roadState[li+'_'+ii];}));

  const totalItems=layers.reduce((s,l)=>s+l.items.length,0);
  const doneItems=layers.reduce((s,l)=>s+l.items.filter(i=>i.done).length,0);
  const pct=totalItems?Math.round(doneItems/totalItems*100):0;
  const totalHrs=layers.reduce((s,l)=>s+l.items.reduce((a,i)=>a+(i.hrs||0),0),0);
  const doneHrs=layers.reduce((s,l)=>s+l.items.filter(i=>i.done).reduce((a,i)=>a+(i.hrs||0),0),0);
  const remainHrs=totalHrs-doneHrs;

  /* ── Milestones ── */
  const milestones=[
    {at:25,icon:'🌱',ja:'学習開始！基盤を構築中',en:'Journey started! Building foundations'},
    {at:50,icon:'🔥',ja:'半分達成！勢いに乗っています',en:'Halfway there! Great momentum'},
    {at:75,icon:'⚡',ja:'あと少し！ゴールが見えてきました',en:'Almost there! The finish line is in sight'},
    {at:100,icon:'🏆',ja:'全完了！おめでとうございます！',en:'All complete! Congratulations!'},
  ];
  const activeMilestone=milestones.filter(m=>pct>=m.at).pop();

  /* ── Render ── */
  let h=`<div class="dash-head"><h3>${_ja?'🗺️ インタラクティブロードマップ':'🗺️ Interactive Roadmap'}</h3><p>${_ja?'チェックして進捗管理':'Track progress by checking items'} — ${level}</p></div>`;

  /* Progress + Time */
  h+=`<div class="road-progress"><h4>${_ja?'📈 全体進捗':'📈 Overall Progress'}</h4>
    <div class="road-progress-bar"><div class="road-progress-fill" style="width:${pct}%"></div></div>
    <div class="road-pct">${pct}% <span class="road-pct-sub">(${doneItems}/${totalItems})</span></div>
    <div class="road-time">⏱️ ${_ja?'残り推定':'Est. remaining'}: <strong>${remainHrs}h</strong> / ${totalHrs}h ${_ja?'(×'+timeMul+' '+level+')':''}</div>
    ${activeMilestone?`<div class="road-milestone">${activeMilestone.icon} ${_ja?activeMilestone.ja:activeMilestone.en}</div>`:''}
  </div>`;

  /* Layers */
  layers.forEach((l,li)=>{
    const layerDone=l.items.filter(i=>i.done).length;
    const layerPct=l.items.length?Math.round(layerDone/l.items.length*100):0;
    const layerHrsLeft=l.items.filter(i=>!i.done).reduce((a,i)=>a+(i.hrs||0),0);
    /* C. Dependency: previous layer must be >=80% */
    const prevPct=li>0?(()=>{const pl=layers[li-1];const pd=pl.items.filter(i=>i.done).length;return pl.items.length?Math.round(pd/pl.items.length*100):100;})():100;
    const locked=prevPct<80;
    /* A. Collapse */
    const collapsed=!!collapseState[li]||(layerPct===100&&!collapseState['_open_'+li]);

    h+=`<div class="road-layer${locked?' road-locked':''}" data-li="${li}">`;
    h+=`<h3 style="background:${l.color}20;color:${l.color};" class="road-layer-head" onclick="toggleRoadCollapse(${li})">`;
    h+=`<span class="road-collapse-icon">${collapsed?'▶':'▼'}</span> `;
    h+=locked?'🔒 ':'';
    h+=`${l.name} <span class="road-layer-pct">${layerPct}%</span>`;
    if(layerPct===100)h+=' 🏆';
    h+=`<span class="road-layer-hrs">${layerHrsLeft>0?(layerHrsLeft+'h'):(_ja?'完了':'Done')}</span>`;
    h+=`</h3>`;

    if(locked){
      h+=`<div class="road-lock-msg">${_ja?'🔒 前レイヤーを80%以上完了すると解放されます':'🔒 Complete previous layer to 80%+ to unlock'} (${prevPct}%)</div>`;
    }

    h+=`<div class="road-items${collapsed?' road-collapsed':''}" id="roadItems${li}">`;
    l.items.forEach((item,ii)=>{
      const id=li+'_'+ii;
      const disabled=locked?' disabled':'';
      h+=`<div class="road-task ${item.done?'checked':''}${locked?' road-task-locked':''}" ${locked?'':'onclick="toggleRoadItem2(\''+id+'\',this)"'}>`;
      h+=`<input type="checkbox" ${item.done?'checked':''}${disabled} ${locked?'':'onclick="event.stopPropagation();toggleRoadItem2(\''+id+'\',this.parentElement)"'}>`;
      h+=`<span>${item.text}</span>`;
      if(item.hrs)h+=`<span class="road-hrs-badge">${item.hrs}h</span>`;
      if(item.wk)h+=`<span class="road-week-badge">${item.wk}</span>`;
      if(item.res)h+=`<a class="road-res-btn" href="${item.res.u}" target="_blank" rel="noopener" onclick="event.stopPropagation()" title="${item.res.n}">📖</a>`;
      h+=`</div>`;
    });
    h+=`</div></div>`;
  });

  h+=`<div class="road-actions">
    <button class="btn btn-s" onclick="resetRoadmap2()">${_ja?'🔄 リセット':'🔄 Reset'}</button>
    <button class="btn btn-s" onclick="expandAllRoadLayers()">${_ja?'📂 全展開':'📂 Expand All'}</button>
    <button class="btn btn-s" onclick="exportRoadmapMD()">${_ja?'📋 Markdownコピー':'📋 Copy Markdown'}</button>
  </div>`;
  body.innerHTML=h;
  /* Store layers for export */
  window._roadLayers=layers;
}

function toggleRoadItem2(id,el){
  el.classList.toggle('checked');
  const cb=el.querySelector('input[type="checkbox"]');
  if(cb)cb.checked=el.classList.contains('checked');
  const roadState=JSON.parse((_lsGet('devforge-road-'+S.projectName))||'{}');
  roadState[id]=el.classList.contains('checked');
  _lsSet('devforge-road-'+S.projectName,JSON.stringify(roadState));
  /* Update progress bar */
  const tasks=document.querySelectorAll('.road-task:not(.road-task-locked)');
  const done=document.querySelectorAll('.road-task.checked:not(.road-task-locked)');
  const pct=tasks.length?Math.round(done.length/tasks.length*100):0;
  const bar=document.querySelector('.road-progress-fill');if(bar)bar.style.width=pct+'%';
  const pctEl=document.querySelector('.road-pct');if(pctEl)pctEl.innerHTML=`${pct}% <span class="road-pct-sub">(${done.length}/${tasks.length})</span>`;
  /* Check layer completion & milestone */
  const li=id.split('_')[0];
  const layer=document.querySelector('.road-layer[data-li="'+li+'"]');
  if(layer){
    const lt=layer.querySelectorAll('.road-task');const ld=layer.querySelectorAll('.road-task.checked');
    const lp=lt.length?Math.round(ld.length/lt.length*100):0;
    const hdr=layer.querySelector('.road-layer-pct');if(hdr)hdr.textContent=lp+'%';
    /* Badge animation on layer 100% */
    if(lp===100&&!layer.querySelector('.road-badge-anim')){
      const badge=document.createElement('span');badge.className='road-badge-anim';badge.textContent='🏆';
      const h3=layer.querySelector('h3');if(h3)h3.appendChild(badge);
    }
  }
  /* Check milestone */
  const _ja=S.lang==='ja';
  const ms=[{at:25,icon:'🌱',t:_ja?'25% 達成！':'25% reached!'},{at:50,icon:'🔥',t:_ja?'50% 達成！':'50% reached!'},{at:75,icon:'⚡',t:_ja?'75% 達成！':'75% reached!'},{at:100,icon:'🏆',t:_ja?'全完了！🎉':'All complete! 🎉'}];
  const prev=parseInt(roadState._lastPct||'0');
  ms.forEach(m=>{if(pct>=m.at&&prev<m.at)toast(m.icon+' '+m.t);});
  roadState._lastPct=pct;
  _lsSet('devforge-road-'+S.projectName,JSON.stringify(roadState));
  /* Re-check dependency locks (full re-render for simplicity) */
  clearTimeout(window._roadDebounce);
  window._roadDebounce=setTimeout(()=>showRoadmapUI(),300);
}

function toggleRoadCollapse(li){
  const colState=JSON.parse((_lsGet('devforge-road-col-'+S.projectName))||'{}');
  const items=$('roadItems'+li);
  if(!items)return;
  const isCollapsed=items.classList.contains('road-collapsed');
  items.classList.toggle('road-collapsed');
  const icon=items.parentElement.querySelector('.road-collapse-icon');
  if(icon)icon.textContent=isCollapsed?'▼':'▶';
  if(isCollapsed){colState['_open_'+li]=true;delete colState[li];}
  else{colState[li]=true;delete colState['_open_'+li];}
  _lsSet('devforge-road-col-'+S.projectName,JSON.stringify(colState));
}

function expandAllRoadLayers(){
  _lsRm('devforge-road-col-'+S.projectName);
  showRoadmapUI();
}

function exportRoadmapMD(){
  const _ja=S.lang==='ja';
  const layers=window._roadLayers;if(!layers)return;
  let md='# '+(_ja?'ロードマップ':'Roadmap')+' — '+S.projectName+'\n\n';
  layers.forEach(l=>{
    const done=l.items.filter(i=>i.done).length;
    md+='## '+l.name+' ('+done+'/'+l.items.length+')\n';
    l.items.forEach(it=>{
      md+='- ['+(it.done?'x':' ')+'] '+it.text+(it.hrs?' ('+it.hrs+'h)':'')+(it.wk?' — '+it.wk:'')+'\n';
    });
    md+='\n';
  });
  navigator.clipboard.writeText(md).then(()=>toast(_ja?'✅ Markdownをコピーしました':'✅ Markdown copied')).catch(()=>toast(_ja?'❌ コピー失敗':'❌ Copy failed'));
}

function resetRoadmap2(){
  _lsRm('devforge-road-'+S.projectName);
  _lsRm('devforge-road-col-'+S.projectName);
  showRoadmapUI();
}

/* ── Template Save/Load ── */
