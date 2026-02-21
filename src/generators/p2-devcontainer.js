/* ── Pillar ② DevContainer (Phase B: BaaS-Aware) ── */
function genPillar2_DevContainer(a,pn){
  const G=S.genLang==='ja';
  const fe=a.frontend||'React';
  const be=a.backend||'Node.js + Express';
  const db=a.database||'PostgreSQL';
  const orm=a.orm||'';
  const devEnv=a.dev_env_type||'';
  const isLocal=/Local|ローカル/i.test(devEnv)||!devEnv;
  const isCloud=/Cloud|クラウド/i.test(devEnv);
  const isHybrid=/Hybrid|ハイブリッド/i.test(devEnv);
  const isNode=be.includes('Node')||be.includes('Express')||be.includes('Fastify')||be.includes('Hono')||be.includes('NestJS');
  const isPython=be.includes('Python')||be.includes('Django')||be.includes('FastAPI');
  const isBaaS=/Supabase|Firebase|Convex/.test(be);
  const isSupabase=be.includes('Supabase');
  const isFirebase=be.includes('Firebase');
  const baseImage=isNode||isBaaS?'mcr.microsoft.com/devcontainers/javascript-node:22':isPython?'mcr.microsoft.com/devcontainers/python:3.12':'mcr.microsoft.com/devcontainers/base:ubuntu';

  // DB service: only for non-BaaS
  const dbService=isBaaS?'':db.includes('Postgre')?'postgres':db.includes('Mongo')?'mongo':db.includes('MySQL')?'mysql':'';

  // Extensions
  const exts=['dbaeumer.vscode-eslint','esbenp.prettier-vscode','bradlc.vscode-tailwindcss'];
  if(isSupabase) exts.push('supabase.supabase-vscode');
  else if(isNode&&!isBaaS&&(orm.includes('Prisma')||!orm)) exts.push('prisma.prisma');
  else if(isPython) exts.push('ms-python.python');
  exts.push('github.copilot','github.copilot-chat');

  // Forward ports
  const ports=[3000];
  if(isSupabase) ports.push(54321,54322,54323); // Supabase API + Auth + Studio
  else if(isFirebase) ports.push(4000,9099); // Emulator UI + Auth
  else if(dbService==='postgres') ports.push(5432);
  else if(dbService==='mongo') ports.push(27017);
  else if(isPython) ports.push(8000);

  S.files['.devcontainer/devcontainer.json']=JSON.stringify({
    name:pn+' Dev Environment',
    dockerComposeFile:'docker-compose.yml',
    service:'app',
    workspaceFolder:'/workspace',
    customizations:{vscode:{extensions:exts.filter(Boolean),settings:{'editor.formatOnSave':true,'editor.defaultFormatter':'esbenp.prettier-vscode'}}},
    forwardPorts:ports,
    postCreateCommand:'bash .devcontainer/post-create.sh',
    features:{'ghcr.io/devcontainers/features/docker-in-docker:2':{}}
  },null,2);

  // Dockerfile
  let dockerLines=['FROM '+baseImage];
  if(isNode||isBaaS) dockerLines.push('RUN npm install -g pnpm@latest');
  else if(isPython) dockerLines.push('RUN pip install --upgrade pip');
  if(isSupabase) dockerLines.push('RUN npm install -g supabase@latest');
  if(isFirebase) dockerLines.push('RUN npm install -g firebase-tools@latest');
  dockerLines.push('WORKDIR /workspace');
  if(isNode||isBaaS){dockerLines.push('COPY package*.json ./','RUN npm install');}
  else if(isPython){dockerLines.push('COPY requirements.txt ./','RUN pip install -r requirements.txt');}
  dockerLines.push('COPY . .');
  S.files['.devcontainer/Dockerfile']=dockerLines.join('\n')+'\n';

  // Docker Compose
  let compose='version: \'3.8\'\nservices:\n  app:\n    build:\n      context: ..\n      dockerfile: .devcontainer/Dockerfile\n    volumes:\n      - ..:/workspace:cached\n    command: sleep infinity\n    ports:\n      - "3000:3000"\n';
  if(isSupabase) compose+='      - "54321:54321"\n      - "54322:54322"\n      - "54323:54323"\n';
  else if(isFirebase) compose+='      - "4000:4000"\n      - "9099:9099"\n';

  // DB service only for non-BaaS
  if(dbService==='postgres') compose+='  db:\n    image: postgres:16\n    environment:\n      POSTGRES_USER: dev\n      POSTGRES_PASSWORD: devpass\n      POSTGRES_DB: '+pn.toLowerCase().replace(/[^a-z0-9]/g,'_')+'\n    ports:\n      - "5432:5432"\n    volumes:\n      - pgdata:/var/lib/postgresql/data\nvolumes:\n  pgdata:\n';
  else if(dbService==='mongo') compose+='  db:\n    image: mongo:7\n    ports:\n      - "27017:27017"\n    volumes:\n      - mongodata:/data/db\nvolumes:\n  mongodata:\n';
  else if(dbService==='mysql') compose+='  db:\n    image: mysql:8\n    environment:\n      MYSQL_ROOT_PASSWORD: devpass\n      MYSQL_DATABASE: '+pn.toLowerCase().replace(/[^a-z0-9]/g,'_')+'\n    ports:\n      - "3306:3306"\n    volumes:\n      - mysqldata:/var/lib/mysql\nvolumes:\n  mysqldata:\n';

  S.files['.devcontainer/docker-compose.yml']=compose;

  // Post-create script
  const postLines=['#!/bin/bash','echo "🚀 Setting up '+pn+'..."'];
  if(isNode||isBaaS) postLines.push('npm install');
  else if(isPython) postLines.push('pip install -r requirements.txt');

  if(isSupabase){
    if(isLocal){
      postLines.push('','# Supabase local development','npx supabase init --force 2>/dev/null || true','npx supabase start','echo "📦 Supabase Studio: http://localhost:54323"');
    } else if(isCloud){
      postLines.push('','# Supabase cloud setup',G?'echo "☁️ クラウドモード: .env.localにプロジェクトURLとキーを設定してください"':'echo "☁️ Cloud mode: Set project URL and keys in .env.local"',G?'echo "  1. https://app.supabase.com でプロジェクト作成"':'echo "  1. Create project at https://app.supabase.com"',G?'echo "  2. Settings > API から URL とキーを取得"':'echo "  2. Get URL and keys from Settings > API"',G?'echo "  3. .env.local に貼り付け"':'echo "  3. Paste into .env.local"');
    } else if(isHybrid){
      postLines.push('','# Supabase hybrid setup (install but no auto-start)','npx supabase init --force 2>/dev/null || true',G?'echo "🔀 ハイブリッドモード: .env.localのDEV_MODEで切替"':'echo "🔀 Hybrid mode: Switch via DEV_MODE in .env.local"',G?'echo "  ローカル起動: npx supabase start"':'echo "  Start local: npx supabase start"',G?'echo "  クラウド接続: DEV_MODE=cloud"':'echo "  Cloud: DEV_MODE=cloud"');
    }
  } else if(isFirebase){
    if(isLocal){
      postLines.push('','# Firebase emulators','firebase init emulators --non-interactive 2>/dev/null || true','echo "📦 Start emulators with: firebase emulators:start"');
    } else if(isCloud){
      postLines.push('','# Firebase cloud setup',G?'echo "☁️ クラウドモード: firebase.jsonと.env.localを設定"':'echo "☁️ Cloud mode: Configure firebase.json and .env.local"',G?'echo "  1. https://console.firebase.google.com でプロジェクト作成"':'echo "  1. Create project at https://console.firebase.google.com"',G?'echo "  2. firebase login && firebase use --add"':'echo "  2. firebase login && firebase use --add"');
    } else if(isHybrid){
      postLines.push('','# Firebase hybrid setup','firebase init emulators --non-interactive 2>/dev/null || true',G?'echo "🔀 ハイブリッドモード: firebase use で切替"':'echo "🔀 Hybrid mode: Switch via firebase use"',G?'echo "  ローカル: firebase emulators:start"':'echo "  Local: firebase emulators:start"',G?'echo "  クラウド: firebase use production"':'echo "  Cloud: firebase use production"');
    }
  } else if(isNode&&dbService==='postgres'){
    if(orm.includes('Drizzle')){
      postLines.push('npx drizzle-kit push','echo "📦 Drizzle Studio: npx drizzle-kit studio"');
    } else if(orm.includes('TypeORM')){
      postLines.push('npx typeorm migration:run','echo "📦 TypeORM schema: npx typeorm schema:show"');
    } else if(orm.includes('Kysely')){
      postLines.push('npx kysely migrate:latest','echo "📦 Kysely migrations applied"');
    } else {
      postLines.push('npx prisma generate','npx prisma db push');
    }
  } else if(isPython&&dbService==='postgres'&&orm.includes('SQLAlchemy')){
    postLines.push('alembic upgrade head','echo "📦 Alembic migrations applied"');
  }

  postLines.push('','echo "✅ Setup complete! Run \'npm run dev\' to start."');
  S.files['.devcontainer/post-create.sh']=postLines.join('\n')+'\n';

  // .env.example — framework-aware prefix
  const envPrefix=fe.includes('Next')?'NEXT_PUBLIC_':fe.includes('Vite')||fe.includes('SPA')?'VITE_':'REACT_APP_';
  const envLines=['# Environment Variables','# Copy to .env.local and fill in values',''];
  if(isSupabase){
    if(isLocal){
      envLines.push('# Supabase (Local Development)',envPrefix+'SUPABASE_URL=http://localhost:54321',envPrefix+'SUPABASE_ANON_KEY=# Get from: npx supabase status','SUPABASE_SERVICE_ROLE_KEY=# Get from: npx supabase status');
    } else if(isCloud){
      envLines.push('# Supabase (Cloud)',envPrefix+'SUPABASE_URL=https://YOUR_PROJECT.supabase.co',envPrefix+'SUPABASE_ANON_KEY=your-anon-key','SUPABASE_SERVICE_ROLE_KEY=your-service-role-key','# Get keys from: https://app.supabase.com/project/_/settings/api');
    } else if(isHybrid){
      envLines.push('# Supabase (Hybrid Mode)','# Set DEV_MODE=local or DEV_MODE=cloud','DEV_MODE=local','','# Local',envPrefix+'SUPABASE_URL_LOCAL=http://localhost:54321',envPrefix+'SUPABASE_ANON_KEY_LOCAL=# Get from: npx supabase status','','# Cloud',envPrefix+'SUPABASE_URL_CLOUD=https://YOUR_PROJECT.supabase.co',envPrefix+'SUPABASE_ANON_KEY_CLOUD=your-anon-key','SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
    }
  } else if(isFirebase){
    if(isLocal){
      envLines.push('# Firebase (Local Emulators)',envPrefix+'FIREBASE_API_KEY=demo-key',envPrefix+'FIREBASE_AUTH_DOMAIN=localhost',envPrefix+'FIREBASE_PROJECT_ID=demo-project','# Emulators will auto-detect local mode');
    } else if(isCloud){
      envLines.push('# Firebase (Cloud)',envPrefix+'FIREBASE_API_KEY=your-api-key',envPrefix+'FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com',envPrefix+'FIREBASE_PROJECT_ID=your-project-id','# Get config from: https://console.firebase.google.com/project/_/settings/general');
    } else if(isHybrid){
      envLines.push('# Firebase (Hybrid Mode)','# Use firebase.json "emulators" section for local','# Use .firebaserc for project switching','',envPrefix+'FIREBASE_API_KEY=your-api-key',envPrefix+'FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com',envPrefix+'FIREBASE_PROJECT_ID=your-project-id');
    }
  } else if(dbService==='postgres'){
    envLines.push('# Database','DATABASE_URL=postgresql://dev:devpass@localhost:5432/'+pn.toLowerCase().replace(/[^a-z0-9]/g,'_'));
  }
  envLines.push('','# Auth','AUTH_SECRET=your-secret-here','');
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);
  if(hasPay&&a.payment.includes('Stripe')){
    envLines.push('# Stripe','STRIPE_SECRET_KEY=sk_test_xxx','STRIPE_WEBHOOK_SECRET=whsec_xxx',envPrefix+'STRIPE_PUBLISHABLE_KEY=pk_test_xxx','');
  }
  envLines.push('# Security','ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com','RATE_LIMIT_MAX=100','RATE_LIMIT_WINDOW_MS=60000','');
  S.files['.env.example']=envLines.join('\n');

  // .gitattributes — enforce LF line endings
  S.files['.gitattributes']=[
    '# Auto-detect text and normalize line endings',
    '* text=auto','',
    '*.js text eol=lf','*.ts text eol=lf','*.jsx text eol=lf','*.tsx text eol=lf',
    '*.json text eol=lf','*.md text eol=lf','*.yml text eol=lf','*.yaml text eol=lf',
    '*.css text eol=lf','*.html text eol=lf','*.sh text eol=lf','*.env text eol=lf','',
    '*.png binary','*.jpg binary','*.jpeg binary','*.gif binary',
    '*.ico binary','*.woff binary','*.woff2 binary','*.pdf binary'
  ].join('\n')+'\n';

  // .editorconfig — editor settings
  S.files['.editorconfig']=[
    'root = true','','[*]','indent_style = space','indent_size = 2',
    'end_of_line = lf','charset = utf-8','trim_trailing_whitespace = true',
    'insert_final_newline = true','','[*.md]','trim_trailing_whitespace = false',
    '','[Makefile]','indent_style = tab'
  ].join('\n')+'\n';

  // docs/64_cross_platform_guide.md
  const cpg=[];
  cpg.push(G?'# クロスプラットフォーム開発ガイド':'# Cross-Platform Development Guide','');
  cpg.push(G?'## 概要':'## Overview','');
  cpg.push(G?'このプロジェクトは、Windows/Mac/Linux のどの環境でも同じように動作するよう設計されています。':'This project is designed to work consistently across Windows, Mac, and Linux.','');
  cpg.push(G?'## 改行コード統一 (.gitattributes)':'## Line Ending Normalization (.gitattributes)','');
  cpg.push(G?'`.gitattributes` ファイルにより、全てのテキストファイルがLF改行コードで統一されます。':'The `.gitattributes` file ensures all text files use LF line endings.','');
  cpg.push(G?'- **Windows対策**: CRLFで保存されたファイルも、Git経由で自動的にLFに変換されます':'- **Windows fix**: Files saved with CRLF are automatically converted to LF via Git','- '+(G?'シェルスクリプト実行エラー（`\\r` command not found）を防止':'Prevents shell script errors (`\\r` command not found)'),'');
  cpg.push(G?'## エディタ設定 (.editorconfig)':'## Editor Config (.editorconfig)','');
  cpg.push(G?'`.editorconfig` ファイルにより、エディタの設定が統一されます：':'The `.editorconfig` file standardizes editor settings:','');
  cpg.push(G?'- インデント: スペース2個':'- Indent: 2 spaces',G?'- 改行: LF':'- Line ending: LF',G?'- 文字コード: UTF-8':'- Charset: UTF-8',G?'- 末尾空白: 自動削除':'- Trailing whitespace: auto-remove','');
  cpg.push(G?'## DevContainer環境':'## DevContainer Environment','');
  cpg.push(G?'DevContainerはDocker上でLinux環境を起動するため、OS依存の問題を完全に解消します。':'DevContainers run Linux environments in Docker, eliminating OS-specific issues entirely.','');
  if(isBaaS){
    cpg.push('',G?'## 開発環境タイプ':'## Development Environment Type','');
    if(isLocal){
      cpg.push(G?'**選択されたモード**: ローカル開発':'**Selected mode**: Local Development','');
      cpg.push(G?'- エミュレーターが自動起動します（`post-create.sh`）':'- Emulators auto-start via `post-create.sh`',G?'- オフラインでも開発可能':'- Offline development supported',G?'- `.env.local` にローカル接続情報を設定':'- Configure local connection in `.env.local`');
    } else if(isCloud){
      cpg.push(G?'**選択されたモード**: クラウド接続':'**Selected mode**: Cloud Direct','');
      cpg.push(G?'- エミュレーターはインストールされません':'- Emulators are not installed',G?'- リモートBaaSに直接接続':'- Connects directly to remote BaaS',G?'- `.env.local` にクラウドプロジェクトのURLとキーを設定':'- Configure cloud project URL and keys in `.env.local`');
    } else if(isHybrid){
      cpg.push(G?'**選択されたモード**: ハイブリッド':'**Selected mode**: Hybrid','');
      cpg.push(G?'- エミュレーターはインストールされますが、自動起動しません':'- Emulators installed but do not auto-start',G?'- `.env.local` の `DEV_MODE` で切替':'- Switch via `DEV_MODE` in `.env.local`',G?'- ローカル: `DEV_MODE=local` + エミュレーター起動':'- Local: `DEV_MODE=local` + start emulators',G?'- クラウド: `DEV_MODE=cloud` + クラウド接続情報':'- Cloud: `DEV_MODE=cloud` + cloud credentials');
    }
  }
  cpg.push('',G?'## トラブルシューティング':'## Troubleshooting','');
  cpg.push(G?'### シェルスクリプトが動かない（`\\r` エラー）':'### Shell script errors (`\\r` not found)','');
  cpg.push(G?'**原因**: Windows環境でCRLF改行が混入':'**Cause**: CRLF line endings on Windows','');
  cpg.push(G?'**解決策**:':'**Solution**:');
  cpg.push('```bash');
  cpg.push('git add --renormalize .');
  cpg.push('git commit -m "chore: normalize line endings"');
  cpg.push('```','');
  cpg.push(G?'### EditorConfigが反映されない':'### EditorConfig not working','');
  cpg.push(G?'**解決策**: エディタにEditorConfig拡張をインストール':'**Solution**: Install EditorConfig extension in your editor','- VS Code: `EditorConfig.EditorConfig`','- JetBrains: Built-in','- Vim: `editorconfig/editorconfig-vim`','');
  cpg.push(G?'### DevContainerが起動しない':'### DevContainer fails to start','');
  cpg.push(G?'**確認項目**:':'**Checklist**:',G?'1. Dockerデーモンが起動しているか':'1. Docker daemon running?',G?'2. WSL2が有効か（Windows）':'2. WSL2 enabled? (Windows)',G?'3. `.devcontainer/devcontainer.json` が正しいか':'3. `.devcontainer/devcontainer.json` valid?','');
  cpg.push(G?'## 関連ドキュメント':'## Related Documents','');
  cpg.push(G?'- `.devcontainer/README.md` — DevContainer詳細設定':'- `.devcontainer/README.md` — DevContainer details',G?'- `docs/34_devops_guide.md` — CI/CD設定':'- `docs/34_devops_guide.md` — CI/CD setup',G?'- `docs/02_architecture.md` — システムアーキテクチャ':'- `docs/02_architecture.md` — System architecture');
  S.files['docs/64_cross_platform_guide.md']=cpg.join('\n')+'\n';
}

