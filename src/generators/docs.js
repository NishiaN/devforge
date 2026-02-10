function genDocs21(a,pn){
  const G=S.genLang==='ja';
  const date=new Date().toISOString().split('T')[0];
  const fe=a.frontend||'React';const be=a.backend||'Node.js';
  const auth=resolveAuth(a);
  const arch=resolveArch(a);
  const orm=arch.isBaaS?(be.includes('Supabase')?'Supabase Client':be.includes('Firebase')?'Firebase SDK':'Convex'):(a.orm&&a.orm.includes('Drizzle')?'Drizzle':'Prisma');
  const stripPri=s=>(s||'').replace(/\[P[0-2]\]\s*/g,'');
  const entities=(stripPri(a.data_entities)||'users, items').split(', ').filter(Boolean);
  const features=(stripPri(a.mvp_features)||(G?'CRUD操作':'CRUD')).split(', ').filter(Boolean);
  const screens=(stripPri(a.screens)||(G?'ダッシュボード, ログイン':'Dashboard, Login')).split(', ').filter(Boolean);
  const methods=(stripPri(a.dev_methods)||'TDD').split(', ').filter(Boolean);
  const target=(a.target||'').toLowerCase();
  const hasAdmin=/管理者|admin|管理/i.test(target)||features.some(f=>/管理ダッシュボード|admin/i.test(f));
  const hasInstructor=/講師|instructor|teacher/i.test(target);
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);

  // 1. Project Overview
  S.files['docs/01_project_overview.md']=`# ${pn} — ${G?'プロジェクト概要書':'Project Overview'}\n> ${date}\n\n${G?'## 目的':'## Purpose'}\n${a.purpose||'N/A'}\n\n${G?'## ターゲット':'## Target'}\n${a.target||'N/A'}\n\n${G?'## 成功指標':'## Success Metrics'}\n${a.success||'N/A'}\n\n${G?'## スケジュール':'## Schedule'}\n${a.deadline||(G?'6ヶ月':'6 months')}\n\n## ${G?'技術スタック':'Tech Stack'}\n- Frontend: ${fe}\n- Backend: ${be}\n- DB: ${a.database||'PostgreSQL'}\n- Deploy: ${a.deploy||'Vercel'}`;

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
      if(methods.includes('GET')) parts.push(`\n#### GET /api/v1/${lower}\n- ${G?'説明':'Desc'}: ${G?e+'一覧取得 (ページネーション対応)':'List '+e+' (paginated)'}\n- クエリ: \`?page=1&limit=20&sort=created_at&order=desc\`\n- レスポンス:\n\`\`\`json\n{ "data": [{ "id": "uuid", ${bodyObj} }], "meta": { "total": 100, "page": 1 } }\n\`\`\`\n- ${G?'ステータス':'Status'}: 200 / 401 / 500`);
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
  S.files['docs/22_prompt_playbook.md']=`# ${pn} — ${G?'プロンプトプレイブック':'Prompt Playbook'}\n> ${date}\n\n${G?'## 使い方\n開発フェーズごとに、以下のプロンプトを順番にAI (Claude / Cursor) に投入してください。':'## Usage\nFeed these prompts to AI (Claude / Cursor) in order for each dev phase.'}\n\n## Phase 1: ${G?'プロジェクトセットアップ':'Project Setup'}\n\n### 1-1. ${G?'初期環境構築':'Initial Setup'}\n\`\`\`\n${G?'以下の技術スタックでプロジェクトの初期セットアップを行ってください。':'Set up the project with the following tech stack.'}\n- Frontend: ${fe}\n- Backend: ${be}\n
- DB: ${dbName}\n- Deploy: ${deployTarget}\n${G?'package.json, tsconfig.json, .env.example を生成してください。':'Generate package.json, tsconfig.json, .env.example.'}\n\`\`\`\n\n### 1-2. ${G?'データモデル定義':'Data Model'}\n\`\`\`\n${G?'以下のエンティティの'+orm+'スキーマを生成してください:':'Generate '+orm+' schema for these entities:'} ${entities.join(', ')}\n${entities.map(e=>{const cols=getEntityColumns(e,G,entities);if(!cols.length) return '';return e+': '+cols.map(c=>c.col+'('+c.type+')').join(', ');}).filter(Boolean).join('\n')}\n${G?'各エンティティにはid, created_at, updated_atを含め、リレーションも定義してください。':'Include id, created_at, updated_at for each entity with relations.'}\n
\`\`\`\n\n## Phase 2: ${G?'コア機能開発':'Core Development'}\n\n${features.map((f,i)=>{const fd=getFeatureDetail(f);const criteriaLines=fd?(G?fd.criteria_ja:fd.criteria_en).map(c=>'  - '+c.replace(/\{auth\}/g,a.auth||'OAuth')).join('\n'):'';return `### 2-${i+1}. ${f}\n\`\`\`\n${G?f+'機能を実装してください。':'Implement '+f+'.'}\n- ${arch.isBaaS?(G?'データアクセス: '+orm+'でCRUDを実装':'Data access: Implement CRUD with '+orm):(G?'APIエンドポイント: /api/v1/ にCRUDを作成':'API endpoint: Create CRUD at /api/v1/')}\n- ${G?'UIコンポーネント: '+fe+'で画面を実装':'UI component: Build screen with '+fe}\n- ${G?'バリデーション: zodスキーマで入力検証':'Validation: zod schema for input'}\n- ${G?'テスト: Vitestでユニットテスト作成':'Test: Write unit tests with Vitest'}${criteriaLines?'\n\n'+(G?'受入条件:':'Acceptance Criteria:')+'\n'+criteriaLines:''}\n\`\`\``}).join('\n\n')}\n\n
## Phase 3: ${G?'テスト・デプロイ':'Test & Deploy'}\n\n### 3-1. ${G?'E2Eテスト':'E2E Tests'}\n\`\`\`\n${G?'Playwrightで以下の画面のE2Eテストを作成してください:':'Create Playwright E2E tests for these screens:'} ${screens.join(', ')}\n${G?'正常系・異常系の両方をカバーしてください。':'Cover both happy and error paths.'}\n\`\`\`\n\n### 3-2. ${G?'デプロイ設定':'Deploy Config'}\n\`\`\`\n${G?deployTarget+'へのデプロイ設定を行ってください。':'Configure deployment to '+deployTarget+'.'}\n- CI/CD: GitHub Actions\n
- ${G?'環境変数: .env.exampleに基づいて設定':'Env vars: Based on .env.example'}\n- ${G?'プレビューデプロイの設定も含めてください。':'Include preview deploy config.'}\n\`\`\``;

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
    return `## Issue #${i+1}: ${t.title}\n- **${G?'ラベル':'Label'}**: \`${t.label}\`\n- **${G?'見積り':'Estimate'}**: ${t.hours}h\n- **${G?'説明':'Description'}**: ${t.desc}\n- **Acceptance Criteria**:\n${acLines}`;
  }).join('\n\n')}\n\n---\n
