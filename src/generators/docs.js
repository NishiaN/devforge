function genDocs21(a,pn){
  const G=S.genLang==='ja';
  const date=new Date().toISOString().split('T')[0];
  const ganttStart=new Date().toISOString().split('T')[0];
  const fe=a.frontend||'React';const be=a.backend||'Node.js';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const orm=resolveORM(a).name;
  const stripPri=s=>(s||'').replace(/\[P[0-2]\]\s*/g,'');
  const entities=(stripPri(a.data_entities)||'users, items').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
  const features=(stripPri(a.mvp_features)||(G?'CRUD操作':'CRUD')).split(', ').filter(Boolean);
  const screens=(stripPri(a.screens)||(G?'ダッシュボード, ログイン':'Dashboard, Login')).split(', ').filter(Boolean);
  const methods=(stripPri(a.dev_methods)||'TDD').split(', ').filter(Boolean);
  const target=(a.target||'').toLowerCase();
  const hasAdmin=/管理者|admin|管理/i.test(target)||features.some(f=>/管理ダッシュボード|admin/i.test(f));
  const hasInstructor=/講師|instructor|teacher/i.test(target);
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);

  // 1. Project Overview
  S.files['docs/01_project_overview.md']=`# ${pn} — ${G?'プロジェクト概要書':'Project Overview'}\n> ${date}\n\n${G?'## 目的':'## Purpose'}\n${a.purpose||'N/A'}\n\n${G?'## ターゲット':'## Target'}\n${a.target||'N/A'}\n\n${G?'## 成功指標':'## Success Metrics'}\n${a.success||'N/A'}\n\n${G?'## スケジュール':'## Schedule'}\n${a.dev_schedule||a.deadline||(G?'6ヶ月':'6 months')}\n\n## ${G?'技術スタック':'Tech Stack'}\n- Frontend: ${fe}\n- Backend: ${be}\n- DB: ${a.database||'PostgreSQL'}\n- Deploy: ${a.deploy||'Vercel'}`;

  // 2. Requirements
  S.files['docs/02_requirements.md']=`# ${pn} — ${G?'要件定義書':'Requirements'}\n> ${date}\n\n${G?'## 機能要件':'## Functional Requirements'}\n${features.map(f=>'- '+f).join('\n')}\n\n${G?'## 非機能要件':'## Non-functional'}\n- ${G?'レスポンス':'Response'}: ${S.skill==='pro'?'<200ms (p95)':S.skill==='intermediate'?'<500ms (p95)':'<1000ms (p95)'}\n- ${G?'可用性':'Availability'}: ${S.skill==='pro'?'99.9%':S.skill==='intermediate'?'99%':(G?'ベストエフォート':'Best effort')}\n- ${G?'セキュリティ':'Security'}: OWASP Top 10`;

  // 3. Architecture
  const archLabelD=G?{baas:'BaaS統合型',bff:'BFF（API Routes統合）',split:'FE/BE分離型',traditional:'従来型クライアント-サーバー'}[arch.pattern]:{baas:'BaaS Integration',bff:'BFF (API Routes)',split:'FE/BE Split',traditional:'Traditional Client-Server'}[arch.pattern];
  const layersD=arch.isBaaS?'1. Presentation Layer ('+fe+')\\n2. BaaS SDK Layer ('+be+')\\n3. Functions Layer (Edge/Cloud Functions)\\n4. Data Layer ('+(a.database||'PostgreSQL')+')':arch.pattern==='bff'?'1. Presentation Layer ('+fe+')\\n2. API Routes Layer (Next.js Route Handlers)\\n3. Domain Layer (Business Logic)\\n4. Data Layer ('+(a.database||'PostgreSQL')+')':'1. Presentation Layer ('+fe+')\\n2. Application Layer (API Routes)\\n3. Domain Layer (Business Logic)\\n4. Infrastructure Layer ('+(a.database||'PostgreSQL')+')';
  S.files['docs/03_architecture.md']=`# ${pn} — ${G?'アーキテクチャ設計書':'Architecture Design'}\n> ${date}\n\n${G?'## アーキテクチャパターン':'## Architecture Pattern'}\n${archLabelD}\n\n${G?'## システム構成図':'## System Diagram'}\n\n\`\`\`\n${arch.diagram}\n\`\`\`\n${arch.note?'\n> '+arch.note+'\n':''}\n${G?'## レイヤー構造':'## Layer Structure'}\n${layersD}`;

  // 4. ER Diagram (Mermaid erDiagram) — with rich columns from ENTITY_COLUMNS
  const erLines=[];
  entities.forEach(e=>{
    const cols=getEntityColumns(e,G,entities);
    const colLines=['    uuid id PK'];
    cols.forEach(c=>{
      const mT=c.type.includes('VARCHAR')?'string':c.type.includes('INT')||c.type.includes('DECIMAL')?'int':c.type.includes('BOOLEAN')?'boolean':c.type.includes('TIMESTAMP')||c.type.includes('DATE')||c.type.includes('TIME')?'timestamp':c.type.includes('JSONB')?'json':'string';
      const mC=c.constraint.includes('FK')?'FK':c.constraint.includes('UNIQUE')?'UK':'';
      colLines.push(`    ${mT} ${c.col} ${mC}`.trimEnd());
    });
    if(!cols.length) colLines.push('    string name');
    colLines.push('    timestamp created_at','    timestamp updated_at');
    erLines.push(`  ${e.replace(/\s/g,'_')} {\n${colLines.join('\n')}\n  }`);
  });
  const erRels=[];
  const erInf=inferER(a);
  erInf.relationships.forEach(r=>{
    const clean=r.replace(/\s*\(.*\)\s*$/,'');
    const words=clean.split(/\s+/);
    if(words.length>=3){
      const from=words[0].replace(/\s/g,'_');
      const to=words[words.length-1].replace(/\s/g,'_');
      const mid=words.slice(1,-1).join(' ');
      if(mid.includes('N')&&mid.includes('M')) erRels.push(`  ${from} }o--o{ ${to} : "many-to-many"`);
      else if(mid.includes('0')) erRels.push(`  ${from} o|--o{ ${to} : "self-ref"`);
      else erRels.push(`  ${from} ||--o{ ${to} : "has"`);
    }
  });
  if(!erRels.length){
    const hasUser=entities.some(e=>e.toLowerCase()==='user');
    if(hasUser) entities.forEach(e=>{
      if(e.toLowerCase()!=='user') erRels.push(`  User ||--o{ ${e.replace(/\s/g,'_')} : "has"`);
    });
  }
  // FK map — merge inferER relationships + ENTITY_COLUMNS FK annotations
  const fkMap={};
  erInf.relationships.forEach(r=>{
    const clean=r.replace(/\s*\(.*\)\s*$/,'');
    const words=clean.split(/\s+/);
    if(words.length>=3){
      const parent=words[0],to=words[words.length-1],mid=words.slice(1,-1).join(' ');
      if(!mid.includes('M')&&!mid.includes('0')){
        if(!fkMap[to])fkMap[to]=[];
        const fk=parent.toLowerCase()+'_id';
        if(!fkMap[to].includes(fk))fkMap[to].push(fk);
      }
    }
  });
  entities.forEach(e=>{
    getEntityColumns(e,G,entities).forEach(c=>{
      if(c.constraint.includes('FK')){if(!fkMap[e])fkMap[e]=[];if(!fkMap[e].includes(c.col))fkMap[e].push(c.col);}
    });
  });
  if(!Object.keys(fkMap).length) erRels.forEach(rel=>{
    const m2=rel.match(/(\w+)\s+\|\|--o\{\s+(\w+)/);
    if(m2){if(!fkMap[m2[2]])fkMap[m2[2]]=[];const fk=m2[1].toLowerCase()+'_id';if(!fkMap[m2[2]].includes(fk))fkMap[m2[2]].push(fk);}
  });

  S.files['docs/04_er_diagram.md']=`# ${pn} — ${G?'ER図':'ER Diagram'}\n> ${date}\n\n${G?'## エンティティ関連図':'## Entity Relationship Diagram'}\n\n\`\`\`mermaid\nerDiagram\n${erLines.join('\n')}\n${erRels.join('\n')}\n\`\`\`\n\n${G?'## エンティティ詳細':'## Entity Details'}\n${entities.map(e=>{
    const cols=getEntityColumns(e,G,entities);
    const colRows=cols.map(c=>`| ${c.col} | ${c.type} | ${c.constraint.includes('FK')?'FK':c.constraint||''} | ${c.desc} |`).join('\n');
    const nameRow=cols.length?'':(`| name | VARCHAR(255) | NOT NULL | ${e} ${G?'名':'name'} |\n`);
    return `\n### ${e}\n| ${G?'カラム':'Column'} | ${G?'型':'Type'} | ${G?'制約':'Constraint'} | ${G?'説明':'Desc'} |\n|--------|------|------|------|\n| id | UUID | PK | ${G?'一意識別子':'Unique ID'} |\n${colRows?colRows+'\n':''}${nameRow}| created_at | TIMESTAMP | DEFAULT NOW | ${G?'作成日時':'Created at'} |\n| updated_at | TIMESTAMP | DEFAULT NOW | ${G?'更新日時':'Updated at'} |`;
  }).join('\n')}`;

  // 5. API Design (BaaS-aware)
  let apiEndpoints;
  if(arch.isBaaS){
    const sdkName=be.includes('Supabase')?'Supabase Client SDK':be.includes('Firebase')?'Firebase SDK':'BaaS SDK';
    apiEndpoints=entities.map(e=>{
      const tbl=pluralize(e);
      const cols=getEntityColumns(e,G,entities);
      // Build insert/update field examples from real columns
      const insertFields=cols.filter(c=>!c.col.endsWith('_at')&&!c.constraint.includes('DEFAULT NOW')&&!c.constraint.includes('FK')).slice(0,4);
      const insertObj=insertFields.length?insertFields.map(c=>c.col+': '+(c.type.includes('INT')||c.type.includes('DECIMAL')?'0':c.type.includes('BOOLEAN')?'false':`'...'`)).join(', '):'name: \'...\'';
      const fkFields=cols.filter(c=>c.constraint.includes('FK'));
      const fkInsert=fkFields.map(c=>{
        const varName=c.col.replace(/_([a-z])/g,(_,l)=>l.toUpperCase()).replace(/Id$/,'Id');
        return c.col+': '+varName;
      }).join(', ');
      const allInsert=[fkInsert,insertObj].filter(Boolean).join(', ');
      if(be.includes('Supabase')){
        return `\n### ${e} (${G?'テーブル':'table'}: ${tbl})\n\n#### ${G?'一覧取得':'List'}\n\`\`\`ts\nconst { data } = await supabase.from('${tbl}').select('*').range(0, 19).order('created_at', { ascending: false })\n\`\`\`\n\n#### ${G?'詳細取得':'Get by ID'}\n\`\`\`ts\nconst { data } = await supabase.from('${tbl}').select('*').eq('id', id).single()\n\`\`\`\n\n#### ${G?'作成':'Create'}\n\`\`\`ts\nconst { data } = await supabase.from('${tbl}').insert({ ${allInsert} }).select()\n\`\`\`\n\n#### ${G?'更新':'Update'}\n\`\`\`ts\nconst { data } = await supabase.from('${tbl}').update({ ${insertObj} }).eq('id', id).select()\n\`\`\`\n\n#### ${G?'削除':'Delete'}\n\`\`\`ts\nawait supabase.from('${tbl}').delete().eq('id', id)\n\`\`\``;
      }
      return `\n### ${e}\n- SDK: \`${sdkName}\`\n- ${G?'CRUD操作はSDK経由で実行':'CRUD via SDK calls'}`;
    }).join('\n');
  } else {
    apiEndpoints=entities.map(e=>{
      const lower=e.toLowerCase().replace(/\s/g,'_');
      const cols=getEntityColumns(e,G,entities);
      const bodyFields=cols.filter(c=>!c.col.endsWith('_at')&&!c.constraint.includes('DEFAULT NOW')).slice(0,5);
      const bodyObj=bodyFields.length?bodyFields.map(c=>`"${c.col}": "${c.type.includes('INT')?'number':c.type.includes('BOOLEAN')?'boolean':'string'}"`).join(', '):`"name": "string"`;
      const methods=getEntityMethods(e);
      const parts=[`\n### /api/v1/${lower}`];
      if(methods.includes('GET')) parts.push(`\n#### GET /api/v1/${lower}\n- ${G?'説明':'Desc'}: ${G?e+'一覧取得 (カーソルページネーション対応)':'List '+e+' (cursor-paginated)'}\n- クエリ: \`?cursor=&limit=20&sort=created_at&order=desc\`\n- レスポンス:\n\`\`\`json\n{ "data": [{ "id": "uuid", ${bodyObj} }], "meta": { "total": 100, "cursor": "eyJpZCI6IjEyMyJ9", "hasNextPage": true } }\n\`\`\`\n- ${G?'ステータス':'Status'}: 200 / 401 / 500`);
      if(methods.includes('GET/:id')) parts.push(`\n#### GET /api/v1/${lower}/:id\n- ${G?'説明':'Desc'}: ${G?e+'詳細取得':'Get '+e+' detail'}\n- ${G?'ステータス':'Status'}: 200 / 404`);
      if(methods.includes('POST')) parts.push(`\n#### POST /api/v1/${lower}\n- ${G?'リクエスト':'Request'}: \`{ ${bodyObj} }\`\n- ${G?'ステータス':'Status'}: 201 / 400 / 422`);
      if(methods.includes('PUT/:id')) parts.push(`\n#### PUT /api/v1/${lower}/:id\n- ${G?'リクエスト':'Request'}: \`{ ${bodyObj} }\`\n- ${G?'ステータス':'Status'}: 200 / 404 / 422`);
      if(methods.includes('PATCH/:id')||methods.includes('PATCH')) parts.push(`\n#### PATCH /api/v1/${lower}${methods.includes('PATCH/:id')?'/:id':''}\n- ${G?'リクエスト':'Request'}: \`{ ${bodyObj} }\`\n- ${G?'ステータス':'Status'}: 200 / 404 / 422`);
      if(methods.includes('DELETE/:id')) parts.push(`\n#### DELETE /api/v1/${lower}/:id\n- ${G?'ステータス':'Status'}: 204 / 404`);
      return parts.join('');
    }).join('\n');
  }

  // 6. Screen Design (intelligent flow + component details)
  const sNodes=screens.map((s,i)=>`  S${i}["${s}"]`).join('\n');
  // Build intelligent screen flow based on screen types
  const sLinks=[];
  const sIdx={};screens.forEach((s,i)=>sIdx[s]=i);
  const findScreen=(pattern)=>screens.findIndex(s=>new RegExp(pattern,'i').test(s));
  const landingIdx=findScreen('ランディング|landing|LP|トップ|home');
  const loginIdx=findScreen('ログイン|login|サインイン');
  const registerIdx=findScreen('新規登録|register|signup');
  const dashIdx=findScreen('ダッシュボード|dashboard');
  const settingsIdx=findScreen('設定|setting|プロフィール|profile');
  const adminIdx=findScreen('管理|admin');
  const paymentIdx=findScreen('決済|payment|billing|checkout|課金');
  const detailIdx=findScreen('詳細|detail|コース|course|商品|product');
  // Auth flow: landing → login → dashboard
  if(landingIdx>=0&&dashIdx>=0) sLinks.push(`  S${landingIdx} --> S${dashIdx}`);
  // Dashboard as hub
  screens.forEach((s,i)=>{
    if(i===landingIdx||i===dashIdx) return;
    const isPublic=/ランディング|landing|LP|ログイン|login|register|登録|料金|pricing|about|概要|terms|利用規約|contact|お問い合わせ/i.test(s);
    const isAdmin=/管理|admin/i.test(s);
    if(!isPublic&&dashIdx>=0){
      if(isAdmin){
        sLinks.push(`  S${dashIdx} -->|${G?'管理者のみ':'admin only'}| S${i}`);
      } else {
        sLinks.push(`  S${dashIdx} --> S${i}`);
      }
      // Bidirectional for main sections
      if(/設定|setting|プロフィール|profile|詳細|detail|コース|course/i.test(s)) sLinks.push(`  S${i} --> S${dashIdx}`);
    }
  });
  // Purchase flow: detail → payment
  if(detailIdx>=0&&paymentIdx>=0) sLinks.push(`  S${detailIdx} --> S${paymentIdx}`);
  // Fallback: if no links generated, use simple chain
  if(!sLinks.length){
    screens.forEach((s,i)=>{if(i<screens.length-1) sLinks.push(`  S${i} --> S${i+1}`);});
  }

  // 7. Test Cases (feature-specific when available)
  const testMatrix=features.map(f=>{
    const fd=getFeatureDetail(f);
    const header=`\n### ${f}\n| # | ${G?'ケース':'Case'} | ${G?'種別':'Type'} | ${G?'期待結果':'Expected'} | ${G?'優先度':'Priority'} |\n|---|--------|------|----------|--------|`;
    if(fd){
      const tests=G?fd.tests_ja:fd.tests_en;
      return header+'\n'+tests.map((t,i)=>{
        const isErr=t[0].includes('異常')||t[0].includes('Error');
        const type=isErr?'Error':'Normal';
        const pri=i<2?'P0':'P1';
        return `| ${i+1} | ${t[0]} | ${type} | ${t[1]} | ${pri} |`;
      }).join('\n');
    }
    return header+`\n| 1 | ${G?'正常系: 基本操作':'Normal: Basic op'} | Normal | 200/201 ${G?'成功':'OK'} | P0 |\n| 2 | ${G?'正常系: 境界値':'Normal: Boundary'} | Boundary | ${G?'正常処理':'OK'} | P1 |\n| 3 | ${G?'異常系: 必須項目欠落':'Error: Missing field'} | Error | 422 ${G?'バリデーションエラー':'Validation Error'} | P0 |\n| 4 | ${G?'異常系: 権限不足':'Error: No permission'} | Auth | 401/403 | P0 |\n| 5 | ${G?'異常系: 不正フォーマット':'Error: Bad format'} | Error | 400 Bad Request | P1 |\n| 6 | ${G?'異常系: 存在しないID':'Error: ID not found'} | Error | 404 Not Found | P1 |`;
  }).join('\n');

  // 9. Release Checklist (dynamic per deploy target)
  const deployTarget=a.deploy||'Vercel';
  const dChecks=G?{'Vercel':['Vercel環境変数設定','プレビューデプロイ動作確認','カスタムドメインDNS設定','Edge Functions設定'],'AWS':['IAMロール・ポリシー確認','RDSセキュリティグループ設定','CloudFront設定','Route53 DNS設定'],'Railway':['Railway環境変数設定','PostgresDB接続確認','カスタムドメイン設定','自動デプロイ有効化'],'Netlify':['Netlify環境変数設定','ビルドコマンド確認','カスタムドメインDNS設定','Netlify Functions設定'],'Fly.io':['Fly.io環境変数(fly secrets)','fly.toml設定確認','ヘルスチェック設定','カスタムドメインCERT設定'],'Cloudflare':['Cloudflare環境変数設定','Pages/Workers設定','カスタムドメインDNS設定','KV/D1接続確認']}:{'Vercel':['Vercel env vars','Preview deploy check','Custom domain DNS','Edge Functions config'],'AWS':['IAM roles/policies','RDS security groups','CloudFront config','Route53 DNS'],'Railway':['Railway env vars','Postgres connection','Custom domain','Auto-deploy enabled'],'Netlify':['Netlify env vars','Build command check','Custom domain DNS','Netlify Functions config'],'Fly.io':['Fly.io secrets','fly.toml config','Health check setup','Custom domain CERT'],'Cloudflare':['Cloudflare env vars','Pages/Workers config','Custom domain DNS','KV/D1 connection']};
  const deployChecks=dChecks[deployTarget]||dChecks[Object.keys(dChecks).find(k=>deployTarget.includes(k))]||dChecks['Vercel'];
  const dbName=a.database||'PostgreSQL';
  const dbChecks=dbName.includes('Supa')?(G?['Supabase RLS有効化','API Key設定','接続プール設定']:['Supabase RLS enabled','API Key configured','Connection pool']):G?['マイグレーション実行確認','接続プール設定','バックアップ設定']:['Migration verified','Connection pool','Backup configured'];

  // 10. Gantt (Mermaid)
  const ganttTasks=features.map((f,i)=>{
    const days=f.match(/Auth|認証/i)?5:f.match(/Admin|管理/i)?4:f.match(/Upload|ファイル/i)?3:3;
    return `  ${f.replace(/[^a-zA-Z0-9ぁ-んァ-ヶー一-龠\s]/g,'')} :s${i}, ${i===0?'after ci':('after s'+(i-1))}, ${days}d`;
  }).join('\n');

  // 11. WBS (3-level + hours)
  const wbsTasks=features.map((f,i)=>{
    const h=f.match(/Auth|認証/i)?16:f.match(/Admin|管理/i)?12:f.match(/Upload|ファイル/i)?8:f.match(/CRUD|一覧/i)?6:8;
    return `### 2.${i+1} ${f} (${h}h)\n- 2.${i+1}.1 ${G?'データモデル定義':'Data model'} (${Math.ceil(h*0.2)}h)\n- 2.${i+1}.2 ${G?'API実装':'API implementation'} (${Math.ceil(h*0.3)}h)\n- 2.${i+1}.3 ${G?'UI実装':'UI implementation'} (${Math.ceil(h*0.3)}h)\n- 2.${i+1}.4 ${G?'テスト':'Testing'} (${Math.ceil(h*0.2)}h)`;
  }).join('\n\n');
  const totalH=features.reduce((s,f)=>{const h=f.match(/Auth|認証/i)?16:f.match(/Admin|管理/i)?12:f.match(/Upload|ファイル/i)?8:f.match(/CRUD|一覧/i)?6:8;return s+h;},0);

  // Prompt Playbook (C3: new)
  S.files['docs/22_prompt_playbook.md']=`# ${pn} — ${G?'プロンプトプレイブック':'Prompt Playbook'}\n> ${date}\n\n${G?'## 使い方\n開発フェーズごとに、以下のプロンプトを順番にAI (Claude / Cursor) に投入してください。':'## Usage\nFeed these prompts to AI (Claude / Cursor) in order for each dev phase.'}\n\n${G?'## Phase 0: 戦略レビュー\n\n### 0-1. 業界ブループリント確認\n```\ndocs/48_industry_blueprint.md を読み、以下を確認してください:\n- 規制要件とコンプライアンス対応\n- 業界固有のアーキテクチャパターン\n- 主要失敗要因と予防策\n```\n\n### 0-2. ステークホルダー戦略\n```\ndocs/50_stakeholder_strategy.md を読み、以下を確認してください:\n- 開発フェーズ戦略（MVP→Growth→Scale）\n- チーム構成と役割分担\n- 技術的負債の管理方針\n```\n\n':'## Phase 0: Strategic Review\n\n### 0-1. Industry Blueprint Review\n```\nRead docs/48_industry_blueprint.md and confirm:\n- Regulatory requirements and compliance needs\n- Industry-specific architecture patterns\n- Key failure factors and prevention strategies\n```\n\n### 0-2. Stakeholder Strategy\n```\nRead docs/50_stakeholder_strategy.md and confirm:\n- Development phase strategy (MVP→Growth→Scale)\n- Team composition and roles\n- Technical debt management policy\n```\n\n'}## Phase 1: ${G?'プロジェクトセットアップ':'Project Setup'}\n\n### 1-1. ${G?'初期環境構築':'Initial Setup'}\n\`\`\`\n${G?'以下の技術スタックでプロジェクトの初期セットアップを行ってください。':'Set up the project with the following tech stack.'}\n- Frontend: ${fe}\n- Backend: ${be}\n
- DB: ${dbName}\n- Deploy: ${deployTarget}\n${G?'package.json, tsconfig.json, .env.example を生成してください。':'Generate package.json, tsconfig.json, .env.example.'}\n\`\`\`\n\n### 1-2. ${G?'データモデル定義':'Data Model'}\n\`\`\`\n${G?'以下のエンティティの'+orm+'スキーマを生成してください:':'Generate '+orm+' schema for these entities:'} ${entities.join(', ')}\n${entities.map(e=>{const cols=getEntityColumns(e,G,entities);if(!cols.length) return '';return e+': '+cols.map(c=>c.col+'('+c.type+')').join(', ');}).filter(Boolean).join('\n')}\n${G?'各エンティティにはid, created_at, updated_atを含め、リレーションも定義してください。':'Include id, created_at, updated_at for each entity with relations.'}\n
\`\`\`\n\n## Phase 2: ${G?'コア機能開発':'Core Development'}\n\n${features.map((f,i)=>{const fd=getFeatureDetail(f);const criteriaLines=fd?(G?fd.criteria_ja:fd.criteria_en).map(c=>'  - '+c.replace(/\{auth\}/g,a.auth||'OAuth')).join('\n'):'';return `### 2-${i+1}. ${f}\n\`\`\`\n**${G?'Role':'Role'}**: ${G?'フルスタック開発者 (Frontend + Backend)':'Full-stack developer (Frontend + Backend)'}\n\n${G?f+'機能を実装してください。':'Implement '+f+'.'}\n- ${arch.isBaaS?(G?'データアクセス: '+orm+'でCRUDを実装':'Data access: Implement CRUD with '+orm):(G?'APIエンドポイント: /api/v1/ にCRUDを作成':'API endpoint: Create CRUD at /api/v1/')}\n- ${G?'UIコンポーネント: '+fe+'で画面を実装':'UI component: Build screen with '+fe}\n- ${G?'バリデーション: zodスキーマで入力検証':'Validation: zod schema for input'}\n- ${G?'テスト: Vitestでユニットテスト作成':'Test: Write unit tests with Vitest'}${criteriaLines?'\n\n'+(G?'受入条件:':'Acceptance Criteria:')+'\n'+criteriaLines:''}\n\n${G?'docs/39_implementation_playbook.mdのドメインパターンを参照してください。':'Reference domain patterns in docs/39_implementation_playbook.md.'}\n\n**${G?'出力形式':'Output Format'}**: ${G?'ファイルパス付きコードブロック。テストを含めること。':'Code blocks with file paths. Include tests.'}\n\`\`\``}).join('\n\n')}\n\n
## Phase 3: ${G?'テスト・デプロイ':'Test & Deploy'}\n\n### 3-1. ${G?'E2Eテスト':'E2E Tests'}\n\`\`\`\n${G?'Playwrightで以下の画面のE2Eテストを作成してください:':'Create Playwright E2E tests for these screens:'} ${screens.join(', ')}\n${G?'正常系・異常系の両方をカバーしてください。':'Cover both happy and error paths.'}\n\`\`\`\n\n### 3-2. ${G?'デプロイ設定':'Deploy Config'}\n\`\`\`\n${G?deployTarget+'へのデプロイ設定を行ってください。':'Configure deployment to '+deployTarget+'.'}\n- CI/CD: GitHub Actions\n
- ${G?'環境変数: .env.exampleに基づいて設定':'Env vars: Based on .env.example'}\n- ${G?'プレビューデプロイの設定も含めてください。':'Include preview deploy config.'}\n\`\`\`\n\n### 3-3. ${G?'セキュリティ監査':'Security Audit'}\n\`\`\`\n**Role**: ${G?'セキュリティエンジニア':'Security Engineer'}\n\n${G?'以下のセキュリティドキュメントを参照し、プロジェクトのセキュリティ監査を実施してください:':'Reference these security documents and audit the project:'}\n- docs/43_security_intelligence.md (OWASP Top 10)\n- docs/44_threat_model.md (STRIDE)\n- docs/45_compliance_matrix.md\n- docs/46_ai_security.md (${G?'敵対的プロンプト使用':'Use adversarial prompts'})\n- docs/47_security_testing.md (${G?'テスト実行':'Execute tests'})\n\n${G?'重点チェック:':'Focus areas:'}\n1. ${G?'認可ロジック (RLS/ミドルウェア)':'Authorization logic (RLS/middleware)'}\n2. ${G?'入力バリデーション':'Input validation'}\n3. ${G?'シークレット管理':'Secrets management'}\n\`\`\`\n\n## Phase 4: ${G?'イテレーション':'Iteration'}\n\n### 4-1. ${G?'バグ修正':'Bug Fix'}\n\`\`\`\n**${G?'Role':'Role'}**: ${G?'デバッガー兼フルスタック開発者':'Debugger & Full-stack developer'}\n\n${G?'以下のエラーを修正してください。':'Fix the following error.'}\n\n[${G?'エラー内容を貼り付け':'Paste error here'}]\n\n${G?'手順':'Steps'}:\n1. docs/25_error_logs.md ${G?'を参照し、既知の問題か確認':'to check if it is a known issue'}\n2. ${G?'根本原因を特定':'Identify root cause'}\n3. ${G?'修正とテストを実装':'Implement fix and tests'}\n4. docs/25_error_logs.md ${G?'にエラーを記録':'to log the error'}\n\n**${G?'出力形式':'Output Format'}**: ${G?'修正パッチ (diff形式) + テスト + ログエントリ':'Fix patch (diff) + tests + log entry'}\n\`\`\`\n\n### 4-2. ${G?'機能追加':'Feature Addition'}\n\`\`\`\n**${G?'Role':'Role'}**: ${G?'フルスタック開発者':'Full-stack developer'}\n\n${G?'以下の機能を追加してください。':'Add the following feature.'}\n\n[${G?'機能説明を記載':'Describe feature here'}]\n\n${G?'手順':'Steps'}:\n1. docs/23_tasks.md ${G?'を参照し、タスクを追加':'to add task'}\n2. .spec/constitution.md ${G?'の原則に準拠':'principles'}\n3. ${G?'コード + テストを実装':'Implement code + tests'}\n4. docs/24_progress.md ${G?'を更新':'to update progress'}\n\n**${G?'出力形式':'Output Format'}**: ${G?'ファイルパス付きコードブロック + タスクエントリ + 進捗更新':'Code blocks with file paths + task entry + progress update'}\n\`\`\`\n\n### 4-3. ${G?'品質チェック':'Quality Check'}\n\`\`\`\n**${G?'Role':'Role'}**: ${G?'QAエンジニア':'QA Engineer'}\n\n${G?'品質チェック:':'Quality check:'}\n- docs/32_qa_blueprint.md ${G?'の品質ゲートを実施':'quality gates'}\n- docs/28_qa_strategy.md ${G?'のドメイン別バグパターンを確認':'domain-specific bug patterns'}\n\`\`\`\n\n### 4-4. ${G?'パフォーマンス検証':'Performance Check'}\n\`\`\`\n**${G?'Role':'Role'}**: ${G?'パフォーマンスエンジニア':'Performance Engineer'}\n\n${G?'パフォーマンス検証:':'Performance check:'}\n- docs/41_growth_intelligence.md ${G?'のCWV目標値と照合':'CWV targets'}\n- docs/19_performance.md ${G?'の最適化施策を適用':'optimization strategies'}\n\`\`\``;

  // Task decomposition (D1: GitHub Issues style)
  const taskList=[];
  taskList.push({title:G?'環境構築':'Environment Setup',label:'setup',hours:3,desc:G?`${fe} + ${be} + ${dbName} のプロジェクト初期セットアップ`:`${fe} + ${be} + ${dbName} initial project setup`});
  taskList.push({title:G?'DevContainer設定':'DevContainer Config',label:'infra',hours:2,desc:G?'開発環境のコンテナ化':'Containerize dev environment'});
  features.forEach(f=>{
    const h=f.match(/Auth|認証/i)?16:f.match(/Admin|管理/i)?12:f.match(/Upload|ファイル/i)?8:f.match(/CRUD|一覧/i)?6:8;
    taskList.push({title:G?f+'の実装':f+' Implementation',label:'feature',hours:h,desc:G?`${f}のAPI・UI・テストを実装`:`Implement API, UI, and tests for ${f}`});
  });
  taskList.push({title:G?'E2Eテスト':'E2E Tests',label:'test',hours:6,desc:G?'Playwrightでの統合テスト':'Integration tests with Playwright'});
  taskList.push({title:G?'パフォーマンス最適化':'Performance Optimization',label:'perf',hours:4,desc:G?'Lighthouse 90+目標':'Lighthouse 90+ target'});
  taskList.push({title:G?'リリース準備':'Release Prep',label:'release',hours:3,desc:G?`${deployTarget}へのデプロイ・モニタリング設定`:`Deploy to ${deployTarget} & monitoring setup`});
  S.files['docs/23_tasks.md']=`# ${pn} — ${G?'タスク一覧 (GitHub Issues形式)':'Task List (GitHub Issues)'}\n> ${date}\n\n${taskList.map((t,i)=>{
    // Feature tasks: use domain-specific acceptance criteria from FEATURE_DETAILS
    let acLines;
    if(t.label==='feature'){
      const featureName=t.title.replace(/(の実装| Implementation)/g,'');
      const fd=getFeatureDetail(featureName);
      if(fd){
        const criteria=(G?fd.criteria_ja:fd.criteria_en).map(c=>c.replace(/\{auth\}/g,a.auth||'OAuth'));
        acLines=criteria.map(c=>'  - [ ] '+c).join('\n');
      }
    }
    if(!acLines){
      acLines=`  - [ ] ${G?'実装完了':'Implementation done'}\n  - [ ] ${G?'テスト通過':'Tests passing'}\n  - [ ] ${G?'コードレビュー完了':'Code review done'}`;
    }
    const _tp=t.label==='feature'?'P0':t.label==='perf'?'P2':'P1';
    return `## Issue #${i+1}: ${t.title}\n- **${G?'優先度':'Priority'}**: ${_priorityLabel(_tp,G)}\n- **${G?'ラベル':'Label'}**: \`${t.label}\`\n- **${G?'見積り':'Estimate'}**: ${t.hours}h\n- **${G?'説明':'Description'}**: ${t.desc}\n- **Acceptance Criteria**:\n${acLines}`;
  }).join('\n\n')}\n\n---\n
**${G?'合計タスク数':'Total Tasks'}**: ${taskList.length} | **${G?'総見積り':'Total Est.'}**: ${taskList.reduce((s,t)=>s+t.hours,0)}h${_stageHandoff(G?'計画フェーズ':'Planning Phase',{decisions:[(G?'技術スタック: ':'Tech stack: ')+fe+' / '+be+' / '+dbName,(G?'デプロイ先: ':'Deploy target: ')+deployTarget],handoff:[G?'docs/22_prompt_playbook.md Phase 1 から実装を開始':'Begin implementation from Phase 1 in docs/22_prompt_playbook.md',(G?'優先機能: ':'Priority features: ')+features.slice(0,3).join(', ')],pending:[G?'パフォーマンス要件の最終確定':'Finalize performance requirements',G?'スコープ外機能のIssue化':'Convert out-of-scope features to GitHub Issues']},G)}\n\n---\n\n## ${G?'依存関係グラフ':'Dependency Graph'}\n\n\`\`\`\n${G?'環境構築':'Setup'} → ${G?'認証実装':'Auth'} → ${G?'エンティティCRUD':'Entity CRUD'} → ${G?'UI開発':'UI Dev'} → E2E → ${G?'リリース':'Release'}\n         ↓\n   ${G?'CI/CD設定 (並行)':'CI/CD (parallel)'}\n\`\`\`\n\n## ${G?'Definition of Done チェックリスト':'Definition of Done Checklist'}\n\n- [ ] ${G?'コード実装完了・PR作成':'Implementation done, PR created'}\n- [ ] ${G?'ユニットテスト作成・通過 (カバレッジ 80%+)':'Unit tests created & passing (coverage 80%+)'}\n- [ ] ${G?'コードレビュー完了・承認':'Code review done & approved'}\n- [ ] ${G?'QAテスト通過・バグゼロ':'QA tests passing, no bugs'}\n- [ ] ${G?'ドキュメント更新 (API仕様・README)':'Docs updated (API spec, README)'}\n\n## ${G?'スプリント割り当て':'Sprint Assignment'}\n\n| ${G?'スプリント':'Sprint'} | ${G?'タスク':'Tasks'} | ${G?'優先度':'Priority'} | ${G?'担当':'Owner'} |\n|--------|------|--------|------|\n| Sprint 0 | ${G?'環境構築・DevContainer':'Setup & DevContainer'} | P1 | ${G?'全員':'All'} |\n| Sprint 1 | ${G?'認証・コアCRUD・基盤API':'Auth + Core CRUD + Base API'} | P0 | ${G?'バックエンド':'Backend'} |\n| Sprint 2 | ${G?'全機能・UI実装':'All features + UI'} | P0 | ${G?'全員':'All'} |\n| Sprint 3 | ${G?'E2E・パフォーマンス・リリース':'E2E + Perf + Release'} | P1 | ${G?'QA+DevOps':'QA+DevOps'} |`;

  const cspExamples=fe.includes('Next')?`**Next.js** (next.config.js):
\`\`\`js
module.exports = {
  async headers() {
    return [{
      source: '/(.*)',
      headers: [{
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co; object-src 'none'; base-uri 'self';"
      }]
    }];
  }
};
\`\`\``:`**Express.js** (helmet):
\`\`\`js
const helmet = require('helmet');
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "data:", "https:"],
    connectSrc: ["'self'"],
    objectSrc: ["'none'"],
    baseUri: ["'self'"]
  }
}));
\`\`\``;
  const corsExamples=fe.includes('Next')?`**Next.js API Routes**:
\`\`\`js
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  // ... handler logic
}
\`\`\``:`**Express.js** (cors):
\`\`\`js
const cors = require('cors');
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
\`\`\``;
  const rateLimitExamples=fe.includes('Next')?`**Next.js** (upstash/ratelimit):
\`\`\`js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s')
});

export default async function handler(req, res) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const { success } = await ratelimit.limit(ip);
  if (!success) return res.status(429).json({ error: 'Too many requests' });
  // ... handler logic
}
\`\`\``:`**Express.js** (express-rate-limit):
\`\`\`js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);
\`\`\``;
  // ── _buildGlossary: rich glossary with ubiquitous language ──
  function _buildGlossary(a,pn,ents,G){
    const dom=detectDomain(a.purpose||'');
    let s='';
    // §1 Entity dictionary
    s+=(G?'## 1. エンティティ辞書':'## 1. Entity Dictionary')+'\n\n';
    s+='| '+(G?'エンティティ':'Entity')+' | '+(G?'主要カラム':'Key Columns')+' | '+(G?'境界コンテキスト':'Bounded Context')+' |\n';
    s+='|---------|---------|----------|\n';
    ents.forEach(function(e){
      const cols=getEntityColumns(e,G,ents).slice(0,4).map(function(c){return c.col;}).filter(Boolean);
      const ctx=e.match(/User|Profile|Role|Auth|Account|Member/i)?'Identity':
        e.match(/Order|Cart|Payment|Invoice|Subscription|Plan/i)?'Commerce':
        e.match(/Course|Lesson|Curriculum|Progress|Score|Quiz/i)?'Learning':
        e.match(/Post|Comment|Like|Follow|Review|Rating/i)?'Social':
        e.match(/Product|Item|Category|Tag|Inventory|Stock/i)?'Catalog':
        e.match(/Message|Notification|Email|Chat|Thread/i)?'Communication':'Core';
      s+='| **'+e+'** | '+(cols.join(', ')||'—')+' | '+ctx+' |\n';
    });
    s+='\n';
    // §2 Domain ubiquitous language
    const glossTerms=(typeof DOMAIN_GLOSSARY!=='undefined'&&DOMAIN_GLOSSARY[dom])||
      (typeof DOMAIN_GLOSSARY!=='undefined'&&DOMAIN_GLOSSARY._default)||[];
    if(glossTerms.length){
      s+=(G?'## 2. ユビキタス言語辞書（ドメイン固有）':'## 2. Ubiquitous Language (Domain-specific)')+'\n\n';
      s+='> '+(G?'ドメイン用語は境界を越えて一貫して使う（DDD原則）':'Use domain terms consistently across boundaries (DDD principle)')+'\n\n';
      s+='| '+(G?'用語':'Term')+' | '+(G?'定義':'Definition')+' | '+(G?'境界コンテキスト':'Bounded Context')+' |\n';
      s+='|--------|---------|----------|\n';
      glossTerms.forEach(function(t){s+='| **'+t[0]+'** | '+(G?t[1]:t[2])+' | '+t[3]+' |\n';});
      s+='\n';
    }
    // §3 Bounded context map
    s+=(G?'## 3. 境界コンテキストマップ':'## 3. Bounded Context Map')+'\n\n';
    var ctxMap={};
    ents.forEach(function(e){
      var ctx=e.match(/User|Profile|Role|Auth|Account|Member/i)?'Identity':
        e.match(/Order|Cart|Payment|Invoice|Subscription|Plan/i)?'Commerce':
        e.match(/Course|Lesson|Curriculum|Progress|Score|Quiz/i)?'Learning':
        e.match(/Post|Comment|Like|Follow|Review|Rating/i)?'Social':
        e.match(/Product|Item|Category|Tag|Inventory|Stock/i)?'Catalog':
        e.match(/Message|Notification|Email|Chat|Thread/i)?'Communication':'Core';
      if(!ctxMap[ctx])ctxMap[ctx]=[];
      ctxMap[ctx].push(e);
    });
    s+='```\n';
    Object.keys(ctxMap).forEach(function(ctx){s+='['+ctx+']\n  '+ctxMap[ctx].join(', ')+'\n';});
    s+='```\n\n';
    // §4 Business rule candidates from domain playbook
    var pb=typeof DOMAIN_PLAYBOOK!=='undefined'?DOMAIN_PLAYBOOK[dom]:null;
    if(pb){
      s+=(G?'## 4. 業務ルール候補（「もし〜ならば〜」制約）':'## 4. Business Rule Candidates (\"if...then\" constraints)')+'\n\n';
      var prevents=G?pb.prevent_ja:pb.prevent_en;
      if(prevents&&prevents.length){
        prevents.forEach(function(p,i){
          var parts=p.split('|対策:');if(parts.length<2)parts=p.split('|Fix: ');
          if(parts.length>=2){
            s+='**BR-'+(i+1).toString().padStart(2,'0')+'**: '+(G?'もし ':'If ')+
              '`'+parts[0].trim()+'`'+(G?' が発生したならば':' occurs then')+' → '+parts[1].trim()+'\n\n';
          }
        });
      }
      var compliances=G?pb.compliance_ja:pb.compliance_en;
      if(compliances&&compliances.length){
        s+=(G?'### コンプライアンス要件':'### Compliance Requirements')+'\n';
        compliances.slice(0,3).forEach(function(c){s+='- [ ] '+c+'\n';});
      }
    }
    return s;
  }

  const docTemplates=[
    ['05_api_design',G?(arch.isBaaS?'データアクセス設計書 (SDK)':'API設計書 (OpenAPI準拠)'):(arch.isBaaS?'Data Access Design (SDK)':'API Design (OpenAPI)'),`${G?'## 認証':'## Authentication'}\n- ${G?'方式':'Method'}: ${auth.tokenType}\n- ${arch.isBaaS?(G?'アクセス方式: '+orm+' SDK':'Access: '+orm+' SDK'):'ヘッダー: \\`Authorization: Bearer <token>\\`'}\n\n${arch.isBaaS?'':(G?'## 共通レスポンス':'## Common Responses')+'\\n| '+(G?'ステータス':'Status')+' | '+(G?'意味':'Meaning')+' |\\n|-----------|------|\\n| 200 | OK |\\n| 201 | Created |\\n| 400 | Bad Request |\\n| 401 | Unauthorized |\\n| 403 | Forbidden |\\n| 404 | Not Found |\\n| 422 | Validation Error |\\n| 500 | Internal Error |\\n\\n'}\n${G?(arch.isBaaS?'## データアクセスパターン':'## エンドポイント一覧'):(arch.isBaaS?'## Data Access Patterns':'## Endpoints')}\n${apiEndpoints}`],
    ['06_screen_design',G?'画面設計書 & 画面遷移図':'Screen Design & Flow',`${G?'## 画面遷移図':'## Screen Flow'}\n\n\`\`\`mermaid\nflowchart LR\n${sNodes}\n${sLinks.join('\n')}\n\`\`\`\n\n${G?'## 画面一覧':'## Screen List'}\n${screens.map((s,i)=>{const isPublic=s.match(/ログイン|Login|Register|登録|ランディング|Landing|LP|トップ|Top|ホーム|Home|About|概要|利用規約|Terms|料金|Pricing|お問い合わせ|Contact/i);const comps=getScreenComponents(s,G);const compList=comps?'\n- '+(G?'主要コンポーネント':'Key Components')+':\n'+comps.map(c=>'  - '+c).join('\n'):'\n- '+(G?'コンポーネント':'Components')+': Header, '+(isPublic?'':'Sidebar, ')+'Content, Footer';return `\n### ${i+1}. ${s}\n- URL: \`${(genRoutes(a).find(r=>r.name===s.replace(/\(P[0-2]\)/gi,'').trim())||{path:'/'+(s.toLowerCase().replace(/[^a-z0-9]/g,'-'))}).path}\`\n- ${G?'認証':'Auth'}: ${isPublic?(G?'不要':'Not required'):(G?'必要':'Required')}${compList}`;}).join('\n')}`],
    ['07_test_cases',G?'テストケース定義書':'Test Cases',`${G?'## テスト戦略':'## Test Strategy'}\n- ${G?'ユニット':'Unit'}: Vitest (80%+)\n- E2E: Playwright\n- ${G?'コンポーネント':'Component'}: Testing Library\n\n${G?'## テストケースマトリクス':'## Test Case Matrix'}\n${testMatrix}\n\n${G?'## 実行コマンド':'## Run Commands'}\n\`\`\`bash\nnpm run test\nnpm run test:e2e\nnpm run test:coverage\n\`\`\``],
    ['08_security',G?'セキュリティ設計書':'Security Design',`${G?'## セキュリティ対策':'## Security Measures'}\n- ${G?'認証':'Auth'}: ${auth.sot}\n- HTTPS${G?'必須':' required'}\n- CSP (Content Security Policy)\n- CORS (Cross-Origin Resource Sharing)\n- Rate Limiting\n- Input Validation${hasAdmin?'\n\n'+(G?'## RBAC（ロールベースアクセス制御）':'## RBAC (Role-Based Access Control)')+'\n\n| '+(G?'ロール':'Role')+' | '+(G?'権限':'Permissions')+' |\n|--------|----------|\n| user | '+(G?'自分のデータの読取・更新':'Read/update own data')+' |\n'+(hasInstructor?'| instructor | '+(G?'コンテンツ作成・編集・自分の受講者管理':'Create/edit content, manage own students')+' |\n':'')+'| admin | '+(G?'全データの読取・更新・削除、ユーザー管理、システム設定':'Full CRUD, user management, system settings')+' |\n\n'+(G?'### RBACポリシー実装':'### RBAC Policy Implementation')+'\n- profiles.role '+(G?'カラムでロール管理':'column for role management')+'\n- '+(arch.isBaaS&&be.includes('Supabase')?'RLS: auth.uid() = user_id AND role check via profiles':'Middleware: role check before protected routes')+'\n- '+(G?'管理画面ルート':'Admin routes')+': /admin/ → role=admin '+(G?'チェック必須':'check required'):''}${hasPay&&(a.payment||'').includes('Stripe')?'\n\n'+(G?'## 決済セキュリティ':'## Payment Security')+'\n- Stripe Webhook '+(G?'署名検証':'signature verification')+' (STRIPE_WEBHOOK_SECRET)\n- '+(G?'冪等キーによる重複処理防止':'Idempotency key for duplicate prevention')+'\n- PCI DSS '+(G?'準拠':'compliance')+' (Stripe Elements '+(G?'使用で対応':'handles this')+')\n- '+(G?'サーバーサイドのみで':'Server-side only for')+' stripe.customers / stripe.subscriptions '+(G?'操作':'operations'):''}\n\n${G?'## CSPヘッダー設定例':'## CSP Header Examples'}\n\n${cspExamples}\n\n${G?'## CORS設定例':'## CORS Configuration Examples'}\n\n${corsExamples}\n\n${G?'## レート制限実装例':'## Rate Limiting Implementation'}\n\n${rateLimitExamples}`],
    ['09_release_checklist',G?'リリースチェックリスト':'Release Checklist',`## ${G?'デプロイ先':'Deploy Target'}: ${deployTarget}\n\n### 1. ${G?'コード品質':'Code Quality'}\n${(G?['TypeScript 型エラー 0件','ESLint エラー 0件','全テストパス','カバレッジ 80%+']:['TypeScript: 0 type errors','ESLint: 0 errors','All tests pass','Coverage 80%+']).map(c=>'- [ ] '+c).join('\n')}\n\n### 2. ${G?'セキュリティ':'Security'}\n
${(G?['環境変数にシークレット未ハードコード','CORS設定','CSP設定','認証・認可テスト完了']:['No hardcoded secrets in env vars','CORS config','CSP config','Auth/authz tests done']).map(c=>'- [ ] '+c).join('\n')}\n\n### 3. ${G?'インフラ':'Infrastructure'} (${deployTarget})\n${deployChecks.map(c=>'- [ ] '+c).join('\n')}\n\n### 4. ${G?'データベース':'Database'} (${dbName})\n${dbChecks.map(c=>'- [ ] '+c).join('\n')}\n\n### 5. ${G?'パフォーマンス':'Performance'}\n
${(G?['Lighthouse 90+','LCP < 2.5s','画像最適化','バンドルサイズ確認']:['Lighthouse 90+','LCP < 2.5s','Image optimization','Bundle size check']).map(c=>'- [ ] '+c).join('\n')}\n\n### 6. ${G?'モニタリング':'Monitoring'}\n${(G?['Sentry設定','アクセスログ','アラート閾値']:['Sentry setup','Access logs','Alert thresholds']).map(c=>'- [ ] '+c).join('\n')}\n\n### 7. ${G?'Go/No-Go判定':'Go/No-Go Judgment'}\n| ${G?'観点':'Aspect'} | ${G?'基準':'Criteria'} | ${G?'結果':'Result'} |\n|--------|--------|------|\n| ${G?'品質':'Quality'} | ${G?'P0不具合ゼロ / テスト通過':'P0 bugs=0 / all tests pass'} | |\n| ${G?'セキュリティ':'Security'} | ${G?'OWASP監査完了 / シークレット未漏洩':'OWASP audit done / no secret leaks'} | |\n| ${G?'パフォーマンス':'Performance'} | ${G?'LCP<2.5s / Lighthouse 90+':'LCP<2.5s / Lighthouse 90+'} | |\n| ${G?'運用準備':'Ops Readiness'} | ${G?'監視・アラート・RunBook整備':'Monitoring / alerts / runbook ready'} | |\n| ${G?'ドキュメント':'Docs'} | ${G?'README・変更履歴・API仕様更新':'README / changelog / API spec updated'} | |\n\n#### ${G?'未解決事項':'Unresolved Items'}\n| ID | ${G?'内容':'Content'} | ${G?'リリース後対応可否':'Post-release OK'} | ${G?'対応期限':'Due'} |\n|----|--------|------|------|\n\n#### ${G?'判定結果':'Judgment Result'}\n- [ ] **Go** — ${G?'本番リリース承認':'Approve production release'}\n- [ ] **No-Go** — ${G?'再テスト・修正が必要':'Re-test / fix required'}\n- [ ] **${G?'条件付きGo':'Conditional Go'}** — ${G?'条件:':'Condition:'}\n\n#### ${G?'承認':'Approval'}\n| ${G?'判定者':'Approver'} | ${G?'役割':'Role'} | ${G?'日付':'Date'} |\n|--------|------|------|\n| | PM | |\n| | ${G?'顧客PO':'Customer PO'} | |`],
    ['10_gantt',G?'ガントチャート':'Gantt Chart',`${G?'## プロジェクトスケジュール':'## Project Schedule'}\n\n\`\`\`mermaid\ngantt\n  title ${pn} ${G?'開発スケジュール':'Development Schedule'}\n  dateFormat YYYY-MM-DD\n  axisFormat %m/%d\n  section Sprint 0\n  ${G?'プロジェクトセットアップ':'Project Setup'} :env, ${ganttStart}, 2d\n  ${G?'DevContainer構築':'DevContainer Setup'} :dc, after env, 1d\n  ${G?'CI/CD設定':'CI/CD Setup'} :ci, after dc, 1d\n  section Sprint 1-2\n${ganttTasks}\n  section Sprint 3\n
  ${G?'E2Eテスト':'E2E Tests'} :test, after s${features.length-1}, 3d\n  ${G?'パフォーマンス最適化':'Perf Optimization'} :perf, after test, 2d\n  ${G?'リリース':'Release'} :rel, after perf, 1d\n\`\`\`\n\n${G?'## マイルストーン':'## Milestones'}\n| MS | ${G?'目標':'Goal'} | ${G?'成果物':'Deliverable'} |\n|----|------|--------|\n| Alpha | Sprint 1 ${G?'完了':'done'} | ${G?'コア機能動作':'Core features working'} |\n| Beta | Sprint 2 ${G?'完了':'done'} | ${G?'全機能実装':'All features implemented'} |\n
| RC | Sprint 3 ${G?'中盤':'mid'} | ${G?'テスト完了':'Tests complete'} |\n| GA | Sprint 3 ${G?'末':'end'} | ${G?'本番リリース':'Production release'} |`],
    ['11_wbs',G?'WBS (作業分解構造)':'WBS (Work Breakdown)',(()=>{
  const _sc=a.scale||'medium';
  const _buf=_sc==='solo'?15:_sc==='small'?20:25;
  const _totalWithBuf=Math.round((totalH+26)*(1+_buf/100));
  const _resTable=_sc==='solo'
    ?'| '+( G?'役割':'Role')+' | '+(G?'人数':'Count')+' | '+(G?'稼働率':'Utilization')+'|\n|------|-----|------|\n| '+(G?'フルスタック':'Fullstack')+' | 1 | 100% |'
    :_sc==='small'
    ?'| '+(G?'役割':'Role')+' | '+(G?'人数':'Count')+' | '+(G?'稼働率':'Utilization')+'|\n|------|-----|------|\n| '+(G?'フロントエンド':'Frontend')+' | 1 | 100% |\n| '+(G?'バックエンド':'Backend')+' | 1 | 100% |'
    :'| '+(G?'役割':'Role')+' | '+(G?'人数':'Count')+' | '+(G?'稼働率':'Utilization')+'|\n|------|-----|------|\n| '+(G?'フロントエンド':'Frontend')+' | 1-2 | 100% |\n| '+(G?'バックエンド':'Backend')+' | 1-2 | 100% |\n| '+(G?'QA':'QA')+' | 1 | 50% |';
  let d='## '+(G?'WBS — 総工数:':'WBS — Total Hours:')+' 約'+(totalH+26)+'h';
  d+=' ('+(G?'バッファ込み':'with buffer')+' '+_buf+'%: 約'+_totalWithBuf+'h)\n\n';
  d+='### 1. '+(G?'プロジェクト管理':'Project Management')+' (8h)\n';
  d+='- 1.1 '+(G?'要件定義・SDD作成':'Requirements & SDD')+' (3h)\n';
  d+='- 1.2 '+(G?'技術選定・環境構築':'Tech selection & setup')+' (3h)\n';
  d+='- 1.3 '+(G?'進捗管理・レビュー':'Progress mgmt & review')+' (2h)\n\n';
  d+='## 2. '+(G?'機能開発':'Feature Development')+' ('+totalH+'h)\n\n';
  d+=wbsTasks+'\n\n';
  d+='### 3. '+(G?'テスト':'Testing')+' (12h)\n';
  d+='- 3.1 '+(G?'ユニットテスト':'Unit tests')+' (4h)\n';
  d+='- 3.2 '+(G?'E2Eテスト':'E2E tests')+' (4h)\n';
  d+='- 3.3 '+(G?'バグ修正':'Bug fixes')+' (4h)\n\n';
  d+='### 4. '+(G?'デプロイ':'Deploy')+' (6h)\n';
  d+='- 4.1 '+(G?'ステージング構築':'Staging setup')+' (2h)\n';
  d+='- 4.2 '+(G?'本番デプロイ':'Production deploy')+' (2h)\n';
  d+='- 4.3 '+(G?'モニタリング設定':'Monitoring setup')+' (2h)\n\n';
  d+='## '+(G?'リスクバッファ':'Risk Buffer')+'\n\n';
  d+='| '+(G?'スケール':'Scale')+' | '+(G?'バッファ率':'Buffer Rate')+' | '+(G?'理由':'Reason')+'|\n|------|------|------|\n';
  d+='| Solo | 15% | '+(G?'個人スキルリスク':'Individual skill risk')+'|\n';
  d+='| Small | 20% | '+(G?'コミュニケーションオーバーヘッド':'Communication overhead')+'|\n';
  d+='| Medium/Large | 25% | '+(G?'調整コスト・要件変更リスク':'Coordination cost & scope change risk')+'|\n\n';
  d+='> '+(G?'適用バッファ':'Applied buffer')+': **'+_buf+'%** → '+(G?'総工数':'Total hours')+' '+_totalWithBuf+'h\n\n';
  d+='## '+(G?'依存関係チェーン':'Dependency Chain')+'\n\n';
  d+='```\n'+(G?'環境構築':'Setup')+' → '+(G?'基盤実装':'Foundation')+' → '+(G?'機能開発':'Feature Dev')+' → '+(G?'テスト':'Tests')+' → '+(G?'デプロイ':'Deploy')+'\n';
  d+='                           ↓\n';
  d+='               '+(G?'クリティカルパス: 認証→エンティティCRUD→API→UI':'Critical path: Auth → Entity CRUD → API → UI')+'\n```\n\n';
  d+='## '+(G?'リソースアロケーション':'Resource Allocation')+'\n\n';
  d+=_resTable+'\n\n';
  d+='## '+(G?'マイルストーン':'Milestones')+'\n\n';
  d+='| '+(G?'スプリント':'Sprint')+' | '+(G?'期間':'Duration')+' | '+(G?'成果物':'Deliverable')+' | '+(G?'担当':'Owner')+'|\n|--------|------|---------|------|\n';
  d+='| Sprint 0 | 1w | '+(G?'環境構築・CI/CD':'Setup & CI/CD')+' | '+(G?'全員':'All')+'|\n';
  d+='| Sprint 1 | 2w | '+(G?'認証・コアCRUD':'Auth & Core CRUD')+' | '+(G?'バックエンド':'Backend')+'|\n';
  d+='| Sprint 2 | 2w | '+(G?'全機能実装':'All features')+' | '+(G?'全員':'All')+'|\n';
  d+='| Sprint 3 | 1w | '+(G?'テスト・リリース':'Tests & Release')+' | '+(G?'QA+DevOps':'QA+DevOps')+'|\n\n';
  d+='> '+(G?'参照':'See also')+': docs/23_tasks.md | docs/10_gantt.md';
  return d;
})()],
    ['12_driven_dev',G?'駆動開発ガイド':'Dev Methods Guide',(()=>{
  const _methMap={
    tdd:{wfJa:'Red (失敗テスト) → Green (最小実装) → Refactor (改善) → CI (自動実行)',wfEn:'Red (failing test) → Green (minimal impl) → Refactor (improve) → CI (auto run)',toolsJa:'Vitest / Jest / Testing Library',toolsEn:'Vitest / Jest / Testing Library',refJa:'docs/91_testing_strategy.md §1',refEn:'docs/91_testing_strategy.md §1',pat:/TDD|テスト駆動/i},
    bdd:{wfJa:'Feature文書作成 → Given-When-Then Steps → 実装 → シナリオ自動実行',wfEn:'Write Feature doc → Given-When-Then Steps → Implement → Run scenarios',toolsJa:'Cucumber / Playwright / Vitest',toolsEn:'Cucumber / Playwright / Vitest',refJa:'docs/93_bdd_scenarios.md',refEn:'docs/93_bdd_scenarios.md',pat:/BDD|振舞/i},
    ddd:{wfJa:'ドメインモデリング → 境界コンテキスト設定 → Entity+VO定義 → Repositoryパターン実装',wfEn:'Domain modeling → Bounded Context → Entity+VO definition → Repository pattern',toolsJa:'TypeBox / Zod (VO validation)',toolsEn:'TypeBox / Zod (VO validation)',refJa:'docs/13_glossary.md + docs/114_domain_knowledge_guide.md',refEn:'docs/13_glossary.md + docs/114_domain_knowledge_guide.md',pat:/DDD|ドメイン駆動/i},
    sdd:{wfJa:'spec/specification.md 作成 → AI生成 → レビュー → テスト確認',wfEn:'Write .spec/specification.md → AI generate → Review → Confirm tests',toolsJa:'.spec/ + Claude Code / Cursor',toolsEn:'.spec/ + Claude Code / Cursor',refJa:'.spec/constitution.md + AI_BRIEF.md',refEn:'.spec/constitution.md + AI_BRIEF.md',pat:/SDD|仕様駆動/i}
  };
  let d='## '+(G?'採用手法':'Methods Used')+'\n';
  methods.forEach(m=>{
    d+='\n### '+m+'\n';
    d+='- '+(G?'適用範囲: 全Sprint':'Scope: All sprints')+'\n';
    d+='- '+(G?'実践ルール: .spec/ に準拠':'Rule: Follow .spec/')+'\n';
    const mk=Object.values(_methMap).find(e=>e.pat.test(m));
    if(mk){
      d+='\n#### '+(G?'ワークフロー':'Workflow')+'\n';
      d+='```\n'+(G?mk.wfJa:mk.wfEn)+'\n```\n';
      d+='\n#### '+(G?'推奨ツール':'Recommended Tools')+'\n';
      d+='- '+(G?mk.toolsJa:mk.toolsEn)+'\n';
      d+='\n#### '+(G?'参照':'Reference')+'\n';
      d+='→ '+(G?mk.refJa:mk.refEn)+'\n';
    }
  });
  d+='\n## '+(G?'クロスリファレンス':'Cross Reference')+'\n';
  d+='- docs/91_testing_strategy.md — '+(G?'テスト戦略詳細':'Test strategy detail')+'\n';
  d+='- docs/13_glossary.md — '+(G?'ユビキタス言語辞書':'Ubiquitous language glossary')+'\n';
  d+='- .spec/ — '+(G?'仕様駆動開発の作業成果物':'SDD artifacts')+'\n';
  return d;
})()],
    ['13_glossary',G?'用語集（ユビキタス言語辞書）':'Glossary (Ubiquitous Language)',_buildGlossary(a,pn,entities,G)],
    ['14_risk',G?'リスク管理表':'Risk Management',(()=>{
  const domR=detectDomain(a.purpose||'');
  const domRisksJa={
    fintech:['規制変更（金融庁ガイドライン改定）|高|高|規制モニタリング・コンプライアンス担当設置','不正取引・不審アクセス検知漏れ|高|中|AIベース不正検知・AuditLog強化','監査指摘によるシステム改修コスト|中|中|定期セキュリティ監査・PCI-DSS準拠'],
    health:['個人健康情報漏洩（HIPAA/医療法違反）|高|中|暗号化強化・アクセス制御MFA必須','システムダウンによる医療業務停止|高|低|DR手順整備・冗長構成','データ改ざんによる誤診リスク|高|低|改ざん検知・整合性チェック'],
    ec:['決済障害（Stripe障害・ネットワーク断）|高|中|決済冗長化・リトライ設計','在庫不整合（同時購入競合）|中|高|楽観ロック・在庫予約テーブル設計','高負荷時のパフォーマンス劣化|高|中|負荷テスト・オートスケール設定'],
    education:['著作権違反コンテンツ混入|中|中|コンテンツレビュープロセス整備','未成年ユーザーへのCOPPA/GDPR違反|高|低|年齢確認・保護者同意フロー','システム障害による授業・試験影響|高|低|SLA設定・冗長化'],
    _default:['技術的負債蓄積によるメンテナンスコスト増大|中|高|コードレビュー必須・リファクタ計画','スケジュール遅延（要件変更・メンバー離脱）|中|高|バッファ設定・変更管理ルール整備','セキュリティ脆弱性（未対応のOWASP）|高|中|定期監査・脆弱性スキャン自動化','スコープクリープによるコスト超過|中|高|CR票管理・スコープ凍結ルール','主要メンバー離脱による知識断絶|中|低|ドキュメント整備・ペアプロ実施']
  };
  const domRisksEn={
    fintech:['Regulatory change (financial regulator guideline update)|High|High|Regulatory monitoring, appoint compliance officer','Fraud/suspicious access detection failure|High|Med|AI-based fraud detection, AuditLog reinforcement','Audit findings requiring system rework|Med|Med|Regular security audit, PCI-DSS compliance'],
    health:['Personal health data breach (HIPAA/medical law violation)|High|Med|Enhanced encryption, MFA mandatory access control','System outage halting medical operations|High|Low|DR procedures, redundant configuration','Data tampering causing misdiagnosis risk|High|Low|Tamper detection, integrity checks'],
    ec:['Payment failure (Stripe outage, network disconnect)|High|Med|Payment redundancy, retry design','Inventory inconsistency (concurrent purchase race condition)|Med|High|Optimistic locking, reservation table design','Performance degradation under high load|High|Med|Load testing, auto-scaling config'],
    education:['Copyright-infringing content mixed in|Med|Med|Content review process setup','COPPA/GDPR violation for minor users|High|Low|Age verification, parental consent flow','System failure impacting lessons/exams|High|Low|SLA setup, redundancy'],
    _default:['Technical debt accumulation increasing maintenance cost|Med|High|Mandatory code review, refactoring plan','Schedule delay (requirement changes, member departure)|Med|High|Buffer planning, change management rules','Security vulnerabilities (unaddressed OWASP)|High|Med|Regular audit, automated vulnerability scanning','Scope creep causing cost overrun|Med|High|CR ticket management, scope freeze rules','Key member departure causing knowledge loss|Med|Low|Documentation, pair programming']
  };
  const risks=G?(domRisksJa[domR]||domRisksJa._default):(domRisksEn[domR]||domRisksEn._default);
  const stdRisks=G?domRisksJa._default.filter(r=>!(domRisksJa[domR]||[]).includes(r)).slice(0,2):domRisksEn._default.filter(r=>!(domRisksEn[domR]||[]).includes(r)).slice(0,2);
  const allRisks=[...risks,...(domR!=='_default'?stdRisks:[])];
  const header=G?`| ID | リスク | 影響度 | 発生確率 | 対策 | 担当 | ステータス |\n|-----|--------|--------|---------|------|------|----------|\n`:`| ID | Risk | Impact | Prob | Mitigation | Owner | Status |\n|-----|------|--------|------|------------|-------|--------|\n`;
  const rows=allRisks.map((r,i)=>{const[risk,imp,prob,...rest]=r.split('|');return `| R-${String(i+1).padStart(2,'0')} | ${risk} | ${imp} | ${prob} | ${(rest.join('|'))||'—'} | — | ${G?'対応中':'Open'} |`;}).join('\n');
  return `${G?'## リスク一覧':'## Risk List'}\n\n${header}${rows}\n\n## ${G?'リスク対応計画':'Risk Response Plan'}\n| ${G?'フェーズ':'Phase'} | ${G?'対応手順':'Steps'} |\n|--------|----------|\n| ${G?'発見時':'Identified'} | ${G?'リスク登録・影響評価・緊急度判定':'Log risk, assess impact, determine urgency'} |\n| ${G?'初動':'Initial'} | ${G?'担当者アサイン・対策立案・ステークホルダー通知':'Assign owner, plan mitigation, notify stakeholders'} |\n| ${G?'恒久対応':'Permanent'} | ${G?'根本原因除去・テスト・文書更新':'Remove root cause, test, update docs'} |\n| ${G?'再発防止':'Prevention'} | ${G?'チェックリスト更新・振り返り共有':'Update checklist, share retrospective'} |\n\n## ${G?'レビュースケジュール':'Review Schedule'}\n- ${G?'週次定例で新規リスクを確認':'Review new risks at weekly standup'}\n- ${G?'スプリント終了時に未解決リスクを棚卸':'Backlog open risks at sprint end'}\n- ${G?'リリース前にR-0X (影響度高) を全件クローズ確認':'Verify all High-impact risks closed before release'}`;
})()],
    ['15_meeting',G?'議事録テンプレート':'Meeting Notes Templates',(()=>{
  const kickoff=G?`## テンプレート1: キックオフ議事録\n\n**案件名**: ${pn}  **日時**: ${date}  **場所/手段**:  **記録者**:\n\n### 参加者\n| 所属 | 氏名 | 役割 |\n|------|------|------|\n| 顧客側 | | PO / 決定者 |\n| 開発側 | | PM / TL |\n\n### プロジェクト概要\n- **目的**: ${a.purpose||'—'}\n- **スコープ**: ${features.slice(0,3).join('、')||'—'}\n- **成功指標**: ${a.success||'—'}\n\n### 体制・役割分担\n| 役割 | 担当者 | 責任範囲 |\n|------|--------|----------|\n| PM | | プロジェクト全体管理 |\n| TL | | 技術決定・アーキテクチャ |\n| Dev | | 実装・テスト |\n| 顧客PO | | 要件確定・受入判定 |\n\n### 開発スケジュール\n${features.map((f,i)=>'- Sprint '+(i+1)+': '+f).join('\n')}\n\n### コミュニケーション計画\n- **定例会議**: 週次 Sprint Review\n- **連絡手段**: チャット / メール\n- **エスカレーション**: 担当 → PL → PM\n\n### 開発ルール\n- **技術スタック**: ${fe} + ${be}\n- **ブランチ戦略**: main / develop / feature/*\n- **レビュー基準**: docs/16_review.md 参照\n\n### 変更管理\n- 変更要求は CR票で管理（docs/107_project_governance.md 参照）\n\n### 決定事項\n| 決定ID | 内容 | 決定者 |\n|--------|------|--------|\n| DEC-001 | 技術スタック確定 | |\n\n### 宿題\n| 内容 | 担当 | 期限 |\n|------|------|------|\n| | | |\n\n---\n`:`## Template 1: Kickoff Minutes\n\n**Project**: ${pn}  **Date**: ${date}  **Location/Method**:  **Recorder**:\n\n### Attendees\n| Organization | Name | Role |\n|--------------|------|------|\n| Customer | | PO / Decision-maker |\n| Dev Team | | PM / TL |\n\n### Project Overview\n- **Purpose**: ${a.purpose||'—'}\n- **Scope**: ${features.slice(0,3).join(', ')||'—'}\n- **Success Metrics**: ${a.success||'—'}\n\n### Team Structure\n| Role | Member | Responsibility |\n|------|--------|----------------|\n| PM | | Overall project management |\n| TL | | Technical decisions & architecture |\n| Dev | | Implementation & testing |\n| Customer PO | | Requirement sign-off & acceptance |\n\n### Development Schedule\n${features.map((f,i)=>'- Sprint '+(i+1)+': '+f).join('\n')}\n\n### Communication Plan\n- **Recurring Meeting**: Weekly Sprint Review\n- **Communication Tool**: Chat / Email\n- **Escalation**: Assignee → PL → PM\n\n### Development Rules\n- **Tech Stack**: ${fe} + ${be}\n- **Branch Strategy**: main / develop / feature/*\n- **Review Criteria**: See docs/16_review.md\n\n### Change Management\n- Changes managed via CR tickets (see docs/107_project_governance.md)\n\n### Decisions\n| Decision ID | Content | Decision-maker |\n|------------|---------|----------------|\n| DEC-001 | Tech stack finalized | |\n\n### Action Items\n| Content | Owner | Deadline |\n|---------|-------|----------|\n| | | |\n\n---\n`;
  const weekly=G?`## テンプレート2: 週次定例議事録\n\n**案件名**: ${pn}  **日時**:  **記録者**:\n\n### 前回アクション振り返り\n| 内容 | 担当 | 状態 |\n|------|------|------|\n| | | ✅完了 / 🔄対応中 / ❌未着手 |\n\n### 進捗状況\n- **Sprint進捗率**: __ %\n- **完了タスク**:\n- **着手中**:\n- **ブロッカー**:\n\n### 課題・リスク\n| ID | 種別 | 内容 | 影響度 | 担当 | ステータス |\n|----|------|------|--------|------|----------|\n| | 課題 | | 高/中/低 | | 対応中 |\n\n### 決定事項\n| 内容 | 決定者 |\n|------|--------|\n| | |\n\n### 次回アクション\n| 内容 | 担当 | 期限 |\n|------|------|------|\n| | | |\n\n### CR対応状況\n| CR番号 | 内容 | ステータス | 対応期限 |\n|--------|------|----------|---------|\n| | | | |\n\n---\n`:`## Template 2: Weekly Meeting Minutes\n\n**Project**: ${pn}  **Date**:  **Recorder**:\n\n### Previous Action Review\n| Content | Owner | Status |\n|---------|-------|--------|\n| | | ✅Done / 🔄In Progress / ❌Not Started |\n\n### Progress Status\n- **Sprint Progress**: __ %\n- **Completed Tasks**:\n- **In Progress**:\n- **Blockers**:\n\n### Issues & Risks\n| ID | Type | Content | Impact | Owner | Status |\n|----|------|---------|--------|-------|--------|\n| | Issue | | H/M/L | | Open |\n\n### Decisions\n| Content | Decision-maker |\n|---------|----------------|\n| | |\n\n### Next Actions\n| Content | Owner | Deadline |\n|---------|-------|----------|\n| | | |\n\n### CR Status\n| CR# | Content | Status | Due |\n|-----|---------|--------|-----|\n| | | | |\n\n---\n`;
  const standard=G?`## テンプレート3: 標準議事録\n\n**文書ID**: ${pn.replace(/\s/g,'')}-MTG-__  **案件名**: ${pn}  **日時**:  **参加者**:  **記録者**:\n\n### アジェンダ\n1. \n2. \n3. \n\n### 議事内容\n#### 1. \n#### 2. \n\n### 決定事項\n| # | 内容 | 決定者 |\n|---|------|--------|\n| | | |\n\n### 保留事項\n| # | 内容 | 確認先 | 期限 |\n|---|------|--------|------|\n| | | | |\n\n### 宿題\n| # | 内容 | 担当 | 期限 |\n|---|------|------|------|\n| | | | |\n\n### 変更管理\n- CR票が必要か: はい / いいえ\n\n---\n`:`## Template 3: Standard Minutes\n\n**Doc ID**: ${pn.replace(/\s/g,'')}-MTG-__  **Project**: ${pn}  **Date**:  **Attendees**:  **Recorder**:\n\n### Agenda\n1. \n2. \n3. \n\n### Discussion\n#### 1. \n#### 2. \n\n### Decisions\n| # | Content | Decision-maker |\n|---|---------|----------------|\n| | | |\n\n### Pending Items\n| # | Content | Follow-up With | Due |\n|---|---------|----------------|-----|\n| | | | |\n\n### Action Items\n| # | Content | Owner | Due |\n|---|---------|-------|-----|\n| | | | |\n\n### Change Management\n- CR ticket needed: Yes / No\n\n---\n`;
  const quick=G?`## テンプレート4: 簡易議事録\n\n**案件名**: ${pn}  **日時**:  **目的**:  **期待する結論**:\n\n### 要点\n- \n- \n\n### 決定事項\n- \n\n### 保留・確認事項\n- \n\n### 宿題\n| 内容 | 担当 | 期限 |\n|------|------|------|\n| | | |`:`## Template 4: Quick Notes\n\n**Project**: ${pn}  **Date**:  **Purpose**:  **Expected Conclusion**:\n\n### Key Points\n- \n- \n\n### Decisions\n- \n\n### Pending / Follow-up\n- \n\n### Action Items\n| Content | Owner | Due |\n|---------|-------|-----|\n| | | |`;
  return kickoff+weekly+standard+quick;
})()],
    ['16_review',G?'コードレビューガイド':'Code Review Guide',(()=>{
  const domR=detectDomain(a.purpose||'');
  const domFocusJa={
    fintech:'- AuditLog 書き込みの完全性（誰が・いつ・何を）\n- 冪等性キーによる二重送金防止\n- 本番DBへの直接SQL操作禁止確認',
    health:'- PHI/PII の暗号化保存・転送\n- アクセス制御ロール（医師/患者/管理者）\n- 緊急時フェイルセーフ動作',
    education:'- 学習進捗データの整合性\n- 未成年ユーザーへのCOPPA/GDPR対応\n- コンテンツの著作権・ライセンス確認',
    ec:'- 在庫の同時更新競合（楽観ロック）\n- Stripe Webhook 署名検証\n- カート→決済フローのアトミック性',
    legal:'- 契約書バージョン管理の完全性\n- 電子署名法的有効性確認\n- 監査ログ改ざん不可保証',
    government:'- アクセシビリティ (WCAG 2.1 AA)\n- 個人情報の目的外利用防止\n- 申請フロー全経路の E2E テスト',
    _default:'- ドメイン固有の業務ルール遵守\n- 非機能要件（レスポンス/可用性）との整合性\n- docs/08_security.md チェックリスト照合'
  };
  const domFocusEn={
    fintech:'- AuditLog write completeness (who/when/what)\n- Idempotency key for double-payment prevention\n- No direct SQL on production DB',
    health:'- PHI/PII encrypted at rest and in transit\n- Access control roles (doctor/patient/admin)\n- Emergency failsafe behavior',
    education:'- Learning progress data integrity\n- COPPA/GDPR for minors\n- Content copyright & license check',
    ec:'- Concurrent inventory update conflicts (optimistic lock)\n- Stripe Webhook signature verification\n- Cart→payment flow atomicity',
    legal:'- Contract version control completeness\n- E-signature legal validity\n- Audit log tamper-proof guarantee',
    government:'- Accessibility (WCAG 2.1 AA)\n- Personal data purpose limitation\n- E2E tests for all application paths',
    _default:'- Domain-specific business rule compliance\n- Non-functional requirements (response/availability)\n- Cross-check docs/08_security.md checklist'
  };
  const focusJa=(domFocusJa[domR]||domFocusJa._default);
  const focusEn=(domFocusEn[domR]||domFocusEn._default);
  return `# ${pn} — ${G?'コードレビューガイド':'Code Review Guide'}
> ${date}

## ${G?'レビュープロセス':'Review Process'}

\`\`\`
${G?'①自己レビュー':'①Self-review'} → ${G?'②ピアレビュー (PR作成)':'②Peer Review (open PR)'} → ${G?'③承認 → マージ':'③Approve → Merge'}
\`\`\`

- **${G?'マージ条件':'Merge conditions'}**: ${G?'P0指摘ゼロ + CI グリーン + 承認1名以上':'0 P0 findings + CI green + ≥1 approver'}
- **${G?'レビュー期限':'Review SLA'}**: ${G?'開始から24時間以内':'Within 24h of opening'}

## ${G?'P0/P1/P2 指摘分類':'P0/P1/P2 Classification'}

| ${G?'優先度':'Priority'} | ${G?'定義':'Definition'} | ${G?'アクション':'Action'} |
|---------|---------|---------|
| 🔴 P0 | ${G?'致命的 — セキュリティ脆弱性・データ破損・ビルド失敗':'Critical — security vuln / data loss / build failure'} | ${G?'マージ前に必ず修正':'Must fix before merge'} |
| 🟡 P1 | ${G?'重要 — バグ・型エラー・テスト不足・仕様乖離':'Important — bug / type error / missing tests / spec gap'} | ${G?'今スプリント中に修正':'Fix within current sprint'} |
| 🟢 P2 | ${G?'推奨 — 可読性・命名・コメント・小さなリファクタ':'Recommended — readability / naming / minor refactor'} | ${G?'次スプリント以降 (任意)':'Next sprint (optional)'} |

## ${G?'PRレビュー チェックリスト':'PR Review Checklist'}

### ${G?'機能性 (Functional)':'Functional'}
- [ ] ${G?'.spec/specification.md の要件と整合している':'Matches requirements in .spec/specification.md'}
- [ ] ${G?'正常系・異常系・境界値が実装されている':'Normal/error/boundary cases implemented'}
- [ ] ${G?'エラーハンドリングが適切 (ユーザー向け安全メッセージ)':'Error handling appropriate (safe user-facing messages)'}

### ${G?'セキュリティ (Security)':'Security'}
- [ ] ${G?'ハードコードされたシークレットがない':'No hardcoded secrets'}
- [ ] ${G?'入力値は検証・エスケープされている':'Inputs validated and escaped'}
- [ ] ${G?'認証・認可が全エンドポイントで確認されている':'Auth/authz verified on all endpoints'}
- [ ] ${G?'XSS / CSRF / SQL インジェクション対策済み':'XSS / CSRF / SQL injection mitigated'}

### ${G?'パフォーマンス (Performance)':'Performance'}
- [ ] ${G?'N+1 クエリがない (EXPLAIN または eager-load 確認)':'No N+1 queries (verified with EXPLAIN or eager-load)'}
- [ ] ${G?'不要な再レンダリングがない':'No unnecessary re-renders'}
- [ ] ${G?'大量データはページネーション付き':'Large datasets have pagination'}

### ${G?'コードスタイル (Style)':'Code Style'}
- [ ] TypeScript strict ${G?'モード準拠 (any 型なし)':'mode compliant (no any types)'}
- [ ] ${G?'命名規則 (camelCase 変数/関数, PascalCase クラス/型)':'Naming conventions (camelCase vars/fns, PascalCase classes/types)'}
- [ ] ${G?'マジックナンバーは定数化されている':'Magic numbers extracted to constants'}

### ${G?'テスト (Testing)':'Testing'}
- [ ] ${G?'新規コードにユニットテストが付いている':'Unit tests accompany new code'}
- [ ] ${G?'カバレッジ 80%+ を維持している':'Coverage ≥80% maintained'}
- [ ] ${G?'クリティカルパスに E2E テストがある':'Critical paths have E2E tests'}

## ${G?'ドメイン固有レビュー重点':'Domain-Specific Review Focus'} (${domR})

${G?focusJa:focusEn}

## ${G?'リファクタリング判断基準':'When to Refactor vs. Leave'}

| ${G?'状況':'Situation'} | ${G?'推奨':'Recommendation'} |
|---------|---------|
| ${G?'循環的複雑度 > 10':'Cyclomatic complexity > 10'} | ${G?'♻️ リファクタ (関数分割)':'♻️ Refactor (split function)'} |
| ${G?'重複コード率 > 15%':'Code duplication > 15%'} | ${G?'♻️ リファクタ (共通ユーティリティへ)':'♻️ Refactor (extract utility)'} |
| ${G?'テストカバレッジ < 50%':'Test coverage < 50%'} | ${G?'🧪 テスト追加を優先':'🧪 Prioritize adding tests'} |
| ${G?'リリース直前 (3日以内)':'Near release (≤3 days)'} | ${G?'🚫 リファクタ延期 (Issue登録のみ)':'🚫 Defer refactor (log Issue only)'} |
| ${G?'低リスク・低影響エリア':'Low-risk / low-impact area'} | ${G?'📋 任意 (P2として記録)':'📋 Optional (log as P2)'} |

## ${G?'よくあるレビュー指摘':'Common Review Findings'}

\`\`\`
${G?
'❌ Bad:  if (user.role == "admin")  // 型安全でない\n✅ Good: if (user.role === Role.ADMIN)  // 型定数使用\n\n❌ Bad:  const data = JSON.parse(input)  // エラーハンドリングなし\n✅ Good: const data = _jp(input, null)  // 安全なパース\n\n❌ Bad:  res.json({ error: err.message })  // スタックトレース漏洩リスク\n✅ Good: res.json({ error: "Internal error" })  // 安全なメッセージ':
'❌ Bad:  if (user.role == "admin")  // Not type-safe\n✅ Good: if (user.role === Role.ADMIN)  // Use type constant\n\n❌ Bad:  const data = JSON.parse(input)  // No error handling\n✅ Good: const data = _jp(input, null)  // Safe parse\n\n❌ Bad:  res.json({ error: err.message })  // Stack trace leak risk\n✅ Good: res.json({ error: "Internal error" })  // Safe message'}
\`\`\`
`;
})()],
    ['17_monitoring',G?'監視設計書':'Monitoring Design',(()=>{
  const _sc=a.scale||'medium';
  const _isSolo=_sc==='solo';
  const _isStatic17=/なし（静的|None|static/i.test(be);
  const _slaMap17={solo:'99%',small:'99.5%',medium:'99.9%',large:'99.95%'};
  const _sla=_slaMap17[_sc]||'99.9%';
  const _rtoMap={solo:'4h/4h',small:'2h/2h',medium:'30分/30m',large:'5分/5m'};
  const _rpoMap={solo:'24h',small:'4h',medium:'1h',large:'15分/15m'};
  let d='## '+(G?'監視項目':'Monitoring Items')+'\n';
  d+='- '+(G?'アプリケーションログ':'Application logs')+'\n';
  d+='- '+(G?'エラーレート':'Error rate')+'\n';
  d+='- '+(G?'レスポンスタイム':'Response time')+'\n';
  d+='- CPU/'+(G?'メモリ使用率':'Memory usage')+'\n\n';
  d+='## '+(G?'ツール':'Tools')+'\n';
  d+='- '+(deployTarget.includes('Vercel')?'Vercel Analytics':deployTarget.includes('Netlify')?'Netlify Analytics':'PostHog / Plausible Analytics')+'\n';
  d+='- Sentry ('+(G?'エラー追跡':'Error tracking')+')'+(arch.isBaaS&&be.includes('Supabase')?'\n- Supabase Dashboard ('+(G?'DB監視・RLS監査':'DB monitoring & RLS audit')+')':'')+'\n';
  d+='\n## '+(G?'アラート閾値':'Alert Thresholds')+'\n\n';
  d+='| '+(G?'メトリクス':'Metric')+' | Warning | Critical | '+(G?'対応':'Action')+'  |\n';
  d+='|--------|---------|---------|--------|\n';
  d+='| CPU | 70% | 85% | '+(G?'スケールアップ確認':'Check scale-up')+'  |\n';
  d+='| Memory | 75% | 90% | '+(G?'メモリリーク調査':'Investigate memory leak')+'  |\n';
  d+='| Error Rate | 0.5% | 1% | '+(G?'Sentry確認・ロールバック検討':'Check Sentry / consider rollback')+'  |\n';
  d+='| P95 Response | 1s | 3s | '+(G?'ボトルネック調査':'Investigate bottleneck')+'  |\n';
  d+='| DB Connections | 70% | 90% | '+(G?'接続プール拡張':'Expand connection pool')+'  |\n';
  d+='| Disk Usage | 70% | 85% | '+(G?'ストレージ拡張・ログ削除':'Expand storage / purge logs')+'  |\n';
  if(!_isSolo){
    d+='\n## '+(G?'SLA目標':'SLA Targets')+'\n\n';
    d+='| '+(G?'スケール':'Scale')+' | Availability | RTO | RPO |\n';
    d+='|--------|-------------|-----|-----|\n';
    d+='| solo | 99% | 4h | 24h |\n';
    d+='| small | 99.5% | 2h | 4h |\n';
    d+='| medium | 99.9% | 30m | 1h |\n';
    d+='| large | 99.95% | 5m | 15m |\n';
    d+='\n> '+(G?'現在のスケール: '+_sc+' ('+_sla+' / RTO '+_rtoMap[_sc]+' / RPO '+_rpoMap[_sc]+')':'Current scale: '+_sc+' ('+_sla+' / RTO '+_rtoMap[_sc]+' / RPO '+_rpoMap[_sc]+')')+'\n';
  }
  if(!_isSolo&&!_isStatic17){
    d+='\n## '+(G?'インシデントエスカレーション':'Incident Escalation')+'\n\n';
    d+='| Severity | '+(G?'定義':'Definition')+' | '+(G?'応答時間':'Response')+' | '+(G?'エスカレーション先':'Escalation')+'  |\n';
    d+='|----------|--------|---------|----------------|\n';
    d+='| Sev 1 | '+(G?'本番サービス全停止':'Full prod outage')+' | 15分/15m | '+(G?'PL → PM → 顧客':'TL → PM → Customer')+'  |\n';
    d+='| Sev 2 | '+(G?'主要機能障害':'Major feature down')+' | 1h | '+(G?'担当 → PL':'Assignee → TL')+'  |\n';
    d+='| Sev 3 | '+(G?'パフォーマンス劣化':'Performance degradation')+' | 4h | '+(G?'担当 → PL':'Assignee → TL')+'  |\n';
    d+='| Sev 4 | '+(G?'軽微な問題':'Minor issue')+' | '+(G?'翌営業日':'Next business day')+' | '+(G?'担当':'Assignee')+'  |\n';
  }
  d+='\n## '+(G?'ダッシュボードレイアウト':'Dashboard Layout')+'\n\n';
  const _panels=deployTarget.includes('Vercel')?
    (G?['リクエスト数・エラーレート (Vercel Analytics)','レスポンス時間P50/P95 (Vercel Speed Insights)','Sentry エラー一覧・リグレッション追跡','Core Web Vitals (LCP/CLS/INP)']:['Request count & error rate (Vercel Analytics)','Response time P50/P95 (Vercel Speed Insights)','Sentry error list & regression tracking','Core Web Vitals (LCP/CLS/INP)']):
    deployTarget.includes('Railway')?
    (G?['CPU/メモリ使用率 (Railway Metrics)','PostgreSQL接続数・クエリ時間','Sentry エラー一覧','アクセスログ・レスポンス時間']:['CPU/memory usage (Railway Metrics)','PostgreSQL connections & query time','Sentry error list','Access logs & response time']):
    (G?['サーバーCPU/メモリ','APIレスポンス時間P50/P95','エラーレート・5xxカウント','DBクエリ時間・スロークエリ','アクティブユーザー数']:['Server CPU/memory','API response time P50/P95','Error rate & 5xx count','DB query time & slow queries','Active user count']);
  _panels.forEach((p,i)=>{ d+=(i+1)+'. '+p+'\n'; });
  d+='\n## '+(G?'クロスリファレンス':'Cross Reference')+'\n';
  d+='- docs/105_cost_intelligence.md — '+(G?'コスト最適化':'Cost optimization')+'\n';
  d+='- docs/106_tech_debt_intelligence.md — '+(G?'技術的負債':'Tech debt')+'\n';
  d+='- docs/112_cost_optimization_runbook.md — '+(G?'コスト削減ランブック':'Cost reduction runbook')+'\n';
  return d;
})()],
    ['18_data_migration',G?'データ移行計画書':'Data Migration Plan',(()=>{
  const _sc18=a.scale||'medium';
  const _isSolo18=_sc18==='solo';
  const _isStatic18=/なし（静的|None|static/i.test(be);
  let d='## '+(G?'移行戦略選定':'Migration Strategy Selection')+'\n\n';
  d+='| '+(G?'戦略':'Strategy')+' | '+(G?'概要':'Summary')+' | '+(G?'適用場面':'When to Use')+' | '+(G?'リスク':'Risk')+'  |\n';
  d+='|--------|--------|---------|--------|\n';
  d+='| Big Bang | '+(G?'一括移行 (ダウンタイムあり)':'All-at-once (requires downtime')+') | '+(G?'小規模・Solo':'Small / Solo')+' | '+(G?'高':'High')+'  |\n';
  d+='| Phased | '+(G?'機能単位で段階的移行':'Migrate feature by feature')+' | '+(G?'中規模':'Medium scale')+' | '+(G?'中':'Medium')+'  |\n';
  d+='| Parallel Run | '+(G?'旧新並行稼働・比較検証':'Old+new run simultaneously, compare')+' | '+(G?'大規模・リスク低減必須':'Large / risk-critical')+' | '+(G?'低':'Low')+'  |\n';
  d+='\n> '+(G?'推奨戦略: '+(_isSolo18?'Big Bang (Solo規模)':_sc18==='large'?'Parallel Run':'Phased'):'Recommended: '+(_isSolo18?'Big Bang (solo scale)':_sc18==='large'?'Parallel Run':'Phased'))+'\n';
  if(!_isStatic18){
    d+='\n## '+(G?'Expand-Contractパターン (後方互換移行)':'Expand-Contract Pattern (backward-compatible migration)')+'\n\n';
    d+='```\n'+(G?'Step 1 [Expand]: 新カラム追加 (nullable)\nStep 2 [Migrate]: バックフィル (バッチ / バックグラウンド)\nStep 3 [Switch]:  アプリを新カラム使用に切り替え\nStep 4 [Contract]: 旧カラム削除 (次スプリント以降)':'Step 1 [Expand]: Add new column (nullable)\nStep 2 [Migrate]: Backfill (batch / background)\nStep 3 [Switch]:  Switch app to use new column\nStep 4 [Contract]: Drop old column (next sprint+)')+'\n```\n';
    d+='\n```'+(orm.includes('Prisma')?'prisma':orm.includes('Drizzle')?'ts':'sql')+'\n';
    if(orm.includes('Prisma')){
      d+=(G?'// Step1: schema.prisma に新フィールド追加 (nullable)\n':'// Step1: Add new field to schema.prisma (nullable)\n');
      d+='// email_v2 String?\n';
      d+=(G?'// Step2: マイグレーション実行\n':'// Step2: Run migration\n');
      d+='// npx prisma migrate dev --name add_email_v2\n';
    } else if(orm.includes('Drizzle')){
      d+=(G?'// Step1: schema.ts に新カラム追加\n':'// Step1: Add new column to schema.ts\n');
      d+='// emailV2: text("email_v2")\n';
    } else {
      d+=(G?'-- Step1: 新カラム追加\n':'-- Step1: Add new column\n');
      d+='-- ALTER TABLE users ADD COLUMN email_v2 VARCHAR(255);\n';
    }
    d+='```\n';
  }
  d+='\n## '+(G?'ロールバック手順':'Rollback Procedures')+'\n\n';
  if(be.includes('Supabase')){
    d+='- **Supabase PITR**: '+(G?'Point-in-Time Recovery でスナップショット復元':'Restore from snapshot via Point-in-Time Recovery')+'\n';
    d+='- '+(G?'Supabase Dashboard → Database → Backups から実行':'Supabase Dashboard → Database → Backups')+'\n';
  } else if(be.includes('Firebase')){
    d+='- **Firebase export**: `gcloud firestore export gs://[BUCKET]/[PATH]`\n';
    d+='- '+(G?'Cloud Console から復元操作':'Restore via Cloud Console')+'\n';
  } else {
    d+='- **pg_restore**: `pg_restore -h host -U user -d db backup.dump`\n';
    d+='- '+(G?'移行前にフルバックアップ必須':'Full backup required before migration')+'\n';
  }
  d+='\n## '+(G?'データ検証チェックリスト':'Data Validation Checklist')+'\n\n';
  const _checks=G?[
    '移行前後のレコード件数一致確認',
    'NULL値・デフォルト値の意図的な設定確認',
    '外部キー整合性チェック (FOREIGN KEY)',
    '文字コード・エンコーディング確認 (UTF-8)',
    '日付・タイムゾーン変換の正確性確認',
    '計算フィールド・集計値の再検証',
    'インデックス再構築後のクエリ性能確認',
    'db/seed.json との整合性確認 (開発環境)'
  ]:[
    'Record count matches before/after migration',
    'NULL values and defaults set intentionally',
    'Foreign key integrity check (FOREIGN KEY)',
    'Character encoding verified (UTF-8)',
    'Date/timezone conversion accuracy confirmed',
    'Calculated fields and aggregates re-verified',
    'Query performance confirmed after index rebuild',
    'Consistency with db/seed.json verified (dev env)'
  ];
  _checks.forEach(c=>{ d+='- [ ] '+c+'\n'; });
  d+='\n## '+(G?'クロスリファレンス':'Cross Reference')+'\n';
  d+='- db/seed.json — '+(G?'シードデータ参照':'Seed data reference')+'\n';
  d+='- docs/90_backup_disaster_recovery.md — '+(G?'DR手順':'Disaster recovery procedures')+'\n';
  return d;
})()],
    ['19_performance',G?'パフォーマンス設計書':'Performance Design',(()=>{
  let d='## '+(G?'目標値 (Core Web Vitals)':'Targets (Core Web Vitals)')+'\n';
  d+='- LCP: < 2.5s\n- FID: < 100ms\n- CLS: < 0.1\n\n';
  d+='## '+(G?'最適化施策':'Optimizations')+'\n';
  d+='- '+(G?'画像最適化':'Image optimization')+' ('+(fe.includes('Next')?'next/image':fe.includes('Vite')||fe.includes('SPA')?'vite-imagetools / sharp':'sharp / imagemin')+')\n';
  d+='- Code Splitting'+(fe.includes('Vite')||fe.includes('SPA')?' (Vite dynamic import)':fe.includes('Next')?' (Next.js dynamic)':'')+'\n';
  d+='- '+(deployTarget.includes('Vercel')||deployTarget.includes('Netlify')?'Edge Caching (CDN)':'CDN Caching')+'\n';
  d+='\n## '+(G?'パフォーマンスバジェット':'Performance Budget')+'\n\n';
  d+='| '+(G?'リソース':'Resource')+' | '+(G?'上限':'Budget')+' | '+(G?'計測ツール':'Measure')+'  |\n';
  d+='|---------|--------|--------|\n';
  d+='| JS Bundle | 200KB (gzip) | Lighthouse / bundlesize |\n';
  d+='| CSS | 50KB | PurgeCSS + Lighthouse |\n';
  d+='| Image (per page) | 500KB | Squoosh / '+(fe.includes('Next')?'next/image':'sharp / vite-imagetools')+'  |\n';
  d+='| LCP | < 2.5s | CrUX / Vercel Speed Insights |\n';
  d+='| TTI | < 3.8s | Lighthouse |\n';
  d+='| CLS | < 0.1 | CrUX |\n';
  d+='| FID/INP | < 100ms | CrUX |\n';
  d+='\n## '+(G?'FE別ランタイムチェックリスト':'FE Runtime Checklist')+'\n\n';
  if(fe.includes('Next')){
    d+=(G?'**Next.js 固有**\n- [ ] Server Components でデータフェッチ (クライアントJS削減)\n- [ ] `next/image` で自動WebP変換・遅延読み込み\n- [ ] `next/font` でフォント最適化 (CLS防止)\n- [ ] Route Segment Config で適切なキャッシュ設定\n- [ ] `dynamic()` で非重要コンポーネントを遅延ロード\n- [ ] Partial Prerendering (PPR) 対応検討\n- [ ] Vercel Speed Insights でCWV継続計測\n- [ ] Bundle Analyzer で不要依存を可視化':'**Next.js Specific**\n- [ ] Fetch data in Server Components (reduce client JS)\n- [ ] Use `next/image` for auto WebP and lazy loading\n- [ ] Use `next/font` for font optimization (prevent CLS)\n- [ ] Set appropriate cache with Route Segment Config\n- [ ] Lazy-load non-critical components with `dynamic()`\n- [ ] Consider Partial Prerendering (PPR)\n- [ ] Monitor CWV continuously with Vercel Speed Insights\n- [ ] Visualize unnecessary dependencies with Bundle Analyzer');
  } else if(fe.includes('Vue')||fe.includes('Nuxt')){
    d+=(G?'**Vue / Nuxt 固有**\n- [ ] `<Suspense>` + async components で段階表示\n- [ ] `v-memo` で大規模リスト再描画を抑制\n- [ ] Nuxt: `useLazyFetch` で非同期データ遅延取得\n- [ ] `defineAsyncComponent` で遅延バンドル\n- [ ] Vue DevTools Profiler でコンポーネント計測':'**Vue / Nuxt Specific**\n- [ ] Use `<Suspense>` + async components for progressive rendering\n- [ ] Use `v-memo` to suppress re-renders in large lists\n- [ ] Nuxt: Use `useLazyFetch` for lazy async data\n- [ ] Lazy-bundle with `defineAsyncComponent`\n- [ ] Measure components with Vue DevTools Profiler');
  } else if(fe.includes('Svelte')||fe.includes('SvelteKit')){
    d+=(G?'**Svelte / SvelteKit 固有**\n- [ ] SSR + CSR ハイブリッドでTTI最小化\n- [ ] `{#await}` でローディング状態の明示\n- [ ] ストア更新の最小化 (不要なリアクティビティ排除)\n- [ ] SvelteKit: preload/prefetch でルート先読み':'**Svelte / SvelteKit Specific**\n- [ ] Minimize TTI with SSR + CSR hybrid\n- [ ] Show loading state explicitly with `{#await}`\n- [ ] Minimize store updates (avoid unnecessary reactivity)\n- [ ] SvelteKit: preload/prefetch for route pre-loading');
  } else {
    d+=(G?'**React SPA 固有**\n- [ ] `React.lazy` + Suspense でコード分割\n- [ ] `useMemo` / `useCallback` で不要再レンダリング防止\n- [ ] TanStack Query でサーバー状態のキャッシュ\n- [ ] `React.memo` でコンポーネントメモ化\n- [ ] Vite Bundle Analyzer で依存確認':'**React SPA Specific**\n- [ ] Code-split with `React.lazy` + Suspense\n- [ ] Prevent unnecessary re-renders with `useMemo` / `useCallback`\n- [ ] Cache server state with TanStack Query\n- [ ] Memoize components with `React.memo`\n- [ ] Check dependencies with Vite Bundle Analyzer');
  }
  d+='\n\n## '+(G?'P25クロスリファレンス (パフォーマンス詳細)':'P25 Cross Reference (Performance Details)')+'\n\n';
  d+='- docs/99_performance_budget.md — '+(G?'詳細バジェット設定とCI計測':'Detailed budget config and CI measurement')+'\n';
  d+='- docs/100_web_vitals_optimization.md — '+(G?'CWV最適化実装例':'CWV optimization examples')+'\n';
  d+='- docs/101_caching_strategy.md — '+(G?'CDN・APIキャッシュ戦略':'CDN & API caching strategy')+'\n';
  d+='- docs/102_database_performance.md — '+(G?'DBインデックス・クエリ最適化':'DB index & query optimization')+'\n';
  return d;
})()],
    ['20_a11y',G?'アクセシビリティ設計書':'Accessibility Design',(()=>{const _a11yDom=detectDomain(a.purpose||'');const _a11ySpec=_a11yDom==='fintech'?(G?'- 取引完了・エラーは aria-live="assertive" で即時通知\n- 認証フォームは autocomplete 属性付与 (current-password等)\n- 色だけでリスク情報を伝えない（アイコン+テキスト併用）':'- Transaction status/errors must use aria-live="assertive"\n- Auth forms require autocomplete attributes\n- Never convey risk via color alone (use icon+text)'):_a11yDom==='health'?(G?'- 緊急・警告情報は aria-live="assertive" で即時通知\n- 重要情報のコントラスト比は 7:1+ (AAA目標)\n- 医療用語には <abbr> タグと説明テキスト付与':'- Critical alerts must use aria-live="assertive"\n- Target 7:1+ (AAA) contrast for critical info\n- Use <abbr> with expansion for medical terms'):_a11yDom==='education'?(G?'- 動画コンテンツには字幕・文字起こし必須\n- キーボードのみでコース全体を完結できること\n- 認知負荷軽減: 1ページ1タスク原則':'- Videos require captions and transcripts\n- Full keyboard-only course completion required\n- One task per page to reduce cognitive load'):_a11yDom==='ec'?(G?'- カートへの追加操作後は aria-live でフィードバック通知\n- 商品フィルタはキーボードで操作可能\n- 購入フローの全ステップでエラー回復が可能':'- Cart updates must trigger aria-live feedback\n- Product filters must be keyboard operable\n- All checkout steps support error recovery'):(G?'- フォームフィールドには aria-label または <label> 必須\n- エラーメッセージは aria-describedby でフィールドに関連付け\n- モーダルはフォーカストラップを実装必須':'- Every form field needs aria-label or <label>\n- Error messages linked via aria-describedby\n- Modals must implement focus trap');return `## WCAG 2.2 AA ${G?'チェックリスト':'Checklist'}\n\n| ${G?'基準':'Criteria'} | ${G?'詳細':'Detail'} | ${G?'テスト方法':'Test Method'} |\n|---|---|---|\n| 1.1.1 ${G?'代替テキスト':'Alt Text'} | ${G?'全画像にalt属性':'alt on all images'} | axe-core |\n| 1.4.3 ${G?'コントラスト':'Contrast'} | ${G?'通常テキスト 4.5:1+':'Normal text 4.5:1+'} | Lighthouse |\n| 2.1.1 ${G?'キーボード':'Keyboard'} | ${G?'全機能キーボード操作可':'All functions keyboard accessible'} | ${G?'手動テスト':'Manual'} |\n| 2.4.3 ${G?'フォーカス順序':'Focus Order'} | ${G?'論理的なタブ順序':'Logical tab order'} | ${G?'手動テスト':'Manual'} |\n| 3.3.1 ${G?'エラー通知':'Error ID'} | ${G?'エラー箇所を明示':'Identify input errors'} | axe-core |\n| 4.1.3 ${G?'ステータス通知':'Status Msg'} | aria-live | axe-core |\n\n## ${G?'ドメイン固有 A11y 要件':'Domain-Specific A11y Requirements'} (${_a11yDom||G?'汎用':'generic'})\n\n${_a11ySpec}${(a.mobile&&!/なし|none/i.test(a.mobile)&&/expo|react.?native|flutter/i.test(a.mobile))?'\n\n## '+(G?'モバイル HIG / Android Quality Guidelines':'Mobile HIG / Android Quality Guidelines')+'\n- '+(G?'Apple HIG: ネイティブコントロール使用・セーフエリア対応・最小タップターゲット 44×44pt':'Apple HIG: use native controls, support safe area, min tap target 44×44pt')+'\n- '+(G?'Material Design 3: 最小タップターゲット 48×48dp・バックジェスチャー対応':'Material Design 3: min tap target 48×48dp, support back gesture'):''}\n\n## ${G?'スクリーンリーダーテスト手順':'Screen Reader Test Procedures'}\n\n| ${G?'ツール':'Tool'} | ${G?'対象':'Platform'} | ${G?'テスト観点':'Test Points'} |\n|------|--------|----------|\n| VoiceOver | iOS / macOS | ${G?'読み上げ順序・アクション確認':'Reading order & action confirmation'} |\n| TalkBack | Android | ${G?'タップジェスチャー・フォーカス移動':'Tap gestures & focus navigation'} |\n| NVDA | Windows | ${G?'フォームラベル・エラー通知':'Form labels & error announcements'} |\n\n## ${G?'自動テストツール':'Automated A11y Testing'}\n\n\`\`\`bash\n# axe-core (${G?'ユニットテスト統合':'unit test integration'})\nnpm install @axe-core/react --save-dev\n\n# Lighthouse ${G?'アクセシビリティスコア確認':'accessibility score'}\nnpx lighthouse http://localhost:3000 --only-categories=accessibility\n\n# pa11y ${G?'バッチ検証':'batch validation'}\nnpx pa11y http://localhost:3000\n\`\`\`\n\n## ${G?'AI アクセシビリティ監査プロンプト':'AI Accessibility Audit Prompt'}\n\n\`\`\`\n${G?'以下のコンポーネントを WCAG 2.2 AA 基準で診断してください。\n[コードを貼り付け]\n確認項目: aria属性の不足・キーボードフォーカス・コントラスト・エラー関連付け・aria-live\n修正コードも合わせて提示してください。':'Diagnose this component for WCAG 2.2 AA compliance.\n[Paste component code]\nCheck: missing aria attrs, keyboard focus, contrast, error associations, aria-live\nProvide corrected code for each issue found.'}\n\`\`\``;})()],
    ['21_changelog',G?'変更履歴':'Changelog',(()=>{
  const _sc=a.scale||'medium';
  const _cadence=_sc==='solo'?( G?'アドホック (機能完成時)':'Ad-hoc (on feature complete)'):_sc==='large'?( G?'継続的デプロイ (CI/CD自動)':'Continuous deployment (CI/CD auto)'):( G?'週次スプリント毎':'Weekly per sprint');
  let d='# '+pn+' — '+(G?'変更履歴':'Changelog')+'\n';
  d+='> '+(G?'セマンティックバージョニング (MAJOR.MINOR.PATCH) 準拠':'Follows Semantic Versioning (MAJOR.MINOR.PATCH)')+'\n\n';
  d+='## [Unreleased]\n\n';
  d+='### '+(G?'追加予定':'Planned Additions')+'\n';
  d+=(features.length>3?features.slice(3).map(f=>'- '+f).join('\n'):('- '+(G?'今後のロードマップを参照':'See future roadmap')))+'\n\n---\n\n';
  d+='## [1.0.0] — '+date+'\n\n';
  d+='### '+(G?'追加 (Added)':'Added')+'\n';
  d+='- '+(G?'初期リリース — コア機能実装完了':'Initial release — core features implemented')+'\n';
  d+=features.slice(0,5).map(f=>'- '+f).join('\n')+'\n\n';
  d+='### '+(G?'技術スタック':'Tech Stack')+'\n';
  d+='- Frontend: '+fe+' | Backend: '+be+' | DB: '+dbName+' | Deploy: '+deployTarget+'\n\n---\n\n';
  d+='## '+(G?'バージョニングポリシー':'Versioning Policy')+'\n\n';
  d+='| '+(G?'変更種別':'Change Type')+' | '+(G?'バージョン':'Version')+' | '+(G?'例':'Example')+'|\n|---|---|---|\n';
  d+='| '+(G?'破壊的変更 (API署名変更等)':'Breaking change (API rename)')+' | MAJOR | 1.0.0 → 2.0.0 |\n';
  d+='| '+(G?'後方互換の新機能追加':'Backward-compatible feature')+' | MINOR | 1.0.0 → 1.1.0 |\n';
  d+='| '+(G?'バグ修正':'Bug fix')+' | PATCH | 1.0.0 → 1.0.1 |\n\n';
  d+='## '+(G?'Conventional Commits 参照':'Conventional Commits')+'\n\n```\n';
  d+='feat:   '+(G?'新機能 → MINOR バンプ':'New feature → MINOR bump')+'\n';
  d+='fix:    '+(G?'バグ修正 → PATCH バンプ':'Bug fix → PATCH bump')+'\n';
  d+='feat!:  '+(G?'破壊的変更 → MAJOR バンプ':'Breaking change → MAJOR bump')+'\n';
  d+='docs:   '+(G?'ドキュメント更新 (バンプなし)':'Docs update (no bump)')+'\n';
  d+='chore:  '+(G?'ビルド・CI変更':'Build/CI changes')+'\n```\n\n';
  d+='## '+(G?'リリースケイデンス':'Release Cadence')+'\n\n';
  d+='| '+(G?'スケール':'Scale')+' | '+(G?'ケイデンス':'Cadence')+' | '+(G?'タグ戦略':'Tagging')+'|\n|------|------|------|\n';
  d+='| Solo | '+(G?'アドホック':'Ad-hoc')+' | '+(G?'手動タグ':'Manual tag')+'|\n';
  d+='| Small | '+(G?'週次':'Weekly')+' | '+(G?'スプリント終了時':'End of sprint')+'|\n';
  d+='| Large | '+(G?'継続的':'Continuous')+' | '+(G?'CI/CD自動':'CI/CD auto')+'|\n\n';
  d+='> '+(G?'このプロジェクトのケイデンス':'This project cadence')+': **'+_cadence+'**\n\n';
  d+='## '+(G?'Breaking Change ポリシー':'Breaking Change Policy')+'\n\n';
  d+='```\n'+(G?'Deprecation → Migration Guide → Removal の3ステップ':'Deprecation → Migration Guide → Removal (3 steps)')+'\n';
  d+=(G?'1. Deprecation Notice: 次期バージョンで廃止予告 (MINOR + ⚠️ warning)':'1. Deprecation Notice: Announce in next version (MINOR + ⚠️ warning)')+'\n';
  d+=(G?'2. Migration Guide: docs/変更内容.md に移行手順を記載':'2. Migration Guide: Document migration steps in docs/')+'\n';
  d+=(G?'3. Removal: 2 MINOR バージョン後に削除 (MAJOR バンプ)':'3. Removal: Delete after 2 MINOR versions (MAJOR bump)')+'\n```\n\n';
  d+='## '+(G?'自動リリースノート (release-drafter)':'Auto Release Notes (release-drafter)')+'\n\n';
  d+='```yaml\n# .github/release-drafter.yml\nname-template: \'v$RESOLVED_VERSION\'\ntag-template: \'v$RESOLVED_VERSION\'\ncategories:\n  - title: \'🚀 Features\'\n    labels: [\'feat\', \'feature\']\n  - title: \'🐛 Bug Fixes\'\n    labels: [\'fix\']\n  - title: \'📝 Docs\'\n    labels: [\'docs\']\n```\n\n';
  d+='## '+(G?'バージョン戦略 (SemVer vs CalVer)':'Version Strategy (SemVer vs CalVer)')+'\n\n';
  d+='| '+(G?'戦略':'Strategy')+' | '+(G?'適合ユースケース':'Best For')+' | '+(G?'例':'Example')+'|\n|------|------|------|\n';
  d+='| SemVer | '+(G?'APIを公開するSaaS・ライブラリ':'Public API SaaS / Libraries')+' | 2.3.1 |\n';
  d+='| CalVer | '+(G?'内部ツール・定期リリース':'Internal tools / regular releases')+' | 2026.03.1 |\n\n';
  d+='## '+(G?'AI 変更履歴生成プロンプト':'AI Changelog Generation Prompt')+'\n\n```\n';
  d+=(G?'次の git log を CHANGELOG.md 形式に整形してください。\n[git log --oneline --since="2weeks"]\nルール: feat→Added, fix→Fixed, feat!→MAJOR バンプ, 各エントリ1行で簡潔に':'Format this git log as CHANGELOG.md.\n[Paste: git log --oneline --since="2weeks"]\nRules: feat→Added, fix→Fixed, feat!→MAJOR bump, each entry one concise line')+'\n```';
  return d;
})()],
    ['24_progress',G?'進捗管理表':'Progress Tracker',
  `${G?'> AIエージェントはタスク完了後にこのファイルを更新してください。':
       '> AI agents should update this file after completing each task.'}

## ${G?'凡例':'Legend'}
- [ ] ${G?'未着手':'Not started'} / [x] ${G?'完了':'Done'}

## Sprint 0: ${G?'環境構築':'Setup'}
- [ ] ${G?'リポジトリ初期化':'Repo init'}
- [ ] DevContainer ${G?'構築':'setup'}
- [ ] CI/CD
- [ ] ${G?'DBスキーマ':'DB schema'}
- [ ] ${G?'認証基盤':'Auth'} (${auth.sot})

## Sprint 1-2: ${G?'機能開発':'Features'}
${features.map(f=>'- [ ] '+f).join('\n')}

## Sprint 3: ${G?'テスト・リリース':'Test & Release'}
- [ ] ${G?'テスト 80%+':'Tests 80%+'}
- [ ] E2E
- [ ] ${G?'パフォーマンス最適化':'Perf optimization'}
- [ ] ${G?'本番デプロイ':'Production deploy'}

## ${G?'サマリー':'Summary'}
| ${G?'フェーズ':'Phase'} | ${G?'完了':'Done'} | ${G?'合計':'Total'} |
|---|---|---|
| Sprint 0 | 0 | 5 |
| Sprint 1-2 | 0 | ${features.length} |
| Sprint 3 | 0 | 4 |

## ${G?'更新履歴':'Log'}
| ${G?'日付':'Date'} | ${G?'内容':'Update'} | ${G?'更新者':'By'} |
|---|---|---|
| ${date} | ${G?'初期生成':'Initial'} | DevForge |

## ${G?'KPI 追跡':'KPI Tracking'}

| KPI | ${G?'目標':'Target'} | ${G?'現状':'Actual'} |
|---|---|---|
| ${G?'テストカバレッジ':'Test Coverage'} | ≥80% | - |
| Lighthouse | ≥90 | - |
| ${G?'バンドルサイズ':'Bundle Size'} | <500KB | - |
| ${G?'API レスポンス (p95)':'API Response (p95)'} | <500ms | - |

## ${G?'ベロシティ追跡':'Velocity Tracking'}

| Sprint | ${G?'計画 (h)':'Planned (h)'} | ${G?'実績 (h)':'Actual (h)'} | ${G?'完了率':'Done %'} |
|---|---|---|---|
| Sprint 0 | 10 | - | - |
| Sprint 1-2 | ${taskList.filter(t=>t.label==='feature').reduce((s,t)=>s+t.hours,0)} | - | - |
| Sprint 3 | 20 | - | - |

## ${G?'AI 更新プロトコル':'AI Update Protocol'}

\`\`\`
${G?`タスク完了後に以下の手順でこのファイルを更新してください:
1. 完了タスクの [ ] を [x] に変更
2. サマリーテーブルの Done 数を更新
3. ベロシティの実績 (h) を記入
4. KPI の現状値を記入 (カバレッジ・Lighthouse スコア)

プロンプト例:
docs/24_progress.md を更新: Sprint 1 の [機能名] を完了。
実績: 8h。カバレッジ: 82%。Lighthouse: 91。日付: ${date}。`:`After completing each task, update this file:
1. Change [ ] to [x] for completed items
2. Update Done count in the summary table
3. Record actual velocity (h) for the sprint
4. Record KPI values (coverage, Lighthouse score)

Example prompt:
Update docs/24_progress.md: mark [Feature] done in Sprint 1.
Actual: 8h. Coverage: 82%. Lighthouse: 91. Date: ${date}.`}
\`\`\`

## ${G?'リスク追跡テーブル':'Risk Tracking Table'}

| ID | ${G?'リスク':'Risk'} | ${G?'確率':'Probability'} | ${G?'影響':'Impact'} | ${G?'緩和策':'Mitigation'} | ${G?'状態':'Status'} |
|----|----|----|----|----|----|
| R-01 | ${G?'要件変更':'Scope change'} | Medium | High | ${G?'週次レビュー':'Weekly review'} | Open |
| R-02 | ${G?'技術的負債':'Tech debt'} | High | Medium | ${G?'リファクタ Sprint':'Refactor sprint'} | Open |
| R-03 | ${G?'キーマン不在':'Key person absence'} | Low | High | ${G?'ドキュメント整備':'Documentation'} | Open |

## ${G?'ブロッカー管理':'Blocker Management'}

| ID | ${G?'説明':'Description'} | ${G?'オーナー':'Owner'} | ${G?'起票日':'Created'} | ${G?'状態':'Status'} |
|----|----|----|----|----|
| B-01 | ${G?'(ブロッカー発生時に記録)':'(Record when blocker occurs)'} | - | - | Open |

## ${G?'バーンダウンデータ':'Burndown Data'}

| Sprint | ${G?'計画h':'Planned h'} | ${G?'実績h':'Actual h'} | ${G?'残h':'Remaining h'} |
|--------|--------|--------|--------|
| Sprint 0 | 10 | - | - |
| Sprint 1 | ${Math.round(taskList.filter(t=>t.label==='feature').reduce((s,t)=>s+t.hours,0)*0.5)} | - | - |
| Sprint 2 | ${Math.round(taskList.filter(t=>t.label==='feature').reduce((s,t)=>s+t.hours,0)*0.5)} | - | - |
| Sprint 3 | 20 | - | - |

> ${G?'参照':'See also'}: docs/14_risk.md | docs/23_tasks.md`],
    ['25_error_logs',G?'エラーログ':'Error Logs',
  `${G?'> 解決済みエラーをここに記録し、再発を防いでください。':
       '> Log resolved errors here to prevent recurrence.'}

## ${G?'記録フォーマット':'Format'}

### [${G?'日付':'Date'}] ${G?'エラー概要':'Summary'}
- **${G?'症状':'Symptom'}**:
- **${G?'原因':'Cause'}**:
- **${G?'解決策':'Fix'}**:
- **${G?'防止策':'Prevention'}**:
- **${G?'ファイル':'Files'}**: \`path/to/file\`

---
## ${G?'記録例':'Example'}

### [${date}] ${arch.isBaaS?(G?'RLSポリシーエラー':'RLS Policy Error'):(G?'API認証エラー':'API Auth Error')}
- **${G?'症状':'Symptom'}**: ${arch.isBaaS?(G?'INSERT時に403':'403 on INSERT'):(G?'401 Unauthorized':'401 Unauthorized')}
- **${G?'原因':'Cause'}**: ${arch.isBaaS?(G?'auth.uid()チェック不足':'Missing auth.uid() check'):(G?'トークン検証ミドルウェア未適用':'Missing auth middleware')}
- **${G?'解決策':'Fix'}**: ${arch.isBaaS?'\\`WITH CHECK (auth.uid() = user_id)\\`':'\\`app.use(authMiddleware)\\`'}
- **${G?'防止策':'Prevention'}**: ${arch.isBaaS?(G?'新テーブルには必ずRLSテンプレート適用':'Always apply RLS template for new tables'):(G?'新ルートには必ずauthMiddleware適用':'Always apply authMiddleware to new routes')}

---
## ${G?'パターン別':'By Pattern'}

### ${G?'認証・認可':'Auth'}
_(${G?'追記してください':'Add entries here'})_

### ${G?'データベース':'Database'}
_(${G?'追記してください':'Add entries here'})_

### ${G?'デプロイ':'Deploy'}
_(${G?'追記してください':'Add entries here'})_

---

## ${G?'Severity 分類':'Severity Classification'}

| Severity | ${G?'定義':'Definition'} | ${G?'対応時間':'Response Time'} | ${G?'例':'Example'} |
|---|---|---|---|
| 🔴 CRITICAL | ${G?'サービス停止・データ損失':'Service outage / data loss'} | ${G?'即時':'Immediately'} | ${G?'DB接続失敗・支払い処理エラー':'DB connection fail, payment error'} |
| 🟠 HIGH | ${G?'主要機能停止・セキュリティ脆弱性':'Major feature down / security vuln'} | ${G?'2h以内':'Within 2h'} | ${G?'認証失敗・API全断':'Auth failure, API outage'} |
| 🟡 MEDIUM | ${G?'機能劣化・パフォーマンス低下':'Feature degraded / perf drop'} | ${G?'24h以内':'Within 24h'} | ${G?'遅延増加・一部機能不具合':'Latency spike, partial feature bug'} |
| 🟢 LOW | ${G?'軽微・UI不具合':'Minor / UI glitch'} | ${G?'次スプリント':'Next sprint'} | ${G?'スタイル崩れ・誤字':'Style issue, typo'} |

## ${G?'既知のドメイン別エラーパターン':'Known Domain Error Patterns'}

${arch.isBaaS?
(G?`### Supabase / Firebase
- **RLS Policy Error (403)**: INSERT/UPDATE 時に auth.uid() チェック漏れ → \`WITH CHECK (auth.uid() = user_id)\` を追加
- **JWT Expiry (401)**: セッション期限切れ → クライアント側リフレッシュロジックを確認
- **Rate Limit (429)**: 短時間の大量リクエスト → キャッシュレイヤー追加またはバッチ化`:
`### Supabase / Firebase
- **RLS Policy Error (403)**: Missing auth.uid() check on INSERT/UPDATE → add \`WITH CHECK (auth.uid() = user_id)\`
- **JWT Expiry (401)**: Session expired → verify client-side refresh logic
- **Rate Limit (429)**: Too many requests → add cache layer or batch requests`):
(G?`### REST API (${be})
- **401 Unauthorized**: authMiddleware 未適用のルート → 全ルートへの適用を確認
- **N+1 Query**: ループ内 DB クエリ → eager-load または DataLoader で解決
- **Connection Pool Exhausted**: 長時間トランザクション → タイムアウト設定・プール上限を確認`:
`### REST API (${be})
- **401 Unauthorized**: Route missing authMiddleware → verify all routes apply auth
- **N+1 Query**: DB queries inside loops → use eager-load or DataLoader
- **Connection Pool Exhausted**: Long transactions → set query timeout, increase pool limit`)}

## ${G?'AI エラー分析プロンプト':'AI Error Analysis Prompt'}

\`\`\`
${G?`以下のエラーを診断して原因と修正策を提示してください。

[エラーログ・スタックトレースを貼り付け]

手順:
1. docs/25_error_logs.md を参照し既知パターンと照合
2. 根本原因を特定 (コード/設定/インフラ)
3. 修正パッチを提示
4. 再発防止策を提案
5. docs/25_error_logs.md に新規エントリとして追記`:`Diagnose the following error and provide root cause and fix.

[Paste error log / stack trace]

Steps:
1. Check docs/25_error_logs.md for known patterns
2. Identify root cause (code / config / infrastructure)
3. Provide fix patch
4. Suggest prevention strategy
5. Append a new entry to docs/25_error_logs.md`}
\`\`\``],
    ['28_qa_strategy',G?'QA戦略・バグ検出ガイド':'QA Strategy & Bug Detection Guide',(()=>{
  const domain=detectDomain(a.purpose||'');
  const qa=domain?getDomainQA(domain,G):null;
  if(qa){
    const priObj={};qa.priority.split('|').forEach(p=>{const[k,v]=p.split(':');priObj[k]=v;});
    return `${G?'## 対象ドメイン':'## Target Domain'}\n**${domain}**\n\n${G?'💡 **詳細なQA戦略は `docs/32_qa_blueprint.md` と `docs/33_test_matrix.md` を参照**':'💡 **See `docs/32_qa_blueprint.md` and `docs/33_test_matrix.md` for detailed QA strategies**'}\n\n${G?'## QA重点領域':'## QA Focus Areas'}\n${qa.focus.map((f,i)=>`${i+1}. ${f}`).join('\n')}\n\n${G?'## よくあるバグパターン':'## Common Bug Patterns'}\n${qa.bugs.map((b,i)=>`- **${G?'パターン':'Pattern'} ${i+1}**: ${b}`).join('\n')}\n\n${G?'## 業界横断チェックリスト':'## Cross-Cutting Checklist'}\n${qa.crossCutting.length>0?qa.crossCutting.map((c,i)=>`${i+1}. ${c}`).join('\n'):(G?'該当なし':'None applicable')}\n\n${G?'## 優先度マトリクス':'## Priority Matrix'}\n| ${G?'カテゴリ':'Category'} | ${G?'優先度':'Priority'} |\n|----------|----------|\n| ${G?'セキュリティ':'Security'} | ${priObj.Security||'MED'} |\n| ${G?'パフォーマンス':'Performance'} | ${priObj.Performance||'MED'} |\n| ${G?'データ整合性':'Data Integrity'} | ${priObj.DataIntegrity||'MED'} |\n| UX | ${priObj.UX||'MED'} |\n| ${G?'コンプライアンス':'Compliance'} | ${priObj.Compliance||'LOW'} |\n\n${G?'## テスト実行順序':'## Test Execution Order'}\n${G?'優先度に基づいた推奨実行順序:':'Recommended execution order by priority:'}\n1. ${priObj.Security==='CRITICAL'||priObj.DataIntegrity==='CRITICAL'?(G?'セキュリティ・データ整合性テスト':'Security & Data Integrity tests'):priObj.UX==='CRITICAL'?(G?'UXテスト':'UX tests'):(G?'パフォーマンステスト':'Performance tests')}\n2. ${priObj.Performance==='HIGH'||priObj.Security==='HIGH'?(G?'パフォーマンス・セキュリティテスト':'Performance & Security tests'):(G?'機能テスト':'Functional tests')}\n3. ${G?'統合テスト':'Integration tests'}\n4. ${G?'回帰テスト':'Regression tests'}\n\n${G?'## 参考リソース':'## References'}\n- ${G?'詳細QAブループリント':'Detailed QA Blueprint'}: docs/32_qa_blueprint.md\n- ${G?'具体的テストマトリクス':'Concrete Test Matrix'}: docs/33_test_matrix.md\n- OWASP Top 10: https://owasp.org/www-project-top-ten/\n- ${domain==='education'?'FERPA Compliance':domain==='health'?'HIPAA Compliance':domain==='fintech'?'PCI DSS Compliance':domain==='hr'?'GDPR/CCPA Compliance':domain==='saas'?'SOC 2 Compliance':'Industry Best Practices'}`;
  }
  return `${G?'## 汎用QAチェックリスト':'## Generic QA Checklist'}\n\n${G?'ドメイン未検出のため、汎用的なQA項目を記載します。':'Domain not detected. Generic QA items listed below.'}\n\n### ${G?'機能テスト':'Functional Testing'}\n- [ ] ${G?'全機能の正常系動作確認':'Verify all features work (happy path)'}\n- [ ] ${G?'エラーハンドリング検証':'Error handling validation'}\n- [ ] ${G?'境界値テスト':'Boundary value testing'}\n\n### ${G?'セキュリティ':'Security'}\n- [ ] ${G?'認証・認可テスト':'Auth/authz testing'}\n- [ ] ${G?'入力バリデーション':'Input validation'}\n- [ ] XSS/CSRF ${G?'対策確認':'prevention check'}\n- [ ] ${G?'機密情報の漏洩チェック':'Sensitive data leakage check'}\n\n### ${G?'パフォーマンス':'Performance'}\n- [ ] ${G?'レスポンスタイム測定':'Response time measurement'}\n- [ ] ${G?'高負荷テスト':'Load testing'}\n- [ ] ${G?'メモリリーク検出':'Memory leak detection'}\n\n### ${G?'互換性':'Compatibility'}\n- [ ] ${G?'ブラウザ別動作確認':'Cross-browser testing'}\n- [ ] ${G?'モバイル対応確認':'Mobile responsiveness'}\n- [ ] ${G?'アクセシビリティ (WCAG)':'Accessibility (WCAG)'}\n\n### ${G?'データ整合性':'Data Integrity'}\n- [ ] ${G?'トランザクション完全性':'Transaction integrity'}\n- [ ] ${G?'データ同期確認':'Data sync validation'}\n- [ ] ${G?'バックアップ・リストア検証':'Backup/restore verification'}`;
})()],
    ['31_industry_playbook',G?'業種別実装プレイブック':'Industry Implementation Playbook',(()=>{
  const domain=detectDomain(a.purpose)||'_default';
  const pb=DOMAIN_PLAYBOOK[domain]||DOMAIN_PLAYBOOK._default;
  const qa=domain!=='_default'?getDomainQA(domain,G):null;
  const rf=REVERSE_FLOW_MAP[domain]||REVERSE_FLOW_MAP._default;
  let s=`${G?'## 🎯 対象ドメイン':'## 🎯 Target Domain'}\n**${domain}**${domain==='_default'?(G?' (汎用)':' (generic)'):''}\n\n${G?'## 📐 実装レベル・リバースフロー':'## 📐 Implementation-Level Reverse Flow'}\n${G?'ゴールから逆算した具体的な実装パターン:':'Concrete implementation patterns reverse-engineered from goals:'}\n\n${(G?pb.impl_ja:pb.impl_en).map((p,i)=>`${i+1}. ${p}`).join('\n\n')}\n\n`;
  if(qa){
    const priObj={};qa.priority.split('|').forEach(p=>{const[k,v]=p.split(':');priObj[k]=v;});
    s+=`${G?'## 🧪 QA優先度マトリクス':'## 🧪 QA Priority Matrix'}\n| ${G?'カテゴリ':'Category'} | ${G?'優先度':'Priority'} |\n|----------|----------|\n| ${G?'セキュリティ':'Security'} | ${priObj.Security||'MED'} |\n| ${G?'パフォーマンス':'Performance'} | ${priObj.Performance||'MED'} |\n| ${G?'データ整合性':'Data Integrity'} | ${priObj.DataIntegrity||'MED'} |\n| UX | ${priObj.UX||'MED'} |\n| ${G?'コンプライアンス':'Compliance'} | ${priObj.Compliance||'LOW'} |\n\n${G?'**重点領域**:':'**Focus Areas**:'}\n${qa.focus.map((f,i)=>`- ${f}`).join('\n')}\n\n`;
  }
  s+=`${G?'## 🐛 予測バグTOP3と予防策':'## 🐛 Top 3 Predicted Bugs & Prevention'}\n${G?'この業種で最も発生しやすいバグと対策:':'Most common bugs in this industry and countermeasures:'}\n\n${(G?pb.prevent_ja:pb.prevent_en).map((p,i)=>{const[bug,fix]=p.split('|');return `### ${i+1}. ${bug}\n${fix}`;}).join('\n\n')}\n\n${G?'## 📜 コンプライアンス・チェックリスト':'## 📜 Compliance Checklist'}\n${(G?pb.compliance_ja:pb.compliance_en).map((c,i)=>`- [ ] ${c}`).join('\n')}\n\n${G?'## 🧠 コンテキスト・エンジニアリング・プロトコル':'## 🧠 Context Engineering Protocol'}\n${G?'タスクごとに読むべきドキュメント:':'Documents to read per task type:'}\n\n| ${G?'タスク種別':'Task Type'} | ${G?'参照ドキュメント':'Reference Documents'} |\n|----------|----------|\n${(G?pb.ctx_ja:pb.ctx_en).map(c=>{const[task,docs]=c.split('→');return `| ${task} | ${docs} |`;}).join('\n')}\n\n${G?'## 🎨 カスタムスキル設計図':'## 🎨 Custom Skill Blueprint'}\n${G?'この業種に特化したAIスキル定義:':'Domain-specific AI skill definition:'}\n\n`;
  const skillStr=G?pb.skill_ja:pb.skill_en;
  if(skillStr&&typeof skillStr==='string'&&skillStr!==''){
    const skill=skillStr.split('|');
    s+=`**${G?'役割':'Role'}**: ${skill[0]}\n\n**${G?'目的':'Purpose'}**: ${skill[1]}\n\n**${G?'入力':'Input'}**: ${skill[2]}\n\n**${G?'判断基準':'Judgment Criteria'}**: ${skill[3]}\n\n**${G?'出力':'Output'}**: ${skill[4]}\n\n`;
  }
  s+=`${G?'## 🔄 コンテキスト・ローテーション戦略':'## 🔄 Context Rotation Strategy'}\n\n${G?'**4原則** (コンテキストウィンドウを溢れさせない方法):':'**4 Principles** (how to prevent context window overflow):'}\n\n1. **Write (${G?'記述':'Documentation'})**: ${G?'脳内の仕様を `docs/` に書き出す。AIの外部記憶として機能。':'Write specifications from your mind into `docs/`. Functions as AI external memory.'}\n2. **Select (${G?'選択':'Selection'})**: ${G?'必要なファイルだけ読み込ませる。上記の「タスク別参照ドキュメント」を活用。':'Load only necessary files. Use "Documents per Task Type" table above.'}\n3. **Compress (${G?'圧縮':'Compression'})**: ${G?'履歴が肥大化したら要約し、エッセンスだけ残す。長い会話は定期的に圧縮。':'When history bloats, summarize and keep essence only. Compress long conversations periodically.'}\n4. **Isolate (${G?'分離':'Isolation'})**: ${G?'調査・実験はサブエージェント (Task tool) で実行。結論だけメインコンテキストに持ち帰る。':'Run research/experiments in sub-agents (Task tool). Bring back only conclusions to main context.'}\n\n${G?'## 📊 KPI参考値':'## 📊 KPI Reference Values'}\n${G?'この業種の典型的なKPI目標値:':'Typical KPI targets for this domain:'}\n\n${(G?rf.kpi_ja:rf.kpi_en).map((k,i)=>`- ${k}`).join('\n')}\n\n${G?'## 💡 推奨事項':'## 💡 Recommendations'}\n${G?'- 実装前に `docs/architecture.md` と `docs/design_system.md` を必ず読み、既存パターンに従う':'- Read `docs/architecture.md` and `docs/design_system.md` before implementation, follow existing patterns'}\n${G?'- バグ発生時は `docs/error_logs.md` に記録し、再発防止策を明記':'- When bugs occur, record in `docs/error_logs.md` with prevention strategies'}\n${G?'- 進捗は `docs/progress.md` を随時更新し、プロジェクトの現在地を明確化':'- Update `docs/progress.md` frequently to clarify project status'}\n${G?'- コンプライアンス要件は設計段階から考慮し、後付け対応を避ける':'- Consider compliance requirements from design phase, avoid retrofitting'}`;
  return s;
})()],
  ];
  docTemplates.forEach(([file,title,content])=>{
    S.files[`docs/${file}.md`]=`# ${pn} — ${title}\n> ${date}\n\n${content}`;
  });

  // ═══ docs/107_project_governance.md ═══
  const govDom=detectDomain(a.purpose||'');
  const _cssFw=a.css_fw||'Tailwind CSS';
  const _devMethods=a.dev_methods||'TDD';
  const _mobile=a.mobile||(G?'なし':'None');
  const _aiAuto=a.ai_auto||(G?'なし':'None');
  const _pay=a.payment||(G?'なし':'None');
  const _scopeOut=a.scope_out||(G?'未設定':'Not set');
  const _successGoal=a.success||(G?'未設定':'Not set');
  const _deadlineGoal=a.deadline||(G?'6ヶ月':'6 months');
  const _hasMobile=_mobile&&!/なし|none/i.test(_mobile);
  const _hasAiAuto=_aiAuto&&!/なし|none|Vibe Coding入門|Vibe Coding Intro/i.test(_aiAuto);
  const _hasMFA=/MFA/i.test(a.auth||'');
  const initDecs=G?[
    {id:'DEC-001',content:'技術スタック確定 ('+fe+' + '+be+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-002',content:'デプロイ先確定 ('+deployTarget+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-003',content:'認証方式確定 ('+auth.provider+')',doc:'.spec/specification.md'},
    {id:'DEC-004',content:'ORM確定 ('+orm+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-005',content:'CSSフレームワーク確定 ('+_cssFw+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-006',content:'駆動開発手法確定 ('+_devMethods+')',doc:'.spec/specification.md'},
    {id:'DEC-007',content:'モバイル戦略確定 ('+_mobile+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-008',content:'AI開発レベル確定 ('+_aiAuto+')',doc:'docs/22_prompt_playbook.md'},
    {id:'DEC-009',content:'決済方式確定 ('+_pay+')',doc:'docs/38_business_model.md'},
    {id:'DEC-010',content:'スコープ外確定 ('+String(_scopeOut).slice(0,40)+')',doc:'docs/02_requirements.md'},
    {id:'DEC-011',content:'成功指標確定 ('+String(_successGoal).slice(0,40)+')',doc:'docs/01_project_overview.md'},
    {id:'DEC-012',content:'リリース目標確定 ('+_deadlineGoal+')',doc:'docs/10_gantt.md'},
  ]:[
    {id:'DEC-001',content:'Tech stack finalized ('+fe+' + '+be+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-002',content:'Deploy target finalized ('+deployTarget+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-003',content:'Authentication method finalized ('+auth.provider+')',doc:'.spec/specification.md'},
    {id:'DEC-004',content:'ORM finalized ('+orm+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-005',content:'CSS framework finalized ('+_cssFw+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-006',content:'Dev methodology finalized ('+_devMethods+')',doc:'.spec/specification.md'},
    {id:'DEC-007',content:'Mobile strategy finalized ('+_mobile+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-008',content:'AI dev level finalized ('+_aiAuto+')',doc:'docs/22_prompt_playbook.md'},
    {id:'DEC-009',content:'Payment method finalized ('+_pay+')',doc:'docs/38_business_model.md'},
    {id:'DEC-010',content:'Scope-out finalized ('+String(_scopeOut).slice(0,40)+')',doc:'docs/02_requirements.md'},
    {id:'DEC-011',content:'Success metrics finalized ('+String(_successGoal).slice(0,40)+')',doc:'docs/01_project_overview.md'},
    {id:'DEC-012',content:'Release target finalized ('+_deadlineGoal+')',doc:'docs/10_gantt.md'},
  ];
  const _baseIssues=G?[
    {id:'ISS-001',type:'技術',content:'DB スキーマ設計レビュー',priority:'P1',owner:'TL'},
    {id:'ISS-002',type:'技術',content:'認証フロー設計確認',priority:'P1',owner:'TL'},
    {id:'ISS-003',type:'管理',content:'開発環境構築手順書作成',priority:'P2',owner:'Dev'},
  ]:[
    {id:'ISS-001',type:'Tech',content:'DB schema design review',priority:'P1',owner:'TL'},
    {id:'ISS-002',type:'Tech',content:'Authentication flow design confirmation',priority:'P1',owner:'TL'},
    {id:'ISS-003',type:'Mgmt',content:'Dev environment setup guide creation',priority:'P2',owner:'Dev'},
  ];
  const _extraIssues=[];
  let _issN=4;
  if(hasPay)_extraIssues.push(G?{id:'ISS-0'+(_issN++),type:'技術',content:'決済E2Eテスト計画策定 ('+_pay+')',priority:'P0',owner:'Dev'}:{id:'ISS-0'+(_issN++),type:'Tech',content:'Payment E2E test plan ('+_pay+')',priority:'P0',owner:'Dev'});
  if(_hasMobile)_extraIssues.push(G?{id:'ISS-0'+(_issN++),type:'技術',content:'モバイルテスト環境セットアップ ('+_mobile+')',priority:'P1',owner:'Dev'}:{id:'ISS-0'+(_issN++),type:'Tech',content:'Mobile test environment setup ('+_mobile+')',priority:'P1',owner:'Dev'});
  if(_hasAiAuto)_extraIssues.push(G?{id:'ISS-0'+(_issN++),type:'管理',content:'AI開発ワークフロー設計 ('+_aiAuto+')',priority:'P1',owner:'TL'}:{id:'ISS-0'+(_issN++),type:'Mgmt',content:'AI dev workflow design ('+_aiAuto+')',priority:'P1',owner:'TL'});
  _extraIssues.push(G?{id:'ISS-0'+(_issN++),type:'管理',content:'MVP機能優先度最終確認',priority:'P0',owner:'PM'}:{id:'ISS-0'+(_issN++),type:'Mgmt',content:'MVP feature priority final review',priority:'P0',owner:'PM'});
  if(_hasMFA)_extraIssues.push(G?{id:'ISS-0'+(_issN++),type:'技術',content:'MFA実装手順・UXフロー確認',priority:'P1',owner:'TL'}:{id:'ISS-0'+(_issN++),type:'Tech',content:'MFA implementation & UX flow review',priority:'P1',owner:'TL'});
  const initIssues=[..._baseIssues,..._extraIssues];
  let gov107='# '+pn+' — '+(G?'プロジェクトガバナンス':'Project Governance')+'\n> '+date+'\n\n';
  gov107+='## '+(G?'1. 文書管理ルール':'1. Document Management Rules')+'\n';
  gov107+='- '+(G?'文書ID体系':'Doc ID scheme')+': '+pn.replace(/\s/g,'').substring(0,6)+'-{種別}-{連番}\n';
  gov107+='- '+(G?'保存場所':'Storage')+': docs/ '+(G?'(技術文書)':'(technical docs)')+' / .spec/ '+(G?'(仕様書)':'(specs)')+'\n';
  gov107+='- '+(G?'版数管理':'Version control')+': Git + CHANGELOG\n\n';
  gov107+='## '+(G?'2. コミュニケーション計画':'2. Communication Plan')+'\n';
  gov107+='| '+(G?'種別':'Type')+' | '+(G?'頻度':'Freq')+' | '+(G?'手段':'Method')+' | '+(G?'参加者':'Attendees')+' |\n|------|------|------|----------|\n';
  gov107+='| '+(G?'週次定例':'Weekly standup')+' | '+(G?'毎週':'Weekly')+' | Zoom/Meet | '+(G?'顧客PO+PM+TL':'Customer PO+PM+TL')+' |\n';
  gov107+='| '+(G?'スプリントレビュー':'Sprint review')+' | '+(G?'隔週':'Biweekly')+' | Zoom/Meet | '+(G?'全員':'All')+' |\n';
  gov107+='| '+(G?'技術相談':'Tech consultation')+' | '+(G?'随時':'Ad-hoc')+' | Slack/Chat | '+(G?'開発チーム':'Dev team')+' |\n\n';
  gov107+='## '+(G?'3. 決定事項ログ':'3. Decision Log')+'\n';
  gov107+='| '+(G?'日付':'Date')+' | ID | '+(G?'内容':'Content')+' | '+(G?'決定者':'Decider')+' | '+(G?'関連文書':'Ref Doc')+' |\n|------|-----|--------|--------|----------|\n';
  initDecs.forEach(d=>{gov107+='| '+date+' | '+d.id+' | '+d.content+' | — | '+d.doc+' |\n';});
  gov107+='\n## '+(G?'4. 課題・論点管理':'4. Issue Management')+'\n';
  gov107+='| ID | '+(G?'種別':'Type')+' | '+(G?'内容':'Content')+' | '+(G?'優先度':'Priority')+' | '+(G?'担当':'Owner')+' | '+(G?'期限':'Due')+' | '+(G?'ステータス':'Status')+' |\n|----|------|--------|--------|------|------|----------|\n';
  initIssues.forEach(i=>{gov107+='| '+i.id+' | '+i.type+' | '+i.content+' | '+i.priority+' | '+i.owner+' | — | '+(G?'対応中':'Open')+' |\n';});
  gov107+='\n## '+(G?'5. 変更管理 (CR)':'5. Change Management (CR)')+'\n\n### '+(G?'5.1 変更管理フロー':'5.1 CR Flow')+'\n';
  gov107+=G?'起票 → 影響分析 → 承認 → 実施 → 検証 → 完了\n':'Submit → Impact analysis → Approve → Implement → Verify → Close\n';
  gov107+='\n### '+(G?'5.2 変更要求テンプレート':'5.2 CR Template')+'\n';
  gov107+='- **'+(G?'CR番号':'CR#')+'**: CR-{連番}\n';
  gov107+='- **'+(G?'要求内容':'Request')+' **:\n- **'+(G?'変更理由':'Reason')+' **:\n';
  gov107+='- **'+(G?'影響範囲':'Impact scope')+'**: '+(G?'機能/スケジュール/コスト/品質':'function/schedule/cost/quality')+'\n';
  gov107+='- **'+(G?'影響度':'Impact level')+'**: '+(G?'高/中/低':'High/Med/Low')+'\n';
  gov107+='- **'+(G?'対応方針':'Approach')+' **:\n- **'+(G?'承認':'Approval')+'**: ('+( G?'承認者・日付':'approver & date')+')\n\n';
  gov107+='## '+(G?'6. 品質チェックリスト':'6. Quality Checklist')+'\n';
  gov107+='| '+(G?'フェーズ':'Phase')+' | '+(G?'チェック項目':'Check items')+' |\n|--------|----------|\n';
  gov107+='| '+(G?'要件定義':'Requirements')+' | '+(G?'全機能にAC定義 / 非機能要件が定量値':'All features have ACs / NFRs are quantitative')+' |\n';
  gov107+='| '+(G?'設計':'Design')+' | '+(G?'ER図レビュー / API設計レビュー完了':'ER diagram reviewed / API design reviewed')+' |\n';
  gov107+='| '+(G?'実装':'Implementation')+' | '+(G?'コードレビュー完了 / テスト 80%+ / Lintクリーン':'Code review done / Tests 80%+ / Lint clean')+' |\n';
  gov107+='| '+(G?'テスト':'Testing')+' | '+(G?'UATシート完了 / P0不具合ゼロ':'UAT sheet complete / P0 bugs=0')+' |\n';
  gov107+='| '+(G?'リリース':'Release')+' | '+(G?'Go/No-Go判定 / ステークホルダー承認 / ロールバック手順確認':'Go/No-Go judgment / stakeholder approval / rollback plan verified')+' |\n';
  gov107+='| '+(G?'運用':'Operations')+' | '+(G?'監視・アラート設定 / RunBook整備':'Monitoring & alerts / runbook ready')+' |\n';
  S.files['docs/107_project_governance.md']=gov107;

  // ═══ docs/116_estimation_prerequisites.md ═══
  (function(){
    const _feats=(stripPri(a.mvp_features)||(G?'CRUD操作':'CRUD')).split(', ').filter(Boolean);
    const _scrs=(stripPri(a.screens)||(G?'ダッシュボード':'Dashboard')).split(', ').filter(Boolean);
    const _ents=(stripPri(a.data_entities)||'User').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
    const _scopeArr=(a.scope_out||'').split(/[,、,]\s*/).map(s=>s.trim()).filter(s=>s&&!/なし|none/i.test(s));
    const _authStr=a.auth||(G?'メール/パスワード':'Email/Password');
    const _db=a.database||'PostgreSQL';
    // Effort estimation
    const _eEnt=_ents.length;const _eScr=_scrs.length;const _eFeat=_feats.length;
    const _crudH=Math.round(_eEnt*6*1.2);
    const _scrH=Math.round(_eScr*3*1.2);
    const _authH=hasPay?40:16;
    const _payH=hasPay?Math.round(24*1.5):0;
    const _aiH=_hasAiAuto?8:0;
    const _infraH=8;const _testH=Math.round((_crudH+_scrH+_authH)*0.3);
    const _totalH=_crudH+_scrH+_authH+_payH+_aiH+_infraH+_testH;
    // Compat-based risk
    const _compatWarn=(typeof checkCompat==='function'?checkCompat(a):[]).filter(c=>c.level==='warn').length;
    const _compatErr=(typeof checkCompat==='function'?checkCompat(a):[]).filter(c=>c.level==='error').length;
    const _riskCoef=_compatErr>0?1.5:_compatWarn>2?1.3:_compatWarn>0?1.15:1.0;
    let doc='# '+pn+' — '+(G?'見積前提条件確認書':'Estimation Prerequisites')+'\n> '+date+'\n\n';
    doc+='> '+(G?'このドキュメントはウィザード回答から自動生成されました。実際の見積前にPM・TLが内容を確認・調整してください。':'Auto-generated from wizard answers. PM & TL should review and adjust before issuing estimates.')+'\n\n';
    doc+='## '+(G?'1. 対象スコープ':'1. Scope')+'\n\n';
    doc+='### '+(G?'1.1 機能一覧 (MVP)':'1.1 Feature List (MVP)')+'\n';
    doc+='| # | '+(G?'機能名':'Feature')+' | '+(G?'開発種別':'Type')+' | '+(G?'優先度':'Priority')+' | '+(G?'備考':'Notes')+' |\n|---|------|------|---------|----|:\n';
    _feats.forEach((f,i)=>{ doc+='| '+(i+1)+' | '+f+' | '+(G?'新規開発':'New')+' | '+(i<2?'P0':'P1')+' | |\n'; });
    doc+='\n### '+(G?'1.2 画面一覧':'1.2 Screen List')+'\n';
    doc+='| # | '+(G?'画面名':'Screen')+' | '+(G?'優先度':'Priority')+' | '+(G?'備考':'Notes')+' |\n|---|------|---------|----|\n';
    _scrs.forEach((s,i)=>{ doc+='| '+(i+1)+' | '+s+' | '+(i<3?'P0':'P1')+' | |\n'; });
    doc+='\n### '+(G?'1.3 データエンティティ':'1.3 Data Entities')+'\n';
    doc+='| # | '+(G?'エンティティ':'Entity')+' | CRUD | '+(G?'備考':'Notes')+' |\n|---|-----------|------|----|\n';
    _ents.forEach((e,i)=>{ doc+='| '+(i+1)+' | '+e+' | ✅✅✅✅ | |\n'; });
    doc+='\n## '+(G?'2. 除外スコープ':'2. Out of Scope')+'\n';
    doc+='| '+(G?'除外項目':'Item')+' | '+(G?'除外理由':'Reason')+' | '+(G?'後対応可否':'Post-release?')+' |\n|---------|---------|----------|\n';
    if(_scopeArr.length){_scopeArr.forEach(s=>{ doc+='| '+s+' | '+(G?'MVP外 — 優先度低':'Out of MVP scope')+' | △ |\n'; });}
    else{ doc+='| — | '+(G?'スコープ外未設定':'Not defined')+' | — |\n'; }
    doc+='\n## '+(G?'3. 技術前提条件':'3. Technical Prerequisites')+'\n';
    doc+='| '+(G?'層':'Layer')+' | '+(G?'選定技術':'Technology')+' | '+(G?'選定理由':'Rationale')+' | '+(G?'制約事項':'Constraints')+' |\n|---|---------|---------|----------|\n';
    doc+='| Frontend | '+fe+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    doc+='| Backend | '+be+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    doc+='| DB | '+_db+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    doc+='| Deploy | '+deployTarget+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    doc+='| Auth | '+_authStr+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    if(!/Firebase|Supabase/i.test(be)){ doc+='| ORM | '+orm+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n'; }
    doc+='| CSS | '+_cssFw+' | '+(G?'ウィザード選定':'Wizard selection')+' | |\n';
    doc+='\n## '+(G?'4. 工数概算':'4. Effort Estimation')+'\n\n';
    doc+='### '+(G?'4.1 見積前提':'4.1 Estimation Assumptions')+'\n';
    doc+='- '+(G?'エンティティ数':'Entities')+': '+_eEnt+(G?'件 (CRUD API 4エンドポイント × 1.5h)':' (4 CRUD endpoints × 1.5h each)')+'\n';
    doc+='- '+(G?'画面数':'Screens')+': '+_eScr+(G?'画面 (平均3h/画面)':' (avg 3h/screen)')+'\n';
    doc+='- '+(G?'機能数':'Features')+': '+_eFeat+(G?'機能':' features')+'\n';
    doc+='- '+(G?'バッファ係数':'Buffer coefficient')+': 1.2 ('+( G?'見積誤差考慮':'estimation uncertainty')+') × '+_riskCoef+(G?' (compat警告係数)':' (compat risk factor)')+'\n\n';
    doc+='### '+(G?'4.2 工数テーブル':'4.2 Effort Table')+'\n';
    doc+='| '+(G?'カテゴリ':'Category')+' | '+(G?'単位工数':'Unit')+' | '+(G?'数量':'Qty')+' | '+(G?'小計(h)':'Sub(h)')+' | '+(G?'係数':'Factor')+' | '+(G?'合計(h)':'Total(h)')+' |\n|---------|---------|------|---------|------|--------|\n';
    doc+='| '+(G?'DB設計・マイグレーション':'DB Design & Migration')+' | 4h | 1 | 4h | 1.0 | 4h |\n';
    doc+='| '+(G?'Entity CRUD API':'Entity CRUD API')+' | 1.5h/ep | '+(_eEnt*4)+' | '+Math.round(_eEnt*6)+'h | 1.2 | '+_crudH+'h |\n';
    doc+='| '+(G?'画面実装':'Screen Implementation')+' | 3h/'+(G?'画面':'screen')+' | '+_eScr+' | '+Math.round(_eScr*3)+'h | 1.2 | '+_scrH+'h |\n';
    doc+='| '+(G?'認証実装 ('+_authStr+')':'Auth ('+_authStr+')')+' | '+_authH+'h | 1 | '+_authH+'h | 1.0 | '+_authH+'h |\n';
    if(hasPay){ doc+='| '+(G?'決済実装 ('+_pay+')':'Payment ('+_pay+')')+' | 24h | 1 | 24h | 1.5 | '+_payH+'h |\n'; }
    if(_hasAiAuto){ doc+='| '+(G?'AI統合':'AI Integration')+' | 8h | 1 | 8h | 1.0 | '+_aiH+'h |\n'; }
    doc+='| '+(G?'テスト':'Testing')+' | — | — | — | 0.3 | '+_testH+'h |\n';
    doc+='| '+(G?'CI/CD・インフラ':'CI/CD & Infra')+' | 8h | 1 | 8h | 1.0 | '+_infraH+'h |\n';
    doc+='| **'+(G?'合計':'Total')+'** | | | | | **'+_totalH+'h** |\n';
    doc+='| **'+(G?'リスク係数後合計':'After risk factor')+'** | | | | '+_riskCoef+' | **'+Math.round(_totalH*_riskCoef)+'h** |\n';
    doc+='\n## '+(G?'5. リスク係数':'5. Risk Factors')+'\n';
    doc+='| '+(G?'リスク項目':'Risk Item')+' | '+(G?'評価':'Assessment')+' | '+(G?'係数':'Factor')+' | '+(G?'対策':'Mitigation')+' |\n|---------|---------|------|----------|\n';
    doc+='| compat '+(G?'エラー':'errors')+' | '+_compatErr+(G?'件':'')+'  | '+(_compatErr>0?'×1.5':'-')+' | '+(G?'エラー修正必須':'Must fix errors')+' |\n';
    doc+='| compat '+(G?'警告':'warnings')+' | '+_compatWarn+(G?'件':'')+'  | '+(_compatWarn>2?'×1.3':_compatWarn>0?'×1.15':'-')+' | '+(G?'警告確認推奨':'Review warnings')+' |\n';
    doc+='| '+(G?'新規技術採用':'New technology')+' | '+(G?'選定確認':'Check adoption')+' | — | '+(G?'スパイク実施':'Technical spike')+' |\n';
    doc+='| '+(G?'要件変更リスク':'Requirement change')+' | '+(G?'中':'Med')+' | — | CR '+(G?'管理':'management')+' (docs/107) |\n';
    doc+='\n## '+(G?'6. 依存関係・制約':'6. Dependencies & Constraints')+'\n';
    if(hasPay)doc+='- **'+(G?'決済':'Payment')+'**: '+_pay+(G?' — ストライプアカウント・APIキー取得が前提':'  — Stripe account & API keys required first')+'\n';
    if(_hasMobile)doc+='- **'+(G?'モバイル':'Mobile')+'**: '+_mobile+(G?' — EAS Build環境・App Store申請期間を考慮':'  — EAS Build env & App Store review time required')+'\n';
    if(_hasAiAuto)doc+='- **AI**: '+_aiAuto+(G?' — OpenAI/Claude APIキー・予算枠設定必要':' — OpenAI/Claude API keys & budget limits required')+'\n';
    doc+='- **'+deployTarget+'**: '+(G?'環境変数設定・カスタムドメイン申請期間考慮':'Env var setup & custom domain provisioning time')+'\n';
    doc+='- **'+_db+'**: '+(G?'スキーマ確定後にマイグレーション実行 — スキーマ変更は工数増':'Run migration after schema finalized — schema changes add effort')+'\n';
    doc+='\n## '+(G?'7. 変更管理':'7. Change Management')+'\n';
    doc+='→ '+(G?'変更要求はdocs/107_project_governance.md の変更管理フローに従って管理します。':'Change requests are managed via docs/107_project_governance.md CR flow.')+'\n';
    doc+='→ '+(G?'詳細CR票はdocs/118_project_operations_pack.md §3を参照してください。':'Detailed CR forms are in docs/118_project_operations_pack.md §3.')+'\n';
    S.files['docs/116_estimation_prerequisites.md']=doc;
  })();

  // ═══ docs/117_deployment_environment_guide.md ═══
  (function(){
    var _dep117=a.deploy||'Vercel';
    var _be117=be;
    var _isStatic117=/なし（静的|None|static/i.test(_be117);
    var _db117=a.database||'PostgreSQL';
    var _sc117=a.scale||'medium';
    var _isVercel117=_dep117.includes('Vercel');
    var _isRailway117=_dep117.includes('Railway');
    var _isAWS117=_dep117.includes('AWS');
    var _isCloudflare117=_dep117.includes('Cloudflare');
    var doc='# '+pn+' — '+(G?'デプロイ環境設計ガイド':'Deployment Environment Guide')+'\n> '+date+'\n\n';
    doc+='## 1. '+(G?'環境マトリクス':'Environment Matrix')+'\n\n';
    doc+='| '+(G?'環境':'Env')+' | '+(G?'目的':'Purpose')+' | URL | DB | Auth | Flags | Log Level |\n';
    doc+='|-----|--------|-----|-----|------|-------|----------|\n';
    doc+='| local | '+(G?'個人開発':'Dev')+' | localhost | '+(G?'ローカル/コンテナ':'local/container')+' | mock | ALL ON | debug |\n';
    doc+='| preview | '+(G?'PR確認':'PR review')+' | '+(
      _isVercel117?'*.vercel.app':_isRailway117?'*.up.railway.app':_dep117.includes('Netlify')?'*.netlify.app':'preview.example.com'
    )+' | '+(G?'共有ステージングDB':'shared staging DB')+' | real | '+(G?'フラグON':'flags ON')+' | info |\n';
    doc+='| staging | '+(G?'リリース前検証':'Pre-release QA')+' | staging.example.com | '+(G?'ステージングDB':'staging DB')+' | real | '+(G?'本番同等':'prod-like')+' | info |\n';
    doc+='| production | '+(G?'本番':'Production')+' | example.com | '+(G?'本番DB':'prod DB')+' | real | '+(G?'機能フラグ慎重':'caution')+' | warn |\n';
    doc+='\n## 2. '+(G?'Staging-Production Parity チェックリスト':'Staging-Production Parity Checklist')+'\n\n';
    const _parityChecks=G?[
      '環境変数名が一致しているか (値は異なるが名称同一)',
      'DBスキーマが同一 (マイグレーションファイルで管理)',
      'サービス依存 (Redis/Queue/Mail) がStaging環境にも存在',
      '環境変数にシークレットがハードコードされていない',
      _isVercel117?'Vercel: Preview環境でDeployment Protectionが有効':'ステージングURLが公開されていない (Basic Auth等で保護)'
    ]:[
      'Env var names match (values differ, names same)',
      'DB schema is identical (managed by migration files)',
      'Service dependencies (Redis/Queue/Mail) exist in staging too',
      'No secrets hardcoded in env vars',
      _isVercel117?'Vercel: Deployment Protection enabled on Preview':'Staging URL is not publicly accessible (protected by Basic Auth etc.)'
    ];
    _parityChecks.forEach(c=>{ doc+='- [ ] '+c+'\n'; });
    doc+='\n## 3. '+(G?'環境変数管理':'Env Config Management')+'\n\n';
    doc+='| '+(G?'フェーズ':'Phase')+' | '+(G?'ツール':'Tool')+' | '+(G?'説明':'Notes')+'  |\n';
    doc+='|--------|--------|--------|\n';
    doc+='| '+(G?'開発初期':'Early dev')+' | .env.local | '+(G?'gitignore 必須':'must be gitignored')+'  |\n';
    doc+='| '+(G?'チーム開発':'Team dev')+' | .env.example | '+(G?'値なしテンプレートをgit管理':'template without values, git-tracked')+'  |\n';
    doc+='| '+(G?'本番':'Production')+' | '+(
      _isVercel117?'Vercel Dashboard Env Vars':_isRailway117?'Railway Variables':_isAWS117?'AWS Secrets Manager / Parameter Store':_isCloudflare117?'Cloudflare Workers Secrets':'Platform env secrets'
    )+' | '+(G?'プラットフォームの秘密管理を使用':'Use platform secret management')+'  |\n';
    doc+='| '+(G?'高度なシークレット管理':'Advanced secrets')+' | Doppler / HashiCorp Vault | '+(G?'大規模・複数環境の一元管理':'Centralized for large / multi-env')+'  |\n';
    doc+='\n## 4. '+(G?'Feature Flag戦略':'Feature Flag Strategy')+'\n\n';
    doc+='| '+(G?'段階':'Stage')+' | '+(G?'手法':'Method')+' | '+(G?'例':'Example')+'  |\n';
    doc+='|--------|--------|--------|\n';
    doc+='| '+(G?'ビルド時':'Build-time')+' | '+(G?'環境変数でコード除去':'Env var tree-shaking')+' | `NEXT_PUBLIC_FEATURE_X=true`  |\n';
    doc+='| '+(G?'ランタイム':'Runtime')+' | '+(G?'DB/KVフラグ':'DB/KV flags')+' | Vercel Edge Config / Unleash  |\n';
    doc+='| '+(G?'段階ロールアウト':'Gradual rollout')+' | '+(G?'ユーザー%でON/OFF':'% user rollout')+' | PostHog Feature Flags / LaunchDarkly  |\n';
    doc+='\n## 5. '+(G?'環境プロモーションフロー':'Environment Promotion Flow')+'\n\n';
    doc+='```\n';
    doc+='local → feature branch PR → Preview Deploy\n';
    doc+='                              ↓ QA pass\n';
    doc+='                         staging deploy (main branch)\n';
    doc+='                              ↓ Staging QA + stakeholder sign-off\n';
    doc+='                         production release\n';
    doc+='```\n\n';
    if(_isVercel117){
      doc+='> **Vercel**: Preview → Production is one-click promotion via Dashboard or `vercel --prod`\n';
    } else if(_isRailway117){
      doc+='> **Railway**: Staging service → Production service via `railway up --environment production`\n';
    } else if(_isAWS117){
      doc+='> **AWS**: CodePipeline stagingステージ → manualApproval → productionステージ\n';
    }
    doc+='\n## '+(G?'クロスリファレンス':'Cross Reference')+'\n';
    doc+='- docs/116_estimation_prerequisites.md — '+(G?'技術前提条件':'Technical prerequisites')+'\n';
    doc+='- docs/118_project_operations_pack.md — '+(G?'運用フェーズゲート・RunBook':'Ops phase gates & runbook')+'\n';
    doc+='- docs/09_release_checklist.md — '+(G?'リリース前チェックリスト':'Pre-release checklist')+'\n';
    S.files['docs/117_deployment_environment_guide.md']=doc;
  })();

  // ═══ docs/118_project_operations_pack.md ═══
  (function(){
    const _feats=(stripPri(a.mvp_features)||(G?'CRUD操作':'CRUD')).split(', ').filter(Boolean);
    const _scrs=(stripPri(a.screens)||(G?'ダッシュボード':'Dashboard')).split(', ').filter(Boolean);
    const _ents=(stripPri(a.data_entities)||'User').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
    // SLA defaults by deploy target
    const _slaMap={'Vercel':{avail:'99.99%',rto:'5分/5m',rpo:'0',support:'コミュニティ/community'},'Firebase Hosting':{avail:'99.95%',rto:'10分/10m',rpo:'0',support:'Google support'},'Railway':{avail:'99.9%',rto:'15分/15m',rpo:'1h',support:'Railway Discord'},'Fly.io':{avail:'99.9%',rto:'10分/10m',rpo:'1h',support:'Fly.io community'},'AWS':{avail:'99.99%',rto:'5分/5m',rpo:'1h',support:'AWS Support'},'Cloudflare':{avail:'99.99%',rto:'5分/5m',rpo:'0',support:'Cloudflare support'},'Netlify':{avail:'99.99%',rto:'5分/5m',rpo:'0',support:'Netlify support'}};
    const _sla=_slaMap[deployTarget]||_slaMap[Object.keys(_slaMap).find(k=>deployTarget.includes(k))]||{avail:'99.9%',rto:'15分/15m',rpo:'1h',support:'ベンダー/vendor'};
    // Deploy-specific ops checks
    const _deployOps={'Vercel':[G?'Vercel Analyticsダッシュボード確認':'Check Vercel Analytics dashboard',G?'Edge Functions エラーレート監視':'Monitor Edge Functions error rate',G?'Deployment Protection設定確認':'Verify Deployment Protection config'],'Railway':[G?'Railway Metrics CPU/メモリ確認':'Check Railway Metrics CPU/memory',G?'PostgreSQL接続プール使用率監視':'Monitor PostgreSQL connection pool usage',G?'Railway sleeping設定確認':'Check Railway sleeping settings'],'AWS':[G?'CloudWatch Logs確認':'Check CloudWatch Logs',G?'RDS Performance Insights確認':'Review RDS Performance Insights',G?'Cost Explorer予算アラート確認':'Verify Cost Explorer budget alerts'],'Cloudflare':[G?'Workers Analytics確認':'Check Workers Analytics',G?'D1/KV使用量確認':'Monitor D1/KV usage',G?'ゼロトラストポリシー確認':'Review Zero Trust policies']};
    const _dops=_deployOps[deployTarget]||_deployOps[Object.keys(_deployOps).find(k=>deployTarget&&k&&deployTarget.includes(k))]||[G?'デプロイログ確認':'Check deployment logs',G?'エラーレート監視':'Monitor error rate',G?'ストレージ使用量確認':'Monitor storage usage'];
    let doc='# '+pn+' — '+(G?'プロジェクト運用設計書':'Project Operations Pack')+'\n> '+date+'\n\n';
    doc+='> '+(G?'このドキュメントはウィザード回答から自動生成されました。プロジェクト文脈に応じた参照リンク・固有チェック項目が含まれます。':'Auto-generated from wizard answers. Includes context-specific doc references and deployment-specific checks.')+'\n\n';
    // §1 Phase Gate Checklist
    doc+='## §1 '+(G?'フェーズゲートチェックリスト':'Phase Gate Checklist')+'\n\n';
    const _gates=G?[
      {name:'Gate 1: 要件定義完了',checks:['[ ] 全MVP機能にAC（受入基準）定義 → .spec/specification.md','[ ] 非機能要件が定量値で記述 → docs/02_requirements.md','[ ] スコープ外が明文化 → docs/116_estimation_prerequisites.md §2','[ ] 見積前提確認 → docs/116_estimation_prerequisites.md §4']},
      {name:'Gate 2: 設計完了',checks:['[ ] ER図レビュー完了 → docs/04_er_diagram.md','[ ] API設計レビュー完了 → docs/05_api_design.md','[ ] 画面設計レビュー完了 → docs/06_screen_design.md','[ ] セキュリティ設計確認 → docs/08_security.md','[ ] 設計レビュー記録 → 本文書 §2',hasPay?'[ ] 決済フロー設計確認 → docs/38_business_model.md':'[ ] 認証フロー設計確認 → .spec/specification.md']},
      {name:'Gate 3: 実装完了',checks:['[ ] コードレビュー完了（PRごと）','[ ] テストカバレッジ 80%+ → docs/17_test_strategy.md','[ ] Lint・型チェッククリーン','[ ] セキュリティスキャン完了 → docs/22_prompt_playbook.md',hasPay?'[ ] 決済E2Eテスト通過':'[ ] 認証E2Eテスト通過','[ ] compat警告ゼロ確認']},
      {name:'Gate 4: テスト完了',checks:['[ ] UATシート全項目完了 → docs/108_uat_acceptance.md','[ ] P0不具合ゼロ','[ ] P1不具合は対応済みまたは計画策定','[ ] 非機能テスト（LCP/可用性）通過 → docs/108_uat_acceptance.md §3','[ ] リリースチェックリスト確認 → docs/09_release_checklist.md']},
      {name:'Gate 5: リリース判定',checks:['[ ] Go/No-Go判定会議実施 → docs/108_uat_acceptance.md §5','[ ] ステークホルダー承認取得 → docs/107_project_governance.md','[ ] ロールバック手順確認 → docs/09_release_checklist.md','[ ] '+deployTarget+'デプロイ手順確認 → scaffolding/SETUP.md','[ ] CI/CDパイプライン動作確認 → .github/workflows/ci.yml']},
      {name:'Gate 6: 運用開始',checks:['[ ] 監視・アラート設定 → docs/103_observability_architecture.md','[ ] RunBook整備 → docs/'+deployTarget.toLowerCase().replace(/[^a-z]/g,'_')+'（参照: §5）','[ ] 問い合わせ対応フロー確認 → 本文書 §4','[ ] バックアップ確認 → docs/90_backup_disaster_recovery.md','[ ] チーム引き継ぎ完了']}
    ]:[
      {name:'Gate 1: Requirements Complete',checks:['[ ] All MVP features have Acceptance Criteria → .spec/specification.md','[ ] Non-functional requirements are quantitative → docs/02_requirements.md','[ ] Scope-out is documented → docs/116_estimation_prerequisites.md §2','[ ] Estimation assumptions confirmed → docs/116_estimation_prerequisites.md §4']},
      {name:'Gate 2: Design Complete',checks:['[ ] ER diagram reviewed → docs/04_er_diagram.md','[ ] API design reviewed → docs/05_api_design.md','[ ] Screen design reviewed → docs/06_screen_design.md','[ ] Security design confirmed → docs/08_security.md','[ ] Design review record → this doc §2',hasPay?'[ ] Payment flow design reviewed → docs/38_business_model.md':'[ ] Auth flow design reviewed → .spec/specification.md']},
      {name:'Gate 3: Implementation Complete',checks:['[ ] Code review done (per PR)','[ ] Test coverage 80%+ → docs/17_test_strategy.md','[ ] Lint & type checks clean','[ ] Security scan complete → docs/22_prompt_playbook.md',hasPay?'[ ] Payment E2E tests pass':'[ ] Auth E2E tests pass','[ ] Zero compat warnings']},
      {name:'Gate 4: Testing Complete',checks:['[ ] UAT sheet all items done → docs/108_uat_acceptance.md','[ ] P0 bugs = 0','[ ] P1 bugs resolved or planned','[ ] NFR tests pass (LCP/availability) → docs/108_uat_acceptance.md §3','[ ] Release checklist confirmed → docs/09_release_checklist.md']},
      {name:'Gate 5: Release Judgment',checks:['[ ] Go/No-Go meeting held → docs/108_uat_acceptance.md §5','[ ] Stakeholder approval obtained → docs/107_project_governance.md','[ ] Rollback procedure confirmed → docs/09_release_checklist.md','[ ] '+deployTarget+' deploy procedure confirmed → scaffolding/SETUP.md','[ ] CI/CD pipeline verified → .github/workflows/ci.yml']},
      {name:'Gate 6: Operations Start',checks:['[ ] Monitoring & alerts configured → docs/103_observability_architecture.md','[ ] RunBook prepared (see §5)','[ ] Inquiry handling flow confirmed → this doc §4','[ ] Backup verified → docs/90_backup_disaster_recovery.md','[ ] Team handover complete']}
    ];
    _gates.forEach(g=>{
      doc+='\n### '+g.name+'\n';
      doc+='| # | '+(G?'確認項目':'Check Item')+' | '+(G?'参照':'Ref')+' | '+(G?'結果':'Result')+' |\n|---|------|------|------|\n';
      g.checks.forEach((c,i)=>{
        const refMatch=c.match(/→\s*(.+)$/);
        const item=c.replace(/→\s*.+$/,'').trim();
        doc+='| '+(i+1)+' | '+item+' | '+(refMatch?refMatch[1]:'')+' | |\n';
      });
    });
    // §2 Design Review Record
    doc+='\n## §2 '+(G?'設計レビュー記録':'Design Review Record')+'\n\n';
    doc+='### '+(G?'2.1 UI画面レビュー':'2.1 UI Screen Review')+'\n';
    doc+='| # | '+(G?'画面名':'Screen')+' | '+(G?'レビュー観点':'Review Focus')+' | '+(G?'指摘事項':'Issues')+' | '+(G?'対応状況':'Status')+' |\n|---|--------|-----------|---------|--------|\n';
    _scrs.forEach((s,i)=>{
      doc+='| '+(i+1)+' | '+s+' | '+(G?'UI/UX整合・アクセシビリティ・レスポンシブ':'UI/UX consistency, A11y, Responsive')+' | | '+(G?'未対応':'Open')+' |\n';
    });
    doc+='\n### '+(G?'2.2 DB/エンティティレビュー':'2.2 DB / Entity Review')+'\n';
    doc+='| # | '+(G?'エンティティ':'Entity')+' | '+(G?'レビュー観点':'Review Focus')+' | '+(G?'指摘事項':'Issues')+' | '+(G?'対応状況':'Status')+' |\n|---|-----------|-----------|---------|--------|\n';
    _ents.forEach((e,i)=>{
      doc+='| '+(i+1)+' | '+e+' | '+(G?'カラム定義・インデックス・RLS':'Column def, Index, RLS')+' | | '+(G?'未対応':'Open')+' |\n';
    });
    doc+='\n### '+(G?'2.3 認証・権限マトリクス':'2.3 Auth & Permission Matrix')+'\n';
    doc+='| '+(G?'ロール':'Role')+' | '+(G?'画面アクセス':'Screen Access')+' | API CRUD | '+(G?'管理操作':'Admin Ops')+' |\n|------|------------|---------|----------|\n';
    const _roles=hasAdmin?[G?'管理者':'Admin',G?'一般ユーザー':'User',G?'ゲスト':'Guest']:[G?'ユーザー':'User',G?'ゲスト':'Guest'];
    _roles.forEach(r=>{ doc+='| '+r+' | | ✅/❌ | '+(r===( G?'管理者':'Admin')?'✅':'❌')+' |\n'; });
    // §3 CR Template
    doc+='\n## §3 '+(G?'変更要求票 (CR)':'Change Request (CR)')+'\n\n';
    doc+='### '+(G?'3.1 CR詳細テンプレート':'3.1 CR Template')+'\n';
    doc+='| '+(G?'項目':'Field')+' | '+(G?'内容':'Content')+' |\n|------|--------|\n';
    doc+='| CR番号 | CR-001 |\n';
    doc+='| '+(G?'起票日':'Submitted')+' | '+date+' |\n';
    doc+='| '+(G?'起票者':'Submitter')+' | |\n';
    doc+='| '+(G?'変更タイトル':'Change Title')+' | |\n';
    doc+='| '+(G?'変更理由':'Reason')+' | |\n';
    doc+='| '+(G?'変更内容詳細':'Details')+' | |\n';
    doc+='| '+(G?'影響範囲':'Impact Scope')+' | '+(G?'機能/スケジュール/コスト/品質':'Function/Schedule/Cost/Quality')+' |\n';
    doc+='| '+(G?'影響度':'Impact Level')+' | '+(G?'高/中/低':'High/Med/Low')+' |\n';
    doc+='| '+(G?'追加工数見積':'Effort Estimate')+' | |\n';
    doc+='| '+(G?'対応方針':'Approach')+' | |\n';
    doc+='| '+(G?'承認者':'Approver')+' | |\n';
    doc+='| '+(G?'承認日':'Approved')+' | |\n';
    doc+='| '+(G?'ステータス':'Status')+' | '+(G?'起票中/レビュー中/承認済/却下':'Draft/Review/Approved/Rejected')+' |\n';
    doc+='\n### '+(G?'3.2 影響ファイルチェックリスト':'3.2 Impact File Checklist')+'\n';
    doc+=(G?'> 変更内容に応じて該当ファイルにチェックしてください。':'> Check files impacted by the change request.')+'\n\n';
    const _impactFiles=['.spec/specification.md','.spec/technical-plan.md','.spec/tasks.md','docs/01_project_overview.md','docs/02_requirements.md','docs/03_architecture.md','docs/04_er_diagram.md','docs/05_api_design.md','docs/06_screen_design.md','docs/107_project_governance.md','docs/108_uat_acceptance.md','docs/116_estimation_prerequisites.md','docs/09_release_checklist.md','scaffolding/SETUP.md','.github/workflows/ci.yml'];
    _impactFiles.forEach(f=>{ doc+='- [ ] `'+f+'`\n'; });
    // §4 Operations Inquiry Log
    doc+='\n## §4 '+(G?'運用問い合わせ記録':'Operations Inquiry Log')+'\n\n';
    doc+='### '+(G?'4.1 SLA基準値 ('+deployTarget+' 環境)':'4.1 SLA Criteria ('+deployTarget+')')+'\n';
    doc+='| '+(G?'項目':'Item')+' | '+(G?'基準値':'Criteria')+' | '+(G?'測定方法':'Measurement')+' |\n|------|---------|----------|\n';
    doc+='| '+(G?'可用性 (Availability)':'Availability')+' | '+_sla.avail+' | '+(G?'月次計測':'Monthly')+' |\n';
    doc+='| RTO '+(G?'(目標復旧時間)':'(Recovery Time Obj)')+' | '+_sla.rto+' | |\n';
    doc+='| RPO '+(G?'(目標復旧時点)':'(Recovery Point Obj)')+' | '+_sla.rpo+' | |\n';
    doc+='| '+(G?'サポート':'Support')+' | '+_sla.support+' | |\n';
    doc+='| LCP | < 2.5s | Lighthouse |\n';
    doc+='| '+(G?'エラーレート':'Error Rate')+' | < 0.1% | '+deployTarget+' '+( G?'ダッシュボード':'dashboard')+' |\n';
    doc+='\n### '+(G?'4.2 問い合わせ記録テンプレート':'4.2 Inquiry Log Template')+'\n';
    doc+='| ID | '+(G?'種別':'Type')+' | '+(G?'内容':'Content')+' | '+(G?'影響度':'Impact')+' | '+(G?'緊急度':'Urgency')+' | '+(G?'初動':'Action')+' | '+(G?'担当':'Owner')+' | '+(G?'解決日':'Resolved')+' | '+(G?'ステータス':'Status')+' |\n|-----|------|--------|------|------|--------|------|---------|----------|\n';
    doc+='| INQ-001 | '+(G?'障害':'Failure')+' | | '+(G?'高/中/低':'H/M/L')+' | '+(G?'高/中/低':'H/M/L')+' | | | | '+(G?'対応中':'Open')+' |\n';
    doc+='| INQ-002 | '+(G?'操作問い合わせ':'Inquiry')+' | | '+(G?'高/中/低':'H/M/L')+' | '+(G?'高/中/低':'H/M/L')+' | | | | '+(G?'対応中':'Open')+' |\n';
    doc+='| INQ-003 | '+(G?'改善要望':'Request')+' | | '+(G?'低':'L')+' | '+(G?'低':'L')+' | | | | '+(G?'受付':'Received')+' |\n';
    // §5 Operations Checklist
    doc+='\n## §5 '+(G?'プロジェクト運用チェックリスト':'Project Operations Checklist')+'\n\n';
    doc+='### '+(G?'5.1 日次チェック':'5.1 Daily Checks')+'\n';
    _dops.forEach(c=>{ doc+='- [ ] '+c+'\n'; });
    doc+='- [ ] '+(G?'エラーログ確認 → docs/25_error_logs.md':'Error log review → docs/25_error_logs.md')+'\n';
    doc+='- [ ] '+(G?'未対応問い合わせ確認 → §4':'Review open inquiries → §4')+'\n';
    doc+='\n### '+(G?'5.2 週次チェック':'5.2 Weekly Checks')+'\n';
    doc+='- [ ] '+(G?'パフォーマンス指標確認 → docs/99_performance_strategy.md':'Performance metrics review → docs/99_performance_strategy.md')+'\n';
    doc+='- [ ] '+(G?'セキュリティアラート確認 → docs/22_prompt_playbook.md':'Security alerts review → docs/22_prompt_playbook.md')+'\n';
    doc+='- [ ] '+(G?'バックアップ成功確認 → docs/90_backup_disaster_recovery.md':'Backup success verification → docs/90_backup_disaster_recovery.md')+'\n';
    doc+='- [ ] '+(G?'コスト確認 → '+deployTarget+'管理コンソール':'Cost review → '+deployTarget+' admin console')+'\n';
    doc+='\n### '+(G?'5.3 スプリント毎':'5.3 Per Sprint')+'\n';
    doc+='- [ ] '+(G?'CI/CDパイプライン結果確認 → .github/workflows/ci.yml':'CI/CD pipeline results → .github/workflows/ci.yml')+'\n';
    doc+='- [ ] '+(G?'スプリントレビュー議事録 → docs/15_meeting.md':'Sprint review notes → docs/15_meeting.md')+'\n';
    doc+='- [ ] '+(G?'CR票の優先度見直し → §3':'CR priority review → §3')+'\n';
    doc+='- [ ] '+(G?'進捗更新 → docs/24_progress.md':'Progress update → docs/24_progress.md')+'\n';
    doc+='\n### '+(G?'5.4 リリース時 ('+deployTarget+' 固有)':'5.4 At Release ('+deployTarget+' specific)')+'\n';
    const _relChks=G?['Go/No-Go最終判定 → docs/108_uat_acceptance.md §5','リリースチェックリスト実施 → docs/09_release_checklist.md',deployTarget+'デプロイ実行 → scaffolding/SETUP.md','本番動作確認（スモークテスト）','ロールバック手順の事前確認','CHANGELOG更新 → docs/21_changelog.md','ステークホルダーへのリリース通知']:['Final Go/No-Go → docs/108_uat_acceptance.md §5','Release checklist → docs/09_release_checklist.md',deployTarget+' deploy → scaffolding/SETUP.md','Smoke test in production','Rollback procedure pre-verified','Update CHANGELOG → docs/21_changelog.md','Notify stakeholders'];
    _relChks.forEach(c=>{ doc+='- [ ] '+c+'\n'; });
    S.files['docs/118_project_operations_pack.md']=doc;
  })();

  // ═══ docs/119_auth_architecture_guide.md — 認証アーキテクチャガイド ═══
  (function(){
    var a119=resolveAuth(a);
    var hasMfa=/(MFA|2FA|多要素|二要素|TOTP|FIDO|WebAuthn)/i.test((a.auth||'')+(a.mvp_features||''));
    var hasSocial=/(Google|GitHub|Apple|Twitter|LINE)/i.test(a.auth||'');
    var doc119='# '+pn+' — '+(G?'認証アーキテクチャガイド':'Authentication Architecture Guide')+'\n> '+date+'\n\n';
    doc119+='> '+(G?'本ドキュメントは認証設計の判断根拠・実装ベストプラクティス・よくある誤解を整理したものです。詳細はdocs/00_architecture_decision_records.md ADR-004も参照してください。':'This document consolidates auth design rationale, implementation best practices, and common misconceptions. See also docs/00_architecture_decision_records.md ADR-004.')+'\n\n';
    // §1 Auth Method Selection Matrix
    doc119+='## §1 '+(G?'認証方式選定マトリクス':'Auth Method Selection Matrix')+'\n\n';
    doc119+='| '+(G?'プロバイダー':'Provider')+' | '+(G?'認証方式':'Method')+' | MFA | Social | '+(G?'採用':'Selected')+' |\n';
    doc119+='|----------|------|-----|--------|--------|\n';
    var _prov=[
      {n:'Supabase Auth',m:'JWT + RLS',mfa:'✓',soc:'✓',cur:a119.provider==='supabase'},
      {n:'Firebase Auth',m:'ID Token',mfa:'✓',soc:'✓',cur:a119.provider==='firebase'},
      {n:'Auth.js (NextAuth)',m:G?'セッションToken':'Session Token',mfa:'△',soc:'✓',cur:a119.provider==='authjs'},
      {n:'Custom JWT',m:'Bearer JWT',mfa:G?'要実装':'Custom',soc:G?'要実装':'Custom',cur:a119.provider==='jwt'},
    ];
    _prov.forEach(function(p){
      doc119+='| '+p.n+' | '+p.m+' | '+p.mfa+' | '+p.soc+' | '+(p.cur?'**✅ '+(G?'採用':'Selected')+'**':'—')+' |\n';
    });
    doc119+='\n**'+(G?'採用: ':'Selected: ')+a119.sot+'**\n\n';
    if(a119.provider==='supabase'){doc119+=(G?'選定理由: PostgreSQL+RLS統合・JWT/OAuth/MFA統一SDK・ステートレス設計':'Rationale: PostgreSQL+RLS integration, unified JWT/OAuth/MFA SDK, stateless design')+'\n\n';}
    else if(a119.provider==='firebase'){doc119+=(G?'選定理由: Googleエコシステム統合・Firestoreセキュリティルール連携・マルチプロバイダー管理':'Rationale: Google ecosystem integration, Firestore security rules, multi-provider management')+'\n\n';}
    else if(a119.provider==='authjs'){doc119+=(G?'選定理由: Next.js App Router/Middlewareネイティブ対応・40+プロバイダー標準サポート':'Rationale: Next.js App Router/Middleware native support, 40+ providers out of the box')+'\n\n';}
    else{doc119+=(G?'選定理由: カスタム要件対応・完全制御・RS256署名推奨':'Rationale: Custom requirements, full control, RS256 signing recommended')+'\n\n';}
    // §2 Token Lifecycle & Storage
    doc119+='## §2 '+(G?'トークンライフサイクルと保管場所':'Token Lifecycle & Storage')+'\n\n';
    doc119+='### '+(G?'保管場所の選択マトリクス':'Token Storage Decision Matrix')+'\n\n';
    doc119+='| '+(G?'保管場所':'Storage')+' | XSS'+(G?'耐性':'Resistance')+' | CSRF'+(G?'耐性':'Resistance')+' | '+(G?'推奨用途':'Recommended Use')+' |\n';
    doc119+='|--------|-------|-------|----------|\n';
    doc119+='| LocalStorage | ✗ | ✓ | **'+(G?'非推奨':'Not recommended')+'** — '+(G?'XSSでトークン窃取リスク':'XSS can steal tokens')+' |\n';
    doc119+='| SessionStorage | ✗ | ✓ | '+(G?'一時データのみ（タブ単位）':'Temporary per-tab data only')+' |\n';
    doc119+='| HttpOnly Cookie | ✓ | △ | '+(G?'Access/Refresh Token（SameSite=Strict必須）':'Access/Refresh Token (SameSite=Strict required)')+' |\n';
    doc119+='| '+(G?'メモリ (JS変数)':'Memory (JS variable)')+' | ✓ | ✓ | '+(G?'Access Token短期保持（リロードで消失）':'Short-lived Access Token (lost on reload)')+' |\n\n';
    doc119+='### '+(G?'推奨トークン構成':'Recommended Token Configuration')+'\n\n';
    doc119+='| '+(G?'種別':'Type')+' | '+(G?'有効期限':'Expiry')+' | '+(G?'保管場所':'Storage')+' | '+(G?'送信方法':'Transport')+' |\n';
    doc119+='|------|--------|--------|----------|\n';
    if(a119.provider==='supabase'||a119.provider==='firebase'){
      doc119+='| Access Token | 1h (SDK) | '+(G?'メモリ (SDK管理)':'Memory (SDK-managed)')+' | Authorization: Bearer |\n';
      doc119+='| Refresh Token | 30d | HttpOnly Cookie (SDK) | '+(G?'SDK自動ローテーション':'SDK auto-rotation')+' |\n';
    } else if(a119.provider==='authjs'){
      doc119+='| Session Token | 30d | HttpOnly Cookie | Cookie '+(G?'自動送信':'auto-sent')+' |\n';
      doc119+='| CSRF Token | '+(G?'リクエスト毎':'Per request')+' | '+(G?'フォームhidden':'Form hidden')+' | POST body |\n';
    } else {
      doc119+='| Access Token | 15min | '+(G?'メモリ（JS変数）':'Memory (JS variable)')+' | Authorization: Bearer |\n';
      doc119+='| Refresh Token | 7d | HttpOnly Cookie (Secure+SameSite=Strict) | '+(G?'自動送信':'Auto-sent')+' |\n';
    }
    doc119+='\n> '+(G?'**推奨**: Access Tokenはメモリ保持 + Refresh TokenはHttpOnly Cookie。BaaS SDKは自動実装。':'**Best practice**: Access Token in memory + Refresh Token in HttpOnly Cookie. BaaS SDKs implement this automatically.')+'\n\n';
    // §3 OAuth 2.0 vs OIDC
    doc119+='## §3 '+(G?'OAuth 2.0 vs OIDC の区別':'OAuth 2.0 vs OIDC Distinction')+'\n\n';
    doc119+='| '+(G?'プロトコル':'Protocol')+' | '+(G?'目的':'Purpose')+' | '+(G?'提供するもの':'Provides')+' | '+(G?'主な用途':'Use')+' |\n';
    doc119+='|----------|------|------------|-------|\n';
    doc119+='| OAuth 2.0 | '+(G?'認可 (Authorization)':'Authorization')+' | Access Token | '+(G?'リソースアクセス委譲':'Delegated resource access')+' |\n';
    doc119+='| OIDC | '+(G?'認証 + 認可':'Authentication + Authorization')+' | ID Token + Access Token | '+(G?'ユーザーID確認 + リソースアクセス':'User identity + resource access')+' |\n';
    doc119+='\n> '+(G?'「Googleでログイン」はOAuth単独ではなく **OIDC** を使用しています。OAuth 2.0だけではユーザーのIDを確認できません。':'**"Login with Google"** uses OIDC, not OAuth alone. OAuth 2.0 by itself cannot verify user identity.')+'\n\n';
    doc119+='### Authorization Code Flow + PKCE\n\n';
    doc119+='```\n';
    doc119+=G?
      'ユーザー → Client: ログインボタン\n'+
      'Client → 認証サーバー: code_challenge (PKCE) + scope=openid\n'+
      '認証サーバー → ユーザー: 同意画面\n'+
      'ユーザー → 認証サーバー: 認証情報入力\n'+
      '認証サーバー → Client: 認可コード\n'+
      'Client → 認証サーバー: code + code_verifier → Token交換\n'+
      '認証サーバー → Client: ID Token + Access Token + Refresh Token\n':
      'User → Client: Click login\n'+
      'Client → Auth Server: code_challenge (PKCE) + scope=openid\n'+
      'Auth Server → User: Consent screen\n'+
      'User → Auth Server: Submit credentials\n'+
      'Auth Server → Client: Authorization code\n'+
      'Client → Auth Server: code + code_verifier → Token exchange\n'+
      'Auth Server → Client: ID Token + Access Token + Refresh Token\n';
    doc119+='```\n\n';
    // §4 5 Common Auth Misconceptions
    doc119+='## §4 '+(G?'認証に関する5つの誤解':'5 Common Authentication Misconceptions')+'\n\n';
    var _misc=G?[
      ['JWT ≠ 認証','JWTは署名付きデータフォーマットです。認証ロジック（パスワード検証・MFA）は別途実装が必要です。'],
      ['OAuth ≠ ログイン','OAuth 2.0は**認可**プロトコルです。「Googleでログイン」はOIDCを使用しています。'],
      ['SSO ≠ プロトコル','SSOは概念であり、SAML 2.0・OIDC・LDAP等の様々なプロトコルで実現できます。'],
      ['Bearer ≠ JWT専用','BearerはHTTP認証スキームの名前。任意のトークン（OpaqueトークンやSupabase JWTも含む）に使えます。'],
      ['AuthN ≠ AuthZ','Authentication（誰であるか）とAuthorization（何ができるか）は別物。RBACやRLSで認可制御を実装してください。'],
    ]:[
      ['JWT ≠ Authentication','JWT is a signed data format. Authentication logic (password verification, MFA) must be implemented separately.'],
      ['OAuth ≠ Login','OAuth 2.0 is an authorization protocol. "Login with Google" uses OIDC, not OAuth alone.'],
      ['SSO ≠ Protocol','SSO is a concept, implementable via SAML 2.0, OIDC, LDAP, etc.'],
      ['Bearer ≠ JWT only','Bearer is an HTTP auth scheme name — any token (opaque tokens, Supabase JWT, etc.) can use it.'],
      ['AuthN ≠ AuthZ','"Who you are" (AuthN) and "what you can do" (AuthZ) are separate. Implement RBAC or RLS for authorization.'],
    ];
    _misc.forEach(function(m,i){doc119+='### '+(i+1)+'. '+m[0]+'\n\n'+m[1]+'\n\n';});
    // §5 HTTP Status Code Decision Guide
    doc119+='## §5 '+(G?'HTTPステータスコード判断ガイド':'HTTP Status Code Decision Guide')+'\n\n';
    doc119+='```mermaid\nflowchart TD\n';
    doc119+=G?
      '  A[APIリクエスト受信] --> B{認証情報あり?}\n'+
      '  B -- なし --> C[401 Unauthorized]\n'+
      '  B -- あり --> D{トークン有効?}\n'+
      '  D -- 無効/期限切れ --> E[401 Unauthorized]\n'+
      '  D -- 有効 --> F{リソースへの権限あり?}\n'+
      '  F -- 権限なし --> G2[403 Forbidden]\n'+
      '  F -- 権限あり --> H{リソース存在?}\n'+
      '  H -- 存在しない --> I[404 Not Found]\n'+
      '  H -- 存在する --> J[200 / 201 OK]\n':
      '  A[API Request] --> B{Auth credentials present?}\n'+
      '  B -- No --> C[401 Unauthorized]\n'+
      '  B -- Yes --> D{Token valid?}\n'+
      '  D -- Invalid/Expired --> E[401 Unauthorized]\n'+
      '  D -- Valid --> F{Has permission?}\n'+
      '  F -- No --> G2[403 Forbidden]\n'+
      '  F -- Yes --> H{Resource exists?}\n'+
      '  H -- No --> I[404 Not Found]\n'+
      '  H -- Yes --> J[200 / 201 OK]\n';
    doc119+='```\n\n';
    doc119+='| '+(G?'コード':'Code')+' | '+(G?'意味':'Meaning')+' | '+(G?'使用場面':'When')+' |\n';
    doc119+='|------|------|-------|\n';
    doc119+='| 400 | Bad Request | '+(G?'バリデーションエラー':'Validation error')+' |\n';
    doc119+='| 401 | Unauthorized | '+(G?'未認証またはトークン無効/期限切れ':'Unauthenticated or token invalid/expired')+' |\n';
    doc119+='| 403 | Forbidden | '+(G?'認証済み・権限なし':'Authenticated but no permission')+' |\n';
    doc119+='| 404 | Not Found | '+(G?'リソース不存在（権限なし時の存在隠蔽にも使用可）':'Not found (also used to hide resource existence)')+' |\n\n';
    // §6 Implementation Checklist
    doc119+='## §6 '+(G?'実装チェックリスト':'Implementation Checklist')+'\n\n';
    doc119+='### '+(G?'基本設定（全プロジェクト共通）':'Base Configuration')+'\n\n';
    doc119+='- [ ] '+(G?'HTTPS強制（HTTP→HTTPSリダイレクト）':'Enforce HTTPS')+'\n';
    doc119+='- [ ] '+(G?'CORS: 許可オリジンを明示的にホワイトリスト化':'CORS: Explicitly whitelist allowed origins')+'\n';
    doc119+='- [ ] '+(G?'レート制限: ログインエンドポイントに試行回数制限（5回/分推奨）':'Rate limiting: 5 attempts/min on login endpoints')+'\n';
    doc119+='- [ ] '+(G?'パスワードハッシュ: bcrypt (cost=12以上) またはArgon2id':'Password hashing: bcrypt (cost=12+) or Argon2id')+'\n';
    doc119+='- [ ] '+(G?'認証エラーメッセージ統一（ユーザー存在漏洩防止）':'Unified error messages (prevent user enumeration)')+'\n\n';
    if(a119.provider==='supabase'){
      doc119+='### '+(G?'Supabase Auth 固有設定':'Supabase Auth Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'Email confirmation強制':'Enforce email confirmation')+'\n';
      doc119+='- [ ] '+(G?'JWT有効期限設定 (デフォルト3600s)':'Set JWT expiry (default 3600s)')+'\n';
      doc119+='- [ ] '+(G?'Refresh token rotation有効化':'Enable refresh token rotation')+'\n';
      doc119+='- [ ] '+(G?'RLSポリシー: auth.uid()=user_id を全テーブルに設定':'RLS policy: auth.uid()=user_id on all tables')+'\n\n';
    } else if(a119.provider==='firebase'){
      doc119+='### '+(G?'Firebase Auth 固有設定':'Firebase Auth Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'Email enumeration protection有効化':'Enable email enumeration protection')+'\n';
      doc119+='- [ ] '+(G?'passwordPolicyOptions設定':'Configure passwordPolicyOptions')+'\n';
      doc119+='- [ ] '+(G?'App Checkによるリクエスト認証':'App Check for request authentication')+'\n';
      doc119+='- [ ] '+(G?'セキュリティルール: request.auth != null を全コレクションに設定':'Security rules: request.auth != null on all collections')+'\n\n';
    } else if(a119.provider==='authjs'){
      doc119+='### '+(G?'Auth.js 固有設定':'Auth.js Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'NEXTAUTH_SECRET: 32文字以上のランダム文字列':'NEXTAUTH_SECRET: 32+ random characters')+'\n';
      doc119+='- [ ] '+(G?'session.maxAge: 適切な値に短縮（デフォルト30日）':'session.maxAge: Shorten from default 30d')+'\n';
      doc119+='- [ ] '+(G?'Middleware: matcherで保護対象パスを指定':'Middleware: Use matcher for protected paths')+'\n';
      doc119+='- [ ] trustHost: true (Vercel/proxy)\n\n';
    } else {
      doc119+='### '+(G?'Custom JWT 固有設定':'Custom JWT Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'RS256署名（秘密鍵は環境変数で管理）':'RS256 signing (private key via env var)')+'\n';
      doc119+='- [ ] '+(G?'Access Token有効期限: 15分以内':'Access Token expiry: ≤15 min')+'\n';
      doc119+='- [ ] '+(G?'Refresh Token: HttpOnly Cookie + SameSite=Strict':'Refresh Token: HttpOnly Cookie + SameSite=Strict')+'\n';
      doc119+='- [ ] '+(G?'Token blacklist: RedisでjtiをBLACKLIST管理':'Token blacklist: Track jti in Redis')+'\n\n';
    }
    if(hasMfa||hasPay){
      doc119+='### '+(G?'MFA設定':'MFA Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'TOTP (Google Authenticator/Authy対応)':'TOTP (Google Authenticator/Authy compatible)')+'\n';
      doc119+='- [ ] '+(G?'バックアップコード (10コード、使い切り)':'Backup codes (10 codes, single-use)')+'\n';
      if(hasPay)doc119+='- [ ] '+(G?'決済操作時のMFA再検証（step-up authentication）':'Re-verify MFA for payment ops (step-up authentication)')+'\n';
      doc119+='\n';
    }
    if(hasSocial){
      doc119+='### '+(G?'Social Login設定':'Social Login Configuration')+'\n\n';
      doc119+='- [ ] '+(G?'OAuth Callback URL: 本番ドメインのみ許可':'OAuth Callback URL: production domain only')+'\n';
      doc119+='- [ ] '+(G?'State parameterによるCSRF防止':'CSRF prevention via state parameter')+'\n';
      doc119+='- [ ] '+(G?'Fallback: Social Login障害時のEmail/Password認証確保':'Fallback: Email/Password auth when social login fails')+'\n\n';
    }
    // §7 Authorization Model Selection Guide
    doc119+='## §7 '+(G?'認可モデル選定ガイド':'Authorization Model Selection Guide')+'\n\n';
    doc119+=(G
      ?'> 認可 (Authorization) は「認証済みユーザーが何をしてよいか」を制御する仕組みです。\n> 認証 (Authentication) と混同しないでください。\n\n'
      :'> Authorization controls "what an authenticated user is allowed to do".\n> Do not confuse with Authentication.\n\n'
    );
    var _sc119=a.scale||'medium';
    var _ents119=(a.entities||'User').split(',').filter(function(e){return e.trim();}).length;
    var _isBaaS119=/Supabase|Firebase|Convex/i.test(be);
    doc119+='### '+(G?'モデル比較':'Model Comparison')+'\n\n';
    doc119+='| '+(G?'モデル':'Model')+' | '+(G?'判断基準':'Criteria')+' | '+(G?'メリット':'Pros')+' | '+(G?'デメリット':'Cons')+' |\n';
    doc119+='|------|------|------|------|\n';
    doc119+='| RBAC | '+(G?'ロール（役割）':'Role-based')+' | '+(G?'シンプル・可読性高':'Simple, readable')+' | '+(G?'ロール爆発リスク':'Role explosion risk')+' |\n';
    doc119+='| ABAC | '+(G?'属性（時間・場所・データ状態）':'Attribute-based')+' | '+(G?'柔軟・細粒度':'Flexible, fine-grained')+' | '+(G?'実装複雑':'Complex impl')+' |\n';
    doc119+='| ACL | '+(G?'リソース別許可リスト':'Per-resource list')+' | '+(G?'直感的':'Intuitive')+' | '+(G?'大規模でスケールしない':'Doesn\'t scale')+' |\n';
    doc119+='| RLS | '+(G?'DB行レベル自動フィルタ':'DB row-level filter')+' | '+(G?'バイパス不可・DB保証':'Cannot bypass, DB-enforced')+' | '+(G?'DBに密結合':'Tightly coupled to DB')+' |\n\n';
    doc119+='### '+(G?'プロジェクト推奨':'Project Recommendation')+'\n\n';
    if(_isBaaS119){
      doc119+=(G?'**RBAC + RLS ハイブリッド** ('+be+' ベース)\n\nRLSをデータ保護の最終防御線とし、カスタムClaimsでRBACを実装します。\nauth.uid()=user_id パターンを全テーブルに適用してください。\n\n':'**RBAC + RLS Hybrid** ('+be+'-based)\n\nUse RLS as the last line of defense for data protection, and implement RBAC via custom Claims.\nApply auth.uid()=user_id pattern to all tables.\n\n');
    } else if(/large/i.test(_sc119)||_ents119>=10){
      doc119+=(G?'**RBAC 基盤 + ABAC 補完** ('+_ents119+'エンティティ / '+_sc119+'スケール)\n\n単純RBACではエンティティ数増加時に権限爆発が起きます。\nRBACをコアとし、動的条件（時間帯・部門・データ状態）にはABACを追加してください。\n\n':'**RBAC (base) + ABAC (supplement)** ('+_ents119+' entities / '+_sc119+' scale)\n\nPure RBAC causes permission explosion as entities grow.\nUse RBAC as core and add ABAC for dynamic conditions (time, department, data state).\n\n');
    } else {
      doc119+=(G?'**RBAC** ('+_ents119+'エンティティ / '+_sc119+'スケール)\n\nシンプルなRBACで十分です。`admin`, `editor`, `viewer`から始め、必要に応じて拡張してください。\n\n':'**RBAC** ('+_ents119+' entities / '+_sc119+' scale)\n\nSimple RBAC is sufficient. Start with `admin`, `editor`, `viewer` and extend as needed.\n\n');
    }
    doc119+='> '+(G?'詳細実装: [docs/43_security_intelligence.md](./43_security_intelligence.md) — 認可モデル選定マトリクス':'Detailed implementation: [docs/43_security_intelligence.md](./43_security_intelligence.md) — Authorization Model Selection Matrix')+'\n\n';
    doc119+='### '+(G?'関連ドキュメント':'Related Documents')+'\n\n';
    doc119+='- [ADR-004](./00_architecture_decision_records.md)\n';
    doc119+='- ['+(G?'セキュリティインテリジェンス':'Security Intelligence')+'](./43_security_intelligence.md)\n';
    doc119+='- ['+(G?'脅威モデル':'Threat Model')+'](./44_threat_model.md)\n';
    doc119+='- ['+(G?'コンプライアンスマトリクス':'Compliance Matrix')+'](./45_compliance_matrix.md)\n';
    S.files['docs/119_auth_architecture_guide.md']=doc119;
  })();

  // ═══ docs/120_system_design_guide.md ═══
  (function(){
    function _inc(v,k){return v&&v.indexOf(k)!==-1;}
    var be120=be;var db120=a.database||'PostgreSQL';
    var _isBaas=_inc(be120,'Firebase')||_inc(be120,'Supabase')||_inc(be120,'Convex');
    var _isGQL=_inc(be120,'GraphQL')||_inc(fe,'GraphQL');
    var _isGRPC=_inc(be120,'gRPC');
    var apiStyle=_isBaas?'BaaS SDK':_isGQL?'GraphQL':_isGRPC?'gRPC':'REST';
    var dbKey=(_inc(db120,'MongoDB')?'MongoDB':_inc(db120,'MySQL')?'MySQL':_inc(db120,'SQLite')?'SQLite':_inc(db120,'Firestore')?'Firestore':'PostgreSQL');
    var _isNoSQL=_inc(db120,'MongoDB')||_inc(db120,'Firestore')||_inc(db120,'DynamoDB');
    var sc=a.scale||'medium';
    var _hasRT=/リアルタイム|realtime|chat|チャット|WebSocket/i.test(a.purpose||'');
    var _hasIoT=/IoT|sensor|センサー|MQTT/i.test(a.purpose||'');
    function chk(s,sel){return s===sel?'✅ **'+s+'**':s;}
    var d='# '+pn+' — '+(G?'システムデザイン意思決定ガイド':'System Design Decision Guide')+'\n> '+date+'\n\n';
    d+='> '+(G?'ウィザード入力から自動生成。ADR詳細: [docs/82-2_architecture_decision_records.md](./82-2_architecture_decision_records.md)':'Auto-generated from wizard inputs. ADR details: [docs/82-2_architecture_decision_records.md](./82-2_architecture_decision_records.md)')+'\n\n';
    // §1 API Style
    d+='## '+(G?'§1 APIスタイル選定':'§1 API Style Selection')+'\n\n';
    d+='**'+(G?'選定スタイル: ':'Selected Style: ')+apiStyle+'**\n\n';
    d+='| '+(G?'スタイル':'Style')+' | '+(G?'プロトコル':'Protocol')+' | '+(G?'形式':'Format')+' | '+(G?'主なメリット':'Benefits')+' | '+(G?'主なデメリット':'Drawbacks')+' | '+(G?'推奨ユースケース':'Use Cases')+' |\n';
    d+='|------|---------|-----|----------|----------|------------------|\n';
    d+='| '+chk('REST',apiStyle)+' | HTTP/1.1 | JSON | '+(G?'標準的・キャッシュ可能・互換性高':'Standard, cacheable, high compatibility')+' | '+(G?'Over/Under-fetch問題':'Over/under-fetching')+' | '+(G?'汎用CRUD・モバイルAPI':'General CRUD, mobile API')+' |\n';
    d+='| '+chk('GraphQL',apiStyle)+' | HTTP/1.1 | JSON | '+(G?'必要フィールドのみ取得・型安全':'Fetch only needed fields, type-safe')+' | '+(G?'クエリ複雑・キャッシュ困難':'Complex queries, caching difficult')+' | '+(G?'複雑なSPA・BFF・ダッシュボード':'Complex SPA, BFF, dashboard')+' |\n';
    d+='| '+chk('gRPC',apiStyle)+' | HTTP/2 | Protobuf | '+(G?'低レイテンシ・双方向ストリーミング':'Low latency, bidirectional streaming')+' | '+(G?'ブラウザ直接利用に制限':'Browser support limited')+' | '+(G?'マイクロサービス間・ML推論':'Microservices, ML inference')+' |\n';
    d+='| '+chk('BaaS SDK',apiStyle)+' | HTTPS | JSON/WS | '+(G?'認証・RLS・リアルタイム組み込み':'Auth, RLS, realtime built-in')+' | '+(G?'ベンダーロックイン':'Vendor lock-in')+' | '+(G?'MVP・RAD・スタートアップ':'MVP, RAD, startups')+' |\n\n';
    d+='### '+(G?'選定理由':'Rationale')+'\n\n';
    if(_isBaas){d+=(G?'**BaaS SDK**: '+be120+'が認証・DB・リアルタイムを統合提供。REST自前実装より開発速度が大幅に向上。':'**BaaS SDK**: '+be120+' provides integrated auth, DB, and realtime. Much faster than building REST APIs from scratch.')+'\n\n';}
    else if(_isGQL){d+=(G?'**GraphQL**: クライアントが必要フィールドのみ指定取得。N+1問題には必ずDataLoaderを使用。APQ（Automatic Persisted Queries）でDoS対策も実施。':'**GraphQL**: Client specifies only needed fields. Always use DataLoader for N+1. Implement APQ (Automatic Persisted Queries) for DoS protection.')+'\n\n';}
    else if(_isGRPC){d+=(G?'**gRPC**: HTTP/2+Protobufで低レイテンシを実現。ブラウザ対応にはgRPC-Webゲートウェイが必要。':'**gRPC**: Low latency via HTTP/2+Protobuf. gRPC-Web gateway required for browser access.')+'\n\n';}
    else{d+=(G?'**REST**: HTTPの標準セマンティクスとキャッシュ機構を活用。OpenAPI/Swaggerでドキュメント自動生成。/api/v1/バージョニングを設計時から組み込む。':'**REST**: Leverages standard HTTP semantics and caching. Auto-generate docs via OpenAPI/Swagger. Embed /api/v1/ versioning from design phase.')+'\n\n';}
    d+='> '+(G?'参照: [ADR-008](./82-2_architecture_decision_records.md)':'Reference: [ADR-008](./82-2_architecture_decision_records.md)')+'\n\n';
    // §2 Database
    d+='## '+(G?'§2 データベース選定・CAP定理':'§2 Database Selection & CAP Theorem')+'\n\n';
    d+='**'+(G?'選定DB: ':'Selected DB: ')+dbKey+'**\n\n';
    d+='| DB | '+(G?'種別':'Type')+' | CAP | '+(G?'整合性':'Consistency')+' | '+(G?'スケーリング':'Scaling')+' | '+(G?'推奨ドメイン':'Recommended For')+' |\n';
    d+='|------|------|-----|------------|---------|------------------|\n';
    d+='| '+chk('PostgreSQL',dbKey)+' | Relational | CP | ACID | '+(G?'垂直+Read Replica':'Vertical + Read Replica')+' | '+(G?'金融・EC・SaaS':'Finance, EC, SaaS')+' |\n';
    d+='| '+chk('MySQL',dbKey)+' | Relational | CP | ACID | '+(G?'垂直+Galera':'Vertical + Galera')+' | '+(G?'汎用Webアプリ':'General web apps')+' |\n';
    d+='| '+chk('MongoDB',dbKey)+' | Document | AP | BASE | '+(G?'水平シャーディング':'Horizontal sharding')+' | '+(G?'CMS・カタログ':'CMS, catalog')+' |\n';
    d+='| '+chk('SQLite',dbKey)+' | Relational | — | ACID | '+(G?'単一ノード':'Single node')+' | '+(G?'ローカル・組み込み':'Local, embedded')+' |\n';
    d+='| '+chk('Firestore',dbKey)+' | Document | AP | BASE | '+(G?'自動マルチリージョン':'Auto multi-region')+' | '+(G?'モバイル・リアルタイム':'Mobile, realtime')+' |\n\n';
    d+='### '+(G?'CAP定理 & ACID vs BASE':'CAP Theorem & ACID vs BASE')+'\n\n';
    d+='> **CAP定理**: '+(G?'分散システムはC(一貫性)/A(可用性)/P(分断耐性)を同時に3つ満たせない。':'A distributed system cannot simultaneously guarantee C(Consistency)/A(Availability)/P(Partition tolerance).')+'\n\n';
    d+='- **CP** (Consistency + Partition): '+(G?'パーティション時はエラーを返す（一貫性優先）→ PostgreSQL/MySQL':'Returns error on partition (consistency first) → PostgreSQL/MySQL')+'\n';
    d+='- **AP** (Availability + Partition): '+(G?'パーティション時も応答するが結果整合性（可用性優先）→ MongoDB/Firestore':'Responds on partition but eventual consistency (availability first) → MongoDB/Firestore')+'\n\n';
    d+='| '+(G?'特性':'Property')+' | ACID | BASE |\n|------|------|------|\n';
    d+='| '+(G?'一貫性':'Consistency')+' | '+(G?'強一貫性（即時）':'Strong / immediate')+' | '+(G?'結果整合性':'Eventual')+' |\n';
    d+='| '+(G?'適合DB':'DB')+' | PostgreSQL/MySQL | MongoDB/Firestore |\n';
    d+='| '+(G?'適用ドメイン':'Domain')+' | '+(G?'金融・決済・医療・法務':'Finance, payment, healthcare, legal')+' | '+(G?'SNS・CMS・カタログ・IoT':'SNS, CMS, catalog, IoT')+' |\n\n';
    d+='### '+(G?'NoSQL 4種分類':'NoSQL Type Classification')+'\n\n';
    d+='| '+(G?'種別':'Type')+' | '+(G?'代表製品':'Products')+' | '+(G?'ユースケース':'Use Cases')+' |\n|------|---------|----------|\n';
    d+='| Document | MongoDB, Firestore | '+(G?'CMS・プロフィール・カタログ':'CMS, profiles, catalog')+' |\n';
    d+='| Wide-Column | Cassandra, BigTable | '+(G?'時系列・IoT・大規模ログ':'Time-series, IoT, large-scale logs')+' |\n';
    d+='| Key-Value | Redis, DynamoDB | '+(G?'キャッシュ・セッション・カート':'Cache, sessions, carts')+' |\n';
    d+='| Graph | Neo4j, Neptune | '+(G?'SNS・推薦・詐欺検出':'SNS, recommendations, fraud detection')+' |\n\n';
    if(_isNoSQL){d+='> ⚠️ **'+(G?'注意: '+dbKey+'（NoSQL）はACIDトランザクションが限定的。決済・金融データには追加の整合性保証が必要。':'Note: '+dbKey+' (NoSQL) has limited ACID transactions. Financial/payment data requires additional consistency guarantees.')+'**\n\n';}
    // §3 Scaling
    d+='## '+(G?'§3 スケーリング戦略':'§3 Scaling Strategy')+'\n\n';
    d+='### '+(G?'垂直 vs 水平スケーリング':'Vertical vs Horizontal Scaling')+'\n\n';
    d+='| '+(G?'観点':'Aspect')+' | '+(G?'垂直 (Scale Up)':'Vertical (Scale Up)')+' | '+(G?'水平 (Scale Out)':'Horizontal (Scale Out)')+' |\n|------|------------|------------|\n';
    d+='| '+(G?'方法':'Method')+' | '+(G?'CPU/RAM増強':'Upgrade CPU/RAM')+' | '+(G?'ノード追加':'Add nodes')+' |\n';
    d+='| '+(G?'上限':'Limit')+' | '+(G?'ハード上限あり':'Hardware ceiling')+' | '+(G?'理論上無制限':'Unlimited')+' |\n';
    d+='| '+(G?'複雑さ':'Complexity')+' | '+(G?'低':'Low')+' | '+(G?'高（LB・分散状態管理）':'High (LB, distributed state)')+' |\n';
    d+='| SPOF | '+(G?'あり（単一ノード）':'Yes (single node)')+' | '+(G?'なし（冗長化）':'No (redundant)')+' |\n';
    d+='| '+(G?'推奨フェーズ':'Phase')+' | '+(G?'初期・MVP':'Early/MVP')+' | '+(G?'成長・大規模':'Growth/Large')+' |\n\n';
    d+='### '+(G?'ロードバランシングアルゴリズム (6種)':'Load Balancing Algorithms (6 types)')+'\n\n';
    d+='| '+(G?'アルゴリズム':'Algorithm')+' | '+(G?'仕組み':'Mechanism')+' | '+(G?'適用シーン':'Best For')+' |\n|-----------|------|----------|\n';
    d+='| Round Robin | '+(G?'順番に均等分散':'Distribute evenly in turn')+' | '+(G?'均一リクエスト':'Uniform requests')+' |\n';
    d+='| Least Connections | '+(G?'接続数最小ノードに転送':'Route to fewest connections')+' | '+(G?'処理時間が不均一（WebSocket）':'Uneven time, WebSocket')+' |\n';
    d+='| Consistent Hashing | '+(G?'ハッシュで同一サーバーに固定':'Same server via hash key')+' | '+(G?'キャッシュ・セッション共有':'Cache/session sharing')+' |\n';
    d+='| IP Hash | '+(G?'クライアントIPでサーバー固定':'Stick by client IP')+' | '+(G?'セッション固定が必要な場合':'When sticky session required')+' |\n';
    d+='| Geographic | '+(G?'地理的に近いサーバーへ転送':'Route to nearest region')+' | '+(G?'グローバルサービス・CDN併用':'Global services with CDN')+' |\n';
    d+='| Weighted Round Robin | '+(G?'重みに応じて分散（スペック差対応）':'Distribute by weight for mixed specs')+' | '+(G?'異種スペックサーバー混在':'Heterogeneous server specs')+' |\n\n';
    d+='### '+(G?'SPOF チェックリスト (プロジェクト固有)':'SPOF Checklist (Project-Specific)')+'\n\n';
    d+='| '+(G?'コンポーネント':'Component')+' | '+(G?'現状':'Status')+' | '+(G?'対策':'Mitigation')+' |\n|-----------|---------|----------|\n';
    var _dbSpof=_isBaas?'✅ '+(G?'BaaS管理（冗長化済み）':'BaaS-managed (redundant)'):(sc==='large'?'⚠️ '+(G?'Read Replica推奨':'Read Replica recommended'):'✅ '+(G?'現スケールで適切':'Appropriate for current scale'));
    d+='| DB: '+db120+' | '+_dbSpof+' | '+(sc==='large'&&!_isBaas?G?'Read Replica + PgBouncer追加':'Add Read Replica + PgBouncer':G?'現状維持':'Current setup OK')+' |\n';
    var _depVal=a.deploy||'Vercel';
    var _depSpof=/Vercel|Firebase|Railway|Netlify|Fly|Cloudflare/i.test(_depVal)?'✅ '+(G?'マネージド（冗長化済み）':'Managed (redundant)'):'⚠️ '+(G?'自己管理 → LB設定推奨':'Self-managed → LB recommended');
    d+='| '+(G?'デプロイ: '+_depVal:'Deploy: '+_depVal)+' | '+_depSpof+' | '+(/Vercel|Firebase|Railway|Netlify|Fly|Cloudflare/i.test(_depVal)?G?'プラットフォームが管理':'Platform handles it':G?'ALB + Auto Scalingを設定':'Configure ALB + Auto Scaling')+' |\n';
    d+='| Auth | '+(_isBaas?'✅ '+(G?'BaaS管理':'BaaS-managed'):'ℹ️ '+(G?'冗長化を確認':'Verify redundancy'))+' | '+(_isBaas?G?'SDK管理のため不要':'Managed by SDK':G?'セッションストア（Redis）を検討':'Consider session store (Redis)')+' |\n\n';
    d+='### '+(G?'スケール別推奨構成':'Recommended Setup by Scale')+'\n\n';
    if(sc==='solo'){d+=(G?'**Solo**: シングルノード + 無料枠を活用。Supabase/Firebase無料枠 + Vercel/Netlify Hobby。':'**Solo**: Single node + free tiers. Supabase/Firebase free + Vercel/Netlify Hobby.')+'\n\n';}
    else if(sc==='small'){d+=(G?'**Small**: マネージドDB + 単一BE。Neon/Supabase Pro + Railway。垂直スケールで対応。':'**Small**: Managed DB + single BE. Neon/Supabase Pro + Railway. Vertical scaling.')+'\n\n';}
    else if(sc==='medium'){d+=(G?'**Medium**: 垂直スケール + Read Replica検討。Redis (Upstash) でAPIキャッシュ最適化。Sentry/Datadog監視。':'**Medium**: Vertical scaling + consider Read Replica. Redis (Upstash) for API cache. Sentry/Datadog monitoring.')+'\n\n';}
    else{d+=(G?'**Large**: 水平スケール必須。LB + Read Replica (×2) + Redis Cluster + PgBouncer。k8s/ECS + Auto Scaling Group。CDNエッジキャッシュ。':'**Large**: Horizontal scaling required. LB + Read Replica (×2) + Redis Cluster + PgBouncer. k8s/ECS + Auto Scaling Group. CDN edge cache.')+'\n\n';}
    if(sc==='large'&&!_isBaas){
      d+='### '+(G?'DBスケーリング戦略 (Largeスケール)':'DB Scaling Strategy (Large Scale)')+'\n\n';
      d+='#### '+(G?'レプリケーション構成比較':'Replication Configuration Comparison')+'\n\n';
      d+='| '+(G?'構成':'Config')+' | '+(G?'仕組み':'Mechanism')+' | '+(G?'読み取り':'Read')+' | '+(G?'書き込み':'Write')+' | '+(G?'障害時':'On Failure')+' | '+(G?'適用シーン':'Best For')+' |\n';
      d+='|------|------|------|------|------|---------|\n';
      d+='| Leader-Follower | '+(G?'1つのLeaderが全書き込みを処理':'1 Leader handles all writes')+' | '+(G?'Followerから分散':'Distributed from Followers')+' | '+(G?'Leader集中':'Leader only')+' | '+(G?'Followerが自動昇格':'Follower promotes')+' | '+(G?'Read-Heavy・BI':'Read-heavy, BI')+' |\n';
      d+='| Leader-Leader | '+(G?'複数Leaderが書き込みを分担':'Multiple Leaders share writes')+' | '+(G?'全Leaderから可':'From any Leader')+' | '+(G?'分散書き込み':'Distributed write')+' | '+(G?'他Leaderが継続':'Other Leaders continue')+' | '+(G?'地理分散・Multi-Region':'Geo-distributed, multi-region')+' |\n\n';
      d+='#### '+(G?'同期 vs 非同期レプリケーション':'Sync vs Async Replication Trade-offs')+'\n\n';
      d+='| '+(G?'観点':'Aspect')+' | '+(G?'同期 (Sync)':'Sync')+' | '+(G?'非同期 (Async)':'Async')+' |\n|------|------|------|\n';
      d+='| '+(G?'一貫性':'Consistency')+' | ✅ '+(G?'完全一貫 (RPO=0)':'Full consistency (RPO=0)')+' | ⚠️ '+(G?'結果整合 (RPO>0)':'Eventual (RPO>0)')+' |\n';
      d+='| '+(G?'レイテンシ':'Latency')+' | '+(G?'高い（Follower確認待ち）':'High (waits for Follower ack)')+' | '+(G?'低い（Leader即レスポンス）':'Low (Leader responds immediately)')+' |\n';
      d+='| '+(G?'障害時データロス':'Data loss on failure')+' | '+(G?'なし':'None')+' | '+(G?'最大: レプリケーション遅延分':'Up to: replication lag')+' |\n';
      d+='| '+(G?'推奨用途':'Recommended For')+' | '+(G?'決済・金融・医療データ':'Payment, finance, healthcare')+' | '+(G?'ログ・解析・コンテンツ配信':'Logs, analytics, CDN')+' |\n\n';
      var _entList120=(a.entities||'User, Post').split(',').map(function(e){return e.trim();}).filter(Boolean);
      var _shardCandidates=_entList120.filter(function(e){return /User|Order|Event|Log|Message|Record|Transaction/i.test(e);});
      var _shardKey=_shardCandidates.length>0?_shardCandidates[0]+'Id':'userId';
      d+='#### '+(G?'シャーディング戦略':'Sharding Strategy')+'\n\n';
      d+='| '+(G?'戦略':'Strategy')+' | '+(G?'仕組み':'Mechanism')+' | '+(G?'メリット':'Pros')+' | '+(G?'デメリット':'Cons')+' | '+(G?'推奨シーン':'When to Use')+' |\n';
      d+='|------|------|------|------|------|\n';
      d+='| Range Sharding | '+(G?'キー範囲でシャード分割 (例: userId 0-999→Shard1)':'Split by key range (e.g. userId 0-999→Shard1)')+' | '+(G?'範囲クエリ高速':'Fast range queries')+' | '+(G?'ホットスポットのリスク':'Hotspot risk')+' | '+(G?'時系列データ・日付分割':'Time-series, date-based')+' |\n';
      d+='| Hash Sharding | '+(G?'キーのハッシュ値でシャード決定':'Determine shard by hash of key')+' | '+(G?'均等分散':'Even distribution')+' | '+(G?'範囲クエリ困難':'Range queries hard')+' | '+(G?'均等負荷分散・大規模OLTP':'Uniform load, large OLTP')+' |\n\n';
      d+=(G
        ?'> **このプロジェクトのシャードキー候補**: `'+_shardKey+'`\n> エンティティ一覧 ('+_entList120.join(', ')+') からアクセス頻度の高いリレーションを起点に選定します。\n\n'
        :'> **Shard key candidates for this project**: `'+_shardKey+'`\n> Selected from entity list ('+_entList120.join(', ')+') based on most-accessed relationships.\n\n'
      );
      d+='#### '+(G?'段階的スケーリングロードマップ':'Incremental Scaling Roadmap')+'\n\n';
      d+='| '+(G?'フェーズ':'Phase')+' | '+(G?'構成':'Config')+' | '+(G?'目安QPS':'Target QPS')+' | '+(G?'主な作業':'Key Tasks')+' |\n|------|------|------|------|\n';
      d+='| Phase 1 | Leader + Read Replica ×2 + PgBouncer | ~2,000 QPS | '+(G?'Replica追加・コネクションプール設定':'Add replica, configure connection pool')+' |\n';
      d+='| Phase 2 | Phase 1 + Redis Cluster (L2キャッシュ) | ~10,000 QPS | '+(G?'キャッシュ層追加・TTL設計':'Add cache layer, TTL design')+' |\n';
      d+='| Phase 3 | Phase 2 + Hash Sharding ('+_shardKey+'ベース) | ~50,000 QPS | '+(G?'シャードキー設計・アプリ改修':'Shard key design, app refactor')+' |\n';
      d+='| Phase 4 | Phase 3 + Multi-Region + CQRS | 100,000+ QPS | '+(G?'リージョン分散・読み書き分離':'Regional distribution, read-write split')+' |\n\n';
      d+='#### '+(G?'競合解決戦略 (Leader-Leader / 分散書き込み時)':'Conflict Resolution (Leader-Leader / Distributed Writes)')+'\n\n';
      d+='| '+(G?'戦略':'Strategy')+' | '+(G?'仕組み':'Mechanism')+' | '+(G?'適用シーン':'Use Case')+' | '+(G?'注意点':'Caveat')+' |\n|------|------|------|------|\n';
      d+='| LWW (Last-Write-Wins) | '+(G?'最新タイムスタンプを優先':'Prefer latest timestamp')+' | '+(G?'ユーザープロフィール更新':'User profile updates')+' | '+(G?'クロック同期必須 (NTP)':'Clock sync required (NTP)')+' |\n';
      d+='| '+(G?'バージョンベクター':'Vector Clock')+' | '+(G?'因果関係を追跡して競合検出':'Track causality to detect conflicts')+' | '+(G?'ショッピングカート・予約':'Cart, reservation')+' | '+(G?'実装複雑度が高い':'High implementation complexity')+' |\n';
      d+='| '+(G?'カスタムマージ':'Custom Merge')+' | '+(G?'アプリレベルで競合を解決':'App-level conflict resolution')+' | '+(G?'共同編集・ドキュメント':'Collaborative docs')+' | '+(G?'ドメイン固有ロジックが必要':'Domain-specific logic required')+' |\n\n';
    }
    // §4 Protocols
    d+='## '+(G?'§4 通信プロトコル選定':'§4 Communication Protocol Selection')+'\n\n';
    d+='| '+(G?'プロトコル':'Protocol')+' | Transport | '+(G?'通信方向':'Direction')+' | '+(G?'接続性':'Connection')+' | '+(G?'レイテンシ':'Latency')+' | '+(G?'主なユースケース':'Use Cases')+' |\n';
    d+='|----------|---------|---------|---------|---------|----------|\n';
    d+='| HTTP/REST | TCP | '+(G?'Req/Res':'Req/Res')+' | '+(G?'ステートレス':'Stateless')+' | '+(G?'中':'Medium')+' | '+(G?'汎用API':'General API')+' |\n';
    d+='| WebSocket | TCP | '+(G?'双方向全二重':'Full-duplex')+' | '+(G?'永続接続':'Persistent')+' | '+(G?'低':'Low')+' | '+(G?'チャット・ゲーム':'Chat, gaming')+' |\n';
    d+='| SSE | TCP | '+(G?'サーバー→クライアント':'Server→Client')+' | '+(G?'永続接続':'Persistent')+' | '+(G?'低':'Low')+' | '+(G?'通知・ライブフィード':'Notifications, live feed')+' |\n';
    d+='| gRPC Stream | HTTP/2 | '+(G?'双方向ストリーム':'Bidirectional')+' | '+(G?'多重化':'Multiplexed')+' | '+(G?'最低':'Lowest')+' | '+(G?'マイクロサービス':'Microservices')+' |\n';
    d+='| MQTT | TCP/WS | '+(G?'Pub/Sub非同期':'Pub/Sub async')+' | '+(G?'ブローカー経由':'Via broker')+' | '+(G?'低（軽量）':'Low (lightweight)')+' | '+(G?'IoT・センサー':'IoT, sensors')+' |\n';
    d+='| AMQP | TCP | '+(G?'Pub/Sub+キュー':'Pub/Sub + Queue')+' | '+(G?'ブローカー経由':'Via broker')+' | '+(G?'中（信頼性保証）':'Medium (guaranteed)')+' | '+(G?'非同期ジョブ・MQ':'Async jobs, MQ')+' |\n\n';
    d+='### TCP vs UDP\n\n';
    d+='| '+(G?'観点':'Aspect')+' | TCP | UDP |\n|------|-----|-----|\n';
    d+='| '+(G?'接続確立':'Connection')+' | '+(G?'3-wayハンドシェイク (SYN→SYN-ACK→ACK)':'3-way handshake (SYN→SYN-ACK→ACK)')+' | '+(G?'コネクションレス':'Connectionless')+' |\n';
    d+='| '+(G?'信頼性':'Reliability')+' | '+(G?'順序保証・再送あり':'Ordered + retransmit')+' | '+(G?'ベストエフォート':'Best effort')+' |\n';
    d+='| '+(G?'速度':'Speed')+' | '+(G?'中（ハンドシェイクオーバーヘッド）':'Medium (handshake overhead)')+' | '+(G?'高速':'Fast')+' |\n';
    d+='| '+(G?'用途':'Use')+' | HTTP/HTTPS, WebSocket, DB | '+(G?'DNS・ゲーム・映像配信':'DNS, gaming, video streaming')+' |\n\n';
    d+='### '+(G?'本プロジェクトへの推奨':'Project Recommendations')+'\n\n';
    if(_hasRT){d+='- ✅ **WebSocket**: '+(G?'リアルタイム要件に対応。Socket.io + Redis Adapter (@socket.io/redis-adapter) で水平スケール対応。':'Meets realtime requirements. Socket.io + Redis Adapter (@socket.io/redis-adapter) for horizontal scaling.')+'\n';}
    if(_hasIoT){d+='- ✅ **MQTT**: '+(G?'IoT/センサー収集に最適。ブローカー: EMQX/Mosquitto/HiveMQ。MQTT over WebSocketでブラウザ接続も可能。':'Optimal for IoT/sensor collection. Brokers: EMQX/Mosquitto/HiveMQ. MQTT over WebSocket for browser.')+'\n';}
    if(_isBaas){d+='- ✅ '+(G?'BaaSリアルタイム: '+be120+' のリアルタイム機能（Supabase Realtime/Firebase onSnapshot）を活用。WebSocket自前実装は不要。':'BaaS Realtime: Leverage '+be120+'\'s realtime features (Supabase Realtime/Firebase onSnapshot). No need to implement WebSocket yourself.')+'\n';}
    if(!_hasRT&&!_hasIoT&&!_isBaas){d+='- ✅ **HTTP/REST**: '+(G?'本プロジェクトの用途に最適。SSEを追加すると通知機能を低コストで実装可能。':'Optimal for this project\'s use case. Adding SSE enables notifications at low cost.')+'\n';}
    d+='\n';
    // §5 Summary
    d+='## '+(G?'§5 プロジェクト固有推奨サマリ':'§5 Project-Specific Recommendation Summary')+'\n\n';
    d+='| '+(G?'観点':'Aspect')+' | '+(G?'選定':'Selected')+' | '+(G?'理由':'Reason')+' |\n|------|------|------|\n';
    d+='| API Style | '+apiStyle+' | '+(_isBaas?G?'BaaS SDKで開発速度最大化':'BaaS SDK maximizes dev speed':_isGQL?G?'柔軟なデータ取得でSPA最適化':'Flexible data fetching for SPA':_isGRPC?G?'低レイテンシマイクロサービス通信':'Low-latency microservice communication':G?'HTTP標準・広い互換性':'HTTP standard, broad compatibility')+'|\n';
    d+='| Database | '+dbKey+' | '+(_isNoSQL?G?'スキーマレスで柔軟なデータ構造':'Flexible schema-less structure':G?'ACID準拠・型安全・豊富なエコシステム':'ACID compliant, type-safe, rich ecosystem')+'|\n';
    d+='| '+(G?'スケーリング':'Scaling')+' | '+(sc==='large'?G?'水平+LB':'Horizontal+LB':sc==='medium'?G?'垂直+ReadReplica検討':'Vertical+ReadReplica':G?'シングルノード':'Single node')+' | '+(sc==='large'?G?'大規模要件・冗長化必須':'Large scale, redundancy required':sc==='medium'?G?'成長フェーズ対応':'Growth phase readiness':G?'初期フェーズ最適':'Early phase optimal')+'|\n';
    d+='| '+(G?'主要プロトコル':'Protocol')+' | '+(_hasRT?'WebSocket':_hasIoT?'MQTT':'HTTP/REST')+' | '+(_hasRT?G?'リアルタイム要件':'Realtime requirements':_hasIoT?G?'IoT軽量プロトコル':'IoT lightweight':G?'汎用標準':'General standard')+'|\n\n';
    d+='### '+(G?'参照ドキュメント':'Reference Documents')+'\n\n';
    d+='- [ADR-008 '+(G?'APIスタイル選定':'API Style')+' → ADR-003 '+(G?'DB選定':'DB Selection')+'](./82-2_architecture_decision_records.md)\n';
    d+='- ['+(G?'アーキテクチャ整合性チェック':'Architecture Integrity Check')+'](./82_architecture_integrity_check.md)\n';
    d+='- ['+(G?'インフラ・DevOps':'Infra/DevOps')+'](./71_devops.md)\n';
    d+='- ['+(G?'パフォーマンスバジェット':'Performance Budget')+'](./94_performance_budget.md)\n';
    S.files['docs/120_system_design_guide.md']=d;
  })();

  // ═══ docs/121_security_design_guide.md ═══
  (function(){
    function _inc(v,k){return v&&v.indexOf(k)!==-1;}
    var be121=be; var dep121=a.deploy||'Vercel'; var sc121=a.scale||'medium';
    var dom121=detectDomain(a.purpose||'');
    var _isBaas=/Firebase|Supabase|Convex/i.test(be121);
    var _isStatic=/なし（静的|None|static/i.test(be121);
    var _isContainer=_inc(dep121,'Railway')||_inc(dep121,'Fly')||_inc(dep121,'ECS')||_inc(dep121,'Cloud Run')||_inc(dep121,'Render')||_inc(dep121,'Coolify')||(/Docker/i.test(dep121));
    var _isVercel=_inc(dep121,'Vercel');
    var _isAWS=_inc(dep121,'AWS')||_inc(dep121,'ECS');
    var _isGCP=_inc(dep121,'GCP')||_inc(dep121,'Cloud Run')||_inc(dep121,'Firebase Hosting');
    var _hiSec=/fintech|health|insurance|government|legal/i.test(dom121);
    var _isNode=/Express|NestJS|Hono|Fastify|Next/i.test(be121);
    var _isPy=/Python|FastAPI|Django/i.test(be121);
    function _classifyEnt(ent){
      if(/patient|medical|clinical|prescription|diagnosis/i.test(ent)) return 'restricted';
      if(/payment|credit|card|bank|transaction|financial/i.test(ent)) return 'restricted';
      if(/password|secret|apikey|token|credential/i.test(ent)) return 'restricted';
      if(/personal|pii|profile|identity|ssn|passport|insurance/i.test(ent)) return 'confidential';
      if(/user|customer|employee|order|invoice|contract/i.test(ent)) return 'confidential';
      if(/audit|log|event|session|notification/i.test(ent)) return 'internal';
      return 'public';
    }
    var d='# '+pn+' \u2014 '+(G?'\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u8a2d\u8a08\u30ac\u30a4\u30c9':'Security Design Guide')+'\n> '+date+'\n\n';
    d+='> '+(G?'\u30a6\u30a3\u30b6\u30fc\u30c9\u5165\u529b\u304b\u3089\u81ea\u52d5\u751f\u6210\u3002OWASP\u8a73\u7d30: [docs/43_security_intelligence.md](./43_security_intelligence.md)':'Auto-generated from wizard inputs. OWASP details: [docs/43_security_intelligence.md](./43_security_intelligence.md)')+'\n\n';
    // §1 Defense-in-Depth
    d+='## '+(G?'§1 \u591a\u5c64\u9632\u5fa1\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3 (Defense-in-Depth)':'§1 Defense-in-Depth Architecture')+'\n\n';
    d+=(G?'5\u5c64\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30e2\u30c7\u30eb\u3067\u30ea\u30b9\u30af\u3092\u5206\u6563\u3055\u305b\u3001\u5358\u4e00\u30ec\u30a4\u30e4\u30fc\u7a81\u7834\u304c\u5168\u4f53\u4fb5\u5bb3\u306b\u3064\u306a\u304c\u3089\u306a\u3044\u8a2d\u8a08\u3002':'5-layer security model distributes risk so a single layer breach does not lead to full compromise.')+'\n\n';
    d+='| '+(G?'\u30ec\u30a4\u30e4\u30fc':'Layer')+' | '+(G?'\u76ee\u7684':'Purpose')+' | '+(G?'\u4e3b\u8981\u30b3\u30f3\u30c8\u30ed\u30fc\u30eb':'Key Controls')+' | '+(G?'\u672c\u30d7\u30ed\u30b8\u30a7\u30af\u30c8':'This Project')+' |\n';
    d+='|------|------|-------------|------------|\n';
    if(_isBaas){
      d+='| Network+Host | '+(G?'BaaS\u7ba1\u7406\uff08\u81ea\u52d5\uff09':'BaaS managed (auto)')+' | '+(G?'\u30d7\u30ed\u30d0\u30a4\u30c0\u5074\u3067\u5bfe\u5fdc\u6e08':'Provider handles it')+' | \u2705 '+be121+' |\n';
    } else {
      d+='| Network | '+(G?'\u5916\u90e8\u8106\u5a01\u906e\u65ad':'Block external threats')+' | WAF, DDoS'+(G?'\u5bfe\u7b56':' protection')+', CDN | '+(sc121==='large'?G?'WAF/Cloudflare\u5fc5\u9808':'WAF/Cloudflare required':G?'CDN + \u30ec\u30fc\u30c8\u5236\u9650':'CDN + rate limiting')+' |\n';
      d+='| Host | '+(G?'\u30b5\u30fc\u30d0\u30fc\u4fdd\u8b77':'Server protection')+' | '+(G?'OS\u5f37\u5316, \u6700\u5c0f\u6a29\u9650, \u30d1\u30c3\u30c1\u7ba1\u7406':'OS hardening, least privilege, patching')+' | '+(_isContainer?G?'Trivy/distroless\u6700\u5c0f\u5316':'Trivy/distroless image scan':G?'\u5b9a\u671f\u30d1\u30c3\u30c1\u9069\u7528':'Regular patching')+' |\n';
    }
    d+='| Application | '+(G?'\u30a2\u30d7\u30ea\u8106\u5a01\u6027\u5bfe\u7b56':'App vulnerability mitigation')+' | '+(G?'\u5165\u529b\u691c\u8a3c, OWASP Top 10, CSP':'Input validation, OWASP Top 10, CSP')+' | '+(G?'docs/43\u53c2\u7167':'See docs/43')+' |\n';
    d+='| Data | '+(G?'\u30c7\u30fc\u30bf\u4fdd\u8b77':'Data protection')+' | '+(G?'\u6697\u53f7\u5316 (at-rest/in-transit), \u30de\u30b9\u30ad\u30f3\u30b0, RLS':'Encryption (at-rest/in-transit), masking, RLS')+' | '+(_hiSec?G?'AES-256 + RLS\u5fc5\u9808':'AES-256 + RLS required':G?'TLS 1.3 + DB\u6697\u53f7\u5316':'TLS 1.3 + DB encryption')+' |\n';
    d+='| Monitoring | '+(G?'\u691c\u77e5\u30fb\u5bfe\u5fdc':'Detection & response')+' | '+(G?'SIEM, \u7570\u5e38\u691c\u77e5, \u30a2\u30e9\u30fc\u30c8':'SIEM, anomaly detection, alerting')+' | '+(sc121==='large'?G?'SIEM\u7d71\u5408\u63a8\u5968':'SIEM integration recommended':G?'\u30ed\u30b0\u96c6\u7d04 + \u30a2\u30e9\u30fc\u30c8':'Log aggregation + alerting')+' |\n\n';
    if(sc121==='large'){d+='> \u26a0\ufe0f **'+(G?'\u5927\u898f\u6a21\u74b0\u5883':'Large scale')+' \u2014 '+(G?'WAF (AWS WAF/Cloudflare)\u3068DDoS\u5bfe\u7b56 (AWS Shield/Cloudflare DDoS)\u3092\u5fc5\u305a\u8a2d\u5b9a\u3057\u3066\u304f\u3060\u3055\u3044\u3002':'Configure WAF (AWS WAF/Cloudflare) and DDoS protection (AWS Shield) for production.')+'**\n\n';}
    if(_isContainer){d+='> \ud83d\udc33 **'+(G?'\u30b3\u30f3\u30c6\u30ca\u30fc\u74b0\u5883':'Container environment')+' \u2014 '+(G?'distroless\u307e\u305f\u306falpine\u30d9\u30fc\u30b9\u30a4\u30e1\u30fc\u30b8\u3092\u4f7f\u7528\u3057\u3001Trivy\u3067CI\u30a4\u30e1\u30fc\u30b8\u30b9\u30ad\u30e3\u30f3\u3092\u5b9f\u65bd\u3057\u3066\u304f\u3060\u3055\u3044\u3002':'Use distroless or alpine base images and run Trivy image scanning in CI.')+'**\n\n';}
    d+='> '+(G?'\u53c2\u7167: [A05 \u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u8a2d\u5b9a\u30df\u30b9](./43_security_intelligence.md)':'Reference: [A05 Security Misconfiguration](./43_security_intelligence.md)')+'\n\n';
    // §2 Secrets Management Lifecycle
    d+='## '+(G?'§2 \u30b7\u30fc\u30af\u30ec\u30c3\u30c8\u7ba1\u7406\u30e9\u30a4\u30d5\u30b5\u30a4\u30af\u30eb':'§2 Secrets Management Lifecycle')+'\n\n';
    d+=(G?'\u30b7\u30fc\u30af\u30ec\u30c3\u30c8\uff08API\u30ad\u30fc\u30fbDB\u63a5\u7d9a\u6587\u5b57\u5217\u30fb\u30c8\u30fc\u30af\u30f3\uff09\u306f\u30b3\u30fc\u30c9\u306b\u30cf\u30fc\u30c9\u30b3\u30fc\u30c9\u305b\u305a\u3001\u5c02\u7528\u30c4\u30fc\u30eb\u3067\u7ba1\u7406\u3059\u308b\u3002':'Secrets (API keys, DB connection strings, tokens) must never be hardcoded — use dedicated management tools.')+'\n\n';
    d+='### '+(G?'\u30e9\u30a4\u30d5\u30b5\u30a4\u30af\u30eb 5\u6bb5\u968e':'5-Stage Lifecycle')+'\n\n';
    d+='| '+(G?'\u6bb5\u968e':'Stage')+' | '+(G?'\u5185\u5bb9':'What')+' | '+(G?'\u30d9\u30b9\u30c8\u30d7\u30e9\u30af\u30c6\u30a3\u30b9':'Best Practice')+' |\n|------|------|----------------|\n';
    d+='| 1. Create | '+(G?'\u751f\u6210\u30fb\u767a\u884c':'Generate / issue')+' | '+(G?'\u6700\u5c0f\u6a29\u9650\u30fb\u6709\u52b9\u671f\u9650\u8a2d\u5b9a':'Least privilege + expiry')+' |\n';
    d+='| 2. Store | '+(G?'\u5b89\u5168\u306a\u4fdd\u7ba1':'Secure storage')+' | '+(G?'\u5c02\u7528\u30c4\u30fc\u30eb\u4f7f\u7528\u30fbGit\u306b\u542b\u3081\u306a\u3044':'Use dedicated tool, never commit to Git')+' |\n';
    d+='| 3. Access | '+(G?'\u30a2\u30af\u30bb\u30b9\u5236\u5fa1':'Access control')+' | '+(G?'\u74b0\u5883\u5909\u6570 or Secret Manager\u7d4c\u7531':'Via env vars or Secret Manager')+' |\n';
    d+='| 4. Rotate | '+(G?'\u5b9a\u671f\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3':'Periodic rotation')+' | '+(G?'90\u65e5\u4ee5\u5185\u30fbCI/CD\u81ea\u52d5\u5316':'Within 90 days, automate in CI/CD')+' |\n';
    d+='| 5. Revoke | '+(G?'\u5931\u52b9\u30fb\u5ec3\u68c4':'Revoke / retire')+' | '+(G?'\u5373\u6642\u5931\u52b9\u30fb\u76e3\u67fb\u30ed\u30b0\u8a18\u9332':'Immediate revocation + audit log')+' |\n\n';
    d+='### '+(G?'\u30c4\u30fc\u30eb\u6bd4\u8f03 (6\u7a2e)':'Tool Comparison (6 tools)')+'\n\n';
    d+='| '+(G?'\u30c4\u30fc\u30eb':'Tool')+' | '+(G?'\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3':'Rotation')+' | '+(G?'\u76e3\u67fb':'Audit')+' | '+(G?'\u9069\u5408\u74b0\u5883':'Best For')+' | '+(G?'\u30b3\u30b9\u30c8\u76ee\u5b89':'Cost')+' |\n|------|-----------|------|----------|------|\n';
    d+='| **Doppler** | \u2705'+(G?'\u81ea\u52d5':'auto')+' | \u2705 | '+(G?'\u3042\u3089\u3086\u308b\u74b0\u5883':'Any environment')+' | Free\u301c |\n';
    d+='| **HashiCorp Vault** | \u2705'+(G?'\u52d5\u7684':'dynamic')+' | \u2705 | '+(G?'\u5927\u898f\u6a21\u30fb\u30aa\u30f3\u30d7\u30ec':'Large scale / on-premise')+' | OSS/Enterprise |\n';
    d+='| **SOPS** | \u26a0\ufe0f'+(G?'\u624b\u52d5':'manual')+' | \u2705Git | '+(G?'GitOps\u30fb\u30d5\u30a1\u30a4\u30eb\u30d9\u30fc\u30b9':'GitOps, file-based')+' | Free |\n';
    d+='| **AWS Secrets Manager** | \u2705'+(G?'\u81ea\u52d5':'auto')+' | \u2705CloudTrail | '+(G?'AWS\u74b0\u5883':'AWS environments')+' | $0.40/secret/mo |\n';
    d+='| **GCP Secret Manager** | \u2705'+(G?'\u81ea\u52d5':'auto')+' | \u2705Cloud Audit | '+(G?'GCP\u74b0\u5883':'GCP environments')+' | $0.06/10K ops |\n';
    d+='| **1Password CLI** | \u26a0\ufe0f'+(G?'\u624b\u52d5':'manual')+' | \u2705 | '+(G?'\u30c1\u30fc\u30e0\u30fb\u958b\u767a\u74b0\u5883':'Teams, dev environments')+' | $3/user/mo |\n\n';
    d+='### '+(G?'\u30c7\u30d7\u30ed\u30a4\u5225\u63a8\u5968':'Deploy-Specific Recommendation')+'\n\n';
    if(_isVercel) d+='**Vercel**: '+(G?'Vercel Environment Variables\uff08\u6697\u53f7\u5316\u6e08\u307f\uff09\u3092\u4f7f\u7528\u3002`.env`\u30d5\u30a1\u30a4\u30eb\u306f\u30ed\u30fc\u30ab\u30eb\u306e\u307f\u3002':'Use Vercel Environment Variables (encrypted). Keep `.env` files local only.')+'\n\n';
    else if(_isAWS) d+='**AWS**: '+(G?'AWS Secrets Manager\u3092\u4f7f\u7528\u3002\u30ed\u30fc\u30c6\u30fc\u30b7\u30e7\u30f3Lambda\u3067\u81ea\u52d5\u5316\u3002IAM\u30ed\u30fc\u30eb\u3067\u30a2\u30d7\u30ea\u304b\u3089\u30a2\u30af\u30bb\u30b9\u3002':'Use AWS Secrets Manager. Automate rotation with Lambda. Access from app via IAM Role.')+'\n\n';
    else if(_isGCP) d+='**GCP**: '+(G?'GCP Secret Manager\u3092\u4f7f\u7528\u3002Cloud Run\u306e\u30b5\u30fc\u30d3\u30b9\u30a2\u30ab\u30a6\u30f3\u30c8\u306b\u6700\u5c0f\u6a29\u9650IAM\u3092\u8a2d\u5b9a\u3002':'Use GCP Secret Manager. Assign minimal permission IAM to Cloud Run service account.')+'\n\n';
    else if(_isBaas) d+='**'+be121+'**: '+(G?'Firebase App Check + Firebase Secret Manager\u3092\u4f7f\u7528\u3002\u30af\u30e9\u30a4\u30a2\u30f3\u30c8\u30b5\u30a4\u30c9APIKey\u9732\u51fa\u306b\u6ce8\u610f\u3002':'Use Firebase App Check + Secret Manager. Beware of client-side API key exposure.')+'\n\n';
    else d+='**'+dep121+'**: '+(G?'\u74b0\u5883\u5909\u6570\u7ba1\u7406\u30c4\u30fc\u30eb\uff08Doppler\u63a8\u5968\uff09\u3092\u4f7f\u7528\u3002\u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u306eSecret\u7ba1\u7406\u6a5f\u80fd\u3092\u6d3b\u7528\u3002':'Use env var management tool (Doppler recommended). Leverage platform secret management features.')+'\n\n';
    d+='> \u26a0\ufe0f '+(G?'**\u30a8\u30f3\u30d9\u30ed\u30fc\u30d7\u6697\u53f7\u5316**: \u30c7\u30fc\u30bf\u30ad\u30fc (DEK)\u3092\u30de\u30b9\u30bf\u30fc\u30ad\u30fc (KEK)\u3067\u6697\u53f7\u5316\u3059\u308b2\u5c64\u69cb\u9020\u3002AWS KMS/Cloud KMS\u304cKEK\u3092\u7ba1\u7406\u3002':'**Envelope Encryption**: 2-layer structure \u2014 data key (DEK) encrypted by master key (KEK). AWS KMS/Cloud KMS manages KEK.')+'\n\n';
    d+='> '+(G?'\u53c2\u7167: [A02 \u6697\u53f7\u5316\u306e\u5931\u6557](./43_security_intelligence.md)':'Reference: [A02 Cryptographic Failures](./43_security_intelligence.md)')+'\n\n';
    // §3 Supply Chain Security
    d+='## '+(G?'§3 \u30bd\u30d5\u30c8\u30a6\u30a7\u30a2\u30b5\u30d7\u30e9\u30a4\u30c1\u30a7\u30fc\u30f3\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3':'§3 Software Supply Chain Security')+'\n\n';
    d+=(G?'\u4f9d\u5b58\u95a2\u4fc2\u30fb\u30d3\u30eb\u30c9\u6210\u679c\u7269\u30fb\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3092\u901a\u3058\u305f\u653b\u6483\u30ea\u30b9\u30af\u3092\u4f53\u7cfb\u7684\u306b\u7ba1\u7406\u3059\u308b\u3002':'Systematically manage attack risks through dependencies, build artifacts, and container images.')+'\n\n';
    d+='### '+(G?'SLSA \u6210\u719f\u5ea6\u30ec\u30d9\u30eb (Supply-chain Levels for Software Artifacts)':'SLSA Maturity Levels')+'\n\n';
    d+='| Level | '+(G?'\u8981\u4ef6':'Requirements')+' | '+(G?'\u672c\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u76ee\u6a19 ('+sc121+')':'Target ('+sc121+')')+' |\n|-------|------------|-------------------|\n';
    d+='| L1 | '+(G?'\u30d3\u30eb\u30c9\u30b9\u30af\u30ea\u30d7\u30c8\u306e\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8\u5316':'Build script documentation')+' | '+(sc121==='solo'?'\u2705 '+(G?'\u63a8\u5968':'Recommended'):'\u2705 '+(G?'\u9054\u6210\u6e08\u307f\u57fa\u6e96':'Baseline'))+' |\n';
    d+='| L2 | '+(G?'\u30d0\u30fc\u30b8\u30e7\u30f3\u7ba1\u7406 + CI/CD\u7d71\u5408':'Version control + CI/CD integration')+' | '+(sc121!=='solo'?'\u2705 '+(G?'\u63a8\u5968':'Recommended'):'—')+' |\n';
    d+='| L3 | '+(G?'\u6539\u305a\u3093\u9632\u6b62\u30d3\u30eb\u30c9\u74b0\u5883':'Tamper-resistant build environment')+' | '+(sc121==='large'?'\u2705 '+(G?'\u63a8\u5968 (GitHub OIDC + Sigstore)':'Recommended (GitHub OIDC + Sigstore)'):'—')+' |\n';
    d+='| L4 | '+(G?'\u5b8c\u5168\u306b\u5206\u96e2\u3057\u305f2\u8005\u7f72\u540d':'Fully isolated 2-party signing')+' | '+(G?'\u5927\u898f\u6a21\u91d1\u878d\u30fb\u653f\u5e9c\u5411\u3051\u306e\u307f':'Large-scale finance/government only')+' |\n\n';
    d+='### SBOM (Software Bill of Materials)\n\n';
    d+='| '+(G?'\u30c4\u30fc\u30eb':'Tool')+' | '+(G?'\u51fa\u529b\u5f62\u5f0f':'Output Format')+' | '+(G?'\u7528\u9014':'Usage')+' |\n|------|------------|------|\n';
    d+='| **CycloneDX** | JSON/XML | '+(G?'\u8106\u5a01\u6027\u30b9\u30ad\u30e3\u30f3\u30fb\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9':'Vulnerability scanning, compliance')+' |\n';
    d+='| **Syft** | SPDX/CycloneDX | '+(G?'\u30b3\u30f3\u30c6\u30ca\u30fb\u30d5\u30a1\u30a4\u30eb\u30b7\u30b9\u30c6\u30e0SBOM\u751f\u6210':'Container / filesystem SBOM generation')+' |\n\n';
    d+='**'+(G?'\u63a8\u5968\u30e9\u30a4\u30d5\u30b5\u30a4\u30af\u30eb':'Recommended lifecycle')+'**: '+(G?'(1)\u30d3\u30eb\u30c9\u6642SBOM\u751f\u6210 \u2192 (2)\u8106\u5a01\u6027DB\u7167\u5408 \u2192 (3)\u30ea\u30ea\u30fc\u30b9\u306b\u6dfb\u4ed8 \u2192 (4)\u5b9a\u671f\u518d\u30b9\u30ad\u30e3\u30f3':'(1) Generate SBOM at build \u2192 (2) Check against vuln DB \u2192 (3) Attach to release \u2192 (4) Periodic rescan')+'\n\n';
    d+='### '+(G?'\u6210\u679c\u7269\u7f72\u540d & \u4f9d\u5b58\u95a2\u4fc2\u30dd\u30ea\u30b7\u30fc':'Artifact Signing & Dependency Policy')+'\n\n';
    if(_isContainer){d+='- **cosign** (Sigstore): '+(G?'\u30b3\u30f3\u30c6\u30ca\u30a4\u30e1\u30fc\u30b8\u3078\u306e\u6697\u53f7\u7f72\u540d\u3002`cosign sign --key cosign.key image`':'Cryptographic signing of container images. `cosign sign --key cosign.key image`')+'\n';}
    d+='- **npm provenance**: '+(G?'`npm publish --provenance` \u3067SBOM\u3092\u81ea\u52d5\u751f\u6210':'Auto-generate SBOM with `npm publish --provenance`')+'\n';
    d+='- **lockfile**: '+(G?'`package-lock.json`/`pnpm-lock.yaml`\u3092\u5fc5\u305a\u30b3\u30df\u30c3\u30c8\u3002CI\u3067lockfile checksum\u691c\u8a3c':'Always commit lockfile. Verify lockfile checksum in CI')+'\n';
    d+='- **--ignore-scripts**: '+(G?'npm\u30a4\u30f3\u30b9\u30c8\u30fc\u30eb\u6642\u306bpostinstall\u30b9\u30af\u30ea\u30d7\u30c8\u5b9f\u884c\u3092\u7981\u6b62\uff08SolarWinds\u578b\u653b\u6483\u9632\u6b62\uff09':'Prevent postinstall script execution on npm install (prevents SolarWinds-type attacks)')+'\n\n';
    if(_isNode){d+='**Node.js**: `npm audit` (weekly CI) + Snyk (PR gate) + `npm-audit-resolver` (suppression\u7ba1\u7406)\n\n';}
    if(_isPy){d+='**Python**: `pip-audit` + Bandit (`bandit -r src/`) + Safety (dependency check)\n\n';}
    if(!_isNode&&!_isPy&&!_isBaas){d+='**'+be121+'**: Trivy (universal scanner) + \u30d7\u30e9\u30c3\u30c8\u30d5\u30a9\u30fc\u30e0\u56fa\u6709SCA tool\u3092\u4f75\u7528\n\n';}
    d+='> '+(G?'\u53c2\u7167: [A03 \u30a4\u30f3\u30b8\u30a7\u30af\u30b7\u30e7\u30f3](./43_security_intelligence.md)':'Reference: [A03 Injection](./43_security_intelligence.md)')+'\n\n';
    // §4 Data Classification
    d+='## '+(G?'§4 \u30c7\u30fc\u30bf\u5206\u985e\u30d5\u30ec\u30fc\u30e0\u30ef\u30fc\u30af':'§4 Data Classification Framework')+'\n\n';
    d+=(G?'\u5168\u30c7\u30fc\u30bf\u3092\u30d53\u30a4\u30a2\u306b\u5206\u985e\u3057\u3001\u30c6\u30a3\u30a2\u306b\u5fdc\u3058\u305f\u4fdd\u8b77\u8981\u4ef6\u3092\u9069\u7528\u3059\u308b\u3002':'Classify all data into 4 tiers and apply protection requirements per tier.')+'\n\n';
    d+='| '+(G?'\u30c6\u30a3\u30a2':'Tier')+' | '+(G?'\u5b9a\u7fa9':'Definition')+' | '+(G?'\u6697\u53f7\u5316':'Encryption')+' | '+(G?'\u30a2\u30af\u30bb\u30b9\u5236\u5fa1':'Access Control')+' | '+(G?'\u4fdd\u5b58\u671f\u9593':'Retention')+' | '+(G?'\u76e3\u67fb':'Audit')+' |\n|------|------|---------|------------|---------|------|\n';
    d+='| **Restricted** | PII/PHI/PCI | AES-256 | '+(G?'\u6700\u5c0f\u6a29\u9650 + MFA':'Least privilege + MFA')+' | '+(G?'\u6cd5\u5b9a\u671f\u9593':'Legal req')+' | \u2705 '+(G?'\u5fc5\u9808':'Required')+' |\n';
    d+='| **Confidential** | '+(G?'\u696d\u52d9\u6a5f\u5bc6':'Business confidential')+' | TLS 1.3 + DB\u6697\u53f7\u5316 | RBAC | 3'+(G?'\u5e74':'y')+' | \u2705 '+(G?'\u63a8\u5968':'Recommended')+' |\n';
    d+='| **Internal** | '+(G?'\u793e\u5185\u5229\u7528\u30c7\u30fc\u30bf':'Internal use data')+' | TLS 1.3 | '+(G?'\u8a8d\u8a3c\u6e08\u307f\u30e6\u30fc\u30b6\u30fc':'Authenticated users')+' | 1'+(G?'\u5e74':'y')+' | \u26a0\ufe0f '+(G?'\u4efb\u610f':'Optional')+' |\n';
    d+='| **Public** | '+(G?'\u516c\u958b\u60c5\u5831':'Public information')+' | TLS 1.3 | '+(G?'\u306a\u3057':'None')+' | '+(G?'\u4e0d\u8981':'N/A')+' | \u2014 |\n\n';
    if(entities&&entities.length>0){
      d+='### '+(G?'\u30a8\u30f3\u30c6\u30a3\u30c6\u30a3\u81ea\u52d5\u5206\u985e\uff08\u672c\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\uff09':'Entity Auto-Classification (This Project)')+'\n\n';
      d+='| '+(G?'\u30a8\u30f3\u30c6\u30a3\u30c6\u30a3':'Entity')+' | '+(G?'\u5206\u985e':'Tier')+' | '+(G?'\u53d6\u6271\u3044\u8981\u4ef6':'Handling')+' |\n|--------|------|----------|\n';
      entities.forEach(function(ent){
        var tier=_classifyEnt(ent);
        var req=tier==='restricted'?(G?'AES-256\u6697\u53f7\u5316 + RLS + MFA + \u76e3\u67fb\u30ed\u30b0':'AES-256 + RLS + MFA + Audit Log'):
                tier==='confidential'?(G?'DB\u6697\u53f7\u5316 + RBAC + \u76e3\u67fb\u30ed\u30b0\u63a8\u5968':'DB encryption + RBAC + Audit Log'):
                tier==='internal'?(G?'\u8a8d\u8a3c\u5fc5\u9808':'Auth required'):(G?'\u516c\u958b\u53ef':'Public OK');
        d+='| '+ent+' | '+tier+' | '+req+' |\n';
      });
      d+='\n';
    }
    if(dom121==='health'||dom121==='medical'||/\u533b\u7642|\u75c5\u9662|hospital|clinic/i.test(a.purpose||'')){d+='> \ud83c\udfe5 '+(G?'**PHI (Protected Health Information)**: HIPAA\u6e96\u62e0\u304c\u5fc5\u8981\u3002\u60a3\u8005\u30c7\u30fc\u30bf\u306f\u5fc5\u305aRestricted\u6271\u3044\u3002':'**PHI (Protected Health Information)**: HIPAA compliance required. Patient data must be Restricted tier.')+'\n\n';}
    if(dom121==='fintech'||/payment|\u6c7a\u6e08|pci/i.test(a.purpose||'')){d+='> \ud83d\udcb3 '+(G?'**PCI DSS**: \u30ab\u30fc\u30c9\u4f1a\u54e1\u30c7\u30fc\u30bf\u306fRestricted\u6271\u3044\u3002\u30c8\u30fc\u30af\u30ca\u30a4\u30bc\u30fc\u30b7\u30e7\u30f3\u3067PCI DSS\u30b9\u30b3\u30fc\u30d7\u3092\u6700\u5c0f\u5316\u63a8\u5968\u3002':'**PCI DSS**: Cardholder data is Restricted. Tokenization recommended to minimize PCI DSS scope.')+'\n\n';}
    d+='> '+(G?'\u53c2\u7167: [A02 \u6697\u53f7\u5316](./43_security_intelligence.md) | [\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u30de\u30c8\u30ea\u30af\u30b9](./45_compliance_matrix.md)':'Reference: [A02 Encryption](./43_security_intelligence.md) | [Compliance Matrix](./45_compliance_matrix.md)')+'\n\n';
    // §5 Security Pipeline
    d+='## '+(G?'§5 \u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u7d71\u5408':'§5 Security Pipeline Integration')+'\n\n';
    d+=(G?'SAST\u30fbSCA\u30fbDAST\u3092CI/CD\u30d1\u30a4\u30d7\u30e9\u30a4\u30f3\u306b\u7d71\u5408\u3057\u3001\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u3092\u300c\u5f8c\u4ed8\u3051\u300d\u3067\u306f\u306a\u304f\u300c\u7d44\u307f\u8fbc\u307f\u300d\u306b\u3059\u308b\u3002':'Integrate SAST, SCA, and DAST into CI/CD to make security built-in, not bolted on.')+'\n\n';
    d+='### SAST / SCA '+(G?'\u30c4\u30fc\u30eb\u6bd4\u8f03':'Tool Comparison')+'\n\n';
    d+='| '+(G?'\u30c4\u30fc\u30eb':'Tool')+' | '+(G?'\u7a2e\u5225':'Type')+' | '+(G?'\u8a00\u8a9e':'Language')+' | CI | '+(G?'\u7279\u5fb4':'Feature')+' |\n|------|------|------|---------|-------|\n';
    d+='| **Semgrep** | SAST | '+(G?'\u591a\u8a00\u8a9e':'Multi-lang')+' | \u2705 GitHub Actions | '+(G?'\u30ab\u30b9\u30bf\u30e0\u30eb\u30fc\u30eb\u30fb\u9ad8\u901f':'Custom rules, fast')+' |\n';
    d+='| **CodeQL** | SAST | JS/TS/Python/Go | \u2705 GitHub Advanced Security | '+(G?'\u6df1\u3044\u89e3\u6790\u30fbOSS\u7121\u6599':'Deep analysis, free for OSS')+' |\n';
    d+='| **SonarQube** | SAST+SCA | '+(G?'\u591a\u8a00\u8a9e':'Multi-lang')+' | \u2705 PR gate | '+(G?'\u54c1\u8cea\u30b2\u30fc\u30c8\u30fb\u7dcf\u5408\u30ec\u30dd\u30fc\u30c8':'Quality gate, comprehensive report')+' |\n';
    d+='| **Trivy** | SCA+Container | '+(G?'\u4e07\u80fd':'Universal')+' | \u2705 | SBOM'+(G?'\u751f\u6210\u30fbCVE\u30b9\u30ad\u30e3\u30f3':'gen + CVE scan')+' |\n';
    d+='| **Snyk** | SCA | '+(G?'\u591a\u8a00\u8a9e':'Multi-lang')+' | \u2705 PR decorator | '+(G?'Fix PR\u81ea\u52d5\u751f\u6210':'Auto fix PR generation')+' |\n';
    d+='| **npm audit** | SCA | Node.js | \u2705 | '+(G?'\u7d44\u307f\u8fbc\u307f\u30fb\u5373\u6642\u5b9f\u884c\u53ef':'Built-in, instant')+' |\n\n';
    d+='### '+(G?'backend\u5225\u63a8\u5968\u30b9\u30bf\u30c3\u30af':'Backend-Specific Stack')+'\n\n';
    if(_isNode){d+='**Node.js/TypeScript**: Semgrep (`semgrep --config=auto`) + `npm audit --audit-level=high` + Snyk (PR gate)\n\n';}
    else if(_isPy){d+='**Python**: Semgrep + Bandit (`bandit -r src/`) + `pip-audit` (dependency check)\n\n';}
    else if(_isBaas){d+='**BaaS ('+be121+')**: Semgrep (FE code) + `npm audit` + Snyk (client dependencies)\n\n';}
    else{d+='**'+be121+'**: Trivy (universal) + Semgrep ('+(G?'\u30ab\u30b9\u30bf\u30e0\u30eb\u30fc\u30eb':'custom rules')+') + SonarQube (quality gate)\n\n';}
    d+='### '+(G?'\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30b2\u30fc\u30c8\u57fa\u6e96':'Security Gate Criteria')+'\n\n';
    d+='| '+(G?'\u30b2\u30fc\u30c8':'Gate')+' | '+(G?'\u30bf\u30a4\u30df\u30f3\u30b0':'Timing')+' | '+(G?'\u5408\u683c\u57fa\u6e96':'Pass Criteria')+' |\n|------|---------|----------|\n';
    d+='| PR Gate | Pull Request | '+(G?'Critical/High\u8106\u5a01\u6027\u30bc\u30ed + SAST\u30a8\u30e9\u30fc\u30bc\u30ed':'Zero Critical/High vulns + zero SAST errors')+' |\n';
    d+='| Deploy Gate | '+(G?'\u30b9\u30c6\u30fc\u30b8\u30f3\u30b0\u30c7\u30d7\u30ed\u30a4':'Staging deploy')+' | '+(G?'SAST\u30af\u30ea\u30fc\u30f3 + DAST\u57fa\u672c\u30c6\u30b9\u30c8\u901a\u904e':'SAST clean + DAST basic tests passed')+' |\n';
    d+='| Release Gate | '+(G?'\u672c\u756a\u30ea\u30ea\u30fc\u30b9':'Production release')+' | '+(G?'\u5168\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30c6\u30b9\u30c8\u901a\u904e + \u30da\u30f3\u30c6\u30b9\u30c8\u7d50\u679c\u78ba\u8a8d':'All security tests passed + pentest results reviewed')+' |\n\n';
    d+='### '+(G?'\u8106\u5a01\u6027\u5bfe\u5fdc SLA':'Vulnerability Response SLA')+'\n\n';
    d+='| '+(G?'\u91cd\u5927\u5ea6':'Severity')+' | SLA | '+(G?'\u5bfe\u5fdc\u65b9\u9488':'Policy')+' |\n|-------|-----|--------|\n';
    d+='| \ud83d\udd34 Critical | 24h | '+(G?'\u5373\u6642\u5bfe\u5fdc\u30fb\u672c\u756a\u505c\u6b62\u691c\u8a0e':'Immediate fix, consider prod halt')+' |\n';
    d+='| \ud83d\udfe0 High | 7d | '+(G?'\u7dca\u6025\u30ea\u30ea\u30fc\u30b9\u5bfe\u5fdc':'Emergency release')+' |\n';
    d+='| \ud83d\udfe1 Medium | 30d | '+(G?'\u6b21\u30b9\u30d7\u30ea\u30f3\u30c8\u306b\u542b\u3081\u308b':'Include in next sprint')+' |\n';
    d+='| \ud83d\udd35 Low | 90d | '+(G?'\u30d0\u30c3\u30af\u30ed\u30b0\u7a4d\u307f':'Add to backlog')+' |\n\n';
    d+='> '+(G?'\u53c2\u7167: [\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30c6\u30b9\u30c8](./47_security_testing.md)':'Reference: [Security Testing](./47_security_testing.md)')+'\n\n';
    // §6 Security Metrics
    d+='## '+(G?'§6 \u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30e1\u30c8\u30ea\u30af\u30b9\u30fbKPI':'§6 Security Metrics & KPI')+'\n\n';
    d+=(G?'\u6e2c\u5b9a\u306a\u304d\u6539\u5584\u306f\u306a\u3044\u3002\u4ee5\u4e0b8\u6307\u6a19\u3067\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u6210\u719f\u5ea6\u3092\u5b9a\u91cf\u5316\u3059\u308b\u3002':'You cannot improve what you do not measure. Quantify security maturity with these 8 metrics.')+'\n\n';
    d+='| '+(G?'\u6307\u6a19':'Metric')+' | '+(G?'\u5b9a\u7fa9':'Definition')+' | '+(G?'\u76ee\u6a19\u5024 ('+sc121+')':'Target ('+sc121+')')+' |\n|------|------|-----|\n';
    d+='| **MTTD** | '+(G?'\u5e73\u5747\u691c\u77e5\u6642\u9593 (Mean Time to Detect)':'Mean Time to Detect')+' | '+(sc121==='large'?'< 1h':sc121==='medium'?'< 24h':'< 72h')+' |\n';
    d+='| **MTTR** | '+(G?'\u5e73\u5747\u4fee\u5fa9\u6642\u9593 (Mean Time to Respond)':'Mean Time to Respond')+' | '+(sc121==='large'?G?'Critical < 4\u6642\u9593':'Critical < 4h':sc121==='medium'?G?'Critical < 24\u6642\u9593':'Critical < 24h':G?'Critical < 72\u6642\u9593':'Critical < 72h')+' |\n';
    d+='| **Vuln Aging** | '+(G?'\u8106\u5a01\u6027\u653e\u7f6e\u671f\u9593':'Average open vulnerability age')+' | '+(G?'High\u4ee5\u4e0a\u306e\u5e73\u5747\u653e\u7f6e < 7\u65e5':'High+ avg age < 7d')+' |\n';
    d+='| **Patch Cadence** | '+(G?'\u4f9d\u5b58\u95a2\u4fc2\u66f4\u65b0\u983b\u5ea6':'Dependency update frequency')+' | '+(G?'\u6708 2\u56de\u4ee5\u4e0a':'\u22652x/month')+' |\n';
    d+='| **Security Debt** | '+(G?'\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u8ca0\u50b5\u6bd4\u7387 (\u653e\u7f6e/\u7dcf\u8106\u5a01\u6027)':'Ratio of open to total vulns')+' | < 10% |\n';
    d+='| **FP Rate** | '+(G?'SAST\u306e\u8aa4\u691c\u77e5\u7387':'SAST false positive rate')+' | < 20% |\n';
    d+='| **OWASP Coverage** | '+(G?'OWASP Top 10\u30ab\u30d0\u30fc\u7387':'OWASP Top 10 coverage')+' | '+(sc121==='large'?'10/10':sc121==='medium'?'8/10':'5/10')+' |\n';
    d+='| **Dep Freshness** | '+(G?'\u4f9d\u5b58\u95a2\u4fc2\u306e\u65b0\u9bae\u5ea6 (\u6700\u65b0\u30d0\u30fc\u30b8\u30e7\u30f3\u7387)':'Dependency freshness (latest version rate)')+' | '+(G?'Major\u4f9d\u5b58\u95a2\u4fc2\u306e80%\u4ee5\u4e0a':'\u226580% of majors')+' |\n\n';
    d+='### '+(G?'\u30ec\u30dd\u30fc\u30c8\u983b\u5ea6 (scale\u5225)':'Reporting Frequency (by scale)')+'\n\n';
    d+='- **solo**: '+(G?'\u6708\u6b21\u30ec\u30d3\u30e5\u30fc\uff08\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30b9\u30ad\u30e3\u30f3\u81ea\u52d5\u5b9f\u884c + \u7d50\u679c\u78ba\u8a8d\uff09':'Monthly review (automated scan + result check)')+'\n';
    d+='- **medium**: '+(G?'\u9694\u9031\u30ec\u30d3\u30e5\u30fc\uff08KPI\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9 + PR gate\u7d50\u679c\u96c6\u8a08\uff09':'Biweekly review (KPI dashboard + PR gate results)')+'\n';
    d+='- **large**: '+(G?'\u9031\u6b21\u30ec\u30d3\u30e5\u30fc\uff08SIEM\u7d71\u5408 + \u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u59d4\u54e1\u4f1a\u5831\u544a\uff09':'Weekly review (SIEM integration + security committee report)')+'\n\n';
    d+='### '+(G?'\u6210\u719f\u5ea6 3\u30ec\u30d9\u30eb':'3 Maturity Levels')+'\n\n';
    d+='| '+(G?'\u30ec\u30d9\u30eb':'Level')+' | '+(G?'\u7279\u5fb4':'Characteristics')+' | '+(G?'\u672c\u30d7\u30ed\u30b8\u30a7\u30af\u30c8':'This Project')+' |\n|------|------|------------|\n';
    d+='| Reactive | '+(G?'\u30a4\u30f3\u30b7\u30c7\u30f3\u30c8\u767a\u751f\u5f8c\u306b\u5bfe\u5fdc':'React after incident')+' | \u2014 |\n';
    d+='| Proactive | '+(G?'\u5b9a\u671f\u30b9\u30ad\u30e3\u30f3\u30fb\u30b2\u30fc\u30c8\u7ba1\u7406':'Regular scanning + gate management')+' | '+(sc121!=='solo'?'\u2705 '+(G?'\u76ee\u6a19':'Target'):'\u2014')+' |\n';
    d+='| Predictive | '+(G?'\u8105\u5a01\u30a4\u30f3\u30c6\u30ea\u30b8\u30a7\u30f3\u30b9\u30fbAI\u7570\u5e38\u691c\u77e5':'Threat intelligence + AI anomaly detection')+' | '+(sc121==='large'?'\u2705 '+(G?'\u76ee\u6a19':'Target'):'\u2014')+' |\n\n';
    if(_hiSec){d+='> \ud83d\udd12 **'+(G?'\u9ad8\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30c9\u30e1\u30a4\u30f3 ('+dom121+')':'High Security Domain ('+dom121+')')+' \u2014 '+(G?'\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30e1\u30c8\u30ea\u30af\u30b9\u3092\u5b9a\u671f\u7684\u306b\u30b9\u30c6\u30fc\u30af\u30db\u30eb\u30c0\u30fc\u306b\u5831\u544a\u3057\u3001\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u8981\u4ef6\u3078\u306e\u9069\u5408\u3092\u7d99\u7d9a\u7684\u306b\u8a3c\u660e\u3057\u3066\u304f\u3060\u3055\u3044\u3002':'Regularly report security metrics to stakeholders and continuously demonstrate compliance.')+'**\n\n';}
    d+='### '+(G?'\u53c2\u7167\u30c9\u30ad\u30e5\u30e1\u30f3\u30c8':'Reference Documents')+'\n\n';
    d+='- ['+(G?'OWASP\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30a4\u30f3\u30c6\u30ea\u30b8\u30a7\u30f3\u30b9':'OWASP Security Intelligence')+'](./43_security_intelligence.md)\n';
    d+='- ['+(G?'\u8105\u5a01\u30e2\u30c7\u30eb':'Threat Model')+'](./44_threat_model.md)\n';
    d+='- ['+(G?'\u30b3\u30f3\u30d7\u30e9\u30a4\u30a2\u30f3\u30b9\u30de\u30c8\u30ea\u30af\u30b9':'Compliance Matrix')+'](./45_compliance_matrix.md)\n';
    d+='- ['+(G?'\u30bb\u30ad\u30e5\u30ea\u30c6\u30a3\u30c6\u30b9\u30c8':'Security Testing')+'](./47_security_testing.md)\n';
    d+='- ['+(G?'\u8a8d\u8a3c\u30a2\u30fc\u30ad\u30c6\u30af\u30c1\u30e3':'Auth Architecture')+'](./119_auth_architecture_guide.md)\n';
    d+='- ['+(G?'\u30b7\u30b9\u30c6\u30e0\u30c7\u30b6\u30a4\u30f3':'System Design')+'](./120_system_design_guide.md)\n';
    S.files['docs/121_security_design_guide.md']=d;
  })();

  // ═══ docs/122_concurrency_consistency_guide.md ═══
  (function(){
    function _inc(v,k){return v&&v.indexOf(k)!==-1;}
    var be122=be; var sc122=a.scale||'medium'; var dom122=detectDomain(a.purpose||'');
    var _isBaas=/Firebase|Supabase|Convex/i.test(be122);
    var _isStatic=/なし（静的|None|static/i.test(be122);
    var _isBooking=/booking|ec|fintech|marketplace|event/.test(dom122||'');
    var _isNode=/Express|NestJS|Hono|Fastify|Next/i.test(be122);
    var d='# '+pn+' — '+(G?'並行性・分散整合性ガイド':'Concurrency & Distributed Consistency Guide')+'\n> '+date+'\n\n';
    d+='> '+(G?'ウィザード入力から自動生成。詳細: [docs/120_system_design_guide.md](./120_system_design_guide.md)':'Auto-generated from wizard inputs. Details: [docs/120_system_design_guide.md](./120_system_design_guide.md)')+'\n\n';
    // §1 Concurrency Control
    if(!_isBaas&&!_isStatic){
      d+='## '+(G?'§1 並行処理制御パターン':'§1 Concurrency Control Patterns')+'\n\n';
      d+=(G?'複数ユーザーが同一リソースに同時アクセスした際のデータ整合性を保証する設計が必要。':'Design to guarantee data integrity when multiple users access the same resource simultaneously.')+'\n\n';
      d+='### '+(G?'Read-Check-Write Gap 問題':'Read-Check-Write Gap Problem')+'\n\n';
      d+='```\n'+(G?'ユーザーA: 在庫読取(残1) ─────────────────── 予約書込(残0)\nユーザーB:          在庫読取(残1) ── 予約書込(残0) ← 二重予約！':'User A: Read stock(1) ──────────────────── Write booking(0)\nUser B:          Read stock(1) ── Write booking(0) ← Double booking!')+'\n```\n\n';
      d+='### '+(G?'楽観的ロック (Optimistic Lock)':'Optimistic Locking')+'\n\n';
      d+=(G?'読取→変更→書込のフローで、書込時に競合を検出する。Read-Heavy なシステムに最適。':'Detect conflicts at write time in read-change-write flow. Best for read-heavy systems.')+'\n\n';
      d+='```typescript\n// Prisma: version フィールドで楽観的ロック\nawait prisma.item.update({\n  where: { id: itemId, version: currentVersion }, // version不一致 → エラー\n  data: { stock: newStock, version: { increment: 1 } },\n});\n```\n\n';
      d+='### '+(G?'悲観的ロック (Pessimistic Lock)':'Pessimistic Locking')+'\n\n';
      d+=(G?'読取時にロックを取得し、他のトランザクションをブロックする。Write-Heavy・金融系に最適。':'Acquire lock at read time to block other transactions. Best for write-heavy and financial systems.')+'\n\n';
      d+='```sql\nBEGIN;\nSELECT * FROM inventory WHERE id = $1 FOR UPDATE; -- 他TXをブロック\nUPDATE inventory SET stock = stock - 1 WHERE id = $1;\nINSERT INTO bookings (item_id, user_id) VALUES ($1, $2);\nCOMMIT;\n```\n\n';
      d+='### '+(G?'選定チャート':'Selection Chart')+'\n\n';
      d+='| '+(G?'シナリオ':'Scenario')+' | '+(G?'推奨アプローチ':'Recommended Approach')+' |\n|---------|--------------------|\n';
      d+='| '+(G?'読取多・書込少 (SNS、ブログ)':'Read-heavy, write-light (SNS, blog)')+' | '+(G?'楽観的ロック + version カラム':'Optimistic lock + version column')+' |\n';
      d+='| '+(G?'書込競合高 (在庫、座席、決済)':'Write-contention high (stock, seats, payment)')+' | '+(G?'悲観的ロック (SELECT FOR UPDATE)':'Pessimistic lock (SELECT FOR UPDATE)')+' |\n';
      d+='| BaaS | '+(G?'サーバー管理 (Firestore トランザクション)':'Server-managed (Firestore transactions)')+' |\n\n';
    }
    // §2 Idempotency
    d+='## '+(G?'§2 べき等性設計 (Idempotency)':'§2 Idempotency Design')+'\n\n';
    d+=(G?'同じリクエストを複数回送信しても結果が変わらない設計。ネットワーク障害時のリトライ安全性を保証。':'Design ensures identical results for repeated requests. Guarantees safe retry on network failure.')+'\n\n';
    d+='### '+(G?'3層防御':'3-Layer Defense')+'\n\n';
    d+='```\n'+(G?'クライアント UUID (X-Idempotency-Key ヘッダー)\n  → サーバーハッシュ (Hash(UserID+ResourceID+Action))\n    → DB UNIQUE制約 (idempotency_key カラム)':'Client UUID (X-Idempotency-Key header)\n  → Server hash (Hash(UserID+ResourceID+Action))\n    → DB UNIQUE constraint (idempotency_key column)')+'\n```\n\n';
    d+='```typescript\n// Express middleware\napp.use(async (req, res, next) => {\n  const key = req.headers[\'x-idempotency-key\'];\n  if (key) {\n    const cached = await redis.get(`idempotent:${key}`);\n    if (cached) return res.json(JSON.parse(cached));\n    res.on(\'finish\', () =>\n      redis.setex(`idempotent:${key}`, 86400, JSON.stringify(res.body)));\n  }\n  next();\n});\n```\n\n';
    if(_isBooking){
      d+='### '+(G?'決済フロー冪等性':'Payment Flow Idempotency')+'\n\n';
      d+='```\n'+(G?'1. クライアント→サーバー: POST /orders {idempotency_key: uuid}\n2. サーバー: idempotency_key 存在確認 (DB UNIQUE)\n3. 未処理: 決済処理 → 結果をDB保存\n4. 処理済み: 保存済み結果を返却 (決済は実行しない)\n5. Stripe/決済API: 同一idempotency_keyで重複課金防止':'1. Client→Server: POST /orders {idempotency_key: uuid}\n2. Server: Check idempotency_key existence (DB UNIQUE)\n3. New: Process payment → save result to DB\n4. Duplicate: Return saved result (no charge)\n5. Stripe/payment API: Prevent double-charge with same key')+'\n```\n\n';
    }
    // §3 Distributed Transactions
    if(sc122==='large'&&!_isBaas){
      d+='## '+(G?'§3 分散トランザクション戦略':'§3 Distributed Transaction Strategy')+'\n\n';
      d+=(G?'マイクロサービス環境では単一DBトランザクションが使えない。以下3パターンから選定する。':'In microservices, a single DB transaction cannot be used. Select from these 3 patterns.')+'\n\n';
      d+='| '+(G?'パターン':'Pattern')+' | '+(G?'一貫性':'Consistency')+' | '+(G?'複雑度':'Complexity')+' | '+(G?'ユースケース':'Use Cases')+' |\n|---------|------------|---------|----------|\n';
      d+='| **2PC** | '+(G?'強一貫性':'Strong')+' | '+(G?'高（コーディネーター依存）':'High (coordinator dependency)')+' | '+(G?'金融・決済（同期必須）':'Finance, payment (sync required)')+' |\n';
      d+='| **Saga** | '+(G?'結果整合性':'Eventual')+' | '+(G?'中（補償TXが必要）':'Medium (compensating TX)')+' | '+(G?'EC・予約・注文':'EC, booking, orders')+' |\n';
      d+='| **TCC** | '+(G?'強一貫性':'Strong')+' | '+(G?'中（3フェーズ実装）':'Medium (3-phase impl)')+' | '+(G?'在庫・クーポン管理':'Inventory, coupon mgmt')+' |\n\n';
      d+='> **Pragmatic Microservices**: '+(G?'マイクロサービス初期は共有DBを維持することで分散トランザクションを回避。サービス分離はトラフィック増加後に段階的に実施。':'In early microservices, maintain a shared DB to avoid distributed transactions. Separate services gradually as traffic increases.')+'\n\n';
      d+='### Saga '+(G?'補償トランザクション例 (注文フロー)':'Compensating Transaction Example (Order Flow)')+'\n\n';
      d+='```\n'+(G?'正常系: Reserve在庫 → Pay決済 → Notify通知\n失敗系 (決済失敗): Pay失敗 → Cancel在庫リリース → 失敗通知':'Happy path: Reserve stock → Pay charge → Notify\nFailure (pay failed): Pay fail → Compensate stock release → Notify failure')+'\n```\n\n';
    }
    // §4 Fault Tolerance
    if(!_isBaas&&!_isStatic){
      d+='## '+(G?'§4 耐障害性パターン':'§4 Fault Tolerance Patterns')+'\n\n';
      d+='### '+(G?'サーキットブレーカー 状態遷移':'Circuit Breaker State Transitions')+'\n\n';
      d+='| '+(G?'状態':'State')+' | '+(G?'動作':'Behavior')+' | '+(G?'遷移条件':'Transition')+' |\n|------|---------|----------|\n';
      d+='| **Closed** | '+(G?'通常通りリクエスト通過':'Normal request passing')+' | '+(G?'失敗率>閾値 → Open':'Failure rate > threshold → Open')+' |\n';
      d+='| **Open** | '+(G?'即座にエラー返却（外部呼び出しなし）':'Immediately return error (no external call)')+' | '+(G?'タイムアウト経過 → Half-Open':'Timeout expires → Half-Open')+' |\n';
      d+='| **Half-Open** | '+(G?'少量リクエストでテスト':'Test with limited requests')+' | '+(G?'成功 → Closed / 失敗 → Open':'Success → Closed / Fail → Open')+' |\n\n';
      d+='### '+(G?'Exponential Backoff + Jitter':'Exponential Backoff + Jitter')+'\n\n';
      d+='```\n'+(G?'待機時間 = min(cap, base × 2^attempt) + random(0, base)\n例: base=100ms, cap=10s, attempt=3\n  → min(10000, 100 × 8) + rand(0,100) = 800〜900ms':'Wait = min(cap, base × 2^attempt) + random(0, base)\nExample: base=100ms, cap=10s, attempt=3\n  → min(10000, 100 × 8) + rand(0,100) = 800~900ms')+'\n```\n\n';
      d+='### Bulkhead '+(G?'パターン (接続プール分離)':'Pattern (Connection Pool Isolation)')+'\n\n';
      d+=(G?'外部サービスごとに接続プールを分離し、1サービスの障害が全体に波及しないよう設計する。':'Isolate connection pools per external service so one service failure does not cascade system-wide.')+'\n\n';
      if(_isNode){
        d+='```typescript\n// Node.js: opossum library\nimport CircuitBreaker from \'opossum\';\nconst breaker = new CircuitBreaker(asyncFn, {\n  timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 30000\n});\nbreaker.fallback(() => \'service unavailable\');\n```\n\n';
      }
    }
    // §5 Load Estimation
    d+='## '+(G?'§5 負荷見積もり基礎':'§5 Load Estimation Basics')+'\n\n';
    d+='| '+(G?'指標':'Metric')+' | '+(G?'定義':'Definition')+' | '+(G?'計算例':'Example')+' |\n|------|------|--------|\n';
    d+='| **QPS** | Queries Per Second | '+(G?'DAU 10万 × 10クエリ/日 ÷ 86400s = 11.6 QPS':'DAU 100K × 10 queries/day ÷ 86400s = 11.6 QPS')+' |\n';
    d+='| **TPS** | Transactions Per Second | '+(G?'年間取引100万 ÷ 365 ÷ 86400s = 0.032 TPS':'1M annual TX ÷ 365 ÷ 86400s = 0.032 TPS')+' |\n';
    d+='| Peak | '+(G?'ピーク倍率':'Peak multiplier')+' | '+(G?'通常の5〜10倍（キャンペーン・季節変動）':'5-10x normal (campaign/seasonal)')+' |\n\n';
    d+='### '+(G?'トラフィックファネル':'Traffic Funnel')+'\n\n';
    d+='```\n100% '+(G?'訪問 → 10% 検索/閲覧 → 1% コンバージョン':'Visits → 10% Search/Browse → 1% Conversion')+'\n```\n\n';
    d+='### '+(G?'Read/Write比率 → アーキテクチャ指針':'Read/Write Ratio → Architecture Guidance')+'\n\n';
    d+='| '+(G?'比率':'Ratio')+' | '+(G?'パターン':'Pattern')+' | '+(G?'推奨アーキテクチャ':'Recommended Architecture')+' |\n|------|---------|--------------------|\n';
    d+='| 60:1 R:W | '+(G?'読取過多':'Read-dominant')+' | CQRS + '+(G?'キャッシュ (Redis/CDN)':'Cache (Redis/CDN)')+' |\n';
    d+='| 10:1 R:W | '+(G?'標準的':'Standard')+' | '+(G?'Read Replica + 接続プール':'Read Replica + connection pool')+' |\n';
    d+='| 1:1 R:W | '+(G?'書込多':'Write-heavy')+' | '+(G?'メッセージキュー + 非同期処理':'Message queue + async processing')+' |\n\n';
    // §6 Cross Reference
    d+='## '+(G?'§6 クロスリファレンス':'§6 Cross Reference')+'\n\n';
    d+='- ['+(G?'システムデザイン意思決定':'System Design Decisions')+'](./120_system_design_guide.md)\n';
    d+='- ['+(G?'セキュリティ設計':'Security Design')+'](./121_security_design_guide.md)\n';
    d+='- ['+(G?'API設計原則':'API Design Principles')+'](./83_api_design_principles.md)\n';
    d+='- ['+(G?'パフォーマンス戦略':'Performance Strategy')+'](./99_performance_strategy.md)\n';
    S.files['docs/122_concurrency_consistency_guide.md']=d;
  })();

  // ═══ docs/123_frontend_architecture_guide.md ═══
  (function(){
    var fe123=fe;
    var hasSPA=/React|Vue|Angular|Svelte|Next|Nuxt|SvelteKit/i.test(fe123);
    if(!hasSPA) return;
    var isReact=/React|Next/i.test(fe123);
    var isVue=/Vue|Nuxt/i.test(fe123);
    var isNext=/Next/i.test(fe123);
    var isSvelte=/Svelte|SvelteKit/i.test(fe123);
    var hasPay=a.payment&&!/なし|none/i.test(a.payment);
    var d='# '+pn+' — '+(G?'フロントエンドアーキテクチャガイド':'Frontend Architecture Guide')+'\n> '+date+'\n\n';
    d+='> '+(G?'ウィザード入力から自動生成。フロントエンド: '+fe123:'Auto-generated from wizard inputs. Frontend: '+fe123)+'\n\n';
    // §1 Rendering Strategy
    d+='## '+(G?'§1 レンダリング戦略選定':'§1 Rendering Strategy Selection')+'\n\n';
    d+='| '+(G?'戦略':'Strategy')+' | '+(G?'初回表示':'Initial Load')+' | SEO | '+(G?'リアルタイム':'Realtime')+' | '+(G?'サーバーコスト':'Server Cost')+' | '+(G?'推奨ユースケース':'Use Cases')+' |\n';
    d+='|---------|-----------|-----|------------|------------|---------------|\n';
    d+='| **SSR** | ✅'+(G?'高速':'Fast')+' | ✅ | ✅ | '+(G?'中':'Medium')+' | '+(G?'EC・SaaS・ニュース':'EC, SaaS, News')+' |\n';
    d+='| **SSG** | ✅'+(G?'最高速':'Fastest')+' | ✅ | ❌ | '+(G?'低（CDN）':'Low (CDN)')+' | '+(G?'ブログ・ドキュメント':'Blog, Docs')+' |\n';
    d+='| **ISR** | ✅'+(G?'高速':'Fast')+' | ✅ | ⚠️ | '+(G?'低':'Low')+' | '+(G?'EC商品ページ・CMS':'EC products, CMS')+' |\n';
    d+='| **CSR** | ⚠️'+(G?'遅い':'Slow')+' | ❌ | ✅ | '+(G?'低':'Low')+' | '+(G?'ダッシュボード・管理画面':'Dashboard, Admin')+' |\n\n';
    d+='### '+(G?'決定木':'Decision Tree')+'\n\n';
    d+='```\n'+(G?'ECサイト / マーケットプレイス → SSR + ISR（商品詳細）\nブログ / ドキュメント        → SSG\nリアルタイムダッシュボード   → CSR（認証後のみ）\nSaaS / 業務アプリ            → SSR（初回）+ CSR（操作）':'EC / Marketplace             → SSR + ISR (product pages)\nBlog / Documentation         → SSG\nRealtime Dashboard            → CSR (authenticated only)\nSaaS / Business App           → SSR (initial) + CSR (interactions)')+'\n```\n\n';
    if(isNext){
      d+='### '+(G?'Server Components vs Client Components':'Server Components vs Client Components')+'\n\n';
      d+='| '+(G?'種別':'Type')+' | '+(G?'実行場所':'Runtime')+' | '+(G?'データフェッチ':'Data Fetch')+' | '+(G?'インタラクション':'Interactivity')+' | '+(G?'推奨用途':'Best For')+' |\n';
      d+='|------|---------|-----------|-------------|----------|\n';
      d+='| Server Component | '+(G?'サーバー':'Server')+' | '+(G?'直接DB・API':'Direct DB/API')+' | ❌ | '+(G?'ページ・レイアウト・静的UI':'Pages, layouts, static UI')+' |\n';
      d+='| Client Component | '+(G?'ブラウザ':'Browser')+' | SWR/fetch | ✅ | '+(G?'フォーム・モーダル・インタラクション':'Forms, modals, interactions')+' |\n\n';
      d+='> `\'use client\'` '+(G?'ディレクティブはインタラクティブな末端コンポーネントにのみ追加。ページルートはデフォルトでServer Component。':'directive only for interactive leaf components. Page roots are Server Components by default.')+'\n\n';
    }
    // §2 State Management
    d+='## '+(G?'§2 状態管理選定':'§2 State Management')+'\n\n';
    if(isReact){
      d+='### '+(G?'Server State vs Client State 分離原則':'Server State vs Client State Separation')+'\n\n';
      d+='```\nServer State: '+(G?'API/DBデータ → TanStack Query (useQuery/useMutation)':'API/DB data → TanStack Query (useQuery/useMutation)')+'\nClient State: '+(G?'UIの状態・選択・フォーム → Zustand':'UI state, selections, forms → Zustand')+'\n```\n\n';
      d+='| '+(G?'ライブラリ':'Library')+' | '+(G?'種別':'Type')+' | '+(G?'学習コスト':'Learning Curve')+' | '+(G?'バンドルサイズ':'Bundle')+' | '+(G?'推奨ユースケース':'Best For')+' |\n';
      d+='|---------|------|----------|--------|----------|\n';
      d+='| **TanStack Query** | Server State | '+(G?'低':'Low')+' | 13KB | '+(G?'API・キャッシュ・同期':'API, caching, sync')+' |\n';
      d+='| **Zustand** | Client State | '+(G?'低':'Low')+' | 3KB | '+(G?'UIグローバル状態':'Global UI state')+' |\n';
      d+='| **Jotai** | Client State | '+(G?'低':'Low')+' | 3KB | '+(G?'アトム粒度の状態':'Atomic state')+' |\n';
      d+='| **Redux Toolkit** | '+(G?'汎用':'General')+' | '+(G?'中':'Medium')+' | 39KB | '+(G?'大規模・既存Redux移行':'Large apps, Redux migration')+' |\n\n';
      d+='> '+(G?'推奨: **TanStack Query** (Server State) + **Zustand** (Client State) の組み合わせ':'Recommended: **TanStack Query** (Server State) + **Zustand** (Client State) combination')+'\n\n';
    } else if(isVue){
      d+='> '+(G?'推奨: **Pinia** (Vue公式状態管理) + **VueQuery** (TanStack Query Vueアダプター) の組み合わせ':'Recommended: **Pinia** (Vue official state) + **VueQuery** (TanStack Query Vue adapter) combination')+'\n\n';
    } else if(isSvelte){
      d+='> '+(G?'Svelte 組み込みストア (`writable`, `derived`, `readable`) を活用。大規模アプリはSvelte Storesで十分対応可能。':'Leverage Svelte built-in stores (`writable`, `derived`, `readable`). Svelte Stores handle most large apps without extra libraries.')+'\n\n';
    }
    // §3 Code Splitting
    d+='## '+(G?'§3 コード分割・バンドル最適化':'§3 Code Splitting & Bundle Optimization')+'\n\n';
    d+='### '+(G?'バンドルサイズ目標':'Bundle Size Targets')+'\n\n';
    d+='| '+(G?'指標':'Metric')+' | '+(G?'目標値':'Target')+' | '+(G?'測定方法':'Measurement')+' |\n|------|------|----------|\n';
    d+='| Initial JS | < 200KB (gzip) | Chrome DevTools / Lighthouse |\n';
    d+='| LCP | < 2.5s | Lighthouse / Core Web Vitals |\n';
    d+='| TBT | < 200ms | Lighthouse |\n\n';
    if(isNext){
      d+='```tsx\nimport dynamic from \'next/dynamic\';\nconst HeavyChart = dynamic(() => import(\'./HeavyChart\'), {\n  loading: () => <Skeleton />, ssr: false\n});\n```\n\n';
    } else if(isReact){
      d+='```tsx\n// Route-based Code Splitting\nimport { lazy, Suspense } from \'react\';\nconst Dashboard = lazy(() => import(\'./pages/Dashboard\'));\n\n<Suspense fallback={<Spinner />}>\n  <Dashboard />\n</Suspense>\n```\n\n';
    }
    d+='### '+(G?'最適化ツール':'Optimization Tools')+'\n\n';
    d+='- `@next/bundle-analyzer` / `source-map-explorer`: '+(G?'バンドル構成の可視化':'Bundle composition visualization')+'\n';
    d+='- Tree shaking: '+(G?'named imports使用 (`import { debounce } from \'lodash-es\'`)、`sideEffects: false`を`package.json`に設定':'Use named imports, set `sideEffects: false` in `package.json`')+'\n\n';
    // §4 Component Design
    d+='## '+(G?'§4 コンポーネント設計原則':'§4 Component Design Principles')+'\n\n';
    d+='### '+(G?'Feature-based ディレクトリ構造 (推奨)':'Feature-based Directory Structure (Recommended)')+'\n\n';
    d+='```\nsrc/\n  features/\n    auth/\n      components/   '+(G?'# UI コンポーネント':'# UI components')+'\n      hooks/        '+(G?'# カスタムフック (React)':'# Custom hooks (React)')+'\n      api/          '+(G?'# API呼び出し':'# API calls')+'\n      types.ts\n    dashboard/\n    products/\n  shared/\n    ui/             '+(G?'# 汎用UIコンポーネント':'# Shared UI components')+'\n    utils/\n```\n\n';
    if(isReact){
      d+='### '+(G?'Custom Hooks でロジック分離':'Custom Hooks for Logic Separation')+'\n\n';
      d+='```tsx\n// NG: コンポーネントに直接ロジック\nfunction ProductPage() { /* 20行のfetch/state管理ロジック */ }\n\n// OK: hooks でロジック分離\nfunction useProduct(id: string) {\n  const { data, isLoading } = useQuery([\'product\', id], () => fetchProduct(id));\n  return { product: data, isLoading };\n}\nfunction ProductPage({ id }: { id: string }) {\n  const { product, isLoading } = useProduct(id);\n  return isLoading ? <Skeleton /> : <ProductView product={product} />;\n}\n```\n\n';
    }
    // §5 Frontend Security
    d+='## '+(G?'§5 フロントエンドセキュリティ':'§5 Frontend Security')+'\n\n';
    d+='### CSP (Content Security Policy)\n\n';
    d+='```http\nContent-Security-Policy:\n  default-src \'self\';\n  script-src \'self\' \'nonce-{RANDOM}\';\n  style-src \'self\' \'unsafe-inline\';\n  img-src \'self\' data: https:;\n  connect-src \'self\' https://api.example.com\n```\n\n';
    d+='### '+(G?'XSS防止 (DOMPurify)':'XSS Prevention (DOMPurify)')+'\n\n';
    d+='```typescript\n// NG: innerHTML でユーザー入力レンダリング\nelement.innerHTML = userInput;\n\n// OK: DOMPurify でサニタイズ\nimport DOMPurify from \'dompurify\';\nelement.innerHTML = DOMPurify.sanitize(userInput);\n```\n\n';
    if(hasPay){
      d+='### '+(G?'決済フロントエンド追加対策 (PCI DSS)':'Payment Frontend Measures (PCI DSS)')+'\n\n';
      d+='| '+(G?'対策':'Measure')+' | '+(G?'実装':'Implementation')+' | '+(G?'目的':'Purpose')+' |\n|------|---------|------|\n';
      d+='| SRI | `<script integrity="sha256-...">` | '+(G?'CDNスクリプト改ざん防止':'Prevent CDN script tampering')+' |\n';
      d+='| '+(G?'カード情報非保持':'No card data storage')+' | Stripe Elements / Hosted Fields | '+(G?'PCI DSS スコープ外':'PCI DSS scope out')+' |\n';
      d+='| CSRF Token | `X-CSRF-Token` '+(G?'ヘッダー':'header')+' | '+(G?'フォーム偽造防止':'Form forgery prevention')+' |\n';
      d+='| HTTPS Only | HSTS '+(G?'ヘッダー':'header')+' | '+(G?'中間者攻撃防止':'MITM prevention')+' |\n\n';
    }
    d+='> '+(G?'参照: [セキュリティ設計ガイド](./121_security_design_guide.md) | [OWASP Top 10](./43_security_intelligence.md)':'Reference: [Security Design Guide](./121_security_design_guide.md) | [OWASP Top 10](./43_security_intelligence.md)')+'\n\n';
    S.files['docs/123_frontend_architecture_guide.md']=d;
  })();

  // ═══ docs/124_test_quality_guide.md ═══
  (()=>{
    const _fe=fe;const _be=be;
    const isReact=_fe.includes('React')||_fe.includes('Next');
    const isVue=_fe.includes('Vue')||_fe.includes('Nuxt');
    const isBaaS=_be.includes('Firebase')||_be.includes('Supabase')||_be.includes('Amplify');
    const _sc=a.scale||'medium';
    const _unitRatio=_sc==='solo'?70:_sc==='small'?65:60;
    const _intRatio=_sc==='solo'?20:_sc==='small'?25:30;
    const _e2eRatio=100-_unitRatio-_intRatio;
    let d='# '+(G?'テスト品質ガイド':'Test Quality Guide')+' — '+pn+'\n> '+date+'\n\n';
    d+='## '+(G?'1. テスト戦略マトリクス':'1. Test Strategy Matrix')+'\n\n';
    d+='| '+(G?'種別':'Type')+' | '+(G?'カバレッジ目標':'Coverage Target')+' | '+(G?'ツール':'Tools')+' | '+(G?'実行頻度':'Frequency')+'|\n';
    d+='|------|------|------|------|\n';
    d+='| Unit | ≥80% stmt / ≥75% branch | Vitest / Jest | '+(G?'コミット毎':'Every commit')+'|\n';
    d+='| Integration | '+(G?'主要フロー':'Key flows')+' | Supertest / MSW | '+(G?'PR毎':'Per PR')+'|\n';
    d+='| E2E | '+(G?'ハッピーパス全機能':'All happy paths')+' | Playwright | '+(G?'日次/リリース前':'Daily/pre-release')+'|\n\n';
    d+='## '+(G?'2. テストピラミッド (スケール別比率)':'2. Test Pyramid (Scale Ratios)')+'\n\n';
    d+='| '+(G?'テスト種別':'Test Type')+' | '+(G?'このプロジェクト':'This Project')+' | '+(G?'推奨':'Recommended')+'|\n';
    d+='|------|------|------|\n';
    d+='| Unit | '+_unitRatio+'% | 60-70% |\n';
    d+='| Integration | '+_intRatio+'% | 20-30% |\n';
    d+='| E2E | '+_e2eRatio+'% | 10-20% |\n\n';
    d+='## '+(G?'3. テストデータ戦略':'3. Test Data Strategy')+'\n\n';
    d+='- '+(G?'シードデータ: db/seed.json + db/seed.sql を参照 (DevForge生成済み)':'Seed data: See db/seed.json + db/seed.sql (DevForge generated)')+'\n';
    d+='- '+(G?'フィクスチャー: テストごとに独立した状態を維持':'Fixtures: Maintain independent state per test')+'\n';
    d+='- '+(G?'モック戦略: 外部APIはMSWでインターセプト、DBはin-memory/test DBを使用':'Mock strategy: Intercept external APIs with MSW, use in-memory/test DB')+'\n\n';
    d+='## '+(G?('4. 品質ゲート (CI/CDステージ)'):'4. Quality Gates (CI/CD Stages)')+'\n\n';
    d+='```\n'+(G?'Lint → Unit → Integration → E2E → Deploy':'Lint → Unit → Integration → E2E → Deploy')+'\n';
    d+=(G?'  ↓      ↓        ↓           ↓       ↓':'  ↓      ↓        ↓           ↓       ↓')+'\n';
    d+=(G?'0 errors  80%+   key flows  happy paths  ✅':'0 errors  80%+   key flows  happy paths  ✅')+'\n```\n\n';
    d+='| '+(G?'ステージ':'Stage')+' | '+(G?'ツール':'Tool')+' | '+(G?'合格基準':'Pass Criteria')+' | '+(G?'ブロッカー':'Blocker')+'|\n';
    d+='|------|------|------|------|\n';
    d+='| Lint | ESLint + Prettier | '+(G?'0 errors':'0 errors')+' | ✅ |\n';
    d+='| Unit | Vitest | stmt 80%+ / branch 75%+ | ✅ |\n';
    d+='| Integration | Supertest | '+(G?'主要フロー通過':'Key flows pass')+' | ✅ |\n';
    d+='| E2E | Playwright | '+(G?'全ハッピーパス通過':'All happy paths pass')+' | ✅ |\n';
    d+='| Security | SAST | '+(G?'高・中リスク 0件':'High/Medium 0')+' | ✅ |\n\n';
    d+='## '+(G?'5. テスト自動化ロードマップ':'5. Test Automation Roadmap')+'\n\n';
    d+='| '+(G?'フェーズ':'Phase')+' | '+(G?'目標':'Goal')+' | '+(G?'ツール':'Tools')+'|\n';
    d+='|------|------|------|\n';
    d+='| Phase 1 | '+(G?'ユニットテスト基盤 (カバレッジ 60%+)':'Unit test foundation (coverage 60%+)')+' | Vitest + Coverage |\n';
    d+='| Phase 2 | '+(G?'統合テスト・APIテスト (80%+)':'Integration + API tests (80%+)')+' | Supertest + MSW |\n';
    d+='| Phase 3 | '+(G?'E2E・ビジュアル・パフォーマンステスト':'E2E + Visual + Performance tests')+' | Playwright + k6 |\n\n';
    d+='## '+(G?('6. 品質メトリクス'):'6. Quality Metrics')+'\n\n';
    d+='| '+(G?'指標':'Metric')+' | '+(G?('目標'):'Target')+' | '+(G?'測定方法':'Measurement')+'|\n';
    d+='|------|------|------|\n';
    d+='| '+(G?'コードカバレッジ':'Code Coverage')+' | ≥80% stmt | Vitest --coverage |\n';
    d+='| '+(G?'ミューテーションスコア':'Mutation Score')+' | ≥60% | Stryker |\n';
    d+='| '+(G?'フレーキーテスト率':'Flaky Test Rate')+' | <2% | CI flake detector |\n';
    d+='| '+(G?('E2E成功率'):'E2E Pass Rate')+' | ≥99% | Playwright reports |\n\n';
    d+='## '+(G?'7. FE別テスト推奨':'7. FE-specific Test Recommendations')+'\n\n';
    if(isReact){
      d+='### React (Next.js)\n';
      d+='- Unit: **Vitest + React Testing Library** — `render()` + `screen.getByRole()`\n';
      d+='- Component: **Storybook + Chromatic** — '+(G?'ビジュアルリグレッション':'Visual regression')+'\n';
      d+='- E2E: **Playwright** — `test(\'login flow\', async ({ page }) => {...})`\n';
      d+='- API: **MSW** (Mock Service Worker) — `rest.get(\'/api/users\', ...)`\n\n';
    } else if(isVue){
      d+='### Vue (Nuxt)\n';
      d+='- Unit: **Vitest + Vue Test Utils (VTU)** — `mount()` + `wrapper.find()`\n';
      d+='- E2E: **Playwright** — '+(G?'ブラウザ横断テスト':'Cross-browser tests')+'\n';
      d+='- API Mock: **MSW** / **vi.mock()**\n\n';
    } else {
      d+='### '+(G?'フレームワーク共通':'Framework Agnostic')+'\n';
      d+='- Unit: **Vitest** / Jest — '+(G?'ビジネスロジック・ユーティリティ':'Business logic & utilities')+'\n';
      d+='- E2E: **Playwright** — '+(G?'ハッピーパス・フォームテスト':'Happy paths & form tests')+'\n\n';
    }
    d+='> '+(G?'参照':'See also')+': docs/91_testing_strategy.md | docs/92_coverage_design.md | docs/07_test_cases.md';
    S.files['docs/124_test_quality_guide.md']=d;
  })();

  // ═══ docs/125_healthcare_compliance_guide.md ═══ (health domain only)
  {const _dom125=detectDomain(a.purpose||'');
  if(_dom125==='health'){(()=>{
    let d='# '+(G?'ヘルスケアコンプライアンスガイド':'Healthcare Compliance Guide')+'\n\n';
    d+='> '+(G?'生成日':'Generated')+': '+new Date().toISOString().split('T')[0]+' | '+(G?'ドメイン':'Domain')+': health\n\n';
    d+='## '+(G?'1. 適用規制フレームワーク':'1. Applicable Regulatory Framework')+'\n\n';
    d+='| '+(G?'規制':'Regulation')+' | '+(G?'適用地域':'Region')+' | '+(G?'主要要件':'Key Requirements')+' | '+(G?'ペナルティ':'Penalty')+' |\n';
    d+='|------|--------|----------|----------|\n';
    d+='| HIPAA | USA | PHI保護・アクセス制御・監査ログ | $100〜$50,000/件 |\n';
    d+='| GDPR | EU/EEA | 個人データ同意・削除権・DPA | 年収4%/€2,000万 |\n';
    d+='| 医療法 | 日本 | 電子カルテ・診療記録5年保存 | 業務停止 |\n';
    d+='| HL7 FHIR | 国際 | 標準医療データ交換フォーマット | — |\n\n';
    d+='## '+(G?'2. PHI（保護医療情報）管理':'2. PHI (Protected Health Information) Management')+'\n\n';
    d+='### '+(G?'データ分類':'Data Classification')+'\n';
    d+='- **PHI (高)**: 氏名+診断名+処方薬 → AES-256暗号化必須\n';
    d+='- **PHI (中)**: 年齢+性別+地域 → 仮名化推奨\n';
    d+='- **非PHI**: 匿名統計データ → 標準保護\n\n';
    d+='### '+(G?'実装チェックリスト':'Implementation Checklist')+'\n';
    d+='- [ ] '+(G?'保存時暗号化 (AES-256 / TDE)':'Encryption at rest (AES-256 / TDE)')+'\n';
    d+='- [ ] '+(G?'転送時暗号化 (TLS 1.3)':'Encryption in transit (TLS 1.3)')+'\n';
    d+='- [ ] '+(G?'多要素認証 (MFA) 全スタッフ必須':'Multi-factor authentication (MFA) for all staff')+'\n';
    d+='- [ ] '+(G?'アクセスログ・監査証跡 (6年保存)':'Access logs & audit trail (6-year retention)')+'\n';
    d+='- [ ] '+(G?'最小権限原則 (RBAC)':'Principle of least privilege (RBAC)')+'\n';
    d+='- [ ] '+(G?'データ侵害時72時間以内通知':'Data breach notification within 72 hours')+'\n';
    d+='- [ ] '+(G?'定期リスクアセスメント (年1回以上)':'Regular risk assessment (at least once per year)')+'\n\n';
    d+='## '+(G?'3. 医療システムセキュリティ設計':'3. Healthcare System Security Design')+'\n\n';
    d+='```\n';
    d+=(G?'患者データフロー（最小化原則）':'Patient Data Flow (Minimization Principle)')+'\n';
    d+='UI Layer     → 表示前にPHIマスキング適用\n';
    d+='API Layer    → エンドポイント別アクセス制御 (RBAC)\n';
    d+='Service Layer→ PHI処理ログ自動記録\n';
    d+='DB Layer     → 列レベル暗号化 + RLS\n';
    d+='Backup Layer → 暗号化バックアップ + 保持期間ポリシー\n';
    d+='```\n\n';
    d+='## '+(G?'4. インシデント対応計画':'4. Incident Response Plan')+'\n\n';
    d+='| '+(G?'フェーズ':'Phase')+' | '+(G?'アクション':'Action')+' | '+(G?'期限':'Deadline')+' |\n';
    d+='|--------|----------|------|\n';
    d+='| 検知 | 異常アクセスアラート → SOC通知 | 即時 |\n';
    d+='| 封じ込め | 影響システム隔離・証拠保全 | 1時間以内 |\n';
    d+='| 通知 | 監督機関・患者通知 | 72時間以内 |\n';
    d+='| 復旧 | バックアップ復元・脆弱性修正 | 24〜48時間 |\n';
    d+='| 再発防止 | RCA・セキュリティ強化 | 30日以内 |\n\n';
    d+='> '+(G?'参照':'See also')+': docs/121_security_design_guide.md | docs/44_threat_model.md | docs/45_compliance_matrix.md';
    S.files['docs/125_healthcare_compliance_guide.md']=d;
  })();}}

  // ═══ docs/126_fintech_fraud_prevention.md ═══ (fintech + payment only)
  {const _dom126=detectDomain(a.purpose||'');
  if(_dom126==='fintech'&&hasPay){(()=>{
    let d='# '+(G?'フィンテック不正検知・防止ガイド':'Fintech Fraud Detection & Prevention Guide')+'\n\n';
    d+='> '+(G?'生成日':'Generated')+': '+new Date().toISOString().split('T')[0]+' | '+(G?'ドメイン':'Domain')+': fintech | Payment: '+a.payment+'\n\n';
    d+='## '+(G?'1. 不正パターン分類':'1. Fraud Pattern Classification')+'\n\n';
    d+='| '+(G?'不正種別':'Fraud Type')+' | '+(G?'説明':'Description')+' | '+(G?'検知手法':'Detection Method')+' |\n';
    d+='|----------|------|----------|\n';
    d+='| カード不正利用 | 盗難カード・番号詐取 | Velocity Check + IP地理フィルタ |\n';
    d+='| アカウント乗っ取り (ATO) | 認証情報窃取・不正ログイン | デバイスフィンガープリント + MFA |\n';
    d+='| 資金洗浄 (AML) | 不正資金隠匿・多段転送 | トランザクション監視 + CTF報告 |\n';
    d+='| フィッシング | 偽サイト・メール詐欺 | CSP + DMARC + 教育 |\n';
    d+='| インサイダー脅威 | 内部者による不正操作 | AuditLog + 異常行動検知 |\n\n';
    d+='## '+(G?'2. リアルタイム不正検知アーキテクチャ':'2. Real-Time Fraud Detection Architecture')+'\n\n';
    d+='```\n';
    d+='決済リクエスト\n';
    d+='    ↓\n';
    d+='[L1] ルールエンジン (< 50ms)\n';
    d+='  • Velocity Check (同一カード 5回/分)\n';
    d+='  • 金額閾値 (¥500,000超→要確認)\n';
    d+='  • ブラックリスト照合\n';
    d+='    ↓\n';
    d+='[L2] MLスコアリング (< 200ms)\n';
    d+='  • 行動バイオメトリクス\n';
    d+='  • デバイスフィンガープリント\n';
    d+='  • 地理的異常検知\n';
    d+='    ↓\n';
    d+='[L3] 人間レビュー (高リスクのみ)\n';
    d+='  • フラグ付きトランザクション\n';
    d+='  • チャージバック分析\n';
    d+='```\n\n';
    d+='## '+(G?'3. PCI DSS 要件チェックリスト':'3. PCI DSS Requirements Checklist')+'\n\n';
    d+='| '+(G?'要件':'Requirement')+' | '+(G?'内容':'Description')+' | '+(G?'対応':'Action')+' |\n';
    d+='|------|------|------|\n';
    d+='| Req 3 | カードデータ保護 | トークン化 (never store PAN) |\n';
    d+='| Req 4 | 転送時暗号化 | TLS 1.3 専用エンドポイント |\n';
    d+='| Req 6 | セキュア開発 | SAST/DAST + 定期ペンテスト |\n';
    d+='| Req 7 | アクセス制御 | 最小権限 + MFA |\n';
    d+='| Req 10 | ログ監視 | 監査ログ + SIEM連携 |\n';
    d+='| Req 12 | 情報セキュリティポリシー | 年次レビュー + 訓練 |\n\n';
    d+='## '+(G?'4. Stripe Radar 活用パターン':'4. Stripe Radar Usage Patterns')+'\n\n';
    d+='```javascript\n// Stripe Radar custom rule example\n';
    d+="// Block high-risk countries for large amounts\n// Rule: block_if :amount_in_usd: > 1000 AND :ip_country: IN ['XX', 'YY']\n\n";
    d+='// Webhook signature verification (MUST)\nconst sig = req.headers["stripe-signature"];\n';
    d+="const event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET);\n```\n\n";
    d+='> '+(G?'参照':'See also')+': docs/121_security_design_guide.md | docs/45_compliance_matrix.md | docs/08_auth.md';
    S.files['docs/126_fintech_fraud_prevention.md']=d;
  })();}}

  // ═══ docs/127_manufacturing_iot_guide.md ═══ (manufacturing domain only)
  {const _dom127=detectDomain(a.purpose||'');
  if(_dom127==='manufacturing'){(()=>{
    let d='# '+(G?'製造業 IoT・Industry 4.0 統合ガイド':'Manufacturing IoT & Industry 4.0 Integration Guide')+'\n\n';
    d+='> '+(G?'生成日':'Generated')+': '+new Date().toISOString().split('T')[0]+' | '+(G?'ドメイン':'Domain')+': manufacturing\n\n';
    d+='## '+(G?'1. Industry 4.0 アーキテクチャ':'1. Industry 4.0 Architecture')+'\n\n';
    d+='```\n';
    d+='Edge Layer     → センサー/PLC/SCADA (OPC-UA/MQTT)\n';
    d+='Fog Layer      → エッジコンピューティング (AWS Greengrass / Azure IoT Edge)\n';
    d+='Cloud Layer    → IoTプラットフォーム (AWS IoT Core / Azure IoT Hub)\n';
    d+='Application    → MES/ERP 統合 + AI分析ダッシュボード\n';
    d+='```\n\n';
    d+='## '+(G?'2. IoT プロトコル選定マトリクス':'2. IoT Protocol Selection Matrix')+'\n\n';
    d+='| '+(G?'プロトコル':'Protocol')+' | '+(G?'レイテンシ':'Latency')+' | '+(G?'帯域':'Bandwidth')+' | '+(G?'ユースケース':'Use Case')+' |\n';
    d+='|----------|----------|------|----------|\n';
    d+='| MQTT | 低 (< 1ms) | 低 | センサーデータ収集・設備監視 |\n';
    d+='| OPC-UA | 中 | 中 | PLC/CNC通信・安全制御 |\n';
    d+='| AMQP | 中 | 高 | エンタープライズMQ統合 |\n';
    d+='| HTTP/REST | 高 | 高 | クラウドAPI・ダッシュボード |\n';
    d+='| WebSocket | 低-中 | 中 | リアルタイムモニタリング |\n\n';
    d+='## '+(G?'3. 予知保全 (Predictive Maintenance) 設計':'3. Predictive Maintenance Design')+'\n\n';
    d+='```\n';
    d+='データ収集\n';
    d+='  振動センサー → FFT解析 → 異常振動パターン検出\n';
    d+='  温度センサー → 閾値監視 → オーバーヒート予測\n';
    d+='  電流センサー → 負荷分析 → モーター劣化予測\n\n';
    d+='MLパイプライン\n';
    d+='  生データ → 前処理/正規化 → 特徴量エンジニアリング\n';
    d+='  → Isolation Forest (異常検知) → 残寿命予測モデル\n';
    d+='  → アラート → 保全作業オーダー自動生成\n';
    d+='```\n\n';
    d+='## '+(G?'4. セキュリティ考慮事項 (OT/IT 融合)':'4. Security Considerations (OT/IT Convergence)')+'\n\n';
    d+='- **ネットワーク分離**: OTネットワークとITネットワークのDMZ設置\n';
    d+='- **ファームウェア管理**: IoTデバイスの定期アップデート・脆弱性スキャン\n';
    d+='- **認証**: デバイス証明書 + mTLS (相互TLS)\n';
    d+='- **監査ログ**: 制御コマンドの全ログ保存 (改ざん防止)\n\n';
    d+='## '+(G?'5. データ品質・品質管理 (QC) 統合':'5. Data Quality & Quality Control (QC) Integration')+'\n\n';
    d+='| '+(G?'KPI':'KPI')+' | '+(G?'計算式':'Formula')+' | '+(G?'目標':'Target')+' |\n';
    d+='|-----|----------|------|\n';
    d+='| OEE (設備総合効率) | 可用性×性能×品質 | ≥ 85% |\n';
    d+='| MTBF (平均故障間隔) | 稼働時間 ÷ 故障回数 | 最大化 |\n';
    d+='| MTTR (平均修理時間) | 修理時間 ÷ 故障回数 | 最小化 |\n';
    d+='| 不良率 | 不良品数 ÷ 総生産数 | < 0.1% |\n\n';
    d+='> '+(G?'参照':'See also')+': docs/120_system_design_guide.md | docs/103_observability_architecture.md | docs/109_cost_architecture.md';
    S.files['docs/127_manufacturing_iot_guide.md']=d;
  })();}}

  // ═══ docs/108_uat_acceptance.md ═══
  const uatFeatures=features.slice(0,Math.min(features.length,6));
  let uat108='# '+pn+' — '+(G?'UAT受入テスト・リリース判定':'UAT Acceptance Test & Release Judgment')+'\n> '+date+'\n\n';
  uat108+='## '+(G?'1. UAT概要':'1. UAT Overview')+'\n';
  uat108+='- '+(G?'テスト期間':'Test period')+': \n';
  uat108+='- '+(G?'テスト環境':'Test environment')+': '+deployTarget+'\n';
  uat108+='- '+(G?'合格基準':'Acceptance criteria')+': '+(G?'P0不具合ゼロ / P1不具合は対応済みか計画策定済み':'P0 bugs=0 / P1 bugs resolved or planned')+'\n\n';
  uat108+='## '+(G?'2. 機能別受入テスト':'2. Feature Acceptance Tests')+'\n';
  uatFeatures.forEach(f=>{
    uat108+='\n### '+f+'\n';
    uat108+='| # | '+(G?'テストシナリオ':'Test Scenario')+' | '+(G?'期待結果':'Expected')+' | '+(G?'結果':'Result')+' | '+(G?'優先度':'Priority')+' |\n|---|--------|----------|------|---------|\n';
    uat108+='| 1 | '+(G?'正常系: 基本操作が成功する':'Normal: Basic operation succeeds')+' | 200/201 OK | | P0 |\n';
    uat108+='| 2 | '+(G?'正常系: 境界値データで正常処理':'Normal: Boundary value processed correctly')+' | '+(G?'正常完了':'OK')+' | | P1 |\n';
    uat108+='| 3 | '+(G?'異常系: 必須項目欠落でバリデーションエラー':'Error: Missing required field shows validation error')+' | 422 | | P0 |\n';
    uat108+='| 4 | '+(G?'異常系: 権限なしアクセスで拒否される':'Error: Unauthorized access rejected')+' | 401/403 | | P0 |\n';
  });
  uat108+='\n## '+(G?'3. 非機能テスト':'3. Non-Functional Tests')+'\n';
  uat108+='| '+(G?'項目':'Item')+' | '+(G?'基準':'Criteria')+' | '+(G?'測定値':'Measured')+' | '+(G?'合否':'Pass/Fail')+' |\n|------|--------|---------|----------|\n';
  uat108+='| LCP | < 2.5s | | |\n| '+(G?'可用性':'Availability')+' | 99.9% SLA | | |\n| '+(G?'セキュリティ':'Security')+' | docs/08 '+(G?'全項目':'all items')+' | | |\n| WCAG | 2.2 AA | | |\n\n';
  uat108+='## '+(G?'4. 不具合管理':'4. Defect Management')+'\n';
  uat108+='| ID | '+(G?'概要':'Summary')+' | '+(G?'優先度':'Priority')+' | '+(G?'再現手順':'Steps')+' | '+(G?'ステータス':'Status')+' | '+(G?'担当':'Owner')+' | '+(G?'対応期限':'Due')+' |\n|----|--------|---------|--------|---------|------|------|\n';
  uat108+='| BUG-001 | '+(G?'（記入例）':'(Example)')+' | P1 | 1. 2. 3. | '+(G?'対応中':'Open')+' | | |\n\n';
  uat108+='## '+(G?'5. リリース判定':'5. Release Judgment')+'\n\n';
  uat108+='### '+(G?'判定基準':'Judgment Criteria')+'\n';
  uat108+='| '+(G?'観点':'Aspect')+' | '+(G?'基準':'Criteria')+' | '+(G?'結果':'Result')+' |\n|--------|--------|------|\n';
  uat108+='| '+(G?'品質':'Quality')+' | P0=0 / '+(G?'全テスト通過':'All tests pass')+' | |\n';
  uat108+='| '+(G?'セキュリティ':'Security')+' | '+(G?'OWASP監査完了':'OWASP audit done')+' | |\n';
  uat108+='| '+(G?'パフォーマンス':'Performance')+' | LCP<2.5s | |\n';
  uat108+='| '+(G?'運用準備':'Ops readiness')+' | '+(G?'監視・RunBook完備':'Monitoring & runbook ready')+' | |\n';
  uat108+='| '+(G?'ドキュメント':'Docs')+' | '+(G?'変更履歴・API仕様更新':'Changelog & API spec updated')+' | |\n\n';
  uat108+='### '+(G?'未解決事項':'Unresolved Items')+'\n';
  uat108+='| ID | '+(G?'内容':'Content')+' | '+(G?'後対応可否':'Post-release OK')+' | '+(G?'対応期限':'Due')+' |\n|----|--------|------|------|\n\n';
  uat108+='### '+(G?'判定結果':'Judgment')+'\n';
  uat108+='- [ ] **Go** — '+(G?'本番リリース承認':'Approve production release')+'\n';
  uat108+='- [ ] **No-Go** — '+(G?'再テスト・修正が必要':'Re-test / fix required')+'\n';
  uat108+='- [ ] **'+(G?'条件付きGo':'Conditional Go')+'** — '+(G?'条件:':'Condition:')+'\n\n';
  uat108+='## '+(G?'6. 運用引き継ぎ':'6. Operations Handover')+'\n';
  uat108+='- '+(G?'問い合わせ窓口':'Contact point')+': \n';
  uat108+='- '+(G?'エスカレーション':'Escalation')+': '+(G?'担当 → PL → PM':'Assignee → PL → PM')+'\n\n';
  uat108+='### '+(G?'問い合わせ記録テンプレート':'Inquiry Log Template')+'\n';
  uat108+='| '+(G?'種別':'Type')+' | '+(G?'内容':'Content')+' | '+(G?'影響度':'Impact')+' | '+(G?'緊急度':'Urgency')+' | '+(G?'初動':'Initial action')+' | '+(G?'ステータス':'Status')+' |\n|------|--------|--------|---------|--------|----------|\n';
  uat108+='| '+(G?'障害/操作問い合わせ/改善要望/仕様確認':'Failure/Inquiry/Request/Spec check')+' | | '+(G?'高/中/低':'H/M/L')+' | '+(G?'高/中/低':'H/M/L')+' | | '+(G?'対応中':'Open')+' |\n';
  S.files['docs/108_uat_acceptance.md']=uat108;

  // ═══ docs/113_ai_collaboration_guide.md — AI協労プロトコル / ワークスロップ防止ガイド ═══
  (function(){
    var dom113=detectDomain(a.purpose||'');
    var pb113=DOMAIN_PLAYBOOK[dom113];
    var doc113='# '+pn+' — '+(G?'AI協労プロトコル（ワークスロップ防止ガイド）':'AI Collaboration Protocol (Anti-Workslop Guide)')+'\n> '+date+'\n\n';
    doc113+='> '+(G?'**ワークスロップ（Work Slop）**: AIに丸投げし、出力を検証せずそのまま使用する状態。質の低いアウトプットがシステムに蓄積する最大要因。':'**Workslop**: Blindly accepting AI output without verification. The primary cause of low-quality artifacts accumulating in systems.')+'\n\n';
    // §1 6 NG行為
    doc113+='## '+(G?'1. 6つのNG行為チェックリスト':'1. Six Anti-Patterns Checklist')+'\n\n';
    var ngJa=[
      ['鵜呑み (Accept-All)','AI出力をそのまま採用せず、必ず仕様書・要件・ドメイン制約と照合する','❌ コードをコピペしてテストなし → ✅ テスト追加・レビュー後にマージ'],
      ['丸投げ (Full-Delegation)','「全部やって」は禁止。タスクを1つに絞り、入力コンテキストを明示する','❌ 「アプリ作って」 → ✅ 「ERDを.spec/specification.mdに基づいて生成して」'],
      ['答え固執 (Answer-Lock)','最初の回答が間違いでも修正を求める。同じプロンプトの再送は同じ誤りを増幅させる','❌ 同じプロンプトを3回送信 → ✅ 誤りの理由を指摘して修正依頼'],
      ['コンテキスト不足 (Context-Starve)','仕様書・ER図・業務ルールを提示せずに生成依頼しない','❌ 何も渡さずに実装依頼 → ✅ docs/13_glossary.md + .spec/ を渡してから依頼'],
      ['見栄え罠 (Aesthetic-Trap)','美しいMarkdownや詳細な説明が「正確さ」を意味しない。内容の検証を優先','❌ 丁寧な文体を正確さと混同 → ✅ 具体的な数値・根拠・ドメイン制約を確認'],
      ['反復欠如 (No-Iteration)','1回の生成で完成と思わない。最低2回の対話（ドラフト→レビュー→精緻化）が必要','❌ 1回生成してPR → ✅ 2回以上の対話 + docs/16_review.md チェックリスト適用'],
    ];
    var ngEn=[
      ['Accept-All','Never use AI output as-is. Always verify against specs, requirements, and domain constraints.','❌ Paste code with no tests → ✅ Add tests and review before merge'],
      ['Full-Delegation','Never say "do everything." Narrow to one task and provide explicit input context.','❌ "Build the app" → ✅ "Generate ERD based on .spec/specification.md"'],
      ['Answer-Lock','If first answer is wrong, ask for corrections. Re-sending the same prompt amplifies the same errors.','❌ Send same prompt 3 times → ✅ Point out error reason and request correction'],
      ['Context-Starve','Never request generation without providing specs, ER diagrams, or business rules.','❌ Request implementation with nothing → ✅ Provide docs/13_glossary.md + .spec/ first'],
      ['Aesthetic-Trap','Beautiful Markdown or detailed explanations do NOT mean accuracy. Prioritize content verification.','❌ Confuse polite tone with accuracy → ✅ Verify concrete values, evidence, domain constraints'],
      ['No-Iteration','Never assume one generation is complete. Minimum 2 dialogue rounds (draft→review→refine).','❌ Generate once and PR → ✅ 2+ dialogue rounds + apply docs/16_review.md checklist'],
    ];
    var ng=G?ngJa:ngEn;
    ng.forEach(function(item,i){
      doc113+='### NG-'+(i+1)+': '+item[0]+'\n';
      doc113+='- '+(G?'原則':'Rule')+': '+item[1]+'\n';
      doc113+='- '+(G?'具体例':'Example')+': '+item[2]+'\n\n';
    });
    // §2 思考のパートナー
    doc113+='## '+(G?'2. 思考のパートナーとしてのAI活用':'## 2. AI as Thinking Partner')+'\n\n';
    doc113+=(G?
      '| 役割 | 活用方法 | 注意点 |\n|------|---------|--------|\n| 専門家チーム | 「フィンテック規制の観点からこの設計を評価して」 | 規制情報は必ず一次ソースで確認 |\n| 認知バイアス打破 | 「この決定の反論を3つ挙げて」 | 悪魔の代弁者として使う |\n| 高速合成 | 「競合他社5社のアーキテクチャの共通点は？」 | 合成結果はドメイン専門家に検証依頼 |\n':
      '| Role | How to Use | Caution |\n|------|------------|--------|\n| Expert Team | "Evaluate this design from a fintech regulation perspective" | Verify regulatory info with primary sources |\n| Bias Breaker | "Give me 3 counterarguments to this decision" | Use as devil\'s advocate |\n| Fast Synthesis | "What are common patterns across these 5 competitors?" | Have domain expert verify synthesis |\n'
    )+'\n';
    // §3 反復的対話プロトコル
    doc113+='## '+(G?'3. 反復的対話プロトコル（5ステップ）':'3. Iterative Dialogue Protocol (5 Steps)')+'\n\n';
    var stepsJa=['**コンテキスト提供**: docs/13_glossary.md + .spec/constitution.md を渡す','**ドラフト生成**: タスクを1つに絞り、制約を明示してドラフト依頼','**実質レビュー**: 仕様書・ER図・業務ルールと照合し差異を特定','**精緻化**: 差異を明示して修正依頼（理由を説明する）','**品質検証**: 下記チェックリストを適用し、合格したらコミット'];
    var stepsEn=['**Context Provision**: Provide docs/13_glossary.md + .spec/constitution.md','**Draft Generation**: Narrow to one task, provide explicit constraints, request draft','**Substantive Review**: Verify against specs/ER/business rules, identify discrepancies','**Refinement**: Explicitly state discrepancies and request corrections (explain reasons)','**Quality Verification**: Apply checklist below, commit only when passing'];
    (G?stepsJa:stepsEn).forEach(function(s,i){doc113+=(i+1)+'. '+s+'\n';});
    doc113+='\n';
    // §4 品質検証チェックリスト
    doc113+='## '+(G?'4. 品質検証チェックリスト':'4. Quality Verification Checklist')+'\n\n';
    var qcJa=['プロジェクト仕様（.spec/specification.md）に基づいているか？','根拠が検証可能か（具体的な数値・一次ソースがあるか）？','ドメイン制約（docs/13_glossary.md § 業務ルール）を参照しているか？','2回以上の対話を経ているか（1回生成のみは禁止）？','docs/16_review.md のレビューチェックリストを通過したか？','NG-1〜NG-6 のいずれも該当しないか？'];
    var qcEn=['Based on project specs (.spec/specification.md)?','Verifiable evidence (concrete numbers, primary sources)?','References domain constraints (docs/13_glossary.md § Business Rules)?','2+ dialogue rounds completed (single-generation is prohibited)?','Passed docs/16_review.md review checklist?','None of NG-1 through NG-6 apply?'];
    (G?qcJa:qcEn).forEach(function(c){doc113+='- [ ] '+c+'\n';});
    doc113+='\n';
    // §5 思考の軌跡
    doc113+='## '+(G?'5. 思考の軌跡の保存':'5. Preserving Thought Trails')+'\n\n';
    doc113+=(G?
      '重要な対話ログは **docs/00_architecture_decision_records.md** に記録してください。\n\n記録すべき内容:\n- なぜその設計を選択したか（却下した代替案を含む）\n- どのドメイン制約が判断に影響したか\n- AIの提案とチームの最終判断の差異\n- 次回の参照ポイント（同じ議論を繰り返さないために）\n':
      'Record important dialogue logs in **docs/00_architecture_decision_records.md**.\n\nWhat to record:\n- Why that design was chosen (including rejected alternatives)\n- Which domain constraints influenced the decision\n- Difference between AI suggestions and team\'s final judgment\n- Reference points for future (to avoid repeating the same discussion)\n'
    );
    // §6 ドメイン別フォーカス
    doc113+='## '+(G?'6. ドメイン別AI協労フォーカス':'6. Domain-Specific AI Collaboration Focus')+'\n\n';
    doc113+=(G?'**検出ドメイン**: ':'**Detected Domain**: ')+dom113+'\n\n';
    if(pb113){
      doc113+=(G?'このドメインで特に注意が必要なAI出力検証ポイント:':'AI output verification points especially important in this domain:')+'\n\n';
      var cmpls=G?pb113.compliance_ja:pb113.compliance_en;
      if(cmpls&&cmpls.length)cmpls.slice(0,3).forEach(function(c){doc113+='- '+c+'\n';});
      doc113+='\n';
      doc113+=(G?'AIが見落としやすいドメイン固有のバグパターン:':'Domain-specific bug patterns AI tends to miss:')+'\n\n';
      var prvs=G?pb113.prevent_ja:pb113.prevent_en;
      if(prvs&&prvs.length)prvs.slice(0,3).forEach(function(p){
        var parts=p.split('|対策:');if(parts.length<2)parts=p.split('|Fix: ');
        doc113+='- ⚠️ '+parts[0].trim()+(parts[1]?' → '+parts[1].trim():'')+'\n';
      });
    }
    S.files['docs/113_ai_collaboration_guide.md']=doc113;
  })();

  // ═══ docs/114_domain_knowledge_guide.md — ドメイン知識構造化ガイド ═══
  (function(){
    var dom114=detectDomain(a.purpose||'');
    var pb114=DOMAIN_PLAYBOOK[dom114];
    var doc114='# '+pn+' — '+(G?'ドメイン知識構造化ガイド（スペック駆動開発連携）':'Domain Knowledge Structuring Guide (Spec-Driven Dev)')+'\n> '+date+'\n\n';
    doc114+='> '+(G?'**スペック駆動開発（SDD）** とは、実装前にドメイン知識を構造化し、仕様書・業務ルール・ワークフローを整備してからコードを書くアプローチ。':'**Spec-Driven Development (SDD)**: Approach of structuring domain knowledge, preparing specs/business-rules/workflows before writing code.')+'\n\n';
    // §1 ユビキタス言語
    doc114+='## '+(G?'1. ユビキタス言語辞書への参照':'1. Reference to Ubiquitous Language')+'\n\n';
    doc114+=(G?
      'プロジェクト全体で一貫して使用すべきドメイン用語は **docs/13_glossary.md** に定義されています。\n\nAIへの指示・コードのコメント・PRの説明文でもこの用語集の語彙を使用してください。用語の不一致は「ワークスロップ」の温床になります。\n':
      'Domain terms to use consistently across the project are defined in **docs/13_glossary.md**.\n\nUse this glossary vocabulary in AI instructions, code comments, and PR descriptions. Terminology inconsistency breeds workslop.\n'
    );
    doc114+=(G?'**ドメイン**: ':'**Domain**: ')+dom114+'\n\n';
    // §2 業務ルールテンプレート
    doc114+='## '+(G?'2. 業務ルール テンプレート':'2. Business Rule Templates')+'\n\n';
    doc114+=(G?
      '以下のテンプレートでプロジェクト固有の業務ルールを文書化してください。\n受入基準（AC）の自動生成元としても使用されます。\n\n':
      'Document project-specific business rules using the template below.\n Also used as source for automatic acceptance criteria (AC) generation.\n\n'
    );
    if(pb114){
      var prvs114=G?pb114.prevent_ja:pb114.prevent_en;
      if(prvs114&&prvs114.length){
        prvs114.slice(0,4).forEach(function(p,i){
          var parts=p.split('|対策:');if(parts.length<2)parts=p.split('|Fix: ');
          doc114+='### BR-'+(i+1).toString().padStart(2,'0')+'\n';
          doc114+='- '+(G?'条件':'Condition')+': もし `'+parts[0].trim()+'` が発生したならば\n';
          doc114+='- '+(G?'アクション':'Action')+': '+(parts[1]?parts[1].trim():'（要定義）')+'\n';
          doc114+='- '+(G?'受入基準':'AC')+': （Givenー前提 / Whenーアクション / Thenー期待結果 を記入）\n\n';
        });
      }
    } else {
      doc114+='### BR-01\n- '+(G?'条件':'Condition')+': '+(G?'もし `:条件:` が発生したならば':'If `:condition:` occurs then')+'\n';
      doc114+='- '+(G?'アクション':'Action')+': '+(G?'（具体的な対処を記入）':'(describe specific action)')+'\n';
      doc114+='- '+(G?'受入基準':'AC')+': Given / When / Then\n\n';
    }
    // §3 ワークフロー文書化
    doc114+='## '+(G?'3. ワークフロー文書化テンプレート（As-Is / To-Be）':'3. Workflow Documentation (As-Is / To-Be)')+'\n\n';
    doc114+=(G?'### As-Is（現状フロー）\n':'### As-Is (Current Flow)\n');
    doc114+='```mermaid\nflowchart LR\n  Start(['+( G?'開始':'Start')+']) --> Step1['+( G?'現状ステップ1':'Current Step 1')+'] --> Step2['+( G?'現状ステップ2 (手動・遅延)':'Current Step 2 (manual, delayed)')+'] --> End(['+( G?'完了':'End')+'])\n```\n\n';
    doc114+=(G?'### To-Be（改善後フロー）\n':'### To-Be (Improved Flow)\n');
    if(pb114){
      var impl114=G?pb114.impl_ja:pb114.impl_en;
      doc114+='```mermaid\nflowchart LR\n';
      (impl114||[]).slice(0,3).forEach(function(step,i){
        var parts=step.split('→');
        parts.forEach(function(p,j){
          var node='S'+i+'_'+j;
          var label=p.trim().replace(/\(.+\)/,'').trim().slice(0,20);
          if(i===0&&j===0)doc114+='  Start(['+( G?'開始':'Start')+']) --> '+node+'["'+label+'"]\n';
          else if(j>0)doc114+='  S'+i+'_'+(j-1)+' --> '+node+'["'+label+'"]\n';
        });
      });
      doc114+='  S'+(Math.min((impl114||[]).length,3)-1)+'_0 --> End(['+( G?'完了':'End')+'])\n';
      doc114+='```\n\n';
    } else {
      doc114+='```mermaid\nflowchart LR\n  Start(['+( G?'開始':'Start')+']) --> Auto["'+( G?'自動処理':'Automated process')+'"]\n  Auto --> Valid{'+( G?'バリデーション':'Validation')+'}\n  Valid -->|OK| End(['+( G?'完了':'End')+'])\n  Valid -->|NG| Error["'+( G?'エラー処理':'Error handling')+'"]\n```\n\n';
    }
    // §4 エンティティ関係ガイドライン
    doc114+='## '+(G?'4. エンティティ関係ガイドライン':'4. Entity Relationship Guidelines')+'\n\n';
    doc114+=(G?
      '- ER図: **docs/04_er_diagram.md** 参照\n- 集約ルートの特定: 最もライフサイクルを管理するエンティティ（例: `Order` は `OrderItem` の集約ルート）\n- AI指示時は「集約ルートを通じてのみ子エンティティを操作する」制約を明示\n':
      '- ER Diagram: See **docs/04_er_diagram.md**\n- Identify aggregate roots: Entity that manages the lifecycle (e.g., `Order` is aggregate root for `OrderItem`)\n- When instructing AI: explicitly state "only operate child entities through aggregate root" constraint\n'
    );
    // §5 SDD連携
    doc114+='## '+(G?'5. スペック駆動開発との連携フロー':'5. Spec-Driven Development Integration Flow')+'\n\n';
    doc114+='```\n';
    doc114+=(G?
      'docs/13_glossary.md (用語集)\n        ↓ 用語を仕様書に統一適用\n.spec/specification.md (要件定義)\n        ↓ 業務ルールを受入基準に変換\n.spec/tasks.md (タスク一覧・優先度・受入基準)\n        ↓ タスク→API設計\ndocs/05_api_design.md (API仕様)\n        ↓ API仕様→実装\nsrc/ (ソースコード + テスト)\n        ↓ 実装→検証\ndocs/108_uat_acceptance.md (UATシナリオ)':
      'docs/13_glossary.md (Ubiquitous Language)\n        ↓ Apply terms uniformly to specs\n.spec/specification.md (Requirements)\n        ↓ Convert business rules to acceptance criteria\n.spec/tasks.md (Task list, priority, AC)\n        ↓ Tasks → API design\ndocs/05_api_design.md (API spec)\n        ↓ API spec → Implementation\nsrc/ (Source code + tests)\n        ↓ Implementation → Verification\ndocs/108_uat_acceptance.md (UAT scenarios)'
    )+'\n```\n\n';
    doc114+=(G?
      '**AIへの最適な指示文テンプレート**:\n\n```\n以下の制約に従って実装してください:\n1. docs/13_glossary.md の用語を使用\n2. .spec/specification.md §N の要件に準拠\n3. BR-XX の業務ルールを守ること\n4. 受入基準: Given [前提], When [操作], Then [期待結果]\n```\n':
      '**Optimal AI instruction template**:\n\n```\nPlease implement following these constraints:\n1. Use terms from docs/13_glossary.md\n2. Comply with .spec/specification.md §N requirements\n3. Follow BR-XX business rules\n4. Acceptance criteria: Given [precondition], When [action], Then [expected result]\n```\n'
    );
    S.files['docs/114_domain_knowledge_guide.md']=doc114;
  })();

  // ═══ docs/115_skill_portfolio.md — agentskills.io準拠スキルポートフォリオ ═══
  (function(){
    var doc115='# '+pn+' — '+(G?'スキルポートフォリオ (agentskills.io準拠)':'Skill Portfolio (agentskills.io Compliant)')+'\n\n';
    doc115+=G?'このドキュメントはプロジェクトのAIスキル構成・Progressive Disclosure設計・クロスプラットフォーム互換性を定義します。\n\n':'This document defines the project AI skill configuration, Progressive Disclosure design, and cross-platform compatibility.\n\n';

    // §1 MCP vs Skills アーキテクチャ
    doc115+='## 1. '+(G?'MCP vs Skills アーキテクチャ':'MCP vs Skills Architecture')+'\n\n';
    doc115+=G?'MCPとSkillsは**役割分担**によって共存します。混在・混同はポータビリティとテスタビリティを損ないます。\n\n':'MCP and Skills coexist through **role separation**. Mixing them damages portability and testability.\n\n';
    doc115+='| '+(G?'観点':'Aspect')+' | MCP (Model Context Protocol) | Skills ([name]/SKILL.md) |\n';
    doc115+='|------|------|------|\n';
    doc115+='| '+(G?'役割':'Role')+' | '+(G?'物理ツールアクセス (Read/Write/Bash/Search)':'Physical tool access (Read/Write/Bash/Search)')+' | '+(G?'論理判断ロジック (レビュー/生成/検証)':'Logical judgment logic (review/generate/validate)')+' |\n';
    doc115+='| '+(G?'配置':'Placement')+' | `.mcp/` | `skills/[name]/SKILL.md` |\n';
    doc115+='| '+(G?'ポータビリティ':'Portability')+' | '+(G?'ランタイム依存 (Claude Code等)':'Runtime-dependent (Claude Code etc.)')+' | '+(G?'LLM非依存 (Markdown)':'LLM-agnostic (Markdown)')+' |\n';
    doc115+='| '+(G?'テスト':'Testability')+' | '+(G?'ツール実行テスト':'Tool execution test')+' | '+(G?'入出力ユニットテスト':'Input/output unit test')+' |\n';
    doc115+='| '+(G?'監査':'Audit')+' | '+(G?'ツールログで追跡':'Tracked via tool logs')+' | '+(G?'SKILL.mdで明示的':'Explicit in SKILL.md')+' |\n';
    doc115+='\n'+(G?'**なぜ分離するか**: 判断ロジック(スキル)をツールアクセス(MCP)から分離することで、スキルをどのIDEでも再利用でき、LLM切替えコストがゼロになります。':'**Why separate**: Separating judgment logic (skills) from tool access (MCP) allows skills to be reused across any IDE, with zero LLM-switching cost.')+'\n\n';

    // §2 Progressive Disclosure プロトコル
    doc115+='## 2. '+(G?'Progressive Disclosure プロトコル (3段階)':'Progressive Disclosure Protocol (3 Stages)')+'\n\n';
    doc115+=G?'AIはコンテキストを段階的にロードします。Stage 1だけで起動可否を判断でき、不要なトークンを消費しません。\n\n':'AI loads context progressively. Stage 1 alone enables activation decisions, without consuming unnecessary tokens.\n\n';
    doc115+='| '+(G?'ステージ':'Stage')+' | '+(G?'内容':'Content')+' | '+(G?'トークン目安':'Token Budget')+' | '+(G?'判断':'Decision')+' |\n';
    doc115+='|-------|--------|----------|------|\n';
    doc115+='| Stage 1 | YAML frontmatter (`name`/`description`: What/When/Covers) | ~100 tok | '+(G?'起動するか？':'Activate?')+' |\n';
    doc115+='| Stage 2 | '+(G?'スキル本文 (Purpose/Input/Judgment/Next/Token Estimate)':'Skill body (Purpose/Input/Judgment/Next/Token Estimate)')+' | <5,000 tok | '+(G?'実行手順確認':'Confirm procedure')+' |\n';
    doc115+='| Stage 3 | '+(G?'参照スクリプト・外部ファイル・lazy load':'Referenced scripts, external files, lazy load')+' | '+(G?'必要時のみ':'On demand')+' | '+(G?'詳細処理':'Detail processing')+' |\n\n';

    // §3 クロスプラットフォーム互換性
    doc115+='## 3. '+(G?'クロスプラットフォーム互換性':'Cross-Platform Compatibility')+'\n\n';
    doc115+='| '+(G?'プラットフォーム':'Platform')+' | '+(G?'スキルパス':'Skill Path')+' | '+(G?'フォーマット':'Format')+' | '+(G?'備考':'Notes')+' |\n';
    doc115+='|---------|---------|--------|------|\n';
    doc115+='| Claude Code | `skills/[name]/SKILL.md` | Markdown+YAML | '+(G?'agentskills.io標準':'agentskills.io standard')+' |\n';
    doc115+='| OpenAI Codex | `.codex/skills/[name]/SKILL.md` | Markdown+YAML | '+(G?'ミラー (同一内容)':'Mirror (identical content)')+' |\n';
    doc115+='| Cursor | `skills/[name]/SKILL.md` | Markdown+YAML | '+(G?'Claude Code互換':'Claude Code compatible')+' |\n';
    doc115+='| Windsurf | `skills/[name]/SKILL.md` | Markdown+YAML | '+(G?'Claude Code互換':'Claude Code compatible')+' |\n';
    doc115+='| Cline | `skills/[name]/SKILL.md` | Markdown+YAML | '+(G?'Claude Code互換':'Claude Code compatible')+' |\n';
    doc115+='| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | '+(G?'ルールベースのみ':'Rules-based only')+' |\n\n';

    // §4 スキル設計品質チェックリスト
    doc115+='## 4. '+(G?'スキル設計品質チェックリスト':'Skill Design Quality Checklist')+'\n\n';
    var checks=[
      G?'[ ] スキル名がkebab-caseである (例: spec-review, code-gen)':'[ ] Skill name is kebab-case (e.g., spec-review, code-gen)',
      G?'[ ] YAML frontmatterに What/When/Covers の3フィールドがある':'[ ] YAML frontmatter has What/When/Covers 3 fields',
      G?'[ ] 1スキル = 1判断 (PASS/FAILまたは数値目標)':'[ ] 1 Skill = 1 Judgment (PASS/FAIL or numeric target)',
      G?'[ ] 判断基準が定量的 (「矛盾0件」「カバレッジ≥80%」等)':'[ ] Judgment criteria are quantitative (e.g., "0 contradictions", "coverage ≥80%")',
      G?'[ ] Stage 1 (~100tok) のみで起動可否を判断できる':'[ ] Activation decision possible from Stage 1 (~100tok) alone',
      G?'[ ] MCPツールアクセスをスキル内に書いていない':'[ ] No MCP tool access written inside skill',
      G?'[ ] 山括弧テンプレート (<your task here>) を使っていない':'[ ] No angle-bracket templates (<your task here>)',
      G?'[ ] 次スキル (Next) が定義されている':'[ ] Next skill is defined',
      G?'[ ] 入力ファイル (Input) が具体的なパスで指定されている':'[ ] Input files specified with concrete paths',
      G?'[ ] スキル名がスキルIDと一致している (skills/[id]/SKILL.md)':'[ ] Skill name matches skill ID (skills/[id]/SKILL.md)'
    ];
    checks.forEach(function(c){doc115+=c+'\n';});
    doc115+='\n';

    // §5 プロジェクトのスキル構成
    doc115+='## 5. '+(G?'プロジェクトのスキル構成':'Project Skill Configuration')+'\n\n';
    doc115+='| '+(G?'スキルID':'Skill ID')+' | '+(G?'役割':'Role')+' | '+(G?'判断基準':'Judgment')+' | '+(G?'次スキル':'Next')+' |\n';
    doc115+='|---------|------|----------|------|\n';
    if(typeof SKILL_DEFS!=='undefined'){
      SKILL_DEFS.forEach(function(sk){
        doc115+='| '+sk.id+' | '+sk.role+' | '+(G?sk.judgment_ja:sk.judgment_en)+' | '+sk.next+' |\n';
      });
    }
    doc115+='\n';

    // §6 マルチLLMルーティングガイド
    doc115+='## 6. '+(G?'マルチLLMルーティングガイド':'Multi-LLM Routing Guide')+'\n\n';
    doc115+=G?'タスク種別に応じて最適なAIを選択することで、品質とコスト効率を最大化します。\n\n':'Select the optimal AI per task type to maximize quality and cost efficiency.\n\n';
    doc115+='| '+(G?'タスク種別':'Task Type')+' | '+(G?'推奨AI':'Recommended AI')+' | '+(G?'理由':'Reason')+' |\n';
    doc115+='|---------|---------|------|\n';
    doc115+='| '+(G?'仕様レビュー・設計検証':'Spec review / design validation')+' | Claude | '+(G?'長文理解・論理的一貫性評価に強い':'Strong at long-doc comprehension and logical consistency')+' |\n';
    doc115+='| '+(G?'コード生成・実装':'Code generation / implementation')+' | Copilot / Codex | '+(G?'IDE統合・コード補完に最適化':'Optimized for IDE integration and code completion')+' |\n';
    doc115+='| '+(G?'大規模ドキュメント処理':'Large-scale document processing')+' | Gemini 2.5 Pro | '+(G?'1Mコンテキスト対応':'1M context window')+' |\n';
    doc115+='| '+(G?'ブレインストーミング・アイデア出し':'Brainstorming / idea generation')+' | ChatGPT | '+(G?'創造的思考・多角的視点に強い':'Strong at creative thinking and diverse perspectives')+' |\n';
    doc115+='| '+(G?'テスト生成':'Test generation')+' | Copilot | '+(G?'既存コードパターン学習に強い':'Strong at learning existing code patterns')+' |\n';
    doc115+='| '+(G?'セキュリティ監査':'Security audit')+' | Gemini | '+(G?'最新脆弱性データベース参照':'References latest vulnerability databases')+' |\n\n';
    doc115+=G?'> **注意**: AIの選択は固定ではありません。プロジェクトの状況・コスト・モデルの進化に応じて随時見直してください。\n':
      '> **Note**: AI selection is not fixed. Revisit based on project context, cost, and model evolution.\n';

    S.files['docs/115_skill_portfolio.md']=doc115;
  })();

  // ═══ B2: docs/35_sitemap.md (~8KB) ═══
  let doc35='# '+pn+' — '+(G?'サイトマップ・情報設計':'Sitemap & Information Architecture')+'\n\n';
  doc35+=G?'**重要**: このドキュメントはアプリケーション全体のURL構造とナビゲーションパターンを定義します。新規ページ追加時は必ずこのサイトマップを更新してください。\n\n':'**IMPORTANT**: This document defines the URL structure and navigation patterns for the entire application. MUST update this sitemap when adding new pages.\n\n';

  // Generate routes (reuse existing genRoutes function)
  const allRoutes=genRoutes(a);

  // URL Tree (Mermaid graph)
  doc35+=(G?'## URLツリー':'## URL Tree')+'\n\n';
  doc35+=(G?'**ルーティング構造の可視化**':'**Routing structure visualization**')+'\n\n';
  doc35+='```mermaid\ngraph TD\n';
  doc35+='  Root["/"]\n';

  // Build tree nodes
  const addedPaths=new Set(['Root']);
  allRoutes.forEach((route,i)=>{
    const path=route.path;
    const parts=path.split('/').filter(Boolean);
    let currentPath='Root';

    parts.forEach((part,idx)=>{
      const nodeName=part.replace(/[:\[\]]/g,'').replace(/-/g,'_')||'index';
      const fullPath=currentPath+'_'+nodeName;

      if(!addedPaths.has(fullPath)){
        const label=part.replace(/[\[\]:]/g,'');
        const style=route.auth?' --> |🔒|':' --> ';
        doc35+='  '+currentPath+style+fullPath+'["'+label+'"]\n';
        addedPaths.add(fullPath);
      }
      currentPath=fullPath;
    });
  });
  doc35+='```\n\n';

  // Route-Screen-Component Mapping Table
  doc35+=(G?'## Route-Screen-Component マッピング':'## Route-Screen-Component Mapping')+'\n\n';
  doc35+='| '+(G?'ルート':'Route')+' | '+(G?'画面名':'Screen')+' | '+(G?'主要コンポーネント':'Key Components')+' | '+(G?'認証':'Auth')+' |\n';
  doc35+='|------|------|------|------|\n';

  allRoutes.forEach(route=>{
    const screenName=route.name||route.path.split('/').pop()||'Index';
    const components=getScreenComponents(screenName,G);
    const componentList=components?components.slice(0,3).join(', '):(G?'（未定義）':'(Undefined)');
    const authIcon=route.auth?'🔒':'🌐';

    doc35+='| `'+route.path+'` | '+screenName+' | '+componentList+' | '+authIcon+' |\n';
  });
  doc35+='\n';
  doc35+=(G?'**凡例**: 🔒 認証必須 | 🌐 公開':'**Legend**: 🔒 Auth required | 🌐 Public')+'\n\n';

  // Navigation Patterns
  doc35+=(G?'## ナビゲーションパターン':'## Navigation Patterns')+'\n\n';

  // Primary Navigation
  doc35+='### 1. '+(G?'プライマリナビゲーション':'Primary Navigation')+'\n\n';
  doc35+=(G?'**位置**: ヘッダー or サイドバー':'**Location**: Header or Sidebar')+'\n\n';

  const primaryRoutes=allRoutes.filter(r=>
    !r.path.includes('[')&&!r.path.includes(':')&&r.path.split('/').filter(Boolean).length<=2
  );
  doc35+=(G?'推奨リンク:':'Recommended links:')+'\n';
  primaryRoutes.slice(0,8).forEach(r=>{
    doc35+='- `'+r.path+'` — '+r.name+(r.auth?' 🔒':'')+'\n';
  });
  doc35+='\n';

  // Secondary Navigation
  doc35+='### 2. '+(G?'セカンダリナビゲーション':'Secondary Navigation')+'\n\n';
  doc35+=(G?'**位置**: サブメニュー or タブ':'**Location**: Submenu or Tabs')+'\n\n';

  const secondaryRoutes=allRoutes.filter(r=>
    r.path.split('/').filter(Boolean).length>=3&&!r.path.includes('[')&&!r.path.includes(':')
  );
  if(secondaryRoutes.length>0){
    doc35+=(G?'サブセクション:':'Sub-sections:')+'\n';
    secondaryRoutes.slice(0,5).forEach(r=>{
      doc35+='- `'+r.path+'` — '+r.name+(r.auth?' 🔒':'')+'\n';
    });
    doc35+='\n';
  }else{
    doc35+=G?'（該当なし）\n\n':'(None)\n\n';
  }

  // Breadcrumb Navigation
  doc35+='### 3. '+(G?'パンくずナビゲーション':'Breadcrumb Navigation')+'\n\n';
  doc35+=(G?'**推奨実装**: 3階層以上のページで表示':'**Recommended**: Display for pages with ≥3 levels')+'\n\n';

  const deepRoutes=allRoutes.filter(r=>r.path.split('/').filter(Boolean).length>=3);
  if(deepRoutes.length>0){
    const exampleRoute=deepRoutes[0];
    const parts=exampleRoute.path.split('/').filter(Boolean);
    let breadcrumb='Home';
    parts.forEach((part,i)=>{
      if(i<parts.length-1){
        breadcrumb+=' > '+part.replace(/[:\[\]]/g,'');
      }
    });
    breadcrumb+=' > '+exampleRoute.name;
    doc35+=(G?'例: ':'Example: ')+'`'+breadcrumb+'`\n\n';
  }else{
    doc35+=G?'（該当ルートなし）\n\n':'(No applicable routes)\n\n';
  }

  // SEO Metadata Map
  doc35+=(G?'## SEOメタデータマップ':'## SEO Metadata Map')+'\n\n';
  doc35+='| '+(G?'ルート':'Route')+' | Title | Description | OG Image |\n';
  doc35+='|------|------|------|------|\n';

  allRoutes.slice(0,10).forEach(route=>{
    const routeName=route.name||'Page';
    const title=pn+' | '+routeName;
    const desc=(a.purpose||'').substring(0,80)+'...';
    const ogImage='/og-image.png';

    doc35+='| `'+route.path+'` | '+title+' | '+desc+' | '+ogImage+' |\n';
  });
  doc35+='\n';

  // URL Best Practices
  doc35+=(G?'## URLベストプラクティス':'## URL Best Practices')+'\n\n';
  doc35+='1. **'+(G?'小文字+ハイフン':'Lowercase + hyphens')+'**: `/user-profile` '+(G?'ではなく':'not')+' `/userProfile`\n';
  doc35+='2. **'+(G?'複数形の一貫性':'Plural consistency')+'**: `/users/:id` '+(G?'（コレクションは複数形）':'(collections are plural)')+'\n';
  doc35+='3. **'+(G?'RESTful命名':'RESTful naming')+'**: `/api/posts/:id/comments` '+(G?'（ネストでリソース関係を表現）':'(nested to show resource relationship)')+'\n';
  doc35+='4. **'+(G?'クエリパラメータ':'Query params')+'**: `/search?q=keyword&sort=date` '+(G?'（フィルタ・ソートはクエリで）':'(filters/sorting in query)')+'\n\n';

  // Related Documents
  doc35+=(G?'## 関連ドキュメント':'## Related Documents')+'\n\n';
  doc35+='- **docs/05_api_design.md** — '+(G?'APIエンドポイント詳細':'API endpoints detail')+'\n';
  doc35+='- **docs/06_screen_design.md** — '+(G?'画面設計書':'Screen design')+'\n';
  doc35+='- **docs/26_design_system.md** — '+(G?'デザインシステム':'Design system')+'\n';
  doc35+='- **.spec/technical-plan.md** — '+(G?'技術計画':'Technical plan')+'\n\n';

  S.files['docs/35_sitemap.md']=doc35;

  // CI/CD Workflow YAML
  const buildCmd=fe.includes('Next')?'next build':fe.includes('Vite')||fe.includes('SPA')?'vite build':'npm run build';
  const buildPrefix=buildCmd.startsWith('npm')?'':'npx ';
  const nodeV='22';
  S.files['.github/workflows/ci.yml']=[
    'name: CI',
    'on:',
    '  push:',
    '    branches: [main, develop]',
    '  pull_request:',
    '    branches: [main]',
    '',
    'jobs:',
    '  ci:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - uses: actions/setup-node@v4',
    '        with:',
    '          node-version: '+nodeV,
    '          cache: npm',
    '      - run: npm ci',
    '      - run: npm audit --audit-level=high',
    '      - run: npm run lint',
    '      - run: npm run test',
    '      - run: '+buildPrefix+buildCmd,
    '',
    '  security:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '        with:',
    '          fetch-depth: 0',
    '      # Secret Scanning',
    '      - uses: gitleaks/gitleaks-action@v2',
    '        env:',
    '          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}',
    '      # Dependency Review',
    '      - uses: actions/dependency-review-action@v4',
    '        if: github.event_name == \'pull_request\'',
    '      # SLSA Build Provenance',
    '      - uses: actions/attest-build-provenance@v2',
    '        with:',
    '          subject-path: \'dist/**\'',
    ''
  ].join('\n');

  // ── ADR (Architecture Decision Records) ──
  const isBaaS=inc2(be,'Firebase')||inc2(be,'Supabase')||inc2(be,'Convex');
  function inc2(v,k){return v&&typeof v==='string'&&v.indexOf(k)!==-1;}
  const ormName=resolveORM(a).name;
  const deployName=a.deploy||'Vercel';
  const authName=resolveAuth(a).provider||a.auth||'JWT';
  const domainName=typeof detectDomain==='function'?detectDomain(a.purpose||''):'saas';
  const adrDate=date;

  const mkAdr=(num,title,status,ctx,decision,consequences,alternatives)=>{
    const numStr=String(num).padStart(3,'0');
    return '## ADR-'+numStr+': '+title+'\n\n**'+(G?'ステータス':'Status')+':** '+status+'  \n**'+(G?'決定日':'Date')+':** '+adrDate+'\n\n### '+(G?'コンテキスト':'Context')+'\n'+ctx+'\n\n### '+(G?'決定':'Decision')+'\n'+decision+'\n\n### '+(G?'結果':'Consequences')+'\n'+consequences+'\n\n### '+(G?'検討した代替案':'Alternatives Considered')+'\n'+alternatives+'\n\n---\n';
  };

  // ADR-001: Frontend
  const feAlt=fe.includes('Next')?G?'- Vue 3 + Nuxt (より学習コスト低)\n- SvelteKit (バンドルサイズ小)\n- Astro (コンテンツ重視の場合)':'- Vue 3 + Nuxt (lower learning curve)\n- SvelteKit (smaller bundle)\n- Astro (content-focused sites)':G?'- React + Next.js (SSR/SSGが必要な場合)\n- SvelteKit (軽量フレームワーク)\n- Astro (静的コンテンツ重視)':'- React + Next.js (when SSR/SSG needed)\n- SvelteKit (lightweight)\n- Astro (static content focus)';
  const feCtx=G?'プロジェクト「'+pn+'」では'+domainName+'ドメインのWebアプリケーションを構築するため、フロントエンドフレームワークの選定が必要でした。ターゲットユーザーへの体験を最適化するフレームワークを選定しました。':'Project "'+pn+'" requires a frontend framework for a '+domainName+'-domain web application. The framework was selected to optimize experience for target users.';
  const feDecision=G?'**'+fe+'** を採用します。\n\n選定理由:\n- '+(fe.includes('Next')?'SSR/SSGによるSEO最適化とパフォーマンス':'SPA高速レンダリング')+'\n- '+(fe.includes('React')||fe.includes('Next')?'豊富なエコシステムと求人市場':fe.includes('Vue')?'なだらかな学習曲線':'先進的なコンパイラ最適化'):'Adopt **'+fe+'**.\n\nReasons:\n- '+(fe.includes('Next')?'SSR/SSG for SEO optimization and performance':'SPA fast rendering')+'\n- '+(fe.includes('React')||fe.includes('Next')?'Rich ecosystem and job market':fe.includes('Vue')?'Gentle learning curve':'Advanced compiler optimization');
  const feConseq=G?'- '+(fe.includes('Next')?'Next.js APIルートでBFFパターンが可能になる':'Viteによる高速HMR開発体験')+'\n- TypeScriptとの統合が標準的に提供される':'- '+(fe.includes('Next')?'Next.js API routes enable BFF pattern':'Fast HMR development via Vite')+'\n- TypeScript integration provided out of the box';

  // ADR-002: Backend Architecture
  const beCtx=G?'バックエンドアーキテクチャの選定は、チームスキル（'+(a.skill_level||'Intermediate')+'）・開発速度・スケーラビリティ要件を考慮して決定しました。':'Backend architecture selection considered team skill ('+( a.skill_level||'Intermediate')+'), development speed, and scalability requirements.';
  const beDecision=G?'**'+be+'** を採用します（アーキテクチャパターン: '+arch.pattern+'）。\n\n選定理由:\n- '+(isBaaS?'BaaSにより認証・DB・リアルタイム機能を素早く実装可能':'カスタムビジネスロジックの柔軟な実装'):'Adopt **'+be+'** (architecture pattern: '+arch.pattern+').\n\nReasons:\n- '+(isBaaS?'BaaS enables fast implementation of auth, DB, and realtime':'Flexible custom business logic implementation');
  const beAlt=isBaaS?G?'- Node.js + Express（カスタムロジック重視の場合）\n- Node.js + NestJS（エンタープライズ規模の場合）\n- Python + FastAPI（AI機能が中心の場合）':'- Node.js + Express (custom logic focus)\n- Node.js + NestJS (enterprise scale)\n- Python + FastAPI (AI-centric)':G?'- Firebase/Supabase（BaaS、高速MVP構築）\n- Python + FastAPI（AI/ML統合重視）':'- Firebase/Supabase (BaaS, fast MVP)\n- Python + FastAPI (AI/ML integration)';
  const beConseq=G?'- '+(isBaaS?'認証・リアルタイム・ストレージが即座に利用可能':'カスタムAPIエンドポイントの完全制御が可能')+'\n- ORM: '+ormName+' との統合が必要':'- '+(isBaaS?'Auth, realtime, and storage available immediately':'Full control over custom API endpoints')+'\n- Integration with ORM: '+ormName+' required';

  // ADR-003: Database
  const adrDb=a.database||'PostgreSQL';
  const dbCtx=G?domainName+'ドメインのデータ特性（エンティティ: '+(a.data_entities||'User, Item')+'）に最適なデータベースを選定しました。':'Selected the optimal database for '+domainName+'-domain data characteristics (entities: '+(a.data_entities||'User, Item')+').';
  const isNoSQL=inc2(adrDb,'Firestore')||inc2(adrDb,'MongoDB');
  const dbDecision=G?'**'+adrDb+'** を採用します。\n\n選定理由:\n- '+(isNoSQL?'スキーマレスで柔軟なドキュメント構造が要件に合致':'ACID準拠のトランザクション整合性を確保')+'\n- '+(inc2(adrDb,'Neon')||inc2(adrDb,'Supabase')?'サーバーレス・スケーリングが自動化される':'マネージドサービスで運用負荷を軽減'):'Adopt **'+adrDb+'**.\n\nReasons:\n- '+(isNoSQL?'Schema-less flexible document structure fits requirements':'ACID-compliant transaction integrity ensured')+'\n- '+(inc2(adrDb,'Neon')||inc2(adrDb,'Supabase')?'Serverless scaling automated':'Managed service reduces operational overhead');
  const dbAlt=isNoSQL?G?'- PostgreSQL（リレーショナル・ACID準拠）\n- MySQL（広いホスティング互換性）':'- PostgreSQL (relational, ACID compliant)\n- MySQL (broad hosting compatibility)':G?'- MongoDB（スキーマレス・柔軟なドキュメント）\n- MySQL（幅広いホスティング対応）\n- SQLite（ローカル開発・小規模）':'- MongoDB (schema-less, flexible docs)\n- MySQL (broad hosting support)\n- SQLite (local dev, small scale)';
  const dbConseq=G?'- マイグレーション管理: '+ormName+' のマイグレーション機能を使用\n- '+(isNoSQL?'スキーマバリデーションはアプリ層で実施':'インデックス設計でクエリパフォーマンスを担保'):'- Migration management: use '+ormName+' migration features\n- '+(isNoSQL?'Schema validation handled at application layer':'Index design ensures query performance');

  // ADR-004: Authentication
  const authCtx=G?'セキュアなユーザー認証の実装方針を決定しました。'+(hasPay?'決済機能があるため認証セキュリティは特に重要です。':'')+(domainName==='health'||domainName==='fintech'||domainName==='legal'?'規制ドメインのため高セキュリティ認証が必要です。':''):'Defined the user authentication implementation approach. '+(hasPay?'Payment features make authentication security especially critical.':'')+(domainName==='health'||domainName==='fintech'||domainName==='legal'?'Regulated domain requires high-security authentication.':'');
  const authDecision=G?'**'+authName+'** を採用します。\n\n選定理由:\n- '+(inc2(authName,'Supabase')?'Supabase AuthはRLS・JWT・OAuth・MFAを統合提供':inc2(authName,'Firebase')?'Firebase AuthはGoogle/Apple/Emailをワンストップ提供':'カスタム要件に合わせた完全制御が可能'):'Adopt **'+authName+'**.\n\nReasons:\n- '+(inc2(authName,'Supabase')?'Supabase Auth provides integrated RLS, JWT, OAuth, and MFA':inc2(authName,'Firebase')?'Firebase Auth provides one-stop Google/Apple/Email':'Full control for custom requirements');
  const authAlt=G?'- '+(inc2(authName,'Supabase')?'Firebase Auth（Googleエコシステム統合）':'Supabase Auth（PostgreSQL統合が容易）')+'\n- Auth.js / NextAuth.js（Next.js特化）\n- Clerk（フルマネージド認証UI）':'- '+(inc2(authName,'Supabase')?'Firebase Auth (Google ecosystem integration)':'Supabase Auth (easy PostgreSQL integration)')+'\n- Auth.js / NextAuth.js (Next.js-specific)\n- Clerk (fully managed auth UI)';
  const authConseq=G?'- セッション管理: '+(isBaaS?'BaaS SDKが自動的にセッションを管理':'JWTのrefreshトークンローテーションを実装')+'\n- '+(isBaaS?'RLSポリシーとauth.uid()を連携させてデータアクセス制御':'カスタムミドルウェアでAPIルートを保護')+'\n- トークン保管: '+(isBaaS?'SDK管理（LocalStorageは使わないこと）':'Access TokenはメモリかHttpOnly Cookie推奨')+'\n- リスク: '+(auth.provider==='jwt'?'JWTは無効化困難（Redisブラックリスト等の対策を要検討）':auth.provider==='authjs'?'セッションDBが単一障害点（Redisセッションストア推奨）':'BaaSサービスキーをサーバーサイドのみで使用')+'\n- 詳細: docs/119_auth_architecture_guide.md 参照':'- Session management: '+(isBaaS?'BaaS SDK automatically manages sessions':'Implement JWT refresh token rotation')+'\n- '+(isBaaS?'Integrate RLS policies with auth.uid() for data access control':'Protect API routes with custom middleware')+'\n- Token storage: '+(isBaaS?'SDK-managed (avoid LocalStorage)':'Access Token in memory or HttpOnly Cookie')+'\n- Risk: '+(auth.provider==='jwt'?'JWT hard to invalidate (consider Redis blacklist)':auth.provider==='authjs'?'Session DB is SPOF (consider Redis session store)':'Use BaaS service keys server-side only')+'\n- Details: see docs/119_auth_architecture_guide.md';

  // ADR-005: Deployment
  const depCtx=G?'デプロイ戦略はチームのDevOps習熟度・コスト・スケーラビリティ要件に基づき決定しました。':'Deployment strategy decided based on team DevOps proficiency, cost, and scalability requirements.';
  const depDecision=G?'**'+deployName+'** を採用します。\n\n選定理由:\n- '+(inc2(deployName,'Vercel')?'ゼロコンフィグデプロイとEdge Networkによる高速配信':inc2(deployName,'Firebase')?'Firebase全サービスとの統一管理':inc2(deployName,'Railway')?'Dockerfile対応のフルスタックデプロイ':'コンテナベースの柔軟なデプロイ')+'':'Adopt **'+deployName+'**.\n\nReasons:\n- '+(inc2(deployName,'Vercel')?'Zero-config deployment and Edge Network fast delivery':inc2(deployName,'Firebase')?'Unified management with all Firebase services':inc2(deployName,'Railway')?'Full-stack deployment with Dockerfile support':'Flexible container-based deployment');
  const depAlt=G?'- '+(inc2(deployName,'Vercel')?'Railway（Python/フルスタック対応）':'Vercel（フロントエンド最適化）')+'\n- AWS / GCP / Azure（エンタープライズ・完全制御）\n- Fly.io（グローバルエッジ・コンテナ）':'- '+(inc2(deployName,'Vercel')?'Railway (Python/full-stack support)':'Vercel (frontend optimized)')+'\n- AWS / GCP / Azure (enterprise, full control)\n- Fly.io (global edge, containers)';
  const depConseq=G?'- CI/CD: .github/workflows/ci.yml で自動テスト・デプロイを設定済み\n- 環境変数管理: '+deployName+'の環境変数機能でシークレットを安全に管理':'- CI/CD: .github/workflows/ci.yml configured for automated test and deployment\n- Environment variable management: manage secrets safely via '+deployName+' env vars';

  const adrHead=G?'# '+pn+' — アーキテクチャ決定記録 (ADR)\n\n> **生成日**: '+adrDate+'  \n> **スタック**: '+fe+' + '+be+' + '+adrDb+' + '+deployName+'  \n> **ドメイン**: '+domainName+'\n\nこのドキュメントはウィザード入力から自動生成されたADR（Architecture Decision Record）集です。各決定の背景・理由・代替案を記録し、将来の意思決定に活用してください。\n\n---\n\n':'# '+pn+' — Architecture Decision Records (ADR)\n\n> **Generated**: '+adrDate+'  \n> **Stack**: '+fe+' + '+be+' + '+adrDb+' + '+deployName+'  \n> **Domain**: '+domainName+'\n\nAuto-generated ADRs from wizard inputs. Use to understand the context, rationale, and alternatives for each architectural decision.\n\n---\n\n';

  let adrDoc=adrHead;
  adrDoc+=mkAdr(1,G?'フロントエンドフレームワーク選定: '+fe:'Frontend Framework Selection: '+fe,G?'採択済み':'Accepted',feCtx,feDecision,feConseq,feAlt);
  adrDoc+=mkAdr(2,G?'バックエンドアーキテクチャ選定: '+be:'Backend Architecture Selection: '+be,G?'採択済み':'Accepted',beCtx,beDecision,beConseq,beAlt);
  adrDoc+=mkAdr(3,G?'データベース選定: '+adrDb:'Database Selection: '+adrDb,G?'採択済み':'Accepted',dbCtx,dbDecision,dbConseq,dbAlt);
  adrDoc+=mkAdr(4,G?'認証戦略: '+authName:'Authentication Strategy: '+authName,G?'採択済み':'Accepted',authCtx,authDecision,authConseq,authAlt);
  adrDoc+=mkAdr(5,G?'デプロイプラットフォーム: '+deployName:'Deployment Platform: '+deployName,G?'採択済み':'Accepted',depCtx,depDecision,depConseq,depAlt);

  if(ormName&&ormName!=='N/A'&&!isBaaS){
    const ormCtx=G?adrDb+'へのデータアクセス層をどう実装するか、型安全性・マイグレーション管理・クエリパフォーマンスを考慮して選定しました。':'Selected ORM considering type safety, migration management, and query performance for '+adrDb+' data access.';
    const ormDec=G?'**'+ormName+'** を採用します。\n\n選定理由:\n- '+(inc2(ormName,'Prisma')?'スキーマファーストで型安全・自動補完が強力':inc2(ormName,'Drizzle')?'軽量・型安全・SQLに近い記法':inc2(ormName,'TypeORM')?'デコレーターベースでNestJSと相性最良':inc2(ormName,'SQLAlchemy')?'Pythonエコシステムとの完全統合':'クエリビルダーとして型安全なSQL構築'):'Adopt **'+ormName+'**.\n\nReasons:\n- '+(inc2(ormName,'Prisma')?'Schema-first, strong type safety and auto-completion':inc2(ormName,'Drizzle')?'Lightweight, type-safe, SQL-like syntax':inc2(ormName,'TypeORM')?'Decorator-based, excellent NestJS compatibility':inc2(ormName,'SQLAlchemy')?'Full Python ecosystem integration':'Type-safe SQL construction as query builder');
    const ormAlt=G?'- '+(inc2(ormName,'Prisma')?'Drizzle ORM（より軽量・Edgeランタイム対応）':'Prisma（スキーマ自動生成・型安全）')+'\n- 生SQL（複雑なクエリの最適化が必要な場合）\n- Knex.js（低レベルクエリビルダー）':'- '+(inc2(ormName,'Prisma')?'Drizzle ORM (lighter, Edge runtime compatible)':'Prisma (schema auto-generation, type-safe)')+'\n- Raw SQL (when complex query optimization needed)\n- Knex.js (low-level query builder)';
    const ormConseq=G?'- マイグレーションファイルは `migrations/` ディレクトリで管理\n- N+1問題に注意: includeを使った事前読み込みを標準化':'- Migration files managed in `migrations/` directory\n- Watch for N+1: standardize eager loading with include';
    adrDoc+=mkAdr(6,G?'ORM選定: '+ormName:'ORM Selection: '+ormName,G?'採択済み':'Accepted',ormCtx,ormDec,ormConseq,ormAlt);
  }

  if(hasPay){
    const adrIdx=ormName&&ormName!=='N/A'&&!isBaaS?7:6;
    const payCtx=G?domainName+'ドメインでの決済機能実装にあたり、PCI-DSS準拠・グローバル対応・開発容易性を考慮して選定しました。':'Selected payment integration for '+domainName+'-domain considering PCI-DSS compliance, global support, and developer experience.';
    const payDec=G?'**'+(a.payment||'Stripe')+'** を採用します。\n\n選定理由:\n- '+(inc2(a.payment||'','Stripe')?'業界標準のPCI-DSS Level 1準拠・140+通貨対応':'マルチゲートウェイ対応で柔軟な決済フロー'):'Adopt **'+(a.payment||'Stripe')+'**.\n\nReasons:\n- '+(inc2(a.payment||'','Stripe')?'Industry-standard PCI-DSS Level 1 compliance, 140+ currencies':'Multi-gateway support for flexible payment flows');
    const payConseq=G?'- **Webhook処理必須**: `/api/webhook`エンドポイントで`payment_intent.succeeded`を処理\n- カード情報はアプリサーバーを経由させない（PCI-DSS要件）':'- **Webhook mandatory**: process `payment_intent.succeeded` at `/api/webhook` endpoint\n- Card data must not pass through app server (PCI-DSS requirement)';
    const payAlt=G?'- PAY.JP（日本市場特化）\n- Square（実店舗連携が必要な場合）\n- PayPal（グローバルユーザー基盤）':'- PAY.JP (Japan market-specific)\n- Square (physical store integration)\n- PayPal (global user base)';
    adrDoc+=mkAdr(adrIdx,G?'決済統合: '+(a.payment||'Stripe'):'Payment Integration: '+(a.payment||'Stripe'),G?'採択済み':'Accepted',payCtx,payDec,payConseq,payAlt);
  }

  // ADR-008: API Style
  (function(){
    var apiAdrIdx=(ormName&&ormName!=='N/A'&&!isBaaS?1:0)+(hasPay?1:0)+6;
    var _isGQLa=inc2(be,'GraphQL')||inc2(fe,'GraphQL');
    var _isGRPCa=inc2(be,'gRPC');
    var apiStyleName=isBaaS?'BaaS SDK':_isGQLa?'GraphQL':_isGRPCa?'gRPC':'RESTful API';
    var apiCtx=G?'クライアント-サーバー間の通信スタイルを、データ取得効率・キャッシュ戦略・ツールチェーン成熟度の観点で選定しました。':'Selected client-server communication style considering data fetching efficiency, caching strategy, and toolchain maturity.';
    var apiDec;
    if(isBaaS){apiDec=G?'**BaaS SDK** を採用します。\n\n選定理由:\n- '+be+'のSDKが認証・DB・リアルタイムを統合提供\n- REST API自前実装より開発速度が大幅に向上\n- クライアントから直接DBを操作でき中間層の実装コストを削減':'Adopt **BaaS SDK**.\n\nReasons:\n- '+be+' SDK provides integrated auth, DB, and realtime\n- Significantly faster than building REST APIs from scratch\n- Direct DB access from client reduces middleware implementation cost';}
    else if(_isGQLa){apiDec=G?'**GraphQL** を採用します。\n\n選定理由:\n- クライアントが必要フィールドのみを指定取得（Over-fetch解消）\n- 強力な型システムとイントロスペクション機能\n- 単一エンドポイントで複数リソースを一括取得':'Adopt **GraphQL**.\n\nReasons:\n- Client specifies only needed fields (eliminates over-fetching)\n- Strong type system with introspection\n- Single endpoint for multiple resources';}
    else if(_isGRPCa){apiDec=G?'**gRPC** を採用します。\n\n選定理由:\n- HTTP/2 + Protobufによる低レイテンシ通信\n- 双方向ストリーミングと多重化によるスループット最大化\n- 厳格なスキーマ定義による型安全なAPI契約':'Adopt **gRPC**.\n\nReasons:\n- Low latency via HTTP/2 + Protobuf\n- Maximum throughput with bidirectional streaming and multiplexing\n- Type-safe API contracts via strict schema definitions';}
    else{apiDec=G?'**RESTful API** を採用します。\n\n選定理由:\n- HTTPの標準セマンティクス（GET/POST/PUT/DELETE）を活用\n- ステートレスアーキテクチャによる水平スケールの容易さ\n- OpenAPI/SwaggerによるAPIドキュメントの自動生成':'Adopt **RESTful API**.\n\nReasons:\n- Leverages standard HTTP semantics (GET/POST/PUT/DELETE)\n- Stateless architecture enables easy horizontal scaling\n- Automatic API documentation via OpenAPI/Swagger';}
    var apiConseq=G?'- スタイル詳細比較: docs/120_system_design_guide.md §1 を参照\n- '+(apiStyleName==='GraphQL'?'N+1問題対策: DataLoaderを必ず導入すること':apiStyleName==='gRPC'?'ブラウザ対応: gRPC-Webゲートウェイが必要な場合があります':apiStyleName==='BaaS SDK'?'複雑ビジネスロジック: Edge Functionsで実装':'バージョニング: /api/v1/ プレフィックスを設計時から組み込む'):'- Style comparison: see docs/120_system_design_guide.md §1\n- '+(apiStyleName==='GraphQL'?'N+1 mitigation: Always use DataLoader':apiStyleName==='gRPC'?'Browser support: gRPC-Web gateway may be needed':apiStyleName==='BaaS SDK'?'Complex business logic: Implement in Edge Functions':'Versioning: Embed /api/v1/ prefix from design phase');
    var apiAlt=G?'- '+(apiStyleName==='RESTful API'?'GraphQL（データ取得が複雑な場合）\n- gRPC（マイクロサービス間通信の場合）\n- tRPC（TypeScript Full-stackの場合）':apiStyleName==='GraphQL'?'REST（シンプルなCRUD APIの場合）\n- tRPC（TypeScript Full-stackの場合）':apiStyleName==='gRPC'?'REST（クライアント互換性重視の場合）\n- GraphQL（フロントエンド主導のデータ取得の場合）':'Node.js + Express（カスタムロジック重視）\n- GraphQL（データ取得最適化が必要な場合）'):'- '+(apiStyleName==='RESTful API'?'GraphQL (complex data fetching)\n- gRPC (microservice-to-service)\n- tRPC (TypeScript full-stack)':apiStyleName==='GraphQL'?'REST (simple CRUD API)\n- tRPC (TypeScript full-stack)':apiStyleName==='gRPC'?'REST (client compatibility priority)\n- GraphQL (frontend-driven data fetching)':'Node.js + Express (custom logic focus)\n- GraphQL (data fetching optimization)');
    adrDoc+=mkAdr(apiAdrIdx,G?'APIスタイル: '+apiStyleName:'API Style: '+apiStyleName,G?'採択済み':'Accepted',apiCtx,apiDec,apiConseq,apiAlt);
  })();

  S.files['docs/82-2_architecture_decision_records.md']=adrDoc;

  // ── Cross-Pillar Dependency Map ──
  const cpDomain=domainName;
  const cpFe=fe;const cpBe=be;const cpDb=adrDb;const cpDeploy=deployName;
  const cpOrm=ormName;const cpAuth=authName;

  // Build pillar activation list based on answers
  const cpPillars=[
    {n:1, label:G?'SDD仕様書':'SDD Spec', file:'docs/51_specification.md', deps:[], always:true},
    {n:2, label:G?'タスク管理':'Task Plan', file:'.spec/tasks.md', deps:[1], always:true},
    {n:3, label:G?'テクノロジー':'Tech Stack', file:'docs/03_architecture.md', deps:[1], always:true},
    {n:4, label:G?'UI/UX設計':'UI/UX Design', file:'docs/05_ui_design.md', deps:[1,3], always:true},
    {n:5, label:G?'API設計':'API Design', file:'docs/21_api_overview.md', deps:[3], active:!isBaaS||inc2(cpFe,'Next')},
    {n:6, label:G?'DB設計':'DB Schema', file:'docs/31_db_design.md', deps:[3,5], always:true},
    {n:7, label:G?'ロードマップ':'Roadmap', file:'docs/roadmap/ROADMAP.md', deps:[1,2], always:true},
    {n:8, label:G?'認証・認可':'Auth & RBAC', file:'docs/43_security_checklist.md', deps:[3,6], active:!!(cpAuth&&cpAuth!=='なし')},
    {n:9, label:G?'決済':'Payment', file:'docs/payment_flow.md', deps:[5,8], active:hasPay},
    {n:10, label:G?'リバースフロー':'Reverse Flow', file:'docs/reverse_flow.md', deps:[1,7], always:true},
    {n:11, label:G?'エラー処理':'Error Handling', file:'docs/55_error_handling.md', deps:[5], always:true},
    {n:12, label:G?'国際化':'i18n/l10n', file:'docs/i18n.md', deps:[4], active:/i18n|国際化|多言語/i.test(a.mvp_features||'')},
    {n:13, label:G?'ビジネス戦略':'Business', file:'docs/41_business_model.md', deps:[1], active:hasPay||cpDomain==='saas'||cpDomain==='ec'},
    {n:14, label:G?'OpsDevOps':'Ops/DevOps', file:'docs/71_devops.md', deps:[3,7], always:true},
    {n:15, label:G?'将来設計':'Future Design', file:'docs/81_future_design.md', deps:[1,7,13], always:true},
    {n:16, label:G?'アーキテクチャ品質':'Arch Quality', file:'docs/82_architecture_integrity_check.md', deps:[3,5,6,8], always:true},
    {n:17, label:G?'Promptゲノム':'Prompt Genome', file:'AI_BRIEF.md', deps:[1,3], always:true},
    {n:18, label:G?'Promptオペレーション':'Prompt Ops', file:'.claude/CLAUDE.md', deps:[17], always:true},
    {n:19, label:G?'エンタープライズ':'Enterprise', file:'docs/enterprise_overview.md', deps:[8,13], active:cpDomain==='saas'||cpDomain==='fintech'||cpDomain==='health'||cpDomain==='hr'||cpDomain==='legal'},
    {n:20, label:'CI/CD', file:'.github/workflows/ci.yml', deps:[14], always:true},
    {n:21, label:G?'API品質':'API Quality', file:'docs/22_api_versioning.md', deps:[5], active:!isBaaS},
    {n:22, label:G?'データベース最適化':'DB Optimization', file:'docs/33_migration_strategy.md', deps:[6], always:true},
    {n:23, label:G?'テスト戦略':'Testing', file:'docs/91_test_strategy.md', deps:[5,6], always:true},
    {n:24, label:G?'AI安全性':'AI Safety', file:'docs/ai_safety.md', deps:[3,8], active:!!(a.ai_auto&&!/なし|None|none/.test(a.ai_auto))},
    {n:25, label:G?'パフォーマンス':'Performance', file:'docs/94_performance_budget.md', deps:[3,22,23], always:true},
  ];

  const activePillars=cpPillars.filter(p=>p.always||p.active);
  const activeNums=new Set(activePillars.map(p=>p.n));

  // Mermaid graph
  let mmdLines=['graph TD'];
  activePillars.forEach(p=>{
    mmdLines.push('  P'+p.n+'["P'+p.n+': '+p.label+'"]');
  });
  mmdLines.push('');
  activePillars.forEach(p=>{
    p.deps.filter(d=>activeNums.has(d)).forEach(d=>{
      mmdLines.push('  P'+d+' --> P'+p.n);
    });
  });
  // Style critical path
  mmdLines.push('');
  mmdLines.push('  style P1 fill:#4f46e5,color:#fff');
  mmdLines.push('  style P3 fill:#4f46e5,color:#fff');
  mmdLines.push('  style P6 fill:#4f46e5,color:#fff');
  if(activeNums.has(8)) mmdLines.push('  style P8 fill:#dc2626,color:#fff');
  if(activeNums.has(16)) mmdLines.push('  style P16 fill:#16a34a,color:#fff');
  if(activeNums.has(20)) mmdLines.push('  style P20 fill:#ca8a04,color:#fff');

  // Table of active pillars with key outputs
  const tableRows=activePillars.map(p=>'| P'+p.n+' | '+p.label+' | `'+p.file+'` | '+(p.deps.filter(d=>activeNums.has(d)).map(d=>'P'+d).join(', ')||'—')+' |').join('\n');

  // Domain-specific integration notes
  const domainNotes={
    fintech:G?'- P8（認証）とP22（DB最適化）はAudit Logと統合必須\n- P9（決済）はP8なしに実装不可（PCI-DSS要件）\n- P19（エンタープライズ）でSOC2/GDPR対応文書を生成':'- P8 (Auth) and P22 (DB) must integrate with Audit Log\n- P9 (Payment) cannot be implemented without P8 (PCI-DSS)\n- P19 (Enterprise) generates SOC2/GDPR compliance docs',
    health:G?'- P8（認証）はMFA必須（HIPAA要件）\n- P22（DB最適化）はPHIの暗号化・論理削除ポリシーを含む\n- P24（AI安全性）は医療AIガードレールを生成':'- P8 (Auth) requires MFA (HIPAA requirement)\n- P22 (DB) includes PHI encryption and logical delete policies\n- P24 (AI Safety) generates medical AI guardrails',
    ec:G?'- P9（決済）はP6（DB設計）のOrderスキーマと密接に連携\n- P13（ビジネス戦略）でLTV/CAC分析フレームワークを生成\n- P4（UI/UX）はショッピングカートUXフローを含む':'- P9 (Payment) tightly integrates with P6 (DB) Order schema\n- P13 (Business) generates LTV/CAC analysis framework\n- P4 (UI/UX) includes shopping cart UX flows',
    saas:G?'- P19（エンタープライズ）でマルチテナントアーキテクチャを設計\n- P8（認証）はRBACとorganizationスコープを含む\n- P13（ビジネス戦略）でSaaSメトリクス（MRR/ARR/churn）を設計':'- P19 (Enterprise) designs multi-tenant architecture\n- P8 (Auth) includes RBAC and organization scope\n- P13 (Business) designs SaaS metrics (MRR/ARR/churn)',
    _default:G?'- P1（SDD）→P3（技術スタック）→P6（DB）の順序が基本依存チェーン\n- P16（アーキテクチャ品質）は全技術選定の整合性スコアを算出\n- P20（CI/CD）は全ピラーの出力をパイプラインに統合':'- P1 (SDD) → P3 (Tech) → P6 (DB) is the core dependency chain\n- P16 (Arch Quality) calculates consistency score across all technical choices\n- P20 (CI/CD) integrates all pillar outputs into the pipeline',
  };
  const domNote=(domainNotes[cpDomain]||domainNotes['_default']);

  S.files['docs/00_pillar_dependency_map.md']=
    '# '+(G?'ピラー依存マップ':'Pillar Dependency Map')+' — '+pn+'\n\n'
    +'> **'+( G?'生成日':'Generated')+'**: '+adrDate+'  \n'
    +'> **'+(G?'ドメイン':'Domain')+'**: '+cpDomain+' | **Stack**: '+cpFe+' + '+cpBe+' + '+cpDb+'\n\n'
    +(G?'このドキュメントは28ピラー間の依存関係と生成順序を示します。実装前に依存ピラーが完了していることを確認してください。\n\n':'This document shows dependencies and generation order across 28 pillars. Verify dependent pillars are complete before implementation.\n\n')
    +'## '+(G?'依存グラフ (Mermaid)':'Dependency Graph (Mermaid)')+'\n\n'
    +'```mermaid\n'+mmdLines.join('\n')+'\n```\n\n'
    +'## '+(G?'アクティブピラー一覧':'Active Pillar List')+'\n\n'
    +'| Pillar | '+(G?'名称':'Name')+' | '+(G?'主要出力ファイル':'Key Output File')+' | '+(G?'依存ピラー':'Depends On')+' |\n'
    +'|--------|'+(G?'------':'------')+'|'+(G?'-------------------':'-------------------')+'|'+(G?'-------------':'-------------')+'|\n'
    +tableRows+'\n\n'
    +'## '+(G?'ドメイン固有の統合注意点':'Domain-Specific Integration Notes')+'\n\n'
    +domNote+'\n\n'
    +'## '+(G?'実装推奨順序':'Recommended Implementation Order')+'\n\n'
    +(G?'1. **P1-P3**: 仕様・タスク・アーキテクチャを確定（変更コスト最大）\n2. **P6**: DBスキーマ確定（後変更はマイグレーション必要）\n3. **P8**: 認証実装（全APIが依存）\n4. **P5/P21**: API設計・実装\n5. **P14/P20**: DevOps・CI/CD整備\n6. **P23/P25**: テスト・パフォーマンス検証':'1. **P1-P3**: Finalize spec, tasks, architecture (highest change cost)\n2. **P6**: Finalize DB schema (later changes require migrations)\n3. **P8**: Implement auth (all APIs depend on this)\n4. **P5/P21**: API design and implementation\n5. **P14/P20**: DevOps and CI/CD setup\n6. **P23/P25**: Testing and performance verification');

  // F: Scaffolding recipe
  genScaffolding(a,pn,G);
  // H: DevForge Guide (effect, usage, limitations)
  genDevForgeGuide(a,pn,G);
}

// F: Scaffolding recipe generation — scaffolding/SETUP.md
function genScaffolding(a,pn,G){
  const steps=typeof buildScaffoldingSteps==='function'?buildScaffoldingSteps(a):[];
  if(!steps.length)return;
  let doc='# '+pn+(G?' — スキャフォールディングレシピ':' — Scaffolding Recipe')+'\n';
  doc+='> '+(G?'このファイルはAIツールで開発を開始するためのCLIコマンド集です。上から順番に実行してください。':'This file contains CLI commands to start development with your AI tool. Execute in order.')+'\n\n';
  doc+='> **Stack**: '+(a.frontend||'')+(a.backend?' + '+a.backend:'')+(a.database?' + '+a.database:'')+'\n\n';
  doc+='---\n\n';
  steps.forEach(function(s,i){
    doc+='## Step '+(i+1)+': '+(G?s.title_ja:s.title_en)+'\n\n';
    doc+='```bash\n';
    s.cmds.forEach(function(cmd){doc+=cmd+'\n';});
    doc+='```\n\n';
    if(G&&s.note_ja)doc+='> '+s.note_ja+'\n\n';
    else if(!G&&s.note_en)doc+='> '+s.note_en+'\n\n';
  });
  doc+='---\n\n';
  doc+='## '+(G?'次のステップ: AIツールで開発開始':'Next: Start Development with AI Tool')+'\n\n';
  doc+=(G?'1. このプロジェクトフォルダをCursor / Windsurf / Claude Code で開く\n2. チャットに `CLAUDE.md を読んで` と入力\n3. チャットに `tasks.mdの最優先タスクを実装して` と入力\n\n> **注意**: このファイルのコマンドはあくまでセットアップの出発点です。\n> 実際の実装はAIツールと.spec/specification.mdを組み合わせて行ってください。':
    '1. Open this project folder in Cursor / Windsurf / Claude Code\n2. Type in chat: `Read CLAUDE.md`\n3. Type in chat: `Implement the top-priority task from tasks.md`\n\n> **Note**: These commands are a starting point for setup.\n> Actual implementation should combine your AI tool with .spec/specification.md.\n');
  S.files['scaffolding/SETUP.md']=doc;
}

// H: DevForge Guide — docs/00_devforge_guide.md
function genDevForgeGuide(a,pn,G){
  const fe=a.frontend||'React';const be=a.backend||'Node.js';const db=a.database||'PostgreSQL';
  const fc=Object.keys(S.files).length;
  let doc='# '+(G?'DevForge v9 ガイド — 生成物の効果・最適な使い方・注意点':'DevForge v9 Guide — Effect, Optimal Usage & Limitations')+'\n\n';
  doc+='> '+(G?`このドキュメントは **${pn}** の生成物について、効果・最適な使用方法・注意点・不可能なことを説明します。`:`This document explains the effect, optimal usage, limitations, and impossible things about the generated output for **${pn}**.`)+'\n\n';

  // Section 1: What was generated
  doc+='## 1. '+(G?'生成物の概要':'What Was Generated')+'\n\n';
  doc+=(G?`DevForge v9 は 25問のウィザードから **${fc}ファイル** の「AI開発OS」を生成しました。`:
    `DevForge v9 generated **${fc} files** of an "AI Development OS" from 25 wizard questions.`)+'\n\n';
  doc+=(G?'生成物は3つの層で構成されています:':'The output is organized in 3 layers:')+'\n\n';
  doc+='| '+(G?'層':'Layer')+' | '+(G?'ファイル例':'Key Files')+' | '+(G?'効果':'Effect')+'|\n';
  doc+='|------|----------|------|\n';
  doc+='| **AI Context** | CLAUDE.md, .cursorrules, skills/ | '+(G?'AIツールがプロジェクト全体を理解し、一貫したコードを生成':'AI tools understand the full project and generate consistent code')+'|\n';
  doc+='| **Specification** | .spec/, docs/ (108文書) | '+(G?'アーキテクチャ・セキュリティ・テスト・運用の全設計を網羅':'Full design coverage for architecture, security, testing, operations')+'|\n';
  doc+='| **Infrastructure** | .devcontainer/, .github/ | '+(G?'開発環境とCI/CDを即座に構築':'Development environment and CI/CD ready to use')+'|\n\n';

  // Section 2: Optimal usage
  doc+='## 2. '+(G?'最適な使用方法':'Optimal Usage')+'\n\n';
  doc+=(G?'### AI開発ループ\n\n1. **ZIPをダウンロード**してCursor / Windsurf / Claude Codeで開く\n2. **CLAUDE.md を読ませる**: `@CLAUDE.md` または `Read CLAUDE.md and understand the project`\n3. **tasks.md の最優先タスクを実装させる**: `tasks.mdの最優先タスクを実装してください`\n4. 実装後、**compat警告**を確認（wizard画面 → Compatタブ）\n5. **AI Launcher**でドメイン固有プロンプトを活用（pillar 7タブ）\n':
    '### AI Development Loop\n\n1. **Download ZIP** and open in Cursor / Windsurf / Claude Code\n2. **Feed CLAUDE.md**: `@CLAUDE.md` or `Read CLAUDE.md and understand the project`\n3. **Implement from tasks.md**: `Implement the top-priority task from tasks.md`\n4. After implementation, **check compat warnings** (wizard screen → Compat tab)\n5. **Use AI Launcher** for domain-specific prompts (pillar 7 tab)\n')+'\n';

  doc+=(G?'### ロール別の読み方\n\n- **開発者**: CLAUDE.md → .spec/ → docs/03_architecture.md → scaffolding/SETUP.md\n- **PM**: docs/01_project_overview.md → docs/02_requirements.md → docs/107_project_governance.md\n- **QA**: docs/108_uat_acceptance.md → docs/91_test_strategy.md → docs/22_prompt_playbook.md\n- **アーキテクト**: docs/03_architecture.md → docs/82_architecture_integrity_check.md → .spec/technical-plan.md\n':
    '### Reading Guide by Role\n\n- **Developer**: CLAUDE.md → .spec/ → docs/03_architecture.md → scaffolding/SETUP.md\n- **PM**: docs/01_project_overview.md → docs/02_requirements.md → docs/107_project_governance.md\n- **QA**: docs/108_uat_acceptance.md → docs/91_test_strategy.md → docs/22_prompt_playbook.md\n- **Architect**: docs/03_architecture.md → docs/82_architecture_integrity_check.md → .spec/technical-plan.md\n')+'\n';

  // Section 3: Warnings / caveats
  doc+='## 3. '+(G?'注意点':'Important Caveats')+'\n\n';
  doc+=(G?'- **localStorage は揮発性**: ブラウザのデータは消える場合があります。必ずZIPエクスポートしてから閉じてください\n- **再生成すると上書き**: ウィザード回答を変更して再生成すると、手動編集ファイルが上書きされます（編集済みファイルは●マークで識別可能）\n- **CDN依存**: JSZip / mermaid.js はCDNから読み込みます。オフライン環境ではZIPのかわりに結合MDファイルがダウンロードされます\n- **スタック互換性**: compat警告（217ルール）を無視すると、生成ドキュメントと実装が乖離する可能性があります\n- **バージョン固定なし**: 生成されるpackage.jsonは最新バージョンを使用します。本番環境では`package-lock.json`で固定してください\n':
    '- **localStorage is volatile**: Browser data can be lost. Always export ZIP before closing\n- **Regeneration overwrites**: Changing wizard answers and regenerating will overwrite manually edited files (edited files are marked with ●)\n- **CDN dependency**: JSZip / mermaid.js are loaded from CDN. Offline: combined .md fallback is used instead of ZIP\n- **Stack compatibility**: Ignoring compat warnings (217 rules) can cause misalignment between docs and implementation\n- **No version pinning**: Generated package.json uses latest versions. Pin with package-lock.json in production\n')+'\n';

  // Section 4: Limitations
  doc+='## 4. '+(G?'このアプリでは不可能なこと':'What This App Cannot Do')+'\n\n';
  doc+=(G?'- ❌ **実行可能なソースコード** (TypeScript / Python等) の生成 → AIツール (Cursor, Windsurf等) を使用してください\n- ❌ **外部サービスとの連携** (API呼出、DB接続、デプロイ実行)\n- ❌ **チーム同時編集** / リアルタイムコラボレーション\n- ❌ **Go / Rust / Java / .NET スタック**の深い最適化（JS/TSエコシステム中心）\n- ❌ **カスタムビジネスロジック**の自動推論（テンプレートベース。必ず仕様書を見直してください）\n- ❌ **5,000KBを超えるコンテンツ**の追加（ビルドサイズ制限）\n- ❌ **マルチプロジェクト管理** / リアルタイムDB同期\n':
    '- ❌ **Executable source code** (TypeScript / Python etc.) → Use AI tools (Cursor, Windsurf etc.)\n- ❌ **External service integration** (API calls, DB connections, deployment execution)\n- ❌ **Real-time team collaboration** / multi-user editing\n- ❌ **Deep optimization** for Go / Rust / Java / .NET stacks (JS/TS ecosystem focused)\n- ❌ **Custom business logic** auto-inference (template-based — always review specifications)\n- ❌ **Content beyond 5,000KB** (build size limit)\n- ❌ **Multi-project management** / real-time database sync\n')+'\n';

  // Section 5: Tool positioning
  doc+='## 5. '+(G?'他ツールとの位置づけ':'Tool Positioning')+'\n\n';
  doc+=(G?'DevForge v9 は **上流仕様エンジン** です。Cursor / Windsurf / Claude Code 等の **下流コード生成ツール** の入力を最適化します。\n\n':
    'DevForge v9 is an **upstream specification engine**. It optimizes input for downstream code generation tools like Cursor / Windsurf / Claude Code.\n\n');
  doc+='```\n';
  doc+=(G?'[DevForge v9] ──仕様+AIコンテキスト──→ [Cursor/Windsurf/Claude Code] ──実装──→ [動くコード]\n  ↑ここが価値                                      ↑ここで実コード生成':
    '[DevForge v9] ──specs+AI context──→ [Cursor/Windsurf/Claude Code] ──implement──→ [working code]\n  ↑Value is here                          ↑Real code is generated here')+'\n';
  doc+='```\n\n';
  doc+=(G?'**使い方のコツ**: AIツールに `CLAUDE.md を読んで、tasks.md の最優先タスクを実装して` と伝えると、アーキテクチャ整合性・セキュリティ準拠・ドメイン適応済みのコードが生成されます。':
    '**Key tip**: Tell your AI tool: `Read CLAUDE.md, then implement the top-priority task from tasks.md` — this generates architecture-consistent, security-compliant, domain-adapted code.')+'\n\n';

  // Section 6: ROI calculation
  doc+='## 6. '+(G?'工数削減効果の試算':'Estimated Time Savings (ROI)')+'\n\n';
  doc+=(G?'> **前提**: 設計フェーズ工数の業界標準値。実際の効果は ±30% 程度の誤差があります。\n\n':
    '> **Assumptions**: Industry-standard design phase work hours. Actual savings may vary ±30%.\n\n');

  doc+='### '+(G?'設計工数の比較':'Design Work Comparison')+'\n\n';
  doc+='| '+(G?'項目':'Item')+' | '+(G?'手動作成':'Manual')+' | DevForge v9 | '+(G?'削減率':'Savings')+'|\n';
  doc+='|------|--------|------------|--------|\n';
  doc+='| '+(G?'プロジェクト概要・要件定義':'Project overview + requirements')+'| 8h | 0h | 100% |\n';
  doc+='| '+(G?'アーキテクチャ設計書':'Architecture design')+'| 16h | 0h | 100% |\n';
  doc+='| '+(G?'ER図・DB設計書':'ER diagram + DB design')+'| 12h | 0h | 100% |\n';
  doc+='| '+(G?'API仕様書（OpenAPI含む）':'API spec (incl. OpenAPI)')+'| 16h | 0h | 100% |\n';
  doc+='| '+(G?'セキュリティ設計（OWASP監査）':'Security design (OWASP audit)')+'| 12h | 0h | 100% |\n';
  doc+='| '+(G?'テスト計画・UATシナリオ':'Test plan + UAT scenarios')+'| 8h | 0h | 100% |\n';
  doc+='| '+(G?'CI/CD・インフラ設計':'CI/CD + infra design')+'| 8h | 0h | 100% |\n';
  doc+='| '+(G?'AIツール設定ファイル7種':'AI tool configs (7 files)')+'| 4h | 0h | 100% |\n';
  doc+='| **'+(G?'合計 (中規模PJ目安)':'Total (mid-size project)')+'** | **84h** | **~1h** | **98.8%** |\n\n';

  doc+='### '+(G?'AI開発品質向上効果（推定）':'AI Development Quality Improvement (Estimated)')+'\n\n';
  doc+='| '+(G?'条件':'Condition')+' | '+(G?'設計整合率':'Alignment rate')+'|\n';
  doc+='|------|------|\n';
  doc+='| '+(G?'AIツール単体（仕様書なし）':'AI tool alone (no spec)')+'| 60–70% |\n';
  doc+='| DevForge v9 '+(G?'仕様書投入後':'spec applied')+'| 85–95% |\n';
  doc+='| '+(G?'手戻り削減（中規模10PJ/年）':'Rework reduction (10 PJ/year)')+'| ~750h |\n\n';

  doc+='### '+(G?'年間効果試算（10プロジェクト利用時）':'Annual ROI (10 projects/year)')+'\n\n';
  doc+='| '+(G?'シナリオ':'Scenario')+' | '+(G?'設計工数削減':'Design savings')+' | '+(G?'手戻り削減':'Rework savings')+' | '+(G?'合計削減':'Total')+'|\n';
  doc+='|------|--------|--------|------|\n';
  doc+='| '+(G?'保守':'Conservative')+' | 240h | 300h | **540h** |\n';
  doc+='| '+(G?'標準':'Standard')+' | 840h | 750h | **1,590h** |\n';
  doc+='| '+(G?'強気':'Optimistic')+' | 1,680h | 1,400h | **3,080h** |\n\n';

  doc+=(G?'> 💡 **DevForge v9 は無料ツールです。** 導入コストはゼロ。1プロジェクト利用するだけで即時回収。\n\n':
    '> 💡 **DevForge v9 is free.** Zero adoption cost — ROI is immediate from the first project.\n\n');

  doc+='---\n\n';
  doc+='> '+(G?'Generated by DevForge v9 — © 2026 Engineering no Tane Committee':'Generated by DevForge v9 — © 2026 Engineering no Tane Committee')+'\n';
  S.files['docs/00_devforge_guide.md']=doc;
}

function genSeedData(a,pn,G){
  const stripPri=s=>(s||'').replace(/\[P[0-2]\]\s*/g,'');
  const entities=(stripPri(a.data_entities)||'User,Item').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
  const ROWS=5;
  const now=new Date();

  // Sample value generators per type
  function sampleVal(col,type,row){
    const c=col.toLowerCase();const t=(type||'').toUpperCase();
    if(t.includes('UUID'))return '00000000-0000-0000-0000-00000000000'+(row+1);
    if(t.includes('BOOLEAN'))return row%2===0?'true':'false';
    if(t.includes('TIMESTAMP')||t.includes('DATETIME')){const d=new Date(now-row*86400000);return d.toISOString();}
    if(t.includes('DATE')){const d=new Date(now-row*86400000);return d.toISOString().split('T')[0];}
    if(t.includes('INT')){
      if(/price|amount|cost|fee|total/i.test(c))return String((row+1)*1000);
      if(/count|num|qty|quantity/i.test(c))return String(row+1);
      if(/age/i.test(c))return String(20+row*5);
      if(/order|sort|rank/i.test(c))return String(row+1);
      return String(row+1);
    }
    if(t.includes('DECIMAL')||t.includes('NUMERIC')||t.includes('FLOAT')){
      if(/price|amount|cost|fee/i.test(c))return ((row+1)*9.99).toFixed(2);
      if(/lat/i.test(c))return (35.68+(row*0.01)).toFixed(6);
      if(/lng|lon/i.test(c))return (139.69+(row*0.01)).toFixed(6);
      return ((row+1)*1.5).toFixed(2);
    }
    if(t.includes('JSONB')||t.includes('JSON'))return '{}';
    // VARCHAR/TEXT — generate meaningful sample based on column name
    if(/email/i.test(c))return 'user'+(row+1)+'@example.com';
    if(/name/i.test(c)&&/first/i.test(c))return ['Taro','Hanako','Jiro','Yuki','Sota'][row];
    if(/name/i.test(c)&&/last/i.test(c))return ['Yamada','Tanaka','Suzuki','Ito','Kato'][row];
    if(/name/i.test(c)&&!/last|first/i.test(c))return (G?['山田太郎','田中花子','鈴木二郎','伊藤雪','加藤蒼太']:['Alice Johnson','Bob Smith','Carol Davis','Dave Brown','Eve Wilson'])[row];
    if(/title/i.test(c))return (G?'サンプルタイトル ':'Sample Title ')+(row+1);
    if(/desc|summary|body|content|message/i.test(c))return (G?'サンプル説明文 '+(row+1):'Sample description '+(row+1));
    if(/url|link|href/i.test(c))return 'https://example.com/item'+(row+1);
    if(/slug/i.test(c))return 'sample-item-'+(row+1);
    if(/code/i.test(c))return 'CODE'+(String(row+1).padStart(4,'0'));
    if(/phone|tel/i.test(c))return '090-0000-000'+(row+1);
    if(/address/i.test(c))return (G?'東京都渋谷区':'123 Main St')+(row+1);
    if(/status/i.test(c))return ['active','pending','inactive','active','pending'][row];
    if(/type|kind/i.test(c))return ['type_a','type_b','type_c','type_a','type_b'][row];
    if(/role/i.test(c))return ['user','admin','user','user','moderator'][row];
    if(/color/i.test(c))return ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7'][row];
    if(/pass|password|hash/i.test(c))return '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    if(/token/i.test(c))return 'tok_'+'x'.repeat(20)+(row+1);
    if(/ip/i.test(c))return '192.168.1.'+(row+10);
    return 'sample_'+col+'_'+(row+1);
  }

  const seedJson={};
  let sqlLines='-- '+pn+' seed data\n-- Generated by DevForge v9\n\n';

  entities.forEach(entityName=>{
    const safe=entityName.replace(/[^A-Za-z0-9_]/g,'');
    if(!safe)return;
    const tableName=safe.charAt(0).toLowerCase()+safe.slice(1).replace(/[A-Z]/g,c=>'_'+c.toLowerCase())+'s';
    const cols=getEntityColumns(entityName,G,entities);
    if(!cols.length)return;

    const rows=[];
    for(let r=0;r<ROWS;r++){
      const row={id:'00000000-0000-0000-000'+(entities.indexOf(entityName)+1)+'-00000000000'+(r+1)};
      cols.forEach(c=>{
        const cname=c.col.replace(/[^A-Za-z0-9_]/g,'');
        if(!cname||cname==='id')return;
        row[cname]=sampleVal(cname,c.type,r);
      });
      row.created_at=new Date(now-(r+1)*3600000).toISOString();
      row.updated_at=new Date(now-r*3600000).toISOString();
      rows.push(row);
    }
    seedJson[tableName]=rows;

    // SQL INSERT statements
    const colNames=Object.keys(rows[0]);
    sqlLines+='INSERT INTO '+tableName+' ('+colNames.join(', ')+') VALUES\n';
    sqlLines+=rows.map(row=>'  ('+colNames.map(k=>{
      const v=row[k];
      if(v==='true'||v==='false')return v;
      if(/^\d+$/.test(v))return v;
      if(/^\d+\.\d+$/.test(v))return v;
      if(v==='{}'||v==='null')return v;
      return "'"+v.replace(/'/g,"''")+"'";
    }).join(', ')+')').join(',\n');
    sqlLines+=';\n\n';
  });

  const jsonStr=JSON.stringify(seedJson,null,2);
  S.files['db/seed.json']=jsonStr;
  S.files['db/seed.sql']=sqlLines;
}

function genOpenAPISpec(a,pn,G){
  const arch=resolveArch(a);
  const isBaasMode=arch.isBaaS;
  const date=new Date().toISOString().split('T')[0];
  const be=a.backend||'Node.js';
  const deploy=a.deploy||'Vercel';
  const stripPri=s=>(s||'').replace(/\[P[0-2]\]\s*/g,'');
  const entities=(stripPri(a.data_entities)||'User,Item').split(/[,、]\s*/).map(e=>e.trim()).filter(Boolean);
  const features=(stripPri(a.mvp_features)||(G?'CRUD操作':'CRUD')).split(', ').filter(Boolean);
  const version='1.0.0';

  // SQL type → OpenAPI type mapping
  function sqlToOAPIType(sqlType){
    const t=sqlType.toUpperCase();
    if(t.includes('VARCHAR')||t.includes('TEXT')||t.includes('CHAR'))return{type:'string'};
    if(t.includes('INT'))return{type:'integer',format:'int64'};
    if(t.includes('DECIMAL')||t.includes('NUMERIC')||t.includes('FLOAT')||t.includes('REAL'))return{type:'number',format:'float'};
    if(t.includes('BOOLEAN'))return{type:'boolean'};
    if(t.includes('TIMESTAMP')||t.includes('DATETIME'))return{type:'string',format:'date-time'};
    if(t.includes('DATE'))return{type:'string',format:'date'};
    if(t.includes('TIME'))return{type:'string',format:'time'};
    if(t.includes('UUID'))return{type:'string',format:'uuid'};
    if(t.includes('JSONB')||t.includes('JSON'))return{type:'object'};
    return{type:'string'};
  }

  // Indent helper
  function ind(n,s){return ' '.repeat(n)+s;}

  // Build schemas section
  function buildSchemas(){
    let out='  schemas:\n';
    entities.forEach(entityName=>{
      const safe=entityName.replace(/[^A-Za-z0-9_]/g,'');
      if(!safe)return;
      out+=ind(4,safe+':\n');
      out+=ind(6,'type: object\n');
      out+=ind(6,'properties:\n');
      out+=ind(8,'id:\n');
      out+=ind(10,'type: string\n');
      out+=ind(10,'format: uuid\n');
      out+=ind(10,'readOnly: true\n');
      const cols=getEntityColumns(entityName,G,entities);
      cols.forEach(c=>{
        const cname=c.col.replace(/[^A-Za-z0-9_]/g,'');
        if(!cname||cname==='id')return;
        const oapi=sqlToOAPIType(c.type||'VARCHAR');
        out+=ind(8,cname+':\n');
        out+=ind(10,'type: '+oapi.type+'\n');
        if(oapi.format)out+=ind(10,'format: '+oapi.format+'\n');
        if(c.constraint&&c.constraint.includes('NOT NULL')&&!c.constraint.includes('FK'))out+=ind(10,'# required\n');
        if(c.constraint&&c.constraint.includes('FK')){out+=ind(10,'description: '+(G?'外部キー ref ':'Foreign key ref ')+c.constraint.replace(/FK\s*/,'').split(' ')[0]+'\n');}
      });
      out+=ind(8,'createdAt:\n');
      out+=ind(10,'type: string\n');
      out+=ind(10,'format: date-time\n');
      out+=ind(10,'readOnly: true\n');
      out+=ind(8,'updatedAt:\n');
      out+=ind(10,'type: string\n');
      out+=ind(10,'format: date-time\n');
      out+=ind(10,'readOnly: true\n');
      // required list — cols with NOT NULL excluding FK
      const reqCols=['id'];
      cols.forEach(c=>{if(c.constraint&&c.constraint.includes('NOT NULL')&&!c.constraint.includes('FK'))reqCols.push(c.col.replace(/[^A-Za-z0-9_]/g,''));});
      if(reqCols.length){
        out+=ind(6,'required:\n');
        reqCols.forEach(r=>{if(r)out+=ind(8,'- '+r+'\n');});
      }
    });
    // Error schema
    out+=ind(4,'Error:\n');
    out+=ind(6,'type: object\n');
    out+=ind(6,'properties:\n');
    out+=ind(8,'message:\n');
    out+=ind(10,'type: string\n');
    out+=ind(8,'code:\n');
    out+=ind(10,'type: string\n');
    out+=ind(6,'required:\n');
    out+=ind(8,'- message\n');
    return out;
  }

  // Build paths section for non-BaaS
  function buildPaths(){
    let out='paths:\n';
    entities.forEach(entityName=>{
      const safe=entityName.replace(/[^A-Za-z0-9_]/g,'');
      if(!safe)return;
      const pathBase='/'+safe.charAt(0).toLowerCase()+safe.slice(1)+'s';
      const tag=safe;
      const nameLower=safe.charAt(0).toLowerCase()+safe.slice(1);
      const hasAuth=features.some(f=>/auth|認証|login|ログイン/i.test(f))||(a.auth&&!/なし|None/i.test(a.auth));

      // GET list
      out+=ind(2,pathBase+':\n');
      out+=ind(4,'get:\n');
      out+=ind(6,'summary: '+(G?tag+'一覧取得':'List '+tag+'s')+'\n');
      out+=ind(6,'operationId: list'+tag+'s\n');
      out+=ind(6,'tags:\n');
      out+=ind(8,'- '+tag+'\n');
      if(hasAuth){out+=ind(6,'security:\n');out+=ind(8,'- bearerAuth: []\n');}
      out+=ind(6,'parameters:\n');
      out+=ind(8,'- name: cursor\n');
      out+=ind(10,'in: query\n');
      out+=ind(10,'description: '+(G?'前ページの末尾カーソル（初回は省略）':'End cursor from previous page (omit for first page)')+'\n');
      out+=ind(10,'schema:\n');
      out+=ind(12,'type: string\n');
      out+=ind(8,'- name: limit\n');
      out+=ind(10,'in: query\n');
      out+=ind(10,'schema:\n');
      out+=ind(12,'type: integer\n');
      out+=ind(12,'default: 20\n');
      out+=ind(12,'maximum: 100\n');
      out+=ind(6,'responses:\n');
      out+=ind(8,"'200':\n");
      out+=ind(10,'description: '+(G?'成功':'Success')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'type: object\n');
      out+=ind(16,'properties:\n');
      out+=ind(18,'data:\n');
      out+=ind(20,'type: array\n');
      out+=ind(20,'items:\n');
      out+=ind(22,'$ref: \'#/components/schemas/'+tag+'\'\n');
      out+=ind(18,'cursor:\n');
      out+=ind(20,'type: string\n');
      out+=ind(20,'nullable: true\n');
      out+=ind(20,'description: '+(G?'次ページ取得用カーソル（nullで最終ページ）':'Cursor for next page (null means last page)')+'\n');
      out+=ind(18,'hasNextPage:\n');
      out+=ind(20,'type: boolean\n');
      out+=ind(8,"'401':\n");
      out+=ind(10,'description: '+(G?'認証エラー':'Unauthorized')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/Error\'\n');

      // POST create
      out+=ind(4,'post:\n');
      out+=ind(6,'summary: '+(G?tag+'作成':'Create '+tag)+'\n');
      out+=ind(6,'operationId: create'+tag+'\n');
      out+=ind(6,'tags:\n');
      out+=ind(8,'- '+tag+'\n');
      if(hasAuth){out+=ind(6,'security:\n');out+=ind(8,'- bearerAuth: []\n');}
      out+=ind(6,'requestBody:\n');
      out+=ind(8,'required: true\n');
      out+=ind(8,'content:\n');
      out+=ind(10,'application/json:\n');
      out+=ind(12,'schema:\n');
      out+=ind(14,'$ref: \'#/components/schemas/'+tag+'\'\n');
      out+=ind(6,'responses:\n');
      out+=ind(8,"'201':\n");
      out+=ind(10,'description: '+(G?'作成成功':'Created')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/'+tag+'\'\n');
      out+=ind(8,"'400':\n");
      out+=ind(10,'description: '+(G?'バリデーションエラー':'Validation Error')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/Error\'\n');

      // GET/PUT/DELETE single
      out+=ind(2,pathBase+'/{id}:\n');
      out+=ind(4,'parameters:\n');
      out+=ind(6,'- name: id\n');
      out+=ind(8,'in: path\n');
      out+=ind(8,'required: true\n');
      out+=ind(8,'schema:\n');
      out+=ind(10,'type: string\n');
      out+=ind(10,'format: uuid\n');
      out+=ind(4,'get:\n');
      out+=ind(6,'summary: '+(G?tag+'詳細取得':'Get '+tag)+'\n');
      out+=ind(6,'operationId: get'+tag+'\n');
      out+=ind(6,'tags:\n');
      out+=ind(8,'- '+tag+'\n');
      if(hasAuth){out+=ind(6,'security:\n');out+=ind(8,'- bearerAuth: []\n');}
      out+=ind(6,'responses:\n');
      out+=ind(8,"'200':\n");
      out+=ind(10,'description: '+(G?'成功':'Success')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/'+tag+'\'\n');
      out+=ind(8,"'404':\n");
      out+=ind(10,'description: '+(G?'見つかりません':'Not Found')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/Error\'\n');

      out+=ind(4,'put:\n');
      out+=ind(6,'summary: '+(G?tag+'更新':'Update '+tag)+'\n');
      out+=ind(6,'operationId: update'+tag+'\n');
      out+=ind(6,'tags:\n');
      out+=ind(8,'- '+tag+'\n');
      if(hasAuth){out+=ind(6,'security:\n');out+=ind(8,'- bearerAuth: []\n');}
      out+=ind(6,'requestBody:\n');
      out+=ind(8,'required: true\n');
      out+=ind(8,'content:\n');
      out+=ind(10,'application/json:\n');
      out+=ind(12,'schema:\n');
      out+=ind(14,'$ref: \'#/components/schemas/'+tag+'\'\n');
      out+=ind(6,'responses:\n');
      out+=ind(8,"'200':\n");
      out+=ind(10,'description: '+(G?'更新成功':'Updated')+'\n');
      out+=ind(10,'content:\n');
      out+=ind(12,'application/json:\n');
      out+=ind(14,'schema:\n');
      out+=ind(16,'$ref: \'#/components/schemas/'+tag+'\'\n');

      out+=ind(4,'delete:\n');
      out+=ind(6,'summary: '+(G?tag+'削除':'Delete '+tag)+'\n');
      out+=ind(6,'operationId: delete'+tag+'\n');
      out+=ind(6,'tags:\n');
      out+=ind(8,'- '+tag+'\n');
      if(hasAuth){out+=ind(6,'security:\n');out+=ind(8,'- bearerAuth: []\n');}
      out+=ind(6,'responses:\n');
      out+=ind(8,"'204':\n");
      out+=ind(10,'description: '+(G?'削除成功':'Deleted')+'\n');
      out+=ind(8,"'404':\n");
      out+=ind(10,'description: '+(G?'見つかりません':'Not Found')+'\n');
    });
    return out;
  }

  let yaml='';
  yaml+='openapi: \'3.0.3\'\n';
  yaml+='info:\n';
  yaml+=ind(2,'title: '+pn+' API\n');
  yaml+=ind(2,'version: \''+version+'\'\n');
  yaml+=ind(2,'description: |-\n');
  yaml+=ind(4,(G?'Auto-generated by DevForge v9 on '+date+'\n':'Auto-generated by DevForge v9 on '+date+'\n'));
  yaml+=ind(4,(G?'このファイルはDevForge v9により自動生成されました。Postman/Insomnia/SwaggerUI に直接インポート可能です。\n':'This file was auto-generated by DevForge v9. Import directly into Postman/Insomnia/SwaggerUI.\n'));
  yaml+='\n';

  if(isBaasMode){
    yaml+=(G?'# BaaS構成 ('+be+') のため、REST APIパスはBaaS SDKが提供します。\n# Supabase/FirebaseのREST APIエンドポイントを使用してください。\n':
      '# BaaS architecture ('+be+') — REST API paths are provided by the BaaS SDK.\n# Please use the Supabase/Firebase REST API endpoints directly.\n');
    yaml+='servers:\n';
    yaml+=ind(2,'- url: '+((be.includes('Supabase'))?'https://<project>.supabase.co/rest/v1':'https://<project>.firebaseio.com')+'\n');
    yaml+=ind(4,'description: '+be+' '+(G?'REST API':'REST API')+'\n');
    yaml+='components:\n';
    yaml+=buildSchemas();
  }else{
    const hasAuth=features.some(f=>/auth|認証|login|ログイン/i.test(f))||(a.auth&&!/なし|None/i.test(a.auth));
    yaml+='servers:\n';
    yaml+=ind(2,'- url: /api\n');
    yaml+=ind(4,'description: '+(G?'APIサーバー':'Application API Server')+'\n');
    if(a.deploy&&a.deploy!=='Vercel'){
      yaml+=ind(2,'- url: \'http://localhost:3000/api\'\n');
      yaml+=ind(4,'description: '+(G?'ローカル開発':'Local Development')+'\n');
    }
    yaml+='\n';
    yaml+=buildPaths();
    yaml+='\n';
    yaml+='components:\n';
    if(hasAuth){
      yaml+=ind(2,'securitySchemes:\n');
      yaml+=ind(4,'bearerAuth:\n');
      yaml+=ind(6,'type: http\n');
      yaml+=ind(6,'scheme: bearer\n');
      yaml+=ind(6,'bearerFormat: JWT\n');
    }
    yaml+=buildSchemas();
  }

  S.files['api/openapi.yaml']=yaml;
}


