/* ── Pillar ⑤ Parallel Explorer (Enhanced with Recommendation) ── */
function showExplorer(){
  pushView({pillar:4,type:'explorer',file:null});
  const body=$('prevBody');const _ja=S.lang==='ja';
  const stacks={
    'Next.js + Supabase':{fe:'React + Next.js',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:4,eco:5,best:_ja?'MVP・SaaS':'MVP / SaaS',tags:['saas','mvp','stripe','auth']},
    'Next.js + Express + PG':{fe:'React + Next.js',be:'Express',db:'PostgreSQL',deploy:'Vercel+Railway',cost:'$0–$20',speed:4,scale:4,learn:3,eco:5,best:_ja?'フルスタック学習':'Full-stack learning',tags:['fullstack','api','stripe']},
    'Next.js + NestJS + PG':{fe:'React + Next.js',be:'NestJS',db:'PostgreSQL',deploy:'AWS',cost:'$10–$50',speed:3,scale:5,learn:2,eco:4,best:_ja?'エンタープライズ':'Enterprise',tags:['enterprise','rbac','team','ddd']},
    'Nuxt + Supabase':{fe:'Vue 3 + Nuxt',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:5,eco:3,best:_ja?'Vue好き':'Vue fans',tags:['vue','mvp','saas']},
    'SvelteKit + Supabase':{fe:'SvelteKit',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:4,eco:2,best:_ja?'軽量・高速':'Lightweight & fast',tags:['perf','mvp','lightweight']},
    'Next.js + FastAPI + Mongo':{fe:'React + Next.js',be:'FastAPI',db:'MongoDB',deploy:'Vercel+Railway',cost:'$0–$30',speed:4,scale:4,learn:3,eco:4,best:_ja?'AI/ML統合':'AI/ML integration',tags:['ai','ml','python','data']},
    'Expo + Supabase':{fe:'Expo (RN)',be:'Supabase',db:'PostgreSQL',deploy:'EAS Build',cost:'$0–$30',speed:4,scale:3,learn:3,eco:3,best:_ja?'モバイルアプリ':'Mobile app',tags:['mobile','expo','native']},
    'Astro + Supabase':{fe:'Astro',be:'Supabase',db:'PostgreSQL',deploy:'Vercel',cost:'$0–$25',speed:5,scale:3,learn:5,eco:3,best:_ja?'コンテンツ・ブログ':'Content & Blog',tags:['content','blog','static','mvp']},
    'Next.js + Hono + D1':{fe:'React + Next.js',be:'Hono',db:'Cloudflare D1',deploy:'Cloudflare Pages',cost:'$0–$5',speed:5,scale:4,learn:3,eco:3,best:_ja?'エッジネイティブ':'Edge-native',tags:['edge','global','perf']},
    'Nuxt + Express + PG':{fe:'Vue 3 + Nuxt',be:'Express',db:'PostgreSQL',deploy:'Railway',cost:'$0–$20',speed:4,scale:4,learn:4,eco:3,best:_ja?'Vueフルスタック':'Vue full-stack',tags:['vue','fullstack','api','stripe']},
    'SvelteKit + Express + PG':{fe:'SvelteKit',be:'Express',db:'PostgreSQL',deploy:'Railway',cost:'$0–$20',speed:4,scale:4,learn:4,eco:2,best:_ja?'軽量フルスタック':'Lightweight full-stack',tags:['perf','fullstack','api']},
    'Next.js + FastAPI + PG':{fe:'React + Next.js',be:'FastAPI',db:'PostgreSQL',deploy:'Vercel+Fly.io',cost:'$5–$30',speed:4,scale:4,learn:3,eco:4,best:_ja?'AI統合・SQL':'AI + SQL backend',tags:['ai','ml','python','data','stripe']},
  };
  const names=Object.keys(stacks);const a=S.answers;
  const bar=v=>'⚡'.repeat(v)+'<span class="exp-dim">'+'⚡'.repeat(5-v)+'</span>';
  const metrics=_ja
    ?[['開発速度','speed'],['スケーラビリティ','scale'],['学習容易性','learn'],['エコシステム','eco']]
    :[['Dev Speed','speed'],['Scalability','scale'],['Learnability','learn'],['Ecosystem','eco']];

  /* ════ NEW: Answer-Based Scoring Engine ════ */
  function scoreStack(name,stack){
    let score=0;const reasons=[];
    const skill=S.skill||'intermediate';
    const feAns=(a.frontend||'').toLowerCase();
    const beAns=(a.backend||'').toLowerCase();
    const mob=(a.mobile||'').toLowerCase();
    const pay=(a.payment||'').toLowerCase();
    const aiAuto=(a.ai_auto||'').toLowerCase();

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
    else if(beAns.includes('hono')&&stack.be==='Hono'){score+=15;reasons.push(_ja?'Hono選択に一致':'Hono match');}

    // 4. Mobile (0-15)
    if(mob&&mob!=='none'&&stack.tags.includes('mobile')){score+=15;reasons.push(_ja?'モバイル対応':'Mobile support');}

    // 5. Payment (0-10)
    if(pay&&pay!=='none'&&stack.tags.includes('stripe')){score+=10;reasons.push(_ja?'決済連携可能':'Payment integration');}

    // 6. AI/Autonomous (0-10)
    if(aiAuto&&aiAuto!=='none'&&stack.tags.includes('ai')){score+=10;reasons.push(_ja?'AI/ML統合に最適':'AI/ML integration fit');}

    // 7. Speed bonus (always counted, 0-5)
    score+=stack.speed;

    return {name,score,reasons,stack};
  }

  /* ── Rank all stacks ── */
  const ranked=names.map(n=>scoreStack(n,stacks[n])).sort((a,b)=>b.score-a.score);
  const medals=['🥇','🥈','🥉'];
  const hasAnswers=Object.keys(a).length>2;

  /* ════ RENDER ════ */
  let h=`<div class="exp-header"><h3>⚡ ${_ja?'並列実装探索 — スタック比較':'Parallel Explorer — Stack Comparison'}</h3>
  <p>${_ja?'現在の選択':'Current'}: <strong class="exp-current">${esc(a.frontend||'React + Next.js')} + ${esc(a.backend||'Express')}</strong> — ${_ja?'2つのスタックを比較':'Compare 2 stacks'}</p></div>`;

  /* ── Recommendation Ranking (NEW) ── */
  if(hasAnswers){
    h+=`<div class="exp-ranking"><h4>📊 ${_ja?'あなたへのおすすめ（回答に基づくスコア）':'Recommended for You (Score based on your answers)'}</h4>`;
    ranked.forEach((r,i)=>{
      const medal=i<3?medals[i]:'';
      const isTop=i===0;
      const w=Math.max(8,Math.round(r.score/ranked[0].score*100));
      h+=`<div class="exp-rank-row${isTop?' exp-rank-top':''}" onclick="autoSelectStack('${r.name}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();autoSelectStack('${r.name}');}" role="button" tabindex="0">
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
        h+=`<div class="exp-rank-reasons">${r.reasons.map(r=>`<span class="exp-rank-tag">${r}</span>`).join('')}</div>`;
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
      c+=`</div><div class="exp-verdict"><h4>${_ja?'最適用途':'Best For'}</h4><p>${s.best}</p></div></div>`;
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

/* ── Auto-select stack from ranking click ── */
function autoSelectStack(name){
  const sel=$('expA');if(!sel)return;
  for(let i=0;i<sel.options.length;i++){
    if(sel.options[i].text===name){sel.value=i;break;}
  }
  renderExpCompare();
  $('expCompare').scrollIntoView({behavior:'smooth',block:'nearest'});
}
