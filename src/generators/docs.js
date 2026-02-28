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
**${G?'合計タスク数':'Total Tasks'}**: ${taskList.length} | **${G?'総見積り':'Total Est.'}**: ${taskList.reduce((s,t)=>s+t.hours,0)}h${_stageHandoff(G?'計画フェーズ':'Planning Phase',{decisions:[(G?'技術スタック: ':'Tech stack: ')+fe+' / '+be+' / '+dbName,(G?'デプロイ先: ':'Deploy target: ')+deployTarget],handoff:[G?'docs/22_prompt_playbook.md Phase 1 から実装を開始':'Begin implementation from Phase 1 in docs/22_prompt_playbook.md',(G?'優先機能: ':'Priority features: ')+features.slice(0,3).join(', ')],pending:[G?'パフォーマンス要件の最終確定':'Finalize performance requirements',G?'スコープ外機能のIssue化':'Convert out-of-scope features to GitHub Issues']},G)}`;

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
    ['11_wbs',G?'WBS (作業分解構造)':'WBS (Work Breakdown)',`${G?'## WBS — 総工数:':'## WBS — Total Hours:'} 約${totalH+26}h\n\n### 1. ${G?'プロジェクト管理':'Project Management'} (8h)\n- 1.1 ${G?'要件定義・SDD作成':'Requirements & SDD'} (3h)\n- 1.2 ${G?'技術選定・環境構築':'Tech selection & setup'} (3h)\n- 1.3 ${G?'進捗管理・レビュー':'Progress mgmt & review'} (2h)\n\n## 2. ${G?'機能開発':'Feature Development'} (${totalH}h)\n\n${wbsTasks}\n\n### 3. ${G?'テスト':'Testing'} (12h)\n- 3.1 ${G?'ユニットテスト':'Unit tests'} (4h)\n
