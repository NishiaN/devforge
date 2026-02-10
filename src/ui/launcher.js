/* ── Pillar ⑧ AI Prompt Launcher ── */
function showAILauncher(){
  const body=$('prevBody');const _ja=S.lang==='ja';
  const files=S.files;const fKeys=Object.keys(files);
  const hasFiles=fKeys.length>0;

  /* ── Token estimation per folder ── */
  const folders={};
  fKeys.forEach(k=>{
    const dir=k.includes('/')?k.split('/')[0]:'root';
    if(!folders[dir])folders[dir]={files:[],chars:0,tokens:0};
    folders[dir].files.push(k);
    const c=files[k].length;
    folders[dir].chars+=c;
    folders[dir].tokens+=Math.round(c/4);
  });
  const totalTokens=Object.values(folders).reduce((s,f)=>s+f.tokens,0);

  /* ── Prompt templates ── */
  const PT=_ja?{
    review:{icon:'🔍',label:'仕様レビュー',desc:'矛盾・不足・改善点を指摘',
      sys:'あなたは経験豊富なテックリード兼SDDアーキテクトです。',
      prompt:'以下の仕様書群をレビューしてください。矛盾、不足している要件、改善点を優先度付きで指摘してください。'},
    implement:{icon:'🚀',label:'MVP実装',desc:'仕様書からMVP開発開始',
      sys:'あなたはフルスタック開発者です。SDD仕様書に忠実に実装します。',
      prompt:'以下の仕様書を元に、MVP実装を開始してください。constitution.mdの設計原則に従い、tasks.mdの優先順位で進めてください。'},
    test:{icon:'🧪',label:'テスト生成',desc:'テストケース自動作成',
      sys:'あなたはQAエンジニアです。仕様書からテストケースを網羅的に作成します。',
      prompt:'以下の仕様書からテストケースを生成してください。正常系・異常系・境界値を網羅し、テストマトリクス形式で出力してください。'},
    refactor:{icon:'♻️',label:'リファクタ提案',desc:'構造改善と技術的負債の解消',
      sys:'あなたはコードレビュアーです。アーキテクチャの改善提案を行います。',
      prompt:'以下の仕様書の技術設計を分析し、リファクタリング提案をしてください。SOLID原則の違反、責務の分離不足、スケーラビリティの問題を指摘してください。'},
    security:{icon:'🔒',label:'セキュリティ監査',desc:'脆弱性とベストプラクティス',
      sys:'あなたはセキュリティエンジニアです。OWASP Top 10を基準に監査します。',
      prompt:'以下の仕様書のセキュリティ面を監査してください。認証・認可・データ保護・API安全性・インフラセキュリティの観点から脆弱性と改善策を提示してください。'},
    docs:{icon:'📝',label:'ドキュメント補完',desc:'不足文書の特定と生成',
      sys:'あなたはテクニカルライターです。開発ドキュメントの品質を高めます。',
      prompt:'以下の仕様書群を分析し、不足しているドキュメントを特定してください。API仕様の詳細化、シーケンス図の追加、デプロイ手順書の作成など、具体的に補完してください。'},
  }:{
    review:{icon:'🔍',label:'Spec Review',desc:'Find contradictions, gaps & improvements',
      sys:'You are an experienced tech lead and SDD architect.',
      prompt:'Review the following specs. Identify contradictions, missing requirements, and improvements with priority levels.'},
    implement:{icon:'🚀',label:'MVP Build',desc:'Start implementation from specs',
      sys:'You are a full-stack developer. You implement faithfully according to SDD specs.',
      prompt:'Start MVP implementation based on these specs. Follow the design principles in constitution.md and priorities in tasks.md.'},
    test:{icon:'🧪',label:'Test Generation',desc:'Auto-generate test cases',
      sys:'You are a QA engineer. You create comprehensive test cases from specifications.',
      prompt:'Generate test cases from these specs. Cover happy path, error cases, and edge cases in a test matrix format.'},
    refactor:{icon:'♻️',label:'Refactor Proposal',desc:'Architecture improvements & tech debt',
      sys:'You are a code reviewer focused on architecture improvements.',
      prompt:'Analyze the technical design in these specs and propose refactoring. Identify SOLID violations, separation of concerns issues, and scalability problems.'},
    security:{icon:'🔒',label:'Security Audit',desc:'Vulnerabilities & best practices',
      sys:'You are a security engineer. You audit against OWASP Top 10.',
      prompt:'Audit the security aspects of these specs. Assess authentication, authorization, data protection, API safety, and infrastructure security.'},
    docs:{icon:'📝',label:'Doc Completion',desc:'Identify missing docs & generate them',
      sys:'You are a technical writer focused on development documentation quality.',
      prompt:'Analyze these specs and identify missing documentation. Suggest detailed API specs, sequence diagrams, deployment guides, etc.'},
  };

  /* ── Header ── */
  let h=`<div class="exp-header"><h3>🤖 ${_ja?'AI プロンプトランチャー':'AI Prompt Launcher'}</h3>
  <p>${_ja
    ?'生成した仕様書をAIツールに一括投入。テンプレートを選んでコピー'
    :'Feed generated specs to AI tools. Pick a template and copy'}</p></div>`;

  /* ── Token overview ── */
  if(hasFiles){
    h+=`<div class="launch-stats">
      <div class="launch-stat"><span class="launch-num">${fKeys.length}</span><span class="launch-lbl">${_ja?'ファイル':'Files'}</span></div>
      <div class="launch-stat"><span class="launch-num">${totalTokens.toLocaleString()}</span><span class="launch-lbl">${_ja?'推定トークン':'Est. Tokens'}</span></div>
      <div class="launch-stat"><span class="launch-num">${Object.keys(folders).length}</span><span class="launch-lbl">${_ja?'フォルダ':'Folders'}</span></div>
    </div>`;

    /* ── Folder breakdown ── */
    h+=`<div class="launch-folders"><h4>${_ja?'📂 フォルダ別トークン':'📂 Tokens by Folder'}</h4>`;
    const sortedDirs=Object.entries(folders).sort((a,b)=>b[1].tokens-a[1].tokens);
    sortedDirs.forEach(([dir,info])=>{
      const pct=Math.round(info.tokens/totalTokens*100);
      h+=`<div class="launch-folder-row">
        <label><input type="checkbox" checked data-dir="${dir}" onchange="updateLaunchPreview()"> <strong>${dir}/</strong></label>
        <span>${info.files.length} ${_ja?'ファイル':'files'} · ${info.tokens.toLocaleString()} tok (${pct}%)</span>
        <div class="launch-bar"><div class="launch-bar-fill" style="width:${pct}%"></div></div>
      </div>`;
    });
    h+=`</div>`;

    /* ── Model fit indicator ── */
    const models=[
      {name:'Claude Opus 4.6',ctx:1000000,icon:'🟣'},
      {name:'Claude Sonnet 4.5',ctx:200000,icon:'🔵'},
      {name:'GPT-5.2',ctx:400000,icon:'🟢'},
      {name:'Gemini 2.5 Pro',ctx:1000000,icon:'🟡'},
      {name:'Claude Haiku 4.5',ctx:200000,icon:'🟣'},
      {name:'Gemini 3 Flash',ctx:200000,icon:'🟡'},
    ];
    h+=`<div class="launch-models"><h4>${_ja?'🤖 モデル適合':'🤖 Model Fit'}</h4>`;
    models.forEach(m=>{
      const pct=Math.min(100,Math.round(totalTokens/m.ctx*100));
      const ok=pct<80;
      h+=`<div class="launch-model-row">${m.icon} ${m.name} <span class="launch-model-pct ${ok?'launch-ok':'launch-warn'}">${pct}% ${ok?(_ja?'余裕':'OK'):(pct<100?(_ja?'注意':'tight'):(_ja?'超過':'over'))}</span></div>`;
    });
    h+=`</div>`;
  } else {
    h+=`<div class="empty-preview-sm">${_ja?'⚠️ まず質問に回答してファイルを生成してください':'⚠️ Answer questions first to generate files'}</div>`;
  }

  /* ── Prompt templates ── */
  h+=`<div class="launch-templates"><h4>${_ja?'📋 プロンプトテンプレート':'📋 Prompt Templates'}</h4>`;
  Object.entries(PT).forEach(([key,t])=>{
    h+=`<div class="launch-tpl" onclick="selectLaunchTemplate('${key}')">
      <div class="launch-tpl-icon">${t.icon}</div>
      <div class="launch-tpl-info"><strong>${t.label}</strong><span>${t.desc}</span></div>
    </div>`;
  });
  h+=`</div>`;

  /* ── Output area ── */
  h+=`<div class="launch-output" id="launchOutput">
    <div class="launch-output-head">
      <h4 id="launchOutputTitle"></h4>
      <div class="prev-toolbar-r">
        <button class="btn btn-xs btn-p" onclick="copyLaunchPrompt()">📋 ${_ja?'コピー':'Copy'}</button>
        <button class="btn btn-xs btn-g" onclick="$('launchOutput').style.display='none'">✕</button>
      </div>
    </div>
    <div class="launch-output-meta" id="launchOutputMeta"></div>
    <pre class="launch-output-pre" id="launchOutputPre"></pre>
  </div>`;

  body.innerHTML=h;

  /* ── State: store prompt templates for later use ── */
  window._launchPT=PT;
  window._launchFolders=folders;
  window._launchFiles=files;
}