**${G?'合計タスク数':'Total Tasks'}**: ${taskList.length} | **${G?'総見積り':'Total Est.'}**: ${taskList.reduce((s,t)=>s+t.hours,0)}h`;

  const docTemplates=[
    ['05_api_design',G?(arch.isBaaS?'データアクセス設計書 (SDK)':'API設計書 (OpenAPI準拠)'):(arch.isBaaS?'Data Access Design (SDK)':'API Design (OpenAPI)'),`${G?'## 認証':'## Authentication'}\n- ${G?'方式':'Method'}: ${auth.tokenType}\n- ${arch.isBaaS?(G?'アクセス方式: '+orm+' SDK':'Access: '+orm+' SDK'):'ヘッダー: \\`Authorization: Bearer <token>\\`'}\n\n${arch.isBaaS?'':(G?'## 共通レスポンス':'## Common Responses')+'\\n| '+(G?'ステータス':'Status')+' | '+(G?'意味':'Meaning')+' |\\n|-----------|------|\\n| 200 | OK |\\n| 201 | Created |\\n| 400 | Bad Request |\\n| 401 | Unauthorized |\\n| 403 | Forbidden |\\n| 404 | Not Found |\\n| 422 | Validation Error |\\n| 500 | Internal Error |\\n\\n'}\n${G?(arch.isBaaS?'## データアクセスパターン':'## エンドポイント一覧'):(arch.isBaaS?'## Data Access Patterns':'## Endpoints')}\n${apiEndpoints}`],
    ['06_screen_design',G?'画面設計書 & 画面遷移図':'Screen Design & Flow',`${G?'## 画面遷移図':'## Screen Flow'}\n\n\`\`\`mermaid\nflowchart LR\n${sNodes}\n${sLinks.join('\n')}\n\`\`\`\n\n${G?'## 画面一覧':'## Screen List'}\n${screens.map((s,i)=>{const isPublic=s.match(/ログイン|Login|Register|登録|ランディング|Landing|LP|トップ|Top|ホーム|Home|About|概要|利用規約|Terms|料金|Pricing|お問い合わせ|Contact/i);const comps=getScreenComponents(s,G);const compList=comps?'\n- '+(G?'主要コンポーネント':'Key Components')+':\n'+comps.map(c=>'  - '+c).join('\n'):'\n- '+(G?'コンポーネント':'Components')+': Header, '+(isPublic?'':'Sidebar, ')+'Content, Footer';return `\n### ${i+1}. ${s}\n- URL: \`${(genRoutes(a).find(r=>r.name===s.replace(/\(P[0-2]\)/gi,'').trim())||{path:'/'+(s.toLowerCase().replace(/[^a-z0-9]/g,'-'))}).path}\`\n- ${G?'認証':'Auth'}: ${isPublic?(G?'不要':'Not required'):(G?'必要':'Required')}${compList}`;}).join('\n')}`],
    ['07_test_cases',G?'テストケース定義書':'Test Cases',`${G?'## テスト戦略':'## Test Strategy'}\n- ${G?'ユニット':'Unit'}: Vitest (80%+)\n- E2E: Playwright\n- ${G?'コンポーネント':'Component'}: Testing Library\n\n${G?'## テストケースマトリクス':'## Test Case Matrix'}\n${testMatrix}\n\n${G?'## 実行コマンド':'## Run Commands'}\n\`\`\`bash\nnpm run test\nnpm run test:e2e\nnpm run test:coverage\n\`\`\``],
    ['08_security',G?'セキュリティ設計書':'Security Design',`${G?'## セキュリティ対策':'## Security Measures'}\n- ${G?'認証':'Auth'}: ${auth.sot}\n- HTTPS${G?'必須':' required'}\n- CSP (Content Security Policy)\n- Rate Limiting\n- Input Validation${hasAdmin?'\n\n'+(G?'## RBAC（ロールベースアクセス制御）':'## RBAC (Role-Based Access Control)')+'\n\n| '+(G?'ロール':'Role')+' | '+(G?'権限':'Permissions')+' |\n|--------|----------|\n| user | '+(G?'自分のデータの読取・更新':'Read/update own data')+' |\n'+(hasInstructor?'| instructor | '+(G?'コンテンツ作成・編集・自分の受講者管理':'Create/edit content, manage own students')+' |\n':'')+'| admin | '+(G?'全データの読取・更新・削除、ユーザー管理、システム設定':'Full CRUD, user management, system settings')+' |\n\n'+(G?'### RBACポリシー実装':'### RBAC Policy Implementation')+'\n- profiles.role '+(G?'カラムでロール管理':'column for role management')+'\n- '+(arch.isBaaS&&be.includes('Supabase')?'RLS: auth.uid() = user_id AND role check via profiles':'Middleware: role check before protected routes')+'\n- '+(G?'管理画面ルート':'Admin routes')+': /admin/ → role=admin '+(G?'チェック必須':'check required'):''}${hasPay&&(a.payment||'').includes('Stripe')?'\n\n'+(G?'## 決済セキュリティ':'## Payment Security')+'\n- Stripe Webhook '+(G?'署名検証':'signature verification')+' (STRIPE_WEBHOOK_SECRET)\n- '+(G?'冪等キーによる重複処理防止':'Idempotency key for duplicate prevention')+'\n- PCI DSS '+(G?'準拠':'compliance')+' (Stripe Elements '+(G?'使用で対応':'handles this')+')\n- '+(G?'サーバーサイドのみで':'Server-side only for')+' stripe.customers / stripe.subscriptions '+(G?'操作':'operations'):''}`],
    ['09_release_checklist',G?'リリースチェックリスト':'Release Checklist',`## ${G?'デプロイ先':'Deploy Target'}: ${deployTarget}\n\n### 1. ${G?'コード品質':'Code Quality'}\n${(G?['TypeScript 型エラー 0件','ESLint エラー 0件','全テストパス','カバレッジ 80%+']:['TypeScript: 0 type errors','ESLint: 0 errors','All tests pass','Coverage 80%+']).map(c=>'- [ ] '+c).join('\n')}\n\n### 2. ${G?'セキュリティ':'Security'}\n
${(G?['環境変数にシークレット未ハードコード','CORS設定','CSP設定','認証・認可テスト完了']:['No hardcoded secrets in env vars','CORS config','CSP config','Auth/authz tests done']).map(c=>'- [ ] '+c).join('\n')}\n\n### 3. ${G?'インフラ':'Infrastructure'} (${deployTarget})\n${deployChecks.map(c=>'- [ ] '+c).join('\n')}\n\n### 4. ${G?'データベース':'Database'} (${dbName})\n${dbChecks.map(c=>'- [ ] '+c).join('\n')}\n\n### 5. ${G?'パフォーマンス':'Performance'}\n
${(G?['Lighthouse 90+','LCP < 2.5s','画像最適化','バンドルサイズ確認']:['Lighthouse 90+','LCP < 2.5s','Image optimization','Bundle size check']).map(c=>'- [ ] '+c).join('\n')}\n\n### 6. ${G?'モニタリング':'Monitoring'}\n${(G?['Sentry設定','アクセスログ','アラート閾値']:['Sentry setup','Access logs','Alert thresholds']).map(c=>'- [ ] '+c).join('\n')}`],
    ['10_gantt',G?'ガントチャート':'Gantt Chart',`${G?'## プロジェクトスケジュール':'## Project Schedule'}\n\n\`\`\`mermaid\ngantt\n  title ${pn} ${G?'開発スケジュール':'Development Schedule'}\n  dateFormat YYYY-MM-DD\n  axisFormat %m/%d\n  section Sprint 0\n  ${G?'プロジェクトセットアップ':'Project Setup'} :env, 2026-01-01, 2d\n  ${G?'DevContainer構築':'DevContainer Setup'} :dc, after env, 1d\n  ${G?'CI/CD設定':'CI/CD Setup'} :ci, after dc, 1d\n  section Sprint 1-2\n${ganttTasks}\n  section Sprint 3\n
  ${G?'E2Eテスト':'E2E Tests'} :test, after s${features.length-1}, 3d\n  ${G?'パフォーマンス最適化':'Perf Optimization'} :perf, after test, 2d\n  ${G?'リリース':'Release'} :rel, after perf, 1d\n\`\`\`\n\n${G?'## マイルストーン':'## Milestones'}\n| MS | ${G?'目標':'Goal'} | ${G?'成果物':'Deliverable'} |\n|----|------|--------|\n| Alpha | Sprint 1 ${G?'完了':'done'} | ${G?'コア機能動作':'Core features working'} |\n| Beta | Sprint 2 ${G?'完了':'done'} | ${G?'全機能実装':'All features implemented'} |\n
| RC | Sprint 3 ${G?'中盤':'mid'} | ${G?'テスト完了':'Tests complete'} |\n| GA | Sprint 3 ${G?'末':'end'} | ${G?'本番リリース':'Production release'} |`],
    ['11_wbs',G?'WBS (作業分解構造)':'WBS (Work Breakdown)',`${G?'## WBS — 総工数:':'## WBS — Total Hours:'} 約${totalH+26}h\n\n### 1. ${G?'プロジェクト管理':'Project Management'} (8h)\n- 1.1 ${G?'要件定義・SDD作成':'Requirements & SDD'} (3h)\n- 1.2 ${G?'技術選定・環境構築':'Tech selection & setup'} (3h)\n- 1.3 ${G?'進捗管理・レビュー':'Progress mgmt & review'} (2h)\n\n## 2. ${G?'機能開発':'Feature Development'} (${totalH}h)\n\n${wbsTasks}\n\n### 3. ${G?'テスト':'Testing'} (12h)\n- 3.1 ${G?'ユニットテスト':'Unit tests'} (4h)\n
- 3.2 ${G?'E2Eテスト':'E2E tests'} (4h)\n- 3.3 ${G?'バグ修正':'Bug fixes'} (4h)\n\n### 4. ${G?'デプロイ':'Deploy'} (6h)\n- 4.1 ${G?'ステージング構築':'Staging setup'} (2h)\n- 4.2 ${G?'本番デプロイ':'Production deploy'} (2h)\n- 4.3 ${G?'モニタリング設定':'Monitoring setup'} (2h)`],
    ['12_driven_dev',G?'駆動開発ガイド':'Dev Methods Guide',`${G?'## 採用手法':'## Methods Used'}\n${methods.map(m=>`\n### ${m}\n- ${G?'適用範囲: 全Sprint':'Scope: All sprints'}\n- ${G?'実践ルール: .spec/ に準拠':'Rule: Follow .spec/'}`).join('\n')}`],
    ['13_glossary',G?'用語集':'Glossary',`${G?'## 用語定義':'## Terms'}\n${entities.map(e=>`| ${e} | ${G?pn+'における'+e+'データ':e+' data in '+pn} |`).join('\n')}`],
    ['14_risk',G?'リスク管理表':'Risk Management',`${G?'## リスク一覧':'## Risk List'}\n| ${G?'リスク':'Risk'} | ${G?'影響度':'Impact'} | ${G?'対策':'Mitigation'} |\n|--------|--------|------|\n| ${G?'技術的負債':'Tech debt'} | ${G?'高':'High'} | ${G?'コードレビュー必須':'Mandatory code review'} |\n| ${G?'スケジュール遅延':'Schedule delay'} | ${G?'中':'Mid'} | ${G?'バッファ設定':'Buffer planning'} |\n| ${G?'セキュリティ':'Security'} | ${G?'高':'High'} | ${G?'定期監査':'Regular audit'} |`],
    ['15_meeting',G?'議事録テンプレート':'Meeting Notes Template',`${G?'## 議事録':'## Meeting Notes'}\n- ${G?'日時':'Date'}:\n- ${G?'参加者':'Attendees'}:\n- ${G?'アジェンダ':'Agenda'}:\n- ${G?'決定事項':'Decisions'}:\n- ${G?'次回アクション':'Next Actions'}:`],
    ['16_review',G?'コードレビューガイド':'Code Review Guide',`${G?'## レビュー基準':'## Review Criteria'}\n1. TypeScript strict ${G?'モード準拠':'mode'}\n2. ${G?'テスト付き':'With tests'}\n3. ${G?'.spec/ との整合性':'.spec/ alignment'}\n4. ${G?'パフォーマンス考慮':'Performance'}\n5. ${G?'セキュリティチェック':'Security check'}`],
    ['17_monitoring',G?'監視設計書':'Monitoring Design',`${G?'## 監視項目':'## Monitoring Items'}\n- ${G?'アプリケーションログ':'Application logs'}\n- ${G?'エラーレート':'Error rate'}\n- ${G?'レスポンスタイム':'Response time'}\n- CPU/${G?'メモリ使用率':'Memory usage'}\n\n${G?'## ツール':'## Tools'}\n- ${deployTarget.includes('Vercel')?'Vercel Analytics':deployTarget.includes('Netlify')?'Netlify Analytics':'PostHog / Plausible Analytics'}\n- Sentry (${G?'エラー追跡':'Error tracking'})${arch.isBaaS&&be.includes('Supabase')?'\n- Supabase Dashboard ('+( G?'DB監視・RLS監査':'DB monitoring & RLS audit')+')':''}`],
    ['18_data_migration',G?'データ移行計画書':'Data Migration Plan',`${G?'## 移行戦略':'## Migration Strategy'}\n- ${G?'段階的移行':'Phased migration'}\n- ${G?'ロールバック計画':'Rollback plan'}\n- ${G?'データ検証手順':'Data validation'}`],
    ['19_performance',G?'パフォーマンス設計書':'Performance Design',`${G?'## 目標値':'## Targets'}\n- LCP: < 2.5s\n- FID: < 100ms\n- CLS: < 0.1\n\n${G?'## 最適化施策':'## Optimizations'}\n- ${G?'画像最適化':'Image optimization'} (${fe.includes('Next')?'next/image':fe.includes('Vite')||fe.includes('SPA')?'vite-imagetools / sharp':'sharp / imagemin'})\n- Code Splitting${fe.includes('Vite')||fe.includes('SPA')?' (Vite dynamic import)':fe.includes('Next')?' (Next.js dynamic)':''}\n- ${deployTarget.includes('Vercel')||deployTarget.includes('Netlify')?'Edge Caching (CDN)':'CDN Caching'}`],
    ['20_a11y',G?'アクセシビリティ設計書':'Accessibility Design',`## WCAG 2.1 AA\n- ${G?'キーボードナビゲーション':'Keyboard navigation'}\n- ${G?'スクリーンリーダー対応':'Screen reader support'}\n- ${G?'カラーコントラスト比':'Color contrast ratio'} 4.5:1+\n- ${G?'フォーカス管理':'Focus management'}`],
    ['21_changelog',G?'変更履歴':'Changelog',`## v1.0.0 (${date})\n- ${G?'初期リリース':'Initial release'}\n- ${features.slice(0,3).join(', ')} 実装\n\n## ${G?'DevForge v9による自動生成':'Auto-generated by DevForge v9'}\n- ${G?'60+ファイル生成':'60+ files generated'}\n- ${G?'8つの柱対応':'8 pillars support'}\n- ${G?'Mermaid図・プロンプトプレイブック・タスク分解対応':'Mermaid diagrams, Prompt Playbook, Task decomposition'}`],
  ];
  docTemplates.forEach(([file,title,content])=>{
    S.files[`docs/${file}.md`]=`# ${pn} — ${title}\n> ${date}\n\n${content}`;
  });

  // CI/CD Workflow YAML
  const buildCmd=fe.includes('Next')?'next build':fe.includes('Vite')||fe.includes('SPA')?'vite build':'npm run build';
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
    '      - run: npm run lint',
    '      - run: npm run test',
    '      - run: npx '+buildCmd,
    ''
  ].join('\n');
}