- 3.2 ${G?'E2Eテスト':'E2E tests'} (4h)\n- 3.3 ${G?'バグ修正':'Bug fixes'} (4h)\n\n### 4. ${G?'デプロイ':'Deploy'} (6h)\n- 4.1 ${G?'ステージング構築':'Staging setup'} (2h)\n- 4.2 ${G?'本番デプロイ':'Production deploy'} (2h)\n- 4.3 ${G?'モニタリング設定':'Monitoring setup'} (2h)`],
    ['12_driven_dev',G?'駆動開発ガイド':'Dev Methods Guide',`${G?'## 採用手法':'## Methods Used'}\n${methods.map(m=>`\n### ${m}\n- ${G?'適用範囲: 全Sprint':'Scope: All sprints'}\n- ${G?'実践ルール: .spec/ に準拠':'Rule: Follow .spec/'}`).join('\n')}`],
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
    ['17_monitoring',G?'監視設計書':'Monitoring Design',`${G?'## 監視項目':'## Monitoring Items'}\n- ${G?'アプリケーションログ':'Application logs'}\n- ${G?'エラーレート':'Error rate'}\n- ${G?'レスポンスタイム':'Response time'}\n- CPU/${G?'メモリ使用率':'Memory usage'}\n\n${G?'## ツール':'## Tools'}\n- ${deployTarget.includes('Vercel')?'Vercel Analytics':deployTarget.includes('Netlify')?'Netlify Analytics':'PostHog / Plausible Analytics'}\n- Sentry (${G?'エラー追跡':'Error tracking'})${arch.isBaaS&&be.includes('Supabase')?'\n- Supabase Dashboard ('+( G?'DB監視・RLS監査':'DB monitoring & RLS audit')+')':''}`],
    ['18_data_migration',G?'データ移行計画書':'Data Migration Plan',`${G?'## 移行戦略':'## Migration Strategy'}\n- ${G?'段階的移行':'Phased migration'}\n- ${G?'ロールバック計画':'Rollback plan'}\n- ${G?'データ検証手順':'Data validation'}`],
    ['19_performance',G?'パフォーマンス設計書':'Performance Design',`${G?'## 目標値':'## Targets'}\n- LCP: < 2.5s\n- FID: < 100ms\n- CLS: < 0.1\n\n${G?'## 最適化施策':'## Optimizations'}\n- ${G?'画像最適化':'Image optimization'} (${fe.includes('Next')?'next/image':fe.includes('Vite')||fe.includes('SPA')?'vite-imagetools / sharp':'sharp / imagemin'})\n- Code Splitting${fe.includes('Vite')||fe.includes('SPA')?' (Vite dynamic import)':fe.includes('Next')?' (Next.js dynamic)':''}\n- ${deployTarget.includes('Vercel')||deployTarget.includes('Netlify')?'Edge Caching (CDN)':'CDN Caching'}`],
    ['20_a11y',G?'アクセシビリティ設計書':'Accessibility Design',(()=>{const _a11yDom=detectDomain(a.purpose||'');const _a11ySpec=_a11yDom==='fintech'?(G?'- 取引完了・エラーは aria-live="assertive" で即時通知\n- 認証フォームは autocomplete 属性付与 (current-password等)\n- 色だけでリスク情報を伝えない（アイコン+テキスト併用）':'- Transaction status/errors must use aria-live="assertive"\n- Auth forms require autocomplete attributes\n- Never convey risk via color alone (use icon+text)'):_a11yDom==='health'?(G?'- 緊急・警告情報は aria-live="assertive" で即時通知\n- 重要情報のコントラスト比は 7:1+ (AAA目標)\n- 医療用語には <abbr> タグと説明テキスト付与':'- Critical alerts must use aria-live="assertive"\n- Target 7:1+ (AAA) contrast for critical info\n- Use <abbr> with expansion for medical terms'):_a11yDom==='education'?(G?'- 動画コンテンツには字幕・文字起こし必須\n- キーボードのみでコース全体を完結できること\n- 認知負荷軽減: 1ページ1タスク原則':'- Videos require captions and transcripts\n- Full keyboard-only course completion required\n- One task per page to reduce cognitive load'):_a11yDom==='ec'?(G?'- カートへの追加操作後は aria-live でフィードバック通知\n- 商品フィルタはキーボードで操作可能\n- 購入フローの全ステップでエラー回復が可能':'- Cart updates must trigger aria-live feedback\n- Product filters must be keyboard operable\n- All checkout steps support error recovery'):(G?'- フォームフィールドには aria-label または <label> 必須\n- エラーメッセージは aria-describedby でフィールドに関連付け\n- モーダルはフォーカストラップを実装必須':'- Every form field needs aria-label or <label>\n- Error messages linked via aria-describedby\n- Modals must implement focus trap');return `## WCAG 2.2 AA ${G?'チェックリスト':'Checklist'}\n\n| ${G?'基準':'Criteria'} | ${G?'詳細':'Detail'} | ${G?'テスト方法':'Test Method'} |\n|---|---|---|\n| 1.1.1 ${G?'代替テキスト':'Alt Text'} | ${G?'全画像にalt属性':'alt on all images'} | axe-core |\n| 1.4.3 ${G?'コントラスト':'Contrast'} | ${G?'通常テキスト 4.5:1+':'Normal text 4.5:1+'} | Lighthouse |\n| 2.1.1 ${G?'キーボード':'Keyboard'} | ${G?'全機能キーボード操作可':'All functions keyboard accessible'} | ${G?'手動テスト':'Manual'} |\n| 2.4.3 ${G?'フォーカス順序':'Focus Order'} | ${G?'論理的なタブ順序':'Logical tab order'} | ${G?'手動テスト':'Manual'} |\n| 3.3.1 ${G?'エラー通知':'Error ID'} | ${G?'エラー箇所を明示':'Identify input errors'} | axe-core |\n| 4.1.3 ${G?'ステータス通知':'Status Msg'} | aria-live | axe-core |\n\n## ${G?'ドメイン固有 A11y 要件':'Domain-Specific A11y Requirements'} (${_a11yDom||G?'汎用':'generic'})\n\n${_a11ySpec}${(a.mobile&&!/なし|none/i.test(a.mobile)&&/expo|react.?native|flutter/i.test(a.mobile))?'\n\n## '+(G?'モバイル HIG / Android Quality Guidelines':'Mobile HIG / Android Quality Guidelines')+'\n- '+(G?'Apple HIG: ネイティブコントロール使用・セーフエリア対応・最小タップターゲット 44×44pt':'Apple HIG: use native controls, support safe area, min tap target 44×44pt')+'\n- '+(G?'Material Design 3: 最小タップターゲット 48×48dp・バックジェスチャー対応':'Material Design 3: min tap target 48×48dp, support back gesture'):''}\n\n## ${G?'スクリーンリーダーテスト手順':'Screen Reader Test Procedures'}\n\n| ${G?'ツール':'Tool'} | ${G?'対象':'Platform'} | ${G?'テスト観点':'Test Points'} |\n|------|--------|----------|\n| VoiceOver | iOS / macOS | ${G?'読み上げ順序・アクション確認':'Reading order & action confirmation'} |\n| TalkBack | Android | ${G?'タップジェスチャー・フォーカス移動':'Tap gestures & focus navigation'} |\n| NVDA | Windows | ${G?'フォームラベル・エラー通知':'Form labels & error announcements'} |\n\n## ${G?'自動テストツール':'Automated A11y Testing'}\n\n\`\`\`bash\n# axe-core (${G?'ユニットテスト統合':'unit test integration'})\nnpm install @axe-core/react --save-dev\n\n# Lighthouse ${G?'アクセシビリティスコア確認':'accessibility score'}\nnpx lighthouse http://localhost:3000 --only-categories=accessibility\n\n# pa11y ${G?'バッチ検証':'batch validation'}\nnpx pa11y http://localhost:3000\n\`\`\`\n\n## ${G?'AI アクセシビリティ監査プロンプト':'AI Accessibility Audit Prompt'}\n\n\`\`\`\n${G?'以下のコンポーネントを WCAG 2.2 AA 基準で診断してください。\n[コードを貼り付け]\n確認項目: aria属性の不足・キーボードフォーカス・コントラスト・エラー関連付け・aria-live\n修正コードも合わせて提示してください。':'Diagnose this component for WCAG 2.2 AA compliance.\n[Paste component code]\nCheck: missing aria attrs, keyboard focus, contrast, error associations, aria-live\nProvide corrected code for each issue found.'}\n\`\`\``;})()],
    ['21_changelog',G?'変更履歴':'Changelog',`# ${pn} — ${G?'変更履歴':'Changelog'}\n> ${G?'セマンティックバージョニング (MAJOR.MINOR.PATCH) 準拠':'Follows Semantic Versioning (MAJOR.MINOR.PATCH)'}\n\n## [Unreleased]\n\n### ${G?'追加予定':'Planned Additions'}\n${features.length>3?features.slice(3).map(f=>'- '+f).join('\n'):('- '+(G?'今後のロードマップを参照':'See future roadmap'))}\n\n---\n\n## [1.0.0] — ${date}\n\n### ${G?'追加 (Added)':'Added'}\n- ${G?'初期リリース — コア機能実装完了':'Initial release — core features implemented'}\n${features.slice(0,5).map(f=>'- '+f).join('\n')}\n\n### ${G?'技術スタック':'Tech Stack'}\n- Frontend: ${fe} | Backend: ${be} | DB: ${dbName} | Deploy: ${deployTarget}\n\n---\n\n## ${G?'バージョニングポリシー':'Versioning Policy'}\n\n| ${G?'変更種別':'Change Type'} | ${G?'バージョン':'Version'} | ${G?'例':'Example'} |\n|---|---|---|\n| ${G?'破壊的変更 (API署名変更等)':'Breaking change (API rename)'} | MAJOR | 1.0.0 → 2.0.0 |\n| ${G?'後方互換の新機能追加':'Backward-compatible feature'} | MINOR | 1.0.0 → 1.1.0 |\n| ${G?'バグ修正':'Bug fix'} | PATCH | 1.0.0 → 1.0.1 |\n\n## ${G?'Conventional Commits 参照':'Conventional Commits'}\n\n\`\`\`\nfeat:   ${G?'新機能 → MINOR バンプ':'New feature → MINOR bump'}\nfix:    ${G?'バグ修正 → PATCH バンプ':'Bug fix → PATCH bump'}\nfeat!:  ${G?'破壊的変更 → MAJOR バンプ':'Breaking change → MAJOR bump'}\ndocs:   ${G?'ドキュメント更新 (バンプなし)':'Docs update (no bump)'}\nchore:  ${G?'ビルド・CI変更':'Build/CI changes'}\n\`\`\`\n\n## ${G?'AI 変更履歴生成プロンプト':'AI Changelog Generation Prompt'}\n\n\`\`\`\n${G?'次の git log を CHANGELOG.md 形式に整形してください。\n[git log --oneline --since="2weeks"]\nルール: feat→Added, fix→Fixed, feat!→MAJOR バンプ, 各エントリ1行で簡潔に':'Format this git log as CHANGELOG.md.\n[Paste: git log --oneline --since="2weeks"]\nRules: feat→Added, fix→Fixed, feat!→MAJOR bump, each entry one concise line'}\n\`\`\``],
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
\`\`\``],
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
  const initDecs=G?[
    {id:'DEC-001',content:'技術スタック確定 ('+fe+' + '+be+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-002',content:'デプロイ先確定 ('+deployTarget+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-003',content:'認証方式確定 ('+resolveAuth(a).provider+')',doc:'.spec/specification.md'},
    {id:'DEC-004',content:'ORM確定 ('+resolveORM(a).name+')',doc:'.spec/technical-plan.md'},
  ]:[
    {id:'DEC-001',content:'Tech stack finalized ('+fe+' + '+be+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-002',content:'Deploy target finalized ('+deployTarget+')',doc:'.spec/technical-plan.md'},
    {id:'DEC-003',content:'Authentication method finalized ('+resolveAuth(a).provider+')',doc:'.spec/specification.md'},
    {id:'DEC-004',content:'ORM finalized ('+resolveORM(a).name+')',doc:'.spec/technical-plan.md'},
  ];
  const initIssues=G?[
    {id:'ISS-001',type:'技術',content:'DB スキーマ設計レビュー',priority:'P1',owner:'TL'},
    {id:'ISS-002',type:'技術',content:'認証フロー設計確認',priority:'P1',owner:'TL'},
    {id:'ISS-003',type:'管理',content:'開発環境構築手順書作成',priority:'P2',owner:'Dev'},
  ]:[
    {id:'ISS-001',type:'Tech',content:'DB schema design review',priority:'P1',owner:'TL'},
    {id:'ISS-002',type:'Tech',content:'Authentication flow design confirmation',priority:'P1',owner:'TL'},
    {id:'ISS-003',type:'Mgmt',content:'Dev environment setup guide creation',priority:'P2',owner:'Dev'},
  ];
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
  const authConseq=G?'- セッション管理: '+(isBaaS?'BaaS SDKが自動的にセッションを管理':'JWTのrefreshトークンローテーションを実装')+'\n- '+(isBaaS?'RLSポリシーとauth.uid()を連携させてデータアクセス制御':'カスタムミドルウェアでAPIルートを保護'):'- Session management: '+(isBaaS?'BaaS SDK automatically manages sessions':'Implement JWT refresh token rotation')+'\n- '+(isBaaS?'Integrate RLS policies with auth.uid() for data access control':'Protect API routes with custom middleware');

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
    +(G?'このドキュメントは27ピラー間の依存関係と生成順序を示します。実装前に依存ピラーが完了していることを確認してください。\n\n':'This document shows dependencies and generation order across 27 pillars. Verify dependent pillars are complete before implementation.\n\n')
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

  doc+=(G?'### ロール別の読み方\n\n- **開発者**: CLAUDE.md → .spec/ → docs/03_architecture.md → scaffolding/SETUP.md\n- **PM**: docs/01_project_overview.md → docs/02_requirements.md → docs/107_project_governance.md\n- **QA**: docs/108_uat_acceptance.md → docs/17_test_strategy.md → docs/22_security.md\n- **アーキテクト**: docs/03_architecture.md → docs/82_architecture_integrity_check.md → .spec/technical-plan.md\n':
    '### Reading Guide by Role\n\n- **Developer**: CLAUDE.md → .spec/ → docs/03_architecture.md → scaffolding/SETUP.md\n- **PM**: docs/01_project_overview.md → docs/02_requirements.md → docs/107_project_governance.md\n- **QA**: docs/108_uat_acceptance.md → docs/17_test_strategy.md → docs/22_security.md\n- **Architect**: docs/03_architecture.md → docs/82_architecture_integrity_check.md → .spec/technical-plan.md\n')+'\n';

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
      out+=ind(8,'- name: page\n');
      out+=ind(10,'in: query\n');
      out+=ind(10,'schema:\n');
      out+=ind(12,'type: integer\n');
      out+=ind(12,'default: 1\n');
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
      out+=ind(18,'total:\n');
      out+=ind(20,'type: integer\n');
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


