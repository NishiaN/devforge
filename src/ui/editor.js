/* ═══ INLINE EDITOR ═══ */
var _editorMatches=[];var _editorMatchIdx=0;
function openEditor(path){
  const content=S.files[path];
  if(!content)return;
  const _ja=S.lang==='ja';
  const isEdited=S.editedFiles&&S.editedFiles[path];
  const prevBody=$('prevBody');
  prevBody.innerHTML=`
    <div class="editor-toolbar">
      <div class="title">📝 ${esc(path)}</div>
      <div class="actions">
        <button class="btn btn-s" onclick="saveEdited('${escAttr(path)}')">💾 ${_ja?'保存':'Save'}</button>
        <button class="btn btn-s" onclick="revertFile('${escAttr(path)}')"${isEdited?'':'disabled'}>↩️ ${_ja?'元に戻す':'Revert'}</button>
        <button class="btn btn-s" onclick="previewFile('${escAttr(path)}')">👁 ${_ja?'プレビュー':'Preview'}</button>
      </div>
    </div>
    <div class="editor-find" id="editorFind" style="display:none" role="search">
      <input id="editorFindInput" type="text" class="editor-find-input" placeholder="${_ja?'検索…':'Search…'}" aria-label="${_ja?'テキスト検索':'Search text'}" oninput="editorSearch(this.value)">
      <span id="editorFindCount" class="editor-find-count">0/0</span>
      <button class="btn btn-xs" onclick="editorFindNav(-1)" aria-label="${_ja?'前へ':'Previous'}">▲</button>
      <button class="btn btn-xs" onclick="editorFindNav(1)" aria-label="${_ja?'次へ':'Next'}">▼</button>
      <button class="btn btn-xs" onclick="editorFindClose()" aria-label="${_ja?'閉じる':'Close'}">✕</button>
    </div>
    <textarea id="editorArea" spellcheck="false" class="editor-area" aria-label="${_ja?'ファイルエディタ':'File Editor'}">${esc(content)}</textarea>`;
  _editorMatches=[];_editorMatchIdx=0;
  const ta=$('editorArea');
  if(ta){
    ta.addEventListener('keydown',e=>{
      if(e.key==='Tab'){e.preventDefault();const s=ta.selectionStart,end=ta.selectionEnd;ta.value=ta.value.substring(0,s)+'  '+ta.value.substring(end);ta.selectionStart=ta.selectionEnd=s+2;}
      if(e.ctrlKey&&e.key==='s'){e.preventDefault();saveEdited(path);}
      if(e.ctrlKey&&e.key==='f'){e.preventDefault();editorFindToggle();}
      if(e.key==='Escape'){editorFindClose();}
    });
  }
}
function editorFindToggle(){
  const bar=$('editorFind');if(!bar)return;
  const visible=bar.style.display!=='none';
  if(visible){editorFindClose();}else{bar.style.display='flex';const inp=$('editorFindInput');if(inp){inp.focus();inp.select();}}
}
function editorFindClose(){
  const bar=$('editorFind');if(bar)bar.style.display='none';
  _editorMatches=[];_editorMatchIdx=0;
  const ta=$('editorArea');if(ta)ta.focus();
}
function editorSearch(term){
  const ta=$('editorArea');const cnt=$('editorFindCount');if(!ta||!cnt)return;
  _editorMatches=[];_editorMatchIdx=0;
  if(!term){cnt.textContent='0/0';return;}
  const text=ta.value;const lterm=term.toLowerCase();let idx=0;
  while(true){const pos=text.toLowerCase().indexOf(lterm,idx);if(pos===-1)break;_editorMatches.push(pos);idx=pos+1;}
  if(_editorMatches.length>0){_editorMatchIdx=0;_editorJumpTo(_editorMatches[0],term.length);}
  cnt.textContent=(_editorMatches.length>0?(_editorMatchIdx+1)+'/':'')+_editorMatches.length;
}
function editorFindNav(dir){
  if(!_editorMatches.length)return;
  _editorMatchIdx=(_editorMatchIdx+dir+_editorMatches.length)%_editorMatches.length;
  const inp=$('editorFindInput');const term=inp?inp.value:'';
  _editorJumpTo(_editorMatches[_editorMatchIdx],term.length);
  const cnt=$('editorFindCount');if(cnt)cnt.textContent=(_editorMatchIdx+1)+'/'+_editorMatches.length;
}
function _editorJumpTo(pos,len){
  const ta=$('editorArea');if(!ta)return;
  ta.focus();ta.setSelectionRange(pos,pos+(len||1));
  const lineH=parseInt(getComputedStyle(ta).lineHeight)||19;
  const linesBefore=ta.value.substring(0,pos).split('\n').length-1;
  ta.scrollTop=Math.max(0,(linesBefore-3)*lineH);
}
function saveEdited(path){
  const _ja=S.lang==='ja';
  const ta=$('editorArea');
  if(!ta)return;
  const newContent=ta.value;
  if(newContent===S.files[path])return toast(_ja?'変更なし':'No changes');
  // Store original if first edit
  if(!S.editedFiles[path])S.editedFiles[path]=S.files[path];
  S.files[path]=newContent;
  save();
  toast(_ja?'✅ 保存しました':'✅ Saved');
  showFileTree();
}
function revertFile(path){
  const _ja=S.lang==='ja';
  if(!S.editedFiles||!S.editedFiles[path])return;
  S.files[path]=S.editedFiles[path];
  delete S.editedFiles[path];
  save();
  toast(_ja?'↩️ 元に戻しました':'↩️ Reverted');
  openEditor(path);
}
