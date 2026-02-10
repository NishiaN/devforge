/* ── Pillar ② DevContainer (Phase B: BaaS-Aware) ── */
function genPillar2_DevContainer(a,pn){
  const G=S.genLang==='ja';
  const fe=a.frontend||'React';
  const be=a.backend||'Node.js + Express';
  const db=a.database||'PostgreSQL';
  const orm=a.orm||'';
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
    postLines.push('','# Supabase local development','npx supabase init --force 2>/dev/null || true','npx supabase start','echo "📦 Supabase Studio: http://localhost:54323"');
  } else if(isFirebase){
    postLines.push('','# Firebase emulators','firebase init emulators --non-interactive 2>/dev/null || true','echo "📦 Start emulators with: firebase emulators:start"');
  } else if(isNode&&dbService==='postgres'){
    if(orm.includes('Drizzle')){
      postLines.push('npx drizzle-kit push','echo "📦 Drizzle Studio: npx drizzle-kit studio"');
    } else {
      postLines.push('npx prisma generate','npx prisma db push');
    }
  }

  postLines.push('','echo "✅ Setup complete! Run \'npm run dev\' to start."');
  S.files['.devcontainer/post-create.sh']=postLines.join('\n')+'\n';

  // .env.example — framework-aware prefix
  const envPrefix=fe.includes('Next')?'NEXT_PUBLIC_':fe.includes('Vite')||fe.includes('SPA')?'VITE_':'REACT_APP_';
  const envLines=['# Environment Variables','# Copy to .env.local and fill in values',''];
  if(isSupabase){
    envLines.push('# Supabase',envPrefix+'SUPABASE_URL=http://localhost:54321',envPrefix+'SUPABASE_ANON_KEY=your-anon-key','SUPABASE_SERVICE_ROLE_KEY=your-service-role-key');
  } else if(isFirebase){
    envLines.push('# Firebase',envPrefix+'FIREBASE_API_KEY=',envPrefix+'FIREBASE_AUTH_DOMAIN=',envPrefix+'FIREBASE_PROJECT_ID=');
  } else if(dbService==='postgres'){
    envLines.push('# Database','DATABASE_URL=postgresql://dev:devpass@localhost:5432/'+pn.toLowerCase().replace(/[^a-z0-9]/g,'_'));
  }
  envLines.push('','# Auth','AUTH_SECRET=your-secret-here','');
  const hasPay=a.payment&&!/なし|None|none/.test(a.payment);
  if(hasPay&&a.payment.includes('Stripe')){
    envLines.push('# Stripe','STRIPE_SECRET_KEY=sk_test_xxx','STRIPE_WEBHOOK_SECRET=whsec_xxx',envPrefix+'STRIPE_PUBLISHABLE_KEY=pk_test_xxx','');
  }
  S.files['.env.example']=envLines.join('\n');
}

