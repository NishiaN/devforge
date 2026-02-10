/* ═══ V9 COMPLEXITY ANALYSIS ═══ */
function getComplexityHTML(){
  const a=S.answers;const _ja=S.lang==='ja';
  const fs=(a.mvp_features||'').split(',').map(s=>s.trim()).filter(Boolean);
  const fCount=fs.length;
  const eCount=((a.data_entities||'').split(',')).filter(Boolean).length;
  const sCount=((a.screens||'').split(',')).filter(Boolean).length;
  const authCount=((a.auth||'').split(',')).filter(Boolean).length;
  const hasTDD=hasDM('TDD')?1:0,hasBDD=hasDM('BDD')?1:0,hasDDD=hasDM('DDD')?1:0;
  const beComplex=(a.backend||'').includes('なし')||(a.backend||'').includes('None')?0:(a.backend||'').includes('Firebase')||(a.backend||'').includes('Supabase')?1:2;
  let score=0;
  score+=Math.min(fCount*8,50);
  score+=Math.min(eCount*3,20);
  score+=Math.min(sCount*2,14);
  score+=authCount*2;
  score+=beComplex*5;
  score+=(hasTDD+hasBDD+hasDDD)*3;
  score=Math.min(score,100);
  const level=score<=30?'low':score<=60?'mid':'high';
  const levelLabel=score<=30?(_ja?'🟢 シンプル':'🟢 Simple'):score<=60?(_ja?'🟡 中規模':'🟡 Medium'):(_ja?'🔴 大規模':'🔴 Large');
  const weeks=score<=30?(_ja?'2-4週':'2-4 wks'):score<=60?(_ja?'1-3ヶ月':'1-3 mo'):(_ja?'3-6ヶ月':'3-6 mo');
  const devs=score<=30?(_ja?'1人':'1'):score<=60?(_ja?'1-2人':'1-2'):(_ja?'2-4人':'2-4');
  const color=score<=30?'var(--success)':score<=60?'var(--warn)':'var(--danger)';
  const _s=_ja?'件':'';
  return `<div class="complexity-card"><div class="complexity-header"><div><div class="dash-total complexity-label">${_ja?'プロジェクト複雑度':'PROJECT COMPLEXITY'}</div><div class="complexity-sub">${levelLabel}</div>
</div><div class="complexity-score ${level}">${score}</div></div><div class="complexity-bar"><div class="complexity-fill" style="width:${score}%;background:${color};"></div></div><div class="complexity-grid"><div class="complexity-item"><span>${_ja?'MVP機能':'MVP Features'}</span>
<span>${fCount}${_s}</span></div><div class="complexity-item"><span>${_ja?'エンティティ':'Entities'}</span><span>${eCount}${_s}</span></div><div class="complexity-item"><span>${_ja?'画面数':'Screens'}</span><span>${sCount}${_s}</span>
</div><div class="complexity-item"><span>${_ja?'認証方式':'Auth Methods'}</span><span>${authCount}${_s}</span></div><div class="complexity-item"><span>${_ja?'推定期間':'Est. Duration'}</span><span>${weeks}</span></div>
<div class="complexity-item"><span>${_ja?'推奨人数':'Team Size'}</span><span>${devs}</span></div></div></div>`;
}
function showComplexity(){
  const body=$('cbody');
  const card=document.createElement('div');
  card.innerHTML=getComplexityHTML();
  body.appendChild(card.firstChild);body.scrollTop=body.scrollHeight;
}
