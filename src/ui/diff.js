/* ═══ DIFF VIEW ═══ */
function lineDiff(oldText,newText){
  const oldL=oldText.split('\n'),newL=newText.split('\n');
  const result=[];
  // Simple LCS-based diff
  const m=oldL.length,n=newL.length;
  const dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
  for(let i=1;i<=m;i++)for(let j=1;j<=n;j++){
    dp[i][j]=oldL[i-1]===newL[j-1]?dp[i-1][j-1]+1:Math.max(dp[i-1][j],dp[i][j-1]);
  }
  // Backtrack
  let i=m,j=n;
  const ops=[];
  while(i>0||j>0){
    if(i>0&&j>0&&oldL[i-1]===newL[j-1]){ops.unshift({type:'same',line:oldL[i-1]});i--;j--;}
    else if(j>0&&(i===0||dp[i][j-1]>=dp[i-1][j])){ops.unshift({type:'add',line:newL[j-1]});j--;}
    else{ops.unshift({type:'del',line:oldL[i-1]});i--;}
  }
  return ops;
}
function showDiff(path){
  const _ja=S.lang==='ja';
  const oldContent=S.prevFiles[path]||S.editedFiles[path];
  const newContent=S.files[path];
  if(!oldContent||!newContent||oldContent===newContent){
    toast(_ja?'差分なし':'No differences');return;
  }
  const diff=lineDiff(oldContent,newContent);
  const adds=diff.filter(d=>d.type==='add').length;
  const dels=diff.filter(d=>d.type==='del').length;
  const same=diff.filter(d=>d.type==='same').length;
  let h=`<div class="diff-header">
    <div class="diff-title">🔀 ${esc(path)}</div>
    <div class="diff-stats">
      <span class="add">+${adds}</span>
      <span class="del">-${dels}</span>
      <span>~${same}</span>
      <button class="btn btn-s" onclick="previewFile('${escAttr(path)}')">✕ ${_ja?'閉じる':'Close'}</button>
    </div>
  </div>`;
  h+='<div class="diff-body">';
  let lineNum=0;
  diff.forEach(d=>{
    if(d.type==='same'){lineNum++;h+=`<div class="diff-same"><span class="diff-ln">${lineNum}</span>${esc(d.line)}</div>`;}
    else if(d.type==='add'){lineNum++;h+=`<div class="diff-add"><span class="diff-ln">+${lineNum}</span>${esc(d.line)}</div>`;}
    else{h+=`<div class="diff-del"><span class="diff-ln">-</span>${esc(d.line)}</div>`;}
  });
  h+='</div>';
  $('prevBody').innerHTML=h;
}
function showDiffView(){
  const _ja=S.lang==='ja';
  const prev=S.prevFiles||{};
  if(!Object.keys(prev).length){
    toast(_ja?'前回生成がありません（再生成後に差分が表示されます）':'No previous generation to compare (regenerate first)');
    return;
  }
  const curr=S.files||{};
  const allPaths=new Set([...Object.keys(prev),...Object.keys(curr)]);
  const changed=[],added=[],removed=[];
  allPaths.forEach(p=>{
    if(!prev[p])added.push(p);
    else if(!curr[p])removed.push(p);
    else if(prev[p]!==curr[p])changed.push(p);
  });
  if(!changed.length&&!added.length&&!removed.length){
    toast(_ja?'差分なし':'No differences');return;
  }
  let h='<div class="diff-header"><div class="diff-title">📊 '+(_ja?'差分サマリー':'Diff Summary')+'</div><div class="diff-stats"><span class="add">+'+added.length+'</span><span class="del">-'+removed.length+'</span><span>~'+changed.length+'</span></div></div>';
  h+='<div class="diff-body" style="padding:12px">';
  if(changed.length){
    h+='<p><strong>✏️ '+(_ja?'変更':'Changed')+' ('+changed.length+')</strong></p>';
    changed.forEach(p=>{h+='<div class="ft-file" style="cursor:pointer;padding:4px 8px" onclick="showDiff(\''+escAttr(p)+'\')">'+esc(p)+'</div>';});
  }
  if(added.length){
    h+='<p><strong>➕ '+(_ja?'追加':'Added')+' ('+added.length+')</strong></p>';
    added.forEach(p=>{h+='<div style="color:var(--success);padding:4px 8px">'+esc(p)+'</div>';});
  }
  if(removed.length){
    h+='<p><strong>➖ '+(_ja?'削除':'Removed')+' ('+removed.length+')</strong></p>';
    removed.forEach(p=>{h+='<div style="color:var(--danger);padding:4px 8px">'+esc(p)+'</div>';});
  }
  h+='</div>';
  $('prevBody').innerHTML=h;
}
function snapshotFiles(){
  S.prevFiles=JSON.parse(JSON.stringify(S.files));
  save();
}
