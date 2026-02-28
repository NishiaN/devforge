/* ── Pillar ⑤ Parallel Explorer (Enhanced with Recommendation) ── */
function showExplorer(){
  pushView({pillar:4,type:'explorer',file:null});
  const body=$('prevBody');const _ja=S.lang==='ja';
  const stacks={
    'Next.js + Supabase':{fe:'React + Next.js',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:4,eco:5,best:_ja?'MVP・SaaS':'MVP / SaaS',tags:['saas','mvp','stripe','auth'],orm:'Prisma',
      pros:_ja?['Supabase Auth/DB統合が簡単','Vercelデプロイ最適化','スタートが最速']:['Easy Supabase Auth/DB integration','Optimized for Vercel','Fastest to start'],
      cons:_ja?['バックエンドロジック制限','Supabase依存が高い']:['Backend logic constraints','High Supabase vendor lock-in']},
    'Next.js + Express + PG':{fe:'React + Next.js',be:'Express',db:'PostgreSQL',deploy:'Vercel+Railway',cost:'$0–$20',speed:4,scale:4,learn:3,eco:5,best:_ja?'フルスタック学習':'Full-stack learning',tags:['fullstack','api','stripe'],orm:'Prisma',
      pros:_ja?['Express高い自由度','学習資料が豊富','PostgreSQL信頼性']:['High Express flexibility','Abundant learning resources','PostgreSQL reliability'],
      cons:_ja?['インフラ管理が複雑','2サーバー管理が必要']:['Complex infrastructure management','Two servers to manage']},
    'Next.js + NestJS + PG':{fe:'React + Next.js',be:'NestJS',db:'PostgreSQL',deploy:'AWS',cost:'$10–$50',speed:3,scale:5,learn:2,eco:4,best:_ja?'エンタープライズ':'Enterprise',tags:['enterprise','rbac','team','ddd'],orm:'TypeORM',
      pros:_ja?['エンタープライズDI設計','完全TypeScript対応','モジュール構造が明確']:['Enterprise DI design','Full TypeScript support','Clear module structure'],
      cons:_ja?['学習コスト最高','初期設定が重い']:['Highest learning cost','Heavy initial setup']},
    'Nuxt + Supabase':{fe:'Vue 3 + Nuxt',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:5,eco:3,best:_ja?'Vue好き':'Vue fans',tags:['vue','mvp','saas'],orm:'Prisma',
      pros:_ja?['Vue自動インポートで快適','SSR/SSG柔軟対応','Supabase統合']:['Comfortable Vue auto-imports','Flexible SSR/SSG','Supabase integration'],
      cons:_ja?['Reactより情報が少ない','エコシステムが小さめ']:['Less resources than React','Smaller ecosystem']},
    'SvelteKit + Supabase':{fe:'SvelteKit',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:4,eco:2,best:_ja?'軽量・高速':'Lightweight & fast',tags:['perf','mvp','lightweight'],orm:'Prisma',
      pros:_ja?['コンパイル型で高速','シンプルな構文','軽量バンドル']:['Fast compiled output','Simple syntax','Lightweight bundle'],
      cons:_ja?['Reactよりエコシステム小','採用事例が少ない']:['Smaller ecosystem than React','Fewer adoption examples']},
    'Next.js + FastAPI + Mongo':{fe:'React + Next.js',be:'FastAPI',db:'MongoDB',deploy:'Vercel+Railway',cost:'$0–$30',speed:4,scale:4,learn:3,eco:4,best:_ja?'AI/ML統合':'AI/ML integration',tags:['ai','ml','python','data'],orm:'SQLAlchemy',
      pros:_ja?['AI/MLバックエンドに最適','NoSQLの柔軟性','Pythonデータ処理力']:['Ideal for AI/ML backend','NoSQL flexibility','Python data processing power'],
      cons:_ja?['2言語管理が複雑','MongoDBスキーマ設計難']:['Complex dual-language management','MongoDB schema design challenges']},
    'Expo + Supabase':{fe:'Expo (RN)',be:'Supabase',db:'PostgreSQL',deploy:'EAS Build',cost:'$0–$30',speed:4,scale:3,learn:3,eco:3,best:_ja?'モバイルアプリ':'Mobile app',tags:['mobile','expo','native'],orm:'Prisma',
      pros:_ja?['クロスプラットフォーム(iOS/Android)','EAS Build完備','Supabase統合']:['Cross-platform (iOS/Android)','EAS Build included','Supabase integration'],
      cons:_ja?['ネイティブ機能に制限あり','ストア審査が必要']:['Native feature limitations','App store review required']},
    'Astro + Supabase':{fe:'Astro',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:5,eco:3,best:_ja?'コンテンツ・ブログ':'Content & Blog',tags:['content','blog','static','mvp'],orm:'Prisma',
      pros:_ja?['コンテンツサイト最適','静的優先で高速','Islandsアーキテクチャ']:['Ideal for content sites','Static-first performance','Islands architecture'],
      cons:_ja?['SPAに不向き','動的機能が制限']:['Not suitable for SPA','Dynamic feature constraints']},
    'Next.js + Hono + D1':{fe:'React + Next.js',be:'Hono',db:'Cloudflare D1',deploy:'Cloudflare Pages',cost:'$0–$5',speed:5,scale:4,learn:3,eco:3,best:_ja?'エッジネイティブ':'Edge-native',tags:['edge','global','perf'],orm:'Drizzle',
      pros:_ja?['エッジ最速応答','Cloudflare KV活用','ゼロコールドスタート']:['Fastest edge response','Cloudflare KV integration','Zero cold starts'],
      cons:_ja?['D1はSQLite制限あり','エコシステムが新興']:['D1 has SQLite limitations','Emerging ecosystem']},
    'Nuxt + Express + PG':{fe:'Vue 3 + Nuxt',be:'Express',db:'PostgreSQL',deploy:'Railway',cost:'$0–$20',speed:4,scale:4,learn:4,eco:3,best:_ja?'Vueフルスタック':'Vue full-stack',tags:['vue','fullstack','api','stripe'],orm:'Prisma',
      pros:_ja?['Vue+フル制御バックエンド','Railway簡単デプロイ','PostgreSQL堅牢']:['Vue + full backend control','Easy Railway deploy','Robust PostgreSQL'],
      cons:_ja?['2サーバー管理','設定が複雑']:['Two servers to manage','Complex configuration']},
    'SvelteKit + Express + PG':{fe:'SvelteKit',be:'Express',db:'PostgreSQL',deploy:'Railway',cost:'$0–$20',speed:4,scale:4,learn:4,eco:2,best:_ja?'軽量フルスタック':'Lightweight full-stack',tags:['perf','fullstack','api'],orm:'Prisma',
      pros:_ja?['軽量フロント+堅牢バックエンド','フル制御','Railway簡単デプロイ']:['Lightweight front + robust backend','Full control','Easy Railway deploy'],
      cons:_ja?['Svelte採用事例が少ない','エコシステムが小さい']:['Few Svelte adoption examples','Small ecosystem']},
    'Next.js + FastAPI + PG':{fe:'React + Next.js',be:'FastAPI',db:'PostgreSQL',deploy:'Vercel+Fly.io',cost:'$5–$30',speed:4,scale:4,learn:3,eco:4,best:_ja?'AI統合・SQL':'AI + SQL backend',tags:['ai','ml','python','data','stripe'],orm:'SQLAlchemy',
      pros:_ja?['AI+SQL最強コンボ','FastAPI高速','PostgreSQL信頼性']:['Best AI + SQL combination','FastAPI performance','PostgreSQL reliability'],
      cons:_ja?['2言語管理が複雑','デプロイ2サーバー必要']:['Complex dual-language','Two servers for deploy']},
    'T3 Stack (tRPC)':{fe:'React + Next.js',be:'tRPC + NextAuth',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:4,scale:4,learn:3,eco:4,best:_ja?'型安全フルスタック':'Type-safe full-stack',tags:['saas','fullstack','auth','typesafe'],orm:'Prisma',
      pros:_ja?['エンドツーエンド型安全','NextAuthで認証が簡単','Vercelデプロイ最適化']:['End-to-end type safety','Easy auth with NextAuth','Optimized for Vercel'],
      cons:_ja?['tRPC学習コスト有り','REST APIとの互換なし']:['tRPC learning curve','No REST API compatibility']},
    'Remix + Drizzle':{fe:'React + Remix',be:'Remix loader',db:'PostgreSQL',deploy:'Fly.io',cost:'$0–$20',speed:5,scale:4,learn:3,eco:3,best:_ja?'パフォーマンス重視フルスタック':'Performance-first full-stack',tags:['fullstack','perf'],orm:'Drizzle',
      pros:_ja?['ネイティブフォームサポート','サーバーファースト設計','DX良好なローダーAPI']:['Native form support','Server-first design','Clean loader API'],
      cons:_ja?['Nextより情報少ない','学習曲線がある']:['Less resources than Next.js','Learning curve']},
    'Bun + Hono + Turso':{fe:'(API only)',be:'Hono (Bun)',db:'Turso (libSQL)',deploy:'Cloudflare Workers',cost:'$0–$5',speed:5,scale:4,learn:3,eco:2,best:_ja?'超軽量APIサーバー':'Ultra-lightweight API',tags:['edge','api','perf','lightweight'],orm:'Drizzle',
      pros:_ja?['超高速 (Bun runtime)','エッジデプロイ最適','コスト最小']:['Ultra-fast (Bun runtime)','Optimized for edge deploy','Minimum cost'],
      cons:_ja?['フロントエンドは別途必要','エコシステムが新興']:['Frontend needs separate setup','Emerging ecosystem']},
    'Deno + Fresh + Supabase':{fe:'Fresh (Preact)',be:'Deno',db:'PostgreSQL',deploy:'Deno Deploy',cost:'$0–$10',speed:5,scale:3,learn:4,eco:2,best:_ja?'セキュアエッジアプリ':'Secure edge app',tags:['edge','perf','lightweight'],orm:'none',
      pros:_ja?['セキュリティファースト設計','アイランドアーキテクチャ','TypeScript標準対応']:['Security-first design','Islands architecture','TypeScript built-in'],
      cons:_ja?['エコシステムが最も小さい','npm互換に一部制限']:['Smallest ecosystem','Some npm compatibility limits']},
    'Django + HTMX + PG':{fe:'HTMX',be:'Django',db:'PostgreSQL',deploy:'Fly.io',cost:'$5–$20',speed:4,scale:4,learn:4,eco:4,best:_ja?'Python企業向けフルスタック':'Python enterprise full-stack',tags:['fullstack','python','enterprise'],orm:'SQLAlchemy',
      pros:_ja?['最強のAdmin画面','Pythonエコシステム活用','成熟したORM']:['Powerful built-in admin','Python ecosystem leverage','Mature ORM'],
      cons:_ja?['JSなしのリアルタイム制限','モダンUXに制約']:['Real-time limits without JS','Modern UX constraints']},
  };
  const names=Object.keys(stacks);const a=S.answers;
  const bar=v=>'⚡'.repeat(v)+'<span class="exp-dim">'+'⚡'.repeat(5-v)+'</span>';
  const metrics=_ja
    ?[['開発速度','speed'],['スケーラビリティ','scale'],['学習容易性','learn'],['エコシステム','eco']]
    :[['Dev Speed','speed'],['Scalability','scale'],['Learnability','learn'],['Ecosystem','eco']];

  /* ════ Answer-Based Scoring Engine (Extended) ════ */
  function scoreStack(name,stack){
    let score=0;const reasons=[];
    const skill=S.skill||'intermediate';
    const feAns=(a.frontend||'').toLowerCase();
    const beAns=(a.backend||'').toLowerCase();
    const mob=(a.mobile||'').toLowerCase();
    const pay=(a.payment||'').toLowerCase();
    const aiAuto=(a.ai_auto||'').toLowerCase();
    const dbAns=(a.database||'').toLowerCase();
    const depAns=(a.deploy||'').toLowerCase();
    const ormAns=(a.orm||'').toLowerCase();

    // 1. Skill match (0-25)
    if(skill==='beginner'&&stack.learn>=4){score+=25;reasons.push(_ja?'初心者に学びやすい':'Beginner-friendly');}
    else if(skill==='beginner'&&stack.learn>=3){score+=15;}
    else if(skill==='intermediate'&&stack.learn>=3&&stack.eco>=4){score+=20;reasons.push(_ja?'中級者に最適なバランス':'Good balance for intermediates');}
    else if(skill==='pro'&&stack.scale>=4){score+=20;reasons.push(_ja?'プロ向けスケーラビリティ':'Pro-grade scalability');}

    // 2. Frontend match (0-20)
    if(feAns.includes('react')&&stack.fe.includes('React')){score+=20;reasons.push(_ja?'フロントエンド一致':'Frontend match');}
    else if(feAns.includes('vue')&&stack.fe.includes('Vue')){score+=20;reasons.push(_ja?'Vue選択に一致':'Vue selection match');}
    else if(feAns.includes('svelte')&&stack.fe.includes('Svelte')){score+=20;reasons.push(_ja?'Svelte選択に一致':'Svelte selection match');}
    else if(feAns.includes('astro')&&stack.fe==='Astro'){score+=20;reasons.push(_ja?'Astro選択に一致':'Astro selection match');}

    // 3. Backend match (0-15)
    if(beAns.includes('supabase')&&stack.be==='Supabase'){score+=15;reasons.push(_ja?'Supabase選択に一致':'Supabase match');}
    else if(beAns.includes('express')&&stack.be==='Express'){score+=15;reasons.push(_ja?'Express選択に一致':'Express match');}
    else if(beAns.includes('nest')&&stack.be==='NestJS'){score+=15;reasons.push(_ja?'NestJS選択に一致':'NestJS match');}
    else if(beAns.includes('fastapi')&&stack.be==='FastAPI'){score+=15;reasons.push(_ja?'FastAPI選択に一致':'FastAPI match');}
    else if(beAns.includes('hono')&&(stack.be==='Hono'||stack.be.includes('Hono'))){score+=15;reasons.push(_ja?'Hono選択に一致':'Hono match');}
    else if(beAns.includes('django')&&stack.be==='Django'){score+=15;reasons.push(_ja?'Django選択に一致':'Django match');}

    // 4. Mobile (0-15)
    if(mob&&mob!=='none'&&stack.tags.includes('mobile')){score+=15;reasons.push(_ja?'モバイル対応':'Mobile support');}

    // 5. Payment (0-10)
    if(pay&&pay!=='none'&&stack.tags.includes('stripe')){score+=10;reasons.push(_ja?'決済連携可能':'Payment integration');}

    // 6. AI/Autonomous (0-10)
    if(aiAuto&&aiAuto!=='none'&&stack.tags.includes('ai')){score+=10;reasons.push(_ja?'AI/ML統合に最適':'AI/ML integration fit');}

    // 7. Speed bonus (always counted, 0-5)
    score+=stack.speed;

    // 8. DB match (0-5)
    if(dbAns){
      const dbKey=dbAns.replace(/[^a-z]/g,'').slice(0,8);
      if(dbKey&&stack.db.toLowerCase().replace(/[^a-z]/g,'').includes(dbKey)){
        score+=5;reasons.push(_ja?'DB一致':'DB match');
      }
    }

    // 9. Deploy match (0-5)
    if(depAns){
      const depKey=(depAns.split(/[+\/\s]/)[0]||'').replace(/[^a-z]/g,'');
      if(depKey&&stack.deploy.toLowerCase().replace(/[^a-z]/g,'').includes(depKey)){
        score+=5;reasons.push(_ja?'デプロイ一致':'Deploy match');
      }
    }

    // 10. ORM match (0-5)
    if(ormAns&&stack.orm&&stack.orm!=='none'){
      const so=stack.orm.toLowerCase();
      if((ormAns.includes('prisma')&&so.includes('prisma'))||
         (ormAns.includes('drizzle')&&so.includes('drizzle'))||
         (ormAns.includes('typeorm')&&so.includes('typeorm'))||
         (ormAns.includes('sqlalchemy')&&so.includes('sqlalchemy'))){
        score+=5;reasons.push(_ja?'ORM一致':'ORM match');
      }
    }

    return {name,score,reasons,stack};
  }

  /* ── Rank all stacks ── */
  const ranked=names.map(n=>scoreStack(n,stacks[n])).sort((a,b)=>b.score-a.score);
  const medals=['🥇','🥈','🥉'];
  const hasAnswers=Object.keys(a).length>2;

  /* ════ RENDER ════ */
  let h=`<div class="exp-header"><h3>⚡ ${_ja?'並列実装探索 — スタック比較':'Parallel Explorer — Stack Comparison'}</h3>
  <p>${_ja?'現在の選択':'Current'}: <strong class="exp-current">${esc(a.frontend||'React + Next.js')} + ${esc(a.backend||'Express')}</strong> — ${_ja?'2つのスタックを比較':'Compare 2 stacks'}</p></div>`;

  /* ── Category Filter ── */
  const filterTags=_ja
    ?[['all','全て'],['mvp','MVP'],['enterprise','エンタープライズ'],['ai','AI/ML'],['edge','エッジ'],['python','Python'],['mobile','モバイル'],['lightweight','軽量']]
    :[['all','All'],['mvp','MVP'],['enterprise','Enterprise'],['ai','AI/ML'],['edge','Edge'],['python','Python'],['mobile','Mobile'],['lightweight','Lightweight']];
  h+=`<div class="exp-filter" id="expFilter">`;
  filterTags.forEach(([tag,label],i)=>{
    h+=`<button class="exp-filter-chip${i===0?' exp-filter-on':''}" onclick="filterExpStacks('${tag}',this)">${label}</button>`;
  });
  h+=`</div>`;

  /* ── Recommendation Ranking ── */
  if(hasAnswers){
    h+=`<div class="exp-ranking"><h4>📊 ${_ja?'あなたへのおすすめ（回答に基づくスコア）':'Recommended for You (Score based on your answers)'}</h4>`;
    ranked.forEach((r,i)=>{
      const medal=i<3?medals[i]:'';
      const isTop=i===0;
      const w=Math.max(8,Math.round(r.score/ranked[0].score*100));
      h+=`<div class="exp-rank-row${isTop?' exp-rank-top':''}" data-tags="${r.stack.tags.join(',')}" onclick="autoSelectStack('${r.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();autoSelectStack('${r.name}');}" role="button" tabindex="0">
        <div class="exp-rank-left">
          <span class="exp-rank-medal">${medal||`#${i+1}`}</span>
          <span class="exp-rank-name">${r.name}</span>
        </div>
        <div class="exp-rank-right">
          <div class="exp-rank-bar"><div class="exp-rank-bar-fill" style="width:${w}%"></div></div>
          <span class="exp-rank-score">${r.score}${_ja?'点':'pt'}</span>
        </div>
      </div>`;
      if(r.reasons.length>0&&i<3){
        h+=`<div class="exp-rank-reasons" data-tags="${r.stack.tags.join(',')}">${r.reasons.map(rs=>`<span class="exp-rank-tag">${rs}</span>`).join('')}</div>`;
      }
    });
    h+=`</div>`;
  }

  /* ── Comparison selectors ── */
  h+=`<div class="exp-select"><h4>${_ja?'🔀 比較':'🔀 Compare'}</h4><select id="expA" onchange="renderExpCompare()">${names.map((n,i)=>`<option value="${i}" ${n===ranked[0].name?'selected':''}>${n}</option>`).join('')}</select>`;
  h+=`<select id="expB" onchange="renderExpCompare()">${names.map((n,i)=>`<option value="${i}" ${n===(ranked[1]||ranked[0]).name?'selected':''}>${n}</option>`).join('')}</select></div>`;
  h+='<div id="expCompare"></div>';
  body.innerHTML=h;

  const rowLabels=_ja
    ?{fe:'フロント',be:'バック',db:'DB',deploy:'デプロイ',cost:'月額目安'}
    :{fe:'Frontend',be:'Backend',db:'DB',deploy:'Deploy',cost:'Est. Cost'};

  const renderComp=()=>{
    const iA=parseInt($('expA').value);const iB=parseInt($('expB').value);
    const sA=stacks[names[iA]];const sB=stacks[names[iB]];
    let c='<div class="exp-compare">';
    [['A',names[iA],sA],['B',names[iB],sB]].forEach(([label,name,s])=>{
      c+=`<div class="exp-col"><h3>${label}: ${name}</h3>`;
      ['fe','be','db','deploy','cost'].forEach(k=>{
        c+=`<div class="exp-row"><span class="label">${rowLabels[k]}</span><span class="val">${s[k]}</span></div>`;
      });
      c+='<div class="exp-metrics-sep">';
      metrics.forEach(([label,key])=>{c+=`<div class="exp-row"><span class="label">${label}</span><span class="val">${bar(s[key])}</span></div>`;});
      c+=`</div><div class="exp-verdict"><h4>${_ja?'最適用途':'Best For'}</h4><p>${s.best}</p></div>`;
      if(s.pros&&s.pros.length){c+=`<div class="exp-pros"><h4>✅ ${_ja?'利点':'Pros'}</h4><ul>${s.pros.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`;}
      if(s.cons&&s.cons.length){c+=`<div class="exp-cons"><h4>⚡ ${_ja?'注意点':'Cons'}</h4><ul>${s.cons.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></div>`;}
      c+=`</div>`;
    });
    c+='</div>';
    const scoreA=metrics.reduce((s,m)=>s+sA[m[1]],0);const scoreB=metrics.reduce((s,m)=>s+sB[m[1]],0);
    c+=`<div class="road-summary">
      <strong>${_ja?'総合スコア':'Total Score'}:</strong> ${names[iA]} = ${scoreA}/20 vs ${names[iB]} = ${scoreB}/20
      ${scoreA>scoreB?`<br><span class="exp-win">→ ${names[iA]} ${_ja?'が総合的に優位':'wins overall'}</span>`:scoreB>scoreA?`<br><span class="exp-win">→ ${names[iB]} ${_ja?'が総合的に優位':'wins overall'}</span>`:`<br><span class="exp-tie">→ ${_ja?'ほぼ同等、用途で選択':'Nearly equal — choose by use case'}</span>`}
    </div>`;
    $('expCompare').innerHTML=c;
  };
  window.renderExpCompare=renderComp;
  renderComp();
}

/* ── Category Filter for Explorer ── */
function filterExpStacks(tag,btn){
  document.querySelectorAll('.exp-filter-chip').forEach(c=>c.classList.remove('exp-filter-on'));
  if(btn)btn.classList.add('exp-filter-on');
  document.querySelectorAll('.exp-rank-row,.exp-rank-reasons').forEach(r=>{
    if(tag==='all'||!r.dataset.tags){r.style.display='';return;}
    r.style.display=r.dataset.tags.split(',').includes(tag)?'':'none';
  });
}

/* ── Auto-select stack from ranking click ── */
function autoSelectStack(name){
  const sel=$('expA');if(!sel)return;
  for(let i=0;i<sel.options.length;i++){
    if(sel.options[i].text===name){sel.value=i;break;}
  }
  renderExpCompare();
  $('expCompare').scrollIntoView({behavior:'smooth',block:'nearest'});
}