/* ── Select prompt template ── */
function selectLaunchTemplate(key){
  const _ja=S.lang==='ja';
  const PT=window._launchPT;
  const t=PT[key];if(!t)return;
  const selectedFiles=getSelectedLaunchFiles();
  const content=selectedFiles.map(([k,v])=>`--- ${k} ---\n${v}`).join('\n\n');
  const selTokens=Math.round(content.length/4);

  const full=`[System]\n${t.sys}\n\n[Prompt]\n${t.prompt}\n\n---\n\n${content}`;

  const out=$('launchOutput');out.style.display='block';
  $('launchOutputTitle').textContent=`${t.icon} ${t.label}`;
  $('launchOutputMeta').textContent=`${selectedFiles.length} ${_ja?'ファイル':'files'} · ~${selTokens.toLocaleString()} tokens`;
  $('launchOutputPre').textContent=full.slice(0,2000)+(full.length>2000?`\n\n... (${_ja?'残り':'remaining'} ${(full.length-2000).toLocaleString()} chars)`:'');
  window._launchFullPrompt=full;
  out.scrollIntoView({behavior:'smooth',block:'nearest'});
}

/* ── Get selected files from checkboxes ── */
function getSelectedLaunchFiles(){
  const checks=document.querySelectorAll('.launch-folder-row input[type=checkbox]');
  const selectedDirs=new Set();
  checks.forEach(c=>{if(c.checked)selectedDirs.add(c.dataset.dir);});
  const files=window._launchFiles||S.files;
  return Object.entries(files).filter(([k])=>{
    const dir=k.includes('/')?k.split('/')[0]:'root';
    return selectedDirs.has(dir);
  });
}

/* ── Update preview when checkbox changes ── */
function updateLaunchPreview(){
  const sel=getSelectedLaunchFiles();
  const tokens=sel.reduce((s,e)=>s+Math.round(e[1].length/4),0);
  // Update stats if output is showing
  const meta=$('launchOutputMeta');
  if(meta&&$('launchOutput').style.display!=='none'){
    const _ja=S.lang==='ja';
    meta.textContent=`${sel.length} ${_ja?'ファイル':'files'} · ~${tokens.toLocaleString()} tokens`;
  }
}

/* ── Copy to clipboard ── */
function copyLaunchPrompt(){
  const _ja=S.lang==='ja';
  const text=window._launchFullPrompt;
  if(!text)return;
  navigator.clipboard.writeText(text).then(()=>{
    toast(_ja?'📋 プロンプトをコピーしました':'📋 Prompt copied to clipboard');
  }).catch(()=>{
    // Fallback
    const ta=document.createElement('textarea');ta.value=text;
    document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    toast(_ja?'📋 コピー完了':'📋 Copied');
  });
}
